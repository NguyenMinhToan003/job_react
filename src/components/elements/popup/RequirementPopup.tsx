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
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Bold,
  CircleCheckBig,
  CirclePlus,
  Italic,
  SquarePen,
  Underline,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RequirementPopup({
  requirement,
  setRequirement,
}: {
  requirement: string;
  setRequirement: (description: string) => void;
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
              {
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
              }
            </div>
            <div className="w-full h-[1px] bg-gray-200 mt-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-2">
          <div className="space-y-1">
            {requirement.split("\n").map((line, index) => (
              line.trim() && (
                <div
                  key={index}
                  className="flex items-center gap-2 justify-start"
                >
                  <CircleCheckBig className="w-4 h-4 text-red-600" />
                  <div className="text text-gray-700">{line}</div>
                </div>
              )
            ))}
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

          <div className="text-sm mb-2">
            <span className="text-orange-600 font-semibold">Tips:</span>{" "}
            Bạn có thể nhập nội dung mô tả về bản thân, kỹ năng, sở thích, hoặc bất kỳ thông tin nào bạn muốn chia sẻ với nhà tuyển dụng.
          </div>

          <div className="border rounded-md p-2 min-h-[250px] h-[300px] flex flex-col">
            <ToggleGroup type="multiple" className="mb-2">
              <ToggleGroupItem value="bold" aria-label="Toggle bold" title="Bold">
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic" title="Italic">
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Toggle underline" title="Underline">
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <textarea
              className="w-full flex-1 resize-none bg-transparent text-gray-700 placeholder-gray-500 border-none text-sm font-medium focus-visible:ring-0 focus-visible:outline-none p-2"
              placeholder="Nhập mô tả công việc..."
              onChange={(e) => setText(e.target.value)}
              maxLength={2500}
              value={text}
            />
          </div>


          <div className="text-right text-xs text-muted-foreground mt-2">
            {text.length}/2500 characters
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setOpenPopup(false);
              setText(requirement);
            }}>
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
