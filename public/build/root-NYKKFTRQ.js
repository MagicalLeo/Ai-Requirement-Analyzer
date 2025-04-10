import{a as S,b as Q}from"/build/_shared/chunk-HELHTMFW.js";import{a as pt,b as x,c as $,e as V,g as Y,i as L,k as H,l as R,m as _,n as Z,p as J,r as K,s as A}from"/build/_shared/chunk-ZQE4YJGD.js";var nt=pt((we,it)=>{it.exports={}});var W="/build/_assets/tailwind-DAVZ3RER.css";var T=x($(),1),C=x($(),1),v=x($(),1);var mt={data:""},gt=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||mt;var wt=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,bt=/\/\*[^]*?\*\/|  +/g,X=/\n+/g,k=(t,e)=>{let a="",i="",s="";for(let r in t){let n=t[r];r[0]=="@"?r[1]=="i"?a=r+" "+n+";":i+=r[1]=="f"?k(n,r):r+"{"+k(n,r[1]=="k"?"":e)+"}":typeof n=="object"?i+=k(n,e?e.replace(/([^,])+/g,o=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,o):o?o+" "+d:d)):r):n!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=k.p?k.p(r,n):r+":"+n+";")}return a+(e&&s?e+"{"+s+"}":s)+i},y={},G=t=>{if(typeof t=="object"){let e="";for(let a in t)e+=a+G(t[a]);return e}return t},ht=(t,e,a,i,s)=>{let r=G(t),n=y[r]||(y[r]=(d=>{let p=0,c=11;for(;p<d.length;)c=101*c+d.charCodeAt(p++)>>>0;return"go"+c})(r));if(!y[n]){let d=r!==t?t:(p=>{let c,f,h=[{}];for(;c=wt.exec(p.replace(bt,""));)c[4]?h.shift():c[3]?(f=c[3].replace(X," ").trim(),h.unshift(h[0][f]=h[0][f]||{})):h[0][c[1]]=c[2].replace(X," ").trim();return h[0]})(t);y[n]=k(s?{["@keyframes "+n]:d}:d,a?"":"."+n)}let o=a&&y.g?y.g:null;return a&&(y.g=y[n]),((d,p,c,f)=>{f?p.data=p.data.replace(f,d):p.data.indexOf(d)===-1&&(p.data=c?d+p.data:p.data+d)})(y[n],e,i,o),n},ft=(t,e,a)=>t.reduce((i,s,r)=>{let n=e[r];if(n&&n.call){let o=n(a),d=o&&o.props&&o.props.className||/^go/.test(o)&&o;n=d?"."+d:o&&typeof o=="object"?o.props?"":k(o,""):o===!1?"":o}return i+s+(n??"")},"");function D(t){let e=this||{},a=t.call?t(e.p):t;return ht(a.unshift?a.raw?ft(a,[].slice.call(arguments,1),e.p):a.reduce((i,s)=>Object.assign(i,s&&s.call?s(e.p):s),{}):a,gt(e.target),e.g,e.o,e.k)}var tt,U,q,ie=D.bind({g:1}),g=D.bind({k:1});function et(t,e,a,i){k.p=e,tt=t,U=a,q=i}function b(t,e){let a=this||{};return function(){let i=arguments;function s(r,n){let o=Object.assign({},r),d=o.className||s.className;a.p=Object.assign({theme:U&&U()},o),a.o=/ *go\d+/.test(d),o.className=D.apply(a,i)+(d?" "+d:""),e&&(o.ref=n);let p=t;return t[0]&&(p=o.as||t,delete o.as),q&&p[0]&&q(o),tt(p,o)}return e?e(s):s}}var z=x($(),1);var N=x($(),1),ut=t=>typeof t=="function",F=(t,e)=>ut(t)?t(e):t,xt=(()=>{let t=0;return()=>(++t).toString()})(),rt=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");t=!e||e.matches}return t}})(),yt=20,at=(t,e)=>{switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,yt)};case 1:return{...t,toasts:t.toasts.map(r=>r.id===e.toast.id?{...r,...e.toast}:r)};case 2:let{toast:a}=e;return at(t,{type:t.toasts.find(r=>r.id===a.id)?1:0,toast:a});case 3:let{toastId:i}=e;return{...t,toasts:t.toasts.map(r=>r.id===i||i===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return e.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(r=>r.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let s=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+s}))}}},P=[],j={toasts:[],pausedAt:void 0},E=t=>{j=at(j,t),P.forEach(e=>{e(j)})},vt={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},kt=(t={})=>{let[e,a]=(0,T.useState)(j),i=(0,T.useRef)(j);(0,T.useEffect)(()=>(i.current!==j&&a(j),P.push(a),()=>{let r=P.indexOf(a);r>-1&&P.splice(r,1)}),[]);let s=e.toasts.map(r=>{var n,o,d;return{...t,...t[r.type],...r,removeDelay:r.removeDelay||((n=t[r.type])==null?void 0:n.removeDelay)||t?.removeDelay,duration:r.duration||((o=t[r.type])==null?void 0:o.duration)||t?.duration||vt[r.type],style:{...t.style,...(d=t[r.type])==null?void 0:d.style,...r.style}}});return{...e,toasts:s}},Nt=(t,e="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...a,id:a?.id||xt()}),I=t=>(e,a)=>{let i=Nt(e,t,a);return E({type:2,toast:i}),i.id},w=(t,e)=>I("blank")(t,e);w.error=I("error");w.success=I("success");w.loading=I("loading");w.custom=I("custom");w.dismiss=t=>{E({type:3,toastId:t})};w.remove=t=>E({type:4,toastId:t});w.promise=(t,e,a)=>{let i=w.loading(e.loading,{...a,...a?.loading});return typeof t=="function"&&(t=t()),t.then(s=>{let r=e.success?F(e.success,s):void 0;return r?w.success(r,{id:i,...a,...a?.success}):w.dismiss(i),s}).catch(s=>{let r=e.error?F(e.error,s):void 0;r?w.error(r,{id:i,...a,...a?.error}):w.dismiss(i)}),t};var zt=(t,e)=>{E({type:1,toast:{id:t,height:e}})},jt=()=>{E({type:5,time:Date.now()})},O=new Map,Et=1e3,Lt=(t,e=Et)=>{if(O.has(t))return;let a=setTimeout(()=>{O.delete(t),E({type:4,toastId:t})},e);O.set(t,a)},Ct=t=>{let{toasts:e,pausedAt:a}=kt(t);(0,C.useEffect)(()=>{if(a)return;let r=Date.now(),n=e.map(o=>{if(o.duration===1/0)return;let d=(o.duration||0)+o.pauseDuration-(r-o.createdAt);if(d<0){o.visible&&w.dismiss(o.id);return}return setTimeout(()=>w.dismiss(o.id),d)});return()=>{n.forEach(o=>o&&clearTimeout(o))}},[e,a]);let i=(0,C.useCallback)(()=>{a&&E({type:6,time:Date.now()})},[a]),s=(0,C.useCallback)((r,n)=>{let{reverseOrder:o=!1,gutter:d=8,defaultPosition:p}=n||{},c=e.filter(u=>(u.position||p)===(r.position||p)&&u.height),f=c.findIndex(u=>u.id===r.id),h=c.filter((u,B)=>B<f&&u.visible).length;return c.filter(u=>u.visible).slice(...o?[h+1]:[0,h]).reduce((u,B)=>u+(B.height||0)+d,0)},[e]);return(0,C.useEffect)(()=>{e.forEach(r=>{if(r.dismissed)Lt(r.id,r.removeDelay);else{let n=O.get(r.id);n&&(clearTimeout(n),O.delete(r.id))}})},[e]),{toasts:e,handlers:{updateHeight:zt,startPause:jt,endPause:i,calculateOffset:s}}},Tt=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$t=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Dt=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ot=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Tt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$t} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Dt} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,It=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,At=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${It} 1s linear infinite;
`,St=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Mt=g`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Pt=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${St} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Mt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Ft=b("div")`
  position: absolute;
`,Bt=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ht=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Rt=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ht} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,_t=({toast:t})=>{let{icon:e,type:a,iconTheme:i}=t;return e!==void 0?typeof e=="string"?z.createElement(Rt,null,e):e:a==="blank"?null:z.createElement(Bt,null,z.createElement(At,{...i}),a!=="loading"&&z.createElement(Ft,null,a==="error"?z.createElement(Ot,{...i}):z.createElement(Pt,{...i})))},Ut=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,qt=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,Vt="0%{opacity:0;} 100%{opacity:1;}",Yt="0%{opacity:1;} 100%{opacity:0;}",Zt=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Jt=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Kt=(t,e)=>{let a=t.includes("top")?1:-1,[i,s]=rt()?[Vt,Yt]:[Ut(a),qt(a)];return{animation:e?`${g(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Qt=v.memo(({toast:t,position:e,style:a,children:i})=>{let s=t.height?Kt(t.position||e||"top-center",t.visible):{opacity:0},r=v.createElement(_t,{toast:t}),n=v.createElement(Jt,{...t.ariaProps},F(t.message,t));return v.createElement(Zt,{className:t.className,style:{...s,...a,...t.style}},typeof i=="function"?i({icon:r,message:n}):v.createElement(v.Fragment,null,r,n))});et(N.createElement);var Wt=({id:t,className:e,style:a,onHeightUpdate:i,children:s})=>{let r=N.useCallback(n=>{if(n){let o=()=>{let d=n.getBoundingClientRect().height;i(t,d)};o(),new MutationObserver(o).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[t,i]);return N.createElement("div",{ref:r,className:e,style:a},s)},Xt=(t,e)=>{let a=t.includes("top"),i=a?{top:0}:{bottom:0},s=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:rt()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(a?1:-1)}px)`,...i,...s}},Gt=D`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,M=16,ot=({reverseOrder:t,position:e="top-center",toastOptions:a,gutter:i,children:s,containerStyle:r,containerClassName:n})=>{let{toasts:o,handlers:d}=Ct(a);return N.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:M,left:M,right:M,bottom:M,pointerEvents:"none",...r},className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},o.map(p=>{let c=p.position||e,f=d.calculateOffset(p,{reverseOrder:t,gutter:i,defaultPosition:e}),h=Xt(c,f);return N.createElement(Wt,{id:p.id,key:p.id,onHeightUpdate:d.updateHeight,className:p.visible?Gt:"",style:h},p.type==="custom"?F(p.message,p):s?s(p):N.createElement(Qt,{toast:p,position:c}))}))};var te=x(nt(),1);var m=x(A(),1);function st({user:t}){let e=V();return(0,m.jsx)("nav",{className:"bg-white shadow",children:(0,m.jsx)("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:(0,m.jsxs)("div",{className:"flex h-16 justify-between",children:[(0,m.jsxs)("div",{className:"flex",children:[(0,m.jsx)("div",{className:"flex flex-shrink-0 items-center",children:(0,m.jsx)(L,{to:"/",className:"text-xl font-bold text-primary-600",children:"AI\u9700\u6C42\u5206\u6790\u5E08"})}),t&&(0,m.jsxs)("div",{className:"ml-6 flex items-center space-x-4",children:[(0,m.jsx)(L,{to:"/dashboard",className:S("px-3 py-2 text-sm font-medium rounded-md",e.pathname==="/dashboard"?"bg-primary-100 text-primary-700":"text-gray-700 hover:bg-gray-100"),children:"\u9879\u76EE"}),(0,m.jsx)(L,{to:"/new-project",className:S("px-3 py-2 text-sm font-medium rounded-md",e.pathname==="/new-project"?"bg-primary-100 text-primary-700":"text-gray-700 hover:bg-gray-100"),children:"\u65B0\u5EFA\u9879\u76EE"})]})]}),(0,m.jsx)("div",{className:"flex items-center",children:t?(0,m.jsxs)("div",{className:"flex items-center",children:[(0,m.jsx)("span",{className:"text-sm text-gray-700 mr-4",children:t.name||t.email}),(0,m.jsx)("form",{action:"/logout",method:"post",children:(0,m.jsx)(Q,{type:"submit",variant:"outline",size:"sm",children:"\u9000\u51FA"})})]}):(0,m.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,m.jsx)(L,{to:"/login",className:S("px-3 py-2 text-sm font-medium rounded-md",e.pathname==="/login"?"bg-primary-100 text-primary-700":"text-gray-700 hover:bg-gray-100"),children:"\u767B\u5F55"}),(0,m.jsx)(L,{to:"/register",className:"rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700",children:"\u6CE8\u518C"})]})})]})})})}var l=x(A(),1),ee=()=>[{rel:"stylesheet",href:W},...void 0?[{rel:"stylesheet",href:void 0}]:[],{rel:"stylesheet",href:"https://rsms.me/inter/inter.css"}];function lt(){let{user:t}=Z();return(0,l.jsxs)("html",{lang:"zh-CN",className:"h-full",children:[(0,l.jsxs)("head",{children:[(0,l.jsx)("meta",{charSet:"utf-8"}),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width,initial-scale=1"}),(0,l.jsx)(R,{}),(0,l.jsx)(H,{})]}),(0,l.jsxs)("body",{className:"h-full bg-gray-50",children:[(0,l.jsx)(st,{user:t}),(0,l.jsx)("main",{className:"mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",children:(0,l.jsx)(Y,{})}),(0,l.jsx)(ot,{position:"top-right"}),(0,l.jsx)(K,{}),(0,l.jsx)(_,{}),(0,l.jsx)(J,{})]})]})}function re({error:t}){return console.error(t),(0,l.jsxs)("html",{lang:"zh-CN",className:"h-full",children:[(0,l.jsxs)("head",{children:[(0,l.jsx)("title",{children:"\u51FA\u9519\u4E86\uFF01"}),(0,l.jsx)(R,{}),(0,l.jsx)(H,{})]}),(0,l.jsxs)("body",{className:"h-full",children:[(0,l.jsx)("div",{className:"min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8",children:(0,l.jsx)("div",{className:"mx-auto max-w-max",children:(0,l.jsxs)("main",{className:"sm:flex",children:[(0,l.jsx)("p",{className:"text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl",children:"500"}),(0,l.jsxs)("div",{className:"sm:ml-6",children:[(0,l.jsxs)("div",{className:"sm:border-l sm:border-gray-200 sm:pl-6",children:[(0,l.jsx)("h1",{className:"text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl",children:"\u51FA\u9519\u4E86"}),(0,l.jsx)("p",{className:"mt-1 text-base text-gray-500",children:"\u8BF7\u7A0D\u540E\u518D\u8BD5\uFF0C\u6216\u8054\u7CFB\u7BA1\u7406\u5458\u3002"})]}),(0,l.jsx)("div",{className:"mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6",children:(0,l.jsx)("a",{href:"/",className:"inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",children:"\u8FD4\u56DE\u9996\u9875"})})]})]})})}),(0,l.jsx)(_,{})]})]})}export{re as ErrorBoundary,lt as default,ee as links};
