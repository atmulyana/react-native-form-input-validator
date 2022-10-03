/**
 * Sample of how to use react-native-form-input-validator package
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import React from 'react';
import {
    Alert,
    Button,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    ValidationContext,
    withValidation,
} from "react-native-form-input-validator";
import {
    //Required,
    required,
    rule,
    strlen,
} from 'react-native-form-input-validator/rules';
import styles from './styles';

export default class extends React.Component {
    state = {
        password: '',
        confirmPassword: '',
    };
    validationRef = React.createRef();
    passwordRef = React.createRef();

    constructor(props) {
        super(props);

        this.Password = withValidation(TextInput, [
            required,
            strlen(8),
            rule(
                value => {
                    return /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z\d\s]/.test(value);
                },
                'The password must contain capital and non capital letter, number and non-alphanumeric characters'
            ),
        ]);
        this.ConfirmPassword = withValidation(TextInput, [
            /*Required.If*/required.if(() => this.passwordRef.current?.isValid),
            rule(
                value => this.state.password === value,
                'must be the same as `Password` above'
            ),
        ]);

        this.passwordChange = (value => this.setState({password: value})).bind(this);
        this.confirmPasswordChange = (value => this.setState({confirmPassword: value})).bind(this);
    }

    render() {
        return <ValidationContext ref={this.validationRef}>
            <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold', lineHeight: 20, marginBottom: 10, textAlign: 'center'}]}>`Compare` Rule</Text>
            <Text style={[styles.text, {marginBottom: 10}]}>You usually encounter these inputs when you want to register to be a user of an application.
            You need to input (create new) a password for the application and then re-type the same password in the second input. It's to make sure that
            the password you typed is really what you mean.</Text>

            <View style={styles.inputRow}>
                <Text style={styles.label}>Password</Text>
                <this.Password ref={this.passwordRef} onChangeText={this.passwordChange} secureTextEntry style={styles.textInput} value={this.state.password} />
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.label}>Confirm Password</Text>
                <this.ConfirmPassword onChangeText={this.confirmPasswordChange} secureTextEntry style={styles.textInput} value={this.state.confirmPassword} />
            </View>
            <View style={styles.inputRow}>
                <View style={styles.flex1} />
                <View style={[styles.flex3, styles.horizontal]}>
                    <Button onPress={() => this.validationRef.current?.validate() && Alert.alert('Validation', 'All inputs are valid')} title="Validate" />
                    <Text>{'  '}</Text>
                    <Button onPress={() => this.validationRef.current?.clearValidation()} title="Clear Validation" />
                </View>
            </View>
        </ValidationContext>;
    }
}