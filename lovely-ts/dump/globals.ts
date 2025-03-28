///<reference path="./engine/string_packer.lua"/>
///<reference path="./engine/object.ts"/>
///<reference path="./engine/node.ts"/>
///<reference path="./functions/misc_functions.lua"/>
let VERSION = "1.0.1o" + "-FULL";

type Font = import("love.graphics").Font
type Thread = import("love.thread").Thread
type Channel = import("love.thread").Channel
type RenderTargetSetup = import("love.graphics").RenderTargetSetup

interface ScreenResolution {
    w:number;
    h:number;
}

interface MonitorDimensions {
    width:number;
    height:number;
}

interface DisplaySettings {
    name:string; 
    screen_res: ScreenResolution; 
    screen_resolutions: {strings:string[];values:ScreenResolution[]};
    DPI_scale: number;
    MONITOR_DIMS: MonitorDimensions;
}

interface WindowSettings { 
    screenmode: string;
    vsync: number;
    selected_display: number;
    display_names: string[];
    DISPLAYS: DisplaySettings[];
}

interface SoundSettings { 
    volume: number;
    music_volume: number;
    game_sounds_volume: number;
}

interface GraphicsSettings { 
    texture_scaling: number;
    shadows: string;
    crt: number;
    bloom: number;
}

interface DemoSettings {
    total_uptime: number;
    timed_CTA_shown: boolean;
    win_CTA_shown: boolean;
    quit_CTA_shown: boolean;
}

interface Settings {
    ambient_control?: any;
    colour_palettes?: any;
    QUEUED_CHANGE?: {};
    music_control?: { desired_track: string; current_track: string; lerp: number; };
    real_language?: string;
    skip_splash?: string;
    tutorial_complete?: any;
    reduced_motion?: number;
    perf_mode?: GameCheck; 
    COMP: { name: string; prev_name: string; submission_name?: string; score: number }; 
    DEMO: DemoSettings; 
    ACHIEVEMENTS_EARNED: {}; 
    crashreports: boolean; 
    colourblind_option: boolean; 
    language: string; 
    screenshake: true; 
    run_stake_stickers: boolean; 
    rumble?: number; 
    play_button_pos: number; 
    GAMESPEED: number; 
    paused?: boolean; 
    SOUND: SoundSettings; 
    WINDOW: WindowSettings;
    CUSTOM_DECK: { Collabs: { Spades: string; Hearts: string; Clubs: string; Diamonds: string } };
    GRAPHICS: GraphicsSettings;
    profile?: number;
    tutorial_progress?: {
        forced_voucher?: { completed_parts: {}; };
        forced_tags?: { completed_parts: {}; };
        completed_parts: {}
    },
    version?: string;
}

interface GameCheckData {
    checkpoint_list: [];
    checkpoints: number;
    last_time: number;
}

interface GameCheck {
    draw: GameCheckData;
    update: GameCheckData;
}

interface GameLoadingData {
    font: Font;
    [1]: undefined;
}

interface ThreadManager {
    thread: Thread;
    channel?: Channel;
    load_channel?: Channel;
    in_channel?: Channel;
    out_channel?: Channel;
}

interface GameInstancesData {
    NODE: LuaNode[];
    MOVEABLE: Moveable[];
    SPRITE: Sprite[];
    UIBOX: UIBox[];
    POPUP: UIBox[];
    CARD: Card[];
    CARDAREA: CardArea[];
    ALERT: UIBox[];
}

interface ChallengeData {
    name: string; 
    id: string; 
    rules: { custom: { id: string; value?: number|string; }[]; modifiers: { id?: string; value?: number; }[]; };
    jokers: ({ id: string; edition?: string; eternal?: boolean; pinned?: boolean })[];
    consumeables: { id: string; }[];
    vouchers: { id: string; }[];
    deck: { cards?: { s: string; r: string; e?:string; g?:string }[]; type: string; };
    restrictions: { banned_cards: { id: string; ids?: string[]; }[]; banned_tags: { id:string; }[]; banned_other: { id: string; type: string; }[]; };
}

interface CenterAbilityConfig {
    mult?: number;
    s_mult?: number;
    t_mult?: number;
    extra?: CenterAbilityConfig|number|string;
    bonus?: number;
    choose?: number;
    discards?: number;
    voucher?: string;
    vouchers?: string[];
    suit?: string;
    type?: string;
    t_chips?: number;
    odds?: number;
    chips?: number;
    Xmult?: number;
    chip_mod?: number;
    dollars?: number;
    h_mod?: number;
    h_size?: number;
    d_remaining?: number;
    every?: number;
    max?: number;
    min?: number;
    remaining?: string;
    faces?: number;
    hand_add?: number;
    discard_sub?: number;
    poker_hand?: string;
    hand_type?: string;
    increase?: number;
    d_size?: number;
    h_plays?: number;
    xmult?: number;
    mod_conv?: string;
    p_dollars?: number;
    h_dollars?: number;
    h_x_mult?: number;
    randomize_rank_suit?: boolean;
    ante_scaling?: number;
    hand_size?: number;
    joker_slot?: number;
    remove_faces?: boolean;
    consumable_slot?: number;
    consumeable?: string;
    consumables?: string[];
    spectral_rate?: number;
    hands?: number;
    extra_hand_bonus?: number;
    size?: number;
    max_highlighted?: number;
    min_highlighted?: number;
    remove_card?: boolean;
    suit_conv?: string;
    destroy?: number;
    softlock?: boolean;
    tarots?: number;
    planets?: number;
    extra_disp?: number;
    extra_discard_bonus?: number;
    no_interest?: boolean;
    dollars_per_hand?: number;
    dollars_per_discard?: number;
    edition?: string;
    spawn_jokers?: number;
    levels?: number;
    skip_bonus?: number;
}

interface UnlockConditionConfig {
    type: string;
    extra?: string | number | {};
    hidden?: boolean;
    chips?: number;
    tarot_count?: number;
    n_rounds?: number;
    ante?: number;
    planet_count?: number;
    stake?: number;
    deck?: string;
    amount?: number;
}

interface GameContentSettings {
    wip?: boolean;
    alerted?: boolean;
    discovered?: boolean;
    unlocked?: boolean;
    demo?: boolean;
    set?: string;
    start_alerted?: boolean;
    key?: string;
    skip_pool?: boolean;
    omit?: boolean;
}

interface CenterContentSettings extends GameContentSettings {
    consumeable?: boolean;
    rarity?: number;
}

interface BaseCardCenter extends CenterContentSettings {
    max: 500;
    freq: 1;
    line: "base";
    name: "Default Base";
    pos: { x: 1; y: 0 };
    set: "Default";
    label: "Base Card";
    effect: "Base";
    cost_mult: 1;
    config: CenterAbilityConfig;
}

interface JokerCardCenter extends CenterContentSettings {
    order: number;
    start_alerted?: boolean;
    blueprint_compat: boolean;
    perishable_compat: boolean;
    eternal_compat: boolean;
    rarity: number;
    cost: number;
    name: string;
    pos: { x: number; y: number };
    set: "Joker";
    effect?: string;
    cost_mult?: number;
    config: CenterAbilityConfig;
    unlock_condition?: UnlockConditionConfig;
    enhancement_gate?: string;
    no_pool_flag?: string;
    yes_pool_flag?: string;
    soul_pos?: {x: number; y:number};
}

interface ConsumeableCardCenter extends CenterContentSettings {
    order: number;
    cost: number;
    consumeable: true;
    name: string;
    pos: { x: number; y: number };
    set: "Tarot"|"Spectral"|"Planet";
    effect?: string;
    cost_mult?: number;
    config: CenterAbilityConfig;
}

interface TarotCardCenter extends ConsumeableCardCenter {
    set: "Tarot";
}

interface SpectralCardCenter extends ConsumeableCardCenter {
    set: "Spectral";
    hidden?: boolean;
}

interface PlanetCardCenter extends ConsumeableCardCenter {
    set: "Planet";
    freq?: number;
}

interface VoucherCardCenter extends CenterContentSettings {
    order: number;
    available: boolean;
    cost: number;
    name: string;
    pos: { x: number; y: number};
    set: "Voucher";
    config: CenterAbilityConfig;
    requires?: string[];
    unlock_condition?: UnlockConditionConfig;
}

interface EnhancedCardCenter extends CenterContentSettings {
    max: number;
    order: number;
    name: string;
    set: "Enhanced";
    pos: { x: number; y: number };
    effect: string;
    label: string;
    config: CenterAbilityConfig;
}

interface EditionCardCenter extends CenterContentSettings {
    order: number;
    name: string;
    pos: { x: number; y: number };
    atlas: string;
    set: "Edition";
    config: CenterAbilityConfig;
}

interface BoosterPackCenter extends CenterContentSettings {
    order: number;
    name: string;
    weight: number;
    kind: string;
    cost: number;
    pos: { x: number; y: number };
    atlas: string;
    set: "Booster";
    config: CenterAbilityConfig;
}

interface DeckCenter extends CenterContentSettings {
    name: string;
    stake: number;
    order: number;
    pos: { x: number; y: number };
    set: "Back";
    config: CenterAbilityConfig;
    unlock_condition?: UnlockConditionConfig;
}

interface GameBlindDefinition extends GameContentSettings {
    name: string;
    defeated: boolean;
    order: number;
    dollars: number;
    mult: number;
    vars: {};
    debuff_text?: string;
    debuff: {};
    boss?: {min:number; max:number; showdown?: boolean};
    boss_colour?: number[];
    pos: { x: number; y: number };
}

interface GameTagDefinition extends GameContentSettings {
    name: string;
    set: "Tag";
    min_ante?: number;
    order: number;
    config: CenterAbilityConfig;
    requires?: string;
    pos: { x: number; y: number };
}

interface GameStakeDefinition extends GameContentSettings {
    name: string;
    set: "Stake";
    order: number;
    pos: { x: number; y: number };
    stake_level: number;
}

interface GameSealDefinition extends GameContentSettings {
    order: number;
}

interface HiddenItemDefinition extends CenterContentSettings {
    pos: { x: number; y: number };
    name?: string;
    config?: CenterAbilityConfig;
    order?: number;
    debuff_text?: string;
    max?: number;
    cost_mult?: number;
}

interface ExtraItemDefinition extends CenterContentSettings {
    pos: {x:number; y:number};
}

type ItemCenterDefinition = (BaseCardCenter|JokerCardCenter|TarotCardCenter|SpectralCardCenter|PlanetCardCenter|VoucherCardCenter|EnhancedCardCenter|EditionCardCenter|BoosterPackCenter|DeckCenter|HiddenItemDefinition|ExtraItemDefinition)

