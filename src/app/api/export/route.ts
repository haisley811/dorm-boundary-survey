import { NextResponse } from "next/server";
import { createServerSupabaseClient, type ResponseRow } from "@/lib/supabase";

export const runtime = "nodejs";

const headers: (keyof ResponseRow)[] = [
  "id",
  "created_at",
  "respondent_id",
  "region",
  "is_beijing_school",
  "dorm_size",
  "dorm_type",
  "boundary_methods",
  "main_boundary",
  "boundary_metaphor_action",
  "intrusion_types",
  "worst_intrusion",
  "failure_moment",
  "response_behavior",
  "psychological_effects",
  "responsibility",
  "boundary_metaphor_object",
  "result_type",
  "user_agent"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

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

    const csv = toCsv((data ?? []) as ResponseRow[]);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=dorm-boundary-responses.csv"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "导出失败。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function toCsv(rows: ResponseRow[]) {
  const lines = [headers.join(",")];

  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  });

  return `\uFEFF${lines.join("\n")}`;
}

function escapeCsv(value: ResponseRow[keyof ResponseRow]) {
  const normalized = Array.isArray(value) ? value.join(" / ") : value ?? "";
  const stringValue = String(normalized).replaceAll('"', '""');
  return `"${stringValue}"`;
}
