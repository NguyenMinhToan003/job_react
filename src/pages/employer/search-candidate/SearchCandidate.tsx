'use client';

import { useEffect, useState } from 'react';
import { searchResumeCandidateAPI } from '@/apis/resumeAPI';
import { ResumeVersion } from '@/types/resumeType';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share } from 'lucide-react';
import dayjs from 'dayjs';
import { Card } from '@/components/ui/card';

export default function SearchCandidate() {
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page] = useState(1);
  const limit = 10;

  const fetchResumeVersions = async () => {
    try {
      const response = await searchResumeCandidateAPI(null);
      setResumeVersions(response.items || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải danh sách');
    }
  };

  useEffect(() => {
    fetchResumeVersions();
  }, []);

  const selectedResume = resumeVersions[selectedIndex];

  const calculateAge = (dob: string) => {
    return dayjs().diff(dayjs(dob), 'year');
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thỏa thuận';
    if (min && max && min !== max)
      return `${min.toLocaleString()} - ${max.toLocaleString()} VND`;
    return `${min || max?.toLocaleString()} VND`;
  };

  return (
    <div className="flex gap-4 min-h-[90vh] p-4 bg-[#f8f9fa] w-full">
      {/* Sidebar ứng viên */}
      <div className="w-[300px] border border-[#e0e0e0] rounded-lg bg-white shadow-sm">
        <div className="p-3 border-b border-[#e0e0e0] font-semibold text-black">
          Danh sách ứng viên
        </div>
        <div className="overflow-y-auto h-[calc(100vh-150px)] divide-y divide-[#e0e0e0]">
          {resumeVersions.map((cv, idx) => (
            <div
              key={cv.id}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3 py-3 cursor-pointer transition-all ${
                idx === selectedIndex
                  ? 'bg-[#e0f2fe] text-[#0c4a6e]'
                  : 'hover:bg-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={cv.avatar} />
                  <AvatarFallback className="bg-[#00aaff] text-white">
                    {cv.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm line-clamp-1">
                    {cv.username} ({calculateAge(cv.dateOfBirth)} tuổi)
                  </div>
                  <Badge
                    className={`text-xs mt-1 ${
                      idx === selectedIndex
                        ? 'bg-[#f97316] text-white'
                        : 'bg-[#fff7ed] text-[#f97316]'
                    }`}
                  >
                    Tích cực tìm việc
                  </Badge>
                  <div className="text-xs text-[#666666] line-clamp-1">
                    {cv.resume?.name || 'Chưa có tiêu đề'}
                  </div>
                  <div className="text-xs text-[#666666]">
                    {cv.experiences?.length > 0
                      ? 'Đã có kinh nghiệm'
                      : 'Chưa có kinh nghiệm'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin chi tiết ứng viên */}
      <div className="flex-1">
        {selectedResume && (
          <Card className="p-6 bg-white shadow-lg rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0c4a6e]">
                  {selectedResume.username}
                </h2>
                <div className="text-sm text-[#666666]">
                  {selectedResume.resume?.name || 'Nhân Viên Văn Phòng'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Heart size={18} className="text-[#666666]" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share size={18} className="text-[#666666]" />
                </Button>
                <Button
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full text-sm px-5 py-2"
                  disabled
                >
                  Mua thông tin liên hệ (-2 điểm)
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <Avatar className="w-24 h-24 bg-[#00aaff] text-white">
                <AvatarFallback>{selectedResume.username?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <strong className="text-black">Giới tính:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.gender}</span>
              </div>
              <div>
                <strong className="text-black">Ngày sinh:</strong>{' '}
                <span className="text-[#666666]">
                  {dayjs(selectedResume.dateOfBirth).format('DD/MM/YYYY')}
                </span>
              </div>
              <div>
                <strong className="text-black">Địa chỉ:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.location}</span>
              </div>
              <div>
                <strong className="text-black">Tỉnh/Thành phố:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.district?.city.name}</span>
              </div>
              <div>
                <strong className="text-black">Trình độ học vấn:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.education?.name}</span>
              </div>
              <div>
                <strong className="text-black">Kinh nghiệm:</strong>{' '}
                <span className="text-[#666666]">
                  {selectedResume.experiences.length > 0
                    ? 'Đã có kinh nghiệm'
                    : 'Chưa có kinh nghiệm'}
                </span>
              </div>
              <div>
                <strong className="text-black">Mức lương mong muốn:</strong>{' '}
                <span className="text-[#666666]">
                  {formatSalary(selectedResume.expectedSalaryMin, selectedResume.expectedSalaryMax)}
                </span>
              </div>
              <div>
                <strong className="text-black">Hình thức làm việc:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.typeJob?.name}</span>
              </div>
              <div>
                <strong className="text-black">Cấp bậc hiện tại:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.level?.name}</span>
              </div>
              <div>
                <strong className="text-black">Cấp bậc mong muốn:</strong>{' '}
                <span className="text-[#666666]">{selectedResume.desiredLevel?.name}</span>
              </div>
            </div>

            <div>
              <strong className="text-black">Kỹ năng:</strong>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedResume.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedResume.about && (
              <div>
                <strong className="text-black">Giới thiệu:</strong>
                <div className="text-sm text-[#666666] mt-1">{selectedResume.about}</div>
              </div>
            )}

            {selectedResume.urlPdf && (
              <iframe
                src={selectedResume.urlPdf}
                className="w-full h-[700px] "
                title="Resume PDF"
              ></iframe>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}