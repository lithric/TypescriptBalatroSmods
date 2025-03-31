///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./engine/animatedsprite.ts"/>
///<reference path="./engine/controller.ts"/>
///<reference path="./engine/event.ts"/>
///<reference path="./engine/moveable.ts"/>
///<reference path="./engine/node.ts"/>
///<reference path="./engine/object.ts"/>
///<reference path="./engine/particles.ts"/>
///<reference path="./engine/save_manager.ts"/>
///<reference path="./engine/sound_manager.ts"/>
///<reference path="./engine/sprite.ts"/>
///<reference path="./engine/string_packer.ts"/>
///<reference path="./engine/text.ts"/>
///<reference path="./engine/ui.ts"/>
///<reference path="./functions/button_callbacks.ts"/>
///<reference path="./functions/common_events.ts"/>
///<reference path="./functions/misc_functions.ts"/>
///<reference path="./functions/state_events.ts"/>
///<reference path="./functions/test_functions.ts"/>
///<reference path="./functions/UI_definitions.ts"/>
///<reference path="./back.ts"/>
///<reference path="./blind.ts"/>
///<reference path="./card_character.ts"/>
///<reference path="./card.ts"/>
///<reference path="./cardarea.ts"/>
///<reference path="./challenges.ts"/>
///<reference path="./conf.ts"/>
///<reference path="./game.ts"/>
///<reference path="./main.ts"/>
///<reference path="./tag.ts"/> 

let x = 2
if (x === 2 || x == 2) {
    
}

type Font = import("love.graphics").Font
type Thread = import("love.thread").Thread
type Channel = import("love.thread").Channel
type RenderTargetSetup = import("love.graphics").RenderTargetSetup
type Shader<U extends {[key:string]:any}|undefined = undefined> = import("love.graphics").Shader<U>

interface GAME {
    won: boolean;
    selected_back: Back;
    viewed_back: any;
    modifiers: any;
    stake: any;
    STOP_USE: number;
    selected_back_key: any;
    starting_params: any;
    challenge: any;
    challenge_tab: any;
    used_vouchers: any;
    starting_voucher_count: any;
    joker_rate: number;
    banned_keys: any;
    round_resets: any;
    dollars: any;
    base_reroll_cost: any;
    current_round: any;
    chips_text: string;
    seeded: boolean;
    pseudorandom: any;
    starting_deck_size: any;
    blind: any;
    tags: Tag[];
    shop: any;
    chips: any;
    facing_blind: boolean;
    win_ante: any;

}

