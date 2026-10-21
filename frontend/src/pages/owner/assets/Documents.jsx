import React, { useState, useEffect } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import { FileText, Film, ExternalLink, Trash2, ShieldCheck, Filter } from "lucide-react";
import API from "../../../services/api";

const defaultInitialDocs = [
  {
    _id: "doc-1",
    title: "will_and_testament.pdf",
    fileName: "will_and_testament.pdf",
    cid: "QmTeGRzjJFmy1QekpkyXgUNjrpu1Mo1LsF3rdW",
    category: "Legal",
    security: "2-of-3 SSS Shares",
  },
  {
    _id: "doc-2",
    title: "property_deed.pdf",
    fileName: "property_deed.pdf",
    cid: "QmataUNAiYinNfXACf3rdW9kPky1QekpkyXgUN",
    category: "General",
    security: "2-of-3 SSS Shares",
  },
  {
    _id: "doc-3",
    title: "WhatsApp Video 2026-08-23.mp4",
    fileName: "WhatsApp Video 2026-08-23.mp4",
    cid: "QmfFobsESNQpSWkA8k34qgukEquJsBbfieJFCS",
    category: "Media",
    security: "2-of-3 SSS Shares",
  },
];

export default function Documents() {
  const [documents, setDocuments] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem("shared_assets") || "[]");
      return Array.isArray(local) && local.length > 0 ? local : defaultInitialDocs;
    } catch {
      return defaultInitialDocs;
    }
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const syncDocumentsData = (dataList) => {
    if (!Array.isArray(dataList)) return [];
    return dataList
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const cat = (item.category || item.assetType || "").toLowerCase();
        const name = (item.fileName || item.originalFileName || item.title || item.name || "").toLowerCase();

        // Normalize category tags
        let normalizedCategory = item.category || item.assetType || "General";
        if (cat === "media" || name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".avi")) {
          normalizedCategory = "Media";
        } else if (cat === "legal") {
          normalizedCategory = "Legal";
        } else if (cat === "general" || cat === "document" || cat === "financial") {
          normalizedCategory = "General";
        }

        return {
          ...item,
          category: normalizedCategory,
        };
      });
  };

  const fetchDocuments = async () => {
    // Failsafe timeout to prevent any potential infinite spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    try {
      const [docRes, assetRes] = await Promise.all([
        API.get("/documents").catch(() => null),
        API.get("/assets").catch(() => null),
      ]);

      const docList = docRes?.data?.data || docRes?.data || [];
      const assetList = Array.isArray(assetRes?.data) ? assetRes.data : assetRes?.data?.assets || [];
      const localAssets = JSON.parse(localStorage.getItem("shared_assets") || "[]");

      const combined = [
        ...(Array.isArray(docList) ? docList : []),
        ...(Array.isArray(assetList) ? assetList : []),
        ...(Array.isArray(localAssets) ? localAssets : []),
      ];
      const seen = new Set();
      const unique = [];

      combined.forEach((item) => {
        if (!item) return;
        const key = item._id || item.id || item.cid || item.ipfsCid;
        if (key && !seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      });

      if (unique.length > 0) {
        const synced = syncDocumentsData(unique);
        setDocuments(synced);
        localStorage.setItem("shared_assets", JSON.stringify(synced));
      } else {
        setDocuments(syncDocumentsData(defaultInitialDocs));
        localStorage.setItem("shared_assets", JSON.stringify(defaultInitialDocs));
      }
    } catch (err) {
      console.warn("Using synchronized local asset repository:", err);
      const localAssets = JSON.parse(localStorage.getItem("shared_assets") || "[]");
      if (localAssets.length > 0) {
        setDocuments(syncDocumentsData(localAssets));
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Listen for cross-page and cross-tab real-time updates
    const handleSync = () => {
      fetchDocuments();
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    const updatedDocs = documents.filter((doc) => (doc._id || doc.id) !== id && doc.cid !== id);
    setDocuments(updatedDocs);

    const allLocalAssets = JSON.parse(localStorage.getItem("shared_assets") || "[]");
    const updatedAssets = allLocalAssets.filter((item) => (item._id || item.id) !== id && item.cid !== id);
    localStorage.setItem("shared_assets", JSON.stringify(updatedAssets));

    // Try deleting via both endpoints
    await Promise.all([
      API.delete(`/documents/${id}`).catch(() => {}),
      API.delete(`/assets/${id}`).catch(() => {}),
    ]);

    // Broadcast change across pages
    window.dispatchEvent(new CustomEvent("dims-vault-updated"));
    try {
      const channel = new BroadcastChannel("dims_vault_sync");
      channel.postMessage({ type: "VAULT_UPDATED", timestamp: Date.now() });
      channel.close();
    } catch (e) {}
  };

  // Interactive filter by All / Legal / General / Media
  const filteredDocs =
    selectedCategory === "All"
      ? documents
      : documents.filter(
          (doc) => (doc.category || "General").toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Encrypted Documents & Media</h1>
            <p className="text-slate-500 text-sm mt-1">
              Legal documents, deeds, records, and media stored securely on IPFS decentralized nodes.
            </p>
          </div>

          {/* Filter Controls: All, Legal, General, Media */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
            <Filter size={16} className="text-slate-400 ml-2" />
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter:</span>
            {["All", "Legal", "General", "Media"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 font-medium">Loading items...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-medium">
            No assets found matching the "{selectedCategory}" category filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => {
              const id = doc._id || doc.id || doc.cid;
              const category = doc.category || "General";
              const cid = doc.cid || doc.ipfsCid || doc.ipfsHash;
              const title = doc.title || doc.fileName || doc.originalFileName || doc.name || "Asset Record";
              const isMedia = category.toLowerCase() === "media";

              return (
                <div
                  key={id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          category.toLowerCase() === "legal"
                            ? "bg-indigo-50 text-indigo-600"
                            : isMedia
                            ? "bg-purple-50 text-purple-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {category}
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold flex items-center gap-1">
                        <ShieldCheck size={14} /> IPFS Pinned
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isMedia ? (
                        <Film className="text-purple-600 w-8 h-8 shrink-0" />
                      ) : (
                        <FileText className="text-indigo-600 w-8 h-8 shrink-0" />
                      )}
                      <h3 className="text-lg font-extrabold text-slate-900 truncate">
                        {title}
                      </h3>
                    </div>

                    <div className="border-t border-slate-100 pt-3 text-xs space-y-1 text-slate-500 font-mono">
                      <p>
                        <span className="font-semibold text-slate-700 font-sans">File:</span>{" "}
                        {doc.fileName || doc.originalFileName || title}
                      </p>
                      {cid && (
                        <p className="truncate">
                          <span className="font-semibold text-slate-700 font-sans">CID:</span> {cid}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold text-slate-700 font-sans">Security:</span>{" "}
                        {doc.security || "2-of-3 SSS Shares"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    {cid ? (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        View IPFS Node <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">No IPFS Link</span>
                    )}

                    <button
                      onClick={() => handleDelete(id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
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