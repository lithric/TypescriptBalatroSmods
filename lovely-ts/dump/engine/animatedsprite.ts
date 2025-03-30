
class AnimatedSprite extends Sprite {
    animation: {x:number,y:number,frames:number,current:number,w:number,h:number};
    frame_offset: number;
    current_animation: { current: number; frames: number; w: number; h: number; };
    offset_seconds: number;
    float: boolean;
    constructor(X, Y, W, H, new_sprite_atlas, sprite_pos) {
        super(X, Y, W, H, new_sprite_atlas, sprite_pos);
        this.offset = { x: 0, y: 0 };
        table.insert(G.ANIMATIONS, this);
        if (this instanceof AnimatedSprite) {
            table.insert(G.I.SPRITE, this);
        }
    }
    rescale() {
        this.scale_mag = math.min(this.scale.x / this.T.w, this.scale.y / this.T.h);
    };
    reset() {
        this.atlas = G.ANIMATION_ATLAS[this.atlas.name];
        this.set_sprite_pos({ x: this.animation.x, y: this.animation.y });
    };
    set_sprite_pos(sprite_pos) {
        this.animation = { x: sprite_pos && sprite_pos.x || 0, y: sprite_pos && sprite_pos.y || 0, frames: this.atlas.frames, current: 0, w: this.scale.x, h: this.scale.y };
        this.frame_offset = 0;
        this.current_animation = { current: 0, frames: this.animation.frames, w: this.animation.w, h: this.animation.h };
        this.image_dims = this.image_dims || {};
        [this.image_dims[0], this.image_dims[1]] = this.atlas.image.getDimensions();
        this.sprite = love.graphics.newQuad(0, this.animation.h * this.animation.y, this.animation.w, this.animation.h, this.image_dims[0], this.image_dims[1]);
        this.offset_seconds = G.TIMERS.REAL;
    };
    get_pos_pixel() {
        this.RETS.get_pos_pixel = this.RETS.get_pos_pixel || [];
        this.RETS.get_pos_pixel[0] = this.current_animation.current;
        this.RETS.get_pos_pixel[1] = this.animation.y;
        this.RETS.get_pos_pixel[2] = this.animation.w;
        this.RETS.get_pos_pixel[3] = this.animation.h;
        return this.RETS.get_pos_pixel;
    };
    draw_this() {
        if (!this.states.visible) {
            return;
        }
        prep_draw(this, 1);
        love.graphics.scale(1 / this.scale_mag);
        love.graphics.setColor(G.C.WHITE);
        love.graphics.draw(this.atlas.image, this.sprite, 0, 0, 0, this.VT.w / this.T.w, this.VT.h / this.T.h);
        love.graphics.pop();
    };
    animate() {
        let new_frame = math.floor(G.ANIMATION_FPS * (G.TIMERS.REAL - this.offset_seconds)) % this.current_animation.frames;
        if (new_frame !== this.current_animation.current) {
            this.current_animation.current = new_frame;
            this.frame_offset = math.floor(this.animation.w * this.current_animation.current);
            this.sprite.setViewport(this.frame_offset, this.animation.h * this.animation.y, this.animation.w, this.animation.h);
        }
        if (this.float) {
            this.T.r = 0.02 * math.sin(2 * G.TIMERS.REAL + this.T.x);
            this.offset.y = -(1 + 0.3 * math.sin(0.666 * G.TIMERS.REAL + this.T.y)) * this.shadow_parrallax.y;
            this.offset.x = -(0.7 + 0.2 * math.sin(0.666 * G.TIMERS.REAL + this.T.x)) * this.shadow_parrallax.x;
        }
    };
    remove() {
        for (const [k, v] of pairs(G.ANIMATIONS)) {
            if (v === this) {
                table.remove(G.ANIMATIONS, Number(k));
            }
        }
        for (const [k, v] of pairs(G.I.SPRITE)) {
            if (v === this) {
                table.remove(G.I.SPRITE, Number(k));
            }
        }
        Sprite.prototype.remove.call(this);
    };
}