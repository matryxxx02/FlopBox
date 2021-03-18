import { Document } from "https://deno.land/x/filedb/mod.ts";

export default interface Server extends Document {
  alias?: string;
  url?: string;
}
