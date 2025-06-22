/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCityList } from '@/apis/cityAPI';
import { getAllLanguages } from '@/apis/languageAPI';
import { updateResumeAPI, viewResumeAPI } from '@/apis/resumeAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getAllEducations } from '@/apis/educationAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getListMajorAPI } from '@/apis/majorAPI';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, User, Briefcase, Book, Upload, FileText, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { City, District } from '@/types/location';
import { Skill } from '@/types/SkillType';
import { Language, LanguageResume } from '@/types/LanguageType';
import { Education } from '@/types/educationType';
import { Level } from '@/types/levelType';
import { Major } from '@/types/majorType';
import { ResumeVersion, ResumeVersionExp } from '@/types/resumeType';
import { TypeJob } from '@/types/TypeJobType';
import { getTypeJobList } from '@/apis/typeJobAPI';
import DatePicker from 'react-datepicker';
import { vi } from 'date-fns/locale';

export default function FormUpdateResume() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();

  // State declarations
  const [resumeVer, setResumeVer] = useState<ResumeVersion>({} as ResumeVersion);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [citys, setCitys] = useState<City[]>([]);
  const [gender, setGender] = useState<string>('');
  const [dayOfBirth, setDayOfBirth] = useState<string>('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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
  const [avatar, setAvatar] = useState<File | string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level>({} as Level);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [selectedResumeVersionExps, setSelectedResumeVersionExps] = useState<ResumeVersionExp[]>([]);
  const [editResumeVersionExps, setEditResumeVersionExps] = useState<ResumeVersionExp | undefined>(undefined);
  const [statusAddResumeVersionExp, setStatusAddResumeVersionExp] = useState<boolean>(false);
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch initial data
  const fetchElements = async () => {
    try {
      const [cityList, skillList, languageList, educationList, levelList, majorList, typejobList] = await Promise.all([
        getCityList(),
        getSkillList(),
        getAllLanguages(),
        getAllEducations(),
        getLevelList(),
        getListMajorAPI(),
        getTypeJobList(),
      ]);
      setCitys(cityList);
      setSkills(skillList);
      setLanguages(languageList);
      setEducations(educationList);
      setLevels(levelList);
      setMajors(majorList);
      setTypeJobs(typejobList);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin');
    }
  };

  // Fetch resume data
  const fetchDataResume = async () => {
    try {
      const response = await viewResumeAPI(Number(resumeId));
      setResumeVer(response);
      setUsername(response.username || '');
      setEmail(response.email || '');
      setPhone(response.phone || '');
      setGender(response.gender || '');
      setDayOfBirth(response.dateOfBirth || '');
      setLocation(response.location || '');
      setSelectedCityId(response.district?.city?.id || '');
      setSelectedDistrictId(response.district?.id || '');
      setAbout(response.about || '');
      setSelectedSkills(response.skills || []);
      setSelectedLanguage(response.languageResumes || []);
      setDistricts(response.district?.city?.districts || []);
      setSelectEducation(response.education || {});
      setName(response.resume?.name || '');
      setSelectedLevel(response.level || {});
      setSelectedMajors(response.majors || []);
      setSelectedResumeVersionExps(response.experiences || []);
      setAvatar(response.avatar || '');
      setImagePreview(response.avatar || null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  };

  // Handle image select
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

  // Handle PDF select
  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Vui lòng chọn file PDF');
        return;
      }
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  // Remove image
  const removeImage = () => {
    setAvatar(undefined);
    setImagePreview(null);
  };

  // Remove PDF
  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName('');
  };

  // Validate form
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
    if (!dayOfBirth) {
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
    if (!selectedLevel.id) {
      toast.error('Vui lòng chọn trình độ');
      return false;
    }
    return true;
  };

  // Handle resume update
  const handleUpdateResume = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateResumeAPI(Number(resumeId), {
        about,
        dateOfBirth: dayOfBirth,
        email,
        username,
        gender,
        location,
        phone,
        education: selectEducation.id,
        district: selectedDistrictId,
        name,
        majors: selectedMajors.map((major) => +major.id),
        skills: selectedSkills.map((skill) => +skill.id),
        level: selectedLevel.id,
        languageResumes: selectedLanguage.map((lang) => ({
          languageId: lang.language.id,
          level: lang.level,
        })),
        avatar: avatar instanceof File ? avatar : resumeVer.avatar,
        resumeversionExps: selectedResumeVersionExps,
        cv: pdfFile,
      });
      toast.success('Cập nhật thông tin hồ sơ thành công');
      navigate(`/tong-quat-ho-so/ho-so/${resumeId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchElements();
    fetchDataResume();
  }, [resumeId]);

  useEffect(() => {
    const selectedCity = citys.find((city) => city.id === selectedCityId);
    setDistricts(selectedCity?.districts || []);
    if (!selectedCity?.districts.find((d) => d.id === selectedDistrictId)) {
      setSelectedDistrictId('');
    }
  }, [selectedCityId, citys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">Cập nhật hồ sơ xin việc</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {imagePreview || resumeVer.avatar ? (
                <Avatar className="w-20 h-20">
                  <AvatarImage src={imagePreview || resumeVer.avatar} alt="Avatar" />
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
                {avatar || resumeVer.avatar ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
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
                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
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
                  className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <DatePicker
                  selected={dayOfBirth ? new Date(dayOfBirth) : null}
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

          {/* Level */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Trình độ *</Label>
            <div className="relative">
              <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Select
                value={selectedLevel.id?.toString()}
                onValueChange={(value) => {
                  const select = levels.find((level) => level.id === +value);
                  if (select) setSelectedLevel(select);
                }}
              >
                <SelectTrigger className="pl-10 pr-3 py-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
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

          {/* Submit Button */}
          <Button
            onClick={handleUpdateResume}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật hồ sơ'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Skills Dialog */}
      <Dialog open={statusAddSkill} onOpenChange={setStatusAddSkill}>
        <DialogContent className="max-w-2xl p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Chọn kỹ năng</h2>
            <DialogClose className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700">
              <X />
            </DialogClose>
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
            <DialogClose className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700">
              <X />
            </DialogClose>
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
      <Dialog open={statusAddResumeVersionExp} onOpenChange={setStatusAddResumeVersionExp}>
        <DialogContent className="max-w-2xl p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Thêm kinh nghiệm làm việc</h2>
            <DialogClose className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700">
              <X />
            </DialogClose>
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
                setStatusAddResumeVersionExp(false);
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
  );
}