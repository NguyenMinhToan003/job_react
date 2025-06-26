/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPaymentUrl, getPackagesBisiness } from '@/apis/paymentAPI';
import DialogCart, { CartItem } from '@/components/elements/cart/DialogCart';
import TagPackage from '@/components/elements/packageCompo/TagPackage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackageResponse } from '@/types/packageType';
import { PackageType } from '@/types/type';
import { MinusIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
interface PackageAddQuatity extends PackageResponse {
  quantity: number;
}
export default function Price() {
  const [packages, setPackages] = useState<PackageAddQuatity[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [cartData, setCartData] = useState<CartItem[]>([]);

  const fetchPackages = async () => {
    try {
      const response = await getPackagesBisiness();
      let convertResponse = [] as PackageAddQuatity[];
      convertResponse = response.map(pkg => {
        return {
          ...pkg,
          quantity: 0,
        } as PackageAddQuatity;
      });
      setPackages(convertResponse);
      const storedCart = sessionStorage.getItem('cart');
      if (storedCart) {
        const storedCartData: CartItem[] = JSON.parse(storedCart);
        setCartData(storedCartData);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  };
  useEffect(() => {
    fetchPackages();
  }, []);



  const handleIncrement = (index: number) => () => {
    const updatedPackages = [...packages];
    updatedPackages[index].quantity = (updatedPackages[index].quantity || 0) + 1;
    setPackages(updatedPackages);
  };
  const handleDecrement = (index: number) => () => {
    const updatedPackages = [...packages];
    if (updatedPackages[index].quantity && updatedPackages[index].quantity > 0) {
      updatedPackages[index].quantity -= 1;
      setPackages(updatedPackages);
    }
  };
  const handleAddCart = (index: number) => () => {
    const selectedPackage = packages[index];
    if (selectedPackage.quantity && selectedPackage.quantity > 0) {
      const newCart: CartItem[] = [...cartData, {
        packageId: selectedPackage.id,
        quantity: selectedPackage.quantity,
      }];
      setCartData(newCart);
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      toast.success('Đã thêm vào giỏ hàng');
    } else {
      toast.error('Vui lòng chọn số lượng');
    }
  }
  const itemCart = cartData.filter(pkg => pkg.quantity > 0)
  const totalItems = itemCart.length;
  const totalPrice = cartData.length > 0 ? cartData.map(i => {
    const index = packages.findIndex(e => e.id === i.packageId);
    console.log(packages[index]);
    return i.quantity * packages[index]?.price;
  }).reduce((i, next) => i + next, 0) : 0;
  
  const handlePayment = async () => {
    toast.success('Quá trình thanh toán đang được xử lý, vui lòng đợi trong giây lát.');
    try {
      const payment = await createPaymentUrl({
        subscriptions: cartData,
        transactionType: 'VNPAY',
      })
      
      window.open(payment.paymentUrl, '_blank');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }
  return (
    <div className="w-full space-y-4 mt-4 mr-4">
      <DialogCart open={showDialog} onClose={() => {
        setShowDialog(false)
        fetchPackages();
      }} />
      {packages.map((pkg, index) => (
        <Card key={pkg.id} className="flex flex-col md:flex-row items-center p-0 bg-[#f9f9fb]">
          <div className="w-full md:w-[260px] h-[150px] relative rounded-sm overflow-hidden">
            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 w-full mt-4 md:mt-0 md:ml-6 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold flex gap-4"><span className="text-[#451e99]">{pkg.name}</span>
                <TagPackage type={pkg.type} />
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">{pkg.features}</p>

            <div className="flex flex-wrap md:flex-nowrap gap-6 items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label className="font-medium text-neutral-600">Số lượng</Label>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="border-r rounded-none w-10 h-10"
                    onClick={handleDecrement(index)}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    readOnly
                    className="w-14 text-center rounded-none border-x-0"
                    value={pkg.quantity}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="border-l rounded-none w-10 h-10"
                    onClick={handleIncrement(index)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="font-medium text-neutral-600">Thời lượng</Label>
                <span className="font-semibold">{pkg.dayValue} ngày</span>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="font-medium text-neutral-600">Giá bán</Label>
                <span className="text-[#451e99] text-lg font-bold">
                  <span className="underline align-text-bottom">đ</span>{' '}
                  {(pkg.price* 1.0).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="mt-3 mr-3">
                <Button
                  className="bg-[#6c43d3] hover:bg-[#5c39ba] text-white"
                  onClick={handleAddCart(index)}
                >
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Footer giỏ hàng */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md py-3 px-4 flex items-center justify-between z-50">
        <Button
          variant="outline"
          className="border-[#6c43d3] text-[#6c43d3] hover:bg-[#f2ecfd] font-semibold"
          onClick={() => setShowDialog(true)}
        >
          <ShoppingCartIcon className="w-4 h-4 mr-2" />
          {totalItems} sản phẩm
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-600">
            <strong className="text-gray-800">Tổng giá</strong>
          </span>
          <span className="text-xl font-bold text-[#451e99]">
            đ {totalPrice.toLocaleString('vi-VN')}
          </span>
        </div>

        <Button className="bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold w-50 rounded-none h-12 "
          onClick={handlePayment}
        >
          Đặt mua
        </Button>
      </div>
    </div>
  );
}
