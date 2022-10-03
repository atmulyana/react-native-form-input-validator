/**
 * Sample of how to use react-native-form-input-validator package
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import React from 'react';
import {
    Button,
    ProgressViewIOSComponent,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    setStatusStyleDefault,
    withValidation
} from "react-native-form-input-validator";
import {
    regex,
    required,
} from 'react-native-form-input-validator/rules';
import {Check, X} from "react-native-feather";
import styles from './styles';

const iconStyles = {
    container: {
        borderRadius: 10,
        height: 20,
        padding: 2,
        position: 'absolute',
        right: 2,
        top: 2,
        width: 20,
    },
    error: {
        backgroundColor: "red",
    },
    image: {
        height: 16,
        stroke:  "white",
        strokeWidth: 4,
        width: 16,
    },
    success: {
        backgroundColor: "green",
    },
};
const textStyles = {
    inputSuccess: {
        borderColor: 'green',
    },
    message: {
        color: 'green',
    },
};

function ValidationStatus({icon: Icon, message, style}) {
    return <>
        {/** Not like invalid status, the valid status doesn't show a message.
         *  Here is the place if you want to show a message by using `Text` element */}
        {message && <Text style={[styles.text, textStyles.message]}>{message}</Text>}
        
        {/** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */}
        <View style={[iconStyles.container, style]}>
            <Icon {...iconStyles.image} />
        </View>
    </>
}

const Input = withValidation(TextInput, {
    //auto: true,
    rules: [
        regex(/^0\d{3}-\d{4}-\d{4}$/).setMessageFunc(() => 'Bad phone number'),
        required,
    ],
    setStatusStyle: (props, style, context) => {
        if (style) { //invalid status after validate or re-render when invalid
            setStatusStyleDefault(props, style);
            {/** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */}
            return <ValidationStatus icon={X} style={iconStyles.error} />;
        }
        else if (style === undefined) {  //valid status after validate
            setStatusStyleDefault(props, textStyles.inputSuccess);
            context.flag = 1;
            return <ValidationStatus icon={Check} message="Good phone number" style={iconStyles.success} />;
        }
        else { //clear action or re-render when valid
            setStatusStyleDefault(props);
            
            /** Not like invalid status which is automatically cleared when starts editing, valid status needs manually clearing */
            if (
                style === false // re-render such as because of editing value
                && context.flag === 1 //It's set above when valid after validate action
            ) {
                context.clearValidation();
                context.flag = 0;
            }
        }
    },
});

export default function() {
    const input = React.useRef(null);
    const [value, setValue] = React.useState('');
    const inputOnBlur = React.useCallback(() => input.current?.validate(), []);

    const [value2, setValue2] = React.useState('');
    const valueOnChange2 = React.useCallback(value => setValue2(value), []);

    return <>
        <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold', lineHeight: 20, marginBottom: 10, textAlign: 'center'}]}>Validation Status Icon</Text>
        <Text style={[styles.text, {marginBottom: 10}]}>We'll see more fancy validation status which uses an icon. The input is validated
        when it's lost of focus. Try to enter a valid and invalid phone number to the input (valid pattern:{' '}
        <Text style={{fontWeight:'bold'}}>0ddd-dddd-dddd</Text>).</Text>

        <View style={styles.inputRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Input ref={input} autoCorrect={false} onBlur={inputOnBlur} onChangeText={setValue} style={styles.textInput} value={value} />
        </View>
        <View style={[styles.inputRow, {justifyContent: 'flex-end'}]}>
            <Button onPress={() => input.current?.clearValidation()} title="Clear Validation" />
        </View>
    </>;
}