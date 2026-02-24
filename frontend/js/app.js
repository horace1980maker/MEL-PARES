/**
 * App principal — Router por hash, gestión de módulos y filtros globales.
 */
const modules = {};
const state = {
    currentModule: 'inicio',
    filters: { corte: '', paisaje: '', organizacion: '' },
};

/** Registrar un módulo */
function registerModule(name, renderFn) {
    modules[name] = renderFn;
}

/** Navegación por hash */
function navigate(hash) {
    const module = hash.replace('#', '') || 'inicio';
    state.currentModule = module;

    // Actualizar sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.module === module);
    });

    // Título
    const titles = {
        inicio: 'Inicio',
        indicadores: 'Indicadores',
        ruta: 'Ruta del Proyecto',
        comparador: 'Comparador de Cambio',
        aprendizaje: 'Aprendizaje',
        inclusion: 'Inclusión',
        territorio: 'Territorio',
        evidencia: 'Repositorio de Evidencia',
    };
    document.getElementById('page-title').textContent = titles[module] || module.toUpperCase();

    // Renderizar
    const area = document.getElementById('content-area');
    area.innerHTML = '<div class="loading-spinner">Cargando...</div>';

    if (modules[module]) {
        modules[module](area, state.filters);
    } else {
        area.innerHTML = `<div class="empty-state">
            <div class="empty-state-icon">🚧</div>
            <div class="empty-state-text">Módulo "${module}" en construcción</div>
        </div>`;
    }
}

/** Cargar opciones de filtros globales */
async function loadFilters() {
    try {
        const [paisajes, orgs, cortes] = await Promise.all([
            api.paisajes(),
            api.organizaciones(),
            api.cortes(),
        ]);

        const fpaisaje = document.getElementById('filter-paisaje');
        paisajes.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.nombre;
            fpaisaje.appendChild(opt);
        });

        const forg = document.getElementById('filter-organizacion');
        orgs.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.id;
            opt.textContent = o.nombre;
            forg.appendChild(opt);
        });

        const fcorte = document.getElementById('filter-corte');
        cortes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.nombre} (${c.fecha})`;
            fcorte.appendChild(opt);
        });
    } catch (e) {
        console.warn('No se pudieron cargar filtros:', e);
    }
}

/** Inicialización */
document.addEventListener('DOMContentLoaded', () => {
    loadFilters();

    // Listeners de filtros
    ['filter-corte', 'filter-paisaje', 'filter-organizacion'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('change', () => {
            state.filters.corte = document.getElementById('filter-corte').value;
            state.filters.paisaje = document.getElementById('filter-paisaje').value;
            state.filters.organizacion = document.getElementById('filter-organizacion').value;
            navigate(window.location.hash || '#inicio');
        });
    });

    // Hash routing
    window.addEventListener('hashchange', () => navigate(window.location.hash));
    navigate(window.location.hash || '#inicio');
});
