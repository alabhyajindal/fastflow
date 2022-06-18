import { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import User from './User';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'First Node' },
    position: { x: 250, y: 25 },
  },
  { id: '2', data: { label: 'Second Node' }, position: { x: 250, y: 125 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

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

  window.addEventListener('keydown', (e) => {
    handleKeyDown(e.key);
  });

  function handleKeyDown(key) {
    if (key === 's') {
      // add a node below and connect it with previous node
    }
  }

  return (
    <div id='app'>
      <h1>Welcome to Fast Flow</h1>
      <ReactFlowProvider>
        <ReactFlow
          id='flow'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        />
        <User />
      </ReactFlowProvider>
    </div>
  );
}
