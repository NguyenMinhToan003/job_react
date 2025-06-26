import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function Map({lat, lng}: {lat?: number, lng?: number}) {
  const { latQ, lngQ } = useParams();

  return (
    <Card className="max-w-2xl mx-auto p-4">
      <iframe
        src={`https://maps.google.com/maps?q=${lat || latQ},${lng || lngQ}&hl=vi&z=14&output=embed`}
        width='100%'
        height='300'
        style={{ border: 0 }}
        allowFullScreen
      ></iframe>
    </Card>
  );
}