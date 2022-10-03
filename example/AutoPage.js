/**
 * Sample of how to use react-native-form-input-validator package
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import * as React from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
} from 'react-native';
import styles from './styles';
import {
    ValidationContext,
    withValidation,
} from "react-native-form-input-validator";
import {
    email,
    required,
} from 'react-native-form-input-validator/rules';

const Input1 = withValidation(TextInput, email);
let Input2 = withValidation(TextInput, {
    auto: false,
    rules: [email, required]
});

export default () => {
    const validation = React.useRef(null);
    const [isAuto, setAuto] = React.useState(true);
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('');

    return <ValidationContext ref={validation} auto={isAuto} focusOnInvalid={true}>
        <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold', lineHeight: 20, marginBottom: 10, textAlign: 'center'}]}>Auto Validation</Text>
        <Text style={[styles.text, {marginBottom: 10}]}>Enter the email address to both inputs.</Text>

        <View style={styles.inputRow}>
            <Text style={styles.label}>{isAuto ? 'Auto' : 'Not Auto'}</Text>
            <Input1 onChangeText={setValue1} style={styles.textInput} value={value1} />
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>{isAuto ? 'Not Auto' : 'Auto'}</Text>
            <Input2 onChangeText={setValue2} style={styles.textInput} value={value2} />
        </View>
        <View style={[styles.inputRow, {justifyContent: 'space-between'}]}>
            <Button 
                onPress={() => {
                    Input2 = withValidation(TextInput, {
                        auto: isAuto,
                        rules: [email, required]
                    });
                    setAuto(auto => !auto);
                }}
                title="Switch Auto"
            />
            <Button onPress={() => validation.current?.validate()} title="Validate" />
            <Button onPress={() => validation.current?.clearValidation()} title="Clear Validation" />
        </View>
    </ValidationContext>;
}