local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local __TS__Unpack = ____lualib.__TS__Unpack
local __TS__New = ____lualib.__TS__New
local __TS__Number = ____lualib.__TS__Number
--- Node represent any game object that needs to have some transform available in the game itself.\
-- Everything that you see in the game is a Node, and some invisible things like the G.ROOM are also\
-- represented here.
-- 
-- **T** The transform ititializer, with keys of x|1, y|2, w|3, h|4, r|5\
-- **container** optional container for this Node, defaults to G.ROOM
LuaNode = __TS__Class()
LuaNode.name = "LuaNode"
__TS__ClassExtends(LuaNode, LuaObject)
function LuaNode.prototype.____constructor(self, args)
    LuaObject.prototype.____constructor(self)
    args = args or ({})
    args.T = args.T or ({})
    if self.ARGS == nil then
        self.ARGS = {}
    end
    self.RETS = {}
    local ____self_config_0 = self.config
    if ____self_config_0 == nil then
        ____self_config_0 = {}
    end
    self.config = ____self_config_0
    self.T = {
        x = args.T.x or args.T[1] or 0,
        y = args.T.y or args.T[2] or 0,
        w = args.T.w or args.T[3] or 1,
        h = args.T.h or args.T[4] or 1,
        r = args.T.r or args.T[5] or 0,
        scale = args.T.scale or args.T[6] or 1
    }
    self.CT = self.T
    self.click_offset = {x = 0, y = 0}
    self.hover_offset = {x = 0, y = 0}
    self.created_on_pause = G.SETTINGS.paused
    local ____G_2 = G
    local ____G_ID_1 = G.ID
    if ____G_ID_1 == nil then
        ____G_ID_1 = 1
    end
    ____G_2.ID = ____G_ID_1
    self.ID = G.ID
    G.ID = G.ID + 1
    self.FRAME = {DRAW = -1, MOVE = -1}
    self.states = {
        visible = true,
        collide = {can = false, is = false},
        focus = {can = false, is = false},
        hover = {can = true, is = false},
        click = {can = true, is = false},
        drag = {can = true, is = false},
        release_on = {can = true, is = false}
    }
    self.container = args.container or G.ROOM
    if self.children == nil then
        self.children = {}
    end
    if __TS__InstanceOf(self, LuaNode) then
        local ____G_I_NODE_3 = G.I.NODE
        ____G_I_NODE_3[#____G_I_NODE_3 + 1] = self
    end
    if not G.STAGE_OBJECT_INTERRUPT then
        local ____G_STAGE_OBJECTS_index_4 = G.STAGE_OBJECTS[G.STAGE + 1]
        ____G_STAGE_OBJECTS_index_4[#____G_STAGE_OBJECTS_index_4 + 1] = self
    end
end
function LuaNode.prototype.draw_boundingrect(self)
    self.under_overlay = G.under_overlay
    if G.DEBUG then
        local transform = self.VT or self.T
        love.graphics.push()
        love.graphics.scale(G.TILESCALE, G.TILESCALE)
        love.graphics.translate(transform.x * G.TILESIZE + transform.w * G.TILESIZE * 0.5, transform.y * G.TILESIZE + transform.h * G.TILESIZE * 0.5)
        love.graphics.rotate(transform.r)
        love.graphics.translate(-transform.w * G.TILESIZE * 0.5, -transform.h * G.TILESIZE * 0.5)
        if self.DEBUG_VALUE then
            love.graphics.setColor(1, 1, 0, 1)
            love.graphics.print(
                self.DEBUG_VALUE or "",
                transform.w * G.TILESIZE,
                transform.h * G.TILESIZE,
                nil,
                1 / G.TILESCALE
            )
        end
        love.graphics.setLineWidth(1 + (self.states.focus.is and 1 or 0))
        if self.states.collide.is then
            love.graphics.setColor(0, 1, 0, 0.3)
        else
            love.graphics.setColor(1, 0, 0, 0.3)
        end
        if self.states.focus.can then
            love.graphics.setColor(__TS__Unpack(G.C.GOLD))
            love.graphics.setLineWidth(1)
        end
        if self.CALCING then
            love.graphics.setColor({0, 0, 1, 1})
            love.graphics.setLineWidth(3)
        end
        love.graphics.rectangle(
            "line",
            0,
            0,
            transform.w * G.TILESIZE,
            transform.h * G.TILESIZE,
            3
        )
        love.graphics.pop()
    end
end
function LuaNode.prototype.draw(self, ...)
    self:draw_boundingrect()
    if self.states.visible then
        add_to_drawhash(_G, self)
        for k, v in pairs(self.children or ({})) do
            v:draw()
        end
    end
end
function LuaNode.prototype.collides_with_point(self, point)
    if self.container then
        local T = self.CT or self.T
        self.ARGS.collides_with_point_point = self.ARGS.collides_with_point_point or ({x = nil, y = nil})
        self.ARGS.collides_with_point_translation = self.ARGS.collides_with_point_translation or ({x = nil, y = nil})
        self.ARGS.collides_with_point_rotation = self.ARGS.collides_with_point_rotation or ({sin = nil, cos = nil})
        local _p = self.ARGS.collides_with_point_point
        local _t = self.ARGS.collides_with_point_translation
        local _r = self.ARGS.collides_with_point_rotation
        local _b = self.states.hover.is and G.COLLISION_BUFFER or 0
        local ____temp_5 = {point.x, point.y}
        _p.x = ____temp_5[1]
        _p.y = ____temp_5[2]
        if self.container ~= self then
            if math.abs(self.container.T.r) < 0.1 then
                local ____temp_6 = {-self.container.T.w / 2, -self.container.T.h / 2}
                _t.x = ____temp_6[1]
                _t.y = ____temp_6[2]
                point_translate(_G, _p, _t)
                point_rotate(_G, _p, self.container.T.r)
                local ____temp_7 = {self.container.T.w / 2 - self.container.T.x, self.container.T.h / 2 - self.container.T.y}
                _t.x = ____temp_7[1]
                _t.y = ____temp_7[2]
                point_translate(_G, _p, _t)
            else
                local ____temp_8 = {-self.container.T.x, -self.container.T.y}
                _t.x = ____temp_8[1]
                _t.y = ____temp_8[2]
                point_translate(_G, _p, _t)
            end
        end
        if math.abs(T.r) < 0.1 then
            if _p.x >= T.x - _b and _p.y >= T.y - _b and _p.x <= T.x + T.w + _b and _p.y <= T.y + T.h + _b then
                return true
            end
        else
            local ____temp_9 = {
                math.cos(T.r + math.pi / 2),
                math.sin(T.r + math.pi / 2)
            }
            _r.cos = ____temp_9[1]
            _r.sin = ____temp_9[2]
            local ____temp_10 = {_p.x - (T.x + 0.5 * T.w), _p.y - (T.y + 0.5 * T.h)}
            _p.x = ____temp_10[1]
            _p.y = ____temp_10[2]
            local ____temp_11 = {_p.y * _r.cos - _p.x * _r.sin, _p.y * _r.sin + _p.x * _r.cos}
            _t.x = ____temp_11[1]
            _t.y = ____temp_11[2]
            local ____temp_12 = {_t.x + (T.x + 0.5 * T.w), _t.y + (T.y + 0.5 * T.h)}
            _p.x = ____temp_12[1]
            _p.y = ____temp_12[2]
            if _p.x >= T.x - _b and _p.y >= T.y - _b and _p.x <= T.x + T.w + _b and _p.y <= T.y + T.h + _b then
                return true
            end
        end
    end
end
function LuaNode.prototype.set_offset(self, point, ____type)
    self.ARGS.set_offset_point = self.ARGS.set_offset_point or ({x = nil, y = nil})
    self.ARGS.set_offset_translation = self.ARGS.set_offset_translation or ({x = nil, y = nil})
    local _p = self.ARGS.set_offset_point
    local _t = self.ARGS.set_offset_translation
    local ____temp_13 = {point.x, point.y}
    _p.x = ____temp_13[1]
    _p.y = ____temp_13[2]
    _t.x = -self.container.T.w / 2
    _t.y = -self.container.T.h / 2
    point_translate(_G, _p, _t)
    point_rotate(_G, _p, self.container.T.r)
    _t.x = self.container.T.w / 2 - self.container.T.x
    _t.y = self.container.T.h / 2 - self.container.T.y
    point_translate(_G, _p, _t)
    if ____type == "Click" then
        self.click_offset.x = _p.x - self.T.x
        self.click_offset.y = _p.y - self.T.y
    elseif ____type == "Click" then
        self.click_offset.x = _p.x - self.T.x
        self.click_offset.y = _p.y - self.T.y
    end
end
function LuaNode.prototype.drag(self, offset)
    if self.config and self.config.d_popup then
        if self.children then
            if not self.children.d_popup then
                self.children.d_popup = __TS__New(UIBox, {definition = self.config.d_popup, config = self.config.d_popup_config})
                if self.children.h_popup then
                    self.children.h_popup.states.collide.can = false
                end
                table.insert(G.I.POPUP, self.children.d_popup)
                self.children.d_popup.states.drag.can = true
            end
        end
    end
end
function LuaNode.prototype.can_drag(self)
    return self.states.drag.can and self or nil
end
function LuaNode.prototype.stop_drag(self)
    if not self.children then
        return
    end
    if self.children.d_popup then
        for k, v in pairs(G.I.POPUP) do
            if v == self.children.d_popup then
                table.remove(
                    G.I.POPUP,
                    __TS__Number(k)
                )
            end
        end
        self.children.d_popup:remove()
        self.children.d_popup = nil
    end
end
function LuaNode.prototype.hover(self)
    if not self.children then
        return
    end
    if self.config and self.config.h_popup then
        if not self.children.h_popup then
            self.config.h_popup_config.instance_type = "POPUP"
            self.children.h_popup = __TS__New(UIBox, {definition = self.config.h_popup, config = self.config.h_popup_config})
            self.children.h_popup.states.collide.can = false
            self.children.h_popup.states.drag.can = true
        end
    end
end
function LuaNode.prototype.stop_hover(self)
    if not self.children then
        return
    end
    if self.children.h_popup then
        self.children.h_popup:remove()
        self.children.h_popup = nil
    end
end
function LuaNode.prototype.put_focused_cursor(self)
    return {(self.T.x + self.T.w / 2 + self.container.T.x) * G.TILESCALE * G.TILESIZE, (self.T.y + self.T.h / 2 + self.container.T.y) * G.TILESCALE * G.TILESIZE}
end
function LuaNode.prototype.set_container(self, container)
    if self.children then
        for _, v in pairs(self.children) do
            v:set_container(container)
        end
    end
    self.container = container
end
function LuaNode.prototype.translate_container(self)
    if self.container and self.container ~= self then
        love.graphics.translate(self.container.T.w * G.TILESCALE * G.TILESIZE * 0.5, self.container.T.h * G.TILESCALE * G.TILESIZE * 0.5)
        love.graphics.rotate(self.container.T.r)
        love.graphics.translate(-self.container.T.w * G.TILESCALE * G.TILESIZE * 0.5 + self.container.T.x * G.TILESCALE * G.TILESIZE, -self.container.T.h * G.TILESCALE * G.TILESIZE * 0.5 + self.container.T.y * G.TILESCALE * G.TILESIZE)
    end
end
function LuaNode.prototype.remove(self)
    for k, v in pairs(G.I.POPUP) do
        if v == self then
            table.remove(
                G.I.POPUP,
                __TS__Number(k)
            )
            break
        end
    end
    for k, v in pairs(G.I.NODE) do
        if v == self then
            table.remove(
                G.I.NODE,
                __TS__Number(k)
            )
            break
        end
    end
    for k, v in pairs(G.STAGE_OBJECTS[G.STAGE + 1]) do
        if v == self then
            table.remove(
                G.STAGE_OBJECTS[G.STAGE + 1],
                __TS__Number(k)
            )
            break
        end
    end
    if self.children then
        for k, v in pairs(self.children) do
            v:remove()
        end
    end
    if G.CONTROLLER.clicked.target == self then
        G.CONTROLLER.clicked.target = nil
    end
    if G.CONTROLLER.focused.target == self then
        G.CONTROLLER.focused.target = nil
    end
    if G.CONTROLLER.dragging.target == self then
        G.CONTROLLER.dragging.target = nil
    end
    if G.CONTROLLER.hovering.target == self then
        G.CONTROLLER.hovering.target = nil
    end
    if G.CONTROLLER.released_on.target == self then
        G.CONTROLLER.released_on.target = nil
    end
    if G.CONTROLLER.cursor_down.target == self then
        G.CONTROLLER.cursor_down.target = nil
    end
    if G.CONTROLLER.cursor_up.target == self then
        G.CONTROLLER.cursor_up.target = nil
    end
    if G.CONTROLLER.cursor_hover.target == self then
        G.CONTROLLER.cursor_hover.target = nil
    end
    self.REMOVED = true
end
function LuaNode.prototype.fast_mid_dist(self, other_node)
    return math.sqrt(other_node.T.x + 0.5 * other_node.T.w - (self.T.x + self.T.w)) ^ 2 + (other_node.T.y + 0.5 * other_node.T.h - (self.T.y + self.T.h) ^ 2)
end
function LuaNode.prototype.release(self, dragged)
end
function LuaNode.prototype.click(self)
end
function LuaNode.prototype.animate(self)
end
function LuaNode.prototype.update(self, dt)
end
