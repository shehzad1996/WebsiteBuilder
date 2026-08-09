import { promises as fs } from "fs";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "inquiries.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

/**
 * NOTE: this stores inquiries in a local JSON file, which is fine for local
 * development and small self-hosted deployments, but will NOT persist
 * reliably on serverless platforms (e.g. Vercel) because their filesystem
 * is read-only/ephemeral outside of a single request.
 *
 * Before going live on serverless hosting, swap this module for a real
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
