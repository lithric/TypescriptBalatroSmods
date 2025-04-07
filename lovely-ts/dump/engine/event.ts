///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

class GameEvent extends LuaObject {
  trigger: EventTriggerTiming;
  blocking?: boolean;
  blockable?: boolean;
  complete: boolean;
  start_timer: boolean;
  func: (x?: unknown) => number | boolean;
  delay: number;
  no_delete?: boolean;
  created_on_pause?: boolean;
  timer: TimerName;
  ease?: {
    type: EventTimingEase;
    start_val: number;
    end_val: number;
    start_time?: number;
    end_time?: number;
  } & EventReferenceTables;
  condition?: EventReferenceTables;
  time: number;
  constructor(
    config: GameEvent &
      EventReferenceTables & {
        ease: EventTimingEase;
        ease_to: number;
        type?: unknown;
        pause_force?: boolean;
        start_timer?: unknown;
      }
  ) {
    super();
    this.trigger = config.trigger || "immediate";
    if (config.blocking !== undefined) {
      this.blocking = config.blocking;
    } else {
      this.blocking = true;
    }
    if (config.blockable !== undefined) {
      this.blockable = config.blockable;
    } else {
      this.blockable = true;
    }
    this.complete = false;
    this.start_timer = config.start_timer || false;
    this.func =
      config.func ||
      function () {
        return true;
      };
    this.delay = config.delay || 0;
    this.no_delete = config.no_delete;
    this.created_on_pause = config.pause_force || G.SETTINGS.paused;
    this.timer = config.timer || (this.created_on_pause && "REAL") || "TOTAL";
    if (this.trigger === "ease") {
      this.ease = {
        type: config.ease || "lerp",
        ref_table: config.ref_table,
        ref_value: config.ref_value,
        start_val: config.ref_table?.[config.ref_value ?? ""],
        end_val: config.ease_to,
        start_time: undefined,
        end_time: undefined,
      };
      this.func =
        config.func ||
        function (t: unknown) {
          return t;
        };
    }
    if (this.trigger === "condition") {
      this.condition = {
        ref_table: config.ref_table ?? {},
        ref_value: config.ref_value ?? "",
        stop_val: config.stop_val,
      };
      this.func =
        config.func ||
        (() => {
          return (
            this.condition?.ref_table?.[this.condition.ref_value ?? ""] === this.condition?.stop_val
          );
        });
    }
    this.time = G.TIMERS[this.timer];
  }
  handle(_results: EventResult) {
    [_results.blocking, _results.completed] = [this.blocking, this.complete];
    if (this.created_on_pause === false && G.SETTINGS.paused) {
      _results.pause_skip = true;
      return;
    }
    if (!this.start_timer) {
      this.time = G.TIMERS[this.timer];
      this.start_timer = true;
    }
    if (this.trigger === "after") {
      if (this.time + this.delay <= G.TIMERS[this.timer]) {
        _results.time_done = true;
        _results.completed = this.func();
      }
    }
    if (this.trigger === "ease") {
      if (this.ease && !this.ease?.start_time) {
        this.ease.start_time = G.TIMERS[this.timer];
        this.ease.end_time = G.TIMERS[this.timer] + this.delay;
        this.ease.start_val = this.ease.ref_table[this.ease.ref_value];
      }
      if (!this.complete) {
        if (
          this.ease?.end_time &&
          this.ease?.start_time &&
          this.ease.end_time >= G.TIMERS[this.timer]
        ) {
          let percent_done =
            (this.ease.end_time - G.TIMERS[this.timer]) /
            (this.ease.end_time - this.ease?.start_time);
          if (this.ease.type === "lerp") {
            this.ease.ref_table[this.ease.ref_value] = this.func(
              percent_done * this.ease.start_val + (1 - percent_done) * this.ease.end_val
            ) as number;
          }
          if (this.ease && this.ease.type === "elastic") {
            percent_done =
              -math.pow(2, 10 * percent_done - 10) *
              math.sin(((percent_done * 10 - 10.75) * 2 * math.pi) / 3);
            this.ease.ref_table[this.ease.ref_value] = this.func(
              percent_done * this.ease.start_val + (1 - percent_done) * this.ease.end_val
            ) as number;
          }
          if (this.ease && this.ease.type === "quad") {
            percent_done = percent_done * percent_done;
            this.ease.ref_table[this.ease.ref_value] = this.func(
              percent_done * this.ease.start_val + (1 - percent_done) * this.ease.end_val
            ) as number;
          }
        } else if (this.ease) {
          this.ease.ref_table[this.ease.ref_value] = this.func(this.ease.end_val) as number;
          this.complete = true;
          _results.completed = true;
          _results.time_done = true;
        }
      }
    }
    if (this.trigger === "condition") {
      if (!this.complete) {
        _results.completed = this.func();
      }
      _results.time_done = true;
    }
    if (this.trigger === "before") {
      if (!this.complete) {
        _results.completed = this.func();
      }
      if (this.time + this.delay <= G.TIMERS[this.timer]) {
        _results.time_done = true;
      }
    }
    if (this.trigger === "immediate") {
      _results.completed = this.func();
      _results.time_done = true;
    }
    if (_results.completed) {
      this.complete = true;
    }
  }
}

