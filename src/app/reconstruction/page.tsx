import { notFound } from "next/navigation";
import { TraceReview } from "@/components/trace-review";

export default function ReconstructionPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <TraceReview />;
}
