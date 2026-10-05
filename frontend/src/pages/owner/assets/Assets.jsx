import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../../components/layout/AppLayout";
import { getAssets, deleteAsset } from "../../../services/assetService";

export default function Assets() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssetList = async () => {
    try {
      setLoading(true);
      const res = await getAssets();
      const list = res?.data || res || [];
      const apiAssets = Array.isArray(list) ? list : [];

      if (apiAssets.length > 0) {
        setAssets(apiAssets);
        localStorage.setItem("shared_assets", JSON.stringify(apiAssets));
      } else {
        // Local fallback sync
        const localData = JSON.parse(localStorage.getItem("shared_assets") || "[]");
        setAssets(localData);
      }
    } catch (err) {
      console.warn("API offline, loading local assets repo:", err);
      const localData = JSON.parse(localStorage.getItem("shared_assets") || "[]");
      setAssets(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetList();

    const handleSync = () => {
      fetchAssetList();
    };

    window.addEventListener("dims-vault-updated", handleSync);
    let channel;
    try {
      channel = new BroadcastChannel("dims_vault_sync");
      channel.onmessage = handleSync;
    } catch (e) {}

    return () => {
      window.removeEventListener("dims-vault-updated", handleSync);
      if (channel) channel.close();
    };
  }, []);

  // Sync category changes between Assets and Documents
  const handleCategoryChange = (id, newCategory) => {
    const updated = assets.map((item) =>
      (item._id || item.id) === id ? { ...item, category: newCategory, assetType: newCategory } : item
    );
    setAssets(updated);
    localStorage.setItem("shared_assets", JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("dims-vault-updated"));
    try {
      const channel = new BroadcastChannel("dims_vault_sync");
      channel.postMessage({ type: "VAULT_UPDATED" });
      channel.close();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset(id);
    } catch (err) {
      console.warn("Delete request offline, removing locally:", err);
    } finally {
      const updated = assets.filter((item) => item._id !== id && item.id !== id);
      setAssets(updated);
      localStorage.setItem("shared_assets", JSON.stringify(updated));

      // Broadcast update across pages
      window.dispatchEvent(new CustomEvent("dims-vault-updated"));
      try {
        const channel = new BroadcastChannel("dims_vault_sync");
        channel.postMessage({ type: "VAULT_UPDATED" });
        channel.close();
      } catch (e) {}
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Digital Assets</h1>
            <p className="text-sm text-gray-500 mt-1">
              Encrypted digital files synced across IPFS storage nodes.
            </p>
          </div>
          <button
            onClick={() => navigate("/owner/assets/add")}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            + Add New Asset
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Loading encrypted assets...
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border shadow-sm space-y-4">
            <p className="text-gray-500">No digital assets found in your vault.</p>
            <button
              onClick={() => navigate("/owner/assets/add")}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Add Your First Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const id = asset._id || asset.id;
              const title = asset.name || asset.title || asset.originalFileName || "Untitled Asset";
              const currentCategory = asset.category || asset.assetType || "General";
              const cid = asset.ipfsCid || asset.cid;

              return (
                <div
                  key={id}
                  className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      {/* Interactive Category Selector Switcher */}
                      <div className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                        <select
                          value={currentCategory}
                          onChange={(e) => handleCategoryChange(id, e.target.value)}
                          className="bg-transparent text-xs font-semibold text-indigo-700 border-none outline-none cursor-pointer"
                        >
                          <option value="General">General</option>
                          <option value="Legal">Legal</option>
                          <option value="Media">Media</option>
                        </select>
                      </div>

                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          asset.status === "synced" || cid
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {asset.status === "synced" || cid ? "IPFS Pinned" : "Local Sync"}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg leading-snug truncate">
                      {title}
                    </h3>

                    {asset.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {asset.description}
                      </p>
                    )}

                    <div className="pt-2 text-xs space-y-1 text-gray-500 border-t">
                      <p className="truncate">
                        <strong className="text-gray-700">File:</strong>{" "}
                        {asset.originalFileName || asset.fileName || title}
                      </p>
                      {cid && (
                        <p className="truncate font-mono">
                          <strong className="text-gray-700">CID:</strong> {cid}
                        </p>
                      )}
                      <p>
                        <strong className="text-gray-700">Security:</strong> 2-of-3 SSS Shares
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t flex justify-between items-center">
                    {cid ? (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        View IPFS Node
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No IPFS Link</span>
                    )}

                    <button
                      onClick={() => handleDelete(id)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}