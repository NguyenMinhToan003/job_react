import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OverViewCompany() {
  return (
    <div className="flex flex-col bg-[#f7f7f7] flex-1">
      <div className=" mx-auto px-6 py-8 w-full">
        <Tabs defaultValue="gioi-thieu" className="mb-8">
          <TabsList className="border-b w-full justify-start rounded-sm h-auto p-0 mb-6 bg-white shadow-xl border-b-gray-300">
            <TabsTrigger
              value="gioi-thieu"
              className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none"
            >
              Giới thiệu
            </TabsTrigger>
            <TabsTrigger
              value="danh-gia"
              className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none"
            >
              Đánh giá
              <Badge className="ml-2 bg-gray-200 text-gray-800">53</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="bai-viet"
              className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none"
            >
              Bài viết
              <Badge className="ml-2 bg-gray-200 text-gray-800">2</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Giới thiệu */}
          <TabsContent value="gioi-thieu" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="mb-8 shadow-xl">
                  <CardContent className="px-6 py-1">
                    <span className="font-bold text-2xl">Thông tin chung</span>
                    <div className="w-full h-[1px] bg-gray-200 my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-md text-gray-400 mb-1 font-semibold">Mô hình công ty</h3>
                        <p className="font-medium">Dịch vụ và Tư vấn giải pháp</p>
                      </div>
                      <div>
                        <h3 className="text-md text-gray-400 mb-1 font-semibold">Lĩnh vực công ty</h3>
                        <p className="font-medium">Dịch Vụ và Tư Vấn IT</p>
                      </div>
                      <div>
                        <h3 className="text-md text-gray-400 mb-1 font-semibold">Quy mô công ty</h3>
                        <p className="font-medium">1000+ nhân viên</p>
                      </div>
                      <div>
                        <h3 className="text-md text-gray-400 mb-1 font-semibold">Quốc gia</h3>
                        <p className="font-medium">🇧🇪 Belgium</p>
                      </div>
                      <div>
                        <h3 className="text-md text-gray-400 mb-1 font-semibold">Thời gian làm việc</h3>
                        <p className="font-medium">Thứ 2 - Thứ 6</p>
                      </div>
                      <div>
                        <h3 className="text-md text-gray-400 mb-1 font-semibold">Làm việc ngoài giờ</h3>
                        <p className="font-medium">Không có OT</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Giới thiệu công ty</h2>
                    <p className="text-gray-700 mb-4">
                      CBTW is a global tech company with 3,000+ professionals in 21 countries...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Đánh giá */}
          <TabsContent value="danh-gia">
            <div className="text-center py-16 text-gray-500">
              Nội dung đánh giá sẽ xuất hiện ở đây
            </div>
          </TabsContent>

          {/* Bài viết */}
          <TabsContent value="bai-viet">
            <div className="text-center py-16 text-gray-500">
              Nội dung bài viết sẽ xuất hiện ở đây
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
