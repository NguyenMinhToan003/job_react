import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Education } from '@/types/educationType';

export default function EducationJonPopup({
  educationId,
  setEducationId,
  educationList,
  notEdit,
}: {
  educationId?: number;
  setEducationId: (id: number) => void;
  educationList: Education[];
  notEdit?: boolean;
}) {
  return (
    <Card className='rounded-sm border-none shadow-md mb-4'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-start'>
          <div className='flex items-center gap-2'>
            <div className='flex-1'>YÊU CẦU BẰNG CẤP</div>
          </div>
          <div className='w-full h-[1px] bg-gray-200 mt-4' />
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <Select
          disabled={notEdit}
          value={educationId?.toString() || ''}
          onValueChange={(value) => setEducationId(Number(value))}
        >
          <SelectTrigger className='w-full bg-orange-100 text-red-800 font-bold'>
            <SelectValue placeholder='-- Chọn bằng cấp --' />
          </SelectTrigger>
          <SelectContent>
            {educationList.map((exp) => (
              <SelectItem key={exp.id} value={exp.id.toString()}
                className='text-red-800 '>
                {exp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
