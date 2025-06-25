"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Employer } from "@/types/companyType"
import { getEmployerBanner } from "@/apis/companyAPI"



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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView >= employers.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, employers.length - itemsPerView) : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

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

  return (
    <div className="w-full py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nhà Tuyển Dụng Hàng Đầu</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá cơ hội nghề nghiệp tại các công ty uy tín và phát triển sự nghiệp của bạn
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 -ml-4"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 -mr-4"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= employers.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel Content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(employers.length / itemsPerView) * 100}%`,
              }}
            >
{employers.map((employer) => (
  <div
    key={employer.id}
    className="px-2"
    style={{ width: `${100 / employers.length}%` }}
  >
    <Card className="h-full bg-white rounded-xl border shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center py-6 px-4 w-44">
      {/* Logo */}
      <div className="w-20 h-20 mb-4 overflow-hidden">
        <img
          src={employer.logo || "/placeholder.svg"}
          alt={employer.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Tên công ty */}
      <h3 className="text-sm font-medium text-gray-800 truncate">{employer.name}</h3>

      {/* Số vị trí đang tuyển (giả định có sẵn trường này) */}
      <p className="text-sm text-blue-600 mt-1 flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" stroke="none" />
          <path d="M3 3h18v18H3z" />
          <path d="M7 8h10M7 12h4m1 8v-4a2 2 0 012-2h6" />
        </svg>
        {employer.totalJobs || 0} vị trí đang tuyển
      </p>
    </Card>
  </div>
))}

            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(employers.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index * itemsPerView)}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Xem Tất Cả Nhà Tuyển Dụng
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
