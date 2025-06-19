import dayjs from "dayjs";

export const convertDateToDiffTime = (date: string): string => {
  const time = dayjs(date);
  const now = dayjs();
  const diffInSeconds = now.diff(time, 'second');
  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  }
  const diffInMinutes = now.diff(time, 'minute');
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  const diffInHours = now.diff(time, 'hour');
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  const diffInDays = now.diff(time, 'day');
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }
  return time.format('DD/MM/YYYY');
};

export const convertDateToString = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY');
}
export const dayRemaning = (date: string): number => {
  const time = dayjs(date);
  const now = dayjs();
  return time.diff(now, 'day');
}