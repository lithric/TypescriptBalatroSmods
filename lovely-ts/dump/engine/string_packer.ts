///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

function STR_PACK(data, recursive?): string {
  let ret_str = ((recursive && "") || "return ") + "{";
  for (let [i, v] of pairs(data)) {
    let [type_i, type_v] = [typeof i, typeof v];
    assert(type_i !== "object", "Data table cannot have an table as a key reference");
    if (type_i === "string") {
      i = "[" + (string.format("%q", i) + "]");
    } else {
      i = "[" + (i + "]");
    }
    if (type_v === "object" && typeof v === "object" && v) {
      if (v instanceof LuaObject) {
        v = '["]' + "MANUAL_REPLACE" + '["]';
      } else {
        v = STR_PACK(v, true);
      }
    } else {
      if (type_v === "string") {
        v = string.format("%q", v);
      }
      if (type_v === "boolean") {
        v = (v && "true") || "false";
      }
    }
    ret_str = ret_str + (i + ("=" + (v + ",")));
  }
  return ret_str + "}";
}

function STR_UNPACK(str): any {
  return assert(loadstring(str) as any)();
}

function get_compressed(_file): string | undefined {
  let file_data = love.filesystem.getInfo(_file);
  if (file_data !== undefined) {
    let file_string = love.filesystem.read(_file);
    if (file_string !== "") {
      if (String.prototype.substring.call(file_string, 1, 6) !== "return") {
        let success: boolean | undefined = undefined;
        let data = pcall(love.data.decompress, "string", "deflate", file_string);
        [success, file_string] = data ? [!!data, data] : [false, undefined];
        if (!success) {
          return undefined;
        }
      }
      return file_string;
    }
  }
}

function compress_and_save(_file, _data): void {
  let save_string = (typeof _data === "object" && STR_PACK(_data)) || _data;
  save_string = love.data.compress("string", "deflate", save_string, 1);
  love.filesystem.write(_file, save_string);
}
