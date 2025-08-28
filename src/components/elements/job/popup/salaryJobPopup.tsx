import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  salaryMax?: number| null
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
                  ? 'text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none'
                  : 'text-gray-500'
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isNegotiable ? 'text-[#451DA0]' : 'text-gray-500'
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
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-medium text-gray-700'>
                Mức lương tối thiểu  (vnd)
              </Label>
              <Input
                type='text'
                className='w-full bg-[#EDECFF] border-none hover:bg-[#EDECFF] focus:bg-[#EDECFF] text-[#451DA0] hover:text-[#451DA0] focus:text-[#451DA0] rounded-none font-semibold'
                placeholder='Nhập mức lương tối thiểu'
                value={salaryMin === null ? '' : salaryMin}
                onChange={(e) => {
                  const value = e.target.value
                  setSalaryMin(value === '' ? 0 : parseInt(value) || 0)
                }}
                maxLength={200}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-medium text-gray-700'>
                Mức lương tối đa (vnd)
              </Label>
              <Input
                type='text'
                className='w-full bg-[#EDECFF] border-none hover:bg-[#EDECFF] focus:bg-[#EDECFF] text-[#451DA0] hover:text-[#451DA0] focus:text-[#451DA0] rounded-none font-semibold'
                placeholder='Nhập mức lương tối đa'
                value={salaryMax === null ? '' : salaryMax}
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
            <BadgeCheck className='text-[#451DA0]' />
            <span className='text-[#451DA0]'>Thương lượng</span>
          </div>
        )}
        </div>
         <div className='text-sm text-gray-500'>
          <span className='text-[#451DA0] font-semibold'>Tips:</span>{' '}
          <span className='text-neutral-600'>
            Bạn có thể để trống mức lương tối thiểu và tối đa nếu muốn thương lượng. 
            Khi đó, ứng viên sẽ biết rằng mức lương có thể được thỏa thuận dựa trên kinh nghiệm và kỹ năng của họ.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