interface GameFunctions {
    col1change: (args: any) => void
    col2change: (args: any) => void
    edition_change: (args: any) => void
    pulseme: (e: any) => void
    spawn_joker: (e: any) => void
    rem_joker(): unknown
    do_time: (args: any) => void
    cb: (rt: any) => void
    tutorial_controller(): unknown
    draw_from_deck_to_hand(undefined: undefined): unknown
    evaluate_round(): unknown
    get_poker_hand_info(highlighted: any): [any, any, any];
    DT_add_money: () => void;
    DT_add_round: () => void;
    DT_add_ante: () => void;
    DT_add_hand: () => void;
    DT_add_discard: () => void;
    DT_reroll_boss: () => void;
    DT_toggle_background: () => void;
    DT_add_chips: () => void;
    DT_add_mult: () => void;
    DT_x_chips: () => void;
    DT_x_mult: () => void;
    DT_chip_mult_reset: () => void;
    DT_win_game: () => void;
    DT_lose_game: () => void;
    DT_jimbo_toggle: () => void;
    DT_jimbo_talk: () => void;
    update_collab_cards(current_option: number, _suit: any, arg2: boolean): unknown;
    false_ret: () => boolean;
    tut_next: (e: any) => void;
    blueprint_compat: (e: any) => void;
    sort_hand_suit: (e: any) => void;
    sort_hand_value: (e: any) => void;
    can_buy: (e: any) => void;
    can_buy_and_use: (e: any) => void;
    can_redeem: (e: any) => void;
    can_open: (e: any) => void;
    HUD_blind_visible: (e: any) => void;
    HUD_blind_debuff: (e: any) => void;
    HUD_blind_debuff_prefix: (e: any) => void;
    HUD_blind_reward: (e: any) => void;
    can_continue: (e: any) => undefined;
    can_load_profile: (e: any) => void;
    load_profile: (delete_prof_data: any) => void;
    wipe_on(): unknown;
    wipe_off(): unknown;
    can_delete_profile: (e: any) => void;
    delete_profile: (e: any) => void;
    change_tab(tab_but: any): unknown;
    can_unlock_all: (e: any) => void;
    unlock_all: (e: any) => void;
    high_score_alert: (e: any) => void;
    beta_lang_alert: (e: any) => void;
    set_button_pip: (e: any) => void;
    flash: (e: any) => void;
    pip_dynatext: (e: any) => void;
    toggle_button: (e: any) => void;
    toggle: (e: any) => void;
    slider: (e: any) => void;
    slider_descreet: (e: any, per: any) => void;
    option_cycle: (e: any) => void;
    test_framework_cycle_callback: (args: any) => void;
    your_collection_joker_page: (args: any) => void;
    your_collection_tarot_page: (args: any) => void;
    your_collection_spectral_page: (args: any) => void;
    your_collection_booster_page: (args: any) => void;
    your_collection_voucher_page: (args: any) => void;
    change_selected_back: (args: any) => void;
    change_viewed_back: (args: any) => void;
    change_stake: (args: any) => void;
    change_vsync: (args: any) => void;
    change_screen_resolution: (args: any) => void;
    change_screenmode: (args: any) => void;
    change_window_cycle_UI(): unknown;
    change_display: (args: any) => void;
    change_gamespeed: (args: any) => void;
    change_play_discard_position: (args: any) => void;
    change_shadows: (args: any) => void;
    change_pixel_smoothing: (args: any) => void;
    change_crt_bloom: (args: any) => void;
    change_collab: (args: any) => void;
    key_button: (e: any) => void;
    text_input: (e: any) => void;
    paste_seed: (e: any) => void;
    text_input_key(arg0: { key: string; }): unknown;
    select_text_input: (e: any) => void;
    can_apply_window_changes: (e: any) => void;
    apply_window_changes: (_initial: any) => void;
    RUN_SETUP_check_back: (e: any) => void;
    RUN_SETUP_check_back_name: (e: any) => void;
    RUN_SETUP_check_stake: (e: any) => void;
    RUN_SETUP_check_stake2: (e: any) => void;
    change_viewed_collab: (args: any) => void;
    CREDITS_check_collab: (e: any) => void;
    RUN_SETUP_check_back_stake_column: (e: any) => void;
    RUN_SETUP_check_back_stake_highlight: (e: any) => void;
    overlay_menu: (args: any) => void;
    exit_overlay_menu: () => void;
    continue_unlock: () => void;
    test_framework: (options: any) => void;
    options: (e: any) => void;
    current_hands: (e: any, simple: any) => void;
    run_info: (e: any) => void;
    deck_info: (e: any) => void;
    settings: (e: any, instant: any) => void;
    show_credits: (e: any) => void;
    language_selection: (e: any) => void;
    your_collection: (e: any) => void;
    your_collection_blinds: (e: any) => void;
    your_collection_jokers: (e: any) => void;
    your_collection_tarots: (e: any) => void;
    your_collection_planets: (e: any) => void;
    your_collection_spectrals: (e: any) => void;
    your_collection_vouchers: (e: any) => void;
    your_collection_enhancements_exit_overlay_menu: (e: any) => void;
    your_collection_enhancements: (e: any) => void;
    your_collection_decks: (e: any) => void;
    your_collection_editions: (e: any) => void;
    your_collection_tags: (e: any) => void;
    your_collection_seals: (e: any) => void;
    your_collection_boosters: (e: any) => void;
    challenge_list: (e: any) => void;
    high_scores: (e: any) => void;
    customize_deck: (e: any) => void;
    usage: (e: any) => void;
    setup_run: (e: any) => void;
    wait_for_high_scores: (e: any) => void;
    notify_then_setup_run: (e: any) => void;
    change_challenge_description: (e: any) => void;
    change_challenge_list_page: (args: any) => void;
    deck_view_challenge: (e: any) => void;
    profile_select: (e: any) => void;
    quit: (e: any) => void;
    quit_cta: (e: any) => void;
    demo_survey: (e: any) => void;
    louisf_insta: (e: any) => void;
    wishlist_steam: (e: any) => void;
    go_to_playbalatro: (e: any) => void;
    go_to_discord: (e: any) => void;
    go_to_discord_loc: (e: any) => void;
    loc_survey: (e: any) => void;
    go_to_twitter: (e: any) => void;
    unlock_this: (e: any) => void;
    reset_achievements: (e: any) => void;
    refresh_contrast_mode: () => void;
    warn_lang: (e: any) => void;
    change_lang: (e: any) => void;
    copy_seed: (e: any) => void;
    start_setup_run: (e: any) => void;
    start_run(e: any, arg1: { stake: any; seed: any; challenge: any; }): unknown;
    start_challenge_run: (e: any) => void;
    toggle_seeded_run: (e: any) => void;
    start_tutorial: (e: any) => void;
    chip_UI_set: (e: any) => void;
    blind_chip_UI_scale: (e: any) => void;
    hand_mult_UI_set: (e: any) => void;
    text_super_juice(e: any, arg1: number): unknown;
    hand_chip_UI_set: (e: any) => void;
    hand_chip_total_UI_set: (e: any) => void;
    flame_handler: (e: any) => void;
    hand_text_UI_set: (e: any) => void;
    can_play: (e: any) => void;
    can_start_run: (e: any) => void;
    visible_blind: (e: any) => void;
    can_reroll: (e: any) => void;
    can_discard: (e: any) => void;
    can_use_consumeable: (e: any) => void;
    can_select_card: (e: any) => void;
    can_sell_card: (e: any) => void;
    can_skip_booster: (e: any) => void;
    show_infotip: (e: any) => void;
    use_card: (e: any, mute: any, nosave: any) => void;
    end_consumeable(undefined: undefined, delay_fac: number): unknown;
    sell_card: (e: any) => void;
    can_confirm_contest_name: (e: any) => void;
    confirm_contest_name: (e: any) => void;
    change_contest_name: (e: any) => void;
    skip_tutorial_section: (e: any) => void;
    shop_voucher_empty: (e: any) => void;
    check_for_buy_space: (card: any) => boolean;
    buy_from_shop: (e: any) => false | undefined;
    toggle_shop: (e: any) => void;
    select_blind: (e: any) => void;
    skip_booster: (e: any) => void;
    draw_from_hand_to_deck(): unknown;
    blind_choice_handler: (e: any) => void;
    hover_tag_proxy: (e: any) => void;
    skip_blind: (e: any) => void;
    reroll_boss_button: (e: any) => void;
    reroll_boss: (e: any) => true | undefined;
    reroll_shop: (e: any) => void;
    cash_out: (e: any) => void;
    go_to_menu: (e: any) => void;
    go_to_demo_cta: (e: any) => void;
    show_main_cta: (e: any) => void;

}

