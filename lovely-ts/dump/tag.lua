local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
Tag = __TS__Class()
Tag.name = "Tag"
__TS__ClassExtends(Tag, LuaObject)
function Tag.prototype.____constructor(self, _tag, for_collection, _blind_type)
    LuaObject.prototype.____constructor(self)
    self.key = _tag
    local proto = G.P_TAGS[_tag] or G.tag_undiscovered
    self.config = copy_table(_G, proto.config)
    self.pos = proto.pos
    self.name = proto.name
    self.tally = G.GAME.tag_tally or 0
    self.triggered = false
    G.tagid = G.tagid or 0
    self.ID = G.tagid
    G.tagid = G.tagid + 1
    self.ability = {
        orbital_hand = "[" .. tostring(localize(_G, "k_poker_hand")) .. "]",
        blind_type = _blind_type
    }
    G.GAME.tag_tally = G.GAME.tag_tally and G.GAME.tag_tally + 1 or 1
    if not for_collection then
        self:set_ability()
    end
end
function Tag.prototype.nope(self)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            delay = 0.2,
            trigger = "after",
            func = function(self)
                attention_text(_G, {
                    text = "NOPE",
                    colour = G.C.WHITE,
                    scale = 0.7,
                    hold = 0.3 / G.SETTINGS.GAMESPEED,
                    cover = self.HUD_tag,
                    cover_colour = G.C.BLACK,
                    align = "cm"
                })
                play_sound(_G, "cancel", 1.4, 0.5)
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.1,
            func = function(self)
                self.HUD_tag.states.visible = false
                play_sound(_G, "cancel", 1.26, 0.5)
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.5,
            func = function(self)
                self:remove()
                return true
            end
        }
    ))
end
function Tag.prototype.yep(self, message, _colour, func)
    stop_use(_G)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            delay = 0.4,
            trigger = "after",
            func = function(self)
                attention_text(_G, {
                    text = message,
                    colour = G.C.WHITE,
                    scale = 1,
                    hold = 0.3 / G.SETTINGS.GAMESPEED,
                    cover = self.HUD_tag,
                    cover_colour = _colour or G.C.GREEN,
                    align = "cm"
                })
                play_sound(
                    _G,
                    "generic1",
                    0.9 + math.random() * 0.1,
                    0.8
                )
                play_sound(
                    _G,
                    "holo1",
                    1.2 + math.random() * 0.1,
                    0.4
                )
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {func = function(self)
            self.HUD_tag.states.visible = false
            return true
        end}
    ))
    G.E_MANAGER:add_event(__TS__New(GameEvent, {func = func}))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.7,
            func = function(self)
                self:remove()
                return true
            end
        }
    ))
end
function Tag.prototype.set_ability(self)
    local obj = SMODS.Tags[self.key]
    local res
    if obj and obj.set_ability and type(obj.set_ability) == "function" then
        obj:set_ability(self)
    end
    if self.name == "Orbital Tag" then
        if G.orbital_hand then
            self.ability.orbital_hand = G.orbital_hand
        elseif self.ability.blind_type then
            if G.GAME.orbital_choices and G.GAME.orbital_choices[G.GAME.round_resets.ante][self.ability.blind_type] then
                self.ability.orbital_hand = G.GAME.orbital_choices[G.GAME.round_resets.ante][self.ability.blind_type]
            end
        end
    end
