import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/jwtAuthContext";
import { ArrowLeft, Camera, LogOut, Mail, User } from "lucide-react";
import axios from "axios";

type EditState = {
  fullName: string;
  phone: string;
  hostel: string;
  year: string;
};

const HOSTEL_OPTIONS = ["BH-1", "BH-2", "BH-3", "PG", "Other"];
const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function Profile() {
  const navigate = useNavigate();
  const { user, loading, logout } = useJWTAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState<EditState>({
    fullName: "",
    phone: "",
    hostel: "",
    year: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      setEdit({
        fullName: user.fullName || "",
        phone: user.phone || "",
        hostel: user.hostel || "",
        year: user.year || "",
      });
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      edit.fullName !== (user.fullName || "") ||
      edit.phone !== (user.phone || "") ||
      edit.hostel !== (user.hostel || "") ||
      edit.year !== (user.year || "")
    );
  }, [edit, user]);

  const handleSave = async () => {
    if (!user || !hasChanges || saving) return;
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const token = localStorage.getItem("jwt_token");
      await axios.post(
        `${import.meta.env.VITE_URL}/auth/complete-profile`,
        {
          hostel: edit.hostel || null,
          year: edit.year || null,
          phone: edit.phone || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      // Optionally: refetch /auth/me via a manual call if you want context updated immediately
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update profile";
      setError(msg);
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSuccess(null);
      }, 2500);
    }
  };

  if (loading) {
    // Subtle skeleton while profile is loading
    const skeletonAvatar = (
      <div className="w-24 h-24 md:w-28 md:h-28 mx-auto md:mx-0 rounded-full bg-gray-200 animate-pulse" />
    );

    if (isMobile) {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 h-14">
              <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
              <div className="w-16 h-4 rounded bg-gray-200 animate-pulse" />
              <div className="w-10 h-4 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="px-4 pt-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center text-center space-y-3">
              {skeletonAvatar}
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-40 h-3 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
              <div className="w-10 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              {skeletonAvatar}
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
                <div className="w-40 h-3 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
              </div>
              <div className="w-full h-9 bg-gray-200 rounded-lg animate-pulse mt-4" />
            </div>

            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-3">
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            You’re not logged in
          </h2>
          <p className="text-gray-600 mb-4">
            Please sign in to view and update your profile.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const profileAvatar = (
    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto md:mx-0">
      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-semibold overflow-hidden">
        {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
      </div>
      {isEditing && (
        <button
          type="button"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-md"
        >
          <Camera className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const readOnlyField = (label: string, value?: string | null) => (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">
        {value && value.trim() !== "" ? value : "Not added"}
      </span>
    </div>
  );

  const editableField = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    type: "text" | "tel" = "text",
    placeholder?: string
  ) => (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const mobileView = (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg active:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Profile</h1>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-sm font-medium text-blue-600"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center text-center space-y-3">
          {profileAvatar}
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {user.fullName}
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-1">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Info / Edit Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          {!isEditing ? (
            <>
              {readOnlyField("Full Name", user.fullName)}
              {readOnlyField("Phone", user.phone)}
              {readOnlyField("Hostel", user.hostel)}
              {readOnlyField("Year", user.year)}
            </>
          ) : (
            <div className="space-y-4">
              {editableField("Full Name", edit.fullName, (v) => setEdit((p) => ({ ...p, fullName: v })), "text", "Your full name")}
              {editableField("Phone Number", edit.phone, (v) => setEdit((p) => ({ ...p, phone: v })), "tel", "Optional contact number")}

              <div className="space-y-1">
                <label className="text-sm text-gray-600">Hostel</label>
                <select
                  value={edit.hostel}
                  onChange={(e) => setEdit((p) => ({ ...p, hostel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select hostel</option>
                  {HOSTEL_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-600">Year</label>
                <select
                  value={edit.year}
                  onChange={(e) => setEdit((p) => ({ ...p, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/listing")}
            className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-medium shadow-sm flex items-center justify-center"
          >
            My Listings
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-600 text-center">{error}</div>
        )}
        {success && (
          <div className="text-xs text-green-600 text-center">{success}</div>
        )}
      </div>

      {/* Sticky Save */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const desktopView = (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm">Back</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-sm font-medium text-blue-600"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            {profileAvatar}
            <div>
              <p className="text-lg font-semibold text-gray-900 text-center md:text-left">
                {user.fullName}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2 justify-center md:justify-start">
                <Mail className="w-3 h-3" />
                <span>{user.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Right panel */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col space-y-4">
            {!isEditing ? (
              <div className="space-y-3">
                {readOnlyField("Full Name", user.fullName)}
                {readOnlyField("Phone", user.phone)}
                {readOnlyField("Hostel", user.hostel)}
                {readOnlyField("Year", user.year)}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editableField("Full Name", edit.fullName, (v) => setEdit((p) => ({ ...p, fullName: v })), "text", "Your full name")}
                  {editableField("Phone Number", edit.phone, (v) => setEdit((p) => ({ ...p, phone: v })), "tel", "Optional contact number")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Hostel</label>
                    <select
                      value={edit.hostel}
                      onChange={(e) => setEdit((p) => ({ ...p, hostel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select hostel</option>
                      {HOSTEL_OPTIONS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Year</label>
                    <select
                      value={edit.year}
                      onChange={(e) => setEdit((p) => ({ ...p, year: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 text-right">{error}</div>
            )}
            {success && (
              <div className="text-xs text-green-600 text-right">{success}</div>
            )}

            {isEditing && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? mobileView : desktopView;
}

export default Profile;