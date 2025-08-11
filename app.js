// Aplikasi WebGIS Yogyakarta menggunakan OpenLayers

// Inisialisasi variabel global
let map;
let vectorLayers = {};
let interactions = {};
let currentTool = null;
let popup;
let measureTooltip;

// Inisialisasi peta saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupLayers();
    setupControls();
    setupEventListeners();
});

// Fungsi untuk menginisialisasi peta
function initializeMap() {
    // Setup popup
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    popup = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });

    closer.onclick = function() {
        popup.setPosition(undefined);
        closer.blur();
        return false;
    };

    // Inisialisasi peta
    map = new ol.Map({
        target: 'map',
        overlays: [popup],
        view: new ol.View({
            center: ol.proj.fromLonLat([110.3695, -7.7956]), // Pusat Yogyakarta
            zoom: 11,
            minZoom: 8,
            maxZoom: 18
        })
    });

    // Tambahkan kontrol tambahan
    map.addControl(new ol.control.ScaleLine());
    map.addControl(new ol.control.MousePosition({
        coordinateFormat: function(coord) {
            return ol.coordinate.format(coord, 'Lat: {y}, Lon: {x}', 6);
        },
        projection: 'EPSG:4326',
        target: document.getElementById('coordinates')
    }));

    // Event listener untuk menampilkan koordinat
    map.on('pointermove', function(evt) {
        const coord = ol.proj.toLonLat(evt.coordinate);
        document.getElementById('coordinates').innerHTML = 
            `Lat: ${coord[1].toFixed(6)}, Lon: ${coord[0].toFixed(6)}`;
    });

    // Event listener untuk popup informasi
    map.on('singleclick', function(evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });

        if (feature) {
            const properties = feature.getProperties();
            const geometry = feature.getGeometry();
            
            let popupContent = `<h3>${properties.name || 'Tanpa Nama'}</h3>`;
            
            // Tampilkan informasi berdasarkan tipe feature
            if (properties.type) {
                popupContent += `<p><strong>Tipe:</strong> ${properties.type}</p>`;
            }
            
            if (properties.description) {
                popupContent += `<p><strong>Deskripsi:</strong> ${properties.description}</p>`;
            }
            
            // Informasi spesifik untuk tempat wisata
            if (properties.category) {
                popupContent += `<p><strong>Kategori:</strong> ${properties.category}</p>`;
            }
            
            if (properties.rating) {
                popupContent += `<p><strong>Rating:</strong> ${properties.rating}/5 ⭐</p>`;
            }
            
            if (properties.entrance_fee) {
                popupContent += `<p><strong>Tiket:</strong> ${properties.entrance_fee}</p>`;
            }
            
            // Informasi untuk jalan
            if (properties.length_km) {
                popupContent += `<p><strong>Panjang:</strong> ${properties.length_km} km</p>`;
            }
            
            if (properties.speed_limit) {
                popupContent += `<p><strong>Batas Kecepatan:</strong> ${properties.speed_limit} km/h</p>`;
            }
            
            // Informasi untuk kecamatan
            if (properties.population) {
                popupContent += `<p><strong>Populasi:</strong> ${properties.population.toLocaleString()} jiwa</p>`;
            }
            
            if (properties.area_km2) {
                popupContent += `<p><strong>Luas:</strong> ${properties.area_km2} km²</p>`;
            }
            
            if (properties.density_per_km2) {
                popupContent += `<p><strong>Kepadatan:</strong> ${properties.density_per_km2.toLocaleString()} jiwa/km²</p>`;
            }

            content.innerHTML = popupContent;
            
            let coordinate = evt.coordinate;
            if (geometry.getType() === 'Polygon') {
                coordinate = geometry.getInteriorPoint().getCoordinates();
            } else if (geometry.getType() === 'LineString') {
                const coords = geometry.getCoordinates();
                coordinate = coords[Math.floor(coords.length / 2)];
            }
            
            popup.setPosition(coordinate);
        } else {
            popup.setPosition(undefined);
        }
    });
}

