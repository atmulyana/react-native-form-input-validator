/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Numeric extends ValidationRule<string> {
    static regex: RegExp = /^(\+|-)?(\d+(\.\d+)?|\.\d+)$/;
    
    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.lang(messages.numeric);
    }
    
    //$FlowIgnore[unsafe-getters-setters]
    get resultValue(): any {
        return parseFloat(this.value);
    }
    
    validate(): Rule<string> {
        this.isValid = Numeric.regex.test(this.value);
        return this;
    }
}

export const numeric: Rule<string> = new Numeric();
//$FlowIgnore[cannot-write]
numeric.setMessageFunc = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set message function, use `new Numeric()` instead.");
};
//$FlowIgnore[cannot-write]
numeric.setPriority = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set priority, use `new Numeric()` instead.");
};