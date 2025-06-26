"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Users, Globe, Briefcase, CupSoda } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Employer } from "@/types/companyType"
import { getEmployerBanner } from "@/apis/companyAPI"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import PaginationModel1 from "../pagination/PaginationModel1"



export default function BannerEmployer() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(3)

  const fetchEmployers = async () => {
    try {
      setIsLoading(true)
      const response = await getEmployerBanner()
      setEmployers(response)
    } catch (error) {
      console.error("Error fetching employers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployers()
  }, [])


  if (isLoading) {
    return (
      <div className="w-full py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <Carousel className="pb-40">
    <div>
      <div className="flex items-center justify-between w-7xl mx-auto px-4 py-4">
        <h2 className="text-xl font-semibold">Nhà tuyển dụng nổi bật</h2>
      </div>
    </div>
    <CarouselContent className="w-7xl mx-auto px-4 py-8">
      <CarouselItem className="grid grid-cols-3 gap-4">
      {
        employers.map((employer) => (
          <Card key={employer.id} className="flex flex-col rounded-[8px] bg-white border border-[#E7E7E8] hover:border-[#2C95FF] p-4 gap-1 shadow-none cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-101 relative">
            <CardContent className="flex  items-start text-center gap-3 p-0">
              <Avatar  className="w-16 h-16 rounded-sm">
                <AvatarImage src={employer.logo} alt={employer.name} />
              </Avatar>
              <div className="space-y-2">
                <Label className="text-start line-clamp-2 text-md">{employer.name}</Label>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Avatar className="w-4 h-4 mr-1 ">
                    <AvatarImage src={employer.country.flag} className="object-cover" />
                  </Avatar>
                  {employer.country.name}
                </span>
                <span className="text-xs text-[#8B5CF6] bg-[#F3E8FF] px-1 rounded-full flex items-center gap-1 w-fit">
                  {employer.jobsCount.active + employer.jobsCount.pending} công việc đang tuyển
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  {employer.employeeScale.name} | {employer.businessType.name }
                </span>
             </div>
            </CardContent>
          </Card>
        ))
      }
      </CarouselItem>
    </CarouselContent>
    <PaginationModel1
      page={1}
      totalPages={4}
      setPage={() => { }}
    />
  </Carousel>
}
