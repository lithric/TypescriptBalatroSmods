local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local __TS__Unpack = ____lualib.__TS__Unpack
function GET_TEXT_FROM_INPUT(self)
    local new_text = ""
    local hook = G.CONTROLLER.text_input_hook
    do
        local i = 1
        while i <= hook.children.length do
            if hook.children[i].config and hook.children[i].config.id:sub(
                1,
                8 + string.len(G.CONTROLLER.text_input_id)
            ) == tostring(G.CONTROLLER.text_input_id) .. "_letter_" and hook.children[i].config.text ~= "" then
                new_text = new_text .. tostring(hook.children[i].config.text)
            end
            i = i + 1
        end
    end
    return new_text
end
function MODIFY_TEXT_INPUT(self, args)
    args = args or ({})
    if args.delete and args.pos > 0 then
        if args.pos >= args.text_table.letters.length then
            args.text_table.letters[args.pos] = ""
        else
            args.text_table.letters[args.pos] = args.text_table.letters[args.pos + 1]
            MODIFY_TEXT_INPUT(_G, {letter = args.letter, text_table = args.text_table, pos = args.pos + 1, delete = args.delete})
        end
        return
    end
    local swapped_letter = args.text_table.letters[args.pos]
    args.text_table.letters[args.pos] = args.letter
    if swapped_letter and swapped_letter ~= "" then
        MODIFY_TEXT_INPUT(_G, {letter = swapped_letter, text_table = args.text_table, pos = args.pos + 1})
    end
end
function TRANSPOSE_TEXT_INPUT(self, amount)
    local position_child = nil
    local hook = G.CONTROLLER.text_input_hook
    local text = G.CONTROLLER.text_input_hook.config.ref_table.text
    do
        local i = 1
        while i <= hook.children.length do
            if hook.children[i].config then
                if hook.children[i].config.id == tostring(G.CONTROLLER.text_input_id) .. "_position" then
                    position_child = i
                    break
                end
            end
            i = i + 1
        end
    end
    local dir = amount / math.abs(amount) or 0
    while amount ~= 0 do
        if position_child + dir < 1 or position_child + dir >= hook.children.length then
            break
        end
        local real_letter = hook.children[position_child + dir].config.id:sub(
            1,
            8 + string.len(G.CONTROLLER.text_input_id)
        ) == tostring(G.CONTROLLER.text_input_id) .. "_letter_" and hook.children[position_child + dir].config.text ~= ""
        SWAP(_G, hook.children, position_child, position_child + dir)
        if real_letter then
            amount = amount - dir
        end
        position_child = position_child + dir
    end
    text.current_position = math.min(
        position_child - 1,
        string.len(text.ref_table[text.ref_value])
    )
    hook.UIBox:recalculate(true)
    text.ref_table[text.ref_value] = GET_TEXT_FROM_INPUT(_G)
end
function INIT_COLLECTION_CARD_ALERTS(self)
    do
        local j = 1
        while j <= G.your_collection.length do
            for _, v in ipairs(G.your_collection[j].cards) do
                v:update_alert()
            end
            j = j + 1
        end
    end
end
function scale_number(self, number, scale, max, e_switch_point)
    G.E_SWITCH_POINT = G.E_SWITCH_POINT or 100000000000
    if not number or type(number) ~= "number" then
        return scale
    end
    if not max then
        max = 10000
    end
    if math.abs(number) >= (e_switch_point or G.E_SWITCH_POINT) then
        scale = scale * math.floor(math.log(max * 10, 10)) / math.floor(math.log(1000000 * 10, 10))
    elseif number >= max then
        scale = scale * math.floor(math.log(max * 10, 10)) / math.floor(math.log(number * 10, 10))
    end
    return scale
end
G.FUNCS.tut_next = function(self, e)
    if G.OVERLAY_TUTORIAL then
        G.OVERLAY_TUTORIAL.Jimbo:remove_button()
        G.OVERLAY_TUTORIAL.Jimbo:remove_speech_bubble()
        G.OVERLAY_TUTORIAL.step_complete = false
        G.OVERLAY_TUTORIAL.step = G.OVERLAY_TUTORIAL.step + 1
    end
end
G.FUNCS.blueprint_compat = function(self, e)
    if e.config.ref_table.ability.blueprint_compat ~= e.config.ref_table.ability.blueprint_compat_check then
        if e.config.ref_table.ability.blueprint_compat == "compatible" then
            e.config.colour = mix_colours(_G, G.C.GREEN, G.C.JOKER_GREY, 0.8)
        elseif e.config.ref_table.ability.blueprint_compat == "incompatible" then
            e.config.colour = mix_colours(_G, G.C.RED, G.C.JOKER_GREY, 0.8)
        end
        e.config.ref_table.ability.blueprint_compat_ui = " " .. tostring(localize(
            _G,
            "k_" .. tostring(e.config.ref_table.ability.blueprint_compat)
        )) .. " "
        e.config.ref_table.ability.blueprint_compat_check = e.config.ref_table.ability.blueprint_compat
    end
end
G.FUNCS.sort_hand_suit = function(self, e)
    G.hand:sort("suit desc")
    play_sound(_G, "paper1")
end
G.FUNCS.sort_hand_value = function(self, e)
    G.hand:sort("desc")
    play_sound(_G, "paper1")
end
G.FUNCS.can_buy = function(self, e)
    if e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at and e.config.ref_table.cost > 0 then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.ORANGE
        e.config.button = "buy_from_shop"
    end
    if e.config.ref_parent and e.config.ref_parent.children.buy_and_use then
        if e.config.ref_parent.children.buy_and_use.states.visible then
            e.UIBox.alignment.offset.y = -0.6
        else
            e.UIBox.alignment.offset.y = 0
        end
    end
end
G.FUNCS.can_buy_and_use = function(self, e)
    if e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at and e.config.ref_table.cost > 0 or not e.config.ref_table:can_use_consumeable() then
        e.UIBox.states.visible = false
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        if e.config.ref_table.highlighted then
            e.UIBox.states.visible = true
        end
        e.config.colour = G.C.SECONDARY_SET.Voucher
        e.config.button = "buy_from_shop"
    end
end
G.FUNCS.can_redeem = function(self, e)
    if e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.GREEN
        e.config.button = "use_card"
    end
end
G.FUNCS.can_open = function(self, e)
    if e.config.ref_table.cost > 0 and e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.GREEN
        e.config.button = "use_card"
    end
end
G.FUNCS.HUD_blind_visible = function(self, e)
    if G.GAME.blind and (G.GAME.blind.name ~= "" and G.GAME.blind.blind_set) then
        G.GAME.blind.states.visible = true
    elseif G.GAME.blind then
        G.GAME.blind.states.visible = false
    end
end
G.FUNCS.HUD_blind_debuff = function(self, e)
    if G.GAME.blind and G.GAME.blind.loc_debuff_text and G.GAME.blind.loc_debuff_text ~= "" then
        if e.parent.config.minh == 0 or e.config.prev_loc ~= G.GAME.blind.loc_debuff_text then
            e.parent.config.minh = 0.35
            e.config.scale = 0.36
            if G.GAME.blind.loc_debuff_lines[e.config.ref_value] == "" then
                e.config.scale = 0
                e.parent.config.minh = 0.001
            end
            e.config.prev_loc = G.GAME.blind.loc_debuff_text
            e.UIBox:recalculate(true)
        end
    else
        if e.parent.config.minh > 0 then
            e.parent.config.minh = 0
            e.config.scale = 0
            e.UIBox:recalculate(true)
        end
    end
end
G.FUNCS.HUD_blind_debuff_prefix = function(self, e)
    if G.GAME.blind and G.GAME.blind.name == "The Wheel" and not G.GAME.blind.disabled or e.config.id == "bl_wheel" then
        e.config.ref_table.val = "" .. tostring(G.GAME.probabilities.normal)
        e.config.scale = 0.32
    else
        e.config.ref_table.val = ""
        e.config.scale = 0
    end
end
G.FUNCS.HUD_blind_reward = function(self, e)
    if G.GAME.modifiers.no_blind_reward and (G.GAME.blind and G.GAME.modifiers.no_blind_reward[G.GAME.blind:get_type()]) then
        if e.config.minh > 0.44 then
            e.config.minh = 0.4
            e.children[1].config.text = localize(_G, "k_no_reward")
            e.UIBox:recalculate(true)
        end
    else
        if e.config.minh < 0.45 then
            e.config.minh = 0.45
            e.children[1].config.text = tostring(localize(_G, "k_reward")) .. ": "
            e.children[2].states.visible = true
            e.UIBox:recalculate(true)
        end
    end
end
G.FUNCS.can_continue = function(self, e)
    if e.config.func then
        local _can_continue = nil
        local savefile = love.filesystem.getInfo(tostring(G.SETTINGS.profile) .. "/" .. "save.jkr")
        if savefile == nil then
            e.config.colour = G.C.UI.BACKGROUND_INACTIVE
            e.config.button = nil
        else
            if not G.SAVED_GAME then
                G.SAVED_GAME = get_compressed(
                    _G,
                    tostring(G.SETTINGS.profile) .. "/" .. "save.jkr"
                )
                if G.SAVED_GAME ~= nil then
                    G.SAVED_GAME = STR_UNPACK(_G, G.SAVED_GAME)
                end
                if G.SAVED_GAME == nil then
                    e.config.colour = G.C.UI.BACKGROUND_INACTIVE
                    e.config.button = nil
                    return _can_continue
                end
            end
            if not G.SAVED_GAME.VERSION or G.SAVED_GAME.VERSION < "0.9.2" then
                e.config.colour = G.C.UI.BACKGROUND_INACTIVE
                e.config.button = nil
            else
                _can_continue = true
            end
        end
        e.config.func = nil
        return _can_continue
    end
end
G.FUNCS.can_load_profile = function(self, e)
    if G.SETTINGS.profile == G.focused_profile then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.BLUE
        e.config.button = "load_profile"
    end
end
G.FUNCS.load_profile = function(self, delete_prof_data)
    G.SAVED_GAME = nil
    G.E_MANAGER:clear_queue()
    G.FUNCS:wipe_on()
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            func = function(self)
                G:delete_run()
                local _name = nil
                if G.PROFILES[G.focused_profile + 1].name and G.PROFILES[G.focused_profile + 1].name ~= "" then
                    _name = G.PROFILES[G.focused_profile + 1].name
                end
                if delete_prof_data then
                    G.PROFILES[G.focused_profile + 1] = {}
                end
                G.DISCOVER_TALLIES = nil
                G.PROGRESS = nil
                G:load_profile(G.focused_profile)
                G.PROFILES[G.focused_profile + 1].name = _name
                G:init_item_prototypes()
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            blockable = true,
            blocking = false,
            func = function(self)
                G:main_menu()
                G.FILE_HANDLER.force = true
                return true
            end
        }
    ))
    G.FUNCS:wipe_off()
end
G.FUNCS.can_delete_profile = function(self, e)
    G.CHECK_PROFILE_DATA = G.CHECK_PROFILE_DATA or love.filesystem.getInfo(tostring(G.focused_profile) .. "/" .. "profile.jkr")
    if not G.CHECK_PROFILE_DATA or e.config.disable_button then
        G.CHECK_PROFILE_DATA = false
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.RED
        e.config.button = "delete_profile"
    end
end
G.FUNCS.delete_profile = function(self, e)
    local warning_text = e.UIBox:get_UIE_by_ID("warning_text")
    if warning_text.config.colour ~= G.C.WHITE then
        warning_text:juice_up()
        warning_text.config.colour = G.C.WHITE
        warning_text.config.shadow = true
        e.config.disable_button = true
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.06,
                blockable = false,
                blocking = false,
                func = function(self)
                    play_sound(_G, "tarot2", 0.76, 0.4)
                    return true
                end
            }
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.35,
                blockable = false,
                blocking = false,
                func = function(self)
                    e.config.disable_button = nil
                    return true
                end
            }
        ))
        play_sound(_G, "tarot2", 1, 0.4)
    else
        love.filesystem.remove(tostring(G.focused_profile) .. "/" .. "profile.jkr")
        love.filesystem.remove(tostring(G.focused_profile) .. "/" .. "save.jkr")
        love.filesystem.remove(tostring(G.focused_profile) .. "/" .. "meta.jkr")
        love.filesystem.remove(tostring(G.focused_profile) .. "/" .. "unlock_notify.jkr")
        love.filesystem.remove(tostring(G.focused_profile) .. "")
        G.SAVED_GAME = nil
        G.DISCOVER_TALLIES = nil
        G.PROGRESS = nil
        G.PROFILES[G.focused_profile + 1] = {}
        if G.focused_profile == G.SETTINGS.profile then
            G.FUNCS:load_profile(true)
        else
            local tab_but = G.OVERLAY_MENU:get_UIE_by_ID("tab_but_" .. tostring(G.focused_profile))
            G.FUNCS:change_tab(tab_but)
        end
    end
end
G.FUNCS.can_unlock_all = function(self, e)
    if G.PROFILES[G.SETTINGS.profile + 1].all_unlocked or e.config.disable_button then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.GREY
        e.config.button = "unlock_all"
    end
end
G.FUNCS.unlock_all = function(self, e)
    local _infotip_object = G.OVERLAY_MENU:get_UIE_by_ID("overlay_menu_infotip")
    if not _infotip_object.config.set and not G.F_NO_ACHIEVEMENTS then
        _infotip_object.config.object:remove()
        _infotip_object.config.object = __TS__New(
            UIBox,
            {
                definition = overlay_infotip(
                    _G,
                    localize(_G, G.F_TROPHIES and "ml_unlock_all_trophies" or "ml_unlock_all_explanation")
                ),
                config = {offset = {x = 0, y = 0}, align = "bm", parent = _infotip_object}
            }
        )
        _infotip_object.config.object.UIRoot:juice_up()
        _infotip_object.config.set = true
        e.config.disable_button = true
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.06,
                blockable = false,
                blocking = false,
                func = function(self)
                    play_sound(_G, "tarot2", 0.76, 0.4)
                    return true
                end
            }
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.35,
                blockable = false,
                blocking = false,
                func = function(self)
                    e.config.disable_button = nil
                    return true
                end
            }
        ))
        play_sound(_G, "tarot2", 1, 0.4)
    else
        G.PROFILES[G.SETTINGS.profile + 1].all_unlocked = true
        for k, v in pairs(G.P_CENTERS) do
            if not v.demo and not v.wip then
                v.alerted = true
                v.discovered = true
                v.unlocked = true
            end
        end
        for k, v in pairs(G.P_BLINDS) do
            if not v.demo and not v.wip then
                v.alerted = true
                v.discovered = true
                v.unlocked = true
            end
        end
        for k, v in pairs(G.P_TAGS) do
            if not v.demo and not v.wip then
                v.alerted = true
                v.discovered = true
                v.unlocked = true
            end
        end
        set_profile_progress(_G)
        set_discover_tallies(_G)
        G:save_progress()
        G.FILE_HANDLER.force = true
        local tab_but = G.OVERLAY_MENU:get_UIE_by_ID("tab_but_" .. tostring(G.focused_profile))
        G.FUNCS:change_tab(tab_but)
    end
