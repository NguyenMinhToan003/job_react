/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPackagesBisiness } from '@/apis/employer_sub';
import DialogCart from '@/components/elements/cart/DialogCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackageResponse } from '@/types/employerSubType';
import { MinusIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Price() {
  const [packages, setPackages] = useState<PackageResponse[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showDialog, setShowDialog] = useState(false);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackagesBisiness();
        setPackages(response);
        const initialQuantities = Object.fromEntries(response.map(pkg => [pkg.id, 1]));
        setQuantities(initialQuantities);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi không xác định');
      }
    };

    const cartSession = sessionStorage.getItem('cart');
    if (cartSession) {
      setCart(JSON.parse(cartSession));
    }

    fetchPackages();
  }, []);

  const updateQuantity = (id: number, type: 'inc' | 'dec') => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, prev[id] + (type === 'inc' ? 1 : -1)),
    }));
  };

  const addToCart = (id: number) => {
    const newCart = {
      ...cart,
      [id]: (cart[id] || 0) + (quantities[id] || 1),
    };
    setCart(newCart);
    sessionStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Đã thêm vào giỏ hàng');
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = packages.reduce((total, pkg) => {
    const quantity = cart[pkg.id] || 0;
    return total + pkg.price * quantity;
  }, 0);

  return (
    <div className="w-full space-y-4 pb-24">
      <DialogCart open={showDialog} onClose={() => setShowDialog(false)} />

      {packages.map(pkg => (
        <Card key={pkg.id} className="flex flex-col md:flex-row items-center p-4 bg-[#f9f9fb]">
          <div className="w-full md:w-[260px] h-[150px] relative rounded-md overflow-hidden">
            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 w-full mt-4 md:mt-0 md:ml-6 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{pkg.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{pkg.features}</p>

            <div className="flex flex-wrap md:flex-nowrap gap-6 items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label className="font-medium text-gray-600">Số lượng</Label>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(pkg.id, 'dec')}
                    className="border-r rounded-none w-10 h-10"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    readOnly
                    className="w-14 text-center rounded-none border-x-0"
                    value={quantities[pkg.id] || 1}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(pkg.id, 'inc')}
                    className="border-l rounded-none w-10 h-10"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="font-medium text-gray-600">Thời lượng</Label>
                <span className="font-semibold">{pkg.dayValue} ngày</span>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="font-medium text-gray-600">Giá bán</Label>
                <span className="text-[#451e99] text-lg font-bold">
                  <span className="underline align-text-bottom">đ</span>{' '}
                  {pkg.price.toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="mt-3 md:mt-0">
                <Button
                  className="bg-[#6c43d3] hover:bg-[#5c39ba] text-white"
                  onClick={() => addToCart(pkg.id)}
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
          <span className="text-sm text-gray-600">
            <strong className="text-gray-800">Tổng giá</strong>
          </span>
          <span className="text-xl font-bold text-[#451e99]">
            đ {totalPrice.toLocaleString('vi-VN')}
          </span>
        </div>

        <Button className="bg-[#451e99] hover:bg-[#391a7f] text-white font-semibold px-6">
          Đặt mua
        </Button>
      </div>
    </div>
  );
}
