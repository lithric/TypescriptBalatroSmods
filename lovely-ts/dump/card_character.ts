///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class Card_Character extends Moveable {
  constructor(args) {
    super(args.x || 1, args.y || 1, args.w || G.CARD_W * 1.1, args.h || G.CARD_H * 1.1);
    this.states.collide.can = false;
    this.children = [];
    this.config = { args: args };
    this.children.card = new Card(
      this.T.x,
      this.T.y,
      G.CARD_W,
      G.CARD_H,
      G.P_CARDS.empty,
      args.center || G.P_CENTERS.j_joker,
      { bypass_discovery_center: true }
    );
    this.children.card.states.visible = false;
    this.children.card.start_materialize([G.C.BLUE, G.C.WHITE, G.C.RED]);
    this.children.card.set_alignment({ major: this, type: "cm", offset: { x: 0, y: 0 } });
    this.children.card.jimbo = this;
    this.children.card.states.collide.can = true;
    this.children.card.states.focus.can = false;
    this.children.card.states.hover.can = true;
    this.children.card.states.drag.can = false;
    this.children.card.hover = Node.hover;
    this.children.particles = new Particles(0, 0, 0, 0, {
      timer: 0.03,
      scale: 0.3,
      speed: 1.2,
      lifespan: 2,
      attach: this,
      colours: [G.C.RED, G.C.BLUE, G.C.ORANGE],
      fill: true,
    });
    this.children.particles.static_rotation = true;
    this.children.particles.set_role({
      role_type: "Minor",
      xy_bond: "Weak",
      r_bond: "Strong",
      major: this,
    });
    if (this instanceof Card_Character) {
      table.insert(G.I.CARD, this);
    }
  }
  move(dt) {
    Moveable.move(this, dt);
  }
  hard_set_VT() {
    this.align_to_major();
    Moveable.hard_set_VT(this);
    this.align();
    this.children.card.hard_set_VT();
  }
  align() {
    if (this.children.card) {
      this.children.card.T.x = this.T.x + (this.T.w - this.children.card.T.w) / 2;
      this.children.card.T.y = this.T.y + (this.T.h - this.children.card.T.h) / 2;
    }
  }
  add_button(button, func, colour, update_func, snap_to, yoff) {
    if (this.children.button) {
      this.children.button.remove();
    }
    this.config.button_align = {
      align: "bm",
      offset: { x: 0, y: yoff || 0.3 },
      major: this,
      parent: this,
    };
    this.children.button = new UIBox({
      definition: create_UIBox_character_button({
        button: button,
        func: func,
        colour: colour,
        update_func: update_func,
        maxw: 3,
      }),
      config: this.config.button_align,
    });
    if (snap_to) {
      G.CONTROLLER.snap_to({ node: this.children.button });
    }
  }
  add_speech_bubble(text_key, align, loc_vars) {
    if (this.children.speech_bubble) {
      this.children.speech_bubble.remove();
    }
    this.config.speech_bubble_align = {
      align: align || "bm",
      offset: { x: 0, y: 0 },
      parent: this,
    };
    this.children.speech_bubble = new UIBox({
      definition: G.UIDEF.speech_bubble(text_key, loc_vars),
      config: this.config.speech_bubble_align,
    });
    this.children.speech_bubble.set_role({
      role_type: "Minor",
      xy_bond: "Weak",
      r_bond: "Strong",
      major: this,
    });
    this.children.speech_bubble.states.visible = false;
  }
  remove_button() {
    if (this.children.button) {
      this.children.button.remove();
      this.children.button = undefined;
    }
  }
  remove_speech_bubble() {
    if (this.children.speech_bubble) {
      this.children.speech_bubble.remove();
      this.children.speech_bubble = undefined;
    }
  }
  say_stuff(n, not_first) {
    this.talking = true;
    if (!not_first) {
      G.E_MANAGER.add_event(
        new GameEvent({
          trigger: "after",
          delay: 0.1,
          func: function () {
            if (this.children.speech_bubble) {
              this.children.speech_bubble.states.visible = true;
            }
            this.say_stuff(n, true);
            return true;
          },
        })
      );
    } else {
      if (n <= 0) {
        this.talking = false;
        return;
      }
      let new_said = math.random(1, 11);
      while (new_said === this.last_said) {
        new_said = math.random(1, 11);
      }
      this.last_said = new_said;
      play_sound("voice" + math.random(1, 11), G.SPEEDFACTOR * (math.random() * 0.2 + 1), 0.5);
      this.children.card.juice_up();
      G.E_MANAGER.add_event(
        new GameEvent({
          trigger: "after",
          blockable: false,
          blocking: false,
          delay: 0.13,
          func: function () {
            this.say_stuff(n - 1, true);
            return true;
          },
        }),
        "tutorial"
      );
    }
  }
  draw(dt) {
    if (this.highlight) {
      this.children.highlight.draw();
      this.highlight.draw();
      if (this.highlight.draw_children) {
        this.highlight.draw_children();
      }
    }
    if (this.children.particles) {
      this.children.particles.draw();
    }
    if (this.children.speech_bubble) {
      this.children.speech_bubble.draw();
    }
    if (this.children.button && !this.talking) {
      this.children.button.draw();
    }
    if (this.children.card) {
      this.children.card.draw();
    }
    add_to_drawhash(this);
    this.draw_boundingrect();
  }
  remove() {
    G.jimboed = undefined;
    remove_all(this.children);
    for (const [k, v] of pairs(G.I.CARD)) {
      if (v === this) {
        table.remove(G.I.CARD, k);
      }
    }
    Moveable.remove(this);
  }
}
