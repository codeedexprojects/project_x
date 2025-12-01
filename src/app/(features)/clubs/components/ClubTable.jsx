"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Building2,
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteClubs, getClubs } from "@/redux/slice/clubSlice";
import AddClubModal from "../modals/CreateModal";
import EditClubModal from "../modals/EditClubModal";
import toast, { Toaster } from "react-hot-toast";
import DeleteClubModal from "../modals/DeleteClubModal";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri";
import { RiFilePdf2Line } from "react-icons/ri";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ClubsTable() {
  const dispatch = useDispatch();
  const { clubs, loading, error } = useSelector((state) => state.clubs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const formatMobileNumbers = (mobileNumbers) => {
    if (!mobileNumbers || mobileNumbers.length === 0) return "N/A";
    return mobileNumbers.join(", ");
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.city}, ${address.state}`;
  };

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClubs = filteredClubs.slice(startIndex, endIndex);

  const exportToExcel = () => {
    try {
      const excelData = filteredClubs.map((club, index) => ({
        "Sl.no": index + 1,
        "Club Name": club.name || "N/A",
        "Club ID": club.clubId || "N/A",
        City: club.address?.city || "N/A",
        State: club.address?.state || "N/A",
        "Contact Numbers": club.mobileNumbers?.join(", ") || "N/A",
        Email: club.email || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clubs");

      XLSX.writeFile(
        workbook,
        `clubs_export_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel file");
    }
  };
  const handleDownloadPDF = () => {
    try {
      // Create new PDF instance
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(30, 0, 102); // Match your theme color
      doc.text("Clubs Report", 14, 15);

      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      // Prepare data for PDF table
      const tableData = filteredClubs.map((club, index) => [
        index + 1,
        club.name || "N/A",
        club.clubId || "N/A",
        club.address?.city || "N/A",
        club.address?.state || "N/A",
        formatMobileNumbers(club.mobileNumbers),
        club.email || "N/A",
      ]);

      // Add table to PDF
      autoTable(doc, {
        head: [
          [
            "Sl.no",
            "Club Name",
            "Club ID",
            "City",
            "State",
            "Contact Numbers",
            "Email",
          ],
        ],
        body: tableData,
        startY: 30,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [30, 0, 102], // Dark blue color from your theme
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 14, right: 14 },
      });

      // Save PDF
      const fileName = `clubs_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      toast.success("PDF file downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF file:", error);
      toast.error("Failed to export PDF file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            background:
              "linear-gradient(277.59deg, #17057C -12.13%, #000000 115.41%)",
          }}
        >
          <p className="text-white text-lg font-medium mb-4">
            What are you looking for
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-[260px]">
                <input
                  type="text"
                  placeholder="Search for Club Name, Club ID, City"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white text-black px-4 py-3 rounded-xl pl-12 outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              <select className="bg-white px-4 py-3 rounded-xl text-black shadow-md cursor-pointer outline-none w-[160px]">
                <option>All Locations</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white px-6 py-3 rounded-xl text-black shadow-md font-medium flex items-center gap-2"
              >
                + CREATE CLUB
              </button>
              <button
                onClick={handleDownloadPDF}
                className="border border-white text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
              >
                <RiFilePdf2Line className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="border border-white text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
              >
                <RiFileExcel2Line className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

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
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Sl.no
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Club Logo
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Club Name
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Club ID
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Location
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Contact Numbers
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-left">
                      Actions
                    </th>
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
                                alt="N/A"
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
                        <div className="text-xs text-gray-500 mb-1">
                          Club name
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {club.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: #{club.clubId}
                        </div>
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
                  </div>

                  <div className="border-t pt-2">
                    <div className="text-xs text-gray-500 mb-1">
                      Contact Numbers
                    </div>
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

        {!loading && filteredClubs.length > 0 && (
          <div className="mt-4 text-gray-600 text-sm">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredClubs.length)}{" "}
            of {filteredClubs.length} clubs
          </div>
        )}

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
                        ? "bg-[#1e0066] text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum.toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <AddClubModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <EditClubModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          club={selectedClub}
        />
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
