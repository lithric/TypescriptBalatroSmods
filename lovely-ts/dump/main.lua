local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__Iterator = ____lualib.__TS__Iterator
SovereignContext = __TS__Class()
SovereignContext.name = "SovereignContext"
function SovereignContext.prototype.____constructor(self, SOV)
    if SOV and __TS__InstanceOf(SOV, SovereignContext) then
        self:load(SOV)
    end
end
function SovereignContext.prototype.save(self)
    self.__G = _G
    self._io = io
    self.m_known_functions = {}
    self.m_user_known_functions = {}
    self.m_known_tables = {}
    self.m_user_known_tables = {}
    self._coroutine = coroutine
    self._debug = debug
    self._string = string
    self._pairs = pairs
    self._ipairs = ipairs
    self._tostring = tostring
    self._pcall = pcall
    self._type = type
    self._next = next
    self._assert = assert
    self._print = print
    self._error = error
    self._require = require
    self.table_concat = table.concat
    self.table_remove = table.remove
    self.table_insert = table.insert
    self.string_sub = string.sub
    self.string_format = string.format
    self.string_match = string.match
    self.string_gmatch = string.gmatch
    self.io_open = io.open
    self.io_close = io.close
end
function SovereignContext.prototype.load(self, SOV)
    self.__G = SOV.__G
    self._io = SOV._io
    self.m_known_functions = SOV.m_known_functions
    self.m_user_known_functions = SOV.m_user_known_functions
    self.m_known_tables = SOV.m_known_tables
    self.m_user_known_tables = SOV.m_user_known_tables
    self._coroutine = SOV._coroutine
    self._debug = SOV._debug
    self._string = SOV._string
    self._pairs = SOV._pairs
    self._ipairs = SOV._ipairs
    self._tostring = SOV._tostring
    self._pcall = SOV._pcall
    self._type = SOV._type
    self._next = SOV._next
    self._assert = SOV._assert
    self._print = SOV._print
    self._error = SOV._error
    self._require = SOV._require
    self.table_concat = SOV.table_concat
    self.table_remove = SOV.table_remove
    self.table_insert = SOV.table_insert
    self.string_sub = SOV.string_sub
    self.string_format = SOV.string_format
    self.string_match = SOV.string_match
    self.string_gmatch = SOV.string_gmatch
    self.io_open = SOV.io_open
    self.io_close = SOV.io_close
end
Dumper = __TS__Class()
Dumper.name = "Dumper"
__TS__ClassExtends(Dumper, SovereignContext)
function Dumper.prototype.____constructor(self, SOV, thread_or_nil)
    local thread = nil
    SovereignContext.prototype.____constructor(self, SOV)
    if __TS__InstanceOf(SOV, SovereignContext) then
        thread = thread_or_nil
    else
        thread = SOV
    end
    self.lines = {}
    self.dumping_same_thread = thread == self._coroutine.running()
    self.thread = thread
end
function Dumper.prototype.ParseLine(self, line)
    self._assert(self._type(line) == "string")
    local match = {self.string_match(line, "^%s*function%s+(%w+)")}
    if match then
        return match
    end
    match = {self.string_match(line, "^%s*local%s+function%s+(%w+)")}
    if match then
        return match
    end
    match = {self.string_match(line, "^%s*local%s+(%w+)%s+=%s+function")}
    if match then
        return match
    end
    match = {self.string_match(line, "%s*function%s*%(")}
    if match then
        return "(anonymous)"
    end
    return "(anonymous)"
end
function Dumper.prototype.GuessFunctionName(self, info)
    if self._type(info.source) == "string" and self.string_sub(info.source, 1, 1) == "@" then
        local file, err = self.io_open(
            self.string_sub(info.source, 2),
            "r"
        )
        if not file then
            self._print("file not found: " .. self._tostring(err))
            return "?"
        end
        local line
        do
            local _ = 1
            while _ <= info.linedefined do
                line = file:read("*l")
                _ = _ + 1
            end
        end
        if not line then
            self._print("line not found")
            return "?"
        end
        return self:ParseLine(line)
    elseif self._type(info.source) == "string" and self.string_sub(info.source, 1, 6) == "=[love" then
        return "(LÖVE Function)"
    else
        local line
        local lineNumber = 0
        for l in self.string_gmatch(info.source, "([^\\n]+)\\n-") do
            lineNumber = lineNumber + 1
            if lineNumber == info.linedefined then
                line = l
                break
            end
        end
        if not line then
            self._print("line not found")
            return "?"
        end
        return self:ParseLine(line)
    end
end
function Dumper.prototype.safe_tostring(self, value)
    local ok, err = self._pcall(self._tostring, value)
    if ok then
        return err
    else
        return self.string_format("<failed to get printable value>: '%s'", err)
    end
end
function Dumper.prototype.getinfo(self, f, what)
    if self.thread and self._type(self.thread) == "thread" then
        if self.dumping_same_thread and self._type(f) == "number" then
            f = f + 1
        end
        return self._debug.getinfo(self.thread, f, what)
    else
        return self._debug.getinfo(arguments[0], arguments[1], arguments[2])
    end
end
function Dumper.prototype.getlocal(self, f, what)
    if self.thread and self._type(self.thread) == "thread" then
        if self.dumping_same_thread and self._type(f) == "number" then
            f = f + 1
        end
        return self._debug.getlocal(self.thread, f, what)
    else
        return self._debug.getlocal(arguments[0], arguments[1], arguments[2])
    end
end
function Dumper.prototype.add(self, text)
    self.table_insert(self.lines, text)
end
function Dumper.prototype.add_f(self, fmt, ...)
    self:add(self.string_format(fmt, ...))
end
function Dumper.prototype.concat_lines(self)
    return self.table_concat(self.lines)
