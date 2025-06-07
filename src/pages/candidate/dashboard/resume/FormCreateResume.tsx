/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { Education } from '@/types/educationType';
import { getAllEducations } from '@/apis/educationAPI';
import { createResumeAPI } from '@/apis/resumeAPI';
import { getListMajorAPI } from '@/apis/majorAPI';
import { Major } from '@/types/majorType';
import { useAccount } from '@/providers/UserProvider';

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
  const [avatar, setAvatar] = useState<File | string>('');
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);

  const fetchElements = async () => {
      try {
        const [cityList, skillList, languageList, educationList, majorsList] = await Promise.all([
          getCityList(),
          getSkillList(),
          getAllLanguages(),
          getAllEducations(),
          getListMajorAPI()
        ]);
        setCitys(cityList);
        setSkills(skillList);
        setLanguages(languageList);
        setEducations(educationList);
        setMajors(majorsList);
        setAvatar(dataUser?.avatar || '');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi tải thông tin');
      }
  }
  const handleCreateResume = async () => {
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
        languageResumes: selectedLanguage.map(lang => ({
          languageId: lang.language.id,
          level: lang.level,
        })),
      });
      toast.success('Tạo hồ sơ thành công');
    }
    catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(error.response?.data?.message || 'Lỗi khi tạo hồ sơ');
      console.error('Error creating resume:', error);
    }
  }
  
  
    useEffect(() => {
      fetchElements();
    }, []);

    useEffect(() => {
      const selectedCity = citys.find(city => city.id === selectedCityId);
      if (selectedCity) {
        setDistricts(selectedCity.districts);
      } else {
        setDistricts([]);
      }
    }, [selectedCityId, citys]);
  
  return <>
            <Card className='p-0 '>
          <CardHeader className='p-0'>
            <CardTitle className='text-2xl font-bold text-gray-800 px-6 pt-4 pb-3'>
              Cập nhật hồ sơ xin việc
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent className='p-6 space-y-4 grid grid-cols-7 gap-4 '>
            <div className='col-span-2 mx-auto flex flex-col items-center'>
              <Avatar className='w-24 h-24 mb-2'>
            <AvatarImage
              src={
                typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)
              }
            />
          </Avatar>
              <Input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatar(file);
                  }
                }}
                className='hidden'
              id='avatar-upload'
          />
            <Label
            htmlFor='avatar-upload'
            className='cursor-pointer text-sm font-semibold text-blue-600 hover:underline'
          >
                Tải lên ảnh đại diện
              </Label>
              
            </div>
            <div className='col-span-5 space-y-4'>
              <Label htmlFor='user-name' className='text-sm font-semibold'>Họ và tên</Label>
              <Input id='user-name' autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
              <Label htmlFor='name' className='text-sm font-semibold'>Chức vụ</Label>
              <Input id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Nhập chức vụ hoặc vị trí công việc mong muốn'
              />
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='email' className='text-sm font-semibold'>Email</Label>
                  <Input id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor='phone' className='text-sm font-semibold'>Số điện thoại</Label>
                  <Input id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor='dob' className='text-sm font-semibold'>Ngày sinh</Label>
                  <Input
                    id='dob'
                    type='date'
                    value={dateOfBirth}
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
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='city' className='text-sm font-semibold'>Thành phố</Label>
                  <Select
                    value={selectedCityId}
                    onValueChange={(value) => setSelectedCityId(value)}
                  >
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
                  <Label htmlFor='district' className='text-sm font-semibold'>Quận/Huyện</Label>
                  <Select
                    defaultValue={selectedDistrictId}
                    value={selectedDistrictId}
                    onValueChange={(value) => setSelectedDistrictId(value)}
                  >
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
                  <Label htmlFor='address' className='text-sm font-semibold'>Địa chỉ chi tiết</Label>
                  <Input id='address' value={location}
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
            <Label htmlFor='education' className='text-sm font-semibold'>
                Trình độ học vấn
            </Label>
            <Select
              value={selectEducation?.name}
              onValueChange={(value) => {
                console.log(value);
                const select = educations.find(edu => edu.id === +value);
                if (select) {
                  setSelectEducation(select);
                }
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue>
                  {selectEducation ? selectEducation.name : 'Chọn trình độ học vấn'}
                </SelectValue>
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
                  {selectedSkills.map((skill, index) => (
                    <Badge
                      variant={'outline'}
                      key={index}
                        
                      className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                    >
                      <span>{skill.name}</span>
                    </Badge>
                  ))}
                  <Badge
                    onClick={() => setStatusAddSkill(!statusAddSkill)}
                    variant={'outline'}
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
                  {
                    selectedLanguage.length > 0 && selectedLanguage.map((language, index) => (
                      <Badge
                        variant={'outline'}
                        key={index}
                        className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                      >
                        {language.language.name} - {language.level}
                      </Badge>
                    ))
                  }
                  <Badge
                    onClick={() => setStatusAddLanguage(!statusAddLanguage)}
                    variant={'outline'}
                    className='text-sm px-3 py-1 rounded-full border border-red-300 text-red-600 bg-red-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                  >
                    + Thêm ngôn ngữ
                  </Badge>
                </div>

              </div>
        </div>
        <Button 
          variant='default'
          className='w-full mt-4'
          onClick={handleCreateResume}
        >
          Tạo hồ sơ
        </Button>
          </CardContent>
        </Card>
    <Dialog open={statusAddSkill} onOpenChange={setStatusAddSkill}>
      <DialogContent className='max-w-2xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Chọn kỹ năng</h2>
          <Close onClick={() => setStatusAddSkill(false)} className='w-5 h-5 text-gray-500 cursor-pointer' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {
            selectedSkills.length > 0 && selectedSkills.map((skill) => (
              <Badge
                key={skill.id}
              >
                {skill.name}
              </Badge>
            ))
          }
        </div>
        <hr />
        <div className='grid grid-cols-3 gap-4'>
          {skills.map((skill) => (
            <Badge
              key={skill.id}
              variant={selectedSkills.some(s => s.id === skill.id) ? 'default' : 'outline'}
              onClick={() => {
                if (selectedSkills.some(s => s.id === skill.id)) {
                  setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
                } else {
                  setSelectedSkills([...selectedSkills, skill]);
                }
              }}
              className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
            >
              <span>{skill.name}</span>
              {selectedSkills.some(s => s.id === skill.id) && (
                <X className='w-4 h-4 ml-2 text-red-600' />
              )}
            </Badge>
          ))}
        </div>
        <div className='mt-4 flex justify-end'>
          <Button
            variant='default'
            onClick={() => {
              setStatusAddSkill(false);
            }}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={statusAddLanguage} onOpenChange={setStatusAddLanguage}>
      <DialogContent className='max-w-2xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Chọn ngôn ngữ</h2>
          <Close onClick={() => setStatusAddLanguage(false)} className='w-5 h-5 text-gray-500 cursor-pointer' />
        </div>
        <div>
          <div className='flex gap-2 mb-2 flex-wrap'>
            {selectedLanguage.length > 0 && selectedLanguage.map((language,indx) => (
              <Badge
                key={indx}
                variant='outline'
                className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
              >
                {language.language.name} - {language.level}
              </Badge>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          {languages.map((language) => (
            <Badge
              key={language.id}
              onClick={() => {
                if (selectedLanguage.some(l => l.language.id === language.id)) {
                  setSelectedLanguage(selectedLanguage.filter(l => l.language.id !== language.id));
                } else {
                  setSelectedLanguage([...selectedLanguage, {
                    languageId: language.id,
                    language,
                    level: 1,
                  }]);
                }
              }}
              className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer w-full'
            >
              <span>{language.name}</span>
              {selectedLanguage.some(l => l.language.id === language.id) && (
                <X className='w-4 h-4 ml-2 text-red-600' />
              )}
            </Badge>
          ))}
        </div>
        <div className='mt-4 flex justify-end'>
          <Button
            variant='default'
            onClick={() => {
              setStatusAddLanguage(false);
            }}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
}