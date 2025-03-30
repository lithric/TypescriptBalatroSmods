local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Iterator = ____lualib.__TS__Iterator
DynaText = __TS__Class()
DynaText.name = "DynaText"
__TS__ClassExtends(DynaText, Moveable)
function DynaText.prototype.____constructor(self, config)
    Moveable.prototype.____constructor(
        self,
        config.X or 0,
        config.Y or 0,
        config.W,
        config.H
    )
    config = config or ({})
    self.config = config
    self.shadow = config.shadow
    self.scale = config.scale or 1
    self.pop_in_rate = config.pop_in_rate or 3
    self.bump_rate = config.bump_rate or 2.666
    self.bump_amount = config.bump_amount or 1
    self.font = config.font or G.LANG.font
    if config.string and type(config.string) ~= "table" then
        config.string = {config.string}
    end
    self.string = config.string and type(config.string) == "table" and config.string[1] or ({"HELLO WORLD"})
    self.text_offset = {x = self.font.TEXT_OFFSET.x * self.scale + (self.config.x_offset or 0), y = self.font.TEXT_OFFSET.y * self.scale + (self.config.y_offset or 0)}
    self.colours = config.colours or ({G.C.RED})
    self.created_time = G.TIMERS.REAL
    self.silent = config.silent
    self.start_pop_in = self.config.pop_in
    config.W = 0
    config.H = 0
    self.strings = {}
    self.focused_string = 1
    self:update_text(true)
    if self.config.maxw and self.config.W > self.config.maxw then
        self.start_pop_in = self.config.pop_in
        self.scale = self.scale * (self.config.maxw / self.config.W)
        self:update_text(true)
    end
    if #self.strings > 1 then
        self.pop_delay = self.config.pop_delay or 1.5
        self:pop_out(4)
    end
    self.T.r = self.config.text_rot or 0
    self.states.hover.can = false
    self.states.click.can = false
    self.states.collide.can = false
    self.states.drag.can = false
    self.states.release_on.can = false
    self:set_role({
        wh_bond = "Weak",
        scale_bond = "Weak",
        role_type = nil,
        major = nil,
        xy_bond = nil,
        r_bond = nil
    })
    if getmetatable(self) == DynaText then
        table.insert(G.I.MOVEABLE, self)
    end
end
function DynaText.prototype.update(self, dt)
    self:update_text()
    self:align_letters()
