/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {required} from '../../lib/rules/required';

test('validation: required', () => {
    expect(required.setValue(undefined).validate().isValid).toBe(false);
    expect(required.setValue(null).validate().isValid).toBe(false);
    expect(required.setValue('').validate().isValid).toBe(false);
    expect(required.setValue('  ').validate().isValid).toBe(false);
    expect(required.setValue(0).validate().isValid).toBe(true);
    expect(required.setValue(false).validate().isValid).toBe(true);
    expect(required.setValue('value').validate().isValid).toBe(true);
    expect(required.setValue(new Date()).validate().isValid).toBe(true);
});