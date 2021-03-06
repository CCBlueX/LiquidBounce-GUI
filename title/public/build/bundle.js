var app=function(){"use strict";function t(){}const n=t=>t;function e(t){return t()}function o(){return Object.create(null)}function c(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let i;function l(t,n){return i||(i=document.createElement("a")),i.href=n,t===i.href}function u(t,n,e,o){if(t){const c=a(t,n,e,o);return t[0](c)}}function a(t,n,e,o){return t[1]&&o?function(t,n){for(const e in n)t[e]=n[e];return t}(e.ctx.slice(),t[1](o(n))):e.ctx}function f(t,n,e,o){if(t[2]&&o){const c=t[2](o(e));if(void 0===n.dirty)return c;if("object"==typeof c){const t=[],e=Math.max(n.dirty.length,c.length);for(let o=0;o<e;o+=1)t[o]=n.dirty[o]|c[o];return t}return n.dirty|c}return n.dirty}function $(t,n,e,o,c,r){if(c){const s=a(n,e,o,r);t.p(s,c)}}function d(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let t=0;t<e;t++)n[t]=-1;return n}return-1}const m="undefined"!=typeof window;let p=m?()=>window.performance.now():()=>Date.now(),g=m?t=>requestAnimationFrame(t):t;const h=new Set;function v(t){h.forEach((n=>{n.c(t)||(h.delete(n),n.f())})),0!==h.size&&g(v)}function x(t,n){t.appendChild(n)}function y(t){if(!t)return document;const n=t.getRootNode?t.getRootNode():t.ownerDocument;return n&&n.host?n:t.ownerDocument}function b(t){const n=k("style");return function(t,n){x(t.head||t,n)}(y(t),n),n}function w(t,n,e){t.insertBefore(n,e||null)}function _(t){t.parentNode.removeChild(t)}function k(t){return document.createElement(t)}function C(t){return document.createTextNode(t)}function E(){return C(" ")}function S(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function U(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function M(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function N(t,n,e){t.classList[e?"add":"remove"](n)}function R(t,n,e=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,e,!1,n),o}const z=new Set;let A,B=0;function L(t,n,e,o,c,r,s,i=0){const l=16.666/o;let u="{\n";for(let t=0;t<=1;t+=l){const o=n+(e-n)*r(t);u+=100*t+`%{${s(o,1-o)}}\n`}const a=u+`100% {${s(e,1-e)}}\n}`,f=`__svelte_${function(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}(a)}_${i}`,$=y(t);z.add($);const d=$.__svelte_stylesheet||($.__svelte_stylesheet=b(t).sheet),m=$.__svelte_rules||($.__svelte_rules={});m[f]||(m[f]=!0,d.insertRule(`@keyframes ${f} ${a}`,d.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${f} ${o}ms linear ${c}ms 1 both`,B+=1,f}function O(t,n){const e=(t.style.animation||"").split(", "),o=e.filter(n?t=>t.indexOf(n)<0:t=>-1===t.indexOf("__svelte")),c=e.length-o.length;c&&(t.style.animation=o.join(", "),B-=c,B||g((()=>{B||(z.forEach((t=>{const n=t.__svelte_stylesheet;let e=n.cssRules.length;for(;e--;)n.deleteRule(e);t.__svelte_rules={}})),z.clear())})))}function j(t){A=t}function q(){if(!A)throw new Error("Function called outside component initialization");return A}function T(){const t=q();return(n,e)=>{const o=t.$$.callbacks[n];if(o){const c=R(n,e);o.slice().forEach((n=>{n.call(t,c)}))}}}const D=[],F=[],P=[],X=[],G=Promise.resolve();let H=!1;function K(t){P.push(t)}let Y=!1;const I=new Set;function J(){if(!Y){Y=!0;do{for(let t=0;t<D.length;t+=1){const n=D[t];j(n),Q(n.$$)}for(j(null),D.length=0;F.length;)F.pop()();for(let t=0;t<P.length;t+=1){const n=P[t];I.has(n)||(I.add(n),n())}P.length=0}while(D.length);for(;X.length;)X.pop()();H=!1,Y=!1,I.clear()}}function Q(t){if(null!==t.fragment){t.update(),c(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(K)}}let V;function W(t,n,e){t.dispatchEvent(R(`${n?"intro":"outro"}${e}`))}const Z=new Set;let tt;function nt(){tt={r:0,c:[],p:tt}}function et(){tt.r||c(tt.c),tt=tt.p}function ot(t,n){t&&t.i&&(Z.delete(t),t.i(n))}function ct(t,n,e,o){if(t&&t.o){if(Z.has(t))return;Z.add(t),tt.c.push((()=>{Z.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}const rt={duration:0};function st(e,o,s,i){let l=o(e,s),u=i?0:1,a=null,f=null,$=null;function d(){$&&O(e,$)}function m(t,n){const e=t.b-u;return n*=Math.abs(e),{a:u,b:t.b,d:e,duration:n,start:t.start,end:t.start+n,group:t.group}}function x(o){const{delay:r=0,duration:s=300,easing:i=n,tick:x=t,css:y}=l||rt,b={start:p()+r,b:o};o||(b.group=tt,tt.r+=1),a||f?f=b:(y&&(d(),$=L(e,u,o,s,r,i,y)),o&&x(0,1),a=m(b,s),K((()=>W(e,o,"start"))),function(t){let n;0===h.size&&g(v),new Promise((e=>{h.add(n={c:t,f:e})}))}((t=>{if(f&&t>f.start&&(a=m(f,s),f=null,W(e,a.b,"start"),y&&(d(),$=L(e,u,a.b,a.duration,0,i,l.css))),a)if(t>=a.end)x(u=a.b,1-u),W(e,a.b,"end"),f||(a.b?d():--a.group.r||c(a.group.c)),a=null;else if(t>=a.start){const n=t-a.start;u=a.a+a.d*i(n/a.duration),x(u,1-u)}return!(!a&&!f)})))}return{run(t){r(l)?(V||(V=Promise.resolve(),V.then((()=>{V=null}))),V).then((()=>{l=l(),x(t)})):x(t)},end(){d(),a=f=null}}}function it(t){t&&t.c()}function lt(t,n,o,s){const{fragment:i,on_mount:l,on_destroy:u,after_update:a}=t.$$;i&&i.m(n,o),s||K((()=>{const n=l.map(e).filter(r);u?u.push(...n):c(n),t.$$.on_mount=[]})),a.forEach(K)}function ut(t,n){const e=t.$$;null!==e.fragment&&(c(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function at(t,n){-1===t.$$.dirty[0]&&(D.push(t),H||(H=!0,G.then(J)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function ft(n,e,r,s,i,l,u,a=[-1]){const f=A;j(n);const $=n.$$={fragment:null,ctx:null,props:l,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(f?f.$$.context:[])),callbacks:o(),dirty:a,skip_bound:!1,root:e.target||f.$$.root};u&&u($.root);let d=!1;if($.ctx=r?r(n,e.props||{},((t,e,...o)=>{const c=o.length?o[0]:e;return $.ctx&&i($.ctx[t],$.ctx[t]=c)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](c),d&&at(n,t)),e})):[],$.update(),d=!0,c($.before_update),$.fragment=!!s&&s($.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);$.fragment&&$.fragment.l(t),t.forEach(_)}else $.fragment&&$.fragment.c();e.intro&&ot(n.$$.fragment),lt(n,e.target,e.anchor,e.customElement),J()}j(f)}class $t{$destroy(){ut(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function dt(t){let n,e;const o=t[1].default,c=u(o,t,t[0],null);return{c(){n=k("div"),c&&c.c(),U(n,"class","buttons svelte-htoe5z")},m(t,o){w(t,n,o),c&&c.m(n,null),e=!0},p(t,[n]){c&&c.p&&(!e||1&n)&&$(c,o,t,t[0],e?f(o,t[0],n,null):d(t[0]),null)},i(t){e||(ot(c,t),e=!0)},o(t){ct(c,t),e=!1},d(t){t&&_(n),c&&c.d(t)}}}function mt(t,n,e){let{$$slots:o={},$$scope:c}=n;return t.$$set=t=>{"$$scope"in t&&e(0,c=t.$$scope)},[c,o]}class pt extends $t{constructor(t){super(),ft(this,t,mt,dt,s,{})}}function gt(t){let n,e,o,r,s,i,u,a,f,$,d,m,p,g,h,v,y,b,N,R,z;return r=new pt({props:{text:"Change location"}}),{c(){n=k("div"),e=k("div"),o=k("div"),it(r.$$.fragment),s=E(),i=k("img"),a=E(),f=k("img"),d=E(),m=k("div"),p=C(t[0]),g=E(),h=k("div"),v=C(t[1]),y=E(),b=k("div"),b.innerHTML='<img src="img/icons/pen.svg" alt="pen"/>',U(i,"class","location svelte-4tm950"),l(i.src,u="img/flags/"+t[2]+".svg")||U(i,"src",u),U(i,"alt",t[2]),U(o,"class","location-wrapper svelte-4tm950"),U(f,"class","head svelte-4tm950"),l(f.src,$=t[3])||U(f,"src",$),U(f,"alt","head"),U(e,"class","icon svelte-4tm950"),U(m,"class","username svelte-4tm950"),U(h,"class","last-used svelte-4tm950"),U(b,"class","change-account svelte-4tm950"),U(n,"class","account svelte-4tm950")},m(c,l){w(c,n,l),x(n,e),x(e,o),lt(r,o,null),x(o,s),x(o,i),x(e,a),x(e,f),x(n,d),x(n,m),x(m,p),x(n,g),x(n,h),x(h,v),x(n,y),x(n,b),N=!0,R||(z=[S(i,"click",t[5]),S(b,"click",t[4])],R=!0)},p(t,[n]){(!N||4&n&&!l(i.src,u="img/flags/"+t[2]+".svg"))&&U(i,"src",u),(!N||4&n)&&U(i,"alt",t[2]),(!N||8&n&&!l(f.src,$=t[3]))&&U(f,"src",$),(!N||1&n)&&M(p,t[0]),(!N||2&n)&&M(v,t[1])},i(t){N||(ot(r.$$.fragment,t),N=!0)},o(t){ct(r.$$.fragment,t),N=!1},d(t){t&&_(n),ut(r),R=!1,c(z)}}}function ht(t,n,e){const o=T();let{username:c}=n,{lastUsed:r}=n,{location:s}=n,{faceUrl:i}=n;return t.$$set=t=>{"username"in t&&e(0,c=t.username),"lastUsed"in t&&e(1,r=t.lastUsed),"location"in t&&e(2,s=t.location),"faceUrl"in t&&e(3,i=t.faceUrl)},[c,r,s,i,function(t){o("altManagerClick")},function(t){o("proxyManagerClick")}]}class vt extends $t{constructor(t){super(),ft(this,t,ht,gt,s,{username:0,lastUsed:1,location:2,faceUrl:3})}}function xt(n){let e,o;return{c(){e=k("img"),U(e,"class","logo svelte-hsfuen"),l(e.src,o="img/logo.svg")||U(e,"src","img/logo.svg"),U(e,"alt","logo")},m(t,n){w(t,e,n)},p:t,i:t,o:t,d(t){t&&_(e)}}}class yt extends $t{constructor(t){super(),ft(this,t,null,xt,s,{})}}function bt(t){const n=t-1;return n*n*n+1}function wt(t,{delay:e=0,duration:o=400,easing:c=n}={}){const r=+getComputedStyle(t).opacity;return{delay:e,duration:o,easing:c,css:t=>"opacity: "+t*r}}function _t(t,{delay:n=0,duration:e=400,easing:o=bt,x:c=0,y:r=0,opacity:s=0}={}){const i=getComputedStyle(t),l=+i.opacity,u="none"===i.transform?"":i.transform,a=l*(1-s);return{delay:n,duration:e,easing:o,css:(t,n)=>`\n\t\t\ttransform: ${u} translate(${(1-t)*c}px, ${(1-t)*r}px);\n\t\t\topacity: ${l-a*n}`}}function kt(t){let n,e,o,c;return{c(){n=k("div"),e=C(t[0]),U(n,"class","tooltip svelte-1w07kh5")},m(t,o){w(t,n,o),x(n,e),c=!0},p(t,n){(!c||1&n)&&M(e,t[0])},i(t){c||(K((()=>{o||(o=st(n,_t,{y:-10,duration:200},!0)),o.run(1)})),c=!0)},o(t){o||(o=st(n,_t,{y:-10,duration:200},!1)),o.run(0),c=!1},d(t){t&&_(n),t&&o&&o.end()}}}function Ct(t){let n,e,o=t[2]&&kt(t);return{c(){n=k("div"),o&&o.c()},m(c,r){w(c,n,r),o&&o.m(n,null),t[3](n),e=!0},p(t,[e]){t[2]?o?(o.p(t,e),4&e&&ot(o,1)):(o=kt(t),o.c(),ot(o,1),o.m(n,null)):o&&(nt(),ct(o,1,1,(()=>{o=null})),et())},i(t){e||(ot(o),e=!0)},o(t){ct(o),e=!1},d(e){e&&_(n),o&&o.d(),t[3](null)}}}function Et(t,n,e){let o,{text:c}=n,r=!1;var s;return s=()=>{o.parentNode.addEventListener("mouseenter",(t=>{e(2,r=!0)})),o.parentNode.addEventListener("mouseleave",(t=>{e(2,r=!1)}))},q().$$.after_update.push(s),t.$$set=t=>{"text"in t&&e(0,c=t.text)},[c,o,r,function(t){F[t?"unshift":"push"]((()=>{o=t,e(1,o)}))}]}class St extends $t{constructor(t){super(),ft(this,t,Et,Ct,s,{text:0})}}function Ut(t){let n,e,o,c;return{c(){n=k("img"),l(n.src,e="img/icons/"+t[0]+".svg")||U(n,"src",e),U(n,"alt","icon"),U(n,"class","svelte-6mrx6l")},m(t,e){w(t,n,e),c=!0},p(t,o){(!c||1&o&&!l(n.src,e="img/icons/"+t[0]+".svg"))&&U(n,"src",e)},i(t){c||(K((()=>{o||(o=st(n,wt,{duration:200},!0)),o.run(1)})),c=!0)},o(t){o||(o=st(n,wt,{duration:200},!1)),o.run(0),c=!1},d(t){t&&_(n),t&&o&&o.end()}}}function Mt(t){let n,e,o,c;return{c(){n=k("img"),l(n.src,e="img/icons/"+t[0]+"-hover.svg")||U(n,"src",e),U(n,"alt","icon"),U(n,"class","svelte-6mrx6l")},m(t,e){w(t,n,e),c=!0},p(t,o){(!c||1&o&&!l(n.src,e="img/icons/"+t[0]+"-hover.svg"))&&U(n,"src",e)},i(t){c||(K((()=>{o||(o=st(n,wt,{duration:200},!0)),o.run(1)})),c=!0)},o(t){o||(o=st(n,wt,{duration:200},!1)),o.run(0),c=!1},d(t){t&&_(n),t&&o&&o.end()}}}function Nt(t){let n,e,o,c,r,s,i,l,u;e=new St({props:{text:t[1]}});const a=[Mt,Ut],f=[];function $(t,n){return t[2]?0:1}return r=$(t),s=f[r]=a[r](t),{c(){n=k("div"),it(e.$$.fragment),o=E(),c=k("div"),s.c(),U(c,"class","icon svelte-6mrx6l"),N(c,"hovered",t[2]),U(n,"class","button svelte-6mrx6l")},m(s,a){var $;w(s,n,a),lt(e,n,null),x(n,o),x(n,c),f[r].m(c,null),i=!0,l||(u=S(n,"click",($=t[3],function(t){return t.stopPropagation(),$.call(this,t)})),l=!0)},p(t,[n]){const o={};2&n&&(o.text=t[1]),e.$set(o);let i=r;r=$(t),r===i?f[r].p(t,n):(nt(),ct(f[i],1,1,(()=>{f[i]=null})),et(),s=f[r],s?s.p(t,n):(s=f[r]=a[r](t),s.c()),ot(s,1),s.m(c,null)),4&n&&N(c,"hovered",t[2])},i(t){i||(ot(e.$$.fragment,t),ot(s),i=!0)},o(t){ct(e.$$.fragment,t),ct(s),i=!1},d(t){t&&_(n),ut(e),f[r].d(),l=!1,u()}}}function Rt(t,n,e){const o=T();let{icon:c}=n,{text:r}=n,{hovered:s}=n;return t.$$set=t=>{"icon"in t&&e(0,c=t.icon),"text"in t&&e(1,r=t.text),"hovered"in t&&e(2,s=t.hovered)},[c,r,s,function(t){o("click",t)}]}class zt extends $t{constructor(t){super(),ft(this,t,Rt,Nt,s,{icon:0,text:1,hovered:2})}}const At=t=>({hovered:4&t}),Bt=t=>({hovered:t[2]});function Lt(t){let n,e,o,c;return{c(){n=k("img"),l(n.src,e="img/icons/"+t[1]+".svg")||U(n,"src",e),U(n,"alt","icon"),U(n,"class","svelte-twnufy")},m(t,e){w(t,n,e),c=!0},p(t,o){(!c||2&o&&!l(n.src,e="img/icons/"+t[1]+".svg"))&&U(n,"src",e)},i(t){c||(K((()=>{o||(o=st(n,wt,{duration:200},!0)),o.run(1)})),c=!0)},o(t){o||(o=st(n,wt,{duration:200},!1)),o.run(0),c=!1},d(t){t&&_(n),t&&o&&o.end()}}}function Ot(t){let n,e,o,c;return{c(){n=k("img"),l(n.src,e="img/icons/"+t[1]+"-hover.svg")||U(n,"src",e),U(n,"alt","icon"),U(n,"class","svelte-twnufy")},m(t,e){w(t,n,e),c=!0},p(t,o){(!c||2&o&&!l(n.src,e="img/icons/"+t[1]+"-hover.svg"))&&U(n,"src",e)},i(t){c||(K((()=>{o||(o=st(n,wt,{duration:200},!0)),o.run(1)})),c=!0)},o(t){o||(o=st(n,wt,{duration:200},!1)),o.run(0),c=!1},d(t){t&&_(n),t&&o&&o.end()}}}function jt(t){let n,e,o,r,s,i,l,a,m,p,g;const h=[Ot,Lt],v=[];function y(t,n){return t[2]?0:1}o=y(t),r=v[o]=h[o](t);const b=t[7].default,N=u(b,t,t[6],Bt);return{c(){n=k("div"),e=k("div"),r.c(),s=E(),i=k("div"),l=C(t[0]),a=E(),N&&N.c(),U(e,"class","icon svelte-twnufy"),U(i,"class","text svelte-twnufy"),U(n,"class","button svelte-twnufy")},m(c,r){w(c,n,r),x(n,e),v[o].m(e,null),x(n,s),x(n,i),x(i,l),x(n,a),N&&N.m(n,null),m=!0,p||(g=[S(n,"mouseenter",t[3]),S(n,"mouseleave",t[4]),S(n,"click",t[5])],p=!0)},p(t,[n]){let c=o;o=y(t),o===c?v[o].p(t,n):(nt(),ct(v[c],1,1,(()=>{v[c]=null})),et(),r=v[o],r?r.p(t,n):(r=v[o]=h[o](t),r.c()),ot(r,1),r.m(e,null)),(!m||1&n)&&M(l,t[0]),N&&N.p&&(!m||68&n)&&$(N,b,t,t[6],m?f(b,t[6],n,At):d(t[6]),Bt)},i(t){m||(ot(r),ot(N,t),m=!0)},o(t){ct(r),ct(N,t),m=!1},d(t){t&&_(n),v[o].d(),N&&N.d(t),p=!1,c(g)}}}function qt(t,n,e){let{$$slots:o={},$$scope:c}=n;const r=T();let{text:s}=n,{icon:i}=n,l=!1;return t.$$set=t=>{"text"in t&&e(0,s=t.text),"icon"in t&&e(1,i=t.icon),"$$scope"in t&&e(6,c=t.$$scope)},[s,i,l,function(t){e(2,l=!0)},function(t){e(2,l=!1)},function(t){r("click",t)},c,o]}class Tt extends $t{constructor(t){super(),ft(this,t,qt,jt,s,{text:0,icon:1})}}function Dt(t){let n,e;const o=t[1].default,c=u(o,t,t[0],null);return{c(){n=k("div"),c&&c.c(),U(n,"class","buttons svelte-1np6dk1")},m(t,o){w(t,n,o),c&&c.m(n,null),e=!0},p(t,[n]){c&&c.p&&(!e||1&n)&&$(c,o,t,t[0],e?f(o,t[0],n,null):d(t[0]),null)},i(t){e||(ot(c,t),e=!0)},o(t){ct(c,t),e=!1},d(t){t&&_(n),c&&c.d(t)}}}function Ft(t,n,e){let{$$slots:o={},$$scope:c}=n;return t.$$set=t=>{"$$scope"in t&&e(0,c=t.$$scope)},[c,o]}class Pt extends $t{constructor(t){super(),ft(this,t,Ft,Dt,s,{})}}function Xt(t){let n,e,o,c,r,s,i,u,a;return e=new St({props:{text:t[0]}}),{c(){n=k("div"),it(e.$$.fragment),o=E(),c=k("div"),r=k("img"),l(r.src,s="img/icons/"+t[1]+".svg")||U(r,"src",s),U(r,"alt","icon"),U(c,"class","icon svelte-1e1mre3"),U(n,"class","button svelte-1e1mre3")},m(s,l){w(s,n,l),lt(e,n,null),x(n,o),x(n,c),x(c,r),i=!0,u||(a=S(n,"click",t[2]),u=!0)},p(t,[n]){const o={};1&n&&(o.text=t[0]),e.$set(o),(!i||2&n&&!l(r.src,s="img/icons/"+t[1]+".svg"))&&U(r,"src",s)},i(t){i||(ot(e.$$.fragment,t),i=!0)},o(t){ct(e.$$.fragment,t),i=!1},d(t){t&&_(n),ut(e),u=!1,a()}}}function Gt(t,n,e){let{text:o}=n,{icon:c}=n;const r=T();return t.$$set=t=>{"text"in t&&e(0,o=t.text),"icon"in t&&e(1,c=t.icon)},[o,c,function(t){r("click",t)}]}class Ht extends $t{constructor(t){super(),ft(this,t,Gt,Xt,s,{text:0,icon:1})}}function Kt(n){let e,o,c,r,s,i,u,a,f;return{c(){e=k("div"),o=k("div"),c=k("img"),s=E(),i=k("div"),u=C(n[0]),l(c.src,r="img/icons/"+n[1]+".svg")||U(c,"src",r),U(c,"alt","icon"),U(o,"class","icon svelte-1hm325t"),U(i,"class","text svelte-1hm325t"),U(e,"class","button svelte-1hm325t")},m(t,r){w(t,e,r),x(e,o),x(o,c),x(e,s),x(e,i),x(i,u),a||(f=S(e,"click",n[2]),a=!0)},p(t,[n]){2&n&&!l(c.src,r="img/icons/"+t[1]+".svg")&&U(c,"src",r),1&n&&M(u,t[0])},i:t,o:t,d(t){t&&_(e),a=!1,f()}}}function Yt(t,n,e){let{text:o}=n,{icon:c}=n;const r=T();return t.$$set=t=>{"text"in t&&e(0,o=t.text),"icon"in t&&e(1,c=t.icon)},[o,c,function(t){r("click",t)}]}class It extends $t{constructor(t){super(),ft(this,t,Yt,Kt,s,{text:0,icon:1})}}function Jt(t){let n,e;const o=t[1].default,c=u(o,t,t[0],null);return{c(){n=k("div"),c&&c.c(),U(n,"class","buttons svelte-1er56mp")},m(t,o){w(t,n,o),c&&c.m(n,null),e=!0},p(t,[n]){c&&c.p&&(!e||1&n)&&$(c,o,t,t[0],e?f(o,t[0],n,null):d(t[0]),null)},i(t){e||(ot(c,t),e=!0)},o(t){ct(c,t),e=!1},d(t){t&&_(n),c&&c.d(t)}}}function Qt(t,n,e){let{$$slots:o={},$$scope:c}=n;return t.$$set=t=>{"$$scope"in t&&e(0,c=t.$$scope)},[c,o]}class Vt extends $t{constructor(t){super(),ft(this,t,Qt,Jt,s,{})}}function Wt(t){let n,e;return n=new zt({props:{text:"Realms",icon:"realms",hovered:t[2]}}),n.$on("click",ln),{c(){it(n.$$.fragment)},m(t,o){lt(n,t,o),e=!0},p(t,e){const o={};4&e&&(o.hovered=t[2]),n.$set(o)},i(t){e||(ot(n.$$.fragment,t),e=!0)},o(t){ct(n.$$.fragment,t),e=!1},d(t){ut(n,t)}}}function Zt(t){let n,e,o,c,r,s,i,l;return n=new Tt({props:{text:"Singleplayer",icon:"singleplayer"}}),n.$on("click",rn),o=new Tt({props:{text:"Multiplayer",icon:"multiplayer",$$slots:{default:[Wt,({hovered:t})=>({2:t}),({hovered:t})=>t?4:0]},$$scope:{ctx:t}}}),o.$on("click",sn),r=new Tt({props:{text:"Customize",icon:"customize"}}),i=new Tt({props:{text:"Options",icon:"options"}}),i.$on("click",un),{c(){it(n.$$.fragment),e=E(),it(o.$$.fragment),c=E(),it(r.$$.fragment),s=E(),it(i.$$.fragment)},m(t,u){lt(n,t,u),w(t,e,u),lt(o,t,u),w(t,c,u),lt(r,t,u),w(t,s,u),lt(i,t,u),l=!0},p(t,n){const e={};12&n&&(e.$$scope={dirty:n,ctx:t}),o.$set(e)},i(t){l||(ot(n.$$.fragment,t),ot(o.$$.fragment,t),ot(r.$$.fragment,t),ot(i.$$.fragment,t),l=!0)},o(t){ct(n.$$.fragment,t),ct(o.$$.fragment,t),ct(r.$$.fragment,t),ct(i.$$.fragment,t),l=!1},d(t){ut(n,t),t&&_(e),ut(o,t),t&&_(c),ut(r,t),t&&_(s),ut(i,t)}}}function tn(n){let e,o,c,r;return e=new It({props:{text:"Change Background",icon:"change-background"}}),c=new It({props:{text:"Exit",icon:"exit"}}),c.$on("click",an),{c(){it(e.$$.fragment),o=E(),it(c.$$.fragment)},m(t,n){lt(e,t,n),w(t,o,n),lt(c,t,n),r=!0},p:t,i(t){r||(ot(e.$$.fragment,t),ot(c.$$.fragment,t),r=!0)},o(t){ct(e.$$.fragment,t),ct(c.$$.fragment,t),r=!1},d(t){ut(e,t),t&&_(o),ut(c,t)}}}function nn(n){let e,o,c,r,s,i,l,u,a,f,$,d;return e=new Ht({props:{text:"Forum",icon:"nodebb"}}),e.$on("click",fn),c=new Ht({props:{text:"GitHub",icon:"github"}}),c.$on("click",$n),s=new Ht({props:{text:"Guilded",icon:"guilded"}}),s.$on("click",dn),l=new Ht({props:{text:"Twitter",icon:"twitter"}}),l.$on("click",mn),a=new Ht({props:{text:"YouTube",icon:"youtube"}}),a.$on("click",pn),$=new It({props:{text:"liquidbounce.net",icon:"liquidbounce.net"}}),$.$on("click",gn),{c(){it(e.$$.fragment),o=E(),it(c.$$.fragment),r=E(),it(s.$$.fragment),i=E(),it(l.$$.fragment),u=E(),it(a.$$.fragment),f=E(),it($.$$.fragment)},m(t,n){lt(e,t,n),w(t,o,n),lt(c,t,n),w(t,r,n),lt(s,t,n),w(t,i,n),lt(l,t,n),w(t,u,n),lt(a,t,n),w(t,f,n),lt($,t,n),d=!0},p:t,i(t){d||(ot(e.$$.fragment,t),ot(c.$$.fragment,t),ot(s.$$.fragment,t),ot(l.$$.fragment,t),ot(a.$$.fragment,t),ot($.$$.fragment,t),d=!0)},o(t){ct(e.$$.fragment,t),ct(c.$$.fragment,t),ct(s.$$.fragment,t),ct(l.$$.fragment,t),ct(a.$$.fragment,t),ct($.$$.fragment,t),d=!1},d(t){ut(e,t),t&&_(o),ut(c,t),t&&_(r),ut(s,t),t&&_(i),ut(l,t),t&&_(u),ut(a,t),t&&_(f),ut($,t)}}}function en(t){let n,e,o,c,r,s,i,l,u,a,f,$,d;return c=new yt({}),s=new vt({props:{username:t[0],location:"de",faceUrl:t[1],lastUsed:"2021-05-07"}}),s.$on("proxyManagerClick",on),s.$on("altManagerClick",cn),l=new Pt({props:{$$slots:{default:[Zt]},$$scope:{ctx:t}}}),a=new pt({props:{$$slots:{default:[tn]},$$scope:{ctx:t}}}),$=new Vt({props:{$$slots:{default:[nn]},$$scope:{ctx:t}}}),{c(){n=k("main"),e=k("div"),o=k("div"),it(c.$$.fragment),r=E(),it(s.$$.fragment),i=E(),it(l.$$.fragment),u=E(),it(a.$$.fragment),f=E(),it($.$$.fragment),U(o,"class","wrapper svelte-o2dcoh"),U(e,"class","scale svelte-o2dcoh"),U(n,"class","svelte-o2dcoh")},m(t,m){w(t,n,m),x(n,e),x(e,o),lt(c,o,null),x(o,r),lt(s,o,null),x(o,i),lt(l,o,null),x(o,u),lt(a,o,null),x(o,f),lt($,o,null),d=!0},p(t,[n]){const e={};8&n&&(e.$$scope={dirty:n,ctx:t}),l.$set(e);const o={};8&n&&(o.$$scope={dirty:n,ctx:t}),a.$set(o);const c={};8&n&&(c.$$scope={dirty:n,ctx:t}),$.$set(c)},i(t){d||(ot(c.$$.fragment,t),ot(s.$$.fragment,t),ot(l.$$.fragment,t),ot(a.$$.fragment,t),ot($.$$.fragment,t),d=!0)},o(t){ct(c.$$.fragment,t),ct(s.$$.fragment,t),ct(l.$$.fragment,t),ct(a.$$.fragment,t),ct($.$$.fragment,t),d=!1},d(t){t&&_(n),ut(c),ut(s),ut(l),ut(a),ut($)}}}function on(){ui.open("proxymanager",screen)}function cn(){ui.open("altmanager",screen)}function rn(){ui.open("singleplayer",screen)}function sn(){ui.open("multiplayer",screen)}function ln(){ui.open("multiplayer_realms",screen)}function un(){ui.open("options",screen)}function an(){minecraft.scheduleStop()}function fn(){utils.browse("https://forums.ccbluex.net")}function $n(){utils.browse("https://github.com/CCBlueX")}function dn(){utils.browse("https://guilded.gg/CCBlueX?r=pmbDp7K4")}function mn(){utils.browse("https://twitter.com/CCBlueX")}function pn(){utils.browse("https://youtube.com/CCBlueX")}function gn(){utils.browse("https://liquidbounce.net")}function hn(t){return[client.getSessionService().getUsername(),client.getSessionService().getFaceUrl()]}return new class extends $t{constructor(t){super(),ft(this,t,hn,en,s,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
