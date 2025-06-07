import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeVersion } from "@/types/resumeType";

export default function LanguageResume({ resumeVer }: { resumeVer: ResumeVersion }) {
  return (
    <Card className='bg-white shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-xl font-bold text-black'>NGÔN NGỮ</CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            {
             resumeVer.languageResumes.length > 0 && (
              <ul className='list-disc pl-5 space-y-2'>
                {resumeVer.languageResumes.map((language, index) => (
                  <li key={index} className='text-gray-700 marker:text-red-600 font-semibold'>
                    {language.language.name} - {language.level}
                  </li>
                ))}
              </ul>
            ) 
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 