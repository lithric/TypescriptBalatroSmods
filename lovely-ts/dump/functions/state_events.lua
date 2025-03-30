local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local __TS__Unpack = ____lualib.__TS__Unpack
function win_game(self)
    if not G.GAME.seeded and not G.GAME.challenge or SMODS.config.seeded_unlocks then
        set_joker_win(_G)
        set_deck_win(_G)
        check_and_set_high_score(_G, "win_streak", G.PROFILES[G.SETTINGS.profile + 1].high_scores.current_streak.amt + 1)
        check_and_set_high_score(_G, "current_streak", G.PROFILES[G.SETTINGS.profile + 1].high_scores.current_streak.amt + 1)
        check_for_unlock(_G, {type = "win_no_hand"})
        check_for_unlock(_G, {type = "win_no"})
        check_for_unlock(_G, {type = "win_custom"})
        check_for_unlock(_G, {type = "win_deck"})
        check_for_unlock(_G, {type = "win_stake"})
        check_for_unlock(_G, {type = "win"})
        inc_career_stat(_G, "c_wins", 1)
    end
    set_profile_progress(_G)
    if G.GAME.challenge then
        G.PROFILES[G.SETTINGS.profile + 1].challenge_progress.completed[G.GAME.challenge] = true
        set_challenge_unlock(_G)
        check_for_unlock(_G, {type = "win_challenge"})
        G:save_settings()
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                for k, v in pairs(G.I.CARD) do
                    v.sticker_run = nil
                end
                play_sound(_G, "win")
                G.SETTINGS.paused = true
                G.FUNCS:overlay_menu({
                    definition = create_UIBox_win(_G),
                    config = {no_esc = true}
                })
                local Jimbo = nil
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "after",
                        delay = 2.5,
                        blocking = false,
                        func = function(self)
                            if G.OVERLAY_MENU and G.OVERLAY_MENU:get_UIE_by_ID("jimbo_spot") then
                                Jimbo = __TS__New(Card_Character, {x = 0, y = 5})
                                local spot = G.OVERLAY_MENU:get_UIE_by_ID("jimbo_spot")
                                spot.config.object:remove()
                                spot.config.object = Jimbo
                                Jimbo.ui_object_updated = true
                                Jimbo:add_speech_bubble(
                                    "wq_" .. tostring(math.random(1, 7)),
                                    nil,
                                    {quip = true}
                                )
                                Jimbo:say_stuff(5)
                                if G.F_JAN_CTA then
                                    G.E_MANAGER:add_event(__TS__New(
                                        GameEvent,
                                        {func = function(self)
                                            Jimbo:add_button(
                                                localize(_G, "b_wishlist"),
                                                "wishlist_steam",
                                                G.C.DARK_EDITION,
                                                nil,
                                                true,
                                                1.6
                                            )
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
    if not G.GAME.seeded and not G.GAME.challenge or SMODS.config.seeded_unlocks then
        G.PROFILES[G.SETTINGS.profile + 1].stake = math.max(G.PROFILES[G.SETTINGS.profile + 1].stake or 1, (G.GAME.stake or 1) + 1)
    end
    G:save_progress()
    G.FILE_HANDLER.force = true
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                if not G.SETTINGS.paused then
                    G.GAME.current_round.round_text = "Endless Round "
                    return true
                end
            end
        }
    ))
end
function end_round(self)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.2,
            func = function(self)
                G.GAME.blind.in_blind = false
                local game_over = true
                local game_won = false
                G.RESET_BLIND_STATES = true
                G.RESET_JIGGLES = true
                if G.GAME.chips - G.GAME.blind.chips >= 0 then
                    game_over = false
                end
                SMODS.saved = false
                SMODS:calculate_context({end_of_round = true, game_over = game_over})
                if SMODS.saved then
                    game_over = false
                end
                if G.GAME.round_resets.ante == G.GAME.win_ante and G.GAME.blind:get_type() == "Boss" then
                    game_won = true
                    G.GAME.won = true
                end
                if game_over then
                    G.STATE = G.STATES.GAME_OVER
                    if not G.GAME.won and not G.GAME.seeded and not G.GAME.challenge then
                        G.PROFILES[G.SETTINGS.profile + 1].high_scores.current_streak.amt = 0
                    end
                    G:save_settings()
                    G.FILE_HANDLER.force = true
                    G.STATE_COMPLETE = false
                else
                    G.GAME.unused_discards = (G.GAME.unused_discards or 0) + G.GAME.current_round.discards_left
                    if G.GAME.blind and G.GAME.blind.config.blind then
                        discover_card(_G, G.GAME.blind.config.blind)
                    end
                    if G.GAME.blind:get_type() == "Boss" then
                        local _handname, _played, _order = "High Card", -1, 100
                        for k, v in pairs(G.GAME.hands) do
                            if v.played > _played or v.played == _played and _order > v.order then
                                _played = v.played
                                _handname = k
                            end
                        end
                        G.GAME.current_round.most_played_poker_hand = _handname
                    end
                    if G.GAME.blind:get_type() == "Boss" and not G.GAME.seeded and not G.GAME.challenge then
                        G.GAME.current_boss_streak = G.GAME.current_boss_streak + 1
                        check_and_set_high_score(_G, "boss_streak", G.GAME.current_boss_streak)
                    end
                    if G.GAME.current_round.hands_played == 1 then
                        inc_career_stat(_G, "c_single_hand_round_streak", 1)
                    else
                        if not G.GAME.seeded and not G.GAME.challenge then
                            G.PROFILES[G.SETTINGS.profile + 1].career_stats.c_single_hand_round_streak = 0
                            G:save_settings()
                        end
                    end
                    check_for_unlock(_G, {type = "round_win"})
                    set_joker_usage(_G)
                    if game_won and not G.GAME.win_notified then
                        G.GAME.win_notified = true
                        G.E_MANAGER:add_event(__TS__New(
                            GameEvent,
                            {
                                trigger = "immediate",
                                blocking = false,
                                blockable = false,
                                func = function(self)
                                    if G.STATE == G.STATES.ROUND_EVAL then
                                        win_game(_G)
                                        G.GAME.won = true
                                        return true
                                    end
                                end
                            }
                        ))
                    end
                    for _, v in ipairs(SMODS:get_card_areas("playing_cards", "end_of_round")) do
                        SMODS:calculate_end_of_round_effects({cardarea = v, end_of_round = true})
                    end
                    G.FUNCS:draw_from_hand_to_discard()
                    if G.GAME.blind:get_type() == "Boss" then
                        G.GAME.voucher_restock = nil
                        if G.GAME.modifiers.set_eternal_ante and G.GAME.round_resets.ante == G.GAME.modifiers.set_eternal_ante then
                            for k, v in ipairs(G.jokers.cards) do
                                v:set_eternal(true)
                            end
                        end
                        if G.GAME.modifiers.set_joker_slots_ante and G.GAME.round_resets.ante == G.GAME.modifiers.set_joker_slots_ante then
                            G.jokers.config.card_limit = 0
                        end
                        delay(_G, 0.4)
                        ease_ante(_G, 1)
                        delay(_G, 0.4)
                        check_for_unlock(_G, {type = "ante_up", ante = G.GAME.round_resets.ante + 1})
                    end
                    G.FUNCS:draw_from_discard_to_deck()
                    G.E_MANAGER:add_event(__TS__New(
                        GameEvent,
                        {
                            trigger = "after",
                            delay = 0.3,
                            func = function(self)
                                G.STATE = G.STATES.ROUND_EVAL
                                G.STATE_COMPLETE = false
                                if G.GAME.round_resets.blind == G.P_BLINDS.bl_small then
                                    G.GAME.round_resets.blind_states.Small = "Defeated"
                                elseif G.GAME.round_resets.blind == G.P_BLINDS.bl_big then
                                    G.GAME.round_resets.blind_states.Big = "Defeated"
                                else
                                    G.GAME.current_round.voucher = get_next_voucher_key(_G)
                                    G.GAME.round_resets.blind_states.Boss = "Defeated"
                                    for k, v in ipairs(G.playing_cards) do
                                        v.ability.played_this_ante = nil
                                    end
                                end
                                if G.GAME.round_resets.temp_handsize then
                                    G.hand:change_size(-G.GAME.round_resets.temp_handsize)
                                    G.GAME.round_resets.temp_handsize = nil
                                end
                                if G.GAME.round_resets.temp_reroll_cost then
                                    G.GAME.round_resets.temp_reroll_cost = nil
                                    calculate_reroll_cost(_G, true)
                                end
                                reset_idol_card(_G)
                                reset_mail_rank(_G)
                                reset_ancient_card(_G)
                                reset_castle_card(_G)
                                for _, mod in ipairs(SMODS.mod_list) do
                                    if mod.reset_game_globals and type(mod.reset_game_globals) == "function" then
                                        mod:reset_game_globals(false)
                                    end
                                end
                                for k, v in ipairs(G.playing_cards) do
                                    v.ability.discarded = nil
                                    v.ability.forced_selection = nil
                                end
                                return true
                            end
                        }
                    ))
                end
                return true
            end
        }
    ))
