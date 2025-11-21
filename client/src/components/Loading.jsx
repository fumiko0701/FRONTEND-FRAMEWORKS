// client/src/components/Loading.jsx
import React, { useEffect, useState } from "react";
import "../styles/loading.css";

export default function Loading({ active }) {
  const [mustShow, setMustShow] = useState(false);

  useEffect(() => {
    let timer;

    if (active) {
      setMustShow(true);
    } else {
      timer = setTimeout(() => {
        setMustShow(false);
      }, 2300); // mantém o tempo para 1 ciclo completo
    }

    return () => clearTimeout(timer);
  }, [active]);

  if (!mustShow) return null;

  return (
    <div className={`loading-overlay ${active ? "fade-in" : "fade-out"}`}>
      <img
        src="/ferret_circle.png"
        alt="loading"
        className={`loading-icon ${active ? "scale-in" : "scale-out"}`}
      />
    </div>
  );
}
