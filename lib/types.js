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
    //$FlowIgnore[unsafe-getters-setters]
    get priority(): number {return 0}
    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {}
    //$FlowIgnore[unsafe-getters-setters]
    get messageFunc(): MessageFunction<T> {}
    //$FlowIgnore[unsafe-getters-setters]
    get value(): T {
        //$FlowIgnore[incompatible-return]  abtract property, to be overriden
        return undefined;
    }
    //$FlowIgnore[unsafe-getters-setters]
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
export type StyleProp = RecursiveArray<$ReadOnly<{...}>>;

export interface Ref {
    clearValidation(): void,
    validate(): boolean,
}

export interface ContextRef extends Ref {
    refreshMessage(): void,
}

export interface InputRef extends Ref {
    focus?: () => mixed,
    index: number,
    +isValid: boolean,
    setErrorMessage(string): void,
}

export type RefObject<T> = {current: T | null, ...};
export type RefProp<T> = ((T | null) => mixed) | RefObject<T>;

export type ContextValue = {|
    auto: boolean,
    errorTextStyle: StyleProp,
    inputErrorStyle: StyleProp,
    lang?: LangFunction,
    addRef: InputRef => mixed,
    removeRef: InputRef => mixed;
|};

export type ContextProps = {
    auto: ContextValue['auto'],
    children: React.Node,
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
    lang?: LangFunction,
    name?: string,
    rules: Array<Rule<mixed>> | Rule<mixed>,
    setStatusStyle?: (Props, StyleProp, context: {clearValidation: () => void, flag: mixed}) => React.Node,
    setStyle?: (Props, StyleProp, containerStyle?: StyleProp) => mixed,
};

export type ValidationProps = {
    auto?: boolean,
    errorTextStyle?: StyleProp,
    lang?: LangFunction,
    rules: Array<Rule<mixed>> | Rule<mixed>,
    style: StyleProp,
    value: mixed,
};