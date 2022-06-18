import { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  useReactFlow,
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
    console.log('fitView ran');
  });
}

// Default Export
export default function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // Create nodes using keyboard - done
  // Edit nodes using keyboard - to do

  // Create mode is default on page load. The mode switches to edit as soon as the user adds a node. This focuses the current node and allows user to change label of the current node. The user can now press Enter to switch back to create mode and press a/s/d to create a new node.

  // A popup input window can be opened after pressing s and then closed after the user presses Enter

  const [nodeLabel, setNodeLabel] = useState('Edit');

  useEffect(() => {
    setNodes((n) =>
      n.map((node) => {
        if (node.id === '1') {
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

  useEffect(() => {
    reactFlowRef.current.focus();
  }, [reactFlowRef]);

  function addNode(key) {
    if (key === 's' || key === 'd' || key === 'a')
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

  function handleKeyDown(e) {
    addNode(e.key);
    addEdge();
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
        />
        <FitView />
        <div id='input-cont'>
          <input
            id='input'
            type='text'
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}
