///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

function live_test(): void {}
function do_action(action): void {
  let action = { type: "use_card", target_area: "shop_booster", target_card: 1 };
  do_action(action);
  if (action.type === "use_card") {
    G.FUNCS.use_card({ config: { ref_table: G[action.target_area].cards[action.target_card] } });
  }
}
function graphics_stress(): void {
  let _r = {};
  for (let i = 1; i <= 50; i++) {
    let _c = {};
    for (let j = 1; j <= 50; j++) {
      _c[_c.length + 1] = {
        n: G.UIT.C,
        config: { align: "cm", minw: 0.05, minh: 0.05, colour: G.C.BLUE },
        nodes: [{ n: G.UIT.T, config: { text: "A", scale: 0.15, colour: G.C.WHITE } }],
      };
    }
    _r[_r.length + 1] = {
      n: G.UIT.R,
      config: { align: "cm", minw: 0.05, minh: 0.05, colour: G.C.BLUE, padding: 0.05 },
      nodes: _c,
    };
  }
  let uidef = { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: _r };
  G.STRESS = new UIBox({
    definition: uidef,
    config: { align: "cm", offset: { x: 0, y: 0 }, major: G.ROOM_ATTACH },
  });
}
function aprint(text): void {
  if (_RELEASE_MODE) {
    return;
  }
  attention_text({
    text: text,
    scale: 0.8,
    hold: 5.7,
    cover: G.deck || G.MAIN_MENU_UI,
    cover_colour: G.C.RED,
    align: "cm",
  });
}
function play_video(): void {
  G.video_control = G.video_control || [
    { video: "A3", _s: 0.1, _e: 4.65, track: "music1" },
    { video: "E1", _s: 3.69, _e: 6.55 },
    { video: "C3", _s: 1.9, _e: 4.3, track: "music3" },
    { video: "E5", _s: 5.9, _e: 9.2, track: "music1" },
    { video: "C4a", _s: 1.3, _e: 4.5, track: "music2" },
    { video: "E4", _s: 4, _e: 7.2, track: "music1" },
    { video: "D4", _s: 0.3, _e: 3.2, track: "music4" },
    { video: "C2", _s: 2, _e: 4.4, track: "music1" },
    { video: "B3", _s: 2.7, _e: 5.3 },
    { video: "B4", _s: 21.5, _e: 24.8 },
    { video: "D5", _s: 1.2, _e: 3.8, track: "music1" },
    { video_organ: 0.1, video: "E2", _s: 1.5, _e: 4.1 },
    { video_organ: 0.2, video: "E3", _s: 3.5, _e: 7.5 },
    { video_organ: 0.4, video: "D3", _s: 1.9, _e: 4.3, track: "music1" },
  ];
  G.video_volume = 1;
  G.video_volume_real = 0;
  G.E_MANAGER.add_event(
    new GameEvent({
      blocking: false,
      blockable: false,
      func: function () {
        G.video_volume_real =
          G.video_volume_real * (1 - 4 * G.real_dt) + 4 * G.real_dt * G.video_volume;
        if (G.video) {
          G.video.getSource().setVolume(G.video_volume_real);
        }
      },
    })
  );
  let trailer_time = 0;
  for (const [k, v] of pairs(G.video_control)) {
    if (v.start) {
      let nu_vc = {};
      for (let i = k; i <= G.video_control.length; i++) {
        nu_vc[nu_vc.length + 1] = G.video_control[i];
      }
      G.video_control = nu_vc;
      break;
    }
  }
  for (const [k, v] of pairs(G.video_control)) {
    trailer_time = trailer_time + (v._e - v._s);
    v.video_file = love.graphics.newVideo("resources/videos/" + (v.video + ".ogv"));
    v.video_file.seek(math.max(v._s || 0.3, 0.3) - 0.29);
    G.E_MANAGER.add_event(
      new GameEvent({
        func: function () {
          v.video_file.play();
          return true;
        },
      })
    );
    G.E_MANAGER.add_event(
      new GameEvent({
        trigger: "after",
        delay: 0.29,
        func: function () {
          v.video_file.pause();
          v.video_file.seek(v._s || 0);
          return true;
        },
      })
    );
  }
  delay(1.5);
  for (const [k, v] of pairs(G.video_control)) {
    if (v.text) {
      G.E_MANAGER.add_event(
        new GameEvent({
          trigger: "before",
          delay: 1.4,
          func: function () {
            G.FUNCS.wipe_on(v.text, true, 1.4);
            G.video_volume = 0;
            return true;
          },
        })
      );
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            if (G.video) {
              G.video.pause();
            }
            G.video = v.video_file;
            if (v.track) {
              G.video_soundtrack = v.track;
            }
            if (v.video_organ) {
              G.video_organ = v.video_organ;
            }
            G.video.play();
            G.video_volume = 1;
            return true;
          },
        })
      );
      G.FUNCS.wipe_off();
    } else {
      G.E_MANAGER.add_event(
        new GameEvent({
          func: function () {
            if (G.video) {
              G.video.pause();
            }
            G.video = v.video_file;
            if (v.track) {
              G.video_soundtrack = v.track;
            }
            if (v.video_organ) {
              G.video_organ = v.video_organ;
            }
            G.video.play();
            return true;
          },
        })
      );
    }
    let _delay = v._e - (v._s || 0) - ((v.text && 1.5) || 0);
    delay(_delay - 0.15);
    G.E_MANAGER.add_event(
      new GameEvent({
        func: function () {
          G.screenglitch = true;
          G.screenwipe_amt = 1;
          return true;
        },
      })
    );
    delay(0.15);
    G.E_MANAGER.add_event(
      new GameEvent({
        blocking: false,
        trigger: "after",
        delay: 0.3,
        func: function () {
          G.screenglitch = false;
          return true;
        },
      })
    );
  }
  let flash_col = copy_table(G.C.WHITE);
  G.E_MANAGER.add_event(
    new GameEvent({
      trigger: "before",
      delay: 0.6,
      func: function () {
        G.FUNCS.wipe_on(undefined, true, 2, flash_col);
        return true;
      },
    })
  );
  G.E_MANAGER.add_event(
    new GameEvent({
      func: function () {
        G.E_MANAGER.add_event(
          new GameEvent({
            trigger: "after",
            delay: 0.9,
            blockable: false,
            func: function () {
              G.video.pause();
              G.video = undefined;
              G.video_soundtrack = "music1";
              G.video_organ = 0;
              return true;
            },
          })
        );
        G.E_MANAGER.add_event(
          new GameEvent({
            trigger: "after",
            delay: 0.9,
            blockable: false,
            func: function () {
              G.screenglitch = false;
              G.TIMERS.REAL = 4;
              G.TIMERS.TOTAL = 4;
              flash_col[4] = 0;
              G.main_menu("splash");
              return true;
            },
          })
        );
        return true;
      },
    })
  );
  G.FUNCS.wipe_off();
}
