///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

class Moveable extends LuaNode {
    static hard_set_T<CardArea extends CardArea>(arg0: this, x: any, y: any, w: any, h: any) {
        throw new Error("Method not implemented.");
    }
    static remove<CardArea extends CardArea>(arg0: this) {
        throw new Error("Method not implemented.");
    }
    static set_alignment(focused_ui: any, arg1: { offset: { x: number; y: number; }; }) {
        throw new Error("Method not implemented.");
    }
    velocity: { x: number; y: number; r: number; scale: number; mag: number; };
    role: RoleDefinition;
    alignment: {
        lr_clamp?: any;
        type_list?: { a: boolean; m: any; c: any; b: any; t: any; l: any; r: any; i: any; }; 
        type: string; 
        offset: Position2D; 
        prev_type: string; 
        prev_offset: Position2D; 
    };
    pinch: { x: boolean; y: boolean; };
    last_moved: number;
    last_aligned: number;
    static_rotation: boolean;
    offset: Position2D;
    Mid: this;
    shadow_parrallax: Position2D;
    layered_parallax: Position2D;
    shadow_height: number;
    NEW_ALIGNMENT?: boolean;
    juice?: {
        handled_elsewhere?: any; scale: number; scale_amt: any; r: number; r_amt: any; start_time: number; end_time: number; 
    };
    STATIONARY?: boolean;
    zoom?: number|boolean;
    temp_offs: Position2D[];
    mouse_damping: number;
    hover_tilt: number;
    dissolve: number;
    dissolve_colours: number;
    constructor(X?: { T: TransformValue; }|number, Y?: number, W?: number, H?: number) {
        let args: {T: TransformValue|TransformArray} = typeof (X) === "object" && X || { T: [X || 0, Y || 0, W || 0, H || 0] };
        super(args)
        this.VT = { x: this.T.x, y: this.T.y, w: this.T.w, h: this.T.h, r: this.T.r, scale: this.T.scale };
        this.velocity = { x: 0, y: 0, r: 0, scale: 0, mag: 0 };
        this.role = { role_type: "Major", offset: { x: 0, y: 0 }, major: undefined, draw_major: this, xy_bond: "Strong", wh_bond: "Strong", r_bond: "Strong", scale_bond: "Strong" };
        this.alignment = { type: "a", offset: { x: 0, y: 0 }, prev_type: "", prev_offset: { x: 0, y: 0 } };
        this.pinch = { x: false, y: false };
        this.last_moved = -1;
        this.last_aligned = -1;
        this.static_rotation = false;
        this.offset = { x: 0, y: 0 };
        this.Mid = this;
        this.shadow_parrallax = { x: 0, y: -1.5 };
        this.layered_parallax = { x: 0, y: 0 };
        this.shadow_height = 0.2;
        this.calculate_parrallax();
        Array.prototype.push.call(G.MOVEABLES, this);
        if (this instanceof Moveable) {
            Array.prototype.push.call(G.I.MOVEABLE, this);
        }
    }
    draw(overlay?: HexArray) {
        LuaNode.prototype.draw.call(this);
        this.draw_boundingrect();
    };
    set_alignment(args: { major?: any; bond?: any; xy_bond?: any; wh_bond?: any; r_bond?: any; scale_bond?: any; type?: any; offset?: any; lr_clamp?: any; }) {
        args = args || {};
        if (args.major) {
            this.set_role({ role_type: "Minor", major: args.major, xy_bond: args.bond || args.xy_bond || "Weak", wh_bond: args.wh_bond || this.role.wh_bond, r_bond: args.r_bond || this.role.r_bond, scale_bond: args.scale_bond || this.role.scale_bond });
        }
        this.alignment.type = args.type || this.alignment.type;
        if (args.offset && (typeof (args.offset) === "object" && !(args.offset.y && args.offset.x)) || typeof (args.offset) !== "object") {
            args.offset = undefined;
        }
        this.alignment.offset = args.offset || this.alignment.offset;
        this.alignment.lr_clamp = args.lr_clamp;
    };
    align_to_major() {
        if (this.alignment.type !== this.alignment.prev_type) {
            this.alignment.type_list = { a: this.alignment.type === "a", m: string.find(this.alignment.type, "m"), c: string.find(this.alignment.type, "c"), b: string.find(this.alignment.type, "b"), t: string.find(this.alignment.type, "t"), l: string.find(this.alignment.type, "l"), r: string.find(this.alignment.type, "r"), i: string.find(this.alignment.type, "i") };
        }
        if (!this.alignment.type_list) {
            return;
        }
        this.NEW_ALIGNMENT = true;
        if (this.alignment.type !== this.alignment.prev_type) {
            this.alignment.prev_type = this.alignment.type;
        }
        if (this.alignment.type_list.a || !this.role.major) {
            return;
        }
        if (this.alignment.type_list.m) {
            this.role.offset.x = 0.5 * this.role.major.T.w - this.Mid.T.w / 2 + this.alignment.offset.x - this.Mid.T.x + this.T.x;
        }
        if (this.alignment.type_list.c) {
            this.role.offset.y = 0.5 * this.role.major.T.h - this.Mid.T.h / 2 + this.alignment.offset.y - this.Mid.T.y + this.T.y;
        }
        if (this.alignment.type_list.b) {
            if (this.alignment.type_list.i) {
                this.role.offset.y = this.alignment.offset.y + this.role.major.T.h - this.T.h;
            }
            else {
                this.role.offset.y = this.alignment.offset.y + this.role.major.T.h;
            }
        }
        if (this.alignment.type_list.r) {
            if (this.alignment.type_list.i) {
                this.role.offset.x = this.alignment.offset.x + this.role.major.T.w - this.T.w;
            }
            else {
                this.role.offset.x = this.alignment.offset.x + this.role.major.T.w;
            }
        }
        if (this.alignment.type_list.t) {
            if (this.alignment.type_list.i) {
                this.role.offset.y = this.alignment.offset.y;
            }
            else {
                this.role.offset.y = this.alignment.offset.y - this.T.h;
            }
        }
        if (this.alignment.type_list.l) {
            if (this.alignment.type_list.i) {
                this.role.offset.x = this.alignment.offset.x;
            }
            else {
                this.role.offset.x = this.alignment.offset.x - this.T.w;
            }
        }
        this.role.offset.x = this.role.offset.x || 0;
        this.role.offset.y = this.role.offset.y || 0;
        this.T.x = this.role.major.T.x + this.role.offset.x;
        this.T.y = this.role.major.T.y + this.role.offset.y;
        this.alignment.prev_offset = this.alignment.prev_offset || {};
        [this.alignment.prev_offset.x, this.alignment.prev_offset.y] = [this.alignment.offset.x, this.alignment.offset.y];
    };
    hard_set_T(X: number, Y: number, W: number, H: number) {
        this.T.x = X;
        this.T.y = Y;
        this.T.w = W;
        this.T.h = H;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.velocity.r = 0;
        this.velocity.scale = 0;
        this.VT.x = X;
        this.VT.y = Y;
        this.VT.w = W;
        this.VT.h = H;
        this.VT.r = this.T.r;
        this.VT.scale = this.T.scale;
        this.calculate_parrallax();
    };
    hard_set_VT() {
        this.VT.x = this.T.x;
        this.VT.y = this.T.y;
        this.VT.w = this.T.w;
        this.VT.h = this.T.h;
    };
    drag(offset: Position2D) {
        if (this.states.drag.can || offset) {
            this.ARGS.drag_cursor_trans = this.ARGS.drag_cursor_trans || {x:undefined,y:undefined};
            this.ARGS.drag_translation = this.ARGS.drag_translation || {x:undefined,y:undefined};
            let _p = this.ARGS.drag_cursor_trans;
            let _t = this.ARGS.drag_translation;
            _p.x = G.CONTROLLER.cursor_position.x / (G.TILESCALE * G.TILESIZE);
            _p.y = G.CONTROLLER.cursor_position.y / (G.TILESCALE * G.TILESIZE);
            [_t.x, _t.y] = [-this.container.T.w / 2, -this.container.T.h / 2];
            point_translate(_p, _t);
            point_rotate(_p, this.container.T.r);
            [_t.x, _t.y] = [this.container.T.w / 2 - this.container.T.x, this.container.T.h / 2 - this.container.T.y];
            point_translate(_p, _t);
            if (!offset) {
                offset = this.click_offset;
            }
            this.T.x = _p.x - offset.x;
            this.T.y = _p.y - offset.y;
            this.NEW_ALIGNMENT = true;
            for (const [k, v] of pairs(this.children)) {
                (v as LuaNode).drag(offset);
            }
        }
        if (this.states.drag.can) {
            LuaNode.prototype.drag.call(this);
        }
    };
    juice_up(amount:number, rot_amt: any) {
        if (G.SETTINGS.reduced_motion) {
            return;
        }
        amount = amount || 0.4;
        let end_time = G.TIMERS.REAL + 0.4;
        let start_time = G.TIMERS.REAL;
        this.juice = { scale: 0, scale_amt: amount, r: 0, r_amt: rot_amt || pseudorandom_element([0.6 * amount, -0.6 * amount]) || 0, start_time: start_time, end_time: end_time };
        this.VT.scale = 1 - 0.6 * amount;
    };
    move_juice(dt: number) {
        if (this.juice && !this.juice.handled_elsewhere) {
            if (this.juice.end_time < G.TIMERS.REAL) {
                this.juice = undefined;
            }
            else {
                this.juice.scale = this.juice.scale_amt * math.sin(50.8 * (G.TIMERS.REAL - this.juice.start_time)) * math.max(0, (this.juice.end_time - G.TIMERS.REAL) / (this.juice.end_time - this.juice.start_time) ^ 3);
                this.juice.r = this.juice.r_amt * math.sin(40.8 * (G.TIMERS.REAL - this.juice.start_time)) * math.max(0, (this.juice.end_time - G.TIMERS.REAL) / (this.juice.end_time - this.juice.start_time) ^ 2);
            }
        }
    };
    move(dt: number) {
        if (this.FRAME.MOVE >= G.FRAMES.MOVE) {
            return;
        }
        this.FRAME.OLD_MAJOR = this.FRAME.MAJOR;
        this.FRAME.MAJOR = undefined;
        this.FRAME.MOVE = G.FRAMES.MOVE;
        if (!this.created_on_pause && G.SETTINGS.paused) {
            return;
        }
        this.align_to_major();
        this.CALCING = undefined;
        if (this.role.role_type === "Glued") {
            if (this.role.major) {
                this.glue_to_major(this.role.major);
            }
        }
        else if (this.role.role_type === "Minor" && this.role.major) {
            if (this.role.major.FRAME.MOVE < G.FRAMES.MOVE) {this.role.major.move(dt)}
            this.STATIONARY = this.role.major.STATIONARY
            if (!this.STATIONARY || this.NEW_ALIGNMENT ||
                this.config.refresh_movement ||
                this.juice ||
                this.role.xy_bond == 'Weak' || 
                this.role.r_bond == 'Weak') {  
                    this.CALCING = true
                    this.move_with_major(dt) 
            }
        }
        else if (this.role.role_type === "Major") {
            this.STATIONARY = true
            this.move_juice(dt)
            this.move_xy(dt)
            this.move_r(dt, this.velocity)
            this.move_scale(dt)
            this.move_wh(dt)
            this.calculate_parrallax()
        }
        if (this.alignment && this.alignment.lr_clamp) {
            this.lr_clamp();
        }
        this.NEW_ALIGNMENT = false;
    };
    lr_clamp() {
        if (this.T.x < 0) {
            this.T.x = 0;
        }
        if (this.VT.x < 0) {
            this.VT.x = 0;
        }
        if (this.T.x + this.T.w > G.ROOM.T.w) {
            this.T.x = G.ROOM.T.w - this.T.w;
        }
        if (this.VT.x + this.VT.w > G.ROOM.T.w) {
            this.VT.x = G.ROOM.T.w - this.VT.w;
        }
    };
    glue_to_major(major_tab: { T: TransformValue; VT: TransformValue; pinch: { x: boolean; y: boolean; }; shadow_parrallax: Position2D; }) {
        this.T = major_tab.T;
        this.VT.x = major_tab.VT.x + 0.5 * (1 - major_tab.VT.w / major_tab.T.w) * this.T.w;
        this.VT.y = major_tab.VT.y;
        this.VT.w = major_tab.VT.w;
        this.VT.h = major_tab.VT.h;
        this.VT.r = major_tab.VT.r;
        this.VT.scale = major_tab.VT.scale;
        this.pinch = major_tab.pinch;
        this.shadow_parrallax = major_tab.shadow_parrallax;
    };
    move_with_major(dt: number) {
        if (this.role.role_type !== "Minor") {
            return;
        }
        let major_tab = this.role.major?.get_major();
        this.move_juice(dt);
        if (this.role.r_bond === "Weak") {
            [MWM.rotated_offset.x, MWM.rotated_offset.y] = [this.role.offset.x + major_tab.offset.x, this.role.offset.y + major_tab.offset.y];
        }
        else {
            if (major_tab.major.VT.r < 0.0001 && major_tab.major.VT.r > -0.0001) {
                MWM.rotated_offset.x = this.role.offset.x + major_tab.offset.x;
                MWM.rotated_offset.y = this.role.offset.y + major_tab.offset.y;
            }
            else {
                [MWM.angles.cos, MWM.angles.sin] = [math.cos(major_tab.major.VT.r), math.sin(major_tab.major.VT.r)];
                [MWM.WH.w, MWM.WH.h] = [-this.T.w / 2 + major_tab.major.T.w / 2, -this.T.h / 2 + major_tab.major.T.h / 2];
                [MWM.offs.x, MWM.offs.y] = [this.role.offset.x + major_tab.offset.x - MWM.WH.w, this.role.offset.y + major_tab.offset.y - MWM.WH.h];
                MWM.rotated_offset.x = MWM.offs.x * MWM.angles.cos - MWM.offs.y * MWM.angles.sin + MWM.WH.w;
                MWM.rotated_offset.y = MWM.offs.x * MWM.angles.sin + MWM.offs.y * MWM.angles.cos + MWM.WH.h;
            }
        }
        this.T.x = major_tab.major.T.x + MWM.rotated_offset.x;
        this.T.y = major_tab.major.T.y + MWM.rotated_offset.y;
        if (this.role.xy_bond === "Strong") {
            this.VT.x = major_tab.major.VT.x + MWM.rotated_offset.x;
            this.VT.y = major_tab.major.VT.y + MWM.rotated_offset.y;
        }
        else if (this.role.xy_bond === "Weak") {
            this.move_xy(dt)
        }
        if (this.role.r_bond === "Strong") {
            this.VT.r = this.T.r + major_tab.major.VT.r + (this.juice && this.juice.r || 0);
        }
        else if (this.role.r_bond === "Weak") {
            this.move_r(dt, this.velocity)
        }
        if (this.role.scale_bond === "Strong") {
            this.VT.scale = this.T.scale * (major_tab.major.VT.scale / major_tab.major.T.scale) + (this.juice && this.juice.scale || 0);
        }
        else if (this.role.scale_bond === "Weak") {
            this.move_scale(dt)
        }
        if (this.role.wh_bond === "Strong") {
            this.VT.x = this.VT.x + 0.5 * (1 - major_tab.major.VT.w / major_tab.major.T.w) * this.T.w;
            this.VT.w = this.T.w * (major_tab.major.VT.w / major_tab.major.T.w);
            this.VT.h = this.T.h * (major_tab.major.VT.h / major_tab.major.T.h);
        }
        else if (this.role.wh_bond === "Weak") {
            this.move_wh(dt)
        }
        this.calculate_parrallax();
    };
    move_xy(dt: number) {
        if (this.T.x !== this.VT.x || math.abs(this.velocity.x) > 0.01 || (this.T.y !== this.VT.y || math.abs(this.velocity.y) > 0.01)) {
            this.velocity.x = G.exp_times.xy * this.velocity.x + (1 - G.exp_times.xy) * (this.T.x - this.VT.x) * 35 * dt;
            this.velocity.y = G.exp_times.xy * this.velocity.y + (1 - G.exp_times.xy) * (this.T.y - this.VT.y) * 35 * dt;
            if (this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y > (G.exp_times.max_vel??0) * (G.exp_times.max_vel??0)) {
                let actual_vel = math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                this.velocity.x = (G.exp_times.max_vel??0) * this.velocity.x / actual_vel;
                this.velocity.y = (G.exp_times.max_vel??0) * this.velocity.y / actual_vel;
            }
            this.STATIONARY = false;
            this.VT.x = this.VT.x + this.velocity.x;
            this.VT.y = this.VT.y + this.velocity.y;
            if (math.abs(this.VT.x - this.T.x) < 0.01 && math.abs(this.velocity.x) < 0.01) {
                this.VT.x = this.T.x;
                this.velocity.x = 0;
            }
            if (math.abs(this.VT.y - this.T.y) < 0.01 && math.abs(this.velocity.y) < 0.01) {
                this.VT.y = this.T.y;
                this.velocity.y = 0;
            }
        }
    };
    move_scale(dt: any) {
        let des_scale = this.T.scale + (this.zoom && (this.states.drag.is && 0.1 || 0) + (this.states.hover.is && 0.05 || 0) || 0) + (this.juice && this.juice.scale || 0);
        if (des_scale !== this.VT.scale || math.abs(this.velocity.scale) > 0.001) {
            this.STATIONARY = false;
            this.velocity.scale = G.exp_times.scale * this.velocity.scale + (1 - G.exp_times.scale) * (des_scale - this.VT.scale);
            this.VT.scale = this.VT.scale + this.velocity.scale;
        }
    };
    move_wh(dt: number) {
        if (this.T.w !== this.VT.w && !this.pinch.x || this.T.h !== this.VT.h && !this.pinch.y || this.VT.w > 0 && this.pinch.x || this.VT.h > 0 && this.pinch.y) {
            this.STATIONARY = false;
            this.VT.w = this.VT.w + 8 * dt * (this.pinch.x && -1 || 1) * this.T.w;
            this.VT.h = this.VT.h + 8 * dt * (this.pinch.y && -1 || 1) * this.T.h;
            this.VT.w = math.max(math.min(this.VT.w, this.T.w), 0);
            this.VT.h = math.max(math.min(this.VT.h, this.T.h), 0);
        }
    };
    move_r(dt: number, vel: { x: number; }) {
        let des_r = this.T.r + 0.015 * vel.x / dt + (this.juice && this.juice.r * 2 || 0);
        if (des_r !== this.VT.r || math.abs(this.velocity.r) > 0.001) {
            this.STATIONARY = false;
            this.velocity.r = G.exp_times.r * this.velocity.r + (1 - G.exp_times.r) * (des_r - this.VT.r);
            this.VT.r = this.VT.r + this.velocity.r;
        }
        if (math.abs(this.VT.r - this.T.r) < 0.001 && math.abs(this.velocity.r) < 0.001) {
            this.VT.r = this.T.r;
            this.velocity.r = 0;
        }
    };
    calculate_parrallax() {
        if (!G.ROOM) {
            return;
        }
        this.shadow_parrallax.x = (this.T.x + this.T.w / 2 - G.ROOM.T.w / 2) / (G.ROOM.T.w / 2) * 1.5;
    };
    set_role(args: { role_type?: any; major?: any; xy_bond?: any; wh_bond?: any; r_bond?: any; scale_bond?: any; offset?: any; draw_major?: any; }) {
        if (args.major && !args.major.set_role) {
            return;
        }
        if (args.offset && (typeof (args.offset) === "object" && !(args.offset.y && args.offset.x)) || typeof (args.offset) !== "object") {
            args.offset = undefined;
        }
        this.role = { role_type: args.role_type || this.role.role_type, offset: args.offset || this.role.offset, major: args.major || this.role.major, xy_bond: args.xy_bond || this.role.xy_bond, wh_bond: args.wh_bond || this.role.wh_bond, r_bond: args.r_bond || this.role.r_bond, scale_bond: args.scale_bond || this.role.scale_bond, draw_major: args.draw_major || this.role.draw_major };
        if (this.role.role_type === "Major") {
            this.role.major = undefined;
        }
    };
    get_major() {
        if (this.role.role_type !== "Major" && this.role.major !== this && (this.role.xy_bond !== "Weak" && this.role.r_bond !== "Weak")) {
            if (!this.FRAME.MAJOR || G.REFRESH_FRAME_MAJOR_CACHE) {
                this.FRAME.MAJOR = this.FRAME.MAJOR || EMPTY(this.FRAME.OLD_MAJOR);
                this.temp_offs = EMPTY(this.temp_offs);
                let major = this.role.major?.get_major();
                this.FRAME.MAJOR.major = major.major;
                this.FRAME.MAJOR.offset = this.FRAME.MAJOR.offset || this.temp_offs;
                [this.FRAME.MAJOR.offset.x, this.FRAME.MAJOR.offset.y] = [major.offset.x + this.role.offset.x + this.layered_parallax.x, major.offset.y + this.role.offset.y + this.layered_parallax.y];
            }
            return this.FRAME.MAJOR;
        }
        else {
            this.ARGS.get_major = this.ARGS.get_major || {major:undefined,offset:{x:undefined,y:undefined}};
            this.ARGS.get_major.major = this;
            this.ARGS.get_major.offset = this.ARGS.get_major.offset || {x:undefined,y:undefined};
            [this.ARGS.get_major.offset.x, this.ARGS.get_major.offset.y] = [0, 0];
            return this.ARGS.get_major;
        }
    };
    remove() {
        for (const [k, v] of pairs(G.MOVEABLES)) {
            if (v === this) {
                table.remove(G.MOVEABLES, Number(k));
                break;
            }
        }
        for (const [k, v] of pairs(G.I.MOVEABLE)) {
            if (v === this) {
                table.remove(G.I.MOVEABLE, Number(k));
                break;
            }
        }
        LuaNode.prototype.remove.call(this);
    };
}
var MWM: {
    rotated_offset: Position2D;
    angles: Angle2D;
    WH: Size2D;
    offs: Position2D;
} = { rotated_offset: {x:NaN,y:NaN}, angles: {sin:NaN,cos:NaN}, WH: {w:NaN,h:NaN}, offs: {x:NaN,y:NaN} };