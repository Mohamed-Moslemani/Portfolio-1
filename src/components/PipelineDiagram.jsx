/**
 * A service description tells you what someone says they do. A pipeline
 * tells you whether they have actually built one. Renders the stage graph
 * for a service as hairline nodes joined by directed connectors.
 */
export default function PipelineDiagram({ stages = [] }) {
  if (!stages.length) return null;

  return (
    <div className="pipeline" role="img" aria-label={`Pipeline: ${stages.join(" then ")}`}>
      {stages.map((stage, i) => (
        <div className="pipeline-step" key={stage}>
          <span className="pipeline-node mono">{stage}</span>
          {i < stages.length - 1 && (
            <svg
              className="pipeline-arrow"
              width="14"
              height="8"
              viewBox="0 0 14 8"
              aria-hidden="true"
            >
              <path d="M0 4 H10" />
              <path d="M8.5 1.5 L11.5 4 L8.5 6.5" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