end
function Dumper.prototype.DumpLocals(self, level)
    local prefix = "\\t "
    local i = 1
    if self.dumping_same_thread then
        level = level + 1
    end
    local name, value = self:getlocal(level, i)
    if not name then
        return
    end
    self:add("\\tLocal variables:\\r\\n")
    while name do
        if self._type(value) == "number" then
            self:add_f("%s%s = number: %g\\r\\n", prefix, name, value)
        elseif self._type(value) == "boolean" then
            self:add_f(
                "%s%s = boolean: %s\\r\\n",
                prefix,
                name,
                self._tostring(value)
            )
        elseif self._type(value) == "string" then
            self:add_f("%s%s = string: %q\\r\\n", prefix, name, value)
        elseif self._type(value) == "userdata" then
            self:add_f(
                "%s%s = %s\\r\\n",
                prefix,
                name,
                self:safe_tostring(value)
            )
        elseif self._type(value) == "nil" then
            self:add_f("%s%s = nil\\r\\n", prefix, name)
        elseif self._type(value) == "table" then
            if self.m_known_tables[value] then
                self:add_f("%s%s = %s\\r\\n", prefix, name, self.m_known_tables[value])
            elseif self.m_user_known_tables[value] then
                self:add_f("%s%s = %s\\r\\n", prefix, name, self.m_user_known_tables[value])
            else
                local txt = "{"
                for k, v in self._pairs(value) do
                    txt = txt .. self:safe_tostring(k) .. ":" .. self:safe_tostring(v)
                    if #txt > _M.max_tb_output_len then
                        txt = txt .. " (more...)"
                        break
                    end
                    if {self._next(value, k)} then
                        txt = txt .. ", "
                    end
                end
                self:add_f(
                    "%s%s = %s  %s\\r\\n",
                    prefix,
                    name,
                    self:safe_tostring(value),
                    txt .. "}"
                )
            end
        elseif self._type(value) == "function" then
            local info = self:getinfo(value, "nS")
            if not info then
                return
            end
            local fun_name = info.name or self.m_known_functions[value] or self.m_user_known_functions[value]
            if info.what == "C" then
                self:add_f(
                    "%s%s = C %s\\r\\n",
                    prefix,
                    name,
                    fun_name and "function: " .. tostring(fun_name) or self._tostring(value)
                )
            else
                local source = info.short_src
                if not source then
                    return
                end
                if self.string_sub(source, 2, 7) == "string" then
                    source = self.string_sub(source, 9)
                end
                fun_name = fun_name or self:GuessFunctionName(info)
                self:add_f(
                    "%s%s = Lua function '%s' (defined at line %d of chunk %s)\\r\\n",
                    prefix,
                    name,
                    fun_name,
                    info.linedefined,
                    source
                )
            end
        elseif self._type(value) == "thread" then
            self:add_f(
                "%sthread %q = %s\\r\\n",
                prefix,
                name,
                self._tostring(value)
            )
        end
        i = i + 1
        name, value = self:getlocal(level, i)
    end
end
M = __TS__Class()
M.name = "M"
__TS__ClassExtends(M, SovereignContext)
function M.prototype.____constructor(self, SOV)
    SovereignContext.prototype.____constructor(self, SOV)
    self.max_tb_output_len = 70
end
function M.prototype.ParseLine(self, line)
    self._assert(self._type(line) == "string")
    local match = {self.string_match(line, "^%s*function%s+(%w+)")}
    if match then
        return match
    end
    match = {self.string_match(line, "^%s*local%s+function%s+(%w+)")}
    if match then
        return match
    end
    match = {self.string_match(line, "^%s*local%s+(%w+)%s+=%s+function")}
    if match then
        return match
    end
    match = {self.string_match(line, "%s*function%s*%(")}
    if match then
        return "(anonymous)"
    end
    return "(anonymous)"
end
function M.prototype.GuessFunctionName(self, info)
    if self._type(info.source) == "string" and self.string_sub(info.source, 1, 1) == "@" then
        local file, err = self.io_open(
            self.string_sub(info.source, 2),
            "r"
        )
        if not file then
            self._print("file not found: " .. self._tostring(err))
            return "?"
        end
        local line
        do
            local _ = 1
            while _ <= info.linedefined do
                line = file:read("*l")
                _ = _ + 1
            end
        end
        if not line then
            self._print("line not found")
            return "?"
        end
        return self:ParseLine(line)
    elseif self._type(info.source) == "string" and self.string_sub(info.source, 1, 6) == "=[love" then
        return "(LÖVE Function)"
    else
        local line
        local lineNumber = 0
        for l in self.string_gmatch(info.source, "([^\\n]+)\\n-") do
            lineNumber = lineNumber + 1
            if lineNumber == info.linedefined then
                line = l
                break
            end
        end
        if not line then
            self._print("line not found")
            return "?"
        end
        return self:ParseLine(line)
    end
end
function M.prototype.safe_tostring(self, value)
    local ok, err = self._pcall(self._tostring, value)
    if ok then
        return err
    else
        return self.string_format("<failed to get printable value>: '%s'", err)
    end