end
function DynaText.prototype.update_text(self, first_pass)
    self.config.W = 0
    self.config.H = 0
    self.scale = self.config.scale_function and self.config:scale_function() or self.scale
    for k, v in ipairs(self.config.string) do
        if type(v) == "table" and v.ref_table or first_pass then
            local part_a, part_b = 0, 1000000
            local new_string = v
            local outer_colour = nil
            local inner_colour = nil
            local part_scale = 1
            if type(v) == "table" and (v.ref_table or v.string) then
                new_string = (v.prefix or "") + (format_ui_value(_G, v.ref_table and v.ref_table[v.ref_value] or v.string) + (v.suffix or ""))
                part_a = (v.prefix or "").length
                part_b = new_string.length - (v.suffix or "").length
                if v.scale then
                    part_scale = v.scale
                end
                if first_pass then
                    outer_colour = v.outer_colour or nil
                    inner_colour = v.colour or nil
                end
                v = new_string
            end
            self.strings[k] = self.strings[k] or ({})
            local old_string = self.strings[k].string
            if old_string ~= new_string or first_pass then
                if self.start_pop_in then
                    self.reset_pop_in = true
                end
                self.reset_pop_in = self.reset_pop_in or self.config.reset_pop_in
                if not self.reset_pop_in then
                    self.config.pop_out = nil
                    self.config.pop_in = nil
                else
                    self.config.pop_in = self.config.pop_in or 0
                    self.created_time = G.TIMERS.REAL
                end
                self.strings[k].string = v
                local old_letters = self.strings[k].letters
                local tempW = 0
                local tempH = 0
                local current_letter = 1
                self.strings[k].letters = {}
                for ____, ____value in __TS__Iterator(utf8:chars(v)) do
                    local _ = ____value[1]
                    local c = ____value[2]
                    local old_letter = old_letters and old_letters[current_letter] or nil
                    local let_tab = {
                        letter = love.graphics.newText(self.font.FONT, c),
                        char = c,
                        scale = old_letter and old_letter.scale or part_scale
                    }
                    self.strings[k].letters[current_letter] = let_tab
                    local tx = self.font.FONT:getWidth(c) * self.scale * part_scale * G.TILESCALE * self.font.FONTSCALE + 2.7 * (self.config.spacing or 0) * G.TILESCALE * self.font.FONTSCALE
                    local ty = self.font.FONT:getHeight(c) * self.scale * part_scale * G.TILESCALE * self.font.FONTSCALE * self.font.TEXT_HEIGHT_SCALE
                    let_tab.offset = old_letter and old_letter.offset or ({x = 0, y = 0})
                    let_tab.dims = {x = tx / (self.font.FONTSCALE * G.TILESCALE), y = ty / (self.font.FONTSCALE * G.TILESCALE)}
                    let_tab.pop_in = first_pass and (old_letter and old_letter.pop_in or (self.config.pop_in and 0 or 1)) or 1
                    let_tab.prefix = current_letter <= part_a and outer_colour or nil
                    let_tab.suffix = current_letter > part_b and outer_colour or nil
                    let_tab.colour = inner_colour or nil
                    if k > 1 then
                        let_tab.pop_in = 0
                    end
                    tempW = tempW + tx / (G.TILESIZE * G.TILESCALE)
                    tempH = math.max(ty / (G.TILESIZE * G.TILESCALE), tempH)
                    current_letter = current_letter + 1
                end
                self.strings[k].W = tempW
                self.strings[k].H = tempH
            end
        end
        if self.strings[k].W > self.config.W then
            self.config.W = self.strings[k].W
            self.strings[k].W_offset = 0
        end
        if self.strings[k].H > self.config.H then
            self.config.H = self.strings[k].H
            self.strings[k].H_offset = 0
        end
    end
    if self.T then
        if (self.T.w ~= self.config.W or self.T.h ~= self.config.H) and (not first_pass or self.reset_pop_in) then
            self.ui_object_updated = true
            self.non_recalc = self.config.non_recalc
        end
        self.T.w = self.config.W
        self.T.h = self.config.H
    end
    self.reset_pop_in = false
    self.start_pop_in = false
    for k, v in ipairs(self.strings) do
        v.W_offset = 0.5 * (self.config.W - v.W)
        v.H_offset = 0.5 * (self.config.H - v.H + (self.config.offset_y or 0))
    end
end
function DynaText.prototype.pop_out(self, pop_out_timer)
    self.config.pop_out = pop_out_timer or 1
    self.pop_out_time = G.TIMERS.REAL + (self.pop_delay or 0)
end
function DynaText.prototype.pop_in(self, pop_in_timer)
    self.reset_pop_in = true
    self.config.pop_out = nil
    self.config.pop_in = pop_in_timer or 0
    self.created_time = G.TIMERS.REAL
    for k, letter in ipairs(self.strings[self.focused_string + 1].letters) do
        letter.pop_in = 0
    end
    self:update_text()