end
G.FUNCS.high_score_alert = function(self, e)
    if e.config.id and not e.children.alert then
        if G.GAME.round_scores[e.config.id] and G.GAME.round_scores[e.config.id].high_score then
            e.children.alert = __TS__New(
                UIBox,
                {
                    definition = create_UIBox_card_alert(
                        _G,
                        {
                            no_bg = true,
                            text = localize(_G, "k_high_score_ex"),
                            scale = 0.3
                        }
                    ),
                    config = {
                        instance_type = "ALERT",
                        align = "tri",
                        offset = {x = 0.3, y = -0.18},
                        major = e,
                        parent = e
                    }
                }
            )
            e.children.alert.states.collide.can = false
        end
    end
end
G.FUNCS.beta_lang_alert = function(self, e)
    if not e.children.alert then
        if e.config.ref_table and e.config.ref_table.beta then
            e.children.alert = __TS__New(
                UIBox,
                {
                    definition = create_UIBox_card_alert(_G, {no_bg = true, text = "BETA", scale = 0.35}),
                    config = {
                        instance_type = "ALERT",
                        align = "tri",
                        offset = {x = 0.07, y = -0.07},
                        major = e,
                        parent = e
                    }
                }
            )
            e.children.alert.states.collide.can = false
        end
    end
end
G.FUNCS.set_button_pip = function(self, e)
    if G.CONTROLLER.HID.controller and e.config.focus_args and not e.children.button_pip then
        e.children.button_pip = __TS__New(
            UIBox,
            {
                definition = create_button_binding_pip(_G, {button = e.config.focus_args.button, scale = e.config.focus_args.scale}),
                config = {align = e.config.focus_args.orientation or "cr", offset = e.config.focus_args.offset or e.config.focus_args.orientation == "bm" and ({x = 0, y = 0.02}) or ({x = 0.1, y = 0.02}), major = e, parent = e}
            }
        )
        e.children.button_pip.states.collide.can = false
    end
    if not G.CONTROLLER.HID.controller and e.children.button_pip then
        e.children.button_pip:remove()
        e.children.button_pip = nil
    end
end
G.FUNCS.flash = function(self, e)
    if G.CONTROLLER.text_input_hook and G.CONTROLLER.text_input_id == e.config.id:sub(
        1,
        string.len(G.CONTROLLER.text_input_id)
    ) then
        if math.floor(G.TIMERS.REAL * 2) % 2 == 1 then
            e.config.colour[4] = 0
        else
            e.config.colour[4] = 1
        end
        if e.config.w ~= 0.1 then
            e.config.w = 0.1
            e.UIBox:recalculate(true)
        end
    else
        e.config.colour[4] = 0
        if e.config.w ~= 0 then
            e.config.w = 0
            e.UIBox:recalculate(true)
        end
    end
end
G.FUNCS.pip_dynatext = function(self, e)
    if "pip_" .. tostring(e.config.ref_table.focused_string) == e.config.id then
        if e.config.pip_state ~= 1 then
            e.config.colour = e.config.pipcol1
            e.config.pip_state = 1
        end
    elseif e.config.pip_state ~= 2 then
        e.config.colour = e.config.pipcol2
        e.config.pip_state = 2
    end
end
G.FUNCS.toggle_button = function(self, e)
    e.config.ref_table.ref_table[e.config.ref_table.ref_value] = not e.config.ref_table.ref_table[e.config.ref_table.ref_value]
    if e.config.toggle_callback then
        e.config:toggle_callback(e.config.ref_table.ref_table[e.config.ref_table.ref_value])
    end
end
G.FUNCS.toggle = function(self, e)
    if not e.config.ref_table.ref_table[e.config.ref_table.ref_value] and e.config.toggle_active then
        e.config.toggle_active = nil
        e.config.colour = e.config.ref_table.inactive_colour
        e.children[1].states.visible = false
        e.children[1].config.object.states.visible = false
    elseif e.config.ref_table.ref_table[e.config.ref_table.ref_value] and not e.config.toggle_active then
        e.config.toggle_active = true
        e.config.colour = e.config.ref_table.active_colour
        e.children[1].states.visible = true
        e.children[1].config.object.states.visible = true
    end
end
G.FUNCS.slider = function(self, e)
    local c = e.children[1]
    e.states.drag.can = true
    c.states.drag.can = true
    if G.CONTROLLER and G.CONTROLLER.dragging.target and (G.CONTROLLER.dragging.target == e or G.CONTROLLER.dragging.target == c) then
        local rt = c.config.ref_table
        rt.ref_table[rt.ref_value] = math.min(
            rt.max,
            math.max(rt.min, rt.min + (rt.max - rt.min) * (G.CURSOR.T.x - e.parent.T.x - G.ROOM.T.x) / e.T.w)
        )
        rt.text = string.format(
            "%." .. tostring(rt.decimal_places) .. "f",
            rt.ref_table[rt.ref_value]
        )
        c.T.w = (rt.ref_table[rt.ref_value] - rt.min) / (rt.max - rt.min) * rt.w
        c.config.w = c.T.w
        if rt.callback then
            local ____self_0 = G.FUNCS
            ____self_0[rt.callback](____self_0, rt)
        end
    end
end
G.FUNCS.slider_descreet = function(self, e, per)
    local c = e.children[1]
    e.states.drag.can = true
    c.states.drag.can = true
    if per then
        local rt = c.config.ref_table
        rt.ref_table[rt.ref_value] = math.min(
            rt.max,
            math.max(rt.min, rt.ref_table[rt.ref_value] + per * (rt.max - rt.min))
        )
        rt.text = string.format(
            "%." .. tostring(rt.decimal_places) .. "f",
            rt.ref_table[rt.ref_value]
        )
        c.T.w = (rt.ref_table[rt.ref_value] - rt.min) / (rt.max - rt.min) * rt.w
        c.config.w = c.T.w
    end
end
G.FUNCS.option_cycle = function(self, e)
    local from_val = e.config.ref_table.options[e.config.ref_table.current_option]
    local from_key = e.config.ref_table.current_option
    local old_pip = e.UIBox:get_UIE_by_ID(
        "pip_" .. tostring(e.config.ref_table.current_option),
        e.parent.parent
    )
    local cycle_main = e.UIBox:get_UIE_by_ID("cycle_main", e.parent.parent)
    if cycle_main and cycle_main.config.h_popup then
        cycle_main:stop_hover()
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                cycle_main:hover()
                return true
            end}
        ))
    end
    if e.config.ref_value == "l" then
        e.config.ref_table.current_option = e.config.ref_table.current_option - 1
        if e.config.ref_table.current_option <= 0 then
            e.config.ref_table.current_option = e.config.ref_table.options.length
        end
    else
        e.config.ref_table.current_option = e.config.ref_table.current_option + 1
        if e.config.ref_table.current_option > e.config.ref_table.options.length then
            e.config.ref_table.current_option = 1
        end
    end
    local to_val = e.config.ref_table.options[e.config.ref_table.current_option]
    local to_key = e.config.ref_table.current_option
    e.config.ref_table.current_option_val = e.config.ref_table.options[e.config.ref_table.current_option]
    local new_pip = e.UIBox:get_UIE_by_ID(
        "pip_" .. tostring(e.config.ref_table.current_option),
        e.parent.parent
    )
    if old_pip then
        old_pip.config.colour = G.C.BLACK
    end
    if new_pip then
        new_pip.config.colour = G.C.WHITE
    end
    if e.config.ref_table.opt_callback then
        local ____self_1 = G.FUNCS
        ____self_1[e.config.ref_table.opt_callback](____self_1, {
            from_val = from_val,
            to_val = to_val,
            from_key = from_key,
            to_key = to_key,
            cycle_config = e.config.ref_table
        })
    end
end
G.FUNCS.test_framework_cycle_callback = function(self, args)
    args = args or ({})
    if args.cycle_config and args.cycle_config.ref_table and args.cycle_config.ref_value then
        args.cycle_config.ref_table[args.cycle_config.ref_value] = args.to_val
    end
end
G.FUNCS.your_collection_joker_page = function(self, args)
    if not args or not args.cycle_config then
        return
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = G.your_collection[j].cards.length
                while i <= 1 do
                    local c = G.your_collection[j]:remove_card(G.your_collection[j].cards[i])
                    c:remove()
                    c = nil
                    i = i + -1
                end
            end
            j = j + 1
        end
    end
    do
        local i = 1
        while i <= 5 do
            do
                local j = 1
                while j <= G.your_collection.length do
                    local center = G.P_CENTER_POOLS.Joker[i + (j - 1) * 5 + 5 * G.your_collection.length * (args.cycle_config.current_option - 1) + 1]
                    if not center then
                        break
                    end
                    local card = __TS__New(
                        Card,
                        G.your_collection[j].T.x + G.your_collection[j].T.w / 2,
                        G.your_collection[j].T.y,
                        G.CARD_W,
                        G.CARD_H,
                        G.P_CARDS.empty,
                        center
                    )
                    card.sticker = get_joker_win_sticker(_G, center)
                    G.your_collection[j]:emplace(card)
                    j = j + 1
                end
            end
            i = i + 1
        end
    end
    INIT_COLLECTION_CARD_ALERTS(_G)
end
G.FUNCS.your_collection_tarot_page = function(self, args)
    if not args or not args.cycle_config then
        return
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = G.your_collection[j].cards.length
                while i <= 1 do
                    local c = G.your_collection[j]:remove_card(G.your_collection[j].cards[i])
                    c:remove()
                    c = nil
                    i = i + -1
                end
            end
            j = j + 1
        end
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = 1
                while i <= 4 + j do
                    local center = G.P_CENTER_POOLS.Tarot[i + (j - 1) * 5 + 11 * (args.cycle_config.current_option - 1) + 1]
                    if not center then
                        break
                    end
                    local card = __TS__New(
                        Card,
                        G.your_collection[j].T.x + G.your_collection[j].T.w / 2,
                        G.your_collection[j].T.y,
                        G.CARD_W,
                        G.CARD_H,
                        G.P_CARDS.empty,
                        center
                    )
                    card:start_materialize(nil, i > 1 or j > 1)
                    G.your_collection[j]:emplace(card)
                    i = i + 1
                end
            end
            j = j + 1
        end
    end
    INIT_COLLECTION_CARD_ALERTS(_G)
end
G.FUNCS.your_collection_spectral_page = function(self, args)
    if not args or not args.cycle_config then
        return
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = G.your_collection[j].cards.length
                while i <= 1 do
                    local c = G.your_collection[j]:remove_card(G.your_collection[j].cards[i])
                    c:remove()
                    c = nil
                    i = i + -1
                end
            end
            j = j + 1
        end
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = 1
                while i <= 3 + j do
                    local center = G.P_CENTER_POOLS.Spectral[i + (j - 1) * 4 + 9 * (args.cycle_config.current_option - 1) + 1]
                    if not center then
                        break
                    end
                    local card = __TS__New(
                        Card,
                        G.your_collection[j].T.x + G.your_collection[j].T.w / 2,
                        G.your_collection[j].T.y,
                        G.CARD_W,
                        G.CARD_H,
                        G.P_CARDS.empty,
                        center
                    )
                    card:start_materialize(nil, i > 1 or j > 1)
                    G.your_collection[j]:emplace(card)
                    i = i + 1
                end
            end
            j = j + 1
        end
    end
    INIT_COLLECTION_CARD_ALERTS(_G)
end
G.FUNCS.your_collection_booster_page = function(self, args)
    if not args or not args.cycle_config then
        return
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = G.your_collection[j].cards.length
                while i <= 1 do
                    local c = G.your_collection[j]:remove_card(G.your_collection[j].cards[i])
                    c:remove()
                    c = nil
                    i = i + -1
                end
            end
            j = j + 1
        end
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = 1
                while i <= 4 do
                    local center = G.P_CENTER_POOLS.Booster[i + (j - 1) * 4 + 8 * (args.cycle_config.current_option - 1) + 1]
                    if not center then
                        break
                    end
                    local card = __TS__New(
                        Card,
                        G.your_collection[j].T.x + G.your_collection[j].T.w / 2,
                        G.your_collection[j].T.y,
                        G.CARD_W * 1.27,
                        G.CARD_H * 1.27,
                        nil,
                        center
                    )
                    card:start_materialize(nil, i > 1 or j > 1)
                    G.your_collection[j]:emplace(card)
                    i = i + 1
                end
            end
            j = j + 1
        end
    end
    INIT_COLLECTION_CARD_ALERTS(_G)
end
G.FUNCS.your_collection_voucher_page = function(self, args)
    if not args or not args.cycle_config then
        return
    end
    do
        local j = 1
        while j <= G.your_collection.length do
            do
                local i = G.your_collection[j].cards.length
                while i <= 1 do
                    local c = G.your_collection[j]:remove_card(G.your_collection[j].cards[i])
                    c:remove()
                    c = nil
                    i = i + -1
                end
            end
            j = j + 1
        end
    end
    do
        local i = 1
        while i <= 4 do
            do
                local j = 1
                while j <= G.your_collection.length do
                    local center = G.P_CENTER_POOLS.Voucher[i + (j - 1) * 4 + 8 * (args.cycle_config.current_option - 1) + 1]
                    if not center then
                        break
                    end
                    local card = __TS__New(
                        Card,
                        G.your_collection[j].T.x + G.your_collection[j].T.w / 2,
                        G.your_collection[j].T.y,
                        G.CARD_W,
                        G.CARD_H,
                        G.P_CARDS.empty,
                        center
                    )
                    card:start_materialize(nil, i > 1 or j > 1)
                    G.your_collection[j]:emplace(card)
                    j = j + 1
                end
            end
            i = i + 1
        end
    end
    INIT_COLLECTION_CARD_ALERTS(_G)
end
G.FUNCS.change_selected_back = function(self, args)
    G.GAME.selected_back:change_to(G.P_CENTER_POOLS.Back[args.to_key])
end
G.FUNCS.change_viewed_back = function(self, args)
    G.viewed_stake = G.viewed_stake or 1
    local deck_pool = SMODS:collection_pool(G.P_CENTER_POOLS.Back)
    G.GAME.viewed_back:change_to(deck_pool[args.to_key])
    if G.sticker_card then
        G.sticker_card.sticker = get_deck_win_sticker(_G, G.GAME.viewed_back.effect.center)
    end
    local max_stake = get_deck_win_stake(_G, G.GAME.viewed_back.effect.center.key) or 0
    G.viewed_stake = math.min(G.viewed_stake, max_stake + 1)
    G.PROFILES[G.SETTINGS.profile + 1].MEMORY.deck = args.to_val
    for key, val in pairs(G.sticker_card.area.cards) do
        val.children.back = false
        val:set_ability(val.config.center, true)
    end
