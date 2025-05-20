import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  Building2,
  Heart,
  HeartOff,
  Bell,
  BadgeDollarSign,
} from "lucide-react";

const similarJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "Teko Vietnam",
    time: "2 giờ trước",
    logo: "https://teko.vn/logo.png",
    type: "Làm việc tại văn phòng",
    tagline: "Thu nhập cạnh tranh",
  },
  {
    id: 2,
    title: "AI Engineer",
    company: "FPT Software",
    time: "1 ngày trước",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FPT_logo_2010.svg",
    type: "Làm việc Hybrid",
    tagline: "Dự án AI quốc tế",
  },
  {
    id: 3,
    title: "Mobile Developer (Flutter)",
    company: "VNPay",
    time: "5 giờ trước",
    logo: "https://vnpay.vn/assets/images/logo.png",
    type: "Toàn thời gian",
    tagline: "Cơ hội thăng tiến nhanh",
  },
];

export default function JobDetail() {
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* Phần 1: Job Detail */}
      <Card className="bg-white shadow-md rounded-md">
        <CardContent className="py-6">
          <h1 className="text-3xl font-extrabold mb-3">
            Co-founder kiêm Tech Lead (Ứng dụng Mobile AI)
          </h1>
          <p className="text-sm text-muted-foreground mb-4">MINU Pte. Ltd</p>

          <div className="flex items-center mb-6 text-green-600 font-semibold text-lg space-x-2">
            <BadgeDollarSign size={20} />
            <span>You’ll love it</span>
          </div>

          <Button
            onClick={() => alert("Ứng tuyển")}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-none mb-4"
          >
            Ứng tuyển
          </Button>

          <button
            onClick={() => setFavorite(!favorite)}
            aria-label="Yêu thích"
            className={`ml-2 p-2 rounded-full border transition-colors duration-300 ${
              favorite
                ? "text-red-600 border-red-600"
                : "text-gray-400 border-gray-300 hover:text-red-600 hover:border-red-600"
            }`}
          >
            {favorite ? <Heart size={20} fill="currentColor" /> : <HeartOff size={20} />}
          </button>
          {/* Thông tin chi tiết */}
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex items-center">
              <MapPin size={16} className="mr-2" />
              Tòa Vivaseen, 48 Tố Hữu, Quận Nam Từ Liêm, Hà Nội{" "}
              <a
                href="#"
                className="ml-2 text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                (Xem bản đồ)
              </a>
            </li>
            <li className="flex items-center">
              <Building2 size={16} className="mr-2" /> Tại văn phòng
            </li>
            <li className="flex items-center">
              <Clock size={16} className="mr-2" /> Đăng 1 giờ trước
            </li>
          </ul>

          {/* Kỹ năng */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Team Leader", "React Native", "AI"].map((skill) => (
              <Badge
                key={skill}
                className="bg-gray-200 text-gray-800 cursor-default px-3 py-1 rounded-md"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Thêm thông tin mô tả công việc */}
          <div className="text-base text-gray-700 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Mô tả công việc</h3>
              <p>
                Bạn sẽ cùng sáng lập và dẫn dắt đội ngũ kỹ thuật xây dựng ứng dụng AI trên nền
                tảng Mobile, tham gia kiến trúc hệ thống và lập trình các tính năng cốt lõi.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Yêu cầu</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Có kinh nghiệm với React Native và kiến trúc hệ thống mobile</li>
                <li>Hiểu biết về AI và machine learning là một lợi thế</li>
                <li>Kỹ năng làm việc nhóm và giải quyết vấn đề tốt</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Phúc lợi</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tham gia sáng lập, chia cổ phần (equity)</li>
                <li>Môi trường sáng tạo, tự chủ và không ngừng phát triển</li>
                <li>Hỗ trợ chi phí tham gia các hội thảo công nghệ</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phần 2: Việc làm tương tự */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Việc làm tương tự dành cho bạn</h2>

        <Card className="mb-6 p-5 flex justify-between items-center bg-white shadow-md rounded-md">
          <p className="text-base">
            Nhận các việc làm tương tự qua email{" "}
            <strong>nguyentoan04.0003@gmail.com</strong>
          </p>
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-red-600 text-red-600 hover:bg-red-50 rounded-md"
          >
            <Bell size={18} />
            <span>Nhận thông báo</span>
          </Button>
        </Card>

        {/* Danh sách gợi ý sẽ giữ nguyên như bạn gửi ở trên */}
      </section>
{/* Danh sách gợi ý việc làm tương tự */}
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {similarJobs.map((job) => (
    <Card key={job.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={job.logo} alt={job.company} />
              <AvatarFallback>{job.company[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base text-gray-900">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
          </div>
          <button
            onClick={() => setFavorite(!favorite)}
            aria-label="Yêu thích"
            className={`p-1 rounded-full border ${
              favorite
                ? "text-red-600 border-red-600"
                : "text-gray-400 border-gray-300 hover:text-red-600 hover:border-red-600"
            }`}
          >
            {favorite ? <Heart size={16} fill="currentColor" /> : <HeartOff size={16} />}
          </button>
        </div>

        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <MapPin size={14} /> Hà Nội
        </div>

        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Building2 size={14} /> {job.type}
        </div>

        <div className="text-sm text-green-600 font-medium flex items-center gap-2">
          <BadgeDollarSign size={16} />
          {job.tagline}
        </div>

        <p className="text-xs text-gray-500">Đăng {job.time}</p>
      </CardContent>
    </Card>
  ))}
</div>

    </div>
  );
}
