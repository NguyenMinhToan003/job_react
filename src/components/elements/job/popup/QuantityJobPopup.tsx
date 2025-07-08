import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function QuantityJobPopup({
  quantityJob,
  setQuantityJob,
  notEdit,
}: {
  quantityJob: number;
  setQuantityJob: (quantity: number) => void;
  notEdit?: boolean;
}) {

  return (
    <>
      <Card className='rounded-sm border-none shadow-md mb-4'>
        <CardHeader>
          <CardTitle className='text-lg font-bold text-start'>
            <div className='flex items-center gap-2'>
              <div className='flex-1'>SỐ LƯỢNG TUYỂN</div>
              
            </div>
            <div className='w-full h-[1px] bg-gray-200 mt-4' />
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 space-y-2'>
          <Input
            type='number'
            className='w-full bg-[#EDECFF] border-none hover:bg-[#EDECFF] focus:bg-[#EDECFF] text-[#451DA0] hover:text-[#451DA0] focus:text-[#451DA0] rounded-none font-semibold'
            placeholder='Nhập số lượng tuyển dụng'
            value={quantityJob}
            onChange={(e) => {
              if (notEdit) return;
              const value = e.target.value
              setQuantityJob(value === '' ? 0 : parseInt(value) || 0)
            }}
            required
          />
        </CardContent>
      </Card>
    </>
  );
}
