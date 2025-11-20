"use client"
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import PlayerProfile from './components/PlayerProfile';
import Header from '@/components/Header';
import { getUserById } from '@/redux/slice/playersSlice';

export default function PlayerProfilePage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { singleUser, loading, error } = useSelector((state) => state.playerSlice); // Adjust slice name as needed

  const playerId = params.id;

  useEffect(() => {
    if (playerId) {
      dispatch(getUserById(playerId));
    }
  }, [dispatch, playerId]);

  // Transform API data to match component structure
  const transformPlayerData = () => {
    if (!singleUser?.user) return null;

const user = singleUser.user;

    const profileData = user.profile || {};

    return {
      name: user.name || "N/A",
      playerId: user.qid || "N/A",
      level: profileData.level || "N/A",
      gid: user.qid || "N/A", // Using qid as GID
      gender: profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : "N/A",
      nationality: profileData.country || "N/A",
      club: profileData.club || "N/A",
      dob: profileData.dob ? new Date(profileData.dob).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }) : "N/A",
      category: "Senior", // You might need to calculate this based on age
      parentName: "N/A", // Not in your API
      address: "N/A", // Not in your API
      mobileNumber: profileData.mobile || "N/A",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" // Default image
    };
  };

  // Transform tournament data from API
  const transformTournamentData = () => {
    if (!singleUser?.categoryParticipation) return [];
return singleUser.categoryParticipation.map((categoryPart, index) => {
      const matches = categoryPart.tournaments.map((tournamentPart) => {
        const position = tournamentPart.participation.displayPosition;
        
        // Determine color based on position
        let color = "red"; // default
        if (position.includes("Winner")) color = "green";
        else if (position.includes("Runner")) color = "orange";
        else if (position.includes("Semi")) color = "blue";
        else if (position.includes("Quarter")) color = "red";

        return {
          date: tournamentPart.tournament.createdAt ? 
            new Date(tournamentPart.tournament.createdAt).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: '2-digit' 
            }) : "N/A",
          tournament: tournamentPart.tournament.name,
          position: position,
          points: tournamentPart.participation.pointsEarned,
          color: color
        };
      });

      return {
        title: categoryPart.category.name,
        rank: index + 1, // You might want to calculate actual rank
        matches: matches,
        totalPoints: categoryPart.totalPoints
      };
    });
  };

  const handleUpdate = () => {
    console.log('Update player profile');
    // Implement update logic using updateUser thunk
  };

  const handleExport = () => {
    console.log('Export to PDF');
    // Implement PDF export logic
  };

  const handleSave = () => {
    console.log('Save changes');
    // Implement save logic using updateUser thunk
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading player profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={() => dispatch(getUserById(playerId))}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!singleUser) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No player data found</p>
          </div>
        </div>
      </div>
    );
  }

  const playerData = transformPlayerData();
  const tournaments = transformTournamentData();

  if (!playerData) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Failed to load player data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <PlayerProfile
        playerData={playerData}
        tournaments={tournaments}
        onUpdate={handleUpdate}
        onExport={handleExport}
        onSave={handleSave}
        showActions={true}
      />
    </div>
  );
}