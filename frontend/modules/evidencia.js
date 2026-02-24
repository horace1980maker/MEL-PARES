/**
 * Módulo Repositorio de Evidencia — Filtros y grid de evidencias.
 */
registerModule('evidencia', async (container, filters) => {
    try {
        const [indicadores, evidencias] = await Promise.all([
            api.indicadores({}),
            api.evidencias({}),
        ]);

        let html = `
        <h2 class="section-title">Repositorio de Evidencia</h2>
        <div class="evidence-filters">
            <select id="ev-tipo" class="filter-select" aria-label="Tipo de evidencia">
                <option value="">Todos los tipos</option>
                <option value="documento">Documento</option>
                <option value="foto">Foto</option>
                <option value="texto">Texto</option>
                <option value="video">Video</option>
            </select>
            <select id="ev-indicador" class="filter-select" aria-label="Indicador">
                <option value="">Todos los indicadores</option>
                ${indicadores.map(i => `<option value="${i.id}">${i.codigo}</option>`).join('')}
            </select>
        </div>
        <div id="ev-grid" class="evidence-grid"></div>`;

        container.innerHTML = html;

        function renderGrid(items) {
            const grid = document.getElementById('ev-grid');
            if (!items.length) {
                grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📁</div><div class="empty-state-text">Sin evidencias registradas</div></div>`;
                return;
            }
            let cards = '';
            items.forEach(ev => {
                const tags = ev.tags ? ev.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : '';
                cards += `
                <div class="card evidence-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
                        <span class="evidence-type">${ev.tipo}</span>
                        <span class="evidence-date">${ev.fecha}</span>
                    </div>
                    <p style="font-size:0.85rem;margin-bottom:0.4rem">${ev.texto ? ev.texto.substring(0, 200) : (ev.archivo_url || 'Sin contenido')}</p>
                    ${ev.autor ? `<p style="font-size:0.78rem;color:var(--text-light)">Autor: ${ev.autor}</p>` : ''}
                    ${tags ? `<div class="evidence-tags">${tags}</div>` : ''}
                </div>`;
            });
            grid.innerHTML = cards;
        }

        renderGrid(evidencias);

        // Filter handlers
        async function applyFilters() {
            const tipo = document.getElementById('ev-tipo').value;
            const indicadorId = document.getElementById('ev-indicador').value;
            const filtered = await api.evidencias({ tipo, indicador_id: indicadorId });
            renderGrid(filtered);
        }

        document.getElementById('ev-tipo').addEventListener('change', applyFilters);
        document.getElementById('ev-indicador').addEventListener('change', applyFilters);
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error: ${e.message}</div></div>`;
    }
});
