/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import Renderer from 'react-test-renderer';
import {StyleSheet, Text, TextInput, View} from "react-native";
import {setStatusStyleDefault, withValidation} from "../lib/Validation";
import {required} from '../lib/rules';

const Input = withValidation(TextInput, {
    rules: [required],
    setStatusStyle: setStatusStyleDefault,
});

let inputRef;
const Form = () =>
    <View style={StyleSheet.absoluteFill}>
        <Input ref={ref => inputRef = ref}
            testID="input"
            style={{
                borderColor: 'gray',
                borderWidth: 1,
                height: 20,
                width: 100
            }} />
    </View>;

test('render input withValidation', () => {
    let renderer;
    Renderer.act(() => {
        renderer = Renderer.create(<Form />);
    });

    //expect(renderer.toJSON()).toMatchSnapshot();

    const form = renderer.root;
    const input = form.findByType(TextInput);
    const inputContainer = input.parent;
    //const inputRef = input.instance;

    expect(inputContainer.props.style).toEqual({width: 100});
    expect(input.props.style).toEqual({
        borderColor: 'gray',
        borderWidth: 1,
        height: 20,
    });
    expect(input.props.testID).toBe('input');

    expect(inputRef).not.toBeFalsy();
    expect(typeof inputRef.validate).toBe('function');
    expect(typeof inputRef.clearValidation).toBe('function');
    expect(inputRef.isValid).toBe(true);

    Renderer.act(() => {
        inputRef.validate();
    });
    expect(inputRef.isValid).toBe(false);
    expect(inputContainer.children[1]?.type).toBe(Text);
    expect(inputContainer.children[1].props.children).toBe('required');
    expect(StyleSheet.flatten(input.props.style).borderColor).not.toBe('gray'); //red

    Renderer.act(() => {
        inputRef.clearValidation();
    });
    expect(inputRef.isValid).toBe(true);
    expect(inputContainer.children[1]).toBeUndefined();
    expect(input.props.style.borderColor).toBe('gray');
});