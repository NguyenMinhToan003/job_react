import { AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobFilterResponse } from '@/types/jobType';
import { convertDateToDiffTime } from '@/utils/dateTime';
import { Avatar } from '@radix-ui/react-avatar';
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
      className={`rounded-lg cursor-pointer relative border-2 px-3 py-4 transition-all duration-200 gap-0 ${
        selectedJob.id === job.id
          ? 'border-[#ed1b2f] bg-white shadow-sm'
          : 'bg-white border border-gray-200'
      }`}
      onClick={() => setSelectedJob(job)}
    >
      <CardHeader className='p-0'>
        <CardTitle className='flex items-center justify-between text-orange-800 text-[12px] font-bold'>
          Đăng {convertDateToDiffTime(job.createdAt)}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-2 p-0'>

        <div className='text-lg font-bold text-gray-900'>{job.name}</div>


        {job.employer && (
          <div className='flex items-center gap-3'>
            <Avatar className='w-14 h-14 shadow-2xl border border-gray-400 rounded-sm'>
              <AvatarImage src={job.employer.logo} />
            </Avatar>
            <div className='font-semibold text-sm'>{job.employer.name}</div>
          </div>
        )}


        <div className='text-green-600 font-semibold text-sm p-2'>
          {job.maxSalary === job.minSalary && job.maxSalary === null ? (
            <div className='flex gap-2 items-center font-bold'>
              <HandCoins />
              <span>Thỏa thuận</span>
            </div>
          ) : (
            <div className='flex gap-2 items-center font-bold'>
              <HandCoins />
              <span>
                Từ {job.minSalary} đến {job.maxSalary}
              </span>
            </div>
          )}
        </div>


        <div className='text-sm flex gap-3 items-center text-gray-600 font-semibold flex-wrap'>
          {!isPrev &&
            job.typeJobs.length > 0 &&
            job.typeJobs.map((item, index) => (
              <div key={index} className='flex gap-2 items-center text-shadow-gray-600'>
                <Building2 size={14} />
                {item.name}
              </div>
            ))}

          <div className='flex gap-2 items-center text-gray-600'>
            <MapPin size={14} />
            {job.locations[0]?.district?.city?.name}
          </div>
        </div>


        {!isPrev && job.experience && (
          <div className='flex gap-2 items-center text-sm text-gray-600 font-semibold'>
            <Book size={14} />
            {job.experience.name} kinh nghiệm làm việc
          </div>
        )}
        <div className='w-full h-[1px] bg-gray-300 my-3' />
        <div className='flex flex-wrap gap-1'>
          {job.skills.slice(0, 4).map((skill, idx) => (
            <Badge
              key={idx}
              variant='outline'
              className='text-xs font-normal px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:border-black transition-colors duration-200'
            >
              {skill.name}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge
              variant='outline'
              className='text-xs font-normal px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:border-black transition-colors duration-200'
            >
              +{job.skills.length - 4} kỹ năng khác
            </Badge>
          )}
        </div>

        {/* <ul className='list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 font-semibold'>
          {job.benefits.map((benefit, idx) => (
            <li key={idx} className='marker:text-[#ed1b2f]'>
              {benefit.name}
            </li>
          ))}
        </ul> */}
      </CardContent>
    </Card>
  );
}
