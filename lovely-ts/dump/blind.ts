///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class Blind extends Moveable {
  constructor(X, Y, W, H) {
    super(X, Y, W, H);
    this.children = {};
    this.config = {};
    this.tilt_var = { mx: 0, my: 0, amt: 0 };
    this.ambient_tilt = 0.3;
    this.chips = 0;
    this.zoom = true;
    this.states.collide.can = true;
    this.colour = copy_table(G.C.BLACK);
    this.dark_colour = darken(this.colour, 0.2);
    this.children.animatedSprite = new AnimatedSprite(
      this.T.x,
      this.T.y,
      this.T.w,
      this.T.h,
      G.ANIMATION_ATLAS["blind_chips"],
      G.P_BLINDS.bl_small.pos
    );
    this.children.animatedSprite.states = this.states;
    this.children.animatedSprite.states.visible = false;
    this.children.animatedSprite.states.drag.can = true;
    this.states.collide.can = true;
    this.states.drag.can = true;
    this.loc_debuff_lines = ["", ""];
    this.shadow_height = 0;
    if (this instanceof Blind) {
      table.insert(G.I.CARD, this);
    }
  }
  change_colour(blind_col) {
    blind_col = blind_col || get_blind_main_colour(this.config.blind.key || "");
    let dark_col = mix_colours(blind_col, G.C.BLACK, 0.4);
    ease_colour(G.C.DYN_UI.MAIN, blind_col);
    ease_colour(G.C.DYN_UI.DARK, dark_col);
    if (!this.boss && this.name) {
      blind_col = darken(G.C.BLACK, 0.05);
      dark_col = lighten(G.C.BLACK, 0.07);
    } else {
      dark_col = mix_colours(blind_col, G.C.BLACK, 0.2);
    }
    ease_colour(G.C.DYN_UI.BOSS_MAIN, blind_col);
    ease_colour(G.C.DYN_UI.BOSS_DARK, dark_col);
  }
  set_text() {
    if (this.config.blind) {
      if (this.disabled) {
        this.loc_name =
          (this.name === "" && this.name) ||
          localize({ type: "name_text", key: this.config.blind.key, set: "Blind" });
        this.loc_debuff_text = "";
        EMPTY(this.loc_debuff_lines);
      } else {
        let loc_vars = undefined;
        if (this.name === "The Ox") {
          loc_vars = [localize(G.GAME.current_round.most_played_poker_hand, "poker_hands")];
        }
        let target = {
          type: "raw_descriptions",
          key: this.config.blind.key,
          set: "Blind",
          vars: loc_vars || this.config.blind.vars,
        };
        let obj = this.config.blind;
        if (obj.loc_vars && type(obj.loc_vars) === "function") {
          let res = obj.loc_vars() || {};
          target.vars = res.vars || target.vars;
          target.key = res.key || target.key;
        }
        let loc_target = localize(target);
        if (loc_target) {
          this.loc_name =
            (this.name === "" && this.name) ||
            localize({ type: "name_text", key: this.config.blind.key, set: "Blind" });
          this.loc_debuff_text = "";
          EMPTY(this.loc_debuff_lines);
          for (const [k, v] of ipairs(loc_target)) {
            this.loc_debuff_text =
              this.loc_debuff_text + (v + ((k <= loc_target.length && " ") || ""));
            this.loc_debuff_lines[k] = v;
          }
        } else {
          this.loc_name = "";
          this.loc_debuff_text = "";
          EMPTY(this.loc_debuff_lines);
        }
      }
    }
  }
  set_blind(blind, reset, silent) {
    if (!reset) {
      if (blind) {
        this.in_blind = true;
      }
      this.config.blind = blind || {};
      this.name = (blind && blind.name) || "";
      this.dollars = (blind && blind.dollars) || 0;
      this.sound_pings = this.dollars + 2;
      if (G.GAME.modifiers.no_blind_reward && G.GAME.modifiers.no_blind_reward[this.get_type()]) {
        this.dollars = 0;
      }
      this.debuff = (blind && blind.debuff) || {};
      this.pos = blind && blind.pos;
      this.mult = (blind && blind.mult) || 0;
      this.disabled = false;
      this.discards_sub = undefined;
      this.hands_sub = undefined;
      this.boss = blind && !!blind.boss;
      this.blind_set = false;
      this.triggered = undefined;
      this.prepped = true;
      this.set_text();
      let obj = this.config.blind;
      this.children.animatedSprite.atlas =
        G.ANIMATION_ATLAS[obj.atlas] || G.ANIMATION_ATLAS["blind_chips"];
      G.GAME.last_blind = G.GAME.last_blind || {};
      G.GAME.last_blind.boss = this.boss;
      G.GAME.last_blind.name = this.name;
      if (blind && blind.name) {
        this.change_colour();
      } else {
        this.change_colour(G.C.BLACK);
      }
      this.chips =
        get_blind_amount(G.GAME.round_resets.ante) *
        this.mult *
        G.GAME.starting_params.ante_scaling;
      this.chip_text = number_format(this.chips);
      if (!blind) {
        this.chips = 0;
      }
      G.GAME.current_round.dollars_to_be_earned =
        (this.dollars > 0 && string.rep(localize("$"), this.dollars) + "") || "";
      G.HUD_blind.alignment.offset.y = -10;
      G.HUD_blind.recalculate(false);
      if (blind && blind.name && blind.name !== "") {
        this.alert_debuff(true);
        G.E_MANAGER.add_event(
          new GameEvent({
            trigger: "after",
            delay: 0.05,
            blockable: false,
            func: function () {
              G.HUD_blind.get_UIE_by_ID("HUD_blind_name").states.visible = false;
              G.HUD_blind.get_UIE_by_ID("dollars_to_be_earned").parent.parent.states.visible =
                false;
              G.HUD_blind.alignment.offset.y = 0;
              G.E_MANAGER.add_event(
                new GameEvent({
                  trigger: "after",
                  delay: 0.15,
                  blockable: false,
                  func: function () {
                    G.HUD_blind.get_UIE_by_ID("HUD_blind_name").states.visible = true;
                    G.HUD_blind.get_UIE_by_ID("dollars_to_be_earned").parent.parent.states.visible =
                      true;
                    G.HUD_blind.get_UIE_by_ID("dollars_to_be_earned").config.object.pop_in(0);
                    G.HUD_blind.get_UIE_by_ID("HUD_blind_name").config.object.pop_in(0);
                    G.HUD_blind.get_UIE_by_ID("HUD_blind_count").juice_up();
                    this.children.animatedSprite.set_sprite_pos(this.config.blind.pos);
                    this.blind_set = true;
                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                    if (!reset && !silent) {
                      this.juice_up();
                      if (blind) {
                        play_sound("chips1", math.random() * 0.1 + 0.55, 0.42);
                        play_sound("gold_seal", math.random() * 0.1 + 1.85, 0.26);
                      }
                    }
                    return true;
                  },
                })
              );
              return true;
            },
          })
        );
      }
      this.config.h_popup_config = { align: "tm", offset: { x: 0, y: -0.1 }, parent: this };
    }
    if (this.name === "The Eye" && !reset) {
      this.hands = {
        ["Flush Five"]: false,
        ["Flush House"]: false,
        ["Five of a Kind"]: false,
        ["Straight Flush"]: false,
        ["Four of a Kind"]: false,
        ["Full House"]: false,
        ["Flush"]: false,
        ["Straight"]: false,
        ["Three of a Kind"]: false,
        ["Two Pair"]: false,
        ["Pair"]: false,
        ["High Card"]: false,
      };
    }
    if (this.name === "The Mouth" && !reset) {
      this.only_hand = false;
    }
    if (this.name === "The Fish" && !reset) {
      this.prepped = undefined;
    }
    if (this.name === "The Water" && !reset) {
      this.discards_sub = G.GAME.current_round.discards_left;
      ease_discard(-this.discards_sub);
    }
    if (this.name === "The Needle" && !reset) {
      this.hands_sub = G.GAME.round_resets.hands - 1;
      ease_hands_played(-this.hands_sub);
    }
    if (this.name === "The Manacle" && !reset) {
      G.hand.change_size(-1);
    }
    if (this.name === "Amber Acorn" && !reset && G.jokers.cards.length > 0) {
      G.jokers.unhighlight_all();
      for (const [k, v] of ipairs(G.jokers.cards)) {
        v.flip();
      }
      if (G.jokers.cards.length > 1) {
        G.E_MANAGER.add_event(
          new GameEvent({
            trigger: "after",
            delay: 0.2,
            func: function () {
              G.E_MANAGER.add_event(
                new GameEvent({
                  func: function () {
                    G.jokers.shuffle("aajk");
                    play_sound("cardSlide1", 0.85);
                    return true;
                  },
                })
              );
              delay(0.15);
              G.E_MANAGER.add_event(
                new GameEvent({
                  func: function () {
                    G.jokers.shuffle("aajk");
                    play_sound("cardSlide1", 1.15);
                    return true;
                  },
                })
              );
              delay(0.15);
              G.E_MANAGER.add_event(
                new GameEvent({
                  func: function () {
                    G.jokers.shuffle("aajk");
                    play_sound("cardSlide1", 1);
                    return true;
                  },
                })
              );
              delay(0.5);
              return true;
            },
          })
        );
      }
    }
    if (!reset) {
      if (blind) {
        this.in_blind = true;
      }
      let obj = this.config.blind;
      if (obj.set_blind && type(obj.set_blind) === "function") {
        obj.set_blind();
      }
    }
    for (const [_, v] of ipairs(G.playing_cards)) {
      this.debuff_card(v);
    }
    for (const [_, v] of ipairs(G.jokers.cards)) {
      if (!reset) {
        this.debuff_card(v, true);
      }
    }
    G.ARGS.spin.real =
      ((G.SETTINGS.reduced_motion && 0) || 1) *
      ((this.config.blind.boss && ((this.config.blind.boss.showdown && 0.5) || 0.25)) || 0);
  }
  alert_debuff(first) {
    if (this.loc_debuff_text && this.loc_debuff_text !== "") {
      this.block_play = true;
      G.E_MANAGER.add_event(
        new GameEvent({
          blockable: false,
          blocking: false,
          func: function () {
            if (this.disabled) {
              this.block_play = undefined;
              return true;
            }
            if (G.STATE === G.STATES.SELECTING_HAND) {
              G.E_MANAGER.add_event(
                new GameEvent({
                  trigger: "after",
                  delay: G.SETTINGS.GAMESPEED * 0.05,
                  blockable: false,
                  func: function () {
                    play_sound("whoosh1", 0.55, 0.62);
                    for (let i = 1; i <= 4; i++) {
                      let wait_time = 0.1 * (i - 1);
                      G.E_MANAGER.add_event(
                        new GameEvent({
                          blockable: false,
                          trigger: "after",
                          delay: G.SETTINGS.GAMESPEED * wait_time,
                          func: function () {
                            if (i === 1) {
                              this.juice_up();
                            }
                            play_sound("cancel", 0.7 + 0.05 * i, 0.7);
                            return true;
                          },
                        })
                      );
                    }
                    let hold_time =
                      G.SETTINGS.GAMESPEED * (this.loc_debuff_text.length * 0.035 + 1.3);
                    let disp_text = this.get_loc_debuff_text();
                    attention_text({
                      scale: 0.7,
                      text: disp_text,
                      maxw: 12,
                      hold: hold_time,
                      align: "cm",
                      offset: { x: 0, y: -1 },
                      major: G.play,
                    });
                    G.E_MANAGER.add_event(
                      new GameEvent({
                        trigger: "after",
                        delay: 1,
                        blocking: false,
                        blockable: false,
                        func: function () {
                          this.block_play = undefined;
                          if (G.buttons) {
                            let _buttons = G.buttons.get_UIE_by_ID("play_button");
                            _buttons.disable_button = undefined;
                          }
                          return true;
                        },
                      })
                    );
                    return true;
                  },
                })
              );
              return true;
            }
          },
        })
      );
    }
  }
  get_loc_debuff_text() {
    let obj = this.config.blind;
    if (obj.get_loc_debuff_text && type(obj.get_loc_debuff_text) === "function") {
      return obj.get_loc_debuff_text();
    }
    let disp_text =
      ((this.config.blind.name === "The Wheel" && G.GAME.probabilities.normal) || "") +
      this.loc_debuff_text;
    if (this.config.blind.name === "The Mouth" && this.only_hand) {
      disp_text = disp_text + (" [" + (localize(this.only_hand, "poker_hands") + "]"));
    }
    return disp_text;
  }
  defeat(silent) {
    let dissolve_time = 1.3;
    let extra_time = 0;
    this.dissolve = 0;
    this.dissolve_colours = [G.C.BLACK, G.C.RED];
    this.juice_up();
    this.children.particles = Particles(0, 0, 0, 0, {
      timer_type: "TOTAL",
      timer: 0.01 * dissolve_time,
      scale: 0.1,
      speed: 1.5,
      lifespan: 0.7 * dissolve_time,
      attach: this,
      colours: this.dissolve_colours,
      fill: true,
    });
    let blind_name_dynatext = G.HUD_blind.get_UIE_by_ID("HUD_blind_name").config.object;
    blind_name_dynatext.pop_out(2);
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "after",
        blockable: false,
        delay: 0.5 * dissolve_time,
        func: function () {
          this.children.particles.max = 0;
          return true;
        },
      })
    );
    if (!silent) {
      for (let i = 1; i <= math.min(this.sound_pings || 3, 7); i++) {
        extra_time = extra_time + (0.4 + 0.15 * i) * dissolve_time;
        G.E_MANAGER.add_event(
          new GameEvent({
            blockable: false,
            trigger: "after",
            delay: (0.15 - 0.01 * (this.sound_pings || 3)) * i * dissolve_time,
            func: function () {
              play_sound("cancel", 0.8 - 0.05 * i, 1.7);
              if (i === math.min((this.sound_pings || 3) + 1, 6)) {
                play_sound("whoosh2", 0.7, 0.42);
              }
              return true;
            },
          })
        );
      }
    }
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "ease",
        blockable: false,
        ref_table: this,
        ref_value: "dissolve",
        ease_to: 1,
        delay: 0.7 * dissolve_time,
        func: function (t) {
          return t;
        },
      })
    );
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "after",
        blockable: false,
        delay: 0.8 * dissolve_time,
        func: function () {
          G.HUD_blind.alignment.offset.y = -10;
          return true;
        },
      })
    );
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "after",
        blockable: false,
        delay: 0.95 * dissolve_time,
        func: function () {
          this.dissolve = undefined;
          this.set_blind(undefined, undefined, true);
          return true;
        },
      })
    );
    for (const [k, v] of ipairs(G.jokers.cards)) {
      if (v.facing === "back") {
        v.flip();
      }
    }
    let obj = this.config.blind;
    if (obj.defeat && type(obj.defeat) === "function") {
      obj.defeat();
    }
    if (this.name === "Crimson Heart") {
      for (const [_, v] of ipairs(G.jokers.cards)) {
        v.ability.crimson_heart_chosen = undefined;
      }
    }
    if (this.name === "The Manacle" && !this.disabled) {
      G.hand.change_size(1);
    }
  }
  get_type() {
    if (this.name === "Small Blind") {
      return "Small";
    } else if (this.name === "Big Blind") {
      return "Big";
    } else if (this.name && this.name !== "") {
      return "Boss";
    }
  }
  disable() {
    this.disabled = true;
    for (const [k, v] of ipairs(G.jokers.cards)) {
      if (v.facing === "back") {
        v.flip();
      }
    }
    let obj = this.config.blind;
    if (obj.disable && type(obj.disable) === "function") {
      obj.disable();
    }
    if (this.name === "Crimson Heart") {
      for (const [_, v] of ipairs(G.jokers.cards)) {
        v.ability.crimson_heart_chosen = undefined;
      }
    }
    if (this.name === "The Water") {
      ease_discard(this.discards_sub);
    }
    if (
      this.name === "The Wheel" ||
      this.name === "The House" ||
      this.name === "The Mark" ||
      this.name === "The Fish"
    ) {
      for (let i = 1; i <= G.hand.cards.length; i++) {
        if (G.hand.cards[i].facing === "back") {
          G.hand.cards[i].flip();
        }
      }
      for (const [k, v] of pairs(G.playing_cards)) {
        v.ability.wheel_flipped = undefined;
      }
    }
    if (this.name === "The Needle") {
      ease_hands_played(this.hands_sub);
    }
    if (this.name === "The Wall") {
      this.chips = this.chips / 2;
      this.chip_text = number_format(this.chips);
    }
    if (this.name === "Cerulean Bell") {
      for (const [k, v] of ipairs(G.playing_cards)) {
        v.ability.forced_selection = undefined;
      }
    }
    if (this.name === "The Manacle") {
      G.hand.change_size(1);
    }
    if (this.name === "The Serpent") {
    }
    if (this.name === "Violet Vessel") {
      this.chips = this.chips / 3;
      this.chip_text = number_format(this.chips);
    }
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "immediate",
        func: function () {
          if (this.boss && G.GAME.chips - G.GAME.blind.chips >= 0) {
            G.STATE = G.STATES.NEW_ROUND;
            G.STATE_COMPLETE = false;
          }
          return true;
        },
      })
    );
    for (const [_, v] of ipairs(G.playing_cards)) {
      this.debuff_card(v);
    }
    for (const [_, v] of ipairs(G.jokers.cards)) {
      this.debuff_card(v);
    }
    this.set_text();
    this.wiggle();
  }
  wiggle() {
    this.children.animatedSprite.juice_up(0.3);
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "after",
        delay: 0.06 * G.SETTINGS.GAMESPEED,
        blockable: false,
        blocking: false,
        func: function () {
          play_sound("tarot2", 0.76, 0.4);
          return true;
        },
      })
    );
    play_sound("tarot2", 1, 0.4);
  }
  juice_up(_a, _b) {
    this.children.animatedSprite.juice_up(_a || 0.2, _b || 0.2);
  }
  hover() {
    if (!G.CONTROLLER.dragging.target || G.CONTROLLER.using_touch) {
      if (!this.hovering && this.states.visible && this.children.animatedSprite.states.visible) {
        this.hovering = true;
        this.hover_tilt = 2;
        this.children.animatedSprite.juice_up(0.05, 0.02);
        play_sound("chips1", math.random() * 0.1 + 0.55, 0.12);
        Node.hover(this);
      }
    }
  }
  stop_hover() {
    this.hovering = false;
    this.hover_tilt = 0;
    Node.stop_hover(this);
  }
  draw() {
    if (!this.states.visible) {
      return;
    }
    this.tilt_var = this.tilt_var || {};
    [this.tilt_var.mx, this.tilt_var.my] = [
      G.CONTROLLER.cursor_position.x,
      G.CONTROLLER.cursor_position.y,
    ];
    this.children.animatedSprite.role.draw_major = this;
    this.children.animatedSprite.draw_shader("dissolve", 0.1);
    this.children.animatedSprite.draw_shader("dissolve");
    for (const [k, v] of pairs(this.children)) {
      if (k !== "animatedSprite") {
        v.VT.scale = this.VT.scale;
        v.draw();
      }
    }
    add_to_drawhash(this);
  }
  press_play() {
    if (this.disabled) {
      return;
    }
    let obj = this.config.blind;
    if (obj.press_play && type(obj.press_play) === "function") {
      return obj.press_play();
    }
    if (this.name === "The Hook") {
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            let any_selected = undefined;
            let _cards = {};
            for (const [k, v] of ipairs(G.hand.cards)) {
              _cards[_cards.length + 1] = v;
            }
            for (let i = 1; i <= 2; i++) {
              if (G.hand.cards[i]) {
                let [selected_card, card_key] = pseudorandom_element(_cards, pseudoseed("hook"));
                G.hand.add_to_highlighted(selected_card, true);
                table.remove(_cards, card_key);
                any_selected = true;
                play_sound("card1", 1);
              }
            }
            if (any_selected) {
              G.FUNCS.discard_cards_from_highlighted(undefined, true);
            }
            return true;
          },
        })
      );
      this.triggered = true;
      delay(0.7);
      return true;
    }
    if (this.name === "Crimson Heart") {
      if (G.jokers.cards[1]) {
        this.triggered = true;
        this.prepped = true;
      }
    }
    if (this.name === "The Fish") {
      this.prepped = true;
    }
    if (this.name === "The Tooth") {
      G.E_MANAGER.add_event(
        new GameEvent({
          trigger: "after",
          delay: 0.2,
          func: function () {
            for (let i = 1; i <= G.play.cards.length; i++) {
              G.E_MANAGER.add_event(
                new GameEvent({
                  func: function () {
                    G.play.cards[i].juice_up();
                    return true;
                  },
                })
              );
              ease_dollars(-1);
              delay(0.23);
            }
            return true;
          },
        })
      );
      this.triggered = true;
      return true;
    }
  }
  modify_hand(cards, poker_hands, text, mult, hand_chips) {
    if (this.disabled) {
      return [mult, hand_chips, false];
    }
    let obj = this.config.blind;
    if (obj.modify_hand && type(obj.modify_hand) === "function") {
      return obj.modify_hand(cards, poker_hands, text, mult, hand_chips);
    }
    if (this.name === "The Flint") {
      this.triggered = true;
      return [
        math.max(math.floor(mult * 0.5 + 0.5), 1),
        math.max(math.floor(hand_chips * 0.5 + 0.5), 0),
        true,
      ];
    }
    return [mult, hand_chips, false];
  }
  debuff_hand(cards, hand, handname, check) {
    if (this.disabled) {
      return;
    }
    let obj = this.config.blind;
    if (obj.debuff_hand && type(obj.debuff_hand) === "function") {
      return obj.debuff_hand(cards, hand, handname, check);
    }
    if (this.debuff) {
      this.triggered = false;
      if (this.debuff.hand && next(hand[this.debuff.hand])) {
        this.triggered = true;
        return true;
      }
      if (this.debuff.h_size_ge && cards.length < this.debuff.h_size_ge) {
        this.triggered = true;
        return true;
      }
      if (this.debuff.h_size_le && cards.length > this.debuff.h_size_le) {
        this.triggered = true;
        return true;
      }
      if (this.name === "The Eye") {
        if (this.hands[handname]) {
          this.triggered = true;
          return true;
        }
        if (!check) {
          this.hands[handname] = true;
        }
      }
      if (this.name === "The Mouth") {
        if (this.only_hand && this.only_hand !== handname) {
          this.triggered = true;
          return true;
        }
        if (!check) {
          this.only_hand = handname;
        }
      }
    }
    if (this.name === "The Arm") {
      this.triggered = false;
      if (G.GAME.hands[handname].level > 1) {
        this.triggered = true;
        if (!check) {
          level_up_hand(this.children.animatedSprite, handname, undefined, -1);
          this.wiggle();
        }
      }
    }
    if (this.name === "The Ox") {
      this.triggered = false;
      if (handname === G.GAME.current_round.most_played_poker_hand) {
        this.triggered = true;
        if (!check) {
          ease_dollars(-G.GAME.dollars, true);
          this.wiggle();
        }
      }
    }
  }
  drawn_to_hand() {
    if (!this.disabled) {
      let obj = this.config.blind;
      if (obj.drawn_to_hand && type(obj.drawn_to_hand) === "function") {
        obj.drawn_to_hand();
      }
      if (this.name === "Cerulean Bell") {
        let any_forced = undefined;
        for (const [k, v] of ipairs(G.hand.cards)) {
          if (v.ability.forced_selection) {
            any_forced = true;
          }
        }
        if (!any_forced) {
          G.hand.unhighlight_all();
          let forced_card = pseudorandom_element(G.hand.cards, pseudoseed("cerulean_bell"));
          forced_card.ability.forced_selection = true;
          G.hand.add_to_highlighted(forced_card);
        }
      }
      if (this.name === "Crimson Heart" && this.prepped && G.jokers.cards[1]) {
        let prev_chosen_set = {};
        let fallback_jokers = {};
        let jokers = {};
        for (let i = 1; i <= G.jokers.cards.length; i++) {
          if (G.jokers.cards[i].ability.crimson_heart_chosen) {
            prev_chosen_set[G.jokers.cards[i]] = true;
            G.jokers.cards[i].ability.crimson_heart_chosen = undefined;
            if (G.jokers.cards[i].debuff) {
              SMODS.recalc_debuff(G.jokers.cards[i]);
            }
          }
        }
        for (let i = 1; i <= G.jokers.cards.length; i++) {
          if (!G.jokers.cards[i].debuff) {
            if (!prev_chosen_set[G.jokers.cards[i]]) {
              jokers[jokers.length + 1] = G.jokers.cards[i];
            }
            table.insert(fallback_jokers, G.jokers.cards[i]);
          }
        }
        if (jokers.length === 0) {
          jokers = fallback_jokers;
        }
        let _card = pseudorandom_element(jokers, pseudoseed("crimson_heart"));
        if (_card) {
          _card.ability.crimson_heart_chosen = true;
          SMODS.recalc_debuff(_card);
          _card.juice_up();
          this.wiggle();
        }
      }
    }
    this.prepped = undefined;
  }
  stay_flipped(area, card) {
    if (!this.disabled) {
      let obj = this.config.blind;
      if (obj.stay_flipped && type(obj.stay_flipped) === "function") {
        return obj.stay_flipped(area, card);
      }
      if (area === G.hand) {
        if (
          this.name === "The Wheel" &&
          pseudorandom(pseudoseed("wheel")) < G.GAME.probabilities.normal / 7
        ) {
          return true;
        }
        if (
          this.name === "The House" &&
          G.GAME.current_round.hands_played === 0 &&
          G.GAME.current_round.discards_used === 0
        ) {
          return true;
        }
        if (this.name === "The Mark" && card.is_face(true)) {
          return true;
        }
        if (this.name === "The Fish" && this.prepped) {
          return true;
        }
      }
    }
  }
  debuff_card(card, from_blind) {
    let obj = this.config.blind;
    if (!this.disabled && obj.recalc_debuff && type(obj.recalc_debuff) === "function") {
      if (obj.recalc_debuff(card, from_blind)) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
      } else {
        card.set_debuff(false);
      }
      return;
    } else if (!this.disabled && obj.debuff_card && type(obj.debuff_card) === "function") {
      sendWarnMessage(
        "Blind object %s has debuff_card function, recalc_debuff is preferred".format(obj.key),
        obj.set
      );
      if (obj.debuff_card(card, from_blind)) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
      } else {
        card.set_debuff(false);
      }
      return;
    }
    if (this.debuff && !this.disabled && card.area !== G.jokers) {
      if (this.debuff.suit && card.is_suit(this.debuff.suit, true)) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
        return;
      }
      if (this.debuff.is_face === "face" && card.is_face(true)) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
        return;
      }
      if (this.name === "The Pillar" && card.ability.played_this_ante) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
        return;
      }
      if (this.debuff.value && this.debuff.value === card.base.value) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
        return;
      }
      if (this.debuff.nominal && this.debuff.nominal === card.base.nominal) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
        return;
      }
    }
    if (this.name === "Crimson Heart" && !this.disabled && card.area === G.jokers) {
      if (card.ability.crimson_heart_chosen) {
        card.set_debuff(true);
        if (card.debuff) {
          card.debuffed_by_blind = true;
        }
        return;
      }
    }
    if (this.name === "Verdant Leaf" && !this.disabled && card.area !== G.jokers) {
      card.set_debuff(true);
      if (card.debuff) {
        card.debuffed_by_blind = true;
      }
      return;
    }
    card.set_debuff(false);
  }
  move(dt) {
    Moveable.move(this, dt);
    this.align();
  }
  change_dim(w, h) {
    this.T.w = w || this.T.w;
    this.T.h = h || this.T.h;
    this.children.animatedSprite.T.w = w || this.T.w;
    this.children.animatedSprite.T.h = h || this.T.h;
    this.children.animatedSprite.rescale();
  }
  align() {
    for (const [k, v] of pairs(this.children)) {
      if (k === "animatedSprite") {
        if (!v.states.drag.is) {
          v.T.r = 0.02 * math.sin(2 * G.TIMERS.REAL + this.T.x);
          v.T.y = this.T.y + 0.03 * math.sin(0.666 * G.TIMERS.REAL + this.T.x);
          this.shadow_height = 0.1 - (0.04 + 0.03 * math.sin(0.666 * G.TIMERS.REAL + this.T.x));
          v.T.x = this.T.x + 0.03 * math.sin(0.436 * G.TIMERS.REAL + this.T.x);
        }
      } else {
        v.T.x = this.T.x;
        v.T.y = this.T.y;
        v.T.r = this.T.r;
      }
    }
  }
  save() {
    let blindTable = {
      in_blind: this.in_blind,
      name: this.name,
      dollars: this.dollars,
      debuff: this.debuff,
      pos: this.pos,
      mult: this.mult,
      disabled: this.disabled,
      discards_sub: this.discards_sub,
      hands_sub: this.hands_sub,
      boss: this.boss,
      config_blind: "",
      chips: this.chips,
      chip_text: this.chip_text,
      hands: this.hands,
      only_hand: this.only_hand,
      triggered: this.triggered,
    };
    for (const [k, v] of pairs(G.P_BLINDS)) {
      if (v && v.name && v.name === blindTable.name) {
        blindTable.config_blind = k;
      }
    }
    return blindTable;
  }
  load(blindTable) {
    this.in_blind = blindTable.in_blind;
    this.config.blind = G.P_BLINDS[blindTable.config_blind] || {};
    this.name = blindTable.name;
    this.dollars = blindTable.dollars;
    this.debuff = blindTable.debuff;
    this.pos = blindTable.pos;
    this.mult = blindTable.mult;
    this.disabled = blindTable.disabled;
    this.discards_sub = blindTable.discards_sub;
    this.hands_sub = blindTable.hands_sub;
    this.boss = blindTable.boss;
    this.chips = blindTable.chips;
    this.chip_text = blindTable.chip_text;
    this.hands = blindTable.hands;
    this.only_hand = blindTable.only_hand;
    this.triggered = blindTable.triggered;
    G.ARGS.spin.real =
      ((G.SETTINGS.reduced_motion && 0) || 1) *
      ((this.config.blind.boss && ((this.config.blind.boss.showdown && 1) || 0.3)) || 0);
    if (G.P_BLINDS[blindTable.config_blind]) {
      if (this.config.blind.atlas) {
        this.children.animatedSprite.atlas = G.ANIMATION_ATLAS[this.config.blind.atlas];
      }
      this.blind_set = true;
      this.children.animatedSprite.states.visible = true;
      this.children.animatedSprite.set_sprite_pos(this.config.blind.pos);
      this.children.animatedSprite.juice_up(0.3);
      this.align();
      this.children.animatedSprite.hard_set_VT();
    } else {
      this.children.animatedSprite.states.visible = false;
    }
    this.children.animatedSprite.states = this.states;
    this.change_colour();
    if (this.dollars > 0) {
      G.GAME.current_round.dollars_to_be_earned = string.rep(localize("$"), this.dollars) + "";
      G.HUD_blind.get_UIE_by_ID("dollars_to_be_earned").config.object.pop_in(0);
    }
    if (G.GAME.blind.name && G.GAME.blind.name !== "") {
      G.HUD_blind.alignment.offset.y = 0;
    }
    this.set_text();
  }
}