type BondStrength = "Strong"|"Weak"

type RoleType = "Major"|"Glued"|"Minor"

interface RoleDefinition {
    role_type: RoleType;
    offset: Position2D;
    major?: Moveable;
    draw_major: Moveable;
    xy_bond: BondStrength;
    wh_bond: BondStrength;
    r_bond: BondStrength;
    scale_bond: BondStrength;
}

interface DrawStepSend {
    name:string;
    val:any;
    func?:()=>any;
    ref_value:string;
    ref_table:{[x:string]:any};
}

interface DrawStepDefinition {
    shader: string;
    shadow_height?: number;
    send?: DrawStepSend[];
    no_tilt?: boolean;
    other_obj: undefined;
    ms?: number;
    mr?: number;
    mx?: number;
    my?: number;

}

interface FontData {
    file: string;
    render_scale: number;
    TEXT_HEIGHT_SCALE: number;
    TEXT_OFFSET: Position2D;
    FONTSCALE: number;
    squish: number;
    DESCSCALE: number;
    FONT?: Font;
    font?: FontData;
}

type PokerHandName = ("Flush Five"|"Flush House"|"Five of a Kind"|"Straight Flush"|"Four of a Kind"|"Full House"|"Flush"|"Straight"|"Three of a Kind"|"Two Pair"|"Pair"|"High Card")

type HexArray = [number,number,number,number]

type SimpleHexColorName = (
   | "YELLOW"
   | "CLEAR"
   | "WHITE"
   | "MULT"
   | "CHIPS"
   | "MONEY"
   | "XMULT"
   | "FILTER"
   | "BLUE"
   | "RED"
   | "GREEN"
   | "PALE_GREEN"
   | "ORANGE"
   | "IMPORTANT"
   | "GOLD"
   | "PURPLE"
   | "BLACK"
   | "L_BLACK"
   | "GREY"
   | "CHANCE"
   | "JOKER_GREY"
   | "VOUCHER"
   | "BOOSTER"
   | "ETERNAL"
   | "PERISHABLE"
   | "RENTAL"
   | "EDITION"
   | "DARK_EDITION"
   | "UI_CHIPS"
   | "UI_MULT"
)

type ComplexHexColorName = (
    | "DYN_UI"
    | "SO_1"
    | "SO_2"
    | "SUITS"
    | "UI"
    | "SET"
    | "SECONDARY_SET"
    | "BLIND"
    | "BACKGROUND"
    | "RARITY"
    | "HAND_LEVELS"
)

type HexColorName = (SimpleHexColorName|ComplexHexColorName)


