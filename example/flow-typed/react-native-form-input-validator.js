/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */

declare type _LangFunction = string => string;
declare type _MessageFunction<T> = ?(Rule<T> => ?string);

declare class Rule<T> {
    lang: _LangFunction;
    name: ?string;
    +messageFunc: _MessageFunction<T>;
    +value: T;
    +resultValue: any;
    +isValid: boolean;
    +priority: number;
    +errorMessage: ?string;
    setMessageFunc(func: _MessageFunction<T>): Rule<T>;
    setName(name: string): Rule<T>;
    setPriority(priority: number): Rule<T>;
    setValue(value: T): Rule<T>;
    validate(): any; //Rule<T> | Promise<Rule<T>>;
}


declare module "react-native-form-input-validator/lib/types" {
    import type {Node} from 'react';

    declare export type ComparableType = number | string | /*bigint |*/ Date; //bigint not supported yet
    declare export type LangFunction = _LangFunction;
    declare export type MessageFunction<T> = _MessageFunction<T>;
    declare export type StrLengthType = string | number;
    declare export type ValidateFunction<T> = T => boolean | string;
    declare export type ValidateFunctionAsync<T> = (value: T, reject: (boolean | string) => void) => void;
    
    declare type RecursiveArray<+T> =
        | null
        | void
        | T
        | false
        | ''
        | $ReadOnlyArray<RecursiveArray<T>>;
    declare export type StyleProp = RecursiveArray<$ReadOnly<{...}>>;

    declare export interface Ref {
        clearValidation(): void,
        validate(): boolean,
        validateAsync(): Promise<boolean>,
    }

    declare export interface ContextRef extends Ref {
        refreshMessage(): void,
    }

    declare export interface InputRef extends Ref {
        focus?: () => mixed,
        +isValid: boolean,
        setErrorMessage(string): void,
    }

    declare export type RefObject<T> = {current: T | null, ...};
    declare export type RefProp<T> = ((T | null) => mixed) | RefObject<T>;

    declare type TAsyncFailMessage = {
        Default: 0,
        CaughtError: 1,
    };
    declare export const AsyncFailMessage: TAsyncFailMessage;

    declare export type ContextValue = {|
        asyncFailMessage: $Values<typeof AsyncFailMessage>,
        auto: boolean,
        errorTextStyle: StyleProp,
        inputErrorStyle: StyleProp,
        lang?: LangFunction,
        addRef: InputRef => mixed,
        removeRef: InputRef => mixed;
    |};

    declare export type ContextDefaultProps = {
        asyncFailMessage: ContextValue['asyncFailMessage'],
        auto: ContextValue['auto'],
        errorTextStyle: ContextValue['errorTextStyle'],
        focusOnInvalid: boolean,
        inputErrorStyle: ContextValue['inputErrorStyle'],
        lang: $NonMaybeType<ContextValue['lang']>,
    };

    declare export type ContextProps = {
        ...ContextDefaultProps,
        children: Node,
    };

    declare export type ValidationOption<Props, Value = mixed> = {
        asyncFailMessage?: ContextValue['asyncFailMessage'],
        auto?: boolean,
        errorTextStyle?: StyleProp,
        getStyle?: Props => StyleProp,
        getValue?: Props => Value,
        inputErrorStyle?: StyleProp,
        lang?: LangFunction,
        name?: string,
        rules: Array<Rule<Value>> | Rule<Value>,
        setStatusStyle?: (Props, StyleProp, context: {clearValidation: () => void, flag: mixed}) => Node,
        setStyle?: (Props, StyleProp, containerStyle?: StyleProp) => mixed,
    };

    declare export type ValidationProps = {
        auto?: boolean,
        errorTextStyle?: StyleProp,
        lang?: LangFunction,
        rules: Array<Rule<mixed>> | Rule<mixed>,
        style?: StyleProp,
        value: mixed,
    };

    declare export type HttpReqOption = {
        data?: URLSearchParams | {[string]: mixed},
        headers?: {[string]: string},
        silentOnFailure?: boolean,
        timeout?: number,
        withCredentials?: boolean,
    };
}