end
function new_round(self)
    G.RESET_JIGGLES = nil
    delay(_G, 0.4)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                G.GAME.current_round.discards_left = math.max(0, G.GAME.round_resets.discards + G.GAME.round_bonus.discards)
                G.GAME.current_round.hands_left = math.max(1, G.GAME.round_resets.hands + G.GAME.round_bonus.next_hands)
                G.GAME.current_round.hands_played = 0
                G.GAME.current_round.discards_used = 0
                G.GAME.current_round.reroll_cost_increase = 0
                G.GAME.current_round.used_packs = {}
                for k, v in pairs(G.GAME.hands) do
                    v.played_this_round = 0
                end
                for k, v in pairs(G.playing_cards) do
                    v.ability.wheel_flipped = nil
                end
                local chaos = find_joker(_G, "Chaos the Clown")
                G.GAME.current_round.free_rerolls = chaos.length
                calculate_reroll_cost(_G, true)
                G.GAME.round_bonus.next_hands = 0
                G.GAME.round_bonus.discards = 0
                local blhash = ""
                if G.GAME.round_resets.blind == G.P_BLINDS.bl_small then
                    G.GAME.round_resets.blind_states.Small = "Current"
                    G.GAME.current_boss_streak = 0
                    blhash = "S"
                elseif G.GAME.round_resets.blind == G.P_BLINDS.bl_big then
                    G.GAME.round_resets.blind_states.Big = "Current"
                    G.GAME.current_boss_streak = 0
                    blhash = "B"
                else
                    G.GAME.round_resets.blind_states.Boss = "Current"
                    blhash = "L"
                end
                G.GAME.subhash = tostring(G.GAME.round_resets.ante) .. blhash
                G.GAME.blind:set_blind(G.GAME.round_resets.blind)
                SMODS:calculate_context({setting_blind = true, blind = G.GAME.round_resets.blind})
                delay(_G, 0.4)
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "immediate",
                        func = function(self)
                            G.STATE = G.STATES.DRAW_TO_HAND
                            G.deck:shuffle("nr" .. tostring(G.GAME.round_resets.ante))
                            G.deck:hard_set_T()
                            G.STATE_COMPLETE = false
                            return true
                        end
                    }
                ))
                return true
            end
        }
    ))
end
G.FUNCS.draw_from_deck_to_hand = function(self, e)
    if not (G.STATE == G.STATES.TAROT_PACK or G.STATE == G.STATES.SPECTRAL_PACK or G.STATE == G.STATES.SMODS_BOOSTER_OPENED) and G.hand.config.card_limit <= 0 and G.hand.cards.length == 0 then
        G.STATE = G.STATES.GAME_OVER
        G.STATE_COMPLETE = false
        return true
    end
    local hand_space = e
    if not hand_space then
        local limit = G.hand.config.card_limit - G.hand.cards.length
        local n = 0
        while n < G.deck.cards.length do
            local card = G.deck.cards[G.deck.cards.length - n]
            limit = limit - 1 + (card.edition and card.edition.card_limit or 0)
            if limit < 0 then
                break
            end
            n = n + 1
        end
        hand_space = n
    end
    if G.GAME.blind.name == "The Serpent" and not G.GAME.blind.disabled and (G.GAME.current_round.hands_played > 0 or G.GAME.current_round.discards_used > 0) then
        hand_space = math.min(G.deck.cards.length, 3)
    end
    delay(_G, 0.3)
    do
        local i = 1
        while i <= hand_space do
            if G.STATE == G.STATES.TAROT_PACK or G.STATE == G.STATES.SPECTRAL_PACK then
                draw_card(
                    _G,
                    G.deck,
                    G.hand,
                    i * 100 / hand_space,
                    "up",
                    true
                )
            else
                draw_card(
                    _G,
                    G.deck,
                    G.hand,
                    i * 100 / hand_space,
                    "up",
                    true
                )
            end
            i = i + 1
        end
    end
