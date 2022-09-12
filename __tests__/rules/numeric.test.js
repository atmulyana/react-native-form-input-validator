/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {numeric, Numeric} from '../../lib/rules/numeric';

test('validation: numeric', () => {
    expect(numeric.setValue('.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-.2').validate().isValid).toBe(true);
    expect(numeric.setValue('1.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-1.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-123').validate().isValid).toBe(true);
    expect(numeric.setValue('123').validate().isValid).toBe(true);
    expect(numeric.setValue('+123').validate().isValid).toBe(true);
    expect(numeric.setValue('123abc').validate().isValid).toBe(false);
    expect(numeric.setValue('').validate().isValid).toBe(false);
});

test('validation: dissallowing setMessageFunc call on `numeric`', () => {
    expect(() => numeric.setMessageFunc(() => '')).toThrow();
    expect(() => new Numeric().setMessageFunc(() => '')).not.toThrow();
});

test('validation: dissallowing setPriority call on `numeric`', () => {
    expect(() => numeric.setPriority(0)).toThrow();
    expect(() => new Numeric().setPriority(0)).not.toThrow();
});