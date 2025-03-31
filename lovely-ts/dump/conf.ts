///<reference types="lua-types/jit"/>
///<reference types="love-typescript-definitions"/>
///<reference path="./globals.ts"/>

var _RELEASE_MODE = true;
var _DEMO = false;

love.conf = function (t: import("love").Config) {
  t.console = !_RELEASE_MODE;
  t.title = "Balatro";
  t.window.title = "Balatro";
  t.window.width = 0;
  t.window.height = 0;
  t.window.minwidth = 100;
  t.window.minheight = 100;
};
