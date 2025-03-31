///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

class UIBox extends Moveable {
  draw_layers: {};
  definition: any;
  UIRoot: this;
  constructor(args) {
    super(args.T);
    this.states.drag.can = false;
    this.draw_layers = {};
    this.definition = args.definition;
    if (args.config) {
      this.config = args.config;
      args.config.major = args.config.major || args.config.parent || this;
      this.set_alignment({
        major: args.config.major,
        type: args.config.align || args.config.type || "",
        bond: args.config.bond || "Strong",
        offset: args.config.offset || { x: 0, y: 0 },
        lr_clamp: args.config.lr_clamp,
      });
      this.set_role({
        xy_bond: args.config.xy_bond,
        r_bond: args.config.r_bond,
        wh_bond: args.config.wh_bond || "Weak",
        scale_bond: args.config.scale_bond || "Weak",
      });
      this.states.collide.can = true;
      if (args.config.can_collide === undefined) {
        this.states.collide.can = true;
      } else {
        this.states.collide.can = args.config.can_collide;
      }
      this.parent = this.config.parent;
    }
    this.set_parent_child(this.definition, undefined);
    this.Mid = this.Mid || this.UIRoot;
    this.calculate_xywh(this.UIRoot, this.T);
    this.T.w = this.UIRoot.T.w;
    this.T.h = this.UIRoot.T.h;
    this.UIRoot.set_wh();
    this.UIRoot.set_alignments();
    this.align_to_major();
    [this.VT.x, this.VT.y] = [this.T.x, this.T.y];
    [this.VT.w, this.VT.h] = [this.T.w, this.T.h];
    if (this.Mid !== this && this.Mid.parent && false) {
      this.VT.x = this.VT.x - this.Mid.role.offset.x + (this.Mid.parent.config.padding || 0);
      this.VT.y = this.VT.y - this.Mid.role.offset.y + (this.Mid.parent.config.padding || 0);
    }
    if (this.alignment && this.alignment.lr_clamp) {
      this.lr_clamp();
    }
    this.UIRoot.initialize_VT(true);
    if (getmetatable(this) === UIBox) {
      if (args.config.instance_type) {
        table.insert(G.I[args.config.instance_type], this);
      } else {
        table.insert(G.I.UIBOX, this);
      }
    }
  }
  get_UIE_by_ID(id, node) {
    if (!node) {
      node = this.UIRoot;
    }
    if (node.config && node.config.id === id) {
      return node;
    }
    for (const [k, v] of pairs(node.children)) {
      let res = this.get_UIE_by_ID(id, v);
      if (res) {
        return res;
      } else if (v.config.object && v.config.object.get_UIE_by_ID) {
        res = v.config.object.get_UIE_by_ID(id, undefined);
        if (res) {
          return res;
        }
      }
    }
    return undefined;
  }
  calculate_xywh(node, _T, recalculate, _scale) {
    node.ARGS.xywh_node_trans = node.ARGS.xywh_node_trans || {};
    let _nt = node.ARGS.xywh_node_trans;
    let _ct = {};
    [_ct.x, _ct.y, _ct.w, _ct.h] = [0, 0, 0, 0];
    let padding = node.config.padding || G.UIT.padding;
    if (node.UIT === G.UIT.B || node.UIT === G.UIT.T || node.UIT === G.UIT.O) {
      [_nt.x, _nt.y, _nt.w, _nt.h] = [
        _T.x,
        _T.y,
        node.config.w || (node.config.object && node.config.object.T.w),
        node.config.h || (node.config.object && node.config.object.T.h),
      ];
      if (node.UIT === G.UIT.T) {
        node.config.text_drawable = undefined;
        let scale = node.config.scale || 1;
        if (node.config.ref_table && node.config.ref_value) {
          node.config.text = tostring(node.config.ref_table[node.config.ref_value]);
          if (node.config.func && !recalculate) {
            G.FUNCS[node.config.func](node);
          }
        }
        if (!node.config.text) {
          node.config.text = "[UI ERROR]";
        }
        node.config.lang = node.config.lang || G.LANG;
        let tx =
          node.config.lang.font.FONT.getWidth(node.config.text) *
          node.config.lang.font.squish *
          scale *
          G.TILESCALE *
          node.config.lang.font.FONTSCALE;
        let ty =
          node.config.lang.font.FONT.getHeight() *
          scale *
          G.TILESCALE *
          node.config.lang.font.FONTSCALE *
          node.config.lang.font.TEXT_HEIGHT_SCALE;
        if (node.config.vert) {
          let thunk = tx;
          tx = ty;
          ty = thunk;
        }
        [_nt.x, _nt.y, _nt.w, _nt.h] = [
          _T.x,
          _T.y,
          tx / (G.TILESIZE * G.TILESCALE),
          ty / (G.TILESIZE * G.TILESCALE),
        ];
        node.content_dimensions = node.content_dimensions || {};
        node.content_dimensions.w = _T.w;
        node.content_dimensions.h = _T.h;
        node.set_values(_nt, recalculate);
      } else if (node.UIT === G.UIT.B || node.UIT === G.UIT.O) {
        node.content_dimensions = node.content_dimensions || {};
        node.content_dimensions.w = _nt.w;
        node.content_dimensions.h = _nt.h;
        node.set_values(_nt, recalculate);
      }
      return [_nt.w, _nt.h];
    } else {
      for (let i = 1; i <= 2; i++) {
        if (
          i === 1 ||
          (i === 2 &&
            ((node.config.maxw && _ct.w > node.config.maxw) ||
              (node.config.maxh && _ct.h > node.config.maxh)))
        ) {
          let fac = _scale || 1;
          if (i === 2) {
            let restriction = node.config.maxw || node.config.maxh;
            fac = (fac * restriction) / ((node.config.maxw && _ct.w) || _ct.h);
          }
          [_nt.x, _nt.y, _nt.w, _nt.h] = [_T.x, _T.y, node.config.minw || 0, node.config.minh || 0];
          if (node.UIT === G.UIT.ROOT) {
            [_nt.x, _nt.y, _nt.w, _nt.h] = [0, 0, node.config.minw || 0, node.config.minh || 0];
          }
          [_ct.x, _ct.y, _ct.w, _ct.h] = [_nt.x + padding, _nt.y + padding, 0, 0];
          let [_tw, _th];
          for (const [k, v] of ipairs(node.children)) {
            if (getmetatable(v) === UIElement) {
              if (v.config && v.config.scale) {
                v.config.scale = v.config.scale * fac;
              }
              [_tw, _th] = this.calculate_xywh(v, _ct, recalculate, fac);
              if (_th && _tw) {
                if (v.UIT === G.UIT.R) {
                  _ct.h = _ct.h + _th + padding;
                  _ct.y = _ct.y + _th + padding;
                  if (_tw + padding > _ct.w) {
                    _ct.w = _tw + padding;
                  }
                  if (v.config && v.config.emboss) {
                    _ct.h = _ct.h + v.config.emboss;
                    _ct.y = _ct.y + v.config.emboss;
                  }
                } else {
                  _ct.w = _ct.w + _tw + padding;
                  _ct.x = _ct.x + _tw + padding;
                  if (_th + padding > _ct.h) {
                    _ct.h = _th + padding;
                  }
                  if (v.config && v.config.emboss) {
                    _ct.h = _ct.h + v.config.emboss;
                  }
                }
              }
            }
          }
        }
      }
      node.content_dimensions = node.content_dimensions || {};
      node.content_dimensions.w = _ct.w + padding;
      node.content_dimensions.h = _ct.h + padding;
      _nt.w = math.max(_ct.w + padding, _nt.w);
      _nt.h = math.max(_ct.h + padding, _nt.h);
      node.set_values(_nt, recalculate);
      return [_nt.w, _nt.h];
    }
  }
  remove_group(node, group) {
    node = node || this.UIRoot;
    for (const [k, v] of pairs(node.children)) {
      if (this.remove_group(v, group)) {
        node.children[k] = undefined;
      }
    }
    if (node.config && node.config.group && node.config.group === group) {
      node.remove();
      return true;
    }
    if (!node.parent || true) {
      this.calculate_xywh(this.UIRoot, this.T, true);
      this.UIRoot.set_wh();
      this.UIRoot.set_alignment();
    }
  }
  get_group(node, group, ingroup) {
    node = node || this.UIRoot;
    ingroup = ingroup || {};
    for (const [k, v] of pairs(node.children)) {
      this.get_group(v, group, ingroup);
    }
    if (node.config && node.config.group && node.config.group === group) {
      table.insert(ingroup, node);
      return ingroup;
    }
    return ingroup;
  }
  set_parent_child(node, parent) {
    let UIE = UIElement(parent, this, node.n, node.config);
    if (parent && parent.config && parent.config.group) {
      if (UIE.config) {
        UIE.config.group = parent.config.group;
      } else {
        UIE.config = { group: parent.config.group };
      }
    }
    if (parent && parent.config && parent.config.button) {
      if (UIE.config) {
        UIE.config.button_UIE = parent;
      } else {
        UIE.config = { button_UIE: parent };
      }
    }
    if (parent && parent.config && parent.config.button_UIE) {
      if (UIE.config) {
        UIE.config.button_UIE = parent.config.button_UIE;
      } else {
        UIE.config = { button: parent.config.button };
      }
    }
    if (node.n && node.n === G.UIT.O && UIE.config.button) {
      UIE.config.object.states.click.can = false;
    }
    if (
      ((node.n && node.n === G.UIT.C) || node.n === G.UIT.R || node.n === G.UIT.ROOT) &&
      node.nodes
    ) {
      for (const [k, v] of pairs(node.nodes)) {
        this.set_parent_child(v, UIE);
      }
    }
    if (!parent) {
      this.UIRoot = UIE;
      this.UIRoot.parent = this;
    } else {
      table.insert(parent.children, UIE);
    }
    if (node.config && node.config.mid) {
      this.Mid = UIE;
    }
  }
  remove() {
    if (this === G.OVERLAY_MENU) {
      G.REFRESH_ALERTS = true;
    }
    this.UIRoot.remove();
    for (const [k, v] of pairs(G.I[this.config.instance_type || "UIBOX"])) {
      if (v === this) {
        table.remove(G.I[this.config.instance_type || "UIBOX"], k);
        break;
      }
    }
    remove_all(this.children);
    Moveable.remove(this);
  }
  draw() {
    if (this.FRAME.DRAW >= G.FRAMES.DRAW && !G.OVERLAY_TUTORIAL) {
      return;
    }
    this.FRAME.DRAW = G.FRAMES.DRAW;
    for (const [k, v] of pairs(this.children)) {
      if (k !== "h_popup" && k !== "alert") {
        v.draw();
      }
    }
    if (this.states.visible) {
      add_to_drawhash(this);
      this.UIRoot.draw_this();
      this.UIRoot.draw_children();
      for (const [k, v] of ipairs(this.draw_layers)) {
        if (v.draw_this) {
          v.draw_this();
        } else {
          v.draw();
        }
        if (v.draw_children) {
          v.draw_children();
        }
      }
    }
    if (this.children.alert) {
      this.children.alert.draw();
    }
    this.draw_boundingrect();
  }
  recalculate() {
    this.calculate_xywh(this.UIRoot, this.T, true);
    this.UIRoot.set_wh();
    this.UIRoot.set_alignments();
    this.T.w = this.UIRoot.T.w;
    this.T.h = this.UIRoot.T.h;
    G.REFRESH_FRAME_MAJOR_CACHE = (G.REFRESH_FRAME_MAJOR_CACHE || 0) + 1;
    this.UIRoot.initialize_VT();
    G.REFRESH_FRAME_MAJOR_CACHE =
      (G.REFRESH_FRAME_MAJOR_CACHE > 1 && G.REFRESH_FRAME_MAJOR_CACHE - 1) || undefined;
  }
  move(dt) {
    Moveable.move(this, dt);
    Moveable.move(this.UIRoot, dt);
  }
  drag(offset) {
    Moveable.drag(this, offset);
    Moveable.move(this.UIRoot, dt);
  }
  add_child(node, parent) {
    this.set_parent_child(node, parent);
    this.recalculate();
  }
  set_container(container) {
    this.UIRoot.set_container(container);
    Node.set_container(this, container);
  }
  print_topology(indent) {
    let box_str = "| UIBox | - ID:" + (this.ID + (" w/h:" + (this.T.w + ("/" + this.T.h))));
    let indent = indent || 0;
    box_str = box_str + this.UIRoot.print_topology(indent);
    return box_str;
  }
}

