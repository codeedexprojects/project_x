"use client";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight, SlidersHorizontal, Phone, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteClubs, getClubs } from "@/redux/slice/clubSlice";
import AddClubModal from "../modals/CreateModal";
import EditClubModal from "../modals/EditClubModal";
import toast, { Toaster } from "react-hot-toast";
import DeleteClubModal from "../modals/DeleteClubModal";

export default function ClubsTable() {
  const dispatch = useDispatch();
  const { clubs, loading, error } = useSelector((state) => state.clubs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getClubs());
  }, [dispatch]);

  const handleEdit = (club) => {
    setSelectedClub(club);
    setIsEditOpen(true);
  };

  const handleDelete = (club) => {
    setSelectedClub(club);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteClubs(selectedClub._id)).unwrap();
      toast.success(`${selectedClub.name} deleted successfully`);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error(err || "Failed to delete club");
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const name = club.name?.toLowerCase() || "";
    const clubId = club.clubId?.toString() || "";
    const city = club.address?.city?.toLowerCase() || "";
    
    return (
      name.includes(searchTerm.toLowerCase()) ||
      clubId.includes(searchTerm.toLowerCase()) ||
      city.includes(searchTerm.toLowerCase())
    );
  });

  // Format mobile numbers for display
  const formatMobileNumbers = (mobileNumbers) => {
    if (!mobileNumbers || mobileNumbers.length === 0) return "N/A";
    return mobileNumbers.join(", ");
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.city}, ${address.state}`;
  };

  // Get status text
  const getStatusText = (isActive) => {
    return isActive ? "Active" : "Inactive";
  };

  // Get status badge class
  const getStatusBadgeClass = (isActive) => {
    return isActive 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  // Pagination
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClubs = filteredClubs.slice(startIndex, endIndex);

  const statuses = ["All", "Active", "Inactive"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Clubs
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1e0066] hover:bg-[#1e0066] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg"
          >
            CREATE CLUB
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
                  placeholder="Search for Club Name, Club ID, City"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
              >
                <option>All Locations</option>
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
              Loading clubs...
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[#1a1a1a] bg-[#fafafa] border-b border-gray-200">
                    <th className="px-6 py-4 font-semibold text-sm text-left">Sl.no</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Club Logo</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Club Name</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Club ID</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Location</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Contact Numbers</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Status</th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentClubs.length > 0 ? (
                    currentClubs.map((club, index) => (
                      <tr
                        key={club._id}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            {club.logo ? (
                              <img 
                                src={club.logo} 
                                alt='N/A'
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {club.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          #{club.clubId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {formatAddress(club.address)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {formatMobileNumbers(club.mobileNumbers)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(club.isActive)}`}>
                            {getStatusText(club.isActive)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(club);
                              }}
                              className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                              title="Edit Club"
                            >
                              <Pencil size={18} className="text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(club);
                              }}
                              className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                              title="Delete Club"
                            >
                              <Trash2 size={18} className="text-gray-700" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No clubs found matching your search criteria
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
              Loading clubs...
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
              {error}
            </div>
          ) : currentClubs.length > 0 ? (
            currentClubs.map((club, index) => (
              <div 
                key={club._id} 
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        {club.logo ? (
                          <img 
                            src={club.logo} 
                            alt={club.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Club name</div>
                        <div className="text-sm font-medium text-gray-900">{club.name}</div>
                        <div className="text-xs text-gray-500">ID: #{club.clubId}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(club);
                        }}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        title="Edit Club"
                      >
                        <Pencil size={16} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(club);
                        }}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        title="Delete Club"
                      >
                        <Trash2 size={16} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Location</div>
                      <div className="text-sm text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {formatAddress(club.address)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(club.isActive)}`}>
                        {getStatusText(club.isActive)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="text-xs text-gray-500 mb-1">Contact Numbers</div>
                    <div className="text-sm text-gray-700 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {formatMobileNumbers(club.mobileNumbers)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              No clubs found matching your search criteria
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && filteredClubs.length > 0 && (
          <div className="mt-4 text-gray-600 text-sm">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredClubs.length)} of {filteredClubs.length} clubs
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

        {/* Modals */}
        <AddClubModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <EditClubModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} club={selectedClub} />
        <DeleteClubModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}