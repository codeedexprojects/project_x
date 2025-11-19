"use client";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 6; // You can adjust this value

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
  const clubId = typeof club.clubId === "string" ? club.clubId.toLowerCase() : String(club.clubId || "");
  return (
    name.includes(searchQuery.toLowerCase()) ||
    clubId.includes(searchQuery.toLowerCase())
  );
});


  // Pagination logic
  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);
  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Club name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-black px-4 py-3 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute right-4 top-1/3 transform -translate-y-1/2 text-black w-5 h-5" />
          </div>

          {/* Total Club Card */}
          <div className="bg-indigo-900 text-white rounded-lg px-6 py-3 flex items-center gap-3 md:w-48">
            <Building2 className="w-6 h-6" />
            <div>
              <div className="text-xs opacity-90">Total Club</div>
              <div className="text-3xl font-bold">{clubs.length}</div>
            </div>
          </div>

          {/* Create Club Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium">Create Club</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Club Logo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Club Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Start Time & End Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact Number</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-black">
                    Loading clubs...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentClubs.length > 0 ? (
                currentClubs.map((club, index) => (
                  <tr
                    key={club._id}
                    className={index !== currentClubs.length - 1 ? "border-b border-gray-200" : ""}
                  >
                    <td className="px-6 py-4 text-black font-medium">{club.logo}</td>
                    <td className="px-6 py-4 text-black">{club.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div>{club.startDate}</div>
                        <div>{club.endDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black">{club.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(club)}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={() => handleDelete(club)}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No clubs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredClubs.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="flex gap-2 order-1 sm:order-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded ${
                    currentPage === index + 1
                      ? "bg-indigo-900 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed order-3"
            >
              <span>Next</span>
              <ChevronRight size={20} />
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
