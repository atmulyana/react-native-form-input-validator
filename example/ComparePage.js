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

        this.Password = withValidation(TextInput, {
            name: 'password',
            rules: [
                required,
                strlen(8),
                rule(
                    value => {
                        return /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z\d\s]/.test(value);
                    },
                    'The password must contain capital and non capital letter, number and non-alphanumeric characters'
                ),
            ],
        });
        this.ConfirmPassword = withValidation(TextInput, {
            name: 'confirmPassword',
            rules: [
                /*Required.If*/required.if(() => this.passwordRef.current?.isValid),
                rule(
                    value => this.state.password === value,
                    'must be the same as `Password` above'
                ),
            ]
        });

        this.passwordChange = value => this.setState({password: value});
        this.confirmPasswordChange = value => this.setState({confirmPassword: value});
    }

    render() {
        const validNotif = () => Alert.alert('Validation', 'All inputs are valid');
        
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
                <View style={[styles.horizontal, styles.buttonContainer]}>
                    <Button
                        onPress={() => this.validationRef.current?.validate() && validNotif()}
                        style={styles.button}
                        title="Validate"
                    />
                    <Button
                        onPress={() => {
                            fetch('http://192.168.56.1:1234/check-password', {
                                body: JSON.stringify(this.state),
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(async (response) => {
                                if (response.ok) validNotif();
                                else if (response.status == 400) {
                                    const errors = await response.json();
                                    for (let inputName in errors) {
                                        this.validationRef.current.setErrorMessage(inputName, errors[inputName]);
                                    }
                                    if (this.validationRef.current.isValid) {
                                        //Although, the response status is invalid but no error message provided.
                                        //Therefore, we consider all inputs are valid.
                                        validNotif();
                                    }
                                }
                                else {
                                    Alert.alert('Validation', 'Server response is not OK');
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                Alert.alert('Validation', 'An error happened. Please run the server (read the note below the buttons)');
                            })
                        }}
                        style={styles.button}
                        title="Validate on server"
                    />
                    <Button
                        onPress={() => this.validationRef.current?.clearValidation()}
                        style={styles.button}
                        title="Clear Validation"
                    />
                </View>
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.text}>NOTE: To execute "Validate on server", you must run the server included in this example.
                Turn off your firewall for a while, before starting the server. It may block the connection.{'\n'}
                From the top folder of package, run the following commands:{'\n'}
                {'    '}<Text style={styles.textCode}>npm run build</Text>{'\n'}
                {'    '}<Text style={styles.textCode}>node example/server.js</Text>{'\n'}
                Then, edit the server IP address in this page's source to be your local IP (do not use loopback host/IP such as localhost) 
                </Text>
            </View>
        </ValidationContext>;
    }
}