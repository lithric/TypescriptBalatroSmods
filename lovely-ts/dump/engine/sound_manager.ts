require("love.audio");
require("love.sound");
require("love.system");
if (love.system.getOS() === "OS X" && (jit.arch === "arm64" || jit.arch === "arm")) {
    jit.off();
}
type Source = import("love.audio").Source
var CHANNEL = love.thread.getChannel("sound_request");
var LOAD_CHANNEL = love.thread.getChannel("load_channel");
LOAD_CHANNEL.push("audio thread start");
var DISABLE_SFX = false;
var SMODS_Sounds = [];
var SOURCES: {[x:string]:SoundHandler[]} = {};
let sound_files = love.filesystem.getDirectoryItems("resources/sounds");

interface SoundHandler {
    sound: Source;
    filepath?: string;
    sound_code?: string;
    original_pitch?: number;
    original_volume?: number;
    created_on_pause?: boolean;
    created_on_state?: number;
    sfx_handled?: number;
    transition_timer?: number;
    current_volume?: number;
    temp_pitch?: number;
    initialized?: boolean;
}

interface SoundOptions {
    music_control?: { desired_track: string; current_track: string; lerp: number; };
    crt?: number;
    time?: number;
    splash_vol?: number;
    pitch_mod?: number;
    sound_settings?: any;
    dt?: number;
    per?: number;
    vol?: number;
    overlay_menu?: boolean;
    state?: number;
    sound_code?: string;
    type?: string;
    desired_track?: string;
    data?: any;
    ambient_control?: {[x:string]:SoundOptions};
}

