
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "@import \"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\";\n\nmain {\n  background: #eee;\n}\n\n.seating {\n  background-color: var(--yellow);\n}\n\n.seating__col {\n  flex: 1 0 calc(100% / 10);\n  max-width: calc(100% / 10);\n}\n\n.seating__item {\n  background-color: var(--yellow);\n}\n\n.seating__item.disabled {\n  background-color: var(--red);\n}\n";
  styleInject(css);

  function noop() { }
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
  function validate_store(store, name) {
      if (!store || typeof store.subscribe !== 'function') {
          throw new Error(`'${name}' is not a store with a 'subscribe' method`);
      }
  }
  function subscribe(store, callback) {
      const unsub = store.subscribe(callback);
      return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function component_subscribe(component, store, callback) {
      component.$$.on_destroy.push(subscribe(store, callback));
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
  function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else
          node.setAttribute(attribute, value);
  }
  function children(element) {
      return Array.from(element.childNodes);
  }
  function toggle_class(element, name, toggle) {
      element.classList[toggle ? 'add' : 'remove'](name);
  }
  function custom_event(type, detail) {
      const e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, false, false, detail);
      return e;
  }

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }
  function createEventDispatcher() {
      const component = current_component;
      return (type, detail) => {
          const callbacks = component.$$.callbacks[type];
          if (callbacks) {
              // TODO are there situations where events could be dispatched
              // in a server (non-DOM) environment?
              const event = custom_event(type, detail);
              callbacks.slice().forEach(fn => {
                  fn.call(component, event);
              });
          }
      };
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
  function flush() {
      const seen_callbacks = new Set();
      do {
          // first, call beforeUpdate functions
          // and update components
          while (dirty_components.length) {
              const component = dirty_components.shift();
              set_current_component(component);
              update(component.$$);
          }
          while (binding_callbacks.length)
              binding_callbacks.pop()();
          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
              const callback = render_callbacks[i];
              if (!seen_callbacks.has(callback)) {
                  callback();
                  // ...so guard against infinite loops
                  seen_callbacks.add(callback);
              }
          }
          render_callbacks.length = 0;
      } while (dirty_components.length);
      while (flush_callbacks.length) {
          flush_callbacks.pop()();
      }
      update_scheduled = false;
  }
  function update($$) {
      if ($$.fragment) {
          $$.update($$.dirty);
          run_all($$.before_update);
          $$.fragment.p($$.dirty, $$.ctx);
          $$.dirty = null;
          $$.after_update.forEach(add_render_callback);
      }
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
  function mount_component(component, target, anchor) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment.m(target, anchor);
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
      after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
      if (component.$$.fragment) {
          run_all(component.$$.on_destroy);
          component.$$.fragment.d(detaching);
          // TODO null out other refs, including component.$$ (but need to
          // preserve final state?)
          component.$$.on_destroy = component.$$.fragment = null;
          component.$$.ctx = {};
      }
  }
  function make_dirty(component, key) {
      if (!component.$$.dirty) {
          dirty_components.push(component);
          schedule_update();
          component.$$.dirty = blank_object();
      }
      component.$$.dirty[key] = true;
  }
  function init(component, options, instance, create_fragment, not_equal, prop_names) {
      const parent_component = current_component;
      set_current_component(component);
      const props = options.props || {};
      const $$ = component.$$ = {
          fragment: null,
          ctx: null,
          // state
          props: prop_names,
          update: noop,
          not_equal,
          bound: blank_object(),
          // lifecycle
          on_mount: [],
          on_destroy: [],
          before_update: [],
          after_update: [],
          context: new Map(parent_component ? parent_component.$$.context : []),
          // everything else
          callbacks: blank_object(),
          dirty: null
      };
      let ready = false;
      $$.ctx = instance
          ? instance(component, props, (key, ret, value = ret) => {
              if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                  if ($$.bound[key])
                      $$.bound[key](value);
                  if (ready)
                      make_dirty(component, key);
              }
              return ret;
          })
          : props;
      $$.update();
      ready = true;
      run_all($$.before_update);
      $$.fragment = create_fragment($$.ctx);
      if (options.target) {
          if (options.hydrate) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment.l(children(options.target));
          }
          else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment.c();
          }
          if (options.intro)
              transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor);
          flush();
      }
      set_current_component(parent_component);
  }
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
      $set() {
          // overridden by instance, if it has props
      }
  }

  function dispatch_dev(type, detail) {
      document.dispatchEvent(custom_event(type, detail));
  }
  function append_dev(target, node) {
      dispatch_dev("SvelteDOMInsert", { target, node });
      append(target, node);
  }
  function insert_dev(target, node, anchor) {
      dispatch_dev("SvelteDOMInsert", { target, node, anchor });
      insert(target, node, anchor);
  }
  function detach_dev(node) {
      dispatch_dev("SvelteDOMRemove", { node });
      detach(node);
  }
  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
      const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
      if (has_prevent_default)
          modifiers.push('preventDefault');
      if (has_stop_propagation)
          modifiers.push('stopPropagation');
      dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
      const dispose = listen(node, event, handler, options);
      return () => {
          dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
          dispose();
      };
  }
  function attr_dev(node, attribute, value) {
      attr(node, attribute, value);
      if (value == null)
          dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
      else
          dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function set_data_dev(text, data) {
      data = '' + data;
      if (text.data === data)
          return;
      dispatch_dev("SvelteDOMSetData", { node: text, data });
      text.data = data;
  }
  class SvelteComponentDev extends SvelteComponent {
      constructor(options) {
          if (!options || (!options.target && !options.$$inline)) {
              throw new Error(`'target' is a required option`);
          }
          super();
      }
      $destroy() {
          super.$destroy();
          this.$destroy = () => {
              console.warn(`Component was already destroyed`); // eslint-disable-line no-console
          };
      }
  }

  /* src/view/seating/Seat.svelte generated by Svelte v3.12.1 */

  const file = "src/view/seating/Seat.svelte";

  function create_fragment(ctx) {
  	var div, t, dispose;

  	const block = {
  		c: function create() {
  			div = element("div");
  			t = text(ctx.id);
  			attr_dev(div, "class", "seating__item p-2 w-100 text-center border border-succes rounded\n  cursor-pointer");
  			toggle_class(div, "disabled", ctx.disabled);
  			add_location(div, file, 16, 0, 262);
  			dispose = listen_dev(div, "click", ctx.dispatchPrice);
  		},

  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			append_dev(div, t);
  		},

  		p: function update(changed, ctx) {
  			if (changed.disabled) {
  				toggle_class(div, "disabled", ctx.disabled);
  			}
  		},

  		i: noop,
  		o: noop,

  		d: function destroy(detaching) {
  			if (detaching) {
  				detach_dev(div);
  			}

  			dispose();
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
  	return block;
  }

  function instance($$self, $$props, $$invalidate) {
  	let { seat } = $$props;

    const { price, id, disabled } = seat;

    const dispatch = createEventDispatcher();

    function dispatchPrice(price) {
      dispatch("clickSeat", {
        seat
      });
    }

  	const writable_props = ['seat'];
  	Object.keys($$props).forEach(key => {
  		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Seat> was created with unknown prop '${key}'`);
  	});

  	$$self.$set = $$props => {
  		if ('seat' in $$props) $$invalidate('seat', seat = $$props.seat);
  	};

  	$$self.$capture_state = () => {
  		return { seat };
  	};

  	$$self.$inject_state = $$props => {
  		if ('seat' in $$props) $$invalidate('seat', seat = $$props.seat);
  	};

  	return { seat, id, disabled, dispatchPrice };
  }

  class Seat extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance, create_fragment, safe_not_equal, ["seat"]);
  		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Seat", options, id: create_fragment.name });

  		const { ctx } = this.$$;
  		const props = options.props || {};
  		if (ctx.seat === undefined && !('seat' in props)) {
  			console.warn("<Seat> was created without expected prop 'seat'");
  		}
  	}

  	get seat() {
  		throw new Error("<Seat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set seat(value) {
  		throw new Error("<Seat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  const subscriber_queue = [];
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  function writable(value, start = noop) {
      let stop;
      const subscribers = [];
      function set(new_value) {
          if (safe_not_equal(value, new_value)) {
              value = new_value;
              if (stop) { // store is ready
                  const run_queue = !subscriber_queue.length;
                  for (let i = 0; i < subscribers.length; i += 1) {
                      const s = subscribers[i];
                      s[1]();
                      subscriber_queue.push(s, value);
                  }
                  if (run_queue) {
                      for (let i = 0; i < subscriber_queue.length; i += 2) {
                          subscriber_queue[i][0](subscriber_queue[i + 1]);
                      }
                      subscriber_queue.length = 0;
                  }
              }
          }
      }
      function update(fn) {
          set(fn(value));
      }
      function subscribe(run, invalidate = noop) {
          const subscriber = [run, invalidate];
          subscribers.push(subscriber);
          if (subscribers.length === 1) {
              stop = start(set) || noop;
          }
          run(value);
          return () => {
              const index = subscribers.indexOf(subscriber);
              if (index !== -1) {
                  subscribers.splice(index, 1);
              }
              if (subscribers.length === 0) {
                  stop();
                  stop = null;
              }
          };
      }
      return { set, update, subscribe };
  }

  const summ = writable(0);

  /* src/view/seating/Seating.svelte generated by Svelte v3.12.1 */

  const file$1 = "src/view/seating/Seating.svelte";

  function get_each_context(ctx, list, i) {
  	const child_ctx = Object.create(ctx);
  	child_ctx.seat = list[i];
  	child_ctx.i = i;
  	return child_ctx;
  }

  // (25:4) {#each seatings as seat, i}
  function create_each_block(ctx) {
  	var div, t, current;

  	var seat = new Seat({
  		props: { seat: ctx.seat },
  		$$inline: true
  	});
  	seat.$on("clickSeat", ctx.addToOrder);

  	const block = {
  		c: function create() {
  			div = element("div");
  			seat.$$.fragment.c();
  			t = space();
  			attr_dev(div, "class", "seating__col p-1 d-flex");
  			add_location(div, file$1, 25, 6, 531);
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			mount_component(seat, div, null);
  			append_dev(div, t);
  			current = true;
  		},

  		p: noop,

  		i: function intro(local) {
  			if (current) return;
  			transition_in(seat.$$.fragment, local);

  			current = true;
  		},

  		o: function outro(local) {
  			transition_out(seat.$$.fragment, local);
  			current = false;
  		},

  		d: function destroy(detaching) {
  			if (detaching) {
  				detach_dev(div);
  			}

  			destroy_component(seat);
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(25:4) {#each seatings as seat, i}", ctx });
  	return block;
  }

  function create_fragment$1(ctx) {
  	var div0, t0, t1, t2, section, div1, current;

  	let each_value = ctx.seatings;

  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	const block = {
  		c: function create() {
  			div0 = element("div");
  			t0 = text("Цена: ");
  			t1 = text(ctx.$summ);
  			t2 = space();
  			section = element("section");
  			div1 = element("div");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}
  			attr_dev(div0, "class", "mb-3");
  			add_location(div0, file$1, 20, 0, 379);
  			attr_dev(div1, "class", "d-flex flex-wrap");
  			add_location(div1, file$1, 23, 2, 462);
  			attr_dev(section, "class", "section section_seating");
  			add_location(section, file$1, 22, 0, 418);
  		},

  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, div0, anchor);
  			append_dev(div0, t0);
  			append_dev(div0, t1);
  			insert_dev(target, t2, anchor);
  			insert_dev(target, section, anchor);
  			append_dev(section, div1);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(div1, null);
  			}

  			current = true;
  		},

  		p: function update(changed, ctx) {
  			if (!current || changed.$summ) {
  				set_data_dev(t1, ctx.$summ);
  			}

  			if (changed.seatings) {
  				each_value = ctx.seatings;

  				let i;
  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(changed, child_ctx);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(div1, null);
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
  			if (detaching) {
  				detach_dev(div0);
  				detach_dev(t2);
  				detach_dev(section);
  			}

  			destroy_each(each_blocks, detaching);
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
  	return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
  	let $summ;

  	validate_store(summ, 'summ');
  	component_subscribe($$self, summ, $$value => { $summ = $$value; $$invalidate('$summ', $summ); });

  	

    const seatings = [...Array(100).keys()].map(item => ({
      id: item,
      price: 120,
      disabled: false,
    }));

    function addToOrder(event) {
      const { seat } = event.detail;
      summ.update(n => n + seat.price);
    }

  	$$self.$capture_state = () => {
  		return {};
  	};

  	$$self.$inject_state = $$props => {
  		if ('$summ' in $$props) summ.set($summ);
  	};

  	return { seatings, addToOrder, $summ };
  }

  class Seating extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
  		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Seating", options, id: create_fragment$1.name });
  	}
  }

  /* src/App.svelte generated by Svelte v3.12.1 */

  const file$2 = "src/App.svelte";

  function create_fragment$2(ctx) {
  	var main, h1, t_1, current;

  	var seating = new Seating({ $$inline: true });

  	const block = {
  		c: function create() {
  			main = element("main");
  			h1 = element("h1");
  			h1.textContent = "Выберите место";
  			t_1 = space();
  			seating.$$.fragment.c();
  			add_location(h1, file$2, 7, 2, 116);
  			attr_dev(main, "class", "p-2");
  			add_location(main, file$2, 6, 0, 95);
  		},

  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, main, anchor);
  			append_dev(main, h1);
  			append_dev(main, t_1);
  			mount_component(seating, main, null);
  			current = true;
  		},

  		p: noop,

  		i: function intro(local) {
  			if (current) return;
  			transition_in(seating.$$.fragment, local);

  			current = true;
  		},

  		o: function outro(local) {
  			transition_out(seating.$$.fragment, local);
  			current = false;
  		},

  		d: function destroy(detaching) {
  			if (detaching) {
  				detach_dev(main);
  			}

  			destroy_component(seating);
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
  	return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
  	let { name } = $$props;

  	const writable_props = ['name'];
  	Object.keys($$props).forEach(key => {
  		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<App> was created with unknown prop '${key}'`);
  	});

  	$$self.$set = $$props => {
  		if ('name' in $$props) $$invalidate('name', name = $$props.name);
  	};

  	$$self.$capture_state = () => {
  		return { name };
  	};

  	$$self.$inject_state = $$props => {
  		if ('name' in $$props) $$invalidate('name', name = $$props.name);
  	};

  	return { name };
  }

  class App extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["name"]);
  		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$2.name });

  		const { ctx } = this.$$;
  		const props = options.props || {};
  		if (ctx.name === undefined && !('name' in props)) {
  			console.warn("<App> was created without expected prop 'name'");
  		}
  	}

  	get name() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set name(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  const app = new App({
  	target: document.body,
  	props: {
  		name: 'world'
  	}
  });

  return app;

}());
//# sourceMappingURL=cinemabox.js.map
