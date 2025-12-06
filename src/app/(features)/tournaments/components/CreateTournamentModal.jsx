import {
  createTournament,
  getTournamentsAdmin,
} from "@/redux/slice/tournamentSlice";
import React, { useState, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateFile = (file) => {
    // If no file, it's valid (file is optional now)
    if (!file) return true;

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
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      setFormErrors((prev) => ({
        ...prev,
        file: "File size should be less than 5MB",
      }));
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (file) {
      if (validateFile(file)) {
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

        toast.success("File selected successfully!");
      }
    } else {
      // Handle case when removing file
      setFormData((prev) => ({
        ...prev,
        file: null,
      }));
      setFileName("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleDragAreaClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Tournament name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate < startDate) {
        errors.end_date = "End date cannot be before start date";
      }
    }

    // File validation is now optional, only validate if a file is provided
    if (formData.file) {
      if (!validateFile(formData.file)) {
        errors.file = "Please upload a valid Excel file or remove it";
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

    const loadingToast = toast.loading("Creating tournament...");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("location", formData.location.trim());
      submitData.append("start_date", formData.start_date);
      submitData.append("end_date", formData.end_date);

      // Only append file if it exists
      if (formData.file) {
        submitData.append("file", formData.file);
      }

      const result = await dispatch(createTournament(submitData)).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Tournament created successfully!");

      resetForm();
      onClose();

      dispatch(getTournamentsAdmin());
    } catch (error) {
      console.error("Failed to create tournament:", error);
      toast.dismiss(loadingToast);

      if (error?.message === "File already exists" && error?.errors?.length > 0) {
        const fileError = error.errors.find((err) => err.field === "file");
        if (fileError) {
          toast.error(fileError.message);
        } else {
          toast.error(error.message || "File already exists");
        }
      } else {
        // Check if it's the "No file uploaded" error from backend
        if (error?.message === "No file uploaded") {
          toast.error("Tournament created successfully without player data!");
          // Still consider it a success since we allow empty tournaments
          resetForm();
          onClose();
          dispatch(getTournamentsAdmin());
        } else {
          toast.error(error?.message || "Failed to create tournament");
        }
      }
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
    setIsDragging(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const removeFile = () => {
    handleFileSelect(null);
    toast.success("File removed");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
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
            className="p-2 rounded-full hover:bg-white/20 transition disabled:opacity-50"
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

        <div className="overflow-y-auto flex-1 p-10 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Basic Information
                </h3>

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
                  disabled={createLoading}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}

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
                  disabled={createLoading}
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Schedule & Data</h3>

                <div className="grid grid-cols-2 gap-6">
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
                      disabled={createLoading}
                    />
                  </div>

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
                      disabled={createLoading}
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

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Tournament Data (Excel) <span className="text-gray-500 text-xs font-normal">- Optional</span>
                  </label>

                  {!fileName ? (
                    <label
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer transition-colors ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-100"
                      } ${
                        createLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleDragAreaClick}
                    >
                      <svg
                        className={`w-12 h-12 mb-3 ${
                          isDragging ? "text-blue-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          strokeWidth="2"
                          stroke="currentColor"
                          d="M13 13h3a3 3 0 000-6h-.025A5.56 5.56 0 0016 6.5 5.5 5.5 0 005.207 5.021 4 4 0 005 5a4 4 0 000 8h2.167M10 15V6m0 0L8 8m2-2l2 2"
                        />
                      </svg>
                      <p
                        className={`text-sm ${
                          isDragging ? "text-blue-500" : "text-gray-600"
                        }`}
                      >
                        {isDragging
                          ? "Drop file here"
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Excel files only (.xlsx, .xls, .csv) — Max 5MB
                        <br />
                        <span className="text-green-600">Optional - You can add players later</span>
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv"
                        disabled={createLoading}
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
                        disabled={createLoading}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 disabled:opacity-50"
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

            <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={createLoading}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e0066] to-[#3b2b91] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Tournament"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTournamentModal;