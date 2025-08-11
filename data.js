// Data sample untuk Yogyakarta
// Koordinat dalam format [longitude, latitude]

// Data Tempat Wisata (Points)
window.touristSpots = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.3659, -7.8014] // Candi Borobudur
            },
            "properties": {
                "name": "Candi Borobudur",
                "type": "Candi",
                "description": "Candi Buddha terbesar di dunia dan Situs Warisan Dunia UNESCO",
                "category": "Sejarah",
                "rating": 4.8,
                "visitors_per_year": 2500000,
                "entrance_fee": "IDR 50,000"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.4453, -7.7520] // Candi Prambanan
            },
            "properties": {
                "name": "Candi Prambanan",
                "type": "Candi",
                "description": "Kompleks candi Hindu terbesar di Indonesia",
                "category": "Sejarah",
                "rating": 4.7,
                "visitors_per_year": 1800000,
                "entrance_fee": "IDR 40,000"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.3695, -7.7956] // Keraton Yogyakarta
            },
            "properties": {
                "name": "Keraton Yogyakarta",
                "type": "Istana",
                "description": "Istana residen Sultan Yogyakarta",
                "category": "Budaya",
                "rating": 4.5,
                "visitors_per_year": 1200000,
                "entrance_fee": "IDR 15,000"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.3657, -7.7989] // Malioboro
            },
            "properties": {
                "name": "Jalan Malioboro",
                "type": "Jalan",
                "description": "Jalan utama dan pusat perbelanjaan di Yogyakarta",
                "category": "Belanja",
                "rating": 4.6,
                "visitors_per_year": 3000000,
                "entrance_fee": "Gratis"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.3913, -7.7680] // Tugu Yogyakarta
            },
            "properties": {
                "name": "Tugu Yogyakarta",
                "type": "Monumen",
                "description": "Tugu bersejarah sebagai simbol Yogyakarta",
                "category": "Sejarah",
                "rating": 4.2,
                "visitors_per_year": 800000,
                "entrance_fee": "Gratis"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.4086, -7.8731] // Pantai Parangtritis
            },
            "properties": {
                "name": "Pantai Parangtritis",
                "type": "Pantai",
                "description": "Pantai dengan legenda Nyi Roro Kidul",
                "category": "Alam",
                "rating": 4.4,
                "visitors_per_year": 2200000,
                "entrance_fee": "IDR 5,000"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.3167, -7.9106] // Goa Jomblang
            },
            "properties": {
                "name": "Goa Jomblang",
                "type": "Goa",
                "description": "Goa vertikal dengan cahaya surga yang terkenal",
                "category": "Petualangan",
                "rating": 4.7,
                "visitors_per_year": 150000,
                "entrance_fee": "IDR 450,000"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [110.4167, -7.7333] // Candi Sambisari
            },
            "properties": {
                "name": "Candi Sambisari",
                "type": "Candi",
                "description": "Candi Hindu yang tersembunyi di bawah tanah",
                "category": "Sejarah",
                "rating": 4.3,
                "visitors_per_year": 45000,
                "entrance_fee": "IDR 10,000"
            }
        }
    ]
};

// Data Jalan Utama (Lines)
window.mainRoads = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [110.3600, -7.8100], // Start near Borobudur
                    [110.3650, -7.8000],
                    [110.3680, -7.7950],
                    [110.3695, -7.7956], // Keraton
                    [110.3657, -7.7989], // Malioboro
                    [110.3700, -7.7980],
                    [110.3800, -7.7900],
                    [110.4000, -7.7700],
                    [110.4200, -7.7600],
                    [110.4453, -7.7520]  // End at Prambanan
                ]
            },
            "properties": {
                "name": "Jalan Yogya-Magelang",
                "type": "Jalan Provinsi",
                "length_km": 45.2,
                "surface": "Aspal",
                "lanes": 4,
                "speed_limit": 60,
                "condition": "Baik"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [110.3657, -7.7989], // Malioboro
                    [110.3700, -7.8100],
                    [110.3800, -7.8200],
                    [110.3900, -7.8400],
                    [110.4000, -7.8600],
                    [110.4086, -7.8731]  // Parangtritis
                ]
            },
            "properties": {
                "name": "Jalan Yogya-Parangtritis",
                "type": "Jalan Kabupaten",
                "length_km": 28.5,
                "surface": "Aspal",
                "lanes": 2,
                "speed_limit": 50,
                "condition": "Baik"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [110.3200, -7.7500],
                    [110.3400, -7.7600],
                    [110.3600, -7.7700],
                    [110.3695, -7.7956], // Keraton
                    [110.3800, -7.8000],
                    [110.4000, -7.8100],
                    [110.4200, -7.8200],
                    [110.4500, -7.8300]
                ]
            },
            "properties": {
                "name": "Jalan Ring Road Utara",
                "type": "Jalan Kota",
                "length_km": 35.8,
                "surface": "Aspal",
                "lanes": 6,
                "speed_limit": 70,
                "condition": "Sangat Baik"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [110.3000, -7.8500],
                    [110.3200, -7.8400],
                    [110.3400, -7.8300],
                    [110.3600, -7.8200],
                    [110.3800, -7.8100],
                    [110.4000, -7.8000],
                    [110.4200, -7.7900],
                    [110.4400, -7.7800]
                ]
            },
            "properties": {
                "name": "Jalan Ring Road Selatan",
                "type": "Jalan Kota",
                "length_km": 32.1,
                "surface": "Aspal",
                "lanes": 4,
                "speed_limit": 60,
                "condition": "Baik"
            }
        }
    ]
};

