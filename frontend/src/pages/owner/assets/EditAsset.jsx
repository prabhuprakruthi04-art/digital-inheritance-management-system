import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import AssetForm from "../../../components/asset/AssetForm";

import {
  getAssetById,
  updateAsset,
} from "../../../services/assetService";

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchAsset();
  }, []);

  async function fetchAsset() {
    try {
      const data = await getAssetById(id);
      setAsset(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load asset.");
    } finally {
      setPageLoading(false);
    }
  }

  async function handleSubmit(formData, file) {
    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("assetType", formData.assetType);
      payload.append("description", formData.description);
      payload.append("sensitiveData", formData.sensitiveData);
      payload.append("nominee", formData.nominee);
      payload.append("encrypt", formData.encrypt);

      if (file) {
        payload.append("file", file);
      }

      await updateAsset(id, payload);

      alert("Asset updated successfully.");

      navigate("/owner/assets");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Unable to update asset."
      );
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <AppLayout>
        <div className="text-center py-10">
          Loading Asset...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Edit Digital Asset
        </h1>

        <AssetForm
          initialData={asset}
          loading={loading}
          onSubmit={handleSubmit}
        />

      </div>

    </AppLayout>
  );
}