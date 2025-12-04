// client/src/components/FaviconManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SISTEMA UNIVERSAL DE FAVICON
 *
 * - Todas as rotas usam o favicon padrão (favicon.ico)
 * - Campo comentado mostrando como adicionar ícones por rota futuramente
 */

export default function FaviconManager({
  defaultIcon = "/favicon.ico",
  routeIcons = {}, // opcional (comentado no App.js)
}) {
  const location = useLocation();

  useEffect(() => {
    let chosenIcon = defaultIcon;

    // FUTURO: sistema de ícones por rota (descomentável)
    if (routeIcons[location.pathname]) {
      chosenIcon = routeIcons[location.pathname];
    }

    // Atualiza o favicon no <head>
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = chosenIcon;
  }, [location.pathname, defaultIcon, routeIcons]);

  return null;
}
