import { useEffect, useState } from "react";
import { getBenefit } from "@/apis/benefitAPI";
import { Benefit } from "@/types/benefitType"; 
import { iconMap } from "@/utils/SetListIcon";
import { Gift } from "lucide-react";


export default function BenefitPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const fetchBenefits = async () => {
    try {
      const data = await getBenefit();
      setBenefits(data);
    } catch (error) {
      console.error("Error fetching benefit list:", error);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  return (
    <div className="p-6 bg-[#f7f7f7] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý quyền lợi</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="bg-white p-4 rounded-lg shadow-md flex items-start gap-4">
            <div className="text-primary text-xl">
              {iconMap[benefit.icon] ?? <Gift />}
            </div>
            <div>
              <h2 className="font-semibold">{benefit.name}</h2>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