type HexColorSelection = {[P in HexColorName]: P extends SimpleHexColorName ? HexArray:
        P extends ComplexHexColorName ? (
            P extends "DYN_UI" ? {MAIN: HexArray;DARK: HexArray;BOSS_MAIN: HexArray;BOSS_DARK: HexArray;BOSS_PALE: HexArray;}:
            P extends ("SO_1"|"SO_2"|"SUITS") ? {Hearts: HexArray;Diamonds: HexArray;Spades: HexArray;Clubs: HexArray;}:
            P extends "UI" ? {
                RED: any;TEXT_LIGHT: [1, 1, 1, 1], TEXT_DARK: HexArray;TEXT_INACTIVE: HexArray;BACKGROUND_LIGHT: HexArray;BACKGROUND_WHITE: [1, 1, 1, 1], BACKGROUND_DARK: HexArray;BACKGROUND_INACTIVE: HexArray;OUTLINE_LIGHT: HexArray;OUTLINE_LIGHT_TRANS: HexArray;OUTLINE_DARK: HexArray;TRANSPARENT_LIGHT: HexArray;TRANSPARENT_DARK: HexArray;HOVER: HexArray;
}:
            P extends ("SET"|"SECONDARY_SET") ? {Default: HexArray;Enhanced: HexArray;Joker: HexArray;Tarot: HexArray;Planet: HexArray;Spectral: HexArray;Voucher: HexArray;Edition?: HexArray}:
            P extends "BLIND" ? {Small:HexArray;Big:HexArray;Boss:HexArray;won:HexArray}:
            P extends "BACKGROUND" ? {L:HexArray;D:HexArray;C:HexArray;contrast:number}:
            P extends ("RARITY"|"HAND_LEVELS") ? HexArray[]:
            never
        ):
        HexArray
}

type LanguageID = ("en-us"|"de"|"es_419"|"es_ES"|"fr"|"id"|"it"|"ja"|"ko"|"nl"|"pl"|"pt_BR"|"ru"|"zh_CN"|"zh_TW"|"all1"|"all2")

type LanguageData = {[P in LanguageID]: {font:number|FontData,label:string,key:LanguageID|"all",beta?:boolean,button?:string,warning?:string[],omit?:boolean}}

type Position2D<X extends number = number,Y extends number = number> = {x:X,y:Y}
type Angle2D = {sin:number,cos:number}
type Size2D = {w:number,h:number}

type BaseCardID = "c_base"
type BaseCardTitle = "Default Base"

type JokerCardID = (
  | "j_joker"
  | "j_greedy_joker"
  | "j_lusty_joker"
  | "j_wrathful_joker"
  | "j_gluttenous_joker"
  | "j_jolly"
  | "j_zany"
  | "j_mad"
  | "j_crazy"
  | "j_droll"
  | "j_sly"
  | "j_wily"
  | "j_clever"
  | "j_devious"
  | "j_crafty"
  | "j_half"
  | "j_stencil"
  | "j_four_fingers"
  | "j_mime"
  | "j_credit_card"
  | "j_ceremonial"
  | "j_banner"
  | "j_mystic_summit"
  | "j_marble"
  | "j_loyalty_card"
  | "j_8_ball"
  | "j_misprint"
  | "j_dusk"
  | "j_raised_fist"
  | "j_chaos"
  | "j_fibonacci"
  | "j_steel_joker"
  | "j_scary_face"
  | "j_abstract"
  | "j_delayed_grat"
  | "j_hack"
  | "j_pareidolia"
  | "j_gros_michel"
  | "j_even_steven"
  | "j_odd_todd"
  | "j_scholar"
  | "j_business"
  | "j_supernova"
  | "j_ride_the_bus"
  | "j_space"
  | "j_egg"
  | "j_burglar"
  | "j_blackboard"
  | "j_runner"
  | "j_ice_cream"
  | "j_dna"
  | "j_splash"
  | "j_blue_joker"
  | "j_sixth_sense"
  | "j_constellation"
  | "j_hiker"
  | "j_faceless"
  | "j_green_joker"
  | "j_superposition"
  | "j_todo_list"
  | "j_cavendish"
  | "j_card_sharp"
  | "j_red_card"
  | "j_madness"
  | "j_square"
  | "j_seance"
  | "j_riff_raff"
  | "j_vampire"
  | "j_shortcut"
  | "j_hologram"
  | "j_vagabond"
  | "j_baron"
  | "j_cloud_9"
  | "j_rocket"
  | "j_obelisk"
  | "j_midas_mask"
  | "j_luchador"
  | "j_photograph"
  | "j_gift"
  | "j_turtle_bean"
  | "j_erosion"
  | "j_reserved_parking"
  | "j_mail"
  | "j_to_the_moon"
  | "j_hallucination"
  | "j_fortune_teller"
  | "j_juggler"
  | "j_drunkard"
  | "j_stone"
  | "j_golden"
  | "j_lucky_cat"
  | "j_baseball"
  | "j_bull"
  | "j_diet_cola"
  | "j_trading"
  | "j_flash"
  | "j_popcorn"
  | "j_trousers"
  | "j_ancient"
  | "j_ramen"
  | "j_walkie_talkie"
  | "j_selzer"
  | "j_castle"
  | "j_smiley"
  | "j_campfire"
  | "j_ticket"
  | "j_mr_bones"
  | "j_acrobat"
  | "j_sock_and_buskin"
  | "j_swashbuckler"
  | "j_troubadour"
  | "j_certificate"
  | "j_smeared"
  | "j_throwback"
  | "j_hanging_chad"
  | "j_rough_gem"
  | "j_bloodstone"
  | "j_arrowhead"
  | "j_onyx_agate"
  | "j_glass"
  | "j_ring_master"
  | "j_flower_pot"
  | "j_blueprint"
  | "j_wee"
  | "j_merry_andy"
  | "j_oops"
  | "j_idol"
  | "j_seeing_double"
  | "j_matador"
  | "j_hit_the_road"
  | "j_duo"
  | "j_trio"
  | "j_family"
  | "j_order"
  | "j_tribe"
  | "j_stuntman"
  | "j_invisible"
  | "j_brainstorm"
  | "j_satellite"
  | "j_shoot_the_moon"
  | "j_drivers_license"
  | "j_cartomancer"
  | "j_astronomer"
  | "j_burnt"
  | "j_bootstraps"
  | "j_caino"
  | "j_triboulet"
  | "j_yorick"
  | "j_chicot"
  | "j_perkeo"
);

