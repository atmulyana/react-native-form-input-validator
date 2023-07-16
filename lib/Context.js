/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import type {ContextDefaultProps, ContextProps, ContextValue, ContextRef, RefProp, InputRef} from './types';
import {AsyncFailMessage} from './types';
import {setRef} from './helpers';
import Rule from "./rules/Rule";

function InternalValidationContext(
    {
        asyncFailMessage,
        auto,
        contextRef,
        errorTextStyle,
        focusOnInvalid,
        inputErrorStyle,
        lang,
        children
    }: { ...ContextProps, contextRef: RefProp<ContextRef>}
): React.Element<typeof Context.Provider> {
    //In fact, `validations` and `ctx` state won't be changed. We use the state for them to get the same object reference in every render
    const [validations] = React.useState<{|
        lastIndex: number,
        refs: Map<number, ?InputRef>,
    |}>({
        lastIndex: 0,
        refs: new Map(),
    });
    const [ctx] = React.useState<ContextValue>({
        asyncFailMessage,
        auto,
        errorTextStyle,
        inputErrorStyle,
        addRef: ref => {
            if (ref.index < 0) ref.index = validations.lastIndex++;
            validations.refs.set(ref.index, ref);
        },
        removeRef: ref => {
            //To retain the order of input appearance in the form, we don't delete the corresponding item in the Map
            //Often, the input is unmounted and then re-mounted
            if (validations.refs.has(ref.index)) validations.refs.set(ref.index, undefined);
        },
    });
    ctx.auto = auto;
    ctx.errorTextStyle = errorTextStyle;
    ctx.inputErrorStyle = inputErrorStyle;
    ctx.lang = lang;
    
    const ref: ContextRef  = {
        clearValidation() {
            validations.refs.forEach(v => v?.clearValidation());
        },
        refreshMessage() {
            validations.refs.forEach(v => v && !v.isValid && v.validate());
        },
        validate(): boolean {
            let isValid: boolean = true;
            let firstInvalid: ?InputRef;
            validations.refs.forEach(v => {
                if (!v) return;
                //isValid &&= v.validate(); //validation will stop at the first invalid input, so we don't use this statement
                const inputIsValid: boolean = v.validate(); //make sure all inputs are validated
                isValid = isValid && inputIsValid;
                if (!isValid && !firstInvalid) firstInvalid = v;
            });
            if (focusOnInvalid && firstInvalid && typeof(firstInvalid.focus) == 'function') firstInvalid.focus();
            return isValid;
        },
        async validateAsync(): Promise<boolean> {
            let isValid: boolean = true;
            let firstInvalid: ?InputRef;
            for (const [,inpRef] of validations.refs) {
                if (!inpRef) continue;
                const inputIsValid: boolean = await inpRef.validateAsync();
                isValid = isValid && inputIsValid;
                if (!isValid && !firstInvalid) firstInvalid = inpRef;
            }
            if (focusOnInvalid && firstInvalid && typeof(firstInvalid.focus) == 'function') firstInvalid.focus();
            return isValid;
        }
    };
    setRef(contextRef, ref);

    return <Context.Provider value={ctx}>
        {children}
    </Context.Provider>;

}
const red = '#dc3545';
const defaultProps: ContextDefaultProps = {
    asyncFailMessage: AsyncFailMessage.Default,
    auto: false,
    focusOnInvalid: false,
    ...StyleSheet.create({
        errorTextStyle: {
            color: red,
            flex: 0,
            fontFamily: 'Arial',
            fontSize: 12,
            lineHeight: 12,
            marginTop: 2,
        },
        inputErrorStyle: {
            borderColor: red,
            color: red,
        },
    }),
    lang: Rule.defaultLang,
};
InternalValidationContext.defaultProps = defaultProps;

const defaultValue: ContextValue = Object.freeze({
    asyncFailMessage: AsyncFailMessage.Default,
    auto: false,
    errorTextStyle: Object.freeze(defaultProps.errorTextStyle),
    inputErrorStyle: Object.freeze(defaultProps.inputErrorStyle),
    addRef: () => {},
    removeRef: () => {},
});
const Context: React.Context<ContextValue> = React.createContext<ContextValue>(defaultValue);

const ValidationContext: React.AbstractComponent<React.Config<ContextProps, ContextDefaultProps>, ContextRef> = React.forwardRef(
    function ValidationContext(props: React.Config<ContextProps, ContextDefaultProps>, ref: RefProp<ContextRef>) {
        return <InternalValidationContext {...props} contextRef={ref} />;
    }
);

export {Context, ValidationContext};