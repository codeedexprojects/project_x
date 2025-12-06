import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { editTournament } from "@/redux/slice/tournamentSlice";

function EditModal({ isOpen, onClose, tournament }) {
  const dispatch = useDispatch();
  const { updateLoading, updateError } = useSelector(
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

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || "",
        location: tournament.location || "",
        start_date: tournament.start_date
          ? new Date(tournament.start_date).toISOString().split("T")[0]
          : "",
        end_date: tournament.end_date
          ? new Date(tournament.end_date).toISOString().split("T")[0]
          : "",
        file: null,
      });
    }
  }, [tournament]);

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
    if (file && validateFile(file)) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
      setFileName(file.name);

      if (formErrors.file) {
        setFormErrors((prev) => ({
          ...prev,
          file: "",
        }));
      }

      toast.success("File selected successfully!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    const loadingToast = toast.loading("Updating tournament...");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("location", formData.location.trim());
      submitData.append("start_date", formData.start_date);
      submitData.append("end_date", formData.end_date);

      // In your EditModal.jsx handleSubmit function, change:
      if (!formData.file) {
        // Send as JSON if no file
        const submitData = {
          name: formData.name.trim(),
          location: formData.location.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
        };

        const result = await dispatch(
          editTournament({
            id: tournament._id,
            data: submitData, // Send as JSON
          })
        ).unwrap();
      } else {
        // Send as FormData if file exists
        const submitData = new FormData();
        submitData.append("name", formData.name.trim());
        submitData.append("location", formData.location.trim());
        submitData.append("start_date", formData.start_date);
        submitData.append("end_date", formData.end_date);
        submitData.append("file", formData.file);

        const result = await dispatch(
          editTournament({
            id: tournament._id,
            data: submitData,
          })
        ).unwrap();
      }

      // Add debug logging
      console.log("Submitting tournament update:", {
        id: tournament._id,
        formData: Object.fromEntries(submitData),
      });

      const result = await dispatch(
        editTournament({
          id: tournament._id,
          data: submitData,
        })
      ).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Tournament updated successfully!");

      // Only close modal on success
      resetForm();
      onClose();
    } catch (error) {
      console.error("Update Tournament Error Details:", error);
      toast.dismiss(loadingToast);

      // IMPORTANT: Do NOT close modal on error
      // The modal should stay open so user can fix errors

      // Display detailed error information
      if (error.status === 404) {
        toast.error(
          <div>
            <p className="font-bold">API Endpoint Not Found (404)</p>
            <p className="text-sm">URL: {error.url || "Unknown"}</p>
            <p className="text-sm">
              Please check the backend route configuration
            </p>
          </div>,
          { duration: 5000 }
        );
      } else if (error.message) {
        // Show HTML errors properly
        if (
          typeof error.message === "string" &&
          error.message.includes("<!DOCTYPE html>")
        ) {
          toast.error(
            "Server returned HTML error page. Please check backend logs."
          );
        } else {
          toast.error(error.message || "Failed to update tournament");
        }
      } else if (error.data) {
        toast.error(
          typeof error.data === "string"
            ? error.data
            : JSON.stringify(error.data)
        );
      } else {
        toast.error("An unexpected error occurred");
      }

      // Log for debugging
      console.error("Full error object:", error);
    }
  };

  const resetForm = () => {
    if (tournament) {
      setFormData({
        name: tournament.name || "",
        location: tournament.location || "",
        start_date: tournament.start_date
          ? new Date(tournament.start_date).toISOString().split("T")[0]
          : "",
        end_date: tournament.end_date
          ? new Date(tournament.end_date).toISOString().split("T")[0]
          : "",
        file: null,
      });
    }
    setFileName("");
    setFormErrors({});
    setIsDragging(false);
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
    toast.success("File removed");
  };

  if (!isOpen || !tournament) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e0066] to-[#3b2b91] px-8 py-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Edit Tournament</h2>
            <p className="text-sm mt-1 opacity-80">Update tournament details</p>
          </div>

          <button
            onClick={handleClose}
            disabled={updateLoading}
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
                  disabled={updateLoading}
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
                  disabled={updateLoading}
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
                      disabled={updateLoading}
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
                      disabled={updateLoading}
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
                    Update Tournament Data (Excel)
                    <span className="text-gray-500 text-sm font-normal ml-1">
                      - Optional
                    </span>
                  </label>

                  {!fileName ? (
                    <label
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer transition-colors ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-100"
                      } ${
                        updateLoading ? "opacity-50 cursor-not-allowed" : ""
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
                      </p>
                      <p className="text-xs text-blue-500 mt-2">
                        Leave empty to keep existing data
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv"
                        disabled={updateLoading}
                      />
                    </label>
                  ) : (
                    <div className="flex justify-between items-center bg-gray-100 border border-gray-300 px-4 py-3 rounded-xl">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-medium truncate">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          New file selected
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        disabled={updateLoading}
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
                disabled={updateLoading}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e0066] to-[#3b2b91] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updateLoading ? (
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
                    Updating...
                  </>
                ) : (
                  "Update Tournament"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
