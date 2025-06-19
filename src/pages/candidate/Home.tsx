/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Flashlight, 
  MapPin, 
  Search, 
  SearchIcon, 
  TrendingUp,
  Clock,
  Briefcase,
  Gift,
  Award,
  RotateCcw,
  BriefcaseIcon, 
  FlameIcon,
  DollarSignIcon,
  CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';

import { getCityList } from '@/apis/cityAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import { filterJob, getJobBanner } from '@/apis/jobAPI';
import { iconMap } from '@/utils/SetListIcon';

import JobList from '@/components/elements/job/job-list/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { City } from '@/types/location';
import { Level } from '@/types/levelType';
import { JobFilterRequest, JobFilterResponse } from '@/types/jobType';
import { Experience } from '@/types/experienceType';
import { TypeJob } from '@/types/typeJobType';
import { Benefit } from '@/types/benefitType';
import { getBenefit } from '@/apis/benefitAPI';
import { getSkillList } from '@/apis/skillAPI';
import { Skill } from '@/types/skillType';
import JobItem from '@/components/elements/job/job-list/JobItem';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/types/majorType';
import { getFieldList } from '@/apis/fieldAPI';
import { convertDateToDiffTime } from '@/utils/dateTime';
import dayjs from 'dayjs';

export default function Home() {
  const [countJobs, setCountJobs] = useState(0);
  const [jobList, setJobList] = useState<JobFilterResponse[]>([]);

  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [citySelected, setSelectedCity] = useState<City>();

  const [levelOptions, setLevelOptions] = useState<Level[]>([]);
  const [selectLevels, setSelectLevel] = useState<string[]>([]);

  const [experienceOptions, setExperienceOptions] = useState<Experience[]>([]);
  const [selectExperience, setSelectExperience] = useState<number[]>([]);

  const [typeOptions, setTypeOptions] = useState<TypeJob[]>([]);
  const [selectType, setSelectType] = useState<number[]>([]);

  const [benefitOptions, setBenefitOptions] = useState<Benefit[]>([]);
  const [selectBenefits, setSelectBenefits] = useState<string[]>([]);

  const [skillOption, setSkillOptions] = useState<Skill[]>([]);
  const [selectSkills, setSelectSkills] = useState<number[]>([]);

  const [search, setSearch] = useState<string>('');
  const [fields, setFields] = useState<Field[]>([]);

  const [jobsBanner, setJobsBanner] = useState<JobFilterResponse[]>([]);

  useEffect(() => {
    fetchInitialData();
    fetchJobList({} as JobFilterRequest);
  }, []);

  useEffect(() => {
    handleFilter();
  }, [selectLevels,selectExperience, selectType, selectBenefits, selectSkills]);


  const fetchInitialData = async () => {
    try {
      const [cities, levels, types, experiences, benefits, skills, fields, jobsBanner] = await Promise.all([
        getCityList(),
        getLevelList(),
        getTypeJobList(),
        getExperienceList(),
        getBenefit(),
        getSkillList(),
        getFieldList(),
        getJobBanner(),
      ]);
      setCityOptions(cities);
      setLevelOptions(levels);
      setTypeOptions(types);
      setExperienceOptions(experiences);
      setBenefitOptions(benefits);
      setSkillOptions(skills);
      setFields(fields);
      setJobsBanner(jobsBanner);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchJobList = async (filter: JobFilterRequest) => {
    try {
      const response = await filterJob(filter);
      setJobList(response.data);
      setCountJobs(response.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách công việc');
    }
  };

  const handleFilter = async () => {
    await fetchJobList({
      search,
      levels: selectLevels,
      experience: selectExperience,
      typeJobs: selectType,
      skills: selectSkills,
      benefits: selectBenefits,
      citys: citySelected ? [citySelected.id] : undefined,
    } as JobFilterRequest);
  };

  const toggleType = (id: number) => {
    if (selectType.includes(id)) {
      setSelectType(selectType.filter(typeId => typeId !== id));
    } else {
      setSelectType([...selectType, id]);
    }
  }

  const toggleLevel = (id: string) => {
    if (selectLevels.includes(id)) {
      setSelectLevel(selectLevels.filter(levelId => levelId !== id));
    } else {
      setSelectLevel([...selectLevels, id]);
    }
  }

  const toggleExperience = (id: number) => {
    if (selectExperience.includes(id)) {
      setSelectExperience(selectExperience.filter(expId => expId !== id));
    } else {
      setSelectExperience([...selectExperience, id]);
    }
  }
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      nextRef.current?.click();
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  const handleResetFilter = () => {
    setSearch('');
    setSelectedCity(undefined);
    setSelectLevel([]);
    setSelectExperience([]);
    setSelectType([]);
    setSelectBenefits([]);
    setSelectSkills([]);
    setCountJobs(0);
    setJobList([]);
    fetchJobList({} as JobFilterRequest);
  };
  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <div className='bg-[#fbfaff] min-h-screen '>
      <div className='w-full '>
        <img src='https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fcdn1.vieclam24h.vn%2Fimages%2Fseeker-banner%2F2025%2F05%2F16%2Fbanner-cts-timdungviec-pc_174740689238.jpg&w=1920&q=75'
          className='w-full h-[250px] object-cover ' alt='Banner' />  
      </div>
      <div className='flex items-center justify-center gap-1 h-fit p-1 absolute top-[240px] left-1/2 -translate-x-1/2 z-10 rounded-md w-7xl bg-white shadow-xl border border-gray-100'>
        <div className='bg-white rounded-none p-1.5 flex-1 max-w-[600px] border-none '>
          <SearchIcon className='text-[#451da1] w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2' />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-full bg-transparent border-none text-xl font-semibold p-3
            focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400'
            placeholder='Nhập từ khóa tìm kiếm việc làm, ví dụ: "Lập trình viên"'
          />
        </div>
        <Select
          value={fields.length > 0 ? fields[0].name : 'undefinded'}
          onValueChange={value => {
            const selectedField = fields.find(field => field.name === value);
            setFields(selectedField ? [selectedField] : []);
          }}
        >
          <Button variant='ghost' className='w-[200px] p-0 rounded-none bg-white hover:bg-white border-l-1 border-gray-200'>
            <SelectTrigger className='w-full h-full text-left px-4 border-none'>
              <SelectValue
                placeholder={
                  <span className='flex items-center gap-2 text-gray-600'>
                    <Flashlight className='w-4 h-4' />
                    Chọn lĩnh vực
                  </span>
                }
              />
            </SelectTrigger>
          </Button>
          <SelectContent>
            <SelectItem value={'undefinded'}>
              <span className='text-gray-600'>Tất cả lĩnh vực</span>
            </SelectItem>
            {fields.map(field => (
              <SelectItem key={field.id} value={field.name}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={citySelected?.name}
          onValueChange={value => {
            const selected = cityOptions.find(c => c.name === value);
            setSelectedCity(selected);
          }}
        >
          <Button variant='ghost' className='w-[200px] p-0 rounded-none bg-white hover:bg-white border-l-1 border-gray-200'>
            <SelectTrigger className='w-full h-full text-left px-4 border-none'>
              <SelectValue
                placeholder={
                  <span className='flex items-center gap-2 text-gray-600'>
                    <MapPin className='w-4 h-4' />
                    Chọn Thành Phố
                  </span>
                }
              />
            </SelectTrigger>
          </Button>
          <SelectContent>
            <SelectItem value={'undefinded'}>
            <span className='text-gray-600'>Tất cả thành phố</span>
            </SelectItem>
  
            {cityOptions.map(city => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant='ghost'
          className='  w-[200px] bg-[#451e99] rounded-sm text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#451e99] hover:text-white'
          onClick={handleFilter}
        >
          <Search />
          <span className='text-white'>Tìm kiếm</span>
        </Button>
      </div>

      <div className=' rounded-md p-4  bg-white flex justify-between items-center shadow-xl w-7xl mx-auto'>
        <NavigationMenu >
          <NavigationMenuList>
            {/* Cấp bậc */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#451e99]" />
                {
                  selectLevels.length > 0
                    ? `Cấp bậc (${selectLevels.length})`
                    : 'Cấp bậc'
                }
              </NavigationMenuTrigger>
              <NavigationMenuContent className='bg-white gap-3 grid grid-cols-2 min-w-[500px] max-w-[500px]'>
                {levelOptions.map(level => (
                  <Label
                    key={level.id}
                    className='p-1'
                  >
                    <Checkbox
                      checked={selectLevels.includes(level.id)}
                      onCheckedChange={() =>
                        toggleLevel(level.id)
                      }
                    />
                    <span className='text-[#451e99]'>{level.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Kinh nghiệm */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#451e99]" />
                {
                  selectExperience.length > 0
                    ? `Kinh nghiệm (${selectExperience.length})`
                    : 'Kinh nghiệm'
                }
              </NavigationMenuTrigger>
              <NavigationMenuContent className='bg-white grid min-w-[500px] p-2'>
                {experienceOptions.map(exp => (
                  <Label
                    key={exp.id}
                    className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                  >
                    <Checkbox
                      checked={selectExperience.includes(exp.id)}
                      onCheckedChange={() =>
                        toggleExperience(exp.id)
                      }
                    />
                    <span className='text-[#451e99]'>{exp.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Loại công việc */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#451e99]" />
                {
                  selectType.length > 0
                    ? `Loại công việc (${selectType.length})`
                    : 'Loại công việc'
                }
              </NavigationMenuTrigger>
              <NavigationMenuContent className='bg-white grid min-w-[500px] p-2'>
                {typeOptions.map(type => (
                  <Label
                    key={type.id}
                    className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                  >
                    <Checkbox
                      checked={selectType.includes(type.id)}
                      onCheckedChange={() =>
                        toggleType(type.id)
                      }
                    />
                    <span className='text-[#451e99]'>{type.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Phúc lợi */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#451e99]" />
                {
                  selectBenefits.length > 0
                    ? `Phúc lợi (${selectBenefits.length})`
                    : 'Phúc lợi'
                }
              </NavigationMenuTrigger>
              <NavigationMenuContent className='bg-white grid grid-cols-2 min-w-[500px] p-2'>
                {benefitOptions.map(benefit => (
                  <Label
                    key={benefit.id}
                    className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                  >
                    <Checkbox
                      checked={selectBenefits.includes(benefit.id)}
                      onCheckedChange={() =>
                        setSelectBenefits(prev =>
                          prev.includes(benefit.id)
                            ? prev.filter(id => id !== benefit.id)
                            : [...prev, benefit.id]
                        )
                      }
                    />
                    <div className='flex items-center gap-2 p-1'>
                      {iconMap[benefit.icon]} 
                      <span className='text-[#451e99]'>{benefit.name}</span>
                    </div>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Kỹ năng */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#451e99]" />
                {
                  selectSkills.length > 0
                    ? `Kỹ năng (${selectSkills.length})`
                    : 'Kỹ năng'
                }
              </NavigationMenuTrigger>
              <NavigationMenuContent className='bg-white grid grid-cols-4 min-w-[900px] p-2'>
                {skillOption.map(skill => (
                  <Label
                    key={skill.id}
                    className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                  >
                    <Checkbox
                      checked={selectSkills.includes(+skill.id)}
                      onCheckedChange={() =>
                        setSelectSkills(prev =>
                          prev.includes(+skill.id)
                            ? prev.filter(id => +id !== +skill.id)
                            : [...prev, +skill.id]
                        )
                      }
                    />
                    <span className='text-[#451e99]'>{skill.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button
          variant='destructive'
          className='bg-[#451da1] px-7 py-1 hover:bg-gray-100  font-semibold border border-gray-300 hover:text-black text-white flex items-center gap-2'
          onClick={handleResetFilter}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại bộ lọc</span>
        </Button>
      </div>
      <Card className="w-7xl mx-auto mt-4 p-3 bg-transparent shadow-none">
  <CardHeader className="text-center">
    <CardTitle className="text-2xl font-bold text-red-500 flex justify-center items-center gap-2">
      <FlameIcon className="text-red-500  w-10 h-10" />
      Việc làm tuyển gấp
    </CardTitle>
  </CardHeader>

  <CardContent className="p-6">
    <Carousel>
      <CarouselContent>
        {jobsBanner.length > 0 &&
          chunkArray(jobsBanner, 6).map((jobGroup, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobGroup.map((job) => (
                  <Card
                    key={job.id}
                    className="shadow-sm p-4 border border-gray-200 hover:border-[#2c95ff] transition-all duration-200 cursor-pointer rounded-lg"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={job.employer.logo}
                        alt={job.employer.name}
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {job.employer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.employer.businessType}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-1">
                      <BriefcaseIcon className="h-4 w-4 text-[#2c95ff] mt-0.5" />
                      <div className="text-sm font-semibold text-gray-900">
                        {job.name}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-1 text-xs text-gray-700 font-medium">
                      <DollarSignIcon className="h-3.5 w-3.5 text-green-600 mt-0.5" />
                      {job.minSalary && job.maxSalary
                        ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} VNĐ`
                        : 'Thoả thuận'}
                    </div>

                    <div className="flex items-start gap-2 mt-1 text-xs text-gray-500 font-medium">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                      <span>{convertDateToDiffTime(job.createdAt)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext ref={nextRef} />
    </Carousel>
  </CardContent>
</Card>

      {/* Header kết quả */}
      <div className=' rounded-md p-4 mt-40 border border-gray-300 flex justify-between items-center shadow-sm w-7xl mx-auto '>
        <h3 className='font-semibold text-lg text-gray-800'>
          Tìm thấy {countJobs} việc làm
        </h3>
      </div>
      {/* Danh sách việc làm */}
      <JobList jobs={jobList} />
    </div>
  );
}