/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { getAllCountries, createCountry, updateCountry, deleteCountry } from "@/apis/countryAPI"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CountryResponse } from "@/types/countryType"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Users, Eye, EyeOff, Upload, Globe, Search } from "lucide-react"

export default function CountryTable() {
  const [countries, setCountries] = useState<CountryResponse[]>([])
  const [filteredCountries, setFilteredCountries] = useState<CountryResponse[]>([])
  const [selectedCountry, setSelectedCountry] = useState<CountryResponse | null>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [flag, setFlag] = useState<File | null>(null)
  const [flagPreview, setFlagPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [isToggle, setIsToggle] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleLoadCountries = async () => {
    try {
      setPageLoading(true)
      const response = await getAllCountries()
      setCountries(response)
      setFilteredCountries(response)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải quốc gia")
    } finally {
      setPageLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (!selectedCountry && (!name || !flag)) {
        toast.warning("Vui lòng nhập đầy đủ thông tin")
        return
      }
      setLoading(true)

      if (selectedCountry) {
        await updateCountry(selectedCountry.id, name, flag, isToggle ? 0 : 1)
        toast.success("Cập nhật quốc gia thành công")
      } else {
        await createCountry(name, flag)
        toast.success("Thêm quốc gia thành công")
      }

      setOpen(false)
      setSelectedCountry(null)
      setName("")
      setFlag(null)
      setIsToggle(false)
      setFlagPreview(null)
      handleLoadCountries()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu quốc gia")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá quốc gia này?")) return
    try {
      setLoading(true)
      await deleteCountry(id)
      toast.success("Xoá quốc gia thành công")
      handleLoadCountries()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xoá quốc gia")
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (country: CountryResponse | null) => {
    if (country) {
      setSelectedCountry(country)
      setName(country.name)
      setFlagPreview(country.flag)
      setIsToggle(country.hideAt ? false : true)
    } else {
      setSelectedCountry(null)
      setName("")
      setFlag(null)
      setFlagPreview(null)
      setIsToggle(true)
    }
    setOpen(true)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = countries.filter((country) => country.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredCountries(filtered)
  }

  useEffect(() => {
    handleLoadCountries()
  }, [])

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2c95ff]/5 via-white to-[#451da1]/5">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            onClick={() => openDialog(null)}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm quốc gia
          </Button>
        </div>

        

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm quốc gia..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Danh sách quốc gia ({filteredCountries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-20 text-center">Cờ</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tên quốc gia</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Nhà tuyển dụng</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700 w-32">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <Globe className="h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              {searchTerm ? "Không tìm thấy quốc gia" : "Chưa có quốc gia nào"}
                            </p>
                            <p className="text-gray-600">
                              {searchTerm
                                ? "Thử tìm kiếm với từ khóa khác"
                                : "Bắt đầu bằng cách thêm quốc gia đầu tiên"}
                            </p>
                          </div>
                          {!searchTerm && (
                            <Button
                              onClick={() => openDialog(null)}
                              className="bg-gradient-to-r from-[#2c95ff] to-[#451da1] hover:from-[#2c95ff]/90 hover:to-[#451da1]/90 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm quốc gia
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCountries.map((country, index) => (
                      <TableRow key={country.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <img
                              src={country.flag || "/placeholder.svg"}
                              alt={country.name}
                              className="w-12 h-8 object-cover rounded border border-gray-200 shadow-sm"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{country.name}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{country?.employees?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {country.hideAt ? (
                            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Ẩn
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Eye className="h-3 w-3 mr-1" />
                              Hiển thị
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-[#451da1] text-[#451da1] hover:bg-[#451da1] hover:text-white"
                              disabled={loading}
                              onClick={() => openDialog(country)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
                              disabled={loading}
                              onClick={() => handleDelete(country?.id || -1)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog thêm/sửa */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#2c95ff] to-[#451da1] bg-clip-text text-transparent">
                {selectedCountry ? "Chỉnh sửa quốc gia" : "Thêm quốc gia mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Tên quốc gia
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên quốc gia"
                  className="border-gray-300 focus:border-[#2c95ff] focus:ring-[#2c95ff]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Cờ quốc gia</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2c95ff] transition-colors cursor-pointer"
                  onClick={() => document.getElementById("flag")?.click()}
                >
                  {flagPreview ? (
                    <div className="space-y-3">
                      <img
                        src={flagPreview || "/placeholder.svg"}
                        alt="Flag preview"
                        className="w-20 h-14 object-cover mx-auto rounded border-2 border-gray-200"
                      />
                      <div className="flex items-center justify-center gap-2 text-sm text-[#2c95ff]">
                        <Upload className="h-4 w-4" />
                        <span>Nhấn để thay đổi cờ</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#2c95ff]">Nhấn để chọn</span> hoặc kéo thả file
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                    </div>
                  )}
                </div>
                <Input
                  id="flag"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFlag(file)
                      setFlagPreview(URL.createObjectURL(file))
                    }
                  }}
                  accept="image/*"
                />
              </div>

              {selectedCountry && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="visibility" className="text-sm font-medium text-gray-700">
                      Hiển thị quốc gia
                    </Label>
                    <p className="text-xs text-gray-500">Cho phép hiển thị quốc gia này trên trang web</p>
                  </div>
                  <Switch id="visibility" checked={isToggle} disabled={loading} onCheckedChange={setIsToggle} />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#2c95ff] to-[#451da1] hover:from-[#2c95ff]/90 hover:to-[#451da1]/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : selectedCountry ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
