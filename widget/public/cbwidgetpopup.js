
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var CBWidgetPopup = (function () {
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

  var css = "@import \"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\";\n\nmain {\n  background: #eee;\n}\n.seating {\n  background-color: var(--yellow);\n}\n\n.seating__col {\n  flex: 1 0 calc(100% / 10);\n  max-width: calc(100% / 10);\n}\n\n.seating__item {\n  transition: 0.3s ease;\n  cursor: pointer;\n  background-color: var(--yellow);\n}\n\n.seating__item.disabled {\n  color: white;\n  background-color: var(--red);\n}\n\n/* modal popup */\n.widget-cb {\n  padding: 30px;\n  box-shadow: 0 0 10px rgba(0, 0, 0,.4);\n  background-color: var(--white);\n  width: 80%;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  z-index: 9999;\n  transform: translate(-50%, -50%);\n  opacity: 0;\n  pointer-events: none;\n  transition: all 300ms ease-in-out;\n}\n\n.widget-cb.show {\n  opacity: 1;\n  pointer-events: auto;\n}\n";
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

  function destroy_block(block, lookup) {
      block.d(1);
      lookup.delete(block.key);
  }
  function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
      let o = old_blocks.length;
      let n = list.length;
      let i = o;
      const old_indexes = {};
      while (i--)
          old_indexes[old_blocks[i].key] = i;
      const new_blocks = [];
      const new_lookup = new Map();
      const deltas = new Map();
      i = n;
      while (i--) {
          const child_ctx = get_context(ctx, list, i);
          const key = get_key(child_ctx);
          let block = lookup.get(key);
          if (!block) {
              block = create_each_block(key, child_ctx);
              block.c();
          }
          else if (dynamic) {
              block.p(changed, child_ctx);
          }
          new_lookup.set(key, new_blocks[i] = block);
          if (key in old_indexes)
              deltas.set(key, Math.abs(i - old_indexes[key]));
      }
      const will_move = new Set();
      const did_move = new Set();
      function insert(block) {
          transition_in(block, 1);
          block.m(node, next);
          lookup.set(block.key, block);
          next = block.first;
          n--;
      }
      while (o && n) {
          const new_block = new_blocks[n - 1];
          const old_block = old_blocks[o - 1];
          const new_key = new_block.key;
          const old_key = old_block.key;
          if (new_block === old_block) {
              // do nothing
              next = new_block.first;
              o--;
              n--;
          }
          else if (!new_lookup.has(old_key)) {
              // remove old block
              destroy(old_block, lookup);
              o--;
          }
          else if (!lookup.has(new_key) || will_move.has(new_key)) {
              insert(new_block);
          }
          else if (did_move.has(old_key)) {
              o--;
          }
          else if (deltas.get(new_key) > deltas.get(old_key)) {
              did_move.add(new_key);
              insert(new_block);
          }
          else {
              will_move.add(old_key);
              o--;
          }
      }
      while (o--) {
          const old_block = old_blocks[o];
          if (!new_lookup.has(old_block.key))
              destroy(old_block, lookup);
      }
      while (n)
          insert(new_blocks[n - 1]);
      return new_blocks;
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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
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

  var seatingArr = _toConsumableArray(Array(100).keys()).map(function (item) {
    return {
      id: item,
      price: 120,
      disabled: false
    };
  });

  function seatingCreate() {
    var _writable = writable(seatingArr),
        subscribe = _writable.subscribe,
        update = _writable.update;

    return {
      subscribe: subscribe,
      toggleSeat: function toggleSeat(seatId) {
        update(function (seats) {
          seats[seatId].disabled = !seats[seatId].disabled;
          return seats;
        });
      }
    };
  }

  var seating = seatingCreate();

  /* src/view/seating/Index.svelte generated by Svelte v3.12.1 */

  const file = "src/view/seating/Index.svelte";

  function get_each_context(ctx, list, i) {
  	const child_ctx = Object.create(ctx);
  	child_ctx.seat = list[i];
  	return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
  	const child_ctx = Object.create(ctx);
  	child_ctx.item = list[i];
  	return child_ctx;
  }

  // (19:2) {#each selectedSeat as item}
  function create_each_block_1(ctx) {
  	var t0_value = ctx.item.id + "", t0, t1;

  	const block = {
  		c: function create() {
  			t0 = text(t0_value);
  			t1 = text(",");
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, t0, anchor);
  			insert_dev(target, t1, anchor);
  		},

  		p: function update(changed, ctx) {
  			if ((changed.selectedSeat) && t0_value !== (t0_value = ctx.item.id + "")) {
  				set_data_dev(t0, t0_value);
  			}
  		},

  		d: function destroy(detaching) {
  			if (detaching) {
  				detach_dev(t0);
  				detach_dev(t1);
  			}
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(19:2) {#each selectedSeat as item}", ctx });
  	return block;
  }

  // (23:4) {#each $seating as seat (seat.id)}
  function create_each_block(key_1, ctx) {
  	var div1, div0, t0_value = ctx.seat.id + "", t0, t1, dispose;

  	function click_handler(...args) {
  		return ctx.click_handler(ctx, ...args);
  	}

  	const block = {
  		key: key_1,

  		first: null,

  		c: function create() {
  			div1 = element("div");
  			div0 = element("div");
  			t0 = text(t0_value);
  			t1 = space();
  			attr_dev(div0, "class", "seating__item p-2 w-100 text-center border border-succes\n          rounded cursor-pointer");
  			toggle_class(div0, "disabled", ctx.seat.disabled);
  			add_location(div0, file, 24, 8, 625);
  			attr_dev(div1, "class", "seating__col p-1 d-flex");
  			add_location(div1, file, 23, 6, 579);
  			dispose = listen_dev(div0, "click", click_handler);
  			this.first = div1;
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, div1, anchor);
  			append_dev(div1, div0);
  			append_dev(div0, t0);
  			append_dev(div1, t1);
  		},

  		p: function update(changed, new_ctx) {
  			ctx = new_ctx;
  			if ((changed.$seating) && t0_value !== (t0_value = ctx.seat.id + "")) {
  				set_data_dev(t0, t0_value);
  			}

  			if (changed.$seating) {
  				toggle_class(div0, "disabled", ctx.seat.disabled);
  			}
  		},

  		d: function destroy(detaching) {
  			if (detaching) {
  				detach_dev(div1);
  			}

  			dispose();
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(23:4) {#each $seating as seat (seat.id)}", ctx });
  	return block;
  }

  function create_fragment(ctx) {
  	var div0, t0, t1, t2, div1, t3, t4, section, div2, each_blocks = [], each1_lookup = new Map();

  	let each_value_1 = ctx.selectedSeat;

  	let each_blocks_1 = [];

  	for (let i = 0; i < each_value_1.length; i += 1) {
  		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  	}

  	let each_value = ctx.$seating;

  	const get_key = ctx => ctx.seat.id;

  	for (let i = 0; i < each_value.length; i += 1) {
  		let child_ctx = get_each_context(ctx, each_value, i);
  		let key = get_key(child_ctx);
  		each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  	}

  	const block = {
  		c: function create() {
  			div0 = element("div");
  			t0 = text("Цена: ");
  			t1 = text(ctx.sum);
  			t2 = space();
  			div1 = element("div");
  			t3 = text("Выбранные места:\n  ");

  			for (let i = 0; i < each_blocks_1.length; i += 1) {
  				each_blocks_1[i].c();
  			}

  			t4 = space();
  			section = element("section");
  			div2 = element("div");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}
  			attr_dev(div0, "class", "mb-2");
  			add_location(div0, file, 15, 0, 330);
  			attr_dev(div1, "class", "mb-3");
  			add_location(div1, file, 16, 0, 366);
  			attr_dev(div2, "class", "d-flex flex-wrap");
  			add_location(div2, file, 21, 2, 503);
  			attr_dev(section, "class", "section section_seating");
  			add_location(section, file, 20, 0, 459);
  		},

  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, div0, anchor);
  			append_dev(div0, t0);
  			append_dev(div0, t1);
  			insert_dev(target, t2, anchor);
  			insert_dev(target, div1, anchor);
  			append_dev(div1, t3);

  			for (let i = 0; i < each_blocks_1.length; i += 1) {
  				each_blocks_1[i].m(div1, null);
  			}

  			insert_dev(target, t4, anchor);
  			insert_dev(target, section, anchor);
  			append_dev(section, div2);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(div2, null);
  			}
  		},

  		p: function update(changed, ctx) {
  			if (changed.sum) {
  				set_data_dev(t1, ctx.sum);
  			}

  			if (changed.selectedSeat) {
  				each_value_1 = ctx.selectedSeat;

  				let i;
  				for (i = 0; i < each_value_1.length; i += 1) {
  					const child_ctx = get_each_context_1(ctx, each_value_1, i);

  					if (each_blocks_1[i]) {
  						each_blocks_1[i].p(changed, child_ctx);
  					} else {
  						each_blocks_1[i] = create_each_block_1(child_ctx);
  						each_blocks_1[i].c();
  						each_blocks_1[i].m(div1, null);
  					}
  				}

  				for (; i < each_blocks_1.length; i += 1) {
  					each_blocks_1[i].d(1);
  				}
  				each_blocks_1.length = each_value_1.length;
  			}

  			const each_value = ctx.$seating;
  			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each1_lookup, div2, destroy_block, create_each_block, null, get_each_context);
  		},

  		i: noop,
  		o: noop,

  		d: function destroy(detaching) {
  			if (detaching) {
  				detach_dev(div0);
  				detach_dev(t2);
  				detach_dev(div1);
  			}

  			destroy_each(each_blocks_1, detaching);

  			if (detaching) {
  				detach_dev(t4);
  				detach_dev(section);
  			}

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].d();
  			}
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
  	return block;
  }

  function addToOrder(seat) {
    const { id } = seat;

    seating.toggleSeat(id);
  }

  function instance($$self, $$props, $$invalidate) {
  	let $seating;

  	validate_store(seating, 'seating');
  	component_subscribe($$self, seating, $$value => { $seating = $$value; $$invalidate('$seating', $seating); });

  	const click_handler = ({ seat }, e) => addToOrder(seat);

  	$$self.$capture_state = () => {
  		return {};
  	};

  	$$self.$inject_state = $$props => {
  		if ('selectedSeat' in $$props) $$invalidate('selectedSeat', selectedSeat = $$props.selectedSeat);
  		if ('$seating' in $$props) seating.set($seating);
  		if ('sum' in $$props) $$invalidate('sum', sum = $$props.sum);
  	};

  	let selectedSeat, sum;

  	$$self.$$.update = ($$dirty = { $seating: 1, selectedSeat: 1 }) => {
  		if ($$dirty.$seating) { $$invalidate('selectedSeat', selectedSeat = $seating.filter(item => item.disabled === true)); }
  		if ($$dirty.selectedSeat) { $$invalidate('sum', sum = selectedSeat.reduce((sum, item) => sum + item.price, 0)); }
  	};

  	return {
  		selectedSeat,
  		$seating,
  		sum,
  		click_handler
  	};
  }

  class Index extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance, create_fragment, safe_not_equal, []);
  		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Index", options, id: create_fragment.name });
  	}
  }

  /* src/App.svelte generated by Svelte v3.12.1 */

  const file$1 = "src/App.svelte";

  function create_fragment$1(ctx) {
  	var div1, div0, h1, t_1, current;

  	var seating = new Index({ $$inline: true });

  	const block = {
  		c: function create() {
  			div1 = element("div");
  			div0 = element("div");
  			h1 = element("h1");
  			h1.textContent = "Выберите место";
  			t_1 = space();
  			seating.$$.fragment.c();
  			add_location(h1, file$1, 8, 4, 144);
  			attr_dev(div0, "class", "wmodal");
  			add_location(div0, file$1, 7, 2, 119);
  			attr_dev(div1, "class", "widget-cb");
  			add_location(div1, file$1, 6, 0, 93);
  		},

  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},

  		m: function mount(target, anchor) {
  			insert_dev(target, div1, anchor);
  			append_dev(div1, div0);
  			append_dev(div0, h1);
  			append_dev(div0, t_1);
  			mount_component(seating, div0, null);
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
  				detach_dev(div1);
  			}

  			destroy_component(seating);
  		}
  	};
  	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
  	return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
  	let { CBID } = $$props;

  	const writable_props = ['CBID'];
  	Object.keys($$props).forEach(key => {
  		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<App> was created with unknown prop '${key}'`);
  	});

  	$$self.$set = $$props => {
  		if ('CBID' in $$props) $$invalidate('CBID', CBID = $$props.CBID);
  	};

  	$$self.$capture_state = () => {
  		return { CBID };
  	};

  	$$self.$inject_state = $$props => {
  		if ('CBID' in $$props) $$invalidate('CBID', CBID = $$props.CBID);
  	};

  	return { CBID };
  }

  class App extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["CBID"]);
  		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$1.name });

  		const { ctx } = this.$$;
  		const props = options.props || {};
  		if (ctx.CBID === undefined && !('CBID' in props)) {
  			console.warn("<App> was created without expected prop 'CBID'");
  		}
  	}

  	get CBID() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set CBID(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  var CBWidgetPopup = new App({
    target: document.body,
    props: {
      CBID: null
    }
  });

  return CBWidgetPopup;

}());
//# sourceMappingURL=cbwidgetpopup.js.map
