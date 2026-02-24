/**
 * Módulo Inclusión — Matrices interactivas por piloto con checklist persistente.
 */
registerModule('inclusion', async (container, filters) => {
    try {
        const pilotos = await api.pilotos({});

        let html = `<h2 class="section-title">Matrices de Inclusión por Piloto</h2>`;

        if (!pilotos.length) {
            html += `<div class="empty-state"><div class="empty-state-icon">🤝</div><div class="empty-state-text">No hay pilotos registrados. Agregue pilotos vía la API.</div></div>`;
            container.innerHTML = html;
            return;
        }

        // Inclusion measures (shared across pilots)
        const medidas = [
            { key: 'genero', nombre: 'Análisis de género realizado' },
            { key: 'mujeres40', nombre: 'Participación de mujeres ≥ 40%' },
            { key: 'discapacidad', nombre: 'Accesibilidad para personas con discapacidad' },
            { key: 'jovenes', nombre: 'Inclusión de jóvenes' },
            { key: 'indigenas', nombre: 'Consulta con pueblos indígenas' },
            { key: 'consentimiento', nombre: 'Consentimiento libre, previo e informado' },
        ];

        // Load saved state from localStorage
        const STORAGE_KEY = 'mel-pares-inclusion';
        let savedState = {};
        try {
            savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (_) { /* ignore parse errors */ }

        html += `<div class="matrix-grid">`;
        pilotos.forEach(p => {
            const pilotState = savedState[p.id] || {};
            const checked = medidas.filter(m => pilotState[m.key]).length;
            const total = medidas.length;
            const pct = Math.round((checked / total) * 100);

            html += `
            <div class="card inclusion-card" data-pilot-id="${p.id}">
                <div class="card-header">
                    <span class="card-title">${p.nombre}</span>
                    <span class="badge badge-${pct >= 80 ? 'alta' : pct >= 40 ? 'media' : 'baja'}">${pct}%</span>
                </div>
                <div class="progress-bar" style="margin-bottom:0.8rem"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div>`;
            medidas.forEach(m => {
                const isChecked = pilotState[m.key] || false;
                html += `
                    <label class="checklist-item checklist-interactive">
                        <input type="checkbox" class="inclusion-check"
                               data-pilot-id="${p.id}" data-key="${m.key}"
                               ${isChecked ? 'checked' : ''} />
                        <span class="check-custom"></span>
                        <span>${m.nombre}</span>
                    </label>`;
            });
            html += `</div>
                <div class="inclusion-saved-toast"></div>
            </div>`;
        });
        html += `</div>`;

        container.innerHTML = html;

        // --- Wire up checkbox interactions ---
        container.querySelectorAll('.inclusion-check').forEach(cb => {
            cb.addEventListener('change', () => {
                const pilotId = cb.dataset.pilotId;
                const key = cb.dataset.key;

                // Update state
                if (!savedState[pilotId]) savedState[pilotId] = {};
                savedState[pilotId][key] = cb.checked;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));

                // Update progress on this card
                const card = cb.closest('.inclusion-card');
                const checks = card.querySelectorAll('.inclusion-check');
                const total = checks.length;
                const done = [...checks].filter(c => c.checked).length;
                const pct = Math.round((done / total) * 100);

                const badge = card.querySelector('.badge');
                badge.textContent = `${pct}%`;
                badge.className = `badge badge-${pct >= 80 ? 'alta' : pct >= 40 ? 'media' : 'baja'}`;

                const fill = card.querySelector('.progress-fill');
                fill.style.width = `${pct}%`;

                // Show toast
                const toast = card.querySelector('.inclusion-saved-toast');
                toast.textContent = '✓ Guardado';
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 1500);
            });
        });

    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error: ${e.message}</div></div>`;
    }
});
