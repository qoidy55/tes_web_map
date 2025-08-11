// Analisis Spasial untuk WebGIS
class SpatialAnalysis {
    
    // Buffer analysis - membuat buffer di sekitar feature
    static createBuffer(feature, distance, units = 'meters') {
        const geometry = feature.getGeometry();
        const coordinates = geometry.getCoordinates();
        
        // Convert distance to map units (untuk Web Mercator dalam meter)
        let bufferDistance = distance;
        if (units === 'kilometers') {
            bufferDistance = distance * 1000;
        }
        
        // Simple buffer using circle approximation
        if (geometry.getType() === 'Point') {
            const bufferedGeometry = new ol.geom.Circle(coordinates, bufferDistance);
            
            const bufferFeature = new ol.Feature({
                geometry: ol.geom.Polygon.fromCircle(bufferedGeometry, 64),
                name: `Buffer ${distance} ${units}`,
                type: 'Buffer',
                original_feature: feature.get('name') || 'Unknown'
            });
            
            return bufferFeature;
        }
        
        return null;
    }
    
    // Intersection analysis - mencari fitur yang berpotongan
    static findIntersections(sourceLayer, targetLayer, resultLayer) {
        const sourceFeatures = sourceLayer.getSource().getFeatures();
        const targetFeatures = targetLayer.getSource().getFeatures();
        const intersections = [];
        
        sourceFeatures.forEach(sourceFeature => {
            const sourceGeom = sourceFeature.getGeometry();
            
            targetFeatures.forEach(targetFeature => {
                const targetGeom = targetFeature.getGeometry();
                
                // Simple intersection check using extent
                if (ol.extent.intersects(sourceGeom.getExtent(), targetGeom.getExtent())) {
                    const intersection = new ol.Feature({
                        geometry: sourceGeom, // Simplified - use source geometry
                        name: `Intersection: ${sourceFeature.get('name')} & ${targetFeature.get('name')}`,
                        type: 'Intersection',
                        source_name: sourceFeature.get('name'),
                        target_name: targetFeature.get('name')
                    });
                    
                    intersections.push(intersection);
                }
            });
        });
        
        if (resultLayer) {
            resultLayer.getSource().addFeatures(intersections);
        }
        
        return intersections;
    }
    
    // Point in Polygon analysis
    static pointInPolygon(pointLayer, polygonLayer) {
        const points = pointLayer.getSource().getFeatures();
        const polygons = polygonLayer.getSource().getFeatures();
        const results = [];
        
        points.forEach(point => {
            const pointGeom = point.getGeometry();
            const pointCoord = pointGeom.getCoordinates();
            
            polygons.forEach(polygon => {
                const polygonGeom = polygon.getGeometry();
                
                if (polygonGeom.intersectsCoordinate(pointCoord)) {
                    results.push({
                        point: point,
                        polygon: polygon,
                        pointName: point.get('name') || 'Unknown Point',
                        polygonName: polygon.get('name') || 'Unknown Polygon'
                    });
                }
            });
        });
        
        return results;
    }
    
    // Distance calculation between features
    static calculateDistances(fromFeature, toFeatures) {
        const fromGeom = fromFeature.getGeometry();
        const fromCoord = fromGeom.getType() === 'Point' 
            ? fromGeom.getCoordinates()
            : ol.extent.getCenter(fromGeom.getExtent());
            
        const distances = toFeatures.map(toFeature => {
            const toGeom = toFeature.getGeometry();
            const toCoord = toGeom.getType() === 'Point'
                ? toGeom.getCoordinates()
                : ol.extent.getCenter(toGeom.getExtent());
                
            // Convert coordinates to EPSG:4326 for accurate distance calculation
            const fromLonLat = ol.proj.toLonLat(fromCoord);
            const toLonLat = ol.proj.toLonLat(toCoord);
            
            const distance = this.haversineDistance(fromLonLat, toLonLat);
            
            return {
                feature: toFeature,
                distance: distance,
                name: toFeature.get('name') || 'Unknown'
            };
        });
        
        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);
        
