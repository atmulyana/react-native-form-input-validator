/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import Renderer from 'react-test-renderer';
import {TextInput, View} from "react-native";
import {ValidationContext, withValidation} from "../lib";
import {required} from '../lib/rules';

const Input1 = withValidation(TextInput, required);
const Input2 = withValidation(TextInput, {rules: required});

let contextRef, inputRef1, inputRef2;
const Form = () =>
    <ValidationContext ref={ref => contextRef = ref}>
        <Input1 ref={ref => inputRef1 = ref} />
        <Input2 ref={ref => inputRef2 = ref} />
    </ValidationContext>;

test('render ValidationContext', () => {
    let renderer;
    Renderer.act(() => {
        renderer = Renderer.create(<Form />);
    });

    expect(contextRef).not.toBeFalsy();
    expect(typeof contextRef.validate).toBe('function');
    expect(typeof contextRef.clearValidation).toBe('function');
    expect(typeof contextRef.refreshMessage).toBe('function');
    
    expect(inputRef1).not.toBeFalsy();
    expect(typeof inputRef1.validate).toBe('function');
    expect(typeof inputRef1.clearValidation).toBe('function');
    expect(inputRef1.isValid).toBe(true);

    expect(inputRef2).not.toBeFalsy();
    expect(typeof inputRef2.validate).toBe('function');
    expect(typeof inputRef2.clearValidation).toBe('function');
    expect(inputRef2.isValid).toBe(true);

    Renderer.act(() => {
        expect(contextRef.validate()).toBe(false);
    });
    expect(inputRef1.isValid).toBe(false);
    expect(inputRef2.isValid).toBe(false);

    Renderer.act(() => {
        contextRef.clearValidation();
    });
    expect(inputRef1.isValid).toBe(true);
    expect(inputRef2.isValid).toBe(true);
});