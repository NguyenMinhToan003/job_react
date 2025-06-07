import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ResumeVersion } from '@/types/resumeType';

export default function SkillResume({ resumeVer }: { resumeVer: ResumeVersion }) {
  return (
    <Card className='bg-white shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <h2 className='text-xl font-bold text-black'>KỸ NĂNG</h2>
        </CardHeader>
        <CardContent className='pt-0 space-y-4'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
            <div className='flex gap-2 flex-wrap'>
              {
                resumeVer.skills.map((skill, index) => (
                  <Badge
                  variant={'outline'}  
                  key={index}
                  className='text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:border-black transition-colors duration-200 font-semibold'
                >
                  {skill.name}
                </Badge>
                ))
              }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}