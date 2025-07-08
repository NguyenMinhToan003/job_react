import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NameJobPopup({
  nameJob,
  setNameJob,
  notEdit,
}: {
  nameJob: string;
  setNameJob: (description: string) => void;
  notEdit?: boolean;
}) {

  return (
    <>
      <Card className="rounded-sm border-none shadow-md mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-start">
            <div className="flex items-center gap-2">
              <div className="flex-1 ">TÊN CÔNG VIỆC</div>
              
            </div>
            <div className="w-full h-[1px] bg-gray-200 mt-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <Input
            placeholder="VD: Lập trình viên React, Trưởng phòng Marketing..."
            value={nameJob}
            className="w-full bg-[#EDECFF] border-none hover:bg-[#EDECFF] focus:bg-[#EDECFF] text-[#451DA0] hover:text-[#451DA0] focus:text-[#451DA0] rounded-none font-semibold"
            onChange={(e) => {
              if (notEdit) return;
              setNameJob(e.target.value);
            }}
            required
          />
        </CardContent>
      </Card>
    </>
  );
}
