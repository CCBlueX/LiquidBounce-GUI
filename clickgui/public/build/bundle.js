var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function o(){return Object.create(null)}function l(e){e.forEach(n)}function s(e){return"function"==typeof e}function c(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}const i="undefined"!=typeof window;let r=i?()=>window.performance.now():()=>Date.now(),a=i?e=>requestAnimationFrame(e):e;const u=new Set;function d(e){u.forEach((t=>{t.c(e)||(u.delete(t),t.f())})),0!==u.size&&a(d)}function f(e,t){e.appendChild(t)}function g(e,t,n){e.insertBefore(t,n||null)}function p(e){e.parentNode.removeChild(e)}function m(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function h(e){return document.createElement(e)}function $(e){return document.createTextNode(e)}function v(){return $(" ")}function b(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function y(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function x(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function w(e,t){e.value=null==t?"":t}function _(e,t,n,o){e.style.setProperty(t,n,o?"important":"")}function k(e,t,n){e.classList[n?"add":"remove"](t)}const E=new Set;let C,N=0;function S(e,t,n,o,l,s,c,i=0){const r=16.666/o;let a="{\n";for(let e=0;e<=1;e+=r){const o=t+(n-t)*s(e);a+=100*e+`%{${c(o,1-o)}}\n`}const u=a+`100% {${c(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${i}`,f=e.ownerDocument;E.add(f);const g=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(h("style")).sheet),p=f.__svelte_rules||(f.__svelte_rules={});p[d]||(p[d]=!0,g.insertRule(`@keyframes ${d} ${u}`,g.cssRules.length));const m=e.style.animation||"";return e.style.animation=`${m?`${m}, `:""}${d} ${o}ms linear ${l}ms 1 both`,N+=1,d}function A(e,t){const n=(e.style.animation||"").split(", "),o=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),l=n.length-o.length;l&&(e.style.animation=o.join(", "),N-=l,N||a((()=>{N||(E.forEach((e=>{const t=e.__svelte_stylesheet;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.__svelte_rules={}})),E.clear())})))}function I(e){C=e}function T(e){(function(){if(!C)throw new Error("Function called outside component initialization");return C})().$$.on_mount.push(e)}const F=[],B=[],O=[],L=[],R=Promise.resolve();let V=!1;function j(e){O.push(e)}let M=!1;const z=new Set;function P(){if(!M){M=!0;do{for(let e=0;e<F.length;e+=1){const t=F[e];I(t),q(t.$$)}for(I(null),F.length=0;B.length;)B.pop()();for(let e=0;e<O.length;e+=1){const t=O[e];z.has(t)||(z.add(t),t())}O.length=0}while(F.length);for(;L.length;)L.pop()();V=!1,M=!1,z.clear()}}function q(e){if(null!==e.fragment){e.update(),l(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(j)}}let G;function H(e,t,n){e.dispatchEvent(function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(`${t?"intro":"outro"}${n}`))}const W=new Set;let X;function D(){X={r:0,c:[],p:X}}function U(){X.r||l(X.c),X=X.p}function Y(e,t){e&&e.i&&(W.delete(e),e.i(t))}function J(e,t,n,o){if(e&&e.o){if(W.has(e))return;W.add(e),X.c.push((()=>{W.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}}const K={duration:0};function Q(n,o,c,i){let f=o(n,c),g=i?0:1,p=null,m=null,h=null;function $(){h&&A(n,h)}function v(e,t){const n=e.b-g;return t*=Math.abs(n),{a:g,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function b(o){const{delay:s=0,duration:c=300,easing:i=t,tick:b=e,css:y}=f||K,x={start:r()+s,b:o};o||(x.group=X,X.r+=1),p||m?m=x:(y&&($(),h=S(n,g,o,c,s,i,y)),o&&b(0,1),p=v(x,c),j((()=>H(n,o,"start"))),function(e){let t;0===u.size&&a(d),new Promise((n=>{u.add(t={c:e,f:n})}))}((e=>{if(m&&e>m.start&&(p=v(m,c),m=null,H(n,p.b,"start"),y&&($(),h=S(n,g,p.b,p.duration,0,i,f.css))),p)if(e>=p.end)b(g=p.b,1-g),H(n,p.b,"end"),m||(p.b?$():--p.group.r||l(p.group.c)),p=null;else if(e>=p.start){const t=e-p.start;g=p.a+p.d*i(t/p.duration),b(g,1-g)}return!(!p&&!m)})))}return{run(e){s(f)?(G||(G=Promise.resolve(),G.then((()=>{G=null}))),G).then((()=>{f=f(),b(e)})):b(e)},end(){$(),p=m=null}}}function Z(e){e&&e.c()}function ee(e,t,o,c){const{fragment:i,on_mount:r,on_destroy:a,after_update:u}=e.$$;i&&i.m(t,o),c||j((()=>{const t=r.map(n).filter(s);a?a.push(...t):l(t),e.$$.on_mount=[]})),u.forEach(j)}function te(e,t){const n=e.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ne(e,t){-1===e.$$.dirty[0]&&(F.push(e),V||(V=!0,R.then(P)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function oe(t,n,s,c,i,r,a=[-1]){const u=C;I(t);const d=t.$$={fragment:null,ctx:null,props:r,update:e,not_equal:i,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:a,skip_bound:!1};let f=!1;if(d.ctx=s?s(t,n.props||{},((e,n,...o)=>{const l=o.length?o[0]:n;return d.ctx&&i(d.ctx[e],d.ctx[e]=l)&&(!d.skip_bound&&d.bound[e]&&d.bound[e](l),f&&ne(t,e)),n})):[],d.update(),f=!0,l(d.before_update),d.fragment=!!c&&c(d.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);d.fragment&&d.fragment.l(e),e.forEach(p)}else d.fragment&&d.fragment.c();n.intro&&Y(t.$$.fragment),ee(t,n.target,n.anchor,n.customElement),P()}I(u)}class le{$destroy(){te(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function se(e){const t=e-1;return t*t*t+1}function ce(e){return-.5*(Math.cos(Math.PI*e)-1)}function ie(e,{delay:n=0,duration:o=400,easing:l=t}={}){const s=+getComputedStyle(e).opacity;return{delay:n,duration:o,easing:l,css:e=>"opacity: "+e*s}}function re(e,{delay:t=0,duration:n=400,easing:o=se}={}){const l=getComputedStyle(e),s=+l.opacity,c=parseFloat(l.height),i=parseFloat(l.paddingTop),r=parseFloat(l.paddingBottom),a=parseFloat(l.marginTop),u=parseFloat(l.marginBottom),d=parseFloat(l.borderTopWidth),f=parseFloat(l.borderBottomWidth);return{delay:t,duration:n,easing:o,css:e=>`overflow: hidden;opacity: ${Math.min(20*e,1)*s};height: ${e*c}px;padding-top: ${e*i}px;padding-bottom: ${e*r}px;margin-top: ${e*a}px;margin-bottom: ${e*u}px;border-top-width: ${e*d}px;border-bottom-width: ${e*f}px;`}}function ae(t){let n,o,s,c,i,r,a,u,d;return{c(){n=h("div"),o=h("label"),s=h("input"),c=v(),i=h("span"),r=v(),a=h("div"),a.textContent=`${t[1]}`,y(s,"type","checkbox"),y(s,"class","svelte-1ijpkgb"),y(i,"class","slider svelte-1ijpkgb"),y(a,"class","name svelte-1ijpkgb"),y(o,"class","switch svelte-1ijpkgb"),y(n,"class","setting svelte-1ijpkgb")},m(e,l){g(e,n,l),f(n,o),f(o,s),s.checked=t[0],f(o,c),f(o,i),f(o,r),f(o,a),u||(d=[b(s,"change",t[4]),b(s,"change",t[2])],u=!0)},p(e,[t]){1&t&&(s.checked=e[0])},i:e,o:e,d(e){e&&p(n),u=!1,l(d)}}}function ue(e,t,n){let{instance:o}=t,l=o.getName(),s=o.get();return e.$$set=e=>{"instance"in e&&n(3,o=e.instance)},[s,l,function(){o.set(s)},o,function(){s=this.checked,n(0,s)}]}class de extends le{constructor(e){super(),oe(this,e,ue,ae,c,{instance:3})}}function fe(t){let n,o,l,s,c,i,r;return{c(){n=h("div"),o=h("div"),o.textContent=`${t[2]}`,l=v(),s=h("div"),c=$(t[0]),i=v(),r=h("div"),y(o,"class","name svelte-fz8b1a"),y(s,"class","value svelte-fz8b1a"),y(r,"class","slider svelte-fz8b1a"),y(n,"class","setting animation-fix svelte-fz8b1a")},m(e,a){g(e,n,a),f(n,o),f(n,l),f(n,s),f(s,c),f(n,i),f(n,r),t[4](r)},p(e,[t]){1&t&&x(c,e[0])},i:e,o:e,d(e){e&&p(n),t[4](null)}}}function ge(e,t,n){let o,l,{instance:s}=t,c=s.getValueType().toString(),i=s.getName(),r=s.getRange().getStart(),a=s.getRange().getEndInclusive(),u=c.includes("INT")?1:.1,d=c.includes("RANGE");function f(){n(0,l=d?`${o[0]} - ${o[1]}`:o[0].toString())}o=d?[s.get().getStart(),s.get().getEndInclusive()]:[s.get()],f();let g=null;return T((()=>{const e=o;let t="lower";d&&(t=!0),noUiSlider.create(g,{start:e,connect:t,padding:[0,0],range:{min:r,max:a},step:u}),g.noUiSlider.on("update",(e=>{o=e.map((e=>parseFloat(e))),c.includes("INT")&&(o[0]|=0,o[1]|=0),d?c.includes("FLOAT")?s.set(kotlin.floatRange(o[0],o[1])):s.set(kotlin.intRange(o[0],o[1])):s.set(o[0]),f()}))})),e.$$set=e=>{"instance"in e&&n(3,s=e.instance)},[l,g,i,s,function(e){B[e?"unshift":"push"]((()=>{g=e,n(1,g)}))}]}class pe extends le{constructor(e){super(),oe(this,e,ge,fe,c,{instance:3})}}function me(t){let n,o,s,c,i,r;return{c(){n=h("div"),o=h("div"),o.textContent=`${t[1]}`,s=v(),c=h("input"),y(o,"class","name svelte-1qjr5n4"),y(c,"type","text"),y(c,"placeholder",t[1]),y(c,"class","svelte-1qjr5n4"),y(n,"class","setting svelte-1qjr5n4")},m(e,l){g(e,n,l),f(n,o),f(n,s),f(n,c),w(c,t[0]),i||(r=[b(c,"input",t[4]),b(c,"change",t[2])],i=!0)},p(e,[t]){1&t&&c.value!==e[0]&&w(c,e[0])},i:e,o:e,d(e){e&&p(n),i=!1,l(r)}}}function he(e,t,n){let{instance:o}=t,l=o.getName(),s=o.get();return e.$$set=e=>{"instance"in e&&n(3,o=e.instance)},[s,l,function(e){o.set(s)},o,function(){s=this.value,n(0,s)}]}class $e extends le{constructor(e){super(),oe(this,e,he,me,c,{instance:3})}}function ve(e,t,n){const o=e.slice();return o[8]=t[n],o}function be(e){let t,n,o,l=e[1],s=[];for(let t=0;t<l.length;t+=1)s[t]=ye(ve(e,l,t));const c=e=>J(s[e],1,1,(()=>{s[e]=null}));return{c(){t=h("div");for(let e=0;e<s.length;e+=1)s[e].c();y(t,"class","settings svelte-1yphppm")},m(e,n){g(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null);o=!0},p(e,n){if(2&n){let o;for(l=e[1],o=0;o<l.length;o+=1){const c=ve(e,l,o);s[o]?(s[o].p(c,n),Y(s[o],1)):(s[o]=ye(c),s[o].c(),Y(s[o],1),s[o].m(t,null))}for(D(),o=l.length;o<s.length;o+=1)c(o);U()}},i(e){if(!o){for(let e=0;e<l.length;e+=1)Y(s[e]);e&&j((()=>{n||(n=Q(t,ie,{duration:200},!0)),n.run(1)})),o=!0}},o(e){s=s.filter(Boolean);for(let e=0;e<s.length;e+=1)J(s[e]);e&&(n||(n=Q(t,ie,{duration:200},!1)),n.run(0)),o=!1},d(e){e&&p(t),m(s,e),e&&n&&n.end()}}}function ye(e){let t,n;return t=new De({props:{instance:e[8]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};2&n&&(o.instance=e[8]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function xe(e){let t,n,o,s,c,i,r,a,u,d,m,$,x,w=e[0]&&be(e);return{c(){t=h("div"),n=h("div"),o=h("div"),s=h("label"),c=h("input"),i=v(),r=h("span"),a=v(),u=h("div"),u.textContent=`${e[2]}`,d=v(),w&&w.c(),y(c,"type","checkbox"),y(c,"class","svelte-1yphppm"),y(r,"class","slider svelte-1yphppm"),y(u,"class","name svelte-1yphppm"),y(s,"class","switch svelte-1yphppm"),y(o,"class","boolean svelte-1yphppm"),y(n,"class","head"),y(t,"class","setting")},m(l,p){g(l,t,p),f(t,n),f(n,o),f(o,s),f(s,c),c.checked=e[0],f(s,i),f(s,r),f(s,a),f(s,u),f(t,d),w&&w.m(t,null),m=!0,$||(x=[b(c,"change",e[5]),b(c,"change",e[3])],$=!0)},p(e,[n]){1&n&&(c.checked=e[0]),e[0]?w?(w.p(e,n),1&n&&Y(w,1)):(w=be(e),w.c(),Y(w,1),w.m(t,null)):w&&(D(),J(w,1,1,(()=>{w=null})),U())},i(e){m||(Y(w),m=!0)},o(e){J(w),m=!1},d(e){e&&p(t),w&&w.d(),$=!1,l(x)}}}function we(e,t,n){let{instance:o}=t;const l=["Enabled","Hidden","Bind"];function s(e){const t=[];for(let n=0;n<e.length;n++)l.includes(e[n].getName())||t.push(e[n]);return t}let c=o.getEnabledValue().get(),i=o.getName(),r=s(o.getContainedValues());return e.$$set=e=>{"instance"in e&&n(4,o=e.instance)},[c,r,i,function(e){o.getEnabledValue().set(c),n(1,r=s(o.getContainedValues()))},o,function(){c=this.checked,n(0,c)}]}class _e extends le{constructor(e){super(),oe(this,e,we,xe,c,{instance:4})}}function ke(e,t,n){const o=e.slice();return o[8]=t[n],o}function Ee(e){let t,n,o,l=e[3],s=[];for(let t=0;t<l.length;t+=1)s[t]=Ce(ke(e,l,t));return{c(){t=h("div");for(let e=0;e<s.length;e+=1)s[e].c();y(t,"class","values svelte-1ek9iag")},m(e,n){g(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null);o=!0},p(n,o){if(e=n,41&o){let n;for(l=e[3],n=0;n<l.length;n+=1){const c=ke(e,l,n);s[n]?s[n].p(c,o):(s[n]=Ce(c),s[n].c(),s[n].m(t,null))}for(;n<s.length;n+=1)s[n].d(1);s.length=l.length}},i(e){o||(e&&j((()=>{n||(n=Q(t,re,{duration:200,easing:ce},!0)),n.run(1)})),o=!0)},o(e){e&&(n||(n=Q(t,re,{duration:200,easing:ce},!1)),n.run(0)),o=!1},d(e){e&&p(t),m(s,e),e&&n&&n.end()}}}function Ce(e){let t,n,o,l,s=e[8]+"";function c(){return e[7](e[8])}return{c(){t=h("div"),n=$(s),y(t,"class","value svelte-1ek9iag"),k(t,"enabled",e[8]===e[0])},m(e,s){g(e,t,s),f(t,n),o||(l=b(t,"click",c),o=!0)},p(n,o){e=n,9&o&&k(t,"enabled",e[8]===e[0])},d(e){e&&p(t),o=!1,l()}}}function Ne(e){let t,n,o,l,s,c,i,r,a=e[1]&&Ee(e);return{c(){t=h("div"),n=h("div"),o=$(e[2]),l=$(" - "),s=$(e[0]),c=v(),a&&a.c(),y(n,"class","name svelte-1ek9iag"),k(n,"expanded",e[1]),y(t,"class","setting svelte-1ek9iag")},m(u,d){g(u,t,d),f(t,n),f(n,o),f(n,l),f(n,s),f(t,c),a&&a.m(t,null),i||(r=b(n,"click",e[4]),i=!0)},p(e,[o]){1&o&&x(s,e[0]),2&o&&k(n,"expanded",e[1]),e[1]?a?(a.p(e,o),2&o&&Y(a,1)):(a=Ee(e),a.c(),Y(a,1),a.m(t,null)):a&&(D(),J(a,1,1,(()=>{a=null})),U())},i(e){Y(a)},o(e){J(a)},d(e){e&&p(t),a&&a.d(),i=!1,r()}}}function Se(e,t,n){let{instance:o}=t,l=o.getName(),s=o.getChoicesStrings(),c=o.get().getChoiceName(),i=!1;function r(e){n(0,c=e),o.setFromValueName(e)}return e.$$set=e=>{"instance"in e&&n(6,o=e.instance)},[c,i,l,s,function(){n(1,i=!i)},r,o,e=>r(e)]}class Ae extends le{constructor(e){super(),oe(this,e,Se,Ne,c,{instance:6})}}function Ie(e,t,n){const o=e.slice();return o[11]=t[n],o}function Te(e,t,n){const o=e.slice();return o[14]=t[n],o}function Fe(e){let t,n,o,l=e[4],s=[];for(let t=0;t<l.length;t+=1)s[t]=Be(Te(e,l,t));return{c(){t=h("div");for(let e=0;e<s.length;e+=1)s[e].c();y(t,"class","values svelte-4eh9eh")},m(e,n){g(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null);o=!0},p(n,o){if(e=n,81&o){let n;for(l=e[4],n=0;n<l.length;n+=1){const c=Te(e,l,n);s[n]?s[n].p(c,o):(s[n]=Be(c),s[n].c(),s[n].m(t,null))}for(;n<s.length;n+=1)s[n].d(1);s.length=l.length}},i(e){o||(e&&j((()=>{n||(n=Q(t,re,{duration:200,easing:ce},!0)),n.run(1)})),o=!0)},o(e){e&&(n||(n=Q(t,re,{duration:200,easing:ce},!1)),n.run(0)),o=!1},d(e){e&&p(t),m(s,e),e&&n&&n.end()}}}function Be(e){let t,n,o,l,s=e[14]+"";function c(){return e[8](e[14])}return{c(){t=h("div"),n=$(s),y(t,"class","value svelte-4eh9eh"),k(t,"enabled",e[14]===e[0])},m(e,s){g(e,t,s),f(t,n),o||(l=b(t,"click",c),o=!0)},p(n,o){e=n,17&o&&k(t,"enabled",e[14]===e[0])},d(e){e&&p(t),o=!1,l()}}}function Oe(e){let t,n,o,l=e[1],s=[];for(let t=0;t<l.length;t+=1)s[t]=Le(Ie(e,l,t));const c=e=>J(s[e],1,1,(()=>{s[e]=null}));return{c(){t=h("div");for(let e=0;e<s.length;e+=1)s[e].c();y(t,"class","settings svelte-4eh9eh")},m(e,n){g(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null);o=!0},p(n,o){if(e=n,2&o){let n;for(l=e[1],n=0;n<l.length;n+=1){const c=Ie(e,l,n);s[n]?(s[n].p(c,o),Y(s[n],1)):(s[n]=Le(c),s[n].c(),Y(s[n],1),s[n].m(t,null))}for(D(),n=l.length;n<s.length;n+=1)c(n);U()}},i(e){if(!o){for(let e=0;e<l.length;e+=1)Y(s[e]);e&&j((()=>{n||(n=Q(t,ie,{duration:200,easing:ce},!0)),n.run(1)})),o=!0}},o(e){s=s.filter(Boolean);for(let e=0;e<s.length;e+=1)J(s[e]);e&&(n||(n=Q(t,ie,{duration:200,easing:ce},!1)),n.run(0)),o=!1},d(e){e&&p(t),m(s,e),e&&n&&n.end()}}}function Le(e){let t,n;return t=new De({props:{instance:e[11]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};2&n&&(o.instance=e[11]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function Re(e){let t,n,o,l,s,c,i,r,a,u,d=e[2]&&Fe(e),m=e[1].length>0&&Oe(e);return{c(){t=h("div"),n=h("div"),o=$(e[3]),l=$(" - "),s=$(e[0]),c=v(),d&&d.c(),i=v(),m&&m.c(),y(n,"class","name svelte-4eh9eh"),k(n,"expanded",e[2]),y(t,"class","setting svelte-4eh9eh")},m(p,h){g(p,t,h),f(t,n),f(n,o),f(n,l),f(n,s),f(t,c),d&&d.m(t,null),f(t,i),m&&m.m(t,null),r=!0,a||(u=b(n,"click",e[5]),a=!0)},p(e,[o]){(!r||1&o)&&x(s,e[0]),4&o&&k(n,"expanded",e[2]),e[2]?d?(d.p(e,o),4&o&&Y(d,1)):(d=Fe(e),d.c(),Y(d,1),d.m(t,i)):d&&(D(),J(d,1,1,(()=>{d=null})),U()),e[1].length>0?m?(m.p(e,o),2&o&&Y(m,1)):(m=Oe(e),m.c(),Y(m,1),m.m(t,null)):m&&(D(),J(m,1,1,(()=>{m=null})),U())},i(e){r||(Y(d),Y(m),r=!0)},o(e){J(d),J(m),r=!1},d(e){e&&p(t),d&&d.d(),m&&m.d(),a=!1,u()}}}function Ve(e,t,n){let{instance:o}=t;const l=["Enabled","Hidden","Bind"];function s(e){const t=[];for(let n=0;n<e.length;n++)l.includes(e[n].getName())||t.push(e[n]);return t}let c=o.getName(),i=o.getChoicesStrings(),r=o.getActiveChoice().getChoiceName(),a=s(o.getActiveChoice().getContainedValues()),u=!1;function d(e){n(0,r=e),o.setFromValueName(e),n(1,a=s(o.getActiveChoice().getContainedValues()))}return e.$$set=e=>{"instance"in e&&n(7,o=e.instance)},[r,a,u,c,i,function(){n(2,u=!u),u&&n(1,a=s(o.getActiveChoice().getContainedValues()))},d,o,e=>d(e)]}class je extends le{constructor(e){super(),oe(this,e,Ve,Re,c,{instance:7})}}function Me(e){let t,n;return t=new $e({props:{instance:e[0]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.instance=e[0]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function ze(e){let t,n;return t=new je({props:{instance:e[0]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.instance=e[0]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function Pe(e){let t,n;return t=new pe({props:{instance:e[0]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.instance=e[0]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function qe(e){let t,n;return t=new _e({props:{instance:e[0]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.instance=e[0]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function Ge(e){let t,n;return t=new Ae({props:{instance:e[0]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.instance=e[0]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function He(e){let t,n;return t=new de({props:{instance:e[0]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};1&n&&(o.instance=e[0]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function We(e){let t,n,o,l;const s=[He,Ge,qe,Pe,ze,Me],c=[];return~(t=function(e,t){return"BOOLEAN"===e[1]?0:"CHOOSE"===e[1]?1:"TOGGLEABLE"===e[1]?2:"INT"===e[1]||"INT_RANGE"===e[1]||"FLOAT"===e[1]||"FLOAT_RANGE"===e[1]?3:"CHOICE"===e[1]?4:"TEXT"===e[1]?5:-1}(e))&&(n=c[t]=s[t](e)),{c(){n&&n.c(),o=$("")},m(e,n){~t&&c[t].m(e,n),g(e,o,n),l=!0},p(e,[t]){n&&n.p(e,t)},i(e){l||(Y(n),l=!0)},o(e){J(n),l=!1},d(e){~t&&c[t].d(e),e&&p(o)}}}function Xe(e,t,n){let{instance:o}=t,l=o.getValueType().toString();return e.$$set=e=>{"instance"in e&&n(0,o=e.instance)},[o,l]}class De extends le{constructor(e){super(),oe(this,e,Xe,We,c,{instance:0})}}function Ue(e,t,n){const o=e.slice();return o[9]=t[n],o}function Ye(e){let t,n,o,l=e[1],s=[];for(let t=0;t<l.length;t+=1)s[t]=Je(Ue(e,l,t));const c=e=>J(s[e],1,1,(()=>{s[e]=null}));return{c(){t=h("div");for(let e=0;e<s.length;e+=1)s[e].c();y(t,"class","settings svelte-xunng5")},m(e,n){g(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null);o=!0},p(n,o){if(e=n,2&o){let n;for(l=e[1],n=0;n<l.length;n+=1){const c=Ue(e,l,n);s[n]?(s[n].p(c,o),Y(s[n],1)):(s[n]=Je(c),s[n].c(),Y(s[n],1),s[n].m(t,null))}for(D(),n=l.length;n<s.length;n+=1)c(n);U()}},i(e){if(!o){for(let e=0;e<l.length;e+=1)Y(s[e]);j((()=>{n||(n=Q(t,re,{duration:400,easing:ce},!0)),n.run(1)})),o=!0}},o(e){s=s.filter(Boolean);for(let e=0;e<s.length;e+=1)J(s[e]);n||(n=Q(t,re,{duration:400,easing:ce},!1)),n.run(0),o=!1},d(e){e&&p(t),m(s,e),e&&n&&n.end()}}}function Je(e){let t,n;return t=new De({props:{instance:e[9]}}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},p(e,n){const o={};2&n&&(o.instance=e[9]),t.$set(o)},i(e){n||(Y(t.$$.fragment,e),n=!0)},o(e){J(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function Ke(e){let t,n,o,s,c,i,r=e[2]&&Ye(e);return{c(){t=h("div"),n=h("div"),n.textContent=`${e[3]}`,o=v(),r&&r.c(),y(n,"class","module svelte-xunng5"),k(n,"has-settings",e[1].length>0),k(n,"enabled",e[0]),k(n,"expanded",e[2])},m(l,a){g(l,t,a),f(t,n),f(t,o),r&&r.m(t,null),s=!0,c||(i=[b(n,"mousedown",e[5]),b(n,"click",e[4])],c=!0)},p(e,[o]){2&o&&k(n,"has-settings",e[1].length>0),1&o&&k(n,"enabled",e[0]),4&o&&k(n,"expanded",e[2]),e[2]?r?(r.p(e,o),4&o&&Y(r,1)):(r=Ye(e),r.c(),Y(r,1),r.m(t,null)):r&&(D(),J(r,1,1,(()=>{r=null})),U())},i(e){s||(Y(r),s=!0)},o(e){J(r),s=!1},d(e){e&&p(t),r&&r.d(),c=!1,l(i)}}}function Qe(e,t,n){let{instance:o}=t,{enabled:l}=t,s=o.getName();const c=["Enabled","Hidden","Bind"];function i(e){const t=[];for(let n=0;n<e.length;n++)c.includes(e[n].getName())||t.push(e[n]);return t}let r=i(o.getContainedValues()),a=!1;return e.$$set=e=>{"instance"in e&&n(6,o=e.instance),"enabled"in e&&n(0,l=e.enabled)},[l,r,a,s,function(e){o.setEnabled(!l)},function(e){2===e.button&&(n(2,a=!a),a&&n(1,r=i(o.getContainedValues())))},o]}class Ze extends le{constructor(e){super(),oe(this,e,Qe,Ke,c,{instance:6,enabled:0})}}function et(e,t,n){const o=e.slice();return o[15]=t[n],o}function tt(e){let t,n,o,l,s;return n=new Ze({props:{instance:e[15].instance,enabled:e[15].enabled}}),{c(){t=h("div"),Z(n.$$.fragment),o=v(),y(t,"class","svelte-3om7h4")},m(e,l){g(e,t,l),ee(n,t,null),f(t,o),s=!0},p(t,o){e=t;const l={};4&o&&(l.instance=e[15].instance),4&o&&(l.enabled=e[15].enabled),n.$set(l)},i(e){s||(Y(n.$$.fragment,e),j((()=>{l||(l=Q(t,re,{duration:400,easing:ce},!0)),l.run(1)})),s=!0)},o(e){J(n.$$.fragment,e),l||(l=Q(t,re,{duration:400,easing:ce},!1)),l.run(0),s=!1},d(e){e&&p(t),te(n),e&&l&&l.end()}}}function nt(e){let t,n,o,s,c,i,r,a,u,d,w,E,C,N,S=e[2],A=[];for(let t=0;t<S.length;t+=1)A[t]=tt(et(e,S,t));const I=e=>J(A[e],1,1,(()=>{A[e]=null}));return{c(){t=h("div"),n=h("div"),o=h("img"),c=v(),i=h("div"),r=$(e[0]),a=v(),u=h("div"),d=v(),w=h("div");for(let e=0;e<A.length;e+=1)A[e].c();y(o,"class","icon svelte-3om7h4"),o.src!==(s="img/"+e[0].toLowerCase()+".svg")&&y(o,"src",s),y(o,"alt","icon"),y(i,"class","title svelte-3om7h4"),y(u,"class","visibility-toggle svelte-3om7h4"),k(u,"expanded",e[1]),y(n,"class","title-wrapper svelte-3om7h4"),y(w,"class","modules svelte-3om7h4"),y(t,"class","panel svelte-3om7h4"),_(t,"left",e[4]+"px"),_(t,"top",e[3]+"px")},m(l,s){g(l,t,s),f(t,n),f(n,o),f(n,c),f(n,i),f(i,r),f(n,a),f(n,u),f(t,d),f(t,w);for(let e=0;e<A.length;e+=1)A[e].m(w,null);E=!0,C||(N=[b(u,"click",e[6]),b(n,"mousedown",e[7]),b(n,"mousedown",e[5])],C=!0)},p(e,[n]){if((!E||1&n&&o.src!==(s="img/"+e[0].toLowerCase()+".svg"))&&y(o,"src",s),(!E||1&n)&&x(r,e[0]),2&n&&k(u,"expanded",e[1]),4&n){let t;for(S=e[2],t=0;t<S.length;t+=1){const o=et(e,S,t);A[t]?(A[t].p(o,n),Y(A[t],1)):(A[t]=tt(o),A[t].c(),Y(A[t],1),A[t].m(w,null))}for(D(),t=S.length;t<A.length;t+=1)I(t);U()}(!E||16&n)&&_(t,"left",e[4]+"px"),(!E||8&n)&&_(t,"top",e[3]+"px")},i(e){if(!E){for(let e=0;e<S.length;e+=1)Y(A[e]);E=!0}},o(e){A=A.filter(Boolean);for(let e=0;e<A.length;e+=1)J(A[e]);E=!1},d(e){e&&p(t),m(A,e),C=!1,l(N)}}}function ot(e,t,n){let{category:o}=t,{modules:l}=t,s="true"===localStorage.getItem(`clickgui.panel.${o}.expanded`)||null===localStorage.getItem(`clickgui.panel.${o}.expanded`),c=l,i=parseInt(localStorage.getItem(`clickgui.panel.${o}.top`))||0,r=parseInt(localStorage.getItem(`clickgui.panel.${o}.left`))||0,a=!1,u=0,d=0;function f(e){s?(n(1,s=!1),n(2,c=[])):(n(1,s=!0),n(2,c=l)),localStorage.setItem(`clickgui.panel.${o}.expanded`,s)}window.addEventListener("mouseup",(function(){a=!1,localStorage.setItem(`clickgui.panel.${o}.top`,i),localStorage.setItem(`clickgui.panel.${o}.left`,r)})),window.addEventListener("mousemove",(function(e){a&&(n(4,r+=e.screenX-u),n(3,i+=e.screenY-d)),u=e.screenX,d=e.screenY}));try{events.on("toggleModule",(function(e){const t=e.getModule().getName();l.find((e=>e.name===t)).enabled=e.getNewState(),s&&n(2,c=l)}))}catch(e){console.log(e)}return e.$$set=e=>{"category"in e&&n(0,o=e.category),"modules"in e&&n(8,l=e.modules)},[o,s,c,i,r,function(){a=!0},f,function(e){2===e.button&&f()},l]}class lt extends le{constructor(e){super(),oe(this,e,ot,nt,c,{category:0,modules:8})}}function st(e,t,n){const o=e.slice();return o[3]=t[n],o}function ct(t){let n,o;return n=new lt({props:{category:t[3],modules:t[1](t[3])}}),{c(){Z(n.$$.fragment)},m(e,t){ee(n,e,t),o=!0},p:e,i(e){o||(Y(n.$$.fragment,e),o=!0)},o(e){J(n.$$.fragment,e),o=!1},d(e){te(n,e)}}}function it(e){let t,n,o=function(e){let t,n,o=e[0],l=[];for(let t=0;t<o.length;t+=1)l[t]=ct(st(e,o,t));const s=e=>J(l[e],1,1,(()=>{l[e]=null}));return{c(){t=h("div");for(let e=0;e<l.length;e+=1)l[e].c();y(t,"class","clickgui-container svelte-1fiwon3")},m(e,o){g(e,t,o);for(let e=0;e<l.length;e+=1)l[e].m(t,null);n=!0},p(e,n){if(3&n){let c;for(o=e[0],c=0;c<o.length;c+=1){const s=st(e,o,c);l[c]?(l[c].p(s,n),Y(l[c],1)):(l[c]=ct(s),l[c].c(),Y(l[c],1),l[c].m(t,null))}for(D(),c=o.length;c<l.length;c+=1)s(c);U()}},i(e){if(!n){for(let e=0;e<o.length;e+=1)Y(l[e]);n=!0}},o(e){l=l.filter(Boolean);for(let e=0;e<l.length;e+=1)J(l[e]);n=!1},d(e){e&&p(t),m(l,e)}}}(e);return{c(){t=h("main"),o&&o.c()},m(e,l){g(e,t,l),o&&o.m(t,null),n=!0},p(e,[t]){o.p(e,t)},i(e){n||(Y(o),n=!0)},o(e){J(o),n=!1},d(e){e&&p(t),o&&o.d()}}}function rt(e){const t=[];try{const e=client.getModuleManager().iterator();for(;e.hasNext();){const n=e.next();t.push({category:n.getCategory().getReadableName(),name:n.getName(),instance:n,enabled:n.getEnabled()})}}catch(e){console.log(e)}return[["Movement","Combat","Render","Exploit","Player","World","Misc","Fun"],function(e){return t.filter((t=>t.category===e))}]}return new class extends le{constructor(e){super(),oe(this,e,rt,it,c,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
