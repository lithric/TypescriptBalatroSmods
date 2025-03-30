///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="node.ts"/>
///<reference path="moveable.ts"/>
class Sprite extends Moveable {
    atlas: any;
    scale: Position2D;
    scale_mag: number;
    sprite_pos_copy: Position2D;
    sprite: import("love.graphics").Quad;
    image_dims: {};
    draw_steps: DrawStepDefinition[];
    video: any;
    video_dims: any;
    shader_tab: any;
    sprite_pos: {x:number;y:number;v?:number};
    constructor(X: number, Y: number, W: number, H: number, new_sprite_atlas: any, sprite_pos: Position2D) {
        super(X,Y,W,H);
        this.CT = this.VT;
        this.atlas = new_sprite_atlas;
        this.scale = { x: this.atlas.px, y: this.atlas.py };
        this.scale_mag = Math.min(this.scale.x / W, this.scale.y / H);
        this.zoom = true;
        this.set_sprite_pos(sprite_pos);
        if (this instanceof Sprite) {
            G.I.SPRITE.push(this);
        }
    }
    reset() {
        this.atlas = G.ASSET_ATLAS[this.atlas.name];
        this.set_sprite_pos(this.sprite_pos);
    };
    set_sprite_pos(sprite_pos: { v?: number; y: number; x: number; }) {
        if (sprite_pos && sprite_pos.v) {
            this.sprite_pos = { x: math.random(sprite_pos.v) - 1, y: sprite_pos.y };
        }
        else {
            this.sprite_pos = sprite_pos || { x: 0, y: 0 };
        }
        this.sprite_pos_copy = { x: this.sprite_pos.x, y: this.sprite_pos.y };
        this.sprite = love.graphics.newQuad(this.sprite_pos.x * this.atlas.px, this.sprite_pos.y * this.atlas.py, this.scale.x, this.scale.y, this.atlas.image.getDimensions());
        this.image_dims = {};
        [this.image_dims[1], this.image_dims[2]] = this.atlas.image.getDimensions();
    };
    get_pos_pixel() {
        this.RETS.get_pos_pixel = this.RETS.get_pos_pixel ?? [];
        this.RETS.get_pos_pixel[0] = this.sprite_pos.x;
        this.RETS.get_pos_pixel[1] = this.sprite_pos.y;
        this.RETS.get_pos_pixel[2] = this.atlas.px;
        this.RETS.get_pos_pixel[3] = this.atlas.py;
        return this.RETS.get_pos_pixel;
    };
    get_image_dims() {
        return this.image_dims;
    };
    define_draw_steps(draw_step_definitions: DrawStepDefinition[]) {
        this.draw_steps = EMPTY(this.draw_steps);
        for (const [k, v] of ipairs(draw_step_definitions)) {
            this.draw_steps[this.draw_steps.length + 1] = { shader: v.shader || "dissolve", shadow_height: v.shadow_height || undefined, send: v.send || undefined, no_tilt: v.no_tilt || undefined, other_obj: v.other_obj || undefined, ms: v.ms || undefined, mr: v.mr || undefined, mx: v.mx || undefined, my: v.my || undefined };
        }
    };
    draw_shader(_shader: string, _shadow_height: number, _send?: DrawStepSend[], _no_tilt?: boolean, other_obj?: any, ms?: number, mr?: number, mx?: number, my?: number, custom_shader?: boolean, tilt_shadow?: number) {
        if (G.SETTINGS.reduced_motion) {
            _no_tilt = true;
        }
        let _draw_major = this.role.draw_major || this;
        if (_shadow_height) {
            this.VT.y = this.VT.y - _draw_major.shadow_parrallax.y * _shadow_height;
            this.VT.x = this.VT.x - _draw_major.shadow_parrallax.x * _shadow_height;
            this.VT.scale = this.VT.scale * (1 - 0.2 * _shadow_height);
        }
        if (custom_shader) {
            if (_send) {
                for (const [k, v] of ipairs(_send)) {
                    G.SHADERS[_shader].send(v.name, v.val || v.func && v.func() || v.ref_table[v.ref_value]);
                }
            }
        }
        if (!custom_shader && _shader === "vortex") {
            G.SHADERS["vortex"].send("vortex_amt", G.TIMERS.REAL - (G.vortex_time || 0));
        }
        if (!custom_shader && _shader !== "vortex") {
            this.ARGS.prep_shader = this.ARGS.prep_shader || {};
            this.ARGS.prep_shader.cursor_pos = this.ARGS.prep_shader.cursor_pos || {};
            this.ARGS.prep_shader.cursor_pos[1] = _draw_major.tilt_var && _draw_major.tilt_var.mx * G.CANV_SCALE || G.CONTROLLER.cursor_position.x * G.CANV_SCALE;
            this.ARGS.prep_shader.cursor_pos[2] = _draw_major.tilt_var && _draw_major.tilt_var.my * G.CANV_SCALE || G.CONTROLLER.cursor_position.y * G.CANV_SCALE;
            G.SHADERS[_shader || "dissolve"].send("mouse_screen_pos", this.ARGS.prep_shader.cursor_pos);
            G.SHADERS[_shader || "dissolve"].send("screen_scale", G.TILESCALE * G.TILESIZE * (_draw_major.mouse_damping || 1) * G.CANV_SCALE);
            G.SHADERS[_shader || "dissolve"].send("hovering", (_shadow_height && !tilt_shadow || _no_tilt) && 0 || (_draw_major.hover_tilt || 0) * (tilt_shadow || 1));
            G.SHADERS[_shader || "dissolve"].send("dissolve", Math.abs(_draw_major.dissolve || 0));
            G.SHADERS[_shader || "dissolve"].send("time", 123.33412 * (_draw_major.ID / 1.14212 || 12.5123152) % 3000);
            G.SHADERS[_shader || "dissolve"].send("texture_details", this.get_pos_pixel());
            G.SHADERS[_shader || "dissolve"].send("image_details", this.get_image_dims());
            G.SHADERS[_shader || "dissolve"].send("burn_colour_1", _draw_major.dissolve_colours && _draw_major.dissolve_colours[1] || G.C.CLEAR);
            G.SHADERS[_shader || "dissolve"].send("burn_colour_2", _draw_major.dissolve_colours && _draw_major.dissolve_colours[2] || G.C.CLEAR);
            G.SHADERS[_shader || "dissolve"].send("shadow", !!_shadow_height);
            if (_send) {
                G.SHADERS[_shader || "dissolve"].send(SMODS.Shaders[_shader || "dissolve"] && SMODS.Shaders[_shader || "dissolve"].original_key || _shader, _send);
            }
        }
        let p_shader = SMODS.Shader.obj_table[_shader || "dissolve"];
        if (p_shader && type(p_shader.send_vars) === "function") {
            let sh = G.SHADERS[_shader || "dissolve"];
            let parent_card = this.role.major && this.role.major.is(Card) && this.role.major;
            let send_vars = p_shader.send_vars(this, parent_card);
            if (type(send_vars) === "table") {
                for (const [key, value] of pairs(send_vars)) {
                    sh.send(key as (string|number), value);
                }
            }
        }
        love.graphics.setShader(G.SHADERS[_shader || "dissolve"], /**G.SHADERS[_shader || "dissolve"]*/);
        if (other_obj) {
            this.draw_from(other_obj, ms, mr, mx, my);
        }
        else {
            this.draw_this();
        }
        love.graphics.setShader();
        if (_shadow_height) {
            this.VT.y = this.VT.y + _draw_major.shadow_parrallax.y * _shadow_height;
            this.VT.x = this.VT.x + _draw_major.shadow_parrallax.x * _shadow_height;
            this.VT.scale = this.VT.scale / (1 - 0.2 * _shadow_height);
        }
    };
    draw_this(overlay?: HexArray) {
        if (!this.states.visible) {
            return;
        }
        if (this.sprite_pos.x !== this.sprite_pos_copy.x || this.sprite_pos.y !== this.sprite_pos_copy.y) {
            this.set_sprite_pos(this.sprite_pos);
        }
        prep_draw(this, 1);
        love.graphics.scale(1 / (this.scale.x / this.VT.w), 1 / (this.scale.y / this.VT.h));
        love.graphics.setColor(...(overlay || G.BRUTE_OVERLAY || G.C.WHITE));
        if (this.video) {
            this.video_dims = this.video_dims || { w: this.video.getWidth(), h: this.video.getHeight() };
            love.graphics.draw(this.video, 0, 0, 0, this.VT.w / this.T.w / (this.video_dims.w / this.scale.x), this.VT.h / this.T.h / (this.video_dims.h / this.scale.y));
        }
        else {
            love.graphics.draw(this.atlas.image, this.sprite, 0, 0, 0, this.VT.w / this.T.w, this.VT.h / this.T.h);
        }
        love.graphics.pop();
        add_to_drawhash(this);
        this.draw_boundingrect();
        if (this.shader_tab) {
            love.graphics.setShader();
        }
    };
    draw(overlay?: any) {
        if (!this.states.visible) {
            return;
        }
        if (this.draw_steps) {
            for (const [k, v] of ipairs(this.draw_steps)) {
                this.draw_shader(v.shader, v.shadow_height??0, v.send, v.no_tilt, v.other_obj, v.ms, v.mr, v.mx, v.my, !!v.send);
            }
        }
        else {
            this.draw_this(overlay);
        }
        add_to_drawhash(this);
        for (const [k, v] of pairs(this.children)) {
            if (k !== "h_popup") {
                v.draw();
            }
        }
        add_to_drawhash(this);
        this.draw_boundingrect();
    };
    draw_from(other_obj: Sprite, ms?: number, mr?: number, mx?: number, my?: number) {
        this.ARGS.draw_from_offset = this.ARGS.draw_from_offset || {};
        this.ARGS.draw_from_offset.x = mx || 0;
        this.ARGS.draw_from_offset.y = my || 0;
        prep_draw(other_obj, 1 + (ms || 0), mr || 0, this.ARGS.draw_from_offset, true);
        love.graphics.scale(1 / (other_obj.scale_mag || other_obj.VT.scale));
        love.graphics.setColor(G.BRUTE_OVERLAY || G.C.WHITE);
        love.graphics.draw(this.atlas.image, this.sprite, -(other_obj.T.w / 2 - other_obj.VT.w / 2) * 10, 0, 0, other_obj.VT.w / other_obj.T.w, other_obj.VT.h / other_obj.T.h);
        this.draw_boundingrect();
        love.graphics.pop();
    };
    remove() {
        if (this.video) {
            this.video.release();
        }
        for (const [k, v] of pairs(G.ANIMATIONS)) {
            if (v === this) {
                table.remove(G.ANIMATIONS, k as (number|undefined));
            }
        }
        for (const [k, v] of pairs(G.I.SPRITE)) {
            if (v === this) {
                table.remove(G.I.SPRITE, k as (number|undefined));
            }
        }
        Moveable.prototype.remove.call(this);
    };
}