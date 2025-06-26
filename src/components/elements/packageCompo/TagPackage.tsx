import { Badge } from "@/components/ui/badge";
import { PackageType } from "@/types/type";

export default function TagPackage({ type }: { type: PackageType }) {
  return <>{
    type === PackageType.BANNER ? <>
      <Badge className="bg-[#6c43d3] text-white">
        Tuyển gấp
      </Badge>
    </>
      : type === PackageType.JOB ? <>
        <Badge className="bg-[#451e99] text-white">
          Hiệu ứng nổi bật
        </Badge>
      </> : type === PackageType.EMPLOYER ? <>
        <Badge className="bg-[#6c43d3] text-white">
          Nhà tuyển dụng nổi bật
          </Badge>
      </> : null
  }
    </> 
}