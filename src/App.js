import { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
} from 'react-flow-renderer';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: `Node 1` },
    position: { x: 250, y: 25 },
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

// fitView method is extracted to a seperate component as reactFlowInstance can be accessed only by child elements of ReactFlowProvider.
function FitView() {
  const reactFlowInstance = useReactFlow();
  useEffect(() => {
    reactFlowInstance.fitView();
  });
}

// Default Export
export default function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // Create nodes using keyboard - done
  // Edit nodes using keyboard - to do

  // Create mode is default on page load. The mode switches to edit when the user adds a node. This allows the user to change the label of the current node. The user can now press Enter to switch back to create mode and press a/s/d to create a new node.

  // Press 'i' to change the label of the node. Press 'Enter' to finish label and go back to creating nodes.
  // - Press 'i' to show or hide the input field - done
  // Press 'Enter' while input field is active to complete editing - done
  // Press 'i' to change the label of the latest node

  const [nodeLabel, setNodeLabel] = useState('Edit');

  useEffect(() => {
    setNodes((n) =>
      n.map((node) => {
        const currentNodeId = n[n.length - 1].id;
        console.log(currentNodeId);
        if (node.id === currentNodeId) {
          node.data = {
            ...node.data,
            label: nodeLabel,
          };
        }
        return node;
      })
    );
  }, [nodeLabel, setNodes]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const reactFlowRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    reactFlowRef.current.focus();
  }, [reactFlowRef]);

  function addNode(key) {
    setNodes((n) => {
      const newId = String(Number(n[n.length - 1].id) + 1);
      const newYPosition = n[n.length - 1].position.y + 100;
      const oldXPosition = n[n.length - 1].position.x;
      let newXPosition = null;
      if (key === 's') {
        newXPosition = oldXPosition;
      } else if (key === 'd') {
        newXPosition = oldXPosition + 150;
      } else if (key === 'a') {
        newXPosition = oldXPosition - 150;
      }
      return [
        ...n,
        {
          id: newId,
          data: { label: `Node ${newId}` },
          position: { x: newXPosition, y: newYPosition },
        },
      ];
    });
  }

  function addEdge() {
    setEdges((e) => {
      const newSource = String(Number(e[e.length - 1].source) + 1);
      const newTarget = String(Number(e[e.length - 1].target) + 1);
      const newId = `e${newSource}-${newTarget}`;
      return [...e, { id: newId, source: newSource, target: newTarget }];
    });
  }

  function enableInputMode() {
    inputRef.current.hidden = false;
    inputRef.current.focus();
  }

  function enableCreateMode(e) {
    if (e.key === 'Enter') {
      inputRef.current.hidden = true;
      reactFlowRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 's' || e.key === 'd' || e.key === 'a') {
      addNode(e.key);
      addEdge();
    } else if (e.key === 'i') {
      enableInputMode();
    }
  }

  return (
    <div id='app'>
      <ReactFlowProvider>
        <ReactFlow
          id='flow'
          ref={reactFlowRef}
          onKeyDown={handleKeyDown}
          tabIndex={1}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
        </ReactFlow>
        <FitView />
        <div id='input-cont'>
          <input
            id='input'
            ref={inputRef}
            type='text'
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            onKeyDown={enableCreateMode}
            hidden
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}
