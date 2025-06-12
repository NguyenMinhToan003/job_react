/* eslint-disable @typescript-eslint/no-explicit-any */
import { analysResumeVersion } from '@/apis/applyJobAPI';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table';
import ViewResumeVersion from '@/pages/candidate/dashboard/resume/ViewResumeVersion';
import { ApplyJobByJobIdResponse } from '@/types/applyJobType';
import { convertDateToString } from '@/utils/dateTime';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ViewResumeVersionForJob() {
  const { applyId } = useParams(); 
  const [apply, setApply] = useState<ApplyJobByJobIdResponse>();
  const handleGetApply = async() => {
    try {
      const response = await analysResumeVersion(Number(applyId));
      setApply(response);
    }
    catch (error : any) {
      toast.error(error.response.data.message || 'Lỗi khi lấy thông tin ứng tuyển');
    }
  }
  useEffect(() => {
    if (!applyId) return;
    handleGetApply();
  }, [applyId]);
  return (
    <Card className='w-full '>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          Xem Hồ sơ ứng tuyển
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Sheet>
          <SheetTrigger>
            <Button variant='default' className='w-full font-semibold cursor-pointer ' size='lg'
            >
              Xem hồ sơ
            </Button>
          </SheetTrigger>
          <SheetContent className='min-w-3xl z-[99999] h-[100vh] overflow-y-auto p-2 bg-gray-200'>
            <ViewResumeVersion
              resumeVerIdOption={apply?.resumeVersion.id || 0}
            />
          </SheetContent>
        </Sheet>
        <div className='grid grid-cols-2'>
        <ul className='p-0 m-0 mb-8 space-y-1'>
          <li className='text-lg font-semibold mb-2'>
            Thông tin ứng viên
            </li>
            <li>
              <span className='font-semibold'>Hình ảnh</span>
              <Avatar>
                <AvatarImage
                  src={apply?.resumeVersion.avatar}
                  alt={apply?.resumeVersion.username || 'Avatar'}
                />
              </Avatar>
          </li>
          <li>
            <span className='font-semibold'>Ứng viên: </span>
            {apply?.resumeVersion.username}
          </li>
          <li>
            <span className='font-semibold'>Số điện thoại: </span>
            {apply?.resumeVersion.phone}
          </li>
          <li>
            <span className='font-semibold'>Email: </span>
            {apply?.resumeVersion.email}
          </li>
          <li>
            <span className='font-semibold'>Địa chỉ: </span>
            {apply?.resumeVersion.location}
          </li>
          <li>
            <span className='font-semibold'>Ngày sinh: </span>
            {convertDateToString(apply?.resumeVersion.dateOfBirth)}
          </li>
          <li>
            <span className='font-semibold'>Giới tính: </span>
            {apply?.resumeVersion.gender}
          </li>
          </ul>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-5xl font-semibold mb-2 rounded-full border-4 w-fit p-7 border-green-500 bg-green-100 text-green-700'>
              {apply?.score.total}
            </div>
            <strong className='mb-2'>
              Xếp hạng {apply?.rank}
            </strong>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow className='bg-gray-100 col-span-4'>
              <TableCell>So sánh các thuộc tính của ứng viên</TableCell>
            </TableRow>
          </TableHead>
          <TableRow>
            <TableCell className='w-[150px]'>Tiêu chí</TableCell>
            <TableCell>Công việc</TableCell>
            <TableCell>Ứng viên</TableCell>
            <TableCell className='w-[150px]'>Điểm phù hợp</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Kĩ năng</TableCell>
            <TableCell>
              {apply?.job.skills.map((skill, index) => (
                <Badge key={index} className='mr-2 mb-2'>
                  {skill.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              {apply?.resumeVersion.skills.map((skill, index) => (
                <Badge key={index} className='mr-2 mb-2'>
                  {skill.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              {apply?.score.skillScore.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Địa điểm làm việc</TableCell>
            <TableCell>
              {apply?.job.locations.map((location, index) => (
                <Badge key={index} className='mr-2 mb-2'>
                  {location.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              <Badge>{apply?.resumeVersion.district.city.name}</Badge>
            </TableCell>
            <TableCell>
              {apply?.score.locationScore.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Trình độ học vấn</TableCell>
            <TableCell>
              <Badge>{apply?.job.education.name}</Badge>
            </TableCell>
            <TableCell>
              <Badge>{apply?.resumeVersion.education.name}</Badge>
            </TableCell>
            <TableCell>
              {apply?.score.educationScore.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Chuyên ngành</TableCell>
            <TableCell>
              {
                apply?.majors.map((major, index) => (
                  <Badge key={index} className='mr-2 mb-2'>
                    {major.name}
                  </Badge>
                ))
              }
            </TableCell>
            <TableCell>
              {
                apply?.resumeVersion.majors.map((major, index) => (
                  <Badge key={index} className='mr-2 mb-2'>
                    {major.name}
                  </Badge>
                ))
              }
            </TableCell>
            <TableCell>
              {apply?.score.majorScore.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cấp bậc</TableCell>
            <TableCell>
              {
                apply?.job.levels.map((level, index) => (
                  <Badge key={index} className='mr-2 mb-2'>
                    {level.name}
                  </Badge>
                ))
              }
            </TableCell>
            <TableCell>
              <Badge>{apply?.resumeVersion.level.name}</Badge>
            </TableCell>
            <TableCell>
              {apply?.score.levelScore.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ngoại ngữ</TableCell>
            <TableCell>
              {apply?.job.languageJobs.map((language, index) => (
                <Badge key={index} className='mr-2 mb-2'>
                  {language.language.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              {apply?.resumeVersion.languageResumes.map((language, index) => (
                <Badge key={index} className='mr-2 mb-2'>
                  {language.language.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              {apply?.score.languageScore.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tổng điểm</TableCell>
            <TableCell colSpan={2}>
              
            </TableCell>
            <TableCell>
              <Badge className='bg-green-500 text-white'>
              {apply?.score.total.toFixed(2)}
              </Badge>
            </TableCell>
          </TableRow>
        </Table>
      </CardContent>

    </Card>
  );
}