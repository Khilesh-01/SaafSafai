import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ======================
     SIDEBAR
  ====================== */
  const sidebarMenu = [
    { label: "Dashboard", icon: Home, route: "/admin/dashboard" },
    { label: "Analytics", icon: BarChart3, route: "/admin/analytics" },
    { label: "Users", icon: Users, route: "/admin/users" },
    { label: "Documents", icon: FileText, route: "/admin/documents" },
    { label: "Notifications", icon: Bell, route: "/admin/notifications" },
    { label: "Settings", icon: Settings, route: "/admin/settings" },
  ];

  /* ======================
     STATUS CONFIG
  ====================== */
  const statusConfig = {
    Pending: {
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      dot: "bg-amber-500",
      icon: Clock,
    },
    "In Progress": {
      badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
      dot: "bg-indigo-500",
      icon: RefreshCw,
    },
    Resolved: {
      badge: "bg-violet-100 text-violet-800 border-violet-300",
      dot: "bg-violet-500",
      icon: CheckCircle2,
    },
    Rejected: {
      badge: "bg-rose-100 text-rose-800 border-rose-300",
      dot: "bg-rose-500",
      icon: XCircle,
    },
  };

  const priorityConfig = {
    High: "bg-rose-100 text-rose-800 border-rose-300",
    Medium: "bg-amber-100 text-amber-800 border-amber-300",
    Low: "bg-emerald-100 text-emerald-800 border-emerald-300",
  };

  /* ======================
     FETCH
  ====================== */
  const fetchIssues = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("http://localhost:5000/api/issues", {
        credentials: "include",
      });
      if (res.ok) {
        setIssues(await res.json());
      } else {
        setIssues([]);
      }
    } catch {
      setIssues([]);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  /* ======================
     FILTERING
  ====================== */
  const filteredIssues = issues.filter((issue) => {
    const textMatch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "all" || issue.status === statusFilter;
    return textMatch && statusMatch;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "Pending").length,
    progress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
    rejected: issues.filter((i) => i.status === "Rejected").length,
  };

  /* ======================
     UPDATE STATUS
  ====================== */
  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/issues/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newStatus: status }),
      });
      setIssues((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
    } catch { }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* ======================
          SIDEBAR
      ====================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 shadow-xl transition-all
        ${isSidebarOpen ? "w-64" : "w-16"} hidden lg:block`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span
            className={`font-bold text-indigo-600 transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
          >
            saafsafai
          </span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {sidebarMenu.map(({ label, icon: Icon, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
              text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              <Icon className="w-5 h-5" />
              {isSidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ======================
          MAIN
      ====================== */}
      <main
        className={`transition-all ${isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
          }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-indigo-700">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Civic Issue Management
              </p>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-lg hover:bg-slate-100">
                <Bell />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100">
                <Settings />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              ["Total Issues", stats.total, TrendingUp],
              ["Pending", stats.pending, Clock],
              ["In Progress", stats.progress, RefreshCw],
              ["Resolved", stats.resolved, CheckCircle2],
              ["Rejected", stats.rejected, XCircle],
            ].map(([label, value, Icon]) => (
              <div
                key={label}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                  </div>
                  <Icon className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search issues..."
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300"
            >
              <option value="all">All Status</option>
              {Object.keys(statusConfig).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={fetchIssues}
              className="ml-auto flex items-center gap-2 px-4 py-2
              bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 text-left">Issue</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const Icon = statusConfig[issue.status]?.icon;
                  return (
                    <tr
                      key={issue._id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <p className="font-medium">{issue.title}</p>
                        <p className="text-slate-500">
                          {issue.description}
                        </p>
                      </td>
                      <td className="p-4">{issue.category}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full border text-xs ${priorityConfig[issue.priority]}`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${statusConfig[issue.status].badge}`}
                        >
                          <Icon className="w-3 h-3" />
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            handleStatusChange(
                              issue._id,
                              e.target.value
                            )
                          }
                          className="border rounded-lg px-2 py-1"
                        >
                          {Object.keys(statusConfig).map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
