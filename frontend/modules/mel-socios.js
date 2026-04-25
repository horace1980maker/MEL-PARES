/**
 * Modulo MEL socios - matriz de indicadores por organizacion con edicion autenticada.
 */
registerModule('melSocios', async (container) => {
    const authKey = 'melSociosAuth';
    let auth = null;
    try {
        auth = JSON.parse(localStorage.getItem(authKey) || 'null');
    } catch (_) {
        auth = null;
    }

    const fmtPct = (value) => `${Math.round((Number(value) || 0) * 100)}%`;
    const pctWidth = (value) => Math.max(0, Math.min(100, Math.round((Number(value) || 0) * 100)));
    const clean = (value) => value === null || value === undefined || value === '' ? '-' : String(value);
    const esc = (value) => clean(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    try {
        const organizaciones = await api.melSociosOrganizaciones();
        const localOrg = sessionStorage.getItem('melSociosOrg') || '';
        const selectedOrg = localOrg || 'Todas';

        const params = {};
        const queryOrg = selectedOrg;
        if (queryOrg && queryOrg !== 'Todas') params.organizacion = queryOrg;

        const [resumen, records] = await Promise.all([
            api.melSociosResumen(params),
            api.melSocios(params),
        ]);

        const canEditAll = auth?.organizacion === 'Todas';
        const canEditSelected = auth && (canEditAll || auth.organizacion === queryOrg);
        const shortOrg = (org) => {
            const map = {
                'CORPORACIÓN BIOCOMERCIO SOSTENIBLE': 'Biocomercio',
                'FONDO DE CONSERVACIÓN EL TRIUNFO - FONCET': 'FONCET',
                'ASOCIACIÓN ECO': 'ECO',
                'FUNDACIÓN DEFENSORES DE LA NATURALEZA': 'Defensores',
                'CORPORACIÓN TOISAN': 'Toisan',
                'FUNDACIÓN TIERRA VIVA': 'Tierra Viva',
                'FUNDACIÓN COMUNITARIA PUCA': 'PUCA',
            };
            return map[org] || org;
        };
        const orgOptions = ['Todas', ...organizaciones].map(org =>
            `<option value="${esc(org)}" ${queryOrg === org ? 'selected' : ''}>${esc(shortOrg(org))}</option>`
        ).join('');

        container.innerHTML = `
            <div class="mel-socios-toolbar card">
                <div>
                    <div class="card-title">MEL socios</div>
                    <p class="module-subtitle">Matriz de indicadores por organizacion, importada desde el Excel de monitoreo y conectada a la base de datos.</p>
                </div>
                <div class="mel-socios-actions">
                    <select id="mel-org-filter" class="filter-select" title="Organizacion">${orgOptions}</select>
                    <select id="mel-type-filter" class="filter-select">
                        <option value="all">Todos</option>
                        <option value="outcome">Outcomes</option>
                        <option value="output">Outputs</option>
                    </select>
                    <input id="mel-search" class="filter-input" type="search" placeholder="Buscar indicador" />
                    <button id="mel-login-toggle" class="btn-light">${auth ? esc(auth.username) : 'Ingreso socios'}</button>
                </div>
            </div>

            <div id="mel-login-panel" class="mel-login-panel"></div>

            <div class="summary-bar">
                <div class="summary-chip"><strong>${resumen.total_indicadores}</strong> Indicadores</div>
                <div class="summary-chip"><strong>${fmtPct(resumen.avance_promedio)}</strong> Avance promedio</div>
                <div class="summary-chip"><strong>${resumen.organizaciones.length}</strong> Organizaciones</div>
                <div class="summary-chip"><strong>${records.filter(r => (r.porcentaje_avance || 0) >= 1).length}</strong> Cumplidos</div>
            </div>

            <div class="mel-socios-grid">
                <section class="card">
                    <div class="card-header"><h2 class="card-title">Resumen</h2></div>
                    <div id="mel-org-summary" class="mel-org-summary"></div>
                </section>
                <section class="card">
                    <div class="card-header"><h2 class="card-title">Balance outcomes / outputs</h2></div>
                    <div id="mel-type-balance" class="mel-type-balance"></div>
                </section>
            </div>

            <section class="card mel-table-card">
                <div class="card-header">
                    <h2 class="card-title">Matriz de indicadores</h2>
                    <span id="mel-table-count" class="badge badge-media">${records.length} visibles</span>
                </div>
                <div class="table-scroll">
                    <table class="data-table mel-table">
                        <thead>
                            <tr>
                                <th>Organizacion</th>
                                <th>Tipo</th>
                                <th>Descripcion esperada</th>
                                <th>Indicador</th>
                                <th>Linea base</th>
                                <th>Mon. 1</th>
                                <th>Mon. 2</th>
                                <th>Mon. 3</th>
                                <th>Mon. 4</th>
                                <th>Total acumulado</th>
                                <th>Meta numerica</th>
                                <th>Avance</th>
                            </tr>
                        </thead>
                        <tbody id="mel-rows"></tbody>
                    </table>
                </div>
            </section>

            <section class="card mel-edit-card ${canEditSelected ? '' : 'is-locked'}">
                <div class="card-header">
                    <h2 class="card-title">Ingreso y edicion de datos por indicador</h2>
                    <span id="mel-edit-badge" class="badge ${canEditSelected ? 'badge-media' : 'badge-baja'}">${canEditSelected ? 'Sesion activa' : 'Solo lectura'}</span>
                </div>
                <div id="mel-edit-panel"></div>
            </section>
        `;

        const renderSummary = (list, summary = resumen) => {
            const orgSummary = container.querySelector('#mel-org-summary');
            orgSummary.innerHTML = summary.organizaciones.map(org => `
                <div class="mel-summary-row">
                    <div><strong>${esc(org.organizacion)}</strong><span>${org.indicadores} indicadores</span></div>
                    <div class="mel-mini-metrics"><span>${org.outcomes} outcomes</span><span>${org.outputs} outputs</span><b>${fmtPct(org.avance_promedio)}</b></div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${pctWidth(org.avance_promedio)}%"></div></div>
                </div>
            `).join('') || '<div class="empty-state-text">Sin datos</div>';

            const balance = container.querySelector('#mel-type-balance');
            balance.innerHTML = summary.balance.map(item => `
                <div class="mel-balance-row">
                    <div class="mel-balance-head"><strong>${item.tipo === 'outcome' ? 'Resultados / Outcomes' : 'Productos / Outputs'}</strong><span>${fmtPct(item.avance_promedio)}</span></div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${pctWidth(item.avance_promedio)}%"></div></div>
                    <p>${item.indicadores} indicadores, ${item.cumplidos} cumplidos o sobrecumplidos</p>
                </div>
            `).join('');
        };

        const renderRows = (list) => {
            const rowsToRender = list.slice(0, 80);
            container.querySelector('#mel-table-count').textContent = list.length > rowsToRender.length
                ? `${rowsToRender.length} de ${list.length} visibles`
                : `${list.length} visibles`;
            container.querySelector('#mel-rows').innerHTML = rowsToRender.map(row => `
                <tr data-id="${row.id}">
                    <td>${esc(row.organizacion)}</td>
                    <td><span class="badge badge-${row.tipo === 'output' ? 'media' : 'alta'}">${esc(row.tipo)}</span></td>
                    <td class="mel-long-cell">${esc(row.descripcion_esperada)}</td>
                    <td class="mel-indicator-cell">${esc(row.indicador)}</td>
                    <td class="mel-long-cell">${esc(row.linea_base)}</td>
                    <td>${esc(row.monitoring[0])}</td><td>${esc(row.monitoring[1])}</td><td>${esc(row.monitoring[2])}</td><td>${esc(row.monitoring[3])}</td>
                    <td><strong>${esc(row.total_acumulado)}</strong></td>
                    <td>${esc(row.meta_numerica)}</td>
                    <td><div class="mel-progress-cell"><span>${fmtPct(row.porcentaje_avance)}</span><div class="progress-bar"><div class="progress-fill" style="width:${pctWidth(row.porcentaje_avance)}%"></div></div></div></td>
                </tr>
            `).join('');

            container.querySelectorAll('#mel-rows tr').forEach(tr => {
                tr.addEventListener('click', () => renderEditor(list.find(r => r.id === Number(tr.dataset.id))));
            });
        };

        const renderEditor = (row) => {
            const editable = auth && (auth.organizacion === 'Todas' || auth.organizacion === row.organizacion);
            const disabled = editable ? '' : 'disabled';
            const options = currentList().map(item =>
                `<option value="${item.id}" ${item.id === row.id ? 'selected' : ''}>${esc(item.organizacion)} | ${esc(item.indicador).slice(0, 110)}</option>`
            ).join('');
            container.querySelector('#mel-edit-panel').innerHTML = `
                <div class="mel-editor">
                    <label class="mel-entry-select">Indicador
                        <select id="mel-entry-indicator">${options}</select>
                    </label>
                    <div class="mel-editor-context">
                        <b>${esc(row.organizacion)}</b>
                        <span>${esc(row.tipo)} | fila Excel ${esc(row.row)}</span>
                        <p>${esc(row.indicador)}</p>
                    </div>
                    <div class="mel-edit-fields">
                        <label>Linea base<input ${disabled} data-field="linea_base" value="${esc(row.linea_base) === '-' ? '' : esc(row.linea_base)}"></label>
                        <label>Meta numerica<input ${disabled} data-field="meta_numerica" type="number" step="any" value="${esc(row.meta_numerica) === '-' ? '' : esc(row.meta_numerica)}"></label>
                        <label class="span-2">Meta descriptiva<textarea ${disabled} data-field="meta_descriptiva">${esc(row.meta_descriptiva) === '-' ? '' : esc(row.meta_descriptiva)}</textarea></label>
                        ${[1,2,3,4].map(i => `
                            <label>Monitoreo ${i}<input ${disabled} data-field="monitoreo_${i}" value="${esc(row.monitoring[i - 1]) === '-' ? '' : esc(row.monitoring[i - 1])}"></label>
                            <label>Observacion ${i}<textarea ${disabled} data-field="observacion_${i}">${esc(row.notes[i - 1]) === '-' ? '' : esc(row.notes[i - 1])}</textarea></label>
                        `).join('')}
                        <label>Responsable<input ${disabled} data-field="responsable" value="${esc(row.responsable) === '-' ? '' : esc(row.responsable)}"></label>
                        <label>URL evidencia<input ${disabled} data-field="evidencia_url" value="${esc(row.evidencia_url) === '-' ? '' : esc(row.evidencia_url)}"></label>
                    </div>
                    <div class="actions-row">
                        <button id="mel-save" class="btn-primary" ${disabled}>Guardar cambios</button>
                    </div>
                </div>
            `;
            container.querySelector('#mel-entry-indicator').addEventListener('change', (event) => {
                const selected = records.find(item => item.id === Number(event.target.value));
                if (selected) renderEditor(selected);
            });
            const save = container.querySelector('#mel-save');
            if (save) {
                save.addEventListener('click', async () => {
                    const payload = {};
                    container.querySelectorAll('#mel-edit-panel [data-field]').forEach(el => payload[el.dataset.field] = el.value);
                    save.textContent = 'Guardando...';
                    const updated = await api.melSociosUpdate(row.id, payload, auth.token);
                    Object.assign(row, updated);
                    save.textContent = 'Guardado';
                    setTimeout(() => save.textContent = 'Guardar cambios', 1200);
                    renderRows(currentList());
                    renderEditor(row);
                });
            }
        };

        const currentList = () => {
            const type = container.querySelector('#mel-type-filter').value;
            const search = container.querySelector('#mel-search').value.trim().toLowerCase();
            return records.filter(row => {
                const matchesType = type === 'all' || row.tipo === type;
                const matchesSearch = !search || `${row.indicador} ${row.descripcion_esperada}`.toLowerCase().includes(search);
                return matchesType && matchesSearch;
            });
        };

        container.querySelector('#mel-org-filter').addEventListener('change', async (event) => {
            const orgName = event.target.value;
            sessionStorage.setItem('melSociosOrg', orgName);
            navigate('#melSocios');
        });

        container.querySelector('#mel-type-filter').addEventListener('change', () => renderRows(currentList()));
        container.querySelector('#mel-search').addEventListener('input', () => renderRows(currentList()));
        container.querySelector('#mel-login-toggle').addEventListener('click', () => {
            if (auth) {
                localStorage.removeItem(authKey);
                navigate('#melSocios');
                return;
            }
            container.querySelector('#mel-login-panel').innerHTML = `
                <form id="mel-login-form" class="mel-login">
                    <label>Usuario<input name="username" autocomplete="username" required placeholder="admin, adel, puca..."></label>
                    <label>Contrasena<input name="password" type="password" autocomplete="current-password" required></label>
                    <button class="btn-primary" type="submit">Ingresar</button>
                    <span id="mel-login-error"></span>
                </form>
            `;
            container.querySelector('#mel-login-form').addEventListener('submit', async (event) => {
                event.preventDefault();
                const form = new FormData(event.target);
                try {
                    const session = await api.melSociosLogin({
                        username: form.get('username'),
                        password: form.get('password'),
                    });
                    localStorage.setItem(authKey, JSON.stringify(session));
                    navigate('#melSocios');
                } catch (err) {
                    container.querySelector('#mel-login-error').textContent = err.message;
                }
            });
        });

        renderSummary(records);
        renderRows(records);
        if (records.length) renderEditor(records[0]);
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">!</div><div class="empty-state-text">Error al cargar MEL socios: ${e.message}</div></div>`;
    }
});
