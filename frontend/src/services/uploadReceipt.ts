import { supabase } from "./supabase";

async function uriToArrayBuffer(uri: string) {
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`Failed to read file uri: ${res.status}`);
  return await res.arrayBuffer();
}

export async function uploadReceipt(params: {
  employeeId: string;
  claimId: string;
  file: { uri: string; name: string; contentType: string };
}) {
  const { employeeId, claimId, file } = params;

  const path = `receipts/${employeeId}/${claimId}/${file.name}`;

  const arrayBuffer = await uriToArrayBuffer(file.uri);

  const { error } = await supabase.storage
    .from("receipts")
    .upload(path, arrayBuffer, {
      contentType: file.contentType,
      upsert: true,
    });

  if (error) {
    // this will show real supabase storage errors if any
    console.log("Supabase upload error:", error);
    throw error;
  }

  const { data } = supabase.storage.from("receipts").getPublicUrl(path);
  return data.publicUrl;
}
