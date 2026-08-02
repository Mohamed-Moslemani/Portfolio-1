/**
 * Renders a claimed outcome as a measurement: mono figure, unit, caption, and
 * — only where the number is genuinely a proportion — a meter filled to that
 * proportion. Nothing here is interpolated or invented; a metric without a
 * meaningful denominator simply renders without a bar.
 */
export default function MetricReadout({ metrics = [] }) {
  if (!metrics.length) return null;

  return (
    <dl className="metrics">
      {metrics.map((m) => (
        <div className="metric" key={m.label}>
          <dt className="metric-label label">{m.label}</dt>
          <dd className="metric-body">
            <span className="metric-value num">
              {m.value}
              {m.unit && <span className="metric-unit">{m.unit}</span>}
            </span>
            {typeof m.ratio === "number" && (
              <span
                className="metric-meter"
                role="meter"
                aria-valuenow={Math.round(m.ratio * 100)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={m.label}
              >
                <span
                  className="metric-meter-fill"
                  style={{ inlineSize: `${Math.min(100, m.ratio * 100)}%` }}
                />
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
