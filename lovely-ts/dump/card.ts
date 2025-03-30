///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class Card extends Moveable {
    highlighted: any;
    constructor(X, Y, W, H, card, center, params) {
        super(X, Y, W, H);
        this.params = type(params) === "table" && params || {};
        this.CT = this.VT;
        this.config = { card: card || {}, center: center };
        this.tilt_var = { mx: 0, my: 0, dx: 0, dy: 0, amt: 0 };
        this.ambient_tilt = 0.2;
        this.states.collide.can = true;
        this.states.hover.can = true;
        this.states.drag.can = true;
        this.states.click.can = true;
        this.playing_card = this.params.playing_card;
        G.sort_id = (G.sort_id || 0) + 1;
        this.sort_id = G.sort_id;
        if (this.params.viewed_back) {
            this.back = "viewed_back";
        }
        else {
            this.back = "selected_back";
        }
        this.bypass_discovery_center = this.params.bypass_discovery_center;
        this.bypass_discovery_ui = this.params.bypass_discovery_ui;
        this.bypass_lock = this.params.bypass_lock;
        this.no_ui = this.config.card && this.config.card.no_ui;
        this.children = {};
        this.base_cost = 0;
        this.extra_cost = 0;
        this.cost = 0;
        this.sell_cost = 0;
        this.sell_cost_label = 0;
        this.children.shadow = Moveable(0, 0, 0, 0);
        this.unique_val = 1 - this.ID / 1603301;
        this.edition = undefined;
        this.zoom = true;
        this.set_ability(center, true);
        this.set_base(card, true);
        this.discard_pos = { r: 0, x: 0, y: 0 };
        this.facing = "front";
        this.sprite_facing = "front";
        this.flipping = undefined;
        this.area = undefined;
        this.highlighted = false;
        this.click_timeout = 0.3;
        this.T.scale = 0.95;
        this.debuff = false;
        this.rank = undefined;
        this.added_to_deck = undefined;
        if (this.children.front) {
            this.children.front.VT.w = 0;
        }
        this.children.back.VT.w = 0;
        this.children.center.VT.w = 0;
        if (this.children.front) {
            this.children.front.parent = this;
            this.children.front.layered_parallax = undefined;
        }
        this.children.back.parent = this;
        this.children.back.layered_parallax = undefined;
        this.children.center.parent = this;
        this.children.center.layered_parallax = undefined;
        this.set_cost();
        if (this instanceof Card) {
            table.insert(G.I.CARD, this);
        }
    }
    update_alert() {
        if (this.ability.set === "Default" && this.config.center && this.config.center.key === "c_base" && this.seal) {
            if (G.P_SEALS[this.seal].alerted && this.children.alert) {
                this.children.alert.remove();
                this.children.alert = undefined;
            }
            else if (!G.P_SEALS[this.seal].alerted && !this.children.alert && G.P_SEALS[this.seal].discovered) {
                this.children.alert = new UIBox({ definition: create_UIBox_card_alert(), config: { align: "tli", offset: { x: 0.1, y: 0.1 }, parent: this } });
            }
        }
        if (this.ability.set === "Joker" || this.ability.set === "Voucher" || this.ability.consumeable || this.ability.set === "Edition" || this.ability.set === "Booster") {
            if (this.area && this.area.config.collection && this.config.center) {
                if (this.config.center.alerted && this.children.alert) {
                    this.children.alert.remove();
                    this.children.alert = undefined;
                }
                else if (!this.config.center.alerted && !this.children.alert && this.config.center.discovered) {
                    this.children.alert = new UIBox({ definition: create_UIBox_card_alert(), config: { align: this.ability.set === "Voucher" && this.config.center.order % 2 === 1 && "tli" || "tri", offset: { x: this.ability.set === "Voucher" && this.config.center.order % 2 === 1 && 0.1 || -0.1, y: 0.1 }, parent: this } });
                }
            }
        }
    };
    set_base(card, initial) {
        card = card || {};
        this.config.card = card;
        for (const [k, v] of pairs(G.P_CARDS)) {
            if (card === v) {
                this.config.card_key = k;
            }
        }
        if (next(card)) {
            this.set_sprites(undefined, card);
        }
        let suit_base_nominal_original = undefined;
        if (this.base && this.base.suit_nominal_original) {
            suit_base_nominal_original = this.base.suit_nominal_original;
        }
        this.base = { name: this.config.card.name, suit: this.config.card.suit, value: this.config.card.value, nominal: 0, suit_nominal: 0, face_nominal: 0, colour: G.C.SUITS[this.config.card.suit], times_played: 0 };
        let rank = SMODS.Ranks[this.base.value] || {};
        this.base.nominal = rank.nominal || 0;
        this.base.face_nominal = rank.face_nominal || 0;
        this.base.id = rank.id;
        if (initial) {
            this.base.original_value = this.base.value;
        }
        let suit = SMODS.Suits[this.base.suit] || {};
        this.base.suit_nominal = suit.suit_nominal || 0;
        this.base.suit_nominal_original = suit_base_nominal_original || suit.suit_nominal || 0;
        if (!initial) {
            G.GAME.blind.debuff_card(this);
        }
        if (this.playing_card && !initial) {
            check_for_unlock({ type: "modify_deck" });
        }
    };
    set_sprites(_center, _front) {
        if (_front) {
            let [_atlas, _pos] = get_front_spriteinfo(_front);
            if (this.children.front) {
                this.children.front.atlas = _atlas;
                this.children.front.set_sprite_pos(_pos);
            }
            else {
                this.children.front = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, _atlas, _pos);
                this.children.front.states.hover = this.states.hover;
                this.children.front.states.click = this.states.click;
                this.children.front.states.drag = this.states.drag;
                this.children.front.states.collide.can = false;
                this.children.front.set_role({ major: this, role_type: "Glued", draw_major: this });
            }
        }
        if (_center) {
            if (_center.set) {
                if (this.children.center) {
                    this.children.center.atlas = G.ASSET_ATLAS[_center.atlas || (_center.set === "Joker" || _center.consumeable || _center.set === "Voucher") && _center.set || "centers"];
                    this.children.center.set_sprite_pos(_center.pos);
                }
                else {
                    if (_center.set === "Joker" && !_center.unlocked && !this.params.bypass_discovery_center) {
                        this.children.center = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS["Joker"], G.j_locked.pos);
                    }
                    else if (this.config.center.set === "Voucher" && !this.config.center.unlocked && !this.params.bypass_discovery_center) {
                        this.children.center = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS["Voucher"], G.v_locked.pos);
                    }
                    else if (this.config.center.consumeable && this.config.center.demo) {
                        this.children.center = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS["Tarot"], G.c_locked.pos);
                    }
                    else if (!this.params.bypass_discovery_center && (_center.set === "Edition" || _center.set === "Joker" || _center.consumeable || _center.set === "Voucher" || _center.set === "Booster") && !_center.discovered) {
                        this.children.center = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS[_center.undiscovered && (_center.undiscovered[G.SETTINGS.colourblind_option && "hc_atlas" || "lc_atlas"] || _center.undiscovered.atlas) || SMODS.UndiscoveredSprites[_center.set] && (SMODS.UndiscoveredSprites[_center.set][G.SETTINGS.colourblind_option && "hc_atlas" || "lc_atlas"] || SMODS.UndiscoveredSprites[_center.set].atlas) || _center.set] || G.ASSET_ATLAS["Joker"], _center.undiscovered && _center.undiscovered.pos || SMODS.UndiscoveredSprites[_center.set] && SMODS.UndiscoveredSprites[_center.set].pos || _center.set === "Joker" && G.j_undiscovered.pos || _center.set === "Edition" && G.j_undiscovered.pos || _center.set === "Tarot" && G.t_undiscovered.pos || _center.set === "Planet" && G.p_undiscovered.pos || _center.set === "Spectral" && G.s_undiscovered.pos || _center.set === "Voucher" && G.v_undiscovered.pos || _center.set === "Booster" && G.booster_undiscovered.pos || G.j_undiscovered.pos);
                    }
                    else if (_center.set === "Joker" || _center.consumeable || _center.set === "Voucher") {
                        this.children.center = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS[_center[G.SETTINGS.colourblind_option && "hc_atlas" || "lc_atlas"] || _center.atlas || _center.set], this.config.center.pos);
                    }
                    else {
                        this.children.center = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS[_center.atlas || "centers"], _center.pos);
                    }
                    this.children.center.states.hover = this.states.hover;
                    this.children.center.states.click = this.states.click;
                    this.children.center.states.drag = this.states.drag;
                    this.children.center.states.collide.can = false;
                    this.children.center.set_role({ major: this, role_type: "Glued", draw_major: this });
                }
                if (_center.name === "Half Joker" && (_center.discovered || this.bypass_discovery_center)) {
                    this.children.center.scale.y = this.children.center.scale.y / 1.7;
                }
                if (_center.name === "Photograph" && (_center.discovered || this.bypass_discovery_center)) {
                    this.children.center.scale.y = this.children.center.scale.y / 1.2;
                }
                if (_center.name === "Square Joker" && (_center.discovered || this.bypass_discovery_center)) {
                    this.children.center.scale.y = this.children.center.scale.x;
                }
                if (_center.pixel_size && _center.pixel_size.h && (_center.discovered || this.bypass_discovery_center)) {
                    this.children.center.scale.y = this.children.center.scale.y * (_center.pixel_size.h / 95);
                }
                if (_center.pixel_size && _center.pixel_size.w && (_center.discovered || this.bypass_discovery_center)) {
                    this.children.center.scale.x = this.children.center.scale.x * (_center.pixel_size.w / 71);
                }
            }
            if (_center.soul_pos) {
                this.children.floating_sprite = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS[_center[G.SETTINGS.colourblind_option && "hc_atlas" || "lc_atlas"] || _center.atlas || _center.set], this.config.center.soul_pos);
                this.children.floating_sprite.role.draw_major = this;
                this.children.floating_sprite.states.hover.can = false;
                this.children.floating_sprite.states.click.can = false;
            }
            if (_center.set_sprites && type(_center.set_sprites) === "function") {
                _center.set_sprites(this, _front);
            }
            if (true) {
                this.children.back = Sprite(this.T.x, this.T.y, this.T.w, this.T.h, G.ASSET_ATLAS[(G.GAME.viewed_back || G.GAME.selected_back) && ((G.GAME.viewed_back || G.GAME.selected_back)[G.SETTINGS.colourblind_option && "hc_atlas" || "lc_atlas"] || (G.GAME.viewed_back || G.GAME.selected_back).atlas) || "centers"], this.params.bypass_back || (this.playing_card && G.GAME[this.back].pos || G.P_CENTERS["b_red"].pos));
                this.children.back.states.hover = this.states.hover;
                this.children.back.states.click = this.states.click;
                this.children.back.states.drag = this.states.drag;
                this.children.back.states.collide.can = false;
                this.children.back.set_role({ major: this, role_type: "Glued", draw_major: this });
            }
        }
    };
    set_ability(center, initial, delay_sprites) {
        let [X, Y, W, H] = [this.T.x, this.T.y, this.T.w, this.T.h];
        let old_center = this.config.center;
        if (old_center && !next(SMODS.find_card(old_center.key, true))) {
            G.GAME.used_jokers[old_center.key] = undefined;
        }
        if (this.added_to_deck && old_center && !this.debuff) {
            this.remove_from_deck();
            this.added_to_deck = true;
        }
        this.config.center = center;
        this.sticker_run = undefined;
        for (const [k, v] of pairs(G.P_CENTERS)) {
            if (center === v) {
                this.config.center_key = k;
            }
        }
        if (this.params.discover && !center.discovered) {
            unlock_card(center);
            discover_card(center);
        }
        if (center.name === "Half Joker" && (center.discovered || this.bypass_discovery_center)) {
            H = H / 1.7;
            this.T.h = H;
        }
        if (center.name === "Photograph" && (center.discovered || this.bypass_discovery_center)) {
            H = H / 1.2;
            this.T.h = H;
        }
        if (center.name === "Square Joker" && (center.discovered || this.bypass_discovery_center)) {
            H = W;
            this.T.h = H;
        }
        if (center.name === "Wee Joker" && (center.discovered || this.bypass_discovery_center)) {
            H = H * 0.7;
            W = W * 0.7;
            this.T.h = H;
            this.T.w = W;
        }
        if (center.display_size && center.display_size.h && (center.discovered || this.bypass_discovery_center)) {
            H = H * (center.display_size.h / 95);
            this.T.h = H;
        }
        else if (center.pixel_size && center.pixel_size.h && (center.discovered || this.bypass_discovery_center)) {
            H = H * (center.pixel_size.h / 95);
            this.T.h = H;
        }
        if (center.display_size && center.display_size.w && (center.discovered || this.bypass_discovery_center)) {
            W = W * (center.display_size.w / 71);
            this.T.w = W;
        }
        else if (center.pixel_size && center.pixel_size.w && (center.discovered || this.bypass_discovery_center)) {
            W = W * (center.pixel_size.w / 71);
            this.T.w = W;
        }
        if (delay_sprites) {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    if (!this.REMOVED) {
                        this.set_sprites(center);
                    }
                    return true;
                } }));
        }
        else {
            this.set_sprites(center);
        }
        if (this.ability && old_center && old_center.config.bonus) {
            this.ability.bonus = this.ability.bonus - old_center.config.bonus;
        }
        let new_ability = { name: center.name, effect: center.effect, set: center.set, mult: center.config.mult || 0, h_mult: center.config.h_mult || 0, h_x_mult: center.config.h_x_mult || 0, h_dollars: center.config.h_dollars || 0, p_dollars: center.config.p_dollars || 0, t_mult: center.config.t_mult || 0, t_chips: center.config.t_chips || 0, x_mult: center.config.Xmult || 1, h_size: center.config.h_size || 0, d_size: center.config.d_size || 0, extra: copy_table(center.config.extra) || undefined, extra_value: 0, type: center.config.type || "", order: center.order || undefined, forced_selection: this.ability && this.ability.forced_selection || undefined, perma_bonus: this.ability && this.ability.perma_bonus || 0 };
        this.ability = this.ability || {};
        new_ability.extra_value = undefined;
        this.ability.extra_value = this.ability.extra_value || 0;
        for (const [k, v] of pairs(new_ability)) {
            this.ability[k] = v;
        }
        let reset_keys = ["name", "effect", "set", "extra", "played_this_ante"];
        for (const [_, mod] of ipairs(SMODS.mod_list)) {
            if (mod.set_ability_reset_keys) {
                let keys = mod.set_ability_reset_keys();
                for (const [_, v] of pairs(keys)) {
                    table.insert(reset_keys, v);
                }
            }
        }
        for (const [_, k] of ipairs(reset_keys)) {
            this.ability[k] = new_ability[k];
        }
        this.ability.bonus = (this.ability.bonus || 0) + (center.config.bonus || 0);
        if (!this.ability.name) {
            this.ability.name = center.key;
        }
        for (const [k, v] of pairs(center.config)) {
            if (k !== "bonus") {
                if (type(v) === "table") {
                    this.ability[k] = copy_table(v);
                }
                else {
                    this.ability[k] = v;
                }
            }
        }
        if (center.consumeable) {
            this.ability.consumeable = center.config;
        }
        if (this.ability.name === "Gold Card" && this.seal === "Gold" && this.playing_card) {
            check_for_unlock({ type: "double_gold" });
        }
        if (this.ability.name === "Invisible Joker") {
            this.ability.invis_rounds = 0;
        }
        if (this.ability.name === "To Do List") {
            let _poker_hands = {};
            for (const [k, v] of pairs(G.GAME.hands)) {
                if (v.visible) {
                    _poker_hands[_poker_hands.length + 1] = k;
                }
            }
            let old_hand = this.ability.to_do_poker_hand;
            this.ability.to_do_poker_hand = undefined;
            while (!this.ability.to_do_poker_hand) {
                this.ability.to_do_poker_hand = pseudorandom_element(_poker_hands, pseudoseed(this.area && this.area.config.type === "title" && "false_to_do" || "to_do"));
                if (this.ability.to_do_poker_hand === old_hand) {
                    this.ability.to_do_poker_hand = undefined;
                }
            }
        }
        if (this.ability.name === "Caino") {
            this.ability.caino_xmult = 1;
        }
        if (this.ability.name === "Yorick") {
            this.ability.yorick_discards = this.ability.extra.discards;
        }
        if (this.ability.name === "Loyalty Card") {
            this.ability.burnt_hand = 0;
            this.ability.loyalty_remaining = this.ability.extra.every;
        }
        this.base_cost = center.cost || 1;
        this.ability.hands_played_at_create = G.GAME && G.GAME.hands_played || 0;
        this.label = center.label || this.config.card && this.config.card.label || this.ability.set;
        if (this.ability.set === "Joker") {
            this.label = this.ability.name;
        }
        if (this.ability.set === "Edition") {
            this.label = this.ability.name;
        }
        if (this.ability.consumeable) {
            this.label = this.ability.name;
        }
        if (this.ability.set === "Voucher") {
            this.label = this.ability.name;
        }
        if (this.ability.set === "Booster") {
            this.label = this.ability.name;
            this.mouse_damping = 1.5;
        }
        let obj = this.config.center;
        if (obj.set_ability && type(obj.set_ability) === "function") {
            obj.set_ability(this, initial, delay_sprites);
        }
        if (!G.OVERLAY_MENU) {
            if (this.config.center.key) {
                G.GAME.used_jokers[this.config.center.key] = true;
            }
        }
        if (G.jokers && this.area === G.jokers) {
            check_for_unlock({ type: "modify_jokers" });
        }
        if (this.added_to_deck && old_center && !this.debuff) {
            this.added_to_deck = false;
            this.add_to_deck();
        }
        if (G.consumeables && this.area === G.consumeables) {
            check_for_unlock({ type: "modify_jokers" });
        }
        if (!initial) {
            G.GAME.blind.debuff_card(this);
        }
        if (this.playing_card && !initial) {
            check_for_unlock({ type: "modify_deck" });
        }
    };
    set_cost() {
        this.extra_cost = 0 + G.GAME.inflation;
        if (this.edition) {
            for (const [k, v] of pairs(G.P_CENTER_POOLS.Edition)) {
                if (this.edition[v.key.sub(3)]) {
                    if (v.extra_cost) {
                        this.extra_cost = this.extra_cost + v.extra_cost;
                    }
                }
            }
        }
        this.cost = math.max(1, math.floor((this.base_cost + this.extra_cost + 0.5) * (100 - G.GAME.discount_percent) / 100));
        if (this.ability.set === "Booster" && G.GAME.modifiers.booster_ante_scaling) {
            this.cost = this.cost + G.GAME.round_resets.ante - 1;
        }
        if (this.ability.set === "Booster" && !G.SETTINGS.tutorial_complete && G.SETTINGS.tutorial_progress && !G.SETTINGS.tutorial_progress.completed_parts["shop_1"]) {
            this.cost = this.cost + 3;
        }
        if ((this.ability.set === "Planet" || this.ability.set === "Booster" && this.ability.name.find("Celestial")) && find_joker("Astronomer").length > 0) {
            this.cost = 0;
        }
        if (this.ability.rental) {
            this.cost = 1;
        }
        this.sell_cost = math.max(1, math.floor(this.cost / 2)) + (this.ability.extra_value || 0);
        if (this.area && this.ability.couponed && (this.area === G.shop_jokers || this.area === G.shop_booster)) {
            this.cost = 0;
        }
        this.sell_cost_label = this.facing === "back" && "?" || this.sell_cost;
    };
    set_edition(edition, immediate, silent) {
        this.edition = undefined;
        if (!edition) {
            return;
        }
        if (edition.holo) {
            if (!this.edition) {
                this.edition = {};
            }
            this.edition.mult = G.P_CENTERS.e_holo.config.extra;
            this.edition.holo = true;
            this.edition.type = "holo";
        }
        else if (edition.foil) {
            if (!this.edition) {
                this.edition = {};
            }
            this.edition.chips = G.P_CENTERS.e_foil.config.extra;
            this.edition.foil = true;
            this.edition.type = "foil";
        }
        else if (edition.polychrome) {
            if (!this.edition) {
                this.edition = {};
            }
            this.edition.x_mult = G.P_CENTERS.e_polychrome.config.extra;
            this.edition.polychrome = true;
            this.edition.type = "polychrome";
        }
        else if (edition.negative) {
            if (!this.edition) {
                this.edition = {};
                if (this.added_to_deck) {
                    if (this.ability.consumeable) {
                        G.consumeables.config.card_limit = G.consumeables.config.card_limit + 1;
                    }
                    else {
                        G.jokers.config.card_limit = G.jokers.config.card_limit + 1;
                    }
                }
            }
            this.edition.negative = true;
            this.edition.type = "negative";
        }
        if (this.area && this.area === G.jokers) {
            if (this.edition) {
                if (!G.P_CENTERS["e_" + this.edition.type].discovered) {
                    discover_card(G.P_CENTERS["e_" + this.edition.type]);
                }
            }
            else {
                if (!G.P_CENTERS["e_base"].discovered) {
                    discover_card(G.P_CENTERS["e_base"]);
                }
            }
        }
        if (this.edition && !silent) {
            G.CONTROLLER.locks.edition = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: !immediate && 0.2 || 0, blockable: !immediate, func: function () {
                    this.juice_up(1, 0.5);
                    if (this.edition.foil) {
                        play_sound("foil1", 1.2, 0.4);
                    }
                    if (this.edition.holo) {
                        play_sound("holo1", 1.2 * 1.58, 0.4);
                    }
                    if (this.edition.polychrome) {
                        play_sound("polychrome1", 1.2, 0.7);
                    }
                    if (this.edition.negative) {
                        play_sound("negative", 1.5, 0.4);
                    }
                    return true;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                    G.CONTROLLER.locks.edition = false;
                    return true;
                } }));
        }
        if (G.jokers && this.area === G.jokers) {
            check_for_unlock({ type: "modify_jokers" });
        }
        this.set_cost();
    };
    set_seal(_seal, silent, immediate) {
        this.seal = undefined;
        if (_seal) {
            this.seal = _seal;
            this.ability.seal = {};
            for (const [k, v] of pairs(G.P_SEALS[_seal].config || {})) {
                if (type(v) === "table") {
                    this.ability.seal[k] = copy_table(v);
                }
                else {
                    this.ability.seal[k] = v;
                }
            }
            if (!silent) {
                G.CONTROLLER.locks.seal = true;
                let sound = G.P_SEALS[_seal].sound || { sound: "gold_seal", per: 1.2, vol: 0.4 };
                if (immediate) {
                    this.juice_up(0.3, 0.3);
                    play_sound(sound.sound, sound.per, sound.vol);
                    G.CONTROLLER.locks.seal = false;
                }
                else {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, func: function () {
                            this.juice_up(0.3, 0.3);
                            play_sound(sound.sound, sound.per, sound.vol);
                            return true;
                        } }));
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.15, func: function () {
                            G.CONTROLLER.locks.seal = false;
                            return true;
                        } }));
                }
            }
        }
        if (this.ability.name === "Gold Card" && this.seal === "Gold" && this.playing_card) {
            check_for_unlock({ type: "double_gold" });
        }
        this.set_cost();
    };
    get_seal(bypass_debuff) {
        if (this.debuff && !bypass_debuff) {
            return;
        }
        return this.seal;
    };
    set_eternal(_eternal) {
        this.ability.eternal = undefined;
        if (this.config.center.eternal_compat && !this.ability.perishable) {
            this.ability.eternal = _eternal;
        }
    };
    set_perishable(_perishable) {
        this.ability.perishable = undefined;
        if (this.config.center.perishable_compat && !this.ability.eternal) {
            this.ability.perishable = true;
            this.ability.perish_tally = G.GAME.perishable_rounds;
        }
    };
    set_rental(_rental) {
        this.ability.rental = _rental;
        this.set_cost();
    };
    set_debuff(should_debuff) {
        for (const [_, mod] of ipairs(SMODS.mod_list)) {
            if (mod.set_debuff && type(mod.set_debuff) === "function") {
                let res = mod.set_debuff(this);
                if (res === "prevent_debuff") {
                    if (this.debuff) {
                        this.debuff = false;
                        if (this.area === G.jokers) {
                            this.add_to_deck(true);
                        }
                        this.debuffed_by_blind = false;
                    }
                    return;
                }
                should_debuff = should_debuff || res;
            }
        }
        for (const [k, v] of pairs(this.ability.debuff_sources || {})) {
            if (v === "prevent_debuff") {
                if (this.debuff) {
                    this.debuff = false;
                    if (this.area === G.jokers) {
                        this.add_to_deck(true);
                    }
                }
                this.debuffed_by_blind = false;
                return;
            }
            should_debuff = should_debuff || v;
        }
        if (this.ability.perishable && this.ability.perish_tally <= 0) {
            if (!this.debuff) {
                this.debuff = true;
                if (this.area === G.jokers) {
                    this.remove_from_deck(true);
                }
            }
            return;
        }
        if (should_debuff !== this.debuff) {
            if (this.area === G.jokers) {
                if (should_debuff) {
                    this.remove_from_deck(true);
                }
                else {
                    this.add_to_deck(true);
                }
            }
            this.debuff = should_debuff;
        }
        if (!this.debuff) {
            this.debuffed_by_blind = false;
        }
    };
    remove_UI() {
        this.ability_UIBox_table = undefined;
        this.config.h_popup = undefined;
        this.config.h_popup_config = undefined;
        this.no_ui = true;
    };
    change_suit(new_suit) {
        let new_code = SMODS.Suits[new_suit].card_key;
        let new_val = SMODS.Ranks[this.base.value].card_key;
        let new_card = G.P_CARDS[new_code + ("_" + new_val)];
        this.set_base(new_card);
        G.GAME.blind.debuff_card(this);
    };
    add_to_deck(from_debuff) {
        if (!this.config.center.discovered) {
            discover_card(this.config.center);
        }
        if (!this.added_to_deck) {
            this.added_to_deck = true;
            if (this.ability.set === "Enhanced" || this.ability.set === "Default") {
                if (this.ability.name === "Gold Card" && this.seal === "Gold" && this.playing_card) {
                    check_for_unlock({ type: "double_gold" });
                }
                return;
            }
            if (this.edition) {
                if (!G.P_CENTERS["e_" + this.edition.type].discovered) {
                    discover_card(G.P_CENTERS["e_" + this.edition.type]);
                }
            }
            else {
                if (!G.P_CENTERS["e_base"].discovered) {
                    discover_card(G.P_CENTERS["e_base"]);
                }
            }
            let obj = this.config.center;
            if (obj && obj.add_to_deck && type(obj.add_to_deck) === "function") {
                obj.add_to_deck(this, from_debuff);
            }
            if (this.ability.h_size !== 0) {
                G.hand.change_size(this.ability.h_size);
            }
            if (this.ability.d_size > 0) {
                G.GAME.round_resets.discards = G.GAME.round_resets.discards + this.ability.d_size;
                ease_discard(this.ability.d_size);
            }
            if (this.ability.name === "Credit Card") {
                G.GAME.bankrupt_at = G.GAME.bankrupt_at - this.ability.extra;
            }
            if (this.ability.name === "Chicot" && G.GAME.blind && G.GAME.blind.boss && !G.GAME.blind.disabled) {
                G.GAME.blind.disable();
                play_sound("timpani");
                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("ph_boss_disabled") });
            }
            if (this.ability.name === "Chaos the Clown") {
                G.GAME.current_round.free_rerolls = G.GAME.current_round.free_rerolls + 1;
                calculate_reroll_cost(true);
            }
            if (this.ability.name === "Turtle Bean") {
                G.hand.change_size(this.ability.extra.h_size);
            }
            if (this.ability.name === "Oops! All 6s") {
                for (const [k, v] of pairs(G.GAME.probabilities)) {
                    G.GAME.probabilities[k] = v * 2;
                }
            }
            if (this.ability.name === "To the Moon") {
                G.GAME.interest_amount = G.GAME.interest_amount + this.ability.extra;
            }
            if (this.ability.name === "Astronomer") {
                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                        for (const [k, v] of pairs(G.I.CARD)) {
                            if (v.set_cost) {
                                v.set_cost();
                            }
                        }
                        return true;
                    } }));
            }
            if (this.ability.name === "Troubadour") {
                G.hand.change_size(this.ability.extra.h_size);
                G.GAME.round_resets.hands = G.GAME.round_resets.hands + this.ability.extra.h_plays;
            }
            if (this.ability.name === "Stuntman") {
                G.hand.change_size(-this.ability.extra.h_size);
            }
            if (true) {
                if (from_debuff) {
                    this.ability.joker_added_to_deck_but_debuffed = undefined;
                }
                else {
                    if (this.edition && this.edition.card_limit) {
                        if (this.ability.consumeable) {
                            G.consumeables.config.card_limit = G.consumeables.config.card_limit + this.edition.card_limit;
                        }
                        else {
                            G.jokers.config.card_limit = G.jokers.config.card_limit + this.edition.card_limit;
                        }
                    }
                }
            }
            if (G.GAME.blind && G.GAME.blind.in_blind) {
                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                        G.GAME.blind.set_blind(undefined, true, undefined);
                        return true;
                    } }));
            }
        }
    };
    remove_from_deck(from_debuff) {
        if (this.added_to_deck) {
            this.added_to_deck = false;
            let obj = this.config.center;
            if (obj && obj.remove_from_deck && type(obj.remove_from_deck) === "function") {
                obj.remove_from_deck(this, from_debuff);
            }
            if (this.ability.h_size !== 0) {
                G.hand.change_size(-this.ability.h_size);
            }
            if (this.ability.d_size > 0) {
                G.GAME.round_resets.discards = G.GAME.round_resets.discards - this.ability.d_size;
                ease_discard(-this.ability.d_size);
            }
            if (this.ability.name === "Credit Card") {
                G.GAME.bankrupt_at = G.GAME.bankrupt_at + this.ability.extra;
            }
            if (this.ability.name === "Chaos the Clown") {
                G.GAME.current_round.free_rerolls = G.GAME.current_round.free_rerolls - 1;
                calculate_reroll_cost(true);
            }
            if (this.ability.name === "Turtle Bean") {
                G.hand.change_size(-this.ability.extra.h_size);
            }
            if (this.ability.name === "Oops! All 6s") {
                for (const [k, v] of pairs(G.GAME.probabilities)) {
                    G.GAME.probabilities[k] = v / 2;
                }
            }
            if (this.ability.name === "To the Moon") {
                G.GAME.interest_amount = G.GAME.interest_amount - this.ability.extra;
            }
            if (this.ability.name === "Astronomer") {
                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                        for (const [k, v] of pairs(G.I.CARD)) {
                            if (v.set_cost) {
                                v.set_cost();
                            }
                        }
                        return true;
                    } }));
            }
            if (this.ability.name === "Troubadour") {
                G.hand.change_size(-this.ability.extra.h_size);
                G.GAME.round_resets.hands = G.GAME.round_resets.hands - this.ability.extra.h_plays;
            }
            if (this.ability.name === "Stuntman") {
                G.hand.change_size(this.ability.extra.h_size);
            }
            if (G.jokers) {
                if (from_debuff) {
                    this.ability.joker_added_to_deck_but_debuffed = true;
                }
                else {
                    if (this.edition && this.edition.card_limit) {
                        if (this.ability.consumeable) {
                            G.consumeables.config.card_limit = G.consumeables.config.card_limit - this.edition.card_limit;
                        }
                        else if (this.ability.set === "Joker") {
                            G.jokers.config.card_limit = G.jokers.config.card_limit - this.edition.card_limit;
                        }
                    }
                }
            }
            if (G.GAME.blind && G.GAME.blind.in_blind) {
                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                        G.GAME.blind.set_blind(undefined, true, undefined);
                        return true;
                    } }));
            }
        }
    };
    generate_UIBox_unlock_table(hidden) {
        let loc_vars = { no_name: true, not_hidden: !hidden };
        return generate_card_ui(this.config.center, undefined, loc_vars, "Locked");
    };
    generate_UIBox_ability_table(vars_only) {
        let [card_type, hide_desc] = [this.ability.set || "None", undefined];
        let loc_vars = undefined;
        let [main_start, main_end] = [undefined, undefined];
        let no_badge = undefined;
        if (!this.bypass_lock && this.config.center.unlocked !== false && (this.ability.set === "Joker" || this.ability.set === "Edition" || this.ability.consumeable || this.ability.set === "Voucher" || this.ability.set === "Booster") && !this.config.center.discovered && (this.area !== G.jokers && this.area !== G.consumeables && this.area || !this.area)) {
            card_type = "Undiscovered";
        }
        if (this.config.center.unlocked === false && !this.bypass_lock) {
            card_type = "Locked";
            if (this.area && this.area === G.shop_demo) {
                loc_vars = {};
                no_badge = true;
            }
        }
        else if (card_type === "Undiscovered" && !this.bypass_discovery_ui) {
            hide_desc = true;
        }
        else if (this.debuff) {
            loc_vars = { debuffed: true, playing_card: !!this.base.colour, value: this.base.value, suit: this.base.suit, colour: this.base.colour };
        }
        else if (card_type === "Default" || card_type === "Enhanced") {
            loc_vars = { playing_card: !!this.base.colour, value: this.base.value, suit: this.base.suit, colour: this.base.colour, nominal_chips: this.base.nominal > 0 && this.base.nominal || undefined, bonus_chips: this.ability.bonus + (this.ability.perma_bonus || 0) > 0 && this.ability.bonus + (this.ability.perma_bonus || 0) || undefined };
        }
        else if (this.ability.set === "Joker") {
            if (this.ability.name === "Joker") {
                loc_vars = [this.ability.mult];
            }
            else if (this.ability.name === "Jolly Joker" || this.ability.name === "Zany Joker" || this.ability.name === "Mad Joker" || this.ability.name === "Crazy Joker" || this.ability.name === "Droll Joker") {
                loc_vars = [this.ability.t_mult, localize(this.ability.type, "poker_hands")];
            }
            else if (this.ability.name === "Sly Joker" || this.ability.name === "Wily Joker" || this.ability.name === "Clever Joker" || this.ability.name === "Devious Joker" || this.ability.name === "Crafty Joker") {
                loc_vars = [this.ability.t_chips, localize(this.ability.type, "poker_hands")];
            }
            else if (this.ability.name === "Half Joker") {
                loc_vars = [this.ability.extra.mult, this.ability.extra.size];
            }
            else if (this.ability.name === "Fortune Teller") {
                loc_vars = [this.ability.extra, G.GAME.consumeable_usage_total && G.GAME.consumeable_usage_total.tarot || 0];
            }
            else if (this.ability.name === "Steel Joker") {
                loc_vars = [this.ability.extra, 1 + this.ability.extra * (this.ability.steel_tally || 0)];
            }
            else if (this.ability.name === "Chaos the Clown") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Space Joker") {
                loc_vars = ["" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra];
            }
            else if (this.ability.name === "Stone Joker") {
                loc_vars = [this.ability.extra, this.ability.extra * (this.ability.stone_tally || 0)];
            }
            else if (this.ability.name === "Drunkard") {
                loc_vars = [this.ability.d_size];
            }
            else if (this.ability.name === "Green Joker") {
                loc_vars = [this.ability.extra.hand_add, this.ability.extra.discard_sub, this.ability.mult];
            }
            else if (this.ability.name === "Credit Card") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Greedy Joker" || this.ability.name === "Lusty Joker" || this.ability.name === "Wrathful Joker" || this.ability.name === "Gluttonous Joker") {
                loc_vars = [this.ability.extra.s_mult, localize(this.ability.extra.suit, "suits_singular")];
            }
            else if (this.ability.name === "Blue Joker") {
                loc_vars = [this.ability.extra, this.ability.extra * (G.deck && G.deck.cards && G.deck.cards.length || 52)];
            }
            else if (this.ability.name === "Sixth Sense") {
                loc_vars = {};
            }
            else if (this.ability.name === "Mime") { }
            else if (this.ability.name === "Hack") {
                loc_vars = [this.ability.extra + 1];
            }
            else if (this.ability.name === "Pareidolia") { }
            else if (this.ability.name === "Faceless Joker") {
                loc_vars = [this.ability.extra.dollars, this.ability.extra.faces];
            }
            else if (this.ability.name === "Oops! All 6s") { }
            else if (this.ability.name === "Juggler") {
                loc_vars = [this.ability.h_size];
            }
            else if (this.ability.name === "Golden Joker") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Joker Stencil") {
                loc_vars = [this.ability.x_mult];
            }
            else if (this.ability.name === "Four Fingers") { }
            else if (this.ability.name === "Ceremonial Dagger") {
                loc_vars = [this.ability.mult];
            }
            else if (this.ability.name === "Banner") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Misprint") {
                let r_mults = {};
                for (let i = this.ability.extra.min; i <= this.ability.extra.max; i++) {
                    r_mults[r_mults.length + 1] = tostring(i);
                }
                let loc_mult = " " + (localize("k_mult") + " ");
                main_start = [{ n: G.UIT.T, config: { text: "  +", colour: G.C.MULT, scale: 0.32 } }, { n: G.UIT.O, config: { object: new DynaText({ string: r_mults, colours: [G.C.RED], pop_in_rate: 9999999, silent: true, random_element: true, pop_delay: 0.5, scale: 0.32, min_cycle_time: 0 }) } }, { n: G.UIT.O, config: { object: new DynaText({ string: [{ string: "rand()", colour: G.C.JOKER_GREY }, { string: "#@" + ((G.deck && G.deck.cards[1] && G.deck.cards[G.deck.cards.length].base.id || 11) + (G.deck && G.deck.cards[1] && G.deck.cards[G.deck.cards.length].base.suit.sub(1, 1) || "D")), colour: G.C.RED }, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult, loc_mult], colours: [G.C.UI.TEXT_DARK], pop_in_rate: 9999999, silent: true, random_element: true, pop_delay: 0.2011, scale: 0.32, min_cycle_time: 0 }) } }];
            }
            else if (this.ability.name === "Mystic Summit") {
                loc_vars = [this.ability.extra.mult, this.ability.extra.d_remaining];
            }
            else if (this.ability.name === "Marble Joker") { }
            else if (this.ability.name === "Loyalty Card") {
                loc_vars = [this.ability.extra.Xmult, this.ability.extra.every + 1, localize({ type: "variable", key: this.ability.loyalty_remaining === 0 && "loyalty_active" || "loyalty_inactive", vars: [this.ability.loyalty_remaining] })];
            }
            else if (this.ability.name === "8 Ball") {
                loc_vars = ["" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra];
            }
            else if (this.ability.name === "Dusk") {
                loc_vars = [this.ability.extra + 1];
            }
            else if (this.ability.name === "Raised Fist") { }
            else if (this.ability.name === "Fibonacci") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Scary Face") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Abstract Joker") {
                loc_vars = [this.ability.extra, (G.jokers && G.jokers.cards && G.jokers.cards.length || 0) * this.ability.extra];
            }
            else if (this.ability.name === "Delayed Gratification") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Gros Michel") {
                loc_vars = [this.ability.extra.mult, "" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra.odds];
            }
            else if (this.ability.name === "Even Steven") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Odd Todd") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Scholar") {
                loc_vars = [this.ability.extra.mult, this.ability.extra.chips];
            }
            else if (this.ability.name === "Business Card") {
                loc_vars = ["" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra];
            }
            else if (this.ability.name === "Supernova") { }
            else if (this.ability.name === "Spare Trousers") {
                loc_vars = [this.ability.extra, localize("Two Pair", "poker_hands"), this.ability.mult];
            }
            else if (this.ability.name === "Superposition") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Ride the Bus") {
                loc_vars = [this.ability.extra, this.ability.mult];
            }
            else if (this.ability.name === "Egg") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Burglar") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Blackboard") {
                loc_vars = [this.ability.extra, localize("Spades", "suits_plural"), localize("Clubs", "suits_plural")];
            }
            else if (this.ability.name === "Runner") {
                loc_vars = [this.ability.extra.chips, this.ability.extra.chip_mod];
            }
            else if (this.ability.name === "Ice Cream") {
                loc_vars = [this.ability.extra.chips, this.ability.extra.chip_mod];
            }
            else if (this.ability.name === "DNA") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Splash") { }
            else if (this.ability.name === "Constellation") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Hiker") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "To Do List") {
                loc_vars = [this.ability.extra.dollars, localize(this.ability.to_do_poker_hand, "poker_hands")];
            }
            else if (this.ability.name === "Smeared Joker") { }
            else if (this.ability.name === "Blueprint") {
                this.ability.blueprint_compat_ui = this.ability.blueprint_compat_ui || "";
                this.ability.blueprint_compat_check = undefined;
                main_end = this.area && this.area === G.jokers && [{ n: G.UIT.C, config: { align: "bm", minh: 0.4 }, nodes: [{ n: G.UIT.C, config: { ref_table: this, align: "m", colour: G.C.JOKER_GREY, r: 0.05, padding: 0.06, func: "blueprint_compat" }, nodes: [{ n: G.UIT.T, config: { ref_table: this.ability, ref_value: "blueprint_compat_ui", colour: G.C.UI.TEXT_LIGHT, scale: 0.32 * 0.8 } }] }] }] || undefined;
            }
            else if (this.ability.name === "Cartomancer") { }
            else if (this.ability.name === "Astronomer") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Golden Ticket") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Mr. Bones") { }
            else if (this.ability.name === "Acrobat") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Sock and Buskin") {
                loc_vars = [this.ability.extra + 1];
            }
            else if (this.ability.name === "Swashbuckler") {
                loc_vars = [this.ability.mult];
            }
            else if (this.ability.name === "Troubadour") {
                loc_vars = [this.ability.extra.h_size, -this.ability.extra.h_plays];
            }
            else if (this.ability.name === "Certificate") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Throwback") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Hanging Chad") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Rough Gem") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Bloodstone") {
                loc_vars = ["" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra.odds, this.ability.extra.Xmult];
            }
            else if (this.ability.name === "Arrowhead") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Onyx Agate") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Glass Joker") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Showman") { }
            else if (this.ability.name === "Flower Pot") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Wee Joker") {
                loc_vars = [this.ability.extra.chips, this.ability.extra.chip_mod];
            }
            else if (this.ability.name === "Merry Andy") {
                loc_vars = [this.ability.d_size, this.ability.h_size];
            }
            else if (this.ability.name === "The Idol") {
                loc_vars = { [1]: this.ability.extra, [2]: localize(G.GAME.current_round.idol_card.rank, "ranks"), [3]: localize(G.GAME.current_round.idol_card.suit, "suits_plural"), colours: [G.C.SUITS[G.GAME.current_round.idol_card.suit]] };
            }
            else if (this.ability.name === "Seeing Double") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Matador") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Hit the Road") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "The Duo" || this.ability.name === "The Trio" || this.ability.name === "The Family" || this.ability.name === "The Order" || this.ability.name === "The Tribe") {
                loc_vars = [this.ability.x_mult, localize(this.ability.type, "poker_hands")];
            }
            else if (this.ability.name === "Cavendish") {
                loc_vars = [this.ability.extra.Xmult, "" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra.odds];
            }
            else if (this.ability.name === "Card Sharp") {
                loc_vars = [this.ability.extra.Xmult];
            }
            else if (this.ability.name === "Red Card") {
                loc_vars = [this.ability.extra, this.ability.mult];
            }
            else if (this.ability.name === "Madness") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Square Joker") {
                loc_vars = [this.ability.extra.chips, this.ability.extra.chip_mod];
            }
            else if (this.ability.name === "Seance") {
                loc_vars = [localize(this.ability.extra.poker_hand, "poker_hands")];
            }
            else if (this.ability.name === "Riff-raff") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Vampire") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Shortcut") { }
            else if (this.ability.name === "Hologram") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Vagabond") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Baron") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Cloud 9") {
                loc_vars = [this.ability.extra, this.ability.extra * (this.ability.nine_tally || 0)];
            }
            else if (this.ability.name === "Rocket") {
                loc_vars = [this.ability.extra.dollars, this.ability.extra.increase];
            }
            else if (this.ability.name === "Obelisk") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Midas Mask") { }
            else if (this.ability.name === "Luchador") {
                let has_message = G.GAME && this.area && this.area === G.jokers;
                if (has_message) {
                    let disableable = G.GAME.blind && (!G.GAME.blind.disabled && G.GAME.blind.get_type() === "Boss");
                    main_end = [{ n: G.UIT.C, config: { align: "bm", minh: 0.4 }, nodes: [{ n: G.UIT.C, config: { ref_table: this, align: "m", colour: disableable && G.C.GREEN || G.C.RED, r: 0.05, padding: 0.06 }, nodes: [{ n: G.UIT.T, config: { text: " " + (localize(disableable && "k_active" || "ph_no_boss_active") + " "), colour: G.C.UI.TEXT_LIGHT, scale: 0.32 * 0.9 } }] }] }];
                }
            }
            else if (this.ability.name === "Photograph") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Gift Card") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Turtle Bean") {
                loc_vars = [this.ability.extra.h_size, this.ability.extra.h_mod];
            }
            else if (this.ability.name === "Erosion") {
                loc_vars = [this.ability.extra, math.max(0, this.ability.extra * (G.playing_cards && G.GAME.starting_deck_size - G.playing_cards.length || 0)), G.GAME.starting_deck_size];
            }
            else if (this.ability.name === "Reserved Parking") {
                loc_vars = [this.ability.extra.dollars, "" + (G.GAME && G.GAME.probabilities.normal || 1), this.ability.extra.odds];
            }
            else if (this.ability.name === "Mail-In Rebate") {
                loc_vars = [this.ability.extra, localize(G.GAME.current_round.mail_card.rank, "ranks")];
            }
            else if (this.ability.name === "To the Moon") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Hallucination") {
                loc_vars = [G.GAME.probabilities.normal, this.ability.extra];
            }
            else if (this.ability.name === "Lucky Cat") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Baseball Card") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Bull") {
                loc_vars = [this.ability.extra, this.ability.extra * math.max(0, G.GAME.dollars) || 0];
            }
            else if (this.ability.name === "Diet Cola") {
                loc_vars = [localize({ type: "name_text", set: "Tag", key: "tag_double", nodes: {} })];
            }
            else if (this.ability.name === "Trading Card") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Flash Card") {
                loc_vars = [this.ability.extra, this.ability.mult];
            }
            else if (this.ability.name === "Popcorn") {
                loc_vars = [this.ability.mult, this.ability.extra];
            }
            else if (this.ability.name === "Ramen") {
                loc_vars = [this.ability.x_mult, this.ability.extra];
            }
            else if (this.ability.name === "Ancient Joker") {
                loc_vars = { [1]: this.ability.extra, [2]: localize(G.GAME.current_round.ancient_card.suit, "suits_singular"), colours: [G.C.SUITS[G.GAME.current_round.ancient_card.suit]] };
            }
            else if (this.ability.name === "Walkie Talkie") {
                loc_vars = [this.ability.extra.chips, this.ability.extra.mult];
            }
            else if (this.ability.name === "Seltzer") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Castle") {
                loc_vars = { [1]: this.ability.extra.chip_mod, [2]: localize(G.GAME.current_round.castle_card.suit, "suits_singular"), [3]: this.ability.extra.chips, colours: [G.C.SUITS[G.GAME.current_round.castle_card.suit]] };
            }
            else if (this.ability.name === "Smiley Face") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Campfire") {
                loc_vars = [this.ability.extra, this.ability.x_mult];
            }
            else if (this.ability.name === "Stuntman") {
                loc_vars = [this.ability.extra.chip_mod, this.ability.extra.h_size];
            }
            else if (this.ability.name === "Invisible Joker") {
                loc_vars = [this.ability.extra, this.ability.invis_rounds];
            }
            else if (this.ability.name === "Brainstorm") {
                this.ability.blueprint_compat_ui = this.ability.blueprint_compat_ui || "";
                this.ability.blueprint_compat_check = undefined;
                main_end = this.area && this.area === G.jokers && [{ n: G.UIT.C, config: { align: "bm", minh: 0.4 }, nodes: [{ n: G.UIT.C, config: { ref_table: this, align: "m", colour: G.C.JOKER_GREY, r: 0.05, padding: 0.06, func: "blueprint_compat" }, nodes: [{ n: G.UIT.T, config: { ref_table: this.ability, ref_value: "blueprint_compat_ui", colour: G.C.UI.TEXT_LIGHT, scale: 0.32 * 0.8 } }] }] }] || undefined;
            }
            else if (this.ability.name === "Satellite") {
                let planets_used = 0;
                for (const [k, v] of pairs(G.GAME.consumeable_usage)) {
                    if (v.set === "Planet") {
                        planets_used = planets_used + 1;
                    }
                }
                loc_vars = [this.ability.extra, planets_used * this.ability.extra];
            }
            else if (this.ability.name === "Shoot the Moon") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Driver's License") {
                loc_vars = [this.ability.extra, this.ability.driver_tally || "0"];
            }
            else if (this.ability.name === "Burnt Joker") { }
            else if (this.ability.name === "Bootstraps") {
                loc_vars = [this.ability.extra.mult, this.ability.extra.dollars, this.ability.extra.mult * math.floor((G.GAME.dollars + (G.GAME.dollar_buffer || 0)) / this.ability.extra.dollars)];
            }
            else if (this.ability.name === "Caino") {
                loc_vars = [this.ability.extra, this.ability.caino_xmult];
            }
            else if (this.ability.name === "Triboulet") {
                loc_vars = [this.ability.extra];
            }
            else if (this.ability.name === "Yorick") {
                loc_vars = [this.ability.extra.xmult, this.ability.extra.discards, this.ability.yorick_discards, this.ability.x_mult];
            }
            else if (this.ability.name === "Chicot") { }
            else if (this.ability.name === "Perkeo") {
                loc_vars = [this.ability.extra];
            }
        }
        if (vars_only) {
            return [loc_vars, main_start, main_end];
        }
        let badges = {};
        if (card_type !== "Locked" && card_type !== "Undiscovered" && card_type !== "Default" || this.debuff) {
            badges.card_type = card_type;
        }
        if (this.ability.set === "Joker" && this.bypass_discovery_ui && !no_badge) {
            badges.force_rarity = true;
        }
        if (this.edition) {
            if (this.edition.type === "negative" && this.ability.consumeable) {
                badges[badges.length + 1] = "negative_consumable";
            }
            else if (this.edition.type === "negative" && (this.ability.set === "Enhanced" || this.ability.set === "Default")) {
                badges[badges.length + 1] = "negative_playing_card";
            }
            else {
                badges[badges.length + 1] = this.edition.type === "holo" && "holographic" || this.edition.type;
            }
        }
        if (this.seal) {
            badges[badges.length + 1] = string.lower(this.seal) + "_seal";
        }
        if (this.ability.eternal) {
            badges[badges.length + 1] = "eternal";
        }
        if (this.ability.perishable) {
            loc_vars = loc_vars || {};
            loc_vars.perish_tally = this.ability.perish_tally;
            badges[badges.length + 1] = "perishable";
        }
        if (this.ability.rental) {
            badges[badges.length + 1] = "rental";
        }
        if (this.pinned) {
            badges[badges.length + 1] = "pinned_left";
        }
        for (const [k, v] of ipairs(SMODS.Sticker.obj_buffer)) {
            if (this.ability[v] && !SMODS.Stickers[v].hide_badge) {
                badges[badges.length + 1] = v;
            }
        }
        if (this.sticker || this.sticker_run && this.sticker_run !== "NONE" && G.SETTINGS.run_stake_stickers) {
            loc_vars = loc_vars || {};
            loc_vars.sticker = this.sticker || this.sticker_run;
        }
        return generate_card_ui(this.config.center, undefined, loc_vars, card_type, badges, hide_desc, main_start, main_end, this);
    };
    get_nominal(mod) {
        let mult = 1;
        let rank_mult = 1;
        if (mod === "suit") {
            mult = 10000;
        }
        if (this.ability.effect === "Stone Card" || this.config.center.no_suit && this.config.center.no_rank) {
            mult = -10000;
        }
        else if (this.config.center.no_suit) {
            mult = 0;
        }
        else if (this.config.center.no_rank) {
            rank_mult = 0;
        }
        return 10 * this.base.nominal * rank_mult + this.base.suit_nominal * mult + (this.base.suit_nominal_original || 0) * 0.0001 * mult + 10 * this.base.face_nominal * rank_mult + 0.000001 * this.unique_val;
    };
    get_id() {
        if (SMODS.has_no_rank(this) && !this.vampired) {
            return -math.random(100, 1000000);
        }
        return this.base.id;
    };
    is_face(from_boss) {
        if (this.debuff && !from_boss) {
            return;
        }
        let id = this.get_id();
        let rank = SMODS.Ranks[this.base.value];
        if (!id) {
            return;
        }
        if (id > 0 && rank && rank.face || next(find_joker("Pareidolia"))) {
            return true;
        }
    };
    get_original_rank() {
        return this.base.original_value;
    };
    get_chip_bonus() {
        if (this.debuff) {
            return 0;
        }
        if (this.ability.effect === "Stone Card" || this.config.center.replace_base_card) {
            return this.ability.bonus + (this.ability.perma_bonus || 0);
        }
        return this.base.nominal + this.ability.bonus + (this.ability.perma_bonus || 0);
    };
    get_chip_mult() {
        if (this.debuff) {
            return 0;
        }
        if (this.ability.set === "Joker") {
            return 0;
        }
        if (this.ability.effect === "Lucky Card") {
            if (pseudorandom("lucky_mult") < G.GAME.probabilities.normal / 5) {
                this.lucky_trigger = true;
                return this.ability.mult;
            }
            else {
                return 0;
            }
        }
        else {
            return this.ability.mult;
        }
    };
    get_chip_x_mult(context) {
        if (this.debuff) {
            return 0;
        }
        if (this.ability.set === "Joker") {
            return 0;
        }
        if (this.ability.x_mult <= 1) {
            return 0;
        }
        return this.ability.x_mult;
    };
    get_chip_h_mult() {
        if (this.debuff) {
            return 0;
        }
        return this.ability.h_mult;
    };
    get_chip_h_x_mult() {
        if (this.debuff) {
            return 0;
        }
        return this.ability.h_x_mult;
    };
    get_edition() {
        if (this.debuff) {
            return;
        }
        if (this.edition) {
            let ret = { card: this };
            if (this.edition.x_mult) {
                ret.x_mult_mod = this.edition.x_mult;
            }
            if (this.edition.mult) {
                ret.mult_mod = this.edition.mult;
            }
            if (this.edition.chips) {
                ret.chip_mod = this.edition.chips;
            }
            return ret;
        }
    };
    get_end_of_round_effect(context) {
        if (this.debuff) {
            return {};
        }
        let ret = {};
        if (this.ability.h_dollars > 0) {
            ret.h_dollars = this.ability.h_dollars;
            ret.card = this;
        }
        if (this.seal === "Blue" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit && !this.ability.extra_enhancement) {
            let card_type = "Planet";
            G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                    if (G.GAME.last_hand_played) {
                        let _planet = 0;
                        for (const [k, v] of pairs(G.P_CENTER_POOLS.Planet)) {
                            if (v.config.hand_type === G.GAME.last_hand_played) {
                                _planet = v.key;
                            }
                        }
                        let card = create_card(card_type, G.consumeables, undefined, undefined, undefined, undefined, _planet, "blusl");
                        card.add_to_deck();
                        G.consumeables.emplace(card);
                        G.GAME.consumeable_buffer = 0;
                    }
                    return true;
                } }));
            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("k_plus_planet"), colour: G.C.SECONDARY_SET.Planet });
            ret.effect = true;
        }
        return ret;
    };
    get_p_dollars() {
        if (this.debuff) {
            return 0;
        }
        let ret = 0;
        let obj = G.P_SEALS[this.seal] || {};
        if (obj.get_p_dollars && type(obj.get_p_dollars) === "function") {
            ret = ret + obj.get_p_dollars(this);
        }
        else if (this.seal === "Gold") {
            ret = ret + 3;
        }
        if (this.ability.p_dollars > 0) {
            if (this.ability.effect === "Lucky Card") {
                if (pseudorandom("lucky_money") < G.GAME.probabilities.normal / 15) {
                    this.lucky_trigger = true;
                    ret = ret + this.ability.p_dollars;
                }
            }
            else {
                ret = ret + this.ability.p_dollars;
            }
        }
        if (ret > 0) {
            G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + ret;
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.dollar_buffer = 0;
                    return true;
                } }));
        }
        return ret;
    };
    use_consumeable(area, copier) {
        stop_use();
        if (!copier) {
            set_consumeable_usage(this);
        }
        if (this.debuff) {
            return undefined;
        }
        let used_tarot = copier || this;
        if (this.ability.consumeable.max_highlighted) {
            update_hand_text({ immediate: true, nopulse: true, delay: 0 }, { mult: 0, chips: 0, level: "", handname: "" });
        }
        let obj = this.config.center;
        if (obj.use && type(obj.use) === "function") {
            obj.use(this, area, copier);
            return;
        }
        if (this.ability.consumeable.mod_conv || this.ability.consumeable.suit_conv) {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    play_sound("tarot1");
                    used_tarot.juice_up(0.3, 0.5);
                    return true;
                } }));
            for (let i = 1; i <= G.hand.highlighted.length; i++) {
                let percent = 1.15 - (i - 0.999) / (G.hand.highlighted.length - 0.998) * 0.3;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.15, func: function () {
                        G.hand.highlighted[i].flip();
                        play_sound("card1", percent);
                        G.hand.highlighted[i].juice_up(0.3, 0.3);
                        return true;
                    } }));
            }
            delay(0.2);
            if (this.ability.name === "Death") {
                let rightmost = G.hand.highlighted[1];
                for (let i = 1; i <= G.hand.highlighted.length; i++) {
                    if (G.hand.highlighted[i].T.x > rightmost.T.x) {
                        rightmost = G.hand.highlighted[i];
                    }
                }
                for (let i = 1; i <= G.hand.highlighted.length; i++) {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                            if (G.hand.highlighted[i] !== rightmost) {
                                copy_card(rightmost, G.hand.highlighted[i]);
                            }
                            return true;
                        } }));
                }
            }
            else if (this.ability.name === "Strength") {
                for (let i = 1; i <= G.hand.highlighted.length; i++) {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                            let card = G.hand.highlighted[i];
                            let suit_prefix = string.sub(card.base.suit, 1, 1) + "_";
                            let rank_suffix = card.base.id === 14 && 2 || math.min(card.base.id + 1, 14);
                            if (rank_suffix < 10) {
                                rank_suffix = tostring(rank_suffix);
                            }
                            else if (rank_suffix === 10) {
                                rank_suffix = "T";
                            }
                            else if (rank_suffix === 11) {
                                rank_suffix = "J";
                            }
                            else if (rank_suffix === 12) {
                                rank_suffix = "Q";
                            }
                            else if (rank_suffix === 13) {
                                rank_suffix = "K";
                            }
                            else if (rank_suffix === 14) {
                                rank_suffix = "A";
                            }
                            card.set_base(G.P_CARDS[suit_prefix + rank_suffix]);
                            return true;
                        } }));
                }
            }
            else if (this.ability.consumeable.suit_conv) {
                for (let i = 1; i <= G.hand.highlighted.length; i++) {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                            G.hand.highlighted[i].change_suit(this.ability.consumeable.suit_conv);
                            return true;
                        } }));
                }
            }
            else {
                for (let i = 1; i <= G.hand.highlighted.length; i++) {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                            G.hand.highlighted[i].set_ability(G.P_CENTERS[this.ability.consumeable.mod_conv]);
                            return true;
                        } }));
                }
            }
            for (let i = 1; i <= G.hand.highlighted.length; i++) {
                let percent = 0.85 + (i - 0.999) / (G.hand.highlighted.length - 0.998) * 0.3;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.15, func: function () {
                        G.hand.highlighted[i].flip();
                        play_sound("tarot2", percent, 0.6);
                        G.hand.highlighted[i].juice_up(0.3, 0.3);
                        return true;
                    } }));
            }
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                    G.hand.unhighlight_all();
                    return true;
                } }));
            delay(0.5);
        }
        if (this.ability.name === "Black Hole") {
            update_hand_text({ sound: "button", volume: 0.7, pitch: 0.8, delay: 0.3 }, { handname: localize("k_all_hands"), chips: "...", mult: "...", level: "" });
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                    play_sound("tarot1");
                    this.juice_up(0.8, 0.5);
                    G.TAROT_INTERRUPT_PULSE = true;
                    return true;
                } }));
            update_hand_text({ delay: 0 }, { mult: "+", StatusText: true });
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.9, func: function () {
                    play_sound("tarot1");
                    this.juice_up(0.8, 0.5);
                    return true;
                } }));
            update_hand_text({ delay: 0 }, { chips: "+", StatusText: true });
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.9, func: function () {
                    play_sound("tarot1");
                    this.juice_up(0.8, 0.5);
                    G.TAROT_INTERRUPT_PULSE = undefined;
                    return true;
                } }));
            update_hand_text({ sound: "button", volume: 0.7, pitch: 0.9, delay: 0 }, { level: "+1" });
            delay(1.3);
            for (const [k, v] of pairs(G.GAME.hands)) {
                level_up_hand(this, k, true);
            }
            update_hand_text({ sound: "button", volume: 0.7, pitch: 1.1, delay: 0 }, { mult: 0, chips: 0, handname: "", level: "" });
        }
        if (this.ability.name === "Talisman" || this.ability.name === "Deja Vu" || this.ability.name === "Trance" || this.ability.name === "Medium") {
            let conv_card = G.hand.highlighted[1];
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    play_sound("tarot1");
                    used_tarot.juice_up(0.3, 0.5);
                    return true;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                    conv_card.set_seal(this.ability.extra, undefined, true);
                    return true;
                } }));
            delay(0.5);
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                    G.hand.unhighlight_all();
                    return true;
                } }));
        }
        if (this.ability.name === "Aura") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    let over = false;
                    let edition = poll_edition("aura", undefined, true, true);
                    let aura_card = G.hand.highlighted[1];
                    aura_card.set_edition(edition, true);
                    used_tarot.juice_up(0.3, 0.5);
                    return true;
                } }));
        }
        if (this.ability.name === "Cryptid") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    let _first_dissolve = undefined;
                    let new_cards = {};
                    for (let i = 1; i <= this.ability.extra; i++) {
                        G.playing_card = G.playing_card && G.playing_card + 1 || 1;
                        let _card = copy_card(G.hand.highlighted[1], undefined, undefined, G.playing_card);
                        _card.add_to_deck();
                        G.deck.config.card_limit = G.deck.config.card_limit + 1;
                        table.insert(G.playing_cards, _card);
                        G.hand.emplace(_card);
                        _card.start_materialize(undefined, _first_dissolve);
                        _first_dissolve = true;
                        new_cards[new_cards.length + 1] = _card;
                    }
                    playing_card_joker_effects(new_cards);
                    return true;
                } }));
        }
        if (this.ability.name === "Sigil" || this.ability.name === "Ouija") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    play_sound("tarot1");
                    used_tarot.juice_up(0.3, 0.5);
                    return true;
                } }));
            for (let i = 1; i <= G.hand.cards.length; i++) {
                let percent = 1.15 - (i - 0.999) / (G.hand.cards.length - 0.998) * 0.3;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.15, func: function () {
                        G.hand.cards[i].flip();
                        play_sound("card1", percent);
                        G.hand.cards[i].juice_up(0.3, 0.3);
                        return true;
                    } }));
            }
            delay(0.2);
            if (this.ability.name === "Sigil") {
                let _suit = pseudorandom_element(["S", "H", "D", "C"], pseudoseed("sigil"));
                for (let i = 1; i <= G.hand.cards.length; i++) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            let card = G.hand.cards[i];
                            let suit_prefix = _suit + "_";
                            let rank_suffix = card.base.id < 10 && tostring(card.base.id) || card.base.id === 10 && "T" || card.base.id === 11 && "J" || card.base.id === 12 && "Q" || card.base.id === 13 && "K" || card.base.id === 14 && "A";
                            card.set_base(G.P_CARDS[suit_prefix + rank_suffix]);
                            return true;
                        } }));
                }
            }
            if (this.ability.name === "Ouija") {
                let _rank = pseudorandom_element(["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"], pseudoseed("ouija"));
                for (let i = 1; i <= G.hand.cards.length; i++) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            let card = G.hand.cards[i];
                            let suit_prefix = string.sub(card.base.suit, 1, 1) + "_";
                            let rank_suffix = _rank;
                            card.set_base(G.P_CARDS[suit_prefix + rank_suffix]);
                            return true;
                        } }));
                }
                G.hand.change_size(-1);
            }
            for (let i = 1; i <= G.hand.cards.length; i++) {
                let percent = 0.85 + (i - 0.999) / (G.hand.cards.length - 0.998) * 0.3;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.15, func: function () {
                        G.hand.cards[i].flip();
                        play_sound("tarot2", percent, 0.6);
                        G.hand.cards[i].juice_up(0.3, 0.3);
                        return true;
                    } }));
            }
            delay(0.5);
        }
        if (this.ability.consumeable.hand_type) {
            update_hand_text({ sound: "button", volume: 0.7, pitch: 0.8, delay: 0.3 }, { handname: localize(this.ability.consumeable.hand_type, "poker_hands"), chips: G.GAME.hands[this.ability.consumeable.hand_type].chips, mult: G.GAME.hands[this.ability.consumeable.hand_type].mult, level: G.GAME.hands[this.ability.consumeable.hand_type].level });
            level_up_hand(used_tarot, this.ability.consumeable.hand_type);
            update_hand_text({ sound: "button", volume: 0.7, pitch: 1.1, delay: 0 }, { mult: 0, chips: 0, handname: "", level: "" });
        }
        if (this.ability.consumeable.remove_card) {
            let destroyed_cards = {};
            if (this.ability.name === "The Hanged Man") {
                for (let i = G.hand.highlighted.length; i <= 1; i += -1) {
                    destroyed_cards[destroyed_cards.length + 1] = G.hand.highlighted[i];
                }
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                        play_sound("tarot1");
                        used_tarot.juice_up(0.3, 0.5);
                        return true;
                    } }));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                        for (let i = G.hand.highlighted.length; i <= 1; i += -1) {
                            let card = G.hand.highlighted[i];
                            if (SMODS.has_enhancement(card, "m_glass")) {
                                card.shatter();
                            }
                            else {
                                card.start_dissolve(undefined, i === G.hand.highlighted.length);
                            }
                        }
                        return true;
                    } }));
            }
            else if (this.ability.name === "Familiar" || this.ability.name === "Grim" || this.ability.name === "Incantation") {
                destroyed_cards[destroyed_cards.length + 1] = pseudorandom_element(G.hand.cards, pseudoseed("random_destroy"));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                        play_sound("tarot1");
                        used_tarot.juice_up(0.3, 0.5);
                        return true;
                    } }));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                        for (let i = destroyed_cards.length; i <= 1; i += -1) {
                            let card = destroyed_cards[i];
                            if (SMODS.has_enhancement(card, "m_glass")) {
                                card.shatter();
                            }
                            else {
                                card.start_dissolve(undefined, i !== destroyed_cards.length);
                            }
                        }
                        return true;
                    } }));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.7, func: function () {
                        let cards = {};
                        for (let i = 1; i <= this.ability.extra; i++) {
                            cards[i] = true;
                            let [_suit, _rank] = [undefined, undefined];
                            if (this.ability.name === "Familiar") {
                                _rank = pseudorandom_element(["J", "Q", "K"], pseudoseed("familiar_create"));
                                _suit = pseudorandom_element(["S", "H", "D", "C"], pseudoseed("familiar_create"));
                            }
                            else if (this.ability.name === "Grim") {
                                _rank = "A";
                                _suit = pseudorandom_element(["S", "H", "D", "C"], pseudoseed("grim_create"));
                            }
                            else if (this.ability.name === "Incantation") {
                                _rank = pseudorandom_element(["2", "3", "4", "5", "6", "7", "8", "9", "T"], pseudoseed("incantation_create"));
                                _suit = pseudorandom_element(["S", "H", "D", "C"], pseudoseed("incantation_create"));
                            }
                            _suit = _suit || "S";
                            _rank = _rank || "A";
                            let cen_pool = {};
                            for (const [k, v] of pairs(G.P_CENTER_POOLS["Enhanced"])) {
                                if (v.key !== "m_stone") {
                                    cen_pool[cen_pool.length + 1] = v;
                                }
                            }
                            create_playing_card({ front: G.P_CARDS[_suit + ("_" + _rank)], center: pseudorandom_element(cen_pool, pseudoseed("spe_card")) }, G.hand, undefined, i !== 1, [G.C.SECONDARY_SET.Spectral]);
                        }
                        playing_card_joker_effects(cards);
                        return true;
                    } }));
            }
            else if (this.ability.name === "Immolate") {
                let temp_hand = {};
                for (const [k, v] of ipairs(G.hand.cards)) {
                    temp_hand[temp_hand.length + 1] = v;
                }
                table.sort(temp_hand, function (a, b) {
                    return !a.playing_card || !b.playing_card || a.playing_card < b.playing_card;
                });
                pseudoshuffle(temp_hand, pseudoseed("immolate"));
                for (let i = 1; i <= this.ability.extra.destroy; i++) {
                    destroyed_cards[destroyed_cards.length + 1] = temp_hand[i];
                }
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                        play_sound("tarot1");
                        used_tarot.juice_up(0.3, 0.5);
                        return true;
                    } }));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                        for (let i = destroyed_cards.length; i <= 1; i += -1) {
                            let card = destroyed_cards[i];
                            if (SMODS.has_enhancement(card, "m_glass")) {
                                card.shatter();
                            }
                            else {
                                card.start_dissolve(undefined, i === destroyed_cards.length);
                            }
                        }
                        return true;
                    } }));
                delay(0.5);
                ease_dollars(this.ability.extra.dollars);
            }
            delay(0.3);
            SMODS.calculate_context({ remove_playing_cards: true, removed: destroyed_cards });
        }
        if (this.ability.name === "The Fool") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    if (G.consumeables.config.card_limit > G.consumeables.cards.length) {
                        play_sound("timpani");
                        let card = create_card("Tarot_Planet", G.consumeables, undefined, undefined, undefined, undefined, G.GAME.last_tarot_planet, "fool");
                        card.add_to_deck();
                        G.consumeables.emplace(card);
                        used_tarot.juice_up(0.3, 0.5);
                    }
                    return true;
                } }));
            delay(0.6);
        }
        if (this.ability.name === "The Hermit") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    play_sound("timpani");
                    used_tarot.juice_up(0.3, 0.5);
                    ease_dollars(math.max(0, math.min(G.GAME.dollars, this.ability.extra)), true);
                    return true;
                } }));
            delay(0.6);
        }
        if (this.ability.name === "Temperance") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    play_sound("timpani");
                    used_tarot.juice_up(0.3, 0.5);
                    ease_dollars(this.ability.money, true);
                    return true;
                } }));
            delay(0.6);
        }
        if (this.ability.name === "The Emperor" || this.ability.name === "The High Priestess") {
            for (let i = 1; i <= math.min(this.ability.consumeable.tarots || this.ability.consumeable.planets, G.consumeables.config.card_limit - G.consumeables.cards.length); i++) {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                        if (G.consumeables.config.card_limit > G.consumeables.cards.length) {
                            play_sound("timpani");
                            let card = create_card(this.ability.name === "The Emperor" && "Tarot" || this.ability.name === "The High Priestess" && "Planet", G.consumeables, undefined, undefined, undefined, undefined, undefined, this.ability.name === "The Emperor" && "emp" || this.ability.name === "The High Priestess" && "pri");
                            card.add_to_deck();
                            G.consumeables.emplace(card);
                            used_tarot.juice_up(0.3, 0.5);
                        }
                        return true;
                    } }));
            }
            delay(0.6);
        }
        if (this.ability.name === "Judgement" || this.ability.name === "The Soul") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    play_sound("timpani");
                    let card = create_card("Joker", G.jokers, this.ability.name === "The Soul", undefined, undefined, undefined, undefined, this.ability.name === "Judgement" && "jud" || "sou");
                    card.add_to_deck();
                    G.jokers.emplace(card);
                    if (this.ability.name === "The Soul") {
                        check_for_unlock({ type: "spawn_legendary" });
                    }
                    used_tarot.juice_up(0.3, 0.5);
                    return true;
                } }));
            delay(0.6);
        }
        if (this.ability.name === "Ankh") {
            let deletable_jokers = {};
            for (const [k, v] of pairs(G.jokers.cards)) {
                if (!v.ability.eternal) {
                    deletable_jokers[deletable_jokers.length + 1] = v;
                }
            }
            let chosen_joker = pseudorandom_element(G.jokers.cards, pseudoseed("ankh_choice"));
            let _first_dissolve = undefined;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.75, func: function () {
                    for (const [k, v] of pairs(deletable_jokers)) {
                        if (v !== chosen_joker) {
                            v.start_dissolve(undefined, _first_dissolve);
                            _first_dissolve = true;
                        }
                    }
                    return true;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0.4, func: function () {
                    let card = copy_card(chosen_joker, undefined, undefined, undefined, chosen_joker.edition && chosen_joker.edition.negative);
                    card.start_materialize();
                    card.add_to_deck();
                    if (card.edition && card.edition.negative) {
                        card.set_edition(undefined, true);
                    }
                    G.jokers.emplace(card);
                    return true;
                } }));
        }
        if (this.ability.name === "Wraith") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    play_sound("timpani");
                    let card = create_card("Joker", G.jokers, undefined, 0.99, undefined, undefined, undefined, "wra");
                    card.add_to_deck();
                    G.jokers.emplace(card);
                    used_tarot.juice_up(0.3, 0.5);
                    if (G.GAME.dollars !== 0) {
                        ease_dollars(-G.GAME.dollars, true);
                    }
                    return true;
                } }));
            delay(0.6);
        }
        if (this.ability.name === "The Wheel of Fortune" || this.ability.name === "Ectoplasm" || this.ability.name === "Hex") {
            let temp_pool = this.ability.name === "The Wheel of Fortune" && this.eligible_strength_jokers || (this.ability.name === "Ectoplasm" || this.ability.name === "Hex") && this.eligible_editionless_jokers || {};
            if (this.ability.name === "Ectoplasm" || this.ability.name === "Hex" || pseudorandom("wheel_of_fortune") < G.GAME.probabilities.normal / this.ability.extra) {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                        let over = false;
                        let eligible_card = pseudorandom_element(temp_pool, pseudoseed(this.ability.name === "The Wheel of Fortune" && "wheel_of_fortune" || this.ability.name === "Ectoplasm" && "ectoplasm" || this.ability.name === "Hex" && "hex"));
                        let edition = undefined;
                        if (this.ability.name === "Ectoplasm") {
                            edition = { negative: true };
                        }
                        else if (this.ability.name === "Hex") {
                            edition = { polychrome: true };
                        }
                        else if (this.ability.name === "The Wheel of Fortune") {
                            edition = poll_edition("wheel_of_fortune", undefined, true, true);
                        }
                        eligible_card.set_edition(edition, true);
                        if (this.ability.name === "The Wheel of Fortune" || this.ability.name === "Ectoplasm" || this.ability.name === "Hex") {
                            check_for_unlock({ type: "have_edition" });
                        }
                        if (this.ability.name === "Hex") {
                            let _first_dissolve = undefined;
                            for (const [k, v] of pairs(G.jokers.cards)) {
                                if (v !== eligible_card && !v.ability.eternal) {
                                    v.start_dissolve(undefined, _first_dissolve);
                                    _first_dissolve = true;
                                }
                            }
                        }
                        if (this.ability.name === "Ectoplasm") {
                            G.GAME.ecto_minus = G.GAME.ecto_minus || 1;
                            G.hand.change_size(-G.GAME.ecto_minus);
                            G.GAME.ecto_minus = G.GAME.ecto_minus + 1;
                        }
                        used_tarot.juice_up(0.3, 0.5);
                        return true;
                    } }));
            }
            else {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                        attention_text({ text: localize("k_nope_ex"), scale: 1.3, hold: 1.4, major: used_tarot, backdrop_colour: G.C.SECONDARY_SET.Tarot, align: (G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED) && "tm" || "cm", offset: { x: 0, y: (G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED) && -0.2 || 0 }, silent: true });
                        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06 * G.SETTINGS.GAMESPEED, blockable: false, blocking: false, func: function () {
                                play_sound("tarot2", 0.76, 0.4);
                                return true;
                            } }));
                        play_sound("tarot2", 1, 0.4);
                        used_tarot.juice_up(0.3, 0.5);
                        return true;
                    } }));
            }
            delay(0.6);
        }
    };
    can_use_consumeable(any_state, skip_check) {
        if (!skip_check && (G.play && G.play.cards.length > 0 || G.CONTROLLER.locked || G.GAME.STOP_USE && G.GAME.STOP_USE > 0)) {
            return false;
        }
        if (G.STATE !== G.STATES.HAND_PLAYED && G.STATE !== G.STATES.DRAW_TO_HAND && G.STATE !== G.STATES.PLAY_TAROT || any_state) {
            let obj = this.config.center;
            if (obj.can_use && type(obj.can_use) === "function") {
                return obj.can_use(this);
            }
            if (this.ability.name === "The Hermit" || this.ability.consumeable.hand_type || this.ability.name === "Temperance" || this.ability.name === "Black Hole") {
                return true;
            }
            if (this.ability.name === "The Wheel of Fortune") {
                if (next(this.eligible_strength_jokers)) {
                    return true;
                }
            }
            if (this.ability.name === "Ankh") {
                for (const [k, v] of pairs(G.jokers.cards)) {
                    if (v.ability.set === "Joker" && G.jokers.config.card_limit > 1) {
                        return true;
                    }
                }
            }
            if (this.ability.name === "Aura") {
                if (G.hand && G.hand.highlighted.length === 1 && G.hand.highlighted[1] && !G.hand.highlighted[1].edition) {
                    return true;
                }
            }
            if (this.ability.name === "Ectoplasm" || this.ability.name === "Hex") {
                if (next(this.eligible_editionless_jokers)) {
                    return true;
                }
            }
            if (this.ability.name === "The Emperor" || this.ability.name === "The High Priestess") {
                if (G.consumeables.cards.length < G.consumeables.config.card_limit || this.area === G.consumeables) {
                    return true;
                }
            }
            if (this.ability.name === "The Fool") {
                if ((G.consumeables.cards.length < G.consumeables.config.card_limit || this.area === G.consumeables) && G.GAME.last_tarot_planet && G.GAME.last_tarot_planet !== "c_fool") {
                    return true;
                }
            }
            if (this.ability.name === "Judgement" || this.ability.name === "The Soul" || this.ability.name === "Wraith") {
                if (G.jokers.cards.length < G.jokers.config.card_limit || this.area === G.jokers) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (G.STATE === G.STATES.SELECTING_HAND || G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.PLANET_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED) {
                if (this.ability.consumeable.max_highlighted) {
                    if (this.ability.consumeable.mod_num >= G.hand.highlighted.length && G.hand.highlighted.length >= (this.ability.consumeable.min_highlighted || 1)) {
                        return true;
                    }
                }
                if ((this.ability.name === "Familiar" || this.ability.name === "Grim" || this.ability.name === "Incantation" || this.ability.name === "Immolate" || this.ability.name === "Sigil" || this.ability.name === "Ouija") && G.hand.cards.length > 1) {
                    return true;
                }
            }
        }
        return false;
    };
    check_use() {
        if (this.ability.name === "Ankh") {
            if (G.jokers.cards.length >= G.jokers.config.card_limit) {
                alert_no_space(this, G.jokers);
                return true;
            }
        }
    };
    sell_card() {
        G.CONTROLLER.locks.selling_card = true;
        stop_use();
        let area = this.area;
        G.CONTROLLER.save_cardarea_focus(area === G.jokers && "jokers" || "consumeables");
        if (this.children.use_button) {
            this.children.use_button.remove();
            this.children.use_button = undefined;
        }
        if (this.children.sell_button) {
            this.children.sell_button.remove();
            this.children.sell_button = undefined;
        }
        let [eval, post] = eval_card(this, { selling_this: true });
        SMODS.trigger_effects([eval, post], this);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                play_sound("coin2");
                this.juice_up(0.3, 0.4);
                return true;
            } }));
        delay(0.2);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                ease_dollars(this.sell_cost);
                this.start_dissolve([G.C.GOLD]);
                delay(0.3);
                inc_career_stat("c_cards_sold", 1);
                if (this.ability.set === "Joker") {
                    inc_career_stat("c_jokers_sold", 1);
                }
                if (this.ability.set === "Joker" && G.GAME.blind && G.GAME.blind.name === "Verdant Leaf") {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.GAME.blind.disable();
                            return true;
                        } }));
                }
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blocking: false, func: function () {
                        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                                G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                                        G.CONTROLLER.locks.selling_card = undefined;
                                        G.CONTROLLER.recall_cardarea_focus(area === G.jokers && "jokers" || "consumeables");
                                        return true;
                                    } }));
                                return true;
                            } }));
                        return true;
                    } }));
                return true;
            } }));
    };
    can_sell_card(context) {
        if (G.play && G.play.cards.length > 0 || G.CONTROLLER.locked || G.GAME.STOP_USE && G.GAME.STOP_USE > 0) {
            return false;
        }
        if ((G.SETTINGS.tutorial_complete || G.GAME.pseudorandom.seed !== "TUTORIAL" || G.GAME.round_resets.ante > 1) && this.area && this.area.config.type === "joker" && !this.ability.eternal) {
            return true;
        }
        return false;
    };
    calculate_dollar_bonus() {
        if (this.debuff) {
            return;
        }
        let obj = this.config.center;
        if (obj.calc_dollar_bonus && type(obj.calc_dollar_bonus) === "function") {
            return obj.calc_dollar_bonus(this);
        }
        if (this.ability.set === "Joker") {
            if (this.ability.name === "Golden Joker") {
                return this.ability.extra;
            }
            if (this.ability.name === "Cloud 9" && this.ability.nine_tally && this.ability.nine_tally > 0) {
                return this.ability.extra * this.ability.nine_tally;
            }
            if (this.ability.name === "Rocket") {
                return this.ability.extra.dollars;
            }
            if (this.ability.name === "Satellite") {
                let planets_used = 0;
                for (const [k, v] of pairs(G.GAME.consumeable_usage)) {
                    if (v.set === "Planet") {
                        planets_used = planets_used + 1;
                    }
                }
                if (planets_used === 0) {
                    return;
                }
                return this.ability.extra * planets_used;
            }
            if (this.ability.name === "Delayed Gratification" && G.GAME.current_round.discards_used === 0 && G.GAME.current_round.discards_left > 0) {
                return G.GAME.current_round.discards_left * this.ability.extra;
            }
        }
    };
    open() {
        if (this.ability.set === "Booster") {
            stop_use();
            G.STATE_COMPLETE = false;
            this.opening = true;
            if (!this.config.center.discovered) {
                discover_card(this.config.center);
            }
            this.states.hover.can = false;
            booster_obj = this.config.center;
            if (booster_obj && SMODS.Centers[booster_obj.key]) {
                G.STATE = G.STATES.SMODS_BOOSTER_OPENED;
                SMODS.OPENED_BOOSTER = this;
            }
            if (this.ability.name.find("Arcana")) {
                G.STATE = G.STATES.TAROT_PACK;
                G.GAME.pack_size = this.ability.extra;
            }
            else if (this.ability.name.find("Celestial")) {
                G.STATE = G.STATES.PLANET_PACK;
                G.GAME.pack_size = this.ability.extra;
            }
            else if (this.ability.name.find("Spectral")) {
                G.STATE = G.STATES.SPECTRAL_PACK;
                G.GAME.pack_size = this.ability.extra;
            }
            else if (this.ability.name.find("Standard")) {
                G.STATE = G.STATES.STANDARD_PACK;
                G.GAME.pack_size = this.ability.extra;
            }
            else if (this.ability.name.find("Buffoon")) {
                G.STATE = G.STATES.BUFFOON_PACK;
                G.GAME.pack_size = this.ability.extra;
            }
            G.GAME.pack_choices = this.config.center.config.choose || 1;
            if (this.cost > 0) {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                        inc_career_stat("c_shop_dollars_spent", this.cost);
                        this.juice_up();
                        return true;
                    } }));
                ease_dollars(-this.cost);
            }
            else {
                delay(0.2);
            }
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    this.explode();
                    let pack_cards = {};
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.3 * math.sqrt(G.SETTINGS.GAMESPEED), blockable: false, blocking: false, func: function () {
                            let _size = this.ability.extra;
                            for (let i = 1; i <= _size; i++) {
                                let card = undefined;
                                if (booster_obj.create_card && type(booster_obj.create_card) === "function") {
                                    let _card_to_spawn = booster_obj.create_card(this, i);
                                    if (type((_card_to_spawn || {}).is) === "function" && _card_to_spawn.is(Card)) {
                                        card = _card_to_spawn;
                                    }
                                    else {
                                        card = SMODS.create_card(_card_to_spawn);
                                    }
                                }
                                else if (this.ability.name.find("Arcana")) {
                                    if (G.GAME.used_vouchers.v_omen_globe && pseudorandom("omen_globe") > 0.8) {
                                        card = create_card("Spectral", G.pack_cards, undefined, undefined, true, true, undefined, "ar2");
                                    }
                                    else {
                                        card = create_card("Tarot", G.pack_cards, undefined, undefined, true, true, undefined, "ar1");
                                    }
                                }
                                else if (this.ability.name.find("Celestial")) {
                                    if (G.GAME.used_vouchers.v_telescope && i === 1) {
                                        let [_planet, _hand, _tally] = [undefined, undefined, 0];
                                        for (const [k, v] of ipairs(G.handlist)) {
                                            if (G.GAME.hands[v].visible && G.GAME.hands[v].played > _tally) {
                                                _hand = v;
                                                _tally = G.GAME.hands[v].played;
                                            }
                                        }
                                        if (_hand) {
                                            for (const [k, v] of pairs(G.P_CENTER_POOLS.Planet)) {
                                                if (v.config.hand_type === _hand) {
                                                    _planet = v.key;
                                                }
                                            }
                                        }
                                        card = create_card("Planet", G.pack_cards, undefined, undefined, true, true, _planet, "pl1");
                                    }
                                    else {
                                        card = create_card("Planet", G.pack_cards, undefined, undefined, true, true, undefined, "pl1");
                                    }
                                }
                                else if (this.ability.name.find("Spectral")) {
                                    card = create_card("Spectral", G.pack_cards, undefined, undefined, true, true, undefined, "spe");
                                }
                                else if (this.ability.name.find("Standard")) {
                                    card = create_card(pseudorandom(pseudoseed("stdset" + G.GAME.round_resets.ante)) > 0.6 && "Enhanced" || "Base", G.pack_cards, undefined, undefined, undefined, true, undefined, "sta");
                                    let edition_rate = 2;
                                    let edition = poll_edition("standard_edition" + G.GAME.round_resets.ante, edition_rate, true);
                                    card.set_edition(edition);
                                    card.set_seal(SMODS.poll_seal({ mod: 10 }));
                                }
                                else if (this.ability.name.find("Buffoon")) {
                                    card = create_card("Joker", G.pack_cards, undefined, undefined, true, true, undefined, "buf");
                                }
                                card.T.x = this.T.x;
                                card.T.y = this.T.y;
                                card.start_materialize([G.C.WHITE, G.C.WHITE], undefined, 1.5 * G.SETTINGS.GAMESPEED);
                                pack_cards[i] = card;
                            }
                            return true;
                        } }));
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.3 * math.sqrt(G.SETTINGS.GAMESPEED), blockable: false, blocking: false, func: function () {
                            if (G.pack_cards) {
                                if (G.pack_cards && G.pack_cards.VT.y < G.ROOM.T.h) {
                                    for (const [k, v] of ipairs(pack_cards)) {
                                        G.pack_cards.emplace(v);
                                    }
                                    return true;
                                }
                            }
                        } }));
                    SMODS.calculate_context({ open_booster: true, card: this });
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
                    return true;
                } }));
        }
    };
    redeem() {
        if (this.ability.set === "Voucher") {
            stop_use();
            if (!this.config.center.discovered) {
                discover_card(this.config.center);
            }
            if (this.shop_voucher) {
                G.GAME.current_round.voucher = undefined;
            }
            this.states.hover.can = false;
            G.GAME.used_vouchers[this.config.center_key] = true;
            let top_dynatext = undefined;
            let bot_dynatext = undefined;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.4, func: function () {
                    top_dynatext = new DynaText({ string: localize({ type: "name_text", set: this.config.center.set, key: this.config.center.key }), colours: [G.C.WHITE], rotate: 1, shadow: true, bump: true, float: true, scale: 0.9, pop_in: 0.6 / G.SPEEDFACTOR, pop_in_rate: 1.5 * G.SPEEDFACTOR });
                    bot_dynatext = new DynaText({ string: localize("k_redeemed_ex"), colours: [G.C.WHITE], rotate: 2, shadow: true, bump: true, float: true, scale: 0.9, pop_in: 1.4 / G.SPEEDFACTOR, pop_in_rate: 1.5 * G.SPEEDFACTOR, pitch_shift: 0.25 });
                    this.juice_up(0.3, 0.5);
                    play_sound("card1");
                    play_sound("coin1");
                    this.children.top_disp = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.O, config: { object: top_dynatext } }] }, config: { align: "tm", offset: { x: 0, y: 0 }, parent: this } });
                    this.children.bot_disp = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "tm", r: 0.15, colour: G.C.CLEAR, padding: 0.15 }, nodes: [{ n: G.UIT.O, config: { object: bot_dynatext } }] }, config: { align: "bm", offset: { x: 0, y: 0 }, parent: this } });
                    return true;
                } }));
            if (this.cost !== 0) {
                ease_dollars(-this.cost);
                inc_career_stat("c_shop_dollars_spent", this.cost);
            }
            inc_career_stat("c_vouchers_bought", 1);
            set_voucher_usage(this);
            check_for_unlock({ type: "run_redeem" });
            G.GAME.current_round.voucher = undefined;
            this.apply_to_run();
            delay(0.6);
            SMODS.calculate_context({ buying_card: true, card: this });
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
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 2.6, func: function () {
                    top_dynatext.pop_out(4);
                    bot_dynatext.pop_out(4);
                    return true;
                } }));
            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                    this.children.top_disp.remove();
                    this.children.top_disp = undefined;
                    this.children.bot_disp.remove();
                    this.children.bot_disp = undefined;
                    return true;
                } }));
        }
    };
    apply_to_run(center) {
        let card_to_save = this && copy_card(this) || new Card(0, 0, G.CARD_W, G.CARD_H, G.P_CARDS.empty, center);
        [card_to_save.VT.x, card_to_save.VT.y] = [G.vouchers.T.x, G.vouchers.T.y];
        G.vouchers.emplace(card_to_save);
        let center_table = { name: center && center.name || this && this.ability.name, extra: center && center.config.extra || this && this.ability.extra };
        let obj = center || this.config.center;
        if (obj.redeem && type(obj.redeem) === "function") {
            obj.redeem(this);
            return;
        }
        if (center_table.name === "Overstock" || center_table.name === "Overstock Plus") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    change_shop_size(1);
                    return true;
                } }));
        }
        if (center_table.name === "Tarot Merchant" || center_table.name === "Tarot Tycoon") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.tarot_rate = 4 * center_table.extra;
                    return true;
                } }));
        }
        if (center_table.name === "Planet Merchant" || center_table.name === "Planet Tycoon") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.planet_rate = 4 * center_table.extra;
                    return true;
                } }));
        }
        if (center_table.name === "Hone" || center_table.name === "Glow Up") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.edition_rate = center_table.extra;
                    return true;
                } }));
        }
        if (center_table.name === "Magic Trick" || center_table.name === "Illusion") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.playing_card_rate = center_table.extra;
                    return true;
                } }));
        }
        if (center_table.name === "Telescope" || center_table.name === "Observatory") { }
        if (center_table.name === "Crystal Ball") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.consumeables.config.card_limit = G.consumeables.config.card_limit + 1;
                    return true;
                } }));
        }
        if (center_table.name === "Clearance Sale" || center_table.name === "Liquidation") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.discount_percent = center_table.extra;
                    for (const [k, v] of pairs(G.I.CARD)) {
                        if (v.set_cost) {
                            v.set_cost();
                        }
                    }
                    return true;
                } }));
        }
        if (center_table.name === "Reroll Surplus" || center_table.name === "Reroll Glut") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.round_resets.reroll_cost = G.GAME.round_resets.reroll_cost - center_table.extra;
                    G.GAME.current_round.reroll_cost = math.max(0, G.GAME.current_round.reroll_cost - center_table.extra);
                    return true;
                } }));
        }
        if (center_table.name === "Seed Money" || center_table.name === "Money Tree") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.GAME.interest_cap = center_table.extra;
                    return true;
                } }));
        }
        if (center_table.name === "Grabber" || center_table.name === "Nacho Tong") {
            G.GAME.round_resets.hands = G.GAME.round_resets.hands + center_table.extra;
            ease_hands_played(center_table.extra);
        }
        if (center_table.name === "Paint Brush" || center_table.name === "Palette") {
            G.hand.change_size(1);
        }
        if (center_table.name === "Wasteful" || center_table.name === "Recyclomancy") {
            G.GAME.round_resets.discards = G.GAME.round_resets.discards + center_table.extra;
            ease_discard(center_table.extra);
        }
        if (center_table.name === "Blank") {
            check_for_unlock({ type: "blank_redeems" });
        }
        if (center_table.name === "Antimatter") {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    if (G.jokers) {
                        G.jokers.config.card_limit = G.jokers.config.card_limit + 1;
                    }
                    return true;
                } }));
        }
        if (center_table.name === "Hieroglyph" || center_table.name === "Petroglyph") {
            ease_ante(-center_table.extra);
            G.GAME.round_resets.blind_ante = G.GAME.round_resets.blind_ante || G.GAME.round_resets.ante;
            G.GAME.round_resets.blind_ante = G.GAME.round_resets.blind_ante - center_table.extra;
            if (center_table.name === "Hieroglyph") {
                G.GAME.round_resets.hands = G.GAME.round_resets.hands - center_table.extra;
                ease_hands_played(-center_table.extra);
            }
            if (center_table.name === "Petroglyph") {
                G.GAME.round_resets.discards = G.GAME.round_resets.discards - center_table.extra;
                ease_discard(-center_table.extra);
            }
        }
    };
    explode(dissolve_colours, explode_time_fac) {
        let explode_time = 1.3 * (explode_time_fac || 1) * math.sqrt(G.SETTINGS.GAMESPEED);
        this.dissolve = 0;
        this.dissolve_colours = dissolve_colours || [G.C.WHITE];
        let start_time = G.TIMERS.TOTAL;
        let percent = 0;
        play_sound("explosion_buildup1");
        this.juice = { scale: 0, r: 0, handled_elsewhere: true, start_time: start_time, end_time: start_time + explode_time };
        let childParts1 = new Particles(0, 0, 0, 0, { timer_type: "TOTAL", timer: 0.01 * explode_time, scale: 0.2, speed: 2, lifespan: 0.2 * explode_time, attach: this, colours: this.dissolve_colours, fill: true });
        let childParts2 = undefined;
        G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
                if (this.juice) {
                    percent = (G.TIMERS.TOTAL - start_time) / explode_time;
                    this.juice.r = 0.05 * (math.sin(5 * G.TIMERS.TOTAL) + math.cos(0.33 + 41.15332 * G.TIMERS.TOTAL) + math.cos(67.12 * G.TIMERS.TOTAL)) * percent;
                    this.juice.scale = percent * 0.15;
                }
                if (G.TIMERS.TOTAL - start_time > 1.5 * explode_time) {
                    return true;
                }
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, ref_table: this, ref_value: "dissolve", ease_to: 0.3, delay: 0.9 * explode_time, func: function (t) {
                return t;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 0.9 * explode_time, func: function () {
                childParts2 = new Particles(0, 0, 0, 0, { timer_type: "TOTAL", pulse_max: 30, timer: 0.003, scale: 0.6, speed: 15, lifespan: 0.5, attach: this, colours: this.dissolve_colours });
                childParts2.set_role({ r_bond: "Weak" });
                G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, ref_table: this, ref_value: "dissolve", ease_to: 1, delay: 0.1 * explode_time, func: function (t) {
                        return t;
                    } }));
                this.juice_up();
                G.VIBRATION = G.VIBRATION + 1;
                play_sound("explosion_release1");
                childParts1.fade(0.3 * explode_time);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 1.4 * explode_time, func: function () {
                G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, blocking: false, ref_value: "scale", ref_table: childParts2, ease_to: 0, delay: 0.1 * explode_time }));
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 1.5 * explode_time, func: function () {
                this.remove();
                return true;
            } }));
    };
    shatter() {
        let dissolve_time = 0.7;
        this.shattered = true;
        this.dissolve = 0;
        this.dissolve_colours = [[1, 1, 1, 0.8]];
        this.juice_up();
        let childParts = new Particles(0, 0, 0, 0, { timer_type: "TOTAL", timer: 0.007 * dissolve_time, scale: 0.3, speed: 4, lifespan: 0.5 * dissolve_time, attach: this, colours: this.dissolve_colours, fill: true });
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 0.5 * dissolve_time, func: function () {
                childParts.fade(0.15 * dissolve_time);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
                play_sound("glass" + math.random(1, 6), math.random() * 0.2 + 0.9, 0.5);
                play_sound("generic1", math.random() * 0.2 + 0.9, 0.5);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, ref_table: this, ref_value: "dissolve", ease_to: 1, delay: 0.5 * dissolve_time, func: function (t) {
                return t;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 0.55 * dissolve_time, func: function () {
                this.remove();
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 0.51 * dissolve_time }));
    };
    start_dissolve(dissolve_colours, silent, dissolve_time_fac, no_juice) {
        let dissolve_time = 0.7 * (dissolve_time_fac || 1);
        this.dissolve = 0;
        this.dissolve_colours = dissolve_colours || [G.C.BLACK, G.C.ORANGE, G.C.RED, G.C.GOLD, G.C.JOKER_GREY];
        if (!no_juice) {
            this.juice_up();
        }
        let childParts = new Particles(0, 0, 0, 0, { timer_type: "TOTAL", timer: 0.01 * dissolve_time, scale: 0.1, speed: 2, lifespan: 0.7 * dissolve_time, attach: this, colours: this.dissolve_colours, fill: true });
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 0.7 * dissolve_time, func: function () {
                childParts.fade(0.3 * dissolve_time);
                return true;
            } }));
        if (!silent) {
            G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
                    play_sound("whoosh2", math.random() * 0.2 + 0.9, 0.5);
                    play_sound("crumple" + math.random(1, 5), math.random() * 0.2 + 0.9, 0.5);
                    return true;
                } }));
        }
        G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, ref_table: this, ref_value: "dissolve", ease_to: 1, delay: 1 * dissolve_time, func: function (t) {
                return t;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 1.05 * dissolve_time, func: function () {
                this.remove();
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 1.051 * dissolve_time }));
    };
    start_materialize(dissolve_colours, silent, timefac) {
        let dissolve_time = 0.6 * (timefac || 1);
        this.states.visible = true;
        this.states.hover.can = false;
        this.dissolve = 1;
        this.dissolve_colours = dissolve_colours || this.ability.set === "Joker" && [G.C.RARITY[this.config.center.rarity]] || this.ability.set === "Planet" && [G.C.SECONDARY_SET.Planet] || this.ability.set === "Tarot" && [G.C.SECONDARY_SET.Tarot] || this.ability.set === "Spectral" && [G.C.SECONDARY_SET.Spectral] || this.ability.set === "Booster" && [G.C.BOOSTER] || this.ability.set === "Voucher" && [G.C.SECONDARY_SET.Voucher, G.C.CLEAR] || [G.C.GREEN];
        this.juice_up();
        this.children.particles = new Particles(0, 0, 0, 0, { timer_type: "TOTAL", timer: 0.025 * dissolve_time, scale: 0.25, speed: 3, lifespan: 0.7 * dissolve_time, attach: this, colours: this.dissolve_colours, fill: true });
        if (!silent) {
            if (!G.last_materialized || G.last_materialized + 0.01 < G.TIMERS.REAL || G.last_materialized > G.TIMERS.REAL) {
                G.last_materialized = G.TIMERS.REAL;
                G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
                        play_sound("whoosh1", math.random() * 0.1 + 0.6, 0.3);
                        play_sound("crumple" + math.random(1, 5), math.random() * 0.2 + 1.2, 0.8);
                        return true;
                    } }));
            }
        }
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 0.5 * dissolve_time, func: function () {
                if (this.children.particles) {
                    this.children.particles.max = 0;
                }
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "ease", blockable: false, ref_table: this, ref_value: "dissolve", ease_to: 0, delay: 1 * dissolve_time, func: function (t) {
                return t;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: 1.05 * dissolve_time, func: function () {
                this.states.hover.can = true;
                if (this.children.particles) {
                    this.children.particles.remove();
                    this.children.particles = undefined;
                }
                return true;
            } }));
    };
    calculate_seal(context) {
        if (this.debuff) {
            return undefined;
        }
        let obj = G.P_SEALS[this.seal] || {};
        if (obj.calculate && type(obj.calculate) === "function") {
            let o = obj.calculate(this, context);
            if (o) {
                if (!o.card) {
                    o.card = this;
                }
                return o;
            }
        }
        if (context.repetition) {
            if (this.seal === "Red") {
                return { message: localize("k_again_ex"), repetitions: 1, card: this };
            }
        }
        if (context.discard && context.other_card === this) {
            if (this.seal === "Purple" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                        let card = create_card("Tarot", G.consumeables, undefined, undefined, undefined, undefined, undefined, "8ba");
                        card.add_to_deck();
                        G.consumeables.emplace(card);
                        G.GAME.consumeable_buffer = 0;
                        return true;
                    } }));
                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("k_plus_tarot"), colour: G.C.PURPLE });
                return [undefined, true];
            }
        }
    };
    calculate_rental() {
        if (this.ability.rental) {
            ease_dollars(-G.GAME.rental_rate);
            card_eval_status_text(this, "dollars", -G.GAME.rental_rate);
        }
    };
    calculate_perishable() {
        if (this.ability.perishable && this.ability.perish_tally > 0) {
            if (this.ability.perish_tally === 1) {
                this.ability.perish_tally = 0;
                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("k_disabled_ex"), colour: G.C.FILTER, delay: 0.45 });
                this.set_debuff();
            }
            else {
                this.ability.perish_tally = this.ability.perish_tally - 1;
                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_remaining", vars: [this.ability.perish_tally] }), colour: G.C.FILTER, delay: 0.45 });
            }
        }
    };
    calculate_joker(context) {
        if (this.debuff) {
            return undefined;
        }
        let obj = this.config.center;
        if (this.ability.set !== "Enhanced" && obj.calculate && type(obj.calculate) === "function") {
            let [o, t] = obj.calculate(this, context);
            if (o || t) {
                return [o, t];
            }
        }
        if (this.ability.set === "Joker" && !this.debuff) {
            if (this.ability.name === "Blueprint") {
                let other_joker = undefined;
                for (let i = 1; i <= G.jokers.cards.length; i++) {
                    if (G.jokers.cards[i] === this) {
                        other_joker = G.jokers.cards[i + 1];
                    }
                }
                if (other_joker && other_joker !== this && !context.no_blueprint) {
                    context.blueprint = context.blueprint && context.blueprint + 1 || 1;
                    context.blueprint_card = context.blueprint_card || this;
                    if (context.blueprint > G.jokers.cards.length + 1) {
                        return;
                    }
                    let other_joker_ret = other_joker.calculate_joker(context);
                    context.blueprint = undefined;
                    let eff_card = context.blueprint_card || this;
                    context.blueprint_card = undefined;
                    if (other_joker_ret) {
                        other_joker_ret.card = eff_card;
                        other_joker_ret.colour = G.C.BLUE;
                        return other_joker_ret;
                    }
                }
            }
            if (this.ability.name === "Brainstorm") {
                let other_joker = G.jokers.cards[1];
                if (other_joker && other_joker !== this && !context.no_blueprint) {
                    context.blueprint = context.blueprint && context.blueprint + 1 || 1;
                    context.blueprint_card = context.blueprint_card || this;
                    if (context.blueprint > G.jokers.cards.length + 1) {
                        return;
                    }
                    let other_joker_ret = other_joker.calculate_joker(context);
                    context.blueprint = undefined;
                    let eff_card = context.blueprint_card || this;
                    context.blueprint_card = undefined;
                    if (other_joker_ret) {
                        other_joker_ret.card = eff_card;
                        other_joker_ret.colour = G.C.RED;
                        return other_joker_ret;
                    }
                }
            }
            if (context.open_booster) {
                if (this.ability.name === "Hallucination" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                    if (pseudorandom("halu" + G.GAME.round_resets.ante) < G.GAME.probabilities.normal / this.ability.extra) {
                        G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                                let card = create_card("Tarot", G.consumeables, undefined, undefined, undefined, undefined, undefined, "hal");
                                card.add_to_deck();
                                G.consumeables.emplace(card);
                                G.GAME.consumeable_buffer = 0;
                                return true;
                            } }));
                        card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("k_plus_tarot"), colour: G.C.PURPLE });
                        return [undefined, true];
                    }
                }
            }
            else if (context.buying_card) { }
            else if (context.selling_this) {
                if (this.ability.name === "Luchador") {
                    if (G.GAME.blind && (!G.GAME.blind.disabled && G.GAME.blind.get_type() === "Boss")) {
                        card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("ph_boss_disabled") });
                        G.GAME.blind.disable();
                        return [undefined, true];
                    }
                }
                if (this.ability.name === "Diet Cola") {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            add_tag(Tag("tag_double"));
                            play_sound("generic1", 0.9 + math.random() * 0.1, 0.8);
                            play_sound("holo1", 1.2 + math.random() * 0.1, 0.4);
                            return true;
                        } }));
                    return [undefined, true];
                }
                if (this.ability.name === "Invisible Joker" && this.ability.invis_rounds >= this.ability.extra && !context.blueprint) {
                    let eval = function (card) {
                        return card.ability.loyalty_remaining === 0 && !G.RESET_JIGGLES;
                    };
                    juice_card_until(this, eval, true);
                    let jokers = {};
                    for (let i = 1; i <= G.jokers.cards.length; i++) {
                        if (G.jokers.cards[i] !== this) {
                            jokers[jokers.length + 1] = G.jokers.cards[i];
                        }
                    }
                    if (jokers.length > 0) {
                        if (G.jokers.cards.length <= G.jokers.config.card_limit) {
                            card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_duplicated_ex") });
                            let chosen_joker = pseudorandom_element(jokers, pseudoseed("invisible"));
                            let card = copy_card(chosen_joker, undefined, undefined, undefined, chosen_joker.edition && chosen_joker.edition.negative);
                            if (card.ability.invis_rounds) {
                                card.ability.invis_rounds = 0;
                            }
                            card.add_to_deck();
                            G.jokers.emplace(card);
                            return [undefined, true];
                        }
                        else {
                            card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_no_room_ex") });
                        }
                    }
                    else {
                        card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_no_other_jokers") });
                    }
                }
            }
            else if (context.selling_card) {
                if (this.ability.name === "Campfire" && !context.blueprint) {
                    this.ability.x_mult = this.ability.x_mult + this.ability.extra;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("k_upgrade_ex") });
                            return true;
                        } }));
                }
                if (this.ability.name === "Campfire" && !context.blueprint) {
                    return [undefined, true];
                }
            }
            else if (context.reroll_shop) {
                if (this.ability.name === "Flash Card" && !context.blueprint) {
                    this.ability.mult = this.ability.mult + this.ability.extra;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), colour: G.C.MULT });
                            return true;
                        } }));
                }
                if (this.ability.name === "Flash Card" && !context.blueprint) {
                    return [undefined, true];
                }
            }
            else if (context.ending_shop) {
                if (this.ability.name === "Perkeo") {
                    if (G.consumeables.cards[1]) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                let card = copy_card(pseudorandom_element(G.consumeables.cards, pseudoseed("perkeo")), undefined);
                                card.set_edition({ negative: true }, true);
                                card.add_to_deck();
                                G.consumeables.emplace(card);
                                return true;
                            } }));
                        card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_duplicated_ex") });
                        return [undefined, true];
                    }
                    return;
                }
                return;
            }
            else if (context.skip_blind) {
                if (this.ability.name === "Throwback" && !context.blueprint) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }), colour: G.C.RED, card: this });
                            return true;
                        } }));
                    return [undefined, true];
                }
                return;
            }
            else if (context.skipping_booster) {
                if (this.ability.name === "Red Card" && !context.blueprint) {
                    this.ability.mult = this.ability.mult + this.ability.extra;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra] }), colour: G.C.RED, delay: 0.45, card: this });
                            return true;
                        } }));
                    return [undefined, true];
                }
                return;
            }
            else if (context.playing_card_added && !this.getting_sliced) {
                if (this.ability.name === "Hologram" && !context.blueprint && context.cards && context.cards[1]) {
                    this.ability.x_mult = this.ability.x_mult + context.cards.length * this.ability.extra;
                    card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }) });
                    return [undefined, true];
                }
            }
            else if (context.first_hand_drawn) {
                if (this.ability.name === "Certificate") {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            let _card = create_playing_card({ front: pseudorandom_element(G.P_CARDS, pseudoseed("cert_fr")), center: G.P_CENTERS.c_base }, G.hand, undefined, undefined, [G.C.SECONDARY_SET.Enhanced]);
                            _card.set_seal(SMODS.poll_seal({ guaranteed: true, type_key: "certsl" }));
                            G.GAME.blind.debuff_card(_card);
                            G.hand.sort();
                            if (context.blueprint_card) {
                                context.blueprint_card.juice_up();
                            }
                            else {
                                this.juice_up();
                            }
                            return true;
                        } }));
                    playing_card_joker_effects([true]);
                    return [undefined, true];
                }
                if (this.ability.name === "DNA" && !context.blueprint) {
                    let eval = function () {
                        return G.GAME.current_round.hands_played === 0;
                    };
                    juice_card_until(this, eval, true);
                }
                if (this.ability.name === "Trading Card" && !context.blueprint) {
                    let eval = function () {
                        return G.GAME.current_round.discards_used === 0 && !G.RESET_JIGGLES;
                    };
                    juice_card_until(this, eval, true);
                }
            }
            else if (context.setting_blind && !this.getting_sliced) {
                if (this.ability.name === "Chicot" && !context.blueprint && context.blind.boss && !this.getting_sliced) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    G.GAME.blind.disable();
                                    play_sound("timpani");
                                    delay(0.4);
                                    return true;
                                } }));
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize("ph_boss_disabled") });
                            return true;
                        } }));
                    return [undefined, true];
                }
                if (this.ability.name === "Madness" && !context.blueprint && !context.blind.boss) {
                    this.ability.x_mult = this.ability.x_mult + this.ability.extra;
                    let destructable_jokers = {};
                    for (let i = 1; i <= G.jokers.cards.length; i++) {
                        if (G.jokers.cards[i] !== this && !G.jokers.cards[i].ability.eternal && !G.jokers.cards[i].getting_sliced) {
                            destructable_jokers[destructable_jokers.length + 1] = G.jokers.cards[i];
                        }
                    }
                    let joker_to_destroy = destructable_jokers.length > 0 && pseudorandom_element(destructable_jokers, pseudoseed("madness")) || undefined;
                    if (joker_to_destroy && !(context.blueprint_card || this).getting_sliced) {
                        joker_to_destroy.getting_sliced = true;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                (context.blueprint_card || this).juice_up(0.8, 0.8);
                                joker_to_destroy.start_dissolve([G.C.RED], undefined, 1.6);
                                return true;
                            } }));
                    }
                    if (!(context.blueprint_card || this).getting_sliced) {
                        card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }) });
                    }
                    return [undefined, true];
                }
                if (this.ability.name === "Burglar" && !(context.blueprint_card || this).getting_sliced) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            ease_discard(-G.GAME.current_round.discards_left, undefined, true);
                            ease_hands_played(this.ability.extra);
                            card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_hands", vars: [this.ability.extra] }) });
                            return true;
                        } }));
                    return [undefined, true];
                }
                if (this.ability.name === "Riff-raff" && !(context.blueprint_card || this).getting_sliced && G.jokers.cards.length + G.GAME.joker_buffer < G.jokers.config.card_limit) {
                    let jokers_to_create = math.min(2, G.jokers.config.card_limit - (G.jokers.cards.length + G.GAME.joker_buffer));
                    G.GAME.joker_buffer = G.GAME.joker_buffer + jokers_to_create;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            for (let i = 1; i <= jokers_to_create; i++) {
                                let card = create_card("Joker", G.jokers, undefined, 0, undefined, undefined, undefined, "rif");
                                card.add_to_deck();
                                G.jokers.emplace(card);
                                card.start_materialize();
                                G.GAME.joker_buffer = 0;
                            }
                            return true;
                        } }));
                    card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_plus_joker"), colour: G.C.BLUE });
                    return [undefined, true];
                }
                if (this.ability.name === "Cartomancer" && !(context.blueprint_card || this).getting_sliced && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                    G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    let card = create_card("Tarot", G.consumeables, undefined, undefined, undefined, undefined, undefined, "car");
                                    card.add_to_deck();
                                    G.consumeables.emplace(card);
                                    G.GAME.consumeable_buffer = 0;
                                    return true;
                                } }));
                            card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_plus_tarot"), colour: G.C.PURPLE });
                            return true;
                        } }));
                    return [undefined, true];
                }
                if (this.ability.name === "Ceremonial Dagger" && !context.blueprint) {
                    let my_pos = undefined;
                    for (let i = 1; i <= G.jokers.cards.length; i++) {
                        if (G.jokers.cards[i] === this) {
                            my_pos = i;
                            break;
                        }
                    }
                    if (my_pos && G.jokers.cards[my_pos + 1] && !this.getting_sliced && !G.jokers.cards[my_pos + 1].ability.eternal && !G.jokers.cards[my_pos + 1].getting_sliced) {
                        let sliced_card = G.jokers.cards[my_pos + 1];
                        sliced_card.getting_sliced = true;
                        G.GAME.joker_buffer = G.GAME.joker_buffer - 1;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.GAME.joker_buffer = 0;
                                this.ability.mult = this.ability.mult + sliced_card.sell_cost * 2;
                                this.juice_up(0.8, 0.8);
                                sliced_card.start_dissolve([HEX("57ecab")], undefined, 1.6);
                                play_sound("slice1", 0.96 + math.random() * 0.08);
                                return true;
                            } }));
                        card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult + 2 * sliced_card.sell_cost] }), colour: G.C.RED, no_juice: true });
                        return [undefined, true];
                    }
                }
                if (this.ability.name === "Marble Joker" && !(context.blueprint_card || this).getting_sliced) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            let front = pseudorandom_element(G.P_CARDS, pseudoseed("marb_fr"));
                            G.playing_card = G.playing_card && G.playing_card + 1 || 1;
                            let card = new Card(G.play.T.x + G.play.T.w / 2, G.play.T.y, G.CARD_W, G.CARD_H, front, G.P_CENTERS.m_stone, { playing_card: G.playing_card });
                            card.start_materialize([G.C.SECONDARY_SET.Enhanced]);
                            G.play.emplace(card);
                            table.insert(G.playing_cards, card);
                            return true;
                        } }));
                    card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_plus_stone"), colour: G.C.SECONDARY_SET.Enhanced });
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.deck.config.card_limit = G.deck.config.card_limit + 1;
                            return true;
                        } }));
                    draw_card(G.play, G.deck, 90, "up", undefined);
                    playing_card_joker_effects([true]);
                    return [undefined, true];
                }
                return;
            }
            else if (context.destroying_card && !context.blueprint) {
                if (this.ability.name === "Sixth Sense" && context.full_hand.length === 1 && context.full_hand[1].get_id() === 6 && G.GAME.current_round.hands_played === 0) {
                    if (G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                        G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                                let card = create_card("Spectral", G.consumeables, undefined, undefined, undefined, undefined, undefined, "sixth");
                                card.add_to_deck();
                                G.consumeables.emplace(card);
                                G.GAME.consumeable_buffer = 0;
                                return true;
                            } }));
                        card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_plus_spectral"), colour: G.C.SECONDARY_SET.Spectral });
                    }
                    return true;
                }
                return undefined;
            }
            else if (context.cards_destroyed) {
                if (this.ability.name === "Caino" && !context.blueprint) {
                    let faces = 0;
                    for (const [k, v] of ipairs(context.glass_shattered)) {
                        if (v.is_face()) {
                            faces = faces + 1;
                        }
                    }
                    if (faces > 0) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        this.ability.caino_xmult = this.ability.caino_xmult + faces * this.ability.extra;
                                        return true;
                                    } }));
                                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.caino_xmult + faces * this.ability.extra] }) });
                                return true;
                            } }));
                    }
                    return;
                }
                if (this.ability.name === "Glass Joker" && !context.blueprint) {
                    let glasses = 0;
                    for (const [k, v] of ipairs(context.glass_shattered)) {
                        if (v.shattered) {
                            glasses = glasses + 1;
                        }
                    }
                    if (glasses > 0) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        this.ability.x_mult = this.ability.x_mult + this.ability.extra * glasses;
                                        return true;
                                    } }));
                                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult + this.ability.extra * glasses] }) });
                                return true;
                            } }));
                    }
                    return;
                }
            }
            else if (context.remove_playing_cards) {
                if (this.ability.name === "Caino" && !context.blueprint) {
                    let face_cards = 0;
                    for (const [k, val] of ipairs(context.removed)) {
                        if (val.is_face()) {
                            face_cards = face_cards + 1;
                        }
                    }
                    if (face_cards > 0) {
                        this.ability.caino_xmult = this.ability.caino_xmult + face_cards * this.ability.extra;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.caino_xmult] }) });
                                return true;
                            } }));
                        return [undefined, true];
                    }
                    return;
                }
                if (this.ability.name === "Glass Joker" && !context.blueprint) {
                    let glass_cards = 0;
                    for (const [k, val] of ipairs(context.removed)) {
                        if (val.shattered) {
                            glass_cards = glass_cards + 1;
                        }
                    }
                    if (glass_cards > 0) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        this.ability.x_mult = this.ability.x_mult + this.ability.extra * glass_cards;
                                        return true;
                                    } }));
                                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult + this.ability.extra * glass_cards] }) });
                                return true;
                            } }));
                        return [undefined, true];
                    }
                    return;
                }
            }
            else if (context.using_consumeable) {
                if (this.ability.name === "Glass Joker" && !context.blueprint && context.consumeable.ability.name === "The Hanged Man") {
                    let shattered_glass = 0;
                    for (const [k, val] of ipairs(G.hand.highlighted)) {
                        if (SMODS.has_enhancement(val, "m_glass")) {
                            shattered_glass = shattered_glass + 1;
                        }
                    }
                    if (shattered_glass > 0) {
                        this.ability.x_mult = this.ability.x_mult + this.ability.extra * shattered_glass;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }) });
                                return true;
                            } }));
                        return [undefined, true];
                    }
                    return;
                }
                if (this.ability.name === "Fortune Teller" && !context.blueprint && context.consumeable.ability.set === "Tarot") {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_mult", vars: [G.GAME.consumeable_usage_total.tarot] }) });
                            return true;
                        } }));
                    return [undefined, true];
                }
                if (this.ability.name === "Constellation" && !context.blueprint && context.consumeable.ability.set === "Planet") {
                    this.ability.x_mult = this.ability.x_mult + this.ability.extra;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            card_eval_status_text(this, "extra", undefined, undefined, undefined, { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }) });
                            return true;
                        } }));
                    return [undefined, true];
                }
                return;
            }
            else if (context.debuffed_hand) {
                if (this.ability.name === "Matador") {
                    if (G.GAME.blind.triggered) {
                        ease_dollars(this.ability.extra);
                        G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + this.ability.extra;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.GAME.dollar_buffer = 0;
                                return true;
                            } }));
                        return { message: localize("$") + this.ability.extra, colour: G.C.MONEY };
                    }
                }
            }
            else if (context.pre_discard) {
                if (this.ability.name === "Burnt Joker" && G.GAME.current_round.discards_used <= 0 && !context.hook) {
                    let [text, disp_text] = G.FUNCS.get_poker_hand_info(G.hand.highlighted);
                    card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("k_upgrade_ex") });
                    update_hand_text({ sound: "button", volume: 0.7, pitch: 0.8, delay: 0.3 }, { handname: localize(text, "poker_hands"), chips: G.GAME.hands[text].chips, mult: G.GAME.hands[text].mult, level: G.GAME.hands[text].level });
                    level_up_hand(context.blueprint_card || this, text, undefined, 1);
                    update_hand_text({ sound: "button", volume: 0.7, pitch: 1.1, delay: 0 }, { mult: 0, chips: 0, handname: "", level: "" });
                    return [undefined, true];
                }
            }
            else if (context.discard) {
                if (this.ability.name === "Ramen" && !context.blueprint) {
                    if (this.ability.x_mult - this.ability.extra <= 1) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                play_sound("tarot1");
                                this.T.r = -0.2;
                                this.juice_up(0.3, 0.4);
                                this.states.drag.is = true;
                                this.children.center.pinch.x = true;
                                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blockable: false, func: function () {
                                        G.jokers.remove_card(this);
                                        this.remove();
                                        this = undefined;
                                        return true;
                                    } }));
                                return true;
                            } }));
                        return { card: this, message: localize("k_eaten_ex"), colour: G.C.FILTER };
                    }
                    else {
                        this.ability.x_mult = this.ability.x_mult - this.ability.extra;
                        return { delay: 0.2, card: this, message: localize({ type: "variable", key: "a_xmult_minus", vars: [this.ability.extra] }), colour: G.C.RED };
                    }
                }
                if (this.ability.name === "Yorick" && !context.blueprint) {
                    if (this.ability.yorick_discards <= 1) {
                        this.ability.yorick_discards = this.ability.extra.discards;
                        this.ability.x_mult = this.ability.x_mult + this.ability.extra.xmult;
                        return { card: this, delay: 0.2, message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }), colour: G.C.RED };
                    }
                    else {
                        this.ability.yorick_discards = this.ability.yorick_discards - 1;
                        return [undefined, true];
                    }
                    return;
                }
                if (this.ability.name === "Trading Card" && !context.blueprint && G.GAME.current_round.discards_used <= 0 && context.full_hand.length === 1) {
                    ease_dollars(this.ability.extra);
                    return { message: localize("$") + this.ability.extra, colour: G.C.MONEY, delay: 0.45, remove: true, card: this };
                }
                if (this.ability.name === "Castle" && !context.other_card.debuff && context.other_card.is_suit(G.GAME.current_round.castle_card.suit) && !context.blueprint) {
                    this.ability.extra.chips = this.ability.extra.chips + this.ability.extra.chip_mod;
                    return { message: localize("k_upgrade_ex"), card: this, colour: G.C.CHIPS };
                }
                if (this.ability.name === "Mail-In Rebate" && !context.other_card.debuff && context.other_card.get_id() === G.GAME.current_round.mail_card.id) {
                    ease_dollars(this.ability.extra);
                    return { message: localize("$") + this.ability.extra, colour: G.C.MONEY, card: this };
                }
                if (this.ability.name === "Hit the Road" && !context.other_card.debuff && context.other_card.get_id() === 11 && !context.blueprint) {
                    this.ability.x_mult = this.ability.x_mult + this.ability.extra;
                    return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }), colour: G.C.RED, delay: 0.45, card: this };
                }
                if (this.ability.name === "Green Joker" && !context.blueprint && context.other_card === context.full_hand[context.full_hand.length]) {
                    let prev_mult = this.ability.mult;
                    this.ability.mult = math.max(0, this.ability.mult - this.ability.extra.discard_sub);
                    if (this.ability.mult !== prev_mult) {
                        return { message: localize({ type: "variable", key: "a_mult_minus", vars: [this.ability.extra.discard_sub] }), colour: G.C.RED, card: this };
                    }
                }
                if (this.ability.name === "Faceless Joker" && context.other_card === context.full_hand[context.full_hand.length]) {
                    let face_cards = 0;
                    for (const [k, v] of ipairs(context.full_hand)) {
                        if (v.is_face()) {
                            face_cards = face_cards + 1;
                        }
                    }
                    if (face_cards >= this.ability.extra.faces) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                ease_dollars(this.ability.extra.dollars);
                                card_eval_status_text(context.blueprint_card || this, "extra", undefined, undefined, undefined, { message: localize("$") + this.ability.extra.dollars, colour: G.C.MONEY, delay: 0.45 });
                                return true;
                            } }));
                        return [undefined, true];
                    }
                }
                return;
            }
            else if (context.end_of_round) {
                if (context.individual) { }
                else if (context.repetition) {
                    if (context.cardarea === G.hand) {
                        if (this.ability.name === "Mime" && (next(context.card_effects[1]) || context.card_effects.length > 1)) {
                            return { message: localize("k_again_ex"), repetitions: this.ability.extra, card: this };
                        }
                    }
                }
                else if (!context.blueprint) {
                    if (this.ability.name === "Campfire" && G.GAME.blind.boss && this.ability.x_mult > 1) {
                        this.ability.x_mult = 1;
                        return { message: localize("k_reset"), colour: G.C.RED };
                    }
                    if (this.ability.name === "Rocket" && G.GAME.blind.boss) {
                        this.ability.extra.dollars = this.ability.extra.dollars + this.ability.extra.increase;
                        return { message: localize("k_upgrade_ex"), colour: G.C.MONEY };
                    }
                    if (this.ability.name === "Turtle Bean" && !context.blueprint) {
                        if (this.ability.extra.h_size - this.ability.extra.h_mod <= 0) {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    play_sound("tarot1");
                                    this.T.r = -0.2;
                                    this.juice_up(0.3, 0.4);
                                    this.states.drag.is = true;
                                    this.children.center.pinch.x = true;
                                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blockable: false, func: function () {
                                            G.jokers.remove_card(this);
                                            this.remove();
                                            this = undefined;
                                            return true;
                                        } }));
                                    return true;
                                } }));
                            return { card: this, message: localize("k_eaten_ex"), colour: G.C.FILTER };
                        }
                        else {
                            this.ability.extra.h_size = this.ability.extra.h_size - this.ability.extra.h_mod;
                            G.hand.change_size(-this.ability.extra.h_mod);
                            return { message: localize({ type: "variable", key: "a_handsize_minus", vars: [this.ability.extra.h_mod] }), colour: G.C.FILTER };
                        }
                    }
                    if (this.ability.name === "Invisible Joker" && !context.blueprint) {
                        this.ability.invis_rounds = this.ability.invis_rounds + 1;
                        if (this.ability.invis_rounds === this.ability.extra) {
                            let eval = function (card) {
                                return !card.REMOVED;
                            };
                            juice_card_until(this, eval, true);
                        }
                        return { message: this.ability.invis_rounds < this.ability.extra && this.ability.invis_rounds + ("/" + this.ability.extra) || localize("k_active_ex"), colour: G.C.FILTER };
                    }
                    if (this.ability.name === "Popcorn" && !context.blueprint) {
                        if (this.ability.mult - this.ability.extra <= 0) {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    play_sound("tarot1");
                                    this.T.r = -0.2;
                                    this.juice_up(0.3, 0.4);
                                    this.states.drag.is = true;
                                    this.children.center.pinch.x = true;
                                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blockable: false, func: function () {
                                            G.jokers.remove_card(this);
                                            this.remove();
                                            this = undefined;
                                            return true;
                                        } }));
                                    return true;
                                } }));
                            return { message: localize("k_eaten_ex"), colour: G.C.RED };
                        }
                        else {
                            this.ability.mult = this.ability.mult - this.ability.extra;
                            return { message: localize({ type: "variable", key: "a_mult_minus", vars: [this.ability.extra] }), colour: G.C.MULT };
                        }
                    }
                    if (this.ability.name === "To Do List" && !context.blueprint) {
                        let _poker_hands = {};
                        for (const [k, v] of pairs(G.GAME.hands)) {
                            if (v.visible && k !== this.ability.to_do_poker_hand) {
                                _poker_hands[_poker_hands.length + 1] = k;
                            }
                        }
                        this.ability.to_do_poker_hand = pseudorandom_element(_poker_hands, pseudoseed("to_do"));
                        return { message: localize("k_reset") };
                    }
                    if (this.ability.name === "Egg") {
                        this.ability.extra_value = this.ability.extra_value + this.ability.extra;
                        this.set_cost();
                        return { message: localize("k_val_up"), colour: G.C.MONEY };
                    }
                    if (this.ability.name === "Gift Card") {
                        for (const [k, v] of ipairs(G.jokers.cards)) {
                            if (v.set_cost) {
                                v.ability.extra_value = (v.ability.extra_value || 0) + this.ability.extra;
                                v.set_cost();
                            }
                        }
                        for (const [k, v] of ipairs(G.consumeables.cards)) {
                            if (v.set_cost) {
                                v.ability.extra_value = (v.ability.extra_value || 0) + this.ability.extra;
                                v.set_cost();
                            }
                        }
                        return { message: localize("k_val_up"), colour: G.C.MONEY };
                    }
                    if (this.ability.name === "Hit the Road" && this.ability.x_mult > 1) {
                        this.ability.x_mult = 1;
                        return { message: localize("k_reset"), colour: G.C.RED };
                    }
                    if (this.ability.name === "Gros Michel" || this.ability.name === "Cavendish") {
                        if (pseudorandom(this.ability.name === "Cavendish" && "cavendish" || "gros_michel") < G.GAME.probabilities.normal / this.ability.extra.odds) {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    play_sound("tarot1");
                                    this.T.r = -0.2;
                                    this.juice_up(0.3, 0.4);
                                    this.states.drag.is = true;
                                    this.children.center.pinch.x = true;
                                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blockable: false, func: function () {
                                            G.jokers.remove_card(this);
                                            this.remove();
                                            this = undefined;
                                            return true;
                                        } }));
                                    return true;
                                } }));
                            if (this.ability.name === "Gros Michel") {
                                G.GAME.pool_flags.gros_michel_extinct = true;
                            }
                            return { message: localize("k_extinct_ex") };
                        }
                        else {
                            return { message: localize("k_safe_ex") };
                        }
                    }
                    if (this.ability.name === "Mr. Bones" && context.game_over && G.GAME.chips / G.GAME.blind.chips >= 0.25) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.hand_text_area.blind_chips.juice_up();
                                G.hand_text_area.game_chips.juice_up();
                                play_sound("tarot1");
                                this.start_dissolve();
                                return true;
                            } }));
                        return { message: localize("k_saved_ex"), saved: true, colour: G.C.RED };
                    }
                }
            }
            else if (context.individual) {
                if (context.cardarea === G.play) {
                    if (this.ability.name === "Hiker") {
                        context.other_card.ability.perma_bonus = context.other_card.ability.perma_bonus || 0;
                        context.other_card.ability.perma_bonus = context.other_card.ability.perma_bonus + this.ability.extra;
                        return { extra: { message: localize("k_upgrade_ex"), colour: G.C.CHIPS }, colour: G.C.CHIPS, card: this };
                    }
                    if (this.ability.name === "Lucky Cat" && context.other_card.lucky_trigger && !context.blueprint) {
                        this.ability.x_mult = this.ability.x_mult + this.ability.extra;
                        return { extra: { focus: this, message: localize("k_upgrade_ex"), colour: G.C.MULT }, card: this };
                    }
                    if (this.ability.name === "Wee Joker" && context.other_card.get_id() === 2 && !context.blueprint) {
                        this.ability.extra.chips = this.ability.extra.chips + this.ability.extra.chip_mod;
                        return { extra: { focus: this, message: localize("k_upgrade_ex") }, card: this, colour: G.C.CHIPS };
                    }
                    if (this.ability.name === "Photograph") {
                        let first_face = undefined;
                        for (let i = 1; i <= context.scoring_hand.length; i++) {
                            if (context.scoring_hand[i].is_face()) {
                                first_face = context.scoring_hand[i];
                                break;
                            }
                        }
                        if (context.other_card === first_face) {
                            return { x_mult: this.ability.extra, colour: G.C.RED, card: this };
                        }
                    }
                    if (this.ability.name === "8 Ball" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                        if (context.other_card.get_id() === 8 && pseudorandom("8ball") < G.GAME.probabilities.normal / this.ability.extra) {
                            G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                            return { extra: { focus: this, message: localize("k_plus_tarot"), func: function () {
                                        G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                                                let card = create_card("Tarot", G.consumeables, undefined, undefined, undefined, undefined, undefined, "8ba");
                                                card.add_to_deck();
                                                G.consumeables.emplace(card);
                                                G.GAME.consumeable_buffer = 0;
                                                return true;
                                            } }));
                                    } }, colour: G.C.SECONDARY_SET.Tarot, card: this };
                        }
                    }
                    if (this.ability.name === "The Idol" && context.other_card.get_id() === G.GAME.current_round.idol_card.id && context.other_card.is_suit(G.GAME.current_round.idol_card.suit)) {
                        return { x_mult: this.ability.extra, colour: G.C.RED, card: this };
                    }
                    if (this.ability.name === "Scary Face" && context.other_card.is_face()) {
                        return { chips: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Smiley Face" && context.other_card.is_face()) {
                        return { mult: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Golden Ticket" && SMODS.has_enhancement(context.other_card, "m_gold")) {
                        G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + this.ability.extra;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.GAME.dollar_buffer = 0;
                                return true;
                            } }));
                        return { dollars: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Scholar" && context.other_card.get_id() === 14) {
                        return { chips: this.ability.extra.chips, mult: this.ability.extra.mult, card: this };
                    }
                    if (this.ability.name === "Walkie Talkie" && (context.other_card.get_id() === 10 || context.other_card.get_id() === 4)) {
                        return { chips: this.ability.extra.chips, mult: this.ability.extra.mult, card: this };
                    }
                    if (this.ability.name === "Business Card" && context.other_card.is_face() && pseudorandom("business") < G.GAME.probabilities.normal / this.ability.extra) {
                        G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + 2;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.GAME.dollar_buffer = 0;
                                return true;
                            } }));
                        return { dollars: 2, card: this };
                    }
                    if (this.ability.name === "Fibonacci" && (context.other_card.get_id() === 2 || context.other_card.get_id() === 3 || context.other_card.get_id() === 5 || context.other_card.get_id() === 8 || context.other_card.get_id() === 14)) {
                        return { mult: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Even Steven" && context.other_card.get_id() <= 10 && context.other_card.get_id() >= 0 && context.other_card.get_id() % 2 === 0) {
                        return { mult: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Odd Todd" && (context.other_card.get_id() <= 10 && context.other_card.get_id() >= 0 && context.other_card.get_id() % 2 === 1 || context.other_card.get_id() === 14)) {
                        return { chips: this.ability.extra, card: this };
                    }
                    if (this.ability.effect === "Suit Mult" && context.other_card.is_suit(this.ability.extra.suit)) {
                        return { mult: this.ability.extra.s_mult, card: this };
                    }
                    if (this.ability.name === "Rough Gem" && context.other_card.is_suit("Diamonds")) {
                        G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + this.ability.extra;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.GAME.dollar_buffer = 0;
                                return true;
                            } }));
                        return { dollars: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Onyx Agate" && context.other_card.is_suit("Clubs")) {
                        return { mult: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Arrowhead" && context.other_card.is_suit("Spades")) {
                        return { chips: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Bloodstone" && context.other_card.is_suit("Hearts") && pseudorandom("bloodstone") < G.GAME.probabilities.normal / this.ability.extra.odds) {
                        return { x_mult: this.ability.extra.Xmult, card: this };
                    }
                    if (this.ability.name === "Ancient Joker" && context.other_card.is_suit(G.GAME.current_round.ancient_card.suit)) {
                        return { x_mult: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Triboulet" && (context.other_card.get_id() === 12 || context.other_card.get_id() === 13)) {
                        return { x_mult: this.ability.extra, colour: G.C.RED, card: this };
                    }
                }
                if (context.cardarea === G.hand) {
                    if (this.ability.name === "Shoot the Moon" && context.other_card.get_id() === 12) {
                        if (context.other_card.debuff) {
                            return { message: localize("k_debuffed"), colour: G.C.RED, card: this };
                        }
                        else {
                            return { h_mult: 13, card: this };
                        }
                    }
                    if (this.ability.name === "Baron" && context.other_card.get_id() === 13) {
                        if (context.other_card.debuff) {
                            return { message: localize("k_debuffed"), colour: G.C.RED, card: this };
                        }
                        else {
                            return { x_mult: this.ability.extra, card: this };
                        }
                    }
                    if (this.ability.name === "Reserved Parking" && context.other_card.is_face() && pseudorandom("parking") < G.GAME.probabilities.normal / this.ability.extra.odds) {
                        if (context.other_card.debuff) {
                            return { message: localize("k_debuffed"), colour: G.C.RED, card: this };
                        }
                        else {
                            G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + this.ability.extra.dollars;
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    G.GAME.dollar_buffer = 0;
                                    return true;
                                } }));
                            return { dollars: this.ability.extra.dollars, card: this };
                        }
                    }
                    if (this.ability.name === "Raised Fist") {
                        let [temp_Mult, temp_ID] = [15, 15];
                        let raised_card = undefined;
                        for (let i = 1; i <= G.hand.cards.length; i++) {
                            if (temp_ID >= G.hand.cards[i].base.id && !SMODS.has_no_rank(G.hand.cards[i])) {
                                temp_Mult = G.hand.cards[i].base.nominal;
                                temp_ID = G.hand.cards[i].base.id;
                                raised_card = G.hand.cards[i];
                            }
                        }
                        if (raised_card === context.other_card) {
                            if (context.other_card.debuff) {
                                return { message: localize("k_debuffed"), colour: G.C.RED, card: this };
                            }
                            else {
                                return { h_mult: 2 * temp_Mult, card: this };
                            }
                        }
                    }
                }
            }
            else if (context.repetition) {
                if (context.cardarea === G.play) {
                    if (this.ability.name === "Sock and Buskin" && context.other_card.is_face()) {
                        return { message: localize("k_again_ex"), repetitions: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Hanging Chad" && context.other_card === context.scoring_hand[1]) {
                        return { message: localize("k_again_ex"), repetitions: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Dusk" && G.GAME.current_round.hands_left === 0) {
                        return { message: localize("k_again_ex"), repetitions: this.ability.extra, card: this };
                    }
                    if (this.ability.name === "Seltzer") {
                        return { message: localize("k_again_ex"), repetitions: 1, card: this };
                    }
                    if (this.ability.name === "Hack" && (context.other_card.get_id() === 2 || context.other_card.get_id() === 3 || context.other_card.get_id() === 4 || context.other_card.get_id() === 5)) {
                        return { message: localize("k_again_ex"), repetitions: this.ability.extra, card: this };
                    }
                }
                if (context.cardarea === G.hand) {
                    if (this.ability.name === "Mime" && (next(context.card_effects[1]) || context.card_effects.length > 1)) {
                        return { message: localize("k_again_ex"), repetitions: this.ability.extra, card: this };
                    }
                }
            }
            else if (context.other_joker) {
                if (this.ability.name === "Baseball Card" && (context.other_joker.config.center.rarity === 2 || context.other_joker.config.center.rarity === "Uncommon") && this !== context.other_joker) {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            context.other_joker.juice_up(0.5, 0.5);
                            return true;
                        } }));
                    return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra] }), Xmult_mod: this.ability.extra };
                }
            }
            else {
                if (context.cardarea === G.jokers) {
                    if (context.before) {
                        if (this.ability.name === "Spare Trousers" && (next(context.poker_hands["Two Pair"]) || next(context.poker_hands["Full House"])) && !context.blueprint) {
                            this.ability.mult = this.ability.mult + this.ability.extra;
                            return { message: localize("k_upgrade_ex"), colour: G.C.RED, card: this };
                        }
                        if (this.ability.name === "Space Joker" && pseudorandom("space") < G.GAME.probabilities.normal / this.ability.extra) {
                            return { card: this, level_up: true, message: localize("k_level_up_ex") };
                        }
                        if (this.ability.name === "Square Joker" && context.full_hand.length === 4 && !context.blueprint) {
                            this.ability.extra.chips = this.ability.extra.chips + this.ability.extra.chip_mod;
                            return { message: localize("k_upgrade_ex"), colour: G.C.CHIPS, card: this };
                        }
                        if (this.ability.name === "Runner" && next(context.poker_hands["Straight"]) && !context.blueprint) {
                            this.ability.extra.chips = this.ability.extra.chips + this.ability.extra.chip_mod;
                            return { message: localize("k_upgrade_ex"), colour: G.C.CHIPS, card: this };
                        }
                        if (this.ability.name === "Midas Mask" && !context.blueprint) {
                            let faces = {};
                            for (const [k, v] of ipairs(context.scoring_hand)) {
                                if (v.is_face()) {
                                    faces[faces.length + 1] = v;
                                    v.set_ability(G.P_CENTERS.m_gold, undefined, true);
                                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                            v.juice_up();
                                            return true;
                                        } }));
                                }
                            }
                            if (faces.length > 0) {
                                return { message: localize("k_gold"), colour: G.C.MONEY, card: this };
                            }
                        }
                        if (this.ability.name === "Vampire" && !context.blueprint) {
                            let enhanced = {};
                            for (const [k, v] of ipairs(context.scoring_hand)) {
                                if (v.config.center !== G.P_CENTERS.c_base && !v.debuff && !v.vampired) {
                                    enhanced[enhanced.length + 1] = v;
                                    v.vampired = true;
                                    v.set_ability(G.P_CENTERS.c_base, undefined, true);
                                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                            v.juice_up();
                                            v.vampired = undefined;
                                            return true;
                                        } }));
                                }
                            }
                            if (enhanced.length > 0) {
                                this.ability.x_mult = this.ability.x_mult + this.ability.extra * enhanced.length;
                                return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }), colour: G.C.MULT, card: this };
                            }
                        }
                        if (this.ability.name === "To Do List" && context.scoring_name === this.ability.to_do_poker_hand) {
                            ease_dollars(this.ability.extra.dollars);
                            G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + this.ability.extra.dollars;
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    G.GAME.dollar_buffer = 0;
                                    return true;
                                } }));
                            return { message: localize("$") + this.ability.extra.dollars, colour: G.C.MONEY };
                        }
                        if (this.ability.name === "DNA" && G.GAME.current_round.hands_played === 0) {
                            if (context.full_hand.length === 1) {
                                G.playing_card = G.playing_card && G.playing_card + 1 || 1;
                                let _card = copy_card(context.full_hand[1], undefined, undefined, G.playing_card);
                                _card.add_to_deck();
                                G.deck.config.card_limit = G.deck.config.card_limit + 1;
                                table.insert(G.playing_cards, _card);
                                G.hand.emplace(_card);
                                _card.states.visible = undefined;
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        _card.start_materialize();
                                        return true;
                                    } }));
                                return { message: localize("k_copied_ex"), colour: G.C.CHIPS, card: this, playing_cards_created: [true] };
                            }
                        }
                        if (this.ability.name === "Ride the Bus" && !context.blueprint) {
                            let faces = false;
                            for (let i = 1; i <= context.scoring_hand.length; i++) {
                                if (context.scoring_hand[i].is_face()) {
                                    faces = true;
                                }
                            }
                            if (faces) {
                                let last_mult = this.ability.mult;
                                this.ability.mult = 0;
                                if (last_mult > 0) {
                                    return { card: this, message: localize("k_reset") };
                                }
                            }
                            else {
                                this.ability.mult = this.ability.mult + this.ability.extra;
                            }
                        }
                        if (this.ability.name === "Obelisk" && !context.blueprint) {
                            let reset = true;
                            let play_more_than = G.GAME.hands[context.scoring_name].played || 0;
                            for (const [k, v] of pairs(G.GAME.hands)) {
                                if (k !== context.scoring_name && v.played >= play_more_than && v.visible) {
                                    reset = false;
                                }
                            }
                            if (reset) {
                                if (this.ability.x_mult > 1) {
                                    this.ability.x_mult = 1;
                                    return { card: this, message: localize("k_reset") };
                                }
                            }
                            else {
                                this.ability.x_mult = this.ability.x_mult + this.ability.extra;
                            }
                        }
                        if (this.ability.name === "Green Joker" && !context.blueprint) {
                            this.ability.mult = this.ability.mult + this.ability.extra.hand_add;
                            return { card: this, message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra.hand_add] }) };
                        }
                    }
                    else if (context.after) {
                        if (this.ability.name === "Ice Cream" && !context.blueprint) {
                            if (this.ability.extra.chips - this.ability.extra.chip_mod <= 0) {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        play_sound("tarot1");
                                        this.T.r = -0.2;
                                        this.juice_up(0.3, 0.4);
                                        this.states.drag.is = true;
                                        this.children.center.pinch.x = true;
                                        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blockable: false, func: function () {
                                                G.jokers.remove_card(this);
                                                this.remove();
                                                this = undefined;
                                                return true;
                                            } }));
                                        return true;
                                    } }));
                                return { message: localize("k_melted_ex"), colour: G.C.CHIPS };
                            }
                            else {
                                this.ability.extra.chips = this.ability.extra.chips - this.ability.extra.chip_mod;
                                return { message: localize({ type: "variable", key: "a_chips_minus", vars: [this.ability.extra.chip_mod] }), colour: G.C.CHIPS };
                            }
                        }
                        if (this.ability.name === "Seltzer" && !context.blueprint) {
                            if (this.ability.extra - 1 <= 0) {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        play_sound("tarot1");
                                        this.T.r = -0.2;
                                        this.juice_up(0.3, 0.4);
                                        this.states.drag.is = true;
                                        this.children.center.pinch.x = true;
                                        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.3, blockable: false, func: function () {
                                                G.jokers.remove_card(this);
                                                this.remove();
                                                this = undefined;
                                                return true;
                                            } }));
                                        return true;
                                    } }));
                                return { message: localize("k_drank_ex"), colour: G.C.FILTER };
                            }
                            else {
                                this.ability.extra = this.ability.extra - 1;
                                return { message: this.ability.extra + "", colour: G.C.FILTER };
                            }
                        }
                    }
                    else if (context.joker_main) {
                        if (this.ability.name === "Loyalty Card") {
                            this.ability.loyalty_remaining = (this.ability.extra.every - 1 - (G.GAME.hands_played - this.ability.hands_played_at_create)) % (this.ability.extra.every + 1);
                            if (context.blueprint) {
                                if (this.ability.loyalty_remaining === this.ability.extra.every) {
                                    return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra.Xmult] }), Xmult_mod: this.ability.extra.Xmult };
                                }
                            }
                            else {
                                if (this.ability.loyalty_remaining === 0) {
                                    let eval = function (card) {
                                        return card.ability.loyalty_remaining === 0;
                                    };
                                    juice_card_until(this, eval, true);
                                }
                                else if (this.ability.loyalty_remaining === this.ability.extra.every) {
                                    return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra.Xmult] }), Xmult_mod: this.ability.extra.Xmult };
                                }
                            }
                        }
                        if (this.ability.name !== "Seeing Double" && this.ability.x_mult > 1 && (this.ability.type === "" || next(context.poker_hands[this.ability.type]))) {
                            return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }), colour: G.C.RED, Xmult_mod: this.ability.x_mult };
                        }
                        if (this.ability.t_mult > 0 && next(context.poker_hands[this.ability.type])) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.t_mult] }), mult_mod: this.ability.t_mult };
                        }
                        if (this.ability.t_chips > 0 && next(context.poker_hands[this.ability.type])) {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.t_chips] }), chip_mod: this.ability.t_chips };
                        }
                        if (this.ability.name === "Half Joker" && context.full_hand.length <= this.ability.extra.size) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra.mult] }), mult_mod: this.ability.extra.mult };
                        }
                        if (this.ability.name === "Abstract Joker") {
                            let x = 0;
                            for (let i = 1; i <= G.jokers.cards.length; i++) {
                                if (G.jokers.cards[i].ability.set === "Joker") {
                                    x = x + 1;
                                }
                            }
                            return { message: localize({ type: "variable", key: "a_mult", vars: [x * this.ability.extra] }), mult_mod: x * this.ability.extra };
                        }
                        if (this.ability.name === "Acrobat" && G.GAME.current_round.hands_left === 0) {
                            return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra] }), Xmult_mod: this.ability.extra };
                        }
                        if (this.ability.name === "Mystic Summit" && G.GAME.current_round.discards_left === this.ability.extra.d_remaining) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra.mult] }), mult_mod: this.ability.extra.mult };
                        }
                        if (this.ability.name === "Misprint") {
                            let temp_Mult = pseudorandom("misprint", this.ability.extra.min, this.ability.extra.max);
                            return { message: localize({ type: "variable", key: "a_mult", vars: [temp_Mult] }), mult_mod: temp_Mult };
                        }
                        if (this.ability.name === "Banner" && G.GAME.current_round.discards_left > 0) {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [G.GAME.current_round.discards_left * this.ability.extra] }), chip_mod: G.GAME.current_round.discards_left * this.ability.extra };
                        }
                        if (this.ability.name === "Stuntman") {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra.chip_mod] }), chip_mod: this.ability.extra.chip_mod };
                        }
                        if (this.ability.name === "Matador") {
                            if (G.GAME.blind.triggered) {
                                ease_dollars(this.ability.extra);
                                G.GAME.dollar_buffer = (G.GAME.dollar_buffer || 0) + this.ability.extra;
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        G.GAME.dollar_buffer = 0;
                                        return true;
                                    } }));
                                return { message: localize("$") + this.ability.extra, colour: G.C.MONEY };
                            }
                        }
                        if (this.ability.name === "Supernova") {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [G.GAME.hands[context.scoring_name].played] }), mult_mod: G.GAME.hands[context.scoring_name].played };
                        }
                        if (this.ability.name === "Ceremonial Dagger" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Vagabond" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                            if (G.GAME.dollars <= this.ability.extra) {
                                G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                                        let card = create_card("Tarot", G.consumeables, undefined, undefined, undefined, undefined, undefined, "vag");
                                        card.add_to_deck();
                                        G.consumeables.emplace(card);
                                        G.GAME.consumeable_buffer = 0;
                                        return true;
                                    } }));
                                return { message: localize("k_plus_tarot"), card: this };
                            }
                        }
                        if (this.ability.name === "Superposition" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                            let aces = 0;
                            for (let i = 1; i <= context.scoring_hand.length; i++) {
                                if (context.scoring_hand[i].get_id() === 14) {
                                    aces = aces + 1;
                                }
                            }
                            if (aces >= 1 && next(context.poker_hands["Straight"])) {
                                let card_type = "Tarot";
                                G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                                        let card = create_card(card_type, G.consumeables, undefined, undefined, undefined, undefined, undefined, "sup");
                                        card.add_to_deck();
                                        G.consumeables.emplace(card);
                                        G.GAME.consumeable_buffer = 0;
                                        return true;
                                    } }));
                                return { message: localize("k_plus_tarot"), colour: G.C.SECONDARY_SET.Tarot, card: this };
                            }
                        }
                        if (this.ability.name === "Seance" && G.consumeables.cards.length + G.GAME.consumeable_buffer < G.consumeables.config.card_limit) {
                            if (next(context.poker_hands[this.ability.extra.poker_hand])) {
                                G.GAME.consumeable_buffer = G.GAME.consumeable_buffer + 1;
                                G.E_MANAGER.add_event(new GameEvent({ trigger: "before", delay: 0, func: function () {
                                        let card = create_card("Spectral", G.consumeables, undefined, undefined, undefined, undefined, undefined, "sea");
                                        card.add_to_deck();
                                        G.consumeables.emplace(card);
                                        G.GAME.consumeable_buffer = 0;
                                        return true;
                                    } }));
                                return { message: localize("k_plus_spectral"), colour: G.C.SECONDARY_SET.Spectral, card: this };
                            }
                        }
                        if (this.ability.name === "Flower Pot") {
                            let suits = { ["Hearts"]: 0, ["Diamonds"]: 0, ["Spades"]: 0, ["Clubs"]: 0 };
                            for (let i = 1; i <= context.scoring_hand.length; i++) {
                                if (!SMODS.has_any_suit(context.scoring_hand[i])) {
                                    if (context.scoring_hand[i].is_suit("Hearts", true) && suits["Hearts"] === 0) {
                                        suits["Hearts"] = suits["Hearts"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Diamonds", true) && suits["Diamonds"] === 0) {
                                        suits["Diamonds"] = suits["Diamonds"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Spades", true) && suits["Spades"] === 0) {
                                        suits["Spades"] = suits["Spades"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Clubs", true) && suits["Clubs"] === 0) {
                                        suits["Clubs"] = suits["Clubs"] + 1;
                                    }
                                }
                            }
                            for (let i = 1; i <= context.scoring_hand.length; i++) {
                                if (SMODS.has_any_suit(context.scoring_hand[i])) {
                                    if (context.scoring_hand[i].is_suit("Hearts") && suits["Hearts"] === 0) {
                                        suits["Hearts"] = suits["Hearts"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Diamonds") && suits["Diamonds"] === 0) {
                                        suits["Diamonds"] = suits["Diamonds"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Spades") && suits["Spades"] === 0) {
                                        suits["Spades"] = suits["Spades"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Clubs") && suits["Clubs"] === 0) {
                                        suits["Clubs"] = suits["Clubs"] + 1;
                                    }
                                }
                            }
                            if (suits["Hearts"] > 0 && suits["Diamonds"] > 0 && suits["Spades"] > 0 && suits["Clubs"] > 0) {
                                return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra] }), Xmult_mod: this.ability.extra };
                            }
                        }
                        if (this.ability.name === "Seeing Double") {
                            let suits = { ["Hearts"]: 0, ["Diamonds"]: 0, ["Spades"]: 0, ["Clubs"]: 0 };
                            for (let i = 1; i <= context.scoring_hand.length; i++) {
                                if (!SMODS.has_any_suit(context.scoring_hand[i])) {
                                    if (context.scoring_hand[i].is_suit("Hearts")) {
                                        suits["Hearts"] = suits["Hearts"] + 1;
                                    }
                                    if (context.scoring_hand[i].is_suit("Diamonds")) {
                                        suits["Diamonds"] = suits["Diamonds"] + 1;
                                    }
                                    if (context.scoring_hand[i].is_suit("Spades")) {
                                        suits["Spades"] = suits["Spades"] + 1;
                                    }
                                    if (context.scoring_hand[i].is_suit("Clubs")) {
                                        suits["Clubs"] = suits["Clubs"] + 1;
                                    }
                                }
                            }
                            for (let i = 1; i <= context.scoring_hand.length; i++) {
                                if (SMODS.has_any_suit(context.scoring_hand[i])) {
                                    if (context.scoring_hand[i].is_suit("Clubs") && suits["Clubs"] === 0) {
                                        suits["Clubs"] = suits["Clubs"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Diamonds") && suits["Diamonds"] === 0) {
                                        suits["Diamonds"] = suits["Diamonds"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Spades") && suits["Spades"] === 0) {
                                        suits["Spades"] = suits["Spades"] + 1;
                                    }
                                    else if (context.scoring_hand[i].is_suit("Hearts") && suits["Hearts"] === 0) {
                                        suits["Hearts"] = suits["Hearts"] + 1;
                                    }
                                }
                            }
                            if ((suits["Hearts"] > 0 || suits["Diamonds"] > 0 || suits["Spades"] > 0) && suits["Clubs"] > 0) {
                                return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra] }), Xmult_mod: this.ability.extra };
                            }
                        }
                        if (this.ability.name === "Wee Joker") {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra.chips] }), chip_mod: this.ability.extra.chips, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Castle" && this.ability.extra.chips > 0) {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra.chips] }), chip_mod: this.ability.extra.chips, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Blue Joker" && G.deck.cards.length > 0) {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra * G.deck.cards.length] }), chip_mod: this.ability.extra * G.deck.cards.length, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Erosion" && G.GAME.starting_deck_size - G.playing_cards.length > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra * (G.GAME.starting_deck_size - G.playing_cards.length)] }), mult_mod: this.ability.extra * (G.GAME.starting_deck_size - G.playing_cards.length), colour: G.C.MULT };
                        }
                        if (this.ability.name === "Square Joker") {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra.chips] }), chip_mod: this.ability.extra.chips, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Runner") {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra.chips] }), chip_mod: this.ability.extra.chips, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Ice Cream") {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra.chips] }), chip_mod: this.ability.extra.chips, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Stone Joker" && this.ability.stone_tally > 0) {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra * this.ability.stone_tally] }), chip_mod: this.ability.extra * this.ability.stone_tally, colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Steel Joker" && this.ability.steel_tally > 0) {
                            return { message: localize({ type: "variable", key: "a_xmult", vars: [1 + this.ability.extra * this.ability.steel_tally] }), Xmult_mod: 1 + this.ability.extra * this.ability.steel_tally, colour: G.C.MULT };
                        }
                        if (this.ability.name === "Bull" && G.GAME.dollars + (G.GAME.dollar_buffer || 0) > 0) {
                            return { message: localize({ type: "variable", key: "a_chips", vars: [this.ability.extra * math.max(0, G.GAME.dollars + (G.GAME.dollar_buffer || 0))] }), chip_mod: this.ability.extra * math.max(0, G.GAME.dollars + (G.GAME.dollar_buffer || 0)), colour: G.C.CHIPS };
                        }
                        if (this.ability.name === "Driver's License") {
                            if ((this.ability.driver_tally || 0) >= 16) {
                                return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra] }), Xmult_mod: this.ability.extra };
                            }
                        }
                        if (this.ability.name === "Blackboard") {
                            let [black_suits, all_cards] = [0, 0];
                            for (const [k, v] of ipairs(G.hand.cards)) {
                                all_cards = all_cards + 1;
                                if (v.is_suit("Clubs", undefined, true) || v.is_suit("Spades", undefined, true)) {
                                    black_suits = black_suits + 1;
                                }
                            }
                            if (black_suits === all_cards) {
                                return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra] }), Xmult_mod: this.ability.extra };
                            }
                        }
                        if (this.ability.name === "Joker Stencil") {
                            if (G.jokers.config.card_limit - G.jokers.cards.length > 0) {
                                return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.x_mult] }), Xmult_mod: this.ability.x_mult };
                            }
                        }
                        if (this.ability.name === "Swashbuckler" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Joker") {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Spare Trousers" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Ride the Bus" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Flash Card" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Popcorn" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Green Joker" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Fortune Teller" && G.GAME.consumeable_usage_total && G.GAME.consumeable_usage_total.tarot > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [G.GAME.consumeable_usage_total.tarot] }), mult_mod: G.GAME.consumeable_usage_total.tarot };
                        }
                        if (this.ability.name === "Gros Michel") {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra.mult] }), mult_mod: this.ability.extra.mult };
                        }
                        if (this.ability.name === "Cavendish") {
                            return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra.Xmult] }), Xmult_mod: this.ability.extra.Xmult };
                        }
                        if (this.ability.name === "Red Card" && this.ability.mult > 0) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.mult] }), mult_mod: this.ability.mult };
                        }
                        if (this.ability.name === "Card Sharp" && G.GAME.hands[context.scoring_name] && G.GAME.hands[context.scoring_name].played_this_round > 1) {
                            return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.extra.Xmult] }), Xmult_mod: this.ability.extra.Xmult };
                        }
                        if (this.ability.name === "Bootstraps" && math.floor((G.GAME.dollars + (G.GAME.dollar_buffer || 0)) / this.ability.extra.dollars) >= 1) {
                            return { message: localize({ type: "variable", key: "a_mult", vars: [this.ability.extra.mult * math.floor((G.GAME.dollars + (G.GAME.dollar_buffer || 0)) / this.ability.extra.dollars)] }), mult_mod: this.ability.extra.mult * math.floor((G.GAME.dollars + (G.GAME.dollar_buffer || 0)) / this.ability.extra.dollars) };
                        }
                        if (this.ability.name === "Caino" && this.ability.caino_xmult > 1) {
                            return { message: localize({ type: "variable", key: "a_xmult", vars: [this.ability.caino_xmult] }), Xmult_mod: this.ability.caino_xmult };
                        }
                    }
                }
            }
        }
    };
    is_suit(suit, bypass_debuff, flush_calc) {
        if (flush_calc) {
            if (SMODS.has_no_suit(this)) {
                return false;
            }
            if (SMODS.has_any_suit(this) && !this.debuff) {
                return true;
            }
            if (next(find_joker("Smeared Joker")) && (this.base.suit === "Hearts" || this.base.suit === "Diamonds") === (suit === "Hearts" || suit === "Diamonds")) {
                return true;
            }
            return this.base.suit === suit;
        }
        else {
            if (this.debuff && !bypass_debuff) {
                return;
            }
            if (SMODS.has_no_suit(this)) {
                return false;
            }
            if (SMODS.has_any_suit(this)) {
                return true;
            }
            if (next(find_joker("Smeared Joker")) && (this.base.suit === "Hearts" || this.base.suit === "Diamonds") === (suit === "Hearts" || suit === "Diamonds")) {
                return true;
            }
            return this.base.suit === suit;
        }
    };
    set_card_area(area) {
        this.area = area;
        this.parent = area;
        this.layered_parallax = area.layered_parallax;
    };
    remove_from_area() {
        this.area = undefined;
        this.parent = undefined;
        this.layered_parallax = { x: 0, y: 0 };
    };
    align() {
        if (this.children.floating_sprite) {
            this.children.floating_sprite.T.y = this.T.y;
            this.children.floating_sprite.T.x = this.T.x;
            this.children.floating_sprite.T.r = this.T.r;
        }
        if (this.children.focused_ui) {
            this.children.focused_ui.set_alignment();
        }
    };
    flip() {
        if (this.facing === "front") {
            this.flipping = "f2b";
            this.facing = "back";
            this.pinch.x = true;
        }
        else if (this.facing === "back") {
            this.ability.wheel_flipped = undefined;
            this.flipping = "b2f";
            this.facing = "front";
            this.pinch.x = true;
        }
    };
    update(dt) {
        if (this.flipping === "f2b") {
            if (this.sprite_facing === "front" || true) {
                if (this.VT.w <= 0) {
                    this.sprite_facing = "back";
                    this.pinch.x = false;
                }
            }
        }
        if (this.flipping === "b2f") {
            if (this.sprite_facing === "back" || true) {
                if (this.VT.w <= 0) {
                    this.sprite_facing = "front";
                    this.pinch.x = false;
                }
            }
        }
        if (!this.states.focus.is && this.children.focused_ui) {
            this.children.focused_ui.remove();
            this.children.focused_ui = undefined;
        }
        this.update_alert();
        if (this.ability.set === "Joker" && !this.sticker_run) {
            this.sticker_run = get_joker_win_sticker(this.config.center) || "NONE";
        }
        if (this.ability.consumeable && this.ability.consumeable.max_highlighted) {
            this.ability.consumeable.mod_num = math.min(5, this.ability.consumeable.max_highlighted);
        }
        let obj = this.config.center;
        if (obj.update && type(obj.update) === "function") {
            obj.update(this, dt);
        }
        let obj = G.P_SEALS[this.seal] || {};
        if (obj.update && type(obj.update) === "function") {
            obj.update(this, dt);
        }
        if (G.STAGE === G.STAGES.RUN) {
            if (this.ability && this.ability.perma_debuff) {
                this.debuff = true;
            }
            if (this.area && (this.area === G.jokers || this.area === G.consumeables)) {
                this.bypass_lock = true;
                this.bypass_discovery_center = true;
                this.bypass_discovery_ui = true;
            }
            this.sell_cost_label = this.facing === "back" && "?" || this.sell_cost;
            if (this.ability.name === "Temperance") {
                this.ability.money = 0;
                for (let i = 1; i <= G.jokers.cards.length; i++) {
                    if (G.jokers.cards[i].ability.set === "Joker") {
                        this.ability.money = this.ability.money + G.jokers.cards[i].sell_cost;
                    }
                }
                this.ability.money = math.min(this.ability.money, this.ability.extra);
            }
            if (this.ability.name === "Throwback") {
                this.ability.x_mult = 1 + G.GAME.skips * this.ability.extra;
            }
            if (this.ability.name === "Driver's License") {
                this.ability.driver_tally = 0;
                for (const [k, v] of pairs(G.playing_cards)) {
                    if (next(SMODS.get_enhancements(v))) {
                        this.ability.driver_tally = this.ability.driver_tally + 1;
                    }
                }
            }
            if (this.ability.name === "Steel Joker") {
                this.ability.steel_tally = 0;
                for (const [k, v] of pairs(G.playing_cards)) {
                    if (SMODS.has_enhancement(v, "m_steel")) {
                        this.ability.steel_tally = this.ability.steel_tally + 1;
                    }
                }
            }
            if (this.ability.name === "Cloud 9") {
                this.ability.nine_tally = 0;
                for (const [k, v] of pairs(G.playing_cards)) {
                    if (v.get_id() === 9) {
                        this.ability.nine_tally = this.ability.nine_tally + 1;
                    }
                }
            }
            if (this.ability.name === "Stone Joker") {
                this.ability.stone_tally = 0;
                for (const [k, v] of pairs(G.playing_cards)) {
                    if (SMODS.has_enhancement(v, "m_stone")) {
                        this.ability.stone_tally = this.ability.stone_tally + 1;
                    }
                }
            }
            if (this.ability.name === "Joker Stencil") {
                this.ability.x_mult = G.jokers.config.card_limit - G.jokers.cards.length;
                for (let i = 1; i <= G.jokers.cards.length; i++) {
                    if (G.jokers.cards[i].ability.name === "Joker Stencil") {
                        this.ability.x_mult = this.ability.x_mult + 1;
                    }
                }
            }
            if (this.ability.name === "The Wheel of Fortune") {
                this.eligible_strength_jokers = EMPTY(this.eligible_strength_jokers);
                for (const [k, v] of pairs(G.jokers.cards)) {
                    if (v.ability.set === "Joker" && !v.edition) {
                        table.insert(this.eligible_strength_jokers, v);
                    }
                }
            }
            if (this.ability.name === "Ectoplasm" || this.ability.name === "Hex") {
                this.eligible_editionless_jokers = EMPTY(this.eligible_editionless_jokers);
                for (const [k, v] of pairs(G.jokers.cards)) {
                    if (v.ability.set === "Joker" && !v.edition) {
                        table.insert(this.eligible_editionless_jokers, v);
                    }
                }
            }
            if (this.ability.name === "Blueprint" || this.ability.name === "Brainstorm") {
                let other_joker = undefined;
                if (this.ability.name === "Brainstorm") {
                    other_joker = G.jokers.cards[1];
                }
                else if (this.ability.name === "Blueprint") {
                    for (let i = 1; i <= G.jokers.cards.length; i++) {
                        if (G.jokers.cards[i] === this) {
                            other_joker = G.jokers.cards[i + 1];
                        }
                    }
                }
                if (other_joker && other_joker !== this && other_joker.config.center.blueprint_compat) {
                    this.ability.blueprint_compat = "compatible";
                }
                else {
                    this.ability.blueprint_compat = "incompatible";
                }
            }
            if (this.ability.name === "Swashbuckler") {
                let sell_cost = 0;
                for (let i = 1; i <= G.jokers.cards.length; i++) {
                    if (G.jokers.cards[i] !== this && (G.jokers.cards[i].area && G.jokers.cards[i].area === G.jokers)) {
                        sell_cost = sell_cost + G.jokers.cards[i].sell_cost;
                    }
                }
                this.ability.mult = sell_cost;
            }
        }
        else {
            if (this.ability.name === "Temperance") {
                this.ability.money = 0;
            }
        }
    };
    hard_set_T(X, Y, W, H) {
        let x = X || this.T.x;
        let y = Y || this.T.y;
        let w = W || this.T.w;
        let h = H || this.T.h;
        Moveable.hard_set_T(this, x, y, w, h);
        if (this.children.front) {
            this.children.front.hard_set_T(x, y, w, h);
        }
        this.children.back.hard_set_T(x, y, w, h);
        this.children.center.hard_set_T(x, y, w, h);
    };
    move(dt) {
        Moveable.move(this, dt);
        if (this.children.h_popup) {
            this.children.h_popup.set_alignment(this.align_h_popup());
        }
    };
    align_h_popup() {
        let focused_ui = this.children.focused_ui && true || false;
        let popup_direction = (this.children.buy_button || this.area && this.area.config.view_deck || this.area && this.area.config.type === "shop") && "cl" || this.T.y < G.CARD_H * 0.8 && "bm" || "tm";
        return { major: this.children.focused_ui || this, parent: this, xy_bond: "Strong", r_bond: "Weak", wh_bond: "Weak", offset: { x: popup_direction !== "cl" && 0 || focused_ui && -0.05 || this.ability.consumeable && 0 || this.ability.set === "Voucher" && 0 || -0.05, y: focused_ui && (popup_direction === "tm" && (this.area && this.area === G.hand && -0.08 || -0.15) || popup_direction === "bm" && 0.12 || 0) || popup_direction === "tm" && -0.13 || popup_direction === "bm" && 0.1 || 0 }, type: popup_direction };
    };
    hover() {
        this.juice_up(0.05, 0.03);
        play_sound("paper1", math.random() * 0.2 + 0.9, 0.35);
        if (this.states.focus.is && !this.children.focused_ui) {
            this.children.focused_ui = G.UIDEF.card_focus_ui(this);
        }
        if (this.facing === "front" && (!this.states.drag.is || G.CONTROLLER.HID.touch) && !this.no_ui && !G.debug_tooltip_toggle) {
            if (this.children.alert && !this.config.center.alerted) {
                this.config.center.alerted = true;
                G.save_progress();
            }
            else if (this.children.alert && this.seal && !G.P_SEALS[this.seal].alerted) {
                G.P_SEALS[this.seal].alerted = true;
                G.save_progress();
            }
            this.ability_UIBox_table = this.generate_UIBox_ability_table();
            this.config.h_popup = G.UIDEF.card_h_popup(this);
            this.config.h_popup_config = this.align_h_popup();
            Node.hover(this);
        }
    };
    stop_hover() {
        Node.stop_hover(this);
    };
    juice_up(scale, rot_amount) {
        let rot_amt = rot_amount && 0.4 * (math.random() > 0.5 && 1 || -1) * rot_amount || (math.random() > 0.5 && 1 || -1) * 0.16;
        scale = scale && scale * 0.4 || 0.11;
        Moveable.juice_up(this, scale, rot_amt);
    };
    draw(layer) {
        layer = layer || "both";
        this.hover_tilt = 1;
        if (!this.states.visible) {
            return;
        }
        if (layer === "shadow" || layer === "both") {
            this.ARGS.send_to_shader = this.ARGS.send_to_shader || {};
            this.ARGS.send_to_shader[1] = math.min(this.VT.r * 3, 1) + math.sin(G.TIMERS.REAL / 28) + 1 + (this.juice && this.juice.r * 20 || 0) + this.tilt_var.amt;
            this.ARGS.send_to_shader[2] = G.TIMERS.REAL;
            for (const [k, v] of pairs(this.children)) {
                v.VT.scale = this.VT.scale;
            }
        }
        G.shared_shadow = this.sprite_facing === "front" && this.children.center || this.children.back;
        if (!this.no_shadow && G.SETTINGS.GRAPHICS.shadows === "On" && ((layer === "shadow" || layer === "both") && (this.ability.effect !== "Glass Card" && !this.greyed && this.should_draw_shadow()) && (this.area && this.area !== G.discard && this.area.config.type !== "deck" || !this.area || this.states.drag.is))) {
            this.shadow_height = 0 * (0.08 + 0.4 * math.sqrt(this.velocity.x ^ 2)) + ((this.highlighted && this.area === G.play || this.states.drag.is) && 0.35 || this.area && this.area.config.type === "title_2" && 0.04 || 0.1);
            G.shared_shadow.draw_shader("dissolve", this.shadow_height);
        }
        if ((layer === "card" || layer === "both") && this.area !== G.hand) {
            if (this.children.focused_ui) {
                this.children.focused_ui.draw();
            }
        }
        if (layer === "card" || layer === "both") {
            this.tilt_var = this.tilt_var || { mx: 0, my: 0, dx: this.tilt_var.dx || 0, dy: this.tilt_var.dy || 0, amt: 0 };
            let tilt_factor = 0.3;
            if (this.states.focus.is) {
                [this.tilt_var.mx, this.tilt_var.my] = [G.CONTROLLER.cursor_position.x + this.tilt_var.dx * this.T.w * G.TILESCALE * G.TILESIZE, G.CONTROLLER.cursor_position.y + this.tilt_var.dy * this.T.h * G.TILESCALE * G.TILESIZE];
                this.tilt_var.amt = math.abs(this.hover_offset.y + this.hover_offset.x - 1 + this.tilt_var.dx + this.tilt_var.dy - 1) * tilt_factor;
            }
            else if (this.states.hover.is) {
                [this.tilt_var.mx, this.tilt_var.my] = [G.CONTROLLER.cursor_position.x, G.CONTROLLER.cursor_position.y];
                this.tilt_var.amt = math.abs(this.hover_offset.y + this.hover_offset.x - 1) * tilt_factor;
            }
            else if (this.ambient_tilt) {
                let tilt_angle = G.TIMERS.REAL * (1.56 + this.ID / 1.14212 % 1) + this.ID / 1.35122;
                this.tilt_var.mx = ((0.5 + 0.5 * this.ambient_tilt * math.cos(tilt_angle)) * this.VT.w + this.VT.x + G.ROOM.T.x) * G.TILESIZE * G.TILESCALE;
                this.tilt_var.my = ((0.5 + 0.5 * this.ambient_tilt * math.sin(tilt_angle)) * this.VT.h + this.VT.y + G.ROOM.T.y) * G.TILESIZE * G.TILESCALE;
                this.tilt_var.amt = this.ambient_tilt * (0.5 + math.cos(tilt_angle)) * tilt_factor;
            }
            if (this.children.particles) {
                this.children.particles.draw();
            }
            if (this.children.price) {
                this.children.price.draw();
            }
            if (this.children.buy_button) {
                if (this.highlighted) {
                    this.children.buy_button.states.visible = true;
                    this.children.buy_button.draw();
                    if (this.children.buy_and_use_button) {
                        this.children.buy_and_use_button.draw();
                    }
                }
                else {
                    this.children.buy_button.states.visible = false;
                }
            }
            if (this.children.use_button && this.highlighted) {
                this.children.use_button.draw();
            }
            if (this.vortex) {
                if (this.facing === "back") {
                    this.children.back.draw_shader("vortex");
                }
                else {
                    this.children.center.draw_shader("vortex");
                    if (this.children.front) {
                        this.children.front.draw_shader("vortex");
                    }
                }
                love.graphics.setShader();
            }
            else if (this.sprite_facing === "front") {
                if (this.edition && this.edition.negative || this.ability.name === "Antimatter" && (this.config.center.discovered || this.bypass_discovery_center)) {
                    this.children.center.draw_shader("negative", undefined, this.ARGS.send_to_shader);
                    if (this.children.front && this.ability.effect !== "Stone Card" && !this.config.center.replace_base_card) {
                        this.children.front.draw_shader("negative", undefined, this.ARGS.send_to_shader);
                    }
                }
                else if (!this.should_draw_base_shader()) { }
                else if (!this.greyed) {
                    this.children.center.draw_shader("dissolve");
                    if (this.children.front && this.ability.effect !== "Stone Card" && !this.config.center.replace_base_card) {
                        this.children.front.draw_shader("dissolve");
                    }
                }
                if (!this.config.center.discovered && (this.ability.consumeable || this.config.center.unlocked) && !this.config.center.demo && !this.bypass_discovery_center) {
                    let shared_sprite = (this.ability.set === "Edition" || this.ability.set === "Joker") && G.shared_undiscovered_joker || G.shared_undiscovered_tarot;
                    let scale_mod = -0.05 + 0.05 * math.sin(1.8 * G.TIMERS.REAL);
                    let rotate_mod = 0.03 * math.sin(1.219 * G.TIMERS.REAL);
                    shared_sprite.role.draw_major = this;
                    if (this.config.center.undiscovered && !this.config.center.undiscovered.no_overlay || !(SMODS.UndiscoveredSprites[this.ability.set] && SMODS.UndiscoveredSprites[this.ability.set].no_overlay)) {
                        shared_sprite.draw_shader("dissolve", undefined, undefined, undefined, this.children.center, scale_mod, rotate_mod);
                    }
                    else {
                        if (SMODS.UndiscoveredSprites[this.ability.set] && SMODS.UndiscoveredSprites[this.ability.set].overlay_sprite) {
                            SMODS.UndiscoveredSprites[this.ability.set].overlay_sprite.draw_shader("dissolve", undefined, undefined, undefined, this.children.center, scale_mod, rotate_mod);
                        }
                    }
                }
                if (this.ability.name === "Invisible Joker" && (this.config.center.discovered || this.bypass_discovery_center)) {
                    if (this.should_draw_base_shader()) {
                        this.children.center.draw_shader("voucher", undefined, this.ARGS.send_to_shader);
                    }
                }
                let center = this.config.center;
                if (center.draw && type(center.draw) === "function") {
                    center.draw(this, layer);
                }
                if (center.set === "Default" || center.set === "Enhanced" && !center.replace_base_card) {
                    if (!center.no_suit) {
                        let suit = SMODS.Suits[this.base.suit] || {};
                        if (suit.draw && type(suit.draw) === "function") {
                            suit.draw(this, layer);
                        }
                    }
                    if (!center.no_rank) {
                        let rank = SMODS.Ranks[this.base.value] || {};
                        if (rank.draw && type(rank.draw) === "function") {
                            rank.draw(this, layer);
                        }
                    }
                }
                if (true) {
                    if ((this.ability.set === "Voucher" || this.config.center.demo) && (this.ability.name !== "Antimatter" || !(this.config.center.discovered || this.bypass_discovery_center))) {
                        if (this.should_draw_base_shader()) {
                            this.children.center.draw_shader("voucher", undefined, this.ARGS.send_to_shader);
                        }
                    }
                    if ((this.ability.set === "Booster" || this.ability.set === "Spectral") && this.should_draw_base_shader()) {
                        this.children.center.draw_shader("booster", undefined, this.ARGS.send_to_shader);
                    }
                    if (this.edition) {
                        for (const [k, v] of pairs(G.P_CENTER_POOLS.Edition)) {
                            if (this.edition[v.key.sub(3)] && v.shader) {
                                if (type(v.draw) === "function") {
                                    v.draw(this, layer);
                                }
                                else {
                                    this.children.center.draw_shader(v.shader, undefined, this.ARGS.send_to_shader);
                                    if (this.children.front && this.ability.effect !== "Stone Card" && !this.config.center.replace_base_card) {
                                        this.children.front.draw_shader(v.shader, undefined, this.ARGS.send_to_shader);
                                    }
                                }
                            }
                        }
                    }
                    if (this.edition && this.edition.negative || this.ability.name === "Antimatter" && (this.config.center.discovered || this.bypass_discovery_center)) {
                        this.children.center.draw_shader("negative_shine", undefined, this.ARGS.send_to_shader);
                    }
                    let seal = G.P_SEALS[this.seal || {}] || {};
                    if (type(seal.draw) === "function") {
                        seal.draw(this, layer);
                    }
                    else if (this.seal) {
                        G.shared_seals[this.seal].role.draw_major = this;
                        G.shared_seals[this.seal].draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                        if (this.seal === "Gold") {
                            G.shared_seals[this.seal].draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                        }
                    }
                    if (this.ability.eternal) {
                        G.shared_sticker_eternal.role.draw_major = this;
                        G.shared_sticker_eternal.draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                        G.shared_sticker_eternal.draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                    }
                    if (this.ability.perishable) {
                        G.shared_sticker_perishable.role.draw_major = this;
                        G.shared_sticker_perishable.draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                        G.shared_sticker_perishable.draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                    }
                    if (this.ability.rental) {
                        G.shared_sticker_rental.role.draw_major = this;
                        G.shared_sticker_rental.draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                        G.shared_sticker_rental.draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                    }
                    if (this.sticker && G.shared_stickers[this.sticker]) {
                        G.shared_stickers[this.sticker].role.draw_major = this;
                        G.shared_stickers[this.sticker].draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                        G.shared_stickers[this.sticker].draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                    }
                    else if (this.sticker_run && G.shared_stickers[this.sticker_run] && G.SETTINGS.run_stake_stickers) {
                        G.shared_stickers[this.sticker_run].role.draw_major = this;
                        G.shared_stickers[this.sticker_run].draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                        G.shared_stickers[this.sticker_run].draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                    }
                    for (const [k, v] of pairs(SMODS.Stickers)) {
                        if (this.ability[v.key]) {
                            if (v && v.draw && type(v.draw) === "function") {
                                v.draw(this, layer);
                            }
                            else {
                                G.shared_stickers[v.key].role.draw_major = this;
                                G.shared_stickers[v.key].draw_shader("dissolve", undefined, undefined, undefined, this.children.center);
                                G.shared_stickers[v.key].draw_shader("voucher", undefined, this.ARGS.send_to_shader, undefined, this.children.center);
                            }
                        }
                    }
                    if (this.ability.name === "The Soul" && (this.config.center.discovered || this.bypass_discovery_center)) {
                        let scale_mod = 0.05 + 0.05 * math.sin(1.8 * G.TIMERS.REAL) + 0.07 * math.sin((G.TIMERS.REAL - math.floor(G.TIMERS.REAL)) * math.pi * 14) * (1 - (G.TIMERS.REAL - math.floor(G.TIMERS.REAL)) ^ 3);
                        let rotate_mod = 0.1 * math.sin(1.219 * G.TIMERS.REAL) + 0.07 * math.sin(G.TIMERS.REAL * math.pi * 5) * (1 - (G.TIMERS.REAL - math.floor(G.TIMERS.REAL)) ^ 2);
                        G.shared_soul.role.draw_major = this;
                        G.shared_soul.draw_shader("dissolve", 0, undefined, undefined, this.children.center, scale_mod, rotate_mod, undefined, 0.1 + 0.03 * math.sin(1.8 * G.TIMERS.REAL), undefined, 0.6);
                        G.shared_soul.draw_shader("dissolve", undefined, undefined, undefined, this.children.center, scale_mod, rotate_mod);
                    }
                    if (this.config.center.soul_pos && (this.config.center.discovered || this.bypass_discovery_center)) {
                        let scale_mod = 0.07 + 0.02 * math.sin(1.8 * G.TIMERS.REAL) + 0 * math.sin((G.TIMERS.REAL - math.floor(G.TIMERS.REAL)) * math.pi * 14) * (1 - (G.TIMERS.REAL - math.floor(G.TIMERS.REAL)) ^ 3);
                        let rotate_mod = 0.05 * math.sin(1.219 * G.TIMERS.REAL) + 0 * math.sin(G.TIMERS.REAL * math.pi * 5) * (1 - (G.TIMERS.REAL - math.floor(G.TIMERS.REAL)) ^ 2);
                        if (this.ability.name === "Hologram") {
                            this.hover_tilt = this.hover_tilt * 1.5;
                            this.children.floating_sprite.draw_shader("hologram", undefined, this.ARGS.send_to_shader, undefined, this.children.center, 2 * scale_mod, 2 * rotate_mod);
                            this.hover_tilt = this.hover_tilt / 1.5;
                        }
                        else {
                            this.children.floating_sprite.draw_shader("dissolve", 0, undefined, undefined, this.children.center, scale_mod, rotate_mod, undefined, 0.1 + 0.03 * math.sin(1.8 * G.TIMERS.REAL), undefined, 0.6);
                            this.children.floating_sprite.draw_shader("dissolve", undefined, undefined, undefined, this.children.center, scale_mod, rotate_mod);
                            if (this.edition) {
                                for (const [k, v] of pairs(G.P_CENTER_POOLS.Edition)) {
                                    if (v.apply_to_float) {
                                        if (this.edition[v.key.sub(3)]) {
                                            this.children.floating_sprite.draw_shader(v.shader, undefined, undefined, undefined, this.children.center, scale_mod, rotate_mod);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (this.debuff) {
                        this.children.center.draw_shader("debuff", undefined, this.ARGS.send_to_shader);
                        if (this.children.front && this.ability.effect !== "Stone Card" && !this.config.center.replace_base_card) {
                            this.children.front.draw_shader("debuff", undefined, this.ARGS.send_to_shader);
                        }
                    }
                    if (this.greyed) {
                        this.children.center.draw_shader("played", undefined, this.ARGS.send_to_shader);
                        if (this.children.front && this.ability.effect !== "Stone Card" && !this.config.center.replace_base_card) {
                            this.children.front.draw_shader("played", undefined, this.ARGS.send_to_shader);
                        }
                    }
                }
            }
            else if (this.sprite_facing === "back") {
                let overlay = G.C.WHITE;
                if (this.area && this.area.config.type === "deck" && this.rank > 3) {
                    this.back_overlay = this.back_overlay || {};
                    this.back_overlay[1] = 0.5 + (this.area.cards.length - this.rank) % 7 / 50;
                    this.back_overlay[2] = 0.5 + (this.area.cards.length - this.rank) % 7 / 50;
                    this.back_overlay[3] = 0.5 + (this.area.cards.length - this.rank) % 7 / 50;
                    this.back_overlay[4] = 1;
                    overlay = this.back_overlay;
                }
                if (this.area && this.area.config.type === "deck") {
                    this.children.back.draw(overlay);
                }
                else {
                    this.children.back.draw_shader("dissolve");
                }
                if (this.sticker && G.shared_stickers[this.sticker]) {
                    G.shared_stickers[this.sticker].role.draw_major = this;
                    G.shared_stickers[this.sticker].draw_shader("dissolve", undefined, undefined, true, this.children.center);
                    if (this.sticker === "Gold") {
                        G.shared_stickers[this.sticker].draw_shader("voucher", undefined, this.ARGS.send_to_shader, true, this.children.center);
                    }
                }
            }
            for (const [k, v] of pairs(this.children)) {
                if (!v.custom_draw && k !== "focused_ui" && k !== "front" && k !== "back" && k !== "soul_parts" && k !== "center" && k !== "floating_sprite" && k !== "shadow" && k !== "use_button" && k !== "buy_button" && k !== "buy_and_use_button" && k !== "debuff" && k !== "price" && k !== "particles" && k !== "h_popup") {
                    v.draw();
                }
            }
            if ((layer === "card" || layer === "both") && this.area === G.hand) {
                if (this.children.focused_ui) {
                    this.children.focused_ui.draw();
                }
            }
            add_to_drawhash(this);
            this.draw_boundingrect();
        }
    };
    release(dragged) {
        if (dragged.is(Card) && this.area) {
            this.area.release(dragged);
        }
    };
    highlight(is_higlighted) {
        this.highlighted = is_higlighted;
        if (this.ability.consumeable || this.ability.set === "Joker" || this.area && this.area === G.pack_cards) {
            if (this.highlighted && this.area && this.area.config.type !== "shop") {
                let x_off = this.ability.consumeable && -0.1 || 0;
                this.children.use_button = new UIBox({ definition: G.UIDEF.use_and_sell_buttons(this), config: { align: (this.area === G.jokers || this.area === G.consumeables) && "cr" || "bmi", offset: (this.area === G.jokers || this.area === G.consumeables) && { x: x_off - 0.4, y: 0 } || { x: 0, y: 0.65 }, parent: this } });
            }
            else if (this.children.use_button) {
                this.children.use_button.remove();
                this.children.use_button = undefined;
            }
        }
        if (this.ability.consumeable || this.ability.set === "Joker") {
            if (!this.highlighted && this.area && this.area.config.type === "joker" && (G.jokers.cards.length >= G.jokers.config.card_limit || this.edition && this.edition.negative)) {
                if (G.shop_jokers) {
                    G.shop_jokers.unhighlight_all();
                }
            }
        }
    };
    click() {
        if (this.area && this.area.can_highlight(this)) {
            if (this.area === G.hand && G.STATE === G.STATES.HAND_PLAYED) {
                return;
            }
            if (this.highlighted !== true) {
                this.area.add_to_highlighted(this);
            }
            else {
                this.area.remove_from_highlighted(this);
                play_sound("cardSlide2", undefined, 0.3);
            }
        }
        if (this.area && this.area === G.deck && this.area.cards[1] === this) {
            G.FUNCS.deck_info();
        }
    };
    save() {
        cardTable = { sort_id: this.sort_id, save_fields: { center: this.config.center_key, card: this.config.card_key }, params: this.params, no_ui: this.no_ui, base_cost: this.base_cost, extra_cost: this.extra_cost, cost: this.cost, sell_cost: this.sell_cost, facing: this.facing, sprite_facing: this.facing, flipping: undefined, highlighted: this.highligted, debuff: this.debuff, rank: this.rank, added_to_deck: this.added_to_deck, joker_added_to_deck_but_debuffed: this.joker_added_to_deck_but_debuffed, label: this.label, playing_card: this.playing_card, base: this.base, ability: this.ability, pinned: this.pinned, edition: this.edition, seal: this.seal, bypass_discovery_center: this.bypass_discovery_center, bypass_discovery_ui: this.bypass_discovery_ui, bypass_lock: this.bypass_lock, unique_val: this.unique_val, unique_val__saved_ID: this.ID, ignore_base_shader: this.ignore_base_shader, ignore_shadow: this.ignore_shadow };
        return cardTable;
    };
    load(cardTable, other_card) {
        let scale = 1;
        this.config = {};
        this.config.center_key = cardTable.save_fields.center;
        this.config.center = G.P_CENTERS[this.config.center_key];
        this.params = cardTable.params;
        this.sticker_run = undefined;
        let H = G.CARD_H;
        let W = G.CARD_W;
        let obj = this.config.center;
        if (obj.load && type(obj.load) === "function") {
            obj.load(this, cardTable, other_card);
        }
        else if (this.config.center.name === "Half Joker") {
            this.T.h = H * scale / 1.7 * scale;
            this.T.w = W * scale;
        }
        else if (this.config.center.name === "Wee Joker") {
            this.T.h = H * scale * 0.7 * scale;
            this.T.w = W * scale * 0.7 * scale;
        }
        else if (this.config.center.name === "Photograph") {
            this.T.h = H * scale / 1.2 * scale;
            this.T.w = W * scale;
        }
        else if (this.config.center.name === "Square Joker") {
            H = W;
            this.T.h = H * scale;
            this.T.w = W * scale;
        }
        else if (this.config.center.set === "Booster") {
            this.T.h = H * 1.27;
            this.T.w = W * 1.27;
        }
        else {
            this.T.h = H * scale;
            this.T.w = W * scale;
        }
        if (this.config.center.display_size && this.config.center.display_size.h) {
            this.T.h = H * (this.config.center.display_size.h / 95);
        }
        else if (this.config.center.pixel_size && this.config.center.pixel_size.h) {
            this.T.h = H * (this.config.center.pixel_size.h / 95);
        }
        if (this.config.center.display_size && this.config.center.display_size.w) {
            this.T.w = W * (this.config.center.display_size.w / 71);
        }
        else if (this.config.center.pixel_size && this.config.center.pixel_size.w) {
            this.T.w = W * (this.config.center.pixel_size.w / 71);
        }
        this.VT.h = this.T.H;
        this.VT.w = this.T.w;
        this.config.card_key = cardTable.save_fields.card;
        this.config.card = G.P_CARDS[this.config.card_key];
        this.no_ui = cardTable.no_ui;
        this.base_cost = cardTable.base_cost;
        this.extra_cost = cardTable.extra_cost;
        this.cost = cardTable.cost;
        this.sell_cost = cardTable.sell_cost;
        this.facing = cardTable.facing;
        this.sprite_facing = cardTable.sprite_facing;
        this.flipping = cardTable.flipping;
        this.highlighted = cardTable.highlighted;
        this.debuff = cardTable.debuff;
        this.rank = cardTable.rank;
        this.added_to_deck = cardTable.added_to_deck;
        this.label = cardTable.label;
        this.playing_card = cardTable.playing_card;
        this.base = cardTable.base;
        this.sort_id = cardTable.sort_id;
        this.bypass_discovery_center = cardTable.bypass_discovery_center;
        this.bypass_discovery_ui = cardTable.bypass_discovery_ui;
        this.bypass_lock = cardTable.bypass_lock;
        this.unique_val = cardTable.unique_val || this.unique_val;
        if (cardTable.unique_val__saved_ID && G.ID <= cardTable.unique_val__saved_ID) {
            G.ID = cardTable.unique_val__saved_ID + 1;
        }
        this.ignore_base_shader = cardTable.ignore_base_shader || {};
        this.ignore_shadow = cardTable.ignore_shadow || {};
        this.ability = cardTable.ability;
        this.pinned = cardTable.pinned;
        this.edition = cardTable.edition;
        this.seal = cardTable.seal;
        remove_all(this.children);
        this.children = {};
        this.children.shadow = Moveable(0, 0, 0, 0);
        this.set_sprites(this.config.center, this.config.card);
    };
    remove() {
        this.removed = true;
        if (this.area) {
            this.area.remove_card(this);
        }
        this.remove_from_deck();
        if (this.ability.joker_added_to_deck_but_debuffed) {
            if (this.edition && this.edition.card_limit) {
                if (this.ability.consumeable) {
                    G.consumeables.config.card_limit = G.consumeables.config.card_limit - this.edition.card_limit;
                }
                else if (this.ability.set === "Joker") {
                    G.jokers.config.card_limit = G.jokers.config.card_limit - this.edition.card_limit;
                }
            }
        }
        if (!G.OVERLAY_MENU) {
            if (!next(SMODS.find_card(this.config.center.key, true))) {
                G.GAME.used_jokers[this.config.center.key] = undefined;
            }
        }
        if (G.playing_cards) {
            for (const [k, v] of ipairs(G.playing_cards)) {
                if (v === this) {
                    table.remove(G.playing_cards, k);
                    break;
                }
            }
            for (const [k, v] of ipairs(G.playing_cards)) {
                v.playing_card = k;
            }
        }
        remove_all(this.children);
        for (const [k, v] of pairs(G.I.CARD)) {
            if (v === this) {
                table.remove(G.I.CARD, k);
            }
        }
        Moveable.remove(this);
    };
}