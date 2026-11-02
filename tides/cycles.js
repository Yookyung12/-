/* 조석 주기·조차·일주조·반일주조·혼합조: 교육용 개념 모형 */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const T=24+50/60, PI=Math.PI,TAU=2*PI;
let mode='semi';
const fmtTime=h=>{const m=Math.round(h*60);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const ctx=id=>$(id).getContext('2d');
function canvasBg(g,w,h){g.fillStyle='#eaf7fa';g.fillRect(0,0,w,h)}
function circle(g,x,y,r,fill,stroke){g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}}
function line(g,x,y,X,Y,color='#a2c2d0',width=1){g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.strokeStyle=color;g.lineWidth=width;g.stroke()}
function txt(g,s,x,y,color='#255e79',size=16,align='left'){g.fillStyle=color;g.font='700 '+size+'px system-ui, sans-serif';g.textAlign=align;g.fillText(s,x,y)}
function drawCycleEarth(){
 const g=ctx('cycleEarthCanvas'),w=820,h=375,t=+$('cycleTime').value;
 canvasBg(g,w,h);
 const cx=318,cy=177,R=102,a=PI/2-TAU*t/T;
 g.save();g.translate(cx,cy);g.beginPath();g.ellipse(0,0,R+32,R+7,0,0,TAU);g.fillStyle='#8ddcf3';g.fill();g.strokeStyle='#40afd5';g.lineWidth=3;g.stroke();g.restore();
 const e=g.createRadialGradient(cx-35,cy-45,6,cx,cy,R);e.addColorStop(0,'#bceefa');e.addColorStop(1,'#1b8dbd');
 circle(g,cx,cy,R,e,'#eefcff');
 line(g,cx+R,cy,cx+232,cy,'#6f9bae',2);circle(g,cx+262,cy,23,'#a6b3c1','#ffffff');
 txt(g,'달',cx+262,cy-34,'#435d70',16,'center');
 txt(g,'높은 수위',cx+R+22,cy-28,'#16769d',14,'center');
 txt(g,'높은 수위',cx-R-25,cy-28,'#16769d',14,'center');
 const px=cx+(R+3)*Math.cos(a),py=cy+(R+3)*Math.sin(a);
 circle(g,px,py,12,'#ffcd76','#a66a20');circle(g,px,py,4,'#ffffff');
 txt(g,'관측섬',px+(Math.cos(a)>0?18:-18),py-18,'#8c5e23',15,Math.cos(a)>0?'left':'right');
 g.save();g.translate(cx,cy);g.beginPath();g.arc(0,0,R+46,PI*.18,PI*.44);g.strokeStyle='#df9450';g.lineWidth=4;g.stroke();g.restore();
 txt(g,'지구 자전 방향 ↺',20,30,'#1686a3',17);
 txt(g,'실제 해안별 조석은 지형 등의 영향으로 다릅니다',20,347,'#426f83',14);
 const val=-Math.cos(4*PI*t/T);
 $('cyclePhase').textContent=val>.75?'만조':val<-.75?'간조':'중간 수위';
 $('cycleTimeRead').textContent=fmtTime(t);
 $('cycleExplain').textContent=(val>.75?'관측섬이 달 방향 또는 그 반대 방향의 높은 수위 영역에 있습니다.':val<-.75?'관측섬이 달과 직각을 이루는 낮은 수위 영역에 있습니다.':'관측섬이 만조와 간조 사이의 영역을 이동하고 있습니다.')+' 이상적인 반일주조에서는 약 12시간 25분마다 만조가 다시 나타납니다.';
 drawCycleGraph(t);
}
function drawCycleGraph(t){
 const g=ctx('cycleTimeCanvas'),w=820,h=300,l=57,r=795,top=50,bottom=247;
 canvasBg(g,w,h);const y=v=>148-82*v,x=q=>l+q/T*(r-l);
 line(g,l,148,r,148,'#6b91a6',2);line(g,l,top,l,bottom,'#6b91a6',2);
 for(const q of [0,T/4,T/2,3*T/4,T]){
  line(g,x(q),top,x(q),bottom,'#b9dbe7');
  txt(g,fmtTime(q),x(q),282,'#416478',14,'center');
 }
 txt(g,'높은 수위',l+8,35,'#267d9a',14);
 g.beginPath();for(let i=0;i<=450;i++){const q=i*T/450;const X=x(q),Y=y(-Math.cos(4*PI*q/T));i?g.lineTo(X,Y):g.moveTo(X,Y)}
 g.strokeStyle='#e86b4f';g.lineWidth=4;g.stroke();
 for(let i=1;i<=3;i++){const q=i*T/4;circle(g,x(q),y(-Math.cos(4*PI*q/T)),6,i%2===1?'#dd8a35':'#207f9f','#fff');txt(g,i%2===1?'만조':'간조',x(q),y(-Math.cos(4*PI*q/T))+(i%2===1?-12:26),'#386178',13,'center')}
 line(g,x(t),top,x(t),bottom,'#197c9c',2);
 circle(g,x(t),y(-Math.cos(4*PI*t/T)),8,'#ffbe59','#ffffff');
 txt(g,'현재 '+fmtTime(t),Math.min(725,Math.max(100,x(t))),18,'#17698b',17,'center');
}
function level(which,t,scale,decl){
 const phase=TAU*t/T;
 if(which==='diurnal')return scale*1.35*Math.cos(phase);
 if(which==='semi')return scale*1.25*Math.cos(2*phase);
 return scale*(1.25*Math.cos(2*phase)+.75*(decl/28)*Math.cos(phase-.75));
}
function sampleExtrema(which,scale,decl){
 const n=720,y=i=>level(which,((i+n)%n)*T/n,scale,decl),ext=[];
 for(let i=0;i<n;i++){
  const v=y(i),p=y(i-1),q=y(i+1);
  if(v>=p&&v>q)ext.push({type:'high',t:i*T/n,v});
  if(v<=p&&v<q)ext.push({type:'low',t:i*T/n,v});
 }
 return ext.sort((a,b)=>a.t-b.t);
}
function drawTypeChart(id,which,mini=false){
 const g=ctx(id),w=g.canvas.width,h=g.canvas.height,scale=+$('tidalAmplitude').value,decl=+$('tidalDeclination').value;
 g.clearRect(0,0,w,h);g.fillStyle=mini?'#f3fafc':'#edf8fb';g.fillRect(0,0,w,h);
 const left=mini?11:55,right=w-(mini?11:23),top=mini?10:42,bottom=h-(mini?12:52);
 const x=t=>left+t/T*(right-left),y=v=>top+(bottom-top)*(5.4-v)/10.8;
 if(!mini){for(const v of [-4,-2,0,2,4]){line(g,left,y(v),right,y(v),'#cae0e9');txt(g,String(v),left-10,y(v)+5,'#5d8496',13,'right')}
 txt(g,'가상 수위 (m)',left,21,'#236f90',16);
 for(const v of [0,T/4,T/2,3*T/4,T]){line(g,x(v),top,x(v),bottom,'#c2dce5');txt(g,fmtTime(v),x(v),h-21,'#4b6c7b',13,'center')}}
 else line(g,left,y(0),right,y(0),'#c5dbe3',1);
 g.beginPath();for(let i=0;i<=480;i++){const q=T*i/480;const X=x(q),Y=y(level(which,q,scale,decl));i===0?g.moveTo(X,Y):g.lineTo(X,Y)}
 g.strokeStyle='#e76b4b';g.lineWidth=mini?3:4;g.stroke();
 if(!mini){const extrema=sampleExtrema(which,scale,decl);for(const e of extrema){circle(g,x(e.t),y(e.v),5,e.type==='high'?'#d99d40':'#187c9c','#ffffff');txt(g,e.type==='high'?'만조':'간조',x(e.t),y(e.v)+(e.type==='high'?-12:23),'#365a6b',13,'center')}}
}
function updateTypes(){
 const sc=+$('tidalAmplitude').value,decl=+$('tidalDeclination').value;
 $('tidalAmplitudeRead').textContent=sc.toFixed(1)+'배';$('tidalDeclinationRead').textContent=decl+'°';
 const names={diurnal:'일주조',semi:'반일주조',mixed:'혼합조'},counts={diurnal:1,semi:2,mixed:2};
 $('typeName').textContent=names[mode];$('typeHighs').textContent=counts[mode]+'회';$('typeLows').textContent=counts[mode]+'회';
 document.querySelectorAll('[data-tide-mode]').forEach(b=>{const active=b.dataset.tideMode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 const explanations={diurnal:'일주조는 태음일 동안 만조가 1회, 간조가 1회 나타나는 형태입니다.',semi:'반일주조는 태음일 동안 만조 2회·간조 2회이며 높이도 비교적 비슷합니다.',mixed:'혼합조는 태음일 동안 만조 2회·간조 2회이지만 연속되는 만조나 간조의 높이가 다릅니다.'};
 $('typeExplanation').textContent=explanations[mode]+(mode==='mixed'?' 적위 슬라이더를 0°로 바꾸면 모형의 높이 차이가 작아집니다. 실제 차이는 위도·해역 조건에도 좌우됩니다.':'');
 const ext=sampleExtrema(mode,sc,decl),pairs=[];
 for(let i=0;i<ext.length;i++)if(ext[i].type==='high'){const low=ext.slice(i+1).concat(ext.slice(0,i+1)).find(x=>x.type==='low');if(low)pairs.push((ext[i].v-low.v).toFixed(2))}
 $('tidalRangeResult').textContent='조차 = 연속된 만조와 간조 사이의 높이 차. 현재 모형의 만조→다음 간조 조차: '+pairs.map((n,i)=>(i+1)+'회차 '+n+'m').join(' · ')+(mode==='mixed'&&decl===0?' (적위 0°에서는 높이 차이가 사라지는 단순화 모형)':'');
 drawTypeChart('tideTypeCanvas',mode);
 drawTypeChart('tideMiniDiurnal','diurnal',true);
 drawTypeChart('tideMiniSemi','semi',true);
 drawTypeChart('tideMiniMixed','mixed',true);
}
function feedback(id,v,correct,explanation){
 const el=$(id);const ok=v===correct;el.className='answer show '+(ok?'good':'bad');el.textContent=!v?'먼저 답을 선택하세요.':(ok?'✓ 정답! ':'다시 생각해 보세요. ')+explanation;
}
$('cycleTime').addEventListener('input',drawCycleEarth);
document.querySelectorAll('[data-cycle-hour]').forEach(b=>b.addEventListener('click',()=>{$('cycleTime').value=b.dataset.cycleHour;drawCycleEarth()}));
document.querySelectorAll('[data-tide-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.tideMode;updateTypes()}));
$('tidalAmplitude').addEventListener('input',updateTypes);
$('tidalDeclination').addEventListener('input',updateTypes);
$('cycleCheck').addEventListener('click',()=>feedback('cycleFeedback',$('cyclePick').value,'12','이상적인 반일주조에서 만조 사이의 간격은 약 12시간 25분입니다.'));
$('typeCheck').addEventListener('click',()=>feedback('typeFeedback',$('typePick').value,'mixed','두 번의 만조와 간조가 나타나지만 높이가 뚜렷하게 다르면 혼합조입니다.'));
drawCycleEarth();updateTypes();
})();