import { useRef, useEffect, useState } from 'react';
import { html2pdf } from 'html2pdf-ts'; 
import { convertDateToString } from '@/utils/dateTime';
import { ResumeVersion } from '@/types/resumeType';
import { useParams } from 'react-router-dom';
import { viewResumeAPI } from '@/apis/resumeAPI';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const CVTemplate = () => {
  const cvRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<ResumeVersion | null>(null);
  const { resumeId } = useParams<{ resumeId: string }>();

  // Fetch resume data
  const fetchResume = async () => {
    try {
      const response = await viewResumeAPI(Number(resumeId));
      setResume(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  // Generate CV PDF
  const generateCV = () => {
    if (cvRef.current && resume) {
      const options = {
        margin: 10,
        filename: `${resume.username}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().from(cvRef.current).set(options).save();
    }
  };

  if (!resume) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={generateCV}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Tạo CV
      </button>

      {/* CV Template */}
      <div
        ref={cvRef}
        className="bg-white max-w-4xl mx-auto p-6 shadow-lg rounded-lg print:p-0 print:shadow-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <header className="text-center pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">{resume.username}</h1>
          <p className="text-lg text-gray-600 mt-2">{resume.resume.name}</p>
          <div className="mt-4 text-sm text-gray-500 space-x-4">
            <span>{resume.email}</span>
            <span>{resume.phone}</span>
            <span>{convertDateToString(resume.dateOfBirth)} ({calculateAge(resume.dateOfBirth)} tuổi)</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Personal Info */}
          <aside className="md:col-span-1 space-y-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Thông Tin Cá Nhân</h2>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>Giới tính: {resume.gender}</li>
                <li>Địa chỉ: {resume.district?.name}, {resume.district?.city?.name}</li>
                <li>Khu vực: {resume.location}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Kỹ Năng</h2>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {resume.skills.length > 0 ? (
                  resume.skills.map((skill, index) => (
                    <p key={index}>- {skill.name}</p>
                  ))
                ) : (
                  <p>Chưa cập nhật</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Ngôn Ngữ</h2>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {resume.languageResumes.length > 0 ? (
                  resume.languageResumes.map((lang, index) => (
                    <p key={index}>- {lang.language.name}</p>
                  ))
                ) : (
                  <p>Chưa cập nhật</p>
                )}
              </div>
            </section>
          </aside>

          {/* Right Column - Education & Experience */}
          <main className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Giới Thiệu</h2>
              <p className="text-sm text-gray-600 mt-2">
                {resume.about?.split('\n').map((item, index) => (
                  <span key={index}>{item}<br /></span>
                ))}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Học Vấn</h2>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p>Chuyên ngành: {resume.majors?.length > 0 ? resume.majors.map((m) => m.name).join(', ') : 'Chưa cập nhật'}</p>
                <p>Trình độ: {resume.education?.name || 'Chưa cập nhật'}</p>
                <p>Cấp bậc: {resume.level?.name || 'Chưa cập nhật'}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Mức Lương Mong Muốn</h2>
              <p className="text-sm text-gray-600 mt-2">
                {resume.expectedSalary !== null ? `${resume.expectedSalary.toLocaleString()} Triệu Đồng` : 'Chưa cập nhật'}
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate age
const calculateAge = (dateOfBirth?: string): number | string => {
  if (!dateOfBirth || !dayjs(dateOfBirth, 'YYYY-MM-DD', true).isValid()) return 'N/A';
  const today = dayjs();
  const birthDate = dayjs(dateOfBirth);
  let age = today.year() - birthDate.year();
  if (today.month() < birthDate.month() || (today.month() === birthDate.month() && today.day() < birthDate.day())) {
    age--;
  }
  return age;
};

export default CVTemplate;