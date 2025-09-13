import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://okvahywrzozoqsmtdmcw.supabase.co"; // tu URL de Supabase
const SUPABASE_ANON_KEY = "sb_publishable_voYfeMY4Yje9njnQoU0Jgg_GfOdlOub"; // tu anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
