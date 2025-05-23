local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
Back = __TS__Class()
Back.name = "Back"
__TS__ClassExtends(Back, LuaObject)
function Back.prototype.____constructor(self)
    LuaObject.prototype.____constructor(self)
    if not selected_back then
        selected_back = G.P_CENTERS.b_red
    end
    self.atlas = selected_back.unlocked and selected_back.atlas or nil
    self.name = selected_back.name or "Red Deck"
    self.effect = {
        center = selected_back,
        text_UI = "",
        config = copy_table(_G, selected_back.config)
    }
    self.loc_name = localize(_G, {type = "name_text", set = "Back", key = self.effect.center.key})
    local pos = self.effect.center.unlocked and self.effect.center.pos or ({x = 4, y = 0})
    self.pos = self.pos or ({})
    self.pos.x = pos.x
    self.pos.y = pos.y
end
function Back.prototype.get_name(self)
    if self.effect.center.unlocked then
        return self.loc_name
    else
        return localize(_G, "k_locked")
    end
end
function Back.prototype.generate_UI(self, other, ui_scale, min_dims, challenge)
    min_dims = min_dims or 0.7
    ui_scale = ui_scale or 0.9
    local back_config = other or self.effect.center
    local name_to_check = other and other.name or self.name
    local effect_config = other and other.config or self.effect.config
    challenge = G.CHALLENGES[get_challenge_int_from_id(_G, challenge or "") or ""] or ({name = "ERROR"})
    local loc_args, loc_nodes = nil, {}
    if not back_config.unlocked then
        local localized_by_smods
        local key_override
        if back_config.locked_loc_vars and type(back_config.locked_loc_vars) == "function" then
            local res = back_config:locked_loc_vars() or ({})
            loc_args = res.vars or ({})
            key_override = res.key
        end
        if G.localization.descriptions.Back[key_override or back_config.key].unlock_parsed then
            localize(_G, {
                type = "unlocks",
                key = key_override or back_config.key,
                set = "Back",
                nodes = loc_nodes,
                vars = loc_args
            })
            localized_by_smods = true
        end
        if not back_config.unlock_condition then
            if not localized_by_smods then
                localize(_G, {
                    type = "descriptions",
                    key = "demo_locked",
                    set = "Other",
                    nodes = loc_nodes,
                    vars = loc_args
                })
            end
        elseif back_config.unlock_condition.type == "win_deck" then
            local other_name = localize(_G, "k_unknown")
            if G.P_CENTERS[back_config.unlock_condition.deck].unlocked then
                other_name = localize(_G, {type = "name_text", set = "Back", key = back_config.unlock_condition.deck})
            end
            loc_args = loc_args or ({other_name})
            localize(_G, {
                type = "descriptions",
                key = "deck_locked_win",
                set = "Other",
                nodes = loc_nodes,
                vars = loc_args
            })
        elseif back_config.unlock_condition.type == "discover_amount" then
            loc_args = loc_args or ({tostring(back_config.unlock_condition.amount)})
            localize(_G, {
                type = "descriptions",
                key = "deck_locked_discover",
                set = "Other",
                nodes = loc_nodes,
                vars = loc_args
            })
        elseif back_config.unlock_condition.type == "win_stake" then
            local other_name = localize(_G, {type = "name_text", set = "Stake", key = G.P_CENTER_POOLS.Stake[back_config.unlock_condition.stake].key})
            loc_args = loc_args or ({
                [1] = other_name,
                colours = {get_stake_col(_G, back_config.unlock_condition.stake)}
            })
            localize(_G, {
                type = "descriptions",
                key = "deck_locked_stake",
                set = "Other",
                nodes = loc_nodes,
                vars = loc_args
            })
        end
    else
        local key_override
        if back_config.loc_vars and type(back_config.loc_vars) == "function" then
            local res = back_config:loc_vars() or ({})
            loc_args = res.vars or ({})
            key_override = res.key
        elseif name_to_check == "Blue Deck" then
            loc_args = {effect_config.hands}
        elseif name_to_check == "Red Deck" then
            loc_args = {effect_config.discards}
        elseif name_to_check == "Yellow Deck" then
            loc_args = {effect_config.dollars}
        elseif name_to_check == "Green Deck" then
            loc_args = {effect_config.extra_hand_bonus, effect_config.extra_discard_bonus}
        elseif name_to_check == "Black Deck" then
            loc_args = {effect_config.joker_slot, -effect_config.hands}
        elseif name_to_check == "Magic Deck" then
            loc_args = {
                localize(_G, {type = "name_text", key = "v_crystal_ball", set = "Voucher"}),
                localize(_G, {type = "name_text", key = "c_fool", set = "Tarot"})
            }
        elseif name_to_check == "Nebula Deck" then
            loc_args = {
                localize(_G, {type = "name_text", key = "v_telescope", set = "Voucher"}),
                -1
            }
        elseif name_to_check == "Ghost Deck" then
        elseif name_to_check == "Abandoned Deck" then
        elseif name_to_check == "Checkered Deck" then
        elseif name_to_check == "Zodiac Deck" then
            loc_args = {
                localize(_G, {type = "name_text", key = "v_tarot_merchant", set = "Voucher"}),
                localize(_G, {type = "name_text", key = "v_planet_merchant", set = "Voucher"}),
                localize(_G, {type = "name_text", key = "v_overstock_norm", set = "Voucher"})
            }
        elseif name_to_check == "Painted Deck" then
            loc_args = {effect_config.hand_size, effect_config.joker_slot}
        elseif name_to_check == "Anaglyph Deck" then
            loc_args = {localize(_G, {type = "name_text", key = "tag_double", set = "Tag"})}
        elseif name_to_check == "Plasma Deck" then
            loc_args = {effect_config.ante_scaling}
        elseif name_to_check == "Erratic Deck" then
        end
        localize(_G, {
            type = "descriptions",
            key = key_override or back_config.key,
            set = "Back",
            nodes = loc_nodes,
            vars = loc_args
        })
    end
    return {
        n = G.UIT.ROOT,
        config = {
            align = "cm",
            minw = min_dims * 5,
            minh = min_dims * 2.5,
            id = self.name,
            colour = G.C.CLEAR
        },
        nodes = {name_to_check == "Challenge Deck" and UIBox_button(
            _G,
            {
                button = "deck_view_challenge",
                label = {localize(_G, challenge.id, "challenge_names")},
                minw = 2.2,
                minh = 1,
                scale = 0.6,
                id = challenge
            }
        ) or desc_from_rows(_G, loc_nodes, true, min_dims * 5)}
    }
