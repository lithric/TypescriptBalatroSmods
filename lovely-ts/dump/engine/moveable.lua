local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__Number = ____lualib.__TS__Number
Moveable = __TS__Class()
Moveable.name = "Moveable"
__TS__ClassExtends(Moveable, LuaNode)
function Moveable.prototype.____constructor(self, X, Y, W, H)
    local args = type(X) == "table" and X or ({T = {X or 0, Y or 0, W or 0, H or 0}})
    LuaNode.prototype.____constructor(self, args)
    self.VT = {
        x = self.T.x,
        y = self.T.y,
        w = self.T.w,
        h = self.T.h,
        r = self.T.r,
        scale = self.T.scale
    }
    self.velocity = {
        x = 0,
        y = 0,
        r = 0,
        scale = 0,
        mag = 0
    }
    self.role = {
        role_type = "Major",
        offset = {x = 0, y = 0},
        major = nil,
        draw_major = self,
        xy_bond = "Strong",
        wh_bond = "Strong",
        r_bond = "Strong",
        scale_bond = "Strong"
    }
    self.alignment = {type = "a", offset = {x = 0, y = 0}, prev_type = "", prev_offset = {x = 0, y = 0}}
    self.pinch = {x = false, y = false}
    self.last_moved = -1
    self.last_aligned = -1
    self.static_rotation = false
    self.offset = {x = 0, y = 0}
    self.Mid = self
    self.shadow_parrallax = {x = 0, y = -1.5}
    self.layered_parallax = {x = 0, y = 0}
    self.shadow_height = 0.2
    self:calculate_parrallax()
    Array.prototype.push(G.MOVEABLES, self)
    if __TS__InstanceOf(self, Moveable) then
        Array.prototype.push(G.I.MOVEABLE, self)
    end
end
function Moveable.hard_set_T(self, arg0, x, y, w, h)
    error(
        __TS__New(Error, "Method not implemented."),
        0
    )
end
function Moveable.remove(self, arg0)
    error(
        __TS__New(Error, "Method not implemented."),
        0
    )
end
function Moveable.set_alignment(self, focused_ui, arg1)
    error(
        __TS__New(Error, "Method not implemented."),
        0
    )
end
function Moveable.prototype.draw(self, overlay)
    LuaNode.prototype.draw(self)
    self:draw_boundingrect()
end
function Moveable.prototype.set_alignment(self, args)
    args = args or ({})
    if args.major then
        self:set_role({
            role_type = "Minor",
            major = args.major,
            xy_bond = args.bond or args.xy_bond or "Weak",
            wh_bond = args.wh_bond or self.role.wh_bond,
            r_bond = args.r_bond or self.role.r_bond,
            scale_bond = args.scale_bond or self.role.scale_bond
        })
    end
    self.alignment.type = args.type or self.alignment.type
    if args.offset and (type(args.offset) == "table" and not (args.offset.y and args.offset.x)) or type(args.offset) ~= "table" then
        args.offset = nil
    end
    self.alignment.offset = args.offset or self.alignment.offset
    self.alignment.lr_clamp = args.lr_clamp
end
function Moveable.prototype.align_to_major(self)
    if self.alignment.type ~= self.alignment.prev_type then
        self.alignment.type_list = {
            a = self.alignment.type == "a",
            m = {string.find(self.alignment.type, "m")},
            c = {string.find(self.alignment.type, "c")},
            b = {string.find(self.alignment.type, "b")},
            t = {string.find(self.alignment.type, "t")},
            l = {string.find(self.alignment.type, "l")},
            r = {string.find(self.alignment.type, "r")},
            i = {string.find(self.alignment.type, "i")}
        }
    end
    if not self.alignment.type_list then
        return
    end
    self.NEW_ALIGNMENT = true
    if self.alignment.type ~= self.alignment.prev_type then
        self.alignment.prev_type = self.alignment.type
    end
    if self.alignment.type_list.a or not self.role.major then
        return
    end
    if self.alignment.type_list.m then
        self.role.offset.x = 0.5 * self.role.major.T.w - self.Mid.T.w / 2 + self.alignment.offset.x - self.Mid.T.x + self.T.x
    end
    if self.alignment.type_list.c then
        self.role.offset.y = 0.5 * self.role.major.T.h - self.Mid.T.h / 2 + self.alignment.offset.y - self.Mid.T.y + self.T.y
    end
    if self.alignment.type_list.b then
        if self.alignment.type_list.i then
            self.role.offset.y = self.alignment.offset.y + self.role.major.T.h - self.T.h
        else
            self.role.offset.y = self.alignment.offset.y + self.role.major.T.h
        end
    end
    if self.alignment.type_list.r then
        if self.alignment.type_list.i then
            self.role.offset.x = self.alignment.offset.x + self.role.major.T.w - self.T.w
        else
            self.role.offset.x = self.alignment.offset.x + self.role.major.T.w
        end
    end
    if self.alignment.type_list.t then
        if self.alignment.type_list.i then
            self.role.offset.y = self.alignment.offset.y
        else
            self.role.offset.y = self.alignment.offset.y - self.T.h
        end
    end
    if self.alignment.type_list.l then
        if self.alignment.type_list.i then
            self.role.offset.x = self.alignment.offset.x
        else
            self.role.offset.x = self.alignment.offset.x - self.T.w
        end
    end
    self.role.offset.x = self.role.offset.x or 0
    self.role.offset.y = self.role.offset.y or 0
    self.T.x = self.role.major.T.x + self.role.offset.x
    self.T.y = self.role.major.T.y + self.role.offset.y
    self.alignment.prev_offset = self.alignment.prev_offset or ({})
    local ____temp_0 = {self.alignment.offset.x, self.alignment.offset.y}
    self.alignment.prev_offset.x = ____temp_0[1]
    self.alignment.prev_offset.y = ____temp_0[2]
