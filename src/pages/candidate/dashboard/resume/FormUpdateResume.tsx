/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { X, User,  Upload, FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { City, District } from '@/types/location';
import { Skill } from '@/types/SkillType';
import { Language, LanguageResume } from '@/types/LanguageType';
import { Education } from '@/types/educationType';
import { Level } from '@/types/levelType';
import { Major, MajorResponse } from '@/types/majorType';
import { ResumeVersion } from '@/types/resumeType';
import { TypeJob } from '@/types/TypeJobType';
import { getTypeJobList } from '@/apis/typeJobAPI';
import DatePicker from 'react-datepicker';
import { vi } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import dayjs from 'dayjs';
import { Experience } from '@/types/experienceType';
import { getExperienceList } from '@/apis/experienceAPI';
import Editer from '@/components/elements/editer/editer';
import { useLoading } from '@/providers/LoadingProvider';

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
  const [majors, setMajors] = useState<MajorResponse[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileURL, setPdfFileURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectTypeJob, setSelectTypeJob] = useState<TypeJob | null>(null);
  const [expectedSalary, setExpectedSalary] = useState<number>(0);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectExperience, setSelectExperience] = useState<Experience | null>(null);
  const {setLoading} = useLoading()



  // Fetch initial data
  const fetchElements = async () => {
    setLoading(true);
    try {
      const [cityList, skillList, languageList, educationList, levelList, majorList, typejobList, expList] = await Promise.all([
        getCityList(),
        getSkillList(),
        getAllLanguages(),
        getAllEducations(),
        getLevelList(),
        getListMajorAPI(),
        getTypeJobList(),
        getExperienceList(),
      ]);
      setCitys(cityList);
      setSkills(skillList);
      setLanguages(languageList);
      setEducations(educationList);
      setLevels(levelList);
      setMajors(majorList);
      setTypeJobs(typejobList);
      setExperiences(expList);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin');
    }
    finally {
      setLoading(false);
    }
  };

  // Fetch resume data
  const fetchDataResume = async () => {
    try {
      setLoading(true);
      const response = await viewResumeAPI(Number(resumeId));
      setResumeVer(response);
      setUsername(response.username || '');
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
      setSelectTypeJob(response.typeJob || null);
      setExpectedSalary(response.expectedSalary || 0);
      setAvatar(response.avatar || '');
      setImagePreview(response.avatar || null);
      setAbout(response.about || '');
      setDateOfBirth(response.dateOfBirth);
      setSelectTypeJob(response.typeJob || null);
      setSelectExperience(response.experience || null);
      setPdfFileURL(response.urlPdf || '');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
    finally {
      setLoading(false);
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Vui lòng chọn file PDF');
        return;
      }
      setPdfFile(file);
      setPdfFileURL(URL.createObjectURL(file));
    }
  };

  // Handle resume update
  const handleUpdateResume = async () => {
    setLoading(true);
    try {
      await updateResumeAPI(Number(resumeId), {
        about,
        dateOfBirth: dayOfBirth,
        username,
        gender,
        location,
        experienceId: selectExperience?.id || 0,
        education: selectEducation.id,
        district: selectedDistrictId,
        name,
        majors: selectedMajors.map((major) => +major.id),
        skills: selectedSkills.map((skill) => +skill.id),
        level: selectedLevel.id,
        languageResumes: selectedLanguage.map((lang) => ({
          languageId: lang.language.id,
        })),
        avatar: avatar instanceof File ? avatar : resumeVer.avatar,
        typeJobId: selectTypeJob?.id || 0,
        expectedSalary: expectedSalary || null,
        cv: pdfFile,
      });
      toast.success('Cập nhật thông tin hồ sơ thành công');
      navigate(`/tong-quat-ho-so/ho-so/${resumeId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin hồ sơ');
    } finally {
      setLoading(false);
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

  const handleClickLanguage = (language: Language) => {
    if (selectedLanguage.some((l) => l.language.id === language.id)) {
      setSelectedLanguage((prev) =>
        prev.filter((l) => l.language.id !== language.id)
      );
    } else {
      setSelectedLanguage((prev) => [
        ...prev,
        { languageId: language.id, language },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-start justify-center p-4">
      <Card className="w-3xl border-gray-300 border shadow-none rounded-lg">
        <CardHeader className=" border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">Cập nhật Hồ Sơ</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Ảnh đại diện</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={imagePreview || (typeof avatar === "string" ? avatar : "")} alt="Avatar" />
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
                    {avatar ? "Thay đổi ảnh" : "Tải ảnh lên"}
                  </Label>
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">File CV (PDF)</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md">
                  {pdfFileURL ? (
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
                    {pdfFileURL ? "Thay đổi PDF" : "Tải PDF lên"}
                  </Label>
                </div>
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
              
               <div className='space-y-2'>
                  <Label>Giới thiệu & Mô tả</Label>
                  <Editer
                    text={about}
                    setText={setAbout}
                  />
                </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ngày sinh *</Label>
                  <DatePicker
                    selected={dateOfBirth ? new Date(dateOfBirth) : null}
                    onChange={(date) => setDayOfBirth(date ? date.toISOString().split("T")[0] : "")}
                    locale={vi}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày sinh"
                    maxDate={dayjs().year(dayjs().year() - 18).toDate()}
                    showYearDropdown
                    scrollableMonthYearDropdown
                    yearDropdownItemNumber={100}
                    showMonthDropdown
                    dropdownMode="select"
                    className="min-w-full  border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Giới tính *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
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
                    <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
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
                    <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
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
                  <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
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
                      return;
                    }
                    if (selectedMajors.length >= 3) {
                      toast.error("Bạn chỉ có thể chọn tối đa 3 chuyên ngành");
                      return;
                    }
                    setSelectedMajors((prev) => [...prev, selected]);
                  }}
                >
                  <SelectTrigger className="mt-1 text-sm border-gray-300 w-full">
                    <SelectValue placeholder="--Chọn chuyên ngành--" />
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
                    <Button
                      variant="outline"
                      className="text-xs font-medium bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                      key={major.id}
                      onClick={() =>
                        setSelectedMajors(selectedMajors.filter((m) => m.id !== major.id))
                      }
                    >
                      {major.name}
                      
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="space-y-4">
<div className='space-y-4'>
            <h3 className='text-sm font-medium text-gray-700'>Kinh nghiệm làm việc</h3>
              <Select
              defaultValue={selectExperience?.id?.toString() || ''}
              value={selectExperience?.id?.toString() || ''}
              onValueChange={(value) => { 
                const selected = experiences.find((exp) => exp.id.toString() === value);
                setSelectExperience(selected || null);
              } 
              }
            >
              <SelectTrigger className='mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full'>
                <SelectValue placeholder='Chọn kinh nghiệm làm việc' />
              </SelectTrigger>
              <SelectContent>
                {experiences.map((exp) => (
                  <SelectItem key={exp.id} value={exp.id.toString()}>
                    {exp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Loại công việc mong muốn</Label>
                <Select
                  value={selectTypeJob?.id?.toString() || ""}
                  onValueChange={(value) => {
                    const selected = typeJobs.find((job) => job.id.toString() === value);
                    setSelectTypeJob(selected || null);
                  }}
                >
                  <SelectTrigger className="mt-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
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
                    value={expectedSalary || ""}
                    onChange={(e) => setExpectedSalary(e.target.value ? +e.target.value : null)}
                    className="mt-1 w-50 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập mức lương"
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
                <Button
                  key={skill.id}
                  variant="outline"
                  className="text-xs font-medium bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  onClick={() =>
                    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id))
                  }
                >
                  {skill.name}
                  
                </Button>
              ))}
              <Button
                variant="link"
                onClick={() => setStatusAddSkill(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Thêm kỹ năng
              </Button>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Ngôn ngữ</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLanguage.map((language) => (
                <Button
                  key={language.language.id}
                  variant="outline"
                  className="text-xs font-medium bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  onClick={() =>
                    setSelectedLanguage(
                      selectedLanguage.filter((l) => l.language.id !== language.language.id)
                    )
                  }
                >
                  {language.language.name}
                </Button>
              ))}
              <Button
                variant="link"
                onClick={() => setStatusAddLanguage(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Thêm ngôn ngữ
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleUpdateResume}
            disabled={isLoading}
            className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-full rounded-none h-12'
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </Button>
        </CardContent>
      </Card>
      <Card className="flex-1 min-w-2xl shadow-none bg-white border rounded-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Hồ sơ đính kèm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <iframe
            src={pdfFileURL}
            className="w-full h-[100vh] border rounded-md"
            title="Resume PDF"
          />
        </CardContent>
      </Card>

      {/* Skills Dialog */}
      <AlertDialog open={statusAddSkill} onOpenChange={setStatusAddSkill}>
        <AlertDialogContent className="w-4xl  p-6 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Chọn kỹ năng</h3>
            <X
              onClick={() => setStatusAddSkill(false)}
              className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            />
          </div>
          <ScrollArea className="flex flex-wrap  h-[70vh] overflow-y-auto w-full">
            {skills.map((skill) => (
              <Button
                key={skill.id}
                variant="outline"
                className={`m-1 text-xs font-medium ${
                  selectedSkills.some((s) => s.id === skill.id)
                    ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => {
                  if (selectedSkills.some((s) => s.id === skill.id)) {
                    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
                  } else {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
              >
                {skill.name}
              </Button>
            ))}
          </ScrollArea>
          <Button onClick={() => setStatusAddSkill(false)} className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-full rounded-none h-12'>
            Xong
          </Button>
        </AlertDialogContent>
      </AlertDialog>

      {/* Languages Dialog */}
      <AlertDialog open={statusAddLanguage} onOpenChange={setStatusAddLanguage}>
        
        <AlertDialogContent className="max-w-md p-6 rounded-md border border-gray-200">
        <AlertDialogHeader>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Chọn ngôn ngữ</h3>
            <X
              onClick={() => setStatusAddLanguage(false)}
              className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            />
          </div>
        </AlertDialogHeader>
          <AlertDialogDescription className="space-y-2">
            {languages.map((language) => (
              <Button
                key={language.id}
                variant="outline"
                className={`w-full text-xs font-medium ${
                  selectedLanguage.some((l) => l.language.id === language.id)
                    ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => {
                  handleClickLanguage(language);
                }}
              >
                {language.name}
              </Button>
            ))}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={() => setStatusAddLanguage(false)}
              className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-full rounded-none h-12'>
              Xong
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}