///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

class SovereignContext {
    m_known_functions: LuaTable;
    m_user_known_functions: LuaTable;
    m_known_tables: LuaTable;
    m_user_known_tables: LuaTable;
    __G: typeof _G;
    _io: typeof io;
    _coroutine: typeof coroutine;
    _debug: typeof debug;
    _string: typeof string;
    _pairs: typeof pairs;
    _ipairs: typeof ipairs;
    _tostring: typeof tostring;
    _pcall: typeof pcall;
    _type: typeof type;
    _next: typeof next;
    _assert: typeof assert;
    _print: typeof print;
    _error: typeof error;
    _require: typeof require;
    table_concat: typeof table.concat;
    table_remove: typeof table.remove;
    table_insert: typeof table.insert;
    string_sub: typeof string.sub;
    string_format: typeof string.format;
    string_match: typeof string.match;
    string_gmatch: typeof string.gmatch;
    io_open: typeof io.open;
    io_close: typeof io.close;
    constructor(SOV?:any) {
        if (SOV && SOV instanceof SovereignContext) {
            this.load(SOV)
        }
    }
    save() {
        this.__G = _G;
        this._io = io;
        this.m_known_functions = {} as LuaTable;
        this.m_user_known_functions = {} as LuaTable;
        this.m_known_tables = {} as LuaTable;
        this.m_user_known_tables = {} as LuaTable;
        this._coroutine = coroutine;
        this._debug = debug;
        this._string = string;
        this._pairs = pairs;
        this._ipairs = ipairs;
        this._tostring = tostring;
        this._pcall = pcall;
        this._type = type;
        this._next = next;
        this._assert = assert;
        this._print = print;
        this._error = error;
        this._require = require;
        this.table_concat = table.concat;
        this.table_remove = table.remove;
        this.table_insert = table.insert;
        this.string_sub = string.sub;
        this.string_format = string.format;
        this.string_match = string.match;
        this.string_gmatch = string.gmatch;
        this.io_open = io.open
        this.io_close = io.close
    }
    load(SOV: SovereignContext) {
        this.__G = SOV.__G;
        this._io = SOV._io;
        this.m_known_functions = SOV.m_known_functions;
        this.m_user_known_functions = SOV.m_user_known_functions;
        this.m_known_tables = SOV.m_known_tables;
        this.m_user_known_tables = SOV.m_user_known_tables;
        this._coroutine = SOV._coroutine;
        this._debug = SOV._debug;
        this._string = SOV._string;
        this._pairs = SOV._pairs;
        this._ipairs = SOV._ipairs;
        this._tostring = SOV._tostring;
        this._pcall = SOV._pcall;
        this._type = SOV._type;
        this._next = SOV._next;
        this._assert = SOV._assert;
        this._print = SOV._print;
        this._error = SOV._error;
        this._require = SOV._require;
        this.table_concat = SOV.table_concat;
        this.table_remove = SOV.table_remove;
        this.table_insert = SOV.table_insert;
        this.string_sub = SOV.string_sub;
        this.string_format = SOV.string_format;
        this.string_match = SOV.string_match;
        this.string_gmatch = SOV.string_gmatch;
        this.io_open = SOV.io_open;
        this.io_close = SOV.io_close;
    }
}

