/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBenefit } from '@/apis/benefitAPI';
import { getAllEducations } from '@/apis/educationAPI';
import { getPackageAvailable, subscriptionUseJob } from '@/apis/paymentAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { getFieldList } from '@/apis/fieldAPI';
import { createJob, createMatchingWeightJob } from '@/apis/jobAPI';
import { getAllLanguages } from '@/apis/languageAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getLocationByCompanyAPI } from '@/apis/locationAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import BenefitJobPopup from '@/components/elements/job/popup/BenefitJobPopup';
import DetailJobPopup from '@/components/elements/job/popup/DetailJobPopup';
import EducationJobPopup from '@/components/elements/job/popup/EducationJobPopup';
import ExperienceJonPopup from '@/components/elements/job/popup/ExperienceJobPopup';
import ExpiredJobPopup from '@/components/elements/job/popup/ExpiredJobPopup';
import FieldJobPopup from '@/components/elements/job/popup/FieldJobPopup';
import LanguageJobPopup from '@/components/elements/job/popup/LanguageJobPopup';
import LevelJobPopup from '@/components/elements/job/popup/LevelJobPopup';
import LocationJobPopup from '@/components/elements/job/popup/LocationPopup';
import MatchingJobPopup from '@/components/elements/job/popup/MatchingJobPopup';
import NameJobPopup from '@/components/elements/job/popup/NameJobPopup copy';
import QuantityJobPopup from '@/components/elements/job/popup/QuantityJobPopup';
import RequirementPopup from '@/components/elements/job/popup/RequirementPopup';
import SalaryJonPopup from '@/components/elements/job/popup/SalaryJobPopup';
import SkillJobPopup from '@/components/elements/job/popup/SkillJobPopup';
import TypeJobPopup from '@/components/elements/job/popup/TypeJobPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Benefit } from '@/types/benefitType';
import { Education } from '@/types/educationType';
import { Experience } from '@/types/experienceType';
import { Language, LanguageJob } from '@/types/LanguageType';

import { Level } from '@/types/levelType';
import { LocationResponse } from '@/types/location';
import { Field, Major } from '@/types/majorType';
import { Skill } from '@/types/SkillType';
import { TypeJob } from '@/types/TypeJobType';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PackageResponse } from '@/types/packageType';
import SelectServiceJobPopup from '@/components/elements/job/popup/SelectServiceJobPopup';

