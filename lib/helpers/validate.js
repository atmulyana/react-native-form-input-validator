/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {LangFunction} from '../types';
import Rule from '../rules/Rule';
import {Required, ValidationRuleAsync} from '../rules';
import {isFilled} from './common';

function checkRule<T>(
    value: T,
    rules: Array<Rule<T>> | Rule<T>,
    lang: LangFunction
): boolean | Array<Rule<T>> {
    let arRule: Array<Rule<T>>;
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
        (rule1: Rule<T>, rule2: Rule<T>) => (
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

    Rule.prototype.lang = lang;
    return arRule;
}


export function validate<T>(
    value: T,
    rules: Array<Rule<T>> | Rule<T>,
    name?: string|null,
    lang?: LangFunction = Rule.defaultLang
): boolean | ?string {
    let arRule = checkRule(value, rules, lang);
    if (!Array.isArray(arRule)) return arRule;

    let val = value;
    for (let rule of arRule) {
        rule.name = name;
        rule.setValue(val);
        const sameRule = rule.validate();
        if (sameRule instanceof Promise) {
            let errMessage = "Call `validateAsync` to process asynchronous validation.";
            errMessage += ` \`validate\` method of \`${rule.constructor.name}\` rule returns a \`Promise\` object.`
            if (!(rule instanceof ValidationRuleAsync)) errMessage += " Also, the rule class doesn't inherit class `ValidationRuleAsync`."
            throw errMessage;
        }
        if (rule.isValid) {
            val = rule.resultValue; //the value (type) may have been converted
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
};


export async function validateAsync<T>(
    value: T,
    rules: Array<Rule<T>> | Rule<T>,
    name?: string|null,
    lang?: LangFunction = Rule.defaultLang
): Promise<boolean | ?string> {
    let arRule = checkRule(value, rules, lang);
    if (!Array.isArray(arRule)) return arRule;

    let val = value;
    for (let rule of arRule) {
        rule.name = name;
        rule.setValue(val);
        const promiseRule = rule.validate();
        if (promiseRule instanceof Promise) {
            await promiseRule;
        }
        if (rule.isValid) {
            val = rule.resultValue; //the value (type) may have been converted
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
}
