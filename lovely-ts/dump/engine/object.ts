///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
class LuaObject {
    constructor() {}
    is(obj:any): boolean {
        return this instanceof obj
    }
}