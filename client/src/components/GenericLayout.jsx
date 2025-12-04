import React from "react";

export default function GenericLayout({ left, center, right }) {
  return (
    <div style={styles.container}>
      {left && <aside style={styles.left}>{left}</aside>}
      {center && <main style={styles.center}>{center}</main>}
      {right && <aside style={styles.right}>{right}</aside>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    flexWrap: "wrap",
  },
  left: {
    flex: "1 1 250px",
    minWidth: "220px",
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  center: {
    flex: "2 1 500px",
    minWidth: "300px",
  },
  right: {
    flex: "1 1 250px",
    minWidth: "220px",
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};
