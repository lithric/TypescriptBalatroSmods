/**
 * Node represent any game object that needs to have some transform available in the game itthis.\
 * Everything that you see in the game is a Node, and some invisible things like the G.ROOM are also\
 * represented here.
 * 
 * **T** The transform ititializer, with keys of x|1, y|2, w|3, h|4, r|5\
 * **container** optional container for this Node, defaults to G.ROOM
*/
class LuaNode extends LuaObject {
    ARGS: any
    RETS: {}
    config: any
    T: { x: any; y: any; w: any; h: any; r: any; scale: any }
    CT: any
    click_offset: { x: number; y: number }
    hover_offset: { x: number; y: number }
    created_on_pause: boolean | undefined
    ID: any
    FRAME: { DRAW: number; MOVE: number }
    states: { visible: boolean; collide: { can: boolean; is: boolean }; focus: { can: boolean; is: boolean }; hover: { can: boolean; is: boolean }; click: { can: boolean; is: boolean }; drag: { can: boolean; is: boolean }; release_on: { can: boolean; is: boolean } }
    container: any
    children: LuaNode[]
    under_overlay: boolean
    VT: any
    DEBUG_VALUE: any
    CALCING: any
    constructor(args) {
        super()
        args = args ?? {}
        args.T = args.T ?? {}

        // Store all argument and return tables here for reuse, because Lua likes to generate garbage
        this.ARGS = this.ARGS ?? {}
        this.RETS = {}
        
        // Config table used for any metadata about this node
        this.config = this.config ?? {}

        // For transform init, accept params in the form x|1, y|2, w|3, h|4, r|5
        this.T = {
            x : args.T.x ?? args.T[1] ?? 0,
            y : args.T.y ?? args.T[2] ?? 0,
            w : args.T.w ?? args.T[3] ?? 1,
            h : args.T.h ?? args.T[4] ?? 1,
            r : args.T.r ?? args.T[5] ?? 0,
            scale : args.T.scale ?? args.T[6] ?? 1,
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
        // All nodes do not collide by default. This reduces the size of n for the O(n^2) collision detection
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
        if (this.children == null) {
            this.children = []
        }

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
                love.graphics.setColor(...G.C.GOLD) 
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
    //Draws self, then adds self the the draw hash, then draws all children
    draw() {
        this.draw_boundingrect()
        if (this.states.visible) {
            add_to_drawhash(this)
            for (let [k,v] of this.children.entries()) {
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
    collides_with_point(point) {
        if (this.container) {
            let T = this.CT || this.T;
            this.ARGS.collides_with_point_point = this.ARGS.collides_with_point_point || {};
            this.ARGS.collides_with_point_translation = this.ARGS.collides_with_point_translation || {};
            this.ARGS.collides_with_point_rotation = this.ARGS.collides_with_point_rotation || {};
            let _p = this.ARGS.collides_with_point_point;
            let _t = this.ARGS.collides_with_point_translation;
            let _r = this.ARGS.collides_with_point_rotation;
            let _b = this.states.hover.is && G.COLLISION_BUFFER || 0;
            [_p.x, _p.y] = [point.x, point.y];
            if (this.container !== self) {
                if (Math.abs(this.container.T.r) < 0.1) {
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
            if (Math.abs(T.r) < 0.1) {
                if (_p.x >= T.x - _b && _p.y >= T.y - _b && _p.x <= T.x + T.w + _b && _p.y <= T.y + T.h + _b) {
                    return true;
                }
            }
            else {
                [_r.cos, _r.sin] = [Math.cos(T.r + Math.PI / 2), Math.sin(T.r + Math.PI / 2)];
                [_p.x, _p.y] = [_p.x - (T.x + 0.5 * T.w), _p.y - (T.y + 0.5 * T.h)];
                [_t.x, _t.y] = [_p.y * _r.cos - _p.x * _r.sin, _p.y * _r.sin + _p.x * _r.cos];
                [_p.x, _p.y] = [_t.x + (T.x + 0.5 * T.w), _t.y + (T.y + 0.5 * T.h)];
                if (_p.x >= T.x - _b && _p.y >= T.y - _b && _p.x <= T.x + T.w + _b && _p.y <= T.y + T.h + _b) {
                    return true;
                }
            }
        }
    }
}