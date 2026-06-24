import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);

        navigate("/dashboard");
      } else {
        alert(data.detail);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
//       <div
//         className="
//           w-[450px]
//           bg-white
//           rounded-[32px]
//           border
//           border-slate-200
//           shadow-lg
//           p-10
//         "
//       >
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-slate-900">TutorGuide AI</h1>

//           <p className="text-slate-500 mt-2">Instruction Coach Platform</p>
//         </div>

//         <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>

//         <p className="text-slate-500 mb-6">Sign in to continue</p>

//         <div className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="
//               w-full
//               border
//               border-slate-200
//               rounded-2xl
//               px-5
//               py-4
//               focus:outline-none
//             "
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="
//               w-full
//               border
//               border-slate-200
//               rounded-2xl
//               px-5
//               py-4
//               focus:outline-none
//             "
//           />

//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className="
//               w-full
//               bg-[#fdab23]
//               hover:bg-[#f59e0b]
//               text-white
//               py-4
//               rounded-2xl
//               font-semibold
//               transition
//             "
//           >
//             {loading ? "Signing In..." : "Login"}
//           </button>
//           <p className="text-center text-slate-500 mt-6">
//             Don't have an account?{" "}
//             <Link to="/register" className="font-semibold text-slate-900">
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
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
      {/* Logo */}

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">T</span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900">
          TutorGuide AI
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome Back
        </p>
      </div>

      {/* Form */}

      <div className="space-y-4">
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
          onClick={handleLogin}
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
          {loading ? "Signing In..." : "Login"}
        </button>
      </div>

      <p className="text-center text-slate-500 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-slate-900"
        >
          Register
        </Link>
      </p>
    </div>
  </div>
);

}
