export type QuestionId =
  | "region"
  | "is_beijing_school"
  | "dorm_size"
  | "dorm_type"
  | "boundary_methods"
  | "main_boundary"
  | "boundary_metaphor_action"
  | "intrusion_types"
  | "worst_intrusion"
  | "failure_moment"
  | "response_behavior"
  | "psychological_effects"
  | "responsibility"
  | "boundary_metaphor_object";

export type Question = {
  id: QuestionId;
  index: number;
  title: string;
  type: "single" | "multiple";
  options: string[];
};

export const questions: Question[] = [
  {
    id: "region",
    index: 1,
    title: "你目前或最近一次宿舍所在省份 / 地区是？",
    type: "single",
    options: ["北京", "上海", "广东", "江苏", "浙江", "湖北", "四川或重庆", "港澳台", "其他省份地区", "海外"]
  },
  {
    id: "is_beijing_school",
    index: 2,
    title: "你的学校是否在北京？",
    type: "single",
    options: ["是", "否", "曾经在北京住宿过", "不方便说明"]
  },
  {
    id: "dorm_size",
    index: 3,
    title: "你目前或最近一次居住的宿舍是几人间？",
    type: "single",
    options: ["2人间", "4人间", "5人间", "6人间", "8人间", "其他"]
  },
  {
    id: "dorm_type",
    index: 4,
    title: "你的宿舍更接近哪种类型？",
    type: "single",
    options: ["上床下桌", "上下铺", "混合型", "不确定或其他"]
  },
  {
    id: "boundary_methods",
    index: 5,
    title: "你使用过哪些方式制造私人边界？",
    type: "multiple",
    options: ["拉床帘", "拉桌帘", "戴耳机或耳塞", "播放白噪音", "错峰活动", "用收纳书架挂篮围合区域", "使用台灯小夜灯", "制定宿舍规则", "沉默忍耐", "暂时离开宿舍"]
  },
  {
    id: "main_boundary",
    index: 6,
    title: "你最依赖哪一种边界方式？",
    type: "single",
    options: ["床帘或桌帘", "耳机或白噪音", "错峰活动", "个人物品围合", "宿舍规则", "沉默忍耐", "离开宿舍"]
  },
  {
    id: "boundary_metaphor_action",
    index: 7,
    title: "拉帘或戴耳机对你来说更像什么？",
    type: "single",
    options: ["建立一个小房间", "暂时消失", "避免被看见", "避免被打扰", "从集体生活中退出来", "给自己一个恢复空间", "只是习惯"]
  },
  {
    id: "intrusion_types",
    index: 8,
    title: "即使你已经建立边界，哪些情况仍会进入你的私人空间？",
    type: "multiple",
    options: ["室友外放", "室友打电话或开麦", "键盘声鼠标声", "闹钟声", "开灯关灯", "上下床走动翻身声", "门锁声开关门声", "访客进入宿舍", "宿舍检查", "室友靠近床位掀帘借东西", "室友情绪或关系压力", "群消息线上沟通压力"]
  },
  {
    id: "worst_intrusion",
    index: 9,
    title: "哪一种侵入最难忍受？",
    type: "single",
    options: ["声音", "光线", "作息不一致", "他人行动靠近", "被看见或被注视", "宿舍检查或管理进入", "访客", "关系压力"]
  },
  {
    id: "failure_moment",
    index: 10,
    title: "你的私人边界最容易在什么时候失效？",
    type: "single",
    options: ["准备睡觉时", "学习做作业时", "做作品创作时", "换衣服整理身体时", "情绪低落时", "室友带人回来时", "宿舍检查时", "不固定随时可能"]
  },
  {
    id: "response_behavior",
    index: 11,
    title: "当边界被打破时，你通常会怎么做？",
    type: "single",
    options: ["直接提醒对方", "在群里说", "戴耳机或加大音量", "拉紧床帘不出来", "暂时离开宿舍", "忍着不说", "以后错峰活动", "变得不想交流", "爆发争吵以解决问题"]
  },
  {
    id: "psychological_effects",
    index: 12,
    title: "宿舍环境对你产生过哪些影响？",
    type: "multiple",
    options: ["睡眠变差", "学习效率下降", "情绪更容易烦躁", "无法放松", "无法专注", "不想回宿舍", "创作做作品受影响", "没有明显影响"]
  },
  {
    id: "responsibility",
    index: 13,
    title: "你认为宿舍边界问题主要应该由谁解决？",
    type: "single",
    options: ["个人自己适应", "室友之间协商", "学校宿舍管理调整", "宿舍空间设计改善", "多方共同解决", "无法解决只能忍"]
  },
  {
    id: "boundary_metaphor_object",
    index: 14,
    title: "如果把宿舍里的私人边界比作一种东西，你觉得它更像什么？",
    type: "single",
    options: ["一层布", "一扇没有锁的门", "一个泡泡", "一个茧", "一副耳机", "一个角落", "一条看不见的线", "一份没人认真读的规则"]
  }
];
