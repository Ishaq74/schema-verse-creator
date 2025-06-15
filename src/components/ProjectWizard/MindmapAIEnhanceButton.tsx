
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  onClick: () => void;
  loading: boolean;
}

export default function MindmapAIEnhanceButton({ onClick, loading }: Props) {
  return (
    <Button variant="default" onClick={onClick} disabled={loading}>
      {loading
        ? (<><Loader2 className="animate-spin w-4 h-4 mr-2" />IA analyse…</>)
        : "Optimiser via IA"}
    </Button>
  );
}