// Data Kecamatan (Polygons)
window.districts = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [110.3400, -7.7400], // Kecamatan Gondokusuman
                    [110.3800, -7.7400],
                    [110.3800, -7.7800],
                    [110.3400, -7.7800],
                    [110.3400, -7.7400]
                ]]
            },
            "properties": {
                "name": "Gondokusuman",
                "type": "Kecamatan",
                "population": 145231,
                "area_km2": 11.84,
                "density_per_km2": 12264,
                "villages": 9,
                "postal_codes": ["55223", "55224", "55225"],
                "main_activities": ["Pendidikan", "Perdagangan", "Jasa"]
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [110.3500, -7.7800], // Kecamatan Kraton
                    [110.3800, -7.7800],
                    [110.3800, -7.8100],
                    [110.3500, -7.8100],
                    [110.3500, -7.7800]
                ]]
            },
            "properties": {
                "name": "Kraton",
                "type": "Kecamatan",
                "population": 18790,
                "area_km2": 1.40,
                "density_per_km2": 13421,
                "villages": 3,
                "postal_codes": ["55131", "55132", "55133"],
                "main_activities": ["Pariwisata", "Kebudayaan", "Perdagangan"]
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [110.3800, -7.7400], // Kecamatan Danurejan
                    [110.4200, -7.7400],
                    [110.4200, -7.7800],
                    [110.3800, -7.7800],
                    [110.3800, -7.7400]
                ]]
            },
            "properties": {
                "name": "Danurejan",
                "type": "Kecamatan",
                "population": 19481,
                "area_km2": 1.12,
                "density_per_km2": 17394,
                "villages": 2,
                "postal_codes": ["55212", "55213"],
                "main_activities": ["Perdagangan", "Industri Kecil", "Jasa"]
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [110.3000, -7.7800], // Kecamatan Wirobrajan
                    [110.3500, -7.7800],
                    [110.3500, -7.8200],
                    [110.3000, -7.8200],
                    [110.3000, -7.7800]
                ]]
            },
            "properties": {
                "name": "Wirobrajan",
                "type": "Kecamatan",
                "population": 23281,
                "area_km2": 1.75,
                "density_per_km2": 13303,
                "villages": 3,
                "postal_codes": ["55251", "55252", "55253"],
                "main_activities": ["Industri", "Perdagangan", "Transportasi"]
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [110.3800, -7.7800], // Kecamatan Mergangsan
                    [110.4200, -7.7800],
                    [110.4200, -7.8200],
                    [110.3800, -7.8200],
                    [110.3800, -7.7800]
                ]]
            },
            "properties": {
                "name": "Mergangsan",
                "type": "Kecamatan",
                "population": 28123,
                "area_km2": 2.31,
                "density_per_km2": 12178,
                "villages": 3,
                "postal_codes": ["55151", "55152", "55153"],
                "main_activities": ["Perdagangan", "Jasa", "Industri Kecil"]
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [110.4000, -7.8200], // Kecamatan Bantul (sebagian)
                    [110.4500, -7.8200],
                    [110.4500, -7.8800],
                    [110.4000, -7.8800],
                    [110.4000, -7.8200]
                ]]
            },
            "properties": {
                "name": "Bantul",
                "type": "Kecamatan",
                "population": 189543,
                "area_km2": 25.45,
                "density_per_km2": 7449,
                "villages": 15,
                "postal_codes": ["55711", "55712", "55713", "55714", "55715"],
                "main_activities": ["Pertanian", "Industri", "Perdagangan"]
            }
        }
    ]
};

// Data untuk drawing tools
window.drawingData = {
    "type": "FeatureCollection",
    "features": []
};

// Coordinate system: WGS84 (EPSG:4326)
window.yogyakartaBounds = [110.2500, -7.9500, 110.5000, -7.6500]; // [minLon, minLat, maxLon, maxLat]

// Export data untuk digunakan di app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        touristSpots,
        mainRoads,
        districts,
        drawingData,
        yogyakartaBounds
    };
}
