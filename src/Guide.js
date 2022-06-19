import { Link } from 'react-router-dom';

export default function Guide() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('link-to-create').click();
    }
  });

  return (
    <div id='guide-main'>
      <h1>Welcome to Fast Flow</h1>
      <p>
        Fast Flow is a fast, new way to create flow charts using only your
        keyboard. This will allow you to create flow charts at the speed of your
        thought.
      </p>
      <p>
        Fast Flow has two modes - the default <em>Create Mode</em> and an{' '}
        <em>Edit Mode</em>.
      </p>
      <p>
        Press <strong>Enter</strong> to begin creating a Flow
      </p>
      <Link id='link-to-create' to='/create'>
        Create
      </Link>
    </div>
  );
}
