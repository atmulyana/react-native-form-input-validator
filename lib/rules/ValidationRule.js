/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {LangFunction, MessageFunction} from '../types';
import {Rule} from '../types';
import {str} from '../helpers/common';
import messages from '../messages';

export default class ValidationRule<T> extends Rule<T> {
    constructor() {
        super();

        let _this: ValidationRule<T> = this;
        /* We need the prototype's `errorMessage` getter function to get the prototype's `errorMessage` value
          because `Object.getPrototypeOf(this).errorMessage` will fail to access the fields of `this`. The getter
          function, as a function in general, can be bound to `this` as the context object. */
        let getErrorMessage: (() => ?string) | void;
        while(!getErrorMessage && (_this instanceof Rule)) {
            //$FlowIgnore[incompatible-type]  In fact, _this' type is descendant of `ValidationRule`
            _this = Object.getPrototypeOf(_this);
            getErrorMessage = Object.getOwnPropertyDescriptor(_this, 'errorMessage')?.get?.bind(this);
        }
        _this = this;

        /* $FlowIgnore[cannot-write]  In javascript, `errorMessage` can be re-defined */
        Object.defineProperty(this, 'errorMessage', {
            get(): ?string { 
                let message: ?string;
                if (_this.#messageFunc) message = _this.#messageFunc(_this);
                if (!message) message = getErrorMessage && getErrorMessage();
                return str(message, _this);
            }
        })
    }
    
    #priority: number = 0;
    #messageFunc: MessageFunction<T>;
    #value: T;
    
    get priority(): number {return this.#priority}
    get errorMessage(): ?string {
        return this.lang(messages.invalid);
    }
    get messageFunc(): MessageFunction<T> {
        return this.#messageFunc;
    }
    get value(): T {
        return this.#value;
    }
    get resultValue(): mixed {
        return this.#value;
    }

    setMessageFunc(func: MessageFunction<T>): Rule<T> {
        if (typeof func == 'function') //runtime check
            this.#messageFunc = func;
        else
            this.#messageFunc = null;
        return this;
    }

    setName(name: string): Rule<T> {
        this.name = name;
        return this;
    }

    setValue(value: T): Rule<T> {
        this.#value = value;
        return this;
    }

    setPriority(priority: number): Rule<T> {
        this.#priority = priority;
        return this;
    }
    
    validate(): Rule<T> {
        return this;
    }
}

{
    let _lang = Rule.defaultLang;
    const translate: LangFunction = (s: string) => _lang(s) + ''; //make sure it always returns string (for runtime)
    Object.defineProperty(ValidationRule.prototype, 'lang', {
        get(): LangFunction {
            return translate;
        },
        set(f: LangFunction) {
            if (typeof f == 'function') //runtime check
                _lang = f;
            else _lang = Rule.defaultLang;
        }
    });
}