/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Email extends ValidationRule<string> {
    static regex: RegExp = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    get errorMessage(): ?string {
        return this.lang(messages.email);
    }
    validate(): Rule<string> {
        this.isValid = Email.regex.test(this.value);
        return this;
    }
}

export const email: Rule<string> = new Email();
(email: any).setMessageFunc = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to set message function, use `new Email()` instead.");
};
(email: any).setPriority = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to set priority, use `new Email()` instead.");
};