class Game extends LuaObject {
    VERSION:string = VERSION;
    F_QUIT_BUTTON:boolean = true;
    F_SKIP_TUTORIAL:boolean = false;
    F_BASIC_CREDITS:boolean = false;
    F_EXTERNAL_LINKS:boolean = true;
    F_ENABLE_PERF_OVERLAY:boolean = false;
    F_NO_SAVING:boolean = false;
    F_MUTE:boolean = false;
    F_SOUND_THREAD:boolean = true;
    F_VIDEO_SETTINGS:boolean = true;
    F_CTA:boolean = false;
    F_VERBOSE:boolean = true;
    F_HTTP_SCORES:boolean = false;
    F_RUMBLE?:number = undefined;
    F_CRASH_REPORTS:boolean = false;
    F_NO_ERROR_HAND:boolean = false;
    F_SWAP_AB_PIPS:boolean = false;
    F_SWAP_AB_BUTTONS:boolean = false;
    F_SWAP_XY_BUTTONS:boolean = false;
    F_NO_ACHIEVEMENTS:boolean = false;
    F_DISP_USERNAME?:boolean = undefined;
    F_ENGLISH_ONLY?:boolean = undefined;
    F_GUIDE:boolean = false;
    F_JAN_CTA:boolean = false;
    F_HIDE_BG:boolean = false;
    F_TROPHIES:boolean = false;
    F_PS4_PLAYSTATION_GLYPHS:boolean = false;
    F_LOCAL_CLIPBOARD:boolean = false;
    F_SAVE_TIMER = 30;
    F_MOBILE_UI:boolean = false;
    F_HIDE_BETA_LANGS?:boolean = undefined;
    F_DISCORD:boolean = true;
    SEED = Date.now();
    TIMERS = { TOTAL: 0, REAL: 0, REAL_SHADER: 0, UPTIME: 0, BACKGROUND: 0 };
    FRAMES = { DRAW: 0, MOVE: 0 };
    exp_times = { xy: 0, scale: 0, r: 0 };
    SETTINGS: Settings = { 
        COMP: { name: "", prev_name: "", submission_name: undefined, score: 0 },
        DEMO: { total_uptime: 0, timed_CTA_shown: false, win_CTA_shown: false, quit_CTA_shown: false },
        ACHIEVEMENTS_EARNED: {},
        crashreports: false,
        colourblind_option: false,
        language: "en-us",
        screenshake: true,
        run_stake_stickers: false,
        rumble: this.F_RUMBLE,
        play_button_pos: 2,
        GAMESPEED: 1,
        paused: false,
        SOUND: { volume: 50, music_volume: 100, game_sounds_volume: 100 },
        WINDOW: { screenmode: "Borderless", vsync: 1, selected_display: 1, display_names: ["[NONE]"], DISPLAYS: [{ name: "[NONE]", screen_res: { w: 1000, h: 650 }, screen_resolutions: {strings:[],values:[]},DPI_scale: 1,MONITOR_DIMS: {width:NaN,height:NaN}}] },
        CUSTOM_DECK: { Collabs: { Spades: "default", Hearts: "default", Clubs: "default", Diamonds: "default" } },
        GRAPHICS: { texture_scaling: 2, shadows: "On", crt: 70, bloom: 1 },
    };
    COLLABS = { pos: { Jack: { x: 0, y: 0 }, Queen: { x: 1, y: 0 }, King: { x: 2, y: 0 } }, options: { Spades: ["default", "collab_TW", "collab_CYP", "collab_SK", "collab_DS", "collab_AC", "collab_STP"], Hearts: ["default", "collab_AU", "collab_TBoI", "collab_CL", "collab_D2", "collab_CR", "collab_BUG"], Clubs: ["default", "collab_VS", "collab_STS", "collab_PC", "collab_WF", "collab_FO", "collab_DBD"], Diamonds: ["default", "collab_DTD", "collab_SV", "collab_EG", "collab_XR", "collab_C7", "collab_R"] } };
    METRICS = { cards: { used: {}, bought: {}, appeared: {} }, decks: { chosen: {}, win: {}, lose: {} }, bosses: { faced: {}, win: {}, lose: {} } };
    PROFILES = [{}, {}, {}];
    TILESIZE = 20;
    TILESCALE = 3.65;
    TILE_W = 20;
    TILE_H = 11.5;
    DRAW_HASH_BUFF = 2;
    CARD_W = 2.4 * 35 / 41;
    CARD_H = 2.4 * 47 / 41;
    HIGHLIGHT_H = 0.2 * this.CARD_H;
    COLLISION_BUFFER = 0.05;
    PITCH_MOD = 1;
    STATES = { SMODS_BOOSTER_OPENED: 999, SELECTING_HAND: 1, HAND_PLAYED: 2, DRAW_TO_HAND: 3, GAME_OVER: 4, SHOP: 5, PLAY_TAROT: 6, BLIND_SELECT: 7, ROUND_EVAL: 8, TAROT_PACK: 9, PLANET_PACK: 10, MENU: 11, TUTORIAL: 12, SPLASH: 13, SANDBOX: 14, SPECTRAL_PACK: 15, DEMO_CTA: 16, STANDARD_PACK: 17, BUFFOON_PACK: 18, NEW_ROUND: 19 };
    STAGES = { MAIN_MENU: 1, RUN: 2, SANDBOX: 3 };
    STAGE_OBJECTS: LuaNode[][] = [[], [], []];
    STAGE = this.STAGES.MAIN_MENU;
    STATE = this.STATES.SPLASH;
    TAROT_INTERRUPT = undefined;
    STATE_COMPLETE = false;
    ARGS = {};
    FUNCS = {};
    I:GameInstancesData = { NODE: [], MOVEABLE: [], SPRITE: [], UIBOX: [], POPUP: [], CARD: [], CARDAREA: [], ALERT: [] };
    ANIMATION_ATLAS = {};
    ASSET_ATLAS = {
        Planet: {},
        Tarot: {},
        Spectral: {}
    };
    MOVEABLES = {};
    ANIMATIONS = {};
    DRAW_HASH = {};
    MIN_CLICK_DIST = 0.9;
    MIN_HOVER_TIME = 0.1;
    DEBUG = false;
    ANIMATION_FPS = 10;
    VIBRATION = 0;
    CHALLENGE_WINS = 5;
    C = { MULT: HEX("FE5F55"), CHIPS: HEX("009dff"), MONEY: HEX("f3b958"), XMULT: HEX("FE5F55"), FILTER: HEX("ff9a00"), BLUE: HEX("009dff"), RED: HEX("FE5F55"), GREEN: HEX("4BC292"), PALE_GREEN: HEX("56a887"), ORANGE: HEX("fda200"), IMPORTANT: HEX("ff9a00"), GOLD: HEX("eac058"), YELLOW: [1, 1, 0, 1], CLEAR: [0, 0, 0, 0], WHITE: [1, 1, 1, 1], PURPLE: HEX("8867a5"), BLACK: HEX("374244"), L_BLACK: HEX("4f6367"), GREY: HEX("5f7377"), CHANCE: HEX("4BC292"), JOKER_GREY: HEX("bfc7d5"), VOUCHER: HEX("cb724c"), BOOSTER: HEX("646eb7"), EDITION: [1, 1, 1, 1], DARK_EDITION: [0, 0, 0, 1], ETERNAL: HEX("c75985"), PERISHABLE: HEX("4f5da1"), RENTAL: HEX("b18f43"), DYN_UI: { MAIN: HEX("374244"), DARK: HEX("374244"), BOSS_MAIN: HEX("374244"), BOSS_DARK: HEX("374244"), BOSS_PALE: HEX("374244") }, SO_1: { Hearts: HEX("f03464"), Diamonds: HEX("f06b3f"), Spades: HEX("403995"), Clubs: HEX("235955") }, SO_2: { Hearts: HEX("f83b2f"), Diamonds: HEX("e29000"), Spades: HEX("4f31b9"), Clubs: HEX("008ee6") }, SUITS: { Hearts: HEX("FE5F55"), Diamonds: HEX("FE5F55"), Spades: HEX("374649"), Clubs: HEX("424e54") }, UI: { TEXT_LIGHT: [1, 1, 1, 1], TEXT_DARK: HEX("4F6367"), TEXT_INACTIVE: HEX("88888899"), BACKGROUND_LIGHT: HEX("B8D8D8"), BACKGROUND_WHITE: [1, 1, 1, 1], BACKGROUND_DARK: HEX("7A9E9F"), BACKGROUND_INACTIVE: HEX("666666FF"), OUTLINE_LIGHT: HEX("D8D8D8"), OUTLINE_LIGHT_TRANS: HEX("D8D8D866"), OUTLINE_DARK: HEX("7A9E9F"), TRANSPARENT_LIGHT: HEX("eeeeee22"), TRANSPARENT_DARK: HEX("22222222"), HOVER: HEX("00000055") }, SET: { Default: HEX("cdd9dc"), Enhanced: HEX("cdd9dc"), Joker: HEX("424e54"), Tarot: HEX("424e54"), Planet: HEX("424e54"), Spectral: HEX("424e54"), Voucher: HEX("424e54") }, SECONDARY_SET: { Default: HEX("9bb6bdFF"), Enhanced: HEX("8389DDFF"), Joker: HEX("708b91"), Tarot: HEX("a782d1"), Planet: HEX("13afce"), Spectral: HEX("4584fa"), Voucher: HEX("fd682b"), Edition: HEX("4ca893") }, RARITY: [HEX("009dff"), HEX("4BC292"), HEX("fe5f55"), HEX("b26cbb")], BLIND: { Small: HEX("50846e"), Big: HEX("50846e"), Boss: HEX("b44430"), won: HEX("4f6367") }, HAND_LEVELS: [HEX("efefef"), HEX("95acff"), HEX("65efaf"), HEX("fae37e"), HEX("ffc052"), HEX("f87d75"), HEX("caa0ef")], BACKGROUND: { L: [1, 1, 0, 1], D: HEX("374244"), C: HEX("374244"), contrast: 1 }, UI_CHIPS:[] as number[], UI_MULT:[] as number[] };
    UIT = { T: 1, B: 2, C: 3, R: 4, O: 5, ROOT: 7, S: 8, I: 9, padding: 0 };
    handlist = ["Flush Five", "Flush House", "Five of a Kind", "Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight", "Three of a Kind", "Two Pair", "Pair", "High Card"];
    button_mapping = { a: G.F_SWAP_AB_BUTTONS && "b" || undefined, b: G.F_SWAP_AB_BUTTONS && "a" || undefined, y: G.F_SWAP_XY_BUTTONS && "x" || undefined, x: G.F_SWAP_XY_BUTTONS && "y" || undefined };
    keybind_mapping = [{ a: "dpleft", d: "dpright", w: "dpup", s: "dpdown", x: "x", c: "y", space: "a", shift: "b", esc: "start", q: "triggerleft", e: "triggerright" }];
    PREV_GARB?:number = undefined;
    check?: GameCheck = undefined;
    LOADING?: GameLoadingData = undefined;
    SOUND_MANAGER?: ThreadManager = undefined;
    SAVE_MANAGER?: ThreadManager = undefined;
    HTTP_MANAGER?: ThreadManager = undefined;
    SHADERS: {};
    CONTROLLER: any;
    shared_debuff: any;
    shared_soul: any;
    P_CENTERS: {
            c_base: BaseCardCenter,
            j_joker: JokerCardCenter,
            j_greedy_joker: JokerCardCenter,
            j_lusty_joker: JokerCardCenter,
            j_wrathful_joker: JokerCardCenter,
            j_gluttenous_joker: JokerCardCenter,
            j_jolly: JokerCardCenter,
            j_zany: JokerCardCenter,
            j_mad: JokerCardCenter,
            j_crazy: JokerCardCenter,
            j_droll: JokerCardCenter,
            j_sly: JokerCardCenter,
            j_wily: JokerCardCenter,
            j_clever: JokerCardCenter,
            j_devious: JokerCardCenter,
            j_crafty: JokerCardCenter,
            j_half: JokerCardCenter,
            j_stencil: JokerCardCenter,
            j_four_fingers: JokerCardCenter,
            j_mime: JokerCardCenter,
            j_credit_card: JokerCardCenter,
            j_ceremonial: JokerCardCenter,
            j_banner: JokerCardCenter,
            j_mystic_summit: JokerCardCenter,
            j_marble: JokerCardCenter,
            j_loyalty_card: JokerCardCenter,
            j_8_ball: JokerCardCenter,
            j_misprint: JokerCardCenter,
            j_dusk: JokerCardCenter,
            j_raised_fist: JokerCardCenter,
            j_chaos: JokerCardCenter,
            j_fibonacci: JokerCardCenter,
            j_steel_joker: JokerCardCenter,
            j_scary_face: JokerCardCenter,
            j_abstract: JokerCardCenter,
            j_delayed_grat: JokerCardCenter,
            j_hack: JokerCardCenter,
            j_pareidolia: JokerCardCenter,
            j_gros_michel: JokerCardCenter,
            j_even_steven: JokerCardCenter,
            j_odd_todd: JokerCardCenter,
            j_scholar: JokerCardCenter,
            j_business: JokerCardCenter,
            j_supernova: JokerCardCenter,
            j_ride_the_bus: JokerCardCenter,
            j_space: JokerCardCenter,
            j_egg: JokerCardCenter,
            j_burglar: JokerCardCenter,
            j_blackboard: JokerCardCenter,
            j_runner: JokerCardCenter,
            j_ice_cream: JokerCardCenter,
            j_dna: JokerCardCenter,
            j_splash: JokerCardCenter,
            j_blue_joker: JokerCardCenter,
            j_sixth_sense: JokerCardCenter,
            j_constellation: JokerCardCenter,
            j_hiker: JokerCardCenter,
            j_faceless: JokerCardCenter,
            j_green_joker: JokerCardCenter,
            j_superposition: JokerCardCenter,
            j_todo_list: JokerCardCenter,
            j_cavendish: JokerCardCenter,
            j_card_sharp: JokerCardCenter,
            j_red_card: JokerCardCenter,
            j_madness: JokerCardCenter,
            j_square: JokerCardCenter,
            j_seance: JokerCardCenter,
            j_riff_raff: JokerCardCenter,
            j_vampire: JokerCardCenter,
            j_shortcut: JokerCardCenter,
            j_hologram: JokerCardCenter,
            j_vagabond: JokerCardCenter,
            j_baron: JokerCardCenter,
            j_cloud_9: JokerCardCenter,
            j_rocket: JokerCardCenter,
            j_obelisk: JokerCardCenter,
            j_midas_mask: JokerCardCenter,
            j_luchador: JokerCardCenter,
            j_photograph: JokerCardCenter,
            j_gift: JokerCardCenter,
            j_turtle_bean: JokerCardCenter,
            j_erosion: JokerCardCenter,
            j_reserved_parking: JokerCardCenter,
            j_mail: JokerCardCenter,
            j_to_the_moon: JokerCardCenter,
            j_hallucination: JokerCardCenter,
            j_fortune_teller: JokerCardCenter,
            j_juggler: JokerCardCenter,
            j_drunkard: JokerCardCenter,
            j_stone: JokerCardCenter,
            j_golden: JokerCardCenter,
            j_lucky_cat: JokerCardCenter,
            j_baseball: JokerCardCenter,
            j_bull: JokerCardCenter,
            j_diet_cola: JokerCardCenter,
            j_trading: JokerCardCenter,
            j_flash: JokerCardCenter,
            j_popcorn: JokerCardCenter,
            j_trousers: JokerCardCenter,
            j_ancient: JokerCardCenter,
            j_ramen: JokerCardCenter,
            j_walkie_talkie: JokerCardCenter,
            j_selzer: JokerCardCenter,
            j_castle: JokerCardCenter,
            j_smiley: JokerCardCenter,
            j_campfire: JokerCardCenter,
            j_ticket: JokerCardCenter,
            j_mr_bones: JokerCardCenter,
            j_acrobat: JokerCardCenter,
            j_sock_and_buskin: JokerCardCenter,
            j_swashbuckler: JokerCardCenter,
            j_troubadour: JokerCardCenter,
            j_certificate: JokerCardCenter,
            j_smeared: JokerCardCenter,
            j_throwback: JokerCardCenter,
            j_hanging_chad: JokerCardCenter,
            j_rough_gem: JokerCardCenter,
            j_bloodstone: JokerCardCenter,
            j_arrowhead: JokerCardCenter,
            j_onyx_agate: JokerCardCenter,
            j_glass: JokerCardCenter,
            j_ring_master: JokerCardCenter,
            j_flower_pot: JokerCardCenter,
            j_blueprint: JokerCardCenter,
            j_wee: JokerCardCenter,
            j_merry_andy: JokerCardCenter,
            j_oops: JokerCardCenter,
            j_idol: JokerCardCenter,
            j_seeing_double: JokerCardCenter,
            j_matador: JokerCardCenter,
            j_hit_the_road: JokerCardCenter,
            j_duo: JokerCardCenter,
            j_trio: JokerCardCenter,
            j_family: JokerCardCenter,
            j_order: JokerCardCenter,
            j_tribe: JokerCardCenter,
            j_stuntman: JokerCardCenter,
            j_invisible: JokerCardCenter,
            j_brainstorm: JokerCardCenter,
            j_satellite: JokerCardCenter,
            j_shoot_the_moon: JokerCardCenter,
            j_drivers_license: JokerCardCenter,
            j_cartomancer: JokerCardCenter,
            j_astronomer: JokerCardCenter,
            j_burnt: JokerCardCenter,
            j_bootstraps: JokerCardCenter,
            j_caino: JokerCardCenter,
            j_triboulet: JokerCardCenter,
            j_yorick: JokerCardCenter,
            j_chicot: JokerCardCenter,
            j_perkeo: JokerCardCenter,
            c_fool: TarotCardCenter,
            c_magician: TarotCardCenter,
            c_high_priestess: TarotCardCenter,
            c_empress: TarotCardCenter,
            c_emperor: TarotCardCenter,
            c_heirophant: TarotCardCenter,
            c_lovers: TarotCardCenter,
            c_chariot: TarotCardCenter,
            c_justice: TarotCardCenter,
            c_hermit: TarotCardCenter,
            c_wheel_of_fortune: TarotCardCenter,
            c_strength: TarotCardCenter,
            c_hanged_man: TarotCardCenter,
            c_death: TarotCardCenter,
            c_temperance: TarotCardCenter,
            c_devil: TarotCardCenter,
            c_tower: TarotCardCenter,
            c_star: TarotCardCenter,
            c_moon: TarotCardCenter,
            c_sun: TarotCardCenter,
            c_judgement: TarotCardCenter,
            c_world: TarotCardCenter,
            c_mercury: PlanetCardCenter,
            c_venus: PlanetCardCenter,
            c_earth: PlanetCardCenter,
            c_mars: PlanetCardCenter,
            c_jupiter: PlanetCardCenter,
            c_saturn: PlanetCardCenter,
            c_uranus: PlanetCardCenter,
            c_neptune: PlanetCardCenter,
            c_pluto: PlanetCardCenter,
            c_planet_x: PlanetCardCenter,
            c_ceres: PlanetCardCenter,
            c_eris: PlanetCardCenter,
            c_familiar: SpectralCardCenter,
            c_grim: SpectralCardCenter,
            c_incantation: SpectralCardCenter,
            c_talisman: SpectralCardCenter,
            c_aura: SpectralCardCenter,
            c_wraith: SpectralCardCenter,
            c_sigil: SpectralCardCenter,
            c_ouija: SpectralCardCenter,
            c_ectoplasm: SpectralCardCenter,
            c_immolate: SpectralCardCenter,
            c_ankh: SpectralCardCenter,
            c_deja_vu: SpectralCardCenter,
            c_hex: SpectralCardCenter,
            c_trance: SpectralCardCenter,
            c_medium: SpectralCardCenter,
            c_cryptid: SpectralCardCenter,
            c_soul: SpectralCardCenter,
            c_black_hole: SpectralCardCenter,
            v_overstock_norm: VoucherCardCenter,
            v_clearance_sale: VoucherCardCenter,
            v_hone: VoucherCardCenter,
            v_reroll_surplus: VoucherCardCenter,
            v_crystal_ball: VoucherCardCenter,
            v_telescope: VoucherCardCenter,
            v_grabber: VoucherCardCenter,
            v_wasteful: VoucherCardCenter,
            v_tarot_merchant: VoucherCardCenter,
            v_planet_merchant: VoucherCardCenter,
            v_seed_money: VoucherCardCenter,
            v_blank: VoucherCardCenter,
            v_magic_trick: VoucherCardCenter,
            v_hieroglyph: VoucherCardCenter,
            v_directors_cut: VoucherCardCenter,
            v_paint_brush: VoucherCardCenter,
            v_overstock_plus: VoucherCardCenter,
            v_liquidation: VoucherCardCenter,
            v_glow_up: VoucherCardCenter,
            v_reroll_glut: VoucherCardCenter,
            v_omen_globe: VoucherCardCenter,
            v_observatory: VoucherCardCenter,
            v_nacho_tong: VoucherCardCenter,
            v_recyclomancy: VoucherCardCenter,
            v_tarot_tycoon: VoucherCardCenter,
            v_planet_tycoon: VoucherCardCenter,
            v_money_tree: VoucherCardCenter,
            v_antimatter: VoucherCardCenter,
            v_illusion: VoucherCardCenter,
            v_petroglyph: VoucherCardCenter,
            v_retcon: VoucherCardCenter,
            v_palette: VoucherCardCenter,
            b_red: DeckCenter,
            b_blue: DeckCenter,
            b_yellow: DeckCenter,
            b_green: DeckCenter,
            b_black: DeckCenter,
            b_magic: DeckCenter,
            b_nebula: DeckCenter,
            b_ghost: DeckCenter,
            b_abandoned: DeckCenter,
            b_checkered: DeckCenter,
            b_zodiac: DeckCenter,
            b_painted: DeckCenter,
            b_anaglyph: DeckCenter,
            b_plasma: DeckCenter,
            b_erratic: DeckCenter,
            b_challenge: DeckCenter,
            m_bonus: EnhancedCardCenter,
            m_mult: EnhancedCardCenter,
            m_wild: EnhancedCardCenter,
            m_glass: EnhancedCardCenter,
            m_steel: EnhancedCardCenter,
            m_stone: EnhancedCardCenter,
            m_gold: EnhancedCardCenter,
            m_lucky: EnhancedCardCenter,
            e_base: EditionCardCenter,
            e_foil: EditionCardCenter,
            e_holo: EditionCardCenter,
            e_polychrome: EditionCardCenter,
            e_negative: EditionCardCenter,
            p_arcana_normal_1: BoosterPackCenter,
            p_arcana_normal_2: BoosterPackCenter,
            p_arcana_normal_3: BoosterPackCenter,
            p_arcana_normal_4: BoosterPackCenter,
            p_arcana_jumbo_1: BoosterPackCenter,
            p_arcana_jumbo_2: BoosterPackCenter,
            p_arcana_mega_1: BoosterPackCenter,
            p_arcana_mega_2: BoosterPackCenter,
            p_celestial_normal_1: BoosterPackCenter,
            p_celestial_normal_2: BoosterPackCenter,
            p_celestial_normal_3: BoosterPackCenter,
            p_celestial_normal_4: BoosterPackCenter,
            p_celestial_jumbo_1: BoosterPackCenter,
            p_celestial_jumbo_2: BoosterPackCenter,
            p_celestial_mega_1: BoosterPackCenter,
            p_celestial_mega_2: BoosterPackCenter,
            p_spectral_normal_1: BoosterPackCenter,
            p_spectral_normal_2: BoosterPackCenter,
            p_spectral_jumbo_1: BoosterPackCenter,
            p_spectral_mega_1: BoosterPackCenter,
            p_standard_normal_1: BoosterPackCenter,
            p_standard_normal_2: BoosterPackCenter,
            p_standard_normal_3: BoosterPackCenter,
            p_standard_normal_4: BoosterPackCenter,
            p_standard_jumbo_1: BoosterPackCenter,
            p_standard_jumbo_2: BoosterPackCenter,
            p_standard_mega_1: BoosterPackCenter,
            p_standard_mega_2: BoosterPackCenter,
            p_buffoon_normal_1: BoosterPackCenter,
            p_buffoon_normal_2: BoosterPackCenter,
            p_buffoon_jumbo_1: BoosterPackCenter,
            p_buffoon_mega_1: BoosterPackCenter,
            soul: ExtraItemDefinition,
            undiscovered_joker: HiddenItemDefinition;
            undiscovered_tarot: HiddenItemDefinition;
    }
    shared_undiscovered_joker: any;
    shared_undiscovered_tarot: any;
    shared_sticker_eternal: any;
    shared_sticker_perishable: any;
    shared_sticker_rental: any;
    shared_stickers: { White: any; Red: any; Green: any; Black: any; Blue: any; Purple: any; Orange: any; Gold: any; };
    shared_seals: { Gold: any; Purple: any; Red: any; Blue: any; };
    sticker_map: string[];
    STAGE_OBJECT_INTERRUPT: boolean;
    CURSOR: any;
    E_MANAGER: any;
    SPEEDFACTOR: number;
    P_SEALS: { 
        Red: GameSealDefinition;
        Blue: GameSealDefinition;
        Gold: GameSealDefinition;
        Purple: GameSealDefinition;
    };
    P_TAGS: { 
        tag_uncommon: GameTagDefinition;
        tag_rare: GameTagDefinition;
        tag_negative: GameTagDefinition;
        tag_foil: GameTagDefinition;
        tag_holo: GameTagDefinition;
        tag_polychrome: GameTagDefinition;
        tag_investment: GameTagDefinition;
        tag_voucher: GameTagDefinition;
        tag_boss: GameTagDefinition;
        tag_standard: GameTagDefinition;
        tag_charm: GameTagDefinition;
        tag_meteor: GameTagDefinition;
        tag_buffoon: GameTagDefinition;
        tag_handy: GameTagDefinition;
        tag_garbage: GameTagDefinition;
        tag_ethereal: GameTagDefinition;
        tag_coupon: GameTagDefinition;
        tag_double: GameTagDefinition;
        tag_juggle: GameTagDefinition;
        tag_d_six: GameTagDefinition;
        tag_top_up: GameTagDefinition;
        tag_skip: GameTagDefinition;
        tag_orbital: GameTagDefinition;
        tag_economy: GameTagDefinition;
    };
    tag_undiscovered: HiddenItemDefinition;
    P_STAKES: { 
        stake_white: GameStakeDefinition;
        stake_red: GameStakeDefinition;
        stake_green: GameStakeDefinition;
        stake_black: GameStakeDefinition;
        stake_blue: GameStakeDefinition;
        stake_purple: GameStakeDefinition;
        stake_orange: GameStakeDefinition;
        stake_gold: GameStakeDefinition;
    };
    P_BLINDS: { 
        bl_small: GameBlindDefinition;
        bl_big: GameBlindDefinition;
        bl_ox: GameBlindDefinition;
        bl_hook: GameBlindDefinition;
        bl_mouth: GameBlindDefinition;
        bl_fish: GameBlindDefinition;
        bl_club: GameBlindDefinition;
        bl_manacle: GameBlindDefinition;
        bl_tooth: GameBlindDefinition;
        bl_wall: GameBlindDefinition;
        bl_house: GameBlindDefinition;
        bl_mark: GameBlindDefinition;
        bl_final_bell: GameBlindDefinition;
        bl_wheel: GameBlindDefinition;
        bl_arm: GameBlindDefinition;
        bl_psychic: GameBlindDefinition;
        bl_goad: GameBlindDefinition;
        bl_water: GameBlindDefinition;
        bl_eye: GameBlindDefinition;
        bl_plant: GameBlindDefinition;
        bl_needle: GameBlindDefinition;
        bl_head: GameBlindDefinition;
        bl_final_leaf: GameBlindDefinition;
        bl_final_vessel: GameBlindDefinition;
        bl_window: GameBlindDefinition;
        bl_serpent: GameBlindDefinition;
        bl_pillar: GameBlindDefinition;
        bl_flint: GameBlindDefinition;
        bl_final_acorn: GameBlindDefinition;
        bl_final_heart: GameBlindDefinition;
    };
    b_undiscovered: HiddenItemDefinition;
    P_CARDS: {
        empty?(arg0: number, arg1: number, arg2: number, arg3: number, empty: any, arg5: any): undefined; 
        H_2: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_3: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_4: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_5: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_6: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_7: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_8: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_9: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_T: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_J: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_Q: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_K: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        H_A: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_2: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_3: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_4: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_5: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_6: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_7: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_8: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_9: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_T: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_J: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_Q: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_K: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        C_A: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_2: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_3: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_4: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_5: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_6: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_7: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_8: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_9: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_T: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_J: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_Q: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_K: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        D_A: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_2: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_3: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_4: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_5: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_6: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_7: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_8: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_9: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_T: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_J: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_Q: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_K: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
        S_A: { name: string; value: string; suit: string; pos: { x: number; y: number; }; };
    };
    j_locked: HiddenItemDefinition;
    v_locked: HiddenItemDefinition;
    c_locked: HiddenItemDefinition;
    j_undiscovered: HiddenItemDefinition;
    t_undiscovered: HiddenItemDefinition;
    p_undiscovered: HiddenItemDefinition;
    s_undiscovered: HiddenItemDefinition;
    v_undiscovered: HiddenItemDefinition;
    booster_undiscovered: HiddenItemDefinition;
    P_CENTER_POOLS: { Booster: []; Default: []; Enhanced: []; Edition: []; Joker: []; Tarot: []; Planet: []; Tarot_Planet: []; Spectral: []; Consumeables: []; Voucher: []; Back: []; Tag: []; Seal: []; Stake: []; Demo: []; };
    P_JOKER_RARITY_POOLS: {}[];
    P_LOCKED: ItemCenterDefinition[];
    LANGUAGES: any;
    FONTS: { file: string; render_scale: number; TEXT_HEIGHT_SCALE: number; TEXT_OFFSET: { x: number; y: number; }; FONTSCALE: number; squish: number; DESCSCALE: number; }[];
    LANG: any;
    localization: any;
    animation_atli: { name: string; path: string; px: number; py: number; frames: number; }[];
    asset_atli: {
        type: any; name: string; path: string; px: number; py: number; 
}[];
    asset_images: {
        type: any; name: string; path: string; px: number; py: number; 
}[];
    ROOM_PADDING_H: number;
    ROOM_PADDING_W: number;
    WINDOWTRANS: { x: number; y: number; w: number; h: number; };
    window_prev: { orig_scale: number; w: number; h: number; orig_ratio: number; };
    ROOM: any;
    load_shop_booster: undefined;
    load_shop_jokers: undefined;
    load_shop_vouchers: undefined;
    buttons: any;
    deck_preview: any;
    shop: any;
    blind_select: any;
    booster_pack: any;
    MAIN_MENU_UI: any;
    SPLASH_FRONT: any;
    SPLASH_BACK: any;
    SPLASH_LOGO: any;
    GAME_OVER_UI: any;
    collection_alert: any;
    HUD: any;
    HUD_blind: any;
    HUD_tags: any;
    OVERLAY_MENU: any;
    OVERLAY_TUTORIAL: any;
    VIEWING_DECK: undefined;
    GAME: any;
    FILE_HANDLER: any;
    ROOM_ATTACH: any;
    SANDBOX: {
        joker: any;
        file_reload_timer: any;
        UI: any; vort_time: number; vort_speed: number; col_op: string[]; col1: any; col2: any; mid_flash: number; joker_text: string; edition: string; tilt: number; card_size: number; base_size: { w: number; h: number; }; gamespeed: number; 
};
    real_dt: any;
    vortex_time: number;
    debug_splash_size_toggle: number;
    title_top: any;
    REFRESH_ALERTS: boolean;
    SAVED_GAME: undefined;
    RESET_BLIND_STATES: boolean;
    consumeables: any;
    jokers: any;
    discard: any;
    vouchers: any;
    deck: any;
    hand: any;
    play: any;
    playing_cards: {};
    hand_text_area: { chips: any; mult: any; ante: any; round: any; chip_total: any; handname: any; hand_level: any; game_chips: any; blind_chips: any; blind_spacer: any; };
    MAJORS: number;
    MINORS: number;
    fbf: any;
    new_frame: boolean;
    ACC_state: number;
    ACC: number;
    screenwipe: any;
    boss_throw_hand: any;
    boss_warning_text: any;
    prev_small_state: any;
    prev_large_state: any;
    prev_boss_state: any;
    STEAM: any;
    DEBUG_VALUE: string;
    under_overlay: boolean;
    CANVAS: RenderTargetSetup;
    debug_background_toggle: any;
    debug_UI_toggle: any;
    debug_tools: unknown;
    online_leaderboard: unknown;
    achievement_notification: unknown;
    ALERT_ON_SCREEN: undefined;
    recording_mode: any;
    video_control: boolean;
    screenwipe_amt: any;
    screenglitch: number;
    UIDEF: any;
    shop_jokers: any;
    shop_vouchers: any;
    shop_booster: any;
    round_eval: any;
    booster_pack_sparkles: any;
    booster_pack_stars: any;
    booster_pack_meteors: any;
    G: { vort_time: number; vort_speed: number; col_op: string[]; col1: any; col2: any; mid_flash: number; joker_text: string; edition: string; tilt: number; card_size: number; base_size: { w: number; h: number; }; gamespeed: number; };
    SPLASH_VOL: any;
    video_soundtrack: string | boolean;
    normal_music_speed: any;
    video_organ: number | boolean;
    E_SWITCH_POINT: any;
    F_STREAMER_EVENT: boolean | { name: string; prev_name: string; submission_name?: string; score: number; };
    PROGRESS: any;
    DISCOVER_TALLIES: any;
    action: any;
    culled_table: any;
    playing_card: any;
    ID: any;
    CHALLENGES: ChallengeData[];
    constructor() {
        super()
        G = this
        this.set_globals()
    }
    set_globals() {
        this.VERSION = VERSION;
        this.F_QUIT_BUTTON = true;
        this.F_SKIP_TUTORIAL = false;
        this.F_BASIC_CREDITS = false;
        this.F_EXTERNAL_LINKS = true;
        this.F_ENABLE_PERF_OVERLAY = false;
        this.F_NO_SAVING = false;
        this.F_MUTE = false;
        this.F_SOUND_THREAD = true;
        this.F_VIDEO_SETTINGS = true;
        this.F_CTA = false;
        this.F_VERBOSE = true;
        this.F_HTTP_SCORES = false;
        this.F_RUMBLE = undefined;
        this.F_CRASH_REPORTS = false;
        this.F_NO_ERROR_HAND = false;
        this.F_SWAP_AB_PIPS = false;
        this.F_SWAP_AB_BUTTONS = false;
        this.F_SWAP_XY_BUTTONS = false;
        this.F_NO_ACHIEVEMENTS = false;
        this.F_DISP_USERNAME = undefined;
        this.F_ENGLISH_ONLY = undefined;
        this.F_GUIDE = false;
        this.F_JAN_CTA = false;
        this.F_HIDE_BG = false;
        this.F_TROPHIES = false;
        this.F_PS4_PLAYSTATION_GLYPHS = false;
        this.F_LOCAL_CLIPBOARD = false;
        this.F_SAVE_TIMER = 30;
        this.F_MOBILE_UI = false;
        this.F_HIDE_BETA_LANGS = undefined;
        if (love.system.getOS() === "Windows") {
            this.F_DISCORD = true;
            this.F_SAVE_TIMER = 5;
            this.F_ENGLISH_ONLY = false;
            this.F_CRASH_REPORTS = false;
        }
        if (love.system.getOS() === "OS X") {
            this.F_SAVE_TIMER = 5;
            this.F_DISCORD = true;
            this.F_ENGLISH_ONLY = false;
            this.F_CRASH_REPORTS = false;
        }
        if (love.system.getOS() === "Nintendo Switch") {
            this.F_HIDE_BETA_LANGS = true;
            this.F_BASIC_CREDITS = true;
            this.F_NO_ERROR_HAND = true;
            this.F_QUIT_BUTTON = false;
            this.F_SKIP_TUTORIAL = false;
            this.F_ENABLE_PERF_OVERLAY = false;
            this.F_NO_SAVING = false;
            this.F_MUTE = false;
            this.F_SOUND_THREAD = true;
            this.F_SWAP_AB_PIPS = true;
            this.F_SWAP_AB_BUTTONS = false;
            this.F_SWAP_XY_BUTTONS = true;
            this.F_VIDEO_SETTINGS = false;
            this.F_RUMBLE = 0.7;
            this.F_CTA = false;
            this.F_VERBOSE = false;
            this.F_NO_ACHIEVEMENTS = true;
            this.F_ENGLISH_ONLY = undefined;
            this.F_EXTERNAL_LINKS = false;
            this.F_HIDE_BG = true;
        }
        if (love.system.getOS() === "ps4" || love.system.getOS() === "ps5") {
            this.F_HIDE_BETA_LANGS = true;
            this.F_NO_ERROR_HAND = true;
            this.F_QUIT_BUTTON = false;
            this.F_SKIP_TUTORIAL = false;
            this.F_ENABLE_PERF_OVERLAY = false;
            this.F_NO_SAVING = false;
            this.F_MUTE = false;
            this.F_SOUND_THREAD = true;
            this.F_VIDEO_SETTINGS = false;
            this.F_RUMBLE = 0.5;
            this.F_CTA = false;
            this.F_VERBOSE = false;
            this.F_GUIDE = true;
            this.F_PS4_PLAYSTATION_GLYPHS = false;
            this.F_EXTERNAL_LINKS = false;
            this.F_HIDE_BG = true;
        }
        if (love.system.getOS() === "xbox") {
            this.F_HIDE_BETA_LANGS = true;
            this.F_NO_ERROR_HAND = true;
            this.F_DISP_USERNAME = true;
            this.F_SKIP_TUTORIAL = false;
            this.F_ENABLE_PERF_OVERLAY = false;
            this.F_NO_SAVING = false;
            this.F_MUTE = false;
            this.F_SOUND_THREAD = true;
            this.F_VIDEO_SETTINGS = false;
            this.F_RUMBLE = 1;
            this.F_CTA = false;
            this.F_VERBOSE = false;
            this.F_EXTERNAL_LINKS = false;
            this.F_HIDE_BG = true;
        }
        this.SEED = Date.now();
        this.TIMERS = { TOTAL: 0, REAL: 0, REAL_SHADER: 0, UPTIME: 0, BACKGROUND: 0 };
        this.FRAMES = { DRAW: 0, MOVE: 0 };
        this.exp_times = { xy: 0, scale: 0, r: 0 };
        this.SETTINGS = { 
            COMP: { name: "", prev_name: "", submission_name: undefined, score: 0 },
            DEMO: { total_uptime: 0, timed_CTA_shown: false, win_CTA_shown: false, quit_CTA_shown: false },
            ACHIEVEMENTS_EARNED: {},
            crashreports: false,
            colourblind_option: false,
            language: "en-us",
            screenshake: true,
            run_stake_stickers: false,
            rumble: this.F_RUMBLE,
            play_button_pos: 2,
            GAMESPEED: 1,
            paused: false,
            SOUND: { volume: 50, music_volume: 100, game_sounds_volume: 100 },
            WINDOW: { screenmode: "Borderless", vsync: 1, selected_display: 1, display_names: ["[NONE]"], DISPLAYS: [{ name: "[NONE]", screen_res: { w: 1000, h: 650 }, screen_resolutions: {strings:[],values:[]},DPI_scale: 1,MONITOR_DIMS: {width:NaN,height:NaN} }] },
            CUSTOM_DECK: { Collabs: { Spades: "default", Hearts: "default", Clubs: "default", Diamonds: "default" } },
            GRAPHICS: { texture_scaling: 2, shadows: "On", crt: 70, bloom: 1 },
        };
        this.COLLABS = { pos: { Jack: { x: 0, y: 0 }, Queen: { x: 1, y: 0 }, King: { x: 2, y: 0 } }, options: { Spades: ["default", "collab_TW", "collab_CYP", "collab_SK", "collab_DS", "collab_AC", "collab_STP"], Hearts: ["default", "collab_AU", "collab_TBoI", "collab_CL", "collab_D2", "collab_CR", "collab_BUG"], Clubs: ["default", "collab_VS", "collab_STS", "collab_PC", "collab_WF", "collab_FO", "collab_DBD"], Diamonds: ["default", "collab_DTD", "collab_SV", "collab_EG", "collab_XR", "collab_C7", "collab_R"] } };
        this.METRICS = { cards: { used: {}, bought: {}, appeared: {} }, decks: { chosen: {}, win: {}, lose: {} }, bosses: { faced: {}, win: {}, lose: {} } };
        this.PROFILES = [{}, {}, {}];
        this.TILESIZE = 20;
        this.TILESCALE = 3.65;
        this.TILE_W = 20;
        this.TILE_H = 11.5;
        this.DRAW_HASH_BUFF = 2;
        this.CARD_W = 2.4 * 35 / 41;
        this.CARD_H = 2.4 * 47 / 41;
        this.HIGHLIGHT_H = 0.2 * this.CARD_H;
        this.COLLISION_BUFFER = 0.05;
        this.PITCH_MOD = 1;
        this.STATES = { SMODS_BOOSTER_OPENED: 999, SELECTING_HAND: 1, HAND_PLAYED: 2, DRAW_TO_HAND: 3, GAME_OVER: 4, SHOP: 5, PLAY_TAROT: 6, BLIND_SELECT: 7, ROUND_EVAL: 8, TAROT_PACK: 9, PLANET_PACK: 10, MENU: 11, TUTORIAL: 12, SPLASH: 13, SANDBOX: 14, SPECTRAL_PACK: 15, DEMO_CTA: 16, STANDARD_PACK: 17, BUFFOON_PACK: 18, NEW_ROUND: 19 };
        this.STAGES = { MAIN_MENU: 1, RUN: 2, SANDBOX: 3 };
        this.STAGE_OBJECTS = [[], [], []];
        this.STAGE = this.STAGES.MAIN_MENU;
        this.STATE = this.STATES.SPLASH;
        this.TAROT_INTERRUPT = undefined;
        this.STATE_COMPLETE = false;
        this.ARGS = {};
        this.FUNCS = {};
        this.I = { NODE: [], MOVEABLE: [], SPRITE: [], UIBOX: [], POPUP: [], CARD: [], CARDAREA: [], ALERT: [] };
        this.ANIMATION_ATLAS = {};
        this.ASSET_ATLAS = {
            Planet: {},
            Tarot: {},
            Spectral: {}
        };
        this.MOVEABLES = {};
        this.ANIMATIONS = {};
        this.DRAW_HASH = {};
        this.MIN_CLICK_DIST = 0.9;
        this.MIN_HOVER_TIME = 0.1;
        this.DEBUG = false;
        this.ANIMATION_FPS = 10;
        this.VIBRATION = 0;
        this.CHALLENGE_WINS = 5;
        this.C = { MULT: HEX("FE5F55"), CHIPS: HEX("009dff"), MONEY: HEX("f3b958"), XMULT: HEX("FE5F55"), FILTER: HEX("ff9a00"), BLUE: HEX("009dff"), RED: HEX("FE5F55"), GREEN: HEX("4BC292"), PALE_GREEN: HEX("56a887"), ORANGE: HEX("fda200"), IMPORTANT: HEX("ff9a00"), GOLD: HEX("eac058"), YELLOW: [1, 1, 0, 1], CLEAR: [0, 0, 0, 0], WHITE: [1, 1, 1, 1], PURPLE: HEX("8867a5"), BLACK: HEX("374244"), L_BLACK: HEX("4f6367"), GREY: HEX("5f7377"), CHANCE: HEX("4BC292"), JOKER_GREY: HEX("bfc7d5"), VOUCHER: HEX("cb724c"), BOOSTER: HEX("646eb7"), EDITION: [1, 1, 1, 1], DARK_EDITION: [0, 0, 0, 1], ETERNAL: HEX("c75985"), PERISHABLE: HEX("4f5da1"), RENTAL: HEX("b18f43"), DYN_UI: { MAIN: HEX("374244"), DARK: HEX("374244"), BOSS_MAIN: HEX("374244"), BOSS_DARK: HEX("374244"), BOSS_PALE: HEX("374244") }, SO_1: { Hearts: HEX("f03464"), Diamonds: HEX("f06b3f"), Spades: HEX("403995"), Clubs: HEX("235955") }, SO_2: { Hearts: HEX("f83b2f"), Diamonds: HEX("e29000"), Spades: HEX("4f31b9"), Clubs: HEX("008ee6") }, SUITS: { Hearts: HEX("FE5F55"), Diamonds: HEX("FE5F55"), Spades: HEX("374649"), Clubs: HEX("424e54") }, UI: { TEXT_LIGHT: [1, 1, 1, 1], TEXT_DARK: HEX("4F6367"), TEXT_INACTIVE: HEX("88888899"), BACKGROUND_LIGHT: HEX("B8D8D8"), BACKGROUND_WHITE: [1, 1, 1, 1], BACKGROUND_DARK: HEX("7A9E9F"), BACKGROUND_INACTIVE: HEX("666666FF"), OUTLINE_LIGHT: HEX("D8D8D8"), OUTLINE_LIGHT_TRANS: HEX("D8D8D866"), OUTLINE_DARK: HEX("7A9E9F"), TRANSPARENT_LIGHT: HEX("eeeeee22"), TRANSPARENT_DARK: HEX("22222222"), HOVER: HEX("00000055") }, SET: { Default: HEX("cdd9dc"), Enhanced: HEX("cdd9dc"), Joker: HEX("424e54"), Tarot: HEX("424e54"), Planet: HEX("424e54"), Spectral: HEX("424e54"), Voucher: HEX("424e54") }, SECONDARY_SET: { Default: HEX("9bb6bdFF"), Enhanced: HEX("8389DDFF"), Joker: HEX("708b91"), Tarot: HEX("a782d1"), Planet: HEX("13afce"), Spectral: HEX("4584fa"), Voucher: HEX("fd682b"), Edition: HEX("4ca893") }, RARITY: [HEX("009dff"), HEX("4BC292"), HEX("fe5f55"), HEX("b26cbb")], BLIND: { Small: HEX("50846e"), Big: HEX("50846e"), Boss: HEX("b44430"), won: HEX("4f6367") }, HAND_LEVELS: [HEX("efefef"), HEX("95acff"), HEX("65efaf"), HEX("fae37e"), HEX("ffc052"), HEX("f87d75"), HEX("caa0ef")], BACKGROUND: { L: [1, 1, 0, 1], D: HEX("374244"), C: HEX("374244"), contrast: 1 }, UI_CHIPS: [], UI_MULT: [] };
        G.C.HAND_LEVELS[0] = G.C.RED;
        G.C.UI_CHIPS = copy_table(G.C.BLUE);
        G.C.UI_MULT = copy_table(G.C.RED);
        this.UIT = { T: 1, B: 2, C: 3, R: 4, O: 5, ROOT: 7, S: 8, I: 9, padding: 0 };
        this.handlist = ["Flush Five", "Flush House", "Five of a Kind", "Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight", "Three of a Kind", "Two Pair", "Pair", "High Card"];
        this.button_mapping = { a: G.F_SWAP_AB_BUTTONS && "b" || undefined, b: G.F_SWAP_AB_BUTTONS && "a" || undefined, y: G.F_SWAP_XY_BUTTONS && "x" || undefined, x: G.F_SWAP_XY_BUTTONS && "y" || undefined };
        this.keybind_mapping = [{ a: "dpleft", d: "dpright", w: "dpup", s: "dpdown", x: "x", c: "y", space: "a", shift: "b", esc: "start", q: "triggerleft", e: "triggerright" }];
    }
    start_up() {
        let settings = get_compressed("settings.jkr");
        let settings_ver = undefined;
        if (settings) {
            let settings_file = STR_UNPACK(settings);
            if (G.VERSION >= "1.0.0" && love.system.getOS() === "NOPE" && (!settings_file.version || settings_file.version < "1.0.0")) {
                for (let i = 1; i <= 3; i++) {
                    love.filesystem.remove(i + ("/" + "profile.jkr"));
                    love.filesystem.remove(i + ("/" + "save.jkr"));
                    love.filesystem.remove(i + ("/" + "meta.jkr"));
                    love.filesystem.remove(i + ("/" + "unlock_notify.jkr"));
                    love.filesystem.remove(i + "");
                }
                for (const [k, v] of Object.entries(settings_file)) {
                    this.SETTINGS[k] = v;
                }
                this.SETTINGS.profile = 1;
                this.SETTINGS.tutorial_progress = undefined;
            }
            else {
                if (G.VERSION < "1.0.0") {
                    settings_ver = settings_file.version;
                }
                for (const [k, v] of Object.entries(settings_file)) {
                    this.SETTINGS[k] = v;
                }
            }
        }
        this.SETTINGS.version = settings_ver || G.VERSION;
        this.SETTINGS.paused = undefined;
        let new_colour_proto = this.C["SO_" + (this.SETTINGS.colourblind_option && 2 || 1)];
        this.C.SUITS.Hearts = new_colour_proto.Hearts;
        this.C.SUITS.Diamonds = new_colour_proto.Diamonds;
        this.C.SUITS.Spades = new_colour_proto.Spades;
        this.C.SUITS.Clubs = new_colour_proto.Clubs;
        boot_timer("start", "settings", 0.1);
        if (this.SETTINGS.GRAPHICS.texture_scaling) {
            this.SETTINGS.GRAPHICS.texture_scaling = this.SETTINGS.GRAPHICS.texture_scaling > 1 && 2 || 1;
        }
        if (this.SETTINGS.DEMO && !this.F_CTA) {
            this.SETTINGS.DEMO = { total_uptime: 0, timed_CTA_shown: true, win_CTA_shown: true, quit_CTA_shown: true };
        }
        let SOURCES = {};
        let sound_files = love.filesystem.getDirectoryItems("resources/sounds");
        for (const [_, filename] of Array.prototype.entries.call(sound_files)) {
            let extension = String.prototype.substring.call(filename, -4);
            if (extension === ".ogg") {
                let sound_code = String.prototype.substring.call(filename, 1, -5);
                SOURCES[sound_code] = {};
            }
        }
        this.SETTINGS.language = this.SETTINGS.language || "en-us";
        boot_timer("settings", "window init", 0.2);
        this.init_window();
        if (G.F_SOUND_THREAD) {
            boot_timer("window init", "soundmanager2");
            this.SOUND_MANAGER = { thread: love.thread.newThread("engine/sound_manager.lua"), channel: love.thread.getChannel("sound_request"), load_channel: love.thread.getChannel("load_channel") };
            this.SOUND_MANAGER.thread.start(1);
            let [sound_loaded, prev_file] = [false, "none"];
            while (!sound_loaded && false) {
                let request = this.SOUND_MANAGER?.load_channel?.pop();
                if (request) {
                    if (request === "finished") {
                        sound_loaded = true;
                    }
                    else {
                        boot_timer(request, prev_file);
                        prev_file = request;
                    }
                }
                love.timer.sleep(0.001);
            }
            boot_timer("soundmanager2", "savemanager", 0.22);
        }
        boot_timer("window init", "savemanager");
        G.SAVE_MANAGER = { thread: love.thread.newThread("engine/save_manager.lua"), channel: love.thread.getChannel("save_request") };
        G.SAVE_MANAGER.thread.start(2);
        boot_timer("savemanager", "shaders", 0.4);
        G.HTTP_MANAGER = { thread: love.thread.newThread("engine/http_manager.lua"), out_channel: love.thread.getChannel("http_request"), in_channel: love.thread.getChannel("http_response") };
        if (G.F_HTTP_SCORES) {
            G.HTTP_MANAGER?.thread.start();
        }
        this.SHADERS = {};
        let shader_files = love.filesystem.getDirectoryItems("resources/shaders");
        for (const [k, filename] of Array.prototype.entries.call(shader_files)) {
            let extension = String.prototype.substring.call(filename, -3);
            if (extension === ".fs") {
                let shader_name = String.prototype.substring.call(filename, 1, -4);
                this.SHADERS[shader_name] = love.graphics.newShader("resources/shaders/" + filename);
            }
        }
        boot_timer("shaders", "controllers", 0.7);
        this.CONTROLLER = new Controller();
        love.joystick.loadGamepadMappings("resources/gamecontrollerdb.txt");
        if (this.F_RUMBLE) {
            let joysticks = love.joystick.getJoysticks();
            if (joysticks) {
                if (joysticks[1]) {
                    this.CONTROLLER.set_gamepad(joysticks[2] || joysticks[1]);
                }
            }
        }
        boot_timer("controllers", "localization", 0.8);
        if (this.SETTINGS.GRAPHICS.texture_scaling) {
            this.SETTINGS.GRAPHICS.texture_scaling = this.SETTINGS.GRAPHICS.texture_scaling > 1 && 2 || 1;
        }
        this.load_profile(G.SETTINGS.profile || 1);
        this.SETTINGS.QUEUED_CHANGE = {};
        this.SETTINGS.music_control = { desired_track: "", current_track: "", lerp: 1 };
        this.set_render_settings();
        this.set_language();
        this.init_item_prototypes();
        boot_timer("protos", "shared sprites", 0.9);
        this.shared_debuff = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], { x: 4, y: 0 });
        this.shared_soul = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], this.P_CENTERS.soul.pos);
        this.shared_undiscovered_joker = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], this.P_CENTERS.undiscovered_joker.pos);
        this.shared_undiscovered_tarot = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], this.P_CENTERS.undiscovered_tarot.pos);
        this.shared_sticker_eternal = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 0, y: 0 });
        this.shared_sticker_perishable = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 0, y: 2 });
        this.shared_sticker_rental = new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 1, y: 2 });
        this.shared_stickers = { White: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 1, y: 0 }), Red: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 2, y: 0 }), Green: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 3, y: 0 }), Black: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 0, y: 1 }), Blue: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 4, y: 0 }), Purple: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 1, y: 1 }), Orange: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 2, y: 1 }), Gold: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["stickers"], { x: 3, y: 1 }) };
        this.shared_seals = { Gold: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], { x: 2, y: 0 }), Purple: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], { x: 4, y: 4 }), Red: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], { x: 5, y: 4 }), Blue: new Sprite(0, 0, this.CARD_W, this.CARD_H, this.ASSET_ATLAS["centers"], { x: 6, y: 4 }) };
        this.sticker_map = ["White", "Red", "Green", "Black", "Blue", "Purple", "Orange", "Gold"];
        boot_timer("shared sprites", "prep stage", 0.95);
        G.STAGE_OBJECT_INTERRUPT = true;
        this.CURSOR = new Sprite(0, 0, 0.3, 0.3, this.ASSET_ATLAS["gamepad_ui"], { x: 18, y: 0 });
        this.CURSOR.states.collide.can = false;
        G.STAGE_OBJECT_INTERRUPT = false;
        this.E_MANAGER = new EventManager();
        this.SPEEDFACTOR = 1;
        initSteamodded();
        set_profile_progress();
        boot_timer("prep stage", "splash prep", 1);
        this.splash_screen();
        boot_timer("splash prep", "end", 1);
    };
    init_item_prototypes() {
        this.P_SEALS = {
            Red: { order: 1, discovered: false, set: "Seal" },
            Blue: { order: 2, discovered: false, set: "Seal" },
            Gold: { order: 3, discovered: false, set: "Seal" },
            Purple: { order: 4, discovered: false, set: "Seal" }
        };
        this.P_TAGS = { 
            tag_uncommon: { name: "Uncommon Tag", set: "Tag", discovered: false, min_ante: undefined, order: 1, config: { type: "store_joker_create" }, pos: { x: 0, y: 0 } },
            tag_rare: { name: "Rare Tag", set: "Tag", discovered: false, min_ante: undefined, order: 2, config: { type: "store_joker_create", odds: 3 }, requires: "j_blueprint", pos: { x: 1, y: 0 } },
            tag_negative: { name: "Negative Tag", set: "Tag", discovered: false, min_ante: 2, order: 3, config: { type: "store_joker_modify", edition: "negative", odds: 5 }, requires: "e_negative", pos: { x: 2, y: 0 } },
            tag_foil: { name: "Foil Tag", set: "Tag", discovered: false, min_ante: undefined, order: 4, config: { type: "store_joker_modify", edition: "foil", odds: 2 }, requires: "e_foil", pos: { x: 3, y: 0 } },
            tag_holo: { name: "Holographic Tag", set: "Tag", discovered: false, min_ante: undefined, order: 5, config: { type: "store_joker_modify", edition: "holo", odds: 3 }, requires: "e_holo", pos: { x: 0, y: 1 } },
            tag_polychrome: { name: "Polychrome Tag", set: "Tag", discovered: false, min_ante: undefined, order: 6, config: { type: "store_joker_modify", edition: "polychrome", odds: 4 }, requires: "e_polychrome", pos: { x: 1, y: 1 } },
            tag_investment: { name: "Investment Tag", set: "Tag", discovered: false, min_ante: undefined, order: 7, config: { type: "eval", dollars: 25 }, pos: { x: 2, y: 1 } },
            tag_voucher: { name: "Voucher Tag", set: "Tag", discovered: false, min_ante: undefined, order: 8, config: { type: "voucher_add" }, pos: { x: 3, y: 1 } },
            tag_boss: { name: "Boss Tag", set: "Tag", discovered: false, min_ante: undefined, order: 9, config: { type: "new_blind_choice" }, pos: { x: 0, y: 2 } },
            tag_standard: { name: "Standard Tag", set: "Tag", discovered: false, min_ante: 2, order: 10, config: { type: "new_blind_choice" }, pos: { x: 1, y: 2 } },
            tag_charm: { name: "Charm Tag", set: "Tag", discovered: false, min_ante: undefined, order: 11, config: { type: "new_blind_choice" }, pos: { x: 2, y: 2 } },
            tag_meteor: { name: "Meteor Tag", set: "Tag", discovered: false, min_ante: 2, order: 12, config: { type: "new_blind_choice" }, pos: { x: 3, y: 2 } },
            tag_buffoon: { name: "Buffoon Tag", set: "Tag", discovered: false, min_ante: 2, order: 13, config: { type: "new_blind_choice" }, pos: { x: 4, y: 2 } },
            tag_handy: { name: "Handy Tag", set: "Tag", discovered: false, min_ante: 2, order: 14, config: { type: "immediate", dollars_per_hand: 1 }, pos: { x: 1, y: 3 } },
            tag_garbage: { name: "Garbage Tag", set: "Tag", discovered: false, min_ante: 2, order: 15, config: { type: "immediate", dollars_per_discard: 1 }, pos: { x: 2, y: 3 } },
            tag_ethereal: { name: "Ethereal Tag", set: "Tag", discovered: false, min_ante: 2, order: 16, config: { type: "new_blind_choice" }, pos: { x: 3, y: 3 } },
            tag_coupon: { name: "Coupon Tag", set: "Tag", discovered: false, min_ante: undefined, order: 17, config: { type: "shop_final_pass" }, pos: { x: 4, y: 0 } },
            tag_double: { name: "Double Tag", set: "Tag", discovered: false, min_ante: undefined, order: 18, config: { type: "tag_add" }, pos: { x: 5, y: 0 } },
            tag_juggle: { name: "Juggle Tag", set: "Tag", discovered: false, min_ante: undefined, order: 19, config: { type: "round_start_bonus", h_size: 3 }, pos: { x: 5, y: 1 } },
            tag_d_six: { name: "D6 Tag", set: "Tag", discovered: false, min_ante: undefined, order: 20, config: { type: "shop_start" }, pos: { x: 5, y: 3 } },
            tag_top_up: { name: "Top-up Tag", set: "Tag", discovered: false, min_ante: 2, order: 21, config: { type: "immediate", spawn_jokers: 2 }, pos: { x: 4, y: 1 } },
            tag_skip: { name: "Skip Tag", set: "Tag", discovered: false, min_ante: undefined, order: 22, config: { type: "immediate", skip_bonus: 5 }, pos: { x: 0, y: 3 } },
            tag_orbital: { name: "Orbital Tag", set: "Tag", discovered: false, min_ante: 2, order: 23, config: { type: "immediate", levels: 3 }, pos: { x: 5, y: 2 } },
            tag_economy: { name: "Economy Tag", set: "Tag", discovered: false, min_ante: undefined, order: 24, config: { type: "immediate", max: 40 }, pos: { x: 4, y: 3 } }
        };
        this.tag_undiscovered = { 
            name: "Not Discovered",
            order: 1,
            config: { type: "" },
            pos: { x: 3, y: 4 }
        };
        this.P_STAKES = { 
            stake_white: { name: "White Chip", unlocked: true, order: 1, pos: { x: 0, y: 0 }, stake_level: 1, set: "Stake" },
            stake_red: { name: "Red Chip", unlocked: false, order: 2, pos: { x: 1, y: 0 }, stake_level: 2, set: "Stake" },
            stake_green: { name: "Green Chip", unlocked: false, order: 3, pos: { x: 2, y: 0 }, stake_level: 3, set: "Stake" },
            stake_black: { name: "Black Chip", unlocked: false, order: 4, pos: { x: 4, y: 0 }, stake_level: 4, set: "Stake" },
            stake_blue: { name: "Blue Chip", unlocked: false, order: 5, pos: { x: 3, y: 0 }, stake_level: 5, set: "Stake" },
            stake_purple: { name: "Purple Chip", unlocked: false, order: 6, pos: { x: 0, y: 1 }, stake_level: 6, set: "Stake" },
            stake_orange: { name: "Orange Chip", unlocked: false, order: 7, pos: { x: 1, y: 1 }, stake_level: 7, set: "Stake" },
            stake_gold: { name: "Gold Chip", unlocked: false, order: 8, pos: { x: 2, y: 1 }, stake_level: 8, set: "Stake" }
        };
        this.P_BLINDS = { 
            bl_small: { name: "Small Blind", defeated: false, order: 1, dollars: 3, mult: 1, vars: {}, debuff_text: "", debuff: {}, pos: { x: 0, y: 0 } },
            bl_big: { name: "Big Blind", defeated: false, order: 2, dollars: 4, mult: 1.5, vars: {}, debuff_text: "", debuff: {}, pos: { x: 0, y: 1 } },
            bl_ox: { name: "The Ox", defeated: false, order: 4, dollars: 5, mult: 2, vars: [localize("ph_most_played")], debuff: {}, pos: { x: 0, y: 2 }, boss: { min: 6, max: 10 }, boss_colour: HEX("b95b08") },
            bl_hook: { name: "The Hook", defeated: false, order: 3, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 7 }, boss: { min: 1, max: 10 }, boss_colour: HEX("a84024") },
            bl_mouth: { name: "The Mouth", defeated: false, order: 17, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 18 }, boss: { min: 2, max: 10 }, boss_colour: HEX("ae718e") },
            bl_fish: { name: "The Fish", defeated: false, order: 10, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 5 }, boss: { min: 2, max: 10 }, boss_colour: HEX("3e85bd") },
            bl_club: { name: "The Club", defeated: false, order: 9, dollars: 5, mult: 2, vars: {}, debuff: { suit: "Clubs" }, pos: { x: 0, y: 4 }, boss: { min: 1, max: 10 }, boss_colour: HEX("b9cb92") },
            bl_manacle: { name: "The Manacle", defeated: false, order: 15, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 8 }, boss: { min: 1, max: 10 }, boss_colour: HEX("575757") },
            bl_tooth: { name: "The Tooth", defeated: false, order: 23, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 22 }, boss: { min: 3, max: 10 }, boss_colour: HEX("b52d2d") },
            bl_wall: { name: "The Wall", defeated: false, order: 6, dollars: 5, mult: 4, vars: {}, debuff: {}, pos: { x: 0, y: 9 }, boss: { min: 2, max: 10 }, boss_colour: HEX("8a59a5") },
            bl_house: { name: "The House", defeated: false, order: 5, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 3 }, boss: { min: 2, max: 10 }, boss_colour: HEX("5186a8") },
            bl_mark: { name: "The Mark", defeated: false, order: 25, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 23 }, boss: { min: 2, max: 10 }, boss_colour: HEX("6a3847") },
            bl_final_bell: { name: "Cerulean Bell", defeated: false, order: 30, dollars: 8, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 26 }, boss: { showdown: true, min: 10, max: 10 }, boss_colour: HEX("009cfd") },
            bl_wheel: { name: "The Wheel", defeated: false, order: 7, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 10 }, boss: { min: 2, max: 10 }, boss_colour: HEX("50bf7c") },
            bl_arm: { name: "The Arm", defeated: false, order: 8, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 11 }, boss: { min: 2, max: 10 }, boss_colour: HEX("6865f3") },
            bl_psychic: { name: "The Psychic", defeated: false, order: 11, dollars: 5, mult: 2, vars: {}, debuff: { h_size_ge: 5 }, pos: { x: 0, y: 12 }, boss: { min: 1, max: 10 }, boss_colour: HEX("efc03c") },
            bl_goad: { name: "The Goad", defeated: false, order: 12, dollars: 5, mult: 2, vars: {}, debuff: { suit: "Spades" }, pos: { x: 0, y: 13 }, boss: { min: 1, max: 10 }, boss_colour: HEX("b95c96") },
            bl_water: { name: "The Water", defeated: false, order: 13, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 14 }, boss: { min: 2, max: 10 }, boss_colour: HEX("c6e0eb") },
            bl_eye: { name: "The Eye", defeated: false, order: 16, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 17 }, boss: { min: 3, max: 10 }, boss_colour: HEX("4b71e4") },
            bl_plant: { name: "The Plant", defeated: false, order: 18, dollars: 5, mult: 2, vars: {}, debuff: { is_face: "face" }, pos: { x: 0, y: 19 }, boss: { min: 4, max: 10 }, boss_colour: HEX("709284") },
            bl_needle: { name: "The Needle", defeated: false, order: 21, dollars: 5, mult: 1, vars: {}, debuff: {}, pos: { x: 0, y: 20 }, boss: { min: 2, max: 10 }, boss_colour: HEX("5c6e31") },
            bl_head: { name: "The Head", defeated: false, order: 22, dollars: 5, mult: 2, vars: {}, debuff: { suit: "Hearts" }, pos: { x: 0, y: 21 }, boss: { min: 1, max: 10 }, boss_colour: HEX("ac9db4") },
            bl_final_leaf: { name: "Verdant Leaf", defeated: false, order: 27, dollars: 8, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 28 }, boss: { showdown: true, min: 10, max: 10 }, boss_colour: HEX("56a786") },
            bl_final_vessel: { name: "Violet Vessel", defeated: false, order: 28, dollars: 8, mult: 6, vars: {}, debuff: {}, pos: { x: 0, y: 29 }, boss: { showdown: true, min: 10, max: 10 }, boss_colour: HEX("8a71e1") },
            bl_window: { name: "The Window", defeated: false, order: 14, dollars: 5, mult: 2, vars: {}, debuff: { suit: "Diamonds" }, pos: { x: 0, y: 6 }, boss: { min: 1, max: 10 }, boss_colour: HEX("a9a295") },
            bl_serpent: { name: "The Serpent", defeated: false, order: 19, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 15 }, boss: { min: 5, max: 10 }, boss_colour: HEX("439a4f") },
            bl_pillar: { name: "The Pillar", defeated: false, order: 20, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 16 }, boss: { min: 1, max: 10 }, boss_colour: HEX("7e6752") },
            bl_flint: { name: "The Flint", defeated: false, order: 24, dollars: 5, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 24 }, boss: { min: 2, max: 10 }, boss_colour: HEX("e56a2f") },
            bl_final_acorn: { name: "Amber Acorn", defeated: false, order: 26, dollars: 8, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 27 }, boss: { showdown: true, min: 10, max: 10 }, boss_colour: HEX("fda200") },
            bl_final_heart: { name: "Crimson Heart", defeated: false, order: 29, dollars: 8, mult: 2, vars: {}, debuff: {}, pos: { x: 0, y: 25 }, boss: { showdown: true, min: 10, max: 10 }, boss_colour: HEX("ac3232") }
        };
        this.b_undiscovered = { 
            name: "Undiscovered",
            debuff_text: "Defeat this blind to discover",
            pos: { x: 0, y: 30 }
        };
        this.P_CARDS = { 
            H_2: { name: "2 of Hearts", value: "2", suit: "Hearts", pos: { x: 0, y: 0 } },
            H_3: { name: "3 of Hearts", value: "3", suit: "Hearts", pos: { x: 1, y: 0 } },
            H_4: { name: "4 of Hearts", value: "4", suit: "Hearts", pos: { x: 2, y: 0 } },
            H_5: { name: "5 of Hearts", value: "5", suit: "Hearts", pos: { x: 3, y: 0 } },
            H_6: { name: "6 of Hearts", value: "6", suit: "Hearts", pos: { x: 4, y: 0 } },
            H_7: { name: "7 of Hearts", value: "7", suit: "Hearts", pos: { x: 5, y: 0 } },
            H_8: { name: "8 of Hearts", value: "8", suit: "Hearts", pos: { x: 6, y: 0 } },
            H_9: { name: "9 of Hearts", value: "9", suit: "Hearts", pos: { x: 7, y: 0 } },
            H_T: { name: "10 of Hearts", value: "10", suit: "Hearts", pos: { x: 8, y: 0 } },
            H_J: { name: "Jack of Hearts", value: "Jack", suit: "Hearts", pos: { x: 9, y: 0 } },
            H_Q: { name: "Queen of Hearts", value: "Queen", suit: "Hearts", pos: { x: 10, y: 0 } },
            H_K: { name: "King of Hearts", value: "King", suit: "Hearts", pos: { x: 11, y: 0 } },
            H_A: { name: "Ace of Hearts", value: "Ace", suit: "Hearts", pos: { x: 12, y: 0 } },
            C_2: { name: "2 of Clubs", value: "2", suit: "Clubs", pos: { x: 0, y: 1 } },
            C_3: { name: "3 of Clubs", value: "3", suit: "Clubs", pos: { x: 1, y: 1 } },
            C_4: { name: "4 of Clubs", value: "4", suit: "Clubs", pos: { x: 2, y: 1 } },
            C_5: { name: "5 of Clubs", value: "5", suit: "Clubs", pos: { x: 3, y: 1 } },
            C_6: { name: "6 of Clubs", value: "6", suit: "Clubs", pos: { x: 4, y: 1 } },
            C_7: { name: "7 of Clubs", value: "7", suit: "Clubs", pos: { x: 5, y: 1 } },
            C_8: { name: "8 of Clubs", value: "8", suit: "Clubs", pos: { x: 6, y: 1 } },
            C_9: { name: "9 of Clubs", value: "9", suit: "Clubs", pos: { x: 7, y: 1 } },
            C_T: { name: "10 of Clubs", value: "10", suit: "Clubs", pos: { x: 8, y: 1 } },
            C_J: { name: "Jack of Clubs", value: "Jack", suit: "Clubs", pos: { x: 9, y: 1 } },
            C_Q: { name: "Queen of Clubs", value: "Queen", suit: "Clubs", pos: { x: 10, y: 1 } },
            C_K: { name: "King of Clubs", value: "King", suit: "Clubs", pos: { x: 11, y: 1 } },
            C_A: { name: "Ace of Clubs", value: "Ace", suit: "Clubs", pos: { x: 12, y: 1 } },
            D_2: { name: "2 of Diamonds", value: "2", suit: "Diamonds", pos: { x: 0, y: 2 } },
            D_3: { name: "3 of Diamonds", value: "3", suit: "Diamonds", pos: { x: 1, y: 2 } },
            D_4: { name: "4 of Diamonds", value: "4", suit: "Diamonds", pos: { x: 2, y: 2 } },
            D_5: { name: "5 of Diamonds", value: "5", suit: "Diamonds", pos: { x: 3, y: 2 } },
            D_6: { name: "6 of Diamonds", value: "6", suit: "Diamonds", pos: { x: 4, y: 2 } },
            D_7: { name: "7 of Diamonds", value: "7", suit: "Diamonds", pos: { x: 5, y: 2 } },
            D_8: { name: "8 of Diamonds", value: "8", suit: "Diamonds", pos: { x: 6, y: 2 } },
            D_9: { name: "9 of Diamonds", value: "9", suit: "Diamonds", pos: { x: 7, y: 2 } },
            D_T: { name: "10 of Diamonds", value: "10", suit: "Diamonds", pos: { x: 8, y: 2 } },
            D_J: { name: "Jack of Diamonds", value: "Jack", suit: "Diamonds", pos: { x: 9, y: 2 } },
            D_Q: { name: "Queen of Diamonds", value: "Queen", suit: "Diamonds", pos: { x: 10, y: 2 } },
            D_K: { name: "King of Diamonds", value: "King", suit: "Diamonds", pos: { x: 11, y: 2 } },
            D_A: { name: "Ace of Diamonds", value: "Ace", suit: "Diamonds", pos: { x: 12, y: 2 } },
            S_2: { name: "2 of Spades", value: "2", suit: "Spades", pos: { x: 0, y: 3 } },
            S_3: { name: "3 of Spades", value: "3", suit: "Spades", pos: { x: 1, y: 3 } },
            S_4: { name: "4 of Spades", value: "4", suit: "Spades", pos: { x: 2, y: 3 } },
            S_5: { name: "5 of Spades", value: "5", suit: "Spades", pos: { x: 3, y: 3 } },
            S_6: { name: "6 of Spades", value: "6", suit: "Spades", pos: { x: 4, y: 3 } },
            S_7: { name: "7 of Spades", value: "7", suit: "Spades", pos: { x: 5, y: 3 } },
            S_8: { name: "8 of Spades", value: "8", suit: "Spades", pos: { x: 6, y: 3 } },
            S_9: { name: "9 of Spades", value: "9", suit: "Spades", pos: { x: 7, y: 3 } },
            S_T: { name: "10 of Spades", value: "10", suit: "Spades", pos: { x: 8, y: 3 } },
            S_J: { name: "Jack of Spades", value: "Jack", suit: "Spades", pos: { x: 9, y: 3 } },
            S_Q: { name: "Queen of Spades", value: "Queen", suit: "Spades", pos: { x: 10, y: 3 } },
            S_K: { name: "King of Spades", value: "King", suit: "Spades", pos: { x: 11, y: 3 } },
            S_A: { name: "Ace of Spades", value: "Ace", suit: "Spades", pos: { x: 12, y: 3 } }
        };
        this.j_locked = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 8, y: 9 },
            set: "Joker",
            cost_mult: 1,
            config: {}
        };
        this.v_locked = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 8, y: 3 },
            set: "Voucher",
            cost_mult: 1,
            config: {}
        };
        this.c_locked = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 4, y: 2 },
            set: "Tarot",
            cost_mult: 1,
            config: {}
        };
        this.j_undiscovered = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 9, y: 9 },
            set: "Joker",
            cost_mult: 1,
            config: {}
        };
        this.t_undiscovered = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 6, y: 2 },
            set: "Tarot",
            cost_mult: 1,
            config: {}
        };
        this.p_undiscovered = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 7, y: 2 },
            set: "Planet",
            cost_mult: 1,
            config: {}
        };
        this.s_undiscovered = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 5, y: 2 },
            set: "Spectral",
            cost_mult: 1,
            config: {}
        };
        this.v_undiscovered = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 8, y: 2 },
            set: "Voucher",
            cost_mult: 1,
            config: {}
        };
        this.booster_undiscovered = { 
            unlocked: false,
            max: 1,
            name: "Locked",
            pos: { x: 0, y: 5 },
            set: "Booster",
            cost_mult: 1,
            config: {}
        };
        this.P_CENTERS = { 
            c_base: { max: 500, freq: 1, line: "base", name: "Default Base", pos: { x: 1, y: 0 }, set: "Default", label: "Base Card", effect: "Base", cost_mult: 1, config: {} },
            j_joker: { order: 1, unlocked: true, start_alerted: true, discovered: true, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 2, name: "Joker", pos: { x: 0, y: 0 }, set: "Joker", effect: "Mult", cost_mult: 1, config: { mult: 4 } },
            j_greedy_joker: { order: 2, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Greedy Joker", pos: { x: 6, y: 1 }, set: "Joker", effect: "Suit Mult", cost_mult: 1, config: { extra: { s_mult: 3, suit: "Diamonds" } } },
            j_lusty_joker: { order: 3, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Lusty Joker", pos: { x: 7, y: 1 }, set: "Joker", effect: "Suit Mult", cost_mult: 1, config: { extra: { s_mult: 3, suit: "Hearts" } } },
            j_wrathful_joker: { order: 4, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Wrathful Joker", pos: { x: 8, y: 1 }, set: "Joker", effect: "Suit Mult", cost_mult: 1, config: { extra: { s_mult: 3, suit: "Spades" } } },
            j_gluttenous_joker: { order: 5, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Gluttonous Joker", pos: { x: 9, y: 1 }, set: "Joker", effect: "Suit Mult", cost_mult: 1, config: { extra: { s_mult: 3, suit: "Clubs" } } },
            j_jolly: { order: 6, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 3, name: "Jolly Joker", pos: { x: 2, y: 0 }, set: "Joker", effect: "Type Mult", cost_mult: 1, config: { t_mult: 8, type: "Pair" } },
            j_zany: { order: 7, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Zany Joker", pos: { x: 3, y: 0 }, set: "Joker", effect: "Type Mult", cost_mult: 1, config: { t_mult: 12, type: "Three of a Kind" } },
            j_mad: { order: 8, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Mad Joker", pos: { x: 4, y: 0 }, set: "Joker", effect: "Type Mult", cost_mult: 1, config: { t_mult: 10, type: "Two Pair" } },
            j_crazy: { order: 9, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Crazy Joker", pos: { x: 5, y: 0 }, set: "Joker", effect: "Type Mult", cost_mult: 1, config: { t_mult: 12, type: "Straight" } },
            j_droll: { order: 10, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Droll Joker", pos: { x: 6, y: 0 }, set: "Joker", effect: "Type Mult", cost_mult: 1, config: { t_mult: 10, type: "Flush" } },
            j_sly: { order: 11, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 3, name: "Sly Joker", set: "Joker", config: { t_chips: 50, type: "Pair" }, pos: { x: 0, y: 14 } },
            j_wily: { order: 12, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Wily Joker", set: "Joker", config: { t_chips: 100, type: "Three of a Kind" }, pos: { x: 1, y: 14 } },
            j_clever: { order: 13, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Clever Joker", set: "Joker", config: { t_chips: 80, type: "Two Pair" }, pos: { x: 2, y: 14 } },
            j_devious: { order: 14, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Devious Joker", set: "Joker", config: { t_chips: 100, type: "Straight" }, pos: { x: 3, y: 14 } },
            j_crafty: { order: 15, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Crafty Joker", set: "Joker", config: { t_chips: 80, type: "Flush" }, pos: { x: 4, y: 14 } },
            j_half: { order: 16, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Half Joker", pos: { x: 7, y: 0 }, set: "Joker", effect: "Hand Size Mult", cost_mult: 1, config: { extra: { mult: 20, size: 3 } } },
            j_stencil: { order: 17, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 8, name: "Joker Stencil", pos: { x: 2, y: 5 }, set: "Joker", effect: "Hand Size Mult", cost_mult: 1, config: {} },
            j_four_fingers: { order: 18, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Four Fingers", pos: { x: 6, y: 6 }, set: "Joker", effect: "", config: {} },
            j_mime: { order: 19, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Mime", pos: { x: 4, y: 1 }, set: "Joker", effect: "Hand card double", cost_mult: 1, config: { extra: 1 } },
            j_credit_card: { order: 20, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 1, name: "Credit Card", pos: { x: 5, y: 1 }, set: "Joker", effect: "Credit", cost_mult: 1, config: { extra: 20 } },
            j_ceremonial: { order: 21, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Ceremonial Dagger", pos: { x: 5, y: 5 }, set: "Joker", effect: "", config: { mult: 0 } },
            j_banner: { order: 22, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Banner", pos: { x: 1, y: 2 }, set: "Joker", effect: "Discard Chips", cost_mult: 1, config: { extra: 30 } },
            j_mystic_summit: { order: 23, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Mystic Summit", pos: { x: 2, y: 2 }, set: "Joker", effect: "No Discard Mult", cost_mult: 1, config: { extra: { mult: 15, d_remaining: 0 } } },
            j_marble: { order: 24, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Marble Joker", pos: { x: 3, y: 2 }, set: "Joker", effect: "Stone card hands", cost_mult: 1, config: { extra: 1 } },
            j_loyalty_card: { order: 25, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Loyalty Card", pos: { x: 4, y: 2 }, set: "Joker", effect: "1 in 10 mult", cost_mult: 1, config: { extra: { Xmult: 4, every: 5, remaining: "5 remaining" } } },
            j_8_ball: { order: 26, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "8 Ball", pos: { x: 0, y: 5 }, set: "Joker", effect: "Spawn Tarot", cost_mult: 1, config: { extra: 4 } },
            j_misprint: { order: 27, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Misprint", pos: { x: 6, y: 2 }, set: "Joker", effect: "Random Mult", cost_mult: 1, config: { extra: { max: 23, min: 0 } } },
            j_dusk: { order: 28, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Dusk", pos: { x: 4, y: 7 }, set: "Joker", effect: "", config: { extra: 1 }, unlock_condition: { type: "", extra: "", hidden: true } },
            j_raised_fist: { order: 29, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Raised Fist", pos: { x: 8, y: 2 }, set: "Joker", effect: "Socialized Mult", cost_mult: 1, config: {} },
            j_chaos: { order: 30, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Chaos the Clown", pos: { x: 1, y: 0 }, set: "Joker", effect: "Bonus Rerolls", cost_mult: 1, config: { extra: 1 } },
            j_fibonacci: { order: 31, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 8, name: "Fibonacci", pos: { x: 1, y: 5 }, set: "Joker", effect: "Card Mult", cost_mult: 1, config: { extra: 8 } },
            j_steel_joker: { order: 32, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Steel Joker", pos: { x: 7, y: 2 }, set: "Joker", effect: "Steel Card Buff", cost_mult: 1, config: { extra: 0.2 }, enhancement_gate: "m_steel" },
            j_scary_face: { order: 33, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Scary Face", pos: { x: 2, y: 3 }, set: "Joker", effect: "Scary Face Cards", cost_mult: 1, config: { extra: 30 } },
            j_abstract: { order: 34, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Abstract Joker", pos: { x: 3, y: 3 }, set: "Joker", effect: "Joker Mult", cost_mult: 1, config: { extra: 3 } },
            j_delayed_grat: { order: 35, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Delayed Gratification", pos: { x: 4, y: 3 }, set: "Joker", effect: "Discard dollars", cost_mult: 1, config: { extra: 2 } },
            j_hack: { order: 36, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Hack", pos: { x: 5, y: 2 }, set: "Joker", effect: "Low Card double", cost_mult: 1, config: { extra: 1 } },
            j_pareidolia: { order: 37, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Pareidolia", pos: { x: 6, y: 3 }, set: "Joker", effect: "All face cards", cost_mult: 1, config: {} },
            j_gros_michel: { order: 38, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 1, cost: 5, name: "Gros Michel", pos: { x: 7, y: 6 }, set: "Joker", effect: "", config: { extra: { odds: 6, mult: 15 } }, no_pool_flag: "gros_michel_extinct" },
            j_even_steven: { order: 39, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Even Steven", pos: { x: 8, y: 3 }, set: "Joker", effect: "Even Card Buff", cost_mult: 1, config: { extra: 4 } },
            j_odd_todd: { order: 40, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Odd Todd", pos: { x: 9, y: 3 }, set: "Joker", effect: "Odd Card Buff", cost_mult: 1, config: { extra: 31 } },
            j_scholar: { order: 41, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Scholar", pos: { x: 0, y: 4 }, set: "Joker", effect: "Ace Buff", cost_mult: 1, config: { extra: { mult: 4, chips: 20 } } },
            j_business: { order: 42, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Business Card", pos: { x: 1, y: 4 }, set: "Joker", effect: "Face Card dollar Chance", cost_mult: 1, config: { extra: 2 } },
            j_supernova: { order: 43, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Supernova", pos: { x: 2, y: 4 }, set: "Joker", effect: "Hand played mult", cost_mult: 1, config: { extra: 1 } },
            j_ride_the_bus: { order: 44, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 1, cost: 6, name: "Ride the Bus", pos: { x: 1, y: 6 }, set: "Joker", effect: "", config: { extra: 1 }, unlock_condition: { type: "discard_custom" } },
            j_space: { order: 45, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Space Joker", pos: { x: 3, y: 5 }, set: "Joker", effect: "Upgrade Hand chance", cost_mult: 1, config: { extra: 4 } },
            j_egg: { order: 46, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Egg", pos: { x: 0, y: 10 }, set: "Joker", config: { extra: 3 } },
            j_burglar: { order: 47, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Burglar", pos: { x: 1, y: 10 }, set: "Joker", config: { extra: 3 } },
            j_blackboard: { order: 48, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Blackboard", pos: { x: 2, y: 10 }, set: "Joker", config: { extra: 3 } },
            j_runner: { order: 49, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 1, cost: 5, name: "Runner", pos: { x: 3, y: 10 }, set: "Joker", config: { extra: { chips: 0, chip_mod: 15 } } },
            j_ice_cream: { order: 50, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 1, cost: 5, name: "Ice Cream", pos: { x: 4, y: 10 }, set: "Joker", config: { extra: { chips: 100, chip_mod: 5 } } },
            j_dna: { order: 51, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "DNA", pos: { x: 5, y: 10 }, set: "Joker", config: {} },
            j_splash: { order: 52, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 3, name: "Splash", pos: { x: 6, y: 10 }, set: "Joker", config: {} },
            j_blue_joker: { order: 53, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Blue Joker", pos: { x: 7, y: 10 }, set: "Joker", config: { extra: 2 } },
            j_sixth_sense: { order: 54, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Sixth Sense", pos: { x: 8, y: 10 }, set: "Joker", config: {} },
            j_constellation: { order: 55, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Constellation", pos: { x: 9, y: 10 }, set: "Joker", config: { extra: 0.1, Xmult: 1 } },
            j_hiker: { order: 56, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Hiker", pos: { x: 0, y: 11 }, set: "Joker", config: { extra: 5 } },
            j_faceless: { order: 57, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Faceless Joker", pos: { x: 1, y: 11 }, set: "Joker", config: { extra: { dollars: 5, faces: 3 } } },
            j_green_joker: { order: 58, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 1, cost: 4, name: "Green Joker", pos: { x: 2, y: 11 }, set: "Joker", config: { extra: { hand_add: 1, discard_sub: 1 } } },
            j_superposition: { order: 59, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Superposition", pos: { x: 3, y: 11 }, set: "Joker", config: {} },
            j_todo_list: { order: 60, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "To Do List", pos: { x: 4, y: 11 }, set: "Joker", config: { extra: { dollars: 4, poker_hand: "High Card" } } },
            j_cavendish: { order: 61, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 1, cost: 4, name: "Cavendish", pos: { x: 5, y: 11 }, set: "Joker", cost_mult: 1, config: { extra: { odds: 1000, Xmult: 3 } }, yes_pool_flag: "gros_michel_extinct" },
            j_card_sharp: { order: 62, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Card Sharp", pos: { x: 6, y: 11 }, set: "Joker", cost_mult: 1, config: { extra: { Xmult: 3 } } },
            j_red_card: { order: 63, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 1, cost: 5, name: "Red Card", pos: { x: 7, y: 11 }, set: "Joker", cost_mult: 1, config: { extra: 3 } },
            j_madness: { order: 64, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 7, name: "Madness", pos: { x: 8, y: 11 }, set: "Joker", cost_mult: 1, config: { extra: 0.5 } },
            j_square: { order: 65, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 1, cost: 4, name: "Square Joker", pos: { x: 9, y: 11 }, set: "Joker", cost_mult: 1, config: { extra: { chips: 0, chip_mod: 4 } } },
            j_seance: { order: 66, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Seance", pos: { x: 0, y: 12 }, set: "Joker", cost_mult: 1, config: { extra: { poker_hand: "Straight Flush" } } },
            j_riff_raff: { order: 67, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 6, name: "Riff-raff", pos: { x: 1, y: 12 }, set: "Joker", cost_mult: 1, config: { extra: 2 } },
            j_vampire: { order: 68, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 7, name: "Vampire", set: "Joker", config: { extra: 0.1, Xmult: 1 }, pos: { x: 2, y: 12 } },
            j_shortcut: { order: 69, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Shortcut", set: "Joker", config: {}, pos: { x: 3, y: 12 } },
            j_hologram: { order: 70, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 7, name: "Hologram", set: "Joker", config: { extra: 0.25, Xmult: 1 }, pos: { x: 4, y: 12 }, soul_pos: { x: 2, y: 9 } },
            j_vagabond: { order: 71, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "Vagabond", set: "Joker", config: { extra: 4 }, pos: { x: 5, y: 12 } },
            j_baron: { order: 72, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "Baron", set: "Joker", config: { extra: 1.5 }, pos: { x: 6, y: 12 } },
            j_cloud_9: { order: 73, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Cloud 9", set: "Joker", config: { extra: 1 }, pos: { x: 7, y: 12 } },
            j_rocket: { order: 74, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Rocket", set: "Joker", config: { extra: { dollars: 1, increase: 2 } }, pos: { x: 8, y: 12 } },
            j_obelisk: { order: 75, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 3, cost: 8, name: "Obelisk", set: "Joker", config: { extra: 0.2, Xmult: 1 }, pos: { x: 9, y: 12 } },
            j_midas_mask: { order: 76, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Midas Mask", set: "Joker", config: {}, pos: { x: 0, y: 13 } },
            j_luchador: { order: 77, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 2, cost: 5, name: "Luchador", set: "Joker", config: {}, pos: { x: 1, y: 13 } },
            j_photograph: { order: 78, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Photograph", set: "Joker", config: { extra: 2 }, pos: { x: 2, y: 13 } },
            j_gift: { order: 79, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Gift Card", set: "Joker", config: { extra: 1 }, pos: { x: 3, y: 13 } },
            j_turtle_bean: { order: 80, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: false, rarity: 2, cost: 6, name: "Turtle Bean", set: "Joker", config: { extra: { h_size: 5, h_mod: 1 } }, pos: { x: 4, y: 13 } },
            j_erosion: { order: 81, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Erosion", set: "Joker", config: { extra: 4 }, pos: { x: 5, y: 13 } },
            j_reserved_parking: { order: 82, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 6, name: "Reserved Parking", set: "Joker", config: { extra: { odds: 2, dollars: 1 } }, pos: { x: 6, y: 13 } },
            j_mail: { order: 83, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Mail-In Rebate", set: "Joker", config: { extra: 5 }, pos: { x: 7, y: 13 } },
            j_to_the_moon: { order: 84, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "To the Moon", set: "Joker", config: { extra: 1 }, pos: { x: 8, y: 13 } },
            j_hallucination: { order: 85, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Hallucination", set: "Joker", config: { extra: 2 }, pos: { x: 9, y: 13 } },
            j_fortune_teller: { order: 86, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 6, name: "Fortune Teller", pos: { x: 7, y: 5 }, set: "Joker", effect: "", config: { extra: 1 } },
            j_juggler: { order: 87, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Juggler", pos: { x: 0, y: 1 }, set: "Joker", effect: "Hand Size", cost_mult: 1, config: { h_size: 1 } },
            j_drunkard: { order: 88, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Drunkard", pos: { x: 1, y: 1 }, set: "Joker", effect: "Discard Size", cost_mult: 1, config: { d_size: 1 } },
            j_stone: { order: 89, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Stone Joker", pos: { x: 9, y: 0 }, set: "Joker", effect: "Stone Card Buff", cost_mult: 1, config: { extra: 25 }, enhancement_gate: "m_stone" },
            j_golden: { order: 90, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 6, name: "Golden Joker", pos: { x: 9, y: 2 }, set: "Joker", effect: "Bonus dollars", cost_mult: 1, config: { extra: 4 } },
            j_lucky_cat: { order: 91, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Lucky Cat", set: "Joker", config: { Xmult: 1, extra: 0.25 }, pos: { x: 5, y: 14 }, enhancement_gate: "m_lucky" },
            j_baseball: { order: 92, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "Baseball Card", set: "Joker", config: { extra: 1.5 }, pos: { x: 6, y: 14 } },
            j_bull: { order: 93, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Bull", set: "Joker", config: { extra: 2 }, pos: { x: 7, y: 14 } },
            j_diet_cola: { order: 94, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 2, cost: 6, name: "Diet Cola", set: "Joker", config: {}, pos: { x: 8, y: 14 } },
            j_trading: { order: 95, unlocked: true, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Trading Card", set: "Joker", config: { extra: 3 }, pos: { x: 9, y: 14 } },
            j_flash: { order: 96, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 5, name: "Flash Card", set: "Joker", config: { extra: 2, mult: 0 }, pos: { x: 0, y: 15 } },
            j_popcorn: { order: 97, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 1, cost: 5, name: "Popcorn", set: "Joker", config: { mult: 20, extra: 4 }, pos: { x: 1, y: 15 } },
            j_trousers: { order: 98, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Spare Trousers", set: "Joker", config: { extra: 2 }, pos: { x: 4, y: 15 } },
            j_ancient: { order: 99, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "Ancient Joker", set: "Joker", config: { extra: 1.5 }, pos: { x: 7, y: 15 } },
            j_ramen: { order: 100, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 2, cost: 6, name: "Ramen", set: "Joker", config: { Xmult: 2, extra: 0.01 }, pos: { x: 2, y: 15 } },
            j_walkie_talkie: { order: 101, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Walkie Talkie", set: "Joker", config: { extra: { chips: 10, mult: 4 } }, pos: { x: 8, y: 15 } },
            j_selzer: { order: 102, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: false, rarity: 2, cost: 6, name: "Seltzer", set: "Joker", config: { extra: 10 }, pos: { x: 3, y: 15 } },
            j_castle: { order: 103, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Castle", set: "Joker", config: { extra: { chips: 0, chip_mod: 3 } }, pos: { x: 9, y: 15 } },
            j_smiley: { order: 104, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Smiley Face", set: "Joker", config: { extra: 5 }, pos: { x: 6, y: 15 } },
            j_campfire: { order: 105, unlocked: true, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 9, name: "Campfire", set: "Joker", config: { extra: 0.25 }, pos: { x: 5, y: 15 } },
            j_ticket: { order: 106, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Golden Ticket", pos: { x: 5, y: 3 }, set: "Joker", effect: "dollars for Gold cards", cost_mult: 1, config: { extra: 4 }, unlock_condition: { type: "hand_contents", extra: "Gold" }, enhancement_gate: "m_gold" },
            j_mr_bones: { order: 107, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: false, rarity: 2, cost: 5, name: "Mr. Bones", pos: { x: 3, y: 4 }, set: "Joker", effect: "Prevent Death", cost_mult: 1, config: {}, unlock_condition: { type: "c_losses", extra: 5 } },
            j_acrobat: { order: 108, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Acrobat", pos: { x: 2, y: 1 }, set: "Joker", effect: "Shop size", cost_mult: 1, config: { extra: 3 }, unlock_condition: { type: "c_hands_played", extra: 200 } },
            j_sock_and_buskin: { order: 109, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Sock and Buskin", pos: { x: 3, y: 1 }, set: "Joker", effect: "Face card double", cost_mult: 1, config: { extra: 1 }, unlock_condition: { type: "c_face_cards_played", extra: 300 } },
            j_swashbuckler: { order: 110, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Swashbuckler", pos: { x: 9, y: 5 }, set: "Joker", effect: "Set Mult", cost_mult: 1, config: { mult: 1 }, unlock_condition: { type: "c_jokers_sold", extra: 20 } },
            j_troubadour: { order: 111, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Troubadour", pos: { x: 0, y: 2 }, set: "Joker", effect: "Hand Size, Plays", cost_mult: 1, config: { extra: { h_size: 2, h_plays: -1 } }, unlock_condition: { type: "round_win", extra: 5 } },
            j_certificate: { order: 112, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Certificate", pos: { x: 8, y: 8 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "double_gold" } },
            j_smeared: { order: 113, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Smeared Joker", pos: { x: 4, y: 6 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "modify_deck", extra: { count: 3, enhancement: "Wild Card", e_key: "m_wild" } } },
            j_throwback: { order: 114, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Throwback", pos: { x: 5, y: 7 }, set: "Joker", effect: "", config: { extra: 0.25 }, unlock_condition: { type: "continue_game" } },
            j_hanging_chad: { order: 115, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 4, name: "Hanging Chad", pos: { x: 9, y: 6 }, set: "Joker", effect: "", config: { extra: 2 }, unlock_condition: { type: "round_win", extra: "High Card" } },
            j_rough_gem: { order: 116, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Rough Gem", pos: { x: 9, y: 7 }, set: "Joker", effect: "", config: { extra: 1 }, unlock_condition: { type: "modify_deck", extra: { count: 30, suit: "Diamonds" } } },
            j_bloodstone: { order: 117, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Bloodstone", pos: { x: 0, y: 8 }, set: "Joker", effect: "", config: { extra: { odds: 2, Xmult: 1.5 } }, unlock_condition: { type: "modify_deck", extra: { count: 30, suit: "Hearts" } } },
            j_arrowhead: { order: 118, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Arrowhead", pos: { x: 1, y: 8 }, set: "Joker", effect: "", config: { extra: 50 }, unlock_condition: { type: "modify_deck", extra: { count: 30, suit: "Spades" } } },
            j_onyx_agate: { order: 119, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Onyx Agate", pos: { x: 2, y: 8 }, set: "Joker", effect: "", config: { extra: 7 }, unlock_condition: { type: "modify_deck", extra: { count: 30, suit: "Clubs" } } },
            j_glass: { order: 120, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 2, cost: 6, name: "Glass Joker", pos: { x: 1, y: 3 }, set: "Joker", effect: "Glass Card", cost_mult: 1, config: { extra: 0.75, Xmult: 1 }, unlock_condition: { type: "modify_deck", extra: { count: 5, enhancement: "Glass Card", e_key: "m_glass" } }, enhancement_gate: "m_glass" },
            j_ring_master: { order: 121, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 5, name: "Showman", pos: { x: 6, y: 5 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "ante_up", ante: 4 } },
            j_flower_pot: { order: 122, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Flower Pot", pos: { x: 0, y: 6 }, set: "Joker", effect: "", config: { extra: 3 }, unlock_condition: { type: "ante_up", ante: 8 } },
            j_blueprint: { order: 123, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 10, name: "Blueprint", pos: { x: 0, y: 3 }, set: "Joker", effect: "Copycat", cost_mult: 1, config: {}, unlock_condition: { type: "win_custom" } },
            j_wee: { order: 124, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: false, eternal_compat: true, rarity: 3, cost: 8, name: "Wee Joker", pos: { x: 0, y: 0 }, set: "Joker", effect: "", config: { extra: { chips: 0, chip_mod: 8 } }, unlock_condition: { type: "win", n_rounds: 18 } },
            j_merry_andy: { order: 125, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Merry Andy", pos: { x: 8, y: 0 }, set: "Joker", effect: "", cost_mult: 1, config: { d_size: 3, h_size: -1 }, unlock_condition: { type: "win", n_rounds: 12 } },
            j_oops: { order: 126, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 4, name: "Oops! All 6s", pos: { x: 5, y: 6 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "chip_score", chips: 10000 } },
            j_idol: { order: 127, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "The Idol", pos: { x: 6, y: 7 }, set: "Joker", effect: "", config: { extra: 2 }, unlock_condition: { type: "chip_score", chips: 1000000 } },
            j_seeing_double: { order: 128, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Seeing Double", pos: { x: 4, y: 4 }, set: "Joker", effect: "X1.5 Mult club 7", cost_mult: 1, config: { extra: 2 }, unlock_condition: { type: "hand_contents", extra: "four 7 of Clubs" } },
            j_matador: { order: 129, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Matador", pos: { x: 4, y: 5 }, set: "Joker", effect: "", config: { extra: 8 }, unlock_condition: { type: "round_win" } },
            j_hit_the_road: { order: 130, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "Hit the Road", pos: { x: 8, y: 5 }, set: "Joker", effect: "Jack Discard Effect", cost_mult: 1, config: { extra: 0.5 }, unlock_condition: { type: "discard_custom" } },
            j_duo: { order: 131, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "The Duo", pos: { x: 5, y: 4 }, set: "Joker", effect: "X1.5 Mult", cost_mult: 1, config: { Xmult: 2, type: "Pair" }, unlock_condition: { type: "win_no_hand", extra: "Pair" } },
            j_trio: { order: 132, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "The Trio", pos: { x: 6, y: 4 }, set: "Joker", effect: "X2 Mult", cost_mult: 1, config: { Xmult: 3, type: "Three of a Kind" }, unlock_condition: { type: "win_no_hand", extra: "Three of a Kind" } },
            j_family: { order: 133, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "The Family", pos: { x: 7, y: 4 }, set: "Joker", effect: "X3 Mult", cost_mult: 1, config: { Xmult: 4, type: "Four of a Kind" }, unlock_condition: { type: "win_no_hand", extra: "Four of a Kind" } },
            j_order: { order: 134, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "The Order", pos: { x: 8, y: 4 }, set: "Joker", effect: "X3 Mult", cost_mult: 1, config: { Xmult: 3, type: "Straight" }, unlock_condition: { type: "win_no_hand", extra: "Straight" } },
            j_tribe: { order: 135, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "The Tribe", pos: { x: 9, y: 4 }, set: "Joker", effect: "X3 Mult", cost_mult: 1, config: { Xmult: 2, type: "Flush" }, unlock_condition: { type: "win_no_hand", extra: "Flush" } },
            j_stuntman: { order: 136, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 7, name: "Stuntman", pos: { x: 8, y: 6 }, set: "Joker", effect: "", config: { extra: { h_size: 2, chip_mod: 250 } }, unlock_condition: { type: "chip_score", chips: 100000000 } },
            j_invisible: { order: 137, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: false, rarity: 3, cost: 8, name: "Invisible Joker", pos: { x: 1, y: 7 }, set: "Joker", effect: "", config: { extra: 2 }, unlock_condition: { type: "win_custom" } },
            j_brainstorm: { order: 138, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 10, name: "Brainstorm", pos: { x: 7, y: 7 }, set: "Joker", effect: "Copycat", config: {}, unlock_condition: { type: "discard_custom" } },
            j_satellite: { order: 139, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Satellite", pos: { x: 8, y: 7 }, set: "Joker", effect: "", config: { extra: 1 }, unlock_condition: { type: "money", extra: 400 } },
            j_shoot_the_moon: { order: 140, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 1, cost: 5, name: "Shoot the Moon", pos: { x: 2, y: 6 }, set: "Joker", effect: "", config: { extra: 13 }, unlock_condition: { type: "play_all_hearts" } },
            j_drivers_license: { order: 141, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 7, name: "Driver's License", pos: { x: 0, y: 7 }, set: "Joker", effect: "", config: { extra: 3 }, unlock_condition: { type: "modify_deck", extra: { count: 16, tally: "total" } } },
            j_cartomancer: { order: 142, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 6, name: "Cartomancer", pos: { x: 7, y: 3 }, set: "Joker", effect: "Tarot Buff", cost_mult: 1, config: {}, unlock_condition: { type: "discover_amount", tarot_count: 22 } },
            j_astronomer: { order: 143, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 8, name: "Astronomer", pos: { x: 2, y: 7 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "discover_amount", planet_count: 12 } },
            j_burnt: { order: 144, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 3, cost: 8, name: "Burnt Joker", pos: { x: 3, y: 7 }, set: "Joker", effect: "", config: { h_size: 0, extra: 4 }, unlock_condition: { type: "c_cards_sold", extra: 50 } },
            j_bootstraps: { order: 145, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 2, cost: 7, name: "Bootstraps", pos: { x: 9, y: 8 }, set: "Joker", effect: "", config: { extra: { mult: 2, dollars: 5 } }, unlock_condition: { type: "modify_jokers", extra: { polychrome: true, count: 2 } } },
            j_caino: { order: 146, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 4, cost: 20, name: "Caino", pos: { x: 3, y: 8 }, soul_pos: { x: 3, y: 9 }, set: "Joker", effect: "", config: { extra: 1 }, unlock_condition: { type: "", extra: "", hidden: true } },
            j_triboulet: { order: 147, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 4, cost: 20, name: "Triboulet", pos: { x: 4, y: 8 }, soul_pos: { x: 4, y: 9 }, set: "Joker", effect: "", config: { extra: 2 }, unlock_condition: { type: "", extra: "", hidden: true } },
            j_yorick: { order: 148, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 4, cost: 20, name: "Yorick", pos: { x: 5, y: 8 }, soul_pos: { x: 5, y: 9 }, set: "Joker", effect: "", config: { extra: { xmult: 1, discards: 23 } }, unlock_condition: { type: "", extra: "", hidden: true } },
            j_chicot: { order: 149, unlocked: false, discovered: false, blueprint_compat: false, perishable_compat: true, eternal_compat: true, rarity: 4, cost: 20, name: "Chicot", pos: { x: 6, y: 8 }, soul_pos: { x: 6, y: 9 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "", extra: "", hidden: true } },
            j_perkeo: { order: 150, unlocked: false, discovered: false, blueprint_compat: true, perishable_compat: true, eternal_compat: true, rarity: 4, cost: 20, name: "Perkeo", pos: { x: 7, y: 8 }, soul_pos: { x: 7, y: 9 }, set: "Joker", effect: "", config: {}, unlock_condition: { type: "", extra: "", hidden: true } },
            c_fool: { order: 1, discovered: false, cost: 3, consumeable: true, name: "The Fool", pos: { x: 0, y: 0 }, set: "Tarot", effect: "Disable Blind Effect", cost_mult: 1, config: {} },
            c_magician: { order: 2, discovered: false, cost: 3, consumeable: true, name: "The Magician", pos: { x: 1, y: 0 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_lucky", max_highlighted: 2 } },
            c_high_priestess: { order: 3, discovered: false, cost: 3, consumeable: true, name: "The High Priestess", pos: { x: 2, y: 0 }, set: "Tarot", effect: "Round Bonus", cost_mult: 1, config: { planets: 2 } },
            c_empress: { order: 4, discovered: false, cost: 3, consumeable: true, name: "The Empress", pos: { x: 3, y: 0 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_mult", max_highlighted: 2 } },
            c_emperor: { order: 5, discovered: false, cost: 3, consumeable: true, name: "The Emperor", pos: { x: 4, y: 0 }, set: "Tarot", effect: "Round Bonus", cost_mult: 1, config: { tarots: 2 } },
            c_heirophant: { order: 6, discovered: false, cost: 3, consumeable: true, name: "The Hierophant", pos: { x: 5, y: 0 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_bonus", max_highlighted: 2 } },
            c_lovers: { order: 7, discovered: false, cost: 3, consumeable: true, name: "The Lovers", pos: { x: 6, y: 0 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_wild", max_highlighted: 1 } },
            c_chariot: { order: 8, discovered: false, cost: 3, consumeable: true, name: "The Chariot", pos: { x: 7, y: 0 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_steel", max_highlighted: 1 } },
            c_justice: { order: 9, discovered: false, cost: 3, consumeable: true, name: "Justice", pos: { x: 8, y: 0 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_glass", max_highlighted: 1 } },
            c_hermit: { order: 10, discovered: false, cost: 3, consumeable: true, name: "The Hermit", pos: { x: 9, y: 0 }, set: "Tarot", effect: "Dollar Doubler", cost_mult: 1, config: { extra: 20 } },
            c_wheel_of_fortune: { order: 11, discovered: false, cost: 3, consumeable: true, name: "The Wheel of Fortune", pos: { x: 0, y: 1 }, set: "Tarot", effect: "Round Bonus", cost_mult: 1, config: { extra: 4 } },
            c_strength: { order: 12, discovered: false, cost: 3, consumeable: true, name: "Strength", pos: { x: 1, y: 1 }, set: "Tarot", effect: "Round Bonus", cost_mult: 1, config: { mod_conv: "up_rank", max_highlighted: 2 } },
            c_hanged_man: { order: 13, discovered: false, cost: 3, consumeable: true, name: "The Hanged Man", pos: { x: 2, y: 1 }, set: "Tarot", effect: "Card Removal", cost_mult: 1, config: { remove_card: true, max_highlighted: 2 } },
            c_death: { order: 14, discovered: false, cost: 3, consumeable: true, name: "Death", pos: { x: 3, y: 1 }, set: "Tarot", effect: "Card Conversion", cost_mult: 1, config: { mod_conv: "card", max_highlighted: 2, min_highlighted: 2 } },
            c_temperance: { order: 15, discovered: false, cost: 3, consumeable: true, name: "Temperance", pos: { x: 4, y: 1 }, set: "Tarot", effect: "Joker Payout", cost_mult: 1, config: { extra: 50 } },
            c_devil: { order: 16, discovered: false, cost: 3, consumeable: true, name: "The Devil", pos: { x: 5, y: 1 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_gold", max_highlighted: 1 } },
            c_tower: { order: 17, discovered: false, cost: 3, consumeable: true, name: "The Tower", pos: { x: 6, y: 1 }, set: "Tarot", effect: "Enhance", cost_mult: 1, config: { mod_conv: "m_stone", max_highlighted: 1 } },
            c_star: { order: 18, discovered: false, cost: 3, consumeable: true, name: "The Star", pos: { x: 7, y: 1 }, set: "Tarot", effect: "Suit Conversion", cost_mult: 1, config: { suit_conv: "Diamonds", max_highlighted: 3 } },
            c_moon: { order: 19, discovered: false, cost: 3, consumeable: true, name: "The Moon", pos: { x: 8, y: 1 }, set: "Tarot", effect: "Suit Conversion", cost_mult: 1, config: { suit_conv: "Clubs", max_highlighted: 3 } },
            c_sun: { order: 20, discovered: false, cost: 3, consumeable: true, name: "The Sun", pos: { x: 9, y: 1 }, set: "Tarot", effect: "Suit Conversion", cost_mult: 1, config: { suit_conv: "Hearts", max_highlighted: 3 } },
            c_judgement: { order: 21, discovered: false, cost: 3, consumeable: true, name: "Judgement", pos: { x: 0, y: 2 }, set: "Tarot", effect: "Random Joker", cost_mult: 1, config: {} },
            c_world: { order: 22, discovered: false, cost: 3, consumeable: true, name: "The World", pos: { x: 1, y: 2 }, set: "Tarot", effect: "Suit Conversion", cost_mult: 1, config: { suit_conv: "Spades", max_highlighted: 3 } },
            c_mercury: { order: 1, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Mercury", pos: { x: 0, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Pair" } },
            c_venus: { order: 2, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Venus", pos: { x: 1, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Three of a Kind" } },
            c_earth: { order: 3, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Earth", pos: { x: 2, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Full House" } },
            c_mars: { order: 4, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Mars", pos: { x: 3, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Four of a Kind" } },
            c_jupiter: { order: 5, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Jupiter", pos: { x: 4, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Flush" } },
            c_saturn: { order: 6, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Saturn", pos: { x: 5, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Straight" } },
            c_uranus: { order: 7, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Uranus", pos: { x: 6, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Two Pair" } },
            c_neptune: { order: 8, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Neptune", pos: { x: 7, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Straight Flush" } },
            c_pluto: { order: 9, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Pluto", pos: { x: 8, y: 3 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "High Card" } },
            c_planet_x: { order: 10, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Planet X", pos: { x: 9, y: 2 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Five of a Kind", softlock: true } },
            c_ceres: { order: 11, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Ceres", pos: { x: 8, y: 2 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Flush House", softlock: true } },
            c_eris: { order: 12, discovered: false, cost: 3, consumeable: true, freq: 1, name: "Eris", pos: { x: 3, y: 2 }, set: "Planet", effect: "Hand Upgrade", cost_mult: 1, config: { hand_type: "Flush Five", softlock: true } },
            c_familiar: { order: 1, discovered: false, cost: 4, consumeable: true, name: "Familiar", pos: { x: 0, y: 4 }, set: "Spectral", config: { remove_card: true, extra: 3 } },
            c_grim: { order: 2, discovered: false, cost: 4, consumeable: true, name: "Grim", pos: { x: 1, y: 4 }, set: "Spectral", config: { remove_card: true, extra: 2 } },
            c_incantation: { order: 3, discovered: false, cost: 4, consumeable: true, name: "Incantation", pos: { x: 2, y: 4 }, set: "Spectral", config: { remove_card: true, extra: 4 } },
            c_talisman: { order: 4, discovered: false, cost: 4, consumeable: true, name: "Talisman", pos: { x: 3, y: 4 }, set: "Spectral", config: { extra: "Gold", max_highlighted: 1 } },
            c_aura: { order: 5, discovered: false, cost: 4, consumeable: true, name: "Aura", pos: { x: 4, y: 4 }, set: "Spectral", config: {} },
            c_wraith: { order: 6, discovered: false, cost: 4, consumeable: true, name: "Wraith", pos: { x: 5, y: 4 }, set: "Spectral", config: {} },
            c_sigil: { order: 7, discovered: false, cost: 4, consumeable: true, name: "Sigil", pos: { x: 6, y: 4 }, set: "Spectral", config: {} },
            c_ouija: { order: 8, discovered: false, cost: 4, consumeable: true, name: "Ouija", pos: { x: 7, y: 4 }, set: "Spectral", config: {} },
            c_ectoplasm: { order: 9, discovered: false, cost: 4, consumeable: true, name: "Ectoplasm", pos: { x: 8, y: 4 }, set: "Spectral", config: {} },
            c_immolate: { order: 10, discovered: false, cost: 4, consumeable: true, name: "Immolate", pos: { x: 9, y: 4 }, set: "Spectral", config: { remove_card: true, extra: { destroy: 5, dollars: 20 } } },
            c_ankh: { order: 11, discovered: false, cost: 4, consumeable: true, name: "Ankh", pos: { x: 0, y: 5 }, set: "Spectral", config: { extra: 2 } },
            c_deja_vu: { order: 12, discovered: false, cost: 4, consumeable: true, name: "Deja Vu", pos: { x: 1, y: 5 }, set: "Spectral", config: { extra: "Red", max_highlighted: 1 } },
            c_hex: { order: 13, discovered: false, cost: 4, consumeable: true, name: "Hex", pos: { x: 2, y: 5 }, set: "Spectral", config: { extra: 2 } },
            c_trance: { order: 14, discovered: false, cost: 4, consumeable: true, name: "Trance", pos: { x: 3, y: 5 }, set: "Spectral", config: { extra: "Blue", max_highlighted: 1 } },
            c_medium: { order: 15, discovered: false, cost: 4, consumeable: true, name: "Medium", pos: { x: 4, y: 5 }, set: "Spectral", config: { extra: "Purple", max_highlighted: 1 } },
            c_cryptid: { order: 16, discovered: false, cost: 4, consumeable: true, name: "Cryptid", pos: { x: 5, y: 5 }, set: "Spectral", config: { extra: 2, max_highlighted: 1 } },
            c_soul: { order: 17, discovered: false, cost: 4, consumeable: true, name: "The Soul", pos: { x: 2, y: 2 }, set: "Spectral", effect: "Unlocker", config: {}, hidden: true },
            c_black_hole: { order: 18, discovered: false, cost: 4, consumeable: true, name: "Black Hole", pos: { x: 9, y: 3 }, set: "Spectral", config: {}, hidden: true },
            v_overstock_norm: { order: 1, discovered: false, unlocked: true, available: true, cost: 10, name: "Overstock", pos: { x: 0, y: 0 }, set: "Voucher", config: {} },
            v_clearance_sale: { order: 3, discovered: false, unlocked: true, available: true, cost: 10, name: "Clearance Sale", pos: { x: 3, y: 0 }, set: "Voucher", config: { extra: 25 } },
            v_hone: { order: 5, discovered: false, unlocked: true, available: true, cost: 10, name: "Hone", pos: { x: 4, y: 0 }, set: "Voucher", config: { extra: 2 } },
            v_reroll_surplus: { order: 7, discovered: false, unlocked: true, available: true, cost: 10, name: "Reroll Surplus", pos: { x: 0, y: 2 }, set: "Voucher", config: { extra: 2 } },
            v_crystal_ball: { order: 9, discovered: false, unlocked: true, available: true, cost: 10, name: "Crystal Ball", pos: { x: 2, y: 2 }, set: "Voucher", config: { extra: 3 } },
            v_telescope: { order: 11, discovered: false, unlocked: true, available: true, cost: 10, name: "Telescope", pos: { x: 3, y: 2 }, set: "Voucher", config: { extra: 3 } },
            v_grabber: { order: 13, discovered: false, unlocked: true, available: true, cost: 10, name: "Grabber", pos: { x: 5, y: 0 }, set: "Voucher", config: { extra: 1 } },
            v_wasteful: { order: 15, discovered: false, unlocked: true, available: true, cost: 10, name: "Wasteful", pos: { x: 6, y: 0 }, set: "Voucher", config: { extra: 1 } },
            v_tarot_merchant: { order: 17, discovered: false, unlocked: true, available: true, cost: 10, name: "Tarot Merchant", pos: { x: 1, y: 0 }, set: "Voucher", config: { extra: 9.6 / 4, extra_disp: 2 } },
            v_planet_merchant: { order: 19, discovered: false, unlocked: true, available: true, cost: 10, name: "Planet Merchant", pos: { x: 2, y: 0 }, set: "Voucher", config: { extra: 9.6 / 4, extra_disp: 2 } },
            v_seed_money: { order: 21, discovered: false, unlocked: true, available: true, cost: 10, name: "Seed Money", pos: { x: 1, y: 2 }, set: "Voucher", config: { extra: 50 } },
            v_blank: { order: 23, discovered: false, unlocked: true, available: true, cost: 10, name: "Blank", pos: { x: 7, y: 0 }, set: "Voucher", config: { extra: 5 } },
            v_magic_trick: { order: 25, discovered: false, unlocked: true, available: true, cost: 10, name: "Magic Trick", pos: { x: 4, y: 2 }, set: "Voucher", config: { extra: 4 } },
            v_hieroglyph: { order: 27, discovered: false, unlocked: true, available: true, cost: 10, name: "Hieroglyph", pos: { x: 5, y: 2 }, set: "Voucher", config: { extra: 1 } },
            v_directors_cut: { order: 29, discovered: false, unlocked: true, available: true, cost: 10, name: "Director's Cut", pos: { x: 6, y: 2 }, set: "Voucher", config: { extra: 10 } },
            v_paint_brush: { order: 31, discovered: false, unlocked: true, available: true, cost: 10, name: "Paint Brush", pos: { x: 7, y: 2 }, set: "Voucher", config: { extra: 1 } },
            v_overstock_plus: { order: 2, discovered: false, unlocked: false, available: true, cost: 10, name: "Overstock Plus", pos: { x: 0, y: 1 }, set: "Voucher", config: {}, requires: ["v_overstock_norm"], unlock_condition: { type: "c_shop_dollars_spent", extra: 2500 } },
            v_liquidation: { order: 4, discovered: false, unlocked: false, available: true, cost: 10, name: "Liquidation", pos: { x: 3, y: 1 }, set: "Voucher", config: { extra: 50 }, requires: ["v_clearance_sale"], unlock_condition: { type: "run_redeem", extra: 10 } },
            v_glow_up: { order: 6, discovered: false, unlocked: false, available: true, cost: 10, name: "Glow Up", pos: { x: 4, y: 1 }, set: "Voucher", config: { extra: 4 }, requires: ["v_hone"], unlock_condition: { type: "have_edition", extra: 5 } },
            v_reroll_glut: { order: 8, discovered: false, unlocked: false, available: true, cost: 10, name: "Reroll Glut", pos: { x: 0, y: 3 }, set: "Voucher", config: { extra: 2 }, requires: ["v_reroll_surplus"], unlock_condition: { type: "c_shop_rerolls", extra: 100 } },
            v_omen_globe: { order: 10, discovered: false, unlocked: false, available: true, cost: 10, name: "Omen Globe", pos: { x: 2, y: 3 }, set: "Voucher", config: { extra: 4 }, requires: ["v_crystal_ball"], unlock_condition: { type: "c_tarot_reading_used", extra: 25 } },
            v_observatory: { order: 12, discovered: false, unlocked: false, available: true, cost: 10, name: "Observatory", pos: { x: 3, y: 3 }, set: "Voucher", config: { extra: 1.5 }, requires: ["v_telescope"], unlock_condition: { type: "c_planetarium_used", extra: 25 } },
            v_nacho_tong: { order: 14, discovered: false, unlocked: false, available: true, cost: 10, name: "Nacho Tong", pos: { x: 5, y: 1 }, set: "Voucher", config: { extra: 1 }, requires: ["v_grabber"], unlock_condition: { type: "c_cards_played", extra: 2500 } },
            v_recyclomancy: { order: 16, discovered: false, unlocked: false, available: true, cost: 10, name: "Recyclomancy", pos: { x: 6, y: 1 }, set: "Voucher", config: { extra: 1 }, requires: ["v_wasteful"], unlock_condition: { type: "c_cards_discarded", extra: 2500 } },
            v_tarot_tycoon: { order: 18, discovered: false, unlocked: false, available: true, cost: 10, name: "Tarot Tycoon", pos: { x: 1, y: 1 }, set: "Voucher", config: { extra: 32 / 4, extra_disp: 4 }, requires: ["v_tarot_merchant"], unlock_condition: { type: "c_tarots_bought", extra: 50 } },
            v_planet_tycoon: { order: 20, discovered: false, unlocked: false, available: true, cost: 10, name: "Planet Tycoon", pos: { x: 2, y: 1 }, set: "Voucher", config: { extra: 32 / 4, extra_disp: 4 }, requires: ["v_planet_merchant"], unlock_condition: { type: "c_planets_bought", extra: 50 } },
            v_money_tree: { order: 22, discovered: false, unlocked: false, available: true, cost: 10, name: "Money Tree", pos: { x: 1, y: 3 }, set: "Voucher", config: { extra: 100 }, requires: ["v_seed_money"], unlock_condition: { type: "interest_streak", extra: 10 } },
            v_antimatter: { order: 24, discovered: false, unlocked: false, available: true, cost: 10, name: "Antimatter", pos: { x: 7, y: 1 }, set: "Voucher", config: { extra: 15 }, requires: ["v_blank"], unlock_condition: { type: "blank_redeems", extra: 10 } },
            v_illusion: { order: 26, discovered: false, unlocked: false, available: true, cost: 10, name: "Illusion", pos: { x: 4, y: 3 }, set: "Voucher", config: { extra: 4 }, requires: ["v_magic_trick"], unlock_condition: { type: "c_playing_cards_bought", extra: 20 } },
            v_petroglyph: { order: 28, discovered: false, unlocked: false, available: true, cost: 10, name: "Petroglyph", pos: { x: 5, y: 3 }, set: "Voucher", config: { extra: 1 }, requires: ["v_hieroglyph"], unlock_condition: { type: "ante_up", ante: 12, extra: 12 } },
            v_retcon: { order: 30, discovered: false, unlocked: false, available: true, cost: 10, name: "Retcon", pos: { x: 6, y: 3 }, set: "Voucher", config: { extra: 10 }, requires: ["v_directors_cut"], unlock_condition: { type: "blind_discoveries", extra: 25 } },
            v_palette: { order: 32, discovered: false, unlocked: false, available: true, cost: 10, name: "Palette", pos: { x: 7, y: 3 }, set: "Voucher", config: { extra: 1 }, requires: ["v_paint_brush"], unlock_condition: { type: "min_hand_size", extra: 5 } },
            b_red: { name: "Red Deck", stake: 1, unlocked: true, order: 1, pos: { x: 0, y: 0 }, set: "Back", config: { discards: 1 }, discovered: true },
            b_blue: { name: "Blue Deck", stake: 1, unlocked: false, order: 2, pos: { x: 0, y: 2 }, set: "Back", config: { hands: 1 }, unlock_condition: { type: "discover_amount", amount: 20 } },
            b_yellow: { name: "Yellow Deck", stake: 1, unlocked: false, order: 3, pos: { x: 1, y: 2 }, set: "Back", config: { dollars: 10 }, unlock_condition: { type: "discover_amount", amount: 50 } },
            b_green: { name: "Green Deck", stake: 1, unlocked: false, order: 4, pos: { x: 2, y: 2 }, set: "Back", config: { extra_hand_bonus: 2, extra_discard_bonus: 1, no_interest: true }, unlock_condition: { type: "discover_amount", amount: 75 } },
            b_black: { name: "Black Deck", stake: 1, unlocked: false, order: 5, pos: { x: 3, y: 2 }, set: "Back", config: { hands: -1, joker_slot: 1 }, unlock_condition: { type: "discover_amount", amount: 100 } },
            b_magic: { name: "Magic Deck", stake: 1, unlocked: false, order: 6, pos: { x: 0, y: 3 }, set: "Back", config: { voucher: "v_crystal_ball", consumables: ["c_fool", "c_fool"] }, unlock_condition: { type: "win_deck", deck: "b_red" } },
            b_nebula: { name: "Nebula Deck", stake: 1, unlocked: false, order: 7, pos: { x: 3, y: 0 }, set: "Back", config: { voucher: "v_telescope", consumable_slot: -1 }, unlock_condition: { type: "win_deck", deck: "b_blue" } },
            b_ghost: { name: "Ghost Deck", stake: 1, unlocked: false, order: 8, pos: { x: 6, y: 2 }, set: "Back", config: { spectral_rate: 2, consumables: ["c_hex"] }, unlock_condition: { type: "win_deck", deck: "b_yellow" } },
            b_abandoned: { name: "Abandoned Deck", stake: 1, unlocked: false, order: 9, pos: { x: 3, y: 3 }, set: "Back", config: { remove_faces: true }, unlock_condition: { type: "win_deck", deck: "b_green" } },
            b_checkered: { name: "Checkered Deck", stake: 1, unlocked: false, order: 10, pos: { x: 1, y: 3 }, set: "Back", config: {}, unlock_condition: { type: "win_deck", deck: "b_black" } },
            b_zodiac: { name: "Zodiac Deck", stake: 1, unlocked: false, order: 11, pos: { x: 3, y: 4 }, set: "Back", config: { vouchers: ["v_tarot_merchant", "v_planet_merchant", "v_overstock_norm"] }, unlock_condition: { type: "win_stake", stake: 2 } },
            b_painted: { name: "Painted Deck", stake: 1, unlocked: false, order: 12, pos: { x: 4, y: 3 }, set: "Back", config: { hand_size: 2, joker_slot: -1 }, unlock_condition: { type: "win_stake", stake: 3 } },
            b_anaglyph: { name: "Anaglyph Deck", stake: 1, unlocked: false, order: 13, pos: { x: 2, y: 4 }, set: "Back", config: {}, unlock_condition: { type: "win_stake", stake: 4 } },
            b_plasma: { name: "Plasma Deck", stake: 1, unlocked: false, order: 14, pos: { x: 4, y: 2 }, set: "Back", config: { ante_scaling: 2 }, unlock_condition: { type: "win_stake", stake: 5 } },
            b_erratic: { name: "Erratic Deck", stake: 1, unlocked: false, order: 15, pos: { x: 2, y: 3 }, set: "Back", config: { randomize_rank_suit: true }, unlock_condition: { type: "win_stake", stake: 7 } },
            b_challenge: { name: "Challenge Deck", stake: 1, unlocked: true, order: 16, pos: { x: 0, y: 4 }, set: "Back", config: {}, omit: true },
            m_bonus: { max: 500, order: 2, name: "Bonus", set: "Enhanced", pos: { x: 1, y: 1 }, effect: "Bonus Card", label: "Bonus Card", config: { bonus: 30 } },
            m_mult: { max: 500, order: 3, name: "Mult", set: "Enhanced", pos: { x: 2, y: 1 }, effect: "Mult Card", label: "Mult Card", config: { mult: 4 } },
            m_wild: { max: 500, order: 4, name: "Wild Card", set: "Enhanced", pos: { x: 3, y: 1 }, effect: "Wild Card", label: "Wild Card", config: {} },
            m_glass: { max: 500, order: 5, name: "Glass Card", set: "Enhanced", pos: { x: 5, y: 1 }, effect: "Glass Card", label: "Glass Card", config: { Xmult: 2, extra: 4 } },
            m_steel: { max: 500, order: 6, name: "Steel Card", set: "Enhanced", pos: { x: 6, y: 1 }, effect: "Steel Card", label: "Steel Card", config: { h_x_mult: 1.5 } },
            m_stone: { max: 500, order: 7, name: "Stone Card", set: "Enhanced", pos: { x: 5, y: 0 }, effect: "Stone Card", label: "Stone Card", config: { bonus: 50 } },
            m_gold: { max: 500, order: 8, name: "Gold Card", set: "Enhanced", pos: { x: 6, y: 0 }, effect: "Gold Card", label: "Gold Card", config: { h_dollars: 3 } },
            m_lucky: { max: 500, order: 9, name: "Lucky Card", set: "Enhanced", pos: { x: 4, y: 1 }, effect: "Lucky Card", label: "Lucky Card", config: { mult: 20, p_dollars: 20 } },
            e_base: { order: 1, unlocked: true, discovered: false, name: "Base", pos: { x: 0, y: 0 }, atlas: "Joker", set: "Edition", config: {} },
            e_foil: { order: 2, unlocked: true, discovered: false, name: "Foil", pos: { x: 0, y: 0 }, atlas: "Joker", set: "Edition", config: { extra: 50 } },
            e_holo: { order: 3, unlocked: true, discovered: false, name: "Holographic", pos: { x: 0, y: 0 }, atlas: "Joker", set: "Edition", config: { extra: 10 } },
            e_polychrome: { order: 4, unlocked: true, discovered: false, name: "Polychrome", pos: { x: 0, y: 0 }, atlas: "Joker", set: "Edition", config: { extra: 1.5 } },
            e_negative: { order: 5, unlocked: true, discovered: false, name: "Negative", pos: { x: 0, y: 0 }, atlas: "Joker", set: "Edition", config: { extra: 1 } },
            p_arcana_normal_1: { order: 1, discovered: false, name: "Arcana Pack", weight: 1, kind: "Arcana", cost: 4, pos: { x: 0, y: 0 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_arcana_normal_2: { order: 2, discovered: false, name: "Arcana Pack", weight: 1, kind: "Arcana", cost: 4, pos: { x: 1, y: 0 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_arcana_normal_3: { order: 3, discovered: false, name: "Arcana Pack", weight: 1, kind: "Arcana", cost: 4, pos: { x: 2, y: 0 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_arcana_normal_4: { order: 4, discovered: false, name: "Arcana Pack", weight: 1, kind: "Arcana", cost: 4, pos: { x: 3, y: 0 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_arcana_jumbo_1: { order: 5, discovered: false, name: "Jumbo Arcana Pack", weight: 1, kind: "Arcana", cost: 6, pos: { x: 0, y: 2 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 1 } },
            p_arcana_jumbo_2: { order: 6, discovered: false, name: "Jumbo Arcana Pack", weight: 1, kind: "Arcana", cost: 6, pos: { x: 1, y: 2 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 1 } },
            p_arcana_mega_1: { order: 7, discovered: false, name: "Mega Arcana Pack", weight: 0.25, kind: "Arcana", cost: 8, pos: { x: 2, y: 2 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 2 } },
            p_arcana_mega_2: { order: 8, discovered: false, name: "Mega Arcana Pack", weight: 0.25, kind: "Arcana", cost: 8, pos: { x: 3, y: 2 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 2 } },
            p_celestial_normal_1: { order: 9, discovered: false, name: "Celestial Pack", weight: 1, kind: "Celestial", cost: 4, pos: { x: 0, y: 1 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_celestial_normal_2: { order: 10, discovered: false, name: "Celestial Pack", weight: 1, kind: "Celestial", cost: 4, pos: { x: 1, y: 1 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_celestial_normal_3: { order: 11, discovered: false, name: "Celestial Pack", weight: 1, kind: "Celestial", cost: 4, pos: { x: 2, y: 1 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_celestial_normal_4: { order: 12, discovered: false, name: "Celestial Pack", weight: 1, kind: "Celestial", cost: 4, pos: { x: 3, y: 1 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_celestial_jumbo_1: { order: 13, discovered: false, name: "Jumbo Celestial Pack", weight: 1, kind: "Celestial", cost: 6, pos: { x: 0, y: 3 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 1 } },
            p_celestial_jumbo_2: { order: 14, discovered: false, name: "Jumbo Celestial Pack", weight: 1, kind: "Celestial", cost: 6, pos: { x: 1, y: 3 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 1 } },
            p_celestial_mega_1: { order: 15, discovered: false, name: "Mega Celestial Pack", weight: 0.25, kind: "Celestial", cost: 8, pos: { x: 2, y: 3 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 2 } },
            p_celestial_mega_2: { order: 16, discovered: false, name: "Mega Celestial Pack", weight: 0.25, kind: "Celestial", cost: 8, pos: { x: 3, y: 3 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 2 } },
            p_spectral_normal_1: { order: 29, discovered: false, name: "Spectral Pack", weight: 0.3, kind: "Spectral", cost: 4, pos: { x: 0, y: 4 }, atlas: "Booster", set: "Booster", config: { extra: 2, choose: 1 } },
            p_spectral_normal_2: { order: 30, discovered: false, name: "Spectral Pack", weight: 0.3, kind: "Spectral", cost: 4, pos: { x: 1, y: 4 }, atlas: "Booster", set: "Booster", config: { extra: 2, choose: 1 } },
            p_spectral_jumbo_1: { order: 31, discovered: false, name: "Jumbo Spectral Pack", weight: 0.3, kind: "Spectral", cost: 6, pos: { x: 2, y: 4 }, atlas: "Booster", set: "Booster", config: { extra: 4, choose: 1 } },
            p_spectral_mega_1: { order: 32, discovered: false, name: "Mega Spectral Pack", weight: 0.07, kind: "Spectral", cost: 8, pos: { x: 3, y: 4 }, atlas: "Booster", set: "Booster", config: { extra: 4, choose: 2 } },
            p_standard_normal_1: { order: 17, discovered: false, name: "Standard Pack", weight: 1, kind: "Standard", cost: 4, pos: { x: 0, y: 6 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_standard_normal_2: { order: 18, discovered: false, name: "Standard Pack", weight: 1, kind: "Standard", cost: 4, pos: { x: 1, y: 6 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_standard_normal_3: { order: 19, discovered: false, name: "Standard Pack", weight: 1, kind: "Standard", cost: 4, pos: { x: 2, y: 6 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_standard_normal_4: { order: 20, discovered: false, name: "Standard Pack", weight: 1, kind: "Standard", cost: 4, pos: { x: 3, y: 6 }, atlas: "Booster", set: "Booster", config: { extra: 3, choose: 1 } },
            p_standard_jumbo_1: { order: 21, discovered: false, name: "Jumbo Standard Pack", weight: 1, kind: "Standard", cost: 6, pos: { x: 0, y: 7 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 1 } },
            p_standard_jumbo_2: { order: 22, discovered: false, name: "Jumbo Standard Pack", weight: 1, kind: "Standard", cost: 6, pos: { x: 1, y: 7 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 1 } },
            p_standard_mega_1: { order: 23, discovered: false, name: "Mega Standard Pack", weight: 0.25, kind: "Standard", cost: 8, pos: { x: 2, y: 7 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 2 } },
            p_standard_mega_2: { order: 24, discovered: false, name: "Mega Standard Pack", weight: 0.25, kind: "Standard", cost: 8, pos: { x: 3, y: 7 }, atlas: "Booster", set: "Booster", config: { extra: 5, choose: 2 } },
            p_buffoon_normal_1: { order: 25, discovered: false, name: "Buffoon Pack", weight: 0.6, kind: "Buffoon", cost: 4, pos: { x: 0, y: 8 }, atlas: "Booster", set: "Booster", config: { extra: 2, choose: 1 } },
            p_buffoon_normal_2: { order: 26, discovered: false, name: "Buffoon Pack", weight: 0.6, kind: "Buffoon", cost: 4, pos: { x: 1, y: 8 }, atlas: "Booster", set: "Booster", config: { extra: 2, choose: 1 } },
            p_buffoon_jumbo_1: { order: 27, discovered: false, name: "Jumbo Buffoon Pack", weight: 0.6, kind: "Buffoon", cost: 6, pos: { x: 2, y: 8 }, atlas: "Booster", set: "Booster", config: { extra: 4, choose: 1 } },
            p_buffoon_mega_1: { order: 28, discovered: false, name: "Mega Buffoon Pack", weight: 0.15, kind: "Buffoon", cost: 8, pos: { x: 3, y: 8 }, atlas: "Booster", set: "Booster", config: { extra: 4, choose: 2 } },
            soul: { pos: { x: 0, y: 1 } },
            undiscovered_joker: { pos: { x: 5, y: 3 } },
            undiscovered_tarot: { pos: { x: 6, y: 3 } }
        };
        this.P_CENTER_POOLS = { 
            Booster: [],
            Default: [],
            Enhanced: [],
            Edition: [],
            Joker: [],
            Tarot: [],
            Planet: [],
            Tarot_Planet: [],
            Spectral: [],
            Consumeables: [],
            Voucher: [],
            Back: [],
            Tag: [],
            Seal: [],
            Stake: [],
            Demo: []
        };
        this.P_JOKER_RARITY_POOLS = [{}, {}, {}, {}];
        this.P_LOCKED = [];
        this.save_progress();
        let TESTHELPER_unlocks = false;
        if (!love.filesystem.getInfo(G.SETTINGS.profile + "")) {
            love.filesystem.createDirectory(G.SETTINGS.profile + "");
        }
        if (!love.filesystem.getInfo(G.SETTINGS.profile + ("/" + "meta.jkr"))) {
            love.filesystem.append(G.SETTINGS.profile + ("/" + "meta.jkr"), "return {}");
        }
        convert_save_to_meta();
        let meta = STR_UNPACK(get_compressed(G.SETTINGS.profile + ("/" + "meta.jkr")) || "return {}");
        meta.unlocked = meta.unlocked || {};
        meta.discovered = meta.discovered || {};
        meta.alerted = meta.alerted || {};
        for (const [_, t] of [G.P_CENTERS, G.P_BLINDS, G.P_TAGS, G.P_SEALS].entries()) {
            for (const k in t) {
                const v = t[k]
                SMODS._save_d_u(v);
                v._discovered_unlocked_overwritten = true;
            }
        }
        for (const [k, v] of Object.entries(this.P_CENTERS)) {
            if (!v.wip && !v.demo) {
                if (TESTHELPER_unlocks) {
                    v.unlocked = true;
                    v.discovered = true;
                    v.alerted = true;
                }
                if (!v.unlocked && (String.prototype.search.call(k, new RegExp("^j_")) || String.prototype.search.call(k, new RegExp("^b_")) || String.prototype.search.call(k, new RegExp("^v_"))) && meta.unlocked[k]) {
                    v.unlocked = true;
                }
                if (!v.unlocked && (String.prototype.search.call(k, new RegExp("^j_")) || String.prototype.search.call(k, new RegExp("^b_")) || String.prototype.search.call(k, new RegExp("^v_")))) {
                    this.P_LOCKED[this.P_LOCKED.length + 1] = v;
                }
                if (!v.discovered && (String.prototype.search.call(k, new RegExp("^j_")) || String.prototype.search.call(k, new RegExp("^b_")) || String.prototype.search.call(k, new RegExp("^e_")) || String.prototype.search.call(k, new RegExp("^c_")) || String.prototype.search.call(k, new RegExp("^p_")) || String.prototype.search.call(k, new RegExp("^v_"))) && meta.discovered[k]) {
                    v.discovered = true;
                }
                if (v.discovered && meta.alerted[k] || v.set === "Back" || v.start_alerted) {
                    v.alerted = true;
                }
                else {
                    if (v.discovered) {
                        v.alerted = false;
                    }
                }
            }
        }
        Array.prototype.sort.call(this.P_LOCKED, function (a, b) {
            return !a.order || !b.order || a.order < b.order;
        });
        for (const [k, v] of Object.entries(this.P_BLINDS)) {
            v.key = k;
            if (!v.wip && !v.demo) {
                if (TESTHELPER_unlocks) {
                    v.discovered = true;
                    v.alerted = true;
                }
                if (!v.discovered && meta.discovered[k]) {
                    v.discovered = true;
                }
                if (v.discovered && meta.alerted[k]) {
                    v.alerted = true;
                }
                else {
                    if (v.discovered) {
                        v.alerted = false;
                    }
                }
            }
        }
        for (const [k, v] of Object.entries(this.P_TAGS)) {
            v.key = k;
            if (!v.wip && !v.demo) {
                if (TESTHELPER_unlocks) {
                    v.discovered = true;
                    v.alerted = true;
                }
                if (!v.discovered && meta.discovered[k]) {
                    v.discovered = true;
                }
                if (v.discovered && meta.alerted[k]) {
                    v.alerted = true;
                }
                else {
                    if (v.discovered) {
                        v.alerted = false;
                    }
                }
                Array.prototype.push.call(this.P_CENTER_POOLS["Tag"], v);
            }
        }
        for (const [k, v] of Object.entries(this.P_SEALS)) {
            v.key = k;
            if (!v.wip && !v.demo) {
                if (TESTHELPER_unlocks) {
                    v.discovered = true;
                    v.alerted = true;
                }
                if (!v.discovered && meta.discovered[k]) {
                    v.discovered = true;
                }
                if (v.discovered && meta.alerted[k]) {
                    v.alerted = true;
                }
                else {
                    if (v.discovered) {
                        v.alerted = false;
                    }
                }
                Array.prototype.push.call(this.P_CENTER_POOLS["Seal"], v);
            }
        }
        for (const [k, v] of Object.entries(this.P_STAKES)) {
            v.key = k;
            Array.prototype.push.call(this.P_CENTER_POOLS["Stake"], v);
        }
        for (const [k, v] of Object.entries(this.P_CENTERS)) {
            v.key = k;
            if (v.set === "Joker") {
                Array.prototype.push.call(this.P_CENTER_POOLS["Joker"], v);
            }
            if (v.set && v.demo && v.pos) {
                Array.prototype.push.call(this.P_CENTER_POOLS["Demo"], v);
            }
            if (!v.wip) {
                if (v.set && v.set !== "Joker" && !v.skip_pool && !v.omit) {
                    Array.prototype.push.call(this.P_CENTER_POOLS[v.set], v);
                }
                if (v.set === "Tarot" || v.set === "Planet") {
                    Array.prototype.push.call(this.P_CENTER_POOLS["Tarot_Planet"], v);
                }
                if (v.consumeable) {
                    Array.prototype.push.call(this.P_CENTER_POOLS["Consumeables"], v);
                }
                if (v.rarity && v.set === "Joker" && !v.demo) {
                    Array.prototype.push.call(this.P_JOKER_RARITY_POOLS[v.rarity], v);
                }
            }
        }
        Array.prototype.sort.call(this.P_CENTER_POOLS["Joker"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Tarot"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Planet"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Tarot_Planet"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Spectral"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Voucher"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Booster"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Consumeables"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Back"], function (a, b) {
            return a.order - (a.unlocked && 100 || 0) < b.order - (b.unlocked && 100 || 0);
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Enhanced"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Edition"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Stake"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Tag"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Seal"], function (a, b) {
            return a.order < b.order;
        });
        Array.prototype.sort.call(this.P_CENTER_POOLS["Demo"], function (a, b) {
            return a.order + (a.set === "Joker" && 1000 || 0) < b.order + (b.set === "Joker" && 1000 || 0);
        });
        for (let i = 1; i <= 4; i++) {
            Array.prototype.sort.call(this.P_JOKER_RARITY_POOLS[i], function (a, b) {
                return a.order < b.order;
            });
        }
    };
    load_profile(_profile) {
        if (!G.PROFILES[_profile]) {
            _profile = 1;
        }
        G.SETTINGS.profile = _profile;
        let info:string|undefined = love.filesystem.read(_profile + "/profile.jkr");
        if (info !== undefined) {
            for (const [k, v] of Object.entries(STR_UNPACK(info))) {
                G.PROFILES[G.SETTINGS.profile??""][k] = v;
            }
        }
        let temp_profile = { MEMORY: { deck: "Red Deck", stake: 1 }, stake: 1, high_scores: { hand: { label: "Best Hand", amt: 0 }, furthest_round: { label: "Highest Round", amt: 0 }, furthest_ante: { label: "Highest Ante", amt: 0 }, most_money: { label: "Most Money", amt: 0 }, boss_streak: { label: "Most Bosses in a Row", amt: 0 }, collection: { label: "Collection", amt: 0, tot: 1 }, win_streak: { label: "Best Win Streak", amt: 0 }, current_streak: { label: "", amt: 0 }, poker_hand: { label: "Most Played Hand", amt: 0 } }, career_stats: { c_round_interest_cap_streak: 0, c_dollars_earned: 0, c_shop_dollars_spent: 0, c_tarots_bought: 0, c_planets_bought: 0, c_playing_cards_bought: 0, c_vouchers_bought: 0, c_tarot_reading_used: 0, c_planetarium_used: 0, c_shop_rerolls: 0, c_cards_played: 0, c_cards_discarded: 0, c_losses: 0, c_wins: 0, c_rounds: 0, c_hands_played: 0, c_face_cards_played: 0, c_jokers_sold: 0, c_cards_sold: 0, c_single_hand_round_streak: 0 }, progress: {}, joker_usage: {}, consumeable_usage: {}, voucher_usage: {}, hand_usage: {}, deck_usage: {}, deck_stakes: {}, challenges_unlocked: undefined, challenge_progress: { completed: {}, unlocked: {} } };
        let recursive_init;
        recursive_init = function (t1, t2) {
            for (const [k, v] of Object.entries(t1)) {
                if (!t2[k]) {
                    t2[k] = v;
                }
                else {
                    if (typeof (t2[k]) === "object" && typeof (v) === "object") {
                        recursive_init(v, t2[k]);
                    }
                }
            }
        };
        recursive_init(temp_profile, G.PROFILES[G.SETTINGS.profile??""]);
    };
    set_language() {
        if (!this.LANGUAGES) {
            if (false) {
                G.SETTINGS.language = "en-us";
            }
            this.LANGUAGES = { 
                ["en-us"]: { font: 1, label: "English", key: "en-us", button: "Language Feedback", warning: ["This language is still in Beta. To help us", "improve it, please click on the feedback button.", "Click again to confirm"] },
                ["de"]: { font: 1, label: "Deutsch", key: "de", beta: undefined, button: "Feedback zur \u00DCbersetzung", warning: ["Diese \u00DCbersetzung ist noch im Beta-Stadium. Willst du uns helfen,", "sie zu verbessern? Dann klicke bitte auf die Feedback-Taste.", "Zum Best\u00E4tigen erneut klicken"] },
                ["es_419"]: { font: 1, label: "Espa\u00F1ol (M\u00E9xico)", key: "es_419", beta: undefined, button: "Sugerencias de idioma", warning: ["Este idioma todav\u00EDa est\u00E1 en Beta. Pulsa el bot\u00F3n", "de sugerencias para ayudarnos a mejorarlo.", "Haz clic de nuevo para confirmar"] },
                ["es_ES"]: { font: 1, label: "Espa\u00F1ol (Espa\u00F1a)", key: "es_ES", beta: undefined, button: "Sugerencias de idioma", warning: ["Este idioma todav\u00EDa est\u00E1 en Beta. Pulsa el bot\u00F3n", "de sugerencias para ayudarnos a mejorarlo.", "Haz clic de nuevo para confirmar"] },
                ["fr"]: { font: 1, label: "Fran\u00E7ais", key: "fr", beta: undefined, button: "Partager votre avis", warning: ["La traduction fran\u00E7aise est encore en version b\u00EAta. ", "Veuillez cliquer sur le bouton pour nous donner votre avis.", "Cliquez \u00E0 nouveau pour confirmer"] },
                ["id"]: { font: 1, label: "Bahasa Indonesia", key: "id", beta: true, button: "Umpan Balik Bahasa", warning: ["Bahasa ini masih dalam tahap Beta. Untuk membantu", "kami meningkatkannya, silakan klik tombol umpan balik.", "Klik lagi untuk mengonfirmasi"] },
                ["it"]: { font: 1, label: "Italiano", key: "it", beta: undefined, button: "Feedback traduzione", warning: ["Questa traduzione \u00E8 ancora in Beta. Per", "aiutarci a migliorarla, clicca il tasto feedback", "Fai clic di nuovo per confermare"] },
                ["ja"]: { font: 5, label: "\u65E5\u672C\u8A9E", key: "ja", beta: undefined, button: "\u63D0\u6848\u3059\u308B", warning: ["\u3053\u306E\u7FFB\u8A33\u306F\u73FE\u5728\u30D9\u30FC\u30BF\u7248\u3067\u3059\u3002\u63D0\u6848\u304C\u3042\u3063\u305F\u5834\u5408\u3001", "\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "\u3082\u3046\u4E00\u5EA6\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u78BA\u8A8D"] },
                ["ko"]: { font: 4, label: "\uD55C\uAD6D\uC5B4", key: "ko", beta: undefined, button: "\uBC88\uC5ED \uD53C\uB4DC\uBC31", warning: ["\uC774 \uC5B8\uC5B4\uB294 \uC544\uC9C1 \uBCA0\uD0C0 \uB2E8\uACC4\uC5D0 \uC788\uC2B5\uB2C8\uB2E4. ", "\uBC88\uC5ED\uC744 \uB3C4\uC640\uC8FC\uC2DC\uB824\uBA74 \uD53C\uB4DC\uBC31 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694.", "\uB2E4\uC2DC \uD074\uB9AD\uD574\uC11C \uD655\uC778\uD558\uC138\uC694"] },
                ["nl"]: { font: 1, label: "Nederlands", key: "nl", beta: undefined, button: "Taal suggesties", warning: ["Deze taal is nog in de Beta fase. Help ons het te ", "verbeteren door op de suggestie knop te klikken.", "Klik opnieuw om te bevestigen"] },
                ["pl"]: { font: 1, label: "Polski", key: "pl", beta: undefined, button: "Wy\u015Blij uwagi do t\u0142umaczenia", warning: ["Polska wersja j\u0119zykowa jest w fazie Beta. By pom\u00F3c nam poprawi\u0107", " jako\u015B\u0107 t\u0142umaczenia, kliknij przycisk i podziel si\u0119 swoj\u0105 opini\u0105 i uwagami.", "Kliknij ponownie, aby potwierdzi\u0107"] },
                ["pt_BR"]: { font: 1, label: "Portugu\u00EAs", key: "pt_BR", beta: undefined, button: "Feedback de Tradu\u00E7\u00E3o", warning: ["Esta tradu\u00E7\u00E3o ainda est\u00E1 em Beta. Se quiser nos ajudar", "a melhor\u00E1-la, clique no bot\u00E3o de feedback por favor", "Clique novamente para confirmar"] },
                ["ru"]: { font: 6, label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", key: "ru", beta: true, button: "\u041E\u0442\u0437\u044B\u0432 \u043E \u044F\u0437\u044B\u043A\u0435", warning: ["\u042D\u0442\u043E\u0442 \u044F\u0437\u044B\u043A \u0432\u0441\u0435 \u0435\u0449\u0435 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0411\u0435\u0442\u0430-\u0432\u0435\u0440\u0441\u0438\u0438. \u0427\u0442\u043E\u0431\u044B \u043F\u043E\u043C\u043E\u0447\u044C", "\u043D\u0430\u043C \u0435\u0433\u043E \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0443 \u043E\u0431\u0440\u0430\u0442\u043D\u043E\u0439 \u0441\u0432\u044F\u0437\u0438.", "\u0429\u0435\u043B\u043A\u043D\u0438\u0442\u0435 \u0441\u043D\u043E\u0432\u0430, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C"] },
                ["zh_CN"]: { font: 2, label: "\u7B80\u4F53\u4E2D\u6587", key: "zh_CN", beta: undefined, button: "\u610F\u89C1\u53CD\u9988", warning: ["\u8FD9\u4E2A\u8BED\u8A00\u76EE\u524D\u5C1A\u4E3ABeta\u7248\u672C\u3002 \u8BF7\u5E2E\u52A9\u6211\u4EEC\u6539\u5584\u7FFB\u8BD1\u54C1\u8D28\uFF0C", "\u70B9\u51FB\u201D\u610F\u89C1\u53CD\u9988\u201D \u6765\u63D0\u4F9B\u4F60\u7684\u610F\u89C1\u3002", "\u518D\u6B21\u70B9\u51FB\u786E\u8BA4"] },
                ["zh_TW"]: { font: 3, label: "\u7E41\u9AD4\u4E2D\u6587", key: "zh_TW", beta: undefined, button: "\u610F\u898B\u56DE\u994B", warning: ["\u9019\u500B\u8A9E\u8A00\u76EE\u524D\u5C1A\u70BABeta\u7248\u672C\u3002\u8ACB\u5E6B\u52A9\u6211\u5011\u6539\u5584\u7FFB\u8B6F\u54C1\u8CEA\uFF0C", "\u9EDE\u64CA\u201D\u610F\u898B\u56DE\u994B\u201D \u4F86\u63D0\u4F9B\u4F60\u7684\u610F\u898B\u3002", "\u518D\u6309\u4E00\u4E0B\u5373\u53EF\u78BA\u8A8D"] },
                ["all1"]: { font: 8, label: "English", key: "all", omit: true },
                ["all2"]: { font: 9, label: "English", key: "all", omit: true }
            };
            this.FONTS = [
                { file: "resources/fonts/m6x11plus.ttf", render_scale: this.TILESIZE * 10, TEXT_HEIGHT_SCALE: 0.83, TEXT_OFFSET: { x: 10, y: -20 }, FONTSCALE: 0.1, squish: 1, DESCSCALE: 1 },
                { file: "resources/fonts/NotoSansSC-Bold.ttf", render_scale: this.TILESIZE * 7, TEXT_HEIGHT_SCALE: 0.7, TEXT_OFFSET: { x: 0, y: -35 }, FONTSCALE: 0.12, squish: 1, DESCSCALE: 1.1 },
                { file: "resources/fonts/NotoSansTC-Bold.ttf", render_scale: this.TILESIZE * 7, TEXT_HEIGHT_SCALE: 0.7, TEXT_OFFSET: { x: 0, y: -35 }, FONTSCALE: 0.12, squish: 1, DESCSCALE: 1.1 },
                { file: "resources/fonts/NotoSansKR-Bold.ttf", render_scale: this.TILESIZE * 7, TEXT_HEIGHT_SCALE: 0.8, TEXT_OFFSET: { x: 0, y: -20 }, FONTSCALE: 0.12, squish: 1, DESCSCALE: 1 },
                { file: "resources/fonts/NotoSansJP-Bold.ttf", render_scale: this.TILESIZE * 7, TEXT_HEIGHT_SCALE: 0.8, TEXT_OFFSET: { x: 0, y: -20 }, FONTSCALE: 0.12, squish: 1, DESCSCALE: 1 },
                { file: "resources/fonts/NotoSans-Bold.ttf", render_scale: this.TILESIZE * 7, TEXT_HEIGHT_SCALE: 0.65, TEXT_OFFSET: { x: 0, y: -40 }, FONTSCALE: 0.12, squish: 1, DESCSCALE: 1 },
                { file: "resources/fonts/m6x11plus.ttf", render_scale: this.TILESIZE * 10, TEXT_HEIGHT_SCALE: 0.9, TEXT_OFFSET: { x: 10, y: 15 }, FONTSCALE: 0.1, squish: 1, DESCSCALE: 1 },
                { file: "resources/fonts/GoNotoCurrent-Bold.ttf", render_scale: this.TILESIZE * 10, TEXT_HEIGHT_SCALE: 0.8, TEXT_OFFSET: { x: 10, y: -20 }, FONTSCALE: 0.1, squish: 1, DESCSCALE: 1 },
                { file: "resources/fonts/GoNotoCJKCore.ttf", render_scale: this.TILESIZE * 10, TEXT_HEIGHT_SCALE: 0.8, TEXT_OFFSET: { x: 10, y: -20 }, FONTSCALE: 0.1, squish: 1, DESCSCALE: 1 }
            ];
            for (const [_, v] of Array.prototype.entries.call(this.FONTS)) {
                if (love.filesystem.getInfo(v.file)) {
                    v.FONT = love.graphics.newFont(v.file, v.render_scale);
                }
            }
            for (const [_, v] of Object.entries(this.LANGUAGES)) {
                v.font = this.FONTS[v.font];
            }
        }
        this.LANG = this.LANGUAGES[this.SETTINGS.real_language || this.SETTINGS.language] || this.LANGUAGES["en-us"];
        let localization = love.filesystem.getInfo("localization/" + (G.SETTINGS.language + ".lua")) || love.filesystem.getInfo("localization/en-us.lua");
        if (localization !== undefined) {
            this.localization = assert(loadstring(love.filesystem.read("localization/" + (G.SETTINGS.language + ".lua")) || love.filesystem.read("localization/en-us.lua")))();
            init_localization();
        }
    };
    set_render_settings() {
        this.SETTINGS.GRAPHICS.texture_scaling = this.SETTINGS.GRAPHICS.texture_scaling || 2;
        love.graphics.setDefaultFilter(this.SETTINGS.GRAPHICS.texture_scaling === 1 && "nearest" || "linear", this.SETTINGS.GRAPHICS.texture_scaling === 1 && "nearest" || "linear", 1);
        love.graphics.setLineStyle("rough");
        this.animation_atli = [
            { name: "blind_chips", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/BlindChips.png"), px: 34, py: 34, frames: 21 },
            { name: "shop_sign", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/ShopSignAnimation.png"), px: 113, py: 57, frames: 4 }
        ];
        this.asset_atli = [
            {
                name: "cards_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/8BitDeck.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "cards_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/8BitDeck_opt2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "centers", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/Enhancers.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "Joker", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/Jokers.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "Tarot", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/Tarots.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "Voucher", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/Vouchers.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "Booster", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/boosters.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "ui_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/ui_assets.png"), px: 18, py: 18,
                type: undefined
            },
            {
                name: "ui_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/ui_assets_opt2.png"), px: 18, py: 18,
                type: undefined
            },
            {
                name: "balatro", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/balatro.png"), px: 333, py: 216,
                type: undefined
            },
            {
                name: "gamepad_ui", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/gamepad_ui.png"), px: 32, py: 32,
                type: undefined
            },
            {
                name: "icons", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/icons.png"), px: 66, py: 66,
                type: undefined
            },
            {
                name: "tags", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/tags.png"), px: 34, py: 34,
                type: undefined
            },
            {
                name: "stickers", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/stickers.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "chips", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/chips.png"), px: 29, py: 29,
                type: undefined
            },
            {
                name: "collab_AU_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_AU_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_AU_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_AU_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_TW_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_TW_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_TW_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_TW_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_VS_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_VS_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_VS_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_VS_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_DTD_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_DTD_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_DTD_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_DTD_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_CYP_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_CYP_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_CYP_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_CYP_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_STS_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_STS_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_STS_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_STS_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_TBoI_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_TBoI_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_TBoI_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_TBoI_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_SV_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_SV_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_SV_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_SV_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_SK_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_SK_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_SK_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_SK_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_DS_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_DS_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_DS_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_DS_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_CL_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_CL_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_CL_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_CL_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_D2_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_D2_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_D2_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_D2_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_PC_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_PC_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_PC_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_PC_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_WF_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_WF_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_WF_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_WF_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_EG_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_EG_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_EG_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_EG_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_XR_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_XR_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_XR_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_XR_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_CR_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_CR_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_CR_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_CR_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_BUG_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_BUG_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_BUG_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_BUG_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_FO_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_FO_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_FO_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_FO_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_DBD_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_DBD_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_DBD_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_DBD_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_C7_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_C7_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_C7_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_C7_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_R_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_R_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_R_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_R_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_AC_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_AC_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_AC_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_AC_2.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_STP_1", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_STP_1.png"), px: 71, py: 95,
                type: undefined
            },
            {
                name: "collab_STP_2", path: "resources/textures/" + (this.SETTINGS.GRAPHICS.texture_scaling + "x/collabs/collab_STP_2.png"), px: 71, py: 95,
                type: undefined
            }
        ];
        this.asset_images = [
            {
                name: "playstack_logo", path: "resources/textures/1x/playstack-logo.png", px: 1417, py: 1417,
                type: undefined
            },
            {
                name: "localthunk_logo", path: "resources/textures/1x/localthunk-logo.png", px: 1390, py: 560,
                type: undefined
            }
        ];
        for (let i = 1; i <= this.animation_atli.length; i++) {
            this.ANIMATION_ATLAS[this.animation_atli[i].name] = {};
            this.ANIMATION_ATLAS[this.animation_atli[i].name].name = this.animation_atli[i].name;
            this.ANIMATION_ATLAS[this.animation_atli[i].name].image = love.graphics.newImage(this.animation_atli[i].path, { mipmaps: true, dpiscale: this.SETTINGS.GRAPHICS.texture_scaling });
            this.ANIMATION_ATLAS[this.animation_atli[i].name].px = this.animation_atli[i].px;
            this.ANIMATION_ATLAS[this.animation_atli[i].name].py = this.animation_atli[i].py;
            this.ANIMATION_ATLAS[this.animation_atli[i].name].frames = this.animation_atli[i].frames;
        }
        for (let i = 1; i <= this.asset_atli.length; i++) {
            this.ASSET_ATLAS[this.asset_atli[i].name] = {};
            this.ASSET_ATLAS[this.asset_atli[i].name].name = this.asset_atli[i].name;
            this.ASSET_ATLAS[this.asset_atli[i].name].image = love.graphics.newImage(this.asset_atli[i].path, { mipmaps: true, dpiscale: this.SETTINGS.GRAPHICS.texture_scaling });
            let mipmap_level = SMODS.config.graphics_mipmap_level_options[SMODS.config.graphics_mipmap_level];
            if (mipmap_level && mipmap_level > 0) {
                this.ASSET_ATLAS[this.asset_atli[i].name].image.setMipmapFilter("linear", mipmap_level);
            }
            this.ASSET_ATLAS[this.asset_atli[i].name].type = this.asset_atli[i].type;
            this.ASSET_ATLAS[this.asset_atli[i].name].px = this.asset_atli[i].px;
            this.ASSET_ATLAS[this.asset_atli[i].name].py = this.asset_atli[i].py;
        }
        for (let i = 1; i <= this.asset_images.length; i++) {
            this.ASSET_ATLAS[this.asset_images[i].name] = {};
            this.ASSET_ATLAS[this.asset_images[i].name].name = this.asset_images[i].name;
            this.ASSET_ATLAS[this.asset_images[i].name].image = love.graphics.newImage(this.asset_images[i].path, { mipmaps: true, dpiscale: 1 });
            this.ASSET_ATLAS[this.asset_images[i].name].type = this.asset_images[i].type;
            this.ASSET_ATLAS[this.asset_images[i].name].px = this.asset_images[i].px;
            this.ASSET_ATLAS[this.asset_images[i].name].py = this.asset_images[i].py;
        }
        for (const [_, v] of Object.entries(G.I.SPRITE)) {
            v.reset();
        }
        this.ASSET_ATLAS.Planet = this.ASSET_ATLAS.Tarot;
        this.ASSET_ATLAS.Spectral = this.ASSET_ATLAS.Tarot;
    };
    init_window(reset) {
        this.ROOM_PADDING_H = 0.7;
        this.ROOM_PADDING_W = 1;
        this.WINDOWTRANS = { x: 0, y: 0, w: this.TILE_W + 2 * this.ROOM_PADDING_W, h: this.TILE_H + 2 * this.ROOM_PADDING_H };
        this.window_prev = { orig_scale: this.TILESCALE, w: this.WINDOWTRANS.w * this.TILESIZE * this.TILESCALE, h: this.WINDOWTRANS.h * this.TILESIZE * this.TILESCALE, orig_ratio: this.WINDOWTRANS.w * this.TILESIZE * this.TILESCALE / (this.WINDOWTRANS.h * this.TILESIZE * this.TILESCALE) };
        G.SETTINGS.QUEUED_CHANGE = G.SETTINGS.QUEUED_CHANGE || {};
        G.SETTINGS.QUEUED_CHANGE.screenmode = G.SETTINGS.WINDOW.screenmode;
        G.FUNCS.apply_window_changes(true);
    };
    delete_run() {
        if (this.ROOM) {
            remove_all(G.STAGE_OBJECTS[G.STAGE]);
            this.load_shop_booster = undefined;
            this.load_shop_jokers = undefined;
            this.load_shop_vouchers = undefined;
            if (this.buttons) {
                this.buttons.remove();
                this.buttons = undefined;
            }
            if (this.deck_preview) {
                this.deck_preview.remove();
                this.deck_preview = undefined;
            }
            if (this.shop) {
                this.shop.remove();
                this.shop = undefined;
            }
            if (this.blind_select) {
                this.blind_select.remove();
                this.blind_select = undefined;
            }
            if (this.booster_pack) {
                this.booster_pack.remove();
                this.booster_pack = undefined;
            }
            if (this.MAIN_MENU_UI) {
                this.MAIN_MENU_UI.remove();
                this.MAIN_MENU_UI = undefined;
            }
            if (this.SPLASH_FRONT) {
                this.SPLASH_FRONT.remove();
                this.SPLASH_FRONT = undefined;
            }
            if (this.SPLASH_BACK) {
                this.SPLASH_BACK.remove();
                this.SPLASH_BACK = undefined;
            }
            if (this.SPLASH_LOGO) {
                this.SPLASH_LOGO.remove();
                this.SPLASH_LOGO = undefined;
            }
            if (this.GAME_OVER_UI) {
                this.GAME_OVER_UI.remove();
                this.GAME_OVER_UI = undefined;
            }
            if (this.collection_alert) {
                this.collection_alert.remove();
                this.collection_alert = undefined;
            }
            if (this.HUD) {
                this.HUD.remove();
                this.HUD = undefined;
            }
            if (this.HUD_blind) {
                this.HUD_blind.remove();
                this.HUD_blind = undefined;
            }
            if (this.HUD_tags) {
                for (const [k, v] of Object.entries(this.HUD_tags)) {
                    v.remove();
                }
                this.HUD_tags = undefined;
            }
            if (this.OVERLAY_MENU) {
                this.OVERLAY_MENU.remove();
                this.OVERLAY_MENU = undefined;
            }
            if (this.OVERLAY_TUTORIAL) {
                G.OVERLAY_TUTORIAL.Jimbo.remove();
                if (G.OVERLAY_TUTORIAL.content) {
                    G.OVERLAY_TUTORIAL.content.remove();
                }
                G.OVERLAY_TUTORIAL.remove();
                G.OVERLAY_TUTORIAL = undefined;
            }
            for (const [k, v] of Object.entries(G)) {
                if (v instanceof CardArea) {
                    G[k] = undefined;
                }
            }
            G.I.CARD = {};
        }
        G.VIEWING_DECK = undefined;
        G.E_MANAGER.clear_queue();
        G.CONTROLLER.mod_cursor_context_layer(-1000);
        G.CONTROLLER.focus_cursor_stack = {};
        G.CONTROLLER.focus_cursor_stack_level = 1;
        if (G.GAME) {
            G.GAME.won = false;
        }
        G.STATE = -1;
    };
    save_progress() {
        G.ARGS.save_progress = G.ARGS.save_progress || {};
        G.ARGS.save_progress.UDA = EMPTY(G.ARGS.save_progress.UDA);
        G.ARGS.save_progress.SETTINGS = G.SETTINGS;
        G.ARGS.save_progress.PROFILE = G.PROFILES[G.SETTINGS.profile??""];
        for (const [k, v] of Object.entries(this.P_CENTERS)) {
            G.ARGS.save_progress.UDA[k] = (v.unlocked && "u" || "") + ((v.discovered && "d" || "") + (v.alerted && "a" || ""));
        }
        for (const [k, v] of Object.entries(this.P_BLINDS)) {
            G.ARGS.save_progress.UDA[k] = (v.unlocked && "u" || "") + ((v.discovered && "d" || "") + (v.alerted && "a" || ""));
        }
        for (const [k, v] of Object.entries(this.P_TAGS)) {
            G.ARGS.save_progress.UDA[k] = (v.unlocked && "u" || "") + ((v.discovered && "d" || "") + (v.alerted && "a" || ""));
        }
        for (const [k, v] of Object.entries(this.P_SEALS)) {
            G.ARGS.save_progress.UDA[k] = (v.unlocked && "u" || "") + ((v.discovered && "d" || "") + (v.alerted && "a" || ""));
        }
        G.FILE_HANDLER = G.FILE_HANDLER || {};
        G.FILE_HANDLER.progress = true;
        G.FILE_HANDLER.update_queued = true;
    };
    save_notify(card) {
        G.SAVE_MANAGER.channel.push({ type: "save_notify", save_notify: card.key, profile_num: G.SETTINGS.profile });
    };
    save_settings() {
        G.ARGS.save_settings = G.SETTINGS;
        G.FILE_HANDLER = G.FILE_HANDLER || {};
        G.FILE_HANDLER.settings = true;
        G.FILE_HANDLER.update_queued = true;
    };
    save_metrics() {
        G.ARGS.save_metrics = G.METRICS;
        G.FILE_HANDLER = G.FILE_HANDLER || {};
        G.FILE_HANDLER.settings = true;
        G.FILE_HANDLER.update_queued = true;
    };
    prep_stage(new_stage, new_state, new_game_obj) {
        for (const [k, v] of Object.entries(this.CONTROLLER.locks)) {
            this.CONTROLLER.locks[k] = undefined;
        }
        if (new_game_obj) {
            this.GAME = this.init_game_object();
        }
        this.STAGE = new_stage || this.STAGES.MAIN_MENU;
        this.STATE = new_state || this.STATES.MENU;
        this.STATE_COMPLETE = false;
        this.SETTINGS.paused = false;
        this.ROOM = new LuaNode({ T: { x: this.ROOM_PADDING_W, y: this.ROOM_PADDING_H, w: this.TILE_W, h: this.TILE_H } });
        this.ROOM.jiggle = 0;
        this.ROOM.states.drag.can = false;
        this.ROOM.set_container(this.ROOM);
        this.ROOM_ATTACH = new Moveable({ T: { x: 0, y: 0, w: this.TILE_W, h: this.TILE_H } });
        this.ROOM_ATTACH.states.drag.can = false;
        this.ROOM_ATTACH.set_container(this.ROOM);
        love.resize?.(love.graphics.getWidth(), love.graphics.getHeight());
    };
    sandbox() {
        G.TIMERS.REAL = 0;
        G.TIMERS.TOTAL = 0;
        this.prep_stage(G.STAGES.SANDBOX, G.STATES.SANDBOX, true);
        this.GAME.selected_back = new Back(G.P_CENTERS.b_red);
        ease_background_colour({ new_colour: G.C.BLACK, contrast: 1 });
        G.SANDBOX = { vort_time: 7, vort_speed: 0, col_op: ["RED", "BLUE", "GREEN", "BLACK", "L_BLACK", "WHITE", "EDITION", "DARK_EDITION", "ORANGE", "PURPLE"], col1: G.C.RED, col2: G.C.BLUE, mid_flash: 0, joker_text: "", edition: "base", tilt: 1, card_size: 1, base_size: { w: G.CARD_W, h: G.CARD_H }, gamespeed: 0 };
        if (G.SPLASH_FRONT) {
            G.SPLASH_FRONT.remove();
            G.SPLASH_FRONT = undefined;
        }
        if (G.SPLASH_BACK) {
            G.SPLASH_BACK.remove();
            G.SPLASH_BACK = undefined;
        }
        G.SPLASH_BACK = new Sprite(-30, -13, G.ROOM.T.w + 60, G.ROOM.T.h + 22, G.ASSET_ATLAS["ui_" + (G.SETTINGS.colourblind_option && 2 || 1)], { x: 2, y: 0 });
        G.SPLASH_BACK.set_alignment({ major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } });
        G.SPLASH_BACK.define_draw_steps([{ shader: "splash", send: [{ name: "time", ref_table: G.SANDBOX, ref_value: "vort_time" }, { name: "vort_speed", val: 0.4 }, { name: "colour_1", ref_table: G.SANDBOX, ref_value: "col1" }, { name: "colour_2", ref_table: G.SANDBOX, ref_value: "col2" }, { name: "mid_flash", ref_table: G.SANDBOX, ref_value: "mid_flash" }, { name: "vort_offset", val: 0 }] }]);
        function create_UIBox_sandbox_controls(): any {
            G.FUNCS.col1change = function (args) {
                G.SANDBOX.col1 = G.C[args.to_val];
            };
            G.FUNCS.col2change = function (args) {
                G.SANDBOX.col2 = G.C[args.to_val];
            };
            G.FUNCS.edition_change = function (args) {
                G.SANDBOX.edition = args.to_val;
                if (G.SANDBOX.joker) {
                    G.SANDBOX.joker.set_edition({ [args.to_val]: true }, true, true);
                }
            };
            G.FUNCS.pulseme = function (e) {
                if (Math.random() > 0.998) {
                    e.config.object.pulse(1);
                }
            };
            G.FUNCS.spawn_joker = function (e) {
                G.FUNCS.rem_joker();
                G.SANDBOX.joker = add_joker(G.SANDBOX.joker_text, G.SANDBOX.edition);
            };
            G.FUNCS.rem_joker = function (e) {
                if (G.SANDBOX.joker) {
                    G.SANDBOX.joker.remove();
                    G.SANDBOX.joker = undefined;
                }
            };
            G.FUNCS.do_time = function (args) {
                if (args.to_val === "PLAY") {
                    G.SANDBOX.gamespeed = 1;
                }
                else {
                    G.SANDBOX.gamespeed = 0;
                }
            };
            G.FUNCS.cb = function (rt) {
                G.CARD_W = rt.ref_table[rt.ref_value] * G.SANDBOX.base_size.w;
                G.CARD_H = rt.ref_table[rt.ref_value] * G.SANDBOX.base_size.h;
            };
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.SANDBOX.file_reload_timer = G.SANDBOX.file_reload_timer || 0;
                    if (G.SANDBOX.file_reload_timer < G.TIMERS.REAL) {
                        G.SANDBOX.file_reload_timer = G.SANDBOX.file_reload_timer + 0.25;
                    }
                    if (G.SANDBOX.joker) {
                        G.SANDBOX.joker.ambient_tilt = G.SANDBOX.tilt;
                    }
                    G.SANDBOX.vort_time = G.SANDBOX.vort_time + G.real_dt * G.SANDBOX.gamespeed;
                    G.CONTROLLER.lock_input = false;
                } }));
            let t = { 
                n: G.UIT.ROOT,
                config: { align: "cm", colour: G.C.CLEAR },
                nodes: [{ 
                    n: G.UIT.R,
                    config: { align: "cm", padding: 0.05, r: 0.1, emboss: 0.1, colour: G.C.L_BLACK },
                    nodes: [
                        create_slider({ 
                            label: "Time",
                            w: 2,
                            h: 0.3,
                            text_scale: 0.2,
                            label_scale: 0.3,
                            ref_table: G.SANDBOX,
                            ref_value: "vort_time",
                            min: 0,
                            max: 30
                        }),
                        create_option_cycle({ 
                            options: ["PLAY", "PAUSE"],
                            opt_callback: "do_time",
                            current_option: 1,
                            colour: G.C.RED,
                            w: 2,
                            scale: 0.7
                        }),
                        create_slider({ 
                            label: "tilt",
                            w: 2,
                            h: 0.3,
                            text_scale: 0.2,
                            label_scale: 0.3,
                            ref_table: G.SANDBOX,
                            ref_value: "tilt",
                            min: 0,
                            max: 3,
                            decimal_places: 2
                        }),
                        create_slider({ 
                            label: "Card size",
                            w: 2,
                            h: 0.3,
                            text_scale: 0.2,
                            label_scale: 0.3,
                            ref_table: G.SANDBOX,
                            ref_value: "card_size",
                            min: 0.1,
                            max: 3,
                            callback: "cb",
                            decimal_places: 2
                        }),
                        create_option_cycle({ options: G.SANDBOX.col_op, opt_callback: "col1change", current_option: 1, colour: G.C.RED, w: 2, scale: 0.7 }),
                        create_option_cycle({ options: G.SANDBOX.col_op, opt_callback: "col2change", current_option: 2, colour: G.C.RED, w: 2, scale: 0.7 }),
                        { 
                            n: G.UIT.R, config: { align: "cm", padding: 0.05 }, 
                            nodes: [
                                UIBox_button({ label: ["+"], button: "spawn_joker", minw: 0.7, col: true }),
                                create_text_input({ prompt_text: "Joker key", extended_corpus: true, ref_table: G.SANDBOX, ref_value: "joker_text", text_scale: 0.3, w: 1.5, h: 0.6 }),
                                UIBox_button({ label: ["-"], button: "rem_joker", minw: 0.7, col: true })
                            ] },
                        create_option_cycle({ options: ["base", "foil", "holo", "polychrome", "negative"], opt_callback: "edition_change", current_option: 1, colour: G.C.RED, w: 2, scale: 0.7 })
                    ]
                }]
            };
            return t;
        };
        G.SANDBOX.UI = new UIBox({ definition: create_UIBox_sandbox_controls(), config: { align: "cli", offset: { x: 0, y: 0 }, major: G.ROOM_ATTACH, bond: "Weak" } });
        G.SANDBOX.UI.recalculate(true);
    };
    splash_screen() {
        if (G.SETTINGS.skip_splash === "Yes") {
            G.main_menu();
            return;
        }
        this.prep_stage(G.STAGES.MAIN_MENU, G.STATES.SPLASH, true);
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                discover_card();
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                G.TIMERS.TOTAL = 0;
                G.TIMERS.REAL = 0;
                G.SPLASH_BACK = new Sprite(-30, -13, G.ROOM.T.w + 60, G.ROOM.T.h + 22, G.ASSET_ATLAS["ui_1"], { x: 2, y: 0 });
                G.SPLASH_BACK.define_draw_steps([{ shader: "splash", send: [{ name: "time", ref_table: G.TIMERS, ref_value: "REAL" }, { name: "vort_speed", val: 1 }, { name: "colour_1", ref_table: G.C, ref_value: "BLUE" }, { name: "colour_2", ref_table: G.C, ref_value: "WHITE" }, { name: "mid_flash", val: 0 }, { name: "vort_offset", val: 2 * 90.15315131 * os.time() % 100000 }] }]);
                G.SPLASH_BACK.set_alignment({ major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } });
                G.SPLASH_FRONT = new Sprite(0, -20, G.ROOM.T.w * 2, G.ROOM.T.h * 4, G.ASSET_ATLAS["ui_1"], { x: 2, y: 0 });
                G.SPLASH_FRONT.define_draw_steps([{ shader: "flash", send: [{ name: "time", ref_table: G.TIMERS, ref_value: "REAL" }, { name: "mid_flash", val: 1 }] }]);
                G.SPLASH_FRONT.set_alignment({ major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } });
                let SC = undefined;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, func: function () {
                        let SC_scale = 1.2;
                        SC = new Card(G.ROOM.T.w / 2 - SC_scale * G.CARD_W / 2, 10 + G.ROOM.T.h / 2 - SC_scale * G.CARD_H / 2, SC_scale * G.CARD_W, SC_scale * G.CARD_H, G.P_CARDS.empty, G.P_CENTERS["j_joker"]);
                        SC.T.y = G.ROOM.T.h / 2 - SC_scale * G.CARD_H / 2;
                        SC.ambient_tilt = 1;
                        SC.states.drag.can = false;
                        SC.states.hover.can = false;
                        SC.no_ui = true;
                        G.VIBRATION = G.VIBRATION + 2;
                        play_sound("whoosh1", 0.7, 0.2);
                        play_sound("introPad1", 0.704, 0.6);
                        return true;
                    } }));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.8, func: function () {
                        SC.start_dissolve([G.C.WHITE, G.C.WHITE], true, 12, true);
                        play_sound("magic_crumple", 1, 0.5);
                        play_sound("splash_buildup", 1, 0.7);
                        return true;
                    } }));
                function make_splash_card (args): any {
                    args = args || {};
                    let angle = Math.random() * 2 * 3.14;
                    let card_size = (args.scale || 1.5) * (Math.random() + 1);
                    let card_pos = args.card_pos || { x: (18 + card_size) * Math.sin(angle), y: (18 + card_size) * Math.cos(angle) };
                    let card = new Card(card_pos.x + G.ROOM.T.w / 2 - G.CARD_W * card_size / 2, card_pos.y + G.ROOM.T.h / 2 - G.CARD_H * card_size / 2, card_size * G.CARD_W, card_size * G.CARD_H, pseudorandom_element(G.P_CARDS), G.P_CENTERS.c_base);
                    if (Math.random() > 0.8) {
                        card.sprite_facing = "back";
                        card.facing = "back";
                    }
                    card.no_shadow = true;
                    card.states.hover.can = false;
                    card.states.drag.can = false;
                    card.vortex = true && !args.no_vortex;
                    card.T.r = angle;
                    return [card, card_pos];
                };
                G.vortex_time = G.TIMERS.REAL;
                let temp_del = undefined;
                for (let i = 1; i <= 200; i++) {
                    temp_del = temp_del || 3;
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", blockable: false, delay: temp_del, func: function () {
                            let [card, card_pos] = make_splash_card({ scale: 2 - i / 300 });
                            let speed = Math.max(2 - i * 0.005, 0.001);
                            ease_value(card.T, "scale", -card.T.scale, undefined, undefined, undefined, 1 * speed, "elastic");
                            ease_value(card.T, "x", -card_pos.x, undefined, undefined, undefined, 0.9 * speed);
                            ease_value(card.T, "y", -card_pos.y, undefined, undefined, undefined, 0.9 * speed);
                            let temp_pitch = i * 0.007 + 0.6;
                            let temp_i = i;
                            G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
                                    if (card.T.scale <= 0) {
                                        if (temp_i < 30) {
                                            play_sound("whoosh1", temp_pitch + Math.random() * 0.05, 0.25 * (1 - temp_i / 50));
                                        }
                                        if (temp_i === 15) {
                                            play_sound("whoosh_long", 0.9, 0.7);
                                        }
                                        G.VIBRATION = G.VIBRATION + 0.1;
                                        card.remove();
                                        return true;
                                    }
                                } }));
                            return true;
                        } }));
                    temp_del = temp_del + Math.max(1 / i, Math.max(0.2 * (170 - i) / 500, 0.016));
                }
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 2, func: function () {
                        G.SPLASH_BACK.remove();
                        G.SPLASH_BACK = G.SPLASH_FRONT;
                        G.SPLASH_FRONT = undefined;
                        G.main_menu("splash");
                        return true;
                    } }));
                return true;
            } }));
    };
    main_menu(change_context) {
        if (change_context !== "splash") {
            G.TIMERS.REAL = 12;
            G.TIMERS.TOTAL = 12;
        }
        else {
            RESET_STATES(G.STATES.MENU);
        }
        this.prep_stage(G.STAGES.MAIN_MENU, G.STATES.MENU, true);
        this.GAME.selected_back = new Back(G.P_CENTERS.b_red);
        if (!G.SETTINGS.tutorial_complete && G.SETTINGS.tutorial_progress?.completed_parts["big_blind"]) {
            G.SETTINGS.tutorial_complete = true;
        }
        G.FUNCS.change_shadows({ to_key: G.SETTINGS.GRAPHICS.shadows === "On" && 1 || 2 });
        ease_background_colour({ new_colour: G.C.BLACK, contrast: 1 });
        if (G.SPLASH_FRONT) {
            G.SPLASH_FRONT.remove();
            G.SPLASH_FRONT = undefined;
        }
        if (G.SPLASH_BACK) {
            G.SPLASH_BACK.remove();
            G.SPLASH_BACK = undefined;
        }
        G.SPLASH_BACK = new Sprite(-30, -13, G.ROOM.T.w + 60, G.ROOM.T.h + 22, G.ASSET_ATLAS["ui_1"], { x: 2, y: 0 });
        G.SPLASH_BACK.set_alignment({ major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } });
        let splash_args = { mid_flash: change_context === "splash" && 1.6 || 0 };
        ease_value(splash_args, "mid_flash", -(change_context === "splash" && 1.6 || 0), undefined, undefined, undefined, 4);
        G.SPLASH_BACK.define_draw_steps([{ shader: "splash", send: [{ name: "time", ref_table: G.TIMERS, ref_value: "REAL_SHADER" }, { name: "vort_speed", val: 0.4 }, { name: "colour_1", ref_table: G.C, ref_value: "RED" }, { name: "colour_2", ref_table: G.C, ref_value: "BLUE" }, { name: "mid_flash", ref_table: splash_args, ref_value: "mid_flash" }, { name: "vort_offset", val: 0 }] }]);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                unlock_notify();
                return true;
            } }));
        let SC_scale = 1.1 * (G.debug_splash_size_toggle && 0.8 || 1);
        let CAI = { TITLE_TOP_W: G.CARD_W, TITLE_TOP_H: G.CARD_H };
        this.title_top = new CardArea(0, 0, CAI.TITLE_TOP_W, CAI.TITLE_TOP_H, { card_limit: 1, type: "title" });
        G.SPLASH_LOGO = new Sprite(0, 0, 13 * SC_scale, 13 * SC_scale * (G.ASSET_ATLAS["balatro"].py / G.ASSET_ATLAS["balatro"].px), G.ASSET_ATLAS["balatro"], { x: 0, y: 0 });
        G.SPLASH_LOGO.set_alignment({ major: G.title_top, type: "cm", bond: "Strong", offset: { x: 0, y: 0 } });
        G.SPLASH_LOGO.define_draw_steps([{ shader: "dissolve" }]);
        G.SPLASH_LOGO.dissolve_colours = [G.C.WHITE, G.C.WHITE];
        G.SPLASH_LOGO.dissolve = 1;
        let replace_card = new Card(this.title_top.T.x, this.title_top.T.y, 1.2 * G.CARD_W * SC_scale, 1.2 * G.CARD_H * SC_scale, G.P_CARDS.S_A, G.P_CENTERS.c_base);
        this.title_top.emplace(replace_card);
        replace_card.states.visible = false;
        replace_card.no_ui = true;
        replace_card.ambient_tilt = 0;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: change_context === "game" && 1.5 || 0, blockable: false, blocking: false, func: function () {
                if (change_context === "splash") {
                    replace_card.states.visible = true;
                    replace_card.start_materialize([G.C.WHITE, G.C.WHITE], true, 2.5);
                    play_sound("whoosh1", Math.random() * 0.1 + 0.3, 0.3);
                    play_sound("crumple" + Math.random(1, 5), Math.random() * 0.2 + 0.6, 0.65);
                }
                else {
                    replace_card.states.visible = true;
                    replace_card.start_materialize([G.C.WHITE, G.C.WHITE], undefined, 1.2);
                }
                G.VIBRATION = G.VIBRATION + 1;
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: change_context === "splash" && 1.8 || change_context === "game" && 2 || 0.5, blockable: false, blocking: false, func: function () {
                play_sound("magic_crumple" + (change_context === "splash" && 2 || 3), change_context === "splash" && 1 || 1.3, 0.9);
                play_sound("whoosh1", 0.4, 0.8);
                ease_value(G.SPLASH_LOGO, "dissolve", -1, undefined, undefined, undefined, change_context === "splash" && 2.3 || 0.9);
                G.VIBRATION = G.VIBRATION + 1.5;
                return true;
            } }));
        delay(0.1 + (change_context === "splash" && 2 || change_context === "game" && 1.5 || 0));
        if (replace_card && G.P_CENTERS.j_blueprint.unlocked) {
            let viable_unlockables = {};
            for (const [k, v] of Array.prototype.entries.call(this.P_LOCKED)) {
                if ((v.set === "Voucher" || v.set === "Joker") && !v.demo) {
                    viable_unlockables[viable_unlockables.length + 1] = v;
                }
            }
            if (viable_unlockables.length > 0) {
                let card;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 4.04, func: function () {
                        card = new Card(this.title_top.T.x, this.title_top.T.y, 1.2 * G.CARD_W * SC_scale, 1.2 * G.CARD_H * SC_scale, undefined, pseudorandom_element(viable_unlockables) || this.P_CENTERS.j_joker);
                        card.no_ui = viable_unlockables.length === 0;
                        card.states.visible = false;
                        replace_card.parent = undefined;
                        replace_card.start_dissolve([G.C.BLACK, G.C.ORANGE, G.C.RED, G.C.GOLD]);
                        return true;
                    } }));
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.04, func: function () {
                        card.start_materialize();
                        this.title_top.emplace(card);
                        return true;
                    } }));
            }
        }
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                G.CONTROLLER.lock_input = false;
                return true;
            } }));
        set_screen_positions();
        this.title_top.sort("order");
        this.title_top.set_ranks();
        this.title_top.align_cards();
        this.title_top.hard_set_cards();
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: change_context === "splash" && 4.05 || change_context === "game" && 3 || 1.5, blockable: false, blocking: false, func: function () {
                set_main_menu_UI();
                return true;
            } }));
        for (const [k, v] of Object.entries(G.PROFILES[G.SETTINGS.profile??""].career_stats)) {
            check_for_unlock({ type: "career_stat", statname: k });
        }
        check_for_unlock({ type: "blind_discoveries" });
        G.E_MANAGER.add_event(new GameEvent({ blockable: false, func: function () {
                set_discover_tallies();
                set_profile_progress();
                G.REFRESH_ALERTS = true;
                return true;
            } }));
        new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.UI.TRANSPARENT_DARK }, nodes: [{ n: G.UIT.T, config: { text: G.VERSION, scale: 0.3, colour: G.C.UI.TEXT_LIGHT } }] }, config: { align: "tri", offset: { x: 0, y: 0 }, major: G.ROOM_ATTACH, bond: "Weak" } });
    };
    demo_cta() {
        this.prep_stage(G.STAGES.MAIN_MENU, G.STATES.DEMO_CTA, true);
        this.GAME.selected_back = new Back(G.P_CENTERS.b_red);
        G.FUNCS.change_shadows({ to_key: G.SETTINGS.GRAPHICS.shadows === "On" && 1 || 2 });
        ease_background_colour({ new_colour: G.C.BLACK, contrast: 1 });
        if (G.SPLASH_FRONT) {
            G.SPLASH_FRONT.remove();
            G.SPLASH_FRONT = undefined;
        }
        if (G.SPLASH_BACK) {
            G.SPLASH_BACK.remove();
            G.SPLASH_BACK = undefined;
        }
        G.SPLASH_BACK = new Sprite(-30, -13, G.ROOM.T.w + 60, G.ROOM.T.h + 22, G.ASSET_ATLAS["ui_1"], { x: 2, y: 0 });
        G.SPLASH_BACK.set_alignment({ major: G.ROOM_ATTACH, type: "cm", offset: { x: 0, y: 0 } });
        let splash_args = { mid_flash: 1.6 };
        ease_value(splash_args, "mid_flash", -1.6, undefined, undefined, undefined, 4);
        G.SPLASH_BACK.define_draw_steps([{ shader: "splash", send: [{ name: "time", ref_table: G.TIMERS, ref_value: "REAL_SHADER" }, { name: "vort_speed", val: 0.4 }, { name: "colour_1", ref_table: G.C, ref_value: "RED" }, { name: "colour_2", ref_table: G.C, ref_value: "BLUE" }, { name: "mid_flash", ref_table: splash_args, ref_value: "mid_flash" }, { name: "vort_offset", val: 0 }] }]);
        let SC_scale = 0.9 * (G.debug_splash_size_toggle && 0.8 || 1);
        let CAI = { TITLE_TOP_W: G.CARD_W, TITLE_TOP_H: G.CARD_H };
        this.title_top = new CardArea(0, 0, CAI.TITLE_TOP_W, CAI.TITLE_TOP_H, { card_limit: 1, type: "title" });
        G.SPLASH_LOGO = new Sprite(0, 0, 13 * SC_scale, 13 * SC_scale * (G.ASSET_ATLAS["balatro"].py / G.ASSET_ATLAS["balatro"].px), G.ASSET_ATLAS["balatro"], { x: 0, y: 0 });
        G.SPLASH_LOGO.set_alignment({ major: G.title_top, type: "cm", bond: "Strong", offset: { x: 0, y: 0 } });
        G.SPLASH_LOGO.define_draw_steps([{ shader: "dissolve" }]);
        G.SPLASH_LOGO.dissolve_colours = [G.C.WHITE, G.C.WHITE];
        G.SPLASH_LOGO.dissolve = 1;
        let replace_card = new Card(this.title_top.T.x, this.title_top.T.y, 1.2 * G.CARD_W * SC_scale, 1.2 * G.CARD_H * SC_scale, G.P_CARDS.S_A, G.P_CENTERS.c_base);
        this.title_top.emplace(replace_card);
        replace_card.states.visible = false;
        replace_card.no_ui = true;
        replace_card.ambient_tilt = 0;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.1, blockable: false, blocking: false, func: function () {
                replace_card.states.visible = true;
                replace_card.start_materialize([G.C.WHITE, G.C.WHITE], true, 2.5);
                play_sound("whoosh1", Math.random() * 0.1 + 0.3, 0.3);
                play_sound("crumple" + Math.random(1, 5), Math.random() * 0.2 + 0.6, 0.65);
                return true;
            } }));
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 1.8, blockable: false, blocking: false, func: function () {
                play_sound("magic_crumple" + 2, 1, 0.9);
                play_sound("whoosh1", 0.4, 0.8);
                ease_value(G.SPLASH_LOGO, "dissolve", -1, undefined, undefined, undefined, 2.3);
                return true;
            } }));
        delay(0.1 + 2);
        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                G.CONTROLLER.lock_input = false;
                return true;
            } }));
        set_screen_positions();
        this.title_top.sort("order");
        this.title_top.set_ranks();
        this.title_top.align_cards();
        this.title_top.hard_set_cards();
        let playstack = new Sprite(0, 0, 1.7, 1.7, G.ASSET_ATLAS["playstack_logo"], { x: 0, y: 0 });
        playstack.states.drag.can = false;
        let localthunk = new Sprite(0, 0, 1 * 1390 / 560, 1, G.ASSET_ATLAS["localthunk_logo"], { x: 0, y: 0 });
        localthunk.states.drag.can = false;
        this.MAIN_MENU_UI = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR }, nodes: [{ n: G.UIT.R, config: { align: "cm", padding: 0.3 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ string: ["Sign up for the next demo!"], colours: [G.C.WHITE], shadow: true, rotate: true, float: true, bump: true, scale: 0.9, spacing: 1, pop_in: 4.5 }) } }] }, { n: G.UIT.R, config: { align: "cm", padding: 0.3 }, nodes: [{ n: G.UIT.C, config: { align: "cl", minw: 5, minh: 1 }, nodes: [UIBox_button({ button: "go_to_menu", colour: G.C.ORANGE, minw: 2, minh: 1, label: ["BACK"], scale: 0.4, col: true })] }, UIBox_button({ id: "demo_cta_playbalatro", button: "go_to_playbalatro", colour: G.C.BLUE, minw: 7.65, minh: 1.95, label: ["PLAYBALATRO.COM"], scale: 0.9, col: true }), { n: G.UIT.C, config: { align: "cr", minw: 5, minh: 1 }, nodes: [{ n: G.UIT.O, config: { object: localthunk } }, { n: G.UIT.O, config: { object: playstack } }] }] }] }, config: { align: "bmi", offset: { x: 0, y: 10 }, major: G.ROOM_ATTACH, bond: "Weak" } });
        this.MAIN_MENU_UI.states.visible = false;
        G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 4.05, blockable: false, blocking: false, func: function () {
                this.MAIN_MENU_UI.states.visible = true;
                this.MAIN_MENU_UI.alignment.offset.y = 0;
                this.MAIN_MENU_UI.align_to_major();
                G.CONTROLLER.snap_to({ node: this.MAIN_MENU_UI.get_UIE_by_ID("demo_cta_playbalatro") });
                return true;
            } }));
    };
    init_game_object() {
        let cards_played = {};
        for (const [_, v] of Array.prototype.entries.call(SMODS.Rank.obj_buffer)) {
            cards_played[v] = { suits: {}, total: 0 };
        }
        let bosses_used = {};
        for (const [k, v] of Object.entries(G.P_BLINDS)) {
            if (v.boss) {
                bosses_used[k] = 0;
            }
        }
        return { 
            won: false,
            round_scores: { furthest_ante: { label: "Ante", amt: 0 }, furthest_round: { label: "Round", amt: 0 }, hand: { label: "Best Hand", amt: 0 }, poker_hand: { label: "Most Played Hand", amt: 0 }, new_collection: { label: "New Discoveries", amt: 0 }, cards_played: { label: "Cards Played", amt: 0 }, cards_discarded: { label: "Cards Discarded", amt: 0 }, times_rerolled: { label: "Times Rerolled", amt: 0 }, cards_purchased: { label: "Cards Purchased", amt: 0 } },
            joker_usage: {},
            consumeable_usage: {},
            hand_usage: {},
            last_tarot_planet: undefined,
            win_ante: 8,
            stake: 1,
            modifiers: {},
            starting_params: get_starting_params(),
            banned_keys: {},
            round: 0,
            probabilities: { normal: 1 },
            bosses_used: bosses_used,
            pseudorandom: {},
            starting_deck_size: 52,
            ecto_minus: 1,
            pack_size: 2,
            skips: 0,
            STOP_USE: 0,
            edition_rate: 1,
            joker_rate: 20,
            tarot_rate: 4,
            planet_rate: 4,
            spectral_rate: 0,
            playing_card_rate: 0,
            consumeable_buffer: 0,
            joker_buffer: 0,
            discount_percent: 0,
            interest_cap: 25,
            interest_amount: 1,
            inflation: 0,
            hands_played: 0,
            unused_discards: 0,
            perishable_rounds: 5,
            rental_rate: 3,
            blind: undefined,
            chips: 0,
            chips_text: "0",
            voucher_text: "",
            dollars: 0,
            max_jokers: 0,
            bankrupt_at: 0,
            current_boss_streak: 0,
            base_reroll_cost: 5,
            blind_on_deck: undefined,
            sort: "desc",
            previous_round: { dollars: 4 },
            tags: {},
            tag_tally: 0,
            pool_flags: {},
            used_jokers: {},
            used_vouchers: {},
            current_round: { current_hand: { chips: 0, chip_text: "0", mult: 0, mult_text: "0", chip_total: 0, chip_total_text: "", handname: "", hand_level: "" }, used_packs: {}, cards_flipped: 0, round_text: "Round ", idol_card: { suit: "Spades", rank: "Ace" }, mail_card: { rank: "Ace" }, ancient_card: { suit: "Spades" }, castle_card: { suit: "Spades" }, hands_left: 0, hands_played: 0, discards_left: 0, discards_used: 0, dollars: 0, reroll_cost: 5, reroll_cost_increase: 0, jokers_purchased: 0, free_rerolls: 0, round_dollars: 0, dollars_to_be_earned: "!!!", most_played_poker_hand: "High Card" },
            round_resets: { hands: 1, discards: 1, reroll_cost: 1, temp_reroll_cost: undefined, temp_handsize: undefined, ante: 1, blind_ante: 1, blind_states: { Small: "Select", Big: "Upcoming", Boss: "Upcoming" }, loc_blind_states: { Small: "", Big: "", Boss: "" }, blind_choices: { Small: "bl_small", Big: "bl_big" }, boss_rerolled: false },
            round_bonus: { next_hands: 0, discards: 0 },
            shop: { joker_max: 2 },
            cards_played: cards_played,
            disabled_suits: {},
            disabled_ranks: {},
            hands: { ["Flush Five"]: { visible: false, order: 1, mult: 16, chips: 160, s_mult: 16, s_chips: 160, level: 1, l_mult: 3, l_chips: 50, played: 0, played_this_round: 0, example: [["S_A", true], ["S_A", true], ["S_A", true], ["S_A", true], ["S_A", true]] }, ["Flush House"]: { visible: false, order: 2, mult: 14, chips: 140, s_mult: 14, s_chips: 140, level: 1, l_mult: 4, l_chips: 40, played: 0, played_this_round: 0, example: [["D_7", true], ["D_7", true], ["D_7", true], ["D_4", true], ["D_4", true]] }, ["Five of a Kind"]: { visible: false, order: 3, mult: 12, chips: 120, s_mult: 12, s_chips: 120, level: 1, l_mult: 3, l_chips: 35, played: 0, played_this_round: 0, example: [["S_A", true], ["H_A", true], ["H_A", true], ["C_A", true], ["D_A", true]] }, ["Straight Flush"]: { visible: true, order: 4, mult: 8, chips: 100, s_mult: 8, s_chips: 100, level: 1, l_mult: 4, l_chips: 40, played: 0, played_this_round: 0, example: [["S_Q", true], ["S_J", true], ["S_T", true], ["S_9", true], ["S_8", true]] }, ["Four of a Kind"]: { visible: true, order: 5, mult: 7, chips: 60, s_mult: 7, s_chips: 60, level: 1, l_mult: 3, l_chips: 30, played: 0, played_this_round: 0, example: [["S_J", true], ["H_J", true], ["C_J", true], ["D_J", true], ["C_3", false]] }, ["Full House"]: { visible: true, order: 6, mult: 4, chips: 40, s_mult: 4, s_chips: 40, level: 1, l_mult: 2, l_chips: 25, played: 0, played_this_round: 0, example: [["H_K", true], ["C_K", true], ["D_K", true], ["S_2", true], ["D_2", true]] }, ["Flush"]: { visible: true, order: 7, mult: 4, chips: 35, s_mult: 4, s_chips: 35, level: 1, l_mult: 2, l_chips: 15, played: 0, played_this_round: 0, example: [["H_A", true], ["H_K", true], ["H_T", true], ["H_5", true], ["H_4", true]] }, ["Straight"]: { visible: true, order: 8, mult: 4, chips: 30, s_mult: 4, s_chips: 30, level: 1, l_mult: 3, l_chips: 30, played: 0, played_this_round: 0, example: [["D_J", true], ["C_T", true], ["C_9", true], ["S_8", true], ["H_7", true]] }, ["Three of a Kind"]: { visible: true, order: 9, mult: 3, chips: 30, s_mult: 3, s_chips: 30, level: 1, l_mult: 2, l_chips: 20, played: 0, played_this_round: 0, example: [["S_T", true], ["C_T", true], ["D_T", true], ["H_6", false], ["D_5", false]] }, ["Two Pair"]: { visible: true, order: 10, mult: 2, chips: 20, s_mult: 2, s_chips: 20, level: 1, l_mult: 1, l_chips: 20, played: 0, played_this_round: 0, example: [["H_A", true], ["D_A", true], ["C_Q", false], ["H_4", true], ["C_4", true]] }, ["Pair"]: { visible: true, order: 11, mult: 2, chips: 10, s_mult: 2, s_chips: 10, level: 1, l_mult: 1, l_chips: 15, played: 0, played_this_round: 0, example: [["S_K", false], ["S_9", true], ["D_9", true], ["H_6", false], ["D_3", false]] }, ["High Card"]: { visible: true, order: 12, mult: 1, chips: 5, s_mult: 1, s_chips: 5, level: 1, l_mult: 1, l_chips: 10, played: 0, played_this_round: 0, example: [["S_A", true], ["D_Q", false], ["D_9", false], ["C_4", false], ["D_3", false]] } }
        };
    };
    start_run(args) {
        args = args || {};
        let saveTable = args.savetext || undefined;
        G.SAVED_GAME = undefined;
        this.prep_stage(G.STAGES.RUN, saveTable && saveTable.STATE || G.STATES.BLIND_SELECT);
        G.STAGE = G.STAGES.RUN;
        if (saveTable) {
            check_for_unlock({ type: "continue_game" });
        }
        G.STATE_COMPLETE = false;
        G.RESET_BLIND_STATES = true;
        if (!saveTable) {
            ease_background_colour_blind(G.STATE, "Small Blind");
        }
        else {
            ease_background_colour_blind(G.STATE, saveTable.BLIND.name.gsub("%s+", "") !== "" && saveTable.BLIND.name || "Small Blind");
        }
        let selected_back = saveTable && saveTable.BACK.name || args.challenge && args.challenge.deck && args.challenge.deck.type || this.GAME.viewed_back && this.GAME.viewed_back.name || this.GAME.selected_back && this.GAME.selected_back.name || "Red Deck";
        selected_back = get_deck_from_name(selected_back);
        this.GAME = saveTable && saveTable.GAME || this.init_game_object();
        this.GAME.modifiers = this.GAME.modifiers || {};
        this.GAME.stake = args.stake || this.GAME.stake || 1;
        this.GAME.STOP_USE = 0;
        this.GAME.selected_back = new Back(selected_back);
        this.GAME.selected_back_key = selected_back;
        [G.C.UI_CHIPS[1], G.C.UI_CHIPS[2], G.C.UI_CHIPS[3], G.C.UI_CHIPS[4]] = [G.C.BLUE[1], G.C.BLUE[2], G.C.BLUE[3], G.C.BLUE[4]];
        [G.C.UI_MULT[1], G.C.UI_MULT[2], G.C.UI_MULT[3], G.C.UI_MULT[4]] = [G.C.RED[1], G.C.RED[2], G.C.RED[3], G.C.RED[4]];
        if (!saveTable) {
            if (false) {
                if (this.GAME.stake >= 2) {
                    this.GAME.modifiers.no_blind_reward = this.GAME.modifiers.no_blind_reward || {};
                    this.GAME.modifiers.no_blind_reward.Small = true;
                }
                if (this.GAME.stake >= 3) {
                    this.GAME.modifiers.scaling = 2;
                }
                if (this.GAME.stake >= 4) {
                    this.GAME.modifiers.enable_eternals_in_shop = true;
                }
                if (this.GAME.stake >= 5) {
                    this.GAME.starting_params.discards = this.GAME.starting_params.discards - 1;
                }
                if (this.GAME.stake >= 6) {
                    this.GAME.modifiers.scaling = 3;
                }
                if (this.GAME.stake >= 7) {
                    this.GAME.modifiers.enable_perishables_in_shop = true;
                }
                if (this.GAME.stake >= 8) {
                    this.GAME.modifiers.enable_rentals_in_shop = true;
                }
            }
            SMODS.setup_stake(this.GAME.stake);
            this.GAME.selected_back.apply_to_run();
            if (args.challenge) {
                this.GAME.challenge = args.challenge.id;
                this.GAME.challenge_tab = args.challenge;
                let _ch = args.challenge;
                if (_ch.jokers) {
                    for (const [k, v] of Array.prototype.entries.call(_ch.jokers)) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                let _joker = add_joker(v.id, v.edition, k !== 1);
                                if (v.eternal) {
                                    _joker.set_eternal(true);
                                }
                                if (v.pinned) {
                                    _joker.pinned = true;
                                }
                                return true;
                            } }));
                    }
                }
                if (_ch.consumeables) {
                    for (const [k, v] of Array.prototype.entries.call(_ch.consumeables)) {
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                add_joker(v.id, undefined, k !== 1);
                                return true;
                            } }));
                    }
                }
                if (_ch.vouchers) {
                    for (const [k, v] of Array.prototype.entries.call(_ch.vouchers)) {
                        G.GAME.used_vouchers[v.id] = true;
                        G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                G.GAME.starting_voucher_count = (G.GAME.starting_voucher_count || 0) + 1;
                                Card.apply_to_run(undefined, G.P_CENTERS[v.id]);
                                return true;
                            } }));
                    }
                }
                if (_ch.rules) {
                    if (_ch.rules.modifiers) {
                        for (const [k, v] of Array.prototype.entries.call(_ch.rules.modifiers)) {
                            this.GAME.starting_params[v.id] = v.value;
                        }
                    }
                    if (_ch.rules.custom) {
                        for (const [k, v] of Array.prototype.entries.call(_ch.rules.custom)) {
                            if (v.id === "no_reward") {
                                this.GAME.modifiers.no_blind_reward = this.GAME.modifiers.no_blind_reward || {};
                                this.GAME.modifiers.no_blind_reward.Small = true;
                                this.GAME.modifiers.no_blind_reward.Big = true;
                                this.GAME.modifiers.no_blind_reward.Boss = true;
                            }
                            else if (v.id === "no_reward_specific") {
                                this.GAME.modifiers.no_blind_reward = this.GAME.modifiers.no_blind_reward || {};
                                this.GAME.modifiers.no_blind_reward[v.value] = true;
                            }
                            else if (v.value) {
                                this.GAME.modifiers[v.id] = v.value;
                            }
                            else if (v.id === "no_shop_jokers") {
                                this.GAME.joker_rate = 0;
                            }
                            else {
                                this.GAME.modifiers[v.id] = true;
                            }
                        }
                    }
                }
                if (_ch.restrictions) {
                    if (_ch.restrictions.banned_cards) {
                        for (const [k, v] of Array.prototype.entries.call(_ch.restrictions.banned_cards)) {
                            G.GAME.banned_keys[v.id] = true;
                            if (v.ids) {
                                for (const [kk, vv] of Array.prototype.entries.call(v.ids)) {
                                    G.GAME.banned_keys[vv] = true;
                                }
                            }
                        }
                    }
                    if (_ch.restrictions.banned_tags) {
                        for (const [k, v] of Array.prototype.entries.call(_ch.restrictions.banned_tags)) {
                            G.GAME.banned_keys[v.id] = true;
                        }
                    }
                    if (_ch.restrictions.banned_other) {
                        for (const [k, v] of Array.prototype.entries.call(_ch.restrictions.banned_other)) {
                            G.GAME.banned_keys[v.id] = true;
                        }
                    }
                }
            }
            this.GAME.round_resets.hands = this.GAME.starting_params.hands;
            this.GAME.round_resets.discards = this.GAME.starting_params.discards;
            this.GAME.round_resets.reroll_cost = this.GAME.starting_params.reroll_cost;
            this.GAME.dollars = this.GAME.starting_params.dollars;
            this.GAME.base_reroll_cost = this.GAME.starting_params.reroll_cost;
            this.GAME.round_resets.reroll_cost = this.GAME.base_reroll_cost;
            this.GAME.current_round.reroll_cost = this.GAME.base_reroll_cost;
        }
        G.GAME.chips_text = "";
        if (!saveTable) {
            if (args.seed) {
                this.GAME.seeded = true;
            }
            this.GAME.pseudorandom.seed = args.seed || !(G.SETTINGS.tutorial_complete || G.SETTINGS.tutorial_progress?.completed_parts["big_blind"]) && "TUTORIAL" || generate_starting_seed();
        }
        for (const [k, v] of Object.entries(this.GAME.pseudorandom)) {
            if (v === 0) {
                this.GAME.pseudorandom[k] = pseudohash(k + this.GAME.pseudorandom.seed);
            }
        }
        this.GAME.pseudorandom.hashed_seed = pseudohash(this.GAME.pseudorandom.seed);
        G.save_settings();
        if (!this.GAME.round_resets.blind_tags) {
            this.GAME.round_resets.blind_tags = {};
        }
        if (!saveTable) {
            this.GAME.round_resets.blind_choices.Boss = get_new_boss();
            this.GAME.current_round.voucher = G.SETTINGS.tutorial_progress && G.SETTINGS.tutorial_progress.forced_voucher || get_next_voucher_key();
            this.GAME.round_resets.blind_tags.Small = G.SETTINGS.tutorial_progress && G.SETTINGS.tutorial_progress.forced_tags && G.SETTINGS.tutorial_progress.forced_tags[1] || get_next_tag_key();
            this.GAME.round_resets.blind_tags.Big = G.SETTINGS.tutorial_progress && G.SETTINGS.tutorial_progress.forced_tags && G.SETTINGS.tutorial_progress.forced_tags[2] || get_next_tag_key();
        }
        else {
            if (this.GAME.round_resets.blind && this.GAME.round_resets.blind.key) {
                this.GAME.round_resets.blind = G.P_BLINDS[this.GAME.round_resets.blind.key];
            }
        }
        G.CONTROLLER.locks.load = true;
        G.E_MANAGER.add_event(new GameEvent({ no_delete: true, trigger: "after", blocking: false, blockable: false, delay: 3.5, timer: "TOTAL", func: function () {
                G.CONTROLLER.locks.load = undefined;
                return true;
            } }));
        if (saveTable && saveTable.ACTION) {
            G.E_MANAGER.add_event(new GameEvent({ delay: 0.5, trigger: "after", blocking: false, blockable: false, func: function () {
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                    for (const [k, v] of Object.entries(G.I.CARD)) {
                                        if (v.sort_id === saveTable.ACTION.card) {
                                            G.FUNCS.use_card({ config: { ref_table: v } }, undefined, true);
                                        }
                                    }
                                    return true;
                                } }));
                            return true;
                        } }));
                    return true;
                } }));
        }
        let CAI = { discard_W: G.CARD_W, discard_H: G.CARD_H, deck_W: G.CARD_W * 1.1, deck_H: 0.95 * G.CARD_H, hand_W: 6 * G.CARD_W, hand_H: 0.95 * G.CARD_H, play_W: 5.3 * G.CARD_W, play_H: 0.95 * G.CARD_H, joker_W: 4.9 * G.CARD_W, joker_H: 0.95 * G.CARD_H, consumeable_W: 2.3 * G.CARD_W, consumeable_H: 0.95 * G.CARD_H };
        this.consumeables = new CardArea(0, 0, CAI.consumeable_W, CAI.consumeable_H, { card_limit: this.GAME.starting_params.consumable_slots, type: "joker", highlight_limit: 1 });
        this.jokers = new CardArea(0, 0, CAI.joker_W, CAI.joker_H, { card_limit: this.GAME.starting_params.joker_slots, type: "joker", highlight_limit: 1 });
        this.discard = new CardArea(0, 0, CAI.discard_W, CAI.discard_H, { card_limit: 500, type: "discard" });
        this.vouchers = new CardArea(G.discard.T.x, G.discard.T.y, G.discard.T.w, G.discard.T.h, { type: "discard", card_limit: 1e+308 });
        this.deck = new CardArea(0, 0, CAI.deck_W, CAI.deck_H, { card_limit: 52, type: "deck" });
        this.hand = new CardArea(0, 0, CAI.hand_W, CAI.hand_H, { card_limit: this.GAME.starting_params.hand_size, type: "hand" });
        this.play = new CardArea(0, 0, CAI.play_W, CAI.play_H, { card_limit: 5, type: "play" });
        G.playing_cards = {};
        set_screen_positions();
        G.SPLASH_BACK = new Sprite(-30, -6, G.ROOM.T.w + 60, G.ROOM.T.h + 12, G.ASSET_ATLAS["ui_1"], { x: 2, y: 0 });
        G.SPLASH_BACK.set_alignment({ major: G.play, type: "cm", bond: "Strong", offset: { x: 0, y: 0 } });
        G.ARGS.spin = { amount: 0, real: 0, eased: 0 };
        G.SPLASH_BACK.define_draw_steps([{ shader: "background", send: [{ name: "time", ref_table: G.TIMERS, ref_value: "REAL_SHADER" }, { name: "spin_time", ref_table: G.TIMERS, ref_value: "BACKGROUND" }, { name: "colour_1", ref_table: G.C.BACKGROUND, ref_value: "C" }, { name: "colour_2", ref_table: G.C.BACKGROUND, ref_value: "L" }, { name: "colour_3", ref_table: G.C.BACKGROUND, ref_value: "D" }, { name: "contrast", ref_table: G.C.BACKGROUND, ref_value: "contrast" }, { name: "spin_amount", ref_table: G.ARGS.spin, ref_value: "amount" }] }]);
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", blocking: false, blockable: false, func: function () {
                let _dt = G.ARGS.spin.amount > G.ARGS.spin.eased && G.real_dt * 2 || 0.3 * G.real_dt;
                let delta = G.ARGS.spin.real - G.ARGS.spin.eased;
                if (Math.abs(delta) > _dt) {
                    delta = delta * _dt / Math.abs(delta);
                }
                G.ARGS.spin.eased = G.ARGS.spin.eased + delta;
                G.ARGS.spin.amount = _dt * G.ARGS.spin.eased + (1 - _dt) * G.ARGS.spin.amount;
                G.TIMERS.BACKGROUND = G.TIMERS.BACKGROUND - 60 * (G.ARGS.spin.eased - G.ARGS.spin.amount) * _dt;
            } }));
        if (saveTable) {
            let cardAreas = saveTable.cardAreas;
            for (const [k, v] of Object.entries(cardAreas)) {
                if (G[k]) {
                    G[k].load(v);
                }
                else {
                    G["load_" + k] = v;
                    print("ERROR LOADING GAME: Card area '" + (k + "' not instantiated before load"));
                }
            }
            for (const [k, v] of Object.entries(G.I.CARD)) {
                if (v.playing_card) {
                    Array.prototype.push.call(G.playing_cards, v);
                }
            }
            for (const [k, v] of Object.entries(G.I.CARDAREA)) {
                v.align_cards();
                v.hard_set_cards();
            }
            Array.prototype.sort.call(G.playing_cards, function (a, b) {
                return a.playing_card > b.playing_card;
            });
        }
        else {
            let card_protos = undefined;
            let _de = undefined;
            if (args.challenge && args.challenge.deck) {
                _de = args.challenge.deck;
            }
            if (_de && _de.cards) {
                card_protos = _de.cards;
            }
            if (!card_protos) {
                card_protos = {};
                for (const [k, v] of Object.entries(this.P_CARDS)) {
                    if (!(typeof (SMODS.Ranks[v.value].in_pool) === "function" && !SMODS.Ranks[v.value].in_pool({ initial_deck: true, suit: v.suit }) || typeof (SMODS.Suits[v.suit].in_pool) === "function" && !SMODS.Suits[v.suit].in_pool({ initial_deck: true, rank: v.value }))) {
                        let _ = undefined;
                        if (this.GAME.starting_params.erratic_suits_and_ranks) {
                            [v, k] = pseudorandom_element(G.P_CARDS, pseudoseed("erratic"), { starting_deck: true });
                        }
                        let [_r, _s] = [SMODS.Ranks[v.value].card_key, SMODS.Suits[v.suit].card_key];
                        let [keep, _e, _d, _g] = [true, undefined, undefined, undefined];
                        if (_de) {
                            if (_de.yes_ranks && !_de.yes_ranks[_r]) {
                                keep = false;
                            }
                            if (_de.no_ranks && _de.no_ranks[_r]) {
                                keep = false;
                            }
                            if (_de.yes_suits && !_de.yes_suits[_s]) {
                                keep = false;
                            }
                            if (_de.no_suits && _de.no_suits[_s]) {
                                keep = false;
                            }
                            if (_de.enhancement) {
                                _e = _de.enhancement;
                            }
                            if (_de.edition) {
                                _d = _de.edition;
                            }
                            if (_de.gold_seal) {
                                _g = _de.gold_seal;
                            }
                        }
                        if (this.GAME.starting_params.no_faces && SMODS.Ranks[v.value].face) {
                            keep = false;
                        }
                        if (keep) {
                            card_protos[card_protos.length + 1] = { s: _s, r: _r, e: _e, d: _d, g: _g };
                        }
                    }
                }
            }
            if (this.GAME.starting_params.extra_cards) {
                for (const [k, v] of Object.entries(this.GAME.starting_params.extra_cards)) {
                    card_protos[card_protos.length + 1] = v;
                }
            }
            Array.prototype.sort.call(card_protos, function (a, b) {
                return (a.s || "") + ((a.r || "") + ((a.e || "") + ((a.d || "") + (a.g || "")))) < (b.s || "") + ((b.r || "") + ((b.e || "") + ((b.d || "") + (b.g || ""))));
            });
            for (const [k, v] of Array.prototype.entries.call(card_protos)) {
                card_from_control(v);
            }
            this.GAME.starting_deck_size = G.playing_cards.length;
        }
        delay(0.5);
        if (!saveTable) {
            G.GAME.current_round.discards_left = G.GAME.round_resets.discards;
            G.GAME.current_round.hands_left = G.GAME.round_resets.hands;
            this.deck.shuffle();
            this.deck.hard_set_T();
            reset_idol_card();
            reset_mail_rank();
            this.GAME.current_round.ancient_card.suit = undefined;
            reset_ancient_card();
            reset_castle_card();
            for (const [_, mod] of Array.prototype.entries.call(SMODS.mod_list)) {
                if (mod.reset_game_globals && typeof (mod.reset_game_globals) === "function") {
                    mod.reset_game_globals(true);
                }
            }
        }
        G.GAME.blind = Blind(0, 0, 2, 1);
        this.deck.align_cards();
        this.deck.hard_set_cards();
        this.HUD = new UIBox({ definition: create_UIBox_HUD(), config: { align: "cli", offset: { x: -0.7, y: 0 }, major: G.ROOM_ATTACH } });
        this.HUD_blind = new UIBox({ definition: create_UIBox_HUD_blind(), config: { major: G.HUD.get_UIE_by_ID("row_blind_bottom"), align: "bmi", offset: { x: 0, y: -10 }, bond: "Weak" } });
        this.HUD_tags = {};
        G.hand_text_area = { chips: this.HUD.get_UIE_by_ID("hand_chips"), mult: this.HUD.get_UIE_by_ID("hand_mult"), ante: this.HUD.get_UIE_by_ID("ante_UI_count"), round: this.HUD.get_UIE_by_ID("round_UI_count"), chip_total: this.HUD.get_UIE_by_ID("hand_chip_total"), handname: this.HUD.get_UIE_by_ID("hand_name"), hand_level: this.HUD.get_UIE_by_ID("hand_level"), game_chips: this.HUD.get_UIE_by_ID("chip_UI_count"), blind_chips: this.HUD_blind.get_UIE_by_ID("HUD_blind_count"), blind_spacer: this.HUD.get_UIE_by_ID("blind_spacer") };
        check_and_set_high_score("most_money", G.GAME.dollars);
        if (saveTable) {
            G.GAME.blind.load(saveTable.BLIND);
            G.GAME.tags = {};
            let tags = saveTable.tags || {};
            for (const [k, v] of Array.prototype.entries.call(tags)) {
                let _tag = Tag("tag_uncommon");
                _tag.load(v);
                add_tag(_tag);
            }
        }
        else {
            G.GAME.blind.set_blind(undefined, undefined, true);
            reset_blinds();
        }
        G.FUNCS.blind_chip_UI_scale(G.hand_text_area.blind_chips);
        this.HUD.recalculate();
        G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                unlock_notify();
                return true;
            } }));
    };
    update(dt) {
        nuGC(undefined, undefined, true);
        G.MAJORS = 0;
        G.MINORS = 0;
        G.FRAMES.MOVE = G.FRAMES.MOVE + 1;
        timer_checkpoint("start->discovery", "update");
        if (!G.SETTINGS.tutorial_complete) {
            G.FUNCS.tutorial_controller();
        }
        timer_checkpoint("tallies", "update");
        modulate_sound(dt);
        timer_checkpoint("sounds", "update");
        update_canvas_juice(dt);
        timer_checkpoint("canvas and juice", "update");
        this.TIMERS.REAL = this.TIMERS.REAL + dt;
        this.TIMERS.REAL_SHADER = G.SETTINGS.reduced_motion && 300 || this.TIMERS.REAL;
        this.TIMERS.UPTIME = this.TIMERS.UPTIME + dt;
        this.SETTINGS.DEMO.total_uptime = (this.SETTINGS.DEMO.total_uptime || 0) + dt;
        this.TIMERS.BACKGROUND = this.TIMERS.BACKGROUND + dt * (G.ARGS.spin && G.ARGS.spin.amount || 0);
        this.real_dt = dt;
        if (this.real_dt > 0.05) {
            print("LONG DT @ " + (Math.floor(G.TIMERS.REAL) + (": " + this.real_dt)));
        }
        if (!G.fbf || G.new_frame) {
            G.new_frame = false;
            set_alerts();
            timer_checkpoint("alerts", "update");
            let http_resp = G.HTTP_MANAGER.in_channel.pop();
            if (http_resp) {
                G.ARGS.HIGH_SCORE_RESPONSE = http_resp;
            }
            if (G.SETTINGS.paused) {
                dt = 0;
            }
            if (G.STATE !== G.ACC_state) {
                G.ACC = 0;
            }
            G.ACC_state = G.STATE;
            if (G.STATE === G.STATES.HAND_PLAYED || G.STATE === G.STATES.NEW_ROUND) {
                G.ACC = Math.min((G.ACC || 0) + dt * 0.2 * this.SETTINGS.GAMESPEED, 16);
            }
            else {
                G.ACC = 0;
            }
            this.SPEEDFACTOR = G.STAGE === G.STAGES.RUN && !G.SETTINGS.paused && !G.screenwipe && this.SETTINGS.GAMESPEED || 1;
            this.SPEEDFACTOR = this.SPEEDFACTOR + Math.max(0, Math.abs(G.ACC) - 2);
            this.TIMERS.TOTAL = this.TIMERS.TOTAL + dt * this.SPEEDFACTOR;
            this.C.DARK_EDITION[1] = 0.6 + 0.2 * Math.sin(this.TIMERS.REAL * 1.3);
            this.C.DARK_EDITION[3] = 0.6 + 0.2 * (1 - Math.sin(this.TIMERS.REAL * 1.3));
            this.C.DARK_EDITION[2] = Math.min(this.C.DARK_EDITION[3], this.C.DARK_EDITION[1]);
            this.C.EDITION[1] = 0.7 + 0.2 * (1 + Math.sin(this.TIMERS.REAL * 1.5 + 0));
            this.C.EDITION[3] = 0.7 + 0.2 * (1 + Math.sin(this.TIMERS.REAL * 1.5 + 3));
            this.C.EDITION[2] = 0.7 + 0.2 * (1 + Math.sin(this.TIMERS.REAL * 1.5 + 6));
            for (const [k, v] of Object.entries(SMODS.Rarities)) {
                if (v.gradient && typeof (v.gradient) === "function") {
                    v.gradient(dt);
                }
            }
            this.E_MANAGER.update(this.real_dt);
            timer_checkpoint("e_manager", "update");
            if (G.GAME.blind && G.boss_throw_hand && this.STATE === this.STATES.SELECTING_HAND) {
                if (!this.boss_warning_text) {
                    this.boss_warning_text = new UIBox({ definition: { n: G.UIT.ROOT, config: { align: "cm", colour: G.C.CLEAR, padding: 0.2 }, nodes: [{ n: G.UIT.R, config: { align: "cm", maxw: 1 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ scale: 0.7, string: localize("ph_unscored_hand"), maxw: 9, colours: [G.C.WHITE], float: true, shadow: true, silent: true, pop_in: 0, pop_in_rate: 6 }) } }] }, { n: G.UIT.R, config: { align: "cm", maxw: 1 }, nodes: [{ n: G.UIT.O, config: { object: DynaText({ scale: 0.6, string: G.GAME.blind.get_loc_debuff_text(), maxw: 9, colours: [G.C.WHITE], float: true, shadow: true, silent: true, pop_in: 0, pop_in_rate: 6 }) } }] }] }, config: { align: "cm", offset: { x: 0, y: -3.1 }, major: G.play } });
                    this.boss_warning_text.attention_text = true;
                    this.boss_warning_text.states.collide.can = false;
                    G.GAME.blind.children.animatedSprite.juice_up(0.05, 0.02);
                    play_sound("chips1", Math.random() * 0.1 + 0.55, 0.12);
                }
            }
            else {
                G.boss_throw_hand = undefined;
                if (this.boss_warning_text) {
                    this.boss_warning_text.remove();
                    this.boss_warning_text = undefined;
                }
            }
            if (this.STATE === this.STATES.SELECTING_HAND) {
                if (!G.hand.cards[1] && G.deck.cards[1]) {
                    G.STATE = G.STATES.DRAW_TO_HAND;
                    G.STATE_COMPLETE = false;
                }
                else {
                    this.update_selecting_hand(dt);
                }
            }
            if (this.STATE === this.STATES.SHOP) {
                this.update_shop(dt);
            }
            if (this.STATE === this.STATES.PLAY_TAROT) {
                this.update_play_tarot(dt);
            }
            if (this.STATE === this.STATES.HAND_PLAYED) {
                this.update_hand_played(dt);
            }
            if (this.STATE === this.STATES.DRAW_TO_HAND) {
                this.update_draw_to_hand(dt);
            }
            if (this.STATE === this.STATES.NEW_ROUND) {
                this.update_new_round(dt);
            }
            if (this.STATE === this.STATES.BLIND_SELECT) {
                this.update_blind_select(dt);
            }
            if (this.STATE === this.STATES.ROUND_EVAL) {
                this.update_round_eval(dt);
            }
            if (G.STATE === G.STATES.SMODS_BOOSTER_OPENED) {
                SMODS.OPENED_BOOSTER.config.center.update_pack(dt);
            }
            if (this.STATE === this.STATES.TAROT_PACK) {
                this.update_arcana_pack(dt);
            }
            if (this.STATE === this.STATES.SPECTRAL_PACK) {
                this.update_spectral_pack(dt);
            }
            if (this.STATE === this.STATES.STANDARD_PACK) {
                this.update_standard_pack(dt);
            }
            if (this.STATE === this.STATES.BUFFOON_PACK) {
                this.update_buffoon_pack(dt);
            }
            if (this.STATE === this.STATES.PLANET_PACK) {
                this.update_celestial_pack(dt);
            }
            if (this.STATE === this.STATES.GAME_OVER) {
                this.update_game_over(dt);
            }
            if (this.STATE === this.STATES.MENU) {
                this.update_menu(dt);
            }
            timer_checkpoint("states", "update");
            remove_nils(this.ANIMATIONS);
            for (const [k, v] of Object.entries(this.ANIMATIONS)) {
                v.animate(this.real_dt * this.SPEEDFACTOR);
            }
            timer_checkpoint("animate", "update");
            G.exp_times.xy = Math.exp(-50 * this.real_dt);
            G.exp_times.scale = Math.exp(-60 * this.real_dt);
            G.exp_times.r = Math.exp(-190 * this.real_dt);
            let move_dt = Math.min(1 / 20, this.real_dt);
            G.exp_times.max_vel = 70 * move_dt;
            for (const [k, v] of Object.entries(this.MOVEABLES)) {
                if (v.FRAME.MOVE < G.FRAMES.MOVE) {
                    v.move(move_dt);
                }
            }
            timer_checkpoint("move", "update");
            for (const [k, v] of Object.entries(this.MOVEABLES)) {
                v.update(dt * this.SPEEDFACTOR);
                v.states.collide.is = false;
            }
            timer_checkpoint("update", "update");
        }
        this.CONTROLLER.update(this.real_dt);
        if (G.prev_small_state !== G.GAME.round_resets.blind_states.Small || G.prev_large_state !== G.GAME.round_resets.blind_states.Big || G.prev_boss_state !== G.GAME.round_resets.blind_states.Boss || G.RESET_BLIND_STATES) {
            G.RESET_BLIND_STATES = undefined;
            G.prev_small_state = G.GAME.round_resets.blind_states.Small;
            G.prev_large_state = G.GAME.round_resets.blind_states.Big;
            G.prev_boss_state = G.GAME.round_resets.blind_states.Boss;
            G.GAME.round_resets.loc_blind_states.Small = localize(G.GAME.round_resets.blind_states.Small, "blind_states");
            G.GAME.round_resets.loc_blind_states.Big = localize(G.GAME.round_resets.blind_states.Big, "blind_states");
            G.GAME.round_resets.loc_blind_states.Boss = localize(G.GAME.round_resets.blind_states.Boss, "blind_states");
        }
        if (G.STEAM && G.STEAM.send_control.update_queued && (G.STEAM.send_control.force || G.STEAM.send_control.last_sent_stage !== G.STAGE || G.STEAM.send_control.last_sent_time < G.TIMERS.UPTIME - 120)) {
            if (G.STEAM.userStats.storeStats()) {
                G.STEAM.send_control.force = false;
                G.STEAM.send_control.last_sent_stage = G.STAGE;
                G.STEAM.send_control.last_sent_time = G.TIMERS.UPTIME;
                G.STEAM.send_control.update_queued = false;
            }
            else {
                G.DEBUG_VALUE = "UNABLE TO STORE STEAM STATS";
            }
        }
        if (G.DEBUG) {
            let [text_count, uie_count, card_count, uib_count, all] = [0, 0, 0, 0, 0];
            for (const [k, v] of Object.entries(G.STAGE_OBJECTS[G.STAGE])) {
                all = all + 1;
                if (v.is(DynaText)) {
                    text_count = text_count + 1;
                }
                if (v.is(Card)) {
                    card_count = card_count + 1;
                }
                if (v.is(UIElement)) {
                    uie_count = uie_count + 1;
                }
                if (v.is(UIBox)) {
                    uib_count = uib_count + 1;
                }
            }
            G.DEBUG_VALUE = "text: " + (text_count + ("\\n" + ("uie: " + (uie_count + ("\\n" + ("card: " + (card_count + ("\\n" + ("uib: " + (uib_count + ("\\n" + ("all: " + all))))))))))));
        }
        if (G.FILE_HANDLER && G.FILE_HANDLER && G.FILE_HANDLER.update_queued && (G.FILE_HANDLER.force || G.FILE_HANDLER.last_sent_stage !== G.STAGE || G.FILE_HANDLER.last_sent_pause !== G.SETTINGS.paused && G.FILE_HANDLER.run || (!G.FILE_HANDLER.last_sent_time || G.FILE_HANDLER.last_sent_time < G.TIMERS.UPTIME - G.F_SAVE_TIMER))) {
            if (G.FILE_HANDLER.metrics) {
                G.SAVE_MANAGER.channel.push({ type: "save_metrics", save_metrics: G.ARGS.save_metrics });
            }
            if (G.FILE_HANDLER.progress) {
                G.SAVE_MANAGER.channel.push({ type: "save_progress", save_progress: G.ARGS.save_progress });
            }
            else {
                if (G.FILE_HANDLER.settings) {
                    G.SAVE_MANAGER.channel.push({ type: "save_settings", save_settings: G.ARGS.save_settings, profile_num: G.SETTINGS.profile, save_profile: G.PROFILES[G.SETTINGS.profile??""] });
                }
            }
            if (G.FILE_HANDLER.run) {
                G.SAVE_MANAGER.channel.push({ type: "save_run", save_table: G.ARGS.save_run, profile_num: G.SETTINGS.profile });
                G.SAVED_GAME = undefined;
            }
            G.FILE_HANDLER.force = false;
            G.FILE_HANDLER.last_sent_stage = G.STAGE;
            G.FILE_HANDLER.last_sent_time = G.TIMERS.UPTIME;
            G.FILE_HANDLER.last_sent_pause = G.SETTINGS.paused;
            G.FILE_HANDLER.settings = undefined;
            G.FILE_HANDLER.progress = undefined;
            G.FILE_HANDLER.metrics = undefined;
            G.FILE_HANDLER.run = undefined;
        }
    };
    draw() {
        G.FRAMES.DRAW = G.FRAMES.DRAW + 1;
        reset_drawhash();
        if (G.OVERLAY_TUTORIAL && !G.OVERLAY_MENU) {
            G.under_overlay = true;
        }
        timer_checkpoint("start->canvas", "draw");
        love.graphics.setCanvas([this.CANVAS]);
        love.graphics.push();
        love.graphics.scale(G.CANV_SCALE);
        love.graphics.setShader();
        love.graphics.clear(0, 0, 0, 1);
        if (G.SPLASH_BACK) {
            if (G.debug_background_toggle) {
                love.graphics.clear([0, 1, 0, 1]);
            }
            else {
                love.graphics.push();
                G.SPLASH_BACK.translate_container();
                G.SPLASH_BACK.draw();
                love.graphics.pop();
            }
        }
        if (!G.debug_UI_toggle) {
            for (const [k, v] of Object.entries(this.I.NODE)) {
                if (!v.parent) {
                    love.graphics.push();
                    v.translate_container();
                    v.draw();
                    love.graphics.pop();
                }
            }
            for (const [k, v] of Object.entries(this.I.MOVEABLE)) {
                if (!v.parent) {
                    love.graphics.push();
                    v.translate_container();
                    v.draw();
                    love.graphics.pop();
                }
            }
            if (G.SPLASH_LOGO) {
                love.graphics.push();
                G.SPLASH_LOGO.translate_container();
                G.SPLASH_LOGO.draw();
                love.graphics.pop();
            }
            if (G.debug_splash_size_toggle) {
                for (const [k, v] of Object.entries(this.I.CARDAREA)) {
                    if (!v.parent) {
                        love.graphics.push();
                        v.translate_container();
                        v.draw();
                        love.graphics.pop();
                    }
                }
            }
            else {
                if (!this.OVERLAY_MENU || !this.F_HIDE_BG) {
                    timer_checkpoint("primatives", "draw");
                    for (const [k, v] of Object.entries(this.I.UIBOX)) {
                        if (!v.attention_text && !v.parent && v !== this.OVERLAY_MENU && v !== this.screenwipe && v !== this.OVERLAY_TUTORIAL && v !== this.debug_tools && v !== this.online_leaderboard && v !== this.achievement_notification) {
                            love.graphics.push();
                            v.translate_container();
                            v.draw();
                            love.graphics.pop();
                        }
                    }
                    timer_checkpoint("uiboxes", "draw");
                    for (const [k, v] of Object.entries(this.I.CARDAREA)) {
                        if (!v.parent) {
                            love.graphics.push();
                            v.translate_container();
                            v.draw();
                            love.graphics.pop();
                        }
                    }
                    for (const [k, v] of Object.entries(this.I.CARD)) {
                        if (!v.parent && v !== this.CONTROLLER.dragging.target && v !== this.CONTROLLER.focused.target) {
                            love.graphics.push();
                            v.translate_container();
                            v.draw();
                            love.graphics.pop();
                        }
                    }
                    for (const [k, v] of Object.entries(this.I.UIBOX)) {
                        if (v.attention_text && v !== this.debug_tools && v !== this.online_leaderboard && v !== this.achievement_notification) {
                            love.graphics.push();
                            v.translate_container();
                            v.draw();
                            love.graphics.pop();
                        }
                    }
                    if (G.SPLASH_FRONT) {
                        love.graphics.push();
                        G.SPLASH_FRONT.translate_container();
                        G.SPLASH_FRONT.draw();
                        love.graphics.pop();
                    }
                    G.under_overlay = false;
                    if (this.OVERLAY_TUTORIAL) {
                        love.graphics.push();
                        this.OVERLAY_TUTORIAL.translate_container();
                        this.OVERLAY_TUTORIAL.draw();
                        love.graphics.pop();
                        if (this.OVERLAY_TUTORIAL.highlights) {
                            for (const [k, v] of Array.prototype.entries.call(this.OVERLAY_TUTORIAL.highlights)) {
                                love.graphics.push();
                                v.translate_container();
                                v.draw();
                                if (v.draw_children) {
                                    v.draw_self();
                                    v.draw_children();
                                }
                                love.graphics.pop();
                            }
                        }
                    }
                }
                if (this.OVERLAY_MENU || !this.F_HIDE_BG) {
                    if (this.OVERLAY_MENU && this.OVERLAY_MENU !== this.CONTROLLER.dragging.target) {
                        love.graphics.push();
                        this.OVERLAY_MENU.translate_container();
                        this.OVERLAY_MENU.draw();
                        love.graphics.pop();
                    }
                }
                if (this.debug_tools) {
                    if (this.debug_tools !== this.CONTROLLER.dragging.target) {
                        love.graphics.push();
                        this.debug_tools.translate_container();
                        this.debug_tools.draw();
                        love.graphics.pop();
                    }
                }
                G.ALERT_ON_SCREEN = undefined;
                for (const [k, v] of Object.entries(this.I.ALERT)) {
                    love.graphics.push();
                    v.translate_container();
                    v.draw();
                    G.ALERT_ON_SCREEN = true;
                    love.graphics.pop();
                }
                if (this.CONTROLLER.dragging.target && this.CONTROLLER.dragging.target !== this.CONTROLLER.focused.target) {
                    love.graphics.push();
                    G.CONTROLLER.dragging.target.translate_container();
                    G.CONTROLLER.dragging.target.draw();
                    love.graphics.pop();
                }
                if (this.CONTROLLER.focused.target && this.CONTROLLER.focused.target instanceof Card && (this.CONTROLLER.focused.target.area !== G.hand || this.CONTROLLER.focused.target === this.CONTROLLER.dragging.target)) {
                    love.graphics.push();
                    G.CONTROLLER.focused.target.translate_container();
                    G.CONTROLLER.focused.target.draw();
                    love.graphics.pop();
                }
                for (const [k, v] of Object.entries(this.I.POPUP)) {
                    love.graphics.push();
                    v.translate_container();
                    v.draw();
                    love.graphics.pop();
                }
                if (this.achievement_notification) {
                    love.graphics.push();
                    this.achievement_notification.translate_container();
                    this.achievement_notification.draw();
                    love.graphics.pop();
                }
                if (this.screenwipe) {
                    love.graphics.push();
                    this.screenwipe.translate_container();
                    this.screenwipe.draw();
                    love.graphics.pop();
                }
                love.graphics.push();
                this.CURSOR.translate_container();
                love.graphics.translate(-this.CURSOR.T.w * G.TILESCALE * G.TILESIZE * 0.5, -this.CURSOR.T.h * G.TILESCALE * G.TILESIZE * 0.5);
                this.CURSOR.draw();
                love.graphics.pop();
                timer_checkpoint("rest", "draw");
            }
        }
        love.graphics.pop();
        love.graphics.setCanvas(G.AA_CANVAS);
        love.graphics.push();
        love.graphics.setColor(G.C.WHITE);
        if ((!G.recording_mode || G.video_control) && true) {
            G.ARGS.eased_cursor_pos = G.ARGS.eased_cursor_pos || { x: G.CURSOR.T.x, y: G.CURSOR.T.y, sx: G.CONTROLLER.cursor_position.x, sy: G.CONTROLLER.cursor_position.y };
            G.screenwipe_amt = G.screenwipe_amt && 0.95 * G.screenwipe_amt + 0.05 * (this.screenwipe && 0.4 || this.screenglitch && 0.4 || 0) || 1;
            G.SETTINGS.GRAPHICS.crt = G.SETTINGS.GRAPHICS.crt * 0.3;
            G.SHADERS["CRT"].send("distortion_fac", [1 + 0.07 * G.SETTINGS.GRAPHICS.crt / 100, 1 + 0.1 * G.SETTINGS.GRAPHICS.crt / 100]);
            G.SHADERS["CRT"].send("scale_fac", [1 - 0.008 * G.SETTINGS.GRAPHICS.crt / 100, 1 - 0.008 * G.SETTINGS.GRAPHICS.crt / 100]);
            G.SHADERS["CRT"].send("feather_fac", 0.01);
            G.SHADERS["CRT"].send("bloom_fac", G.SETTINGS.GRAPHICS.bloom - 1);
            G.SHADERS["CRT"].send("time", 400 + G.TIMERS.REAL);
            G.SHADERS["CRT"].send("noise_fac", 0.001 * G.SETTINGS.GRAPHICS.crt / 100);
            G.SHADERS["CRT"].send("crt_intensity", 0.16 * G.SETTINGS.GRAPHICS.crt / 100);
            G.SHADERS["CRT"].send("glitch_intensity", 0);
            G.SHADERS["CRT"].send("scanlines", G.CANVAS.getPixelHeight() * 0.75 / G.CANV_SCALE);
            G.SHADERS["CRT"].send("mouse_screen_pos", G.video_control && [love.graphics.getWidth() / 2, love.graphics.getHeight() / 2] || [G.ARGS.eased_cursor_pos.sx, G.ARGS.eased_cursor_pos.sy]);
            G.SHADERS["CRT"].send("screen_scale", G.TILESCALE * G.TILESIZE);
            G.SHADERS["CRT"].send("hovering", 1);
            love.graphics.setShader(G.SHADERS["CRT"]);
            G.SETTINGS.GRAPHICS.crt = G.SETTINGS.GRAPHICS.crt / 0.3;
        }
        love.graphics.draw(this.CANVAS, 0, 0);
        love.graphics.pop();
        love.graphics.setCanvas();
        love.graphics.setShader();
        if (G.AA_CANVAS) {
            love.graphics.push();
            love.graphics.scale(1 / G.CANV_SCALE);
            love.graphics.draw(G.AA_CANVAS, 0, 0);
            love.graphics.pop();
        }
        timer_checkpoint("canvas", "draw");
        if (!_RELEASE_MODE && G.DEBUG && !G.video_control && G.F_VERBOSE) {
            love.graphics.push();
            love.graphics.setColor(0, 1, 1, 1);
            let fps = love.timer.getFPS();
            love.graphics.print("Current FPS: " + fps, 10, 10);
            if (G.check && G.SETTINGS.perf_mode) {
                let section_h = 30;
                let resolution = 60 * section_h;
                let poll_w = 1;
                let v_off = 100;
                for (const [a, b] of Array.prototype.entries.call([G.check.update, G.check.draw])) {
                    for (const [k, v] of Array.prototype.entries.call(b.checkpoint_list)) {
                        love.graphics.setColor(0, 0, 0, 0.2);
                        love.graphics.rectangle("fill", 12, 20 + v_off, poll_w + poll_w * v.trend.length, -section_h + 5);
                        for (const [kk, vv] of Array.prototype.entries.call(v.trend)) {
                            if (a === 2) {
                                love.graphics.setColor(0.3, 0.7, 0.7, 1);
                            }
                            else {
                                love.graphics.setColor(this.state_col(v.states[kk] || 123));
                            }
                            love.graphics.rectangle("fill", 10 + poll_w * kk, 20 + v_off, 5 * poll_w, -vv * resolution);
                        }
                        love.graphics.setColor(a === 2 && 0.5 || 1, a === 2 && 1 || 0.5, 1, 1);
                        love.graphics.print(v.label + (": " + (stringFormat("%.2f", 1000 * (v.average || 0)) + "\\n")), 10, -section_h + 30 + v_off);
                        v_off = v_off + section_h;
                    }
                }
            }
            love.graphics.pop();
        }
        timer_checkpoint("debug", "draw");
    }CANV_SCALE(CANV_SCALE: any) {
        throw new Error("Method not implemented.");
    }
AA_CANVAS(AA_CANVAS: any) {
        throw new Error("Method not implemented.");
    }
;
    state_col(_state) {
        return [_state * 15251252.2 / 5.132 % 1, _state * 1422.5641311 / 5.42 % 1, _state * 1522.1523122 / 5.132 % 1, 1];
    };
    update_selecting_hand(dt) {
        if (!this.deck_preview && !G.OVERLAY_MENU && (this.deck && this.deck.cards[1] && this.deck.cards[1].states.collide.is && (!this.deck.cards[1].states.drag.is || this.CONTROLLER.HID.touch) && !this.CONTROLLER.HID.controller || G.CONTROLLER.held_buttons.triggerleft)) {
            if (this.buttons) {
                this.buttons.states.visible = false;
            }
            this.deck_preview = new UIBox({ definition: this.UIDEF.deck_preview(), config: { align: "tm", offset: { x: 0, y: -0.8 }, major: this.hand, bond: "Weak" } });
            this.E_MANAGER.add_event(new GameEvent({ blocking: false, blockable: false, func: function () {
                    if (this.deck_preview && !(this.deck && this.deck.cards[1] && this.deck.cards[1].states.collide.is && !this.CONTROLLER.HID.controller || G.CONTROLLER.held_buttons.triggerleft)) {
                        this.deck_preview.remove();
                        this.deck_preview = undefined;
                        let _card = G.CONTROLLER.focused.target;
                        let start = G.TIMERS.REAL;
                        this.E_MANAGER.add_event(new GameEvent({ func: function () {
                                if (_card && _card.area && _card.area === G.hand) {
                                    let [_x, _y] = _card.put_focused_cursor();
                                    G.CONTROLLER.update_cursor({ x: _x / (G.TILESCALE * G.TILESIZE), y: _y / (G.TILESCALE * G.TILESIZE) });
                                }
                                if (start + 0.4 < G.TIMERS.REAL) {
                                    return true;
                                }
                            } }));
                        return true;
                    }
                } }));
        }
        if (!this.buttons && !this.deck_preview) {
            this.buttons = new UIBox({ definition: create_UIBox_buttons(), config: { align: "bm", offset: { x: 0, y: 0.3 }, major: G.hand, bond: "Weak" } });
        }
        if (this.buttons && !this.buttons.states.visible && !this.deck_preview) {
            this.buttons.states.visible = true;
        }
        if (G.hand.cards.length < 1 && G.deck.cards.length < 1 && G.play.cards.length < 1) {
            end_round();
        }
        if (this.shop) {
            this.shop.remove();
            this.shop = undefined;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            if (G.hand.cards.length < 1 && G.deck.cards.length < 1) {
                end_round();
            }
            else {
                save_run();
                G.CONTROLLER.recall_cardarea_focus("hand");
            }
        }
    };
    update_shop(dt) {
        if (!G.STATE_COMPLETE) {
            stop_use();
            ease_background_colour_blind(G.STATES.SHOP);
            let shop_exists = !!G.shop;
            G.shop = G.shop || new UIBox({ definition: G.UIDEF.shop(), config: { align: "tmi", offset: { x: 0, y: G.ROOM.T.y + 11 }, major: G.hand, bond: "Weak" } });
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.shop.alignment.offset.y = -5.3;
                    G.shop.alignment.offset.x = 0;
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.2, blockable: false, func: function () {
                            if (Math.abs(G.shop.T.y - G.shop.VT.y) < 3) {
                                G.ROOM.jiggle = G.ROOM.jiggle + 3;
                                play_sound("cardFan2");
                                for (let i = 1; i <= G.GAME.tags.length; i++) {
                                    G.GAME.tags[i].apply_to_run({ type: "shop_start" });
                                }
                                let nosave_shop = undefined;
                                if (!shop_exists) {
                                    if (G.load_shop_jokers) {
                                        nosave_shop = true;
                                        G.shop_jokers.load(G.load_shop_jokers);
                                        for (const [k, v] of Array.prototype.entries.call(G.shop_jokers.cards)) {
                                            create_shop_card_ui(v);
                                            if (v.ability.consumeable) {
                                                v.start_materialize();
                                            }
                                            for (const [_kk, vvv] of Array.prototype.entries.call(G.GAME.tags)) {
                                                if (vvv.apply_to_run({ type: "store_joker_modify", card: v })) {
                                                    break;
                                                }
                                            }
                                        }
                                        G.load_shop_jokers = undefined;
                                    }
                                    else {
                                        for (let i = 1; i <= G.GAME.shop.joker_max - G.shop_jokers.cards.length; i++) {
                                            G.shop_jokers.emplace(create_card_for_shop(G.shop_jokers));
                                        }
                                    }
                                    if (G.load_shop_vouchers) {
                                        nosave_shop = true;
                                        G.shop_vouchers.load(G.load_shop_vouchers);
                                        for (const [k, v] of Array.prototype.entries.call(G.shop_vouchers.cards)) {
                                            create_shop_card_ui(v);
                                            v.start_materialize();
                                        }
                                        G.load_shop_vouchers = undefined;
                                    }
                                    else {
                                        if (G.GAME.current_round.voucher && G.P_CENTERS[G.GAME.current_round.voucher]) {
                                            let card = new Card(G.shop_vouchers.T.x + G.shop_vouchers.T.w / 2, G.shop_vouchers.T.y, G.CARD_W, G.CARD_H, G.P_CARDS.empty, G.P_CENTERS[G.GAME.current_round.voucher], { bypass_discovery_center: true, bypass_discovery_ui: true });
                                            card.shop_voucher = true;
                                            create_shop_card_ui(card, "Voucher", G.shop_vouchers);
                                            card.start_materialize();
                                            G.shop_vouchers.emplace(card);
                                        }
                                    }
                                    if (G.load_shop_booster) {
                                        nosave_shop = true;
                                        G.shop_booster.load(G.load_shop_booster);
                                        for (const [k, v] of Array.prototype.entries.call(G.shop_booster.cards)) {
                                            create_shop_card_ui(v);
                                            v.start_materialize();
                                        }
                                        G.load_shop_booster = undefined;
                                    }
                                    else {
                                        for (let i = 1; i <= 2; i++) {
                                            G.GAME.current_round.used_packs = G.GAME.current_round.used_packs || {};
                                            if (!G.GAME.current_round.used_packs[i]) {
                                                G.GAME.current_round.used_packs[i] = get_pack("shop_pack").key;
                                            }
                                            if (G.GAME.current_round.used_packs[i] !== "USED") {
                                                let card = new Card(G.shop_booster.T.x + G.shop_booster.T.w / 2, G.shop_booster.T.y, G.CARD_W * 1.27, G.CARD_H * 1.27, G.P_CARDS.empty, G.P_CENTERS[G.GAME.current_round.used_packs[i]], { bypass_discovery_center: true, bypass_discovery_ui: true });
                                                create_shop_card_ui(card, "Booster", G.shop_booster);
                                                card.ability.booster_pos = i;
                                                card.start_materialize();
                                                G.shop_booster.emplace(card);
                                            }
                                        }
                                        for (let i = 1; i <= G.GAME.tags.length; i++) {
                                            G.GAME.tags[i].apply_to_run({ type: "voucher_add" });
                                        }
                                        for (let i = 1; i <= G.GAME.tags.length; i++) {
                                            G.GAME.tags[i].apply_to_run({ type: "shop_final_pass" });
                                        }
                                    }
                                }
                                G.CONTROLLER.snap_to({ node: G.shop.get_UIE_by_ID("next_round_button") });
                                if (!nosave_shop) {
                                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                                            save_run();
                                            return true;
                                        } }));
                                }
                                return true;
                            }
                        } }));
                    return true;
                } }));
            G.STATE_COMPLETE = true;
        }
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
    };
    update_play_tarot(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
    };
    update_hand_played(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            this.shop.remove();
            this.shop = undefined;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    if (G.GAME.chips - G.GAME.blind.chips >= 0 || G.GAME.current_round.hands_left < 1) {
                        G.STATE = G.STATES.NEW_ROUND;
                    }
                    else {
                        G.STATE = G.STATES.DRAW_TO_HAND;
                    }
                    G.STATE_COMPLETE = false;
                    return true;
                } }));
        }
    };
    update_draw_to_hand(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            this.shop.remove();
            this.shop = undefined;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            for (let i = 1; i <= G.GAME.tags.length; i++) {
                G.GAME.tags[i].apply_to_run({ type: "round_start_bonus" });
            }
            ease_background_colour_blind(G.STATES.DRAW_TO_HAND);
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    if (G.FUNCS.draw_from_deck_to_hand(undefined)) {
                        return true;
                    }
                    if (G.GAME.current_round.hands_played === 0 && G.GAME.current_round.discards_used === 0 && G.GAME.facing_blind) {
                        SMODS.calculate_context({ first_hand_drawn: true });
                    }
                    SMODS.calculate_context({ hand_drawn: true });
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.STATE = G.STATES.SELECTING_HAND;
                            G.STATE_COMPLETE = false;
                            G.GAME.blind.drawn_to_hand();
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_new_round(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            this.shop.remove();
            this.shop = undefined;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            end_round();
        }
    };
    update_blind_select(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            this.shop.remove();
            this.shop = undefined;
        }
        if (!G.STATE_COMPLETE) {
            stop_use();
            ease_background_colour_blind(G.STATES.BLIND_SELECT);
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    save_run();
                    return true;
                } }));
            G.STATE_COMPLETE = true;
            G.CONTROLLER.interrupt.focus = true;
            G.E_MANAGER.add_event(new GameEvent({ func: function () {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            play_sound("cancel");
                            G.blind_select = new UIBox({ definition: create_UIBox_blind_select(), config: { align: "bmi", offset: { x: 0, y: G.ROOM.T.y + 29 }, major: G.hand, bond: "Weak" } });
                            G.blind_select.alignment.offset.y = 0.8 - (G.hand.T.y - G.jokers.T.y) + G.blind_select.T.h;
                            G.ROOM.jiggle = G.ROOM.jiggle + 3;
                            G.blind_select.alignment.offset.x = 0;
                            G.CONTROLLER.lock_input = false;
                            for (let i = 1; i <= G.GAME.tags.length; i++) {
                                G.GAME.tags[i].apply_to_run({ type: "immediate" });
                            }
                            for (let i = 1; i <= G.GAME.tags.length; i++) {
                                if (G.GAME.tags[i].apply_to_run({ type: "new_blind_choice" })) {
                                    break;
                                }
                            }
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_round_eval(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            this.shop.remove();
            this.shop = undefined;
        }
        if (!G.STATE_COMPLETE) {
            stop_use();
            G.STATE_COMPLETE = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.GAME.facing_blind = undefined;
                    save_run();
                    ease_background_colour_blind(G.STATES.ROUND_EVAL);
                    G.round_eval = new UIBox({ definition: create_UIBox_round_evaluation(), config: { align: "bm", offset: { x: 0, y: G.ROOM.T.y + 19 }, major: G.hand, bond: "Weak" } });
                    G.round_eval.alignment.offset.x = 0;
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            if (G.round_eval.alignment.offset.y !== -7.8) {
                                G.round_eval.alignment.offset.y = -7.8;
                            }
                            else {
                                if (Math.abs(G.round_eval.T.y - G.round_eval.VT.y) < 3) {
                                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                                    play_sound("cardFan2");
                                    delay(0.1);
                                    G.FUNCS.evaluate_round();
                                    return true;
                                }
                            }
                        } }));
                    return true;
                } }));
        }
    };
    update_arcana_pack(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            G.shop.alignment.offset.y = G.ROOM.T.y + 11;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            G.CONTROLLER.interrupt.focus = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.booster_pack_sparkles = Particles(1, 1, 0, 0, { timer: 0.015, scale: 0.2, initialize: true, lifespan: 1, speed: 1.1, padding: -1, attach: G.ROOM_ATTACH, colours: [G.C.WHITE, lighten(G.C.PURPLE, 0.4), lighten(G.C.PURPLE, 0.2), lighten(G.C.GOLD, 0.2)], fill: true });
                    G.booster_pack_sparkles.fade_alpha = 1;
                    G.booster_pack_sparkles.fade(1, 0);
                    G.booster_pack = new UIBox({ definition: create_UIBox_arcana_pack(), config: { align: "tmi", offset: { x: 0, y: G.ROOM.T.y + 9 }, major: G.hand, bond: "Weak" } });
                    G.booster_pack.alignment.offset.y = -2.2;
                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                    ease_background_colour_blind(G.STATES.TAROT_PACK);
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.FUNCS.draw_from_deck_to_hand();
                            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                                    G.CONTROLLER.recall_cardarea_focus("pack_cards");
                                    return true;
                                } }));
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_spectral_pack(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            G.shop.alignment.offset.y = G.ROOM.T.y + 11;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            G.CONTROLLER.interrupt.focus = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.booster_pack_sparkles = Particles(1, 1, 0, 0, { timer: 0.015, scale: 0.1, initialize: true, lifespan: 3, speed: 0.2, padding: -1, attach: G.ROOM_ATTACH, colours: [G.C.WHITE, lighten(G.C.GOLD, 0.2)], fill: true });
                    G.booster_pack_sparkles.fade_alpha = 1;
                    G.booster_pack_sparkles.fade(1, 0);
                    G.booster_pack = new UIBox({ definition: create_UIBox_spectral_pack(), config: { align: "tmi", offset: { x: 0, y: G.ROOM.T.y + 9 }, major: G.hand, bond: "Weak" } });
                    G.booster_pack.alignment.offset.y = -2.2;
                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                    ease_background_colour_blind(G.STATES.SPECTRAL_PACK);
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.FUNCS.draw_from_deck_to_hand();
                            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                                    G.CONTROLLER.recall_cardarea_focus("pack_cards");
                                    return true;
                                } }));
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_standard_pack(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            G.shop.alignment.offset.y = G.ROOM.T.y + 11;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            G.CONTROLLER.interrupt.focus = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.booster_pack_sparkles = Particles(1, 1, 0, 0, { timer: 0.015, scale: 0.3, initialize: true, lifespan: 3, speed: 0.2, padding: -1, attach: G.ROOM_ATTACH, colours: [G.C.BLACK, G.C.RED], fill: true });
                    G.booster_pack_sparkles.fade_alpha = 1;
                    G.booster_pack_sparkles.fade(1, 0);
                    G.booster_pack = new UIBox({ definition: create_UIBox_standard_pack(), config: { align: "tmi", offset: { x: 0, y: G.ROOM.T.y + 9 }, major: G.hand, bond: "Weak" } });
                    G.booster_pack.alignment.offset.y = -2.2;
                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                    ease_background_colour_blind(G.STATES.STANDARD_PACK);
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                                    G.CONTROLLER.recall_cardarea_focus("pack_cards");
                                    return true;
                                } }));
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_buffoon_pack(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            G.shop.alignment.offset.y = G.ROOM.T.y + 11;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            G.CONTROLLER.interrupt.focus = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.booster_pack = new UIBox({ definition: create_UIBox_buffoon_pack(), config: { align: "tmi", offset: { x: 0, y: G.ROOM.T.y + 9 }, major: G.hand, bond: "Weak" } });
                    G.booster_pack.alignment.offset.y = -2.2;
                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                    ease_background_colour_blind(G.STATES.BUFFOON_PACK);
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5, func: function () {
                                    G.CONTROLLER.recall_cardarea_focus("pack_cards");
                                    return true;
                                } }));
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_celestial_pack(dt) {
        if (this.buttons) {
            this.buttons.remove();
            this.buttons = undefined;
        }
        if (this.shop) {
            G.shop.alignment.offset.y = G.ROOM.T.y + 11;
        }
        if (!G.STATE_COMPLETE) {
            G.STATE_COMPLETE = true;
            G.CONTROLLER.interrupt.focus = true;
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    ease_background_colour_blind(G.STATES.PLANET_PACK);
                    G.booster_pack_stars = Particles(1, 1, 0, 0, { timer: 0.07, scale: 0.1, initialize: true, lifespan: 15, speed: 0.1, padding: -4, attach: G.ROOM_ATTACH, colours: [G.C.WHITE, HEX("a7d6e0"), HEX("fddca0")], fill: true });
                    G.booster_pack_meteors = Particles(1, 1, 0, 0, { timer: 2, scale: 0.05, lifespan: 1.5, speed: 4, attach: G.ROOM_ATTACH, colours: [G.C.WHITE], fill: true });
                    G.booster_pack = new UIBox({ definition: create_UIBox_celestial_pack(), config: { align: "tmi", offset: { x: 0, y: G.ROOM.T.y + 9 }, major: G.hand, bond: "Weak" } });
                    G.booster_pack.alignment.offset.y = -2.2;
                    G.ROOM.jiggle = G.ROOM.jiggle + 3;
                    G.E_MANAGER.add_event(new GameEvent({ func: function () {
                            G.CONTROLLER.recall_cardarea_focus("pack_cards");
                            return true;
                        } }));
                    return true;
                } }));
        }
    };
    update_game_over(dt) {
        if (!G.STATE_COMPLETE) {
            remove_save();
            if (G.GAME.round_resets.ante <= G.GAME.win_ante) {
                if (!G.GAME.seeded && !G.GAME.challenge) {
                    inc_career_stat("c_losses", 1);
                    set_deck_loss();
                    set_joker_loss();
                }
            }
            play_sound("negative", 0.5, 0.7);
            play_sound("whoosh2", 0.9, 0.7);
            G.SETTINGS.paused = true;
            G.FUNCS.overlay_menu({ definition: create_UIBox_game_over(), config: { no_esc: true } });
            G.ROOM.jiggle = G.ROOM.jiggle + 3;
            if (G.GAME.round_resets.ante <= G.GAME.win_ante) {
                let Jimbo = undefined;
                G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 2.5, blocking: false, func: function () {
                        if (G.OVERLAY_MENU && G.OVERLAY_MENU.get_UIE_by_ID("jimbo_spot")) {
                            Jimbo = Card_Character({ x: 0, y: 5 });
                            let spot = G.OVERLAY_MENU.get_UIE_by_ID("jimbo_spot");
                            spot.config.object.remove();
                            spot.config.object = Jimbo;
                            Jimbo.ui_object_updated = true;
                            Jimbo.add_speech_bubble("lq_" + Math.random(1, 10), undefined, { quip: true });
                            Jimbo.say_stuff(5);
                        }
                        return true;
                    } }));
            }
            G.STATE_COMPLETE = true;
        }
    };
    update_menu(dt) {
    };
}

var G = new Game();