end
function M.prototype.stacktrace(self, thread_or_message, message_or_level, level)
    local thread = nil
    local message = nil
    if self._type(thread) ~= "thread" then
        thread, message, level = nil, thread_or_message, message_or_level
    else
        thread, message, level = thread_or_message, thread_or_message, level
    end
    thread = thread or self._coroutine.running()
    level = level or 1
    local dumper = __TS__New(Dumper, thread)
    dumper._coroutine = self._coroutine
    dumper._debug = self._debug
    dumper._string = self._string
    dumper._pairs = self._pairs
    dumper._tostring = self._tostring
    dumper._pcall = self._pcall
    dumper._type = self._type
    dumper._next = self._next
    dumper._assert = self._assert
    dumper._print = self._print
    dumper.table_concat = self.table_concat
    dumper.table_insert = self.table_insert
    dumper.string_sub = self.string_sub
    dumper.string_format = self.string_format
    dumper.string_match = self.string_match
    dumper.string_gmatch = self.string_gmatch
    local original_error
    if self._type(message) == "table" then
        dumper:add("an error object {\\r\\n")
        local first = true
        for k, v in self._pairs(message) do
            if first then
                dumper:add("  ")
                first = false
            else
                dumper:add(",\\r\\n  ")
            end
            dumper:add(self:safe_tostring(k))
            dumper:add(": ")
            dumper:add(self:safe_tostring(v))
        end
        dumper:add("\\r\\n}")
        original_error = dumper:concat_lines()
    elseif self._type(message) == "string" then
        dumper:add(message)
        original_error = message
    end
    dumper:add("\\r\\n")
    dumper:add("[\r\nStack Traceback\r\n===============\r\n]")
    local level_to_show = level
    if dumper.dumping_same_thread then
        level = level + 1
    end
    local info = dumper:getinfo(level, "nSlf")
    while info do
        if info.what == "main" then
            if not info.source then
                return
            end
            if self.string_sub(info.source, 1, 1) == "@" then
                dumper:add_f(
                    "(%d) main chunk of file '%s' at line %d\\r\\n",
                    level_to_show,
                    self.string_sub(info.source, 2),
                    info.currentline
                )
            elseif info.source and self.string_sub(info.source, 1, 1) == "=" then
                local str = self.string_sub(info.source, 3, -2)
                local props = {}
                for v in self.string_gmatch(str, "[^%s]+") do
                    self.table_insert(props, v)
                end
                local source = self.table_remove(props, 1)
                if source == "love" then
                    dumper:add_f(
                        "(%d) main chunk of LÖVE file '%s' at line %d\\r\\n",
                        level_to_show,
                        self.string_sub(
                            self.table_concat(props, " "),
                            2,
                            -2
                        ),
                        info.currentline
                    )
                elseif source == "SMODS" then
                    local modID = self.table_remove(props, 1)
                    local fileName = self.table_concat(props, " ")
                    if modID == "_" then
                        dumper:add_f(
                            "(%d) main chunk of Steamodded file '%s' at line %d\\r\\n",
                            level_to_show,
                            self.string_sub(fileName, 2, -2),
                            info.currentline
                        )
                    else
                        dumper:add_f(
                            "(%d) main chunk of file '%s' at line %d (from mod with id %s)\\r\\n",
                            level_to_show,
                            self.string_sub(fileName, 2, -2),
                            info.currentline,
                            modID
                        )
                    end
                elseif source == "lovely" then
                    local module = self.table_remove(props, 1)
                    local fileName = self.table_concat(props, " ")
                    dumper:add_f(
                        "(%d) main chunk of file '%s' at line %d (from lovely module %s)\\r\\n",
                        level_to_show,
                        self.string_sub(fileName, 2, -2),
                        info.currentline,
                        module
                    )
                else
                    dumper:add_f("(%d) main chunk of %s at line %d\\r\\n", level_to_show, info.source, info.currentline)
                end
            else
                dumper:add_f("(%d) main chunk of %s at line %d\\r\\n", level_to_show, info.source, info.currentline)
            end
        elseif info.what == "C" then
            local function_name = self.m_user_known_functions[info.func] or self.m_known_functions[info.func] or info.name or self._tostring(info.func)
            dumper:add_f("(%d) %s C function '%s'\\r\\n", level_to_show, info.namewhat, function_name)
        elseif info.what == "tail" then
            dumper:add_f("(%d) tail call\\r\\n", level_to_show)
            dumper:DumpLocals(level)
        elseif info.what == "Lua" then
            local source = info.short_src
            local function_name = self.m_user_known_functions[info.func] or self.m_known_functions[info.func] or info.name
            if not source then
                return
            end
            if self.string_sub(source, 2, 7) == "string" then
                source = self.string_sub(source, 9)
            end
            local was_guessed = false
            if not function_name or function_name == "?" then
                function_name = self:GuessFunctionName(info)
                was_guessed = true
            end
            local function_type = info.namewhat == "" and "function" or info.namewhat
            if info.source and self.string_sub(info.source, 1, 1) == "@" then
                dumper:add_f(
                    "(%d) Lua %s '%s' at file '%s:%d'%s\\r\\n",
                    level_to_show,
                    function_type,
                    function_name,
                    self.string_sub(info.source, 2),
                    info.currentline,
                    was_guessed and " (best guess)" or ""
                )
            elseif info.source and self.string_sub(info.source, 1, 1) == "#" then
                dumper:add_f(
                    "(%d) Lua %s '%s' at template '%s:%d'%s\\r\\n",
                    level_to_show,
                    function_type,
                    function_name,
                    self.string_sub(info.source, 2),
                    info.currentline,
                    was_guessed and " (best guess)" or ""
                )
            elseif info.source and self.string_sub(info.source, 1, 1) == "=" then
                local str = self.string_sub(info.source, 3, -2)
                local props = {}
                for v in self.string_gmatch(str, "[^%s]+") do
                    self.table_insert(props, v)
                end
                local source = self.table_remove(props, 1)
                if source == "love" then
                    dumper:add_f(
                        "(%d) LÖVE %s at file '%s:%d'%s\\r\\n",
                        level_to_show,
                        function_type,
                        self.string_sub(
                            self.table_concat(props, " "),
                            2,
                            -2
                        ),
                        info.currentline,
                        was_guessed and " (best guess)" or ""
                    )
                elseif source == "SMODS" then
                    local modID = self.table_remove(props, 1)
                    local fileName = self.table_concat(props, " ")
                    if modID == "_" then
                        dumper:add_f(
                            "(%d) Lua %s '%s' at Steamodded file '%s:%d' %s\\r\\n",
                            level_to_show,
                            function_type,
                            function_name,
                            self.string_sub(fileName, 2, -2),
                            info.currentline,
                            was_guessed and " (best guess)" or ""
                        )
                    else
                        dumper:add_f(
                            "(%d) Lua %s '%s' at file '%s:%d' (from mod with id %s)%s\\r\\n",
                            level_to_show,
                            function_type,
                            function_name,
                            self.string_sub(fileName, 2, -2),
                            info.currentline,
                            modID,
                            was_guessed and " (best guess)" or ""
                        )
                    end
                elseif source == "lovely" then
                    local module = self.table_remove(props, 1)
                    local fileName = self.table_concat(props, " ")
                    dumper:add_f(
                        "(%d) Lua %s '%s' at file '%s:%d' (from lovely module %s)%s\\r\\n",
                        level_to_show,
                        function_type,
                        function_name,
                        self.string_sub(fileName, 2, -2),
                        info.currentline,
                        module,
                        was_guessed and " (best guess)" or ""
                    )
                else
                    dumper:add_f(
                        "(%d) Lua %s '%s' at line %d of chunk '%s'\\r\\n",
                        level_to_show,
                        function_type,
                        function_name,
                        info.currentline,
                        source
                    )
                end
            else
                dumper:add_f(
                    "(%d) Lua %s '%s' at line %d of chunk '%s'\\r\\n",
                    level_to_show,
                    function_type,
                    function_name,
                    info.currentline,
                    source
                )
            end
            dumper:DumpLocals(level)
        else
            dumper:add_f("(%d) unknown frame %s\\r\\n", level_to_show, info.what)
        end
        level = level + 1
        level_to_show = level_to_show + 1
        info = dumper:getinfo(level, "nSlf")
    end
    return {
        dumper:concat_lines(),
        original_error
    }
