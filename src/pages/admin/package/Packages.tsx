"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createPackage, getPackageAdmin, updatePackage, deletePackage } from "@/apis/paymentAPI"
import type { PackageResponse, CreatePackage } from "@/types/packageType"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  X,
  ImageIcon,
  Briefcase,
  Building2,
  Image,
} from "lucide-react"
import { toast } from "sonner"
import { PackageType } from "@/types/type"


export default function PackagesAdmin() {
  const [packages, setPackages] = useState<PackageResponse[]>([])
  const [filteredPackages, setFilteredPackages] = useState<PackageResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageResponse | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    features: "",
    price: "",
    dayValue: "",
    type: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchPackages()
  }, [])

  useEffect(() => {
    filterPackages()
  }, [packages, search, typeFilter])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const data = await getPackageAdmin()
      setPackages(data)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách gói:", error)
      toast.error("Có lỗi xảy ra khi tải danh sách gói dịch vụ")
    } finally {
      setLoading(false)
    }
  }

  const filterPackages = () => {
    let filtered = packages

    if (search) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(search.toLowerCase()) ||
          pkg.type.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((pkg) => pkg.type.toLowerCase() === typeFilter.toLowerCase())
    }

    setFilteredPackages(filtered)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      features: "",
      price: "",
      dayValue: "",
      type: "",
    })
    setSelectedFile(null)
    setPreviewUrl("")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB")
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (pkg: PackageResponse) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      features: pkg.features,
      price: pkg.price.toString(),
      dayValue: pkg.dayValue.toString(),
      type: pkg.type,
    })
    setPreviewUrl(pkg.image || "")
    setIsEditDialogOpen(true)
  }

  const handleSubmit = async (isEdit: boolean) => {
    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.dayValue || !formData.type) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
        return
      }

      setSubmitting(true)

      const packageData: CreatePackage = {
        name: formData.name,
        features: formData.features,
        price: Number.parseFloat(formData.price),
        dayValue: Number.parseInt(formData.dayValue),
        type: formData.type,
        image: selectedFile || undefined,
      }

      if (isEdit && editingPackage) {
        await updatePackage(editingPackage.id, packageData)
        toast.success("Cập nhật gói dịch vụ thành công")
        setIsEditDialogOpen(false)
      } else {
        await createPackage(packageData)
        toast.success("Thêm gói dịch vụ thành công")
        setIsAddDialogOpen(false)
      }

      resetForm()
      fetchPackages()
    } catch (error: any) {
      console.error("Error submitting package:", error)
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi lưu gói dịch vụ")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePackage(id)
      toast.success("Xóa gói dịch vụ thành công")
      fetchPackages()
    } catch (error: any) {
      console.error("Error deleting package:", error)
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa gói dịch vụ")
    }
  }

  // Statistics
  const totalPackages = packages.length
  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.price * (pkg.employerSubscriptions?.length || 0), 0)
  const totalSubscriptions = packages.reduce((sum, pkg) => sum + (pkg.employerSubscriptions?.length || 0), 0)
  const packageTypes = [...new Set(packages.map((pkg) => pkg.type))].length

  const getPackageTypeName = (type: string) => {
    switch (type) {
      case PackageType.JOB:
        return "Gói đăng tin"
      case PackageType.EMPLOYER:
        return "Gói nhà tuyển dụng"
      case PackageType.BANNER:
        return "Gói quảng cáo"
      default:
        return type
    }
  }

  const getPackageIcon = (type: string) => {
    switch (type) {
      case PackageType.JOB:
        return <Briefcase className="h-6 w-6 text-blue-500" />
      case PackageType.EMPLOYER:
        return <Building2 className="h-6 w-6 text-green-500" />
      case PackageType.BANNER:
        return <Image className="h-6 w-6 text-purple-500" />
      default:
        return <Package className="h-6 w-6 text-gray-500" />
    }
  }

  const getPackageColor = (type: string) => {
    switch (type) {
      case PackageType.JOB:
        return "border-blue-200 bg-blue-50"
      case PackageType.EMPLOYER:
        return "border-green-200 bg-green-50"
      case PackageType.BANNER:
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const PackageFormDialog = ({
    isOpen,
    onClose,
    isEdit,
  }: { isOpen: boolean; onClose: () => void; isEdit: boolean }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Cập nhật thông tin gói dịch vụ" : "Điền thông tin để tạo gói dịch vụ mới"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tên gói *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên gói dịch vụ"
            />
          </div>

          <div>
            <Label htmlFor="type">Loại gói *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại gói" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PackageType.JOB}>Gói đăng tin tuyển dụng</SelectItem>
                <SelectItem value={PackageType.EMPLOYER}>Gói nhà tuyển dụng</SelectItem>
                <SelectItem value={PackageType.BANNER}>Gói quảng cáo banner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="dayValue">Thời hạn (ngày) *</Label>
              <Input
                id="dayValue"
                type="number"
                value={formData.dayValue}
                onChange={(e) => setFormData({ ...formData, dayValue: e.target.value })}
                placeholder="30"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Hình ảnh gói</Label>
            <div className="mt-2">
              {previewUrl ? (
                <div className="relative inline-block">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeSelectedFile}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-500">Chọn hình ảnh</span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tối đa 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="features">Tính năng</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Nhập các tính năng, mỗi tính năng một dòng hoặc cách nhau bằng dấu phẩy"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button onClick={() => handleSubmit(isEdit)} disabled={submitting}>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? "Đang cập nhật..." : "Đang thêm..."}
              </>
            ) : isEdit ? (
              "Cập nhật"
            ) : (
              "Thêm mới"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng gói dịch vụ</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">{packageTypes} loại gói khác nhau</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Doanh nghiệp đang sử dụng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Từ tất cả gói dịch vụ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình/gói</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPackages > 0 ? Math.round(totalSubscriptions / totalPackages) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Đăng ký trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý gói dịch vụ</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm gói mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên gói, loại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value={PackageType.JOB}>Gói đăng tin</SelectItem>
                <SelectItem value={PackageType.EMPLOYER}>Gói nhà tuyển dụng</SelectItem>
                <SelectItem value={PackageType.BANNER}>Gói quảng cáo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gói dịch vụ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Đăng ký</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Không có gói dịch vụ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={pkg.image || "/placeholder.svg"} alt={pkg.name} />
                            <AvatarFallback>
                              <Package className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{pkg.name}</div>
                            <div className="text-sm text-gray-500">ID: {pkg.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getPackageTypeName(pkg.type)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(pkg.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {pkg.dayValue} ngày
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          {pkg.employerSubscriptions?.length || 0}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(pkg.price * (pkg.employerSubscriptions?.length || 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa gói dịch vụ "{pkg.name}"? Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(pkg.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Dialogs */}
      <PackageFormDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} isEdit={false} />
      <PackageFormDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} isEdit={true} />
    </div>
  )
}
