import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Level } from "@/types/levelType";

export default function LevelJobPopup({
  levelIds = [],
  setLevelIds,
  levelList,
}: {
  levelIds?: Level[];
  setLevelIds: (levelIds: Level[]) => void;
  levelList: Level[];
}) {
  const handleCheckboxChange = (level: Level, checked: boolean) => {
    if (checked) {
      setLevelIds([...levelIds, level]);
    } else {
      setLevelIds(levelIds.filter((l) => l.id !== level.id));
    }
  };

  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1">CẤP BẬC TUYỂN DỤNG</div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {levelList.map((level) => {
            const isChecked = levelIds.some((l) => l.id === level.id);
            return (
              <div key={level.id} className="flex items-center gap-2">
                <Checkbox
                  id={`level-job-${level.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(level, Boolean(checked))
                  }
                />
                <label htmlFor={`level-job-${level.id}`} className="cursor-pointer">
                  {level.name}
                </label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
