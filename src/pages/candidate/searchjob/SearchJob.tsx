/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBenefit } from "@/apis/benefitAPI";
import { getCityList } from "@/apis/cityAPI";
import { getExperienceList } from "@/apis/experienceAPI";
import { getFieldList } from "@/apis/fieldAPI";
import { filterJob } from "@/apis/jobAPI";
import { getLevelList } from "@/apis/levelAPI";
import { getListMajorAPI } from "@/apis/majorAPI";
import { getSkillList } from "@/apis/skillAPI";
import { getTypeJobList } from "@/apis/typeJobAPI";
import JobList from "@/components/elements/job/job-list/Index";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Benefit } from "@/types/benefitType";
import { Experience } from "@/types/experienceType";
import { JobFilterRequest, JobFilterResponse } from "@/types/jobType";
import { Level } from "@/types/levelType";
import { City } from "@/types/location";
import { Field, Major, MajorResponse } from "@/types/majorType";
import { Skill } from "@/types/SkillType";
import { TypeJob } from "@/types/TypeJobType";
import { parseNumberArray, parseStringArray } from "@/utils/convertArray";
import { iconMap } from "@/utils/SetListIcon";
import { Award, Briefcase, Clock, Flashlight, Gift, Layers3, MapPin, RotateCcw, Search, SearchIcon, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function SearchJob() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search');
  const city = searchParams.get('city');
  const levels = searchParams.get('levels');
  const experience = searchParams.get('experience');
  const typeJobs = searchParams.get('typeJobs');
  const skills = searchParams.get('skills');
  const benefits = searchParams.get('benefits');
  const fieldId = searchParams.get('fieldId');
  const pageQuery = searchParams.get('page');
  const majorIdQuery = searchParams.get('majorId');

  const [isPromaxSearch, setIsPromaxSearch] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(0);

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

  const [majors, setMajors] = useState<MajorResponse[]>([]);

  const [search, setSearch] = useState<string>(searchQuery || '');
  const [fields, setFields] = useState<Field[]>([]);

  const [minSalary, setMinSalary] = useState<number>();
  const [maxSalary, setMaxSalary] = useState<number>();

  const [selectMajorId, setSelectMajorId] = useState<number>();

  const [selectedFieldId, setSelectedFieldId] = useState<number>();

  const [jobList, setJobList] = useState<JobFilterResponse[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [citiesL, levelsL, typesL, experiencesL, benefitsL, skillsL, fieldsL, majorls] = await Promise.all([
        getCityList(),
        getLevelList(),
        getTypeJobList(),
        getExperienceList(),
        getBenefit(),
        getSkillList(),
        getFieldList(),
        getListMajorAPI(),
      ]);
      setCityOptions(citiesL);
      setLevelOptions(levelsL);
      setTypeOptions(typesL);
      setExperienceOptions(experiencesL);
      setBenefitOptions(benefitsL);
      setSkillOptions(skillsL);
      setFields(fieldsL);
      setMajors(majorls);

      setSelectedCity(citiesL.find(c => c.id === city));
      setSelectLevel(parseStringArray(levels));
      setSelectExperience(parseNumberArray(experience));
      setSelectType(parseNumberArray(typeJobs));
      setSelectSkills(parseNumberArray(skills));
      setSelectBenefits(parseStringArray(benefits));
      setSelectedFieldId(fieldId ? +fieldId : undefined);
      setPage(pageQuery ? +pageQuery : 1);
      setSelectMajorId(majorIdQuery ? +majorIdQuery : undefined);
      
      if (searchQuery) setSearch(searchQuery);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };
  const fetchJobList = async (filter: JobFilterRequest) => {
    try {
      setLoading(true);

      const response = await filterJob(filter);
      setJobList(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPage(response.totalPage);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Error fetching job list');
    }
    finally {
      setLoading(false);
    }
  }
  const filterJobs = async () => {
    try {
      if (filterRef) {
        filterRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      handleFilterUrl();
      await fetchJobList({
        search,
        levels: selectLevels,
        experience: selectExperience,
        typeJobs: selectType,
        skills: selectSkills,
        benefits: selectBenefits,
        citys: citySelected ? [citySelected.id] : undefined,
        fieldId: selectedFieldId ? selectedFieldId : undefined,
        majorId: selectMajorId,
        page,
        limit,
      } as JobFilterRequest);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Error filtering jobs');
    }
  }

  useEffect(() => {
    filterJobs();
  }, [selectLevels, selectExperience, selectType, selectSkills, selectBenefits, citySelected, selectedFieldId, page, limit, selectMajorId]);

  const handleFilterUrl = () => {
    const params = new URLSearchParams({
      search,
      city: citySelected?.id || '',
      levels: selectLevels.join(','),
      experience: selectExperience.join(','),
      typeJobs: selectType.join(','),
      skills: selectSkills.join(','),
      benefits: selectBenefits.join(','),
      fieldId: selectedFieldId ? selectedFieldId.toString() : '',
      minSalary: minSalary ? minSalary.toString() : '',
      maxSalary: maxSalary ? maxSalary.toString() : '',
      page: '1',
      limit: limit.toString(),
      majorId: selectMajorId ? selectMajorId.toString() : '',
    });
    navigate(`/tim-kiem-cong-viec?${params.toString()}`);
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
    setSelectedFieldId(undefined);
    setSelectMajorId(undefined);
    setMinSalary(undefined);
    setMaxSalary(undefined);
    setPage(1);
  };
  
  return <div className=" w-full min-h-screen bg-white relative mb-10">
    <Button
      variant='ghost'
      className='fixed bottom-5 left-4 border-[#451da1] border text-[#451da1] hover:bg-[#451da1] hover:text-white z-50'
      onClick={() => setIsPromaxSearch(!isPromaxSearch)}
    >
      Nâng cao
    </Button>
    <div className='flex items-center justify-center gap-2 p-3 bg-[#451da1] sticky top-0 z-50'>
      <Flashlight className='w-6 h-6 text-white' />
      <h1 className='text-2xl font-semibold text-white'>
        Đã tìm thấy {total} việc làm
        {search && ` cho từ khóa "${search}"`}
      </h1>
    </div>  
    <div className="flex flex-col items-center justify-center p-3 bg-[#451da1] sticky top-0 z-50 gap-2" ref={filterRef}>
      <div className='flex items-center justify-center gap-1 h-fit p-1  rounded-md w-7xl bg-white shadow-xl border border-gray-100 '>
      <div className='bg-white rounded-none p-1.5 flex-1 max-w-[600px] border-none relative'>
        <SearchIcon className='text-[#451da1] w-6 h-6 absolute -left-3 top-1/2 -translate-y-1/2' />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-full bg-transparent border-none text-xl font-semibold p-3 focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400'
          placeholder='Nhập từ khóa tìm kiếm việc làm, ví dụ: "Lập trình viên"'
        />
      </div>
      <Select
          defaultValue={selectedFieldId?.toString()
            ? selectedFieldId?.toString() : 'undefinded'}
          onValueChange={value => {
            console.log('Selected field value:', value);
            setSelectedFieldId(value === 'undefinded' ? undefined : +value);
            if (value === 'undefinded') {
              setSelectedFieldId(undefined);
            }
        }}
      >
        <Button 
          variant='ghost' 
          className='w-[200px] p-0 rounded-none bg-white hover:bg-white border-l-1 border-gray-200'
        >
          <SelectTrigger className='w-full h-full text-left px-4 border-none'>
              <SelectValue/>
          </SelectTrigger>
        </Button>
        <SelectContent>
          <SelectItem value={'undefinded'}>
            <Layers3/><Label className='text-gray-600'>Tất cả lĩnh vực</Label>
          </SelectItem>
          {fields.map(field => (
            <SelectItem key={field.id} value={field.id.toString()}>
              {field.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={citySelected?.id ? citySelected.id.toString() : 'undefinded'}
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
              <SelectValue/>
            </SelectTrigger>
        </Button>
        <SelectContent>
            <SelectItem value={'undefinded'}>
          <MapPin className='w-4 h-4 text-gray-600' />
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
        onClick={filterJobs}
      >
        <Search />
        <span className='text-white'>Tìm kiếm</span>
      </Button>
      </div>
      {
        isPromaxSearch &&
        <div className='rounded-md p-4 bg-white flex justify-between items-center shadow-xl w-7xl mx-auto z-10'>
        <NavigationMenu viewport={false} >
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
            <NavigationMenuItem >
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#451e99]" />
                {
                  selectSkills.length > 0
                    ? `Kỹ năng (${selectSkills.length})`
                    : 'Kỹ năng'
                }
              </NavigationMenuTrigger>
                  <NavigationMenuContent className='bg-white min-w-[600px] max-h-[600px]  p-2'>
                    
                    <div className='grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto'>
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
                    </div>

              </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    Chuyên Ngành {selectMajorId ? `(${majors.filter(m => m.id === selectMajorId).length})` : ''}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='bg-white min-w-[600px] max-h-[
600px]  p-2'>
                    <div className='grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto'>
                      <Label
                        className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                        onClick={() => setSelectMajorId(undefined)}
                      >
                        <Checkbox
                          className="rounded-full"
                          checked={selectMajorId === undefined}
                          onCheckedChange={() => setSelectMajorId(undefined)}
                        />
                        <span className='text-[#451e99]'>Tất cả chuyên ngành</span>
                      </Label>
                      {majors.map(major => (
                        <Label
                          key={major.id}
                          className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                        >
                          <Checkbox
                            className="rounded-full"
                            checked={selectMajorId === major.id}
                            onCheckedChange={() => setSelectMajorId(major.id)}
                          />
                          <span className='text-[#451e99]'>{major.name}</span>
                        </Label>
                      ))}
                    </div>
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
      }
    </div>



      <JobList
        jobs={jobList}
        loading={loading}
        page={page}
        setPage={setPage}
        totalPages={totalPage}
      />

  </div>
}