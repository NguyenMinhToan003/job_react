/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { X, User, Upload, FileText } from 'lucide-react';
import { Education } from '@/types/educationType';
import { getAllEducations } from '@/apis/educationAPI';
import { createResumeAPI } from '@/apis/resumeAPI';
import { getListMajorAPI } from '@/apis/majorAPI';
import { Major, MajorResponse } from '@/types/majorType';
import { useAccount } from '@/providers/UserProvider';
import { TypeJob } from '@/types/TypeJobType';
import { getTypeJobList } from '@/apis/typeJobAPI';
import DatePicker from 'react-datepicker';
import { vi } from 'date-fns/locale';

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
  const [majors, setMajors] = useState<MajorResponse[]>([]);
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectTypeJob, setSelectTypeJob] = useState<TypeJob | null>(null);
  const [expectedSalary, setExpectedSalary] = useState<number | null>(null);

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
      if (file.size > 4 * 1024 * 1024) {
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
    setPdfFileName(null);
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
      toast.error('Vui lòng chọn quận/h');
      return false;
    }
    if (!location) {
      toast.error('Vui lòng nhập địa chỉ chi tiết');
      return false;
    }
    if (!selectEducation.id) {
      toast.error('Chọn trình độ học vấn');
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
        avatar,
        dateOfBirth,
        typeJobId: selectTypeJob?.id || -1,
        expectedSalary,
        district: selectedDistrictId,
        education: selectEducation.id,
        email,
        gender,
        location,
        majors: selectedMajors.map(major => major.id),
        name,
        skills: selectedSkills.map(skill => +skill.id),
        level: 1,
        languageResumes: selectedLanguage.map(lang => ({
          languageId: lang.language.id,
          level: lang.level,
        })),
        cv: pdfFile,
      });
      toast.success('Tạo hồ sơ thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo hồ sơ, vui lòng thử lại sau');
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
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-200 p-6">
          <CardTitle className="text-lg font-semibold text-gray-900">Tạo Hồ Sơ</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Ảnh đại diện</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={imagePreview || (typeof avatar === 'string' ? avatar : '')} alt="Avatar" />
                <AvatarFallback className="bg-gray-100">
                  <User className="w-6 h-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2 text-gray-500" />
                  {avatar ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                </Label>
                {avatar && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-sm text-gray-500 hover:text-red-600"
                  >
                    Xóa
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-500">PNG, JPG tối đa 5MB</p>
              </div>
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">File CV (PDF)</Label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md">
                {pdfFileName ? (
                  <FileText className="w-6 h-6 text-blue-600" />
                ) : (
                  <FileText className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handlePdfSelect}
                  className="hidden"
                />
                <Label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2 text-gray-500" />
                  {pdfFileName ? 'Thay đổi PDF' : 'Tải PDF lên'}
                </Label>
                {pdfFileName && (
                  <button
                    type="button"
                    onClick={removePdf}
                    className="ml-2 text-sm text-gray-500 hover:text-red-600"
                  >
                    Xóa
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-500">{pdfFileName || 'PDF tối đa 10MB'}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Thông tin cá nhân</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Họ và tên *</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Chức vụ *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Vị trí công việc mong muốn"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email *</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Số điện thoại *</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ngày sinh *</Label>
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
                    className="w-full mt-1 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Giới tính *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Địa chỉ</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Thành phố *</Label>
                  <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                    <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">Quận/Huyện *</Label>
                  <Select value={selectedDistrictId} onValueChange={setSelectedDistrictId}>
                    <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
              <div>
                <Label className="text-sm font-medium text-gray-700">Địa chỉ chi tiết *</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>
            </div>
          </div>

          {/* Education and Majors */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Học vấn và chuyên ngành</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Trình độ học vấn *</Label>
                <Select
                  value={selectEducation.id?.toString()}
                  onValueChange={(value) => {
                    const select = educations.find((edu) => edu.id === +value);
                    if (select) setSelectEducation(select);
                  }}
                >
                  <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
              <div>
                <Label className="text-sm font-medium text-gray-700">Chuyên ngành * (Tối đa 3)</Label>
                <Select
                  onValueChange={(value) => {
                    const selected = majors.find((major) => major.id.toString() === value);
                    if (!selected) return;
                    if (selectedMajors.find((m) => m.id === +value)) {
                      setSelectedMajors((prev) => prev.filter((m) => m.id !== +value));
                      return;
                    }
                    if (selectedMajors.length >= 3) {
                      toast.error('Bạn chỉ có thể chọn tối đa 3 chuyên ngành');
                      return;
                    }
                    setSelectedMajors((prev) => [...prev, selected]);
                  }}
                >
                  <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major.id} value={major.id.toString()}>
                        {major.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMajors.map((major) => (
                    <Badge
                      key={major.id}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {major.name}
                      <X
                        className="ml-1 w-3 h-3 text-blue-700 cursor-pointer"
                        onClick={() => setSelectedMajors((prev) => prev.filter((m) => m.id !== major.id))}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Thông tin công việc</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Loại công việc</Label>
                <Select
                  value={selectTypeJob?.id?.toString() || ''}
                  onValueChange={(value) => {
                    const selected = typeJobs.find((job) => job.id.toString() === value);
                    setSelectTypeJob(selected || null);
                  }}
                >
                  <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
              <div>
                <Label className="text-sm font-medium text-gray-700">Mức lương mong muốn</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={expectedSalary || ''}
                    onChange={(e) => setExpectedSalary(e.target.value ? +e.target.value : null)}
                    className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập mức lương (triệu đồng)"
                  />
                  <span className="text-sm text-gray-500">Triệu đồng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Kỹ năng</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {skill.name}
                  <X
                    className="ml-1 w-3 h-3 text-blue-700 cursor-pointer"
                    onClick={() => setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id))}
                  />
                </Badge>
              ))}
              <button
                onClick={() => setStatusAddSkill(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Thêm kỹ năng
              </button>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Ngôn ngữ</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLanguage.map((language) => (
                <Badge
                  key={language.language.id}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {language.language.name} ({language.level})
                  <X
                    className="ml-1 w-3 h-3 text-blue-700 cursor-pointer"
                    onClick={() =>
                      setSelectedLanguage(selectedLanguage.filter((l) => l.language.id !== language.language.id))
                    }
                  />
                </Badge>
              ))}
              <button
                onClick={() => setStatusAddLanguage(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Thêm ngôn ngữ
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleCreateResume}
            disabled={isLoading}
            className="w-full disabled:bg-blue-400"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo hồ sơ'}
          </Button>
        </CardContent>
      </Card>

      {/* Skills Dialog */}
      <Dialog open={statusAddSkill} onOpenChange={setStatusAddSkill}>
        <DialogContent className="max-w-md p-6 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Chọn kỹ năng</h3>
            <Close
              onClick={() => setStatusAddSkill(false)}
              className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                onClick={() => {
                  if (selectedSkills.some((s) => s.id === skill.id)) {
                    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
                  } else {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
                className={`text-xs font-medium px-2 py-1 rounded-full cursor-pointer ${
                  selectedSkills.some((s) => s.id === skill.id)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
          <Button
            onClick={() => setStatusAddSkill(false)}
            className="mt-4 min-w-full"
          >
            Xong
          </Button>
        </DialogContent>
      </Dialog>

      {/* Languages Dialog */}
      <Dialog open={statusAddLanguage} onOpenChange={setStatusAddLanguage}>
        <DialogContent className="max-w-md p-6 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Chọn ngôn ngữ</h3>
            <Close
              onClick={() => setStatusAddLanguage(false)}
              className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            {languages.map((language) => (
              <div key={language.id} className="flex items-center justify-between">
                <span
                  onClick={() => {
                    if (selectedLanguage.some((l) => l.language.id === language.id)) {
                      setSelectedLanguage(selectedLanguage.filter((l) => l.language.id !== language.id));
                    } else {
                      setSelectedLanguage([...selectedLanguage, { languageId: language.id, language, level: 1 }]);
                    }
                  }}
                  className={`text-sm font-medium cursor-pointer ${
                    selectedLanguage.some((l) => l.language.id === language.id)
                      ? 'text-blue-700'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {language.name}
                </span>
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
                    <SelectTrigger className="w-20 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
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
          <Button
            onClick={() => setStatusAddLanguage(false)}
            className="mt-4 w-full"
          >
            Xong
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}