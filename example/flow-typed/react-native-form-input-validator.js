/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import * as React from 'react'
import type {
    ComparableType,
    ContextProps,
    ContextRef,
    MessageFunction,
    RefProp,
    StrLengthType,
    StyleProp,
    ValidateFunction,
    ValidationOption,
    ValidationProps,
    InputRef,
//$FlowIgnore[cannot-resolve-module]
} from '../../lib/types';
//$FlowIgnore[cannot-resolve-module]
import {Rule} from '../../lib/types';

declare module "react-native-form-input-validator" {
    declare export var ValidationContext: React.AbstractComponent<ContextProps, ContextRef>;

    declare export class Validation extends React.Component<ValidationProps> {
        constructor(props: ValidationProps): void;
        get isValid(): boolean;
        validate(): boolean;
        clearValidation(): void;
    }

    declare export function isDifferentStyle(style1: StyleProp, style2: StyleProp): boolean;
    declare export function setStatusStyleDefault(props: {...}, style: StyleProp): React.Node;
    declare export function withValidation<Props: {...}, Instance>(
        Input: React.AbstractComponent<Props, Instance>,
        option: ValidationOption<Props> | Array<Rule<mixed>> | Rule<mixed>
    ): React.AbstractComponent<Props, Instance & InputRef>;
}

declare module "react-native-form-input-validator/rules" {
    declare export default class ValidationRule<T> extends Rule<T> {
        constructor(): void;
        get priority(): number;
        get errorMessage(): ?string;
        get messageFunc(): MessageFunction<T>;
        get value(): T;
        get resultValue(): mixed;
    
        setMessageFunc(func: MessageFunction<T>): Rule<T>;
        setName(name: string): Rule<T>;
        setValue(value: T): Rule<T>;
        setPriority(priority: number): Rule<T>;
        validate(): Rule<T>;
    }
    
    declare export class CustomRule extends ValidationRule<mixed> {
        constructor(validateFunc: ValidateFunction<mixed>, errorMessage?: string): void;
    }
    declare export function rule(validateFunc: ValidateFunction<mixed>, errorMessage?: string): Rule<mixed>;
    
    declare export class Email extends ValidationRule<string> {}
    declare export var email: Rule<string>;
    
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
    
    declare export class Required extends ValidationRule<mixed> {
        constructor(_if?: mixed => boolean): void;
        static If(_if: mixed => boolean): Required;
    }
    declare class RequiredIf extends Required {
        if: (mixed => boolean) => Required;
    }
    declare export var required: RequiredIf;
    declare export var alwaysValid: Required;
    
    declare export class StrLength extends ValidationRule<StrLengthType> {
        constructor(min?: number, max?: number): void;
        min: number | void;
        max: number | void;
    }
    declare export function strlen(min: number, max?: number): Rule<StrLengthType>;
    declare export function strlenmax(max: number): Rule<StrLengthType>;
}

declare module "react-native-form-input-validator/lib/types" {
    declare export interface Ref {
        clearValidation(): void,
        validate(): boolean,
    }
    
    declare export interface ContextRef extends Ref {
        refreshMessage(): void,
    }
    
    declare export interface InputRef extends Ref {
        focus?: () => mixed,
        index: number,
        +isValid: boolean,
    }
}