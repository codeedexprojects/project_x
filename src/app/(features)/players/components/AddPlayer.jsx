import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CreatePlayerModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    qid: '',
    club: '',
    country: '',
    dateOfBirth: '',
    gender: '',
    mobile: '',
    level: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      qid: '',
      club: '',
      country: '',
      dateOfBirth: '',
      gender: '',
      mobile: '',
      level: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-zinc-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-2xl font-bold text-gray-100">Create Player Details</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Enter player name"
              />
            </div>

            {/* QID */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                QID
              </label>
              <input
                type="text"
                name="qid"
                value={formData.qid}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Enter QID"
              />
            </div>

            {/* Club */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Club
              </label>
              <select
                name="club"
                value={formData.club}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select club</option>
                <option value="club1">Club 1</option>
                <option value="club2">Club 2</option>
                <option value="club3">Club 3</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Enter country"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Enter mobile number"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full bg-zinc-700/50 text-gray-200 px-4 py-3 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-gray-200 font-semibold rounded-lg transition-all duration-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}