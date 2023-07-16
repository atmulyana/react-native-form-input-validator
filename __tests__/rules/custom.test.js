/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {rule} from '../../lib/rules/custom';

test('validation: custom rule validates to true', () => {
    const val = rule(() => true).validate();
    expect(val.isValid).toBe(true);
    expect(val.errorMessage).toBe(null);
});

test('validation: custom rule validates to false', () => {
    const val = rule(() => false).validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('invalid');
});

test('validation: custom rule validates to false with message', () => {
    const val = rule(() => false, 'abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('abc');
});

test('validation: custom rule validates to false with message from predicate', () => {
    const val = rule(() => 'error', 'abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('error');
});