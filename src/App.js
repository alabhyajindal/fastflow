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

const nodeStyle = { background: '#cbd5e1', color: '#1e293b' };

const initialNodes = [
  {
    id: '1',
    data: { label: `Node 1` },
    position: { x: 250, y: 25 },
    style: nodeStyle,
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

  const [nodeLabel, setNodeLabel] = useState('Start Typing');
  const [justSwitched, setJustSwitched] = useState(false);
  const [mode, setMode] = useState('Create');
  const [toggleCount, setToggleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const reactFlowRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (mode === 'Create') {
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
    }
  }, [nodeLabel, setNodes]);

  useEffect(() => {
    if (mode === 'Edit' && isActive) {
      setNodes((n) =>
        n.map((node) => {
          const currentNodeId = node.style.background === '#94a3b8' && node.id;
          // This is working. But it is changing the label of the other nodes also when toggleNodes is run.

          if (node.id === currentNodeId) {
            node.data = {
              ...node.data,
              label: nodeLabel,
            };
          }
          return node;
        })
      );
    }
  }, [nodeLabel, toggleCount]);

  // Put the focus on the input field when the page loads (enabling user to control the label of the first node)
  useEffect(() => {
    focusOnReactFlow();
    if (mode === 'Create' && nodes.length === 1) {
      inputRef.current.hidden = false;
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [mode, inputRef, reactFlowRef]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // Determine node's position based on the key and add it to the state
  function addNode(key) {
    setNodes((n) => {
      let newId = String(Number(n[n.length - 1].id) + 1);
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
          style: nodeStyle,
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

  function focusOnInput() {
    setJustSwitched(true);
    inputRef.current.hidden = false;
    inputRef.current.focus();
    setNodeLabel('');
    setTimeout(() => {
      setJustSwitched(false);
    }, 50);
  }

  function focusOnReactFlow() {
    inputRef.current.hidden = true;
    reactFlowRef.current.focus();
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') focusOnReactFlow();
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

  function handleFlowKeyDown(e) {
    if (
      (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') &&
      mode === 'Create'
    ) {
      addNode(e.key);
      addEdge();
      focusOnInput();
    } else if (e.key === 'Escape') {
      resetNodeColors();
      setToggleCount(0);
      focusOnReactFlow();
      mode === 'Create' ? setMode('Edit') : setMode('Create');
    } else if (e.key === 'Tab' && mode === 'Edit') {
      e.preventDefault();
      toggleNodes();
    } else if (e.key === 'Enter' && mode === 'Edit') {
      focusOnInput();
      setIsActive(true);
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  }

  function toggleNodes() {
    if (toggleCount === nodes.length - 1) {
      setToggleCount(0);
    }

    const selectedNodeId = nodes[toggleCount].id;
    const selectedNodeIdStyle = {
      background: '#94a3b8',
      color: '#1e293b',
    };

    setNodes((n) =>
      n.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, style: selectedNodeIdStyle };
        }
        return { ...node, style: nodeStyle };
      })
    );

    if (toggleCount < nodes.length - 1) setToggleCount((t) => t + 1);
    setIsActive(false);
  }

  function resetNodeColors() {
    setNodes((n) =>
      n.map((node) => {
        return { ...node, style: nodeStyle };
      })
    );
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
        <p id='mode'>{mode} Mode</p>
      </ReactFlowProvider>
    </div>
  );
}
