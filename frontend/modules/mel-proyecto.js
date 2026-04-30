/**
 * Modulo MEL Proyecto - indicadores agregados del proyecto con edicion admin.
 */
registerModule('melProyecto', async (container) => {
    const authKey = 'melProyectoAuth';
    let auth = null;
    const learningQuestionLabels = [
        ['LQ1', '¿Cómo ha evolucionado la capacidad organizacional para realizar análisis de vulnerabilidad y fragilidad en paisajes sensibles al conflicto?'],
        ['LQ2', '¿Qué factores han facilitado o limitado el fortalecimiento de capacidades en las organizaciones?'],
        ['LQ3', '¿En qué medida el Dashboard resulta útil para facilitar decisiones estratégicas en los paisajes intervenidos?'],
        ['LQ4', '¿Qué elementos del enfoque son percibidos como más útiles y replicables por las organizaciones?'],
        ['LQ5', '¿Cómo ha evolucionado la comprensión y aplicación del enfoque paz-seguridad-cambio climático en las organizaciones beneficiarias?'],
        ['LQ6', '¿Qué tan inclusivas y sensibles al género han sido las intervenciones implementadas, según la percepción de las comunidades beneficiarias?'],
        ['LQ7', '¿Qué beneficios o cambios concretos perciben las comunidades tras la implementación de las intervenciones?'],
        ['LQ8', '¿Qué factores han facilitado o limitado la participación de mujeres y jóvenes en la implementación de actividades?'],
        ['LQ9', '¿Qué aprendizajes han surgido de la implementación de la Comunidad de Práctica?'],
        ['LQ10', '¿Cómo ha contribuido la Comunidad de Práctica a la escalabilidad y sostenibilidad de soluciones en el nexo paz-seguridad-cambio climático?'],
    ];

    try {
        auth = JSON.parse(localStorage.getItem(authKey) || 'null');
    } catch (_) {
        auth = null;
    }

    const clean = (value) => value === null || value === undefined || value === '' ? '-' : String(value);
    const esc = (value) => clean(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    const pct = (value) => Math.round((Number(value) || 0) * 100);
    const pctLabel = (value) => `${pct(value)}%`;
    const pctWidth = (value) => Math.max(0, Math.min(100, pct(value)));
    const textValue = (value) => clean(value) === '-' ? '' : esc(value);
    const lqCodes = (value) => {
        const matches = String(value || '').match(/LQ?\s*\d+/gi) || [];
        return [...new Set(matches.map(match => `LQ${match.match(/\d+/)[0]}`))];
    };
    const learningQuestions = [
        ['LQ1', '¿Cómo ha evolucionado la capacidad organizacional para realizar análisis de vulnerabilidad y fragilidad en paisajes sensibles al conflicto?'],
        ['LQ2', '¿Qué factores han facilitado o limitado el fortalecimiento de capacidades en las organizaciones?'],
        ['LQ3', '¿En qué medida el Dashboard resulta útil para facilitar decisiones estratégicas en los paisajes intervenidos?'],
        ['LQ4', '¿Qué elementos del enfoque son percibidos como más útiles y replicables por las organizaciones?'],
        ['LQ5', '¿Cómo ha evolucionado la comprensión y aplicación del enfoque paz–seguridad–cambio climático en las organizaciones beneficiarias?'],
        ['LQ6', '¿Qué tan inclusivas y sensibles al género han sido las intervenciones implementadas, según la percepción de las comunidades beneficiarias?'],
        ['LQ7', '¿Qué beneficios o cambios concretos perciben las comunidades tras la implementación de las intervenciones?'],
        ['LQ8', '¿Qué factores han facilitado o limitado la participación de mujeres y jóvenes en la implementación de actividades?'],
        ['LQ9', '¿Qué aprendizajes han surgido de la implementación de la Comunidad de Práctica?'],
        ['LQ10', '¿Cómo ha contribuido la Comunidad de Práctica a la escalabilidad y sostenibilidad de soluciones en el nexo paz-seguridad-cambio climático?'],
    ];

    try {
        const [summary, records] = await Promise.all([
            api.melProyectoResumen(),
            api.melProyecto(),
        ]);
        let selectedId = records[0]?.id || null;

        container.innerHTML = `
            <div class="mel-proyecto-toolbar card">
                <div>
                    <div class="card-title">Indicadores MEL Proyecto</div>
                    <p class="module-subtitle">Seguimiento de indicadores Outcome y Output del proyecto PARES.</p>
                </div>
                <div class="mel-toolbar-auth">
                    ${auth
                        ? `<span class="mel-auth-info"><span class="mel-auth-user">${esc(auth.username).toUpperCase()}</span><button id="mel-proyecto-logout" class="btn-outline-sm" title="Cerrar sesion">Cerrar sesion</button></span>`
                        : `<button id="mel-proyecto-login-toggle" class="btn-light">Ingreso admin</button>`
                    }
                </div>
                <div class="mel-proyecto-actions">
                    <select id="mel-proyecto-type-filter" class="filter-select" title="Tipo">
                        <option value="all">Todos</option>
                        <option value="outcome">Outcomes</option>
                        <option value="output">Outputs</option>
                    </select>
                    <input id="mel-proyecto-search" class="filter-input" type="search" placeholder="Buscar indicador, LQ o nivel" />
                    <button id="mel-proyecto-export-xlsx" class="btn-light" type="button">Exportar XLS</button>
                </div>
            </div>

            <div id="mel-proyecto-login-panel" class="mel-login-panel"></div>

            <div class="summary-bar">
                <div class="summary-chip"><strong>${summary.total_indicadores}</strong> Indicadores</div>
                <div class="summary-chip"><strong>${summary.outcomes}</strong> Outcomes</div>
                <div class="summary-chip"><strong>${summary.outputs}</strong> Outputs</div>
                <div class="summary-chip"><strong>${pctLabel(summary.avance_promedio)}</strong> Avance promedio</div>
                <div class="summary-chip"><strong>${summary.cumplidos}</strong> Cumplidos</div>
                <div class="summary-chip"><strong>${summary.incompletos}</strong> Fuente incompleta</div>
            </div>

            <section class="card mel-lq-card">
                <div class="card-header">
                    <h2 class="card-title">Preguntas de aprendizaje</h2>
                </div>
                <div class="mel-lq-grid">
                    ${learningQuestionLabels.map(([code, question]) => `
                        <div class="mel-lq-item">
                            <strong>${esc(code)}</strong>
                            <span>${esc(question)}</span>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="card mel-proyecto-list-card">
                <div class="card-header">
                    <h2 class="card-title">Indicadores del proyecto</h2>
                    <span id="mel-proyecto-count" class="badge badge-media">${records.length} visibles</span>
                </div>
                <div id="mel-proyecto-list" class="mel-proyecto-list"></div>
            </section>

            ${auth ? `
                <section class="card mel-edit-card">
                    <div class="card-header">
                        <h2 class="card-title">Edicion de indicador</h2>
                        <span class="badge badge-media">Admin activo</span>
                    </div>
                    <div id="mel-proyecto-editor"></div>
                </section>
            ` : ''}
        `;

        const currentList = () => {
            const type = container.querySelector('#mel-proyecto-type-filter').value;
            const search = container.querySelector('#mel-proyecto-search').value.trim().toLowerCase();
            return records.filter(row => {
                const matchesType = type === 'all' || row.tipo === type;
                const haystack = `${row.indicador || ''} ${row.nivel || ''} ${row.lq || ''} ${row.notas || ''}`.toLowerCase();
                return matchesType && (!search || haystack.includes(search));
            });
        };

        const renderList = () => {
            const list = currentList();
            container.querySelector('#mel-proyecto-count').textContent = `${list.length} visibles`;
            container.querySelector('#mel-proyecto-list').innerHTML = list.map(row => `
                <article class="mel-proyecto-item ${row.id === selectedId ? 'is-selected' : ''}" data-id="${row.id}">
                    <div class="mel-proyecto-item-head">
                        <span class="badge badge-${row.tipo === 'output' ? 'media' : 'alta'}">${esc(row.tipo)}</span>
                        ${row.estado_fuente === 'incompleto' ? '<span class="badge badge-baja">Fuente incompleta</span>' : ''}
                    </div>
                    <h3>${esc(row.indicador)}</h3>
                    ${lqCodes(row.lq).length ? `
                        <div class="mel-proyecto-related-lqs">
                            <b>Preguntas relacionadas:</b>
                            <span>${lqCodes(row.lq).map(code => `<em>${esc(code)}</em>`).join('')}</span>
                        </div>
                    ` : ''}
                    <p>${esc(row.nivel)}</p>
                    <div class="mel-proyecto-context-grid">
                        <div class="mel-proyecto-context-item">
                            <b>Instrumento de medicion</b>
                            <span>${esc(row.herramienta)}</span>
                        </div>
                        <div class="mel-proyecto-context-item">
                            <b>Evidencia</b>
                            <span>${esc(row.evidencia)}</span>
                        </div>
                        <div class="mel-proyecto-context-item">
                            <b>Fuente</b>
                            <span>${esc(row.fuente_informacion)}</span>
                        </div>
                    </div>
                    ${row.notas ? `
                        <div class="mel-proyecto-notas">
                            <b>Notas</b>
                            <p>${esc(row.notas)}</p>
                        </div>
                    ` : ''}
                    <div class="mel-proyecto-meta">
                        <span><b>Linea base</b>${esc(row.linea_base)}</span>
                        <span><b>Meta</b>${esc(row.meta)}</span>
                        <span><b>Avance fuente</b>${esc(row.avance)}</span>
                        <span><b>Porcentaje</b>${pctLabel(row.porcentaje_avance)}</span>
                        <span><b>Frecuencia</b>${esc(row.frecuencia)}</span>
                    </div>
                    <div class="mel-progress-cell">
                        <span>${pctLabel(row.porcentaje_avance)}</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${pctWidth(row.porcentaje_avance)}%"></div></div>
                    </div>
                </article>
            `).join('') || '<div class="empty-state-text">Sin indicadores para el filtro seleccionado</div>';
            container.querySelectorAll('.mel-proyecto-item').forEach(item => {
                item.addEventListener('click', () => {
                    selectedId = Number(item.dataset.id);
                    renderList();
                    if (auth) renderEditor(records.find(row => row.id === selectedId));
                });
            });
        };

        const renderEditor = (row) => {
            const editor = container.querySelector('#mel-proyecto-editor');
            if (!editor) return;
            if (!row) {
                editor.innerHTML = '<div class="empty-state-text">Sin indicador seleccionado</div>';
                return;
            }
            const disabled = auth ? '' : 'disabled';
            const options = currentList().map(item =>
                `<option value="${item.id}" ${item.id === row.id ? 'selected' : ''}>${esc(item.tipo)} | ${esc(item.indicador).slice(0, 120)}</option>`
            ).join('');
            const sliderValue = pctWidth(row.porcentaje_avance);
            editor.innerHTML = `
                <div class="mel-editor">
                    <label class="mel-entry-select">Indicador
                        <select id="mel-proyecto-entry">${options}</select>
                    </label>
                    <div class="mel-editor-context">
                        <b>${esc(row.tipo).toUpperCase()} | fila Excel ${esc(row.row)}</b>
                        <span>${esc(row.estado_fuente)}</span>
                        <p>${esc(row.indicador)}</p>
                    </div>
                    <div class="mel-edit-fields">
                        <label>Tipo
                            <select ${disabled} data-field="tipo">
                                <option value="outcome" ${row.tipo === 'outcome' ? 'selected' : ''}>outcome</option>
                                <option value="output" ${row.tipo === 'output' ? 'selected' : ''}>output</option>
                            </select>
                        </label>
                        <label>Linea base<input ${disabled} data-field="linea_base" value="${textValue(row.linea_base)}"></label>
                        <label>Meta<input ${disabled} data-field="meta" value="${textValue(row.meta)}"></label>
                        <label>Avance fuente<input ${disabled} data-field="avance" value="${textValue(row.avance)}"></label>
                        <label>Porcentaje fuente<input ${disabled} data-field="porcentaje" value="${textValue(row.porcentaje)}"></label>
                        <label class="span-2">Nivel / Output<textarea ${disabled} data-field="nivel">${textValue(row.nivel)}</textarea></label>
                        <label class="span-2">Indicador<textarea ${disabled} data-field="indicador">${textValue(row.indicador)}</textarea></label>
                        <label class="span-2">Instrumento de medicion<textarea ${disabled} data-field="herramienta">${textValue(row.herramienta)}</textarea></label>
                        <label class="span-2">Evidencia<textarea ${disabled} data-field="evidencia">${textValue(row.evidencia)}</textarea></label>
                        <label>Meta numerica<input ${disabled} data-field="meta_numerica" type="number" step="any" value="${textValue(row.meta_numerica)}"></label>
                        <label>Avance numerico<input ${disabled} data-field="valor_actual" type="number" step="any" value="${textValue(row.valor_actual)}"></label>
                        <label>Estado fuente
                            <select ${disabled} data-field="estado_fuente">
                                <option value="completo" ${row.estado_fuente === 'completo' ? 'selected' : ''}>completo</option>
                                <option value="incompleto" ${row.estado_fuente === 'incompleto' ? 'selected' : ''}>incompleto</option>
                            </select>
                        </label>
                        <label class="span-2">Fuente de informacion<textarea ${disabled} data-field="fuente_informacion">${textValue(row.fuente_informacion)}</textarea></label>
                        <label>Frecuencia<input ${disabled} data-field="frecuencia" value="${textValue(row.frecuencia)}"></label>
                        <label>LQ<input ${disabled} data-field="lq" value="${textValue(row.lq)}"></label>
                        <label class="span-2">Notas<textarea ${disabled} data-field="notas">${textValue(row.notas)}</textarea></label>
                    </div>
                    <div class="mel-proyecto-slider-panel">
                        <label>Porcentaje de avance</label>
                        <div class="kpi-slider-row">
                            <input id="mel-proyecto-progress" ${disabled} class="kpi-slider" data-field="porcentaje_avance" type="range" min="0" max="100" step="1" value="${sliderValue}">
                            <span id="mel-proyecto-progress-value" class="slider-val">${sliderValue}%</span>
                        </div>
                        <div class="progress-bar"><div id="mel-proyecto-progress-preview" class="progress-fill" style="width:${sliderValue}%"></div></div>
                    </div>
                    <div class="actions-row">
                        <button id="mel-proyecto-save" class="btn-primary" ${disabled}>Guardar cambios</button>
                    </div>
                </div>
            `;

            container.querySelector('#mel-proyecto-entry').addEventListener('change', (event) => {
                selectedId = Number(event.target.value);
                renderList();
                renderEditor(records.find(item => item.id === selectedId));
            });

            const slider = container.querySelector('#mel-proyecto-progress');
            if (slider) {
                slider.addEventListener('input', () => {
                    container.querySelector('#mel-proyecto-progress-value').textContent = `${slider.value}%`;
                    container.querySelector('#mel-proyecto-progress-preview').style.width = `${slider.value}%`;
                });
            }

            const save = container.querySelector('#mel-proyecto-save');
            if (save) {
                save.addEventListener('click', async () => {
                    const payload = {};
                    editor.querySelectorAll('[data-field]').forEach(el => {
                        if (el.dataset.field === 'porcentaje_avance') {
                            payload[el.dataset.field] = Number(el.value) / 100;
                        } else if (['meta_numerica', 'valor_actual'].includes(el.dataset.field)) {
                            payload[el.dataset.field] = el.value === '' ? null : Number(el.value);
                        } else {
                            payload[el.dataset.field] = el.value;
                        }
                    });
                    save.textContent = 'Guardando...';
                    try {
                        const updated = await api.melProyectoUpdate(row.id, payload, auth.token);
                        Object.assign(row, updated);
                        save.textContent = 'Guardado';
                        setTimeout(() => save.textContent = 'Guardar cambios', 1200);
                        renderList();
                        renderEditor(row);
                    } catch (err) {
                        save.textContent = 'Error';
                        setTimeout(() => save.textContent = 'Guardar cambios', 1600);
                        alert(err.message);
                    }
                });
            }
        };

        container.querySelector('#mel-proyecto-type-filter').addEventListener('change', () => {
            selectedId = currentList()[0]?.id || null;
            renderList();
            if (auth) renderEditor(records.find(row => row.id === selectedId));
        });
        container.querySelector('#mel-proyecto-search').addEventListener('input', () => {
            selectedId = currentList()[0]?.id || null;
            renderList();
            if (auth) renderEditor(records.find(row => row.id === selectedId));
        });
        container.querySelector('#mel-proyecto-export-xlsx').addEventListener('click', async (event) => {
            const button = event.currentTarget;
            const original = button.textContent;
            button.textContent = 'Exportando...';
            button.disabled = true;
            try {
                await api.melProyectoExport({
                    tipo: container.querySelector('#mel-proyecto-type-filter').value,
                    search: container.querySelector('#mel-proyecto-search').value.trim(),
                });
            } catch (err) {
                alert(`No se pudo exportar: ${err.message}`);
            } finally {
                button.textContent = original;
                button.disabled = false;
            }
        });

        if (auth) {
            container.querySelector('#mel-proyecto-logout').addEventListener('click', () => {
                localStorage.removeItem(authKey);
                navigate('#melProyecto');
            });
        } else {
            container.querySelector('#mel-proyecto-login-toggle').addEventListener('click', () => {
                container.querySelector('#mel-proyecto-login-panel').innerHTML = `
                    <form id="mel-proyecto-login-form" class="mel-login">
                        <label>Usuario admin<input name="username" autocomplete="username" required placeholder="admin"></label>
                        <label>Contrasena<input name="password" type="password" autocomplete="current-password" required></label>
                        <button class="btn-primary" type="submit">Ingresar</button>
                        <span id="mel-proyecto-login-error"></span>
                    </form>
                `;
                container.querySelector('#mel-proyecto-login-form').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const form = new FormData(event.target);
                    try {
                        const session = await api.melProyectoLogin({
                            username: form.get('username'),
                            password: form.get('password'),
                        });
                        localStorage.setItem(authKey, JSON.stringify(session));
                        navigate('#melProyecto');
                    } catch (err) {
                        container.querySelector('#mel-proyecto-login-error').textContent = err.message;
                    }
                });
            });
        }

        renderList();
        if (auth) renderEditor(records.find(row => row.id === selectedId));
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">!</div><div class="empty-state-text">Error al cargar MEL Proyecto: ${esc(e.message)}</div></div>`;
    }
});
