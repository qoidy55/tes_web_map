// Utilitas untuk ekspor dan impor data GIS
class GISUtils {
    
    // Ekspor data ke berbagai format
    static exportData(layer, format = 'geojson', filename = 'data') {
        const features = layer.getSource().getFeatures();
        
        switch (format.toLowerCase()) {
            case 'geojson':
                this.exportGeoJSON(features, filename);
                break;
            case 'kml':
                this.exportKML(features, filename);
                break;
            case 'csv':
                this.exportCSV(features, filename);
                break;
            default:
                console.error('Format tidak didukung:', format);
        }
    }
    
    // Ekspor ke GeoJSON
    static exportGeoJSON(features, filename) {
        const format = new ol.format.GeoJSON();
        const geojson = format.writeFeaturesObject(features, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
        });
        
        this.downloadFile(
            JSON.stringify(geojson, null, 2),
            `${filename}.geojson`,
            'application/json'
        );
    }
    
    // Ekspor ke KML
    static exportKML(features, filename) {
        const format = new ol.format.KML();
        const kml = format.writeFeatures(features, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
        });
        
        this.downloadFile(
            kml,
            `${filename}.kml`,
            'application/vnd.google-earth.kml+xml'
        );
    }
    
    // Ekspor ke CSV (hanya untuk point features)
    static exportCSV(features, filename) {
        const pointFeatures = features.filter(f => 
            f.getGeometry().getType() === 'Point'
        );
        
        if (pointFeatures.length === 0) {
            alert('Tidak ada data titik untuk diekspor ke CSV');
            return;
        }
        
        let csv = 'Name,Longitude,Latitude,Type,Description\n';
        
        pointFeatures.forEach(feature => {
            const coords = ol.proj.toLonLat(feature.getGeometry().getCoordinates());
            const props = feature.getProperties();
            
            const row = [
                props.name || '',
                coords[0].toFixed(6),
                coords[1].toFixed(6),
                props.type || '',
                (props.description || '').replace(/,/g, ';')
            ].join(',');
            
            csv += row + '\n';
        });
        
        this.downloadFile(csv, `${filename}.csv`, 'text/csv');
    }
    
    // Fungsi helper untuk download file
    static downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
    
    // Impor data dari file
    static importData(file, layer, callback) {
        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();
        
        reader.onload = function(e) {
            try {
                let features = [];
                
                switch (extension) {
                    case 'geojson':
                    case 'json':
                        features = GISUtils.parseGeoJSON(e.target.result);
                        break;
                    case 'kml':
                        features = GISUtils.parseKML(e.target.result);
                        break;
                    case 'csv':
                        features = GISUtils.parseCSV(e.target.result);
                        break;
                    default:
                        throw new Error('Format file tidak didukung: ' + extension);
                }
                
                // Tambahkan features ke layer
                layer.getSource().addFeatures(features);
                
                // Zoom ke extent features baru
                if (features.length > 0) {
                    const extent = layer.getSource().getExtent();
                    map.getView().fit(extent, { padding: [20, 20, 20, 20] });
                }
                
                if (callback) callback(features);
                
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error saat mengimpor data: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }
    
    // Parse GeoJSON
    static parseGeoJSON(content) {
        const format = new ol.format.GeoJSON();
        const geojson = JSON.parse(content);
        
        return format.readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
    }
    
    // Parse KML
    static parseKML(content) {
        const format = new ol.format.KML();
        
        return format.readFeatures(content, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
    }
    
    // Parse CSV (membuat point features)
    static parseCSV(content) {
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const features = [];
        
        // Cari index kolom yang diperlukan
        const nameIdx = headers.findIndex(h => h.includes('name'));
        const lonIdx = headers.findIndex(h => h.includes('lon') || h.includes('lng') || h.includes('x'));
        const latIdx = headers.findIndex(h => h.includes('lat') || h.includes('y'));
        const typeIdx = headers.findIndex(h => h.includes('type'));
        const descIdx = headers.findIndex(h => h.includes('desc'));
        
        if (lonIdx === -1 || latIdx === -1) {
            throw new Error('Kolom longitude/latitude tidak ditemukan');
        }
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            
            const lon = parseFloat(values[lonIdx]);
            const lat = parseFloat(values[latIdx]);
            
            if (isNaN(lon) || isNaN(lat)) continue;
            
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([lon, lat])
                )
            });
            
            // Set properties
            if (nameIdx !== -1) feature.set('name', values[nameIdx] || '');
            if (typeIdx !== -1) feature.set('type', values[typeIdx] || '');
            if (descIdx !== -1) feature.set('description', values[descIdx] || '');
            
            features.push(feature);
        }
        
        return features;
    }
    
    // Fungsi untuk menyimpan state aplikasi
    static saveState(layers) {
        const state = {
            timestamp: new Date().toISOString(),
            center: ol.proj.toLonLat(map.getView().getCenter()),
            zoom: map.getView().getZoom(),
            layers: {}
        };
        
        Object.keys(layers).forEach(layerName => {
            const features = layers[layerName].getSource().getFeatures();
            if (features.length > 0) {
                const format = new ol.format.GeoJSON();
                state.layers[layerName] = format.writeFeaturesObject(features, {
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                });
            }
        });
        
        localStorage.setItem('webgis_state', JSON.stringify(state));
    }
    
    // Fungsi untuk memuat state aplikasi
    static loadState(layers) {
        const stateStr = localStorage.getItem('webgis_state');
        if (!stateStr) return false;
        
        try {
            const state = JSON.parse(stateStr);
            
            // Restore map view
            map.getView().setCenter(ol.proj.fromLonLat(state.center));
            map.getView().setZoom(state.zoom);
            
            // Restore layers
            Object.keys(state.layers).forEach(layerName => {
                if (layers[layerName]) {
                    const format = new ol.format.GeoJSON();
                    const features = format.readFeatures(state.layers[layerName], {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                    layers[layerName].getSource().addFeatures(features);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error loading state:', error);
            return false;
        }
    }
    
    // Utility untuk format koordinat
    static formatCoordinate(coord, format = 'dd') {
        const lon = coord[0];
        const lat = coord[1];
        
        switch (format) {
            case 'dd': // Decimal degrees
                return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
                
            case 'dms': // Degrees, minutes, seconds
                return `${this.toDMS(lat, 'lat')}, ${this.toDMS(lon, 'lon')}`;
                
            case 'utm': // UTM (simplified)
                return this.toUTM(lat, lon);
                
            default:
                return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        }
    }
    
    // Convert to DMS
    static toDMS(decimal, type) {
        const abs = Math.abs(decimal);
        const degrees = Math.floor(abs);
        const minutesFloat = (abs - degrees) * 60;
        const minutes = Math.floor(minutesFloat);
        const seconds = (minutesFloat - minutes) * 60;
        
        const direction = type === 'lat' 
            ? (decimal >= 0 ? 'N' : 'S')
            : (decimal >= 0 ? 'E' : 'W');
            
        return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;
    }
    
    // Simplified UTM conversion
    static toUTM(lat, lon) {
        // This is a simplified version - for production use a proper UTM library
        const zone = Math.floor((lon + 180) / 6) + 1;
        return `UTM Zone ${zone}: ${lat.toFixed(0)}, ${lon.toFixed(0)}`;
    }
}

// Export untuk penggunaan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GISUtils;
}
