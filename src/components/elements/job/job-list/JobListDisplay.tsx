/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { getDetailJobById } from '@/apis/jobAPI';
import { saveJob } from '@/apis/saveJobAPI';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { JobFilterResponse } from '@/types/jobType';
import {
  HandCoins,
  MapPin,
  Book,
  Building2,
  ExternalLink,
  Heart,
  Users,
  Clock,
  Calendar,
  GraduationCap,
  Globe,
  Trophy,
  Target,
  Briefcase,
  Star,
  Eye,
  CheckCircle
} from 'lucide-react';
import { convertDateToString, dayRemaning } from '@/utils/dateTime';
import { convertPrice } from '@/utils/convertPrice';

export default function JobListDetail({ jobDetailId }: { jobDetailId: number }) {
  const navigate = useNavigate();
  const [job, setJob] = useState<JobFilterResponse>();
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await getDetailJobById(+jobDetailId);
      setJob(res);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobDetailId) {
      fetchJob();
    }
  }, [jobDetailId]);

  const handleSaveJob = async (jobId: number) => {
    try {
      await saveJob(jobId);
      toast.success('Lưu công việc thành công!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi lưu công việc');
    }
  };

  if (loading || !job) {
    return (
      <div className='sticky top-4'>
        <Card className='bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden h-[400px]'>
          <CardContent className='p-6 space-y-6'>
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className='sticky top-4'>
      <Card className='overflow-hidden shadow-lg'>
        <CardContent className='p-6 space-y-6'>
          <div className='flex-1 space-y-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-25 h-25 shadow-xl border border-gray-400 rounded-sm'>
                <AvatarImage src={job.employer.logo} />
              </Avatar>
              <div className='flex flex-col gap-2'>
                <div className='text-2xl font-bold text-[#000209'>
                  <NavLink
                    to={`/cong-viec/${job.id}`}
                    className='hover:underline cursor-pointer'
                  >
                    {job.name}
                  </NavLink>
                </div>
                <span
                  onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
                  className='text-sm font-semibold text-[#000209 cursor-pointer hover:underline flex items-center gap-1'
                >
                  <Building2 size={14} />
                  {job.employer.name}
                </span>
                <div className='flex items-center gap-2 text-green-600 font-bold text-xl'>
                  <HandCoins size={16} />
                  <span>{convertPrice(job.minSalary,job.maxSalary)}</span>
                </div>
              </div>
            </div>

            {/* Status badges */}
            <div className='flex items-center gap-2 flex-wrap'>
              {job.isApplied && (
                <Badge className='bg-green-100 text-green-700 border-green-300'>
                  <CheckCircle size={12} className='mr-1' />
                  Đã ứng tuyển
                </Badge>
              )}
              {job.isSaved && (
                <Badge className='bg-red-100 text-red-700 border-red-300'>
                  <Heart size={12} className='mr-1' />
                  Đã lưu
                </Badge>
              )}
              {dayRemaning(job.expiredAt) <= 7 && dayRemaning(job.expiredAt) > 0 && (
                <Badge className='bg-orange-100 text-orange-700 border-orange-300'>
                  <Clock size={12} className='mr-1' />
                  Còn {dayRemaning(job.expiredAt)} ngày
                </Badge>
              )}
              {job.matchingWeights && (
                <Badge className='bg-blue-100 text-blue-700 border-blue-300'>
                  <Star size={12} className='mr-1' />
                  Phù hợp
                </Badge>
              )}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {job.isApplied ? (
              <Button className='bg-orange-100 text-green-700 font-bold flex-1 cursor-pointer rounded-none h-[45px]'
                variant={'outline'}
              >
                <CheckCircle className='w-4 h-4 mr-2' />
                Bạn đã ứng tuyển  
              </Button>
            ) : (
              <Button
                className='bg-red-600 hover:bg-red-600 text-white font-bold flex-1 cursor-pointer rounded-none h-[45px]'
                onClick={() => navigate(`/ung-tuyen-cong-viec/${job.id}`)}
                disabled={loading}
              >
                <Target className='w-4 h-4 mr-2' />
                Ứng tuyển
              </Button>
            )}

            {job.isSaved ? (
              <Button
                className='font-bold cursor-pointer rounded-none h-[45px] text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600'
                variant={'outline'}
              >
                <Heart className='w-4 h-4 mr-2 fill-current' /> Đã lưu
              </Button>
            ) : (
                <Button
                  className='font-bold cursor-pointer rounded-none h-[45px]'
                  variant={'outline'}
                  onClick={() => handleSaveJob(job.id)}
                >
                  <Heart className='w-4 h-4 mr-2' />
                  Lưu công việc
                </Button>
            )}
          </div>

          <div className='space-y-4 h-[60vh] overflow-y-auto'>
            <div className='text-lg font-bold text-gray-800 uppercase flex items-center gap-2'>
              <Eye size={18} />
              Thông tin chi tiết
            </div>

            {/* Enhanced Information Grid */}
            <div className='grid grid-cols-1 gap-4 mt-6'>
              {/* Job Type */}
              <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <Briefcase size={16} className='text-blue-600' />
                <span className='text-[#000209]'>Loại công việc:</span>
                <span>{job.typeJobs.map((type) => type.name).join(', ')}</span>
              </div>

              {/* Locations */}
              {job.locations.map((location) => (
                <div
                  key={location.id}
                  className='flex items-center flex-wrap  gap-2 text-sm text-gray-600 font-semibold'
                >
                  <MapPin size={16} className='text-red-600' />
                  <span className='text-[#000209]'>Địa điểm:</span>
                  <span >{location.name}</span>
                  {location.lat && location.lng && (
                    <ExternalLink
                      className='w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800'
                      onClick={() =>
                        navigate(`/map/${location.lat}/${location.lng}`)
                      }
                    />
                  )}
                </div>
              ))}

              {/* Experience */}
              <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <Book size={16} className='text-green-600' />
                <span className='text-[#000209]'>Kinh nghiệm:</span>
                <span>{job.experience.name} kinh nghiệm làm việc</span>
              </div>

              {/* Education */}
              {job.education && (
                <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                  <GraduationCap size={16} className='text-purple-600' />
                  <span className='text-[#000209]'>Học vấn:</span>
                  <span>{job.education.name}</span>
                </div>
              )}

              {/* Quantity */}
              <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <Users size={16} className='text-orange-600' />
                <span className='text-[#000209]'>Số lượng tuyển:</span>
                <span>{job.quantity} người</span>
              </div>

              {/* Created Date */}
              <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <Calendar size={16} className='text-indigo-600' />
                <span className='text-[#000209]'>Ngày đăng:</span>
                <span>{convertDateToString(job.createdAt)}</span>
              </div>

              {/* Expiry Date */}
              <div className='flex items-center gap-2 text-sm text-gray-600 font-semibold'>
                <Clock size={16} className={dayRemaning(job.expiredAt) <= 7 ? 'text-red-600' : 'text-gray-600'} />
                <span className='text-[#000209]'>Hạn nộp:</span>
                <span className={dayRemaning(job.expiredAt) <= 7 ? 'text-red-600 font-bold' : ''}>
                  {convertDateToString(job.expiredAt)}
                  {dayRemaning(job.expiredAt) > 0 ? ` (còn ${dayRemaning(job.expiredAt)} ngày)` : ' (đã hết hạn)'}
                </span>
              </div>

              {/* Languages */}
              {job.languageJobs && job.languageJobs.length > 0 && (
                <div className='flex items-start gap-2 text-sm text-gray-600 font-semibold'>
                  <Globe size={16} className='text-cyan-600 mt-0.5' />
                  <span className='text-[#000209]'>Ngôn ngữ:</span>
                  <div className='flex flex-wrap gap-1'>
                    {job.languageJobs.map((lang, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='text-xs px-2 py-0.5 bg-cyan-50 text-cyan-700 border-cyan-200'
                      >
                        {lang.language?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Table className='bg-transparent'>
              <TableBody>
                {/* Skills */}
                <TableRow className='border-none bg-transparent'>
                  <TableCell className='font-semibold text-[#000209 flex items-center gap-2'>
                    <Trophy size={16} className='text-yellow-600' />
                    Kỹ năng:
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-2'>
                      {job.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Field */}
                {job.field && (
                  <TableRow className='border-none bg-transparent'>
                    <TableCell className='font-semibold text-[#000209 flex items-center gap-2'>
                      <Building2 size={16} className='text-slate-600' />
                      Ngành:
                    </TableCell>
                    <TableCell>
                      <Badge
                          variant='outline'
                          className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold cursor-pointer'
                        >
                          {job.field.name}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )}

                {/* Levels */}
                {job.levels && job.levels.length > 0 && (
                  <TableRow className='border-none bg-transparent'>
                    <TableCell className='font-semibold text-[#000209 flex items-center gap-2'>
                      <Star size={16} className='text-amber-600' />
                      Cấp bậc:
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {job.levels.map((level, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='text-sm px-3 py-1 rounded-full border border-amber-300 text-amber-700 bg-amber-50 hover:border-amber-500 transition-colors duration-200 font-semibold cursor-pointer'
                          >
                            {level.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Job Description */}
            <div className='space-y-2 text-sm text-[#000209 leading-relaxed'>
              <p className='font-bold text-lg text-black flex items-center gap-2'>
                <Book size={18} className='text-blue-600' />
                Mô tả công việc:
              </p>
              <div
                  className='font-semibold text-gray-800 bg-gray-50 p-4 rounded-lg'
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
            </div>

            {/* Job Requirements */}
            <div className='space-y-2 text-sm text-[#000209 leading-relaxed'>
              <p className='font-bold text-lg text-black flex items-center gap-2'>
                <CheckCircle size={18} className='text-green-600' />
                Yêu cầu công việc:
              </p>
              <div
                className='font-semibold text-gray-800 bg-gray-50 p-4 rounded-lg'
                dangerouslySetInnerHTML={{ __html: job.requirement }}
              />
            </div>

            {/* Benefits */}
            <div>
              <p className='font-bold text-lg text-black flex items-center gap-2 mb-3'>
                <Trophy size={18} className='text-yellow-600' />
                Quyền lợi:
              </p>
              <div className='bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg'>
                <ul className='list-disc list-inside text-sm text-[#000209 mt-2 space-y-2 font-semibold'>
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx} className='marker:text-[#ed1b2f] flex items-start gap-2'>
                      <CheckCircle size={14} className='text-green-600 mt-0.5 flex-shrink-0' />
                      <span className='flex-1'>{benefit.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* More jobs from employer */}
            <div className='flex justify-end mt-4'>
              <Button
                variant='outline'
                className='text-gray-600 hover:text-gray-800 flex items-center gap-2'
                onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
              >
                <Building2 size={16} />
                Xem thêm việc làm của nhà tuyển dụng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}