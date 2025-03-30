///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>

function GET_DISPLAYINFO(screenmode: string, display: number): number {
    display = display || G.SETTINGS.WINDOW.selected_display || 1;
    screenmode = screenmode || G.SETTINGS.WINDOW.screenmode || "Windowed";
    let display_count = love.window.getDisplayCount();
    let res_option = 1;
    let [realw, realh] = love.window.getMode();
    let current_res_values = { w: realw, h: realh };
    G.SETTINGS.WINDOW.display_names = [];
    for (let i = 1; i <= display_count; i++) {
        G.SETTINGS.WINDOW.DISPLAYS[i] = [] as any;
        G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions = { strings: [], values: [] };
        G.SETTINGS.WINDOW.display_names[i] = "" + i;
        let [render_w, render_h] = love.window.getDesktopDimensions(i);
        let unscaled_dims = love.window.getFullscreenModes(i)[1];
        G.SETTINGS.WINDOW.DISPLAYS[i].DPI_scale = 1;
        G.SETTINGS.WINDOW.DISPLAYS[i].MONITOR_DIMS = unscaled_dims;
        if (screenmode === "Fullscreen") {
            for (const [_, v] of ipairs(love.window.getFullscreenModes(i))) {
                let [_w, _h] = [v.width * G.SETTINGS.WINDOW.DISPLAYS[i].DPI_scale, v.height * G.SETTINGS.WINDOW.DISPLAYS[i].DPI_scale];
                if (_w <= G.SETTINGS.WINDOW.DISPLAYS[i].MONITOR_DIMS.width && _h <= G.SETTINGS.WINDOW.DISPLAYS[i].MONITOR_DIMS.height) {
                    G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.strings[G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.strings.length + 1] = "" + (v.width + (" X " + v.height));
                    G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.values[G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.values.length + 1] = { w: v.width, h: v.height };
                    if (i === G.SETTINGS.WINDOW.selected_display && i === display && current_res_values.w === v.width && current_res_values.h === v.height) {
                        res_option = G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.values.length;
                    }
                }
            }
        }
        if (screenmode === "Windowed") {
            G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.strings[1] = "-";
            G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.values[1] = { w: 1280, h: 720 };
        }
        if (screenmode === "Borderless") {
            G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.strings[1] = "" + (G.SETTINGS.WINDOW.DISPLAYS[i].MONITOR_DIMS.width / G.SETTINGS.WINDOW.DISPLAYS[i].DPI_scale + (" X " + G.SETTINGS.WINDOW.DISPLAYS[i].MONITOR_DIMS.height / G.SETTINGS.WINDOW.DISPLAYS[i].DPI_scale));
            G.SETTINGS.WINDOW.DISPLAYS[i].screen_resolutions.values[1] = current_res_values;
        }
    }
    return res_option;
};
function timer_checkpoint(label: string, type: "draw"|"update", reset: undefined): any {
    G.PREV_GARB = G.PREV_GARB || 0;
    if (!G.F_ENABLE_PERF_OVERLAY) {
        return;
    }
    G.check = G.check || { draw: { checkpoint_list: [], checkpoints: 0, last_time: 0 }, update: { checkpoint_list: [], checkpoints: 0, last_time: 0 } };
    let cp = G.check[type];
    if (reset) {
        cp.last_time = love.timer.getTime();
        cp.checkpoints = 0;
        return;
    }
    cp.checkpoint_list[cp.checkpoints + 1] = cp.checkpoint_list[cp.checkpoints + 1] || {};
    cp.checkpoints = cp.checkpoints + 1;
    cp.checkpoint_list[cp.checkpoints].label = label + (": " + (collectgarbage("count") - G.PREV_GARB));
    cp.checkpoint_list[cp.checkpoints].time = love.timer.getTime();
    cp.checkpoint_list[cp.checkpoints].TTC = cp.checkpoint_list[cp.checkpoints].time - cp.last_time;
    cp.checkpoint_list[cp.checkpoints].trend = cp.checkpoint_list[cp.checkpoints].trend || [];
    cp.checkpoint_list[cp.checkpoints].states = cp.checkpoint_list[cp.checkpoints].states || [];
    table.insert(cp.checkpoint_list[cp.checkpoints].trend, 1, cp.checkpoint_list[cp.checkpoints].TTC);
    table.insert(cp.checkpoint_list[cp.checkpoints].states, 1, G.STATE);
    cp.checkpoint_list[cp.checkpoints].trend[401] = undefined;
    cp.checkpoint_list[cp.checkpoints].states[401] = undefined;
    cp.last_time = cp.checkpoint_list[cp.checkpoints].time;
    G.PREV_GARB = collectgarbage("count");
    let av = 0;
    for (const [k, v] of cp.checkpoint_list[cp.checkpoints].trend.entries()) {
        av = av + (v??0) / cp.checkpoint_list[cp.checkpoints].trend.length;
    }
    cp.checkpoint_list[cp.checkpoints].average = av;
};
function boot_timer(_label: string, _next: string, progress?: number): void {
    progress = progress || 0;
    G.LOADING = G.LOADING || { font: love.graphics.setNewFont("resources/fonts/m6x11plus.ttf", 20), [1]: undefined };
};
function EMPTY(t: any[]): [] {
    if (!t) {
        return [];
    }
    for (const [k, v] of Object.entries(t)) {
        t[k] = undefined;
        delete t[k];
    }
    return t as [];
};
function interp(per: number, max: number, min: number): number|undefined {
    min = min || 0;
    if (per && max) {
        return per * (max - min) + min;
    }
};

function remove_all(t: (LuaNode|undefined)[]): void {
    for (let i = t.length; i >= 1; i += -1) {
        let v = t[i];
        table.remove(t, i);
        if (v && v.children) {
            remove_all(v.children as any);
        }
        if (v) {
            v.remove();
        }
        v = undefined;
    }
    for (let [_, v] of Object.entries(t)) {
        if (v?.children) {
            remove_all(v.children as any);
        }
        v?.remove();
        v = undefined;
    }
};
function Vector_Dist(trans1: { x: number; w: number; y: number; h: number; }, trans2: { x: number; w: number; y: number; h: number; }, mid?: any): any {
    let x = trans1.x - trans2.x + (mid && 0.5 * (trans1.w - trans2.w) || 0);
    let y = trans1.y - trans2.y + (mid && 0.5 * (trans1.h - trans2.h) || 0);
    return math.sqrt(x * x + y * y);
};
function Vector_Len(trans1: { x: number; y: number; }): any {
    return math.sqrt(trans1.x * trans1.x + trans1.y * trans1.y);
};
function Vector_Sub(trans1: { x: number; y: number; }, trans2: { x: number; y: number; }): any {
    return { x: trans1.x - trans2.x, y: trans1.y - trans2.y };
};
function get_index(t: any, val: any): number|string|symbol|undefined {
    let index:number|string|symbol|undefined = undefined;
    for (const [i, v] of pairs(t)) {
        if (v === val) {
            index = i;
        }
    }
    return index;
};
function table_length(t: any): number {
    let count = 0;
    for (const [_] of pairs(t)) {
        count = count + 1;
    }
    return count;
};
function remove_nils(t: any[]): any[] {
    let ans: any[] = [];
    for (const [_, v] of pairs(t)) {
        ans[ans.length + 1] = v;
    }
    return ans;
};
function SWAP(t: { [x: string]: any; }, i: string | number, j: string | number): any {
    if (!t || !i || !j) {
        return;
    }
    let temp = t[i];
    t[i] = t[j];
    t[j] = temp;
};
function pseudoshuffle(list: any[], seed: any): any {
    if (seed) {
        math.random(/*seed*/);
    }
    if (list[1] && list[1].sort_id) {
        table.sort(list, function (a, b) {
            return (a.sort_id || 1) < (b.sort_id || 2);
        });
    }
    for (let i = list.length; i <= 2; i += -1) {
        let j = math.random(/*i*/);
        [list[i], list[j]] = [list[j], list[i]];
    }
};
function generate_starting_seed(): string {
    if (G.GAME.stake >= G.P_CENTER_POOLS["Stake"].length) {
        let [r_leg, r_tally]: [{[x:string]:boolean},number] = [{}, 0];
        let [g_leg, g_tally]: [{[x:string]:boolean},number] = [{}, 0];
        for (const [k, v] of Object.entries(G.P_JOKER_RARITY_POOLS[3])) {
            let win_ante = get_joker_win_sticker(v, true);
            if (win_ante && win_ante >= 8 || v.in_pool && typeof v.in_pool === "function" && !v.in_pool()) {
                g_leg[v.key??""] = true;
                g_tally = g_tally + 1;
            }
            else {
                r_leg[v.key??""] = true;
                r_tally = r_tally + 1;
            }
        }
        if (r_tally > 0 && g_tally > 0) {
            let seed_found:string|undefined = undefined;
            let extra_num = 0;
            while (!seed_found) {
                extra_num = extra_num + 0.561892350821;
                seed_found = random_string(8, extra_num + G.CONTROLLER.cursor_hover.T.x * 0.33411983 + G.CONTROLLER.cursor_hover.T.y * 0.874146 + 0.41231101 * G.CONTROLLER.cursor_hover.time);
                if (!r_leg[get_first_legendary(seed_found)]) {
                    seed_found = undefined;
                }
            }
            return seed_found;
        }
    }
    return random_string(8, G.CONTROLLER.cursor_hover.T.x * 0.33411983 + G.CONTROLLER.cursor_hover.T.y * 0.874146 + 0.41231101 * G.CONTROLLER.cursor_hover.time);
};
function get_first_legendary(_key: any): string|undefined {
    let [_t, key] = pseudorandom_element(G.P_JOKER_RARITY_POOLS[3], pseudoseed("Joker4", _key));
    return _t?.key;
};
function pseudorandom_element<T>(_t: T[] | P_CARDS, seed?: number, args?: { starting_deck: any; in_pool?: any; }): [T|undefined,string|undefined] {
    if (_t === SMODS.Suits) {
        _t = SMODS.Suit.obj_list(true);
    }
    if (_t === SMODS.Ranks) {
        _t = SMODS.Rank.obj_list();
    }
    if (seed) {
        math.randomseed(seed);
    }
    let keys: {k:string;v:any}[] = [];
    for (const [k, v] of Object.entries(_t)) {
        let keep = true;
        let in_pool_func = args && args.in_pool || typeof v === "object" && typeof v.in_pool === "function" && v.in_pool || _t === G.P_CARDS && function (c: { value: string | number; suit: string | number; }) {
            let initial_deck = args && args.starting_deck || false;
            return !(typeof SMODS.Ranks[c.value].in_pool === "function" && !SMODS.Ranks[c.value].in_pool({ initial_deck: initial_deck, suit: c.suit }) || typeof SMODS.Suits[c.suit].in_pool === "function" && !SMODS.Suits[c.suit].in_pool({ initial_deck: initial_deck, rank: c.value }));
        };
        if (in_pool_func) {
            keep = in_pool_func(v, args);
        }
        if (keep) {
            keys[keys.length + 1] = { k: k, v: v };
        }
    }
    if (keys[1] && keys[1].v && typeof keys[1].v === "object" && keys[1].v.sort_id) {
        table.sort(keys, function (a, b) {
            return a.v.sort_id < b.v.sort_id;
        });
    }
    else {
        table.sort(keys, function (a, b) {
            return a.k < b.k;
        });
    }
    if (keys.length === 0) {
        return [undefined, undefined];
    }
    let key = keys[math.random(keys.length)].k;
    return [_t[key], key];
};
function random_string(length: number, seed?: number): string {
    if (seed) {
        math.randomseed(seed);
    }
    let ret = "";
    for (let i = 1; i <= length; i++) {
        ret = ret + string.char(math.random() > 0.7 && math.random(string.byte("1"), string.byte("9")) || (math.random() > 0.45 && math.random(string.byte("A"), string.byte("N")) || math.random(string.byte("P"), string.byte("Z"))));
    }
    return string.upper(ret);
};
function pseudohash(str: string): number {
    let num = 1;
    for (let i = str.length; i >= 1; i += -1) {
        num = (1.1239285023 / num * string.byte(str, i) * math.pi + math.pi * i) % 1;
    }
    return num;
};
function pseudoseed(key: string|"seed", predict_seed?: string): number {
    if (key === "seed") {
        return math.random();
    }
    if (predict_seed) {
        let _pseed = pseudohash(key + (predict_seed || ""));
        _pseed = math.abs(tonumber(string.format("%.13f", (2.134453429141 + _pseed * 1.72431234) % 1))??0);
        return (_pseed + (pseudohash(predict_seed) || 0)) / 2;
    }
    if (!G.GAME.pseudorandom[key]) {
        G.GAME.pseudorandom[key] = pseudohash(key + (G.GAME.pseudorandom.seed || ""));
    }
    G.GAME.pseudorandom[key] = math.abs(tonumber(string.format("%.13f", (2.134453429141 + G.GAME.pseudorandom[key] * 1.72431234) % 1))??0);
    return (G.GAME.pseudorandom[key] + (G.GAME.pseudorandom.hashed_seed || 0)) / 2;
};
function pseudorandom(seed: number | string, min?: number, max?: number): number {
    let num = 0
    if (typeof seed === "string") {
        num = pseudoseed(seed);
    } else {
        num = seed
    }
    math.randomseed(num);
    if (min && max) {
        return math.random(min, max);
    }
    else {
        return math.random();
    }
};
function tprint(tbl: LuaTable<any>, indent?: number): any {
    if (!indent) {
        indent = 0;
    }
    let toprint = string.rep(" ", indent) + "{\\r\\n";
    indent = indent + 2;
    for (const [k, v] of pairs(tbl)) {
        toprint = toprint + string.rep(" ", indent);
        if (typeof k === "number") {
            toprint = toprint + ("[" + (k + "] = "));
        }
        if (typeof k === "string") {
            toprint = toprint + (k + "= ");
        }
        if (typeof v === "number") {
            toprint = toprint + (v + ",\\r\\n");
        }
        if (typeof v === "string") {
            toprint = toprint + ("\\\"" + (v + "\\\",\\r\\n"));
        }
        if (typeof v === "object") {
            if (indent >= 10) {
                toprint = toprint + (String(v) + ",\\r\\n");
            }
            else {
                toprint = toprint + (String(v) + (tprint(v, indent + 1) + ",\\r\\n"));
            }
        }
        else {
            toprint = toprint + ("\\\"" + (String(v) + "\\\",\\r\\n"));
        }
    }
    toprint = toprint + (string.rep(" ", indent - 2) + "}");
    return toprint;
};
function sortingFunction(e1: { order: number; }, e2: { order: number; }): boolean {
    return e1.order < e2.order;
};

