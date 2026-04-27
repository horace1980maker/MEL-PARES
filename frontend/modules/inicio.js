/**
 * Módulo Inicio — Página de bienvenida con descripción del sistema MEL.
 */
registerModule('inicio', async (container, filters) => {
    try {
        const [proyectoResult, sociosResult, preguntasResult] = await Promise.allSettled([
            api.melProyectoResumen(),
            api.melSociosResumen({}),
            api.preguntas(),
        ]);

        const proyecto = proyectoResult.status === 'fulfilled' ? proyectoResult.value : {};
        const socios = sociosResult.status === 'fulfilled' ? sociosResult.value : {};
        const preguntas = preguntasResult.status === 'fulfilled' ? preguntasResult.value : [];
        const sociosBalance = Array.isArray(socios.balance) ? socios.balance : [];
        const sociosOutcomes = sociosBalance.find(item => item.tipo === 'outcome')?.indicadores || 0;
        const sociosOutputs = sociosBalance.find(item => item.tipo === 'output')?.indicadores || 0;
        const totalIndicadores = (proyecto.total_indicadores || 0) + (socios.total_indicadores || 0);
        const totalOutcomes = (proyecto.outcomes || 0) + sociosOutcomes;
        const totalOutputs = (proyecto.outputs || 0) + sociosOutputs;
        const totalLqs = Array.isArray(preguntas) && preguntas.length ? preguntas.length : 10;
        const totalOrganizaciones = Array.isArray(socios.organizaciones) ? socios.organizaciones.length : 0;

        container.innerHTML = `
        <div class="intro-hero">
            <div class="intro-icon">🌱</div>
            <h2 class="intro-title">Sistema de Monitoreo, Evaluación y Aprendizaje</h2>
            <p class="intro-subtitle">Proyecto PARES</p>
        </div>

        <div class="intro-description card">
            <p>El Sistema de Monitoreo, Evaluación y Aprendizaje (MEL) del Proyecto PARES está diseñado para funcionar con un <strong>enfoque de intervención adaptativa</strong> que prioriza la captura de aprendizajes significativos y la generación de evidencia útil para la mejora continua y la toma de decisiones estratégicas.</p>
            <p style="margin-top:0.8rem;color:var(--text-light);font-size:0.9rem">Su funcionamiento se articula en torno a los siguientes elementos clave:</p>
        </div>

        <div class="intro-pillars">
            <div class="card intro-pillar">
                <div class="pillar-icon">🎯</div>
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
                <div class="intro-stat-value">${totalIndicadores}</div>
                <div class="intro-stat-label">Indicadores Acumulados</div>
            </div>
            <div class="intro-stat card">
                <div class="intro-stat-value">${totalOutcomes}/${totalOutputs}</div>
                <div class="intro-stat-label">Outcomes / Outputs</div>
            </div>
            <div class="intro-stat card">
                <div class="intro-stat-value">${totalOrganizaciones}</div>
                <div class="intro-stat-label">Organizaciones Socias</div>
            </div>
            <div class="intro-stat card">
                <div class="intro-stat-value">${totalLqs}</div>
                <div class="intro-stat-label">Preguntas de Aprendizaje</div>
            </div>
        </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error al cargar datos: ${e.message}</div></div>`;
    }
});
