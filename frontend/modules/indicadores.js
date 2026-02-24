/**
 * Módulo Indicadores — KPIs interactivos con sliders + panel de cambios recientes.
 */
registerModule('indicadores', async (container, filters) => {
    try {
        const [progreso, resumen] = await Promise.all([
            api.progreso({}),
            api.resumen(),
        ]);

        let html = `
        <div class="summary-bar">
            <div class="summary-chip"><strong>${resumen.total_mediciones || 0}</strong> Mediciones</div>
            <div class="summary-chip"><strong>${resumen.total_evidencias || 0}</strong> Evidencias</div>
            <div class="summary-chip"><strong>${resumen.total_pilotos || 0}</strong> Pilotos</div>
            <div class="summary-chip"><strong>${resumen.hitos_completados || 0}/${resumen.total_hitos || 0}</strong> Hitos</div>
        </div>
        <h2 class="section-title">Indicadores</h2>
        <div class="kpi-grid">`;

        progreso.forEach(ind => {
            const pct = Math.round(ind.progreso * 100);
            const badgeClass = `badge-${ind.calidad_evidencia}`;
            const minVal = ind.baseline;
            const maxVal = ind.meta || 100;
            const step = maxVal > 10 ? 1 : 0.1;
            html += `
            <div class="card kpi-card" data-ind-id="${ind.indicador_id}">
                <div class="kpi-code">${ind.codigo}</div>
                <div class="kpi-label">${ind.nombre}</div>
                <div class="kpi-values">
                    <span>Base: <strong>${ind.baseline}</strong></span>
                    <span>Meta: <strong>${ind.meta}</strong></span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:0.78rem;color:var(--text-light)">${pct}% progreso</span>
                    <span class="badge ${badgeClass}">${ind.calidad_evidencia}</span>
                </div>
                <div class="kpi-slider-row">
                    <input type="range" class="kpi-slider"
                           min="${minVal}" max="${maxVal}" step="${step}"
                           value="${ind.actual}"
                           data-ind-id="${ind.indicador_id}"
                           data-baseline="${ind.baseline}"
                           data-meta="${ind.meta}" />
                    <span class="slider-val">${ind.actual}</span>
                </div>
                <div class="slider-bounds">
                    <span>${minVal}</span>
                    <span>${maxVal}</span>
                </div>
                <div class="kpi-saved-toast"></div>
            </div>`;
        });

        html += `</div>`;

        // Panel de cambios recientes
        html += `
        <div class="changes-panel">
            <h2 class="section-title">Cambios Recientes</h2>`;

        if (progreso.some(i => i.num_mediciones > 0)) {
            const mediciones = await api.mediciones({});
            const recientes = mediciones.slice(0, 8);
            if (recientes.length > 0) {
                recientes.forEach(m => {
                    const ind = progreso.find(i => i.indicador_id === m.indicador_id);
                    html += `
                    <div class="change-item">
                        <div class="change-dot"></div>
                        <div class="change-date">${m.fecha}</div>
                        <div>${ind ? ind.codigo : ''} — Valor: <strong>${m.valor}</strong> ${m.notas ? `<span style="color:var(--text-muted)">· ${m.notas}</span>` : ''}</div>
                    </div>`;
                });
            } else {
                html += `<div class="empty-state"><div class="empty-state-text">Sin mediciones aún</div></div>`;
            }
        } else {
            html += `<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-text">Aún no hay mediciones registradas. Ajuste los sliders para comenzar.</div></div>`;
        }

        html += `</div>`;
        container.innerHTML = html;

        // --- Wire up slider interactions ---
        let saveTimeout = null;

        container.querySelectorAll('.kpi-slider').forEach(slider => {
            const card = slider.closest('.kpi-card');
            const valDisplay = card.querySelector('.slider-val');
            const progressFill = card.querySelector('.progress-fill');
            const toast = card.querySelector('.kpi-saved-toast');
            const baseline = parseFloat(slider.dataset.baseline) || 0;
            const meta = parseFloat(slider.dataset.meta) || 100;

            // Live update as user drags
            slider.addEventListener('input', () => {
                const val = parseFloat(slider.value);
                valDisplay.textContent = val % 1 === 0 ? val : val.toFixed(1);
                // Update progress bar in real time
                const denom = meta - baseline;
                const pct = denom > 0 ? Math.round(Math.max(0, Math.min(1, (val - baseline) / denom)) * 100) : 0;
                progressFill.style.width = `${pct}%`;
                // Update the % text
                const pctText = card.querySelector('[style*="justify-content:space-between"] span');
                if (pctText) pctText.textContent = `${pct}% progreso`;
            });

            // Save on release (debounced)
            slider.addEventListener('change', () => {
                const val = parseFloat(slider.value);
                const indId = parseInt(slider.dataset.indId);

                // Show saving state
                toast.textContent = '💾 Guardando...';
                toast.classList.add('show');

                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(async () => {
                    try {
                        await api.quickUpdate({
                            indicador_id: indId,
                            valor: val,
                        });
                        toast.textContent = '✓ Guardado';
                        setTimeout(() => toast.classList.remove('show'), 2000);
                    } catch (err) {
                        toast.textContent = '✗ Error al guardar';
                        toast.style.color = 'var(--danger)';
                        setTimeout(() => {
                            toast.classList.remove('show');
                            toast.style.color = '';
                        }, 3000);
                    }
                }, 400);
            });
        });

    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error al cargar datos: ${e.message}</div></div>`;
    }
});
