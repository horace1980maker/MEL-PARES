/**
 * Módulo Comparador de Cambio — Baseline vs Actual vs Meta con Chart.js.
 */
registerModule('comparador', async (container, filters) => {
    try {
        const indicadores = await api.indicadores({});

        let html = `
        <div class="comparator-controls">
            <select id="cmp-indicador" aria-label="Indicador">
                <option value="">Seleccionar indicador...</option>
                ${indicadores.map(i => `<option value="${i.id}">${i.codigo} — ${i.nombre}</option>`).join('')}
            </select>
            <select id="cmp-unidad" aria-label="Unidad de análisis">
                <option value="">General</option>
                <option value="organizacion">Por organización</option>
                <option value="paisaje">Por paisaje</option>
                <option value="piloto">Por piloto</option>
            </select>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">Comparación</span></div>
            <div class="chart-container"><canvas id="cmp-chart"></canvas></div>
        </div>
        <div class="card" style="margin-top:1rem">
            <div class="card-header"><span class="card-title">Detalle de Mediciones</span></div>
            <div id="cmp-table-area"></div>
        </div>`;

        container.innerHTML = html;

        let chartInstance = null;

        async function updateChart() {
            const indId = document.getElementById('cmp-indicador').value;
            if (!indId) return;

            const [progData, mediciones] = await Promise.all([
                api.progreso({ indicador_id: indId }),
                api.mediciones({ indicador_id: indId }),
            ]);

            const ind = progData[0];
            if (!ind) return;

            // Bar chart: baseline, actual, meta
            const ctx = document.getElementById('cmp-chart');
            if (chartInstance) chartInstance.destroy();
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Línea Base', 'Actual', 'Meta'],
                    datasets: [{
                        label: ind.codigo,
                        data: [ind.baseline, ind.actual, ind.meta],
                        backgroundColor: ['#001F89', '#B71373', '#009EE2'],
                        borderRadius: 6,
                        barThickness: 50,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                },
            });

            // Table
            let tableHtml = `<table class="data-table">
                <thead><tr><th>Fecha</th><th>Valor</th><th>Instrumento</th><th>Responsable</th><th>Notas</th></tr></thead><tbody>`;
            mediciones.forEach(m => {
                tableHtml += `<tr>
                    <td>${m.fecha}</td><td><strong>${m.valor}</strong></td>
                    <td>${m.instrumento_id}</td><td>${m.responsable || '—'}</td><td>${m.notas || '—'}</td>
                </tr>`;
            });
            tableHtml += `</tbody></table>`;
            if (!mediciones.length) tableHtml = `<div class="empty-state"><div class="empty-state-text">Sin mediciones para este indicador</div></div>`;
            document.getElementById('cmp-table-area').innerHTML = tableHtml;
        }

        document.getElementById('cmp-indicador').addEventListener('change', updateChart);
        document.getElementById('cmp-unidad').addEventListener('change', updateChart);
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error: ${e.message}</div></div>`;
    }
});