end
function Back.prototype.change_to(self, new_back)
    if not new_back then
        new_back = G.P_CENTERS.b_red
    end
    self.atlas = new_back.unlocked and new_back.atlas or nil
    self.name = new_back.name or "Red Deck"
    self.effect = {
        center = new_back,
        text_UI = "",
        config = copy_table(_G, new_back.config)
    }
    self.loc_name = localize(_G, {type = "name_text", set = "Back", key = self.effect.center.key})
    local pos = self.effect.center.unlocked and copy_table(_G, new_back.pos) or ({x = 4, y = 0})
    self.pos.x = pos.x
    self.pos.y = pos.y
end
function Back.prototype.save(self)
    local backTable = {name = self.name, pos = self.pos, effect = self.effect, key = self.effect.center.key or "b_red"}
    return backTable
end
function Back.prototype.trigger_effect(self, args)
    if not args then
        return
    end
    local obj = self.effect.center
    if type(obj.calculate) == "function" then
        local o = {obj:calculate(self, args)}
        if ({next(o)}) ~= nil then
            return {unpack(o)}
        end
    elseif type(obj.trigger_effect) == "function" then
        local o = {obj:trigger_effect(args)}
        if ({next(o)}) ~= nil then
            sendWarnMessage(
                _G,
                ("Found `trigger_effect` function on SMODS.Back object \"%s\". This field is deprecated; please use `calculate` instead."):format(obj.key),
                "Back"
            )
            return {unpack(o)}
        end
    end
    if self.name == "Anaglyph Deck" and args.context == "eval" and G.GAME.last_blind and G.GAME.last_blind.boss then
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                add_tag(
                    _G,
                    Tag(_G, "tag_double")
                )
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
            end}
        ))
    end
    if self.name == "Plasma Deck" and args.context == "blind_amount" then
        return
    end
    if self.name == "Plasma Deck" and args.context == "final_scoring_step" then
        local tot = args.chips + args.mult
        args.chips = math.floor(tot / 2)
        args.mult = math.floor(tot / 2)
        update_hand_text(_G, {delay = 0}, {mult = args.mult, chips = args.chips})
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                local text = localize(_G, "k_balanced")
                play_sound(_G, "gong", 0.94, 0.3)
                play_sound(_G, "gong", 0.94 * 1.5, 0.2)
                play_sound(_G, "tarot1", 1.5)
                ease_colour(_G, G.C.UI_CHIPS, {0.8, 0.45, 0.85, 1})
                ease_colour(_G, G.C.UI_MULT, {0.8, 0.45, 0.85, 1})
                attention_text(_G, {
                    scale = 1.4,
                    text = text,
                    hold = 2,
                    align = "cm",
                    offset = {x = 0, y = -2.7},
                    major = G.play
                })
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "after",
                        blockable = false,
                        blocking = false,
                        delay = 4.3,
                        func = function(self)
                            ease_colour(_G, G.C.UI_CHIPS, G.C.BLUE, 2)
                            ease_colour(_G, G.C.UI_MULT, G.C.RED, 2)
                            return true
                        end
                    }
                ))
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "after",
                        blockable = false,
                        blocking = false,
                        no_delete = true,
                        delay = 6.3,
                        func = function(self)
                            local ____temp_0 = {G.C.BLUE[2], G.C.BLUE[3], G.C.BLUE[4], G.C.BLUE[5]}
                            G.C.UI_CHIPS[2] = ____temp_0[1]
                            G.C.UI_CHIPS[3] = ____temp_0[2]
                            G.C.UI_CHIPS[4] = ____temp_0[3]
                            G.C.UI_CHIPS[5] = ____temp_0[4]
                            local ____temp_1 = {G.C.RED[2], G.C.RED[3], G.C.RED[4], G.C.RED[5]}
                            G.C.UI_MULT[2] = ____temp_1[1]
                            G.C.UI_MULT[3] = ____temp_1[2]
                            G.C.UI_MULT[4] = ____temp_1[3]
                            G.C.UI_MULT[5] = ____temp_1[4]
                            return true
                        end
                    }
                ))
                return true
            end}
        ))
        delay(_G, 0.6)
        return {args.chips, args.mult}
    end
