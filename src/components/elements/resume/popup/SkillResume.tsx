import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResumeVersion } from "@/types/resumeType";
import { Plus } from "lucide-react";

export default function SkillResume({ resumeVer }: { resumeVer: ResumeVersion }) {
  return (
    <Card className='bg-white shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <h2 className='text-lg font-semibold text-black'>KỸ NĂNG</h2>
        <Button variant={'ghost'} className='p-0'>
          <Plus className='w-4 h-4 text-red-500' />
          </Button>
        </CardHeader>
        <CardContent className='pt-0 space-y-4'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
            <div className='flex gap-2 flex-wrap'>
              {
                resumeVer.skills?.length > 0 ? (
                  resumeVer.skills.map((skill, index) => (
                    <Badge
                   variant={'solid'}   
                    key={index}
                    className='text-xs font-normal px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:border-black transition-colors duration-200'
                  >
                    {skill.name}
                  </Badge>
                  ))
                ) : (
                  <span className='text-gray-500 text-xs'>Chưa có kỹ năng nào</span>
                )
              }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}