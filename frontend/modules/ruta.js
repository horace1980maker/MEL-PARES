/**
 * Módulo Ruta del Proyecto — Línea de tiempo de hitos.
 */
registerModule('ruta', async (container, filters) => {
    try {
        const hitos = await api.hitos({});

        if (!hitos.length) {
            container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🗓️</div><div class="empty-state-text">No hay hitos registrados</div></div>`;
            return;
        }

        let html = `<h2 class="section-title">Línea de Tiempo del Proyecto</h2><div class="timeline">`;

        hitos.forEach((h, i) => {
            const estado = h.estado || 'pendiente';
            html += `
            <div class="timeline-item" data-idx="${i}" onclick="this.classList.toggle('expanded')">
                <div class="timeline-dot ${estado}"></div>
                <div class="timeline-date">${h.fecha_planificada || 'Sin fecha'}</div>
                <div class="timeline-title">${h.nombre}</div>
                <div class="timeline-meta">
                    <span class="badge badge-${estado === 'completado' ? 'alta' : estado === 'en_progreso' ? 'media' : 'baja'}">${estado.replace('_', ' ')}</span>
                    ${h.responsable ? ` · ${h.responsable}` : ''}
                </div>
                <div class="timeline-detail">
                    <p>${h.descripcion || 'Sin descripción adicional'}</p>
                    ${h.fecha_real ? `<p><strong>Fecha real:</strong> ${h.fecha_real}</p>` : ''}
                </div>
            </div>`;
        });

        html += `</div>`;
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error: ${e.message}</div></div>`;
    }
});
