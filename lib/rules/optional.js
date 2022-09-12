/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule} from '../types';
import {isFilled} from "../helpers";
import ValidationRule from "./ValidationRule";

export class Optional extends ValidationRule<mixed> {
    get priority(): number {return -Number.MAX_VALUE}
    get errorMessage(): ?string {
        return null; //always true
    }
    // get resultValue(): mixed {
    //     return typeof(this.value) == 'string' ? this.value.trim() : this.value;
    // }

    isValid: boolean = true;
    isFilled: boolean = false;

    validate(): Rule<mixed> {
        this.isValid = true;
        this.isFilled = isFilled(this.value);
        return this;
    }
}
export const optional: Rule<mixed> = new Optional();
