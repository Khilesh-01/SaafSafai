import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Globe, MapPin, ArrowLeft, Filter, Layers, Sparkles } from "lucide-react";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function FlyToLocation({ position }) {
  const map = useMap();
  if (position) map.flyTo(position, 14, { duration: 1.5 });
  return null;
}

export default function UserMap() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [mapView, setMapView] = useState("street");

  const userIssues = [
    {
      title: "Potholes on FC Road",
      description: "Multiple potholes causing traffic congestion during peak hours.",
      status: "Pending",
      category: "Roads",
      date: "2025-08-12",
      lat: 18.5196,
      lng: 73.8553, // FC Road
    },
    {
      title: "Streetlight outage in Kothrud",
      description: "Streetlights not working near Paud Road junction.",
      status: "Under Review",
      category: "Lighting",
      date: "2025-08-10",
      lat: 18.5074,
      lng: 73.8077, // Kothrud
    },
    {
      title: "Overflowing garbage bin at Hadapsar",
      description: "Garbage bin near Magarpatta gate overflowing for 2 days.",
      status: "Pending",
      category: "Waste",
      date: "2025-08-14",
      lat: 18.5089,
      lng: 73.9260, // Hadapsar
    },
    {
      title: "Water leakage in Baner",
      description: "Underground pipeline leak wasting water near Baner Road.",
      status: "In Progress",
      category: "Water",
      date: "2025-08-09",
      lat: 18.5590,
      lng: 73.7868, // Baner
    },
    {
      title: "Broken footpath near Shivajinagar",
      description: "Footpath tiles broken near bus stand, unsafe for pedestrians.",
      status: "Pending",
      category: "Safety",
      date: "2025-08-15",
      lat: 18.5308,
      lng: 73.8475, // Shivajinagar
    },
    {
      title: "Traffic signal malfunction – Wakad",
      description: "Signal stuck on red causing long traffic jams.",
      status: "Resolved",
      category: "Roads",
      date: "2025-08-05",
      lat: 18.5996,
      lng: 73.7655, // Wakad
    },
    {
      title: "Illegal dumping near Pimpri",
      description: "Construction waste dumped on roadside.",
      status: "Under Review",
      category: "Waste",
      date: "2025-08-11",
      lat: 18.6298,
      lng: 73.7997, // Pimpri
    },
    {
      title: "Open manhole in Hinjewadi Phase 2",
      description: "Uncovered manhole posing risk to vehicles.",
      status: "In Progress",
      category: "Safety",
      date: "2025-08-13",
      lat: 18.5913,
      lng: 73.7389, // Hinjewadi
    },
    { title: "Pothole near Main Street", description: "Big pothole near bus stop. Needs urgent repair.", status: "Pending", category: "Roads", date: "2025-08-01", lat: 13.0827, lng: 80.2707 },
    { title: "Streetlight not working", description: "Dark street needs repair of light. Safety issue.", status: "Resolved", category: "Lighting", date: "2025-07-20", lat: 19.076, lng: 72.8777 },
    { title: "Overflowing garbage bin", description: "Garbage collection delayed for 3 days.", status: "Under Review", category: "Waste", date: "2025-08-15", lat: 28.7041, lng: 77.1025 },
    { title: "Broken water pipe", description: "Water flooding street due to burst pipe.", status: "In Progress", category: "Water", date: "2025-08-10", lat: 12.9716, lng: 77.5946 },
  ];

  const filteredIssues = userIssues.filter(
    (issue) =>
      (statusFilter === "All" || issue.status === statusFilter) &&
      (categoryFilter === "All" || issue.category === categoryFilter)
  );

  const statusClasses = {
    Pending: "text-amber-800 border-amber-300 bg-amber-50 dark:bg-amber-900/30",
    "In Progress": "text-blue-800 border-blue-300 bg-blue-50 dark:bg-blue-900/30",
    Resolved: "text-emerald-800 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30",
    "Under Review": "text-violet-800 border-violet-300 bg-violet-50 dark:bg-violet-900/30",
  };

  const categoryClasses = {
    Roads: "text-orange-800 border-orange-300 bg-orange-50",
    Waste: "text-red-800 border-red-300 bg-red-50",
    Lighting: "text-indigo-800 border-indigo-300 bg-indigo-50",
    Water: "text-cyan-800 border-cyan-300 bg-cyan-50",
    Safety: "text-rose-800 border-rose-300 bg-rose-50",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-indigo-950 dark:via-slate-900 dark:to-violet-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="relative text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-xl">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
            Civic Issues Map
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore civic issues across regions with filters and map views.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">

          {/* Filters */}
          <div className="bg-gray-700/90 dark:bg-slate-800 border border-violet-200 dark:border-violet-700 rounded-2xl p-4 flex gap-3 items-center shadow">
            <Filter className="text-violet-600" />
            <select
              className="rounded-xl border border-violet-300 px-3 py-2 bg-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Under Review">Under Review</option>
            </select>

            <select
              className="rounded-xl border border-violet-300 px-3 py-2 bg-gray-700"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Waste">Waste</option>
              <option value="Lighting">Lighting</option>
              <option value="Water">Water</option>
              <option value="Safety">Safety</option>
            </select>
          </div>

          {/* Map View */}
          <div className="bg-white/90 dark:bg-slate-800 border border-violet-200 dark:border-violet-700 rounded-2xl p-2 flex gap-2 shadow">
            {["street", "satellite"].map((view) => (
              <button
                key={view}
                onClick={() => setMapView(view)}
                className={`px-4 py-2 rounded-xl font-medium transition ${mapView === view
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "text-violet-600 hover:bg-violet-100"
                  }`}
              >
                {view === "street" ? <MapPin size={16} /> : <Globe size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white/80 dark:bg-slate-800 border border-violet-200 dark:border-violet-700 rounded-3xl shadow-2xl p-2">
          <div className="h-[600px] rounded-2xl overflow-hidden">
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%" }}>
              <TileLayer
                url={
                  mapView === "satellite"
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
              />

              {filteredIssues.map((issue, i) => (
                <Marker key={i} position={[issue.lat, issue.lng]} icon={customIcon}>
                  <Popup>
                    <div className="space-y-2">
                      <h3 className="font-bold text-violet-700">{issue.title}</h3>
                      <p className="text-sm">{issue.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-lg text-xs border ${statusClasses[issue.status]}`}>
                          {issue.status}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs border ${categoryClasses[issue.category]}`}>
                          {issue.category}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selectedIssue && (
                <FlyToLocation position={[selectedIssue.lat, selectedIssue.lng]} />
              )}
            </MapContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredIssues.length} of {userIssues.length} issues
        </div>
      </div>
    </div>
  );
}
