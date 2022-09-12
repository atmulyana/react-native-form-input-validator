/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Numeric extends ValidationRule<string> {
    static regex: RegExp = /^(\+|-)?(\d+(\.\d+)?|\.\d+)$/;
    get errorMessage(): ?string {
        return this.lang(messages.numeric);
    }
    get resultValue(): mixed {
        return parseFloat(this.value);
    }
    validate(): Rule<string> {
        this.isValid = Numeric.regex.test(this.value);
        return this;
    }
}

export const numeric: Rule<string> = new Numeric();
(numeric: any).setMessageFunc = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set message function, use `new Numeric()` instead.");
};
(numeric: any).setPriority = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set priority, use `new Numeric()` instead.");
};