class UIElement extends Moveable {
  UIT: any;
  UIBox: any;
  last_clicked: boolean;
  object_focus_timer: any;
  focus_timer: any;
  pixellated_rect: any;
  button_clicked: any;
  disable_button: any;
  constructor(parent, new_UIBox, new_UIT, config) {
    super();
    this.parent = parent;
    this.UIT = new_UIT;
    this.UIBox = new_UIBox;
    this.config = config || {};
    if (this.config && this.config.object) {
      this.config.object.parent = this;
    }
    this.children = {};
    this.ARGS = this.ARGS || {};
    this.content_dimensions = { w: 0, h: 0 };
  }
  set_values(_T, recalculate) {
    if (!recalculate || !this.T) {
      Moveable.init(this, { T: _T });
      this.states.click.can = false;
      this.states.drag.can = false;
      this.static_rotation = true;
    } else {
      this.T.x = _T.x;
      this.T.y = _T.y;
      this.T.w = _T.w;
      this.T.h = _T.h;
    }
    if (this.config.button_UIE) {
      this.states.collide.can = true;
      this.states.hover.can = false;
      this.states.click.can = true;
    }
    if (this.config.button) {
      this.states.collide.can = true;
      this.states.click.can = true;
    }
    if (this.config.on_demand_tooltip || this.config.tooltip || this.config.detailed_tooltip) {
      this.states.collide.can = true;
    }
    this.set_role({
      role_type: "Minor",
      major: this.UIBox,
      offset: { x: _T.x, y: _T.y },
      wh_bond: "Weak",
      scale_bond: "Weak",
    });
    if (this.config.draw_layer) {
      this.UIBox.draw_layers[this.config.draw_layer] = this;
    }
    if (this.config.collideable) {
      this.states.collide.can = true;
    }
    if (this.config.can_collide !== undefined) {
      this.states.collide.can = this.config.can_collide;
      if (this.config.object) {
        this.config.object.states.collide.can = this.states.collide.can;
      }
    }
    if (this.UIT === G.UIT.O && !this.config.no_role) {
      this.config.object.set_role(
        this.config.role || {
          role_type: "Minor",
          major: this,
          xy_bond: "Strong",
          wh_bond: "Weak",
          scale_bond: "Weak",
        }
      );
    }
    if (this.config && this.config.ref_value && this.config.ref_table) {
      this.config.prev_value = this.config.ref_table[this.config.ref_value];
    }
    if (this.UIT === G.UIT.T) {
      this.static_rotation = true;
    }
    if (this.config.juice) {
      if (this.UIT === G.UIT.ROOT) {
        this.juice_up();
      }
      if (this.UIT === G.UIT.T) {
        this.juice_up();
      }
      if (this.UIT === G.UIT.O) {
        this.config.object.juice_up(0.5);
      }
      if (this.UIT === G.UIT.B) {
        this.juice_up();
      }
      if (this.UIT === G.UIT.C) {
        this.juice_up();
      }
      if (this.UIT === G.UIT.R) {
        this.juice_up();
      }
      this.config.juice = false;
    }
    if (!this.config.colour) {
      if (this.UIT === G.UIT.ROOT) {
        this.config.colour = G.C.UI.BACKGROUND_DARK;
      }
      if (this.UIT === G.UIT.T) {
        this.config.colour = G.C.UI.TEXT_LIGHT;
      }
      if (this.UIT === G.UIT.O) {
        this.config.colour = G.C.WHITE;
      }
      if (this.UIT === G.UIT.B) {
        this.config.colour = G.C.CLEAR;
      }
      if (this.UIT === G.UIT.C) {
        this.config.colour = G.C.CLEAR;
      }
      if (this.UIT === G.UIT.R) {
        this.config.colour = G.C.CLEAR;
      }
    }
    if (!this.config.outline_colour) {
      if (this.UIT === G.UIT.ROOT) {
        this.config.outline_colour = G.C.UI.OUTLINE_LIGHT;
      }
      if (this.UIT === G.UIT.T) {
        this.config.outline_colour = G.C.UI.OUTLINE_LIGHT;
      }
      if (this.UIT === G.UIT.O) {
        this.config.colour = G.C.UI.OUTLINE_LIGHT;
      }
      if (this.UIT === G.UIT.B) {
        this.config.outline_colour = G.C.UI.OUTLINE_LIGHT;
      }
      if (this.UIT === G.UIT.C) {
        this.config.outline_colour = G.C.UI.OUTLINE_LIGHT;
      }
      if (this.UIT === G.UIT.R) {
        this.config.outline_colour = G.C.UI.OUTLINE_LIGHT;
      }
    }
    if (this.config.focus_args && !this.config.focus_args.registered) {
      if (this.config.focus_args.button) {
        G.CONTROLLER.add_to_registry(this.config.button_UIE || this, this.config.focus_args.button);
      }
      if (this.config.focus_args.snap_to) {
        G.CONTROLLER.snap_to({ node: this });
      }
      if (this.config.focus_args.funnel_to) {
        let _par = this.parent;
        while (_par && _par.is(UIElement)) {
          if (_par.config.focus_args && _par.config.focus_args.funnel_from) {
            _par.config.focus_args.funnel_from = this;
            this.config.focus_args.funnel_to = _par;
            break;
          }
          _par = _par.parent;
        }
      }
      this.config.focus_args.registered = true;
    }
    if (this.config.force_focus) {
      this.states.collide.can = true;
    }
    if (this.config.button_delay && !this.config.button_delay_start) {
      this.config.button_delay_start = G.TIMERS.REAL;
      this.config.button_delay_end = G.TIMERS.REAL + this.config.button_delay;
      this.config.button_delay_progress = 0;
    }
    this.layered_parallax = this.layered_parallax || { x: 0, y: 0 };
    if (
      this.config &&
      this.config.func &&
      (((this.config.button_UIE || this.config.button) && this.config.func !== "set_button_pip") ||
        this.config.insta_func)
    ) {
      G.FUNCS[this.config.func](this);
    }
  }
  print_topology(indent) {
    let UIT = "????";
    for (const [k, v] of pairs(G.UIT)) {
      if (v === this.UIT) {
        UIT = "" + k;
      }
    }
    let box_str =
      "\\n" +
      (string.rep("  ", indent) +
        ("| " + (UIT + (" | - ID:" + (this.ID + (" w/h:" + (this.T.w + ("/" + this.T.h))))))));
    if (UIT === "O") {
      box_str =
        box_str +
        (" OBJ:" +
          ((getmetatable(this.config.object) === CardArea && "CardArea") ||
            (getmetatable(this.config.object) === Card && "Card") ||
            (getmetatable(this.config.object) === UIBox && "UIBox") ||
            (getmetatable(this.config.object) === Particles && "Particles") ||
            (getmetatable(this.config.object) === DynaText && "DynaText") ||
            (getmetatable(this.config.object) === Sprite && "Sprite") ||
            (getmetatable(this.config.object) === AnimatedSprite && "AnimatedSprite") ||
            "OTHER"));
    } else if (UIT === "T") {
      box_str = box_str + (" TEXT:" + (this.config.text || "REF"));
    }
    for (const [k, v] of ipairs(this.children)) {
      if (v.print_topology) {
        box_str = box_str + v.print_topology(indent + 1);
      }
    }
    return box_str;
  }
  initialize_VT() {
    this.move_with_major(0);
    this.calculate_parrallax();
    for (const [_, v] of pairs(this.children)) {
      if (v.initialize_VT) {
        v.initialize_VT();
      }
    }
    [this.VT.w, this.VT.h] = [this.T.w, this.T.h];
    if (this.UIT === G.UIT.T) {
      this.update_text();
    }
    if (this.config.object) {
      if (!this.config.no_role) {
        this.config.object.hard_set_T(this.T.x, this.T.y, this.T.w, this.T.h);
        this.config.object.move_with_major(0);
        this.config.object.alignment.prev_type = "";
        this.config.object.align_to_major();
      }
      if (this.config.object.recalculate) {
        this.config.object.recalculate();
      }
    }
  }
  juice_up(amount, rot_amt) {
    if (this.UIT === G.UIT.O) {
      if (this.config.object) {
        this.config.object.juice_up(amount, rot_amt);
      }
    } else {
      Moveable.juice_up(this, amount, rot_amt);
    }
  }
  can_drag() {
    if (this.states.drag.can) {
      return this;
    }
    return this.UIBox.can_drag();
  }
  draw() {}
  draw_children(layer) {
    if (this.states.visible) {
      for (const [k, v] of pairs(this.children)) {
        if (!v.config.draw_layer && k !== "h_popup" && k !== "alert") {
          if (v.draw_this && !v.config.draw_after) {
            v.draw_this();
          } else {
            v.draw();
          }
          if (v.draw_children) {
            v.draw_children();
          }
          if (v.draw_this && v.config.draw_after) {
            v.draw_this();
          } else {
            v.draw();
          }
        }
      }
    }
  }
  set_wh() {
    let padding = (this.config && this.config.padding) || G.UIT.padding;
    let [_max_w, _max_h] = [0, 0];
    if (next(this.children) === undefined || this.config.no_fill) {
      return [this.T.w, this.T.h];
    } else {
      for (const [k, w] of pairs(this.children)) {
        if (w.set_wh) {
          let [_cw, _ch] = w.set_wh();
          if (_cw && _ch) {
            if (_cw > _max_w) {
              _max_w = _cw;
            }
            if (_ch > _max_h) {
              _max_h = _ch;
            }
          } else {
            _max_w = padding;
            _max_h = padding;
          }
        }
      }
      for (const [k, w] of pairs(this.children)) {
        if (w.UIT === G.UIT.R) {
          w.T.w = _max_w;
        }
        if (w.UIT === G.UIT.C) {
          w.T.h = _max_h;
        }
      }
    }
    return [this.T.w, this.T.h];
  }
  align(x, y) {
    this.role.offset.y = this.role.offset.y + y;
    this.role.offset.x = this.role.offset.x + x;
    for (const [_, v] of pairs(this.children)) {
      if (v.align) {
        v.align(x, y);
      }
    }
  }
  set_alignments() {
    for (const [k, v] of pairs(this.children)) {
      if (this.config && this.config.align && v.align) {
        let padding = this.config.padding || G.UIT.padding;
        if (string.find(this.config.align, "c")) {
          if (v.UIT === G.UIT.T || v.UIT === G.UIT.B || v.UIT === G.UIT.O) {
            v.align(0, 0.5 * (this.T.h - 2 * padding - v.T.h));
          } else {
            v.align(0, 0.5 * (this.T.h - this.content_dimensions.h));
          }
        }
        if (string.find(this.config.align, "m")) {
          v.align(0.5 * (this.T.w - this.content_dimensions.w), 0);
        }
        if (string.find(this.config.align, "b")) {
          v.align(0, this.T.h - this.content_dimensions.h);
        }
        if (string.find(this.config.align, "r")) {
          v.align(this.T.w - this.content_dimensions.w, 0);
        }
      }
      if (v.set_alignments) {
        v.set_alignments();
      }
    }
  }
  update_text() {
    if (this.config && this.config.text && !this.config.text_drawable) {
      this.config.lang = this.config.lang || G.LANG;
      this.config.text_drawable = love.graphics.newText(this.config.lang.font.FONT, [
        G.C.WHITE,
        this.config.text,
      ]);
    }
    if (
      this.config.ref_table &&
      this.config.ref_table[this.config.ref_value] !== this.config.prev_value
    ) {
      this.config.text = tostring(this.config.ref_table[this.config.ref_value]);
      this.config.text_drawable.set(this.config.text);
      if (
        !this.config.no_recalc &&
        this.config.prev_value &&
        string.len(this.config.prev_value) !== string.len(this.config.text)
      ) {
        this.UIBox.recalculate();
      }
      this.config.prev_value = this.config.ref_table[this.config.ref_value];
    }
  }
  update_object() {
    if (
      this.config.ref_table &&
      this.config.ref_value &&
      this.config.ref_table[this.config.ref_value] !== this.config.object
    ) {
      this.config.object = this.config.ref_table[this.config.ref_value];
      this.UIBox.recalculate();
    }
    if (this.config.object) {
      this.config.object.config.refresh_movement = true;
      if (this.config.object.states.hover.is && !this.states.hover.is) {
        this.hover();
        this.states.hover.is = true;
      }
      if (!this.config.object.states.hover.is && this.states.hover.is) {
        this.stop_hover();
        this.states.hover.is = false;
      }
    }
    if (this.config.object && this.config.object.ui_object_updated) {
      this.config.object.ui_object_updated = undefined;
      this.config.object.parent = this;
      this.config.object.set_role(this.config.role || { role_type: "Minor", major: this });
      this.config.object.move_with_major(0);
      if (this.config.object.non_recalc) {
        this.parent.content_dimensions.w = this.config.object.T.w;
        this.align(
          this.parent.T.x - this.config.object.T.x,
          this.parent.T.y - this.config.object.T.y
        );
        this.parent.set_alignments();
      } else {
        this.UIBox.recalculate();
      }
    }
  }
  draw_this() {
    if (!this.states.visible) {
      if (this.config.force_focus) {
        add_to_drawhash(this);
      }
      return;
    }
    if (
      this.config.force_focus ||
      this.config.force_collision ||
      this.config.button_UIE ||
      this.config.button ||
      this.states.collide.can
    ) {
      add_to_drawhash(this);
    }
    let button_active = true;
    let parallax_dist = 1.5;
    let button_being_pressed = false;
    if (this.config.button || this.config.button_UIE) {
      this.layered_parallax.x =
        ((this.parent && this.parent !== this.UIBox && this.parent.layered_parallax.x) || 0) +
        ((this.config.shadow && 0.4 * this.shadow_parrallax.x) || 0) / G.TILESIZE;
      this.layered_parallax.y =
        ((this.parent && this.parent !== this.UIBox && this.parent.layered_parallax.y) || 0) +
        ((this.config.shadow && 0.4 * this.shadow_parrallax.y) || 0) / G.TILESIZE;
      if (
        this.config.button &&
        ((this.last_clicked && this.last_clicked > G.TIMERS.REAL - 0.1) ||
          (this.config.button &&
            (this.states.hover.is || this.states.drag.is) &&
            G.CONTROLLER.is_cursor_down))
      ) {
        this.layered_parallax.x =
          this.layered_parallax.x -
          ((parallax_dist * this.shadow_parrallax.x) / G.TILESIZE) * (this.config.button_dist || 1);
        this.layered_parallax.y =
          this.layered_parallax.y -
          ((parallax_dist * this.shadow_parrallax.y) / G.TILESIZE) * (this.config.button_dist || 1);
        parallax_dist = 0;
        button_being_pressed = true;
      }
      if (this.config.button_UIE && !this.config.button_UIE.config.button) {
        button_active = false;
      }
    }
    if (this.config.colour[4] > 0.01) {
      if (this.UIT === G.UIT.T && this.config.scale) {
        this.ARGS.text_parallax = this.ARGS.text_parallax || {};
        this.ARGS.text_parallax.sx =
          (-this.shadow_parrallax.x * 0.5) / (this.config.scale * this.config.lang.font.FONTSCALE);
        this.ARGS.text_parallax.sy =
          (-this.shadow_parrallax.y * 0.5) / (this.config.scale * this.config.lang.font.FONTSCALE);
        if (
          (this.config.button_UIE && button_active) ||
          (!this.config.button_UIE && this.config.shadow && G.SETTINGS.GRAPHICS.shadows === "On")
        ) {
          prep_draw(this, 0.97);
          if (this.config.vert) {
            love.graphics.translate(0, this.VT.h);
            love.graphics.rotate(-math.pi / 2);
          }
          if (
            (this.config.shadow || (this.config.button_UIE && button_active)) &&
            G.SETTINGS.GRAPHICS.shadows === "On"
          ) {
            love.graphics.setColor(0, 0, 0, 0.3 * this.config.colour[4]);
            love.graphics.draw(
              this.config.text_drawable,
              ((this.config.lang.font.TEXT_OFFSET.x +
                ((this.config.vert && -this.ARGS.text_parallax.sy) || this.ARGS.text_parallax.sx)) *
                (this.config.scale || 1) *
                this.config.lang.font.FONTSCALE) /
                G.TILESIZE,
              ((this.config.lang.font.TEXT_OFFSET.y +
                ((this.config.vert && this.ARGS.text_parallax.sx) || this.ARGS.text_parallax.sy)) *
                (this.config.scale || 1) *
                this.config.lang.font.FONTSCALE) /
                G.TILESIZE,
              0,
              (this.config.scale * this.config.lang.font.squish * this.config.lang.font.FONTSCALE) /
                G.TILESIZE,
              (this.config.scale * this.config.lang.font.FONTSCALE) / G.TILESIZE
            );
          }
          love.graphics.pop();
        }
        prep_draw(this, 1);
        if (this.config.vert) {
          love.graphics.translate(0, this.VT.h);
          love.graphics.rotate(-math.pi / 2);
        }
        if (!button_active) {
          love.graphics.setColor(G.C.UI.TEXT_INACTIVE);
        } else {
          love.graphics.setColor(this.config.colour);
        }
        love.graphics.draw(
          this.config.text_drawable,
          (this.config.lang.font.TEXT_OFFSET.x *
            this.config.scale *
            this.config.lang.font.FONTSCALE) /
            G.TILESIZE,
          (this.config.lang.font.TEXT_OFFSET.y *
            this.config.scale *
            this.config.lang.font.FONTSCALE) /
            G.TILESIZE,
          0,
          (this.config.scale * this.config.lang.font.squish * this.config.lang.font.FONTSCALE) /
            G.TILESIZE,
          (this.config.scale * this.config.lang.font.FONTSCALE) / G.TILESIZE
        );
        love.graphics.pop();
      } else if (
        this.UIT === G.UIT.B ||
        this.UIT === G.UIT.C ||
        this.UIT === G.UIT.R ||
        this.UIT === G.UIT.ROOT
      ) {
        prep_draw(this, 1);
        love.graphics.scale(1 / G.TILESIZE);
        if (this.config.shadow && G.SETTINGS.GRAPHICS.shadows === "On") {
          love.graphics.scale(0.98);
          if (this.config.shadow_colour) {
            love.graphics.setColor(this.config.shadow_colour);
          } else {
            love.graphics.setColor(0, 0, 0, 0.3 * this.config.colour[4]);
          }
          if (this.config.r && this.VT.w > 0.01) {
            this.draw_pixellated_rect("shadow", parallax_dist);
          } else {
            love.graphics.rectangle(
              "fill",
              -this.shadow_parrallax.x * parallax_dist,
              -this.shadow_parrallax.y * parallax_dist,
              this.VT.w * G.TILESIZE,
              this.VT.h * G.TILESIZE
            );
          }
          love.graphics.scale(1 / 0.98);
        }
        love.graphics.scale((button_being_pressed && 0.985) || 1);
        if (this.config.emboss) {
          love.graphics.setColor(
            darken(this.config.colour, (this.states.hover.is && 0.5) || 0.3, true)
          );
          this.draw_pixellated_rect("emboss", parallax_dist, this.config.emboss);
        }
        let collided_button = this.config.button_UIE || this;
        this.ARGS.button_colours = this.ARGS.button_colours || {};
        this.ARGS.button_colours[1] =
          (this.config.button_delay && mix_colours(this.config.colour, G.C.L_BLACK, 0.5)) ||
          this.config.colour;
        this.ARGS.button_colours[2] =
          (((collided_button.config.hover && collided_button.states.hover.is) ||
            (collided_button.last_clicked && collided_button.last_clicked > G.TIMERS.REAL - 0.1)) &&
            G.C.UI.HOVER) ||
          undefined;
        for (const [k, v] of ipairs(this.ARGS.button_colours)) {
          love.graphics.setColor(v);
          if (this.config.r && this.VT.w > 0.01) {
            if (this.config.button_delay) {
              love.graphics.setColor(G.C.GREY);
              this.draw_pixellated_rect("fill", parallax_dist);
              love.graphics.setColor(v);
              this.draw_pixellated_rect(
                "fill",
                parallax_dist,
                undefined,
                this.config.button_delay_progress
              );
            } else if (this.config.progress_bar) {
              love.graphics.setColor(this.config.progress_bar.empty_col || G.C.GREY);
              this.draw_pixellated_rect("fill", parallax_dist);
              love.graphics.setColor(this.config.progress_bar.filled_col || G.C.BLUE);
              this.draw_pixellated_rect(
                "fill",
                parallax_dist,
                undefined,
                this.config.progress_bar.ref_table[this.config.progress_bar.ref_value] /
                  this.config.progress_bar.max
              );
            } else {
              this.draw_pixellated_rect("fill", parallax_dist);
            }
          } else {
            love.graphics.rectangle("fill", 0, 0, this.VT.w * G.TILESIZE, this.VT.h * G.TILESIZE);
          }
        }
        love.graphics.pop();
      } else if (this.UIT === G.UIT.O && this.config.object) {
        if (this.config.focus_with_object && this.config.object.states.focus.is) {
          this.object_focus_timer = this.object_focus_timer || G.TIMERS.REAL;
          let lw = 50 * (math.max(0, this.object_focus_timer - G.TIMERS.REAL + 0.3) ^ 2);
          prep_draw(this, 1);
          love.graphics.scale(1 / G.TILESIZE);
          love.graphics.setLineWidth(lw + 1.5);
          love.graphics.setColor(adjust_alpha(G.C.WHITE, 0.2 * lw, true));
          this.draw_pixellated_rect("fill", parallax_dist);
          love.graphics.setColor(
            (this.config.colour[4] > 0 && mix_colours(G.C.WHITE, this.config.colour, 0.8)) ||
              G.C.WHITE
          );
          this.draw_pixellated_rect("line", parallax_dist);
          love.graphics.pop();
        } else {
          this.object_focus_timer = undefined;
        }
        this.config.object.draw();
      }
    }
    if (this.config.outline && this.config.outline_colour[4] > 0.01) {
      if (this.config.outline) {
        prep_draw(this, 1);
        love.graphics.scale(1 / G.TILESIZE);
        love.graphics.setLineWidth(this.config.outline);
        if (this.config.line_emboss) {
          love.graphics.setColor(
            darken(this.config.outline_colour, (this.states.hover.is && 0.5) || 0.3, true)
          );
          this.draw_pixellated_rect("line_emboss", parallax_dist, this.config.line_emboss);
        }
        love.graphics.setColor(this.config.outline_colour);
        if (this.config.r && this.VT.w > 0.01) {
          this.draw_pixellated_rect("line", parallax_dist);
        } else {
          love.graphics.rectangle("line", 0, 0, this.VT.w * G.TILESIZE, this.VT.h * G.TILESIZE);
        }
        love.graphics.pop();
      }
    }
    if (this.states.focus.is) {
      this.focus_timer = this.focus_timer || G.TIMERS.REAL;
      let lw = 50 * (math.max(0, this.focus_timer - G.TIMERS.REAL + 0.3) ^ 2);
      prep_draw(this, 1);
      love.graphics.scale(1 / G.TILESIZE);
      love.graphics.setLineWidth(lw + 1.5);
      love.graphics.setColor(adjust_alpha(G.C.WHITE, 0.2 * lw, true));
      this.draw_pixellated_rect("fill", parallax_dist);
      love.graphics.setColor(
        (this.config.colour[4] > 0 && mix_colours(G.C.WHITE, this.config.colour, 0.8)) || G.C.WHITE
      );
      this.draw_pixellated_rect("line", parallax_dist);
      love.graphics.pop();
    } else {
      this.focus_timer = undefined;
    }
    if (this.config.chosen) {
      prep_draw(this, 0.98);
      love.graphics.scale(1 / G.TILESIZE);
      if (this.config.shadow && G.SETTINGS.GRAPHICS.shadows === "On") {
        love.graphics.setColor(0, 0, 0, 0.3 * this.config.colour[4]);
        love.graphics.polygon(
          "fill",
          get_chosen_triangle_from_rect(
            this.layered_parallax.x - this.shadow_parrallax.x * parallax_dist * 0.5,
            this.layered_parallax.y - this.shadow_parrallax.y * parallax_dist * 0.5,
            this.VT.w * G.TILESIZE,
            this.VT.h * G.TILESIZE,
            this.config.chosen === "vert"
          )
        );
      }
      love.graphics.pop();
      prep_draw(this, 1);
      love.graphics.scale(1 / G.TILESIZE);
      love.graphics.setColor(G.C.RED);
      love.graphics.setColor(this.config.colour);
      love.graphics.polygon(
        "fill",
        get_chosen_triangle_from_rect(
          this.layered_parallax.x,
          this.layered_parallax.y,
          this.VT.w * G.TILESIZE,
          this.VT.h * G.TILESIZE,
          this.config.chosen === "vert"
        )
      );
      love.graphics.pop();
    }
    this.draw_boundingrect();
  }
  draw_pixellated_rect(_type, _parallax, _emboss, _progress) {
    if (
      !this.pixellated_rect ||
      this.pixellated_rect[_type].vertices.length < 1 ||
      _parallax !== this.pixellated_rect.parallax ||
      this.pixellated_rect.w !== this.VT.w ||
      this.pixellated_rect.h !== this.VT.h ||
      this.pixellated_rect.sw !== this.shadow_parrallax.x ||
      this.pixellated_rect.sh !== this.shadow_parrallax.y ||
      this.pixellated_rect.progress !== (_progress || 1)
    ) {
      this.pixellated_rect = {
        w: this.VT.w,
        h: this.VT.h,
        sw: this.shadow_parrallax.x,
        sh: this.shadow_parrallax.y,
        progress: _progress || 1,
        fill: { vertices: {} },
        shadow: { vertices: {} },
        line: { vertices: {} },
        emboss: { vertices: {} },
        line_emboss: { vertices: {} },
        parallax: _parallax,
      };
      let ext_up = (this.config.ext_up && this.config.ext_up * G.TILESIZE) || 0;
      let res =
        this.config.res ||
        (math.min(this.VT.w, this.VT.h + math.abs(ext_up) / G.TILESIZE) > 3.5 && 0.8) ||
        (math.min(this.VT.w, this.VT.h + math.abs(ext_up) / G.TILESIZE) > 0.3 && 0.6) ||
        0.15;
      let [totw, toth, subw, subh] = [
        this.VT.w * G.TILESIZE,
        (this.VT.h + math.abs(ext_up) / G.TILESIZE) * G.TILESIZE,
        this.VT.w * G.TILESIZE - 4 * res,
        (this.VT.h + math.abs(ext_up) / G.TILESIZE) * G.TILESIZE - 4 * res,
      ];
      let vertices = [
        subw / 2,
        subh / 2 - ext_up,
        0,
        4 * res - ext_up,
        1 * res,
        4 * res - ext_up,
        1 * res,
        2 * res - ext_up,
        2 * res,
        2 * res - ext_up,
        2 * res,
        1 * res - ext_up,
        4 * res,
        1 * res - ext_up,
        4 * res,
        0 * res - ext_up,
        subw,
        0 * res - ext_up,
        subw,
        1 * res - ext_up,
        subw + 2 * res,
        1 * res - ext_up,
        subw + 2 * res,
        2 * res - ext_up,
        subw + 3 * res,
        2 * res - ext_up,
        subw + 3 * res,
        4 * res - ext_up,
        totw,
        4 * res - ext_up,
        totw,
        subh - ext_up,
        subw + 3 * res,
        subh - ext_up,
        subw + 3 * res,
        subh + 2 * res - ext_up,
        subw + 2 * res,
        subh + 2 * res - ext_up,
        subw + 2 * res,
        subh + 3 * res - ext_up,
        subw,
        subh + 3 * res - ext_up,
        subw,
        toth - ext_up,
        4 * res,
        toth - ext_up,
        4 * res,
        subh + 3 * res - ext_up,
        2 * res,
        subh + 3 * res - ext_up,
        2 * res,
        subh + 2 * res - ext_up,
        1 * res,
        subh + 2 * res - ext_up,
        1 * res,
        subh - ext_up,
        0,
        subh - ext_up,
        0,
        4 * res - ext_up,
      ];
      for (const [k, v] of ipairs(vertices)) {
        if (k % 2 === 1 && v > totw * this.pixellated_rect.progress) {
          v = totw * this.pixellated_rect.progress;
        }
        this.pixellated_rect.fill.vertices[k] = v;
        if (k > 4) {
          this.pixellated_rect.line.vertices[k - 4] = v;
          if (_emboss) {
            this.pixellated_rect.line_emboss.vertices[k - 4] =
              v +
              ((k % 2 === 0 && -_emboss * this.shadow_parrallax.y) ||
                -0.7 * _emboss * this.shadow_parrallax.x);
          }
        }
        if (k % 2 === 0) {
          this.pixellated_rect.shadow.vertices[k] = v - this.shadow_parrallax.y * _parallax;
          if (_emboss) {
            this.pixellated_rect.emboss.vertices[k] = v + _emboss * G.TILESIZE;
          }
        } else {
          this.pixellated_rect.shadow.vertices[k] = v - this.shadow_parrallax.x * _parallax;
          if (_emboss) {
            this.pixellated_rect.emboss.vertices[k] = v;
          }
        }
      }
    }
    love.graphics.polygon(
      ((_type === "line" || _type === "line_emboss") && "line") || "fill",
      this.pixellated_rect[_type].vertices
    );
  }
  update(dt) {
    G.ARGS.FUNC_TRACKER = G.ARGS.FUNC_TRACKER || {};
    if (this.config.button_delay) {
      this.config.button_temp = this.config.button || this.config.button_temp;
      this.config.button = undefined;
      this.config.button_delay_progress =
        (G.TIMERS.REAL - this.config.button_delay_start) / this.config.button_delay;
      if (G.TIMERS.REAL >= this.config.button_delay_end) {
        this.config.button_delay = undefined;
      }
    }
    if (this.config.button_temp && !this.config.button_delay) {
      this.config.button = this.config.button_temp;
    }
    if (this.button_clicked) {
      this.button_clicked = undefined;
    }
    if (this.config && this.config.func) {
      G.ARGS.FUNC_TRACKER[this.config.func] = (G.ARGS.FUNC_TRACKER[this.config.func] || 0) + 1;
      G.FUNCS[this.config.func](this);
    }
    if (this.UIT === G.UIT.T) {
      this.update_text();
    }
    if (this.UIT === G.UIT.O) {
      this.update_object();
    }
    Node.update(this, dt);
  }
  collides_with_point(cursor_trans) {
    if (this.UIBox.states.collide.can) {
      return Node.collides_with_point(this, cursor_trans);
    } else {
      return false;
    }
  }
  click() {
    if (
      this.config.button &&
      (!this.last_clicked || this.last_clicked + 0.1 < G.TIMERS.REAL) &&
      this.states.visible &&
      !this.under_overlay &&
      !this.disable_button
    ) {
      if (this.config.one_press) {
        this.disable_button = true;
      }
      this.last_clicked = G.TIMERS.REAL;
      if (this.config.id === "overlay_menu_back_button") {
        G.CONTROLLER.mod_cursor_context_layer(-1);
        G.NO_MOD_CURSOR_STACK = true;
      }
      if (G.OVERLAY_TUTORIAL && G.OVERLAY_TUTORIAL.button_listen === this.config.button) {
        G.FUNCS.tut_next();
      }
      G.FUNCS[this.config.button](this);
      G.NO_MOD_CURSOR_STACK = undefined;
      if (this.config.choice) {
        let chosen_temp = this.config.chosen;
        let choices = this.UIBox.get_group(undefined, this.config.group);
        for (const [k, v] of pairs(choices)) {
          if (v.config && v.config.choice) {
            v.config.chosen = false;
          }
        }
        this.config.chosen = chosen_temp || true;
      }
      play_sound("button", 1, 0.3);
      G.ROOM.jiggle = G.ROOM.jiggle + 0.5;
      this.button_clicked = true;
    }
    if (this.config.button_UIE) {
      this.config.button_UIE.click();
    }
  }
  put_focused_cursor() {
    if (this.config.focus_args && this.config.focus_args.type === "tab") {
      for (const [k, v] of pairs(this.children)) {
        if (v.children[1].config.chosen) {
          return v.children[1].put_focused_cursor();
        }
      }
    } else {
      return Node.put_focused_cursor(this);
    }
  }
  remove() {
    if (this.config && this.config.object) {
      this.config.object.remove();
      this.config.object = undefined;
    }
    if (this === G.CONTROLLER.text_input_hook) {
      G.CONTROLLER.text_input_hook = undefined;
    }
    remove_all(this.children);
    Moveable.remove(this);
  }
  hover() {
    if (this.config && this.config.on_demand_tooltip) {
      this.config.h_popup = create_popup_UIBox_tooltip(this.config.on_demand_tooltip);
      this.config.h_popup_config = {
        align: (this.T.y > G.ROOM.T.h / 2 && "tm") || "bm",
        offset: { x: 0, y: (this.T.y > G.ROOM.T.h / 2 && -0.1) || 0.1 },
        parent: this,
      };
    }
    if (this.config.tooltip) {
      this.config.h_popup = create_popup_UIBox_tooltip(this.config.tooltip);
      this.config.h_popup_config = { align: "tm", offset: { x: 0, y: -0.1 }, parent: this };
    }
    if (this.config.detailed_tooltip && G.CONTROLLER.HID.pointer) {
      this.config.h_popup = create_UIBox_detailed_tooltip(this.config.detailed_tooltip);
      this.config.h_popup_config = { align: "tm", offset: { x: 0, y: -0.1 }, parent: this };
    }
    Node.hover(this);
  }
  stop_hover() {
    Node.stop_hover(this);
    if (this.config && this.config.on_demand_tooltip) {
      this.config.h_popup = undefined;
    }
  }
  release(other) {
    if (this.parent) {
      this.parent.release(other);
    }
  }
}
function is_UI_containter(node): boolean {
  if (node.UIT !== G.UIT.C && node.UIT !== G.UIT.R && node.UIT !== G.UIT.ROOT) {
    return false;
  }
  return true;
}
