/**
 * Copy from typescript declaration in "@react-native-picker/picker/typings"
 * 
 * @format
 * @flow
 */

declare module "@react-native-picker/picker" {
    import type {AbstractComponent} from 'react';
    // import type {
    //     ColorValue,
    //     TextStyleProp,
    // } from 'react-native/Libraries/StyleSheet/StyleSheet';
    // import type {
    //     ViewProps,
    // } from 'react-native/Libraries/Components/View/ViewPropTypes';
    // import type {
    //     BlurEvent,
    //     FocusEvent,
    //     SyntheticEvent,
    // } from 'react-native/Libraries/Types/CoreEventTypes';
    declare type ColorValue = any;
    declare type TextStyleProp = any;
    declare type BlurEvent = any;
    declare type FocusEvent = any;
    declare interface ViewProps {}
    declare type SyntheticEvent<T> = {native: T, ...};
    
    declare export type ItemValue = number | string;

    declare export interface PickerItemProps<T = ItemValue> {
        label?: string;
        value?: T;
        color?: string;
        fontFamily?: string;
        testID?: string;
        style?: TextStyleProp;
        enabled?: boolean;
    }

    declare export interface PickerProps<T = ItemValue> extends ViewProps {
        style?: TextStyleProp;
        selectedValue?: T;
        onValueChange?: (itemValue: T, itemIndex: number) => void;
        enabled?: boolean;
        mode?: 'dialog' | 'dropdown';
        itemStyle?: TextStyleProp;
        selectionColor?: ColorValue;
        prompt?: string;
        testID?: string;
        dropdownIconColor?: number | ColorValue;
        dropdownIconRippleColor?: number | ColorValue;
        numberOfLines?: number;
        accessibilityLabel?: string;
        placeholder?: string;  
        onFocus?: (e: FocusEvent) => void;
        onBlur?: (e: BlurEvent) => void;
    }

    declare export const Picker: AbstractComponent<PickerProps<string>, {
        ocus: () => void,
        blur: () => void,
    }> & {
        +MODE_DIALOG: 'dialog',
        +MODE_DROPDOWN: 'dropdown',
        Item: AbstractComponent<PickerItemProps<string>>,
    };

    declare export interface PickerIOSItemProps {
        label?: string;
        value?: number | string;
        color?: string;
        testID?: string;
    }

    declare export interface PickerIOSProps extends ViewProps {
        itemStyle?: TextStyleProp;
        style?: TextStyleProp;
        onChange?: SyntheticEvent<{itemValue: ItemValue, itemIndex: number}>;
        onValueChange?: (itemValue: ItemValue, itemIndex: number) => void;
        selectedValue?: ItemValue;
        testID?: string;
        numberOfLines?: number;
        themeVariant ?: string;
    }

    declare export const PickerIOS: AbstractComponent<PickerIOSProps> & {
        Item: AbstractComponent<PickerIOSItemProps>;
    }
}