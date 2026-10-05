import React from "react";

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-indigo-600",
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className={`${color} text-white p-4 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}