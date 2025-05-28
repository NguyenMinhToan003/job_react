/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBenefit } from '@/apis/benefitAPI';
import { createEmployerNotiAPI } from '@/apis/employerNotiAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { updateJobAdmin, viewJobAPI } from '@/apis/jobAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getLocationByCompanyAPI } from '@/apis/locationAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import RejectJobForm from '@/components/elements/job/RejectJobForm';
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
import { Employer } from '@/types/companyType';
import { Experience } from '@/types/experienceType';
import { Level } from '@/types/levelType';
import { LocationResponse } from '@/types/location';
import { Skill } from '@/types/skillType';
import { JOB_STATUS, NOTI_TYPE, ROLE_LIST } from '@/types/type';
import { TypeJob } from '@/types/typeJobType';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ViewJob() {
  const url = window.location.href;
  const id = url.substring(url.lastIndexOf('/') + 1);
  const [employer, setEmployer] = useState<Employer>();
  const [nameJob, setNameJob] = useState('');
  const [quantityJob, setQuantityJob] = useState(1);
  const [description, setDescription] = useState('');
  const [requirement, setRequirement] = useState('');
  const [levelList, setLevelList] = useState<Level[]>([]);
  const [levelIds, setLevelIds] = useState<string[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>();
  const [experienceId, setExperienceId] = useState<number>(1);
  const [benefitList, setBenefitList] = useState<Benefit[]>([]);
  const [benefitIds, setBenefitIds] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(0);
  const [typeJobList, setTypeJobList] = useState<TypeJob[]>([]);
  const [typeJobId, setTypeJobId] = useState<number[]>([]);
  const [locationIds, setLocationIds] = useState<number[]>([]);
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState<number[]>([]);
  const [isActive, setIsActive] = useState<JOB_STATUS>(JOB_STATUS.PENDING);

  const role = localStorage.getItem('role');

  const fetchLevelList = async () => {
    try {
      const response = await getLevelList();
      setLevelList(response);
    } catch (error) {
      console.error('Error fetching level list:', error);
    }
  };

  const fetchExperienceList = async () => {
    try {
      const response = await getExperienceList();
      setExperienceList(response);
    } catch (error) {
      console.error('Error fetching experience list:', error);
    }
  };

  const fetchBenefitList = async () => {
    try {
      const response = await getBenefit();
      setBenefitList(response);
    } catch (error) {
      console.error('Error fetching benefit list:', error);
    }
  };

  const fetchTypeJobList = async () => {
    try {
      const response = await getTypeJobList();
      setTypeJobList(response);
    } catch (error) {
      console.error('Error fetching type job list:', error);
    }
  };

  const fetchLocationList = async () => {
    try {
      const response = await getLocationByCompanyAPI();
      setLocationList(response);
    } catch (error) {
      console.error('Error fetching location list:', error);
    }
  };

  const fetchSkillList = async () => {
    try {
      const response = await getSkillList();
      setSkillList(response);
    } catch (error) {
      console.error('Error fetching skill list:', error);
    }
  };

  const fetchDataJob = async () => {
    try {
      const response = await viewJobAPI(+id);
      if (locationList.length === 0) {
        setLocationList(response.locations);
      }
      setEmployer(response.employer);
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
      setIsActive(response.isActive);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin công việc');
    }
  };

  useEffect(() => {
    fetchLevelList();
    fetchExperienceList();
    fetchBenefitList();
    fetchTypeJobList();
    fetchLocationList();
    fetchDataJob();
    fetchSkillList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActivateJob = async () => {
    try {
      if (employer?.id === -1) {
        toast.error('Không tìm thấy nhà tuyển dụng liên kết với công việc này');
        return;
      }
      await updateJobAdmin(+id, {
        isActive: JOB_STATUS.ACTIVE,
      });
      setIsActive(JOB_STATUS.ACTIVE);
      await createEmployerNotiAPI({
        content: `Công việc "${nameJob}" đã được duyệt.`,
        receiverAccountId: employer?.id || -1,
        title: 'Công việc đã được duyệt',
        link: `/danh-cho-nha-tuyen-dung/thong-tin-tuyen-dung/${id}`,
        type: NOTI_TYPE.ACCEPTED,
      })
      toast.success('Đã kích hoạt công việc');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt công việc');
    }
  };

  return (
    <Card className="w-full bg-[#f7f7f7]">
      <CardHeader>
        <CardTitle className="font-bold text-2xl flex justify-between items-center">
          <div>REVIEW</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <NameJobPopup nameJob={nameJob} setNameJob={setNameJob} notEdit={true} />
            <SalaryJonPopup
              salaryMin={salaryMin}
              setSalaryMin={setSalaryMin}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
              notEdit={true}
            />
            <QuantityJobPopup quantityJob={quantityJob} setQuantityJob={setQuantityJob} notEdit={true} />
            <LocationJobPopup locationIds={locationIds} setLocationIds={setLocationIds} locationList={locationList} notEdit={true} />
            <DetailJobPopup description={description} setDescription={setDescription} notEdit={true} />

            <RequirementPopup requirement={requirement} setRequirement={setRequirement} notEdit={true} />
            <LevelJobPopup levelList={levelList} levelIds={levelIds} setLevelIds={setLevelIds} notEdit={true} />
            <ExperienceJonPopup experienceId={experienceId} setExperienceId={setExperienceId} experienceList={experienceList || []} notEdit={true} />
            <BenefitJobPopup benefitList={benefitList} setBenefitIds={setBenefitIds} benefitIds={benefitIds} notEdit={true} />
            <TypeJobPopup typeJobList={typeJobList} typeJobId={typeJobId} setTypeJobId={setTypeJobId} notEdit={true} />
            <SkillJobPopup skillList={skillList} selectedSkills={skillId} setSelectedSkills={setSkillId} notEdit={true} />
          </div>

          {/* Right side: Action Buttons */}
          <div className="w-full md:w-[300px] sticky top-20 h-56">
            <Card className="shadow-md border-dashed border-2 border-gray-300 p-4 h-full flex flex-col justify-center items-center">
              <div>
                <div className="text-sm text-gray-500 text-center font-bold flex flex-col items-center gap-3">
                  {isActive === JOB_STATUS.PENDING ? (
                    role === ROLE_LIST.ADMIN ? (
                      <>
                        <Button variant="destructive" className="cursor-pointer w-full" onClick={handleActivateJob}>
                          DUYỆT CÔNG VIỆC
                        </Button>
                        <RejectJobForm
                          id={id}
                          employerId={employer?.id || -1}
                        />
                       
                      </>
                    ) : (
                      <div>Hãy chờ đến khi công việc được duyệt.</div>
                    )
                  ) : isActive === JOB_STATUS.ACTIVE ? (
                    <div className="text-green-600">Công việc đã được duyệt</div>
                  ) : isActive === JOB_STATUS.BLOCK ? (
                    <div className="text-red-600">Công việc đã bị từ chối</div>
                  ) : null}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
