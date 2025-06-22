/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getResumeVersionsByIdAPI } from '@/apis/resumeAPI';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeVersion } from '@/types/resumeType';
import { convertDateToString } from '@/utils/dateTime';
import { Calendar, Edit, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ViewResumeVersion({ resumeVerIdOption }: { resumeVerIdOption?: number }) {
  const [resume, setResume] = useState<ResumeVersion>();
  const { resumeVerId } = useParams<{ resumeVerId: string }>();
  const navigate = useNavigate();

  const fetchResume = async () => {
    try {
      const response = await getResumeVersionsByIdAPI(resumeVerIdOption ? resumeVerIdOption : Number(resumeVerId));
      setResume(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  };

  useEffect(() => {
    if (resumeVerId || resumeVerIdOption) {
      fetchResume();
    }
  }, [resumeVerId, resumeVerIdOption]);

  if (!resume) {
    return <div className='text-center text-gray-600'>Loading...</div>;
  }

  return (
    <div className='space-y-4 w-5xl max-w-full p-4 bg-gray-50'>
      {/* InfoResume */}
      <Card className='p-2 shadow-md border border-gray-200 rounded-xl bg-white'>
        <CardHeader className='p-2'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <Avatar className='w-20 h-20 ring-2 ring-[#7C3AED] ring-offset-2 rounded-full'>
                <AvatarImage src={resume.avatar} />
              </Avatar>
              <div className='flex flex-col justify-between items-start gap-1'>
                <h1 className='font-extrabold text-2xl text-[#7C3AED]'>{resume.username}</h1>
                <p className='font-bold text-gray-700 text-sm'>{resume.resume.name}</p>
              </div>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              {!resumeVerIdOption && (
                <Edit
                  onClick={() => navigate(`/tong-quat-ho-so/chinh-sua-ho-so/${resume.resume.id}`)}
                  className='w-5 h-5 text-red-600 cursor-pointer'
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3 pb-4'>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Mail className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resume.email}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Phone className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resume.phone}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{convertDateToString(resume.dateOfBirth)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resume.gender}</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>
                {resume.district?.name + ', ' + resume.district?.city?.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Globe className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resume.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AboutMeResume */}
      <Card className='shadow-md border border-gray-200 rounded-xl bg-white'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle className='text-xl font-bold text-[#7C3AED]'>GIỚI THIỆU BẢN THÂN</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <ul className='list-disc pl-5 space-y-2'>
            {resume.about?.split('\n').map((item, index) => (
              <li key={index} className='text-gray-700 marker:text-red-600 font-semibold'>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className='shadow-md border border-gray-200 rounded-xl bg-white'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle className='text-xl font-bold text-[#7C3AED]'>TRÌNH ĐỘ</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <ul className='list-disc pl-5 space-y-2'>
            <li className='text-gray-700 marker:text-red-600 font-semibold'>
              Chuyên ngành:
              <ul className='list-decimal pl-5'>
                {resume.majors?.length > 0 ? (
                  resume.majors.map((major) => (
                    <li key={major.id} className='text-gray-700 marker:text-red-600'>
                      {major.name}
                    </li>
                  ))
                ) : (
                  <li className='text-gray-700 marker:text-red-600'>Chưa cập nhật</li>
                )}
              </ul>
            </li>
            <li className='text-gray-700 marker:text-red-600 font-semibold'>
              Trình độ học vấn: {resume.education?.name || 'Chưa cập nhật'}
            </li>
            <li className='text-gray-700 marker:text-red-600 font-semibold'>
              Cấp bậc: {resume.level?.name || 'Chưa cập nhật'}
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* SkillResume */}
      <Card className='shadow-md border border-gray-200 rounded-xl bg-white'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle className='text-xl font-bold text-[#7C3AED]'>KỸ NĂNG</CardTitle>
        </CardHeader>
        <CardContent className='pt-0 space-y-4'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='flex gap-2 flex-wrap'>
                {resume.skills.map((skill, index) => (
                  <Badge
                    variant='outline'
                    key={index}
                    className='text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-600 bg-gray-100 hover:border-[#7C3AED] transition-colors duration-200 font-semibold'
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LanguageResume */}
      <Card className='shadow-md border border-gray-200 rounded-xl bg-white'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle className='text-xl font-bold text-[#7C3AED]'>NGÔN NGỮ</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              {resume.languageResumes.length > 0 && (
                <ul className='list-disc pl-5 space-y-2'>
                  {resume.languageResumes.map((language, index) => (
                    <li key={index} className='text-gray-700 marker:text-red-600 font-semibold'>
                      {language.language.name} - {language.level}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <iframe
        src={resume.urlPdf}
        className='w-full h-[600px] '
        title='Resume PDF'
      ></iframe>
    </div>
  );
}