// Fungsi untuk setup layers
function setupLayers() {
    // Base maps
    const osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: 'OpenStreetMap',
        type: 'base'
    });

    const satelliteLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles © Esri'
        }),
        title: 'Satellite',
        type: 'base',
        visible: false
    });

    map.addLayer(osmLayer);
    map.addLayer(satelliteLayer);

    // Style functions
    const pointStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({color: '#ff4444'}),
            stroke: new ol.style.Stroke({color: '#ffffff', width: 2})
        })
    });

    const lineStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#0066cc',
            width: 3
        })
    });

    const polygonStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0, 100, 200, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#0066cc',
            width: 2
        })
    });

    // Tourist spots layer
    let pointsFeatures = [];
    try {
        pointsFeatures = new ol.format.GeoJSON().readFeatures(window.touristSpots, {
            featureProjection: 'EPSG:3857'
        });
    } catch (e) {
        console.error('Gagal load data titik:', e);
    }
    vectorLayers.points = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: pointsFeatures
        }),
        style: function(feature) {
            const category = feature.get('category');
            let color = '#ff4444';
            
            switch(category) {
                case 'Sejarah': color = '#8B4513'; break;
                case 'Budaya': color = '#FF6347'; break;
                case 'Alam': color = '#32CD32'; break;
                case 'Belanja': color = '#FFD700'; break;
                case 'Petualangan': color = '#FF4500'; break;
                default: color = '#ff4444';
            }
            
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({color: color}),
                    stroke: new ol.style.Stroke({color: '#ffffff', width: 2})
                }),
                text: new ol.style.Text({
                    text: feature.get('name'),
                    offsetY: -25,
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({color: '#fff', width: 2}),
                    font: '12px Arial'
                })
            });
        },
        title: 'Tourist Spots'
    });

    // Roads layer
    let roadsFeatures = [];
    try {
        roadsFeatures = new ol.format.GeoJSON().readFeatures(window.mainRoads, {
            featureProjection: 'EPSG:3857'
        });
    } catch (e) {
        console.error('Gagal load data jalan:', e);
    }
    vectorLayers.roads = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: roadsFeatures
        }),
        style: function(feature) {
            const roadType = feature.get('type');
            let color = '#0066cc';
            let width = 3;
            
            switch(roadType) {
                case 'Jalan Provinsi': 
                    color = '#FF6B35'; 
                    width = 4; 
                    break;
                case 'Jalan Kota': 
                    color = '#4ECDC4'; 
                    width = 5; 
                    break;
                case 'Jalan Kabupaten': 
                    color = '#45B7D1'; 
                    width = 3; 
                    break;
            }
            
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: color,
                    width: width
                })
            });
        },
        title: 'Roads'
    });

    // Districts layer
    let districtsFeatures = [];
    try {
        districtsFeatures = new ol.format.GeoJSON().readFeatures(window.districts, {
            featureProjection: 'EPSG:3857'
        });
    } catch (e) {
        console.error('Gagal load data kecamatan:', e);
    }
    vectorLayers.districts = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: districtsFeatures
        }),
        style: function(feature) {
            const population = feature.get('population');
            let opacity = 0.1;
            
            if (population > 100000) opacity = 0.4;
            else if (population > 50000) opacity = 0.3;
            else if (population > 20000) opacity = 0.2;
            
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: `rgba(34, 139, 34, ${opacity})`
                }),
                stroke: new ol.style.Stroke({
                    color: '#228B22',
                    width: 2
                }),
                text: new ol.style.Text({
                    text: feature.get('name'),
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({color: '#fff', width: 2}),
                    font: 'bold 14px Arial'
                })
            });
        },
        title: 'Districts'
    });

    // Drawing layer
    vectorLayers.drawing = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: function(feature) {
            const geometryType = feature.getGeometry().getType();
            
            switch(geometryType) {
                case 'Point':
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 8,
                            fill: new ol.style.Fill({color: '#ff9900'}),
                            stroke: new ol.style.Stroke({color: '#ffffff', width: 2})
                        })
                    });
                case 'LineString':
                    return new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ff9900',
                            width: 3
                        })
                    });
                case 'Polygon':
                    return new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 153, 0, 0.3)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ff9900',
                            width: 2
                        })
                    });
            }
        },
        title: 'User Drawings'
    });

    // Add layers to map
    map.addLayer(vectorLayers.districts);
    map.addLayer(vectorLayers.roads);
    map.addLayer(vectorLayers.points);
    map.addLayer(vectorLayers.drawing);

    // Layer controls
    document.getElementById('basemap-osm').addEventListener('change', function() {
        osmLayer.setVisible(this.checked);
        if (this.checked) {
            satelliteLayer.setVisible(false);
            document.getElementById('basemap-satellite').checked = false;
        }
    });

    document.getElementById('basemap-satellite').addEventListener('change', function() {
        satelliteLayer.setVisible(this.checked);
        if (this.checked) {
            osmLayer.setVisible(false);
            document.getElementById('basemap-osm').checked = false;
        }
    });

    document.getElementById('layer-points').addEventListener('change', function() {
        vectorLayers.points.setVisible(this.checked);
    });

    document.getElementById('layer-roads').addEventListener('change', function() {
        vectorLayers.roads.setVisible(this.checked);
    });

    document.getElementById('layer-districts').addEventListener('change', function() {
        vectorLayers.districts.setVisible(this.checked);
    });

    // Zoom ke extent Yogyakarta agar peta pasti tampil
    setTimeout(function() {
        if (window.yogyakartaBounds) {
            const extent = ol.proj.transformExtent(window.yogyakartaBounds, 'EPSG:4326', 'EPSG:3857');
            map.getView().fit(extent, { padding: [20, 20, 20, 20], duration: 1000 });
        }
    }, 500);
}