declare module "react-native-form-input-validator" {
    import type {AbstractComponent, Component, Config, Node} from 'react';
    import type {
        ContextDefaultProps,
        ContextProps,
        ContextRef,
        InputRef,
        StyleProp,
        ValidationOption,
        ValidationProps,
    } from 'react-native-form-input-validator/lib/types';

    declare export var ValidationContext: AbstractComponent<Config<ContextProps, ContextDefaultProps>, ContextRef>;
    declare export var Validation: AbstractComponent<ValidationProps, InputRef>;

    declare export function isDifferentStyle(style1: StyleProp, style2: StyleProp): boolean;
    declare export function setStatusStyleDefault(props: {...}, style: StyleProp): Node;
    declare export function withValidation<Props, Instance = mixed>(
        Input: AbstractComponent<Props, Instance>,
        option: ValidationOption<Props, any> | Array<Rule<any>> | Rule<any>
    ): AbstractComponent<Props, Instance & InputRef>;
}


declare module "react-native-form-input-validator/rules" {
    import type {
        ComparableType,
        HttpReqOption,
        MessageFunction,
        StrLengthType,
        ValidateFunction,
        ValidateFunctionAsync,
    } from 'react-native-form-input-validator/lib/types';

    declare export default class ValidationRule<T> extends Rule<T> {
        validate(): Rule<T>;
    }

    declare export class ValidationRuleAsync<T> extends Rule<T> {
        validate(): Promise<Rule<T>>;
    }
    
    declare export class CustomRule extends ValidationRule<mixed> {
        constructor(validateFunc: ValidateFunction<mixed>, errorMessage?: string): void;
    }
    declare export function rule(validateFunc: ValidateFunction<mixed>, errorMessage?: string): Rule<mixed>;
    
    declare export class CustomRuleAsync extends ValidationRuleAsync<mixed> {
        constructor(validateFunc: ValidateFunctionAsync<mixed>, errorMessage?: string): void;
    }
    declare export function ruleAsync(
        validateFunc: ValidateFunctionAsync<mixed>, errorMessage?: string): Rule<mixed>;
    
    declare export class Email extends ValidationRule<string> {}
    declare export var email: Rule<string>;

    declare export class HttpReq extends ValidationRuleAsync<?ComparableType | boolean> {
        constructor(uri: string, option?: HttpReqOption): void;
    }
    declare export function httpReq(uri: string, option?: HttpReqOption): HttpReq;
    
    declare export class Integer extends ValidationRule<mixed>{}
    declare export var integer: Rule<mixed>;
    
    declare export class Max extends ValidationRule<ComparableType> {
        constructor(max: ComparableType | () => ComparableType): void;
        max: ComparableType | () => ComparableType;
    }
    declare export function max(maxVal: ComparableType | () => ComparableType): Rule<ComparableType>;
    
    declare export class Min extends ValidationRule<ComparableType> {
        constructor(min: ComparableType | () => ComparableType): void;
        min: ComparableType | () => ComparableType;
    }
    declare export function min(minVal: ComparableType | () => ComparableType): Rule<ComparableType>;
    
    declare export class Numeric extends ValidationRule<string>{}
    declare export var numeric: Rule<string>;
    
    declare export class Regex extends ValidationRule<string> {
        constructor(pattern: RegExp | string, flags?: string): void;
    }
    declare export function regex(pattern: RegExp | string, flags?: string): Rule<string>;
    
    declare class _Required extends ValidationRule<mixed> {
        constructor(_if?: mixed => boolean): void;
        static If(_if: mixed => boolean): _Required;
    }
    declare class RequiredIf extends _Required {
        if: (mixed => boolean) => _Required;
    }
    declare export {_Required as Required};
    declare export var required: RequiredIf;
    declare export var alwaysValid: _Required;
    
    declare export class StrLength extends ValidationRule<StrLengthType> {
        constructor(min?: number, max?: number): void;
        min: number | void;
        max: number | void;
    }
    declare export function strlen(min: number, max?: number): Rule<StrLengthType>;
    declare export function strlenmax(max: number): Rule<StrLengthType>;
}