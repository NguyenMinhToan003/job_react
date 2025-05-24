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
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import {
  Bold,
  CircleCheckBig,
  CirclePlus,
  Italic,
  SquarePen,
  Underline,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
                      className='w-6 h-6 text-red-600 cursor-pointer'
                      onClick={() => setOpenPopup(true)}
                    />
                  ) : (
                    <SquarePen
                      className='w-6 h-6 text-red-600 cursor-pointer'
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
          <div className='space-y-1'>
            {description.split('\n').map(
              (line, index) =>
                line.trim() && (
                  <div
                    key={index}
                    className='flex items-start gap-3 justify-start'
                  >
                    <CircleCheckBig className='min-w-4 min-h-4 max-w-4 max-h-4 text-red-600' />
                    <div className='text text-gray-700'>{line}</div>
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent
          className='max-w-2xl max-h-[90vh] overflow-hidden'
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Thêm mô tả công việc</DialogTitle>
          </DialogHeader>

          <div className='text-sm mb-2'>
            <span className='text-orange-600 font-semibold'>Tips:</span>{' '}
            Bạn có thể nhập nội dung mô tả về bản thân, kỹ năng, sở thích,
            hoặc bất kỳ thông tin nào bạn muốn chia sẻ với nhà tuyển dụng.
          </div>

          <div className='border rounded-md p-2 min-h-[250px] h-[300px] flex flex-col'>
            <ToggleGroup type='multiple' className='mb-2'>
              <ToggleGroupItem value='bold' aria-label='Toggle bold' title='Bold'>
                <Bold className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='italic' aria-label='Toggle italic' title='Italic'>
                <Italic className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='underline' aria-label='Toggle underline' title='Underline'>
                <Underline className='h-4 w-4' />
              </ToggleGroupItem>
            </ToggleGroup>

            <textarea
              className='w-full flex-1 resize-none overflow-y-auto bg-transparent text-gray-700 placeholder-gray-500 border-none text-sm font-medium focus-visible:ring-0 focus-visible:outline-none p-2'
              placeholder='Nhập mô tả công việc...'
              maxLength={2500}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className='text-right text-xs text-muted-foreground mt-2'>
            {text.length}/2500 characters
          </div>

          <DialogFooter className='mt-4'>
            <Button
              variant='outline'
              onClick={() => {
                setOpenPopup(false);
                setText(description); // reset lại nếu huỷ
              }}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-600 text-white'
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
