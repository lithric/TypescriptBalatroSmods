///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="../globals.ts"/>

class LuaObject {
  constructor() {}
  is(obj: any): boolean {
    return this instanceof obj;
  }
}