class Dumper extends SovereignContext {
    lines: string[];
    dumping_same_thread: boolean;
    thread?: LuaThread;
    constructor(SOV?:SovereignContext|LuaThread,thread_or_nil?:LuaThread) {
        let thread: LuaThread|undefined = undefined
        super(SOV)
        if (SOV instanceof SovereignContext) {
            thread = thread_or_nil as LuaThread|undefined
        } else {
            thread = SOV as LuaThread|undefined
        }
        this.lines = [];
        this.dumping_same_thread = thread === this._coroutine.running();
        this.thread = thread;
    }
    ParseLine(line:string): string|LuaMultiReturn<string[]> {
        this._assert(this._type(line) === "string");
        let match = this.string_match(line,"^%s*function%s+(%w+)");
        if (match) {
            return match;
        }
        match = this.string_match(line,"^%s*local%s+function%s+(%w+)");
        if (match) {
            return match;
        }
        match = this.string_match(line,"^%s*local%s+(%w+)%s+=%s+function");
        if (match) {
            return match;
        }
        match = this.string_match(line,"%s*function%s*%(");
        if (match) {
            return "(anonymous)";
        }
        return "(anonymous)";
    }
    GuessFunctionName(info): string|LuaMultiReturn<string[]> {
        if (this._type(info.source) === "string" && this.string_sub(info.source,1, 1) === "@") {
            let [file, err] = this.io_open(this.string_sub(info.source,2), "r");
            if (!file) {
                this._print("file not found: " + this._tostring(err));
                return "?";
            }
            let line;
            for (let _ = 1; _ <= info.linedefined; _++) {
                line = file.read("*l");
            }
            if (!line) {
                this._print("line not found");
                return "?";
            }
            return this.ParseLine(line);
        }
        else if (this._type(info.source) === "string" && this.string_sub(info.source,1, 6) === "=[love") {
            return "(L\u00D6VE Function)";
        }
        else {
            let line;
            let lineNumber = 0;
            for (const [l] of this.string_gmatch(info.source, "([^\\n]+)\\n-")) {
                lineNumber = lineNumber + 1;
                if (lineNumber === info.linedefined) {
                    line = l;
                    break;
                }
            }
            if (!line) {
                this._print("line not found");
                return "?";
            }
            return this.ParseLine(line);
        }
    }
    safe_tostring(value): string {
        let [ok, err] = this._pcall(this._tostring, value);
        if (ok) {
            return err;
        }
        else {
            return this.string_format("<failed to get printable value>: '%s'",err);
        }
    }
    getinfo<T extends Function>(f:T|number,what:string) {
        if (this.thread && this._type(this.thread) === "thread") {
            if (this.dumping_same_thread && this._type(f) === "number") {
                f = (f as number) + 1
            }
            return this._debug.getinfo(this.thread,f as number,what)
        } else {
            return this._debug.getinfo(arguments[0],arguments[1],arguments[2])
        }
    }
    getlocal(f:any,what:any) {
        if (this.thread && this._type(this.thread) === "thread") {
            if (this.dumping_same_thread && this._type(f) === "number") {
                f = (f as number) + 1
            }
            return this._debug.getlocal(this.thread,f,what)
        } else {
            return this._debug.getlocal(arguments[0],arguments[1],arguments[2])
        }
    }
    add(text:string) {
        this.table_insert(this.lines,text);
    }
    add_f(fmt:string, ...args:any[]) {
        this.add(this.string_format(fmt,...args));
    }
    concat_lines() {
        return this.table_concat(this.lines);
    }
    DumpLocals(level:number) {
        let prefix = "\\t ";
        let i = 1;
        if (this.dumping_same_thread) {
            level = level + 1;
        }
        let [name, value] = this.getlocal(level, i);
        if (!name) {
            return;
        }
        this.add("\\tLocal variables:\\r\\n");
        while (name) {
            if (this._type(value) === "number") {
                this.add_f("%s%s = number: %g\\r\\n", prefix, name, value);
            }
            else if (this._type(value) === "boolean") {
                this.add_f("%s%s = boolean: %s\\r\\n", prefix, name, this._tostring(value));
            }
            else if (this._type(value) === "string") {
                this.add_f("%s%s = string: %q\\r\\n", prefix, name, value);
            }
            else if (this._type(value) === "userdata") {
                this.add_f("%s%s = %s\\r\\n", prefix, name, this.safe_tostring(value));
            }
            else if (this._type(value) === "nil") {
                this.add_f("%s%s = nil\\r\\n", prefix, name);
            }
            else if (this._type(value) === "table") {
                if (this.m_known_tables[value]) {
                    this.add_f("%s%s = %s\\r\\n", prefix, name, this.m_known_tables[value]);
                }
                else if (this.m_user_known_tables[value]) {
                    this.add_f("%s%s = %s\\r\\n", prefix, name, this.m_user_known_tables[value]);
                }
                else {
                    let txt = "{";
                    for (const [k, v] of this._pairs(value)) {
                        txt = txt + (this.safe_tostring(k) + (":" + this.safe_tostring(v)));
                        if (txt.length > _M.max_tb_output_len) {
                            txt = txt + " (more...)";
                            break;
                        }
                        if (this._next(value, k)) {
                            txt = txt + ", ";
                        }
                    }
                    this.add_f("%s%s = %s  %s\\r\\n", prefix, name, this.safe_tostring(value), txt + "}");
                }
            }
            else if (this._type(value) === "function") {
                let info = this.getinfo(value, "nS");
                if (!info) return;
                let fun_name = info.name || this.m_known_functions[value] || this.m_user_known_functions[value];
                if (info.what === "C") {
                    this.add_f("%s%s = C %s\\r\\n", prefix, name, fun_name && "function: " + fun_name || this._tostring(value));
                }
                else {
                    let source = info.short_src;
                    if (!source) return;
                    if (this.string_sub(source,2,7) === "string") {
                        source = this.string_sub(source,9);
                    }
                    fun_name = fun_name || this.GuessFunctionName(info) as string;
                    this.add_f("%s%s = Lua function '%s' (defined at line %d of chunk %s)\\r\\n", prefix, name, fun_name, info.linedefined, source);
                }
            }
            else if (this._type(value) === "thread") {
                this.add_f("%sthread %q = %s\\r\\n", prefix, name, this._tostring(value));
            }
            i = i + 1;
            [name, value] = this.getlocal(level, i);
        }
    }
}
class M extends SovereignContext {
    max_tb_output_len: number = 70;
    constructor(SOV: SovereignContext) {super(SOV)}
    ParseLine(line:string): string|LuaMultiReturn<string[]> {
        this._assert(this._type(line) === "string");
        let match = this.string_match(line,"^%s*function%s+(%w+)");
        if (match) {
            return match;
        }
        match = this.string_match(line,"^%s*local%s+function%s+(%w+)");
        if (match) {
            return match;
        }
        match = this.string_match(line,"^%s*local%s+(%w+)%s+=%s+function");
        if (match) {
            return match;
        }
        match = this.string_match(line,"%s*function%s*%(");
        if (match) {
            return "(anonymous)";
        }
        return "(anonymous)";
    }
    GuessFunctionName(info): string|LuaMultiReturn<string[]> {
        if (this._type(info.source) === "string" && this.string_sub(info.source,1, 1) === "@") {
            let [file, err] = this.io_open(this.string_sub(info.source,2), "r");
            if (!file) {
                this._print("file not found: " + this._tostring(err));
                return "?";
            }
            let line;
            for (let _ = 1; _ <= info.linedefined; _++) {
                line = file.read("*l");
            }
            if (!line) {
                this._print("line not found");
                return "?";
            }
            return this.ParseLine(line);
        }
        else if (this._type(info.source) === "string" && this.string_sub(info.source,1, 6) === "=[love") {
            return "(L\u00D6VE Function)";
        }
        else {
            let line;
            let lineNumber = 0;
            for (const [l] of this.string_gmatch(info.source, "([^\\n]+)\\n-")) {
                lineNumber = lineNumber + 1;
                if (lineNumber === info.linedefined) {
                    line = l;
                    break;
                }
            }
            if (!line) {
                this._print("line not found");
                return "?";
            }
            return this.ParseLine(line);
        }
    }
    safe_tostring(value): string {
        let [ok, err] = this._pcall(this._tostring, value);
        if (ok) {
            return err;
        }
        else {
            return this.string_format("<failed to get printable value>: '%s'",err);
        }
    }
    stacktrace(thread_or_message?:LuaThread|string,message_or_level?:string|number,level?:number) {
        let thread: LuaThread|undefined = undefined
        let message: string|undefined = undefined
        if (this._type(thread) !== "thread") {
            [thread, message, level] = [undefined, thread_or_message as string, message_or_level as number];
        } else {
            [thread, message, level] = [thread_or_message as LuaThread, thread_or_message as string, level as number];
        }
        thread = thread || this._coroutine.running();
        level = level || 1;
        let dumper = new Dumper(thread);
        dumper._coroutine = this._coroutine
        dumper._debug = this._debug
        dumper._string = this._string
        dumper._pairs = this._pairs
        dumper._tostring = this._tostring
        dumper._pcall = this._pcall
        dumper._type = this._type
        dumper._next = this._next
        dumper._assert = this._assert;
        dumper._print = this._print;
        dumper.table_concat = this.table_concat
        dumper.table_insert = this.table_insert
        dumper.string_sub = this.string_sub
        dumper.string_format = this.string_format
        dumper.string_match = this.string_match
        dumper.string_gmatch = this.string_gmatch
        let original_error;
        if (this._type(message) === "table") {
            dumper.add("an error object {\\r\\n");
            let first = true;
            for (const [k, v] of this._pairs(message)) {
                if (first) {
                    dumper.add("  ");
                    first = false;
                }
                else {
                    dumper.add(",\\r\\n  ");
                }
                dumper.add(this.safe_tostring(k));
                dumper.add(": ");
                dumper.add(this.safe_tostring(v));
            }
            dumper.add("\\r\\n}");
            original_error = dumper.concat_lines();
        }
        else if (this._type(message) === "string") {
            dumper.add(message);
            original_error = message;
        }
        dumper.add("\\r\\n");
        dumper.add("[\r\nStack Traceback\r\n===============\r\n]");
        let level_to_show = level;
        if (dumper.dumping_same_thread) {
            level = level + 1;
        }
        let info = dumper.getinfo(level, "nSlf");
        while (info) {
            if (info.what === "main") {
                if (!info.source) {return}
                if (this.string_sub(info.source, 1, 1) === "@") {
                    dumper.add_f("(%d) main chunk of file '%s' at line %d\\r\\n", level_to_show, this.string_sub(info.source, 2), info.currentline);
                }
                else if (info.source && this.string_sub(info.source,1, 1) === "=") {
                    let str = this.string_sub(info.source,3, -2);
                    let props = [];
                    for (const [v] of this.string_gmatch(str, "[^%s]+")) {
                        this.table_insert(props, v);
                    }
                    let source = this.table_remove(props, 1);
                    if (source === "love") {
                        dumper.add_f("(%d) main chunk of L\u00D6VE file '%s' at line %d\\r\\n", level_to_show, this.string_sub(this.table_concat(props, " "),2, -2), info.currentline);
                    }
                    else if (source === "SMODS") {
                        let modID = this.table_remove(props, 1);
                        let fileName = this.table_concat(props, " ");
                        if (modID === "_") {
                            dumper.add_f("(%d) main chunk of Steamodded file '%s' at line %d\\r\\n", level_to_show, this.string_sub(fileName,2, -2), info.currentline);
                        }
                        else {
                            dumper.add_f("(%d) main chunk of file '%s' at line %d (from mod with id %s)\\r\\n", level_to_show, this.string_sub(fileName,2, -2), info.currentline, modID);
                        }
                    }
                    else if (source === "lovely") {
                        let module = this.table_remove(props, 1);
                        let fileName = this.table_concat(props, " ");
                        dumper.add_f("(%d) main chunk of file '%s' at line %d (from lovely module %s)\\r\\n", level_to_show, this.string_sub(fileName,2, -2), info.currentline, module);
                    }
                    else {
                        dumper.add_f("(%d) main chunk of %s at line %d\\r\\n", level_to_show, info.source, info.currentline);
                    }
                }
                else {
                    dumper.add_f("(%d) main chunk of %s at line %d\\r\\n", level_to_show, info.source, info.currentline);
                }
            }
            else if (info.what === "C") {
                let function_name = this.m_user_known_functions[info.func] || this.m_known_functions[info.func] || info.name || this._tostring(info.func);
                dumper.add_f("(%d) %s C function '%s'\\r\\n", level_to_show, info.namewhat, function_name);
            }
            else if (info.what === "tail") {
                dumper.add_f("(%d) tail call\\r\\n", level_to_show);
                dumper.DumpLocals(level);
            }
            else if (info.what === "Lua") {
                let source = info.short_src;
                let function_name = this.m_user_known_functions[info.func] || this.m_known_functions[info.func] || info.name;
                if (!source) {return}
                if (this.string_sub(source,2, 7) === "string") {
                    source = this.string_sub(source,9);
                }
                let was_guessed = false;
                if (!function_name || function_name === "?") {
                    function_name = this.GuessFunctionName(info) as string;
                    was_guessed = true;
                }
                let function_type = info.namewhat === "" && "function" || info.namewhat;
                if (info.source && this.string_sub(info.source,1, 1) === "@") {
                    dumper.add_f("(%d) Lua %s '%s' at file '%s:%d'%s\\r\\n", level_to_show, function_type, function_name, this.string_sub(info.source,2), info.currentline, was_guessed && " (best guess)" || "");
                }
                else if (info.source && this.string_sub(info.source,1, 1) === "#") {
                    dumper.add_f("(%d) Lua %s '%s' at template '%s:%d'%s\\r\\n", level_to_show, function_type, function_name, this.string_sub(info.source,2), info.currentline, was_guessed && " (best guess)" || "");
                }
                else if (info.source && this.string_sub(info.source,1, 1) === "=") {
                    let str = this.string_sub(info.source,3, -2);
                    let props = [];
                    for (const [v] of this.string_gmatch(str, "[^%s]+")) {
                        this.table_insert(props, v);
                    }
                    let source = this.table_remove(props, 1);
                    if (source === "love") {
                        dumper.add_f("(%d) L\u00D6VE %s at file '%s:%d'%s\\r\\n", level_to_show, function_type, this.string_sub(this.table_concat(props, " "),2, -2), info.currentline, was_guessed && " (best guess)" || "");
                    }
                    else if (source === "SMODS") {
                        let modID = this.table_remove(props, 1);
                        let fileName = this.table_concat(props, " ");
                        if (modID === "_") {
                            dumper.add_f("(%d) Lua %s '%s' at Steamodded file '%s:%d' %s\\r\\n", level_to_show, function_type, function_name, this.string_sub(fileName,2, -2), info.currentline, was_guessed && " (best guess)" || "");
                        }
                        else {
                            dumper.add_f("(%d) Lua %s '%s' at file '%s:%d' (from mod with id %s)%s\\r\\n", level_to_show, function_type, function_name, this.string_sub(fileName,2, -2), info.currentline, modID, was_guessed && " (best guess)" || "");
                        }
                    }
                    else if (source === "lovely") {
                        let module = this.table_remove(props, 1);
                        let fileName = this.table_concat(props, " ");
                        dumper.add_f("(%d) Lua %s '%s' at file '%s:%d' (from lovely module %s)%s\\r\\n", level_to_show, function_type, function_name, this.string_sub(fileName,2, -2), info.currentline, module, was_guessed && " (best guess)" || "");
                    }
                    else {
                        dumper.add_f("(%d) Lua %s '%s' at line %d of chunk '%s'\\r\\n", level_to_show, function_type, function_name, info.currentline, source);
                    }
                }
                else {
                    dumper.add_f("(%d) Lua %s '%s' at line %d of chunk '%s'\\r\\n", level_to_show, function_type, function_name, info.currentline, source);
                }
                dumper.DumpLocals(level);
            }
            else {
                dumper.add_f("(%d) unknown frame %s\\r\\n", level_to_show, info.what);
            }
            level = level + 1;
            level_to_show = level_to_show + 1;
            info = dumper.getinfo(level, "nSlf");
        }
        return [dumper.concat_lines(), original_error];
    }
    add_known_table(tab: string, description: string) {
        if (this.m_known_tables[tab]) {
            this._error("Cannot override an already known table");
        }
        this.m_user_known_tables[tab] = description;
    };
    add_known_function(fun: string, description: string) {
        if (this.m_known_functions[fun]) {
            this._error("Cannot override an already known function");
        }
        this.m_user_known_functions[fun] = description;
    };
}

