import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplyJob from "./ApplyJob";
import SaveJob from "./SaveJob";

export default function JobForMe() {
  return <>
    <Card className="w-full p-0 gap-0 bg-inherit border-sm">
      <CardHeader className="p-0 gap-0">
        <CardTitle className="text-xl font-bold m-0 bg-white px-7 py-4 pb-0">Việc làm của tôi</CardTitle>
      </CardHeader>
      <Tabs defaultValue='applied' className="w-full p-0 bg-inherit">
        <TabsList className="border-b w-full justify-start rounded-sm h-auto p-0 sticky top-17 z-100 bg-white">
          <TabsTrigger className="max-w-fit px-7 h-16 mr-1.5 rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none text-lg font-bold" value='applied'>
            Đã ứng tuyển
          </TabsTrigger>
          <TabsTrigger className="max-w-fit px-7 h-16 mr-1.5 rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none text-lg font-bold" value='saved'>
            Đã lưu
          </TabsTrigger>
        </TabsList>
        <div className="mt-9">
        <TabsContent className='pt-3' value='applied'>
          <ApplyJob/>
        </TabsContent>
        <TabsContent className='pt-3' value='saved'>
          <SaveJob/>
        </TabsContent>
        </div>
      </Tabs>
    </Card>
  </>
}