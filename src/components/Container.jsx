export default function Container({ children }) {
  return (
    <div style={{
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }}>
      {children}
    </div>
  );
}
