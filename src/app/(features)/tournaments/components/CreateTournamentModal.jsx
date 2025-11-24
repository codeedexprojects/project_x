import { createTournament } from "@/redux/slice/tournamentSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function CreateTournamentModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { createLoading, createError } = useSelector(
    (state) => state.tournamentsSlice
  );

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    file: null,
  });

  const [fileName, setFileName] = useState("");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [".xlsx", ".xls", ".csv"];
      const fileExtension = file.name
        .toLowerCase()
        .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);

      if (!validTypes.includes("." + fileExtension)) {
        toast.error("Please upload only Excel files (.xlsx, .xls, .csv)");
        setFormErrors((prev) => ({
          ...prev,
          file: "Please upload only Excel files (.xlsx, .xls, .csv)",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        setFormErrors((prev) => ({
          ...prev,
          file: "File size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
      setFileName(file.name);

      // Clear file error
      if (formErrors.file) {
        setFormErrors((prev) => ({
          ...prev,
          file: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Tournament name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";
    if (!formData.file) errors.file = "Excel file is required";

    // Date validation
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate < startDate) {
        errors.end_date = "End date cannot be before start date";
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
      // Create FormData object to handle file upload
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("location", formData.location.trim());
      submitData.append("start_date", formData.start_date);
      submitData.append("end_date", formData.end_date);

      if (formData.file) {
        submitData.append("file", formData.file);
      }

      // Log FormData contents for debugging
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      const result = await dispatch(createTournament(submitData)).unwrap();

      toast.success("Tournament created successfully!");

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create tournament:", error);
      toast.error(error || "Failed to create tournament");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      start_date: "",
      end_date: "",
      file: null,
    });
    setFileName("");
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
    setFileName("");
    setFormErrors((prev) => ({
      ...prev,
      file: "",
    }));
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e0066] to-[#3b2b91] px-8 py-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Create New Tournament</h2>
            <p className="text-sm mt-1 opacity-80">
              Fill in the tournament details to get started
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={createLoading}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-10 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-16">
              {/* LEFT COLUMN */}
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Basic Information
                </h3>

                {/* Tournament Name */}
                <label className="block text-sm font-medium mb-2">
                  Tournament Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 text-black ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter tournament name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}

                {/* Location */}
                <label className="block text-sm font-medium mt-6 mb-2">
                  Location *
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 text-black ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter tournament location"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Schedule & Data</h3>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        formErrors.start_date
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-3 ${
                        formErrors.end_date
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {formErrors.start_date && (
                  <p className="text-red-500 text-sm">
                    {formErrors.start_date}
                  </p>
                )}
                {formErrors.end_date && (
                  <p className="text-red-500 text-sm">{formErrors.end_date}</p>
                )}

                {/* FILE UPLOAD */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Tournament Data (Excel) *
                  </label>

                  {!fileName ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:bg-gray-100">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          strokeWidth="2"
                          stroke="currentColor"
                          d="M13 13h3a3 3 0 000-6h-.025A5.56 5.56 0 0016 6.5 5.5 5.5 0 005.207 5.021 4 4 0 005 5a4 4 0 000 8h2.167M10 15V6m0 0L8 8m2-2l2 2"
                        />
                      </svg>
                      <p className="text-gray-600 text-sm">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Excel files only (.xlsx, .xls, .csv) — Max 5MB
                      </p>

                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
                    <div className="flex justify-between items-center bg-gray-100 border border-gray-300 px-4 py-3 rounded-xl">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-medium truncate">{fileName}</p>
                        <p className="text-xs text-gray-500">File selected</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="flex-shrink-0 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {formErrors.file && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.file}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e0066] to-[#3b2b91] text-white font-semibold hover:opacity-90"
              >
                Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTournamentModal;
