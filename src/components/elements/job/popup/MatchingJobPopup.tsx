/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MatchingJobPopup({locationWeight,
  setLocationWeight,
  skillWeight,
  setSkillWeight,
  majorWeight,
  setMajorWeight,
  languageWeight,
  setLanguageWeight,
  educationWeight,
  setEducationWeight,
  levelWeight,
  setLevelWeight,
  isEdit,
  jobId,
}: {
    locationWeight: number;
    setLocationWeight: (value: number) => void;
    skillWeight: number;
    setSkillWeight: (value: number) => void;
    majorWeight: number;  
    setMajorWeight: (value: number) => void;
    languageWeight: number;
    setLanguageWeight: (value: number) => void;
    educationWeight: number;
    setEducationWeight: (value: number) => void;
    levelWeight: number;
    setLevelWeight: (value: number) => void;
    jobId?: number;
    isEdit?: boolean;
  }) {


  return <>
    <Card >
      <CardHeader>
        <CardTitle className='text-lg font-bold text-start'>
          TIÊU CHÍ ĐÁNH GIÁ
          <div className='w-full h-[1px] bg-gray-200 mt-4' />
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-4 p-6'>
        <div className='flex justify-between items-center'>
          <Label className='flex-1'>Địa điểm làm việc</Label>
          <Input className='w-25' disabled={isEdit}
            value={locationWeight}
            onChange={(e) => setLocationWeight(Number(e.target.value))}
          />
        </div>
        <div className='flex justify-between items-center'>
          <Label className='flex-1'>Kĩ năng</Label>
          <Input className='w-25' disabled={isEdit}
            value={skillWeight}
            onChange={(e) => setSkillWeight(Number(e.target.value))}
          />
        </div>
        <div className='flex justify-between items-center'>
          <Label className='flex-1'>Ngành nghề</Label>
          <Input className='w-25' disabled={isEdit}
            value={majorWeight}
            onChange={(e) => setMajorWeight(Number(e.target.value))}
          />
        </div>
        <div className='flex justify-between items-center'>
          <Label className='flex-1'>Bằng cấp</Label>
          <Input className='w-25' disabled={isEdit}
            value={educationWeight}
            onChange={(e) => setEducationWeight(Number(e.target.value))}
          />

        </div>
        <div className='flex justify-between items-center'>
          <Label className='flex-1'>Ngoại Ngữ</Label>
          <Input className='w-25' disabled={isEdit}
            value={languageWeight}
            onChange={(e) => setLanguageWeight(Number(e.target.value))}
          />
        </div>
        <div className='flex justify-between items-center'>
          <Label className='flex-1'>Trình độ học vấn</Label>
          <Input className='w-25' disabled={isEdit}
            value={levelWeight}
            onChange={(e) => setLevelWeight(Number(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  </>
}