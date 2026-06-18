export default function ExplanationPanel({ explanations, pattern }) {
  if (!pattern) {
    return (
      <div className="explanation-panel empty" id="explanation-panel">
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <p>Explanation</p>
          <p className="empty-hint">Type a regex pattern to see a plain-English breakdown.</p>
        </div>
      </div>
    );
  }

  if (!explanations || explanations.length === 0) {
    return (
      <div className="explanation-panel" id="explanation-panel">
        <h3>Explanation</h3>
        <p className="empty-hint">No tokens to explain.</p>
      </div>
    );
  }

  return (
    <div className="explanation-panel" id="explanation-panel">
      <h3>Explanation</h3>
      <ol className="explanation-list">
        {explanations.map((step, i) => (
          <li key={i} className="explanation-step">
            <span className="step-number">{i + 1}</span>
            <span className="step-text">{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
