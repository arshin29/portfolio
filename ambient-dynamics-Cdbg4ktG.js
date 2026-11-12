var e={time:0,rain:0,wind:5,windX:1,gust:0,seed:0,light:1,aspect:1},t=`
float rainHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float rainStreaks(vec2 p,float time,float rain,float wind,float windX,float gust,float seed){
  float windLean=clamp(wind*.009,0.0,.38);
  float gustLean=gust*(.12+.11*min(wind/30.0,1.0));
  float windSign=windX < -.08 ? -1.0 : 1.0;
  float amount=0.0;
  for(int layer=0;layer<2;layer++){
    float depth=float(layer);
    float sway=sin(time*.62+depth*.8+seed)*.028;
    float slant=clamp(windSign*(windLean*max(abs(windX),.38)+gustLean)+sway,-.48,.48);
    vec2 rp=vec2((p.x-p.y*slant)*(105.0+depth*62.0),p.y*(7.0+depth*4.0));
    float column=floor(rp.x);
    float speed=2.5+rainHash(vec2(column,depth+7.0))*2.5;
    float phase=fract(rp.y+time*speed+rainHash(vec2(column,depth)));
    float center=.2+rainHash(vec2(column,depth+3.0))*.6;
    float width=.025+depth*.018;
    float streak=(1.0-smoothstep(width,width*2.0,abs(fract(rp.x)-center)));
    streak*=smoothstep(.0,.025,phase)*(1.0-smoothstep(.12,.25,phase));
    streak*=step(rainHash(vec2(column,depth+11.0)),rain*.8);
    amount=max(amount,streak*rain*(.23+depth*.15));
  }
  return amount;
}
// Rain catches less light at night, so it dims with the sky.
vec3 rainColor(float light){return vec3(.72,.80,.87)*(.42+.58*clamp(light,0.0,1.0));}
`,n={canvas:null,opaque:0};function r(e,t){n.canvas=e,n.opaque=t}function i(e=24){if(!n.canvas||n.opaque<=0)return 0;let t=n.canvas.getBoundingClientRect(),r=window.innerHeight;if(t.bottom<r-1)return 0;let i=t.bottom-t.height*n.opaque+e;return Math.max(0,Math.min(r,r-i))}var a=(e,t=0,n=1)=>Math.max(t,Math.min(n,e)),o=(e,t,n)=>{let r=a((n-e)/(t-e));return r*r*(3-2*r)};function s(e){let t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)}function c(e,t){let n=Math.floor(e),r=e-n,i=r*r*(3-2*r);return s(n+t)*(1-i)+s(n+1+t)*i}function l(e,t=Date.now()/1e3){let n=a(e.wind??5,0,100),r=Math.max(n,a(e.windGust??n,0,130)),i=a((n+(r-n)*.55)/45),s=e.seed??0,l=t*(.018+i*.042),u=c(l,s)*.6+c(l*2.17,s+31)*.28+c(l*.43,s+71)*.12,d=o(.62-i*.32,.89-i*.12,u);return{swell:d,speed:n*(.45+u*.55)+(r-n)*d,breeze:.035+a(n/4)*(.025+.04*d),rain:.72+c(t*.014,s+103)*.22}}function u(e){let t=e.solarAltitude??(e.light<.3?-20:30),n=t<-6,r=e.polar||(e.temperature??20)<8,i=t>=-6&&t<12&&e.solarRising!==!1,o=1-a((e.wind??5)/55);return{birds:!n&&!r?.14*(1-a(e.cloud??0)*.45)*o:0,night:n&&!r?.12*o:0,dawn:i}}export{t as a,r as i,l as n,e as o,i as r,u as t};