end
function Moveable.prototype.hard_set_T(self, X, Y, W, H)
    self.T.x = X
    self.T.y = Y
    self.T.w = W
    self.T.h = H
    self.velocity.x = 0
    self.velocity.y = 0
    self.velocity.r = 0
    self.velocity.scale = 0
    self.VT.x = X
    self.VT.y = Y
    self.VT.w = W
    self.VT.h = H
    self.VT.r = self.T.r
    self.VT.scale = self.T.scale
    self:calculate_parrallax()
end
function Moveable.prototype.hard_set_VT(self)
    self.VT.x = self.T.x
    self.VT.y = self.T.y
    self.VT.w = self.T.w
    self.VT.h = self.T.h
end
function Moveable.prototype.drag(self, offset)
    if self.states.drag.can or offset then
        self.ARGS.drag_cursor_trans = self.ARGS.drag_cursor_trans or ({x = nil, y = nil})
        self.ARGS.drag_translation = self.ARGS.drag_translation or ({x = nil, y = nil})
        local _p = self.ARGS.drag_cursor_trans
        local _t = self.ARGS.drag_translation
        _p.x = G.CONTROLLER.cursor_position.x / (G.TILESCALE * G.TILESIZE)
        _p.y = G.CONTROLLER.cursor_position.y / (G.TILESCALE * G.TILESIZE)
        local ____temp_1 = {-self.container.T.w / 2, -self.container.T.h / 2}
        _t.x = ____temp_1[1]
        _t.y = ____temp_1[2]
        point_translate(_G, _p, _t)
        point_rotate(_G, _p, self.container.T.r)
        local ____temp_2 = {self.container.T.w / 2 - self.container.T.x, self.container.T.h / 2 - self.container.T.y}
        _t.x = ____temp_2[1]
        _t.y = ____temp_2[2]
        point_translate(_G, _p, _t)
        if not offset then
            offset = self.click_offset
        end
        self.T.x = _p.x - offset.x
        self.T.y = _p.y - offset.y
        self.NEW_ALIGNMENT = true
        for k, v in pairs(self.children) do
            v:drag(offset)
        end
    end
    if self.states.drag.can then
        LuaNode.prototype.drag(self)
    end
end
function Moveable.prototype.juice_up(self, amount, rot_amt)
    if G.SETTINGS.reduced_motion then
        return
    end
    amount = amount or 0.4
    local end_time = G.TIMERS.REAL + 0.4
    local start_time = G.TIMERS.REAL
    self.juice = {
        scale = 0,
        scale_amt = amount,
        r = 0,
        r_amt = rot_amt or pseudorandom_element(_G, {0.6 * amount, -0.6 * amount}) or 0,
        start_time = start_time,
        end_time = end_time
    }
    self.VT.scale = 1 - 0.6 * amount
