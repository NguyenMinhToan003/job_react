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
  TrendingUp,
} from 'lucide-react'
import type { JobDetailResponse } from '@/types/jobType'
import { PackageResponse } from '@/types/packageType'
import { getPackageAvailable } from '@/apis/paymentAPI'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import { useLoading } from '@/providers/LoadingProvider'
import { toast } from 'sonner'
import { JOB_STATUS, PackageType } from '@/types/type'
import { jobUseSubscription, publishJob } from '@/apis/jobAPI'
import { convertPrice } from '@/utils/convertPrice'
import { EmployerSubResponse } from '@/types/employerSubType'

export default function FormPublish({ job }: { job: JobDetailResponse }) {
  const [isOpen, setIsOpen] = useState(false)
  const [usedPackage, setUsedPackage] = useState<EmployerSubResponse[]>()
  const [selectedBannerPackage, setSelectedBannerPackage] = useState<PackageResponse>()
  const [selectedJobPackage, setSelectedJobPackage] = useState<PackageResponse>()
  const [packagesJobAvailable, setPackagesJobAvailable] = useState<PackageResponse[]>([])
  const [packagesBannerAvailable, setPackagesBannerAvailable] = useState<PackageResponse[]>([])
  const { setLoading } = useLoading()

  const fetchPackages = async () => {
    try {
      const [banner, jobPack] = await Promise.all([
        getPackageAvailable({ type: [PackageType.BANNER], mini: true }),
        getPackageAvailable({ type: [PackageType.JOB] , mini: true }),
      ])
      setPackagesBannerAvailable(banner)
      setPackagesJobAvailable(jobPack)
      setUsedPackage(job.employerSubscription || [])
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải gói tin đăng')
    }
  }
  useEffect(() => {
    fetchPackages()
  }, [])

  const handlePublish = async () => {
    try {
      setLoading(true);
      if (selectedBannerPackage) {
        await jobUseSubscription({
          jobId: job.id,
          packageId: selectedBannerPackage?.id || '',
        })
      }
      if (selectedJobPackage) {
        await jobUseSubscription({
          jobId: job.id,
          packageId: selectedJobPackage?.id || '',
        })
      }
      if (!selectedBannerPackage && !selectedJobPackage) {
        await publishJob(job.id)
      }
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

  const handleSelectBannerPackage = (pkg: PackageResponse) => {
    const check = usedPackage?.find(item => {
      if (item.package.type === PackageType.BANNER) {
        const diffEndDate = dayjs(item.endDate).diff(dayjs(), 'day')
        if (diffEndDate > 0) {
          toast.error(`Bạn đã sử dụng gói ${item.package.name} và còn ${diffEndDate} ngày sử dụng`)
          return item;
        }
      }
    })
    if (check !== undefined) return;
    if (selectedBannerPackage?.id === pkg.id) {
      setSelectedBannerPackage(undefined)
    } else {
      setSelectedBannerPackage(pkg)
    }
  }
  const handleSelectJobPackage = (pkg: PackageResponse) => {
    const check = usedPackage?.find(item => {
      if (item.package.type === PackageType.JOB) {
        const diffEndDate = dayjs(item.endDate).diff(dayjs(), 'day')
        if (diffEndDate > 0) {
          toast.error(`Bạn đã sử dụng gói ${item.package.name} và còn ${diffEndDate} ngày sử dụng`)
          return item;
        }
      }
    }
    )
    if (check!= undefined) return;
    if (selectedJobPackage?.id === pkg.id) {
      setSelectedJobPackage(undefined)
    } else {
      setSelectedJobPackage(pkg)
    }
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
                <AccordionItem value='package' className='border border-neutral-200 rounded-md '>
                  <AccordionTrigger className='text-sm font-bold px-4 pt-4'>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='w-4 h-4 text-[#451DA0]' />
                      Tin đăng
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className='pb-0'>
                    {
                      packagesBannerAvailable.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
                          {
                            packagesBannerAvailable.map((pkg) => (
                              <div
                                key={pkg.id}
                                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors
                                  ${selectedBannerPackage?.id === pkg.id ? 'bg-gray-100 border-[#451DA0]' : 'border-gray-200'}`}
                                onClick={() => handleSelectBannerPackage(pkg)}
                              >
                                <div className='flex items-center gap-3 mb-2'>
                                  <Avatar className='h-10 w-10 rounded-none'>
                                    <AvatarImage src={pkg.image} alt={pkg.name} />
                                  </Avatar>
                                  <div className='flex-1'>
                                    <Label className='text-sm font-semibold'>{pkg.name}
                                      <span className='text-xs text-gray-500'>
                                        X {pkg.sub_total- pkg.sub_used} 
                                      </span>
                                    </Label>
                                    <p className='text-xs text-gray-500'>{pkg.features}</p>
                                  </div>
                                </div>
                                <div className='text-xs text-gray-600'>
                                  {pkg.dayValue} ngày | dự kiến tới{' '}
                                  <span className='text-[#451DA0]'>
                                    {dayjs().add(pkg.dayValue, 'day').format('DD/MM/YYYY')}
                                  </span>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      ) : (
                        <p className='text-sm text-gray-500'>Không có gói dịch vụ nào khả dụng</p>
                      )
                    }
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
                      {
                        packagesJobAvailable.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors
                              ${selectedJobPackage?.id === pkg.id ? 'bg-gray-100 border-[#451DA0]' : 'border-gray-200'}`}
                              onClick={() => handleSelectJobPackage(pkg)}
                          >
                            <div className='flex items-center gap-3 mb-2'>
                              <Avatar className='h-10 w-10 rounded-none'>
                                <AvatarImage src={pkg.image} alt={pkg.name} />
                              </Avatar>
                              <div className='flex-1'>
                                <Label className='text-sm font-semibold'>{pkg.name}</Label>
                                <p className='text-xs text-gray-500'>{pkg.features}</p>
                              </div>
                            </div>
                            <div className='text-xs text-gray-600'>
                              {pkg.dayValue} ngày | dự kiến tới{' '}
                              <span className='text-[#451DA0]'>
                                {dayjs().add(pkg.dayValue, 'day').format('DD/MM/YYYY')}
                              </span>
                            </div>
                          </div>
                        ))
                      }
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
                selectedBannerPackage && (
                  <div className='mb-6 flex items-start gap-3'>
                    <Avatar className='h-20 w-28 rounded-none'>
                      <AvatarImage
                        src={selectedBannerPackage.image}
                        alt={selectedBannerPackage.name}
                      />
                    </Avatar>
                    <div className='ml-2 flex-1 space-y-2'>
                      <Label className='text-sm font-semibold'>{selectedBannerPackage.name}</Label>
                      <Label className='text-xs text-gray-500'>{selectedBannerPackage.features}</Label>
                      <Label className='text-xs'>
                        <span>{selectedBannerPackage.dayValue} ngày | dự kiến tới </span>
                        <span className='text-[#451DA0]'>
                          {dayjs().add(selectedBannerPackage.dayValue, 'day').format('DD/MM/YYYY')}
                        </span>
                      </Label>
                    </div>
                  </div>
                )
              }
              {
                selectedJobPackage && (
                  <div className='mb-6 flex items-start gap-3'>
                    <Avatar className='h-20 w-28 rounded-none'>
                      <AvatarImage
                        src={selectedJobPackage.image}
                        alt={selectedJobPackage.name}
                      />
                    </Avatar>
                    <div className='ml-2 flex-1 space-y-2'>
                      <Label className='text-sm font-semibold'>{selectedJobPackage.name}</Label>
                      <Label className='text-xs text-gray-500'>{selectedJobPackage.features}</Label>
                      <Label className='text-xs'>
                        <span>{selectedJobPackage.dayValue} ngày | dự kiến tới </span>
                        <span className='text-[#451DA0]'>
                          {dayjs().add(selectedJobPackage.dayValue, 'day').format('DD/MM/YYYY')}
                        </span>
                      </Label>
                    </div>
                  </div>
                )
              }
              <Separator className='my-4' />
              <div className='space-y-4 opacity-40'>
                <Label className='font-semibold mb-2'>Gói dịch vụ đã sử dụng</Label>
                <div className='space-y-2'>
                  {usedPackage && usedPackage.length > 0 ? (
                    usedPackage.map((pkg) => (
                      <div key={pkg.id} className='flex items-start gap-3'>
                        <Avatar className='h-20 w-28 rounded-none'>
                          <AvatarImage src={pkg.package.image} alt={pkg.package.name} />
                        </Avatar>
                        <div className='ml-2 flex-1 space-y-2'>
                          <Label className='text-sm font-semibold'>{pkg.package.name}</Label>
                          <Label className='text-xs text-gray-500'>{pkg.package.features}</Label>
                          <Label className='text-xs'>
                            <span>{pkg.package.dayValue} ngày | dự kiến tới </span>
                            <span className='text-[#451DA0]'>
                              {dayjs(pkg.endDate).format('DD/MM/YYYY')}
                            </span>
                          </Label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-gray-500'>Bạn chưa sử dụng gói dịch vụ nào</p>
                  )}
                  </div>
              </div>
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
