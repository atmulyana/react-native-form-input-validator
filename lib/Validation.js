/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import * as React from 'react';
//$FlowIgnore[untyped-import]
import {/*isForwardRef*/ ForwardRef} from 'react-is';
import {StyleSheet, Text, View} from 'react-native';
import type {
  ContextValue,
  RefProp,
  StyleProp,
  ValidationOption,
  InputRef,
  ValidationProps,
  LangFunction,
} from "./types";
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
const setStyleDefault: $NonMaybeType<ValidationOption<any>['setStyle']> = (props, style) => props.style = style;
const getValueDefault: $NonMaybeType<ValidationOption<any>['getValue']> = props => props.value;
const noop = () => {};

export const setStatusStyleDefault: $NonMaybeType<ValidationOption<any>['setStatusStyle']> = (props, style) => {
    /**
     * Need to remember: the input's style property has been flattened by `withValidation` function. So, normally,
     * it can't be an array.
     */
    let inputStyle = getStyleDefault(props);
    if (style) { //The input style needs to change
        if (Array.isArray(inputStyle)) {
            //The input has got the error/success style. Don't be double set so that it can be reverted to normal style easily
            if (style !== inputStyle[1]) {
                setStyleDefault(props, [inputStyle[0], style]);
            }
        }
        else {
            setStyleDefault(props, [inputStyle, style]);
        }
    }
    else //back to normal style 
        if (Array.isArray(inputStyle)) {
            setStyleDefault(props, inputStyle[0]);
        }
};

