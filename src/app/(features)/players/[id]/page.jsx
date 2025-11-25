"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfile from "./components/PlayerProfile";
import Header from "@/components/Header";
import { getUserById, updateUser } from "@/redux/slice/playersSlice";
import { getClubs } from "@/redux/slice/clubSlice";
import toast from "react-hot-toast";

export default function PlayerProfilePage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { singleUser, loading, error, updateLoading } = useSelector(
    (state) => state.playerSlice
  );
  const { clubs } = useSelector((state) => state.clubs);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const playerId = params.id;

  useEffect(() => {
    if (playerId) {
      dispatch(getUserById(playerId));
    }
    dispatch(getClubs()); // Load clubs for selection
  }, [dispatch, playerId]);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (singleUser?.user) {
      const user = singleUser.user;

      const initialFormData = {
        name: user.name || "",
        email: user.email || "",
        qid: user.qid || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
        country: user.country || "",
        club: user.club || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        passport: user.passport || "",
        level: user.level || "",
        role: user.role || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
      };

      setFormData(initialFormData);
      setOriginalData(initialFormData);
      setImagePreview(
        user.image ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
      );
    }
  }, [singleUser]);

  // Transform API data to match component structure
  const transformPlayerData = () => {
    if (!singleUser?.user) return null;

    const user = singleUser.user;
    const clubName = user.club?.name || user.club || "N/A";

    return {
      name: user.name || "N/A",
      playerId: user.qid || "N/A",
      level: user.level || "N/A",
      gid: user.qid || "N/A",
      gender: user.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
        : "N/A",
      nationality: user.country || "N/A",
      club: clubName,
      dob: user.dob
        ? new Date(user.dob).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      address: "N/A",
      mobileNumber: user.mobile || "N/A",
      email: user.email || "N/A",
      passport: user.passport || "N/A",
      profileImage:
        user.image ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    };
  };

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
          date: tournamentPart.tournament.createdAt
            ? new Date(tournamentPart.tournament.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                }
              )
            : "N/A",
          tournament: tournamentPart.tournament.name,
          start_date: tournamentPart.tournament.start_date,
          end_date: tournamentPart.tournament.end_date,
          location: tournamentPart.tournament.location,
          position: position,
          points: tournamentPart.participation.pointsEarned,
          color: color,
        };
      });

      return {
        title: categoryPart.category.name,
        type: categoryPart.category.type,
        rank: index + 1,
        matches: matches,
        totalPoints: categoryPart.totalPoints,
      };
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setImageFile(null);
    setImagePreview(
      singleUser?.user?.image ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    );
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Player ID:", playerId);

      if (!playerId || playerId === "undefined") {
        toast.error("Invalid player ID");
        return;
      }

      // Validate required fields
      if (!formData.name?.trim()) {
        toast.error("Name is required");
        return;
      }

      if (!formData.qid?.trim()) {
        toast.error("Player ID is required");
        return;
      }

      // Create FormData to handle file upload
      const formDataToSend = new FormData();

      // Append all fields with proper validation
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("email", formData.email?.trim() || "");
      formDataToSend.append("qid", formData.qid.trim());
      formDataToSend.append("mobile", formData.mobile?.trim() || "");

      // Only append gender if it has a value (not empty string)
      if (formData.gender && formData.gender.trim()) {
        formDataToSend.append("gender", formData.gender.trim());
      }

      formDataToSend.append("country", formData.country?.trim() || "");

      // Only append club if it has a valid value (not empty string)
      if (formData.club && formData.club.trim()) {
        formDataToSend.append("club", formData.club.trim());
      }

      formDataToSend.append("dob", formData.dob || "");
      formDataToSend.append("passport", formData.passport?.trim() || "");

      // Only append level if it has a value (not empty string)
      if (formData.level && formData.level.trim()) {
        formDataToSend.append("level", formData.level.trim());
      }

      formDataToSend.append("role", formData.role?.trim() || "player");
      formDataToSend.append(
        "isActive",
        formData.isActive !== undefined ? formData.isActive : true
      );

      // Append image file if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("Dispatching update with form data");

      // Call the thunk with correct parameter structure
      const result = await dispatch(
        updateUser({
          id: playerId,
          formData: formDataToSend,
        })
      ).unwrap();

      if (result.success) {
        // Update original data and exit edit mode
        setOriginalData(formData);
        setImageFile(null);
        setIsEditing(false);

        // Refresh user data
        dispatch(getUserById(playerId));
        toast.success("Player profile updated successfully!");
      } else {
        // Handle API validation errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => {
            toast.error(`${error.field}: ${error.message}`);
          });
        } else {
          toast.error(result.message || "Failed to update player profile");
        }
      }
    } catch (error) {
      console.error("Failed to update user:", error);

      // Handle different error formats
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update player profile. Please try again.");
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExport = () => {
    console.log("Export to PDF");
    // Implement PDF export logic
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
        isEditing={isEditing}
        formData={formData}
        clubs={clubs}
        imagePreview={imagePreview}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onExport={handleExport}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        showActions={true}
        updateLoading={updateLoading}
      />
    </div>
  );
}
