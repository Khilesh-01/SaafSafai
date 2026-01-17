import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const SchoolDataPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.async = true;
      script.onload = () => {
        window.google.charts.load("current", {
          packages: ["corechart", "piechart"],
        });
        window.google.charts.setOnLoadCallback(loadChartData);
      };
      script.onerror = () => {
        setChartError("Failed to load Google Charts");
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      loadChartData();
    }
  }, []);

  const loadChartData = () => {
    Papa.parse("gtfs/UDISE_2021_22_Table_7.11.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data?.length) {
          setData(result.data);
          const formatted = formatDataForChart(result.data);
          setTimeout(() => drawChart(formatted), 100);
        }
        setLoading(false);
      },
      error: (err) => {
        setChartError(err.message);
        setLoading(false);
      },
    });
  };

  const formatDataForChart = (rows) => {
    const chartData = [["State/UT", "Total Schools"]];
    rows.forEach((row) => {
      const state = Object.values(row)[0];
      const count = parseInt(Object.values(row)[1]) || 0;
      if (state && count > 0) chartData.push([state, count]);
    });
    return chartData;
  };

  const drawChart = (chartData) => {
    if (!chartData || chartData.length < 2) return;

    const dataTable =
      window.google.visualization.arrayToDataTable(chartData);

    const options = {
      title: "School Distribution by State / UT",
      backgroundColor: "transparent",
      legend: { textStyle: { color: "#cbd5f5", fontSize: 11 } },
      chartArea: { width: "90%", height: "85%" },
      pieHole: 0.4,
      pieSliceTextStyle: { color: "#fff", fontSize: 11 },
      titleTextStyle: { color: "#fff", fontSize: 16 },
    };

    const chart = new window.google.visualization.PieChart(
      document.getElementById("chart_div")
    );
    chart.draw(dataTable, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-400 animate-pulse text-lg">
          Loading dashboard…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Dashboard View</h1>
          <p className="text-slate-400 mt-1">
            UDISE 2021–22 · School Analytics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "States / UTs", value: data.length, color: "emerald" },
            {
              label: "Columns",
              value: data[0] ? Object.keys(data[0]).length : 0,
              color: "blue",
            },
            { label: "Chart Type", value: "Pie Chart", color: "violet" },
            { label: "Dataset Year", value: "2023–24", color: "cyan" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-600/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg"
            >
              <p className="text-slate-400 text-sm">{item.label}</p>
              <p className={`text-3xl font-bold text-${item.color}-400 mt-2`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartError && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-6">
            {chartError}
          </div>
        )}

        <div
          id="chart_div"
          className="bg-slate-600/60 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl p-6 mb-10"
          style={{ height: "480px" }}
        />

        {/* Data Table */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold">Education Data Table</h2>
            <p className="text-sm text-slate-400">
              State-wise school statistics
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-700/60">
                <tr>
                  {data[0] &&
                    Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-sm font-semibold text-slate-200 border-b border-slate-700"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-700/40 transition"
                  >
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="px-6 py-3 text-sm text-slate-300 border-b border-slate-700"
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-10">
          Data Source: UDISE · Ministry of Education, Government of India
        </p>
      </div>
    </div>
  );
};

export default SchoolDataPage;