end
function Moveable.prototype.move_juice(self, dt)
    if self.juice and not self.juice.handled_elsewhere then
        if self.juice.end_time < G.TIMERS.REAL then
            self.juice = nil
        else
            self.juice.scale = self.juice.scale_amt * math.sin(50.8 * (G.TIMERS.REAL - self.juice.start_time)) * math.max(
                0,
                bit.bxor((self.juice.end_time - G.TIMERS.REAL) / (self.juice.end_time - self.juice.start_time), 3)
            )
            self.juice.r = self.juice.r_amt * math.sin(40.8 * (G.TIMERS.REAL - self.juice.start_time)) * math.max(
                0,
                bit.bxor((self.juice.end_time - G.TIMERS.REAL) / (self.juice.end_time - self.juice.start_time), 2)
            )
        end
    end
end
function Moveable.prototype.move(self, dt)
    if self.FRAME.MOVE >= G.FRAMES.MOVE then
        return
    end
    self.FRAME.OLD_MAJOR = self.FRAME.MAJOR
    self.FRAME.MAJOR = nil
    self.FRAME.MOVE = G.FRAMES.MOVE
    if not self.created_on_pause and G.SETTINGS.paused then
        return
    end
    self:align_to_major()
    self.CALCING = nil
    if self.role.role_type == "Glued" then
        if self.role.major then
            self:glue_to_major(self.role.major)
        end
    elseif self.role.role_type == "Minor" and self.role.major then
        if self.role.major.FRAME.MOVE < G.FRAMES.MOVE then
            self.role.major:move(dt)
        end
        self.STATIONARY = self.role.major.STATIONARY
        if not self.STATIONARY or self.NEW_ALIGNMENT or self.config.refresh_movement or self.juice or self.role.xy_bond == "Weak" or self.role.r_bond == "Weak" then
            self.CALCING = true
            self:move_with_major(dt)
        end
    elseif self.role.role_type == "Major" then
        self.STATIONARY = true
        self:move_juice(dt)
        self:move_xy(dt)
        self:move_r(dt, self.velocity)
        self:move_scale(dt)
        self:move_wh(dt)
        self:calculate_parrallax()
    end
    if self.alignment and self.alignment.lr_clamp then
        self:lr_clamp()
    end
    self.NEW_ALIGNMENT = false
end
function Moveable.prototype.lr_clamp(self)
    if self.T.x < 0 then
        self.T.x = 0
    end
    if self.VT.x < 0 then
        self.VT.x = 0
    end
    if self.T.x + self.T.w > G.ROOM.T.w then
        self.T.x = G.ROOM.T.w - self.T.w
    end
    if self.VT.x + self.VT.w > G.ROOM.T.w then
        self.VT.x = G.ROOM.T.w - self.VT.w
    end
end
function Moveable.prototype.glue_to_major(self, major_tab)
    self.T = major_tab.T
    self.VT.x = major_tab.VT.x + 0.5 * (1 - major_tab.VT.w / major_tab.T.w) * self.T.w
    self.VT.y = major_tab.VT.y
    self.VT.w = major_tab.VT.w
    self.VT.h = major_tab.VT.h
    self.VT.r = major_tab.VT.r
    self.VT.scale = major_tab.VT.scale
    self.pinch = major_tab.pinch
    self.shadow_parrallax = major_tab.shadow_parrallax
