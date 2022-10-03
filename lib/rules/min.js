/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {ComparableType, Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Min extends ValidationRule<ComparableType> {
    constructor(min: ComparableType | () => ComparableType) {
        super();
        this.min = min;
        this.setPriority(2);
    }

    min: ComparableType | () => ComparableType;

    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.lang(messages.min);
    }

    validate(): Rule<ComparableType> {
        const min = typeof(this.min) == 'function' ? this.min() : this.min; 
        let valType = typeof this.value,
            limitType = typeof min;
        if (valType == 'bigint') valType = 'number';
        if (limitType == 'bigint') limitType = 'number';

        if (limitType == valType && (
            valType == 'number' || 
            valType == 'string' || 
            (this.value instanceof Date && min instanceof Date)
        ))
            //$FlowIgnore[invalid-compare] We already make sure in `if` condition above that `this.value` and `min` have the same type
            this.isValid = this.value >= min;
        else
            this.isValid = false;
        return this;
    }
}
export const min = (minVal: ComparableType | () => ComparableType): Rule<ComparableType> => new Min(minVal);
