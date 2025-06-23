import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TAG_COLORS } from '@/utils/colorArray';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface NewTagFormProps {
  onChange: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
}

export function NewTagForm({ onChange, initialName = '', initialColor = TAG_COLORS[0].color }: NewTagFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    onChange(name, color);
  }, [name, color]);

  return (
    <>
      <Label className='text-sm'>Tên thẻ</Label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Nhập tên thẻ'
        className='mt-2 mb-4'
      />

      <Label className='text-sm'>Chọn màu cho thẻ</Label>
      <div className='flex flex-wrap gap-2 mt-2'>
        {TAG_COLORS.map((item, idx) => (
          <span
            key={idx}
            className={clsx(
              'w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer',
              color === item.color ? 'border-gray-600' : 'border-gray-300'
            )}
            style={{ backgroundColor: item.color }}
            onClick={() => setColor(item.color)}
          >
            {color === item.color && <Check className='w-4 h-4 text-white' />}
          </span>
        ))}
      </div>
    </>
  );
}
