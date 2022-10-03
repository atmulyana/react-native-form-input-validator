/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {min} from '../../lib/rules/min';

test('validation: min on number', () => {
    let val = min(5);
    expect(val.setValue(4).validate().isValid).toBe(false);
    expect(val.setValue(5).validate().isValid).toBe(true);
    expect(val.setValue(6).validate().isValid).toBe(true);
    val = min(() => 5);
    expect(val.setValue(4).validate().isValid).toBe(false);
    expect(val.setValue(5).validate().isValid).toBe(true);
    expect(val.setValue(6).validate().isValid).toBe(true);
});

test('validation: min on string', () => {
    const val = min('e');
    expect(val.setValue('d').validate().isValid).toBe(false);
    expect(val.setValue('e').validate().isValid).toBe(true);
    expect(val.setValue('f').validate().isValid).toBe(true);
});

test('validation: min on Date', () => {
    const val = min(new Date(2022, 8, 10));
    expect(val.setValue(new Date(2022, 8, 9)).validate().isValid).toBe(false);
    expect(val.setValue(new Date(2022, 8, 10)).validate().isValid).toBe(true);
    expect(val.setValue(new Date(2022, 8, 11)).validate().isValid).toBe(true);
});

test('validation: number min againts different type value', () => {
    const val = min(5);
    expect(val.setValue('6').validate().isValid).toBe(false);
    expect(val.setValue(new Date(6)).validate().isValid).toBe(false);
});

test('validation: string min againts different type value', () => {
    const val = min('5');
    expect(val.setValue(6).validate().isValid).toBe(false);
    expect(val.setValue(new Date(6)).validate().isValid).toBe(false);
});

test('validation: Date min againts different type value', () => {
    const val = min(new Date(5));
    expect(val.setValue(6).validate().isValid).toBe(false);
    expect(val.setValue('6').validate().isValid).toBe(false);
});