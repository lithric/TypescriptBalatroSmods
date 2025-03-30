local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
function live_test(self)
end
function do_action(self, action)
    local action = {type = "use_card", target_area = "shop_booster", target_card = 1}
    do_action(_G, action)
    if action.type == "use_card" then
        G.FUNCS:use_card({config = {ref_table = G[action.target_area].cards[action.target_card]}})
    end
end
function graphics_stress(self)
    local _r = {}
    do
        local i = 1
        while i <= 50 do
            local _c = {}
            do
                local j = 1
                while j <= 50 do
                    _c[_c.length + 1] = {n = G.UIT.C, config = {align = "cm", minw = 0.05, minh = 0.05, colour = G.C.BLUE}, nodes = {{n = G.UIT.T, config = {text = "A", scale = 0.15, colour = G.C.WHITE}}}}
                    j = j + 1
                end
            end
            _r[_r.length + 1] = {n = G.UIT.R, config = {
                align = "cm",
                minw = 0.05,
                minh = 0.05,
                colour = G.C.BLUE,
                padding = 0.05
            }, nodes = _c}
            i = i + 1
        end
    end
    local uidef = {n = G.UIT.ROOT, config = {align = "cm", colour = G.C.CLEAR}, nodes = _r}
    G.STRESS = __TS__New(UIBox, {definition = uidef, config = {align = "cm", offset = {x = 0, y = 0}, major = G.ROOM_ATTACH}})
end
function aprint(self, text)
    if _RELEASE_MODE then
        return
    end
    attention_text(_G, {
        text = text,
        scale = 0.8,
        hold = 5.7,
        cover = G.deck or G.MAIN_MENU_UI,
        cover_colour = G.C.RED,
        align = "cm"
    })
end
function play_video(self)
    G.video_control = G.video_control or ({
        {video = "A3", _s = 0.1, _e = 4.65, track = "music1"},
        {video = "E1", _s = 3.69, _e = 6.55},
        {video = "C3", _s = 1.9, _e = 4.3, track = "music3"},
        {video = "E5", _s = 5.9, _e = 9.2, track = "music1"},
        {video = "C4a", _s = 1.3, _e = 4.5, track = "music2"},
        {video = "E4", _s = 4, _e = 7.2, track = "music1"},
        {video = "D4", _s = 0.3, _e = 3.2, track = "music4"},
        {video = "C2", _s = 2, _e = 4.4, track = "music1"},
        {video = "B3", _s = 2.7, _e = 5.3},
        {video = "B4", _s = 21.5, _e = 24.8},
        {video = "D5", _s = 1.2, _e = 3.8, track = "music1"},
        {video_organ = 0.1, video = "E2", _s = 1.5, _e = 4.1},
        {video_organ = 0.2, video = "E3", _s = 3.5, _e = 7.5},
        {
            video_organ = 0.4,
            video = "D3",
            _s = 1.9,
            _e = 4.3,
            track = "music1"
        }
    })
    G.video_volume = 1
    G.video_volume_real = 0
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            blocking = false,
            blockable = false,
            func = function(self)
                G.video_volume_real = G.video_volume_real * (1 - 4 * G.real_dt) + 4 * G.real_dt * G.video_volume
                if G.video then
                    G.video:getSource():setVolume(G.video_volume_real)
                end
            end
        }
    ))
    local trailer_time = 0
    for k, v in pairs(G.video_control) do
        if v.start then
            local nu_vc = {}
            do
                local i = k
                while i <= G.video_control.length do
                    nu_vc[nu_vc.length + 1] = G.video_control[i]
                    i = i + 1
                end
            end
            G.video_control = nu_vc
            break
        end
    end
    for k, v in pairs(G.video_control) do
        trailer_time = trailer_time + (v._e - v._s)
        v.video_file = love.graphics.newVideo("resources/videos/" .. tostring(v.video) .. ".ogv")
        v.video_file:seek(math.max(v._s or 0.3, 0.3) - 0.29)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                v.video_file:play()
                return true
            end}
        ))
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                trigger = "after",
                delay = 0.29,
                func = function(self)
                    v.video_file:pause()
                    v.video_file:seek(v._s or 0)
                    return true
                end
            }
        ))
    end
    delay(_G, 1.5)
    for k, v in pairs(G.video_control) do
        if v.text then
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {
                    trigger = "before",
                    delay = 1.4,
                    func = function(self)
                        G.FUNCS:wipe_on(v.text, true, 1.4)
                        G.video_volume = 0
                        return true
                    end
                }
            ))
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {func = function(self)
                    if G.video then
                        G.video:pause()
                    end
                    G.video = v.video_file
                    if v.track then
                        G.video_soundtrack = v.track
                    end
                    if v.video_organ then
                        G.video_organ = v.video_organ
                    end
                    G.video:play()
                    G.video_volume = 1
                    return true
                end}
            ))
            G.FUNCS:wipe_off()
        else
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {func = function(self)
                    if G.video then
                        G.video:pause()
                    end
                    G.video = v.video_file
                    if v.track then
                        G.video_soundtrack = v.track
                    end
                    if v.video_organ then
                        G.video_organ = v.video_organ
                    end
                    G.video:play()
                    return true
                end}
            ))
        end
        local _delay = v._e - (v._s or 0) - (v.text and 1.5 or 0)
        delay(_G, _delay - 0.15)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {func = function(self)
                G.screenglitch = true
                G.screenwipe_amt = 1
                return true
            end}
        ))
        delay(_G, 0.15)
        G.E_MANAGER:add_event(__TS__New(
            GameEvent,
            {
                blocking = false,
                trigger = "after",
                delay = 0.3,
                func = function(self)
                    G.screenglitch = false
                    return true
                end
            }
        ))
    end
    local flash_col = copy_table(_G, G.C.WHITE)
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {
            trigger = "before",
            delay = 0.6,
            func = function(self)
                G.FUNCS:wipe_on(nil, true, 2, flash_col)
                return true
            end
        }
    ))
    G.E_MANAGER:add_event(__TS__New(
        GameEvent,
        {func = function(self)
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {
                    trigger = "after",
                    delay = 0.9,
                    blockable = false,
                    func = function(self)
                        G.video:pause()
                        G.video = nil
                        G.video_soundtrack = "music1"
                        G.video_organ = 0
                        return true
                    end
                }
            ))
            G.E_MANAGER:add_event(__TS__New(
                GameEvent,
                {
                    trigger = "after",
                    delay = 0.9,
                    blockable = false,
                    func = function(self)
                        G.screenglitch = false
                        G.TIMERS.REAL = 4
                        G.TIMERS.TOTAL = 4
                        flash_col[4] = 0
                        G:main_menu("splash")
                        return true
                    end
                }
            ))
            return true
        end}
    ))
    G.FUNCS:wipe_off()
end
