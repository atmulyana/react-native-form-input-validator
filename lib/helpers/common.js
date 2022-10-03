/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import type {LangFunction, RefProp} from '../types';
import {Rule} from '../types';

const reVarNameHolders = /\$\{([_a-zA-Z][_a-zA-Z0-9]*)\}/g;
const dontReadRuleMembers = {errorMessage: 1, lang: 1, messageFunc: 1, setMessageFunc: 1, setName: 1, setPriority: 1, setValue: 1, validate: 1};
interface FreeObject {
    +[key: string]: mixed
}
export const str = (template: ?string, params: FreeObject): ?string => template &&
    template.replace(reVarNameHolders, function(_, p1: string): string {
        let value: any = params[p1];
        if (params instanceof Rule) {
            if (p1 in dontReadRuleMembers) value = '';
            else if (typeof value == 'function') try { value = value(); } catch{}
        }
        if (value !== null && value !== undefined && typeof value != 'function') return value + '';
        return '';
    });

export function isFilled(value: mixed): boolean {
    if (typeof(value) == 'string') {
        return !!value.trim();
    }
    else {
        return value !== undefined && value !== null;
    }
}

export function setRef<T>(refHandler: RefProp<T>, refObj: T | null) {
    if (typeof(refHandler) == 'function') refHandler(refObj);
    else if (refHandler && typeof(refHandler) == 'object') refHandler.current = refObj;
}