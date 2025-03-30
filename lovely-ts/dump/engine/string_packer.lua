local ____lualib = require("lualib_bundle")
local __TS__TypeOf = ____lualib.__TS__TypeOf
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local __TS__Unpack = ____lualib.__TS__Unpack
function STR_PACK(self, data, recursive)
    local ret_str = (recursive and "" or "return ") .. "{"
    for i, v in pairs(data) do
        local type_i, type_v = __TS__TypeOf(i), __TS__TypeOf(v)
        assert(type_i ~= "object", "Data table cannot have an table as a key reference")
        if type_i == "string" then
            i = "[" .. string.format("%q", i) .. "]"
        else
            i = "[" .. tostring(i) .. "]"
        end
        if type_v == "object" and type(v) == "table" and v then
            if __TS__InstanceOf(v, LuaObject) then
                v = ("[\"]" .. "MANUAL_REPLACE") .. "[\"]"
            else
                v = STR_PACK(_G, v, true)
            end
        else
            if type_v == "string" then
                v = string.format("%q", v)
            end
            if type_v == "boolean" then
                v = v and "true" or "false"
            end
        end
        ret_str = ret_str .. tostring(i) .. "=" .. tostring(v) .. ","
    end
    return ret_str .. "}"
end
function STR_UNPACK(self, str)
    return assert({loadstring(str)})(_G)
end
function get_compressed(self, _file)
    local file_data = love.filesystem.getInfo(_file)
    if file_data ~= nil then
        local file_string = {love.filesystem.read(_file)}
        if file_string ~= "" then
            if String.prototype.substring(file_string, 1, 6) ~= "return" then
                local success = nil
                local data = {pcall(love.data.decompress, "string", "deflate", file_string)}
                local ____data_0
                if data then
                    ____data_0 = {not not data, data}
                else
                    ____data_0 = {false, nil}
                end
                success, file_string = __TS__Unpack(____data_0)
                if not success then
                    return nil
                end
            end
            return file_string
        end
    end
end
function compress_and_save(self, _file, _data)
    local save_string = type(_data) == "table" and STR_PACK(_G, _data) or _data
    save_string = love.data.compress("string", "deflate", save_string, 1)
    love.filesystem.write(_file, save_string)
end
