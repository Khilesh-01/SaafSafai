import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, MapPin, Navigation, Hash, LayoutGrid, ExternalLink } from "lucide-react";

export default function PublicTransportInfo() {
  const [stops, setStops] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/gtfs/stops.txt");
        const text = await res.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setStops(result.data);
          },
        });
      } catch (error) {
        console.error("Error loading stops:", error);
      }
    }
    fetchStops();
  }, []);

  const filteredStops = stops.filter(
    (stop) =>
      stop.stop_name?.toLowerCase().includes(search.toLowerCase()) ||
      stop.stop_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-25 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/10 relative">
      {/* Background orbs */}
      <div className="absolute top-16 right-20 w-80 h-80 bg-green-200/10 dark:bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-16 w-64 h-64 bg-green-300/15 dark:bg-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-green-800 dark:from-white dark:via-green-300 dark:to-green-400 bg-clip-text text-transparent">
                Delhi Transit
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                Find bus stops across Delhi with ease
              </p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-green-100/60 dark:border-green-800/40 shadow-lg shadow-green-100/20 dark:shadow-green-900/10 overflow-hidden mb-8">
          <div className="p-8">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by stop name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-green-25 dark:bg-gray-800/50 border border-green-200/50 dark:border-green-700/50 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 dark:focus:border-green-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">
                {filteredStops.length} stops found
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredStops.length > 0 ? (
          <div className="grid gap-4 max-h-[600px] overflow-y-auto">
            {filteredStops.slice(0, 20).map((stop, idx) => (
              <div
                key={idx}
                className="group bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-green-100/60 dark:border-green-800/40 p-6 hover:border-green-200 dark:hover:border-green-700 hover:shadow-lg hover:shadow-green-100/20 dark:hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Stop Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {stop.stop_name}
                    </h3>
                  </div>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-700 dark:text-green-300 rounded-xl text-sm font-semibold shadow-sm">
                    {stop.stop_code || "N/A"}
                  </span>
                </div>

                {/* Stop Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Stop ID</div>
                      <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                        {stop.stop_id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                      <LayoutGrid className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Zone</div>
                      <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {stop.zone_id || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Location</div>
                      <a
                        href={`https://www.google.com/maps?q=${stop.stop_lat},${stop.stop_lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-mono bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-colors group/link"
                      >
                        <span>
                          {parseFloat(stop.stop_lat).toFixed(4)}, {parseFloat(stop.stop_lon).toFixed(4)}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-green-100/60 dark:border-green-800/40 p-16 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No stops found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or check the spelling
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-green-100/60 dark:border-green-800/40 text-gray-600 dark:text-gray-400">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <Navigation className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium">
              Powered by Delhi Transport Corporation • Real-time transit information
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}