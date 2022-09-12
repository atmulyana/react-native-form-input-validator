/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';
 
export class Integer extends ValidationRule<mixed> {
    constructor() {
        super();
        this.setPriority(1);
    }

    get errorMessage(): ?string {
        return this.lang(messages.integer);
    }
    validate(): Rule<mixed> {
        this.isValid = Number.isInteger(this.value);
        return this;
    }
}

export const integer: Rule<mixed> = new Integer();
(integer: any).setMessageFunc = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to set message function, use `new Integer()` instead.");
};
(integer: any).setPriority = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to set priority, use `new Integer()` instead.");
};