import { Link } from 'react-router-dom';

export default function Guide() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const link = document.getElementById('link-to-flow');
      if (link) link.click();
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
        It has two modes - the default <em>Create Mode</em> and an{' '}
        <em>Edit Mode</em>.
      </p>
      <p>
        Create Mode allows you to create nodes and add labels to them. Following
        actions are available in this Mode:
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
        you are done. You can toggle between the two modes by pressing the{' '}
        <strong>Esc</strong> key.
      </p>

      <p>Following actions are available in the Edit Mode:</p>
      <ul>
        <li>
          <strong>Tab</strong> - Toggle between the boxes
        </li>
        <li>
          <strong>Enter</strong> - Edit the label of a box
        </li>
      </ul>
      <p>
        Once you are done editing the label of a box, you can press{' '}
        <strong>Enter</strong> to confirm.
      </p>
      <br />
      <h3>
        Press <strong id='enter'>Enter</strong> to begin.
      </h3>
      <Link id='link-to-flow' to='/flow'>
        Flow
      </Link>
    </div>
  );
}
