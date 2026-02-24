/**
 * Módulo Territorio — Mapa Leaflet + panel comparativo.
 */
registerModule('territorio', async (container, filters) => {
    try {
        const [paisajes, pilotos] = await Promise.all([
            api.paisajes(),
            api.pilotos({}),
        ]);

        let html = `
        <h2 class="section-title">Mapa de Paisajes y Pilotos</h2>
        <div id="map-container"></div>
        <div class="card" style="margin-top:1.2rem">
            <div class="card-header"><span class="card-title">Comparativo por Paisaje</span></div>
            <div id="territory-table"></div>
        </div>`;

        container.innerHTML = html;

        // Initialize map
        const map = L.map('map-container').setView([14.5, -88.5], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        // Paisaje markers (blue)
        paisajes.forEach(p => {
            if (p.latitud && p.longitud) {
                L.circleMarker([p.latitud, p.longitud], {
                    radius: 10, fillColor: '#001F89', color: '#001F89',
                    weight: 2, fillOpacity: 0.7,
                }).addTo(map).bindPopup(`<strong>${p.nombre}</strong><br>${p.region || ''}<br>${p.pais || ''}`);
            }
        });

        // Pilot markers (magenta)
        pilotos.forEach(p => {
            if (p.latitud && p.longitud) {
                L.circleMarker([p.latitud, p.longitud], {
                    radius: 7, fillColor: '#B71373', color: '#B71373',
                    weight: 2, fillOpacity: 0.8,
                }).addTo(map).bindPopup(`<strong>${p.nombre}</strong><br>Estado: ${p.estado}`);
            }
        });

        // Comparison table
        let tableHtml = `<table class="data-table">
            <thead><tr><th>Paisaje</th><th>País</th><th>Región</th><th>Pilotos</th></tr></thead><tbody>`;
        paisajes.forEach(p => {
            const numPilotos = pilotos.filter(pi => pi.paisaje_id === p.id).length;
            tableHtml += `<tr><td><strong>${p.nombre}</strong></td><td>${p.pais || '—'}</td><td>${p.region || '—'}</td><td>${numPilotos}</td></tr>`;
        });
        tableHtml += `</tbody></table>`;
        if (!paisajes.length) tableHtml = `<div class="empty-state"><div class="empty-state-text">No hay paisajes registrados</div></div>`;
        document.getElementById('territory-table').innerHTML = tableHtml;

        // Resize map after render
        setTimeout(() => map.invalidateSize(), 200);
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Error: ${e.message}</div></div>`;
    }
});
