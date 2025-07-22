/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { toast } from "sonner"
import dayjs from "dayjs"

import { getPackageAvailable } from "@/apis/paymentAPI"
import { PackageResponse } from "@/types/packageType"
import { convertDateToString, convertRemainingTime } from "@/utils/dateTime"

import {
  Calendar,
  Clock,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployerSubResponse } from "@/types/employerSubType"



// Component hiển thị thông tin thời gian dịch vụ
const ServiceTimeDisplay = ({ subUsing, subPending }: { subUsing: EmployerSubResponse[], subPending: EmployerSubResponse[] }) => {

  const processTime = (startDate: string, endDate: string): number => {
    const now = dayjs().diff(dayjs(startDate), "day")
    const total = dayjs(endDate).diff(dayjs(startDate), "day")
    return Math.round((now / total) * 100)
  }

  return (
    <div className='space-y-3'>
        <div>
          <Label className='text-sm font-medium text-green-700 mb-2 block'>
            <Clock className='w-4 h-4 inline mr-1' />
            Dịch vụ đang hoạt động
          </Label>
        <div className='space-y-2'>
          {
            subPending.map((item, index) => (
              <div key={index} className='p-3 rounded-lg border border-yellow-200 bg-yellow-50'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium line-clamp-1'>
                      {item?.job?.name}
                    </span>
                  </div>
                </div>
                <div className='mt-2 text-xs text-yellow-700'>
                  Dịch vụ đang chờ kích hoạt
                </div>
              </div>
            ))
            }
            {subUsing.map((item, index) => {
              const daysRemaining = convertRemainingTime(item.endDate)
              const isExpiringSoon = daysRemaining <= 7

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-3 rounded-lg border transition-colors ${
                          isExpiringSoon
                            ? "border-orange-200 bg-orange-50"
                            : "border-green-200 bg-green-50"
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <Calendar className='w-4 h-4 text-muted-foreground' />
                            <span className='text-sm font-medium line-clamp-1'>
                              {item?.job?.name}
                            </span>
                          </div>
                        </div>

                        {daysRemaining > 0 && (
                          <div className='mt-2'>
                            <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                              <span>Thời gian còn lại</span>
                              <span>{daysRemaining} ngày</span>
                            </div>
                            <Progress value={processTime(item.startDate, item.endDate)} />
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className='text-sm space-y-1'>
                        <p>
                          <strong>Ngày bắt đầu:</strong>{" "}
                          {convertDateToString(item.startDate)}
                        </p>
                        <p>
                          <strong>Ngày kết thúc:</strong>{" "}
                          {convertDateToString(item.endDate)}
                        </p>
                        
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>

    </div>
  )
}

// Component chính hiển thị các dịch vụ
export default function ServiceMe() {
  const [packagesAvailable, setPackagesAvailable] = useState<PackageResponse[]>([])

  const fetchServices = async () => {
    try {
      const dataPackages = await getPackageAvailable({})
      setPackagesAvailable(dataPackages)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tải dịch vụ")
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full p-3'>
      {packagesAvailable.map((pkg) => {
        const usagePercentage = pkg.sub_total
          ? ((pkg.sub_used || 0) / pkg.sub_total) * 100
          : 0
        return (
          <Card
            key={pkg.id}
            className='group hover:shadow-lg transition-shadow duration-300 max-h-fit p-2'
          >
            <CardHeader className="p-2">
              <div className='space-y-3'>
                <div className='relative overflow-hidden bg-gray-50 rounded-lg'>
                  <img
                    src={pkg.image || "/placeholder.svg?height=128&width=300"}
                    alt={pkg.name}
                    className='w-full h-46 object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
                <CardTitle className='text-lg text-gray-900 font-semibold'>
                  {pkg.name}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className='space-y-4 p-2'>
              <div>
                <div className='flex justify-between text-sm mb-2'>
                  <span>Đã sử dụng</span>
                  <span>
                    {pkg.sub_used || 0}/{pkg.sub_total || 0}
                  </span>
                </div>
                <Progress value={usagePercentage} className='h-2' />
              </div>

              <ServiceTimeDisplay
                subUsing={pkg.sub_using || []}
                subPending={pkg.sub_pending || []}
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
