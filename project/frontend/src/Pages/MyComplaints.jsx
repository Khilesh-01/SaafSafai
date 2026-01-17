import React, { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';

const complaintsData = [
  {
    id: 1,
    complaint: "Street lights not working properly in my area.",
    status: "Pending",
    upvotes: 12,
    date: "2025-06-25",
  },
  {
    id: 2,
    complaint: "Garbage collection is irregular and causing bad smell.",
    status: "In Progress",
    upvotes: 35,
    date: "2025-06-20",
  },
  {
    id: 3,
    complaint: "Water supply is inconsistent for last 2 weeks.",
    status: "Resolved",
    upvotes: 28,
    date: "2025-06-15",
  },
];

const MyComplaints = () => {
  const { user } = useUser();
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues', {
          credentials: 'include'
        });
        if (response.ok) {
          const issues = await response.json();
          // Filter issues by current user's email
          const userEmail = user?.primaryEmailAddress?.emailAddress;
          const userComplaints = userEmail
            ? issues.filter(issue => issue.email === userEmail)
            : issues;

          console.log('Fetched user complaints:', userComplaints);

          // Transform the data to match the expected format
          const transformedComplaints = userComplaints.map(issue => ({
            id: issue._id,
            complaint: issue.description,
            status: issue.status,
            upvotes: 0, // Issues don't have upvotes in the current model
            date: new Date(issue.createdAt).toISOString().split('T')[0]
          }));

          setComplaintsData(transformedComplaints);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gradient-to-r from-amber-200/70 to-orange-100/70 text-amber-700 border border-amber-300";
      case "in progress":
        return "bg-gradient-to-r from-blue-200/70 to-cyan-100/70 text-blue-700 border border-cyan-300";
      case "resolved":
        return "bg-gradient-to-r from-emerald-200/70 to-green-100/70 text-emerald-700 border border-emerald-300";
      default:
        return "bg-gradient-to-r from-gray-200/70 to-slate-100/70 text-gray-700 border border-slate-300";
    }
  };

  const filteredComplaints =
    filter === "All"
      ? complaintsData
      : complaintsData.filter((c) => c.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-slate-100 dark:from-gray-900 dark:via-emerald-950 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-80 h-80 rounded-full bg-emerald-300/10 blur-2xl" />
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-green-400/10 blur-2xl" />
      </div>
      <div className="relative z-10 px-4 sm:px-6 py-8 lg:px-12">
        {/* Back button */}
        <button
          className="fixed top-7 left-7 z-30 group flex items-center gap-2.5 px-4 py-2.5 text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-100 transition hover:bg-white/80 hover:shadow-lg rounded-xl border border-white/40 shadow backdrop-blur"
          onClick={() => window.history.back()}
          type="button"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <div className="max-w-5xl mx-auto pt-20">
          {/* Glassy heading */}
          <div className="mb-14 text-center">
            <div className="inline-block px-10 py-8 rounded-3xl bg-white/60 dark:bg-emerald-950/50 border border-white/30 dark:border-emerald-800/60 shadow-2xl backdrop-blur-xl relative">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight">
                My Complaints
              </h1>
              <p className="text-emerald-600/90 dark:text-emerald-400/90 text-lg font-semibold">
                Track your submitted complaints and their progress
              </p>
              <span className="block absolute left-1/2 -translate-x-1/2 -bottom-2 h-1 w-14 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
            </div>
          </div>
          {/* Filter dropdown */}
          <div className="flex justify-end mb-8">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 text-emerald-700 dark:text-emerald-300 bg-white/70 dark:bg-emerald-950/70 border border-emerald-200/40 dark:border-emerald-900/60 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition font-medium"
              >
                <option value="All">All Complaints</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Complaints list */}
          {loading ? (
            <div className="text-center py-24">
              <div className="relative mx-auto w-28 h-28 mb-6 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl shadow-xl">
                <div className="animate-spin w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">Loading complaints...</h3>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-24">
              <div className="relative mx-auto w-28 h-28 mb-6 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl shadow-xl">
                <svg className="w-14 h-14 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">No complaints found</h3>
              <p className="text-emerald-500/80 text-lg">Try selecting a different filter to view your complaints.</p>
            </div>
          ) : (
            <div className="grid gap-7">
              {filteredComplaints.map(({ id, complaint, status, upvotes, date }) => (
                <div
                  key={id}
                  className="group relative bg-white/80 dark:bg-emerald-950/80 border border-emerald-200/40 dark:border-emerald-800/50 shadow-xl hover:shadow-2xl rounded-3xl p-8 transition duration-300 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/10 via-teal-300/10 to-emerald-300/0 opacity-0 group-hover:opacity-70 transition duration-500 pointer-events-none will-change-transform" />
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-300">
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-lg">{formatDate(date)}</span>
                      </div>
                      <span className={`px-4 py-2 min-w-[120px] rounded-2xl text-base font-semibold shadow ${getStatusColor(status)}`}>{status}</span>
                    </div>

                    <p className="text-gray-800 dark:text-emerald-100 text-xl leading-relaxed mb-4 font-medium">{complaint}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 mt-2 border-t border-emerald-100/40 dark:border-emerald-700/40 gap-4">
                      <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300 font-semibold group/upvote">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/60 group-hover/upvote:bg-emerald-100/90 transition">
                          <svg className="w-6 h-6 group-hover/upvote:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="font-bold text-xl">{upvotes}</span>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-300">upvotes</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                        <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-base font-medium">Complaint #{id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;
