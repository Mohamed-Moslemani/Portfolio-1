import Container from "./Container";

export default function Section({ children }) {
  return (
    <section>
      <Container>{children}</Container>
    </section>
  );
}
