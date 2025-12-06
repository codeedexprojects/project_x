"use client";
import { createUmpire } from '@/redux/slice/umpireSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function CreateUmpireModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { createLoading, createError } = useSelector((state) => state.umpires)
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    passport: '',
    gender: '',
    level: '',
    mobileNumber: '',
    email: '',
    QID: ''
  });

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
    
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.country.trim()) errors.country = 'Country is required'
    if (!formData.passport.trim()) errors.passport = 'Passport number is required'
    if (!formData.gender) errors.gender = 'Gender is required'
    if (!formData.level) errors.level = 'Level is required'
    if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.QID) errors.QID = 'QID is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
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
      const result = await dispatch(createUmpire(formData)).unwrap()
      
      toast.success('Umpire created successfully!')
      
      // Reset form and close modal
      resetForm()
      onClose()
      
    } catch (error) {
      console.error('Failed to create umpire:', error)
      toast.error(error?.message || 'Failed to create umpire')
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      passport: '',
      gender: '',
      level: '',
      mobileNumber: '',
      email: '',
      QID: ''
    });
    setFormErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e0066] to-[#3b2b91] px-8 py-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Create New Umpire</h2>
            <p className="text-sm mt-1 opacity-80">
              Fill in the umpire details to get started
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={createLoading}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <svg className="w-7 h-7" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-8 bg-white">
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-8">

              {/* LEFT COLUMN */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter country"
                  />
                  {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                </div>

                {/* Passport */}
                <div>
                  <label className="block text-sm font-medium mb-2">Passport Number *</label>
                  <input
                    name="passport"
                    value={formData.passport}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.passport ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter passport number"
                  />
                  {formErrors.passport && <p className="text-red-500 text-sm mt-1">{formErrors.passport}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Contact & QID</h3>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                  <input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter mobile number"
                  />
                  {formErrors.mobileNumber && <p className="text-red-500 text-sm mt-1">{formErrors.mobileNumber}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                {/* QID */}
                <div>
                  <label className="block text-sm font-medium mb-2">QID *</label>
                  <input
                    type="number"
                    name="QID"
                    value={formData.QID}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.QID ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter QID"
                  />
                  {formErrors.QID && <p className="text-red-500 text-sm mt-1">{formErrors.QID}</p>}
                </div>

                 <div>
                  <label className="block text-sm font-medium mb-2">Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.level ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="umpire">Umpire</option>
                    <option value="national_umpire">National Umpire</option>
                    <option value="international_umpire">International Umpire</option>
                  </select>
                  {formErrors.level && <p className="text-red-500 text-sm mt-1">{formErrors.level}</p>}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={createLoading}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e0066] to-[#3b2b91] text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  'Create Umpire'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUmpireModal;