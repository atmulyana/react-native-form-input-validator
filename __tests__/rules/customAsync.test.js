/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {ruleAsync} from '../../lib/rules/customAsync';

function createPredicate(returnValue) {
    return function(value, resolve) {
        setTimeout(() => resolve(returnValue), 100);
    }
}

test('validation: customAsync rule validates to true', async () => {
    const val = await ruleAsync(createPredicate(true)).validate();
    expect(val.isValid).toBe(true);
    expect(val.errorMessage).toBe(null);
});

test('validation: customAsync rule validates to false', async () => {
    const val = await ruleAsync(createPredicate(false)).validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('invalid');
});

test('validation: customAsync rule validates to false with message', async () => {
    const val = await ruleAsync(createPredicate(false), 'abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('abc');
});

test('validation: customAsync rule validates to false with message from predicate', async () => {
    const val = await ruleAsync(createPredicate('error'), 'abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('error');
});