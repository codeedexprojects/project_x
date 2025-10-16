"use client";
import React from "react";
import { X, Trash2, Loader2 } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, tournament, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div className="bg-zinc-900 border border-zinc-700 text-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
    {/* Header */}
    <div className="flex justify-between items-center border-b border-zinc-700 pb-3">
      <h2 className="text-lg font-semibold">Confirm Deletion</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition">
        <X size={20} />
      </button>
    </div>

    {/* Body */}
    <div className="mt-5 text-center">
      <div className="mx-auto bg-red-500/10 text-red-400 rounded-full w-14 h-14 flex items-center justify-center mb-4">
        <Trash2 size={28} />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Delete <span className="text-red-400">{tournament?.name}</span>?
      </h3>
      <p className="text-gray-400 text-sm">
        Are you sure you want to permanently delete this tournament? This action cannot be undone.
      </p>
    </div>

    {/* Footer */}
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={onClose}
        disabled={isDeleting}
        className="px-4 py-2 rounded-lg border border-zinc-600 text-gray-300 hover:bg-zinc-800 transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isDeleting}
        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition flex items-center gap-2"
      >
        {isDeleting ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            Delete
          </>
        )}
      </button>
    </div>
  </div>
</div>

  );
};

export default DeleteModal;