end
G.FUNCS.discard_cards_from_highlighted = function(self, e, hook)
    stop_use(_G)
    G.CONTROLLER.interrupt.focus = true
    G.CONTROLLER:save_cardarea_focus("hand")
    for k, v in ipairs(G.playing_cards) do
        v.ability.forced_selection = nil
    end
    if G.CONTROLLER.focused.target and G.CONTROLLER.focused.target.area == G.hand then
        G.card_area_focus_reset = {area = G.hand, rank = G.CONTROLLER.focused.target.rank}
    end
    local highlighted_count = math.min(G.hand.highlighted.length, G.discard.config.card_limit - G.play.cards.length)
    if highlighted_count > 0 then
        update_hand_text(_G, {immediate = true, nopulse = true, delay = 0}, {mult = 0, chips = 0, level = "", handname = ""})
        table.sort(
            G.hand.highlighted,
            function(a, b)
                return a.T.x < b.T.x
            end
        )
        inc_career_stat(_G, "c_cards_discarded", highlighted_count)
        SMODS:calculate_context({pre_discard = true, full_hand = G.hand.highlighted, hook = hook})
        local cards = {}
        local destroyed_cards = {}
        do
            local i = 1
            while i <= highlighted_count do
                G.hand.highlighted[i]:calculate_seal({discard = true})
                local removed = false
                local effects = {}
                SMODS:calculate_context({discard = true, other_card = G.hand.highlighted[i], full_hand = G.hand.highlighted}, effects)
                SMODS:trigger_effects(effects)
                for _, eval in pairs(effects) do
                    if type(eval) == "table" then
                        for key, eval2 in pairs(eval) do
                            if key == "remove" or type(eval2) == "table" and eval2.remove then
                                removed = true
                            end
                        end
                    end
                end
                table.insert(cards, G.hand.highlighted[i])
                if removed then
                    destroyed_cards[destroyed_cards.length + 1] = G.hand.highlighted[i]
                    if SMODS:has_enhancement(G.hand.highlighted[i], "m_glass") then
                        G.hand.highlighted[i]:shatter()
                    else
                        G.hand.highlighted[i]:start_dissolve()
                    end
                else
                    G.hand.highlighted[i].ability.discarded = true
                    draw_card(
                        _G,
                        G.hand,
                        G.discard,
                        i * 100 / highlighted_count,
                        "down",
                        false,
                        G.hand.highlighted[i]
                    )
                end
                i = i + 1
            end
        end
        if destroyed_cards[1] then
            SMODS:calculate_context({remove_playing_cards = true, removed = destroyed_cards})
        end
        G.GAME.round_scores.cards_discarded.amt = G.GAME.round_scores.cards_discarded.amt + cards.length
        check_for_unlock(_G, {type = "discard_custom", cards = cards})
        if not hook then
            if G.GAME.modifiers.discard_cost then
                ease_dollars(_G, -G.GAME.modifiers.discard_cost)
            end
            ease_discard(_G, -1)
            G.GAME.current_round.discards_used = G.GAME.current_round.discards_used + 1
            G.STATE = G.STATES.DRAW_TO_HAND
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {
                    trigger = "immediate",
                    func = function(self)
                        G.STATE_COMPLETE = false
                        return true
                    end
                }
            ))
        end
    end
end
G.FUNCS.play_cards_from_highlighted = function(self, e)
    if G.play and G.play.cards[1] then
        return
    end
    stop_use(_G)
    G.GAME.blind.triggered = false
    G.CONTROLLER.interrupt.focus = true
    G.CONTROLLER:save_cardarea_focus("hand")
    for k, v in ipairs(G.playing_cards) do
        v.ability.forced_selection = nil
    end
    table.sort(
        G.hand.highlighted,
        function(a, b)
            return a.T.x < b.T.x
        end
    )
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                G.STATE = G.STATES.HAND_PLAYED
                G.STATE_COMPLETE = true
                return true
            end
        }
    ))
    inc_career_stat(_G, "c_cards_played", G.hand.highlighted.length)
    inc_career_stat(_G, "c_hands_played", 1)
    ease_hands_played(_G, -1)
    delay(_G, 0.4)
    do
        local i = 1
        while i <= G.hand.highlighted.length do
            if G.hand.highlighted[i]:is_face() then
                inc_career_stat(_G, "c_face_cards_played", 1)
            end
            G.hand.highlighted[i].base.times_played = G.hand.highlighted[i].base.times_played + 1
            G.hand.highlighted[i].ability.played_this_ante = true
            G.GAME.round_scores.cards_played.amt = G.GAME.round_scores.cards_played.amt + 1
            draw_card(
                _G,
                G.hand,
                G.play,
                i * 100 / G.hand.highlighted.length,
                "up",
                nil,
                G.hand.highlighted[i]
            )
            i = i + 1
        end
    end
    check_for_unlock(_G, {type = "run_card_replays"})
    if G.GAME.blind:press_play() then
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    SMODS:juice_up_blind()
                    G.E_MANAGER:add_event(__TS__New(
                        GameEvent,
                        {
                            trigger = "after",
                            delay = 0.06 * G.SETTINGS.GAMESPEED,
                            blockable = false,
                            blocking = false,
                            func = function(self)
                                play_sound(_G, "tarot2", 0.76, 0.4)
                                return true
                            end
                        }
                    ))
                    play_sound(_G, "tarot2", 1, 0.4)
                    return true
                end
            }
        ))
        delay(_G, 0.4)
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                check_for_unlock(_G, {type = "hand_contents", cards = G.play.cards})
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "immediate",
                        func = function(self)
                            G.FUNCS:evaluate_play()
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
                            check_for_unlock(_G, {type = "play_all_hearts"})
                            G.FUNCS:draw_from_play_to_discard()
                            G.GAME.hands_played = G.GAME.hands_played + 1
                            G.GAME.current_round.hands_played = G.GAME.current_round.hands_played + 1
                            return true
                        end
                    }
                ))
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {
                        trigger = "immediate",
                        func = function(self)
                            G.STATE_COMPLETE = false
                            return true
                        end
                    }
                ))
                return true
            end
        }
    ))
end
G.FUNCS.get_poker_hand_info = function(self, _cards)
    local poker_hands = evaluate_poker_hand(_G, _cards)
    local scoring_hand = {}
    local text, disp_text, loc_disp_text = "NULL", "NULL", "NULL"
    if {next(poker_hands["Flush Five"])} then
        text = "Flush Five"
        scoring_hand = poker_hands["Flush Five"][1]
    elseif {next(poker_hands["Flush House"])} then
        text = "Flush House"
        scoring_hand = poker_hands["Flush House"][1]
    elseif {next(poker_hands["Five of a Kind"])} then
        text = "Five of a Kind"
        scoring_hand = poker_hands["Five of a Kind"][1]
    elseif {next(poker_hands["Straight Flush"])} then
        text = "Straight Flush"
        scoring_hand = poker_hands["Straight Flush"][1]
    elseif {next(poker_hands["Four of a Kind"])} then
        text = "Four of a Kind"
        scoring_hand = poker_hands["Four of a Kind"][1]
    elseif {next(poker_hands["Full House"])} then
        text = "Full House"
        scoring_hand = poker_hands["Full House"][1]
    elseif {next(poker_hands.Flush)} then
        text = "Flush"
        scoring_hand = poker_hands.Flush[1]
    elseif {next(poker_hands.Straight)} then
        text = "Straight"
        scoring_hand = poker_hands.Straight[1]
    elseif {next(poker_hands["Three of a Kind"])} then
        text = "Three of a Kind"
        scoring_hand = poker_hands["Three of a Kind"][1]
    elseif {next(poker_hands["Two Pair"])} then
        text = "Two Pair"
        scoring_hand = poker_hands["Two Pair"][1]
    elseif {next(poker_hands.Pair)} then
        text = "Pair"
        scoring_hand = poker_hands.Pair[1]
    elseif {next(poker_hands["High Card"])} then
        text = "High Card"
        scoring_hand = poker_hands["High Card"][1]
    end
    disp_text = text
    if text == "Straight Flush" then
        local min = 10
        do
            local j = 1
            while j <= scoring_hand.length do
                if scoring_hand[j]:get_id() < min then
                    min = scoring_hand[j]:get_id()
                end
                j = j + 1
            end
        end
        if min >= 10 then
            disp_text = "Royal Flush"
        end
    end
    loc_disp_text = localize(_G, disp_text, "poker_hands")
    return {
        text,
        loc_disp_text,
        poker_hands,
        scoring_hand,
        disp_text
    }
