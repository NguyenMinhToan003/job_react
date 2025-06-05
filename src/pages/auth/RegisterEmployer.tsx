/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerCompanyAPI } from "@/apis/companyAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RegisterEmployer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      await registerCompanyAPI({
        name,
        password,
        email,
        logo: 'https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOUtlUGc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--f0cfca008253135372c6230bf3156570abdb9d9f/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bb0ebae071595ab1791dc0ad640ef70a76504047/ingenico.jpg'
      })
      toast.success('Đăng ký thành công');
      navigate('/auth/login');
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đăng ký thất bại');
    }
  }

  return <>
    <Card>
      <CardContent>
        <Input
          placeholder="Tên công ty"
          className="mb-4"
          type="text"
          name="companyName"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email công ty"
          className="mb-4"
          type="email"
          name="companyEmail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Mat khẩu"
          className="mb-4"
          type="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleRegister} className="w-full">
          Đăng ký
        </Button>
      </CardContent>
    </Card>
  </>
}