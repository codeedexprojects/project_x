"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfile from "./components/PlayerProfile";
import Header from "@/components/Header";
import { deleteUser, getUserById, updateUser } from "@/redux/slice/playersSlice";
import { getClubs } from "@/redux/slice/clubSlice";
import toast from "react-hot-toast";

export default function PlayerProfilePage() {
  const params = useParams();
  const dispatch = useDispatch();
 const { singleUser, loading, error, updateLoading, deleteLoading, deleteError } = useSelector( 
    (state) => state.playerSlice 
  );
  const { clubs } = useSelector((state) => state.clubs);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const playerId = params.id;
  const router = useRouter();
  

  useEffect(() => {
    if (playerId) {
      dispatch(getUserById(playerId));
    }
    dispatch(getClubs()); 
  }, [dispatch, playerId]);

    useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
    }
  }, [deleteError]);

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


   const handleDelete = async () => {
    try {
      if (!playerId || playerId === "undefined") {
        toast.error("Invalid player ID");
        return;
      }

      const result = await dispatch(deleteUser(playerId)).unwrap();
      
      if (result.id) {
        toast.success(result.message || "Player deleted successfully!");
        setShowDeleteConfirm(false);
        router.push("/players"); 
      }
    } catch (error) {
      console.error("Failed to delete player:", error);
      toast.error(error.message || "Failed to delete player");
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

      // Only append fields that have changed
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          const value = formData[key]?.trim() || "";

          // Skip empty values for optional fields (except when explicitly setting to empty)
          if (value === "" && ["gender", "club", "level"].includes(key)) {
            // For these fields, don't send empty values
            return;
          }

          formDataToSend.append(key, value);
          console.log(
            `Field changed: ${key} from "${originalData[key]}" to "${formData[key]}"`
          );
        }
      });

      // Special handling for boolean fields
      if (formData.isActive !== originalData.isActive) {
        formDataToSend.append("isActive", formData.isActive);
      }

      // Append image file if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // If no fields changed and no new image, show message and return
      if (formDataToSend.entries().next().done && !imageFile) {
        toast.error("No changes detected");
        setIsEditing(false);
        return;
      }

      console.log("Dispatching update with only changed fields");

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
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete player <strong>{playerData.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? "Deleting..." : "Delete Player"}
              </button>
            </div>
          </div>
        </div>
      )}

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
        onDelete={() => setShowDeleteConfirm(true)}
        showActions={true}
        updateLoading={updateLoading}
        deleteLoading={deleteLoading} 
      />
    </div>
  );
}
