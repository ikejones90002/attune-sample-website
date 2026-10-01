export function Avatar({
  name,
  gradient,
  size = 64,
}: {
  name: string;
  gradient: [string, string];
  size?: number;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className="avatar"
      role="img"
      aria-label={`${name}'s avatar`}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.38}px`,
      }}
    >
      {initials}
    </div>
  );
}
