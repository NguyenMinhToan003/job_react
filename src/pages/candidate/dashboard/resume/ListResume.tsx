/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteResumeAPI,
  getAllResumeAPI,
  toggleDefaultResumeAPI,
} from '@/apis/resumeAPI';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Resume } from '@/types/resumeType';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  Plus,
  FileText,
  Edit,
  Star,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ListResume() {
  const [listResume, setListResume] = useState<Resume[]>([]);
  const navigate = useNavigate();

  const fetchResume = async () => {
    try {
      const response = await getAllResumeAPI();
      setListResume(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải danh sách hồ sơ');
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const toggleDefaultResume = async (resumeId: number, currentIsDefault: boolean) => {
    if (currentIsDefault) return; // Ngăn gọi API nếu đã là hồ sơ chính
    try {
      await toggleDefaultResumeAPI(resumeId);
      toast.success('Đã đặt hồ sơ làm chính');
      fetchResume();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi đặt hồ sơ làm chính');
    }
  };

 

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGenderDisplay = (gender: string) => {
    return gender === 'NAM' ? 'Nam' : 'Nữ';
  };

  return (
    <div className='min-h-screen p-4 md:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        {listResume.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {listResume.map((resume) => {
              const latestVersion = resume.resumeVersions?.[0];
              return (
                <Card
                  key={resume.id}
                  className={`pb-0 group shadow-none transition-all duration-300 border ${resume.isDefault ? 'border-[#451e99]' : 'border-gray-200'} rounded-lg bg-white overflow-hidden`}
                >
                  <CardHeader className={`p-4 'bg-blue-700  bg-[#451e99] text-white`}>
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        {latestVersion?.avatar ? (
                          <img
                            src={latestVersion.avatar}
                            alt={latestVersion.username}
                            className='w-12 h-12 rounded-full border-2 border-white object-cover'
                          />
                        ) : (
                          <div className='w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center'>
                            <User className='w-6 h-6 text-white' />
                          </div>
                        )}
                        
                      </div>
                      <div className='flex-1'>
                        <CardTitle className='text-lg font-semibold flex items-center gap-2 justify-between'>
                          <span className='line-clamp-1'>{resume.name}</span>
                          {resume.isDefault && (
                            <Badge variant='secondary' className='text-orange-500 bg-orange-100 px-2 py-1 rounded-full text-xs flex items-center gap-1'>
                              <Star className='w-3 h-3' fill='orange' /> Chính
                            </Badge>
                          )}
                        </CardTitle>
                        <p className='text-xs text-white/80'>
                          Cập nhật: {formatDate(resume.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='p-4'>
                    {latestVersion ? (
                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2 text-gray-700'>
                          <User className='w-4 h-4 text-[#451e99]' />
                          <span className='font-medium'>{latestVersion.username}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Phone className='w-4 h-4 text-green-600' />
                          <span className='font-semibold'>{latestVersion.phone}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Mail className='w-4 h-4 text-red-500' />
                          <span className='font-semibold'>{latestVersion.email}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <MapPin className='w-4 h-4 text-purple-600' />
                          <span className='font-semibold'>{latestVersion.location}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Calendar className='w-4 h-4 text-[#451e99]' />
                          <span className='font-semibold'>
                            {formatDate(latestVersion.dateOfBirth)} - {getGenderDisplay(latestVersion.gender)}
                          </span>
                        </div>
                        {latestVersion.about && (
                          <div className='mt-3 p-2 bg-gray-100 rounded-md'>
                            <p className='text-xs text-gray-600 line-clamp-2'>
                              {latestVersion.about}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='text-center py-4'>
                        <FileText className='w-10 h-10 text-gray-300 mx-auto mb-2' />
                        <p className='text-gray-500 text-xs'>Chưa có thông tin chi tiết</p>
                      </div>
                    )}

                    <div className='flex gap-2 mt-4 pt-3 border-t border-gray-200 items-center w-full'>
                      <Switch
                        id={`default-resume-${resume.id}`}
                        checked={resume.isDefault}
                        onCheckedChange={() => toggleDefaultResume(resume.id, resume.isDefault)}
                      />
                      <Label
                        htmlFor={`default-resume-${resume.id}`}
                        className='text-xs text-gray-600'>Đặt làm hồ sơ chính</Label>
                    </div>

                    <div className='flex gap-2 mt-4'>
                      <Button
                        onClick={() => navigate(`${resume.id}`)}
                        className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold flex-1 rounded-none h-12'
                      >
                        <Eye className='w-4 h-4' />
                        Xem
                      </Button>
                      
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='max-w-sm mx-auto'>
              <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-12 h-12 text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>Chưa có hồ sơ nào</h3>
              <p className='text-gray-500 text-sm mb-6'>
                Bạn chưa tạo hồ sơ nào. Hãy tạo hồ sơ đầu tiên để bắt đầu tìm kiếm công việc mơ ước!
              </p>
              <Button
                onClick={() => navigate('/tong-quat-ho-so/tao-ho-so')}
                className='bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-full rounded-none h-12'
              >
                <Plus className='w-4 h-4' />
                Tạo hồ sơ đầu tiên
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