end
function Moveable.prototype.move_with_major(self, dt)
    if self.role.role_type ~= "Minor" then
        return
    end
    local ____opt_3 = self.role.major
    local major_tab = ____opt_3 and ____opt_3:get_major()
    self:move_juice(dt)
    if self.role.r_bond == "Weak" then
        local ____temp_5 = {self.role.offset.x + major_tab.offset.x, self.role.offset.y + major_tab.offset.y}
        MWM.rotated_offset.x = ____temp_5[1]
        MWM.rotated_offset.y = ____temp_5[2]
    else
        if major_tab.major.VT.r < 0.0001 and major_tab.major.VT.r > -0.0001 then
            MWM.rotated_offset.x = self.role.offset.x + major_tab.offset.x
            MWM.rotated_offset.y = self.role.offset.y + major_tab.offset.y
        else
            local ____temp_6 = {
                math.cos(major_tab.major.VT.r),
                math.sin(major_tab.major.VT.r)
            }
            MWM.angles.cos = ____temp_6[1]
            MWM.angles.sin = ____temp_6[2]
            local ____temp_7 = {-self.T.w / 2 + major_tab.major.T.w / 2, -self.T.h / 2 + major_tab.major.T.h / 2}
            MWM.WH.w = ____temp_7[1]
            MWM.WH.h = ____temp_7[2]
            local ____temp_8 = {self.role.offset.x + major_tab.offset.x - MWM.WH.w, self.role.offset.y + major_tab.offset.y - MWM.WH.h}
            MWM.offs.x = ____temp_8[1]
            MWM.offs.y = ____temp_8[2]
            MWM.rotated_offset.x = MWM.offs.x * MWM.angles.cos - MWM.offs.y * MWM.angles.sin + MWM.WH.w
            MWM.rotated_offset.y = MWM.offs.x * MWM.angles.sin + MWM.offs.y * MWM.angles.cos + MWM.WH.h
        end
    end
    self.T.x = major_tab.major.T.x + MWM.rotated_offset.x
    self.T.y = major_tab.major.T.y + MWM.rotated_offset.y
    if self.role.xy_bond == "Strong" then
        self.VT.x = major_tab.major.VT.x + MWM.rotated_offset.x
        self.VT.y = major_tab.major.VT.y + MWM.rotated_offset.y
    elseif self.role.xy_bond == "Weak" then
        self:move_xy(dt)
    end
    if self.role.r_bond == "Strong" then
        self.VT.r = self.T.r + major_tab.major.VT.r + (self.juice and self.juice.r or 0)
    elseif self.role.r_bond == "Weak" then
        self:move_r(dt, self.velocity)
    end
    if self.role.scale_bond == "Strong" then
        self.VT.scale = self.T.scale * (major_tab.major.VT.scale / major_tab.major.T.scale) + (self.juice and self.juice.scale or 0)
    elseif self.role.scale_bond == "Weak" then
        self:move_scale(dt)
    end
    if self.role.wh_bond == "Strong" then
        self.VT.x = self.VT.x + 0.5 * (1 - major_tab.major.VT.w / major_tab.major.T.w) * self.T.w
        self.VT.w = self.T.w * (major_tab.major.VT.w / major_tab.major.T.w)
        self.VT.h = self.T.h * (major_tab.major.VT.h / major_tab.major.T.h)
    elseif self.role.wh_bond == "Weak" then
        self:move_wh(dt)
    end
    self:calculate_parrallax()
end
function Moveable.prototype.move_xy(self, dt)
    if self.T.x ~= self.VT.x or math.abs(self.velocity.x) > 0.01 or (self.T.y ~= self.VT.y or math.abs(self.velocity.y) > 0.01) then
        self.velocity.x = G.exp_times.xy * self.velocity.x + (1 - G.exp_times.xy) * (self.T.x - self.VT.x) * 35 * dt
        self.velocity.y = G.exp_times.xy * self.velocity.y + (1 - G.exp_times.xy) * (self.T.y - self.VT.y) * 35 * dt
        if self.velocity.x * self.velocity.x + self.velocity.y * self.velocity.y > (G.exp_times.max_vel or 0) * (G.exp_times.max_vel or 0) then
            local actual_vel = math.sqrt(self.velocity.x * self.velocity.x + self.velocity.y * self.velocity.y)
            self.velocity.x = (G.exp_times.max_vel or 0) * self.velocity.x / actual_vel
            self.velocity.y = (G.exp_times.max_vel or 0) * self.velocity.y / actual_vel
        end
        self.STATIONARY = false
        self.VT.x = self.VT.x + self.velocity.x
        self.VT.y = self.VT.y + self.velocity.y
        if math.abs(self.VT.x - self.T.x) < 0.01 and math.abs(self.velocity.x) < 0.01 then
            self.VT.x = self.T.x
            self.velocity.x = 0
        end
        if math.abs(self.VT.y - self.T.y) < 0.01 and math.abs(self.velocity.y) < 0.01 then
            self.VT.y = self.T.y
            self.velocity.y = 0
        end
    end
end
function Moveable.prototype.move_scale(self, dt)
    local des_scale = self.T.scale + (self.zoom and (self.states.drag.is and 0.1 or 0) + (self.states.hover.is and 0.05 or 0) or 0) + (self.juice and self.juice.scale or 0)
    if des_scale ~= self.VT.scale or math.abs(self.velocity.scale) > 0.001 then
        self.STATIONARY = false
        self.velocity.scale = G.exp_times.scale * self.velocity.scale + (1 - G.exp_times.scale) * (des_scale - self.VT.scale)
        self.VT.scale = self.VT.scale + self.velocity.scale
    end
