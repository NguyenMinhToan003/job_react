/* eslint-disable react-hooks/exhaustive-deps */
import { viewResumeAPI } from '@/apis/resumeAPI';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeVersion } from '@/types/resumeType';
import { convertDateToString } from '@/utils/dateTime';
import {
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Globe,
  Edit,
  Eye,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ViewResumeLastVersion() {
  const [resume, setResume] = useState<ResumeVersion>();
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();

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
  }, []);

  if (!resume) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-sm border">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Xem Hồ sơ
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Thông tin ứng viên */}
              <div className="xl:col-span-3 space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                    onClick={() => navigate(`/tong-quat-ho-so/chinh-sua-ho-so/${resume.resume.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={resume.avatar} alt="Avatar" />
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="text-xl font-semibold text-gray-900">{resume.username}</div>
                      <div className="text-sm text-gray-600">{resume.resume.name}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Email</span>
                      </div>
                      <div className="text-sm text-gray-600">{resume.email}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Số điện thoại</span>
                      </div>
                      <div className="text-sm text-gray-600">{resume.phone}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Ngày sinh</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {convertDateToString(resume.dateOfBirth)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Giới tính</span>
                      </div>
                      <div className="text-sm text-gray-600">{resume.gender}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Địa chỉ</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {resume.district?.name + ', ' + resume.district?.city?.name}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Khu vực</span>
                      </div>
                      <div className="text-sm text-gray-600">{resume.location}</div>
                    </div>
                  </div>
                </div>

                {/* About Me */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Giới thiệu bản thân</h2>
                  <div className="text-sm text-gray-600 space-y-2">
                    {resume.about?.split('\n').map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
                    
                {/* Education */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Trình độ học vấn</h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Chuyên ngành: {resume.majors?.length > 0 ? resume.majors.map((m) => m.name).join(', ') : 'Chưa cập nhật'}</div>
                    <div>Trình độ học vấn: {resume.education?.name || 'Chưa cập nhật'}</div>
                    <div>Cấp bậc: {resume.level?.name || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Kỹ năng</h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.length > 0 ? (
                      resume.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-600">Chưa cập nhật</p>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Ngôn ngữ</h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.languageResumes.length > 0 ? (
                      resume.languageResumes.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language.language.name} - {language.level}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-600">Chưa cập nhật</p>
                    )}
                  </div>
                </div>
              </div>


            </div>

            {/* PDF Viewer */}
            <div className="mt-6">
              <Card className="bg-white border rounded-lg">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Hồ sơ PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <iframe
                    src={resume.urlPdf}
                    className="w-full h-[600px] border rounded-md"
                    title="Resume PDF"
                  ></iframe>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}