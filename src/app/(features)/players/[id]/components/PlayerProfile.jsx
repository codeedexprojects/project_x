"use client";
import React from "react";
import { Trophy, Edit, Save, X, User, Camera } from "lucide-react";

export default function PlayerProfile({
  playerData,
  tournaments,
  isEditing,
  formData,
  clubs = [],
  imagePreview,
  onEdit,
  onCancel,
  onSave,
  onInputChange,
  onImageChange,
  showActions = true,
  updateLoading = false,
}) {
  const getPositionColor = (color) => {
    const colors = {
      green: "bg-green-100 text-green-700 border border-green-200",
      orange: "bg-orange-100 text-orange-700 border border-orange-200",
      blue: "bg-blue-100 text-blue-700 border border-blue-200",
      red: "bg-red-100 text-red-700 border border-red-200",
    };
    return colors[color] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const getRankColor = (totalPoints) => {
    if (totalPoints >= 100)
      return "bg-gradient-to-r from-green-500 to-green-600";
    if (totalPoints >= 50) return "bg-gradient-to-r from-blue-500 to-blue-600";
    if (totalPoints >= 25)
      return "bg-gradient-to-r from-purple-500 to-purple-600";
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const editableFields = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: false },
    { key: "qid", label: "Player ID", type: "text", required: true },
    { key: "mobile", label: "Mobile Number", type: "tel", required: false },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: ["male", "female", "other"],
      required: false,
    },
    { key: "country", label: "Nationality", type: "text", required: false },
    { key: "club", label: "Club", type: "clubSelect", required: false },
    { key: "dob", label: "Date of Birth", type: "date", required: false },
    { key: "passport", label: "Passport", type: "text", required: false },
  ];

  const renderEditableField = (field) => {
    if (field.type === "select") {
      return (
        <select
          value={formData[field.key] || ""}
          onChange={(e) => onInputChange(field.key, e.target.value)}
          className="w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "clubSelect") {
      return (
        <select
          value={formData[field.key] || ""}
          onChange={(e) => onInputChange(field.key, e.target.value)}
          className="w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
        >
          <option value="">Select Club</option>
          {clubs.map((club) => (
            <option key={club._id} value={club._id}>
              {club.name}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        value={formData[field.key] || ""}
        onChange={(e) => onInputChange(field.key, e.target.value)}
        className="w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    );
  };

  const renderDisplayField = (key, value) => {
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    return (
      <div key={key}>
        <label className="text-xs text-gray-500 block mb-1 font-medium">
          {label}
        </label>
        <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          {value || "N/A"}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Player Profile
              </h1>
              <p className="text-sm text-gray-500">
                Manage player information and tournament history
              </p>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <>
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onCancel}
                    disabled={updateLoading}
                    className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 flex-1 sm:flex-none justify-center"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={onSave}
                    disabled={updateLoading}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
                  >
                    <Save className="w-4 h-4" />
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {isEditing ? (
                  <div className="w-full">
                    <label className="text-xs text-gray-500 block mb-1 font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => onInputChange("name", e.target.value)}
                      className="w-full text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                      placeholder="Enter player name"
                      required
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {playerData.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Player ID: {playerData.playerId}
                    </p>
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
                          {playerData[field.key] || "N/A"}
                        </div>
                      )}
                    </div>
                  );
                })}

                {["address"].map((key) =>
                  renderDisplayField(key, playerData[key])
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {tournaments && tournaments.length > 0 ? (
              tournaments.map((tournament, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-white p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Trophy className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {tournament.title}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {tournament.type} • {tournament.matches.length}{" "}
                          tournaments
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${getRankColor(
                        tournament.totalPoints
                      )} text-white text-xs font-semibold px-3 py-2 rounded-lg`}
                    >
                      Total Points: {tournament.totalPoints}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">
                            Date
                          </th>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">
                            Tournament
                          </th>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">
                            Location
                          </th>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">
                            Position
                          </th>
                          <th className="text-right text-xs font-medium text-gray-600 px-4 py-3">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {tournament.matches.map((match, matchIdx) => (
                          <tr
                            key={matchIdx}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {match.start_date && match.end_date
                                ? `${new Date(
                                    match.start_date
                                  ).toLocaleDateString()} - ${new Date(
                                    match.end_date
                                  ).toLocaleDateString()}`
                                : match.start_date
                                ? new Date(
                                    match.start_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {match.tournament}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {match.location}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`${getPositionColor(
                                  match.color
                                )} text-xs font-medium px-3 py-1 rounded-full inline-block min-w-[100px] text-center`}
                              >
                                {match.position}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">
                              {match.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Tournament History
                </h3>
                <p className="text-gray-500">
                  This player hasn't participated in any tournaments yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
