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

function add(scores: Record<ResultTypeKey, number>, type: ResultTypeKey, points: number) {
  scores[type] += points;
}

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
  const actionMetaphor = asText(answers.boundary_metaphor_action);
  const worstIntrusion = asText(answers.worst_intrusion);
  const failureMoment = asText(answers.failure_moment);
  const behavior = asText(answers.response_behavior);
  const responsibility = asText(answers.responsibility);
  const objectMetaphor = asText(answers.boundary_metaphor_object);

  if (mainBoundary === "床帘或桌帘") add(scores, "帘内筑巢者", 6);
  if (mainBoundary === "个人物品围合") add(scores, "帘内筑巢者", 6);
  if (mainBoundary === "耳机或白噪音") add(scores, "声音逃逸者", 7);
  if (mainBoundary === "错峰活动") add(scores, "声音逃逸者", 2);
  if (mainBoundary === "错峰活动") add(scores, "沉默忍耐者", 2);
  if (mainBoundary === "宿舍规则") add(scores, "规则协商者", 7);
  if (mainBoundary === "沉默忍耐") add(scores, "沉默忍耐者", 7);
  if (mainBoundary === "离开宿舍") add(scores, "沉默忍耐者", 5);

  for (const method of methods) {
    if (["拉床帘", "拉桌帘", "用收纳书架挂篮围合区域", "使用台灯小夜灯"].includes(method)) add(scores, "帘内筑巢者", 2);
    if (["戴耳机或耳塞", "播放白噪音"].includes(method)) add(scores, "声音逃逸者", 3);
    if (["错峰活动", "暂时离开宿舍", "沉默忍耐"].includes(method)) add(scores, "沉默忍耐者", 2);
    if (method === "制定宿舍规则") add(scores, "规则协商者", 4);
  }

  if (["建立一个小房间", "避免被看见", "给自己一个恢复空间"].includes(actionMetaphor)) add(scores, "帘内筑巢者", 2);
  if (["暂时消失", "从集体生活中退出来"].includes(actionMetaphor)) add(scores, "沉默忍耐者", 2);
  if (actionMetaphor === "避免被打扰") add(scores, "声音逃逸者", 2);
  if (actionMetaphor === "只是习惯") {
    add(scores, "帘内筑巢者", 1);
    add(scores, "声音逃逸者", 1);
  }

  const soundIntrusions = ["室友外放", "室友打电话或开麦", "键盘声鼠标声", "闹钟声", "门锁声开关门声", "上下床走动翻身声"];
  const visualIntrusions = ["开灯关灯", "室友靠近床位掀帘借东西", "访客进入宿舍", "宿舍检查"];
  const relationIntrusions = ["室友情绪或关系压力", "群消息线上沟通压力"];

  add(scores, "声音逃逸者", intrusions.filter((item) => soundIntrusions.includes(item)).length);
  add(scores, "帘内筑巢者", intrusions.filter((item) => visualIntrusions.includes(item)).length);
  add(scores, "沉默忍耐者", intrusions.filter((item) => relationIntrusions.includes(item)).length);
  if (intrusions.includes("宿舍检查")) add(scores, "规则协商者", 1);

  if (worstIntrusion === "声音") add(scores, "声音逃逸者", 6);
  if (["光线", "他人行动靠近", "被看见或被注视", "访客"].includes(worstIntrusion)) add(scores, "帘内筑巢者", 4);
  if (["作息不一致", "关系压力"].includes(worstIntrusion)) add(scores, "沉默忍耐者", 4);
  if (worstIntrusion === "宿舍检查或管理进入") add(scores, "规则协商者", 5);

  if (["准备睡觉时", "换衣服整理身体时", "室友带人回来时"].includes(failureMoment)) add(scores, "帘内筑巢者", 2);
  if (["学习做作业时", "做作品创作时"].includes(failureMoment)) add(scores, "声音逃逸者", 2);
  if (["情绪低落时", "不固定随时可能"].includes(failureMoment)) add(scores, "沉默忍耐者", 2);
  if (failureMoment === "宿舍检查时") add(scores, "规则协商者", 3);

  if (["直接提醒对方", "在群里说", "爆发争吵以解决问题"].includes(behavior)) add(scores, "规则协商者", 5);
  if (["戴耳机或加大音量", "以后错峰活动"].includes(behavior)) add(scores, "声音逃逸者", 3);
  if (["拉紧床帘不出来", "暂时离开宿舍", "忍着不说", "变得不想交流"].includes(behavior)) add(scores, "沉默忍耐者", 6);
  if (behavior === "拉紧床帘不出来") add(scores, "帘内筑巢者", 2);

  if (effects.includes("没有明显影响")) {
    add(scores, "规则协商者", 1);
  } else {
    const effectPoints = Math.min(effects.length, 5);
    add(scores, "沉默忍耐者", effectPoints);
    if (effects.includes("睡眠变差")) add(scores, "声音逃逸者", 2);
    if (effects.includes("无法专注")) add(scores, "声音逃逸者", 2);
    if (effects.includes("不想回宿舍")) add(scores, "沉默忍耐者", 2);
  }

  if (responsibility === "个人自己适应") add(scores, "沉默忍耐者", 3);
  if (responsibility === "室友之间协商") add(scores, "规则协商者", 6);
  if (responsibility === "学校宿舍管理调整") add(scores, "规则协商者", 4);
  if (responsibility === "宿舍空间设计改善") add(scores, "帘内筑巢者", 3);
  if (responsibility === "多方共同解决") add(scores, "规则协商者", 7);
  if (responsibility === "无法解决只能忍") add(scores, "沉默忍耐者", 6);

  if (["一层布", "一个角落", "一个茧"].includes(objectMetaphor)) add(scores, "帘内筑巢者", 4);
  if (objectMetaphor === "一副耳机") add(scores, "声音逃逸者", 5);
  if (["一条看不见的线", "一个泡泡"].includes(objectMetaphor)) add(scores, "沉默忍耐者", 3);
  if (["一扇没有锁的门", "一份没人认真读的规则"].includes(objectMetaphor)) add(scores, "规则协商者", 4);

  const resultType = chooseWinner(scores, { mainBoundary, worstIntrusion, behavior, responsibility, objectMetaphor });

  const radar: RadarScores = {
    视觉边界: clamp(
      30 +
        scoreFor(methods, ["拉床帘", "拉桌帘", "用收纳书架挂篮围合区域", "使用台灯小夜灯"]) * 12 +
        (["床帘或桌帘", "个人物品围合"].includes(mainBoundary) ? 24 : 0) +
        (["光线", "被看见或被注视"].includes(worstIntrusion) ? 14 : 0)
    ),
    听觉边界: clamp(
      28 +
        scoreFor(methods, ["戴耳机或耳塞", "播放白噪音"]) * 18 +
        (mainBoundary === "耳机或白噪音" ? 26 : 0) +
        (worstIntrusion === "声音" ? 22 : 0)
    ),
    时间边界: clamp(
      30 +
        scoreFor(methods, ["错峰活动", "暂时离开宿舍"]) * 16 +
        (["错峰活动", "离开宿舍"].includes(mainBoundary) ? 20 : 0) +
        (["作息不一致", "不固定随时可能"].includes(worstIntrusion) ? 12 : 0)
    ),
    规则边界: clamp(
      24 +
        (methods.includes("制定宿舍规则") ? 24 : 0) +
        (mainBoundary === "宿舍规则" ? 24 : 0) +
        (["室友之间协商", "学校宿舍管理调整", "多方共同解决"].includes(responsibility) ? 28 : 0)
    ),
    心理恢复: clamp(
      34 +
        (actionMetaphor === "给自己一个恢复空间" ? 22 : 0) +
        Math.min(effects.filter((item) => item !== "没有明显影响").length * 8, 28) +
        (["情绪低落时", "不固定随时可能"].includes(failureMoment) ? 10 : 0)
    )
  };

  return { resultType, scores, radar };
}

