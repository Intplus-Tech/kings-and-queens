import { Card } from "@/components/ui/card";
import Image from "next/image";

export function Advertisement() {
  return (
    <div className="sticky top-6">
      <Card className="overflow-hidden">
        <div className="relative h-full min-h-[300px] md:min-h-[80vh] flex items-center justify-center">
          <Image src="/ad.jpg" alt="Coca Cola Bottle" fill />
        </div>
      </Card>
    </div>
  );
}
