import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skill } from '@/types/skillType';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export default function SkillJobPopup({
  skillList,
  selectedSkills,
  setSelectedSkills,
  notEdit,
}: {
  skillList: Skill[];
  selectedSkills: number[];
  setSelectedSkills: (skills: number[]) => void;
  notEdit?: boolean;
}) {
  const toggleSkill = (skill: Skill) => {
    if (notEdit) return;
    const isSelected = selectedSkills.some((s) => s === skill.id);
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill.id]);
    }
  };

  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1">KĨ NĂNG CHUYÊN MÔN</div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-2 grid grid-cols-4 gap-2">
        {skillList.map((skill) => {
          const isSelected = selectedSkills.some((s) => s === skill.id);
          return (
            <Button
              key={skill.id}
              variant={isSelected ? 'default' : 'outline'}
              className={clsx(
                'w-full h-10 justify-start text-left',
                isSelected ? 'text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none' : 'text-gray-700',
              )}
              onClick={() => toggleSkill(skill)}
            >
              {skill.name}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
