"use client";

export default function FilterBar({ onFilter }) {
  const filters = ["3d", "7d", "10d", "30d"];

  return (
    <div className="flex gap-3 mb-4">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilter(f)}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-blue-500 hover:text-white transition"
        >
          {f.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
