/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { viewApplyJobByCandidate } from '@/apis/applyJobAPI';
import { deleteResumeAPI, viewResumeAPI } from '@/apis/resumeAPI';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlertDialog } from '@/providers/AlertDialogProvider';
import { ResumeVersion } from '@/types/resumeType';
import { convertPrice } from '@/utils/convertPrice';
import { convertDateToString } from '@/utils/dateTime';
import {
  Calendar,
  User,
  MapPin,
  Globe,
  Edit,
  Eye,
  Trash2,
  ArrowLeft,
  DollarSign,
  BarChart,
  GraduationCap,
  BookOpen,
  Briefcase,
  BookA,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ViewResumeVersionByCandidate() {
  const {id} = useParams<{ id: string }>();
  const [resume, setResume] = useState<ResumeVersion>();
  const navigate = useNavigate();
  const { showAlert } = useAlertDialog();

  const fetchResume = async () => {
    try {
      const response = await viewApplyJobByCandidate(Number(id));
      setResume(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
    }
  };

  useEffect(() => {
    if (id) fetchResume();
  }, []);

  const handleDeleteResume = async (resumeId: number) => {
    showAlert({
      title: 'Xóa hồ sơ',
      content: 'Bạn có chắc chắn muốn xóa hồ sơ này không?',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      handleConfirm: async () => {
        try {
          await deleteResumeAPI(resumeId);
          toast.success('Đã xóa hồ sơ thành công');
          navigate('/tong-quat-ho-so');
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Lỗi khi xóa hồ sơ');
        }
      },
    });
  };

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
      <div className="flex">
        <Card className="shadow-none border border-gray-200 bg-white rounded-xl">
          <CardHeader className="bg-white border-b">
            <Button
              onClick={() => navigate(-1)}
              className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Xem Hồ sơ
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="gap-6">
              <div className="xl:col-span-3 space-y-4">
                {/* Thông tin cá nhân */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                      onClick={() =>
                        navigate(`/tong-quat-ho-so/chinh-sua-ho-so/${resume.resume.id}`)
                      }
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteResume(resume.resume.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={resume.avatar} alt="Avatar" />
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="text-xl font-semibold text-gray-900">{resume.username}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {resume.dateOfBirth
                          ? convertDateToString(resume.dateOfBirth)
                          : 'Chưa cập nhật'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {resume.district?.name + ', ' + resume.district.city.name || 'Chưa cập nhật'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <BookA className="w-4 h-4 text-gray-400" />
                        {
                          resume.resume.name
                        }
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        icon: <DollarSign className="w-4 h-4 text-gray-500" />,
                        label: 'Mức lương mong muốn',
                        value:
                          convertPrice(resume.expectedSalary, null) +
                            ' Triệu đồng' || 'Chưa cập nhật',
                      },
                      {
                        label: 'Kinh nghiệm',
                        value: resume.experience?.name || 'Chưa cập nhật',
                        icon: <Briefcase className="w-4 h-4 text-gray-500" />,
                      },
                      {
                        label: 'Chuyên ngành',
                        value:
                          resume.majors?.length > 0
                            ? resume.majors.map((m) => m.name).join(', ')
                            : 'Chưa cập nhật',
                        icon: <BookOpen className="w-4 h-4 text-gray-500" />,
                      },
                      {
                        label: 'Trình độ học vấn',
                        value: resume.education?.name || 'Chưa cập nhật',
                        icon: <GraduationCap className="w-4 h-4 text-gray-500" />,
                      },
                      {
                        label: 'Cấp bậc',
                        value: resume.level?.name || 'Chưa cập nhật',
                        icon: <BarChart className="w-4 h-4 text-gray-500" />,
                      },
                      {
                        label: 'Hinh thức làm việc',
                        value: resume.typeJob?.name || 'Chưa cập nhật',
                        icon: <Globe className="w-4 h-4 text-gray-500" />,
                      },
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border">
                        <div className="flex items-center gap-2 mb-1">
                          {item.icon}
                          <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                        </div>
                        <div className="text-sm text-gray-600">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Giới thiệu bản thân */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Giới thiệu bản thân</h2>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div
                      dangerouslySetInnerHTML={{ __html: resume.about || 'Chưa cập nhật' }}
                      className="whitespace-pre-wrap"
                    />
                  </div>
                </div>

                {/* Kỹ năng */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Kỹ năng</h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.length > 0 ? (
                      resume.skills.map((skill, index) => (
                        <Button key={index} variant="secondary" className="text-xs">
                          {skill.name}
                        </Button>
                      ))
                    ) : (
                      <p className="text-gray-600">Chưa cập nhật</p>
                    )}
                  </div>
                </div>

                {/* Ngôn ngữ */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Ngôn ngữ</h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.languageResumes.length > 0 ? (
                      resume.languageResumes.map((language, index) => (
                        <Button key={index} variant="secondary" className="text-xs">
                          {language.language.name}
                        </Button>
                      ))
                    ) : (
                      <p className="text-gray-600">Chưa cập nhật</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-2xl shadow-none bg-white border rounded-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Hồ sơ đính kèm
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <iframe
              src={resume.urlPdf}
              className="w-full h-[100vh] border rounded-md"
              title="Resume PDF"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
