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

declare class ValidationContext extends React.Component<ContextProps> implements ContextRef{}
declare class Validation extends React.Component<ValidationProps> implements InputRef {}
export {ValidationContext, Validation};

export var AsyncFailMessage: TAsyncFailMessage;

export function isDifferentStyle(style1: StyleProp, style2: StyleProp): boolean;
export function setStatusStyleDefault(props: any, style: StyleProp): React.ReactNode;
export function withValidation<Props, Instance = mixed>(
    Input: typeof React.Component<Props, Instance>,
    option: ValidationOption<Props, any> | Array<Rule<any>> | Rule<any>
): typeof React.Component<Props, Instance & InputRef>;

export function str(template: MayBe<string>, params: { readonly [key: string]: mixed }): MayBe<string>;
export function setRef<T>(refHandler: RefProp<T>, refObj: T | null): void;