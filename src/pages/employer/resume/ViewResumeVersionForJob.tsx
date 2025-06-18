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
import { Eye, Star, Trophy, User, MapPin, GraduationCap } from 'lucide-react';

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
    if (score >= 8) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 6) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#6c43d3] to-[#451e99] text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Xem Hồ sơ ứng tuyển
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Thông tin ứng viên */}
              <div className="xl:col-span-3 space-y-4">
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-xl">
                  <h2 className="text-lg font-bold text-[#451e99] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin ứng viên
                  </h2>
                  <Sheet>
                    <SheetTrigger>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-[#6c43d3] to-[#451e99] hover:from-[#451e99] hover:to-[#6c43d3] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hồ sơ
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="min-w-3xl z-[99999] h-[100vh] overflow-y-auto p-2 bg-gray-200">
                      <ViewResumeVersion resumeVerIdOption={apply?.resumeVersion.id || 0} />
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg border border-purple-100">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 ring-2 ring-[#6c43d3] ring-offset-2">
                        <AvatarImage src={apply?.resumeVersion.avatar} alt="Avatar" />
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#6c43d3] to-[#451e99] text-white p-1 rounded-full">
                        <Star className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="text-xl font-bold text-[#451e99]">{apply?.resumeVersion.username}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[#6c43d3] rounded-full"></div>
                        {apply?.resumeVersion.email}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[#451e99] rounded-full"></div>
                        {apply?.resumeVersion.phone}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-[#6c43d3]" />
                        <span className="font-medium text-[#451e99] text-sm">Địa chỉ</span>
                      </div>
                      <div className="text-sm text-gray-700">{apply?.resumeVersion.location}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-[#6c43d3] rounded-full"></div>
                        <span className="font-medium text-[#451e99] text-sm">Ngày sinh</span>
                      </div>
                      <div className="text-sm text-gray-700">{convertDateToString(apply?.resumeVersion.dateOfBirth)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-[#6c43d3]" />
                        <span className="font-medium text-[#451e99] text-sm">Giới tính</span>
                      </div>
                      <div className="text-sm text-gray-700">{apply?.resumeVersion.gender}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Điểm số và xếp hạng */}
              <div className="xl:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-[#6c43d3]/20">
                  <div className="text-center">
                    <div className="text-4xl font-black bg-gradient-to-r from-[#6c43d3] to-[#451e99] bg-clip-text text-transparent mb-2">
                      {apply?.score.total}
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Tổng điểm</div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${getScoreColor(apply?.score.total || 0)}`}
                        style={{ width: `${Math.min(100, (apply?.score.total || 0) * 10)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#6c43d3] to-[#451e99] text-white p-4 rounded-xl shadow-lg text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium mb-1">Xếp hạng</div>
                  <div className="text-2xl font-bold">{apply?.rank}</div>
                </div>
              </div>
            </div>

            {/* Bảng so sánh */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-[#6c43d3] to-[#451e99] text-white p-4 rounded-t-xl">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  So sánh các thuộc tính
                </h2>
              </div>
              
              <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-purple-100 to-indigo-100">
                      <TableHead className="w-32 font-semibold text-[#451e99] text-sm">Tiêu chí</TableHead>
                      <TableHead className="font-semibold text-[#451e99] text-sm">Công việc</TableHead>
                      <TableHead className="font-semibold text-[#451e99] text-sm">Ứng viên</TableHead>
                      <TableHead className="w-32 text-center font-semibold text-[#451e99] text-sm">Điểm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-[#451e99] text-sm">Kĩ năng</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.skills.map((s, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.resumeVersion.skills.map((s, i) => (
                            <Badge key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBadgeColor(apply?.score.skillScore || 0)} font-semibold text-sm px-2 py-1`}>
                          {apply?.score.skillScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-[#451e99] text-sm">Địa điểm</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.locations.map((l, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                              {l.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                          {apply?.resumeVersion.district.city.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBadgeColor(apply?.score.locationScore || 0)} font-semibold text-sm px-2 py-1`}>
                          {apply?.score.locationScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-[#451e99] text-sm">Trình độ</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                          {apply?.job.education.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                          {apply?.resumeVersion.education.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBadgeColor(apply?.score.educationScore || 0)} font-semibold text-sm px-2 py-1`}>
                          {apply?.score.educationScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-[#451e99] text-sm">Chuyên ngành</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.majors.map((m, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                              {m.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.resumeVersion.majors.map((m, i) => (
                            <Badge key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              {m.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBadgeColor(apply?.score.majorScore || 0)} font-semibold text-sm px-2 py-1`}>
                          {apply?.score.majorScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-[#451e99] text-sm">Cấp bậc</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.levels.map((l, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                              {l.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                          {apply?.resumeVersion.level.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBadgeColor(apply?.score.levelScore || 0)} font-semibold text-sm px-2 py-1`}>
                          {apply?.score.levelScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-[#451e99] text-sm">Ngoại ngữ</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.job.languageJobs.map((l, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                              {l.language.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apply?.resumeVersion.languageResumes.map((l, i) => (
                            <Badge key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              {l.language.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getScoreBadgeColor(apply?.score.languageScore || 0)} font-semibold text-sm px-2 py-1`}>
                          {apply?.score.languageScore.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-gradient-to-r from-[#6c43d3]/10 to-[#451e99]/10 hover:from-[#6c43d3]/20 hover:to-[#451e99]/20">
                      <TableCell className="font-bold text-[#451e99] text-sm">Tổng điểm</TableCell>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-gradient-to-r from-[#6c43d3] to-[#451e99] text-white text-sm font-bold px-3 py-1.5 shadow-md">
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