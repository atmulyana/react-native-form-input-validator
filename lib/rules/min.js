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
    constructor(min: ComparableType) {
        super();
        this.min = min;
        this.setPriority(2);
    }

    min: ComparableType;

    get priority(): number {return 2}
    get errorMessage(): ?string {
        return this.lang(messages.min);
    }

    validate(): Rule<ComparableType> {
        let valType = typeof this.value,
            limitType = typeof this.min;
        if (valType == 'bigint') valType = 'number';
        if (limitType == 'bigint') limitType = 'number';

        if (limitType == valType && (
            valType == 'number' || 
            valType == 'string' || 
            (this.value instanceof Date && this.min instanceof Date)
        ))
            this.isValid = (this.value: any) >= this.min;
        else
            this.isValid = false;
        return this;
    }
}
export const min = (minVal: ComparableType): Rule<ComparableType> => new Min(minVal);
