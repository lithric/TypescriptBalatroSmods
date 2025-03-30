local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__Number = ____lualib.__TS__Number
Particles = __TS__Class()
Particles.name = "Particles"
__TS__ClassExtends(Particles, Moveable)
function Particles.prototype.____constructor(self, X, Y, W, H, config)
    Moveable.prototype.____constructor(
        self,
        X,
        Y,
        W,
        H
    )
    config = config or ({})
    self.fill = config.fill
    self.padding = config.padding or 0
    if config.attach then
        if self.role.major == nil then
            error("bad")
        end
        self:set_alignment({major = config.attach, type = "cm", bond = "Strong"})
        table.insert(self.role.major.children, self)
        self.parent = self.role.major
        self.T.x = self.role.major.T.x + self.padding
        self.T.y = self.role.major.T.y + self.padding
        if self.fill then
            self.T.w = self.role.major.T.w - self.padding
            self.T.h = self.role.major.T.h - self.padding
        end
    end
    self.states.hover.can = false
    self.states.click.can = false
    self.states.collide.can = false
    self.states.drag.can = false
    self.states.release_on.can = false
    self.timer = config.timer or 0.5
    self.timer_type = self.created_on_pause and "REAL" or config.timer_type or "REAL"
    self.last_real_time = G.TIMERS[self.timer_type] - self.timer
    self.last_drawn = 0
    self.lifespan = config.lifespan or 1
    self.fade_alpha = 0
    self.speed = config.speed or 1
    self.max = config.max or 1000000000000000
    self.pulse_max = math.min(20, config.pulse_max or 0)
    self.pulsed = 0
    self.vel_variation = config.vel_variation or 1
    self.particles = {}
    self.scale = config.scale or 1
    self.colours = config.colours or ({G.C.BACKGROUND.D})
    if config.initialize then
        do
            local i = 1
            while i <= 60 do
                self.last_real_time = self.last_real_time - 15 / 60
                self:update(15 / 60)
                self:move(15 / 60)
                i = i + 1
            end
        end
    end
    if getmetatable(self) == Particles then
        table.insert(G.I.MOVEABLE, self)
    end
