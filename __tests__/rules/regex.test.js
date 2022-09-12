/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {regex} from '../../lib/rules/regex';

test('validation: numeric', () => {
    const reObj = regex(/^\d+$/);
    expect(reObj.setValue('123').validate().isValid).toBe(true);
    expect(reObj.setValue('123abc').validate().isValid).toBe(false);

    const reStr = regex("^\\d+$");
    expect(reStr.setValue('123').validate().isValid).toBe(true);
    expect(reStr.setValue('123abc').validate().isValid).toBe(false);
});