import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { getSupabase } from "./supabase";

export type Inquiry = {
  id: string;
  createdAt: string;
  status: "new" | "quoted" | "building" | "delivered";
  name: string;
  email: string;
  phone?: string;
  projectName?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  /** The submitting user's auth id, if they were signed in. */
  userId?: string;
};

type NewInquiry = Omit<Inquiry, "id" | "createdAt" | "status">;

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Storage backend picks itself at call time: Supabase Postgres when
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are set, otherwise a JSON file
 * in the OS temp dir. The file fallback keeps the app fully working
 * (including on Vercel) with zero setup; it just doesn't persist reliably
 * across serverless instances. Once Supabase env vars are added, storage
 * switches over automatically on the next request — no redeploy needed.
 */
export async function readInquiries(): Promise<Inquiry[]> {
  return supabaseConfigured() ? readFromSupabase() : readFromFile();
}

export async function addInquiry(input: NewInquiry): Promise<Inquiry> {
  return supabaseConfigured() ? addToSupabase(input) : addToFile(input);
}

// ---------------------------------------------------------------------
// Supabase backend
// ---------------------------------------------------------------------

type InquiryRow = {
  id: string;
  created_at: string;
  status: Inquiry["status"];
  name: string;
  email: string;
  phone: string | null;
  project_name: string | null;
  project_type: string;
  budget: string;
  timeline: string;
  description: string;
  user_id: string | null;
};

function fromRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    projectName: row.project_name ?? undefined,
    projectType: row.project_type,
    budget: row.budget,
    timeline: row.timeline,
    description: row.description,
    userId: row.user_id ?? undefined,
  };
}

async function readFromSupabase(): Promise<Inquiry[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as InquiryRow[]).map(fromRow);
}

async function addToSupabase(input: NewInquiry): Promise<Inquiry> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      project_name: input.projectName ?? null,
      project_type: input.projectType,
      budget: input.budget,
      timeline: input.timeline,
      description: input.description,
      user_id: input.userId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as InquiryRow);
}

// ---------------------------------------------------------------------
// File fallback (os.tmpdir) — used only when Supabase isn't configured
// ---------------------------------------------------------------------

const DATA_DIR = process.env.INQUIRIES_DIR ?? os.tmpdir();
const DATA_FILE = path.join(DATA_DIR, "pixelhuman-inquiries.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readFromFile(): Promise<Inquiry[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

async function addToFile(input: NewInquiry): Promise<Inquiry> {
  const inquiries = await readFromFile();
  const inquiry: Inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...input,
  };
  inquiries.unshift(inquiry);
  await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
  return inquiry;
}