end
G.FUNCS.change_stake = function(self, args)
    G.viewed_stake = args.to_key
    G.PROFILES[G.SETTINGS.profile + 1].MEMORY.stake = args.to_key
end
G.FUNCS.change_vsync = function(self, args)
    G.SETTINGS.QUEUED_CHANGE.vsync = G.SETTINGS.WINDOW.vsync == 0 and args.to_key == 1 and 1 or G.SETTINGS.WINDOW.vsync == 1 and args.to_key == 2 and 0 or nil
end
G.FUNCS.change_screen_resolution = function(self, args)
    local curr_disp = G.SETTINGS.WINDOW.selected_display
    local to_resolution = G.SETTINGS.WINDOW.DISPLAYS[curr_disp + 1].screen_resolutions.values[args.to_key]
    G.SETTINGS.QUEUED_CHANGE.screenres = {w = to_resolution.w, h = to_resolution.h}
end
G.FUNCS.change_screenmode = function(self, args)
    G.ARGS.screenmode_vals = G.ARGS.screenmode_vals or ({"Windowed", "Fullscreen", "Borderless"})
    G.SETTINGS.QUEUED_CHANGE.screenmode = G.ARGS.screenmode_vals[args.to_key]
    G.FUNCS:change_window_cycle_UI()
end
G.FUNCS.change_display = function(self, args)
    G.SETTINGS.QUEUED_CHANGE.selected_display = args.to_key
    G.FUNCS:change_window_cycle_UI()
end
G.FUNCS.change_window_cycle_UI = function(self)
    if G.OVERLAY_MENU then
        local swap_node = G.OVERLAY_MENU:get_UIE_by_ID("resolution_cycle")
        if swap_node then
            local focused_display, focused_screenmode = G.SETTINGS.QUEUED_CHANGE.selected_display or G.SETTINGS.WINDOW.selected_display, G.SETTINGS.QUEUED_CHANGE.screenmode or G.SETTINGS.WINDOW.screenmode
            local res_option = GET_DISPLAYINFO(_G, focused_screenmode, focused_display)
            swap_node.children[1]:remove()
            swap_node.children[1] = nil
            swap_node.UIBox:add_child(
                create_option_cycle(_G, {
                    w = 4,
                    scale = 0.8,
                    options = G.SETTINGS.WINDOW.DISPLAYS[focused_display].screen_resolutions.strings,
                    opt_callback = "change_screen_resolution",
                    current_option = res_option or 1
                }),
                swap_node
            )
        end
    end
end
G.FUNCS.change_gamespeed = function(self, args)
    G.SETTINGS.GAMESPEED = args.to_val
end
G.FUNCS.change_play_discard_position = function(self, args)
    G.SETTINGS.play_button_pos = args.to_key
    if G.buttons then
        G.buttons:remove()
        G.buttons = __TS__New(
            UIBox,
            {
                definition = create_UIBox_buttons(_G),
                config = {align = "bm", offset = {x = 0, y = 0.3}, major = G.hand, bond = "Weak"}
            }
        )
    end
end
G.FUNCS.change_shadows = function(self, args)
    G.SETTINGS.GRAPHICS.shadows = args.to_key == 1 and "On" or "Off"
    G:save_settings()
end
G.FUNCS.change_pixel_smoothing = function(self, args)
    G.SETTINGS.GRAPHICS.texture_scaling = args.to_key
    SMODS:injectObjects(SMODS.Atlas)
    G:save_settings()
end
G.FUNCS.change_crt_bloom = function(self, args)
    G.SETTINGS.GRAPHICS.bloom = args.to_key
    G:save_settings()
end
G.FUNCS.change_collab = function(self, args)
    G.SETTINGS.CUSTOM_DECK.Collabs[args.cycle_config.curr_suit] = G.COLLABS.options[args.cycle_config.curr_suit][args.to_key] or "default"
    for k, v in pairs(G.I.CARD) do
        if v.config and v.config.card and v.children.front and v.ability.effect ~= "Stone Card" then
            v:set_sprites(nil, v.config.card)
        end
    end
    G:save_settings()
end
G.FUNCS.key_button = function(self, e)
    local args = e.config.ref_table
    if args.key then
        G.CONTROLLER:key_press_update(args.key)
    end
end
G.FUNCS.text_input = function(self, e)
    local args = e.config.ref_table
    if G.CONTROLLER.text_input_hook == e then
        e.parent.parent.config.colour = args.hooked_colour
        args.current_prompt_text = ""
        args.current_position_text = args.position_text
    else
        e.parent.parent.config.colour = args.colour
        args.current_prompt_text = args.text.ref_table[args.text.ref_value] == "" and args.prompt_text or ""
        args.current_position_text = ""
    end
    local OSkeyboard_e = e.parent.parent.parent
    if G.CONTROLLER.text_input_hook == e and G.CONTROLLER.HID.controller then
        if not OSkeyboard_e.children.controller_keyboard then
            OSkeyboard_e.children.controller_keyboard = __TS__New(
                UIBox,
                {
                    definition = create_keyboard_input(_G, {backspace_key = true, return_key = true, space_key = false}),
                    config = {align = "cm", offset = {x = 0, y = G.CONTROLLER.text_input_hook.config.ref_table.keyboard_offset or -4}, major = e.UIBox, parent = OSkeyboard_e}
                }
            )
            G.CONTROLLER.screen_keyboard = OSkeyboard_e.children.controller_keyboard
            G.CONTROLLER:mod_cursor_context_layer(1)
        end
    elseif OSkeyboard_e.children.controller_keyboard then
        OSkeyboard_e.children.controller_keyboard:remove()
        OSkeyboard_e.children.controller_keyboard = nil
        G.CONTROLLER.screen_keyboard = nil
        G.CONTROLLER:mod_cursor_context_layer(-1)
    end
end
G.FUNCS.paste_seed = function(self, e)
    G.CONTROLLER.text_input_hook = e.UIBox:get_UIE_by_ID("text_input").children[1].children[1]
    G.CONTROLLER.text_input_id = "text_input"
    do
        local i = 1
        while i <= 8 do
            G.FUNCS:text_input_key({key = "right"})
            i = i + 1
        end
    end
    do
        local i = 1
        while i <= 8 do
            G.FUNCS:text_input_key({key = "backspace"})
            i = i + 1
        end
    end
    local clipboard = G.F_LOCAL_CLIPBOARD and G.CLIPBOARD or love.system.getClipboardText() or ""
    do
        local i = 1
        while i <= clipboard.length do
            local c = clipboard:sub(i, i)
            G.FUNCS:text_input_key({key = c})
            i = i + 1
        end
    end
    G.FUNCS:text_input_key({key = "return"})
end
G.FUNCS.select_text_input = function(self, e)
    G.CONTROLLER.text_input_hook = e.children[1].children[1]
    G.CONTROLLER.text_input_id = e.config.id
    TRANSPOSE_TEXT_INPUT(_G, 0)
    e.UIBox:recalculate(true)
end
G.FUNCS.text_input_key = function(self, args)
    args = args or ({})
    if args.key == "[" or args.key == "]" then
        return
    end
    if args.key == "0" then
        args.key = "o"
    end
    local hook_config = G.CONTROLLER.text_input_hook.config.ref_table
    hook_config.orig_colour = hook_config.orig_colour or copy_table(_G, hook_config.colour)
    args.key = args.key or "%"
    args.caps = args.caps or G.CONTROLLER.capslock or hook_config.all_caps
    local keymap = {
        space = " ",
        backspace = "BACKSPACE",
        delete = "DELETE",
        ["return"] = "RETURN",
        right = "RIGHT",
        left = "LEFT"
    }
    local hook = G.CONTROLLER.text_input_hook
    local corpus = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" .. (hook.config.ref_table.extended_corpus and " 0!$&()<>?:{}+-=,.[]_" or "")
    if hook.config.ref_table.extended_corpus then
        local lower_ext = "1234567890-=;\\',./"
        local upper_ext = "!@#$%^&*()_+:\"<>?"
        if ({string.find(lower_ext, args.key)}) and args.caps then
            args.key = string.sub(
                string.sub(
                    upper_ext,
                    {string.find(lower_ext, args.key)}
                ),
                0,
                1
            )
        end
    end
    local text = hook_config.text
    args.key = keymap[args.key] or (args.caps and string.upper(args.key) or args.key)
    TRANSPOSE_TEXT_INPUT(_G, 0)
    if string.len(text.ref_table[text.ref_value]) > 0 and args.key == "BACKSPACE" then
        MODIFY_TEXT_INPUT(_G, {letter = "", text_table = text, pos = text.current_position, delete = true})
        TRANSPOSE_TEXT_INPUT(_G, -1)
    elseif string.len(text.ref_table[text.ref_value]) > 0 and args.key == "DELETE" then
        MODIFY_TEXT_INPUT(_G, {letter = "", text_table = text, pos = text.current_position + 1, delete = true})
        TRANSPOSE_TEXT_INPUT(_G, 0)
    elseif args.key == "RETURN" then
        if hook.config.ref_table.callback then
            hook.config.ref_table:callback()
        end
        hook.parent.parent.config.colour = hook_config.colour
        local temp_colour = copy_table(_G, hook_config.orig_colour)
        hook_config.colour[1] = G.C.WHITE[2]
        hook_config.colour[2] = G.C.WHITE[3]
        hook_config.colour[3] = G.C.WHITE[4]
        ease_colour(_G, hook_config.colour, temp_colour)
        G.CONTROLLER.text_input_hook = nil
    elseif args.key == "LEFT" then
        TRANSPOSE_TEXT_INPUT(_G, -1)
    elseif args.key == "RIGHT" then
        TRANSPOSE_TEXT_INPUT(_G, 1)
    elseif hook_config.max_length > string.len(text.ref_table[text.ref_value]) and string.len(args.key) == 1 and ({string.find(corpus, args.key, 1, true)}) then
        MODIFY_TEXT_INPUT(_G, {letter = args.key, text_table = text, pos = text.current_position + 1})
        TRANSPOSE_TEXT_INPUT(_G, 1)
    end
end
G.FUNCS.can_apply_window_changes = function(self, e)
    local can_apply = false
    if G.SETTINGS.QUEUED_CHANGE then
        if G.SETTINGS.QUEUED_CHANGE.screenmode and G.SETTINGS.QUEUED_CHANGE.screenmode ~= G.SETTINGS.WINDOW.screenmode then
            can_apply = true
        elseif G.SETTINGS.QUEUED_CHANGE.screenres then
            can_apply = true
        elseif G.SETTINGS.QUEUED_CHANGE.vsync then
            can_apply = true
        elseif G.SETTINGS.QUEUED_CHANGE.selected_display and G.SETTINGS.QUEUED_CHANGE.selected_display ~= G.SETTINGS.WINDOW.selected_display then
            can_apply = true
        end
    end
    if can_apply then
        e.config.button = "apply_window_changes"
        e.config.colour = G.C.RED
    else
        e.config.button = nil
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
    end
end
G.FUNCS.apply_window_changes = function(self, _initial)
    G.SETTINGS.WINDOW.screenmode = G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.screenmode or G.SETTINGS.WINDOW.screenmode or "Windowed"
    G.SETTINGS.WINDOW.selected_display = G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.selected_display or G.SETTINGS.WINDOW.selected_display or 1
    G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display + 1].screen_res = {
        w = G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.screenres and G.SETTINGS.QUEUED_CHANGE.screenres.w or G.SETTINGS.screen_res and G.SETTINGS.screen_res.w or love.graphics.getWidth(),
        h = G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.screenres and G.SETTINGS.QUEUED_CHANGE.screenres.h or G.SETTINGS.screen_res and G.SETTINGS.screen_res.h or love.graphics.getHeight()
    }
    G.SETTINGS.WINDOW.vsync = G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.vsync or G.SETTINGS.WINDOW.vsync or 1
    love.window.updateMode(
        G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.screenmode == "Windowed" and love.graphics.getWidth() * 0.8 or G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display + 1].screen_res.w,
        G.SETTINGS.QUEUED_CHANGE and G.SETTINGS.QUEUED_CHANGE.screenmode == "Windowed" and love.graphics.getHeight() * 0.8 or G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display + 1].screen_res.h,
        {
            fullscreen = G.SETTINGS.WINDOW.screenmode ~= "Windowed",
            fullscreentype = G.SETTINGS.WINDOW.screenmode == "Borderless" and "desktop" or G.SETTINGS.WINDOW.screenmode == "Fullscreen" and "exclusive" or nil,
            vsync = G.SETTINGS.WINDOW.vsync,
            resizable = true,
            display = G.SETTINGS.WINDOW.selected_display,
            highdpi = love.system.getOS() == "OS X"
        }
    )
    G.SETTINGS.QUEUED_CHANGE = {}
    if _initial ~= true then
        love.resize(
            love.graphics.getWidth(),
            love.graphics.getHeight()
        )
        G:save_settings()
    end
    if G.OVERLAY_MENU then
        local tab_but = G.OVERLAY_MENU:get_UIE_by_ID("tab_but_Video")
        G.FUNCS:change_tab(tab_but)
    end
end
G.FUNCS.RUN_SETUP_check_back = function(self, e)
    if G.GAME.viewed_back.name ~= e.config.id then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = G.GAME.viewed_back:generate_UI(),
                config = {offset = {x = 0, y = 0}, align = "cm", parent = e}
            }
        )
        e.config.id = G.GAME.viewed_back.name
    end
end
G.FUNCS.RUN_SETUP_check_back_name = function(self, e)
    if e.config.object and G.GAME.viewed_back.name ~= e.config.id then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = {
                    n = G.UIT.ROOT,
                    config = {align = "cm", colour = G.C.CLEAR},
                    nodes = {{
                        n = G.UIT.O,
                        config = {
                            id = G.GAME.viewed_back.name,
                            func = "RUN_SETUP_check_back_name",
                            object = DynaText(
                                _G,
                                {
                                    string = G.GAME.viewed_back:get_name(),
                                    maxw = 4,
                                    colours = {G.C.WHITE},
                                    shadow = true,
                                    bump = true,
                                    scale = 0.5,
                                    pop_in = 0,
                                    silent = true
                                }
                            )
                        }
                    }}
                },
                config = {offset = {x = 0, y = 0}, align = "cm", parent = e}
            }
        )
        e.config.id = G.GAME.viewed_back.name
    end
end
G.FUNCS.RUN_SETUP_check_stake = function(self, e)
    if G.GAME.viewed_back.name ~= e.config.id then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = G.UIDEF:stake_option(G.SETTINGS.current_setup),
                config = {offset = {x = 0, y = 0}, align = "tmi", parent = e}
            }
        )
        e.config.id = G.GAME.viewed_back.name
    end
