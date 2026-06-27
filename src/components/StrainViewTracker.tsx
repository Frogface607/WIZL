"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function StrainViewTracker({
  strainId,
  strainType,
}: {
  strainId: string;
  strainType: string;
}) {
  useEffect(() => {
    trackEvent("strain_opened", {
      strain_id: strainId,
      strain_type: strainType,
    });
  }, [strainId, strainType]);

  return null;
}
