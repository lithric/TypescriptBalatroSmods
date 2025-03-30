///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class CardArea extends Moveable {
    card_w: number;
    cards?: Card[];
    highlighted?: Card[];
    shuffle_amt: number;
    constructor(X, Y, W, H, config) {
        super(X, Y, W, H)
        this.states.drag.can = false;
        this.states.hover.can = false;
        this.states.click.can = false;
        this.config = config || {};
        this.card_w = config.card_w || G.CARD_W;
        this.cards = [];
        this.children = [];
        this.highlighted = [];
        this.config.highlighted_limit = config.highlight_limit || 5;
        this.config.card_limit = config.card_limit || 52;
        this.config.temp_limit = this.config.card_limit;
        this.config.card_count = 0;
        this.config.type = config.type || "deck";
        this.config.sort = config.sort || "desc";
        this.config.lr_padding = config.lr_padding || 0.1;
        this.shuffle_amt = 0;
        if (this instanceof CardArea) {
            table.insert(G.I.CARDAREA, this);
        }
    }
    emplace(card, location, stay_flipped) {
        if (card.edition && card.edition.card_limit && this === G.hand) {
            this.config.real_card_limit = (this.config.real_card_limit || this.config.card_limit) + card.edition.card_limit;
            this.config.card_limit = math.max(0, this.config.real_card_limit);
        }
        if (location === "front" || this.config.type === "deck") {
            table.insert(this.cards, 1, card);
        }
        else {
            this.cards[this.cards.length + 1] = card;
        }
        if (card.facing === "back" && this.config.type !== "discard" && this.config.type !== "deck" && !stay_flipped) {
            card.flip();
        }
        if (this === G.hand && stay_flipped) {
            card.ability.wheel_flipped = true;
        }
        if (this.cards.length > this.config.card_limit) {
            if (this === G.deck) {
                this.config.card_limit = this.cards.length;
            }
        }
        card.set_card_area(this);
        this.set_ranks();
        this.align_cards();
        if (this === G.jokers) {
            let joker_tally = 0;
            for (let i = 1; i <= G.jokers.cards.length; i++) {
                if (G.jokers.cards[i].ability.set === "Joker") {
                    joker_tally = joker_tally + 1;
                }
            }
            if (joker_tally > G.GAME.max_jokers) {
                G.GAME.max_jokers = joker_tally;
            }
            check_for_unlock({ type: "modify_jokers" });
        }
        if (this === G.deck) {
            check_for_unlock({ type: "modify_deck", deck: this });
        }
    };
    remove_card(card, discarded_only) {
        if (!this.cards) {
            return;
        }
        let _cards = discarded_only && {} || this.cards;
        if (discarded_only) {
            for (const [k, v] of ipairs(this.cards)) {
                if (v.ability && v.ability.discarded) {
                    _cards[_cards.length + 1] = v;
                }
            }
        }
        if (this.config.type === "discard" || this.config.type === "deck") {
            card = card || _cards[_cards.length];
        }
        else {
            card = card || _cards[1];
        }
        for (let i = this.cards.length; i <= 1; i += -1) {
            if (this.cards[i] === card) {
                if (card.edition && card.edition.card_limit && this === G.hand) {
                    this.config.real_card_limit = (this.config.real_card_limit || this.config.card_limit) - card.edition.card_limit;
                    this.config.card_limit = math.max(0, this.config.real_card_limit);
                }
                card.remove_from_area();
                table.remove(this.cards, i);
                this.remove_from_highlighted(card, true);
                break;
            }
        }
        this.set_ranks();
        if (this === G.deck) {
            check_for_unlock({ type: "modify_deck", deck: this });
        }
        return card;
    };
    change_size(delta) {
        if (delta !== 0) {
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    this.config.real_card_limit = (this.config.real_card_limit || this.config.card_limit) + delta;
                    this.config.card_limit = math.max(0, this.config.real_card_limit);
                    if (delta > 0 && this.config.real_card_limit > 1 && this === G.hand && this.cards[1] && (G.STATE === G.STATES.DRAW_TO_HAND || G.STATE === G.STATES.SELECTING_HAND)) {
                        let card_count = math.abs(delta);
                        for (let i = 1; i <= card_count; i++) {
                            draw_card(G.deck, G.hand, i * 100 / card_count, undefined, undefined, undefined, 0.07);
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    this.sort();
                                    return true;
                                } }));
                        }
                    }
                    if (this === G.hand) {
                        check_for_unlock({ type: "min_hand_size" });
                    }
                    return true;
                } }));
        }
    };
    can_highlight(card) {
        if (G.CONTROLLER.HID.controller) {
            if (this.config.type === "hand") {
                return true;
            }
        }
        else {
            if (this.config.type === "hand" || this.config.type === "joker" || this.config.type === "consumeable" || this.config.type === "shop" && this.config.highlighted_limit > 0) {
                return true;
            }
        }
        return false;
    };
    add_to_highlighted(card, silent) {
        if (this.config.type === "shop") {
            if (this.highlighted[1]) {
                this.remove_from_highlighted(this.highlighted[1]);
            }
            this.highlighted[this.highlighted.length + 1] = card;
            card.highlight(true);
            if (!silent) {
                play_sound("cardSlide1");
            }
        }
        else if (this.config.type === "joker" || this.config.type === "consumeable") {
            if (this.highlighted.length >= this.config.highlighted_limit) {
                this.remove_from_highlighted(this.highlighted[1]);
            }
            this.highlighted[this.highlighted.length + 1] = card;
            card.highlight(true);
            if (!silent) {
                play_sound("cardSlide1");
            }
        }
        else {
            if (this.highlighted.length >= this.config.highlighted_limit) {
                card.highlight(false);
            }
            else {
                this.highlighted[this.highlighted.length + 1] = card;
                card.highlight(true);
                if (!silent) {
                    play_sound("cardSlide1");
                }
            }
            if (this === G.hand && G.STATE === G.STATES.SELECTING_HAND) {
                this.parse_highlighted();
            }
        }
    };
    parse_highlighted() {
        G.boss_throw_hand = undefined;
        let [text, disp_text, poker_hands] = G.FUNCS.get_poker_hand_info(this.highlighted);
        if (text === "NULL") {
            update_hand_text({ immediate: true, nopulse: true, delay: 0 }, { mult: 0, chips: 0, level: "", handname: "" });
        }
        else {
            if (G.GAME.blind && G.GAME.blind.debuff_hand(this.highlighted, poker_hands, text, true)) {
                G.boss_throw_hand = true;
            }
            else { }
            let backwards = undefined;
            for (const [k, v] of pairs(this.highlighted)) {
                if (v.facing === "back") {
                    backwards = true;
                }
            }
            if (backwards) {
                update_hand_text({ immediate: true, nopulse: undefined, delay: 0 }, { handname: "????", level: "?", mult: "?", chips: "?" });
            }
            else {
                update_hand_text({ immediate: true, nopulse: undefined, delay: 0 }, { handname: disp_text, level: G.GAME.hands[text].level, mult: G.GAME.hands[text].mult, chips: G.GAME.hands[text].chips });
            }
        }
    };
    remove_from_highlighted(card, force) {
        if (!force && card && card.ability.forced_selection && this === G.hand) {
            return;
        }
        for (let i = this.highlighted.length-1; i >= 0; i--) {
            if (this.highlighted[i] === card) {
                table.remove(this.highlighted, i+1);
                break;
            }
        }
        card.highlight(false);
        if (this === G.hand && G.STATE === G.STATES.SELECTING_HAND) {
            this.parse_highlighted();
        }
    };
    unhighlight_all() {
        for (let i = this.highlighted.length; i <= 1; i += -1) {
            if (this.highlighted[i].ability.forced_selection && this === G.hand) { }
            else {
                this.highlighted[i].highlight(false);
                table.remove(this.highlighted, i);
            }
        }
        if (this === G.hand && G.STATE === G.STATES.SELECTING_HAND) {
            this.parse_highlighted();
        }
    };
    set_ranks() {
        for (const [k, card] of ipairs(this.cards)) {
            card.rank = k;
            card.states.collide.can = true;
            if (k > 1 && this.config.type === "deck") {
                card.states.drag.can = false;
                card.states.collide.can = false;
            }
            else if (this.config.type === "play" || this.config.type === "shop" || this.config.type === "consumeable") {
                card.states.drag.can = false;
            }
            else {
                card.states.drag.can = true;
            }
        }
    };
    move(dt) {
        if (this === G.hand) {
            let desired_y = G.TILE_H - G.hand.T.h - 1.9 * (!G.deck_preview && (G.STATE === G.STATES.SELECTING_HAND || G.STATE === G.STATES.DRAW_TO_HAND) && 1 || 0);
            G.hand.T.y = 15 * G.real_dt * desired_y + (1 - 15 * G.real_dt) * G.hand.T.y;
            if (math.abs(desired_y - G.hand.T.y) < 0.01) {
                G.hand.T.y = desired_y;
            }
            if (G.STATE === G.STATES.TUTORIAL) {
                G.play.T.y = G.hand.T.y - (3 + 0.6);
            }
        }
        Moveable.prototype.move.call(this, dt);
        this.align_cards();
    };
    update(dt) {
        if (this === G.hand) {
            if (G.GAME.modifiers.minus_hand_size_per_X_dollar) {
                this.config.last_poll_size = this.config.last_poll_size || 0;
                if (math.floor(G.GAME.dollars / G.GAME.modifiers.minus_hand_size_per_X_dollar) !== this.config.last_poll_size) {
                    this.change_size(this.config.last_poll_size - math.floor(G.GAME.dollars / G.GAME.modifiers.minus_hand_size_per_X_dollar));
                    this.config.last_poll_size = math.floor(G.GAME.dollars / G.GAME.modifiers.minus_hand_size_per_X_dollar);
                }
            }
            for (const [k, v] of pairs(this.cards)) {
                if (v.ability.forced_selection && !this.highlighted[1]) {
                    this.add_to_highlighted(v);
                }
            }
        }
        if (this === G.deck) {
            this.states.collide.can = true;
            this.states.hover.can = true;
            this.states.click.can = true;
        }
        if (G.CONTROLLER.HID.controller && this !== G.hand) {
            this.unhighlight_all();
        }
        if (this === G.deck && this.config.card_limit > G.playing_cards.length) {
            this.config.card_limit = G.playing_cards.length;
        }
        this.config.temp_limit = math.max(this.cards.length, this.config.card_limit);
        this.config.card_count = this.cards.length;
    };
    draw() {
        if (!this.states.visible) {
            return;
        }
        if (G.VIEWING_DECK && (this === G.deck || this === G.hand || this === G.play)) {
            return;
        }
        let state = G.TAROT_INTERRUPT || G.STATE;
        this.ARGS.invisible_area_types = this.ARGS.invisible_area_types || { discard: 1, voucher: 1, play: 1, consumeable: 1, title: 1, title_2: 1 };
        if (this.ARGS.invisible_area_types[this.config.type] || this.config.type === "hand" && { [G.STATES.SHOP]: 1, [G.STATES.TAROT_PACK]: 1, [G.STATES.SPECTRAL_PACK]: 1, [G.STATES.STANDARD_PACK]: 1, [G.STATES.BUFFOON_PACK]: 1, [G.STATES.PLANET_PACK]: 1, [G.STATES.ROUND_EVAL]: 1, [G.STATES.BLIND_SELECT]: 1 }[state] || this.config.type === "hand" && state === G.STATES.SMODS_BOOSTER_OPENED || this.config.type === "deck" && this !== G.deck || this.config.type === "shop" && this !== G.shop_vouchers) { }
        else {
            if (!this.children.area_uibox) {
                let card_count = this !== G.shop_vouchers && { n: G.UIT.R, config: { align: this === G.jokers && "cl" || this === G.hand && "cm" || "cr", padding: 0.03, no_fill: true }, nodes: [{ n: G.UIT.B, config: { w: 0.1, h: 0.1 } }, { n: G.UIT.T, config: { ref_table: this.config, ref_value: "card_count", scale: 0.3, colour: G.C.WHITE } }, { n: G.UIT.T, config: { text: "/", scale: 0.3, colour: G.C.WHITE } }, { n: G.UIT.T, config: { ref_table: this.config, ref_value: "card_limit", scale: 0.3, colour: G.C.WHITE } }, { n: G.UIT.B, config: { w: 0.1, h: 0.1 } }] } || undefined;
                this.children.area_uibox = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { minw: this.T.w, minh: this.T.h, align: "cm", padding: 0.1, mid: true, r: 0.1, colour: this !== G.shop_vouchers && [0, 0, 0, 0.1] || undefined, ref_table: this }, nodes: [this === G.shop_vouchers && { n: G.UIT.C, config: { align: "cm", paddin: 0.1, func: "shop_voucher_empty", visible: false }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "DEFEAT", scale: 0.6, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "BOSS BLIND", scale: 0.4, colour: G.C.WHITE } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "TO RESTOCK", scale: 0.4, colour: G.C.WHITE } }] }] } || undefined] }, card_count] }, config: { align: "cm", offset: { x: 0, y: 0 }, major: this, parent: this } });
            }
            this.children.area_uibox.draw();
        }
        this.draw_boundingrect();
        add_to_drawhash(this);
        this.ARGS.draw_layers = this.ARGS.draw_layers || this.config.draw_layers || ["shadow", "card"];
        for (const [k, v] of ipairs(this.ARGS.draw_layers)) {
            if (this.config.type === "deck") {
                for (let i = this.cards.length; i <= 1; i += -1) {
                    if (this.cards[i] !== G.CONTROLLER.focused.target) {
                        if (i === 1 || i % (this.config.thin_draw || 9) === 0 || i === this.cards.length || math.abs(this.cards[i].VT.x - this.T.x) > 1 || math.abs(this.cards[i].VT.y - this.T.y) > 1) {
                            if (G.CONTROLLER.dragging.target !== this.cards[i]) {
                                this.cards[i].draw(v);
                            }
                        }
                    }
                }
            }
            if (this.config.type === "joker" || this.config.type === "consumeable" || this.config.type === "shop" || this.config.type === "title_2") {
                for (let i = 1; i <= this.cards.length; i++) {
                    if (this.cards[i] !== G.CONTROLLER.focused.target) {
                        if (!this.cards[i].highlighted) {
                            if (G.CONTROLLER.dragging.target !== this.cards[i]) {
                                this.cards[i].draw(v);
                            }
                        }
                    }
                }
                for (let i = 1; i <= this.cards.length; i++) {
                    if (this.cards[i] !== G.CONTROLLER.focused.target) {
                        if (this.cards[i].highlighted) {
                            if (G.CONTROLLER.dragging.target !== this.cards[i]) {
                                this.cards[i].draw(v);
                            }
                        }
                    }
                }
            }
            if (this.config.type === "discard") {
                for (let i = 1; i <= this.cards.length; i++) {
                    if (this.cards[i] !== G.CONTROLLER.focused.target) {
                        if (math.abs(this.cards[i].VT.x - this.T.x) > 1) {
                            if (G.CONTROLLER.dragging.target !== this.cards[i]) {
                                this.cards[i].draw(v);
                            }
                        }
                    }
                }
            }
            if (this.config.type === "hand" || this.config.type === "play" || this.config.type === "title" || this.config.type === "voucher") {
                for (let i = 1; i <= this.cards.length; i++) {
                    if (this.cards[i] !== G.CONTROLLER.focused.target || this === G.hand) {
                        if (G.CONTROLLER.dragging.target !== this.cards[i]) {
                            this.cards[i].draw(v);
                        }
                    }
                }
            }
        }
        if (this === G.deck) {
            if (G.CONTROLLER.HID.controller && G.STATE === G.STATES.SELECTING_HAND && !this.children.peek_deck) {
                this.children.peek_deck = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", r: 0.1, colour: adjust_alpha(G.C.L_BLACK, 0.5), func: "set_button_pip", focus_args: { button: "triggerleft", orientation: "bm", scale: 0.6, type: "none" } }, nodes: [{ n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "PEEK", scale: 0.48, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm" }, nodes: [{ n: G.UIT.T, config: { text: "DECK", scale: 0.38, colour: G.C.WHITE, shadow: true } }] }] }] }, config: { align: "cl", offset: { x: -0.5, y: 0.1 }, major: this, parent: this } });
                this.children.peek_deck.states.collide.can = false;
            }
            else if ((!G.CONTROLLER.HID.controller || G.STATE !== G.STATES.SELECTING_HAND) && this.children.peek_deck) {
                this.children.peek_deck.remove();
                this.children.peek_deck = undefined;
            }
            if (!this.children.view_deck) {
                this.children.view_deck = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", padding: 0.1, r: 0.1, colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.05, r: 0.1, colour: adjust_alpha(G.C.BLACK, 0.5), func: "set_button_pip", focus_args: { button: "triggerright", orientation: "bm", scale: 0.6 }, button: "deck_info" }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 2 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_view"), scale: 0.48, colour: G.C.WHITE, shadow: true } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 2 }, nodes: [{ n: G.UIT.T, config: { text: localize("k_deck"), scale: 0.38, colour: G.C.WHITE, shadow: true } }] }] }] }, config: { align: "cm", offset: { x: 0, y: 0 }, major: this.cards[1] || this, parent: this } });
                this.children.view_deck.states.collide.can = false;
            }
            if (G.deck_preview || this.states.collide.is || G.buttons && G.buttons.states.collide.is && G.CONTROLLER.HID.controller) {
                this.children.view_deck.draw();
            }
            if (this.children.peek_deck) {
                this.children.peek_deck.draw();
            }
        }
    };
    align_cards() {
        if ((this === G.hand || this === G.deck || this === G.discard || this === G.play) && G.view_deck && G.view_deck[1] && G.view_deck[1].cards) {
            return;
        }
        if (this.config.type === "deck") {
            let deck_height = (this.config.deck_height || 0.15) / 52;
            for (const [k, card] of ipairs(this.cards)) {
                if (card.facing === "front") {
                    card.flip();
                }
                if (!card.states.drag.is) {
                    card.T.x = this.T.x + 0.5 * (this.T.w - card.T.w) + this.shadow_parrallax.x * deck_height * (this.cards.length / (this === G.deck && 1 || 2) - k) + 0.9 * this.shuffle_amt * (1 - k * 0.01) * (k % 2 === 1 && 1 || -0);
                    card.T.y = this.T.y + 0.5 * (this.T.h - card.T.h) + this.shadow_parrallax.y * deck_height * (this.cards.length / (this === G.deck && 1 || 2) - k);
                    card.T.r = 0 + 0.3 * this.shuffle_amt * (1 + k * 0.05) * (k % 2 === 1 && 1 || -0);
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
        }
        if (this.config.type === "discard") {
            for (const [k, card] of ipairs(this.cards)) {
                if (card.facing === "front") {
                    card.flip();
                }
                if (!card.states.drag.is) {
                    card.T.x = this.T.x + (this.T.w - card.T.w) * card.discard_pos.x;
                    card.T.y = this.T.y + (this.T.h - card.T.h) * card.discard_pos.y;
                    card.T.r = card.discard_pos.r;
                }
            }
        }
        if (this.config.type === "hand" && (G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.PLANET_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED)) {
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    card.T.r = 0.4 * (-this.cards.length / 2 - 0.5 + k) / this.cards.length + (G.SETTINGS.reduced_motion && 0 || 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + card.T.x);
                    let max_cards = math.max(this.cards.length, this.config.temp_limit);
                    card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / math.max(max_cards - 1, 1) - 0.5 * (this.cards.length - max_cards) / math.max(max_cards - 1, 1)) + 0.5 * (this.card_w - card.T.w);
                    let highlight_height = G.HIGHLIGHT_H;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = G.hand.T.y - 1.8 * card.T.h - highlight_height + (G.SETTINGS.reduced_motion && 0 || 1) * 0.1 * math.sin(0.666 * G.TIMERS.REAL + card.T.x) + (math.abs(1.3 * (-this.cards.length / 2 + k - 0.5) / this.cards.length) ^ 2) - 0.3;
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.T.x + a.T.w / 2 < b.T.x + b.T.w / 2;
            });
        }
        if (this.config.type === "hand" && !(G.STATE === G.STATES.TAROT_PACK || G.STATE === G.STATES.SPECTRAL_PACK || G.STATE === G.STATES.PLANET_PACK || G.STATE === G.STATES.SMODS_BOOSTER_OPENED)) {
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    card.T.r = 0.2 * (-this.cards.length / 2 - 0.5 + k) / this.cards.length + (G.SETTINGS.reduced_motion && 0 || 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + card.T.x);
                    let max_cards = math.max(this.cards.length, this.config.temp_limit);
                    card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / math.max(max_cards - 1, 1) - 0.5 * (this.cards.length - max_cards) / math.max(max_cards - 1, 1)) + 0.5 * (this.card_w - card.T.w);
                    let highlight_height = G.HIGHLIGHT_H;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = this.T.y + this.T.h / 2 - card.T.h / 2 - highlight_height + (G.SETTINGS.reduced_motion && 0 || 1) * 0.03 * math.sin(0.666 * G.TIMERS.REAL + card.T.x) + math.abs(0.5 * (-this.cards.length / 2 + k - 0.5) / this.cards.length) - 0.2;
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.T.x + a.T.w / 2 < b.T.x + b.T.w / 2;
            });
        }
        if (this.config.type === "title" || this.config.type === "voucher" && this.cards.length === 1) {
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    card.T.r = 0.2 * (-this.cards.length / 2 - 0.5 + k) / this.cards.length + (G.SETTINGS.reduced_motion && 0 || 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + card.T.x);
                    let max_cards = math.max(this.cards.length, this.config.temp_limit);
                    card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / math.max(max_cards - 1, 1) - 0.5 * (this.cards.length - max_cards) / math.max(max_cards - 1, 1)) + 0.5 * (this.card_w - card.T.w);
                    let highlight_height = G.HIGHLIGHT_H;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = this.T.y + this.T.h / 2 - card.T.h / 2 - highlight_height + (G.SETTINGS.reduced_motion && 0 || 1) * 0.03 * math.sin(0.666 * G.TIMERS.REAL + card.T.x) + math.abs(0.5 * (-this.cards.length / 2 + k - 0.5) / this.cards.length) - (this.cards.length > 1 && 0.2 || 0);
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.T.x + a.T.w / 2 < b.T.x + b.T.w / 2;
            });
        }
        if (this.config.type === "voucher" && this.cards.length > 1) {
            let this_w = math.max(this.T.w, 3.2);
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    card.T.r = 0.2 * (-this.cards.length / 2 - 0.5 + k) / this.cards.length + (G.SETTINGS.reduced_motion && 0 || 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + card.T.x + card.T.y) + (k % 2 === 0 && 1 || -1) * 0.08;
                    let max_cards = math.max(this.cards.length, this.config.temp_limit);
                    card.T.x = this.T.x + (this_w - this.card_w) * ((k - 1) / math.max(max_cards - 1, 1) - 0.5 * (this.cards.length - max_cards) / math.max(max_cards - 1, 1)) + 0.5 * (this.card_w - card.T.w) + (k % 2 === 1 && 1 || -1) * 0.27 + (this.T.w - this_w) / 2;
                    let highlight_height = G.HIGHLIGHT_H;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = this.T.y + this.T.h / 2 - card.T.h / 2 - highlight_height + (G.SETTINGS.reduced_motion && 0 || 1) * 0.03 * math.sin(0.666 * G.TIMERS.REAL + card.T.x) + math.abs(0.5 * (-this.cards.length / 2 + k - 0.5) / this.cards.length) - (this.cards.length > 1 && 0.2 || 0);
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.ability.order < b.ability.order;
            });
        }
        if (this.config.type === "play" || this.config.type === "shop") {
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    card.T.r = 0;
                    let max_cards = math.max(this.cards.length, this.config.temp_limit);
                    card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / math.max(max_cards - 1, 1) - 0.5 * (this.cards.length - max_cards) / math.max(max_cards - 1, 1)) + 0.5 * (this.card_w - card.T.w) + (this.config.card_limit === 1 && 0.5 * (this.T.w - card.T.w) || 0);
                    let highlight_height = G.HIGHLIGHT_H;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = this.T.y + this.T.h / 2 - card.T.h / 2 - highlight_height;
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.T.x + a.T.w / 2 < b.T.x + b.T.w / 2;
            });
        }
        if (this.config.type === "joker" || this.config.type === "title_2") {
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    card.T.r = 0.1 * (-this.cards.length / 2 - 0.5 + k) / this.cards.length + (G.SETTINGS.reduced_motion && 0 || 1) * 0.02 * math.sin(2 * G.TIMERS.REAL + card.T.x);
                    let max_cards = math.max(this.cards.length, this.config.temp_limit);
                    card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / math.max(max_cards - 1, 1) - 0.5 * (this.cards.length - max_cards) / math.max(max_cards - 1, 1)) + 0.5 * (this.card_w - card.T.w);
                    if (this.cards.length > 2 || this.cards.length > 1 && this === G.consumeables || this.cards.length > 1 && this.config.spread) {
                        card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / (this.cards.length - 1)) + 0.5 * (this.card_w - card.T.w);
                    }
                    else if (this.cards.length > 1 && this !== G.consumeables) {
                        card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 0.5) / this.cards.length) + 0.5 * (this.card_w - card.T.w);
                    }
                    else {
                        card.T.x = this.T.x + this.T.w / 2 - this.card_w / 2 + 0.5 * (this.card_w - card.T.w);
                    }
                    let highlight_height = G.HIGHLIGHT_H / 2;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = this.T.y + this.T.h / 2 - card.T.h / 2 - highlight_height + (G.SETTINGS.reduced_motion && 0 || 1) * 0.03 * math.sin(0.666 * G.TIMERS.REAL + card.T.x);
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.T.x + a.T.w / 2 - 100 * (a.pinned && !a.ignore_pinned && a.sort_id || 0) < b.T.x + b.T.w / 2 - 100 * (b.pinned && !b.ignore_pinned && b.sort_id || 0);
            });
        }
        if (this.config.type === "consumeable") {
            for (const [k, card] of ipairs(this.cards)) {
                if (!card.states.drag.is) {
                    if (this.cards.length > 1) {
                        card.T.x = this.T.x + (this.T.w - this.card_w) * ((k - 1) / (this.cards.length - 1)) + 0.5 * (this.card_w - card.T.w);
                    }
                    else {
                        card.T.x = this.T.x + this.T.w / 2 - this.card_w / 2 + 0.5 * (this.card_w - card.T.w);
                    }
                    let highlight_height = G.HIGHLIGHT_H;
                    if (!card.highlighted) {
                        highlight_height = 0;
                    }
                    card.T.y = this.T.y + this.T.h / 2 - card.T.h / 2 - highlight_height + (!card.highlighted && (G.SETTINGS.reduced_motion && 0 || 1) * 0.05 * math.sin(2 * 1.666 * G.TIMERS.REAL + card.T.x) || 0);
                    card.T.x = card.T.x + card.shadow_parrallax.x / 30;
                }
            }
            table.sort(this.cards, function (a, b) {
                return a.T.x + a.T.w / 2 < b.T.x + b.T.w / 2;
            });
        }
        for (const [k, card] of ipairs(this.cards)) {
            card.rank = k;
        }
        if (this.children.view_deck) {
            this.children.view_deck.set_role({ major: this.cards[1] || this });
        }
    };
    hard_set_T(X, Y, W, H) {
        let x = X || this.T.x;
        let y = Y || this.T.y;
        let w = W || this.T.w;
        let h = H || this.T.h;
        Moveable.prototype.hard_set_T.call(this, x, y, w, h);
        this.calculate_parrallax();
        this.align_cards();
        this.hard_set_cards();
    };
    hard_set_cards() {
        for (const [k, card] of pairs(this.cards)) {
            card.hard_set_T();
            card.calculate_parrallax();
        }
    };
    shuffle(_seed) {
        pseudoshuffle(this.cards, pseudoseed(_seed || "shuffle"));
        this.set_ranks();
    };
    sort(method) {
        this.config.sort = method || this.config.sort;
        if (this.config.sort === "desc") {
            table.sort(this.cards, function (a, b) {
                return a.get_nominal() > b.get_nominal();
            });
        }
        else if (this.config.sort === "asc") {
            table.sort(this.cards, function (a, b) {
                return a.get_nominal() < b.get_nominal();
            });
        }
        else if (this.config.sort === "suit desc") {
            table.sort(this.cards, function (a, b) {
                return a.get_nominal("suit") > b.get_nominal("suit");
            });
        }
        else if (this.config.sort === "suit asc") {
            table.sort(this.cards, function (a, b) {
                return a.get_nominal("suit") < b.get_nominal("suit");
            });
        }
        else if (this.config.sort === "order") {
            table.sort(this.cards, function (a, b) {
                return (a.config.card.order || a.config.center.order) < (b.config.card.order || b.config.center.order);
            });
        }
    };
    draw_card_from(area, stay_flipped, discarded_only) {
        if (area.is(CardArea)) {
            if (this.cards.length < this.config.card_limit || this === G.deck || this === G.hand) {
                let card = area.remove_card(undefined, discarded_only);
                if (card) {
                    if (area === G.discard) {
                        card.T.r = 0;
                    }
                    let stay_flipped = G.GAME && G.GAME.blind && G.GAME.blind.stay_flipped(this, card);
                    if (this === G.hand && G.GAME.modifiers.flipped_cards) {
                        if (pseudorandom(pseudoseed("flipped_card")) < 1 / G.GAME.modifiers.flipped_cards) {
                            stay_flipped = true;
                        }
                    }
                    this.emplace(card, undefined, stay_flipped);
                    return true;
                }
            }
        }
    };
    click() {
        if (this === G.deck) {
            G.FUNCS.deck_info();
        }
    };
    save() {
        if (!this.cards) {
            return;
        }
        let cardAreaTable = { cards: {}, config: this.config };
        for (let i = 1; i <= this.cards.length; i++) {
            cardAreaTable.cards[cardAreaTable.cards.length + 1] = this.cards[i].save();
        }
        return cardAreaTable;
    };
    load(cardAreaTable) {
        if (this.cards) {
            remove_all(this.cards);
        }
        this.cards = [];
        if (this.children) {
            remove_all(this.children);
        }
        this.children = [];
        this.config = cardAreaTable.config;
        for (let i = 1; i <= cardAreaTable.cards.length; i++) {
            loading = true;
            let card = new Card(0, 0, G.CARD_W, G.CARD_H, G.P_CENTERS.j_joker, G.P_CENTERS.c_base);
            loading = undefined;
            card.load(cardAreaTable.cards[i]);
            this.cards[this.cards.length + 1] = card;
            if (card.highlighted) {
                this.highlighted[this.highlighted.length + 1] = card;
            }
            card.set_card_area(this);
        }
        this.set_ranks();
        this.align_cards();
        this.hard_set_cards();
    };
    remove() {
        if (this.cards) {
            remove_all(this.cards);
        }
        this.cards = undefined;
        if (this.children) {
            remove_all(this.children);
        }
        this.children = undefined;
        for (const [k, v] of pairs(G.I.CARDAREA)) {
            if (v === this) {
                table.remove(G.I.CARDAREA, k);
            }
        }
        Moveable.remove(this);
    };
}