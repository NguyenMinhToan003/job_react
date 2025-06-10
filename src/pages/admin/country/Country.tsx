/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  toggleHiden,
} from '@/apis/countryAPI';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CountryResponse } from '@/types/countryType';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export default function Country() {
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [flag, setFlag] = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const handleLoadCountries = async () => {
    try {
      const response = await getAllCountries();
      setCountries(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải quốc gia');
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedCountry && (!name || !flag)) {
        toast.warning('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      setLoading(true);

      if (selectedCountry) {
        await updateCountry(selectedCountry.id, name, flag, isToggle ? 0: 1);
        toast.success('Cập nhật quốc gia thành công');
      } else {
        await createCountry(name, flag);
        toast.success('Thêm quốc gia thành công');
      }

      setOpen(false);
      setSelectedCountry(null);
      setName('');
      setFlag(null);
      setIsToggle(false);
      handleLoadCountries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu quốc gia');
    }
    finally {
      setLoading(false);
      setFlagPreview(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá quốc gia này?')) return;
    try {
      setLoading(true);
      await deleteCountry(id);
      toast.success('Xoá quốc gia thành công');
      handleLoadCountries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xoá quốc gia');
    }
    finally {
      setLoading(false);
    }
  };

  const openDialog = (country: CountryResponse | null) => {
    if (country) {
      setSelectedCountry(country);
      setName(country.name);
      setFlagPreview(country.flag);
      setIsToggle(country.hideAt ? false : true);
    } else {
      setSelectedCountry(null);
      setName('');
      setFlag(null);
      setFlagPreview(null);
    }
    setOpen(true);
  };

  useEffect(() => {
    handleLoadCountries();
  }, []);

  return (
    <div className='p-4'>
      <Button
        variant='outline'
        className='mb-4'
        disabled={loading}
        onClick={() => openDialog(null)}
      >
        + Thêm quốc gia
      </Button>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {countries.map((country) => (
          <Card key={country.id}>
            <CardContent className='grid grid-cols-2 p-4'>
              <div className='flex flex-col items-center justify-center '>
                <img
                  src={country.flag}
                  alt={country.name}
                  className='w-20 h-16 object-cover  mb-2 border-2 border-gray-400'
                />
                <span className='text-sm font-bold'>{country.name}</span>
              </div>
              <div >
                <ul className='text-sm text-muted-foreground'>
                  <li>
                    <strong>Nhà tuyển dụng: </strong>
                    {country?.employees?.length || 0}
                  </li>
                </ul>
                <div className='flex gap-2 mt-3 flex-col'>
                  <Button
                    variant='outline'
                    className='flex-1'
                    disabled={loading}
                    onClick={() => openDialog(country)}
                  >
                    Sửa
                  </Button>
                  <Button
                    disabled={loading}
                    variant='destructive'
                    className='flex-1'
                    onClick={() => handleDelete(country?.id || -1)}
                  >
                    Xoá
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog thêm/sửa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCountry ? 'Chỉnh sửa quốc gia' : 'Thêm quốc gia'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='name'>Tên quốc gia</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                placeholder='Nhập tên quốc gia'
              />
            </div>
            <div>
              <Label htmlFor='flag'>
                {
                  flagPreview ? (
                    <div className='flex items-center gap-2'>
                      <img
                        src={flagPreview}
                        alt='Flag preview'
                        className='w-16 h-14 object-cover  border-2 border-gray-200'
                      />
                      <span>Thay đổi cờ</span>
                    </div>
                  ) : (
                    'Chọn cờ quốc gia'
                  )
                }
              </Label>
              <Input
                hidden
                id='flag'
                type='file'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFlag(file);
                    setFlagPreview(URL.createObjectURL(e.target.files?.[0] || new Blob()));
                  }
                }}
                accept='image/*'
              />
            </div>
            {
              selectedCountry &&
              <div className='flex items-center gap-2'>
                <Switch
                  id='visibility'
                  checked={isToggle}
                  disabled={loading}
                  onCheckedChange={() => setIsToggle(!isToggle)}
                />
                <Label htmlFor='visibility'>Hiển thị quốc gia</Label>
              </div>

            }
            <Button onClick={handleSave} className='w-full' disabled={loading}>
              {loading ? 'Đang lưu...' : ''}
              {selectedCountry ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
