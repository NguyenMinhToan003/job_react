/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBenefit } from '@/apis/benefitAPI';
import { getAllEducations } from '@/apis/educationAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { getFieldList } from '@/apis/fieldAPI';
import { updateJob, updateMatchingWeightJob, viewJobAPI } from '@/apis/jobAPI';
import { getAllLanguages } from '@/apis/languageAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getLocationByCompanyAPI } from '@/apis/locationAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import JobMenu from '@/components/elements/job/MenuMore';
import BenefitJobPopup from '@/components/elements/job/popup/BenefitJobPopup';
import DetailJobPopup from '@/components/elements/job/popup/DetailJobPopup';
import EducationJonPopup from '@/components/elements/job/popup/EducationJobPopup';
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
import { JobResponse } from '@/types/jobType';
import { Language, LanguageJob } from '@/types/LanguageType';

import { Level } from '@/types/levelType';
import { LocationResponse } from '@/types/location';
import { Field, Major, MajorResponse } from '@/types/majorType';
import { Skill } from '@/types/SkillType';
import { TypeJob } from '@/types/TypeJobType';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UpdateJob() {
  const url = window.location.href;
  const id = url.substring(url.lastIndexOf('/') + 1);
  const [nameJob, setNameJob] = useState('')
  const [quantityJob, setQuantityJob] = useState(1)
  const [description, setDescription] = useState('')
  const [requirement, setRequirement] = useState('')
  const [levelList, setLevelList] = useState<Level[]>([])
  const [levelIds, setLevelIds] = useState<string[]>([])
  const [experienceList, setExperienceList] = useState<Experience[]>()
  const [experienceId, setExperienceId] = useState<number>(1)
  const [benefitList, setBenefitList] = useState<Benefit[]>([])
  const [benefitIds, setBenefitIds] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState<number| null>(null)
  const [salaryMax, setSalaryMax] = useState<number| null>(null)
  const [checkField, setCheckField] = useState(0)
  const [typeJobList, setTypeJobList] = useState<TypeJob[]>([])
  const [typeJobId, setTypeJobId] = useState<number[]>([])
  const [locationIds, setLocationIds] = useState<number[]>([])
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([])
  const [skillId, setSkillId] = useState<number[]>([])
  const [educationsList, setEducationsList] = useState<Education[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<number>();
  const [languageList, setLanguageList] = useState<Language[]>([]);
  const [languageIds, setLanguageIds] = useState<LanguageJob[]>([]);
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);
  const [locationWeight, setLocationWeight] = useState(0);
  const [skillWeight, setSkillWeight] = useState(0);
  const [majorWeight, setMajorWeight] = useState(0);
  const [languageWeight, setLanguageWeight] = useState(0);
  const [educationWeight, setEducationWeight] = useState(0);
  const [levelWeight, setLevelWeight] = useState(0);
  const [job, setJob] = useState<JobResponse>();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectField, setSelectField] = useState<Field | null>(null);
  const [selectMajors, setSelectMajors] = useState<number[]>([]);

  const handleUpdateJob = async () => {
    try {
      const score = levelWeight + skillWeight + majorWeight + languageWeight + educationWeight + locationWeight;
      if (score !== 100) {
        toast.error('Tổng trọng số phải bằng 100');
        return;
      }
      await updateJob(+id, {
        name: nameJob,
        locations: locationIds,
        skills: skillId,
        quantity: quantityJob,
        levels: levelIds,
        types: typeJobId,
        requirement,
        description,
        majors: selectMajors,
        minSalary: salaryMin,
        maxSalary: salaryMax,
        benefits: benefitIds,
        experience: experienceId,
        languages: languageIds,
        education: selectedEducation,
        expiredAt: expiredAt,
      });
      await updateMatchingWeightJob(+id, {
        locationWeight,
        skillWeight,
        majorWeight,
        languageWeight,
        educationWeight,
        levelWeight
      }
      )
      toast.success('Cập nhật bài đăng thành công');
    }
    catch (error : any) {
      toast.error(error.response.data.message);
    }
  }

  const fetchElements = async () => {
    try {
      const [benefits, levels, experiences, types, locations, skills, educations, languages, fieldList] = await Promise.all([
        getBenefit(),
        getLevelList(),
        getExperienceList(),
        getTypeJobList(),
        getLocationByCompanyAPI(),
        getSkillList(),
        getAllEducations(),
        getAllLanguages(),
        getFieldList(),
      ]);
      setBenefitList(benefits);
      setLevelList(levels);
      setExperienceList(experiences);
      setTypeJobList(types);
      setLocationList(locations);
      setSkillList(skills);
      setEducationsList(educations);
      setLanguageList(languages)
      setFields(fieldList);
    }
    catch (error : any) {
      toast.error(error?.response.data.message)
    }
  }

  const fetchDataJob = async () => {
    try {
      const response = await viewJobAPI(+id);
      setJob(response);
      setNameJob(response.name);
      setDescription(response.description);
      setRequirement(response.requirement);
      setSalaryMin(response.minSalary);
      setSalaryMax(response.maxSalary);
      setLevelIds(response.levels.map((level) => level.id));
      setLocationIds(response.locations.map((location) => location.id));
      setExperienceId(response.experience?.id);
      setBenefitIds(response.benefits.map((benefit) => benefit.id));
      setTypeJobId(response.typeJobs.map((typeJob) => typeJob.id));
      setQuantityJob(response.quantity);
      setSkillId(response.skills.map((skill) => skill.id));
      setLanguageIds(response.languageJobs);
      setSelectedEducation(response.education.id);
      setExpiredAt(new Date(response.expiredAt));
      setLocationWeight(response.matchingWeights?.locationWeight);
      setSkillWeight(response.matchingWeights?.skillWeight);
      setMajorWeight(response.matchingWeights?.majorWeight);
      setLanguageWeight(response.matchingWeights?.languageWeight);
      setEducationWeight(response.matchingWeights?.educationWeight);
      setLevelWeight(response.matchingWeights?.levelWeight);
      setSelectMajors(response.majors.map((major) => major.id));
      const fieldSelect = fields.find((field) => field.id === response.majors[0]?.field.id);
      setSelectField(fieldSelect || null);
    }
    catch(error) {
      toast.error((error as any).response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu bài đăng');
    }
  }

  useEffect(() => {
    fetchElements()
  }, [])

  useEffect(() => {
    fetchDataJob();
  }, [fields]);
  
  useEffect(() => {
    const filledFields = [
      nameJob,
      description,
      requirement,
      levelIds,
      experienceId,
      benefitIds.length > 0,
      salaryMin,
      salaryMax,
      selectedEducation
    ].filter(Boolean).length;
    setCheckField(filledFields);
  }
  , [nameJob, description, requirement, levelIds, experienceId, benefitIds, salaryMin, salaryMax, selectedEducation]);
  return <>
    <Card className='w-full bg-transparent shadow-none border-none  '>
      <CardHeader>
        <CardTitle className='font-bold text-2xl flex justify-between items-center'>
          <div>CẬP NHẬT BÀI ĐĂNG TUYỂN DỤNG</div>
          {
            job && <JobMenu job={job}/> 
          }
        </CardTitle>
      </CardHeader>
      <CardContent className='py-4'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1'>
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
            <EducationJonPopup
              educationList={educationsList}
              setEducationId={setSelectedEducation}
              educationId={selectedEducation}
            />
            <LanguageJobPopup
              languageList={languageList}
              languageIds={languageIds}
              setLanguageIds={setLanguageIds}
            />
            <FieldJobPopup
              selectField={selectField}
              setSelectField={setSelectField}
              fields={fields}
              selectMajors={selectMajors}
              setSelectMajors={setSelectMajors}
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
              fields={fields}
              selectField={selectField}
              setSelectField={setSelectField}
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
              jobId={+id}
            />
          </div>
          {/* Right side: Add Button */}
          <div className='w-full md:w-[300px] sticky top-20 h-56'>
            <Card className='shadow-md border-dashed border-2 border-gray-300 p-4 h-full flex flex-col justify-center items-center'>
              <div>
                <div className='text-sm text-gray-500 text-center font-bold'>
                  Bạn đã hoàn tất  {checkField}/ 8 trường thông tin.
                </div>
              </div>
              <Button
                className='w-full h-16 bg-[#ed1b2f] text-base mt-4 cursor-pointer'
                onClick={handleUpdateJob}
                disabled={checkField < 7}
              >
                <RotateCcw className='mr-2' />
                CẬP NHẬT
              </Button>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  </>
}