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
        this.#errorMessage = errorMessage;
        this.setPriority(1000);
    }

    #validate: ValidateFunction<mixed>;
    #errorMessage: ?string;
    #message: ?string;

    get errorMessage(): ?string {
        return this.#message;
    }

    validate(): Rule<mixed> {
        const validationValue = this.#validate(this.value); //It may return true if valid or an error message
        this.isValid = validationValue === true;
        this.#message = this.isValid                         ? null : 
                       (typeof(validationValue) == 'string') ? validationValue : 
                                                               (this.#errorMessage ?? this.lang('invalid'));
        return this;
    }
}
export const rule = (validateFunc: ValidateFunction<mixed>, errorMessage?: string): Rule<mixed> => new CustomRule(validateFunc, errorMessage);
