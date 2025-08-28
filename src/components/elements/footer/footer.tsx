
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#351f57] text-white text-sm ">


      <Separator className="bg-white/20" />
      <div className="text-center text-xs text-white/70 py-4">
        <div className="flex justify-center items-center gap-2">
          © 2025
        </div>
      </div>
    </footer>
  );
}
