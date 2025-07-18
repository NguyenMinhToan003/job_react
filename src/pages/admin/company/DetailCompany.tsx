/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Building2, Mail, Phone, Globe, FileText, Lock, MapPin, Hash, Users, Briefcase,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminGetEmployer } from '@/apis/companyAPI';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { ACCOUNT_STATUS } from '@/types/type';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { EmployerDetailResponse } from '@/types/companyType';
import { changeStatus } from '@/apis/authAPI';
import { Button } from '@/components/ui/button';

export default function DetailCompany() {
  const { id } = useParams<{ id: string }>();
  const [employer, setEmployer] = useState<EmployerDetailResponse>({} as EmployerDetailResponse);

  useEffect(() => {
    if (id) hanldeFetchDataEmployer();
  }, [id]);

  const hanldeFetchDataEmployer = async () => {
    try {
      const response = await adminGetEmployer(id || '');
      setEmployer(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const handleChangeStatus = async (companyId: number, status: ACCOUNT_STATUS) => {
    try {
      await changeStatus({ status, accountId: companyId });
      toast.success('Thay đổi trạng thái thành công');
      hanldeFetchDataEmployer();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi thay đổi trạng thái tài khoản');
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-full p-2">
      <div className="bg-white shadow-xl p-8 border">
        <div className="space-y-6">
          {/* Logo */}
          <Button
            variant="outline"
            className="text-xs mb-4"
            onClick={() => navigate('/admin/nha-tuyen-dung')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại danh sách công ty
          </Button>
          <div>
            <Label className="text-sm font-medium text-[#2c95ff] mb-2">Logo công ty</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={employer.logo}
                  alt="Logo Preview"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-[#2c95ff] mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#2c95ff]" />
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  Tên công ty *
                </Label>
                <Input  value={employer.name} placeholder="Nhập tên công ty" />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <Hash className="w-4 h-4 text-[#9277f2]" /> Mã số thuế *
                </Label>
                <Input  value={employer.taxCode} placeholder="0123456789" />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <Briefcase className="w-4 h-4 text-[#9277f2]" /> Loại hình doanh nghiệp *
                </Label>
                <Input  value={employer.businessType?.name} placeholder="Nhập loại hình doanh nghiệp" />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <Users className="w-4 h-4 text-[#9277f2]" /> Quy mô nhân sự *
                </Label>
                <Input  value={employer.employeeScale?.name} placeholder="Nhập quy mô nhân sự" />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <MapPin className="w-4 h-4 text-[#9277f2]" /> Quốc gia *
                </Label>
                <Input  value={employer.country?.name} placeholder="Nhập quốc gia" />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <Globe className="w-4 h-4 text-[#9277f2]" /> Website công ty
                </Label>
                <NavLink to={employer.website || ''} target="_blank" className="text-blue-600 hover:underline">
                  {employer.website || 'Chưa có website'}
                </NavLink>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <FileText className="w-4 h-4 text-[#9277f2]" /> Giới thiệu công ty *
                </Label>
                <div
                  dangerouslySetInnerHTML={{ __html: employer.introduction || '' }}
                  className="border rounded-lg p-3 min-h-[100px] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-[#2c95ff] mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-[#2c95ff]" />
              Thông tin liên hệ & Tài khoản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-[#9277f2]" /> Email *
                </Label>
                <Input  type="email" value={employer.account?.email} />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  <Phone className="w-4 h-4 text-[#9277f2]" /> Số điện thoại *
                </Label>
                <Input  type="tel" value={employer.phone} placeholder="0123 456 789" />
              </div>
            </div>
          </div>

          {/* Trạng thái tài khoản */}
          <div className="space-y-4">
            <Select
              value={employer.account?.status}
              onValueChange={(value: ACCOUNT_STATUS) => handleChangeStatus(employer.id, value)}
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ACCOUNT_STATUS.CREATED}>Chưa xét duyệt</SelectItem>
                <SelectItem value={ACCOUNT_STATUS.ACTIVE}>Đã xét duyệt</SelectItem>
                <SelectItem value={ACCOUNT_STATUS.BLOCKED}>Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}