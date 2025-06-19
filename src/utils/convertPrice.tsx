export const convertPrice = (minPrice: number | null, maxPrice: number | null): string => {
  if (minPrice === null && maxPrice === null) {
    return 'Thương lượng';
  }
  return `Từ ${minPrice} đến ${maxPrice} triệu đồng`;
  
}