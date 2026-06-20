import { NextResponse } from "next/server";
import { questions } from "@/data/questions";
import { calculateResult, type SurveyAnswers } from "@/lib/calculateResult";
import { createServerSupabaseClient, hasPublicSupabaseConfig, type ResponseRow } from "@/lib/supabase";

export const runtime = "nodejs";

type SubmitBody = {
  answers?: SurveyAnswers;
  respondentId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;
    const answers = body.answers ?? {};
    const respondentId = typeof body.respondentId === "string" && body.respondentId.length > 0 ? body.respondentId : null;
    const missing = questions.filter((question) => {
      const value = answers[question.id];
      return Array.isArray(value) ? value.length === 0 : !value;
    });

    if (missing.length > 0) {
      return NextResponse.json({ error: "还有题目未完成。" }, { status: 400 });
    }

    const result = calculateResult(answers);
    const row: ResponseRow = {
      respondent_id: respondentId,
      region: text(answers.region),
      is_beijing_school: text(answers.is_beijing_school),
      dorm_size: text(answers.dorm_size),
      dorm_type: text(answers.dorm_type),
      boundary_methods: array(answers.boundary_methods),
      main_boundary: text(answers.main_boundary),
      boundary_metaphor_action: text(answers.boundary_metaphor_action),
      intrusion_types: array(answers.intrusion_types),
      worst_intrusion: text(answers.worst_intrusion),
      failure_moment: text(answers.failure_moment),
      response_behavior: text(answers.response_behavior),
      psychological_effects: array(answers.psychological_effects),
      responsibility: text(answers.responsibility),
      boundary_metaphor_object: text(answers.boundary_metaphor_object),
      result_type: result.resultType,
      user_agent: request.headers.get("user-agent")
    };

    if (!hasPublicSupabaseConfig) {
      return NextResponse.json({ result, saved: false, warning: "Supabase 环境变量未配置，本地仅生成结果，未保存数据。" });
    }

    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from("responses").insert(row);

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json({ result, saved: false, duplicate: true, warning: "该浏览器已经提交过一次，后台只保留首次数据。" });
        }

        return NextResponse.json({ result, saved: false, warning: error.message });
      }
    } catch (saveError) {
      const warning = saveError instanceof Error ? saveError.message : "Supabase 保存失败，本地仅生成结果。";
      return NextResponse.json({ result, saved: false, warning });
    }

    return NextResponse.json({ result, saved: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "提交失败。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function text(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

function array(value: string | string[] | undefined) {
  return Array.isArray(value) ? value : [];
}
