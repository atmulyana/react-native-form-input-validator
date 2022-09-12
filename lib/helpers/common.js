/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import type {LangFunction, RefProp} from '../types';

const reVarNameHolders = /\$\{([_a-zA-Z][_a-zA-Z0-9]*)\}/g;

export const str = (template: ?string, params: Object): ?string => template &&
    template.replace(reVarNameHolders, function(_, p1: string): string {
        const value: any = params[p1];
        if (value !== null && value !== undefined && typeof value != 'function') return value + '';
        return '';
    });

export function isFilled(value: any): boolean {
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