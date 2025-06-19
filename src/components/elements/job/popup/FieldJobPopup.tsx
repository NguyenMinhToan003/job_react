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
import { Field } from '@/types/majorType';

export default function FieldJobPopup({
  selectField,
  setSelectField,
  fields,
  notEdit,
}: {
  selectField?: number| null;
  setSelectField: (id: number) => void;
  fields: Field[];
  notEdit?: boolean;
}) {
  return (
    <Card className='rounded-sm border-none shadow-md mb-4'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-start'>
          <div className='flex items-center gap-2'>
            <div className='flex-1'>KINH NGHIỆM</div>
          </div>
          <div className='w-full h-[1px] bg-gray-200 mt-4' />
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <Select
          disabled={notEdit}
          value={selectField?.toString() || ''}
          onValueChange={(value) => setSelectField(Number(value))}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='-- Chọn kinh nghiệm --' />
          </SelectTrigger>
          <SelectContent>
            {fields.map((exp) => (
              <SelectItem key={exp.id} value={exp.id.toString()}>
                {exp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
