/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import {emptyString} from "javascript-common";
import type {Rule, StrLengthType} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class StrLength extends ValidationRule<StrLengthType> {
    constructor(min?: number, max?: number) {
        super();
        this.min = min;
        this.max = max;
    }

    min: number | void;
    max: number | void;

    #message: ?string;
    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.#message;
    }

    validate(): Rule<StrLengthType> {
        this.#message = emptyString;
        var strVal = this.value+emptyString;
        if (this.min !== undefined && strVal.length < this.min) this.#message = this.lang(messages.strlenmin);
        if (this.max !== undefined && strVal.length > this.max) this.#message = this.lang(messages.strlenmax);
        this.isValid = !this.#message;
        return this;
    }
}
export const strlen = (min: number, max?: number): StrLength => new StrLength(min, max);
export const strlenmax = (max: number): StrLength => new StrLength(undefined, max);
