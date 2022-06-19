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
    data: { label: `Node 1` },
    position: { x: 250, y: 25 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
];

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

  // Press 'i' to change the label of the node. Press 'Enter' to finish and go back to creating nodes - done
  // Press 'i' to show or hide the input field - done
  // Press 'Enter' while input field is active to complete editing - done
  // Press 'i' to change the label of the latest node - done
  // automatically switch to input mode after node creation - done
  // put the focus on the label of the first node on page load - done
  // initial keydonw of (a/s/d) are recorded when changing the label - done

  const [nodeLabel, setNodeLabel] = useState('Untitled');
  const [justSwitched, setJustSwitched] = useState(false);

  useEffect(() => {
    setNodes((n) =>
      n.map((node) => {
        const currentNodeId = n[n.length - 1].id;
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

  // Put the focus on the input field when the page loads (enabling user to control the label of the first node)
  useEffect(() => {
    inputRef.current.hidden = false;
    inputRef.current.focus();
    inputRef.current.select();
  }, [inputRef]);

  // Determine node's position based on the key and add it to the state
  function addNode(key) {
    setNodes((n) => {
      const newId = String(Number(n[n.length - 1].id) + 1);
      const oldXPosition = n[n.length - 1].position.x;
      const oldYPosition = n[n.length - 1].position.y;
      let newXPosition = null;
      let newYPosition = null;
      if (key === 's') {
        newXPosition = oldXPosition;
        newYPosition = oldYPosition + 100;
      } else if (key === 'w') {
        newXPosition = oldXPosition;
        newYPosition = oldYPosition - 100;
      } else if (key === 'd') {
        newXPosition = oldXPosition + 200;
        newYPosition = oldYPosition;
      } else if (key === 'a') {
        newXPosition = oldXPosition - 200;
        newYPosition = oldYPosition;
      }
      return [
        ...n,
        {
          id: newId,
          data: { label: `` },
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
      return [
        ...e,
        { id: newId, source: newSource, target: newTarget, type: 'smoothstep' },
      ];
    });
  }

  function enableInputMode() {
    setJustSwitched(true);
    inputRef.current.hidden = false;
    inputRef.current.focus();
    setNodeLabel('');
    setTimeout(() => {
      setJustSwitched(false);
    }, 50);
  }

  function enableCreateMode() {
    inputRef.current.hidden = true;
    reactFlowRef.current.focus();
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') enableCreateMode();
  }

  function handleInputChange(e) {
    setNodeLabel(e.target.value);
    // Used to set the input value to '' right after user creates a new node
    if (
      (e.target.value === 'w' ||
        e.target.value === 'a' ||
        e.target.value === 's' ||
        e.target.value === 'd') &&
      justSwitched
    ) {
      setNodeLabel('');
    }
  }

  // Used to create a node and switch to input mode immediately
  function handleFlowKeyDown(e) {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      addNode(e.key);
      addEdge();
      enableInputMode();
    }
  }

  return (
    <div id='app'>
      <ReactFlowProvider>
        <ReactFlow
          id='flow'
          ref={reactFlowRef}
          onKeyDown={handleFlowKeyDown}
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
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            hidden
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}
