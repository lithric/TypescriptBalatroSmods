///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class Tag extends LuaObject {
    key: any;
    config: void;
    pos: any;
    name: any;
    tally: any;
    triggered: boolean;
    ID: any;
    ability: { orbital_hand: string; blind_type: any; };
    tag_sprite: any;
    hide_ability: any;
    HUD_tag: any;
    constructor( _tag, for_collection, _blind_type) {
        super()
        this.key = _tag;
        let proto = G.P_TAGS[_tag] || G.tag_undiscovered;
        this.config = copy_table(proto.config);
        this.pos = proto.pos;
        this.name = proto.name;
        this.tally = G.GAME.tag_tally || 0;
        this.triggered = false;
        G.tagid = G.tagid || 0;
        this.ID = G.tagid;
        G.tagid = G.tagid + 1;
        this.ability = { orbital_hand: "[" + (localize("k_poker_hand") + "]"), blind_type: _blind_type };
        G.GAME.tag_tally = G.GAME.tag_tally && G.GAME.tag_tally + 1 || 1;
        if (!for_collection) {
            this.set_ability();
        }
    }
    nope() {
        G.E_MANAGER.add_event(new GameEvent({ delay: 0.2, trigger: "after", func: function () {
                attention_text({ text: "NOPE", colour: G.C.WHITE, scale: 0.7, hold: 0.3 / G.SETTINGS.GAMESPEED, cover: this.HUD_tag, cover_colour: G.C.BLACK, align: "cm" });
                play_sound("cancel", 1.4, 0.5);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.1, func: function () {
                this.HUD_tag.states.visible = false;
                play_sound("cancel", 1.26, 0.5);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                this.remove();
                return true;
            } }));
    };
    yep(message, _colour, func) {
        stop_use();
        G.E_MANAGER.add_event(new GameEvent({ delay: 0.4, trigger: "after", func: function () {
                attention_text({ text: message, colour: G.C.WHITE, scale: 1, hold: 0.3 / G.SETTINGS.GAMESPEED, cover: this.HUD_tag, cover_colour: _colour || G.C.GREEN, align: "cm" });
                play_sound("generic1", 0.9 + math.random() * 0.1, 0.8);
                play_sound("holo1", 1.2 + math.random() * 0.1, 0.4);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                this.HUD_tag.states.visible = false;
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ func: func }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.7, func: function () {
                this.remove();
                return true;
            } }));
    };
    set_ability() {
        let obj = SMODS.Tags[this.key];
        let res;
        if (obj && obj.set_ability && type(obj.set_ability) === "function") {
            obj.set_ability(this);
        }
        if (this.name === "Orbital Tag") {
            if (G.orbital_hand) {
                this.ability.orbital_hand = G.orbital_hand;
            }
            else if (this.ability.blind_type) {
                if (G.GAME.orbital_choices && G.GAME.orbital_choices[G.GAME.round_resets.ante][this.ability.blind_type]) {
                    this.ability.orbital_hand = G.GAME.orbital_choices[G.GAME.round_resets.ante][this.ability.blind_type];
                }
            }
        }
    };
    apply_to_run(_context) {
        if (this.triggered) {
            return;
        }
        let obj = SMODS.Tags[this.key];
        let res;
        if (obj && obj.apply && type(obj.apply) === "function") {
            res = obj.apply(this, _context);
        }
        if (res) {
            return res;
        }
        if (!this.triggered && this.config.type === _context.type) {
            if (_context.type === "eval") {
                if (this.name === "Investment Tag" && G.GAME.last_blind && G.GAME.last_blind.boss) {
                    this.yep("+", G.C.GOLD, function () {
                        return true;
                    });
                    this.triggered = true;
                    return { dollars: this.config.dollars, condition: localize("ph_defeat_the_boss"), pos: this.pos, tag: this };
                }
            }
            else if (_context.type === "immediate") {
                let lock = this.ID;
                G.CONTROLLER.locks[lock] = true;
                if (this.name === "Top-up Tag") {
                    this.yep("+", G.C.PURPLE, function () {
                        for (let i = 1; i <= this.config.spawn_jokers; i++) {
                            if (G.jokers && G.jokers.cards.length < G.jokers.config.card_limit) {
                                let card = create_card("Joker", G.jokers, undefined, 0, undefined, undefined, undefined, "top");
                                card.add_to_deck();
                                G.jokers.emplace(card);
                            }
                        }
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Skip Tag") {
                    this.yep("+", G.C.MONEY, function () {
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    ease_dollars((G.GAME.skips || 0) * this.config.skip_bonus);
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Garbage Tag") {
                    this.yep("+", G.C.MONEY, function () {
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    ease_dollars((G.GAME.unused_discards || 0) * this.config.dollars_per_discard);
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Handy Tag") {
                    this.yep("+", G.C.MONEY, function () {
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    ease_dollars((G.GAME.hands_played || 0) * this.config.dollars_per_hand);
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Economy Tag") {
                    this.yep("+", G.C.MONEY, function () {
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            ease_dollars(math.min(this.config.max, math.max(0, G.GAME.dollars)), true);
                            return true;
                        } }));
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Orbital Tag") {
                    update_hand_text({ sound: "button", volume: 0.7, pitch: 0.8, delay: 0.3 }, { handname: this.ability.orbital_hand, chips: G.GAME.hands[this.ability.orbital_hand].chips, mult: G.GAME.hands[this.ability.orbital_hand].mult, level: G.GAME.hands[this.ability.orbital_hand].level });
                    level_up_hand(this, this.ability.orbital_hand, undefined, this.config.levels);
                    update_hand_text({ sound: "button", volume: 0.7, pitch: 1.1, delay: 0 }, { mult: 0, chips: 0, handname: "", level: "" });
                    this.yep("+", G.C.MONEY, function () {
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
            }
            else if (_context.type === "new_blind_choice") {
                let lock = this.ID;
                G.CONTROLLER.locks[lock] = true;
                if (this.name === "Charm Tag") {
                    this.yep("+", G.C.PURPLE, function () {
                        let key = "p_arcana_mega_" + math.random(1, 2);
                        let card = new Card(G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2, G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2, G.CARD_W * 1.27, G.CARD_H * 1.27, G.P_CARDS.empty, G.P_CENTERS[key], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        card.cost = 0;
                        card.from_tag = true;
                        G.FUNCS.use_card({ config: { ref_table: card } });
                        card.start_materialize();
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Meteor Tag") {
                    this.yep("+", G.C.SECONDARY_SET.Planet, function () {
                        let key = "p_celestial_mega_" + math.random(1, 2);
                        let card = new Card(G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2, G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2, G.CARD_W * 1.27, G.CARD_H * 1.27, G.P_CARDS.empty, G.P_CENTERS[key], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        card.cost = 0;
                        card.from_tag = true;
                        G.FUNCS.use_card({ config: { ref_table: card } });
                        card.start_materialize();
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Ethereal Tag") {
                    this.yep("+", G.C.SECONDARY_SET.Spectral, function () {
                        let key = "p_spectral_normal_1";
                        let card = new Card(G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2, G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2, G.CARD_W * 1.27, G.CARD_H * 1.27, G.P_CARDS.empty, G.P_CENTERS[key], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        card.cost = 0;
                        card.from_tag = true;
                        G.FUNCS.use_card({ config: { ref_table: card } });
                        card.start_materialize();
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Standard Tag") {
                    this.yep("+", G.C.SECONDARY_SET.Spectral, function () {
                        let key = "p_standard_mega_1";
                        let card = new Card(G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2, G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2, G.CARD_W * 1.27, G.CARD_H * 1.27, G.P_CARDS.empty, G.P_CENTERS[key], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        card.cost = 0;
                        card.from_tag = true;
                        G.FUNCS.use_card({ config: { ref_table: card } });
                        card.start_materialize();
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Buffoon Tag") {
                    this.yep("+", G.C.SECONDARY_SET.Spectral, function () {
                        let key = "p_buffoon_mega_1";
                        let card = new Card(G.play.T.x + G.play.T.w / 2 - G.CARD_W * 1.27 / 2, G.play.T.y + G.play.T.h / 2 - G.CARD_H * 1.27 / 2, G.CARD_W * 1.27, G.CARD_H * 1.27, G.P_CARDS.empty, G.P_CENTERS[key], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        card.cost = 0;
                        card.from_tag = true;
                        G.FUNCS.use_card({ config: { ref_table: card } });
                        card.start_materialize();
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
                if (this.name === "Boss Tag") {
                    let lock = this.ID;
                    G.CONTROLLER.locks[lock] = true;
                    this.yep("+", G.C.GREEN, function () {
                        G.from_boss_tag = true;
                        G.FUNCS.reroll_boss();
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                        G.CONTROLLER.locks[lock] = undefined;
                                        return true;
                                    } }));
                                return true;
                            } }));
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
            }
            else if (_context.type === "voucher_add") {
                if (this.name === "Voucher Tag") {
                    this.yep("+", G.C.SECONDARY_SET.Voucher, function () {
                        G.ARGS.voucher_tag = G.ARGS.voucher_tag || {};
                        let voucher_key = get_next_voucher_key(true);
                        G.ARGS.voucher_tag[voucher_key] = true;
                        G.shop_vouchers.config.card_limit = G.shop_vouchers.config.card_limit + 1;
                        let card = new Card(G.shop_vouchers.T.x + G.shop_vouchers.T.w / 2, G.shop_vouchers.T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, G.P_CENTERS[voucher_key], { bypass_discovery_center: true, bypass_discovery_ui: true });
                        create_shop_card_ui(card, "Voucher", G.shop_vouchers);
                        card.start_materialize();
                        G.shop_vouchers.emplace(card);
                        G.ARGS.voucher_tag = undefined;
                        return true;
                    });
                    this.triggered = true;
                }
            }
            else if (_context.type === "tag_add") {
                if (this.name === "Double Tag" && _context.tag.key !== "tag_double") {
                    let lock = this.ID;
                    G.CONTROLLER.locks[lock] = true;
                    this.yep("+", G.C.BLUE, function () {
                        if (_context.tag.ability && _context.tag.ability.orbital_hand) {
                            G.orbital_hand = _context.tag.ability.orbital_hand;
                        }
                        add_tag(new Tag(_context.tag.key));
                        G.orbital_hand = undefined;
                        G.CONTROLLER.locks[lock] = undefined;
                        return true;
                    });
                    this.triggered = true;
                }
            }
            else if (_context.type === "round_start_bonus") {
                if (this.name === "Juggle Tag") {
                    this.yep("+", G.C.BLUE, function () {
                        return true;
                    });
                    G.hand.change_size(this.config.h_size);
                    G.GAME.round_resets.temp_handsize = (G.GAME.round_resets.temp_handsize || 0) + this.config.h_size;
                    this.triggered = true;
                    return true;
                }
            }
            else if (_context.type === "store_joker_create") {
                let card = undefined;
                if (this.name === "Rare Tag") {
                    let rares_in_posession = [0];
                    for (const [k, v] of ipairs(G.jokers.cards)) {
                        if (v.config.center.rarity === 3 && !rares_in_posession[v.config.center.key]) {
                            rares_in_posession[1] = rares_in_posession[1] + 1;
                            rares_in_posession[v.config.center.key] = true;
                        }
                    }
                    if (G.P_JOKER_RARITY_POOLS[3].length > rares_in_posession[1]) {
                        card = create_card("Joker", _context.area, undefined, 1, undefined, undefined, undefined, "rta");
                        create_shop_card_ui(card, "Joker", _context.area);
                        card.states.visible = false;
                        this.yep("+", G.C.RED, function () {
                            card.start_materialize();
                            card.ability.couponed = true;
                            card.set_cost();
                            return true;
                        });
                    }
                    else {
                        this.nope();
                    }
                    this.triggered = true;
                }
                else if (this.name === "Uncommon Tag") {
                    card = create_card("Joker", _context.area, undefined, 0.9, undefined, undefined, undefined, "uta");
                    create_shop_card_ui(card, "Joker", _context.area);
                    card.states.visible = false;
                    this.yep("+", G.C.GREEN, function () {
                        card.start_materialize();
                        card.ability.couponed = true;
                        card.set_cost();
                        return true;
                    });
                }
                this.triggered = true;
                return card;
            }
            else if (_context.type === "shop_start") {
                if (this.name === "D6 Tag" && !G.GAME.shop_d6ed) {
                    G.GAME.shop_d6ed = true;
                    this.yep("+", G.C.GREEN, function () {
                        G.GAME.round_resets.temp_reroll_cost = 0;
                        calculate_reroll_cost(true);
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
            }
            else if (_context.type === "store_joker_modify") {
                let _applied = undefined;
                if (!_context.card.edition && !_context.card.temp_edition && _context.card.ability.set === "Joker") {
                    let lock = this.ID;
                    G.CONTROLLER.locks[lock] = true;
                    if (this.name === "Foil Tag") {
                        _context.card.temp_edition = true;
                        this.yep("+", G.C.DARK_EDITION, function () {
                            _context.card.set_edition({ foil: true }, true);
                            _context.card.ability.couponed = true;
                            _context.card.set_cost();
                            _context.card.temp_edition = undefined;
                            G.CONTROLLER.locks[lock] = undefined;
                            return true;
                        });
                        _applied = true;
                    }
                    else if (this.name === "Holographic Tag") {
                        _context.card.temp_edition = true;
                        this.yep("+", G.C.DARK_EDITION, function () {
                            _context.card.temp_edition = undefined;
                            _context.card.set_edition({ holo: true }, true);
                            _context.card.ability.couponed = true;
                            _context.card.set_cost();
                            G.CONTROLLER.locks[lock] = undefined;
                            return true;
                        });
                        _applied = true;
                    }
                    else if (this.name === "Polychrome Tag") {
                        _context.card.temp_edition = true;
                        this.yep("+", G.C.DARK_EDITION, function () {
                            _context.card.temp_edition = undefined;
                            _context.card.set_edition({ polychrome: true }, true);
                            _context.card.ability.couponed = true;
                            _context.card.set_cost();
                            G.CONTROLLER.locks[lock] = undefined;
                            return true;
                        });
                        _applied = true;
                    }
                    else if (this.name === "Negative Tag") {
                        _context.card.temp_edition = true;
                        this.yep("+", G.C.DARK_EDITION, function () {
                            _context.card.temp_edition = undefined;
                            _context.card.set_edition({ negative: true }, true);
                            _context.card.ability.couponed = true;
                            _context.card.set_cost();
                            G.CONTROLLER.locks[lock] = undefined;
                            return true;
                        });
                        _applied = true;
                    }
                    this.triggered = true;
                }
                return _applied;
            }
            else if (_context.type === "shop_final_pass") {
                if (this.name === "Coupon Tag" && (G.shop && !G.GAME.shop_free)) {
                    G.GAME.shop_free = true;
                    this.yep("+", G.C.GREEN, function () {
                        if (G.shop_jokers && G.shop_booster) {
                            for (const [k, v] of pairs(G.shop_jokers.cards)) {
                                v.ability.couponed = true;
                                v.set_cost();
                            }
                            for (const [k, v] of pairs(G.shop_booster.cards)) {
                                v.ability.couponed = true;
                                v.set_cost();
                            }
                        }
                        return true;
                    });
                    this.triggered = true;
                    return true;
                }
            }
        }
    };
    save() {
        return { key: this.key, tally: this.tally, ability: this.ability };
    };
    load(tag_savetable) {
        this.key = tag_savetable.key;
        let proto = G.P_TAGS[this.key] || G.tag_undiscovered;
        this.config = copy_table(proto.config);
        this.pos = proto.pos;
        this.name = proto.name;
        this.tally = tag_savetable.tally;
        this.ability = tag_savetable.ability;
        G.GAME.tag_tally = math.max(this.tally, G.GAME.tag_tally) + 1;
    };
    juice_up(_scale, _rot) {
        if (this.tag_sprite) {
            this.tag_sprite.juice_up(_scale, _rot);
        }
    };
    generate_UI(_size) {
        _size = _size || 0.8;
        let tag_sprite_tab = undefined;
        let tag_sprite = new Sprite(0, 0, _size * 1, _size * 1, G.ASSET_ATLAS[!this.hide_ability && G.P_TAGS[this.key].atlas || "tags"], this.hide_ability && G.tag_undiscovered.pos || this.pos);
        tag_sprite.T.scale = 1;
        tag_sprite_tab = { n: G.UIT.C, config: { align: "cm", ref_table: this, group: this.tally }, nodes: [{ n: G.UIT.O, config: { w: _size * 1, h: _size * 1, colour: G.C.BLUE, object: tag_sprite, focus_with_object: true } }] };
        tag_sprite.define_draw_steps([{ shader: "dissolve", shadow_height: 0.05 }, { shader: "dissolve" }]);
        tag_sprite.float = true;
        tag_sprite.states.hover.can = true;
        tag_sprite.states.drag.can = false;
        tag_sprite.states.collide.can = true;
        tag_sprite.config = { tag: this, force_focus: true };
        tag_sprite.hover = function (_this) {
            if (!G.CONTROLLER.dragging.target || G.CONTROLLER.using_touch) {
                if (!_this.hovering && _this.states.visible) {
                    _this.hovering = true;
                    if (_this === tag_sprite) {
                        _this.hover_tilt = 3;
                        _this.juice_up(0.05, 0.02);
                        play_sound("paper1", math.random() * 0.1 + 0.55, 0.42);
                        play_sound("tarot2", math.random() * 0.1 + 0.55, 0.09);
                    }
                    this.get_uibox_table(tag_sprite);
                    _this.config.h_popup = G.UIDEF.card_h_popup(_this);
                    _this.config.h_popup_config = _this.T.x > G.ROOM.T.w * 0.4 && { align: "cl", offset: { x: -0.1, y: 0 }, parent: _this } || { align: "cr", offset: { x: 0.1, y: 0 }, parent: _this };
                    LuaNode.prototype.hover.call(_this);
                    if (_this.children.alert) {
                        _this.children.alert.remove();
                        _this.children.alert = undefined;
                        if (this.key && G.P_TAGS[this.key]) {
                            G.P_TAGS[this.key].alerted = true;
                        }
                        G.save_progress();
                    }
                }
            }
        };
        tag_sprite.stop_hover = function (_this) {
            _this.hovering = false;
            LuaNode.prototype.stop_hover.call(_this);
            _this.hover_tilt = 0;
        };
        tag_sprite.juice_up();
        this.tag_sprite = tag_sprite;
        return [tag_sprite_tab, tag_sprite];
    };
    get_uibox_table(tag_sprite, vars_only) {
        tag_sprite = tag_sprite || this.tag_sprite;
        let [name_to_check, loc_vars] = [this.name, {}];
        if (name_to_check === "Uncommon Tag") { }
        else if (name_to_check === "Investment Tag") {
            loc_vars = [this.config.dollars];
        }
        else if (name_to_check === "Handy Tag") {
            loc_vars = [this.config.dollars_per_hand, this.config.dollars_per_hand * (G.GAME.hands_played || 0)];
        }
        else if (name_to_check === "Garbage Tag") {
            loc_vars = [this.config.dollars_per_discard, this.config.dollars_per_discard * (G.GAME.unused_discards || 0)];
        }
        else if (name_to_check === "Juggle Tag") {
            loc_vars = [this.config.h_size];
        }
        else if (name_to_check === "Top-up Tag") {
            loc_vars = [this.config.spawn_jokers];
        }
        else if (name_to_check === "Skip Tag") {
            loc_vars = [this.config.skip_bonus, this.config.skip_bonus * ((G.GAME.skips || 0) + 1)];
        }
        else if (name_to_check === "Orbital Tag") {
            loc_vars = [this.ability.orbital_hand === "[" + (localize("k_poker_hand") + "]") && this.ability.orbital_hand || localize(this.ability.orbital_hand, "poker_hands"), this.config.levels];
        }
        else if (name_to_check === "Economy Tag") {
            loc_vars = [this.config.max];
        }
        if (vars_only) {
            return loc_vars;
        }
        tag_sprite.ability_UIBox_table = generate_card_ui(G.P_TAGS[this.key], undefined, loc_vars, this.hide_ability && "Undiscovered" || "Tag", undefined, this.hide_ability, undefined, undefined, this);
        return tag_sprite;
    };
    remove_from_game() {
        let tag_key = undefined;
        for (const [k, v] of pairs(G.GAME.tags)) {
            if (v === this) {
                tag_key = k;
            }
        }
        table.remove(G.GAME.tags, tag_key);
    };
    remove() {
        this.remove_from_game();
        let HUD_tag_key = undefined;
        for (const [k, v] of pairs(G.HUD_tags)) {
            if (v === this.HUD_tag) {
                HUD_tag_key = k;
            }
        }
        if (HUD_tag_key) {
            if (G.HUD_tags && G.HUD_tags[HUD_tag_key + 1]) {
                if (HUD_tag_key === 1) {
                    G.HUD_tags[HUD_tag_key + 1].set_alignment({ type: "bri", offset: { x: 0.7, y: 0 }, xy_bond: "Weak", major: G.ROOM_ATTACH });
                }
                else {
                    G.HUD_tags[HUD_tag_key + 1].set_role({ xy_bond: "Weak", major: G.HUD_tags[HUD_tag_key - 1] });
                }
            }
            table.remove(G.HUD_tags, HUD_tag_key);
        }
        this.HUD_tag.remove();
    };
}