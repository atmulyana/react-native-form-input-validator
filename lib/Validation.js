/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow
 */
import * as React from 'react';
//$FlowIgnore[untyped-import]
import {
    /*isForwardRef*/ ForwardRef,
    isValidElementType,
} from 'react-is';
import {StyleSheet, Text, View} from 'react-native';
import type {
    ContextValue,
    InputRef,
    LangFunction,
    RefObject,
    RefProp,
    StyleProp,
    ValidationOption,
    ValidationProps,
} from "./types";
import {AsyncFailMessage} from './types';
import Rule from './rules/Rule';
import {ValidationRuleAsync} from './rules';
import {Context} from './Context';
import {setRef, validate, validateAsync} from './helpers';
import messages from './messages';

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
const getValueDefault: $NonMaybeType<ValidationOption<any, any>['getValue']> = props => props.value;
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

type TStyles = {
    input: {[string]: mixed},
    container: {[string]: mixed},
};

function prepareStyle(s: StyleProp): TStyles {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    const style = StyleSheet.flatten<StyleProp>(s);
    const styles: TStyles = {input: {}, container: {}};
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

type HocInput<Props, Instance> = React.AbstractComponent<Props, Instance & InputRef>;

export function withValidation<Props, Instance = mixed>(
    Input: React.AbstractComponent<Props, Instance>,
    option: ValidationOption<Props, any> | Array<Rule<any>> | Rule<any>
): HocInput<Props, Instance> {
    type TInput = HocInput<Props, Instance>;
    let hocInput: {current: ?TInput},
        rules: Rule<any> | Array<Rule<any>> = [],
        opt: ValidationOption<Props, any> = {rules};
    const oriLogError = console.error;
    try {
        //$FlowIgnore[cannot-write] We need to mute error message 
        console.error = () => {};
        hocInput = React.useRef<?TInput>(null);
        [opt] = React.useState<ValidationOption<Props, any>>(opt);
    }
    catch { //we know if `React.useState` is used outside a function component then an error will happen because of trying to access the member of `null` object
            //(I don't want to be kicked out because of checking `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current == null`)
        //`hocInput` will be undefined (never be set). If set then it's inside a function component (useful for checking)
    }
    finally {
        //$FlowIgnore[cannot-write] reverts the original error logger
        console.error = oriLogError;
    }
    
    if (Array.isArray(option) || (option instanceof Rule)) {
        rules = option;
    }
    else {
        rules = option?.rules; //`?.` for runtime check. `option` may not be a non-null object.
                               //NOTE: `?.` operator also applies to non-object variable such as boolean and number 
    }

    if (hocInput?.current) { //inside a function component and the Input wrapper has been created
        opt.rules = rules;
        return hocInput.current;
    }

    if (!(
            rules && (
                (rules instanceof Rule) ||
                (Array.isArray(rules) && rules.filter(rule => rule instanceof Rule).length > 0)
            )
    )) {
        /*$FlowIgnore[incompatible-cast]  There is no validation rule defined,
          so it's useless if we create an input component with validation attributes.
          Returning the original input component is more sensible.*/
        const Inp = (Input: TInput);
        if (hocInput) hocInput.current = Inp; //inside a function component
        return Inp;
    }

    if (Array.isArray(option) || (option instanceof Rule)) {
        Object.assign(opt, {rules});
    }
    else {
        Object.assign(opt, option);
    }

    const Inp = ___withValidation(Input, opt);
    
    //Inside a function component: keep Input for next renders so that need not re-executing `___withValidation`
    if (hocInput) hocInput.current = Inp;
    
    return Inp;
}

function ___withValidation<Props, Instance = mixed>(
    Input: React.AbstractComponent<Props, Instance>,
    option: ValidationOption<Props, any>
): HocInput<Props, Instance> {
    type Opt = ValidationOption<Props, any>;
    let asyncFailMessage: Opt['asyncFailMessage'] = option.asyncFailMessage,
        errorTextStyle: Opt['errorTextStyle'] = option.errorTextStyle,
        getStyle: $NonMaybeType<Opt['getStyle']> = option.getStyle ?? getStyleDefault,
        getValue: $NonMaybeType<Opt['getValue']> = option.getValue ?? getValueDefault,
        inputErrorStyle: Opt['inputErrorStyle'] = option.inputErrorStyle,
        lang: LangFunction | void = option.lang,
        name: ?string = option.name,
        setStatusStyle: Opt['setStatusStyle'] = option.setStatusStyle,
        setStyle: $NonMaybeType<Opt['setStyle']> = option.setStyle ?? setStyleDefault;
    
    const isAsync = Array.isArray(option.rules)
        ? option.rules.some(rule => rule instanceof ValidationRuleAsync)
        : (option.rules instanceof ValidationRuleAsync);
    
    let InputHasRef: React.AbstractComponent<Props, Instance>;
    if (typeof Input == 'function' && Input.prototype.isReactComponent) InputHasRef = Input;
    else if (/*isForwardRef(Input)*/ (Input: any)?.$$typeof === ForwardRef) InputHasRef = Input;
    else {
        /* $FlowIgnore[incompatible-type]  It's just a trick to make `Input` (that is a function component)
           can accept `ref` property without an error/warning message */
        InputHasRef = class extends React.Component<Props> {
            render(): React.Node {
                return isValidElementType(Input) //we still prepare that `withValidation` is called without type-checking
                    && <Input {...this.props} />;
            }
        };
    }

    
    class Validator {
        constructor() {
            if (typeof setStatusStyle == 'function') {
                this.styleContext.clearValidation = () => {this.needsToClear = true};
                this.setStatStyle = setStatusStyle.bind(this.styleContext);
                this.setStatusStyle = function(this: Validator, isError: boolean, isClear: ?boolean) {
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
        styles: TStyles = {input: {}, container: {}};
        styleContext: {clearValidation: () => void, flag: mixed} = {clearValidation: noop, flag: 0};
        
        getErrorMessage = (): string => {
            const value = getValue(this.props);
            const error = validate(value, option.rules, name, _ctx.lang ?? lang);
            if (typeof(error) == 'string') {
                return error.trim();
            }
            return '';
        }

        getErrorMessageAsync = async (): Promise<string> => {
            const value = getValue(this.props);
            try {
                const error = await validateAsync(value, option.rules, name, _ctx.lang ?? lang);
                if (typeof(error) == 'string') {
                    return error.trim();
                }
            }
            catch(err) {
                if ((asyncFailMessage ?? _ctx.asyncFailMessage) == AsyncFailMessage.CaughtError) {
                    let message = '';
                    if (err instanceof Error) message = err.message;
                    else if (typeof(err) == 'string') message = err;
                    message = message.trim();
                    if (message) return message;
                }
                return messages.asyncFail;
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

        ValidatedInput: ({inputRef: RefProp<Instance>}) => React.Node = ({inputRef}) => {
            const [errorMessage, setErrorMessage] = React.useState<string>('');
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
        
            clearValidation(): void {
                validator.setMessage('', true);
            },

            setErrorMessage(message: string): void {
                validator.setMessage(message.trim());
            },
        
            validate(): boolean {
                const error = validator.getErrorMessage();
                return validator.setMessage(error);
            },

            async validateAsync(): Promise<boolean> {
                const error = await validator.getErrorMessageAsync();
                return validator.setMessage(error);
            },
        };
    }

    
    let _ctx: ContextValue;
    //need auto validation?
    const isAuto: ?boolean = isAsync ? false :         //asynchronous validation cannot apply auto validation 
           option.auto !== undefined ? !!option.auto : //if `auto` is defined in `option` then use it
           null;                                       //default to context option configuration

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

        const value = getValue(validator.props);
        React.useEffect(() => {
            if (isAuto ?? _ctx.auto)
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
    #compRef: RefObject<InputRef> = React.createRef<InputRef>();

    constructor(props: ValidationProps) {
        super(props);
        this.#component = withValidation(EmptyComponent, {
            auto: props.auto,
            errorTextStyle: props.errorTextStyle,
            getValue: function(props) {
                let value = props.value;
                //$FlowIgnore[incompatible-use]
                if (typeof(value) == 'function') return value();
                return value;
            },
            lang: props.lang,
            rules: props.rules,
        });
    }

    get index(): number {return -1}
    set index(idx: number) {}

    get isValid(): boolean {
        return this.#compRef.current?.isValid ?? true;
    }
    
    clearValidation(): void {
        this.#compRef.current?.clearValidation();
    }
        
    validate(): boolean {
        return this.#compRef.current?.validate() ?? true;
    }

    async validateAsync(): Promise<boolean> {
        const compRef = this.#compRef.current;
        if (compRef) {
            return await compRef.validateAsync();
        }
        return true;
    }

    setErrorMessage(message: string): void {
        this.#compRef.current?.setErrorMessage(message);
    }

    shouldComponentUpdate(nextProps: ValidationProps): boolean {
        //The other properties are write-once (only set when this component is initialized)
        return this.props.value !== nextProps.value || this.props.style !== nextProps.style;
    }

    render(): React.Element<React.AbstractComponent<EmptyComponentProps, InputRef>> {
        const Component = this.#component;
        const {style, value} = this.props;
        return <Component ref={this.#compRef} style={style} value={value} />;
    }
}