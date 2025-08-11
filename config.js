// Konfigurasi aplikasi WebGIS
const config = {
    // Pengaturan peta default
    map: {
        center: [110.3695, -7.7956], // Koordinat pusat Yogyakarta
        zoom: 11,
        minZoom: 8,
        maxZoom: 18,
        projection: 'EPSG:3857' // Web Mercator
    },

    // Batas wilayah Yogyakarta
    bounds: {
        southwest: [110.2500, -7.9500],
        northeast: [110.5000, -7.6500]
    },

    // Konfigurasi layer
    layers: {
        basemaps: {
            osm: {
                title: 'OpenStreetMap',
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors'
            },
            satellite: {
                title: 'Satellite',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: 'Tiles © Esri'
            },
            terrain: {
                title: 'Terrain',
                url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
                attribution: 'Map tiles by Stamen Design'
            }
        },
        
        // Styling untuk berbagai tipe fitur
        styles: {
            tourist_spots: {
                'Sejarah': '#8B4513',
                'Budaya': '#FF6347', 
                'Alam': '#32CD32',
                'Belanja': '#FFD700',
                'Petualangan': '#FF4500',
                'default': '#ff4444'
            },
            
            roads: {
                'Jalan Provinsi': { color: '#FF6B35', width: 4 },
                'Jalan Kota': { color: '#4ECDC4', width: 5 },
                'Jalan Kabupaten': { color: '#45B7D1', width: 3 },
                'default': { color: '#0066cc', width: 3 }
            },
            
            districts: {
                fill: 'rgba(34, 139, 34, 0.2)',
                stroke: '#228B22',
                strokeWidth: 2
            }
        }
    },

    // Konfigurasi tools
    tools: {
        drawing: {
            point: { color: '#ff9900', size: 8 },
            line: { color: '#ff9900', width: 3 },
            polygon: { 
                fill: 'rgba(255, 153, 0, 0.3)', 
                stroke: '#ff9900', 
                strokeWidth: 2 
            }
        },
        
        measurement: {
            distance: { 
                color: '#ffcc33', 
                width: 3, 
                lineDash: [10, 10] 
            },
            area: { 
                fill: 'rgba(255, 204, 51, 0.3)', 
                stroke: '#ffcc33', 
                strokeWidth: 3, 
                lineDash: [10, 10] 
            }
        }
    },

    // Konfigurasi UI
    ui: {
        sidebar: {
            width: 300,
            collapsible: true
        },
        
        popup: {
            maxWidth: 400,
            closeButton: true,
            autoPan: true
        },
        
        coordinates: {
            format: 'Lat: {y}, Lon: {x}',
            precision: 6
        }
    },

    // Konfigurasi pencarian
    search: {
        fields: ['name', 'type', 'description', 'category'],
        maxResults: 10,
        minLength: 2
    },

    // API endpoints (jika menggunakan server)
    api: {
        baseUrl: 'http://localhost:3000/api',
        endpoints: {
            search: '/search',
            upload: '/upload',
            export: '/export'
        }
    },

    // Pengaturan ekspor/impor
    export: {
        formats: ['geojson', 'kml', 'gpx'],
        filename: 'webgis_yogyakarta'
    }
};

// Export konfigurasi
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