end
function M.prototype.add_known_table(self, tab, description)
    if self.m_known_tables[tab] then
        self._error("Cannot override an already known table")
    end
    self.m_user_known_tables[tab] = description
end
function M.prototype.add_known_function(self, fun, description)
    if self.m_known_functions[fun] then
        self._error("Cannot override an already known function")
    end
    self.m_user_known_functions[fun] = description
end
function loadStackTracePlus(self)
    local SOV = __TS__New(SovereignContext)
    SOV:save()
    SOV._assert(SOV._debug, "debug table must be available at this point")
    SOV.m_known_tables = {[SOV.__G] = "_G (global table)"}
    local function add_known_module(self, name, desc)
        local ok, mod = SOV._pcall(SOV._require, name)
        if ok then
            SOV.m_known_tables[mod] = desc
        end
    end
    add_known_module(_G, "string", "string module")
    add_known_module(_G, "io", "io module")
    add_known_module(_G, "os", "os module")
    add_known_module(_G, "table", "table module")
    add_known_module(_G, "math", "math module")
    add_known_module(_G, "package", "package module")
    add_known_module(_G, "debug", "debug module")
    add_known_module(_G, "coroutine", "coroutine module")
    add_known_module(_G, "bit32", "bit32 module")
    add_known_module(_G, "bit", "bit module")
    add_known_module(_G, "jit", "jit module")
    if _VERSION >= "Lua 5.3" then
        add_known_module(_G, "utf8", "utf8 module")
    end
    SOV.m_user_known_tables = {}
    SOV.m_known_functions = {}
    for _, name in SOV._ipairs({
        "assert",
        "collectgarbage",
        "dofile",
        "error",
        "getmetatable",
        "ipairs",
        "load",
        "loadfile",
        "next",
        "pairs",
        "pcall",
        "print",
        "rawequal",
        "rawget",
        "rawlen",
        "rawset",
        "require",
        "select",
        "setmetatable",
        "tonumber",
        "tostring",
        "type",
        "xpcall",
        "gcinfo",
        "getfenv",
        "loadstring",
        "module",
        "newproxy",
        "setfenv",
        "unpack"
    }) do
        if SOV.__G[name] then
            SOV.m_known_functions[SOV.__G[name]] = name
        end
    end
    SOV.m_user_known_functions = {}
    local _M = __TS__New(M, SOV)
    return _M
end
stackTraceAlreadyInjected = false
function getDebugInfoForCrash(self)
    local version = VERSION
    if not version or type(version) ~= "string" then
        local versionFile, _ = love.filesystem.read("version.jkr")
        if versionFile then
            version = tostring(versionFile:match("[^\\n]*")) .. " (best guess)"
        else
            version = "???"
        end
    end
    local modded_version = MODDED_VERSION
    if not modded_version or type(modded_version) ~= "string" then
        local moddedSuccess, reqVersion = pcall(require, "SMODS.version")
        if moddedSuccess and type(reqVersion) == "string" then
            modded_version = reqVersion
        else
            modded_version = "???"
        end
    end
    local info = "Additional Context:\\nBalatro Version: " .. version .. "\\nModded Version: " .. tostring(modded_version)
    local major, minor, revision, codename = love.getVersion()
    info = info .. string.format("\\nLÖVE Version: %d.%d.%d", major, minor, revision)
    local lovely_success, lovely = pcall(require, "lovely")
    if lovely_success then
        info = info .. "\\nLovely Version: " .. tostring(lovely.version)
    end
    info = info .. "\\nPlatform: " .. (love.system.getOS() or "???")
    if SMODS and SMODS.Mods then
        local mod_strings = ""
        local lovely_strings = ""
        local i = 1
        local lovely_i = 1
        for _, v in pairs(SMODS.Mods) do
            if v.can_load and (not v.meta_mod or v.lovely_only) or v.lovely and not v.can_load and not v.disabled then
                if v.lovely_only or v.lovely and not v.can_load then
                    lovely_strings = lovely_strings .. "\\n    " .. tostring(lovely_i) .. ": " .. tostring(v.name)
                    lovely_i = lovely_i + 1
                    if not v.can_load then
                        lovely_strings = lovely_strings .. "\\n        Has Steamodded mod that failed to load."
                        if v.load_issues.dependencies.length > 0 then
                            lovely_strings = lovely_strings .. "\\n        Missing Dependencies:"
                            for k, v in ipairs(v.load_issues.dependencies) do
                                lovely_strings = lovely_strings .. "\\n            " .. tostring(k) .. ". " .. tostring(v)
                            end
                        end
                        if v.load_issues.conflicts.length > 0 then
                            lovely_strings = lovely_strings .. "\\n        Conflicts:"
                            for k, v in ipairs(v.load_issues.conflicts) do
                                lovely_strings = lovely_strings .. "\\n            " .. tostring(k) .. ". " .. tostring(v)
                            end
                        end
                        if v.load_issues.outdated then
                            lovely_strings = lovely_strings .. "\\n        Outdated Mod."
                        end
                        if v.load_issues.main_file_not_found then
                            lovely_strings = lovely_strings .. "\\n        Main file not found. (" .. tostring(v.main_file) .. ")"
                        end
                    end
                else
                    mod_strings = mod_strings .. "\\n    " .. tostring(i) .. ": " .. tostring(v.name) .. " by " .. table.concat(v.author, ", ") .. " [ID: " .. tostring(v.id) .. (v.priority ~= 0 and ", Priority: " .. tostring(v.priority) or "") .. (v.version and v.version ~= "0.0.0" and ", Version: " .. tostring(v.version) or "") .. (v.lovely and ", Uses Lovely" or "") .. "]"
                    i = i + 1
                    local debugInfo = v.debug_info
                    if debugInfo then
                        if type(debugInfo) == "string" then
                            if debugInfo.length ~= 0 then
                                mod_strings = mod_strings .. "\\n        " .. tostring(debugInfo)
                            end
                        elseif type(debugInfo) == "table" then
                            for kk, vv in pairs(debugInfo) do
                                if type(vv) ~= "nil" then
                                    vv = tostring(vv)
                                end
                                if vv.length ~= 0 then
                                    mod_strings = mod_strings .. "\\n        " .. tostring(kk) .. ": " .. tostring(vv)
                                end
                            end
                        end
                    end
                end
            end
        end
        info = info .. "\\nSteamodded Mods:" .. mod_strings .. "\\nLovely Mods:" .. lovely_strings
    end
    return info
