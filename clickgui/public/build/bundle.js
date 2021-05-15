
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function sineInOut(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\clickgui\settings\BooleanSetting.svelte generated by Svelte v3.35.0 */

    const file$9 = "src\\clickgui\\settings\\BooleanSetting.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let div0;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = `${/*name*/ ctx[1]}`;
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1ijpkgb");
    			add_location(input, file$9, 13, 8, 254);
    			attr_dev(span, "class", "slider svelte-1ijpkgb");
    			add_location(span, file$9, 14, 8, 340);
    			attr_dev(div0, "class", "name svelte-1ijpkgb");
    			add_location(div0, file$9, 16, 8, 375);
    			attr_dev(label, "class", "switch svelte-1ijpkgb");
    			add_location(label, file$9, 12, 4, 222);
    			attr_dev(div1, "class", "setting svelte-1ijpkgb");
    			add_location(div1, file$9, 11, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(label, input);
    			input.checked = /*value*/ ctx[0];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(label, div0);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[4]),
    					listen_dev(input, "change", /*handleValueChange*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				input.checked = /*value*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BooleanSetting", slots, []);
    	let { instance } = $$props;
    	let name = instance.getName();
    	let value = instance.get();

    	function handleValueChange() {
    		instance.set(value);
    	}

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BooleanSetting> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(3, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({ instance, name, value, handleValueChange });

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(3, instance = $$props.instance);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, handleValueChange, instance, input_change_handler];
    }

    class BooleanSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$7, create_fragment$a, safe_not_equal, { instance: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BooleanSetting",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[3] === undefined && !("instance" in props)) {
    			console.warn("<BooleanSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<BooleanSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<BooleanSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\ColorSetting.svelte generated by Svelte v3.35.0 */
    const file$8 = "src\\clickgui\\settings\\ColorSetting.svelte";

    function create_fragment$9(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let t1;
    	let input;
    	let t2;
    	let div2;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			attr_dev(div0, "class", "name svelte-1u9hj");
    			add_location(div0, file$8, 50, 4, 1200);
    			attr_dev(input, "class", "value svelte-1u9hj");
    			input.value = /*value*/ ctx[0];
    			add_location(input, file$8, 51, 4, 1236);
    			add_location(div1, file$8, 53, 8, 1350);
    			attr_dev(div2, "class", "animation-fix color-picker svelte-1u9hj");
    			add_location(div2, file$8, 52, 4, 1300);
    			attr_dev(div3, "class", "setting svelte-1u9hj");
    			add_location(div3, file$8, 49, 0, 1173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, input);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			/*div1_binding*/ ctx[3](div1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", handleValueChange, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*div1_binding*/ ctx[3](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleValueChange(e) {
    	
    } /*         const v = e.target.value;
            if (v.length === 6) {
                pickr.setColor(`#${v}`);
            } */

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColorSetting", slots, []);
    	let { name } = $$props;
    	let { value } = $$props;
    	let colorPicker = null;
    	let pickr = null;

    	onMount(() => {
    		pickr = Pickr.create({
    			el: colorPicker,
    			theme: "classic",
    			showAlways: true,
    			inline: true,
    			default: value,
    			components: {
    				preview: false,
    				opacity: false,
    				hue: true,
    				interaction: {
    					hex: false,
    					rgba: false,
    					hsla: false,
    					hsva: false,
    					cmyk: false,
    					input: false,
    					clear: false,
    					save: false
    				}
    			}
    		});

    		pickr.on("change", v => {
    			$$invalidate(0, value = `RGBA(${v.toRGBA().map(val => val | 0).join(", ")})`);
    		});
    	});

    	const writable_props = ["name", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorSetting> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			colorPicker = $$value;
    			$$invalidate(2, colorPicker);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		name,
    		value,
    		colorPicker,
    		pickr,
    		handleValueChange
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("colorPicker" in $$props) $$invalidate(2, colorPicker = $$props.colorPicker);
    		if ("pickr" in $$props) pickr = $$props.pickr;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, colorPicker, div1_binding];
    }

    class ColorSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$9, safe_not_equal, { name: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorSetting",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<ColorSetting> was created without expected prop 'name'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<ColorSetting> was created without expected prop 'value'");
    		}
    	}

    	get name() {
    		throw new Error("<ColorSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ColorSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ColorSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ColorSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\RangeSetting.svelte generated by Svelte v3.35.0 */
    const file$7 = "src\\clickgui\\settings\\RangeSetting.svelte";

    function create_fragment$8(ctx) {
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*name*/ ctx[2]}`;
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*valueString*/ ctx[0]);
    			t3 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "name svelte-fz8b1a");
    			add_location(div0, file$7, 73, 4, 1888);
    			attr_dev(div1, "class", "value svelte-fz8b1a");
    			add_location(div1, file$7, 74, 4, 1924);
    			attr_dev(div2, "class", "slider svelte-fz8b1a");
    			add_location(div2, file$7, 75, 4, 1968);
    			attr_dev(div3, "class", "setting animation-fix svelte-fz8b1a");
    			add_location(div3, file$7, 72, 0, 1847);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			/*div2_binding*/ ctx[4](div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*valueString*/ 1) set_data_dev(t2, /*valueString*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*div2_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("RangeSetting", slots, []);
    	let { instance } = $$props;
    	let type = instance.getValueType().toString();
    	let name = instance.getName();
    	let min = instance.getRange().getStart();
    	let max = instance.getRange().getEndInclusive();
    	let step = type.includes("INT") ? 1 : 0.1;
    	let multi = type.includes("RANGE");
    	let value;

    	if (multi) {
    		value = [instance.get().getStart(), instance.get().getEndInclusive()];
    	} else {
    		value = [instance.get()];
    	}

    	let valueString;

    	function updateValueString() {
    		if (multi) {
    			$$invalidate(0, valueString = `${value[0]} - ${value[1]}`);
    		} else {
    			$$invalidate(0, valueString = value[0].toString());
    		}
    	}

    	updateValueString();
    	let slider = null;

    	onMount(() => {
    		const start = value;
    		let connect = "lower";

    		if (multi) {
    			connect = true;
    		}

    		noUiSlider.create(slider, {
    			start,
    			connect,
    			padding: [0, 0],
    			range: { min, max },
    			step
    		});

    		slider.noUiSlider.on("update", values => {
    			value = values.map(v => parseFloat(v));

    			if (type.includes("INT")) {
    				value[0] |= 0;
    				value[1] |= 0;
    			}

    			if (multi) {
    				if (type.includes("FLOAT")) {
    					instance.set(kotlin.floatRange(value[0], value[1]));
    				} else {
    					instance.set(kotlin.intRange(value[0], value[1]));
    				}
    			} else {
    				instance.set(value[0]);
    			}

    			updateValueString();
    		});
    	});

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RangeSetting> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			slider = $$value;
    			$$invalidate(1, slider);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(3, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		instance,
    		type,
    		name,
    		min,
    		max,
    		step,
    		multi,
    		value,
    		valueString,
    		updateValueString,
    		slider
    	});

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(3, instance = $$props.instance);
    		if ("type" in $$props) type = $$props.type;
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("min" in $$props) min = $$props.min;
    		if ("max" in $$props) max = $$props.max;
    		if ("step" in $$props) step = $$props.step;
    		if ("multi" in $$props) multi = $$props.multi;
    		if ("value" in $$props) value = $$props.value;
    		if ("valueString" in $$props) $$invalidate(0, valueString = $$props.valueString);
    		if ("slider" in $$props) $$invalidate(1, slider = $$props.slider);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [valueString, slider, name, instance, div2_binding];
    }

    class RangeSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$6, create_fragment$8, safe_not_equal, { instance: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RangeSetting",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[3] === undefined && !("instance" in props)) {
    			console.warn("<RangeSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<RangeSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<RangeSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\TextSetting.svelte generated by Svelte v3.35.0 */

    const file$6 = "src\\clickgui\\settings\\TextSetting.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*name*/ ctx[1]}`;
    			t1 = space();
    			input = element("input");
    			attr_dev(div0, "class", "name svelte-1qjr5n4");
    			add_location(div0, file$6, 12, 4, 222);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", /*name*/ ctx[1]);
    			attr_dev(input, "class", "svelte-1qjr5n4");
    			add_location(input, file$6, 13, 4, 258);
    			attr_dev(div1, "class", "setting svelte-1qjr5n4");
    			add_location(div1, file$6, 11, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(input, "change", /*handleTextChange*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextSetting", slots, []);
    	let { instance } = $$props;
    	let name = instance.getName();
    	let value = instance.get();

    	function handleTextChange(e) {
    		instance.set(value);
    	}

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextSetting> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(3, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({ instance, name, value, handleTextChange });

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(3, instance = $$props.instance);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, handleTextChange, instance, input_input_handler];
    }

    class TextSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$5, create_fragment$7, safe_not_equal, { instance: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextSetting",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[3] === undefined && !("instance" in props)) {
    			console.warn("<TextSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<TextSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<TextSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\TogglableSetting.svelte generated by Svelte v3.35.0 */
    const file$5 = "src\\clickgui\\settings\\TogglableSetting.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (44:4) {#if value}
    function create_if_block$5(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*settings*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "settings svelte-1yphppm");
    			add_location(div, file$5, 44, 8, 1256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*settings*/ 2) {
    				each_value = /*settings*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(44:4) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (46:12) {#each settings as s}
    function create_each_block$5(ctx) {
    	let genericsetting;
    	let current;

    	genericsetting = new GenericSetting({
    			props: { instance: /*s*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(genericsetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(genericsetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const genericsetting_changes = {};
    			if (dirty & /*settings*/ 2) genericsetting_changes.instance = /*s*/ ctx[8];
    			genericsetting.$set(genericsetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(genericsetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(genericsetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(genericsetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(46:12) {#each settings as s}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let div0;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*value*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = `${/*name*/ ctx[2]}`;
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1yphppm");
    			add_location(input, file$5, 35, 16, 1002);
    			attr_dev(span, "class", "slider svelte-1yphppm");
    			add_location(span, file$5, 36, 16, 1096);
    			attr_dev(div0, "class", "name svelte-1yphppm");
    			add_location(div0, file$5, 38, 16, 1147);
    			attr_dev(label, "class", "switch svelte-1yphppm");
    			add_location(label, file$5, 34, 12, 962);
    			attr_dev(div1, "class", "boolean svelte-1yphppm");
    			add_location(div1, file$5, 33, 8, 927);
    			attr_dev(div2, "class", "head");
    			add_location(div2, file$5, 32, 4, 899);
    			attr_dev(div3, "class", "setting");
    			add_location(div3, file$5, 31, 0, 872);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, label);
    			append_dev(label, input);
    			input.checked = /*value*/ ctx[0];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(label, div0);
    			append_dev(div3, t3);
    			if (if_block) if_block.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[5]),
    					listen_dev(input, "change", /*setTogglableValue*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				input.checked = /*value*/ ctx[0];
    			}

    			if (/*value*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*value*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TogglableSetting", slots, []);
    	let { instance } = $$props;
    	const hiddenSettings = ["Enabled", "Hidden", "Bind"];

    	function toJavaScriptArray(a) {
    		const v = [];

    		for (let i = 0; i < a.length; i++) {
    			if (!hiddenSettings.includes(a[i].getName())) {
    				v.push(a[i]);
    			}
    		}

    		return v;
    	}

    	let value = instance.getEnabledValue().get();
    	let name = instance.getName();
    	let settings = toJavaScriptArray(instance.getContainedSettingsRecursively());

    	function setTogglableValue(e) {
    		instance.getEnabledValue().set(value);
    		$$invalidate(1, settings = toJavaScriptArray(instance.getContainedSettingsRecursively()));
    	}

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TogglableSetting> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(4, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		sineInOut,
    		slide,
    		GenericSetting,
    		instance,
    		hiddenSettings,
    		toJavaScriptArray,
    		value,
    		name,
    		settings,
    		setTogglableValue
    	});

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(4, instance = $$props.instance);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("settings" in $$props) $$invalidate(1, settings = $$props.settings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, settings, name, setTogglableValue, instance, input_change_handler];
    }

    class TogglableSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$4, create_fragment$6, safe_not_equal, { instance: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TogglableSetting",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[4] === undefined && !("instance" in props)) {
    			console.warn("<TogglableSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<TogglableSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<TogglableSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\ChooseSetting.svelte generated by Svelte v3.35.0 */
    const file$4 = "src\\clickgui\\settings\\ChooseSetting.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (25:4) {#if expanded}
    function create_if_block$4(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*values*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "values svelte-1ek9iag");
    			add_location(div, file$4, 25, 8, 646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*values, value, handleValueChange*/ 41) {
    				each_value = /*values*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200, easing: sineInOut }, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200, easing: sineInOut }, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:4) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (27:12) {#each values as v}
    function create_each_block$4(ctx) {
    	let div;
    	let t_value = /*v*/ ctx[8] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*v*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "value svelte-1ek9iag");
    			toggle_class(div, "enabled", /*v*/ ctx[8] === /*value*/ ctx[0]);
    			add_location(div, file$4, 27, 16, 777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*values, value*/ 9) {
    				toggle_class(div, "enabled", /*v*/ ctx[8] === /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(27:12) {#each values as v}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;
    	let if_block = /*expanded*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[2]);
    			t1 = text(" - ");
    			t2 = text(/*value*/ ctx[0]);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "name svelte-1ek9iag");
    			toggle_class(div0, "expanded", /*expanded*/ ctx[1]);
    			add_location(div0, file$4, 23, 4, 520);
    			attr_dev(div1, "class", "setting svelte-1ek9iag");
    			add_location(div1, file$4, 22, 0, 493);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div1, t3);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*handleToggleExpand*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) set_data_dev(t2, /*value*/ ctx[0]);

    			if (dirty & /*expanded*/ 2) {
    				toggle_class(div0, "expanded", /*expanded*/ ctx[1]);
    			}

    			if (/*expanded*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*expanded*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChooseSetting", slots, []);
    	let { instance } = $$props;
    	let name = instance.getName();
    	let values = instance.getChoicesStrings();
    	let value = instance.get().getChoiceName();
    	let expanded = false;

    	function handleToggleExpand() {
    		$$invalidate(1, expanded = !expanded);
    	}

    	function handleValueChange(v) {
    		$$invalidate(0, value = v);
    		instance.setFromValueName(v);
    	}

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChooseSetting> was created with unknown prop '${key}'`);
    	});

    	const click_handler = v => handleValueChange(v);

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(6, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		sineInOut,
    		slide,
    		instance,
    		name,
    		values,
    		value,
    		expanded,
    		handleToggleExpand,
    		handleValueChange
    	});

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(6, instance = $$props.instance);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("values" in $$props) $$invalidate(3, values = $$props.values);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("expanded" in $$props) $$invalidate(1, expanded = $$props.expanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		expanded,
    		name,
    		values,
    		handleToggleExpand,
    		handleValueChange,
    		instance,
    		click_handler
    	];
    }

    class ChooseSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$3, create_fragment$5, safe_not_equal, { instance: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChooseSetting",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[6] === undefined && !("instance" in props)) {
    			console.warn("<ChooseSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<ChooseSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<ChooseSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\ChoiceSetting.svelte generated by Svelte v3.35.0 */
    const file$3 = "src\\clickgui\\settings\\ChoiceSetting.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (42:4) {#if expanded}
    function create_if_block_1$1(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value_1 = /*values*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "values svelte-4eh9eh");
    			add_location(div, file$3, 42, 8, 1313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*values, value, handleValueChange*/ 81) {
    				each_value_1 = /*values*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200, easing: sineInOut }, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200, easing: sineInOut }, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(42:4) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {#each values as v}
    function create_each_block_1(ctx) {
    	let div;
    	let t_value = /*v*/ ctx[14] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[8](/*v*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "value svelte-4eh9eh");
    			toggle_class(div, "enabled", /*v*/ ctx[14] === /*value*/ ctx[0]);
    			add_location(div, file$3, 44, 16, 1444);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*values, value*/ 17) {
    				toggle_class(div, "enabled", /*v*/ ctx[14] === /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(44:12) {#each values as v}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#if settings.length > 0}
    function create_if_block$3(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*settings*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "settings svelte-4eh9eh");
    			add_location(div, file$3, 50, 8, 1629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*settings*/ 2) {
    				each_value = /*settings*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(50:4) {#if settings.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (52:12) {#each settings as s}
    function create_each_block$3(ctx) {
    	let genericsetting;
    	let current;

    	genericsetting = new GenericSetting({
    			props: { instance: /*s*/ ctx[11] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(genericsetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(genericsetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const genericsetting_changes = {};
    			if (dirty & /*settings*/ 2) genericsetting_changes.instance = /*s*/ ctx[11];
    			genericsetting.$set(genericsetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(genericsetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(genericsetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(genericsetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(52:12) {#each settings as s}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*expanded*/ ctx[2] && create_if_block_1$1(ctx);
    	let if_block1 = /*settings*/ ctx[1].length > 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[3]);
    			t1 = text(" - ");
    			t2 = text(/*value*/ ctx[0]);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "name svelte-4eh9eh");
    			toggle_class(div0, "expanded", /*expanded*/ ctx[2]);
    			add_location(div0, file$3, 40, 4, 1187);
    			attr_dev(div1, "class", "setting svelte-4eh9eh");
    			add_location(div1, file$3, 39, 0, 1160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div1, t3);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*handleToggleExpand*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*value*/ 1) set_data_dev(t2, /*value*/ ctx[0]);

    			if (dirty & /*expanded*/ 4) {
    				toggle_class(div0, "expanded", /*expanded*/ ctx[2]);
    			}

    			if (/*expanded*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*expanded*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*settings*/ ctx[1].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*settings*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChoiceSetting", slots, []);
    	let { instance } = $$props;
    	const hiddenSettings = ["Enabled", "Hidden", "Bind"];

    	function toJavaScriptArray(a) {
    		const v = [];

    		for (let i = 0; i < a.length; i++) {
    			if (!hiddenSettings.includes(a[i].getName())) {
    				v.push(a[i]);
    			}
    		}

    		return v;
    	}

    	let name = instance.getName();
    	let values = instance.getChoicesStrings();
    	let value = instance.getActive();
    	let settings = toJavaScriptArray(instance.getActiveChoice().getContainedSettingsRecursively());
    	let expanded = false;

    	function handleToggleExpand() {
    		$$invalidate(2, expanded = !expanded);
    		$$invalidate(1, settings = toJavaScriptArray(instance.getActiveChoice().getContainedSettingsRecursively()));
    	}

    	function handleValueChange(v) {
    		$$invalidate(0, value = v);
    		instance.setFromValueName(v);
    		$$invalidate(1, settings = toJavaScriptArray(instance.getActiveChoice().getContainedSettingsRecursively()));
    	}

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChoiceSetting> was created with unknown prop '${key}'`);
    	});

    	const click_handler = v => handleValueChange(v);

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(7, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		sineInOut,
    		slide,
    		GenericSetting,
    		instance,
    		hiddenSettings,
    		toJavaScriptArray,
    		name,
    		values,
    		value,
    		settings,
    		expanded,
    		handleToggleExpand,
    		handleValueChange
    	});

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(7, instance = $$props.instance);
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    		if ("values" in $$props) $$invalidate(4, values = $$props.values);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("settings" in $$props) $$invalidate(1, settings = $$props.settings);
    		if ("expanded" in $$props) $$invalidate(2, expanded = $$props.expanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		settings,
    		expanded,
    		name,
    		values,
    		handleToggleExpand,
    		handleValueChange,
    		instance,
    		click_handler
    	];
    }

    class ChoiceSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$2, create_fragment$4, safe_not_equal, { instance: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChoiceSetting",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[7] === undefined && !("instance" in props)) {
    			console.warn("<ChoiceSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<ChoiceSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<ChoiceSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\settings\GenericSetting.svelte generated by Svelte v3.35.0 */

    const { console: console_1$2 } = globals;

    // (26:26) 
    function create_if_block_5(ctx) {
    	let textsetting;
    	let current;

    	textsetting = new TextSetting({
    			props: { instance: /*instance*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(textsetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textsetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textsetting_changes = {};
    			if (dirty & /*instance*/ 1) textsetting_changes.instance = /*instance*/ ctx[0];
    			textsetting.$set(textsetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textsetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textsetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textsetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(26:26) ",
    		ctx
    	});

    	return block;
    }

    // (24:28) 
    function create_if_block_4(ctx) {
    	let choicesetting;
    	let current;

    	choicesetting = new ChoiceSetting({
    			props: { instance: /*instance*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(choicesetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(choicesetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const choicesetting_changes = {};
    			if (dirty & /*instance*/ 1) choicesetting_changes.instance = /*instance*/ ctx[0];
    			choicesetting.$set(choicesetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(choicesetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(choicesetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(choicesetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(24:28) ",
    		ctx
    	});

    	return block;
    }

    // (22:95) 
    function create_if_block_3(ctx) {
    	let rangesetting;
    	let current;

    	rangesetting = new RangeSetting({
    			props: { instance: /*instance*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(rangesetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rangesetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangesetting_changes = {};
    			if (dirty & /*instance*/ 1) rangesetting_changes.instance = /*instance*/ ctx[0];
    			rangesetting.$set(rangesetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangesetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangesetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(rangesetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(22:95) ",
    		ctx
    	});

    	return block;
    }

    // (20:32) 
    function create_if_block_2(ctx) {
    	let togglablesetting;
    	let current;

    	togglablesetting = new TogglableSetting({
    			props: { instance: /*instance*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(togglablesetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(togglablesetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const togglablesetting_changes = {};
    			if (dirty & /*instance*/ 1) togglablesetting_changes.instance = /*instance*/ ctx[0];
    			togglablesetting.$set(togglablesetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(togglablesetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(togglablesetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(togglablesetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(20:32) ",
    		ctx
    	});

    	return block;
    }

    // (18:28) 
    function create_if_block_1(ctx) {
    	let choosesetting;
    	let current;

    	choosesetting = new ChooseSetting({
    			props: { instance: /*instance*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(choosesetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(choosesetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const choosesetting_changes = {};
    			if (dirty & /*instance*/ 1) choosesetting_changes.instance = /*instance*/ ctx[0];
    			choosesetting.$set(choosesetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(choosesetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(choosesetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(choosesetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(18:28) ",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if type === "BOOLEAN"}
    function create_if_block$2(ctx) {
    	let booleansetting;
    	let current;

    	booleansetting = new BooleanSetting({
    			props: { instance: /*instance*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(booleansetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(booleansetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const booleansetting_changes = {};
    			if (dirty & /*instance*/ 1) booleansetting_changes.instance = /*instance*/ ctx[0];
    			booleansetting.$set(booleansetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(booleansetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(booleansetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(booleansetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(16:0) {#if type === \\\"BOOLEAN\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$2,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[1] === "BOOLEAN") return 0;
    		if (/*type*/ ctx[1] === "CHOOSE") return 1;
    		if (/*type*/ ctx[1] === "TOGGLEABLE") return 2;
    		if (/*type*/ ctx[1] === "INT" || /*type*/ ctx[1] === "INT_RANGE" || /*type*/ ctx[1] === "FLOAT" || /*type*/ ctx[1] === "FLOAT_RANGE") return 3;
    		if (/*type*/ ctx[1] === "CHOICE") return 4;
    		if (/*type*/ ctx[1] === "TEXT") return 5;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("GenericSetting", slots, []);
    	let { instance } = $$props;
    	let type = instance.getValueType().toString();
    	console.log(instance);
    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<GenericSetting> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(0, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		BooleanSetting,
    		ColorSetting,
    		RangeSetting,
    		TextSetting,
    		TogglableSetting,
    		ChooseSetting,
    		ChoiceSetting,
    		instance,
    		type
    	});

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(0, instance = $$props.instance);
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [instance, type];
    }

    class GenericSetting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$1, create_fragment$3, safe_not_equal, { instance: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GenericSetting",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[0] === undefined && !("instance" in props)) {
    			console_1$2.warn("<GenericSetting> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<GenericSetting>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<GenericSetting>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\Module.svelte generated by Svelte v3.35.0 */
    const file$2 = "src\\clickgui\\Module.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (46:4) {#if expanded}
    function create_if_block$1(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*settings*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "settings svelte-xunng5");
    			add_location(div, file$2, 46, 8, 1304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*settings*/ 1) {
    				each_value = /*settings*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(46:4) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (48:12) {#each settings as s}
    function create_each_block$2(ctx) {
    	let genericsetting;
    	let current;

    	genericsetting = new GenericSetting({
    			props: { instance: /*s*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(genericsetting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(genericsetting, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const genericsetting_changes = {};
    			if (dirty & /*settings*/ 1) genericsetting_changes.instance = /*s*/ ctx[9];
    			genericsetting.$set(genericsetting_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(genericsetting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(genericsetting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(genericsetting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(48:12) {#each settings as s}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*expanded*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*name*/ ctx[2]}`;
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "module svelte-xunng5");
    			toggle_class(div0, "has-settings", /*settings*/ ctx[0].length > 0);
    			toggle_class(div0, "enabled", /*enabled*/ ctx[3]);
    			toggle_class(div0, "expanded", /*expanded*/ ctx[1]);
    			add_location(div0, file$2, 44, 4, 1091);
    			add_location(div1, file$2, 43, 0, 1080);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mousedown", /*handleToggleSettings*/ ctx[5], false, false, false),
    					listen_dev(div0, "click", /*handleToggle*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1) {
    				toggle_class(div0, "has-settings", /*settings*/ ctx[0].length > 0);
    			}

    			if (dirty & /*expanded*/ 2) {
    				toggle_class(div0, "expanded", /*expanded*/ ctx[1]);
    			}

    			if (/*expanded*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*expanded*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Module", slots, []);
    	let { instance } = $$props;
    	let name = instance.getName();
    	let enabled = instance.getEnabled();
    	const hiddenSettings = ["Enabled", "Hidden", "Bind"];

    	function toJavaScriptArray(a) {
    		const v = [];

    		for (let i = 0; i < a.length; i++) {
    			if (!hiddenSettings.includes(a[i].getName())) {
    				v.push(a[i]);
    			}
    		}

    		return v;
    	}

    	let settings = toJavaScriptArray(instance.getContainedSettingsRecursively());
    	let expanded = false;

    	function handleToggle(e) {
    		instance.setEnabled(!enabled);
    	}

    	function handleToggleSettings(event) {
    		if (event.button === 2) {
    			$$invalidate(1, expanded = !expanded);

    			if (expanded) {
    				$$invalidate(0, settings = toJavaScriptArray(instance.getContainedSettingsRecursively()));
    			}
    		}
    	}

    	const writable_props = ["instance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Module> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("instance" in $$props) $$invalidate(6, instance = $$props.instance);
    	};

    	$$self.$capture_state = () => ({
    		sineInOut,
    		slide,
    		GenericSetting,
    		instance,
    		name,
    		enabled,
    		hiddenSettings,
    		toJavaScriptArray,
    		settings,
    		expanded,
    		handleToggle,
    		handleToggleSettings
    	});

    	$$self.$inject_state = $$props => {
    		if ("instance" in $$props) $$invalidate(6, instance = $$props.instance);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("enabled" in $$props) $$invalidate(3, enabled = $$props.enabled);
    		if ("settings" in $$props) $$invalidate(0, settings = $$props.settings);
    		if ("expanded" in $$props) $$invalidate(1, expanded = $$props.expanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settings,
    		expanded,
    		name,
    		enabled,
    		handleToggle,
    		handleToggleSettings,
    		instance
    	];
    }

    class Module extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1, create_fragment$2, safe_not_equal, { instance: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Module",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[6] === undefined && !("instance" in props)) {
    			console.warn("<Module> was created without expected prop 'instance'");
    		}
    	}

    	get instance() {
    		throw new Error("<Module>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<Module>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\clickgui\Panel.svelte generated by Svelte v3.35.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\clickgui\\Panel.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (81:8) {#each renderedModules as m}
    function create_each_block$1(ctx) {
    	let div;
    	let module;
    	let t;
    	let div_transition;
    	let current;

    	module = new Module({
    			props: { instance: /*m*/ ctx[15].instance },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(module.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "svelte-3om7h4");
    			add_location(div, file$1, 81, 12, 2454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(module, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const module_changes = {};
    			if (dirty & /*renderedModules*/ 4) module_changes.instance = /*m*/ ctx[15].instance;
    			module.$set(module_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(module.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(module.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 400, easing: sineInOut }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(module);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(81:8) {#each renderedModules as m}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let div3;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*renderedModules*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*category*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img, "class", "icon svelte-3om7h4");
    			if (img.src !== (img_src_value = "img/" + /*category*/ ctx[0].toLowerCase() + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			add_location(img, file$1, 75, 8, 2149);
    			attr_dev(div0, "class", "title svelte-3om7h4");
    			add_location(div0, file$1, 76, 8, 2229);
    			attr_dev(div1, "class", "visibility-toggle svelte-3om7h4");
    			toggle_class(div1, "expanded", /*expanded*/ ctx[1]);
    			add_location(div1, file$1, 77, 8, 2274);
    			attr_dev(div2, "class", "title-wrapper svelte-3om7h4");
    			add_location(div2, file$1, 74, 4, 2052);
    			attr_dev(div3, "class", "modules svelte-3om7h4");
    			add_location(div3, file$1, 79, 4, 2381);
    			attr_dev(div4, "class", "panel svelte-3om7h4");
    			set_style(div4, "left", /*left*/ ctx[4] + "px");
    			set_style(div4, "top", /*top*/ ctx[3] + "px");
    			add_location(div4, file$1, 73, 0, 1989);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*toggleExpanded*/ ctx[6], false, false, false),
    					listen_dev(div2, "mousedown", /*handleToggleClick*/ ctx[7], false, false, false),
    					listen_dev(div2, "mousedown", /*onMouseDown*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*category*/ 1 && img.src !== (img_src_value = "img/" + /*category*/ ctx[0].toLowerCase() + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*category*/ 1) set_data_dev(t1, /*category*/ ctx[0]);

    			if (dirty & /*expanded*/ 2) {
    				toggle_class(div1, "expanded", /*expanded*/ ctx[1]);
    			}

    			if (dirty & /*sineInOut, renderedModules*/ 4) {
    				each_value = /*renderedModules*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*left*/ 16) {
    				set_style(div4, "left", /*left*/ ctx[4] + "px");
    			}

    			if (!current || dirty & /*top*/ 8) {
    				set_style(div4, "top", /*top*/ ctx[3] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Panel", slots, []);
    	let { category } = $$props;
    	let { modules } = $$props;
    	let expanded = localStorage.getItem(`clickgui.panel.${category}.expanded`) === "true" || localStorage.getItem(`clickgui.panel.${category}.expanded`) === null;
    	let renderedModules = modules;
    	let top = parseInt(localStorage.getItem(`clickgui.panel.${category}.top`)) || 0;
    	let left = parseInt(localStorage.getItem(`clickgui.panel.${category}.left`)) || 0;
    	let moving = false;
    	let prevX = 0;
    	let prevY = 0;

    	function onMouseDown() {
    		moving = true;
    	}

    	function onMouseMove(e) {
    		if (moving) {
    			$$invalidate(4, left += e.screenX - prevX);
    			$$invalidate(3, top += e.screenY - prevY);
    		}

    		prevX = e.screenX;
    		prevY = e.screenY;
    	}

    	function onMouseUp() {
    		moving = false;
    		localStorage.setItem(`clickgui.panel.${category}.top`, top);
    		localStorage.setItem(`clickgui.panel.${category}.left`, left);
    	}

    	function toggleExpanded(e) {
    		if (expanded) {
    			$$invalidate(1, expanded = false);
    			$$invalidate(2, renderedModules = []);
    		} else {
    			$$invalidate(1, expanded = true);
    			$$invalidate(2, renderedModules = modules);
    		}

    		localStorage.setItem(`clickgui.panel.${category}.expanded`, expanded);
    	}

    	window.addEventListener("mouseup", onMouseUp);
    	window.addEventListener("mousemove", onMouseMove);

    	function handleToggleModule(event) {
    		modules.find(m => m.name === event.getModule().getName()).enabled = event.getNewState();

    		if (expanded) {
    			$$invalidate(2, renderedModules = modules);
    		}
    	}

    	function handleToggleClick(event) {
    		if (event.button === 2) {
    			toggleExpanded();
    		}
    	}

    	try {
    		events.on("toggleModule", handleToggleModule);
    	} catch(err) {
    		console.log(err);
    	}

    	const writable_props = ["category", "modules"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Panel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("category" in $$props) $$invalidate(0, category = $$props.category);
    		if ("modules" in $$props) $$invalidate(8, modules = $$props.modules);
    	};

    	$$self.$capture_state = () => ({
    		sineInOut,
    		slide,
    		Module,
    		category,
    		modules,
    		expanded,
    		renderedModules,
    		top,
    		left,
    		moving,
    		prevX,
    		prevY,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		toggleExpanded,
    		handleToggleModule,
    		handleToggleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("category" in $$props) $$invalidate(0, category = $$props.category);
    		if ("modules" in $$props) $$invalidate(8, modules = $$props.modules);
    		if ("expanded" in $$props) $$invalidate(1, expanded = $$props.expanded);
    		if ("renderedModules" in $$props) $$invalidate(2, renderedModules = $$props.renderedModules);
    		if ("top" in $$props) $$invalidate(3, top = $$props.top);
    		if ("left" in $$props) $$invalidate(4, left = $$props.left);
    		if ("moving" in $$props) moving = $$props.moving;
    		if ("prevX" in $$props) prevX = $$props.prevX;
    		if ("prevY" in $$props) prevY = $$props.prevY;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		category,
    		expanded,
    		renderedModules,
    		top,
    		left,
    		onMouseDown,
    		toggleExpanded,
    		handleToggleClick,
    		modules
    	];
    }

    class Panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { category: 0, modules: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Panel",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*category*/ ctx[0] === undefined && !("category" in props)) {
    			console_1$1.warn("<Panel> was created without expected prop 'category'");
    		}

    		if (/*modules*/ ctx[8] === undefined && !("modules" in props)) {
    			console_1$1.warn("<Panel> was created without expected prop 'modules'");
    		}
    	}

    	get category() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modules() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modules(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ClickGui.svelte generated by Svelte v3.35.0 */

    const { console: console_1 } = globals;
    const file = "src\\ClickGui.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (29:4) {#if clickGuiOpened}
    function create_if_block(ctx) {
    	let div;
    	let current;
    	let each_value = /*categories*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "clickgui-container svelte-1fiwon3");
    			add_location(div, file, 29, 8, 729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories, getModulesOfCategory*/ 6) {
    				each_value = /*categories*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:4) {#if clickGuiOpened}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#each categories as category}
    function create_each_block(ctx) {
    	let panel;
    	let current;

    	panel = new Panel({
    			props: {
    				category: /*category*/ ctx[4],
    				modules: /*getModulesOfCategory*/ ctx[2](/*category*/ ctx[4])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(panel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(panel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(panel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(31:12) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let current;
    	let if_block = /*clickGuiOpened*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			add_location(main, file, 27, 0, 687);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*clickGuiOpened*/ ctx[0]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClickGui", slots, []);
    	let clickGuiOpened = true;
    	const categories = ["Combat", "Render", "Misc"];
    	const modules = [];

    	try {
    		const moduleIterator = client.getModuleManager().iterator();

    		while (moduleIterator.hasNext()) {
    			const m = moduleIterator.next();

    			modules.push({
    				category: m.getCategory().getReadableName(),
    				instance: m
    			});
    		}
    	} catch(err) {
    		console.log(err);
    	}

    	function getModulesOfCategory(category) {
    		return modules.filter(m => m.category === category);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ClickGui> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Panel,
    		clickGuiOpened,
    		categories,
    		modules,
    		getModulesOfCategory
    	});

    	$$self.$inject_state = $$props => {
    		if ("clickGuiOpened" in $$props) $$invalidate(0, clickGuiOpened = $$props.clickGuiOpened);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [clickGuiOpened, categories, getModulesOfCategory];
    }

    class ClickGui extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClickGui",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new ClickGui({
    	target: document.body,
    	props: {

    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
