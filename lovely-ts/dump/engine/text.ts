
class DynaText extends Moveable {
    shadow: any;
    scale: any;
    pop_in_rate: any;
    bump_rate: any;
    bump_amount: any;
    font: any;
    string: string;
    text_offset: Position2D;
    colours: any;
    created_time: number;
    silent: any;
    start_pop_in: any;
    strings: string[];
    focused_string: number;
    pop_delay: any;
    reset_pop_in: boolean;
    ui_object_updated: boolean;
    non_recalc: any;
    pop_out_time: any;
    pop_cycle: any;
    constructor(config) {
        super(config.X || 0, config.Y || 0, config.W, config.H)
        config = config || {};
        this.config = config;
        this.shadow = config.shadow;
        this.scale = config.scale || 1;
        this.pop_in_rate = config.pop_in_rate || 3;
        this.bump_rate = config.bump_rate || 2.666;
        this.bump_amount = config.bump_amount || 1;
        this.font = config.font || G.LANG.font;
        if (config.string && type(config.string) !== "table") {
            config.string = [config.string];
        }
        this.string = config.string && type(config.string) === "table" && config.string[1] || ["HELLO WORLD"];
        this.text_offset = { x: this.font.TEXT_OFFSET.x * this.scale + (this.config.x_offset || 0), y: this.font.TEXT_OFFSET.y * this.scale + (this.config.y_offset || 0) };
        this.colours = config.colours || [G.C.RED];
        this.created_time = G.TIMERS.REAL;
        this.silent = config.silent;
        this.start_pop_in = this.config.pop_in;
        config.W = 0;
        config.H = 0;
        this.strings = [];
        this.focused_string = 1;
        this.update_text(true);
        if (this.config.maxw && this.config.W > this.config.maxw) {
            this.start_pop_in = this.config.pop_in;
            this.scale = this.scale * (this.config.maxw / this.config.W);
            this.update_text(true);
        }
        if (this.strings.length > 1) {
            this.pop_delay = this.config.pop_delay || 1.5;
            this.pop_out(4);
        }
        this.T.r = this.config.text_rot || 0;
        this.states.hover.can = false;
        this.states.click.can = false;
        this.states.collide.can = false;
        this.states.drag.can = false;
        this.states.release_on.can = false;
        this.set_role({
            wh_bond: "Weak", scale_bond: "Weak",
            role_type: undefined,
            major: undefined,
            xy_bond: undefined,
            r_bond: undefined
        });
        if (getmetatable(this) === DynaText) {
            table.insert(G.I.MOVEABLE, this);
        }
    }
    update(dt:number) {
        this.update_text();
        this.align_letters();
    };
    update_text(first_pass?:any) {
        this.config.W = 0;
        this.config.H = 0;
        this.scale = this.config.scale_function && this.config.scale_function() || this.scale;
        for (const [k, v] of ipairs(this.config.string)) {
            if (type(v) === "table" && v.ref_table || first_pass) {
                let [part_a, part_b] = [0, 1000000];
                let new_string = v;
                let outer_colour = undefined;
                let inner_colour = undefined;
                let part_scale = 1;
                if (type(v) === "table" && (v.ref_table || v.string)) {
                    new_string = (v.prefix || "") + (format_ui_value(v.ref_table && v.ref_table[v.ref_value] || v.string) + (v.suffix || ""));
                    part_a = (v.prefix || "").length;
                    part_b = new_string.length - (v.suffix || "").length;
                    if (v.scale) {
                        part_scale = v.scale;
                    }
                    if (first_pass) {
                        outer_colour = v.outer_colour || undefined;
                        inner_colour = v.colour || undefined;
                    }
                    v = new_string;
                }
                this.strings[k] = this.strings[k] || {};
                let old_string = this.strings[k].string;
                if (old_string !== new_string || first_pass) {
                    if (this.start_pop_in) {
                        this.reset_pop_in = true;
                    }
                    this.reset_pop_in = this.reset_pop_in || this.config.reset_pop_in;
                    if (!this.reset_pop_in) {
                        this.config.pop_out = undefined;
                        this.config.pop_in = undefined;
                    }
                    else {
                        this.config.pop_in = this.config.pop_in || 0;
                        this.created_time = G.TIMERS.REAL;
                    }
                    this.strings[k].string = v;
                    let old_letters = this.strings[k].letters;
                    let tempW = 0;
                    let tempH = 0;
                    let current_letter = 1;
                    this.strings[k].letters = {};
                    for (const [_, c] of utf8.chars(v)) {
                        let old_letter = old_letters && old_letters[current_letter] || undefined;
                        let let_tab = { letter: love.graphics.newText(this.font.FONT, c), char: c, scale: old_letter && old_letter.scale || part_scale };
                        this.strings[k].letters[current_letter] = let_tab;
                        let tx = this.font.FONT.getWidth(c) * this.scale * part_scale * G.TILESCALE * this.font.FONTSCALE + 2.7 * (this.config.spacing || 0) * G.TILESCALE * this.font.FONTSCALE;
                        let ty = this.font.FONT.getHeight(c) * this.scale * part_scale * G.TILESCALE * this.font.FONTSCALE * this.font.TEXT_HEIGHT_SCALE;
                        let_tab.offset = old_letter && old_letter.offset || { x: 0, y: 0 };
                        let_tab.dims = { x: tx / (this.font.FONTSCALE * G.TILESCALE), y: ty / (this.font.FONTSCALE * G.TILESCALE) };
                        let_tab.pop_in = first_pass && (old_letter && old_letter.pop_in || (this.config.pop_in && 0 || 1)) || 1;
                        let_tab.prefix = current_letter <= part_a && outer_colour || undefined;
                        let_tab.suffix = current_letter > part_b && outer_colour || undefined;
                        let_tab.colour = inner_colour || undefined;
                        if (k > 1) {
                            let_tab.pop_in = 0;
                        }
                        tempW = tempW + tx / (G.TILESIZE * G.TILESCALE);
                        tempH = math.max(ty / (G.TILESIZE * G.TILESCALE), tempH);
                        current_letter = current_letter + 1;
                    }
                    this.strings[k].W = tempW;
                    this.strings[k].H = tempH;
                }
            }
            if (this.strings[k].W > this.config.W) {
                this.config.W = this.strings[k].W;
                this.strings[k].W_offset = 0;
            }
            if (this.strings[k].H > this.config.H) {
                this.config.H = this.strings[k].H;
                this.strings[k].H_offset = 0;
            }
        }
        if (this.T) {
            if ((this.T.w !== this.config.W || this.T.h !== this.config.H) && (!first_pass || this.reset_pop_in)) {
                this.ui_object_updated = true;
                this.non_recalc = this.config.non_recalc;
            }
            this.T.w = this.config.W;
            this.T.h = this.config.H;
        }
        this.reset_pop_in = false;
        this.start_pop_in = false;
        for (const [k, v] of ipairs(this.strings)) {
            v.W_offset = 0.5 * (this.config.W - v.W);
            v.H_offset = 0.5 * (this.config.H - v.H + (this.config.offset_y || 0));
        }
    };
    pop_out(pop_out_timer) {
        this.config.pop_out = pop_out_timer || 1;
        this.pop_out_time = G.TIMERS.REAL + (this.pop_delay || 0);
    };
    pop_in(pop_in_timer) {
        this.reset_pop_in = true;
        this.config.pop_out = undefined;
        this.config.pop_in = pop_in_timer || 0;
        this.created_time = G.TIMERS.REAL;
        for (const [k, letter] of ipairs(this.strings[this.focused_string].letters)) {
            letter.pop_in = 0;
        }
        this.update_text();
    };
    align_letters() {
        if (this.pop_cycle) {
            this.focused_string = this.config.random_element && math.random(1, this.strings.length) || this.focused_string === this.strings.length && 1 || this.focused_string + 1;
            this.pop_cycle = false;
            for (const [k, letter] of ipairs(this.strings[this.focused_string].letters)) {
                letter.pop_in = 0;
            }
            this.config.pop_in = 0.1;
            this.config.pop_out = undefined;
            this.created_time = G.TIMERS.REAL;
        }
        this.string = this.strings[this.focused_string].string;
        for (const [k, letter] of ipairs(this.strings[this.focused_string].letters)) {
            if (this.config.pop_out) {
                letter.pop_in = math.min(1, math.max((this.config.min_cycle_time || 1) - (G.TIMERS.REAL - this.pop_out_time) * this.config.pop_out / (this.config.min_cycle_time || 1), 0));
                letter.pop_in = letter.pop_in * letter.pop_in;
                if (k === this.strings[this.focused_string].letters.length && letter.pop_in <= 0 && this.strings.length > 1) {
                    this.pop_cycle = true;
                }
            }
            else if (this.config.pop_in) {
                let prev_pop_in = letter.pop_in;
                letter.pop_in = math.min(1, math.max((G.TIMERS.REAL - this.config.pop_in - this.created_time) * this.string.length * this.pop_in_rate - k + 1, this.config.min_cycle_time === 0 && 1 || 0));
                letter.pop_in = letter.pop_in * letter.pop_in;
                if (prev_pop_in <= 0 && letter.pop_in > 0 && !this.silent && (this.string.length < 10 || k % 2 === 0)) {
                    if (this.T.x > G.ROOM.T.w + 2 || this.T.y > G.ROOM.T.h + 2 || this.T.x < -2 || this.T.y < -2) { }
                    else {
                        play_sound("paper1", 0.45 + 0.05 * math.random() + 0.3 / this.string.length * k + (this.config.pitch_shift || 0));
                    }
                }
                if (k === this.strings[this.focused_string].letters.length && letter.pop_in >= 1) {
                    if (this.strings.length > 1) {
                        this.pop_delay = G.TIMERS.REAL - this.config.pop_in - this.created_time + (this.config.pop_delay || 1.5);
                        this.pop_out(4);
                    }
                    else {
                        this.config.pop_in = undefined;
                    }
                }
            }
            letter.r = 0;
            letter.scale = 1;
            if (this.config.rotate) {
                letter.r = (this.config.rotate === 2 && -1 || 1) * (0.2 * (-this.strings[this.focused_string].letters.length / 2 - 0.5 + k) / this.strings[this.focused_string].letters.length + (G.SETTINGS.reduced_motion && 0 || 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + k));
            }
            if (this.config.pulse) {
                letter.scale = letter.scale + (G.SETTINGS.reduced_motion && 0 || 1) * (1 / this.config.pulse.width) * this.config.pulse.amount * math.max(math.min((this.config.pulse.start - G.TIMERS.REAL) * this.config.pulse.speed + k + this.config.pulse.width, (G.TIMERS.REAL - this.config.pulse.start) * this.config.pulse.speed - k + this.config.pulse.width + 2), 0);
                letter.r = letter.r + (G.SETTINGS.reduced_motion && 0 || 1) * (letter.scale - 1) * 0.02 * (-this.strings[this.focused_string].letters.length / 2 - 0.5 + k);
                if (this.config.pulse.start > G.TIMERS.REAL + 2 * this.config.pulse.speed * this.strings[this.focused_string].letters.length) {
                    this.config.pulse = undefined;
                }
            }
            if (this.config.quiver) {
                letter.scale = letter.scale + (G.SETTINGS.reduced_motion && 0 || 1) * 0.1 * this.config.quiver.amount;
                letter.r = letter.r + (G.SETTINGS.reduced_motion && 0 || 1) * 0.3 * this.config.quiver.amount * (math.sin(41.12342 * G.TIMERS.REAL * this.config.quiver.speed + k * 1223.2) + math.cos(63.21231 * G.TIMERS.REAL * this.config.quiver.speed + k * 1112.2) * math.sin(36.1231 * G.TIMERS.REAL * this.config.quiver.speed) + math.cos(95.123 * G.TIMERS.REAL * this.config.quiver.speed + k * 1233.2) - math.sin(30.133421 * G.TIMERS.REAL * this.config.quiver.speed + k * 123.2));
            }
            if (this.config.float) {
                letter.offset.y = (G.SETTINGS.reduced_motion && 0 || 1) * math.sqrt(this.scale) * (2 + this.font.FONTSCALE / G.TILESIZE * 2000 * math.sin(2.666 * G.TIMERS.REAL + 200 * k)) + 60 * (letter.scale - 1);
            }
            if (this.config.bump) {
                letter.offset.y = (G.SETTINGS.reduced_motion && 0 || 1) * this.bump_amount * math.sqrt(this.scale) * 7 * math.max(0, (5 + this.bump_rate) * math.sin(this.bump_rate * G.TIMERS.REAL + 200 * k) - 3 - this.bump_rate);
            }
        }
    };
    set_quiver(amt) {
        this.config.quiver = { speed: 0.5, amount: amt || 0.7, silent: false };
    };
    pulse(amt) {
        this.config.pulse = { speed: 40, width: 2.5, start: G.TIMERS.REAL, amount: amt || 0.2, silent: false };
    };
    draw() {
        if (this.children.particle_effect) {
            this.children.particle_effect.draw();
        }
        if (this.shadow) {
            prep_draw(this, 1);
            love.graphics.translate(this.strings[this.focused_string].W_offset + this.text_offset.x * this.font.FONTSCALE / G.TILESIZE, this.strings[this.focused_string].H_offset + this.text_offset.y * this.font.FONTSCALE / G.TILESIZE);
            if (this.config.spacing) {
                love.graphics.translate(this.config.spacing * this.font.FONTSCALE / G.TILESIZE, 0);
            }
            if (this.config.shadow_colour) {
                love.graphics.setColor(this.config.shadow_colour);
            }
            else {
                love.graphics.setColor(0, 0, 0, 0.3 * this.colours[1][4]);
            }
            for (const [k, letter] of ipairs(this.strings[this.focused_string].letters)) {
                let real_pop_in = this.config.min_cycle_time === 0 && 1 || letter.pop_in;
                love.graphics.draw(letter.letter, 0.5 * (letter.dims.x - letter.offset.x) * this.font.FONTSCALE / G.TILESIZE - this.shadow_parrallax.x * this.scale / G.TILESIZE, 0.5 * letter.dims.y * this.font.FONTSCALE / G.TILESIZE - this.shadow_parrallax.y * this.scale / G.TILESIZE, letter.r || 0, real_pop_in * this.scale * this.font.FONTSCALE / G.TILESIZE, real_pop_in * this.scale * this.font.FONTSCALE / G.TILESIZE, 0.5 * letter.dims.x / this.scale, 0.5 * letter.dims.y / this.scale);
                love.graphics.translate(letter.dims.x * this.font.FONTSCALE / G.TILESIZE, 0);
            }
            love.graphics.pop();
        }
        prep_draw(this, 1);
        love.graphics.translate(this.strings[this.focused_string].W_offset + this.text_offset.x * this.font.FONTSCALE / G.TILESIZE, this.strings[this.focused_string].H_offset + this.text_offset.y * this.font.FONTSCALE / G.TILESIZE);
        if (this.config.spacing) {
            love.graphics.translate(this.config.spacing * this.font.FONTSCALE / G.TILESIZE, 0);
        }
        this.ARGS.draw_shadow_norm = this.ARGS.draw_shadow_norm || {};
        let _shadow_norm = this.ARGS.draw_shadow_norm;
        [_shadow_norm.x, _shadow_norm.y] = [this.shadow_parrallax.x / math.sqrt(this.shadow_parrallax.y * this.shadow_parrallax.y + this.shadow_parrallax.x * this.shadow_parrallax.x) * this.font.FONTSCALE / G.TILESIZE, this.shadow_parrallax.y / math.sqrt(this.shadow_parrallax.y * this.shadow_parrallax.y + this.shadow_parrallax.x * this.shadow_parrallax.x) * this.font.FONTSCALE / G.TILESIZE];
        for (const [k, letter] of ipairs(this.strings[this.focused_string].letters)) {
            let real_pop_in = this.config.min_cycle_time === 0 && 1 || letter.pop_in;
            love.graphics.setColor(letter.prefix || letter.suffix || letter.colour || this.colours[k % this.colours.length + 1]);
            love.graphics.draw(letter.letter, 0.5 * (letter.dims.x - letter.offset.x) * this.font.FONTSCALE / G.TILESIZE + _shadow_norm.x, 0.5 * (letter.dims.y - letter.offset.y) * this.font.FONTSCALE / G.TILESIZE + _shadow_norm.y, letter.r || 0, real_pop_in * letter.scale * this.scale * this.font.FONTSCALE / G.TILESIZE, real_pop_in * letter.scale * this.scale * this.font.FONTSCALE / G.TILESIZE, 0.5 * letter.dims.x / this.scale, 0.5 * letter.dims.y / this.scale);
            love.graphics.translate(letter.dims.x * this.font.FONTSCALE / G.TILESIZE, 0);
        }
        love.graphics.pop();
        add_to_drawhash(this);
        this.draw_boundingrect();
    };
}