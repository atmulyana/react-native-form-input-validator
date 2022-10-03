/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule, ValidateFunction} from '../types';
import ValidationRule from './ValidationRule';

export class CustomRule extends ValidationRule<mixed> {
    constructor(validateFunc: ValidateFunction<mixed>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1000);
    }

    #validate: ValidateFunction<mixed>;
    #errorMessage: ?string;
    #message: ?string;

    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.#message;
    }

    validate(): Rule<mixed> {
        const validationValue = this.#validate(this.value); //It may return true if valid or an error message
        this.isValid = validationValue === true;
        let msg: ?string;
        this.#message = this.isValid                         ? null : 
                       (typeof(validationValue) == 'string') ? validationValue : 
                        (msg = this.#errorMessage?.trim())   ? msg :
                                                               this.lang('invalid');
        return this;
    }
}
export const rule = (validateFunc: ValidateFunction<mixed>, errorMessage?: string): Rule<mixed> => new CustomRule(validateFunc, errorMessage);
