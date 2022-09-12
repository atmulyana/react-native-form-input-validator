/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {optional} from '../../lib/rules/optional';

test('validation: optional', () => {
    expect(optional.setValue(undefined).validate().isFilled).toBe(false);
    expect(optional.setValue(null).validate().isFilled).toBe(false);
    expect(optional.setValue('').validate().isFilled).toBe(false);
    expect(optional.setValue('  ').validate().isFilled).toBe(false);
    expect(optional.setValue(0).validate().isFilled).toBe(true);
    expect(optional.setValue(false).validate().isFilled).toBe(true);
    expect(optional.setValue('value').validate().isFilled).toBe(true);
    expect(optional.setValue(new Date()).validate().isFilled).toBe(true);
});