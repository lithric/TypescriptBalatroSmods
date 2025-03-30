
G.FUNCS.tut_next = function (e) {
    if (G.OVERLAY_TUTORIAL) {
        G.OVERLAY_TUTORIAL.Jimbo.remove_button();
        G.OVERLAY_TUTORIAL.Jimbo.remove_speech_bubble();
        G.OVERLAY_TUTORIAL.step_complete = false;
        G.OVERLAY_TUTORIAL.step = G.OVERLAY_TUTORIAL.step + 1;
    }
};
G.FUNCS.blueprint_compat = function (e) {
    if (e.config.ref_table.ability.blueprint_compat !== e.config.ref_table.ability.blueprint_compat_check) {
        if (e.config.ref_table.ability.blueprint_compat === "compatible") {
            e.config.colour = mix_colours(G.C.GREEN, G.C.JOKER_GREY, 0.8);
        }
        else if (e.config.ref_table.ability.blueprint_compat === "incompatible") {
            e.config.colour = mix_colours(G.C.RED, G.C.JOKER_GREY, 0.8);
        }
        e.config.ref_table.ability.blueprint_compat_ui = " " + (localize("k_" + e.config.ref_table.ability.blueprint_compat) + " ");
        e.config.ref_table.ability.blueprint_compat_check = e.config.ref_table.ability.blueprint_compat;
    }
};
G.FUNCS.sort_hand_suit = function (e) {
    G.hand.sort("suit desc");
    play_sound("paper1");
};
G.FUNCS.sort_hand_value = function (e) {
    G.hand.sort("desc");
    play_sound("paper1");
};
G.FUNCS.can_buy = function (e) {
    if (e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at && e.config.ref_table.cost > 0) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.ORANGE;
        e.config.button = "buy_from_shop";
    }
    if (e.config.ref_parent && e.config.ref_parent.children.buy_and_use) {
        if (e.config.ref_parent.children.buy_and_use.states.visible) {
            e.UIBox.alignment.offset.y = -0.6;
        }
        else {
            e.UIBox.alignment.offset.y = 0;
        }
    }
};
G.FUNCS.can_buy_and_use = function (e) {
    if (e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at && e.config.ref_table.cost > 0 || !e.config.ref_table.can_use_consumeable()) {
        e.UIBox.states.visible = false;
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        if (e.config.ref_table.highlighted) {
            e.UIBox.states.visible = true;
        }
        e.config.colour = G.C.SECONDARY_SET.Voucher;
        e.config.button = "buy_from_shop";
    }
};
G.FUNCS.can_redeem = function (e) {
    if (e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.GREEN;
        e.config.button = "use_card";
    }
};
G.FUNCS.can_open = function (e) {
    if (e.config.ref_table.cost > 0 && e.config.ref_table.cost > G.GAME.dollars - G.GAME.bankrupt_at) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.GREEN;
        e.config.button = "use_card";
    }
};
G.FUNCS.HUD_blind_visible = function (e) {
    if (G.GAME.blind && (G.GAME.blind.name !== "" && G.GAME.blind.blind_set)) {
        G.GAME.blind.states.visible = true;
    }
    else if (G.GAME.blind) {
        G.GAME.blind.states.visible = false;
    }
};
G.FUNCS.HUD_blind_debuff = function (e) {
    if (G.GAME.blind && G.GAME.blind.loc_debuff_text && G.GAME.blind.loc_debuff_text !== "") {
        if (e.parent.config.minh === 0 || e.config.prev_loc !== G.GAME.blind.loc_debuff_text) {
            e.parent.config.minh = 0.35;
            e.config.scale = 0.36;
            if (G.GAME.blind.loc_debuff_lines[e.config.ref_value] === "") {
                e.config.scale = 0;
                e.parent.config.minh = 0.001;
            }
            e.config.prev_loc = G.GAME.blind.loc_debuff_text;
            e.UIBox.recalculate(true);
        }
    }
    else {
        if (e.parent.config.minh > 0) {
            e.parent.config.minh = 0;
            e.config.scale = 0;
            e.UIBox.recalculate(true);
        }
    }
};
G.FUNCS.HUD_blind_debuff_prefix = function (e) {
    if (G.GAME.blind && G.GAME.blind.name === "The Wheel" && !G.GAME.blind.disabled || e.config.id === "bl_wheel") {
        e.config.ref_table.val = "" + G.GAME.probabilities.normal;
        e.config.scale = 0.32;
    }
    else {
        e.config.ref_table.val = "";
        e.config.scale = 0;
    }
};
G.FUNCS.HUD_blind_reward = function (e) {
    if (G.GAME.modifiers.no_blind_reward && (G.GAME.blind && G.GAME.modifiers.no_blind_reward[G.GAME.blind.get_type()])) {
        if (e.config.minh > 0.44) {
            e.config.minh = 0.4;
            e.children[1].config.text = localize("k_no_reward");
            e.UIBox.recalculate(true);
        }
    }
    else {
        if (e.config.minh < 0.45) {
            e.config.minh = 0.45;
            e.children[1].config.text = localize("k_reward") + ": ";
            e.children[2].states.visible = true;
            e.UIBox.recalculate(true);
        }
    }
};
G.FUNCS.can_continue = function (e) {
    if (e.config.func) {
        let _can_continue = undefined;
        let savefile = love.filesystem.getInfo(G.SETTINGS.profile + ("/" + "save.jkr"));
        if (savefile === undefined) {
            e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
            e.config.button = undefined;
        }
        else {
            if (!G.SAVED_GAME) {
                G.SAVED_GAME = get_compressed(G.SETTINGS.profile + ("/" + "save.jkr"));
                if (G.SAVED_GAME !== undefined) {
                    G.SAVED_GAME = STR_UNPACK(G.SAVED_GAME);
                }
                if (G.SAVED_GAME === undefined) {
                    e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
                    e.config.button = undefined;
                    return _can_continue;
                }
            }
            if (!G.SAVED_GAME.VERSION || G.SAVED_GAME.VERSION < "0.9.2") {
                e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
                e.config.button = undefined;
            }
            else {
                _can_continue = true;
            }
        }
        e.config.func = undefined;
        return _can_continue;
    }
};
G.FUNCS.can_load_profile = function (e) {
    if (G.SETTINGS.profile === G.focused_profile) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.BLUE;
        e.config.button = "load_profile";
    }
};
G.FUNCS.load_profile = function (delete_prof_data) {
    G.SAVED_GAME = undefined;
    G.E_MANAGER.clear_queue();
    G.FUNCS.wipe_on();
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, func: function () {
            G.delete_run();
            let _name = undefined;
            if (G.PROFILES[G.focused_profile].name && G.PROFILES[G.focused_profile].name !== "") {
                _name = G.PROFILES[G.focused_profile].name;
            }
            if (delete_prof_data) {
                G.PROFILES[G.focused_profile] = {};
            }
            G.DISCOVER_TALLIES = undefined;
            G.PROGRESS = undefined;
            G.load_profile(G.focused_profile);
            G.PROFILES[G.focused_profile].name = _name;
            G.init_item_prototypes();
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, blockable: true, blocking: false, func: function () {
            G.main_menu();
            G.FILE_HANDLER.force = true;
            return true;
        } }));
    G.FUNCS.wipe_off();
};
G.FUNCS.can_delete_profile = function (e) {
    G.CHECK_PROFILE_DATA = G.CHECK_PROFILE_DATA || love.filesystem.getInfo(G.focused_profile + ("/" + "profile.jkr"));
    if (!G.CHECK_PROFILE_DATA || e.config.disable_button) {
        G.CHECK_PROFILE_DATA = false;
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.RED;
        e.config.button = "delete_profile";
    }
};
G.FUNCS.delete_profile = function (e) {
    let warning_text = e.UIBox.get_UIE_by_ID("warning_text");
    if (warning_text.config.colour !== G.C.WHITE) {
        warning_text.juice_up();
        warning_text.config.colour = G.C.WHITE;
        warning_text.config.shadow = true;
        e.config.disable_button = true;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06, blockable: false, blocking: false, func: function () {
                play_sound("tarot2", 0.76, 0.4);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.35, blockable: false, blocking: false, func: function () {
                e.config.disable_button = undefined;
                return true;
            } }));
        play_sound("tarot2", 1, 0.4);
    }
    else {
        love.filesystem.remove(G.focused_profile + ("/" + "profile.jkr"));
        love.filesystem.remove(G.focused_profile + ("/" + "save.jkr"));
        love.filesystem.remove(G.focused_profile + ("/" + "meta.jkr"));
        love.filesystem.remove(G.focused_profile + ("/" + "unlock_notify.jkr"));
        love.filesystem.remove(G.focused_profile + "");
        G.SAVED_GAME = undefined;
        G.DISCOVER_TALLIES = undefined;
        G.PROGRESS = undefined;
        G.PROFILES[G.focused_profile] = {};
        if (G.focused_profile === G.SETTINGS.profile) {
            G.FUNCS.load_profile(true);
        }
        else {
            let tab_but = G.OVERLAY_MENU.get_UIE_by_ID("tab_but_" + G.focused_profile);
            G.FUNCS.change_tab(tab_but);
        }
    }
};
G.FUNCS.can_unlock_all = function (e) {
    if (G.PROFILES[G.SETTINGS.profile].all_unlocked || e.config.disable_button) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.GREY;
        e.config.button = "unlock_all";
    }
};
G.FUNCS.unlock_all = function (e) {
    let _infotip_object = G.OVERLAY_MENU.get_UIE_by_ID("overlay_menu_infotip");
    if (!_infotip_object.config.set && !G.F_NO_ACHIEVEMENTS) {
        _infotip_object.config.object.remove();
        _infotip_object.config.object = new UIBox({ definition: overlay_infotip(localize(G.F_TROPHIES && "ml_unlock_all_trophies" || "ml_unlock_all_explanation")), config: { offset: { x: 0, y: 0 }, align: "bm", parent: _infotip_object } });
        _infotip_object.config.object.UIRoot.juice_up();
        _infotip_object.config.set = true;
        e.config.disable_button = true;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06, blockable: false, blocking: false, func: function () {
                play_sound("tarot2", 0.76, 0.4);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.35, blockable: false, blocking: false, func: function () {
                e.config.disable_button = undefined;
                return true;
            } }));
        play_sound("tarot2", 1, 0.4);
    }
    else {
        G.PROFILES[G.SETTINGS.profile].all_unlocked = true;
        for (const [k, v] of pairs(G.P_CENTERS)) {
            if (!v.demo && !v.wip) {
                v.alerted = true;
                v.discovered = true;
                v.unlocked = true;
            }
        }
        for (const [k, v] of pairs(G.P_BLINDS)) {
            if (!v.demo && !v.wip) {
                v.alerted = true;
                v.discovered = true;
                v.unlocked = true;
            }
        }
        for (const [k, v] of pairs(G.P_TAGS)) {
            if (!v.demo && !v.wip) {
                v.alerted = true;
                v.discovered = true;
                v.unlocked = true;
            }
        }
        set_profile_progress();
        set_discover_tallies();
        G.save_progress();
        G.FILE_HANDLER.force = true;
        let tab_but = G.OVERLAY_MENU.get_UIE_by_ID("tab_but_" + G.focused_profile);
        G.FUNCS.change_tab(tab_but);
    }
};
G.FUNCS.high_score_alert = function (e) {
    if (e.config.id && !e.children.alert) {
        if (G.GAME.round_scores[e.config.id] && G.GAME.round_scores[e.config.id].high_score) {
            e.children.alert = new UIBox({ definition: create_UIBox_card_alert({ no_bg: true, text: localize("k_high_score_ex"), scale: 0.3 }), config: { instance_type: "ALERT", align: "tri", offset: { x: 0.3, y: -0.18 }, major: e, parent: e } });
            e.children.alert.states.collide.can = false;
        }
    }
};
G.FUNCS.beta_lang_alert = function (e) {
    if (!e.children.alert) {
        if (e.config.ref_table && e.config.ref_table.beta) {
            e.children.alert = new UIBox({ definition: create_UIBox_card_alert({ no_bg: true, text: "BETA", scale: 0.35 }), config: { instance_type: "ALERT", align: "tri", offset: { x: 0.07, y: -0.07 }, major: e, parent: e } });
            e.children.alert.states.collide.can = false;
        }
    }
};
G.FUNCS.set_button_pip = function (e) {
    if (G.CONTROLLER.HID.controller && e.config.focus_args && !e.children.button_pip) {
        e.children.button_pip = new UIBox({ definition: create_button_binding_pip({ button: e.config.focus_args.button, scale: e.config.focus_args.scale }), config: { align: e.config.focus_args.orientation || "cr", offset: e.config.focus_args.offset || e.config.focus_args.orientation === "bm" && { x: 0, y: 0.02 } || { x: 0.1, y: 0.02 }, major: e, parent: e } });
        e.children.button_pip.states.collide.can = false;
    }
    if (!G.CONTROLLER.HID.controller && e.children.button_pip) {
        e.children.button_pip.remove();
        e.children.button_pip = undefined;
    }
};
G.FUNCS.flash = function (e) {
    if (G.CONTROLLER.text_input_hook && G.CONTROLLER.text_input_id === e.config.id.sub(1, string.len(G.CONTROLLER.text_input_id))) {
        if (math.floor(G.TIMERS.REAL * 2) % 2 === 1) {
            e.config.colour[4] = 0;
        }
        else {
            e.config.colour[4] = 1;
        }
        if (e.config.w !== 0.1) {
            e.config.w = 0.1;
            e.UIBox.recalculate(true);
        }
    }
    else {
        e.config.colour[4] = 0;
        if (e.config.w !== 0) {
            e.config.w = 0;
            e.UIBox.recalculate(true);
        }
    }
};
G.FUNCS.pip_dynatext = function (e) {
    if ("pip_" + tostring(e.config.ref_table.focused_string) === e.config.id) {
        if (e.config.pip_state !== 1) {
            e.config.colour = e.config.pipcol1;
            e.config.pip_state = 1;
        }
    }
    else if (e.config.pip_state !== 2) {
        e.config.colour = e.config.pipcol2;
        e.config.pip_state = 2;
    }
};
G.FUNCS.toggle_button = function (e) {
    e.config.ref_table.ref_table[e.config.ref_table.ref_value] = !e.config.ref_table.ref_table[e.config.ref_table.ref_value];
    if (e.config.toggle_callback) {
        e.config.toggle_callback(e.config.ref_table.ref_table[e.config.ref_table.ref_value]);
    }
};
G.FUNCS.toggle = function (e) {
    if (!e.config.ref_table.ref_table[e.config.ref_table.ref_value] && e.config.toggle_active) {
        e.config.toggle_active = undefined;
        e.config.colour = e.config.ref_table.inactive_colour;
        e.children[1].states.visible = false;
        e.children[1].config.object.states.visible = false;
    }
    else if (e.config.ref_table.ref_table[e.config.ref_table.ref_value] && !e.config.toggle_active) {
        e.config.toggle_active = true;
        e.config.colour = e.config.ref_table.active_colour;
        e.children[1].states.visible = true;
        e.children[1].config.object.states.visible = true;
    }
};
G.FUNCS.slider = function (e) {
    let c = e.children[1];
    e.states.drag.can = true;
    c.states.drag.can = true;
    if (G.CONTROLLER && G.CONTROLLER.dragging.target && (G.CONTROLLER.dragging.target === e || G.CONTROLLER.dragging.target === c)) {
        let rt = c.config.ref_table;
        rt.ref_table[rt.ref_value] = math.min(rt.max, math.max(rt.min, rt.min + (rt.max - rt.min) * (G.CURSOR.T.x - e.parent.T.x - G.ROOM.T.x) / e.T.w));
        rt.text = string.format("%." + (tostring(rt.decimal_places) + "f"), rt.ref_table[rt.ref_value]);
        c.T.w = (rt.ref_table[rt.ref_value] - rt.min) / (rt.max - rt.min) * rt.w;
        c.config.w = c.T.w;
        if (rt.callback) {
            G.FUNCS[rt.callback](rt);
        }
    }
};
G.FUNCS.slider_descreet = function (e, per) {
    let c = e.children[1];
    e.states.drag.can = true;
    c.states.drag.can = true;
    if (per) {
        let rt = c.config.ref_table;
        rt.ref_table[rt.ref_value] = math.min(rt.max, math.max(rt.min, rt.ref_table[rt.ref_value] + per * (rt.max - rt.min)));
        rt.text = string.format("%." + (tostring(rt.decimal_places) + "f"), rt.ref_table[rt.ref_value]);
        c.T.w = (rt.ref_table[rt.ref_value] - rt.min) / (rt.max - rt.min) * rt.w;
        c.config.w = c.T.w;
    }
};
G.FUNCS.option_cycle = function (e) {
    let from_val = e.config.ref_table.options[e.config.ref_table.current_option];
    let from_key = e.config.ref_table.current_option;
    let old_pip = e.UIBox.get_UIE_by_ID("pip_" + e.config.ref_table.current_option, e.parent.parent);
    let cycle_main = e.UIBox.get_UIE_by_ID("cycle_main", e.parent.parent);
    if (cycle_main && cycle_main.config.h_popup) {
        cycle_main.stop_hover();
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                cycle_main.hover();
                return true;
            } }));
    }
    if (e.config.ref_value === "l") {
        e.config.ref_table.current_option = e.config.ref_table.current_option - 1;
        if (e.config.ref_table.current_option <= 0) {
            e.config.ref_table.current_option = e.config.ref_table.options.length;
        }
    }
    else {
        e.config.ref_table.current_option = e.config.ref_table.current_option + 1;
        if (e.config.ref_table.current_option > e.config.ref_table.options.length) {
            e.config.ref_table.current_option = 1;
        }
    }
    let to_val = e.config.ref_table.options[e.config.ref_table.current_option];
    let to_key = e.config.ref_table.current_option;
    e.config.ref_table.current_option_val = e.config.ref_table.options[e.config.ref_table.current_option];
    let new_pip = e.UIBox.get_UIE_by_ID("pip_" + e.config.ref_table.current_option, e.parent.parent);
    if (old_pip) {
        old_pip.config.colour = G.C.BLACK;
    }
    if (new_pip) {
        new_pip.config.colour = G.C.WHITE;
    }
    if (e.config.ref_table.opt_callback) {
        G.FUNCS[e.config.ref_table.opt_callback]({ from_val: from_val, to_val: to_val, from_key: from_key, to_key: to_key, cycle_config: e.config.ref_table });
    }
};
G.FUNCS.test_framework_cycle_callback = function (args) {
    args = args || {};
    if (args.cycle_config && args.cycle_config.ref_table && args.cycle_config.ref_value) {
        args.cycle_config.ref_table[args.cycle_config.ref_value] = args.to_val;
    }
};
G.FUNCS.your_collection_joker_page = function (args) {
    if (!args || !args.cycle_config) {
        return;
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = G.your_collection[j].cards.length; i <= 1; i += -1) {
            let c = G.your_collection[j].remove_card(G.your_collection[j].cards[i]);
            c.remove();
            c = undefined;
        }
    }
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= G.your_collection.length; j++) {
            let center = G.P_CENTER_POOLS["Joker"][i + (j - 1) * 5 + 5 * G.your_collection.length * (args.cycle_config.current_option - 1)];
            if (!center) {
                break;
            }
            let card = new Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
            card.sticker = get_joker_win_sticker(center);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
};
G.FUNCS.your_collection_tarot_page = function (args) {
    if (!args || !args.cycle_config) {
        return;
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = G.your_collection[j].cards.length; i <= 1; i += -1) {
            let c = G.your_collection[j].remove_card(G.your_collection[j].cards[i]);
            c.remove();
            c = undefined;
        }
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 4 + j; i++) {
            let center = G.P_CENTER_POOLS["Tarot"][i + (j - 1) * 5 + 11 * (args.cycle_config.current_option - 1)];
            if (!center) {
                break;
            }
            let card = new Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
};
G.FUNCS.your_collection_spectral_page = function (args) {
    if (!args || !args.cycle_config) {
        return;
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = G.your_collection[j].cards.length; i <= 1; i += -1) {
            let c = G.your_collection[j].remove_card(G.your_collection[j].cards[i]);
            c.remove();
            c = undefined;
        }
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 3 + j; i++) {
            let center = G.P_CENTER_POOLS["Spectral"][i + (j - 1) * 4 + 9 * (args.cycle_config.current_option - 1)];
            if (!center) {
                break;
            }
            let card = new Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
};
G.FUNCS.your_collection_booster_page = function (args) {
    if (!args || !args.cycle_config) {
        return;
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = G.your_collection[j].cards.length; i <= 1; i += -1) {
            let c = G.your_collection[j].remove_card(G.your_collection[j].cards[i]);
            c.remove();
            c = undefined;
        }
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = 1; i <= 4; i++) {
            let center = G.P_CENTER_POOLS["Booster"][i + (j - 1) * 4 + 8 * (args.cycle_config.current_option - 1)];
            if (!center) {
                break;
            }
            let card = new Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W * 1.27, G.CARD_H * 1.27, undefined, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
};
G.FUNCS.your_collection_voucher_page = function (args) {
    if (!args || !args.cycle_config) {
        return;
    }
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (let i = G.your_collection[j].cards.length; i <= 1; i += -1) {
            let c = G.your_collection[j].remove_card(G.your_collection[j].cards[i]);
            c.remove();
            c = undefined;
        }
    }
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= G.your_collection.length; j++) {
            let center = G.P_CENTER_POOLS["Voucher"][i + (j - 1) * 4 + 8 * (args.cycle_config.current_option - 1)];
            if (!center) {
                break;
            }
            let card = new Card(G.your_collection[j].T.x + G.your_collection[j].T.w / 2, G.your_collection[j].T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
            card.start_materialize(undefined, i > 1 || j > 1);
            G.your_collection[j].emplace(card);
        }
    }
    INIT_COLLECTION_CARD_ALERTS();
};
G.FUNCS.change_selected_back = function (args) {
    G.GAME.selected_back.change_to(G.P_CENTER_POOLS.Back[args.to_key]);
};
G.FUNCS.change_viewed_back = function (args) {
    G.viewed_stake = G.viewed_stake || 1;
    let deck_pool = SMODS.collection_pool(G.P_CENTER_POOLS.Back);
    G.GAME.viewed_back.change_to(deck_pool[args.to_key]);
    if (G.sticker_card) {
        G.sticker_card.sticker = get_deck_win_sticker(G.GAME.viewed_back.effect.center);
    }
    let max_stake = get_deck_win_stake(G.GAME.viewed_back.effect.center.key) || 0;
    G.viewed_stake = math.min(G.viewed_stake, max_stake + 1);
    G.PROFILES[G.SETTINGS.profile].MEMORY.deck = args.to_val;
    for (const [key, val] of pairs(G.sticker_card.area.cards)) {
        val.children.back = false;
        val.set_ability(val.config.center, true);
    }
};
G.FUNCS.change_stake = function (args) {
    G.viewed_stake = args.to_key;
    G.PROFILES[G.SETTINGS.profile].MEMORY.stake = args.to_key;
};
G.FUNCS.change_vsync = function (args) {
    G.SETTINGS.QUEUED_CHANGE.vsync = G.SETTINGS.WINDOW.vsync === 0 && args.to_key === 1 && 1 || G.SETTINGS.WINDOW.vsync === 1 && args.to_key === 2 && 0 || undefined;
};
G.FUNCS.change_screen_resolution = function (args) {
    let curr_disp = G.SETTINGS.WINDOW.selected_display;
    let to_resolution = G.SETTINGS.WINDOW.DISPLAYS[curr_disp].screen_resolutions.values[args.to_key];
    G.SETTINGS.QUEUED_CHANGE.screenres = { w: to_resolution.w, h: to_resolution.h };
};
G.FUNCS.change_screenmode = function (args) {
    G.ARGS.screenmode_vals = G.ARGS.screenmode_vals || ["Windowed", "Fullscreen", "Borderless"];
    G.SETTINGS.QUEUED_CHANGE.screenmode = G.ARGS.screenmode_vals[args.to_key];
    G.FUNCS.change_window_cycle_UI();
};
G.FUNCS.change_display = function (args) {
    G.SETTINGS.QUEUED_CHANGE.selected_display = args.to_key;
    G.FUNCS.change_window_cycle_UI();
};
G.FUNCS.change_window_cycle_UI = function () {
    if (G.OVERLAY_MENU) {
        let swap_node = G.OVERLAY_MENU.get_UIE_by_ID("resolution_cycle");
        if (swap_node) {
            let [focused_display, focused_screenmode] = [G.SETTINGS.QUEUED_CHANGE.selected_display || G.SETTINGS.WINDOW.selected_display, G.SETTINGS.QUEUED_CHANGE.screenmode || G.SETTINGS.WINDOW.screenmode];
            let res_option = GET_DISPLAYINFO(focused_screenmode, focused_display);
            swap_node.children[1].remove();
            swap_node.children[1] = undefined;
            swap_node.UIBox.add_child(create_option_cycle({ w: 4, scale: 0.8, options: G.SETTINGS.WINDOW.DISPLAYS[focused_display].screen_resolutions.strings, opt_callback: "change_screen_resolution", current_option: res_option || 1 }), swap_node);
        }
    }
};
G.FUNCS.change_gamespeed = function (args) {
    G.SETTINGS.GAMESPEED = args.to_val;
};
G.FUNCS.change_play_discard_position = function (args) {
    G.SETTINGS.play_button_pos = args.to_key;
    if (G.buttons) {
        G.buttons.remove();
        G.buttons = new UIBox({ definition: create_UIBox_buttons(), config: { align: "bm", offset: { x: 0, y: 0.3 }, major: G.hand, bond: "Weak" } });
    }
};
G.FUNCS.change_shadows = function (args) {
    G.SETTINGS.GRAPHICS.shadows = args.to_key === 1 && "On" || "Off";
    G.save_settings();
};
G.FUNCS.change_pixel_smoothing = function (args) {
    G.SETTINGS.GRAPHICS.texture_scaling = args.to_key;
    SMODS.injectObjects(SMODS.Atlas);
    G.save_settings();
};
G.FUNCS.change_crt_bloom = function (args) {
    G.SETTINGS.GRAPHICS.bloom = args.to_key;
    G.save_settings();
};
G.FUNCS.change_collab = function (args) {
    G.SETTINGS.CUSTOM_DECK.Collabs[args.cycle_config.curr_suit] = G.COLLABS.options[args.cycle_config.curr_suit][args.to_key] || "default";
    for (const [k, v] of pairs(G.I.CARD)) {
        if (v.config && v.config.card && v.children.front && v.ability.effect !== "Stone Card") {
            v.set_sprites(undefined, v.config.card);
        }
    }
    G.save_settings();
};
G.FUNCS.key_button = function (e) {
    let args = e.config.ref_table;
    if (args.key) {
        G.CONTROLLER.key_press_update(args.key);
    }
};
G.FUNCS.text_input = function (e) {
    let args = e.config.ref_table;
    if (G.CONTROLLER.text_input_hook === e) {
        e.parent.parent.config.colour = args.hooked_colour;
        args.current_prompt_text = "";
        args.current_position_text = args.position_text;
    }
    else {
        e.parent.parent.config.colour = args.colour;
        args.current_prompt_text = args.text.ref_table[args.text.ref_value] === "" && args.prompt_text || "";
        args.current_position_text = "";
    }
    let OSkeyboard_e = e.parent.parent.parent;
    if (G.CONTROLLER.text_input_hook === e && G.CONTROLLER.HID.controller) {
        if (!OSkeyboard_e.children.controller_keyboard) {
            OSkeyboard_e.children.controller_keyboard = new UIBox({ definition: create_keyboard_input({ backspace_key: true, return_key: true, space_key: false }), config: { align: "cm", offset: { x: 0, y: G.CONTROLLER.text_input_hook.config.ref_table.keyboard_offset || -4 }, major: e.UIBox, parent: OSkeyboard_e } });
            G.CONTROLLER.screen_keyboard = OSkeyboard_e.children.controller_keyboard;
            G.CONTROLLER.mod_cursor_context_layer(1);
        }
    }
    else if (OSkeyboard_e.children.controller_keyboard) {
        OSkeyboard_e.children.controller_keyboard.remove();
        OSkeyboard_e.children.controller_keyboard = undefined;
        G.CONTROLLER.screen_keyboard = undefined;
        G.CONTROLLER.mod_cursor_context_layer(-1);
    }
};
G.FUNCS.paste_seed = function (e) {
    G.CONTROLLER.text_input_hook = e.UIBox.get_UIE_by_ID("text_input").children[1].children[1];
    G.CONTROLLER.text_input_id = "text_input";
    for (let i = 1; i <= 8; i++) {
        G.FUNCS.text_input_key({ key: "right" });
    }
    for (let i = 1; i <= 8; i++) {
        G.FUNCS.text_input_key({ key: "backspace" });
    }
    let clipboard = G.F_LOCAL_CLIPBOARD && G.CLIPBOARD || love.system.getClipboardText() || "";
    for (let i = 1; i <= clipboard.length; i++) {
        let c = clipboard.sub(i, i);
        G.FUNCS.text_input_key({ key: c });
    }
    G.FUNCS.text_input_key({ key: "return" });
};
G.FUNCS.select_text_input = function (e) {
    G.CONTROLLER.text_input_hook = e.children[1].children[1];
    G.CONTROLLER.text_input_id = e.config.id;
    TRANSPOSE_TEXT_INPUT(0);
    e.UIBox.recalculate(true);
};
G.FUNCS.text_input_key = function (args) {
    args = args || {};
    if (args.key === "[" || args.key === "]") {
        return;
    }
    if (args.key === "0") {
        args.key = "o";
    }
    let hook_config = G.CONTROLLER.text_input_hook.config.ref_table;
    hook_config.orig_colour = hook_config.orig_colour || copy_table(hook_config.colour);
    args.key = args.key || "%";
    args.caps = args.caps || G.CONTROLLER.capslock || hook_config.all_caps;
    let keymap = { space: " ", backspace: "BACKSPACE", delete: "DELETE", ["return"]: "RETURN", right: "RIGHT", left: "LEFT" };
    let hook = G.CONTROLLER.text_input_hook;
    let corpus = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + (hook.config.ref_table.extended_corpus && " 0!$&()<>?:{}+-=,.[]_" || "");
    if (hook.config.ref_table.extended_corpus) {
        let lower_ext = "1234567890-=;\\',./";
        let upper_ext = "!@#$%^&*()_+:\"<>?";
        if (string.find(lower_ext, args.key) && args.caps) {
            args.key = string.sub(string.sub(upper_ext, string.find(lower_ext, args.key)), 0, 1);
        }
    }
    let text = hook_config.text;
    args.key = keymap[args.key] || (args.caps && string.upper(args.key) || args.key);
    TRANSPOSE_TEXT_INPUT(0);
    if (string.len(text.ref_table[text.ref_value]) > 0 && args.key === "BACKSPACE") {
        MODIFY_TEXT_INPUT({ letter: "", text_table: text, pos: text.current_position, delete: true });
        TRANSPOSE_TEXT_INPUT(-1);
    }
    else if (string.len(text.ref_table[text.ref_value]) > 0 && args.key === "DELETE") {
        MODIFY_TEXT_INPUT({ letter: "", text_table: text, pos: text.current_position + 1, delete: true });
        TRANSPOSE_TEXT_INPUT(0);
    }
    else if (args.key === "RETURN") {
        if (hook.config.ref_table.callback) {
            hook.config.ref_table.callback();
        }
        hook.parent.parent.config.colour = hook_config.colour;
        let temp_colour = copy_table(hook_config.orig_colour);
        hook_config.colour[1] = G.C.WHITE[1];
        hook_config.colour[2] = G.C.WHITE[2];
        hook_config.colour[3] = G.C.WHITE[3];
        ease_colour(hook_config.colour, temp_colour);
        G.CONTROLLER.text_input_hook = undefined;
    }
    else if (args.key === "LEFT") {
        TRANSPOSE_TEXT_INPUT(-1);
    }
    else if (args.key === "RIGHT") {
        TRANSPOSE_TEXT_INPUT(1);
    }
    else if (hook_config.max_length > string.len(text.ref_table[text.ref_value]) && string.len(args.key) === 1 && string.find(corpus, args.key, 1, true)) {
        MODIFY_TEXT_INPUT({ letter: args.key, text_table: text, pos: text.current_position + 1 });
        TRANSPOSE_TEXT_INPUT(1);
    }
};
function GET_TEXT_FROM_INPUT(): void {
    let new_text = "";
    let hook = G.CONTROLLER.text_input_hook;
    for (let i = 1; i <= hook.children.length; i++) {
        if (hook.children[i].config && hook.children[i].config.id.sub(1, 8 + string.len(G.CONTROLLER.text_input_id)) === G.CONTROLLER.text_input_id + "_letter_" && hook.children[i].config.text !== "") {
            new_text = new_text + hook.children[i].config.text;
        }
    }
    return new_text;
}
function MODIFY_TEXT_INPUT(args): void {
    args = args || {};
    if (args.delete && args.pos > 0) {
        if (args.pos >= args.text_table.letters.length) {
            args.text_table.letters[args.pos] = "";
        }
        else {
            args.text_table.letters[args.pos] = args.text_table.letters[args.pos + 1];
            MODIFY_TEXT_INPUT({ letter: args.letter, text_table: args.text_table, pos: args.pos + 1, delete: args.delete });
        }
        return;
    }
    let swapped_letter = args.text_table.letters[args.pos];
    args.text_table.letters[args.pos] = args.letter;
    if (swapped_letter && swapped_letter !== "") {
        MODIFY_TEXT_INPUT({ letter: swapped_letter, text_table: args.text_table, pos: args.pos + 1 });
    }
}
function TRANSPOSE_TEXT_INPUT(amount): void {
    let position_child = undefined;
    let hook = G.CONTROLLER.text_input_hook;
    let text = G.CONTROLLER.text_input_hook.config.ref_table.text;
    for (let i = 1; i <= hook.children.length; i++) {
        if (hook.children[i].config) {
            if (hook.children[i].config.id === G.CONTROLLER.text_input_id + "_position") {
                position_child = i;
                break;
            }
        }
    }
    let dir = amount / math.abs(amount) || 0;
    while (amount !== 0) {
        if (position_child + dir < 1 || position_child + dir >= hook.children.length) {
            break;
        }
        let real_letter = hook.children[position_child + dir].config.id.sub(1, 8 + string.len(G.CONTROLLER.text_input_id)) === G.CONTROLLER.text_input_id + "_letter_" && hook.children[position_child + dir].config.text !== "";
        SWAP(hook.children, position_child, position_child + dir);
        if (real_letter) {
            amount = amount - dir;
        }
        position_child = position_child + dir;
    }
    text.current_position = math.min(position_child - 1, string.len(text.ref_table[text.ref_value]));
    hook.UIBox.recalculate(true);
    text.ref_table[text.ref_value] = GET_TEXT_FROM_INPUT();
}
G.FUNCS.can_apply_window_changes = function (e) {
    let can_apply = false;
    if (G.SETTINGS.QUEUED_CHANGE) {
        if (G.SETTINGS.QUEUED_CHANGE.screenmode && G.SETTINGS.QUEUED_CHANGE.screenmode !== G.SETTINGS.WINDOW.screenmode) {
            can_apply = true;
        }
        else if (G.SETTINGS.QUEUED_CHANGE.screenres) {
            can_apply = true;
        }
        else if (G.SETTINGS.QUEUED_CHANGE.vsync) {
            can_apply = true;
        }
        else if (G.SETTINGS.QUEUED_CHANGE.selected_display && G.SETTINGS.QUEUED_CHANGE.selected_display !== G.SETTINGS.WINDOW.selected_display) {
            can_apply = true;
        }
    }
    if (can_apply) {
        e.config.button = "apply_window_changes";
        e.config.colour = G.C.RED;
    }
    else {
        e.config.button = undefined;
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
    }
};
G.FUNCS.apply_window_changes = function (_initial) {
    G.SETTINGS.WINDOW.screenmode = G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.screenmode || G.SETTINGS.WINDOW.screenmode || "Windowed";
    G.SETTINGS.WINDOW.selected_display = G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.selected_display || G.SETTINGS.WINDOW.selected_display || 1;
    G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display].screen_res = { w: G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.screenres && G.SETTINGS.QUEUED_CHANGE.screenres.w || G.SETTINGS.screen_res && G.SETTINGS.screen_res.w || love.graphics.getWidth(), h: G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.screenres && G.SETTINGS.QUEUED_CHANGE.screenres.h || G.SETTINGS.screen_res && G.SETTINGS.screen_res.h || love.graphics.getHeight() };
    G.SETTINGS.WINDOW.vsync = G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.vsync || G.SETTINGS.WINDOW.vsync || 1;
    love.window.updateMode(G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.screenmode === "Windowed" && love.graphics.getWidth() * 0.8 || G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display].screen_res.w, G.SETTINGS.QUEUED_CHANGE && G.SETTINGS.QUEUED_CHANGE.screenmode === "Windowed" && love.graphics.getHeight() * 0.8 || G.SETTINGS.WINDOW.DISPLAYS[G.SETTINGS.WINDOW.selected_display].screen_res.h, { fullscreen: G.SETTINGS.WINDOW.screenmode !== "Windowed", fullscreentype: G.SETTINGS.WINDOW.screenmode === "Borderless" && "desktop" || G.SETTINGS.WINDOW.screenmode === "Fullscreen" && "exclusive" || undefined, vsync: G.SETTINGS.WINDOW.vsync, resizable: true, display: G.SETTINGS.WINDOW.selected_display, highdpi: love.system.getOS() === "OS X" });
    G.SETTINGS.QUEUED_CHANGE = {};
    if (_initial !== true) {
        love.resize(love.graphics.getWidth(), love.graphics.getHeight());
        G.save_settings();
    }
    if (G.OVERLAY_MENU) {
        let tab_but = G.OVERLAY_MENU.get_UIE_by_ID("tab_but_Video");
        G.FUNCS.change_tab(tab_but);
    }
};
function INIT_COLLECTION_CARD_ALERTS(): void {
    for (let j = 1; j <= G.your_collection.length; j++) {
        for (const [_, v] of ipairs(G.your_collection[j].cards)) {
            v.update_alert();
        }
    }
}
G.FUNCS.RUN_SETUP_check_back = function (e) {
    if (G.GAME.viewed_back.name !== e.config.id) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: G.GAME.viewed_back.generate_UI(), config: { offset: { x: 0, y: 0 }, align: "cm", parent: e } });
        e.config.id = G.GAME.viewed_back.name;
    }
};
G.FUNCS.RUN_SETUP_check_back_name = function (e) {
    if (e.config.object && G.GAME.viewed_back.name !== e.config.id) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.O, config: { id: G.GAME.viewed_back.name, func: "RUN_SETUP_check_back_name", object: DynaText({ string: G.GAME.viewed_back.get_name(), maxw: 4, colours: [G.C.WHITE], shadow: true, bump: true, scale: 0.5, pop_in: 0, silent: true }) } }] }, config: { offset: { x: 0, y: 0 }, align: "cm", parent: e } });
        e.config.id = G.GAME.viewed_back.name;
    }
};
G.FUNCS.RUN_SETUP_check_stake = function (e) {
    if (G.GAME.viewed_back.name !== e.config.id) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: G.UIDEF.stake_option(G.SETTINGS.current_setup), config: { offset: { x: 0, y: 0 }, align: "tmi", parent: e } });
        e.config.id = G.GAME.viewed_back.name;
    }
};
G.FUNCS.RUN_SETUP_check_stake2 = function (e) {
    if (G.viewed_stake !== e.config.id) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: G.UIDEF.viewed_stake_option(), config: { offset: { x: 0, y: 0 }, align: "cm", parent: e } });
        e.config.id = G.viewed_stake;
    }
};
G.FUNCS.change_viewed_collab = function (args) {
    G.viewed_collab = args.to_val;
};
G.FUNCS.CREDITS_check_collab = function (e) {
    if (G.viewed_collab !== e.config.id) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: G.UIDEF.viewed_collab_option(), config: { offset: { x: 0, y: 0 }, align: "cm", parent: e } });
        e.config.id = G.viewed_collab;
    }
};
G.FUNCS.RUN_SETUP_check_back_stake_column = function (e) {
    if (G.GAME.viewed_back.name !== e.config.id) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: G.UIDEF.deck_stake_column(G.GAME.viewed_back.effect.center.key), config: { offset: { x: 0, y: 0 }, align: "cm", parent: e } });
        e.config.id = G.GAME.viewed_back.name;
    }
};
G.FUNCS.RUN_SETUP_check_back_stake_highlight = function (e) {
    if (G.viewed_stake === e.config.id && e.config.outline < 0.1) {
        e.config.outline = 0.8;
    }
    else if (G.viewed_stake !== e.config.id && e.config.outline > 0.1) {
        e.config.outline = 0;
    }
};
G.FUNCS.change_tab = function (e) {
    if (!e) {
        return;
    }
    let _infotip_object = G.OVERLAY_MENU.get_UIE_by_ID("overlay_menu_infotip");
    if (_infotip_object && _infotip_object.config.object) {
        _infotip_object.config.object.remove();
        _infotip_object.config.object = Moveable();
    }
    let tab_contents = e.UIBox.get_UIE_by_ID("tab_contents");
    tab_contents.config.object.remove();
    tab_contents.config.object = new UIBox({ definition: e.config.ref_table.tab_definition_function(e.config.ref_table.tab_definition_function_args), config: { offset: { x: 0, y: 0 }, parent: tab_contents, type: "cm" } });
    tab_contents.UIBox.recalculate();
};
G.FUNCS.overlay_menu = function (args) {
    if (!args) {
        return;
    }
    if (G.OVERLAY_MENU) {
        G.OVERLAY_MENU.remove();
    }
    G.CONTROLLER.locks.frame_set = true;
    G.CONTROLLER.locks.frame = true;
    G.CONTROLLER.cursor_down.target = undefined;
    G.CONTROLLER.mod_cursor_context_layer(G.NO_MOD_CURSOR_STACK && 0 || 1);
    args.config = args.config || {};
    args.config = { align: args.config.align || "cm", offset: args.config.offset || { x: 0, y: 10 }, major: args.config.major || G.ROOM_ATTACH, bond: "Weak", no_esc: args.config.no_esc };
    G.OVERLAY_MENU = true;
    G.OVERLAY_MENU = new UIBox({ definition: args.definition, config: args.config });
    G.OVERLAY_MENU.alignment.offset.y = 0;
    G.ROOM.jiggle = G.ROOM.jiggle + 1;
    G.OVERLAY_MENU.align_to_major();
};
G.FUNCS.exit_overlay_menu = function () {
    if (!G.OVERLAY_MENU) {
        return;
    }
    G.CONTROLLER.locks.frame_set = true;
    G.CONTROLLER.locks.frame = true;
    G.CONTROLLER.mod_cursor_context_layer(-1000);
    G.OVERLAY_MENU.remove();
    G.OVERLAY_MENU = undefined;
    G.VIEWING_DECK = undefined;
    G.SETTINGS.paused = false;
    G.save_settings();
};
G.FUNCS.continue_unlock = function () {
    G.FUNCS.exit_overlay_menu();
    G.CONTROLLER.mod_cursor_context_layer(-2000);
    G.E_MANAGER.update(0, true);
};
G.FUNCS.test_framework = function (options) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_test_framework(options) });
};
G.FUNCS.options = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_options() });
};
G.FUNCS.current_hands = function (e, simple) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_current_hands(simple) });
};
G.FUNCS.run_info = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: G.UIDEF.run_info() });
};
G.FUNCS.deck_info = function (e) {
    G.SETTINGS.paused = true;
    if (G.deck_preview) {
        G.deck_preview.remove();
        G.deck_preview = undefined;
    }
    G.FUNCS.overlay_menu({ definition: G.UIDEF.deck_info(G.STATE === G.STATES.SELECTING_HAND || G.STATE === G.STATES.HAND_PLAYED || G.STATE === G.STATES.DRAW_TO_HAND) });
};
G.FUNCS.settings = function (e, instant) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_settings(), config: { offset: { x: 0, y: instant && 0 || 10 } } });
};
G.FUNCS.show_credits = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: G.UIDEF.credits() });
};
G.FUNCS.language_selection = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: G.UIDEF.language_selector() });
};
G.FUNCS.your_collection = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection() });
};
G.FUNCS.your_collection_blinds = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_blinds() });
};
G.FUNCS.your_collection_jokers = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_jokers() });
};
G.FUNCS.your_collection_tarots = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_tarots() });
};
G.FUNCS.your_collection_planets = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_planets() });
};
G.FUNCS.your_collection_spectrals = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_spectrals() });
};
G.FUNCS.your_collection_vouchers = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_vouchers() });
};
G.FUNCS.your_collection_enhancements_exit_overlay_menu = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_enhancements("exit_overlay_menu") });
};
G.FUNCS.your_collection_enhancements = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_enhancements() });
};
G.FUNCS.your_collection_decks = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_decks() });
};
G.FUNCS.your_collection_editions = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_editions() });
};
G.FUNCS.your_collection_tags = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_tags() });
};
G.FUNCS.your_collection_seals = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_seals() });
};
G.FUNCS.your_collection_boosters = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_your_collection_boosters() });
};
G.FUNCS.challenge_list = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: G.UIDEF.challenge_list(e.config.id === "from_game_over") });
    if (e.config.id === "from_game_over") {
        G.OVERLAY_MENU.config.no_esc = true;
    }
};
G.FUNCS.high_scores = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_high_scores() });
};
G.FUNCS.customize_deck = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_customize_deck() });
};
G.FUNCS.usage = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: G.UIDEF.usage_tabs() });
};
G.FUNCS.setup_run = function (e) {
    G.SETTINGS.paused = true;
    G.FUNCS.overlay_menu({ definition: G.UIDEF.run_setup((e.config.id === "from_game_over" || e.config.id === "from_game_won" || e.config.id === "challenge_list") && e.config.id) });
    if (e.config.id === "from_game_over" || e.config.id === "from_game_won") {
        G.OVERLAY_MENU.config.no_esc = true;
    }
};
G.FUNCS.wait_for_high_scores = function (e) {
    if (G.ARGS.HIGH_SCORE_RESPONSE) {
        e.config.object.remove();
        e.config.object = new UIBox({ definition: create_UIBox_high_scores_filling(G.ARGS.HIGH_SCORE_RESPONSE), config: { offset: { x: 0, y: 0 }, align: "cm", parent: e } });
        G.ARGS.HIGH_SCORE_RESPONSE = undefined;
    }
};
G.FUNCS.notify_then_setup_run = function (e) {
    G.OVERLAY_MENU.remove();
    G.OVERLAY_MENU = undefined;
    G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
            unlock_notify();
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
            if (G.E_MANAGER.queues.unlock.length <= 0 && !G.OVERLAY_MENU) {
                G.SETTINGS.paused = true;
                G.FUNCS.overlay_menu({ definition: G.UIDEF.run_setup((e.config.id === "from_game_over" || e.config.id === "from_game_won") && e.config.id) });
                if (e.config.id === "from_game_over" || e.config.id === "from_game_won") {
                    G.OVERLAY_MENU.config.no_esc = true;
                }
                return true;
            }
        } }));
};
G.FUNCS.change_challenge_description = function (e) {
    if (G.OVERLAY_MENU) {
        let desc_area = G.OVERLAY_MENU.get_UIE_by_ID("challenge_area");
        if (desc_area && desc_area.config.oid !== e.config.id) {
            if (desc_area.config.old_chosen) {
                desc_area.config.old_chosen.config.chosen = undefined;
            }
            e.config.chosen = "vert";
            if (desc_area.config.object) {
                desc_area.config.object.remove();
            }
            desc_area.config.object = new UIBox({ definition: G.UIDEF.challenge_description(e.config.id), config: { offset: { x: 0, y: 0 }, align: "cm", parent: desc_area } });
            desc_area.config.oid = e.config.id;
            desc_area.config.old_chosen = e;
        }
    }
};
G.FUNCS.change_challenge_list_page = function (args) {
    if (!args || !args.cycle_config) {
        return;
    }
    if (G.OVERLAY_MENU) {
        let ch_list = G.OVERLAY_MENU.get_UIE_by_ID("challenge_list");
        if (ch_list) {
            if (ch_list.config.object) {
                ch_list.config.object.remove();
            }
            ch_list.config.object = new UIBox({ definition: G.UIDEF.challenge_list_page(args.cycle_config.current_option - 1), config: { offset: { x: 0, y: 0 }, align: "cm", parent: ch_list } });
            G.FUNCS.change_challenge_description({ config: { id: "nil" } });
        }
    }
};
G.FUNCS.deck_view_challenge = function (e) {
    G.FUNCS.overlay_menu({ definition: create_UIBox_generic_options({ back_func: "deck_info", contents: [G.UIDEF.challenge_description(get_challenge_int_from_id(e.config.id.id || ""), undefined, true)] }) });
};
G.FUNCS.profile_select = function (e) {
    G.SETTINGS.paused = true;
    G.focused_profile = G.SETTINGS.profile;
    for (let i = 1; i <= 3; i++) {
        if (i !== G.focused_profile && love.filesystem.getInfo(i + ("/" + "profile.jkr"))) {
            G.load_profile(i);
        }
    }
    G.load_profile(G.focused_profile);
    G.FUNCS.overlay_menu({ definition: G.UIDEF.profile_select() });
};
G.FUNCS.quit = function (e) {
    love.event.quit();
};
G.FUNCS.quit_cta = function (e) {
    G.SETTINGS.paused = true;
    G.SETTINGS.DEMO.quit_CTA_shown = true;
    G.save_progress();
    G.FUNCS.overlay_menu({ definition: create_UIBox_exit_CTA(), config: { no_esc: true } });
    let Jimbo = undefined;
    if (!G.jimboed) {
        G.jimboed = true;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 2.5, func: function () {
                if (G.OVERLAY_MENU && G.OVERLAY_MENU.get_UIE_by_ID("jimbo_spot")) {
                    Jimbo = Card_Character({ x: 0, y: 5 });
                    let spot = G.OVERLAY_MENU.get_UIE_by_ID("jimbo_spot");
                    spot.config.object.remove();
                    spot.config.object = Jimbo;
                    Jimbo.ui_object_updated = true;
                    Jimbo.add_speech_bubble(["Having fun?", [{ text: "Wishlist Balatro!", type: "GREEN" }]]);
                    Jimbo.say_stuff(5);
                }
                return true;
            } }));
    }
};
G.FUNCS.demo_survey = function (e) {
    love.system.openURL("https://forms.gle/WX26BHq1AwwV5xyH9");
};
G.FUNCS.louisf_insta = function (e) {
    love.system.openURL("https://www.instagram.com/louisfsoundtracks/");
};
G.FUNCS.wishlist_steam = function (e) {
    love.system.openURL("https://store.steampowered.com/app/2379780/Balatro/#game_area_purchase");
};
G.FUNCS.go_to_playbalatro = function (e) {
    love.system.openURL("https://www.playbalatro.com");
};
G.FUNCS.go_to_discord = function (e) {
    love.system.openURL("https://discord.gg/balatro");
};
G.FUNCS.go_to_discord_loc = function (e) {
    love.system.openURL("https://discord.com/channels/1116389027176787968/1207803392978853898");
};
G.FUNCS.loc_survey = function (e) {
    love.system.openURL("https://forms.gle/pL5tMh1oXLmv8czz9");
};
G.FUNCS.go_to_twitter = function (e) {
    love.system.openURL("https://twitter.com/LocalThunk");
};
G.FUNCS.unlock_this = function (e) {
    unlock_achievement(e.config.id);
};
G.FUNCS.reset_achievements = function (e) {
    G.ACHIEVEMENTS = undefined;
    G.SETTINGS.ACHIEVEMENTS_EARNED = {};
    G.save_progress();
    G.FUNCS.exit_overlay_menu();
};
G.FUNCS.refresh_contrast_mode = function () {
    let new_colour_proto = G.C["SO_" + (G.SETTINGS.colourblind_option && 2 || 1)];
    G.C.SUITS.Hearts = new_colour_proto.Hearts;
    G.C.SUITS.Diamonds = new_colour_proto.Diamonds;
    G.C.SUITS.Spades = new_colour_proto.Spades;
    G.C.SUITS.Clubs = new_colour_proto.Clubs;
    for (const [k, v] of pairs(G.I.CARD)) {
        if (v.config && v.config.card && v.children.front && v.ability.effect !== "Stone Card") {
            v.set_sprites(undefined, v.config.card);
        }
    }
};
G.FUNCS.warn_lang = function (e) {
    let _infotip_object = G.OVERLAY_MENU.get_UIE_by_ID("overlay_menu_infotip");
    if (_infotip_object.config.set !== e.config.ref_table.label) {
        _infotip_object.config.object.remove();
        _infotip_object.config.object = new UIBox({ definition: overlay_infotip({ [1]: e.config.ref_table.warning[1], [2]: e.config.ref_table.warning[2], [3]: e.config.ref_table.warning[3], lang: e.config.ref_table }), config: { offset: { x: 0, y: 0 }, align: "bm", parent: _infotip_object } });
        _infotip_object.config.object.UIRoot.juice_up();
        _infotip_object.config.set = e.config.ref_table.label;
        e.config.disable_button = true;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06, blockable: false, blocking: false, func: function () {
                play_sound("tarot2", 0.76, 0.4);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.35, blockable: false, blocking: false, func: function () {
                e.config.disable_button = undefined;
                return true;
            } }));
        e.config.button = "change_lang";
        play_sound("tarot2", 1, 0.4);
    }
};
G.FUNCS.change_lang = function (e) {
    let lang = e.config.ref_table;
    if (!lang || lang === G.LANG) {
        G.FUNCS.exit_overlay_menu();
    }
    else {
        G.SETTINGS.language = lang.loc_key || lang.key;
        G.SETTINGS.real_language = lang.key;
        G.set_language();
        G.E_MANAGER.clear_queue();
        G.FUNCS.wipe_on();
        G.E_MANAGER.add_event(new GameEvent({ no_delete: true, blockable: true, blocking: false, func: function () {
                G.delete_run();
                G.init_item_prototypes();
                G.main_menu();
                return true;
            } }));
        G.FUNCS.wipe_off();
    }
};
G.FUNCS.copy_seed = function (e) {
    if (G.F_LOCAL_CLIPBOARD) {
        G.CLIPBOARD = G.GAME.pseudorandom.seed;
    }
    else {
        love.system.setClipboardText(G.GAME.pseudorandom.seed);
    }
};
G.FUNCS.start_setup_run = function (e) {
    if (G.OVERLAY_MENU) {
        G.FUNCS.exit_overlay_menu();
    }
    if (G.SETTINGS.current_setup === "New Run") {
        if (!G.GAME || !G.GAME.won && !G.GAME.seeded) {
            if (G.SAVED_GAME !== undefined) {
                if (!G.SAVED_GAME.GAME.won) {
                    G.PROFILES[G.SETTINGS.profile].high_scores.current_streak.amt = 0;
                }
                G.save_settings();
            }
        }
        let _seed = G.run_setup_seed && G.setup_seed || G.forced_seed || undefined;
        let _challenge = G.challenge_tab || undefined;
        let _stake = G.forced_stake || G.PROFILES[G.SETTINGS.profile].MEMORY.stake || 1;
        G.FUNCS.start_run(e, { stake: _stake, seed: _seed, challenge: _challenge });
    }
    else if (G.SETTINGS.current_setup === "Continue") {
        if (G.SAVED_GAME !== undefined) {
            G.FUNCS.start_run(undefined, { savetext: G.SAVED_GAME });
        }
    }
};
G.FUNCS.start_challenge_run = function (e) {
    if (G.OVERLAY_MENU) {
        G.FUNCS.exit_overlay_menu();
    }
    G.FUNCS.start_run(e, { stake: 1, challenge: G.CHALLENGES[e.config.id] });
};
G.FUNCS.toggle_seeded_run = function (e) {
    if (e.config.object && !G.run_setup_seed) {
        e.config.object.remove();
        e.config.object = undefined;
    }
    else if (!e.config.object && G.run_setup_seed) {
        e.config.object = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.C, config: { align: "cm", minw: 2.5, padding: 0.05 }, nodes: [simple_text_container("ml_disabled_seed", { colour: G.C.UI.TEXT_LIGHT, scale: 0.26, shadow: true })] }, { n: G.UIT.C, config: { align: "cm", minw: 0.1 }, nodes: [create_text_input({ max_length: 8, all_caps: true, ref_table: G, ref_value: "setup_seed", prompt_text: localize("k_enter_seed") }), { n: G.UIT.C, config: { align: "cm", minw: 0.1 }, nodes: {} }, UIBox_button({ label: localize("ml_paste_seed"), minw: 1, minh: 0.6, button: "paste_seed", colour: G.C.BLUE, scale: 0.3, col: true })] }, { n: G.UIT.C, config: { align: "cm", minw: 2.5 }, nodes: {} }] }, config: { offset: { x: 0, y: 0 }, parent: e, type: "cm" } });
        e.config.object.recalculate();
    }
};
G.FUNCS.start_tutorial = function (e) {
    if (G.OVERLAY_MENU) {
        G.FUNCS.exit_overlay_menu();
    }
    G.SETTINGS.tutorial_progress = { forced_shop: ["j_joker", "c_empress"], forced_voucher: "v_grabber", forced_tags: ["tag_handy", "tag_garbage"], hold_parts: {}, completed_parts: {} };
    G.SETTINGS.tutorial_complete = false;
    G.FUNCS.start_run(e);
};
G.FUNCS.chip_UI_set = function (e) {
    let new_chips_text = number_format(G.GAME.chips);
    if (G.GAME.chips_text !== new_chips_text) {
        e.config.scale = math.min(0.8, scale_number(G.GAME.chips, 1.1));
        G.GAME.chips_text = new_chips_text;
    }
};
G.FUNCS.blind_chip_UI_scale = function (e) {
    if (G.GAME.blind && G.GAME.blind.chips) {
        e.config.scale = scale_number(G.GAME.blind.chips, 0.7, 100000);
    }
};
function scale_number(number, scale, max, e_switch_point): void {
    G.E_SWITCH_POINT = G.E_SWITCH_POINT || 100000000000;
    if (!number || type(number) !== "number") {
        return scale;
    }
    if (!max) {
        max = 10000;
    }
    if (math.abs(number) >= (e_switch_point || G.E_SWITCH_POINT)) {
        scale = scale * math.floor(math.log(max * 10, 10)) / math.floor(math.log(1000000 * 10, 10));
    }
    else if (number >= max) {
        scale = scale * math.floor(math.log(max * 10, 10)) / math.floor(math.log(number * 10, 10));
    }
    return scale;
}
G.FUNCS.hand_mult_UI_set = function (e) {
    let new_mult_text = number_format(G.GAME.current_round.current_hand.mult);
    if (new_mult_text !== G.GAME.current_round.current_hand.mult_text) {
        G.GAME.current_round.current_hand.mult_text = new_mult_text;
        e.config.object.scale = scale_number(G.GAME.current_round.current_hand.mult, 0.9, 1000);
        e.config.object.update_text();
        if (!G.TAROT_INTERRUPT_PULSE) {
            G.FUNCS.text_super_juice(e, math.max(0, math.floor(math.log10(type(G.GAME.current_round.current_hand.mult) === "number" && G.GAME.current_round.current_hand.mult || 1))));
        }
    }
};
G.FUNCS.hand_chip_UI_set = function (e) {
    let new_chip_text = number_format(G.GAME.current_round.current_hand.chips);
    if (new_chip_text !== G.GAME.current_round.current_hand.chip_text) {
        G.GAME.current_round.current_hand.chip_text = new_chip_text;
        e.config.object.scale = scale_number(G.GAME.current_round.current_hand.chips, 0.9, 1000);
        e.config.object.update_text();
        if (!G.TAROT_INTERRUPT_PULSE) {
            G.FUNCS.text_super_juice(e, math.max(0, math.floor(math.log10(type(G.GAME.current_round.current_hand.chips) === "number" && G.GAME.current_round.current_hand.chips || 1))));
        }
    }
};
G.FUNCS.hand_chip_total_UI_set = function (e) {
    if (G.GAME.current_round.current_hand.chip_total < 1) {
        G.GAME.current_round.current_hand.chip_total_text = "";
    }
    else {
        let new_chip_total_text = number_format(G.GAME.current_round.current_hand.chip_total);
        if (new_chip_total_text !== G.GAME.current_round.current_hand.chip_total_text) {
            e.config.object.scale = scale_number(G.GAME.current_round.current_hand.chip_total, 0.95, 100000000);
            G.GAME.current_round.current_hand.chip_total_text = new_chip_total_text;
            if (!G.ARGS.hand_chip_total_UI_set || G.ARGS.hand_chip_total_UI_set < G.GAME.current_round.current_hand.chip_total) {
                G.FUNCS.text_super_juice(e, math.floor(math.log10(G.GAME.current_round.current_hand.chip_total)));
            }
            G.ARGS.hand_chip_total_UI_set = G.GAME.current_round.current_hand.chip_total;
        }
    }
};
G.FUNCS.text_super_juice = function (e, _amount) {
    e.config.object.set_quiver(0.03 * _amount);
    e.config.object.pulse(0.3 + 0.08 * _amount);
    e.config.object.update_text();
    e.config.object.align_letters();
    e.update_object();
};
G.FUNCS.flame_handler = function (e) {
    G.C.UI_CHIPLICK = G.C.UI_CHIPLICK || [1, 1, 1, 1];
    G.C.UI_MULTLICK = G.C.UI_MULTLICK || [1, 1, 1, 1];
    for (let i = 1; i <= 3; i++) {
        G.C.UI_CHIPLICK[i] = math.min(math.max(G.C.UI_CHIPS[i] * 0.5 + G.C.YELLOW[i] * 0.5 + 0.1 ^ 2, 0.1), 1);
        G.C.UI_MULTLICK[i] = math.min(math.max(G.C.UI_MULT[i] * 0.5 + G.C.YELLOW[i] * 0.5 + 0.1 ^ 2, 0.1), 1);
    }
    G.ARGS.flame_handler = G.ARGS.flame_handler || { chips: { id: "flame_chips", arg_tab: "chip_flames", colour: G.C.UI_CHIPS, accent: G.C.UI_CHIPLICK }, mult: { id: "flame_mult", arg_tab: "mult_flames", colour: G.C.UI_MULT, accent: G.C.UI_MULTLICK } };
    for (const [k, v] of pairs(G.ARGS.flame_handler)) {
        if (e.config.id === v.id) {
            if (!e.config.object.is(Sprite) || e.config.object.ID !== v.ID) {
                e.config.object.remove();
                e.config.object = Sprite(0, 0, 2.5, 2.5, G.ASSET_ATLAS["ui_1"], { x: 2, y: 0 });
                v.ID = e.config.object.ID;
                G.ARGS[v.arg_tab] = { intensity: 0, real_intensity: 0, intensity_vel: 0, colour_1: v.colour, colour_2: v.accent, timer: G.TIMERS.REAL };
                e.config.object.set_alignment({ major: e.parent, type: "bmi", offset: { x: 0, y: 0 }, xy_bond: "Weak" });
                e.config.object.define_draw_steps([{ shader: "flame", send: [{ name: "time", ref_table: G.ARGS[v.arg_tab], ref_value: "timer" }, { name: "amount", ref_table: G.ARGS[v.arg_tab], ref_value: "real_intensity" }, { name: "image_details", ref_table: e.config.object, ref_value: "image_dims" }, { name: "texture_details", ref_table: e.config.object.RETS, ref_value: "get_pos_pixel" }, { name: "colour_1", ref_table: G.ARGS[v.arg_tab], ref_value: "colour_1" }, { name: "colour_2", ref_table: G.ARGS[v.arg_tab], ref_value: "colour_2" }, { name: "id", val: e.config.object.ID }] }]);
                e.config.object.get_pos_pixel();
            }
            let _F = G.ARGS[v.arg_tab];
            let exptime = math.exp(-0.4 * G.real_dt);
            if (G.ARGS.score_intensity.earned_score >= G.ARGS.score_intensity.required_score && G.ARGS.score_intensity.required_score > 0) {
                _F.intensity = (G.pack_cards && !G.pack_cards.REMOVED || G.TAROT_INTERRUPT) && 0 || math.max(0, math.log(G.ARGS.score_intensity.earned_score, 5) - 2);
            }
            else {
                _F.intensity = 0;
            }
            _F.timer = _F.timer + G.real_dt * (1 + _F.intensity * 0.2);
            if (_F.intensity_vel < 0) {
                _F.intensity_vel = _F.intensity_vel * (1 - 10 * G.real_dt);
            }
            _F.intensity_vel = (1 - exptime) * (_F.intensity - _F.real_intensity) * G.real_dt * 25 + exptime * _F.intensity_vel;
            _F.real_intensity = math.max(0, _F.real_intensity + _F.intensity_vel);
            _F.change = (_F.change || 0) * (1 - 4 * G.real_dt) + 4 * G.real_dt * (_F.real_intensity < _F.intensity - 0 && 1 || 0) * _F.real_intensity;
        }
    }
};
G.FUNCS.hand_text_UI_set = function (e) {
    if (G.GAME.current_round.current_hand.handname !== G.GAME.current_round.current_hand.handname_text) {
        G.GAME.current_round.current_hand.handname_text = G.GAME.current_round.current_hand.handname;
        if (G.GAME.current_round.current_hand.handname.len() >= 13) {
            e.config.object.scale = 12 * 0.56 / G.GAME.current_round.current_hand.handname.len();
        }
        else {
            e.config.object.scale = 2.4 / math.sqrt(G.GAME.current_round.current_hand.handname.len() + 5);
        }
        e.config.object.update_text();
    }
};
G.FUNCS.can_play = function (e) {
    if (G.hand.highlighted.length <= 0 || G.GAME.blind.block_play || G.hand.highlighted.length > 5) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.BLUE;
        e.config.button = "play_cards_from_highlighted";
    }
};
G.FUNCS.can_start_run = function (e) {
    if (!G.GAME.viewed_back.effect.center.unlocked) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.BLUE;
        e.config.button = "start_setup_run";
    }
};
G.FUNCS.visible_blind = function (e) {
    if (next(G.GAME.blind.config.blind)) {
        e.states.visible = true;
    }
    else {
        e.states.visible = false;
    }
};
G.FUNCS.can_reroll = function (e) {
    if (G.GAME.dollars - G.GAME.bankrupt_at - G.GAME.current_round.reroll_cost < 0 && G.GAME.current_round.reroll_cost !== 0) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.GREEN;
        e.config.button = "reroll_shop";
    }
};
G.FUNCS.can_discard = function (e) {
    if (G.GAME.current_round.discards_left <= 0 || G.hand.highlighted.length <= 0) {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.RED;
        e.config.button = "discard_cards_from_highlighted";
    }
};
G.FUNCS.can_use_consumeable = function (e) {
    if (e.config.ref_table.can_use_consumeable()) {
        e.config.colour = G.C.RED;
        e.config.button = "use_card";
    }
    else {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
};
G.FUNCS.can_select_card = function (e) {
    if (e.config.ref_table.ability.set !== "Joker" || e.config.ref_table.edition && e.config.ref_table.edition.negative || G.jokers.cards.length < G.jokers.config.card_limit) {
        e.config.colour = G.C.GREEN;
        e.config.button = "use_card";
    }
    else {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
};
G.FUNCS.can_sell_card = function (e) {
    if (e.config.ref_table.can_sell_card()) {
        e.config.colour = G.C.GREEN;
        e.config.button = "sell_card";
    }
    else {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
};
G.FUNCS.can_skip_booster = function (e) {
    if (G.pack_cards && !(G.GAME.STOP_USE && G.GAME.STOP_USE > 0) && (G.STATE === G.STATES.SMODS_BOOSTER_OPENED || G.STATE === G.STATES.PLANET_PACK || G.STATE === G.STATES.STANDARD_PACK || G.STATE === G.STATES.BUFFOON_PACK || G.hand)) {
        e.config.colour = G.C.GREY;
        e.config.button = "skip_booster";
    }
    else {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
};
G.FUNCS.show_infotip = function (e) {
    if (e.config.ref_table) {
        e.children.info = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, padding: 0.02 }, nodes: e.config.ref_table }, config: (!e.config.ref_table || !e.config.ref_table[1].config.card_pos || e.config.ref_table[1].config.card_pos > G.ROOM.T.w * 0.4) && { offset: { x: -0.03, y: 0 }, align: "cl", parent: e } || { offset: { x: 0.03, y: 0 }, align: "cr", parent: e } });
        e.children.info.align_to_major();
        e.config.ref_table = undefined;
    }
};
G.FUNCS.use_card = function (e, mute, nosave) {
    e.config.button = undefined;
    let card = e.config.ref_table;
    let area = card.area;
    let prev_state = G.STATE;
    let dont_dissolve = undefined;
    let delay_fac = 1;
    if (card.check_use()) {
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                e.disable_button = undefined;
                e.config.button = "use_card";
                return true;
            } }));
        return;
    }
    if (card.ability.set === "Booster" && !nosave && G.STATE === G.STATES.SHOP) {
        save_with_action({ type: "use_card", card: card.sort_id });
    }
    G.TAROT_INTERRUPT = G.STATE;
    if (card.ability.set === "Booster") {
        G.GAME.PACK_INTERRUPT = G.STATE;
    }
    G.STATE = G.STATE === G.STATES.TAROT_PACK && G.STATES.TAROT_PACK || G.STATE === G.STATES.PLANET_PACK && G.STATES.PLANET_PACK || G.STATE === G.STATES.SPECTRAL_PACK && G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.STANDARD_PACK && G.STATES.STANDARD_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED && G.STATES.SMODS_BOOSTER_OPENED || G.STATE === G.STATES.BUFFOON_PACK && G.STATES.BUFFOON_PACK || G.STATES.PLAY_TAROT;
    G.CONTROLLER.locks.use = true;
    if (G.booster_pack && !G.booster_pack.alignment.offset.py && (card.ability.consumeable || !(G.GAME.pack_choices && G.GAME.pack_choices > 1))) {
        G.booster_pack.alignment.offset.py = G.booster_pack.alignment.offset.y;
        G.booster_pack.alignment.offset.y = G.ROOM.T.y + 29;
    }
    if (G.shop && !G.shop.alignment.offset.py) {
        G.shop.alignment.offset.py = G.shop.alignment.offset.y;
        G.shop.alignment.offset.y = G.ROOM.T.y + 29;
    }
    if (G.blind_select && !G.blind_select.alignment.offset.py) {
        G.blind_select.alignment.offset.py = G.blind_select.alignment.offset.y;
        G.blind_select.alignment.offset.y = G.ROOM.T.y + 39;
    }
    if (G.round_eval && !G.round_eval.alignment.offset.py) {
        G.round_eval.alignment.offset.py = G.round_eval.alignment.offset.y;
        G.round_eval.alignment.offset.y = G.ROOM.T.y + 29;
    }
    if (card.children.use_button) {
        card.children.use_button.remove();
        card.children.use_button = undefined;
    }
    if (card.children.sell_button) {
        card.children.sell_button.remove();
        card.children.sell_button = undefined;
    }
    if (card.children.price) {
        card.children.price.remove();
        card.children.price = undefined;
    }
    let nc;
    if (card.ability.consumeable) {
        let obj = card.config.center;
        if (obj.keep_on_use && type(obj.keep_on_use) === "function") {
            nc = obj.keep_on_use(card);
        }
    }
    if (card.area && (!nc || card.area === G.pack_cards)) {
        card.area.remove_card(card);
    }
    if (booster_obj && booster_obj.select_card) {
        let area = type(booster_obj.select_card) === "table" && (booster_obj.select_card[e.config.ref_table.ability.set] || undefined) || booster_obj.select_card;
        G[area].emplace(card);
        play_sound("card1", 0.8, 0.6);
        play_sound("generic1");
        dont_dissolve = true;
        delay_fac = 0.2;
    }
    else if (card.ability.consumeable) {
        if (nc) {
            if (area) {
                area.remove_from_highlighted(card);
            }
            play_sound("cardSlide2", undefined, 0.3);
            dont_dissolve = true;
        }
        if (G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.PLANET_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED) {
            card.T.x = G.hand.T.x + G.hand.T.w / 2 - card.T.w / 2;
            card.T.y = G.hand.T.y + G.hand.T.h / 2 - card.T.h / 2 - 0.5;
            discover_card(card.config.center);
        }
        else if (!nc) {
            draw_card(G.hand, G.play, 1, "up", true, card, undefined, mute);
        }
        delay(0.2);
        e.config.ref_table.use_consumeable(area);
        SMODS.calculate_context({ using_consumeable: true, consumeable: card });
    }
    else if (card.ability.set === "Enhanced" || card.ability.set === "Default") {
        G.playing_card = G.playing_card && G.playing_card + 1 || 1;
        G.deck.emplace(card);
        play_sound("card1", 0.8, 0.6);
        play_sound("generic1");
        card.playing_card = G.playing_card;
        playing_card_joker_effects([card]);
        card.add_to_deck();
        table.insert(G.playing_cards, card);
        dont_dissolve = true;
        delay_fac = 0.2;
    }
    else if (card.ability.set === "Joker") {
        card.add_to_deck();
        G.jokers.emplace(card);
        play_sound("card1", 0.8, 0.6);
        play_sound("generic1");
        dont_dissolve = true;
        delay_fac = 0.2;
    }
    else if (card.ability.set === "Booster") {
        delay(0.1);
        if (card.ability.booster_pos) {
            G.GAME.current_round.used_packs[card.ability.booster_pos] = "USED";
        }
        draw_card(G.hand, G.play, 1, "up", true, card, undefined, true);
        if (!card.from_tag) {
            G.GAME.round_scores.cards_purchased.amt = G.GAME.round_scores.cards_purchased.amt + 1;
        }
        e.config.ref_table.open();
    }
    else if (card.ability.set === "Voucher") {
        delay(0.1);
        draw_card(G.hand, G.play, 1, "up", true, card, undefined, true);
        G.GAME.round_scores.cards_purchased.amt = G.GAME.round_scores.cards_purchased.amt + 1;
        if (area === G.pack_cards) {
            e.config.ref_table.cost = 0;
        }
        e.config.ref_table.redeem();
    }
    if (card.ability.set === "Booster") {
        G.CONTROLLER.locks.use = false;
        G.TAROT_INTERRUPT = undefined;
    }
    else {
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                if (!dont_dissolve) {
                    card.start_dissolve();
                }
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                        G.STATE = prev_state;
                        G.TAROT_INTERRUPT = undefined;
                        G.CONTROLLER.locks.use = false;
                        if ((prev_state === G.STATES.TAROT_PACK || prev_state === G.STATES.PLANET_PACK || prev_state === G.STATES.SPECTRAL_PACK || prev_state === G.STATES.STANDARD_PACK || prev_state === G.STATES.SMODS_BOOSTER_OPENED || prev_state === G.STATES.BUFFOON_PACK) && G.booster_pack) {
                            if (nc && area === G.pack_cards) {
                                G.pack_cards.remove_card(card);
                                G.consumeables.emplace(card);
                            }
                            booster_obj = undefined;
                            if (area === G.consumeables) {
                                G.booster_pack.alignment.offset.y = G.booster_pack.alignment.offset.py;
                                G.booster_pack.alignment.offset.py = undefined;
                            }
                            else if (G.GAME.pack_choices && G.GAME.pack_choices > 1) {
                                if (G.booster_pack.alignment.offset.py) {
                                    G.booster_pack.alignment.offset.y = G.booster_pack.alignment.offset.py;
                                    G.booster_pack.alignment.offset.py = undefined;
                                }
                                G.GAME.pack_choices = G.GAME.pack_choices - 1;
                            }
                            else {
                                G.CONTROLLER.interrupt.focus = true;
                                if (prev_state === G.STATES.TAROT_PACK) {
                                    inc_career_stat("c_tarot_reading_used", 1);
                                }
                                if (prev_state === G.STATES.PLANET_PACK) {
                                    inc_career_stat("c_planetarium_used", 1);
                                }
                                G.FUNCS.end_consumeable(undefined, delay_fac);
                            }
                        }
                        else {
                            if (G.shop) {
                                G.shop.alignment.offset.y = G.shop.alignment.offset.py;
                                G.shop.alignment.offset.py = undefined;
                            }
                            if (G.blind_select) {
                                G.blind_select.alignment.offset.y = G.blind_select.alignment.offset.py;
                                G.blind_select.alignment.offset.py = undefined;
                            }
                            if (G.round_eval) {
                                G.round_eval.alignment.offset.y = G.round_eval.alignment.offset.py;
                                G.round_eval.alignment.offset.py = undefined;
                            }
                            if (area && area.cards[1]) {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                                G.CONTROLLER.interrupt.focus = undefined;
                                                if (card.ability.set === "Voucher") {
                                                    G.CONTROLLER.snap_to({ node: G.shop.get_UIE_by_ID("next_round_button") });
                                                }
                                                else if (area) {
                                                    G.CONTROLLER.recall_cardarea_focus(area);
                                                }
                                                return true;
                                            } }));
                                        return true;
                                    } }));
                            }
                        }
                        return true;
                    } }));
                return true;
            } }));
    }
};
G.FUNCS.sell_card = function (e) {
    let card = e.config.ref_table;
    card.sell_card();
    SMODS.calculate_context({ selling_card: true, card: card });
};
G.FUNCS.can_confirm_contest_name = function (e) {
    if (G.SETTINGS.COMP && G.SETTINGS.COMP.name !== "") {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
    }
    else {
        e.config.colour = G.C.PALE_GREEN;
        e.config.button = "confirm_contest_name";
    }
};
G.FUNCS.confirm_contest_name = function (e) {
    G.SETTINGS.COMP.submission_name = true;
    if (G.MAIN_MENU_UI) {
        G.MAIN_MENU_UI.remove();
    }
    if (G.PROFILE_BUTTON) {
        G.PROFILE_BUTTON.remove();
    }
    set_main_menu_UI();
    G.save_progress();
    G.FILE_HANDLER.force = true;
};
G.FUNCS.change_contest_name = function (e) {
    G.SETTINGS.COMP.name = "";
    if (G.MAIN_MENU_UI) {
        G.MAIN_MENU_UI.remove();
    }
    if (G.PROFILE_BUTTON) {
        G.PROFILE_BUTTON.remove();
    }
    set_main_menu_UI();
};
G.FUNCS.skip_tutorial_section = function (e) {
    G.OVERLAY_TUTORIAL.skip_steps = true;
    if (G.OVERLAY_TUTORIAL.Jimbo) {
        G.OVERLAY_TUTORIAL.Jimbo.remove();
    }
    if (G.OVERLAY_TUTORIAL.content) {
        G.OVERLAY_TUTORIAL.content.remove();
    }
    G.OVERLAY_TUTORIAL.remove();
    G.OVERLAY_TUTORIAL = undefined;
    G.E_MANAGER.clear_queue("tutorial");
    if (G.SETTINGS.tutorial_progress.section === "small_blind") {
        G.SETTINGS.tutorial_progress.completed_parts["small_blind"] = true;
    }
    else if (G.SETTINGS.tutorial_progress.section === "big_blind") {
        G.SETTINGS.tutorial_progress.completed_parts["big_blind"] = true;
        G.SETTINGS.tutorial_progress.forced_tags = undefined;
    }
    else if (G.SETTINGS.tutorial_progress.section === "second_hand") {
        G.SETTINGS.tutorial_progress.completed_parts["second_hand"] = true;
        G.SETTINGS.tutorial_progress.hold_parts["second_hand"] = true;
    }
    else if (G.SETTINGS.tutorial_progress.section === "first_hand") {
        G.SETTINGS.tutorial_progress.completed_parts["first_hand"] = true;
        G.SETTINGS.tutorial_progress.completed_parts["first_hand_2"] = true;
        G.SETTINGS.tutorial_progress.completed_parts["first_hand_3"] = true;
        G.SETTINGS.tutorial_progress.completed_parts["first_hand_4"] = true;
        G.SETTINGS.tutorial_progress.completed_parts["first_hand_section"] = true;
    }
    else if (G.SETTINGS.tutorial_progress.section === "shop") {
        G.SETTINGS.tutorial_progress.completed_parts["shop_1"] = true;
        G.SETTINGS.tutorial_progress.forced_voucher = undefined;
    }
};
G.FUNCS.shop_voucher_empty = function (e) {
    if (G.shop_vouchers && G.shop_vouchers.cards && (G.shop_vouchers.cards[1] || G.GAME.current_round.voucher)) {
        e.states.visible = false;
    }
    else if (G.SETTINGS.language !== "en-us") {
        e.states.visible = false;
    }
    else {
        e.states.visible = true;
    }
};
G.FUNCS.check_for_buy_space = function (card) {
    if (card.ability.set !== "Voucher" && card.ability.set !== "Enhanced" && card.ability.set !== "Default" && !(card.ability.set === "Joker" && G.jokers.cards.length < G.jokers.config.card_limit + (card.edition && card.edition.negative && 1 || 0)) && !(card.ability.consumeable && G.consumeables.cards.length < G.consumeables.config.card_limit + (card.edition && card.edition.negative && 1 || 0))) {
        alert_no_space(card, card.ability.consumeable && G.consumeables || G.jokers);
        return false;
    }
    return true;
};
G.FUNCS.buy_from_shop = function (e) {
    let c1 = e.config.ref_table;
    if (c1 && c1.is(Card)) {
        if (e.config.id !== "buy_and_use") {
            if (!G.FUNCS.check_for_buy_space(c1)) {
                e.disable_button = undefined;
                return false;
            }
        }
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                c1.area.remove_card(c1);
                c1.add_to_deck();
                if (c1.children.price) {
                    c1.children.price.remove();
                }
                c1.children.price = undefined;
                if (c1.children.buy_button) {
                    c1.children.buy_button.remove();
                }
                c1.children.buy_button = undefined;
                remove_nils(c1.children);
                if (c1.ability.set === "Default" || c1.ability.set === "Enhanced") {
                    inc_career_stat("c_playing_cards_bought", 1);
                    G.playing_card = G.playing_card && G.playing_card + 1 || 1;
                    G.deck.emplace(c1);
                    c1.playing_card = G.playing_card;
                    playing_card_joker_effects([c1]);
                    table.insert(G.playing_cards, c1);
                }
                else if (e.config.id !== "buy_and_use") {
                    if (c1.ability.consumeable) {
                        G.consumeables.emplace(c1);
                    }
                    else {
                        G.jokers.emplace(c1);
                    }
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            let [eval, post] = eval_card(c1, { buying_card: true, card: c1 });
                            SMODS.trigger_effects([eval, post], c1);
                            return true;
                        } }));
                }
                G.GAME.round_scores.cards_purchased.amt = G.GAME.round_scores.cards_purchased.amt + 1;
                if (c1.ability.consumeable) {
                    if (c1.config.center.set === "Planet") {
                        inc_career_stat("c_planets_bought", 1);
                    }
                    else if (c1.config.center.set === "Tarot") {
                        inc_career_stat("c_tarots_bought", 1);
                    }
                }
                else if (c1.ability.set === "Joker") {
                    G.GAME.current_round.jokers_purchased = G.GAME.current_round.jokers_purchased + 1;
                }
                SMODS.calculate_context({ buying_card: true, card: c1 });
                if (G.GAME.modifiers.inflation) {
                    G.GAME.inflation = G.GAME.inflation + 1;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            for (const [k, v] of pairs(G.I.CARD)) {
                                if (v.set_cost) {
                                    v.set_cost();
                                }
                            }
                            return true;
                        } }));
                }
                play_sound("card1");
                inc_career_stat("c_shop_dollars_spent", c1.cost);
                if (c1.cost !== 0) {
                    ease_dollars(-c1.cost);
                }
                G.CONTROLLER.save_cardarea_focus("jokers");
                G.CONTROLLER.recall_cardarea_focus("jokers");
                if (e.config.id === "buy_and_use") {
                    G.FUNCS.use_card(e, true);
                }
                return true;
            } }));
    }
};
G.FUNCS.toggle_shop = function (e) {
    stop_use();
    G.CONTROLLER.locks.toggle_shop = true;
    if (G.shop) {
        SMODS.calculate_context({ ending_shop: true });
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                G.shop.alignment.offset.y = G.ROOM.T.y + 29;
                G.SHOP_SIGN.alignment.offset.y = -15;
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                G.shop.remove();
                G.shop = undefined;
                G.SHOP_SIGN.remove();
                G.SHOP_SIGN = undefined;
                G.STATE_COMPLETE = false;
                G.STATE = G.STATES.BLIND_SELECT;
                G.CONTROLLER.locks.toggle_shop = undefined;
                return true;
            } }));
    }
};
G.FUNCS.select_blind = function (e) {
    stop_use();
    if (G.blind_select) {
        G.GAME.facing_blind = true;
        G.blind_prompt_box.get_UIE_by_ID("prompt_dynatext1").config.object.pop_delay = 0;
        G.blind_prompt_box.get_UIE_by_ID("prompt_dynatext1").config.object.pop_out(5);
        G.blind_prompt_box.get_UIE_by_ID("prompt_dynatext2").config.object.pop_delay = 0;
        G.blind_prompt_box.get_UIE_by_ID("prompt_dynatext2").config.object.pop_out(5);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.2, func: function () {
                G.blind_prompt_box.alignment.offset.y = -10;
                G.blind_select.alignment.offset.y = 40;
                G.blind_select.alignment.offset.x = 0;
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                ease_round(1);
                inc_career_stat("c_rounds", 1);
                if (_DEMO) {
                    G.SETTINGS.DEMO_ROUNDS = (G.SETTINGS.DEMO_ROUNDS || 0) + 1;
                    inc_steam_stat("demo_rounds");
                    G.save_settings();
                }
                G.GAME.round_resets.blind = e.config.ref_table;
                G.GAME.round_resets.blind_states[G.GAME.blind_on_deck] = "Current";
                G.blind_select.remove();
                G.blind_prompt_box.remove();
                G.blind_select = undefined;
                delay(0.2);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                new_round();
                return true;
            } }));
    }
};
G.FUNCS.skip_booster = function (e) {
    booster_obj = undefined;
    SMODS.calculate_context({ skipping_booster: true });
    G.FUNCS.end_consumeable(e);
};
G.FUNCS.end_consumeable = function (e, delayfac) {
    delayfac = delayfac || 1;
    stop_use();
    if (G.booster_pack) {
        if (G.booster_pack_sparkles) {
            G.booster_pack_sparkles.fade(1 * delayfac);
        }
        if (G.booster_pack_stars) {
            G.booster_pack_stars.fade(1 * delayfac);
        }
        if (G.booster_pack_meteors) {
            G.booster_pack_meteors.fade(1 * delayfac);
        }
        G.booster_pack.alignment.offset.y = G.ROOM.T.y + 9;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2 * delayfac, blocking: false, blockable: false, func: function () {
                G.booster_pack.remove();
                G.booster_pack = undefined;
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1 * delayfac, blocking: false, blockable: false, func: function () {
                if (G.booster_pack_sparkles) {
                    G.booster_pack_sparkles.remove();
                    G.booster_pack_sparkles = undefined;
                }
                if (G.booster_pack_stars) {
                    G.booster_pack_stars.remove();
                    G.booster_pack_stars = undefined;
                }
                if (G.booster_pack_meteors) {
                    G.booster_pack_meteors.remove();
                    G.booster_pack_meteors = undefined;
                }
                return true;
            } }));
    }
    delay(0.2 * delayfac);
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2 * delayfac, func: function () {
            G.FUNCS.draw_from_hand_to_deck();
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2 * delayfac, func: function () {
                    if (G.shop && G.shop.alignment.offset.py) {
                        G.shop.alignment.offset.y = G.shop.alignment.offset.py;
                        G.shop.alignment.offset.py = undefined;
                    }
                    if (G.blind_select && G.blind_select.alignment.offset.py) {
                        G.blind_select.alignment.offset.y = G.blind_select.alignment.offset.py;
                        G.blind_select.alignment.offset.py = undefined;
                    }
                    if (G.round_eval && G.round_eval.alignment.offset.py) {
                        G.round_eval.alignment.offset.y = G.round_eval.alignment.offset.py;
                        G.round_eval.alignment.offset.py = undefined;
                    }
                    G.CONTROLLER.interrupt.focus = true;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            if (G.shop) {
                                G.CONTROLLER.snap_to({ node: G.shop.get_UIE_by_ID("next_round_button") });
                            }
                            return true;
                        } }));
                    G.STATE = G.GAME.PACK_INTERRUPT;
                    ease_background_colour_blind(G.GAME.PACK_INTERRUPT);
                    G.GAME.PACK_INTERRUPT = undefined;
                    return true;
                } }));
            for (let i = 1; i <= G.GAME.tags.length; i++) {
                if (G.GAME.tags[i].apply_to_run({ type: "new_blind_choice" })) {
                    break;
                }
            }
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2 * delayfac, func: function () {
                    save_run();
                    return true;
                } }));
            return true;
        } }));
};
G.FUNCS.blind_choice_handler = function (e) {
    if (!e.config.ref_table.run_info && G.blind_select && G.blind_select.VT.y < 10 && e.config.id && G.blind_select_opts[string.lower(e.config.id)]) {
        if (e.UIBox.role.xy_bond !== "Weak") {
            e.UIBox.set_role({ xy_bond: "Weak" });
        }
        if (e.config.ref_table.deck !== "on" && e.config.id === G.GAME.blind_on_deck || e.config.ref_table.deck !== "off" && e.config.id !== G.GAME.blind_on_deck) {
            let _blind_choice = G.blind_select_opts[string.lower(e.config.id)];
            let _top_button = e.UIBox.get_UIE_by_ID("select_blind_button");
            let _border = e.UIBox.UIRoot.children[1].children[1];
            let _tag = e.UIBox.get_UIE_by_ID("tag_" + e.config.id);
            let _tag_container = e.UIBox.get_UIE_by_ID("tag_container");
            if (_tag_container && !G.SETTINGS.tutorial_complete && !G.SETTINGS.tutorial_progress.completed_parts["shop_1"]) {
                _tag_container.states.visible = false;
            }
            else if (_tag_container) {
                _tag_container.states.visible = true;
            }
            if (e.config.id === G.GAME.blind_on_deck) {
                e.config.ref_table.deck = "on";
                e.config.draw_after = false;
                e.config.colour = G.C.CLEAR;
                _border.parent.config.outline = 2;
                _border.parent.config.outline_colour = G.C.UI.TRANSPARENT_DARK;
                _border.config.outline_colour = _border.config.outline && _border.config.outline_colour || get_blind_main_colour(e.config.id);
                _border.config.outline = 1.5;
                _blind_choice.alignment.offset.y = -0.9;
                if (_tag && _tag_container) {
                    _tag_container.children[2].config.draw_after = false;
                    _tag_container.children[2].config.colour = G.C.BLACK;
                    _tag.children[2].config.button = "skip_blind";
                    _tag.config.outline_colour = adjust_alpha(G.C.BLUE, 0.5);
                    _tag.children[2].config.hover = true;
                    _tag.children[2].config.colour = G.C.RED;
                    _tag.children[2].children[1].config.colour = G.C.UI.TEXT_LIGHT;
                    let _sprite = _tag.config.ref_table;
                    _sprite.config.force_focus = undefined;
                }
                if (_top_button) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.CONTROLLER.snap_to({ node: _top_button });
                            return true;
                        } }));
                    _top_button.config.button = "select_blind";
                    _top_button.config.colour = G.C.FILTER;
                    _top_button.config.hover = true;
                    _top_button.children[1].config.colour = G.C.WHITE;
                }
            }
            else if (e.config.id !== G.GAME.blind_on_deck) {
                e.config.ref_table.deck = "off";
                e.config.draw_after = true;
                e.config.colour = adjust_alpha(G.GAME.round_resets.blind_states[e.config.id] === "Skipped" && mix_colours(G.C.BLUE, G.C.L_BLACK, 0.1) || G.C.L_BLACK, 0.5);
                _border.parent.config.outline = undefined;
                _border.parent.config.outline_colour = undefined;
                _border.config.outline_colour = undefined;
                _border.config.outline = undefined;
                _blind_choice.alignment.offset.y = -0.2;
                if (_tag && _tag_container) {
                    if (G.GAME.round_resets.blind_states[e.config.id] === "Skipped" || G.GAME.round_resets.blind_states[e.config.id] === "Defeated") {
                        _tag_container.children[2].set_role({ xy_bond: "Weak" });
                        _tag_container.children[2].align(0, 10);
                        _tag_container.children[1].set_role({ xy_bond: "Weak" });
                        _tag_container.children[1].align(0, 10);
                    }
                    if (G.GAME.round_resets.blind_states[e.config.id] === "Skipped") {
                        _blind_choice.children.alert = new UIBox({ definition: create_UIBox_card_alert({ text_rot: -0.35, no_bg: true, text: localize("k_skipped_cap"), bump_amount: 1, scale: 0.9, maxw: 3.4 }), config: { align: "tmi", offset: { x: 0, y: 2.2 }, major: _blind_choice, parent: _blind_choice } });
                    }
                    _tag.children[2].config.button = undefined;
                    _tag.config.outline_colour = G.C.UI.BACKGROUND_INACTIVE;
                    _tag.children[2].config.hover = false;
                    _tag.children[2].config.colour = G.C.UI.BACKGROUND_INACTIVE;
                    _tag.children[2].children[1].config.colour = G.C.UI.TEXT_INACTIVE;
                    let _sprite = _tag.config.ref_table;
                    _sprite.config.force_focus = true;
                }
                if (_top_button) {
                    _top_button.config.colour = G.C.UI.BACKGROUND_INACTIVE;
                    _top_button.config.button = undefined;
                    _top_button.config.hover = false;
                    _top_button.children[1].config.colour = G.C.UI.TEXT_INACTIVE;
                }
            }
        }
    }
};
G.FUNCS.hover_tag_proxy = function (e) {
    if (!e.parent || !e.parent.states) {
        return;
    }
    if ((e.states.hover.is || e.parent.states.hover.is) && e.created_on_pause === G.SETTINGS.paused && !e.parent.children.alert) {
        let _sprite = e.config.ref_table.get_uibox_table();
        e.parent.children.alert = new UIBox({ definition: G.UIDEF.card_h_popup(_sprite), config: { align: "tm", offset: { x: 0, y: -0.1 }, major: e.parent, instance_type: "POPUP" } });
        _sprite.juice_up(0.05, 0.02);
        play_sound("paper1", math.random() * 0.1 + 0.55, 0.42);
        play_sound("tarot2", math.random() * 0.1 + 0.55, 0.09);
        e.parent.children.alert.states.collide.can = false;
    }
    else if (e.parent.children.alert && (!e.states.collide.is && !e.parent.states.collide.is || e.created_on_pause !== G.SETTINGS.paused)) {
        e.parent.children.alert.remove();
        e.parent.children.alert = undefined;
    }
};
G.FUNCS.skip_blind = function (e) {
    stop_use();
    G.CONTROLLER.locks.skip_blind = true;
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, trigger: "after", blocking: false, blockable: false, delay: 2.5, timer: "TOTAL", func: function () {
            G.CONTROLLER.locks.skip_blind = undefined;
            return true;
        } }));
    let _tag = e.UIBox.get_UIE_by_ID("tag_container");
    G.GAME.skips = (G.GAME.skips || 0) + 1;
    if (_tag) {
        add_tag(_tag.config.ref_table);
        let [skipped, skip_to] = [G.GAME.blind_on_deck || "Small", G.GAME.blind_on_deck === "Small" && "Big" || G.GAME.blind_on_deck === "Big" && "Boss" || "Boss"];
        G.GAME.round_resets.blind_states[skipped] = "Skipped";
        G.GAME.round_resets.blind_states[skip_to] = "Select";
        G.GAME.blind_on_deck = skip_to;
        play_sound("generic1");
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                delay(0.3);
                SMODS.calculate_context({ skip_blind: true });
                save_run();
                for (let i = 1; i <= G.GAME.tags.length; i++) {
                    G.GAME.tags[i].apply_to_run({ type: "immediate" });
                }
                for (let i = 1; i <= G.GAME.tags.length; i++) {
                    if (G.GAME.tags[i].apply_to_run({ type: "new_blind_choice" })) {
                        break;
                    }
                }
                return true;
            } }));
    }
};
G.FUNCS.reroll_boss_button = function (e) {
    if (G.GAME.dollars - G.GAME.bankrupt_at - 10 >= 0 && (G.GAME.used_vouchers["v_retcon"] || G.GAME.used_vouchers["v_directors_cut"] && !G.GAME.round_resets.boss_rerolled)) {
        e.config.colour = G.C.RED;
        e.config.button = "reroll_boss";
        e.children[1].children[1].config.shadow = true;
        if (e.children[2]) {
            e.children[2].children[1].config.shadow = true;
        }
    }
    else {
        e.config.colour = G.C.UI.BACKGROUND_INACTIVE;
        e.config.button = undefined;
        e.children[1].children[1].config.shadow = false;
        if (e.children[2]) {
            e.children[2].children[1].config.shadow = false;
        }
    }
};
G.FUNCS.reroll_boss = function (e) {
    if (!G.blind_select_opts) {
        G.GAME.round_resets.boss_rerolled = true;
        if (!G.from_boss_tag) {
            ease_dollars(-10);
        }
        G.from_boss_tag = undefined;
        G.GAME.round_resets.blind_choices.Boss = get_new_boss();
        for (let i = 1; i <= G.GAME.tags.length; i++) {
            if (G.GAME.tags[i].apply_to_run({ type: "new_blind_choice" })) {
                break;
            }
        }
        return true;
    }
    stop_use();
    G.GAME.round_resets.boss_rerolled = true;
    if (!G.from_boss_tag) {
        ease_dollars(-10);
    }
    G.from_boss_tag = undefined;
    G.CONTROLLER.locks.boss_reroll = true;
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            play_sound("other1");
            G.blind_select_opts.boss.set_role({ xy_bond: "Weak" });
            G.blind_select_opts.boss.alignment.offset.y = 20;
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, func: function () {
            let par = G.blind_select_opts.boss.parent;
            G.GAME.round_resets.blind_choices.Boss = get_new_boss();
            G.blind_select_opts.boss.remove();
            G.blind_select_opts.boss = new UIBox({ T: [par.T.x, 0, 0, 0], definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [UIBox_dyn_container([create_UIBox_blind_choice("Boss")], false, get_blind_main_colour("Boss"), mix_colours(G.C.BLACK, get_blind_main_colour("Boss"), 0.8))] }, config: { align: "bmi", offset: { x: 0, y: G.ROOM.T.y + 9 }, major: par, xy_bond: "Weak" } });
            par.config.object = G.blind_select_opts.boss;
            par.config.object.recalculate();
            G.blind_select_opts.boss.parent = par;
            G.blind_select_opts.boss.alignment.offset.y = 0;
            G.E_MANAGER.add_event(new GameEvent({ blocking: false, trigger: "after", delay: 0.5, func: function () {
                    G.CONTROLLER.locks.boss_reroll = undefined;
                    return true;
                } }));
            save_run();
            for (let i = 1; i <= G.GAME.tags.length; i++) {
                if (G.GAME.tags[i].apply_to_run({ type: "new_blind_choice" })) {
                    break;
                }
            }
            return true;
        } }));
};
G.FUNCS.reroll_shop = function (e) {
    stop_use();
    G.CONTROLLER.locks.shop_reroll = true;
    if (G.CONTROLLER.save_cardarea_focus("shop_jokers")) {
        G.CONTROLLER.interrupt.focus = true;
    }
    if (G.GAME.current_round.reroll_cost > 0) {
        inc_career_stat("c_shop_dollars_spent", G.GAME.current_round.reroll_cost);
        inc_career_stat("c_shop_rerolls", 1);
        ease_dollars(-G.GAME.current_round.reroll_cost);
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
            let final_free = G.GAME.current_round.free_rerolls > 0;
            G.GAME.current_round.free_rerolls = math.max(G.GAME.current_round.free_rerolls - 1, 0);
            G.GAME.round_scores.times_rerolled.amt = G.GAME.round_scores.times_rerolled.amt + 1;
            calculate_reroll_cost(final_free);
            for (let i = G.shop_jokers.cards.length; i <= 1; i += -1) {
                let c = G.shop_jokers.remove_card(G.shop_jokers.cards[i]);
                c.remove();
                c = undefined;
            }
            play_sound("coin2");
            play_sound("other1");
            for (let i = 1; i <= G.GAME.shop.joker_max - G.shop_jokers.cards.length; i++) {
                let new_shop_card = create_card_for_shop(G.shop_jokers);
                G.shop_jokers.emplace(new_shop_card);
                new_shop_card.juice_up();
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, func: function () {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.CONTROLLER.interrupt.focus = false;
                    G.CONTROLLER.locks.shop_reroll = false;
                    G.CONTROLLER.recall_cardarea_focus("shop_jokers");
                    SMODS.calculate_context({ reroll_shop: true });
                    return true;
                } }));
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ func: function () {
            save_run();
            return true;
        } }));
};
G.FUNCS.cash_out = function (e) {
    stop_use();
    if (G.round_eval) {
        e.config.button = undefined;
        G.round_eval.alignment.offset.y = G.ROOM.T.y + 15;
        G.round_eval.alignment.offset.x = 0;
        G.deck.shuffle("cashout" + G.GAME.round_resets.ante);
        G.deck.hard_set_T();
        delay(0.3);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                if (G.round_eval) {
                    G.round_eval.remove();
                    G.round_eval = undefined;
                }
                G.GAME.current_round.jokers_purchased = 0;
                G.GAME.current_round.discards_left = math.max(0, G.GAME.round_resets.discards + G.GAME.round_bonus.discards);
                G.GAME.current_round.hands_left = math.max(1, G.GAME.round_resets.hands + G.GAME.round_bonus.next_hands);
                G.STATE = G.STATES.SHOP;
                G.GAME.shop_free = undefined;
                G.GAME.shop_d6ed = undefined;
                G.STATE_COMPLETE = false;
                return true;
            } }));
        ease_dollars(G.GAME.current_round.dollars);
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                G.GAME.previous_round.dollars = G.GAME.dollars;
                return true;
            } }));
        play_sound("coin7");
        G.VIBRATION = G.VIBRATION + 1;
    }
    ease_chips(0);
    if (G.GAME.round_resets.blind_states.Boss === "Defeated") {
        G.GAME.round_resets.blind_ante = G.GAME.round_resets.ante;
        G.GAME.round_resets.blind_tags.Small = get_next_tag_key();
        G.GAME.round_resets.blind_tags.Big = get_next_tag_key();
    }
    reset_blinds();
    delay(0.6);
};
G.FUNCS.start_run = function (e, args) {
    args = args || {};
    G.SETTINGS.paused = true;
    if (e && e.config.id === "restart_button") {
        G.GAME.viewed_back = undefined;
    }
    G.E_MANAGER.clear_queue();
    G.FUNCS.wipe_on();
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, func: function () {
            G.delete_run();
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", no_delete: true, func: function () {
            G.start_run(args);
            return true;
        } }));
    G.FUNCS.wipe_off();
};
G.FUNCS.go_to_menu = function (e) {
    G.SETTINGS.paused = true;
    G.E_MANAGER.clear_queue();
    G.FUNCS.wipe_on();
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, func: function () {
            G.delete_run();
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, blockable: true, blocking: false, func: function () {
            G.main_menu("game");
            return true;
        } }));
    G.FUNCS.wipe_off();
};
G.FUNCS.go_to_demo_cta = function (e) {
    G.SETTINGS.paused = true;
    G.E_MANAGER.clear_queue(undefined, G.exception_queue);
    play_sound("explosion_buildup1", undefined, 0.3);
    play_sound("whoosh1", 0.7, 0.8);
    play_sound("introPad1", 0.704, 0.8);
    G.video_organ = 0.6;
    G.FUNCS.wipe_on(undefined, true, undefined, G.C.WHITE);
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, func: function () {
            G.delete_run();
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, blockable: true, blocking: false, func: function () {
            G.demo_cta();
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, no_delete: true, blockable: false, blocking: false, func: function () {
                    G.video_organ = undefined;
                    G.normal_music_speed = undefined;
                    return true;
                } }));
            return true;
        } }));
    G.FUNCS.wipe_off();
};
G.FUNCS.show_main_cta = function (e) {
    if (e) {
        if (e.config.id === "lose_cta" && !G.SETTINGS.DEMO.lose_CTA_shown) {
            G.SETTINGS.DEMO.lose_CTA_shown = true;
        }
        if (e.config.id === "win_cta" && !G.SETTINGS.DEMO.win_CTA_shown) {
            G.SETTINGS.DEMO.win_CTA_shown = true;
        }
    }
    G.save_progress();
    G.SETTINGS.paused = true;
    G.normal_music_speed = true;
    G.FUNCS.overlay_menu({ definition: create_UIBox_demo_video_CTA(), config: { no_esc: true } });
};
G.FUNCS.wipe_on = function (message, no_card, timefac, alt_colour) {
    timefac = timefac || 1;
    if (G.screenwipe) {
        return;
    }
    G.CONTROLLER.locks.wipe = true;
    G.STAGE_OBJECT_INTERRUPT = true;
    let colours = { black: HEX("4f6367FF"), white: [1, 1, 1, 1] };
    if (!no_card) {
        G.screenwipecard = new Card(1, 1, G.CARD_W, G.CARD_H, pseudorandom_element(G.P_CARDS), G.P_CENTERS.c_base);
        G.screenwipecard.sprite_facing = "back";
        G.screenwipecard.facing = "back";
        G.screenwipecard.states.hover.can = false;
        G.screenwipecard.juice_up(0.5, 1);
    }
    let message_t = undefined;
    if (message) {
        message_t = {};
        for (const [k, v] of ipairs(message)) {
            table.insert(message_t, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: v || "", colours: [math.min(G.C.BACKGROUND.C[1], G.C.BACKGROUND.C[2]) > 0.5 && G.C.BLACK || G.C.WHITE], shadow: true, silent: k !== 1, float: true, scale: 1.3, pop_in: 0, pop_in_rate: 2, rotate: 1 }) } }] });
        }
    }
    G.screenwipe = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", minw: 0, minh: 0, padding: 0.15, r: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [message && { n: G.UIT.R, config: { id: "text", align: "cm", padding: 0.7 }, nodes: message_t } || undefined, !no_card && { n: G.UIT.O, config: { object: G.screenwipecard, role: { role_type: "Major" } } } || undefined] }] }, config: { align: "cm", offset: { x: 0, y: 0 }, major: G.ROOM_ATTACH } });
    G.screenwipe.colours = colours;
    G.screenwipe.children.particles = Particles(0, 0, 0, 0, { timer: 0, max: 1, scale: 40, speed: 0, lifespan: 1.7 * timefac, attach: G.screenwipe, colours: [alt_colour || G.C.BACKGROUND.C] });
    G.STAGE_OBJECT_INTERRUPT = undefined;
    G.screenwipe.alignment.offset.y = 0;
    if (message) {
        for (const [k, v] of ipairs(G.screenwipe.get_UIE_by_ID("text").children)) {
            v.children[1].config.object.pulse();
        }
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.7, no_delete: true, blockable: false, func: function () {
            if (!no_card) {
                G.screenwipecard.flip();
                play_sound("cardFan2");
            }
            return true;
        } }));
};
G.FUNCS.wipe_off = function () {
    G.E_MANAGER.add_event(new GameEvent({ no_delete: true, func: function () {
            delay(0.3);
            G.screenwipe.children.particles.max = 0;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", no_delete: true, blockable: false, blocking: false, timer: "REAL", ref_table: G.screenwipe.colours.black, ref_value: 4, ease_to: 0, delay: 0.3, func: function (t) {
                    return t;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", no_delete: true, blockable: false, blocking: false, timer: "REAL", ref_table: G.screenwipe.colours.white, ref_value: 4, ease_to: 0, delay: 0.3, func: function (t) {
                    return t;
                } }));
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.55, no_delete: true, blocking: false, timer: "REAL", func: function () {
            if (G.screenwipecard) {
                G.screenwipecard.start_dissolve([G.C.BLACK, G.C.ORANGE, G.C.GOLD, G.C.RED]);
            }
            if (G.screenwipe.get_UIE_by_ID("text")) {
                for (const [k, v] of ipairs(G.screenwipe.get_UIE_by_ID("text").children)) {
                    v.children[1].config.object.pop_out(4);
                }
            }
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.1, no_delete: true, blocking: false, timer: "REAL", func: function () {
            G.screenwipe.children.particles.remove();
            G.screenwipe.remove();
            G.screenwipe.children.particles = undefined;
            G.screenwipe = undefined;
            G.screenwipecard = undefined;
            return true;
        } }));
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.2, no_delete: true, blocking: true, timer: "REAL", func: function () {
            return true;
        } }));
};