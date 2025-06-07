import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeVersion } from "@/types/resumeType";

export default function AboutMeResume({resumeVer}: { resumeVer: ResumeVersion }) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-xl font-bold text-black'>GIỚI THIỆU BẢN THÂN</CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <ul className='list-disc pl-5 space-y-2'>
          {resumeVer.about?.split('\n').map((item, index) => (
            <li key={index} className='text-gray-700 marker:text-red-600 font-semibold'>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}