"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  event: string;
  props?: Record<string, string | number | boolean | undefined>;
}

export default function TrackOnMount({ event, props }: Props) {
  useEffect(() => {
    trackEvent(event, props);
  }, [event, JSON.stringify(props)]);

  return null;
}
