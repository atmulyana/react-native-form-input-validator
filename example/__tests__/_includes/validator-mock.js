/**
 * https://github.com/atmulyana/react-native-form-input-validator
 * @format
 */
import {
    ValidationContext as mock_ValidationContext,
    Validation as mock_Validation,
    isDifferentStyle as mock_isDifferentStyle,
    setStatusStyleDefault as mock_setStatusStyleDefault,
    withValidation as mock_withValidation,
    setRef as mock_setRef,
    str as mock_str,
} from '../../../lib';
import mock_ValidationRule, {
    CustomRule as mock_CustomRule,
    rule as mock_rule,
    Email as mock_Email,
    email as mock_email,
    Integer as mock_Integer,
    integer as mock_integer,
    Max as mock_Max,
    max as mock_max,
    Min as mock_Min,
    min as mock_min,
    Numeric as mock_Numeric,
    numeric as mock_numeric,
    Regex as mock_Regex,
    regex as mock_regex,
    Required as mock_Required,
    required as mock_required,
    StrLength as mock_StrLength,
    strlen as mock_strlen,
} from '../../../lib/rules';

jest.mock('react-native-form-input-validator', 
    () => ({
        __esModule: true,
        ValidationContext: mock_ValidationContext,
        Validation: mock_Validation,
        isDifferentStyle: mock_isDifferentStyle,
        setStatusStyleDefault: mock_setStatusStyleDefault,
        withValidation: mock_withValidation,
        setRef: mock_setRef,
        str: mock_str,
    }),
    {virtual: true}
);

jest.mock('react-native-form-input-validator/rules',
    () => ({
        __esModule: true,
        default: mock_ValidationRule,
        CustomRule: mock_CustomRule,
        rule: mock_rule,
        Email: mock_Email,
        email: mock_email,
        Integer: mock_Integer,
        integer: mock_integer,
        Max: mock_Max,
        max: mock_max,
        Min: mock_Min,
        min: mock_min,
        Numeric: mock_Numeric,
        numeric: mock_numeric,
        Regex: mock_Regex,
        regex: mock_regex,
        Required: mock_Required,
        required: mock_required,
        StrLength: mock_StrLength,
        strlen: mock_strlen,
    }),
    {virtual: true}
);