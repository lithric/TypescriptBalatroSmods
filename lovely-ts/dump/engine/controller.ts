///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

class Controller extends LuaObject {
  clicked: { target?: LuaNode; handled: boolean; prev_target?: LuaNode };
  focused: { target?: LuaNode; handled: boolean; prev_target?: LuaNode };
  dragging: { target?: LuaNode; handled: boolean; prev_target?: LuaNode };
  hovering: { target?: LuaNode; handled: boolean; prev_target?: LuaNode };
  released_on: { target?: LuaNode; handled: boolean; prev_target?: LuaNode };
  collision_list: LuaNode[];
  cursor_down: {
    T: TransformValue | Position2D;
    target?: LuaNode;
    time: number;
    handled: boolean;
    prev_target?: LuaNode;
  };
  cursor_up: {
    T: TransformValue | Position2D;
    target?: LuaNode;
    time: number;
    handled: boolean;
    prev_target?: LuaNode;
  };
  cursor_hover: {
    T: TransformValue | Position2D;
    target?: LuaNode;
    time: number;
    handled: boolean;
    prev_target?: LuaNode;
  };
  cursor_collider: undefined;
  cursor_position: Position2D;
  pressed_keys: [];
  held_keys: {};
  held_key_times: {};
  released_keys: [];
  pressed_buttons: [];
  held_buttons: {};
  held_button_times: {};
  released_buttons: [];
  interrupt: {
    stack?: any;
    focus: boolean;
  };
  locks: {};
  locked?: boolean;
  axis_buttons: {
    l_stick: { current: string; previous: string };
    r_stick: { current: string; previous: string };
    l_trig: { current: string; previous: string };
    r_trig: { current: string; previous: string };
  };
  axis_cursor_speed: number;
  button_registry: {};
  snap_cursor_to: undefined;
  cursor_context: { layer: number; stack: {} };
  cardarea_context: {};
  HID: {
    last_type: string;
    dpad: boolean;
    pointer: boolean;
    touch: boolean;
    controller: boolean;
    mouse: boolean;
    axis_cursor: boolean;
  };
  GAMEPAD: {
    temp_console: string | number | symbol;
    object: undefined;
    mapping: undefined;
    name: undefined;
  };
  GAMEPAD_CONSOLE: string;
  keyboard_controller: { getGamepadMappingString: () => string; getGamepadAxis: () => number };
  is_cursor_down: boolean;
  overlay_timer: number;
  frame_buttonpress: boolean;
  COYOTE_FOCUS: any;
  L_cursor_queue: any;
  no_holdcap: any;
  repress_timer: any;
  text_input_hook: any;
  capslock: boolean;
  nodes_at_cursor: LuaNode[];
  screen_keyboard: any;
  constructor() {
    super();
    this.clicked = { target: undefined, handled: true, prev_target: undefined };
    this.focused = { target: undefined, handled: true, prev_target: undefined };
    this.dragging = { target: undefined, handled: true, prev_target: undefined };
    this.hovering = { target: undefined, handled: true, prev_target: undefined };
    this.released_on = { target: undefined, handled: true, prev_target: undefined };
    this.collision_list = [];
    this.cursor_down = { T: { x: 0, y: 0 }, target: undefined, time: 0, handled: true };
    this.cursor_up = { T: { x: 0, y: 0 }, target: undefined, time: 0.1, handled: true };
    this.cursor_hover = { T: { x: 0, y: 0 }, target: undefined, time: 0, handled: true };
    this.cursor_collider = undefined;
    this.cursor_position = { x: 0, y: 0 };
    this.pressed_keys = [];
    this.held_keys = {};
    this.held_key_times = {};
    this.released_keys = [];
    this.pressed_buttons = [];
    this.held_buttons = {};
    this.held_button_times = {};
    this.released_buttons = [];
    this.interrupt = { focus: false };
    this.locks = {};
    this.locked = undefined;
    this.axis_buttons = {
      l_stick: { current: "", previous: "" },
      r_stick: { current: "", previous: "" },
      l_trig: { current: "", previous: "" },
      r_trig: { current: "", previous: "" },
    };
    this.axis_cursor_speed = 20;
    this.button_registry = {};
    this.snap_cursor_to = undefined;
    this.cursor_context = { layer: 1, stack: {} };
    this.cardarea_context = {};
    this.HID = {
      last_type: "",
      dpad: false,
      pointer: true,
      touch: false,
      controller: false,
      mouse: true,
      axis_cursor: false,
    };
    this.GAMEPAD = { object: undefined, mapping: undefined, name: undefined };
    this.GAMEPAD_CONSOLE = "";
    this.keyboard_controller = {
      getGamepadMappingString: function () {
        return "balatro_kbm";
      },
      getGamepadAxis: function () {
        return 0;
      },
    };
    this.is_cursor_down = false;
  }
  set_gamepad(_gamepad) {
    if (this.GAMEPAD.object !== _gamepad) {
      this.GAMEPAD.object = _gamepad;
      this.GAMEPAD.mapping = _gamepad.getGamepadMappingString() || "";
      this.GAMEPAD.name = this.GAMEPAD.mapping.match("^%x*,(.-),") || "";
      this.GAMEPAD.temp_console = this.get_console_from_gamepad(this.GAMEPAD.name);
      if (this.GAMEPAD_CONSOLE !== this.GAMEPAD.temp_console) {
        this.GAMEPAD_CONSOLE = this.GAMEPAD.temp_console;
        for (const [k, v] of pairs(G.I.SPRITE)) {
          if ((v as Sprite).atlas === G.ASSET_ATLAS["gamepad_ui"]) {
            (v as Sprite).sprite_pos.y =
              (G.CONTROLLER.GAMEPAD_CONSOLE === "Nintendo" && 2) ||
              (G.CONTROLLER.GAMEPAD_CONSOLE === "Playstation" &&
                ((G.F_PS4_PLAYSTATION_GLYPHS && 3) || 1)) ||
              0;
            (v as Sprite).set_sprite_pos((v as Sprite).sprite_pos);
          }
        }
      }
      this.GAMEPAD.temp_console = undefined;
    }
  }
  get_console_from_gamepad(_gamepad) {
    G.ARGS.gamepad_patterns = G.ARGS.gamepad_patterns || {
      Playstation: ["%f[%w]PS%d%f[%D]", "Sony%f[%W]", "Play[Ss]tation"],
      Nintendo: [
        "Wii%f[%L]",
        "%f[%u]S?NES%f[%U]",
        "%f[%l]s?nes%f[%L]",
        "%f[%u]Switch%f[%L]",
        "Joy[- ]Cons?%f[%L]",
      ],
    };
    for (const [k, v] of pairs(G.ARGS.gamepad_patterns)) {
      for (const [kk, vv] of ipairs(v)) {
        if (_gamepad.match(vv)) {
          return k;
        }
      }
    }
    return "Xbox";
  }
  set_HID_flags(HID_type, button) {
    if (HID_type === "axis") {
      this.HID.controller = true;
      this.HID.last_type = "axis";
    } else if (HID_type && HID_type !== this.HID.last_type) {
      this.HID.dpad = HID_type === "button";
      this.HID.pointer = HID_type === "mouse" || HID_type === "axis_cursor" || HID_type === "touch";
      this.HID.controller = HID_type === "button" || HID_type === "axis_cursor";
      this.HID.mouse = HID_type === "mouse";
      this.HID.touch = HID_type === "touch";
      this.HID.axis_cursor = HID_type === "axis_cursor";
      this.HID.last_type = HID_type;
      if (this.HID.mouse) {
        love.mouse.setVisible(true);
      } else {
        love.mouse.setVisible(false);
      }
    }
    if (!this.HID.controller) {
      this.GAMEPAD_CONSOLE = "";
      this.GAMEPAD.object = undefined;
      this.GAMEPAD.mapping = undefined;
      this.GAMEPAD.name = undefined;
    }
  }
  set_cursor_position() {
    if (this.HID.mouse || this.HID.touch) {
      this.interrupt.focus = false;
      if (this.focused.target) {
        this.focused.target.states.focus.is = false;
        this.focused.target = undefined;
      }
      [this.cursor_position.x, this.cursor_position.y] = love.mouse.getPosition();
      G.CURSOR.T.x = this.cursor_position.x / (G.TILESCALE * G.TILESIZE);
      G.CURSOR.T.y = this.cursor_position.y / (G.TILESCALE * G.TILESIZE);
      G.CURSOR.VT.x = G.CURSOR.T.x;
      G.CURSOR.VT.y = G.CURSOR.T.y;
    }
  }
  update(dt: number) {
    this.locked = false;
    if (G.screenwipe) {
      this.locks.wipe = true;
    } else {
      this.locks.wipe = false;
    }
    for (const [k, v] of pairs(this.locks)) {
      if (v) {
        this.locked = true;
      }
    }
    if (this.locks.frame_set) {
      this.locks.frame_set = undefined;
      this.overlay_timer = 0;
      G.E_MANAGER.add_event(
        new GameEvent({
          trigger: "after",
          delay: 0.1,
          timer: "UPTIME",
          blocking: false,
          blockable: false,
          no_delete: true,
          func: function () {
            this.locks.frame = undefined;
            return true;
          },
        })
      );
    }
    this.overlay_timer = this.overlay_timer || 0;
    if (G.OVERLAY_MENU) {
      this.overlay_timer = this.overlay_timer + dt;
    } else {
      this.overlay_timer = 0;
    }
    if (this.overlay_timer > 1.5) {
      this.locks.frame = undefined;
    }
    this.cull_registry();
    this.set_HID_flags(this.update_axis(dt));
    if (this.HID.pointer && !(this.HID.mouse || this.HID.touch) && !this.interrupt.focus) {
      G.CURSOR.states.visible = true;
    } else {
      G.CURSOR.states.visible = false;
    }
    this.set_cursor_position();
    if (!G.screenwipe) {
      for (const [k, v] of pairs(this.pressed_keys)) {
        if (v) {
          this.key_press_update(k, dt);
        }
      }
      for (const [k, v] of pairs(this.held_keys)) {
        if (v) {
          this.key_hold_update(k, dt);
        }
      }
      for (const [k, v] of pairs(this.released_keys)) {
        if (v) {
          this.key_release_update(k, dt);
        }
      }
      for (const [k, v] of pairs(this.pressed_buttons)) {
        if (v) {
          this.button_press_update(k, dt);
        }
      }
      for (const [k, v] of pairs(this.held_buttons)) {
        if (v) {
          this.button_hold_update(k, dt);
        }
      }
      for (const [k, v] of pairs(this.released_buttons)) {
        if (v) {
          this.button_release_update(k, dt);
        }
      }
    }
    this.frame_buttonpress = false;
    this.pressed_keys = EMPTY(this.pressed_keys);
    this.released_keys = EMPTY(this.released_keys);
    this.pressed_buttons = EMPTY(this.pressed_buttons);
    this.released_buttons = EMPTY(this.released_buttons);
    if (this.HID.controller) {
      if (this.cursor_context.stack[this.cursor_context.layer]) {
        let _context = this.cursor_context.stack[this.cursor_context.layer];
        this.snap_to({
          node: _context.node && !_context.node.REMOVED && _context.node,
          T: _context.cursor_pos,
        });
        this.interrupt.stack = _context.interrupt;
        this.cursor_context.stack[this.cursor_context.layer] = undefined;
      }
      if (
        this.dragging.prev_target &&
        !this.dragging.target &&
        getmetatable(this.dragging.prev_target) === Card &&
        !this.dragging.prev_target.REMOVED
      ) {
        if (!this.COYOTE_FOCUS) {
          this.snap_to({ node: this.dragging.prev_target });
        } else {
          this.COYOTE_FOCUS = undefined;
        }
      }
      if (this.snap_cursor_to) {
        this.interrupt.focus = this.interrupt.stack;
        this.interrupt.stack = false;
        if (this.snap_cursor_to.type === "node" && !this.snap_cursor_to.node.REMOVED) {
          this.focused.prev_target = this.focused.target;
          this.focused.target = this.snap_cursor_to.node;
          this.update_cursor();
        } else if (this.snap_cursor_to.type === "transform") {
          this.update_cursor(this.snap_cursor_to.T);
        }
        if (this.focused.prev_target !== this.focused.target && this.focused.prev_target) {
          this.focused.prev_target.states.focus.is = false;
        }
        this.snap_cursor_to = undefined;
      }
    }
    this.get_cursor_collision(G.CURSOR.T);
    this.update_focus();
    this.set_cursor_hover();
    if (this.L_cursor_queue) {
      this.L_cursor_press(this.L_cursor_queue.x, this.L_cursor_queue.y);
      this.L_cursor_queue = undefined;
    }
    this.dragging.prev_target = this.dragging.target;
    this.released_on.prev_target = this.released_on.target;
    this.clicked.prev_target = this.clicked.target;
    this.hovering.prev_target = this.hovering.target;
    if (!this.cursor_down.handled) {
      if (this.cursor_down.target?.states.drag.can) {
        this.cursor_down.target.states.drag.is = true;
        this.cursor_down.target.set_offset(this.cursor_down.T, "Click");
        this.dragging.target = this.cursor_down.target;
        this.dragging.handled = false;
      }
      this.cursor_down.handled = true;
    }
    if (!this.cursor_up.handled) {
      if (this.dragging.target) {
        this.dragging.target.stop_drag();
        this.dragging.target.states.drag.is = false;
        this.dragging.target = undefined;
      }
      if (this.cursor_down.target) {
        if (
          !this.cursor_down.target?.click_timeout ||
          this.cursor_down.target.click_timeout * G.SPEEDFACTOR >
            this.cursor_up.time - this.cursor_down.time
        ) {
          if (
            Vector_Dist(this.cursor_down.T as TransformValue, this.cursor_up.T as TransformValue) <
            G.MIN_CLICK_DIST
          ) {
            if (this.cursor_down.target.states.click.can) {
              this.clicked.target = this.cursor_down.target;
              this.clicked.handled = false;
            }
          } else if (
            this.dragging.prev_target &&
            this.cursor_up.target &&
            this.cursor_up.target.states.release_on.can
          ) {
            this.released_on.target = this.cursor_up.target;
            this.released_on.handled = false;
          }
        }
      }
      this.cursor_up.handled = true;
    }
    if (
      this.cursor_hover.target &&
      this.cursor_hover.target.states.hover.can &&
      (!this.HID.touch || this.is_cursor_down)
    ) {
      this.hovering.target = this.cursor_hover.target;
      if (this.hovering.prev_target && this.hovering.prev_target !== this.hovering.target) {
        this.hovering.prev_target.states.hover.is = false;
      }
      this.hovering.target.states.hover.is = true;
      this.hovering.target.set_offset(this.cursor_hover.T, "Hover");
    } else if (
      (this.cursor_hover.target === undefined || (this.HID.touch && !this.is_cursor_down)) &&
      this.hovering.target
    ) {
      this.hovering.target.states.hover.is = false;
      this.hovering.target = undefined;
    }
    if (!this.clicked.handled) {
      this.clicked.target?.click();
      this.clicked.handled = true;
    }
    this.process_registry();
    if (this.dragging.target) {
      this.dragging.target.drag();
    }
    if (!this.released_on.handled && this.dragging.prev_target) {
      if (this.dragging.prev_target === this.hovering.target) {
        this.hovering.target.stop_hover();
        this.hovering.target = undefined;
      }
      this.released_on.target?.release(this.dragging.prev_target);
      this.released_on.handled = true;
    }
    if (this.hovering.target) {
      this.hovering.target.set_offset(this.cursor_hover.T, "Hover");
      if (this.hovering.prev_target !== this.hovering.target) {
        if (this.hovering.target !== this.dragging.target && !this.HID.touch) {
          this.hovering.target.hover();
        } else if (this.HID.touch) {
          let _ID = this.hovering.target.ID;
          G.E_MANAGER.add_event(
            new GameEvent({
              trigger: "after",
              blockable: false,
              blocking: false,
              delay: G.MIN_HOVER_TIME,
              func: function () {
                if (this.hovering.target && _ID === this.hovering.target.ID) {
                  this.hovering.target.hover();
                }
                return true;
              },
            })
          );
          if (this.hovering.prev_target) {
            this.hovering.prev_target.stop_hover();
          }
        }
        if (this.hovering.prev_target) {
          this.hovering.prev_target.stop_hover();
        }
      }
    } else if (this.hovering.prev_target) {
      this.hovering.prev_target.stop_hover();
    }
    if (this.hovering.target && this.hovering.target === this.dragging.target && !this.HID.touch) {
      this.hovering.target.stop_hover();
    }
  }
  cull_registry() {
    for (const [k, registry] of pairs(this.button_registry)) {
      for (let i = registry.length - 1; i >= 0; i--) {
        if (registry[i].node.REMOVED) {
          table.remove(registry, i);
        }
      }
    }
  }
  add_to_registry(node, registry) {
    this.button_registry[registry] = this.button_registry[registry] || {};
    table.insert(this.button_registry[registry], 1, {
      node: node,
      menu: !!G.OVERLAY_MENU || !!G.SETTINGS.paused,
    });
  }
  process_registry() {
    for (const [_, registry] of pairs(this.button_registry)) {
      for (let i = 0; i < registry.length; i++) {
        if (registry[i].click && registry[i].node.click) {
          if (
            registry[i].menu === !!G.OVERLAY_MENU &&
            registry[i].node.T.x > -2 &&
            registry[i].node.T.x < G.ROOM.T.w + 2 &&
            registry[i].node.T.y > -2 &&
            registry[i].node.T.y < G.ROOM.T.h + 2
          ) {
            registry[i].node.click();
          }
          registry[i].click = undefined;
        }
      }
    }
  }
  mod_cursor_context_layer(delta) {
    if (delta === 1) {
      let prev_cursor_context = {
        node: this.focused.target,
        cursor_pos: { x: G.CURSOR.T.x, y: G.CURSOR.T.y },
        interrupt: this.interrupt.focus,
      };
      this.cursor_context.stack[this.cursor_context.layer] = prev_cursor_context;
      this.cursor_context.layer = this.cursor_context.layer + 1;
    } else if (delta === -1) {
      this.cursor_context.stack[this.cursor_context.layer] = undefined;
      this.cursor_context.layer = this.cursor_context.layer - 1;
    } else if (delta === -1000) {
      this.cursor_context.layer = 1;
      this.cursor_context.stack = [this.cursor_context.stack[1]];
    } else if (delta === -2000) {
      this.cursor_context.layer = 1;
      this.cursor_context.stack = {};
    }
    this.navigate_focus();
  }
  snap_to(args) {
    this.snap_cursor_to = {
      node: args.node,
      T: args.T,
      type: (args.node && "node") || "transform",
    };
  }
  save_cardarea_focus(_cardarea) {
    if (G[_cardarea]) {
      if (
        this.focused.target &&
        this.focused.target.area &&
        this.focused.target.area === G[_cardarea]
      ) {
        this.cardarea_context[_cardarea] = this.focused.target.rank;
        return true;
      } else {
        this.cardarea_context[_cardarea] = undefined;
      }
    }
  }
  recall_cardarea_focus(_cardarea) {
    let ca_string = undefined;
    if (type(_cardarea) === "string") {
      ca_string = _cardarea;
      _cardarea = G[_cardarea];
    }
    if (
      _cardarea &&
      (!this.focused.target ||
        this.interrupt.focus ||
        (!this.interrupt.focus &&
          this.focused.target.area &&
          this.focused.target.area === _cardarea))
    ) {
      if (ca_string && this.cardarea_context[ca_string]) {
        for (let i = this.cardarea_context[ca_string]; i >= 0; i += -1) {
          if (_cardarea.cards[i]) {
            this.snap_to({ node: _cardarea.cards[i] });
            this.interrupt.focus = false;
            break;
          }
        }
      } else if (_cardarea.cards && _cardarea.cards[1]) {
        this.snap_to({ node: _cardarea.cards[1] });
        this.interrupt.focus = false;
      }
    }
    if (ca_string) {
      this.cardarea_context[ca_string] = undefined;
    }
  }
  update_cursor(hard_set_T) {
    if (hard_set_T) {
      G.CURSOR.T.x = hard_set_T.x;
      G.CURSOR.T.y = hard_set_T.y;
      this.cursor_position.x = G.CURSOR.T.x * G.TILESCALE * G.TILESIZE;
      this.cursor_position.y = G.CURSOR.T.y * G.TILESCALE * G.TILESIZE;
      G.CURSOR.VT.x = G.CURSOR.T.x;
      G.CURSOR.VT.y = G.CURSOR.T.y;
      return;
    }
    if (this.focused.target) {
      [this.cursor_position.x, this.cursor_position.y] = this.focused.target.put_focused_cursor();
      G.CURSOR.T.x = this.cursor_position.x / (G.TILESCALE * G.TILESIZE);
      G.CURSOR.T.y = this.cursor_position.y / (G.TILESCALE * G.TILESIZE);
      G.CURSOR.VT.x = G.CURSOR.T.x;
      G.CURSOR.VT.y = G.CURSOR.T.y;
    }
  }
  handle_axis_buttons() {
    for (const [_, v] of pairs(G.CONTROLLER.axis_buttons)) {
      if (v.previous !== "" && (v.current === "" || v.previous !== v.current)) {
        G.CONTROLLER.button_release(v.previous);
      }
      if (v.current !== "" && v.previous !== v.current) {
        G.CONTROLLER.button_press(v.current);
      }
    }
  }
  update_axis(dt) {
    let axis_interpretation = undefined;
    this.axis_buttons.l_stick.previous = this.axis_buttons.l_stick.current;
    this.axis_buttons.l_stick.current = "";
    this.axis_buttons.r_stick.previous = this.axis_buttons.r_stick.current;
    this.axis_buttons.r_stick.current = "";
    this.axis_buttons.l_trig.previous = this.axis_buttons.l_trig.current;
    this.axis_buttons.l_trig.current = "";
    this.axis_buttons.r_trig.previous = this.axis_buttons.r_trig.current;
    this.axis_buttons.r_trig.current = "";
    if (this.HID.controller) {
      let l_stick_x = this.GAMEPAD.object.getGamepadAxis("leftx");
      let l_stick_y = this.GAMEPAD.object.getGamepadAxis("lefty");
      if (this.dragging.target && math.abs(l_stick_x) + math.abs(l_stick_y) > 0.1) {
        axis_interpretation = "axis_cursor";
        if (math.abs(l_stick_x) < 0.1) {
          l_stick_x = 0;
        }
        if (math.abs(l_stick_y) < 0.1) {
          l_stick_y = 0;
        }
        l_stick_x = l_stick_x + ((l_stick_x > 0 && -0.1) || 0) + ((l_stick_x < 0 && 0.1) || 0);
        l_stick_y = l_stick_y + ((l_stick_y > 0 && -0.1) || 0) + ((l_stick_y < 0 && 0.1) || 0);
        G.CURSOR.T.x = G.CURSOR.T.x + dt * l_stick_x * this.axis_cursor_speed;
        G.CURSOR.T.y = G.CURSOR.T.y + dt * l_stick_y * this.axis_cursor_speed;
        G.CURSOR.VT.x = G.CURSOR.T.x;
        G.CURSOR.VT.y = G.CURSOR.T.y;
        this.cursor_position.x = G.CURSOR.T.x * G.TILESCALE * G.TILESIZE;
        this.cursor_position.y = G.CURSOR.T.y * G.TILESCALE * G.TILESIZE;
      } else {
        this.axis_buttons.l_stick.current = this.axis_buttons.l_stick.previous;
        if (math.abs(l_stick_x) + math.abs(l_stick_y) > 0.5) {
          axis_interpretation = "button";
          this.axis_buttons.l_stick.current =
            (math.abs(l_stick_x) > math.abs(l_stick_y) &&
              ((l_stick_x > 0 && "dpright") || "dpleft")) ||
            (l_stick_y > 0 && "dpdown") ||
            "dpup";
        } else if (math.abs(l_stick_x) + math.abs(l_stick_y) < 0.3) {
          this.axis_buttons.l_stick.current = "";
        }
      }
      let r_stick_x = this.GAMEPAD.object.getGamepadAxis("rightx");
      let r_stick_y = this.GAMEPAD.object.getGamepadAxis("righty");
      G.DEADZONE = 0.2;
      let mag = math.sqrt((math.abs(r_stick_x) ^ 2) + (math.abs(r_stick_y) ^ 2));
      if (mag > G.DEADZONE) {
        axis_interpretation = "axis_cursor";
        if (math.abs(r_stick_x) < G.DEADZONE) {
          r_stick_x = 0;
        }
        if (math.abs(r_stick_y) < G.DEADZONE) {
          r_stick_y = 0;
        }
        r_stick_x =
          r_stick_x + ((r_stick_x > 0 && -G.DEADZONE) || 0) + ((r_stick_x < 0 && G.DEADZONE) || 0);
        r_stick_y =
          r_stick_y + ((r_stick_y > 0 && -G.DEADZONE) || 0) + ((r_stick_y < 0 && G.DEADZONE) || 0);
        G.CURSOR.T.x = G.CURSOR.T.x + dt * r_stick_x * this.axis_cursor_speed;
        G.CURSOR.T.y = G.CURSOR.T.y + dt * r_stick_y * this.axis_cursor_speed;
        G.CURSOR.VT.x = G.CURSOR.T.x;
        G.CURSOR.VT.y = G.CURSOR.T.y;
        this.cursor_position.x = G.CURSOR.T.x * G.TILESCALE * G.TILESIZE;
        this.cursor_position.y = G.CURSOR.T.y * G.TILESCALE * G.TILESIZE;
      }
      let l_trig = this.GAMEPAD.object.getGamepadAxis("triggerleft");
      let r_trig = this.GAMEPAD.object.getGamepadAxis("triggerright");
      this.axis_buttons.l_trig.current = this.axis_buttons.l_trig.previous;
      this.axis_buttons.r_trig.current = this.axis_buttons.r_trig.previous;
      if (this.focused.target && this.focused.target.tilt_var) {
      }
      if (l_trig > 0.5) {
        this.axis_buttons.l_trig.current = "triggerleft";
      } else if (l_trig < 0.3) {
        this.axis_buttons.l_trig.current = "";
      }
      if (r_trig > 0.5) {
        this.axis_buttons.r_trig.current = "triggerright";
      } else if (r_trig < 0.3) {
        this.axis_buttons.r_trig.current = "";
      }
      if (this.axis_buttons.r_trig.current !== "" || this.axis_buttons.l_trig.current !== "") {
        axis_interpretation = axis_interpretation || "button";
      }
      this.handle_axis_buttons();
    }
    if (axis_interpretation) {
      this.interrupt.focus = false;
    }
    return axis_interpretation;
  }
  button_press_update(button, dt) {
    if (this.locks.frame) {
      return;
    }
    this.held_button_times[button] = 0;
    this.interrupt.focus = false;
    if (!this.capture_focused_input(button, "press", dt)) {
      if (button === "dpup") {
        this.navigate_focus("U");
      }
      if (button === "dpdown") {
        this.navigate_focus("D");
      }
      if (button === "dpleft") {
        this.navigate_focus("L");
      }
      if (button === "dpright") {
        this.navigate_focus("R");
      }
    }
    if ((this.locked && !G.SETTINGS.paused) || this.locks.frame || this.frame_buttonpress) {
      return;
    }
    this.frame_buttonpress = true;
    if (
      this.button_registry[button] &&
      this.button_registry[button][1] &&
      !this.button_registry[button][1].node.under_overlay
    ) {
      this.button_registry[button][1].click = true;
    } else {
      if (button === "start") {
        if (G.STATE === G.STATES.SPLASH) {
          G.delete_run();
          G.main_menu();
        }
      }
      if (button === "a") {
        if (
          this.focused.target &&
          this.focused.target.config.focus_args &&
          this.focused.target.config.focus_args.type === "slider" &&
          !G.CONTROLLER.HID.mouse &&
          !G.CONTROLLER.HID.axis_cursor
        ) {
        } else {
          this.L_cursor_press();
        }
      }
      if (button === "b") {
        if (G.hand && this.focused.target && this.focused.target.area === G.hand) {
          this.queue_R_cursor_press();
        } else {
          this.interrupt.focus = true;
        }
      }
    }
  }
  button_hold_update(button, dt) {
    if ((this.locked && !G.SETTINGS.paused) || this.locks.frame || this.frame_buttonpress) {
      return;
    }
    this.frame_buttonpress = true;
    if (this.held_button_times[button]) {
      this.held_button_times[button] = this.held_button_times[button] + dt;
      this.capture_focused_input(button, "hold", dt);
    }
    if (
      (button === "dpleft" || button === "dpright" || button === "dpup" || button === "dpdown") &&
      !this.no_holdcap
    ) {
      this.repress_timer = this.repress_timer || 0.3;
      if (this.held_button_times[button] && this.held_button_times[button] > this.repress_timer) {
        this.repress_timer = 0.1;
        this.held_button_times[button] = 0;
        this.button_press_update(button, dt);
      }
    }
  }
  button_release_update(button, dt) {
    if (!this.held_button_times[button]) {
      return;
    }
    this.repress_timer = 0.3;
    this.held_button_times[button] = undefined;
    if (button === "a") {
      this.L_cursor_release();
    }
  }
  key_press_update(key, dt) {
    if (key === "escape" && G.ACTIVE_MOD_UI) {
      G.FUNCS.exit_mods();
    }
    if (this.locks.frame) {
      return;
    }
    if (string.sub(key, 1, 2) === "kp") {
      key = string.sub(key, 3);
    }
    if (key === "enter") {
      key = "return";
    }
    if (this.text_input_hook) {
      if (key === "escape") {
        this.text_input_hook = undefined;
      } else if (key === "capslock") {
        this.capslock = !this.capslock;
      } else {
        G.FUNCS.text_input_key({
          e: this.text_input_hook,
          key: key,
          caps: this.held_keys["lshift"] || this.held_keys["rshift"],
        });
      }
      return;
    }
    if (key === "escape") {
      if (G.STATE === G.STATES.SPLASH) {
        G.delete_run();
        G.main_menu();
      } else {
        if (!G.OVERLAY_MENU) {
          G.FUNCS.options();
        } else if (!G.OVERLAY_MENU.config.no_esc) {
          G.FUNCS.exit_overlay_menu();
        }
      }
    }
    if ((this.locked && !G.SETTINGS.paused) || this.locks.frame || this.frame_buttonpress) {
      return;
    }
    this.frame_buttonpress = true;
    this.held_key_times[key] = 0;
    for (const [_, keybind] of pairs(SMODS.Keybinds)) {
      if (keybind.action && keybind.key_pressed === key && keybind.event === "pressed") {
        let execute = true;
        for (const [_, other_key] of pairs(keybind.held_keys)) {
          if (!this.held_keys[other_key]) {
            execute = false;
            break;
          }
        }
        if (execute) {
          keybind.action();
        }
      }
    }
    if (!_RELEASE_MODE) {
      if (key === "tab" && !G.debug_tools) {
        G.debug_tools = UIBox({
          definition: create_UIBox_debug_tools(),
          config: {
            align: "cr",
            offset: { x: G.ROOM.T.x + 11, y: 0 },
            major: G.ROOM_ATTACH,
            bond: "Weak",
          },
        });
        G.E_MANAGER.add_event(
          new GameEvent({
            blockable: false,
            func: function () {
              G.debug_tools.alignment.offset.x = -4;
              return true;
            },
          })
        );
      }
      if (this.hovering.target && this.hovering.target.is(Card)) {
        let _card = this.hovering.target;
        if (G.OVERLAY_MENU) {
          if (key === "1") {
            unlock_card(_card.config.center);
            _card.set_sprites(_card.config.center);
          }
          if (key === "2") {
            unlock_card(_card.config.center);
            discover_card(_card.config.center);
            _card.set_sprites(_card.config.center);
          }
          if (key === "3") {
            if (
              _card.ability.set === "Joker" &&
              G.jokers &&
              G.jokers.cards.length < G.jokers.config.card_limit
            ) {
              add_joker(_card.config.center.key);
              _card.set_sprites(_card.config.center);
            }
            if (
              _card.ability.consumeable &&
              G.consumeables &&
              G.consumeables.cards.length < G.consumeables.config.card_limit
            ) {
              add_joker(_card.config.center.key);
              _card.set_sprites(_card.config.center);
            }
          }
        }
        if (key === "q") {
          if (_card.ability.set === "Joker" || _card.playing_card || _card.area) {
            let found_index = 1;
            if (_card.edition) {
              for (const [i, v] of ipairs(G.P_CENTER_POOLS.Edition)) {
                if (v.key === _card.edition.key) {
                  found_index = i;
                  break;
                }
              }
            }
            found_index = found_index + 1;
            if (found_index > G.P_CENTER_POOLS.Edition.length) {
              found_index = found_index - G.P_CENTER_POOLS.Edition.length;
            }
            let _edition = G.P_CENTER_POOLS.Edition[found_index].key;
            _card.set_edition(_edition, true, true);
          }
        }
      }
      if (key === "h") {
        G.debug_UI_toggle = !G.debug_UI_toggle;
      }
      if (key === "b") {
        G.delete_run();
        G.start_run({});
      }
      if (key === "l") {
        G.delete_run();
        G.SAVED_GAME = get_compressed(G.SETTINGS.profile + ("/" + "save.jkr"));
        if (G.SAVED_GAME !== undefined) {
          G.SAVED_GAME = STR_UNPACK(G.SAVED_GAME);
        }
        G.start_run({ savetext: G.SAVED_GAME });
      }
      if (key === "j") {
        G.debug_splash_size_toggle = !G.debug_splash_size_toggle;
        G.delete_run();
        G.main_menu("splash");
      }
      if (key === "8") {
        love.mouse.setVisible(!love.mouse.isVisible());
      }
      if (key === "9") {
        G.debug_tooltip_toggle = !G.debug_tooltip_toggle;
      }
      if (key === "space") {
        live_test();
      }
      if (key === "v") {
        if (!G.prof) {
          G.prof = require("engine/profile");
          G.prof.start();
        } else {
          G.prof.stop();
          print(G.prof.report());
          G.prof = undefined;
        }
      }
      if (key === "p") {
        G.SETTINGS.perf_mode = !G.SETTINGS.perf_mode;
      }
    }
  }
  key_hold_update(key, dt) {
    if ((this.locked && !G.SETTINGS.paused) || this.locks.frame || this.frame_buttonpress) {
      return;
    }
    if (this.held_key_times[key]) {
      for (const [_, keybind] of pairs(SMODS.Keybinds)) {
        if (keybind.key_pressed === key && keybind.event === "held" && keybind.held_duration) {
          if (this.held_key_times[key] > keybind.held_duration) {
            let execute = true;
            for (const [_, other_key] of pairs(keybind.held_keys)) {
              if (!this.held_keys[other_key]) {
                execute = false;
                break;
              }
            }
            if (execute) {
              keybind.action();
              this.held_key_times[key] = undefined;
            }
          } else {
            this.held_key_times[key] = this.held_key_times[key] + dt;
          }
        }
      }
      if (key === "r" && !G.SETTINGS.paused) {
        if (this.held_key_times[key] > 0.7) {
          if (!G.GAME.won && !G.GAME.seeded && !G.GAME.challenge) {
            G.PROFILES[G.SETTINGS.profile].high_scores.current_streak.amt = 0;
          }
          G.save_settings();
          this.held_key_times[key] = undefined;
          G.SETTINGS.current_setup = "New Run";
          G.GAME.viewed_back = undefined;
          G.run_setup_seed = G.GAME.seeded;
          G.challenge_tab = (G.GAME && G.GAME.challenge && G.GAME.challenge_tab) || undefined;
          [G.forced_seed, G.setup_seed] = [undefined, undefined];
          if (G.GAME.seeded) {
            G.forced_seed = G.GAME.pseudorandom.seed;
          }
          G.forced_stake = G.GAME.stake;
          if (G.STAGE === G.STAGES.RUN) {
            G.FUNCS.start_setup_run();
          }
          G.forced_stake = undefined;
          G.challenge_tab = undefined;
          G.forced_seed = undefined;
        } else {
          this.held_key_times[key] = this.held_key_times[key] + dt;
        }
      }
    }
  }
  key_release_update(key, dt) {
    for (const [_, keybind] of pairs(SMODS.Keybinds)) {
      if (keybind.action && keybind.key_pressed === key && keybind.event === "released") {
        let execute = true;
        for (const [_, other_key] of pairs(keybind.held_keys)) {
          if (!this.held_keys[other_key]) {
            execute = false;
            break;
          }
        }
        if (execute) {
          keybind.action();
        }
      }
    }
    if ((this.locked && !G.SETTINGS.paused) || this.locks.frame || this.frame_buttonpress) {
      return;
    }
    this.frame_buttonpress = true;
    if (key === "a" && this.held_keys["g"] && !_RELEASE_MODE) {
      G.DEBUG = !G.DEBUG;
    }
    if (key === "tab" && G.debug_tools) {
      G.debug_tools.remove();
      G.debug_tools = undefined;
    }
  }
  key_press(key: string) {
    this.pressed_keys[key] = true;
    this.held_keys[key] = true;
  }
  key_release(key: string) {
    this.held_keys[key] = undefined;
    this.released_keys[key] = true;
  }
  button_press(button: string) {
    this.pressed_buttons[button] = true;
    this.held_buttons[button] = true;
  }
  button_release(button: string) {
    this.held_buttons[button] = undefined;
    this.released_buttons[button] = true;
  }
  get_cursor_collision(cursor_trans) {
    this.collision_list = EMPTY(this.collision_list);
    this.nodes_at_cursor = EMPTY(this.nodes_at_cursor);
    if (this.COYOTE_FOCUS) {
      return;
    }
    if (this.dragging.target) {
      this.dragging.target.states.collide.is = true;
      this.nodes_at_cursor[this.nodes_at_cursor.length + 1] = this.dragging.target;
      this.collision_list[this.collision_list.length + 1] = this.dragging.target;
    }
    if (
      !G.DRAW_HASH[1] ||
      cursor_trans.x - G.ROOM.T.x < -G.DRAW_HASH_BUFF ||
      cursor_trans.x - G.ROOM.T.x > G.TILE_W + G.DRAW_HASH_BUFF ||
      cursor_trans.y - G.ROOM.T.y < -G.DRAW_HASH_BUFF ||
      cursor_trans.y - G.ROOM.T.y > G.TILE_H + G.DRAW_HASH_BUFF
    ) {
      return;
    }
    let DRAW_HASH_SQUARE = G.DRAW_HASH;
    for (let i = DRAW_HASH_SQUARE.length; i <= 1; i += -1) {
      let v = DRAW_HASH_SQUARE[i];
      if (v.collides_with_point(cursor_trans) && !v.REMOVED) {
        this.nodes_at_cursor[this.nodes_at_cursor.length + 1] = v;
        if (v.states.collide.can) {
          v.states.collide.is = true;
          this.collision_list[this.collision_list.length + 1] = v;
        }
      }
    }
  }
  set_cursor_hover() {
    this.cursor_hover.T = this.cursor_hover.T || {};
    [this.cursor_hover.T.x, this.cursor_hover.T.y] = [G.CURSOR.T.x, G.CURSOR.T.y];
    this.cursor_hover.time = G.TIMERS.TOTAL;
    this.cursor_hover.prev_target = this.cursor_hover.target;
    this.cursor_hover.target = undefined;
    if (
      this.interrupt.focus ||
      (this.locked && (!G.SETTINGS.paused || G.screenwipe)) ||
      this.locks.frame ||
      this.COYOTE_FOCUS
    ) {
      this.cursor_hover.target = G.ROOM;
      return;
    }
    if (this.HID.controller && this.focused.target && this.focused.target.states.hover.can) {
      if ((this.HID.dpad || this.HID.axis_cursor) && this.focused.target.states.collide.is) {
        this.cursor_hover.target = this.focused.target;
      } else {
        for (const [_, v] of ipairs(this.collision_list)) {
          if (v.states.hover.can) {
            this.cursor_hover.target = v;
            break;
          }
        }
      }
    } else {
      for (const [_, v] of ipairs(this.collision_list)) {
        if (v.states.hover.can && (!v.states.drag.is || this.HID.touch)) {
          this.cursor_hover.target = v;
          break;
        }
      }
    }
    if (!this.cursor_hover.target || (this.dragging.target && !this.HID.touch)) {
      this.cursor_hover.target = G.ROOM;
    }
    if (this.cursor_hover.target !== this.cursor_hover.prev_target) {
      this.cursor_hover.handled = false;
    }
  }
  queue_L_cursor_press(x, y) {
    if (this.locks.frame) {
      return;
    }
    if (G.STATE === G.STATES.SPLASH) {
      this.key_press("escape");
    }
    this.L_cursor_queue = { x: x, y: y };
  }
  queue_R_cursor_press(x, y) {
    if (this.locks.frame) {
      return;
    }
    if (!G.SETTINGS.paused && G.hand && G.hand.highlighted[1]) {
      if (
        (G.play && G.play.cards.length > 0) ||
        this.locked ||
        this.locks.frame ||
        (G.GAME.STOP_USE && G.GAME.STOP_USE > 0)
      ) {
        return;
      }
      G.hand.unhighlight_all();
    }
  }
  L_cursor_press(x, y) {
    x = x || this.cursor_position.x;
    y = y || this.cursor_position.y;
    if ((this.locked && (!G.SETTINGS.paused || G.screenwipe)) || this.locks.frame) {
      return;
    }
    this.cursor_down.T = { x: x / (G.TILESCALE * G.TILESIZE), y: y / (G.TILESCALE * G.TILESIZE) };
    this.cursor_down.time = G.TIMERS.TOTAL;
    this.cursor_down.handled = false;
    this.cursor_down.target = undefined;
    this.is_cursor_down = true;
    let press_node =
      (this.HID.touch && this.cursor_hover.target) || this.hovering.target || this.focused.target;
    if (press_node) {
      this.cursor_down.target =
        (press_node.states.click.can && press_node) || press_node.can_drag() || undefined;
    }
    if (this.cursor_down.target === undefined) {
      this.cursor_down.target = G.ROOM;
    }
  }
  L_cursor_release(x, y) {
    x = x || this.cursor_position.x;
    y = y || this.cursor_position.y;
    if ((this.locked && (!G.SETTINGS.paused || G.screenwipe)) || this.locks.frame) {
      return;
    }
    this.cursor_up.T = { x: x / (G.TILESCALE * G.TILESIZE), y: y / (G.TILESCALE * G.TILESIZE) };
    this.cursor_up.time = G.TIMERS.TOTAL;
    this.cursor_up.handled = false;
    this.cursor_up.target = undefined;
    this.is_cursor_down = false;
    this.cursor_up.target = this.hovering.target || this.focused.target;
    if (this.cursor_up.target === undefined) {
      this.cursor_up.target = G.ROOM;
    }
  }
  is_node_focusable(node) {
    let ret_val = false;
    if (node.T.y > G.ROOM.T.h + 3) {
      return false;
    }
    if (
      !node.REMOVED &&
      !node.under_overlay &&
      ((node.states.hover.can && !this.dragging.target) || this.dragging.target === node) &&
      !!node.created_on_pause === !!G.SETTINGS.paused &&
      node.states.visible &&
      (!node.UIBox || node.UIBox.states.visible)
    ) {
      if (this.screen_keyboard) {
        if (node.UIBox && node.UIBox === this.screen_keyboard && node.config.button) {
          ret_val = true;
        }
      } else {
        if (
          node.is(Card) &&
          (node.facing === "front" ||
            node.area === G.hand ||
            node.area === G.jokers ||
            node === G.deck) &&
          node.states.hover.can &&
          !node.jimbo
        ) {
          ret_val = true;
        }
        if (node.config && node.config.force_focus) {
          ret_val = true;
        }
        if (node.config && node.config.button) {
          ret_val = true;
        }
        if (node.config && node.config.focus_args) {
          if (node.config.focus_args.type === "none" || node.config.focus_args.funnel_from) {
            ret_val = false;
          } else {
            ret_val = true;
          }
        }
      }
    }
    return ret_val;
  }
  update_focus(dir) {
    this.focused.prev_target = this.focused.target;
    if (
      !this.HID.controller ||
      this.interrupt.focus ||
      (this.locked && (!G.SETTINGS.paused || G.screenwipe))
    ) {
      if (this.focused.target) {
        this.focused.target.states.focus.is = false;
      }
      this.focused.target = undefined;
      return;
    }
    G.ARGS.focus_list = EMPTY(G.ARGS.focus_list);
    G.ARGS.focusables = EMPTY(G.ARGS.focusables);
    if (this.focused.target) {
      this.focused.target.states.focus.is = false;
      if (
        !this.is_node_focusable(this.focused.target) ||
        !this.focused.target.collides_with_point(G.CURSOR.T) ||
        this.HID.axis_cursor
      ) {
        this.focused.target = undefined;
      }
    }
    if (!dir && this.focused.target) {
      this.focused.target.states.focus.can = true;
      G.ARGS.focusables[G.ARGS.focusables.length + 1] = this.focused.target;
    } else {
      if (!dir) {
        for (const [k, v] of ipairs(this.nodes_at_cursor)) {
          v.states.focus.can = false;
          v.states.focus.is = false;
          if (G.ARGS.focusables.length === 0 && this.is_node_focusable(v)) {
            v.states.focus.can = true;
            G.ARGS.focusables[G.ARGS.focusables.length + 1] = v;
          }
        }
      } else {
        for (const [k, v] of pairs(G.MOVEABLES)) {
          v.states.focus.can = false;
          v.states.focus.is = false;
          if (this.is_node_focusable(v)) {
            v.states.focus.can = true;
            G.ARGS.focusables[G.ARGS.focusables.length + 1] = v;
          }
        }
      }
    }
    if (G.ARGS.focusables.length > 0) {
      if (dir) {
        if (
          (dir === "L" || dir === "R") &&
          this.focused.target &&
          this.focused.target.is(Card) &&
          this.focused.target.area === G.hand &&
          G.hand
        ) {
          let nu_rank = this.focused.target.rank + ((dir === "L" && -1) || 1);
          if (nu_rank > G.hand.cards.length) {
            nu_rank = 1;
          }
          if (nu_rank === 0) {
            nu_rank = G.hand.cards.length;
          }
          if (nu_rank !== this.focused.target.rank) {
            G.ARGS.focus_list[1] = { node: G.hand.cards[nu_rank] };
          }
        } else {
          G.ARGS.focus_cursor_pos = G.ARGS.focus_cursor_pos || {};
          [G.ARGS.focus_cursor_pos.x, G.ARGS.focus_cursor_pos.y] = [
            G.CURSOR.T.x - G.ROOM.T.x,
            G.CURSOR.T.y - G.ROOM.T.y,
          ];
          if (this.focused.target) {
            _ft = this.focused.target;
            if (
              this.focused.target.config.focus_args &&
              this.focused.target.config.focus_args.funnel_to
            ) {
              _ft = this.focused.target.config.focus_args.funnel_to;
            }
            [G.ARGS.focus_cursor_pos.x, G.ARGS.focus_cursor_pos.y] = [
              _ft.T.x + 0.5 * _ft.T.w,
              _ft.T.y + 0.5 * _ft.T.h,
            ];
          } else if (this.hovering.target && this.hovering.target.states.focus.can) {
            [G.ARGS.focus_cursor_pos.x, G.ARGS.focus_cursor_pos.y] =
              this.hovering.target.put_focused_cursor();
            G.ARGS.focus_cursor_pos.x =
              G.ARGS.focus_cursor_pos.x / (G.TILESCALE * G.TILESIZE) - G.ROOM.T.x;
            G.ARGS.focus_cursor_pos.y =
              G.ARGS.focus_cursor_pos.y / (G.TILESCALE * G.TILESIZE) - G.ROOM.T.y;
          }
          for (const [_, v] of pairs(G.ARGS.focusables)) {
            if (v !== this.hovering.target && v !== this.focused.target) {
              let eligible = false;
              if (v.config.focus_args && v.config.focus_args.funnel_to) {
                v = v.config.focus_args.funnel_to;
              }
              G.ARGS.focus_vec = G.ARGS.focus_vec || {};
              G.ARGS.focus_vec.x = v.T.x + 0.5 * v.T.w - G.ARGS.focus_cursor_pos.x;
              G.ARGS.focus_vec.y = v.T.y + 0.5 * v.T.h - G.ARGS.focus_cursor_pos.y;
              if (v.config.focus_args && v.config.focus_args.nav) {
                if (v.config.focus_args.nav === "wide") {
                  if (G.ARGS.focus_vec.y > 0.1 && dir === "D") {
                    eligible = true;
                  } else if (G.ARGS.focus_vec.y < -0.1 && dir === "U") {
                    eligible = true;
                  } else if (math.abs(G.ARGS.focus_vec.y) < v.T.h / 2) {
                    eligible = true;
                  }
                } else if (v.config.focus_args.nav === "tall") {
                  if (G.ARGS.focus_vec.x > 0.1 && dir === "R") {
                    eligible = true;
                  } else if (G.ARGS.focus_vec.x < -0.1 && dir === "L") {
                    eligible = true;
                  } else if (math.abs(G.ARGS.focus_vec.x) < v.T.w / 2) {
                    eligible = true;
                  }
                }
              } else if (math.abs(G.ARGS.focus_vec.x) > math.abs(G.ARGS.focus_vec.y)) {
                if (G.ARGS.focus_vec.x > 0 && dir === "R") {
                  eligible = true;
                } else if (G.ARGS.focus_vec.x < 0 && dir === "L") {
                  eligible = true;
                }
              } else {
                if (G.ARGS.focus_vec.y > 0 && dir === "D") {
                  eligible = true;
                } else if (G.ARGS.focus_vec.y < 0 && dir === "U") {
                  eligible = true;
                }
              }
              if (eligible) {
                G.ARGS.focus_list[G.ARGS.focus_list.length + 1] = {
                  node: v,
                  dist: math.abs(G.ARGS.focus_vec.x) + math.abs(G.ARGS.focus_vec.y),
                };
              }
            }
          }
          if (G.ARGS.focus_list.length < 1) {
            if (this.focused.target) {
              this.focused.target.states.focus.is = true;
            }
            return;
          }
          table.sort(G.ARGS.focus_list, function (a, b) {
            return a.dist < b.dist;
          });
        }
      } else {
        if (this.focused.target) {
          G.ARGS.focus_list[G.ARGS.focus_list.length + 1] = { node: this.focused.target, dist: 0 };
        } else {
          G.ARGS.focus_list[G.ARGS.focus_list.length + 1] = { node: G.ARGS.focusables[1], dist: 0 };
        }
      }
    }
    if (G.ARGS.focus_list[1]) {
      if (
        G.ARGS.focus_list[1].node.config &&
        G.ARGS.focus_list[1].node.config.focus_args &&
        G.ARGS.focus_list[1].node.config.focus_args.funnel_from
      ) {
        this.focused.target = G.ARGS.focus_list[1].node.config.focus_args.funnel_from;
      } else {
        this.focused.target = G.ARGS.focus_list[1].node;
      }
      if (this.focused.target !== this.focused.prev_target) {
        G.VIBRATION = G.VIBRATION + 0.7;
      }
    } else {
      this.focused.target = undefined;
    }
    if (this.focused.target) {
      this.focused.target.states.focus.is = true;
    }
  }
  capture_focused_input(button, input_type, dt) {
    let ret = false;
    let focused = this.focused.target;
    let extern_button = false;
    this.no_holdcap = undefined;
    if (
      input_type === "press" &&
      (button === "dpleft" || button === "dpright") &&
      focused &&
      this.dragging.target &&
      this.held_button_times["a"] &&
      this.held_button_times["a"] < 0.12 &&
      focused.area &&
      focused.area.can_highlight(focused)
    ) {
      this.L_cursor_release();
      this.navigate_focus((button === "dpleft" && "L") || "R");
      this.held_button_times["a"] = undefined;
      this.COYOTE_FOCUS = true;
      ret = true;
    } else if (
      input_type === "press" &&
      focused &&
      focused.area &&
      focused === this.dragging.target
    ) {
      focused.states.drag.is = false;
      if (button === "dpleft" && focused.rank > 1) {
        focused.rank = focused.rank - 1;
        focused.area.cards[focused.rank].rank = focused.rank + 1;
        table.sort(focused.area.cards, function (a, b) {
          return a.rank < b.rank;
        });
        focused.area.align_cards();
        this.update_cursor();
      } else if (button === "dpright" && focused.rank < focused.area.cards.length) {
        focused.rank = focused.rank + 1;
        focused.area.cards[focused.rank].rank = focused.rank - 1;
        table.sort(focused.area.cards, function (a, b) {
          return a.rank < b.rank;
        });
        focused.area.align_cards();
        this.update_cursor();
      }
      focused.states.drag.is = true;
      ret = true;
    }
    if (
      G.OVERLAY_MENU &&
      !this.screen_keyboard &&
      input_type === "press" &&
      G.OVERLAY_MENU.get_UIE_by_ID("tab_shoulders") &&
      (button === "leftshoulder" || button === "rightshoulder")
    ) {
      focused = G.OVERLAY_MENU.get_UIE_by_ID("tab_shoulders");
      extern_button = true;
    }
    if (
      G.OVERLAY_MENU &&
      !this.screen_keyboard &&
      input_type === "press" &&
      G.OVERLAY_MENU.get_UIE_by_ID("cycle_shoulders") &&
      (button === "leftshoulder" || button === "rightshoulder")
    ) {
      focused = G.OVERLAY_MENU.get_UIE_by_ID("cycle_shoulders").children[1];
      extern_button = true;
    }
    if (focused && focused.config.focus_args) {
      if (focused.config.focus_args.type === "cycle" && input_type === "press") {
        if (
          (extern_button && button === "leftshoulder") ||
          (!extern_button && button === "dpleft")
        ) {
          focused.children[1].click();
          ret = true;
        }
        if (
          (extern_button && button === "rightshoulder") ||
          (!extern_button && button === "dpright")
        ) {
          focused.children[3].click();
          ret = true;
        }
      }
      if (focused.config.focus_args.type === "tab" && input_type === "press") {
        let proto_choices = focused.UIBox.get_group(
          undefined,
          focused.children[1].children[1].config.group
        );
        let choices = {};
        for (const [k, v] of ipairs(proto_choices)) {
          if (v.config.choice && v.config.button) {
            choices[choices.length + 1] = v;
          }
        }
        for (const [k, v] of ipairs(choices)) {
          if (v.config.chosen) {
            if (
              (extern_button && button === "leftshoulder") ||
              (!extern_button && button === "dpleft")
            ) {
              let next_i = (k !== 1 && k - 1) || choices.length;
              if (focused.config.focus_args.no_loop && next_i > k) {
                ret = undefined;
              } else {
                choices[next_i].click();
                this.snap_to({ node: choices[next_i] });
                this.update_cursor();
                ret = true;
              }
            } else if (
              (extern_button && button === "rightshoulder") ||
              (!extern_button && button === "dpright")
            ) {
              let next_i = (k !== choices.length && k + 1) || 1;
              if (focused.config.focus_args.no_loop && next_i < k) {
                ret = undefined;
              } else {
                choices[next_i].click();
                this.snap_to({ node: choices[next_i] });
                this.update_cursor();
                ret = true;
              }
            }
            break;
          }
        }
      }
      if (focused.config.focus_args.type === "slider") {
        if (button === "dpleft") {
          this.no_holdcap = true;
          if (input_type === "hold" && this.held_button_times[button] > 0.2) {
            G.FUNCS.slider_descreet(
              focused.children[1],
              -dt * this.held_button_times[button] * 0.6
            );
          }
          if (input_type === "press") {
            G.FUNCS.slider_descreet(focused.children[1], -0.01);
          }
          ret = true;
        }
        if (button === "dpright") {
          this.no_holdcap = true;
          if (input_type === "hold" && this.held_button_times[button] > 0.2) {
            G.FUNCS.slider_descreet(focused.children[1], dt * this.held_button_times[button] * 0.6);
          }
          if (input_type === "press") {
            G.FUNCS.slider_descreet(focused.children[1], 0.01);
          }
          ret = true;
        }
      }
    }
    if (ret === true) {
      G.VIBRATION = G.VIBRATION + 1;
    }
    return ret;
  }
  navigate_focus(dir) {
    this.update_focus(dir);
    this.update_cursor();
  }
}
