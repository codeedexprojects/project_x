"use client";
import React, { useEffect, useState } from "react";
import {
  Edit,
  Save,
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  PassportIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  assignUmpireToTournament,
  deleteUmpire,
  getUmpireById,
  removeUmpireFromTournament,
  updateUmpire,
} from "@/redux/slice/umpireSlice";
import toast from "react-hot-toast";
import { getTournamentsAdmin } from "@/redux/slice/tournamentSlice";

export default function UmpireDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const { tournaments } = useSelector((state) => state.tournamentsSlice);

  const { currentUmpire, loading, updateLoading } = useSelector(
    (state) => state.umpires
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [localSaveLoading, setLocalSaveLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [pendingUnassignTournamentId, setPendingUnassignTournamentId] =
    useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getUmpireById(id));
    }
  }, [dispatch, id]);

  const formatLevel = (level) => {
    const levelMap = {
      umpire: "Umpire",
      national_umpire: "National Umpire",
      international_umpire: "International Umpire",
    };
    return levelMap[level] || level;
  };
  useEffect(() => {
    if (currentUmpire) {
      setFormData({
        name: currentUmpire.name || "",
        country: currentUmpire.country || "",
        passport: currentUmpire.passport || "",
        gender: currentUmpire.gender || "",
        level: currentUmpire.level || "",
        mobileNumber: currentUmpire.mobileNumber || "",
        email: currentUmpire.email || "",
        QID: currentUmpire.QID || "",
      });
    }
  }, [currentUmpire]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentUmpire) {
      setFormData({
        name: currentUmpire.name || "",
        country: currentUmpire.country || "",
        passport: currentUmpire.passport || "",
        gender: currentUmpire.gender || "",
        level: currentUmpire.level || "",
        mobileNumber: currentUmpire.mobileNumber || "",
        email: currentUmpire.email || "",
        QID: currentUmpire.QID || "",
      });
    }
  };

  const handleSave = async () => {
    setLocalSaveLoading(true);

    try {
      const requiredFields = [
        "name",
        "country",
        "passport",
        "gender",
        "mobileNumber",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field]?.trim()
      );

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        setLocalSaveLoading(false);
        return;
      }

      const result = await dispatch(updateUmpire({ id, data: formData }));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Umpire updated successfully!");
        setIsEditing(false);
        dispatch(getUmpireById(id));
      } else {
        throw new Error(result.error?.message || "Failed to update umpire");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Failed to update umpire");
    } finally {
      setLocalSaveLoading(false);
    }
  };

  const handleAssignTournament = async () => {
    if (!selectedTournament) {
      toast.error("Please select a tournament");
      return;
    }

    const result = await dispatch(
      assignUmpireToTournament({
        umpireId: currentUmpire._id,
        tournamentId: selectedTournament,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Tournament assigned successfully!");
      setShowTournamentModal(false);
      dispatch(getUmpireById(id));
    } else {
      toast.error("Failed to assign tournament");
    }
  };

  const handleUnassignClick = (tournamentId) => {
    setPendingUnassignTournamentId(tournamentId);
    setShowUnassignModal(true);
  };

  const confirmUnassign = async () => {
    const result = await dispatch(
      removeUmpireFromTournament({
        umpireId: currentUmpire._id,
        tournamentId: pendingUnassignTournamentId,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Tournament unassigned successfully!");
      dispatch(getUmpireById(id));
    } else {
      toast.error("Failed to unassign tournament");
    }

    setShowUnassignModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteUmpire = async () => {
    const result = await dispatch(deleteUmpire(currentUmpire._id));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Umpire deleted successfully!");
      window.location.href = "/umpire";
    } else {
      toast.error("Failed to delete umpire");
    }

    setShowDeleteModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700 border border-green-200",
      inactive: "bg-red-100 text-red-700 border border-red-200",
      pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const getRoleColor = (role) => {
    const colors = {
      chief_umpire: "bg-purple-100 text-purple-700 border border-purple-200",
    };
    return colors[role] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTournamentStatusColor = (status) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-700",
      ongoing: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const editableFields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      required: true,
      icon: User,
    },
    {
      key: "country",
      label: "Country",
      type: "text",
      required: true,
      icon: MapPin,
    },
    {
      key: "passport",
      label: "Passport Number",
      type: "text",
      required: true,
      icon: PassportIcon,
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: ["male", "female", "other"],
      required: true,
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: ["umpire", "national_umpire", "international_umpire"],
      required: true,
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      type: "tel",
      required: true,
      icon: Phone,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: false,
      icon: Mail,
    },
    {
      key: "QID",
      label: "QID",
      type: "text",
      required: false,
    },
  ];

  const renderEditableField = (field) => {
    const IconComponent = field.icon;

    if (field.type === "select") {
      return (
        <select
          value={formData[field.key] || ""}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          className="w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
          disabled={localSaveLoading}
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {field.key === "level"
                ? formatLevel(option)
                : option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div className="relative">
        {IconComponent && (
          <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          type={field.type}
          value={formData[field.key] || ""}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          className={`w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors ${
            IconComponent ? "pl-10" : ""
          } ${localSaveLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          min={field.type === "number" ? "0" : undefined}
          disabled={localSaveLoading}
        />
      </div>
    );
  };

  const isSaving = localSaveLoading || updateLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading umpire details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUmpire) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Umpire Not Found
            </h3>
            <p className="text-gray-500">
              The requested umpire could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Umpire Profile
              </h1>
              <p className="text-sm text-gray-500">
                Manage umpire information and tournament assignments
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                dispatch(getTournamentsAdmin());
                setShowTournamentModal(true);
              }}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              Assign Tournament
            </button>

            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 flex-1 sm:flex-none justify-center"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            )}
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
            >
              Delete Umpire
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                {isEditing ? (
                  <div className="w-full">
                    <label className="text-xs text-gray-500 block mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                      placeholder="Enter umpire name"
                      required
                      disabled={isSaving}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                      {currentUmpire.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Umpire ID: {currentUmpire.umpireId}
                    </p>
                    <span
                      className={`${getStatusColor(
                        currentUmpire.isActive ? "active" : "inactive"
                      )} text-xs font-medium px-3 py-1 rounded-full mt-2 inline-block`}
                    >
                      {currentUmpire.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {editableFields.map((field) => {
                  if (field.key === "name") return null;

                  return (
                    <div key={field.key}>
                      <label className="text-xs text-gray-500 block mb-1 font-medium">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {isEditing ? (
                        renderEditableField(field)
                      ) : (
                        <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          {field.key === "level"
                            ? formatLevel(currentUmpire[field.key])
                            : currentUmpire[field.key] || "N/A"}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div>
                  <label className="text-xs text-gray-500 block mb-1 font-medium">
                    Umpire ID
                  </label>
                  <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    {currentUmpire.umpireId}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1 font-medium">
                    Member Since
                  </label>
                  <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    {formatDate(currentUmpire.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="p-2 bg-blue-100 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentUmpire.QID}
                </h3>
                <p className="text-sm text-gray-500">QID</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="p-2 bg-green-100 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentUmpire.assignedTournaments?.length || 0}
                </h3>
                <p className="text-sm text-gray-500">Tournaments Assigned</p>
              </div>
            </div>
            {currentUmpire.assignedTournaments &&
            currentUmpire.assignedTournaments.filter(
              (assignment) => assignment.tournament
            ).length > 0 ? (
              currentUmpire.assignedTournaments
                .filter((assignment) => assignment.tournament)
                .map((assignment, index) => (
                  <div
                    key={assignment._id || index}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 to-white p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {assignment.tournament?.name ||
                              "Unnamed Tournament"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(assignment.tournament?.start_date)} -{" "}
                            {formatDate(assignment.tournament?.end_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`${getRoleColor(
                            assignment.role
                          )} text-xs font-medium px-3 py-2 rounded-lg capitalize`}
                        >
                          {assignment.role?.replace("_", " ") || "No role"}
                        </span>
                        <span
                          className={`${getTournamentStatusColor(
                            assignment.tournament?.status
                          )} text-xs font-medium px-3 py-2 rounded-lg capitalize`}
                        >
                          {assignment.tournament?.status || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="text-gray-800 ml-2">
                            {assignment.tournament?.location || "Unknown"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Assigned Date:</span>
                          <span className="text-gray-800 ml-2">
                            {formatDate(assignment.assignedDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Categories:</span>
                          <span className="text-gray-800 ml-2">
                            {assignment.categories &&
                            assignment.categories.length > 0
                              ? assignment.categories.join(", ")
                              : "All Categories"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tournament ID:</span>
                          <span className="text-gray-800 ml-2 font-mono">
                            {assignment.tournament?._id || "N/A"}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          {assignment.tournament && (
                            <button
                              onClick={() =>
                                handleUnassignClick(assignment.tournament._id)
                              }
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              Unassign
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Tournament Assignments
                </h3>
                <p className="text-gray-500">
                  This umpire hasn't been assigned to any tournaments yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showTournamentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Assign Tournament</h2>

            {tournaments.length === 0 ? (
              <p className="text-gray-500">No tournaments found.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-3">
                {tournaments.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTournament(t._id)}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-indigo-50 ${
                      selectedTournament === t._id
                        ? "border-indigo-600 bg-indigo-100"
                        : "border-gray-300"
                    }`}
                  >
                    <h3 className="font-medium">{t.name}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(t.start_date).toLocaleDateString()} -{" "}
                      {new Date(t.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">{t.location}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTournamentModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAssignTournament}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-lg font-semibold mb-4">Delete Umpire</h2>
            <p className="text-gray-600">
              Are you sure you want to delete this umpire? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteUmpire}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showUnassignModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-lg font-semibold mb-4">Unassign Tournament</h2>
            <p className="text-gray-600">
              Are you sure you want to unassign this tournament from the umpire?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUnassignModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnassign}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Unassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
