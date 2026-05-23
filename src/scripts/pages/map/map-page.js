import { getStories } from '../../data/api';

export default class MapPage {
  async render() {
    return `
      <section class="container map-container">
        <h1 class="page-title">Peta Cerita</h1>
        <p class="page-subtitle">Jelajahi cerita berdasarkan lokasi</p>
        
        <div id="map" class="map"></div>
        
        <div id="stories-list" class="stories-list-map">
          <h2>Daftar Cerita</h2>
          <div id="map-stories"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Load Leaflet CSS and JS dynamically
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    leafletCSS.crossOrigin = 'anonymous';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    leafletJS.crossOrigin = 'anonymous';
    document.head.appendChild(leafletJS);

    leafletJS.onload = async () => {
      try {
        const result = await getStories(1, true);
        
        if (result.error) {
          document.getElementById('map-stories').innerHTML = 
            `<p class="error-text">Gagal memuat cerita: ${result.message}</p>`;
          return;
        }

        // Initialize map with default tile layer (OpenStreetMap)
        const map = L.map('map').setView([-2.5489, 118.0149], 5); // Center of Indonesia
        
        // Add tile layers
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        });
        
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18,
        });
        
        osmLayer.addTo(map);
        
        // Add layer control
        const baseMaps = {
          "OpenStreetMap": osmLayer,
          "Satellite": satelliteLayer
        };
        L.control.layers(baseMaps).addTo(map);

        const storiesContainer = document.getElementById('map-stories');
        
        if (!result.listStory || result.listStory.length === 0) {
          storiesContainer.innerHTML = '<p class="empty-text">Belum ada cerita dengan lokasi</p>';
          return;
        }

        // Filter stories with valid coordinates
        const storiesWithLocation = result.listStory.filter(
          story => story.lat && story.lon
        );

        // Create markers and story list
        storiesContainer.innerHTML = storiesWithLocation.map((story, index) => {
          // Add marker to map
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          
          const popupContent = `
            <div class="marker-popup">
              <h3>${story.name}</h3>
              <img src="${story.photoUrl}" alt="${story.description.substring(0, 50)}" style="max-width: 200px;" />
              <p>${story.description}</p>
            </div>
          `;
          marker.bindPopup(popupContent);

          return `
            <article class="story-card-map" data-index="${index}">
              <img src="${story.photoUrl}" alt="${story.description.substring(0, 50)}" loading="lazy" />
              <div class="story-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <small class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID')}</small>
              </div>
            </article>
          `;
        }).join('');

        // Add click event to highlight markers
        document.querySelectorAll('.story-card-map').forEach((card, index) => {
          card.addEventListener('click', () => {
            const story = storiesWithLocation[index];
            map.setView([story.lat, story.lon], 13);
            
            // Open popup for the corresponding marker
            map.eachLayer((layer) => {
              if (layer.getLatLng && 
                  layer.getLatLng().lat === story.lat && 
                  layer.getLatLng().lng === story.lon) {
                layer.openPopup();
              }
            });
          });
        });

      } catch (error) {
        console.error('Error:', error);
        document.getElementById('map-stories').innerHTML = 
          '<p class="error-text">Terjadi kesalahan saat memuat cerita</p>';
      }
    };
  }
}
