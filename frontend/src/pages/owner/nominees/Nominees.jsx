import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import AppLayout from "../../../components/layout/AppLayout";
import NomineeCard from "../../../components/nominee/NomineeCard";

import {
  getNominees,
  deleteNominee,
} from "../../../services/nomineeService";

export default function Nominees() {
  const navigate = useNavigate();

  const [nominees, setNominees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNominees();
  }, []);

  async function loadNominees() {
    try {
      setLoading(true);
      const res = await getNominees();
      // Safely extract array from direct arrays or API wrapper objects
      const list = res?.data?.data || res?.data || res || [];
      setNominees(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load nominees:", err);
      setNominees([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete nominee?")) return;
    try {
      await deleteNominee(id);
      setNominees((prev) =>
        Array.isArray(prev) ? prev.filter((n) => (n._id || n.id) !== id) : []
      );
    } catch (err) {
      console.error("Failed to delete nominee:", err);
      alert("Failed to delete nominee.");
    }
  }

  const filteredNominees = useMemo(() => {
    const list = Array.isArray(nominees) ? nominees : [];
    return list.filter((n) => {
      const name = n?.name || n?.fullName || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, nominees]);

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Nominees</h1>
          <p className="text-gray-500">Manage your nominees</p>
        </div>

        <button
          onClick={() => navigate("/owner/nominees/add")}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Nominee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search nominee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading nominees...</div>
      ) : filteredNominees.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
          No nominees found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNominees.map((nominee) => {
            const id = nominee._id || nominee.id;
            return (
              <NomineeCard
                key={id}
                nominee={nominee}
                onDelete={handleDelete}
                onEdit={(n) =>
                  navigate(`/owner/nominees/edit/${n._id || n.id}`)
                }
              />
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}