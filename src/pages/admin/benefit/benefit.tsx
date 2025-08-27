/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { deleteBenefit, getBenefit } from "@/apis/benefitAPI"
import type { Benefit } from "@/types/benefitType"
import { iconMap } from "@/utils/SetListIcon"
import { Gift, Search, ArrowUpDown, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeader } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaginationModel1 from "@/components/elements/pagination/paginationModel1"
import BenefitForm from "@/components/elements/benefit/formAddBenefit"
import { toast } from "sonner"

export default function BenefitPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [isChange, setIsChange] = useState(false)

  const fetchBenefits = async () => {
    try {
      const data = await getBenefit()
      setBenefits(data)
    } catch (error) {
      console.error("Error fetching benefit list:", error)
    }
  }

  useEffect(() => {
    fetchBenefits()
  }, [])
  useEffect(() => {
    if (isChange) {
      fetchBenefits()
      setIsChange(false)
    }
  }, [isChange])

  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching for:", searchTerm)
  }


  const handleDelete = async (benefitId: string) => {
    try{
      await deleteBenefit(benefitId)
      toast.success("Xóa quyền lợi thành công")
      setIsChange(true)
    }
    catch(error: any){
      toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau")
    }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý quyền lợi</h1>
          <BenefitForm
            setIsChange={setIsChange}
          />
        </div>

        <Card>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên quyền lợi, mô tả..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch}>Tìm kiếm</Button>
              <Select defaultValue="10">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / trang</SelectItem>
                  <SelectItem value="10">10 / trang</SelectItem>
                  <SelectItem value="20">20 / trang</SelectItem>
                  <SelectItem value="50">50 / trang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        Icon
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        Tên quyền lợi
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        Mô tả
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        Không có quyền lợi nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    benefits.map((benefit) => (
                      <TableRow key={benefit.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex justify-center">
                            <div className="text-primary text-2xl p-2 bg-primary/10 rounded-lg">
                              {iconMap[benefit.icon] ?? <Gift />}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">{benefit.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 max-w-md">{benefit.description}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
  
                            <BenefitForm
                              benefit={benefit}
                              setIsChange={setIsChange}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                              onClick={() => handleDelete(benefit.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <PaginationModel1 page={page} setPage={setPage} totalPages={10} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
