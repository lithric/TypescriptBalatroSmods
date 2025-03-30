///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

interface TransformInit {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    r?: number;
    scale?: number;
    [0]?: number;
    [1]?: number;
    [2]?: number;
    [3]?: number;
    [4]?: number;
    [5]?: number;
}

type TransformArray = [number?,number?,number?,number?,number?,number?]

interface TransformValue extends Position2D {
    x:number,
    y:number,
    w:number,
    h:number,
    r:number,
    scale:number
}

interface LuaNodeUi {
    area_uibox?: UIBox;
    peek_deck?: any;
    view_deck?: any;
    alert?: UIBox;
    particle_effect?: Particles;
    h_popup?:UIBox;
    d_popup?:UIBox;
}

type LuaNodeChildren = LuaNode[] & LuaNodeUi


/**
 * Node represent any game object that needs to have some transform available in the game itself.\
 * Everything that you see in the game is a Node, and some invisible things like the G.ROOM are also\
 * represented here.
 * 
 * **T** The transform ititializer, with keys of x|1, y|2, w|3, h|4, r|5\
 * **container** optional container for this Node, defaults to G.ROOM
*/
class LuaNode extends LuaObject {
    REMOVED?: boolean;
    ARGS: {
        invisible_area_types?: any;
        draw_layers?: any;
        text_parallax?: any;
        button_colours?: any;
        draw_shadow_norm?: any;
        prep_shader?: any;
        draw_from_offset?: any;
        get_major?: {
            major?: LuaNode;
            offset?: {x:number|0;y:number|0}|{x:undefined,y:undefined}
        };
        collides_with_point_translation?: {x:number;y:number}|{x:undefined;y:undefined};
        collides_with_point_rotation?: {cos:number;sin:number;}|{sin:undefined;cos:undefined};
        collides_with_point_point?: {x:number;y:number}|{x:undefined;y:undefined};
        drag_cursor_trans?: {x:number;y:number}|{x:undefined;y:undefined};
        drag_translation?: {x:number;y:number}|{x:undefined;y:undefined};
        set_offset_point?: {x:number;y:number}|{x:undefined;y:undefined};
        set_offset_translation?: {x:number;y:number}|{x:undefined;y:undefined};
    }
    RETS: {
        get_pos_pixel?: [number,number,number,number]|[]
    }
    config: any
    T: TransformValue
    CT: TransformValue
    click_offset: Position2D
    hover_offset: Position2D
    created_on_pause: boolean | undefined
    ID: number
    FRAME: {
        OLD_MAJOR?: any;
        MAJOR?: any; 
        DRAW: number; 
        MOVE: number;
    }
    states: { visible: boolean; collide: { can: boolean; is: boolean }; focus: { can: boolean; is: boolean }; hover: { can: boolean; is: boolean }; click: { can: boolean; is: boolean }; drag: { can: boolean; is: boolean }; release_on: { can: boolean; is: boolean } }
    container: LuaNode
    children?: LuaNodeChildren;
    under_overlay?: boolean;
    VT: TransformValue;
    DEBUG_VALUE: any;
    CALCING: any;
    parent: LuaNode;
    tilt_var: {mx:number,my:number};
    click_timeout: number;
    print_topology: any;
    content_dimensions: any;
    layered_parallax: any;
    constructor(args: { T: TransformInit|TransformValue; container?: LuaNode; }) {
        super()
        args = args ?? {}
        args.T = args.T ?? {}

        // Store all argument and return tables here for reuse, because Lua likes to generate garbage
        this.ARGS ??= {}
        this.RETS = {}
        
        // Config table used for any metadata about this node
        this.config = this.config ?? {}

        // For transform init, accept params in the form x|1, y|2, w|3, h|4, r|5
        this.T = {
            x : args.T.x ?? (args.T as TransformArray)[0] ?? 0,
            y : args.T.y ?? (args.T as TransformArray)[1] ?? 0,
            w : args.T.w ?? (args.T as TransformArray)[2] ?? 1,
            h : args.T.h ?? (args.T as TransformArray)[3] ?? 1,
            r : args.T.r ?? (args.T as TransformArray)[4] ?? 0,
            scale : args.T.scale ?? (args.T as TransformArray)[5] ?? 1,
        }
        // Transform to use for collision detection
        this.CT = this.T

        // Create the offset tables, used to determine things like drag offset and 3d shader effects
        this.click_offset = {x : 0, y : 0}
        this.hover_offset = {x : 0, y : 0}

        // To keep track of all nodes created on pause. If true, this node moves normally even when the G.TIMERS.TOTAL doesn't increment
        this.created_on_pause = G.SETTINGS.paused
        
        // ID tracker, every Node has a unique ID
        G.ID = G.ID ?? 1
        this.ID = G.ID
        G.ID = G.ID + 1

        // Frame tracker to aid in not doing too many extra calculations
        this.FRAME = {
            DRAW : -1,
            MOVE : -1
        }

        // The states for this Node and all derived nodes. This is how we control the visibility and interactibility of any object
        // All nodes do not collide by default. This reduces the size of n for the O( **2) collision detection
        this.states = {
            visible : true,
            collide : {can : false, is : false},
            focus : {can : false, is : false},
            hover : {can : true, is : false},
            click : {can : true, is : false},
            drag : {can : true, is : false},
            release_on : {can : true, is : false}
        }

        // If we provide a container, all nodes within that container are translated with that container as the reference frame.
        // For example, if G.ROOM is set at x = 5 and y = 5, and we create a new game object at 0, 0, it will actually be drawn at
        // 5, 5. This allows us to control things like screen shake, room positioning, rotation, padding, etc. without needing to modify
        // every game object that we need to draw
        this.container = args.container ?? G.ROOM

        // The list of children give Node a treelike structure. This can be used for things like drawing, deterministice movement and parallax
        // calculations when child nodes rely on updated information from parents, and inherited attributes like button click functions
        this.children ??= []

        // Add this object to the appropriate instance table only if the metatable matches with NODE
        if (this instanceof LuaNode) {
            G.I.NODE.push(this)
        }

        // Unless node was created during a stage transition (when G.STAGE_OBJECT_INTERRUPT is true), add all nodes to their appropriate
        // stage object table so they can be easily deleted on stage transition
        if (!G.STAGE_OBJECT_INTERRUPT) {
            G.STAGE_OBJECTS[G.STAGE].push(this)
        }
    }
    //Draw a bounding rectangle representing the transform of this node. Used in debugging.
    draw_boundingrect() {
        this.under_overlay = G.under_overlay

        if (G.DEBUG) {
            let transform = this.VT || this.T
            love.graphics.push()
            love.graphics.scale(G.TILESCALE, G.TILESCALE)
            love.graphics.translate(transform.x*G.TILESIZE+transform.w*G.TILESIZE*0.5,
                                    transform.y*G.TILESIZE+transform.h*G.TILESIZE*0.5)
            love.graphics.rotate(transform.r)
            love.graphics.translate(-transform.w*G.TILESIZE*0.5,
                                    -transform.h*G.TILESIZE*0.5)
            if (this.DEBUG_VALUE) {
                love.graphics.setColor(1, 1, 0, 1)
                love.graphics.print((this.DEBUG_VALUE || ''), transform.w*G.TILESIZE,transform.h*G.TILESIZE, undefined, 1/G.TILESCALE)
            }
            love.graphics.setLineWidth(1 + (this.states.focus.is ? 1:0))
            if (this.states.collide.is) { 
                love.graphics.setColor(0, 1, 0, 0.3)
            }
            else {
                love.graphics.setColor(1, 0, 0, 0.3) 
            }
            if (this.states.focus.can) { 
                love.graphics.setColor(...(G.C.GOLD as [number,number,number,number]))
                love.graphics.setLineWidth(1)
            }
            if (this.CALCING) { 
                love.graphics.setColor([0,0,1,1]) 
                love.graphics.setLineWidth(3)
            }
            love.graphics.rectangle('line', 0, 0, transform.w*G.TILESIZE,transform.h*G.TILESIZE, 3)
            love.graphics.pop() 
        }
    }
    //Draws this, then adds this the the draw hash, then draws all children
    draw(...args:any) {
        this.draw_boundingrect()
        if (this.states.visible) {
            add_to_drawhash(this)
            for (let [k,v] of pairs(this.children??[])) {
                v.draw()
            }
        }
    }
    /**
     * Determines if this node collides with some point. Applies any container translations and rotations, then\
     * applies translations and rotations specific to this node. This means the collision detection effectively\
     * determines if some point intersects this node regargless of rotation.
     * 
     * **x and y** The coordinates of the cursor transformed into game units
    */
    collides_with_point(point: Position2D) {
        if (this.container) {
            let T = this.CT || this.T;
            this.ARGS.collides_with_point_point = this.ARGS.collides_with_point_point || {x:undefined,y:undefined};
            this.ARGS.collides_with_point_translation = this.ARGS.collides_with_point_translation || {x:undefined,y:undefined};
            this.ARGS.collides_with_point_rotation = this.ARGS.collides_with_point_rotation || {sin:undefined,cos:undefined};
            let _p = this.ARGS.collides_with_point_point;
            let _t = this.ARGS.collides_with_point_translation;
            let _r = this.ARGS.collides_with_point_rotation;
            let _b = this.states.hover.is && G.COLLISION_BUFFER || 0;
            [_p.x, _p.y] = [point.x, point.y];
            if (this.container !== this) {
                if (math.abs(this.container.T.r) < 0.1) {
                    [_t.x, _t.y] = [-this.container.T.w / 2, -this.container.T.h / 2];
                    point_translate(_p, _t);
                    point_rotate(_p, this.container.T.r);
                    [_t.x, _t.y] = [this.container.T.w / 2 - this.container.T.x, this.container.T.h / 2 - this.container.T.y];
                    point_translate(_p, _t);
                }
                else {
                    [_t.x, _t.y] = [-this.container.T.x, -this.container.T.y];
                    point_translate(_p, _t);
                }
            }
            if (math.abs(T.r) < 0.1) {
                if (_p.x >= T.x - _b && _p.y >= T.y - _b && _p.x <= T.x + T.w + _b && _p.y <= T.y + T.h + _b) {
                    return true;
                }
            }
            else {
                [_r.cos, _r.sin] = [math.cos(T.r + math.pi / 2), math.sin(T.r + math.pi / 2)];
                [_p.x, _p.y] = [_p.x - (T.x + 0.5 * T.w), _p.y - (T.y + 0.5 * T.h)];
                [_t.x, _t.y] = [_p.y * _r.cos - _p.x * _r.sin, _p.y * _r.sin + _p.x * _r.cos];
                [_p.x, _p.y] = [_t.x + (T.x + 0.5 * T.w), _t.y + (T.y + 0.5 * T.h)];
                if (_p.x >= T.x - _b && _p.y >= T.y - _b && _p.x <= T.x + T.w + _b && _p.y <= T.y + T.h + _b) {
                    return true;
                }
            }
        }
    }
    set_offset(point: {x:number,y:number}, type: string) {
        this.ARGS.set_offset_point = this.ARGS.set_offset_point || {x:undefined,y:undefined};
        this.ARGS.set_offset_translation = this.ARGS.set_offset_translation || {x:undefined,y:undefined};
        let _p = this.ARGS.set_offset_point;
        let _t = this.ARGS.set_offset_translation;
        [_p.x, _p.y] = [point.x, point.y];
        _t.x = -this.container.T.w / 2;
        _t.y = -this.container.T.h / 2;
        point_translate(_p, _t);
        point_rotate(_p, this.container.T.r);
        _t.x = this.container.T.w / 2 - this.container.T.x;
        _t.y = this.container.T.h / 2 - this.container.T.y;
        point_translate(_p, _t);
        if (type === "Click") {
            this.click_offset.x = _p.x - this.T.x;
            this.click_offset.y = _p.y - this.T.y;
        }
        else if (type === "Click") {
            this.click_offset.x = _p.x - this.T.x;
            this.click_offset.y = _p.y - this.T.y;
        }
    };
    drag(offset?: {x:number,y:number}) {
        if (this.config && this.config.d_popup) {
            if (this.children) {
                if (!this.children.d_popup) {
                    this.children.d_popup = new UIBox({ definition: this.config.d_popup, config: this.config.d_popup_config });
                    if (this.children.h_popup) {
                        this.children.h_popup.states.collide.can = false;
                    }
                    table.insert(G.I.POPUP, this.children.d_popup);
                    this.children.d_popup.states.drag.can = true;
                }
            }
        }
    };
    can_drag() {
        return this.states.drag.can && this || undefined;
    };
    stop_drag() {
        if (!this.children) return;
        if (this.children.d_popup) {
            for (const [k, v] of pairs(G.I.POPUP)) {
                if (v === this.children.d_popup) {
                    table.remove(G.I.POPUP, Number(k));
                }
            }
            this.children.d_popup.remove();
            this.children.d_popup = undefined;
        }
    };
    hover() {
        if (!this.children) return;
        if (this.config && this.config.h_popup) {
            if (!this.children.h_popup) {
                this.config.h_popup_config.instance_type = "POPUP";
                this.children.h_popup = new UIBox({ definition: this.config.h_popup, config: this.config.h_popup_config });
                this.children.h_popup.states.collide.can = false;
                this.children.h_popup.states.drag.can = true;
            }
        }
    };
    stop_hover() {
        if (!this.children) return;
        if (this.children.h_popup) {
            this.children.h_popup.remove();
            this.children.h_popup = undefined;
        }
    };
    put_focused_cursor() {
        return [(this.T.x + this.T.w / 2 + this.container.T.x) * G.TILESCALE * G.TILESIZE, (this.T.y + this.T.h / 2 + this.container.T.y) * G.TILESCALE * G.TILESIZE];
    };
    set_container(container:LuaNode) {
        if (this.children) {
            for (const [_, v] of pairs(this.children)) {
                v.set_container(container);
            }
        }
        this.container = container;
    };
    translate_container() {
        if (this.container && this.container !== this) {
            love.graphics.translate(this.container.T.w * G.TILESCALE * G.TILESIZE * 0.5, this.container.T.h * G.TILESCALE * G.TILESIZE * 0.5);
            love.graphics.rotate(this.container.T.r);
            love.graphics.translate(-this.container.T.w * G.TILESCALE * G.TILESIZE * 0.5 + this.container.T.x * G.TILESCALE * G.TILESIZE, -this.container.T.h * G.TILESCALE * G.TILESIZE * 0.5 + this.container.T.y * G.TILESCALE * G.TILESIZE);
        }
    };
    remove() {
        for (const [k, v] of pairs(G.I.POPUP)) {
            if (v as LuaNode === this) {
                table.remove(G.I.POPUP, Number(k));
                break;
            }
        }
        for (const [k, v] of pairs(G.I.NODE)) {
            if (v === this) {
                table.remove(G.I.NODE, Number(k));
                break;
            }
        }
        for (const [k, v] of pairs(G.STAGE_OBJECTS[G.STAGE])) {
            if (v === this) {
                table.remove(G.STAGE_OBJECTS[G.STAGE], Number(k));
                break;
            }
        }
        if (this.children) {
            for (const [k, v] of pairs(this.children)) {
                v.remove();
            }
        }
        if (G.CONTROLLER.clicked.target === this) {
            G.CONTROLLER.clicked.target = undefined;
        }
        if (G.CONTROLLER.focused.target === this) {
            G.CONTROLLER.focused.target = undefined;
        }
        if (G.CONTROLLER.dragging.target === this) {
            G.CONTROLLER.dragging.target = undefined;
        }
        if (G.CONTROLLER.hovering.target === this) {
            G.CONTROLLER.hovering.target = undefined;
        }
        if (G.CONTROLLER.released_on.target === this) {
            G.CONTROLLER.released_on.target = undefined;
        }
        if (G.CONTROLLER.cursor_down.target === this) {
            G.CONTROLLER.cursor_down.target = undefined;
        }
        if (G.CONTROLLER.cursor_up.target === this) {
            G.CONTROLLER.cursor_up.target = undefined;
        }
        if (G.CONTROLLER.cursor_hover.target === this) {
            G.CONTROLLER.cursor_hover.target = undefined;
        }
        this.REMOVED = true;
    };
    fast_mid_dist(other_node:LuaNode) {
        return (math.sqrt(other_node.T.x + 0.5 * other_node.T.w - (this.T.x + this.T.w)) ** 2) + (other_node.T.y + 0.5 * other_node.T.h - (this.T.y + this.T.h) ** 2);
    };
    release(dragged?:LuaNode) {
    };
    click() {
    };
    animate() {
    };
    update(dt:number) {
    };
}