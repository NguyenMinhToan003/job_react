/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
} from 'lucide-react';

import { getCityList } from '@/apis/cityAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import { iconMap } from '@/utils/SetListIcon';
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
import { Experience } from '@/types/experienceType';
import { TypeJob } from '@/types/typeJobType';
import { Benefit } from '@/types/benefitType';
import { getBenefit } from '@/apis/benefitAPI';
import { getSkillList } from '@/apis/skillAPI';
import { Skill } from '@/types/skillType';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/types/majorType';
import { getFieldList } from '@/apis/fieldAPI';
import BannerEmployer from '@/components/elements/company/BannerEmployer';
import JobBanner from '@/components/elements/job/job-list/JobBanner';
import Footer from '@/components/elements/footer/Footer';

export default function Home() {

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



  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cities, levels, types, experiences, benefits, skills, fields] = await Promise.all([
        getCityList(),
        getLevelList(),
        getTypeJobList(),
        getExperienceList(),
        getBenefit(),
        getSkillList(),
        getFieldList(),

      ]);
      setCityOptions(cities);
      setLevelOptions(levels);
      setTypeOptions(types);
      setExperienceOptions(experiences);
      setBenefitOptions(benefits);
      setSkillOptions(skills);
      setFields(fields);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleFilter = async () => {
    window.location.href = `/tim-kiem-cong-viec?search=${encodeURIComponent(search)}&city=${citySelected ? citySelected.id : ''}&levels=${selectLevels.join(',')}&experience=${selectExperience.join(',')}&typeJobs=${selectType.join(',')}&skills=${selectSkills.join(',')}&benefits=${selectBenefits.join(',')}`;

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
  };


  return (
    <div className='bg-gradient-to-br bg-[#F6F9FF] min-h-screen '>
      <div className='w-full '>
        <img 
          src='https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fcdn1.vieclam24h.vn%2Fimages%2Fseeker-banner%2F2025%2F05%2F16%2Fbanner-cts-timdungviec-pc_174740689238.jpg&w=1920&q=75'
          className='w-full h-[250px] object-cover ' 
          alt='Banner' 
        />  
      </div>
      <div className='flex items-center justify-center gap-1 h-fit p-1 absolute top-[240px] left-1/2 -translate-x-1/2 z-10 rounded-md w-7xl bg-white shadow-xl border border-gray-100 '>
        <div className='bg-white rounded-none p-1.5 flex-1 max-w-[600px] border-none '>
          <SearchIcon className='text-[#451da1] w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2' />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-full bg-transparent border-none text-xl font-semibold p-3 focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400'
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
          <Button 
            variant='ghost' 
            className='w-[200px] p-0 rounded-none bg-white hover:bg-white border-l-1 border-gray-200'
          >
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
          <Button 
            variant='ghost' 
            className='w-[200px] p-0 rounded-none bg-white hover:bg-white border-l-1 border-gray-200'
          >
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
          className='w-[200px] bg-[#451e99] rounded-sm text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#451e99] hover:text-white'
          onClick={handleFilter}
        >
          <Search />
          <span className='text-white'>Tìm kiếm</span>
        </Button>
      </div>

      <div className='rounded-md p-4 bg-white flex justify-between items-center shadow-xl w-7xl mx-auto'>
        <NavigationMenu>
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
          className='bg-[#451da1] px-7 py-1 hover:bg-gray-100 font-semibold border border-gray-300 hover:text-black text-white flex items-center gap-2'
          onClick={handleResetFilter}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại bộ lọc</span>
        </Button>
      </div>
      <Card className="w-full my-10 px-6 shadow-none bg-transparent">
  <CardHeader className="text-center space-y-2">
    <CardTitle className="text-2xl font-bold text-gray-800">
      Tìm kiếm việc làm nhanh chóng và hiệu quả
    </CardTitle>
    <p className="text-gray-600">
      Hàng triệu công việc đang chờ bạn khám phá
    </p>
  </CardHeader>
  <CardContent className="p-6 pt-2">
          <JobBanner />
  </CardContent>
      </Card>
      
      <BannerEmployer />
      <Footer />
    </div>
  );
}