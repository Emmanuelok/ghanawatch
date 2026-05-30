"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0b0f", color: "#e8eaf0", fontFamily: "system-ui, sans-serif", minHeight: "100vh", display: "grid", placeItems: "center", margin: 0 }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 460 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280" }}>
            GhanaWatch
          </div>
          <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 600 }}>Critical error</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#9aa0b0" }}>
            The application encountered an unexpected error. Please reload.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 11, color: "#6b7280" }}>Reference: {error.digest}</p>
          )}
          <button
            onClick={reset}
            style={{ marginTop: 24, background: "#f5b800", color: "#0a0b0f", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 600, cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
