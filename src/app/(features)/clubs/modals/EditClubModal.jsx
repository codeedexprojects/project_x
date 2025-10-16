"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { editClubs } from "@/redux/slice/clubSlice";


export default function EditClubModal({ isOpen, onClose, existingClub }) {
  const dispatch = useDispatch();

  const [clubData, setClubData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    mobileNumbers: [""],
  });

  useEffect(() => {
    if (existingClub) {
      setClubData({
        name: existingClub.name || "",
        street: existingClub.address?.street || "",
        city: existingClub.address?.city || "",
        state: existingClub.address?.state || "",
        zipCode: existingClub.address?.zipCode || "",
        country: existingClub.address?.country || "India",
        mobileNumbers: existingClub.mobileNumbers || [""],
      });
    }
  }, [existingClub]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMobileChange = (index, value) => {
    const updatedNumbers = [...clubData.mobileNumbers];
    updatedNumbers[index] = value;
    setClubData((prev) => ({ ...prev, mobileNumbers: updatedNumbers }));
  };

  const addMobileField = () => {
    setClubData((prev) => ({
      ...prev,
      mobileNumbers: [...prev.mobileNumbers, ""],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: clubData.name,
      address: {
        street: clubData.street,
        city: clubData.city,
        state: clubData.state,
        zipCode: clubData.zipCode,
        country: clubData.country,
      },
      mobileNumbers: clubData.mobileNumbers,
    };

    dispatch(editClubs({ id: existingClub._id, clubData: payload }))
      .unwrap()
      .then(() => {
        alert("Club updated successfully!");
        onClose();
      })
      .catch((err) => alert(err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 rounded-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Club</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same form fields as before */}
          <div>
            <label className="block text-sm font-medium">Club Name</label>
            <input
              type="text"
              name="name"
              value={clubData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              type="text"
              name="street"
              value={clubData.street}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={clubData.city}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <input
                type="text"
                name="state"
                value={clubData.state}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={clubData.zipCode}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={clubData.country}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mobile Numbers</label>
            {clubData.mobileNumbers.map((num, idx) => (
              <input
                key={idx}
                type="text"
                value={num}
                onChange={(e) => handleMobileChange(idx, e.target.value)}
                required
                className="w-full border rounded px-3 py-2 mt-1 mb-1"
              />
            ))}
            <button
              type="button"
              onClick={addMobileField}
              className="text-blue-500 text-sm mt-1"
            >
              + Add Another Number
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
