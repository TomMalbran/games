const codes = {
    3   : "Cancel",
    6   : "Help",
    8   : "BackSpace",
    9   : "Tab",
    12  : "Clear",
    13  : "Return",
    14  : "Enter",
    16  : "Shift",
    17  : "Control",
    18  : "Alt",
    19  : "Pause",
    20  : "CapsLock",
    27  : "Escape",
    32  : "Space",
    33  : "PageUp",
    34  : "PageDown",
    35  : "End",
    36  : "Home",
    37  : "Left",
    38  : "Up",
    39  : "Right",
    40  : "Down",
    44  : "PrintScreen",
    45  : "Insert",
    46  : "Delete",
    48  : "0",
    49  : "1",
    50  : "2",
    51  : "3",
    52  : "4",
    53  : "5",
    54  : "6",
    55  : "7",
    56  : "8",
    57  : "9",
    65  : "A",
    66  : "B",
    67  : "C",
    68  : "D",
    69  : "E",
    70  : "F",
    71  : "G",
    72  : "H",
    73  : "I",
    74  : "J",
    75  : "K",
    76  : "L",
    77  : "M",
    78  : "N",
    79  : "O",
    80  : "P",
    81  : "Q",
    82  : "R",
    83  : "S",
    84  : "T",
    85  : "U",
    86  : "V",
    87  : "W",
    88  : "X",
    89  : "Y",
    90  : "Z",
    93  : "ContextMenu",
    96  : "Numpad0",
    97  : "Numpad1",
    98  : "Numpad2",
    99  : "Numpad3",
    100 : "Numpad4",
    101 : "Numpad5",
    102 : "Numpad6",
    103 : "Numpad7",
    104 : "Numpad8",
    105 : "Numpad9",
    106 : "Multiply",
    107 : "Add",
    108 : "Separator",
    109 : "Subtract",
    110 : "Decimal",
    111 : "Divide",
    112 : "F1",
    113 : "F2",
    114 : "F3",
    115 : "F4",
    116 : "F5",
    117 : "F6",
    118 : "F7",
    119 : "F8",
    120 : "F9",
    121 : "F10",
    122 : "F11",
    123 : "F12",
    124 : "F13",
    125 : "F14",
    126 : "F15",
    127 : "F16",
    128 : "F17",
    129 : "F18",
    130 : "F19",
    131 : "F20",
    132 : "F21",
    133 : "F22",
    134 : "F23",
    135 : "F24",
    144 : "NumLock",
    145 : "ScrollLock",
    186 : "Semicolon",
    187 : "Equals",
    188 : "Comma",
    189 : "Dash",
    190 : "Period",
    191 : "Slash",
    192 : "BackQuote",
    219 : "OpenBracket",
    220 : "BlackSlash",
    221 : "CloseBracket",
    222 : "Quote",
    224 : "Meta",
};
const wasd = {
    65 : "Left",
    87 : "Up",
    68 : "Right",
    83 : "Down",
};



/**
 * Converts a key into a code
 * @param {Number}   key
 * @param {Boolean=} withWASD
 * @returns {String}
 */
function keyToCode(key, withWASD = false) {
    let result = codes[key];
    if (withWASD && wasd[key]) {
        result = wasd[key];
    }
    return result;
}

/**
 * Converts a code into a key
 * @param {String} code
 * @returns {Number}
 */
function codeToKey(code) {
    for (const [ keyNum, keyCode ] of codes.entries()) {
        if (code === keyCode) {
            return keyNum;
        }
    }
    return 0;
}

/**
 * Converts a key into a number, if possible
 * @param {Number}   key
 * @param {Boolean=} zeroAsTen
 * @returns {?Number}
 */
function keyToNumber(key, zeroAsTen = false) {
    if (zeroAsTen && (key === 48 || key === 96)) {
        return 10;
    }
    if (key >= 48 && key <= 57) {
        return key - 48;
    }
    if (key >= 96 && key <= 105) {
        return key - 96;
    }
    return null;
}

/**
 * Converts a key into hexadecimal, if possible
 * @param {Number} key
 * @returns {?Number}
 */
function keyToHexa(key) {
    const number = keyToNumber(key);
    if (number !== null) {
        return number;
    }
    const code = codes[key];
    if ([ "A", "B", "C", "D", "E", "F" ].includes(code)) {
        return code;
    }
    return null;
}



/**
 * Returns true if the current key is consider as a Fast Key
 * @param {Number} key
 * @returns {Boolean}
 */
function isFastKey(key) {
    return [ 37, 65, 40, 83, 39, 68 ].includes(key);
}

/**
 * Returns true if the current key is consider as Enter
 * @param {Number} key
 * @returns {Boolean}
 */
function isEnter(key) {
    const code = codes[key];
    return code === "Enter" || code === "Return";
}

/**
 * Returns true if the current key is consider as Erase
 * @param {Number} key
 * @returns {Boolean}
 */
function isErase(key) {
    const code = codes[key];
    return code === "Backspace" || code === "B" || code === "N";
}

/**
 * Returns true if the current key is consider as Pause or Continue
 * @param {Number} key
 * @returns {Boolean}
 */
function isPauseContinue(key) {
    const code = codes[key];
    return code === "P" || code === "C";
}

/**
 * Returns true if the current key is consider as Up
 * @param {Number} key
 * @returns {Boolean}
 */
function isUp(key) {
    const code = codes[key];
    return code === "Up" || code === "W";
}

/**
 * Returns true if the current key is consider as Left
 * @param {Number} key
 * @returns {Boolean}
 */
function isLeft(key) {
    const code = codes[key];
    return code === "Left" || code === "A";
}

/**
 * Returns true if the current key is consider as Down
 * @param {Number} key
 * @returns {Boolean}
 */
function isDown(key) {
    const code = codes[key];
    return code === "Down" || code === "S";
}

/**
 * Returns true if the current key is consider as Right
 * @param {Number} key
 * @returns {Boolean}
 */
function isRight(key) {
    const code = codes[key];
    return code === "Right" || code === "D";
}



// The public API
export default {
    keyToCode,
    codeToKey,
    keyToNumber,
    keyToHexa,

    isFastKey,
    isEnter,
    isErase,
    isPauseContinue,
    isUp,
    isLeft,
    isDown,
    isRight,
};
