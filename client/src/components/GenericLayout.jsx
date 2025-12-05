import React from "react";

export default function GenericLayout({ left, center, right, children }) {
  // allow usage either by passing `center` prop or children inside the component
  const centerContent = center ?? children;

  return (
    <div style={styles.container}>
      {left && <aside style={styles.left}>{left}</aside>}
      {centerContent && <main style={styles.center}>{centerContent}</main>}
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
