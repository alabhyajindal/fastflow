import { Link } from 'react-router-dom';

export default function Guide() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('link-to-flow').click();
    }
  });

  return (
    <div id='guide-main'>
      <h1>
        Welcome to <span id='fast-flow-h1'>Fast Flow</span>
      </h1>
      <p>
        Fast Flow is a new way to create flow charts using only your keyboard.
      </p>
      <p>
        Fast Flow has two modes - the default <em>Create Mode</em> and an{' '}
        <em>Edit Mode</em>.
      </p>
      <p>
        You will spend most of your time in the Create Mode. This allows to
        create nodes and add labels to them. Following are the controls:
      </p>
      <ul>
        <li>
          <strong>s</strong> - Add a box below
        </li>
        <li>
          <strong>w</strong> - Add a box above
        </li>
        <li>
          <strong>a</strong> - Add a box to the left
        </li>
        <li>
          <strong>d</strong> - Add a box to the right
        </li>
      </ul>
      <p>
        Create Mode automatically selects all newly created box for you to enter
        the label. Type the label name, and press <strong>Enter</strong> when
        you are done.
      </p>

      <p>
        You can switch to the Edit Mode by pressing the <strong>Esc</strong>{' '}
        key. Following are the controls for the Edit Mode:
      </p>
      <ul>
        <li>
          <strong>Tab</strong> - Toggle between the boxes
        </li>
        <li>
          <strong>Enter</strong> - Select the label of the box
        </li>
      </ul>
      <p>
        Once the box is selected, you can press <strong>Enter</strong> to
        confirm. Press <strong>Esc</strong> to switch back to Create Mode.
      </p>
      <br />
      <h3>
        Press <strong>Enter</strong> to begin a Flow
      </h3>
      <Link id='link-to-flow' to='/flow'>
        Flow
      </Link>
    </div>
  );
}