end
function DynaText.prototype.align_letters(self)
    if self.pop_cycle then
        self.focused_string = self.config.random_element and math.random(1, #self.strings) or self.focused_string == #self.strings and 1 or self.focused_string + 1
        self.pop_cycle = false
        for k, letter in ipairs(self.strings[self.focused_string + 1].letters) do
            letter.pop_in = 0
        end
        self.config.pop_in = 0.1
        self.config.pop_out = nil
        self.created_time = G.TIMERS.REAL
    end
    self.string = self.strings[self.focused_string + 1].string
    for k, letter in ipairs(self.strings[self.focused_string + 1].letters) do
        if self.config.pop_out then
            letter.pop_in = math.min(
                1,
                math.max((self.config.min_cycle_time or 1) - (G.TIMERS.REAL - self.pop_out_time) * self.config.pop_out / (self.config.min_cycle_time or 1), 0)
            )
            letter.pop_in = letter.pop_in * letter.pop_in
            if k == self.strings[self.focused_string + 1].letters.length and letter.pop_in <= 0 and #self.strings > 1 then
                self.pop_cycle = true
            end
        elseif self.config.pop_in then
            local prev_pop_in = letter.pop_in
            letter.pop_in = math.min(
                1,
                math.max((G.TIMERS.REAL - self.config.pop_in - self.created_time) * #self.string * self.pop_in_rate - k + 1, self.config.min_cycle_time == 0 and 1 or 0)
            )
            letter.pop_in = letter.pop_in * letter.pop_in
            if prev_pop_in <= 0 and letter.pop_in > 0 and not self.silent and (#self.string < 10 or k % 2 == 0) then
                if self.T.x > G.ROOM.T.w + 2 or self.T.y > G.ROOM.T.h + 2 or self.T.x < -2 or self.T.y < -2 then
                else
                    play_sound(
                        _G,
                        "paper1",
                        0.45 + 0.05 * math.random() + 0.3 / #self.string * k + (self.config.pitch_shift or 0)
                    )
                end
            end
            if k == self.strings[self.focused_string + 1].letters.length and letter.pop_in >= 1 then
                if #self.strings > 1 then
                    self.pop_delay = G.TIMERS.REAL - self.config.pop_in - self.created_time + (self.config.pop_delay or 1.5)
                    self:pop_out(4)
                else
                    self.config.pop_in = nil
                end
            end
        end
        letter.r = 0
        letter.scale = 1
        if self.config.rotate then
            letter.r = (self.config.rotate == 2 and -1 or 1) * (0.2 * (-self.strings[self.focused_string + 1].letters.length / 2 - 0.5 + k) / self.strings[self.focused_string + 1].letters.length + (G.SETTINGS.reduced_motion and 0 or 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + k))
        end
        if self.config.pulse then
            letter.scale = letter.scale + (G.SETTINGS.reduced_motion and 0 or 1) * (1 / self.config.pulse.width) * self.config.pulse.amount * math.max(
                math.min((self.config.pulse.start - G.TIMERS.REAL) * self.config.pulse.speed + k + self.config.pulse.width, (G.TIMERS.REAL - self.config.pulse.start) * self.config.pulse.speed - k + self.config.pulse.width + 2),
                0
            )
            letter.r = letter.r + (G.SETTINGS.reduced_motion and 0 or 1) * (letter.scale - 1) * 0.02 * (-self.strings[self.focused_string + 1].letters.length / 2 - 0.5 + k)
            if self.config.pulse.start > G.TIMERS.REAL + 2 * self.config.pulse.speed * self.strings[self.focused_string + 1].letters.length then
                self.config.pulse = nil
            end
        end
        if self.config.quiver then
            letter.scale = letter.scale + (G.SETTINGS.reduced_motion and 0 or 1) * 0.1 * self.config.quiver.amount
            letter.r = letter.r + (G.SETTINGS.reduced_motion and 0 or 1) * 0.3 * self.config.quiver.amount * (math.sin(41.12342 * G.TIMERS.REAL * self.config.quiver.speed + k * 1223.2) + math.cos(63.21231 * G.TIMERS.REAL * self.config.quiver.speed + k * 1112.2) * math.sin(36.1231 * G.TIMERS.REAL * self.config.quiver.speed) + math.cos(95.123 * G.TIMERS.REAL * self.config.quiver.speed + k * 1233.2) - math.sin(30.133421 * G.TIMERS.REAL * self.config.quiver.speed + k * 123.2))
        end
        if self.config.float then
            letter.offset.y = (G.SETTINGS.reduced_motion and 0 or 1) * math.sqrt(self.scale) * (2 + self.font.FONTSCALE / G.TILESIZE * 2000 * math.sin(2.666 * G.TIMERS.REAL + 200 * k)) + 60 * (letter.scale - 1)
        end
        if self.config.bump then
            letter.offset.y = (G.SETTINGS.reduced_motion and 0 or 1) * self.bump_amount * math.sqrt(self.scale) * 7 * math.max(
                0,
                (5 + self.bump_rate) * math.sin(self.bump_rate * G.TIMERS.REAL + 200 * k) - 3 - self.bump_rate
            )
        end
    end
end
function DynaText.prototype.set_quiver(self, amt)
    self.config.quiver = {speed = 0.5, amount = amt or 0.7, silent = false}
end
function DynaText.prototype.pulse(self, amt)
    self.config.pulse = {
        speed = 40,
        width = 2.5,
        start = G.TIMERS.REAL,
        amount = amt or 0.2,
        silent = false
    }
end
function DynaText.prototype.draw(self)
    if self.children.particle_effect then
        self.children.particle_effect:draw()
    end
    if self.shadow then
        prep_draw(_G, self, 1)
        love.graphics.translate(self.strings[self.focused_string + 1].W_offset + self.text_offset.x * self.font.FONTSCALE / G.TILESIZE, self.strings[self.focused_string + 1].H_offset + self.text_offset.y * self.font.FONTSCALE / G.TILESIZE)
        if self.config.spacing then
            love.graphics.translate(self.config.spacing * self.font.FONTSCALE / G.TILESIZE, 0)
        end
        if self.config.shadow_colour then
            love.graphics.setColor(self.config.shadow_colour)
        else
            love.graphics.setColor(0, 0, 0, 0.3 * self.colours[1][4])
        end
        for k, letter in ipairs(self.strings[self.focused_string + 1].letters) do
            local real_pop_in = self.config.min_cycle_time == 0 and 1 or letter.pop_in
            love.graphics.draw(
                letter.letter,
                0.5 * (letter.dims.x - letter.offset.x) * self.font.FONTSCALE / G.TILESIZE - self.shadow_parrallax.x * self.scale / G.TILESIZE,
                0.5 * letter.dims.y * self.font.FONTSCALE / G.TILESIZE - self.shadow_parrallax.y * self.scale / G.TILESIZE,
                letter.r or 0,
                real_pop_in * self.scale * self.font.FONTSCALE / G.TILESIZE,
                real_pop_in * self.scale * self.font.FONTSCALE / G.TILESIZE,
                0.5 * letter.dims.x / self.scale,
                0.5 * letter.dims.y / self.scale
            )
            love.graphics.translate(letter.dims.x * self.font.FONTSCALE / G.TILESIZE, 0)
        end
        love.graphics.pop()
    end
    prep_draw(_G, self, 1)
    love.graphics.translate(self.strings[self.focused_string + 1].W_offset + self.text_offset.x * self.font.FONTSCALE / G.TILESIZE, self.strings[self.focused_string + 1].H_offset + self.text_offset.y * self.font.FONTSCALE / G.TILESIZE)
    if self.config.spacing then
        love.graphics.translate(self.config.spacing * self.font.FONTSCALE / G.TILESIZE, 0)
    end
    self.ARGS.draw_shadow_norm = self.ARGS.draw_shadow_norm or ({})
    local _shadow_norm = self.ARGS.draw_shadow_norm
    local ____temp_0 = {
        self.shadow_parrallax.x / math.sqrt(self.shadow_parrallax.y * self.shadow_parrallax.y + self.shadow_parrallax.x * self.shadow_parrallax.x) * self.font.FONTSCALE / G.TILESIZE,
        self.shadow_parrallax.y / math.sqrt(self.shadow_parrallax.y * self.shadow_parrallax.y + self.shadow_parrallax.x * self.shadow_parrallax.x) * self.font.FONTSCALE / G.TILESIZE
    }
    _shadow_norm.x = ____temp_0[1]
    _shadow_norm.y = ____temp_0[2]
    for k, letter in ipairs(self.strings[self.focused_string + 1].letters) do
        local real_pop_in = self.config.min_cycle_time == 0 and 1 or letter.pop_in
        love.graphics.setColor(letter.prefix or letter.suffix or letter.colour or self.colours[k % self.colours.length + 1])
        love.graphics.draw(
            letter.letter,
            0.5 * (letter.dims.x - letter.offset.x) * self.font.FONTSCALE / G.TILESIZE + _shadow_norm.x,
            0.5 * (letter.dims.y - letter.offset.y) * self.font.FONTSCALE / G.TILESIZE + _shadow_norm.y,
            letter.r or 0,
            real_pop_in * letter.scale * self.scale * self.font.FONTSCALE / G.TILESIZE,
            real_pop_in * letter.scale * self.scale * self.font.FONTSCALE / G.TILESIZE,
            0.5 * letter.dims.x / self.scale,
            0.5 * letter.dims.y / self.scale
        )
        love.graphics.translate(letter.dims.x * self.font.FONTSCALE / G.TILESIZE, 0)
    end
    love.graphics.pop()
    add_to_drawhash(_G, self)
    self:draw_boundingrect()
end
