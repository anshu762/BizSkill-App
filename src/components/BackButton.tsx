"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="text-gray-400 hover:text-white"
    >
      <ArrowLeft className="mr-1.5 h-4 w-4" />
      Back
    </Button>
  );
}
