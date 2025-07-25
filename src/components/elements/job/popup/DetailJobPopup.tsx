import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  CirclePlus,
  SquarePen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Editer from '../../editer/editer';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DetailJobPopup({
  description,
  setDescription,
  notEdit,
}: {
  description: string;
  setDescription: (description: string) => void;
  notEdit?: boolean;
}) {
  const [openPopup, setOpenPopup] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (openPopup) {
      setText(description);
    }
  }, [openPopup, description]);

  return (
    <>
      <Card className='rounded-sm border-none shadow-md mb-4'>
        <CardHeader>
          <CardTitle className='text-lg font-bold text-start'>
            <div className='flex items-center gap-2'>
              <div className='flex-1'>MÔ TẢ CÔNG VIỆC</div>
              {!notEdit && (
                <>
                  {description.trim() === '' ? (
                    <CirclePlus
                      className='w-6 h-6 text-[#451da1] cursor-pointer'
                      onClick={() => setOpenPopup(true)}
                    />
                  ) : (
                    <SquarePen
                      className='w-6 h-6 text-[#451da1] cursor-pointer'
                      onClick={() => setOpenPopup(true)}
                    />
                  )}
                </>
              )}
            </div>
            <div className='w-full h-[1px] bg-gray-200 mt-4' />
          </CardTitle>
        </CardHeader>

        <CardContent className='px-6 space-y-2'>
          {
            description.trim() === '' ? (
              <div className='text-gray-500 text-sm'>
                Bạn có thể thêm mô tả công việc tại đây.
              </div>
            ) : (
              <div
                className='text-neutral-700'
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )
          }
        </CardContent>
      </Card>

      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent
          className='w-2xl h-[85vh] '
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Thêm mô tả công việc</DialogTitle>
          </DialogHeader>

          <ScrollArea  className='h-[65vh] overflow-y-auto overflow-x-hidden'>
            <Editer
              text={text}
              setText={setText}
            />
          </ScrollArea>

          <DialogFooter className='mt-4'>
            <Button
              variant='outline'
              onClick={() => {
                setOpenPopup(false);
                setText(description);
              }}
            >
              Cancel
            </Button>
            <Button
              className='bg-[#451DA0] hover:bg-[#451DA0] text-white rounded-none w-40'
              onClick={() => {
                setDescription(text.trim());
                setOpenPopup(false);
              }}
              disabled={text.trim() === '' || text.trim() === description.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