function loadStackTracePlus(): M {
    const SOV = new SovereignContext()
    SOV.save()
    SOV._assert(SOV._debug, "debug table must be available at this point");
    SOV.m_known_tables = { [SOV.__G as any]: "_G (global table)" } as unknown as LuaTable;
    function add_known_module(name, desc): void {
        let [ok, mod] = SOV._pcall(SOV._require, name);
        if (ok) {
            SOV.m_known_tables[mod] = desc;
        }
    }
    add_known_module("string", "string module");
    add_known_module("io", "io module");
    add_known_module("os", "os module");
    add_known_module("table", "table module");
    add_known_module("math", "math module");
    add_known_module("package", "package module");
    add_known_module("debug", "debug module");
    add_known_module("coroutine", "coroutine module");
    add_known_module("bit32", "bit32 module");
    add_known_module("bit", "bit module");
    add_known_module("jit", "jit module");
    if (_VERSION >= "Lua 5.3") {
        add_known_module("utf8", "utf8 module");
    }
    SOV.m_user_known_tables = {} as LuaTable;
    SOV.m_known_functions = {} as LuaTable;
    for (const [_, name] of SOV._ipairs(["assert", "collectgarbage", "dofile", "error", "getmetatable", "ipairs", "load", "loadfile", "next", "pairs", "pcall", "print", "rawequal", "rawget", "rawlen", "rawset", "require", "select", "setmetatable", "tonumber", "tostring", "type", "xpcall", "gcinfo", "getfenv", "loadstring", "module", "newproxy", "setfenv", "unpack"])) {
        if (SOV.__G[name]) {
            SOV.m_known_functions[SOV.__G[name]] = name;
        }
    }
    SOV.m_user_known_functions = {} as LuaTable;
    let _M = new M(SOV)
    return _M;
}
let stackTraceAlreadyInjected = false;
function getDebugInfoForCrash(): void {
    let version = VERSION;
    if (!version || type(version) !== "string") {
        let [versionFile,_] = love.filesystem.read("version.jkr");
        if (versionFile) {
            version = versionFile.match("[^\\n]*") + " (best guess)";
        }
        else {
            version = "???";
        }
    }
    let modded_version = MODDED_VERSION;
    if (!modded_version || type(modded_version) !== "string") {
        let [moddedSuccess, reqVersion] = pcall(require, "SMODS.version");
        if (moddedSuccess && type(reqVersion) === "string") {
            modded_version = reqVersion;
        }
        else {
            modded_version = "???";
        }
    }
    let info = "Additional Context:\\nBalatro Version: " + (version + ("\\nModded Version: " + modded_version));
    let [major, minor, revision, codename] = love.getVersion();
    info = info + string.format("\\nL\u00D6VE Version: %d.%d.%d", major, minor, revision);
    let [lovely_success, lovely] = pcall(require, "lovely");
    if (lovely_success) {
        info = info + ("\\nLovely Version: " + lovely.version);
    }
    info = info + ("\\nPlatform: " + (love.system.getOS() || "???"));
    if (SMODS && SMODS.Mods) {
        let mod_strings = "";
        let lovely_strings = "";
        let i = 1;
        let lovely_i = 1;
        for (const [_, v] of pairs(SMODS.Mods)) {
            if (v.can_load && (!v.meta_mod || v.lovely_only) || v.lovely && !v.can_load && !v.disabled) {
                if (v.lovely_only || v.lovely && !v.can_load) {
                    lovely_strings = lovely_strings + ("\\n    " + (lovely_i + (": " + v.name)));
                    lovely_i = lovely_i + 1;
                    if (!v.can_load) {
                        lovely_strings = lovely_strings + "\\n        Has Steamodded mod that failed to load.";
                        if (v.load_issues.dependencies.length > 0) {
                            lovely_strings = lovely_strings + "\\n        Missing Dependencies:";
                            for (const [k, v] of ipairs(v.load_issues.dependencies)) {
                                lovely_strings = lovely_strings + ("\\n            " + (k + (". " + v)));
                            }
                        }
                        if (v.load_issues.conflicts.length > 0) {
                            lovely_strings = lovely_strings + "\\n        Conflicts:";
                            for (const [k, v] of ipairs(v.load_issues.conflicts)) {
                                lovely_strings = lovely_strings + ("\\n            " + (k + (". " + v)));
                            }
                        }
                        if (v.load_issues.outdated) {
                            lovely_strings = lovely_strings + "\\n        Outdated Mod.";
                        }
                        if (v.load_issues.main_file_not_found) {
                            lovely_strings = lovely_strings + ("\\n        Main file not found. (" + (v.main_file + ")"));
                        }
                    }
                }
                else {
                    mod_strings = mod_strings + ("\\n    " + (i + (": " + (v.name + (" by " + (table.concat(v.author, ", ") + (" [ID: " + (v.id + ((v.priority !== 0 && ", Priority: " + v.priority || "") + ((v.version && v.version !== "0.0.0" && ", Version: " + v.version || "") + ((v.lovely && ", Uses Lovely" || "") + "]")))))))))));
                    i = i + 1;
                    let debugInfo = v.debug_info;
                    if (debugInfo) {
                        if (type(debugInfo) === "string") {
                            if (debugInfo.length !== 0) {
                                mod_strings = mod_strings + ("\\n        " + debugInfo);
                            }
                        }
                        else if (type(debugInfo) === "table") {
                            for (const [kk, vv] of pairs(debugInfo)) {
                                if (type(vv) !== "nil") {
                                    vv = tostring(vv);
                                }
                                if (vv.length !== 0) {
                                    mod_strings = mod_strings + ("\\n        " + (kk + (": " + vv)));
                                }
                            }
                        }
                    }
                }
            }
        }
        info = info + ("\\nSteamodded Mods:" + (mod_strings + ("\\nLovely Mods:" + lovely_strings)));
    }
    return info;
}
function injectStackTrace(): void {
    if (stackTraceAlreadyInjected) {
        return;
    }
    stackTraceAlreadyInjected = true;
    let STP = loadStackTracePlus();
    let utf8 = require("utf8");
    love.errorhandler = function (msg) {
        msg = tostring(msg);
        if (!sendErrorMessage) {
            function sendErrorMessage(msg): void {
                print(msg);
            }
        }
        if (!sendInfoMessage) {
            function sendInfoMessage(msg): void {
                print(msg);
            }
        }
        sendErrorMessage("Oops! The game crashed\\n" + STP.stacktrace(msg), "StackTrace");
        if (!love.window || !love.graphics || !love.event) {
            return;
        }
        if (!love.graphics.isCreated() || !love.window.isOpen()) {
            let [success, status] = pcall(love.window.setMode, 800, 600);
            if (!success || !status) {
                return;
            }
        }
        if (love.mouse) {
            love.mouse.setVisible(true);
            love.mouse.setGrabbed(false);
            love.mouse.setRelativeMode(false);
            if (love.mouse.isCursorSupported()) {
                love.mouse.setCursor();
            }
        }
        if (love.joystick) {
            for (const [i, v] of ipairs(love.joystick.getJoysticks())) {
                v.setVibration();
            }
        }
        if (love.audio) {
            love.audio.stop();
        }
        love.graphics.reset();
        let font = love.graphics.setNewFont("resources/fonts/m6x11plus.ttf", 20);
        let background = [0, 0, 1];
        if (G && G.C && G.C.BLACK) {
            background = G.C.BLACK;
        }
        love.graphics.clear(background);
        love.graphics.origin();
        let trace = STP.stacktrace("", 3);
        let sanitizedmsg = {};
        for (const [char] of msg.gmatch(utf8.charpattern)) {
            table.insert(sanitizedmsg, char);
        }
        sanitizedmsg = table.concat(sanitizedmsg);
        let err = {};
        table.insert(err, "Oops! The game crashed:");
        if (sanitizedmsg.find("Syntax error: game.lua:4: '=' expected near 'Game'")) {
            table.insert(err, "Duplicate installation of Steamodded detected! Please clean your installation: Steam Library > Balatro > Properties > Installed Files > Verify integrity of game files.");
        }
        else {
            table.insert(err, sanitizedmsg);
        }
        if (sanitizedmsg.length !== msg.length) {
            table.insert(err, "Invalid UTF-8 string in error message.");
        }
        let [success, msg] = pcall(getDebugInfoForCrash);
        if (success && msg) {
            table.insert(err, "\\n" + msg);
            sendInfoMessage(msg, "StackTrace");
        }
        else {
            table.insert(err, "\\n" + "Failed to get additional context :/");
            sendErrorMessage("Failed to get additional context :/\\n" + msg, "StackTrace");
        }
        for (const [l] of trace.gmatch("(.-)\\n")) {
            table.insert(err, l);
        }
        let p = table.concat(err, "\\n");
        p = p.gsub("\\t", "");
        p = p.gsub("%[string \\\"(.-)\\\"%]", "%1");
        let scrollOffset = 0;
        let endHeight = 0;
        love.keyboard.setKeyRepeat(true);
        function scrollDown(amt): void {
            if (amt === undefined) {
                amt = 18;
            }
            scrollOffset = scrollOffset + amt;
            if (scrollOffset > endHeight) {
                scrollOffset = endHeight;
            }
        }
        function scrollUp(amt): void {
            if (amt === undefined) {
                amt = 18;
            }
            scrollOffset = scrollOffset - amt;
            if (scrollOffset < 0) {
                scrollOffset = 0;
            }
        }
        let pos = 70;
        let arrowSize = 20;
        function calcEndHeight(): void {
            let font = love.graphics.getFont();
            let [rw, lines] = font.getWrap(p, love.graphics.getWidth() - pos * 2);
            let lineHeight = font.getHeight();
            let atBottom = scrollOffset === endHeight && scrollOffset !== 0;
            endHeight = lines.length * lineHeight - love.graphics.getHeight() + pos * 2;
            if (endHeight < 0) {
                endHeight = 0;
            }
            if (scrollOffset > endHeight || atBottom) {
                scrollOffset = endHeight;
            }
        }
        function draw(): void {
            if (!love.graphics.isActive()) {
                return;
            }
            love.graphics.clear(background);
            calcEndHeight();
            love.graphics.printf(p, pos, pos - scrollOffset, love.graphics.getWidth() - pos * 2);
            if (scrollOffset !== endHeight) {
                love.graphics.polygon("fill", love.graphics.getWidth() - pos / 2, love.graphics.getHeight() - arrowSize, love.graphics.getWidth() - pos / 2 + arrowSize, love.graphics.getHeight() - arrowSize * 2, love.graphics.getWidth() - pos / 2 - arrowSize, love.graphics.getHeight() - arrowSize * 2);
            }
            if (scrollOffset !== 0) {
                love.graphics.polygon("fill", love.graphics.getWidth() - pos / 2, arrowSize, love.graphics.getWidth() - pos / 2 + arrowSize, arrowSize * 2, love.graphics.getWidth() - pos / 2 - arrowSize, arrowSize * 2);
            }
            love.graphics.present();
        }
        let fullErrorText = p;
        function copyToClipboard(): void {
            if (!love.system) {
                return;
            }
            love.system.setClipboardText(fullErrorText);
            p = p + "\\nCopied to clipboard!";
        }
        p = p + "\\n\\nPress ESC to exit\\nPress R to restart the game";
        if (love.system) {
            p = p + "\\nPress Ctrl+C or tap to copy this error";
        }
        if (G) {
            if (G.SOUND_MANAGER && G.SOUND_MANAGER.channel) {
                G.SOUND_MANAGER.channel.push({ type: "kill" });
            }
            if (G.SAVE_MANAGER && G.SAVE_MANAGER.channel) {
                G.SAVE_MANAGER.channel.push({ type: "kill" });
            }
            if (G.HTTP_MANAGER && G.HTTP_MANAGER.channel) {
                G.HTTP_MANAGER.channel.push({ type: "kill" });
            }
        }
        return function () {
            love.event.pump();
            for (const [e, a, b, c] of love.event.poll()) {
                if (e === "quit") {
                    return 1;
                }
                else if (e === "keypressed" && a === "escape") {
                    return 1;
                }
                else if (e === "keypressed" && a === "c" && love.keyboard.isDown("lctrl", "rctrl")) {
                    copyToClipboard();
                }
                else if (e === "keypressed" && a === "r") {
                    SMODS.restart_game();
                }
                else if (e === "keypressed" && a === "down") {
                    scrollDown();
                }
                else if (e === "keypressed" && a === "up") {
                    scrollUp();
                }
                else if (e === "keypressed" && a === "pagedown") {
                    scrollDown(love.graphics.getHeight());
                }
                else if (e === "keypressed" && a === "pageup") {
                    scrollUp(love.graphics.getHeight());
                }
                else if (e === "keypressed" && a === "home") {
                    scrollOffset = 0;
                }
                else if (e === "keypressed" && a === "end") {
                    scrollOffset = endHeight;
                }
                else if (e === "wheelmoved") {
                    scrollUp(b * 20);
                }
                else if (e === "gamepadpressed" && b === "dpdown") {
                    scrollDown();
                }
                else if (e === "gamepadpressed" && b === "dpup") {
                    scrollUp();
                }
                else if (e === "gamepadpressed" && b === "a") {
                    return "restart";
                }
                else if (e === "gamepadpressed" && b === "x") {
                    copyToClipboard();
                }
                else if (e === "gamepadpressed" && (b === "b" || b === "back" || b === "start")) {
                    return 1;
                }
                else if (e === "touchpressed") {
                    let name = love.window.getTitle();
                    if (name.length === 0 || name === "Untitled") {
                        name = "Game";
                    }
                    let buttons = ["OK", "Cancel", "Restart"];
                    if (love.system) {
                        buttons[4] = "Copy to clipboard";
                    }
                    let pressed = love.window.showMessageBox("Quit " + (name + "?"), "", buttons);
                    if (pressed === 1) {
                        return 1;
                    }
                    else if (pressed === 3) {
                        return "restart";
                    }
                    else if (pressed === 4) {
                        copyToClipboard();
                    }
                }
            }
            draw();
            if (love.timer) {
                love.timer.sleep(0.1);
            }
        };
    };
}
injectStackTrace();
if (love.system.getOS() === "OS X" && (jit.arch === "arm64" || jit.arch === "arm")) {
    jit.off();
}
require("engine/object");
require("bit");
require("engine/string_packer");
require("engine/controller");
require("back");
require("tag");
require("engine/event");
require("engine/node");
require("engine/moveable");
require("engine/sprite");
require("engine/animatedsprite");
require("functions/misc_functions");
require("game");
require("globals");
require("engine/ui");
require("functions/UI_definitions");
require("functions/state_events");
require("functions/common_events");
require("functions/button_callbacks");
require("functions/misc_functions");
require("functions/test_functions");
require("card");
require("cardarea");
require("blind");
require("card_character");
require("engine/particles");
require("engine/text");
require("challenges");
math.randomseed(G.SEED);
love.run = function () {
    if (love.load) {
        love.load(love.arg.parseGameArguments(arg), arg);
    }
    if (love.timer) {
        love.timer.step();
    }
    let dt = 0;
    let dt_smooth = 1 / 100;
    let run_time = 0;
    return function () {
        run_time = love.timer.getTime();
        if (love.event && G && G.CONTROLLER) {
            love.event.pump();
            let [_n, _a, _b, _c, _d, _e, _f, touched];
            for (const [name, a, b, c, d, e, f] of love.event.poll()) {
                if (name === "quit") {
                    if (!love.quit || !love.quit()) {
                        return a || 0;
                    }
                }
                if (name === "touchpressed") {
                    touched = true;
                }
                else if (name === "mousepressed") {
                    [_n, _a, _b, _c, _d, _e, _f] = [name, a, b, c, d, e, f];
                }
                else {
                    love.handlers[name](a, b, c, d, e, f);
                }
            }
            if (_n) {
                love.handlers["mousepressed"](_a, _b, _c, touched);
            }
        }
        if (love.timer) {
            dt = love.timer.step();
        }
        dt_smooth = math.min(0.8 * dt_smooth + 0.2 * dt, 0.1);
        if (love.update) {
            love.update(dt_smooth);
        }
        if (love.graphics && love.graphics.isActive()) {
            if (love.draw) {
                love.draw();
            }
            love.graphics.present();
        }
        run_time = math.min(love.timer.getTime() - run_time, 0.1);
        G.FPS_CAP = G.FPS_CAP || 500;
        if (run_time < 1 / G.FPS_CAP) {
            love.timer.sleep(1 / G.FPS_CAP - run_time);
        }
    };
};
love.load = function () {
    G.start_up();
    let os = love.system.getOS();
    if (os === "OS X" || os === "Windows" || os === "Linux") {
        let st = undefined;
        let cwd = NFS.getWorkingDirectory();
        NFS.setWorkingDirectory(love.filesystem.getSourceBaseDirectory());
        if (os === "OS X" || os === "Linux") {
            let dir = love.filesystem.getSourceBaseDirectory();
            let old_cpath = package.cpath;
            package.cpath = package.cpath + (";" + (dir + "/?.so"));
            let [success, _st] = pcall(require, "luasteam");
            if (success) {
                st = _st;
            }
            else {
                sendWarnMessage(_st);
                st = {};
            }
            package.cpath = old_cpath;
        }
        else {
            let [success, _st] = pcall(require, "luasteam");
            if (success) {
                st = _st;
            }
            else {
                sendWarnMessage(_st);
                st = {};
            }
        }
        st.send_control = { last_sent_time: -200, last_sent_stage: -1, force: false };
        if (!(st.init && st.init())) {
            st = undefined;
        }
        NFS.setWorkingDirectory(cwd);
        G.STEAM = st;
    }
    else { }
    love.mouse.setVisible(false);
};
love.quit = function (): boolean {
    if (G.SOUND_MANAGER) {
        G.SOUND_MANAGER.channel?.push({ type: "stop" });
    }
    if (G.STEAM) {
        G.STEAM.shutdown();
    }
    return true;
};
love.update = function (dt) {
    timer_checkpoint(undefined, "update", true);
    G.update(dt);
};
love.draw = function () {
    timer_checkpoint(undefined, "draw", true);
    G.draw();
};
love.keypressed = function (key) {
    if (!_RELEASE_MODE && G.keybind_mapping[key]) {
        love.gamepadpressed?.(G.CONTROLLER.keyboard_controller, G.keybind_mapping[key]);
    }
    else {
        G.CONTROLLER.set_HID_flags("mouse");
        G.CONTROLLER.key_press(key);
    }
};
love.keyreleased = function (key) {
    if (!_RELEASE_MODE && G.keybind_mapping[key]) {
        love.gamepadreleased?.(G.CONTROLLER.keyboard_controller, G.keybind_mapping[key]);
    }
    else {
        G.CONTROLLER.set_HID_flags("mouse");
        G.CONTROLLER.key_release(key);
    }
};
love.gamepadpressed = function (joystick, button) {
    button = G.button_mapping[button] || button;
    G.CONTROLLER.set_gamepad(joystick);
    G.CONTROLLER.set_HID_flags("button", button);
    G.CONTROLLER.button_press(button);
};
love.gamepadreleased = function (joystick, button) {
    button = G.button_mapping[button] || button;
    G.CONTROLLER.set_gamepad(joystick);
    G.CONTROLLER.set_HID_flags("button", button);
    G.CONTROLLER.button_release(button);
};
love.mousepressed = function (x, y, button, touch) {
    G.CONTROLLER.set_HID_flags(touch && "touch" || "mouse");
    if (button === 1) {
        G.CONTROLLER.queue_L_cursor_press(x, y);
    }
    if (button === 2) {
        G.CONTROLLER.queue_R_cursor_press(x, y);
    }
};
love.mousereleased = function (x, y, button) {
    if (button === 1) {
        G.CONTROLLER.L_cursor_release(x, y);
    }
};
love.mousemoved = function (x, y, dx, dy, istouch) {
    G.CONTROLLER.last_touch_time = G.CONTROLLER.last_touch_time || -1;
    if (next(love.touch.getTouches()) !== undefined) {
        G.CONTROLLER.last_touch_time = G.TIMERS.UPTIME;
    }
    G.CONTROLLER.set_HID_flags(G.CONTROLLER.last_touch_time > G.TIMERS.UPTIME - 0.2 && "touch" || "mouse");
};
love.joystickaxis = function (joystick, axis, value) {
    if (math.abs(value) > 0.2 && joystick.isGamepad()) {
        G.CONTROLLER.set_gamepad(joystick);
        G.CONTROLLER.set_HID_flags("axis");
    }
};
if (false) {
    if (G.F_NO_ERROR_HAND) {
        return;
    }
    msg = tostring(msg);
    if (G.SETTINGS.crashreports && _RELEASE_MODE && G.F_CRASH_REPORTS) {
        let http_thread = love.thread.newThread("[\r\n\t\t\tlocal https = require('https')\r\n\t\t\tCHANNEL = love.thread.getChannel(\"http_channel\")\r\n\r\n\t\t\twhile true do\r\n\t\t\t\t--Monitor the channel for any new requests\r\n\t\t\t\tlocal request = CHANNEL:demand()\r\n\t\t\t\tif request then\r\n\t\t\t\t\thttps.request(request)\r\n\t\t\t\tend\r\n\t\t\tend\r\n\t\t]");
        let http_channel = love.thread.getChannel("http_channel");
        http_thread.start();
        let httpencode = function (str) {
            let char_to_hex = function (c) {
                return string.format("%%%02X", string.byte(c));
            };
            str = str.gsub("\\n", "\\r\\n").gsub("([^%w _%%%-%.~])", char_to_hex).gsub(" ", "+");
            return str;
        };
        let error = msg;
        let file = string.sub(msg, 0, string.find(msg, ":"));
        let function_line = string.sub(msg, string.len(file) + 1);
        function_line = string.sub(function_line, 0, string.find(function_line, ":") - 1);
        file = string.sub(file, 0, string.len(file) - 1);
        let trace = debug.traceback();
        let [boot_found, func_found] = [false, false];
        for (const [l] of string.gmatch(trace, "(.-)\\n")) {
            if (string.match(l, "boot.lua")) {
                boot_found = true;
            }
            else if (boot_found && !func_found) {
                func_found = true;
                trace = "";
                function_line = string.sub(l, string.find(l, "in function") + 12) + (" line:" + function_line);
            }
            if (boot_found && func_found) {
                trace = trace + (l + "\\n");
            }
        }
        http_channel.push("https://958ha8ong3.execute-api.us-east-2.amazonaws.com/?error=" + (httpencode(error) + ("&file=" + (httpencode(file) + ("&function_line=" + (httpencode(function_line) + ("&trace=" + (httpencode(trace) + ("&version=" + G.VERSION)))))))));
    }
    if (!love.window || !love.graphics || !love.event) {
        return;
    }
    if (!love.graphics.isCreated() || !love.window.isOpen()) {
        let [success, status] = pcall(love.window.setMode, 800, 600);
        if (!success || !status) {
            return;
        }
    }
    if (love.mouse) {
        love.mouse.setVisible(true);
        love.mouse.setGrabbed(false);
        love.mouse.setRelativeMode(false);
    }
    if (love.joystick) {
        for (const [i, v] of ipairs(love.joystick.getJoysticks())) {
            v.setVibration();
        }
    }
    if (love.audio) {
        love.audio.stop();
    }
    love.graphics.reset();
    let font = love.graphics.setNewFont("resources/fonts/m6x11plus.ttf", 20);
    love.graphics.clear(G.C.BLACK);
    love.graphics.origin();
    let p = "Oops! Something went wrong:\\n" + (msg + ("\\n\\n" + (!_RELEASE_MODE && debug.traceback() || G.SETTINGS.crashreports && "Since you are opted in to sending crash reports, LocalThunk HQ was sent some useful info about what happened.\\nDon\\'t worry! There is no identifying or personal information. If you would like\\nto opt out, change the \\'Crash Report\\' setting to Off" || "Crash Reports are set to Off. If you would like to send crash reports, please opt in in the Game settings.\\nThese crash reports help us avoid issues like this in the future")));
    function draw(): void {
        let pos = love.window.toPixels(70);
        love.graphics.push();
        love.graphics.clear(G.C.BLACK);
        love.graphics.setColor(1, 1, 1, 1);
        love.graphics.printf(p, font, pos, pos, love.graphics.getWidth() - pos);
        love.graphics.pop();
        love.graphics.present();
    }
    while (true) {
        love.event.pump();
        for (const [e, a, b, c] of love.event.poll()) {
            if (e === "quit") {
                return;
            }
            else if (e === "keypressed" && a === "escape") {
                return;
            }
            else if (e === "touchpressed") {
                let name = love.window.getTitle();
                if (name.length === 0 || name === "Untitled") {
                    name = "Game";
                }
                let buttons = ["OK", "Cancel"];
                let pressed = love.window.showMessageBox("Quit " + (name + "?"), "", buttons);
                if (pressed === 1) {
                    return;
                }
            }
        }
        draw();
        if (love.timer) {
            love.timer.sleep(0.1);
        }
    }
}
love.resize = function (w, h) {
    if (w / h < 1) {
        h = w / 1;
    }
    if (w / h < G.window_prev.orig_ratio) {
        G.TILESCALE = G.window_prev.orig_scale * w / G.window_prev.w;
    }
    else {
        G.TILESCALE = G.window_prev.orig_scale * h / G.window_prev.h;
    }
    if (G.ROOM) {
        G.ROOM.T.w = G.TILE_W;
        G.ROOM.T.h = G.TILE_H;
        G.ROOM_ATTACH.T.w = G.TILE_W;
        G.ROOM_ATTACH.T.h = G.TILE_H;
        if (w / h < G.window_prev.orig_ratio) {
            G.ROOM.T.x = G.ROOM_PADDING_W;
            G.ROOM.T.y = (h / (G.TILESIZE * G.TILESCALE) - (G.ROOM.T.h + G.ROOM_PADDING_H)) / 2 + G.ROOM_PADDING_H / 2;
        }
        else {
            G.ROOM.T.y = G.ROOM_PADDING_H;
            G.ROOM.T.x = (w / (G.TILESIZE * G.TILESCALE) - (G.ROOM.T.w + G.ROOM_PADDING_W)) / 2 + G.ROOM_PADDING_W / 2;
        }
        G.ROOM_ORIG = { x: G.ROOM.T.x, y: G.ROOM.T.y, r: G.ROOM.T.r };
        if (G.buttons) {
            G.buttons.recalculate();
        }
        if (G.HUD) {
            G.HUD.recalculate();
        }
    }
    G.WINDOWTRANS = { x: 0, y: 0, w: G.TILE_W + 2 * G.ROOM_PADDING_W, h: G.TILE_H + 2 * G.ROOM_PADDING_H, real_window_w: w, real_window_h: h };
    G.CANV_SCALE = 1;
    if (love.system.getOS() === "Windows" && false) {
        let [render_w, render_h] = love.window.getDesktopDimensions(G.SETTINGS.WINDOW.selcted_display);
        let unscaled_dims = love.window.getFullscreenModes(G.SETTINGS.WINDOW.selcted_display)[1];
        let DPI_scale = math.floor((0.5 * unscaled_dims.width / render_w + 0.5 * unscaled_dims.height / render_h) * 500 + 0.5) / 500;
        if (DPI_scale > 1.1) {
            G.CANV_SCALE = 1.5;
            G.AA_CANVAS = love.graphics.newCanvas(G.WINDOWTRANS.real_window_w * G.CANV_SCALE, G.WINDOWTRANS.real_window_h * G.CANV_SCALE, { type: "2d", readable: true });
            G.AA_CANVAS.setFilter("linear", "linear");
        }
        else {
            G.AA_CANVAS = undefined;
        }
    }
    G.CANVAS = love.graphics.newCanvas(w * G.CANV_SCALE, h * G.CANV_SCALE, { type: "2d", readable: true });
    G.CANVAS.setFilter("linear", "linear");
};

