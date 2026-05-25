import { redirect } from "next/navigation";
import { DEFAULT_PACK_ID } from "@/content/pack-registry";

/**
 * Single-course academy. The root path goes straight into the ABAP
 * course — there is no multi-course picker to choose from.
 */
export default function RootPage() {
  redirect(`/${DEFAULT_PACK_ID}`);
}
