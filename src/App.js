import { useState } from 'react';
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  { id: '2', data: { label: 'Default Node' }, position: { x: 250, y: 125 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  function createNode() {
    setNodes((n) => {
      return [
        ...n,
        {
          id: '3',
          data: { label: 'Third Node' },
          position: { x: 250, y: 225 },
        },
      ];
    });
  }

  function createEdge() {
    setEdges((e) => {
      return [...e, { id: 'e2-3', source: '2', target: '3' }];
    });
  }

  window.addEventListener('keydown', (e) => {
    handleKeyDown(e.key);
  });

  function handleKeyDown(key) {
    if (key === 's') {
      createNode();
      createEdge();
    }
  }

  return (
    <div id='app'>
      <h1>Welcome to Fast Flow</h1>
      <ReactFlowProvider>
        <ReactFlow id='flow' nodes={nodes} edges={edges} fitView />
      </ReactFlowProvider>
    </div>
  );
}