end
G.FUNCS.evaluate_play = function(self, e)
    local text, disp_text, poker_hands, scoring_hand, non_loc_disp_text = __TS__Unpack(G.FUNCS:get_poker_hand_info(G.play.cards))
    G.GAME.hands[text].played = G.GAME.hands[text].played + 1
    G.GAME.hands[text].played_this_round = G.GAME.hands[text].played_this_round + 1
    G.GAME.last_hand_played = text
    set_hand_usage(_G, text)
    G.GAME.hands[text].visible = true
    local pures = {}
    do
        local i = 1
        while i <= G.play.cards.length do
            if {next(find_joker(_G, "Splash"))} then
                scoring_hand[i] = G.play.cards[i]
            else
                if SMODS:always_scores(G.play.cards[i]) then
                    local inside = false
                    do
                        local j = 1
                        while j <= scoring_hand.length do
                            if scoring_hand[j] == G.play.cards[i] then
                                inside = true
                            end
                            j = j + 1
                        end
                    end
                    if not inside then
                        table.insert(pures, G.play.cards[i])
                    end
                end
            end
            i = i + 1
        end
    end
    do
        local i = 1
        while i <= pures.length do
            table.insert(scoring_hand, pures[i])
            i = i + 1
        end
    end
    table.sort(
        scoring_hand,
        function(a, b)
            return a.T.x < b.T.x
        end
    )
    delay(_G, 0.2)
    do
        local i = 1
        while i <= scoring_hand.length do
            highlight_card(_G, scoring_hand[i], (i - 0.999) / 5, "up")
            i = i + 1
        end
    end
    percent = 0.3
    percent_delta = 0.08
    if G.GAME.current_round.current_hand.handname ~= disp_text then
        delay(_G, 0.3)
    end
    update_hand_text(_G, {
        sound = G.GAME.current_round.current_hand.handname ~= disp_text and "button" or nil,
        volume = 0.4,
        immediate = true,
        nopulse = nil,
        delay = G.GAME.current_round.current_hand.handname ~= disp_text and 0.4 or 0
    }, {handname = disp_text, level = G.GAME.hands[text].level, mult = G.GAME.hands[text].mult, chips = G.GAME.hands[text].chips})
    if not G.GAME.blind:debuff_hand(G.play.cards, poker_hands, text) then
        mult = mod_mult(_G, G.GAME.hands[text].mult)
        hand_chips = mod_chips(_G, G.GAME.hands[text].chips)
        check_for_unlock(_G, {
            type = "hand",
            handname = text,
            disp_text = non_loc_disp_text,
            scoring_hand = scoring_hand,
            full_hand = G.play.cards
        })
        delay(_G, 0.4)
        if G.GAME.first_used_hand_level and G.GAME.first_used_hand_level > 0 then
            level_up_hand(
                _G,
                G.deck.cards[1],
                text,
                nil,
                G.GAME.first_used_hand_level
            )
            G.GAME.first_used_hand_level = nil
        end
        local hand_text_set = false
        SMODS:calculate_context({
            full_hand = G.play.cards,
            scoring_hand = scoring_hand,
            scoring_name = text,
            poker_hands = poker_hands,
            before = true
        })
        mult = mod_mult(_G, G.GAME.hands[text].mult)
        hand_chips = mod_chips(_G, G.GAME.hands[text].chips)
        local modded = false
        local ____temp_0 = G.GAME.blind:modify_hand(
            G.play.cards,
            poker_hands,
            text,
            mult,
            hand_chips
        )
        mult = ____temp_0[1]
        hand_chips = ____temp_0[2]
        modded = ____temp_0[3]
        local ____temp_1 = {
            mod_mult(_G, mult),
            mod_chips(_G, hand_chips)
        }
        mult = ____temp_1[1]
        hand_chips = ____temp_1[2]
        if modded then
            update_hand_text(_G, {sound = "chips2", modded = modded}, {chips = hand_chips, mult = mult})
        end
        delay(_G, 0.3)
        for _, v in ipairs(SMODS:get_card_areas("playing_cards")) do
            SMODS:calculate_main_scoring({
                cardarea = v,
                full_hand = G.play.cards,
                scoring_hand = scoring_hand,
                scoring_name = text,
                poker_hands = poker_hands
            }, v == G.play and scoring_hand or nil)
            delay(_G, 0.3)
        end
        percent = percent + percent_delta
        for _, area in ipairs(SMODS:get_card_areas("jokers")) do
            for _, _card in ipairs(area.cards) do
                local effects = {}
                local eval = eval_card(_G, _card, {
                    cardarea = G.jokers,
                    full_hand = G.play.cards,
                    scoring_hand = scoring_hand,
                    scoring_name = text,
                    poker_hands = poker_hands,
                    edition = true,
                    pre_joker = true
                })
                if eval.edition then
                    effects[effects.length + 1] = eval
                end
                local joker_eval, post = __TS__Unpack(eval_card(_G, _card, {
                    cardarea = G.jokers,
                    full_hand = G.play.cards,
                    scoring_hand = scoring_hand,
                    scoring_name = text,
                    poker_hands = poker_hands,
                    joker_main = true
                }))
                if {next(joker_eval)} then
                    if joker_eval.edition then
                        joker_eval.edition = {}
                    end
                    table.insert(effects, joker_eval)
                    for _, v in ipairs(post) do
                        effects[effects.length + 1] = v
                    end
                    if joker_eval.retriggers then
                        do
                            local rt = 1
                            while rt <= joker_eval.retriggers.length do
                                local rt_eval, rt_post = __TS__Unpack(eval_card(_G, _card, {
                                    cardarea = G.jokers,
                                    full_hand = G.play.cards,
                                    scoring_hand = scoring_hand,
                                    scoring_name = text,
                                    poker_hands = poker_hands,
                                    joker_main = true,
                                    retrigger_joker = true
                                }))
                                table.insert(effects, {joker_eval.retriggers[rt]})
                                table.insert(effects, rt_eval)
                                for _, v in ipairs(rt_post) do
                                    effects[effects.length + 1] = v
                                end
                                rt = rt + 1
                            end
                        end
                    end
                end
                for _, _area in ipairs(SMODS:get_card_areas("jokers")) do
                    for _, _joker in ipairs(_area.cards) do
                        local other_key = "other_unknown"
                        if _card.ability.set == "Joker" then
                            other_key = "other_joker"
                        end
                        if _card.ability.consumeable then
                            other_key = "other_consumeable"
                        end
                        if _card.ability.set == "Voucher" then
                            other_key = "other_voucher"
                        end
                        local joker_eval, post = __TS__Unpack(eval_card(_G, _joker, {
                            full_hand = G.play.cards,
                            scoring_hand = scoring_hand,
                            scoring_name = text,
                            poker_hands = poker_hands,
                            [other_key] = _card,
                            other_main = _card
                        }))
                        if {next(joker_eval)} then
                            if joker_eval.edition then
                                joker_eval.edition = {}
                            end
                            joker_eval.jokers.juice_card = _joker
                            table.insert(effects, joker_eval)
                            for _, v in ipairs(post) do
                                effects[effects.length + 1] = v
                            end
                            if joker_eval.retriggers then
                                do
                                    local rt = 1
                                    while rt <= joker_eval.retriggers.length do
                                        local rt_eval, rt_post = __TS__Unpack(eval_card(_G, _card, {
                                            full_hand = G.play.cards,
                                            scoring_hand = scoring_hand,
                                            scoring_name = text,
                                            poker_hands = poker_hands,
                                            [other_key] = _card,
                                            retrigger_joker = true
                                        }))
                                        table.insert(effects, {joker_eval.retriggers[rt]})
                                        table.insert(effects, rt_eval)
                                        for _, v in ipairs(rt_post) do
                                            effects[effects.length + 1] = v
                                        end
                                        rt = rt + 1
                                    end
                                end
                            end
                        end
                    end
                end
                local eval = eval_card(_G, _card, {
                    cardarea = G.jokers,
                    full_hand = G.play.cards,
                    scoring_hand = scoring_hand,
                    scoring_name = text,
                    poker_hands = poker_hands,
                    edition = true,
                    post_joker = true
                })
                if eval.edition then
                    effects[effects.length + 1] = eval
                end
                SMODS:trigger_effects(effects, _card)
                local deck_effect = G.GAME.selected_back:trigger_effect({
                    full_hand = G.play.cards,
                    scoring_hand = scoring_hand,
                    scoring_name = text,
                    poker_hands = poker_hands,
                    other_joker = _card.ability.set == "Joker" and _card or false,
                    other_consumeable = _card.ability.set ~= "Joker" and _card or false
                })
                if deck_effect then
                    SMODS:calculate_effect(deck_effect, G.deck.cards[1] or G.deck)
                end
            end
        end
        SMODS:calculate_context({
            full_hand = G.play.cards,
            scoring_hand = scoring_hand,
            scoring_name = text,
            poker_hands = poker_hands,
            final_scoring_step = true
        })
        local nu_chip, nu_mult = __TS__Unpack(G.GAME.selected_back:trigger_effect({context = "final_scoring_step", chips = hand_chips, mult = mult}))
        mult = mod_mult(_G, nu_mult or mult)
        hand_chips = mod_chips(_G, nu_chip or hand_chips)
        local cards_destroyed = {}
        for _, v in ipairs(SMODS:get_card_areas("playing_cards", "destroying_cards")) do
            SMODS:calculate_destroying_cards({
                full_hand = G.play.cards,
                scoring_hand = scoring_hand,
                scoring_name = text,
                poker_hands = poker_hands,
                cardarea = v
            }, cards_destroyed, v == G.play and scoring_hand or nil)
        end
        if cards_destroyed[1] then
            SMODS:calculate_context({scoring_hand = scoring_hand, remove_playing_cards = true, removed = cards_destroyed})
        end
        local glass_shattered = {}
        for k, v in ipairs(cards_destroyed) do
            if v.shattered then
                glass_shattered[glass_shattered.length + 1] = v
            end
        end
        check_for_unlock(_G, {type = "shatter", shattered = glass_shattered})
        do
            local i = 1
            while i <= cards_destroyed.length do
                G.E_MANAGER:add_event(__TS__New(
                    GameEvent,
                    {func = function(self)
                        if SMODS:has_enhancement(cards_destroyed[i], "m_glass") then
                            cards_destroyed[i]:shatter()
                        else
                            cards_destroyed[i]:start_dissolve()
                        end
                        return true
                    end}
                ))
                i = i + 1
            end
        end
    else
        mult = mod_mult(_G, 0)
        hand_chips = mod_chips(_G, 0)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    SMODS:juice_up_blind()
                    G.E_MANAGER:add_event(__TS__New(
                        GameEvent,
                        {
                            trigger = "after",
                            delay = 0.06 * G.SETTINGS.GAMESPEED,
                            blockable = false,
                            blocking = false,
                            func = function(self)
                                play_sound(_G, "tarot2", 0.76, 0.4)
                                return true
                            end
                        }
                    ))
                    play_sound(_G, "tarot2", 1, 0.4)
                    return true
                end
            }
        ))
        play_area_status_text(_G, "Not Allowed!")
        SMODS:calculate_context({
            full_hand = G.play.cards,
            scoring_hand = scoring_hand,
            scoring_name = text,
            poker_hands = poker_hands,
            debuffed_hand = true
        })
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "after",
            delay = 0.4,
            func = function(self)
                update_hand_text(
                    _G,
                    {delay = 0, immediate = true},
                    {
                        mult = 0,
                        chips = 0,
                        chip_total = math.floor(hand_chips * mult),
                        level = "",
                        handname = ""
                    }
                )
                play_sound(_G, "button", 0.9, 0.6)
                return true
            end
        }
    ))
    check_and_set_high_score(_G, "hand", hand_chips * mult)
    check_for_unlock(
        _G,
        {
            type = "chip_score",
            chips = math.floor(hand_chips * mult)
        }
    )
    if hand_chips * mult > 0 then
        delay(_G, 0.8)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "immediate",
                func = function(self)
                    play_sound(_G, "chips2")
                    return true
                end
            }
        ))
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "ease",
            blocking = false,
            ref_table = G.GAME,
            ref_value = "chips",
            ease_to = G.GAME.chips + math.floor(hand_chips * mult),
            delay = 0.5,
            func = function(self, t)
                return math.floor(t)
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "ease",
            blocking = true,
            ref_table = G.GAME.current_round.current_hand,
            ref_value = "chip_total",
            ease_to = 0,
            delay = 0.5,
            func = function(self, t)
                return math.floor(t)
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                G.GAME.current_round.current_hand.handname = ""
                return true
            end
        }
    ))
    delay(_G, 0.3)
    SMODS:calculate_context({
        full_hand = G.play.cards,
        scoring_hand = scoring_hand,
        scoring_name = text,
        poker_hands = poker_hands,
        after = true
    })
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                if G.GAME.modifiers.debuff_played_cards then
                    for k, v in ipairs(scoring_hand) do
                        v.ability.perma_debuff = true
                    end
                end
                return true
            end
        }
    ))