function HEX(hex:string): HexArray {
    if (hex.length <= 6) {
        hex = hex + "FF";
    }
    let [_, __, r, g, b, a] = string.find(hex,"(%x%x)(%x%x)(%x%x)(%x%x)");
    let color = [(tonumber(r, 16)??0) / 255, (tonumber(g, 16)??0) / 255, (tonumber(b, 16)??0) / 255, (tonumber(a, 16)??0) / 255] as HexArray;
    return color;
};

function get_blind_main_colour(blind_name?: "Boss"|"Small"|"Big"|"bl_small"|"bl_big"): any {
    let disabled = false;
    let blind = blind_name || "";
    if (blind === "Boss" || blind === "Small" || blind === "Big") {
        G.GAME.round_resets.blind_states = G.GAME.round_resets.blind_states || {};
        if (G.GAME.round_resets.blind_states[blind] === "Defeated" || G.GAME.round_resets.blind_states[blind] === "Skipped") {
            disabled = true;
        }
        blind = G.GAME.round_resets.blind_choices[blind];
    }
    return (disabled || !G.P_BLINDS[blind]) && G.C.BLACK || G.P_BLINDS[blind].boss_colour || (blind === "bl_small" && mix_colours(G.C.BLUE, G.C.BLACK, 0.6) || blind === "bl_big" && mix_colours(G.C.ORANGE, G.C.BLACK, 0.6)) || G.C.BLACK;
};

