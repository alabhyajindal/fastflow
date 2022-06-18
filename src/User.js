import { useEffect } from 'react';
import { useReactFlow } from 'react-flow-renderer';

export default function User() {
  const reactFlowInstance = useReactFlow();
  useEffect(() => {
    console.log(reactFlowInstance);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'o') reactFlowInstance.fitView();
  });

  return (
    <div>
      <h3>All controls come here</h3>
    </div>
  );
}