// Fungsi untuk setup controls dan interactions
function setupControls() {
    // Drawing interactions
    interactions.drawPoint = new ol.interaction.Draw({
        source: vectorLayers.drawing.getSource(),
        type: 'Point'
    });

    interactions.drawLine = new ol.interaction.Draw({
        source: vectorLayers.drawing.getSource(),
        type: 'LineString'
    });

    interactions.drawPolygon = new ol.interaction.Draw({
        source: vectorLayers.drawing.getSource(),
        type: 'Polygon'
    });

    // Measurement interactions
    interactions.measureDistance = new ol.interaction.Draw({
        source: new ol.source.Vector(),
        type: 'LineString',
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 3,
                lineDash: [10, 10]
            })
        })
    });

    interactions.measureArea = new ol.interaction.Draw({
        source: new ol.source.Vector(),
        type: 'Polygon',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 204, 51, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 3,
                lineDash: [10, 10]
            })
        })
    });

    // Measurement events
    interactions.measureDistance.on('drawend', function(evt) {
        const geometry = evt.feature.getGeometry();
        const length = ol.sphere.getLength(geometry);
        const output = formatLength(length);
        
        // Create measurement tooltip
        const coordinate = geometry.getLastCoordinate();
        const measurementOverlay = new ol.Overlay({
            element: createMeasurementDiv(output),
            position: coordinate,
            positioning: 'bottom-center',
            offset: [0, -10]
        });
        map.addOverlay(measurementOverlay);
        
        setTimeout(() => {
            deactivateAllTools();
        }, 500);
    });

    interactions.measureArea.on('drawend', function(evt) {
        const geometry = evt.feature.getGeometry();
        const area = ol.sphere.getArea(geometry);
        const output = formatArea(area);
        
        // Create measurement tooltip
        const coordinate = geometry.getInteriorPoint().getCoordinates();
        const measurementOverlay = new ol.Overlay({
            element: createMeasurementDiv(output),
            position: coordinate,
            positioning: 'center-center'
        });
        map.addOverlay(measurementOverlay);
        
        setTimeout(() => {
            deactivateAllTools();
        }, 500);
    });
}

// Helper functions untuk measurement
function formatLength(length) {
    if (length > 1000) {
        return (Math.round(length / 1000 * 100) / 100) + ' km';
    } else {
        return (Math.round(length * 100) / 100) + ' m';
    }
}

function formatArea(area) {
    if (area > 10000) {
        return (Math.round(area / 1000000 * 100) / 100) + ' km²';
    } else {
        return (Math.round(area * 100) / 100) + ' m²';
    }
}

