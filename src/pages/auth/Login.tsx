import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ROLE_LIST } from "@/types/LoginType";
import { useNavigate } from "react-router-dom";
import { login } from "@/apis/authAPI";

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    try {
      const response = await login({
        email: email,
        password: password,
      })
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('role', response.role)
      if (response.role === ROLE_LIST.COMPANY) {
        navigate('/danh-cho-nha-tuyen-dung')
      }
      else if (response.role === ROLE_LIST.ADMIN) {
        navigate('/admin')
      }
      else if (response.role === ROLE_LIST.USER) {
        navigate('/')
      }
    }
    catch (error) {
      console.error("Error logging in:", error);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-gradient-to-r from-[#121212] to-[#53151c] flex justify-center items-center" >
        <img src='https://itviec.com/assets/customer/sign_in/logo-a2f6301beddfd012e9c6a71aed3d4cae576e2c7244fb4a41b2ff7c31bbd83f0e.png'/>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-8 py-10 space-y-6">
          <div className="text-center">
            <p className="text-gray-500">Đăng nhập nhà tuyển dụng</p>
          </div>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="px-10 py-6 focus:border-none focus:ring-0 rounded-sm border-gray-500 h-12"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="px-10 py-6 focus:border-none focus:ring-0 rounded-sm border-gray-500 h-12"

                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button className="w-full h-12 bg-[#ed1b2f] rounded-sm" variant="destructive" onClick={handleLogin}>
              <span className="text-white p-10 font-bold ">SIGN IN</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
