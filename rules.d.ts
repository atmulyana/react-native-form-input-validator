/**
 * https://github.com/atmulyana/react-native-form-input-validator
 * 
 * @format
 */
import type {
    ComparableType,
    HttpReqOption,
    MayBe,
    Rule,
    StrLengthType,
    ValidateFunction,
    ValidateFunctionAsync,
} from './lib/types';
type mixed = any;

export class ValidationRule<T> extends Rule<T> {
    validate(): Rule<T>;
}

export class ValidationRuleAsync<T> extends Rule<T> {
    validate(): Promise<Rule<T>>;
}

export class CustomRule extends ValidationRule<mixed> {
    constructor(validateFunc: ValidateFunction<mixed>, errorMessage?: string);
}
export function rule(
    validateFunc: ValidateFunction<mixed>,
    errorMessage?: string
): Rule<mixed>;

export class CustomRuleAsync extends ValidateFunctionAsync<mixed> {
    constructor(validateFunc: ValidateFunctionAsyn<mixed>, errorMessage?: string);
}
export function ruleAsync(
    validateFunc: ValidateFunctionAsync<mixed>,
    errorMessage?: string
): Rule<mixed>;

export class Email extends ValidationRule<string> {}
export const email: Email;

export class HttpReq extends ValidationRuleAsync<MayBe<ComparableType> | boolean> {
    constructor(uri: string, option?: HttpReqOption);
}
export function httpReq(
    uri: string,
    option?: HttpReqOption
): HttpReq;

export class Integer extends ValidationRule<mixed>{}
export const integer: Integer;

export class Max extends ValidationRule<ComparableType> {
    constructor(max: ComparableType | (() => ComparableType));
    max: ComparableType | (() => ComparableType);
}
export function max(
    maxVal: ComparableType | (() => ComparableType)
): Rule<ComparableType>;

export class Min extends ValidationRule<ComparableType> {
    constructor(min: ComparableType | (() => ComparableType));
    min: ComparableType | (() => ComparableType);
}
export function min(
    minVal: ComparableType | (() => ComparableType)
): Rule<ComparableType>;

export class Numeric extends ValidationRule<string>{}
export const numeric: Numeric;

export class Regex extends ValidationRule<string> {
    constructor(pattern: RegExp | string, flags?: string);
}
export function regex(
    pattern: RegExp | string,
    flags?: string
): Rule<string>;

export class Required extends ValidationRule<mixed> {
    constructor(_if?: (value: mixed) => boolean);
    static If(_if: (value: mixed) => boolean): Required;
}
declare class RequiredIf extends Required {
    if: (predicate: (value: mixed) => boolean) => Required;
}
export const required: RequiredIf;
export const alwaysValid: Required;

export class StrLength extends ValidationRule<StrLengthType> {
    constructor(min?: number, max?: number);
    min: number | void;
    max: number | void;
}
export function strlen(min: number, max?: number): Rule<StrLengthType>;
export function strlenmax(max: number): Rule<StrLengthType>;