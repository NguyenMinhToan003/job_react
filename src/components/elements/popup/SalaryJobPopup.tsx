import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BadgeCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SalaryJonPopup({
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  notEdit,
}: {
  salaryMin?: number| null
  setSalaryMin: (salary: number| null) => void
  salaryMax?: number
  setSalaryMax: (salary: number| null) => void
  notEdit?: boolean
}) {
  const [isNegotiable, setIsNegotiable] = useState(false) 
  const handleNegotiableToggle = () => {
    if (notEdit) return
    setIsNegotiable((prev) => {
      const newVal = !prev
      if (newVal) {
        setSalaryMin(null)
        setSalaryMax(null)
      }
      else {
        setSalaryMin(0)
        setSalaryMax(0)
      }
      return newVal
    })
  }
  useEffect(() => {
    if (salaryMin === null) {
      setIsNegotiable(true)
    } else {
      setIsNegotiable(false)
    }
  }, [salaryMin])

  return (
    <Card className='mb-4 rounded-sm border-none shadow-md'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-start'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex-1'>MỨC LƯƠNG (VND)</div>
            <Button
              variant='outline'
              onClick={handleNegotiableToggle}
              className={`flex items-center gap-2 ${
                isNegotiable
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <BadgeCheck color={isNegotiable ? 'green' : 'gray'} />
              <span
                className={`text-sm font-medium ${
                  isNegotiable ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                Có thể thương lượng
              </span>
            </Button>
          </div>
          <div className='mt-4 h-[1px] w-full bg-gray-200' />
        </CardTitle>
      </CardHeader>

      <CardContent >
        <div className='grid grid-cols-2 gap-20 p-6'>
        {!isNegotiable ? (
          <>
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700'>
                Mức lương tối thiểu  (vnd)
              </label>
              <input
                type='text'
                className='mt-4 w-full border-b-2 border-gray-300 bg-transparent text-gray-800 placeholder-gray-500 font-medium focus:border-gray-500 focus:outline-none'
                placeholder='Nhập mức lương tối thiểu'
                value={salaryMin === null ? '' : salaryMin}
                onChange={(e) => {
                  const value = e.target.value
                  setSalaryMin(value === '' ? 0 : parseInt(value) || 0)
                }}
                maxLength={200}
              />
            </div>

            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700'>
                Mức lương tối đa (vnd)
              </label>
              <input
                type='text'
                className='mt-4 w-full border-b-2 border-gray-300 bg-transparent text-gray-800 placeholder-gray-500 font-medium focus:border-gray-500 focus:outline-none'
                placeholder='Nhập mức lương tối đa'
                value={salaryMax}
                onChange={(e) => {
                  const value = e.target.value
                  setSalaryMax(value === '' ? 0 : parseInt(value) || 0)
                }}
                maxLength={200}
              />
            </div>
          </>
        ) : (
          <div className='col-span-2 flex items-center justify-center gap-2 text-center font-bold text-gray-500'>
            <BadgeCheck className='text-green-600' />
            <span className='text-green-600'>Thương lượng</span>
          </div>
        )}
        </div>
         <div className='text-sm text-gray-500'>
          <span className='text-orange-600 font-semibold'>Tips:</span>{' '}
          Bạn có thể nhập mức lương tối thiểu và tối đa cho vị trí này. Nếu bạn không muốn công khai mức lương, hãy chọn tùy chọn 'Có thể thương lượng'.
        </div>
      </CardContent>
    </Card>
  )
}
