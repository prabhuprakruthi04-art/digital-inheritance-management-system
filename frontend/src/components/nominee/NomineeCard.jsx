import {
  Mail,
  Phone,
  Users,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

export default function NomineeCard({
  nominee,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-semibold">
            {nominee.name}
          </h2>

          <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            {nominee.relationship}
          </span>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => onEdit(nominee)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(nominee._id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

      <div className="mt-5 space-y-3">

        <div className="flex items-center gap-2 text-gray-600">
          <Mail size={16} />
          {nominee.email}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Phone size={16} />
          {nominee.phone}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Users size={16} />
          {nominee.relationship}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          {nominee.address}
        </div>

      </div>

    </div>
  );
}