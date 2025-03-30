local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
LuaObject = __TS__Class()
LuaObject.name = "LuaObject"
function LuaObject.prototype.____constructor(self)
end
function LuaObject.prototype.is(self, obj)
    return __TS__InstanceOf(self, obj)
end