end
G.FUNCS.RUN_SETUP_check_stake2 = function(self, e)
    if G.viewed_stake ~= e.config.id then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = G.UIDEF:viewed_stake_option(),
                config = {offset = {x = 0, y = 0}, align = "cm", parent = e}
            }
        )
        e.config.id = G.viewed_stake
    end
end
G.FUNCS.change_viewed_collab = function(self, args)
    G.viewed_collab = args.to_val
end
G.FUNCS.CREDITS_check_collab = function(self, e)
    if G.viewed_collab ~= e.config.id then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = G.UIDEF:viewed_collab_option(),
                config = {offset = {x = 0, y = 0}, align = "cm", parent = e}
            }
        )
        e.config.id = G.viewed_collab
    end
end
G.FUNCS.RUN_SETUP_check_back_stake_column = function(self, e)
    if G.GAME.viewed_back.name ~= e.config.id then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = G.UIDEF:deck_stake_column(G.GAME.viewed_back.effect.center.key),
                config = {offset = {x = 0, y = 0}, align = "cm", parent = e}
            }
        )
        e.config.id = G.GAME.viewed_back.name
    end
end
G.FUNCS.RUN_SETUP_check_back_stake_highlight = function(self, e)
    if G.viewed_stake == e.config.id and e.config.outline < 0.1 then
        e.config.outline = 0.8
    elseif G.viewed_stake ~= e.config.id and e.config.outline > 0.1 then
        e.config.outline = 0
    end
end
G.FUNCS.change_tab = function(self, e)
    if not e then
        return
    end
    local _infotip_object = G.OVERLAY_MENU:get_UIE_by_ID("overlay_menu_infotip")
    if _infotip_object and _infotip_object.config.object then
        _infotip_object.config.object:remove()
        _infotip_object.config.object = Moveable(_G)
    end
    local tab_contents = e.UIBox:get_UIE_by_ID("tab_contents")
    tab_contents.config.object:remove()
    tab_contents.config.object = __TS__New(
        UIBox,
        {
            definition = e.config.ref_table:tab_definition_function(e.config.ref_table.tab_definition_function_args),
            config = {offset = {x = 0, y = 0}, parent = tab_contents, type = "cm"}
        }
    )
    tab_contents.UIBox:recalculate()
end
G.FUNCS.overlay_menu = function(self, args)
    if not args then
        return
    end
    if G.OVERLAY_MENU then
        G.OVERLAY_MENU:remove()
    end
    G.CONTROLLER.locks.frame_set = true
    G.CONTROLLER.locks.frame = true
    G.CONTROLLER.cursor_down.target = nil
    G.CONTROLLER:mod_cursor_context_layer(G.NO_MOD_CURSOR_STACK and 0 or 1)
    args.config = args.config or ({})
    args.config = {
        align = args.config.align or "cm",
        offset = args.config.offset or ({x = 0, y = 10}),
        major = args.config.major or G.ROOM_ATTACH,
        bond = "Weak",
        no_esc = args.config.no_esc
    }
    G.OVERLAY_MENU = true
    G.OVERLAY_MENU = __TS__New(UIBox, {definition = args.definition, config = args.config})
    G.OVERLAY_MENU.alignment.offset.y = 0
    G.ROOM.jiggle = G.ROOM.jiggle + 1
    G.OVERLAY_MENU:align_to_major()
end
G.FUNCS.exit_overlay_menu = function(self)
    if not G.OVERLAY_MENU then
        return
    end
    G.CONTROLLER.locks.frame_set = true
    G.CONTROLLER.locks.frame = true
    G.CONTROLLER:mod_cursor_context_layer(-1000)
    G.OVERLAY_MENU:remove()
    G.OVERLAY_MENU = nil
    G.VIEWING_DECK = nil
    G.SETTINGS.paused = false
    G:save_settings()
end
G.FUNCS.continue_unlock = function(self)
    G.FUNCS:exit_overlay_menu()
    G.CONTROLLER:mod_cursor_context_layer(-2000)
    G.E_MANAGER:update(0, true)
end
G.FUNCS.test_framework = function(self, options)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_test_framework(_G, options)})
end
G.FUNCS.options = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_options(_G)})
end
G.FUNCS.current_hands = function(self, e, simple)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_current_hands(_G, simple)})
end
G.FUNCS.run_info = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = G.UIDEF:run_info()})
end
G.FUNCS.deck_info = function(self, e)
    G.SETTINGS.paused = true
    if G.deck_preview then
        G.deck_preview:remove()
        G.deck_preview = nil
    end
    G.FUNCS:overlay_menu({definition = G.UIDEF:deck_info(G.STATE == G.STATES.SELECTING_HAND or G.STATE == G.STATES.HAND_PLAYED or G.STATE == G.STATES.DRAW_TO_HAND)})
end
G.FUNCS.settings = function(self, e, instant)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({
        definition = create_UIBox_settings(_G),
        config = {offset = {x = 0, y = instant and 0 or 10}}
    })
end
G.FUNCS.show_credits = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = G.UIDEF:credits()})
end
G.FUNCS.language_selection = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = G.UIDEF:language_selector()})
end
G.FUNCS.your_collection = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection(_G)})
end
G.FUNCS.your_collection_blinds = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_blinds(_G)})
end
G.FUNCS.your_collection_jokers = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_jokers(_G)})
end
G.FUNCS.your_collection_tarots = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_tarots(_G)})
end
G.FUNCS.your_collection_planets = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_planets(_G)})
end
G.FUNCS.your_collection_spectrals = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_spectrals(_G)})
end
G.FUNCS.your_collection_vouchers = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_vouchers(_G)})
end
G.FUNCS.your_collection_enhancements_exit_overlay_menu = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_enhancements(_G, "exit_overlay_menu")})
end
G.FUNCS.your_collection_enhancements = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_enhancements(_G)})
end
G.FUNCS.your_collection_decks = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_decks(_G)})
end
G.FUNCS.your_collection_editions = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_editions(_G)})
end
G.FUNCS.your_collection_tags = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_tags(_G)})
end
G.FUNCS.your_collection_seals = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_seals(_G)})
end
G.FUNCS.your_collection_boosters = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_your_collection_boosters(_G)})
end
G.FUNCS.challenge_list = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = G.UIDEF:challenge_list(e.config.id == "from_game_over")})
    if e.config.id == "from_game_over" then
        G.OVERLAY_MENU.config.no_esc = true
    end
end
G.FUNCS.high_scores = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_high_scores(_G)})
end
G.FUNCS.customize_deck = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = create_UIBox_customize_deck(_G)})
end
G.FUNCS.usage = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = G.UIDEF:usage_tabs()})
end
G.FUNCS.setup_run = function(self, e)
    G.SETTINGS.paused = true
    G.FUNCS:overlay_menu({definition = G.UIDEF:run_setup((e.config.id == "from_game_over" or e.config.id == "from_game_won" or e.config.id == "challenge_list") and e.config.id)})
    if e.config.id == "from_game_over" or e.config.id == "from_game_won" then
        G.OVERLAY_MENU.config.no_esc = true
    end
end
G.FUNCS.wait_for_high_scores = function(self, e)
    if G.ARGS.HIGH_SCORE_RESPONSE then
        e.config.object:remove()
        e.config.object = __TS__New(
            UIBox,
            {
                definition = create_UIBox_high_scores_filling(_G, G.ARGS.HIGH_SCORE_RESPONSE),
                config = {offset = {x = 0, y = 0}, align = "cm", parent = e}
            }
        )
        G.ARGS.HIGH_SCORE_RESPONSE = nil
    end
end
G.FUNCS.notify_then_setup_run = function(self, e)
    G.OVERLAY_MENU:remove()
    G.OVERLAY_MENU = nil
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            blockable = false,
            func = function(self)
                unlock_notify(_G)
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            blockable = false,
            func = function(self)
                if G.E_MANAGER.queues.unlock.length <= 0 and not G.OVERLAY_MENU then
                    G.SETTINGS.paused = true
                    G.FUNCS:overlay_menu({definition = G.UIDEF:run_setup((e.config.id == "from_game_over" or e.config.id == "from_game_won") and e.config.id)})
                    if e.config.id == "from_game_over" or e.config.id == "from_game_won" then
                        G.OVERLAY_MENU.config.no_esc = true
                    end
                    return true
                end
            end
        }
    ))
end
G.FUNCS.change_challenge_description = function(self, e)
    if G.OVERLAY_MENU then
        local desc_area = G.OVERLAY_MENU:get_UIE_by_ID("challenge_area")
        if desc_area and desc_area.config.oid ~= e.config.id then
            if desc_area.config.old_chosen then
                desc_area.config.old_chosen.config.chosen = nil
            end
            e.config.chosen = "vert"
            if desc_area.config.object then
                desc_area.config.object:remove()
            end
            desc_area.config.object = __TS__New(
                UIBox,
                {
                    definition = G.UIDEF:challenge_description(e.config.id),
                    config = {offset = {x = 0, y = 0}, align = "cm", parent = desc_area}
                }
            )
            desc_area.config.oid = e.config.id
            desc_area.config.old_chosen = e
        end
    end
end
G.FUNCS.change_challenge_list_page = function(self, args)
    if not args or not args.cycle_config then
        return
    end
    if G.OVERLAY_MENU then
        local ch_list = G.OVERLAY_MENU:get_UIE_by_ID("challenge_list")
        if ch_list then
            if ch_list.config.object then
                ch_list.config.object:remove()
            end
            ch_list.config.object = __TS__New(
                UIBox,
                {
                    definition = G.UIDEF:challenge_list_page(args.cycle_config.current_option - 1),
                    config = {offset = {x = 0, y = 0}, align = "cm", parent = ch_list}
                }
            )
            G.FUNCS:change_challenge_description({config = {id = "nil"}})
        end
    end
end
G.FUNCS.deck_view_challenge = function(self, e)
    G.FUNCS:overlay_menu({definition = create_UIBox_generic_options(
        _G,
        {
            back_func = "deck_info",
            contents = {G.UIDEF:challenge_description(
                get_challenge_int_from_id(_G, e.config.id.id or ""),
                nil,
                true
            )}
        }
    )})
end
G.FUNCS.profile_select = function(self, e)
    G.SETTINGS.paused = true
    G.focused_profile = G.SETTINGS.profile
    do
        local i = 1
        while i <= 3 do
            if i ~= G.focused_profile and love.filesystem.getInfo(tostring(i) .. "/" .. "profile.jkr") then
                G:load_profile(i)
            end
            i = i + 1
        end
    end
    G:load_profile(G.focused_profile)
    G.FUNCS:overlay_menu({definition = G.UIDEF:profile_select()})
end
G.FUNCS.quit = function(self, e)
    love.event.quit()
end
G.FUNCS.quit_cta = function(self, e)
    G.SETTINGS.paused = true
    G.SETTINGS.DEMO.quit_CTA_shown = true
    G:save_progress()
    G.FUNCS:overlay_menu({
        definition = create_UIBox_exit_CTA(_G),
        config = {no_esc = true}
    })
    local Jimbo = nil
    if not G.jimboed then
        G.jimboed = true
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                blockable = false,
                delay = 2.5,
                func = function(self)
                    if G.OVERLAY_MENU and G.OVERLAY_MENU:get_UIE_by_ID("jimbo_spot") then
                        Jimbo = Card_Character(_G, {x = 0, y = 5})
                        local spot = G.OVERLAY_MENU:get_UIE_by_ID("jimbo_spot")
                        spot.config.object:remove()
                        spot.config.object = Jimbo
                        Jimbo.ui_object_updated = true
                        Jimbo:add_speech_bubble({"Having fun?", {{text = "Wishlist Balatro!", type = "GREEN"}}})
                        Jimbo:say_stuff(5)
                    end
                    return true
                end
            }
        ))
    end
end
G.FUNCS.demo_survey = function(self, e)
    love.system.openURL("https://forms.gle/WX26BHq1AwwV5xyH9")
end
G.FUNCS.louisf_insta = function(self, e)
    love.system.openURL("https://www.instagram.com/louisfsoundtracks/")
end
G.FUNCS.wishlist_steam = function(self, e)
    love.system.openURL("https://store.steampowered.com/app/2379780/Balatro/#game_area_purchase")
end
G.FUNCS.go_to_playbalatro = function(self, e)
    love.system.openURL("https://www.playbalatro.com")
end
G.FUNCS.go_to_discord = function(self, e)
    love.system.openURL("https://discord.gg/balatro")
end
G.FUNCS.go_to_discord_loc = function(self, e)
    love.system.openURL("https://discord.com/channels/1116389027176787968/1207803392978853898")
end
G.FUNCS.loc_survey = function(self, e)
    love.system.openURL("https://forms.gle/pL5tMh1oXLmv8czz9")
end
G.FUNCS.go_to_twitter = function(self, e)
    love.system.openURL("https://twitter.com/LocalThunk")
end
G.FUNCS.unlock_this = function(self, e)
    unlock_achievement(_G, e.config.id)
end
G.FUNCS.reset_achievements = function(self, e)
    G.ACHIEVEMENTS = nil
    G.SETTINGS.ACHIEVEMENTS_EARNED = {}
    G:save_progress()
    G.FUNCS:exit_overlay_menu()
end
G.FUNCS.refresh_contrast_mode = function(self)
    local new_colour_proto = G.C["SO_" .. tostring(G.SETTINGS.colourblind_option and 2 or 1)]
    G.C.SUITS.Hearts = new_colour_proto.Hearts
    G.C.SUITS.Diamonds = new_colour_proto.Diamonds
    G.C.SUITS.Spades = new_colour_proto.Spades
    G.C.SUITS.Clubs = new_colour_proto.Clubs
    for k, v in pairs(G.I.CARD) do
        if v.config and v.config.card and v.children.front and v.ability.effect ~= "Stone Card" then
            v:set_sprites(nil, v.config.card)
        end
    end
end
G.FUNCS.warn_lang = function(self, e)
    local _infotip_object = G.OVERLAY_MENU:get_UIE_by_ID("overlay_menu_infotip")
    if _infotip_object.config.set ~= e.config.ref_table.label then
        _infotip_object.config.object:remove()
        _infotip_object.config.object = __TS__New(
            UIBox,
            {
                definition = overlay_infotip(_G, {[1] = e.config.ref_table.warning[1], [2] = e.config.ref_table.warning[2], [3] = e.config.ref_table.warning[3], lang = e.config.ref_table}),
                config = {offset = {x = 0, y = 0}, align = "bm", parent = _infotip_object}
            }
        )
        _infotip_object.config.object.UIRoot:juice_up()
        _infotip_object.config.set = e.config.ref_table.label
        e.config.disable_button = true
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.06,
                blockable = false,
                blocking = false,
                func = function(self)
                    play_sound(_G, "tarot2", 0.76, 0.4)
                    return true
                end
            }
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.35,
                blockable = false,
                blocking = false,
                func = function(self)
                    e.config.disable_button = nil
                    return true
                end
            }
        ))
        e.config.button = "change_lang"
        play_sound(_G, "tarot2", 1, 0.4)
    end
