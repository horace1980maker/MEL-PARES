/**
 * Modulo Ruta del Proyecto - linea de tiempo de hitos con contexto MEL.
 */
registerModule('ruta', async (container) => {
    const clean = (value) => value === null || value === undefined || value === '' ? '-' : String(value);
    const esc = (value) => clean(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    const pct = (value) => Math.round((Number(value) || 0) * 100);
    const pctWidth = (value) => Math.max(0, Math.min(100, pct(value)));
    const normalize = (value) => String(value || '').toLowerCase();
    const compact = (value, max = 170) => {
        const text = String(value || '').replace(/\s+/g, ' ').trim();
        return text.length > max ? `${text.slice(0, max - 1)}...` : text;
    };
    const formatDate = (value) => {
        if (!value) return 'Sin fecha';
        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) return esc(value);
        return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
    };
    const lqCodes = (value) => {
        const matches = String(value || '').match(/LQ?\s*\d+/gi) || [];
        return [...new Set(matches.map(match => `LQ${match.match(/\d+/)[0]}`))];
    };
    const statusLabel = (estado) => clean(estado).replace('_', ' ');
    const statusBadge = (estado) => {
        if (estado === 'completado') return 'alta';
        if (estado === 'en_progreso') return 'media';
        return 'baja';
    };

    const deriveHitosFromMel = (records) => {
        if (!records.length) return [];
        const hasOutput = records.some(row => row.tipo === 'output');
        const hasOutcome = records.some(row => row.tipo === 'outcome');
        return [
            {
                nombre: 'Linea base y preparacion MEL',
                estado: 'completado',
                responsable: 'Equipo MEL',
                fecha_planificada: '2025-04-30',
                descripcion: 'Momento inferido desde indicadores con linea base, herramientas de verificacion y primeras frecuencias de seguimiento.',
                inferido: true,
            },
            {
                nombre: 'Fortalecimiento y hojas de ruta',
                estado: hasOutput ? 'en_progreso' : 'pendiente',
                responsable: 'CATIE / organizaciones socias',
                fecha_planificada: '2025-07-31',
                descripcion: 'Momento inferido desde indicadores de capacitacion, ToT, hojas de ruta, peer learning y validacion de estrategias.',
                inferido: true,
            },
            {
                nombre: 'Implementacion y monitoreo de pilotos',
                estado: hasOutput ? 'en_progreso' : 'pendiente',
                responsable: 'Organizaciones beneficiarias',
                fecha_planificada: '2026-07-31',
                descripcion: 'Momento inferido desde indicadores de implementacion, visitas de verificacion, entrevistas, matrices de monitoreo e informes.',
                inferido: true,
            },
            {
                nombre: 'Aprendizaje, escalabilidad y cierre',
                estado: hasOutcome ? 'pendiente' : 'en_progreso',
                responsable: 'CATIE / UNEP',
                fecha_planificada: '2026-11-30',
                descripcion: 'Momento inferido desde LQ, Comunidad de Practica, dialogos interregionales, reportes de cierre y evidencias de aprendizaje.',
                inferido: true,
            },
        ];
    };

    const allSettled = await Promise.allSettled([
        api.hitos({}),
        api.melProyecto({}),
    ]);

    let hitos = allSettled[0].status === 'fulfilled' ? allSettled[0].value : [];
    const melRecords = allSettled[1].status === 'fulfilled' ? allSettled[1].value : [];
    const melAvailable = allSettled[1].status === 'fulfilled' && melRecords.length > 0;
    if (!hitos.length && melAvailable) {
        hitos = deriveHitosFromMel(melRecords);
    }

    if (!hitos.length) {
        const errorText = allSettled[0].status === 'rejected' ? `Error: ${esc(allSettled[0].reason.message)}` : 'No hay hitos registrados';
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">[ ]</div><div class="empty-state-text">${errorText}</div></div>`;
        return;
    }

    const sortedHitos = [...hitos].sort((a, b) => String(a.fecha_planificada || '').localeCompare(String(b.fecha_planificada || '')));
    let selectedIndex = Math.max(0, sortedHitos.findIndex(h => h.estado === 'en_progreso'));
    if (selectedIndex === -1) selectedIndex = 0;

    const summarizeMel = (records) => {
        const total = records.length;
        const progressValues = records.map(row => Number(row.porcentaje_avance) || 0);
        const avgProgress = total ? progressValues.reduce((sum, value) => sum + value, 0) / total : 0;
        const complete = records.filter(row => (Number(row.porcentaje_avance) || 0) >= 1).length;
        const incompleteSources = records.filter(row => row.estado_fuente === 'incompleto');
        const lagging = records.filter(row => (Number(row.porcentaje_avance) || 0) < 0.35);
        const updated = records
            .map(row => row.updated_at)
            .filter(Boolean)
            .sort()
            .at(-1);
        const lqs = [...new Set(records.flatMap(row => lqCodes(row.lq)))].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
        const frequencies = [...new Set(records.map(row => clean(row.frecuencia)).filter(value => value !== '-'))].slice(0, 4);
        const notes = records
            .map(row => compact(row.notas, 150))
            .filter(Boolean)
            .slice(0, 3);

        return {
            total,
            avgProgress,
            complete,
            incompleteSources,
            lagging,
            updated,
            lqs,
            frequencies,
            notes,
        };
    };

    const globalSummary = summarizeMel(melRecords);
    const contextForHito = (hito, index) => {
        if (!melAvailable) return summarizeMel([]);

        const name = normalize(hito.nombre);
        let records = melRecords;
        if (name.includes('outcome') || name.includes('evaluacion') || name.includes('cierre')) {
            records = melRecords.filter(row => row.tipo === 'outcome');
        } else if (name.includes('output') || name.includes('reporte') || name.includes('monitoreo') || name.includes('pilotos')) {
            records = melRecords.filter(row => row.tipo === 'output');
        } else if (name.includes('aprendizaje') || name.includes('taller')) {
            records = melRecords.filter(row => lqCodes(row.lq).some(code => Number(code.slice(2)) >= 3));
        } else if (name.includes('linea base') || name.includes('preparacion')) {
            records = melRecords.filter(row => row.linea_base || row.herramienta);
        } else if (name.includes('fortalecimiento') || name.includes('hojas de ruta')) {
            records = melRecords.filter(row => normalize(row.indicador).includes('capacidad') || normalize(row.indicador).includes('hoja'));
        }

        if (!records.length) records = melRecords;
        const summary = summarizeMel(records);
        const planned = new Date(`${hito.fecha_planificada || ''}T00:00:00`).getTime();
        const overdue = hito.estado !== 'completado' && planned && planned < Date.now();
        return { ...summary, overdue, scopeCount: records.length };
    };

    const timelineContexts = sortedHitos.map(contextForHito);

    const renderSummaryChips = () => `
        <div class="ruta-summary">
            <div class="ruta-summary-chip"><strong>${sortedHitos.length}</strong><span>hitos</span></div>
            <div class="ruta-summary-chip"><strong>${pct(globalSummary.avgProgress)}%</strong><span>avance MEL</span></div>
            <div class="ruta-summary-chip"><strong>${globalSummary.complete}/${globalSummary.total || 0}</strong><span>indicadores cumplidos</span></div>
            <div class="ruta-summary-chip ${globalSummary.incompleteSources.length ? 'is-warning' : ''}">
                <strong>${globalSummary.incompleteSources.length}</strong><span>fuentes por completar</span>
            </div>
        </div>`;

    const renderTimeline = () => {
        const items = sortedHitos.map((hito, index) => {
            const estado = hito.estado || 'pendiente';
            const context = timelineContexts[index];
            const progress = melAvailable ? context.avgProgress : (estado === 'completado' ? 1 : estado === 'en_progreso' ? 0.55 : 0.08);
            const stateClass = context.overdue ? 'rezago' : estado;
            const sourceClass = context.incompleteSources.length ? 'fuente-incompleta' : '';
            return `
                <button class="ruta-timeline-item ${index === selectedIndex ? 'is-selected' : ''} ${stateClass} ${sourceClass}" type="button" data-index="${index}">
                    <span class="ruta-node ${stateClass}"></span>
                    <span class="ruta-date">${formatDate(hito.fecha_planificada)}</span>
                    <span class="ruta-title">${esc(hito.nombre)}</span>
                    <span class="ruta-card-meta">
                        <span class="badge badge-${statusBadge(estado)}">${esc(statusLabel(estado))}</span>
                        ${hito.inferido ? '<span class="ruta-derived-flag">Inferido</span>' : ''}
                        ${context.incompleteSources.length ? '<span class="ruta-source-flag">Fuente</span>' : ''}
                    </span>
                    <span class="ruta-progress-label">${melAvailable ? `${pct(progress)}% MEL` : 'Sin contexto MEL'}</span>
                    <span class="progress-bar ruta-progress"><span class="progress-fill" style="width:${pctWidth(progress)}%"></span></span>
                </button>`;
        }).join('');

        return `<div class="ruta-timeline-shell"><div class="ruta-timeline-rail">${items}</div></div>`;
    };

    const renderDetail = () => {
        const hito = sortedHitos[selectedIndex];
        const estado = hito.estado || 'pendiente';
        const context = timelineContexts[selectedIndex];
        const lqs = context.lqs.length ? context.lqs.map(code => `<span class="tag">${esc(code)}</span>`).join('') : '<span class="ruta-muted">Sin LQ inferidas</span>';
        const frequencies = context.frequencies.length ? context.frequencies.map(value => `<li>${esc(compact(value, 120))}</li>`).join('') : '<li>Sin frecuencia registrada</li>';
        const notes = context.notes.length ? context.notes.map(value => `<li>${esc(value)}</li>`).join('') : '<li>Sin notas MEL relacionadas</li>';
        const updated = context.updated ? formatDate(context.updated.slice(0, 10)) : 'Sin actualizacion registrada';

        return `
            <section class="ruta-detail card">
                <div class="ruta-detail-main">
                    <div>
                        <div class="ruta-kicker">Hito seleccionado</div>
                        <h3>${esc(hito.nombre)}</h3>
                    </div>
                    <span class="badge badge-${statusBadge(estado)}">${esc(statusLabel(estado))}</span>
                </div>
                <p class="ruta-detail-description">${esc(hito.descripcion || 'Sin descripcion adicional')}</p>
                ${hito.inferido ? '<p class="ruta-derived-note">Este momento fue inferido desde MEL Proyecto porque no hay hitos registrados en la base local.</p>' : ''}
                <div class="ruta-detail-grid">
                    <div><b>Fecha planificada</b><span>${formatDate(hito.fecha_planificada)}</span></div>
                    <div><b>Fecha real</b><span>${formatDate(hito.fecha_real)}</span></div>
                    <div><b>Responsable</b><span>${esc(hito.responsable || 'Sin responsable')}</span></div>
                    <div><b>Ultima actualizacion MEL</b><span>${updated}</span></div>
                </div>
                <div class="ruta-insight-grid">
                    <div class="ruta-insight">
                        <span>Avance inferido</span>
                        <strong>${melAvailable ? `${pct(context.avgProgress)}%` : 'N/D'}</strong>
                        <div class="progress-bar"><div class="progress-fill" style="width:${pctWidth(context.avgProgress)}%"></div></div>
                    </div>
                    <div class="ruta-insight">
                        <span>Indicadores en contexto</span>
                        <strong>${melAvailable ? context.scopeCount : 0}</strong>
                        <small>${context.complete} cumplidos</small>
                    </div>
                    <div class="ruta-insight ${context.incompleteSources.length ? 'is-warning' : ''}">
                        <span>Fuentes por revisar</span>
                        <strong>${context.incompleteSources.length}</strong>
                        <small>${context.lagging.length} con bajo avance</small>
                    </div>
                </div>
                <div class="ruta-context-columns">
                    <div>
                        <b>LQ relacionadas</b>
                        <div class="ruta-tags">${lqs}</div>
                    </div>
                    <div>
                        <b>Frecuencias / momentos</b>
                        <ul>${frequencies}</ul>
                    </div>
                    <div>
                        <b>Notas MEL relevantes</b>
                        <ul>${notes}</ul>
                    </div>
                </div>
                ${melAvailable ? '' : '<p class="ruta-warning">La ruta se muestra con hitos existentes porque MEL Proyecto no devolvio contexto de indicadores.</p>'}
            </section>`;
    };

    const render = () => {
        container.innerHTML = `
            <div class="ruta-header">
                <div>
                    <h2 class="section-title">Linea de Tiempo del Proyecto</h2>
                    <p class="module-subtitle">Ruta visual con hitos y senales de avance inferidas desde MEL Proyecto.</p>
                </div>
                ${renderSummaryChips()}
            </div>
            ${renderTimeline()}
            <div id="ruta-detail-slot">${renderDetail()}</div>`;

        container.querySelectorAll('.ruta-timeline-item').forEach(item => {
            item.addEventListener('click', () => {
                selectedIndex = Number(item.dataset.index);
                container.querySelectorAll('.ruta-timeline-item').forEach(node => node.classList.toggle('is-selected', Number(node.dataset.index) === selectedIndex));
                container.querySelector('#ruta-detail-slot').innerHTML = renderDetail();
            });
        });
    };

    render();
});