type QueueTypeName = "unlock" | "base" | "tutorial" | "achievement" | "other";

class EventManager extends LuaObject {
  queues: {
    unlock: GameEvent[];
    base: GameEvent[];
    tutorial: GameEvent[];
    achievement: GameEvent[];
    other: GameEvent[];
  };
  queue_timer: number;
  queue_dt: number;
  queue_last_processed: number;
  constructor() {
    super();
    this.queues = { unlock: [], base: [], tutorial: [], achievement: [], other: [] };
    this.queue_timer = G.TIMERS.REAL;
    this.queue_dt = 1 / 60;
    this.queue_last_processed = G.TIMERS.REAL;
  }
  add_event(event: GameEvent, queue?: QueueTypeName, front?: boolean) {
    queue = queue || "base";
    if (event.is(GameEvent)) {
      if (front) {
        table.insert(this.queues[queue], 1, event);
      } else {
        table.insert(this.queues[queue], event);
      }
    }
  }
  clear_queue(queue?: QueueTypeName, exception?: string) {
    if (!queue) {
      for (const [, v] of pairs(this.queues)) {
        let i = 1;
        while (i <= v.length) {
          if (!v[i].no_delete) {
            delete v[i];
          } else {
            i = i + 1;
          }
        }
      }
    } else if (exception) {
      for (const [k, v] of pairs(this.queues)) {
        if (k !== exception) {
          let i = 1;
          while (i <= v.length) {
            if (!v[i].no_delete) {
              delete v[i];
            } else {
              i = i + 1;
            }
          }
        }
      }
    } else {
      let i = 1;
      while (i <= this.queues[queue].length) {
        if (!this.queues[queue][i].no_delete) {
          delete this.queues[queue][i];
        } else {
          i = i + 1;
        }
      }
    }
  }
  update(dt: number, forced: boolean) {
    this.queue_timer = this.queue_timer + dt;
    if (this.queue_timer >= this.queue_last_processed + this.queue_dt || forced) {
      this.queue_last_processed = this.queue_last_processed + (forced ? 0 : this.queue_dt);
      for (const [, v] of pairs(this.queues)) {
        let blocked = false;
        let i = 1;
        while (i <= v.length) {
          G.ARGS.event_manager_update = G.ARGS.event_manager_update || {};
          const results = G.ARGS.event_manager_update;
          [results.blocking, results.completed, results.time_done, results.pause_skip] = [
            false,
            false,
            false,
            false,
          ];
          if (!blocked || !v[i].blockable) {
            v[i].handle(results);
          }
          if (results.pause_skip) {
            i = i + 1;
          } else {
            if (!blocked && results.blocking) {
              blocked = true;
            }
            if (results.completed && results.time_done) {
              delete v[i];
            } else {
              i = i + 1;
            }
          }
        }
      }
    }
  }
}