end
G.FUNCS.change_lang = function(self, e)
    local lang = e.config.ref_table
    if not lang or lang == G.LANG then
        G.FUNCS:exit_overlay_menu()
    else
        G.SETTINGS.language = lang.loc_key or lang.key
        G.SETTINGS.real_language = lang.key
        G:set_language()
        G.E_MANAGER:clear_queue()
        G.FUNCS:wipe_on()
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                no_delete = true,
                blockable = true,
                blocking = false,
                func = function(self)
                    G:delete_run()
                    G:init_item_prototypes()
                    G:main_menu()
                    return true
                end
            }
        ))
        G.FUNCS:wipe_off()
    end
end
G.FUNCS.copy_seed = function(self, e)
    if G.F_LOCAL_CLIPBOARD then
        G.CLIPBOARD = G.GAME.pseudorandom.seed
    else
        love.system.setClipboardText(G.GAME.pseudorandom.seed)
    end
end
G.FUNCS.start_setup_run = function(self, e)
    if G.OVERLAY_MENU then
        G.FUNCS:exit_overlay_menu()
    end
    if G.SETTINGS.current_setup == "New Run" then
        if not G.GAME or not G.GAME.won and not G.GAME.seeded then
            if G.SAVED_GAME ~= nil then
                if not G.SAVED_GAME.GAME.won then
                    G.PROFILES[G.SETTINGS.profile + 1].high_scores.current_streak.amt = 0
                end
                G:save_settings()
            end
        end
        local _seed = G.run_setup_seed and G.setup_seed or G.forced_seed or nil
        local _challenge = G.challenge_tab or nil
        local _stake = G.forced_stake or G.PROFILES[G.SETTINGS.profile + 1].MEMORY.stake or 1
        G.FUNCS:start_run(e, {stake = _stake, seed = _seed, challenge = _challenge})
    elseif G.SETTINGS.current_setup == "Continue" then
        if G.SAVED_GAME ~= nil then
            G.FUNCS:start_run(nil, {savetext = G.SAVED_GAME})
        end
    end
end
G.FUNCS.start_challenge_run = function(self, e)
    if G.OVERLAY_MENU then
        G.FUNCS:exit_overlay_menu()
    end
    G.FUNCS:start_run(e, {stake = 1, challenge = G.CHALLENGES[e.config.id]})
end
G.FUNCS.toggle_seeded_run = function(self, e)
    if e.config.object and not G.run_setup_seed then
        e.config.object:remove()
        e.config.object = nil
    elseif not e.config.object and G.run_setup_seed then
        e.config.object = __TS__New(
            UIBox,
            {
                definition = {
                    n = G.UIT.ROOT,
                    config = {align = "cm", colour = G.C.CLEAR},
                    nodes = {
                        {
                            n = G.UIT.C,
                            config = {align = "cm", minw = 2.5, padding = 0.05},
                            nodes = {simple_text_container(_G, "ml_disabled_seed", {colour = G.C.UI.TEXT_LIGHT, scale = 0.26, shadow = true})}
                        },
                        {
                            n = G.UIT.C,
                            config = {align = "cm", minw = 0.1},
                            nodes = {
                                create_text_input(
                                    _G,
                                    {
                                        max_length = 8,
                                        all_caps = true,
                                        ref_table = G,
                                        ref_value = "setup_seed",
                                        prompt_text = localize(_G, "k_enter_seed")
                                    }
                                ),
                                {n = G.UIT.C, config = {align = "cm", minw = 0.1}, nodes = {}},
                                UIBox_button(
                                    _G,
                                    {
                                        label = localize(_G, "ml_paste_seed"),
                                        minw = 1,
                                        minh = 0.6,
                                        button = "paste_seed",
                                        colour = G.C.BLUE,
                                        scale = 0.3,
                                        col = true
                                    }
                                )
                            }
                        },
                        {n = G.UIT.C, config = {align = "cm", minw = 2.5}, nodes = {}}
                    }
                },
                config = {offset = {x = 0, y = 0}, parent = e, type = "cm"}
            }
        )
        e.config.object:recalculate()
    end
end
G.FUNCS.start_tutorial = function(self, e)
    if G.OVERLAY_MENU then
        G.FUNCS:exit_overlay_menu()
    end
    G.SETTINGS.tutorial_progress = {
        forced_shop = {"j_joker", "c_empress"},
        forced_voucher = "v_grabber",
        forced_tags = {"tag_handy", "tag_garbage"},
        hold_parts = {},
        completed_parts = {}
    }
    G.SETTINGS.tutorial_complete = false
    G.FUNCS:start_run(e)
end
G.FUNCS.chip_UI_set = function(self, e)
    local new_chips_text = number_format(_G, G.GAME.chips)
    if G.GAME.chips_text ~= new_chips_text then
        e.config.scale = math.min(
            0.8,
            scale_number(_G, G.GAME.chips, 1.1)
        )
        G.GAME.chips_text = new_chips_text
    end
end
G.FUNCS.blind_chip_UI_scale = function(self, e)
    if G.GAME.blind and G.GAME.blind.chips then
        e.config.scale = scale_number(_G, G.GAME.blind.chips, 0.7, 100000)
    end
end
G.FUNCS.hand_mult_UI_set = function(self, e)
    local new_mult_text = number_format(_G, G.GAME.current_round.current_hand.mult)
    if new_mult_text ~= G.GAME.current_round.current_hand.mult_text then
        G.GAME.current_round.current_hand.mult_text = new_mult_text
        e.config.object.scale = scale_number(_G, G.GAME.current_round.current_hand.mult, 0.9, 1000)
        e.config.object:update_text()
        if not G.TAROT_INTERRUPT_PULSE then
            G.FUNCS:text_super_juice(
                e,
                math.max(
                    0,
                    math.floor(math.log10(type(G.GAME.current_round.current_hand.mult) == "number" and G.GAME.current_round.current_hand.mult or 1))
                )
            )
        end
    end
end
G.FUNCS.hand_chip_UI_set = function(self, e)
    local new_chip_text = number_format(_G, G.GAME.current_round.current_hand.chips)
    if new_chip_text ~= G.GAME.current_round.current_hand.chip_text then
        G.GAME.current_round.current_hand.chip_text = new_chip_text
        e.config.object.scale = scale_number(_G, G.GAME.current_round.current_hand.chips, 0.9, 1000)
        e.config.object:update_text()
        if not G.TAROT_INTERRUPT_PULSE then
            G.FUNCS:text_super_juice(
                e,
                math.max(
                    0,
                    math.floor(math.log10(type(G.GAME.current_round.current_hand.chips) == "number" and G.GAME.current_round.current_hand.chips or 1))
                )
            )
        end
    end
end
G.FUNCS.hand_chip_total_UI_set = function(self, e)
    if G.GAME.current_round.current_hand.chip_total < 1 then
        G.GAME.current_round.current_hand.chip_total_text = ""
    else
        local new_chip_total_text = number_format(_G, G.GAME.current_round.current_hand.chip_total)
        if new_chip_total_text ~= G.GAME.current_round.current_hand.chip_total_text then
            e.config.object.scale = scale_number(_G, G.GAME.current_round.current_hand.chip_total, 0.95, 100000000)
            G.GAME.current_round.current_hand.chip_total_text = new_chip_total_text
            if not G.ARGS.hand_chip_total_UI_set or G.ARGS.hand_chip_total_UI_set < G.GAME.current_round.current_hand.chip_total then
                G.FUNCS:text_super_juice(
                    e,
                    math.floor(math.log10(G.GAME.current_round.current_hand.chip_total))
                )
            end
            G.ARGS.hand_chip_total_UI_set = G.GAME.current_round.current_hand.chip_total
        end
    end
end
G.FUNCS.text_super_juice = function(self, e, _amount)
    e.config.object:set_quiver(0.03 * _amount)
    e.config.object:pulse(0.3 + 0.08 * _amount)
    e.config.object:update_text()
    e.config.object:align_letters()
    e:update_object()
end
G.FUNCS.flame_handler = function(self, e)
    G.C.UI_CHIPLICK = G.C.UI_CHIPLICK or ({1, 1, 1, 1})
    G.C.UI_MULTLICK = G.C.UI_MULTLICK or ({1, 1, 1, 1})
    do
        local i = 1
        while i <= 3 do
            G.C.UI_CHIPLICK[i] = math.min(
                math.max(
                    bit.bxor(G.C.UI_CHIPS[i + 1] * 0.5 + G.C.YELLOW[i + 1] * 0.5 + 0.1, 2),
                    0.1
                ),
                1
            )
            G.C.UI_MULTLICK[i] = math.min(
                math.max(
                    bit.bxor(G.C.UI_MULT[i + 1] * 0.5 + G.C.YELLOW[i + 1] * 0.5 + 0.1, 2),
                    0.1
                ),
                1
            )
            i = i + 1
        end
    end
    G.ARGS.flame_handler = G.ARGS.flame_handler or ({chips = {id = "flame_chips", arg_tab = "chip_flames", colour = G.C.UI_CHIPS, accent = G.C.UI_CHIPLICK}, mult = {id = "flame_mult", arg_tab = "mult_flames", colour = G.C.UI_MULT, accent = G.C.UI_MULTLICK}})
    for k, v in pairs(G.ARGS.flame_handler) do
        if e.config.id == v.id then
            if not e.config.object:is(Sprite) or e.config.object.ID ~= v.ID then
                e.config.object:remove()
                e.config.object = Sprite(
                    _G,
                    0,
                    0,
                    2.5,
                    2.5,
                    G.ASSET_ATLAS.ui_1,
                    {x = 2, y = 0}
                )
                v.ID = e.config.object.ID
                G.ARGS[v.arg_tab] = {
                    intensity = 0,
                    real_intensity = 0,
                    intensity_vel = 0,
                    colour_1 = v.colour,
                    colour_2 = v.accent,
                    timer = G.TIMERS.REAL
                }
                e.config.object:set_alignment({major = e.parent, type = "bmi", offset = {x = 0, y = 0}, xy_bond = "Weak"})
                e.config.object:define_draw_steps({{shader = "flame", send = {
                    {name = "time", ref_table = G.ARGS[v.arg_tab], ref_value = "timer"},
                    {name = "amount", ref_table = G.ARGS[v.arg_tab], ref_value = "real_intensity"},
                    {name = "image_details", ref_table = e.config.object, ref_value = "image_dims"},
                    {name = "texture_details", ref_table = e.config.object.RETS, ref_value = "get_pos_pixel"},
                    {name = "colour_1", ref_table = G.ARGS[v.arg_tab], ref_value = "colour_1"},
                    {name = "colour_2", ref_table = G.ARGS[v.arg_tab], ref_value = "colour_2"},
                    {name = "id", val = e.config.object.ID}
                }}})
                e.config.object:get_pos_pixel()
            end
            local _F = G.ARGS[v.arg_tab]
            local exptime = math.exp(-0.4 * G.real_dt)
            if G.ARGS.score_intensity.earned_score >= G.ARGS.score_intensity.required_score and G.ARGS.score_intensity.required_score > 0 then
                _F.intensity = (G.pack_cards and not G.pack_cards.REMOVED or G.TAROT_INTERRUPT) and 0 or math.max(
                    0,
                    math.log(G.ARGS.score_intensity.earned_score, 5) - 2
                )
            else
                _F.intensity = 0
            end
            _F.timer = _F.timer + G.real_dt * (1 + _F.intensity * 0.2)
            if _F.intensity_vel < 0 then
                _F.intensity_vel = _F.intensity_vel * (1 - 10 * G.real_dt)
            end
            _F.intensity_vel = (1 - exptime) * (_F.intensity - _F.real_intensity) * G.real_dt * 25 + exptime * _F.intensity_vel
            _F.real_intensity = math.max(0, _F.real_intensity + _F.intensity_vel)
            _F.change = (_F.change or 0) * (1 - 4 * G.real_dt) + 4 * G.real_dt * (_F.real_intensity < _F.intensity - 0 and 1 or 0) * _F.real_intensity
        end
    end
end
G.FUNCS.hand_text_UI_set = function(self, e)
    if G.GAME.current_round.current_hand.handname ~= G.GAME.current_round.current_hand.handname_text then
        G.GAME.current_round.current_hand.handname_text = G.GAME.current_round.current_hand.handname
        if G.GAME.current_round.current_hand.handname:len() >= 13 then
            e.config.object.scale = 12 * 0.56 / G.GAME.current_round.current_hand.handname:len()
        else
            e.config.object.scale = 2.4 / math.sqrt(G.GAME.current_round.current_hand.handname:len() + 5)
        end
        e.config.object:update_text()
    end
end
G.FUNCS.can_play = function(self, e)
    if G.hand.highlighted.length <= 0 or G.GAME.blind.block_play or G.hand.highlighted.length > 5 then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.BLUE
        e.config.button = "play_cards_from_highlighted"
    end
end
G.FUNCS.can_start_run = function(self, e)
    if not G.GAME.viewed_back.effect.center.unlocked then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.BLUE
        e.config.button = "start_setup_run"
    end
end
G.FUNCS.visible_blind = function(self, e)
    if {next(G.GAME.blind.config.blind)} then
        e.states.visible = true
    else
        e.states.visible = false
    end
end
G.FUNCS.can_reroll = function(self, e)
    if G.GAME.dollars - G.GAME.bankrupt_at - G.GAME.current_round.reroll_cost < 0 and G.GAME.current_round.reroll_cost ~= 0 then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.GREEN
        e.config.button = "reroll_shop"
    end
end
G.FUNCS.can_discard = function(self, e)
    if G.GAME.current_round.discards_left <= 0 or G.hand.highlighted.length <= 0 then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.RED
        e.config.button = "discard_cards_from_highlighted"
    end
end
G.FUNCS.can_use_consumeable = function(self, e)
    if e.config.ref_table:can_use_consumeable() then
        e.config.colour = G.C.RED
        e.config.button = "use_card"
    else
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    end
end
G.FUNCS.can_select_card = function(self, e)
    if e.config.ref_table.ability.set ~= "Joker" or e.config.ref_table.edition and e.config.ref_table.edition.negative or G.jokers.cards.length < G.jokers.config.card_limit then
        e.config.colour = G.C.GREEN
        e.config.button = "use_card"
    else
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    end
end
G.FUNCS.can_sell_card = function(self, e)
    if e.config.ref_table:can_sell_card() then
        e.config.colour = G.C.GREEN
        e.config.button = "sell_card"
    else
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    end
end
G.FUNCS.can_skip_booster = function(self, e)
    if G.pack_cards and not (G.GAME.STOP_USE and G.GAME.STOP_USE > 0) and (G.STATE == G.STATES.SMODS_BOOSTER_OPENED or G.STATE == G.STATES.PLANET_PACK or G.STATE == G.STATES.STANDARD_PACK or G.STATE == G.STATES.BUFFOON_PACK or G.hand) then
        e.config.colour = G.C.GREY
        e.config.button = "skip_booster"
    else
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    end
end
G.FUNCS.show_infotip = function(self, e)
    if e.config.ref_table then
        e.children.info = __TS__New(UIBox, {definition = {n = G.UIT.ROOT, config = {align = "cm", colour = G.C.CLEAR, padding = 0.02}, nodes = e.config.ref_table}, config = (not e.config.ref_table or not e.config.ref_table[1].config.card_pos or e.config.ref_table[1].config.card_pos > G.ROOM.T.w * 0.4) and ({offset = {x = -0.03, y = 0}, align = "cl", parent = e}) or ({offset = {x = 0.03, y = 0}, align = "cr", parent = e})})
        e.children.info:align_to_major()
        e.config.ref_table = nil
    end
