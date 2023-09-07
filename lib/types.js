/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
//import type {DangerouslyImpreciseStyleProp, TextStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {Ref as RefProp, RefObject} from 'reactjs-common';

export type LangFunction = string => string;
export type ValidateFunction<T> = T => boolean | string;
export type ValidateFunctionAsync<T> = (value: T, resolve: (boolean | string) => void) => void;
export type MessageFunction<T> = ?(Rule<T> => ?string);
export type ComparableType = number | string | /*bigint |*/ Date; //bigint not supported yet
export type StrLengthType = string | number;

/*export interface Rule<T> {
    lang: LangFunction;
    name: ?string;
    +messageFunc: MessageFunction<T>;
    +value: T;
    +resultValue: any;
    +isValid: boolean;
    +priority: number;
    +errorMessage: ?string;
    setMessageFunc(func: MessageFunction<T>): Rule<T>;
    setName(name: string): Rule<T>;
    setPriority(priority: number): Rule<T>;
    setValue(value: T): Rule<T>;
    validate(): Rule<T> | Promise<Rule<T>>;
}*/
import IRule from './rules/Rule';
export type Rule<T> = IRule<T>;

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
    +isValid: boolean,
    validate(): boolean,
    validateAsync(): Promise<boolean>,
}

export interface ContextRef extends Ref {
    getErrorMessage(name: string): string | void,
    getInput(name: string): InputRef | void,
    refreshMessage(): void,
    setErrorMessage(name: string, message: string): void,
}

export interface InputRef extends Ref {
    focus?: () => mixed,
    getErrorMessage(): string,
    +index: number,
    +name?: string,
    setErrorMessage(string): void,
}

export type {RefObject, RefProp};

export const AsyncFailMessage = Object.freeze({
    Default: 0,
    CaughtError: 1,
});

export type ContextValue = {|
    asyncFailMessage: $Values<typeof AsyncFailMessage>,
    auto: boolean,
    errorTextStyle: StyleProp,
    focusOnInvalid: boolean,
    inputErrorStyle: StyleProp,
    lang?: LangFunction,
    +nextIndex: number,
    addRef: InputRef => mixed,
    removeRef: InputRef => mixed,
|};

export type ContextDefaultProps = {
    asyncFailMessage: ContextValue['asyncFailMessage'],
    auto: ContextValue['auto'],
    errorTextStyle: ContextValue['errorTextStyle'],
    focusOnInvalid: ContextValue['focusOnInvalid'],
    inputErrorStyle: ContextValue['inputErrorStyle'],
    lang: $NonMaybeType<ContextValue['lang']>,
};

export type ContextProps = {
    ...ContextDefaultProps,
    children: React.Node,
};

export type ValidationOption<Props, Value = mixed> = {
    asyncFailMessage?: ContextValue['asyncFailMessage'],
    auto?: boolean,
    errorTextStyle?: StyleProp,
    getStyle?: Props => StyleProp,
    getValue?: Props => Value,
    inputErrorStyle?: StyleProp,
    lang?: LangFunction,
    name?: string,
    rules: Array<Rule<Value>> | Rule<Value>,
    setStatusStyle?: (Props, StyleProp, context: {clearValidation: () => void, flag: mixed}) => React.Node,
    setStyle?: (Props, StyleProp, containerStyle?: StyleProp) => mixed,
};

export type ValidationProps = {
    auto?: boolean,
    errorTextStyle?: StyleProp,
    lang?: LangFunction,
    rules: Array<Rule<mixed>> | Rule<mixed>,
    style?: StyleProp,
    value: mixed,
};

export type HttpReqOption = {
    data?: URLSearchParams | {[string]: mixed},
    headers?: {[string]: string},
    silentOnFailure?: boolean,
    timeout?: number,
    withCredentials?: boolean,
};