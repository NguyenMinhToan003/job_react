/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

import { getCityList } from '@/apis/cityAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import { filterJob } from '@/apis/jobAPI';
import { iconMap } from "@/utils/SetListIcon";

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

  useEffect(() => {
    fetchInitialData();
    fetchJobList({} as JobFilterRequest);
  }, []);

  useEffect(() => {
    handleFilter();
  }, [selectLevels,selectExperience, selectType, selectBenefits, selectSkills]);


  const fetchInitialData = async () => {
    try {
      const [cities, levels, types, experiences, benefits, skills] = await Promise.all([
        getCityList(),
        getLevelList(),
        getTypeJobList(),
        getExperienceList(),
        getBenefit(),
        getSkillList()
      ]);
      setCityOptions(cities);
      setLevelOptions(levels);
      setTypeOptions(types);
      setExperienceOptions(experiences);
      setBenefitOptions(benefits);
      setSkillOptions(skills);
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

  return (
    <div className='bg-[#f7f7f7] min-h-screen'>
      {/* Banner tìm kiếm */}
      <div className='h-[400px] bg-gradient-to-r from-[#121212] to-[#53151c] flex gap-2 items-center justify-center px-4'>
        <Select
          value={citySelected?.name}
          onValueChange={value => {
            const selected = cityOptions.find(c => c.name === value);
            setSelectedCity(selected);
          }}
        >
          <Button variant='secondary' className='h-[54px] w-[200px] p-0'>
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

        <div className='bg-white rounded-sm p-1.5 flex-1 max-w-[600px] border-2 border-orange-800 shadow-sm'>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-full bg-transparent border-none text-xl font-medium text-orange-900 p-3'
            placeholder='Nhập từ khóa tìm kiếm...'
          />
        </div>

        <Button
          variant='destructive'
          className='h-[54px] text-base bg-[#ed1b2f] w-[200px]'
          onClick={handleFilter}
        >
          <Search />
          <span className='text-green-900'>Tìm kiếm</span>
        </Button>
      </div>

      {/* Header kết quả */}
      <div className=' rounded-md p-4 mt-4 border border-gray-300 flex justify-between items-center shadow-sm w-7xl mx-auto'>
        <h3 className='font-semibold text-lg text-gray-800'>
          Tìm thấy {countJobs} việc làm
        </h3>
      </div>

      {/* Bộ lọc */}
      <div className=' rounded-md p-4 mt-4 border border-gray-300 flex justify-between items-center shadow-sm w-7xl mx-auto'>
        <NavigationMenu >
          <NavigationMenuList>
            {/* Cấp bậc */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={` ${
                  selectLevels.length > 0
                    ? 'bg-yellow-300 '
                    : 'text-orange-700 '
                }`}
              >{
                selectLevels.length > 0
                  ? `Cấp bậc (${selectLevels.length})`
                  : 'Cấp bậc'
              }</NavigationMenuTrigger>
              <NavigationMenuContent className='gap-3 grid grid-cols-2 min-w-[500px] max-w-[500px]'>
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
                    <span className='text-green-900'>{level.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Kinh nghiệm */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={` ${
                  selectExperience.length > 0
                    ? 'bg-yellow-300 '
                  : 'text-orange-700 '
                }`}
              >{
                selectExperience.length > 0
                  ? `Kinh nghiệm (${selectExperience.length})`
                  : 'Kinh nghiệm'
              }</NavigationMenuTrigger>
              <NavigationMenuContent className='grid min-w-[500px] p-2'>
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
                    <span className='text-green-900'>{exp.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Loại công việc */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={` ${
                  selectType.length > 0
                    ? 'bg-yellow-300 '
                    : 'text-orange-700 '
                }`}
              >{
                selectType.length > 0
                  ? `Loại công việc (${selectType.length})`
                  : 'Loại công việc'
              }</NavigationMenuTrigger>
              <NavigationMenuContent className='grid min-w-[500px] p-2'>
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
                    <span className='text-green-900'>{type.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Phúc lợi */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={` ${
                  selectBenefits.length > 0
                    ? 'bg-yellow-300 '
                    : 'text-orange-700 '
                }`}
              >{
                selectBenefits.length > 0
                  ? `Phúc lợi (${selectBenefits.length})`
                  : 'Phúc lợi'
              }</NavigationMenuTrigger>
              <NavigationMenuContent className='grid grid-cols-2 min-w-[500px] p-2'>
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
                      <span className='text-green-900'>{benefit.name}</span>
                    </div>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Kỹ năng */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={` ${
                  selectSkills.length > 0
                    ? 'bg-yellow-300 '
                    : 'text-orange-700 '
                }`}
              >{
                selectSkills.length > 0
                  ? `Kỹ năng (${selectSkills.length})`
                  : 'Kỹ năng'
              }</NavigationMenuTrigger>
              <NavigationMenuContent className='grid grid-cols-4 min-w-[900px] p-2'>
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
                    <span className='text-green-900'>{skill.name}</span>
                  </Label>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button
          variant='destructive'
          className='bg-[#ed1b2f] px-7 py-1 rounded-4xl hover:bg-gray-100  font-semibold border border-gray-300 hover:text-black text-white'
          onClick={handleResetFilter}
        >
          <span>Đặt lại bộ lọc</span>
        </Button>
      </div>

      {/* Danh sách việc làm */}
      <JobList jobs={jobList} />
    </div>
  );
}