end
G.FUNCS.draw_from_play_to_discard = function(self, e)
    local play_count = G.play.cards.length
    local it = 1
    for k, v in ipairs(G.play.cards) do
        if not v.shattered and not v.destroyed then
            draw_card(
                _G,
                G.play,
                G.discard,
                it * 100 / play_count,
                "down",
                false,
                v
            )
            it = it + 1
        end
    end
end
G.FUNCS.draw_from_play_to_hand = function(self, cards)
    local gold_count = cards.length
    do
        local i = 1
        while i <= gold_count do
            if not cards[i].shattered and not cards[i].destroyed then
                draw_card(
                    _G,
                    G.play,
                    G.hand,
                    i * 100 / gold_count,
                    "up",
                    true,
                    cards[i]
                )
            end
            i = i + 1
        end
    end
end
G.FUNCS.draw_from_discard_to_deck = function(self, e)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "immediate",
            func = function(self)
                local discard_count = G.discard.cards.length
                do
                    local i = 1
                    while i <= discard_count do
                        draw_card(
                            _G,
                            G.discard,
                            G.deck,
                            i * 100 / discard_count,
                            "up",
                            nil,
                            nil,
                            0.005,
                            i % 2 == 0,
                            nil,
                            math.max((21 - i) / 20, 0.7)
                        )
                        i = i + 1
                    end
                end
                return true
            end
        }
    ))
