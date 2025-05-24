import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { JobFilterResponse } from '@/types/jobType';
import { Book, Building2, HandCoins, MapPin } from 'lucide-react';

export default function JobList({
  job,
  selectedJob,
  setSelectedJob,
  isPrev = false,
}: {
  job: JobFilterResponse;
  selectedJob: JobFilterResponse;
    setSelectedJob: (job: JobFilterResponse) => void;
  isPrev?: boolean;
}) {
  return (
    <Card
      key={job.id}
      className={`cursor-pointer relative border rounded-sm p-4 transition-all duration-200 ${
        selectedJob.id === job.id
          ? 'border border-[#ed1b2f] bg-white border-l-[5px] shadow-sm'
          : 'bg-white border border-gray-200'
      } p-4`}
      onClick={() => setSelectedJob(job)}
    >

      <CardContent className="space-y-4 p-0">
        {/* Job Title */}
        <div className="text-lg font-bold text-gray-800">
          [{job.experience?.name ?? 'Fresher/Experienced'}] {job.name}
        </div>
        {
          job.employer && (
            <div className="flex items-center gap-3">
          <img
            src={job.employer.logo}
            alt={job.employer.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="font-semibold text-sm">{job.employer.name}</div>
        </div>
          )
        }

        {/* Salary */}
        <div className="text-green-600 font-semibold text-sm">
          {job.maxSalary === job.minSalary && job.maxSalary === -9999 ? (
            <div className='flex gap-2 items-center justify-start font-bold'><HandCoins/><span> Thỏa thuận</span></div>
          ) : (
            <div className='flex gap-2 items-center justify-start font-bold'><HandCoins/> <span>Từ {job.minSalary} đến {job.maxSalary}</span></div>
          )}
        </div>

        {/* Job type */}
        {!isPrev && job.typeJobs.length>0 && job.typeJobs.map((item, index) => (
          <div key={index} className="text-sm flex gap-2 items-center text-shadow-gray-600">
            <Building2 size={14} />
            {item.name}
          </div>
        ))}

        {/* Location */}
        <div className="text-sm flex gap-2 items-center text-gray-600 font-semibold">
          <MapPin size={14} />
          {job.locations[0]?.district?.city?.name}
        </div>

        {/* Experience */}
        {
          !isPrev && job.experience && <>
            <div className="text-sm flex gap-2 items-center text-gray-600 font-semibold">
              <Book size={14} />
              {job.experience?.name} kinh nghiệm làm việc
            </div>
          </>
        }

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-300 my-2"></div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs font-medium px-2 py-1 rounded-full border"
            >
              {skill.name}
            </Badge>
          ))}
        </div>

        {/* Benefits */}
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 font-semibold">
          {job.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit.name}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
