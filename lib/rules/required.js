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
    constructor(_if?: mixed => boolean) {
        super();
        this.#if = _if;
    }

    static If(_if: mixed => boolean): Required {
        return new Required(_if);
    }

    #if: ?(mixed => boolean);

    //$FlowIgnore[unsafe-getters-setters]
    get priority(): number {return -Number.MAX_VALUE}

    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.lang(messages.required);
    }

    // get resultValue(): mixed {
    //     return typeof(this.value) == 'string' ? this.value.trim() : this.value;
    // }

    validate(): Rule<mixed> {
        if (typeof this.#if == 'function') {
            if (this.#if(this.value)) this.isValid = isFilled(this.value);
            else this.isValid = true;
        }
        else {
            this.isValid = isFilled(this.value);
        }
        return this;
    }
}

class RequiredIf extends Required {
    if: (mixed => boolean) => Required = Required.If.bind(null);
}

export const required: RequiredIf = new RequiredIf();
//$FlowIgnore[cannot-write]
required.setMessageFunc = function() {
    throw new Error("`required` rule object is shared among inputs. If you want to set message function, use `new Required()` instead.");
}

const isFalse = () => false;
export const alwaysValid: Required = Required.If(isFalse);