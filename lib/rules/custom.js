/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {Rule, ValidateFunction} from '../types';
import messages from '../messages';
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
        
        if (this.isValid) {
            this.#message = null;
        }
        else {
            const msg = (typeof(validationValue) == 'string') ? validationValue.trim() :
                        this.#errorMessage                    ? this.#errorMessage.trim() :
                                                                '';
            this.#message = msg || this.lang(messages.invalid);
        }
        
        return this;
    }
}
export const rule = (validateFunc: ValidateFunction<mixed>, errorMessage?: string): Rule<mixed> => new CustomRule(validateFunc, errorMessage);