type TarotCardID = (
   | "c_fool"
   | "c_magician"
   | "c_high_priestess"
   | "c_empress"
   | "c_emperor"
   | "c_heirophant"
   | "c_lovers"
   | "c_chariot"
   | "c_justice"
   | "c_hermit"
   | "c_wheel_of_fortune"
   | "c_strength"
   | "c_hanged_man"
   | "c_death"
   | "c_temperance"
   | "c_devil"
   | "c_tower"
   | "c_star"
   | "c_moon"
   | "c_sun"
   | "c_judgement"
   | "c_world"
);

type PlanetCardID = (
   | "c_mercury"
   | "c_venus"
   | "c_earth"
   | "c_mars"
   | "c_jupiter"
   | "c_saturn"
   | "c_uranus"
   | "c_neptune"
   | "c_pluto"
   | "c_planet_x"
   | "c_ceres"
   | "c_eris"
);

type SpectralCardID = (
   | "c_familiar"
   | "c_grim"
   | "c_incantation"
   | "c_talisman"
   | "c_aura"
   | "c_wraith"
   | "c_sigil"
   | "c_ouija"
   | "c_ectoplasm"
   | "c_immolate"
   | "c_ankh"
   | "c_deja_vu"
   | "c_hex"
   | "c_trance"
   | "c_medium"
   | "c_cryptid"
   | "c_soul"
   | "c_black_hole"
);

type ConsumableCardID = (TarotCardID|PlanetCardID|SpectralCardID)

type VoucherCardID = (
   | "v_overstock_norm"
   | "v_clearance_sale"
   | "v_hone"
   | "v_reroll_surplus"
   | "v_crystal_ball"
   | "v_telescope"
   | "v_grabber"
   | "v_wasteful"
   | "v_tarot_merchant"
   | "v_planet_merchant"
   | "v_seed_money"
   | "v_blank"
   | "v_magic_trick"
   | "v_hieroglyph"
   | "v_directors_cut"
   | "v_paint_brush"
   | "v_overstock_plus"
   | "v_liquidation"
   | "v_glow_up"
   | "v_reroll_glut"
   | "v_omen_globe"
   | "v_observatory"
   | "v_nacho_tong"
   | "v_recyclomancy"
   | "v_tarot_tycoon"
   | "v_planet_tycoon"
   | "v_money_tree"
   | "v_antimatter"
   | "v_illusion"
   | "v_petroglyph"
   | "v_retcon"
   | "v_palette"
);

type CardItemID = (BaseCardID|JokerCardID|ConsumableCardID|VoucherCardID)