end
function injectStackTrace(self)
    if stackTraceAlreadyInjected then
        return
    end
    stackTraceAlreadyInjected = true
    local STP = loadStackTracePlus(_G)
    local utf8 = require("utf8")
    love.errorhandler = function(msg)
        msg = tostring(msg)
        if not sendErrorMessage then
            local sendErrorMessage
            function sendErrorMessage(self, msg)
                print(msg)
            end
        end
        if not sendInfoMessage then
            local sendInfoMessage
            function sendInfoMessage(self, msg)
                print(msg)
            end
        end
        sendErrorMessage(
            _G,
            "Oops! The game crashed\\n" .. tostring(STP:stacktrace(msg)),
            "StackTrace"
        )
        if not love.window or not love.graphics or not love.event then
            return
        end
        if not love.graphics:isCreated() or not love.window.isOpen() then
            local success, status = pcall(love.window.setMode, 800, 600)
            if not success or not status then
                return
            end
        end
        if love.mouse then
            love.mouse.setVisible(true)
            love.mouse.setGrabbed(false)
            love.mouse.setRelativeMode(false)
            if love.mouse.isCursorSupported() then
                love.mouse.setCursor()
            end
        end
        if love.joystick then
            for i, v in ipairs(love.joystick.getJoysticks()) do
                v:setVibration()
            end
        end
        if love.audio then
            love.audio.stop()
        end
        love.graphics.reset()
        local font = love.graphics.setNewFont("resources/fonts/m6x11plus.ttf", 20)
        local background = {0, 0, 1}
        if G and G.C and G.C.BLACK then
            background = G.C.BLACK
        end
        love.graphics.clear(background)
        love.graphics.origin()
        local trace = STP:stacktrace("", 3)
        local sanitizedmsg = {}
        for ____, ____value in __TS__Iterator(msg:gmatch(utf8.charpattern)) do
            local char = ____value[1]
            table.insert(sanitizedmsg, char)
        end
        sanitizedmsg = table.concat(sanitizedmsg)
        local err = {}
        table.insert(err, "Oops! The game crashed:")
        if sanitizedmsg:find("Syntax error: game.lua:4: '=' expected near 'Game'") then
            table.insert(err, "Duplicate installation of Steamodded detected! Please clean your installation: Steam Library > Balatro > Properties > Installed Files > Verify integrity of game files.")
        else
            table.insert(err, sanitizedmsg)
        end
        if sanitizedmsg.length ~= #msg then
            table.insert(err, "Invalid UTF-8 string in error message.")
        end
        local success, msg = pcall(getDebugInfoForCrash)
        if success and msg then
            table.insert(err, "\\n" .. msg)
            sendInfoMessage(_G, msg, "StackTrace")
        else
            table.insert(err, "\\n" .. "Failed to get additional context :/")
            sendErrorMessage(_G, "Failed to get additional context :/\\n" .. msg, "StackTrace")
        end
        for ____, ____value in __TS__Iterator(trace:gmatch("(.-)\\n")) do
            local l = ____value[1]
            table.insert(err, l)
        end
        local p = table.concat(err, "\\n")
        p = p:gsub("\\t", "")
        p = p:gsub("%[string \\\"(.-)\\\"%]", "%1")
        local scrollOffset = 0
        local endHeight = 0
        love.keyboard.setKeyRepeat(true)
        local function scrollDown(self, amt)
            if amt == nil then
                amt = 18
            end
            scrollOffset = scrollOffset + amt
            if scrollOffset > endHeight then
                scrollOffset = endHeight
            end
        end
        local function scrollUp(self, amt)
            if amt == nil then
                amt = 18
            end
            scrollOffset = scrollOffset - amt
            if scrollOffset < 0 then
                scrollOffset = 0
            end
        end
        local pos = 70
        local arrowSize = 20
        local function calcEndHeight(self)
            local font = love.graphics.getFont()
            local rw, lines = font:getWrap(
                p,
                love.graphics.getWidth() - pos * 2
            )
            local lineHeight = font:getHeight()
            local atBottom = scrollOffset == endHeight and scrollOffset ~= 0
            endHeight = #lines * lineHeight - love.graphics.getHeight() + pos * 2
            if endHeight < 0 then
                endHeight = 0
            end
            if scrollOffset > endHeight or atBottom then
                scrollOffset = endHeight
            end
        end
        local function draw(self)
            if not love.graphics.isActive() then
                return
            end
            love.graphics.clear(background)
            calcEndHeight(_G)
            love.graphics.printf(
                p,
                pos,
                pos - scrollOffset,
                love.graphics.getWidth() - pos * 2
            )
            if scrollOffset ~= endHeight then
                love.graphics.polygon(
                    "fill",
                    love.graphics.getWidth() - pos / 2,
                    love.graphics.getHeight() - arrowSize,
                    love.graphics.getWidth() - pos / 2 + arrowSize,
                    love.graphics.getHeight() - arrowSize * 2,
                    love.graphics.getWidth() - pos / 2 - arrowSize,
                    love.graphics.getHeight() - arrowSize * 2
                )
            end
            if scrollOffset ~= 0 then
                love.graphics.polygon(
                    "fill",
                    love.graphics.getWidth() - pos / 2,
                    arrowSize,
                    love.graphics.getWidth() - pos / 2 + arrowSize,
                    arrowSize * 2,
                    love.graphics.getWidth() - pos / 2 - arrowSize,
                    arrowSize * 2
                )
            end
            love.graphics.present()
        end
        local fullErrorText = p
        local function copyToClipboard(self)
            if not love.system then
                return
            end
            love.system.setClipboardText(fullErrorText)
            p = p .. "\\nCopied to clipboard!"
        end
        p = p .. "\\n\\nPress ESC to exit\\nPress R to restart the game"
        if love.system then
            p = p .. "\\nPress Ctrl+C or tap to copy this error"
        end
        if G then
            if G.SOUND_MANAGER and G.SOUND_MANAGER.channel then
                G.SOUND_MANAGER.channel:push({type = "kill"})
            end
            if G.SAVE_MANAGER and G.SAVE_MANAGER.channel then
                G.SAVE_MANAGER.channel:push({type = "kill"})
            end
            if G.HTTP_MANAGER and G.HTTP_MANAGER.channel then
                G.HTTP_MANAGER.channel:push({type = "kill"})
            end
        end
        return function(self)
            love.event.pump()
            for e, a, b, c in love.event.poll() do
                if e == "quit" then
                    return 1
                elseif e == "keypressed" and a == "escape" then
                    return 1
                elseif e == "keypressed" and a == "c" and love.keyboard.isDown("lctrl", "rctrl") then
                    copyToClipboard(_G)
                elseif e == "keypressed" and a == "r" then
                    SMODS:restart_game()
                elseif e == "keypressed" and a == "down" then
                    scrollDown(_G)
                elseif e == "keypressed" and a == "up" then
                    scrollUp(_G)
                elseif e == "keypressed" and a == "pagedown" then
                    scrollDown(
                        _G,
                        love.graphics.getHeight()
                    )
                elseif e == "keypressed" and a == "pageup" then
                    scrollUp(
                        _G,
                        love.graphics.getHeight()
                    )
                elseif e == "keypressed" and a == "home" then
                    scrollOffset = 0
                elseif e == "keypressed" and a == "end" then
                    scrollOffset = endHeight
                elseif e == "wheelmoved" then
                    scrollUp(_G, b * 20)
                elseif e == "gamepadpressed" and b == "dpdown" then
                    scrollDown(_G)
                elseif e == "gamepadpressed" and b == "dpup" then
                    scrollUp(_G)
                elseif e == "gamepadpressed" and b == "a" then
                    return "restart"
                elseif e == "gamepadpressed" and b == "x" then
                    copyToClipboard(_G)
                elseif e == "gamepadpressed" and (b == "b" or b == "back" or b == "start") then
                    return 1
                elseif e == "touchpressed" then
                    local name = love.window.getTitle()
                    if #name == 0 or name == "Untitled" then
                        name = "Game"
                    end
                    local buttons = {"OK", "Cancel", "Restart"}
                    if love.system then
                        buttons[5] = "Copy to clipboard"
                    end
                    local pressed = love.window.showMessageBox("Quit " .. name .. "?", "", buttons)
                    if pressed == 1 then
                        return 1
                    elseif pressed == 3 then
                        return "restart"
                    elseif pressed == 4 then
                        copyToClipboard(_G)
                    end
                end
            end
            draw(_G)
            if love.timer then
                love.timer.sleep(0.1)
            end
        end
    end
