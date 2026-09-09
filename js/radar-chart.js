(function(){
  const SVG_NS='http://www.w3.org/2000/svg';
  function polar(cx,cy,r,a){return [cx+r*Math.cos(a),cy+r*Math.sin(a)]}
  function el(name,attrs){const e=document.createElementNS(SVG_NS,name);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));return e}
  function draw(target,values,opts={}){
    const svg=typeof target==='string'?document.getElementById(target):target;
    if(!svg)return;
    const dims=window.RADAR_DATA.dimensions, n=dims.length, size=560, cx=size/2, cy=size/2, R=196;
    svg.setAttribute('viewBox',`0 0 ${size} ${size}`); svg.setAttribute('role','img'); svg.setAttribute('aria-label','Roda de Evolução com oito dimensões'); svg.innerHTML='';
    const title=el('title'); title.textContent='Roda de Evolução'; svg.appendChild(title);
    const desc=el('desc'); desc.textContent='Visualização das oito dimensões em uma escala de 0 a 10.'; svg.appendChild(desc);
    const bands=[10,8,6,4,2];
    bands.forEach(v=>{
      let pts=''; for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n,p=polar(cx,cy,R*v/10,a);pts+=p.join(',')+' '}
      svg.appendChild(el('polygon',{points:pts,fill:v===10?'#fbfaf6':'none',stroke:'#ded7c5','stroke-width':v===10?1.5:1}));
    });
    for(let i=0;i<n;i++){
      const a=-Math.PI/2+i*2*Math.PI/n, p=polar(cx,cy,R,a), lp=polar(cx,cy,R+54,a);
      svg.appendChild(el('line',{x1:cx,y1:cy,x2:p[0],y2:p[1],stroke:'#e3dcc9','stroke-width':1}));
      const t=el('text',{x:lp[0],y:lp[1],fill:'#4e4a42','font-size':(window.innerWidth<650?12:13),'font-weight':'700','text-anchor':'middle','dominant-baseline':'middle'});
      t.textContent=dims[i].short; svg.appendChild(t);
    }
    // scale labels
    [2,5,8,10].forEach(v=>{
      const t=el('text',{x:cx+8,y:cy-R*v/10+4,fill:'#aaa18e','font-size':'10'}); t.textContent=v; svg.appendChild(t);
    });
    const vals=dims.map(d=>Math.max(0,Math.min(10,Number(values[d.id]||0))));
    let pts=''; vals.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,p=polar(cx,cy,R*v/10,a);pts+=p.join(',')+' '});
    const area=el('polygon',{points:pts,fill:'rgba(214,180,61,.28)',stroke:'#a78416','stroke-width':4,'stroke-linejoin':'round'}); svg.appendChild(area);
    vals.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,p=polar(cx,cy,R*v/10,a);svg.appendChild(el('circle',{cx:p[0],cy:p[1],r:5.5,fill:'#171717',stroke:'#f1db7b','stroke-width':2}));});
    svg.appendChild(el('circle',{cx,cy,r:33,fill:'#151515',stroke:'#d6b43d','stroke-width':2}));
    const score=Number(opts.overall||0).toFixed(1).replace('.',',');
    const centerText=el('text',{x:cx,y:cy-2,fill:'#f1db7b','font-size':'23','font-family':'Georgia,serif','font-weight':'700','text-anchor':'middle'});centerText.textContent=score;svg.appendChild(centerText);
    const centerSub=el('text',{x:cx,y:cy+18,fill:'#bdb7a8','font-size':'9','font-weight':'800','text-anchor':'middle','letter-spacing':'1.3'});centerSub.textContent='ÍNDICE';svg.appendChild(centerSub);
    if(opts.animate!==false){area.style.opacity='0'; area.style.transition='opacity .7s ease'; requestAnimationFrame(()=>area.style.opacity='1');}
  }
  window.RadarChart={draw};
})();
