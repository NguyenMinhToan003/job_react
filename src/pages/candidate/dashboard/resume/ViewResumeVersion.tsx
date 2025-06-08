/* eslint-disable react-hooks/exhaustive-deps */
import { getResumeVersionsByIdAPI } from '@/apis/resumeAPI';
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

export default function ViewResumeVersion({resumeVerIdOption}: { resumeVerIdOption?: number }) {
  const [resume, setResume] = useState<ResumeVersion>();
  const { resumeVerId } = useParams<{ resumeVerId: string }>();

  const fetchResume = async () => {
    try {
      console.log('resumeVerIdOption', resumeVerIdOption);
      const response = await getResumeVersionsByIdAPI(resumeVerIdOption?resumeVerIdOption:Number(resumeVerId));
      setResume(response);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  }

  useEffect(() => {
    if (resumeVerId || resumeVerIdOption) {
      fetchResume();
    }
  }, [resumeVerId, resumeVerIdOption]);

  if (!resume) {
    return <div>Loading...</div>;
  }
  return (
    <div className='space-y-4 w-5xl max-w-full'>
      <InfoResume
        resumeVer={resume}
        onView={resumeVerIdOption ? true : false}
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