end
G.FUNCS.draw_from_hand_to_deck = function(self, e)
    local hand_count = G.hand.cards.length
    do
        local i = 1
        while i <= hand_count do
            draw_card(
                _G,
                G.hand,
                G.deck,
                i * 100 / hand_count,
                "down",
                nil,
                nil,
                0.08
            )
            i = i + 1
        end
    end
end
G.FUNCS.draw_from_hand_to_discard = function(self, e)
    local hand_count = G.hand.cards.length
    do
        local i = 1
        while i <= hand_count do
            draw_card(
                _G,
                G.hand,
                G.discard,
                i * 100 / hand_count,
                "down",
                nil,
                nil,
                0.07
            )
            i = i + 1
        end
    end
end
G.FUNCS.evaluate_round = function(self)
    total_cashout_rows = 0
    local pitch = 0.95
    local dollars = 0
    if G.GAME.chips - G.GAME.blind.chips >= 0 then
        add_round_eval_row(_G, {dollars = G.GAME.blind.dollars, name = "blind1", pitch = pitch})
        pitch = pitch + 0.06
        dollars = dollars + G.GAME.blind.dollars
    else
        add_round_eval_row(_G, {dollars = 0, name = "blind1", pitch = pitch, saved = true})
        pitch = pitch + 0.06
    end
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "before",
            delay = 1.3 * math.min(G.GAME.blind.dollars + 2, 7) / 2 * 0.15 + 0.5,
            func = function(self)
                G.GAME.blind:defeat()
                return true
            end
        }
    ))
    delay(_G, 0.2)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {func = function(self)
            ease_background_colour_blind(_G, G.STATES.ROUND_EVAL, "")
            return true
        end}
    ))
    G.GAME.selected_back:trigger_effect({context = "eval"})
    if G.GAME.current_round.hands_left > 0 and not G.GAME.modifiers.no_extra_hand_money then
        add_round_eval_row(_G, {
            dollars = G.GAME.current_round.hands_left * (G.GAME.modifiers.money_per_hand or 1),
            disp = G.GAME.current_round.hands_left,
            bonus = true,
            name = "hands",
            pitch = pitch
        })
        pitch = pitch + 0.06
        dollars = dollars + G.GAME.current_round.hands_left * (G.GAME.modifiers.money_per_hand or 1)
    end
    if G.GAME.current_round.discards_left > 0 and G.GAME.modifiers.money_per_discard then
        add_round_eval_row(_G, {
            dollars = G.GAME.current_round.discards_left * G.GAME.modifiers.money_per_discard,
            disp = G.GAME.current_round.discards_left,
            bonus = true,
            name = "discards",
            pitch = pitch
        })
        pitch = pitch + 0.06
        dollars = dollars + G.GAME.current_round.discards_left * G.GAME.modifiers.money_per_discard
    end
    local i = 0
    for _, area in ipairs(SMODS:get_card_areas("jokers")) do
        for _, _card in ipairs(area.cards) do
            local ret = _card:calculate_dollar_bonus()
            if ret then
                i = i + 1
                add_round_eval_row(
                    _G,
                    {
                        dollars = ret,
                        bonus = true,
                        name = "joker" .. tostring(i),
                        pitch = pitch,
                        card = _card
                    }
                )
                pitch = pitch + 0.06
                dollars = dollars + ret
            end
        end
    end
    do
        local i = 1
        while i <= G.GAME.tags.length do
            local ret = G.GAME.tags[i]:apply_to_run({type = "eval"})
            if ret then
                add_round_eval_row(
                    _G,
                    {
                        dollars = ret.dollars,
                        bonus = true,
                        name = "tag" .. tostring(i),
                        pitch = pitch,
                        condition = ret.condition,
                        pos = ret.pos,
                        tag = ret.tag
                    }
                )
                pitch = pitch + 0.06
                dollars = dollars + ret.dollars
            end
            i = i + 1
        end
    end
    if G.GAME.dollars >= 5 and not G.GAME.modifiers.no_interest then
        add_round_eval_row(
            _G,
            {
                bonus = true,
                name = "interest",
                pitch = pitch,
                dollars = G.GAME.interest_amount * math.min(
                    math.floor(G.GAME.dollars / 5),
                    G.GAME.interest_cap / 5
                )
            }
        )
        pitch = pitch + 0.06
        if not G.GAME.seeded and not G.GAME.challenge or SMODS.config.seeded_unlocks then
            if G.GAME.interest_amount * math.min(
                math.floor(G.GAME.dollars / 5),
                G.GAME.interest_cap / 5
            ) == G.GAME.interest_amount * G.GAME.interest_cap / 5 then
                G.PROFILES[G.SETTINGS.profile + 1].career_stats.c_round_interest_cap_streak = G.PROFILES[G.SETTINGS.profile + 1].career_stats.c_round_interest_cap_streak + 1
            else
                G.PROFILES[G.SETTINGS.profile + 1].career_stats.c_round_interest_cap_streak = 0
            end
        end
        check_for_unlock(_G, {type = "interest_streak"})
        dollars = dollars + G.GAME.interest_amount * math.min(
            math.floor(G.GAME.dollars / 5),
            G.GAME.interest_cap / 5
        )
    end
    pitch = pitch + 0.06
    if total_cashout_rows > 7 then
        local total_hidden = total_cashout_rows - 7
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "before",
                delay = 0.38,
                func = function(self)
                    local hidden = {
                        n = G.UIT.R,
                        config = {align = "cm"},
                        nodes = {{
                            n = G.UIT.O,
                            config = {object = DynaText(
                                _G,
                                {
                                    string = {localize(_G, {type = "variable", key = "cashout_hidden", vars = {total_hidden}})},
                                    colours = {G.C.WHITE},
                                    shadow = true,
                                    float = false,
                                    scale = 0.45,
                                    font = G.LANGUAGES["en-us"].font,
                                    pop_in = 0
                                }
                            )}
                        }}
                    }
                    G.round_eval:add_child(
                        hidden,
                        G.round_eval:get_UIE_by_ID("bonus_round_eval")
                    )
                    return true
                end
            }
        ))
    end
    add_round_eval_row(_G, {name = "bottom", dollars = dollars})
