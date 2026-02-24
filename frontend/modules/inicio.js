/**
 * Módulo Inicio — Página de bienvenida con descripción del sistema MEL.
 */
registerModule('inicio', async (container, filters) => {
    try {
        const resumen = await api.resumen();

        container.innerHTML = `
        <div class="intro-hero">
            <h2 class="intro-title">Sistema de Monitoreo, Evaluación y Aprendizaje</h2>
            <p class="intro-subtitle">Proyecto PARES</p>
        </div>

        <div class="intro-description card">
            <p>El Sistema de Monitoreo, Evaluación y Aprendizaje (MEL) del Proyecto PARES está diseñado para funcionar con un <strong>enfoque de intervención adaptativa</strong> que prioriza la captura de aprendizajes significativos y la generación de evidencia útil para la mejora continua y la toma de decisiones estratégicas.</p>
            <p style="margin-top:0.8rem;color:var(--text-light);font-size:0.9rem">Su funcionamiento se articula en torno a los siguientes elementos clave:</p>
        </div>

        <div class="intro-pillars">
            <div class="card intro-pillar">
                <h3 class="pillar-title">Lógica de Intervención</h3>
                <div class="pillar-body">
                    <div class="pillar-item">
                        <strong>Enfoque Adaptativo:</strong> La lógica del sistema va más allá del cumplimiento de metas de ejecución, buscando comprender cómo se generan cambios relevantes en la resiliencia climática, la cohesión social y la paz.
                    </div>
                    <div class="pillar-item">
                        <strong>Principios Guía:</strong> Se basa en los principios fundamentales del proyecto: justicia, interseccionalidad, co-desarrollo, flexibilidad y sensibilidad al conflicto.
                    </div>
                    <div class="pillar-item">
                        <strong>Teoría de Cambio:</strong> Se asume que el fortalecimiento de las capacidades técnicas e institucionales de las comunidades para planificar e implementar intervenciones con un enfoque sensible al nexo paz–seguridad–cambio climático las preparará mejor para anticipar riesgos, fortalecer la cohesión y construir soluciones sostenibles.
                    </div>
                </div>
            </div>
        </div>

        <div class="intro-stats">
            <div class="intro-stat card">
                <div class="intro-stat-value">${resumen.total_mediciones || 0}</div>
                <div class="intro-stat-label">Mediciones</div>
            </div>
            <div class="intro-stat card">
                <div class="intro-stat-value">${resumen.total_evidencias || 0}</div>
                <div class="intro-stat-label">Evidencias</div>
            </div>
            <div class="intro-stat card">
                <div class="intro-stat-value">${resumen.total_pilotos || 0}</div>
                <div class="intro-stat-label">Pilotos</div>
            </div>
            <div class="intro-stat card">
                <div class="intro-stat-value">${resumen.hitos_completados || 0}/${resumen.total_hitos || 0}</div>
                <div class="intro-stat-label">Hitos Completados</div>
            </div>
        </div>

        <div style="text-align:center;margin-top:1.5rem">
            <a href="#indicadores" class="intro-cta">Ver Indicadores</a>
        </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-text">Error al cargar datos: ${e.message}</div></div>`;
    }
});
