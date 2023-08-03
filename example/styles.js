/**
 * Sample of how to use react-native-form-input-validator package
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {StyleSheet} from 'react-native';

const styles = {};
Object.assign(styles, StyleSheet.create({
    border: {
        borderColor: '#ccc',
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    button: {
        fontSize: 12,
    },
    buttonContainer: {
        gap: 8,
    },
    flex1: {
        flex: 1
    },
    flex3: {
        flex: 3,
    },
    horizontal: {
        flexDirection: 'row',
    },
    inputRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
    },
    text: {
        color: 'black',
        fontSize: 14,
        lineHeight: 16,
    },
    textCode: {
        fontFamily: 'monospace',
    },
    textInputHeight: {
        height: 26,
    },
    textPaddingHort: {
        paddingHorizontal: 4,
    },
    textPaddingVert: {
        paddingVertical: 4,
    },
    textSlim: {
        lineHeight: 14,
        paddingVertical: 0,
    },
    textSmall: {
        fontSize: 10,
        lineHeight: 12,
    },
}));
Object.assign(styles, {
    label: [styles.text, styles.textPaddingVert, styles.flex1],
    name: [styles.horizontal, styles.flex3],
    namePartTitle: [styles.text, styles.textSmall],
    pickerItem: {...styles.text},
    textBorder: [styles.text, styles.border, styles.textPaddingHort, styles.textPaddingVert],
    textInput: [styles.text, styles.textSlim, styles.border, styles.textInputHeight, styles.flex3],
    textSlim: [styles.text, styles.textSlim],
    textSmall: [styles.text, styles.textSmall],
});
export default styles;