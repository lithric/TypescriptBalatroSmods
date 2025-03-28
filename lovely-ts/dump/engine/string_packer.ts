function assert<T>(condition: T, message?: string): () => T {
    if (message == undefined) message = "assertion failed!";
    if (!condition) {
        throw new Error(message);
    }
    return function() {
        return condition
    }
}

function pcall<T>(func:(...arg0: any[]) => T,...args:any): T|undefined {
    try {
        return func(...args)
    } catch {
        return undefined
    }
}

var stringFormat = (function() {

    'use strict'


    var re = {

        not_string: /[^s]/,

        not_bool: /[^t]/,

        not_type: /[^T]/,

        not_primitive: /[^v]/,

        number: /[diefg]/,

        numeric_arg: /[bcdiefguxX]/,

        json: /[j]/,

        not_json: /[^j]/,

        text: /^[^\x25]+/,

        modulo: /^\x25{2}/,

        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,

        key: /^([a-z_][a-z_\d]*)/i,

        key_access: /^\.([a-z_][a-z_\d]*)/i,

        index_access: /^\[(\d+)\]/,

        sign: /^[+-]/

    }


    function sprintf(key,...args) {

        // `arguments` is not an array, but should be fine for this call

        return sprintf_format(sprintf_parse(key), args)

    }


    function vsprintf(fmt, argv) {

        return sprintf.apply(null, [fmt].concat(argv || []))

    }


    function sprintf_format(parse_tree, argv) {

        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign

        for (i = 0; i < tree_length; i++) {

            if (typeof parse_tree[i] === 'string') {

                output += parse_tree[i]

            }

            else if (typeof parse_tree[i] === 'object') {

                ph = parse_tree[i] // convenience purposes only

                if (ph.keys) { // keyword argument

                    arg = argv[cursor]

                    for (k = 0; k < ph.keys.length; k++) {

                        if (arg == undefined) {

                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))

                        }

                        arg = arg[ph.keys[k]]

                    }

                }

                else if (ph.param_no) { // positional argument (explicit)

                    arg = argv[ph.param_no]

                }

                else { // positional argument (implicit)

                    arg = argv[cursor++]

                }


                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {

                    arg = arg()

                }


                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {

                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))

                }


                if (re.number.test(ph.type)) {

                    is_positive = arg >= 0

                }


                switch (ph.type) {

                    case 'b':

                        arg = parseInt(arg, 10).toString(2)

                        break

                    case 'c':

                        arg = String.fromCharCode(parseInt(arg, 10))

                        break

                    case 'd':

                    case 'i':

                        arg = parseInt(arg, 10)

                        break

                    case 'j':

                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)

                        break

                    case 'e':

                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()

                        break

                    case 'f':

                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)

                        break

                    case 'g':

                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)

                        break

                    case 'o':

                        arg = (parseInt(arg, 10) >>> 0).toString(8)

                        break

                    case 's':

                        arg = String(arg)

                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)

                        break

                    case 't':

                        arg = String(!!arg)

                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)

                        break

                    case 'T':

                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()

                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)

                        break

                    case 'u':

                        arg = parseInt(arg, 10) >>> 0

                        break

                    case 'v':

                        arg = arg.valueOf()

                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)

                        break

                    case 'x':

                        arg = (parseInt(arg, 10) >>> 0).toString(16)

                        break

                    case 'X':

                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()

                        break

                }

                if (re.json.test(ph.type)) {

                    output += arg

                }

                else {

                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {

                        sign = is_positive ? '+' : '-'

                        arg = arg.toString().replace(re.sign, '')

                    }

                    else {

                        sign = ''

                    }

                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '

                    pad_length = ph.width - (sign + arg).length

                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''

                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)

                }

            }

        }

        return output

    }


    var sprintf_cache = Object.create(null)


    function sprintf_parse(fmt) {

        if (sprintf_cache[fmt]) {

            return sprintf_cache[fmt]

        }


        var _fmt = fmt, match, parse_tree:(string|object)[] = [], arg_names = 0

        while (_fmt) {

            if ((match = re.text.exec(_fmt)) !== null) {

                parse_tree.push(match[0])

            }

            else if ((match = re.modulo.exec(_fmt)) !== null) {

                parse_tree.push('%')

            }

            else if ((match = re.placeholder.exec(_fmt)) !== null) {

                if (match[2]) {

                    arg_names |= 1

                    var field_list:string[] = [], replacement_field = match[2], field_match:RegExpExecArray|null|string[] = []

                    if ((field_match = re.key.exec(replacement_field)) !== null) {

                        field_list.push(field_match[1])

                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {

                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {

                                field_list.push(field_match[1])

                            }

                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {

                                field_list.push(field_match[1])

                            }

                            else {

                                throw new SyntaxError('[sprintf] failed to parse named argument key')

                            }

                        }

                    }

                    else {

                        throw new SyntaxError('[sprintf] failed to parse named argument key')

                    }

                    match[2] = field_list

                }

                else {

                    arg_names |= 2

                }

                if (arg_names === 3) {

                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')

                }


                parse_tree.push(

                    {

                        placeholder: match[0],

                        param_no:    match[1],

                        keys:        match[2],

                        sign:        match[3],

                        pad_char:    match[4],

                        align:       match[5],

                        width:       match[6],

                        precision:   match[7],

                        type:        match[8]

                    }

                )

            }

            else {

                throw new SyntaxError('[sprintf] unexpected placeholder')

            }

            _fmt = _fmt.substring(match[0].length)

        }

        return sprintf_cache[fmt] = parse_tree

    }

    return sprintf

})(); // eslint-disable-line

function loadstring(str:any): any {};

function STR_PACK(data, recursive?): string {
    let ret_str = (recursive && "" || "return ") + "{";
    for (let [i, v] of Object.entries(data)) {
        let [type_i, type_v] = [typeof (i), typeof (v)];
        assert(type_i !== "object", "Data table cannot have an table as a key reference");
        if (type_i === "string") {
            i = "[" + (stringFormat("%q", i) + "]");
        }
        else {
            i = "[" + (i + "]");
        }
        if (type_v === "object" && typeof v === "object" && v) {
            if (v instanceof LuaObject) {
                v = "[\"]" + "MANUAL_REPLACE" + "[\"]";
            }
            else {
                v = STR_PACK(v, true);
            }
        }
        else {
            if (type_v === "string") {
                v = stringFormat("%q", v);
            }
            if (type_v === "boolean") {
                v = v && "true" || "false";
            }
        }
        ret_str = ret_str + (i + ("=" + (v + ",")));
    }
    return ret_str + "}";
};
function STR_UNPACK(str): any {
    return assert(loadstring(str) as any)();
};

function get_compressed(_file): string|undefined {
    let file_data = love.filesystem.getInfo(_file);
    if (file_data !== undefined) {
        let file_string = love.filesystem.read(_file);
        if (file_string !== "") {
            if (String.prototype.substring.call(file_string, 1, 6) !== "return") {
                let success:boolean|undefined = undefined;
                let data = pcall(love.data.decompress, "string", "deflate", file_string);
                [success, file_string] = data ? [!!data,data]:[false,undefined];
                if (!success) {
                    return undefined;
                }
            }
            return file_string;
        }
    }
};

function compress_and_save (_file, _data): void {
    let save_string = typeof _data === "object" && STR_PACK(_data) || _data;
    save_string = love.data.compress("string", "deflate", save_string, 1);
    love.filesystem.write(_file, save_string);
};