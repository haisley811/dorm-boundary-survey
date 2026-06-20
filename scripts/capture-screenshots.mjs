import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "screenshots");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-gpu", "--no-sandbox"]
});

try {
  const pages = [
    ["home", homeHtml()],
    ["survey", surveyHtml()],
    ["result", resultHtml()],
    ["admin", adminHtml()]
  ];

  const viewports = [
    ["desktop", { width: 1440, height: 1000, deviceScaleFactor: 1 }],
    ["mobile", { width: 390, height: 844, deviceScaleFactor: 2 }]
  ];

  for (const [name, html] of pages) {
    for (const [viewportName, viewport] of viewports) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: viewport.deviceScaleFactor });
      const page = await context.newPage();
      await page.setContent(html, { waitUntil: "load" });
      await page.screenshot({ path: path.join(outDir, `${name}-${viewportName}.png`), fullPage: true });
      await context.close();
    }
  }
} finally {
  await browser.close();
}

function shell(title, content) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>${css()}</style>
</head>
<body>${content}</body>
</html>`;
}

function homeHtml() {
  return shell("你的宿舍边界", `
    <main class="page">
      <div class="home-shell">
        <header class="topline"><div class="mark"><span></span>Dormitory Boundary Research</div><small>anonymous / 3 min</small></header>
        <section class="home-grid">
          <div>
            <div class="curtain-stack"><i></i><i></i><i></i></div>
            <p class="eyebrow">PRIVATE BOUNDARY TEST</p>
            <h1>你的宿舍边界</h1>
            <p class="lead">一个关于床帘、耳机、沉默与私人空间的 3 分钟测试。</p>
            <p class="bodycopy">你以为拉上床帘，就拥有了私人空间吗？声音、灯光、作息、访客和宿舍检查仍然会穿过那层布。</p>
            <button class="primary">开始测试</button>
          </div>
          <div class="research-card">
            <div class="mini-labels"><span>bed curtain</span><span>noise map</span></div>
            <div class="bed-grid">${["A01", "A02", "B01", "B02"].map((item, index) => `<article><b>${item}</b><em class="${index % 2 ? "red" : ""}"></em><div class="curtain"></div><hr/><p><span></span><span></span><span></span></p></article>`).join("")}</div>
            <div class="waves"></div>
          </div>
        </section>
        <footer>本测试匿名，结果仅用于设计作品集前期调研。</footer>
      </div>
    </main>
  `);
}

function surveyHtml() {
  const options = ["拉床帘", "拉桌帘", "戴耳机或耳塞", "播放白噪音", "错峰活动", "用收纳书架挂篮围合区域", "使用台灯小夜灯", "制定宿舍规则", "沉默忍耐", "暂时离开宿舍"];
  return shell("问卷页", `
    <main class="page survey-page">
      <div class="survey-shell">
        <header class="survey-top"><div><span>05 / 14</span><button>退出</button></div><div class="progress"><i style="width:35.7%"></i></div></header>
        <section class="question">
          <p class="eyebrow">MULTIPLE CHOICE</p>
          <h2>你使用过哪些方式制造私人边界？</h2>
          <div class="notice"><div><b>SELECTED</b><p>已选择 3 项，多选后点击按钮进入下一题</p></div><button class="primary small">下一题</button></div>
          <div class="option-grid">${options.map((option, index) => `<button class="option ${[0,2,7].includes(index) ? "selected" : ""}"><span>${option}</span><i></i></button>`).join("")}</div>
        </section>
      </div>
      <div class="sticky"><span>已选择 3 项</span><button class="primary">下一题</button></div>
    </main>
  `);
}

function resultHtml() {
  return shell("结果页", `
    <main class="page">
      <div class="result-shell">
        <header class="topline"><small>result / boundary portrait</small></header>
        <section class="result-grid">
          <div>
            <p class="eyebrow">你的宿舍边界画像</p>
            <h1>帘内筑巢者</h1>
            <p class="lead">用一层布，把床位重新折叠成房间。</p>
            <p class="bodycopy">你更倾向通过视觉遮挡、物品围合和床位秩序来建立私人空间。对你来说，边界不是拒绝别人，而是给自己一个可被确认的小范围。</p>
            <div class="tags"><span>视觉围合</span><span>床位秩序</span><span>恢复角落</span></div>
            <div class="actions"><button class="primary">复制结果</button><button class="ghost">再测一次</button></div>
          </div>
          <div class="result-side">
            <article class="portrait"><div><p>Boundary Portrait</p><h3>帘内筑巢者</h3></div><i class="curtain"></i><p>你的边界像一张被慢慢拉上的帘子：不厚重，但足够让身体知道这里属于自己。</p><div class="tags three"><span>视觉围合</span><span>床位秩序</span><span>恢复角落</span></div></article>
            <article class="radar"><svg viewBox="0 0 280 220" role="img"><polygon points="140,26 236,88 206,190 74,190 44,88" fill="none" stroke="#c9cac3"/><polygon points="140,52 210,98 188,166 88,170 70,100" fill="rgba(111,127,143,.28)" stroke="#6F7F8F" stroke-width="2"/><text x="124" y="18">视觉边界</text><text x="220" y="84">听觉边界</text><text x="196" y="212">时间边界</text><text x="28" y="212">规则边界</text><text x="0" y="84">心理恢复</text></svg></article>
          </div>
        </section>
      </div>
    </main>
  `);
}

function adminHtml() {
  return shell("后台页", `
    <main class="page admin-page">
      <section class="admin-card">
        <p class="eyebrow">ADMIN BOARD</p>
        <h2>调研后台</h2>
        <input type="password" value="" placeholder="ADMIN_PASSWORD" />
        <button class="primary">进入后台</button>
      </section>
    </main>
  `);
}

function css() {
  return `
    :root{--paper:#F4F4F1;--paper2:#F7F7F4;--ink:#1F1F1D;--steel:#6F7F8F;--red:#9B5C5F;--line:rgba(31,31,29,.13)}
    *{box-sizing:border-box} body{margin:0;background:radial-gradient(circle at 1px 1px,rgba(31,31,29,.12) 1px,transparent 0) 0 0/22px 22px,linear-gradient(90deg,rgba(31,31,29,.045) 1px,transparent 1px) 0 0/72px 72px,linear-gradient(rgba(31,31,29,.035) 1px,transparent 1px) 0 0/72px 72px,var(--paper);font-family:Inter,Segoe UI,Arial,"Microsoft YaHei",sans-serif;color:var(--ink)}
    body:before{content:"";position:fixed;inset:0;background:linear-gradient(115deg,transparent 0 48%,rgba(111,127,143,.07) 48% 52%,transparent 52%),repeating-linear-gradient(90deg,rgba(31,31,29,.035) 0 1px,transparent 1px 48px);pointer-events:none}
    .page{min-height:100vh;padding:24px 48px;position:relative}.home-shell,.result-shell{max-width:1180px;margin:auto;min-height:calc(100vh - 48px);display:flex;flex-direction:column}.topline{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(31,31,29,.1);padding-bottom:20px;color:rgba(31,31,29,.45);font-size:12px}.mark{display:flex;gap:12px;align-items:center;text-transform:uppercase;letter-spacing:.22em;font-size:11px}.mark span{width:36px;height:1px;background:rgba(31,31,29,.3)}.home-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center;flex:1;padding:54px 0}.eyebrow{color:var(--steel);letter-spacing:.28em;font-size:13px}.home-grid h1,.result-grid h1{font-size:76px;line-height:1.02;margin:14px 0 0}.lead{font-size:22px;line-height:1.75;color:rgba(31,31,29,.68)}.bodycopy{font-size:16px;line-height:2;color:rgba(31,31,29,.68);max-width:660px}.primary{min-height:48px;border:1px solid var(--ink);background:var(--ink);color:var(--paper);padding:0 28px;font-size:15px}.ghost{min-height:48px;border:1px solid rgba(31,31,29,.22);background:rgba(255,255,255,.25);padding:0 28px;font-size:15px}.curtain-stack{display:flex;gap:12px;margin-bottom:34px}.curtain-stack i,.curtain{display:block;background:linear-gradient(90deg,rgba(255,255,255,.4),rgba(111,127,143,.08),rgba(255,255,255,.25)),repeating-linear-gradient(90deg,rgba(31,31,29,.08) 0 1px,transparent 1px 18px);backdrop-filter:blur(10px)}.curtain-stack i{width:32px;height:96px;border:1px solid var(--line)}.curtain-stack i:nth-child(2){opacity:.7}.curtain-stack i:nth-child(3){opacity:.45}.research-card{min-height:360px;border:1px solid var(--line);background:rgba(247,247,244,.55);padding:20px;box-shadow:0 24px 70px rgba(31,31,29,.08)}.mini-labels{display:flex;justify-content:space-between;font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:rgba(31,31,29,.35)}.bed-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:34px}.bed-grid article{min-height:130px;border:1px solid var(--line);background:rgba(255,255,255,.25);padding:16px}.bed-grid b{font-size:12px;color:rgba(31,31,29,.45)}.bed-grid em{float:right;width:40px;height:8px;background:rgba(111,127,143,.55)}.bed-grid em.red{background:rgba(155,92,95,.55)}.bed-grid .curtain{height:48px;margin-top:28px}.bed-grid hr{border:0;border-top:1px solid rgba(31,31,29,.15)}.bed-grid p span{display:inline-block;height:6px;background:rgba(31,31,29,.15);margin-right:4px}.bed-grid p span:nth-child(1){width:32px}.bed-grid p span:nth-child(2){width:20px}.bed-grid p span:nth-child(3){width:40px}.waves{height:96px;margin-top:16px;border:1px solid var(--line);background:repeating-linear-gradient(0deg,transparent 0 14px,rgba(31,31,29,.07) 14px 15px),repeating-linear-gradient(90deg,transparent 0 38px,rgba(155,92,95,.08) 38px 39px)}footer{border-top:1px solid rgba(31,31,29,.1);padding:20px 0;color:rgba(31,31,29,.45);font-size:14px}
    .survey-page{padding-bottom:130px}.survey-shell{max-width:760px;margin:auto;min-height:calc(100vh - 40px);display:flex;flex-direction:column}.survey-top{border-bottom:1px solid rgba(31,31,29,.1);padding-bottom:20px}.survey-top>div:first-child{display:flex;justify-content:space-between;color:rgba(31,31,29,.5)}.survey-top button{border:0;background:transparent;color:rgba(31,31,29,.5);font-size:14px}.progress{height:12px;border:1px solid rgba(31,31,29,.15);background:rgba(255,255,255,.3);margin-top:16px}.progress i{display:block;height:100%;background:linear-gradient(90deg,rgba(255,255,255,.4),rgba(111,127,143,.12)),repeating-linear-gradient(90deg,rgba(31,31,29,.08) 0 1px,transparent 1px 18px)}.question{padding:44px 0}.question h2{font-size:42px;line-height:1.25;margin:0}.notice{margin-top:24px;border:1px solid var(--line);background:rgba(247,247,244,.85);display:flex;justify-content:space-between;gap:16px;padding:16px;box-shadow:0 24px 70px rgba(31,31,29,.08)}.notice b{font-size:11px;letter-spacing:.22em;color:var(--steel)}.notice p{margin:6px 0 0;color:rgba(31,31,29,.6)}.small{min-width:144px}.option-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px}.option{min-height:58px;border:1px solid rgba(31,31,29,.12);background:rgba(247,247,244,.72);display:flex;justify-content:space-between;align-items:center;padding:14px 20px;font-size:16px}.option i{width:32px;height:8px;background:rgba(111,127,143,.35)}.option.selected{background:var(--ink);color:var(--paper);border-color:var(--ink)}.option.selected i{background:rgba(244,244,241,.7)}.sticky{position:fixed;left:0;right:0;bottom:0;border-top:1px solid var(--line);background:rgba(244,244,241,.92);padding:16px 48px;display:flex;justify-content:center;gap:420px;box-shadow:0 -18px 50px rgba(31,31,29,.1)}
    .result-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:36px;padding:40px 0}.tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.tags span{border:1px solid var(--line);background:rgba(255,255,255,.3);padding:9px 13px;color:rgba(31,31,29,.65)}.actions{display:flex;gap:12px;margin-top:38px}.result-side{display:grid;gap:20px}.portrait,.radar{border:1px solid var(--line);background:rgba(247,247,244,.8);padding:28px;box-shadow:0 24px 70px rgba(31,31,29,.08)}.portrait{display:grid;grid-template-columns:1fr 70px;gap:20px}.portrait>p{grid-column:1/-1;line-height:2;color:rgba(31,31,29,.7)}.portrait h3{font-size:26px;margin:8px 0}.portrait .curtain{height:84px;border:1px solid var(--line)}.three{display:grid;grid-template-columns:repeat(3,1fr);grid-column:1/-1}.radar svg{width:100%;height:280px}.radar text{font-size:12px;fill:rgba(31,31,29,.62)}
    .admin-page{display:flex;align-items:center;justify-content:center}.admin-card{width:100%;max-width:520px;border:1px solid var(--line);background:rgba(247,247,244,.8);padding:42px;box-shadow:0 24px 70px rgba(31,31,29,.08)}.admin-card h2{font-size:38px;margin:20px 0 28px}.admin-card input{width:100%;min-height:56px;border:1px solid var(--line);background:rgba(255,255,255,.45);padding:0 20px;font-size:16px}.admin-card .primary{width:100%;margin-top:18px}
    @media(max-width:700px){.page{padding:20px}.home-shell,.result-shell,.survey-shell{min-height:calc(100vh - 40px)}.topline{font-size:11px}.home-grid,.result-grid{display:block;padding:36px 0}.home-grid h1,.result-grid h1{font-size:52px}.lead{font-size:18px}.research-card{margin-top:36px}.bed-grid{grid-template-columns:1fr}.question h2{font-size:30px}.notice{display:block}.notice .primary{width:100%;margin-top:14px}.option-grid{grid-template-columns:1fr}.sticky{padding:14px 20px;display:block}.sticky .primary{width:100%;margin-top:10px}.actions{display:block}.actions button{width:100%;margin-bottom:10px}.result-side{margin-top:28px}.portrait{display:block}.portrait .curtain{width:70px;margin:12px 0}.three{display:grid;grid-template-columns:1fr}.admin-card{padding:32px 24px}.admin-card h2{font-size:34px}}
  `;
}
