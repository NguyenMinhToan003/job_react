import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skill } from '@/types/SkillType';
import { Button } from '@/components/ui/button';

export default function SkillJobPopup({
  skillList,
  selectedSkills,
  setSelectedSkills,
}: {
  skillList: Skill[];
  selectedSkills: Skill[];
  setSelectedSkills: (skills: Skill[]) => void;
}) {
  const toggleSkill = (skill: Skill) => {
    const isSelected = selectedSkills.some((s) => s.id === skill.id);
    const updatedSkills = isSelected
      ? selectedSkills.filter((s) => s.id !== skill.id)
      : [...selectedSkills, skill];
    setSelectedSkills(updatedSkills);
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
          const isSelected = selectedSkills.some((s) => s.id === skill.id);
          return (
            <Button
              key={skill.id}
              variant={isSelected ? 'default' : 'outline'}
              className="w-full text-start"
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