end
function Tag.prototype.apply_to_run(self, _context)
    if self.triggered then
        return
    end
    local obj = SMODS.Tags[self.key]
    local res
    if obj and obj.apply and type(obj.apply) == "function" then
        res = obj:apply(self, _context)
    end
    if res then
        return res
    end
    if not self.triggered and self.config.type == _context.type then
        if _context.type == "eval" then
            if self.name == "Investment Tag" and G.GAME.last_blind and G.GAME.last_blind.boss then
                self:yep(
                    "+",
                    G.C.GOLD,
                    function(self)
                        return true
                    end
                )
                self.triggered = true
                return {
                    dollars = self.config.dollars,
                    condition = localize(_G, "ph_defeat_the_boss"),
                    pos = self.pos,
                    tag = self
                }
            end
        elseif _context.type == "immediate" then
            local lock = self.ID
            G.CONTROLLER.locks[lock] = true
            if self.name == "Top-up Tag" then
                self:yep(
                    "+",
                    G.C.PURPLE,
                    function(self)
                        do
                            local i = 1
                            while i <= self.config.spawn_jokers do
                                if G.jokers and G.jokers.cards.length < G.jokers.config.card_limit then
                                    local card = create_card(
                                        _G,
                                        "Joker",
                                        G.jokers,
                                        nil,
                                        0,
                                        nil,
                                        nil,
                                        nil,
                                        "top"
                                    )
                                    card:add_to_deck()
                                    G.jokers:emplace(card)
                                end
                                i = i + 1
                            end
                        end
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
            if self.name == "Skip Tag" then
                self:yep(
                    "+",
                    G.C.MONEY,
                    function(self)
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                ease_dollars(_G, (G.GAME.skips or 0) * self.config.skip_bonus)
                self.triggered = true
                return true
            end
            if self.name == "Garbage Tag" then
                self:yep(
                    "+",
                    G.C.MONEY,
                    function(self)
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                ease_dollars(_G, (G.GAME.unused_discards or 0) * self.config.dollars_per_discard)
                self.triggered = true
                return true
            end
            if self.name == "Handy Tag" then
                self:yep(
                    "+",
                    G.C.MONEY,
                    function(self)
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                ease_dollars(_G, (G.GAME.hands_played or 0) * self.config.dollars_per_hand)
                self.triggered = true
                return true
            end
            if self.name == "Economy Tag" then
                self:yep(
                    "+",
                    G.C.MONEY,
                    function(self)
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "immediate",
                        func = function(self)
                            ease_dollars(
                                _G,
                                math.min(
                                    self.config.max,
                                    math.max(0, G.GAME.dollars)
                                ),
                                true
                            )
                            return true
                        end
                    }
                ))
                self.triggered = true
                return true
            end
            if self.name == "Orbital Tag" then
                update_hand_text(_G, {sound = "button", volume = 0.7, pitch = 0.8, delay = 0.3}, {handname = self.ability.orbital_hand, chips = G.GAME.hands[self.ability.orbital_hand].chips, mult = G.GAME.hands[self.ability.orbital_hand].mult, level = G.GAME.hands[self.ability.orbital_hand].level})
                level_up_hand(
                    _G,
                    self,
                    self.ability.orbital_hand,
                    nil,
                    self.config.levels
                )
                update_hand_text(_G, {sound = "button", volume = 0.7, pitch = 1.1, delay = 0}, {mult = 0, chips = 0, handname = "", level = ""})
                self:yep(
                    "+",
                    G.C.MONEY,
                    function(self)
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
        elseif _context.type == "new_blind_choice" then
            local lock = self.ID
            G.CONTROLLER.locks[lock] = true
            if self.name == "Charm Tag" then
                self:yep(
                    "+",
                    G.C.PURPLE,
                    function(self)
                        local key = "p_arcana_mega_" .. tostring(math.random(1, 2))
                        local card = __TS__New(
                            Card,
                            G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2,
                            G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2,
                            G.CARD_W * 1.27,
                            G.CARD_H * 1.27,
                            G.P_CARDS.empty,
                            G.P_CENTERS[key],
                            {bypass_discovery_center = true, bypass_discovery_ui = true}
                        )
                        card.cost = 0
                        card.from_tag = true
                        G.FUNCS:use_card({config = {ref_table = card}})
                        card:start_materialize()
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
            if self.name == "Meteor Tag" then
                self:yep(
                    "+",
                    G.C.SECONDARY_SET.Planet,
                    function(self)
                        local key = "p_celestial_mega_" .. tostring(math.random(1, 2))
                        local card = __TS__New(
                            Card,
                            G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2,
                            G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2,
                            G.CARD_W * 1.27,
                            G.CARD_H * 1.27,
                            G.P_CARDS.empty,
                            G.P_CENTERS[key],
                            {bypass_discovery_center = true, bypass_discovery_ui = true}
                        )
                        card.cost = 0
                        card.from_tag = true
                        G.FUNCS:use_card({config = {ref_table = card}})
                        card:start_materialize()
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
            if self.name == "Ethereal Tag" then
                self:yep(
                    "+",
                    G.C.SECONDARY_SET.Spectral,
                    function(self)
                        local key = "p_spectral_normal_1"
                        local card = __TS__New(
                            Card,
                            G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2,
                            G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2,
                            G.CARD_W * 1.27,
                            G.CARD_H * 1.27,
                            G.P_CARDS.empty,
                            G.P_CENTERS[key],
                            {bypass_discovery_center = true, bypass_discovery_ui = true}
                        )
                        card.cost = 0
                        card.from_tag = true
                        G.FUNCS:use_card({config = {ref_table = card}})
                        card:start_materialize()
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
            if self.name == "Standard Tag" then
                self:yep(
                    "+",
                    G.C.SECONDARY_SET.Spectral,
                    function(self)
                        local key = "p_standard_mega_1"
                        local card = __TS__New(
                            Card,
                            G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2,
                            G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2,
                            G.CARD_W * 1.27,
                            G.CARD_H * 1.27,
                            G.P_CARDS.empty,
                            G.P_CENTERS[key],
                            {bypass_discovery_center = true, bypass_discovery_ui = true}
                        )
                        card.cost = 0
                        card.from_tag = true
                        G.FUNCS:use_card({config = {ref_table = card}})
                        card:start_materialize()
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
            if self.name == "Buffoon Tag" then
                self:yep(
                    "+",
                    G.C.SECONDARY_SET.Spectral,
                    function(self)
                        local key = "p_buffoon_mega_1"
                        local card = __TS__New(
                            Card,
                            G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2,
                            G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2,
                            G.CARD_W * 1.27,
                            G.CARD_H * 1.27,
                            G.P_CARDS.empty,
                            G.P_CENTERS[key],
                            {bypass_discovery_center = true, bypass_discovery_ui = true}
                        )
                        card.cost = 0
                        card.from_tag = true
                        G.FUNCS:use_card({config = {ref_table = card}})
                        card:start_materialize()
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
                return true
            end
            if self.name == "Boss Tag" then
                local lock = self.ID
                G.CONTROLLER.locks[lock] = true
                self:yep(
                    "+",
                    G.C.GREEN,
                    function(self)
                        G.from_boss_tag = true
                        G.FUNCS:reroll_boss()
                        G.E_MANAGER:add_event(__TS__New(
                            GameEvent,
                            {func = function(self)
                                G.E_MANAGER:add_event(__TS__New(
                                    GameEvent,
                                    {func = function(self)
                                        G.CONTROLLER.locks[lock] = nil
                                        return true
                                    end}
                                ))
                                return true
                            end}
                        ))
                        return true
                    end
                )
                self.triggered = true
                return true
            end
        elseif _context.type == "voucher_add" then
            if self.name == "Voucher Tag" then
                self:yep(
                    "+",
                    G.C.SECONDARY_SET.Voucher,
                    function(self)
                        G.ARGS.voucher_tag = G.ARGS.voucher_tag or ({})
                        local voucher_key = get_next_voucher_key(_G, true)
                        G.ARGS.voucher_tag[voucher_key] = true
                        G.shop_vouchers.config.card_limit = G.shop_vouchers.config.card_limit + 1
                        local card = __TS__New(
                            Card,
                            G.shop_vouchers.T.x + G.shop_vouchers.T.w / 2,
                            G.shop_vouchers.T.y,
                            G.CARD_W,
                            G.CARD_H,
                            G.P_CARDS.empty,
                            G.P_CENTERS[voucher_key],
                            {bypass_discovery_center = true, bypass_discovery_ui = true}
                        )
                        create_shop_card_ui(_G, card, "Voucher", G.shop_vouchers)
                        card:start_materialize()
                        G.shop_vouchers:emplace(card)
                        G.ARGS.voucher_tag = nil
                        return true
                    end
                )
                self.triggered = true
            end
        elseif _context.type == "tag_add" then
            if self.name == "Double Tag" and _context.tag.key ~= "tag_double" then
                local lock = self.ID
                G.CONTROLLER.locks[lock] = true
                self:yep(
                    "+",
                    G.C.BLUE,
                    function(self)
                        if _context.tag.ability and _context.tag.ability.orbital_hand then
                            G.orbital_hand = _context.tag.ability.orbital_hand
                        end
                        add_tag(
                            _G,
                            __TS__New(Tag, _context.tag.key)
                        )
                        G.orbital_hand = nil
                        G.CONTROLLER.locks[lock] = nil
                        return true
                    end
                )
                self.triggered = true
            end
        elseif _context.type == "round_start_bonus" then
            if self.name == "Juggle Tag" then
                self:yep(
                    "+",
                    G.C.BLUE,
                    function(self)
                        return true
                    end
                )
                G.hand:change_size(self.config.h_size)
                G.GAME.round_resets.temp_handsize = (G.GAME.round_resets.temp_handsize or 0) + self.config.h_size
                self.triggered = true
                return true
            end
        elseif _context.type == "store_joker_create" then
            local card = nil
            if self.name == "Rare Tag" then
                local rares_in_posession = {0}
                for k, v in ipairs(G.jokers.cards) do
                    if v.config.center.rarity == 3 and not rares_in_posession[v.config.center.key] then
                        rares_in_posession[2] = rares_in_posession[2] + 1
                        rares_in_posession[v.config.center.key] = true
                    end
                end
                if #G.P_JOKER_RARITY_POOLS[4] > rares_in_posession[2] then
                    card = create_card(
                        _G,
                        "Joker",
                        _context.area,
                        nil,
                        1,
                        nil,
                        nil,
                        nil,
                        "rta"
                    )
                    create_shop_card_ui(_G, card, "Joker", _context.area)
                    card.states.visible = false
                    self:yep(
                        "+",
                        G.C.RED,
                        function(self)
                            card:start_materialize()
                            card.ability.couponed = true
                            card:set_cost()
                            return true
                        end
                    )
                else
                    self:nope()
                end
                self.triggered = true
            elseif self.name == "Uncommon Tag" then
                card = create_card(
                    _G,
                    "Joker",
                    _context.area,
                    nil,
                    0.9,
                    nil,
                    nil,
                    nil,
                    "uta"
                )
                create_shop_card_ui(_G, card, "Joker", _context.area)
                card.states.visible = false
                self:yep(
                    "+",
                    G.C.GREEN,
                    function(self)
                        card:start_materialize()
                        card.ability.couponed = true
                        card:set_cost()
                        return true
                    end
                )
            end
            self.triggered = true
            return card
        elseif _context.type == "shop_start" then
            if self.name == "D6 Tag" and not G.GAME.shop_d6ed then
                G.GAME.shop_d6ed = true
                self:yep(
                    "+",
                    G.C.GREEN,
                    function(self)
                        G.GAME.round_resets.temp_reroll_cost = 0
                        calculate_reroll_cost(_G, true)
                        return true
                    end
                )
                self.triggered = true
                return true
            end
        elseif _context.type == "store_joker_modify" then
            local _applied = nil
            if not _context.card.edition and not _context.card.temp_edition and _context.card.ability.set == "Joker" then
                local lock = self.ID
                G.CONTROLLER.locks[lock] = true
                if self.name == "Foil Tag" then
                    _context.card.temp_edition = true
                    self:yep(
                        "+",
                        G.C.DARK_EDITION,
                        function(self)
                            _context.card:set_edition({foil = true}, true)
                            _context.card.ability.couponed = true
                            _context.card:set_cost()
                            _context.card.temp_edition = nil
                            G.CONTROLLER.locks[lock] = nil
                            return true
                        end
                    )
                    _applied = true
                elseif self.name == "Holographic Tag" then
                    _context.card.temp_edition = true
                    self:yep(
                        "+",
                        G.C.DARK_EDITION,
                        function(self)
                            _context.card.temp_edition = nil
                            _context.card:set_edition({holo = true}, true)
                            _context.card.ability.couponed = true
                            _context.card:set_cost()
                            G.CONTROLLER.locks[lock] = nil
                            return true
                        end
                    )
                    _applied = true
                elseif self.name == "Polychrome Tag" then
                    _context.card.temp_edition = true
                    self:yep(
                        "+",
                        G.C.DARK_EDITION,
                        function(self)
                            _context.card.temp_edition = nil
                            _context.card:set_edition({polychrome = true}, true)
                            _context.card.ability.couponed = true
                            _context.card:set_cost()
                            G.CONTROLLER.locks[lock] = nil
                            return true
                        end
                    )
                    _applied = true
                elseif self.name == "Negative Tag" then
                    _context.card.temp_edition = true
                    self:yep(
                        "+",
                        G.C.DARK_EDITION,
                        function(self)
                            _context.card.temp_edition = nil
                            _context.card:set_edition({negative = true}, true)
                            _context.card.ability.couponed = true
                            _context.card:set_cost()
                            G.CONTROLLER.locks[lock] = nil
                            return true
                        end
                    )
                    _applied = true
                end
                self.triggered = true
            end
            return _applied
        elseif _context.type == "shop_final_pass" then
            if self.name == "Coupon Tag" and (G.shop and not G.GAME.shop_free) then
                G.GAME.shop_free = true
                self:yep(
                    "+",
                    G.C.GREEN,
                    function(self)
                        if G.shop_jokers and G.shop_booster then
                            for k, v in pairs(G.shop_jokers.cards) do
                                v.ability.couponed = true
                                v:set_cost()
                            end
                            for k, v in pairs(G.shop_booster.cards) do
                                v.ability.couponed = true
                                v:set_cost()
                            end
                        end
                        return true
                    end
                )
                self.triggered = true
                return true
            end
        end
    end
end
function Tag.prototype.save(self)
    return {key = self.key, tally = self.tally, ability = self.ability}
end
function Tag.prototype.load(self, tag_savetable)
    self.key = tag_savetable.key
    local proto = G.P_TAGS[self.key] or G.tag_undiscovered
    self.config = copy_table(_G, proto.config)
    self.pos = proto.pos
    self.name = proto.name
    self.tally = tag_savetable.tally
    self.ability = tag_savetable.ability
    G.GAME.tag_tally = math.max(self.tally, G.GAME.tag_tally) + 1
end
function Tag.prototype.juice_up(self, _scale, _rot)
    if self.tag_sprite then
        self.tag_sprite:juice_up(_scale, _rot)
    end
end
function Tag.prototype.generate_UI(self, _size)
    _size = _size or 0.8
    local tag_sprite_tab = nil
    local tag_sprite = __TS__New(
        Sprite,
        0,
        0,
        _size * 1,
        _size * 1,
        G.ASSET_ATLAS[not self.hide_ability and G.P_TAGS[self.key].atlas or "tags"],
        self.hide_ability and G.tag_undiscovered.pos or self.pos
    )
    tag_sprite.T.scale = 1
    tag_sprite_tab = {n = G.UIT.C, config = {align = "cm", ref_table = self, group = self.tally}, nodes = {{n = G.UIT.O, config = {
        w = _size * 1,
        h = _size * 1,
        colour = G.C.BLUE,
        object = tag_sprite,
        focus_with_object = true
    }}}}
    tag_sprite:define_draw_steps({{shader = "dissolve", shadow_height = 0.05}, {shader = "dissolve"}})
    tag_sprite.float = true
    tag_sprite.states.hover.can = true
    tag_sprite.states.drag.can = false
    tag_sprite.states.collide.can = true
    tag_sprite.config = {tag = self, force_focus = true}
    tag_sprite.hover = function(self, _this)
        if not G.CONTROLLER.dragging.target or G.CONTROLLER.using_touch then
            if not _this.hovering and _this.states.visible then
                _this.hovering = true
                if _this == tag_sprite then
                    _this.hover_tilt = 3
                    _this:juice_up(0.05, 0.02)
                    play_sound(
                        _G,
                        "paper1",
                        math.random() * 0.1 + 0.55,
                        0.42
                    )
                    play_sound(
                        _G,
                        "tarot2",
                        math.random() * 0.1 + 0.55,
                        0.09
                    )
                end
                self:get_uibox_table(tag_sprite)
                _this.config.h_popup = G.UIDEF:card_h_popup(_this)
                _this.config.h_popup_config = _this.T.x > G.ROOM.T.w * 0.4 and ({align = "cl", offset = {x = -0.1, y = 0}, parent = _this}) or ({align = "cr", offset = {x = 0.1, y = 0}, parent = _this})
                LuaNode.prototype.hover(_this)
                if _this.children.alert then
                    _this.children.alert:remove()
                    _this.children.alert = nil
                    if self.key and G.P_TAGS[self.key] then
                        G.P_TAGS[self.key].alerted = true
                    end
                    G:save_progress()
                end
            end
        end
    end
    tag_sprite.stop_hover = function(self, _this)
        _this.hovering = false
        LuaNode.prototype.stop_hover(_this)
        _this.hover_tilt = 0
    end
    tag_sprite:juice_up()
    self.tag_sprite = tag_sprite
    return {tag_sprite_tab, tag_sprite}
end
function Tag.prototype.get_uibox_table(self, tag_sprite, vars_only)
    tag_sprite = tag_sprite or self.tag_sprite
    local name_to_check, loc_vars = self.name, {}
    if name_to_check == "Uncommon Tag" then
    elseif name_to_check == "Investment Tag" then
        loc_vars = {self.config.dollars}
    elseif name_to_check == "Handy Tag" then
        loc_vars = {self.config.dollars_per_hand, self.config.dollars_per_hand * (G.GAME.hands_played or 0)}
    elseif name_to_check == "Garbage Tag" then
        loc_vars = {self.config.dollars_per_discard, self.config.dollars_per_discard * (G.GAME.unused_discards or 0)}
    elseif name_to_check == "Juggle Tag" then
        loc_vars = {self.config.h_size}
    elseif name_to_check == "Top-up Tag" then
        loc_vars = {self.config.spawn_jokers}
    elseif name_to_check == "Skip Tag" then
        loc_vars = {self.config.skip_bonus, self.config.skip_bonus * ((G.GAME.skips or 0) + 1)}
    elseif name_to_check == "Orbital Tag" then
        loc_vars = {
            self.ability.orbital_hand == "[" .. tostring(localize(_G, "k_poker_hand")) .. "]" and self.ability.orbital_hand or localize(_G, self.ability.orbital_hand, "poker_hands"),
            self.config.levels
        }
    elseif name_to_check == "Economy Tag" then
        loc_vars = {self.config.max}
    end
    if vars_only then
        return loc_vars
    end
    tag_sprite.ability_UIBox_table = generate_card_ui(
        _G,
        G.P_TAGS[self.key],
        nil,
        loc_vars,
        self.hide_ability and "Undiscovered" or "Tag",
        nil,
        self.hide_ability,
        nil,
        nil,
        self
    )
    return tag_sprite
end
function Tag.prototype.remove_from_game(self)
    local tag_key = nil
    for k, v in pairs(G.GAME.tags) do
        if v == self then
            tag_key = k
        end
    end
    table.remove(G.GAME.tags, tag_key)
end
function Tag.prototype.remove(self)
    self:remove_from_game()
    local HUD_tag_key = nil
    for k, v in pairs(G.HUD_tags) do
        if v == self.HUD_tag then
            HUD_tag_key = k
        end
    end
    if HUD_tag_key then
        if G.HUD_tags and G.HUD_tags[HUD_tag_key + 1] then
            if HUD_tag_key == 1 then
                G.HUD_tags[HUD_tag_key + 1]:set_alignment({type = "bri", offset = {x = 0.7, y = 0}, xy_bond = "Weak", major = G.ROOM_ATTACH})
            else
                G.HUD_tags[HUD_tag_key + 1]:set_role({xy_bond = "Weak", major = G.HUD_tags[HUD_tag_key - 1]})
            end
        end
        table.remove(G.HUD_tags, HUD_tag_key)
    end
    self.HUD_tag:remove()
end
