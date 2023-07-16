/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {min, numeric, required, ValidationRule, ValidationRuleAsync} from '../../lib/rules';
import {validate, validateAsync} from '../../lib/helpers';

let asyncRuleValid = false;
class AsyncRule extends ValidationRuleAsync {
    constructor() {
        super();
        this.setPriority(1);
    }

    get errorMessage() {
        return 'invalid async';
    }

    async validate() {
        return new Promise(resolve => {
            this.isValid = asyncRuleValid;
            setTimeout(
                () => resolve(this),
                300
            );
        })
    }
}

class Rule1 extends ValidationRule {
    validate() {
        return Promise.resolve(this);
    }
}

class Rule2 extends ValidationRuleAsync {
    validate() {
        return Promise.resolve(this);
    }
}


test('validation: `validate` with optional rule', () => {
    const rules = [min(5), numeric];
    expect(validate('', rules)).toBe(true);
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});

test('validation: `validate` with required rule', () => {
    const rules = [min(5), numeric, required];
    expect(validate('', rules)).toContain('required');
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});

test('validation: `ValidationRuleAsync` is examined at the right order', async () => {
    const rules = [numeric, new AsyncRule(), min(5)];
    asyncRuleValid = false;
    expect(await validateAsync('4', rules)).toBe('invalid async');
    asyncRuleValid = true;
    expect(await validateAsync('4', rules)).toContain('minimum');
});

test('validation: `validate` throws an errow when examining async rule', () => {
    expect( () => validate('123', new Rule1()) )
        .toThrow(/^Call `validateAsync` to process asynchronous validation\. `validate` method of `Rule1` rule returns a `Promise` object\. Also, the rule class doesn't inherit class `ValidationRuleAsync`\.$/);
    expect( () => validate('123', new Rule2()) )
        .toThrow(/^Call `validateAsync` to process asynchronous validation\. `validate` method of `Rule2` rule returns a `Promise` object\.$/);
});