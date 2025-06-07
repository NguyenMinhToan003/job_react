import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeVersion } from "@/types/resumeType";

export default function EdicationResume({resumeVer}: { resumeVer: ResumeVersion}) {
  return (
    <Card className='bg-white shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-xl font-bold text-black'>TRÌNH ĐỘ</CardTitle>
      </CardHeader>
      <CardContent className='pt-0 '>
        <ul className='list-disc pl-5 space-y-2'>
          <li className='text-gray-700 marker:text-red-600 font-semibold'>
            Chuyên ngành:
            <ul className='list-decimal pl-5'>
              {resumeVer.majors?.length > 0 ? (
                resumeVer.majors.map((major) => (
                  <li key={major.id} className='text-gray-700 marker:text-red-600'>
                    {major.name}
                  </li>
                ))
              ) : (
                <li className='text-gray-700 marker:text-red-600'>Chưa cập nhật</li>
              )}
            </ul>
          </li>
          <li className='text-gray-700 marker:text-red-600 font-semibold'>
            Trình độ học vấn: {resumeVer.education?.name || 'Chưa cập nhật'}
          </li>
          <li className='text-gray-700 marker:text-red-600 font-semibold'>
            Cấp bậc: {resumeVer.level?.name || 'Chưa cập nhật'}
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}