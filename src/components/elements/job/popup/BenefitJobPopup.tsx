import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Benefit } from "@/types/benefitType";
import { Checkbox } from "@/components/ui/checkbox";
import { iconMap } from "@/utils/SetListIcon";
import { Gift } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function BenefitJobPopup({
  benefitList,
  benefitIds,
  setBenefitIds,
  notEdit,
}: {
  benefitList: Benefit[];
  benefitIds: string[];
  setBenefitIds: (benefitIds: string[]) => void;
  notEdit?: boolean;
}) {


  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1">PHÚC LỢI</div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 p-6">
        {
          benefitList.map((benefit) => (
            <div key={benefit.id} className="flex items-center gap-2">
              <Checkbox
                id={`benefit-${benefit.id}`}
                checked={benefitIds.some(item => item.toString() === benefit.id)}
                onCheckedChange={(checked) => {
                  if (notEdit) return;
                  if (checked) {
                    setBenefitIds([
                      ...benefitIds, benefit.id]);
                  } else {
                    setBenefitIds(benefitIds.filter(item => item !== benefit.id));
                  }
                }}
              />
              <Label htmlFor={`benefit-${benefit.id}`} className="flex items-center gap-2 cursor-pointer">
                <div className="text-primary text-xl">
                  {iconMap[benefit.icon] ?? <Gift />}
                </div>
                <span className="text text-gray-700">{benefit.name}</span>
              </Label>
            </div>
          ))
        }
      </CardContent>
    </Card>
  );
}
