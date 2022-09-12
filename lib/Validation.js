/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
import {/*isForwardRef*/ ForwardRef} from 'react-is';
import {StyleSheet, Text, View} from 'react-native';
import type {ContextValue, RefProp, StyleProp, ValidationRef, ValidationOption} from './types';
import {Rule} from './types';
import {Context} from './Context';
import {setRef, validate} from './helpers';

const containerStyleProps = new Set([
    'alignSelf',
    'bottom',
    'display',
    'end',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'left',
    'margin',
    'marginBottom',
    'marginEnd',
    'marginHorizontal',
    'marginLeft',
    'marginRight',
    'marginStart',
    'marginTop',
    'marginVertical',
    'maxWidth',
    'minWidth',
    'position',
    'right',
    'start',
    'top',
    'transform',
    'width',
    'zIndex',
]);

const getStyleDefault: $NonMaybeType<ValidationOption<any>['getStyle']> = props => props.style;
const setStyleDefault: $NonMaybeType<ValidationOption<any>['setStyle']> = (props, style, errorStyle) =>
    props.style = errorStyle ? [style, errorStyle] : style;
const getValueDefault: $NonMaybeType<ValidationOption<any>['getValue']> = props => props.value;

export const setErrorStyleDefault: $NonMaybeType<ValidationOption<any>['setErrorStyle']> = (props, style) => {
    /**
     * Need to remember: the input's style property has been flattened by `withValidation` function. So, normally,
     * it can't be an array.
     */
    let inputStyle = getStyleDefault(props);
    if (style) {
        setStyleDefault(props, [inputStyle, style]);
    }
    else if (Array.isArray(inputStyle)) {
        setStyleDefault(props, inputStyle[0]);
    }
};

function prepareStyle(s: StyleProp): {input: {...}, container: {...}} {
    const style = StyleSheet.flatten(s);
    const styles = {input: {}, container: {}};
    if (style && typeof style == 'object') {
        for (let propName in style) {
            if (containerStyleProps.has(propName)) {
                styles.container[propName] = style[propName];
            }
            else {
                styles.input[propName] = style[propName];
            }
        }

        if (typeof styles.input.height == 'string') {
            styles.container.height = styles.input.height;
            delete styles.input.height;
        }
        if (typeof styles.input.minHeight == 'string') {
            styles.container.minHeight = styles.input.minHeight;
            delete styles.input.minHeight;
        }
        if (typeof styles.input.maxHeight == 'string') {
            styles.container.maxHeight = styles.input.maxHeight;
            delete styles.input.maxHeight;
        }
        
        if ((styles.input.flex: any) > 0) {
            styles.container.flex = styles.input.flex;
            delete styles.input.flex;
        }
        if ('height' in styles.container || (styles.container.flex: any) > 0 || 'flexBasis' in styles.container) {
            if (!('height' in styles.input)) styles.input.flex = 1;
        }
    }

    return styles;
}

export function isDifferentStyle(style1: StyleProp, style2: StyleProp): boolean {
    const arStyle1: $ReadOnlyArray<mixed> = Array.isArray(style1) ? style1 : [style1],
          arStyle2: $ReadOnlyArray<mixed> = Array.isArray(style2) ? style2 : [style2];
    if (arStyle1.length != arStyle2.length) return true;
    else {
        for (let i = 0; i < arStyle1.length; i++) if (arStyle1[i] !== arStyle2[i]) return true;
        return false;
    }
}