function chooseWinner(
  scores: Record<ResultTypeKey, number>,
  signals: {
    mainBoundary: string;
    worstIntrusion: string;
    behavior: string;
    responsibility: string;
    objectMetaphor: string;
  }
) {
  const maxScore = Math.max(...Object.values(scores));
  const tied = resultOrder.filter((type) => scores[type] === maxScore);

  if (tied.length === 1) {
    return tied[0];
  }

  const tieBreakers: ResultTypeKey[] = [];
  if (signals.mainBoundary === "耳机或白噪音" || signals.worstIntrusion === "声音" || signals.objectMetaphor === "一副耳机") tieBreakers.push("声音逃逸者");
  if (["沉默忍耐", "离开宿舍"].includes(signals.mainBoundary) || ["忍着不说", "变得不想交流", "暂时离开宿舍"].includes(signals.behavior)) tieBreakers.push("沉默忍耐者");
  if (signals.mainBoundary === "宿舍规则" || ["室友之间协商", "学校宿舍管理调整", "多方共同解决"].includes(signals.responsibility)) tieBreakers.push("规则协商者");
  if (["床帘或桌帘", "个人物品围合"].includes(signals.mainBoundary)) tieBreakers.push("帘内筑巢者");

  return tieBreakers.find((type) => tied.includes(type)) ?? tied[0] ?? "帘内筑巢者";
}

function scoreFor(values: string[], targets: string[]) {
  return values.filter((value) => targets.includes(value)).length;
}

function clamp(value: number) {
  return Math.max(20, Math.min(100, value));
}
