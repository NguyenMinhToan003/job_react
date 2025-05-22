import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import CreateJob from "./CreateJob"
import ListJob from "./ListJob"


export default function CompanyJob() {
  return (
    <>
      <Tabs defaultValue="1" className="w-full p-0">
        <TabsList  className="border-b w-full justify-start rounded-sm h-auto p-0 mb-6 bg-white shadow-xl border-b-gray-300 ">
          <TabsTrigger className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none" value="1">List</TabsTrigger>
          <TabsTrigger className="max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none" value="2">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="p-0">
          <ListJob/>
        </TabsContent>

        <TabsContent value="2" className="p-0">
          <CreateJob/>
        </TabsContent>
      </Tabs>
    </>
  )
}
