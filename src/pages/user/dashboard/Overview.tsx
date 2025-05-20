import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, Mail } from "lucide-react";

export default function Overview() {
  return (
    <><Card>
          <CardContent className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-20 h-20 border-2 border-[#3d1419]">
                <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocJ1La7mSP1N6T-yDRY285A40n24K3eJWQtEQYZudRq1UQ=s96-c" />
              </Avatar>
              <div>
                <h2 className="font-bold text-lg p-2">Toan</h2>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail />
                  <p className="text-sm text-muted-foreground"> nguyentoan04.0003@gmail.com</p>
            </Button>
            <Button variant="ghost">
              <ChevronRight className="text-blue-600"/>
              <p className="text-sm text-blue-600">Cập nhật hồ sơ</p>
            </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ đính kèm của bạn</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground py-8">
            <FileText className="mx-auto mb-4 text-4xl text-muted" />
            <p className="mb-2">
              Bạn chưa đính kèm CV. Tải lên CV của bạn để tối ưu quá trình tìm việc.
            </p>
            <Button variant="link" className="text-blue-600">Quản lý hồ sơ đính kèm →</Button>
          </CardContent>
      </Card>
      </>
  );
}