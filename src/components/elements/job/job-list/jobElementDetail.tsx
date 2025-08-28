import {
  CircleDollarSignIcon,
  Users,
  TimerIcon,
  Clock,
  Briefcase,
  Book,
  GraduationCap,
  Star,
  Trophy,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { convertDateToDiffTime, convertDateToString, dayRemaning } from '@/utils/dateTime';
import { convertPrice } from '@/utils/convertPrice';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { JobFilterResponse } from '@/types/jobType';
import { useNavigate } from 'react-router-dom';
import { iconMap } from '@/utils/SetListIcon';

export default function JobElementDetail({
  job,
}: {
    job: JobFilterResponse;
  }) {
  
  const navigate = useNavigate();
  const filterMajor = (majorId: number) => navigate(`/tim-kiem-cong-viec?majorId=${majorId}`);
  return (
    <div className="space-y-6">
      {/* Tổng quan công việc */}
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-1 p-4">
        <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
          <CircleDollarSignIcon className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#857876]">Mức lương</div>
            <div className="text-[#000209] font-semibold">{convertPrice(job.minSalary, job.maxSalary)}</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
          <Users className="w-5 h-5 text-[#9277f2] mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#857876]">Số lượng</div>
            <div className="text-[#000209] font-semibold">{job.quantity} người</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
          <TimerIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#857876]">Đăng tuyển</div>
            <div className="text-[#000209] font-semibold">{convertDateToDiffTime(job.createdAt)}</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
          <Clock className={`w-5 h-5 mt-0.5 ${dayRemaning(job.expiredAt) <= 7 ? 'text-red-600' : 'text-gray-600'}`} />
          <div>
            <div className="text-sm font-medium text-[#857876]">Hạn nộp</div>
            <div className={`text-[#000209] font-semibold ${dayRemaning(job.expiredAt) <= 7 ? 'text-red-600' : ''}`}>
              {convertDateToString(job.expiredAt)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
          <Briefcase className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#857876]">Loại công việc</div>
            <div className="text-[#000209] font-semibold">{job.typeJobs.map((t) => t.name).join(', ')}</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
          <Book className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#857876]">Kinh nghiệm</div>
            <div className="text-[#000209] font-semibold">{job.experience.name}</div>
          </div>
        </div>
        {job.education && (
          <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
            <GraduationCap className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-[#857876]">Học vấn</div>
              <div className="text-[#000209] font-semibold">{job.education.name}</div>
            </div>
          </div>
        )}
        {job.majors.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-[#f5f3ff]">
            <Star className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-[#857876]">Ngành nghề</div>
              <div className="text-[#000209] font-semibold">{job.majors[0].field.name}</div>
            </div>
          </div>
        )}

      </Card>
      <Card className="p-4">
        <h2 className="text-lg text-[#000209] font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Yêu cầu kỹ năng và chuyên ngành
        </h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold text-[#857876] w-1/3">Kỹ năng yêu cầu</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="font-semibold px-3 py-1">
                      <Zap size={12} className="mr-1 text-orange-500" />
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
            
            {job.majors.length > 0 && (
              <TableRow>
                <TableCell className="font-semibold text-[#857876]">Chuyên ngành</TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  {job.majors.map((major, index: number) => (
                    <div key={major.id} className="text-[#2b7fdc] font-bold hover:underline cursor-pointer flex items-center gap-2">
                      <div onClick={() => filterMajor(major.id)}>{major.name}</div>
                      {index < job.majors.length - 1 && <div>/</div>}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            )}
            {job.levels.length > 0 && (
              <TableRow>
                <TableCell className="font-semibold text-[#857876]">Cấp bậc</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {job.levels.map((level) => (
                      <Badge key={level.id} className="font-semibold bg-[#451da1] text-white px-3 py-1">
                        <Star size={12} className="mr-1" />
                        {level.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {job.languageJobs.length > 0 && (
              <TableRow>
                <TableCell className="font-semibold text-[#857876]">Ngôn ngữ</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {job.languageJobs.map((lang, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {lang.language?.name} - {lang.level}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <Card className="p-4">
        <h2 className="text-lg text-[#000209] font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          {job.benefits.length} Lý do gia nhập
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {job.benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-start gap-3 p-3">
              {iconMap[benefit.icon] ?? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
              <span className="text-[#000209] font-semibold">{benefit.name}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <h2 className="text-lg text-[#000209] font-semibold mb-4">Mô tả công việc</h2>
        <div  dangerouslySetInnerHTML={{ __html: job.description }} />
      </Card>
      <Card className="p-4">
        <h2 className="text-lg text-[#000209] font-semibold mb-4">Yêu cầu công việc</h2>
        <div  dangerouslySetInnerHTML={{ __html: job.requirement }} />
      </Card>
    </div>
  );
}
