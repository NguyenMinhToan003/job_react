import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Gift, Plus } from "lucide-react"
import { iconMap } from "@/utils/SetListIcon"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Benefit } from "@/types/benefitType"
import { toast } from "sonner"
import { createBenefit, updateBenefit } from "@/apis/benefitAPI"

export default function BenefitForm({ benefit, setIsChange }: { benefit?: Benefit, setIsChange?: (isChange: boolean) => void }) {
  const [benefitId, setBenefitId] = useState(benefit?.id || "")
  const [selectedIcon, setSelectedIcon] = useState("gift")
  const [benefitName, setBenefitName] = useState("")
  const [benefitDescription, setBenefitDescription] = useState("")
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (benefit) {
      setSelectedIcon(benefit.icon)
      setBenefitName(benefit.name)
      setBenefitDescription(benefit.description || "")
      setBenefitId(benefit.id)
    }
  }, [benefit])
  
  const handleAddOrUpdateBenefit = async () => {
    try {
      if (!benefit) {
        await createBenefit({
          id: benefitId || '',
          name: benefitName,
          description: benefitDescription,
          icon: selectedIcon,
        })
      } else {
        await updateBenefit(benefit.id, {
          id: benefitId,
          name: benefitName,
          description: benefitDescription,
          icon: selectedIcon,
        })
      }
      setOpen(false)
      setBenefitName("")
      setBenefitDescription("")
      setSelectedIcon("gift")
      setIsChange?.(true)
      toast.success(benefit ? "Cập nhật quyền lợi thành công" : "Thêm quyền lợi thành công")
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau")
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}>
      <AlertDialogTrigger>

          {
            benefit ? <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-transparent"
          >
            <Edit className="h-3 w-3" />
            Sửa
            </Button>
              : <>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm quyền lợi
                </Button> 
              </>
          }

      </AlertDialogTrigger>

      <AlertDialogContent className="min-w-4xl ">
        <Card className="shadow-none border border-gray-200">
          <CardContent className="flex">
                          {/* Icon Selection Grid */}
                          <div className="space-y-3 flex-1">
                <Label>Chọn biểu tượng</Label>
                <div className="space-y-3">
                  {/* Selected Icon Display */}
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-primary/5">
                    <div className="text-2xl text-primary">{iconMap[selectedIcon] || <Gift />}</div>
                    <div>
                      <div className="font-medium">Biểu tượng đã chọn</div>
                      <div className="text-sm text-gray-600">{selectedIcon}</div>
                    </div>
                  </div>

                  {/* Icon Grid */}
                  <ScrollArea className="h-48 border rounded-lg p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {Object.keys(iconMap).map((iconKey) => (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setSelectedIcon(iconKey)}
                          className={cn(
                            "p-3 rounded-lg border-2 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center group relative",
                            selectedIcon === iconKey
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          title={iconKey}
                        >
                          <div
                            className={clsx(
                              "text-lg transition-all duration-200",
                              selectedIcon === iconKey
                                ? "text-primary scale-110"
                                : "text-gray-600 group-hover:text-primary",
                            )}
                          >
                            {iconMap[iconKey]}
                          </div>
                          {/* Selected indicator */}
                          {selectedIcon === iconKey && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            <div  className="flex-1 space-y-4 p-4">


              <div className="space-y-2">
                <Label htmlFor="id">
                  Mã quyền lợi
                </Label>
                <Input
                  id="id"
                  value={benefitId}
                  onChange={(e) => setBenefitId(e.target.value)}
                  placeholder="Mã quyền lợi (tự động tạo nếu để trống)"
                  disabled={!!benefit}
                  className="bg-gray-50"
                />
              </div>
              {/* Benefit Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên quyền lợi</Label>
                <Input
                  id="name"
                  value={benefitName}
                  onChange={(e) => setBenefitName(e.target.value)}
                  placeholder="Nhập tên quyền lợi..."
                  required
                />
              </div>
              {/* Benefit Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả quyền lợi</Label>
                <Input
                  id="description"
                  value={benefitDescription}
                  onChange={(e) => setBenefitDescription(e.target.value)}
                  placeholder="Nhập mô tả quyền lợi..."
                  required
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Xem trước</Label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="text-primary text-xl">{iconMap[selectedIcon] || <Gift />}</div>
                    <div>
                        <Label className="font-semibold">{benefitName || "Tên quyền lợi"}</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {benefitDescription || "Mô tả quyền lợi sẽ hiển thị ở đây."}
                        </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 bg-transparent"
                  onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button className="flex-1"
                  onClick={handleAddOrUpdateBenefit}
                  disabled={!benefitName || !benefitDescription || !selectedIcon}
                >
                  {
                    benefit ? "Cập nhật quyền lợi" : "Thêm quyền lợi"
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  )
}
