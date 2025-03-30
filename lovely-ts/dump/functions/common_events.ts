///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

function set_screen_positions(): void {
    if (G.STAGE === G.STAGES.RUN) {
        G.hand.T.x = G.TILE_W - G.hand.T.w - 2.85;
        G.hand.T.y = G.TILE_H - G.hand.T.h;
        G.play.T.x = G.hand.T.x + (G.hand.T.w - G.play.T.w) / 2;
        G.play.T.y = G.hand.T.y - 3.6;
        G.jokers.T.x = G.hand.T.x - 0.1;
        G.jokers.T.y = 0;
        G.consumeables.T.x = G.jokers.T.x + G.jokers.T.w + 0.2;
        G.consumeables.T.y = 0;
        G.deck.T.x = G.TILE_W - G.deck.T.w - 0.5;
        G.deck.T.y = G.TILE_H - G.deck.T.h;
        G.discard.T.x = G.jokers.T.x + G.jokers.T.w / 2 + 0.3 + 15;
        G.discard.T.y = 4.2;
        G.hand.hard_set_VT();
        G.play.hard_set_VT();
        G.jokers.hard_set_VT();
        G.consumeables.hard_set_VT();
        G.deck.hard_set_VT();
        G.discard.hard_set_VT();
    }
    if (G.STAGE === G.STAGES.MAIN_MENU) {
        if (G.STATE === G.STATES.DEMO_CTA) {
            G.title_top.T.x = G.TILE_W / 2 - G.title_top.T.w / 2;
            G.title_top.T.y = G.TILE_H / 2 - G.title_top.T.h / 2 - 2;
        }
        else {
            G.title_top.T.x = G.TILE_W / 2 - G.title_top.T.w / 2;
            G.title_top.T.y = G.TILE_H / 2 - G.title_top.T.h / 2 - (G.debug_splash_size_toggle && 2 || 1.2);
        }
        G.title_top.hard_set_VT();
    }
}
function ease_chips(mod): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            let chip_UI = G.HUD.get_UIE_by_ID("chip_UI_count");
            mod = mod || 0;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, ref_table: G.GAME, ref_value: "chips", ease_to: mod, delay: 0.3, func: function (t) {
                    return math.floor(t);
                } }));
            chip_UI.juice_up();
            play_sound("chips2");
            return true;
        } }));
}
function ease_dollars(mod, instant): void {
    function _mod(mod): void {
        let dollar_UI = G.HUD.get_UIE_by_ID("dollar_text_UI");
        mod = mod || 0;
        let text = "+" + localize("$");
        let col = G.C.MONEY;
        if (mod < 0) {
            text = "-" + localize("$");
            col = G.C.RED;
        }
        else {
            inc_career_stat("c_dollars_earned", mod);
        }
        G.GAME.dollars = G.GAME.dollars + mod;
        check_and_set_high_score("most_money", G.GAME.dollars);
        check_for_unlock({ type: "money" });
        dollar_UI.config.object.update();
        G.HUD.recalculate();
        attention_text({ text: text + tostring(math.abs(mod)), scale: 0.8, hold: 0.7, cover: dollar_UI.parent, cover_colour: col, align: "cm" });
        play_sound("coin1");
    }
    if (instant) {
        _mod(mod);
    }
    else {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                _mod(mod);
                return true;
            } }));
    }
}
function ease_discard(mod, instant, silent): void {
    let _mod = function (mod) {
        if (math.abs(math.max(G.GAME.current_round.discards_left, mod)) === 0) {
            return;
        }
        let discard_UI = G.HUD.get_UIE_by_ID("discard_UI_count");
        mod = mod || 0;
        mod = math.max(-G.GAME.current_round.discards_left, mod);
        let text = "+";
        let col = G.C.GREEN;
        if (mod < 0) {
            text = "";
            col = G.C.RED;
        }
        G.GAME.current_round.discards_left = G.GAME.current_round.discards_left + mod;
        discard_UI.config.object.update();
        G.HUD.recalculate();
        attention_text({ text: text + mod, scale: 0.8, hold: 0.7, cover: discard_UI.parent, cover_colour: col, align: "cm" });
        if (!silent) {
            play_sound("chips2");
        }
    };
    if (instant) {
        _mod(mod);
    }
    else {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                _mod(mod);
                return true;
            } }));
    }
}
function ease_hands_played(mod, instant): void {
    let _mod = function (mod) {
        let hand_UI = G.HUD.get_UIE_by_ID("hand_UI_count");
        mod = mod || 0;
        let text = "+";
        let col = G.C.GREEN;
        if (mod < 0) {
            text = "";
            col = G.C.RED;
        }
        G.GAME.current_round.hands_left = G.GAME.current_round.hands_left + mod;
        hand_UI.config.object.update();
        G.HUD.recalculate();
        attention_text({ text: text + mod, scale: 0.8, hold: 0.7, cover: hand_UI.parent, cover_colour: col, align: "cm" });
        play_sound("chips2");
    };
    if (instant) {
        _mod(mod);
    }
    else {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                _mod(mod);
                return true;
            } }));
    }
}
function ease_ante(mod): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            let ante_UI = G.hand_text_area.ante;
            mod = mod || 0;
            let text = "+";
            let col = G.C.IMPORTANT;
            if (mod < 0) {
                text = "-";
                col = G.C.RED;
            }
            G.GAME.round_resets.ante = G.GAME.round_resets.ante + mod;
            check_and_set_high_score("furthest_ante", G.GAME.round_resets.ante);
            ante_UI.config.object.update();
            G.HUD.recalculate();
            attention_text({ text: text + tostring(math.abs(mod)), scale: 1, hold: 0.7, cover: ante_UI.parent, cover_colour: col, align: "cm" });
            play_sound("highlight2", 0.685, 0.2);
            play_sound("generic1");
            return true;
        } }));
}
function ease_round(mod): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            let round_UI = G.hand_text_area.round;
            mod = mod || 0;
            let text = "+";
            let col = G.C.IMPORTANT;
            if (mod < 0) {
                text = "";
                col = G.C.RED;
            }
            G.GAME.round = G.GAME.round + mod;
            check_and_set_high_score("furthest_round", G.GAME.round);
            check_and_set_high_score("furthest_ante", G.GAME.round_resets.ante);
            round_UI.config.object.update();
            G.HUD.recalculate();
            attention_text({ text: text + tostring(math.abs(mod)), scale: 1, hold: 0.7, cover: round_UI.parent, cover_colour: col, align: "cm" });
            play_sound("timpani", 0.8);
            play_sound("generic1");
            return true;
        } }));
}
function ease_value(ref_table, ref_value, mod, floored, timer_type, not_blockable, delay, ease_type): void {
    mod = mod || 0;
    G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: not_blockable === false, blocking: false, ref_table: ref_table, ref_value: ref_value, ease_to: ref_table[ref_value] + mod, timer: timer_type, delay: delay || 0.3, type: ease_type || undefined, func: function (t) {
            if (floored) {
                return math.floor(t);
            }
            else {
                return t;
            }
        } }));
}
function ease_background_colour(args): void {
    for (const [k, v] of pairs(G.C.BACKGROUND)) {
        if (args.new_colour && (k === "C" || k === "L" || k === "D")) {
            if (args.special_colour && args.tertiary_colour) {
                let col_key = k === "L" && "new_colour" || k === "C" && "special_colour" || k === "D" && "tertiary_colour";
                ease_value(v, 1, args[col_key][1] - v[1], false, undefined, true, 0.6);
                ease_value(v, 2, args[col_key][2] - v[2], false, undefined, true, 0.6);
                ease_value(v, 3, args[col_key][3] - v[3], false, undefined, true, 0.6);
            }
            else {
                let brightness = k === "L" && 1.3 || k === "D" && (args.special_colour && 0.4 || 0.7) || 0.9;
                if (k === "C" && args.special_colour) {
                    ease_value(v, 1, args.special_colour[1] - v[1], false, undefined, true, 0.6);
                    ease_value(v, 2, args.special_colour[2] - v[2], false, undefined, true, 0.6);
                    ease_value(v, 3, args.special_colour[3] - v[3], false, undefined, true, 0.6);
                }
                else {
                    ease_value(v, 1, args.new_colour[1] * brightness - v[1], false, undefined, true, 0.6);
                    ease_value(v, 2, args.new_colour[2] * brightness - v[2], false, undefined, true, 0.6);
                    ease_value(v, 3, args.new_colour[3] * brightness - v[3], false, undefined, true, 0.6);
                }
            }
        }
    }
    if (args.contrast) {
        ease_value(G.C.BACKGROUND, "contrast", args.contrast - G.C.BACKGROUND.contrast, false, undefined, true, 0.6);
    }
}
function ease_colour(old_colour, new_colour, delay): void {
    ease_value(old_colour, 1, new_colour[1] - old_colour[1], false, "REAL", undefined, delay);
    ease_value(old_colour, 2, new_colour[2] - old_colour[2], false, "REAL", undefined, delay);
    ease_value(old_colour, 3, new_colour[3] - old_colour[3], false, "REAL", undefined, delay);
    ease_value(old_colour, 4, new_colour[4] - old_colour[4], false, "REAL", undefined, delay);
}
function ease_background_colour_blind(state, blind_override): void {
    let blindname = blind_override || G.GAME.blind && G.GAME.blind.name !== "" && G.GAME.blind.name || "Small Blind";
    let blindname = blindname === "" && "Small Blind" || blindname;
    if (state === G.STATES.SHOP) {
        ease_colour(G.C.DYN_UI.MAIN, mix_colours(G.C.RED, G.C.BLACK, 0.9));
    }
    else if (state === G.STATES.TAROT_PACK) {
        ease_colour(G.C.DYN_UI.MAIN, mix_colours(G.C.WHITE, G.C.BLACK, 0.9));
    }
    else if (state === G.STATES.SPECTRAL_PACK) {
        ease_colour(G.C.DYN_UI.MAIN, mix_colours(G.C.SECONDARY_SET.Spectral, G.C.BLACK, 0.9));
    }
    else if (state === G.STATES.STANDARD_PACK) {
        ease_colour(G.C.DYN_UI.MAIN, G.C.RED);
    }
    else if (state === G.STATES.BUFFOON_PACK) {
        ease_colour(G.C.DYN_UI.MAIN, G.C.FILTER);
    }
    else if (state === G.STATES.PLANET_PACK) {
        ease_colour(G.C.DYN_UI.MAIN, mix_colours(G.C.SECONDARY_SET.Planet, G.C.BLACK, 0.9));
    }
    else if (G.GAME.blind) {
        G.GAME.blind.change_colour();
    }
    if (state === G.STATES.TAROT_PACK) {
        ease_background_colour({ new_colour: G.C.PURPLE, special_colour: darken(G.C.BLACK, 0.2), contrast: 1.5 });
    }
    else if (state === G.STATES.SPECTRAL_PACK) {
        ease_background_colour({ new_colour: G.C.SECONDARY_SET.Spectral, special_colour: darken(G.C.BLACK, 0.2), contrast: 2 });
    }
    else if (state === G.STATES.STANDARD_PACK) {
        ease_background_colour({ new_colour: darken(G.C.BLACK, 0.2), special_colour: G.C.RED, contrast: 3 });
    }
    else if (state === G.STATES.BUFFOON_PACK) {
        ease_background_colour({ new_colour: G.C.FILTER, special_colour: G.C.BLACK, contrast: 2 });
    }
    else if (state === G.STATES.PLANET_PACK) {
        ease_background_colour({ new_colour: G.C.BLACK, contrast: 3 });
    }
    else if (G.GAME.won) {
        ease_background_colour({ new_colour: G.C.BLIND.won, contrast: 1 });
    }
    else if (blindname === "Small Blind" || blindname === "Big Blind" || blindname === "") {
        ease_background_colour({ new_colour: G.C.BLIND["Small"], contrast: 1 });
    }
    else {
        let boss_col = G.C.BLACK;
        for (const [k, v] of pairs(G.P_BLINDS)) {
            if (v.name === blindname) {
                if (v.boss.showdown) {
                    ease_background_colour({ new_colour: G.C.BLUE, special_colour: G.C.RED, tertiary_colour: darken(G.C.BLACK, 0.4), contrast: 3 });
                    return;
                }
                boss_col = v.boss_colour || G.C.BLACK;
            }
        }
        ease_background_colour({ new_colour: lighten(mix_colours(boss_col, G.C.BLACK, 0.3), 0.1), special_colour: boss_col, contrast: 2 });
    }
}
function delay(time, queue): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: time || 1, func: function () {
            return true;
        } }), queue);
}
function add_joker(joker, edition, silent, eternal): void {
    let _area = G.P_CENTERS[joker].consumeable && G.consumeables || G.jokers;
    let _T = _area && _area.T || { x: G.ROOM.T.w / 2 - G.CARD_W / 2, y: G.ROOM.T.h / 2 - G.CARD_H / 2 };
    let card = Card(_T.x, _T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, G.P_CENTERS[joker], { discover: true, bypass_discovery_center: true, bypass_discovery_ui: true, bypass_back: G.GAME.selected_back.pos });
    card.start_materialize(undefined, silent);
    if (_area) {
        card.add_to_deck();
    }
    if (edition) {
        card.set_edition({ [edition]: true });
    }
    if (eternal) {
        card.set_eternal(true);
    }
    if (_area && card.ability.set === "Joker") {
        _area.emplace(card);
    }
    else if (G.consumeables) {
        G.consumeables.emplace(card);
    }
    card.created_on_pause = undefined;
    return card;
}
function draw_card(from, to, percent, dir, sort, card, delay, mute, stay_flipped, vol, discarded_only): void {
    percent = percent || 50;
    delay = delay || 0.1;
    if (dir === "down") {
        percent = 1 - percent;
    }
    sort = sort || false;
    let drawn = undefined;
    G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: delay, func: function () {
            if (card) {
                if (from) {
                    card = from.remove_card(card);
                }
                if (card) {
                    drawn = true;
                }
                let stay_flipped = G.GAME && G.GAME.blind && G.GAME.blind.stay_flipped(to, card);
                if (G.GAME.modifiers.flipped_cards && to === G.hand) {
                    if (pseudorandom(pseudoseed("flipped_card")) < 1 / G.GAME.modifiers.flipped_cards) {
                        stay_flipped = true;
                    }
                }
                to.emplace(card, undefined, stay_flipped);
            }
            else {
                if (to.draw_card_from(from, stay_flipped, discarded_only)) {
                    drawn = true;
                }
            }
            if (!mute && drawn) {
                if (from === G.deck || from === G.hand || from === G.play || from === G.jokers || from === G.consumeables || from === G.discard) {
                    G.VIBRATION = G.VIBRATION + 0.6;
                }
                play_sound("card1", 0.85 + percent * 0.2 / 100, 0.6 * (vol || 1));
            }
            if (sort) {
                to.sort();
            }
            return true;
        } }));
}
function highlight_card(card, percent, dir): void {
    percent = percent || 0.5;
    let highlight = true;
    if (dir === "down") {
        percent = 1 - percent;
        highlight = false;
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.1, func: function () {
            card.highlight(highlight);
            play_sound("cardSlide1", 0.85 + percent * 0.2);
            return true;
        } }));
}
function play_area_status_text(text, silent, delay): void {
    let delay = delay || 0.6;
    G.E_MANAGER.add_event(new GameEvent({ trigger: delay === 0 && "immediate" || "before", delay: delay, func: function () {
            attention_text({ scale: 0.9, text: text, hold: 0.9, align: "tm", major: G.play, offset: { x: 0, y: -1 } });
            if (!silent) {
                G.ROOM.jiggle = G.ROOM.jiggle + 2;
                play_sound("cardFan2");
            }
            return true;
        } }));
}
function level_up_hand(card, hand, instant, amount): void {
    amount = amount || 1;
    G.GAME.hands[hand].level = math.max(0, G.GAME.hands[hand].level + amount);
    G.GAME.hands[hand].mult = math.max(G.GAME.hands[hand].s_mult + G.GAME.hands[hand].l_mult * (G.GAME.hands[hand].level - 1), 1);
    G.GAME.hands[hand].chips = math.max(G.GAME.hands[hand].s_chips + G.GAME.hands[hand].l_chips * (G.GAME.hands[hand].level - 1), 0);
    if (!instant) {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                play_sound("tarot1");
                if (card) {
                    card.juice_up(0.8, 0.5);
                }
                G.TAROT_INTERRUPT_PULSE = true;
                return true;
            } }));
        update_hand_text({ delay: 0 }, { mult: G.GAME.hands[hand].mult, StatusText: true });
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.9, func: function () {
                play_sound("tarot1");
                if (card) {
                    card.juice_up(0.8, 0.5);
                }
                return true;
            } }));
        update_hand_text({ delay: 0 }, { chips: G.GAME.hands[hand].chips, StatusText: true });
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.9, func: function () {
                play_sound("tarot1");
                if (card) {
                    card.juice_up(0.8, 0.5);
                }
                G.TAROT_INTERRUPT_PULSE = undefined;
                return true;
            } }));
        update_hand_text({ sound: "button", volume: 0.7, pitch: 0.9, delay: 0 }, { level: G.GAME.hands[hand].level });
        delay(1.3);
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            check_for_unlock({ type: "upgrade_hand", hand: hand, level: G.GAME.hands[hand].level });
            return true;
        } }));
}
function update_hand_text(config, vals): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "before", blockable: !config.immediate, delay: config.delay || 0.8, func: function () {
            let col = G.C.GREEN;
            if (vals.chips && G.GAME.current_round.current_hand.chips !== vals.chips) {
                let delta = type(vals.chips) === "number" && type(G.GAME.current_round.current_hand.chips) === "number" && vals.chips - G.GAME.current_round.current_hand.chips || 0;
                if (delta < 0) {
                    delta = "" + delta;
                    col = G.C.RED;
                }
                else if (delta > 0) {
                    delta = "+" + delta;
                }
                else {
                    delta = "" + delta;
                }
                if (type(vals.chips) === "string") {
                    delta = vals.chips;
                }
                G.GAME.current_round.current_hand.chips = vals.chips;
                G.hand_text_area.chips.update(0);
                if (vals.StatusText) {
                    attention_text({ text: delta, scale: 0.8, hold: 1, cover: G.hand_text_area.chips.parent, cover_colour: mix_colours(G.C.CHIPS, col, 0.1), emboss: 0.05, align: "cm", cover_align: "cr" });
                }
            }
            if (vals.mult && G.GAME.current_round.current_hand.mult !== vals.mult) {
                let delta = type(vals.mult) === "number" && type(G.GAME.current_round.current_hand.mult) === "number" && vals.mult - G.GAME.current_round.current_hand.mult || 0;
                if (delta < 0) {
                    delta = "" + delta;
                    col = G.C.RED;
                }
                else if (delta > 0) {
                    delta = "+" + delta;
                }
                else {
                    delta = "" + delta;
                }
                if (type(vals.mult) === "string") {
                    delta = vals.mult;
                }
                G.GAME.current_round.current_hand.mult = vals.mult;
                G.hand_text_area.mult.update(0);
                if (vals.StatusText) {
                    attention_text({ text: delta, scale: 0.8, hold: 1, cover: G.hand_text_area.mult.parent, cover_colour: mix_colours(G.C.MULT, col, 0.1), emboss: 0.05, align: "cm", cover_align: "cl" });
                }
                if (!G.TAROT_INTERRUPT) {
                    G.hand_text_area.mult.juice_up();
                }
            }
            if (vals.handname && G.GAME.current_round.current_hand.handname !== vals.handname) {
                G.GAME.current_round.current_hand.handname = vals.handname;
                if (!config.nopulse) {
                    G.hand_text_area.handname.config.object.pulse(0.2);
                }
            }
            if (vals.chip_total) {
                G.GAME.current_round.current_hand.chip_total = vals.chip_total;
                G.hand_text_area.chip_total.config.object.pulse(0.5);
            }
            if (vals.level && G.GAME.current_round.current_hand.hand_level !== " " + (localize("k_lvl") + tostring(vals.level))) {
                if (vals.level === "") {
                    G.GAME.current_round.current_hand.hand_level = vals.level;
                }
                else {
                    G.GAME.current_round.current_hand.hand_level = " " + (localize("k_lvl") + tostring(vals.level));
                    if (type(vals.level) === "number") {
                        G.hand_text_area.hand_level.config.colour = G.C.HAND_LEVELS[math.min(vals.level, 7)];
                    }
                    else {
                        G.hand_text_area.hand_level.config.colour = G.C.HAND_LEVELS[1];
                    }
                    G.hand_text_area.hand_level.juice_up();
                }
            }
            if (config.sound && !config.modded) {
                play_sound(config.sound, config.pitch || 1, config.volume || 1);
            }
            if (config.modded) {
                SMODS.juice_up_blind();
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06 * G.SETTINGS.GAMESPEED, blockable: false, blocking: false, func: function () {
                        play_sound("tarot2", 0.76, 0.4);
                        return true;
                    } }));
                play_sound("tarot2", 1, 0.4);
            }
            return true;
        } }));
}
function eval_card(card, context): void {
    if (card.ability.set !== "Joker" && card.debuff) {
        return [{}, {}];
    }
    context = context || {};
    let ret = {};
    if (context.repetition_only) {
        if (card.ability.set === "Enhanced") {
            let enhancement = card.calculate_enhancement(context);
            if (enhancement) {
                ret.enhancement = enhancement;
            }
        }
        if (card.edition) {
            let edition = card.calculate_edition(context);
            if (edition) {
                ret.edition = edition;
            }
        }
        if (card.seal) {
            let seals = card.calculate_seal(context);
            if (seals) {
                ret.seals = seals;
            }
        }
        for (const [k, v] of pairs(SMODS.Stickers)) {
            let sticker = card.calculate_sticker(context, k);
            if (sticker) {
                ret[v] = sticker;
            }
        }
        return ret;
    }
    if (context.cardarea === G.play && context.main_scoring) {
        ret.playing_card = {};
        let chips = card.get_chip_bonus();
        if (chips !== 0) {
            ret.playing_card.chips = chips;
        }
        let mult = card.get_chip_mult();
        if (mult !== 0) {
            ret.playing_card.mult = mult;
        }
        let x_mult = card.get_chip_x_mult(context);
        if (x_mult > 0) {
            ret.playing_card.x_mult = x_mult;
        }
        let p_dollars = card.get_p_dollars();
        if (p_dollars > 0) {
            ret.playing_card.p_dollars = p_dollars;
        }
        let jokers = card.calculate_joker(context);
        if (jokers) {
            ret.jokers = jokers;
        }
        let edition = card.calculate_edition(context);
        if (edition) {
            ret.edition = edition;
        }
    }
    if (context.end_of_round && context.cardarea === G.hand && context.playing_card_end_of_round) {
        let end_of_round = card.get_end_of_round_effect(context);
        if (end_of_round) {
            ret.end_of_round = end_of_round;
        }
    }
    if (context.cardarea === G.hand && context.main_scoring) {
        ret.playing_card = {};
        let h_mult = card.get_chip_h_mult();
        if (h_mult !== 0) {
            ret.playing_card.h_mult = h_mult;
        }
        let h_x_mult = card.get_chip_h_x_mult();
        if (h_x_mult > 0) {
            ret.playing_card.x_mult = h_x_mult;
        }
        let jokers = card.calculate_joker(context);
        if (jokers) {
            ret.jokers = jokers;
        }
    }
    if (card.ability.set === "Enhanced") {
        let enhancement = card.calculate_enhancement(context);
        if (enhancement) {
            ret.enhancement = enhancement;
        }
    }
    if (card.edition) {
        let edition = card.calculate_edition(context);
        if (edition) {
            ret.edition = edition;
        }
    }
    if (card.seal && !card.ability.extra_enhancement) {
        let seals = card.calculate_seal(context);
        if (seals) {
            ret.seals = seals;
        }
    }
    for (const [k, v] of pairs(SMODS.Stickers)) {
        let sticker = card.calculate_sticker(context, k);
        if (sticker) {
            ret[v] = sticker;
        }
    }
    let post_trig = {};
    let areas = SMODS.get_card_areas("jokers");
    let area_set = {};
    for (const [_, v] of ipairs(areas)) {
        area_set[v] = true;
    }
    if (card.area && area_set[card.area]) {
        let [jokers, triggered] = card.calculate_joker(context);
        if (jokers || triggered) {
            ret.jokers = jokers;
            if (!(context.retrigger_joker_check || context.retrigger_joker)) {
                let retriggers = SMODS.calculate_retriggers(card, context, ret);
                if (next(retriggers)) {
                    ret.retriggers = retriggers;
                }
            }
            if (!context.post_trigger && !context.retrigger_joker_check && SMODS.optional_features.post_trigger) {
                SMODS.calculate_context({ blueprint_card: context.blueprint_card, post_trigger: true, other_card: card, other_context: context, other_ret: ret }, post_trig);
            }
        }
    }
    return [ret, post_trig];
}
function set_alerts(): void {
    if (G.REFRESH_ALERTS) {
        G.REFRESH_ALERTS = undefined;
        let [alert_joker, alert_voucher, alert_tarot, alert_planet, alert_spectral, alert_blind, alert_edition, alert_tag, alert_seal, alert_booster] = [false, false, false, false, false, false, false, false, false, false];
        for (const [k, v] of pairs(G.P_CENTERS)) {
            if (v.discovered && !v.alerted && !v.no_collection) {
                if (v.set === "Voucher") {
                    alert_voucher = true;
                }
                if (v.set === "Tarot") {
                    alert_tarot = true;
                }
                if (v.set === "Planet") {
                    alert_planet = true;
                }
                if (v.set === "Spectral") {
                    alert_spectral = true;
                }
                if (v.set === "Joker") {
                    alert_joker = true;
                }
                if (v.set === "Edition") {
                    alert_edition = true;
                }
                if (v.set === "Booster") {
                    alert_booster = true;
                }
            }
        }
        for (const [k, v] of pairs(G.P_BLINDS)) {
            if (v.discovered && !v.alerted && !v.no_collection) {
                alert_blind = true;
            }
        }
        for (const [k, v] of pairs(G.P_TAGS)) {
            if (v.discovered && !v.alerted && !v.no_collection) {
                alert_tag = true;
            }
        }
        for (const [k, v] of pairs(G.P_SEALS)) {
            if (v.discovered && !v.alerted && !v.no_collection) {
                alert_seal = true;
            }
        }
        let alert_any = alert_voucher || alert_joker || alert_tarot || alert_planet || alert_spectral || alert_blind || alert_edition || alert_seal || alert_tag;
        G.ARGS.set_alerts_alertables = G.ARGS.set_alerts_alertables || [{ id: "your_collection", alert_uibox_name: "your_collection_alert" }, { id: "your_collection_jokers", alert_uibox_name: "your_collection_jokers_alert" }, { id: "your_collection_tarots", alert_uibox_name: "your_collection_tarots_alert" }, { id: "your_collection_planets", alert_uibox_name: "your_collection_planets_alert" }, { id: "your_collection_spectrals", alert_uibox_name: "your_collection_spectrals_alert" }, { id: "your_collection_vouchers", alert_uibox_name: "your_collection_vouchers_alert" }, { id: "your_collection_editions", alert_uibox_name: "your_collection_editions_alert" }, { id: "your_collection_blinds", alert_uibox_name: "your_collection_blinds_alert" }, { id: "your_collection_tags", alert_uibox_name: "your_collection_tags_alert" }, { id: "your_collection_seals", alert_uibox_name: "your_collection_seals_alert" }, { id: "your_collection_boosters", alert_uibox_name: "your_collection_boosters_alert" }];
        G.ARGS.set_alerts_alertables[1].should_alert = alert_any;
        G.ARGS.set_alerts_alertables[2].should_alert = alert_joker;
        G.ARGS.set_alerts_alertables[3].should_alert = alert_tarot;
        G.ARGS.set_alerts_alertables[4].should_alert = alert_planet;
        G.ARGS.set_alerts_alertables[5].should_alert = alert_spectral;
        G.ARGS.set_alerts_alertables[6].should_alert = alert_voucher;
        G.ARGS.set_alerts_alertables[7].should_alert = alert_edition;
        G.ARGS.set_alerts_alertables[8].should_alert = alert_blind;
        G.ARGS.set_alerts_alertables[9].should_alert = alert_tag;
        G.ARGS.set_alerts_alertables[10].should_alert = alert_seal;
        G.ARGS.set_alerts_alertables[11].should_alert = alert_booster;
        table.insert(G.ARGS.set_alerts_alertables, { id: "mods_button", alert_uibox_name: "mods_button_alert", should_alert: SMODS.mod_button_alert });
        for (const [k, v] of ipairs(G.ARGS.set_alerts_alertables)) {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.get_UIE_by_ID(v.id)) {
                if (v.should_alert) {
                    if (!G[v.alert_uibox_name]) {
                        G[v.alert_uibox_name] = UIBox({ definition: create_UIBox_card_alert({ red_bad: true }), config: { align: "tri", offset: { x: 0.05, y: -0.05 }, major: G.OVERLAY_MENU.get_UIE_by_ID(v.id), instance_type: "ALERT" } });
                        G[v.alert_uibox_name].states.collide.can = false;
                    }
                }
                else if (G[v.alert_uibox_name]) {
                    G[v.alert_uibox_name].remove();
                    G[v.alert_uibox_name] = undefined;
                }
            }
            else if (G[v.alert_uibox_name]) {
                G[v.alert_uibox_name].remove();
                G[v.alert_uibox_name] = undefined;
            }
        }
        if (G.MAIN_MENU_UI) {
            if (alert_any) {
                if (!G.collection_alert) {
                    G.collection_alert = UIBox({ definition: create_UIBox_card_alert(), config: { align: "tri", offset: { x: 0.05, y: -0.05 }, major: G.MAIN_MENU_UI.get_UIE_by_ID("collection_button") } });
                    G.collection_alert.states.collide.can = false;
                }
            }
            else if (G.collection_alert) {
                G.collection_alert.remove();
                G.collection_alert = undefined;
            }
        }
        else if (G.collection_alert) {
            G.collection_alert.remove();
            G.collection_alert = undefined;
        }
    }
}
function set_main_menu_UI(): void {
    G.MAIN_MENU_UI = UIBox({ definition: create_UIBox_main_menu_buttons(), config: { align: "bmi", offset: { x: 0, y: 10 }, major: G.ROOM_ATTACH, bond: "Weak" } });
    G.MAIN_MENU_UI.alignment.offset.y = 0;
    G.MAIN_MENU_UI.align_to_major();
    G.E_MANAGER.add_event(new GameEvent({ blockable: false, blocking: false, func: function () {
            if (!G.F_DISP_USERNAME || type(G.F_DISP_USERNAME) === "string") {
                G.PROFILE_BUTTON = UIBox({ definition: create_UIBox_profile_button(), config: { align: "bli", offset: { x: -10, y: 0 }, major: G.ROOM_ATTACH, bond: "Weak" } });
                G.PROFILE_BUTTON.alignment.offset.x = 0;
                G.PROFILE_BUTTON.align_to_major();
                return true;
            }
        } }));
    G.CONTROLLER.snap_to({ node: G.MAIN_MENU_UI.get_UIE_by_ID("main_menu_play") });
}
function card_eval_status_text(card, eval_type, amt, percent, dir, extra): void {
    percent = percent || 0.9 + 0.2 * math.random();
    if (dir === "down") {
        percent = 1 - percent;
    }
    if (extra && extra.focus) {
        card = extra.focus;
    }
    let text = "";
    let sound = undefined;
    let volume = 1;
    let card_aligned = "bm";
    let y_off = 0.15 * G.CARD_H;
    if (card.area === G.jokers || card.area === G.consumeables) {
        y_off = 0.05 * card.T.h;
    }
    else if (card === G.deck) {
        y_off = -0.05 * G.CARD_H;
        card_aligned = "tm";
    }
    else if (card.area === G.discard || card.area === G.vouchers) {
        y_off = card.area === G.discard && -0.35 * G.CARD_H || -0.65 * G.CARD_H;
        card = G.deck.cards[1] || G.deck;
        card_aligned = "tm";
    }
    else if (card.area === G.hand || card.area === G.deck) {
        y_off = -0.05 * G.CARD_H;
        card_aligned = "tm";
    }
    else if (card.area === G.play) {
        y_off = -0.05 * G.CARD_H;
        card_aligned = "tm";
    }
    else if (card.jimbo) {
        y_off = -0.05 * G.CARD_H;
        card_aligned = "tm";
    }
    let config = {};
    let delay = 0.65;
    let colour = config.colour || extra && extra.colour || G.C.FILTER;
    let extrafunc = undefined;
    if (eval_type === "debuff") {
        sound = "cancel";
        amt = 1;
        colour = G.C.RED;
        config.scale = 0.6;
        text = localize("k_debuffed");
    }
    else if (eval_type === "chips") {
        sound = "chips1";
        amt = amt;
        colour = G.C.CHIPS;
        text = localize({ type: "variable", key: "a_chips" + (amt < 0 && "_minus" || ""), vars: [math.abs(amt)] });
        delay = 0.6;
    }
    else if (eval_type === "mult") {
        sound = "multhit1";
        amt = amt;
        text = localize({ type: "variable", key: "a_mult" + (amt < 0 && "_minus" || ""), vars: [math.abs(amt)] });
        colour = G.C.MULT;
        config.type = "fade";
        config.scale = 0.7;
    }
    else if (eval_type === "x_chips") {
        sound = "xchips";
        volume = 0.7;
        amt = amt;
        text = localize({ type: "variable", key: "a_xchips" + (amt < 0 && "_minus" || ""), vars: [math.abs(amt)] });
        colour = G.C.BLUE;
        config.type = "fade";
        config.scale = 0.7;
    }
    else if (eval_type === "x_mult" || eval_type === "h_x_mult") {
        sound = "multhit2";
        volume = 0.7;
        amt = amt;
        text = localize({ type: "variable", key: "a_xmult" + (amt < 0 && "_minus" || ""), vars: [math.abs(amt)] });
        colour = G.C.XMULT;
        config.type = "fade";
        config.scale = 0.7;
    }
    else if (eval_type === "h_mult") {
        sound = "multhit1";
        amt = amt;
        text = localize({ type: "variable", key: "a_mult" + (amt < 0 && "_minus" || ""), vars: [math.abs(amt)] });
        colour = G.C.MULT;
        config.type = "fade";
        config.scale = 0.7;
    }
    else if (eval_type === "dollars") {
        sound = "coin3";
        amt = amt;
        text = (amt < -0.01 && "-" || "") + (localize("$") + tostring(math.abs(amt)));
        colour = amt < -0.01 && G.C.RED || G.C.MONEY;
    }
    else if (eval_type === "swap") {
        sound = "generic1";
        amt = amt;
        text = localize("k_swapped_ex");
        colour = G.C.PURPLE;
    }
    else if (eval_type === "extra" || eval_type === "jokers") {
        sound = extra.edition && "foil2" || extra.mult_mod && "multhit1" || extra.Xmult_mod && "multhit2" || "generic1";
        if (extra.edition) {
            colour = G.C.DARK_EDITION;
        }
        volume = extra.edition && 0.3 || sound === "multhit2" && 0.7 || 1;
        sound = extra.sound || sound;
        percent = extra.pitch || percent;
        volume = extra.volume || volume;
        delay = extra.delay || 0.75;
        amt = 1;
        text = extra.message || text;
        if (!extra.edition && (extra.mult_mod || extra.Xmult_mod)) {
            colour = G.C.MULT;
        }
        if (extra.chip_mod || extra.Xchip_mod) {
            config.type = "fall";
            colour = G.C.CHIPS;
            config.scale = 0.7;
        }
        else if (extra.swap) {
            config.type = "fall";
            colour = G.C.PURPLE;
            config.scale = 0.7;
        }
        else {
            config.type = "fall";
            config.scale = 0.7;
        }
    }
    delay = delay * 1.25;
    if (amt > 0 || amt < 0) {
        if (extra && extra.instant) {
            if (extrafunc) {
                extrafunc();
            }
            attention_text({ text: text, scale: config.scale || 1, hold: delay - 0.2, backdrop_colour: colour, align: card_aligned, major: card, offset: { x: 0, y: y_off } });
            play_sound(sound, 0.8 + percent * 0.2, volume);
            if (!extra || !extra.no_juice) {
                card.juice_up(0.6, 0.1);
                G.ROOM.jiggle = G.ROOM.jiggle + 0.7;
            }
        }
        else {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: delay, func: function () {
                    if (extrafunc) {
                        extrafunc();
                    }
                    attention_text({ text: text, scale: config.scale || 1, hold: delay - 0.2, backdrop_colour: colour, align: card_aligned, major: card, offset: { x: 0, y: y_off } });
                    play_sound(sound, 0.8 + percent * 0.2, volume);
                    if (!extra || !extra.no_juice) {
                        card.juice_up(0.6, 0.1);
                        G.ROOM.jiggle = G.ROOM.jiggle + 0.7;
                    }
                    return true;
                } }));
        }
    }
    if (extra && extra.playing_cards_created) {
        playing_card_joker_effects(extra.playing_cards_created);
    }
}
function add_round_eval_row(config): void {
    let config = config || {};
    let width = G.round_eval.T.w - 0.51;
    let num_dollars = config.dollars || 1;
    let scale = 0.9;
    if (config.name !== "bottom") {
        total_cashout_rows = (total_cashout_rows || 0) + 1;
        if (total_cashout_rows > 7) {
            return;
        }
        if (config.name !== "blind1") {
            if (!G.round_eval.divider_added) {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.25, func: function () {
                        let spacer = { n: G.UIT.R, config: { align: "cm", minw: width }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: ["......................................"], colours: [G.C.WHITE], shadow: true, float: true, y_offset: -30, scale: 0.45, spacing: 13.5, font: G.LANGUAGES["en-us"].font, pop_in: 0 }) } }] };
                        G.round_eval.add_child(spacer, G.round_eval.get_UIE_by_ID(config.bonus && "bonus_round_eval" || "base_round_eval"));
                        return true;
                    } }));
                delay(0.6);
                G.round_eval.divider_added = true;
            }
        }
        else {
            delay(0.2);
        }
        delay(0.2);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.5, func: function () {
                let left_text = {};
                if (config.name === "blind1") {
                    let stake_sprite = get_stake_sprite(G.GAME.stake || 1, 0.5);
                    let obj = G.GAME.blind.config.blind;
                    let blind_sprite = AnimatedSprite(0, 0, 1.2, 1.2, G.ANIMATION_ATLAS[obj.atlas] || G.ANIMATION_ATLAS["blind_chips"], copy_table(G.GAME.blind.pos));
                    blind_sprite.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
                    table.insert(left_text, { n: G.UIT.O, config: { w: 1.2, h: 1.2, object: blind_sprite, hover: true, can_collide: false } });
                    table.insert(left_text, config.saved && { n: G.UIT.C, config: { padding: 0.05, align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [" " + (localize("ph_mr_bones") + " ")], colours: [G.C.FILTER], shadow: true, pop_in: 0, scale: 0.5 * scale, silent: true }) } }] }] } || { n: G.UIT.C, config: { padding: 0.05, align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [" " + (localize("ph_score_at_least") + " ")], colours: [G.C.UI.TEXT_LIGHT], shadow: true, pop_in: 0, scale: 0.4 * scale, silent: true }) } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.8 }, nodes: [{ n: G.UIT.O, config: { w: 0.5, h: 0.5, object: stake_sprite, hover: true, can_collide: false } }, { n: G.UIT.T, config: { text: G.GAME.blind.chip_text, scale: scale_number(G.GAME.blind.chips, scale, 100000), colour: G.C.RED, shadow: true } }] }] });
                }
                else if (string.find(config.name, "tag")) {
                    let blind_sprite = Sprite(0, 0, 0.7, 0.7, G.ASSET_ATLAS["tags"], copy_table(config.pos));
                    blind_sprite.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
                    blind_sprite.juice_up();
                    table.insert(left_text, { n: G.UIT.O, config: { w: 0.7, h: 0.7, object: blind_sprite, hover: true, can_collide: false } });
                    table.insert(left_text, { n: G.UIT.O, config: { object: DynaText({ string: [config.condition], colours: [G.C.UI.TEXT_LIGHT], shadow: true, pop_in: 0, scale: 0.4 * scale, silent: true }) } });
                }
                else if (config.name === "hands") {
                    table.insert(left_text, { n: G.UIT.T, config: { text: config.disp || config.dollars, scale: 0.8 * scale, colour: G.C.BLUE, shadow: true, juice: true } });
                    table.insert(left_text, { n: G.UIT.O, config: { object: DynaText({ string: [" " + localize({ type: "variable", key: "remaining_hand_money", vars: [G.GAME.modifiers.money_per_hand || 1] })], colours: [G.C.UI.TEXT_LIGHT], shadow: true, pop_in: 0, scale: 0.4 * scale, silent: true }) } });
                }
                else if (config.name === "discards") {
                    table.insert(left_text, { n: G.UIT.T, config: { text: config.disp || config.dollars, scale: 0.8 * scale, colour: G.C.RED, shadow: true, juice: true } });
                    table.insert(left_text, { n: G.UIT.O, config: { object: DynaText({ string: [" " + localize({ type: "variable", key: "remaining_discard_money", vars: [G.GAME.modifiers.money_per_discard || 0] })], colours: [G.C.UI.TEXT_LIGHT], shadow: true, pop_in: 0, scale: 0.4 * scale, silent: true }) } });
                }
                else if (string.find(config.name, "joker")) {
                    table.insert(left_text, { n: G.UIT.O, config: { object: DynaText({ string: localize({ type: "name_text", set: config.card.config.center.set, key: config.card.config.center.key }), colours: [G.C.FILTER], shadow: true, pop_in: 0, scale: 0.6 * scale, silent: true }) } });
                }
                else if (config.name === "interest") {
                    table.insert(left_text, { n: G.UIT.T, config: { text: num_dollars, scale: 0.8 * scale, colour: G.C.MONEY, shadow: true, juice: true } });
                    table.insert(left_text, { n: G.UIT.O, config: { object: DynaText({ string: [" " + localize({ type: "variable", key: "interest", vars: [G.GAME.interest_amount, 5, G.GAME.interest_amount * G.GAME.interest_cap / 5] })], colours: [G.C.UI.TEXT_LIGHT], shadow: true, pop_in: 0, scale: 0.4 * scale, silent: true }) } });
                }
                let full_row = { n: G.UIT.R, config: { align: "cm", minw: 5 }, nodes: [{ n: G.UIT.C, config: { padding: 0.05, minw: width * 0.55, minh: 0.61, align: "cl" }, nodes: left_text }, { n: G.UIT.C, config: { padding: 0.05, minw: width * 0.45, align: "cr" }, nodes: [{ n: G.UIT.C, config: { align: "cm", id: "dollar_" + config.name }, nodes: {} }] }] };
                if (config.name === "blind1") {
                    G.GAME.blind.juice_up();
                }
                G.round_eval.add_child(full_row, G.round_eval.get_UIE_by_ID(config.bonus && "bonus_round_eval" || "base_round_eval"));
                play_sound("cancel", config.pitch || 1);
                play_sound("highlight1", 1.5 * config.pitch || 1, 0.2);
                if (config.card) {
                    config.card.juice_up(0.7, 0.46);
                }
                return true;
            } }));
        let dollar_row = 0;
        if (num_dollars > 60 || num_dollars < -60) {
            if (num_dollars < 0) {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.38, func: function () {
                        G.round_eval.add_child({ n: G.UIT.R, config: { align: "cm", id: "dollar_row_" + (dollar_row + 1 + ("_" + config.name)) }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: ["-" + (localize("$") + format_ui_value(-num_dollars))], colours: [G.C.MONEY], shadow: true, pop_in: 0, scale: 0.65, float: true }) } }] }, G.round_eval.get_UIE_by_ID("dollar_" + config.name));
                        play_sound("coin3", 0.9 + 0.2 * math.random(), 0.7);
                        play_sound("coin6", 1.3, 0.8);
                        return true;
                    } }));
            }
            else {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.38, func: function () {
                        G.round_eval.add_child({ n: G.UIT.R, config: { align: "cm", id: "dollar_row_" + (dollar_row + 1 + ("_" + config.name)) }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("$") + format_ui_value(num_dollars)], colours: [G.C.MONEY], shadow: true, pop_in: 0, scale: 0.65, float: true }) } }] }, G.round_eval.get_UIE_by_ID("dollar_" + config.name));
                        play_sound("coin3", 0.9 + 0.2 * math.random(), 0.7);
                        play_sound("coin6", 1.3, 0.8);
                        return true;
                    } }));
            }
        }
        else {
            let dollars_to_loop;
            if (num_dollars < 0) {
                dollars_to_loop = num_dollars * -1 + 1;
            }
            else {
                dollars_to_loop = num_dollars;
            }
            for (let i = 1; i <= dollars_to_loop; i++) {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.18 - (num_dollars > 20 && 0.13 || num_dollars > 9 && 0.1 || 0), func: function () {
                        if (i % 30 === 1) {
                            G.round_eval.add_child({ n: G.UIT.R, config: { align: "cm", id: "dollar_row_" + (dollar_row + 1 + ("_" + config.name)) }, nodes: {} }, G.round_eval.get_UIE_by_ID("dollar_" + config.name));
                            dollar_row = dollar_row + 1;
                        }
                        let r;
                        if (i === 1 && num_dollars < 0) {
                            r = { n: G.UIT.T, config: { text: "-", colour: G.C.RED, scale: num_dollars < -20 && 0.28 || num_dollars < -9 && 0.43 || 0.58, shadow: true, hover: true, can_collide: false, juice: true } };
                            play_sound("coin3", 0.9 + 0.2 * math.random(), 0.7 - (num_dollars < -20 && 0.2 || 0));
                        }
                        else {
                            if (num_dollars < 0) {
                                r = { n: G.UIT.T, config: { text: localize("$"), colour: G.C.RED, scale: num_dollars > 20 && 0.28 || num_dollars > 9 && 0.43 || 0.58, shadow: true, hover: true, can_collide: false, juice: true } };
                            }
                            else {
                                r = { n: G.UIT.T, config: { text: localize("$"), colour: G.C.MONEY, scale: num_dollars > 20 && 0.28 || num_dollars > 9 && 0.43 || 0.58, shadow: true, hover: true, can_collide: false, juice: true } };
                            }
                        }
                        play_sound("coin3", 0.9 + 0.2 * math.random(), 0.7 - (num_dollars > 20 && 0.2 || 0));
                        if (config.name === "blind1") {
                            G.GAME.current_round.dollars_to_be_earned = G.GAME.current_round.dollars_to_be_earned.sub(2);
                        }
                        G.round_eval.add_child(r, G.round_eval.get_UIE_by_ID("dollar_row_" + (dollar_row + ("_" + config.name))));
                        G.VIBRATION = G.VIBRATION + 0.4;
                        return true;
                    } }));
            }
        }
    }
    else {
        delay(0.4);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.5, func: function () {
                UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { id: "cash_out_button", align: "cm", padding: 0.1, minw: 7, r: 0.15, colour: G.C.ORANGE, shadow: true, hover: true, one_press: true, button: "cash_out", focus_args: { snap_to: true } }, nodes: [{ n: G.UIT.T, config: { text: localize("b_cash_out") + ": ", scale: 1, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: localize("$") + format_ui_value(config.dollars), scale: 1.2 * scale, colour: G.C.WHITE, shadow: true, juice: true } }] }] }, config: { align: "tmi", offset: { x: 0, y: 0.4 }, major: G.round_eval } });
                G.GAME.current_round.dollars = config.dollars;
                play_sound("coin6", config.pitch || 1);
                G.VIBRATION = G.VIBRATION + 1;
                return true;
            } }));
    }
}
function change_shop_size(mod): void {
    if (!G.GAME.shop) {
        return;
    }
    G.GAME.shop.joker_max = G.GAME.shop.joker_max + mod;
    if (G.shop_jokers && G.shop_jokers.cards) {
        if (mod < 0) {
            for (let i = G.shop_jokers.cards.length; i <= G.GAME.shop.joker_max + 1; i += -1) {
                if (G.shop_jokers.cards[i]) {
                    G.shop_jokers.cards[i].remove();
                }
            }
        }
        G.shop_jokers.config.card_limit = G.GAME.shop.joker_max;
        G.shop_jokers.T.w = G.GAME.shop.joker_max * 1.01 * G.CARD_W;
        G.shop.recalculate();
        if (mod > 0) {
            for (let i = 1; i <= G.GAME.shop.joker_max - G.shop_jokers.cards.length; i++) {
                G.shop_jokers.emplace(create_card_for_shop(G.shop_jokers));
            }
        }
    }
}
function juice_card(card): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            card.juice_up(0.7);
            return true;
        } }));
}
function update_canvas_juice(dt): void {
    G.JIGGLE_VIBRATION = G.ROOM.jiggle || 0;
    if (!G.SETTINGS.screenshake || type(G.SETTINGS.screenshake) !== "number") {
        G.SETTINGS.screenshake = G.SETTINGS.reduced_motion && 0 || 50;
    }
    let shake_amt = (G.SETTINGS.reduced_motion && 0 || 1) * math.max(0, G.SETTINGS.screenshake - 30) / 100;
    G.ARGS.eased_cursor_pos = G.ARGS.eased_cursor_pos || { x: G.CURSOR.T.x, y: G.CURSOR.T.y, sx: G.CONTROLLER.cursor_position.x, sy: G.CONTROLLER.cursor_position.y };
    G.ARGS.eased_cursor_pos.x = G.ARGS.eased_cursor_pos.x * (1 - 3 * dt) + 3 * dt * (shake_amt * G.CURSOR.T.x + (1 - shake_amt) * G.ROOM.T.w / 2);
    G.ARGS.eased_cursor_pos.y = G.ARGS.eased_cursor_pos.y * (1 - 3 * dt) + 3 * dt * (shake_amt * G.CURSOR.T.y + (1 - shake_amt) * G.ROOM.T.h / 2);
    G.ARGS.eased_cursor_pos.sx = G.ARGS.eased_cursor_pos.sx * (1 - 3 * dt) + 3 * dt * (shake_amt * G.CONTROLLER.cursor_position.x + (1 - shake_amt) * G.WINDOWTRANS.real_window_w / 2);
    G.ARGS.eased_cursor_pos.sy = G.ARGS.eased_cursor_pos.sy * (1 - 3 * dt) + 3 * dt * (shake_amt * G.CONTROLLER.cursor_position.y + (1 - shake_amt) * G.WINDOWTRANS.real_window_h / 2);
    shake_amt = (G.SETTINGS.reduced_motion && 0 || 1) * G.SETTINGS.screenshake / 100 * 3;
    if (shake_amt < 0.05) {
        shake_amt = 0;
    }
    G.ROOM.jiggle = (G.ROOM.jiggle || 0) * (1 - 5 * dt) * (shake_amt > 0.05 && 1 || 0);
    G.ROOM.T.r = (0.001 * math.sin(0.3 * G.TIMERS.REAL) + 0.002 * G.ROOM.jiggle * math.sin(39.913 * G.TIMERS.REAL)) * shake_amt;
    G.ROOM.T.x = G.ROOM_ORIG.x + shake_amt * (0.015 * math.sin(0.913 * G.TIMERS.REAL) + 0.01 * G.ROOM.jiggle * shake_amt * math.sin(19.913 * G.TIMERS.REAL) + (G.ARGS.eased_cursor_pos.x - 0.5 * (G.ROOM.T.w + G.ROOM_ORIG.x)) * 0.01);
    G.ROOM.T.y = G.ROOM_ORIG.y + shake_amt * (0.015 * math.sin(0.952 * G.TIMERS.REAL) + 0.01 * G.ROOM.jiggle * shake_amt * math.sin(21.913 * G.TIMERS.REAL) + (G.ARGS.eased_cursor_pos.y - 0.5 * (G.ROOM.T.h + G.ROOM_ORIG.y)) * 0.01);
    G.JIGGLE_VIBRATION = G.JIGGLE_VIBRATION * (1 - 5 * dt);
    G.CURR_VIBRATION = G.CURR_VIBRATION || 0;
    G.CURR_VIBRATION = math.min(1, G.CURR_VIBRATION + G.VIBRATION + G.JIGGLE_VIBRATION * 0.2);
    G.VIBRATION = 0;
    G.CURR_VIBRATION = (1 - 15 * dt) * G.CURR_VIBRATION;
    if (!G.SETTINGS.rumble) {
        G.CURR_VIBRATION = 0;
    }
    if (G.CONTROLLER.GAMEPAD.object && G.F_RUMBLE) {
        G.CONTROLLER.GAMEPAD.object.setVibration(G.CURR_VIBRATION * 0.4 * G.F_RUMBLE, G.CURR_VIBRATION * 0.4 * G.F_RUMBLE);
    }
}
function juice_card_until(card, eval_func, first, delay): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: delay || 0.1, blocking: false, blockable: false, timer: "REAL", func: function () {
            if (eval_func(card)) {
                if (!first || first) {
                    card.juice_up(0.1, 0.1);
                }
                juice_card_until(card, eval_func, undefined, 0.8);
            }
            return true;
        } }));
}
function check_for_unlock(args): void {
    if (!next(args)) {
        return;
    }
    if (false) {
        return;
    }
    if (args.type === "win_challenge") {
        unlock_achievement("rule_bender");
        let _c = true;
        for (const [k, v] of pairs(G.CHALLENGES)) {
            if (!G.PROFILES[G.SETTINGS.profile].challenge_progress.completed[v.id]) {
                _c = false;
            }
        }
        if (_c) {
            unlock_achievement("rule_breaker");
        }
    }
    if (false) {
        return;
    }
    fetch_achievements();
    for (const [k, v] of pairs(G.ACHIEVEMENTS)) {
        if (!v.earned && (v.unlock_condition && type(v.unlock_condition) === "function") && v.unlock_condition(args)) {
            unlock_achievement(k);
        }
    }
    if (args.type === "career_stat") {
        if (args.statname === "c_cards_played" && G.PROFILES[G.SETTINGS.profile].career_stats[args.statname] >= 2500) {
            unlock_achievement("card_player");
        }
        if (args.statname === "c_cards_discarded" && G.PROFILES[G.SETTINGS.profile].career_stats[args.statname] >= 2500) {
            unlock_achievement("card_discarder");
        }
    }
    if (args.type === "ante_up") {
        if (args.ante >= 4) {
            unlock_achievement("ante_up");
        }
        if (args.ante >= 8) {
            unlock_achievement("ante_upper");
        }
    }
    if (args.type === "win") {
        unlock_achievement("heads_up");
        if (G.GAME.round <= 12) {
            unlock_achievement("speedrunner");
        }
        if (G.GAME.round_scores.times_rerolled.amt <= 0) {
            unlock_achievement("you_get_what_you_get");
        }
    }
    if (args.type === "win_stake") {
        let [highest_win, lowest_win] = get_deck_win_stake(undefined);
        if (highest_win >= G.P_STAKES["stake_red"].stake_level) {
            unlock_achievement("low_stakes");
        }
        if (highest_win >= G.P_STAKES["stake_black"].stake_level) {
            unlock_achievement("mid_stakes");
        }
        if (highest_win >= G.P_STAKES["stake_gold"].stake_level) {
            unlock_achievement("high_stakes");
        }
        if (G.PROGRESS && G.PROGRESS.deck_stakes.tally / G.PROGRESS.deck_stakes.of >= 1) {
            unlock_achievement("completionist_plus");
        }
        if (G.PROGRESS && G.PROGRESS.joker_stickers.tally / G.PROGRESS.joker_stickers.of >= 1) {
            unlock_achievement("completionist_plus_plus");
        }
    }
    if (args.type === "money") {
        if (G.GAME.dollars >= 400) {
            unlock_achievement("nest_egg");
        }
    }
    if (args.type === "hand") {
        if (args.handname === "Flush" && args.scoring_hand) {
            let _w = 0;
            for (const [k, v] of ipairs(args.scoring_hand)) {
                if (v.ability.name === "Wild Card") {
                    _w = _w + 1;
                }
            }
            if (_w === args.scoring_hand.length) {
                unlock_achievement("flushed");
            }
        }
        if (args.disp_text === "Royal Flush") {
            unlock_achievement("royale");
        }
    }
    if (args.type === "shatter") {
        if (args.shattered.length >= 2) {
            unlock_achievement("shattered");
        }
    }
    if (args.type === "run_redeem") {
        let _v = 0;
        _v = _v - (G.GAME.starting_voucher_count || 0);
        for (const [k, v] of pairs(G.GAME.used_vouchers)) {
            _v = _v + 1;
        }
        if (_v >= 5 && G.GAME.round_resets.ante <= 4) {
            unlock_achievement("roi");
        }
    }
    if (args.type === "upgrade_hand") {
        if (args.level >= 10) {
            unlock_achievement("retrograde");
        }
    }
    if (args.type === "chip_score") {
        if (args.chips >= 10000) {
            unlock_achievement("_10k");
        }
        if (args.chips >= 1000000) {
            unlock_achievement("_1000k");
        }
        if (args.chips >= 100000000) {
            unlock_achievement("_100000k");
        }
    }
    if (args.type === "modify_deck") {
        if (G.deck && G.deck.config.card_limit <= 20) {
            unlock_achievement("tiny_hands");
        }
        if (G.deck && G.deck.config.card_limit >= 80) {
            unlock_achievement("big_hands");
        }
    }
    if (args.type === "spawn_legendary") {
        unlock_achievement("legendary");
    }
    if (args.type === "discover_amount") {
        if (G.DISCOVER_TALLIES.vouchers.tally / G.DISCOVER_TALLIES.vouchers.of >= 1) {
            unlock_achievement("extreme_couponer");
        }
        if (G.DISCOVER_TALLIES.spectrals.tally / G.DISCOVER_TALLIES.spectrals.of >= 1) {
            unlock_achievement("clairvoyance");
        }
        if (G.DISCOVER_TALLIES.tarots.tally / G.DISCOVER_TALLIES.tarots.of >= 1) {
            unlock_achievement("cartomancy");
        }
        if (G.DISCOVER_TALLIES.planets.tally / G.DISCOVER_TALLIES.planets.of >= 1) {
            unlock_achievement("astronomy");
        }
        if (G.DISCOVER_TALLIES.total.tally / G.DISCOVER_TALLIES.total.of >= 1) {
            unlock_achievement("completionist");
        }
    }
    let i = 1;
    while (i <= G.P_LOCKED.length) {
        let ret = false;
        let card = G.P_LOCKED[i];
        let custom_check;
        if (!card.unlocked && card.check_for_unlock && type(card.check_for_unlock) === "function") {
            ret = card.check_for_unlock(args);
            if (ret) {
                unlock_card(card);
            }
            custom_check = true;
        }
        if (!custom_check && !card.unlocked && card.unlock_condition && args.type === "career_stat") {
            if (args.statname === card.unlock_condition.type && G.PROFILES[G.SETTINGS.profile].career_stats[args.statname] >= card.unlock_condition.extra) {
                ret = true;
                unlock_card(card);
            }
        }
        if (!custom_check && !card.unlocked && card.unlock_condition && card.unlock_condition.type === args.type) {
            if (args.type === "hand" && args.handname === card.unlock_condition.extra) {
                ret = true;
                unlock_card(card);
            }
            if (args.type === "min_hand_size" && G.hand && G.hand.config.card_limit <= card.unlock_condition.extra) {
                ret = true;
                unlock_card(card);
            }
            if (args.type === "interest_streak" && card.unlock_condition.extra <= G.PROFILES[G.SETTINGS.profile].career_stats.c_round_interest_cap_streak) {
                ret = true;
                unlock_card(card);
            }
            if (args.type === "run_card_replays") {
                for (const [k, v] of ipairs(G.playing_cards)) {
                    if (v.base.times_played >= card.unlock_condition.extra) {
                        ret = true;
                        unlock_card(card);
                        break;
                    }
                }
            }
            if (args.type === "play_all_hearts") {
                let played = true;
                for (const [k, v] of ipairs(G.deck.cards)) {
                    if (!SMODS.has_no_suit(v) && v.base.suit === "Hearts") {
                        played = false;
                    }
                }
                for (const [k, v] of ipairs(G.hand.cards)) {
                    if (!SMODS.has_no_suit(v) && v.base.suit === "Hearts") {
                        played = false;
                    }
                }
                if (played) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "run_redeem") {
                let vouchers_redeemed = 0;
                for (const [k, v] of pairs(G.GAME.used_vouchers)) {
                    vouchers_redeemed = vouchers_redeemed + 1;
                }
                if (vouchers_redeemed >= card.unlock_condition.extra) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "have_edition") {
                let shiny_jokers = 0;
                for (const [k, v] of ipairs(G.jokers.cards)) {
                    if (v.edition) {
                        shiny_jokers = shiny_jokers + 1;
                    }
                }
                if (shiny_jokers >= card.unlock_condition.extra) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "double_gold") {
                ret = true;
                unlock_card(card);
            }
            if (args.type === "continue_game") {
                ret = true;
                unlock_card(card);
            }
            if (args.type === "blank_redeems") {
                if (G.PROFILES[G.SETTINGS.profile].voucher_usage["v_blank"] && G.PROFILES[G.SETTINGS.profile].voucher_usage["v_blank"].count >= card.unlock_condition.extra) {
                    unlock_card(card);
                }
            }
            if (args.type === "modify_deck") {
                if (card.unlock_condition.extra && card.unlock_condition.extra.suit) {
                    let count = 0;
                    for (const [_, v] of pairs(G.playing_cards)) {
                        if (v.base.suit === card.unlock_condition.extra.suit) {
                            count = count + 1;
                        }
                    }
                    if (count >= card.unlock_condition.extra.count) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.unlock_condition.extra && card.unlock_condition.extra.enhancement) {
                    let count = 0;
                    for (const [_, v] of pairs(G.playing_cards)) {
                        if (v.ability.name === card.unlock_condition.extra.enhancement) {
                            count = count + 1;
                        }
                    }
                    if (count >= card.unlock_condition.extra.count) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.unlock_condition.extra && card.unlock_condition.extra.tally) {
                    let count = 0;
                    for (const [_, v] of pairs(G.playing_cards)) {
                        if (v.ability.set === "Enhanced") {
                            count = count + 1;
                        }
                    }
                    if (count >= card.unlock_condition.extra.count) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "discover_amount") {
                if (card.unlock_condition.amount) {
                    if (card.unlock_condition.amount <= args.amount) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.unlock_condition.tarot_count) {
                    if (G.P_CENTER_POOLS.Tarot.length <= args.tarot_count) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.unlock_condition.planet_count) {
                    if (G.P_CENTER_POOLS.Planet.length <= args.planet_count) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "win_deck") {
                if (card.unlock_condition.deck) {
                    if (get_deck_win_stake(card.unlock_condition.deck) > 0) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "win_stake") {
                if (card.unlock_condition.stake) {
                    if (get_deck_win_stake() >= card.unlock_condition.stake) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "discover_planets") {
                let count = 0;
                for (const [k, v] of pairs(G.P_CENTERS)) {
                    if (v.set === "Planet" && v.discovered) {
                        count = count + 1;
                    }
                }
                if (count >= 9) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "blind_discoveries") {
                let discovered_blinds = 0;
                for (const [k, v] of pairs(G.P_BLINDS)) {
                    if (v.discovered) {
                        discovered_blinds = discovered_blinds + 1;
                    }
                }
                if (discovered_blinds >= card.unlock_condition.extra) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "modify_jokers" && G.jokers) {
                if (card.unlock_condition.extra.count) {
                    let count = 0;
                    for (const [_, v] of pairs(G.jokers.cards)) {
                        if (v.ability.set === "Joker" && v.edition && v.edition.polychrome && card.unlock_condition.extra.polychrome) {
                            count = count + 1;
                        }
                    }
                    if (count >= card.unlock_condition.extra.count) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "money") {
                if (card.unlock_condition.extra <= G.GAME.dollars) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "round_win") {
                if (card.name === "Matador") {
                    if (G.GAME.current_round.hands_played === 1 && G.GAME.current_round.discards_left === G.GAME.round_resets.discards && G.GAME.blind.get_type() === "Boss") {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.name === "Troubadour") {
                    if (G.PROFILES[G.SETTINGS.profile].career_stats.c_single_hand_round_streak >= card.unlock_condition.extra) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.name === "Hanging Chad") {
                    if (G.GAME.last_hand_played === card.unlock_condition.extra && G.GAME.blind.get_type() === "Boss") {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "ante_up") {
                if (card.unlock_condition.ante) {
                    if (args.ante === card.unlock_condition.ante) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "hand_contents") {
                if (card.name === "Seeing Double") {
                    let tally = 0;
                    for (let j = 1; j <= args.cards.length; j++) {
                        if (args.cards[j].get_id() === 7 && args.cards[j].is_suit("Clubs")) {
                            tally = tally + 1;
                        }
                    }
                    if (tally >= 4) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.name === "Golden Ticket") {
                    let tally = 0;
                    for (let j = 1; j <= args.cards.length; j++) {
                        if (SMODS.has_enhancement(args.cards[j], "m_gold")) {
                            tally = tally + 1;
                        }
                    }
                    if (tally >= 5) {
                        ret = true;
                        unlock_card(card);
                    }
                }
            }
            if (args.type === "discard_custom") {
                if (card.name === "Hit the Road") {
                    let tally = 0;
                    for (let j = 1; j <= args.cards.length; j++) {
                        if (args.cards[j].get_id() === 11) {
                            tally = tally + 1;
                        }
                    }
                    if (tally >= 5) {
                        ret = true;
                        unlock_card(card);
                    }
                }
                if (card.name === "Brainstorm") {
                    let eval = evaluate_poker_hand(args.cards);
                    if (next(eval["Straight Flush"])) {
                        let min = 10;
                        for (let j = 1; j <= args.cards.length; j++) {
                            if (args.cards[j].get_id() < min) {
                                min = args.cards[j].get_id();
                            }
                        }
                        if (min === 10) {
                            ret = true;
                            unlock_card(card);
                        }
                    }
                }
            }
            if (args.type === "win_no_hand" && G.GAME.hands[card.unlock_condition.extra].played === 0) {
                ret = true;
                unlock_card(card);
            }
            if (args.type === "win_custom") {
                if (card.name === "Invisible Joker" && G.GAME.max_jokers <= 4) {
                    ret = true;
                    unlock_card(card);
                }
                if (card.name === "Blueprint") {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "win") {
                if (card.unlock_condition.n_rounds >= G.GAME.round) {
                    ret = true;
                    unlock_card(card);
                }
            }
            if (args.type === "chip_score") {
                if (card.unlock_condition.chips <= args.chips) {
                    ret = true;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    unlock_card(card);
                                    return true;
                                } }));
                            return true;
                        } }));
                }
            }
        }
        if (ret === true) {
            table.remove(G.P_LOCKED, i);
        }
        else {
            i = i + 1;
        }
    }
}
function unlock_card(card): void {
    if (card.unlocked === false) {
        if (!SMODS.config.seeded_unlocks && (G.GAME.seeded || G.GAME.challenge)) {
            return;
        }
        if (card.unlocked || card.wip) {
            return;
        }
        G.save_notify(card);
        card.unlocked = true;
        if (card.set === "Back") {
            discover_card(card);
        }
        table.sort(G.P_CENTER_POOLS["Back"], function (a, b) {
            return a.order - (a.unlocked && 100 || 0) < b.order - (b.unlocked && 100 || 0);
        });
        G.save_progress();
        G.FILE_HANDLER.force = true;
        notify_alert(card.key, card.set);
    }
}
function fetch_achievements(): void {
    G.ACHIEVEMENTS = G.ACHIEVEMENTS || { ante_up: { order: 1, tier: 3, earned: false, steamid: "BAL_01" }, ante_upper: { order: 2, tier: 3, earned: false, steamid: "BAL_02" }, heads_up: { order: 3, tier: 2, earned: false, steamid: "BAL_03" }, low_stakes: { order: 4, tier: 2, earned: false, steamid: "BAL_04" }, mid_stakes: { order: 5, tier: 2, earned: false, steamid: "BAL_05" }, high_stakes: { order: 6, tier: 2, earned: false, steamid: "BAL_06" }, card_player: { order: 7, tier: 3, earned: false, steamid: "BAL_07" }, card_discarder: { order: 8, tier: 3, earned: false, steamid: "BAL_08" }, nest_egg: { order: 9, tier: 2, earned: false, steamid: "BAL_09" }, flushed: { order: 10, tier: 3, earned: false, steamid: "BAL_10" }, speedrunner: { order: 11, tier: 2, earned: false, steamid: "BAL_11" }, roi: { order: 12, tier: 3, earned: false, steamid: "BAL_12" }, shattered: { order: 13, tier: 3, earned: false, steamid: "BAL_13" }, royale: { order: 14, tier: 3, earned: false, steamid: "BAL_14" }, retrograde: { order: 15, tier: 2, earned: false, steamid: "BAL_15" }, _10k: { order: 16, tier: 3, earned: false, steamid: "BAL_16" }, _1000k: { order: 17, tier: 2, earned: false, steamid: "BAL_17" }, _100000k: { order: 18, tier: 1, earned: false, steamid: "BAL_18" }, tiny_hands: { order: 19, tier: 2, earned: false, steamid: "BAL_19" }, big_hands: { order: 20, tier: 2, earned: false, steamid: "BAL_20" }, you_get_what_you_get: { order: 21, tier: 3, earned: false, steamid: "BAL_21" }, rule_bender: { order: 22, tier: 3, earned: false, steamid: "BAL_22" }, rule_breaker: { order: 23, tier: 1, earned: false, steamid: "BAL_23" }, legendary: { order: 24, tier: 3, earned: false, steamid: "BAL_24" }, astronomy: { order: 25, tier: 3, earned: false, steamid: "BAL_25" }, cartomancy: { order: 26, tier: 3, earned: false, steamid: "BAL_26" }, clairvoyance: { order: 27, tier: 2, earned: false, steamid: "BAL_27" }, extreme_couponer: { order: 28, tier: 1, earned: false, steamid: "BAL_28" }, completionist: { order: 29, tier: 1, earned: false, steamid: "BAL_29" }, completionist_plus: { order: 30, tier: 1, earned: false, steamid: "BAL_30" }, completionist_plus_plus: { order: 31, tier: 1, earned: false, steamid: "BAL_31" } };
    G.SETTINGS.ACHIEVEMENTS_EARNED = G.SETTINGS.ACHIEVEMENTS_EARNED || {};
    for (const [k, v] of pairs(G.ACHIEVEMENTS)) {
        if (!v.key) {
            v.key = k;
        }
        for (const [kk, vv] of pairs(G.SETTINGS.ACHIEVEMENTS_EARNED)) {
            if (G.ACHIEVEMENTS[kk] && G.ACHIEVEMENTS[kk].mod) {
                G.ACHIEVEMENTS[kk].earned = true;
            }
        }
    }
    if (G.F_NO_ACHIEVEMENTS) {
        return;
    }
    if (!G.STEAM) {
        G.SETTINGS.ACHIEVEMENTS_EARNED = G.SETTINGS.ACHIEVEMENTS_EARNED || {};
        for (const [k, v] of pairs(G.SETTINGS.ACHIEVEMENTS_EARNED)) {
            if (G.ACHIEVEMENTS[k]) {
                G.ACHIEVEMENTS[k].earned = true;
            }
        }
    }
    if (G.STEAM && !G.STEAM.initial_fetch) {
        for (const [k, v] of pairs(G.ACHIEVEMENTS)) {
            let achievement_name = v.steamid;
            let [success, achieved] = G.STEAM.userStats.getAchievement(achievement_name);
            if (success) {
                v.earned = !!achieved;
            }
        }
        G.STEAM.initial_fetch = true;
    }
}
function unlock_achievement(achievement_name): void {
    if (G.PROFILES[G.SETTINGS.profile].all_unlocked && (G.ACHIEVEMENTS && G.ACHIEVEMENTS[achievement_name] && !G.ACHIEVEMENTS[achievement_name].bypass_all_unlocked && SMODS.config.achievements < 3) || SMODS.config.achievements < 3 && (G.GAME.seeded || G.GAME.challenge)) {
        return true;
    }
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, blockable: false, blocking: false, func: function () {
            if (G.STATE !== G.STATES.HAND_PLAYED) {
                if (G.PROFILES[G.SETTINGS.profile].all_unlocked && (G.ACHIEVEMENTS && G.ACHIEVEMENTS[achievement_name] && !G.ACHIEVEMENTS[achievement_name].bypass_all_unlocked && SMODS.config.achievements < 3) || SMODS.config.achievements < 3 && (G.GAME.seeded || G.GAME.challenge)) {
                    return true;
                }
                let achievement_set = false;
                if (!G.ACHIEVEMENTS) {
                    fetch_achievements();
                }
                G.SETTINGS.ACHIEVEMENTS_EARNED[achievement_name] = true;
                G.save_progress();
                if (G.ACHIEVEMENTS[achievement_name] && G.ACHIEVEMENTS[achievement_name].mod) {
                    if (!G.ACHIEVEMENTS[achievement_name].earned) {
                        achievement_set = true;
                        G.FILE_HANDLER.force = true;
                    }
                    G.ACHIEVEMENTS[achievement_name].earned = true;
                }
                if (achievement_set) {
                    notify_alert(achievement_name);
                    return true;
                }
                if (G.F_NO_ACHIEVEMENTS && !(G.ACHIEVEMENTS[achievement_name] || {}).mod) {
                    return true;
                }
                if (!G.ACHIEVEMENTS) {
                    fetch_achievements();
                }
                G.SETTINGS.ACHIEVEMENTS_EARNED[achievement_name] = true;
                G.save_progress();
                if (G.ACHIEVEMENTS[achievement_name] && !G.STEAM) {
                    if (!G.ACHIEVEMENTS[achievement_name].earned) {
                        achievement_set = true;
                        G.FILE_HANDLER.force = true;
                    }
                    G.ACHIEVEMENTS[achievement_name].earned = true;
                }
                if (G.STEAM) {
                    if (G.ACHIEVEMENTS[achievement_name]) {
                        if (!G.ACHIEVEMENTS[achievement_name].earned) {
                            achievement_set = true;
                            G.FILE_HANDLER.force = true;
                            let achievement_code = G.ACHIEVEMENTS[achievement_name].steamid;
                            let [success, achieved] = G.STEAM.userStats.getAchievement(achievement_code);
                            if (!success || !achieved) {
                                G.STEAM.send_control.update_queued = true;
                                G.STEAM.userStats.setAchievement(achievement_code);
                            }
                        }
                        G.ACHIEVEMENTS[achievement_name].earned = true;
                    }
                }
                if (achievement_set) {
                    notify_alert(achievement_name);
                }
                return true;
            }
        } }), "achievement");
}
function notify_alert(_achievement, _type): void {
    _type = _type || "achievement";
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, pause_force: true, timer: "UPTIME", func: function () {
            if (G.achievement_notification) {
                G.achievement_notification.remove();
                G.achievement_notification = undefined;
            }
            G.achievement_notification = G.achievement_notification || UIBox({ definition: create_UIBox_notify_alert(_achievement, _type), config: { align: "cr", offset: { x: 20, y: 0 }, major: G.ROOM_ATTACH, bond: "Weak" } });
            return true;
        } }), "achievement");
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, trigger: "after", pause_force: true, timer: "UPTIME", delay: 0.1, func: function () {
            G.achievement_notification.alignment.offset.x = G.ROOM.T.x - G.achievement_notification.UIRoot.children[1].children[1].T.w - 0.8;
            return true;
        } }), "achievement");
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, pause_force: true, trigger: "after", timer: "UPTIME", delay: 0.1, func: function () {
            play_sound("highlight1", undefined, 0.5);
            play_sound("foil2", 0.5, 0.4);
            return true;
        } }), "achievement");
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, pause_force: true, trigger: "after", delay: 3, timer: "UPTIME", func: function () {
            G.achievement_notification.alignment.offset.x = 20;
            return true;
        } }), "achievement");
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, pause_force: true, trigger: "after", delay: 0.5, timer: "UPTIME", func: function () {
            if (G.achievement_notification) {
                G.achievement_notification.remove();
                G.achievement_notification = undefined;
            }
            return true;
        } }), "achievement");
}
function inc_steam_stat(stat_name): void {
    if (!G.STEAM) {
        return;
    }
    let [success, current_stat] = G.STEAM.userStats.getStatInt(stat_name);
    if (success) {
        G.STEAM.userStats.setStatInt(stat_name, current_stat + 1);
        G.STEAM.send_control.update_queued = true;
    }
}
function unlock_notify(): void {
    let _UN = get_compressed(G.SETTINGS.profile + ("/" + "unlock_notify.jkr"));
    if (_UN) {
        for (const [key] of string.gmatch(_UN + "\\n", "(.-)\\n")) {
            create_unlock_overlay(key);
        }
        love.filesystem.remove(G.SETTINGS.profile + ("/" + "unlock_notify.jkr"));
    }
}
function create_unlock_overlay(key): void {
    if (G.P_CENTERS[key]) {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", no_delete: true, func: function () {
                if (!G.OVERLAY_MENU) {
                    G.SETTINGS.paused = true;
                    G.FUNCS.overlay_menu({ definition: G.P_CENTERS[key].set === "Back" && create_UIBox_deck_unlock(G.P_CENTERS[key]) || create_UIBox_card_unlock(G.P_CENTERS[key]) });
                    play_sound("foil1", 0.7, 0.3);
                    play_sound("gong", 1.4, 0.15);
                    return true;
                }
            } }), "unlock");
    }
}
function discover_card(card): void {
    if (!SMODS.config.seeded_unlocks && (G.GAME.seeded || G.GAME.challenge)) {
        return;
    }
    card = card || {};
    if (card.discovered || card.wip) {
        return;
    }
    if (card && !card.discovered) {
        card.alert = true;
        G.GAME.round_scores.new_collection.amt = G.GAME.round_scores.new_collection.amt + 1;
    }
    card.discovered = true;
    set_discover_tallies();
    G.E_MANAGER.add_event(new GameEvent({ func: function () {
            G.save_progress();
            return true;
        } }));
}
function get_deck_from_name(_name): void {
    for (const [k, v] of pairs(G.P_CENTERS)) {
        if (v.name === _name) {
            return v;
        }
    }
}
function get_next_voucher_key(_from_tag): void {
    let [_pool, _pool_key] = get_current_pool("Voucher");
    if (_from_tag) {
        _pool_key = "Voucher_fromtag";
    }
    let center = pseudorandom_element(_pool, pseudoseed(_pool_key));
    let it = 1;
    while (center === "UNAVAILABLE") {
        it = it + 1;
        center = pseudorandom_element(_pool, pseudoseed(_pool_key + ("_resample" + it)));
    }
    return center;
}
function get_next_tag_key(append): void {
    if (G.FORCE_TAG) {
        return G.FORCE_TAG;
    }
    let [_pool, _pool_key] = get_current_pool("Tag", undefined, undefined, append);
    let _tag = pseudorandom_element(_pool, pseudoseed(_pool_key));
    let it = 1;
    while (_tag === "UNAVAILABLE") {
        it = it + 1;
        _tag = pseudorandom_element(_pool, pseudoseed(_pool_key + ("_resample" + it)));
    }
    return _tag;
}
function create_playing_card(card_init, area, skip_materialize, silent, colours): void {
    card_init = card_init || {};
    card_init.front = card_init.front || pseudorandom_element(G.P_CARDS, pseudoseed("front"));
    card_init.center = card_init.center || G.P_CENTERS.c_base;
    G.playing_card = G.playing_card && G.playing_card + 1 || 1;
    let _area = area || G.hand;
    let card = Card(_area.T.x, _area.T.y, G.CARD_W, G.CARD_H, card_init.front, card_init.center, { playing_card: G.playing_card });
    table.insert(G.playing_cards, card);
    card.playing_card = G.playing_card;
    if (area) {
        area.emplace(card);
    }
    if (!skip_materialize) {
        card.start_materialize(colours, silent);
    }
    return card;
}
function get_pack(_key, _type): void {
    if (!G.GAME.first_shop_buffoon && !G.GAME.banned_keys["p_buffoon_normal_1"]) {
        G.GAME.first_shop_buffoon = true;
        return G.P_CENTERS["p_buffoon_normal_" + math.random(1, 2)];
    }
    let [cume, it, center] = [0, 0, undefined];
    for (const [k, v] of ipairs(G.P_CENTER_POOLS["Booster"])) {
        if ((!_type || _type === v.kind) && !G.GAME.banned_keys[v.key]) {
            cume = cume + (v.weight || 1);
        }
    }
    let poll = pseudorandom(pseudoseed((_key || "pack_generic") + G.GAME.round_resets.ante)) * cume;
    for (const [k, v] of ipairs(G.P_CENTER_POOLS["Booster"])) {
        if (!G.GAME.banned_keys[v.key]) {
            if (!_type || _type === v.kind) {
                it = it + (v.weight || 1);
            }
            if (it >= poll && it - (v.weight || 1) <= poll) {
                center = v;
                break;
            }
        }
    }
    return center;
}
function get_current_pool(_type, _rarity, _legendary, _append): void {
    G.ARGS.TEMP_POOL = EMPTY(G.ARGS.TEMP_POOL);
    let [_pool, _starting_pool, _pool_key, _pool_size] = [G.ARGS.TEMP_POOL, undefined, "", 0];
    if (_type === "Joker") {
        _rarity = _legendary && 4 || type(_rarity) === "number" && (_rarity > 0.95 && 3 || _rarity > 0.7 && 2 || 1) || _rarity;
        _rarity = { Common: 1, Uncommon: 2, Rare: 3, Legendary: 4 }[_rarity] || _rarity;
        let rarity = _rarity || SMODS.poll_rarity("Joker", "rarity" + (G.GAME.round_resets.ante + (_append || "")));
        [_starting_pool, _pool_key] = [G.P_JOKER_RARITY_POOLS[rarity], "Joker" + (rarity + (!_legendary && _append || ""))];
    }
    else if (SMODS.ObjectTypes[_type] && SMODS.ObjectTypes[_type].rarities) {
        let rarities = SMODS.ObjectTypes[_type].rarities;
        let rarity;
        if (_legendary && rarities.legendary) {
            rarity = rarities.legendary.key;
        }
        else {
            rarity = _rarity || SMODS.poll_rarity(_type, "rarity_" + (_type + (G.GAME.round_resets.ante + (_append || ""))));
        }
        [_starting_pool, _pool_key] = [SMODS.ObjectTypes[_type].rarity_pools[rarity], _type + (rarity + (_append || ""))];
    }
    else {
        [_starting_pool, _pool_key] = [G.P_CENTER_POOLS[_type], _type + (_append || "")];
    }
    for (const [k, v] of ipairs(_starting_pool)) {
        let add = undefined;
        let [in_pool, pool_opts];
        if (v.in_pool && type(v.in_pool) === "function") {
            [in_pool, pool_opts] = v.in_pool({ source: _append });
        }
        pool_opts = pool_opts || {};
        if (_type === "Enhanced") {
            add = true;
        }
        else if (_type === "Demo") {
            if (v.pos && v.config) {
                add = true;
            }
        }
        else if (_type === "Tag") {
            if ((!v.requires || G.P_CENTERS[v.requires] && G.P_CENTERS[v.requires].discovered) && (!v.min_ante || v.min_ante <= G.GAME.round_resets.ante)) {
                add = true;
            }
        }
        else if (!(G.GAME.used_jokers[v.key] && !pool_opts.allow_duplicates && !next(find_joker("Showman"))) && (v.unlocked !== false || v.rarity === 4)) {
            if (v.set === "Voucher") {
                if (!G.GAME.used_vouchers[v.key]) {
                    let include = true;
                    if (v.requires) {
                        for (const [kk, vv] of pairs(v.requires)) {
                            if (!G.GAME.used_vouchers[vv]) {
                                include = false;
                            }
                        }
                    }
                    if (G.shop_vouchers && G.shop_vouchers.cards) {
                        for (const [kk, vv] of ipairs(G.shop_vouchers.cards)) {
                            if (vv.config.center.key === v.key) {
                                include = false;
                            }
                        }
                    }
                    if (include) {
                        add = true;
                    }
                }
            }
            else if (v.set === "Planet") {
                if (!v.config.softlock || G.GAME.hands[v.config.hand_type].played > 0) {
                    add = true;
                }
            }
            else if (v.enhancement_gate) {
                add = undefined;
                for (const [kk, vv] of pairs(G.playing_cards)) {
                    if (SMODS.has_enhancement(vv, v.enhancement_gate)) {
                        add = true;
                    }
                }
            }
            else {
                add = true;
            }
            if (v.name === "Black Hole" || v.name === "The Soul" || v.hidden) {
                add = false;
            }
        }
        if (v.no_pool_flag && G.GAME.pool_flags[v.no_pool_flag]) {
            add = undefined;
        }
        if (v.yes_pool_flag && !G.GAME.pool_flags[v.yes_pool_flag]) {
            add = undefined;
        }
        if (v.in_pool && type(v.in_pool) === "function") {
            add = in_pool && (add || pool_opts.override_base_checks);
        }
        if (add && !G.GAME.banned_keys[v.key]) {
            _pool[_pool.length + 1] = v.key;
            _pool_size = _pool_size + 1;
        }
        else {
            _pool[_pool.length + 1] = "UNAVAILABLE";
        }
    }
    if (_pool_size === 0) {
        _pool = EMPTY(G.ARGS.TEMP_POOL);
        if (SMODS.ObjectTypes[_type] && SMODS.ObjectTypes[_type].default && G.P_CENTERS[SMODS.ObjectTypes[_type].default]) {
            _pool[_pool.length + 1] = SMODS.ObjectTypes[_type].default;
        }
        else if (_type === "Tarot" || _type === "Tarot_Planet") {
            _pool[_pool.length + 1] = "c_strength";
        }
        else if (_type === "Planet") {
            _pool[_pool.length + 1] = "c_pluto";
        }
        else if (_type === "Spectral") {
            _pool[_pool.length + 1] = "c_incantation";
        }
        else if (_type === "Joker") {
            _pool[_pool.length + 1] = "j_joker";
        }
        else if (_type === "Demo") {
            _pool[_pool.length + 1] = "j_joker";
        }
        else if (_type === "Voucher") {
            _pool[_pool.length + 1] = "v_blank";
        }
        else if (_type === "Tag") {
            _pool[_pool.length + 1] = "tag_handy";
        }
        else {
            _pool[_pool.length + 1] = "j_joker";
        }
    }
    return [_pool, _pool_key + (!_legendary && G.GAME.round_resets.ante || "")];
}
function poll_edition(_key, _mod, _no_neg, _guaranteed): void {
    _mod = _mod || 1;
    let edition_poll = pseudorandom(pseudoseed(_key || "edition_generic"));
    if (_guaranteed) {
        if (edition_poll > 1 - 0.003 * 25 && !_no_neg) {
            return { negative: true };
        }
        else if (edition_poll > 1 - 0.006 * 25) {
            return { polychrome: true };
        }
        else if (edition_poll > 1 - 0.02 * 25) {
            return { holo: true };
        }
        else if (edition_poll > 1 - 0.04 * 25) {
            return { foil: true };
        }
    }
    else {
        if (edition_poll > 1 - 0.003 * _mod && !_no_neg) {
            return { negative: true };
        }
        else if (edition_poll > 1 - 0.006 * G.GAME.edition_rate * _mod) {
            return { polychrome: true };
        }
        else if (edition_poll > 1 - 0.02 * G.GAME.edition_rate * _mod) {
            return { holo: true };
        }
        else if (edition_poll > 1 - 0.04 * G.GAME.edition_rate * _mod) {
            return { foil: true };
        }
    }
    return undefined;
}
function create_card(_type, area, legendary, _rarity, skip_materialize, soulable, forced_key, key_append): void {
    let area = area || G.jokers;
    let center = G.P_CENTERS.b_red;
    if (!forced_key && soulable && !G.GAME.banned_keys["c_soul"]) {
        for (const [_, v] of ipairs(SMODS.Consumable.legendaries)) {
            if ((_type === v.type.key || _type === v.soul_set) && !(G.GAME.used_jokers[v.key] && !next(find_joker("Showman")) && !v.can_repeat_soul) && (!v.in_pool || type(v.in_pool) !== "function" || v.in_pool())) {
                if (pseudorandom("soul_" + (v.key + (_type + G.GAME.round_resets.ante))) > 1 - v.soul_rate) {
                    forced_key = v.key;
                }
            }
        }
        if ((_type === "Tarot" || _type === "Spectral" || _type === "Tarot_Planet") && !(G.GAME.used_jokers["c_soul"] && !next(find_joker("Showman")))) {
            if (pseudorandom("soul_" + (_type + G.GAME.round_resets.ante)) > 0.997) {
                forced_key = "c_soul";
            }
        }
        if ((_type === "Planet" || _type === "Spectral") && !(G.GAME.used_jokers["c_black_hole"] && !next(find_joker("Showman")))) {
            if (pseudorandom("soul_" + (_type + G.GAME.round_resets.ante)) > 0.997) {
                forced_key = "c_black_hole";
            }
        }
    }
    if (_type === "Base") {
        forced_key = "c_base";
    }
    if (forced_key && !G.GAME.banned_keys[forced_key]) {
        center = G.P_CENTERS[forced_key];
        _type = center.set !== "Default" && center.set || _type;
    }
    else {
        let [_pool, _pool_key] = get_current_pool(_type, _rarity, legendary, key_append);
        center = pseudorandom_element(_pool, pseudoseed(_pool_key));
        let it = 1;
        while (center === "UNAVAILABLE") {
            it = it + 1;
            center = pseudorandom_element(_pool, pseudoseed(_pool_key + ("_resample" + it)));
        }
        center = G.P_CENTERS[center];
    }
    let front = (_type === "Base" || _type === "Enhanced") && pseudorandom_element(G.P_CARDS, pseudoseed("front" + ((key_append || "") + G.GAME.round_resets.ante))) || undefined;
    let card = Card(area.T.x + area.T.w / 2, area.T.y, G.CARD_W, G.CARD_H, front, center, { bypass_discovery_center: area === G.shop_jokers || area === G.pack_cards || area === G.shop_vouchers || G.shop_demo && area === G.shop_demo || area === G.jokers || area === G.consumeables, bypass_discovery_ui: area === G.shop_jokers || area === G.pack_cards || area === G.shop_vouchers || G.shop_demo && area === G.shop_demo, discover: area === G.jokers || area === G.consumeables, bypass_back: G.GAME.selected_back.pos });
    if (card.ability.consumeable && !skip_materialize) {
        card.start_materialize();
    }
    for (const [k, v] of ipairs(SMODS.Sticker.obj_buffer)) {
        let sticker = SMODS.Stickers[v];
        if (sticker.should_apply && type(sticker.should_apply) === "function" && sticker.should_apply(card, center, area)) {
            sticker.apply(card, true);
        }
    }
    if (_type === "Joker") {
        if (G.GAME.modifiers.all_eternal) {
            card.set_eternal(true);
        }
        if (area === G.shop_jokers || area === G.pack_cards) {
            let eternal_perishable_poll = pseudorandom((area === G.pack_cards && "packetper" || "etperpoll") + G.GAME.round_resets.ante);
            if (G.GAME.modifiers.enable_eternals_in_shop && eternal_perishable_poll > 0.7 && !SMODS.Stickers["eternal"].should_apply) {
                card.set_eternal(true);
            }
            else if (G.GAME.modifiers.enable_perishables_in_shop && (eternal_perishable_poll > 0.4 && eternal_perishable_poll <= 0.7) && !SMODS.Stickers["perishable"].should_apply) {
                card.set_perishable(true);
            }
            if (G.GAME.modifiers.enable_rentals_in_shop && pseudorandom((area === G.pack_cards && "packssjr" || "ssjr") + G.GAME.round_resets.ante) > 0.7 && !SMODS.Stickers["rental"].should_apply) {
                card.set_rental(true);
            }
        }
        if (!SMODS.bypass_create_card_edition) {
            let edition = poll_edition("edi" + ((key_append || "") + G.GAME.round_resets.ante));
            card.set_edition(edition);
            check_for_unlock({ type: "have_edition" });
        }
    }
    return card;
}
function copy_card(other, new_card, card_scale, playing_card, strip_edition): void {
    let new_card = new_card || Card(other.T.x, other.T.y, G.CARD_W * (card_scale || 1), G.CARD_H * (card_scale || 1), G.P_CARDS.empty, G.P_CENTERS.c_base, { playing_card: playing_card });
    new_card.set_ability(other.config.center);
    new_card.ability.type = other.ability.type;
    new_card.set_base(other.config.card);
    for (const [k, v] of pairs(other.ability)) {
        if (type(v) === "table") {
            new_card.ability[k] = copy_table(v);
        }
        else {
            new_card.ability[k] = v;
        }
    }
    if (!strip_edition) {
        new_card.set_edition(other.edition || {}, undefined, true);
    }
    check_for_unlock({ type: "have_edition" });
    new_card.set_seal(other.seal, true);
    if (other.seal) {
        for (const [k, v] of pairs(other.ability.seal || {})) {
            if (type(v) === "table") {
                new_card.ability.seal[k] = copy_table(v);
            }
            else {
                new_card.ability.seal[k] = v;
            }
        }
    }
    if (other.params) {
        new_card.params = other.params;
        new_card.params.playing_card = playing_card;
    }
    new_card.debuff = other.debuff;
    new_card.pinned = other.pinned;
    return new_card;
}
function tutorial_info(args): void {
    let overlay_colour = [0.32, 0.36, 0.41, 0];
    ease_value(overlay_colour, 4, 0.6, undefined, "REAL", true, 0.4);
    G.OVERLAY_TUTORIAL = G.OVERLAY_TUTORIAL || UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", padding: 32.05, r: 0.1, colour: overlay_colour, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "tr", minh: G.ROOM.T.h, minw: G.ROOM.T.w }, nodes: [UIBox_button({ label: [localize("b_skip") + " >"], button: "skip_tutorial_section", minw: 1.3, scale: 0.45, colour: G.C.JOKER_GREY })] }] }, config: { align: "cm", offset: { x: 0, y: 3.2 }, major: G.ROOM_ATTACH, bond: "Weak" } });
    G.OVERLAY_TUTORIAL.step = G.OVERLAY_TUTORIAL.step || 1;
    G.OVERLAY_TUTORIAL.step_complete = false;
    let row_dollars_chips = G.HUD.get_UIE_by_ID("row_dollars_chips");
    let align = args.align || "tm";
    let step = args.step || 1;
    let attach = args.attach || { major: row_dollars_chips, type: "tm", offset: { x: 0, y: -0.5 } };
    let pos = args.pos || { x: attach.major.T.x + attach.major.T.w / 2, y: attach.major.T.y + attach.major.T.h / 2 };
    let button = args.button || { button: localize("b_next"), func: "tut_next" };
    args.highlight = args.highlight || {};
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, func: function () {
            if (G.OVERLAY_TUTORIAL && G.OVERLAY_TUTORIAL.step === step && !G.OVERLAY_TUTORIAL.step_complete) {
                G.CONTROLLER.interrupt.focus = true;
                G.OVERLAY_TUTORIAL.Jimbo = G.OVERLAY_TUTORIAL.Jimbo || Card_Character(pos);
                if (type(args.highlight) === "function") {
                    args.highlight = args.highlight();
                }
                args.highlight[args.highlight.length + 1] = G.OVERLAY_TUTORIAL.Jimbo;
                G.OVERLAY_TUTORIAL.Jimbo.add_speech_bubble(args.text_key, align, args.loc_vars);
                G.OVERLAY_TUTORIAL.Jimbo.set_alignment(attach);
                if (args.hard_set) {
                    G.OVERLAY_TUTORIAL.Jimbo.hard_set_VT();
                }
                G.OVERLAY_TUTORIAL.button_listen = undefined;
                if (G.OVERLAY_TUTORIAL.content) {
                    G.OVERLAY_TUTORIAL.content.remove();
                }
                if (args.content) {
                    G.OVERLAY_TUTORIAL.content = UIBox({ definition: args.content(), config: { align: args.content_config && args.content_config.align || "cm", offset: args.content_config && args.content_config.offset || { x: 0, y: 0 }, major: args.content_config && args.content_config.major || G.OVERLAY_TUTORIAL.Jimbo, bond: "Weak" } });
                    args.highlight[args.highlight.length + 1] = G.OVERLAY_TUTORIAL.content;
                }
                if (args.button_listen) {
                    G.OVERLAY_TUTORIAL.button_listen = args.button_listen;
                }
                if (!args.no_button) {
                    G.OVERLAY_TUTORIAL.Jimbo.add_button(button.button, button.func, button.colour, button.update_func, true);
                }
                G.OVERLAY_TUTORIAL.Jimbo.say_stuff(2 * (G.localization.misc.tutorial[args.text_key] || {}).length + 1);
                if (args.snap_to) {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", blocking: false, blockable: false, func: function () {
                            if (G.OVERLAY_TUTORIAL && G.OVERLAY_TUTORIAL.Jimbo && !G.OVERLAY_TUTORIAL.Jimbo.talking) {
                                let _snap_to = args.snap_to();
                                if (_snap_to) {
                                    G.CONTROLLER.interrupt.focus = false;
                                    G.CONTROLLER.snap_to({ node: args.snap_to() });
                                }
                                return true;
                            }
                        } }), "tutorial");
                }
                if (args.highlight) {
                    G.OVERLAY_TUTORIAL.highlights = args.highlight;
                }
                G.OVERLAY_TUTORIAL.step_complete = true;
            }
            return !G.OVERLAY_TUTORIAL || G.OVERLAY_TUTORIAL.step > step || G.OVERLAY_TUTORIAL.skip_steps;
        } }), "tutorial");
    return step + 1;
}
function calculate_reroll_cost(skip_increment): void {
    if (G.GAME.current_round.free_rerolls < 0) {
        G.GAME.current_round.free_rerolls = 0;
    }
    if (G.GAME.current_round.free_rerolls > 0) {
        G.GAME.current_round.reroll_cost = 0;
        return;
    }
    G.GAME.current_round.reroll_cost_increase = G.GAME.current_round.reroll_cost_increase || 0;
    if (!skip_increment) {
        G.GAME.current_round.reroll_cost_increase = G.GAME.current_round.reroll_cost_increase + 1;
    }
    G.GAME.current_round.reroll_cost = (G.GAME.round_resets.temp_reroll_cost || G.GAME.round_resets.reroll_cost) + G.GAME.current_round.reroll_cost_increase;
}
function reset_idol_card(): void {
    G.GAME.current_round.idol_card.rank = "Ace";
    G.GAME.current_round.idol_card.suit = "Spades";
    let valid_idol_cards = {};
    for (const [k, v] of ipairs(G.playing_cards)) {
        if (v.ability.effect !== "Stone Card") {
            if (!SMODS.has_no_suit(v) && !SMODS.has_no_rank(v)) {
                valid_idol_cards[valid_idol_cards.length + 1] = v;
            }
        }
    }
    if (valid_idol_cards[1]) {
        let idol_card = pseudorandom_element(valid_idol_cards, pseudoseed("idol" + G.GAME.round_resets.ante));
        G.GAME.current_round.idol_card.rank = idol_card.base.value;
        G.GAME.current_round.idol_card.suit = idol_card.base.suit;
        G.GAME.current_round.idol_card.id = idol_card.base.id;
    }
}
function reset_mail_rank(): void {
    G.GAME.current_round.mail_card.rank = "Ace";
    let valid_mail_cards = {};
    for (const [k, v] of ipairs(G.playing_cards)) {
        if (v.ability.effect !== "Stone Card") {
            if (!SMODS.has_no_rank(v)) {
                valid_mail_cards[valid_mail_cards.length + 1] = v;
            }
        }
    }
    if (valid_mail_cards[1]) {
        let mail_card = pseudorandom_element(valid_mail_cards, pseudoseed("mail" + G.GAME.round_resets.ante));
        G.GAME.current_round.mail_card.rank = mail_card.base.value;
        G.GAME.current_round.mail_card.id = mail_card.base.id;
    }
}
function reset_ancient_card(): void {
    let ancient_suits = {};
    for (const [k, v] of ipairs(["Spades", "Hearts", "Clubs", "Diamonds"])) {
        if (v !== G.GAME.current_round.ancient_card.suit) {
            ancient_suits[ancient_suits.length + 1] = v;
        }
    }
    let ancient_card = pseudorandom_element(ancient_suits, pseudoseed("anc" + G.GAME.round_resets.ante));
    G.GAME.current_round.ancient_card.suit = ancient_card;
}
function reset_castle_card(): void {
    G.GAME.current_round.castle_card.suit = "Spades";
    let valid_castle_cards = {};
    for (const [k, v] of ipairs(G.playing_cards)) {
        if (v.ability.effect !== "Stone Card") {
            if (!SMODS.has_no_suit(v)) {
                valid_castle_cards[valid_castle_cards.length + 1] = v;
            }
        }
    }
    if (valid_castle_cards[1]) {
        let castle_card = pseudorandom_element(valid_castle_cards, pseudoseed("cas" + G.GAME.round_resets.ante));
        G.GAME.current_round.castle_card.suit = castle_card.base.suit;
    }
}
function reset_blinds(): void {
    G.GAME.round_resets.blind_states = G.GAME.round_resets.blind_states || { Small: "Select", Big: "Upcoming", Boss: "Upcoming" };
    if (G.GAME.round_resets.blind_states.Boss === "Defeated") {
        G.GAME.round_resets.blind_states.Small = "Upcoming";
        G.GAME.round_resets.blind_states.Big = "Upcoming";
        G.GAME.round_resets.blind_states.Boss = "Upcoming";
        G.GAME.blind_on_deck = "Small";
        G.GAME.round_resets.blind_choices.Boss = get_new_boss();
        G.GAME.round_resets.boss_rerolled = false;
    }
}
function get_new_boss(): void {
    G.GAME.perscribed_bosses = G.GAME.perscribed_bosses || {};
    if (G.GAME.perscribed_bosses && G.GAME.perscribed_bosses[G.GAME.round_resets.ante]) {
        let ret_boss = G.GAME.perscribed_bosses[G.GAME.round_resets.ante];
        G.GAME.perscribed_bosses[G.GAME.round_resets.ante] = undefined;
        G.GAME.bosses_used[ret_boss] = G.GAME.bosses_used[ret_boss] + 1;
        return ret_boss;
    }
    if (G.FORCE_BOSS) {
        return G.FORCE_BOSS;
    }
    let eligible_bosses = {};
    for (const [k, v] of pairs(G.P_BLINDS)) {
        if (!v.boss) { }
        else if (v.in_pool && type(v.in_pool) === "function") {
            let [res, options] = v.in_pool();
            if ((G.GAME.round_resets.ante % G.GAME.win_ante === 0 && G.GAME.round_resets.ante >= 2) === (v.boss.showdown || false) || (options || {}).ignore_showdown_check) {
                eligible_bosses[k] = res && true || undefined;
            }
        }
        else if (!v.boss.showdown && (v.boss.min <= math.max(1, G.GAME.round_resets.ante) && (math.max(1, G.GAME.round_resets.ante) % G.GAME.win_ante !== 0 || G.GAME.round_resets.ante < 2))) {
            eligible_bosses[k] = true;
        }
        else if (v.boss.showdown && G.GAME.round_resets.ante % G.GAME.win_ante === 0 && G.GAME.round_resets.ante >= 2) {
            eligible_bosses[k] = true;
        }
    }
    for (const [k, v] of pairs(G.GAME.banned_keys)) {
        if (eligible_bosses[k]) {
            eligible_bosses[k] = undefined;
        }
    }
    let min_use = 100;
    for (const [k, v] of pairs(G.GAME.bosses_used)) {
        if (eligible_bosses[k]) {
            eligible_bosses[k] = v;
            if (eligible_bosses[k] <= min_use) {
                min_use = eligible_bosses[k];
            }
        }
    }
    for (const [k, v] of pairs(eligible_bosses)) {
        if (eligible_bosses[k]) {
            if (eligible_bosses[k] > min_use) {
                eligible_bosses[k] = undefined;
            }
        }
    }
    let [_, boss] = pseudorandom_element(eligible_bosses, pseudoseed("boss"));
    G.GAME.bosses_used[boss] = G.GAME.bosses_used[boss] + 1;
    return boss;
}
function get_type_colour(_c, card): void {
    return _c.unlocked === false && !(card && card.bypass_lock) && G.C.BLACK || _c.unlocked !== false && (_c.set === "Joker" || _c.consumeable || _c.set === "Voucher") && !_c.discoveredand && !(_c.area !== G.jokers && _c.area !== G.consumeables && _c.area || !_c.area) && G.C.JOKER_GREY || card && card.debuff && mix_colours(G.C.RED, G.C.GREY, 0.7) || _c.set === "Joker" && G.C.RARITY[_c.rarity] || _c.set === "Edition" && G.C.DARK_EDITION || _c.set === "Booster" && G.C.BOOSTER || G.C.SECONDARY_SET[_c.set] || [0, 1, 1, 1];
}
function generate_card_ui(_c, full_UI_table, specific_vars, card_type, badges, hide_desc, main_start, main_end, card): void {
    if (card === undefined && card_type) {
        card = SMODS.compat_0_9_8.generate_UIBox_ability_table_card;
    }
    if (_c.specific_vars) {
        specific_vars = _c.specific_vars;
    }
    let first_pass = undefined;
    if (!full_UI_table) {
        first_pass = true;
        full_UI_table = { main: {}, info: {}, type: {}, name: undefined, badges: badges || {} };
    }
    let desc_nodes = !full_UI_table.name && full_UI_table.main || full_UI_table.info;
    let name_override = undefined;
    let info_queue = {};
    if (full_UI_table.name) {
        full_UI_table.info[full_UI_table.info.length + 1] = {};
        desc_nodes = full_UI_table.info[full_UI_table.info.length];
    }
    if (!full_UI_table.name) {
        if (specific_vars && specific_vars.no_name) {
            full_UI_table.name = true;
        }
        else if (card_type === "Locked") {
            full_UI_table.name = localize({ type: "name", set: "Other", key: "locked", nodes: {} });
        }
        else if (card_type === "Undiscovered") {
            full_UI_table.name = localize({ type: "name", set: "Other", key: "undiscovered_" + string.lower(_c.set), name_nodes: {} });
        }
        else if (specific_vars && (card_type === "Default" || card_type === "Enhanced")) {
            if (_c.name === "Stone Card" || _c.replace_base_card) {
                full_UI_table.name = true;
            }
            else if (specific_vars.playing_card) {
                full_UI_table.name = {};
                localize({ type: "other", key: "playing_card", set: "Other", nodes: full_UI_table.name, vars: { [1]: localize(specific_vars.value, "ranks"), [2]: localize(specific_vars.suit, "suits_plural"), colours: [specific_vars.colour] } });
                full_UI_table.name = full_UI_table.name[1];
            }
        }
        else if (card_type === "Booster") { }
        else {
            if (!_c.generate_ui || type(_c.generate_ui) !== "function") {
                full_UI_table.name = localize({ type: "name", set: _c.set, key: _c.key, nodes: full_UI_table.name });
            }
        }
        full_UI_table.card_type = card_type || _c.set;
    }
    let loc_vars = {};
    if (main_start) {
        desc_nodes[desc_nodes.length + 1] = main_start;
    }
    let cfg = card && card.ability || _c["config"];
    if (_c.set === "Other") {
        localize({ type: "other", key: _c.key, nodes: desc_nodes, vars: specific_vars || _c.vars });
    }
    else if (card_type === "Locked") {
        if (_c.wip) {
            localize({ type: "other", key: "wip_locked", set: "Other", nodes: desc_nodes, vars: loc_vars });
        }
        else if (_c.demo && specific_vars) {
            localize({ type: "other", key: "demo_shop_locked", nodes: desc_nodes, vars: loc_vars });
        }
        else if (_c.demo) {
            localize({ type: "other", key: "demo_locked", nodes: desc_nodes, vars: loc_vars });
        }
        else {
            let res = {};
            if (_c.locked_loc_vars && type(_c.locked_loc_vars) === "function") {
                let _card = _c.create_fake_card && _c.create_fake_card();
                res = _c.locked_loc_vars(info_queue, _card) || {};
                loc_vars = res.vars || {};
                specific_vars = specific_vars || {};
                specific_vars.not_hidden = res.not_hidden || specific_vars.not_hidden;
                if (res.main_start) {
                    desc_nodes[desc_nodes.length + 1] = res.main_start;
                }
                main_end = res.main_end || main_end;
            }
            else if (_c.name === "Golden Ticket") { }
            else if (_c.name === "Mr. Bones") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_losses];
            }
            else if (_c.name === "Acrobat") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_hands_played];
            }
            else if (_c.name === "Sock and Buskin") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_face_cards_played];
            }
            else if (_c.name === "Swashbuckler") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_jokers_sold];
            }
            else if (_c.name === "Troubadour") {
                loc_vars = [_c.unlock_condition.extra];
            }
            else if (_c.name === "Certificate") { }
            else if (_c.name === "Smeared Joker") {
                loc_vars = [_c.unlock_condition.extra.count, localize({ type: "name_text", key: _c.unlock_condition.extra.e_key, set: "Enhanced" })];
            }
            else if (_c.name === "Throwback") { }
            else if (_c.name === "Hanging Chad") {
                loc_vars = [localize(_c.unlock_condition.extra, "poker_hands")];
            }
            else if (_c.name === "Rough Gem") {
                loc_vars = [_c.unlock_condition.extra.count, localize(_c.unlock_condition.extra.suit, "suits_singular")];
            }
            else if (_c.name === "Bloodstone") {
                loc_vars = [_c.unlock_condition.extra.count, localize(_c.unlock_condition.extra.suit, "suits_singular")];
            }
            else if (_c.name === "Arrowhead") {
                loc_vars = [_c.unlock_condition.extra.count, localize(_c.unlock_condition.extra.suit, "suits_singular")];
            }
            else if (_c.name === "Onyx Agate") {
                loc_vars = [_c.unlock_condition.extra.count, localize(_c.unlock_condition.extra.suit, "suits_singular")];
            }
            else if (_c.name === "Glass Joker") {
                loc_vars = [_c.unlock_condition.extra.count, localize({ type: "name_text", key: _c.unlock_condition.extra.e_key, set: "Enhanced" })];
            }
            else if (_c.name === "Showman") {
                loc_vars = [_c.unlock_condition.ante];
            }
            else if (_c.name === "Flower Pot") {
                loc_vars = [_c.unlock_condition.ante];
            }
            else if (_c.name === "Blueprint") { }
            else if (_c.name === "Wee Joker") {
                loc_vars = [_c.unlock_condition.n_rounds];
            }
            else if (_c.name === "Merry Andy") {
                loc_vars = [_c.unlock_condition.n_rounds];
            }
            else if (_c.name === "Oops! All 6s") {
                loc_vars = [number_format(_c.unlock_condition.chips)];
            }
            else if (_c.name === "The Idol") {
                loc_vars = [number_format(_c.unlock_condition.chips)];
            }
            else if (_c.name === "Seeing Double") {
                loc_vars = [localize("ph_4_7_of_clubs")];
            }
            else if (_c.name === "Matador") { }
            else if (_c.name === "Hit the Road") { }
            else if (_c.name === "The Duo") {
                loc_vars = [localize(_c.unlock_condition.extra, "poker_hands")];
            }
            else if (_c.name === "The Trio") {
                loc_vars = [localize(_c.unlock_condition.extra, "poker_hands")];
            }
            else if (_c.name === "The Family") {
                loc_vars = [localize(_c.unlock_condition.extra, "poker_hands")];
            }
            else if (_c.name === "The Order") {
                loc_vars = [localize(_c.unlock_condition.extra, "poker_hands")];
            }
            else if (_c.name === "The Tribe") {
                loc_vars = [localize(_c.unlock_condition.extra, "poker_hands")];
            }
            else if (_c.name === "Stuntman") {
                loc_vars = [number_format(_c.unlock_condition.chips)];
            }
            else if (_c.name === "Invisible Joker") { }
            else if (_c.name === "Brainstorm") { }
            else if (_c.name === "Satellite") {
                loc_vars = [_c.unlock_condition.extra];
            }
            else if (_c.name === "Shoot the Moon") { }
            else if (_c.name === "Driver's License") {
                loc_vars = [_c.unlock_condition.extra.count];
            }
            else if (_c.name === "Cartomancer") {
                loc_vars = [_c.unlock_condition.tarot_count];
            }
            else if (_c.name === "Astronomer") { }
            else if (_c.name === "Burnt Joker") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_cards_sold];
            }
            else if (_c.name === "Bootstraps") {
                loc_vars = [_c.unlock_condition.extra.count];
            }
            else if (_c.name === "Overstock Plus") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_shop_dollars_spent];
            }
            else if (_c.name === "Liquidation") {
                loc_vars = [_c.unlock_condition.extra];
            }
            else if (_c.name === "Tarot Tycoon") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_tarots_bought];
            }
            else if (_c.name === "Planet Tycoon") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_planets_bought];
            }
            else if (_c.name === "Glow Up") {
                loc_vars = [_c.unlock_condition.extra];
            }
            else if (_c.name === "Reroll Glut") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_shop_rerolls];
            }
            else if (_c.name === "Omen Globe") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_tarot_reading_used];
            }
            else if (_c.name === "Observatory") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_planetarium_used];
            }
            else if (_c.name === "Nacho Tong") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_cards_played];
            }
            else if (_c.name === "Recyclomancy") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_cards_discarded];
            }
            else if (_c.name === "Money Tree") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_round_interest_cap_streak];
            }
            else if (_c.name === "Antimatter") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].voucher_usage.v_blank && G.PROFILES[G.SETTINGS.profile].voucher_usage.v_blank.count || 0];
            }
            else if (_c.name === "Illusion") {
                loc_vars = [_c.unlock_condition.extra, G.PROFILES[G.SETTINGS.profile].career_stats.c_playing_cards_bought];
            }
            else if (_c.name === "Petroglyph") {
                loc_vars = [_c.unlock_condition.extra];
            }
            else if (_c.name === "Retcon") {
                loc_vars = [_c.unlock_condition.extra];
            }
            else if (_c.name === "Palette") {
                loc_vars = [_c.unlock_condition.extra];
            }
            if (_c.rarity && _c.rarity === 4 && specific_vars && !specific_vars.not_hidden) {
                localize({ type: "unlocks", key: res.key || "joker_locked_legendary", set: res.set || "Other", nodes: desc_nodes, vars: loc_vars, text_colour: res.text_colour, scale: res.scale });
            }
            else {
                localize({ type: "unlocks", key: res.key || _c.key, set: res.set || _c.set, nodes: desc_nodes, vars: loc_vars, text_colour: res.text_colour, scale: res.scale });
            }
        }
    }
    else if (hide_desc) {
        localize({ type: "other", key: "undiscovered_" + string.lower(_c.set), set: _c.set, nodes: desc_nodes });
    }
    else if (_c.generate_ui && type(_c.generate_ui) === "function") {
        _c.generate_ui(info_queue, card, desc_nodes, specific_vars, full_UI_table);
        if (specific_vars && specific_vars.pinned) {
            info_queue[info_queue.length + 1] = { key: "pinned_left", set: "Other" };
        }
        if (specific_vars && specific_vars.sticker) {
            info_queue[info_queue.length + 1] = { key: string.lower(specific_vars.sticker) + "_sticker", set: "Other" };
        }
    }
    else if (specific_vars && specific_vars.debuffed) {
        localize({ type: "other", key: "debuffed_" + (specific_vars.playing_card && "playing_card" || "default"), nodes: desc_nodes });
    }
    else if (_c.set === "Joker") {
        if (!card) {
            let ability = copy_table(cfg);
            ability.set = "Joker";
            ability.name = _c.name;
            let ret = [Card.generate_UIBox_ability_table({ ability: ability, config: { center: _c }, bypass_lock: true }, true)];
            specific_vars = ret[1];
            if (ret[2]) {
                desc_nodes[desc_nodes.length + 1] = ret[2];
            }
            main_end = ret[3];
        }
        if (_c.name === "Stone Joker" || _c.name === "Marble Joker") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.m_stone;
        }
        else if (_c.name === "Steel Joker") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.m_steel;
        }
        else if (_c.name === "Glass Joker") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.m_glass;
        }
        else if (_c.name === "Golden Ticket") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.m_gold;
        }
        else if (_c.name === "Lucky Cat") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.m_lucky;
        }
        else if (_c.name === "Midas Mask") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.m_gold;
        }
        else if (_c.name === "Invisible Joker") {
            if (G.jokers && G.jokers.cards) {
                for (const [k, v] of ipairs(G.jokers.cards)) {
                    if (v.edition && v.edition.negative && G.localization.descriptions.Other.remove_negative) {
                        main_end = {};
                        localize({ type: "other", key: "remove_negative", nodes: main_end, vars: {} });
                        main_end = main_end[1];
                        break;
                    }
                }
            }
        }
        else if (_c.name === "Diet Cola") {
            info_queue[info_queue.length + 1] = { key: "tag_double", set: "Tag" };
        }
        else if (_c.name === "Perkeo") {
            info_queue[info_queue.length + 1] = { key: "e_negative_consumable", set: "Edition", config: { extra: 1 } };
        }
        if (specific_vars && specific_vars.pinned) {
            info_queue[info_queue.length + 1] = { key: "pinned_left", set: "Other" };
        }
        if (specific_vars && specific_vars.sticker) {
            info_queue[info_queue.length + 1] = { key: string.lower(specific_vars.sticker) + "_sticker", set: "Other" };
        }
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: specific_vars || {} });
    }
    else if (_c.set === "Tag") {
        specific_vars = specific_vars || Tag.get_uibox_table({ name: _c.name, config: cfg, ability: { orbital_hand: "[" + (localize("k_poker_hand") + "]") } }, undefined, true);
        if (_c.name === "Negative Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_negative;
        }
        else if (_c.name === "Foil Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_foil;
        }
        else if (_c.name === "Holographic Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_holo;
        }
        else if (_c.name === "Polychrome Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_polychrome;
        }
        else if (_c.name === "Charm Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.p_arcana_mega_1;
        }
        else if (_c.name === "Meteor Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.p_celestial_mega_1;
        }
        else if (_c.name === "Ethereal Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.p_spectral_normal_1;
        }
        else if (_c.name === "Standard Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.p_standard_mega_1;
        }
        else if (_c.name === "Buffoon Tag") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.p_buffoon_mega_1;
        }
        localize({ type: "descriptions", key: _c.key, set: "Tag", nodes: desc_nodes, vars: specific_vars || {} });
    }
    else if (_c.set === "Voucher") {
        if (_c.name === "Overstock" || _c.name === "Overstock Plus") { }
        else if (_c.name === "Tarot Merchant" || _c.name === "Tarot Tycoon") {
            loc_vars = [cfg.extra_disp];
        }
        else if (_c.name === "Planet Merchant" || _c.name === "Planet Tycoon") {
            loc_vars = [cfg.extra_disp];
        }
        else if (_c.name === "Hone" || _c.name === "Glow Up") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Reroll Surplus" || _c.name === "Reroll Glut") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Grabber" || _c.name === "Nacho Tong") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Wasteful" || _c.name === "Recyclomancy") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Seed Money" || _c.name === "Money Tree") {
            loc_vars = [cfg.extra / 5];
        }
        else if (_c.name === "Blank" || _c.name === "Antimatter") { }
        else if (_c.name === "Hieroglyph" || _c.name === "Petroglyph") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Director's Cut" || _c.name === "Retcon") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Paint Brush" || _c.name === "Palette") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Telescope" || _c.name === "Observatory") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Clearance Sale" || _c.name === "Liquidation") {
            loc_vars = [cfg.extra];
        }
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: _c.vars || loc_vars });
    }
    else if (_c.set === "Edition") {
        loc_vars = [cfg.extra];
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: _c.vars || loc_vars });
    }
    else if (_c.set === "Default" && specific_vars) {
        if (specific_vars.nominal_chips) {
            localize({ type: "other", key: "card_chips", nodes: desc_nodes, vars: [specific_vars.nominal_chips] });
        }
        if (specific_vars.bonus_chips) {
            localize({ type: "other", key: "card_extra_chips", nodes: desc_nodes, vars: [specific_vars.bonus_chips] });
        }
    }
    else if (_c.set === "Enhanced") {
        if (specific_vars && _c.name !== "Stone Card" && specific_vars.nominal_chips) {
            localize({ type: "other", key: "card_chips", nodes: desc_nodes, vars: [specific_vars.nominal_chips] });
        }
        if (_c.effect === "Mult Card") {
            loc_vars = [cfg.mult];
        }
        else if (_c.effect === "Wild Card") { }
        else if (_c.effect === "Glass Card") {
            loc_vars = [cfg.Xmult, G.GAME.probabilities.normal, cfg.extra];
        }
        else if (_c.effect === "Steel Card") {
            loc_vars = [cfg.h_x_mult];
        }
        else if (_c.effect === "Stone Card") {
            loc_vars = [specific_vars && specific_vars.bonus_chips || cfg.bonus];
        }
        else if (_c.effect === "Gold Card") {
            loc_vars = [cfg.h_dollars];
        }
        else if (_c.effect === "Lucky Card") {
            loc_vars = [G.GAME.probabilities.normal, cfg.mult, 5, cfg.p_dollars, 15];
        }
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: _c.vars || loc_vars });
        if (_c.name !== "Stone Card" && (specific_vars && specific_vars.bonus_chips || cfg.bonus !== 0 && cfg.bonus)) {
            localize({ type: "other", key: "card_extra_chips", nodes: desc_nodes, vars: [specific_vars && specific_vars.bonus_chips || cfg.bonus] });
        }
    }
    else if (_c.set === "Booster") {
        let desc_override = "p_arcana_normal";
        if (_c.name === "Arcana Pack") {
            desc_override = "p_arcana_normal";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Jumbo Arcana Pack") {
            desc_override = "p_arcana_jumbo";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Mega Arcana Pack") {
            desc_override = "p_arcana_mega";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Celestial Pack") {
            desc_override = "p_celestial_normal";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Jumbo Celestial Pack") {
            desc_override = "p_celestial_jumbo";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Mega Celestial Pack") {
            desc_override = "p_celestial_mega";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Spectral Pack") {
            desc_override = "p_spectral_normal";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Jumbo Spectral Pack") {
            desc_override = "p_spectral_jumbo";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Mega Spectral Pack") {
            desc_override = "p_spectral_mega";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Standard Pack") {
            desc_override = "p_standard_normal";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Jumbo Standard Pack") {
            desc_override = "p_standard_jumbo";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Mega Standard Pack") {
            desc_override = "p_standard_mega";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Buffoon Pack") {
            desc_override = "p_buffoon_normal";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Jumbo Buffoon Pack") {
            desc_override = "p_buffoon_jumbo";
            loc_vars = [cfg.choose, cfg.extra];
        }
        else if (_c.name === "Mega Buffoon Pack") {
            desc_override = "p_buffoon_mega";
            loc_vars = [cfg.choose, cfg.extra];
        }
        name_override = desc_override;
        if (!full_UI_table.name) {
            full_UI_table.name = localize({ type: "name", set: "Other", key: name_override, nodes: full_UI_table.name });
        }
        localize({ type: "other", key: desc_override, nodes: desc_nodes, vars: loc_vars });
    }
    else if (_c.set === "Spectral") {
        if (_c.name === "Familiar" || _c.name === "Grim" || _c.name === "Incantation") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "Immolate") {
            loc_vars = [cfg.extra.destroy, cfg.extra.dollars];
        }
        else if (_c.name === "Hex") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_polychrome;
        }
        else if (_c.name === "Talisman") {
            info_queue[info_queue.length + 1] = G.P_SEALS["gold_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["gold_seal"] || ""];
        }
        else if (_c.name === "Deja Vu") {
            info_queue[info_queue.length + 1] = G.P_SEALS["red_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["red_seal"] || ""];
        }
        else if (_c.name === "Trance") {
            info_queue[info_queue.length + 1] = G.P_SEALS["blue_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["blue_seal"] || ""];
        }
        else if (_c.name === "Medium") {
            info_queue[info_queue.length + 1] = G.P_SEALS["purple_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["purple_seal"] || ""];
        }
        else if (_c.name === "Ankh") {
            if (G.jokers && G.jokers.cards) {
                for (const [k, v] of ipairs(G.jokers.cards)) {
                    if (v.edition && v.edition.negative && G.localization.descriptions.Other.remove_negative) {
                        info_queue[info_queue.length + 1] = G.P_CENTERS.e_negative;
                        main_end = {};
                        localize({ type: "other", key: "remove_negative", nodes: main_end, vars: {} });
                        main_end = main_end[1];
                        break;
                    }
                }
            }
        }
        else if (_c.name === "Cryptid") {
            loc_vars = [cfg.extra];
        }
        if (_c.name === "Ectoplasm") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_negative;
            loc_vars = [G.GAME.ecto_minus || 1];
        }
        if (_c.name === "Aura") {
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_foil;
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_holo;
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_polychrome;
        }
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: _c.vars || loc_vars });
    }
    else if (_c.set === "Planet") {
        loc_vars = { [1]: G.GAME.hands[cfg.hand_type].level, [2]: localize(cfg.hand_type, "poker_hands"), [3]: G.GAME.hands[cfg.hand_type].l_mult, [4]: G.GAME.hands[cfg.hand_type].l_chips, colours: [G.GAME.hands[cfg.hand_type].level === 1 && G.C.UI.TEXT_DARK || G.C.HAND_LEVELS[math.min(7, G.GAME.hands[cfg.hand_type].level)]] };
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: _c.vars || loc_vars });
    }
    else if (_c.set === "Tarot") {
        if (_c.name === "The Fool") {
            let fool_c = G.GAME.last_tarot_planet && G.P_CENTERS[G.GAME.last_tarot_planet] || undefined;
            let last_tarot_planet = fool_c && localize({ type: "name_text", key: fool_c.key, set: fool_c.set }) || localize("k_none");
            let colour = (!fool_c || fool_c.name === "The Fool") && G.C.RED || G.C.GREEN;
            main_end = [{ n: G.UIT.C, config: { align: "bm", padding: 0.02 }, nodes: [{ n: G.UIT.C, config: { align: "m", colour: colour, r: 0.05, padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: " " + (last_tarot_planet + " "), colour: G.C.UI.TEXT_LIGHT, scale: 0.3, shadow: true } }] }] }];
            loc_vars = [last_tarot_planet];
            if (!(!fool_c || fool_c.name === "The Fool")) {
                info_queue[info_queue.length + 1] = fool_c;
            }
        }
        else if (_c.name === "The Magician") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The High Priestess") {
            loc_vars = [cfg.planets];
        }
        else if (_c.name === "The Empress") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The Emperor") {
            loc_vars = [cfg.tarots];
        }
        else if (_c.name === "The Hierophant") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The Lovers") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The Chariot") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "Justice") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The Hermit") {
            loc_vars = [cfg.extra];
        }
        else if (_c.name === "The Wheel of Fortune") {
            loc_vars = [G.GAME.probabilities.normal, cfg.extra];
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_foil;
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_holo;
            info_queue[info_queue.length + 1] = G.P_CENTERS.e_polychrome;
        }
        else if (_c.name === "Strength") {
            loc_vars = [cfg.max_highlighted];
        }
        else if (_c.name === "The Hanged Man") {
            loc_vars = [cfg.max_highlighted];
        }
        else if (_c.name === "Death") {
            loc_vars = [cfg.max_highlighted];
        }
        else if (_c.name === "Temperance") {
            let _money = 0;
            if (G.jokers) {
                for (let i = 1; i <= G.jokers.cards.length; i++) {
                    if (G.jokers.cards[i].ability.set === "Joker") {
                        _money = _money + G.jokers.cards[i].sell_cost;
                    }
                }
            }
            loc_vars = [cfg.extra, math.min(cfg.extra, _money)];
        }
        else if (_c.name === "The Devil") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The Tower") {
            loc_vars = [cfg.max_highlighted, localize({ type: "name_text", set: "Enhanced", key: cfg.mod_conv })];
            info_queue[info_queue.length + 1] = G.P_CENTERS[cfg.mod_conv];
        }
        else if (_c.name === "The Star") {
            loc_vars = { [1]: cfg.max_highlighted, [2]: localize(cfg.suit_conv, "suits_plural"), colours: [G.C.SUITS[cfg.suit_conv]] };
        }
        else if (_c.name === "The Moon") {
            loc_vars = { [1]: cfg.max_highlighted, [2]: localize(cfg.suit_conv, "suits_plural"), colours: [G.C.SUITS[cfg.suit_conv]] };
        }
        else if (_c.name === "The Sun") {
            loc_vars = { [1]: cfg.max_highlighted, [2]: localize(cfg.suit_conv, "suits_plural"), colours: [G.C.SUITS[cfg.suit_conv]] };
        }
        else if (_c.name === "Judgement") { }
        else if (_c.name === "The World") {
            loc_vars = { [1]: cfg.max_highlighted, [2]: localize(cfg.suit_conv, "suits_plural"), colours: [G.C.SUITS[cfg.suit_conv]] };
        }
        localize({ type: "descriptions", key: _c.key, set: _c.set, nodes: desc_nodes, vars: _c.vars || loc_vars });
    }
    if (main_end) {
        desc_nodes[desc_nodes.length + 1] = main_end;
    }
    if (card_type === "Default" || card_type === "Enhanced" && !_c.replace_base_card && card && card.base) {
        if (!_c.no_suit) {
            let suit = SMODS.Suits[card.base.suit] || {};
            if (suit.loc_vars && type(suit.loc_vars) === "function") {
                suit.loc_vars(info_queue, card);
            }
        }
        if (!_c.no_rank) {
            let rank = SMODS.Ranks[card.base.value] || {};
            if (rank.loc_vars && type(rank.loc_vars) === "function") {
                rank.loc_vars(info_queue, card);
            }
        }
    }
    if (!(specific_vars && !specific_vars.sticker && (card_type === "Default" || card_type === "Enhanced"))) {
        if (desc_nodes === full_UI_table.main && !full_UI_table.name) {
            localize({ type: "name", key: _c.key, set: _c.set, nodes: full_UI_table.name });
            if (!full_UI_table.name) {
                full_UI_table.name = {};
            }
        }
        else if (desc_nodes !== full_UI_table.main && !desc_nodes.name) {
            desc_nodes.name = localize({ type: "name_text", key: name_override || _c.key, set: name_override && "Other" || _c.set });
        }
    }
    if (first_pass && !(_c.set === "Edition") && badges) {
        for (const [k, v] of ipairs(badges)) {
            v = v === "holographic" && "holo" || v;
            if (v.sub(1, 9) === "negative_") {
                info_queue[info_queue.length + 1] = { key: "e_" + v, set: "Edition", config: { extra: G.P_CENTERS["e_negative"].config.card_limit } };
            }
            if (G.P_CENTERS[v] && G.P_CENTERS[v].set === "Edition") {
                info_queue[info_queue.length + 1] = G.P_CENTERS[v];
            }
            if (G.P_CENTERS["e_" + v] && G.P_CENTERS["e_" + v].set === "Edition") {
                let t = { key: "e_" + v, set: "Edition", config: {} };
                info_queue[info_queue.length + 1] = t;
                if (G.P_CENTERS["e_" + v].loc_vars && type(G.P_CENTERS["e_" + v].loc_vars) === "function") {
                    let res = G.P_CENTERS["e_" + v].loc_vars(info_queue, card) || {};
                    t.vars = res.vars;
                    t.key = res.key || t.key;
                    t.set = res.set || t.set;
                }
            }
            let seal = G.P_SEALS[v] || G.P_SEALS[SMODS.Seal.badge_to_key[v] || ""];
            if (seal) {
                info_queue[info_queue.length + 1] = seal;
            }
            else {
                if (v === "gold_seal") {
                    info_queue[info_queue.length + 1] = G.P_SEALS["gold_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["gold_seal"] || ""];
                }
                if (v === "blue_seal") {
                    info_queue[info_queue.length + 1] = G.P_SEALS["blue_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["blue_seal"] || ""];
                }
                if (v === "red_seal") {
                    info_queue[info_queue.length + 1] = G.P_SEALS["red_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["red_seal"] || ""];
                }
                if (v === "purple_seal") {
                    info_queue[info_queue.length + 1] = G.P_SEALS["purple_seal"] || G.P_SEALS[SMODS.Seal.badge_to_key["purple_seal"] || ""];
                }
            }
            let sticker = SMODS.Stickers[v];
            if (sticker) {
                let t = { key: v, set: "Other" };
                let res = {};
                if (sticker.loc_vars && type(sticker.loc_vars) === "function") {
                    res = sticker.loc_vars(info_queue, card) || {};
                    t.vars = res.vars || {};
                    t.key = res.key || t.key;
                    t.set = res.set || t.set;
                }
                info_queue[info_queue.length + 1] = t;
            }
            else {
                if (v === "eternal") {
                    info_queue[info_queue.length + 1] = { key: "eternal", set: "Other" };
                }
                if (v === "perishable") {
                    info_queue[info_queue.length + 1] = { key: "perishable", set: "Other", vars: [G.GAME.perishable_rounds || 1, specific_vars.perish_tally || G.GAME.perishable_rounds] };
                }
                if (v === "rental") {
                    info_queue[info_queue.length + 1] = { key: "rental", set: "Other", vars: [G.GAME.rental_rate || 1] };
                }
            }
            if (v === "pinned_left") {
                info_queue[info_queue.length + 1] = { key: "pinned_left", set: "Other" };
            }
        }
    }
    SMODS.compat_0_9_8.generate_UIBox_ability_table_card = undefined;
    for (const [_, v] of ipairs(info_queue)) {
        generate_card_ui(v, full_UI_table);
    }
    return full_UI_table;
}