interface SMODS {
    _save_d_u(v: any): unknown;
    config: any;
    setup_stake(stake: any): unknown;
    mod_list(mod_list: any): unknown;
    Rarities(Rarities: any): unknown;
    OPENED_BOOSTER: any;
    Tags: any;
    collection_pool(Back: GameDeckParams[]): unknown;
    injectObjects(Atlas: any): unknown;
    Atlas(Atlas: any): unknown;
    calculate_context(arg0: { using_consumeable: boolean; consumeable: any; }): unknown;
    trigger_effects(arg0: any[], c1: any): unknown;
    Suits?: any;
    Suit?: any;
    Ranks?: any;
    Rank?: any;
    PokerHand?: any;
    PokerHands?(PokerHands: any): unknown;
    Sound?: any;
    remove_replace_sound?: boolean;
    previous_track?: any;
    Sounds?: any;
    get_blind_amount?(ante: any): void;
    stake_from_index?(stake: any): unknown;
    ConsumableType?: any;
    Rarity?: any;
    DeckSkins?: any;
    Shaders?: any;
    Shader?: any;
    Mods?: SMODS;
    restart_game?(): unknown;
    version?: any;
    can_load?: boolean;
    meta_mod?: boolean;
    config_file?: string;
    MODS_DIR?: any;
    path?: string;
    id?: "Steamodded"
}

