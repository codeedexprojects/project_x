"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createClubs } from "@/redux/slice/clubSlice";
import toast from "react-hot-toast";

export default function AddClubModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [createLoading, setCreateLoading] = useState(false);

  const [clubData, setClubData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    mobileNumbers: [""],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData((prev) => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMobileChange = (index, value) => {
    const updatedNumbers = [...clubData.mobileNumbers];
    updatedNumbers[index] = value;
    setClubData((prev) => ({ ...prev, mobileNumbers: updatedNumbers }));
    
    if (formErrors[`mobile_${index}`]) {
      setFormErrors(prev => ({
        ...prev,
        [`mobile_${index}`]: ''
      }));
    }
  };

  const addMobileField = () => {
    setClubData((prev) => ({
      ...prev,
      mobileNumbers: [...prev.mobileNumbers, ""],
    }));
  };

  const removeMobileField = (index) => {
    if (clubData.mobileNumbers.length > 1) {
      const updatedNumbers = clubData.mobileNumbers.filter((_, i) => i !== index);
      setClubData((prev) => ({ ...prev, mobileNumbers: updatedNumbers }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only image files (JPEG, PNG, WebP)');
        setFormErrors(prev => ({
          ...prev,
          logo: 'Please upload only image files (JPEG, PNG, WebP)'
        }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        setFormErrors(prev => ({
          ...prev,
          logo: 'Image size should be less than 2MB'
        }));
        return;
      }

      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      if (formErrors.logo) {
        setFormErrors(prev => ({
          ...prev,
          logo: ''
        }));
      }
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
  };

  const validateForm = () => {
    const errors = {};
    
    if (!clubData.name.trim()) errors.name = 'Club name is required';
    if (!clubData.street.trim()) errors.street = 'Street is required';
    if (!clubData.city.trim()) errors.city = 'City is required';
    if (!clubData.state.trim()) errors.state = 'State is required';
    if (!clubData.zipCode.trim()) errors.zipCode = 'Zip code is required';
    if (!clubData.country.trim()) errors.country = 'Country is required';
    
    // Validate mobile numbers
    clubData.mobileNumbers.forEach((num, idx) => {
      if (!num.trim()) {
        errors[`mobile_${idx}`] = 'Mobile number is required';
      } 
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setCreateLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', clubData.name.trim());
      formData.append('address[street]', clubData.street.trim());
      formData.append('address[city]', clubData.city.trim());
      formData.append('address[state]', clubData.state.trim());
      formData.append('address[zipCode]', clubData.zipCode.trim());
      formData.append('country', clubData.country.trim());
      
      // Append mobile numbers
      clubData.mobileNumbers.forEach((num, index) => {
        formData.append(`mobileNumbers[${index}]`, num.trim());
      });
      
      // Append logo file
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(createClubs(formData)).unwrap();
      toast.success("Club created successfully!");
      resetForm();
      onClose();
    } catch (err) {
      console.error('Create club error:', err);
      toast.error(err?.message || "Failed to create club");
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setClubData({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      mobileNumbers: [""],
    });
    setLogoFile(null);
    setLogoPreview("");
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e0066] to-[#3b2b91] px-8 py-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Create New Club</h2>
            <p className="text-sm mt-1 opacity-80">
              Fill in the club details to get started
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
        <div className="overflow-y-auto flex-1 p-10 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-16">
              {/* LEFT COLUMN */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Basic Information</h3>

                {/* Club Logo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Club Logo </label>
                  {!logoPreview ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:bg-gray-100 transition">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeWidth="2" d="M13 13h3a3 3 0 000-6h-.025A5.56 5.56 0 0016 6.5 5.5 5.5 0 005.207 5.021 4 4 0 005 5a4 4 0 000 8h2.167M10 15V6m0 0L8 8m2-2l2 2"/>
                      </svg>
                      <p className="text-gray-600 text-sm">Click to upload logo</p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WebP — Max 2MB
                      </p>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleLogoChange} 
                      />
                    </label>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="h-40 rounded-lg object-contain border"
                        />
                        <button 
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Logo preview</p>
                    </div>
                  )}
                  {formErrors.logo && <p className="text-red-500 text-sm mt-1">{formErrors.logo}</p>}
                </div>

                {/* Club Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Club Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={clubData.name}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter club name"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Location & Contact</h3>

                {/* Street */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Street *</label>
                  <input
                    type="text"
                    name="street"
                    value={clubData.street}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 text-black ${
                      formErrors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter street address"
                  />
                  {formErrors.street && <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>}
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={clubData.city}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-4 py-3 text-black ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={clubData.state}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-4 py-3 text-black ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                  </div>
                </div>

                {/* Zip Code & Country */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={clubData.zipCode}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-4 py-3 text-black ${
                        formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Zip code"
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.zipCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={clubData.country}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-4 py-3 text-black ${
                        formErrors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Country"
                    />
                    {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                  </div>
                </div>

                {/* Mobile Numbers */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Numbers *</label>
                  {clubData.mobileNumbers.map((num, idx) => (
                    <div key={idx} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={num}
                        onChange={(e) => handleMobileChange(idx, e.target.value)}
                        className={`flex-1 border rounded-lg px-4 py-3 text-black ${
                          formErrors[`mobile_${idx}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter a mobile number"
                        maxLength="10"
                      />
                      {clubData.mobileNumbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMobileField(idx)}
                          className="px-3 text-red-500 hover:text-red-700 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {Object.keys(formErrors).map(key => {
                    if (key.startsWith('mobile_')) {
                      const index = key.split('_')[1];
                      return (
                        <p key={key} className="text-red-500 text-sm mt-1 mb-2">
                          {formErrors[key]}
                        </p>
                      );
                    }
                    return null;
                  })}
                  <button
                    type="button"
                    onClick={addMobileField}
                    className="text-[#1e0066] text-sm font-medium hover:opacity-80 transition"
                  >
                    + Add Another Number
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={createLoading}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e0066] to-[#3b2b91] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Create Club"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}