import { createTournament } from '@/redux/slice/tournamentSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function CreateTournamentModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { createLoading, createError } = useSelector((state) => state.tournamentsSlice)
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_date: '',
    end_date: '',
    file: null
  });

  const [fileName, setFileName] = useState('');
  const [formErrors, setFormErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
      
      if (!validTypes.includes('.' + fileExtension)) {
        toast.error('Please upload only Excel files (.xlsx, .xls, .csv)')
        setFormErrors(prev => ({
          ...prev,
          file: 'Please upload only Excel files (.xlsx, .xls, .csv)'
        }))
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        setFormErrors(prev => ({
          ...prev,
          file: 'File size should be less than 5MB'
        }))
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }));
      setFileName(file.name);
      
      // Clear file error
      if (formErrors.file) {
        setFormErrors(prev => ({
          ...prev,
          file: ''
        }))
      }
    }
  };

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) errors.name = 'Tournament name is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    if (!formData.start_date) errors.start_date = 'Start date is required'
    if (!formData.end_date) errors.end_date = 'End date is required'
    if (!formData.file) errors.file = 'Excel file is required'
    
    // Date validation
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (endDate < startDate) {
        errors.end_date = 'End date cannot be before start date'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }
    
    try {
      // Create FormData object to handle file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('location', formData.location.trim());
      submitData.append('start_date', formData.start_date);
      submitData.append('end_date', formData.end_date);
      
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      // Log FormData contents for debugging
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      const result = await dispatch(createTournament(submitData)).unwrap()
      
      toast.success('Tournament created successfully!')
      
      // Reset form and close modal
      resetForm()
      onClose()
      
    } catch (error) {
      console.error('Failed to create tournament:', error)
      toast.error(error || 'Failed to create tournament')
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      start_date: '',
      end_date: '',
      file: null
    });
    setFileName('');
    setFormErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose();
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setFileName('');
    setFormErrors(prev => ({
      ...prev,
      file: ''
    }))
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-700/50 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header with Close Button */}
        <div className="px-8 py-6 border-b border-zinc-700/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Tournament</h2>
            <p className="text-gray-400 text-sm mt-1">Fill in the tournament details to get started</p>
          </div>
          <button
            onClick={handleClose}
            disabled={createLoading}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Two Column Layout for Form Fields */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Basic Information</h3>
                
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-3">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={createLoading}
                    className={`w-full bg-zinc-800 border rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-zinc-600'
                    }`}
                    placeholder="Enter tournament name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-2">{formErrors.name}</p>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-3">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={createLoading}
                    className={`w-full bg-zinc-800 border rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      formErrors.location ? 'border-red-500' : 'border-zinc-600'
                    }`}
                    placeholder="Enter tournament location"
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm mt-2">{formErrors.location}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Date & File Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-zinc-700 pb-2">Schedule & Data</h3>
                
                {/* Date Fields in Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date Field */}
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-300 mb-3">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      disabled={createLoading}
                      className={`w-full bg-zinc-800 border rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                        formErrors.start_date ? 'border-red-500' : 'border-zinc-600'
                      }`}
                    />
                    {formErrors.start_date && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.start_date}</p>
                    )}
                  </div>

                  {/* End Date Field */}
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-300 mb-3">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      disabled={createLoading}
                      className={`w-full bg-zinc-800 border rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                        formErrors.end_date ? 'border-red-500' : 'border-zinc-600'
                      }`}
                    />
                    {formErrors.end_date && (
                      <p className="text-red-500 text-sm mt-2">{formErrors.end_date}</p>
                    )}
                  </div>
                </div>

                {/* File Upload Field - Excel Only */}
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-3">
                    Tournament Data (Excel) *
                  </label>
                  
                  {!fileName ? (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          formErrors.file 
                            ? 'border-red-500 bg-red-500/10' 
                            : 'border-zinc-600 bg-zinc-800 hover:bg-zinc-750'
                        } ${createLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-12 h-12 mb-4 text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-400 text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 text-center">Excel files only (.xlsx, .xls, .csv)<br />Max file size: 5MB</p>
                        </div>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={createLoading}
                          accept=".xlsx,.xls,.csv,.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.application/vnd.ms-excel"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-zinc-800 border border-zinc-600 rounded-xl px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <div>
                          <span className="text-white text-sm font-medium block">{fileName}</span>
                          <span className="text-gray-400 text-xs">Ready to upload</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        disabled={createLoading}
                        className="text-gray-400 hover:text-[#1e0066] transition-colors p-2 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                  {formErrors.file && (
                    <p className="text-red-500 text-sm mt-2">{formErrors.file}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-zinc-700/50">
              <button
                type="button"
                onClick={handleClose}
                disabled={createLoading}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="flex-1 bg-[#1e0066] text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
              >
                {createLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Tournament...
                  </>
                ) : (
                  'Create Tournament'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTournamentModal