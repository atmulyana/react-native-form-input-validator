/**
 * Sample of how to use react-native-form-input-validator package
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
import type {Node} from 'react';
import {
    Button,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type {Props as TextInputProps} from 'react-native/Libraries/Components/TextInput/TextInput';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
//$FlowIgnore[untyped-import]
import JsSimpleDateFormat from 'jssimpledateformat';
//$FlowIgnore[untyped-import]
import CheckBox from '@react-native-community/checkbox';
import RNDatePicker from '@react-native-community/datetimepicker';
//$FlowIgnore[untyped-import]
import {Calendar as CalendarIcon} from 'react-native-feather';
//$FlowIgnore[untyped-import]
import {Picker} from '@react-native-picker/picker';
//$FlowIgnore[untyped-import]
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {
    setStatusStyleDefault,
    Validation,
    ValidationContext,
    withValidation,
} from "react-native-form-input-validator";
import {
    integer,
    max,
    min,
    numeric,
    regex,
    required,
    rule,
} from 'react-native-form-input-validator/rules';
import type {ContextRef} from 'react-native-form-input-validator/lib/types';
//$FlowIgnore[untyped-import]
import styles from './styles';

const genderOptions = [
    {value: 'M', label: 'Male'},
    {value: 'F', label: 'Female'},
];

export default (): Node => {
    const validation = React.useRef<?ContextRef>(null);
    
    const [name, setName] = React.useState({
        first: '',
        middle: '',
        last: '',
    });
    const onNameChange = {
        first: React.useCallback(first => setName({...name, first}), [name]),
        middle: React.useCallback(middle => setName({...name, middle}), [name]),
        last: React.useCallback(last => setName({...name, last}), [name]),
    };

    const [dateOfBirth, setDateOfBirth] = React.useState(addYear(new Date(), -20)); //set initial invalid value
    const dobOnChange = React.useCallback((_, date) => setDateOfBirth(date), []);
    const [gender, setGender] = React.useState(null);
    const [childCount, setChildCount] = React.useState('');
    const [domicile, setDomicile] = React.useState('');
    const [transport, setTransport] = React.useState('');
    const [confirm, setConfirm] = React.useState(false);
    const confirmOnChange = React.useCallback(confirm => setConfirm(!!confirm), []);

    /**
     * It's how we define the input that needs a state value for validation rule in a function component.
     * `TransportInput` is saved in a state in order for its reference never changes in every render. So, its state can be maintained.
     * The easier way is if you use the a class component for the form. Because `TransportInput` can become a property of the class
     * and also the state is the property of the class component. See `ComparePage.js` for example.
     */
    const [validators] = React.useState({});
    validators.validateTransport = value => {
        if (value == 'foot') {
            return domicile == 'center' || domicile === '';
        }
        return true;
    };
    const [TransportInput] = React.useState(
        withValidation(Picker, {
            name: 'Transportation',
            getValue: props => props.selectedValue,
            rules: [
                rule(
                    value => validators.validateTransport(value),
                    "It's impossible to go to the office on foot based the selected domicile"
                ),
                required,
            ],
        })
    );
    
    return <ValidationContext ref={validation}>
        <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold', lineHeight: 20, marginBottom: 10, textAlign: 'center'}]}>Emplyee Data Form</Text>
        <Text style={[styles.text, {marginBottom: 10}]}>It's a weird emplyee data form but, here, we're focusing on how the input validation works.</Text>

        <View style={styles.inputRow}>
            <Text style={[styles.label, {paddingTop: 16}]}>Full Name</Text>
            <FullName onChange={onNameChange} value={name} />
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.flex3}>
                <DateOfBirthInput onChange={dobOnChange} value={dateOfBirth} />
            </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.flex3}>
                <RequiredOptions onPress={setGender} options={genderOptions} style={styles.textPaddingVert} value={gender} />
            </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Number of Children</Text>
            <ChildrenInput onChangeText={setChildCount} style={styles.flex3} value={childCount} />
        </View>
        <View style={styles.inputRow}>
            <Text style={[styles.label, {paddingTop: 20}]}>Domicile</Text>
            <View style={styles.flex3}>
                <DomicileInput
                    numberOfLines={1}
                    onValueChange={setDomicile}
                    selectedValue={domicile}
                    style={[styles.border, {backgroundColor: '#ddd'}]}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="--Please Choose--" value="" style={styles.pickerItem} />
                    <Picker.Item label="Center Area" value="center" style={styles.pickerItem} />
                    <Picker.Item label="East Area" value="east" style={styles.pickerItem} />
                    <Picker.Item label="North Area" value="north" style={styles.pickerItem} />
                    <Picker.Item label="South Area" value="south" style={styles.pickerItem} />
                    <Picker.Item label="West Area" value="west" style={styles.pickerItem} />
                </DomicileInput>
            </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={[styles.label, {paddingTop: 14}]}>How to go to office</Text>
            <View style={styles.flex3}>
                <TransportInput
                    onValueChange={setTransport}
                    selectedValue={transport}
                    style={[styles.border, {backgroundColor: '#ddd' }]}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="--Please Choose--" value="" style={styles.pickerItem} />
                    <Picker.Item label="Public Transportation" value="public" style={styles.pickerItem} />
                    <Picker.Item label="Private Vehicle" value="private" style={styles.pickerItem} />
                    <Picker.Item label="On Foot" value="foot" style={styles.pickerItem} />
                </TransportInput>
            </View>
        </View>
        
        <View style={styles.inputRow}>
            <View style={styles.flex1} />
            <View style={styles.flex3}>
                <View style={styles.horizontal}>
                    <CheckBox 
                        boxType="square"
                        onCheckColor="black"
                        onValueChange={confirmOnChange}
                        tintColors={{false:styles.border.borderColor}} tintColor={styles.border.borderColor}
                        style={[styles.boder, {height: styles.text.lineHeight}]}
                        value={confirm}
                    />
                    <Text style={styles.text}>All data I filled above is true</Text>
                </View>
                <Validation
                    rules={rule(
                        checked => checked,
                        'You must check this statement'
                    )}
                    value={confirm}
                />
            </View>
        </View>
        <View style={styles.inputRow}>
            <View style={styles.flex1} />
            <View style={[styles.flex3, styles.horizontal]}>
                <Button onPress={() => validation.current?.validate()} title="Validate" />
                <Text>{'  '}</Text>
                <Button onPress={() => validation.current?.clearValidation()} title="Clear Validation" />
            </View>
        </View>
    </ValidationContext>;
};


