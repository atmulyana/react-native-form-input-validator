/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
//import type {DangerouslyImpreciseStyleProp, TextStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

export type LangFunction = string => string;
export type ValidateFunction<T> = T => boolean | string;
export type MessageFunction<T> = ?(Rule<T> => ?string);
export type ComparableType = number | string | /*bigint |*/ Date; //bigint not supported yet
export type StrLengthType = string | number;

/*
export interface Rule<T> {
    lang: LangFunction;
    name?: string;
    +messageFunc: MessageFunction<T>;
    +value: T;
    +resultValue: mixed;
    +isValid: boolean;
    +priority: number;
    +errorMessage: ?string;
    setMessageFunc(func: MessageFunction<T>): Rule<T>;
    setValue(value: T): Rule<T>;
    validate(): Rule<T>;
}*/
export /*abstract*/ class Rule<T> {
    static defaultLang: LangFunction = (s: string) => s;
    lang: LangFunction = Rule.defaultLang;
    name: ?string;
    isValid: boolean = false;
    get priority(): number {return 0}
    get errorMessage(): ?string {}
    get messageFunc(): MessageFunction<T> {}
    get value(): T {return (undefined: any)}
    get resultValue(): mixed {}
    setMessageFunc(func: MessageFunction<T>): Rule<T> {return this}
    setName(name: string): Rule<T> {return this}
    setPriority(priority: number): Rule<T> {return this}
    setValue(value: T): Rule<T> {return this}
    validate(): Rule<T> {return this}
}

type RecursiveArray<+T> =
  | null
  | void
  | T
  | false
  | ''
  | $ReadOnlyArray<RecursiveArray<T>>;
export type StyleProp = RecursiveArray<{...}>;

export interface Ref {
    clearValidation(): void,
    validate(): boolean,
}

export interface ContextRef extends Ref {
    refreshMessage(): void,
}

export interface ValidationRef extends Ref {
    focus?: () => mixed,
    index: number,
    +isValid: boolean,
}

export type RefProp<T> = ((T | null) => mixed) | {current: T | null, ...};

export type ContextValue = {|
    auto: boolean,
    errorTextStyle: StyleProp,
    inputErrorStyle: StyleProp,
    lang?: LangFunction,
    addRef: ValidationRef => mixed,
    removeRef: ValidationRef => mixed;
|};

export type ContextProps = {
    auto: ContextValue['auto'],
    children: React.Node,
    contextRef: RefProp<ContextRef>,
    errorTextStyle: ContextValue['errorTextStyle'],
    focusOnInvalid: boolean,
    inputErrorStyle: ContextValue['inputErrorStyle'],
    lang: $NonMaybeType<ContextValue['lang']>,
};

export type ValidationOption<Props> = {
    auto?: boolean,
    errorTextStyle?: StyleProp,
    getStyle?: Props => StyleProp,
    getValue?: Props => mixed,
    inputErrorStyle?: StyleProp,
    name?: string,
    rules: Array<Rule<any>> | Rule<any>,
    setErrorStyle?: (Props, StyleProp, ) => React.Node,
    setStyle?: (Props, StyleProp, errorStyle: StyleProp | false, containerStyle?: StyleProp) => mixed,
};