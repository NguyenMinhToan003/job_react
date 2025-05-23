import { useEffect, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

import { getCityList } from '@/apis/cityAPI';
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
import { getExperienceList } from '@/apis/experienceAPI';

import { getLevelList } from '@/apis/levelAPI';
import { Level } from '@/types/levelType';
import { TypeJob } from '@/types/typeJobType';
import { Experience } from '@/types/experienceType';
import { getTypeJobList } from '@/apis/typeJobAPI';
import { filterJob } from '@/apis/jobAPI';
import { JobFilterResponse } from '@/types/jobType';
import { toast } from 'sonner';

export default function Home() {
  const [countJobs, setCountJobs] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectLevel, setSelectLevel] = useState('');
  const [selectType, setSelectType] = useState('');
  const [search, setSearch] = useState('');
  const [selectExperience, setSelectExperience] = useState('');
  const [jobList, setJobList] = useState<JobFilterResponse[]>([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
    >([]);
    const [levelOptions, setLevelOptions] = useState<Level[]>([]);
    const [typeOptions, setTypeOptions] = useState<TypeJob[]>([]);
    const [experienceOptions, setExperienceOptions] = useState<Experience[]>([]);
    const fetchLevel = async () => {
      try {
        const res = await getLevelList();
        setLevelOptions(res)
      } catch (error) {
        console.error('Error fetching level list:', error);
      }
    };
    
    const fetchType = async () => {
      try {
        const res = await getTypeJobList();
        setTypeOptions(res);
      } catch (error) {
        console.error('Error fetching type list:', error);
      }
    };
    
    const fetchExperience = async () => {
      try {
        const res = await getExperienceList();
        setExperienceOptions(res);
      } catch (error) {
        console.error('Error fetching experience list:', error);
      }
    };
    useEffect(() => {
      fetchCity();
      fetchLevel();
      fetchType();
      fetchExperience();
    }, []);
    

  const fetchCity = async () => {
    try {
      const response = await getCityList();
      setCityOptions(
        response.map((city: { name: string; id: string }) => ({
          label: city.name,
          value: city.id,
        }))
      );
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCity();
  }, []);

  const handleFilter = async () => {
    try {
      const response = await filterJob({
        levels: selectLevel,
        experiences: selectExperience,
        typeJobs: +selectType,
        citys: selectedCity,
        search: search,
      })
      setJobList(response.data);
      setCountJobs(response.total);
    }
    catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    handleFilter();
  }, [selectLevel, selectType, selectExperience]);


  

  const selectedLabel = cityOptions.find((c) => c.value === selectedCity)?.label;

  return (
    <div className='bg-[#f7f7f7] min-h-screen'>
      {/* Banner Tìm kiếm */}
      <div className='h-[400px] bg-gradient-to-r from-[#121212] to-[#53151c] flex gap-2 items-center justify-center px-4'>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <Button
            variant='secondary'
            className='h-[54px] text-base font-semibold w-[200px] p-0'
          >
            <SelectTrigger className='border-none w-full h-full text-left px-4'>
              <SelectValue
                placeholder={
                  <span className='flex items-center gap-2 text-gray-600'>
                    <MapPin className='w-4 h-4' />
                    Chọn Thành Phố
                  </span>
                }
              >
                {selectedLabel && (
                  <span className='flex items-center gap-2 text-gray-900'>
                    <MapPin className='w-4 h-4' />
                    {selectedLabel}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
          </Button>
          <SelectContent className='mt-2'>
            <Input
              className='w-full bg-transparent text-gray-700 placeholder-gray-500 border-none text-sm font-medium focus-visible:ring-0 focus-visible:outline-none mb-2'
              placeholder='Tìm kiếm...'
              onKeyDown={(e) => e.stopPropagation()}
            />
            {cityOptions.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='bg-white rounded-sm p-2 flex-1 max-w-[600px]'>
          <Input
            className='w-full bg-transparent text-gray-700 placeholder-gray-500 border-none text-xl font-medium focus-visible:ring-0 focus-visible:outline-none'
            placeholder='Nhập từ khóa tìm kiếm...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          variant='destructive'
          className='h-[54px] text-base bg-[#ed1b2f] w-[200px]'
          onClick={handleFilter}
        >
          <Search />
          <span>Tìm kiếm</span>
        </Button>
      </div>

      <div className='bg-white rounded-md p-4 mt-4 border border-gray-300 flex justify-between items-center shadow-sm w-7xl mx-auto'>
        <h3 className='font-semibold text-lg text-gray-800'>
          Tìm thấy {countJobs} việc làm
        </h3>
      </div>

      {/* Bộ lọc nâng cao */}
      <div className='bg-white rounded-md p-4 mt-4 border border-gray-300 flex justify-between items-center shadow-sm w-7xl mx-auto'>
        <div className='flex gap-3 items-center justify-start'>
          <Select value={selectLevel} onValueChange={setSelectLevel}>
            <SelectTrigger
              className={`rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-black ${
                selectLevel ? 'bg-amber-300' : 'bg-white'
              }`}
            >
              <SelectValue placeholder='Cấp bậc' />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectType} onValueChange={setSelectType}>
            <SelectTrigger
              className={`rounded-full border border-gray-300 px-4 py-2 text-sm hover:border-black font-medium text-gray-700 ${
                selectType ? 'bg-amber-300' : 'bg-white'
              }`}
            >
              <SelectValue placeholder='Chọn Loại Hình' />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectExperience} onValueChange={setSelectExperience}>
            <SelectTrigger
              className={`rounded-full border border-gray-300 px-4 py-2 text-sm hover:border-black font-medium text-gray-700 ${
                selectExperience ? 'bg-amber-300' : 'bg-white'
              }`}
            >
              <SelectValue placeholder='Chọn Kinh Nghiệm' />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant='destructive'
          className='text-base bg-[#ed1b2f] px-7 py-1 rounded-4xl hover:bg-gray-100 hover:text-black text-white font-semibold hover:border-gray-300 border border-gray-300'
          onClick={() => {
            setSelectLevel('');
            setSelectType('');  
            setSelectExperience('');
          }}
        >
          <span>Đặt lại bộ lọc</span>
        </Button>
      </div>

      <JobList jobs={jobList} />
    </div>
  );
}