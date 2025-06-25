import { createPackage } from "@/apis/paymentAPI";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PackageType } from "@/types/type";
import { ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FormCreatePackage()  {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: PackageType.JOB,
    price: '',
    dayValue: '',
    features: '',
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const onClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      type: PackageType.JOB,
      price: '',
      dayValue: '',
      features: '',
      image: null,
    });
    setPreviewUrl(null);
  };

  const removeSelectedFile = () => {
    setFormData({ ...formData, image: null });
    setPreviewUrl(null);
  };
  const handleCreatePackage = async () => {
    setSubmitting(true);
    try {
      await createPackage({
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price),
        dayValue: parseInt(formData.dayValue, 10),
        features: formData.features,
        image: formData?.image|| undefined,
      })
      window.location.reload();
      onClose();
      toast.success("Tạo gói dịch vụ thành công!");
    }
    catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo gói dịch vụ");
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>
      <Plus className='h-4 w-4 mr-2' />
      Thêm gói mới
    </Button>
  </DialogTrigger>

  <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
    <DialogHeader className="mb-4">
      <DialogTitle>Thêm gói dịch vụ mới</DialogTitle>
      <DialogDescription>
        Vui lòng điền đầy đủ thông tin về gói dịch vụ. Các trường có dấu * là bắt buộc.
      </DialogDescription>
    </DialogHeader>

    <div className='space-y-5'>
      {/* Tên gói */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Tên gói *</Label>
        <Input
          id='name'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder='Nhập tên gói dịch vụ'
        />
      </div>

      {/* Loại gói */}
      <div className='space-y-2'>
        <Label htmlFor='type'>Loại gói *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Chọn loại gói' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PackageType.JOB}>Gói Top Ngành</SelectItem>
            <SelectItem value={PackageType.EMPLOYER}>Gói Top Nhà tuyển dụng</SelectItem>
            <SelectItem value={PackageType.BANNER}>Gói quảng cáo banner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Giá & Thời hạn */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='price'>Giá (VNĐ) *</Label>
          <Input
            id='price'
            type='number'
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder='0'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='dayValue'>Thời hạn (ngày) *</Label>
          <Input
            id='dayValue'
            type='number'
            value={formData.dayValue}
            onChange={(e) => setFormData({ ...formData, dayValue: e.target.value })}
            placeholder='30'
          />
        </div>
      </div>

      {/* Upload ảnh */}
      <div className='space-y-2'>
        <Label>Hình ảnh gói</Label>
        <div className='mt-1'>
          {previewUrl ? (
            <div className='relative inline-block'>
              <img
                src={previewUrl}
                alt='Preview'
                className='w-32 h-32 object-cover rounded-lg border border-gray-300'
              />
              <Button
                type='button'
                variant='destructive'
                size='sm'
                className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                onClick={removeSelectedFile}
              >
                ✕
              </Button>
            </div>
          ) : (
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
              <ImageIcon className='mx-auto h-10 w-10 text-gray-400' />
              <div className='mt-2'>
                <Label htmlFor='image-upload' className='cursor-pointer text-blue-600 hover:underline text-sm'>
                  Chọn hình ảnh
                  <Input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='hidden'
                  />
                </Label>
              </div>
              <p className='text-xs text-gray-500 mt-1'>PNG, JPG, GIF tối đa 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Tính năng */}
      <div className='space-y-2'>
        <Label htmlFor='features'>Tính năng</Label>
        <Textarea
          id='features'
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder='Nhập các tính năng, mỗi dòng một tính năng'
          rows={4}
        />
      </div>
    </div>

    {/* Footer */}
    <DialogFooter className="mt-6">
      <Button variant='outline' onClick={onClose} disabled={submitting}>
        Hủy
      </Button>
          <Button disabled={submitting}
            onClick={() => { handleCreatePackage() }}
          >
        Thêm gói dịch vụ
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  )
}