type GameDeckID = (
   | "b_red"
   | "b_blue"
   | "b_yellow"
   | "b_green"
   | "b_black"
   | "b_magic"
   | "b_nebula"
   | "b_ghost"
   | "b_abandoned"
   | "b_checkered"
   | "b_zodiac"
   | "b_painted"
   | "b_anaglyph"
   | "b_plasma"
   | "b_erratic"
   | "b_challenge"
);

type EnhancedCardID = (
   | "m_bonus"
   | "m_mult"
   | "m_wild"
   | "m_glass"
   | "m_steel"
   | "m_stone"
   | "m_gold"
   | "m_lucky"
);

type EditionCardID = (
   | "e_base"
   | "e_foil"
   | "e_holo"
   | "e_polychrome"
   | "e_negative"
);

type CardSpecialID = (EnhancedCardID|EditionCardID)

type BoosterPackID = (
   | "p_arcana_normal_1"
   | "p_arcana_normal_2"
   | "p_arcana_normal_3"
   | "p_arcana_normal_4"
   | "p_arcana_jumbo_1"
   | "p_arcana_jumbo_2"
   | "p_arcana_mega_1"
   | "p_arcana_mega_2"
   | "p_celestial_normal_1"
   | "p_celestial_normal_2"
   | "p_celestial_normal_3"
   | "p_celestial_normal_4"
   | "p_celestial_jumbo_1"
   | "p_celestial_jumbo_2"
   | "p_celestial_mega_1"
   | "p_celestial_mega_2"
   | "p_spectral_normal_1"
   | "p_spectral_normal_2"
   | "p_spectral_jumbo_1"
   | "p_spectral_mega_1"
   | "p_standard_normal_1"
   | "p_standard_normal_2"
   | "p_standard_normal_3"
   | "p_standard_normal_4"
   | "p_standard_jumbo_1"
   | "p_standard_jumbo_2"
   | "p_standard_mega_1"
   | "p_standard_mega_2"
   | "p_buffoon_normal_1"
   | "p_buffoon_normal_2"
   | "p_buffoon_jumbo_1"
   | "p_buffoon_mega_1"
)

type CardUtilityID = (
   | "soul"
   | "undiscovered_joker"
   | "undiscovered_tarot"
);

type CardSealID = (
   | "Red"
   | "Blue"
   | "Gold"
   | "Purple"
);

type TagTrinketID = (
   | "tag_uncommon"
   | "tag_rare"
   | "tag_negative"
   | "tag_foil"
   | "tag_holo"
   | "tag_polychrome"
   | "tag_investment"
   | "tag_voucher"
   | "tag_boss"
   | "tag_standard"
   | "tag_charm"
   | "tag_meteor"
   | "tag_buffoon"
   | "tag_handy"
   | "tag_garbage"
   | "tag_ethereal"
   | "tag_coupon"
   | "tag_double"
   | "tag_juggle"
   | "tag_d_six"
   | "tag_top_up"
   | "tag_skip"
   | "tag_orbital"
   | "tag_economy"
);

type GameStakeID = (
   | "stake_white"
   | "stake_red"
   | "stake_green"
   | "stake_black"
   | "stake_blue"
   | "stake_purple"
   | "stake_orange"
   | "stake_gold"
);

type RoundBlindID = (
   | "bl_small"
   | "bl_big"
   | "bl_ox"
   | "bl_hook"
   | "bl_mouth"
   | "bl_fish"
   | "bl_club"
   | "bl_manacle"
   | "bl_tooth"
   | "bl_wall"
   | "bl_house"
   | "bl_mark"
   | "bl_final_bell"
   | "bl_wheel"
   | "bl_arm"
   | "bl_psychic"
   | "bl_goad"
   | "bl_water"
   | "bl_eye"
   | "bl_plant"
   | "bl_needle"
   | "bl_head"
   | "bl_final_leaf"
   | "bl_final_vessel"
   | "bl_window"
   | "bl_serpent"
   | "bl_pillar"
   | "bl_flint"
   | "bl_final_acorn"
   | "bl_final_heart"
);

type PlayingCardID = (
   | "H_2"
   | "H_3"
   | "H_4"
   | "H_5"
   | "H_6"
   | "H_7"
   | "H_8"
   | "H_9"
   | "H_T"
   | "H_J"
   | "H_Q"
   | "H_K"
   | "H_A"
   | "C_2"
   | "C_3"
   | "C_4"
   | "C_5"
   | "C_6"
   | "C_7"
   | "C_8"
   | "C_9"
   | "C_T"
   | "C_J"
   | "C_Q"
   | "C_K"
   | "C_A"
   | "D_2"
   | "D_3"
   | "D_4"
   | "D_5"
   | "D_6"
   | "D_7"
   | "D_8"
   | "D_9"
   | "D_T"
   | "D_J"
   | "D_Q"
   | "D_K"
   | "D_A"
   | "S_2"
   | "S_3"
   | "S_4"
   | "S_5"
   | "S_6"
   | "S_7"
   | "S_8"
   | "S_9"
   | "S_T"
   | "S_J"
   | "S_Q"
   | "S_K"
   | "S_A"
);