end
function Particles.prototype.update(self, dt)
    if G.SETTINGS.paused and not self.created_on_pause then
        self.last_real_time = G.TIMERS[self.timer_type]
        return
    end
    local added_this_frame = 0
    while G.TIMERS[self.timer_type] > self.last_real_time + self.timer and (#self.particles < self.max or self.pulsed < self.pulse_max) and added_this_frame < 20 do
        self.last_real_time = self.last_real_time + self.timer
        local new_offset = {
            x = self.fill and (0.5 - math.random()) * self.T.w or 0,
            y = self.fill and (0.5 - math.random()) * self.T.h or 0
        }
        if self.fill and self.T.r < 0.1 and self.T.r > -0.1 then
            local newer_offset = {
                x = math.sin(self.T.r) * new_offset.y + math.cos(self.T.r) * new_offset.x,
                y = math.sin(self.T.r) * new_offset.x + math.cos(self.T.r) * new_offset.y
            }
            new_offset = newer_offset
        end
        local ____table_insert_8 = table.insert
        local ____self_particles_7 = self.particles
        local ____temp_1 = math.random() * 2 * math.pi
        local ____temp_2 = math.random() * 2 * math.pi
        local ____temp_3 = math.random() * 0.5 + 0.1
        local ____temp_4 = self.speed * (self.vel_variation * math.random() + (1 - self.vel_variation)) * 0.7
        local ____temp_5 = 0.2 * (0.5 - math.random())
        local ____G_TIMERS_self_timer_type_6 = G.TIMERS[self.timer_type]
        local ____pseudorandom_element_result__0_0 = pseudorandom_element(_G, self.colours)[0]
        if ____pseudorandom_element_result__0_0 == nil then
            ____pseudorandom_element_result__0_0 = {0 / 0, 0 / 0, 0 / 0, 0 / 0}
        end
        ____table_insert_8(____self_particles_7, {
            draw = false,
            dir = ____temp_1,
            facing = ____temp_2,
            size = ____temp_3,
            age = 0,
            velocity = ____temp_4,
            r_vel = ____temp_5,
            e_prev = 0,
            e_curr = 0,
            scale = 0,
            visible_scale = 0,
            time = ____G_TIMERS_self_timer_type_6,
            colour = ____pseudorandom_element_result__0_0,
            offset = new_offset
        })
        added_this_frame = added_this_frame + 1
        if self.pulsed <= self.pulse_max then
            self.pulsed = self.pulsed + 1
        end
    end
end
function Particles.prototype.move(self, dt)
    if G.SETTINGS.paused and not self.created_on_pause then
        return
    end
    Moveable.prototype.move(self, dt)
    if self.timer_type ~= "REAL" then
        dt = dt * G.SPEEDFACTOR
    end
    do
        local i = #self.particles - 1
        while i >= 0 do
            self.particles[i + 1].draw = true
            self.particles[i + 1].e_vel = self.particles[i + 1].e_vel or dt * self.scale
            self.particles[i + 1].e_prev = self.particles[i + 1].e_curr
            self.particles[i + 1].age = self.particles[i + 1].age + dt
            self.particles[i + 1].e_curr = math.min(
                2 * math.min(self.particles[i + 1].age / self.lifespan * self.scale, self.scale * ((self.lifespan - self.particles[i + 1].age) / self.lifespan)),
                self.scale
            )
            self.particles[i + 1].e_vel = (self.particles[i + 1].e_curr - self.particles[i + 1].e_prev) * self.scale * dt + (1 - self.scale * dt) * (self.particles[i + 1].e_vel or 1)
            self.particles[i + 1].scale = self.particles[i + 1].scale + (self.particles[i + 1].e_vel or 1)
            self.particles[i + 1].scale = math.min(
                2 * math.min(self.particles[i + 1].age / self.lifespan * self.scale, self.scale * ((self.lifespan - self.particles[i + 1].age) / self.lifespan)),
                self.scale
            )
            if self.particles[i + 1].scale < 0 then
                table.remove(self.particles, i)
            else
                self.particles[i + 1].offset.x = self.particles[i + 1].offset.x + self.particles[i + 1].velocity * math.sin(self.particles[i + 1].dir) * dt
                self.particles[i + 1].offset.y = self.particles[i + 1].offset.y + self.particles[i + 1].velocity * math.cos(self.particles[i + 1].dir) * dt
                self.particles[i + 1].facing = self.particles[i + 1].facing + self.particles[i + 1].r_vel * dt
                self.particles[i + 1].velocity = math.max(0, self.particles[i + 1].velocity - self.particles[i + 1].velocity * 0.07 * dt)
            end
            i = i + -1
        end
    end
end
function Particles.prototype.fade(self, delay, to)
    G.E_MANAGER:add_event(__TS__New(GameEvent, {
        trigger = "ease",
        timer = self.timer_type,
        blockable = false,
        blocking = false,
        ref_value = "fade_alpha",
        ref_table = self,
        ease_to = to or 1,
        delay = delay
    }))
end
function Particles.prototype.draw(self, alpha)
    alpha = alpha or 1
    prep_draw(_G, self, 1)
    love.graphics.translate(self.T.w / 2, self.T.h / 2)
    for k, w in pairs(self.particles) do
        local v = w
        if v.draw then
            love.graphics.push()
            love.graphics.setColor(v.colour[1], v.colour[2], v.colour[3], v.colour[4] * alpha * (1 - self.fade_alpha))
            love.graphics.translate(v.offset.x, v.offset.y)
            love.graphics.rotate(v.facing)
            love.graphics.rectangle(
                "fill",
                -v.scale / 2,
                -v.scale / 2,
                v.scale,
                v.scale
            )
            love.graphics.pop()
        end
    end
    love.graphics.pop()
    add_to_drawhash(_G, self)
    self:draw_boundingrect()
end
function Particles.prototype.remove(self)
    if self.role.major then
        for k, v in pairs(self.role.major.children) do
            if v == self and type(k) == "number" then
                table.remove(
                    self.role.major.children,
                    __TS__Number(k)
                )
            end
        end
    end
    remove_all(_G, self.children)
    Moveable.prototype.remove(self)
end