end
injectStackTrace(_G)
if love.system.getOS() == "OS X" and (jit.arch == "arm64" or jit.arch == "arm") then
    jit.off()
end
require("engine.object")
require("bit")
require("engine.string_packer")
require("engine.controller")
require("back")
require("tag")
require("engine.event")
require("engine.node")
require("engine.moveable")
require("engine.sprite")
require("engine.animatedsprite")
require("functions.misc_functions")
require("game")
require("globals")
require("engine.ui")
require("functions.UI_definitions")
require("functions.state_events")
require("functions.common_events")
require("functions.button_callbacks")
require("functions.misc_functions")
require("functions.test_functions")
require("card")
require("cardarea")
require("blind")
require("card_character")
require("engine.particles")
require("engine.text")
require("challenges")
math.randomseed(G.SEED)
love.run = function()
    if love.load then
        love.load(
            love.arg.parseGameArguments(arg),
            arg
        )
    end
    if love.timer then
        love.timer.step()
    end
    local dt = 0
    local dt_smooth = 1 / 100
    local run_time = 0
    return function(self)
        run_time = love.timer.getTime()
        if love.event and G and G.CONTROLLER then
            love.event.pump()
            local _n, _a, _b, _c, _d, _e, _f, touched = nil
            for name, a, b, c, d, e, f in love.event.poll() do
                if name == "quit" then
                    if not love.quit or not love.quit() then
                        return a or 0
                    end
                end
                if name == "touchpressed" then
                    touched = true
                elseif name == "mousepressed" then
                    _n, _a, _b, _c, _d, _e, _f = name, a, b, c, d, e, f
                else
                    local ____self_0 = love.handlers
                    ____self_0[name](
                        ____self_0,
                        a,
                        b,
                        c,
                        d,
                        e,
                        f
                    )
                end
            end
            if _n then
                love.handlers.mousepressed(_a, _b, _c, touched)
            end
        end
        if love.timer then
            dt = love.timer.step()
        end
        dt_smooth = math.min(0.8 * dt_smooth + 0.2 * dt, 0.1)
        if love.update then
            love.update(dt_smooth)
        end
        if love.graphics and love.graphics.isActive() then
            if love.draw then
                love.draw()
            end
            love.graphics.present()
        end
        run_time = math.min(
            love.timer.getTime() - run_time,
            0.1
        )
        G.FPS_CAP = G.FPS_CAP or 500
        if run_time < 1 / G.FPS_CAP then
            love.timer.sleep(1 / G.FPS_CAP - run_time)
        end
    end
end
love.load = function()
    G:start_up()
    local os = love.system.getOS()
    if os == "OS X" or os == "Windows" or os == "Linux" then
        local st = nil
        local cwd = NFS:getWorkingDirectory()
        NFS:setWorkingDirectory(love.filesystem.getSourceBaseDirectory())
        if os == "OS X" or os == "Linux" then
            local dir = love.filesystem.getSourceBaseDirectory()
            local old_cpath = package.cpath
            package.cpath = package.cpath .. ";" .. dir .. "/?.so"
            local success, _st = pcall(require, "luasteam")
            if success then
                st = _st
            else
                sendWarnMessage(_G, _st)
                st = {}
            end
            package.cpath = old_cpath
        else
            local success, _st = pcall(require, "luasteam")
            if success then
                st = _st
            else
                sendWarnMessage(_G, _st)
                st = {}
            end
        end
        st.send_control = {last_sent_time = -200, last_sent_stage = -1, force = false}
        if not (st.init and st:init()) then
            st = nil
        end
        NFS:setWorkingDirectory(cwd)
        G.STEAM = st
    else
    end
    love.mouse.setVisible(false)
end
love.quit = function()
    if G.SOUND_MANAGER then
        local ____opt_1 = G.SOUND_MANAGER.channel
        if ____opt_1 ~= nil then
            ____opt_1:push({type = "stop"})
        end
    end
    if G.STEAM then
        G.STEAM:shutdown()
    end
    return true
end
love.update = function(dt)
    timer_checkpoint(_G, nil, "update", true)
    G:update(dt)
