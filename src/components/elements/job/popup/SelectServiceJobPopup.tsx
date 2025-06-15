import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { EmployerSubResponse } from "@/types/employerSubType";

export default function SelectServiceJobPopup(
  {
    employerSub,
    selectEmployerSub,
    setSelectEmployerSub,
  }: {
    employerSub: EmployerSubResponse[];
    selectEmployerSub: EmployerSubResponse| null;
    setSelectEmployerSub: (sub: EmployerSubResponse) => void; 
  }
) {
  return (
    <Card className='mb-4 rounded-sm border-none shadow-md'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-start'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex-1'>CHỌN GÓI DỊCH VỤ SỬ DỤNG</div>
          </div>
          <div className='mt-4 h-[1px] w-full bg-gray-200' />
        </CardTitle>
      </CardHeader>
      <CardContent >
        <Select
          value={<div>
            
          </div>}
          onValueChange={(value) => {
            const sub = employerSub.find((s) => s.id.toString() === value);
            if (sub) {
              setSelectEmployerSub(sub);
            }
          }
          }
        >
          <SelectTrigger>
            <div className='flex items-center gap-2'>
              {selectEmployerSub ? selectEmployerSub.package.name : "Chọn gói dịch vụ"}
            </div>
          </SelectTrigger>
          <SelectContent>
            {employerSub.map((sub) => (
              <SelectItem
                key={sub.id}
                value={sub.id.toString()}
                onClick={() => setSelectEmployerSub(sub)}
              >
                {sub.package.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}