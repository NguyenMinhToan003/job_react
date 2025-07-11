/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBenefit } from '@/apis/benefitAPI';
import { getAllEducations } from '@/apis/educationAPI';
import { createEmployerNotiAPI } from '@/apis/notiAccountAPI';
import { getExperienceList } from '@/apis/experienceAPI';
import { updateJobAdmin, viewJobAPI } from '@/apis/jobAPI';
import { getAllLanguages } from '@/apis/languageAPI';
import { getLevelList } from '@/apis/levelAPI';
import { getLocationByCompanyAPI } from '@/apis/locationAPI';
import { getSkillList } from '@/apis/skillAPI';
import { getTypeJobList } from '@/apis/typeJobAPI';
import RejectJobForm from '@/components/elements/job/RejectJobForm';
import BenefitJobPopup from '@/components/elements/job/popup/BenefitJobPopup';
import DetailJobPopup from '@/components/elements/job/popup/DetailJobPopup';
import EducationJobPopup from '@/components/elements/job/popup/EducationJobPopup';
import ExperienceJonPopup from '@/components/elements/job/popup/ExperienceJobPopup';
import LanguageJobPopup from '@/components/elements/job/popup/LanguageJobPopup';
import LevelJobPopup from '@/components/elements/job/popup/LevelJobPopup';
import LocationJobPopup from '@/components/elements/job/popup/LocationPopup';
import NameJobPopup from '@/components/elements/job/popup/NameJobPopup copy';
import QuantityJobPopup from '@/components/elements/job/popup/QuantityJobPopup';
import RequirementPopup from '@/components/elements/job/popup/RequirementPopup';
import SalaryJonPopup from '@/components/elements/job/popup/SalaryJobPopup';
import SkillJobPopup from '@/components/elements/job/popup/SkillJobPopup';
import TypeJobPopup from '@/components/elements/job/popup/TypeJobPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Language, LanguageJob } from '@/types/LanguageType';
import { Benefit } from '@/types/benefitType';
import { Education } from '@/types/educationType';
import { Experience } from '@/types/experienceType';
import { Level } from '@/types/levelType';
import { LocationResponse } from '@/types/location';
import { Skill } from '@/types/SkillType';
import { ACCOUNT_STATUS, JOB_STATUS, NOTI_TYPE, ROLE_LIST } from '@/types/type';
import { TypeJob } from '@/types/TypeJobType';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MatchingJobPopup from '@/components/elements/job/popup/MatchingJobPopup';
import ExpiredJobPopup from '@/components/elements/job/popup/ExpiredJobPopup';
import { Field } from '@/types/majorType';
import { getFieldList } from '@/apis/fieldAPI';
import FieldJobPopup from '@/components/elements/job/popup/FieldJobPopup';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Label } from '@/components/ui/label';
import { EmployerResponse } from '@/types/accountType';

