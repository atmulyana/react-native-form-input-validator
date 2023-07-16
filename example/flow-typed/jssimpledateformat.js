/**
 * @format
 * @flow
 */
declare module "jssimpledateformat" {
    declare export class FormatError extends Error {
    }
    
    declare export class JsDateFormatSymbols {
        constructor(sLocale: string): void;
        getAmPmStrings(): string[];
        getShortAmPmStrings(): string[];
        getEras(): string[];
        getMonths(): string[];
        getShortMonths(): string[];
        getShortWeekdays(): string[];
        getWeekdays(): string[];
        setAmPmStrings(arAmPmStrings: string[]): void;
        setEras(arEras: string[]): void;
        setMonths(arMonths: string[]): void;
        setShortMonths(arShortMonths: string[]): void;
        setShortWeekdays(arShortWeekdays: string[]): void;
        setWeekdays(arWeekdays: string[]): void;
    }
    
    declare interface ParsingPosition {
        index: number;
        errorIndex?: number;
    }
    
    declare export default class JsSimpleDateFormat {
        constructor(sPattern: string, param: JsDateFormatSymbols | string | void): void;
        applyPattern(sPattern: string): void;
        format(oDate: Date): string;
        get2DigitYearStart(): Date;
        getDateFormatSymbols(): JsDateFormatSymbols;
        parse(s: string, oPos?: ParsingPosition): Date;
        set2DigitYearStart(oStartDate: Date): void;
        setDateFormatSymbols(oFormatSymbols: JsDateFormatSymbols): void;
        toPattern(): string;
    }
}