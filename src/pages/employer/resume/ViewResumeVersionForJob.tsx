/* eslint-disable @typescript-eslint/no-explicit-any */
import { addTagToApplyJob, analysResumeVersion, feedbackApplyJob, markViewed, removeTagToApplyJob } from '@/apis/applyJobAPI';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApplyJobByJobIdResponse } from '@/types/applyJobType';
import { convertDateToString } from '@/utils/dateTime';
import { AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, User, MapPin, Calendar, Trophy, LucidePhone, Mail, Briefcase, Tag, X, Settings, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { TagResume } from '@/types/tagResumeType';
import { getAllTagResumeAPI } from '@/apis/tagResumeAPI';
import { Textarea } from '@/components/ui/textarea';
import dayjs from 'dayjs';
import ApplyJobMenu from '@/components/elements/applyJob/ApplyJobMenu';

export default function ViewResumeVersionForJob() {
  const { applyId } = useParams();
  const [apply, setApply] = useState<ApplyJobByJobIdResponse>();
  const [tagsMe, setTagsMe] = useState<TagResume[]>([]);
  const [selectTags, setSelectTags] = useState<TagResume[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const navigate = useNavigate();

  const fetchElement = async () => {
    try {
      const [applyData, tags] = await Promise.all([
        analysResumeVersion(Number(applyId)),
        getAllTagResumeAPI(),
      ]);
      setApply(applyData);
      setTagsMe(tags);
      setSelectTags(applyData.tagResumes || []);
      setFeedback(applyData.feedback || '');
      if (applyData.viewStatus === 0) {
        await markViewed(Number(applyId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lấy thông tin ứng tuyển');
    }
  };
  useEffect(() => {
    if (!applyId) return;
    fetchElement();
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
  const handleAddTag = async (tag: TagResume) => {
    try {
      await addTagToApplyJob(Number(applyId), { tagIds: [tag.id] });
    }
    catch(error: any){
      toast.error(error?.response?.data?.message || 'Lỗi khi thêm thẻ');
    }
  }

  const handleRemoveTag = async (tag: TagResume) => {
    try {
      await removeTagToApplyJob(Number(applyId), { tagIds: [tag.id] });
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi xóa thẻ');
    }
  }

  const handleFeedback = async () => {
    try {
      await feedbackApplyJob(Number(applyId), feedback);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi gửi phản hồi');
    }
  }
        

  return (
    <div className="min-h-screen p-4 flex w-full gap-3">
      <div className="min-w-4xl max-w-4xl mx-auto">
        <Card className="w-full shadow-sm border">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Xem Hồ sơ ứng tuyển
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Thông tin và bảng so sánh */}
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
                       Đánh giá ứng viên
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="min-w-5xl z-[99999] h-[100vh] overflow-y-auto p-2 bg-gray-50">
                      <div className="mt-8">
                        <div className="bg-white border-b p-4">
                          <h2 className="text-lg font-medium text-gray-900">So sánh các thuộc tính</h2>
                        </div>

                        <div className="bg-white border rounded-b-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="w-32 font-medium text-gray-700">Tiêu chí</TableHead>
                                <TableHead className="font-medium text-gray-700 min-w-full">Công việc</TableHead>
                                <TableHead className="font-medium text-gray-700 min-w-full">Ứng viên</TableHead>
                                <TableHead className="w-32 text-center font-medium text-gray-700">Điểm</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Kĩ năng */}
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

                              {/* Địa điểm */}
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
                                    {apply?.resumeVersion.district.name}, {apply?.resumeVersion.district.city.name}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={`${getScoreBg(apply?.score.locationScore || 0)} text-xs`}>
                                    {apply?.score.locationScore.toFixed(1)}
                                  </Badge>
                                </TableCell>
                              </TableRow>

                              {/* Trình độ */}
                              <TableRow className="hover:bg-gray-50">
                                <TableCell className="font-medium text-gray-700">Trình độ</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs">
                                    {apply?.job.education?.name}
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

                              {/* Chuyên ngành */}
                              <TableRow className="hover:bg-gray-50">
                                <TableCell className="font-medium text-gray-700">Chuyên ngành</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {apply?.job.majors.map((m, i) => (
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
                                    {apply?.score?.majorScore?.toFixed(1)}
                                  </Badge>
                                </TableCell>
                              </TableRow>

                              {/* Cấp bậc */}
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

                              {/* Ngoại ngữ */}
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

                              {/* Tổng điểm */}
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
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Thông tin cơ bản */}
                <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-start mb-4 gap-3  bg-[#F6F6F6] p-4 rounded-md">
                <Avatar className="w-20 h-20 mx-auto ">
                  <AvatarImage
                    src={apply?.resumeVersion?.avatar}
                  />
                </Avatar>
                <div className=" flex-1 flex flex-col justify-start items-start gap-2">
                  <div>
                    <Label className="font-semibold text-neutral-800">
                      {apply?.resumeVersion?.username}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                    <Label className='text-neutral-700'>
                          <LucidePhone className='h-3 w-3 text-neutral-700' /> {
                      apply?.phone==='' ? apply?.resumeVersion?.phone : apply?.phone
                      }
                    </Label>
                    <Label className='text-sm text-neutral-700'>
                          <Mail className='h-3 w-3 text-neutral-700' /> {
                      apply?.email === '' ? apply?.resumeVersion?.email : apply?.email
                      }
                    </Label>
                  </div>
                  <Label className="text-sm text-neutral-700">
                    <Briefcase className="h-3 w-3 text-neutral-700" />{" "}
                    {apply?.job?.name}
                  </Label>
                </div>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        label: 'Chức danh',
                        icon: <Tag className="w-4 h-4 text-gray-500" />,
                        value: apply?.resumeVersion.resume.name
                      },
                      {
                        label: 'Địa chỉ',
                        icon: <MapPin className="w-4 h-4 text-gray-500" />,
                        value: apply?.resumeVersion.district.name + ', ' + apply?.resumeVersion.district.city.name
                      },
                      {
                        label: 'Ngày sinh',
                        icon: <Calendar className="w-4 h-4 text-gray-500" />,
                        value: `${convertDateToString(apply?.resumeVersion.dateOfBirth)}
                         (${dayjs().year()- dayjs(apply?.resumeVersion.dateOfBirth).year()} tuổi)`
                      },
                      {
                        label: 'Giới tính',
                        icon: <User className="w-4 h-4 text-gray-500" />,
                        value: apply?.resumeVersion.gender
                      },
                      {
                        label: 'Chuyên ngành',
                        icon: <Briefcase className="w-4 h-4 text-gray-500" />,
                        value: apply?.resumeVersion.majors.map(m => m.name).join(', ')
                      },
                      {
                        label: 'Cấp bậc',
                        icon: <Briefcase className="w-4 h-4 text-gray-500" />,
                        value: apply?.resumeVersion.level.name
                      },
                    ].map((item, i) => (
                      <div key={i} className="bg-[#F6F6F6] p-3 rounded border">
                        <div className="flex items-center gap-2 mb-1">
                          {item.icon}
                          <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                        </div>
                        <div className="text-sm text-gray-600">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tổng điểm và xếp hạng */}
              <div className="xl:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(apply?.score.total || 0)}`}>
                    {apply?.score.total.toFixed(1)}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Tổng điểm</div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded ${
                        apply?.score.total >= 8
                          ? 'bg-green-500'
                          : apply?.score.total >= 6
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (apply?.score.total || 0) * 10)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-[#F6F6F6] border p-4 rounded-lg text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium mb-1 text-gray-600">Xếp hạng</div>
                  <div className="text-2xl font-bold text-gray-900">{apply?.rank}</div>
                </div>
              </div>
            </div>

            <iframe
              src={apply?.resumeVersion.urlPdf}
              className="w-full h-200 mt-4"
              title="Resume PDF"
            ></iframe>
          </CardContent>
        </Card>
      </div>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <Label className='text-[#2c95ff] flex items-center gap-2'>
              <Settings className='w-4 h-4' />
              Quản lý ứng viên
            </Label>
            
            <ApplyJobMenu
              applyJob={apply}
              setIsChange={fetchElement}
            />
          </CardTitle>
          <hr/>
          <CardTitle className='flex justify-between items-center'>
            <Label className='text-[#451da0] flex items-center gap-2'>
              <Tag className='w-4 h-4 text-[#451da0]' />
              <span>Thẻ ứng viên</span>
            </Label>
            <Button
              variant='link'
              className='text-[#2c95ff] hover:text-[#2c95ff] flex items-center gap-2'
              onClick={() => navigate('/danh-cho-nha-tuyen-dung/quan-ly-the')}
            >
              <Settings className='w-4 h-4 mr-2' />
              Quản lý thẻ
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
        <div className='space-y-3'>
            <div className='flex-1 flex-wrap gap-2  flex '>
              {
                selectTags.length > 0  && selectTags.map(tag => (
                  <Button
                    variant='ghost'
                    className='bg-transparent hover:bg-transparent cursor-pointer !p-0'
                    key={tag.id}
                    onClick={() => {
                      setSelectTags(selectTags.filter(t => t.id !== tag.id));
                      handleRemoveTag(tag);
                    }}
                  >
                    <Label
                    className='cursor-pointer px-2.5 py-1.5 rounded-xl  w-fit text-neutral-700 '
                    style={{ backgroundColor: tag.color }}
                  >
                    <span>
                      {tag.name}
                      </span>
                      <X className='w-3 h-3 ml-2 text-neutral-500' />
                  </Label>
                  </Button>
                ))
              }
              </div>
            </div>
          <div >
            <Label className='text-xs text-neutral-700'>Gợi ý thẻ</Label>
            <div className='flex-1 flex-wrap gap-2 mt-2 flex '>
              {
                tagsMe.length > 0 && tagsMe.map(tag => (
                  <Button
                    variant='ghost'
                    disabled={selectTags.some(t => t.id === tag.id)}
                    onClick={() => {
                      setSelectTags([...selectTags, tag]);
                      handleAddTag(tag);
                    }}
                    className='bg-transparent hover:bg-transparent cursor-pointer !p-0'
                    key={tag.id}>
                    <Label
                    className='cursor-pointer px-2.5 py-1.5 rounded-xl  w-fit text-neutral-700 '
                    style={{ backgroundColor: tag.color }}
                  >
                    
                    <span>
                      {tag.name}
                    </span>
                  </Label>
                  </Button>
                ))
              }
              </div>
          </div>
          <div className='space-y-3'>
            <Label>
              Đánh giá ứng viên
            </Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder='Thêm ghi chú'
              className='w-full border border-[#2c95ff] min-h-50'
              rows={4}
            />
            <div className='flex justify-between items-start gap-2'>
              <Label className='text-xs'>Ứng viên sẽ không thấy ghi chú này của bạn</Label>
              <Button
                disabled={!feedback.trim()}
                className='bg-[#2c95ff] text-white hover:bg-[#2c95ff] w-fit' onClick={handleFeedback}>
                <Send/>
              </Button>
            </div>
          </div>
          {
            apply?.candidateNote &&<div className='space-y-3'>
            <Label>Thư gửi nhà tuyển dụng</Label>
            <Textarea
              value={apply?.candidateNote || ''}
              readOnly
              className='w-full border border-[#2c95ff] min-h-50'
              rows={4}
            />
          </div>
          }
            
        </CardContent>
      </Card>
    </div>
  );
}
