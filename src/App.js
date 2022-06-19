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
  {
    id: '2',
    data: { label: `Node 2` },
    position: { x: 250, y: 125 },
    style: nodeStyle,
  },
  {
    id: '3',
    data: { label: `Node 3` },
    position: { x: 450, y: 125 },
    style: nodeStyle,
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
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

  const [nodeLabel, setNodeLabel] = useState('Untitled');
  const [justSwitched, setJustSwitched] = useState(false);
  const [mode, setMode] = useState('Edit');
  const [toggleCount, setToggleCount] = useState(0);

  const reactFlowRef = useRef(null);
  const inputRef = useRef(null);

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

  // Put the focus on the input field when the page loads (enabling user to control the label of the first node)
  useEffect(() => {
    if (mode === 'Create') {
      inputRef.current.hidden = false;
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      enableCreateMode(); // change the function name
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
    if (
      (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') &&
      mode === 'Create'
    ) {
      addNode(e.key);
      addEdge();
      enableInputMode();
    } else if (e.key === 'Escape') {
      mode === 'Create' ? setMode('Edit') : setMode('Create');
    } else if (e.key === 't' && mode === 'Edit') {
      toggleNodes();
    }
    // enableInputMode (if e.key === 'Enter') reference for later
  }

  function toggleNodes() {
    if (toggleCount === nodes.length - 1) {
      setToggleCount(0);
    }

    const selectedNodeId = nodes[toggleCount].id;
    const selectedNodeIdStyle = {
      background: '#94a3b8  ',
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
  }

  // Wire up the Edit and Create Mode
  // Test the app
  // Deploy to Vercel
  // Create the modal for user onbaording

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

// Adding a featute which enables users to go back to a node to edit the text is important. The question is when to insert this mode into the app which allows this. The current flow looks like this:
// 1. Add the label of the first node
// 2. Create a node below or to the sides
// 3. Add the label of the newly created node
// 4. Go back to 2

// Right now the user has no way of editing the label once they press 'Enter'. I could add a feature which allows users to press 'i' - this selects the latest node, the node which they pressed enter on and allows them to edit it back again. But I think this is not going to provide the most benefit. The user can be careful when the press 'Enter'. - this is taken care of by the Edit Mode.

// Adding a feature which allows users to navigate the nodes once they have creaetd it fully and edit it will be the most benefecial. This means creating a Navigation mode. Once the user is happy with the structure of the flowchart - they can enter Navigation mode using the 'Escape' key. This allows users to navigate the board using the familiar keys which they used for board creation. The selected node's boundry will get highlighted as the user navigates. Once the user reaches a node where they want to make a change - they can press enter. This will popup the Input field allowing users to edit the label. User presses Enter and the label is completed. The focus goes back to node where the correction was just made, indicating that the user can correct more nodes if needed. Press 'Escape' to go back to Create mode to add nodes.

// Small p tag in the bottom left corner indicating which mode the user is currently in would be great. - done
