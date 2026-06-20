import { NextResponse } from "next/server";
import { buildStats } from "@/lib/adminStats";
import { createServerSupabaseClient, type ResponseRow } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const password = request.headers.get("x-admin-password");

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "没有读取到 ADMIN_PASSWORD。请确认项目文件夹里有 .env.local，并且重启本地网站。" }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "后台密码不正确。" }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("responses").select("*").order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stats: buildStats((data ?? []) as ResponseRow[]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取后台数据失败。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