var SMODS: SMODS = {};
var MODDED_VERSION = require("SMODS.version");
SMODS.id = "Steamodded";
SMODS.version = MODDED_VERSION.gsub("%-STEAMODDED", "");
SMODS.can_load = true;
SMODS.meta_mod = true;
SMODS.config_file = "config.lua";
let nativefs = require("nativefs");
let lovely = require("lovely");
let json = require("json");
let lovely_mod_dir = lovely.mod_dir.gsub("/$", "");
var NFS = nativefs;
NFS.setWorkingDirectory(lovely_mod_dir);
lovely_mod_dir = NFS.getWorkingDirectory();
NFS.setWorkingDirectory(love.filesystem.getSaveDirectory());
JSON = json;
function set_mods_dir(): void {
    let love_dirs = [love.filesystem.getSaveDirectory(), love.filesystem.getSourceBaseDirectory()];
    for (const [_, love_dir] of ipairs(love_dirs)) {
        if (lovely_mod_dir.sub(1, love_dir.length) === love_dir) {
            SMODS.MODS_DIR = lovely_mod_dir.sub(love_dir.length + 2);
            NFS.setWorkingDirectory(love_dir);
            return;
        }
    }
    SMODS.MODS_DIR = lovely_mod_dir;
}
set_mods_dir();
function find_this(directory, target_filename, target_line, depth?:number): string|undefined {
    depth = depth || 1;
    if (depth > 3) {
        return;
    }
    for (const [_, filename] of ipairs(NFS.getDirectoryItems(directory))) {
        let file_path = directory + ("/" + filename);
        let file_type = NFS.getInfo(file_path).type;
        if (file_type === "directory" || file_type === "symlink") {
            let f = find_this(file_path, target_filename, target_line, depth + 1);
            if (f) {
                return f;
            }
        }
        else if (filename === target_filename) {
            let first_line = NFS.read(file_path).match("^(.-)\\n");
            if (first_line === target_line) {
                return directory.match("^(.+/)");
            }
        }
    }
}
SMODS.path = find_this(SMODS.MODS_DIR, "core.lua", "--- STEAMODDED CORE");
for (const [_, path] of ipairs(["src/ui.lua", "src/index.lua", "src/utils.lua", "src/overrides.lua", "src/game_object.lua", "src/logging.lua", "src/compat_0_9_8.lua", "src/loader.lua"])) {
    (assert(load(string.format(NFS.read(SMODS.path + path), "=[SMODS _ \"%s\"]",path))) as unknown as Function)();
}