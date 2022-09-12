/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import type {LangFunction} from '../types';
import {Rule} from '../types';
import {Optional, ValidationRule} from '../rules';

export default function validate(
    value: any,
    rules: Array<Rule<any>> | Rule<any>,
    name?: string|null,
    lang?: LangFunction = Rule.defaultLang
): boolean | ?string {
    let arRule: Array<Rule<any>>;
    if (Array.isArray(rules)) {
        arRule = rules;
    }
    else {
        if (rules instanceof Rule) //runtime check
            arRule = [rules];
        else return false;
    }

    arRule = arRule.filter(
        rule => rule instanceof Rule //runtime check
    ).sort(
        (rule1: Rule<any>, rule2: Rule<any>) => (
            rule1.priority < rule2.priority ? -1 :
            rule1.priority > rule2.priority ? 1 :
            0
        )
    );
    if (arRule.length < 1) return false;
    
    ValidationRule.prototype.lang = lang;
    let val = value;
    for (let rule of arRule) {
        rule.name = name;
        rule.setValue(val);
        rule.validate();
        if (rule.isValid) {
            if ((rule instanceof Optional) && !rule.isFilled) return true; //Don't check the rest of rules if the input is optional and not filled
            val = rule.resultValue; //the value (type) may have been converted
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
};