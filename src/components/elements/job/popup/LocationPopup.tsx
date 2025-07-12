import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LocationResponse } from "@/types/location";
import { CirclePlus, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LocationJobPopup({
  locationList,
  locationIds,
  setLocationIds,
  notEdit,
}: {
  locationList: LocationResponse[];
  locationIds: number[];
  setLocationIds: (locationIds: number[]) => void;
  notEdit?: boolean;
  }) {
  const navigate = useNavigate();

  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1 text-neutral-600">ĐỊA ĐIỂM</div>
            {
              !notEdit && <>
              {
              locationList?.length === 0 ? <>
                <CirclePlus
                  className="cursor-pointer text-[#451da1]"
                  size={20}
                  onClick={() => navigate('/danh-cho-nha-tuyen-dung/dia-diem')}
                />
              </>
                :
                <SquarePen
                  className="text-[#451da1] cursor-pointer"
                  size={20}
                  onClick={() => navigate('/danh-cho-nha-tuyen-dung/dia-diem')}
                />
                }
              </>
            }
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-4">
        {
          locationList?.length>0 && locationList.map((location) => (
            <div key={location.id} className="flex items-center gap-2">
              <Checkbox
                id={`location-${location.id}`}
                checked={locationIds.some(item => item === location.id)}
                onCheckedChange={(checked) => {
                  if (notEdit) return;
                  if (checked) {
                    setLocationIds([...locationIds, location.id]);
                  } else {
                    setLocationIds(locationIds.filter(item => item !== location.id));
                  }
                }}
              />
              <Label htmlFor={`location-${location.id}`} className="flex items-center gap-2 cursor-pointer">
                <span className="">{location.name}</span>
              </Label>
            </div>
          ))
        }
      </CardContent>
    </Card>
  );
}
