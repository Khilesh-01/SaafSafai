import React, { useState, useEffect } from "react";

export default function NearbyServices() {
  const [coords, setCoords] = useState(null);
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("idle");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          console.error(err);
          setStatus("error");
        }
      );
    }
  }, []);

  async function fetchNearby() {
    if (!coords) return;
    setStatus("loading");

    const overpassUrls = [
      "https://overpass-api.de/api/interpreter",
      "https://lz4.overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.openstreetmap.ru/api/interpreter",
      "https://overpass.nchc.org.tw/api/interpreter",
    ];

    let queryAmenities = "";
    if (filter === "all") {
      queryAmenities = `
        node["amenity"~"hospital|police|fire_station"](around:10000,${coords.lat},${coords.lon});
        way["amenity"~"hospital|police|fire_station"](around:10000,${coords.lat},${coords.lon});
        relation["amenity"~"hospital|police|fire_station"](around:10000,${coords.lat},${coords.lon});
      `;
    } else {
      queryAmenities = `
        node["amenity"="${filter}"](around:10000,${coords.lat},${coords.lon});
        way["amenity"="${filter}"](around:10000,${coords.lat},${coords.lon});
        relation["amenity"="${filter}"](around:10000,${coords.lat},${coords.lon});
      `;
    }

    const query = `
      [out:json];
      (
        ${queryAmenities}
      );
      out center tags;
    `;

    let found = false;
    for (let url of overpassUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          body: new URLSearchParams({ data: query }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.elements?.length > 0) {
          setPlaces(data.elements);
          setStatus("success");
          found = true;
          break;
        }
      } catch (e) {
        console.error(`Error with Overpass mirror ${url}:`, e);
      }
    }
    if (!found) {
      setPlaces([]);
      setStatus("success");
    }
  }

  function openDirections(lat, lon) {
    if (!coords) return;
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${coords.lat},${coords.lon};${lat},${lon}`;
    window.open(url, "_blank");
  }

  const getServiceIcon = (amenity) => {
    switch (amenity) {
      case "hospital":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case "police":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l7-2 7 2v6a7 7 0 11-14 0V5z" />
          </svg>
        );
      case "fire_station":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2s4 4 4 8a4 4 0 11-8 0c0-4 4-8 4-8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v8" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
    }
  };

  const getServiceColor = (amenity) => {
    switch (amenity) {
      case "hospital":
        return "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-red-200/60 dark:border-red-800/40";
      case "police":
        return "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/60 dark:border-blue-800/40";
      case "fire_station":
        return "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/60 dark:border-orange-800/40";
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 border-gray-200/60 dark:border-gray-700/40";
    }
  };

  const getIconColor = (amenity) => {
    switch (amenity) {
      case "hospital":
        return "text-red-600 dark:text-red-400";
      case "police":
        return "text-blue-600 dark:text-blue-400";
      case "fire_station":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-25 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/10 relative">
      {/* Background orbs */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-green-200/10 dark:bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-green-300/15 dark:bg-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-green-100/60 dark:border-green-800/40 p-8 mb-8 shadow-lg shadow-green-100/20 dark:shadow-green-900/10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-green-800 dark:from-white dark:via-green-300 dark:to-green-400 bg-clip-text text-transparent">
                Emergency Services Locator
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover essential services within a 10-kilometer radius of your location
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filter by Service Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 dark:focus:border-green-500 transition-all duration-200 shadow-sm"
              >
                <option value="all">🚨 All Emergency Services</option>
                <option value="hospital">🏥 Medical Facilities</option>
                <option value="police">👮 Law Enforcement</option>
                <option value="fire_station">🚒 Fire & Rescue Services</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchNearby}
                disabled={status === "loading" || !coords}
                className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg shadow-green-600/25 hover:shadow-green-700/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {status === "loading" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Locating...
                  </div>
                ) : (
                  "🔍 Search Services"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {places.length > 0 && (
          <div className="grid gap-4">
            {places.map((p) => (
              <div
                key={p.id}
                className={`group ${getServiceColor(p.tags?.amenity)} backdrop-blur-sm rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm ${getIconColor(p.tags?.amenity)}`}>
                    {getServiceIcon(p.tags?.amenity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {p.tags?.name || "Unnamed Service"}
                    </h3>
                    <div className="space-y-1 mb-4">
                      {p.tags?.["addr:street"] && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {p.tags["addr:street"]}
                        </p>
                      )}
                      {p.tags?.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 font-mono">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {p.tags.phone}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        openDirections(p.lat || p.center?.lat, p.lon || p.center?.lon)
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                      </svg>
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {status === "success" && places.length === 0 && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8.284l3 3-3 3" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">No emergency services found in your area</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="bg-red-50/90 dark:bg-red-950/50 backdrop-blur-md border border-red-200/60 dark:border-red-800/40 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-800 dark:text-red-300 font-medium">Unable to access location services</p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">Please check your connection and try again</p>
          </div>
        )}
      </div>
    </div>
  );
}