import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Level } from "@/types/levelType"

export default function LevelJobSelect({
  levelId,
  setLevelId,
  levelList,
}: {
  levelId?: number;
  setLevelId: (levelId: number) => void;
  levelList: Level[];
}) {
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
        <Select
          value={levelId?.toString() || ""}
          onValueChange={(value) => setLevelId(Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-- Chọn cấp bậc --" />
          </SelectTrigger>
          <SelectContent>
            {levelList.map((level) => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
