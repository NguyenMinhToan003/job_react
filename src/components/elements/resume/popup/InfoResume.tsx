/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ResumeVersion } from '@/types/resumeType';
import { convertDateToString } from '@/utils/dateTime';
import { Calendar, Edit, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InfoResume({ resumeVer }: { resumeVer: ResumeVersion }) {
  const navigate = useNavigate()
  return (
    <>
      <Card className='p-2'>
        <CardHeader className='p-2'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <Avatar className='w-20 h-20'>
                <AvatarImage src={resumeVer.avatar} />
              </Avatar>
              <div className='flex flex-col justify-between items-start gap-1'>
                <h1 className='font-extrabold text-2xl'>{resumeVer.username}</h1>
                <p className='font-bold text-gray-700 text-sm'>
                  {resumeVer.resume.name}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              <Edit onClick={() => navigate(`/tong-quat-ho-so/chinh-sua-ho-so/${resumeVer.resume.id}`)} className='w-5 h-5 text-red-600 cursor-pointer' />
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3 pb-4'>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Mail className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resumeVer.email}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Phone className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resumeVer.phone}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{convertDateToString(resumeVer.dateOfBirth)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>{resumeVer.gender}</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>
                {resumeVer.district?.name + ', ' + resumeVer.district?.city?.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Globe className='w-4 h-4 text-gray-500' />
              <span className='font-semibold text-sm text-gray-700'>
                {resumeVer.location}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
