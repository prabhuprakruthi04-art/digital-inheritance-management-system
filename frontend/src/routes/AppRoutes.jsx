import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Centralized API Client Service
import API from "../services/api";

import Login from "../pages/shared/Login";
import Register from "../pages/shared/Register";

import OwnerDashboard from "../pages/owner/dashboard/Dashboard";
import NomineeDashboard from "../pages/nominee/Dashboard";

import Assets from "../pages/owner/assets/Assets";
import AddAsset from "../pages/owner/assets/AddAsset";
import EditAsset from "../pages/owner/assets/EditAsset";

import Nominees from "../pages/owner/nominees/Nominees";
import AddNominee from "../pages/owner/nominees/AddNominee";
import EditNominee from "../pages/owner/nominees/EditNominee";

import HeartbeatDashboard from "../pages/owner/heartbeat/HeartbeatDashboard";
import AliveVerification from "../pages/owner/heartbeat/AliveVerification";

// Shared Pages located in src/pages/
import FaceEnrollment from "../pages/FaceEnrollment";
import FaceVerification from "../pages/FaceVerification";

import Documents from "../pages/Documents";
import Blockchain from "../pages/Blockchain";

import NomineeClaims from "../pages/Claims";
import Claims from "../pages/Claims";
import ClaimDetails from "../pages/ClaimDetails";

import Notifications from "../pages/Notifications";

import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRoutes() {
  // Test backend API connectivity on initial load
  useEffect(() => {
    API.get("/health")
      .then((res) => console.log("Backend API Connected:", res.data))
      .catch((err) =>
        console.warn(
          "Backend Connection Notice:",
          err.message || "Unable to reach health endpoint"
        )
      );
  }, []);

  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* =========================
          OWNER ROUTES (UNTOUCHED)
      ========================== */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute role="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/assets"
        element={
          <ProtectedRoute role="owner">
            <Assets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/assets/add"
        element={
          <ProtectedRoute role="owner">
            <AddAsset />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/assets/edit/:id"
        element={
          <ProtectedRoute role="owner">
            <EditAsset />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/documents"
        element={
          <ProtectedRoute role="owner">
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/nominees"
        element={
          <ProtectedRoute role="owner">
            <Nominees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/nominees/add"
        element={
          <ProtectedRoute role="owner">
            <AddNominee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/nominees/edit/:id"
        element={
          <ProtectedRoute role="owner">
            <EditNominee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/heartbeat"
        element={
          <ProtectedRoute role="owner">
            <HeartbeatDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/alive-verification"
        element={
          <ProtectedRoute role="owner">
            <AliveVerification />
          </ProtectedRoute>
        }
      />

      {/* =========================
          NOMINEE ROUTES
      ========================== */}
      <Route
        path="/nominee"
        element={
          <ProtectedRoute role="nominee">
            <NomineeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nominee/claims"
        element={
          <ProtectedRoute role="nominee">
            <NomineeClaims />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nominee/vault"
        element={
          <ProtectedRoute role="nominee">
            <NomineeClaims />
          </ProtectedRoute>
        }
      />

      {/* =========================
          FACE VERIFICATION
      ========================== */}
      <Route
        path="/face-enrollment"
        element={
          <ProtectedRoute>
            <FaceEnrollment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/face-verification"
        element={
          <ProtectedRoute>
            <FaceVerification />
          </ProtectedRoute>
        }
      />

      {/* =========================
          DOCUMENTS & IPFS
      ========================== */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets/:assetId/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      {/* =========================
          BLOCKCHAIN & CLAIMS
      ========================== */}
      <Route
        path="/blockchain"
        element={
          <ProtectedRoute>
            <Blockchain />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims"
        element={
          <ProtectedRoute>
            <Claims />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims/:claimId"
        element={
          <ProtectedRoute>
            <ClaimDetails />
          </ProtectedRoute>
        }
      />

      {/* =========================
          NOTIFICATIONS
      ========================== */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* =========================
          FALLBACK ROUTE
      ========================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}