export default function CreateJob() {
  const [nameJob, setNameJob] = useState('')
  const [quantityJob, setQuantityJob] = useState(1)
  const [description, setDescription] = useState('')
  const [requirement, setRequirement] = useState('')
  const [levelIds, setLevelIds] = useState<string[]>([])
  const [levelList, setLevelList] = useState<Level[]>([])
  const [experienceList, setExperienceList] = useState<Experience[]>()
  const [experienceId, setExperienceId] = useState<number>(1)
  const [benefitList, setBenefitList] = useState<Benefit[]>([])
  const [benefitIds, setBenefitIds] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState<number | null>(null)
  const [salaryMax, setSalaryMax] = useState<number | null>(null)
  const [checkField, setCheckField] = useState(0)
  const [typeJobList, setTypeJobList] = useState<TypeJob[]>([])
  const [typeJobId, setTypeJobId] = useState<number[]>([])
  const [locationIds, setLocationIds] = useState<number[]>([])
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([])
  const [skillId, setSkillId] = useState<number[]>([])
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<number>();
  const [expiredAt, setExpiredAt] = useState<Date| null>(null);
  const [locationWeight, setLocationWeight] = useState(20);
  const [skillWeight, setSkillWeight] = useState(25);
  const [majorWeight, setMajorWeight] = useState(20);
  const [languageWeight, setLanguageWeight] = useState(10);
  const [educationWeight, setEducationWeight] = useState(10);
  const [levelWeight, setLevelWeight] = useState(15);
  const [languageList, setLanguageList] = useState<Language[]>([]);
  const [languageIds, setLanguageIds] = useState<LanguageJob[]>([]);
  const [packageAvailable, setPackageAvailable] = useState<PackageResponse[]>([]);
  const [selectPackage, setSelectPackage] = useState<PackageResponse | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectField, setSelectField] = useState<Field | null>(null);
  const [selectMajors, setSelectMajors] = useState<number[]>([]);

  const handleCreateJob = async () => {
    try {
      const score = levelWeight + educationWeight + languageWeight + majorWeight + skillWeight + locationWeight;
      if (score !== 100) {
        toast.error('Tổng trọng số phải bằng 100');
        return;
      }
      const create = await createJob({
        name: nameJob,
        description: description,
        benefits: benefitIds,
        requirement: requirement,
        levels: levelIds,
        experience: experienceId,
        types: typeJobId,
        skills: skillId,
        quantity: quantityJob,
        locations: locationIds,
        minSalary: salaryMin,
        maxSalary: salaryMax,
        majors: selectMajors,
        education: selectedEducation,
        languages: languageIds,
        expiredAt: expiredAt,
      })
      createMatchingWeightJob(create.id, {
        locationWeight: locationWeight,
        skillWeight: skillWeight,
        majorWeight: majorWeight,
        languageWeight: languageWeight,
        educationWeight: educationWeight,
        levelWeight: levelWeight,
      })
      if (selectPackage) {
      
        subscriptionUseJob({
          jobId: create.id,
          packageId: selectPackage.id,
        });
      }
      toast.success('Tin tuyển dụng đã được tạo thành công');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Đã sảy ra lỗi khi tạo tin tuyển dụng');
    }
  }
  const fetchListElements = async () => {
    try {
      const [benefits, levels, experiences, typeJobs, locations, skills, educations, languages, fieldlist, packageAvailables] = await Promise.all([
        getBenefit(),
        getLevelList(),
        getExperienceList(),
        getTypeJobList(),
        getLocationByCompanyAPI(),
        getSkillList(),
        getAllEducations(),
        getAllLanguages(),
        getFieldList(),
        getPackageAvailable()
      ]);
      setBenefitList(benefits);
      setLevelList(levels);
      setExperienceList(experiences);
      setTypeJobList(typeJobs);
      setLocationList(locations);
      setSkillList(skills);
      setEducationList(educations);
      setLanguageList(languages);
      setFields(fieldlist);
      setPackageAvailable(packageAvailables);
    }
    catch (error : any) {
      toast.error(error.response?.data?.message || 'Đã sảy ra lỗi khi tải dữ liệu');
    }
  }

  useEffect(() => {
    fetchListElements()
  }, [])
  
  useEffect(() => {
    const filledFields = [
      nameJob,
      description,
      requirement,
      levelIds,
      experienceId,
      benefitIds.length > 0,
      salaryMin,
      salaryMax
    ].filter(Boolean).length;

    setCheckField(filledFields);
  }
  , [nameJob, description, requirement, levelIds, experienceId, benefitIds, salaryMin, salaryMax]);
  return <>
    <Card className='w-full bg-transparent border-none shadow-none p-0'>
      <CardHeader>
        <CardTitle className='font-bold text-2xl text-red-600'>TẠO TIN TUYỂN DỤNG</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1'>
            <SelectServiceJobPopup
              selectPackage={selectPackage}
              setSelectPackage={setSelectPackage}
              packageAvailable={packageAvailable}
            />
            <NameJobPopup
              nameJob={nameJob}
              setNameJob={setNameJob}
            />
            <SalaryJonPopup
              salaryMin={salaryMin}
              setSalaryMin={setSalaryMin}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
            />
            <QuantityJobPopup
              quantityJob={quantityJob}
              setQuantityJob={setQuantityJob}
            />
            <LocationJobPopup
              locationIds={locationIds}
              setLocationIds={setLocationIds}
              locationList={locationList}
            />
            <ExpiredJobPopup
              expiredAt={expiredAt}
              setExpiredAt={setExpiredAt}
            />
            <DetailJobPopup
              description={description}
              setDescription={setDescription}
            />
            <RequirementPopup
              requirement={requirement}
              setRequirement={setRequirement}
            />
            <EducationJobPopup
              educationList={educationList}
              setEducationId={setSelectedEducation}
              educationId={selectedEducation}
            />
            <LanguageJobPopup
              languageList={languageList}
              languageIds={languageIds}
              setLanguageIds={setLanguageIds}
            />
            <LevelJobPopup
              levelList={levelList}
              levelIds={levelIds}
              setLevelIds={setLevelIds}
            />
            <ExperienceJonPopup
              experienceId={experienceId}
              setExperienceId={setExperienceId}
              experienceList={experienceList || []}
            />
            <BenefitJobPopup
              benefitList={benefitList}
              setBenefitIds={setBenefitIds}
              benefitIds={benefitIds}
            />
            <TypeJobPopup
              typeJobList={typeJobList}
              typeJobId={typeJobId}
              setTypeJobId={setTypeJobId}
            />
            <FieldJobPopup
              selectField={selectField}
              setSelectField={setSelectField}
              fields={fields}
              selectMajors={selectMajors}
              setSelectMajors={setSelectMajors}
            />
            <SkillJobPopup
              skillList={skillList}
              selectedSkills={skillId}
              setSelectedSkills={setSkillId}
            />
            <MatchingJobPopup
              locationWeight={locationWeight}
              setLocationWeight={setLocationWeight}
              skillWeight={skillWeight}
              setSkillWeight={setSkillWeight}
              majorWeight={majorWeight}
              setMajorWeight={setMajorWeight}
              languageWeight={languageWeight}
              setLanguageWeight={setLanguageWeight}
              educationWeight={educationWeight}
              setEducationWeight={setEducationWeight}
              levelWeight={levelWeight}
              setLevelWeight={setLevelWeight}
            />
          </div>
          {/* Right side: Add Button */}
          <div className='w-full md:w-[300px] sticky top-20 h-56 flex flex-col gap-4'>
            
            <Card className='shadow-md border-dashed border-2 border-gray-300 p-4 h-full flex flex-col justify-center items-center'>
              <div>
                <div className='text-sm text-gray-500 text-center font-bold'>
                  Bạn đã hoàn tất  {checkField}/ 8 trường thông tin.
                </div>
              </div>
              <Button
                className='w-full h-16 bg-[#ed1b2f] text-base mt-4 cursor-pointer'
                onClick={handleCreateJob}
                disabled={checkField < 6}
              >
                <CirclePlus className='mr-2' />
                Thêm công việc
              </Button>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  </>
}