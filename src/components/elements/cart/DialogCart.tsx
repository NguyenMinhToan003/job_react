import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2 } from 'lucide-react';
import { PackageResponse } from '@/types/employerSubType';
import { getPackagesBisiness, paymentEmployerSub } from '@/apis/employer_sub';
import { toast } from 'sonner';

interface DialogCartProps {
  open: boolean;
  onClose: () => void;
}

export default function DialogCart({ open, onClose }: DialogCartProps) {
  const [cartData, setCartData] = useState<{ [key: number]: number }>({});
  const [packages, setPackages] = useState<PackageResponse[]>([]);

  const handlePayment = async () => {
    try {
      const subs = JSON.parse(sessionStorage.getItem('cart') || '{}');
      if (Object.keys(subs).length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }
      const paymentData = Object.entries(subs).map(([id, quantity]) => ({
        packageId: id,
        quantity,
      }));
      await paymentEmployerSub(paymentData);
      toast.success('Đặt hàng thành công');
    }
    catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('cart');
    if (stored) {
      setCartData(JSON.parse(stored));
    }
  }, [open]);

  useEffect(() => {
    getPackagesBisiness().then(setPackages);
  }, []);

  const updateSession = (newCart: { [key: number]: number }) => {
    setCartData(newCart);
    sessionStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increment = (id: number) => {
    const newCart = { ...cartData, [id]: (cartData[id] || 1) + 1 };
    updateSession(newCart);
  };

  const decrement = (id: number) => {
    const newQty = Math.max(1, cartData[id] - 1);
    const newCart = { ...cartData, [id]: newQty };
    updateSession(newCart);
  };

  const removeItem = (id: number) => {
    const { [id]: _, ...rest } = cartData;
    updateSession(rest);
    toast.success('Đã xoá sản phẩm khỏi giỏ');
  };

  const items = packages.filter(pkg => cartData[pkg.id]);

  const total = items.reduce(
    (sum, pkg) => sum + pkg.price * cartData[pkg.id],
    0
  );

  return (
    <Dialog open={open} >
      <DialogContent className='max-w-xl' >
        <DialogHeader>
          <DialogTitle>
            <Button
              variant='ghost'
              className='flex items-center gap-2 text-lg font-semibold'
          ><ShoppingCartIcon /> Giỏ hàng của bạn</Button></DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <p className='text-center text-sm text-gray-500'>
            Chưa có sản phẩm nào.
          </p>
        ) : (
          <div className='space-y-4'>
            {items.map(pkg => (
              <div
                key={pkg.id}
                className='flex gap-4 items-center justify-between border-b pb-2'
              >
                <div className='w-20 h-16 rounded overflow-hidden border'>
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='flex-1'>
                  <p className='font-medium'>{pkg.name}</p>
                  <p className='text-sm text-gray-500'>
                    {pkg.price}đ x {cartData[pkg.id]}
                  </p>
                  <div className='flex gap-2 mt-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7'
                      onClick={() => decrement(pkg.id)}
                    >
                      <MinusIcon className='w-4 h-4' />
                    </Button>
                    <span className='px-2'>{cartData[pkg.id]}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7'
                      onClick={() => increment(pkg.id)}
                    >
                      <PlusIcon className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                <div className='text-right flex flex-col items-end'>
                  <p className='text-[#451e99] font-bold'>
                    {(pkg.price * cartData[pkg.id])}đ
                  </p>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-red-500 mt-1'
                    onClick={() => removeItem(pkg.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))}

            <div className='text-right font-bold text-lg text-[#451e99] mt-4'>
              Tổng cộng: {total}đ
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button
                variant='outline'
                onClick={onClose}
                className='border-gray-400 text-gray-700'
              >
                Đóng
              </Button>
                <Button className='bg-[#451e99] hover:bg-[#391a7f] text-white'
                onClick={handlePayment}>
                Tiến hành đặt hàng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
