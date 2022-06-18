import { useCallback, useState, useEffect } from 'react';
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
    data: { label: 'First Node' },
    position: { x: 250, y: 25 },
  },
  { id: '2', data: { label: 'Second Node' }, position: { x: 250, y: 125 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Controls() {
  const reactFlowInstance = useReactFlow();

  function handleKeyDown(e) {
    if (e.key === 's') {
      reactFlowInstance.addNodes({
        id: '3',
        width: 150,
        height: 38,
        data: { label: 'Third Node' },
        position: { x: 250, y: 225 },
      });
      // console.log(reactFlowInstance.getNodes());
      reactFlowInstance.addEdges({ id: 'e2-3', source: '2', target: '3' });
      reactFlowInstance.fitView();
    }
    if (e.key === 'q') {
      console.log(reactFlowInstance.getNodes());
      reactFlowInstance.fitView();
    }
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <p>
        Fast Flow allows you to create flow charts at the speed of your thought.
        Click here to get started.
      </p>
    </div>
  );
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
        <Controls />
      </ReactFlowProvider>
    </div>
  );
}
