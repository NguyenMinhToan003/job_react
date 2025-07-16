/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Check, Pencil, Plus, Ticket, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { createTagResumeAPI, deleteTagResumeAPI, getAllTagResumeAPI, updateTagResumeAPI } from '@/apis/tagResumeAPI';
import { useAlertDialog } from '@/providers/AlertDialogProvider';
import { TagResumeResponse } from '@/types/tagResumeType';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TAG_COLORS } from '@/utils/colorArray';
import { NewTagForm } from '@/components/elements/tag/TagForm';
import { useNavigate } from 'react-router-dom';

export default function TagResume() {
  const [tagResumes, setTagResumes] = useState<TagResumeResponse[]>([]);
  const { showAlert } = useAlertDialog();
  const navigate = useNavigate();
  const fetchTagResumes = async () => {
    try {
      const response = await getAllTagResumeAPI();
      setTagResumes(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách thẻ hồ sơ');
    }
  };
  const handleFilterTagResumes = (tagId: number) => {
    navigate(`/danh-cho-nha-tuyen-dung/ung-vien?tagIds=${tagId}`);
  }

  useEffect(() => {
    fetchTagResumes();
  }, []);

  const handleCreateNewTag = async (name: string, color: string) => {
    try {
      await createTagResumeAPI({ name, color });
      toast.success('Tạo thẻ mới thành công');
      fetchTagResumes();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo thẻ mới');
    }
  }
  const contentCreateNewTag = () => {
    let formName = '';
    let formColor = TAG_COLORS[0].color;
  
    showAlert({
      title: 'Tạo thẻ mới',
      content: (
        <NewTagForm
          onChange={(name, color) => {
            formName = name;
            formColor = color;
          }}
        />
      ),
      confirmText: 'Tạo thẻ',
      cancelText: 'Hủy',
      async handleConfirm() {
        if (!formName.trim()) {
          toast.error('Vui lòng nhập tên thẻ');
          return;
        }
        await handleCreateNewTag(formName, formColor);
      },
    });
  };
  const handleDeleteTag = async (tagId: number) => {
    try {
      await deleteTagResumeAPI(tagId);
      toast.success('Xóa thẻ thành công');
      fetchTagResumes();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa thẻ');
    }
  };

  const handleUpdateTag = async (tagId: number, tagName: string, tagColor: string) => {
    let formName = tagName;
    let formColor = tagColor;

    showAlert({
      title: 'Cập nhật thẻ',
      content: (
        <NewTagForm
          initialName={tagName}
          initialColor={tagColor}
          onChange={(name, color) => {
            formName = name;
            formColor = color;
          }}
        />
      ),
      confirmText: 'Cập nhật',
      cancelText: 'Hủy',
      async handleConfirm() {
        if (!formName.trim()) {
          toast.error('Vui lòng nhập tên thẻ');
          return;
        }
        try {
          await updateTagResumeAPI(tagId, { name: formName, color: formColor });
          toast.success('Cập nhật thẻ thành công');
          fetchTagResumes();
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thẻ');
        }
      },
    });
  };
  

  return (
    <Card className='w-full mt-4 mr-4 h-fit shadow-none border border-gray-200 rounded-xl'>
      <CardContent className='overflow-x-auto'>
        <Table className='text-sm'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-gray-700 text-xs text-left pl-3'>Thẻ</TableHead>
              <TableHead className='text-gray-700 text-xs text-center'>Hồ sơ đã gán</TableHead>
              <TableHead className='text-gray-700 text-xs text-center pr-3 w-100'>Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tagResumes.map((tagResume) => (
              <TableRow
                key={tagResume.id}
                className='transition-all hover:bg-transparent'
              >
                <TableCell className='pl-3 peer'>
                  <Button
                    variant='ghost'
                    className='p-0 text-neutral-800  w-full py-2 px-4  text-sm rounded-xl cursor-pointer'
                    style={{ backgroundColor: tagResume.color }}
                  >
                    {tagResume.name}
                  </Button>
                </TableCell>

                <TableCell className=' text-center font-semibold text-[#2C95FF]'
                  onClick={() => handleFilterTagResumes(tagResume.id)}
                >
                  <Button
                    variant={'link'}
                    className='text-xs cursor-pointer'
                    style={{ color: '#2C95FF' }}
                  >
                    <Ticket className='w-4 h-4 inline-block mr-1' />
                    {tagResume.applyJobs?.length} hồ sơ
                  </Button>
                </TableCell>

                <TableCell className='text-center pr-3'>
                  <div className='flex justify-center items-center'>
                    <Button variant='ghost' className='text-xs h-6 px-2 text-[#2C95FF] hover:text-[#2C95FF] bg-transparent hover:bg-transparent cursor-pointer'
                      onClick={() => {
                        handleUpdateTag(tagResume.id, tagResume.name, tagResume.color);
                      }}
                    >
                      <Pencil className='w-4 h-4 ' />
                      Sửa
                    </Button>
                    <Button
                      variant='ghost'
                      className='text-xs h-6 px-2 ml-2 text-red-400 hover:text-red-400 bg-transparent hover:bg-transparent cursor-pointer'
                      onClick={() => {
                        showAlert({
                          title: 'Xóa thẻ',
                          content: `Bạn có chắc chắn muốn xóa thẻ "${tagResume.name}"?`,
                          confirmText: 'Xóa',
                          cancelText: 'Hủy bỏ',
                          handleConfirm() {
                              handleDeleteTag(tagResume.id);
                          },
                        })
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <Button className='bg-[#451DA0] text-white hover:bg-[#451DA0] hover:text-white rounded-sm w-34 cursor-pointer'
          onClick={() => contentCreateNewTag()}
        >
          <Plus className=' w-4 h-4' />
          Thêm thẻ mới
        </Button>
      </CardFooter>
    </Card>
  );
}
