import { useCallback, useEffect } from 'react';
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
  { id: '2', data: { label: 'Node 2' }, position: { x: 250, y: 125 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

// fitView method is extracted to a seperate component as reactFlowInstance can be accessed only by child elements of ReactFlowProvider.
function FitView() {
  const reactFlowInstance = useReactFlow();
  useEffect(() => {
    reactFlowInstance.fitView();
  });
}

export default function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

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
      <h1 onKeyDown={handleKeyDown} tabIndex={1}>
        Welcome to Fast Flow
      </h1>
      <ReactFlowProvider>
        <ReactFlow
          id='flow'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        />
        <FitView />
      </ReactFlowProvider>
    </div>
  );
}