end
function Moveable.prototype.move_wh(self, dt)
    if self.T.w ~= self.VT.w and not self.pinch.x or self.T.h ~= self.VT.h and not self.pinch.y or self.VT.w > 0 and self.pinch.x or self.VT.h > 0 and self.pinch.y then
        self.STATIONARY = false
        self.VT.w = self.VT.w + 8 * dt * (self.pinch.x and -1 or 1) * self.T.w
        self.VT.h = self.VT.h + 8 * dt * (self.pinch.y and -1 or 1) * self.T.h
        self.VT.w = math.max(
            math.min(self.VT.w, self.T.w),
            0
        )
        self.VT.h = math.max(
            math.min(self.VT.h, self.T.h),
            0
        )
    end
end
function Moveable.prototype.move_r(self, dt, vel)
    local des_r = self.T.r + 0.015 * vel.x / dt + (self.juice and self.juice.r * 2 or 0)
    if des_r ~= self.VT.r or math.abs(self.velocity.r) > 0.001 then
        self.STATIONARY = false
        self.velocity.r = G.exp_times.r * self.velocity.r + (1 - G.exp_times.r) * (des_r - self.VT.r)
        self.VT.r = self.VT.r + self.velocity.r
    end
    if math.abs(self.VT.r - self.T.r) < 0.001 and math.abs(self.velocity.r) < 0.001 then
        self.VT.r = self.T.r
        self.velocity.r = 0
    end
end
function Moveable.prototype.calculate_parrallax(self)
    if not G.ROOM then
        return
    end
    self.shadow_parrallax.x = (self.T.x + self.T.w / 2 - G.ROOM.T.w / 2) / (G.ROOM.T.w / 2) * 1.5
end
function Moveable.prototype.set_role(self, args)
    if args.major and not args.major.set_role then
        return
    end
    if args.offset and (type(args.offset) == "table" and not (args.offset.y and args.offset.x)) or type(args.offset) ~= "table" then
        args.offset = nil
    end
    self.role = {
        role_type = args.role_type or self.role.role_type,
        offset = args.offset or self.role.offset,
        major = args.major or self.role.major,
        xy_bond = args.xy_bond or self.role.xy_bond,
        wh_bond = args.wh_bond or self.role.wh_bond,
        r_bond = args.r_bond or self.role.r_bond,
        scale_bond = args.scale_bond or self.role.scale_bond,
        draw_major = args.draw_major or self.role.draw_major
    }
    if self.role.role_type == "Major" then
        self.role.major = nil
    end
end
function Moveable.prototype.get_major(self)
    if self.role.role_type ~= "Major" and self.role.major ~= self and (self.role.xy_bond ~= "Weak" and self.role.r_bond ~= "Weak") then
        if not self.FRAME.MAJOR or G.REFRESH_FRAME_MAJOR_CACHE then
            self.FRAME.MAJOR = self.FRAME.MAJOR or EMPTY(_G, self.FRAME.OLD_MAJOR)
            self.temp_offs = EMPTY(_G, self.temp_offs)
            local ____opt_9 = self.role.major
            local major = ____opt_9 and ____opt_9:get_major()
            self.FRAME.MAJOR.major = major.major
            self.FRAME.MAJOR.offset = self.FRAME.MAJOR.offset or self.temp_offs
            local ____temp_11 = {major.offset.x + self.role.offset.x + self.layered_parallax.x, major.offset.y + self.role.offset.y + self.layered_parallax.y}
            self.FRAME.MAJOR.offset.x = ____temp_11[1]
            self.FRAME.MAJOR.offset.y = ____temp_11[2]
        end
        return self.FRAME.MAJOR
    else
        self.ARGS.get_major = self.ARGS.get_major or ({major = nil, offset = {x = nil, y = nil}})
        self.ARGS.get_major.major = self
        self.ARGS.get_major.offset = self.ARGS.get_major.offset or ({x = nil, y = nil})
        local ____temp_12 = {0, 0}
        self.ARGS.get_major.offset.x = ____temp_12[1]
        self.ARGS.get_major.offset.y = ____temp_12[2]
        return self.ARGS.get_major
    end
end
function Moveable.prototype.remove(self)
    for k, v in pairs(G.MOVEABLES) do
        if v == self then
            table.remove(
                G.MOVEABLES,
                __TS__Number(k)
            )
            break
        end
    end
    for k, v in pairs(G.I.MOVEABLE) do
        if v == self then
            table.remove(
                G.I.MOVEABLE,
                __TS__Number(k)
            )
            break
        end
    end
    LuaNode.prototype.remove(self)
end
MWM = {rotated_offset = {x = 0 / 0, y = 0 / 0}, angles = {sin = 0 / 0, cos = 0 / 0}, WH = {w = 0 / 0, h = 0 / 0}, offs = {x = 0 / 0, y = 0 / 0}}
