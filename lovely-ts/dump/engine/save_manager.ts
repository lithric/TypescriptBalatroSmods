///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

require("love.system");
if (love.system.getOS() === "OS X" && (jit.arch === "arm64" || jit.arch === "arm")) {
  jit.off();
}
require("love.timer");
require("love.thread");
require("love.filesystem");
require("engine/object");
require("engine/string_packer");
var CHANNEL = love.thread.getChannel("save_request");
while (true) {
  let request = CHANNEL.demand();
  if (request) {
    if (request.type === "kill") {
      break;
    }
    if (request.type === "save_progress") {
      let prefix_profile = (request.save_progress.SETTINGS.profile || 1) + "";
      if (!love.filesystem.getInfo(prefix_profile)) {
        love.filesystem.createDirectory(prefix_profile);
      }
      prefix_profile = prefix_profile + "/";
      if (!love.filesystem.getInfo(prefix_profile + "meta.jkr")) {
        love.filesystem.append(prefix_profile + "meta.jkr", "return {}");
      }
      let meta = STR_UNPACK(get_compressed(prefix_profile + "meta.jkr") || "return {}");
      meta.unlocked = meta.unlocked || {};
      meta.discovered = meta.discovered || {};
      meta.alerted = meta.alerted || {};
      let _append = false;
      for (const [k, v] of pairs(request.save_progress.UDA)) {
        if (string.find(v, "u") && !meta.unlocked[k]) {
          meta.unlocked[k] = true;
          _append = true;
        }
        if (string.find(v, "d") && !meta.discovered[k]) {
          meta.discovered[k] = true;
          _append = true;
        }
        if (string.find(v, "a") && !meta.alerted[k]) {
          meta.alerted[k] = true;
          _append = true;
        }
      }
      if (_append) {
        compress_and_save(prefix_profile + "meta.jkr", STR_PACK(meta));
      }
      compress_and_save("settings.jkr", request.save_progress.SETTINGS);
      compress_and_save(prefix_profile + "profile.jkr", request.save_progress.PROFILE);
      CHANNEL.push("done");
    } else if (request.type === "save_settings") {
      compress_and_save("settings.jkr", request.save_settings);
      compress_and_save(request.profile_num + "/profile.jkr", request.save_profile);
    } else if (request.type === "save_metrics") {
      compress_and_save("metrics.jkr", request.save_metrics);
    } else if (request.type === "save_notify") {
      let prefix_profile = (request.profile_num || 1) + "";
      if (!love.filesystem.getInfo(prefix_profile)) {
        love.filesystem.createDirectory(prefix_profile);
      }
      prefix_profile = prefix_profile + "/";
      if (!love.filesystem.getInfo(prefix_profile + "unlock_notify.jkr")) {
        love.filesystem.append(prefix_profile + "unlock_notify.jkr", "");
      }
      let unlock_notify = get_compressed(prefix_profile + "unlock_notify.jkr") || "";
      if (request.save_notify && !string.find(unlock_notify, request.save_notify)) {
        compress_and_save(
          prefix_profile + "unlock_notify.jkr",
          unlock_notify + (request.save_notify + "\\n")
        );
      }
    } else if (request.type === "save_run") {
      let prefix_profile = (request.profile_num || 1) + "";
      if (!love.filesystem.getInfo(prefix_profile)) {
        love.filesystem.createDirectory(prefix_profile);
      }
      prefix_profile = prefix_profile + "/";
      compress_and_save(prefix_profile + "save.jkr", request.save_table);
    }
  }
}
