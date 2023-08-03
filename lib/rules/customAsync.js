/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import {emptyString} from 'javascript-common';
import type {Rule, ValidateFunctionAsync} from '../types';
import messages from '../messages';
import ValidationRuleAsync from './ValidationRuleAsync';

export class CustomRuleAsync extends ValidationRuleAsync<mixed> {
    constructor(validateFunc: ValidateFunctionAsync<mixed>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1001);
    }

    #validate: ValidateFunctionAsync<mixed>;
    #errorMessage: ?string;
    #message: ?string;

    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.#message;
    }

    async validate(): Promise<Rule<mixed>> {
        const validationValue = await new Promise(resolve => {
            this.#validate(this.value, resolve);
        });
        this.isValid = validationValue === true;
        
        if (this.isValid) {
            this.#message = null;
        }
        else {
            const msg = (typeof(validationValue) == 'string') ? validationValue.trim() :
                        this.#errorMessage                    ? this.#errorMessage.trim() :
                                                                emptyString;
            this.#message = msg || this.lang(messages.invalid);
        }
        
        return this;
    }
}
export const ruleAsync = (validateFunc: ValidateFunctionAsync<mixed>, errorMessage?: string): CustomRuleAsync => new CustomRuleAsync(validateFunc, errorMessage);