/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { searchResumeCandidateAPI } from '@/apis/resumeAPI';
import { ResumeVersion } from '@/types/resumeType';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share, MapPin, Calendar, GraduationCap, Briefcase, DollarSign, User, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import { Card } from '@/components/ui/card';

export default function SearchCandidate() {
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <div className="flex gap-6 min-h-screen p-6 bg-gray-50">
      {/* Sidebar ứng viên */}
      <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-slate-800 text-white">
          <h3 className="font-semibold text-lg">Danh sách ứng viên</h3>
          <p className="text-sm text-slate-300 mt-1">{resumeVersions.length} ứng viên</p>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {resumeVersions.map((cv, idx) => (
            <div
              key={cv.id}
              onClick={() => setSelectedIndex(idx)}
              className={`p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50 ${
                idx === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={cv.avatar} />
                  <AvatarFallback className="bg-slate-600 text-white text-sm">
                    {cv.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {cv.username}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculateAge(cv.dateOfBirth)} tuổi • {cv.district?.city.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs mt-2 bg-green-100 text-green-700"
                  >
                    Sẵn sàng làm việc
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {cv.resume?.name || 'Chưa có tiêu đề'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin chi tiết ứng viên */}
      <div className="flex-1">
        {selectedResume && (
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedResume.avatar} />
                    <AvatarFallback className="bg-slate-600 text-white text-xl">
                      {selectedResume.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedResume.username}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                      {selectedResume.resume?.name || 'Nhân Viên Văn Phòng'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {calculateAge(selectedResume.dateOfBirth)} tuổi
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedResume.district?.city.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Lưu
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                  <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                    Mua thông tin liên hệ (-2 điểm)
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thông tin cơ bản */}
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin cơ bản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Giới tính</div>
                  <div className="text-gray-900">{selectedResume.gender}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Ngày sinh</div>
                  <div className="text-gray-900">
                    {dayjs(selectedResume.dateOfBirth).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Địa chỉ</div>
                  <div className="text-gray-900">{selectedResume.location}</div>
                </div>
              </div>
            </Card>

            {/* Thông tin nghề nghiệp */}
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Thông tin nghề nghiệp
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Trình độ học vấn</div>
                      <div className="text-gray-900">{selectedResume.education?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Kinh nghiệm</div>
                      <div className="text-gray-900">
                        
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Hình thức làm việc</div>
                      <div className="text-gray-900">{selectedResume.typeJob?.name}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Mức lương mong muốn</div>
                      <div className="text-gray-900 font-medium">
                        {formatSalary(selectedResume?.expectedSalaryMin || 0, selectedResume?.expectedSalaryMax || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Cấp bậc hiện tại</div>
                      <div className="text-gray-900">{selectedResume.level?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Cấp bậc mong muốn</div>
                      <div className="text-gray-900">{selectedResume.desiredLevel?.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Kỹ năng */}
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng</h2>
              <div className="flex flex-wrap gap-2">
                {selectedResume.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Giới thiệu */}
            {selectedResume.about && (
              <Card className="p-6 bg-white shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu bản thân</h2>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedResume.about}
                </div>
              </Card>
            )}

            {/* PDF Viewer */}
            {selectedResume.urlPdf && (
              <Card className="p-6 bg-white shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hồ sơ PDF</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={selectedResume.urlPdf}
                    className="w-full h-[600px]"
                    title="Resume PDF"
                  />
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}