        return distances;
    }
    
    // Haversine formula for distance calculation
    static haversineDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(coord2[1] - coord1[1]);
        const dLon = this.toRadians(coord2[0] - coord1[0]);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRadians(coord1[1])) * Math.cos(this.toRadians(coord2[1])) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
                  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c; // Distance in kilometers
    }
    
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // Nearest neighbor analysis
    static findNearestNeighbors(targetFeature, candidateFeatures, k = 5) {
        const distances = this.calculateDistances(targetFeature, candidateFeatures);
        return distances.slice(0, k);
    }
    
    // Cluster analysis (simple grid-based clustering)
    static clusterFeatures(features, gridSize = 1000) {
        const clusters = new Map();
        
        features.forEach(feature => {
            const geom = feature.getGeometry();
            const coord = geom.getType() === 'Point' 
                ? geom.getCoordinates()
                : ol.extent.getCenter(geom.getExtent());
                
            // Create grid cell ID
            const cellX = Math.floor(coord[0] / gridSize);
            const cellY = Math.floor(coord[1] / gridSize);
            const cellId = `${cellX},${cellY}`;
            
            if (!clusters.has(cellId)) {
                clusters.set(cellId, []);
            }
            
            clusters.get(cellId).push(feature);
        });
        
        return Array.from(clusters.entries()).map(([cellId, features]) => ({
            cellId: cellId,
            features: features,
            count: features.length,
            center: this.calculateCentroid(features)
        }));
    }
    
    // Calculate centroid of features
    static calculateCentroid(features) {
        let totalX = 0;
        let totalY = 0;
        let count = 0;
        
        features.forEach(feature => {
            const geom = feature.getGeometry();
            const coord = geom.getType() === 'Point' 
                ? geom.getCoordinates()
                : ol.extent.getCenter(geom.getExtent());
                
            totalX += coord[0];
            totalY += coord[1];
            count++;
        });
        
        return [totalX / count, totalY / count];
    }
    
    // Density analysis
    static calculateDensity(features, searchRadius = 5000) {
        return features.map(feature => {
            const geom = feature.getGeometry();
            const coord = geom.getCoordinates();
            
            // Count features within search radius
            let nearbyCount = 0;
            features.forEach(otherFeature => {
                if (feature === otherFeature) return;
                
                const otherGeom = otherFeature.getGeometry();
                const otherCoord = otherGeom.getCoordinates();
                
                const distance = ol.coordinate.distance(coord, otherCoord);
                if (distance <= searchRadius) {
                    nearbyCount++;
                }
            });
            
            // Calculate density (features per km²)
            const searchAreaKm2 = Math.PI * Math.pow(searchRadius / 1000, 2);
            const density = nearbyCount / searchAreaKm2;
            
            return {
                feature: feature,
                nearbyCount: nearbyCount,
                density: density,
                name: feature.get('name') || 'Unknown'
            };
        });
    }
    
    // Hotspot analysis (simplified)
    static findHotspots(features, threshold = 10, searchRadius = 5000) {
        const densityData = this.calculateDensity(features, searchRadius);
        
        return densityData
            .filter(item => item.nearbyCount >= threshold)
            .sort((a, b) => b.density - a.density);
    }
    
    // Service area analysis (simplified accessibility)
    static serviceArea(centerFeature, serviceDistance, candidateFeatures) {
        const centerGeom = centerFeature.getGeometry();
        const centerCoord = centerGeom.getCoordinates();
        
        const serviceableFeatures = candidateFeatures.filter(feature => {
            const featureGeom = feature.getGeometry();
            const featureCoord = featureGeom.getType() === 'Point'
                ? featureGeom.getCoordinates()
                : ol.extent.getCenter(featureGeom.getExtent());
                
            const distance = ol.coordinate.distance(centerCoord, featureCoord);
            return distance <= serviceDistance;
        });
        
        return {
            center: centerFeature,
            serviceDistance: serviceDistance,
            serviceableFeatures: serviceableFeatures,
            count: serviceableFeatures.length
        };
    }
    
    // Generate analysis report
    static generateReport(analysisType, results) {
        const report = {
            type: analysisType,
            timestamp: new Date().toISOString(),
            results: results,
            summary: {}
        };
        
        switch (analysisType) {
            case 'distance':
                report.summary = {
                    totalFeatures: results.length,
                    averageDistance: results.reduce((sum, r) => sum + r.distance, 0) / results.length,
                    minDistance: Math.min(...results.map(r => r.distance)),
                    maxDistance: Math.max(...results.map(r => r.distance))
                };
                break;
                
            case 'density':
                report.summary = {
                    totalFeatures: results.length,
                    averageDensity: results.reduce((sum, r) => sum + r.density, 0) / results.length,
                    maxDensity: Math.max(...results.map(r => r.density)),
                    highDensityAreas: results.filter(r => r.density > 1).length
                };
                break;
                
            case 'cluster':
                report.summary = {
                    totalClusters: results.length,
                    totalFeatures: results.reduce((sum, cluster) => sum + cluster.count, 0),
                    largestCluster: Math.max(...results.map(cluster => cluster.count)),
                    averageClusterSize: results.reduce((sum, cluster) => sum + cluster.count, 0) / results.length
                };
                break;
        }
        
        return report;
    }
}

// Export class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpatialAnalysis;
}
