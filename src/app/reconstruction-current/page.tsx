import {notFound} from "next/navigation";
import {CurrentReconstructionReview} from "@/components/current-reconstruction-review";
export default function CurrentReconstructionPage(){
 if(process.env.NODE_ENV!=="development")notFound();
 return <CurrentReconstructionReview />;
}
