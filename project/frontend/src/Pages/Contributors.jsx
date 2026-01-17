import { useEffect, useState } from "react";
import {
  Github,
  ChevronDown,
  Search,
  GitBranch,
  Users,
  TrendingUp,
  Award,
  Medal,
  Crown,
} from "lucide-react";

const ContributorsPage = () => {
  const [contributors, setContributors] = useState([]);
  const [displayedContributors, setDisplayedContributors] = useState([]);
  const [filteredContributors, setFilteredContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("contributions");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({
    totalContributors: 0,
    totalContributions: 0,
    topContributor: null,
  });

  const CONTRIBUTORS_PER_PAGE = 12;

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/HarshS16/saafsafai/contributors?per_page=200"
        );
        if (!response.ok) throw new Error("Failed to fetch contributors");
        const data = await response.json();
        const sortedData = (data || []).sort(
          (a, b) => b.contributions - a.contributions
        );
        setContributors(sortedData);
        setFilteredContributors(sortedData);
        setDisplayedContributors(sortedData.slice(0, CONTRIBUTORS_PER_PAGE));
        setHasMore(sortedData.length > CONTRIBUTORS_PER_PAGE);
        setStats({
          totalContributors: sortedData.length,
          totalContributions: sortedData.reduce((sum, c) => sum + c.contributions, 0),
          topContributor: sortedData[0],
        });
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContributors();
  }, []);

  useEffect(() => {
    let filtered = contributors.filter((contributor) =>
      contributor.login.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => {
      if (sortBy === "contributions") return b.contributions - a.contributions;
      if (sortBy === "alphabetical") return a.login.localeCompare(b.login);
      return 0;
    });
    setFilteredContributors(filtered);
    setDisplayedContributors(filtered.slice(0, CONTRIBUTORS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > CONTRIBUTORS_PER_PAGE);
  }, [searchTerm, sortBy, contributors]);

  const loadMoreContributors = () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = page * CONTRIBUTORS_PER_PAGE;
    const endIndex = startIndex + CONTRIBUTORS_PER_PAGE;
    const newContributors = filteredContributors.slice(startIndex, endIndex);
    setTimeout(() => {
      setDisplayedContributors((prev) => [...prev, ...newContributors]);
      setPage(nextPage);
      setHasMore(endIndex < filteredContributors.length);
      setIsLoadingMore(false);
    }, 500);
  };

  const getRankIcon = (index) => {
    if (index === 0)
      return <Crown className="w-5 h-5 text-yellow-500 drop-shadow" />;
    if (index === 1)
      return <Medal className="w-5 h-5 text-gray-400 drop-shadow" />;
    if (index === 2)
      return <Award className="w-5 h-5 text-amber-600 drop-shadow" />;
    return null;
  };
  // Modern chip colors but subtle greenish background
  const getContributionLevel = (contributions) => {
    if (contributions >= 100)
      return {
        level: "Legend",
        color: "bg-gradient-to-r from-purple-400 to-purple-600",
        textColor: "text-white",
      };
    if (contributions >= 50)
      return {
        level: "Expert",
        color: "bg-gradient-to-r from-sky-400 to-blue-500",
        textColor: "text-white",
      };
    if (contributions >= 20)
      return {
        level: "Advanced",
        color: "bg-gradient-to-r from-emerald-400 to-emerald-600",
        textColor: "text-white",
      };
    if (contributions >= 10)
      return {
        level: "Intermediate",
        color: "bg-gradient-to-r from-lime-200 to-emerald-300",
        textColor: "text-green-900",
      };
    return {
      level: "Beginner",
      color: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-700 dark:text-gray-200",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-gray-950 dark:via-green-950 dark:to-emerald-950 flex flex-col">
      {/* HERO + Stats */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 dark:from-emerald-800 dark:via-green-800 dark:to-emerald-900 shadow-xl mb-2">
        <div className="absolute inset-0 bg-emerald-500/20 dark:bg-black/30 backdrop-blur-2xl" />
        <div className="relative px-6 py-20 sm:py-26">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-xl">
              Our Amazing <span className="block bg-gradient-to-r from-green-200 via-emerald-300 to-teal-200 bg-clip-text text-transparent">Contributors</span>
            </h1>
            <p className="text-xl text-emerald-50/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
              Meet the talented developers making saafsafai better every day.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 max-w-3xl mx-auto">
              <div className="blur-card-green">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-9 h-9 text-emerald-400 dark:text-emerald-300" />
                </div>
                <div className="text-4xl font-bold text-emerald-900 dark:text-green-100">{stats.totalContributors}</div>
                <div className="uppercase mt-1 text-emerald-700 dark:text-emerald-200 font-semibold text-xs tracking-wide">Contributors</div>
              </div>
              <div className="blur-card-green">
                <div className="flex items-center justify-center mb-2">
                  <GitBranch className="w-9 h-9 text-teal-400 dark:text-emerald-200" />
                </div>
                <div className="text-4xl font-bold text-emerald-900 dark:text-green-100">{stats.totalContributions}</div>
                <div className="uppercase mt-1 text-emerald-700 dark:text-emerald-200 font-semibold text-xs tracking-wide">Total Contributions</div>
              </div>
              <div className="blur-card-green">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-9 h-9 text-lime-400 dark:text-emerald-100" />
                </div>
                <div className="text-4xl font-bold text-emerald-900 dark:text-green-100">{stats.topContributor?.contributions || 0}</div>
                <div className="uppercase mt-1 text-emerald-700 dark:text-emerald-200 font-semibold text-xs tracking-wide">Top Contributions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-xl p-6 mb-8 border border-emerald-200/50 dark:border-emerald-900/60">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-3 py-3 border-none rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-emerald-100/50 dark:bg-gray-800 dark:text-white shadow-inner"
              />
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-3 px-4 rounded-xl shadow-inner bg-emerald-100/70 dark:bg-gray-800 dark:text-white border border-green-200/50 dark:border-emerald-900/60 focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option value="contributions">Most Contributions</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <div className="flex bg-emerald-100/40 dark:bg-emerald-900/40 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${viewMode === "grid"
                      ? "bg-white/80 dark:bg-emerald-950 shadow text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-gray-600 dark:text-gray-300"
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${viewMode === "list"
                      ? "bg-white/80 dark:bg-emerald-950 shadow text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-gray-600 dark:text-gray-300"
                    }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contributor Cards */}
        {isLoading ? (
          <div
            className={`grid gap-7 ${viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
              }`}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-emerald-950 rounded-2xl shadow-2xl p-7 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-emerald-200 dark:bg-emerald-900 rounded-full" />
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-emerald-200 dark:bg-emerald-900 rounded mb-2" />
                    <div className="w-20 h-3 bg-emerald-200 dark:bg-emerald-900 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-5">🚨</div>
            <p className="text-red-700 dark:text-red-300 text-xl font-semibold mb-2">
              Oops! Something went wrong
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't load the contributors. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-7 ${viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                }`}
            >
              {displayedContributors.map((user, index) => {
                const contributionLevel = getContributionLevel(user.contributions);
                const rank = contributors.findIndex(
                  (c) => c.login === user.login
                );
                return (
                  <div
                    key={user.login}
                    className={`group relative blur-card-contributor ${viewMode === "list"
                        ? "flex items-center p-6"
                        : "p-7"
                      }`}
                  >
                    {rank < 3 && (
                      <div className="absolute top-5 right-5 z-10">{getRankIcon(rank)}</div>
                    )}
                    {rank === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300/20 to-yellow-200/10 dark:from-yellow-300/10 dark:to-yellow-400/5 pointer-events-none"></div>
                    )}
                    <div
                      className={`relative z-10 ${viewMode === "list"
                          ? "flex items-center w-full"
                          : "text-center"
                        }`}
                    >
                      <div className={viewMode === "list" ? "flex items-center gap-6 flex-1" : ""}>
                        <div className="relative">
                          <img
                            src={user.avatar_url}
                            alt={user.login}
                            className={`rounded-full border-[3px] shadow-xl transition-transform group-hover:scale-105 ${viewMode === "list"
                                ? "w-16 h-16"
                                : "w-24 h-24 mx-auto mb-4"
                              } ${rank === 0
                                ? "border-yellow-400"
                                : rank === 1
                                  ? "border-gray-400"
                                  : rank === 2
                                    ? "border-amber-600"
                                    : "border-emerald-300 dark:border-emerald-400"
                              }`}
                          />
                          {rank < 3 && (
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-emerald-950 rounded-full flex items-center justify-center shadow-xl border border-green-200 dark:border-emerald-700">
                              <span className="text-[13px] font-bold text-gray-700 dark:text-emerald-300">
                                #{rank + 1}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={viewMode === "list" ? "flex-1" : ""}>
                          <h3 className={`font-semibold text-gray-800 dark:text-white ${viewMode === "list"
                              ? "text-lg"
                              : "text-xl mb-1"
                            }`}>
                            @{user.login}
                          </h3>
                          <div className={`flex flex-wrap items-center gap-2 ${viewMode === "list" ? "mb-2" : "justify-center mb-4"
                            }`}>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${contributionLevel.color} ${contributionLevel.textColor}`}>{contributionLevel.level}</span>
                            <span className="text-xs text-green-900 dark:text-emerald-100 bg-emerald-100/70 dark:bg-emerald-900/20 px-2 py-1 rounded-full shadow-sm">
                              {user.contributions} contributions
                            </span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 ${viewMode === "list"
                            ? "ml-5"
                            : "w-full justify-center mt-5"
                          }`}
                      >
                        <Github className="w-5 h-5" />
                        View Profile
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={loadMoreContributors}
                  disabled={isLoadingMore}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
                  <div className="relative flex items-center gap-3">
                    {isLoadingMore ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading more contributors...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-6 h-6" />
                        Show More Contributors
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
            {isLoadingMore && (
              <div
                className={`grid gap-7 mt-8 ${viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                  }`}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="bg-white/80 dark:bg-emerald-950 rounded-2xl shadow-2xl p-7 animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-emerald-200 dark:bg-emerald-900 rounded-full" />
                      <div className="flex-1">
                        <div className="w-32 h-4 bg-emerald-200 dark:bg-emerald-900 rounded mb-2" />
                        <div className="w-20 h-3 bg-emerald-200 dark:bg-emerald-900 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredContributors.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-emerald-700 dark:text-emerald-300 text-xl font-semibold mb-2">
                  No contributors found
                </p>
                <p className="text-emerald-500 dark:text-emerald-200">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <style jsx>{`
        .blur-card-green {
          @apply bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-7 border border-green-200/30 dark:border-green-200/10 shadow-xl hover:shadow-emerald-200/30 transition-shadow;
        }
        .blur-card-contributor {
          @apply bg-white/95 dark:bg-emerald-950 rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-900 overflow-hidden hover:shadow-emerald-300/30 transition-all duration-300;
        }
      `}</style>
    </div>
  );
};

export default ContributorsPage;
