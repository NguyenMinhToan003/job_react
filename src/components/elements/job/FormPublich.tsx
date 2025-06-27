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
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
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
import { EmployerSubResponse } from '@/types/employerSubType'
import JobItem from './job-list/JobItem'

export default function FormPublish({ job }: { job: JobDetailResponse }) {
  const [isOpen, setIsOpen] = useState(false)
  const { setLoading } = useLoading()
  const [usedPackage, setUsedPackage] = useState<EmployerSubResponse[]>()
  const [selectedBannerPackage, setSelectedBannerPackage] = useState<PackageResponse>()
  const [selectedJobPackage, setSelectedJobPackage] = useState<PackageResponse>()
  const [packagesJobAvailable, setPackagesJobAvailable] = useState<PackageResponse[]>([])
  const [packagesBannerAvailable, setPackagesBannerAvailable] = useState<PackageResponse[]>([])
  const [jobCustomer, setJobCustomer] = useState<JobDetailResponse>(job)

  const fetchPackages = async () => {
    try {
      const [banner, jobPack] = await Promise.all([
        getPackageAvailable({ type: [PackageType.BANNER], mini: true }),
        getPackageAvailable({ type: [PackageType.JOB], mini: true }),
      ])
      setPackagesBannerAvailable(banner)
      setPackagesJobAvailable(jobPack)
      setUsedPackage(jobCustomer.employerSubscription || [])

      jobCustomer.employerSubscription?.forEach((item) => {
        const diffEndDate = dayjs(item.endDate).diff(dayjs(), 'day')
        if (item.package.type === PackageType.JOB && diffEndDate > 0) {
          setJobCustomer((prev) => ({ ...prev, isActiveSubscription: true }))
        }
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải gói tin đăng')
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handlePublish = async () => {
    try {
      setLoading(true)

      if (selectedBannerPackage) {
        await jobUseSubscription({ jobId: jobCustomer.id, packageId: selectedBannerPackage.id })
      }

      if (selectedJobPackage) {
        await jobUseSubscription({ jobId: jobCustomer.id, packageId: selectedJobPackage.id })
      }

      if (!selectedBannerPackage && !selectedJobPackage) {
        await publishJob(jobCustomer.id)
      }

      toast.success('Tin đăng đã được xuất bản thành công')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xuất bản tin đăng')
    } finally {
      setLoading(false)
    }
  }

  const renderButtonAction = () => {
    if (!jobCustomer.isActive) return null
    if (jobCustomer.isActive === JOB_STATUS.CREATE) {
      return (
        <Button className='text-[#451DA0] hover:text-[#451DA0] border border-[#451DA0] bg-white hover:bg-white rounded-sm w-24' onClick={() => setIsOpen(true)}>
          Xuất bản
        </Button>
      )
    }
    if (jobCustomer.isActive === JOB_STATUS.ACTIVE) {
      return (
        <Button className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24' onClick={() => setIsOpen(true)}>
          Nâng cấp
        </Button>
      )
    }
    if (jobCustomer.isActive === JOB_STATUS.PENDING) {
      return (
        <Button className='text-[#451DA0] hover:text-[#451DA0] bg-[#FFF7ED] hover:bg-[#FFF7ED] rounded-none w-24'>
          Đang duyệt
        </Button>
      )
    }
  }

  const handleSelectBannerPackage = (pkg: PackageResponse) => {
    const check = usedPackage?.find((item) => {
      const diffEndDate = dayjs(item.endDate).diff(dayjs(), 'day')
      return item.package.type === PackageType.BANNER && diffEndDate > 0
    })
    if (check) {
      toast.error(`Bạn đã sử dụng gói ${check.package.name} và còn ${dayjs(check.endDate).diff(dayjs(), 'day')} ngày sử dụng`)
      return
    }
    setSelectedBannerPackage((prev) => (prev?.id === pkg.id ? undefined : pkg))
  }

  const handleSelectJobPackage = (pkg: PackageResponse) => {
    const check = usedPackage?.find((item) => {
      const diffEndDate = dayjs(item.endDate).diff(dayjs(), 'day')
      return item.package.type === PackageType.JOB && diffEndDate > 0
    })
    if (check) {
      toast.error(`Bạn đã sử dụng gói ${check.package.name} và còn ${dayjs(check.endDate).diff(dayjs(), 'day')} ngày sử dụng`)
      return
    }
    setSelectedJobPackage((prev) => (prev?.id === pkg.id ? undefined : pkg))
    setJobCustomer((prev) => ({ ...prev, isActiveSubscription: !jobCustomer.isActiveSubscription }))
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{renderButtonAction()}</AlertDialogTrigger>

      <AlertDialogContent className='min-w-7xl max-w-7xl min-h-200 max-h-200 overflow-hidden'>
        <div className='flex h-full'>
          <div className='flex-1 overflow-y-auto'>
            <AlertDialogHeader className='mb-6'>
              <div className='flex items-center justify-between'>
                <AlertDialogTitle className='text-xl font-semibold text-neutral-700'>
                  Xuất bản tin đăng - <span className='text-gray-600'>{jobCustomer.name}</span>
                </AlertDialogTitle>
              </div>
            </AlertDialogHeader>

            <AlertDialogDescription className='space-y-3 h-140 overflow-y-auto p-4'>
              <Accordion type='multiple' defaultValue={['package']} className='space-y-4 w-full'>
                <AccordionItem value='package' className='border border-neutral-200 rounded-md'>
                  <AccordionTrigger className='text-sm font-bold px-4 pt-4'>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='w-4 h-4 text-[#451DA0]' /> Tin đăng
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-0'>
                    {packagesBannerAvailable.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
                        {packagesBannerAvailable.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${selectedBannerPackage?.id === pkg.id ? 'bg-gray-100 border-[#451DA0]' : 'border-gray-200'}`}
                            onClick={() => handleSelectBannerPackage(pkg)}
                          >
                            <div className='flex items-center gap-3 mb-2'>
                              <Avatar className='h-10 w-10 rounded-none'>
                                <AvatarImage src={pkg.image} alt={pkg.name} />
                              </Avatar>
                              <div className='flex-1'>
                                <Label className='text-sm font-semibold'>
                                  {pkg.name} <span className='text-xs text-gray-500'>X {pkg.sub_total - pkg.sub_used}</span>
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
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500'>Không có gói dịch vụ nào khả dụng</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='effects' className='border border-neutral-200 rounded-md'>
                  <AccordionTrigger className='text-sm font-bold px-4 py-2'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4 text-[#451DA0]' /> Hiệu ứng nổi bật
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='px-4 pb-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                      {packagesJobAvailable.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${selectedJobPackage?.id === pkg.id ? 'bg-gray-100 border-[#451DA0]' : 'border-gray-200'}`}
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
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AlertDialogDescription>
          </div>

          <div className='flex-1 bg-gray-50 p-6 border-l'>
            <div className='h-160 overflow-y-auto space-y-2 px-2'>
              <h3 className='font-semibold text-lg mb-4'>Xem trước</h3>
              <div className='sticky top-0 z-[999]'>
                <JobItem job={jobCustomer} />
              </div>


              {[selectedBannerPackage, selectedJobPackage].map(
                (pkg, i) =>
                  pkg && (
                    <div key={pkg.id} className='mb-6 flex items-start gap-3'>
                      <Avatar className='h-20 w-28 rounded-none'>
                        <AvatarImage src={pkg.image} alt={pkg.name} />
                      </Avatar>
                      <div className='ml-2 flex-1 space-y-2'>
                        <Label className='text-sm font-semibold'>{pkg.name}</Label>
                        <Label className='text-xs text-gray-500'>{pkg.features}</Label>
                        <Label className='text-xs'>
                          <span>{pkg.dayValue} ngày | dự kiến tới </span>
                          <span className='text-[#451DA0]'>
                            {dayjs().add(pkg.dayValue, 'day').format('DD/MM/YYYY')}
                          </span>
                        </Label>
                      </div>
                    </div>
                  )
              )}
              

              <Separator className='my-4' />

              <div className='space-y-4'>
                <Label className='font-semibold mb-2'>Gói dịch vụ đã sử dụng</Label>
                <div className='space-y-2 '>
                  {usedPackage && usedPackage.length > 0 ? (
                    usedPackage.map((pkg) => (
                      <div key={pkg.id} className='flex items-start gap-3 opacity-70 border border-dotted border-gray-300'>
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
          <Button variant='outline' className='mr-2 rounded-none h-12' onClick={() => setIsOpen(false)}>
            Hủy bỏ
          </Button>
          <Button className='bg-[#451DA0] hover:bg-[#3a1580] text-white rounded-none w-40 h-12' onClick={handlePublish}>
            Xuất bản
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}