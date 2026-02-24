/**
 * Módulo Aprendizaje — Navegación por preguntas de aprendizaje.
 */
registerModule('aprendizaje', async (container, filters) => {
    try {
        const preguntas = await api.preguntas();

        if (!preguntas.length) {
            container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💡</div><div class="empty-state-text">No hay preguntas de aprendizaje registradas</div></div>`;
            return;
        }

        let html = `<div class="lq-tabs" role="tablist">`;
        preguntas.forEach((lq, i) => {
            html += `<button class="lq-tab ${i === 0 ? 'active' : ''}" role="tab" data-lq-id="${lq.id}" aria-label="${lq.codigo}">${lq.codigo}</button>`;
        });
        html += `</div><div id="lq-content" class="card" style="min-height:200px"></div>`;

        container.innerHTML = html;

        async function showLQ(lqId) {
            const lq = preguntas.find(q => q.id == lqId);
            if (!lq) return;

            const evidencias = await api.evidencias({ lq_id: lqId });

            let content = `
            <div class="card-header"><span class="card-title">${lq.codigo}</span></div>
            <p style="margin-bottom:1rem;font-size:0.92rem;line-height:1.5">${lq.texto}</p>
            <h3 class="section-title" style="font-size:0.9rem">Evidencias Vinculadas (${evidencias.length})</h3>`;

            if (evidencias.length) {
                evidencias.forEach(ev => {
                    content += `
                    <div class="change-item">
                        <div class="change-dot"></div>
                        <div class="change-date">${ev.fecha}</div>
                        <div>
                            <span class="evidence-type">${ev.tipo}</span>
                            ${ev.texto ? ` — ${ev.texto.substring(0, 120)}${ev.texto.length > 120 ? '...' : ''}` : ''}
                            ${ev.autor ? `<span style="color:var(--text-muted)"> · ${ev.autor}</span>` : ''}
                        </div>
                    </div>`;
                });
            } else {
                content += `<div class="empty-state" style="padding:1rem"><div class="empty-state-text">Sin evidencias vinculadas a esta pregunta</div></div>`;
            }

            document.getElementById('lq-content').innerHTML = content;
        }

        // Tab clicks
        container.querySelectorAll('.lq-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.lq-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                showLQ(tab.dataset.lqId);
            });
        });

        // Show first
        showLQ(preguntas[0].id);
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error: ${e.message}</div></div>`;
    }
});
