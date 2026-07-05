import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Test() {
  return <Button render={<Link href="/" />}>Go Home</Button>;
}