function createMeasurementDiv(text) {
    const div = document.createElement('div');
    div.className = 'measurement-tooltip';
    div.style.display = 'block';
    div.innerHTML = text;
    return div;
}

// Event listeners
function setupEventListeners() {
    // Tool buttons
    document.getElementById('btn-draw-point').addEventListener('click', function() {
        activateTool('drawPoint');
    });

    document.getElementById('btn-draw-line').addEventListener('click', function() {
        activateTool('drawLine');
    });

    document.getElementById('btn-draw-polygon').addEventListener('click', function() {
        activateTool('drawPolygon');
    });

    document.getElementById('btn-measure-distance').addEventListener('click', function() {
        activateTool('measureDistance');
    });

    document.getElementById('btn-measure-area').addEventListener('click', function() {
        activateTool('measureArea');
    });

    document.getElementById('btn-clear').addEventListener('click', function() {
        clearDrawings();
    });

    // Search functionality
    document.getElementById('btn-search').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Tool management functions
function activateTool(toolName) {
    deactivateAllTools();
    
    if (interactions[toolName]) {
        map.addInteraction(interactions[toolName]);
        currentTool = toolName;
        
        // Update button states
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-${toolName.replace(/([A-Z])/g, '-$1').toLowerCase()}`).classList.add('active');
    }
}

function deactivateAllTools() {
    Object.values(interactions).forEach(interaction => {
        map.removeInteraction(interaction);
    });
    
    currentTool = null;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
}

function clearDrawings() {
    vectorLayers.drawing.getSource().clear();
    
    // Clear measurement overlays
    map.getOverlays().getArray().slice().forEach(overlay => {
        if (overlay.getElement().className === 'measurement-tooltip') {
            map.removeOverlay(overlay);
        }
    });
    
    deactivateAllTools();
}

// Search functionality
function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (!query) return;
    
    const allFeatures = [];
    
    // Search in all vector layers
    Object.values(vectorLayers).forEach(layer => {
        if (layer.getSource) {
            layer.getSource().getFeatures().forEach(feature => {
                const properties = feature.getProperties();
                const name = (properties.name || '').toLowerCase();
                const type = (properties.type || '').toLowerCase();
                const description = (properties.description || '').toLowerCase();
                
                if (name.includes(query) || type.includes(query) || description.includes(query)) {
                    allFeatures.push(feature);
                }
            });
        }
    });
    
    if (allFeatures.length > 0) {
        // Zoom to first result
        const geometry = allFeatures[0].getGeometry();
        const view = map.getView();
        
        if (geometry.getType() === 'Point') {
            view.animate({
                center: geometry.getCoordinates(),
                zoom: 15,
                duration: 1000
            });
        } else {
            view.fit(geometry, {
                padding: [50, 50, 50, 50],
                duration: 1000
            });
        }
        
        // Show results in info panel
        const infoPanel = document.getElementById('feature-info');
        let resultsHtml = `<h4>Hasil Pencarian: ${allFeatures.length} ditemukan</h4>`;
        
        allFeatures.slice(0, 5).forEach(feature => {
            const props = feature.getProperties();
            resultsHtml += `
                <div style="border-bottom: 1px solid #eee; padding: 5px 0;">
                    <strong>${props.name || 'Tanpa Nama'}</strong><br>
                    <small>${props.type || ''} - ${props.description || ''}</small>
                </div>
            `;
        });
        
        if (allFeatures.length > 5) {
            resultsHtml += `<p><em>... dan ${allFeatures.length - 5} lainnya</em></p>`;
        }
        
        infoPanel.innerHTML = resultsHtml;
    } else {
        document.getElementById('feature-info').innerHTML = '<p>Tidak ada hasil ditemukan</p>';
    }
}

// Utility functions
function zoomToExtent() {
    const extent = ol.proj.transformExtent(yogyakartaBounds, 'EPSG:4326', 'EPSG:3857');
    map.getView().fit(extent, {
        padding: [20, 20, 20, 20],
        duration: 1000
    });
}

// Initialize zoom to Yogyakarta extent
setTimeout(zoomToExtent, 1000);
