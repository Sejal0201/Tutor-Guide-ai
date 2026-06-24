import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const data = await api.register({
        name,
        email,
        password,
      });

      alert(data.message);

      navigate("/login");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-6">
      <div
        className="
        w-full
        max-w-md
        bg-white
        border
        border-slate-200
        rounded-[32px]
        shadow-lg
        p-10
      "
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">T</span>
          </div>

          <h1 className="text-4xl font-bold text-slate-900">TutorGuide AI</h1>

          <p className="text-slate-500 mt-2">Create your account</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
            w-full
            border
            border-slate-200
            rounded-2xl
            px-5
            py-4
            focus:outline-none
            focus:ring-2
            focus:ring-slate-900
          "
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
            w-full
            border
            border-slate-200
            rounded-2xl
            px-5
            py-4
            focus:outline-none
            focus:ring-2
            focus:ring-slate-900
          "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
            w-full
            border
            border-slate-200
            rounded-2xl
            px-5
            py-4
            focus:outline-none
            focus:ring-2
            focus:ring-slate-900
          "
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="
            w-full
            bg-slate-900
            hover:bg-slate-800
            text-white
            py-4
            rounded-2xl
            font-semibold
            transition
          "
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <p className="text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-slate-900">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
