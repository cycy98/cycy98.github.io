/**
 * Deak Keys
 * defined in the Kalamine project: https://github.com/fabi1cazenave/kalamine
 * identifiers -> symbols dictionary, for presentation purposes
 */

const symbols = {
  // diacritics, represented by a dotted circle + a combining character
  '*`': '◌\u0300', // grave
  '*´': '◌\u0301', // acute
  '*^': '◌\u0302', // circumflex
  '*~': '◌\u0303', // tilde
  '*¯': '◌\u0304', // macron
  '*˘': '◌\u0306', // breve
  '*˙': '◌\u0307', // dot above
  '*¨': '◌\u0308', // diaeresis
  '*˚': '◌\u030a', // ring above
  '*”': '◌\u030b', // double acute
  '*ˇ': '◌\u030c', // caron
  '*‟': '◌\u030f', // double grave
  '*⁻': '◌\u0311', // inverted breve
  '*.': '◌\u0323', // dot below
  '*,': '◌\u0326', // comma below
  '*¸': '◌\u0327', // cedilla
  '*˛': '◌\u0328', // ogonek
  '*b': '𝕓', // balckboard bold
  "*I": "𝐼", // italic
  '*g': '𝐠'
  // special keys, represented by a smaller single character
  // '*/': stroke   (no special glyph needed)
  // '*µ': greek    (no special glyph needed)
  // '*¤': currency (no special glyph needed)
  '**': '\u2605', // 1dk = Kalamine "one dead key" = multi-purpose dead key
  // other dead key identifiers (= two-char strings starting with a `*` sign)
  // are not supported by Kalamine, but can still be used with <x-keyboard>
};
export default symbols;
