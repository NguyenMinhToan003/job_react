import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
          <input
            disabled={notEdit}
            type='number'
            className='mt-4 w-full border-b-2 border-gray-300 bg-transparent text-gray-800 placeholder-gray-500 font-medium focus:border-gray-500 focus:outline-none'
            placeholder='Nhập số lượng tuyển dụng'
            value={quantityJob}
            onChange={(e) => {
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
