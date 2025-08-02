import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function PaginationModel1({
  page,
  setPage,
  totalPages,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}) {
  return (
    <div className='mt-3'>
<ReactPaginate
  previousLabel={<ChevronLeft className='w-4 h-4' />}
  nextLabel={<ChevronRight className='w-4 h-4' />}
  breakLabel='...'
  pageCount={totalPages}
  marginPagesDisplayed={2}
  pageRangeDisplayed={3}
  onPageChange={(selected) => setPage(selected.selected + 1)}
  containerClassName='flex justify-center items-center gap-1 list-none'
  pageClassName='cursor-pointer'
  pageLinkClassName='text-white bg-gray-100 border border-gray-300 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 text-xs !text-gray-600 font-semibold '
  activeClassName='!bg-[#2c95ff] !text-white rounded-full'
  activeLinkClassName='!bg-[#2c95ff] !text-white rounded-full'

  previousClassName='cursor-pointer'
  nextClassName='cursor-pointer'
  disabledClassName='opacity-50 cursor-not-allowed'
/>

    </div>
  );
}