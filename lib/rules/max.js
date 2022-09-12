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
    constructor(max: ComparableType) {
        super();
        this.max = max;
        this.setPriority(2);
    }

    max: ComparableType;

    get errorMessage(): ?string {
        return this.lang(messages.max);
    }

    validate(): Rule<ComparableType> {
        let valType = typeof this.value,
            limitType = typeof this.max;
        if (valType == 'bigint') valType = 'number';
        if (limitType == 'bigint') limitType = 'number';

        if (limitType == valType && (
            valType == 'number' || 
            valType == 'string' || 
            (this.value instanceof Date && this.max instanceof Date)
        ))
            this.isValid = (this.value: any) <= this.max;
        else
            this.isValid = false;
        return this;
    }
}
export const max = (maxVal: ComparableType): Rule<ComparableType> => new Max(maxVal);
