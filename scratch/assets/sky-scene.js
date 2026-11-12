import{Ft as e,Pt as t,Qt as n,W as r,bt as i,en as a,et as o,g as s,mt as c,n as l,rn as u}from"./three.module-i9PMC45e.js";import{a as d,n as f,o as p,r as m}from"./ambient-dynamics-Cdbg4ktG.js";function h(e){let t=e.map(e=>{let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4});return t[0]*.2126+t[1]*.7152+t[2]*.0722}function g(e,t,n){let r=new u(64,48,{depthBuffer:!1,stencilBuffer:!1}),i=new Uint8Array(12288),a=n.closest(`.sky-app`),o=null,s=null,c=-1e9,l={},d=(e,t)=>{l[e]!==t&&(l[e]=t,a.style.setProperty(e,t))},f=null,p=null,m=0,g=0,_=(e,t,n)=>{let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)};return{update(n,a,l,u=1){if(f!==null&&Math.abs(p-f)<1e-4&&!l&&a-c<250)return!1;c=a,e.setRenderTarget(r),e.render(n,t),e.readRenderTargetPixels(r,0,0,64,48,i),e.setRenderTarget(null);let v=0,y=0;for(let e=20;e<48;e+=2)for(let t=2;t<62;t+=2){let n=(e*64+t)*4;v+=h([i[n],i[n+1],i[n+2]]),y++}v/=y;let b=Math.max(0,Math.min(1,(v-.045)/.255)),x=s===null?0:Math.min(.1,(a-s)/1e3);s=a,o=o===null?b:o+(b-o)*(1-Math.exp(-x/.18));let S=u<-.025?0:f===null?+(b>=.43):f===1?b<.4?0:1:+(b>.46);f===null&&(f=S,p=f),S!==f&&(g=p,m=a,f=S);let C=Math.min(1,(a-m)/300);return p=g+(f-g)*_(0,1,C),C>=1&&(p=f),d(`--daylight`,o.toFixed(4)),d(`--theme-blend`,p.toFixed(4)),d(`--theme-midpoint`,(4*p*(1-p)).toFixed(4)),Math.abs(p-f)>1e-4},dispose(){[`--daylight`,`--theme-blend`,`--theme-midpoint`].forEach(e=>a.style.removeProperty(e)),delete a.dataset.themeAudit,r.dispose()}}}var _=new Set,v=`sky-liquid-wake`,y=`varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,b=`
precision highp float;
varying vec2 vUv;
uniform sampler2D skyTexture;
uniform vec2 viewport;
uniform vec4 shapeRect, tint, rim;
uniform float radius, bezel, press, ior, debugMode;
float sdf(vec2 p){vec2 q=abs(p-shapeRect.xy)-shapeRect.zw*.5+radius;return length(max(q,0.))+min(max(q.x,q.y),0.)-radius;}
vec3 linearize(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
vec3 encode(vec3 c){return mix(c*12.92,1.055*pow(max(c,0.),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec2 bend(vec3 n,float index){return refract(vec3(0.,0.,-1.),n,1./index).xy*(32.+press*7.);}
void main(){
 vec2 p=vUv*viewport;float d=sdf(p);if(d>.8)discard;
 float t=clamp(-d/bezel,0.,1.);
 // Convex quartic-root profile. Its derivative reaches zero at the flat interior.
 // A 3px cap height spreads the curvature across the bezel instead of
 // concentrating almost all visible bending in its outermost pixel.
 float slope=pow(1.-t,3.)/pow(max(1.-pow(1.-t,4.),.004),.75)*12./bezel;
 vec2 gradient=vec2(sdf(p+vec2(.5,0.))-sdf(p-vec2(.5,0.)),sdf(p+vec2(0.,.5))-sdf(p-vec2(0.,.5)));
 vec3 normal=normalize(vec3(normalize(gradient+vec2(.00001))*slope,1.));
 vec2 offset=bend(normal,ior);vec2 uv=vUv+offset/viewport;
 vec3 sampleColor;
 sampleColor.r=texture2D(skyTexture,clamp(vUv+bend(normal,ior-.008)/viewport,0.,1.)).r;
 sampleColor.g=texture2D(skyTexture,clamp(uv,0.,1.)).g;
 sampleColor.b=texture2D(skyTexture,clamp(vUv+bend(normal,ior+.008)/viewport,0.,1.)).b;
 vec3 color=linearize(sampleColor);
 color=mix(color,linearize(tint.rgb),tint.a);
 float edge=1.-smoothstep(0.,bezel,-d);
 float fresnel=pow(1.-normal.z,3.);
 float highlight=pow(max(dot(normal,normalize(vec3(-.55,.65,.7))),0.),20.);
 float counter=pow(max(dot(normal,normalize(vec3(.5,-.6,.7))),0.),24.);
 color+=linearize(rim.rgb)*rim.a*(highlight*.28+counter*.09+fresnel*.13)*edge*(1.+press*.2);
 if(debugMode>.5){color=debugMode<1.5?normal*.5+.5:vec3(.5+offset.x/36.,.5+offset.y/36.,0.);gl_FragColor=vec4(color,1.);}
 else gl_FragColor=vec4(encode(color),1.-smoothstep(-.7,.7,d));
}`;function x(e,t){let n=e.match(/[\d.]+/g)?.map(Number);return n?.length>=3?new a(n[0]/255,n[1]/255,n[2]/255,n[3]??1):t}function S(s,l){let d=new u(1,1,{depthBuffer:!1,stencilBuffer:!1,minFilter:r,magFilter:r});d.texture.colorSpace=``;let f={skyTexture:{value:d.texture},viewport:{value:new n},shapeRect:{value:new a},radius:{value:20},bezel:{value:6},press:{value:0},ior:{value:1.5},tint:{value:new a(1,1,1,.045)},rim:{value:new a(1,1,1,.75)},debugMode:{value:new URLSearchParams(location.search).has(`liquidDebug`)?new URLSearchParams(location.search).get(`liquidDebug`)===`displacement`?2:1:0}},p=new e({uniforms:f,vertexShader:y,fragmentShader:b,transparent:!0,depthTest:!1,depthWrite:!1,toneMapped:!1}),m=new i(2,2),h=new t;h.add(new o(m,p));let g=new c(-1,1,1,-1,0,1),v=matchMedia(`(prefers-reduced-motion: reduce)`),S=matchMedia(`(prefers-reduced-transparency: reduce)`),C=[],w=s.getContext(),T=w.getExtension(`EXT_disjoint_timer_query_webgl2`),E=[],D,O=!1,k=!1,A=0,j=0,M=!1;return{draw(e,t,r,i,o){let c=performance.now(),u=[..._].filter(e=>e.visible&&e.element.isConnected&&e.element.classList.contains(`liquid`)),p=l.getBoundingClientRect(),m=u.map(e=>({entry:e,rect:e.element.getBoundingClientRect(),style:getComputedStyle(e.element)})),y=Math.min(.05,A?(r-A)/1e3:1/60);A=r;let b=m.filter(({rect:e})=>e.bottom>0&&e.top<p.height&&e.width>0);if(b.length>8&&!M&&(M=!0,console.warn(`Liquid glass: more than eight visible shapes; review frame cost.`)),!b.length||S.matches||document.hidden){for(let{entry:e}of m)e.element.dataset.liquidMode=`fallback`;return!1}let N=s.getDrawingBufferSize(new n);D&&w.getQueryParameter(D,w.QUERY_RESULT_AVAILABLE)&&(w.getParameter(T.GPU_DISJOINT_EXT)||E.push(w.getQueryParameter(D,w.QUERY_RESULT)/1e6),E.length>120&&E.shift(),w.deleteQuery(D),D=null);let P=T&&!D?w.createQuery():null;P&&w.beginQuery(T.TIME_ELAPSED_EXT,P);let F=Math.max(1,Math.ceil(N.x/2)),I=Math.max(1,Math.ceil(N.y/2));if((d.width!==F||d.height!==I)&&(d.setSize(F,I),O=!1,k=!1),!O||i||!o&&!k){if(s.setRenderTarget(d),o){let e=Math.max(0,Math.min(...b.map(e=>e.rect.left-p.left))-40),t=Math.min(p.width,Math.max(...b.map(e=>e.rect.right-p.left))+40),n=Math.max(0,Math.min(...b.map(e=>e.rect.top-p.top))-40),r=Math.min(p.height,Math.max(...b.map(e=>e.rect.bottom-p.top))+40);s.setScissor(Math.floor(e/p.width*F),Math.floor((p.height-r)/p.height*I),Math.ceil((t-e)/p.width*F),Math.ceil((r-n)/p.height*I)),s.setScissorTest(!0)}s.render(e,t),s.setScissorTest(!1),s.setRenderTarget(null),k=!o,O=!0,j++}f.viewport.value.set(p.width,p.height);let L=s.autoClear;s.autoClear=!1;let R=!1;for(let{entry:e,rect:t,style:n}of b){let i=t.left+t.width/2,o=e.lastRect?Math.abs(i-e.lastRect)/Math.max(y,.001):0,c=v.matches?1:1+Math.min(.08,o/5e3);e.stretch+=(c-e.stretch)*(1-Math.exp(-y/.07)),e.velocity+=(e.press-e.velocity)*(1-Math.exp(-y/.06));let l=v.matches?1:1-e.velocity*.025;e.lastRect=i,f.shapeRect.value.set(i-p.left,p.height-(t.top-p.top+t.height/2),t.width*e.stretch*l,t.height/e.stretch*l),f.radius.value=Math.min(parseFloat(n.borderRadius)||20,t.height/2),f.bezel.value=e.options.bezel??6,f.ior.value=e.options.ior??1.5,f.press.value=e.velocity,f.tint.value.copy(x(n.getPropertyValue(`--liquid-tint`),new a(1,1,1,.045))),f.rim.value.copy(x(n.getPropertyValue(`--liquid-rim`),new a(1,1,1,.75)));let u=f.shapeRect.value,d=s.getPixelRatio(),m=N.x/p.width/d,_=N.y/p.height/d;s.setScissor(Math.floor((u.x-u.z/2-2)*m),Math.floor((u.y-u.w/2-2)*_),Math.ceil((u.z+4)*m),Math.ceil((u.w+4)*_)),s.setScissorTest(!0),s.render(h,g),e.element.dataset.liquidMode!==`webgl`&&(e.element.dataset.liquidMode=`webgl`),R||=r<(e.movingUntil??0)||Math.abs(e.stretch-1)>.001||Math.abs(e.velocity-e.press)>.001}return s.setScissorTest(!1),s.autoClear=L,P&&(w.endQuery(T.TIME_ELAPSED_EXT),D=P),C.push(performance.now()-c),C.length>120&&C.shift(),l.dataset.liquidStats=JSON.stringify({shapes:b.length,texture:[F,I],textureUpdates:j,cpuMs:C.reduce((e,t)=>e+t,0)/C.length,gpuMs:E.length?E.reduce((e,t)=>e+t,0)/E.length:null}),R},dispose(){for(let e of _)e.element.dataset.liquidMode=`fallback`;d.dispose(),m.dispose(),p.dispose(),delete l.dataset.liquidStats,D&&w.deleteQuery(D)}}}function C(r,a,u,h=!1,y){let b=new l({canvas:r,alpha:!1,antialias:!1,powerPreference:`low-power`});b.setPixelRatio(Math.min(devicePixelRatio,1));let x=new t,C=new c(-1,1,1,-1,0,1),w=g(b,C,r),T,E=!0,D={uTime:{value:0},uDrift:{value:new n},uScrub:{value:0},uWindX:{value:1},uWindY:{value:0},uLow:{value:.35},uMid:{value:.2},uHigh:{value:.15},uWarmth:{value:0},uSeed:{value:0},uAspect:{value:1},uTop:{value:new s},uBottom:{value:new s},uGlow:{value:new s},uCloud:{value:a.cloud},uLight:{value:a.light},uSun:{value:a.sun},uSunX:{value:a.sunX??.72},uMoonLight:{value:a.moonLight??0},uRain:{value:a.rain},uWind:{value:a.wind??5},uWindGust:{value:a.windGust??a.wind??5},uGust:{value:0},uLightning:{value:0},uBoltOrigin:{value:new n(.5,.9)},uBoltSeed:{value:0},uBoltVisible:{value:1}},O=new e({uniforms:D,vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,fragmentShader:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime,uAspect,uCloud,uLight,uSun,uSunX,uMoonLight,uRain,uWind,uWindGust,uGust,uLightning,uScrub,uWindX,uWindY,uLow,uMid,uHigh,uWarmth,uSeed,uBoltSeed,uBoltVisible;
    uniform vec2 uDrift,uBoltOrigin;
    uniform vec3 uTop,uBottom,uGlow;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float value=0.0,weight=.5;for(int i=0;i<5;i++){value+=weight*noise(p);p=mat2(.8,.6,-.6,.8)*p*2.02+vec2(2.7,9.2);weight*=.5;}return value;}
    ${d}
    float segmentDistance(vec2 p,vec2 a,vec2 b){vec2 edge=b-a;return length(p-a-edge*clamp(dot(p-a,edge)/dot(edge,edge),0.0,1.0));}
    void main(){
      vec2 uv=vUv;
      float elevation=smoothstep(0.0,1.0,uv.y);
      vec3 color=mix(uBottom,uTop,elevation);
      vec2 p=vec2(uv.x*uAspect,uv.y);
      float sunDistance=length((p-vec2(uAspect*uSunX,uSun*.7+.08))*vec2(.65,1.0));
      float halo=exp(-sunDistance*sunDistance*3.0)*.22*smoothstep(-.18,.12,uSun)*(1.0-uCloud*.7);
      color=mix(color,uGlow,halo);
      // Broad off-screen daylight bloom follows solar height and azimuth.
      float sunHeight=clamp(uSun/.85,0.0,1.0);
      vec2 incomingLight=normalize(vec2((uSunX-.5)*3.0,.2+sunHeight*1.5));
      float lightDistance=4.0*max(uAspect,1.0);
      vec2 lightOrigin=vec2(uAspect*.5,.5)+incomingLight*lightDistance;
      vec2 lightDelta=(p-lightOrigin)*vec2(.65,1.0);
      float sunshine=smoothstep(.08,.45,uSun)*(1.0-smoothstep(.2,.9,uCloud))*(1.0-uRain);
      float daylightBloom=(.25+.35*uv.y)*sunshine;
      color=mix(color,vec3(.96,.97,1.0),daylightBloom*.12);
      // Advect all layers in a continuous wind field; the time dial adds reversible travel.
      vec2 drift=uDrift+vec2(uScrub,0.0);
      float clearScale=1.0+.45*(1.0-smoothstep(.12,.4,uCloud));
      vec2 cp=vec2(p.x*2.8,p.y*4.2)*clearScale+vec2(uSeed, uSeed*.31);
      float shape=fbm(cp-drift+vec2(4.2,1.8));
      float detail=fbm(cp*2.8-drift*1.2+vec2(9.1,5.3));
      float density=shape+detail*.12;
      // Let sparse low clouds remain visible without changing dense cloud decks.
      float sparseAdjustment=1.0-smoothstep(.2,.7,uCloud);
      float threshold=.64-uCloud*.32+.01*sparseAdjustment;
      float lowPresence=mix(smoothstep(.005,.25,uLow),smoothstep(.005,.18,uLow),sparseAdjustment);
      float cumulus=smoothstep(threshold-.06,threshold+.14,density)*lowPresence;
      float sheet=smoothstep(.24,.7,fbm(cp*vec2(.55,1.4)-drift*.65+19.0))*uMid;
      float wisps=smoothstep(.52,.72,fbm(cp*vec2(.65,3.5)-drift*.4+32.0))*uHigh;
      float cover=1.0-(1.0-cumulus)*(1.0-sheet*.55)*(1.0-wisps*.3);
      float rainDeck=uRain*(.66+.16*noise(cp*vec2(.38,.32)-drift*.2+vec2(7.2,13.1)));
      cover=(1.0-(1.0-cover)*(1.0-rainDeck))*smoothstep(.02,.24,uv.y);
      float storm=clamp(uRain*.8+smoothstep(.7,1.0,uCloud)*.18,0.0,1.0);
      color*=mix(vec3(1.0),vec3(.75,.79,.86),uRain*.55);
      vec3 ambient=color;
      vec3 lit=mix(ambient,vec3(1.0),(.08+.48*uLight)*(1.0-.35*storm));
      vec2 lightDirection=normalize(lightOrigin-p+vec2(.0001));
      float facing=clamp((shape-fbm(cp-drift+vec2(4.2,1.8)+lightDirection*.09))*8.0,0.0,1.0);
      vec3 edgeLight=mix(vec3(1.0,.97,.9),vec3(.98,.99,1.0),smoothstep(.15,.5,uSun));
      lit=mix(lit,edgeLight,facing*sunshine*.14);
      // Low sunlight colors the cloud surface, with cooler shaded interiors.
      float sunsetLight=uWarmth*(1.0-uRain)*smoothstep(-.18,.02,uSun);
      vec3 sunsetEdge=mix(vec3(1.0,.62,.38),vec3(1.0,.78,.48),smoothstep(-.05,.12,uSun));
      lit=mix(lit,sunsetEdge,sunsetLight*(.35+facing*.5)*(.65+detail*.35));
      // Keep the original diffuse lighting, with a restrained night highlight.
      float daylight=smoothstep(.15,.5,uLight);
      vec3 nightCloud=mix(ambient*.7,ambient*1.55+vec3(.025,.035,.055)*(.4+uMoonLight*.6),clamp(.38+detail*.6,0.0,1.0));
      lit=mix(nightCloud,lit,daylight);
      vec3 cloudColor=mix(ambient,lit,mix(.95,clamp(.7+detail*.06,0.0,1.0),daylight));
      float cloudOpacity=mix(.72+uCloud*.23,.4+uCloud*.55,daylight);
      color=mix(color,cloudColor,cover*cloudOpacity);
      // Sample the same drifting cloud field toward the sun. Openings produce
      // a soft fan of shafts; cloud shadows interrupt them without a fixed stripe pattern.
      float transmission=1.0;
      float shafts=0.0;
      vec2 rayDirection=normalize(p-lightOrigin+vec2(.0001));
      for(int sampleIndex=0;sampleIndex<5;sampleIndex++) {
        float travel=.2+float(sampleIndex)*.12;
        vec2 samplePoint=p+incomingLight*travel;
        vec2 sampleCloud=vec2(samplePoint.x*2.8,samplePoint.y*4.2)*clearScale+vec2(uSeed,uSeed*.31);
        float sampleDensity=fbm(sampleCloud-drift+vec2(4.2,1.8));
        float obstruction=smoothstep(threshold-.06,threshold+.14,sampleDensity)*lowPresence;
        transmission*=1.0-obstruction*.85;
        shafts+=transmission/5.0;
      }
      // Angular variation makes separate soft shafts readable at portfolio scale.
      // Their apertures drift with the cloud field and remain attenuated by its shadows.
      vec2 acrossLight=vec2(incomingLight.y,-incomingLight.x);
      float transverse=dot(rayDirection,acrossLight)*lightDistance;
      // A continuous aperture field varies width, spacing and strength as clouds
      // travel; there is no fixed number of beams or repeating three-slot pattern.
      float lightField=noise(vec2(transverse*3.6+uSeed,drift.x*.65+uSeed*.3))*.7
        +noise(vec2(transverse*8.3+uSeed*.7,drift.y*.45+7.0))*.3;
      // Each angular opening has its own evolving lifetime, reach and softness.
      // Cloud travel (including dial travel) reshapes them instead of rotating
      // a uniform mask with an identical full-screen extent.
      float aperturePhase=uTime*.045+dot(drift,vec2(.32,.19));
      float life=noise(vec2(transverse*2.7+uSeed+41.0,aperturePhase+11.0));
      float reach=noise(vec2(transverse*4.1+uSeed+73.0,aperturePhase*.73+29.0));
      float softness=noise(vec2(transverse*5.8+uSeed,aperturePhase*.51+53.0));
      float rayMask=smoothstep(.34+softness*.1,.68+softness*.08,lightField)
        *smoothstep(.25,.68,life);
      // Distance from the frame's sun-facing edge, with different lengths per
      // opening. Soft tails avoid the straight edge of a rectangular overlay.
      float travelIntoSky=dot(p-vec2(uAspect*.5,1.0),-incomingLight);
      float rayLength=.25+reach*1.65;
      float lengthFade=1.0-smoothstep(rayLength*.35,rayLength,travelIntoSky);
      rayMask*=lengthFade;
      float brokenClouds=smoothstep(.02,.1,uCloud)*(1.0-smoothstep(.65,.94,uCloud));
      float shaftStrength=smoothstep(-.02,.1,uSun)*brokenClouds*(1.0-uRain)*(.27+uWarmth*.08);
      float shaftDistance=.55+.25*uv.y;
      vec3 shaftColor=mix(vec3(.94,.97,1.0),vec3(1.0,.86,.67),uWarmth);
      color=mix(color,shaftColor,rayMask*shafts*shaftStrength*shaftDistance*(1.0-cover*.7));
      // Rain: shared with the footer meadow (rain-field.js).
      color=mix(color,rainColor(uLight),rainStreaks(p,uTime,uRain,uWind,uWindX,uGust,uSeed));
      // In-cloud illumination carries the flash; a fine, irregular channel is
      // visible only on some strikes, mostly veiled by the illuminated cloud.
      if(uLightning>.001){
        vec2 local=vec2((uv.x-uBoltOrigin.x)*uAspect,uv.y-uBoltOrigin.y);
        float cloudFlash=exp(-length(local*vec2(.65,1.35)-vec2(0.0,-.08))*4.4);
        float cloudTexture=.62+.38*fbm(cp*1.15-drift*.7+uBoltSeed);
        color+=vec3(.54,.63,.83)*cloudFlash*cloudTexture*uLightning*(.16+.36*cover);
        float channel=10.0;
        vec2 previous=vec2(0.0,0.0);
        for(int i=1;i<=16;i++){
          float stepIndex=float(i);
          float bend=(hash(vec2(floor(stepIndex/3.0),uBoltSeed))-.5)*.085;
          float fine=(hash(vec2(stepIndex,uBoltSeed+17.0))-.5)*.022;
          vec2 next=vec2(bend+fine+stepIndex*.002*sin(uBoltSeed),-stepIndex*.021);
          channel=min(channel,segmentDistance(local,previous,next));
          if(i==7 || i==11){
            float direction=hash(vec2(uBoltSeed,stepIndex))>.5?1.0:-1.0;
            vec2 branch=next+vec2(direction*(.035+.045*hash(vec2(stepIndex,uBoltSeed+3.0))),-.045);
            channel=min(channel,segmentDistance(local,next,branch));
          }
          previous=next;
        }
        float fineCore=1.0-smoothstep(.0002,.0009,channel);
        float scattered=exp(-channel*120.0)*.08;
        float veil=(.22+.68*cover)*uBoltVisible*uLightning;
        color=mix(color,vec3(.87,.91,.99),clamp((fineCore*.42+scattered)*veil,0.0,1.0));
      }
      float darkness=1.0-smoothstep(.15,.5,uLight);
      vec2 starUV=p*135.0;
      vec2 starCell=floor(starUV);
      vec2 starPosition=vec2(hash(starCell+3.1),hash(starCell+9.7));
      float starDistance=length(fract(starUV)-starPosition);
      float star=step(.992,hash(starCell))*exp(-starDistance*starDistance*190.0);
      float twinkle=.7+.3*sin(uTime*.65+hash(starCell)*45.0);
      float starVisibility=(1.0-smoothstep(.12,.65,cover))*(1.0-smoothstep(.82,.98,uCloud));
      color+=vec3(.82,.9,1.0)*star*twinkle*darkness*starVisibility*1.25;
      color+=(hash(gl_FragCoord.xy)-.5)*.006;
      gl_FragColor=vec4(color,1.0);
    }`}),k=new i(2,2);x.add(new o(k,O));let A=[[`top`,`uTop`],[`bottom`,`uBottom`],[`glow`,`uGlow`]],j=[[`moonLight`,`uMoonLight`],[`windGust`,`uWindGust`],[`sunX`,`uSunX`],[`cloud`,`uCloud`],[`light`,`uLight`],[`sun`,`uSun`],[`rain`,`uRain`],[`wind`,`uWind`],[`windX`,`uWindX`],[`windY`,`uWindY`],[`lowCloud`,`uLow`],[`midCloud`,`uMid`],[`highCloud`,`uHigh`],[`warmth`,`uWarmth`],[`seed`,`uSeed`],[`scrub`,`uScrub`]],M={},N=!1,P=!1,F=a.hour,I=0,L=0,R=!0,z=u,B=h,V=0,H=0,U=(a.windX??1)<0?-1:1,ee=()=>Math.random()<.22?9+Math.random()*5:12+Math.min(58,-Math.log(1-Math.random())*22),W=0,G=4+Math.random()*9,K=-1;function te(){D.uBoltOrigin.value.set(.22+Math.random()*.56,.82+Math.random()*.13),D.uBoltSeed.value=Math.random()*1e3,D.uBoltVisible.value=+(Math.random()>.68)}let q=(e,t,n)=>e>=t&&e<t+n?Math.sin(Math.PI*(e-t)/n):0,J=.65;function ne(e){let t=B?1:1-Math.exp(-e/J),n=0;for(let[,e]of A){let r=D[e].value,i=M[e];r.lerp(i,t),n=Math.max(n,Math.abs(r.r-i.r),Math.abs(r.g-i.g),Math.abs(r.b-i.b))}for(let[,e]of j){let r=D[e].value,i=M[e];D[e].value=r+(i-r)*t,n=Math.max(n,Math.abs(D[e].value-i))}if(P=n>.001,!P){for(let[,e]of A)D[e].value.copy(M[e]);for(let[,e]of j)D[e].value=M[e]}}let Y=new n,X=0,Z=0,re=()=>{Z=performance.now()+160};window.addEventListener(`scroll`,re,{passive:!0});function Q(e){if(L=0,!R)return;let t=e<Z?1e3/12:1e3/30;if(!P&&X&&e-X<t-2){L=requestAnimationFrame(Q);return}X=e;let n=V?Math.min((e-V)/1e3,.1):1/60;if(V=e,!z&&!B){H+=n;let e=f({wind:D.uWind.value,windGust:D.uWindGust.value,seed:D.uSeed.value});D.uGust.value=e.swell,Math.abs(D.uWindX.value)>.15&&(U=Math.sign(D.uWindX.value));let t=.035+Math.min(e.speed,80)*8e-4;if(D.uDrift.value.x+=n*t*U,D.uRain.value>.55){W+=n,W>=G&&(K=W,G=W+ee(),te(),y?.());let e=W-K;D.uLightning.value=Math.max(q(e,0,.12),q(e,.19,.15)*.5)}else W>0&&(G=4+Math.random()*9),W=0,K=-1,D.uLightning.value=0}else D.uLightning.value=0;let i=P;P&&ne(n),D.uTime.value=H,Object.assign(p,{time:H,rain:D.uRain.value,wind:D.uWind.value,windX:D.uWindX.value,gust:D.uGust.value,seed:D.uSeed.value,light:D.uLight.value,aspect:D.uAspect.value});let a=w.update(x,e,i,D.uSun.value),o=z||B?0:m();if(o>0){b.getSize(Y);let e=Math.min(Y.y,o*Y.y/r.clientHeight);b.setScissor(0,e,Y.x,Y.y-e),b.setScissorTest(!0)}b.render(x,C),o>0&&b.setScissorTest(!1);let s=!1;_.size?(T??=S(b,r),s=T.draw(x,C,e,E||i||!z&&!B,!z&&!B),E=!1):T&&=(T.dispose(),null),(!z&&!B||P||a||s)&&!document.hidden&&(L=requestAnimationFrame(Q))}function $(){!L&&R&&!document.hidden&&(V=0,L=requestAnimationFrame(Q))}function ie(e){if(E=!0,e.previewHour!=null&&F!=null&&!z&&!B){let t=e.previewHour-F;t>12&&(t-=24),t<-12&&(t+=24),I+=t*.14}F=e.hour,J=e.ease??.65,e={...e,scrub:I};for(let[t,n]of A)M[n]=new s(e[t]).convertLinearToSRGB(),(!N||B)&&D[n].value.copy(M[n]);for(let[t,n]of j)M[n]=e[t]??0,(!N||B)&&(D[n].value=M[n]);P=N&&!B,N=!0,$()}let ae=new ResizeObserver(()=>{let e=r.getBoundingClientRect(),t=Math.min(1,1280/e.width)*(e.width<700?.65:1);b.setSize(e.width*t,e.height*t,!1),D.uAspect.value=e.width/e.height,E=!0,$()});ae.observe(r);function oe(){cancelAnimationFrame(L),L=0,document.hidden||$()}return document.addEventListener(`visibilitychange`,oe),window.addEventListener(v,$),ie(a),{update:ie,pause(e,t=!1){z=e,B=t,cancelAnimationFrame(L),L=0,$()},dispose(){R=!1,cancelAnimationFrame(L),ae.disconnect(),document.removeEventListener(`visibilitychange`,oe),window.removeEventListener(`scroll`,re),window.removeEventListener(v,$),T?.dispose(),k.dispose(),O.dispose(),w.dispose(),b.dispose()}}}export{C as createSky};