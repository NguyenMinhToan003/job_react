'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { ScrollArea } from '@/components/ui/scroll-area'
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
} from '@/components/ui/alert-dialog'
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2, Package, CreditCard, X, Clock, AlertCircle } from 'lucide-react'
import { createPaymentUrl, getPackagesBisiness } from '@/apis/paymentAPI'
import { toast } from 'sonner'
import type { PackageResponse } from '@/types/packageType'
import { PackageType } from '@/types/type'
import { convertPrice } from '@/utils/convertPrice'


interface DialogCartProps {
  open: boolean
  onClose: () => void
}

export interface CartItem {
  packageId: string
  quantity: number
}

export default function DialogCart({ open, onClose }: DialogCartProps) {
  const [cartData, setCartData] = useState<CartItem[]>([])
  const [packages, setPackages] = useState<PackageResponse[]>([])
  const [processingPayment, setProcessingPayment] = useState(false)

  const handlePayment = async () => {
    if (cartData.length === 0) {
      toast.error('Giỏ hàng trống')
      return
    }

    try {
      setProcessingPayment(true)
      toast.loading('Đang tạo liên kết thanh toán...')

      const payment = await createPaymentUrl({
        subscriptions: cartData,
        transactionType: 'VNPAY',
      })

      toast.dismiss()
      toast.success('Chuyển hướng đến trang thanh toán...')
      setCartData([])
      sessionStorage.removeItem('cart')

      // Open payment URL
      window.open(payment.paymentUrl, '_blank')
      onClose()
    } catch (error: any) {
      toast.dismiss()
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán')
    } finally {
      setProcessingPayment(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const data = await getPackagesBisiness()
      setPackages(data)
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast.error('Không thể tải thông tin gói dịch vụ')
    }
  }

  useEffect(() => {
    if (open) {
      const stored = sessionStorage.getItem('cart')
      if (stored) {
        try {
          const parsedCart = JSON.parse(stored)
          setCartData(parsedCart)
        } catch (error) {
          console.error('Error parsing cart data:', error)
          sessionStorage.removeItem('cart')
          setCartData([])
        }
      }
    }
  }, [open])

  useEffect(() => {
    fetchPackages()
  }, [])

  const updateSession = (newCart: CartItem[]) => {
    setCartData(newCart)
    sessionStorage.setItem('cart', JSON.stringify(newCart))
  }

  const increment = (id: string) => {
    const indexCartItem = cartData.findIndex((item) => item.packageId === id)
    if (indexCartItem === -1) return

    const tempDataCard = [...cartData]
    tempDataCard[indexCartItem].quantity += 1
    updateSession(tempDataCard)
  }

  const decrement = (id: string) => {
    const indexCartItem = cartData.findIndex((item) => item.packageId === id)
    if (indexCartItem === -1) return

    const tempDataCard = [...cartData]
    if (tempDataCard[indexCartItem].quantity > 1) {
      tempDataCard[indexCartItem].quantity -= 1
      updateSession(tempDataCard)
    } else {
      // Remove item if quantity becomes 0
      removeItem(id)
    }
  }

  const removeItem = (id: string) => {
    const newCart = cartData.filter((item) => item.packageId !== id)
    updateSession(newCart)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const getPackageById = (id: string) => {
    return packages.find((pkg) => pkg.id === id)
  }

  const getPackageTypeName = (type: string) => {
    switch (type) {
      case PackageType.JOB:
        return 'Gói hiệu ứng'
      case PackageType.EMPLOYER:
        return 'Gói nhà tuyển dụng'
      case PackageType.BANNER:
        return 'Gói top banner'
      default:
        return type
    }
  }

  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartData.reduce((sum, item) => {
    const pkg = getPackageById(item.packageId)
    return sum + (pkg ? item.quantity * pkg.price : 0)
  }, 0)

  const validCartItems = cartData.filter((item) => getPackageById(item.packageId))

  return (
    <AlertDialog open={open} onOpenChange={onClose}>

      <AlertDialogContent className='flex flex-col gap-4 p-6'>
              <AlertDialogHeader className='w-3xl  flex flex-col'>

          <AlertDialogTitle className='flex items-center gap-2 text-xl'>
            <ShoppingCartIcon className='h-5 w-5' />
            Giỏ hàng của bạn
            {totalItems > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {totalItems} sản phẩm
              </Badge>
          )}
          </AlertDialogTitle>
      </AlertDialogHeader>

        {validCartItems.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <Package className='h-16 w-16 text-gray-400 mb-4' />
            <h3 className='text-lg font-semibold text-gray-600 mb-2'>Giỏ hàng trống</h3>
            <p className='text-gray-500 mb-4'>Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
            <Button onClick={onClose} variant='outline'>
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className='h-96 overflow-y-auto'>
              <div className='space-y-4 pr-4'>
                {validCartItems.map((item) => {
                  const packageData = getPackageById(item.packageId)
                  if (!packageData) return null

                  return (
                    <div key={item.packageId} className='flex gap-4 p-4 border rounded-lg hover:bg-gray-50'>
                      {/* Package Image */}
                      <div className='w-20 h-16 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0'>
                        <img
                          src={packageData.image || '/placeholder.svg'}
                          alt={packageData.name}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Package Info */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <h4 className='font-semibold text-gray-900 truncate'>{packageData.name}</h4>
                            <Badge variant='outline' className='mt-1'>
                              {getPackageTypeName(packageData.type)}
                            </Badge>
                            <div className='flex items-center gap-1 mt-1 text-sm text-gray-500'>
                              <Clock className='h-3 w-3' />
                              {packageData.dayValue} ngày
                            </div>
                          </div>

                          {/* Remove Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant='ghost' size='sm' className='text-red-500 hover:text-red-700'>
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa sản phẩm</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa '{packageData.name}' khỏi giỏ hàng?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeItem(item.packageId)}
                                  className='bg-red-500 hover:bg-red-600'
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        <div className='flex items-center justify-between mt-3'>
                          <div className='text-sm text-gray-600'>
                            {convertPrice(packageData.price, null)} x {item.quantity}
                          </div>

                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              className='h-8 w-8 p-0'
                              onClick={() => decrement(item.packageId)}
                            >
                              <MinusIcon className='h-3 w-3' />
                            </Button>
                            <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                            <Button
                              variant='outline'
                              size='sm'
                              className='h-8 w-8 p-0'
                              onClick={() => increment(item.packageId)}
                            >
                              <PlusIcon className='h-3 w-3' />
                            </Button>
                          </div>

                          <div className='text-right'>
                            <div className='font-bold text-purple-600'>
                              {convertPrice(packageData.price * item.quantity, null)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Tổng số lượng:</span>
                <span className='font-medium'>{totalItems} sản phẩm</span>
              </div>
              <div className='flex items-center justify-between text-lg font-bold'>
                <span>Tổng cộng:</span>
                <span className='text-purple-600'>{convertPrice(totalPrice,null)}</span>
              </div>

              {/* Warning for invalid items */}
              {cartData.length !== validCartItems.length && (
                <div className='flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <AlertCircle className='h-4 w-4 text-yellow-600' />
                  <span className='text-sm text-yellow-800'>
                    Một số sản phẩm trong giỏ hàng không còn khả dụng và đã được loại bỏ.
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <AlertDialogFooter className='flex-col sm:flex-row gap-2'>


          <div className='flex gap-2 w-full sm:w-auto'>
            <Button variant='outline' onClick={onClose} className='flex-1 sm:flex-none'>
              Đóng
            </Button>
            <Button
              className='rounded-sm  bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-none'
              onClick={handlePayment}
              disabled={validCartItems.length === 0 || processingPayment}
            >
              {processingPayment ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className='h-4 w-4 mr-2' />
                  Thanh toán ({convertPrice(totalPrice,null)})
                </>
              )}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
