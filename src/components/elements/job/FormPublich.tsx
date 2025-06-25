/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import {
  DollarSign,
  MapPin,
  Star,
  Zap,
  TrendingUp,
} from 'lucide-react'
import type { JobResponse } from '@/types/jobType'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PackageResponse } from '@/types/packageType'
import { getPackageAvailable } from '@/apis/paymentAPI'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import { useLoading } from '@/providers/LoadingProvider'
import { toast } from 'sonner'
import { JOB_STATUS } from '@/types/type'
import { jobUseSubscription } from '@/apis/jobAPI'
import { convertPrice } from '@/utils/convertPrice'

export default function FormPublish({ job }: { job: JobResponse }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageResponse>()
  const [packagesAvailable, setPackagesAvailable] = useState<PackageResponse[]>([])
  const { setLoading } = useLoading()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackageAvailable()
        setPackagesAvailable(response)
        if (response.length > 0) setSelectedPackage(response[0])
      } catch (error) {
        console.error('Error fetching packages:', error)
      }
    }
    fetchPackages()
  }, [])

  const handlePublish = async () => {
    try {
      setLoading(true);
      await jobUseSubscription({
        jobId: job.id,
        packageId: selectedPackage?.id || '',
      })
      toast.success('Tin đăng đã được xuất bản thành công')
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xuất bản tin đăng')
    }
    finally {
      setLoading(false);
    }
  }
  const renderButtonAction = () => {
    if (!job.isActive) return null
    if (job.isActive === JOB_STATUS.CREATE) 
    return <Button
        className='text-[#451DA0] hover:text-[#451DA0] border border-[#451DA0] bg-white hover:bg-white rounded-sm w-24'
        onClick={() => setIsOpen(true)}
      >
        Xuất bản
      </Button>

    if (job.isActive === JOB_STATUS.ACTIVE) 
      return <Button
    className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24'
    onClick={() => setIsOpen(true)}
  >
    Nâng cấp
  </Button>
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {renderButtonAction()}
      </AlertDialogTrigger>

      <AlertDialogContent className='min-w-7xl max-w-7xl min-h-[80vh] max-h-[80vh] overflow-hidden'>
        <div className='flex h-full'>
          {/* Main Content */}
          <div className='flex-1 overflow-y-auto'>
            <AlertDialogHeader className='mb-6'>
              <div className='flex items-center justify-between'>
                <AlertDialogTitle className='text-xl font-semibold text-neutral-700'>
                  Xuất bản tin đăng - <span className='text-gray-600'>{job.name}</span>
                </AlertDialogTitle>
              </div>
            </AlertDialogHeader>

            <AlertDialogDescription className='space-y-3 h-[60vh] overflow-y-auto p-4'>
              <Accordion type='multiple' defaultValue={['package']} className='space-y-4 w-full'>
                {/* Gói tin đăng */}
                <AccordionItem value='package' className='border border-neutral-200 rounded-md '>
                  <AccordionTrigger className='text-sm font-bold px-4 pt-4'>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='w-4 h-4 text-[#451DA0]' />
                      Tin đăng
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className='pb-0'>
                    <RadioGroup
                      value={selectedPackage?.id.toString() ?? ''}
                      onValueChange={(value) => {
                        const selected = packagesAvailable.find((pkg) => pkg.id.toString() === value)
                        if (selected) setSelectedPackage(selected)
                      }}
                    >
                      <Table className='p-0'>
                        <TableHeader className='bg-neutral-200'>
                          <TableRow>
                            <TableHead className='pl-4 text-neutral-700 text-xs'>Loại tin</TableHead>
                            <TableHead className='text-neutral-700 text-xs'>Số lượng</TableHead>
                            <TableHead className='text-neutral-700 text-xs'>Thời hạn</TableHead>
                          </TableRow>
                        </TableHeader>

                        {packagesAvailable.map((pkg) => (
                          <TableRow key={pkg.id} className='hover:bg-gray-50 cursor-pointer'>
                            <TableCell className='pl-4'>
                              <Label className='flex items-center gap-3 cursor-pointer'>
                                <RadioGroupItem value={pkg.id.toString()} />
                                <span className='text-sm font-medium'>{pkg.name}</span>
                              </Label>
                            </TableCell>
                            <TableCell className='text-sm text-neutral-700'>
                              {pkg.sub_total - pkg.sub_used} tin
                            </TableCell>
                            <TableCell className='text-sm text-neutral-700'>{pkg.dayValue} ngày</TableCell>
                          </TableRow>
                        ))}
                      </Table>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>

                {/* Hiệu ứng nổi bật */}
                <AccordionItem value='effects' className='border border-neutral-200 rounded-md'>
                  <AccordionTrigger className='text-sm font-bold px-4 py-2'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4 text-[#451DA0]' />
                      Hiệu ứng nổi bật
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className='px-4 pb-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                      <Card className='border-2 border-dashed border-gray-300 hover:border-yellow-500'>
                        <CardContent className='p-4 text-center'>
                          <Star className='w-8 h-8 mx-auto mb-2 text-yellow-500' />
                          <h4 className='font-medium mb-1'>Tin nổi bật</h4>
                          <p className='text-sm text-gray-500'>Làm nổi bật tin đăng của bạn</p>
                        </CardContent>
                      </Card>

                      <Card className='border-2 border-dashed border-gray-300 hover:border-orange-500'>
                        <CardContent className='p-4 text-center'>
                          <Zap className='w-8 h-8 mx-auto mb-2 text-orange-500' />
                          <h4 className='font-medium mb-1'>Tin gấp</h4>
                          <p className='text-sm text-gray-500'>Đánh dấu tin tuyển dụng gấp</p>
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AlertDialogDescription>
          </div>

          {/* Sidebar */}
          <div className='flex-1 bg-gray-50 p-6 border-l'>
            <div className='sticky top-0'>
              <h3 className='font-semibold text-lg mb-4'>Dịch vụ đang chọn</h3>
              <Card className='mb-6 border border-gray-200 rounded-md shadow-none'>
                <CardContent>
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-12 h-12 bg-white rounded border flex items-center justify-center overflow-hidden'>
                      <img src={job.employer.logo} alt='Company logo' className='w-full h-full' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-sm mb-1'>{job.name}</h4>
                      <p className='text-xs text-gray-500'>{job.employer.name}</p>
                    </div>
                  </div>

                  <div className='space-y-2 text-xs'>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='w-3 h-3 text-gray-400' />
                      <span>{convertPrice(job.minSalary, job.maxSalary)}</span>
                    </div>
                    {
                      job.locations && job.locations.map((location, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <MapPin className='w-3 h-3 text-gray-400' />
                          <span>{location.name}</span>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              {
                selectedPackage && (
                  <div className='mb-6 flex items-start gap-3'>
                    <Avatar className='h-20 w-28 rounded-none'>
                      <AvatarImage
                        src={selectedPackage.image}
                        alt={selectedPackage.name}
                      />
                    </Avatar>
                    <div className='ml-2 flex-1 space-y-2'>
                      <Label className='text-sm font-semibold'>{selectedPackage.name}</Label>
                      <Label className='text-xs text-gray-500'>{selectedPackage.features}</Label>
                      <Label className='text-xs'>
                        <span>{selectedPackage.dayValue} ngày | dự kiến tới </span>
                        <span className='text-[#451DA0]'>
                          {dayjs().add(selectedPackage.dayValue, 'day').format('DD/MM/YYYY')}
                        </span>
                      </Label>
                    </div>
                  </div>
                )
              }
              <Separator className='my-4' />
            </div>
          </div>
        </div>
        <AlertDialogFooter className='flex justify-end p-4'>
          <Button variant='outline' className='mr-2' onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button className=' bg-[#451DA0] hover:bg-[#3a1580] text-white' onClick=  {handlePublish}>
            Xuất bản tin đăng
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
