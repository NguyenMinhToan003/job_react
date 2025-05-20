import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import CreateJob from "./CreateJob"
import ListJob from "./ListJob"


export default function CompanyJob() {
  return (
    <>
      <Tabs defaultValue="1" className="w-full">
        <TabsList>
          <TabsTrigger value="1">List</TabsTrigger>
          <TabsTrigger value="2">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="1">
          <ListJob/>
        </TabsContent>

        <TabsContent value="2">
          <CreateJob/>
        </TabsContent>
      </Tabs>
    </>
  )
}
