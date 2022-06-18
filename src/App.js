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

  // Programmatically generate id of the new nodes based on the current node list
  function addNode() {
    setNodes((n) => {
      const newId = String(Number(n[n.length - 1].id) + 1);
      const newYPosition = n[n.length - 1].position.y + 100;
      console.log(newYPosition);
      return [
        ...n,
        {
          id: newId,
          data: { label: `Node ${newId}` },
          position: { x: 250, y: newYPosition },
        },
      ];
    });
  }

  function addEdge() {
    setEdges((e) => {
      return [...e, { id: 'e2-3', source: '2', target: '3' }];
    });
  }

  function handleKeyDown(e) {
    if (e.key === 's') {
      addNode();
      // addEdge();
    }
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
