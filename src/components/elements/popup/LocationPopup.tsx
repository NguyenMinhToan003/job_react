import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
            <div className="flex-1">ĐỊA ĐIỂM</div>
            {
              locationList.length === 0 ? <>
                <CirclePlus
                  className="cursor-pointer text-red-500"
                  size={20}
                  onClick={() => navigate('/danh-cho-nha-tuyen-dung/dia-diem')}
                />
              </>
                :
                <SquarePen
                  className="text-red-500 cursor-pointer"
                  size={20}
                  onClick={() => navigate('/danh-cho-nha-tuyen-dung/dia-diem')}
                />
            }
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-4">
        {
          locationList.map((location) => (
            <div key={location.id} className="flex items-center gap-2">
              <Checkbox
                disabled={notEdit}
                id={`location-${location.id}`}
                className='checked:bg-red-500'
                checked={locationIds.some(item => item === location.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setLocationIds([...locationIds, location.id]);
                  } else {
                    setLocationIds(locationIds.filter(item => item !== location.id));
                  }
                }}
              />
              <label htmlFor={`location-${location.id}`} className="flex items-center gap-2 cursor-pointer">
                <span className="text text-gray-700">{location.name}</span>
              </label>
            </div>
          ))
        }
      </CardContent>
    </Card>
  );
}
