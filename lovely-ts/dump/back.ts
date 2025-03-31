///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class Back extends LuaObject {
  atlas: any;
  name: any;
  effect: { center: any; text_UI: string; config: void };
  loc_name: void;
  pos: any;
  constructor() {
    super();
    if (!selected_back) {
      selected_back = G.P_CENTERS.b_red;
    }
    this.atlas = (selected_back.unlocked && selected_back.atlas) || undefined;
    this.name = selected_back.name || "Red Deck";
    this.effect = { center: selected_back, text_UI: "", config: copy_table(selected_back.config) };
    this.loc_name = localize({ type: "name_text", set: "Back", key: this.effect.center.key });
    let pos = (this.effect.center.unlocked && this.effect.center.pos) || { x: 4, y: 0 };
    this.pos = this.pos || {};
    this.pos.x = pos.x;
    this.pos.y = pos.y;
  }
  get_name() {
    if (this.effect.center.unlocked) {
      return this.loc_name;
    } else {
      return localize("k_locked");
    }
  }
  generate_UI(other, ui_scale, min_dims, challenge) {
    min_dims = min_dims || 0.7;
    ui_scale = ui_scale || 0.9;
    let back_config = other || this.effect.center;
    let name_to_check = (other && other.name) || this.name;
    let effect_config = (other && other.config) || this.effect.config;
    challenge = G.CHALLENGES[get_challenge_int_from_id(challenge || "") || ""] || { name: "ERROR" };
    let [loc_args, loc_nodes] = [undefined, {}];
    if (!back_config.unlocked) {
      let localized_by_smods;
      let key_override;
      if (back_config.locked_loc_vars && type(back_config.locked_loc_vars) === "function") {
        let res = back_config.locked_loc_vars() || {};
        loc_args = res.vars || {};
        key_override = res.key;
      }
      if (G.localization.descriptions.Back[key_override || back_config.key].unlock_parsed) {
        localize({
          type: "unlocks",
          key: key_override || back_config.key,
          set: "Back",
          nodes: loc_nodes,
          vars: loc_args,
        });
        localized_by_smods = true;
      }
      if (!back_config.unlock_condition) {
        if (!localized_by_smods) {
          localize({
            type: "descriptions",
            key: "demo_locked",
            set: "Other",
            nodes: loc_nodes,
            vars: loc_args,
          });
        }
      } else if (back_config.unlock_condition.type === "win_deck") {
        let other_name = localize("k_unknown");
        if (G.P_CENTERS[back_config.unlock_condition.deck].unlocked) {
          other_name = localize({
            type: "name_text",
            set: "Back",
            key: back_config.unlock_condition.deck,
          });
        }
        loc_args = loc_args || [other_name];
        localize({
          type: "descriptions",
          key: "deck_locked_win",
          set: "Other",
          nodes: loc_nodes,
          vars: loc_args,
        });
      } else if (back_config.unlock_condition.type === "discover_amount") {
        loc_args = loc_args || [tostring(back_config.unlock_condition.amount)];
        localize({
          type: "descriptions",
          key: "deck_locked_discover",
          set: "Other",
          nodes: loc_nodes,
          vars: loc_args,
        });
      } else if (back_config.unlock_condition.type === "win_stake") {
        let other_name = localize({
          type: "name_text",
          set: "Stake",
          key: G.P_CENTER_POOLS.Stake[back_config.unlock_condition.stake].key,
        });
        loc_args = loc_args || {
          [1]: other_name,
          colours: [get_stake_col(back_config.unlock_condition.stake)],
        };
        localize({
          type: "descriptions",
          key: "deck_locked_stake",
          set: "Other",
          nodes: loc_nodes,
          vars: loc_args,
        });
      }
    } else {
      let key_override;
      if (back_config.loc_vars && type(back_config.loc_vars) === "function") {
        let res = back_config.loc_vars() || {};
        loc_args = res.vars || {};
        key_override = res.key;
      } else if (name_to_check === "Blue Deck") {
        loc_args = [effect_config.hands];
      } else if (name_to_check === "Red Deck") {
        loc_args = [effect_config.discards];
      } else if (name_to_check === "Yellow Deck") {
        loc_args = [effect_config.dollars];
      } else if (name_to_check === "Green Deck") {
        loc_args = [effect_config.extra_hand_bonus, effect_config.extra_discard_bonus];
      } else if (name_to_check === "Black Deck") {
        loc_args = [effect_config.joker_slot, -effect_config.hands];
      } else if (name_to_check === "Magic Deck") {
        loc_args = [
          localize({ type: "name_text", key: "v_crystal_ball", set: "Voucher" }),
          localize({ type: "name_text", key: "c_fool", set: "Tarot" }),
        ];
      } else if (name_to_check === "Nebula Deck") {
        loc_args = [localize({ type: "name_text", key: "v_telescope", set: "Voucher" }), -1];
      } else if (name_to_check === "Ghost Deck") {
      } else if (name_to_check === "Abandoned Deck") {
      } else if (name_to_check === "Checkered Deck") {
      } else if (name_to_check === "Zodiac Deck") {
        loc_args = [
          localize({ type: "name_text", key: "v_tarot_merchant", set: "Voucher" }),
          localize({ type: "name_text", key: "v_planet_merchant", set: "Voucher" }),
          localize({ type: "name_text", key: "v_overstock_norm", set: "Voucher" }),
        ];
      } else if (name_to_check === "Painted Deck") {
        loc_args = [effect_config.hand_size, effect_config.joker_slot];
      } else if (name_to_check === "Anaglyph Deck") {
        loc_args = [localize({ type: "name_text", key: "tag_double", set: "Tag" })];
      } else if (name_to_check === "Plasma Deck") {
        loc_args = [effect_config.ante_scaling];
      } else if (name_to_check === "Erratic Deck") {
      }
      localize({
        type: "descriptions",
        key: key_override || back_config.key,
        set: "Back",
        nodes: loc_nodes,
        vars: loc_args,
      });
    }
    return {
      n: G.UIT.ROOT,
      config: {
        align: "cm",
        minw: min_dims * 5,
        minh: min_dims * 2.5,
        id: this.name,
        colour: G.C.CLEAR,
      },
      nodes: [
        (name_to_check === "Challenge Deck" &&
          UIBox_button({
            button: "deck_view_challenge",
            label: [localize(challenge.id, "challenge_names")],
            minw: 2.2,
            minh: 1,
            scale: 0.6,
            id: challenge,
          })) ||
          desc_from_rows(loc_nodes, true, min_dims * 5),
      ],
    };
  }
  change_to(new_back) {
    if (!new_back) {
      new_back = G.P_CENTERS.b_red;
    }
    this.atlas = (new_back.unlocked && new_back.atlas) || undefined;
    this.name = new_back.name || "Red Deck";
    this.effect = { center: new_back, text_UI: "", config: copy_table(new_back.config) };
    this.loc_name = localize({ type: "name_text", set: "Back", key: this.effect.center.key });
    let pos = (this.effect.center.unlocked && copy_table(new_back.pos)) || { x: 4, y: 0 };
    this.pos.x = pos.x;
    this.pos.y = pos.y;
  }
  save() {
    let backTable = {
      name: this.name,
      pos: this.pos,
      effect: this.effect,
      key: this.effect.center.key || "b_red",
    };
    return backTable;
  }
  trigger_effect(args) {
    if (!args) {
      return;
    }
    let obj = this.effect.center;
    if (type(obj.calculate) === "function") {
      let o = [obj.calculate(this, args)];
      if (next(o) !== undefined) {
        return unpack(o);
      }
    } else if (type(obj.trigger_effect) === "function") {
      let o = [obj.trigger_effect(args)];
      if (next(o) !== undefined) {
        sendWarnMessage(
          'Found `trigger_effect` function on SMODS.Back object "%s". This field is deprecated; please use `calculate` instead.'.format(
            obj.key
          ),
          "Back"
        );
        return unpack(o);
      }
    }
    if (
      this.name === "Anaglyph Deck" &&
      args.context === "eval" &&
      G.GAME.last_blind &&
      G.GAME.last_blind.boss
    ) {
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            add_tag(Tag("tag_double"));
            play_sound("generic1", 0.9 + math.random() * 0.1, 0.8);
            play_sound("holo1", 1.2 + math.random() * 0.1, 0.4);
            return true;
          },
        })
      );
    }
    if (this.name === "Plasma Deck" && args.context === "blind_amount") {
      return;
    }
    if (this.name === "Plasma Deck" && args.context === "final_scoring_step") {
      let tot = args.chips + args.mult;
      args.chips = math.floor(tot / 2);
      args.mult = math.floor(tot / 2);
      update_hand_text({ delay: 0 }, { mult: args.mult, chips: args.chips });
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            let text = localize("k_balanced");
            play_sound("gong", 0.94, 0.3);
            play_sound("gong", 0.94 * 1.5, 0.2);
            play_sound("tarot1", 1.5);
            ease_colour(G.C.UI_CHIPS, [0.8, 0.45, 0.85, 1]);
            ease_colour(G.C.UI_MULT, [0.8, 0.45, 0.85, 1]);
            attention_text({
              scale: 1.4,
              text: text,
              hold: 2,
              align: "cm",
              offset: { x: 0, y: -2.7 },
              major: G.play,
            });
            G.E_MANAGER.add_event(
              new GameEvent({
                trigger: "after",
                blockable: false,
                blocking: false,
                delay: 4.3,
                func: function () {
                  ease_colour(G.C.UI_CHIPS, G.C.BLUE, 2);
                  ease_colour(G.C.UI_MULT, G.C.RED, 2);
                  return true;
                },
              })
            );
            G.E_MANAGER.add_event(
              new GameEvent({
                trigger: "after",
                blockable: false,
                blocking: false,
                no_delete: true,
                delay: 6.3,
                func: function () {
                  [G.C.UI_CHIPS[1], G.C.UI_CHIPS[2], G.C.UI_CHIPS[3], G.C.UI_CHIPS[4]] = [
                    G.C.BLUE[1],
                    G.C.BLUE[2],
                    G.C.BLUE[3],
                    G.C.BLUE[4],
                  ];
                  [G.C.UI_MULT[1], G.C.UI_MULT[2], G.C.UI_MULT[3], G.C.UI_MULT[4]] = [
                    G.C.RED[1],
                    G.C.RED[2],
                    G.C.RED[3],
                    G.C.RED[4],
                  ];
                  return true;
                },
              })
            );
            return true;
          },
        })
      );
      delay(0.6);
      return [args.chips, args.mult];
    }
  }
  apply_to_run() {
    let obj = this.effect.center;
    if (obj.apply && type(obj.apply) === "function") {
      obj.apply(this);
    }
    if (this.effect.config.jokers) {
      delay(0.4);
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            for (const [k, v] of ipairs(this.effect.config.jokers)) {
              let card = create_card(
                "Joker",
                G.jokers,
                undefined,
                undefined,
                undefined,
                undefined,
                v,
                "deck"
              );
              card.add_to_deck();
              G.jokers.emplace(card);
              card.start_materialize();
            }
            return true;
          },
        })
      );
    }
    if (this.effect.config.voucher) {
      G.GAME.used_vouchers[this.effect.config.voucher] = true;
      G.GAME.starting_voucher_count = (G.GAME.starting_voucher_count || 0) + 1;
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            Card.apply_to_run(undefined, G.P_CENTERS[this.effect.config.voucher]);
            return true;
          },
        })
      );
    }
    if (this.effect.config.hands) {
      G.GAME.starting_params.hands = G.GAME.starting_params.hands + this.effect.config.hands;
    }
    if (this.effect.config.consumables) {
      delay(0.4);
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            for (const [k, v] of ipairs(this.effect.config.consumables)) {
              let card = create_card(
                "Tarot",
                G.consumeables,
                undefined,
                undefined,
                undefined,
                undefined,
                v,
                "deck"
              );
              card.add_to_deck();
              G.consumeables.emplace(card);
            }
            return true;
          },
        })
      );
    }
    if (this.effect.config.dollars) {
      G.GAME.starting_params.dollars = G.GAME.starting_params.dollars + this.effect.config.dollars;
    }
    if (this.effect.config.remove_faces) {
      G.GAME.starting_params.no_faces = true;
    }
    if (this.effect.config.spectral_rate) {
      G.GAME.spectral_rate = this.effect.config.spectral_rate;
    }
    if (this.effect.config.discards) {
      G.GAME.starting_params.discards =
        G.GAME.starting_params.discards + this.effect.config.discards;
    }
    if (this.effect.config.reroll_discount) {
      G.GAME.starting_params.reroll_cost =
        G.GAME.starting_params.reroll_cost - this.effect.config.reroll_discount;
    }
    if (this.effect.config.edition) {
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            let i = 0;
            while (i < this.effect.config.edition_count) {
              let card = pseudorandom_element(G.playing_cards, pseudoseed("edition_deck"));
              if (!card.edition) {
                i = i + 1;
                card.set_edition({ [this.effect.config.edition]: true }, undefined, true);
              }
            }
            return true;
          },
        })
      );
    }
    if (this.effect.config.vouchers) {
      for (const [k, v] of pairs(this.effect.config.vouchers)) {
        G.GAME.used_vouchers[v] = true;
        G.GAME.starting_voucher_count = (G.GAME.starting_voucher_count || 0) + 1;
        G.E_MANAGER.add_event(
          new GameEvent({
            func: function () {
              Card.apply_to_run(undefined, G.P_CENTERS[v]);
              return true;
            },
          })
        );
      }
    }
    if (this.name === "Checkered Deck") {
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            for (const [k, v] of pairs(G.playing_cards)) {
              if (v.base.suit === "Clubs") {
                v.change_suit("Spades");
              }
              if (v.base.suit === "Diamonds") {
                v.change_suit("Hearts");
              }
            }
            return true;
          },
        })
      );
    }
    if (this.effect.config.randomize_rank_suit) {
      G.GAME.starting_params.erratic_suits_and_ranks = true;
    }
    if (this.effect.config.joker_slot) {
      G.GAME.starting_params.joker_slots =
        G.GAME.starting_params.joker_slots + this.effect.config.joker_slot;
    }
    if (this.effect.config.hand_size) {
      G.GAME.starting_params.hand_size =
        G.GAME.starting_params.hand_size + this.effect.config.hand_size;
    }
    if (this.effect.config.ante_scaling) {
      G.GAME.starting_params.ante_scaling = this.effect.config.ante_scaling;
    }
    if (this.effect.config.consumable_slot) {
      G.GAME.starting_params.consumable_slots =
        G.GAME.starting_params.consumable_slots + this.effect.config.consumable_slot;
    }
    if (this.effect.config.no_interest) {
      G.GAME.modifiers.no_interest = true;
    }
    if (this.effect.config.extra_hand_bonus) {
      G.GAME.modifiers.money_per_hand = this.effect.config.extra_hand_bonus;
    }
    if (this.effect.config.extra_discard_bonus) {
      G.GAME.modifiers.money_per_discard = this.effect.config.extra_discard_bonus;
    }
  }
  load(backTable) {
    this.name = backTable.name;
    this.pos = backTable.pos;
    this.effect = backTable.effect;
    this.effect.center = G.P_CENTERS[backTable.key] || G.P_CENTERS.b_red;
    this.loc_name = localize({ type: "name_text", set: "Back", key: this.effect.center.key });
  }
}