const RequiredNameInput = withValidation(TextInput, {
    rules: [
        required,
        regex(/^[a-zA-Z]+$/),
    ],
    setStatusStyle: setStatusStyleDefault,
});

const MiddleNameInput = withValidation(TextInput, {
    rules: regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/),
    setStatusStyle: setStatusStyleDefault,
});

/** It's not necessary to create the separated components to show the input of name. Here, however, we're testing the nested inputs.*/
class FullName extends React.PureComponent<{
    onChange?: {
        first: string => void,
        middle: string => void,
        last: string => void,
    },
    value?: {
        first: string,
        middle: string,
        last: string,
    },
}> {
    render(): Node {
        const {onChange, value} = this.props;
        return (
            <View style={styles.name}>
                <NamePart Input={RequiredNameInput} onChange={onChange?.first} style={styles.flex1} title="First" value={value?.first} />
                <NamePart Input={MiddleNameInput} onChange={onChange?.middle} style={styles.flex1} title="Middle" value={value?.middle} />
                <NamePart Input={RequiredNameInput} onChange={onChange?.last} style={styles.flex1} title="Last" value={value?.last} />
            </View>
        );
    }
}
class NamePart extends React.PureComponent<{
    Input: React.AbstractComponent<TextInputProps>,
    onChange?: string => void,
    style: ViewStyleProp,
    title: string,
    value?: string,
}> {
    static defaultProps: {Input: React.AbstractComponent<TextInputProps>} = {
        Input: TextInput,
    };

    render(): Node {
        const props = this.props;
        return(
            <View style={props.style}>
                <Text style={styles.namePartTitle}>{props.title}</Text>
                <props.Input onChangeText={props.onChange} style={styles.textInput} value={props.value} />
            </View>
        );
    }
}

const Calendar: (props: {display: string, onChange?: (mixed, ?Date) => void, style: ViewStyleProp, value: Date}) => Node = Platform.OS == 'android'
    //$FlowIgnore[incompatible-exact]
    //$FlowIgnore[prop-missing] Incomplete declaration in RNDatePicker
    ? props => <RNDatePicker display="calendar" {...props} />
    
    : props => {
        let value = props.value;
        return <Modal transparent={true}>
            <View style={[StyleSheet.absoluteFill, {alignItems: 'center', justifyContent: 'center'}]}>
                <TouchableOpacity
                    onPress={() => props.onChange && props.onChange(null, props.value)}
                    style={[StyleSheet.absoluteFill, {backgroundColor: 'black', opacity: 0.5}]}
                />
                {/** $FlowIgnore[prop-missing] Incomplete declaration in RNDatePicker */}
                <RNDatePicker {...props}
                    display="inline"
                    onChange={(event, date) => {
                        if (!date) return;
                        if (date.getFullYear() == value.getFullYear() && date.getMonth() == value.getMonth()) {
                            if (props.onChange) props.onChange(event, date);
                        }
                        else {
                            //The users pick a new year/month but not necessarily intend to close calendar
                        }
                        value = date;
                    }}
                    style={[{backgroundColor: 'white', height: 400, width: 350}, props.style]}
                />
                <View style={{flexDirection: 'row', justifyContent:'flex-end', width:350}}>
                    <Text
                        onPress={() => props.onChange && props.onChange(null, props.value)}
                        style={{backgroundColor: 'white', color:'#307df6', fontWeight:'bold', paddingHorizontal:10, paddingVertical:2}}
                    >CANCEL</Text>
                    <Text
                        onPress={() => props.onChange && props.onChange(null, value)}
                        style={{backgroundColor: 'white', color:'#307df6', fontWeight:'bold', paddingHorizontal:10, paddingVertical:2}}
                    >OK</Text>
                </View>
            </View>
        </Modal>;
    };

