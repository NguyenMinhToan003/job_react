/* eslint-disable react-hooks/exhaustive-deps */
import { viewResumeAPI } from '@/apis/resumeAPI';
import AboutMeResume from '@/components/elements/resume/popup/AboutMeResume';
import EdicationResume from '@/components/elements/resume/popup/EducationResume';
import ExpResume from '@/components/elements/resume/popup/ExpResume';
import InfoResume from '@/components/elements/resume/popup/InfoResume';
import LanguageResume from '@/components/elements/resume/popup/LanguageResume';
import SkillResume from '@/components/elements/resume/popup/SkillResume';
import { ResumeVersion } from '@/types/resumeType';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function Resume() {
  const [resume, setResume] = useState<ResumeVersion>();
  const { resumeId } = useParams<{ resumeId: string }>();

  const fetchResume = async () => {
    try {
      const response = await viewResumeAPI(Number(resumeId));
      setResume(response);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  }

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [])

  if (!resume) {
    return <div>Loading...</div>;
  }
  return (
    <div className='space-y-4'>
      <InfoResume
        resumeVer={resume}
      />
      <AboutMeResume 
        resumeVer={resume}
      />
      <ExpResume
        resumeVer={resume}
      />
      <EdicationResume
        resumeVer={resume}
      />
      <SkillResume
        resumeVer={resume}
      />
      <LanguageResume 
        resumeVer={resume}
      />
    </div>
  );
}