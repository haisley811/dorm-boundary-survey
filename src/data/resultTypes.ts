export type ResultTypeKey = "帘内筑巢者" | "声音逃逸者" | "沉默忍耐者" | "规则协商者";

export type ResultType = {
  title: ResultTypeKey;
  subtitle: string;
  description: string;
  keywords: string[];
  cardText: string;
  accent: "steel" | "red" | "ink" | "mist";
};

export const resultTypes: Record<ResultTypeKey, ResultType> = {
  帘内筑巢者: {
    title: "帘内筑巢者",
    subtitle: "用一层布，把床位重新折叠成房间。",
    description:
      "你更倾向通过视觉遮挡、物品围合和床位秩序来建立私人空间。对你来说，边界不是拒绝别人，而是给自己一个可被确认的小范围。",
    keywords: ["视觉围合", "床位秩序", "恢复角落"],
    cardText: "你的边界像一张被慢慢拉上的帘子：不厚重，但足够让身体知道这里属于自己。",
    accent: "steel"
  },
  声音逃逸者: {
    title: "声音逃逸者",
    subtitle: "你最先保护的不是视线，而是耳朵。",
    description:
      "你对声音、开麦、外放和作息噪音更敏感。耳机或白噪音像一条临时通道，让你从共享房间里短暂撤离。",
    keywords: ["听觉防线", "白噪音", "错位共处"],
    cardText: "你的边界像一副耳机：它不能改变房间，却能暂时重写你和房间的距离。",
    accent: "ink"
  },
  沉默忍耐者: {
    title: "沉默忍耐者",
    subtitle: "边界被打破时，你常常先把自己收起来。",
    description:
      "你不一定没有不适，只是更习惯把冲突压低。拉紧帘子、减少交流、忍着不说，都是一种低成本但高消耗的自我保护。",
    keywords: ["低声防御", "情绪消耗", "隐形退让"],
    cardText: "你的边界像一条看不见的线：别人未必知道它在哪里，但你每一次被越过都会记得。",
    accent: "red"
  },
  规则协商者: {
    title: "规则协商者",
    subtitle: "你相信边界需要被说出来，也需要被共同维护。",
    description:
      "你更愿意通过提醒、协商和规则来降低摩擦。对你来说，宿舍不是只能忍耐的空间，而是可以被重新约定的共同生活系统。",
    keywords: ["共同约定", "清晰沟通", "空间治理"],
    cardText: "你的边界像一份被认真阅读的规则：不是为了限制关系，而是为了让关系更少互相消耗。",
    accent: "steel"
  }
};