end
G.FUNCS.tutorial_controller = function(self)
    if G.F_SKIP_TUTORIAL then
        G.SETTINGS.tutorial_complete = true
        G.SETTINGS.tutorial_progress = nil
        return
    end
    G.SETTINGS.tutorial_progress = G.SETTINGS.tutorial_progress or ({
        forced_shop = {"j_joker", "c_empress"},
        forced_voucher = "v_grabber",
        forced_tags = {"tag_handy", "tag_garbage"},
        hold_parts = {},
        completed_parts = {}
    })
    if not G.SETTINGS.paused and not G.SETTINGS.tutorial_complete then
        if G.STATE == G.STATES.BLIND_SELECT and G.blind_select and not G.SETTINGS.tutorial_progress.completed_parts.small_blind then
            G.SETTINGS.tutorial_progress.section = "small_blind"
            G.FUNCS:tutorial_part("small_blind")
            G.SETTINGS.tutorial_progress.completed_parts.small_blind = true
            G:save_progress()
        end
        if G.STATE == G.STATES.BLIND_SELECT and G.blind_select and not G.SETTINGS.tutorial_progress.completed_parts.big_blind and G.GAME.round > 0 then
            G.SETTINGS.tutorial_progress.section = "big_blind"
            G.FUNCS:tutorial_part("big_blind")
            G.SETTINGS.tutorial_progress.completed_parts.big_blind = true
            G.SETTINGS.tutorial_progress.forced_tags = nil
            G:save_progress()
        end
        if G.STATE == G.STATES.SELECTING_HAND and not G.SETTINGS.tutorial_progress.completed_parts.second_hand and G.SETTINGS.tutorial_progress.hold_parts.big_blind then
            G.SETTINGS.tutorial_progress.section = "second_hand"
            G.FUNCS:tutorial_part("second_hand")
            G.SETTINGS.tutorial_progress.completed_parts.second_hand = true
            G:save_progress()
        end
        if G.SETTINGS.tutorial_progress.hold_parts.second_hand then
            G.SETTINGS.tutorial_complete = true
        end
        if not G.SETTINGS.tutorial_progress.completed_parts.first_hand_section then
            if G.STATE == G.STATES.SELECTING_HAND and not G.SETTINGS.tutorial_progress.completed_parts.first_hand then
                G.SETTINGS.tutorial_progress.section = "first_hand"
                G.FUNCS:tutorial_part("first_hand")
                G.SETTINGS.tutorial_progress.completed_parts.first_hand = true
                G:save_progress()
            end
            if G.STATE == G.STATES.SELECTING_HAND and not G.SETTINGS.tutorial_progress.completed_parts.first_hand_2 and G.SETTINGS.tutorial_progress.hold_parts.first_hand then
                G.FUNCS:tutorial_part("first_hand_2")
                G.SETTINGS.tutorial_progress.completed_parts.first_hand_2 = true
                G:save_progress()
            end
            if G.STATE == G.STATES.SELECTING_HAND and not G.SETTINGS.tutorial_progress.completed_parts.first_hand_3 and G.SETTINGS.tutorial_progress.hold_parts.first_hand_2 then
                G.FUNCS:tutorial_part("first_hand_3")
                G.SETTINGS.tutorial_progress.completed_parts.first_hand_3 = true
                G:save_progress()
            end
            if G.STATE == G.STATES.SELECTING_HAND and not G.SETTINGS.tutorial_progress.completed_parts.first_hand_4 and G.SETTINGS.tutorial_progress.hold_parts.first_hand_3 then
                G.FUNCS:tutorial_part("first_hand_4")
                G.SETTINGS.tutorial_progress.completed_parts.first_hand_4 = true
                G.SETTINGS.tutorial_progress.completed_parts.first_hand_section = true
                G:save_progress()
            end
        end
        if G.STATE == G.STATES.SHOP and G.shop and G.shop.VT.y < 5 and not G.SETTINGS.tutorial_progress.completed_parts.shop_1 then
            G.SETTINGS.tutorial_progress.section = "shop"
            G.FUNCS:tutorial_part("shop_1")
            G.SETTINGS.tutorial_progress.completed_parts.shop_1 = true
            G.SETTINGS.tutorial_progress.forced_voucher = nil
            G:save_progress()
        end
    end