end
love.draw = function()
    timer_checkpoint(_G, nil, "draw", true)
    G:draw()
end
love.keypressed = function(key)
    if not _RELEASE_MODE and G.keybind_mapping[key] then
        local ____opt_3 = love.gamepadpressed
        if ____opt_3 ~= nil then
            ____opt_3(G.CONTROLLER.keyboard_controller, G.keybind_mapping[key])
        end
    else
        G.CONTROLLER:set_HID_flags("mouse")
        G.CONTROLLER:key_press(key)
    end
end
love.keyreleased = function(key)
    if not _RELEASE_MODE and G.keybind_mapping[key] then
        local ____opt_5 = love.gamepadreleased
        if ____opt_5 ~= nil then
            ____opt_5(G.CONTROLLER.keyboard_controller, G.keybind_mapping[key])
        end
    else
        G.CONTROLLER:set_HID_flags("mouse")
        G.CONTROLLER:key_release(key)
    end
end
love.gamepadpressed = function(joystick, button)
    button = G.button_mapping[button] or button
    G.CONTROLLER:set_gamepad(joystick)
    G.CONTROLLER:set_HID_flags("button", button)
    G.CONTROLLER:button_press(button)
end
love.gamepadreleased = function(joystick, button)
    button = G.button_mapping[button] or button
    G.CONTROLLER:set_gamepad(joystick)
    G.CONTROLLER:set_HID_flags("button", button)
    G.CONTROLLER:button_release(button)
end
love.mousepressed = function(x, y, button, touch)
    G.CONTROLLER:set_HID_flags(touch and "touch" or "mouse")
    if button == 1 then
        G.CONTROLLER:queue_L_cursor_press(x, y)
    end
    if button == 2 then
        G.CONTROLLER:queue_R_cursor_press(x, y)
    end
end
love.mousereleased = function(x, y, button)
    if button == 1 then
        G.CONTROLLER:L_cursor_release(x, y)
    end
end
love.mousemoved = function(x, y, dx, dy, istouch)
    G.CONTROLLER.last_touch_time = G.CONTROLLER.last_touch_time or -1
    if ({next(love.touch.getTouches())}) ~= nil then
        G.CONTROLLER.last_touch_time = G.TIMERS.UPTIME
    end
    G.CONTROLLER:set_HID_flags(G.CONTROLLER.last_touch_time > G.TIMERS.UPTIME - 0.2 and "touch" or "mouse")
end
love.joystickaxis = function(joystick, axis, value)
    if math.abs(value) > 0.2 and joystick:isGamepad() then
        G.CONTROLLER:set_gamepad(joystick)
        G.CONTROLLER:set_HID_flags("axis")
    end
end
if false then
    if G.F_NO_ERROR_HAND then
        return
    end
    msg = tostring(msg)
    if G.SETTINGS.crashreports and _RELEASE_MODE and G.F_CRASH_REPORTS then
        local http_thread = love.thread.newThread("[\r\n\t\t\tlocal https = require('https')\r\n\t\t\tCHANNEL = love.thread.getChannel(\"http_channel\")\r\n\r\n\t\t\twhile true do\r\n\t\t\t\t--Monitor the channel for any new requests\r\n\t\t\t\tlocal request = CHANNEL:demand()\r\n\t\t\t\tif request then\r\n\t\t\t\t\thttps.request(request)\r\n\t\t\t\tend\r\n\t\t\tend\r\n\t\t]")
        local http_channel = love.thread.getChannel("http_channel")
        http_thread:start()
        local function httpencode(self, str)
            local function char_to_hex(self, c)
                return string.format(
                    "%%%02X",
                    string.byte(c)
                )
            end
            str = str:gsub("\\n", "\\r\\n"):gsub("([^%w _%%%-%.~])", char_to_hex):gsub(" ", "+")
            return str
        end
        local ____error = msg
        local file = string.sub(
            msg,
            0,
            {string.find(msg, ":")}
        )
        local function_line = string.sub(
            msg,
            string.len(file) + 1
        )
        function_line = string.sub(
            function_line,
            0,
            ({string.find(function_line, ":")}) - 1
        )
        file = string.sub(
            file,
            0,
            string.len(file) - 1
        )
        local trace = debug.traceback()
        local boot_found, func_found = false, false
        for l in string.gmatch(trace, "(.-)\\n") do
            if {string.match(l, "boot.lua")} then
                boot_found = true
            elseif boot_found and not func_found then
                func_found = true
                trace = ""
                function_line = string.sub(
                    l,
                    ({string.find(l, "in function")}) + 12
                ) .. " line:" .. function_line
            end
            if boot_found and func_found then
                trace = trace .. tostring(l) .. "\\n"
            end
        end
        http_channel:push("https://958ha8ong3.execute-api.us-east-2.amazonaws.com/?error=" .. tostring(httpencode(_G, ____error)) .. "&file=" .. tostring(httpencode(_G, file)) .. "&function_line=" .. tostring(httpencode(_G, function_line)) .. "&trace=" .. tostring(httpencode(_G, trace)) .. "&version=" .. G.VERSION)
    end
    if not love.window or not love.graphics or not love.event then
        return
    end
    if not love.graphics:isCreated() or not love.window.isOpen() then
        local success, status = pcall(love.window.setMode, 800, 600)
        if not success or not status then
            return
        end
    end
    if love.mouse then
        love.mouse.setVisible(true)
        love.mouse.setGrabbed(false)
        love.mouse.setRelativeMode(false)
    end
    if love.joystick then
        for i, v in ipairs(love.joystick.getJoysticks()) do
            v:setVibration()
        end
    end
    if love.audio then
        love.audio.stop()
    end
    love.graphics.reset()
    local font = love.graphics.setNewFont("resources/fonts/m6x11plus.ttf", 20)
    love.graphics.clear(G.C.BLACK)
    love.graphics.origin()
    local p = "Oops! Something went wrong:\\n" .. tostring(msg) .. "\\n\\n" .. (not _RELEASE_MODE and debug.traceback() or G.SETTINGS.crashreports and "Since you are opted in to sending crash reports, LocalThunk HQ was sent some useful info about what happened.\\nDon\\'t worry! There is no identifying or personal information. If you would like\\nto opt out, change the \\'Crash Report\\' setting to Off" or "Crash Reports are set to Off. If you would like to send crash reports, please opt in in the Game settings.\\nThese crash reports help us avoid issues like this in the future")
    local function draw(self)
        local pos = love.window.toPixels(70)
        love.graphics.push()
        love.graphics.clear(G.C.BLACK)
        love.graphics.setColor(1, 1, 1, 1)
        love.graphics.printf(
            p,
            font,
            pos,
            pos,
            love.graphics.getWidth() - pos
        )
        love.graphics.pop()
        love.graphics.present()
    end
    while true do
        love.event.pump()
        for e, a, b, c in love.event.poll() do
            if e == "quit" then
                return
            elseif e == "keypressed" and a == "escape" then
                return
            elseif e == "touchpressed" then
                local name = love.window.getTitle()
                if #name == 0 or name == "Untitled" then
                    name = "Game"
                end
                local buttons = {"OK", "Cancel"}
                local pressed = love.window.showMessageBox("Quit " .. name .. "?", "", buttons)
                if pressed == 1 then
                    return
                end
            end
        end
        draw(_G)
        if love.timer then
            love.timer.sleep(0.1)
        end
    end
