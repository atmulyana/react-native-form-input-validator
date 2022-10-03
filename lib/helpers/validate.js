/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {LangFunction} from '../types';
import {Rule} from '../types';
import {Required, ValidationRule} from '../rules';
import {isFilled} from './common';

export default function validate(
    value: mixed,
    rules: Array<Rule<mixed>> | Rule<mixed>,
    name?: string|null,
    lang?: LangFunction = Rule.defaultLang
): boolean | ?string {
    let arRule: Array<Rule<mixed>>;
    if (Array.isArray(rules)) {
        arRule = rules;
    }
    else {
        if (rules instanceof Rule) //runtime check
            arRule = [rules];
        else return false;
    }

    let required: ?Required = null;
    arRule = arRule.filter(rule => {
        if (rule instanceof Required) required = rule;
        return rule instanceof Rule; //runtime check
    }).sort(
        (rule1: Rule<mixed>, rule2: Rule<mixed>) => (
            rule1.priority < rule2.priority ? -1 :
            rule1.priority > rule2.priority ? 1 :
            0
        )
    );
    if (arRule.length < 1) return false;
    
     //if optional and not filled then don't validate
    if (
        (
            !required //really optional 
            || required.setValue(value).validate().isValid //if the value is empty and valid then it's optional by a condition
        ) 
        && !isFilled(value)
    ) return true;

    ValidationRule.prototype.lang = lang;
    let val = value;
    for (let rule of arRule) {
        rule.name = name;
        rule.setValue(val);
        rule.validate();
        if (rule.isValid) {
            val = rule.resultValue; //the value (type) may have been converted
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
};