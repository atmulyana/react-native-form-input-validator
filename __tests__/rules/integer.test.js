/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {integer, Integer} from '../../lib/rules/integer';

test('validation: email', () => {
    expect(integer.setValue(123).validate().isValid).toBe(true);
    expect(integer.setValue(-123).validate().isValid).toBe(true);
    expect(integer.setValue(0).validate().isValid).toBe(true);
    expect(integer.setValue(123.45).validate().isValid).toBe(false);
    expect(integer.setValue(-123.45).validate().isValid).toBe(false);
    expect(integer.setValue('123').validate().isValid).toBe(false);
    expect(integer.setValue(null).validate().isValid).toBe(false);
    expect(integer.setValue(true).validate().isValid).toBe(false);
    expect(integer.setValue({}).validate().isValid).toBe(false);
});

test('validation: dissallowing setMessageFunc call on `integer`', () => {
    expect(() => integer.setMessageFunc(() => '')).toThrow();
    expect(() => new Integer().setMessageFunc(() => '')).not.toThrow();
});

test('validation: dissallowing setPriority call on `integer`', () => {
    expect(() => integer.setPriority(0)).toThrow();
    expect(() => new Integer().setPriority(0)).not.toThrow();
});