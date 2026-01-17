import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Mail, Phone, Globe, Clock, Search, Plane } from "lucide-react";

const AirSevaPage = () => {
  const [airData, setAirData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/gtfs/93710e81-db2b-4f95-9223-89156dfd8bc9.csv");
        const text = await res.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setAirData(result.data);
            setFilteredData(result.data);
          },
        });
      } catch (error) {
        console.error("Error loading stops:", error);
      }
    }
    fetchStops();
  }, []);

  useEffect(() => {
    const filtered = airData.filter(item =>
      item.titleEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleHindi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryenglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryHindi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionHindi?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, airData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-green-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              AirSeva Directory
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your comprehensive guide to aviation services and resources
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services, categories, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-green-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-green-400 dark:focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Results Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-gray-700 px-3 py-1 rounded-full">
              {filteredData.length} service{filteredData.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 max-w-md mx-auto border border-green-100 dark:border-gray-700">
              <Search className="w-16 h-16 text-green-300 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or clear the search to view all services.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-gray-700">
                      {item.categoryenglish}
                    </span>
                  </div>

                  {/* Title Section */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-200">
                      {item.titleEnglish}
                    </h2>
                    {item.titleHindi && (
                      <h3 className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                        {item.titleHindi}
                      </h3>
                    )}
                  </div>

                  {/* Description Section */}
                  <div className="mb-6 space-y-2">
                    {item.descriptionEnglish && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {item.descriptionEnglish}
                      </p>
                    )}
                    {item.descriptionHindi && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {item.descriptionHindi}
                      </p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-4">
                    {item.email && (
                      <div className="flex items-center space-x-3 group/contact">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover/contact:bg-green-200 dark:group-hover/contact:bg-green-800 transition-colors duration-200">
                          <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 truncate flex-1"
                        >
                          {item.email}
                        </a>
                      </div>
                    )}
                    {item.phone && (
                      <div className="flex items-center space-x-3 group/contact">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover/contact:bg-green-200 dark:group-hover/contact:bg-green-800 transition-colors duration-200">
                          <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <a
                          href={`tel:${item.phone}`}
                          className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                        >
                          {item.phone}
                        </a>
                      </div>
                    )}
                    {item.website && (
                      <div className="flex items-center space-x-3 group/contact">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover/contact:bg-green-200 dark:group-hover/contact:bg-green-800 transition-colors duration-200">
                          <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 truncate flex-1"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Last Updated */}
                  {item.last_updated && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Last updated: {item.last_updated}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AirSevaPage;