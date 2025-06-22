export const convertPrice = (minPrice: number | null, maxPrice: number | null): string => {
  if (minPrice === null && maxPrice === null) {
    return 'Thương lượng';
  }
  if (minPrice === null|| maxPrice === null) {
    return 'Thương lượng';
  }
  else if (minPrice === maxPrice) {
    return `${(minPrice * 1.0)?.toLocaleString('vi-VN')} triệu đồng`;
  }
  return `Từ ${(minPrice *1.0)?.toLocaleString('vi-VN')} đến ${(maxPrice * 1.0)?.toLocaleString('vi-VN')} triệu đồng`;
  
}