import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function Map (){
  const { lat, lng } = useParams();
  return (
    <Card className="max-w-2xl mx-auto p-4">
      <iframe
        src={`https://maps.google.com/maps?q=${+lat},${+lng}&hl=vi&z=14&output=embed`}
        width='100%'
        height='500'
        style={{ border: 0 }}
        allowFullScreen
      ></iframe>
    </Card>
  );
}