function evaluate_poker_hand(hand: PokerHandName): any {
    let results = { ["Flush Five"]: {}, ["Flush House"]: {}, ["Five of a Kind"]: {}, ["Straight Flush"]: {}, ["Four of a Kind"]: {}, ["Full House"]: {}, ["Flush"]: {}, ["Straight"]: {}, ["Three of a Kind"]: {}, ["Two Pair"]: {}, ["Pair"]: {}, ["High Card"]: {}, top: undefined };
    for (const [_, v] of ipairs(SMODS.PokerHand.obj_buffer)) {
        results[v] = {};
    }
    let parts = { _5: get_X_same(5, hand), _4: get_X_same(4, hand), _3: get_X_same(3, hand), _2: get_X_same(2, hand), _flush: get_flush(hand), _straight: get_straight(hand), _highest: get_highest(hand) };
    for (const [_, _hand] of pairs(SMODS.PokerHands)) {
        if (_hand.atomic_part && typeof _hand.atomic_part === "function") {
            parts[_hand.key] = _hand.atomic_part(hand);
        }
    }
    if (next(parts._5) && next(parts._flush)) {
        results["Flush Five"] = parts._5;
        if (!results.top) {
            results.top = results["Flush Five"];
        }
    }
    if (next(parts._3) && next(parts._2) && next(parts._flush)) {
        let fh_hand = {};
        let fh_3 = parts._3[1];
        let fh_2 = parts._2[1];
        for (let i = 1; i <= fh_3.length; i++) {
            fh_hand[fh_hand.length + 1] = fh_3[i];
        }
        for (let i = 1; i <= fh_2.length; i++) {
            fh_hand[fh_hand.length + 1] = fh_2[i];
        }
        table.insert(results["Flush House"], fh_hand);
        if (!results.top) {
            results.top = results["Flush House"];
        }
    }
    if (next(parts._5)) {
        results["Five of a Kind"] = parts._5;
        if (!results.top) {
            results.top = results["Five of a Kind"];
        }
    }
    if (next(parts._flush) && next(parts._straight)) {
        let [_s, _f, ret] = [parts._straight, parts._flush, {}];
        for (const [_, v] of ipairs(_f[1])) {
            ret[ret.length + 1] = v;
        }
        for (const [_, v] of ipairs(_s[1])) {
            let in_straight = undefined;
            for (const [_, vv] of ipairs(_f[1])) {
                if (vv === v) {
                    in_straight = true;
                }
            }
            if (!in_straight) {
                ret[ret.length + 1] = v;
            }
        }
        results["Straight Flush"] = [ret];
        if (!results.top) {
            results.top = results["Straight Flush"];
        }
    }
    if (next(parts._4)) {
        results["Four of a Kind"] = parts._4;
        if (!results.top) {
            results.top = results["Four of a Kind"];
        }
    }
    if (next(parts._3) && next(parts._2)) {
        let fh_hand = {};
        let fh_3 = parts._3[1];
        let fh_2 = parts._2[1];
        for (let i = 1; i <= fh_3.length; i++) {
            fh_hand[fh_hand.length + 1] = fh_3[i];
        }
        for (let i = 1; i <= fh_2.length; i++) {
            fh_hand[fh_hand.length + 1] = fh_2[i];
        }
        table.insert(results["Full House"], fh_hand);
        if (!results.top) {
            results.top = results["Full House"];
        }
    }
    if (next(parts._flush)) {
        results["Flush"] = parts._flush;
        if (!results.top) {
            results.top = results["Flush"];
        }
    }
    if (next(parts._straight)) {
        results["Straight"] = parts._straight;
        if (!results.top) {
            results.top = results["Straight"];
        }
    }
    if (next(parts._3)) {
        results["Three of a Kind"] = parts._3;
        if (!results.top) {
            results.top = results["Three of a Kind"];
        }
    }
    if (parts._2.length === 2 || parts._3.length === 1 && parts._2.length === 1) {
        let fh_hand = {};
        let r = parts._2;
        let fh_2a = r[1];
        let fh_2b = r[2];
        if (!fh_2b) {
            fh_2b = parts._3[1];
        }
        for (let i = 1; i <= fh_2a.length; i++) {
            fh_hand[fh_hand.length + 1] = fh_2a[i];
        }
        for (let i = 1; i <= fh_2b.length; i++) {
            fh_hand[fh_hand.length + 1] = fh_2b[i];
        }
        table.insert(results["Two Pair"], fh_hand);
        if (!results.top) {
            results.top = results["Two Pair"];
        }
    }
    if (next(parts._2)) {
        results["Pair"] = parts._2;
        if (!results.top) {
            results.top = results["Pair"];
        }
    }
    if (next(parts._highest)) {
        results["High Card"] = parts._highest;
        if (!results.top) {
            results.top = results["High Card"];
        }
    }
    if (results["Five of a Kind"][1]) {
        results["Four of a Kind"] = [results["Five of a Kind"][1], results["Five of a Kind"][2], results["Five of a Kind"][3], results["Five of a Kind"][4]];
    }
    if (results["Four of a Kind"][1]) {
        results["Three of a Kind"] = [results["Four of a Kind"][1], results["Four of a Kind"][2], results["Four of a Kind"][3]];
    }
    if (results["Three of a Kind"][1]) {
        results["Pair"] = [results["Three of a Kind"][1], results["Three of a Kind"][2]];
    }
    for (const [_, _hand] of pairs(SMODS.PokerHands)) {
        if (_hand.composite && typeof _hand.composite === "function") {
            let other_hands;
            [results[_hand.key], other_hands] = _hand.composite(parts);
            results[_hand.key] = results[_hand.key] || {};
            if (other_hands && typeof other_hands === "object") {
                for (const [k, v] of pairs(other_hands)) {
                    results[k] = v;
                }
            }
        }
        else {
            results[_hand.key] = parts[_hand.key];
        }
    }
    results.top = undefined;
    for (const [_, v] of ipairs(G.handlist)) {
        if (!results.top && results[v]) {
            results.top = results[v];
            break;
        }
    }
    return results;
};
function get_flush(hand: string | any[]): any {
    let ret = {};
    let four_fingers = next(find_joker("Four Fingers"));
    let suits = SMODS.Suit.obj_buffer;
    if (hand.length < 5 - (four_fingers && 1 || 0)) {
        return ret;
    }
    else {
        for (let j = 1; j <= suits.length; j++) {
            let t = {};
            let suit = suits[j];
            let flush_count = 0;
            for (let i = 1; i <= hand.length; i++) {
                if (hand[i].is_suit(suit, undefined, true)) {
                    flush_count = flush_count + 1;
                    t[t.length + 1] = hand[i];
                }
            }
            if (flush_count >= 5 - (four_fingers && 1 || 0)) {
                table.insert(ret, t);
                return ret;
            }
        }
        return {};
    }
};
function get_straight(hand: string | any[]): any {
    let ret = {};
    let four_fingers = next(find_joker("Four Fingers"));
    if (hand.length > 5 || hand.length < 5 - (four_fingers && 1 || 0)) {
        return ret;
    }
    else {
        let t = {};
        let IDS = {};
        for (let i = 1; i <= hand.length; i++) {
            let id = hand[i].get_id();
            if (id > 1 && id < 15) {
                if (IDS[id]) {
                    IDS[id][IDS[id].length + 1] = hand[i];
                }
                else {
                    IDS[id] = [hand[i]];
                }
            }
        }
        let straight_length = 0;
        let straight = false;
        let can_skip = next(find_joker("Shortcut"));
        let skipped_rank = false;
        for (let j = 1; j <= 14; j++) {
            if (IDS[j === 1 && 14 || j]) {
                straight_length = straight_length + 1;
                skipped_rank = false;
                for (const [k, v] of ipairs(IDS[j === 1 && 14 || j])) {
                    t[t.length + 1] = v;
                }
            }
            if (can_skip && !skipped_rank && j !== 14) {
                skipped_rank = true;
            }
            else {
                straight_length = 0;
                skipped_rank = false;
                if (!straight) {
                    t = {};
                }
                if (straight) {
                    break;
                }
            }
            if (straight_length >= 5 - (four_fingers && 1 || 0)) {
                straight = true;
            }
        }
        if (!straight) {
            return ret;
        }
        table.insert(ret, t);
        return ret;
    }
};
function get_X_same(num: number, hand: string | any[], or_more: undefined): any {
    let vals = {};
    for (let i = 1; i <= SMODS.Rank.max_id.value; i++) {
        vals[i] = {};
    }
    for (let i = hand.length; i >= 1; i += -1) {
        let curr = {};
        table.insert(curr, hand[i]);
        for (let j = 1; j <= hand.length; j++) {
            if (hand[i].get_id() === hand[j].get_id() && i !== j) {
                table.insert(curr, hand[j]);
            }
        }
        if (or_more && curr.length >= num || curr.length === num) {
            vals[curr[1].get_id()] = curr;
        }
    }
    let ret = {};
    for (let i = vals.length; i >= 1; i += -1) {
        if (next(vals[i])) {
            table.insert(ret, vals[i]);
        }
    }
    return ret;
};
function get_highest(hand: string | any[] | Record<number, unknown>): any {
    let highest = undefined;
    for (const [k, v] of ipairs(hand)) {
        if (!highest || v.get_nominal() > highest.get_nominal()) {
            highest = v;
        }
    }
    if (hand.length > 0) {
        return [[highest]];
    }
    else {
        return {};
    }
};
function reset_drawhash(): void {
    G.DRAW_HASH = EMPTY(G.DRAW_HASH);
};
function nuGC(time_budget: number | undefined, memory_ceiling: number | undefined, disable_otherwise: boolean): any {
    time_budget = time_budget || 0.0003;
    memory_ceiling = memory_ceiling || 300;
    let max_steps = 1000;
    let steps = 0;
    let start_time = love.timer.getTime();
    while (love.timer.getTime() - start_time < time_budget && steps < max_steps) {
        collectgarbage("step", 1);
        steps = steps + 1;
    }
    if (collectgarbage("count") / 1024 > memory_ceiling) {
        collectgarbage("collect");
    }
    if (disable_otherwise) {
        collectgarbage("stop");
    }
};
function add_to_drawhash(obj: this | this): any {
    if (obj) {
        G.DRAW_HASH[G.DRAW_HASH.length + 1] = obj;
    }
};
function mix_colours(C1: any[], C2: any[], proportionC1: number): any {
    return [(C1[1] || 0.5) * proportionC1 + (C2[1] || 0.5) * (1 - proportionC1), (C1[2] || 0.5) * proportionC1 + (C2[2] || 0.5) * (1 - proportionC1), (C1[3] || 0.5) * proportionC1 + (C2[3] || 0.5) * (1 - proportionC1), (C1[4] || 1) * proportionC1 + (C2[4] || 1) * (1 - proportionC1)];
};
function mod_chips(_chips: number): any {
    if (G.GAME.modifiers.chips_dollar_cap) {
        _chips = math.min(_chips, math.max(G.GAME.dollars, 0));
    }
    return _chips;
};
function mod_mult(_mult: any): any {
    return _mult;
};
function play_sound(sound_code: string, per: number | undefined, vol: number | undefined): any {
    if (G.F_MUTE) {
        return;
    }
    if (sound_code && G.SETTINGS.SOUND.volume > 0.001) {
        G.ARGS.play_sound = G.ARGS.play_sound || {};
        G.ARGS.play_sound.type = "sound";
        G.ARGS.play_sound.time = G.TIMERS.REAL;
        G.ARGS.play_sound.crt = G.SETTINGS.GRAPHICS.crt;
        G.ARGS.play_sound.sound_code = sound_code;
        G.ARGS.play_sound.per = per;
        G.ARGS.play_sound.vol = vol;
        G.ARGS.play_sound.pitch_mod = G.PITCH_MOD;
        G.ARGS.play_sound.state = G.STATE;
        G.ARGS.play_sound.music_control = G.SETTINGS.music_control;
        G.ARGS.play_sound.sound_settings = G.SETTINGS.SOUND;
        G.ARGS.play_sound.splash_vol = G.SPLASH_VOL;
        G.ARGS.play_sound.overlay_menu = !!G.OVERLAY_MENU;
        if (G.F_SOUND_THREAD) {
            G.SOUND_MANAGER.channel.push(G.ARGS.play_sound);
        }
        else {
            PLAY_SOUND(G.ARGS.play_sound);
        }
    }
};
function modulate_sound(dt: number): any {
    G.SPLASH_VOL = 2 * dt * (G.STATE === G.STATES.SPLASH && 1 || 0) + (G.SPLASH_VOL || 1) * (1 - 2 * dt);
    let desired_track = G.video_soundtrack || G.STATE === G.STATES.SPLASH && "" || SMODS.Sound.get_current_music() || G.booster_pack_sparkles && !G.booster_pack_sparkles.REMOVED && "music2" || G.booster_pack_meteors && !G.booster_pack_meteors.REMOVED && "music3" || G.booster_pack && !G.booster_pack.REMOVED && "music2" || G.shop && !G.shop.REMOVED && "music4" || G.GAME.blind && G.GAME.blind.boss && "music5" || "music1";
    G.PITCH_MOD = (G.PITCH_MOD || 1) * (1 - dt) + dt * (!G.normal_music_speed && G.STATE === G.STATES.GAME_OVER && 0.5 || 1);
    G.SETTINGS.ambient_control = G.SETTINGS.ambient_control || {};
    G.ARGS.score_intensity = G.ARGS.score_intensity || {};
    if (typeof G.GAME.current_round.current_hand.chips !== "number" || typeof G.GAME.current_round.current_hand.mult !== "number") {
        G.ARGS.score_intensity.earned_score = 0;
    }
    else {
        G.ARGS.score_intensity.earned_score = G.GAME.current_round.current_hand.chips * G.GAME.current_round.current_hand.mult;
    }
    G.ARGS.score_intensity.required_score = G.GAME.blind && G.GAME.blind.chips || 0;
    G.ARGS.score_intensity.flames = math.min(1, (G.STAGE === G.STAGES.RUN && 1 || 0) * (G.ARGS.chip_flames && G.ARGS.chip_flames.real_intensity + G.ARGS.chip_flames.change || 0) / 10);
    G.ARGS.score_intensity.organ = G.video_organ || G.ARGS.score_intensity.required_score > 0 && math.max(math.min(0.4, 0.1 * math.log(G.ARGS.score_intensity.earned_score / (G.ARGS.score_intensity.required_score + 1), 5)), 0) || 0;
    let AC = G.SETTINGS.ambient_control;
    G.ARGS.ambient_sounds = G.ARGS.ambient_sounds || { ambientFire2: { volfunc: function (_prev_volume: number) {
                return _prev_volume * (1 - dt) + dt * 0.9 * (G.ARGS.score_intensity.flames > 0.3 && 1 || G.ARGS.score_intensity.flames / 0.3);
            } }, ambientFire1: { volfunc: function (_prev_volume: number) {
                return _prev_volume * (1 - dt) + dt * 0.8 * (G.ARGS.score_intensity.flames > 0.3 && (G.ARGS.score_intensity.flames - 0.3) / 0.7 || 0);
            } }, ambientFire3: { volfunc: function (_prev_volume: number) {
                return _prev_volume * (1 - dt) + dt * 0.4 * ((G.ARGS.chip_flames && G.ARGS.chip_flames.change || 0) + (G.ARGS.mult_flames && G.ARGS.mult_flames.change || 0));
            } }, ambientOrgan1: { volfunc: function (_prev_volume: number) {
                return _prev_volume * (1 - dt) + dt * 0.6 * (G.SETTINGS.SOUND.music_volume + 100) / 200 * G.ARGS.score_intensity.organ;
            } } };
    for (const [k, v] of pairs(G.ARGS.ambient_sounds)) {
        AC[k] = AC[k] || {};
        AC[k].per = k === "ambientOrgan1" && 0.7 || k === "ambientFire1" && 1.1 || k === "ambientFire2" && 1.05 || 1;
        AC[k].vol = !G.video_organ && G.STATE === G.STATES.SPLASH && 0 || AC[k].vol && v.volfunc(AC[k].vol) || 0;
    }
    G.ARGS.push = G.ARGS.push || {};
    G.ARGS.push.type = "modulate";
    G.ARGS.push.pitch_mod = G.PITCH_MOD;
    G.ARGS.push.state = G.STATE;
    G.ARGS.push.time = G.TIMERS.REAL;
    G.ARGS.push.dt = dt;
    G.ARGS.push.desired_track = desired_track;
    G.ARGS.push.sound_settings = G.SETTINGS.SOUND;
    G.ARGS.push.splash_vol = G.SPLASH_VOL;
    G.ARGS.push.overlay_menu = !!G.OVERLAY_MENU;
    G.ARGS.push.ambient_control = G.SETTINGS.ambient_control;
    if (SMODS.remove_replace_sound && SMODS.remove_replace_sound !== desired_track) {
        SMODS.Sound.replace_sounds[SMODS.remove_replace_sound] = undefined;
        SMODS.remove_replace_sound = undefined;
    }
    let replace_sound = SMODS.Sound.replace_sounds[desired_track];
    if (replace_sound) {
        let replaced_track = desired_track;
        desired_track = replace_sound.key;
        G.ARGS.push.desired_track = desired_track;
        if (SMODS.previous_track !== desired_track) {
            if (replace_sound.times > 0) {
                replace_sound.times = replace_sound.times - 1;
            }
            if (replace_sound.times === 0) {
                SMODS.remove_replace_sound = replaced_track;
            }
        }
    }
    let stop_sound = SMODS.Sound.stop_sounds[desired_track];
    if (SMODS.Sound.stop_sounds[desired_track]) {
        if (SMODS.previous_track !== "" && stop_sound > 0) {
            stop_sound = stop_sound - 1;
        }
        SMODS.Sound.stop_sounds[desired_track] = stop_sound !== 0 && stop_sound || undefined;
        SMODS.previous_track = "";
        return;
    }
    if (G.F_SOUND_THREAD) {
        G.SOUND_MANAGER.channel.push(G.ARGS.push);
        SMODS.previous_track = SMODS.previous_track || "";
        let in_sync = (SMODS.Sounds[desired_track] || {}).sync;
        let out_sync = (SMODS.Sounds[SMODS.previous_track] || {}).sync;
        let should_sync = true;
        if (typeof in_sync === "object" && !in_sync[SMODS.previous_track] || in_sync === false) {
            should_sync = false;
        }
        if (typeof out_sync === "object" && !out_sync[desired_track] || out_sync === false) {
            should_sync = false;
        }
        if (SMODS.previous_track && SMODS.previous_track !== desired_track && !should_sync) {
            G.ARGS.push.type = "restart_music";
            G.SOUND_MANAGER.channel.push(G.ARGS.push);
        }
        SMODS.previous_track = desired_track;
    }
    else {
        MODULATE(G.ARGS.push);
    }
};
function count_of_suit(area: { cards: any; }, suit: any): any {
    let num = 0;
    for (const [_, c] of pairs(area.cards)) {
        if (c.base.suit === suit) {
            num = num + 1;
        }
    }
    return num;
};
function prep_draw(moveable: Moveable, scale: number, rotate?: number, offset?: Position2D,...args:any): void {
    love.graphics.push();
    love.graphics.scale(G.TILESCALE * G.TILESIZE);
    love.graphics.translate(moveable.VT.x + moveable.VT.w / 2 + (offset && offset.x || 0) + (moveable.layered_parallax && moveable.layered_parallax.x || moveable.parent && moveable.parent.layered_parallax && moveable.parent.layered_parallax.x || 0), moveable.VT.y + moveable.VT.h / 2 + (offset && offset.y || 0) + (moveable.layered_parallax && moveable.layered_parallax.y || moveable.parent && moveable.parent.layered_parallax && moveable.parent.layered_parallax.y || 0));
    if (moveable.VT.r !== 0 || moveable.juice || rotate) {
        love.graphics.rotate(moveable.VT.r + (rotate || 0));
    }
    love.graphics.translate(-scale * moveable.VT.w * moveable.VT.scale / 2, -scale * moveable.VT.h * moveable.VT.scale / 2);
    love.graphics.scale(moveable.VT.scale * scale);
};
function get_chosen_triangle_from_rect(x: number, y: number, w: number, h: number, vert: any): any {
    let scale = 2;
    if (vert) {
        x = x + math.min(0.6 * math.sin(G.TIMERS.REAL * 9) * scale + 0.2, 0);
        return [x - 3.5 * scale, y + h / 2 - 1.5 * scale, x - 0.5 * scale, y + h / 2 + 0, x - 3.5 * scale, y + h / 2 + 1.5 * scale];
    }
    else {
        y = y + math.min(0.6 * math.sin(G.TIMERS.REAL * 9) * scale + 0.2, 0);
        return [x + w / 2 - 1.5 * scale, y - 4 * scale, x + w / 2 + 0, y - 1.1 * scale, x + w / 2 + 1.5 * scale, y - 4 * scale];
    }
};
function point_translate(_T: { x: number; y: number; }|{x:undefined,y:undefined}, delta: { x: number; y: number; }|{x:undefined,y:undefined}): void {
    _T.x = (_T.x??NaN) + (delta.x??NaN)|| 0;
    _T.y = (_T.y??NaN) + (delta.y??NaN)|| 0;
};
function point_rotate(_T: { x: number; y: number; }|{x:undefined,y:undefined}, angle: number): any {
    let [_cos, _sin, _ox, _oy] = [math.cos(angle + math.pi / 2), math.sin(angle + math.pi / 2), _T.x, _T.y];
    _T.x = -(_oy??0) * _cos + (_ox??0) * _sin;
    _T.y = (_oy??0) * _sin + (_ox??0) * _cos;
};
function lighten(colour: any[], percent: number, no_tab: undefined): any {
    if (no_tab) {
        return [colour[1] * (1 - percent) + percent, colour[2] * (1 - percent) + percent, colour[3] * (1 - percent) + percent, colour[4]];
    }
    return [colour[1] * (1 - percent) + percent, colour[2] * (1 - percent) + percent, colour[3] * (1 - percent) + percent, colour[4]];
};
function darken(colour: any[], percent: number, no_tab: any): any {
    if (no_tab) {
        return [colour[1] * (1 - percent), colour[2] * (1 - percent), colour[3] * (1 - percent), colour[4]];
    }
    return [colour[1] * (1 - percent), colour[2] * (1 - percent), colour[3] * (1 - percent), colour[4]];
};
function adjust_alpha(colour: any[], new_alpha: number, no_tab: undefined): any {
    if (no_tab) {
        return [colour[1], colour[2], colour[3], new_alpha];
    }
    return [colour[1], colour[2], colour[3], new_alpha];
};
function alert_no_space(card: { juice_up: (arg0: number, arg1: number) => void; }, area: { cards: string | any[]; }): any {
    G.CONTROLLER.locks.no_space = true;
    attention_text({ scale: 0.9, text: localize("k_no_space_ex"), hold: 0.9, align: "cm", cover: area, cover_padding: 0.1, cover_colour: adjust_alpha(G.C.BLACK, 0.7) });
    card.juice_up(0.3, 0.2);
    for (let i = 1; i <= area.cards.length; i++) {
        area.cards[i].juice_up(0.15);
    }
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.06 * G.SETTINGS.GAMESPEED, blockable: false, blocking: false, func: function () {
            play_sound("tarot2", 0.76, 0.4);
            return true;
        } }));
    play_sound("tarot2", 1, 0.4);
    G.E_MANAGER.add_event(new GameEvent({ trigger: "after", delay: 0.5 * G.SETTINGS.GAMESPEED, blockable: false, blocking: false, func: function () {
            G.CONTROLLER.locks.no_space = undefined;
            return true;
        } }));
};
function find_joker(name: string, non_debuff: undefined): any {
    let jokers = {};
    if (!G.jokers || !G.jokers.cards) {
        return {};
    }
    for (const [k, v] of pairs(G.jokers.cards)) {
        if (v && typeof v === "object" && v.ability.name === name && (non_debuff || !v.debuff)) {
            table.insert(jokers, v);
        }
    }
    for (const [k, v] of pairs(G.consumeables.cards)) {
        if (v && typeof v === "object" && v.ability.name === name && (non_debuff || !v.debuff)) {
            table.insert(jokers, v);
        }
    }
    return jokers;
};
function get_blind_amount(ante: number): any {
    if (G.GAME.modifiers.scaling && G.GAME.modifiers.scaling > 3) {
        return SMODS.get_blind_amount(ante);
    }
    let k = 0.75;
    if (!G.GAME.modifiers.scaling || G.GAME.modifiers.scaling === 1) {
        let amounts = [300, 800, 2000, 5000, 11000, 20000, 35000, 50000];
        if (ante < 1) {
            return 100;
        }
        if (ante <= 8) {
            return amounts[ante];
        }
        let [a, b, c, d] = [amounts[8], 1.6, ante - 8, 1 + 0.2 * (ante - 8)];
        let amount = math.floor(a * (b + (k * c ^ d) ^ c));
        amount = amount - amount % (10 ^ math.floor(math.log10(amount) - 1));
        return amount;
    }
    if (G.GAME.modifiers.scaling === 2) {
        let amounts = [300, 900, 2600, 8000, 20000, 36000, 60000, 100000];
        if (ante < 1) {
            return 100;
        }
        if (ante <= 8) {
            return amounts[ante];
        }
        let [a, b, c, d] = [amounts[8], 1.6, ante - 8, 1 + 0.2 * (ante - 8)];
        let amount = math.floor(a * (b + (k * c ^ d) ^ c));
        amount = amount - amount % (10 ^ math.floor(math.log10(amount) - 1));
        return amount;
    }
    if (G.GAME.modifiers.scaling === 3) {
        let amounts = [300, 1000, 3200, 9000, 25000, 60000, 110000, 200000];
        if (ante < 1) {
            return 100;
        }
        if (ante <= 8) {
            return amounts[ante];
        }
        let [a, b, c, d] = [amounts[8], 1.6, ante - 8, 1 + 0.2 * (ante - 8)];
        let amount = math.floor(a * (b + (k * c ^ d) ^ c));
        amount = amount - amount % (10 ^ math.floor(math.log10(amount) - 1));
        return amount;
    }
};
function number_format(num: number, e_switch_point: any): any {
    if (typeof num !== "number") {
        return num;
    }
    let sign = num >= 0 && "" || "-";
    num = math.abs(num);
    G.E_SWITCH_POINT = G.E_SWITCH_POINT || 100000000000;
    if (!num || typeof num !== "number") {
        return num || "";
    }
    if (num >= (e_switch_point || G.E_SWITCH_POINT)) {
        let x = string.format("%.4g", num);
        let fac = math.floor(math.log(tonumber(x), 10));
        if (num === math.huge) {
            return sign + "naneinf";
        }
        let mantissa = round_number(x / (10 ^ fac), 3);
        if (mantissa >= 10) {
            mantissa = mantissa / 10;
            fac = fac + 1;
        }
        return sign + string.format(fac >= 100 && "%.1fe%i" || fac >= 10 && "%.2fe%i" || "%.3fe%i", mantissa, fac);
    }
    let formatted;
    if (num !== math.floor(num) && num < 100) {
        formatted = string.format(num >= 10 && "%.1f" || "%.2f", num);
        if (formatted.sub(-1) === "0") {
            formatted = formatted.gsub("%.?0+$", "");
        }
        if (num < 0.01) {
            return String(num);
        }
    }
    else {
        formatted = string.format("%.0f", num);
    }
    return sign + formatted.reverse().gsub("(%d%d%d)", "%1,").gsub(",$", "").reverse();
};
function score_number_scale(scale: any, amt: number): any {
    G.E_SWITCH_POINT = G.E_SWITCH_POINT || 100000000000;
    if (typeof amt !== "number") {
        return 0.7 * (scale || 1);
    }
    if (amt >= G.E_SWITCH_POINT) {
        return 0.7 * (scale || 1);
    }
    if (amt >= 1000000) {
        return 14 * 0.75 / (math.floor(math.log(amt)) + 4) * (scale || 1);
    }
    return 0.75 * (scale || 1);
};
function copy_table<T>(O:T): T {
    let copy;
    if (typeof O === "object") {
        copy = {};
        for (const [k, v] of next(O as object)) {
            copy[copy_table(k)] = copy_table(v);
        }
        setmetatable(copy, copy_table(getmetatable(O)));
    }
    else {
        copy = O;
    }
    return copy;
};
function send_score(_score: number): any {
    if (G.F_HTTP_SCORES && G.SETTINGS.COMP && G.F_STREAMER_EVENT) {
        G.HTTP_MANAGER.out_channel.push({ set_score: true, score: _score, username: G.SETTINGS.COMP.name, uid: String(G.STEAM.user.getSteamID()), version: G.VERSION });
    }
};
function send_name(): void {
    if (G.F_HTTP_SCORES && G.SETTINGS.COMP && G.F_STREAMER_EVENT) {
        G.HTTP_MANAGER.out_channel.push({ set_name: true, username: G.SETTINGS.COMP.name, uid: String(G.STEAM.user.getSteamID()), version: G.VERSION });
    }
};
function check_and_set_high_score(score: string, amt: number): any {
    if (!amt || typeof amt !== "number") {
        return;
    }
    if (G.GAME.round_scores[score] && math.floor(amt) > G.GAME.round_scores[score].amt) {
        G.GAME.round_scores[score].amt = math.floor(amt);
    }
    if (G.GAME.seeded) {
        return;
    }
    if (score === "hand" && G.SETTINGS.COMP && (!G.SETTINGS.COMP.score || G.SETTINGS.COMP.score < math.floor(amt))) {
        G.SETTINGS.COMP.score = amt;
        send_score(math.floor(amt));
    }
    if (G.PROFILES[G.SETTINGS.profile??""].high_scores[score] && math.floor(amt) > G.PROFILES[G.SETTINGS.profile??""].high_scores[score].amt) {
        if (G.GAME.round_scores[score]) {
            G.GAME.round_scores[score].high_score = true;
        }
        G.PROFILES[G.SETTINGS.profile??""].high_scores[score].amt = math.floor(amt);
        G.save_settings();
    }
};
function set_joker_usage (): void {
    for (const [k, v] of pairs(G.jokers.cards)) {
        if (v.config.center_key && v.ability.set === "Joker") {
            if (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key]) {
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].count = G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].count + 1;
            }
            else {
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key] = { count: 1, order: v.config.center.order, wins: {}, losses: {}, wins_by_key: {}, losses_by_key: {} };
            }
        }
    }
    G.save_settings();
};
function set_joker_win (): void {
    for (const [k, v] of pairs(G.jokers.cards)) {
        if (v.config.center_key && v.ability.set === "Joker") {
            G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key] = G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key] || { count: 1, order: v.config.center.order, wins: {}, losses: {}, wins_by_key: {}, losses_by_key: {} };
            if (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key]) {
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].wins = G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].wins || {};
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].wins[G.GAME.stake] = (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].wins[G.GAME.stake] || 0) + 1;
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].wins_by_key[SMODS.stake_from_index(G.GAME.stake)] = (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].wins_by_key[SMODS.stake_from_index(G.GAME.stake)] || 0) + 1;
            }
        }
    }
    G.save_settings();
};
function get_joker_win_sticker(_center: JokerCardParams | CardUtilityParams, index: boolean): any {
    if (G.PROFILES[G.SETTINGS.profile??""].joker_usage[_center.key] && G.PROFILES[G.SETTINGS.profile??""].joker_usage[_center.key].wins) {
        let _w = 0;
        for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile??""].joker_usage[_center.key].wins)) {
            _w = math.max(k, _w);
        }
        if (index) {
            return _w;
        }
        if (_w > 0) {
            return G.sticker_map[_w];
        }
    }
    if (index) {
        return 0;
    }
};
function set_joker_loss (): void {
    for (const [k, v] of pairs(G.jokers.cards)) {
        if (v.config.center_key && v.ability.set === "Joker") {
            if (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key]) {
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].losses = G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].losses || {};
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].losses[G.GAME.stake] = (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].losses[G.GAME.stake] || 0) + 1;
                G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].losses_by_key[SMODS.stake_from_index(G.GAME.stake)] = (G.PROFILES[G.SETTINGS.profile??""].joker_usage[v.config.center_key].losses_by_key[SMODS.stake_from_index(G.GAME.stake)] || 0) + 1;
            }
        }
    }
    G.save_settings();
};
function set_deck_usage(): void {
    if (G.GAME.selected_back && G.GAME.selected_back.effect && G.GAME.selected_back.effect.center && G.GAME.selected_back.effect.center.key) {
        let deck_key = G.GAME.selected_back.effect.center.key;
        if (G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key]) {
            G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].count = G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].count + 1;
        }
        else {
            G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key] = { count: 1, order: G.GAME.selected_back.effect.center.order, wins: {}, losses: {}, wins_by_key: {}, losses_by_key: {} };
        }
        G.save_settings();
    }
};
function set_deck_win(): void {
    if (G.GAME.selected_back && G.GAME.selected_back.effect && G.GAME.selected_back.effect.center && G.GAME.selected_back.effect.center.key) {
        let deck_key = G.GAME.selected_back.effect.center.key;
        if (!G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key]) {
            G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key] = { count: 1, order: G.GAME.selected_back.effect.center.order, wins: {}, losses: {}, wins_by_key: {}, losses_by_key: {} };
        }
        if (G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key]) {
            G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].wins[G.GAME.stake] = (G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].wins[G.GAME.stake] || 0) + 1;
            for (let i = 1; i <= (G.P_CENTER_POOLS["Stake"][G.GAME.stake].unlocked_stake && G.P_STAKES[G.P_CENTER_POOLS["Stake"][G.GAME.stake].unlocked_stake].stake_level - 1 || G.GAME.stake - 1); i++) {
                G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].wins[i] = G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].wins[i] || 1;
            }
        }
        set_challenge_unlock();
        G.save_settings();
    }
};
function set_challenge_unlock(): void {
    if (G.PROFILES[G.SETTINGS.profile??""].all_unlocked) {
        return;
    }
    if (G.PROFILES[G.SETTINGS.profile??""].challenges_unlocked) {
        let [_ch_comp, _ch_tot] = [0, G.CHALLENGES.length];
        for (const [k, v] of ipairs(G.CHALLENGES)) {
            if (v.id && G.PROFILES[G.SETTINGS.profile??""].challenge_progress.completed[v.id || ""]) {
                _ch_comp = _ch_comp + 1;
            }
        }
        G.PROFILES[G.SETTINGS.profile??""].challenges_unlocked = math.min(_ch_tot, _ch_comp + 5);
    }
    else {
        let deck_wins = 0;
        for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile??""].deck_usage)) {
            if (v.wins && v.wins[1]) {
                deck_wins = deck_wins + 1;
            }
        }
        if (deck_wins >= G.CHALLENGE_WINS && !G.PROFILES[G.SETTINGS.profile??""].challenges_unlocked) {
            G.PROFILES[G.SETTINGS.profile??""].challenges_unlocked = 5;
            notify_alert("b_challenge", "Back");
        }
    }
};
function get_deck_win_stake(_deck_key: string | number | undefined): any {
    if (!_deck_key) {
        let [_w, _w_low] = [0, undefined];
        let deck_count = 0;
        for (const [_, deck] of pairs(G.PROFILES[G.SETTINGS.profile??""].deck_usage)) {
            let deck_won_with = undefined;
            for (const [k, v] of pairs(deck.wins)) {
                deck_won_with = true;
                _w = math.max(k, _w);
            }
            if (deck_won_with) {
                deck_count = deck_count + 1;
            }
            _w_low = _w_low && math.min(_w_low, _w) || _w;
        }
        return [_w, deck_count >= G.P_CENTER_POOLS.Back.length && _w_low || 0];
    }
    if (G.PROFILES[G.SETTINGS.profile??""].deck_usage[_deck_key] && G.PROFILES[G.SETTINGS.profile??""].deck_usage[_deck_key].wins) {
        let _w = 0;
        for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile??""].deck_usage[_deck_key].wins)) {
            _w = math.max(k, _w);
        }
        return _w;
    }
    return 0;
};
function get_deck_win_sticker(_center: { key: string | number; }): any {
    if (G.PROFILES[G.SETTINGS.profile??""].deck_usage[_center.key] && G.PROFILES[G.SETTINGS.profile??""].deck_usage[_center.key].wins) {
        let _w = -1;
        for (const [k, v] of pairs(G.PROFILES[G.SETTINGS.profile??""].deck_usage[_center.key].wins)) {
            _w = math.max(k, _w);
        }
        if (_w > 0) {
            return G.sticker_map[_w];
        }
    }
};
function set_deck_loss(): void {
    if (G.GAME.selected_back && G.GAME.selected_back.effect && G.GAME.selected_back.effect.center && G.GAME.selected_back.effect.center.key) {
        let deck_key = G.GAME.selected_back.effect.center.key;
        if (!G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key]) {
            G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key] = { count: 1, order: G.GAME.selected_back.effect.center.order, wins: {}, losses: {}, wins_by_key: {}, losses_by_key: {} };
        }
        if (G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key]) {
            G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].losses[G.GAME.stake] = (G.PROFILES[G.SETTINGS.profile??""].deck_usage[deck_key].losses[G.GAME.stake] || 0) + 1;
        }
        G.save_settings();
    }
};
function set_consumeable_usage(card: { config: { center_key: string | number; center: { order: any; set: string; discovered: any; }; }; ability: { consumeable: any; set: any; }; }): any {
    if (card.config.center_key && card.ability.consumeable) {
        if (G.PROFILES[G.SETTINGS.profile??""].consumeable_usage[card.config.center_key]) {
            G.PROFILES[G.SETTINGS.profile??""].consumeable_usage[card.config.center_key].count = G.PROFILES[G.SETTINGS.profile??""].consumeable_usage[card.config.center_key].count + 1;
        }
        else {
            G.PROFILES[G.SETTINGS.profile??""].consumeable_usage[card.config.center_key] = { count: 1, order: card.config.center.order };
        }
        if (G.GAME.consumeable_usage[card.config.center_key]) {
            G.GAME.consumeable_usage[card.config.center_key].count = G.GAME.consumeable_usage[card.config.center_key].count + 1;
        }
        else {
            G.GAME.consumeable_usage[card.config.center_key] = { count: 1, order: card.config.center.order, set: card.ability.set };
        }
        G.GAME.consumeable_usage_total = G.GAME.consumeable_usage_total || { tarot: 0, planet: 0, spectral: 0, tarot_planet: 0, all: 0 };
        if (card.config.center.set === "Tarot") {
            G.GAME.consumeable_usage_total.tarot = G.GAME.consumeable_usage_total.tarot + 1;
            G.GAME.consumeable_usage_total.tarot_planet = G.GAME.consumeable_usage_total.tarot_planet + 1;
        }
        if (card.config.center.set === "Planet") {
            G.GAME.consumeable_usage_total.planet = G.GAME.consumeable_usage_total.planet + 1;
            G.GAME.consumeable_usage_total.tarot_planet = G.GAME.consumeable_usage_total.tarot_planet + 1;
        }
        if (card.config.center.set === "Spectral") {
            G.GAME.consumeable_usage_total.spectral = G.GAME.consumeable_usage_total.spectral + 1;
        }
        G.GAME.consumeable_usage_total.all = G.GAME.consumeable_usage_total.all + 1;
        if (!card.config.center.discovered) {
            discover_card(card);
        }
        if (card.config.center.set === "Tarot" || card.config.center.set === "Planet") {
            G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                    G.E_MANAGER.add_event(new GameEvent({ trigger: "immediate", func: function () {
                            G.GAME.last_tarot_planet = card.config.center_key;
                            return true;
                        } }));
                    return true;
                } }));
        }
    }
    G.save_settings();
};
function set_voucher_usage(card: { config: { center_key: string | number; center: { order: any; }; }; ability: { set: string; }; }): any {
    if (card.config.center_key && card.ability.set === "Voucher") {
        if (G.PROFILES[G.SETTINGS.profile??""].voucher_usage[card.config.center_key]) {
            G.PROFILES[G.SETTINGS.profile??""].voucher_usage[card.config.center_key].count = G.PROFILES[G.SETTINGS.profile??""].voucher_usage[card.config.center_key].count + 1;
        }
        else {
            G.PROFILES[G.SETTINGS.profile??""].voucher_usage[card.config.center_key] = { count: 1, order: card.config.center.order };
        }
    }
    G.save_settings();
};
function set_hand_usage(hand: string | number): any {
    let hand_label = hand;
    hand = hand.gsub("%s+", "");
    if (G.PROFILES[G.SETTINGS.profile??""].hand_usage[hand]) {
        G.PROFILES[G.SETTINGS.profile??""].hand_usage[hand].count = G.PROFILES[G.SETTINGS.profile??""].hand_usage[hand].count + 1;
    }
    else {
        G.PROFILES[G.SETTINGS.profile??""].hand_usage[hand] = { count: 1, order: hand_label };
    }
    if (G.GAME.hand_usage[hand]) {
        G.GAME.hand_usage[hand].count = G.GAME.hand_usage[hand].count + 1;
    }
    else {
        G.GAME.hand_usage[hand] = { count: 1, order: hand_label };
    }
    G.save_settings();
};
function set_profile_progress(): void {
    G.PROGRESS = G.PROGRESS || { joker_stickers: { tally: 0, of: 0 }, deck_stakes: { tally: 0, of: 0 }, challenges: { tally: 0, of: 0 } };
    for (const [_, v] of pairs(G.PROGRESS)) {
        if (typeof v === "object") {
            v.tally = 0;
            v.of = 0;
        }
    }
    for (const [_, v] of pairs(G.P_CENTERS)) {
        if (v.set === "Back" && !v.omit) {
            G.PROGRESS.deck_stakes.of = G.PROGRESS.deck_stakes.of + G.P_CENTER_POOLS.Stake.length;
            G.PROGRESS.deck_stakes.tally = G.PROGRESS.deck_stakes.tally + get_deck_win_stake(v.key);
        }
        if (v.set === "Joker") {
            G.PROGRESS.joker_stickers.of = G.PROGRESS.joker_stickers.of + G.P_CENTER_POOLS.Stake.length;
            G.PROGRESS.joker_stickers.tally = G.PROGRESS.joker_stickers.tally + get_joker_win_sticker(v, true);
        }
    }
    for (const [_, v] of pairs(G.CHALLENGES)) {
        G.PROGRESS.challenges.of = G.PROGRESS.challenges.of + 1;
        if (G.PROFILES[G.SETTINGS.profile??""].challenge_progress.completed[v.id]) {
            G.PROGRESS.challenges.tally = G.PROGRESS.challenges.tally + 1;
        }
    }
    G.PROFILES[G.SETTINGS.profile??""].progress.joker_stickers = copy_table(G.PROGRESS.joker_stickers);
    G.PROFILES[G.SETTINGS.profile??""].progress.deck_stakes = copy_table(G.PROGRESS.deck_stakes);
    G.PROFILES[G.SETTINGS.profile??""].progress.challenges = copy_table(G.PROGRESS.challenges);
};
function set_discover_tallies(): void {
    G.DISCOVER_TALLIES = G.DISCOVER_TALLIES || { blinds: { tally: 0, of: 0 }, tags: { tally: 0, of: 0 }, jokers: { tally: 0, of: 0 }, consumeables: { tally: 0, of: 0 }, vouchers: { tally: 0, of: 0 }, boosters: { tally: 0, of: 0 }, editions: { tally: 0, of: 0 }, backs: { tally: 0, of: 0 }, total: { tally: 0, of: 0 } };
    for (const [_, v] of ipairs(SMODS.ConsumableType.ctype_buffer)) {
        G.DISCOVER_TALLIES[v.lower() + "s"] = { tally: 0, of: 0 };
    }
    for (const [_, v] of pairs(G.DISCOVER_TALLIES)) {
        v.tally = 0;
        v.of = 0;
    }
    for (const [_, v] of pairs(G.P_CENTERS)) {
        if (!v.omit && !v.no_collection) {
            if (v.set && (v.set === "Joker" || v.consumeable || v.set === "Edition" || v.set === "Voucher" || v.set === "Back" || v.set === "Booster")) {
                G.DISCOVER_TALLIES.total.of = G.DISCOVER_TALLIES.total.of + 1;
                if (v.discovered) {
                    G.DISCOVER_TALLIES.total.tally = G.DISCOVER_TALLIES.total.tally + 1;
                }
            }
            if (v.set && v.set === "Joker") {
                G.DISCOVER_TALLIES.jokers.of = G.DISCOVER_TALLIES.jokers.of + 1;
                if (v.discovered) {
                    G.DISCOVER_TALLIES.jokers.tally = G.DISCOVER_TALLIES.jokers.tally + 1;
                }
            }
            if (v.set && v.set === "Back") {
                G.DISCOVER_TALLIES.backs.of = G.DISCOVER_TALLIES.backs.of + 1;
                if (v.unlocked) {
                    G.DISCOVER_TALLIES.backs.tally = G.DISCOVER_TALLIES.backs.tally + 1;
                }
            }
            if (v.set && v.consumeable) {
                G.DISCOVER_TALLIES.consumeables.of = G.DISCOVER_TALLIES.consumeables.of + 1;
                if (v.discovered) {
                    G.DISCOVER_TALLIES.consumeables.tally = G.DISCOVER_TALLIES.consumeables.tally + 1;
                }
                let tally = G.DISCOVER_TALLIES[v.set.lower() + "s"];
                if (tally) {
                    tally.of = tally.of + 1;
                    if (v.discovered) {
                        tally.tally = tally.tally + 1;
                    }
                }
            }
            if (v.set && v.set === "Voucher") {
                G.DISCOVER_TALLIES.vouchers.of = G.DISCOVER_TALLIES.vouchers.of + 1;
                if (v.discovered) {
                    G.DISCOVER_TALLIES.vouchers.tally = G.DISCOVER_TALLIES.vouchers.tally + 1;
                }
            }
            if (v.set && v.set === "Booster") {
                G.DISCOVER_TALLIES.boosters.of = G.DISCOVER_TALLIES.boosters.of + 1;
                if (v.discovered) {
                    G.DISCOVER_TALLIES.boosters.tally = G.DISCOVER_TALLIES.boosters.tally + 1;
                }
            }
            if (v.set && v.set === "Edition") {
                G.DISCOVER_TALLIES.editions.of = G.DISCOVER_TALLIES.editions.of + 1;
                if (v.discovered) {
                    G.DISCOVER_TALLIES.editions.tally = G.DISCOVER_TALLIES.editions.tally + 1;
                }
            }
        }
    }
    for (const [_, v] of pairs(G.P_BLINDS)) {
        if (!v.no_collection) {
            G.DISCOVER_TALLIES.total.of = G.DISCOVER_TALLIES.total.of + 1;
            G.DISCOVER_TALLIES.blinds.of = G.DISCOVER_TALLIES.blinds.of + 1;
            if (v.discovered) {
                G.DISCOVER_TALLIES.blinds.tally = G.DISCOVER_TALLIES.blinds.tally + 1;
                G.DISCOVER_TALLIES.total.tally = G.DISCOVER_TALLIES.total.tally + 1;
            }
        }
    }
    for (const [_, v] of pairs(G.P_TAGS)) {
        if (!v.no_collection) {
            G.DISCOVER_TALLIES.total.of = G.DISCOVER_TALLIES.total.of + 1;
            G.DISCOVER_TALLIES.tags.of = G.DISCOVER_TALLIES.tags.of + 1;
            if (v.discovered) {
                G.DISCOVER_TALLIES.tags.tally = G.DISCOVER_TALLIES.tags.tally + 1;
                G.DISCOVER_TALLIES.total.tally = G.DISCOVER_TALLIES.total.tally + 1;
            }
        }
    }
    G.PROFILES[G.SETTINGS.profile??""].high_scores.collection.amt = G.DISCOVER_TALLIES.total.tally;
    G.PROFILES[G.SETTINGS.profile??""].high_scores.collection.tot = G.DISCOVER_TALLIES.total.of;
    G.PROFILES[G.SETTINGS.profile??""].progress.discovered = copy_table(G.DISCOVER_TALLIES.total);
    if (check_for_unlock) {
        check_for_unlock({ type: "discover_amount", amount: G.DISCOVER_TALLIES.total.tally, planet_count: G.DISCOVER_TALLIES.planets.tally, tarot_count: G.DISCOVER_TALLIES.tarots.tally });
    }
};
function stop_use(): void {
    G.GAME.STOP_USE = (G.GAME.STOP_USE || 0) + 1;
    dec_stop_use(6);
};
function dec_stop_use(_depth: number): any {
    if (_depth > 0) {
        G.E_MANAGER.add_event(new GameEvent({ blocking: false, no_delete: true, func: function () {
                dec_stop_use(_depth - 1);
                return true;
            } }));
    }
    else {
        G.E_MANAGER.add_event(new GameEvent({ blocking: false, no_delete: true, func: function () {
                G.GAME.STOP_USE = math.max(G.GAME.STOP_USE - 1, 0);
                return true;
            } }));
    }
};
function inc_career_stat(stat: string, mod: number): any {
    if (G.GAME.seeded || G.GAME.challenge) {
        return;
    }
    if (!G.PROFILES[G.SETTINGS.profile??""].career_stats[stat]) {
        G.PROFILES[G.SETTINGS.profile??""].career_stats[stat] = 0;
    }
    G.PROFILES[G.SETTINGS.profile??""].career_stats[stat] = G.PROFILES[G.SETTINGS.profile??""].career_stats[stat] + (mod || 0);
    G.save_settings();
};
function recursive_table_cull(t: { cardAreas: {}; tags: {}; GAME: any; STATE: number; ACTION: any; BLIND: any; BACK: any; VERSION: string; }): any {
    let ret_t = {};
    for (const [k, v] of pairs(t)) {
        if (typeof v === "object") {
            if (v.is && v.is(Object)) {
                ret_t[k] = "[\"]" + "MANUAL_REPLACE" + "[\"]";
            }
            else {
                ret_t[k] = recursive_table_cull(v);
            }
        }
        else {
            ret_t[k] = v;
        }
    }
    return ret_t;
};
function save_with_action(action: any): any {
    G.action = action;
    save_run();
    G.action = undefined;
};
function save_run(): void {
    if (G.F_NO_SAVING === true) {
        return;
    }
    let cardAreas = {};
    for (const [k, v] of pairs(G)) {
        if (typeof v === "object" && v.is && v.is(CardArea)) {
            let cardAreaSer = v.save();
            if (cardAreaSer) {
                cardAreas[k] = cardAreaSer;
            }
        }
    }
    let tags = {};
    for (const [k, v] of ipairs(G.GAME.tags)) {
        if (typeof v === "object" && v.is && v.is(Tag)) {
            let tagSer = v.save();
            if (tagSer) {
                tags[k] = tagSer;
            }
        }
    }
    G.culled_table = recursive_table_cull({ cardAreas: cardAreas, tags: tags, GAME: G.GAME, STATE: G.STATE, ACTION: G.action || undefined, BLIND: G.GAME.blind.save(), BACK: G.GAME.selected_back.save(), VERSION: G.VERSION });
    G.ARGS.save_run = G.culled_table;
    G.FILE_HANDLER = G.FILE_HANDLER || {};
    G.FILE_HANDLER.run = true;
    G.FILE_HANDLER.update_queued = true;
};
function remove_save(): void {
    love.filesystem.remove(G.SETTINGS.profile + "/save.jkr");
    G.SAVED_GAME = undefined;
    G.FILE_HANDLER.run = undefined;
};
function loc_colour(_c: string | number, _default: undefined): any {
    G.ARGS.LOC_COLOURS = G.ARGS.LOC_COLOURS || { red: G.C.RED, mult: G.C.MULT, blue: G.C.BLUE, chips: G.C.CHIPS, green: G.C.GREEN, money: G.C.MONEY, gold: G.C.GOLD, attention: G.C.FILTER, purple: G.C.PURPLE, white: G.C.WHITE, inactive: G.C.UI.TEXT_INACTIVE, spades: G.C.SUITS.Spades, hearts: G.C.SUITS.Hearts, clubs: G.C.SUITS.Clubs, diamonds: G.C.SUITS.Diamonds, tarot: G.C.SECONDARY_SET.Tarot, planet: G.C.SECONDARY_SET.Planet, spectral: G.C.SECONDARY_SET.Spectral, edition: G.C.EDITION, dark_edition: G.C.DARK_EDITION, legendary: G.C.RARITY[4], enhanced: G.C.SECONDARY_SET.Enhanced };
    for (const [_, v] of ipairs(SMODS.Rarity.obj_buffer)) {
        G.ARGS.LOC_COLOURS[v.lower()] = G.C.RARITY[v];
    }
    for (const [_, v] of ipairs(SMODS.ConsumableType.ctype_buffer)) {
        G.ARGS.LOC_COLOURS[v.lower()] = G.C.SECONDARY_SET[v];
    }
    for (const [_, v] of ipairs(SMODS.Suit.obj_buffer)) {
        G.ARGS.LOC_COLOURS[v.lower()] = G.C.SUITS[v];
    }
    return G.ARGS.LOC_COLOURS[_c] || _default || G.C.UI.TEXT_DARK;
};
function init_localization(): void {
    G.localization.misc.v_dictionary_parsed = {};
    for (const [k, v] of pairs(G.localization.misc.v_dictionary)) {
        if (typeof v === "object") {
            G.localization.misc.v_dictionary_parsed[k] = { multi_line: true };
            for (const [kk, vv] of ipairs(v)) {
                G.localization.misc.v_dictionary_parsed[k][kk] = loc_parse_string(vv);
            }
        }
        else {
            G.localization.misc.v_dictionary_parsed[k] = loc_parse_string(v);
        }
    }
    G.localization.misc.v_text_parsed = {};
    for (const [k, v] of pairs(G.localization.misc.v_text)) {
        G.localization.misc.v_text_parsed[k] = {};
        for (const [kk, vv] of ipairs(v)) {
            G.localization.misc.v_text_parsed[k][kk] = loc_parse_string(vv);
        }
    }
    G.localization.tutorial_parsed = {};
    for (const [k, v] of pairs(G.localization.misc.tutorial)) {
        G.localization.tutorial_parsed[k] = { multi_line: true };
        for (const [kk, vv] of ipairs(v)) {
            G.localization.tutorial_parsed[k][kk] = loc_parse_string(vv);
        }
    }
    G.localization.quips_parsed = {};
    for (const [k, v] of pairs(G.localization.misc.quips || {})) {
        G.localization.quips_parsed[k] = { multi_line: true };
        for (const [kk, vv] of ipairs(v)) {
            G.localization.quips_parsed[k][kk] = loc_parse_string(vv);
        }
    }
    for (const [g_k, group] of pairs(G.localization)) {
        if (g_k === "descriptions") {
            for (const [_, set] of pairs(group)) {
                for (const [_, center] of pairs(set)) {
                    center.text_parsed = {};
                    if (!center.text) { }
                    else {
                        for (const [_, line] of ipairs(center.text)) {
                            center.text_parsed[center.text_parsed.length + 1] = loc_parse_string(line);
                        }
                        center.name_parsed = {};
                        for (const [_, line] of ipairs(typeof center.name === "object" && center.name || [center.name])) {
                            center.name_parsed[center.name_parsed.length + 1] = loc_parse_string(line);
                        }
                        if (center.unlock) {
                            center.unlock_parsed = {};
                            for (const [_, line] of ipairs(center.unlock)) {
                                center.unlock_parsed[center.unlock_parsed.length + 1] = loc_parse_string(line);
                            }
                        }
                    }
                }
            }
        }
    }
};
function playing_card_joker_effects(cards: any): any {
    for (let i = 1; i <= G.jokers.cards.length; i++) {
        G.jokers.cards[i].calculate_joker({ playing_card_added: true, cards: cards });
    }
};
function convert_save_to_meta(): void {
    if (love.filesystem.getInfo(G.SETTINGS.profile + ("/" + "unlocked_jokers.jkr"))) {
        let _meta = { unlocked: {}, alerted: {}, discovered: {} };
        if (love.filesystem.getInfo(G.SETTINGS.profile + ("/" + "unlocked_jokers.jkr"))) {
            for (const [line] of String.prototype.matchAll((get_compressed(G.SETTINGS.profile + ("/" + "unlocked_jokers.jkr")) || "") + "\\n", "([^\\n]*)\\n")) {
                let key = line.gsub("%s+", "");
                if (key && key !== "") {
                    _meta.unlocked[key] = true;
                }
            }
        }
        if (love.filesystem.getInfo(G.SETTINGS.profile + ("/" + "discovered_jokers.jkr"))) {
            for (const [line] of String.prototype.matchAll((get_compressed(G.SETTINGS.profile + ("/" + "discovered_jokers.jkr")) || "") + "\\n", "([^\\n]*)\\n")) {
                let key = line.gsub("%s+", "");
                if (key && key !== "") {
                    _meta.discovered[key] = true;
                }
            }
        }
        if (love.filesystem.getInfo(G.SETTINGS.profile + ("/" + "alerted_jokers.jkr"))) {
            for (const [line] of String.prototype.matchAll((get_compressed(G.SETTINGS.profile + ("/" + "alerted_jokers.jkr")) || "") + "\\n", "([^\\n]*)\\n")) {
                let key = line.gsub("%s+", "");
                if (key && key !== "") {
                    _meta.alerted[key] = true;
                }
            }
        }
        love.filesystem.remove(G.SETTINGS.profile + ("/" + "unlocked_jokers.jkr"));
        love.filesystem.remove(G.SETTINGS.profile + ("/" + "discovered_jokers.jkr"));
        love.filesystem.remove(G.SETTINGS.profile + ("/" + "alerted_jokers.jkr"));
        compress_and_save(G.SETTINGS.profile + ("/" + "meta.jkr"), STR_PACK(_meta));
    }
};
function card_from_control(control: { s: string; r: string; e: any; d: any; g: any; }): any {
    G.playing_card = G.playing_card && G.playing_card + 1 || 1;
    let _card = Card(G.deck.T.x, G.deck.T.y, G.CARD_W, G.CARD_H, G.P_CARDS[control.s + ("_" + control.r)], G.P_CENTERS[control.e || "c_base"], { playing_card: G.playing_card });
    if (control.d) {
        _card.set_edition({ [control.d]: true }, true, true);
    }
    if (control.g) {
        _card.set_seal(control.g, true, true);
    }
    G.deck.emplace(_card);
    table.insert(G.playing_cards, _card);
};
function loc_parse_string(line: string): any {
    let parsed_line = {};
    let control = {};
    let [_c, _c_name, _c_val, _c_gather] = [undefined, undefined, undefined, undefined];
    let [_s_gather, _s_ref] = [undefined, undefined];
    let [str_parts, str_it] = [{}, 1];
    for (let i = 1; i <= line.length; i++) {
        let char = line.sub(i, i);
        if (char === "{") {
            if (str_parts[1]) {
                parsed_line[parsed_line.length + 1] = { strings: str_parts, control: control || {} };
            }
            [str_parts, str_it] = [{}, 1];
            [control, _c, _c_name, _c_val, _c_gather] = [{}, undefined, undefined, undefined, undefined];
            [_s_gather, _s_ref] = [undefined, undefined];
            _c = true;
        }
        if (_c && !(char === ":" || char === "}") && !_c_gather) {
            _c_name = (_c_name || "") + char;
        }
        if (_c && char === ":") {
            _c_gather = true;
        }
        if (_c && !(char === "," || char === "}") && _c_gather) {
            _c_val = (_c_val || "") + char;
        }
        if (_c && (char === "," || char === "}")) {
            _c_gather = undefined;
            if (_c_name) {
                control[_c_name] = _c_val;
            }
            _c_name = undefined;
            _c_val = undefined;
            if (char === "}") {
                _c = undefined;
            }
        }
        if (!_c && char !== "#" && !_s_gather) {
            str_parts[str_it] = (str_parts[str_it] || "") + (control["X"] && char.gsub("%s+", "") || char);
        }
        if (!_c && char === "#" && !_s_gather) {
            _s_gather = true;
            if (str_parts[str_it]) {
                str_it = str_it + 1;
            }
        }
        if (!_c && char === "#" && _s_gather) {
            _s_gather = undefined;
            if (_s_ref) {
                str_parts[str_it] = [_s_ref];
                str_it = str_it + 1;
                _s_ref = undefined;
            }
        }
        if (!_c && _s_gather) {
            _s_ref = (_s_ref || "") + char;
        }
        if (i === line.length) {
            if (str_parts[1]) {
                parsed_line[parsed_line.length + 1] = { strings: str_parts, control: control || {} };
            }
            return parsed_line;
        }
    }
};
utf8 = { pattern: "[%z\\1-\\127\\194-\\244][\\128-\\191]*" };
utf8.map = function (s: { gmatch: (arg0: string) => any; }, f: (arg0: number, arg1: number, arg2: any) => void, no_subs: any) {
    let i = 0;
    if (no_subs) {
        for (const [b, e] of s.gmatch("()" + (utf8.pattern + "()"))) {
            i = i + 1;
            let c = e - b;
            f(i, c, b);
        }
    }
    else {
        for (const [b, c] of s.gmatch("()(" + (utf8.pattern + ")"))) {
            i = i + 1;
            f(i, c, b);
        }
    }
};
utf8.chars = function (s: any, no_subs: any) {
    return coroutine.wrap(function () {
        return utf8.map(s, coroutine.yield, no_subs);
    });
};
function localize(args: any, misc_cat?: string): string|undefined {
    if (args && !(typeof args === "object")) {
        if (misc_cat && G.localization.misc[misc_cat]) {
            return G.localization.misc[misc_cat][args] || "ERROR";
        }
        return G.localization.misc.dictionary[args] || "ERROR";
    }
    let loc_target = undefined;
    let ret_string = undefined;
    if (args.type === "other") {
        loc_target = G.localization.descriptions.Other[args.key];
    }
    if (args.type === "descriptions" || args.type === "unlocks") {
        loc_target = G.localization.descriptions[args.set][args.key];
    }
    if (args.type === "tutorial") {
        loc_target = G.localization.tutorial_parsed[args.key];
    }
    if (args.type === "quips") {
        loc_target = G.localization.quips_parsed[args.key];
    }
    if (args.type === "raw_descriptions") {
        loc_target = G.localization.descriptions[args.set][args.key];
        let multi_line = {};
        if (loc_target) {
            for (const [_, lines] of ipairs(args.type === "unlocks" && loc_target.unlock_parsed || args.type === "name" && loc_target.name_parsed || args.type === "text" && loc_target || loc_target.text_parsed)) {
                let final_line = "";
                for (const [_, part] of ipairs(lines)) {
                    let assembled_string = "";
                    for (const [_, subpart] of ipairs(part.strings)) {
                        assembled_string = assembled_string + (typeof subpart === "string" && subpart || format_ui_value(args.vars[tonumber(subpart[1])]) || "ERROR");
                    }
                    final_line = final_line + assembled_string;
                }
                multi_line[multi_line.length + 1] = final_line;
            }
        }
        return multi_line;
    }
    if (args.type === "text") {
        loc_target = G.localization.misc.v_text_parsed[args.key];
    }
    if (args.type === "variable") {
        loc_target = G.localization.misc.v_dictionary_parsed[args.key];
        if (!loc_target) {
            return "ERROR";
        }
        if (loc_target.multi_line) {
            let assembled_strings = {};
            for (const [k, v] of ipairs(loc_target)) {
                let assembled_string = "";
                for (const [_, subpart] of ipairs(v[1].strings)) {
                    assembled_string = assembled_string + (typeof subpart === "string" && subpart || format_ui_value(args.vars[tonumber(subpart[1])]));
                }
                assembled_strings[k] = assembled_string;
            }
            return assembled_strings || ["ERROR"];
        }
        else {
            let assembled_string = "";
            for (const [_, subpart] of ipairs(loc_target[1].strings)) {
                assembled_string = assembled_string + (typeof subpart === "string" && subpart || format_ui_value(args.vars[tonumber(subpart[1])]));
            }
            ret_string = assembled_string || "ERROR";
        }
    }
    if (args.type === "name_text") {
        if (pcall(function () {
            ret_string = G.localization.descriptions[args.set || args.node.config.center.set][args.key || args.node.config.center.key].name;
        })) { }
        else {
            ret_string = "ERROR";
        }
    }
    if (args.type === "name") {
        loc_target = G.localization.descriptions[args.set || args.node.config.center.set][args.key || args.node.config.center.key];
    }
    if (ret_string) {
        return ret_string;
    }
    if (loc_target) {
        for (const [_, lines] of ipairs(args.type === "unlocks" && loc_target.unlock_parsed || args.type === "name" && loc_target.name_parsed || (args.type === "text" || args.type === "tutorial" || args.type === "quips") && loc_target || loc_target.text_parsed)) {
            let final_line = {};
            for (const [_, part] of ipairs(lines)) {
                let assembled_string = "";
                for (const [_, subpart] of ipairs(part.strings)) {
                    assembled_string = assembled_string + (typeof subpart === "string" && subpart || format_ui_value(args.vars[tonumber(subpart[1])]) || "ERROR");
                }
                let desc_scale = G.LANG.font.DESCSCALE;
                if (G.F_MOBILE_UI) {
                    desc_scale = desc_scale * 1.5;
                }
                if (args.type === "name") {
                    final_line[final_line.length + 1] = { n: G.UIT.O, config: { object: DynaText({ string: [assembled_string], colours: [part.control.V && args.vars.colours[tonumber(part.control.V)] || part.control.C && loc_colour(part.control.C) || args.text_colour || G.C.UI.TEXT_LIGHT], bump: true, silent: true, pop_in: 0, pop_in_rate: 4, maxw: 5, shadow: true, y_offset: -0.6, spacing: math.max(0, 0.32 * (17 - assembled_string.length)), scale: (0.55 - 0.004 * assembled_string.length) * (part.control.s && tonumber(part.control.s) || args.scale || 1) }) } };
                }
                if (part.control.E) {
                    let [_float, _silent, _pop_in, _bump, _spacing] = [undefined, true, undefined, undefined, undefined];
                    if (part.control.E === "1") {
                        _float = true;
                        _silent = true;
                        _pop_in = 0;
                    }
                    if (part.control.E === "2") {
                        _bump = true;
                        _spacing = 1;
                    }
                    final_line[final_line.length + 1] = { n: G.UIT.O, config: { object: DynaText({ string: [assembled_string], colours: [part.control.V && args.vars.colours[tonumber(part.control.V)] || loc_colour(part.control.C || undefined)], float: _float, silent: _silent, pop_in: _pop_in, bump: _bump, spacing: _spacing, scale: 0.32 * (part.control.s && tonumber(part.control.s) || args.scale || 1) * desc_scale }) } };
                }
                if (part.control.X) {
                    final_line[final_line.length + 1] = { n: G.UIT.C, config: { align: "m", colour: loc_colour(part.control.X), r: 0.05, padding: 0.03, res: 0.15 }, nodes: [{ n: G.UIT.T, config: { text: assembled_string, colour: loc_colour(part.control.C || undefined), scale: 0.32 * (part.control.s && tonumber(part.control.s) || args.scale || 1) * desc_scale } }] };
                }
                else {
                    final_line[final_line.length + 1] = { n: G.UIT.T, config: { detailed_tooltip: part.control.T && (G.P_CENTERS[part.control.T] || G.P_TAGS[part.control.T]) || undefined, text: assembled_string, shadow: args.shadow, colour: part.control.V && args.vars.colours[tonumber(part.control.V)] || !part.control.C && args.text_colour || loc_colour(part.control.C || undefined, args.default_col), scale: 0.32 * (part.control.s && tonumber(part.control.s) || args.scale || 1) * desc_scale } };
                }
            }
            if (args.type === "name" || args.type === "text") {
                return final_line;
            }
            args.nodes[args.nodes.length + 1] = final_line;
        }
    }
};
function get_stake_sprite(_stake: number, _scale: number): Sprite {
    _stake = _stake || 1;
    _scale = _scale || 1;
    let stake_sprite = new Sprite(0, 0, _scale * 1, _scale * 1, G.ASSET_ATLAS[G.P_CENTER_POOLS.Stake[_stake].atlas??""], G.P_CENTER_POOLS.Stake[_stake].pos);
    stake_sprite.states.drag.can = false;
    if (G.P_CENTER_POOLS["Stake"][_stake].shiny) {
        stake_sprite.draw = function (_sprite: { ARGS: { send_to_shader: number[]; }; VT: { r: number; }; juice: { r: number; }; }) {
            _sprite.ARGS.send_to_shader = _sprite.ARGS.send_to_shader || {};
            _sprite.ARGS.send_to_shader[1] = math.min(_sprite.VT.r * 3, 1) + G.TIMERS.REAL / 18 + (_sprite.juice && _sprite.juice.r * 20 || 0) + 1;
            _sprite.ARGS.send_to_shader[2] = G.TIMERS.REAL;
            Sprite.prototype.draw_shader.call(_sprite, "dissolve");
            Sprite.prototype.draw_shader.call(_sprite, "voucher", undefined, _sprite.ARGS.send_to_shader);
        };
    }
    return stake_sprite;
};
function get_front_spriteinfo(_front: { suit: string | number; value: string | number; pos: { x: any; }; hc_atlas: any; lc_atlas: any; atlas: string | number; }): any {
    if (_front && _front.suit && G.SETTINGS.CUSTOM_DECK && G.SETTINGS.CUSTOM_DECK.Collabs) {
        let collab = G.SETTINGS.CUSTOM_DECK.Collabs[_front.suit];
        if (collab) {
            let deckSkin = SMODS.DeckSkins[collab];
            if (deckSkin) {
                if (deckSkin.outdated) {
                    let hasRank = false;
                    for (let i = 1; i <= deckSkin.ranks.length; i++) {
                        if (deckSkin.ranks[i] === _front.value) {
                            hasRank = true;
                            break;
                        }
                    }
                    if (hasRank) {
                        let atlas = G.ASSET_ATLAS[G.SETTINGS.colour_palettes[_front.suit] === "hc" && deckSkin.hc_atlas || deckSkin.lc_atlas];
                        if (atlas) {
                            if (deckSkin.pos_style === "collab") {
                                return [atlas, G.COLLABS.pos[_front.value]];
                            }
                            if (deckSkin.pos_style === "suit") {
                                return [atlas, { x: _front.pos.x, y: 0 }];
                            }
                            if (deckSkin.pos_style === "deck") {
                                return [atlas, _front.pos];
                            }
                            if (deckSkin.pos_style === "ranks" || undefined) {
                                for (const [i, rank] of ipairs(deckSkin.ranks)) {
                                    if (rank === _front.value) {
                                        return [atlas, { x: i - 1, y: 0 }];
                                    }
                                }
                            }
                        }
                    }
                    return [G.ASSET_ATLAS[G.SETTINGS.colour_palettes[_front.suit] === "hc" && _front.hc_atlas || _front.lc_atlas || {}] || G.ASSET_ATLAS[_front.atlas] || G.ASSET_ATLAS["cards_" + (G.SETTINGS.colour_palettes[_front.suit] === "hc" && 2 || 1)], _front.pos];
                }
                else {
                    let palette = deckSkin.palette_map && deckSkin.palette_map[G.SETTINGS.colour_palettes[_front.suit] || ""] || (deckSkin.palettes || {})[1];
                    let hasRank = false;
                    for (let i = 1; i <= palette.ranks.length; i++) {
                        if (palette.ranks[i] === _front.value) {
                            hasRank = true;
                            break;
                        }
                    }
                    if (hasRank) {
                        let atlas = G.ASSET_ATLAS[palette.atlas];
                        if (typeof palette.pos_style === "object") {
                            if (palette.pos_style[_front.value]) {
                                if (palette.pos_style[_front.value].atlas) {
                                    atlas = G.ASSET_ATLAS[palette.pos_style[_front.value].atlas];
                                }
                                if (palette.pos_style[_front.value].pos) {
                                    return [atlas, palette.pos_style[_front.value].pos];
                                }
                            }
                            if (palette.pos_style.fallback_style) {
                                if (palette.pos_style.fallback_style === "collab") {
                                    return [atlas, G.COLLABS.pos[_front.value]];
                                }
                                if (palette.pos_style.fallback_style === "suit") {
                                    return [atlas, { x: _front.pos.x, y: 0 }];
                                }
                                if (palette.pos_style.fallback_style === "deck") {
                                    return [atlas, _front.pos];
                                }
                            }
                        }
                        if (palette.pos_style === "collab") {
                            return [atlas, G.COLLABS.pos[_front.value]];
                        }
                        if (palette.pos_style === "suit") {
                            return [atlas, { x: _front.pos.x, y: 0 }];
                        }
                        if (palette.pos_style === "deck") {
                            return [atlas, _front.pos];
                        }
                        if (palette.pos_style === "ranks" || undefined) {
                            for (const [i, rank] of ipairs(palette.ranks)) {
                                if (rank === _front.value) {
                                    return [atlas, { x: i - 1, y: 0 }];
                                }
                            }
                        }
                    }
                    return [G.ASSET_ATLAS[palette.hc_default && _front.hc_atlas || _front.lc_atlas || {}] || G.ASSET_ATLAS[_front.atlas] || G.ASSET_ATLAS["cards_" + (palette.hc_default && 2 || 1)], _front.pos];
                }
            }
        }
    }
    return [G.ASSET_ATLAS[G.SETTINGS.colourblind_option && _front.hc_atlas || _front.lc_atlas || {}] || G.ASSET_ATLAS[_front.atlas] || G.ASSET_ATLAS["cards_" + (G.SETTINGS.colourblind_option && 2 || 1)], _front.pos];
};
function get_stake_col(_stake: string | number): any {
    G.C.STAKES = G.C.STAKES || [G.C.WHITE, G.C.RED, G.C.GREEN, G.C.BLACK, G.C.BLUE, G.C.PURPLE, G.C.ORANGE, G.C.GOLD];
    return G.C.STAKES[_stake];
};
function get_challenge_int_from_id(_id: any): any {
    for (const [k, v] of pairs(G.CHALLENGES)) {
        if ((v as ChallengeParams).id === _id) {
            return k;
        }
    }
    return 0;
};
function get_starting_params(): any {
    return { dollars: 4, hand_size: 8, discards: 3, hands: 4, reroll_cost: 5, joker_slots: 5, ante_scaling: 1, consumable_slots: 2, no_faces: false, erratic_suits_and_ranks: false };
};
function get_challenge_rule(_challenge: { rules: { [x: string]: Record<number, unknown>; }; }, _type: string | number, _id: any): any {
    if (_challenge && _challenge.rules && _challenge.rules[_type]) {
        for (const [k, v] of ipairs(_challenge.rules[_type])) {
            if (_id === v.id) {
                return v.value;
            }
        }
    }
};
function PLAY_SOUND(args: SoundOptions): SoundHandler {
    args.per = args.per || 1;
    args.vol = args.vol || 1;
    SOURCES[args.sound_code??""] = SOURCES[args.sound_code??""] || {};
    let should_stream = string.find(args.sound_code as string, "music") || string.find(args.sound_code as string, "ambient");
    let s: SoundHandler = { sound: love.audio.newSource("resources/sounds/" + (args.sound_code + ".ogg"), should_stream && "stream" || "static") };
    table.insert(SOURCES[args.sound_code??""], s);
    s.sound_code = args.sound_code;
    s.original_pitch = args.per || 1;
    s.original_volume = args.vol || 1;
    s.created_on_pause = args.overlay_menu && true || false;
    s.created_on_state = args.state;
    s.sfx_handled = 0;
    s.transition_timer = 0;
    SET_SFX(s, args);
    love.audio.play(s.sound);
    return s;
};
function STOP_AUDIO(): void {
    for (const [_, source] of pairs(SOURCES)) {
        for (const [_, s] of pairs(source)) {
            if ((s as SoundHandler).sound.isPlaying()) {
                (s as SoundHandler).sound.stop();
            }
        }
    }
};
function SET_SFX(s: SoundHandler, args: SoundOptions): void {
    if (string.find(s.sound_code as string, "music")) {
        if (s.sound_code === args.desired_track) {
            s.current_volume = s.current_volume || 1;
            s.current_volume = 1 * (args.dt??0) * 3 + (1 - (args.dt??0) * 3) * s.current_volume;
        }
        else {
            s.current_volume = s.current_volume || 0;
            s.current_volume = 0 * (args.dt??0) * 3 + (1 - (args.dt??0) * 3) * s.current_volume;
        }
        s.sound.setVolume(s.current_volume * (s.original_volume??1) * (args.sound_settings.volume / 100) * (args.sound_settings.music_volume / 100));
        s.sound.setPitch((s.original_pitch??1) * (args.pitch_mod??1));
    }
    else {
        if (s.temp_pitch !== s.original_pitch) {
            s.sound.setPitch(s.original_pitch??1);
            s.temp_pitch = s.original_pitch;
        }
        let sound_vol = (s.original_volume??1) * (args.sound_settings.volume / 100) * (args.sound_settings.game_sounds_volume / 100);
        if (s.created_on_state === 13) {
            sound_vol = sound_vol * (args.splash_vol??1);
        }
        if (sound_vol <= 0) {
            s.sound.stop();
        }
        else {
            s.sound.setVolume(sound_vol);
        }
    }
};
function MODULATE(args: SoundOptions): void {
    for (const [k, v] of pairs(SOURCES)) {
        if (string.find(k as string, "music") && args.desired_track !== "") {
            if (v[1] && v[1].sound && v[1].sound.isPlaying()) { }
            else {
                RESTART_MUSIC(args);
                break;
            }
        }
    }
    for (const [k, v] of pairs(SOURCES)) {
        let i = 1;
        while (i <= v.length) {
            if (!v[i].sound.isPlaying()) {
                table.remove(v, i);
            }
            else {
                i = i + 1;
            }
        }
        for (const [i, s] of ipairs(v)) {
            if (s.sound && s.sound.isPlaying() && s.original_volume) {
                SET_SFX(s, args);
            }
        }
    }
};
function RESTART_MUSIC(args: SoundOptions): void {
    for (const [k, v] of pairs(SOURCES)) {
        if (string.find(k as string, "music")) {
            for (const [i, s] of ipairs(v)) {
                s.sound.stop();
            }
            SOURCES[k] = [];
            args.per = 0.7;
            args.vol = 0.6;
            args.sound_code = k as string;
            let s = PLAY_SOUND(args);
            s.initialized = true;
        }
    }
};
function AMBIENT(args: SoundOptions): void {
    for (const [k, v] of pairs(SOURCES)) {
        if (args.ambient_control?.[k]) {
            let start_ambient = (args.ambient_control[k].vol??0) > 0;
            for (const [i, s] of ipairs(v)) {
                if (s.sound && s.sound.isPlaying() && s.original_volume) {
                    s.original_volume = args.ambient_control[k].vol;
                    SET_SFX(s, args);
                    start_ambient = false;
                }
            }
            if (start_ambient) {
                args.sound_code = k as string;
                args.vol = args.ambient_control[k].vol;
                args.per = args.ambient_control[k].per;
                PLAY_SOUND(args);
            }
        }
    }
};
function RESET_STATES(state: number): void {
    for (const [k, v] of pairs(SOURCES)) {
        for (const [i, s] of ipairs(v)) {
            s.created_on_state = state;
        }
    }
};