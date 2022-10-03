/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {ComparableType, Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Max extends ValidationRule<ComparableType> {
    constructor(max: ComparableType | () => ComparableType) {
        super();
        this.max = max;
        this.setPriority(2);
    }

    max: ComparableType | () => ComparableType;

    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.lang(messages.max);
    }

    validate(): Rule<ComparableType> {
        const max = typeof(this.max) == 'function' ? this.max() : this.max; 
        let valType = typeof this.value,
            limitType = typeof max;
        if (valType == 'bigint') valType = 'number';
        if (limitType == 'bigint') limitType = 'number';

        if (limitType == valType && (
            valType == 'number' || 
            valType == 'string' || 
            (this.value instanceof Date && max instanceof Date)
        ))
            //$FlowIgnore[invalid-compare] We already make sure in `if` condition above that `this.value` and `max` have the same type
            this.isValid = this.value <= max;
        else
            this.isValid = false;
        return this;
    }
}
export const max = (maxVal: ComparableType | () => ComparableType): Rule<ComparableType> => new Max(maxVal);
