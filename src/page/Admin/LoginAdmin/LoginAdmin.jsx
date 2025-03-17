import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../service/auth"; // Import API login

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const adminUser = JSON.parse(localStorage.getItem("adminUser"));
    if (adminUser?.token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(formData.username, formData.password);
      console.log(response.result);
      if (response?.error) {
        setError(response.message || "Đăng nhập thất bại");
        return;
      }

      localStorage.setItem("admin", response.result.roleName);

      const roleValid = [
        "ADMIN",
        "MANAGER",
        "STAFF",
        "DELIVERY",
        "EXPERT",
        "DELIVERY",
      ];

      if (response?.code === 200) {
        //Kiểm tra role ADMIN
        if (!roleValid.includes(response.result.roleName)) {
          setError("Bạn không có quyền truy cập vào trang quản trị");
          return;
        }
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userTokenExpiration");
        localStorage.setItem("admin", response.result.roleName);

        localStorage.setItem("role", response.result.roleName);
        localStorage.setItem("token", response.result.token);
        const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000;
        localStorage.setItem("adminTokenExpiration", expirationTime.toString());

        // Redirect based on role
        if (response.result.roleName === "ADMIN") {
          navigate("/admin"); // Admin goes to dashboard
        } else if (
          response.result.roleName === "STAFF" ||
          response.result.roleName === "MANAGER"
        ) {
          navigate("/admin/product"); // Other roles go to order management
        } else {
          navigate("/admin/order"); // Other roles go to order management
        }
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="max-w-md w-full bg-slate-700 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          <div className="flex items-end justify-center gap-1">
            <div className="text-4xl font-bold text-white">SKYN</div>
            <div className="text-sm text-gray-400 mb-1">ADMIN</div>
          </div>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-600 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-600 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="text-center text-sm text-red-400">{error}</div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../../service/login/index"; // Import API login

// const LoginAdmin = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (token && role) {
//       navigate("/admin");
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await login(formData.username, formData.password);

//       if (response?.error) {
//         setError(response.message || "Đăng nhập thất bại");
//         return;
//       }

//     const roleValid = ["ADMIN", "MANAGER", "STAFF", "DELIVERY", "EXPERT"];

//       if (response?.code === 200) {
//         //Kiểm tra role ADMIN
//         if (!roleValid.includes(response.result.roleName)) {
//           setError("Bạn không có quyền truy cập vào trang quản trị");
//           return;
//         }

//         localStorage.setItem("role", response.result.roleName);
//         localStorage.setItem("token", response.result.token);
//         navigate("/admin");
//       } else {
//         setError("Tên đăng nhập hoặc mật khẩu không đúng");
//       }
//     } catch (err) {
//       console.error("Login failed:", err);
//       setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-900">
//       <div className="max-w-md w-full bg-slate-700 rounded-lg shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center mb-8">
//           <div className="flex items-end justify-center gap-1">
//             <div className="text-4xl font-bold text-white">SKYN</div>
//             <div className="text-sm text-gray-400 mb-1">ADMIN</div>
//           </div>
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-300">
//               Tên người dùng
//             </label>
//             <input
//               type="text"
//               required
//               className="mt-1 block w-full px-3 py-2 bg-slate-600 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               value={formData.username}
//               onChange={(e) =>
//                 setFormData({ ...formData, username: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300">
//               Mật khẩu
//             </label>
//             <input
//               type="password"
//               required
//               className="mt-1 block w-full px-3 py-2 bg-slate-600 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//             />
//           </div>

//           {error && (
//             <div className="text-center text-sm text-red-400">{error}</div>
//           )}

//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Đăng nhập
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginAdmin;
