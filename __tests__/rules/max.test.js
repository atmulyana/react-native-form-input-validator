/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {max} from '../../lib/rules/max';

test('validation: max on number', () => {
    let val = max(5);
    expect(val.setValue(4).validate().isValid).toBe(true);
    expect(val.setValue(5).validate().isValid).toBe(true);
    expect(val.setValue(6).validate().isValid).toBe(false);
    val = max(() => 5);
    expect(val.setValue(4).validate().isValid).toBe(true);
    expect(val.setValue(5).validate().isValid).toBe(true);
    expect(val.setValue(6).validate().isValid).toBe(false);
});

test('validation: max on string', () => {
    const val = max('e');
    expect(val.setValue('d').validate().isValid).toBe(true);
    expect(val.setValue('e').validate().isValid).toBe(true);
    expect(val.setValue('f').validate().isValid).toBe(false);
});

test('validation: max on Date', () => {
    const val = max(new Date(2022, 8, 10));
    expect(val.setValue(new Date(2022, 8, 9)).validate().isValid).toBe(true);
    expect(val.setValue(new Date(2022, 8, 10)).validate().isValid).toBe(true);
    expect(val.setValue(new Date(2022, 8, 11)).validate().isValid).toBe(false);
});

test('validation: number max againts different type value', () => {
    const val = max(5);
    expect(val.setValue('4').validate().isValid).toBe(false);
    expect(val.setValue(new Date(4)).validate().isValid).toBe(false);
});

test('validation: string max againts different type value', () => {
    const val = max('5');
    expect(val.setValue(4).validate().isValid).toBe(false);
    expect(val.setValue(new Date(4)).validate().isValid).toBe(false);
});

test('validation: Date max againts different type value', () => {
    const val = max(new Date(5));
    expect(val.setValue(4).validate().isValid).toBe(false);
    expect(val.setValue('4').validate().isValid).toBe(false);
});