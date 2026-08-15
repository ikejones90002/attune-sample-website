import React from 'react';
import './Accessibility.css';

function Accessibility() {
  return (
    <div className="accessibility-page">
      <header className="page-header">
        <h2>
          Accessibility-First Design
        </h2>
        <p className="page-subtitle">
          Committed to a screen-reader-native UI in every component. 
          Below are our core principles and practices ensuring accessibility across the platform.
        </p>
      </header>

      <section className="principles">
        <h3>Core Principles</h3>
        <ul>
          <li>
            Every interactive element gets proper ARIA roles and properties, ensuring that screen readers can effectively communicate its purpose to users.
          </li>
          <li>
            Use semantic HTML elements (e.g., <strong>header</strong>, <strong>main</strong>, <strong>footer</strong>) to reinforce document structure and afford better accessibility.
          </li>
          <li>
            Design for keyboard navigation; ensure all functionality is accessible via keyboard alone, without the need for a mouse.
          </li>
          <li>
            Provide descriptive alternative text for all images, icons, and multimedia elements to assist users relying on screen readers.
          </li>
          <li>
            Color choices and contrasts meet WCAG AAA standards to ensure readability for low-vision users.
          </li>
        </ul>
      </section>

      <section className="implementation">
        <h3>Implementation Across the App</h3>
        <p>
          Across our application, we ensure:
        </p>
        <ul>
          <li>Custom components such as buttons, cards, and inputs are built with accessibility from day one, not retrofitted.
          </li>
          <li>Consistent and prominent focus indicators are present, allowing users to easily understand which element is currently in focus.</li>
          <li>Content structure follows a logical flow, using headings properly to maintain the user's sense of context and navigation.
          </li>
          <li>Feedback is provided on interactive elements upon hover, focus, and active states.
          </li>
        </ul>
      </section>

      <section className="testing">
        <h3>Testing and Feedback</h3>
        <p>
          We conduct rigorous testing with actual users with disabilities and gather their feedback. 
          Iterative changes are made to improve navigability and user experience before release.
        </p>
      </section>
    </div>
  );
}

export default Accessibility;