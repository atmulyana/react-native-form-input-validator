/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {optional} from '../../lib/rules/optional';
import {required} from '../../lib/rules/required';
import {numeric} from '../../lib/rules/numeric';
import {min} from '../../lib/rules/min';
import {validate} from '../../lib/helpers';


test('validation: validate with optional rule', () => {
    const rules = [min(5), numeric, optional];
    expect(validate('', rules)).toBe(true);
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});

test('validation: validate with required rule', () => {
    const rules = [min(5), numeric, required];
    expect(validate('', rules)).toContain('required');
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});