import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { X } from 'lucide-react';

export default function CreatePlayerModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  // Assuming you have a players slice in your Redux store
  const { createLoading, createError } = useSelector(
    (state) => state.playersSlice || {}
  );

  const [formData, setFormData] = useState({
    name: "",
    qid: "",
    club: "",
    country: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    level: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Player name is required";
    if (!formData.qid.trim()) errors.qid = "QID is required";
    if (!formData.club.trim()) errors.club = "Club is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";

    // Mobile number validation
    if (formData.mobile.trim() && !/^\d{8,15}$/.test(formData.mobile.trim())) {
      errors.mobile = "Please enter a valid mobile number";
    }

    // Date validation - ensure player is at least 5 years old
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100); // Max 100 years old
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 5); // At least 5 years old

      if (birthDate > maxDate) {
        errors.dateOfBirth = "Player must be at least 5 years old";
      }
      if (birthDate < minDate) {
        errors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      // Here you would dispatch your createPlayer action
      // const result = await dispatch(createPlayer(formData)).unwrap();

      // For now, we'll just log and show success
      console.log('Player data to submit:', formData);
      
      toast.success("Player created successfully!");

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create player:", error);
      toast.error(error?.message || "Failed to create player");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      qid: "",
      club: "",
      country: "",
      dateOfBirth: "",
      gender: "",
      mobile: "",
      level: ""
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e0066] to-[#3b2b91] px-8 py-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Create New Player</h2>
            <p className="text-sm mt-1 opacity-80">
              Fill in the player details to add to the system
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={createLoading}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-8 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {/* LEFT COLUMN */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Personal Information
                </h3>

                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066]`}
                    placeholder="Enter player name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* QID */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    QID *
                  </label>
                  <input
                    type="text"
                    name="qid"
                    value={formData.qid}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 ${
                      formErrors.qid ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066]`}
                    placeholder="Enter QID number"
                  />
                  {formErrors.qid && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.qid}</p>
                  )}
                </div>

                {/* Club */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Club *
                  </label>
                  <select
                    name="club"
                    value={formData.club}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 ${
                      formErrors.club ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066] appearance-none cursor-pointer`}
                  >
                    <option value="">Select club</option>
                    <option value="Al Sadd SC">Al Sadd SC</option>
                    <option value="Al Duhail SC">Al Duhail SC</option>
                    <option value="Al Rayyan SC">Al Rayyan SC</option>
                    <option value="Qatar SC">Qatar SC</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.club && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.club}</p>
                  )}
                </div>

                {/* Country */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 ${
                      formErrors.country ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066]`}
                    placeholder="Enter country"
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Additional Details
                </h3>

                {/* Date of Birth */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 ${
                      formErrors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066]`}
                  />
                  {formErrors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.dateOfBirth}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 ${
                      formErrors.gender ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066] appearance-none cursor-pointer`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 ${
                      formErrors.mobile ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066]`}
                    placeholder="Enter mobile number"
                  />
                  {formErrors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>
                  )}
                </div>

                {/* Level */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Level 
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-800 ${
                      formErrors.level ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1e0066]/20 focus:border-[#1e0066] appearance-none cursor-pointer`}
                  >
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                    <option value="e">E</option>

                  </select>
                  {formErrors.level && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.level}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={createLoading}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e0066] to-[#3b2b91] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? "Creating..." : "Create Player"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}