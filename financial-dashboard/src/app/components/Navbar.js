"use client";

export default function Navbar() {
  const menuItems = [
    "CRM",
    "Utilities",
    "Insurance",
    "Assets",
    "Mutual",
    "Research",
    "Transact Online",
    "Goal GPS",
    "Financial Planning",
    "Wealth Report",
    "Other",
  ];

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Financial Dashboard</h1>
      <ul className="hidden md:flex gap-6 text-sm">
        {menuItems.map((item, idx) => (
          <li key={idx} className="hover:text-yellow-300 cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
      <button className="bg-yellow-400 text-black px-3 py-1 rounded-md">
        Logout
      </button>
    </nav>
  );
}