const dateFormatter = new JsSimpleDateFormat("MMMM d, yyyy");
const DatePicker = React.memo(function({onChange, style, value = new Date(), ...props}): Node {
    const iconSize = 16;
    const [iconStyle, setIconStyle] = React.useState({
        alignItems: 'center',
        backgroundColor: styles.border.borderColor,
        borderBottomLeftRadius: styles.border.borderRadius,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: styles.border.borderRadius,
        borderTopRightRadius: 0,
        display: 'none',
        height: styles.textInputHeight.height - 2,
        justifyContent: 'center',
        position: 'absolute',
        width: styles.textInputHeight.height - 2,
    });
    const [calendarVisible, setCalendarVisible] = React.useState(false);
    const onChangeHandler = React.useCallback((event, date) => {
        setCalendarVisible(false);
        let dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        onChange(event, dateWithoutTime);
    }, [onChange])
    const showCalendar = React.useCallback(() => setCalendarVisible(true), []);

    return (
        <>
            <Text
                onPress={showCalendar}
                style={[styles.textBorder, {paddingLeft: styles.textInputHeight.height + 4}, style]}
                onLayout={({nativeEvent: {layout}}) => {
                    setIconStyle(style => ({...style, display: 'flex', left: layout.x + 1, top: layout.y + 1}));
                }}
            >
                {dateFormatter.format(value)}
            </Text>
            <TouchableOpacity style={iconStyle} onPress={showCalendar}>
                <CalendarIcon height={iconSize} stroke="black" width={iconSize} />
            </TouchableOpacity>
            {calendarVisible && <Calendar onChange={onChangeHandler} value={value} {...props} />}
        </>
    );
});

function addYear(date: Date, yearsToAdd: number): Date {
    let year = date.getFullYear() + yearsToAdd;
    return new Date(year, date.getMonth(), date.getDate());
}

const DateOfBirthInput = withValidation(DatePicker, {
    rules: [
        required,
        max(() => addYear(new Date(), -21)).setMessageFunc(() => 'The employee must be at least 21 years old'),
        min(() => addYear(new Date(), -60)).setMessageFunc(() => 'The employee must be retired at 60 years old'),
    ],
    setStatusStyle: setStatusStyleDefault,
});


const RadioButtons: React.AbstractComponent<{
    inputProps: {},
    labelProps: {},
    options: Array<{value: mixed, label: string}>,
    value?: mixed,
    onPress?: mixed => mixed,
    style?: mixed,
    ...
}> = React.memo(({inputProps, labelProps, options, value, onPress, style}): Node =>
    <RadioForm
        formHorizontal={true}
        animation={true}
        style={[{marginLeft: -10, paddingBottom: 0}, style]}
    >
        {options.map((obj, i) => (
            <RadioButton labelHorizontal={true} key={i} style={{marginBottom: 0}}>
                <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={value === obj.value}
                    onPress={() => onPress && onPress(obj.value)}
                    borderWidth={1}
                    buttonInnerColor='black'
                    buttonOuterColor='black'
                    buttonSize={styles.text.fontSize - 3}
                    buttonOuterSize={styles.text.fontSize}
                    // buttonStyle={{}}
                    buttonWrapStyle={{marginLeft: 10}}
                    {...inputProps}
                />
                <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={() => onPress && onPress(obj.value)}
                    labelStyle={styles.textSlim}
                    // labelWrapStyle={{}}
                    {...labelProps}
                />
            </RadioButton>
        ))}  
    </RadioForm>
);
const RequiredOptions = withValidation(RadioButtons, {
    rules: required,
    setStatusStyle: (props, style) => {
        if (style) {
            //$FlowIgnore[unclear-type]
            const styleObj: any = StyleSheet.flatten(style);
            props.inputProps = {
                buttonInnerColor: styleObj.color,
                buttonOuterColor: styleObj.borderColor,
            };
            props.labelProps = {
                labelStyle: [styles.textSlim, {color: styleObj.color}]
            };
        }
        else {
            delete props.inputProps;
            delete props.labelProps;
        }
    },
});


function ChildsInput({style, ...props}: {style: ViewStyleProp}) {
    const red = '#dc3545';
    const inputStyle: {flex: 0, width: 40, color?: string, borderColor?: string} = {flex: 0, width: 40};
    if (Array.isArray(style)) { //invalid status
        inputStyle.color = red;
        inputStyle.borderColor = red;
    }

    return <View style={style}>
        <TextInput
            {...props}
            maxLength={3}
            style={[
                styles.textInput,
                inputStyle,
            ]} />
    </View>;
}
const ChildrenInput = withValidation(ChildsInput, {
    rules: [
        numeric,
        integer,
        min(0),
        max(4).setMessageFunc(() => 'Maximum 4 children who get allowance'),
    ],
    setStatusStyle: setStatusStyleDefault,
});

const DomicileInput = withValidation(Picker, {
    getValue: props => props.selectedValue,
    rules: required,
});
