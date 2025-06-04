import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ResumeVersion } from '@/types/resumeType';
import { convertDateToString } from '@/utils/dateTime';
import { Calendar, Edit, Globe, Mail, MapPin, Phone, User } from 'lucide-react';

export default function InfoResume({resumeVer}: { resumeVer: ResumeVersion}) {
  return (
    <Card className='p-2 shadow-xl' >
      <CardHeader className='p-2'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <Avatar className='w-18 h-18'>
              <AvatarImage src={resumeVer.imageResume} alt={resumeVer.userName} />
            </Avatar>
            <div>
              <h1 className='text-xl font-bold text-black mb-1'>
                {resumeVer.userName}
              </h1>
              <p className='text-gray-600 text-sm'>it</p>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-2'>
            <Edit className='w-4 h-4 text-red-500' />
            <span className='text-red-500'>Chỉnh sửa</span>
            <span className='text-gray-400'>|</span>
            <span className='text-gray-400'>Tải xuống</span>
            <span className='text-gray-400'>|</span>
            <span className='text-gray-400'>Xem trước</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-3 pb-4'>
        <div className='grid grid-cols-2 gap-x-8 gap-y-3 text-sm'>
          <div className='flex items-center gap-2'>
            <Mail className='w-4 h-4 text-gray-400' />
            <span className='text-red-500'>
              {resumeVer.email || 'chua co email'}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Phone className='w-4 h-4 text-gray-400' />
            <span className='text-gray-700'>
              {resumeVer.phoneNumber || 'chua co so dien thoai'}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4 text-gray-400' />
            <span className='text-gray-700'>
              {convertDateToString(resumeVer.dateOfBirth) || 'chua co ngay sinh'}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <User className='w-4 h-4 text-gray-400' />
            <span className='text-gray-700'>Nam</span>
          </div>
          <div className='flex items-center gap-2'>
            <MapPin className='w-4 h-4 text-gray-400' />
            <span className='text-gray-700'>
              {resumeVer.district?.name + ', ' + resumeVer.district?.city?.name || 'chua co dia chi'}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Globe className='w-4 h-4 text-gray-400' />
            <span className='text-red-500'>youtube.com</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}