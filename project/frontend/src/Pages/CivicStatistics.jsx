import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, Users, Droplets, FileText, BarChart3 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CivicStatisticsPage() {
  const [populationData, setPopulationData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  /* ------------------ DATA LOADING (UNCHANGED) ------------------ */
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.async = true;
      script.onload = () => {
        window.google.charts.load("current", { packages: ["corechart", "bar"] });
        window.google.charts.setOnLoadCallback(loadChartData);
      };
      document.head.appendChild(script);
    } else {
      loadChartData();
    }
  }, []);

  const loadChartData = () => {
    let done = 0;

    Papa.parse("gtfs/population.csv", {
      download: true,
      header: true,
      complete: (res) => {
        setPopulationData(res.data || []);
        setTimeout(() => drawPopulationChart(res.data), 100);
        if (++done === 2) setLoading(false);
      },
    });

    Papa.parse("gtfs/water.csv", {
      download: true,
      header: true,
      complete: (res) => {
        setWaterData(res.data || []);
        setTimeout(() => drawWaterChart(res.data), 100);
        if (++done === 2) setLoading(false);
      },
    });
  };

  /* ------------------ CHARTS (DARK MODE) ------------------ */
  const drawPopulationChart = (csvData) => {
    if (!csvData?.length) return;

    const chartData = [["State", "Population", { role: "style" }]];
    const colors = ["#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

    csvData.slice(0, 6).forEach((row, i) => {
      chartData.push([
        row["India/State/Union Territory"],
        parseInt(row["Population 2011"]?.replace(/,/g, "")) || 0,
        colors[i % colors.length],
      ]);
    });

    const table = window.google.visualization.arrayToDataTable(chartData);
    new window.google.visualization.ColumnChart(
      document.getElementById("population_chart")
    ).draw(table, {
      backgroundColor: "transparent",
      legend: "none",
      titleTextStyle: { color: "#fff" },
      hAxis: { textStyle: { color: "#cbd5f5" } },
      vAxis: { textStyle: { color: "#cbd5f5" } },
    });
  };

  const drawWaterChart = (csvData) => {
    if (!csvData?.length) return;

    const chartData = [["District", "Canals", { role: "style" }]];
    const colors = ["#38bdf8", "#60a5fa", "#818cf8"];

    csvData.slice(0, 6).forEach((row, i) => {
      chartData.push([
        row["District"],
        parseInt(row["Canals no."]) || 0,
        colors[i % colors.length],
      ]);
    });

    const table = window.google.visualization.arrayToDataTable(chartData);
    new window.google.visualization.BarChart(
      document.getElementById("water_chart")
    ).draw(table, {
      backgroundColor: "transparent",
      legend: "none",
      hAxis: { textStyle: { color: "#cbd5f5" } },
      vAxis: { textStyle: { color: "#cbd5f5" } },
    });
  };

  /* ------------------ FILTERS ------------------ */
  const filteredPopulation = populationData.filter((r) =>
    r["India/State/Union Territory"]?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredWater = waterData.filter((r) =>
    r["District"]?.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------ EXPORT ------------------ */
  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportPDF = (data, headers, filename, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 10);
    autoTable(doc, {
      head: [headers],
      body: data.map((r) => headers.map((h) => r[h] || "")),
      startY: 18,
    });
    doc.save(filename);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Loading civic analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Civic Statistics Dashboard</h1>
          <p className="text-slate-400">
            Population & Water Infrastructure Overview
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search states or districts..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "States / UTs", value: filteredPopulation.length, color: "text-emerald-400" },
            { icon: Droplets, label: "Districts", value: filteredWater.length, color: "text-sky-400" },
            { icon: BarChart3, label: "Datasets", value: 2, color: "text-violet-400" },
          ].map((k, i) => (
            <div
              key={i}
              className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex gap-4 items-center"
            >
              <k.icon className={`w-7 h-7 ${k.color}`} />
              <div>
                <p className="text-slate-400 text-sm">{k.label}</p>
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-600/60 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-emerald-300 mb-4">
              Population Distribution
            </h2>
            <div id="population_chart" style={{ height: 380 }} />
          </div>

          <div className="bg-slate-600/60 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-sky-300 mb-4">
              Water Infrastructure
            </h2>
            <div id="water_chart" style={{ height: 380 }} />
          </div>
        </div>

        {/* Tables */}
        {[{
          title: "Population Data (2011)",
          data: filteredPopulation,
          color: "emerald",
          headers: ["India/State/Union Territory", "Population 2011"],
        }, {
          title: "Water Resources Data",
          data: filteredWater,
          color: "sky",
          headers: ["District", "Canals no."],
        }].map((section, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
              <h3 className="font-semibold">{section.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => exportCSV(section.data, `${section.title}.csv`)}
                  className="px-3 py-2 bg-slate-700 rounded-lg text-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> CSV
                </button>
                <button
                  onClick={() => exportPDF(section.data, section.headers, `${section.title}.pdf`, section.title)}
                  className="px-3 py-2 bg-slate-700 rounded-lg text-sm flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" /> PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/40">
                  <tr>
                    {section.headers.map(h => (
                      <th key={h} className="px-4 py-3 text-left text-slate-300">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30">
                      {section.headers.map(h => (
                        <td key={h} className="px-4 py-3 text-slate-400">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <p className="text-center text-slate-500 text-sm pt-6">
          Data Source: Census of India & Water Resources Department
        </p>
      </div>
    </div>
  );
}
