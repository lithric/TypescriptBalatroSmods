///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

function win_game(): void {
    if (!G.GAME.seeded && !G.GAME.challenge || SMODS.config.seeded_unlocks) {
        set_joker_win();
        set_deck_win();
        check_and_set_high_score("win_streak", G.PROFILES[G.SETTINGS.profile].high_scores.current_streak.amt + 1);
        check_and_set_high_score("current_streak", G.PROFILES[G.SETTINGS.profile].high_scores.current_streak.amt + 1);
        check_for_unlock({ type: "win_no_hand" });
        check_for_unlock({ type: "win_no" });
        check_for_unlock({ type: "win_custom" });
        check_for_unlock({ type: "win_deck" });
        check_for_unlock({ type: "win_stake" });
        check_for_unlock({ type: "win" });
        inc_career_stat("c_wins", 1);
    }
    set_profile_progress();
    if (G.GAME.challenge) {
        G.PROFILES[G.SETTINGS.profile].challenge_progress.completed[G.GAME.challenge] = true;
        set_challenge_unlock();
        check_for_unlock({ type: "win_challenge" });
        G.save_settings();
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            for (const [k, v] of pairs(G.I.CARD)) {
                v.sticker_run = undefined;
            }
            play_sound("win");
            G.SETTINGS.paused = true;
            G.FUNCS.overlay_menu({ definition: create_UIBox_win(), config: { no_esc: true } });
            let Jimbo = undefined;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 2.5, blocking: false, func: function () {
                    if (G.OVERLAY_MENU && G.OVERLAY_MENU.get_UIE_by_ID("jimbo_spot")) {
                        Jimbo = new Card_Character({ x: 0, y: 5 });
                        let spot = G.OVERLAY_MENU.get_UIE_by_ID("jimbo_spot");
                        spot.config.object.remove();
                        spot.config.object = Jimbo;
                        Jimbo.ui_object_updated = true;
                        Jimbo.add_speech_bubble("wq_" + math.random(1, 7), undefined, { quip: true });
                        Jimbo.say_stuff(5);
                        if (G.F_JAN_CTA) {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    Jimbo.add_button(localize("b_wishlist"), "wishlist_steam", G.C.DARK_EDITION, undefined, true, 1.6);
                                    return true;
                                } }));
                        }
                    }
                    return true;
                } }));
            return true;
        } }));
    if (!G.GAME.seeded && !G.GAME.challenge || SMODS.config.seeded_unlocks) {
        G.PROFILES[G.SETTINGS.profile].stake = math.max(G.PROFILES[G.SETTINGS.profile].stake || 1, (G.GAME.stake || 1) + 1);
    }
    G.save_progress();
    G.FILE_HANDLER.force = true;
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            if (!G.SETTINGS.paused) {
                G.GAME.current_round.round_text = "Endless Round ";
                return true;
            }
        } }));
}
function end_round(): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
            G.GAME.blind.in_blind = false;
            let game_over = true;
            let game_won = false;
            G.RESET_BLIND_STATES = true;
            G.RESET_JIGGLES = true;
            if (G.GAME.chips - G.GAME.blind.chips >= 0) {
                game_over = false;
            }
            SMODS.saved = false;
            SMODS.calculate_context({ end_of_round: true, game_over: game_over });
            if (SMODS.saved) {
                game_over = false;
            }
            if (G.GAME.round_resets.ante === G.GAME.win_ante && G.GAME.blind.get_type() === "Boss") {
                game_won = true;
                G.GAME.won = true;
            }
            if (game_over) {
                G.STATE = G.STATES.GAME_OVER;
                if (!G.GAME.won && !G.GAME.seeded && !G.GAME.challenge) {
                    G.PROFILES[G.SETTINGS.profile].high_scores.current_streak.amt = 0;
                }
                G.save_settings();
                G.FILE_HANDLER.force = true;
                G.STATE_COMPLETE = false;
            }
            else {
                G.GAME.unused_discards = (G.GAME.unused_discards || 0) + G.GAME.current_round.discards_left;
                if (G.GAME.blind && G.GAME.blind.config.blind) {
                    discover_card(G.GAME.blind.config.blind);
                }
                if (G.GAME.blind.get_type() === "Boss") {
                    let [_handname, _played, _order] = ["High Card", -1, 100];
                    for (const [k, v] of pairs(G.GAME.hands)) {
                        if (v.played > _played || v.played === _played && _order > v.order) {
                            _played = v.played;
                            _handname = k;
                        }
                    }
                    G.GAME.current_round.most_played_poker_hand = _handname;
                }
                if (G.GAME.blind.get_type() === "Boss" && !G.GAME.seeded && !G.GAME.challenge) {
                    G.GAME.current_boss_streak = G.GAME.current_boss_streak + 1;
                    check_and_set_high_score("boss_streak", G.GAME.current_boss_streak);
                }
                if (G.GAME.current_round.hands_played === 1) {
                    inc_career_stat("c_single_hand_round_streak", 1);
                }
                else {
                    if (!G.GAME.seeded && !G.GAME.challenge) {
                        G.PROFILES[G.SETTINGS.profile].career_stats.c_single_hand_round_streak = 0;
                        G.save_settings();
                    }
                }
                check_for_unlock({ type: "round_win" });
                set_joker_usage();
                if (game_won && !G.GAME.win_notified) {
                    G.GAME.win_notified = true;
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", blocking: false, blockable: false, func: function () {
                            if (G.STATE === G.STATES.ROUND_EVAL) {
                                win_game();
                                G.GAME.won = true;
                                return true;
                            }
                        } }));
                }
                for (const [_, v] of ipairs(SMODS.get_card_areas("playing_cards", "end_of_round"))) {
                    SMODS.calculate_end_of_round_effects({ cardarea: v, end_of_round: true });
                }
                G.FUNCS.draw_from_hand_to_discard();
                if (G.GAME.blind.get_type() === "Boss") {
                    G.GAME.voucher_restock = undefined;
                    if (G.GAME.modifiers.set_eternal_ante && G.GAME.round_resets.ante === G.GAME.modifiers.set_eternal_ante) {
                        for (const [k, v] of ipairs(G.jokers.cards)) {
                            v.set_eternal(true);
                        }
                    }
                    if (G.GAME.modifiers.set_joker_slots_ante && G.GAME.round_resets.ante === G.GAME.modifiers.set_joker_slots_ante) {
                        G.jokers.config.card_limit = 0;
                    }
                    delay(0.4);
                    ease_ante(1);
                    delay(0.4);
                    check_for_unlock({ type: "ante_up", ante: G.GAME.round_resets.ante + 1 });
                }
                G.FUNCS.draw_from_discard_to_deck();
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, func: function () {
                        G.STATE = G.STATES.ROUND_EVAL;
                        G.STATE_COMPLETE = false;
                        if (G.GAME.round_resets.blind === G.P_BLINDS.bl_small) {
                            G.GAME.round_resets.blind_states.Small = "Defeated";
                        }
                        else if (G.GAME.round_resets.blind === G.P_BLINDS.bl_big) {
                            G.GAME.round_resets.blind_states.Big = "Defeated";
                        }
                        else {
                            G.GAME.current_round.voucher = get_next_voucher_key();
                            G.GAME.round_resets.blind_states.Boss = "Defeated";
                            for (const [k, v] of ipairs(G.playing_cards)) {
                                v.ability.played_this_ante = undefined;
                            }
                        }
                        if (G.GAME.round_resets.temp_handsize) {
                            G.hand.change_size(-G.GAME.round_resets.temp_handsize);
                            G.GAME.round_resets.temp_handsize = undefined;
                        }
                        if (G.GAME.round_resets.temp_reroll_cost) {
                            G.GAME.round_resets.temp_reroll_cost = undefined;
                            calculate_reroll_cost(true);
                        }
                        reset_idol_card();
                        reset_mail_rank();
                        reset_ancient_card();
                        reset_castle_card();
                        for (const [_, mod] of ipairs(SMODS.mod_list)) {
                            if (mod.reset_game_globals && type(mod.reset_game_globals) === "function") {
                                mod.reset_game_globals(false);
                            }
                        }
                        for (const [k, v] of ipairs(G.playing_cards)) {
                            v.ability.discarded = undefined;
                            v.ability.forced_selection = undefined;
                        }
                        return true;
                    } }));
            }
            return true;
        } }));
}
function new_round(): void {
    G.RESET_JIGGLES = undefined;
    delay(0.4);
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            G.GAME.current_round.discards_left = math.max(0, G.GAME.round_resets.discards + G.GAME.round_bonus.discards);
            G.GAME.current_round.hands_left = math.max(1, G.GAME.round_resets.hands + G.GAME.round_bonus.next_hands);
            G.GAME.current_round.hands_played = 0;
            G.GAME.current_round.discards_used = 0;
            G.GAME.current_round.reroll_cost_increase = 0;
            G.GAME.current_round.used_packs = {};
            for (const [k, v] of pairs(G.GAME.hands)) {
                v.played_this_round = 0;
            }
            for (const [k, v] of pairs(G.playing_cards)) {
                v.ability.wheel_flipped = undefined;
            }
            let chaos = find_joker("Chaos the Clown");
            G.GAME.current_round.free_rerolls = chaos.length;
            calculate_reroll_cost(true);
            G.GAME.round_bonus.next_hands = 0;
            G.GAME.round_bonus.discards = 0;
            let blhash = "";
            if (G.GAME.round_resets.blind === G.P_BLINDS.bl_small) {
                G.GAME.round_resets.blind_states.Small = "Current";
                G.GAME.current_boss_streak = 0;
                blhash = "S";
            }
            else if (G.GAME.round_resets.blind === G.P_BLINDS.bl_big) {
                G.GAME.round_resets.blind_states.Big = "Current";
                G.GAME.current_boss_streak = 0;
                blhash = "B";
            }
            else {
                G.GAME.round_resets.blind_states.Boss = "Current";
                blhash = "L";
            }
            G.GAME.subhash = G.GAME.round_resets.ante + blhash;
            G.GAME.blind.set_blind(G.GAME.round_resets.blind);
            SMODS.calculate_context({ setting_blind: true, blind: G.GAME.round_resets.blind });
            delay(0.4);
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.STATE = G.STATES.DRAW_TO_HAND;
                    G.deck.shuffle("nr" + G.GAME.round_resets.ante);
                    G.deck.hard_set_T();
                    G.STATE_COMPLETE = false;
                    return true;
                } }));
            return true;
        } }));
}
G.FUNCS.draw_from_deck_to_hand = function (e) {
    if (!(G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED) && G.hand.config.card_limit <= 0 && G.hand.cards.length === 0) {
        G.STATE = G.STATES.GAME_OVER;
        G.STATE_COMPLETE = false;
        return true;
    }
    let hand_space = e;
    if (!hand_space) {
        let limit = G.hand.config.card_limit - G.hand.cards.length;
        let n = 0;
        while (n < G.deck.cards.length) {
            let card = G.deck.cards[G.deck.cards.length - n];
            limit = limit - 1 + (card.edition && card.edition.card_limit || 0);
            if (limit < 0) {
                break;
            }
            n = n + 1;
        }
        hand_space = n;
    }
    if (G.GAME.blind.name === "The Serpent" && !G.GAME.blind.disabled && (G.GAME.current_round.hands_played > 0 || G.GAME.current_round.discards_used > 0)) {
        hand_space = math.min(G.deck.cards.length, 3);
    }
    delay(0.3);
    for (let i = 1; i <= hand_space; i++) {
        if (G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK) {
            draw_card(G.deck, G.hand, i * 100 / hand_space, "up", true);
        }
        else {
            draw_card(G.deck, G.hand, i * 100 / hand_space, "up", true);
        }
    }
};
G.FUNCS.discard_cards_from_highlighted = function (e, hook) {
    stop_use();
    G.CONTROLLER.interrupt.focus = true;
    G.CONTROLLER.save_cardarea_focus("hand");
    for (const [k, v] of ipairs(G.playing_cards)) {
        v.ability.forced_selection = undefined;
    }
    if (G.CONTROLLER.focused.target && G.CONTROLLER.focused.target.area === G.hand) {
        G.card_area_focus_reset = { area: G.hand, rank: G.CONTROLLER.focused.target.rank };
    }
    let highlighted_count = math.min(G.hand.highlighted.length, G.discard.config.card_limit - G.play.cards.length);
    if (highlighted_count > 0) {
        update_hand_text({ immediate: true, nopulse: true, delay: 0 }, { mult: 0, chips: 0, level: "", handname: "" });
        table.sort(G.hand.highlighted, function (a, b) {
            return a.T.x < b.T.x;
        });
        inc_career_stat("c_cards_discarded", highlighted_count);
        SMODS.calculate_context({ pre_discard: true, full_hand: G.hand.highlighted, hook: hook });
        let cards = {};
        let destroyed_cards = {};
        for (let i = 1; i <= highlighted_count; i++) {
            G.hand.highlighted[i].calculate_seal({ discard: true });
            let removed = false;
            let effects = {};
            SMODS.calculate_context({ discard: true, other_card: G.hand.highlighted[i], full_hand: G.hand.highlighted }, effects);
            SMODS.trigger_effects(effects);
            for (const [_, eval] of pairs(effects)) {
                if (type(eval) === "table") {
                    for (const [key, eval2] of pairs(eval)) {
                        if (key === "remove" || type(eval2) === "table" && eval2.remove) {
                            removed = true;
                        }
                    }
                }
            }
            table.insert(cards, G.hand.highlighted[i]);
            if (removed) {
                destroyed_cards[destroyed_cards.length + 1] = G.hand.highlighted[i];
                if (SMODS.has_enhancement(G.hand.highlighted[i], "m_glass")) {
                    G.hand.highlighted[i].shatter();
                }
                else {
                    G.hand.highlighted[i].start_dissolve();
                }
            }
            else {
                G.hand.highlighted[i].ability.discarded = true;
                draw_card(G.hand, G.discard, i * 100 / highlighted_count, "down", false, G.hand.highlighted[i]);
            }
        }
        if (destroyed_cards[1]) {
            SMODS.calculate_context({ remove_playing_cards: true, removed: destroyed_cards });
        }
        G.GAME.round_scores.cards_discarded.amt = G.GAME.round_scores.cards_discarded.amt + cards.length;
        check_for_unlock({ type: "discard_custom", cards: cards });
        if (!hook) {
            if (G.GAME.modifiers.discard_cost) {
                ease_dollars(-G.GAME.modifiers.discard_cost);
            }
            ease_discard(-1);
            G.GAME.current_round.discards_used = G.GAME.current_round.discards_used + 1;
            G.STATE = G.STATES.DRAW_TO_HAND;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.STATE_COMPLETE = false;
                    return true;
                } }));
        }
    }
};
G.FUNCS.play_cards_from_highlighted = function (e) {
    if (G.play && G.play.cards[1]) {
        return;
    }
    stop_use();
    G.GAME.blind.triggered = false;
    G.CONTROLLER.interrupt.focus = true;
    G.CONTROLLER.save_cardarea_focus("hand");
    for (const [k, v] of ipairs(G.playing_cards)) {
        v.ability.forced_selection = undefined;
    }
    table.sort(G.hand.highlighted, function (a, b) {
        return a.T.x < b.T.x;
    });
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            G.STATE = G.STATES.HAND_PLAYED;
            G.STATE_COMPLETE = true;
            return true;
        } }));
    inc_career_stat("c_cards_played", G.hand.highlighted.length);
    inc_career_stat("c_hands_played", 1);
    ease_hands_played(-1);
    delay(0.4);
    for (let i = 1; i <= G.hand.highlighted.length; i++) {
        if (G.hand.highlighted[i].is_face()) {
            inc_career_stat("c_face_cards_played", 1);
        }
        G.hand.highlighted[i].base.times_played = G.hand.highlighted[i].base.times_played + 1;
        G.hand.highlighted[i].ability.played_this_ante = true;
        G.GAME.round_scores.cards_played.amt = G.GAME.round_scores.cards_played.amt + 1;
        draw_card(G.hand, G.play, i * 100 / G.hand.highlighted.length, "up", undefined, G.hand.highlighted[i]);
    }
    check_for_unlock({ type: "run_card_replays" });
    if (G.GAME.blind.press_play()) {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                SMODS.juice_up_blind();
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06 * G.SETTINGS.GAMESPEED, blockable: false, blocking: false, func: function () {
                        play_sound("tarot2", 0.76, 0.4);
                        return true;
                    } }));
                play_sound("tarot2", 1, 0.4);
                return true;
            } }));
        delay(0.4);
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            check_for_unlock({ type: "hand_contents", cards: G.play.cards });
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.FUNCS.evaluate_play();
                    return true;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                    check_for_unlock({ type: "play_all_hearts" });
                    G.FUNCS.draw_from_play_to_discard();
                    G.GAME.hands_played = G.GAME.hands_played + 1;
                    G.GAME.current_round.hands_played = G.GAME.current_round.hands_played + 1;
                    return true;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.STATE_COMPLETE = false;
                    return true;
                } }));
            return true;
        } }));
};
G.FUNCS.get_poker_hand_info = function (_cards) {
    let poker_hands = evaluate_poker_hand(_cards);
    let scoring_hand = {};
    let [text, disp_text, loc_disp_text] = ["NULL", "NULL", "NULL"];
    if (next(poker_hands["Flush Five"])) {
        text = "Flush Five";
        scoring_hand = poker_hands["Flush Five"][1];
    }
    else if (next(poker_hands["Flush House"])) {
        text = "Flush House";
        scoring_hand = poker_hands["Flush House"][1];
    }
    else if (next(poker_hands["Five of a Kind"])) {
        text = "Five of a Kind";
        scoring_hand = poker_hands["Five of a Kind"][1];
    }
    else if (next(poker_hands["Straight Flush"])) {
        text = "Straight Flush";
        scoring_hand = poker_hands["Straight Flush"][1];
    }
    else if (next(poker_hands["Four of a Kind"])) {
        text = "Four of a Kind";
        scoring_hand = poker_hands["Four of a Kind"][1];
    }
    else if (next(poker_hands["Full House"])) {
        text = "Full House";
        scoring_hand = poker_hands["Full House"][1];
    }
    else if (next(poker_hands["Flush"])) {
        text = "Flush";
        scoring_hand = poker_hands["Flush"][1];
    }
    else if (next(poker_hands["Straight"])) {
        text = "Straight";
        scoring_hand = poker_hands["Straight"][1];
    }
    else if (next(poker_hands["Three of a Kind"])) {
        text = "Three of a Kind";
        scoring_hand = poker_hands["Three of a Kind"][1];
    }
    else if (next(poker_hands["Two Pair"])) {
        text = "Two Pair";
        scoring_hand = poker_hands["Two Pair"][1];
    }
    else if (next(poker_hands["Pair"])) {
        text = "Pair";
        scoring_hand = poker_hands["Pair"][1];
    }
    else if (next(poker_hands["High Card"])) {
        text = "High Card";
        scoring_hand = poker_hands["High Card"][1];
    }
    disp_text = text;
    if (text === "Straight Flush") {
        let min = 10;
        for (let j = 1; j <= scoring_hand.length; j++) {
            if (scoring_hand[j].get_id() < min) {
                min = scoring_hand[j].get_id();
            }
        }
        if (min >= 10) {
            disp_text = "Royal Flush";
        }
    }
    loc_disp_text = localize(disp_text, "poker_hands");
    return [text, loc_disp_text, poker_hands, scoring_hand, disp_text];
};
G.FUNCS.evaluate_play = function (e) {
    let [text, disp_text, poker_hands, scoring_hand, non_loc_disp_text] = G.FUNCS.get_poker_hand_info(G.play.cards);
    G.GAME.hands[text].played = G.GAME.hands[text].played + 1;
    G.GAME.hands[text].played_this_round = G.GAME.hands[text].played_this_round + 1;
    G.GAME.last_hand_played = text;
    set_hand_usage(text);
    G.GAME.hands[text].visible = true;
    let pures = {};
    for (let i = 1; i <= G.play.cards.length; i++) {
        if (next(find_joker("Splash"))) {
            scoring_hand[i] = G.play.cards[i];
        }
        else {
            if (SMODS.always_scores(G.play.cards[i])) {
                let inside = false;
                for (let j = 1; j <= scoring_hand.length; j++) {
                    if (scoring_hand[j] === G.play.cards[i]) {
                        inside = true;
                    }
                }
                if (!inside) {
                    table.insert(pures, G.play.cards[i]);
                }
            }
        }
    }
    for (let i = 1; i <= pures.length; i++) {
        table.insert(scoring_hand, pures[i]);
    }
    table.sort(scoring_hand, function (a, b) {
        return a.T.x < b.T.x;
    });
    delay(0.2);
    for (let i = 1; i <= scoring_hand.length; i++) {
        highlight_card(scoring_hand[i], (i - 0.999) / 5, "up");
    }
    percent = 0.3;
    percent_delta = 0.08;
    if (G.GAME.current_round.current_hand.handname !== disp_text) {
        delay(0.3);
    }
    update_hand_text({ sound: G.GAME.current_round.current_hand.handname !== disp_text && "button" || undefined, volume: 0.4, immediate: true, nopulse: undefined, delay: G.GAME.current_round.current_hand.handname !== disp_text && 0.4 || 0 }, { handname: disp_text, level: G.GAME.hands[text].level, mult: G.GAME.hands[text].mult, chips: G.GAME.hands[text].chips });
    if (!G.GAME.blind.debuff_hand(G.play.cards, poker_hands, text)) {
        mult = mod_mult(G.GAME.hands[text].mult);
        hand_chips = mod_chips(G.GAME.hands[text].chips);
        check_for_unlock({ type: "hand", handname: text, disp_text: non_loc_disp_text, scoring_hand: scoring_hand, full_hand: G.play.cards });
        delay(0.4);
        if (G.GAME.first_used_hand_level && G.GAME.first_used_hand_level > 0) {
            level_up_hand(G.deck.cards[1], text, undefined, G.GAME.first_used_hand_level);
            G.GAME.first_used_hand_level = undefined;
        }
        let hand_text_set = false;
        SMODS.calculate_context({ full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, before: true });
        mult = mod_mult(G.GAME.hands[text].mult);
        hand_chips = mod_chips(G.GAME.hands[text].chips);
        let modded = false;
        [mult, hand_chips, modded] = G.GAME.blind.modify_hand(G.play.cards, poker_hands, text, mult, hand_chips);
        [mult, hand_chips] = [mod_mult(mult), mod_chips(hand_chips)];
        if (modded) {
            update_hand_text({ sound: "chips2", modded: modded }, { chips: hand_chips, mult: mult });
        }
        delay(0.3);
        for (const [_, v] of ipairs(SMODS.get_card_areas("playing_cards"))) {
            SMODS.calculate_main_scoring({ cardarea: v, full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands }, v === G.play && scoring_hand || undefined);
            delay(0.3);
        }
        percent = percent + percent_delta;
        for (const [_, area] of ipairs(SMODS.get_card_areas("jokers"))) {
            for (const [_, _card] of ipairs(area.cards)) {
                let effects = {};
                let eval = eval_card(_card, { cardarea: G.jokers, full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, edition: true, pre_joker: true });
                if (eval.edition) {
                    effects[effects.length + 1] = eval;
                }
                let [joker_eval, post] = eval_card(_card, { cardarea: G.jokers, full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, joker_main: true });
                if (next(joker_eval)) {
                    if (joker_eval.edition) {
                        joker_eval.edition = {};
                    }
                    table.insert(effects, joker_eval);
                    for (const [_, v] of ipairs(post)) {
                        effects[effects.length + 1] = v;
                    }
                    if (joker_eval.retriggers) {
                        for (let rt = 1; rt <= joker_eval.retriggers.length; rt++) {
                            let [rt_eval, rt_post] = eval_card(_card, { cardarea: G.jokers, full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, joker_main: true, retrigger_joker: true });
                            table.insert(effects, [joker_eval.retriggers[rt]]);
                            table.insert(effects, rt_eval);
                            for (const [_, v] of ipairs(rt_post)) {
                                effects[effects.length + 1] = v;
                            }
                        }
                    }
                }
                for (const [_, _area] of ipairs(SMODS.get_card_areas("jokers"))) {
                    for (const [_, _joker] of ipairs(_area.cards)) {
                        let other_key = "other_unknown";
                        if (_card.ability.set === "Joker") {
                            other_key = "other_joker";
                        }
                        if (_card.ability.consumeable) {
                            other_key = "other_consumeable";
                        }
                        if (_card.ability.set === "Voucher") {
                            other_key = "other_voucher";
                        }
                        let [joker_eval, post] = eval_card(_joker, { full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, [other_key]: _card, other_main: _card });
                        if (next(joker_eval)) {
                            if (joker_eval.edition) {
                                joker_eval.edition = {};
                            }
                            joker_eval.jokers.juice_card = _joker;
                            table.insert(effects, joker_eval);
                            for (const [_, v] of ipairs(post)) {
                                effects[effects.length + 1] = v;
                            }
                            if (joker_eval.retriggers) {
                                for (let rt = 1; rt <= joker_eval.retriggers.length; rt++) {
                                    let [rt_eval, rt_post] = eval_card(_card, { full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, [other_key]: _card, retrigger_joker: true });
                                    table.insert(effects, [joker_eval.retriggers[rt]]);
                                    table.insert(effects, rt_eval);
                                    for (const [_, v] of ipairs(rt_post)) {
                                        effects[effects.length + 1] = v;
                                    }
                                }
                            }
                        }
                    }
                }
                let eval = eval_card(_card, { cardarea: G.jokers, full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, edition: true, post_joker: true });
                if (eval.edition) {
                    effects[effects.length + 1] = eval;
                }
                SMODS.trigger_effects(effects, _card);
                let deck_effect = G.GAME.selected_back.trigger_effect({ full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, other_joker: _card.ability.set === "Joker" && _card || false, other_consumeable: _card.ability.set !== "Joker" && _card || false });
                if (deck_effect) {
                    SMODS.calculate_effect(deck_effect, G.deck.cards[1] || G.deck);
                }
            }
        }
        SMODS.calculate_context({ full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, final_scoring_step: true });
        let [nu_chip, nu_mult] = G.GAME.selected_back.trigger_effect({ context: "final_scoring_step", chips: hand_chips, mult: mult });
        mult = mod_mult(nu_mult || mult);
        hand_chips = mod_chips(nu_chip || hand_chips);
        let cards_destroyed = {};
        for (const [_, v] of ipairs(SMODS.get_card_areas("playing_cards", "destroying_cards"))) {
            SMODS.calculate_destroying_cards({ full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, cardarea: v }, cards_destroyed, v === G.play && scoring_hand || undefined);
        }
        if (cards_destroyed[1]) {
            SMODS.calculate_context({ scoring_hand: scoring_hand, remove_playing_cards: true, removed: cards_destroyed });
        }
        let glass_shattered = {};
        for (const [k, v] of ipairs(cards_destroyed)) {
            if (v.shattered) {
                glass_shattered[glass_shattered.length + 1] = v;
            }
        }
        check_for_unlock({ type: "shatter", shattered: glass_shattered });
        for (let i = 1; i <= cards_destroyed.length; i++) {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    if (SMODS.has_enhancement(cards_destroyed[i], "m_glass")) {
                        cards_destroyed[i].shatter();
                    }
                    else {
                        cards_destroyed[i].start_dissolve();
                    }
                    return true;
                } }));
        }
    }
    else {
        mult = mod_mult(0);
        hand_chips = mod_chips(0);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                SMODS.juice_up_blind();
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06 * G.SETTINGS.GAMESPEED, blockable: false, blocking: false, func: function () {
                        play_sound("tarot2", 0.76, 0.4);
                        return true;
                    } }));
                play_sound("tarot2", 1, 0.4);
                return true;
            } }));
        play_area_status_text("Not Allowed!");
        SMODS.calculate_context({ full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, debuffed_hand: true });
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
            update_hand_text({ delay: 0, immediate: true }, { mult: 0, chips: 0, chip_total: math.floor(hand_chips * mult), level: "", handname: "" });
            play_sound("button", 0.9, 0.6);
            return true;
        } }));
    check_and_set_high_score("hand", hand_chips * mult);
    check_for_unlock({ type: "chip_score", chips: math.floor(hand_chips * mult) });
    if (hand_chips * mult > 0) {
        delay(0.8);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                play_sound("chips2");
                return true;
            } }));
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blocking: false, ref_table: G.GAME, ref_value: "chips", ease_to: G.GAME.chips + math.floor(hand_chips * mult), delay: 0.5, func: function (t) {
            return math.floor(t);
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blocking: true, ref_table: G.GAME.current_round.current_hand, ref_value: "chip_total", ease_to: 0, delay: 0.5, func: function (t) {
            return math.floor(t);
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            G.GAME.current_round.current_hand.handname = "";
            return true;
        } }));
    delay(0.3);
    SMODS.calculate_context({ full_hand: G.play.cards, scoring_hand: scoring_hand, scoring_name: text, poker_hands: poker_hands, after: true });
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            if (G.GAME.modifiers.debuff_played_cards) {
                for (const [k, v] of ipairs(scoring_hand)) {
                    v.ability.perma_debuff = true;
                }
            }
            return true;
        } }));
};
G.FUNCS.draw_from_play_to_discard = function (e) {
    let play_count = G.play.cards.length;
    let it = 1;
    for (const [k, v] of ipairs(G.play.cards)) {
        if (!v.shattered && !v.destroyed) {
            draw_card(G.play, G.discard, it * 100 / play_count, "down", false, v);
            it = it + 1;
        }
    }
};
G.FUNCS.draw_from_play_to_hand = function (cards) {
    let gold_count = cards.length;
    for (let i = 1; i <= gold_count; i++) {
        if (!cards[i].shattered && !cards[i].destroyed) {
            draw_card(G.play, G.hand, i * 100 / gold_count, "up", true, cards[i]);
        }
    }
};
G.FUNCS.draw_from_discard_to_deck = function (e) {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            let discard_count = G.discard.cards.length;
            for (let i = 1; i <= discard_count; i++) {
                draw_card(G.discard, G.deck, i * 100 / discard_count, "up", undefined, undefined, 0.005, i % 2 === 0, undefined, math.max((21 - i) / 20, 0.7));
            }
            return true;
        } }));
};
G.FUNCS.draw_from_hand_to_deck = function (e) {
    let hand_count = G.hand.cards.length;
    for (let i = 1; i <= hand_count; i++) {
        draw_card(G.hand, G.deck, i * 100 / hand_count, "down", undefined, undefined, 0.08);
    }
};
G.FUNCS.draw_from_hand_to_discard = function (e) {
    let hand_count = G.hand.cards.length;
    for (let i = 1; i <= hand_count; i++) {
        draw_card(G.hand, G.discard, i * 100 / hand_count, "down", undefined, undefined, 0.07);
    }
};
G.FUNCS.evaluate_round = function () {
    total_cashout_rows = 0;
    let pitch = 0.95;
    let dollars = 0;
    if (G.GAME.chips - G.GAME.blind.chips >= 0) {
        add_round_eval_row({ dollars: G.GAME.blind.dollars, name: "blind1", pitch: pitch });
        pitch = pitch + 0.06;
        dollars = dollars + G.GAME.blind.dollars;
    }
    else {
        add_round_eval_row({ dollars: 0, name: "blind1", pitch: pitch, saved: true });
        pitch = pitch + 0.06;
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 1.3 * math.min(G.GAME.blind.dollars + 2, 7) / 2 * 0.15 + 0.5, func: function () {
            G.GAME.blind.defeat();
            return true;
        } }));
    delay(0.2);
    G.E_MANAGER.add_event(new GameEvent({ func: function () {
            ease_background_colour_blind(G.STATES.ROUND_EVAL, "");
            return true;
        } }));
    G.GAME.selected_back.trigger_effect({ context: "eval" });
    if (G.GAME.current_round.hands_left > 0 && !G.GAME.modifiers.no_extra_hand_money) {
        add_round_eval_row({ dollars: G.GAME.current_round.hands_left * (G.GAME.modifiers.money_per_hand || 1), disp: G.GAME.current_round.hands_left, bonus: true, name: "hands", pitch: pitch });
        pitch = pitch + 0.06;
        dollars = dollars + G.GAME.current_round.hands_left * (G.GAME.modifiers.money_per_hand || 1);
    }
    if (G.GAME.current_round.discards_left > 0 && G.GAME.modifiers.money_per_discard) {
        add_round_eval_row({ dollars: G.GAME.current_round.discards_left * G.GAME.modifiers.money_per_discard, disp: G.GAME.current_round.discards_left, bonus: true, name: "discards", pitch: pitch });
        pitch = pitch + 0.06;
        dollars = dollars + G.GAME.current_round.discards_left * G.GAME.modifiers.money_per_discard;
    }
    let i = 0;
    for (const [_, area] of ipairs(SMODS.get_card_areas("jokers"))) {
        for (const [_, _card] of ipairs(area.cards)) {
            let ret = _card.calculate_dollar_bonus();
            if (ret) {
                i = i + 1;
                add_round_eval_row({ dollars: ret, bonus: true, name: "joker" + i, pitch: pitch, card: _card });
                pitch = pitch + 0.06;
                dollars = dollars + ret;
            }
        }
    }
    for (let i = 1; i <= G.GAME.tags.length; i++) {
        let ret = G.GAME.tags[i].apply_to_run({ type: "eval" });
        if (ret) {
            add_round_eval_row({ dollars: ret.dollars, bonus: true, name: "tag" + i, pitch: pitch, condition: ret.condition, pos: ret.pos, tag: ret.tag });
            pitch = pitch + 0.06;
            dollars = dollars + ret.dollars;
        }
    }
    if (G.GAME.dollars >= 5 && !G.GAME.modifiers.no_interest) {
        add_round_eval_row({ bonus: true, name: "interest", pitch: pitch, dollars: G.GAME.interest_amount * math.min(math.floor(G.GAME.dollars / 5), G.GAME.interest_cap / 5) });
        pitch = pitch + 0.06;
        if (!G.GAME.seeded && !G.GAME.challenge || SMODS.config.seeded_unlocks) {
            if (G.GAME.interest_amount * math.min(math.floor(G.GAME.dollars / 5), G.GAME.interest_cap / 5) === G.GAME.interest_amount * G.GAME.interest_cap / 5) {
                G.PROFILES[G.SETTINGS.profile].career_stats.c_round_interest_cap_streak = G.PROFILES[G.SETTINGS.profile].career_stats.c_round_interest_cap_streak + 1;
            }
            else {
                G.PROFILES[G.SETTINGS.profile].career_stats.c_round_interest_cap_streak = 0;
            }
        }
        check_for_unlock({ type: "interest_streak" });
        dollars = dollars + G.GAME.interest_amount * math.min(math.floor(G.GAME.dollars / 5), G.GAME.interest_cap / 5);
    }
    pitch = pitch + 0.06;
    if (total_cashout_rows > 7) {
        let total_hidden = total_cashout_rows - 7;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.38, func: function () {
                let hidden = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize({ type: "variable", key: "cashout_hidden", vars: [total_hidden] })], colours: [G.C.WHITE], shadow: true, float: false, scale: 0.45, font: G.LANGUAGES["en-us"].font, pop_in: 0 }) } }] };
                G.round_eval.add_child(hidden, G.round_eval.get_UIE_by_ID("bonus_round_eval"));
                return true;
            } }));
    }
    add_round_eval_row({ name: "bottom", dollars: dollars });
};
G.FUNCS.tutorial_controller = function () {
    if (G.F_SKIP_TUTORIAL) {
        G.SETTINGS.tutorial_complete = true;
        G.SETTINGS.tutorial_progress = undefined;
        return;
    }
    G.SETTINGS.tutorial_progress = G.SETTINGS.tutorial_progress || { forced_shop: ["j_joker", "c_empress"], forced_voucher: "v_grabber", forced_tags: ["tag_handy", "tag_garbage"], hold_parts: {}, completed_parts: {} };
    if (!G.SETTINGS.paused && !G.SETTINGS.tutorial_complete) {
        if (G.STATE === G.STATES.BLIND_SELECT && G.blind_select && !G.SETTINGS.tutorial_progress.completed_parts["small_blind"]) {
            G.SETTINGS.tutorial_progress.section = "small_blind";
            G.FUNCS.tutorial_part("small_blind");
            G.SETTINGS.tutorial_progress.completed_parts["small_blind"] = true;
            G.save_progress();
        }
        if (G.STATE === G.STATES.BLIND_SELECT && G.blind_select && !G.SETTINGS.tutorial_progress.completed_parts["big_blind"] && G.GAME.round > 0) {
            G.SETTINGS.tutorial_progress.section = "big_blind";
            G.FUNCS.tutorial_part("big_blind");
            G.SETTINGS.tutorial_progress.completed_parts["big_blind"] = true;
            G.SETTINGS.tutorial_progress.forced_tags = undefined;
            G.save_progress();
        }
        if (G.STATE === G.STATES.SELECTING_HAND && !G.SETTINGS.tutorial_progress.completed_parts["second_hand"] && G.SETTINGS.tutorial_progress.hold_parts["big_blind"]) {
            G.SETTINGS.tutorial_progress.section = "second_hand";
            G.FUNCS.tutorial_part("second_hand");
            G.SETTINGS.tutorial_progress.completed_parts["second_hand"] = true;
            G.save_progress();
        }
        if (G.SETTINGS.tutorial_progress.hold_parts["second_hand"]) {
            G.SETTINGS.tutorial_complete = true;
        }
        if (!G.SETTINGS.tutorial_progress.completed_parts["first_hand_section"]) {
            if (G.STATE === G.STATES.SELECTING_HAND && !G.SETTINGS.tutorial_progress.completed_parts["first_hand"]) {
                G.SETTINGS.tutorial_progress.section = "first_hand";
                G.FUNCS.tutorial_part("first_hand");
                G.SETTINGS.tutorial_progress.completed_parts["first_hand"] = true;
                G.save_progress();
            }
            if (G.STATE === G.STATES.SELECTING_HAND && !G.SETTINGS.tutorial_progress.completed_parts["first_hand_2"] && G.SETTINGS.tutorial_progress.hold_parts["first_hand"]) {
                G.FUNCS.tutorial_part("first_hand_2");
                G.SETTINGS.tutorial_progress.completed_parts["first_hand_2"] = true;
                G.save_progress();
            }
            if (G.STATE === G.STATES.SELECTING_HAND && !G.SETTINGS.tutorial_progress.completed_parts["first_hand_3"] && G.SETTINGS.tutorial_progress.hold_parts["first_hand_2"]) {
                G.FUNCS.tutorial_part("first_hand_3");
                G.SETTINGS.tutorial_progress.completed_parts["first_hand_3"] = true;
                G.save_progress();
            }
            if (G.STATE === G.STATES.SELECTING_HAND && !G.SETTINGS.tutorial_progress.completed_parts["first_hand_4"] && G.SETTINGS.tutorial_progress.hold_parts["first_hand_3"]) {
                G.FUNCS.tutorial_part("first_hand_4");
                G.SETTINGS.tutorial_progress.completed_parts["first_hand_4"] = true;
                G.SETTINGS.tutorial_progress.completed_parts["first_hand_section"] = true;
                G.save_progress();
            }
        }
        if (G.STATE === G.STATES.SHOP && G.shop && G.shop.VT.y < 5 && !G.SETTINGS.tutorial_progress.completed_parts["shop_1"]) {
            G.SETTINGS.tutorial_progress.section = "shop";
            G.FUNCS.tutorial_part("shop_1");
            G.SETTINGS.tutorial_progress.completed_parts["shop_1"] = true;
            G.SETTINGS.tutorial_progress.forced_voucher = undefined;
            G.save_progress();
        }
    }
};
G.FUNCS.tutorial_part = function (_part) {
    let step = 1;
    G.SETTINGS.paused = true;
    if (_part === "small_blind") {
        step = tutorial_info({ text_key: "sb_1", attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, step: step });
        step = tutorial_info({ text_key: "sb_2", attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, step: step });
        step = tutorial_info({ text_key: "sb_3", highlight: [G.blind_select.UIRoot.children[1].children[1].config.object.get_UIE_by_ID("blind_name"), G.blind_select.UIRoot.children[1].children[1].config.object.get_UIE_by_ID("blind_desc")], attach: { major: G.blind_select.UIRoot.children[1].children[1], type: "tr", offset: { x: 2, y: 4 } }, step: step });
        step = tutorial_info({ text_key: "sb_4", highlight: [G.blind_select.UIRoot.children[1].children[1]], snap_to: function () {
                if (G.blind_select && G.blind_select.UIRoot && G.blind_select.UIRoot.children[1] && G.blind_select.UIRoot.children[1].children[1] && G.blind_select.UIRoot.children[1].children[1].config.object) {
                    return G.blind_select.UIRoot.children[1].children[1].config.object.get_UIE_by_ID("select_blind_button");
                }
            }, attach: { major: G.blind_select.UIRoot.children[1].children[1], type: "tr", offset: { x: 2, y: 4 } }, step: step, no_button: true, button_listen: "select_blind" });
    }
    else if (_part === "big_blind") {
        step = tutorial_info({ text_key: "bb_1", highlight: [G.blind_select.UIRoot.children[1].children[2].config.object.get_UIE_by_ID("blind_name"), G.blind_select.UIRoot.children[1].children[2].config.object.get_UIE_by_ID("blind_desc")], hard_set: true, attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step });
        step = tutorial_info({ text_key: "bb_2", highlight: [G.blind_select.UIRoot.children[1].children[2].config.object.get_UIE_by_ID("blind_name"), G.blind_select.UIRoot.children[1].children[2].config.object.get_UIE_by_ID("tag_desc")], attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step });
        step = tutorial_info({ text_key: "bb_3", highlight: [G.blind_select.UIRoot.children[1].children[3].config.object.get_UIE_by_ID("blind_name"), G.blind_select.UIRoot.children[1].children[3].config.object.get_UIE_by_ID("blind_desc")], attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step });
        step = tutorial_info({ text_key: "bb_4", highlight: [G.blind_select.UIRoot.children[1].children[3].config.object.get_UIE_by_ID("blind_name"), G.blind_select.UIRoot.children[1].children[3].config.object.get_UIE_by_ID("blind_desc"), G.blind_select.UIRoot.children[1].children[3].config.object.get_UIE_by_ID("blind_extras"), G.HUD.get_UIE_by_ID("hud_ante")], attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step });
        step = tutorial_info({ text_key: "bb_5", loc_vars: [G.GAME.win_ante], highlight: [G.blind_select, G.HUD.get_UIE_by_ID("hud_ante")], attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step, no_button: true, snap_to: function () {
                if (G.blind_select && G.blind_select.UIRoot && G.blind_select.UIRoot.children[1] && G.blind_select.UIRoot.children[1].children[2] && G.blind_select.UIRoot.children[1].children[2].config.object) {
                    return G.blind_select.UIRoot.children[1].children[2].config.object.get_UIE_by_ID("select_blind_button");
                }
            }, button_listen: "select_blind" });
    }
    else if (_part === "first_hand") {
        step = tutorial_info({ text_key: "fh_1", attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, step: step });
        step = tutorial_info({ text_key: "fh_2", highlight: [G.HUD.get_UIE_by_ID("hand_text_area")], attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, step: step });
        step = tutorial_info({ text_key: "fh_3", attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, highlight: [G.HUD.get_UIE_by_ID("run_info_button")], no_button: true, button_listen: "run_info", snap_to: function () {
                return G.HUD.get_UIE_by_ID("run_info_button");
            }, step: step });
    }
    else if (_part === "first_hand_2") {
        step = tutorial_info({ hard_set: true, text_key: "fh_4", highlight: [G.hand, G.HUD.get_UIE_by_ID("run_info_button")], attach: { major: G.hand, type: "cl", offset: { x: -1.5, y: 0 } }, snap_to: function () {
                return G.hand.cards[1];
            }, step: step });
        step = tutorial_info({ text_key: "fh_5", highlight: [G.hand, G.buttons.get_UIE_by_ID("play_button"), G.HUD.get_UIE_by_ID("run_info_button")], attach: { major: G.hand, type: "cl", offset: { x: -1.5, y: 0 } }, no_button: true, button_listen: "play_cards_from_highlighted", step: step });
    }
    else if (_part === "first_hand_3") {
        step = tutorial_info({ hard_set: true, text_key: "fh_6", highlight: [G.hand, G.buttons.get_UIE_by_ID("discard_button"), G.HUD.get_UIE_by_ID("run_info_button")], attach: { major: G.hand, type: "cl", offset: { x: -1.5, y: 0 } }, no_button: true, button_listen: "discard_cards_from_highlighted", step: step });
    }
    else if (_part === "first_hand_4") {
        step = tutorial_info({ hard_set: true, text_key: "fh_7", highlight: [G.HUD.get_UIE_by_ID("hud_hands").parent], attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, step: step });
        step = tutorial_info({ text_key: "fh_8", highlight: [G.HUD.get_UIE_by_ID("hud_hands").parent, G.HUD.get_UIE_by_ID("row_dollars_chips"), G.HUD_blind], attach: { major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } }, step: step });
    }
    else if (_part === "second_hand") {
        step = tutorial_info({ text_key: "sh_1", hard_set: true, highlight: [G.jokers], attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step });
        let empress = find_joker("The Empress")[1];
        if (empress) {
            step = tutorial_info({ text_key: "sh_2", highlight: [empress], attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, step: step });
            step = tutorial_info({ text_key: "sh_3", attach: { major: G.HUD, type: "cm", offset: { x: 0, y: -2 } }, highlight: [empress, G.hand], no_button: true, button_listen: "use_card", snap_to: function () {
                    return G.hand.cards[1];
                }, step: step });
        }
    }
    else if (_part === "shop_1") {
        step = tutorial_info({ hard_set: true, text_key: "s_1", highlight: [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent], attach: { major: G.shop, type: "tm", offset: { x: 0, y: 4 } }, step: step });
        step = tutorial_info({ text_key: "s_2", highlight: [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.shop_jokers.cards[2]], snap_to: function () {
                return G.shop_jokers.cards[2];
            }, attach: { major: G.shop, type: "tr", offset: { x: -0.5, y: 6 } }, no_button: true, button_listen: "buy_from_shop", step: step });
        step = tutorial_info({ text_key: "s_3", loc_vars: [G.P_CENTER_POOLS.Joker.length], highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.jokers.cards[1]];
            }, attach: { major: G.shop, type: "tm", offset: { x: 0, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_4", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.jokers.cards[1]];
            }, attach: { major: G.shop, type: "tm", offset: { x: 0, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_5", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.jokers];
            }, attach: { major: G.shop, type: "tm", offset: { x: 0, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_6", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.shop_jokers.cards[1]];
            }, snap_to: function () {
                return G.shop_jokers.cards[1];
            }, no_button: true, button_listen: "buy_from_shop", attach: { major: G.shop, type: "tr", offset: { x: -0.5, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_7", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.consumeables.cards[G.consumeables.cards.length]];
            }, attach: { major: G.shop, type: "tm", offset: { x: 0, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_8", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.consumeables];
            }, attach: { major: G.shop, type: "tm", offset: { x: 0, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_9", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.shop_vouchers];
            }, snap_to: function () {
                return G.shop_vouchers.cards[1];
            }, attach: { major: G.shop, type: "tr", offset: { x: -4, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_10", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.shop_vouchers];
            }, attach: { major: G.shop, type: "tr", offset: { x: -4, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_11", highlight: function () {
                return [G.SHOP_SIGN, G.HUD.get_UIE_by_ID("dollar_text_UI").parent.parent.parent, G.shop_booster];
            }, snap_to: function () {
                return G.shop_booster.cards[1];
            }, attach: { major: G.shop, type: "tl", offset: { x: 3, y: 6 } }, step: step });
        step = tutorial_info({ text_key: "s_12", highlight: function () {
                return [G.shop.get_UIE_by_ID("next_round_button")];
            }, snap_to: function () {
                if (G.shop) {
                    return G.shop.get_UIE_by_ID("next_round_button");
                }
            }, no_button: true, button_listen: "toggle_shop", attach: { major: G.shop, type: "tm", offset: { x: 0, y: 6 } }, step: step });
    }
    G.E_MANAGER.add_event(new GameEvent({ blockable: false, timer: "REAL", func: function () {
            if (G.OVERLAY_TUTORIAL.step === step && !G.OVERLAY_TUTORIAL.step_complete || G.OVERLAY_TUTORIAL.skip_steps) {
                if (G.OVERLAY_TUTORIAL.Jimbo) {
                    G.OVERLAY_TUTORIAL.Jimbo.remove();
                }
                if (G.OVERLAY_TUTORIAL.content) {
                    G.OVERLAY_TUTORIAL.content.remove();
                }
                G.OVERLAY_TUTORIAL.remove();
                G.OVERLAY_TUTORIAL = undefined;
                G.SETTINGS.tutorial_progress.hold_parts[_part] = true;
                return true;
            }
            return G.OVERLAY_TUTORIAL.step > step || G.OVERLAY_TUTORIAL.skip_steps;
        } }), "tutorial");
    G.SETTINGS.paused = false;
};