end
function Back.prototype.apply_to_run(self)
    local obj = self.effect.center
    if obj.apply and type(obj.apply) == "function" then
        obj:apply(self)
    end
    if self.effect.config.jokers then
        delay(_G, 0.4)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                for k, v in ipairs(self.effect.config.jokers) do
                    local card = create_card(
                        _G,
                        "Joker",
                        G.jokers,
                        nil,
                        nil,
                        nil,
                        nil,
                        v,
                        "deck"
                    )
                    card:add_to_deck()
                    G.jokers:emplace(card)
                    card:start_materialize()
                end
                return true
            end}
        ))
    end
    if self.effect.config.voucher then
        G.GAME.used_vouchers[self.effect.config.voucher] = true
        G.GAME.starting_voucher_count = (G.GAME.starting_voucher_count or 0) + 1
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                Card:apply_to_run(nil, G.P_CENTERS[self.effect.config.voucher])
                return true
            end}
        ))
    end
    if self.effect.config.hands then
        G.GAME.starting_params.hands = G.GAME.starting_params.hands + self.effect.config.hands
    end
    if self.effect.config.consumables then
        delay(_G, 0.4)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                for k, v in ipairs(self.effect.config.consumables) do
                    local card = create_card(
                        _G,
                        "Tarot",
                        G.consumeables,
                        nil,
                        nil,
                        nil,
                        nil,
                        v,
                        "deck"
                    )
                    card:add_to_deck()
                    G.consumeables:emplace(card)
                end
                return true
            end}
        ))
    end
    if self.effect.config.dollars then
        G.GAME.starting_params.dollars = G.GAME.starting_params.dollars + self.effect.config.dollars
    end
    if self.effect.config.remove_faces then
        G.GAME.starting_params.no_faces = true
    end
    if self.effect.config.spectral_rate then
        G.GAME.spectral_rate = self.effect.config.spectral_rate
    end
    if self.effect.config.discards then
        G.GAME.starting_params.discards = G.GAME.starting_params.discards + self.effect.config.discards
    end
    if self.effect.config.reroll_discount then
        G.GAME.starting_params.reroll_cost = G.GAME.starting_params.reroll_cost - self.effect.config.reroll_discount
    end
    if self.effect.config.edition then
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                local i = 0
                while i < self.effect.config.edition_count do
                    local card = pseudorandom_element(
                        _G,
                        G.playing_cards,
                        pseudoseed(_G, "edition_deck")
                    )
                    if not card.edition then
                        i = i + 1
                        card:set_edition({[self.effect.config.edition] = true}, nil, true)
                    end
                end
                return true
            end}
        ))
    end
    if self.effect.config.vouchers then
        for k, v in pairs(self.effect.config.vouchers) do
            G.GAME.used_vouchers[v] = true
            G.GAME.starting_voucher_count = (G.GAME.starting_voucher_count or 0) + 1
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {func = function(self)
                    Card:apply_to_run(nil, G.P_CENTERS[v])
                    return true
                end}
            ))
        end
    end
    if self.name == "Checkered Deck" then
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                for k, v in pairs(G.playing_cards) do
                    if v.base.suit == "Clubs" then
                        v:change_suit("Spades")
                    end
                    if v.base.suit == "Diamonds" then
                        v:change_suit("Hearts")
                    end
                end
                return true
            end}
        ))
    end
    if self.effect.config.randomize_rank_suit then
        G.GAME.starting_params.erratic_suits_and_ranks = true
    end
    if self.effect.config.joker_slot then
        G.GAME.starting_params.joker_slots = G.GAME.starting_params.joker_slots + self.effect.config.joker_slot
    end
    if self.effect.config.hand_size then
        G.GAME.starting_params.hand_size = G.GAME.starting_params.hand_size + self.effect.config.hand_size
    end
    if self.effect.config.ante_scaling then
        G.GAME.starting_params.ante_scaling = self.effect.config.ante_scaling
    end
    if self.effect.config.consumable_slot then
        G.GAME.starting_params.consumable_slots = G.GAME.starting_params.consumable_slots + self.effect.config.consumable_slot
    end
    if self.effect.config.no_interest then
        G.GAME.modifiers.no_interest = true
    end
    if self.effect.config.extra_hand_bonus then
        G.GAME.modifiers.money_per_hand = self.effect.config.extra_hand_bonus
    end
    if self.effect.config.extra_discard_bonus then
        G.GAME.modifiers.money_per_discard = self.effect.config.extra_discard_bonus
    end
end
function Back.prototype.load(self, backTable)
    self.name = backTable.name
    self.pos = backTable.pos
    self.effect = backTable.effect
    self.effect.center = G.P_CENTERS[backTable.key] or G.P_CENTERS.b_red
    self.loc_name = localize(_G, {type = "name_text", set = "Back", key = self.effect.center.key})
end
