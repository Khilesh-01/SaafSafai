import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function SDRFAnalyticsPage() {
  const [nfsaData, setNfsaData] = useState([]);
  const [sdrfData, setSdrfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.async = true;
      script.onload = () => {
        window.google.charts.load("current", {
          packages: ["corechart", "bar"],
        });
        window.google.charts.setOnLoadCallback(loadChartData);
      };
      document.head.appendChild(script);
    } else {
      loadChartData();
    }
  }, []);

  const loadChartData = () => {
    let loaded = 0;

    Papa.parse("gtfs/RS_Session_258_AU_1935_2.csv", {
      download: true,
      header: true,
      complete: (res) => {
        setNfsaData(res.data || []);
        setTimeout(() => drawNFSAChart(res.data), 100);
        if (++loaded === 2) setLoading(false);
      },
    });

    Papa.parse("gtfs/RS_Session_258_AU_1997_1.csv", {
      download: true,
      header: true,
      complete: (res) => {
        setSdrfData(res.data || []);
        setTimeout(() => drawSDRFChart(res.data), 100);
        if (++loaded === 2) setLoading(false);
      },
    });
  };

  const drawNFSAChart = (data) => {
    if (!data?.length) return;
    const chartData = [["Category", "Value", { role: "style" }]];
    const colors = ["#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

    data.slice(0, 5).forEach((row, i) => {
      chartData.push([
        Object.values(row)[0],
        parseInt(Object.values(row)[1]) || i + 1,
        colors[i % colors.length],
      ]);
    });

    const table = window.google.visualization.arrayToDataTable(chartData);
    new window.google.visualization.ColumnChart(
      document.getElementById("nfsa_chart")
    ).draw(table, {
      backgroundColor: "transparent",
      legend: "none",
      titleTextStyle: { color: "#fff" },
      hAxis: { textStyle: { color: "#cbd5f5" } },
      vAxis: { textStyle: { color: "#cbd5f5" } },
    });
  };

  const drawSDRFChart = (data) => {
    if (!data?.length) return;
    const chartData = [["Category", "Allocation", { role: "style" }]];
    const colors = ["#38bdf8", "#60a5fa", "#818cf8", "#a5b4fc"];

    data.slice(0, 5).forEach((row, i) => {
      chartData.push([
        Object.values(row)[0],
        parseInt(Object.values(row)[1]) || i + 1,
        colors[i % colors.length],
      ]);
    });

    const table = window.google.visualization.arrayToDataTable(chartData);
    new window.google.visualization.BarChart(
      document.getElementById("sdrf_chart")
    ).draw(table, {
      backgroundColor: "transparent",
      legend: "none",
      hAxis: { textStyle: { color: "#cbd5f5" } },
      vAxis: { textStyle: { color: "#cbd5f5" } },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">SDRF & NFSA Analytics</h1>
        <p className="text-slate-400 mb-10">
          Government Disaster & Food Security Dashboard
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "NFSA Records", value: nfsaData.length, color: "text-emerald-400" },
            { label: "SDRF Records", value: sdrfData.length, color: "text-sky-400" },
            { label: "Datasets", value: 2, color: "text-violet-400" },
          ].map((k, i) => (
            <div
              key={i}
              className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-lg"
            >
              <p className="text-slate-400 text-sm">{k.label}</p>
              <p className={`text-3xl font-bold mt-2 ${k.color}`}>
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-emerald-300">
              NFSA Distribution
            </h2>
            <div id="nfsa_chart" style={{ height: 380 }} />
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-sky-300">
              SDRF Allocation
            </h2>
            <div id="sdrf_chart" style={{ height: 380 }} />
          </div>
        </div>

        {/* Tables */}
        {[{ title: "NFSA Data", data: nfsaData }, { title: "SDRF Data", data: sdrfData }].map(
          (section, idx) =>
            section.data.length > 0 && (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden mb-10"
              >
                <div className="px-6 py-4 border-b border-slate-700">
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-700/50">
                      <tr>
                        {Object.keys(section.data[0]).map((k) => (
                          <th key={k} className="px-4 py-3 text-left text-slate-300">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.data.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-700/30">
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-4 py-3 text-slate-400">
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
        )}

        <p className="text-center text-slate-500 text-sm mt-12">
          Data Source: Government of India · SDRF & NFSA
        </p>
      </div>
    </div>
  );
}
