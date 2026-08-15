import spark103Mark from '/spark103-mark.png';

export function Spark103Watermark() {
  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 2147483646,
        display: "flex",
        alignItems: "center",
        gap: 8,
        maxWidth: "min(280px, calc(100vw - 24px))",
        padding: "7px 12px",
        borderRadius: 999,
        background: "rgba(5, 5, 8, 0.86)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        color: "rgba(255, 255, 255, 0.9)",
        fontFamily: 'system-ui, "Segoe UI", sans-serif',
        fontSize: 11,
        lineHeight: 1.3,
        pointerEvents: "none",
        boxShadow: "0 0 18px rgba(255, 0, 255, 0.16)",
      }}
    >
      <img
        src={spark103Mark}
        alt=""
        width={28}
        height={28}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          objectFit: "cover",
          objectPosition: "center 18%",
          flexShrink: 0,
        }}
      />
      <span>
        <strong style={{ display: "block", letterSpacing: "0.12em", fontSize: 10 }}>
          SPARK103
        </strong>
        <span style={{ display: "block", opacity: 0.72 }}>
          A product of 103 Software Solutions LLC
        </span>
      </span>
    </div>
  );
}
