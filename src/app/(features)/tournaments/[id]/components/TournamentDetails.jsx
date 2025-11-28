"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Award,
  Users2,
  User,
  Sword,
  Shield,
  CopyCheck,
  SquarePlus,
  Crown,
  Medal,
  Star,
  Target,
  Zap,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  deleteTournament,
  getTournamentById,
} from "@/redux/slice/tournamentSlice";

export default function TournamentDetails() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { singleTournament, loading, error } = useSelector(
    (state) => state.tournamentsSlice
  );

  const [expandedCategories, setExpandedCategories] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) dispatch(getTournamentById(id));
  }, [dispatch, id]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteTournament(id));
      // Redirect to tournaments list after successful deletion
      router.push("/tournaments");
    } catch (error) {
      console.error("Failed to delete tournament:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case "doubles":
        return <Users2 size={20} className="text-blue-600" />;
      case "singles":
        return <User size={20} className="text-green-600" />;
      default:
        return <Trophy size={20} className="text-yellow-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
            Completed
          </span>
        );
      case "ongoing":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
            Ongoing
          </span>
        );
      case "upcoming":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
            Upcoming
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200">
            Unknown
          </span>
        );
    }
  };

  const getPositionIcon = (position) => {
    switch (position?.toLowerCase()) {
      case "winner":
        return <Crown size={20} className="text-yellow-500" />;
      case "runner-up":
        return <Medal size={20} className="text-gray-400" />;
      case "semifinal":
        return <Award size={20} className="text-orange-500" />;
      case "quarter final":
        return <Star size={20} className="text-purple-500" />;
      default:
        return <Target size={20} className="text-blue-500" />;
    }
  };

  const getPositionBadge = (position) => {
    switch (position?.toLowerCase()) {
      case "winner":
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
      case "runner-up":
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200";
      case "semifinal":
        return "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200";
      case "quarter final":
        return "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200";
      default:
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tournament details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <p className="text-red-500 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {singleTournament?.name}
                  </h1>
                  {getStatusBadge(singleTournament?.status)}
                </div>

                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="font-medium">Starts:</span>
                    <span>
                      {singleTournament?.start_date
                        ? formatDateTime(singleTournament.start_date)
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    <MapPin size={18} className="text-red-600" />
                    <span className="font-medium">Location:</span>
                    <span>{singleTournament?.location || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <div className="lg:ml-6 mt-4 lg:mt-0">
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 size={20} />
                  {isDeleting ? "Deleting..." : "Delete Tournament"}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* ... existing stats grid code ... */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Trophy className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {singleTournament?.statistics?.totalCategories || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Total Categories</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Users className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {singleTournament?.statistics?.uniqueUsers || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Total Players</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <SquarePlus className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {singleTournament?.statistics?.singlesCategories || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Singles</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CopyCheck className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {singleTournament?.statistics?.doublesCategories || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Doubles</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Shield className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {singleTournament?.statistics?.totalTeams || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Total Teams</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Sword className="text-cyan-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {singleTournament?.statistics?.totalPlayerEntries || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Total Entries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Tournament Categories
              </h2>
              <p className="text-gray-600 mt-2">
                Click on a category to view participants and their achievements
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {singleTournament?.categories?.map((category) => (
                <div
                  key={category._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Category Header */}
                  <div
                    className="px-8 py-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        {getCategoryIcon(category.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {category.type}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {category.players?.length || 0} participants
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-sm font-medium">
                        {expandedCategories[category._id] ? "Hide" : "View"}{" "}
                        Participants
                      </span>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {expandedCategories[category._id] ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Participants List */}
                  {expandedCategories[category._id] && (
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                      <div className="grid gap-4">
                        {category.players?.map((player, index) => (
                          <div
                            key={player._id}
                            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white font-bold text-lg shadow-sm">
                                  {index + 1}
                                </div>
                                <div className="flex items-center gap-3">
                                  {getPositionIcon(player.displayPosition)}
                                  <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getPositionBadge(
                                      player.displayPosition
                                    )}`}
                                  >
                                    {player.displayPosition || "Participant"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Player Details */}
                            {category.type === "doubles" ? (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Player 1 */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                      1
                                    </div>
                                    <h4 className="font-bold text-gray-900">
                                      Player 1
                                    </h4>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-lg font-semibold text-gray-900">
                                      {player.player1}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 text-sm">
                                        QID:
                                      </span>
                                      <span className="font-mono font-semibold">
                                        {player.user1?.qid}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                      <span className="text-gray-700 font-medium">
                                        Individual Points:
                                      </span>
                                      <span className="text-lg font-bold text-blue-600">
                                        {player.pointsEarnedUser1 || 0}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Player 2 */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                      2
                                    </div>
                                    <h4 className="font-bold text-gray-900">
                                      Player 2
                                    </h4>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-lg font-semibold text-gray-900">
                                      {player.player2}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 text-sm">
                                        QID:
                                      </span>
                                      <span className="font-mono font-semibold">
                                        {player.user2?.qid}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                                      <span className="text-gray-700 font-medium">
                                        Individual Points:
                                      </span>
                                      <span className="text-lg font-bold text-green-600">
                                        {player.pointsEarnedUser2 || 0}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Singles Player */
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    <User size={16} />
                                  </div>
                                  <h4 className="font-bold text-gray-900">
                                    Player Details
                                  </h4>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-lg font-semibold text-gray-900">
                                    {player.player1 || player.name}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">
                                      Member ID:
                                    </span>
                                    <span className="font-mono font-semibold">
                                      {player.memberId}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                                    <span className="text-gray-700 font-medium">
                                      Points Earned:
                                    </span>
                                    <span className="text-lg font-bold text-purple-600">
                                      {player.points || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {(!category.players ||
                          category.players.length === 0) && (
                          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                            <Trophy
                              size={48}
                              className="text-gray-400 mx-auto mb-4"
                            />
                            <p className="text-gray-500 text-lg font-medium">
                              No participants in this category
                            </p>
                            <p className="text-gray-400 mt-1">
                              Participants will appear here once registered
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(!singleTournament?.categories ||
              singleTournament.categories.length === 0) && (
              <div className="px-8 py-16 text-center bg-white">
                <Trophy size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-xl font-medium">
                  No categories found
                </p>
                <p className="text-gray-400 mt-2">
                  This tournament doesn't have any categories yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Tournament
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete the tournament:
              </p>
              <p className="text-lg font-semibold text-gray-900 mb-4 bg-gray-50 p-3 rounded-lg border">
                "{singleTournament?.name}"
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className="text-red-500 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-red-800 font-medium text-sm">
                      This action cannot be undone
                    </p>
                    <p className="text-red-600 text-sm mt-1">
                      All tournament data, categories, and player records will
                      be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete Tournament
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
