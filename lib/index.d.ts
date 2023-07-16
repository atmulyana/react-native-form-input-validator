/**
 * https://github.com/atmulyana/react-native-form-input-validator
 * 
 * @format
 */
import * as React from 'react'
import type {
    ContextProps,
    ContextRef,
    MayBe,
    RefProp,
    Rule,
    StyleProp,
    TAsyncFailMessage,
    ValidationOption,
    ValidationProps,
    InputRef,
} from './types';
type mixed = any;

export class ValidationContext extends React.Component<ContextProps> implements ContextRef {
    constructor(props: ValidationProps);
    clearValidation(): void;
    refreshMessage(): void;
    validate(): boolean;
    validateAsync(): Promise<boolean>;
}

export class Validation extends React.Component<ValidationProps> implements InputRef {
    constructor(props: ValidationProps);
    get isValid(): boolean;
    clearValidation(): void;
    validate(): boolean;
    validateAsync(): Promise<boolean>;
    setErrorMessage(message: string): void;
}

export var AsyncFailMessage: TAsyncFailMessage;

export function isDifferentStyle(style1: StyleProp, style2: StyleProp): boolean;
export function setStatusStyleDefault(props: any, style: StyleProp): React.ReactNode;
export function withValidation<Props, Instance = mixed>(
    Input: typeof React.Component<Props, Instance>,
    option: ValidationOption<Props, any> | Array<Rule<any>> | Rule<any>
): typeof React.Component<Props, Instance & InputRef>;

export function str(template: MayBe<string>, params: { readonly [key: string]: mixed }): MayBe<string>;
export function setRef<T>(refHandler: RefProp<T>, refObj: T | null): void;