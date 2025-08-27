/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBenefit } from '@/apis/benefitAPI';
import { getAllEducations } from '@/apis/educationAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { getFieldList } from '@/apis/fieldAPI';
import { createJob, createMatchingWeightJob, viewJobAPI } from '@/apis/jobAPI';
import { getAllLanguages } from '@/apis/languageAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getLocationByCompanyAPI } from '@/apis/locationAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import BenefitJobPopup from '@/components/elements/job/popup/benefitJobPopup';
import DetailJobPopup from '@/components/elements/job/popup/detailJobPopup';
import EducationJonPopup from '@/components/elements/job/popup/educationJobPopup';
import ExperienceJonPopup from '@/components/elements/job/popup/experienceJobPopup';
import ExpiredJobPopup from '@/components/elements/job/popup/expiredJobPopup';
import FieldJobPopup from '@/components/elements/job/popup/fieldJobPopup';
import LanguageJobPopup from '@/components/elements/job/popup/languageJobPopup';
import LevelJobPopup from '@/components/elements/job/popup/levelJobPopup';
import LocationJobPopup from '@/components/elements/job/popup/locationPopup';
import MatchingJobPopup from '@/components/elements/job/popup/matchingJobPopup';
import NameJobPopup from '@/components/elements/job/popup/nameJobPopup copy';
import QuantityJobPopup from '@/components/elements/job/popup/quantityJobPopup';
import RequirementPopup from '@/components/elements/job/popup/requirementPopup';
import SalaryJonPopup from '@/components/elements/job/popup/salaryJobPopup';
import SkillJobPopup from '@/components/elements/job/popup/skillJobPopup';
import TypeJobPopup from '@/components/elements/job/popup/typeJobPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlertDialog } from '@/providers/alertDialogProvider';
import { Benefit } from '@/types/benefitType';
import { Education } from '@/types/educationType';
import { Experience } from '@/types/experienceType';
import { Language, LanguageJob } from '@/types/languageType';

import { Level } from '@/types/levelType';
import { LocationResponse } from '@/types/location';
import { Field } from '@/types/majorType';
import { Skill } from '@/types/skillType';
import { TypeJob } from '@/types/typeJobType';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CopyJob() {
  const url = window.location.href;
  const id = url.substring(url.lastIndexOf('/') + 1);
  const { showAlert } = useAlertDialog();
  const navigate = useNavigate();
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
      const create = await createJob({
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
      await createMatchingWeightJob(create.id, {
        locationWeight,
        skillWeight,
        majorWeight,
        languageWeight,
        educationWeight,
        levelWeight
      });
      showAlert({
        title: 'Tạo tin tuyển dụng thành công',
        content: 'Tin tuyển dụng đã được tạo thành công bạn có thể xem danh sách công việc hoặc tạo thêm tin tuyển dụng mới.',
        handleConfirm() {
          navigate('/danh-cho-nha-tuyen-dung/tuyen-dung');
        },
        confirmText: 'Xem danh sách công việc',
        cancelText: 'Đóng',
      })
      toast.success('Tạo bài đăng thành công');
    }
    catch (error : any) {
      toast.error(error.response.data.message);
    }
  }

  const fetchElements = async () => {
    try {
      const [benefits, levels, experiences, types, locations, skills, educations,fieldList ,languages] = await Promise.all([
        getBenefit(),
        getLevelList(),
        getExperienceList(),
        getTypeJobList(),
        getLocationByCompanyAPI(),
        getSkillList(),
        getAllEducations(),
        getFieldList(),
        getAllLanguages(),
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
      setNameJob(response.name);
      setDescription(response.description);
      setRequirement(response.requirement);
      setSalaryMin(response.minSalary);
      setSalaryMax(response.maxSalary);
      setLevelIds(response.levels.map((level) => level.id.toString()));
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
      setSelectField(response.majors.length > 0 ? fields.find((field) => field.id === response.majors[0].field.id) || null : null);
      setSelectMajors(response?.majors.map((major) => major.id) || []);
    }
    catch(error) {
      console.error('Error fetching job data:', error);
    }
  }
  useEffect(() => {
    fetchElements()
    fetchDataJob()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      salaryMax,
      selectedEducation
    ].filter(Boolean).length;
    setCheckField(filledFields);
  }
  , [nameJob, description, requirement, levelIds, experienceId, benefitIds, salaryMin, salaryMax, selectedEducation]);
  return <>
    <Card className='w-full bg-transparent shadow-none border-none'>
      <CardHeader>
        <CardTitle className='font-bold text-2xl flex justify-between items-center'>
          <div>NHÂN BẢN BÀI ĐĂNG TUYỂN DỤNG</div>
        </CardTitle>
      </CardHeader>
      <CardContent className='py-4'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Left side: Job List */}
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
              jobId={+id}
            />
          </div>
          <div className='w-[300px] sticky top-20 h-fit'>
  <Card className='shadow-md border-dashed border- p-4 flex flex-col items-center relative'>


    <div id="update" className='w-full'>
      <Button
        className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-full rounded-none h-12'
        onClick={handleUpdateJob}
        disabled={checkField < 7}
      >
        <Plus className='mr-2' />
        Tạo tin tuyển dụng
      </Button>
    </div>
  </Card>
</div>
        </div>
      </CardContent>
    </Card>
  </>
}