end
G.FUNCS.use_card = function(self, e, mute, nosave)
    e.config.button = nil
    local card = e.config.ref_table
    local area = card.area
    local prev_state = G.STATE
    local dont_dissolve = nil
    local delay_fac = 1
    if card:check_use() then
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                e.disable_button = nil
                e.config.button = "use_card"
                return true
            end}
        ))
        return
    end
    if card.ability.set == "Booster" and not nosave and G.STATE == G.STATES.SHOP then
        save_with_action(_G, {type = "use_card", card = card.sort_id})
    end
    G.TAROT_INTERRUPT = G.STATE
    if card.ability.set == "Booster" then
        G.GAME.PACK_INTERRUPT = G.STATE
    end
    G.STATE = G.STATE == G.STATES.TAROT_PACK and G.STATES.TAROT_PACK or G.STATE == G.STATES.PLANET_PACK and G.STATES.PLANET_PACK or G.STATE == G.STATES.SPECTRAL_PACK and G.STATES.SPECTRAL_PACK or G.STATE == G.STATES.STANDARD_PACK and G.STATES.STANDARD_PACK or G.STATE == G.STATES.SMODS_BOOSTER_OPENED and G.STATES.SMODS_BOOSTER_OPENED or G.STATE == G.STATES.BUFFOON_PACK and G.STATES.BUFFOON_PACK or G.STATES.PLAY_TAROT
    G.CONTROLLER.locks.use = true
    if G.booster_pack and not G.booster_pack.alignment.offset.py and (card.ability.consumeable or not (G.GAME.pack_choices and G.GAME.pack_choices > 1)) then
        G.booster_pack.alignment.offset.py = G.booster_pack.alignment.offset.y
        G.booster_pack.alignment.offset.y = G.ROOM.T.y + 29
    end
    if G.shop and not G.shop.alignment.offset.py then
        G.shop.alignment.offset.py = G.shop.alignment.offset.y
        G.shop.alignment.offset.y = G.ROOM.T.y + 29
    end
    if G.blind_select and not G.blind_select.alignment.offset.py then
        G.blind_select.alignment.offset.py = G.blind_select.alignment.offset.y
        G.blind_select.alignment.offset.y = G.ROOM.T.y + 39
    end
    if G.round_eval and not G.round_eval.alignment.offset.py then
        G.round_eval.alignment.offset.py = G.round_eval.alignment.offset.y
        G.round_eval.alignment.offset.y = G.ROOM.T.y + 29
    end
    if card.children.use_button then
        card.children.use_button:remove()
        card.children.use_button = nil
    end
    if card.children.sell_button then
        card.children.sell_button:remove()
        card.children.sell_button = nil
    end
    if card.children.price then
        card.children.price:remove()
        card.children.price = nil
    end
    local nc
    if card.ability.consumeable then
        local obj = card.config.center
        if obj.keep_on_use and type(obj.keep_on_use) == "function" then
            nc = obj:keep_on_use(card)
        end
    end
    if card.area and (not nc or card.area == G.pack_cards) then
        card.area:remove_card(card)
    end
    if booster_obj and booster_obj.select_card then
        local area = type(booster_obj.select_card) == "table" and (booster_obj.select_card[e.config.ref_table.ability.set] or nil) or booster_obj.select_card
        G[area]:emplace(card)
        play_sound(_G, "card1", 0.8, 0.6)
        play_sound(_G, "generic1")
        dont_dissolve = true
        delay_fac = 0.2
    elseif card.ability.consumeable then
        if nc then
            if area then
                area:remove_from_highlighted(card)
            end
            play_sound(_G, "cardSlide2", nil, 0.3)
            dont_dissolve = true
        end
        if G.STATE == G.STATES.TAROT_PACK or G.STATE == G.STATES.PLANET_PACK or G.STATE == G.STATES.SPECTRAL_PACK or G.STATE == G.STATES.SMODS_BOOSTER_OPENED then
            card.T.x = G.hand.T.x + G.hand.T.w / 2 - card.T.w / 2
            card.T.y = G.hand.T.y + G.hand.T.h / 2 - card.T.h / 2 - 0.5
            discover_card(_G, card.config.center)
        elseif not nc then
            draw_card(
                _G,
                G.hand,
                G.play,
                1,
                "up",
                true,
                card,
                nil,
                mute
            )
        end
        delay(_G, 0.2)
        e.config.ref_table:use_consumeable(area)
        SMODS:calculate_context({using_consumeable = true, consumeable = card})
    elseif card.ability.set == "Enhanced" or card.ability.set == "Default" then
        G.playing_card = G.playing_card and G.playing_card + 1 or 1
        G.deck:emplace(card)
        play_sound(_G, "card1", 0.8, 0.6)
        play_sound(_G, "generic1")
        card.playing_card = G.playing_card
        playing_card_joker_effects(_G, {card})
        card:add_to_deck()
        table.insert(G.playing_cards, card)
        dont_dissolve = true
        delay_fac = 0.2
    elseif card.ability.set == "Joker" then
        card:add_to_deck()
        G.jokers:emplace(card)
        play_sound(_G, "card1", 0.8, 0.6)
        play_sound(_G, "generic1")
        dont_dissolve = true
        delay_fac = 0.2
    elseif card.ability.set == "Booster" then
        delay(_G, 0.1)
        if card.ability.booster_pos then
            G.GAME.current_round.used_packs[card.ability.booster_pos] = "USED"
        end
        draw_card(
            _G,
            G.hand,
            G.play,
            1,
            "up",
            true,
            card,
            nil,
            true
        )
        if not card.from_tag then
            G.GAME.round_scores.cards_purchased.amt = G.GAME.round_scores.cards_purchased.amt + 1
        end
        e.config.ref_table:open()
    elseif card.ability.set == "Voucher" then
        delay(_G, 0.1)
        draw_card(
            _G,
            G.hand,
            G.play,
            1,
            "up",
            true,
            card,
            nil,
            true
        )
        G.GAME.round_scores.cards_purchased.amt = G.GAME.round_scores.cards_purchased.amt + 1
        if area == G.pack_cards then
            e.config.ref_table.cost = 0
        end
        e.config.ref_table:redeem()
    end
    if card.ability.set == "Booster" then
        G.CONTROLLER.locks.use = false
        G.TAROT_INTERRUPT = nil
    else
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.2,
                func = function(self)
                    if not dont_dissolve then
                        card:start_dissolve()
                    end
                    G.E_MANAGER:add_event(__TS__New(
                        GameEvent,
                        {
                            trigger = "after",
                            delay = 0.1,
                            func = function(self)
                                G.STATE = prev_state
                                G.TAROT_INTERRUPT = nil
                                G.CONTROLLER.locks.use = false
                                if (prev_state == G.STATES.TAROT_PACK or prev_state == G.STATES.PLANET_PACK or prev_state == G.STATES.SPECTRAL_PACK or prev_state == G.STATES.STANDARD_PACK or prev_state == G.STATES.SMODS_BOOSTER_OPENED or prev_state == G.STATES.BUFFOON_PACK) and G.booster_pack then
                                    if nc and area == G.pack_cards then
                                        G.pack_cards:remove_card(card)
                                        G.consumeables:emplace(card)
                                    end
                                    booster_obj = nil
                                    if area == G.consumeables then
                                        G.booster_pack.alignment.offset.y = G.booster_pack.alignment.offset.py
                                        G.booster_pack.alignment.offset.py = nil
                                    elseif G.GAME.pack_choices and G.GAME.pack_choices > 1 then
                                        if G.booster_pack.alignment.offset.py then
                                            G.booster_pack.alignment.offset.y = G.booster_pack.alignment.offset.py
                                            G.booster_pack.alignment.offset.py = nil
                                        end
                                        G.GAME.pack_choices = G.GAME.pack_choices - 1
                                    else
                                        G.CONTROLLER.interrupt.focus = true
                                        if prev_state == G.STATES.TAROT_PACK then
                                            inc_career_stat(_G, "c_tarot_reading_used", 1)
                                        end
                                        if prev_state == G.STATES.PLANET_PACK then
                                            inc_career_stat(_G, "c_planetarium_used", 1)
                                        end
                                        G.FUNCS:end_consumeable(nil, delay_fac)
                                    end
                                else
                                    if G.shop then
                                        G.shop.alignment.offset.y = G.shop.alignment.offset.py
                                        G.shop.alignment.offset.py = nil
                                    end
                                    if G.blind_select then
                                        G.blind_select.alignment.offset.y = G.blind_select.alignment.offset.py
                                        G.blind_select.alignment.offset.py = nil
                                    end
                                    if G.round_eval then
                                        G.round_eval.alignment.offset.y = G.round_eval.alignment.offset.py
                                        G.round_eval.alignment.offset.py = nil
                                    end
                                    if area and area.cards[1] then
                                        G.E_MANAGER:add_event(__TS__New(
                                            GameEvent,
                                            {func = function(self)
                                                G.E_MANAGER:add_event(__TS__New(
                                                    GameEvent,
                                                    {func = function(self)
                                                        G.CONTROLLER.interrupt.focus = nil
                                                        if card.ability.set == "Voucher" then
                                                            G.CONTROLLER:snap_to({node = G.shop:get_UIE_by_ID("next_round_button")})
                                                        elseif area then
                                                            G.CONTROLLER:recall_cardarea_focus(area)
                                                        end
                                                        return true
                                                    end}
                                                ))
                                                return true
                                            end}
                                        ))
                                    end
                                end
                                return true
                            end
                        }
                    ))
                    return true
                end
            }
        ))
    end
end
G.FUNCS.sell_card = function(self, e)
    local card = e.config.ref_table
    card:sell_card()
    SMODS:calculate_context({selling_card = true, card = card})
end
G.FUNCS.can_confirm_contest_name = function(self, e)
    if G.SETTINGS.COMP and G.SETTINGS.COMP.name ~= "" then
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
    else
        e.config.colour = G.C.PALE_GREEN
        e.config.button = "confirm_contest_name"
    end
end
G.FUNCS.confirm_contest_name = function(self, e)
    G.SETTINGS.COMP.submission_name = true
    if G.MAIN_MENU_UI then
        G.MAIN_MENU_UI:remove()
    end
    if G.PROFILE_BUTTON then
        G.PROFILE_BUTTON:remove()
    end
    set_main_menu_UI(_G)
    G:save_progress()
    G.FILE_HANDLER.force = true
end
G.FUNCS.change_contest_name = function(self, e)
    G.SETTINGS.COMP.name = ""
    if G.MAIN_MENU_UI then
        G.MAIN_MENU_UI:remove()
    end
    if G.PROFILE_BUTTON then
        G.PROFILE_BUTTON:remove()
    end
    set_main_menu_UI(_G)
end
G.FUNCS.skip_tutorial_section = function(self, e)
    G.OVERLAY_TUTORIAL.skip_steps = true
    if G.OVERLAY_TUTORIAL.Jimbo then
        G.OVERLAY_TUTORIAL.Jimbo:remove()
    end
    if G.OVERLAY_TUTORIAL.content then
        G.OVERLAY_TUTORIAL.content:remove()
    end
    G.OVERLAY_TUTORIAL:remove()
    G.OVERLAY_TUTORIAL = nil
    G.E_MANAGER:clear_queue("tutorial")
    if G.SETTINGS.tutorial_progress.section == "small_blind" then
        G.SETTINGS.tutorial_progress.completed_parts.small_blind = true
    elseif G.SETTINGS.tutorial_progress.section == "big_blind" then
        G.SETTINGS.tutorial_progress.completed_parts.big_blind = true
        G.SETTINGS.tutorial_progress.forced_tags = nil
    elseif G.SETTINGS.tutorial_progress.section == "second_hand" then
        G.SETTINGS.tutorial_progress.completed_parts.second_hand = true
        G.SETTINGS.tutorial_progress.hold_parts.second_hand = true
    elseif G.SETTINGS.tutorial_progress.section == "first_hand" then
        G.SETTINGS.tutorial_progress.completed_parts.first_hand = true
        G.SETTINGS.tutorial_progress.completed_parts.first_hand_2 = true
        G.SETTINGS.tutorial_progress.completed_parts.first_hand_3 = true
        G.SETTINGS.tutorial_progress.completed_parts.first_hand_4 = true
        G.SETTINGS.tutorial_progress.completed_parts.first_hand_section = true
    elseif G.SETTINGS.tutorial_progress.section == "shop" then
        G.SETTINGS.tutorial_progress.completed_parts.shop_1 = true
        G.SETTINGS.tutorial_progress.forced_voucher = nil
    end
end
G.FUNCS.shop_voucher_empty = function(self, e)
    if G.shop_vouchers and G.shop_vouchers.cards and (G.shop_vouchers.cards[1] or G.GAME.current_round.voucher) then
        e.states.visible = false
    elseif G.SETTINGS.language ~= "en-us" then
        e.states.visible = false
    else
        e.states.visible = true
    end
end
G.FUNCS.check_for_buy_space = function(self, card)
    if card.ability.set ~= "Voucher" and card.ability.set ~= "Enhanced" and card.ability.set ~= "Default" and not (card.ability.set == "Joker" and G.jokers.cards.length < G.jokers.config.card_limit + (card.edition and card.edition.negative and 1 or 0)) and not (card.ability.consumeable and G.consumeables.cards.length < G.consumeables.config.card_limit + (card.edition and card.edition.negative and 1 or 0)) then
        alert_no_space(_G, card, card.ability.consumeable and G.consumeables or G.jokers)
        return false
    end
    return true
