import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TypeJob } from "@/types/TypeJobType";

export default function TypeJobPopup({
  typeJobList,
  typeJobId,
  setTypeJobId,
  notEdit,
}: {
  typeJobList: TypeJob[];
  typeJobId: number[];
  setTypeJobId: (id: number[]) => void;
  notEdit?: boolean;
}) {
  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (notEdit) return;
    if (checked) {
      setTypeJobId([...typeJobId, id]);
    } else {
      setTypeJobId(typeJobId.filter((item) => item !== id));
    }
  };

  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1">HÌNH THỨC LÀM VIỆC</div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {typeJobList.map((typeJob) => {
            const isChecked = typeJobId.some((item) => item === Number(typeJob.id));
            return (
              <div key={typeJob.id} className="flex items-center gap-2">
                <Checkbox
                  disabled={notEdit}
                  id={`type-job-${typeJob.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(Number(typeJob.id), Boolean(checked))
                  }
                />
                <Label htmlFor={`type-job-${typeJob.id}`} className="cursor-pointer">
                  {typeJob.name}
                </Label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
