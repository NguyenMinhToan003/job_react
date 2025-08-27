export const convertPrice = (minPrice: number | null, maxPrice: number | null): string => {
  if (minPrice === null && maxPrice === null) {
    return 'Thương lượng';
  }
  if (minPrice !== null && maxPrice === null) {
    return `${(minPrice * 1.0)?.toLocaleString('vi-VN')}`;
  }
  else if (minPrice === maxPrice) {
    return `${(minPrice||0 * 1.0)?.toLocaleString('vi-VN')} triệu đồng`;
  }
  return `${(minPrice||0 *1.0)?.toLocaleString('vi-VN')} - ${(maxPrice||0 * 1.0)?.toLocaleString('vi-VN')} triệu đồng`;

}