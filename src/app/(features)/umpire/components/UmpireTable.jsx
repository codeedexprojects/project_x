"use client";
import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUmpiresAdmin } from "@/redux/slice/umpireSlice";
import CreateUmpireModal from "./AddUmpireModal"
import { useRouter } from "next/navigation";

export default function UmpiresTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  
  const dispatch = useDispatch();
  const { umpires, loading } = useSelector((state) => state.umpires);
  const router = useRouter();

  useEffect(() => {
    dispatch(getUmpiresAdmin());
  }, [dispatch]);

  // Get unique genders and countries
  const genders = ["All", ...new Set(umpires?.map(u => u.gender).filter(Boolean))];
  const countries = ["All", ...new Set(umpires?.map(u => u.country).filter(Boolean))];

  // Filter umpires
  const filteredUmpires = umpires?.filter((umpire) => {
    const matchesSearch = 
      umpire.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umpire.passport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umpire.mobileNumber?.includes(searchTerm);
    
    const matchesGender = selectedGender === "All" || umpire.gender === selectedGender;
    const matchesCountry = selectedCountry === "All" || umpire.country === selectedCountry;
    
    return matchesSearch && matchesGender && matchesCountry;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredUmpires.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUmpires = filteredUmpires.slice(startIndex, endIndex);
  const handleUmpireClick = (Id) => {
    router.push(`/umpire/${Id}`);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Umpires
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1e0066] hover:bg-[#1e0066]/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              CREATE UMPIRE
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Name, Passport, Contact"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-black pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Gender Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                >
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Button */}
              <div className="flex items-end">
                <button className="w-full lg:w-auto px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Section - Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Loading umpires...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[#1a1a1a] bg-[#fafafa] border-b border-gray-200">
                      <th className="px-6 py-4 font-semibold text-sm text-left">Sl.no</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Umpire Name</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Gender</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Passport</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Country</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Mobile</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Tournament Assigned</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentUmpires.length > 0 ? (
                      currentUmpires.map((umpire, index) => (
                        <tr
                          key={umpire._id}
                        onClick={() => handleUmpireClick(umpire._id)}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                            {umpire.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                            {umpire.gender}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {umpire.passport}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {umpire.country}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {umpire.mobileNumber}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {umpire.assignedTournamentsCount > 0 ? (
                              <span className="text-green-600 font-medium">Assigned</span>
                            ) : (
                              <span className="text-red-600 font-medium">Not Assigned</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No umpires found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card View - Mobile */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Loading umpires...
              </div>
            ) : currentUmpires.length > 0 ? (
              currentUmpires.map((umpire, index) => (
                <div 
                  key={umpire._id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Umpire name</div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{umpire.name}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        umpire.assignedTournamentsCount > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {umpire.assignedTournamentsCount > 0 ? 'Assigned' : 'Not Assigned'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Gender</div>
                        <div className="text-sm text-gray-700 capitalize">{umpire.gender}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Passport</div>
                        <div className="text-sm text-gray-700">{umpire.passport}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Country</div>
                        <div className="text-sm text-gray-700">{umpire.country}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Mobile</div>
                        <div className="text-sm text-gray-700">{umpire.mobileNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                No umpires found matching your search criteria
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-gray-600 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUmpires.length)} of {filteredUmpires.length} umpires
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#1e0066] text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Umpire Modal */}
      <CreateUmpireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}