end
G.FUNCS.buy_from_shop = function(self, e)
    local c1 = e.config.ref_table
    if c1 and c1:is(Card) then
        if e.config.id ~= "buy_and_use" then
            if not G.FUNCS:check_for_buy_space(c1) then
                e.disable_button = nil
                return false
            end
        end
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.1,
                func = function(self)
                    c1.area:remove_card(c1)
                    c1:add_to_deck()
                    if c1.children.price then
                        c1.children.price:remove()
                    end
                    c1.children.price = nil
                    if c1.children.buy_button then
                        c1.children.buy_button:remove()
                    end
                    c1.children.buy_button = nil
                    remove_nils(_G, c1.children)
                    if c1.ability.set == "Default" or c1.ability.set == "Enhanced" then
                        inc_career_stat(_G, "c_playing_cards_bought", 1)
                        G.playing_card = G.playing_card and G.playing_card + 1 or 1
                        G.deck:emplace(c1)
                        c1.playing_card = G.playing_card
                        playing_card_joker_effects(_G, {c1})
                        table.insert(G.playing_cards, c1)
                    elseif e.config.id ~= "buy_and_use" then
                        if c1.ability.consumeable then
                            G.consumeables:emplace(c1)
                        else
                            G.jokers:emplace(c1)
                        end
                        G.E_MANAGER:add_event(__TS__New(
                            GameEvent,
                            {func = function(self)
                                local eval, post = __TS__Unpack(eval_card(_G, c1, {buying_card = true, card = c1}))
                                SMODS:trigger_effects({eval, post}, c1)
                                return true
                            end}
                        ))
                    end
                    G.GAME.round_scores.cards_purchased.amt = G.GAME.round_scores.cards_purchased.amt + 1
                    if c1.ability.consumeable then
                        if c1.config.center.set == "Planet" then
                            inc_career_stat(_G, "c_planets_bought", 1)
                        elseif c1.config.center.set == "Tarot" then
                            inc_career_stat(_G, "c_tarots_bought", 1)
                        end
                    elseif c1.ability.set == "Joker" then
                        G.GAME.current_round.jokers_purchased = G.GAME.current_round.jokers_purchased + 1
                    end
                    SMODS:calculate_context({buying_card = true, card = c1})
                    if G.GAME.modifiers.inflation then
                        G.GAME.inflation = G.GAME.inflation + 1
                        G.E_MANAGER:add_event(__TS__New(
                            GameEvent,
                            {func = function(self)
                                for k, v in pairs(G.I.CARD) do
                                    if v.set_cost then
                                        v:set_cost()
                                    end
                                end
                                return true
                            end}
                        ))
                    end
                    play_sound(_G, "card1")
                    inc_career_stat(_G, "c_shop_dollars_spent", c1.cost)
                    if c1.cost ~= 0 then
                        ease_dollars(_G, -c1.cost)
                    end
                    G.CONTROLLER:save_cardarea_focus("jokers")
                    G.CONTROLLER:recall_cardarea_focus("jokers")
                    if e.config.id == "buy_and_use" then
                        G.FUNCS:use_card(e, true)
                    end
                    return true
                end
            }
        ))
    end
end
G.FUNCS.toggle_shop = function(self, e)
    stop_use(_G)
    G.CONTROLLER.locks.toggle_shop = true
    if G.shop then
        SMODS:calculate_context({ending_shop = true})
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    G.shop.alignment.offset.y = G.ROOM.T.y + 29
                    G.SHOP_SIGN.alignment.offset.y = -15
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
                    G.shop:remove()
                    G.shop = nil
                    G.SHOP_SIGN:remove()
                    G.SHOP_SIGN = nil
                    G.STATE_COMPLETE = false
                    G.STATE = G.STATES.BLIND_SELECT
                    G.CONTROLLER.locks.toggle_shop = nil
                    return true
                end
            }
        ))
    end
end
G.FUNCS.select_blind = function(self, e)
    stop_use(_G)
    if G.blind_select then
        G.GAME.facing_blind = true
        G.blind_prompt_box:get_UIE_by_ID("prompt_dynatext1").config.object.pop_delay = 0
        G.blind_prompt_box:get_UIE_by_ID("prompt_dynatext1").config.object:pop_out(5)
        G.blind_prompt_box:get_UIE_by_ID("prompt_dynatext2").config.object.pop_delay = 0
        G.blind_prompt_box:get_UIE_by_ID("prompt_dynatext2").config.object:pop_out(5)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "before",
                delay = 0.2,
                func = function(self)
                    G.blind_prompt_box.alignment.offset.y = -10
                    G.blind_select.alignment.offset.y = 40
                    G.blind_select.alignment.offset.x = 0
                    return true
                end
            }
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    ease_round(_G, 1)
                    inc_career_stat(_G, "c_rounds", 1)
                    if _DEMO then
                        G.SETTINGS.DEMO_ROUNDS = (G.SETTINGS.DEMO_ROUNDS or 0) + 1
                        inc_steam_stat(_G, "demo_rounds")
                        G:save_settings()
                    end
                    G.GAME.round_resets.blind = e.config.ref_table
                    G.GAME.round_resets.blind_states[G.GAME.blind_on_deck] = "Current"
                    G.blind_select:remove()
                    G.blind_prompt_box:remove()
                    G.blind_select = nil
                    delay(_G, 0.2)
                    return true
                end
            }
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    new_round(_G)
                    return true
                end
            }
        ))
    end
end
G.FUNCS.skip_booster = function(self, e)
    booster_obj = nil
    SMODS:calculate_context({skipping_booster = true})
    G.FUNCS:end_consumeable(e)
end
G.FUNCS.end_consumeable = function(self, e, delayfac)
    delayfac = delayfac or 1
    stop_use(_G)
    if G.booster_pack then
        if G.booster_pack_sparkles then
            G.booster_pack_sparkles:fade(1 * delayfac)
        end
        if G.booster_pack_stars then
            G.booster_pack_stars:fade(1 * delayfac)
        end
        if G.booster_pack_meteors then
            G.booster_pack_meteors:fade(1 * delayfac)
        end
        G.booster_pack.alignment.offset.y = G.ROOM.T.y + 9
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.2 * delayfac,
                blocking = false,
                blockable = false,
                func = function(self)
                    G.booster_pack:remove()
                    G.booster_pack = nil
                    return true
                end
            }
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 1 * delayfac,
                blocking = false,
                blockable = false,
                func = function(self)
                    if G.booster_pack_sparkles then
                        G.booster_pack_sparkles:remove()
                        G.booster_pack_sparkles = nil
                    end
                    if G.booster_pack_stars then
                        G.booster_pack_stars:remove()
                        G.booster_pack_stars = nil
                    end
                    if G.booster_pack_meteors then
                        G.booster_pack_meteors:remove()
                        G.booster_pack_meteors = nil
                    end
                    return true
                end
            }
        ))
    end
    delay(_G, 0.2 * delayfac)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.2 * delayfac,
            func = function(self)
                G.FUNCS:draw_from_hand_to_deck()
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "after",
                        delay = 0.2 * delayfac,
                        func = function(self)
                            if G.shop and G.shop.alignment.offset.py then
                                G.shop.alignment.offset.y = G.shop.alignment.offset.py
                                G.shop.alignment.offset.py = nil
                            end
                            if G.blind_select and G.blind_select.alignment.offset.py then
                                G.blind_select.alignment.offset.y = G.blind_select.alignment.offset.py
                                G.blind_select.alignment.offset.py = nil
                            end
                            if G.round_eval and G.round_eval.alignment.offset.py then
                                G.round_eval.alignment.offset.y = G.round_eval.alignment.offset.py
                                G.round_eval.alignment.offset.py = nil
                            end
                            G.CONTROLLER.interrupt.focus = true
                            G.E_MANAGER:add_event(__TS__New(
                                GameEvent,
                                {func = function(self)
                                    if G.shop then
                                        G.CONTROLLER:snap_to({node = G.shop:get_UIE_by_ID("next_round_button")})
                                    end
                                    return true
                                end}
                            ))
                            G.STATE = G.GAME.PACK_INTERRUPT
                            ease_background_colour_blind(_G, G.GAME.PACK_INTERRUPT)
                            G.GAME.PACK_INTERRUPT = nil
                            return true
                        end
                    }
                ))
                do
                    local i = 1
                    while i <= G.GAME.tags.length do
                        if G.GAME.tags[i]:apply_to_run({type = "new_blind_choice"}) then
                            break
                        end
                        i = i + 1
                    end
                end
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "after",
                        delay = 0.2 * delayfac,
                        func = function(self)
                            save_run(_G)
                            return true
                        end
                    }
                ))
                return true
            end
        }
    ))
end
G.FUNCS.blind_choice_handler = function(self, e)
    if not e.config.ref_table.run_info and G.blind_select and G.blind_select.VT.y < 10 and e.config.id and G.blind_select_opts[string.lower(e.config.id)] then
        if e.UIBox.role.xy_bond ~= "Weak" then
            e.UIBox:set_role({xy_bond = "Weak"})
        end
        if e.config.ref_table.deck ~= "on" and e.config.id == G.GAME.blind_on_deck or e.config.ref_table.deck ~= "off" and e.config.id ~= G.GAME.blind_on_deck then
            local _blind_choice = G.blind_select_opts[string.lower(e.config.id)]
            local _top_button = e.UIBox:get_UIE_by_ID("select_blind_button")
            local _border = e.UIBox.UIRoot.children[1].children[1]
            local _tag = e.UIBox:get_UIE_by_ID("tag_" .. tostring(e.config.id))
            local _tag_container = e.UIBox:get_UIE_by_ID("tag_container")
            if _tag_container and not G.SETTINGS.tutorial_complete and not G.SETTINGS.tutorial_progress.completed_parts.shop_1 then
                _tag_container.states.visible = false
            elseif _tag_container then
                _tag_container.states.visible = true
            end
            if e.config.id == G.GAME.blind_on_deck then
                e.config.ref_table.deck = "on"
                e.config.draw_after = false
                e.config.colour = G.C.CLEAR
                _border.parent.config.outline = 2
                _border.parent.config.outline_colour = G.C.UI.TRANSPARENT_DARK
                _border.config.outline_colour = _border.config.outline and _border.config.outline_colour or get_blind_main_colour(_G, e.config.id)
                _border.config.outline = 1.5
                _blind_choice.alignment.offset.y = -0.9
                if _tag and _tag_container then
                    _tag_container.children[2].config.draw_after = false
                    _tag_container.children[2].config.colour = G.C.BLACK
                    _tag.children[2].config.button = "skip_blind"
                    _tag.config.outline_colour = adjust_alpha(_G, G.C.BLUE, 0.5)
                    _tag.children[2].config.hover = true
                    _tag.children[2].config.colour = G.C.RED
                    _tag.children[2].children[1].config.colour = G.C.UI.TEXT_LIGHT
                    local _sprite = _tag.config.ref_table
                    _sprite.config.force_focus = nil
                end
                if _top_button then
                    G.E_MANAGER:add_event(__TS__New(
                        GameEvent,
                        {func = function(self)
                            G.CONTROLLER:snap_to({node = _top_button})
                            return true
                        end}
                    ))
                    _top_button.config.button = "select_blind"
                    _top_button.config.colour = G.C.FILTER
                    _top_button.config.hover = true
                    _top_button.children[1].config.colour = G.C.WHITE
                end
            elseif e.config.id ~= G.GAME.blind_on_deck then
                e.config.ref_table.deck = "off"
                e.config.draw_after = true
                e.config.colour = adjust_alpha(
                    _G,
                    G.GAME.round_resets.blind_states[e.config.id] == "Skipped" and mix_colours(_G, G.C.BLUE, G.C.L_BLACK, 0.1) or G.C.L_BLACK,
                    0.5
                )
                _border.parent.config.outline = nil
                _border.parent.config.outline_colour = nil
                _border.config.outline_colour = nil
                _border.config.outline = nil
                _blind_choice.alignment.offset.y = -0.2
                if _tag and _tag_container then
                    if G.GAME.round_resets.blind_states[e.config.id] == "Skipped" or G.GAME.round_resets.blind_states[e.config.id] == "Defeated" then
                        _tag_container.children[2]:set_role({xy_bond = "Weak"})
                        _tag_container.children[2]:align(0, 10)
                        _tag_container.children[1]:set_role({xy_bond = "Weak"})
                        _tag_container.children[1]:align(0, 10)
                    end
                    if G.GAME.round_resets.blind_states[e.config.id] == "Skipped" then
                        _blind_choice.children.alert = __TS__New(
                            UIBox,
                            {
                                definition = create_UIBox_card_alert(
                                    _G,
                                    {
                                        text_rot = -0.35,
                                        no_bg = true,
                                        text = localize(_G, "k_skipped_cap"),
                                        bump_amount = 1,
                                        scale = 0.9,
                                        maxw = 3.4
                                    }
                                ),
                                config = {align = "tmi", offset = {x = 0, y = 2.2}, major = _blind_choice, parent = _blind_choice}
                            }
                        )
                    end
                    _tag.children[2].config.button = nil
                    _tag.config.outline_colour = G.C.UI.BACKGROUND_INACTIVE
                    _tag.children[2].config.hover = false
                    _tag.children[2].config.colour = G.C.UI.BACKGROUND_INACTIVE
                    _tag.children[2].children[1].config.colour = G.C.UI.TEXT_INACTIVE
                    local _sprite = _tag.config.ref_table
                    _sprite.config.force_focus = true
                end
                if _top_button then
                    _top_button.config.colour = G.C.UI.BACKGROUND_INACTIVE
                    _top_button.config.button = nil
                    _top_button.config.hover = false
                    _top_button.children[1].config.colour = G.C.UI.TEXT_INACTIVE
                end
            end
        end
    end
end
G.FUNCS.hover_tag_proxy = function(self, e)
    if not e.parent or not e.parent.states then
        return
    end
    if (e.states.hover.is or e.parent.states.hover.is) and e.created_on_pause == G.SETTINGS.paused and not e.parent.children.alert then
        local _sprite = e.config.ref_table:get_uibox_table()
        e.parent.children.alert = __TS__New(
            UIBox,
            {
                definition = G.UIDEF:card_h_popup(_sprite),
                config = {align = "tm", offset = {x = 0, y = -0.1}, major = e.parent, instance_type = "POPUP"}
            }
        )
        _sprite:juice_up(0.05, 0.02)
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
        e.parent.children.alert.states.collide.can = false
    elseif e.parent.children.alert and (not e.states.collide.is and not e.parent.states.collide.is or e.created_on_pause ~= G.SETTINGS.paused) then
        e.parent.children.alert:remove()
        e.parent.children.alert = nil
    end
end
G.FUNCS.skip_blind = function(self, e)
    stop_use(_G)
    G.CONTROLLER.locks.skip_blind = true
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            trigger = "after",
            blocking = false,
            blockable = false,
            delay = 2.5,
            timer = "TOTAL",
            func = function(self)
                G.CONTROLLER.locks.skip_blind = nil
                return true
            end
        }
    ))
    local _tag = e.UIBox:get_UIE_by_ID("tag_container")
    G.GAME.skips = (G.GAME.skips or 0) + 1
    if _tag then
        add_tag(_G, _tag.config.ref_table)
        local skipped, skip_to = G.GAME.blind_on_deck or "Small", G.GAME.blind_on_deck == "Small" and "Big" or G.GAME.blind_on_deck == "Big" and "Boss" or "Boss"
        G.GAME.round_resets.blind_states[skipped] = "Skipped"
        G.GAME.round_resets.blind_states[skip_to] = "Select"
        G.GAME.blind_on_deck = skip_to
        play_sound(_G, "generic1")
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    delay(_G, 0.3)
                    SMODS:calculate_context({skip_blind = true})
                    save_run(_G)
                    do
                        local i = 1
                        while i <= G.GAME.tags.length do
                            G.GAME.tags[i]:apply_to_run({type = "immediate"})
                            i = i + 1
                        end
                    end
                    do
                        local i = 1
                        while i <= G.GAME.tags.length do
                            if G.GAME.tags[i]:apply_to_run({type = "new_blind_choice"}) then
                                break
                            end
                            i = i + 1
                        end
                    end
                    return true
                end
            }
        ))
    end
