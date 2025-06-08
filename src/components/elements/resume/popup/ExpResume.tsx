import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResumeVersion } from "@/types/resumeType";

export default function ExpResume({resumeVer}: { resumeVer: ResumeVersion}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-black'>  
          KINH NGHIỆM LÀM VIỆC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='list-disc space-y-2 px-4'>
          {
          resumeVer.experiences.length > 0 && resumeVer.experiences.map((exp, index) => <>
            <li key={index} className='text-gray-700 marker:text-red-600 font-semibold'>
              <div className='text-xl font-bold'>{exp.position}</div>
                  <div className='text-sm font-semibold'>{exp.companyName}</div>
                  <div className='text-sm text-gray-600 font-semibold'>
                    {exp.endTime} - {exp.endTime}
                  </div>
                <div className='text-sm text-gray-600 font-semibold'>{exp.jobDescription}</div>
              </li>
            </>)
            }
        </ul>
      </CardContent>
    </Card>
  );
}