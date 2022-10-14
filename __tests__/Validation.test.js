/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import Renderer from 'react-test-renderer';
import {StyleSheet, Text, View} from "react-native";
import {Validation} from "../lib/Validation";
import {rule} from '../lib/rules';

let valRef;
const Form = ({value}) =>
    <View style={StyleSheet.absoluteFill}>
        <Validation ref={ref => valRef = ref}
            rules={rule(val => !!val)}
            testID="validation"
            value={value} />
    </View>;

test('render Value with actual value', () => {
    let renderer;
    Renderer.act(() => {
        renderer = Renderer.create(<Form value={false} />);
    });

    //expect(renderer.toJSON()).toMatchSnapshot();

    const form = renderer.root;
    const input = form.findByType(Validation);
    expect(input.props.value).toEqual(false);
    expect(() => input.findByType(Text)).toThrow(); //no error message
    
    Renderer.act(() => {
        valRef.validate();
    });
    expect(() => input.findByType(Text)).not.toThrow(); //an error message exists
});

test('render Value with value as function', () => {
    let renderer, value = true;
    Renderer.act(() => {
        renderer = Renderer.create(<Form value={() => value} />);
    });

    //expect(renderer.toJSON()).toMatchSnapshot();

    const form = renderer.root;
    const input = form.findByType(Validation);
    expect(typeof(input.props.value)).toEqual('function');
    expect(() => input.findByType(Text)).toThrow(); //no error message
    
    expect(input.props.value()).toEqual(true);
    Renderer.act(() => {
        valRef.validate();
    });
    expect(() => input.findByType(Text)).toThrow(); //no error message

    value = false;
    expect(input.props.value()).toEqual(false);
    Renderer.act(() => {
        valRef.validate();
    });
    expect(() => input.findByType(Text)).not.toThrow(); //an error message exists
});