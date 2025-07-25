import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field } from '@/types/majorType';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function FieldJobPopup({
  selectField,
  setSelectField,
  fields,
  selectMajors = [],
  setSelectMajors = () => {},
  notEdit,
}: {
  selectField?: Field | null;
  setSelectField: (field: Field) => void;
  fields: Field[];
  selectMajors?: number[];
  setSelectMajors?: (majors: number[]) => void;
  notEdit?: boolean;
  }) {
  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1">NGÀNH NGHỀ</div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Select
          defaultValue={selectField?.id?.toString() || ''}
          value={selectField?.id?.toString() || ''}
          onValueChange={(value) => {
            if (notEdit) return;
            const selectedField = fields.find(
              (field) => field.id.toString() === value
            );
            if (selectedField) {
              setSelectField(selectedField);
              setSelectMajors([]);
            }
          }}
        >
          <SelectTrigger className="w-full bg-[#EDECFF] border-none hover:bg-[#EDECFF] focus:bg-[#EDECFF] text-[#451DA0] hover:text-[#451DA0] focus:text-[#451DA0] rounded-none font-semibold">
            <SelectValue placeholder="-- Chọn ngành nghề --">
              {selectField ? selectField.name : '-- Chọn ngành nghề --'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id.toString()}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Majors */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {selectField && selectField?.majors?.length > 0 ? (
            selectField?.majors?.map((major) => {
              const isChecked = selectMajors.includes(major.id);

              return (
                  <Label key={major.id} className="ml-2 text-sm text-gray-700 mt-2 flex gap-2 items-center">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (notEdit) return;
                      if (selectMajors.length >= 3 && checked) {
                        return;
                      }
                      if (checked) {
                        setSelectMajors([...selectMajors, major.id]);
                      } else {
                        setSelectMajors(
                          selectMajors.filter((id) => id !== major.id)
                        );
                      }
                    }}
                  />
                  {
                    <span className='text-gray-600'>{major.name}</span>
                  }
                  </Label>
              );
            })
          ) : (
            <div className="text-gray-500 text-sm mt-2 col-span-3">
              Vui lòng chọn ngành nghề để hiển thị chuyên ngành.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
