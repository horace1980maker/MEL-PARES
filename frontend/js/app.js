/**
 * App principal — Router por hash, gestión de módulos y filtros globales.
 */
const modules = {};
const state = {
    currentModule: 'inicio',
};

/** Registrar un módulo */
function registerModule(name, renderFn) {
    modules[name] = renderFn;
}

/** Navegación por hash */
function navigate(hash) {
    const routeAliases = {
        'mel-socios': 'melSocios',
        'mel_socios': 'melSocios',
        melsocios: 'melSocios',
        'mel-proyecto': 'melProyecto',
        'mel_proyecto': 'melProyecto',
        melproyecto: 'melProyecto',
    };
    const requestedModule = hash.replace('#', '') || 'inicio';
    const module = routeAliases[requestedModule] || requestedModule;
    state.currentModule = module;

    // Actualizar sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.module === module);
    });

    // Título
    const titles = {
        inicio: 'Inicio',
        melSocios: 'MEL socios',
        melProyecto: 'MEL Proyecto',
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
        modules[module](area, {});
    } else {
        area.innerHTML = `<div class="empty-state">
            <div class="empty-state-icon">🚧</div>
            <div class="empty-state-text">Módulo "${module}" en construcción</div>
        </div>`;
    }
}

/** Inicialización */
document.addEventListener('DOMContentLoaded', () => {
    // Hash routing
    window.addEventListener('hashchange', () => navigate(window.location.hash));
    navigate(window.location.hash || '#inicio');
});
