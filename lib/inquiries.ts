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
};

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
  };
}

export async function readInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as InquiryRow[]).map(fromRow);
}

export async function addInquiry(
  input: Omit<Inquiry, "id" | "createdAt" | "status">
): Promise<Inquiry> {
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
    })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as InquiryRow);
}
