const guides={
 main:{title:'从“今晚不做饭”开始',steps:['点击暖光气泡“回家顺路带晚饭”，先确认路线、方式、预算和口味。','保留默认条件：望京花园、步行、预算 30 元、最多绕 8 分钟。点击下方按钮查看晚饭。','选择香菇鸡腿饭，核对自取 20 元、配送 26 元，以及备餐和取餐入口。','确认下单 → 出发去取餐 → 查看两段距离与时间 → 确认已取到餐。可自愿保存路线后再体验预填。'],expected:'能独立说明为什么选择这份餐，并走通取餐闭环。默认算例为自取省 6 元，额外绕行 3 分钟；这不是线上报价。'},
 equal:{title:'不是每份自取都更便宜',steps:['点击入口，在设置页保留默认条件，进入候选列表。','查看吉野家肥牛饭：自取、配送实付都是 25 元。','再查看老乡鸡辣子鸡丁饭：自取 24 元、配送 22 元。展开实付明细，比较两种方式的优惠。','判断没有价格优势时，是否仍值得为了时间或路线选择自取；也可以不选。'],expected:'同价明确显示同价，自取更贵明确显示“自取多付 2 元”，不能一律写省钱。'},
 unknown:{title:'备餐未知，不承诺零等待',steps:['用默认条件进入候选列表，找到老乡鸡的辣子鸡丁饭。','看到“备餐时间待确认”，再点击“选这份晚饭”。','在确认页观察下单按钮：未确认可能等待前，按钮不可用。','可以主动勾选风险说明再继续，也可以返回改选备餐更明确的门店。'],expected:'用户知道不确定性在哪里，而不是把下单成功、到店或路线图误认为餐已做好。'},
 empty:{title:'没有合适的，就允许退出',steps:['在设置页把回家方向切换为“另一条回家路线（暂无供给）”，再查看候选。','也可以使用默认路线，但将预算改为 15 元；或在结果页逐一点击“这家不顺路”。','观察空结果原因，并尝试修改条件或重看被排除门店。','点击“继续看配送”可退出晚饭流程；独立 Demo 仅提示当前范围，不跳转真实配送页。'],expected:'不展示不符合预算或路线的兜底餐品，也不为了促成自取强行劝用户绕路。'}
};
const tabs=[...document.querySelectorAll('[data-case]')];
const panel=document.getElementById('caseGuide');
function showGuide(key){
 const guide=guides[key];if(!guide)return;
 for(const tab of tabs){const active=tab.dataset.case===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
 panel.setAttribute('aria-labelledby','tab-'+key);
 panel.replaceChildren();
 const eyebrow=document.createElement('p');eyebrow.className='guideEyebrow';eyebrow.textContent='体验提示 · 切换标签仅更换指引，不会替你操作原型';
 const title=document.createElement('h3');title.textContent=guide.title;
 const list=document.createElement('ol');list.className='guideSteps';
 for(const text of guide.steps){const item=document.createElement('li');item.textContent=text;list.append(item);}
 const expected=document.createElement('div');expected.className='expected';
 const label=document.createElement('strong');label.textContent='这一段想验证什么';expected.append(label,document.createTextNode(guide.expected));
 panel.append(eyebrow,title,list,expected);
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>showGuide(tab.dataset.case));
 tab.addEventListener('keydown',event=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();showGuide(tabs[next].dataset.case);tabs[next].focus();
 });
});
showGuide('main');
document.getElementById('printAnswer').addEventListener('click',()=>window.print());
document.getElementById('resetDemo').addEventListener('click',()=>{
 const frame=document.getElementById('demoFrame');const status=document.getElementById('demoStatus');
 try{localStorage.removeItem('selfpick-dinner-preferences-v1');sessionStorage.removeItem('selfpick-dinner-dismissed-day');frame.src='./demo/index.html?reset='+Date.now();status.textContent='原型已重置，保存的测试路线与收起状态已清除。';}
 catch{status.textContent='当前浏览器不允许清理偏好，请在新窗口体验或检查站点存储权限。';}
});
const sections=[...document.querySelectorAll('main > .anchor')];
const links=[...document.querySelectorAll('.sidebar nav a')];
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
  if(!visible.length)return;
  const id=visible[0].target.id;
  links.forEach(link=>{const active=link.hash==='#'+id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 },{rootMargin:'-8% 0px -65% 0px',threshold:0});sections.forEach(section=>observer.observe(section));
}
