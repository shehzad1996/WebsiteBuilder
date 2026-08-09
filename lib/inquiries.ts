import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

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
  aiFeatures: string[];
  description: string;
};

// Vercel's serverless filesystem is read-only everywhere except os.tmpdir(),
// so we write there instead of the app directory. This keeps the demo from
// crashing on deploy, but data still does not persist reliably between
// invocations (a fresh instance gets a fresh /tmp). See the NOTE below.
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

/**
 * NOTE: this stores inquiries in a JSON file on disk, which is fine for
 * local development, but will NOT persist reliably on serverless platforms
 * (e.g. Vercel) since each function invocation can land on a different,
 * short-lived instance.
 *
 * Before going live for real customers, swap this module for a real
 * database (Postgres via Supabase is a good default) while keeping the
 * same readInquiries/addInquiry interface so nothing else has to change.
 */
export async function readInquiries(): Promise<Inquiry[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

export async function addInquiry(
  input: Omit<Inquiry, "id" | "createdAt" | "status">
): Promise<Inquiry> {
  const inquiries = await readInquiries();
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
