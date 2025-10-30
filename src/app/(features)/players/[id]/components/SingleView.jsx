"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Save,
  Trash2,
  Plus,
  Camera,
} from "lucide-react";
import { getUserById } from "@/redux/slice/playersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

const TournamentPlayerManagement = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { singleUser, loading, error } = useSelector(
    (state) => state.playerSlice
  );

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  // if (loading) return <p className="text-center mt-10">Loading...</p>;
  // if (error) return <p className="text-center text-red-500">{error}</p>;

  const player = singleUser?.user;
  const categories = singleUser?.categoryParticipation || [];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerData({ ...playerData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {player ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="w-32 h-40 border-2 border-gray-400 bg-white flex items-center justify-center">
                    {player.photo ? (
                      <img
                        src={player.image}
                        alt="Player"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={48} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Right side - Title and Player ID/Level */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black text-center mb-4">
                    {player.name}
                  </h2>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <label className="font-semibold text-black">
                        Player ID
                      </label>
                      <input
                        type="text"
                        value={player._id}
                        className="col-span-2 px-3 text-black py-1 border border-gray-300 rounded"
                        readOnly
                      />
                    </div>

                    <div className="grid grid-cols-3  items-center">
                      <label className="font-semibold text-black">Role</label>
                      <select className="col-span-2 px-1 py-1 text-black border border-gray-300 rounded">
                        <option>{player.role}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-md font-semibold text-black mt-6 mb-3 border-b border-gray-300 pb-1">
                More Details
              </h2>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">QID</label>
                  <input
                    type="text"
                    value={player.qid}
                    className="col-span-2 px-3 py-2 text-black border border-gray-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">Status</label>
                  <input
                    type="text"
                    value={player.isActive ? "Active" : "Inactive"}
                    className="col-span-2 px-3 py-2 text-black border border-gray-300 rounded"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">Gender</label>
                  <select className="col-span-2 px-3 text-black py-2 border border-gray-300 rounded">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">
                    Nationality
                  </label>
                  <select className="col-span-2  text-blackpx-3 py-2 border border-gray-300 rounded">
                    <option value="">Select...</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">Club</label>
                  <input
                    type="text"
                    value={player.club}
                    className="col-span-2 px-3 py-2 text-black border border-gray-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">DOB</label>
                  <input
                    type="date"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                    

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-semibold text-black">Mobile</label>
                  <input
                    type="tel"
                    className="col-span-2 px-3 text-black py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
                    <Plus size={16} className="mr-1" /> Edit
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center">
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="bg-blue-100 px-4 py-3 border-b-2 border-blue-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="font-bold text-blue-800">
                          {cat.category?.name}
                        </h3>
                        <span className="text-sm bg-blue-200 px-3 py-1 rounded text-black">
                          Rank: {cat.category?.rank}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-black">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-black">
                              Location
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-black">
                              Position
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-black">
                              Point
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.tournaments?.map((t, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-black">
                                {t.tournament?.name}
                              </td>
                              <td className="px-4 py-2 text-sm text-black">
                                {t.tournament?.location}
                              </td>
                              <td className="px-4 py-2 text-sm text-black">
                                {t.participation?.position}
                              </td>
                              <td className="px-4 py-2 text-sm text-black">
                                {t.participation?.pointsEarned}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-red-100 font-bold">
                            <td
                              colSpan="3"
                              className="px-4 py-2 text-right text-black"
                            >
                              Total Point
                            </td>
                            <td className="px-4 py-2 text-black">
                              {cat.totalPoints}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No tournament data available.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No player found.</p>
        )}
      </div>
    </div>
  );
};
export default TournamentPlayerManagement;
