/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
 import type {Rule} from '../types';
 import ValidationRule from './ValidationRule';
 
 export class Regex extends ValidationRule<string> {
     constructor(pattern: RegExp | string, flags?: string) {
         super();
         if (typeof pattern == 'string') this.#regex = new RegExp(pattern, flags);
         else if (pattern instanceof RegExp) this.#regex = pattern;
         else throw new Error('Ivalid `regex` parameter');
         this.setPriority(999);
     }
 
     #regex: RegExp;
     
     validate(): Rule<string> {
         this.isValid = this.#regex.test(this.value); 
         return this;
     }
 }
 export const regex = (pattern: RegExp | string, flags?: string): Rule<string> => new Regex(pattern, flags);