end
G.FUNCS.tutorial_part = function(self, _part)
    local step = 1
    G.SETTINGS.paused = true
    if _part == "small_blind" then
        step = tutorial_info(_G, {text_key = "sb_1", attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}}, step = step})
        step = tutorial_info(_G, {text_key = "sb_2", attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}}, step = step})
        step = tutorial_info(
            _G,
            {
                text_key = "sb_3",
                highlight = {
                    G.blind_select.UIRoot.children[1].children[1].config.object:get_UIE_by_ID("blind_name"),
                    G.blind_select.UIRoot.children[1].children[1].config.object:get_UIE_by_ID("blind_desc")
                },
                attach = {major = G.blind_select.UIRoot.children[1].children[1], type = "tr", offset = {x = 2, y = 4}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "sb_4",
                highlight = {G.blind_select.UIRoot.children[1].children[1]},
                snap_to = function(self)
                    if G.blind_select and G.blind_select.UIRoot and G.blind_select.UIRoot.children[1] and G.blind_select.UIRoot.children[1].children[1] and G.blind_select.UIRoot.children[1].children[1].config.object then
                        return G.blind_select.UIRoot.children[1].children[1].config.object:get_UIE_by_ID("select_blind_button")
                    end
                end,
                attach = {major = G.blind_select.UIRoot.children[1].children[1], type = "tr", offset = {x = 2, y = 4}},
                step = step,
                no_button = true,
                button_listen = "select_blind"
            }
        )
    elseif _part == "big_blind" then
        step = tutorial_info(
            _G,
            {
                text_key = "bb_1",
                highlight = {
                    G.blind_select.UIRoot.children[1].children[2].config.object:get_UIE_by_ID("blind_name"),
                    G.blind_select.UIRoot.children[1].children[2].config.object:get_UIE_by_ID("blind_desc")
                },
                hard_set = true,
                attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "bb_2",
                highlight = {
                    G.blind_select.UIRoot.children[1].children[2].config.object:get_UIE_by_ID("blind_name"),
                    G.blind_select.UIRoot.children[1].children[2].config.object:get_UIE_by_ID("tag_desc")
                },
                attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "bb_3",
                highlight = {
                    G.blind_select.UIRoot.children[1].children[3].config.object:get_UIE_by_ID("blind_name"),
                    G.blind_select.UIRoot.children[1].children[3].config.object:get_UIE_by_ID("blind_desc")
                },
                attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "bb_4",
                highlight = {
                    G.blind_select.UIRoot.children[1].children[3].config.object:get_UIE_by_ID("blind_name"),
                    G.blind_select.UIRoot.children[1].children[3].config.object:get_UIE_by_ID("blind_desc"),
                    G.blind_select.UIRoot.children[1].children[3].config.object:get_UIE_by_ID("blind_extras"),
                    G.HUD:get_UIE_by_ID("hud_ante")
                },
                attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "bb_5",
                loc_vars = {G.GAME.win_ante},
                highlight = {
                    G.blind_select,
                    G.HUD:get_UIE_by_ID("hud_ante")
                },
                attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
                step = step,
                no_button = true,
                snap_to = function(self)
                    if G.blind_select and G.blind_select.UIRoot and G.blind_select.UIRoot.children[1] and G.blind_select.UIRoot.children[1].children[2] and G.blind_select.UIRoot.children[1].children[2].config.object then
                        return G.blind_select.UIRoot.children[1].children[2].config.object:get_UIE_by_ID("select_blind_button")
                    end
                end,
                button_listen = "select_blind"
            }
        )
    elseif _part == "first_hand" then
        step = tutorial_info(_G, {text_key = "fh_1", attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}}, step = step})
        step = tutorial_info(
            _G,
            {
                text_key = "fh_2",
                highlight = {G.HUD:get_UIE_by_ID("hand_text_area")},
                attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "fh_3",
                attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}},
                highlight = {G.HUD:get_UIE_by_ID("run_info_button")},
                no_button = true,
                button_listen = "run_info",
                snap_to = function(self)
                    return G.HUD:get_UIE_by_ID("run_info_button")
                end,
                step = step
            }
        )
    elseif _part == "first_hand_2" then
        step = tutorial_info(
            _G,
            {
                hard_set = true,
                text_key = "fh_4",
                highlight = {
                    G.hand,
                    G.HUD:get_UIE_by_ID("run_info_button")
                },
                attach = {major = G.hand, type = "cl", offset = {x = -1.5, y = 0}},
                snap_to = function(self)
                    return G.hand.cards[1]
                end,
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "fh_5",
                highlight = {
                    G.hand,
                    G.buttons:get_UIE_by_ID("play_button"),
                    G.HUD:get_UIE_by_ID("run_info_button")
                },
                attach = {major = G.hand, type = "cl", offset = {x = -1.5, y = 0}},
                no_button = true,
                button_listen = "play_cards_from_highlighted",
                step = step
            }
        )
    elseif _part == "first_hand_3" then
        step = tutorial_info(
            _G,
            {
                hard_set = true,
                text_key = "fh_6",
                highlight = {
                    G.hand,
                    G.buttons:get_UIE_by_ID("discard_button"),
                    G.HUD:get_UIE_by_ID("run_info_button")
                },
                attach = {major = G.hand, type = "cl", offset = {x = -1.5, y = 0}},
                no_button = true,
                button_listen = "discard_cards_from_highlighted",
                step = step
            }
        )
    elseif _part == "first_hand_4" then
        step = tutorial_info(
            _G,
            {
                hard_set = true,
                text_key = "fh_7",
                highlight = {G.HUD:get_UIE_by_ID("hud_hands").parent},
                attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "fh_8",
                highlight = {
                    G.HUD:get_UIE_by_ID("hud_hands").parent,
                    G.HUD:get_UIE_by_ID("row_dollars_chips"),
                    G.HUD_blind
                },
                attach = {major = G.ROOM_ATTACH, type = "cm", offset = {x = 0, y = 0}},
                step = step
            }
        )
    elseif _part == "second_hand" then
        step = tutorial_info(_G, {
            text_key = "sh_1",
            hard_set = true,
            highlight = {G.jokers},
            attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
            step = step
        })
        local empress = find_joker(_G, "The Empress")[1]
        if empress then
            step = tutorial_info(_G, {text_key = "sh_2", highlight = {empress}, attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}}, step = step})
            step = tutorial_info(
                _G,
                {
                    text_key = "sh_3",
                    attach = {major = G.HUD, type = "cm", offset = {x = 0, y = -2}},
                    highlight = {empress, G.hand},
                    no_button = true,
                    button_listen = "use_card",
                    snap_to = function(self)
                        return G.hand.cards[1]
                    end,
                    step = step
                }
            )
        end
    elseif _part == "shop_1" then
        step = tutorial_info(
            _G,
            {
                hard_set = true,
                text_key = "s_1",
                highlight = {
                    G.SHOP_SIGN,
                    G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent
                },
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 4}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_2",
                highlight = {
                    G.SHOP_SIGN,
                    G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                    G.shop_jokers.cards[2]
                },
                snap_to = function(self)
                    return G.shop_jokers.cards[2]
                end,
                attach = {major = G.shop, type = "tr", offset = {x = -0.5, y = 6}},
                no_button = true,
                button_listen = "buy_from_shop",
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_3",
                loc_vars = {#G.P_CENTER_POOLS.Joker},
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.jokers.cards[1]
                    }
                end,
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_4",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.jokers.cards[1]
                    }
                end,
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_5",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.jokers
                    }
                end,
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_6",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.shop_jokers.cards[1]
                    }
                end,
                snap_to = function(self)
                    return G.shop_jokers.cards[1]
                end,
                no_button = true,
                button_listen = "buy_from_shop",
                attach = {major = G.shop, type = "tr", offset = {x = -0.5, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_7",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.consumeables.cards[G.consumeables.cards.length]
                    }
                end,
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_8",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.consumeables
                    }
                end,
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_9",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.shop_vouchers
                    }
                end,
                snap_to = function(self)
                    return G.shop_vouchers.cards[1]
                end,
                attach = {major = G.shop, type = "tr", offset = {x = -4, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_10",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.shop_vouchers
                    }
                end,
                attach = {major = G.shop, type = "tr", offset = {x = -4, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_11",
                highlight = function(self)
                    return {
                        G.SHOP_SIGN,
                        G.HUD:get_UIE_by_ID("dollar_text_UI").parent.parent.parent,
                        G.shop_booster
                    }
                end,
                snap_to = function(self)
                    return G.shop_booster.cards[1]
                end,
                attach = {major = G.shop, type = "tl", offset = {x = 3, y = 6}},
                step = step
            }
        )
        step = tutorial_info(
            _G,
            {
                text_key = "s_12",
                highlight = function(self)
                    return {G.shop:get_UIE_by_ID("next_round_button")}
                end,
                snap_to = function(self)
                    if G.shop then
                        return G.shop:get_UIE_by_ID("next_round_button")
                    end
                end,
                no_button = true,
                button_listen = "toggle_shop",
                attach = {major = G.shop, type = "tm", offset = {x = 0, y = 6}},
                step = step
            }
        )
    end
    G.E_MANAGER:add_event(
        __TS__New(
            GameEvent,
            {
                blockable = false,
                timer = "REAL",
                func = function(self)
                    if G.OVERLAY_TUTORIAL.step == step and not G.OVERLAY_TUTORIAL.step_complete or G.OVERLAY_TUTORIAL.skip_steps then
                        if G.OVERLAY_TUTORIAL.Jimbo then
                            G.OVERLAY_TUTORIAL.Jimbo:remove()
                        end
                        if G.OVERLAY_TUTORIAL.content then
                            G.OVERLAY_TUTORIAL.content:remove()
                        end
                        G.OVERLAY_TUTORIAL:remove()
                        G.OVERLAY_TUTORIAL = nil
                        G.SETTINGS.tutorial_progress.hold_parts[_part] = true
                        return true
                    end
                    return G.OVERLAY_TUTORIAL.step > step or G.OVERLAY_TUTORIAL.skip_steps
                end
            }
        ),
        "tutorial"
    )
    G.SETTINGS.paused = false
end
