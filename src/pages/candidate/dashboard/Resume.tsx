import { getMeResumeAPI } from '@/apis/resumeAPI';
import AboutMeResume from '@/components/elements/resume/popup/AboutMeResume';
import EdicationResume from '@/components/elements/resume/popup/EducationResume';
import InfoResume from '@/components/elements/resume/popup/InfoResume';
import LanguageResume from '@/components/elements/resume/popup/LanguageResume';
import SkillResume from '@/components/elements/resume/popup/SkillResume';
import { ResumeVersion } from '@/types/resumeType';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ProfileCards() {
  const printRef = useRef();
  const [resume, setResume] = useState<ResumeVersion>();
  const handleDownload = () => {
    const element = printRef.current;

    const opt = {
      margin: 0.5,
      filename: `${resume?.userName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const fetchResume = async () => {
    try {
      const response = await getMeResumeAPI(14);
      setResume(response.resumeVers[0]);
    }
    catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  }

  useEffect(() => {
    fetchResume();
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