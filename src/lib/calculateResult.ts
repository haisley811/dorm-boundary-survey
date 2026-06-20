import type { QuestionId } from "@/data/questions";
import type { ResultTypeKey } from "@/data/resultTypes";

export type SurveyAnswers = Partial<Record<QuestionId, string | string[]>>;

export type RadarScores = {
  "视觉边界": number;
  "听觉边界": number;
  "时间边界": number;
  "规则边界": number;
  "心理恢复": number;
};

export type CalculatedResult = {
  resultType: ResultTypeKey;
  scores: Record<ResultTypeKey, number>;
  radar: RadarScores;
};

const resultOrder: ResultTypeKey[] = ["帘内筑巢者", "声音逃逸者", "沉默忍耐者", "规则协商者"];

const asArray = (value: string | string[] | undefined) => (Array.isArray(value) ? value : value ? [value] : []);
const asText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

export function calculateResult(answers: SurveyAnswers): CalculatedResult {
  const scores: Record<ResultTypeKey, number> = {
    帘内筑巢者: 0,
    声音逃逸者: 0,
    沉默忍耐者: 0,
    规则协商者: 0
  };

  const methods = asArray(answers.boundary_methods);
  const intrusions = asArray(answers.intrusion_types);
  const effects = asArray(answers.psychological_effects);
  const mainBoundary = asText(answers.main_boundary);
  const worstIntrusion = asText(answers.worst_intrusion);
  const behavior = asText(answers.response_behavior);
  const responsibility = asText(answers.responsibility);
  const metaphorAction = asText(answers.boundary_metaphor_action);
  const object = asText(answers.boundary_metaphor_object);

  if (["床帘或桌帘", "个人物品围合"].includes(mainBoundary)) scores.帘内筑巢者 += 4;
  if (methods.some((item) => ["拉床帘", "拉桌帘", "用收纳书架挂篮围合区域", "使用台灯小夜灯"].includes(item))) {
    scores.帘内筑巢者 += 2;
  }
  if (["建立一个小房间", "避免被看见", "一个角落", "一个茧", "一层布"].includes(metaphorAction) || ["一个角落", "一个茧", "一层布"].includes(object)) {
    scores.帘内筑巢者 += 1;
  }

  if (mainBoundary === "耳机或白噪音") scores.声音逃逸者 += 4;
  if (worstIntrusion === "声音") scores.声音逃逸者 += 3;
  if (methods.some((item) => ["戴耳机或耳塞", "播放白噪音"].includes(item))) scores.声音逃逸者 += 2;
  if (intrusions.some((item) => ["室友外放", "室友打电话或开麦", "键盘声鼠标声", "闹钟声", "门锁声开关门声"].includes(item))) {
    scores.声音逃逸者 += 1;
  }

  if (mainBoundary === "沉默忍耐") scores.沉默忍耐者 += 3;
  if (["忍着不说", "变得不想交流", "拉紧床帘不出来"].includes(behavior)) scores.沉默忍耐者 += 4;
  if (methods.includes("沉默忍耐")) scores.沉默忍耐者 += 2;
  if (responsibility === "无法解决只能忍") scores.沉默忍耐者 += 2;

  if (mainBoundary === "宿舍规则") scores.规则协商者 += 3;
  if (methods.includes("制定宿舍规则")) scores.规则协商者 += 3;
  if (["室友之间协商", "多方共同解决"].includes(responsibility)) scores.规则协商者 += 4;
  if (["直接提醒对方", "在群里说"].includes(behavior)) scores.规则协商者 += 2;

  const resultType = resultOrder.reduce((best, current) => (scores[current] > scores[best] ? current : best), resultOrder[0]);

  const radar: RadarScores = {
    视觉边界: clamp(35 + scoreFor(methods, ["拉床帘", "拉桌帘", "用收纳书架挂篮围合区域"]) * 14 + (["床帘或桌帘", "个人物品围合"].includes(mainBoundary) ? 24 : 0)),
    听觉边界: clamp(30 + scoreFor(methods, ["戴耳机或耳塞", "播放白噪音"]) * 16 + (worstIntrusion === "声音" ? 24 : 0)),
    时间边界: clamp(32 + scoreFor(methods, ["错峰活动", "暂时离开宿舍"]) * 16 + (["准备睡觉时", "不固定随时可能"].includes(asText(answers.failure_moment)) ? 12 : 0)),
    规则边界: clamp(28 + (methods.includes("制定宿舍规则") ? 24 : 0) + (["室友之间协商", "多方共同解决"].includes(responsibility) ? 28 : 0)),
    心理恢复: clamp(40 + (metaphorAction === "给自己一个恢复空间" ? 24 : 0) + Math.min(effects.length * 6, 24))
  };

  return { resultType, scores, radar };
}

function scoreFor(values: string[], targets: string[]) {
  return values.filter((value) => targets.includes(value)).length;
}

function clamp(value: number) {
  return Math.max(20, Math.min(100, value));
}
