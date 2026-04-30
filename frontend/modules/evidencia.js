/**
 * Módulo Repositorio de Evidencia — Filtros y grid de evidencias.
 */
// Add the final redirect URLs here. Replace each "#evidencia" with the destination link.
const evidenceEntryLinks = [
    { title: 'Comunidad de Práctica', href: 'https://experience.arcgis.com/experience/7f1f2abe7d874cbabf720e371ed8d87f/page/Inicio?draft=true&views=Comunidad-de-pr%C3%A1cticas' },
    { title: 'Voces del Territorio', href: 'https://experience.arcgis.com/experience/7f1f2abe7d874cbabf720e371ed8d87f/page/Inicio?draft=true&views=Voces-del-territorio' },
    { title: 'Galería y Noticias', href: 'https://experience.arcgis.com/experience/7f1f2abe7d874cbabf720e371ed8d87f/page/Inicio?draft=true&views=Galer%C3%ADa-y-noticias' },
    { title: 'Mapa Interactivo', href: 'https://experience.arcgis.com/experience/7f1f2abe7d874cbabf720e371ed8d87f/page/Mapa-interactivo?draft=true&views=Acerca-del-proyecto' },
];

registerModule('evidencia', (container) => {
    container.innerHTML = `
        <h2 class="section-title">Repositorio de Evidencia</h2>
        <div class="evidence-entry-grid" aria-label="Accesos destacados de evidencia">
            ${evidenceEntryLinks.map(link => `
                <a class="evidence-entry-card" href="${link.href}">
                    <span class="evidence-entry-title">${link.title}</span>
                    <span class="evidence-entry-action">Abrir</span>
                </a>
            `).join('')}
        </div>`;
});
