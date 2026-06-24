import Sidebar from "../components/Sidebar";
import { User, Brain, Shield, Download, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("${API_URL}/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "${API_URL}/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password Updated Successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Sidebar />

      <main className="ml-72 p-10">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-900">Settings</h1>

          <p className="text-slate-500 mt-2 text-lg">
            Manage your TutorGuide AI preferences.
          </p>
        </div>

        {/* Grid */}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Side */}

          <div className="col-span-8 flex flex-col gap-6">
            {/* Profile */}

            <div className="bg-white rounded-[32px] border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-slate-700" />
                <h2 className="text-2xl font-bold">Profile Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <input
                  value={user?.name || ""}
                  className="border border-slate-200 rounded-2xl p-4"
                />

                <input
                  value={user?.email || ""}
                  className="border border-slate-200 rounded-2xl p-4"
                />
                <button
                  className="
  mt-6
  bg-slate-900
  text-white
  px-6
  py-3
  rounded-2xl
  "
                >
                  Save Changes
                </button>
                {/* <input
                  defaultValue="Peer Tutor"
                  className="border border-slate-200 rounded-2xl p-4"
                />

                <input
                  defaultValue="LNCT Bhopal"
                  className="border border-slate-200 rounded-2xl p-4"
                /> */}
              </div>
            </div>

            {/* AI Preferences */}

            <div className="bg-white rounded-[32px] border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="text-violet-600" />
                <h2 className="text-2xl font-bold">AI Coaching Preferences</h2>
              </div>

              <div className="space-y-4">
                {[
                  "Auto Generate Hints",
                  "Misconception Detection",
                  "Reflection Reports",
                  "Session Notifications",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border border-slate-200 rounded-2xl p-4"
                  >
                    <span className="font-medium text-slate-800">{item}</span>

                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="col-span-4 flex flex-col gap-6">
            {/* Appearance */}

            {/* <div className="bg-white rounded-[32px] border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="text-blue-600" />
                <h2 className="text-2xl font-bold">Appearance</h2>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl">
                  Light Theme
                </button>

                <button className="w-full border border-slate-200 py-4 rounded-2xl">
                  Dark Theme
                </button>
              </div>
            </div> */}

            {/* Security */}

            <div className="bg-white rounded-[32px] border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-green-600" />
                <h2 className="text-2xl font-bold">Account Actions</h2>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-2 border border-slate-200 py-4 rounded-2xl hover:bg-slate-50">
                  <Download size={18} />
                  Export Reports
                </button>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="
    w-full
    border
    border-slate-200
    rounded-2xl
    p-4
    "
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="
    w-full
    border
    border-slate-200
    rounded-2xl
    p-4
    "
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="
    w-full
    border
    border-slate-200
    rounded-2xl
    p-4
    "
                  />

                  <button
                    onClick={handlePasswordChange}
                    className="
    w-full
    bg-slate-900
    text-white
    py-4
    rounded-2xl
    "
                  >
                    Update Password
                  </button>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                  className="
  w-full
  bg-red-50
  text-red-600
  py-4
  rounded-2xl
  flex
  items-center
  justify-center
  gap-2
  "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
