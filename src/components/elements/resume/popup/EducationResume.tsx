import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResumeVersion } from "@/types/resumeType";
import { Plus } from "lucide-react";

export default function EdicationResume({resumeVer}: { resumeVer: ResumeVersion}) {
  return (
    <Card className='bg-white shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <h2 className='text-lg font-semibold text-black'>HỌC VẤN</h2>
        <Button variant={'ghost'} className='p-0'>
          <Plus className='w-4 h-4 text-red-500' />
        </Button>
      </CardHeader>
      <CardContent className='pt-0'>
      <div className='flex items-start justify-between'>
          <div className='flex-1'>
            {
              resumeVer.education ? <>
                <p className='text-gray-600 text-sm'>
                  {resumeVer.education.name || "Chưa có thông tin trường học."}
                </p>
              </>
                :
                <p className='text-gray-600 text-sm'>
                  Chưa có thông tin học vấn.
                </p>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}