for (const [_, filename] of ipairs(sound_files)) {
    let extension = string.sub(filename, -4);
    for (let i = 1; i <= 1; i++) {
        if (extension === ".ogg") {
            LOAD_CHANNEL.push("audio file - " + filename);
            let sound_code = string.sub(filename, 1, -5);
            let s: SoundHandler = { sound: love.audio.newSource("resources/sounds/" + filename, string.find(sound_code, "music") && "stream" || "static"), filepath: "resources/sounds/" + filename };
            SOURCES[sound_code] = [];
            table.insert(SOURCES[sound_code], s);
            s.sound_code = sound_code;
            s.sound.setVolume(0);
            love.audio.play(s.sound);
            s.sound.stop();
        }
    }
}
function PLAY_SOUND(args: SoundOptions): SoundHandler {
    args.per = args.per || 1;
    args.vol = args.vol || 1;
    SOURCES[args.sound_code??""] = SOURCES[args.sound_code??""] || {};
    for (const [_, s] of ipairs(SOURCES[args.sound_code??""])) {
        if (s.sound && !s.sound.isPlaying()) {
            s.original_pitch = args.per;
            s.original_volume = args.vol;
            s.created_on_pause = args.overlay_menu;
            s.created_on_state = args.state;
            s.sfx_handled = 0;
            s.transition_timer = 0;
            SET_SFX(s, args);
            love.audio.play(s.sound);
            return s;
        }
    }
    let should_stream = string.find(args.sound_code??"", "music") || string.find(args.sound_code??"", "ambient");
    let c = SMODS_Sounds[args.sound_code??""];
    let s = c && { sound: love.audio.newSource(love.sound.newDecoder(c.data), c.should_stream && "stream" || "static"), per: c.per, vol: c.vol } || { sound: love.audio.newSource("resources/sounds/" + (args.sound_code + ".ogg"), should_stream && "stream" || "static") };
    table.insert(SOURCES[args.sound_code??""], s);
    s.sound_code = args.sound_code;
    s.original_pitch = args.type !== "sound" && s.per || args.per || 1;
    s.original_volume = args.type !== "sound" && s.vol || args.vol || 1;
    s.created_on_pause = args.overlay_menu && true || false;
    s.created_on_state = args.state;
    s.sfx_handled = 0;
    s.transition_timer = 0;
    SET_SFX(s, args);
    love.audio.play(s.sound);
    return s;
}
function STOP_AUDIO(): void {
    for (const [_, source] of pairs(SOURCES)) {
        for (const [_, s] of pairs(source)) {
            if ((s as SoundHandler).sound.isPlaying()) {
                (s as SoundHandler).sound.stop();
            }
        }
    }
}
function SET_SFX(s: SoundHandler, args): void {
    if (string.find(s.sound_code??"", "music")) {
        if (s.sound_code === args.desired_track) {
            s.current_volume = s.current_volume || 1;
            s.current_volume = 1 * args.dt * 3 + (1 - args.dt * 3) * s.current_volume;
        }
        else {
            s.current_volume = s.current_volume || 0;
            s.current_volume = 0 * args.dt * 3 + (1 - args.dt * 3) * s.current_volume;
        }
        s.sound.setVolume(s.current_volume * (s.original_volume??1) * (args.sound_settings.volume / 100) * (args.sound_settings.music_volume / 100));
        s.sound.setPitch((s.original_pitch??1) * args.pitch_mod);
    }
    else {
        if (s.temp_pitch !== s.original_pitch) {
            s.sound.setPitch(s.original_pitch??1);
            s.temp_pitch = s.original_pitch;
        }
        let sound_vol = (s.original_volume??1) * (args.sound_settings.volume / 100) * (args.sound_settings.game_sounds_volume / 100);
        if (s.created_on_state === 13) {
            sound_vol = sound_vol * args.splash_vol;
        }
        if (sound_vol <= 0) {
            s.sound.stop();
        }
        else {
            s.sound.setVolume(sound_vol);
        }
    }
}
function MODULATE(args: SoundOptions): void {
    if (args.desired_track !== "") {
        let sound = ((SOURCES[_G.current_track || {}] || {})[1] || {}).sound;
        if (!sound || !sound.isPlaying()) {
            RESTART_MUSIC(args);
        }
    }
    for (const [k, v] of pairs(SOURCES)) {
        let i = 1;
        while (i <= v.length) {
            if (!v[i].sound.isPlaying()) {
                v[i].sound.release();
                table.remove(v, i);
            }
            else {
                i = i + 1;
            }
        }
        _G.current_track = args.desired_track;
        for (const [_, s] of pairs(v)) {
            if ((s as SoundHandler).sound && (s as SoundHandler).sound.isPlaying() && (s as SoundHandler).original_volume) {
                SET_SFX(s as SoundHandler, args);
            }
        }
    }
}
function RESTART_MUSIC(args): void {
    for (const [k, v] of pairs(SOURCES)) {
        if (string.find(k as string, "music")) {
            for (const [i, s] of ipairs(v)) {
                s.sound.stop();
            }
            SOURCES[k] = [];
            args.per = 0.7;
            args.vol = 0.6;
            args.sound_code = k;
            let s = PLAY_SOUND(args);
            s.initialized = true;
        }
    }
}
function AMBIENT(args): void {
    for (const [k, v] of pairs(SOURCES)) {
        if (args.ambient_control[k]) {
            let start_ambient = args.ambient_control[k].vol * (args.sound_settings.volume / 100) * (args.sound_settings.game_sounds_volume / 100) > 0;
            for (const [i, s] of ipairs(v)) {
                if (s.sound && s.sound.isPlaying() && s.original_volume) {
                    s.original_volume = args.ambient_control[k].vol;
                    SET_SFX(s, args);
                    start_ambient = false;
                }
            }
            if (start_ambient) {
                args.sound_code = k;
                args.vol = args.ambient_control[k].vol;
                args.per = args.ambient_control[k].per;
                PLAY_SOUND(args);
            }
        }
    }
}
function RESET_STATES(state): void {
    for (const [k, v] of pairs(SOURCES)) {
        for (const [i, s] of ipairs(v)) {
            s.created_on_state = state;
        }
    }
}
LOAD_CHANNEL.push("finished");
while (true) {
    let request: SoundOptions = CHANNEL.demand();
    if (request) {
        if (request.type === "kill") {
            break;
        }
        if (false) { }
        else if (request.type === "sound") {
            PLAY_SOUND(request);
        }
        else if (request.type === "sound_source") {
            SMODS_Sounds[request.sound_code??""] = { sound_code: request.sound_code, data: request.data, sound: _G.sound, per: request.per, vol: request.vol };
            SOURCES[request.sound_code??""] = [];
        }
        else if (request.type === "stop") {
            STOP_AUDIO();
        }
        else if (request.type === "modulate") {
            MODULATE(request);
            if (request.ambient_control) {
                AMBIENT(request);
            }
        }
        else if (request.type === "restart_music") {
            RESTART_MUSIC(request);
        }
        else if (request.type === "reset_states") {
            for (const [k, v] of pairs(SOURCES)) {
                for (const [i, s] of ipairs(v)) {
                    s.created_on_state = request.state;
                }
            }
        }
    }
}