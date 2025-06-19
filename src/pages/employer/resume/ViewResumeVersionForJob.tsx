/* eslint-disable @typescript-eslint/no-explicit-any */
import { analysResumeVersion } from '@/apis/applyJobAPI';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ViewResumeVersion from '@/pages/candidate/dashboard/resume/ViewResumeVersion';
import { ApplyJobByJobIdResponse } from '@/types/applyJobType';
import { convertDateToString } from '@/utils/dateTime';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, User, MapPin, Calendar, Trophy } from 'lucide-react';

export default function ViewResumeVersionForJob() {
  const { applyId } = useParams();
  const [apply, setApply] = useState<ApplyJobByJobIdResponse>();

  useEffect(() => {
    if (!applyId) return;
    const fetchApply = async () => {
      try {
        const res = await analysResumeVersion(Number(applyId));
        setApply(res);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi lấy thông tin ứng tuyển');
      }
    };
    fetchApply();
  }, [applyId]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-50 text-green-700 border-green-200';
    if (score >= 6) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-6xl mx-auto">
        <Card className="w-full shadow-sm border">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Xem Hồ sơ ứng tuyển
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Thông tin ứng viên */}
              <div className="xl:col-span-3 space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                  <h2 className="text-lg font-medium text-gray-900">Thông tin ứng viên</h2>
                  <Sheet>
                    <SheetTrigger>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hồ sơ
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="min-w-3xl z-[99999] h-[100vh] overflow-y-auto p-2 bg-gray-50">
                      <ViewResumeVersion resumeVerIdOption={apply?.resumeVersion.id || 0} />
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={apply?.resumeVersion.avatar} alt="Avatar" />
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="text-xl font-semibold text-gray-900">{apply?.resumeVersion.username}</div>
                      <div className="text-sm text-gray-600">{apply?.resumeVersion.email}</div>
                      <div className="text-sm text-gray-600">{apply?.resumeVersion.phone}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Địa chỉ</span>
                      </div>
                      <div className="text-sm text-gray-600">{apply?.resumeVersion.location}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Ngày sinh</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {convertDateToString(apply?.resumeVersion.dateOfBirth)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 text-sm">Giới tính</span>
                      </div>
                      <div className="text-sm text-gray-600">{apply?.resumeVersion.gender}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Điểm số và xếp hạng */}
              <div className="xl:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(apply?.score.total || 0)}`}>
                    {apply?.score.total}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Tổng điểm</div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div 
                      className={`h-2 rounded ${apply?.score.total && apply.score.total >= 8 ? 'bg-green-500' : apply?.score.total && apply.score.total >= 6 ? 'bg-orange-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (apply?.score.total || 0) * 10)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border p-4 rounded-lg text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium mb-1 text-gray-600">Xếp hạng</div>
                  <div className="text-2xl font-bold text-gray-900">{apply?.rank}</div>
                </div>
              </div>
            </div>

            {/* Bảng so sánh */}
            <div className="mt-8">
              <div className="bg-white border-b p-4">
                <h2 className="text-lg font-medium text-gray-900">So sánh các thuộc tính</h2>
              </div>
              
              <div className="bg-white border rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-32 font-medium text-gray-700">Tiêu chí</TableHead>
                      <TableHead className="font-medium text-gray-700">Công việc</TableHead>
                      <TableHead className="font-medium text-gray-700">Ứng viên</TableHead>
                      <TableHead className="w-32 text-center font-medium text-gray-700">Điểm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">Kĩ năng</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.skills.map((s, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.resumeVersion.skills.map((s, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBg(apply?.score.skillScore || 0)} text-xs`}>
                          {apply?.score.skillScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">Địa điểm</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.locations.map((l, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {l.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {apply?.resumeVersion.district.city.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBg(apply?.score.locationScore || 0)} text-xs`}>
                          {apply?.score.locationScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">Trình độ</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {apply?.job.education.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {apply?.resumeVersion.education.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBg(apply?.score.educationScore || 0)} text-xs`}>
                          {apply?.score.educationScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">Chuyên ngành</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.majors.map((m, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {m.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.resumeVersion.majors.map((m, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {m.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBg(apply?.score.majorScore || 0)} text-xs`}>
                          {apply?.score.majorScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">Cấp bậc</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.levels.map((l, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {l.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {apply?.resumeVersion.level.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBg(apply?.score.levelScore || 0)} text-xs`}>
                          {apply?.score.levelScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">Ngoại ngữ</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.languageJobs.map((l, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {l.language.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.resumeVersion.languageResumes.map((l, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {l.language.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBg(apply?.score.languageScore || 0)} text-xs`}>
                          {apply?.score.languageScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50 font-medium">
                      <TableCell className="font-semibold text-gray-900">Tổng điểm</TableCell>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-gray-900 text-white font-semibold">
                          {apply?.score.total.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}