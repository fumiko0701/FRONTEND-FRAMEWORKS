import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    document.title = "Ferret's Home";
  } , []);
  return (
    <div style={{ padding: 20 }}>
      <h1>Bem-vindo ao sistema de eventos!</h1>
      <p>Use o menu acima para navegar.</p>
    </div>
  );
}
