import { Dialog, DialogContent } from '@/components/ui/dialog';
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
import { Close } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { City, District } from '@/types/location';
import { Skill } from '@/types/SkillType';
import { Language, LanguageResume } from '@/types/LanguageType';
import { Education } from '@/types/educationType';
import { Level } from '@/types/levelType';
import { Major } from '@/types/majorType';
import { ResumeVersion, ResumeVersionExp } from '@/types/resumeType';
import { TypeJob } from '@/types/TypeJobType';
import { getTypeJobList } from '@/apis/typeJobAPI';

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
  const [avatar, setAvatar] = useState<File | undefined>();
  const [name, setName] = useState<string>('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level>({} as Level);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [selectedResumeVersionExps, setSelectedResumeVersionExps] = useState<ResumeVersionExp[]>([]);
  const [editResumeVersionExps, setEditResumeVersionExps] = useState<ResumeVersionExp>();
  const [statusAddResumeVersionExp, setStatusAddResumeVersionExp] = useState<boolean>(false);
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);

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
      setTypeJobs(typejobList);
      setMajors(majorList);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin');
    }
  };

  // Fetch resume data
  const fetchDataResume = async () => {
    try {
      const response = await viewResumeAPI(Number(resumeId));
      setResumeVer(response);
      setUsername(response.username);
      setEmail(response.email);
      setPhone(response.phone);
      setGender(response.gender);
      setDayOfBirth(response.dateOfBirth);
      setLocation(response.location);
      setSelectedCityId(response.district?.city?.id || '');
      setSelectedDistrictId(response.district?.id || '');
      setAbout(response.about);
      setSelectedSkills(response.skills || []);
      setSelectedLanguage(response.languageResumes || []);
      setDistricts(response.district?.city?.districts || []);
      setSelectEducation(response.education);
      setName(response.resume.name);
      setSelectedLevel(response.level);
      setSelectedMajors(response.majors || []);
      setSelectedResumeVersionExps(response.experiences || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  };

  // Handle resume update
  const handleUpdateResume = async () => {
    try {
      await updateResumeAPI(resumeVer.resume.id, {
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
        level: +resumeVer.level.id,
        languageResumes: selectedLanguage,
        avatar: avatar || resumeVer.avatar,
      });
      navigate(`/tong-quat-ho-so/ho-so/${resumeId}`);
      toast.success('Cập nhật thông tin hồ sơ thành công');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin hồ sơ');
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
  }, [selectedCityId, citys]);

  return (
    <>
      <Card className='p-0'>
        <CardHeader className='p-0'>
          <CardTitle className='text-2xl font-bold text-gray-800 px-6 pt-4 pb-3'>
            Cập nhật hồ sơ xin việc
          </CardTitle>
          <hr />
        </CardHeader>
        <CardContent className='p-6 space-y-4 grid grid-cols-7 gap-4'>
          <div className='col-span-2 mx-auto flex flex-col items-center'>
            <Avatar className='w-30 h-30'>
              <AvatarImage src={avatar ? URL.createObjectURL(avatar) : resumeVer.avatar} />
            </Avatar>
            <div className='flex items-center justify-center mt-2'>
              <Label htmlFor='avatar' className='cursor-pointer text-sm font-semibold text-blue-600 hover:underline'>
                Ảnh đại diện
              </Label>
              <Input
                id='avatar'
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatar(file);
                  }
                }}
                className='hidden'
              />
            </div>
          </div>
          <div className='col-span-5 space-y-4'>
            <Label htmlFor='user-name' className='text-sm font-semibold'>
              Họ và tên
            </Label>
            <Input id='user-name' autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />

            <Label htmlFor='name' className='text-sm font-semibold'>
              Chức vụ
            </Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Nhập chức vụ hoặc vị trí công việc mong muốn'
            />

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='email' className='text-sm font-semibold'>
                  Email
                </Label>
                <Input id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='phone' className='text-sm font-semibold'>
                  Số điện thoại
                </Label>
                <Input id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='dob' className='text-sm font-semibold'>
                  Ngày sinh
                </Label>
                <Input
                  id='dob'
                  type='date'
                  value={dayOfBirth}
                  onChange={(e) => setDayOfBirth(e.target.value)}
                />
              </div>
              <div>
                <Label className='text-sm font-semibold'>Giới tính</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='NAM'>Nam</SelectItem>
                    <SelectItem value='NU'>Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

              <div>
                <Label htmlFor='majors' className='text-sm font-semibold'>
                  Chuyên ngành
                </Label>
              <Select
                  defaultValue={selectedMajors.length > 0
                    ? selectedMajors.map(major=>{
                      return <>
                        <span  key={major.id} className='text-sm font-semibold bg-red-50 text-red-700 py-1 px-4 '>
                          {major.name}
                        </span>
                      </>;
                    })
                    : 'Chọn ngành nghề'}
                  onValueChange={(value) => {
                    const selected = majors.filter((major) => major.id.toString() === value);
                    if (selected.length === 0) return;
                    const existingMajor = selectedMajors.find((m) => m.id === +value);
                    if (existingMajor) {
                      setSelectedMajors((prev) => prev.filter((m) => m.id !== +value));
                      return;
                    }
                    if( selectedMajors.length >=3){
                      toast.error('Bạn chỉ có thể chọn tối đa 3 ngành nghề');
                      return;
                    }
                    setSelectedMajors((prev) => [...prev, {
                      id: +value,
                      name: selected.length > 0 ? selected[0].name : '',
                    }]);
                  }}
                >
                  <SelectTrigger className='w-full p-0.5 rounded-none'>
                    <SelectValue>
                      {selectedMajors.length > 0
                        ? selectedMajors.map(major=>{
                          return <>
                            <span  key={major.id} className='text-sm font-semibold bg-red-50 text-red-700 py-1 px-4 '>
                              {major.name}
                            </span>
                          </>;
                        })
                        : 'Chọn ngành nghề'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major.id} value={major.id.toString()}>
                        {major.name}
                        {
                          selectedMajors.some((m) => m.id === major.id) && (
                            <X
                              className='ml-2 inline cursor-pointer text-red-600'
                              onClick={() => {
                                setSelectedMajors((prev) =>
                                  prev.filter((m) => m.id !== major.id)
                                );
                              }}
                            />
                          )
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='level' className='text-sm font-semibold'>
                  Trình độ
                </Label>
                <Select
                  value={selectedLevel?.name}
                  onValueChange={(value) => {
                    const select = levels.find((level) => level.name === value);
                    if (select) {
                      setSelectedLevel(select);
                    }
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn trình độ' />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.name}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='city' className='text-sm font-semibold'>
                  Thành phố
                </Label>
                <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn thành phố' />
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
                <Label htmlFor='district' className='text-sm font-semibold'>
                  Quận/Huyện
                </Label>
                <Select value={selectedDistrictId} onValueChange={setSelectedDistrictId}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn quận/huyện' />
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
              <div className='col-span-2'>
                <Label htmlFor='address' className='text-sm font-semibold'>
                  Địa chỉ chi tiết
                </Label>
                <Input
                  id='address'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder='Nhập địa chỉ chi tiết (số nhà, đường, phường...)'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='description' className='text-sm font-semibold'>
                Giới thiệu bản thân
              </Label>
              <Textarea
                id='description'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder='Nhập mô tả về bản thân, kỹ năng, sở thích...'
                className='mt-2 min-h-32 h-fit resize-none rounded-sm border-gray-300 focus:ring-none focus:shadow-none'
              />
            </div>

            <div>
              <Label htmlFor='education' className='text-sm font-semibold'>
                Trình độ học vấn
              </Label>
              <Select
                value={selectEducation?.name}
                onValueChange={(value) => {
                  const select = educations.find((edu) => edu.id === +value);
                  if (select) {
                    setSelectEducation(select);
                  }
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue>{selectEducation?.name || 'Chọn trình độ học vấn'}</SelectValue>
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
              <Label htmlFor='skills' className='text-sm font-semibold'>
                Kỹ năng
              </Label>
              <div className='flex gap-2 flex-wrap'>
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant='outline'
                    className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                  >
                    <span>{skill.name}</span>
                  </Badge>
                ))}
                <Badge
                  onClick={() => setStatusAddSkill(true)}
                  variant='outline'
                  className='text-sm px-3 py-1 rounded-full border border-red-300 text-red-600 bg-red-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                >
                  + Thêm kỹ năng
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor='languages' className='text-sm font-semibold'>
                Ngôn ngữ
              </Label>
              <div className='flex gap-2 flex-wrap'>
                {selectedLanguage.map((language) => (
                  <Badge
                    key={language.id}
                    variant='outline'
                    className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                  >
                    {language.language.name} - {language.level}
                  </Badge>
                ))}
                <Badge
                  onClick={() => setStatusAddLanguage(true)}
                  variant='outline'
                  className='text-sm px-3 py-1 rounded-full border border-red-300 text-red-600 bg-red-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                >
                  + Thêm ngôn ngữ
                </Badge>
              </div>
              <div>
              <Label htmlFor='resume-exp' className='text-sm font-semibold'>
                Kinh nghiệm làm việc
              </Label>
              <Badge
                onClick={() => setStatusAddResumeVersionExp(!statusAddResumeVersionExp)}
                variant={'outline'}
                className='text-sm px-3 py-1 rounded-full border border-red-300 text-red-600 bg-red-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
              >
                + Thêm kinh nghiệm
              </Badge>
              <Card className='bg-transparent border-red border-1 shadow-none mt-2 p-0'>
              {
                selectedResumeVersionExps.length > 0 && selectedResumeVersionExps.map((exp, index) => <>
                  <CardContent key={index} className='border-b border-gray-200 p-2'>
                  <div className='text-xl font-bold'>{exp.position}</div>
                      <div className='text-sm font-semibold'>{exp.companyName}</div>
                      <div className='text-sm text-gray-600'>
                        {exp.endTime} - {exp.endTime}
                      </div>
                    <div className='text-sm text-gray-600'>{exp.jobDescription}</div>
                  </CardContent>
                </>)
                }
              </Card>
            </div>
              </div>
            </div>
          <Button variant='default' className='w-full mt-4' onClick={handleUpdateResume}>
            Cập nhật hồ sơ
          </Button>
        </CardContent>
    </Card >
      

      {/* Skills Dialog */}
      <Dialog open={statusAddSkill} onOpenChange={setStatusAddSkill}>
        <DialogContent className='max-w-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Chọn kỹ năng</h2>
            <Close onClick={() => setStatusAddSkill(false)} className='w-5 h-5 text-gray-500 cursor-pointer' />
          </div>
          <div className='flex gap-2 flex-wrap'>
            {selectedSkills.map((skill) => (
              <Badge key={skill.id} variant='outline'>
                {skill.name}
              </Badge>
            ))}
          </div>
          <hr />
          <div className='grid grid-cols-3 gap-4'>
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
                className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
              >
                <span>{skill.name}</span>
                {selectedSkills.some((s) => s.id === skill.id) && <X className='w-4 h-4 ml-2 text-red-600' />}
              </Badge>
            ))}
          </div>
          <div className='mt-4 flex justify-end'>
            <Button variant='default' onClick={() => setStatusAddSkill(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Languages Dialog */}
      <Dialog open={statusAddLanguage} onOpenChange={setStatusAddLanguage}>
        <DialogContent className='max-w-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Chọn ngôn ngữ</h2>
            <Close onClick={() => setStatusAddLanguage(false)} className='w-5 h-5 text-gray-500 cursor-pointer' />
          </div>
          <div className='flex gap-2 mb-2 flex-wrap'>
            {selectedLanguage.map((language) => (
              <Badge
                key={language.id}
                variant='outline'
                className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
              >
                {language.language.name} - {language.level}
              </Badge>
            ))}
          </div>
          <hr />
          <div className='grid grid-cols-3 gap-4'>
            {languages.map((language) => (
              <Badge
                key={language.id}
                variant={selectedLanguage.some((l) => l.language.id === language.id) ? 'default' : 'outline'}
                onClick={() => {
                  if (selectedLanguage.some((l) => l.language.id === language.id)) {
                    setSelectedLanguage(selectedLanguage.filter((l) => l.language.id !== language.id));
                  } else {
                    setSelectedLanguage([
                      ...selectedLanguage,
                      {
                        languageId: language.id,
                        language,
                        level: 1,
                      },
                    ]);
                  }
                }}
                className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer w-full'
              >
                <span>{language.name}</span>
                {selectedLanguage.some((l) => l.language.id === language.id) && (
                  <X className='w-4 h-4 ml-2 text-red-600' />
                )}
              </Badge>
            ))}
          </div>
          <div className='mt-4 flex justify-end'>
            <Button variant='default' onClick={() => setStatusAddLanguage(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
          <Dialog open={statusAddResumeVersionExp} onOpenChange={setStatusAddResumeVersionExp}>
            <DialogContent className='max-w-2xl p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold'>Thêm kinh nghiệm làm việc</h2>
                <Close onClick={() => setStatusAddResumeVersionExp(false)} className='w-5 h-5 text-gray-500 cursor-pointer' />
              </div>
      
              <Label className='text-sm font-semibold'>Chọn loại công việc</Label>
              <Select
                onValueChange={(value) => {
                  const selectedTypeJob = typeJobs.find(job => job.id.toString() === value);
                  if (selectedTypeJob) {
                    setEditResumeVersionExps({
                      ...editResumeVersionExps,
                      typeJob: selectedTypeJob,
                    } as ResumeVersionExp);
                  }
                }}
                defaultValue={editResumeVersionExps?.typeJob.id.toString() || ''}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Chọn loại công việc' />
                </SelectTrigger>
                <SelectContent>
                  {typeJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className='text-sm font-semibold mt-4'>Tên công ty</Label>
              <Input
                value={editResumeVersionExps?.companyName || ''}
                onChange={(e) => {
                  setEditResumeVersionExps({
                    ...editResumeVersionExps,
                    companyName: e.target.value,
                  } as ResumeVersionExp);
                }}
                placeholder='Nhập tên công ty'
              />
              <Label className='text-sm font-semibold mt-4'>Vị trí công việc</Label>
              <Input
                value={editResumeVersionExps?.position || ''}
                onChange={(e) => {
                  setEditResumeVersionExps({
                    ...editResumeVersionExps,
                    position: e.target.value,
                  } as ResumeVersionExp);
                }}
                placeholder='Nhập vị trí công việc'
              />
              <Label className='text-sm font-semibold mt-4'>Thời gian làm việc</Label>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  type='date'
                  value={editResumeVersionExps?.startTime || ''}
                  onChange={(e) => {
                    setEditResumeVersionExps({
                      ...editResumeVersionExps,
                      startTime: e.target.value,
                    } as ResumeVersionExp);
                  }}
                  placeholder='Ngày bắt đầu'
                />
                <Input
                  type='date'
                  value={editResumeVersionExps?.endTime || ''}
                  onChange={(e) => {
                    setEditResumeVersionExps({
                      ...editResumeVersionExps,
                      endTime: e.target.value,
                    } as ResumeVersionExp);
                  }}
                  placeholder='Ngày kết thúc'
                />
              </div>
              <Label className='text-sm font-semibold mt-4'>Mô tả công việc</Label>
              <Textarea
                value={editResumeVersionExps?.jobDescription || ''}
                onChange={(e) => {
                  setEditResumeVersionExps({
                    ...editResumeVersionExps,
                    jobDescription: e.target.value,
                  });
                }}
                placeholder='Nhập mô tả công việc'
                className='mt-2 min-h-32 h-fit resize-none rounded-sm border-gray-300 focus:ring-none focus:shadow-none'
              />
              <Button
                variant='default'
                onClick={() => {
                  setStatusAddResumeVersionExp(false);
                  if (editResumeVersionExps) {
                    setSelectedResumeVersionExps([...selectedResumeVersionExps, editResumeVersionExps]);
                    setEditResumeVersionExps(undefined);
                  } else {
                    toast.error('Vui lòng điền đầy đủ thông tin kinh nghiệm làm việc');
                  }
                }}
              >
                Đóng
              </Button>
            </DialogContent>
          </Dialog>
    </>
  );
}