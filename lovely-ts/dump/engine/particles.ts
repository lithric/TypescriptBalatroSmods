///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

interface ParticleData {
    r_vel: any;
    facing: any;
    velocity: number;
    offset: Position2D;
    draw: boolean;
    e_vel?: number;
    e_prev: number;
    age: number;
    e_curr: number;
    scale: number;
    dir: number;
    colour: HexArray;
    size: number;
    visible_scale: number;
    time: number;
}

class Particles extends Moveable {
    fill: any;
    padding: any;
    timer: any;
    timer_type: any;
    last_real_time: number;
    last_drawn: number;
    lifespan: any;
    fade_alpha: number;
    speed: any;
    max: any;
    pulse_max: number;
    pulsed: number;
    vel_variation: any;
    particles: ParticleData[];
    scale: any;
    colours: HexArray[];
    constructor(X, Y, W, H, config) {
        super(X,Y,W,H)
        config = config || {};
        this.fill = config.fill;
        this.padding = config.padding || 0;
        if (config.attach) {
            if (this.role.major == undefined) {
                error("bad")
            }
            this.set_alignment({ major: config.attach, type: "cm", bond: "Strong" });
            table.insert(this.role.major.children, this);
            this.parent = this.role.major;
            this.T.x = this.role.major.T.x + this.padding;
            this.T.y = this.role.major.T.y + this.padding;
            if (this.fill) {
                this.T.w = this.role.major.T.w - this.padding;
                this.T.h = this.role.major.T.h - this.padding;
            }
        }
        this.states.hover.can = false;
        this.states.click.can = false;
        this.states.collide.can = false;
        this.states.drag.can = false;
        this.states.release_on.can = false;
        this.timer = config.timer || 0.5;
        this.timer_type = this.created_on_pause && "REAL" || config.timer_type || "REAL";
        this.last_real_time = G.TIMERS[this.timer_type] - this.timer;
        this.last_drawn = 0;
        this.lifespan = config.lifespan || 1;
        this.fade_alpha = 0;
        this.speed = config.speed || 1;
        this.max = config.max || 1000000000000000;
        this.pulse_max = math.min(20, config.pulse_max || 0);
        this.pulsed = 0;
        this.vel_variation = config.vel_variation || 1;
        this.particles = [];
        this.scale = config.scale || 1;
        this.colours = config.colours || [G.C.BACKGROUND.D];
        if (config.initialize) {
            for (let i = 1; i <= 60; i++) {
                this.last_real_time = this.last_real_time - 15 / 60;
                this.update(15 / 60);
                this.move(15 / 60);
            }
        }
        if (getmetatable(this) === Particles) {
            table.insert(G.I.MOVEABLE, this);
        }
    }
    update(dt) {
        if (G.SETTINGS.paused && !this.created_on_pause) {
            this.last_real_time = G.TIMERS[this.timer_type];
            return;
        }
        let added_this_frame = 0;
        while (G.TIMERS[this.timer_type] > this.last_real_time + this.timer && (this.particles.length < this.max || this.pulsed < this.pulse_max) && added_this_frame < 20) {
            this.last_real_time = this.last_real_time + this.timer;
            let new_offset = { x: this.fill && (0.5 - math.random()) * this.T.w || 0, y: this.fill && (0.5 - math.random()) * this.T.h || 0 };
            if (this.fill && this.T.r < 0.1 && this.T.r > -0.1) {
                let newer_offset = { x: math.sin(this.T.r) * new_offset.y + math.cos(this.T.r) * new_offset.x, y: math.sin(this.T.r) * new_offset.x + math.cos(this.T.r) * new_offset.y };
                new_offset = newer_offset;
            }
            table.insert(this.particles, { draw: false, dir: math.random() * 2 * math.pi, facing: math.random() * 2 * math.pi, size: math.random() * 0.5 + 0.1, age: 0, velocity: this.speed * (this.vel_variation * math.random() + (1 - this.vel_variation)) * 0.7, r_vel: 0.2 * (0.5 - math.random()), e_prev: 0, e_curr: 0, scale: 0, visible_scale: 0, time: G.TIMERS[this.timer_type], colour: pseudorandom_element(this.colours)[0]??[NaN,NaN,NaN,NaN], offset: new_offset });
            added_this_frame = added_this_frame + 1;
            if (this.pulsed <= this.pulse_max) {
                this.pulsed = this.pulsed + 1;
            }
        }
    };
    move(dt) {
        if (G.SETTINGS.paused && !this.created_on_pause) {
            return;
        }
        Moveable.prototype.move.call(this, dt);
        if (this.timer_type !== "REAL") {
            dt = dt * G.SPEEDFACTOR;
        }
        for (let i = this.particles.length-1; i >= 0; i += -1) {
            this.particles[i].draw = true;
            this.particles[i].e_vel = this.particles[i].e_vel || dt * this.scale;
            this.particles[i].e_prev = this.particles[i].e_curr;
            this.particles[i].age = this.particles[i].age + dt;
            this.particles[i].e_curr = math.min(2 * math.min(this.particles[i].age / this.lifespan * this.scale, this.scale * ((this.lifespan - this.particles[i].age) / this.lifespan)), this.scale);
            this.particles[i].e_vel = (this.particles[i].e_curr - this.particles[i].e_prev) * this.scale * dt + (1 - this.scale * dt) * (this.particles[i].e_vel??1);
            this.particles[i].scale = this.particles[i].scale + (this.particles[i].e_vel??1);
            this.particles[i].scale = math.min(2 * math.min(this.particles[i].age / this.lifespan * this.scale, this.scale * ((this.lifespan - this.particles[i].age) / this.lifespan)), this.scale);
            if (this.particles[i].scale < 0) {
                table.remove(this.particles, i);
            }
            else {
                this.particles[i].offset.x = this.particles[i].offset.x + this.particles[i].velocity * math.sin(this.particles[i].dir) * dt;
                this.particles[i].offset.y = this.particles[i].offset.y + this.particles[i].velocity * math.cos(this.particles[i].dir) * dt;
                this.particles[i].facing = this.particles[i].facing + this.particles[i].r_vel * dt;
                this.particles[i].velocity = math.max(0, this.particles[i].velocity - this.particles[i].velocity * 0.07 * dt);
            }
        }
    };
    fade(delay, to) {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", timer: this.timer_type, blockable: false, blocking: false, ref_value: "fade_alpha", ref_table: this, ease_to: to || 1, delay: delay }));
    };
    draw(alpha) {
        alpha = alpha || 1;
        prep_draw(this, 1);
        love.graphics.translate(this.T.w / 2, this.T.h / 2);
        for (const [k, w] of pairs(this.particles)) {
            let v = w as ParticleData
            if (v.draw) {
                love.graphics.push();
                love.graphics.setColor(v.colour[0], v.colour[1], v.colour[2], v.colour[3] * alpha * (1 - this.fade_alpha));
                love.graphics.translate(v.offset.x, v.offset.y);
                love.graphics.rotate(v.facing);
                love.graphics.rectangle("fill", -v.scale / 2, -v.scale / 2, v.scale, v.scale);
                love.graphics.pop();
            }
        }
        love.graphics.pop();
        add_to_drawhash(this);
        this.draw_boundingrect();
    };
    remove() {
        if (this.role.major) {
            for (const [k, v] of pairs(this.role.major.children)) {
                if (v === this && type(k) === "number") {
                    table.remove(this.role.major.children, Number(k));
                }
            }
        }
        remove_all(this.children);
        Moveable.prototype.remove.call(this);
    };
}