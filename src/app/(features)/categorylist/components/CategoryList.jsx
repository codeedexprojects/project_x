"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/redux/slice/categorySlice";
import { Users, User, Loader2, AlertCircle } from "lucide-react";

export default function CategoryListing() {
  const dispatch = useDispatch();
  const { category, loading, error } = useSelector((state) => state.category);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const filteredCategories =
    category && category.length > 0
      ? filter === "all"
        ? category
        : category.filter((cat) => cat.type === filter)
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Error fetching data</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {!loading && !error && category && category.length > 0 && (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Tournament Categories
              </h1>
              <p className="text-gray-600">Total: {category.length} categories</p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                All ({category.length})
              </button>
              <button
                onClick={() => setFilter("singles")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  filter === "singles"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Singles ({category.filter((c) => c.type === "singles").length})
              </button>
              <button
                onClick={() => setFilter("doubles")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  filter === "doubles"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Doubles ({category.filter((c) => c.type === "doubles").length})
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-300 p-6 hover:bg-white/15"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          cat.type === "singles"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {cat.type === "singles" ? (
                          <User className="w-6 h-6" />
                        ) : (
                          <Users className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {cat.name}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                            cat.type === "singles"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    {cat.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-white text-sm mb-4">{cat.description}</p>

                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                    Created: {new Date(cat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No categories found for this filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