end
love.resize = function(w, h)
    if w / h < 1 then
        h = w / 1
    end
    if w / h < G.window_prev.orig_ratio then
        G.TILESCALE = G.window_prev.orig_scale * w / G.window_prev.w
    else
        G.TILESCALE = G.window_prev.orig_scale * h / G.window_prev.h
    end
    if G.ROOM then
        G.ROOM.T.w = G.TILE_W
        G.ROOM.T.h = G.TILE_H
        G.ROOM_ATTACH.T.w = G.TILE_W
        G.ROOM_ATTACH.T.h = G.TILE_H
        if w / h < G.window_prev.orig_ratio then
            G.ROOM.T.x = G.ROOM_PADDING_W
            G.ROOM.T.y = (h / (G.TILESIZE * G.TILESCALE) - (G.ROOM.T.h + G.ROOM_PADDING_H)) / 2 + G.ROOM_PADDING_H / 2
        else
            G.ROOM.T.y = G.ROOM_PADDING_H
            G.ROOM.T.x = (w / (G.TILESIZE * G.TILESCALE) - (G.ROOM.T.w + G.ROOM_PADDING_W)) / 2 + G.ROOM_PADDING_W / 2
        end
        G.ROOM_ORIG = {x = G.ROOM.T.x, y = G.ROOM.T.y, r = G.ROOM.T.r}
        if G.buttons then
            G.buttons:recalculate()
        end
        if G.HUD then
            G.HUD:recalculate()
        end
    end
    G.WINDOWTRANS = {
        x = 0,
        y = 0,
        w = G.TILE_W + 2 * G.ROOM_PADDING_W,
        h = G.TILE_H + 2 * G.ROOM_PADDING_H,
        real_window_w = w,
        real_window_h = h
    }
    G.CANV_SCALE = 1
    if love.system.getOS() == "Windows" and false then
        local render_w, render_h = love.window.getDesktopDimensions(G.SETTINGS.WINDOW.selcted_display)
        local unscaled_dims = love.window.getFullscreenModes(G.SETTINGS.WINDOW.selcted_display)[2]
        local DPI_scale = math.floor((0.5 * unscaled_dims.width / render_w + 0.5 * unscaled_dims.height / render_h) * 500 + 0.5) / 500
        if DPI_scale > 1.1 then
            G.CANV_SCALE = 1.5
            G.AA_CANVAS = love.graphics.newCanvas(G.WINDOWTRANS.real_window_w * G.CANV_SCALE, G.WINDOWTRANS.real_window_h * G.CANV_SCALE, {type = "2d", readable = true})
            G.AA_CANVAS:setFilter("linear", "linear")
        else
            G.AA_CANVAS = nil
        end
    end
    G.CANVAS = love.graphics.newCanvas(w * G.CANV_SCALE, h * G.CANV_SCALE, {type = "2d", readable = true})
    G.CANVAS:setFilter("linear", "linear")
end
SMODS = {}
MODDED_VERSION = require("SMODS.version")
SMODS.id = "Steamodded"
SMODS.version = MODDED_VERSION:gsub("%-STEAMODDED", "")
SMODS.can_load = true
SMODS.meta_mod = true
SMODS.config_file = "config.lua"
nativefs = require("nativefs")
lovely = require("lovely")
json = require("json")
lovely_mod_dir = lovely.mod_dir:gsub("/$", "")
NFS = nativefs
NFS:setWorkingDirectory(lovely_mod_dir)
lovely_mod_dir = NFS:getWorkingDirectory()
NFS:setWorkingDirectory(love.filesystem.getSaveDirectory())
JSON = json
function set_mods_dir(self)
    local love_dirs = {
        love.filesystem.getSaveDirectory(),
        love.filesystem.getSourceBaseDirectory()
    }
    for _, love_dir in ipairs(love_dirs) do
        if lovely_mod_dir:sub(1, love_dir.length) == love_dir then
            SMODS.MODS_DIR = lovely_mod_dir:sub(love_dir.length + 2)
            NFS:setWorkingDirectory(love_dir)
            return
        end
    end
    SMODS.MODS_DIR = lovely_mod_dir
end
set_mods_dir(_G)
function find_this(self, directory, target_filename, target_line, depth)
    depth = depth or 1
    if depth > 3 then
        return
    end
    for _, filename in ipairs(NFS:getDirectoryItems(directory)) do
        local file_path = tostring(directory) .. "/" .. tostring(filename)
        local file_type = NFS:getInfo(file_path).type
        if file_type == "directory" or file_type == "symlink" then
            local f = find_this(
                _G,
                file_path,
                target_filename,
                target_line,
                depth + 1
            )
            if f then
                return f
            end
        elseif filename == target_filename then
            local first_line = NFS:read(file_path):match("^(.-)\\n")
            if first_line == target_line then
                return directory:match("^(.+/)")
            end
        end
    end
end
SMODS.path = find_this(_G, SMODS.MODS_DIR, "core.lua", "--- STEAMODDED CORE")
for _, path in ipairs({
    "src/ui.lua",
    "src/index.lua",
    "src/utils.lua",
    "src/overrides.lua",
    "src/game_object.lua",
    "src/logging.lua",
    "src/compat_0_9_8.lua",
    "src/loader.lua"
}) do
    ({assert({load(string.format(
        NFS:read(SMODS.path .. tostring(path)),
        "=[SMODS _ \"%s\"]",
        path
    ))})})(_G)
end
