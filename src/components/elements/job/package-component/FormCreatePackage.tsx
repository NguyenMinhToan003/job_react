import type React from "react"

import { createPackage, updatePackage, updatePackageAPI } from "@/apis/paymentAPI"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PackageType } from "@/types/type"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Editer from "../../editer/editer"
import { Plus, X, Upload } from "lucide-react"
import { PackageResponse } from "@/types/packageType"

interface FormCreatePackageProps {
  package?: PackageResponse,
  setIsChange: (isChange: boolean) => void
}

export default function FormCreatePackage({ package: initialPackage, setIsChange }: FormCreatePackageProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<PackageType>(PackageType.JOB)
  const [price, setPrice] = useState("")
  const [dayValue, setDayValue] = useState("")
  const [features, setFeatures] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialPackage && open) {
      setName(initialPackage.name || "")
      setType(initialPackage.type || PackageType.JOB)
      setPrice(initialPackage.price?.toString() || "")
      setDayValue(initialPackage.dayValue?.toString() || "")
      setFeatures(initialPackage.features || "")
      if (initialPackage.image) {
        setPreviewUrl(initialPackage.image)
      }
    }
  }, [initialPackage, open])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onClose = () => {
    setOpen(false)
    setName("")
    setType(PackageType.JOB)
    setPrice("")
    setDayValue("")
    setFeatures("")
    setImage(null)
    setPreviewUrl(null)
  }

  const removeSelectedFile = () => {
    setImage(null)
    setPreviewUrl(null)
  }

  const handleCreatePackage = async () => {
    // Simple validation
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên gói")
      return
    }
    if (!price || Number.parseFloat(price) <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ")
      return
    }
    if (!dayValue || Number.parseInt(dayValue) <= 0) {
      toast.error("Vui lòng nhập thời hạn hợp lệ")
      return
    }

    setSubmitting(true)
    try {
      if (initialPackage) {
        await updatePackageAPI(initialPackage.id, {
          name,
          features,
          price: Number.parseFloat(price),
          image: image || undefined,
          dayValue: Number.parseInt(dayValue),
          type,
        })
      }
      else {
        await createPackage({
          name,
          features,
          price: Number.parseFloat(price),
          image: image || undefined,
          dayValue: Number.parseInt(dayValue),
          type,
        })
      }
      setIsChange(true)
      onClose()
      toast.success(initialPackage ? "Cập nhật gói dịch vụ thành công!" : "Tạo gói dịch vụ thành công!")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo gói dịch vụ")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {
          initialPackage ? (
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Chỉnh sửa 
            </Button>
          ) : (
            <Button  size="sm" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm gói dịch vụ mới
            </Button>
          )
       }
      </AlertDialogTrigger>

      <AlertDialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{initialPackage ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên gói *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên gói dịch vụ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại gói *</Label>
              <Select value={type} onValueChange={(value) => setType(value as PackageType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại gói" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PackageType.JOB}>Gói Top Ngành</SelectItem>
                  <SelectItem value={PackageType.EMPLOYER}>Gói Top Nhà tuyển dụng</SelectItem>
                  <SelectItem value={PackageType.BANNER}>Gói quảng cáo banner</SelectItem>
                  <SelectItem value={PackageType.REFRESH}>Gói làm mới tin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá (VNĐ) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dayValue">Thời hạn (ngày) *</Label>
                <Input
                  id="dayValue"
                  type="number"
                  value={dayValue}
                  onChange={(e) => setDayValue(e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hình ảnh gói</Label>
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
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <Label htmlFor="image-upload" className="cursor-pointer text-blue-600 hover:underline">
                    Chọn hình ảnh
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <Label htmlFor="features">Tính năng</Label>
            <div className="h-80 border rounded-md">
              <Editer text={features} setText={setFeatures} />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button disabled={submitting} onClick={handleCreatePackage}>
            {submitting
              ? initialPackage
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : initialPackage
                ? "Cập nhật gói dịch vụ"
                : "Thêm gói dịch vụ"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
