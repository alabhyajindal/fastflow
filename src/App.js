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

  function addNode(key) {
    // We want to determine the position of X based on the current node which is selected (or the latest node). When we press d on a node which already on the right side - then the new node should be created on the further right - not below it. Similarly, when we press s on a node which is to the side then this newly created node should be created at the bottom of the current node - not to the center.
    let newXPosition = null;
    if (key === 's') {
      newXPosition = 250;
    } else if (key === 'd') {
      newXPosition = 400;
    }
    newXPosition &&
      setNodes((n) => {
        const newId = String(Number(n[n.length - 1].id) + 1);
        const newYPosition = n[n.length - 1].position.y + 100;
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
    // Pass e.key to addNode. addNode then determines the position of the newly created node based on e.key using if statements
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