function prepareStyle(s: StyleProp): {input: {}, container: {}} {
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
    option: ValidationOption<Props> | Array<Rule<mixed>> | Rule<mixed>
): React.AbstractComponent<Props, Instance & InputRef> {
    if (!option || !(
            (option instanceof Rule) ||
            Array.isArray(option) && option.filter(rule => rule instanceof Rule).length > 0 ||
            typeof(option) == 'object' && (
                (option.rules instanceof Rule) ||
                Array.isArray(option.rules) && option.rules.filter(rule => rule instanceof Rule).length > 0
            )
    )) {
        /*$FlowIgnore[incompatible-return]  There is no validation rule defined,
          so it's useless if we create an input component with validation attributes.
          Returning the original input component is more sensible.*/
        return Input;
    }
    
    let name: ?string, lang: LangFunction | void;
    let getStyle: $NonMaybeType<ValidationOption<Props>['getStyle']> = getStyleDefault;
    let setStyle: $NonMaybeType<ValidationOption<Props>['setStyle']> = setStyleDefault;
    let getValue: $NonMaybeType<ValidationOption<Props>['getValue']> = getValueDefault;
    let inputErrorStyle: ValidationOption<Props>['inputErrorStyle'];
    let rules: Array<Rule<mixed>> | Rule<mixed>;
    let setStatusStyle: ValidationOption<Props>['setStatusStyle'];
    let errorTextStyle: ValidationOption<Props>['errorTextStyle'];
    if (!Array.isArray(option) && !(option instanceof Rule)) {
        lang = option.lang;
        name = option.name;
        rules = (option: ValidationOption<Props>).rules;
        setStatusStyle = option.setStatusStyle;
        errorTextStyle = option.errorTextStyle;
        inputErrorStyle = option.inputErrorStyle;
        if (option.getStyle) getStyle = option.getStyle;
        if (option.setStyle) setStyle = option.setStyle;
        if (option.getValue) getValue = option.getValue;
    }
    else {
        rules = option;
    }

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

    
    class Validator {
        constructor() {
            if (typeof setStatusStyle == 'function') {
                this.styleContext.clearValidation = () => {this.needsToClear = true};
                this.setStatStyle = setStatusStyle.bind(this.styleContext);
                this.setStatusStyle = function(isError, isClear) {
                    const mark = this.setStatStyle(
                        this.props,
                        
                        isError ? this.inputErrorStyle :
                        isClear ? null : /** to tell that it's the clearance of validation status, `setStatusStyle` shouldn't give the input a 'success' style */ 
                                  undefined, /** the input is valid, `setStatusStyle` may give the input a 'success' style such as a green border */
                        
                        this.styleContext
                    );
                    this.seValidationMark(isClear ? null : mark); //`mark` can be an icon of validation status
                }
            }

            this.ValidatedInput = this.ValidatedInput.bind(this);
        }
        
        currentStyle: StyleProp = [];
        inputErrorStyle: [StyleProp, StyleProp] = [undefined, inputErrorStyle];
        isValid: boolean = true;
        needsToClear: boolean = false;
        props: Props;
        styles = {input: {}, container: {}};
        styleContext: {clearValidation: () => void, flag: mixed} = {clearValidation: noop, flag: 0};
        
        getErrorMessage = (): string => {
            const value = getValue(this.props);
            const error = validate(value, rules, name, _ctx.lang ?? lang);
            if (typeof(error) == 'string') {
                return error.trim();
            }
            return '';
        }

        setErrorMessage: (err: string) => mixed = noop;
        setStatusStyle: ?((boolean, ?boolean) => mixed);
        setStatStyle: $NonMaybeType<ValidationOption<Props>['setStatusStyle']> = noop;
        seValidationMark: (mark: React.Node) => mixed = noop;

        setMessage(error: string, isClear?: boolean): boolean {
            this.setErrorMessage(error);
            this.isValid = !error;
            typeof(this.setStatusStyle) == 'function' && this.setStatusStyle(!this.isValid, isClear);
            return this.isValid;
        }

        ValidatedInput = ({inputRef}) => {
            const [errorMessage, setErrorMessage] = React.useState('');
            this.setErrorMessage = function(err: string) {
                setErrorMessage(err);
            }
    
            const [validationMark, setValidationMark] = React.useState<?{node: React.Node}>(null);
            this.seValidationMark = function(mark: React.Node) {
                setValidationMark({node: mark}); /*always creating new object is in order for the state is always updated so that
                                                   the new error style is always applied in the case the `mark` is always null/undefined*/
            }
            
            return <View style={(this.styles.container: any)}>
                <InputHasRef {...this.props} ref={inputRef} />
                {validationMark?.node}
                {!!errorMessage && <Text style={[(_ctx.errorTextStyle: any), (errorTextStyle: any)]}>{errorMessage}</Text>}
            </View>;
        }
    }

    function createInputRef(validator: Validator): InputRef {
        return {
            index: -1,
            get isValid() {return validator.isValid},
        
            validate(): boolean {
                const error = validator.getErrorMessage();
                return validator.setMessage(error);
            },
        
            clearValidation(): void {
                validator.setMessage('', true);
            },
        };
    }

    
    let _ctx: ContextValue;
    
    function forwardRef(props: Props, ref: RefProp<Instance & InputRef>) {
        _ctx = React.useContext(Context);

        const [validator] = React.useState(new Validator());
        validator.props = {...validator.props, ...props};
        if (validator.inputErrorStyle[0] !== _ctx.inputErrorStyle) validator.inputErrorStyle = [_ctx.inputErrorStyle, inputErrorStyle];
        const [validationRef] = React.useState(createInputRef(validator));

        let style = getStyle(props); //NOT `validator.props`; `props` may not have style property and `validator.props` should have one from previous rendering
        if (isDifferentStyle(style, validator.currentStyle)) {
            validator.styles = prepareStyle(style);
            validator.currentStyle = style;
        }
        setStyle(validator.props, validator.styles.input, validator.styles.container);
        validator.setStatStyle(
            validator.props,
            validator.isValid ? false : validator.inputErrorStyle,
            validator.styleContext
        );

        const isAuto = option.auto !== undefined ? option.auto : _ctx.auto;
        const value = getValue(validator.props);
        React.useEffect(() => {
            if (isAuto)
                validationRef.validate();
            else if (!validator.isValid || validator.needsToClear) {
                validator.needsToClear = false;
                validationRef.clearValidation(); //don't worry about the validity of input's value because it should be re-validated when re-submitted
            }
        }, [value]);

        const refCallback = React.useCallback((inpRef: Instance | null) => {
            let inputRef: (Instance & InputRef) | null;
            if (inpRef) {
                Object.setPrototypeOf(validationRef, (inpRef: any));
                _ctx.addRef(validationRef);
                inputRef = ((validationRef: any): (Instance & InputRef));
            }
            else {
                Object.setPrototypeOf(validationRef, null);
                _ctx.removeRef(validationRef);
                inputRef = null;
            }

            setRef(ref, inputRef);
        }, [ref]);
        
        return <validator.ValidatedInput inputRef={refCallback} />;
    };
    forwardRef.displayName = `withValidation<${(Input?.displayName || Input?.name || 'Input')}>`;
    return React.forwardRef<Props, Instance & InputRef>(forwardRef);
}


type EmptyComponentProps = {
    style: StyleProp,
    value: mixed,
}
function EmptyComponent({style, value}: EmptyComponentProps): React.Node {
    return null;
}
export class Validation extends React.Component<ValidationProps> implements InputRef {
    #component: React.AbstractComponent<EmptyComponentProps, InputRef>;
    #compRef = React.createRef<InputRef>();

    constructor(props: ValidationProps) {
        super(props);
        this.#component = withValidation(EmptyComponent, {
            auto: props.auto,
            errorTextStyle: props.errorTextStyle,
            lang: props.lang,
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

    render(): React.Element<React.AbstractComponent<EmptyComponentProps, InputRef>> {
        const Component = this.#component;
        const value: mixed = typeof(this.props.value) == 'function' 
            //$FlowIgnore[incompatible-use]
            ? this.props.value()
            : this.props.value;
        return <Component ref={this.#compRef} style={this.props.style} value={value} />;
    }
}