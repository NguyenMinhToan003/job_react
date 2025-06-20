/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2 } from 'lucide-react';
import { createPaymentUrl, getPackagesBisiness,  } from '@/apis/paymentAPI';
import { toast } from 'sonner';
import { PackageResponse } from '@/types/packageType';

interface DialogCartProps {
  open: boolean;
  onClose: () => void;
}
export interface CartItem {
  packageId: string;
  quantity: number;
}

export default function DialogCart({ open, onClose }: DialogCartProps) {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [packages, setPackages] = useState<PackageResponse[]>([]);

  const handlePayment = async () => {
    try {

      const payment = await createPaymentUrl({
        subscriptions: cartData,
        transactionType: 'VNPAY',
      })
      toast.success('Đặt hàng thành công');
      window.open(payment.paymentUrl, '_blank');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('cart');
    console.log('Stored cart data:', stored);
    if (stored) { 
      setCartData(JSON.parse(stored));
    }
  }, [open]);

  useEffect(() => {
    getPackagesBisiness().then(setPackages);
  }, []);

  const updateSession = (newCart: CartItem[]) => {
    setCartData(newCart);
    sessionStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increment = (id: string) => {
    const indexCartItem = cartData.findIndex(item => item.packageId === id);
    const tempDataCard = [...cartData];
    tempDataCard[indexCartItem].quantity += 1;
    updateSession(tempDataCard);
  };

  const decrement = (id: string) => {
    console.log('id', id);
    const indexCartItem = cartData.findIndex(item => item.packageId === id);
    if (indexCartItem === -1) return;

    const tempDataCard = [...cartData];
    if (tempDataCard[indexCartItem].quantity > 1) {
      tempDataCard[indexCartItem].quantity -= 1;
    } else {
      tempDataCard.splice(indexCartItem, 1);
    }
    updateSession(tempDataCard);
  };

  const removeItem = (id: string) => {
    const newCart = cartData.filter(item => item.packageId !== id);
    updateSession(newCart);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };
  const getPackageById = (id: string) => {
    return packages.find(pkg => pkg.id === id);
  }

  const totalPrice = cartData.length > 0 ? cartData.map(i => {
    const index = packages.findIndex(e => e.id === i.packageId);
    if (index === -1) return 0;
    console.log(packages[index]);
    return i.quantity * packages[index].price;
  }).reduce((i,next)=> i + next, 0) : 0;

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

        {cartData.length === 0 ? (
          <p className='text-center text-sm text-[#060607]'>
            Chưa có sản phẩm nào.
          </p>
        ) : (
          <div className='space-y-4'>
              {cartData.map(pkg => {
                const packageData = getPackageById(pkg.packageId);
                return (
                  <div
                    key={pkg.packageId}
                    className='flex gap-4 items-center justify-between border-b pb-2'
                  >
                    <div className='w-20 h-16 rounded overflow-hidden border'>
                      <img
                        src={packageData?.image}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='flex-1'>
                      <p className='font-bold text-[#000209]'>
                        {packageData?.name}
                      </p>
                      <p className='text-sm text-[#060607]'>
                        {packageData?.price && (packageData.price * 1.0)?.toLocaleString('vi-VN')}đ x {pkg.quantity}
                      </p>
                      <div className='flex gap-2 mt-1 justify-start items-center'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7'
                          onClick={() => decrement(pkg.packageId)}
                        >
                          <MinusIcon className='w-4 h-4' />
                        </Button>
                        <span className='px-2 text-sm'>{pkg.quantity}</span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7'
                          onClick={() => increment(pkg.packageId)}
                        >
                          <PlusIcon className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='text-right flex flex-col items-end'>
                      <p className='text-[#451e99] font-bold'>
                        {packageData?.price && (packageData.price * pkg.quantity).toLocaleString('vi-VN')}đ
                      </p>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-500 mt-1'
                        onClick={() => removeItem(pkg.packageId)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                )
              })}

            <div className='text-right font-bold text-lg text-[#451e99] mt-4'>
                Tổng cộng: {totalPrice.toLocaleString('vi-VN')}{' '}đồng
            </div>

          </div>
        )}
        
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
      </DialogContent>
    </Dialog>
  );
}
