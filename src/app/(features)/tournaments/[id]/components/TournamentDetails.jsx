"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp, Users, Trophy, Calendar, MapPin } from "lucide-react";
import { getTournamentById } from "@/redux/slice/tournamentSlice";

export default function TournamentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleTournament, loading, error } = useSelector(
    (state) => state.tournamentsSlice
  );
  
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (id) dispatch(getTournamentById(id));
  }, [dispatch, id]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'doubles':
        return <Users size={16} className="text-blue-400" />;
      case 'singles':
        return <Users size={16} className="text-green-400" />;
      default:
        return <Trophy size={16} className="text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6 flex items-center justify-center">
      <p className="text-gray-400 text-xl">Loading tournament details...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6 flex items-center justify-center">
      <p className="text-red-500 text-xl">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            {singleTournament?.name}
          </h1>
          
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={20} className="text-red-400" />
              <span>{new Date(singleTournament?.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={20} className="text-red-400" />
              <span>{singleTournament?.location}</span>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(singleTournament?.status)}`}>
              <Trophy size={16} />
              <span className="capitalize">{singleTournament?.status}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Trophy className="text-red-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{singleTournament?.statistics?.totalCategories}</p>
                  <p className="text-gray-400 text-sm">Total Categories</p>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{singleTournament?.statistics.uniqueUsers}</p>
                  <p className="text-gray-400 text-sm">Total Players</p>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Calendar className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">
                    {singleTournament?.categories?.filter(cat => cat.type === 'doubles').length}
                  </p>
                  <p className="text-gray-400 text-sm">Doubles Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-zinc-700">
            <h2 className="text-2xl font-bold text-gray-100">Tournament Categories</h2>
            <p className="text-gray-400 mt-1">Click on a category to view participants</p>
          </div>

          <div className="divide-y divide-zinc-700/50">
            {singleTournament?.categories?.map((category) => (
              <div key={category._id} className="hover:bg-zinc-700/30 transition-colors duration-200">
                {/* Category Header */}
                <div 
                  className="px-6 py-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category._id)}
                >
                  <div className="flex items-center gap-4">
                    {getCategoryIcon(category.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">{category.name}</h3>
                      <p className="text-gray-400 text-sm capitalize">
                        {category.type} • {category.players?.length || 0} participants
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                      {expandedCategories[category._id] ? 'Hide' : 'Show'} Participants
                    </span>
                    {expandedCategories[category._id] ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Participants List */}
                {expandedCategories[category._id] && (
                  <div className="px-6 py-4 bg-zinc-800/30 border-t border-zinc-700/50">
                    <div className="grid gap-3">
                      {category.players?.map((player, index) => (
                        <div 
                          key={player._id}
                          className="flex items-center justify-between p-3 bg-zinc-700/20 rounded-lg border border-zinc-600/30"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 flex items-center justify-center bg-zinc-600 rounded-full text-sm font-semibold text-gray-200">
                              {index + 1}
                            </div>
                            
                            <div>
                              {category.type === 'doubles' ? (
                                <div>
                                  <p className="text-gray-100 font-medium">
                                    {player.player1} & {player.player2}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {player.user1?.qid} • {player.user2?.qid}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-gray-100 font-medium">
                                    {player.player1 || player.name}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {player.memberId}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Trophy size={16} className="text-yellow-400" />
                              <span className="text-gray-100 font-semibold">
                                {player.points || 0} pts
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Position: {player.position || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {(!category.players || category.players.length === 0) && (
                        <div className="text-center py-6 text-gray-400">
                          No participants in this category
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!singleTournament?.categories || singleTournament.categories.length === 0) && (
            <div className="px-6 py-12 text-center text-gray-400">
              No categories found for this tournament
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Tournament ID: {singleTournament?._id} • 
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}