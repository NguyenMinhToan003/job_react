import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
              <div className="flex-1">TÊN CÔNG VIỆC</div>
              
            </div>
            <div className="w-full h-[1px] bg-gray-200 mt-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <input
            disabled={notEdit}
            type="text"
            className="w-full bg-transparent text-gray-800 placeholder-gray-500 text font-medium focus:outline-none border-b border-gray-300 focus:border-gray-500"
            placeholder="VD: Lập trình viên React, Trưởng phòng Marketing..."
            maxLength={200}
            value={nameJob}
            onChange={(e) => setNameJob(e.target.value)}
            required
          />
        </CardContent>
      </Card>
    </>
  );
}