type ConsumableCardSet = (
    | "Tarot"
    | "Planet"
    | "Spectral"
);

type CardItemSet = (
    | "Default"
    | "Joker"
    | ConsumableCardSet
    | "Voucher"
);

type CardSpecialSet = (
    | "Enhanced"
    | "Edition"
);

type GameDeckSet = (
    | "Back"
);

type BoosterPackSet = (
    | "Booster"
);

type CenterSet = (
    | CardItemSet
    | CardSpecialSet
    | GameDeckSet
    | BoosterPackSet
);

type GameSet = (
    | CenterSet
    | "Seal"
    | "Tag"
    | "Stake"
);

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
    selcted_display(selcted_display: any): [any, any]; 
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
    lose_CTA_shown: any;
    total_uptime: number;
    timed_CTA_shown: boolean;
    win_CTA_shown: boolean;
    quit_CTA_shown: boolean;
}

interface Settings {
    screen_res: any;
    DEMO_ROUNDS: any;
    current_setup: string;
    ambient_control?: any;
    colour_palettes?: any;
    QUEUED_CHANGE?: {
        screenres: any;
        vsync: any;
        selected_display: boolean;
        screenmode?: string
    };
    music_control?: { desired_track: string; current_track: string; lerp: number; };
    real_language?: string;
    skip_splash?: string;
    tutorial_complete?: any;
    reduced_motion?: number;
    perf_mode?: boolean; 
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
    profile: number;
    tutorial_progress?: {
        forced_shop: boolean | { forced_voucher?: { completed_parts: {}; }; forced_tags?: { completed_parts: {}; }; completed_parts: {}; } | undefined;
        forced_voucher?: { completed_parts: {}; };
        forced_tags?: { completed_parts: {}; };
        completed_parts: {}
    },
    version?: string;
}

