/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule} from '../types';
import {isFilled} from '../helpers';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Required extends ValidationRule<mixed> {
    get priority(): number {return -Number.MAX_VALUE}
    get errorMessage(): ?string {
        return this.lang(messages.required);
    }
    // get resultValue(): mixed {
    //     return typeof(this.value) == 'string' ? this.value.trim() : this.value;
    // }

    validate(): Rule<mixed> {
        this.isValid = isFilled(this.value);
        return this;
    }
}

export const required: Rule<mixed> = new Required();
(required: any).setMessageFunc = function() {
    throw new Error("`required` rule object is shared among inputs. If you want to set message function, use `new Required()` instead.");
}
