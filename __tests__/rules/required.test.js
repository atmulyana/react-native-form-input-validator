/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {required, Required} from '../../lib/rules/required';

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

test('validation: Required.If', () => {
    expect(Required.If(() => true).setValue(undefined).validate().isValid).toBe(false);
    expect(Required.If(() => false).setValue(undefined).validate().isValid).toBe(true);
    expect(Required.If(() => true).setValue('value').validate().isValid).toBe(true);
    expect(Required.If(() => false).setValue('value').validate().isValid).toBe(true);
});

test('validation: dissallowing setMessageFunc call on `required`', () => {
    expect(() => required.setMessageFunc(() => '')).toThrow();
    expect(() => new Required().setMessageFunc(() => '')).not.toThrow();
});