import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  CirclePlus,
  SquarePen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Editer from "../../editer/editer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RequirementPopup({
  requirement,
  setRequirement,
  notEdit,
}: {
  requirement: string;
  setRequirement: (description: string) => void;
  notEdit?: boolean;
}) {
  const [text, setText] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    if (openPopup) {
      setText(requirement);
    }
  }, [openPopup, requirement]);

  return (
    <>
      <Card className="rounded-sm border-none shadow-md mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-start">
            <div className="flex items-center gap-2">
              <div className="flex-1">YÊU CẦU CÔNG VIỆC</div>
              {!notEdit && (
                requirement.trim() === "" ? (
                  <CirclePlus
                    className="w-6 h-6  cursor-pointer text-[#451DA0]"
                    onClick={() => setOpenPopup(true)}
                  />
                ) : (
                  <SquarePen
                    className="w-6 h-6 cursor-pointer text-[#451DA0]"
                    onClick={() => setOpenPopup(true)}
                  />
                )
              )}
            </div>
            <div className="w-full h-[1px] bg-gray-200 mt-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <div >
            {requirement.trim() === "" ? (
              <span className="italic">Hãy thêm yêu cầu cho công việc.</span>
            ) : (
              <div className='text-neutral-700' dangerouslySetInnerHTML={{ __html: requirement }} />
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent
          className="w-3xl overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>YÊU CẦU CÔNG VIỆC</DialogTitle>
          </DialogHeader>
          <ScrollArea className='h-[65vh] overflow-y-auto overflow-x-hidden'>
            <Editer
              text={text}
              setText={setText}
            />
          </ScrollArea>

          <DialogFooter >
            <Button
              variant="outline"
              onClick={() => {
                setOpenPopup(false);
                setText(requirement);
              }}
            >
              Cancel
            </Button>
            <Button
              className='bg-[#451DA0] hover:bg-[#451DA0] text-white rounded-none w-40'
              disabled={text.trim() === "" || text === requirement}
              onClick={() => {
                setRequirement(text.trim());
                setOpenPopup(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
