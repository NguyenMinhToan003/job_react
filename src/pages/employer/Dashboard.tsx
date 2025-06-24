"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Briefcase,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  Plus,
  MoreHorizontal,
  Package,
  CreditCard,
  Bell,
  Settings,
} from "lucide-react"
import { toast } from "sonner"

// Mock data - replace with actual API calls
const mockDashboardData = {
  stats: {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    newApplications: 23,
    profileViews: 1240,
    packageCredits: 5,
  },
  recentJobs: [
    {
      id: "1",
      title: "Senior Frontend Developer",
      location: "Hà Nội",
      applications: 45,
      views: 320,
      status: "active",
      postedDate: "2024-01-15",
      expiryDate: "2024-02-15",
    },
    {
      id: "2",
      title: "Product Manager",
      location: "TP.HCM",
      applications: 32,
      views: 280,
      status: "active",
      postedDate: "2024-01-10",
      expiryDate: "2024-02-10",
    },
    {
      id: "3",
      title: "UX/UI Designer",
      location: "Đà Nẵng",
      applications: 28,
      views: 195,
      status: "expired",
      postedDate: "2023-12-20",
      expiryDate: "2024-01-20",
    },
  ],
  recentApplications: [
    {
      id: "1",
      candidateName: "Nguyễn Văn A",
      candidateAvatar: "/placeholder.svg",
      jobTitle: "Senior Frontend Developer",
      appliedDate: "2024-01-20",
      status: "pending",
      experience: "5 năm",
    },
    {
      id: "2",
      candidateName: "Trần Thị B",
      candidateAvatar: "/placeholder.svg",
      jobTitle: "Product Manager",
      appliedDate: "2024-01-19",
      status: "reviewed",
      experience: "3 năm",
    },
    {
      id: "3",
      candidateName: "Lê Văn C",
      candidateAvatar: "/placeholder.svg",
      jobTitle: "UX/UI Designer",
      appliedDate: "2024-01-18",
      status: "shortlisted",
      experience: "4 năm",
    },
  ],
  packages: [
    {
      id: "1",
      name: "Gói Cơ Bản",
      type: "JOB",
      creditsUsed: 3,
      creditsTotal: 5,
      expiryDate: "2024-03-15",
      status: "active",
    },
    {
      id: "2",
      name: "Gói Premium",
      type: "EMPLOYER",
      creditsUsed: 8,
      creditsTotal: 20,
      expiryDate: "2024-04-20",
      status: "active",
    },
  ],
}

export default function EmployerDashboard() {
  const [dashboardData, setDashboardData] = useState(mockDashboardData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      // const data = await getEmployerDashboard()
      // setDashboardData(data)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu dashboard")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang tuyển</Badge>
      case "expired":
        return <Badge variant="destructive">Hết hạn</Badge>
      case "draft":
        return <Badge variant="secondary">Nháp</Badge>
      case "paused":
        return <Badge variant="outline">Tạm dừng</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Chờ xử lý</Badge>
      case "reviewed":
        return <Badge className="bg-blue-500">Đã xem</Badge>
      case "shortlisted":
        return <Badge className="bg-green-500">Lọt vòng</Badge>
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const calculateDaysLeft = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Nhà Tuyển Dụng</h1>
          <p className="text-gray-600">Quản lý tin tuyển dụng và ứng viên của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Thông báo
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Đăng tin mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tin tuyển dụng</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">{dashboardData.stats.activeJobs} tin đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ứng tuyển</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">+{dashboardData.stats.newApplications} ứng tuyển mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem hồ sơ</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">Trong 30 ngày qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits còn lại</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.packageCredits}</div>
            <p className="text-xs text-muted-foreground">Tin đăng có thể tạo</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Tin tuyển dụng</TabsTrigger>
          <TabsTrigger value="applications">Ứng viên</TabsTrigger>
          <TabsTrigger value="packages">Gói dịch vụ</TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tin tuyển dụng gần đây</CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applications} ứng tuyển
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {job.views} lượt xem
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Hết hạn: {formatDate(job.expiryDate)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>Gia hạn</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ứng viên gần đây</CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={application.candidateAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{application.candidateName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{application.candidateName}</h3>
                        <p className="text-sm text-gray-600">Ứng tuyển: {application.jobTitle}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Kinh nghiệm: {application.experience}</span>
                          <span>Ngày ứng tuyển: {formatDate(application.appliedDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getApplicationStatusBadge(application.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Xem hồ sơ</DropdownMenuItem>
                          <DropdownMenuItem>Lọt vòng</DropdownMenuItem>
                          <DropdownMenuItem>Gửi tin nhắn</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Từ chối</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <Badge variant={pkg.status === "active" ? "default" : "secondary"}>
                      {pkg.status === "active" ? "Đang sử dụng" : "Hết hạn"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Đã sử dụng</span>
                      <span>
                        {pkg.creditsUsed}/{pkg.creditsTotal}
                      </span>
                    </div>
                    <Progress value={(pkg.creditsUsed / pkg.creditsTotal) * 100} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hết hạn:</span>
                    <span className="font-medium">{formatDate(pkg.expiryDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Còn lại:</span>
                    <span className="font-medium text-green-600">{calculateDaysLeft(pkg.expiryDate)} ngày</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Gia hạn
                    </Button>
                    <Button size="sm" className="flex-1">
                      Nâng cấp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mua gói dịch vụ mới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Cần thêm credits?</h3>
                <p className="text-gray-600 mb-4">Mua gói dịch vụ để đăng thêm tin tuyển dụng</p>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Xem gói dịch vụ
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất tin tuyển dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tỷ lệ ứng tuyển</span>
                    <span className="font-semibold">12.5%</span>
                  </div>
                  <Progress value={12.5} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tỷ lệ xem hồ sơ</span>
                    <span className="font-semibold">8.3%</span>
                  </div>
                  <Progress value={8.3} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tỷ lệ phản hồi</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top tin tuyển dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentJobs.slice(0, 3).map((job, index) => (
                    <div key={job.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-gray-600">{job.applications} ứng tuyển</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <p>Biểu đồ thống kê sẽ được hiển thị ở đây</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
