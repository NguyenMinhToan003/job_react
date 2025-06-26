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
                    className="w-6 h-6 text-red-600 cursor-pointer"
                    onClick={() => setOpenPopup(true)}
                  />
                ) : (
                  <SquarePen
                    className="w-6 h-6 text-red-600 cursor-pointer"
                    onClick={() => setOpenPopup(true)}
                  />
                )
              )}
            </div>
            <div className="w-full h-[1px] bg-gray-200 mt-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <div className="text-sm text-muted-foreground">
            {requirement.trim() === "" ? (
              <span className="italic">Hãy thêm yêu cầu cho công việc.</span>
            ) : (
              <div className='font-semibold text-gray-800' dangerouslySetInnerHTML={{ __html: requirement }} />
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>YÊU CẦU CÔNG VIỆC</DialogTitle>
          </DialogHeader>
          <div className='h-[60vh] overflow-y-auto overflow-x-hidden'>
            <Editer
              text={text}
              setText={setText}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground mt-2">
            {text.length}/2500 characters
          </div>

          <DialogFooter className="mt-4">
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
              className="bg-red-600 text-white"
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