export function withValidation<Props: {...}, Instance>(
    Input: React.AbstractComponent<Props, Instance>,
    option: ValidationOption<Props> | Array<Rule<any>> | Rule<any>
): React.AbstractComponent<Props, Instance & ValidationRef> {
    if (
        !option ||
        Array.isArray(option) && option.filter(rule => rule instanceof Rule).length < 1 ||
        !option.rules ||
        Array.isArray(option.rules) && option.rules.filter(rule => rule instanceof Rule).length < 1
    ) {
        /*$FlowIgnore[incompatible-return]  There is no validation rule defined,
          so it's useless if we create an input component with validation attributes.
          Returning the original input component is more sensible.*/
        return Input;
    }
    
    let name: ?string;
    let getStyle: $NonMaybeType<ValidationOption<Props>['getStyle']> = getStyleDefault;
    let setStyle: $NonMaybeType<ValidationOption<Props>['setStyle']> = setStyleDefault;
    let getValue: $NonMaybeType<ValidationOption<Props>['getValue']> = getValueDefault;
    let inputErrorStyle: ValidationOption<Props>['inputErrorStyle'];
    let rules: Array<Rule<any>> | Rule<any>;
    let setErrorStyle: ValidationOption<Props>['setErrorStyle'];
    let errorTextStyle: ValidationOption<Props>['errorTextStyle'];
    if (!Array.isArray(option) && !(option instanceof Rule)) {
        name = option.name;
        rules = (option: ValidationOption<Props>).rules;
        setErrorStyle = option.setErrorStyle;
        errorTextStyle = option.errorTextStyle;
        inputErrorStyle = option.inputErrorStyle;
        if (option.getStyle) getStyle = option.getStyle;
        if (option.setStyle) setStyle = option.setStyle;
        if (option.getValue) getValue = option.getValue;
    }
    else {
        rules = option;
    }

    let _props: Props;
    let _ctx: ContextValue;
    let _currentStyle: StyleProp = [];
    let _styles = {input: {}, container: {}};
    let _isValid: boolean = true;
    
    const _getErrorMessage = (): string => {
        const value = getValue(_props);
        const error = validate(value, rules, name, _ctx.lang);
        if (typeof(error) == 'string') {
            return error.trim();
        }
        return '';
    };

    let _setErrorMessage = (err: string): mixed => {};
    let _seValidationMark = (mark: React.Node): mixed => {};

    let _setErrorStyle: ?((boolean, ?boolean) => mixed);
    if (typeof setErrorStyle == 'function') {
        const setErrStyle = setErrorStyle;
        _setErrorStyle = (isError, isClear) => {
            const mark = setErrStyle(_props,
                isError ? [_ctx.inputErrorStyle, inputErrorStyle] :
                isClear ? null : /** to tell that it's the clearance of validation status, `setErrorStyle` shouldn't give the input a 'success' style */ 
                          undefined /** the input is valid, `setErrorStyle` may give the input a 'success' style such as a green border */
            );
            _seValidationMark(isClear ? null : mark); //`mark` can be an icon of validation status
        }
    }
        
    const _setMessage = (error: string, isClear?: boolean): boolean => {
        _setErrorMessage(error);
        _isValid = !error;
        typeof(_setErrorStyle) == 'function' && _setErrorStyle(!_isValid, isClear);
        return _isValid;
    };

    const validationRef: ValidationRef = {
        index: -1,
        get isValid() {return _isValid},
        
        validate(): boolean {
            const error = _getErrorMessage();
            return _setMessage(error);
        },
        
        clearValidation(): void {
            _setMessage('', true);
        }
    };

    let InputHasRef: React.AbstractComponent<Props, Instance>;
    if (typeof Input == 'function' && Input.prototype.isReactComponent) InputHasRef = Input;
    else if (/*isForwardRef(Input)*/ (Input: any).$$typeof === ForwardRef) InputHasRef = Input;
    else {
        /* $FlowIgnore[incompatible-type]  It's just a trick to make `Input` (that is a function component)
           can accept `ref` property without an error/warning message */
        InputHasRef = class extends React.Component<Props> {
            render() {
                return <Input {...this.props} />;
            }
        };
    }

    function ValidatedInput({inputRef}) {
        const [errorMessage, setErrorMessage] = React.useState('');
        _setErrorMessage = (err: string) => setErrorMessage(err);

        const [validationMark, setValidationMark] = React.useState<?{node: React.Node}>(null);
        _seValidationMark = (mark: React.Node) => setValidationMark({node: mark}); /*always creating new object is in order for
                                                                                    the state is always updated so that
                                                                                    the new error style is always applied
                                                                                    in the case the `mark` is always null/undefined*/
        
        return <View style={(_styles.container: any)}>
            <InputHasRef {..._props} ref={inputRef} />
            {validationMark?.node}
            {!!errorMessage && <Text style={[_ctx.errorTextStyle, errorTextStyle]}>{errorMessage}</Text>}
        </View>;
    }
    
    function forwardRef(props: Props, ref: RefProp<Instance & ValidationRef>) {
        _props = {...props};
        _ctx = React.useContext(Context);
        
        let style = getStyle(_props);
        if (isDifferentStyle(style, _currentStyle)) {
            _styles = prepareStyle(style);
            _currentStyle = style;
        }
        setStyle(
            _props,
            _styles.input,
            _isValid ? false : [_ctx.inputErrorStyle, inputErrorStyle],
            _styles.container
        );

        const isAuto = option.auto !== undefined ? option.auto : _ctx.auto;
        const value = getValue(_props);
        React.useEffect(() => {
            if (isAuto)
                validationRef.validate();
            else if (!_isValid)
                validationRef.clearValidation(); //don't worry about the validity of input's value because it should be re-validated when re-submitted
        }, [value]);

        const refCallback = React.useCallback((inpRef: Instance | null) => {
            let inputRef: (Instance & ValidationRef) | null;
            if (inpRef) {
                Object.setPrototypeOf(validationRef, (inpRef: any));
                _ctx.addRef(validationRef);
                inputRef = ((validationRef: any): (Instance & ValidationRef));
            }
            else {
                Object.setPrototypeOf(validationRef, null);
                _ctx.removeRef(validationRef);
                inputRef = null;
            }

            setRef(ref, inputRef);
        }, [ref]);
        
        return <ValidatedInput inputRef={refCallback} />;
    };
    forwardRef.displayName = `withValidation<${(Input?.displayName || Input?.name || 'Input')}>`;
    return React.forwardRef<Props, Instance & ValidationRef>(forwardRef);
}

type ValidationProps = {
    errorTextStyle?: StyleProp,
    rules: Array<Rule<any>> | Rule<any>,
    style: StyleProp,
    value: any,
}
function EmptyComponent(): React.Node {
    return null;
}
export class Validation extends React.Component<ValidationProps> implements ValidationRef {
    #component: React.AbstractComponent<{}, ValidationRef>;
    #compRef = React.createRef<ValidationRef>();

    constructor(props: ValidationProps) {
        super(props);
        this.#component = withValidation(EmptyComponent, {
            errorTextStyle: props.errorTextStyle,
            rules: props.rules,
        });
    }

    get index(): number {return -1}
    set index(idx: number) {}

    get isValid(): boolean {
        return this.#compRef.current?.isValid ?? true;
    }
        
    validate(): boolean {
        return this.#compRef.current?.validate() ?? true;
    }
    
    clearValidation(): void {
        this.#compRef.current?.clearValidation();
    }

    shouldComponentUpdate(nextProps: ValidationProps): boolean {
        //The other properties are write-once (only set when this component is initialized)
        return this.props.value !== nextProps.value || this.props.style !== nextProps.style;
    }

    render(): React.Element<any> {
        const Component = this.#component;
        const value: mixed = typeof(this.props.value) == 'function' ? this.props.value() : this.props.value;
        return <Component ref={this.#compRef} style={this.props.style} value={value} />;
    }
}