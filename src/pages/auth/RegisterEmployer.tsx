/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, Globe, FileText, Check, Lock, Eye, EyeOff, Upload, X, MapPin, Hash, Users, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { getAllCountries } from '@/apis/countryAPI';
import { CountryResponse } from '@/types/countryType';
import { registerCompanyAPI } from '@/apis/companyAPI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Editer from '@/components/elements/editer/editer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Element } from '@/types/type';
import { getAllEmployerScales } from '@/apis/employerScalesAPI';
import { getAllBusinessTypes } from '@/apis/businesTypeAPI';
import { useNavigate } from 'react-router-dom';
import { useAlertDialog } from '@/providers/AlertDialogProvider';
import { useLoading } from '@/providers/LoadingProvider';

export default function CompanyRegistration() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [name, setName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [businessType, setBusinessType] = useState<number>(-1);
  const [employeeScale, setEmployeeScale] = useState<number>(-1);
  const [countryId, setCountryId] = useState(0);
  const [website, setWebsite] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [employeeScales, setEmployeeScales] = useState<Element[]>([]);
  const [businessTypes, setBusinessTypes] = useState<Element[]>([]);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

    const fetchElements = async () => {
      try {
        const [contriesList, employerScales, businessTypes] = await Promise.all([
          getAllCountries(),
          getAllEmployerScales(),
          getAllBusinessTypes(),
        ]);
        setCountries(contriesList);
        setEmployeeScales(employerScales);
        setBusinessTypes(businessTypes);
      }
      catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    }
    useEffect(() => {
      fetchElements();
    }, []);


  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      
      // Create preview
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerCompanyAPI({
        name,
        taxCode,
        businessTypeId: businessType,
        employeeScaleId: employeeScale,
        countryId: countryId,
        website,
        introduction,
        email,
        phone,
        password,
        logo: selectedLogo || undefined
      })
        setIsSubmitted(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đăng ký. Chúng tôi sẽ xem xét hồ sơ và liên hệ với bạn trong vòng 24 giờ.
          </p>
          <button 
            onClick={() => navigate('/auth/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
          <span className="ml-2">Đăng nhập ngay</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
    <div className="max-w-4xl mx-auto">

      <div  className="space-y-6 bg-white p-4 rounded-lg shadow-lg">
        <div>
          <Label className=" text-sm font-medium text-[#2c95ff] mb-2">
            Logo công ty
          </Label>
          <div className="flex items-center space-x-4">
            {logoPreview ? (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                />
                <Button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <Input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
              <Label
                htmlFor="logo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedLogo ? 'Thay đổi logo' : 'Chọn logo'}
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG tối đa 5MB
              </p>
            
            </div>
          </div>
        </div>

        {/* Company Basic Information */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-semibold text-[#2c95ff] mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-[#2c95ff]" />
            Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                Tên công ty *
              </Label>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="Nhập tên công ty"
              />
              
            </div>

            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <Hash className="w-4 h-4 inline  text-[#9277f2]" />
                Mã số thuế *
              </Label>
              <Input
                type="text"
                name="taxCode"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="0123456789"
              />
             
            </div>

            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <Briefcase className="w-4 h-4 inline  text-[#9277f2]" />
                Loại hình doanh nghiệp *
              </Label>
              <Select
                defaultValue={businessType?.toString()}
                onValueChange={(value) => setBusinessType(+value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại hình" >
                    {
                      businessTypes.find(type => type.id === businessType)?.name || 'Chọn loại hình'
                    }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map(type => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>

            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <Users className="w-4 h-4 inline  text-[#9277f2]" />
                <span>Quy mô nhân sự *</span>
              </Label>
            <Select
              defaultValue={employeeScale?.toString()}
              onValueChange={(value) => setEmployeeScale(+value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn quy mô" >
                  {
                    employeeScales.find(scale => scale.id === employeeScale)?.name || 'Chọn quy mô'
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {employeeScales.map(scale => (
                  <SelectItem key={scale.id} value={scale.id.toString()}>
                    {scale.name}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>

            </div>

            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <MapPin className="w-4 h-4 inline  text-[#9277f2]" />
                <span>Quốc gia *</span>
              </Label>
            <Select
              defaultValue={countryId.toString()}
              onValueChange={(value) => setCountryId(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn quốc gia" >
                  {countries.find(country => country.id === countryId)?.name || 'Chọn quốc gia'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>

            <div className="md:col-span-2 ">
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <Globe className="w-4 h-4 inline  text-[#9277f2]" />
                <span>Website công ty</span>
              </Label>
              <Input
                type="url"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="https://www.company.com"
              />
            </div>

            <div className="md:col-span-2 ">
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center ">
                <FileText className="w-4 h-4 inline  text-[#9277f2]" />
                <span >Giới thiệu công ty</span> *
              </Label>
              <Editer
                text={introduction}
                setText={setIntroduction}
              />
            </div>
          </div>
        </div>

        {/* Contact & Account Information */}
        <div className="pb-6">
          <h2 className="text-xl font-semibold text-[#2c95ff] mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-[#2c95ff]" />
            Thông tin liên hệ & Tài khoản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <Mail className="w-4 h-4 inline  text-[#9277f2]" />
                Email *
              </Label>
            <Input
                                  
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="email@company.com"
              />
             
            </div>

            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                <Phone className="w-4 h-4 inline  text-[#9277f2]" />
                Số điện thoại *
              </Label>
              <Input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="0123 456 789"
              />
              
            </div>

            <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                Mật khẩu *
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                  placeholder="Nhập mật khẩu"
                />
                <Button
                  variant='ghost'
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
                </div>
                
              </div>
              <div>
              <Label className=" text-sm font-medium text-[#060607] mb-2 flex gap-2 items-center">
                  Xác nhận mật khẩu *
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <Button
                    variant='ghost'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
          </div>
        </div>
        <div className="space-y-4">
        <Button
            onClick={handleSubmit}
            className=" text-white py-3 px-4 bg-[#451e99] font-medium flex items-center justify-center  rounded-sm w-fit"
          >
                <Building2 className="w-5 h-5 mr-2" />
                Đăng ký Nhà tuyển dụng
          </Button>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            Nếu bạn đã có tài khoản, vui lòng <a href="/auth/login" className="text-blue-600 hover:underline">đăng nhập</a>.
          </div>
      </div>
    </div>
  </div>
  );
}