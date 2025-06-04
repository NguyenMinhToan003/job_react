import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResumeVersion } from "@/types/resumeType";
import { Edit } from "lucide-react";

export default function AboutMeResume({resumeVer}: { resumeVer: ResumeVersion }) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <h2 className='text-lg font-semibold text-black'>GIỚI THIỆU BẢN THÂN</h2>
        <Button variant={'ghost'} className='p-0'>
          <Edit className='w-4 h-4 text-red-500' />
        </Button>
      </CardHeader>
      <CardContent className='pt-0'>
        <p className='text-gray-600 text-sm'>
          {resumeVer.career || "Chưa có thông tin giới thiệu bản thân."}
        </p>
      </CardContent>
    </Card>
  )
}