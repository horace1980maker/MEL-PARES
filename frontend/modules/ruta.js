/**
 * Modulo Ruta del Proyecto - linea de tiempo editable de entregables.
 */
registerModule('ruta', async (container) => {
    const authKey = 'rutaTimelineAuth';
    let auth = null;
    try {
        auth = JSON.parse(localStorage.getItem(authKey) || 'null');
    } catch (_) {
        auth = null;
    }

    const clean = (value) => value === null || value === undefined || value === '' ? '-' : String(value).trim();
    const esc = (value) => clean(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const textValue = (value) => clean(value) === '-' ? '' : esc(value);
    const monthEnd = {
        enero: '01-31',
        febrero: '02-28',
        marzo: '03-31',
        abril: '04-30',
        mayo: '05-31',
        junio: '06-30',
        julio: '07-31',
        agosto: '08-31',
        septiembre: '09-30',
        octubre: '10-31',
        noviembre: '11-30',
        diciembre: '12-31',
    };
    const monthOptions = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const plannedDate = (item) => `${item.anio || '2026'}-${monthEnd[normalize(item.mes)] || '12-31'}`;
    const formatDate = (item) => {
        if (!item.anio || !item.mes) return 'Sin fecha';
        const date = new Date(`${plannedDate(item)}T00:00:00`);
        if (Number.isNaN(date.getTime())) return `${esc(item.mes)} ${esc(item.anio)}`;
        return date.toLocaleDateString('es-GT', { month: 'short', year: 'numeric' });
    };
    const routeState = (estado) => normalize(estado).includes('entregado') ? 'completado' : 'en_progreso';
    const statusLabel = (estado) => clean(estado).replace('_', ' ');
    const statusBadge = (estado) => routeState(estado) === 'completado' ? 'alta' : 'media';
    const outputLabel = (output) => `Output ${clean(output)}`;
    const sortTimeline = (items) => [...items].sort((a, b) => {
        const byDate = plannedDate(a).localeCompare(plannedDate(b));
        return byDate || ((Number(a.orden) || 0) - (Number(b.orden) || 0));
    });

    try {
        const records = await api.rutaTimeline();
        let timelineItems = sortTimeline(records);
        let selectedId = timelineItems.find(item => routeState(item.estado) === 'en_progreso')?.id || timelineItems[0]?.id || null;

        const selectedItem = () => timelineItems.find(item => item.id === selectedId) || timelineItems[0];
        const selectIndex = (item) => timelineItems.findIndex(row => row.id === item?.id);

        const renderSummaryChips = () => {
            const delivered = timelineItems.filter(item => routeState(item.estado) === 'completado').length;
            const inProgress = timelineItems.filter(item => routeState(item.estado) === 'en_progreso').length;
            const outputs = [...new Set(timelineItems.map(item => item.output).filter(Boolean))].length;
            return `
                <div class="ruta-summary">
                    <div class="ruta-summary-chip"><strong>${timelineItems.length}</strong><span>entregables</span></div>
                    <div class="ruta-summary-chip"><strong>${delivered}</strong><span>entregados</span></div>
                    <div class="ruta-summary-chip"><strong>${inProgress}</strong><span>en proceso</span></div>
                    <div class="ruta-summary-chip"><strong>${outputs}</strong><span>outputs</span></div>
                </div>`;
        };

        const renderTimeline = () => {
            const items = timelineItems.map((item) => {
                const estado = routeState(item.estado);
                return `
                    <button class="ruta-timeline-item ${item.id === selectedId ? 'is-selected' : ''} ${estado}" type="button" data-id="${item.id}">
                        <span class="ruta-node ${estado}"></span>
                        <span class="ruta-date">${formatDate(item)}</span>
                        <span class="ruta-title">${esc(item.entregable)}</span>
                        <span class="ruta-card-meta">
                            <span class="badge badge-${statusBadge(item.estado)}">${esc(statusLabel(item.estado))}</span>
                            <span class="ruta-derived-flag">${esc(outputLabel(item.output))}</span>
                        </span>
                        <span class="ruta-progress-label">${esc(item.codigo)} - Orden ${String(item.orden || '').padStart(2, '0')}</span>
                    </button>`;
            }).join('');

            return `<div class="ruta-timeline-shell"><div class="ruta-timeline-rail">${items}</div></div>`;
        };

        const renderDetail = () => {
            const item = selectedItem();
            if (!item) return '<div class="empty-state-text">No hay entregables registrados en TIMELINE</div>';
            return `
                <section class="ruta-detail card">
                    <div class="ruta-detail-main">
                        <div>
                            <div class="ruta-kicker">Entregable seleccionado</div>
                            <h3>${esc(item.entregable)}</h3>
                        </div>
                        <span class="badge badge-${statusBadge(item.estado)}">${esc(statusLabel(item.estado))}</span>
                    </div>
                    <p class="ruta-detail-description">${esc(item.codigo)} - ${esc(outputLabel(item.output))}. Entregable ${esc(item.orden)} programado para ${esc(item.mes)} ${esc(item.anio)}.</p>
                    <div class="ruta-detail-grid">
                        <div><b>No. entregable</b><span>${esc(item.codigo)}</span></div>
                        <div><b>Output</b><span>${esc(outputLabel(item.output))}</span></div>
                        <div><b>Fecha programada</b><span>${formatDate(item)}</span></div>
                        <div><b>Fuente</b><span>MEL PROPOSAL V6.xlsx / TIMELINE</span></div>
                    </div>
                    <div class="ruta-insight-grid">
                        <div class="ruta-insight">
                            <span>Orden TIMELINE</span>
                            <strong>${esc(item.orden)}</strong>
                            <small>Secuencia de la hoja</small>
                        </div>
                        <div class="ruta-insight">
                            <span>Estado</span>
                            <strong>${esc(item.estado)}</strong>
                            <small>Campo Estado</small>
                        </div>
                        <div class="ruta-insight">
                            <span>Periodo</span>
                            <strong>${esc(item.mes)}</strong>
                            <small>${esc(item.anio)}</small>
                        </div>
                    </div>
                </section>`;
        };

        const renderEditor = () => {
            if (!auth) return '';
            const item = selectedItem();
            if (!item) return '<section class="card ruta-edit-card"><div class="empty-state-text">Sin entregable seleccionado</div></section>';
            const monthSelect = monthOptions.map(month =>
                `<option value="${month}" ${normalize(item.mes) === normalize(month) ? 'selected' : ''}>${month}</option>`
            ).join('');
            return `
                <section class="card ruta-edit-card">
                    <div class="card-header">
                        <h2 class="card-title">Edicion de TIMELINE</h2>
                        <span class="badge badge-media">Admin activo</span>
                    </div>
                    <div class="ruta-editor">
                        <label class="mel-entry-select">Entregable
                            <select id="ruta-entry">
                                ${timelineItems.map(row => `<option value="${row.id}" ${row.id === item.id ? 'selected' : ''}>${String(row.orden || '').padStart(2, '0')} | ${esc(row.codigo)} | ${esc(row.entregable).slice(0, 90)}</option>`).join('')}
                            </select>
                        </label>
                        <div class="mel-edit-fields">
                            <label>No. Entregable<input data-field="codigo" value="${textValue(item.codigo)}"></label>
                            <label>Output<input data-field="output" value="${textValue(item.output)}"></label>
                            <label>Orden<input data-field="orden" type="number" min="1" step="1" value="${textValue(item.orden)}"></label>
                            <label>Ano<input data-field="anio" type="number" min="2020" max="2100" step="1" value="${textValue(item.anio)}"></label>
                            <label>Mes
                                <select data-field="mes">${monthSelect}</select>
                            </label>
                            <label>Estado
                                <select data-field="estado">
                                    <option value="Entregado" ${normalize(item.estado).includes('entregado') ? 'selected' : ''}>Entregado</option>
                                    <option value="En proceso" ${normalize(item.estado).includes('proceso') ? 'selected' : ''}>En proceso</option>
                                </select>
                            </label>
                            <label class="span-2">Entregable<textarea data-field="entregable">${textValue(item.entregable)}</textarea></label>
                        </div>
                        <div class="actions-row">
                            <button id="ruta-save" class="btn-primary" type="button">Guardar cambios</button>
                            <span id="ruta-save-status"></span>
                        </div>
                    </div>
                </section>`;
        };

        const bindInteractions = () => {
            container.querySelectorAll('.ruta-timeline-item').forEach(node => {
                node.addEventListener('click', () => {
                    selectedId = Number(node.dataset.id);
                    render();
                });
            });

            const entry = container.querySelector('#ruta-entry');
            if (entry) {
                entry.addEventListener('change', (event) => {
                    selectedId = Number(event.target.value);
                    render();
                });
            }

            const save = container.querySelector('#ruta-save');
            if (save) {
                save.addEventListener('click', async () => {
                    const item = selectedItem();
                    const panel = container.querySelector('.ruta-editor');
                    const status = container.querySelector('#ruta-save-status');
                    const payload = {};
                    panel.querySelectorAll('[data-field]').forEach(field => {
                        if (['orden', 'anio'].includes(field.dataset.field)) {
                            payload[field.dataset.field] = field.value === '' ? null : Number(field.value);
                        } else {
                            payload[field.dataset.field] = field.value;
                        }
                    });
                    save.disabled = true;
                    save.textContent = 'Guardando...';
                    status.textContent = '';
                    try {
                        const updated = await api.rutaTimelineUpdate(item.id, payload, auth.token);
                        const index = timelineItems.findIndex(row => row.id === updated.id);
                        if (index >= 0) timelineItems[index] = updated;
                        timelineItems = sortTimeline(timelineItems);
                        selectedId = updated.id;
                        render();
                    } catch (err) {
                        save.disabled = false;
                        save.textContent = 'Guardar cambios';
                        status.textContent = err.message;
                    }
                });
            }

            const loginToggle = container.querySelector('#ruta-login-toggle');
            if (loginToggle) {
                loginToggle.addEventListener('click', () => {
                    container.querySelector('#ruta-login-panel').innerHTML = `
                        <form id="ruta-login-form" class="mel-login">
                            <label>Usuario admin<input name="username" autocomplete="username" required placeholder="admin"></label>
                            <label>Contrasena<input name="password" type="password" autocomplete="current-password" required></label>
                            <button class="btn-primary" type="submit">Ingresar</button>
                            <span id="ruta-login-error"></span>
                        </form>`;
                    container.querySelector('#ruta-login-form').addEventListener('submit', async (event) => {
                        event.preventDefault();
                        const form = new FormData(event.target);
                        try {
                            const session = await api.rutaLogin({
                                username: form.get('username'),
                                password: form.get('password'),
                            });
                            localStorage.setItem(authKey, JSON.stringify(session));
                            auth = session;
                            render();
                        } catch (err) {
                            container.querySelector('#ruta-login-error').textContent = err.message;
                        }
                    });
                });
            }

            const logout = container.querySelector('#ruta-logout');
            if (logout) {
                logout.addEventListener('click', () => {
                    localStorage.removeItem(authKey);
                    auth = null;
                    render();
                });
            }
        };

        const render = () => {
            const selected = selectedItem();
            if (selected && selectIndex(selected) === -1) selectedId = timelineItems[0]?.id || null;
            container.innerHTML = `
                <div class="ruta-header">
                    <div>
                        <h2 class="section-title">Linea de Tiempo del Proyecto</h2>
                        <p class="module-subtitle">Ruta independiente construida con los entregables de la hoja TIMELINE.</p>
                    </div>
                    ${renderSummaryChips()}
                </div>
                <div class="ruta-admin-bar">
                    ${auth
                        ? `<span class="mel-auth-info"><span class="mel-auth-user">${esc(auth.username).toUpperCase()}</span><button id="ruta-logout" class="btn-outline-sm" type="button">Cerrar sesion</button></span>`
                        : `<button id="ruta-login-toggle" class="btn-light" type="button">Ingreso admin</button>`
                    }
                </div>
                <div id="ruta-login-panel" class="mel-login-panel"></div>
                ${renderTimeline()}
                <div id="ruta-detail-slot">${renderDetail()}</div>
                ${renderEditor()}`;
            bindInteractions();
        };

        render();
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">!</div><div class="empty-state-text">Error al cargar Ruta: ${esc(e.message)}</div></div>`;
    }
});
