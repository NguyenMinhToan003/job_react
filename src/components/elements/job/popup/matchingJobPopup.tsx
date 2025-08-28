/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MatchingJobPopup({
  locationWeight,
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
  const sharedInputClass =
    'w-25 bg-[#EDECFF] border-none hover:bg-[#EDECFF] focus:bg-[#EDECFF] text-[#451DA0] hover:text-[#451DA0] focus:text-[#451DA0] rounded-none font-semibold';
  const sharedLabelClass = 'flex-1 min-w-fit text-[#451DA0]';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          TIÊU CHÍ ĐÁNH GIÁ
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 p-6">
        <div className="flex justify-between items-center">
          <Label className={sharedLabelClass}>Địa điểm làm việc</Label>
          <Input
            className={sharedInputClass}
            type="number"
            value={locationWeight}
            onChange={(e) => {
              if (isEdit) return; 
              setLocationWeight(Number(e.target.value));
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <Label className={sharedLabelClass}>Kĩ năng</Label>
          <Input
            className={sharedInputClass}
            type="number"
            value={skillWeight}
            onChange={(e) => {
              if (isEdit) return; 
              setSkillWeight(Number(e.target.value));
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <Label className={sharedLabelClass}>Ngành nghề</Label>
          <Input
            className={sharedInputClass}
            type="number"
            value={majorWeight}
            onChange={(e) => {
              if (isEdit) return; 
              setMajorWeight(Number(e.target.value));
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <Label className={sharedLabelClass}>Bằng cấp</Label>
          <Input
            className={sharedInputClass}
            type="number"
            value={educationWeight}
            onChange={(e) => {
              if (isEdit) return; 
              setEducationWeight(Number(e.target.value));
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <Label className={sharedLabelClass}>Ngoại ngữ</Label>
          <Input
            className={sharedInputClass}
            type="number"
            value={languageWeight}
            onChange={(e) => {
              if (isEdit) return; 
              setLanguageWeight(Number(e.target.value));
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <Label className={sharedLabelClass}>Trình độ học vấn</Label>
          <Input
            className={sharedInputClass}
            type="number"
            value={levelWeight}
            onChange={(e) => {
              if (isEdit) return; 
              setLevelWeight(Number(e.target.value));
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
