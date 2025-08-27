import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ExpiredJobPopup({
  expiredAt,
  setExpiredAt,
  isEdit = false,
}: {
  expiredAt: Date | null;
  setExpiredAt: (date: Date | null) => void;
  isEdit?: boolean;
}) {
  const now = new Date();
  const maxDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  return (
    <Card className="w-full mb-3">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          HẠN NỘP HỒ SƠ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DatePicker
          selectsRange={true}
          startDate={now}
          endDate={expiredAt}
          minDate={now}
          maxDate={maxDate}
          selected={expiredAt}
          onChange={(date: [Date | null, Date | null]) => {
            const [, end] = date;
            setExpiredAt(end);
          }}
          dateFormat="dd/MM/yyyy"
          locale={vi}
          className="mt-2 w-full rounded-md border px-3 py-2 border-[#2c95ff]"
          disabled={isEdit}
          placeholderText="Chọn ngày"
        />
      </CardContent>
    </Card>
  );
}