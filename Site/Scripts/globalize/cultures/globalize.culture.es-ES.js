/*
 * Globalize Culture es-ES
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function (window, undefined) {

    var Globalize;

    if (typeof require !== "undefined"
        && typeof exports !== "undefined"
        && typeof module !== "undefined") {
        // Assume CommonJS
        Globalize = require("globalize");
    } else {
        // Global variable
        Globalize = window.Globalize;
    }

    Globalize.addCultureInfo("es-ES", "default", {
        name: "es-ES",
        englishName: "Spanish (Spain, International Sort)",
        nativeName: "EspaÃ±ol (EspaÃ±a, alfabetizaciÃ³n internacional)",
        language: "es",
        numberFormat: {
            ",": ".",
            ".": ",",
            percent: {
                ",": ".",
                ".": ","
            },
            currency: {
                pattern: ["-n $", "n $"],
                ",": ".",
                ".": ",",
                symbol: "â‚¬"
            }
        },
        calendars: {
            standard: {
                firstDay: 1,
                days: {
                    names: ["domingo", "lunes", "martes", "miÃ©rcoles", "jueves", "viernes", "sÃ¡bado"],
                    namesAbbr: ["dom", "lun", "mar", "miÃ©", "jue", "vie", "sÃ¡b"],
                    namesShort: ["do", "lu", "ma", "mi", "ju", "vi", "sÃ¡"]
                },
                months: {
                    names: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""],
                    namesAbbr: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic", ""]
                },
                AM: null,
                PM: null,
                eras: [{ "name": "d.C.", "start": null, "offset": 0 }],
                patterns: {
                    d: "dd/MM/yyyy",
                    D: "dddd, dd' de 'MMMM' de 'yyyy",
                    t: "H:mm",
                    T: "H:mm:ss",
                    f: "dddd, dd' de 'MMMM' de 'yyyy H:mm",
                    F: "dddd, dd' de 'MMMM' de 'yyyy H:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM' de 'yyyy"
                }
            }
        }
    });

}(this));
