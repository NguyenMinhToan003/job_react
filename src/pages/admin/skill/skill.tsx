/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  createSkill,
  updateSkill,
  deleteSkill,
  paginateSkill,
} from '@/apis/skillAPI';
import { Skill, SkillResponse } from '@/types/skillType';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Field, Major } from '@/types/majorType';
import { getFieldList } from '@/apis/fieldAPI';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVertical } from 'lucide-react';
import { getListMajorAPI } from '@/apis/majorAPI';
import { useNavigate } from 'react-router-dom';
import PaginationModel1 from '@/components/elements/pagination/paginationModel1';

export default function SkillPage() {
  const [skillList, setSkillList] = useState<SkillResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number>(-1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [majorList, setMajorList] = useState<Major[]>([]);
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field>();
  const [selectedMajor, setSelectedMajor] = useState<Major>();
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<number>(1);
  const [allMajor, setAllMajor] = useState<Major[]>([]);
  const [selectSearchMajor, setSelectSearchMajor] = useState<Major | undefined>(undefined);
  const [search, setSearch] = useState<string>('');

  const fetchSkillList = async () => {
    try {
      console.log('check')
      const response = await paginateSkill(page, limit, {
        search: search,
        majorId: selectSearchMajor?.id|| undefined,
      });
      console.log(response);
      setTotalPages(response.totalPages || 0);
      setSkillList(response.items);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lấy danh sách kỹ năng thất bại');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSkillList();
  }, [page, limit, selectedMajor]);

  const handleSubmit = async () => {
    try {
      if (isEdit && editingId !== -1) {
        await updateSkill({
          id: editingId,
          name: name,
          status: status,
          majorId: selectedMajor?.id || 0,
        });
        toast.success('Cập nhật kỹ năng thành công!');
      } else {
        await createSkill({
          name,
          status,
          majorId: selectedMajor?.id || 0,
        });
        toast.success('Tạo kỹ năng mới thành công!');
      }
      fetchSkillList();
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể lưu kỹ năng');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(id);
      toast.success('Xóa kỹ năng thành công!');
      fetchSkillList();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa kỹ năng');
      console.error(error);
    }
  };

  const handleEdit = (skill: SkillResponse) => {
    setIsEdit(true);
    setName(skill.name);
    setStatus(skill.status);
    setSelectedField(skill.major?.field);
    setSelectedMajor(skill.major);
    setEditingId(skill.id);
    setOpen(true);
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditingId(-1);
    setName('');
    setStatus(1);
    setSelectedMajor(undefined);
    setSelectedField(undefined);
  };

  const toggleStatus = async (skill: Skill) => {
    try {
      await updateSkill({
        id: skill.id,
        name: skill.name,
        status: skill.status === 1 ? 0 : 1,
      });
      toast.success('Cập nhật trạng thái thành công!');
      fetchSkillList();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
      console.error(error);
    }
  };
  const getElement = async () => {
    try {
      const [fieldResponse, allMajorlist] = await Promise.all([
        getFieldList(),
        getListMajorAPI()
      ]);
      setFieldList(fieldResponse);
      setAllMajor(allMajorlist);
    }
    catch(error: any) {
      toast.error(error.response?.data?.message || 'Lấy danh sách chuyên ngành thất bại');
    }
  }

  useEffect(() => {
    getElement();
  }, []);

  const handleSelectField = (value: string) => {
    const field = fieldList.find(f => f.id.toString() === value);
    setSelectedField(field);
    setSelectedMajor(undefined);
    if (field) {
      setMajorList(field.majors || []);
    } else {
      setMajorList([]);
    }
  };

  useEffect(() => {
    setMajorList(selectedField?.majors || []);
  }, [selectedField])

  const navigate = useNavigate();


  return (
    <div className='p-6 flex flex-col gap-6  w-full'>
      <Card className='flex-1'>
        <CardHeader className='flex justify-between items-center'>
          <CardTitle>Quản lý Kĩ năng</CardTitle>

          <div className='flex items-center gap-2'>
            <Button onClick={() => {
              setOpen(true)
              setIsEdit(false)
            }}>+ Thêm kỹ năng</Button>
          </div>
        </CardHeader>
        

        <CardContent className='p-6 space-y-2'>
          <div className='flex items-center justify-between mb-4 gap-1'>
            <Input
              placeholder='Tìm kiếm kỹ năng...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={() => {
                setPage(1);
                fetchSkillList();
              }}
            >
              Tìm kiếm
            </Button>
            <Select
              value={selectSearchMajor?.id?.toString() || ''}
              onValueChange={(value) => {
                const major = allMajor.find(m => m.id === Number(value));
                setSelectSearchMajor(major);
                setPage(1);
                fetchSkillList();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn Chuyen nganh' />
              </SelectTrigger>
              <SelectContent>
                {allMajor.map((major) => (
                  <SelectItem key={major.id} value={major.id.toString()}>
                    {major.name}
                  </SelectItem>
                ))} 
              </SelectContent>
            </Select>
            {
              selectSearchMajor && (
                <Button
                  variant='destructive'
                  onClick={() => {
                    setSelectSearchMajor(undefined);
                    setPage(1);
                    fetchSkillList();
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )
            }
          </div>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên kỹ năng</TableHead>
                <TableHead>Chuyên ngành</TableHead>
                <TableHead>Lĩnh vực</TableHead>
                <TableHead className='text-center'>Trạng thái</TableHead>
                <TableHead className='w-[200px] text-center'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillList.length > 0 ? (
                skillList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell
                      className='cursor-pointer hover:underline'
                      onClick={() => navigate(`/admin/chuyen-nganh/${item.major?.id}`)}
                    >{item.major?.name || 'Không có'}</TableCell>
                    <TableCell>{item.major?.field?.name || 'Không có'}</TableCell>
                    <TableCell className='text-center'>
                      <Switch
                        checked={item.status === 1}
                        onCheckedChange={() => toggleStatus(item)}
                      />
                    </TableCell>
                    <TableCell className='text-center'>
                      <Popover>
                        <PopoverTrigger className='p-0'>
                          <Button variant='outline' className='w-full justify-center'>
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-fit p-0'>
                          <Button variant='ghost' className='w-full justify-start hover:bg-blue-500 hover:text-white rounded-none'
                            onClick={() => handleEdit(item)}>
                            Sửa
                          </Button>
                          <Button variant='ghost' onClick={() => handleDelete(item.id)} className='w-full justify-start hover:bg-red-500 hover:text-white rounded-none'>
                            Xóa
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='text-center text-gray-500'>
                    Không có kỹ năng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PaginationModel1
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEdit ? 'Sửa kỹ năng' : 'Thêm kỹ năng'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <Input
                    placeholder='Tên kỹ năng'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Label className='block mb-2'>
                    Lĩnh vực
                  </Label>
                  <Select
                    defaultValue={selectedField?.id?.toString() || ''}
                    onValueChange={(value) => handleSelectField(value)}
                  >
                    <SelectTrigger                   className='w-full'>
                      <SelectValue placeholder='Chọn lĩnh vực' />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldList.map((field) => (
                        <SelectItem key={field.id} value={field.id.toString()}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label className='block mb-2'>
                    Chuyên ngành
                  </Label>
                  <Select
                    defaultValue={selectedMajor?.id?.toString() || ''}
                    onValueChange={(value) => {
                      const major = majorList.find(m => m.id === Number(value));
                      setSelectedMajor(major);
                    }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn chuyên ngành' />
                    </SelectTrigger>
                    <SelectContent>
                      {majorList.map((major) => (
                        <SelectItem key={major.id} value={major?.id?.toString()}>
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <span>Trạng thái:</span>
                    <Switch
                      checked={status === 1}
                      onCheckedChange={(checked) => setStatus(checked ? 1 : 0)}
                    />
                  </div>
                </div>
                <DialogFooter className='mt-4'>
                  <Button variant='outline' onClick={() => setOpen(false)}>Hủy</Button>
                  <Button onClick={handleSubmit}>{isEdit ? 'Cập nhật' : 'Tạo mới'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  );
}
