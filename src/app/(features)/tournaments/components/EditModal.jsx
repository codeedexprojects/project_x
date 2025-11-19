import { createTournament } from '@/redux/slice/tournamentSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function EditModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { createLoading, createError } = useSelector((state) => state.tournamentsSlice)
  
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
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

 

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) errors.name = 'Tournament name is required'
    if (!formData.start_date) errors.start_date = 'Start date is required'
    if (!formData.end_date) errors.end_date = 'End date is required'
    
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
      submitData.append('start_date', formData.start_date);
      submitData.append('end_date', formData.end_date);
      
    
      // Log FormData contents for debugging
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      const result = await dispatch(createTournament(submitData)).unwrap()
      
      toast.success('Tournament Edited successfully!')
      
      // Reset form and close modal
      resetForm()
      onClose()
      
    } catch (error) {
      console.error('Failed to edit tournament:', error)
      toast.error(error || 'Failed to edit tournament')
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
    });
    setFileName('');
    setFormErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose();
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-700/50 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header with Close Button */}
        <div className="px-8 py-6 border-b border-zinc-700/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Tournament</h2>
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
                    <p className="text-[#1e0066] text-sm mt-2">{formErrors.name}</p>
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
                      <p className="text-[#1e0066] text-sm mt-2">{formErrors.start_date}</p>
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
                      <p className="text-[#1e0066] text-sm mt-2">{formErrors.end_date}</p>
                    )}
                  </div>
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
                className="flex-1 bg-[#1e0066] hover:bg-[#1e0066] text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
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

export default EditModal