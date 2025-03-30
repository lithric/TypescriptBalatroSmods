///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

G.UIDEF = {};
function create_UIBox_debug_tools(): void {
    G.debug_tool_config = G.debug_tool_config || {};
    G.FUNCS.DT_add_money = function () {
        if (G.STAGE === G.STAGES.RUN) {
            ease_dollars(10);
        }
    };
    G.FUNCS.DT_add_round = function () {
        if (G.STAGE === G.STAGES.RUN) {
            ease_round(1);
        }
    };
    G.FUNCS.DT_add_ante = function () {
        if (G.STAGE === G.STAGES.RUN) {
            ease_ante(1);
        }
    };
    G.FUNCS.DT_add_hand = function () {
        if (G.STAGE === G.STAGES.RUN) {
            ease_hands_played(1);
        }
    };
    G.FUNCS.DT_add_discard = function () {
        if (G.STAGE === G.STAGES.RUN) {
            ease_discard(1);
        }
    };
    G.FUNCS.DT_reroll_boss = function () {
        if (G.STAGE === G.STAGES.RUN && G.blind_select_opts) {
            G.from_boss_tag = true;
            G.FUNCS.reroll_boss();
            G.from_boss_tag = undefined;
        }
    };
    G.FUNCS.DT_toggle_background = function () {
        G.debug_background_toggle = !G.debug_background_toggle;
    };
    G.FUNCS.DT_add_chips = function () {
        if (G.STAGE === G.STAGES.RUN) {
            update_hand_text({ delay: 0 }, { chips: 10 + G.GAME.current_round.current_hand.chips });
            play_sound("chips1");
        }
    };
    G.FUNCS.DT_add_mult = function () {
        if (G.STAGE === G.STAGES.RUN) {
            update_hand_text({ delay: 0 }, { mult: 10 + G.GAME.current_round.current_hand.mult });
            play_sound("multhit1");
        }
    };
    G.FUNCS.DT_x_chips = function () {
        if (G.STAGE === G.STAGES.RUN) {
            update_hand_text({ delay: 0 }, { chips: 2 * G.GAME.current_round.current_hand.chips });
            play_sound("chips1");
        }
    };
    G.FUNCS.DT_x_mult = function () {
        if (G.STAGE === G.STAGES.RUN) {
            update_hand_text({ delay: 0 }, { mult: 10 * G.GAME.current_round.current_hand.mult });
            play_sound("multhit2");
        }
    };
    G.FUNCS.DT_chip_mult_reset = function () {
        if (G.STAGE === G.STAGES.RUN) {
            update_hand_text({ delay: 0 }, { mult: 0, chips: 0 });
        }
    };
    G.FUNCS.DT_win_game = function () {
        if (G.STAGE === G.STAGES.RUN) {
            win_game();
        }
    };
    G.FUNCS.DT_lose_game = function () {
        if (G.STAGE === G.STAGES.RUN) {
            G.STATE = G.STATES.GAME_OVER;
            G.STATE_COMPLETE = false;
        }
    };
    G.FUNCS.DT_jimbo_toggle = function () {
        if (G.DT_jimbo) {
            if (G.DT_jimbo.children.particles.states.visible) {
                if (G.DT_jimbo.children.card.states.visible) {
                    G.DT_jimbo.children.card.states.visible = false;
                }
                else {
                    G.DT_jimbo.children.card.states.visible = true;
                    G.DT_jimbo.children.particles.states.visible = false;
                }
            }
            else {
                G.DT_jimbo.remove();
                G.DT_jimbo = undefined;
                if (G.SPLASH_LOGO) {
                    G.SPLASH_LOGO.states.visible = true;
                    if (G.title_top && G.title_top.cards[1]) {
                        G.title_top.cards[1].states.visible = true;
                    }
                }
            }
        }
        else {
            if (G.SPLASH_LOGO) {
                G.SPLASH_LOGO.states.visible = false;
                if (G.title_top && G.title_top.cards[1]) {
                    G.title_top.cards[1].states.visible = false;
                }
            }
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, blockable: false, func: function () {
                    G.DT_jimbo = Card_Character({ x: G.ROOM.T.w / 2, y: G.ROOM.T.h / 2 });
                    G.DT_jimbo.set_alignment({ major: G.ROOM_ATTACH, type: "cm" });
                    return true;
                } }));
        }
    };
    G.FUNCS.DT_jimbo_talk = function () {
        if (G.DT_jimbo) {
            G.DT_jimbo.add_speech_bubble(["                             ", "           ", "           "], "cr");
            G.DT_jimbo.say_stuff(4);
        }
    };
    let t = { n: G.UIT.ROOT, config: { align: "cm", r: 0.1 }, nodes: [UIBox_dyn_container([{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "While in collection, hover over a card", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "and press the following keys:", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.BLUE, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: "[1] Unlock", scale: 0.25, colour: G.C.WHITE } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.BLUE, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: "[2] Discover", scale: 0.25, colour: G.C.WHITE } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.BLUE, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: "[3] Spawn", scale: 0.25, colour: G.C.WHITE } }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "Hover over any Joker/Playing card", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "and press [Q] to cycle Edition", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "Press [H] to isolate background", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "Press [J] to play splash animation", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "Press [8] to toggle cursor", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: "Press [9] to toggle all tooltips", scale: 0.25, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.15 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.15 }, nodes: [UIBox_button({ label: ["$10"], button: "DT_add_money", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["+1 Round"], button: "DT_add_round", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["+1 Ante"], button: "DT_add_ante", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["+1 Hand"], button: "DT_add_hand", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["+1 Discard"], button: "DT_add_discard", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Boss Reroll"], button: "DT_reroll_boss", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Background"], button: "DT_toggle_background", minw: 1.7, minh: 0.4, scale: 0.35 })] }, { n: G.UIT.C, config: { align: "cm", padding: 0.15 }, nodes: [UIBox_button({ label: ["+10 chips"], button: "DT_add_chips", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["+10 mult"], button: "DT_add_mult", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["X2 chips"], button: "DT_x_chips", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["X10 mult"], button: "DT_x_mult", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Win this Run"], button: "DT_win_game", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Lose this Run"], button: "DT_lose_game", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Reset"], button: "DT_chip_mult_reset", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Jimbo"], button: "DT_jimbo_toggle", minw: 1.7, minh: 0.4, scale: 0.35 }), UIBox_button({ label: ["Jimbo talk"], button: "DT_jimbo_talk", minw: 1.7, minh: 0.4, scale: 0.35 })] }] }], true)] };
    return t;
}
function create_UIBox_notify_alert(_achievement, _type): void {
    let [_c, _atlas] = [G.P_CENTERS[_achievement], _type === "Joker" && G.ASSET_ATLAS["Joker"] || _type === "Voucher" && G.ASSET_ATLAS["Voucher"] || _type === "Back" && G.ASSET_ATLAS["centers"] || G.ASSET_ATLAS["icons"]];
    let _smods_atlas = _c && (G.SETTINGS.colourblind_option && _c.hc_atlas || _c.lc_atlas || _c.atlas);
    if (_smods_atlas) {
        _atlas = G.ASSET_ATLAS[_smods_atlas] || _atlas;
    }
    if (SMODS.Achievements[_achievement]) {
        _c = SMODS.Achievements[_achievement];
        _atlas = G.ASSET_ATLAS[_c.atlas];
    }
    let t_s = new Sprite(0, 0, 1.5 * (_atlas.px / _atlas.py), 1.5, _atlas, _c && _c.pos || { x: 3, y: 0 });
    t_s.states.drag.can = false;
    t_s.states.hover.can = false;
    t_s.states.collide.can = false;
    let subtext = _type === "achievement" && localize(G.F_TROPHIES && "k_trophy" || "k_achievement") || _type === "Joker" && localize("k_joker") || _type === "Voucher" && localize("k_voucher") || _type === "Back" && localize("k_deck") || "ERROR";
    if (_achievement === "b_challenge") {
        subtext = localize("k_challenges");
    }
    let name = _type === "achievement" && localize(_achievement, "achievement_names") || "ERROR";
    let t = { n: G.UIT.ROOT, config: { align: "cl", r: 0.1, padding: 0.06, colour: G.C.UI.TRANSPARENT_DARK }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0.2, minw: 20, r: 0.1, colour: G.C.BLACK, outline: 1.5, outline_colour: G.C.GREY }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1 }, nodes: [{ n: G.UIT.O, config: { object: t_s } }] }, _type !== "achievement" && { n: G.UIT.R, config: { align: "cm", padding: 0.04 }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 3.4 }, nodes: [{ n: G.UIT.T, config: { text: subtext, scale: 0.5, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 3.4 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_unlocked_ex"), scale: 0.35, colour: G.C.FILTER, shadow: true } }] }] } || { n: G.UIT.R, config: { align: "cm", padding: 0.04 }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 3.4, padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: name, scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 3.4 }, nodes: [{ n: G.UIT.T, config: { text: subtext, scale: 0.3, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 3.4 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_unlocked_ex"), scale: 0.35, colour: G.C.FILTER, shadow: true } }] }] }] }] }] };
    return t;
}
function create_UIBox_online_high_scores(): void {
    G.HTTP_MANAGER.out_channel.push({ get_score: true });
    let [padding, col, minw] = [0.05, G.C.UI.TRANSPARENT_DARK, 0];
    let t = { n: G.UIT.ROOT, config: { align: "cm", minw: minw, r: 0.1, colour: col, padding: padding }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.BLACK }, nodes: {} }] };
    return t;
}
function create_UIBox_high_scores_filling(_resp): void {
    let scores = {};
    _resp = assert(loadstring(_resp))();
    if (!_resp) {
        return { n: G.UIT.ROOT, config: { align: "cm", r: 0.1, colour: G.C.L_BLACK, padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, minh: 1.3 }, nodes: [{ n: G.UIT.T, config: { text: "ERROR", scale: 0.9, colour: G.C.RED, shadow: true } }] }] };
    }
    for (let i = 1; i <= 6; i++) {
        let v = _resp[i] || { username: "-" };
        v.score = v.score && math.floor(v.score) || undefined;
        let name_col = v.username === (G.SETTINGS.COMP && G.SETTINGS.COMP.name || undefined) && G.C.FILTER || G.C.WHITE;
        scores[scores.length + 1] = { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cl", padding: 0, minw: 0.3 }, nodes: [{ n: G.UIT.T, config: { text: i + ".", scale: 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cl", padding: 0, minw: 1.7, maxw: 1.6 }, nodes: [{ n: G.UIT.T, config: { text: v.username, scale: math.min(0.6, 8 * 0.56 / v.username.len()), colour: v.score && name_col || G.C.UI.TRANSPARENT_LIGHT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cl", minh: 0.8, r: 0.1, minw: 2.5, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: 2.6 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [type(v.score) === "number" && number_format(v.score) || ""], colours: [G.C.RED], shadow: true, float: true, maxw: 2.5, scale: math.min(0.75, score_number_scale(1.5, v.score)) }) } }] }] }] }] };
    }
    return { n: G.UIT.ROOT, config: { align: "cm", r: 0.1, colour: G.C.L_BLACK, padding: 0.05 }, nodes: scores };
}
G.UIDEF.use_and_sell_buttons = function (card) {
    let sell = undefined;
    let use = undefined;
    if (card.area && card.area.config.type === "joker") {
        sell = { n: G.UIT.C, config: { align: "cr" }, nodes: [{ n: G.UIT.C, config: { ref_table: card, align: "cr", padding: 0.1, r: 0.08, minw: 1.25, hover: true, shadow: true, colour: G.C.UI.BACKGROUND_INACTIVE, one_press: true, button: "sell_card", func: "can_sell_card" }, nodes: [{ n: G.UIT.B, config: { w: 0.1, h: 0.6 } }, { n: G.UIT.C, config: { align: "tm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 1.25 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_sell"), colour: G.C.UI.TEXT_LIGHT, scale: 0.4, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("$"), colour: G.C.WHITE, scale: 0.4, shadow: true } }, { n: G.UIT.T, config: { ref_table: card, ref_value: "sell_cost_label", colour: G.C.WHITE, scale: 0.55, shadow: true } }] }] }] }] };
    }
    if (card.ability.consumeable && booster_obj && booster_obj.select_card) {
        if (card.area === G.pack_cards && G.pack_cards) {
            return { n: G.UIT.ROOT, config: { padding: 0, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { ref_table: card, r: 0.08, padding: 0.1, align: "bm", minw: 0.5 * card.T.w - 0.15, maxw: 0.9 * card.T.w - 0.15, minh: 0.3 * card.T.h, hover: true, shadow: true, colour: G.C.UI.BACKGROUND_INACTIVE, one_press: true, button: "use_card", func: "can_select_from_booster" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_select"), colour: G.C.UI.TEXT_LIGHT, scale: 0.45, shadow: true } }] }] };
        }
    }
    if (card.ability.consumeable) {
        if (card.area === G.pack_cards && G.pack_cards) {
            return { n: G.UIT.ROOT, config: { padding: 0, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { mid: true }, nodes: {} }, { n: G.UIT.R, config: { ref_table: card, r: 0.08, padding: 0.1, align: "bm", minw: 0.5 * card.T.w - 0.15, minh: 0.8 * card.T.h, maxw: 0.7 * card.T.w - 0.15, hover: true, shadow: true, colour: G.C.UI.BACKGROUND_INACTIVE, one_press: true, button: "use_card", func: "can_use_consumeable" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_use"), colour: G.C.UI.TEXT_LIGHT, scale: 0.55, shadow: true } }] }] };
        }
        use = { n: G.UIT.C, config: { align: "cr" }, nodes: [{ n: G.UIT.C, config: { ref_table: card, align: "cr", maxw: 1.25, padding: 0.1, r: 0.08, minw: 1.25, minh: card.area && card.area.config.type === "joker" && 0 || 1, hover: true, shadow: true, colour: G.C.UI.BACKGROUND_INACTIVE, one_press: true, button: "use_card", func: "can_use_consumeable" }, nodes: [{ n: G.UIT.B, config: { w: 0.1, h: 0.6 } }, { n: G.UIT.T, config: { text: localize("b_use"), colour: G.C.UI.TEXT_LIGHT, scale: 0.55, shadow: true } }] }] };
    }
    else if (card.area && card.area === G.pack_cards) {
        return { n: G.UIT.ROOT, config: { padding: 0, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { ref_table: card, r: 0.08, padding: 0.1, align: "bm", minw: 0.5 * card.T.w - 0.15, maxw: 0.9 * card.T.w - 0.15, minh: 0.3 * card.T.h, hover: true, shadow: true, colour: G.C.UI.BACKGROUND_INACTIVE, one_press: true, button: "use_card", func: "can_select_card" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_select"), colour: G.C.UI.TEXT_LIGHT, scale: 0.45, shadow: true } }] }] };
    }
    let t = { n: G.UIT.ROOT, config: { padding: 0, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { padding: 0.15, align: "cl" }, nodes: [{ n: G.UIT.R, config: { align: "cl" }, nodes: [sell] }, { n: G.UIT.R, config: { align: "cl" }, nodes: [use] }] }] };
    return t;
};
G.UIDEF.card_focus_ui = function (card) {
    let card_width = card.T.w + (card.ability.consumeable && -0.1 || card.ability.set === "Voucher" && -0.16 || 0);
    let playing_card_colour = copy_table(G.C.WHITE);
    playing_card_colour[4] = 1.5;
    if (G.hand && card.area === G.hand) {
        ease_value(playing_card_colour, 4, -1.5, undefined, "REAL", undefined, 0.2, "quad");
    }
    let [tcnx, tcny] = [card.T.x + card.T.w / 2 - G.ROOM.T.w / 2, card.T.y + card.T.h / 2 - G.ROOM.T.h / 2];
    let base_background = new UIBox({ T: [card.VT.x, card.VT.y, 0, 0], definition: (!G.hand || card.area !== G.hand) && { n: G.UIT.ROOT, config: { align: "cm", minw: card_width + 0.3, minh: card.T.h + 0.3, r: 0.1, colour: adjust_alpha(G.C.BLACK, 0.7), outline_colour: lighten(G.C.JOKER_GREY, 0.5), outline: 1.5, line_emboss: 0.8 }, nodes: [{ n: G.UIT.R, config: { id: "ATTACH_TO_ME" }, nodes: {} }] } || { n: G.UIT.ROOT, config: { align: "cm", minw: card_width, minh: card.T.h, r: 0.1, colour: playing_card_colour }, nodes: [{ n: G.UIT.R, config: { id: "ATTACH_TO_ME" }, nodes: {} }] }, config: { align: "cm", offset: { x: 0.007 * tcnx * card.T.w, y: 0.007 * tcny * card.T.h }, parent: card, r_bond: (!G.hand || card.area !== G.hand) && "Weak" || "Strong" } });
    base_background.set_alignment = function () {
        let [cnx, cny] = [card.T.x + card.T.w / 2 - G.ROOM.T.w / 2, card.T.y + card.T.h / 2 - G.ROOM.T.h / 2];
        Moveable.set_alignment(card.children.focused_ui, { offset: { x: 0.007 * cnx * card.T.w, y: 0.007 * cny * card.T.h } });
    };
    let base_attach = base_background.get_UIE_by_ID("ATTACH_TO_ME");
    if (card.area === G.shop_jokers && G.shop_jokers) {
        let buy_and_use = undefined;
        if (card.ability.consumeable) {
            base_attach.children.buy_and_use = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "buy_and_use", func: "can_buy_and_use", button: "buy_from_shop", card_width: card_width });
            buy_and_use = true;
        }
        base_attach.children.buy = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "buy", func: "can_buy", button: "buy_from_shop", card_width: card_width, buy_and_use: buy_and_use });
    }
    if (card.area === G.shop_vouchers && G.shop_vouchers) {
        base_attach.children.redeem = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "buy", func: "can_redeem", button: "redeem_from_shop", card_width: card_width });
    }
    if (card.area === G.shop_booster && G.shop_booster) {
        base_attach.children.redeem = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "buy", func: "can_open", button: "open_booster", card_width: card_width * 0.85 });
    }
    if ((card.area === G.consumeables && G.consumeables || card.area === G.pack_cards && G.pack_cards) && card.ability.consumeable) {
        base_attach.children.use = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "use", func: "can_use_consumeable", button: "use_card", card_width: card_width });
    }
    if (card.area === G.pack_cards && G.pack_cards && !card.ability.consumeable) {
        base_attach.children.use = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "select", func: "can_select_card", button: "use_card", card_width: card_width });
    }
    if ((card.area === G.jokers && G.jokers || card.area === G.consumeables && G.consumeables) && G.STATE !== G.STATES.TUTORIAL) {
        base_attach.children.sell = G.UIDEF.card_focus_button({ card: card, parent: base_attach, type: "sell", func: "can_sell_card", button: "sell_card", card_width: card_width });
    }
    return base_background;
};
G.UIDEF.card_focus_button = function (args) {
    if (!args) {
        return;
    }
    let button_contents = {};
    if (args.type === "sell") {
        button_contents = { n: G.UIT.C, config: { align: "cl" }, nodes: [{ n: G.UIT.R, config: { align: "cl", maxw: 1 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_sell"), colour: G.C.UI.TEXT_LIGHT, scale: 0.4, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl" }, nodes: [{ n: G.UIT.T, config: { text: localize("$"), colour: G.C.WHITE, scale: 0.4, shadow: true } }, { n: G.UIT.T, config: { ref_table: args.card, ref_value: "sell_cost_label", colour: G.C.WHITE, scale: 0.55, shadow: true } }] }] };
    }
    else if (args.type === "buy") {
        button_contents = { n: G.UIT.T, config: { text: localize("b_buy"), colour: G.C.WHITE, scale: 0.5 } };
    }
    else if (args.type === "select") {
        button_contents = { n: G.UIT.T, config: { text: localize("b_select"), colour: G.C.WHITE, scale: 0.3 } };
    }
    else if (args.type === "redeem") {
        button_contents = { n: G.UIT.T, config: { text: localize("b_redeem"), colour: G.C.WHITE, scale: 0.5 } };
    }
    else if (args.type === "use") {
        button_contents = { n: G.UIT.T, config: { text: localize("b_use"), colour: G.C.WHITE, scale: 0.5 } };
    }
    else if (args.type === "buy_and_use") {
        button_contents = { n: G.UIT.C, config: { align: "cr" }, nodes: [{ n: G.UIT.R, config: { align: "cr", maxw: 1 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_buy"), colour: G.C.UI.TEXT_LIGHT, scale: 0.4, shadow: true } }] }, { n: G.UIT.R, config: { align: "cr", maxw: 1 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_and_use"), colour: G.C.WHITE, scale: 0.3, shadow: true } }] }] };
    }
    return new UIBox({ T: [args.card.VT.x, args.card.VT.y, 0, 0], definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { id: args.type === "buy_and_use" && "buy_and_use" || undefined, ref_table: args.card, ref_parent: args.parent, align: args.type === "sell" && "cl" || "cr", colour: G.C.BLACK, shadow: true, r: 0.08, func: args.func, one_press: true, button: args.button, focus_args: { type: "none" }, hover: true }, nodes: [{ n: G.UIT.R, config: { align: args.type === "sell" && "cl" || "cr", minw: 1 + (args.type === "select" && 0.1 || 0), minh: args.type === "sell" && 1.5 || 1, padding: 0.08, focus_args: { button: args.type === "sell" && "leftshoulder" || args.type === "buy_and_use" && "leftshoulder" || "rightshoulder", scale: 0.55, orientation: args.type === "sell" && "tli" || "tri", offset: { x: args.type === "sell" && 0.1 || -0.1, y: 0 }, type: "none" }, func: "set_button_pip" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.3 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm" }, nodes: [args.type !== "sell" && { n: G.UIT.C, config: { align: "cm", minw: 0.2, minh: 0.6 }, nodes: {} } || undefined, { n: G.UIT.C, config: { align: "cm", maxw: 1 }, nodes: [button_contents] }, args.type === "sell" && { n: G.UIT.C, config: { align: "cm", minw: 0.2, minh: 0.6 }, nodes: {} } || undefined] }] }] }] }, config: { align: args.type === "sell" && "cl" || "cr", offset: { x: (args.type === "sell" && -1 || 1) * ((args.card_width || 0) - 0.17 - args.card.T.w / 2), y: args.type === "buy_and_use" && 0.6 || args.buy_and_use && -0.6 || 0 }, parent: args.parent } });
};
G.UIDEF.speech_bubble = function (text_key, loc_vars) {
    let text = {};
    if (loc_vars && loc_vars.quip) {
        localize({ type: "quips", key: text_key || "lq_1", vars: loc_vars || {}, nodes: text });
    }
    else {
        localize({ type: "tutorial", key: text_key || "sb_1", vars: loc_vars || {}, nodes: text });
    }
    let row = {};
    for (const [k, v] of ipairs(text)) {
        row[row.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: v };
    }
    let t = { n: G.UIT.ROOT, config: { align: "cm", minh: 1, r: 0.3, padding: 0.07, minw: 1, colour: G.C.JOKER_GREY, shadow: true }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: 1, r: 0.2, padding: 0.1, minw: 1, colour: G.C.WHITE }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: 1, r: 0.2, padding: 0.03, minw: 1, colour: G.C.WHITE }, nodes: row }] }] };
    return t;
};
function create_UIBox_highlight(rect): void {
    let t = { n: G.UIT.ROOT, config: { align: "cm", minh: rect.T.h + 0.1, minw: rect.T.w + 0.15, r: 0.15, colour: G.C.DARK_EDITION }, nodes: {} };
    return t;
}
G.UIDEF.deck_preview = function (args) {
    let [_minh, _minw] = [0.35, 0.5];
    let suit_labels = {};
    let suit_counts = { Spades: 0, Hearts: 0, Clubs: 0, Diamonds: 0 };
    let mod_suit_counts = { Spades: 0, Hearts: 0, Clubs: 0, Diamonds: 0 };
    let mod_suit_diff = false;
    let [wheel_flipped, wheel_flipped_text] = [0, undefined];
    let flip_col = G.C.WHITE;
    let rank_counts = {};
    let deck_tables = {};
    remove_nils(G.playing_cards);
    table.sort(G.playing_cards, function (a, b) {
        return a.get_nominal("suit") > b.get_nominal("suit");
    });
    let SUITS = { Spades: {}, Hearts: {}, Clubs: {}, Diamonds: {} };
    for (const [k, v] of pairs(SUITS)) {
        for (let i = 1; i <= 14; i++) {
            SUITS[k][SUITS[k].length + 1] = {};
        }
    }
    let suit_map = ["Spades", "Hearts", "Clubs", "Diamonds"];
    let stones = undefined;
    let rank_name_mapping = ["A", "K", "Q", "J", "10", 9, 8, 7, 6, 5, 4, 3, 2];
    for (const [k, v] of ipairs(G.playing_cards)) {
        if (v.ability.effect === "Stone Card") {
            stones = stones || 0;
        }
        if (v.area && v.area === G.deck || v.ability.wheel_flipped) {
            if (v.ability.wheel_flipped) {
                wheel_flipped = wheel_flipped + 1;
            }
            if (v.ability.effect === "Stone Card") {
                stones = stones + 1;
            }
            else {
                for (const [kk, vv] of pairs(suit_counts)) {
                    if (v.base.suit === kk) {
                        suit_counts[kk] = suit_counts[kk] + 1;
                    }
                    if (v.is_suit(kk)) {
                        mod_suit_counts[kk] = mod_suit_counts[kk] + 1;
                    }
                }
                if (SUITS[v.base.suit][v.base.id]) {
                    table.insert(SUITS[v.base.suit][v.base.id], v);
                }
                rank_counts[v.base.id] = (rank_counts[v.base.id] || 0) + 1;
            }
        }
    }
    wheel_flipped_text = wheel_flipped > 0 && { n: G.UIT.T, config: { text: "?", colour: G.C.FILTER, scale: 0.25, shadow: true } } || undefined;
    flip_col = wheel_flipped_text && mix_colours(G.C.FILTER, G.C.WHITE, 0.7) || G.C.WHITE;
    suit_labels[suit_labels.length + 1] = { n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0.04, minw: _minw, minh: 2 * _minh + 0.25 }, nodes: [stones && { n: G.UIT.T, config: { text: localize("ph_deck_preview_stones") + ": ", colour: G.C.WHITE, scale: 0.25, shadow: true } } || undefined, stones && { n: G.UIT.T, config: { text: "" + stones, colour: stones > 0 && G.C.WHITE || G.C.UI.TRANSPARENT_LIGHT, scale: 0.4, shadow: true } } || undefined] };
    let _row = {};
    let _bg_col = G.C.JOKER_GREY;
    for (const [k, v] of ipairs(rank_name_mapping)) {
        let _tscale = 0.3;
        let _colour = G.C.BLACK;
        let rank_col = v === "A" && _bg_col || (v === "K" || v === "Q" || v === "J") && G.C.WHITE || _bg_col;
        rank_col = mix_colours(rank_col, _bg_col, 0.8);
        let _col = { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, minw: _minw, minh: _minh, colour: rank_col, emboss: 0.04, padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "" + v, colour: _colour, scale: 1.6 * _tscale } }] }, { n: G.UIT.R, config: { align: "cm", minw: _minw + 0.04, minh: _minh, colour: G.C.L_BLACK, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: "" + (rank_counts[15 - k] || 0), colour: flip_col, scale: _tscale, shadow: true } }] }] }] };
        table.insert(_row, _col);
    }
    table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0.04 }, nodes: _row });
    for (let j = 1; j <= 4; j++) {
        _row = {};
        _bg_col = mix_colours(G.C.SUITS[suit_map[j]], G.C.L_BLACK, 0.7);
        for (let i = 14; i <= 2; i += -1) {
            let _tscale = SUITS[suit_map[j]][i].length > 0 && 0.3 || 0.25;
            let _colour = SUITS[suit_map[j]][i].length > 0 && flip_col || G.C.UI.TRANSPARENT_LIGHT;
            let _col = { n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: _minw + 0.098, minh: _minh }, nodes: [{ n: G.UIT.T, config: { text: "" + SUITS[suit_map[j]][i].length, colour: _colour, scale: _tscale, shadow: true, lang: G.LANGUAGES["en-us"] } }] };
            table.insert(_row, _col);
        }
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0.04, minh: 0.4, colour: _bg_col }, nodes: _row });
    }
    for (const [k, v] of ipairs(suit_map)) {
        let _x = v === "Spades" && 3 || v === "Hearts" && 0 || v === "Clubs" && 2 || v === "Diamonds" && 1;
        let t_s = new Sprite(0, 0, 0.3, 0.3, G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && 2 || 1)], { x: _x, y: 1 });
        t_s.states.drag.can = false;
        t_s.states.hover.can = false;
        t_s.states.collide.can = false;
        if (mod_suit_counts[v] !== suit_counts[v]) {
            mod_suit_diff = true;
        }
        suit_labels[suit_labels.length + 1] = { n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0.03, colour: G.C.JOKER_GREY }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: _minw, minh: _minh }, nodes: [{ n: G.UIT.O, config: { can_collide: false, object: t_s } }] }, { n: G.UIT.C, config: { align: "cm", minw: _minw * 2.4, minh: _minh, colour: G.C.L_BLACK, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: "" + suit_counts[v], colour: flip_col, scale: 0.3, shadow: true, lang: G.LANGUAGES["en-us"] } }, mod_suit_counts[v] !== suit_counts[v] && { n: G.UIT.T, config: { text: " (" + (mod_suit_counts[v] + ")"), colour: mix_colours(G.C.BLUE, G.C.WHITE, 0.7), scale: 0.28, shadow: true, lang: G.LANGUAGES["en-us"] } } || undefined] }] };
    }
    let t = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.JOKER_GREY, r: 0.1, emboss: 0.05, padding: 0.07 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, emboss: 0.05, colour: G.C.BLACK, padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.04 }, nodes: suit_labels }, { n: G.UIT.C, config: { align: "cm", padding: 0.02 }, nodes: deck_tables }] }, mod_suit_diff && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { padding: 0.3, r: 0.1, colour: mix_colours(G.C.BLUE, G.C.WHITE, 0.7) }, nodes: {} }, { n: G.UIT.T, config: { text: " " + localize("ph_deck_preview_effective"), colour: G.C.WHITE, scale: 0.3 } }] } || undefined, wheel_flipped_text && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { padding: 0.3, r: 0.1, colour: flip_col }, nodes: {} }, { n: G.UIT.T, config: { text: " " + (wheel_flipped > 1 && localize({ type: "variable", key: "deck_preview_wheel_plural", vars: [wheel_flipped] }) || localize({ type: "variable", key: "deck_preview_wheel_singular", vars: [wheel_flipped] })), colour: G.C.WHITE, scale: 0.3 } }] } || undefined] }] };
    return t;
};
function create_UIBox_character_button(args): void {
    let button = args.button || "NONE";
    let func = args.func || undefined;
    let colour = args.colour || G.C.RED;
    let update_func = args.update_func || undefined;
    let t = { n: G.UIT.ROOT, config: { align: "cm", padding: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "tm", minw: 1.9, padding: 0.2, minh: 1.2, r: 0.1, hover: true, colour: colour, button: func, func: update_func, shadow: true, maxw: args.maxw }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: button, scale: 0.55, colour: G.C.UI.TEXT_LIGHT, focus_args: { button: "x", orientation: "bm" }, func: "set_button_pip" } }] }] }] };
    return t;
}
G.UIDEF.shop = function () {
    G.shop_jokers = CardArea(G.hand.T.x + 0, G.hand.T.y + G.ROOM.T.y + 9, G.GAME.shop.joker_max * 1.02 * G.CARD_W, 1.05 * G.CARD_H, { card_limit: G.GAME.shop.joker_max, type: "shop", highlight_limit: 1 });
    G.shop_vouchers = CardArea(G.hand.T.x + 0, G.hand.T.y + G.ROOM.T.y + 9, 2.1 * G.CARD_W, 1.05 * G.CARD_H, { card_limit: 1, type: "shop", highlight_limit: 1 });
    G.shop_booster = CardArea(G.hand.T.x + 0, G.hand.T.y + G.ROOM.T.y + 9, 2.4 * G.CARD_W, 1.15 * G.CARD_H, { card_limit: 2, type: "shop", highlight_limit: 1, card_w: 1.27 * G.CARD_W });
    let shop_sign =new AnimatedSprite(0, 0, 4.4, 2.2, G.ANIMATION_ATLAS["shop_sign"]);
    shop_sign.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
    G.SHOP_SIGN = new UIBox({ definition: { n: G.UIT.ROOT, config: { colour: G.C.DYN_UI.MAIN, emboss: 0.05, align: "cm", r: 0.1, padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, minw: 4.72, minh: 3.1, colour: G.C.DYN_UI.DARK, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: shop_sign } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_improve_run")], colours: [lighten(G.C.GOLD, 0.3)], shadow: true, rotate: true, float: true, bump: true, scale: 0.5, spacing: 1, pop_in: 1.5, maxw: 4.3 }) } }] }] }] }, config: { align: "cm", offset: { x: 0, y: -15 }, major: G.HUD.get_UIE_by_ID("row_blind"), bond: "Weak" } });
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            G.SHOP_SIGN.alignment.offset.y = 0;
            return true;
        } }));
    let t = { n: G.UIT.ROOT, config: { align: "cl", colour: G.C.CLEAR }, nodes: [UIBox_dyn_container([{ n: G.UIT.C, config: { align: "cm", padding: 0.1, emboss: 0.05, r: 0.1, colour: G.C.DYN_UI.BOSS_MAIN }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { id: "next_round_button", align: "cm", minw: 2.8, minh: 1.5, r: 0.15, colour: G.C.RED, one_press: true, button: "toggle_shop", hover: true, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.07, focus_args: { button: "y", orientation: "cr" }, func: "set_button_pip" }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 1.3 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_next_round_1"), scale: 0.4, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 1.3 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_next_round_2"), scale: 0.4, colour: G.C.WHITE, shadow: true } }] }] }] }, { n: G.UIT.R, config: { align: "cm", minw: 2.8, minh: 1.6, r: 0.15, colour: G.C.GREEN, button: "reroll_shop", func: "can_reroll", hover: true, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.07, focus_args: { button: "x", orientation: "cr" }, func: "set_button_pip" }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 1.3 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_reroll"), scale: 0.4, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 1.3, minw: 1 }, nodes: [{ n: G.UIT.T, config: { text: localize("$"), scale: 0.7, colour: G.C.WHITE, shadow: true } }, { n: G.UIT.T, config: { ref_table: G.GAME.current_round, ref_value: "reroll_cost", scale: 0.75, colour: G.C.WHITE, shadow: true } }] }] }] }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.2, r: 0.2, colour: G.C.L_BLACK, emboss: 0.05, minw: 8.2 }, nodes: [{ n: G.UIT.O, config: { object: G.shop_jokers } }] }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.2 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.15, r: 0.2, colour: G.C.L_BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.2, r: 0.2, colour: G.C.BLACK, maxh: G.shop_vouchers.T.h + 0.4 }, nodes: [{ n: G.UIT.T, config: { text: localize({ type: "variable", key: "ante_x_voucher", vars: [G.GAME.round_resets.ante] }), scale: 0.45, colour: G.C.L_BLACK, vert: true } }, { n: G.UIT.O, config: { object: G.shop_vouchers } }] }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.15, r: 0.2, colour: G.C.L_BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: G.shop_booster } }] }] }] }], false)] };
    return t;
};
function create_card_for_shop(area): void {
    if (area === G.shop_jokers && G.SETTINGS.tutorial_progress && G.SETTINGS.tutorial_progress.forced_shop && G.SETTINGS.tutorial_progress.forced_shop[G.SETTINGS.tutorial_progress.forced_shop.length]) {
        let t = G.SETTINGS.tutorial_progress.forced_shop;
        let _center = G.P_CENTERS[t[t.length]] || G.P_CENTERS.c_empress;
        let card = Card(area.T.x + area.T.w / 2, area.T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, _center, { bypass_discovery_center: true, bypass_discovery_ui: true });
        t[t.length] = undefined;
        if (!t[1]) {
            G.SETTINGS.tutorial_progress.forced_shop = undefined;
        }
        create_shop_card_ui(card);
        return card;
    }
    else {
        let forced_tag = undefined;
        for (const [k, v] of ipairs(G.GAME.tags)) {
            if (!forced_tag) {
                forced_tag = v.apply_to_run({ type: "store_joker_create", area: area });
                if (forced_tag) {
                    for (const [kk, vv] of ipairs(G.GAME.tags)) {
                        if (vv.apply_to_run({ type: "store_joker_modify", card: forced_tag })) {
                            break;
                        }
                    }
                    return forced_tag;
                }
            }
        }
        G.GAME.spectral_rate = G.GAME.spectral_rate || 0;
        let total_rate = G.GAME.joker_rate + G.GAME.playing_card_rate;
        for (const [_, v] of ipairs(SMODS.ConsumableType.ctype_buffer)) {
            total_rate = total_rate + G.GAME[v.lower() + "_rate"];
        }
        let polled_rate = pseudorandom(pseudoseed("cdt" + G.GAME.round_resets.ante)) * total_rate;
        let check_rate = 0;
        let rates = [{ type: "Joker", val: G.GAME.joker_rate }, { type: "Tarot", val: G.GAME.tarot_rate }, { type: "Planet", val: G.GAME.planet_rate }, { type: G.GAME.used_vouchers["v_illusion"] && pseudorandom(pseudoseed("illusion")) > 0.6 && "Enhanced" || "Base", val: G.GAME.playing_card_rate }, { type: "Spectral", val: G.GAME.spectral_rate }];
        for (const [_, v] of ipairs(SMODS.ConsumableType.ctype_buffer)) {
            if (!(v === "Tarot" || v === "Planet" || v === "Spectral")) {
                table.insert(rates, { type: v, val: G.GAME[v.lower() + "_rate"] });
            }
        }
        for (const [_, v] of ipairs(rates)) {
            if (polled_rate > check_rate && polled_rate <= check_rate + v.val) {
                let card = create_card(v.type, area, undefined, undefined, undefined, undefined, undefined, "sho");
                create_shop_card_ui(card, v.type, area);
                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                        for (const [k, v] of ipairs(G.GAME.tags)) {
                            if (v.apply_to_run({ type: "store_joker_modify", card: card })) {
                                break;
                            }
                        }
                        return true;
                    } }));
                if ((v.type === "Base" || v.type === "Enhanced") && G.GAME.used_vouchers["v_illusion"] && pseudorandom(pseudoseed("illusion")) > 0.8) {
                    let edition_poll = pseudorandom(pseudoseed("illusion"));
                    let edition = {};
                    if (edition_poll > 1 - 0.15) {
                        edition.polychrome = true;
                    }
                    else if (edition_poll > 0.5) {
                        edition.holo = true;
                    }
                    else {
                        edition.foil = true;
                    }
                    card.set_edition(edition);
                }
                return card;
            }
            check_rate = check_rate + v.val;
        }
    }
}
function create_shop_card_ui(card, type, area): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.43, blocking: false, blockable: false, func: function () {
            if (card.opening) {
                return true;
            }
            let t1 = { n: G.UIT.ROOT, config: { minw: 0.6, align: "tm", colour: darken(G.C.BLACK, 0.2), shadow: true, r: 0.05, padding: 0.05, minh: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: lighten(G.C.BLACK, 0.1), r: 0.1, minw: 1, minh: 0.55, emboss: 0.05, padding: 0.03 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ prefix: localize("$"), ref_table: card, ref_value: "cost" }], colours: [G.C.MONEY], shadow: true, silent: true, bump: true, pop_in: 0, scale: 0.5 }) } }] }] };
            let t2 = card.ability.set === "Voucher" && { n: G.UIT.ROOT, config: { ref_table: card, minw: 1.1, maxw: 1.3, padding: 0.1, align: "bm", colour: G.C.GREEN, shadow: true, r: 0.08, minh: 0.94, func: "can_redeem", one_press: true, button: "redeem_from_shop", hover: true }, nodes: [{ n: G.UIT.T, config: { text: localize("b_redeem"), colour: G.C.WHITE, scale: 0.4 } }] } || card.ability.set === "Booster" && { n: G.UIT.ROOT, config: { ref_table: card, minw: 1.1, maxw: 1.3, padding: 0.1, align: "bm", colour: G.C.GREEN, shadow: true, r: 0.08, minh: 0.94, func: "can_open", one_press: true, button: "open_booster", hover: true }, nodes: [{ n: G.UIT.T, config: { text: localize("b_open"), colour: G.C.WHITE, scale: 0.5 } }] } || { n: G.UIT.ROOT, config: { ref_table: card, minw: 1.1, maxw: 1.3, padding: 0.1, align: "bm", colour: G.C.GOLD, shadow: true, r: 0.08, minh: 0.94, func: "can_buy", one_press: true, button: "buy_from_shop", hover: true }, nodes: [{ n: G.UIT.T, config: { text: localize("b_buy"), colour: G.C.WHITE, scale: 0.5 } }] };
            let t3 = { n: G.UIT.ROOT, config: { id: "buy_and_use", ref_table: card, minh: 1.1, padding: 0.1, align: "cr", colour: G.C.RED, shadow: true, r: 0.08, minw: 1.1, func: "can_buy_and_use", one_press: true, button: "buy_from_shop", hover: true, focus_args: { type: "none" } }, nodes: [{ n: G.UIT.B, config: { w: 0.1, h: 0.6 } }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 1 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_buy"), colour: G.C.WHITE, scale: 0.5 } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 1 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_and_use"), colour: G.C.WHITE, scale: 0.3 } }] }] }] };
            card.children.price = new UIBox({ definition: t1, config: { align: "tm", offset: { x: 0, y: 1.5 }, major: card, bond: "Weak", parent: card } });
            card.children.buy_button = new UIBox({ definition: t2, config: { align: "bm", offset: { x: 0, y: -0.3 }, major: card, bond: "Weak", parent: card } });
            if (card.ability.consumeable) {
                card.children.buy_and_use_button = new UIBox({ definition: t3, config: { align: "cr", offset: { x: -0.3, y: 0 }, major: card, bond: "Weak", parent: card } });
            }
            card.children.price.alignment.offset.y = card.ability.set === "Booster" && 0.5 || 0.38;
            return true;
        } }));
}
function attention_text(args): void {
    args = args || {};
    args.text = args.text || "test";
    args.scale = args.scale || 1;
    args.colour = copy_table(args.colour || G.C.WHITE);
    args.hold = (args.hold || 0) + 0.1 * G.SPEEDFACTOR;
    args.pos = args.pos || { x: 0, y: 0 };
    args.align = args.align || "cm";
    args.emboss = args.emboss || undefined;
    args.fade = 1;
    if (args.cover) {
        args.cover_colour = copy_table(args.cover_colour || G.C.RED);
        args.cover_colour_l = copy_table(lighten(args.cover_colour, 0.2));
        args.cover_colour_d = copy_table(darken(args.cover_colour, 0.2));
    }
    else {
        args.cover_colour = copy_table(G.C.CLEAR);
    }
    args.uibox_config = { align: args.align || "cm", offset: args.offset || { x: 0, y: 0 }, major: args.cover || args.major || undefined };
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0, blockable: false, blocking: false, func: function () {
            args.AT = new UIBox({ T: [args.pos.x, args.pos.y, 0, 0], definition: { n: G.UIT.ROOT, config: { align: args.cover_align || "cm", minw: (args.cover && args.cover.T.w || 0.001) + (args.cover_padding || 0), minh: (args.cover && args.cover.T.h || 0.001) + (args.cover_padding || 0), padding: 0.03, r: 0.1, emboss: args.emboss, colour: args.cover_colour }, nodes: [{ n: G.UIT.O, config: { draw_layer: 1, object: DynaText({ scale: args.scale, string: args.text, maxw: args.maxw, colours: [args.colour], float: true, shadow: true, silent: !args.noisy, [1]: args.scale, pop_in: 0, pop_in_rate: 6, rotate: args.rotate || undefined }) } }] }, config: args.uibox_config });
            args.AT.attention_text = true;
            args.text = args.AT.UIRoot.children[1].config.object;
            args.text.pulse(0.5);
            if (args.cover) {
                Particles(args.pos.x, args.pos.y, 0, 0, { timer_type: "TOTAL", timer: 0.01, pulse_max: 15, max: 0, scale: 0.3, vel_variation: 0.2, padding: 0.1, fill: true, lifespan: 0.5, speed: 2.5, attach: args.AT.UIRoot, colours: [args.cover_colour, args.cover_colour_l, args.cover_colour_d] });
            }
            if (args.backdrop_colour) {
                args.backdrop_colour = copy_table(args.backdrop_colour);
                Particles(args.pos.x, args.pos.y, 0, 0, { timer_type: "TOTAL", timer: 5, scale: 2.4 * (args.backdrop_scale || 1), lifespan: 5, speed: 0, attach: args.AT, colours: [args.backdrop_colour] });
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: args.hold, blockable: false, blocking: false, func: function () {
            if (!args.start_time) {
                args.start_time = G.TIMERS.TOTAL;
                args.text.pop_out(3);
            }
            else {
                args.fade = math.max(0, 1 - 3 * (G.TIMERS.TOTAL - args.start_time));
                if (args.cover_colour) {
                    args.cover_colour[4] = math.min(args.cover_colour[4], 2 * args.fade);
                }
                if (args.cover_colour_l) {
                    args.cover_colour_l[4] = math.min(args.cover_colour_l[4], args.fade);
                }
                if (args.cover_colour_d) {
                    args.cover_colour_d[4] = math.min(args.cover_colour_d[4], args.fade);
                }
                if (args.backdrop_colour) {
                    args.backdrop_colour[4] = math.min(args.backdrop_colour[4], args.fade);
                }
                args.colour[4] = math.min(args.colour[4], args.fade);
                if (args.fade <= 0) {
                    args.AT.remove();
                    return true;
                }
            }
        } }));
}
function create_UIBox_buttons(): void {
    let text_scale = 0.45;
    let button_height = 1.3;
    let play_button = { n: G.UIT.C, config: { id: "play_button", align: "tm", minw: 2.5, padding: 0.3, r: 0.1, hover: true, colour: G.C.BLUE, button: "play_cards_from_highlighted", one_press: true, shadow: true, func: "can_play" }, nodes: [{ n: G.UIT.R, config: { align: "bcm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_play_hand"), scale: text_scale, colour: G.C.UI.TEXT_LIGHT, focus_args: { button: "x", orientation: "bm" }, func: "set_button_pip" } }] }] };
    let discard_button = { n: G.UIT.C, config: { id: "discard_button", align: "tm", padding: 0.3, r: 0.1, minw: 2.5, minh: button_height, hover: true, colour: G.C.RED, button: "discard_cards_from_highlighted", one_press: true, shadow: true, func: "can_discard" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_discard"), scale: text_scale, colour: G.C.UI.TEXT_LIGHT, focus_args: { button: "y", orientation: "bm" }, func: "set_button_pip" } }] }] };
    let t = { n: G.UIT.ROOT, config: { align: "cm", minw: 1, minh: 0.3, padding: 0.15, r: 0.1, colour: G.C.CLEAR }, nodes: [G.SETTINGS.play_button_pos === 1 && discard_button || play_button, { n: G.UIT.C, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.UI.TRANSPARENT_DARK, outline: 1.5, outline_colour: mix_colours(G.C.WHITE, G.C.JOKER_GREY, 0.7), line_emboss: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_sort_hand"), scale: text_scale * 0.8, colour: G.C.UI.TEXT_LIGHT } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: 0.7, minw: 0.9, padding: 0.1, r: 0.1, hover: true, colour: G.C.ORANGE, button: "sort_hand_value", shadow: true }, nodes: [{ n: G.UIT.T, config: { text: localize("k_rank"), scale: text_scale * 0.7, colour: G.C.UI.TEXT_LIGHT } }] }, { n: G.UIT.C, config: { align: "cm", minh: 0.7, minw: 0.9, padding: 0.1, r: 0.1, hover: true, colour: G.C.ORANGE, button: "sort_hand_suit", shadow: true }, nodes: [{ n: G.UIT.T, config: { text: localize("k_suit"), scale: text_scale * 0.7, colour: G.C.UI.TEXT_LIGHT } }] }] }] }] }, G.SETTINGS.play_button_pos === 1 && play_button || discard_button] };
    return t;
}
function desc_from_rows(desc_nodes, empty, maxw): void {
    let t = {};
    for (const [k, v] of ipairs(desc_nodes)) {
        t[t.length + 1] = { n: G.UIT.R, config: { align: "cm", maxw: maxw }, nodes: v };
    }
    return { n: G.UIT.R, config: { align: "cm", colour: desc_nodes.background_colour || empty && G.C.CLEAR || G.C.UI.BACKGROUND_WHITE, r: 0.1, padding: 0.04, minw: 2, minh: 0.8, emboss: !empty && 0.05 || undefined, filler: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: t }] };
}
function transparent_multiline_text(desc_nodes): void {
    let t = {};
    for (const [k, v] of ipairs(desc_nodes)) {
        t[t.length + 1] = { n: G.UIT.R, config: { align: "cm", maxw: maxw }, nodes: v };
    }
    return { n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: t };
}
function info_tip_from_rows(desc_nodes, name): void {
    let t = {};
    for (const [k, v] of ipairs(desc_nodes)) {
        t[t.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: v };
    }
    return { n: G.UIT.R, config: { align: "cm", colour: lighten(G.C.GREY, 0.15), r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "tm", minh: 0.36, padding: 0.03 }, nodes: [{ n: G.UIT.T, config: { text: name, scale: 0.32, colour: G.C.UI.TEXT_LIGHT } }] }, { n: G.UIT.R, config: { align: "cm", minw: 1.5, minh: 0.4, r: 0.1, padding: 0.05, colour: desc_nodes.background_colour || G.C.WHITE }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: t }] }] };
}
function overlay_infotip(text_rows): void {
    let t = {};
    if (type(text_rows) !== "table") {
        text_rows = ["ERROR"];
    }
    for (const [k, v] of ipairs(text_rows)) {
        t[t.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: v, colour: G.C.UI.TEXT_LIGHT, scale: 0.45, juice: true, shadow: true, lang: text_rows.lang } }] };
    }
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, padding: 0.1 }, nodes: t };
}
function name_from_rows(name_nodes, background_colour): void {
    if (!name_nodes || type(name_nodes) !== "table" || !next(name_nodes)) {
        return;
    }
    return { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: background_colour, emboss: background_colour && 0.05 || undefined }, nodes: name_nodes };
}
G.UIDEF.card_h_popup = function (card) {
    if (card.ability_UIBox_table) {
        let AUT = card.ability_UIBox_table;
        let debuffed = card.debuff;
        let card_type_colour = get_type_colour(card.config.center || card.config, card);
        let card_type_background = AUT.card_type === "Locked" && G.C.BLACK || AUT.card_type === "Undiscovered" && darken(G.C.JOKER_GREY, 0.3) || (AUT.card_type === "Enhanced" || AUT.card_type === "Default") && darken(G.C.BLACK, 0.1) || debuffed && darken(G.C.BLACK, 0.1) || card_type_colour && darken(G.C.BLACK, 0.1) || G.C.SET[AUT.card_type] || [0, 1, 1, 1];
        let outer_padding = 0.05;
        let card_type = localize("k_" + string.lower(AUT.card_type));
        if (AUT.card_type === "Joker" || AUT.badges && AUT.badges.force_rarity) {
            card_type = SMODS.Rarity.get_rarity_badge(card.config.center.rarity);
        }
        if (AUT.card_type === "Enhanced") {
            card_type = localize({ type: "name_text", key: card.config.center.key, set: "Enhanced" });
        }
        card_type = debuffed && AUT.card_type !== "Enhanced" && localize("k_debuffed") || card_type;
        let [disp_type, is_playing_card] = [AUT.card_type !== "Locked" && AUT.card_type !== "Undiscovered" && AUT.card_type !== "Default" || debuffed, AUT.card_type === "Enhanced" || AUT.card_type === "Default"];
        let info_boxes = {};
        let badges = {};
        let obj = card.config.center;
        if (AUT.badges.card_type || AUT.badges.force_rarity) {
            if (obj && (obj.set_card_type_badge || obj.type && obj.type.set_card_type_badge)) {
                if (obj.type && type(obj.type.set_card_type_badge) === "function") {
                    obj.type.set_card_type_badge(obj, card, badges);
                }
                if (type(obj.set_card_type_badge) === "function") {
                    obj.set_card_type_badge(card, badges);
                }
            }
            else {
                badges[badges.length + 1] = create_badge((card.ability.name === "Pluto" || card.ability.name === "Ceres" || card.ability.name === "Eris") && localize("k_dwarf_planet") || (card.ability.name === "Planet X" && localize("k_planet_q") || card_type), card_type_colour, undefined, 1.2);
            }
        }
        if (obj && obj.set_badges && type(obj.set_badges) === "function") {
            obj.set_badges(card, badges);
        }
        if (AUT.badges) {
            for (const [k, v] of ipairs(AUT.badges)) {
                if (v === "negative_consumable" || v === "negative_playing_card") {
                    v = "negative";
                }
                badges[badges.length + 1] = create_badge(localize(v, "labels"), get_badge_colour(v));
            }
        }
        if (AUT.card_type !== "Locked" && AUT.card_type !== "Undiscovered") {
            SMODS.create_mod_badges(card.config.center, badges);
            if (card.base) {
                SMODS.create_mod_badges(SMODS.Ranks[card.base.value], badges);
                SMODS.create_mod_badges(SMODS.Suits[card.base.suit], badges);
            }
            if (card.config && card.config.tag) {
                SMODS.create_mod_badges(SMODS.Tags[card.config.tag.key], badges);
            }
            badges.mod_set = undefined;
        }
        if (AUT.info) {
            for (const [k, v] of ipairs(AUT.info)) {
                info_boxes[info_boxes.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: lighten(G.C.JOKER_GREY, 0.5), r: 0.1, padding: 0.05, emboss: 0.05 }, nodes: [info_tip_from_rows(v, v.name)] }] };
            }
        }
        let cols;
        if (info_boxes.length <= 3) {
            cols = 1;
        }
        else if (info_boxes.length <= 10) {
            cols = 2;
        }
        else if (info_boxes.length <= 24) {
            cols = 3;
        }
        else {
            cols = 4;
        }
        let nodes_per_col = math.ceil(info_boxes.length / cols);
        let info_cols = {};
        for (let i = 0; i <= cols - 1; i++) {
            let col = {};
            for (let j = 1; j <= nodes_per_col; j++) {
                let info_box = info_boxes[i * nodes_per_col + j];
                if (info_box) {
                    table.insert(col, info_box);
                }
                else {
                    break;
                }
            }
            table.insert(info_cols, { n: G.UIT.C, config: { align: "cm" }, nodes: col });
        }
        info_boxes = [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, card_pos: card.T.x }, nodes: info_cols }];
        return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "cm", func: "show_infotip", object: Moveable(), ref_table: next(info_boxes) && info_boxes || undefined }, nodes: [{ n: G.UIT.R, config: { padding: outer_padding, r: 0.12, colour: lighten(G.C.JOKER_GREY, 0.5), emboss: 0.07 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.07, r: 0.1, colour: adjust_alpha(card_type_background, 0.8) }, nodes: [name_from_rows(AUT.name, is_playing_card && G.C.WHITE || undefined), desc_from_rows(AUT.main), badges[1] && { n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: badges } || undefined] }] }] }] };
    }
};
function get_badge_colour(key): void {
    G.BADGE_COL = G.BADGE_COL || { eternal: G.C.ETERNAL, perishable: G.C.PERISHABLE, rental: G.C.RENTAL, foil: G.C.DARK_EDITION, holographic: G.C.DARK_EDITION, polychrome: G.C.DARK_EDITION, negative: G.C.DARK_EDITION, gold_seal: G.C.GOLD, red_seal: G.C.RED, blue_seal: G.C.BLUE, purple_seal: G.C.PURPLE, pinned_left: G.C.ORANGE };
    for (const [_, v] of ipairs(G.P_CENTER_POOLS.Edition)) {
        G.BADGE_COL[v.key.sub(3)] = v.badge_colour;
    }
    for (const [k, v] of pairs(SMODS.Rarity.obj_buffer)) {
        G.BADGE_COL[k] = G.C.RARITY[v];
    }
    for (const [k, v] of pairs(SMODS.Seals)) {
        G.BADGE_COL[k.lower() + "_seal"] = v.badge_colour;
    }
    for (const [k, v] of pairs(SMODS.Stickers)) {
        G.BADGE_COL[k] = v.badge_colour;
    }
    return G.BADGE_COL[key] || [1, 0, 0, 1];
}
function create_badge(_string, _badge_col, _text_col, scaling): void {
    scaling = scaling || 1;
    return { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: _badge_col || G.C.GREEN, r: 0.1, minw: 2, minh: 0.4 * scaling, emboss: 0.05, padding: 0.03 * scaling }, nodes: [{ n: G.UIT.B, config: { h: 0.1, w: 0.03 } }, { n: G.UIT.O, config: { object: DynaText({ string: _string || "ERROR", colours: [_text_col || G.C.WHITE], float: true, shadow: true, offset_y: -0.05, silent: true, spacing: 1, scale: 0.33 * scaling }) } }, { n: G.UIT.B, config: { h: 0.1, w: 0.03 } }] }] };
}
function create_UIBox_detailed_tooltip(_center): void {
    let full_UI_table = { main: {}, info: {}, type: {}, name: "done", badges: badges || {} };
    let desc = generate_card_ui(_center, full_UI_table, undefined, _center.set, undefined);
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: lighten(G.C.JOKER_GREY, 0.5), r: 0.1, padding: 0.05, emboss: 0.05 }, nodes: [info_tip_from_rows(desc.info[1], desc.info[1].name)] }] };
}
function create_popup_UIBox_tooltip(tooltip): void {
    let title = tooltip.title || undefined;
    let text = tooltip.text || {};
    let rows = {};
    if (title) {
        let r = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: title, colour: G.C.UI.TEXT_DARK, scale: 0.4 } }] }] };
        table.insert(rows, r);
    }
    for (let i = 1; i <= text.length; i++) {
        if (type(text[i]) === "table") {
            let r = { n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: [{ n: G.UIT.T, config: { ref_table: text[i].ref_table, ref_value: text[i].ref_value, colour: G.C.UI.TEXT_DARK, scale: 0.4 } }] };
            table.insert(rows, r);
        }
        else {
            let r = { n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: [{ n: G.UIT.T, config: { text: text[i], colour: G.C.UI.TEXT_DARK, scale: 0.4 } }] };
            table.insert(rows, r);
        }
    }
    if (tooltip.filler) {
        table.insert(rows, tooltip.filler.func(tooltip.filler.args));
    }
    let t = { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, r: 0.1, colour: G.C.RED, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, colour: G.C.WHITE, emboss: 0.05 }, nodes: rows }] };
    return t;
}
function create_UIBox_HUD_blind(): void {
    let scale = 0.4;
    let stake_sprite = get_stake_sprite(G.GAME.stake || 1, 0.5);
    G.GAME.blind.change_dim(1.5, 1.5);
    return { n: G.UIT.ROOT, config: { align: "cm", minw: 4.5, r: 0.1, colour: G.C.BLACK, emboss: 0.05, padding: 0.05, func: "HUD_blind_visible", id: "HUD_blind" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.7, r: 0.1, emboss: 0.05, colour: G.C.DYN_UI.MAIN }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 3 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME.blind, ref_value: "loc_name" }], colours: [G.C.UI.TEXT_LIGHT], shadow: true, rotate: true, silent: true, float: true, scale: 1.6 * scale, y_offset: -4 }), id: "HUD_blind_name" } }] }] }, { n: G.UIT.R, config: { align: "cm", minh: 2.74, r: 0.1, colour: G.C.DYN_UI.DARK }, nodes: [{ n: G.UIT.R, config: { align: "cm", id: "HUD_blind_debuff", func: "HUD_blind_debuff" }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", padding: 0.15 }, nodes: [{ n: G.UIT.O, config: { object: G.GAME.blind, draw_layer: 1 } }, { n: G.UIT.C, config: { align: "cm", r: 0.1, padding: 0.05, emboss: 0.05, minw: 2.9, colour: G.C.BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 2.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_blind_score_at_least"), scale: 0.3, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.6 }, nodes: [{ n: G.UIT.O, config: { w: 0.5, h: 0.5, colour: G.C.BLUE, object: stake_sprite, hover: true, can_collide: false } }, { n: G.UIT.B, config: { h: 0.1, w: 0.1 } }, { n: G.UIT.T, config: { ref_table: G.GAME.blind, ref_value: "chip_text", scale: 0.001, colour: G.C.RED, shadow: true, id: "HUD_blind_count", func: "blind_chip_UI_scale" } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.45, maxw: 2.8, func: "HUD_blind_reward" }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_blind_reward"), scale: 0.3, colour: G.C.WHITE } }, { n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME.current_round, ref_value: "dollars_to_be_earned" }], colours: [G.C.MONEY], shadow: true, rotate: true, bump: true, silent: true, scale: 0.45 }), id: "dollars_to_be_earned" } }] }] }] }] }] };
}
function add_tag(_tag): void {
    G.HUD_tags = G.HUD_tags || {};
    let tag_sprite_ui = _tag.generate_UI();
    G.HUD_tags[G.HUD_tags.length + 1] = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [tag_sprite_ui] }, config: { align: G.HUD_tags[1] && "tm" || "bri", offset: G.HUD_tags[1] && { x: 0, y: 0 } || { x: 0.7, y: 0 }, major: G.HUD_tags[1] && G.HUD_tags[G.HUD_tags.length] || G.ROOM_ATTACH } });
    discover_card(G.P_TAGS[_tag.key]);
    for (let i = 1; i <= G.GAME.tags.length; i++) {
        G.GAME.tags[i].apply_to_run({ type: "tag_add", tag: _tag });
    }
    G.GAME.tags[G.GAME.tags.length + 1] = _tag;
    _tag.HUD_tag = G.HUD_tags[G.HUD_tags.length];
}
function create_UIBox_HUD(): void {
    let scale = 0.4;
    let stake_sprite = get_stake_sprite(G.GAME.stake || 1, 0.5);
    let contents = {};
    let spacing = 0.13;
    let temp_col = G.C.DYN_UI.BOSS_MAIN;
    let temp_col2 = G.C.DYN_UI.BOSS_DARK;
    contents.round = [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { id: "hud_hands", align: "cm", padding: 0.05, minw: 1.45, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.33, maxw: 1.35 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_hud_hands"), scale: 0.85 * scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", r: 0.1, minw: 1.2, colour: temp_col2 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME.current_round, ref_value: "hands_left" }], font: G.LANGUAGES["en-us"].font, colours: [G.C.BLUE], shadow: true, rotate: true, scale: 2 * scale }), id: "hand_UI_count" } }] }] }, { n: G.UIT.C, config: { minw: spacing }, nodes: {} }, { n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 1.45, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.33, maxw: 1.35 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_hud_discards"), scale: 0.85 * scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, minw: 1.2, colour: temp_col2 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME.current_round, ref_value: "discards_left" }], font: G.LANGUAGES["en-us"].font, colours: [G.C.RED], shadow: true, rotate: true, scale: 2 * scale }), id: "discard_UI_count" } }] }] }] }] }, { n: G.UIT.R, config: { minh: spacing }, nodes: {} }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 1.45 * 2 + spacing, minh: 1.15, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, minw: 1.28 * 2 + spacing, minh: 1, colour: temp_col2 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "dollars", prefix: localize("$") }], scale_function: function () {
                                                        return scale_number(G.GAME.dollars, 2.2 * scale, 99999, 1000000);
                                                    }, maxw: 1.35, colours: [G.C.MONEY], font: G.LANGUAGES["en-us"].font, shadow: true, spacing: 2, bump: true, scale: 2.2 * scale }), id: "dollar_text_UI" } }] }] }] }] }, { n: G.UIT.R, config: { minh: spacing }, nodes: {} }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { id: "hud_ante", align: "cm", padding: 0.05, minw: 1.45, minh: 1, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.33, maxw: 1.35 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_ante"), scale: 0.85 * scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", r: 0.1, minw: 1.2, colour: temp_col2 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME.round_resets, ref_value: "ante" }], colours: [G.C.IMPORTANT], shadow: true, font: G.LANGUAGES["en-us"].font, scale: 2 * scale }), id: "ante_UI_count" } }, { n: G.UIT.T, config: { text: " ", scale: 0.3 * scale } }, { n: G.UIT.T, config: { text: "/ ", scale: 0.7 * scale, colour: G.C.WHITE, shadow: true } }, { n: G.UIT.T, config: { ref_table: G.GAME, ref_value: "win_ante", scale: scale, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.C, config: { minw: spacing }, nodes: {} }, { n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 1.45, minh: 1, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 1.35 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_round"), minh: 0.33, scale: 0.85 * scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", r: 0.1, minw: 1.2, colour: temp_col2, id: "row_round_text" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "round" }], colours: [G.C.IMPORTANT], shadow: true, scale: 2 * scale }), id: "round_UI_count" } }] }] }] }];
    contents.hand = { n: G.UIT.R, config: { align: "cm", id: "hand_text_area", colour: darken(G.C.BLACK, 0.1), r: 0.1, emboss: 0.05, padding: 0.03 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 1.1 }, nodes: [{ n: G.UIT.O, config: { id: "hand_name", func: "hand_text_UI_set", object: DynaText({ string: [{ ref_table: G.GAME.current_round.current_hand, ref_value: "handname_text" }], colours: [G.C.UI.TEXT_LIGHT], shadow: true, float: true, scale: scale * 1.4 }) } }, { n: G.UIT.O, config: { id: "hand_chip_total", func: "hand_chip_total_UI_set", object: DynaText({ string: [{ ref_table: G.GAME.current_round.current_hand, ref_value: "chip_total_text" }], colours: [G.C.UI.TEXT_LIGHT], shadow: true, float: true, scale: scale * 1.4 }) } }, { n: G.UIT.T, config: { ref_table: G.GAME.current_round.current_hand, ref_value: "hand_level", scale: scale, colour: G.C.UI.TEXT_LIGHT, id: "hand_level", shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 1, padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cr", minw: 2, minh: 1, r: 0.1, colour: G.C.UI_CHIPS, id: "hand_chip_area", emboss: 0.05 }, nodes: [{ n: G.UIT.O, config: { func: "flame_handler", no_role: true, id: "flame_chips", object: Moveable(0, 0, 0, 0), w: 0, h: 0 } }, { n: G.UIT.O, config: { id: "hand_chips", func: "hand_chip_UI_set", object: DynaText({ string: [{ ref_table: G.GAME.current_round.current_hand, ref_value: "chip_text" }], colours: [G.C.UI.TEXT_LIGHT], font: G.LANGUAGES["en-us"].font, shadow: true, float: true, scale: scale * 2.3 }) } }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "X", lang: G.LANGUAGES["en-us"], scale: scale * 2, colour: G.C.UI_MULT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cl", minw: 2, minh: 1, r: 0.1, colour: G.C.UI_MULT, id: "hand_mult_area", emboss: 0.05 }, nodes: [{ n: G.UIT.O, config: { func: "flame_handler", no_role: true, id: "flame_mult", object: Moveable(0, 0, 0, 0), w: 0, h: 0 } }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }, { n: G.UIT.O, config: { id: "hand_mult", func: "hand_mult_UI_set", object: DynaText({ string: [{ ref_table: G.GAME.current_round.current_hand, ref_value: "mult_text" }], colours: [G.C.UI.TEXT_LIGHT], font: G.LANGUAGES["en-us"].font, shadow: true, float: true, scale: scale * 2.3 }) } }] }] }] }] };
    contents.dollars_chips = { n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0, colour: G.C.DYN_UI.BOSS_MAIN, emboss: 0.05, id: "row_dollars_chips" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 1.3 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, maxw: 1.3 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_round"), scale: 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0, maxw: 1.3 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_lower_score"), scale: 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "cm", minw: 3.3, minh: 0.7, r: 0.1, colour: G.C.DYN_UI.BOSS_DARK }, nodes: [{ n: G.UIT.O, config: { w: 0.5, h: 0.5, object: stake_sprite, hover: true, can_collide: false } }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }, { n: G.UIT.T, config: { ref_table: G.GAME, ref_value: "chips_text", lang: G.LANGUAGES["en-us"], scale: 0.85, colour: G.C.WHITE, id: "chip_UI_count", func: "chip_UI_set", shadow: true } }] }] }] };
    contents.buttons = [{ n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.CLEAR, shadow: true, id: "button_area", padding: 0.2 }, nodes: [{ n: G.UIT.R, config: { id: "run_info_button", align: "cm", minh: 1.75, minw: 1.5, padding: 0.05, r: 0.1, hover: true, colour: G.C.RED, button: "run_info", shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, maxw: 1.4 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_run_info_1"), scale: 1.2 * scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0, maxw: 1.4 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_run_info_2"), scale: 1 * scale, colour: G.C.UI.TEXT_LIGHT, shadow: true, focus_args: { button: G.F_GUIDE && "guide" || "back", orientation: "bm" }, func: "set_button_pip" } }] }] }, { n: G.UIT.R, config: { align: "cm", minh: 1.75, minw: 1.5, padding: 0.05, r: 0.1, hover: true, colour: G.C.ORANGE, button: "options", shadow: true }, nodes: [{ n: G.UIT.C, config: { align: "cm", maxw: 1.4, focus_args: { button: "start", orientation: "bm" }, func: "set_button_pip" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_options"), scale: scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }];
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.03, colour: G.C.UI.TRANSPARENT_DARK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: G.C.DYN_UI.MAIN, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: G.C.DYN_UI.BOSS_DARK, r: 0.1, minh: 30, padding: 0.08 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.3 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", id: "row_blind", minw: 1, minh: 3.75 }, nodes: [{ n: G.UIT.B, config: { w: 0, h: 3.64, id: "row_blind_bottom" }, nodes: {} }] }, contents.dollars_chips, contents.hand, { n: G.UIT.R, config: { align: "cm", id: "row_round" }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: contents.buttons }, { n: G.UIT.C, config: { align: "cm" }, nodes: contents.round }] }] }] }] };
}
function create_UIBox_blind_select(): void {
    G.blind_prompt_box = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, padding: 0.2 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("ph_choose_blind_1"), colours: [G.C.WHITE], shadow: true, bump: true, scale: 0.6, pop_in: 0.5, maxw: 5 }), id: "prompt_dynatext1" } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("ph_choose_blind_2"), colours: [G.C.WHITE], shadow: true, bump: true, scale: 0.7, pop_in: 0.5, maxw: 5, silent: true }), id: "prompt_dynatext2" } }] }, (G.GAME.used_vouchers["v_retcon"] || G.GAME.used_vouchers["v_directors_cut"]) && UIBox_button({ label: [localize("b_reroll_boss"), localize("$") + "10"], button: "reroll_boss", func: "reroll_boss_button" }) || undefined] }, config: { align: "cm", offset: { x: 0, y: -15 }, major: G.HUD.get_UIE_by_ID("row_blind"), bond: "Weak" } });
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            G.blind_prompt_box.alignment.offset.y = 0;
            return true;
        } }));
    let width = G.hand.T.w;
    G.GAME.blind_on_deck = !(G.GAME.round_resets.blind_states.Small === "Defeated" || G.GAME.round_resets.blind_states.Small === "Skipped" || G.GAME.round_resets.blind_states.Small === "Hide") && "Small" || !(G.GAME.round_resets.blind_states.Big === "Defeated" || G.GAME.round_resets.blind_states.Big === "Skipped" || G.GAME.round_resets.blind_states.Big === "Hide") && "Big" || "Boss";
    G.blind_select_opts = {};
    G.blind_select_opts.small = G.GAME.round_resets.blind_states["Small"] !== "Hide" && new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [UIBox_dyn_container([create_UIBox_blind_choice("Small")], false, get_blind_main_colour("Small"))] }, config: { align: "bmi", offset: { x: 0, y: 0 } } }) || undefined;
    G.blind_select_opts.big = G.GAME.round_resets.blind_states["Big"] !== "Hide" && new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [UIBox_dyn_container([create_UIBox_blind_choice("Big")], false, get_blind_main_colour("Big"))] }, config: { align: "bmi", offset: { x: 0, y: 0 } } }) || undefined;
    G.blind_select_opts.boss = G.GAME.round_resets.blind_states["Boss"] !== "Hide" && new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [UIBox_dyn_container([create_UIBox_blind_choice("Boss")], false, get_blind_main_colour("Boss"), mix_colours(G.C.BLACK, get_blind_main_colour("Boss"), 0.8))] }, config: { align: "bmi", offset: { x: 0, y: 0 } } }) || undefined;
    let t = { n: G.UIT.ROOT, config: { align: "tm", minw: width, r: 0.15, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.5 }, nodes: [G.GAME.round_resets.blind_states["Small"] !== "Hide" && { n: G.UIT.O, config: { align: "cm", object: G.blind_select_opts.small } } || undefined, G.GAME.round_resets.blind_states["Big"] !== "Hide" && { n: G.UIT.O, config: { align: "cm", object: G.blind_select_opts.big } } || undefined, G.GAME.round_resets.blind_states["Boss"] !== "Hide" && { n: G.UIT.O, config: { align: "cm", object: G.blind_select_opts.boss } } || undefined] }] };
    return t;
}
function create_UIBox_blind_tag(blind_choice, run_info): void {
    G.GAME.round_resets.blind_tags = G.GAME.round_resets.blind_tags || {};
    if (!G.GAME.round_resets.blind_tags[blind_choice]) {
        return undefined;
    }
    let _tag = Tag(G.GAME.round_resets.blind_tags[blind_choice], undefined, blind_choice);
    let [_tag_ui, _tag_sprite] = _tag.generate_UI();
    _tag_sprite.states.collide.can = !!run_info;
    return { n: G.UIT.R, config: { id: "tag_container", ref_table: _tag, align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "tm", minh: 0.65 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_or"), scale: 0.55, colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.WHITE, shadow: !disabled } }] }, { n: G.UIT.R, config: { id: "tag_" + blind_choice, align: "cm", r: 0.1, padding: 0.1, minw: 1, can_collide: true, ref_table: _tag_sprite }, nodes: [{ n: G.UIT.C, config: { id: "tag_desc", align: "cm", minh: 1 }, nodes: [_tag_ui] }, !run_info && { n: G.UIT.C, config: { align: "cm", colour: G.C.UI.BACKGROUND_INACTIVE, minh: 0.6, minw: 2, maxw: 2, padding: 0.07, r: 0.1, shadow: true, hover: true, one_press: true, button: "skip_blind", func: "hover_tag_proxy", ref_table: _tag }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip_blind"), scale: 0.4, colour: G.C.UI.TEXT_INACTIVE } }] } || { n: G.UIT.C, config: { align: "cm", padding: 0.1, emboss: 0.05, colour: mix_colours(G.C.BLUE, G.C.BLACK, 0.4), r: 0.1, maxw: 2 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip_reward"), scale: 0.35, colour: G.C.WHITE } }] }] }] };
}
function create_UIBox_blind_choice(type, run_info): void {
    if (!G.GAME.blind_on_deck) {
        G.GAME.blind_on_deck = "Small";
    }
    if (!run_info) {
        G.GAME.round_resets.blind_states[G.GAME.blind_on_deck] = "Select";
    }
    let disabled = false;
    type = type || "Small";
    let blind_choice = { config: G.P_BLINDS[G.GAME.round_resets.blind_choices[type]] };
    blind_choice.animation =new AnimatedSprite(0, 0, 1.4, 1.4, G.ANIMATION_ATLAS[blind_choice.config.atlas] || G.ANIMATION_ATLAS["blind_chips"], blind_choice.config.pos);
    blind_choice.animation.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
    let extras = undefined;
    let stake_sprite = get_stake_sprite(G.GAME.stake || 1, 0.5);
    G.GAME.orbital_choices = G.GAME.orbital_choices || {};
    G.GAME.orbital_choices[G.GAME.round_resets.ante] = G.GAME.orbital_choices[G.GAME.round_resets.ante] || {};
    if (!G.GAME.orbital_choices[G.GAME.round_resets.ante][type]) {
        let _poker_hands = {};
        for (const [k, v] of pairs(G.GAME.hands)) {
            if (v.visible) {
                _poker_hands[_poker_hands.length + 1] = k;
            }
        }
        G.GAME.orbital_choices[G.GAME.round_resets.ante][type] = pseudorandom_element(_poker_hands, pseudoseed("orbital"));
    }
    if (type === "Small") {
        extras = create_UIBox_blind_tag(type, run_info);
    }
    else if (type === "Big") {
        extras = create_UIBox_blind_tag(type, run_info);
    }
    else if (!run_info) {
        let dt1 = DynaText({ string: [{ string: localize("ph_up_ante_1"), colour: G.C.FILTER }], colours: [G.C.BLACK], scale: 0.55, silent: true, pop_delay: 4.5, shadow: true, bump: true, maxw: 3 });
        let dt2 = DynaText({ string: [{ string: localize("ph_up_ante_2"), colour: G.C.WHITE }], colours: [G.C.CHANCE], scale: 0.35, silent: true, pop_delay: 4.5, shadow: true, maxw: 3 });
        let dt3 = DynaText({ string: [{ string: localize("ph_up_ante_3"), colour: G.C.WHITE }], colours: [G.C.CHANCE], scale: 0.35, silent: true, pop_delay: 4.5, shadow: true, maxw: 3 });
        extras = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.07, r: 0.1, colour: [0, 0, 0, 0.12], minw: 2.9 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: dt1 } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: dt2 } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: dt3 } }] }] }] };
    }
    G.GAME.round_resets.blind_ante = G.GAME.round_resets.blind_ante || G.GAME.round_resets.ante;
    let target = { type: "raw_descriptions", key: blind_choice.config.key, set: "Blind", vars: {} };
    if (blind_choice.config.name === "The Ox") {
        target.vars = [localize(G.GAME.current_round.most_played_poker_hand, "poker_hands")];
    }
    let obj = blind_choice.config;
    if (obj.loc_vars && globalThis["type"](obj.loc_vars) === "function") {
        let res = obj.loc_vars() || {};
        target.vars = res.vars || target.vars;
        target.key = res.key || target.key;
    }
    let loc_target = localize(target);
    let loc_name = localize({ type: "name_text", key: blind_choice.config.key, set: "Blind" });
    let text_table = loc_target;
    let blind_col = get_blind_main_colour(type);
    let blind_amt = get_blind_amount(G.GAME.round_resets.blind_ante) * blind_choice.config.mult * G.GAME.starting_params.ante_scaling;
    let blind_state = G.GAME.round_resets.blind_states[type];
    let _reward = true;
    if (G.GAME.modifiers.no_blind_reward && G.GAME.modifiers.no_blind_reward[type]) {
        _reward = undefined;
    }
    if (blind_state === "Select") {
        blind_state = "Current";
    }
    let blind_desc_nodes = {};
    for (const [k, v] of ipairs(text_table)) {
        blind_desc_nodes[blind_desc_nodes.length + 1] = { n: G.UIT.R, config: { align: "cm", maxw: 2.8 }, nodes: [{ n: G.UIT.T, config: { text: v || "-", scale: 0.32, colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.WHITE, shadow: !disabled } }] };
    }
    let run_info_colour = run_info && (blind_state === "Defeated" && G.C.GREY || blind_state === "Skipped" && G.C.BLUE || blind_state === "Upcoming" && G.C.ORANGE || blind_state === "Current" && G.C.RED || G.C.GOLD);
    let t = { n: G.UIT.R, config: { id: type, align: "tm", func: "blind_choice_handler", minh: !run_info && 10 || undefined, ref_table: { deck: undefined, run_info: run_info }, r: 0.1, padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: mix_colours(G.C.BLACK, G.C.L_BLACK, 0.5), r: 0.1, outline: 1, outline_colour: G.C.L_BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.2 }, nodes: [!run_info && { n: G.UIT.R, config: { id: "select_blind_button", align: "cm", ref_table: blind_choice.config, colour: disabled && G.C.UI.BACKGROUND_INACTIVE || G.C.ORANGE, minh: 0.6, minw: 2.7, padding: 0.07, r: 0.1, shadow: true, hover: true, one_press: true, button: "select_blind" }, nodes: [{ n: G.UIT.T, config: { ref_table: G.GAME.round_resets.loc_blind_states, ref_value: type, scale: 0.45, colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.UI.TEXT_LIGHT, shadow: !disabled } }] } || { n: G.UIT.R, config: { id: "select_blind_button", align: "cm", ref_table: blind_choice.config, colour: run_info_colour, minh: 0.6, minw: 2.7, padding: 0.07, r: 0.1, emboss: 0.08 }, nodes: [{ n: G.UIT.T, config: { text: localize(blind_state, "blind_states"), scale: 0.45, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.R, config: { id: "blind_name", align: "cm", padding: 0.07 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, outline: 1, outline_colour: blind_col, colour: darken(blind_col, 0.3), minw: 2.9, emboss: 0.1, padding: 0.07, line_emboss: 1 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: loc_name, colours: [disabled && G.C.UI.TEXT_INACTIVE || G.C.WHITE], shadow: !disabled, float: !disabled, y_offset: -4, scale: 0.45, maxw: 2.8 }) } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { id: "blind_desc", align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 1.5 }, nodes: [{ n: G.UIT.O, config: { object: blind_choice.animation } }] }, text_table[1] && { n: G.UIT.R, config: { align: "cm", minh: 0.7, padding: 0.05, minw: 2.9 }, nodes: blind_desc_nodes } || undefined] }, { n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0.05, minw: 3.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 3 }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_blind_score_at_least"), scale: 0.3, colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.WHITE, shadow: !disabled } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.6 }, nodes: [{ n: G.UIT.O, config: { w: 0.5, h: 0.5, colour: G.C.BLUE, object: stake_sprite, hover: true, can_collide: false } }, { n: G.UIT.B, config: { h: 0.1, w: 0.1 } }, { n: G.UIT.T, config: { text: number_format(blind_amt), scale: score_number_scale(0.9, blind_amt), colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.RED, shadow: !disabled } }] }, _reward && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_blind_reward"), scale: 0.35, colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.WHITE, shadow: !disabled } }, { n: G.UIT.T, config: { text: string.rep(localize("$"), blind_choice.config.dollars) + "+", scale: 0.35, colour: disabled && G.C.UI.TEXT_INACTIVE || G.C.MONEY, shadow: !disabled } }] } || undefined] }] }] }] }, { n: G.UIT.R, config: { id: "blind_extras", align: "cm" }, nodes: [extras] }] };
    return t;
}
function create_UIBox_round_evaluation(): void {
    let width = G.hand.T.w - 2;
    let t = { n: G.UIT.ROOT, config: { align: "tm", colour: G.C.CLEAR }, nodes: [UIBox_dyn_container([{ n: G.UIT.R, config: { align: "tm", minw: width, minh: 3, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minw: width, minh: 1.4 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", minw: width, id: "base_round_eval" }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", minw: width, id: "bonus_round_eval" }, nodes: {} }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", minw: width, id: "eval_bottom" }, nodes: {} }], false)] };
    return t;
}
function create_UIBox_arcana_pack(): void {
    let _size = G.GAME.pack_size;
    G.pack_cards = CardArea(G.ROOM.T.x + 9 + G.hand.T.x, G.hand.T.y, _size * G.CARD_W, 1.05 * G.CARD_H, { card_limit: _size, type: "consumeable", highlight_limit: 1 });
    let t = { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cl", colour: G.C.CLEAR, r: 0.15, padding: 0.1, minh: 2, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.2, colour: G.C.CLEAR, shadow: true }, nodes: [{ n: G.UIT.O, config: { object: G.pack_cards } }] }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: {} }, { n: G.UIT.R, config: { align: "tm" }, nodes: [{ n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: {} }, { n: G.UIT.C, config: { align: "tm", padding: 0.05 }, nodes: [UIBox_dyn_container([{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 4 }, nodes: [{ n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("k_arcana_pack"), colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.7, maxw: 4, pop_in: 0.5 }) } }] }, { n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("k_choose") + " "], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }, { n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "pack_choices" }], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }] }] }])] }, { n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: [{ n: G.UIT.R, config: { minh: 0.2 }, nodes: {} }, { n: G.UIT.R, config: { align: "tm", padding: 0.2, minh: 1.2, minw: 1.8, r: 0.15, colour: G.C.GREY, one_press: true, button: "skip_booster", hover: true, shadow: true, func: "can_skip_booster" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip"), scale: 0.5, colour: G.C.WHITE, shadow: true, focus_args: { button: "y", orientation: "bm" }, func: "set_button_pip" } }] }] }] }] }] };
    return t;
}
function create_UIBox_spectral_pack(): void {
    let _size = G.GAME.pack_size;
    G.pack_cards = CardArea(G.ROOM.T.x + 9 + G.hand.T.x, G.hand.T.y, _size * G.CARD_W, 1.05 * G.CARD_H, { card_limit: _size, type: "consumeable", highlight_limit: 1 });
    let t = { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cl", colour: G.C.CLEAR, r: 0.15, padding: 0.1, minh: 2, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.2, colour: G.C.CLEAR, shadow: true }, nodes: [{ n: G.UIT.O, config: { object: G.pack_cards } }] }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: {} }, { n: G.UIT.R, config: { align: "tm" }, nodes: [{ n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: {} }, { n: G.UIT.C, config: { align: "tm", padding: 0.05 }, nodes: [UIBox_dyn_container([{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 4 }, nodes: [{ n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("k_spectral_pack"), colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.7, maxw: 4, pop_in: 0.5 }) } }] }, { n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("k_choose") + " "], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }, { n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "pack_choices" }], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }] }] }])] }, { n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: [{ n: G.UIT.R, config: { minh: 0.2 }, nodes: {} }, { n: G.UIT.R, config: { align: "tm", padding: 0.2, minh: 1.2, minw: 1.8, r: 0.15, colour: G.C.GREY, one_press: true, button: "skip_booster", hover: true, shadow: true, func: "can_skip_booster" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip"), scale: 0.5, colour: G.C.WHITE, shadow: true, focus_args: { button: "y", orientation: "bm" }, func: "set_button_pip" } }] }] }] }] }] };
    return t;
}
function create_UIBox_standard_pack(): void {
    let _size = G.GAME.pack_size;
    G.pack_cards = CardArea(G.ROOM.T.x + 9 + G.hand.T.x, G.hand.T.y, _size * G.CARD_W * 1.1, 1.05 * G.CARD_H, { card_limit: _size, type: "consumeable", highlight_limit: 1 });
    let t = { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cl", colour: G.C.CLEAR, r: 0.15, padding: 0.1, minh: 2, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.2, colour: G.C.CLEAR, shadow: true }, nodes: [{ n: G.UIT.O, config: { object: G.pack_cards } }] }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: {} }, { n: G.UIT.R, config: { align: "tm" }, nodes: [{ n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: {} }, { n: G.UIT.C, config: { align: "tm", padding: 0.05 }, nodes: [UIBox_dyn_container([{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 4 }, nodes: [{ n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("k_standard_pack"), colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.7, maxw: 4, pop_in: 0.5 }) } }] }, { n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("k_choose") + " "], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }, { n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "pack_choices" }], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }] }] }])] }, { n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: [{ n: G.UIT.R, config: { minh: 0.2 }, nodes: {} }, { n: G.UIT.R, config: { align: "tm", padding: 0.2, minh: 1.2, minw: 1.8, r: 0.15, colour: G.C.GREY, one_press: true, button: "skip_booster", hover: true, shadow: true, func: "can_skip_booster" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip"), scale: 0.5, colour: G.C.WHITE, shadow: true, focus_args: { button: "y", orientation: "bm" }, func: "set_button_pip" } }] }] }] }] }] };
    return t;
}
function create_UIBox_buffoon_pack(): void {
    let _size = G.GAME.pack_size;
    G.pack_cards = CardArea(G.ROOM.T.x + 9 + G.hand.T.x, G.hand.T.y, _size * G.CARD_W * 1.1, 1.05 * G.CARD_H, { card_limit: _size, type: "consumeable", highlight_limit: 1 });
    let t = { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cl", colour: G.C.CLEAR, r: 0.15, padding: 0.1, minh: 2, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.2, colour: G.C.CLEAR, shadow: true }, nodes: [{ n: G.UIT.O, config: { object: G.pack_cards } }] }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: {} }, { n: G.UIT.R, config: { align: "tm" }, nodes: [{ n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: {} }, { n: G.UIT.C, config: { align: "tm", padding: 0.05 }, nodes: [UIBox_dyn_container([{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 4 }, nodes: [{ n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("k_buffoon_pack"), colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.7, maxw: 4, pop_in: 0.5 }) } }] }, { n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("k_choose") + " "], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }, { n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "pack_choices" }], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }] }] }])] }, { n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: [{ n: G.UIT.R, config: { minh: 0.2 }, nodes: {} }, { n: G.UIT.R, config: { align: "tm", padding: 0.2, minh: 1.2, minw: 1.8, r: 0.15, colour: G.C.GREY, one_press: true, button: "skip_booster", hover: true, shadow: true, func: "can_skip_booster" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip"), scale: 0.5, colour: G.C.WHITE, shadow: true, focus_args: { button: "y", orientation: "bm" }, func: "set_button_pip" } }] }] }] }] }] };
    return t;
}
function create_UIBox_celestial_pack(): void {
    let _size = G.GAME.pack_size;
    G.pack_cards = CardArea(G.ROOM.T.x + 9 + G.hand.T.x, G.hand.T.y, _size * G.CARD_W * 1.1 + 0.5, 1.05 * G.CARD_H, { card_limit: _size, type: "consumeable", highlight_limit: 1 });
    let t = { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cl", colour: G.C.CLEAR, r: 0.15, padding: 0.1, minh: 2, shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.2, colour: G.C.CLEAR, shadow: true }, nodes: [{ n: G.UIT.O, config: { object: G.pack_cards } }] }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: {} }, { n: G.UIT.R, config: { align: "tm" }, nodes: [{ n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: {} }, { n: G.UIT.C, config: { align: "tm", padding: 0.05 }, nodes: [UIBox_dyn_container([{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 4 }, nodes: [{ n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize("k_celestial_pack"), colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.7, maxw: 4, pop_in: 0.5 }) } }] }, { n: G.UIT.R, config: { align: "bm", padding: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("k_choose") + " "], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }, { n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: G.GAME, ref_value: "pack_choices" }], colours: [G.C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale: 0.5, pop_in: 0.7 }) } }] }] }])] }, { n: G.UIT.C, config: { align: "tm", padding: 0.05, minw: 2.4 }, nodes: [{ n: G.UIT.R, config: { minh: 0.2 }, nodes: {} }, { n: G.UIT.R, config: { align: "tm", padding: 0.2, minh: 1.2, minw: 1.8, r: 0.15, colour: G.C.GREY, one_press: true, button: "skip_booster", hover: true, shadow: true, func: "can_skip_booster" }, nodes: [{ n: G.UIT.T, config: { text: localize("b_skip"), scale: 0.5, colour: G.C.WHITE, shadow: true, focus_args: { button: "y", orientation: "bm" }, func: "set_button_pip" } }] }] }] }] }] };
    return t;
}
function create_UIBox_card_alert(args): void {
    args = args || {};
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, refresh_movement: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.15, minw: 0.42, minh: 0.42, colour: args.no_bg && G.C.CLEAR || args.bg_col || (args.red_bad && darken(G.C.RED, 0.1) || G.C.RED), draw_layer: 1, emboss: 0.05, refresh_movement: true }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: args.text || "!", colours: [G.C.WHITE], shadow: true, rotate: true, H_offset: args.y_offset || 0, bump_rate: args.text && 3 || 7, bump_amount: args.bump_amount || 3, bump: true, maxw: args.maxw, text_rot: args.text_rot || 0.2, spacing: 3 * (args.scale || 1), scale: args.scale || 0.48 }) } }] }] };
}
function create_slider(args): void {
    args = args || {};
    args.colour = args.colour || G.C.RED;
    args.w = args.w || 1;
    args.h = args.h || 0.5;
    args.label_scale = args.label_scale || 0.5;
    args.text_scale = args.text_scale || 0.3;
    args.min = args.min || 0;
    args.max = args.max || 1;
    args.decimal_places = args.decimal_places || 0;
    args.text = string.format("%." + (tostring(args.decimal_places) + "f"), args.ref_table[args.ref_value]);
    let startval = args.w * (args.ref_table[args.ref_value] - args.min) / (args.max - args.min);
    let t = { n: G.UIT.C, config: { align: "cm", minw: args.w, min_h: args.h, padding: 0.1, r: 0.1, colour: G.C.CLEAR, focus_args: { type: "slider" } }, nodes: [{ n: G.UIT.C, config: { align: "cl", minw: args.w, r: 0.1, min_h: args.h, collideable: true, hover: true, colour: G.C.BLACK, emboss: 0.05, func: "slider", refresh_movement: true }, nodes: [{ n: G.UIT.B, config: { w: startval, h: args.h, r: 0.1, colour: args.colour, ref_table: args, refresh_movement: true } }] }, { n: G.UIT.C, config: { align: "cm", minh: args.h, r: 0.1, minw: 0.8, colour: args.colour, shadow: true }, nodes: [{ n: G.UIT.T, config: { ref_table: args, ref_value: "text", scale: args.text_scale, colour: G.C.UI.TEXT_LIGHT, decimal_places: args.decimal_places } }] }] };
    if (args.label) {
        t = { n: G.UIT.R, config: { align: "cm", minh: 1, minw: 1, padding: 0.1 * args.label_scale, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: args.label, scale: args.label_scale, colour: G.C.UI.TEXT_LIGHT } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [t] }] };
    }
    return t;
}
function create_toggle(args): void {
    args = args || {};
    args.active_colour = args.active_colour || G.C.RED;
    args.inactive_colour = args.inactive_colour || G.C.BLACK;
    args.w = args.w || 3;
    args.h = args.h || 0.5;
    args.scale = args.scale || 1;
    args.label = args.label || "TEST?";
    args.label_scale = args.label_scale || 0.4;
    args.ref_table = args.ref_table || {};
    args.ref_value = args.ref_value || "test";
    let check = new Sprite(0, 0, 0.5 * args.scale, 0.5 * args.scale, G.ASSET_ATLAS["icons"], { x: 1, y: 0 });
    check.states.drag.can = false;
    check.states.visible = false;
    let info = undefined;
    if (args.info) {
        info = {};
        for (const [k, v] of ipairs(args.info)) {
            table.insert(info, { n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: v, scale: 0.25, colour: G.C.UI.TEXT_LIGHT } }] });
        }
        info = { n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: info };
    }
    let t = { n: args.col && G.UIT.C || G.UIT.R, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.CLEAR, focus_args: { funnel_from: true } }, nodes: [{ n: G.UIT.C, config: { align: "cr", minw: args.w }, nodes: [{ n: G.UIT.T, config: { text: args.label, scale: args.label_scale, colour: G.C.UI.TEXT_LIGHT } }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }] }, { n: G.UIT.C, config: { align: "cl", minw: 0.3 * args.w }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.BLACK }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, padding: 0.03, minw: 0.4 * args.scale, minh: 0.4 * args.scale, outline_colour: G.C.WHITE, outline: 1.2 * args.scale, line_emboss: 0.5 * args.scale, ref_table: args, colour: args.inactive_colour, button: "toggle_button", button_dist: 0.2, hover: true, toggle_callback: args.callback, func: "toggle", focus_args: { funnel_to: true } }, nodes: [{ n: G.UIT.O, config: { object: check } }] }] }] }] };
    if (args.info) {
        t = { n: args.col && G.UIT.C || G.UIT.R, config: { align: "cm" }, nodes: [t, info] };
    }
    return t;
}
function create_option_cycle(args): void {
    args = args || {};
    args.colour = args.colour || G.C.RED;
    args.options = args.options || ["Option 1", "Option 2"];
    args.current_option = args.current_option || 1;
    args.current_option_val = args.options[args.current_option];
    args.opt_callback = args.opt_callback || undefined;
    args.scale = args.scale || 1;
    args.ref_table = args.ref_table || undefined;
    args.ref_value = args.ref_value || undefined;
    args.w = (args.w || 2.5) * args.scale;
    args.h = (args.h || 0.8) * args.scale;
    args.text_scale = (args.text_scale || 0.5) * args.scale;
    args.l = "<";
    args.r = ">";
    args.focus_args = args.focus_args || {};
    args.focus_args.type = "cycle";
    let info = undefined;
    if (args.info) {
        info = {};
        for (const [k, v] of ipairs(args.info)) {
            table.insert(info, { n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: v, scale: 0.3 * args.scale, colour: G.C.UI.TEXT_LIGHT } }] });
        }
        info = { n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: info };
    }
    let disabled = args.options.length < 2;
    let pips = {};
    for (let i = 1; i <= args.options.length; i++) {
        pips[pips.length + 1] = { n: G.UIT.B, config: { w: 0.1 * args.scale, h: 0.1 * args.scale, r: 0.05, id: "pip_" + i, colour: args.current_option === i && G.C.WHITE || G.C.BLACK } };
    }
    let choice_pips = !args.no_pips && { n: G.UIT.R, config: { align: "cm", padding: (0.05 - (args.options.length > 15 && 0.03 || 0)) * args.scale }, nodes: pips } || undefined;
    let t = { n: G.UIT.C, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.CLEAR, id: args.id && (!args.label && args.id || undefined) || undefined, focus_args: args.focus_args }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, minw: 0.6 * args.scale, hover: !disabled, colour: !disabled && args.colour || G.C.BLACK, shadow: !disabled, button: !disabled && "option_cycle" || undefined, ref_table: args, ref_value: "l", focus_args: { type: "none" } }, nodes: [{ n: G.UIT.T, config: { ref_table: args, ref_value: "l", scale: args.text_scale, colour: !disabled && G.C.UI.TEXT_LIGHT || G.C.UI.TEXT_INACTIVE } }] }, args.mid && { n: G.UIT.C, config: { id: "cycle_main" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: [args.mid] }, !disabled && choice_pips || undefined] } || { n: G.UIT.C, config: { id: "cycle_main", align: "cm", minw: args.w, minh: args.h, r: 0.1, padding: 0.05, colour: args.colour, emboss: 0.1, hover: true, can_collide: true, on_demand_tooltip: args.on_demand_tooltip }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ ref_table: args, ref_value: "current_option_val" }], colours: [G.C.UI.TEXT_LIGHT], pop_in: 0, pop_in_rate: 8, reset_pop_in: true, shadow: true, float: true, silent: true, bump: true, scale: args.text_scale, non_recalc: true }) } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.05 }, nodes: {} }, !disabled && choice_pips || undefined] }] }, { n: G.UIT.C, config: { align: "cm", r: 0.1, minw: 0.6 * args.scale, hover: !disabled, colour: !disabled && args.colour || G.C.BLACK, shadow: !disabled, button: !disabled && "option_cycle" || undefined, ref_table: args, ref_value: "r", focus_args: { type: "none" } }, nodes: [{ n: G.UIT.T, config: { ref_table: args, ref_value: "r", scale: args.text_scale, colour: !disabled && G.C.UI.TEXT_LIGHT || G.C.UI.TEXT_INACTIVE } }] }] };
    if (args.cycle_shoulders) {
        t = { n: G.UIT.R, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { minw: 0.7, align: "cm", colour: G.C.CLEAR, func: "set_button_pip", focus_args: { button: "leftshoulder", type: "none", orientation: "cm", scale: 0.7, offset: { x: -0.1, y: 0 } } }, nodes: {} }, { n: G.UIT.C, config: { id: "cycle_shoulders", padding: 0.1 }, nodes: [t] }, { n: G.UIT.C, config: { minw: 0.7, align: "cm", colour: G.C.CLEAR, func: "set_button_pip", focus_args: { button: "rightshoulder", type: "none", orientation: "cm", scale: 0.7, offset: { x: 0.1, y: 0 } } }, nodes: {} }] };
    }
    else {
        t = { n: G.UIT.R, config: { align: "cm", colour: G.C.CLEAR, padding: 0 }, nodes: [t] };
    }
    if (args.label || args.info) {
        t = { n: G.UIT.R, config: { align: "cm", padding: 0.05, id: args.id || undefined }, nodes: [args.label && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: args.label, scale: 0.5 * args.scale, colour: G.C.UI.TEXT_LIGHT } }] } || undefined, t, info] };
    }
    return t;
}
function create_tabs(args): void {
    args = args || {};
    args.colour = args.colour || G.C.RED;
    args.tab_alignment = args.tab_alignment || "cm";
    args.opt_callback = args.opt_callback || undefined;
    args.scale = args.scale || 1;
    args.tab_w = args.tab_w || 0;
    args.tab_h = args.tab_h || 0;
    args.text_scale = args.text_scale || 0.5;
    args.tabs = args.tabs || [{ label: "tab 1", chosen: true, func: undefined, tab_definition_function: function () {
                return { n: G.UIT.ROOT, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "A", scale: 1, colour: G.C.UI.TEXT_LIGHT } }] };
            } }, { label: "tab 2", chosen: false, tab_definition_function: function () {
                return { n: G.UIT.ROOT, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "B", scale: 1, colour: G.C.UI.TEXT_LIGHT } }] };
            } }, { label: "tab 3", chosen: false, tab_definition_function: function () {
                return { n: G.UIT.ROOT, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "C", scale: 1, colour: G.C.UI.TEXT_LIGHT } }] };
            } }];
    let tab_buttons = {};
    for (const [k, v] of ipairs(args.tabs)) {
        if (v.chosen) {
            args.current = { k: k, v: v };
        }
        tab_buttons[tab_buttons.length + 1] = UIBox_button({ id: "tab_but_" + (v.label || ""), ref_table: v, button: "change_tab", label: [v.label], minh: 0.8 * args.scale, minw: 2.5 * args.scale, col: true, choice: true, scale: args.text_scale, chosen: v.chosen, func: v.func, colour: args.colour, focus_args: { type: "none" } });
    }
    let t = { n: G.UIT.R, config: { padding: 0, align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: G.C.CLEAR }, nodes: [args.tabs.length > 1 && !args.no_shoulders && { n: G.UIT.C, config: { minw: 0.7, align: "cm", colour: G.C.CLEAR, func: "set_button_pip", focus_args: { button: "leftshoulder", type: "none", orientation: "cm", scale: 0.7, offset: { x: -0.1, y: 0 } } }, nodes: {} } || undefined, { n: G.UIT.C, config: { id: args.no_shoulders && "no_shoulders" || "tab_shoulders", ref_table: args, align: "cm", padding: 0.15, group: 1, collideable: true, focus_args: args.tabs.length > 1 && { type: "tab", nav: "wide", snap_to: args.snap_to_nav, no_loop: args.no_loop } || undefined }, nodes: tab_buttons }, args.tabs.length > 1 && !args.no_shoulders && { n: G.UIT.C, config: { minw: 0.7, align: "cm", colour: G.C.CLEAR, func: "set_button_pip", focus_args: { button: "rightshoulder", type: "none", orientation: "cm", scale: 0.7, offset: { x: 0.1, y: 0 } } }, nodes: {} } || undefined] }, { n: G.UIT.R, config: { align: args.tab_alignment, padding: args.padding || 0.1, no_fill: true, minh: args.tab_h, minw: args.tab_w }, nodes: [{ n: G.UIT.O, config: { id: "tab_contents", object: new UIBox({ definition: args.current.v.tab_definition_function(args.current.v.tab_definition_function_args), config: { offset: { x: 0, y: 0 } } }) } }] }] };
    return t;
}
function create_text_input(args): void {
    args = args || {};
    args.colour = copy_table(args.colour) || copy_table(G.C.BLUE);
    args.hooked_colour = copy_table(args.hooked_colour) || darken(copy_table(G.C.BLUE), 0.3);
    args.w = args.w || 2.5;
    args.h = args.h || 0.7;
    args.text_scale = args.text_scale || 0.4;
    args.max_length = args.max_length || 16;
    args.all_caps = args.all_caps || false;
    args.prompt_text = args.prompt_text || localize("k_enter_text");
    args.current_prompt_text = "";
    args.id = args.id || "text_input";
    let text = { ref_table: args.ref_table, ref_value: args.ref_value, letters: {}, current_position: string.len(args.ref_table[args.ref_value]) };
    let ui_letters = {};
    for (let i = 1; i <= args.max_length; i++) {
        text.letters[i] = args.ref_table[args.ref_value] && (string.sub(args.ref_table[args.ref_value], i, i) || "") || "";
        ui_letters[i] = { n: G.UIT.T, config: { ref_table: text.letters, ref_value: i, scale: args.text_scale, colour: G.C.UI.TEXT_LIGHT, id: args.id + ("_letter_" + i) } };
    }
    args.text = text;
    let position_text_colour = lighten(copy_table(G.C.BLUE), 0.4);
    ui_letters[ui_letters.length + 1] = { n: G.UIT.T, config: { ref_table: args, ref_value: "current_prompt_text", scale: args.text_scale, colour: lighten(copy_table(args.colour), 0.4), id: args.id + "_prompt" } };
    ui_letters[ui_letters.length + 1] = { n: G.UIT.B, config: { r: 0.03, w: 0.1, h: 0.4, colour: position_text_colour, id: args.id + "_position", func: "flash" } };
    let t = { n: G.UIT.C, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { id: args.id, align: "cm", padding: 0.05, r: 0.1, hover: true, colour: args.colour, minw: args.w, min_h: args.h, button: "select_text_input", shadow: true }, nodes: [{ n: G.UIT.R, config: { ref_table: args, padding: 0.05, align: "cm", r: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { ref_table: args, align: "cm", r: 0.1, colour: G.C.CLEAR, func: "text_input" }, nodes: ui_letters }] }] }] };
    return t;
}
function create_keyboard_input(args): void {
    let keyboard_rows = ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM", args.space_key && " " || undefined];
    let keyboard_button_rows = [{}, {}, {}, {}, {}];
    for (const [k, v] of ipairs(keyboard_rows)) {
        for (let i = 1; i <= v.length; i++) {
            let c = v.sub(i, i);
            keyboard_button_rows[k][keyboard_button_rows[k].length + 1] = create_keyboard_button(c, c === " " && "y" || undefined);
        }
    }
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 15, r: 0.1, colour: [G.C.GREY[1], G.C.GREY[2], G.C.GREY[3], 0.7] }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.BLACK, emboss: 0.05, r: 0.1, mid: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.07, colour: G.C.CLEAR }, nodes: keyboard_button_rows[1] }, { n: G.UIT.R, config: { align: "cm", padding: 0.07, colour: G.C.CLEAR }, nodes: keyboard_button_rows[2] }, { n: G.UIT.R, config: { align: "cm", padding: 0.07, colour: G.C.CLEAR }, nodes: keyboard_button_rows[3] }, { n: G.UIT.R, config: { align: "cm", padding: 0.07, colour: G.C.CLEAR }, nodes: keyboard_button_rows[4] }, { n: G.UIT.R, config: { align: "cm", padding: 0.07, colour: G.C.CLEAR }, nodes: keyboard_button_rows[5] }] }, (args.backspace_key || args.return_key) && { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [args.backspace_key && { n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_keyboard_button("backspace", "x")] } || undefined, args.return_key && { n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_keyboard_button("return", "start")] } || undefined, { n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_keyboard_button("back", "b")] }] } || undefined] }] }] }] };
}
function create_keyboard_button(key, binding): void {
    let key_label = key === "backspace" && "Backspace" || key === " " && "Space" || key === "back" && "Back" || key === "return" && "Enter" || key;
    return UIBox_button({ label: [key_label], button: "key_button", ref_table: { key: key === "back" && "return" || key }, minw: key === " " && 6 || key === "return" && 2.5 || key === "backspace" && 2.5 || key === "back" && 2.5 || 0.8, minh: key === "return" && 1.5 || key === "backspace" && 1.5 || key === "back" && 0.8 || 0.7, col: true, colour: G.C.GREY, focus_args: binding && { button: binding, orientation: (key === " " || key === "back") && "cr" || "bm", set_button_pip: true } || undefined });
}
function create_dynatext_pips(args): void {
    args = args || {};
    args.active_colour = copy_table(args.colour) || G.C.RED;
    args.inactive_colour = copy_table(args.inactive_colour) || [0, 0, 0, 0.08];
    args.w = args.w || 0.07;
    args.h = args.h || 0.07;
    if (!args.dynatext || !(args.dynatext.strings.length > 1)) {
        return;
    }
    let pips = {};
    for (let i = 1; i <= args.dynatext.strings.length; i++) {
        pips[i] = { n: G.UIT.C, config: { ref_table: args.dynatext, minw: args.w, minh: args.h, colour: G.C.UI.TEXT_INACTIVE, r: 0.1, id: "pip_" + i, pipcol1: args.active_colour, pipcol2: args.inactive_colour, func: "pip_dynatext" } };
    }
    return { n: G.UIT.R, config: { padding: 0.05, align: "cm" }, nodes: pips };
}
function create_UIBox_options(): void {
    let current_seed = undefined;
    let restart = undefined;
    let main_menu = undefined;
    let mods = undefined;
    let your_collection = undefined;
    let credits = undefined;
    let customize = undefined;
    G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
            G.REFRESH_ALERTS = true;
            return true;
        } }));
    if (G.STAGE === G.STAGES.RUN) {
        restart = UIBox_button({ id: "restart_button", label: [localize("b_start_new_run")], button: "setup_run", minw: 5 });
        main_menu = UIBox_button({ label: [localize("b_main_menu")], button: "go_to_menu", minw: 5 });
        mods = UIBox_button({ id: "mods_button", label: [localize("b_mods")], button: "mods_button", minw: 5 });
        your_collection = UIBox_button({ label: [localize("b_collection")], button: "your_collection", minw: 5, id: "your_collection" });
        current_seed = { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_seed") + ": ", scale: 0.4, colour: G.C.WHITE } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0, minh: 0.8 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0, minh: 0.8 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, colour: G.GAME.seeded && G.C.RED || G.C.BLACK, minw: 1.8, minh: 0.5, padding: 0.1, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: tostring(G.GAME.pseudorandom.seed), scale: 0.43, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }] }, UIBox_button({ col: true, button: "copy_seed", label: [localize("b_copy")], colour: G.C.BLUE, scale: 0.3, minw: 1.3, minh: 0.5 })] };
    }
    if (G.STAGE === G.STAGES.MAIN_MENU) {
        credits = UIBox_button({ label: [localize("b_credits")], button: "show_credits", minw: 5 });
    }
    let settings = UIBox_button({ button: "settings", label: [localize("b_settings")], minw: 5, focus_args: { snap_to: true } });
    let high_scores = UIBox_button({ label: [localize("b_stats")], button: "high_scores", minw: 5 });
    let customize = UIBox_button({ label: [localize("b_customize_deck")], button: "customize_deck", minw: 5 });
    let t = create_UIBox_generic_options({ contents: [settings, G.GAME.seeded && current_seed || undefined, restart, main_menu, mods, high_scores, your_collection, customize, credits] });
    return t;
}
function create_UIBox_settings(): void {
    let tabs = {};
    tabs[tabs.length + 1] = { label: localize("b_set_game"), chosen: true, tab_definition_function: G.UIDEF.settings_tab, tab_definition_function_args: "Game" };
    if (G.F_VIDEO_SETTINGS) {
        tabs[tabs.length + 1] = { label: localize("b_set_video"), tab_definition_function: G.UIDEF.settings_tab, tab_definition_function_args: "Video" };
    }
    tabs[tabs.length + 1] = { label: localize("b_set_graphics"), tab_definition_function: G.UIDEF.settings_tab, tab_definition_function_args: "Graphics" };
    tabs[tabs.length + 1] = { label: localize("b_set_audio"), tab_definition_function: G.UIDEF.settings_tab, tab_definition_function_args: "Audio" };
    let t = create_UIBox_generic_options({ back_func: "options", contents: [create_tabs({ tabs: tabs, tab_h: 7.05, tab_alignment: "tm", snap_to_nav: true })] });
    return t;
}
G.UIDEF.settings_tab = function (tab) {
    if (tab === "Game") {
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_option_cycle({ label: localize("b_set_gamespeed"), scale: 0.8, options: [0.5, 1, 2, 4], opt_callback: "change_gamespeed", current_option: G.SETTINGS.GAMESPEED === 0.5 && 1 || G.SETTINGS.GAMESPEED === 4 && 4 || G.SETTINGS.GAMESPEED + 1 }), create_option_cycle({ w: 5, label: localize("b_set_play_discard_pos"), scale: 0.8, options: localize("ml_play_discard_pos_opt"), opt_callback: "change_play_discard_position", current_option: G.SETTINGS.play_button_pos }), G.F_RUMBLE && create_toggle({ label: localize("b_set_rumble"), ref_table: G.SETTINGS, ref_value: "rumble" }) || undefined, create_slider({ label: localize("b_set_screenshake"), w: 4, h: 0.4, ref_table: G.SETTINGS, ref_value: "screenshake", min: 0, max: 100 }), create_toggle({ label: localize("ph_display_stickers"), ref_table: G.SETTINGS, ref_value: "run_stake_stickers" }), create_toggle({ label: localize("b_high_contrast_cards"), ref_table: G.SETTINGS, ref_value: "colourblind_option", callback: G.FUNCS.refresh_contrast_mode }), create_toggle({ label: localize("b_reduced_motion"), ref_table: G.SETTINGS, ref_value: "reduced_motion" }), G.F_CRASH_REPORTS && create_toggle({ label: localize("b_set_crash_reports"), ref_table: G.SETTINGS, ref_value: "crashreports", info: localize("ml_crash_report_info") }) || undefined] };
    }
    else if (tab === "Video") {
        G.SETTINGS.QUEUED_CHANGE = {};
        let res_option = GET_DISPLAYINFO(G.SETTINGS.WINDOW.screenmode, G.SETTINGS.WINDOW.selected_display);
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_option_cycle({ w: 4, scale: 0.8, label: localize("b_set_monitor"), options: G.SETTINGS.WINDOW.display_names, opt_callback: "change_display", current_option: G.SETTINGS.WINDOW.selected_display }), create_option_cycle({ w: 4, scale: 0.8, label: localize("b_set_windowmode"), options: localize("ml_windowmode_opt"), opt_callback: "change_screenmode", current_option: { Windowed: 1, Fullscreen: 2, Borderless: 3 }[G.SETTINGS.WINDOW.screenmode] || 1 }), { n: G.UIT.R, config: { align: "cm", id: "resolution_cycle" }, nodes: [create_option_cycle({ w: 4, scale: 0.8, options: G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display].screen_resolutions.strings, opt_callback: "change_screen_resolution", current_option: res_option || 1 })] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ w: 4, scale: 0.8, options: localize("ml_vsync_opt"), opt_callback: "change_vsync", current_option: G.SETTINGS.WINDOW.vsync === 0 && 2 || 1 })] }, UIBox_button({ button: "apply_window_changes", label: [localize("b_set_apply")], minw: 3, func: "can_apply_window_changes" })] };
    }
    else if (tab === "Audio") {
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_slider({ label: localize("b_set_master_vol"), w: 5, h: 0.4, ref_table: G.SETTINGS.SOUND, ref_value: "volume", min: 0, max: 100 }), create_slider({ label: localize("b_set_music_vol"), w: 5, h: 0.4, ref_table: G.SETTINGS.SOUND, ref_value: "music_volume", min: 0, max: 100 }), create_slider({ label: localize("b_set_game_vol"), w: 5, h: 0.4, ref_table: G.SETTINGS.SOUND, ref_value: "game_sounds_volume", min: 0, max: 100 })] };
    }
    else if (tab === "Graphics") {
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [create_option_cycle({ w: 4, scale: 0.8, label: localize("b_set_shadows"), options: localize("ml_shadow_opt"), opt_callback: "change_shadows", current_option: G.SETTINGS.GRAPHICS.shadows === "On" && 1 || 2 }), create_option_cycle({ w: 4, scale: 0.8, label: localize("b_set_pixel_smoothing"), options: localize("ml_smoothing_opt"), opt_callback: "change_pixel_smoothing", current_option: G.SETTINGS.GRAPHICS.texture_scaling }), create_slider({ label: localize("b_set_CRT"), w: 4, h: 0.4, ref_table: G.SETTINGS.GRAPHICS, ref_value: "crt", min: 0, max: 100 }), create_option_cycle({ w: 4, scale: 0.8, label: localize("b_set_CRT_bloom"), options: localize("ml_bloom_opt"), opt_callback: "change_crt_bloom", current_option: G.SETTINGS.GRAPHICS.bloom }), create_option_cycle({ label: localize("b_graphics_mipmap_level"), scale: 0.8, options: SMODS.config.graphics_mipmap_level_options, opt_callback: "SMODS_change_mipmap", current_option: SMODS.config.graphics_mipmap_level })] };
    }
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR, minh: 5, minw: 5 }, nodes: {} };
};
function create_UIBox_test_framework(variables): void {
    variables = variables || {};
    let nodes = {};
    for (const [k, v] of pairs(variables)) {
        if (v.type === "cycle") {
            table.insert(nodes, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: v.label || "", scale: 0.5, colour: G.C.UI.TEXT_DARK } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ options: v.options, opt_callback: "test_framework_cycle_callback", ref_table: v.ref_table, ref_value: v.ref_value })] }] });
        }
        else if (v.type === "slider") {
            table.insert(nodes, { n: G.UIT.R, config: { align: "cm", minh: 1, minw: 1, padding: 0.05, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: v.label, scale: 0.5, colour: G.C.UI.TEXT_DARK } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [create_slider({ w: 5, h: 0.4, ref_table: v.ref_table, ref_value: v.ref_value, min: v.min || 0, max: v.max || 1 })] }] });
        }
        else if (v.type === "text_input") {
            table.insert(nodes, { n: G.UIT.R, config: { align: "cm", minh: 1, minw: 1, padding: 0.05, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: v.label, scale: 0.5, colour: G.C.UI.TEXT_DARK } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [create_text_input(v.options)] }] });
        }
    }
    let t = { n: G.UIT.ROOT, config: { align: "cm", minw: G.ROOM.T.w * 5, minh: G.ROOM.T.h * 5, padding: 0.15, r: 0.1, colour: [G.C.BLACK[1], G.C.BLACK[2], G.C.BLACK[3], 0.6] }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: 1, r: 0.3, padding: 0.1, minw: 1, colour: G.C.WHITE, shadow: true }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: 1, r: 0.2, padding: 0.2, minw: 1, colour: G.C.CLEAR, outline: 1, outline_colour: G.C.BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: nodes }, { n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, hover: true, colour: G.C.ORANGE, button: "exit_overlay_menu", shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.T, config: { text: "Back", scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] }] }] }] };
    return t;
}
G.UIDEF.usage_tabs = function () {
    return create_UIBox_generic_options({ back_func: "high_scores", contents: [create_tabs({ tabs: [{ label: localize("b_stat_jokers"), chosen: true, tab_definition_function: create_UIBox_usage, tab_definition_function_args: ["joker_usage"] }, { label: localize("b_stat_consumables"), tab_definition_function: create_UIBox_usage, tab_definition_function_args: ["consumeable_usage"] }, { label: localize("b_stat_tarots"), tab_definition_function: create_UIBox_usage, tab_definition_function_args: ["consumeable_usage", "Tarot"] }, { label: localize("b_stat_planets"), tab_definition_function: create_UIBox_usage, tab_definition_function_args: ["consumeable_usage", "Planet"] }, { label: localize("b_stat_spectrals"), tab_definition_function: create_UIBox_usage, tab_definition_function_args: ["consumeable_usage", "Spectral"] }, { label: localize("b_stat_vouchers"), tab_definition_function: create_UIBox_usage, tab_definition_function_args: ["voucher_usage", "Voucher"] }], tab_h: 8, snap_to_nav: true })] });
};
function create_UIBox_usage(args): void {
    args = args || {};
    [_type, _set] = [args[1], args[2]];
    let used_cards = {};
    let max_amt = 0;
    for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile][_type])) {
        if (G.P_CENTERS[k] && (!_set || G.P_CENTERS[k].set === _set) && G.P_CENTERS[k].discovered) {
            used_cards[used_cards.length + 1] = { count: v.count, key: k };
            if (v.count > max_amt) {
                max_amt = v.count;
            }
        }
    }
    let _col = G.C.SECONDARY_SET[_set] || G.C.RED;
    table.sort(used_cards, function (a, b) {
        return a.count > b.count;
    });
    let histograms = {};
    for (let i = 1; i <= 10; i++) {
        let v = used_cards[i];
        if (v) {
            let card = Card(0, 0, 0.7 * G.CARD_W, 0.7 * G.CARD_H, undefined, G.P_CENTERS[v.key]);
            card.ambient_tilt = 0.8;
            let cardarea = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, G.CARD_W * 0.7, G.CARD_H * 0.7, { card_limit: 2, type: "title", highlight_limit: 0 });
            cardarea.emplace(card);
            histograms[histograms.length + 1] = { n: G.UIT.C, config: { align: "bm", minh: 6.2, colour: G.C.UI.TRANSPARENT_DARK, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "bm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.7 * G.CARD_H + 0.1 }, nodes: [{ n: G.UIT.O, config: { object: cardarea } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: v.count, scale: 0.35, colour: mix_colours(G.C.FILTER, G.C.WHITE, 0.8), shadow: true } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: v.count / max_amt * 3.6, minw: 0.8, colour: G.C.SECONDARY_SET[G.P_CENTERS[v.key].set] || G.C.RED, res: 0.15, r: 0.001 }, nodes: {} }] }] }] };
        }
        else {
            histograms[histograms.length + 1] = { n: G.UIT.C, config: { align: "bm", minh: 6.2, colour: G.C.UI.TRANSPARENT_DARK, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "bm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.7 * G.CARD_H + 0.1, minw: 0.7 * G.CARD_W }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: "-", scale: 0.35, colour: mix_colours(G.C.FILTER, G.C.WHITE, 0.8), shadow: true } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.2, minw: 0.8, colour: G.C.UI.TRANSPARENT_LIGHT, res: 0.15, r: 0.001 }, nodes: {} }] }] }] };
        }
    }
    let t = { n: G.UIT.ROOT, config: { align: "cm", minw: 3, padding: 0.1, r: 0.1, colour: G.C.UI.TRANSPARENT_DARK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.B, config: { w: 0.2, h: 0.2, r: 0.1, colour: G.C.FILTER } }, { n: G.UIT.T, config: { text: _type === "joker_usage" && localize("ph_stat_joker") || _type === "consumeable_usage" && localize("ph_stat_consumable") || _type === "voucher_usage" && localize("ph_stat_voucher"), scale: 0.35, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: histograms }] };
    return t;
}
function create_UIBox_customize_deck(): void {
    let suitTabs = {};
    let index = 1;
    for (const [i, suit] of ipairs(SMODS.Suit.obj_list(true))) {
        if (G.COLLABS.options[suit.key]) {
            suitTabs[index] = { label: localize(suit.key, "suits_plural"), tab_definition_function: G.UIDEF.custom_deck_tab, tab_definition_function_args: suit.key };
            index = index + 1;
        }
    }
    if (suitTabs[1]) {
        suitTabs[1].chosen = true;
    }
    let t = create_UIBox_generic_options({ back_func: "options", snap_back: undefined, contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [create_tabs({ tabs: suitTabs, snap_to_nav: true, no_shoulders: true })] }] });
    return t;
}
G.UIDEF.custom_deck_tab = function (_suit) {
    let t = {};
    let rankCount = 0;
    let lookup = {};
    for (const [i, s] of ipairs(SMODS.Suit.obj_list(true))) {
        let options = G.COLLABS.options[s.key];
        for (let i = 1; i <= options.length; i++) {
            let skin = SMODS.DeckSkins[options[i]];
            if (skin.palettes && !(skin.display_ranks || skin.ranks)) {
                for (const [_, p] of ipairs(skin.palettes)) {
                    let p_ranks = p.display_ranks || p.ranks;
                    for (let j = 1; j <= p_ranks.length; j++) {
                        if (!lookup[p_ranks[j]]) {
                            lookup[p_ranks[j]] = true;
                            rankCount = rankCount + 1;
                        }
                    }
                }
            }
            else if (!skin.palettes && (skin.display_ranks || skin.ranks)) {
                let ranks = skin.display_ranks || skin.ranks;
                for (let j = 1; j <= ranks.length; j++) {
                    if (!lookup[skin.ranks[j]]) {
                        lookup[skin.ranks[j]] = true;
                        rankCount = rankCount + 1;
                    }
                }
            }
        }
    }
    G.cdds_cards = CardArea(0, 0, math.min(math.max(rankCount * G.CARD_W * 0.6, 4 * G.CARD_W), 10 * G.CARD_W), 1.4 * G.CARD_H, { card_limit: rankCount, type: "title", highlight_limit: 0 });
    G.cdds_cards.rankCount = rankCount;
    table.insert(t, { n: G.UIT.R, config: { align: "cm", colour: G.C.BLACK, r: 0.1, padding: 0.07, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.cdds_cards } }] });
    let loc_options = localize(_suit, "collabs");
    let conv_loc_options = {};
    for (const [k, v] of pairs(loc_options)) {
        conv_loc_options[tonumber(k)] = v;
    }
    loc_options = conv_loc_options;
    let current_option = 1;
    for (const [k, v] of pairs(G.COLLABS.options[_suit])) {
        if (G.SETTINGS.CUSTOM_DECK.Collabs[_suit] === v) {
            current_option = k;
        }
    }
    table.insert(t, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ options: loc_options, w: 5.5, cycle_shoulders: true, curr_suit: _suit, opt_callback: "change_collab", current_option: current_option, colour: G.C.RED, focus_args: { snap_to: true, nav: "wide" } })] });
    let deckskin_key = G.COLLABS.options[_suit][current_option];
    let palette_loc_options = SMODS.DeckSkin.get_palette_loc_options(deckskin_key, _suit);
    let selected_palette = 1;
    for (const [i, v] of ipairs(G.COLLABS.colour_palettes[deckskin_key])) {
        if (G.SETTINGS.colour_palettes[_suit] === v) {
            selected_palette = i;
        }
    }
    table.insert(t, { n: G.UIT.R, config: { align: "cm", id: "palette_selector" }, nodes: [create_option_cycle({ options: palette_loc_options, w: 5.5, cycle_shoulders: false, curr_suit: _suit, curr_skin: deckskin_key, opt_callback: "change_colour_palette", current_option: selected_palette, colour: G.C.ORANGE, focus_args: { snap_to: true, nav: "wide" } })] });
    let faces = ["K", "Q", "J"];
    G.FUNCS.update_collab_cards(current_option, _suit, true);
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0, colour: G.C.CLEAR, r: 0.1, minw: 7, minh: 4.2 }, nodes: t };
};
function create_UIBox_high_scores(): void {
    fetch_achievements();
    set_profile_progress();
    set_discover_tallies();
    let scores = [create_UIBox_high_scores_row("hand"), create_UIBox_high_scores_row("furthest_round"), create_UIBox_high_scores_row("furthest_ante"), create_UIBox_high_scores_row("poker_hand"), create_UIBox_high_scores_row("most_money"), create_UIBox_high_scores_row("win_streak")];
    G.focused_profile = G.SETTINGS.profile;
    let cheevs = {};
    let t = create_UIBox_generic_options({ back_func: "options", snap_back: true, contents: [{ n: G.UIT.C, config: { align: "cm", minw: 3, padding: 0.2, r: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: scores }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.CLEAR }, nodes: [create_progress_box(), UIBox_button({ button: "usage", label: [localize("k_card_stats")], minw: 7.5, minh: 1, focus_args: { nav: "wide" } })] }, !G.F_NO_ACHIEVEMENTS && { n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.CLEAR }, nodes: cheevs } || undefined] });
    return t;
}
function create_progress_box(_profile_progress, smaller): void {
    let [rows, protos] = [{}, ["collection", "challenges", "joker_stickers", "deck_stake_wins"]];
    _profile_progress = _profile_progress || G.PROFILES[G.SETTINGS.profile].progress;
    [_profile_progress.overall_tally, _profile_progress.overall_of] = [_profile_progress.discovered.tally / _profile_progress.discovered.of + _profile_progress.deck_stakes.tally / _profile_progress.deck_stakes.of + _profile_progress.joker_stickers.tally / _profile_progress.joker_stickers.of + _profile_progress.challenges.tally / _profile_progress.challenges.of, 4];
    let text_scale = smaller && 0.7 || 1;
    let bar_colour = G.PROFILES[G.focused_profile].all_unlocked && G.C.RED || G.C.BLUE;
    for (const [_, v] of ipairs(protos)) {
        let [tab, val, max] = [undefined, undefined, undefined];
        if (v === "collection") {
            [tab, val, max] = [_profile_progress.discovered, "tally", _profile_progress.discovered.of];
        }
        else if (v === "deck_stake_wins") {
            [tab, val, max] = [_profile_progress.deck_stakes, "tally", _profile_progress.deck_stakes.of];
        }
        else if (v === "joker_stickers") {
            [tab, val, max] = [_profile_progress.joker_stickers, "tally", _profile_progress.joker_stickers.of];
        }
        else if (v === "challenges") {
            [tab, val, max] = [_profile_progress.challenges, "tally", _profile_progress.challenges.of];
        }
        let filling = v === "collection" && [{ n: G.UIT.O, config: { object: DynaText({ string: [math.floor(0.01 + 100 * _profile_progress.discovered.tally / _profile_progress.discovered.of) + "%"], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.55 * text_scale }) } }, { n: G.UIT.T, config: { text: " (" + (_profile_progress.discovered.tally + ("/" + (_profile_progress.discovered.of + ")"))), scale: 0.35, colour: G.C.JOKER_GREY } }] || v === "deck_stake_wins" && [{ n: G.UIT.O, config: { object: DynaText({ string: [math.floor(0.01 + 100 * _profile_progress.deck_stakes.tally / _profile_progress.deck_stakes.of) + "%"], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.55 * text_scale }) } }, { n: G.UIT.T, config: { text: " (" + (_profile_progress.deck_stakes.tally + ("/" + (_profile_progress.deck_stakes.of + ")"))), scale: 0.35, colour: G.C.JOKER_GREY } }] || v === "joker_stickers" && [{ n: G.UIT.O, config: { object: DynaText({ string: [math.floor(0.01 + 100 * _profile_progress.joker_stickers.tally / _profile_progress.joker_stickers.of) + "%"], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.55 * text_scale }) } }, { n: G.UIT.T, config: { text: " (" + (_profile_progress.joker_stickers.tally + ("/" + (_profile_progress.joker_stickers.of + ")"))), scale: 0.35, colour: G.C.JOKER_GREY } }] || v === "challenges" && [{ n: G.UIT.O, config: { object: DynaText({ string: [math.floor(0.01 + 100 * _profile_progress.challenges.tally / _profile_progress.challenges.of) + "%"], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.55 * text_scale }) } }, { n: G.UIT.T, config: { text: " (" + (_profile_progress.challenges.tally + ("/" + (_profile_progress.challenges.of + ")"))), scale: 0.35, colour: G.C.JOKER_GREY } }];
        rows[rows.length + 1] = { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: darken(G.C.JOKER_GREY, 0.1), emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 3.5 * text_scale, maxw: 3.5 * text_scale }, nodes: [{ n: G.UIT.T, config: { text: localize("k_" + v), scale: 0.5 * text_scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cl", minh: smaller && 0.5 || 0.8, r: 0.1, minw: 3.5 * text_scale, colour: G.C.BLACK, emboss: 0.05, progress_bar: { max: max, ref_table: tab, ref_value: val, empty_col: G.C.BLACK, filled_col: adjust_alpha(bar_colour, 0.5) } }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: 3.5 * text_scale }, nodes: filling }] }] };
    }
    return { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 3.5 * text_scale, maxw: 3.5 * text_scale }, nodes: [{ n: G.UIT.T, config: { text: localize("k_progress"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cl", minh: 0.6, r: 0.1, minw: 3.5 * text_scale, colour: G.C.BLACK, emboss: 0.05, progress_bar: { max: _profile_progress.overall_of, ref_table: _profile_progress, ref_value: "overall_tally", empty_col: G.C.BLACK, filled_col: adjust_alpha(bar_colour, 0.5) } }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: 3.5 * text_scale }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [math.floor(0.01 + 100 * _profile_progress.overall_tally / _profile_progress.overall_of) + "%"], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.55 }) } }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: rows }] };
}
function create_UIBox_high_scores_row(score): void {
    if (!G.PROFILES[G.SETTINGS.profile].high_scores[score]) {
        return undefined;
    }
    let label_scale = 0.65 - 0.025 * math.max(string.len(G.PROFILES[G.SETTINGS.profile].high_scores[score].label) - 8, 0);
    let [label_w, score_w, h] = [3.5, 4, 0.8];
    let score_tab = {};
    if (score === "poker_hand") {
        let [handname, amount] = [localize("k_none"), 0];
        for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile].hand_usage)) {
            if (v.count > amount) {
                handname = v.order;
                amount = v.count;
            }
        }
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [amount < 1 && handname || localize(handname, "poker_hands")], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.55 }) } }, { n: G.UIT.T, config: { text: " (" + (amount + ")"), scale: 0.45, colour: G.C.JOKER_GREY } }];
    }
    else if (score === "most_money") {
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("$") + number_format(G.PROFILES[G.SETTINGS.profile].high_scores[score].amt)], colours: [G.C.MONEY], shadow: true, float: true, scale: score_number_scale(0.85, G.PROFILES[G.SETTINGS.profile].high_scores[score].amt) }) } }];
    }
    else if (score === "win_streak") {
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.PROFILES[G.SETTINGS.profile].high_scores[score].amt)], colours: [G.C.WHITE], shadow: true, float: true, scale: score_number_scale(0.85, G.PROFILES[G.SETTINGS.profile].high_scores[score].amt) }) } }, { n: G.UIT.T, config: { text: " (" + (G.PROFILES[G.SETTINGS.profile].high_scores["current_streak"].amt + ")"), scale: 0.45, colour: G.C.JOKER_GREY } }];
    }
    else if (score === "hand") {
        let chip_sprite = new Sprite(0, 0, 0.4, 0.4, G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && 2 || 1)], { x: 0, y: 0 });
        chip_sprite.states.drag.can = false;
        score_tab = [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { w: 0.4, h: 0.4, object: chip_sprite } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.PROFILES[G.SETTINGS.profile].high_scores[score].amt)], colours: [G.C.RED], shadow: true, float: true, scale: math.min(0.75, score_number_scale(1.5, G.PROFILES[G.SETTINGS.profile].high_scores[score].amt)) }) } }] }];
    }
    else if (score === "collection") {
        score_tab = [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: ["%" + math.floor(0.01 + 100 * G.PROFILES[G.SETTINGS.profile].high_scores[score].amt / G.PROFILES[G.SETTINGS.profile].high_scores[score].tot)], colours: [G.C.WHITE], shadow: true, float: true, scale: math.min(0.75, score_number_scale(1.5, G.PROFILES[G.SETTINGS.profile].high_scores[score].amt)) }) } }, { n: G.UIT.T, config: { text: " (" + (G.PROFILES[G.SETTINGS.profile].high_scores[score].amt + ("/" + (G.PROFILES[G.SETTINGS.profile].high_scores[score].tot + ")"))), scale: 0.45, colour: G.C.JOKER_GREY } }] }];
    }
    else {
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.PROFILES[G.SETTINGS.profile].high_scores[score].amt)], colours: [G.C.FILTER], shadow: true, float: true, scale: score_number_scale(0.85, G.PROFILES[G.SETTINGS.profile].high_scores[score].amt) }) } }];
    }
    return { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: darken(G.C.JOKER_GREY, 0.1), emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: label_w, maxw: label_w }, nodes: [{ n: G.UIT.T, config: { text: localize(score, "high_scores"), scale: label_scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cl", minh: h, r: 0.1, minw: score_w, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: score_w, maxw: score_w }, nodes: score_tab }] }] };
}
function create_UIBox_win(): void {
    let show_lose_cta = false;
    let eased_green = copy_table(G.C.GREEN);
    eased_green[4] = 0;
    ease_value(eased_green, 4, 0.5, undefined, undefined, true);
    let t = create_UIBox_generic_options({ padding: 0, bg_colour: eased_green, colour: G.C.BLACK, outline_colour: G.C.EDITION, no_back: true, no_esc: true, contents: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_you_win")], colours: [G.C.EDITION], shadow: true, float: true, spacing: 10, rotate: true, scale: 1.5, pop_in: 0.4, maxw: 6.5 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.15 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08 }, nodes: [create_UIBox_round_scores_row("hand"), create_UIBox_round_scores_row("poker_hand")] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.08 }, nodes: [create_UIBox_round_scores_row("cards_played", G.C.BLUE), create_UIBox_round_scores_row("cards_discarded", G.C.RED), create_UIBox_round_scores_row("cards_purchased", G.C.MONEY), create_UIBox_round_scores_row("times_rerolled", G.C.GREEN), create_UIBox_round_scores_row("new_collection", G.C.WHITE), create_UIBox_round_scores_row("seed", G.C.WHITE), UIBox_button({ button: "copy_seed", label: [localize("b_copy")], colour: G.C.BLUE, scale: 0.3, minw: 2.3, minh: 0.4 })] }, { n: G.UIT.C, config: { align: "tr", padding: 0.08 }, nodes: [create_UIBox_round_scores_row("furthest_ante", G.C.FILTER), create_UIBox_round_scores_row("furthest_round", G.C.FILTER), { n: G.UIT.R, config: { align: "cm", minh: 0.4, minw: 0.1 }, nodes: {} }, show_win_cta && UIBox_button({ id: "win_cta", button: "show_main_cta", label: [localize("b_next")], colour: G.C.GREEN, scale: 0.8, minw: 2.5, minh: 2.5, focus_args: { nav: "wide", snap_to: true } }) || undefined, !show_win_cta && UIBox_button({ id: "from_game_won", button: "notify_then_setup_run", label: [localize("b_start_new_run")], minw: 2.5, maxw: 2.5, minh: 1, focus_args: { nav: "wide", snap_to: true } }) || undefined, !show_win_cta && { n: G.UIT.R, config: { align: "cm", minh: 0.2, minw: 0.1 }, nodes: {} } || undefined, !show_win_cta && UIBox_button({ button: "go_to_menu", label: [localize("b_main_menu")], minw: 2.5, maxw: 2.5, minh: 1, focus_args: { nav: "wide" } }) || undefined] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.08 }, nodes: [UIBox_button({ button: "exit_overlay_menu", label: [localize("b_endless")], minw: 6.5, maxw: 5, minh: 1.2, scale: 0.7, shadow: true, colour: G.C.BLUE, focus_args: { nav: "wide", button: "x", set_button_pip: true } })] }] }] }] });
    t.nodes[1] = { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 2 }, nodes: [{ n: G.UIT.O, config: { padding: 0, id: "jimbo_spot", object: Moveable(0, 0, G.CARD_W * 1.1, G.CARD_H * 1.1) } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [t.nodes[1]] }] };
    t.config.id = "you_win_UI";
    return t;
}
function create_UIBox_exit_CTA(): void {
    let t = create_UIBox_generic_options({ back_label: "Quit Game", back_func: "quit", colour: G.C.BLACK, back_colour: G.C.RED, padding: 0, contents: [{ n: G.UIT.C, config: { align: "tm", padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_demo_thanks_1")], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.9 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_demo_thanks_2")], colours: [G.C.WHITE], shadow: true, bump: true, rotate: true, pop_in: 0.2, scale: 1.4 }) } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0.12, emboss: 0.1, colour: G.C.L_BLACK, r: 0.1 }, nodes: [simple_text_container("ml_demo_thanks_message", { colour: G.C.UI.TEXT_LIGHT, scale: 0.55, shadow: true }), { n: G.UIT.R, config: { align: "cm", padding: 0.2 }, nodes: [UIBox_button({ button: "wishlist_steam", label: [localize("b_wishlist")], minw: 5.9, minh: 1.1, scale: 0.5, shadow: true, colour: G.C.GREEN, focus_args: { nav: "wide", button: "x", set_button_pip: true, snap_to: true } }), UIBox_button({ button: "go_to_playbalatro", label: [localize("b_playbalatro")], minw: 4.9, minh: 0.8, scale: 0.4, shadow: true, colour: G.C.BLUE, focus_args: { nav: "wide", button: "y", set_button_pip: true } })] }] }] }] });
    t.nodes[2] = t.nodes[1];
    t.nodes[1] = { n: G.UIT.C, config: { align: "cm", padding: 2 }, nodes: [{ n: G.UIT.O, config: { padding: 0, id: "jimbo_spot", object: Moveable(0, 0, G.CARD_W * 1.1, G.CARD_H * 1.1) } }] };
    return t;
}
function create_UIBox_small_cta(): void {
    return { n: G.UIT.ROOT, config: { align: "cm", minw: 4, minh: 3 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_demo_thanks_1")], colours: [G.C.WHITE], shadow: true, float: true, scale: 0.3 }) } }] };
}
function create_UIBox_demo_video_CTA(): void {
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 21.7, blockable: false, blocking: false, func: function () {
            G.exception_queue = "other";
            G.FUNCS.go_to_demo_cta();
            G.exception_queue = undefined;
            return true;
        } }), "other");
    RESTART_MUSIC();
    let video_file = love.graphics.newVideo("resources/democta.ogv");
    let vid_sprite = new Sprite(0, 0, 11 * 16 / 9, 11, G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && 2 || 1)], { x: 0, y: 0 });
    video_file.getSource().setVolume(G.SETTINGS.SOUND.volume * G.SETTINGS.SOUND.game_sounds_volume / (100 * 100));
    vid_sprite.video = video_file;
    video_file.play();
    let t = create_UIBox_generic_options({ back_delay: 7, back_label: localize("b_skip"), back_func: "go_to_demo_cta", colour: G.C.BLACK, padding: 0, contents: [{ n: G.UIT.O, config: { object: vid_sprite } }] });
    return t;
}
function create_UIBox_game_over(): void {
    let show_lose_cta = false;
    let eased_red = copy_table(G.GAME.round_resets.ante <= G.GAME.win_ante && G.C.RED || G.C.BLUE);
    eased_red[4] = 0;
    ease_value(eased_red, 4, 0.8, undefined, undefined, true);
    let t = create_UIBox_generic_options({ bg_colour: eased_red, no_back: true, padding: 0, contents: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_game_over")], colours: [G.C.RED], shadow: true, float: true, scale: 1.5, pop_in: 0.4, maxw: 6.5 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.15 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: G.C.BLACK, emboss: 0.05, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08 }, nodes: [create_UIBox_round_scores_row("hand"), create_UIBox_round_scores_row("poker_hand")] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.08 }, nodes: [create_UIBox_round_scores_row("cards_played", G.C.BLUE), create_UIBox_round_scores_row("cards_discarded", G.C.RED), create_UIBox_round_scores_row("cards_purchased", G.C.MONEY), create_UIBox_round_scores_row("times_rerolled", G.C.GREEN), create_UIBox_round_scores_row("new_collection", G.C.WHITE), create_UIBox_round_scores_row("seed", G.C.WHITE), UIBox_button({ button: "copy_seed", label: [localize("b_copy")], colour: G.C.BLUE, scale: 0.3, minw: 2.3, minh: 0.4, focus_args: { nav: "wide" } })] }, { n: G.UIT.C, config: { align: "tr", padding: 0.08 }, nodes: [create_UIBox_round_scores_row("furthest_ante", G.C.FILTER), create_UIBox_round_scores_row("furthest_round", G.C.FILTER), create_UIBox_round_scores_row("defeated_by")] }] }] }, show_lose_cta && { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { id: "lose_cta", align: "cm", minw: 5, padding: 0.1, r: 0.1, hover: true, colour: G.C.GREEN, button: "show_main_cta", shadow: true }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.T, config: { text: localize("b_next"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT, focus_args: { nav: "wide", snap_to: true } } }] }] }] } || { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { id: "from_game_over", align: "cm", minw: 5, padding: 0.1, r: 0.1, hover: true, colour: G.C.RED, button: "notify_then_setup_run", shadow: true, focus_args: { nav: "wide", snap_to: true } }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true, maxw: 4.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_start_new_run"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] }, { n: G.UIT.R, config: { align: "cm", minw: 5, padding: 0.1, r: 0.1, hover: true, colour: G.C.RED, button: "go_to_menu", shadow: true, focus_args: { nav: "wide" } }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true, maxw: 4.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_main_menu"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] }] }] }] }] });
    t.nodes[1] = { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 2 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { padding: 0, id: "jimbo_spot", object: Moveable(0, 0, G.CARD_W * 1.1, G.CARD_H * 1.1) } }] }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [t.nodes[1]] }] };
    return t;
}
function create_UIBox_round_scores_row(score, text_colour): void {
    let label = G.GAME.round_scores[score] && localize("ph_score_" + score) || "";
    let check_high_score = false;
    let score_tab = {};
    let [label_w, score_w, h] = [{ hand: true, poker_hand: true }[score] && 3.5 || 2.9, { hand: true, poker_hand: true }[score] && 3.5 || 1, 0.5];
    if (score === "furthest_ante") {
        label_w = 1.9;
        check_high_score = true;
        label = localize("k_ante");
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.GAME.round_resets.ante)], colours: [text_colour || G.C.FILTER], shadow: true, float: true, scale: 0.45 }) } }];
    }
    if (score === "furthest_round") {
        label_w = 1.9;
        check_high_score = true;
        label = localize("k_round");
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.GAME.round)], colours: [text_colour || G.C.FILTER], shadow: true, float: true, scale: 0.45 }) } }];
    }
    if (score === "seed") {
        label_w = 1.9;
        score_w = 1.9;
        label = localize("k_seed");
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [G.GAME.pseudorandom.seed], colours: [text_colour || G.C.WHITE], shadow: true, float: true, scale: 0.45 }) } }];
    }
    if (score === "defeated_by") {
        label = localize("k_defeated_by");
        let blind_choice = { config: G.GAME.blind.config.blind || G.P_BLINDS.bl_small };
        blind_choice.animation =new AnimatedSprite(0, 0, 1.4, 1.4, G.ANIMATION_ATLAS[blind_choice.config.atlas] || G.ANIMATION_ATLAS["blind_chips"], blind_choice.config.pos);
        blind_choice.animation.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
        score_tab = [{ n: G.UIT.R, config: { align: "cm", minh: 0.6 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: localize({ type: "name_text", key: blind_choice.config.key, set: "Blind" }), colours: [G.C.WHITE], shadow: true, float: true, maxw: 2.2, scale: 0.45 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.O, config: { object: blind_choice.animation } }] }];
    }
    let label_scale = 0.5;
    if (score === "poker_hand") {
        let [handname, amount] = [localize("k_none"), 0];
        for (const [k, v] of pairs(G.GAME.hand_usage)) {
            if (v.count > amount) {
                handname = v.order;
                amount = v.count;
            }
        }
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [amount < 1 && handname || localize(handname, "poker_hands")], colours: [text_colour || G.C.WHITE], shadow: true, float: true, scale: 0.45, maxw: 2.5 }) } }, { n: G.UIT.T, config: { text: " (" + (amount + ")"), scale: 0.35, colour: G.C.JOKER_GREY } }];
    }
    else if (score === "hand") {
        check_high_score = true;
        let chip_sprite = new Sprite(0, 0, 0.3, 0.3, G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && 2 || 1)], { x: 0, y: 0 });
        chip_sprite.states.drag.can = false;
        score_tab = [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { w: 0.3, h: 0.3, object: chip_sprite } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.GAME.round_scores[score].amt)], colours: [text_colour || G.C.RED], shadow: true, float: true, scale: math.min(0.6, score_number_scale(1.2, G.GAME.round_scores[score].amt)) }) } }] }];
    }
    else if (G.GAME.round_scores[score] && !score_tab[1]) {
        score_tab = [{ n: G.UIT.O, config: { object: DynaText({ string: [number_format(G.GAME.round_scores[score].amt)], colours: [text_colour || G.C.FILTER], shadow: true, float: true, scale: score_number_scale(0.6, G.GAME.round_scores[score].amt) }) } }];
    }
    return { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: darken(G.C.JOKER_GREY, 0.1), emboss: 0.05, func: check_high_score && "high_score_alert" || undefined, id: score }, nodes: [{ n: score === "defeated_by" && G.UIT.R || G.UIT.C, config: { align: "cm", padding: 0.02, minw: label_w, maxw: label_w }, nodes: [{ n: G.UIT.T, config: { text: label, scale: label_scale, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: score === "defeated_by" && G.UIT.R || G.UIT.C, config: { align: "cr" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: h, r: 0.1, minw: score === "defeated_by" && label_w || score_w, colour: score === "seed" && G.GAME.seeded && G.C.RED || G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: score_w }, nodes: score_tab }] }] }] };
}
function create_UIBox_hand_tip(handname): void {
    if (!G.GAME.hands[handname].example) {
        return { n: G.UIT.R, config: { align: "cm" }, nodes: {} };
    }
    let cardarea = CardArea(2, 2, 3.5 * G.CARD_W, 0.75 * G.CARD_H, { card_limit: 5, type: "title", highlight_limit: 0 });
    for (const [k, v] of ipairs(G.GAME.hands[handname].example)) {
        let card = Card(0, 0, 0.5 * G.CARD_W, 0.5 * G.CARD_H, G.P_CARDS[v[1]], G.P_CENTERS.c_base);
        if (v[2]) {
            card.juice_up(0.3, 0.2);
        }
        if (k === 1) {
            play_sound("paper1", 0.95 + math.random() * 0.1, 0.3);
        }
        ease_value(card.T, "scale", v[2] && 0.25 || -0.15, undefined, "REAL", true, 0.2);
        cardarea.emplace(card);
    }
    return { n: G.UIT.R, config: { align: "cm", colour: G.C.WHITE, r: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: cardarea } }] }] };
}
function create_UIBox_current_hand_row(handname, simple): void {
    return G.GAME.hands[handname].visible && (!simple && { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: darken(G.C.JOKER_GREY, 0.1), emboss: 0.05, hover: true, force_focus: true, on_demand_tooltip: { text: localize(handname, "poker_hand_descriptions"), filler: { func: create_UIBox_hand_tip, args: handname } } }, nodes: [{ n: G.UIT.C, config: { align: "cl", padding: 0, minw: 5 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.01, r: 0.1, colour: G.C.HAND_LEVELS[math.min(7, G.GAME.hands[handname].level)], minw: 1.5, outline: 0.8, outline_colour: G.C.WHITE }, nodes: [{ n: G.UIT.T, config: { text: localize("k_level_prefix") + G.GAME.hands[handname].level, scale: 0.5, colour: G.C.UI.TEXT_DARK } }] }, { n: G.UIT.C, config: { align: "cm", minw: 4.5, maxw: 4.5 }, nodes: [{ n: G.UIT.T, config: { text: " " + localize(handname, "poker_hands"), scale: 0.45, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.BLACK, r: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cr", padding: 0.01, r: 0.1, colour: G.C.CHIPS, minw: 1.1 }, nodes: [{ n: G.UIT.T, config: { text: number_format(G.GAME.hands[handname].chips, 1000000), scale: 0.45, colour: G.C.UI.TEXT_LIGHT } }, { n: G.UIT.B, config: { w: 0.08, h: 0.01 } }] }, { n: G.UIT.T, config: { text: "X", scale: 0.45, colour: G.C.MULT } }, { n: G.UIT.C, config: { align: "cl", padding: 0.01, r: 0.1, colour: G.C.MULT, minw: 1.1 }, nodes: [{ n: G.UIT.B, config: { w: 0.08, h: 0.01 } }, { n: G.UIT.T, config: { text: number_format(G.GAME.hands[handname].mult, 1000000), scale: 0.45, colour: G.C.UI.TEXT_LIGHT } }] }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "  #", scale: 0.45, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.L_BLACK, r: 0.1, minw: 0.9 }, nodes: [{ n: G.UIT.T, config: { text: G.GAME.hands[handname].played, scale: 0.45, colour: G.C.FILTER, shadow: true } }] }] } || { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: darken(G.C.JOKER_GREY, 0.1), force_focus: true, emboss: 0.05, hover: true, on_demand_tooltip: { text: localize(handname, "poker_hand_descriptions"), filler: { func: create_UIBox_hand_tip, args: handname } }, focus_args: { snap_to: simple && handname === "Straight Flush" } }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0, minw: 5 }, nodes: [{ n: G.UIT.T, config: { text: localize(handname, "poker_hands"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }) || undefined;
}
function create_UIBox_current_hands(simple): void {
    let hands = [create_UIBox_current_hand_row("Flush Five", simple), create_UIBox_current_hand_row("Flush House", simple), create_UIBox_current_hand_row("Five of a Kind", simple), create_UIBox_current_hand_row("Straight Flush", simple), create_UIBox_current_hand_row("Four of a Kind", simple), create_UIBox_current_hand_row("Full House", simple), create_UIBox_current_hand_row("Flush", simple), create_UIBox_current_hand_row("Straight", simple), create_UIBox_current_hand_row("Three of a Kind", simple), create_UIBox_current_hand_row("Two Pair", simple), create_UIBox_current_hand_row("Pair", simple), create_UIBox_current_hand_row("High Card", simple)];
    let t = { n: G.UIT.ROOT, config: { align: "cm", minw: 3, padding: 0.1, r: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.04 }, nodes: hands }] };
    return t;
}
G.UIDEF.deck_info = function (_show_remaining) {
    return create_UIBox_generic_options({ contents: [create_tabs({ tabs: _show_remaining && [{ label: localize("b_remaining"), chosen: true, tab_definition_function: G.UIDEF.view_deck, tab_definition_function_args: true }, { label: localize("b_full_deck"), tab_definition_function: G.UIDEF.view_deck }] || [{ label: localize("b_full_deck"), chosen: true, tab_definition_function: G.UIDEF.view_deck }], tab_h: 8, snap_to_nav: true })] });
};
G.UIDEF.run_info = function () {
    return create_UIBox_generic_options({ contents: [create_tabs({ tabs: [{ label: localize("b_poker_hands"), chosen: true, tab_definition_function: create_UIBox_current_hands }, { label: localize("b_blinds"), tab_definition_function: G.UIDEF.current_blinds }, { label: localize("b_vouchers"), tab_definition_function: G.UIDEF.used_vouchers }, G.GAME.stake > 1 && { label: localize("b_stake"), tab_definition_function: G.UIDEF.current_stake } || undefined], tab_h: 8, snap_to_nav: true })] });
};
G.UIDEF.current_blinds = function () {
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, padding: 0.2 }, nodes: [G.GAME.round_resets.blind_states["Small"] !== "Hide" && { n: G.UIT.C, config: { align: "tm", padding: 0.1, outline: 2, r: 0.1, line_emboss: 0.2, outline_colour: G.C.BLACK }, nodes: [create_UIBox_blind_choice("Small", true)] } || undefined, G.GAME.round_resets.blind_states["Big"] !== "Hide" && { n: G.UIT.C, config: { align: "tm", padding: 0.1, outline: 2, r: 0.1, line_emboss: 0.2, outline_colour: G.C.BLACK }, nodes: [create_UIBox_blind_choice("Big", true)] } || undefined, G.GAME.round_resets.blind_states["Boss"] !== "Hide" && { n: G.UIT.C, config: { align: "tm", padding: 0.1, outline: 2, r: 0.1, line_emboss: 0.2, outline_colour: G.C.BLACK }, nodes: [create_UIBox_blind_choice("Boss", true)] } || undefined] };
};
G.UIDEF.deck_stake_column = function (_deck_key) {
    let deck_usage = G.PROFILES[G.SETTINGS.profile].deck_usage[_deck_key];
    let stake_col = {};
    let valid_option = undefined;
    for (let i = G.P_CENTER_POOLS["Stake"].length; i <= 1; i += -1) {
        let _wins = deck_usage && deck_usage.wins[i] || 0;
        if (deck_usage && deck_usage.wins[i - 1] || i === 1 || G.PROFILES[G.SETTINGS.profile].all_unlocked) {
            valid_option = true;
        }
        stake_col[stake_col.length + 1] = { n: G.UIT.R, config: { id: i, align: "cm", colour: _wins > 0 && G.C.GREY || G.C.CLEAR, outline: 0, outline_colour: G.C.WHITE, r: 0.1, minh: 0.25, minw: valid_option && 0.45 || 0.25, func: "RUN_SETUP_check_back_stake_highlight" }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: valid_option && 0.17 || 0.13, minw: valid_option && 0.37 || 0.13, colour: _wins > 0 && get_stake_col(i) || G.C.UI.TRANSPARENT_LIGHT, r: 0.1 }, nodes: {} }] };
        if (i > 1) {
            stake_col[stake_col.length + 1] = { n: G.UIT.R, config: { align: "cm", minh: 0.1, minw: 0.04 }, nodes: {} };
        }
    }
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: stake_col };
};
G.UIDEF.current_stake = function () {
    let other_col = undefined;
    if (G.GAME.stake > 2) {
        let stake_desc_rows = [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_also_applied"), scale: 0.4, colour: G.C.WHITE } }] }];
        if (false) {
            for (let i = G.GAME.stake - 1; i <= 2; i += -1) {
                let _stake_desc = {};
                let _stake_center = G.P_CENTER_POOLS.Stake[i];
                localize({ type: "descriptions", key: _stake_center.key, set: _stake_center.set, nodes: _stake_desc });
                let _full_desc = {};
                for (const [k, v] of ipairs(_stake_desc)) {
                    _full_desc[_full_desc.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: v };
                }
                _full_desc[_full_desc.length] = undefined;
                stake_desc_rows[stake_desc_rows.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", colour: get_stake_col(i), r: 0.1, minh: 0.35, minw: 0.35, emboss: 0.05 }, nodes: {} }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.03, colour: G.C.WHITE, r: 0.1, minh: 0.7, minw: 4.8 }, nodes: _full_desc }] };
            }
        }
        SMODS.applied_stakes_UI(G.GAME.stake, stake_desc_rows);
        other_col = { n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: G.C.L_BLACK }, nodes: stake_desc_rows };
    }
    let stake_sprite = get_stake_sprite(G.GAME.stake, 0.8);
    let _stake_desc = {};
    let _stake_center = G.P_CENTER_POOLS.Stake[G.GAME.stake];
    localize({ type: "descriptions", key: _stake_center.key, set: _stake_center.set, nodes: _stake_desc });
    let _full_desc = {};
    for (const [k, v] of ipairs(_stake_desc)) {
        _full_desc[_full_desc.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: v };
    }
    _full_desc[_full_desc.length] = undefined;
    let current_col = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, minw: 4 }, nodes: [{ n: G.UIT.O, config: { colour: G.C.BLUE, object: stake_sprite, hover: true, can_collide: false } }, { n: G.UIT.T, config: { text: localize({ type: "name_text", key: G.P_CENTER_POOLS.Stake[G.GAME.stake].key, set: "Stake" }), scale: 0.45, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: get_stake_col(G.GAME.stake), r: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: G.C.WHITE, r: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.03, minh: 0.7, minw: 3.8 }, nodes: _full_desc }] }] }] };
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.BLACK, r: 0.1, padding: 0.1 }, nodes: [current_col, other_col] };
};
G.UIDEF.view_deck = function (unplayed_only) {
    let deck_tables = {};
    remove_nils(G.playing_cards);
    G.VIEWING_DECK = true;
    table.sort(G.playing_cards, function (a, b) {
        return a.get_nominal("suit") > b.get_nominal("suit");
    });
    let SUITS = { Spades: {}, Hearts: {}, Clubs: {}, Diamonds: {} };
    let suit_map = ["Spades", "Hearts", "Clubs", "Diamonds"];
    for (const [k, v] of ipairs(G.playing_cards)) {
        table.insert(SUITS[v.base.suit], v);
    }
    for (let j = 1; j <= 4; j++) {
        if (SUITS[suit_map[j]][1]) {
            let view_deck = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 6.5 * G.CARD_W, 0.6 * G.CARD_H, { card_limit: SUITS[suit_map[j]].length, type: "title", view_deck: true, highlight_limit: 0, card_w: G.CARD_W * 0.7, draw_layers: ["card"] });
            table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: view_deck } }] });
            for (let i = 1; i <= SUITS[suit_map[j]].length; i++) {
                if (SUITS[suit_map[j]][i]) {
                    let [greyed, _scale] = [undefined, 0.7];
                    if (unplayed_only && !(SUITS[suit_map[j]][i].area && SUITS[suit_map[j]][i].area === G.deck || SUITS[suit_map[j]][i].ability.wheel_flipped)) {
                        greyed = true;
                    }
                    let copy = copy_card(SUITS[suit_map[j]][i], undefined, _scale);
                    copy.greyed = greyed;
                    copy.T.x = view_deck.T.x + view_deck.T.w / 2;
                    copy.T.y = view_deck.T.y;
                    copy.hard_set_T();
                    view_deck.emplace(copy);
                }
            }
        }
    }
    let flip_col = G.C.WHITE;
    let suit_tallies = { ["Spades"]: 0, ["Hearts"]: 0, ["Clubs"]: 0, ["Diamonds"]: 0 };
    let mod_suit_tallies = { ["Spades"]: 0, ["Hearts"]: 0, ["Clubs"]: 0, ["Diamonds"]: 0 };
    let rank_tallies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let mod_rank_tallies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let rank_name_mapping = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    let face_tally = 0;
    let mod_face_tally = 0;
    let num_tally = 0;
    let mod_num_tally = 0;
    let ace_tally = 0;
    let mod_ace_tally = 0;
    let wheel_flipped = 0;
    for (const [k, v] of ipairs(G.playing_cards)) {
        if (v.ability.name !== "Stone Card" && (!unplayed_only || (v.area && v.area === G.deck || v.ability.wheel_flipped))) {
            if (v.ability.wheel_flipped && unplayed_only) {
                wheel_flipped = wheel_flipped + 1;
            }
            suit_tallies[v.base.suit] = (suit_tallies[v.base.suit] || 0) + 1;
            mod_suit_tallies["Spades"] = (mod_suit_tallies["Spades"] || 0) + (v.is_suit("Spades") && 1 || 0);
            mod_suit_tallies["Hearts"] = (mod_suit_tallies["Hearts"] || 0) + (v.is_suit("Hearts") && 1 || 0);
            mod_suit_tallies["Clubs"] = (mod_suit_tallies["Clubs"] || 0) + (v.is_suit("Clubs") && 1 || 0);
            mod_suit_tallies["Diamonds"] = (mod_suit_tallies["Diamonds"] || 0) + (v.is_suit("Diamonds") && 1 || 0);
            let card_id = v.get_id();
            face_tally = face_tally + ((card_id === 11 || card_id === 12 || card_id === 13) && 1 || 0);
            mod_face_tally = mod_face_tally + (v.is_face() && 1 || 0);
            if (card_id > 1 && card_id < 11) {
                num_tally = num_tally + 1;
                if (!v.debuff) {
                    mod_num_tally = mod_num_tally + 1;
                }
            }
            if (card_id === 14) {
                ace_tally = ace_tally + 1;
                if (!v.debuff) {
                    mod_ace_tally = mod_ace_tally + 1;
                }
            }
            rank_tallies[card_id - 1] = rank_tallies[card_id - 1] + 1;
            if (!v.debuff) {
                mod_rank_tallies[card_id - 1] = mod_rank_tallies[card_id - 1] + 1;
            }
        }
    }
    let modded = face_tally !== mod_face_tally || mod_suit_tallies["Spades"] !== suit_tallies["Spades"] || mod_suit_tallies["Hearts"] !== suit_tallies["Hearts"] || mod_suit_tallies["Clubs"] !== suit_tallies["Clubs"] || mod_suit_tallies["Diamonds"] !== suit_tallies["Diamonds"];
    if (wheel_flipped > 0) {
        flip_col = mix_colours(G.C.FILTER, G.C.WHITE, 0.7);
    }
    let rank_cols = {};
    for (let i = 13; i <= 1; i += -1) {
        let mod_delta = mod_rank_tallies[i] !== rank_tallies[i];
        rank_cols[rank_cols.length + 1] = { n: G.UIT.R, config: { align: "cm", padding: 0.07 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, padding: 0.04, emboss: 0.04, minw: 0.5, colour: G.C.L_BLACK }, nodes: [{ n: G.UIT.T, config: { text: rank_name_mapping[i], colour: G.C.JOKER_GREY, scale: 0.35, shadow: true } }] }, { n: G.UIT.C, config: { align: "cr", minw: 0.4 }, nodes: [mod_delta && { n: G.UIT.O, config: { object: DynaText({ string: [{ string: "" + rank_tallies[i], colour: flip_col }, { string: "" + mod_rank_tallies[i], colour: G.C.BLUE }], colours: [G.C.RED], scale: 0.4, y_offset: -2, silent: true, shadow: true, pop_in_rate: 10, pop_delay: 4 }) } } || { n: G.UIT.T, config: { text: rank_tallies[i] || "NIL", colour: flip_col, scale: 0.45, shadow: true } }] }] };
    }
    let t = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 1.5, minh: 2, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, colour: G.C.L_BLACK, emboss: 0.05, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: G.GAME.selected_back.loc_name, colours: [G.C.WHITE], bump: true, rotate: true, shadow: true, scale: 0.6 - string.len(G.GAME.selected_back.loc_name) * 0.01 }) } }] }, { n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0.1, minw: 2.5, minh: 1.3, colour: G.C.WHITE, emboss: 0.05 }, nodes: [{ n: G.UIT.O, config: { object: new UIBox({ definition: G.GAME.selected_back.generate_UI(undefined, 0.7, 0.5, G.GAME.challenge), config: { offset: { x: 0, y: 0 } } }) } }] }] }, { n: G.UIT.R, config: { align: "cm", r: 0.1, outline_colour: G.C.L_BLACK, line_emboss: 0.05, outline: 1.5 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.05, padding: 0.07 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ string: localize("k_base_cards"), colour: G.C.RED }, modded && { string: localize("k_effective"), colour: G.C.BLUE } || undefined], colours: [G.C.RED], silent: true, scale: 0.4, pop_in_rate: 10, pop_delay: 4 }) } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.05, padding: 0.1 }, nodes: [tally_sprite({ x: 1, y: 0 }, [{ string: "" + ace_tally, colour: flip_col }, { string: "" + mod_ace_tally, colour: G.C.BLUE }], [localize("k_aces")]), tally_sprite({ x: 2, y: 0 }, [{ string: "" + face_tally, colour: flip_col }, { string: "" + mod_face_tally, colour: G.C.BLUE }], [localize("k_face_cards")]), tally_sprite({ x: 3, y: 0 }, [{ string: "" + num_tally, colour: flip_col }, { string: "" + mod_num_tally, colour: G.C.BLUE }], [localize("k_numbered_cards")])] }, { n: G.UIT.R, config: { align: "cm", minh: 0.05, padding: 0.1 }, nodes: [tally_sprite({ x: 3, y: 1 }, [{ string: "" + suit_tallies["Spades"], colour: flip_col }, { string: "" + mod_suit_tallies["Spades"], colour: G.C.BLUE }], [localize("Spades", "suits_plural")]), tally_sprite({ x: 0, y: 1 }, [{ string: "" + suit_tallies["Hearts"], colour: flip_col }, { string: "" + mod_suit_tallies["Hearts"], colour: G.C.BLUE }], [localize("Hearts", "suits_plural")])] }, { n: G.UIT.R, config: { align: "cm", minh: 0.05, padding: 0.1 }, nodes: [tally_sprite({ x: 2, y: 1 }, [{ string: "" + suit_tallies["Clubs"], colour: flip_col }, { string: "" + mod_suit_tallies["Clubs"], colour: G.C.BLUE }], [localize("Clubs", "suits_plural")]), tally_sprite({ x: 1, y: 1 }, [{ string: "" + suit_tallies["Diamonds"], colour: flip_col }, { string: "" + mod_suit_tallies["Diamonds"], colour: G.C.BLUE }], [localize("Diamonds", "suits_plural")])] }] }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: rank_cols }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }] }, { n: G.UIT.B, config: { w: 0.2, h: 0.1 } }, { n: G.UIT.C, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.8, padding: 0.05 }, nodes: [modded && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { padding: 0.3, r: 0.1, colour: mix_colours(G.C.BLUE, G.C.WHITE, 0.7) }, nodes: {} }, { n: G.UIT.T, config: { text: " " + localize("ph_deck_preview_effective"), colour: G.C.WHITE, scale: 0.3 } }] } || undefined, wheel_flipped > 0 && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { padding: 0.3, r: 0.1, colour: flip_col }, nodes: {} }, { n: G.UIT.T, config: { text: " " + (wheel_flipped > 1 && localize({ type: "variable", key: "deck_preview_wheel_plural", vars: [wheel_flipped] }) || localize({ type: "variable", key: "deck_preview_wheel_singular", vars: [wheel_flipped] })), colour: G.C.WHITE, scale: 0.3 } }] } || undefined] }] };
    return t;
};
function tally_sprite(pos, value, tooltip, suit): void {
    let text_colour = G.C.BLACK;
    if (type(value) === "table" && value[1].string === value[2].string) {
        text_colour = value[1].colour || G.C.WHITE;
        value = value[1].string;
    }
    let t_s = new Sprite(0, 0, 0.5, 0.5, G.ASSET_ATLAS[suit && SMODS.Suits[suit][G.SETTINGS.colourblind_option && "hc_ui_atlas" || "lc_ui_atlas"]] || G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && "2" || "1")], { x: pos.x || 0, y: pos.y || 0 });
    t_s.states.drag.can = false;
    t_s.states.hover.can = false;
    t_s.states.collide.can = false;
    return { n: G.UIT.C, config: { align: "cm", padding: 0.07, force_focus: true, focus_args: { type: "tally_sprite" }, tooltip: { text: tooltip } }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, padding: 0.04, emboss: 0.05, colour: G.C.JOKER_GREY }, nodes: [{ n: G.UIT.O, config: { w: 0.5, h: 0.5, can_collide: false, object: t_s, tooltip: { text: tooltip } } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [type(value) === "table" && { n: G.UIT.O, config: { object: DynaText({ string: value, colours: [G.C.RED], scale: 0.4, silent: true, shadow: true, pop_in_rate: 10, pop_delay: 4 }) } } || { n: G.UIT.T, config: { text: value || "NIL", colour: text_colour, scale: 0.4, shadow: true } }] }] };
}
G.UIDEF.used_vouchers = function () {
    let silent = false;
    let keys_used = {};
    let area_count = 0;
    let voucher_areas = {};
    let voucher_tables = {};
    let voucher_table_rows = {};
    for (const [k, v] of ipairs(G.P_CENTER_POOLS["Voucher"])) {
        let key = 1 + math.floor((k - 0.1) / 2);
        keys_used[key] = keys_used[key] || {};
        if (G.GAME.used_vouchers[v.key]) {
            keys_used[key][keys_used[key].length + 1] = v;
        }
    }
    for (const [k, v] of ipairs(keys_used)) {
        if (next(v)) {
            area_count = area_count + 1;
        }
    }
    for (const [k, v] of ipairs(keys_used)) {
        if (next(v)) {
            if (voucher_areas.length === 5 || voucher_areas.length === 10) {
                table.insert(voucher_table_rows, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: voucher_tables });
                voucher_tables = {};
            }
            voucher_areas[voucher_areas.length + 1] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, (v.length === 1 && 1 || 1.33) * G.CARD_W, (area_count >= 10 && 0.75 || 1.07) * G.CARD_H, { card_limit: 2, type: "voucher", highlight_limit: 0 });
            for (const [kk, vv] of ipairs(v)) {
                let center = G.P_CENTERS[vv.key];
                let card = Card(voucher_areas[voucher_areas.length].T.x + voucher_areas[voucher_areas.length].T.w / 2, voucher_areas[voucher_areas.length].T.y, G.CARD_W, G.CARD_H, undefined, center, { bypass_discovery_center: true, bypass_discovery_ui: true, bypass_lock: true });
                card.ability.order = vv.order;
                card.start_materialize(undefined, silent);
                silent = true;
                voucher_areas[voucher_areas.length].emplace(card);
            }
            table.insert(voucher_tables, { n: G.UIT.C, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: voucher_areas[voucher_areas.length] } }] });
        }
    }
    table.insert(voucher_table_rows, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: voucher_tables });
    let t = silent && { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_vouchers_redeemed")], colours: [G.C.UI.TEXT_LIGHT], bump: true, scale: 0.6 }) } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.5 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", colour: G.C.BLACK, r: 1, padding: 0.15, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: voucher_table_rows }] }] } || { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("ph_no_vouchers")], colours: [G.C.UI.TEXT_LIGHT], bump: true, scale: 0.6 }) } }] };
    return t;
};
function create_UIBox_your_collection(): void {
    set_discover_tallies();
    G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
            G.REFRESH_ALERTS = true;
            return true;
        } }));
    let consumable_nodes = {};
    if (SMODS.ConsumableType.ctype_buffer.length <= 3) {
        for (const [_, key] of ipairs(SMODS.ConsumableType.ctype_buffer)) {
            let id = "your_collection_" + (key.lower() + "s");
            consumable_nodes[consumable_nodes.length + 1] = UIBox_button({ button: id, label: [localize("b_" + (key.lower() + "_cards"))], count: G.DISCOVER_TALLIES[key.lower() + "s"], minw: 4, id: id, colour: G.C.SECONDARY_SET[key] });
        }
    }
    else {
        consumable_nodes[consumable_nodes.length + 1] = UIBox_button({ button: "your_collection_consumables", label: [localize("b_stat_consumables"), localize({ type: "variable", key: "c_types", vars: [SMODS.ConsumableType.ctype_buffer.length] })], count: G.DISCOVER_TALLIES["consumeables"], minw: 4, minh: 4, id: "your_collection_consumables", colour: G.C.FILTER });
    }
    let t = create_UIBox_generic_options({ back_func: G.STAGE === G.STAGES.RUN && "options" || "exit_overlay_menu", contents: [{ n: G.UIT.C, config: { align: "cm", padding: 0.15 }, nodes: [UIBox_button({ button: "your_collection_jokers", label: [localize("b_jokers")], count: G.DISCOVER_TALLIES.jokers, minw: 5, minh: 1.7, scale: 0.6, id: "your_collection_jokers" }), UIBox_button({ button: "your_collection_decks", label: [localize("b_decks")], count: G.DISCOVER_TALLIES.backs, minw: 5 }), UIBox_button({ button: "your_collection_vouchers", label: [localize("b_vouchers")], count: G.DISCOVER_TALLIES.vouchers, minw: 5, id: "your_collection_vouchers" }), { n: G.UIT.R, config: { align: "cm", padding: 0.1, r: 0.2, colour: G.C.BLACK }, nodes: [{ n: G.UIT.C, config: { align: "cm", maxh: 2.9 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_cap_consumables"), scale: 0.45, colour: G.C.L_BLACK, vert: true, maxh: 2.2 } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.15 }, nodes: consumable_nodes }] }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.15 }, nodes: [UIBox_button({ button: "your_collection_enhancements", label: [localize("b_enhanced_cards")], minw: 5 }), UIBox_button({ button: "your_collection_seals", label: [localize("b_seals")], minw: 5, id: "your_collection_seals" }), UIBox_button({ button: "your_collection_editions", label: [localize("b_editions")], count: G.DISCOVER_TALLIES.editions, minw: 5, id: "your_collection_editions" }), UIBox_button({ button: "your_collection_boosters", label: [localize("b_booster_packs")], count: G.DISCOVER_TALLIES.boosters, minw: 5, id: "your_collection_boosters" }), UIBox_button({ button: "your_collection_tags", label: [localize("b_tags")], count: G.DISCOVER_TALLIES.tags, minw: 5, id: "your_collection_tags" }), UIBox_button({ button: "your_collection_blinds", label: [localize("b_blinds")], count: G.DISCOVER_TALLIES.blinds, minw: 5, minh: 2, id: "your_collection_blinds", focus_args: { snap_to: true } }), UIBox_button({ button: "your_collection_other_gameobjects", label: [localize("k_other")], minw: 5, id: "your_collection_other_gameobjects", focus_args: { snap_to: true } })] }] });
    return t;
}
function create_UIBox_your_collection_jokers(): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 3; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 5 * G.CARD_W, 0.95 * G.CARD_H, { card_limit: 5, type: "title", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0.07, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    let joker_options = {};
    for (let i = 1; i <= math.ceil(G.P_CENTER_POOLS.Joker.length / (5 * G.your_collection.length)); i++) {
        table.insert(joker_options, localize("k_page") + (" " + (tostring(i) + ("/" + tostring(math.ceil(G.P_CENTER_POOLS.Joker.length / (5 * G.your_collection.length)))))));
    }
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= G.your_collection.length; j++) {
            let center = G.P_CENTER_POOLS["Joker"][i + (j - 1) * 5];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, undefined, center);
            card.sticker = get_joker_win_sticker(center);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ back_func: "your_collection", contents: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ options: joker_options, w: 4.5, cycle_shoulders: true, opt_callback: "your_collection_joker_page", current_option: 1, colour: G.C.RED, no_pips: true, focus_args: { snap_to: true, nav: "wide" } })] }] });
    return t;
}
function create_UIBox_your_collection_tarots(): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 2; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, (4.25 + j) * G.CARD_W, 1 * G.CARD_H, { card_limit: 4 + j, type: "title", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    let tarot_options = {};
    for (let i = 1; i <= math.floor(G.P_CENTER_POOLS.Tarot.length / 11); i++) {
        table.insert(tarot_options, localize("k_page") + (" " + (tostring(i) + ("/" + tostring(math.floor(G.P_CENTER_POOLS.Tarot.length / 11))))));
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 4 + j; i++) {
            let center = G.P_CENTER_POOLS["Tarot"][i + (j - 1) * 5];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, undefined, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ back_func: G.ACTIVE_MOD_UI && "openModUI_" + G.ACTIVE_MOD_UI.id || "your_collection", contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ options: tarot_options, w: 4.5, cycle_shoulders: true, opt_callback: "your_collection_tarot_page", focus_args: { snap_to: true, nav: "wide" }, current_option: 1, colour: G.C.RED, no_pips: true })] }] });
    return t;
}
function create_UIBox_your_collection_boosters(): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 2; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 5.25 * G.CARD_W, 1.3 * G.CARD_H, { card_limit: 4, type: "title", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    let booster_options = {};
    for (let i = 1; i <= math.ceil(G.P_CENTER_POOLS.Booster.length / 8); i++) {
        table.insert(booster_options, localize("k_page") + (" " + (tostring(i) + ("/" + tostring(math.ceil(G.P_CENTER_POOLS.Booster.length / 8))))));
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 4; i++) {
            let center = G.P_CENTER_POOLS["Booster"][i + (j - 1) * 4];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W * 1.27, G.CARD_H * 1.27, undefined, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ back_func: G.ACTIVE_MOD_UI && "openModUI_" + G.ACTIVE_MOD_UI.id || "your_collection", contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ options: booster_options, w: 4.5, cycle_shoulders: true, opt_callback: "your_collection_booster_page", focus_args: { snap_to: true, nav: "wide" }, current_option: 1, colour: G.C.RED, no_pips: true })] }] });
    return t;
}
function create_UIBox_your_collection_planets(): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 2; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 6.25 * G.CARD_W, 1 * G.CARD_H, { card_limit: 6, type: "title", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 6; i++) {
            let center = G.P_CENTER_POOLS["Planet"][i + (j - 1) * 6];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, undefined, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ back_func: G.ACTIVE_MOD_UI && "openModUI_" + G.ACTIVE_MOD_UI.id || "your_collection", contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }, { n: G.UIT.R, config: { align: "cm", padding: 0.7 }, nodes: {} }] });
    return t;
}
function create_UIBox_your_collection_spectrals(): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 2; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, (3.25 + j) * G.CARD_W, 1 * G.CARD_H, { card_limit: 3 + j, type: "title", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 3 + j; i++) {
            let center = G.P_CENTER_POOLS["Spectral"][i + (j - 1) * 3 + j - 1];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, undefined, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    let spectral_options = {};
    for (let i = 1; i <= math.floor(G.P_CENTER_POOLS.Tarot.length / 9); i++) {
        table.insert(spectral_options, localize("k_page") + (" " + (tostring(i) + ("/" + tostring(math.floor(G.P_CENTER_POOLS.Spectral.length / 9))))));
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ back_func: G.ACTIVE_MOD_UI && "openModUI_" + G.ACTIVE_MOD_UI.id || "your_collection", contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [create_option_cycle({ options: spectral_options, w: 4.5, cycle_shoulders: true, opt_callback: "your_collection_spectral_page", focus_args: { snap_to: true, nav: "wide" }, current_option: 1, colour: G.C.RED, no_pips: true })] }] });
    return t;
}
function create_UIBox_your_collection_vouchers(exit): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 2; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 4.25 * G.CARD_W, 1 * G.CARD_H, { card_limit: 4, type: "voucher", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    let voucher_options = {};
    for (let i = 1; i <= math.ceil(G.P_CENTER_POOLS.Voucher.length / (4 * G.your_collection.length)); i++) {
        table.insert(voucher_options, localize("k_page") + (" " + (tostring(i) + ("/" + tostring(math.ceil(G.P_CENTER_POOLS.Voucher.length / (4 * G.your_collection.length)))))));
    }
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= G.your_collection.length; j++) {
            let center = G.P_CENTER_POOLS["Voucher"][i + (j - 1) * 4];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, undefined, center);
            card.ability.order = i + (j - 1) * 4;
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ back_func: exit || "your_collection", contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }, { n: G.UIT.R, config: { align: "cm" }, nodes: [create_option_cycle({ options: voucher_options, w: 4.5, cycle_shoulders: true, opt_callback: "your_collection_voucher_page", focus_args: { snap_to: true, nav: "wide" }, current_option: 1, colour: G.C.RED, no_pips: true })] }] });
    return t;
}
function create_UIBox_your_collection_seals(exit): void {
    let deck_tables = {};
    G.your_collection = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 4.25 * G.CARD_W, 1.03 * G.CARD_H, { card_limit: 4, type: "title", highlight_limit: 0, collection: true });
    table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection } }] });
    for (const [k, v] of ipairs(G.P_CENTER_POOLS["Seal"])) {
        let center = G.P_CENTERS.c_base;
        let card = Card(G.your_collection.T.x + G.your_collection.T.w / 2, G.your_collection.T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
        card.set_seal(v.key, true);
        G.your_collection.emplace(card);
    }
    let t = create_UIBox_generic_options({ infotip: localize("ml_edition_seal_enhancement_explanation"), back_func: exit || "your_collection", snap_back: true, contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }] });
    return t;
}
function create_UIBox_your_collection_enhancements(exit): void {
    let deck_tables = {};
    G.your_collection = {};
    for (let j = 1; j <= 2; j++) {
        G.your_collection[j] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 4.25 * G.CARD_W, 1.03 * G.CARD_H, { card_limit: 4, type: "title", highlight_limit: 0, collection: true });
        table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[j] } }] });
    }
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= G.your_collection.length; j++) {
            let center = G.P_CENTER_POOLS["Enhanced"][i + (j - 1) * 4];
            let card = Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
            G.your_collection[j].emplace(card);
        }
    }
    let t = create_UIBox_generic_options({ infotip: localize("ml_edition_seal_enhancement_explanation"), back_func: exit || "your_collection", snap_back: true, contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: deck_tables }] });
    return t;
}
function create_UIBox_your_collection_editions(): void {
    G.your_collection = {};
    G.your_collection[1] = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 5.3 * G.CARD_W, 1.03 * G.CARD_H, { card_limit: 5, type: "title", highlight_limit: 0, collection: true });
    let deck_tables = { n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection[1] } }] };
    let editions = ["base", "foil", "holo", "polychrome", "negative"];
    for (let i = 1; i <= 5; i++) {
        let card = Card(G.your_collection[1].T.x + G.your_collection[1].T.w / 2, G.your_collection[1].T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, G.P_CENTERS["e_" + editions[i]]);
        card.start_materialize();
        if (G.P_CENTERS["e_" + editions[i]].discovered) {
            card.set_edition({ [editions[i]]: true }, true, true);
        }
        G.your_collection[1].emplace(card);
    }
    INIT_COLLECTION_CARD_ALERTS();
    let t = create_UIBox_generic_options({ infotip: localize("ml_edition_seal_enhancement_explanation"), back_func: "your_collection", snap_back: true, contents: [{ n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: [deck_tables] }] });
    return t;
}
function create_UIBox_your_collection_decks(): void {
    let deck_pool = SMODS.collection_pool(G.P_CENTER_POOLS.Back);
    G.GAME.viewed_back = Back(G.ACTIVE_MOD_UI && deck_pool[1] || G.P_CENTERS.b_red);
    let area = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 1.2 * G.CARD_W, 1.2 * G.CARD_H, { card_limit: 52, type: "deck", highlight_limit: 0 });
    for (let i = 1; i <= 52; i++) {
        let card = Card(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, G.CARD_W * 1.2, G.CARD_H * 1.2, pseudorandom_element(G.P_CARDS), G.P_CENTERS.c_base, { playing_card: i, viewed_back: true });
        card.sprite_facing = "back";
        card.facing = "back";
        area.emplace(card);
        if (i === 52) {
            G.sticker_card = card;
            card.sticker = get_deck_win_sticker(G.GAME.viewed_back.effect.center);
        }
    }
    let ordered_names = {};
    for (const [k, v] of ipairs(deck_pool)) {
        ordered_names[ordered_names.length + 1] = v.key;
    }
    let t = create_UIBox_generic_options({ back_func: G.ACTIVE_MOD_UI && "openModUI_" + G.ACTIVE_MOD_UI.id || "your_collection", contents: [create_option_cycle({ options: ordered_names, opt_callback: "change_viewed_back", current_option: 1, colour: G.C.RED, w: 4.5, focus_args: { snap_to: true }, mid: { n: G.UIT.R, config: { align: "cm", minw: 2.5, padding: 0.1, r: 0.1, colour: G.C.BLACK, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.2 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: area } }] }, { n: G.UIT.C, config: { align: "tm", minw: 3.7, minh: 2.1, r: 0.1, colour: G.C.L_BLACK, padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", emboss: 0.1, r: 0.1, minw: 4, maxw: 4, minh: 0.6 }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "RUN_SETUP_check_back_name", object: Moveable() } }] }, { n: G.UIT.R, config: { align: "cm", colour: G.C.WHITE, emboss: 0.1, minh: 2.2, r: 0.1 }, nodes: [{ n: G.UIT.O, config: { id: G.GAME.viewed_back.name, func: "RUN_SETUP_check_back", object: new UIBox({ definition: G.GAME.viewed_back.generate_UI(), config: { offset: { x: 0, y: 0 } } }) } }] }] }] }] } })] });
    return t;
}
function create_UIBox_your_collection_tags(): void {
    let tag_matrix = {};
    let counter = 0;
    let tag_tab = {};
    let tag_pool = {};
    if (G.ACTIVE_MOD_UI) {
        for (const [k, v] of pairs(G.P_TAGS)) {
            if (v.mod && G.ACTIVE_MOD_UI.id === v.mod.id) {
                tag_pool[k] = v;
            }
        }
    }
    else {
        tag_pool = G.P_TAGS;
    }
    for (const [k, v] of pairs(tag_pool)) {
        counter = counter + 1;
        tag_tab[tag_tab.length + 1] = v;
    }
    for (let i = 1; i <= math.ceil(counter / 6); i++) {
        table.insert(tag_matrix, {});
    }
    table.sort(tag_tab, function (a, b) {
        return a.order < b.order;
    });
    let tags_to_be_alerted = {};
    for (const [k, v] of ipairs(tag_tab)) {
        let discovered = v.discovered;
        let temp_tag = Tag(v.key, true);
        if (!v.discovered) {
            temp_tag.hide_ability = true;
        }
        let [temp_tag_ui, temp_tag_sprite] = temp_tag.generate_UI();
        tag_matrix[math.ceil((k - 1) / 6 + 0.001)][1 + (k - 1) % 6] = { n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [temp_tag_ui] };
        if (discovered && !v.alerted) {
            tags_to_be_alerted[tags_to_be_alerted.length + 1] = temp_tag_sprite;
        }
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            for (const [_, v] of ipairs(tags_to_be_alerted)) {
                v.children.alert = new UIBox({ definition: create_UIBox_card_alert(), config: { align: "tri", offset: { x: 0.1, y: 0.1 }, parent: v } });
                v.children.alert.states.collide.can = false;
            }
            return true;
        } }));
    let table_nodes = {};
    for (let i = 1; i <= math.ceil(counter / 6); i++) {
        table.insert(table_nodes, { n: G.UIT.R, config: { align: "cm" }, nodes: tag_matrix[i] });
    }
    let t = create_UIBox_generic_options({ back_func: G.ACTIVE_MOD_UI && "openModUI_" + G.ACTIVE_MOD_UI.id || "your_collection", contents: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.BLACK, padding: 0.1, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: table_nodes }] }] }] });
    return t;
}
function create_UIBox_your_collection_blinds(exit): void {
    let blind_matrix = [{}, {}, {}, {}, {}, {}];
    let blind_tab = {};
    for (const [k, v] of pairs(G.P_BLINDS)) {
        blind_tab[blind_tab.length + 1] = v;
    }
    table.sort(blind_tab, function (a, b) {
        return a.order + (a.boss && a.boss.showdown && 1000 || 0) < b.order + (b.boss && b.boss.showdown && 1000 || 0);
    });
    let blinds_to_be_alerted = {};
    for (const [k, v] of ipairs(blind_tab)) {
        let discovered = v.discovered;
        let s = 1.3;
        if (math.ceil(blind_tab.length / 6) > 6) {
            s = s * 6 / math.ceil(blind_tab.length / 6);
        }
        let temp_blind =new AnimatedSprite(0, 0, s, s, G.ANIMATION_ATLAS[discovered && v.atlas || "blind_chips"], discovered && v.pos || G.b_undiscovered.pos);
        temp_blind.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
        if (k === 1) {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.CONTROLLER.snap_to({ node: temp_blind });
                    return true;
                } }));
        }
        temp_blind.float = true;
        temp_blind.states.hover.can = true;
        temp_blind.states.drag.can = false;
        temp_blind.states.collide.can = true;
        temp_blind.config = { blind: v, force_focus: true };
        if (discovered && !v.alerted) {
            blinds_to_be_alerted[blinds_to_be_alerted.length + 1] = temp_blind;
        }
        temp_blind.hover = function () {
            if (!G.CONTROLLER.dragging.target || G.CONTROLLER.using_touch) {
                if (!temp_blind.hovering && temp_blind.states.visible) {
                    temp_blind.hovering = true;
                    temp_blind.hover_tilt = 3;
                    temp_blind.juice_up(0.05, 0.02);
                    play_sound("chips1", math.random() * 0.1 + 0.55, 0.12);
                    temp_blind.config.h_popup = create_UIBox_blind_popup(v, discovered);
                    temp_blind.config.h_popup_config = { align: "cl", offset: { x: -0.1, y: 0 }, parent: temp_blind };
                    Node.hover(temp_blind);
                    if (temp_blind.children.alert) {
                        temp_blind.children.alert.remove();
                        temp_blind.children.alert = undefined;
                        temp_blind.config.blind.alerted = true;
                        G.save_progress();
                    }
                }
            }
            temp_blind.stop_hover = function () {
                temp_blind.hovering = false;
                Node.stop_hover(temp_blind);
                temp_blind.hover_tilt = 0;
            };
        };
        let blinds_per_row = math.ceil(blind_tab.length / 6);
        let row = math.ceil((k - 1) / blinds_per_row + 0.001);
        table.insert(blind_matrix[row], { n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [(k - blinds_per_row) % (2 * blinds_per_row) === 1 && { n: G.UIT.B, config: { h: 0.2, w: 0.5 } } || undefined, { n: G.UIT.O, config: { object: temp_blind, focus_with_object: true } }, (k - blinds_per_row) % (2 * blinds_per_row) === 0 && { n: G.UIT.B, config: { h: 0.2, w: 0.5 } } || undefined] });
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            for (const [_, v] of ipairs(blinds_to_be_alerted)) {
                v.children.alert = new UIBox({ definition: create_UIBox_card_alert(), config: { align: "tri", offset: { x: 0.1, y: 0.1 }, parent: v } });
                v.children.alert.states.collide.can = false;
            }
            return true;
        } }));
    let ante_amounts = {};
    for (let i = 1; i <= math.min(16, math.max(16, G.PROFILES[G.SETTINGS.profile].high_scores.furthest_ante.amt)); i++) {
        let spacing = 1 - math.min(20, math.max(15, G.PROFILES[G.SETTINGS.profile].high_scores.furthest_ante.amt)) * 0.06;
        if (spacing > 0 && i > 1) {
            ante_amounts[ante_amounts.length + 1] = { n: G.UIT.R, config: { minh: spacing }, nodes: {} };
        }
        let blind_chip = new Sprite(0, 0, 0.2, 0.2, G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && 2 || 1)], { x: 0, y: 0 });
        blind_chip.states.drag.can = false;
        ante_amounts[ante_amounts.length + 1] = { n: G.UIT.R, config: { align: "cm", padding: 0.03 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 0.7 }, nodes: [{ n: G.UIT.T, config: { text: i, scale: 0.4, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.C, config: { align: "cr", minw: 2.8 }, nodes: [{ n: G.UIT.O, config: { object: blind_chip } }, { n: G.UIT.C, config: { align: "cm", minw: 0.03, minh: 0.01 }, nodes: {} }, { n: G.UIT.T, config: { text: number_format(get_blind_amount(i)), scale: 0.4, colour: i <= G.PROFILES[G.SETTINGS.profile].high_scores.furthest_ante.amt && G.C.RED || G.C.JOKER_GREY, shadow: true } }] }] };
    }
    let extras = undefined;
    let t = create_UIBox_generic_options({ back_func: exit || "your_collection", contents: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.BLACK, padding: 0.1, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.L_BLACK, padding: 0.1, force_focus: true, focus_args: { nav: "tall" } }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 0.7 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_ante_cap"), scale: 0.4, colour: lighten(G.C.FILTER, 0.2), shadow: true } }] }, { n: G.UIT.C, config: { align: "cr", minw: 2.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_base_cap"), scale: 0.4, colour: lighten(G.C.RED, 0.2), shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: ante_amounts }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: blind_matrix[1] }, { n: G.UIT.R, config: { align: "cm" }, nodes: blind_matrix[2] }, { n: G.UIT.R, config: { align: "cm" }, nodes: blind_matrix[3] }, { n: G.UIT.R, config: { align: "cm" }, nodes: blind_matrix[4] }, { n: G.UIT.R, config: { align: "cm" }, nodes: blind_matrix[5] }, { n: G.UIT.R, config: { align: "cm" }, nodes: blind_matrix[6] }] }] }] }] });
    return t;
}
function create_UIBox_blind_popup(blind, discovered, vars): void {
    let blind_text = {};
    let _dollars = blind.dollars;
    let target = { type: "raw_descriptions", key: blind.key, set: "Blind", vars: vars || blind.vars };
    if (blind.collection_loc_vars && type(blind.collection_loc_vars) === "function") {
        let res = blind.collection_loc_vars() || {};
        target.vars = res.vars || target.vars;
        target.key = res.key || target.key;
    }
    let loc_target = localize(target);
    let loc_name = localize({ type: "name_text", key: blind.key, set: "Blind" });
    if (discovered) {
        let ability_text = {};
        if (loc_target) {
            for (const [k, v] of ipairs(loc_target)) {
                ability_text[ability_text.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: v, scale: 0.35, shadow: true, colour: G.C.WHITE } }] };
            }
        }
        let stake_sprite = get_stake_sprite(G.GAME.stake || 1, 0.4);
        blind_text[blind_text.length + 1] = { n: G.UIT.R, config: { align: "cm", emboss: 0.05, r: 0.1, minw: 2.5, padding: 0.07, colour: G.C.WHITE }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 2.4 }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_blind_score_at_least"), scale: 0.35, colour: G.C.UI.TEXT_DARK } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: stake_sprite } }, { n: G.UIT.T, config: { text: blind.mult + localize("k_x_base"), scale: 0.4, colour: G.C.RED } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_blind_reward"), scale: 0.35, colour: G.C.UI.TEXT_DARK } }, { n: G.UIT.O, config: { object: DynaText({ string: [_dollars && string.rep(localize("$"), _dollars) || "-"], colours: [G.C.MONEY], rotate: true, bump: true, silent: true, scale: 0.45 }) } }] }, ability_text[1] && { n: G.UIT.R, config: { align: "cm", padding: 0.08, colour: mix_colours(blind.boss_colour, G.C.GREY, 0.4), r: 0.1, emboss: 0.05, minw: 2.5, minh: 0.9 }, nodes: ability_text } || undefined] };
    }
    else {
        blind_text[blind_text.length + 1] = { n: G.UIT.R, config: { align: "cm", emboss: 0.05, r: 0.1, minw: 2.5, padding: 0.1, colour: G.C.WHITE }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_defeat_this_blind_1"), scale: 0.4, colour: G.C.UI.TEXT_DARK } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_defeat_this_blind_2"), scale: 0.4, colour: G.C.UI.TEXT_DARK } }] }] };
    }
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: lighten(G.C.JOKER_GREY, 0.5), r: 0.1, emboss: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cm", emboss: 0.05, r: 0.1, minw: 2.5, padding: 0.1, colour: !discovered && G.C.JOKER_GREY || blind.boss_colour || G.C.GREY }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: discovered && loc_name || localize("k_not_discovered"), colours: [G.C.UI.TEXT_LIGHT], shadow: true, rotate: !discovered, spacing: discovered && 2 || 0, bump: true, scale: 0.4 }) } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: blind_text }] };
}
function create_UIBox_card_unlock(card_center): void {
    G.your_collection = CardArea(G.ROOM.T.x + G.ROOM.T.w / 2, G.ROOM.T.h, 1 * G.CARD_W, 1 * G.CARD_H, { card_limit: 2, type: "consumeable", highlight_limit: 0 });
    let card = Card(G.your_collection.T.x + G.your_collection.T.w / 2 - G.CARD_W / 2, G.your_collection.T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, card_center, { bypass_discovery_center: true, bypass_discovery_ui: true });
    let locked_card = Card(G.your_collection.T.x + G.your_collection.T.w / 2 - G.CARD_W / 2, G.your_collection.T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, card_center.set === "Voucher" && G.v_locked || G.j_locked);
    locked_card.remove_UI();
    locked_card.ID = card.ID;
    card.states.click.can = false;
    locked_card.states.click.can = false;
    card.states.visible = false;
    card.no_ui = true;
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, func: function () {
            G.OVERLAY_MENU.joker_unlock_table = card.ID;
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 0.6, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                locked_card.juice_up(0.3, 0.2);
                play_sound("cancel", 0.8);
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 1.15, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                locked_card.juice_up(0.45, 0.3);
                play_sound("cancel", 0.92);
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 1.8, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                locked_card.juice_up(0.6, 0.4);
                play_sound("cancel", 1.03);
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 2.3, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                locked_card.start_dissolve([G.C.BLACK]);
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 2.7, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                card.start_materialize([G.C.BLUE], true);
                play_sound("crumple1", 0.8, 1);
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 2.78, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                card.no_ui = undefined;
                play_sound("timpani", 0.8, 1.8);
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ timer: "REAL", blockable: false, blocking: false, trigger: "after", delay: 2.95, func: function () {
            if (G.OVERLAY_MENU && G.OVERLAY_MENU.joker_unlock_table === card.ID) {
                play_sound("timpani", 1, 1.8);
            }
            return true;
        } }));
    G.your_collection.emplace(card);
    G.your_collection.emplace(locked_card);
    let t = create_UIBox_generic_options({ padding: 0, back_label: localize("b_continue"), no_pip: true, snap_back: true, back_func: "continue_unlock", minw: 4.5, contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [card_center.set === "Voucher" && localize("k_voucher") || localize("k_joker")], colours: [G.C.BLUE], shadow: true, rotate: true, bump: true, pop_in: 0.3, pop_in_rate: 2, scale: 1.2 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [localize("k_unlocked_ex")], colours: [G.C.RED], shadow: true, rotate: true, bump: true, pop_in: 0.6, pop_in_rate: 2, scale: 0.8 }) } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0, draw_layer: 1 }, nodes: [{ n: G.UIT.O, config: { object: G.your_collection } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.2 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, emboss: 0.05, colour: G.C.WHITE, r: 0.1 }, nodes: [desc_from_rows(card.generate_UIBox_unlock_table(true).main)] }] }] }] }] });
    return t;
}
function create_UIBox_deck_unlock(deck_center): void {
    G.GAME.viewed_back = Back(deck_center);
    let area = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, 1.2 * G.CARD_W, 1.2 * G.CARD_H, { card_limit: 52, type: "deck", highlight_limit: 0 });
    for (let i = 1; i <= 52; i++) {
        let card = Card(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, G.CARD_W * 1.2, G.CARD_H * 1.2, pseudorandom_element(G.P_CARDS), G.P_CENTERS.c_base, { bypass_back: deck_center.pos, playing_card: i, viewed_back: true });
        area.emplace(card);
        card[deck_center.key] = true;
        card.sprite_facing = "back";
        card.facing = "back";
    }
    let deck_criteria = {};
    if (deck_center.unlock_condition.type === "win_deck") {
        let other_name = localize({ type: "name_text", set: "Back", key: deck_center.unlock_condition.deck });
        localize({ type: "descriptions", key: "deck_locked_win", set: "Other", nodes: deck_criteria, vars: [other_name], default_col: G.C.WHITE, shadow: true });
    }
    else if (deck_center.unlock_condition.type === "win_stake") {
        let other_name = localize({ type: "name_text", set: "Stake", key: G.P_CENTER_POOLS.Stake[deck_center.unlock_condition.stake].key });
        localize({ type: "descriptions", key: "deck_locked_stake", set: "Other", nodes: deck_criteria, vars: { [1]: other_name, colours: [get_stake_col(deck_center.unlock_condition.stake)] }, default_col: G.C.WHITE, shadow: true });
    }
    else if (deck_center.unlock_condition.type === "discover_amount") {
        localize({ type: "descriptions", key: "deck_locked_discover", set: "Other", nodes: deck_criteria, vars: [deck_center.unlock_condition.amount], default_col: G.C.WHITE, shadow: true });
    }
    let deck_criteria_cols = {};
    for (const [k, v] of ipairs(deck_criteria)) {
        if (k > 1) {
            deck_criteria_cols[deck_criteria_cols.length + 1] = { n: G.UIT.C, config: { align: "cm", padding: 0, minw: 0.1 }, nodes: {} };
        }
        deck_criteria_cols[deck_criteria_cols.length + 1] = { n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: v };
    }
    let t = create_UIBox_generic_options({ back_label: localize("b_continue"), no_pip: true, snap_back: true, back_func: "continue_unlock", minw: 7, contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: [{ string: localize({ type: "name_text", set: "Back", key: deck_center.key }), suffix: " " + localize("k_unlocked_ex"), outer_colour: G.C.UI.TEXT_LIGHT }], colours: [G.C.BLUE], shadow: true, rotate: true, float: true, scale: 0.7, pop_in: 0.1 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: deck_criteria_cols }, { n: G.UIT.R, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.2 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: area } }] }, { n: G.UIT.C, config: { align: "cm", r: 0.2, colour: G.C.WHITE, emboss: 0.05, padding: 0.2, minw: 4 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: G.GAME.viewed_back.generate_UI(deck_center).nodes }] }] }] });
    return t;
}
G.UIDEF.multiline_credit_text = function (_lines) {
    let t = {};
    for (const [k, v] of ipairs(_lines)) {
        t[t.length + 1] = { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: v, scale: 0.28, colour: G.C.WHITE } }] };
    }
    return t;
};
G.UIDEF.viewed_collab_option = function (_new_option) {
    G.viewed_collab = G.viewed_collab || "The Binding of Isaac";
    let curr_collab = G.collab_credits[G.viewed_collab] || G.collab_credits["The Binding of Isaac"];
    let collab_sprite = new Sprite(0, 0, 0.8 * G.CARD_W, 0.8 * G.CARD_H, G.ASSET_ATLAS[curr_collab.art + "_1"], { x: 2, y: 0 });
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.BLACK, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: G.viewed_collab, scale: 0.5, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1, minw: 9, minh: 4.2 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: G.UIDEF.multiline_credit_text(["All rights reserved. No part of this work may be", "reproduced in any form or by any means\u2014 graphic,", "electronic, or mechanical, including recording,", "online distribution, or information storage and retrieval", "systems\u2014without the written permission of the publisher", "or the designated rightsholder, as applicable."]) }, curr_collab.ml_text && { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: G.UIDEF.multiline_credit_text(curr_collab.ml_text) } || undefined] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1, minw: 3, minh: 4.2 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.R, config: { align: "cm", colour: G.C.WHITE, r: 0.3 }, nodes: [{ n: G.UIT.O, config: { colour: G.C.BLUE, object: collab_sprite, hover: true, can_collide: false } }] }] }, curr_collab.artist && { n: G.UIT.R, config: { align: "cm", padding: 0.07, r: 0.1, outline: 0.7, outline_colour: G.C.WHITE }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Art created by:", scale: 0.3, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: curr_collab.artist, scale: 0.3, colour: G.C.GOLD } }] }, curr_collab.artist_link && { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: curr_collab.artist_link, scale: 0.3, colour: G.C.BLUE } }] } || undefined] } || undefined] }] }] };
};
G.UIDEF.credits = function () {
    let text_scale = 0.75;
    let t = create_UIBox_generic_options({ contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [create_tabs({ tabs: [{ label: "Production", chosen: true, tab_definition_function: function () {
                                    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.1, emboss: 0.05, minh: 6, minw: 10 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.2, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Original Soundtrack", scale: text_scale * 0.8, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "composed by ", scale: text_scale * 0.8, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "LouisF", scale: text_scale * 0.8, colour: G.C.BLUE, shadow: true } }] }, G.F_EXTERNAL_LINKS && { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [UIBox_button({ label: ["Instagram"], button: "louisf_insta" })] } || undefined, { n: G.UIT.R, config: { align: "cm", padding: 0.2 }, nodes: [{ n: G.UIT.T, config: { text: "Modified with their permission", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "tm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Porting", scale: text_scale * 0.6, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "PlayStation", scale: text_scale * 0.45, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Maarten De Meyer", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Xbox", scale: text_scale * 0.45, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Maarten De Meyer", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Android", scale: text_scale * 0.45, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Maarten De Meyer", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Apple Platforms", scale: text_scale * 0.45, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Maarten De Meyer", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Mac (Steam)", scale: text_scale * 0.45, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "william341", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Localization", scale: text_scale * 0.6, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Universally Speaking", scale: text_scale * 0.6, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "German", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Spanish Latam", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "French", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Indonesian", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Italian", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Japanese", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Korean", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Dutch", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Polish", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Portuguese Brasilian", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Russian", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Simplified Chinese", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Traditional Chinese", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Project managers", scale: text_scale * 0.35, colour: G.C.FILTER, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "tl", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Dominik May, Lisa-Marie Beck", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Rom\u00E1n Ren\u00E9 Orozco, Javier G\u00F3mez", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Romain Vervaecke, Claire G\u00E9rard", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Yopi Jalu Paksi, Sutarto Mohammad", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Oliver Cozzio, Giulia Benassi", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Takashi Fujimoto, Ai Parlow", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Haejung Lee, Sanghyun Bae", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Ellis Jongsma, Erik Nusselder", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Mariusz Wlodarczyk, Bartosz Klofik", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Samuel Modesto, R. Cali", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Yuliia Tatsenko, Natalia Rudane", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Shuai Fang, Liqi Ye", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Pauline Lin, AngelRabbitBB", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Ruoyang Yuan, Tania Car\u00E8", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }] }, { n: G.UIT.C, config: { align: "tm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Testing/QA", scale: text_scale * 0.6, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.03 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Vishwak Kondapalli", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Basha Syed", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "CampfireCollective", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "drspectred", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "TheRealEvab", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Brightqwerty", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "MrWizzrd", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "mcpower", scale: text_scale * 0.35, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }] }] };
                                } }, { label: "Publishing", tab_definition_function: function () {
                                    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.1, emboss: 0.05, minh: 6, minw: 10 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Playstack", scale: text_scale * 0.6, colour: G.C.RED, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Harvey Elliott", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Kevin Shrapnell", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Rob Crossley", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Liz Cheng-Moore", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Will Newell", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Charlotte Riley", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Alexander Saunders", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Naman Budhwar", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Tomasz Wisniowski", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Patrick Johnson", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Tom Verney", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Wouter van Halderen", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Shawn Cotter", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "tl", padding: 0.093 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "CEO", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "COO", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "VP of Publishing", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Lead Marketing Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Producer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Producer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Producer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Lead Visual Marketing Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Producer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Senior Discovery Scout", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Discovery Scout", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "PR Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Marketing Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }] }, { n: G.UIT.B, config: { align: "tl", w: 0.25, h: 0 }, nodes: {} }, { n: G.UIT.C, config: { align: "tl", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Marta Matyjewicz", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Rebecca Bell", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Alex Flynn", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Justas Pugaciauskas", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Jessica Chu", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Millicent Su", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Carla Malavasi", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Pawel Kwietniak", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Ela M\u00FCller", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Edgar Khoo", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Dami Ajiboye", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Aaron Ludlow", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Jenny Quintero", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "tl", padding: 0.093 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Marketing Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Finance", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Creative Director", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Graphic Designer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Lead Video Artist", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Senior User Acquisition Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Director of Publishing Services", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Front-end Developer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Graphic Designer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Video Editor", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Data Analyst", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Product Director", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Senior Partnerships Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }] }, { n: G.UIT.B, config: { align: "tl", w: 0.25, h: 0 }, nodes: {} }, { n: G.UIT.C, config: { align: "tl", padding: 0.05 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Stephanie Marti", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Emma Smith-Bodie", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Moe Abrams", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Piotr Kowalik", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Carmen Martino", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Rong Lin", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Bea Gomez", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Jose Olivares", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Joanna Kieronska", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Zuzanna Dawidowska", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Jean-Claude Vidanes ", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "AJ Purnell", scale: text_scale * 0.42, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "tl", padding: 0.093 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Senior Video Artist", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Community Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Customer Support", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Software Engineer", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "HR & Office Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Finance Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Video Editor", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "QA & Localisation Manager", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "QA Tester", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "QA Tester", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "QA Tester", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "QA Tester", scale: text_scale * 0.35, colour: G.C.GOLD, shadow: true } }] }] }] }] }] };
                                } }, { label: "Collabs", tab_definition_function: function () {
                                    G.collab_credits = G.collab_credits || { ["Vault-Tec"]: { artist: "Franek", ml_text: ["\u00A9 2025 ZeniMax.  ZeniMax and Bethesda Game Studios", "are trademarks of the ZeniMax group of companies. ", "All rights reserved."], art: "collab_FO" }, ["The Witcher"]: { artist: undefined, ml_text: ["\u00A9 2024 CD PROJEKT S.A. All rights reserved. CD PROJEKT,", "the CD PROJEKT logo, The Witcher and The Witcher Logo,", "Geralt, Geralt of Rivia and Yennefer are trademarks and/or", "registered trademarks of CD PROJEKT S.A. in the US and/or", "other countries. The Witcher game is set in the universe", "created by Andrzej Sapkowski in his series of books."], art: "collab_TW" }, ["Cyberpunk 2077"]: { artist: undefined, ml_text: ["Cyberpunk 2077 \u00A9 2024 CD PROJEKT S.A. All rights reserved."], art: "collab_CYP" }, ["Shovel Knight"]: { artist: "Neato", artist_link: "twitch.tv/neato", ml_text: ["Shovel Knight \u00A9 2024 Yacht Club Games, LLC. All Rights Reserved."], art: "collab_SK" }, ["Don\\'t Starve"]: { artist: undefined, ml_text: ["\u201CKLEI\u201D \u201CDON\\'T STARVE\u201D \u00A9 2024 All Rights Reserved", "Klei Entertainment 2024"], art: "collab_DS" }, ["Assassin\\'s Creed"]: { artist: "Franek", ml_text: ["Assassin\\'s Creed \u00A9 2025 Ubisoft Entertainment.", "All Rights Reserved."], art: "collab_AC" }, ["Slay the Princess"]: { artist: "Franek", ml_text: ["Slay the Princess (c) 2025 Black Tabby Games. All Rights Reserved.", "\"SLAY THE PRINCESS\" - Canadian Trademark App: 2351515", "SLAY THE PRINCESS LOGO - Canadian Trademark App: 2351516", "\"BLACK TABBY GAMES\" - Canadian Trademark App: 2351514"], art: "collab_STP" }, ["Among Us"]: { artist: undefined, ml_text: ["Among Us \u00A9 2024 Innersloth LLC. All Rights Reserved."], art: "collab_AU" }, ["The Binding of Isaac"]: { artist: "Neato", artist_link: "twitch.tv/neato", ml_text: ["The Binding of Isaac is copyright McMillen Games, Inc.", "All Rights Reserved"], art: "collab_TBoI" }, ["Cult of the Lamb"]: { artist: undefined, ml_text: ["Cult of the Lamb \u00A9 2024 Massive Monster All Rights Reserved"], art: "collab_CL" }, ["Divinity Original Sin 2"]: { artist: undefined, ml_text: ["\u00A92024 Larian Studios. Larian Studios, Divinity, Divinity: Original Sin", "and the Larian Studios logo are registered trademarks of Larian Studios", "Games Limited affiliates. All rights reserved."], art: "collab_D2" }, ["Critical Role"]: { artist: "Grace Berrios", artist_link: "@lassflores", ml_text: ["2025 \u00A9 Gilmore\u2019s Glorious Goods LLC. All Rights Reserved.", "Critical Role, Vox Machina, Mighty Nein, Bells Hells, character names,", "associated logos and images are all trademarks of Critical Role LLC.\""], art: "collab_CR" }, ["Bugsnax"]: { artist: "Neato", artist_link: "twitch.tv/neato", ml_text: ["\u00A9 2025 Bugsnax \u00A9 Young Horses Inc. All Rights Reserved."], art: "collab_BUG" }, ["Vampire Survivors"]: { artist: undefined, ml_text: undefined, art: "collab_VS" }, ["Slay the Spire"]: { artist: "Neato", artist_link: "twitch.tv/neato", ml_text: ["Slay the Spire \u00A92024 Mega Crit Games, LLC. All Rights Reserved."], art: "collab_STS" }, ["Potion Craft"]: { artist: undefined, ml_text: ["Potion Craft \u00A9 2024 tinyBuild, LLC. All Rights Reserved."], art: "collab_PC" }, ["Warframe"]: { artist: undefined, ml_text: ["Warframe \u00A92024 Digital Extremes Ltd. All rights reserved. Warframe", "and the Warframe logo are registered trademarks of Digital Extremes Ltd."], art: "collab_WF" }, ["Dead By Daylight"]: { artist: undefined, ml_text: ["\u00A9 2015-2025 and BEHAVIOUR, DEAD BY DAYLIGHT and other related trademarks", "and logos belong to Behaviour Interactive Inc. All rights reserved."], art: "collab_DBD" }, ["Dave the Diver"]: { artist: undefined, ml_text: ["Dave the Diver \u00A9 Mintrocket. All Rights Reserved."], art: "collab_DTD" }, ["Stardew Valley"]: { artist: "ConcernedApe", ml_text: ["\"Stardew Valley\" is a trademark of ConcernedApe LLC. All Rights Reserved"], art: "collab_SV" }, ["Enter the Gungeon"]: { artist: undefined, ml_text: ["Enter the Gungeon \u00A9 2024 Devolver Digital Inc.All Rights Reserved."], art: "collab_EG" }, ["1000xRESIST"]: { artist: undefined, ml_text: undefined, art: "collab_XR" }, ["Civilization VII"]: { artist: undefined, ml_text: ["CIVILIZATION Licensed Assets Courtesy of 2K Games, Inc.", "\u00A9 2025 Take-Two Interactive Software, Inc. and its subsidiaries."], art: "collab_C7" }, ["Rust"]: { artist: undefined, ml_text: ["Rust (c) 2025 Facepunch Studios Ltd. All Rights Reserved."], art: "collab_R" } };
                                    let middle = { n: G.UIT.R, config: { align: "cm", minh: 4.8, minw: 12.3 }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "CREDITS_check_collab", object: Moveable() } }] };
                                    let collab_options = {};
                                    for (const [k, v] of pairs(G.collab_credits)) {
                                        collab_options[collab_options.length + 1] = k;
                                    }
                                    table.sort(collab_options);
                                    G.viewed_collab = collab_options[1];
                                    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.2, colour: G.C.L_BLACK, r: 0.1, emboss: 0.05, minh: 6, minw: 10 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.2, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [create_option_cycle({ options: collab_options, opt_callback: "change_viewed_collab", current_option: 1, colour: G.C.RED, w: 4, mid: middle })] }] };
                                } }, { label: "Sounds", tab_definition_function: function () {
                                    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.1, emboss: 0.05, minh: 6, minw: 10 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "All sounds not listed here fall under ", scale: text_scale * 0.6, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Creative Commons - CC0", scale: text_scale * 0.6, colour: G.C.BLUE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "\"chamber_choir_chord_o.wav\" (Used for Polychrome sound) by uair01 (https://freesound.org/people/uair01/sounds/65195/)", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "is licensed under ", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Attribution 3.0 License", scale: text_scale * 0.5, colour: G.C.GOLD, shadow: true } }, { n: G.UIT.T, config: { text: ". This work has been modified from its original state", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "\"Coffee1.wav\" (Used for Tarot card sound) by Nathan Gibson (https://nathangibson.myportfolio.com)", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "is licensed under ", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Attribution 4.0 License", scale: text_scale * 0.5, colour: G.C.ORANGE, shadow: true } }, { n: G.UIT.T, config: { text: ".", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "\"Wood Block1.wav\" (Used for Tarot card sound) by Nathan Gibson (https://nathangibson.myportfolio.com)", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "is licensed under ", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Attribution 4.0 License", scale: text_scale * 0.5, colour: G.C.ORANGE, shadow: true } }, { n: G.UIT.T, config: { text: ".", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "\"Toy records#06-E3-02.wav\" (Used for Mult sounds) by poissonmort (https://freesound.org/people/poissonmort/sounds/253249/)", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "is licensed under ", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Attribution 4.0 License", scale: text_scale * 0.5, colour: G.C.ORANGE, shadow: true } }, { n: G.UIT.T, config: { text: ". This work has been modified from its original state", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] };
                                } }, { label: "Imagery", tab_definition_function: function () {
                                    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.1, emboss: 0.05, minh: 6, minw: 10 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "The font \"m6x11.ttf\" by Daniel Linssen (https://managore.itch.io/m6x11)", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "is licensed under an ", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Attribution License", scale: text_scale * 0.5, colour: G.C.GOLD, shadow: true } }, { n: G.UIT.T, config: { text: ".", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, !G.F_BASIC_CREDITS && { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Check out his itch.io profile, he has made an incredible catalogue of games.", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] } || undefined] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "The Joker \"Vagabond\" was created by Lumpy Touch", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "The Collab art for Slay the Spire and The Binding of Isaac was", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "created by ", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }, { n: G.UIT.T, config: { text: "Neato", scale: text_scale * 0.5, colour: G.C.GOLD, shadow: true } }, { n: G.UIT.T, config: { text: " (twitch.tv/neato)", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "All sprites, shaders, and any other visual assets", scale: text_scale * 0.6, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "not listed here were created by LocalThunk.", scale: text_scale * 0.6, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "\u00A92024 - All rights reserved", scale: text_scale * 0.6, colour: G.C.BLUE, shadow: true } }] }] };
                                } }, { label: "Misc", tab_definition_function: function () {
                                    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.2, colour: G.C.BLACK, r: 0.1, emboss: 0.05, minh: 6, minw: 6 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "For Marshal", scale: text_scale * 0.6, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1, outline_colour: G.C.JOKER_GREY, r: 0.1, outline: 1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Special Thanks", scale: text_scale * 0.6, colour: G.C.GREEN, shadow: true } }] }, { n: G.UIT.R, config: { align: "tm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "tl", padding: 0.05, minw: 2.5 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Nicole", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Josh", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Jeremy", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Dylan", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Justin", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Daniel", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Colby", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Thomas", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Mom & Dad", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Luc & Donna", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }, { n: G.UIT.C, config: { align: "tl", padding: 0.05, minw: 2.5 }, nodes: [{ n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "GothicLordUK", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Big Simple", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "MALF", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Northernlion", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Purple Moss Collectors", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Dan Gheesling", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Fabian Fischer", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "newobject", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "MurphyObv", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: "Love2D", scale: text_scale * 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }] }] };
                                } }], snap_to_nav: true })] }] });
    return t;
};
G.UIDEF.challenges = function (from_game_over) {
    if (G.PROFILES[G.SETTINGS.profile].all_unlocked) {
        G.PROFILES[G.SETTINGS.profile].challenges_unlocked = G.CHALLENGES.length;
    }
    if (!G.PROFILES[G.SETTINGS.profile].challenges_unlocked) {
        let deck_wins = 0;
        for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile].deck_usage)) {
            if (v.wins && v.wins[1]) {
                deck_wins = deck_wins + 1;
            }
        }
        let loc_nodes = {};
        localize({ type: "descriptions", key: "challenge_locked", set: "Other", nodes: loc_nodes, vars: [G.CHALLENGE_WINS, deck_wins], default_col: G.C.WHITE });
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.1, colour: G.C.CLEAR, minh: 8.02, minw: 7 }, nodes: [transparent_multiline_text(loc_nodes)] };
    }
    G.run_setup_seed = undefined;
    if (G.OVERLAY_MENU) {
        let seed_toggle = G.OVERLAY_MENU.get_UIE_by_ID("run_setup_seed");
        if (seed_toggle) {
            seed_toggle.states.visible = false;
        }
    }
    let [_ch_comp, _ch_tot] = [0, G.CHALLENGES.length];
    for (const [k, v] of ipairs(G.CHALLENGES)) {
        if (v.id && G.PROFILES[G.SETTINGS.profile].challenge_progress.completed[v.id || ""]) {
            _ch_comp = _ch_comp + 1;
        }
    }
    let _ch_tab = { comp: _ch_comp, unlocked: G.PROFILES[G.SETTINGS.profile].challenges_unlocked };
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.1, colour: G.C.CLEAR, minh: 8, minw: 7 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_challenge_mode"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minw: 8.5, minh: 1.5, padding: 0.2 }, nodes: [UIBox_button({ id: from_game_over && "from_game_over" || undefined, label: [localize("b_new_challenge")], button: "challenge_list", minw: 4, scale: 0.4, minh: 0.6 })] }, { n: G.UIT.R, config: { align: "cm", minh: 0.8, r: 0.1, minw: 4.5, colour: G.C.L_BLACK, emboss: 0.05, progress_bar: { max: _ch_tot, ref_table: _ch_tab, ref_value: "unlocked", empty_col: G.C.L_BLACK, filled_col: G.C.FILTER } }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: 4.5 }, nodes: [{ n: G.UIT.T, config: { text: localize({ type: "variable", key: "unlocked", vars: [_ch_tab.unlocked, _ch_tot] }), scale: 0.3, colour: G.C.WHITE, shadow: true } }] }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.8, r: 0.1, minw: 4.5, colour: G.C.L_BLACK, emboss: 0.05, progress_bar: { max: _ch_tot, ref_table: _ch_tab, ref_value: "comp", empty_col: G.C.L_BLACK, filled_col: adjust_alpha(G.C.GREEN, 0.5) } }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, minw: 4.5 }, nodes: [{ n: G.UIT.T, config: { text: localize({ type: "variable", key: "completed", vars: [_ch_comp, _ch_tot] }), scale: 0.3, colour: G.C.WHITE, shadow: true } }] }] }] }, G.F_DAILIES && { n: G.UIT.R, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_daily_run"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cl", minw: 8.5, minh: 4 }, nodes: [G.UIDEF.daily_overview()] }] } || undefined] };
};
G.UIDEF.daily_overview = function () {
    let [hist_height, hist_width] = [3, 3];
    let daily_results = { score: { me: { val: 20000, percentile: 75 }, hist: [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.15, 0.1, 0.1, 0.05, 0.05, 0.05, 0.05, 0.05] } };
    let [score_hist, max_score_hist] = [{}, 0];
    for (const [k, v] of ipairs(daily_results.score.hist)) {
        if (max_score_hist < v) {
            max_score_hist = v;
        }
    }
    for (const [k, v] of ipairs(daily_results.score.hist)) {
        score_hist[score_hist.length + 1] = { n: G.UIT.C, config: { align: "bm" }, nodes: [{ n: G.UIT.C, config: { colour: G.C.BLUE, minw: hist_width / daily_results.score.hist.length, minh: (v + 0.05 * math.random()) / max_score_hist * hist_height } }] };
    }
    return { n: G.UIT.R, config: { align: "cm" }, nodes: score_hist };
};
G.UIDEF.run_setup = function (from_game_over) {
    G.run_setup_seed = undefined;
    let _challenge_chosen = from_game_over === "challenge_list";
    from_game_over = from_game_over && !(from_game_over === "challenge_list");
    let _can_continue = G.MAIN_MENU_UI && G.FUNCS.can_continue({ config: { func: true } });
    G.FUNCS.false_ret = function () {
        return false;
    };
    let t = create_UIBox_generic_options({ no_back: from_game_over, no_esc: from_game_over, contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0, draw_layer: 1 }, nodes: [create_tabs({ tabs: [{ label: localize("b_new_run"), chosen: !_challenge_chosen && !_can_continue, tab_definition_function: G.UIDEF.run_setup_option, tab_definition_function_args: "New Run" }, G.STAGE === G.STAGES.MAIN_MENU && { label: localize("b_continue"), chosen: !_challenge_chosen && _can_continue, tab_definition_function: G.UIDEF.run_setup_option, tab_definition_function_args: "Continue", func: "can_continue" } || { label: localize("b_challenges"), tab_definition_function: G.UIDEF.challenges, tab_definition_function_args: from_game_over, chosen: _challenge_chosen }, G.STAGE === G.STAGES.MAIN_MENU && { label: localize("b_challenges"), tab_definition_function: G.UIDEF.challenges, tab_definition_function_args: from_game_over, chosen: _challenge_chosen } || undefined], snap_to_nav: true })] }] });
    return t;
};
G.UIDEF.profile_select = function () {
    G.focused_profile = G.focused_profile || G.SETTINGS.profile || 1;
    let t = create_UIBox_generic_options({ padding: 0, contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0, draw_layer: 1, minw: 4 }, nodes: [create_tabs({ tabs: [{ label: 1, chosen: G.focused_profile === 1, tab_definition_function: G.UIDEF.profile_option, tab_definition_function_args: 1 }, { label: 2, chosen: G.focused_profile === 2, tab_definition_function: G.UIDEF.profile_option, tab_definition_function_args: 2 }, { label: 3, chosen: G.focused_profile === 3, tab_definition_function: G.UIDEF.profile_option, tab_definition_function_args: 3 }], snap_to_nav: true })] }] });
    return t;
};
G.UIDEF.profile_option = function (_profile) {
    set_discover_tallies();
    G.focused_profile = _profile;
    let profile_data = get_compressed(G.focused_profile + ("/" + "profile.jkr"));
    if (profile_data !== undefined) {
        profile_data = STR_UNPACK(profile_data);
        profile_data.name = profile_data.name || "P" + _profile;
    }
    G.PROFILES[_profile].name = profile_data && profile_data.name || "";
    let [lwidth, rwidth, scale] = [1, 1, 1];
    G.CHECK_PROFILE_DATA = undefined;
    let t = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, minh: 0.8 }, nodes: [(_profile === G.SETTINGS.profile || !profile_data) && { n: G.UIT.R, config: { align: "cm" }, nodes: [create_text_input({ w: 4, max_length: 16, prompt_text: localize("k_enter_name"), ref_table: G.PROFILES[_profile], ref_value: "name", extended_corpus: true, keyboard_offset: 1, callback: function () {
                                    G.save_settings();
                                    G.FILE_HANDLER.force = true;
                                } })] } || { n: G.UIT.R, config: { align: "cm", padding: 0.1, minw: 4, r: 0.1, colour: G.C.BLACK, minh: 0.6 }, nodes: [{ n: G.UIT.T, config: { text: G.PROFILES[_profile].name, scale: 0.45, colour: G.C.WHITE } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 6 }, nodes: [G.PROFILES[_profile].progress && G.PROFILES[_profile].progress.discovered && create_progress_box(G.PROFILES[_profile].progress, 0.5) || { n: G.UIT.C, config: { align: "cm", minh: 4, minw: 5.2, colour: G.C.BLACK, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_empty_caps"), scale: 0.5, colour: G.C.UI.TRANSPARENT_LIGHT } }] }] }, { n: G.UIT.C, config: { align: "cm", minh: 4 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 1 }, nodes: [profile_data && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("k_wins"), colour: G.C.UI.TEXT_LIGHT, scale: scale * 0.7 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: ": ", colour: G.C.UI.TEXT_LIGHT, scale: scale * 0.7 } }] }, { n: G.UIT.C, config: { align: "cl", minw: rwidth }, nodes: [{ n: G.UIT.T, config: { text: tostring(profile_data.career_stats.c_wins), colour: G.C.RED, shadow: true, scale: 1 * scale } }] }] } || undefined] }, { n: G.UIT.R, config: { align: "cm", padding: 0.2 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minw: 4, maxw: 4, minh: 0.8, padding: 0.2, r: 0.1, hover: true, colour: G.C.BLUE, func: "can_load_profile", button: "load_profile", shadow: true, focus_args: { nav: "wide" } }, nodes: [{ n: G.UIT.T, config: { text: _profile === G.SETTINGS.profile && localize("b_current_profile") || profile_data && localize("b_load_profile") || localize("b_create_profile"), ref_value: "load_button_text", scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0, minh: 0.7 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minw: 3, maxw: 4, minh: 0.6, padding: 0.2, r: 0.1, hover: true, colour: G.C.RED, func: "can_delete_profile", button: "delete_profile", shadow: true, focus_args: { nav: "wide" } }, nodes: [{ n: G.UIT.T, config: { text: _profile === G.SETTINGS.profile && localize("b_reset_profile") || localize("b_delete_profile"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT } }] }] }, _profile === G.SETTINGS.profile && !G.PROFILES[G.SETTINGS.profile].all_unlocked && { n: G.UIT.R, config: { align: "cm", padding: 0, minh: 0.7 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minw: 3, maxw: 4, minh: 0.6, padding: 0.2, r: 0.1, hover: true, colour: G.C.ORANGE, func: "can_unlock_all", button: "unlock_all", shadow: true, focus_args: { nav: "wide" } }, nodes: [{ n: G.UIT.T, config: { text: localize("b_unlock_all"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT } }] }] } || { n: G.UIT.R, config: { align: "cm", minw: 3, maxw: 4, minh: 0.7 }, nodes: [G.PROFILES[_profile].all_unlocked && (!G.F_NO_ACHIEVEMENTS && { n: G.UIT.T, config: { text: localize(G.F_TROPHIES && "k_trophies_disabled" || "k_achievements_disabled"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT } } || undefined) || undefined] }] }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { id: "warning_text", text: localize("ph_click_confirm"), scale: 0.4, colour: G.C.CLEAR } }] }] };
    return t;
};
G.UIDEF.stake_description = function (_stake) {
    let _stake_center = G.P_CENTER_POOLS.Stake[_stake];
    let ret_nodes = {};
    if (_stake_center) {
        localize({ type: "descriptions", key: _stake_center.key, set: _stake_center.set, nodes: ret_nodes });
    }
    let desc_t = {};
    for (const [k, v] of ipairs(ret_nodes)) {
        desc_t[desc_t.length + 1] = { n: G.UIT.R, config: { align: "cm", maxw: 5.3 }, nodes: v };
    }
    return { n: G.UIT.C, config: { align: "cm", padding: 0.05, r: 0.1, colour: G.C.L_BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize({ type: "name_text", key: _stake_center.key, set: _stake_center.set }), scale: 0.35, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.03, colour: G.C.WHITE, r: 0.1, minh: 1, minw: 5.5 }, nodes: desc_t }] };
};
G.UIDEF.stake_option = function (_type) {
    let middle = { n: G.UIT.R, config: { align: "cm", minh: 1.7, minw: 7.3 }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "RUN_SETUP_check_stake2", object: Moveable() } }] };
    let max_stake = get_deck_win_stake(G.GAME.viewed_back.effect.center.key);
    if (G.PROFILES[G.SETTINGS.profile].all_unlocked) {
        max_stake = G.P_CENTER_POOLS["Stake"].length;
    }
    let stake_options = {};
    for (let i = 1; i <= math.min(max_stake + 1, G.P_CENTER_POOLS["Stake"].length); i++) {
        stake_options[i] = i;
    }
    return { n: G.UIT.ROOT, config: { align: "tm", colour: G.C.CLEAR, minh: 2.03, minw: 8.3 }, nodes: [_type === "Continue" && middle || create_option_cycle({ options: stake_options, opt_callback: "change_stake", current_option: G.viewed_stake, colour: G.C.RED, w: 6, mid: middle })] };
};
G.UIDEF.viewed_stake_option = function () {
    G.viewed_stake = G.viewed_stake || 1;
    let max_stake = get_deck_win_stake(G.GAME.viewed_back.effect.center.key);
    if (G.PROFILES[G.SETTINGS.profile].all_unlocked) {
        max_stake = G.P_CENTER_POOLS["Stake"].length;
    }
    G.viewed_stake = math.min(max_stake + 1, G.viewed_stake);
    if (G.viewed_stake > G.P_CENTER_POOLS.Stake.length) {
        G.viewed_stake = G.P_CENTER_POOLS.Stake.length;
    }
    if (_type !== "Continue") {
        G.PROFILES[G.SETTINGS.profile].MEMORY.stake = G.viewed_stake;
    }
    let stake_sprite = get_stake_sprite(G.viewed_stake);
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.BLACK, r: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_stake"), scale: 0.4, colour: G.C.L_BLACK, vert: true } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { colour: G.C.BLUE, object: stake_sprite, hover: true, can_collide: false } }] }, G.UIDEF.stake_description(G.viewed_stake)] }] };
};
G.UIDEF.challenge_list = function (from_game_over) {
    G.CHALLENGE_PAGE_SIZE = 10;
    let challenge_pages = {};
    for (let i = 1; i <= math.ceil(G.CHALLENGES.length / G.CHALLENGE_PAGE_SIZE); i++) {
        table.insert(challenge_pages, localize("k_page") + (" " + (tostring(i) + ("/" + tostring(math.ceil(G.CHALLENGES.length / G.CHALLENGE_PAGE_SIZE))))));
    }
    G.E_MANAGER.add_event(new GameEvent({ func: function () {
            G.FUNCS.change_challenge_list_page({ cycle_config: { current_option: 1 } });
            return true;
        } }));
    let [_ch_comp, _ch_tot] = [0, G.CHALLENGES.length];
    for (const [k, v] of ipairs(G.CHALLENGES)) {
        if (v.id && G.PROFILES[G.SETTINGS.profile].challenge_progress.completed[v.id || ""]) {
            _ch_comp = _ch_comp + 1;
        }
    }
    let t = create_UIBox_generic_options({ back_id: from_game_over && "from_game_over" || undefined, back_func: "setup_run", back_id: "challenge_list", contents: [{ n: G.UIT.C, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, minh: 7, minw: 4.2 }, nodes: [{ n: G.UIT.O, config: { id: "challenge_list", object: Moveable() } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [create_option_cycle({ id: "challenge_page", scale: 0.9, h: 0.3, w: 3.5, options: challenge_pages, cycle_shoulders: true, opt_callback: "change_challenge_list_page", current_option: 1, colour: G.C.RED, no_pips: true, focus_args: { snap_to: true } })] }, { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: localize({ type: "variable", key: "challenges_completed", vars: [_ch_comp, _ch_tot] }), scale: 0.4, colour: G.C.WHITE } }] }] }, { n: G.UIT.C, config: { align: "cm", minh: 9, minw: 11.5 }, nodes: [{ n: G.UIT.O, config: { id: "challenge_area", object: Moveable() } }] }] });
    return t;
};
G.UIDEF.challenge_list_page = function (_page) {
    let snapped = false;
    let challenge_list = {};
    for (const [k, v] of ipairs(G.CHALLENGES)) {
        if (k > G.CHALLENGE_PAGE_SIZE * (_page || 0) && k <= G.CHALLENGE_PAGE_SIZE * ((_page || 0) + 1)) {
            if (G.CONTROLLER.focused.target && G.CONTROLLER.focused.target.config.id === "challenge_page") {
                snapped = true;
            }
            let challenge_completed = G.PROFILES[G.SETTINGS.profile].challenge_progress.completed[v.id || ""];
            let challenge_unlocked = G.PROFILES[G.SETTINGS.profile].challenges_unlocked && G.PROFILES[G.SETTINGS.profile].challenges_unlocked >= k;
            if (v.unlocked && type(v.unlocked) === "function") {
                challenge_unlocked = v.unlocked();
            }
            else if (type(v.unlocked) === "boolean") {
                challenge_unlocked = v.unlocked;
            }
            challenge_unlocked = challenge_unlocked || G.PROFILES[G.SETTINGS.profile].all_unlocked;
            challenge_list[challenge_list.length + 1] = { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cl", minw: 0.8 }, nodes: [{ n: G.UIT.T, config: { text: k + "", scale: 0.4, colour: G.C.WHITE } }] }, UIBox_button({ id: k, col: true, label: [challenge_unlocked && localize(v.id, "challenge_names") || localize("k_locked")], button: challenge_unlocked && "change_challenge_description" || "nil", colour: challenge_unlocked && G.C.RED || G.C.GREY, minw: 4, scale: 0.4, minh: 0.6, focus_args: { snap_to: !snapped } }), { n: G.UIT.C, config: { align: "cm", padding: 0.05, minw: 0.6 }, nodes: [{ n: G.UIT.C, config: { minh: 0.4, minw: 0.4, emboss: 0.05, r: 0.1, colour: challenge_completed && G.C.GREEN || G.C.BLACK }, nodes: [challenge_completed && { n: G.UIT.O, config: { object: new Sprite(0, 0, 0.4, 0.4, G.ASSET_ATLAS["icons"], { x: 1, y: 0 }) } } || undefined] }] }] };
            snapped = true;
        }
    }
    return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.1, colour: G.C.CLEAR }, nodes: challenge_list };
};
G.UIDEF.challenge_description = function (_id, daily, is_row) {
    let challenge = G.CHALLENGES[_id];
    if (!challenge) {
        return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.BLACK, minh: 8.82, minw: 11.5, r: 0.1 }, nodes: [{ n: G.UIT.T, config: { text: localize("ph_select_challenge"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT } }] };
    }
    let joker_size = 0.6;
    let jokers = CardArea(0, 0, 10 * joker_size, 0.6 * G.CARD_H, { card_limit: get_challenge_rule(challenge, "modifiers", "joker_limit") || 5, card_w: joker_size * G.CARD_W, type: "title_2", highlight_limit: 0 });
    if (challenge.jokers) {
        for (const [k, v] of ipairs(challenge.jokers)) {
            let card = Card(0, 0, G.CARD_W * joker_size, G.CARD_H * joker_size, undefined, G.P_CENTERS[v.id], { bypass_discovery_center: true, bypass_discovery_ui: true, bypass_lock: true });
            if (v.edition) {
                card.set_edition({ [v.edition]: true }, true, true);
            }
            if (v.eternal) {
                card.set_eternal(true);
            }
            if (v.pinned) {
                card.pinned = true;
            }
            jokers.emplace(card);
        }
    }
    let joker_col = { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.L_BLACK, r: 0.1, maxh: 1.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_jokers_cap"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT, vert: true, shadow: true } }, { n: G.UIT.C, config: { align: "cm", minh: 0.6 * G.CARD_H, minw: 5, r: 0.1, colour: G.C.UI.TRANSPARENT_DARK }, nodes: [jokers && { n: G.UIT.O, config: { object: jokers } } || { n: G.UIT.T, config: { text: localize("k_none"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] };
    let consumeables = CardArea(0, 0, 3 * joker_size, 0.6 * G.CARD_H, { card_limit: get_challenge_rule(challenge, "modifiers", "consumable_limit") || 2, card_w: joker_size * G.CARD_W, type: "title_2", spread: true, highlight_limit: 0 });
    if (challenge.consumeables) {
        for (const [k, v] of ipairs(challenge.consumeables)) {
            let card = Card(0, 0, G.CARD_W * joker_size, G.CARD_H * joker_size, undefined, G.P_CENTERS[v.id], { bypass_discovery_center: true, bypass_discovery_ui: true, bypass_lock: true });
            if (v.edition) {
                card.set_edition({ [v.edition]: true }, true, true);
            }
            if (v.eternal) {
                card.set_eternal(true);
            }
            consumeables.emplace(card);
        }
    }
    let consumable_col = { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.L_BLACK, r: 0.1, maxh: 1.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_cap_consumables"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT, vert: true, shadow: true } }, { n: G.UIT.C, config: { align: "cm", minh: 0.6 * G.CARD_H, r: 0.1, colour: G.C.UI.TRANSPARENT_DARK }, nodes: [consumeables && { n: G.UIT.O, config: { object: consumeables } } || { n: G.UIT.T, config: { text: localize("k_none"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] };
    let vouchers = CardArea(0, 0, 3 * joker_size, 0.6 * G.CARD_H, { card_limit: undefined, card_w: joker_size * G.CARD_W, type: "title_2", spread: true, highlight_limit: 0 });
    if (challenge.vouchers) {
        for (const [k, v] of ipairs(challenge.vouchers)) {
            let card = Card(0, 0, G.CARD_W * joker_size, G.CARD_H * joker_size, undefined, G.P_CENTERS[v.id], { bypass_discovery_center: true, bypass_discovery_ui: true, bypass_lock: true });
            if (v.edition) {
                card.set_edition({ [v.edition]: true }, true, true);
            }
            if (v.eternal) {
                card.set_eternal(true);
            }
            vouchers.emplace(card);
        }
    }
    let voucher_col = { n: G.UIT.C, config: { align: "cm", padding: 0.05, colour: G.C.L_BLACK, r: 0.1, maxh: 1.8 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_vouchers_cap"), scale: 0.33, colour: G.C.UI.TEXT_LIGHT, vert: true, shadow: true } }, { n: G.UIT.C, config: { align: "cm", minh: 0.6 * G.CARD_H, r: 0.1, colour: G.C.UI.TRANSPARENT_DARK }, nodes: [vouchers && { n: G.UIT.O, config: { object: vouchers } } || { n: G.UIT.T, config: { text: localize("k_none"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT } }] }] };
    return { n: is_row && G.UIT.R || G.UIT.ROOT, config: { align: "cm", r: 0.1, colour: G.C.BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: [joker_col, consumable_col, voucher_col] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [create_tabs({ tabs: [{ label: localize("b_rules"), chosen: true, tab_definition_function: G.UIDEF.challenge_description_tab, tab_definition_function_args: { _id: _id, _tab: "Rules" } }, { label: localize("b_restrictions"), tab_definition_function: G.UIDEF.challenge_description_tab, tab_definition_function_args: { _id: _id, _tab: "Restrictions" } }, { label: localize("b_deck"), tab_definition_function: G.UIDEF.challenge_description_tab, tab_definition_function_args: { _id: _id, _tab: "Deck" } }], tab_h: 5, padding: 0, text_scale: 0.36, scale: 0.85, no_shoulders: true, no_loop: true })] }, !is_row && { n: G.UIT.R, config: { align: "cm", minh: 0.9 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.1, minh: 0.7, minw: 9, r: 0.1, hover: true, colour: G.C.BLUE, button: "start_challenge_run", shadow: true, id: _id }, nodes: [{ n: G.UIT.T, config: { text: localize("b_play_cap"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT, func: "set_button_pip", focus_args: { button: "x", set_button_pip: true } } }] }] } || undefined] };
};
G.UIDEF.challenge_description_tab = function (args) {
    args = args || {};
    if (args._tab === "Rules") {
        let challenge = G.CHALLENGES[args._id];
        let start_rules = {};
        let modded_starts = undefined;
        let game_rules = {};
        let starting_params = get_starting_params();
        let base_modifiers = { dollars: { value: starting_params.dollars, order: 6 }, discards: { value: starting_params.discards, order: 2 }, hands: { value: starting_params.hands, order: 1 }, reroll_cost: { value: starting_params.reroll_cost, order: 7 }, joker_slots: { value: starting_params.joker_slots, order: 4 }, consumable_slots: { value: starting_params.consumable_slots, order: 5 }, hand_size: { value: starting_params.hand_size, order: 3 } };
        let bonus_mods = 100;
        if (challenge.rules) {
            if (challenge.rules.modifiers) {
                for (const [k, v] of ipairs(challenge.rules.modifiers)) {
                    base_modifiers[v.id] = { value: v.value, order: base_modifiers[v.id] && base_modifiers[v.id].order || bonus_mods, custom: true, old_val: base_modifiers[v.id].value };
                    bonus_mods = bonus_mods + 1;
                }
            }
        }
        let nu_base_modifiers = {};
        for (const [k, v] of pairs(base_modifiers)) {
            v.key = k;
            nu_base_modifiers[nu_base_modifiers.length + 1] = v;
        }
        table.sort(nu_base_modifiers, function (a, b) {
            return a.order < b.order;
        });
        for (const [k, v] of ipairs(nu_base_modifiers)) {
            if (v.old_val) {
                modded_starts = modded_starts || {};
                modded_starts[modded_starts.length + 1] = { n: G.UIT.R, config: { align: "cl", maxw: 3.5 }, nodes: localize({ type: "text", key: "ch_m_" + v.key, vars: [v.value], default_col: G.C.L_BLACK }) };
            }
            else {
                start_rules[start_rules.length + 1] = { n: G.UIT.R, config: { align: "cl", maxw: 3.5 }, nodes: localize({ type: "text", key: "ch_m_" + v.key, vars: [v.value], default_col: !v.custom && G.C.UI.TEXT_INACTIVE || undefined }) };
            }
        }
        if (modded_starts) {
            start_rules = [modded_starts && { n: G.UIT.R, config: { align: "cl", padding: 0.05 }, nodes: modded_starts } || undefined, { n: G.UIT.R, config: { align: "cl", padding: 0.05, colour: G.C.GREY }, nodes: {} }, { n: G.UIT.R, config: { align: "cl", padding: 0.05 }, nodes: start_rules }];
        }
        if (challenge.rules) {
            if (challenge.rules.custom) {
                for (const [k, v] of ipairs(challenge.rules.custom)) {
                    game_rules[game_rules.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: localize({ type: "text", key: "ch_c_" + v.id, vars: [v.value] }) };
                }
            }
        }
        if (!start_rules[1] && !modded_starts) {
            start_rules[start_rules.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: localize({ type: "text", key: "ch_m_none", vars: {} }) };
        }
        if (!game_rules[1]) {
            game_rules[game_rules.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: localize({ type: "text", key: "ch_c_none", vars: {} }) };
        }
        let starting_rule_list = { n: G.UIT.C, config: { align: "cm", minw: 3, r: 0.1, colour: G.C.BLUE }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08, minh: 0.6 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_game_modifiers"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 4.1, minw: 4.2, padding: 0.05, r: 0.1, colour: G.C.WHITE }, nodes: start_rules }] };
        let override_rule_list = { n: G.UIT.C, config: { align: "cm", minw: 3, r: 0.1, colour: G.C.BLUE }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08, minh: 0.6 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_custom_rules"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 4.1, minw: 6.8, maxw: 6.7, padding: 0.05, r: 0.1, colour: G.C.WHITE }, nodes: game_rules }] };
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1, colour: G.C.L_BLACK, r: 0.1, minw: 3 }, nodes: [override_rule_list, starting_rule_list] }] };
    }
    else if (args._tab === "Restrictions") {
        let challenge = G.CHALLENGES[args._id];
        let [banned_cards, banned_tags, banned_other] = [{}, {}, {}];
        if (challenge.restrictions) {
            if (challenge.restrictions.banned_cards) {
                let row_cards = {};
                let n_rows = math.max(1, math.floor(challenge.restrictions.banned_cards.length / 10) + 2 - math.floor(math.log(6, challenge.restrictions.banned_cards.length)));
                let max_width = 1;
                for (const [k, v] of ipairs(challenge.restrictions.banned_cards)) {
                    let _row = math.floor((k - 1) * n_rows / challenge.restrictions.banned_cards.length + 1);
                    row_cards[_row] = row_cards[_row] || {};
                    row_cards[_row][row_cards[_row].length + 1] = v;
                    if (row_cards[_row].length > max_width) {
                        max_width = row_cards[_row].length;
                    }
                }
                let card_size = math.max(0.3, 0.75 - 0.01 * max_width * n_rows);
                for (const [_, row_card] of ipairs(row_cards)) {
                    let banned_card_area = CardArea(0, 0, 6.7, 3.3 / n_rows, { card_limit: undefined, type: "title_2", view_deck: true, highlight_limit: 0, card_w: G.CARD_W * card_size });
                    table.insert(banned_cards, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: banned_card_area } }] });
                    for (const [k, v] of ipairs(row_card)) {
                        let card = Card(0, 0, G.CARD_W * card_size, G.CARD_H * card_size, undefined, G.P_CENTERS[v.id], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        banned_card_area.emplace(card);
                    }
                }
            }
            if (challenge.restrictions.banned_tags) {
                let tag_tab = {};
                for (const [k, v] of pairs(challenge.restrictions.banned_tags)) {
                    tag_tab[tag_tab.length + 1] = G.P_TAGS[v.id];
                }
                table.sort(tag_tab, function (a, b) {
                    return a.order < b.order;
                });
                for (const [k, v] of ipairs(tag_tab)) {
                    let temp_tag = Tag(v.key);
                    let temp_tag_ui = temp_tag.generate_UI(1.1 - 0.25 * math.sqrt(challenge.restrictions.banned_tags.length));
                    table.insert(banned_tags, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [temp_tag_ui] });
                }
            }
            if (challenge.restrictions.banned_other) {
                let other_tab = {};
                for (const [k, v] of pairs(challenge.restrictions.banned_other)) {
                    if (v.type === "blind") {
                        other_tab[other_tab.length + 1] = G.P_BLINDS[v.id];
                    }
                }
                table.sort(other_tab, function (a, b) {
                    return a.order < b.order;
                });
                for (const [k, v] of ipairs(other_tab)) {
                    let temp_blind =new AnimatedSprite(0, 0, 1, 1, G.ANIMATION_ATLAS[v.atlas || ""] || G.ANIMATION_ATLAS["blind_chips"], v.pos);
                    temp_blind.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
                    temp_blind.float = true;
                    temp_blind.states.hover.can = true;
                    temp_blind.states.drag.can = false;
                    temp_blind.states.collide.can = true;
                    temp_blind.config = { blind: v, force_focus: true };
                    temp_blind.hover = function () {
                        if (!G.CONTROLLER.dragging.target || G.CONTROLLER.using_touch) {
                            if (!temp_blind.hovering && temp_blind.states.visible) {
                                temp_blind.hovering = true;
                                temp_blind.hover_tilt = 3;
                                temp_blind.juice_up(0.05, 0.02);
                                play_sound("chips1", math.random() * 0.1 + 0.55, 0.12);
                                temp_blind.config.h_popup = create_UIBox_blind_popup(v, true);
                                temp_blind.config.h_popup_config = { align: "cl", offset: { x: -0.1, y: 0 }, parent: temp_blind };
                                Node.hover(temp_blind);
                            }
                        }
                    };
                    temp_blind.stop_hover = function () {
                        temp_blind.hovering = false;
                        Node.stop_hover(temp_blind);
                        temp_blind.hover_tilt = 0;
                    };
                    table.insert(banned_other, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: temp_blind } }] });
                }
            }
        }
        if (!banned_cards[1]) {
            banned_cards[banned_cards.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: localize({ type: "text", key: "ch_m_none", vars: {} }) };
        }
        if (!banned_tags[1]) {
            banned_tags[banned_tags.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: localize({ type: "text", key: "ch_c_none", vars: {} }) };
        }
        if (!banned_other[1]) {
            banned_other[banned_other.length + 1] = { n: G.UIT.R, config: { align: "cl" }, nodes: localize({ type: "text", key: "ch_c_none", vars: {} }) };
        }
        let banned_cards = { n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.RED }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08, minh: 0.6 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_banned_cards"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 4.1, minw: 7.33, padding: 0.05, r: 0.1, colour: G.C.WHITE }, nodes: banned_cards }] };
        let banned_tags = { n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.RED }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08, minh: 0.6, maxw: 1.48 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_banned_tags"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 4.1, minw: 1.48, padding: 0.05, r: 0.1, colour: G.C.WHITE }, nodes: banned_tags }] };
        let banned_other = { n: G.UIT.C, config: { align: "cm", r: 0.1, colour: G.C.RED }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.08, minh: 0.6, maxw: 1.84 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_other"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 4.1, minw: 2, padding: 0.05, r: 0.1, colour: G.C.WHITE }, nodes: banned_other }] };
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0.05, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1, colour: G.C.L_BLACK, r: 0.1 }, nodes: [banned_cards, banned_tags, banned_other] }] };
    }
    else if (args._tab === "Deck") {
        let challenge = G.CHALLENGES[args._id];
        let deck_tables = {};
        let SUITS = {};
        let suit_map = {};
        for (let i = SMODS.Suit.obj_buffer.length; i <= 1; i += -1) {
            let suit = SMODS.Suits[SMODS.Suit.obj_buffer[i]];
            SUITS[suit.card_key] = {};
            suit_map[suit_map.length + 1] = suit.card_key;
        }
        let card_protos = undefined;
        let _de = undefined;
        if (challenge) {
            _de = challenge.deck;
        }
        if (_de && _de.cards) {
            card_protos = _de.cards;
        }
        if (!card_protos) {
            card_protos = {};
            for (const [k, v] of pairs(G.P_CARDS)) {
                let [_r, _s] = [SMODS.Ranks[v.value].card_key, SMODS.Suits[v.suit].card_key];
                let [keep, _e, _d, _g] = [true, undefined, undefined, undefined];
                if (type(SMODS.Ranks[v.value].in_pool) === "function" && !SMODS.Ranks[v.value].in_pool({ initial_deck: true, suit: v.suit })) {
                    keep = false;
                }
                if (type(SMODS.Suits[v.suit].in_pool) === "function" && !SMODS.Suits[v.suit].in_pool({ initial_deck: true, rank: v.value })) {
                    keep = false;
                }
                if (_de) {
                    if (_de.yes_ranks && !_de.yes_ranks[_r]) {
                        keep = false;
                    }
                    if (_de.no_ranks && _de.no_ranks[_r]) {
                        keep = false;
                    }
                    if (_de.yes_suits && !_de.yes_suits[_s]) {
                        keep = false;
                    }
                    if (_de.no_suits && _de.no_suits[_s]) {
                        keep = false;
                    }
                    if (_de.enhancement) {
                        _e = _de.enhancement;
                    }
                    if (_de.edition) {
                        _d = _de.edition;
                    }
                    if (_de.seal) {
                        _g = _de.seal;
                    }
                }
                if (keep) {
                    card_protos[card_protos.length + 1] = { s: _s, r: _r, e: _e, d: _d, g: _g };
                }
            }
        }
        for (const [k, v] of ipairs(card_protos)) {
            let _card = Card(0, 0, G.CARD_W * 0.45, G.CARD_H * 0.45, G.P_CARDS[v.s + ("_" + v.r)], G.P_CENTERS[v.e || "c_base"]);
            if (v.d) {
                _card.set_edition({ [v.d]: true }, true, true);
            }
            if (v.g) {
                _card.set_seal(v.g, true, true);
            }
            SUITS[v.s][SUITS[v.s].length + 1] = _card;
        }
        let num_suits = 0;
        for (let j = 1; j <= suit_map.length; j++) {
            if (SUITS[suit_map[j]][1]) {
                num_suits = num_suits + 1;
            }
        }
        for (let j = 1; j <= suit_map.length; j++) {
            if (SUITS[suit_map[j]][1]) {
                table.sort(SUITS[suit_map[j]], function (a, b) {
                    return a.get_nominal() > b.get_nominal();
                });
                let view_deck = CardArea(0, 0, 5.5 * G.CARD_W, (0.42 - (num_suits <= 4 && 0 || num_suits >= 8 && 0.28 || 0.07 * (num_suits - 4))) * G.CARD_H, { card_limit: SUITS[suit_map[j]].length, type: "title_2", view_deck: true, highlight_limit: 0, card_w: G.CARD_W * 0.5, draw_layers: ["card"] });
                table.insert(deck_tables, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.O, config: { object: view_deck } }] });
                for (let i = 1; i <= SUITS[suit_map[j]].length; i++) {
                    if (SUITS[suit_map[j]][i]) {
                        view_deck.emplace(SUITS[suit_map[j]][i]);
                    }
                }
            }
        }
        return { n: G.UIT.ROOT, config: { align: "cm", padding: 0, colour: G.C.BLACK, r: 0.1, minw: 11.4, minh: 4.2 }, nodes: deck_tables };
    }
};
G.UIDEF.run_setup_option = function (type) {
    if (!G.SAVED_GAME) {
        G.SAVED_GAME = get_compressed(G.SETTINGS.profile + ("/" + "save.jkr"));
        if (G.SAVED_GAME !== undefined) {
            G.SAVED_GAME = STR_UNPACK(G.SAVED_GAME);
        }
    }
    G.SETTINGS.current_setup = type;
    G.GAME.viewed_back = Back(get_deck_from_name(G.PROFILES[G.SETTINGS.profile].MEMORY.deck));
    G.PROFILES[G.SETTINGS.profile].MEMORY.stake = G.PROFILES[G.SETTINGS.profile].MEMORY.stake || 1;
    if (type === "Continue") {
        G.viewed_stake = 1;
        if (G.SAVED_GAME !== undefined) {
            saved_game = G.SAVED_GAME;
            let viewed_deck = "b_red";
            for (const [k, v] of pairs(G.P_CENTERS)) {
                if (v.name === saved_game.BACK.name) {
                    viewed_deck = k;
                }
            }
            G.GAME.viewed_back.change_to(G.P_CENTERS[viewed_deck]);
            G.viewed_stake = saved_game.GAME.stake || 1;
        }
    }
    if (type === "New Run") {
        if (G.OVERLAY_MENU) {
            let seed_toggle = G.OVERLAY_MENU.get_UIE_by_ID("run_setup_seed");
            if (seed_toggle) {
                seed_toggle.states.visible = true;
            }
        }
        G.viewed_stake = G.PROFILES[G.SETTINGS.profile].MEMORY.stake || 1;
        G.FUNCS.change_stake({ to_key: G.viewed_stake });
    }
    else {
        G.run_setup_seed = undefined;
        if (G.OVERLAY_MENU) {
            let seed_toggle = G.OVERLAY_MENU.get_UIE_by_ID("run_setup_seed");
            if (seed_toggle) {
                seed_toggle.states.visible = false;
            }
        }
    }
    let area = CardArea(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, G.CARD_W, G.CARD_H, { card_limit: 5, type: "deck", highlight_limit: 0, deck_height: 0.75, thin_draw: 1 });
    for (let i = 1; i <= 10; i++) {
        let card = Card(G.ROOM.T.x + 0.2 * G.ROOM.T.w / 2, G.ROOM.T.h, G.CARD_W, G.CARD_H, pseudorandom_element(G.P_CARDS), G.P_CENTERS.c_base, { playing_card: i, viewed_back: true });
        card.sprite_facing = "back";
        card.facing = "back";
        area.emplace(card);
        if (i === 10) {
            G.sticker_card = card;
            card.sticker = get_deck_win_sticker(G.GAME.viewed_back.effect.center);
        }
    }
    let [ordered_names, viewed_deck] = [{}, 1];
    for (const [k, v] of ipairs(G.P_CENTER_POOLS.Back)) {
        ordered_names[ordered_names.length + 1] = v.name;
        if (v.name === G.GAME.viewed_back.name) {
            viewed_deck = k;
        }
    }
    let [lwidth, rwidth] = [1.4, 1.8];
    let type_colour = G.C.BLUE;
    let scale = 0.39;
    G.setup_seed = "";
    let t = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, minh: 6.6, minw: 6 }, nodes: [type === "Continue" && { n: G.UIT.R, config: { align: "tm", minh: 3.8, padding: 0.15 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 3.3, minw: 6.8 }, nodes: [{ n: G.UIT.C, config: { align: "cm", colour: G.C.BLACK, padding: 0.15, r: 0.1, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", shadow: false }, nodes: [{ n: G.UIT.O, config: { object: area } }] }] }, { n: G.UIT.C, config: { align: "cm", minw: 4, maxw: 4, minh: 1.7, r: 0.1, colour: G.C.L_BLACK, padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, minw: 4, maxw: 4, minh: 0.6 }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "RUN_SETUP_check_back_name", object: Moveable() } }] }, { n: G.UIT.R, config: { align: "cm", colour: G.C.WHITE, padding: 0.03, minh: 1.75, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: lwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("k_round"), colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: ": ", colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cl", minw: rwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: tostring(saved_game.GAME.round), colour: G.C.RED, scale: 0.8 * scale } }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: lwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("k_ante"), colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: ": ", colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cl", minw: rwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: tostring(saved_game.GAME.round_resets.ante), colour: G.C.BLUE, scale: 0.8 * scale } }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: lwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("k_money"), colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: ": ", colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cl", minw: rwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("$") + format_ui_value(saved_game.GAME.dollars), colour: G.C.ORANGE, scale: 0.8 * scale } }] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: lwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("k_best_hand"), colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: ": ", colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cl", minw: rwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: number_format(saved_game.GAME.round_scores.hand.amt), colour: G.C.RED, scale: scale_number(saved_game.GAME.round_scores.hand.amt, 0.8 * scale, 100000000000) } }] }] }, saved_game.GAME.seeded && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: lwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: localize("k_seed"), colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: ": ", colour: G.C.UI.TEXT_DARK, scale: scale * 0.8 } }] }, { n: G.UIT.C, config: { align: "cl", minw: rwidth, maxw: lwidth }, nodes: [{ n: G.UIT.T, config: { text: tostring(saved_game.GAME.pseudorandom.seed), colour: G.C.RED, scale: 0.8 * scale } }] }] } || undefined] }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { id: G.GAME.viewed_back.name, func: "RUN_SETUP_check_back_stake_column", object: new UIBox({ definition: G.UIDEF.deck_stake_column(G.GAME.viewed_back.effect.center.key), config: { offset: { x: 0, y: 0 } } }) } }] }] }] }] } || { n: G.UIT.R, config: { align: "cm", minh: 3.8 }, nodes: [create_option_cycle({ options: ordered_names, opt_callback: "change_viewed_back", current_option: viewed_deck, colour: G.C.RED, w: 3.5, mid: { n: G.UIT.R, config: { align: "cm", minh: 3.3, minw: 5 }, nodes: [{ n: G.UIT.C, config: { align: "cm", colour: G.C.BLACK, padding: 0.15, r: 0.1, emboss: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", shadow: false }, nodes: [{ n: G.UIT.O, config: { object: area } }] }] }, { n: G.UIT.C, config: { align: "cm", minh: 1.7, r: 0.1, colour: G.C.L_BLACK, padding: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, minw: 4, maxw: 4, minh: 0.6 }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "RUN_SETUP_check_back_name", object: Moveable() } }] }, { n: G.UIT.R, config: { align: "cm", colour: G.C.WHITE, minh: 1.7, r: 0.1 }, nodes: [{ n: G.UIT.O, config: { id: G.GAME.viewed_back.name, func: "RUN_SETUP_check_back", object: new UIBox({ definition: G.GAME.viewed_back.generate_UI(), config: { offset: { x: 0, y: 0 } } }) } }] }] }, { n: G.UIT.C, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { id: G.GAME.viewed_back.name, func: "RUN_SETUP_check_back_stake_column", object: new UIBox({ definition: G.UIDEF.deck_stake_column(G.GAME.viewed_back.effect.center.key), config: { offset: { x: 0, y: 0 } } }) } }] }] }] } })] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [type === "Continue" && { n: G.UIT.R, config: { align: "cm", minh: 2.2, minw: 5 }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 0.17 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "RUN_SETUP_check_stake", insta_func: true, object: Moveable() } }] }] } || { n: G.UIT.R, config: { align: "cm", minh: 2.2, minw: 6.8 }, nodes: [{ n: G.UIT.O, config: { id: undefined, func: "RUN_SETUP_check_stake", insta_func: true, object: Moveable() } }] }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.05, minh: 0.9 }, nodes: [{ n: G.UIT.O, config: { align: "cm", func: "toggle_seeded_run", object: Moveable() }, nodes: {} }] }, { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 2.4, id: "run_setup_seed" }, nodes: [type === "New Run" && create_toggle({ col: true, label: localize("k_seeded_run"), label_scale: 0.25, w: 0, scale: 0.7, ref_table: G, ref_value: "run_setup_seed" }) || undefined] }, { n: G.UIT.C, config: { align: "cm", minw: 5, minh: 0.8, padding: 0.2, r: 0.1, hover: true, colour: G.C.BLUE, button: "start_setup_run", shadow: true, func: "can_start_run" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: localize("b_play_cap"), scale: 0.8, colour: G.C.UI.TEXT_LIGHT, func: "set_button_pip", focus_args: { button: "x", set_button_pip: true } } }] }] }, { n: G.UIT.C, config: { align: "cm", minw: 2.5 }, nodes: {} }] }] };
    return t;
};
function create_button_binding_pip(args): void {
    let button_sprite_map = { ["a"]: G.F_SWAP_AB_PIPS && 1 || 0, ["b"]: G.F_SWAP_AB_PIPS && 0 || 1, ["x"]: 2, ["y"]: 3, ["leftshoulder"]: 4, ["rightshoulder"]: 5, ["triggerleft"]: 6, ["triggerright"]: 7, ["start"]: 8, ["back"]: 9, ["dpadup"]: 10, ["dpadright"]: 11, ["dpaddown"]: 12, ["dpadleft"]: 13, ["left"]: 14, ["right"]: 15, ["leftstick"]: 16, ["rightstick"]: 17, ["guide"]: 19 };
    let BUTTON_SPRITE = new Sprite(0, 0, args.scale || 0.45, args.scale || 0.45, G.ASSET_ATLAS["gamepad_ui"], { x: button_sprite_map[args.button], y: G.CONTROLLER.GAMEPAD_CONSOLE === "Nintendo" && 2 || G.CONTROLLER.GAMEPAD_CONSOLE === "Playstation" && (G.F_PS4_PLAYSTATION_GLYPHS && 3 || 1) || 0 });
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.O, config: { object: BUTTON_SPRITE } }] };
}
function create_UIBox_profile_button(): void {
    let letters = {};
    if (G.F_DISP_USERNAME) {
        for (const [_, c] of utf8.chars(G.F_DISP_USERNAME)) {
            let _char = c;
            let leng = G.LANGUAGES["all1"].font.FONT.hasGlyphs(c);
            letters[letters.length + 1] = { n: G.UIT.T, config: { lang: G.LANGUAGES[leng && "all1" || "all2"], text: _char, scale: 0.3, colour: mix_colours(G.C.GREEN, G.C.WHITE, 0.7), shadow: true } };
        }
    }
    if (!G.PROFILES[G.SETTINGS.profile].name) {
        G.PROFILES[G.SETTINGS.profile].name = "P" + G.SETTINGS.profile;
    }
    return { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.2, r: 0.1, emboss: 0.1, colour: G.C.L_BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("k_profile"), scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.15, minw: 2, minh: 0.8, maxw: 2, r: 0.1, hover: true, colour: mix_colours(G.C.WHITE, G.C.GREY, 0.2), button: "profile_select", shadow: true }, nodes: [{ n: G.UIT.T, config: { ref_table: G.PROFILES[G.SETTINGS.profile], ref_value: "name", scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] }] }, G.F_DISP_USERNAME && { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: localize("k_playing_as"), scale: 0.3, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", minh: 0.12 }, nodes: {} }, { n: G.UIT.R, config: { align: "cm", maxw: 2 }, nodes: letters }] } || undefined] };
}
function create_UIBox_main_menu_buttons(): void {
    let text_scale = 0.45;
    let language = undefined;
    if (!G.F_ENGLISH_ONLY) {
        language = new Sprite(0, 0, 0.6, 0.6, G.ASSET_ATLAS["icons"], { x: 2, y: 0 });
        language.states.drag.can = false;
    }
    let discord = undefined;
    let twitter = undefined;
    if (G.F_DISCORD) {
        discord = new Sprite(0, 0, 0.6, 0.6, G.ASSET_ATLAS["icons"], { x: 0, y: 0 });
        discord.states.drag.can = false;
        twitter = new Sprite(0, 0, 0.6, 0.6, G.ASSET_ATLAS["icons"], { x: 0, y: 1 });
        twitter.states.drag.can = false;
    }
    let quit_func = "quit";
    let t = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "bm" }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.2, r: 0.1, emboss: 0.1, colour: G.C.L_BLACK, mid: true }, nodes: [UIBox_button({ id: "main_menu_play", button: !G.SETTINGS.tutorial_complete && "start_run" || "setup_run", colour: G.C.BLUE, minw: 3.65, minh: 1.55, label: [localize("b_play_cap")], scale: text_scale * 2, col: true }), { n: G.UIT.C, config: { align: "cm" }, nodes: [UIBox_button({ button: "options", colour: G.C.ORANGE, minw: 2.65, minh: 1.35, label: [localize("b_options_cap")], scale: text_scale * 1.2, col: true }), G.F_QUIT_BUTTON && { n: G.UIT.C, config: { align: "cm", minw: 0.2 }, nodes: {} } || undefined, G.F_QUIT_BUTTON && UIBox_button({ button: quit_func, colour: G.C.RED, minw: 2.65, minh: 1.35, label: [localize("b_quit_cap")], scale: text_scale * 1.2, col: true }) || undefined] }, UIBox_button({ id: "collection_button", button: "your_collection", colour: G.C.PALE_GREEN, minw: 3.65, minh: 1.55, label: [localize("b_collection_cap")], scale: text_scale * 1.5, col: true })] }] }, { n: G.UIT.C, config: { align: "br", minw: 3.2, padding: 0.1 }, nodes: [G.F_DISCORD && { n: G.UIT.R, config: { align: "cm", padding: 0.2 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1, r: 0.1, hover: true, colour: mix_colours(G.C.BLUE, G.C.GREY, 0.4), button: "go_to_discord", shadow: true }, nodes: [{ n: G.UIT.O, config: { object: discord } }] }, { n: G.UIT.C, config: { align: "cm", padding: 0.1, r: 0.1, hover: true, colour: G.C.BLACK, button: "go_to_twitter", shadow: true }, nodes: [{ n: G.UIT.O, config: { object: twitter } }] }] } || undefined, !G.F_ENGLISH_ONLY && { n: G.UIT.R, config: { align: "cm", padding: 0.2, r: 0.1, emboss: 0.1, colour: G.C.L_BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.15, minw: 1, r: 0.1, hover: true, colour: mix_colours(G.C.WHITE, G.C.GREY, 0.2), button: "language_selection", shadow: true }, nodes: [{ n: G.UIT.O, config: { object: language } }, { n: G.UIT.T, config: { text: G.LANG.label, scale: 0.4, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] } || undefined] }] };
    return t;
}
function create_UIBox_main_menu_competittion_name(): void {
    G.SETTINGS.COMP.name = "";
    let t = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.2, r: 0.1, emboss: 0.1, colour: G.C.L_BLACK, mid: true }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [create_text_input({ w: 4, max_length: 16, prompt_text: "Enter Name", ref_table: G.SETTINGS.COMP, ref_value: "name" })] }, UIBox_button({ button: "confirm_contest_name", colour: G.C.PALE_GREEN, minw: 2.65, minh: 1, label: ["Confirm"], scale: 0.5 })] }] };
    return t;
}
G.UIDEF.language_selector = function () {
    let rows = {};
    let langs = {};
    for (const [k, v] of pairs(G.LANGUAGES)) {
        if (!v.omit) {
            langs[langs.length + 1] = v;
        }
    }
    table.sort(langs, function (a, b) {
        return a.label < b.label;
    });
    let _row = {};
    for (const [k, v] of ipairs(langs)) {
        if (!G.F_HIDE_BETA_LANGS || !v.beta) {
            _row[_row.length + 1] = { n: G.UIT.C, config: { align: "cm", func: "beta_lang_alert", padding: 0.05, r: 0.1, minh: 0.7, minw: 4.5, button: v.beta && "warn_lang" || "change_lang", ref_table: v, colour: v.beta && G.C.RED || G.C.BLUE, hover: true, shadow: true, focus_args: { snap_to: k === 1 } }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: v.label, lang: v, scale: 0.45, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] };
        }
        if (_row[3] || k === langs.length) {
            rows[rows.length + 1] = { n: G.UIT.R, config: { align: "cm", padding: 0.1 }, nodes: _row };
            _row = {};
        }
    }
    let discord = undefined;
    discord = new Sprite(0, 0, 0.6, 0.6, G.ASSET_ATLAS["icons"], { x: 2, y: 0 });
    discord.states.drag.can = false;
    let t = create_UIBox_generic_options({ contents: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: rows }, G.F_EXTERNAL_LINKS && { n: G.UIT.R, config: { align: "cm", padding: 0.05 }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: 0.1, minw: 4, maxw: 4, r: 0.1, minh: 0.8, hover: true, colour: mix_colours(G.C.GREEN, G.C.GREY, 0.4), button: "loc_survey", shadow: true }, nodes: [{ n: G.UIT.O, config: { object: discord } }, { n: G.UIT.T, config: { text: G.LANG.button, scale: 0.45, colour: G.C.UI.TEXT_LIGHT, shadow: true } }] }] } || undefined] });
    return t;
};
function create_UIBox_highlight(rect): void {
    let t = { n: G.UIT.ROOT, config: { align: "cm", minh: rect.T.h + 0.1, minw: rect.T.w + 0.15, r: 0.15, colour: G.C.DARK_EDITION }, nodes: {} };
    return t;
}
function create_UIBox_generic_options(args): void {
    args = args || {};
    let back_func = args.back_func || "exit_overlay_menu";
    let contents = args.contents || { n: G.UIT.T, config: { text: "EMPTY", colour: G.C.UI.RED, scale: 0.4 } };
    if (args.infotip) {
        G.E_MANAGER.add_event(new GameEvent({ blocking: false, blockable: false, timer: "REAL", func: function () {
                if (G.OVERLAY_MENU) {
                    let _infotip_object = G.OVERLAY_MENU.get_UIE_by_ID("overlay_menu_infotip");
                    if (_infotip_object) {
                        _infotip_object.config.object.remove();
                        _infotip_object.config.object = new UIBox({ definition: overlay_infotip(args.infotip), config: { offset: { x: 0, y: 0 }, align: "bm", parent: _infotip_object } });
                    }
                }
                return true;
            } }));
    }
    return { n: G.UIT.ROOT, config: { align: "cm", minw: G.ROOM.T.w * 5, minh: G.ROOM.T.h * 5, padding: 0.1, r: 0.1, colour: args.bg_colour || [G.C.GREY[1], G.C.GREY[2], G.C.GREY[3], 0.7] }, nodes: [{ n: G.UIT.R, config: { align: "cm", minh: 1, r: 0.3, padding: 0.07, minw: 1, colour: args.outline_colour || G.C.JOKER_GREY, emboss: 0.1 }, nodes: [{ n: G.UIT.C, config: { align: "cm", minh: 1, r: 0.2, padding: 0.2, minw: 1, colour: args.colour || G.C.L_BLACK }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: args.padding || 0.2, minw: args.minw || 7 }, nodes: contents }, !args.no_back && { n: G.UIT.R, config: { id: args.back_id || "overlay_menu_back_button", align: "cm", minw: 2.5, button_delay: args.back_delay, padding: 0.1, r: 0.1, hover: true, colour: args.back_colour || G.C.ORANGE, button: back_func, shadow: true, focus_args: { nav: "wide", button: "b", snap_to: args.snap_back } }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0, no_fill: true }, nodes: [{ n: G.UIT.T, config: { id: args.back_id || undefined, text: args.back_label || localize("b_back"), scale: 0.5, colour: G.C.UI.TEXT_LIGHT, shadow: true, func: !args.no_pip && "set_button_pip" || undefined, focus_args: !args.no_pip && { button: args.back_button || "b" } || undefined } }] }] } || undefined] }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { id: "overlay_menu_infotip", object: Moveable() } }] }] };
}
function UIBox_dyn_container(inner_table, horizontal, colour_override, background_override, flipped, padding): void {
    return { n: G.UIT.R, config: { align: "cm", padding: 0.03, colour: G.C.UI.TRANSPARENT_DARK, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, colour: colour_override || G.C.DYN_UI.MAIN, r: 0.1 }, nodes: [{ n: G.UIT.R, config: { align: horizontal && "cl" || (flipped && "bm" || "tm"), colour: background_override || G.C.DYN_UI.BOSS_DARK, minw: horizontal && 100 || 0, minh: horizontal && 0 || 30, r: 0.1, padding: padding || 0.08 }, nodes: inner_table }] }] };
}
function simple_text_container(_loc, args): void {
    if (!_loc) {
        return undefined;
    }
    args = args || {};
    let container = {};
    let loc_result = localize(_loc);
    if (loc_result && type(loc_result) === "table") {
        for (const [k, v] of ipairs(loc_result)) {
            container[container.length + 1] = { n: G.UIT.R, config: { align: "cm", padding: 0 }, nodes: [{ n: G.UIT.T, config: { text: v, scale: args.scale || 0.35, colour: args.colour || G.C.UI.TEXT_DARK, shadow: args.shadow } }] };
        }
        return { n: args.col && G.UIT.C || G.UIT.R, config: { align: "cm", padding: args.padding || 0.03 }, nodes: container };
    }
}
function UIBox_button(args): void {
    args = args || {};
    args.button = args.button || "exit_overlay_menu";
    args.func = args.func || undefined;
    args.colour = args.colour || G.C.RED;
    args.choice = args.choice || undefined;
    args.chosen = args.chosen || undefined;
    args.label = args.label || ["LABEL"];
    args.minw = args.minw || 2.7;
    args.maxw = args.maxw || args.minw - 0.2;
    if (args.minw < args.maxw) {
        args.maxw = args.minw - 0.2;
    }
    args.minh = args.minh || 0.9;
    args.scale = args.scale || 0.5;
    args.focus_args = args.focus_args || undefined;
    args.text_colour = args.text_colour || G.C.UI.TEXT_LIGHT;
    let but_UIT = args.col === true && G.UIT.C || G.UIT.R;
    let but_UI_label = {};
    let button_pip = undefined;
    for (const [k, v] of ipairs(args.label)) {
        if (k === args.label.length && args.focus_args && args.focus_args.set_button_pip) {
            button_pip = "set_button_pip";
        }
        table.insert(but_UI_label, { n: G.UIT.R, config: { align: "cm", padding: 0, minw: args.minw, maxw: args.maxw }, nodes: [{ n: G.UIT.T, config: { text: v, scale: args.scale, colour: args.text_colour, shadow: args.shadow, focus_args: button_pip && args.focus_args || undefined, func: button_pip, ref_table: args.ref_table } }] });
    }
    if (args.count) {
        table.insert(but_UI_label, { n: G.UIT.R, config: { align: "cm", minh: 0.4 }, nodes: [{ n: G.UIT.T, config: { scale: 0.35, text: args.count.tally + (" / " + args.count.of), colour: [1, 1, 1, 0.9] } }] });
    }
    return { n: but_UIT, config: { align: "cm" }, nodes: [{ n: G.UIT.C, config: { align: "cm", padding: args.padding || 0, r: 0.1, hover: true, colour: args.colour, one_press: args.one_press, button: args.button !== "nil" && args.button || undefined, choice: args.choice, chosen: args.chosen, focus_args: args.focus_args, minh: args.minh - 0.3 * (args.count && 1 || 0), shadow: true, func: args.func, id: args.id, back_func: args.back_func, ref_table: args.ref_table, mid: args.mid }, nodes: but_UI_label }] };
}