export default function ViewJob() {
  const url = window.location.href;
  const id = url.substring(url.lastIndexOf('/') + 1);
  const [employer, setEmployer] = useState<EmployerResponse>();
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
  const [salaryMin, setSalaryMin] = useState<number| null>(null);
  const [salaryMax, setSalaryMax] = useState<number| null>(null);
  const [typeJobList, setTypeJobList] = useState<TypeJob[]>([]);
  const [typeJobId, setTypeJobId] = useState<number[]>([]);
  const [locationIds, setLocationIds] = useState<number[]>([]);
  const [locationList, setLocationList] = useState<LocationResponse[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState<number[]>([]);
  const [isActive, setIsActive] = useState<JOB_STATUS>(JOB_STATUS.PENDING);
  const [educationsList, setEducationsList] = useState<Education[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<number>();
  const [expiredAt, setExpiredAt] = useState<Date| null>(null);
  const [locationWeight, setLocationWeight] = useState(0);
  const [skillWeight, setSkillWeight] = useState(0);
  const [majorWeight, setMajorWeight] = useState(0);
  const [languageWeight, setLanguageWeight] = useState(0);
  const [educationWeight, setEducationWeight] = useState(0);
  const [levelWeight, setLevelWeight] = useState(0);

  const [languageList, setLanguageList] = useState<Language[]>([]);
  const [languageIds, setLanguageIds] = useState<LanguageJob[]>([]);
  const [selectField, setSelectField] = useState<Field | null>(null);
  const [selectMajors, setSelectMajors] = useState<number[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const role = localStorage.getItem('role');
  const navigate = useNavigate()


  const fetchDataJob = async () => {
    try {
      const response = await viewJobAPI(+id);
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
      setEmployer(response.employer);
      setIsActive(response.isActive);
      setLocationList(response.locations);
    }
    catch(error) {
      toast.error((error as any).response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu bài đăng');
    }
  }

  const fetchElements = async () => {
    try {

      const [benefits, levels, experiences, types, locations, skills, educations, languages, fieldLs] = await Promise.all([
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
      setFields(fieldLs);
    }
    catch(error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    }
  }

  useEffect(() => {
    fetchElements()
  }, [])

  useEffect(() => {
    fetchDataJob();
  }, [fields]);

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
      createEmployerNotiAPI({
        content: `Công việc '${nameJob}' đã được duyệt.`,
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
    <Card className='w-full bg-transparent shadow-none border-none'>
      <CardHeader>
        <CardTitle className='font-bold text-2xl flex justify-between items-center'>
          <div>REVIEW</div>
        </CardTitle>
      </CardHeader>
      <CardContent className='py-4'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1'>
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
            <ExpiredJobPopup
              expiredAt={expiredAt}
              setExpiredAt={setExpiredAt}
              isEdit={true}
            />
            <RequirementPopup requirement={requirement} setRequirement={setRequirement} notEdit={true} />
            <EducationJobPopup
              educationList={educationsList}
              setEducationId={setSelectedEducation}
              educationId={selectedEducation}
              notEdit={true}
            />
            <LanguageJobPopup
              languageList={languageList}
              languageIds={languageIds}
              setLanguageIds={setLanguageIds}
              notEdit={true}
            />
            <LevelJobPopup levelList={levelList} levelIds={levelIds} setLevelIds={setLevelIds} notEdit={true} />
            <ExperienceJonPopup experienceId={experienceId} setExperienceId={setExperienceId} experienceList={experienceList || []} notEdit={true} />
            <BenefitJobPopup benefitList={benefitList} setBenefitIds={setBenefitIds} benefitIds={benefitIds} notEdit={true} />
            <TypeJobPopup typeJobList={typeJobList} typeJobId={typeJobId} setTypeJobId={setTypeJobId} notEdit={true} />
            <FieldJobPopup
              selectField={selectField}
              setSelectField={setSelectField}
              fields={fields}
              selectMajors={selectMajors}
              setSelectMajors={setSelectMajors}
              notEdit={true}
            />
            <SkillJobPopup skillList={skillList} selectedSkills={skillId} setSelectedSkills={setSkillId} notEdit={true} />

            {
              role === ROLE_LIST.EMPLOYER &&
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
                isEdit={true}
              />
            }
          </div>

          {/* Right side: Action Buttons */}
          <div className='w-[300px] sticky top-20 h-56'>
            <Card className=''>
              <CardHeader>
                <CardTitle className='text-lg font-bold text-start'>HÀNH ĐỘNG</CardTitle>
                <div className='w-full h-[1px] bg-gray-200 mt-4' />
                 Trạng thái hiện tại 
                <Label className='text-[#451DA0] font-semibold'>
                  {isActive === JOB_STATUS.ACTIVE ? 'Đã kích hoạt' :
                      isActive === JOB_STATUS.BLOCK ? 'Đã từ chối' :
                    isActive === JOB_STATUS.PENDING ? 'Đang chờ duyệt' :
                        isActive === JOB_STATUS.CREATE ? 'Đang tạo' : null}
                </Label>
                {
                  role === ROLE_LIST.ADMIN && <>
                  <div className='w-full h-[1px] bg-gray-200 mt-4' />
                <Label
                  className={clsx(
                  'text-[#451DA0] font-semibold',
                  employer?.account?.status === ACCOUNT_STATUS.ACTIVE && 'text-green-500',
                  employer?.account?.status === ACCOUNT_STATUS.BLOCKED && 'text-red-500',
                  employer?.account?.status === ACCOUNT_STATUS.CREATED && 'text-yellow-500'

                  )}>
                  Tài khoản {' '}
                  {
                    employer?.account?.status === ACCOUNT_STATUS.ACTIVE ? 'Đã kiểm duyệt' :
                    employer?.account?.status === ACCOUNT_STATUS.BLOCKED ? 'Đã khóa' :
                    employer?.account?.status === ACCOUNT_STATUS.CREATED ? 'Chưa kiểm duyệt ' : null
                  }
                    </Label>
                     <Button
                  variant={'link'}
                  onClick={() => navigate(`/admin/nha-tuyen-dung/ ${employer?.id}`)}
                >
                  Xem trang nhà tuyển dụng
                </Button>
                  </>
                }
               
              </CardHeader>
              {
                role === ROLE_LIST.ADMIN && <CardContent>
                <Button
                  className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-full rounded-none h-12 mt-4'
                  onClick={handleActivateJob}
                  disabled={isActive === JOB_STATUS.ACTIVE}
                >
                  Kích hoạt công việc
                </Button>
                <RejectJobForm
                  employerId={employer?.id || -1}
                  id={id}
                />

              </CardContent>
              }
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
