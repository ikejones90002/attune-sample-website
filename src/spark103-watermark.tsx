export function Spark103Watermark() {
  return (
    <a
      href="https://spark103.dev"
      target="_blank"
      rel="noopener noreferrer"
      className="spark103-badge"
      aria-label="Made with SPARK103"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '999px',
        background: 'rgba(0,0,0,0.85)',
        textDecoration: 'none',
        zIndex: 9999,
      }}
    >
      <img
        src="https://spark103.dev/assets/brand/spark103-logo.png"
        alt=""
        width="16"
        height="16"
        style={{ borderRadius: '50%' }}
      />
      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
        Made with SPARK103
      </span>
    </a>
  );
}
