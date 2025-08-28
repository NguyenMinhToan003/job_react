import { useEffect, useState } from 'react';
import {
  CheckCircle,
  ReceiptIcon,
  PackageIcon,
  CalendarIcon,
  CreditCardIcon,
  HomeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TransactionResponse } from '@/types/employerSubType';
import { checkoutPayment } from '@/apis/paymentAPI';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PAYMENT_STATUS } from '@/types/type';

export default function PaymentSuccess() {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const result = searchParams.get('result');
  

  const [orderDetails, setOrderDetails] = useState<TransactionResponse>();



  const fetchData = async () => {
    try {
      const response = await checkoutPayment(Number(transactionId));
      setOrderDetails(response);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchData();
    if (result !== PAYMENT_STATUS.SUCCESS || !transactionId) {
      sessionStorage.removeItem('cart');
    }
  }, []);

  // if (result !== PAYMENT_STATUS.SUCCESS || !transactionId) {
  //   navigate('/danh-cho-nha-tuyen-dung/dich-vu');
  //   return null;
  // }
  if (!orderDetails) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9fb] to-[#f2ecfd] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-[#6c43d3] to-[#451e99] rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#6c43d3] to-[#451e99] rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#451e99]">Thanh toán thành công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi</p>
          </div>
        </div>

        <Card className="p-6 bg-white shadow-lg border-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <ReceiptIcon className="w-5 h-5 text-[#6c43d3]" />
              <h2 className="text-xl font-semibold text-gray-800">Chi tiết đơn hàng</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Mã đơn hàng</p>
                <p className="font-semibold text-[#451e99]">{orderDetails.vnp_TxnRef}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                <p className="font-semibold">{new Date(orderDetails.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PackageIcon className="w-4 h-4 text-[#6c43d3]" />
                <span className="font-medium text-gray-700">Sản phẩm đã mua</span>
              </div>

              {orderDetails.package.map((pkg, index) => (
            <div key={index} className="bg-[#f9f9fb] rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-24 rounded-none">
                    <AvatarImage
                      src={pkg.image}
                      alt={pkg.name}
                      className="object-contain"
                    />
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Số lượng: {pkg.sub_total}</span>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{pkg.dayValue} ngày</span>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-[#451e99]">
                    <span className="underline align-text-bottom">đ</span>{' '}
                    {(Number(pkg.price) * pkg.sub_total).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          ))}

            </div>

            <div className="flex items-center justify-between py-3 border-t">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-4 h-4 text-[#6c43d3]" />
                <span className="text-gray-600">Phương thức thanh toán</span>
              </div>
              <span className="font-medium">{orderDetails.transactionType}</span>
            </div>

            <div className="flex items-center justify-between py-4 border-t-2 border-[#6c43d3]/20">
              <span className="text-lg font-semibold text-gray-800">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-[#451e99]">
                đ {Number(orderDetails.amount).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="bg-[#6c43d3] hover:bg-[#5c39ba] text-white font-semibold flex-1" size="lg"
            onClick={() => navigate(`/danh-cho-nha-tuyen-dung/dich-vu/${orderDetails.id}/receipt`)}>
            <ReceiptIcon className="w-4 h-4 mr-2" />
            Sử dụng dịch vụ
          </Button>

          <Button variant="outline" className="border-[#6c43d3] text-[#6c43d3] hover:bg-[#f2ecfd] font-semibold flex-1" size="lg"
            onClick={() => navigate(`/danh-cho-nha-tuyen-dung/dich-vu/${orderDetails.id}`)}>
            Xem đơn hàng
          </Button>

          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold flex-1" size="lg"
            onClick={() => navigate('/danh-cho-nha-tuyen-dung')}>
            <HomeIcon className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </div>

        <div className="text-center pt-6 border-t">
          <p className="text-sm text-gray-600">
            Cần hỗ trợ? Liên hệ với chúng tôi qua{' '}
            <a href="mailto:support@company.com" className="text-[#6c43d3] hover:underline font-medium">
              support@company.com
            </a>{' '}
            hoặc hotline{' '}
            <a href="tel:1900-1234" className="text-[#6c43d3] hover:underline font-medium">
              1900-1234
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}