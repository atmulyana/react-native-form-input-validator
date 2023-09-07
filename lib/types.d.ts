/**
 * https://github.com/atmulyana/react-native-form-input-validator
 * 
 * @format
 */
import * as React from 'react';

type mixed = unknown;
export type MayBe<T> = T | null | undefined; 
export type LangFunction = (s: string) => string;
export type ValidateFunction<T> = (v: T) => boolean | string;
export type ValidateFunctionAsync<T> = (value: T, resolve: (result: boolean | string) => void) => void;
export type MessageFunction<T> = MayBe< (rule: Rule<T>) => MayBe<string> >;
export type ComparableType = number | string | bigint | Date;
export type StrLengthType = string | number;

export class Rule<T> {
    lang: LangFunction;
    name: MayBe<string>;
    readonly messageFunc: MessageFunction<T>;
    readonly value: T;
    readonly resultValue: any;
    readonly isValid: boolean;
    readonly priority: number;
    readonly errorMessage: MayBe<string>;
    setMessageFunc(func: MessageFunction<T>): Rule<T>;
    setName(name: string): Rule<T>;
    setPriority(priority: number): Rule<T>;
    setValue(value: T): Rule<T>;
    validate(): Rule<T> | Promise<Rule<T>>;
}

type RecursiveArray<T> =
  | null
  | void
  | T
  | false
  | ''
  | ReadonlyArray<RecursiveArray<T>>;
export type StyleProp = RecursiveArray<Readonly<{[prop: string]: mixed}>>;

export interface Ref {
    clearValidation(): void,
    readonly isValid: boolean,
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
    getErrorMessage: () => string,
    readonly name?: string,
    setErrorMessage(message: string): void,
}

export type RefObject<T> = {current: T | null, [prop: string]: mixed};
export type RefProp<T> = ((ref: T | null) => mixed) | RefObject<T>;

type TAsyncFailMessage = {
    Default: 0,
    CaughtError: 1,
};
export const AsyncFailMessage: TAsyncFailMessage;

export type ContextValue = {
    asyncFailMessage: TAsyncFailMessage[keyof TAsyncFailMessage],
    auto: boolean,
    errorTextStyle: StyleProp,
    focusOnInvalid: boolean,
    inputErrorStyle: StyleProp,
    lang?: LangFunction,
    addRef: (ref: InputRef) => mixed,
    removeRef: (ref: InputRef) => mixed;
};

export type ContextProps = {
    asyncFailMessage: ContextValue['asyncFailMessage'],
    auto: ContextValue['auto'],
    children: React.ReactNode,
    errorTextStyle: ContextValue['errorTextStyle'],
    focusOnInvalid: ContextValue['focusOnInvalid'],
    inputErrorStyle: ContextValue['inputErrorStyle'],
    lang: NonNullable<ContextValue['lang']>,
};

export type ContextDefaultProps = {
    asyncFailMessage: ContextProps['asyncFailMessage'],
    auto: ContextProps['auto'],
    errorTextStyle: ContextProps['errorTextStyle'],
    focusOnInvalid: ContextProps['focusOnInvalid'],
    inputErrorStyle: ContextProps['inputErrorStyle'],
    lang: ContextProps['lang'],
};

export type ValidationOption<Props, Value = mixed> = {
    asyncFailMessage?: ContextValue['asyncFailMessage'],
    auto?: boolean,
    errorTextStyle?: StyleProp,
    getStyle?: (props: Props) => StyleProp,
    getValue?: (props: Props) => Value,
    inputErrorStyle?: StyleProp,
    lang?: LangFunction,
    name?: string,
    rules: Array<Rule<Value>> | Rule<Value>,
    setStatusStyle?: (props: Props, style: StyleProp, context: {clearValidation: () => void, flag: mixed}) => React.ReactNode,
    setStyle?: (props: Props, style: StyleProp, containerStyle?: StyleProp) => mixed,
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
    data?: URLSearchParams | {[prop: string]: mixed},
    headers?: {[name: string]: string},
    silentOnFailure?: boolean,
    timeout?: number,
    withCredentials?: boolean,
};