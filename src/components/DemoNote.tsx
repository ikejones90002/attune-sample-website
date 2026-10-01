export function DemoNote({ text }: { text: string }) {
  return (
    <p className="demo-note" role="note">
      {text}
    </p>
  );
}