end
G.FUNCS.reroll_boss_button = function(self, e)
    if G.GAME.dollars - G.GAME.bankrupt_at - 10 >= 0 and (G.GAME.used_vouchers.v_retcon or G.GAME.used_vouchers.v_directors_cut and not G.GAME.round_resets.boss_rerolled) then
        e.config.colour = G.C.RED
        e.config.button = "reroll_boss"
        e.children[1].children[1].config.shadow = true
        if e.children[2] then
            e.children[2].children[1].config.shadow = true
        end
    else
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE
        e.config.button = nil
        e.children[1].children[1].config.shadow = false
        if e.children[2] then
            e.children[2].children[1].config.shadow = false
        end
    end
end
G.FUNCS.reroll_boss = function(self, e)
    if not G.blind_select_opts then
        G.GAME.round_resets.boss_rerolled = true
        if not G.from_boss_tag then
            ease_dollars(_G, -10)
        end
        G.from_boss_tag = nil
        G.GAME.round_resets.blind_choices.Boss = get_new_boss(_G)
        do
            local i = 1
            while i <= G.GAME.tags.length do
                if G.GAME.tags[i]:apply_to_run({type = "new_blind_choice"}) then
                    break
                end
                i = i + 1
            end
        end
        return true
    end
    stop_use(_G)
    G.GAME.round_resets.boss_rerolled = true
    if not G.from_boss_tag then
        ease_dollars(_G, -10)
    end
    G.from_boss_tag = nil
    G.CONTROLLER.locks.boss_reroll = true
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                play_sound(_G, "other1")
                G.blind_select_opts.boss:set_role({xy_bond = "Weak"})
                G.blind_select_opts.boss.alignment.offset.y = 20
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.3,
            func = function(self)
                local par = G.blind_select_opts.boss.parent
                G.GAME.round_resets.blind_choices.Boss = get_new_boss(_G)
                G.blind_select_opts.boss:remove()
                G.blind_select_opts.boss = __TS__New(
                    UIBox,
                    {
                        T = {par.T.x, 0, 0, 0},
                        definition = {
                            n = G.UIT.ROOT,
                            config = {align = "cm", colour = G.C.CLEAR},
                            nodes = {UIBox_dyn_container(
                                _G,
                                {create_UIBox_blind_choice(_G, "Boss")},
                                false,
                                get_blind_main_colour(_G, "Boss"),
                                mix_colours(
                                    _G,
                                    G.C.BLACK,
                                    get_blind_main_colour(_G, "Boss"),
                                    0.8
                                )
                            )}
                        },
                        config = {align = "bmi", offset = {x = 0, y = G.ROOM.T.y + 9}, major = par, xy_bond = "Weak"}
                    }
                )
                par.config.object = G.blind_select_opts.boss
                par.config.object:recalculate()
                G.blind_select_opts.boss.parent = par
                G.blind_select_opts.boss.alignment.offset.y = 0
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        blocking = false,
                        trigger = "after",
                        delay = 0.5,
                        func = function(self)
                            G.CONTROLLER.locks.boss_reroll = nil
                            return true
                        end
                    }
                ))
                save_run(_G)
                do
                    local i = 1
                    while i <= G.GAME.tags.length do
                        if G.GAME.tags[i]:apply_to_run({type = "new_blind_choice"}) then
                            break
                        end
                        i = i + 1
                    end
                end
                return true
            end
        }
    ))
end
G.FUNCS.reroll_shop = function(self, e)
    stop_use(_G)
    G.CONTROLLER.locks.shop_reroll = true
    if G.CONTROLLER:save_cardarea_focus("shop_jokers") then
        G.CONTROLLER.interrupt.focus = true
    end
    if G.GAME.current_round.reroll_cost > 0 then
        inc_career_stat(_G, "c_shop_dollars_spent", G.GAME.current_round.reroll_cost)
        inc_career_stat(_G, "c_shop_rerolls", 1)
        ease_dollars(_G, -G.GAME.current_round.reroll_cost)
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                local final_free = G.GAME.current_round.free_rerolls > 0
                G.GAME.current_round.free_rerolls = math.max(G.GAME.current_round.free_rerolls - 1, 0)
                G.GAME.round_scores.times_rerolled.amt = G.GAME.round_scores.times_rerolled.amt + 1
                calculate_reroll_cost(_G, final_free)
                do
                    local i = G.shop_jokers.cards.length
                    while i <= 1 do
                        local c = G.shop_jokers:remove_card(G.shop_jokers.cards[i])
                        c:remove()
                        c = nil
                        i = i + -1
                    end
                end
                play_sound(_G, "coin2")
                play_sound(_G, "other1")
                do
                    local i = 1
                    while i <= G.GAME.shop.joker_max - G.shop_jokers.cards.length do
                        local new_shop_card = create_card_for_shop(_G, G.shop_jokers)
                        G.shop_jokers:emplace(new_shop_card)
                        new_shop_card:juice_up()
                        i = i + 1
                    end
                end
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.3,
            func = function(self)
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {func = function(self)
                        G.CONTROLLER.interrupt.focus = false
                        G.CONTROLLER.locks.shop_reroll = false
                        G.CONTROLLER:recall_cardarea_focus("shop_jokers")
                        SMODS:calculate_context({reroll_shop = true})
                        return true
                    end}
                ))
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {func = function(self)
            save_run(_G)
            return true
        end}
    ))
end
G.FUNCS.cash_out = function(self, e)
    stop_use(_G)
    if G.round_eval then
        e.config.button = nil
        G.round_eval.alignment.offset.y = G.ROOM.T.y + 15
        G.round_eval.alignment.offset.x = 0
        G.deck:shuffle("cashout" .. tostring(G.GAME.round_resets.ante))
        G.deck:hard_set_T()
        delay(_G, 0.3)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    if G.round_eval then
                        G.round_eval:remove()
                        G.round_eval = nil
                    end
                    G.GAME.current_round.jokers_purchased = 0
                    G.GAME.current_round.discards_left = math.max(0, G.GAME.round_resets.discards + G.GAME.round_bonus.discards)
                    G.GAME.current_round.hands_left = math.max(1, G.GAME.round_resets.hands + G.GAME.round_bonus.next_hands)
                    G.STATE = G.STATES.SHOP
                    G.GAME.shop_free = nil
                    G.GAME.shop_d6ed = nil
                    G.STATE_COMPLETE = false
                    return true
                end
            }
        ))
        ease_dollars(_G, G.GAME.current_round.dollars)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                G.GAME.previous_round.dollars = G.GAME.dollars
                return true
            end}
        ))
        play_sound(_G, "coin7")
        G.VIBRATION = G.VIBRATION + 1
    end
    ease_chips(_G, 0)
    if G.GAME.round_resets.blind_states.Boss == "Defeated" then
        G.GAME.round_resets.blind_ante = G.GAME.round_resets.ante
        G.GAME.round_resets.blind_tags.Small = get_next_tag_key(_G)
        G.GAME.round_resets.blind_tags.Big = get_next_tag_key(_G)
    end
    reset_blinds(_G)
    delay(_G, 0.6)
end
G.FUNCS.start_run = function(self, e, args)
    args = args or ({})
    G.SETTINGS.paused = true
    if e and e.config.id == "restart_button" then
        G.GAME.viewed_back = nil
    end
    G.E_MANAGER:clear_queue()
    G.FUNCS:wipe_on()
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            func = function(self)
                G:delete_run()
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            no_delete = true,
            func = function(self)
                G:start_run(args)
                return true
            end
        }
    ))
    G.FUNCS:wipe_off()
end
G.FUNCS.go_to_menu = function(self, e)
    G.SETTINGS.paused = true
    G.E_MANAGER:clear_queue()
    G.FUNCS:wipe_on()
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            func = function(self)
                G:delete_run()
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            blockable = true,
            blocking = false,
            func = function(self)
                G:main_menu("game")
                return true
            end
        }
    ))
    G.FUNCS:wipe_off()
end
G.FUNCS.go_to_demo_cta = function(self, e)
    G.SETTINGS.paused = true
    G.E_MANAGER:clear_queue(nil, G.exception_queue)
    play_sound(_G, "explosion_buildup1", nil, 0.3)
    play_sound(_G, "whoosh1", 0.7, 0.8)
    play_sound(_G, "introPad1", 0.704, 0.8)
    G.video_organ = 0.6
    G.FUNCS:wipe_on(nil, true, nil, G.C.WHITE)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            func = function(self)
                G:delete_run()
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            blockable = true,
            blocking = false,
            func = function(self)
                G:demo_cta()
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "after",
                        delay = 0.3,
                        no_delete = true,
                        blockable = false,
                        blocking = false,
                        func = function(self)
                            G.video_organ = nil
                            G.normal_music_speed = nil
                            return true
                        end
                    }
                ))
                return true
            end
        }
    ))
    G.FUNCS:wipe_off()
end
G.FUNCS.show_main_cta = function(self, e)
    if e then
        if e.config.id == "lose_cta" and not G.SETTINGS.DEMO.lose_CTA_shown then
            G.SETTINGS.DEMO.lose_CTA_shown = true
        end
        if e.config.id == "win_cta" and not G.SETTINGS.DEMO.win_CTA_shown then
            G.SETTINGS.DEMO.win_CTA_shown = true
        end
    end
    G:save_progress()
    G.SETTINGS.paused = true
    G.normal_music_speed = true
    G.FUNCS:overlay_menu({
        definition = create_UIBox_demo_video_CTA(_G),
        config = {no_esc = true}
    })
end
G.FUNCS.wipe_on = function(self, message, no_card, timefac, alt_colour)
    timefac = timefac or 1
    if G.screenwipe then
        return
    end
    G.CONTROLLER.locks.wipe = true
    G.STAGE_OBJECT_INTERRUPT = true
    local colours = {
        black = HEX(_G, "4f6367FF"),
        white = {1, 1, 1, 1}
    }
    if not no_card then
        G.screenwipecard = __TS__New(
            Card,
            1,
            1,
            G.CARD_W,
            G.CARD_H,
            pseudorandom_element(_G, G.P_CARDS),
            G.P_CENTERS.c_base
        )
        G.screenwipecard.sprite_facing = "back"
        G.screenwipecard.facing = "back"
        G.screenwipecard.states.hover.can = false
        G.screenwipecard:juice_up(0.5, 1)
    end
    local message_t = nil
    if message then
        message_t = {}
        for k, v in ipairs(message) do
            table.insert(
                message_t,
                {
                    n = G.UIT.R,
                    config = {align = "cm"},
                    nodes = {{
                        n = G.UIT.O,
                        config = {object = DynaText(
                            _G,
                            {
                                string = v or "",
                                colours = {math.min(G.C.BACKGROUND.C[2], G.C.BACKGROUND.C[3]) > 0.5 and G.C.BLACK or G.C.WHITE},
                                shadow = true,
                                silent = k ~= 1,
                                float = true,
                                scale = 1.3,
                                pop_in = 0,
                                pop_in_rate = 2,
                                rotate = 1
                            }
                        )}
                    }}
                }
            )
        end
    end
    G.screenwipe = __TS__New(UIBox, {definition = {n = G.UIT.ROOT, config = {
        align = "cm",
        minw = 0,
        minh = 0,
        padding = 0.15,
        r = 0.1,
        colour = G.C.CLEAR
    }, nodes = {{n = G.UIT.R, config = {align = "cm"}, nodes = {message and ({n = G.UIT.R, config = {id = "text", align = "cm", padding = 0.7}, nodes = message_t}) or nil, not no_card and ({n = G.UIT.O, config = {object = G.screenwipecard, role = {role_type = "Major"}}}) or nil}}}}, config = {align = "cm", offset = {x = 0, y = 0}, major = G.ROOM_ATTACH}})
    G.screenwipe.colours = colours
    G.screenwipe.children.particles = Particles(
        _G,
        0,
        0,
        0,
        0,
        {
            timer = 0,
            max = 1,
            scale = 40,
            speed = 0,
            lifespan = 1.7 * timefac,
            attach = G.screenwipe,
            colours = {alt_colour or G.C.BACKGROUND.C}
        }
    )
    G.STAGE_OBJECT_INTERRUPT = nil
    G.screenwipe.alignment.offset.y = 0
    if message then
        for k, v in ipairs(G.screenwipe:get_UIE_by_ID("text").children) do
            v.children[1].config.object:pulse()
        end
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "before",
            delay = 0.7,
            no_delete = true,
            blockable = false,
            func = function(self)
                if not no_card then
                    G.screenwipecard:flip()
                    play_sound(_G, "cardFan2")
                end
                return true
            end
        }
    ))
end
G.FUNCS.wipe_off = function(self)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            no_delete = true,
            func = function(self)
                delay(_G, 0.3)
                G.screenwipe.children.particles.max = 0
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "ease",
                        no_delete = true,
                        blockable = false,
                        blocking = false,
                        timer = "REAL",
                        ref_table = G.screenwipe.colours.black,
                        ref_value = 4,
                        ease_to = 0,
                        delay = 0.3,
                        func = function(self, t)
                            return t
                        end
                    }
                ))
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "ease",
                        no_delete = true,
                        blockable = false,
                        blocking = false,
                        timer = "REAL",
                        ref_table = G.screenwipe.colours.white,
                        ref_value = 4,
                        ease_to = 0,
                        delay = 0.3,
                        func = function(self, t)
                            return t
                        end
                    }
                ))
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.55,
            no_delete = true,
            blocking = false,
            timer = "REAL",
            func = function(self)
                if G.screenwipecard then
                    G.screenwipecard:start_dissolve({G.C.BLACK, G.C.ORANGE, G.C.GOLD, G.C.RED})
                end
                if G.screenwipe:get_UIE_by_ID("text") then
                    for k, v in ipairs(G.screenwipe:get_UIE_by_ID("text").children) do
                        v.children[1].config.object:pop_out(4)
                    end
                end
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 1.1,
            no_delete = true,
            blocking = false,
            timer = "REAL",
            func = function(self)
                G.screenwipe.children.particles:remove()
                G.screenwipe:remove()
                G.screenwipe.children.particles = nil
                G.screenwipe = nil
                G.screenwipecard = nil
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 1.2,
            no_delete = true,
            blocking = true,
            timer = "REAL",
            func = function(self)
                return true
            end
        }
    ))
end
