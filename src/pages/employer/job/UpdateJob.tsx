/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBenefit } from '@/apis/benefitAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { deleteJob, getDetailJobById, updateJob } from '@/apis/jobAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getLocationByCompanyAPI } from '@/apis/locationAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import BenefitJobPopup from '@/components/elements/popup/BenefitJobPopup';
import DetailJobPopup from '@/components/elements/popup/DetailJobPopup';
import ExperienceJonPopup from '@/components/elements/popup/ExperienceJobPopup';
import LevelJobPopup from '@/components/elements/popup/LevelJobPopup';
import LocationJobPopup from '@/components/elements/popup/LocationPopup';
import NameJobPopup from '@/components/elements/popup/NameJobPopup copy';
import QuantityJobPopup from '@/components/elements/popup/QuantityJobPopup';
import RequirementPopup from '@/components/elements/popup/RequirementPopup';
import SalaryJonPopup from '@/components/elements/popup/SalaryJobPopup';
import SkillJobPopup from '@/components/elements/popup/SkillJobPopup';
import TypeJobPopup from '@/components/elements/popup/TypeJobPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Benefit } from '@/types/benefitType';
import { Experience } from '@/types/experienceType';

import { Level } from '@/types/levelType';
import { LocationResponse } from '@/types/location';
import { Skill } from '@/types/skillType';
import { TypeJob } from '@/types/typeJobType';
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
  const [salaryMin, setSalaryMin] = useState<number>(0)
  const [salaryMax, setSalaryMax] = useState<number>(0)
  const [checkField, setCheckField] = useState(0)
  const [typeJobList, setTypeJobList] = useState<TypeJob[]>([])
  const [typeJobId, setTypeJobId] = useState<number[]>([])
  const [locationIds, setLocationIds] = useState<number[]>([])
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([])
  const [skillId, setSkillId] = useState<number[]>([])

  const handleUpdateJob = async () => {
    try {
      await updateJob(+id, {
        name: nameJob,
        locations: locationIds,
        skills: skillId,
        quantity: quantityJob,
        levels: levelIds,
        types: typeJobId,
        requirement,
        description,
        minSalary: salaryMin,
        maxSalary: salaryMax,
        benefits: benefitIds,
        experience: experienceId,
      });
      toast.success('Cập nhật bài đăng thành công');
    }
    catch (error : any) {
      toast.error(error.response.data.message);
    }
  }

  const fetchLevelList = async () => {
    try {
      const response = await getLevelList();
      setLevelList(response);
    } catch (error) {
      console.error('Error fetching level list:', error);
    }
  }
  const fetchExperienceList = async () => {
    try {
      const response = await getExperienceList();
      setExperienceList(response);
    } catch (error) {
      console.error('Error fetching experience list:', error);
    }
  }
  const fetchBenefitList = async () => {
    try {
      const response = await getBenefit();
      setBenefitList(response);
    } catch (error) {
      console.error('Error fetching benefit list:', error);
    }
  }
  const fetchTypeJobList = async () => {
    try {
      const response = await getTypeJobList();
      setTypeJobList(response);
    } catch (error) {
      console.error('Error fetching type job list:', error);
    }
  }
  const fetchLocationList = async () => {
    try {
      const response = await getLocationByCompanyAPI();
      setLocationList(response);
    } catch (error) {
      console.error('Error fetching location list:', error);
    }
  }
  const fetchSkillList = async () => {
    try {
      const response = await getSkillList()
      setSkillList(response);
    } catch (error) {
      console.error('Error fetching skill list:', error);
    }
  }

  const fetchDataJob = async () => {
    try {
      const response = await getDetailJobById(+id);
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
    }
    catch(error) {
      console.error('Error fetching job data:', error);
    }
  }
  useEffect(() => {
    fetchLevelList();
    fetchExperienceList();
    fetchBenefitList();
    fetchTypeJobList();
    fetchLocationList();
    fetchDataJob();
    fetchSkillList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteJob = async () => {
    try {
      await deleteJob(+id);
      window.history.back();
    }
    catch (error: any) {
      toast.error(error.response.data.message);
    }
  }
  
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
    <Card className='w-full bg-[#f7f7f7]'>
      <CardHeader>
        <CardTitle className='font-bold text-2xl flex justify-between items-center'>
          <div>CẬP NHẬT BÀI ĐĂNG TUYỂN DỤNG</div>
          <Button
            className='bg-[#ed1b2f] text-white rounded-md px-4 py-2 mt-2'
            onClick={() => handleDeleteJob()}
          >
            XÓA
            </Button>
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
            <DetailJobPopup
              description={description}
              setDescription={setDescription}
            />
            <RequirementPopup
              requirement={requirement}
              setRequirement={setRequirement}
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
            <SkillJobPopup
              skillList={skillList}
              selectedSkills={skillId}
              setSelectedSkills={setSkillId}
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