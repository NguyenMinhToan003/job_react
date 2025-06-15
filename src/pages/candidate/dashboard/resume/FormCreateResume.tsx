/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCityList } from '@/apis/cityAPI';
import { getAllLanguages } from '@/apis/languageAPI';
import { Language, LanguageResume } from '@/types/LanguageType';
import { getSkillList } from '@/apis/skillAPI';
import { Close } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { City, District } from '@/types/location';
import { Skill } from '@/types/SkillType';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X, User, Briefcase, Book, Upload, FileText, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { Education } from '@/types/educationType';
import { getAllEducations } from '@/apis/educationAPI';
import { createResumeAPI } from '@/apis/resumeAPI';
import { getListMajorAPI } from '@/apis/majorAPI';
import { Major } from '@/types/majorType';
import { useAccount } from '@/providers/UserProvider';
import { TypeJob } from '@/types/TypeJobType';
import { getTypeJobList } from '@/apis/typeJobAPI';
import { ResumeVersionExp } from '@/types/resumeType';
import DatePicker from 'react-datepicker';
import { vi } from 'date-fns/locale';
import { uploadCv } from '@/apis/cvAPI';

export default function FormCreateResume() {
  const { dataUser } = useAccount();
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [citys, setCitys] = useState<City[]>([]);
  const [gender, setGender] = useState<string>('');
  const [dateOfBirth, setDayOfBirth] = useState<string>('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [username, setUsername] = useState<string>(dataUser?.name || '');
  const [phone, setPhone] = useState<string>(dataUser?.phone || '');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [statusAddSkill, setStatusAddSkill] = useState<boolean>(false);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [location, setLocation] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [statusAddLanguage, setStatusAddLanguage] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageResume[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [selectEducation, setSelectEducation] = useState<Education>({} as Education);
  const [avatar, setAvatar] = useState<File | string>(dataUser?.avatar || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);
  const [selectedResumeVersionExps, setSelectedResumeVersionExps] = useState<ResumeVersionExp[]>([]);
  const [editResumeVersionExps, setEditResumeVersionExps] = useState<ResumeVersionExp>();
  const [statusAddResumeVersionExp, setStatusAddResumeVersion] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchElements = async () => {
    try {
      const [cityList, skillList, languageList, educationList, majorsList, typejobList] = await Promise.all([
        getCityList(),
        getSkillList(),
        getAllLanguages(),
        getAllEducations(),
        getListMajorAPI(),
        getTypeJobList(),
      ]);
      setCitys(cityList);
      setSkills(skillList);
      setLanguages(languageList);
      setEducations(educationList);
      setMajors(majorsList);
      setTypeJobs(typejobList);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB');
        return;
      }

      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const removeImage = () => {
    setAvatar('');
    setImagePreview(null);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName('');
  };

  const validateForm = () => {
    if (!username) {
      toast.error('Vui lòng nhập họ và tên');
      return false;
    }
    if (!name) {
      toast.error('Vui lòng nhập chức vụ');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Vui lòng nhập email hợp lệ');
      return false;
    }
    if (!phone || !/^\d{10,11}$/.test(phone)) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
      return false;
    }
    if (!dateOfBirth) {
      toast.error('Vui lòng chọn ngày sinh');
      return false;
    }
    if (!gender) {
      toast.error('Vui lòng chọn giới tính');
      return false;
    }
    if (!selectedCityId) {
      toast.error('Vui lòng chọn thành phố');
      return false;
    }
    if (!selectedDistrictId) {
      toast.error('Vui lòng chọn quận/huyện');
      return false;
    }
    if (!location) {
      toast.error('Vui lòng nhập địa chỉ chi tiết');
      return false;
    }
    if (!selectEducation.id) {
      toast.error('Vui lòng chọn trình độ học vấn');
      return false;
    }
    if (selectedMajors.length === 0) {
      toast.error('Vui lòng chọn ít nhất một chuyên ngành');
      return false;
    }
    return true;
  };

  const handleCreateResume = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {

      await createResumeAPI({
        username,
        phone,
        about,
        avatar: avatar,
        dateOfBirth,
        district: selectedDistrictId,
        education: selectEducation.id,
        email,
        gender,
        location,
        majors: selectedMajors.map(major => major.id),
        name,
        skills: selectedSkills.map(skill => +skill.id),
        level: 1,
        resumeversionExps: selectedResumeVersionExps,
        languageResumes: selectedLanguage.map(lang => ({
          languageId: lang.language.id,
          level: lang.level,
        })),
        cv: pdfFile,
      });
      toast.success('Tạo hồ sơ thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo hồ sơ, vui lòng thử lại sau');
      console.error('Error creating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  useEffect(() => {
    const selectedCity = citys.find((city) => city.id === selectedCityId);
    if (selectedCity) {
      setDistricts(selectedCity.districts);
      setSelectedDistrictId('');
    } else {
      setDistricts([]);
    }
  }, [citys, selectedCityId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full">
        <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">
              Tạo Hồ Sơ
              <span className="text-sm text-gray-500 block mt-1">Vui lòng điền đầy đủ thông tin</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {imagePreview || typeof avatar === 'string' ? (
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={imagePreview || (typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar))}
                      alt="Avatar"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Avatar>
                ) : (
                  <Avatar className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300">
                    <AvatarFallback>
                      <User className="w-8 h-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {avatar ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 5MB</p>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {pdfFileName ? (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-gray-700 truncate max-w-xs">{pdfFileName}</span>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-content hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handlePdfSelect}
                  className="hidden"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {pdfFileName ? 'Thay đổi PDF' : 'Tải lên file PDF'}
                </label>
                <p className="text-xs text-gray-500 mt-1">PDF tối đa 10MB</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="user-name"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 text-sm pr-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Vị trí công việc mong muốn"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-blue-500   focus:border-transparent transition-colors"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <DatePicker
                    selected={dateOfBirth ? new Date(dateOfBirth) : null}
                    onChange={(date) => setDayOfBirth(date ? date.toISOString().split('T')[0] : '')}
                    locale={vi}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày sinh"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableMonthYearDropdown
                    yearDropdownItemNumber={100}
                    showMonthDropdown
                    dropdownMode="select"
                    className="w-full pl-10 pr-3 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Giới tính *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NAM">Nam</SelectItem>
                      <SelectItem value="NU">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Thành phố *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                    <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Chọn thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {citys.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select value={selectedDistrictId} onValueChange={setSelectedDistrictId}>
                    <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="col-span-2">
                <Label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu bản thân</Label>
              <div className="relative">
                <Book className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Textarea
                  id="description"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none min-h-[120px]"
                  placeholder="Mô tả về bản thân, kỹ năng, sở thích..."
                />
              </div>
            </div>

            {/* Majors */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Chuyên ngành *</Label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Select
                  onValueChange={(value) => {
                    const selected = majors.find((major) => major.id.toString() === value);
                    if (!selected) return;
                    if (selectedMajors.find((m) => m.id === +value)) {
                      setSelectedMajors((prev) => prev.filter((m) => m.id !== +value));
                      return;
                    }
                    if (selectedMajors.length >= 3) {
                      toast.error('Bạn chỉ có thể chọn tối đa 3 ngành nghề');
                      return;
                    }
                    setSelectedMajors((prev) => [...prev, selected]);
                  }}
                >
                  <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major.id} value={major.id.toString()}>
                        {major.name}
                        {selectedMajors.some((m) => m.id === major.id) && (
                          <X
                            className="ml-2 inline cursor-pointer text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMajors((prev) => prev.filter((m) => m.id !== major.id));
                            }}
                          />
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {selectedMajors.map((major) => (
                  <Badge
                    key={major.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                  >
                    {major.name}
                    <X
                      className="ml-2 w-4 h-4 text-red-600 cursor-pointer"
                      onClick={() => setSelectedMajors((prev) => prev.filter((m) => m.id !== major.id))}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Trình độ học vấn *</Label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Select
                  value={selectEducation.id?.toString()}
                  onValueChange={(value) => {
                    const select = educations.find((edu) => edu.id === +value);
                    if (select) setSelectEducation(select);
                  }}
                >
                  <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Chọn trình độ học vấn" />
                  </SelectTrigger>
                  <SelectContent>
                    {educations.map((education) => (
                      <SelectItem key={education.id} value={education.id.toString()}>
                        {education.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</Label>
              <div className="flex gap-2 flex-wrap">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                  >
                    {skill.name}
                    <X
                      className="ml-2 w-4 h-4 text-red-600 cursor-pointer"
                      onClick={() => setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id))}
                    />
                  </Badge>
                ))}
                <Badge
                  onClick={() => setStatusAddSkill(true)}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium hover:bg-green-200 cursor-pointer"
                >
                  + Thêm kỹ năng
                </Badge>
              </div>
            </div>

            {/* Languages */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</Label>
              <div className="flex gap-2 flex-wrap">
                {selectedLanguage.map((language) => (
                  <Badge
                    key={language.language.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                  >
                    {language.language.name} - {language.level}
                    <X
                      className="ml-2 w-4 h-4 text-red-600 cursor-pointer"
                      onClick={() =>
                        setSelectedLanguage(selectedLanguage.filter((l) => l.language.id !== language.language.id))
                      }
                    />
                  </Badge>
                ))}
                <Badge
                  onClick={() => setStatusAddLanguage(true)}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium hover:bg-green-200 cursor-pointer"
                >
                  + Thêm ngôn ngữ
                </Badge>
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm làm việc</Label>
              <Badge
                onClick={() => setStatusAddResumeVersion(true)}
                className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium hover:bg-green-200 cursor-pointer"
              >
                + Thêm kinh nghiệm
              </Badge>
              <Card className="mt-2 bg-transparent border-none shadow-none">
                {selectedResumeVersionExps.map((exp, index) => (
                  <CardContent key={index} className="border-b border-gray-200 p-4">
                    <div className="text-lg font-bold text-gray-900">{exp.position}</div>
                    <div className="text-sm font-semibold text-gray-700">{exp.companyName}</div>
                    <div className="text-sm text-gray-600">
                      {exp.startTime} - {exp.endTime}
                    </div>
                    <div className="text-sm text-gray-600">{exp.jobDescription}</div>
                    <X
                      className="ml-auto w-4 h-4 text-red-600 cursor-pointer"
                      onClick={() =>
                        setSelectedResumeVersionExps(selectedResumeVersionExps.filter((_, i) => i !== index))
                      }
                    />
                  </CardContent>
                ))}
              </Card>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleCreateResume}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                'Tạo hồ sơ'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Skills Dialog */}
        <Dialog open={statusAddSkill} onOpenChange={setStatusAddSkill}>
          <DialogContent className="max-w-2xl p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chọn kỹ năng</h2>
              <Close
                onClick={() => setStatusAddSkill(false)}
                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                >
                  {skill.name}
                  <X
                    className="ml-2 w-4 h-4 text-red-600 cursor-pointer"
                    onClick={() => setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id))}
                  />
                </Badge>
              ))}
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant={selectedSkills.some((s) => s.id === skill.id) ? 'default' : 'outline'}
                  onClick={() => {
                    if (selectedSkills.some((s) => s.id === skill.id)) {
                      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
                    } else {
                      setSelectedSkills([...selectedSkills, skill]);
                    }
                  }}
                  className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200"
                >
                  {skill.name}
                  {selectedSkills.some((s) => s.id === skill.id) && (
                    <X className="ml-2 w-4 h-4 text-red-600" />
                  )}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setStatusAddSkill(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Languages Dialog */}
        <Dialog open={statusAddLanguage} onOpenChange={setStatusAddLanguage}>
          <DialogContent className="max-w-2xl p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chọn ngôn ngữ</h2>
              <Close
                onClick={() => setStatusAddLanguage(false)}
                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {selectedLanguage.map((language) => (
                <Badge
                  key={language.language.id}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                >
                  {language.language.name} - {language.level}
                  <X
                    className="ml-2 w-4 h-4 text-red-600 cursor-pointer"
                    onClick={() =>
                      setSelectedLanguage(selectedLanguage.filter((l) => l.language.id !== language.language.id))
                    }
                  />
                </Badge>
              ))}
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-3 gap-4">
              {languages.map((language) => (
                <div key={language.id} className="flex items-center gap-2">
                  <Badge
                    onClick={() => {
                      if (selectedLanguage.some((l) => l.language.id === language.id)) {
                        setSelectedLanguage(selectedLanguage.filter((l) => l.language.id !== language.id));
                      } else {
                        setSelectedLanguage([...selectedLanguage, { languageId: language.id, language, level: 1 }]);
                      }
                    }}
                    className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 flex-1"
                  >
                    {language.name}
                    {selectedLanguage.some((l) => l.language.id === language.id) && (
                      <X className="ml-2 w-4 h-4 text-red-600" />
                    )}
                  </Badge>
                  {selectedLanguage.some((l) => l.language.id === language.id) && (
                    <Select
                      onValueChange={(value) =>
                        setSelectedLanguage(
                          selectedLanguage.map((l) =>
                            l.language.id === language.id ? { ...l, level: +value } : l
                          )
                        )
                      }
                      defaultValue="1"
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setStatusAddLanguage(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Work Experience Dialog */}
        <Dialog open={statusAddResumeVersionExp} onOpenChange={setStatusAddResumeVersion}>
          <DialogContent className="max-w-2xl p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Thêm kinh nghiệm làm việc</h2>
              <Close
                onClick={() => setStatusAddResumeVersion(false)}
                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Loại công việc</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    onValueChange={(value) => {
                      const selectedTypeJob = typeJobs.find((job) => job.id.toString() === value);
                      if (selectedTypeJob) {
                        setEditResumeVersionExps({
                          ...editResumeVersionExps,
                          typeJob: selectedTypeJob,
                        } as ResumeVersionExp);
                      }
                    }}
                    defaultValue={editResumeVersionExps?.typeJob?.id.toString() || ''}
                  >
                    <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Chọn loại công việc" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeJobs.map((job) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={editResumeVersionExps?.companyName || ''}
                    onChange={(e) =>
                      setEditResumeVersionExps({
                        ...editResumeVersionExps,
                        companyName: e.target.value,
                      } as ResumeVersionExp)
                    }
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập tên công ty"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Vị trí công việc</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={editResumeVersionExps?.position || ''}
                    onChange={(e) =>
                      setEditResumeVersionExps({
                        ...editResumeVersionExps,
                        position: e.target.value,
                      } as ResumeVersionExp)
                    }
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập vị trí công việc"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      value={editResumeVersionExps?.startTime || ''}
                      onChange={(e) =>
                        setEditResumeVersionExps({
                          ...editResumeVersionExps,
                          startTime: e.target.value,
                        } as ResumeVersionExp)
                      }
                      className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Ngày bắt đầu"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      value={editResumeVersionExps?.endTime || ''}
                      onChange={(e) =>
                        setEditResumeVersionExps({
                          ...editResumeVersionExps,
                          endTime: e.target.value,
                        } as ResumeVersionExp)
                      }
                      className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Ngày kết thúc"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc</Label>
                <div className="relative">
                  <Book className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Textarea
                    value={editResumeVersionExps?.jobDescription || ''}
                    onChange={(e) =>
                      setEditResumeVersionExps({
                        ...editResumeVersionExps,
                        jobDescription: e.target.value,
                      } as ResumeVersionExp)
                    }
                    className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none min-h-[120px]"
                    placeholder="Nhập mô tả công việc"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  setStatusAddResumeVersion(false);
                  if (
                    editResumeVersionExps?.typeJob &&
                    editResumeVersionExps?.companyName &&
                    editResumeVersionExps?.position &&
                    editResumeVersionExps?.startTime &&
                    editResumeVersionExps?.endTime &&
                    editResumeVersionExps?.jobDescription
                  ) {
                    setSelectedResumeVersionExps([...selectedResumeVersionExps, editResumeVersionExps]);
                    setEditResumeVersionExps(undefined);
                  } else {
                    toast.error('Vui lòng điền đầy đủ thông tin kinh nghiệm làm việc');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Lưu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}