interface GameCheckData {
    checkpoint_list: {
        time: number;
        TTC: number;
        trend: (number|undefined)[];
        states: (number|undefined)[];
        average: number;
        label: string
    }[];
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

interface ChallengeParams {
    unlocked: boolean;
    name: string; 
    id: string; 
    rules: { custom: { id: string; value?: number|string; }[]; modifiers: { id?: string; value?: number; }[]; };
    jokers: ({ id: string; edition?: string; eternal?: boolean; pinned?: boolean })[];
    consumeables: {
        edition: any;
        eternal: any; id: string; 
}[];
    vouchers: {
        edition: any;
        eternal: any; id: string; 
}[];
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

interface GameItemParams {
    wip?: boolean;
    alerted?: boolean;
    discovered?: boolean;
    unlocked?: boolean;
    demo?: boolean;
    set?: GameSet;
    start_alerted?: boolean;
    key?: string;
    skip_pool?: boolean;
    omit?: boolean;
}

interface PlayingCardParams {
    name: string;
    value: string;
    suit: string;
    pos: Position2D;
}

interface CardParams extends GameItemParams {
    consumeable?: boolean;
    rarity?: number;
    order?: number;
}

interface BaseCardParams extends CardParams {
    max: 500;
    freq: 1;
    line: "base";
    name: "Default Base";
    pos: Position2D<1,0>;
    set: "Default";
    label: "Base Card";
    effect: "Base";
    cost_mult: 1;
    config: CenterAbilityConfig;
}

interface JokerCardParams extends CardParams {
    order: number;
    start_alerted?: boolean;
    blueprint_compat: boolean;
    perishable_compat: boolean;
    eternal_compat: boolean;
    rarity: number;
    cost: number;
    name: string;
    pos: Position2D;
    set: "Joker";
    effect?: string;
    cost_mult?: number;
    config: CenterAbilityConfig;
    unlock_condition?: UnlockConditionConfig;
    enhancement_gate?: string;
    no_pool_flag?: string;
    yes_pool_flag?: string;
    soul_pos?: Position2D;
}

interface ConsumableCardParams extends CardParams {
    order: number;
    cost: number;
    consumeable: true;
    name: string;
    pos: Position2D;
    set: ConsumableCardSet;
    effect?: string;
    cost_mult?: number;
    config: CenterAbilityConfig;
}

interface TarotCardParams extends ConsumableCardParams {
    set: "Tarot";
}

interface SpectralCardParams extends ConsumableCardParams {
    set: "Spectral";
    hidden?: boolean;
}

interface PlanetCardParams extends ConsumableCardParams {
    set: "Planet";
    freq?: number;
}

interface VoucherCardParams extends CardParams {
    order: number;
    available: boolean;
    cost: number;
    name: string;
    pos: Position2D;
    set: "Voucher";
    config: CenterAbilityConfig;
    requires?: string[];
    unlock_condition?: UnlockConditionConfig;
}

interface EnhancedCardParams extends CardParams {
    max: number;
    order: number;
    name: string;
    set: "Enhanced";
    pos: Position2D;
    effect: string;
    label: string;
    config: CenterAbilityConfig;
}

interface EditionCardParams extends CardParams {
    badge_colour: any;
    order: number;
    name: string;
    pos: Position2D;
    atlas: string;
    set: "Edition";
    config: CenterAbilityConfig;
}

interface BoosterPackParams extends CardParams {
    order: number;
    name: string;
    weight: number;
    kind: string;
    cost: number;
    pos: Position2D;
    atlas: string;
    set: "Booster";
    config: CenterAbilityConfig;
}

interface GameDeckParams extends CardParams {
    name: string;
    stake: number;
    order: number;
    pos: Position2D;
    set: "Back";
    config: CenterAbilityConfig;
    unlock_condition?: UnlockConditionConfig;
}

interface RoundBlindParams extends GameItemParams {
    no_collection?: boolean;
    name: string;
    defeated: boolean;
    order: number;
    dollars: number;
    mult: number;
    vars: {};
    debuff_text?: string;
    debuff: {};
    boss?: {min:number; max:number; showdown?: boolean};
    boss_colour?: HexArray;
    pos: Position2D;
}

interface TagTrinketParams extends GameItemParams {
    mod: boolean;
    no_collection?: boolean;
    name: string;
    set: "Tag";
    min_ante?: number;
    order: number;
    config: CenterAbilityConfig;
    requires?: string;
    pos: Position2D;
}

interface GameStakeParams extends GameItemParams {
    unlocked_stake?: number;
    atlas?: string;
    shiny?: boolean;
    name: string;
    set: "Stake";
    order: number;
    pos: Position2D;
    stake_level: number;
}

interface CardSealParams extends GameItemParams {
    order: number;
}

interface CardUtilityParams extends CardParams {
    pos: Position2D;
    name?: string;
    config?: CenterAbilityConfig;
    order?: number;
    debuff_text?: string;
    max?: number;
    cost_mult?: number;
}

type CenterID = (
    | CardItemID
    | CardSpecialID
    | GameDeckID
    | BoosterPackID
    | CardUtilityID
);


type P_CENTERS = {
    [P1 in (CardItemID|CardSpecialID|GameDeckID|BoosterPackID|CardUtilityID)]: 
        P1 extends BaseCardID ? BaseCardParams:
        P1 extends JokerCardID ? JokerCardParams:
        P1 extends TarotCardID ? TarotCardParams:
        P1 extends PlanetCardID ? PlanetCardParams:
        P1 extends SpectralCardID ? SpectralCardParams:
        P1 extends VoucherCardID ? VoucherCardParams:
        P1 extends EnhancedCardID ? EnhancedCardParams:
        P1 extends EditionCardID ? EditionCardParams:
        P1 extends GameDeckID ? GameDeckParams:
        P1 extends BoosterPackID ? BoosterPackParams:
        P1 extends CardUtilityID ? CardUtilityParams:
        never;
}

type ConsumeableCardParams = (TarotCardParams|PlanetCardParams|SpectralCardParams)

type CardItemParams = (BaseCardParams|JokerCardParams|ConsumableCardParams|VoucherCardParams)

type CardSpecialParams = (EnhancedCardParams|EditionCardParams)

type CenterItemParams = (CardItemParams|CardSpecialParams|BoosterPackParams|GameDeckParams|CardUtilityParams)

type P_TAGS = {[P in TagTrinketID]: TagTrinketParams}
type P_BLINDS = {[P in RoundBlindID]: RoundBlindParams}
type P_SEALS = {[P in CardSealID]: CardSealParams}
type P_STAKES = {[P in GameStakeID]: GameStakeParams}
type P_CARDS = {[P in PlayingCardID]: PlayingCardParams}

interface TIMERS {
    TOTAL: number;
    REAL: number;
    REAL_SHADER: number;
    UPTIME: number;
    BACKGROUND: number;
}

interface FRAMES {
    DRAW: number;
    MOVE: number;
}

// rest combined into game.ts