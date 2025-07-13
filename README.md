# **react-native-form-input-validator**

> ## This project has been moved to [react-input-validator](https://github.com/atmulyana/react-input-validator)

It's to validate the input's value in RN app such as `TextInput` or other kind of inputs. The value is validated based on the rule defined for the input.
If the input is invalid, the error message is shown beneath the input. It's very useful before submitted to the server. See the pictures below for some
examples.     

![validation for different types of inputs](./images/validation-1.png)  

More fancy example which uses an icon to reflect the validation status:

![validation with status icon](./images/status-icon.png)

### **A Brief Example** <a name="brief_example"></a>
```javascript
import React from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    setStatusStyleDefault,
    ValidationContext,
    withValidation,
} from "react-native-form-input-validator";
import {
    email,
    required,
} from 'react-native-form-input-validator/rules';
import server from './server';

const UserName = withValidation(TextInput, {
    rules: [email, required],
    setStatusStyle: setStatusStyleDefault,
});
const Password = withValidation(TextInput, {
    rules: required,
    setStatusStyle: setStatusStyleDefault,
});

export default function LoginForm() {
    const validationRef = React.useRef();
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    return (
        <ValidationContext ref={validationRef}>
            <Text style={styles.title}>Please login:</Text>
            <UserName
                autoCorrect={false}
                onChangeText={setUserName}
                placeholder="Email"
                style={styles.input}
                value={userName}
            />
            <Password
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
            />
            <View style={styles.buttonRow}>
                <Button
                    onPress={() => {
                        if (validationRef.current?.validate()) {
                            server.login(userName, password);
                        }
                    }}
                    title="Login"
                />
            </View>
        </ValidationContext>
    );
}

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    input: {
        borderColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        marginBottom: 10,
    },
    title: {
        marginBottom: 10,
    },
});
```

# **API Reference**
You have seen the example above. You may concern to `withValidation` and `ValidationContext` most. At a glance, you may have concluded
that `withValidation` is to specify the validation rules for the input and `ValidationContext` is to validate all inputs inside it.
Actually, each input can be validated individually and doesn't need to be put inside `ValidationContext` (see detailly
[here](#user-content-withvalidation_method-validate)). `ValidationContext` exists to validate many input at once.


## **`ValidationContext`** <a name="validationcontext"></a>

This element can validate all contained inputs in it that have been set by [`withValidation`](#user-content-withvalidation). Also, it can
clear the validation status of those inputs. You may treat this element like `form` tag in HTML document. Some properties that can be set
for this element are:
<a name="validationcontext-properties"></a>
<table>
<tr>
    <th>Name</th>
    <th>Data Type</th>
    <th>Description</th>
    <th>Default value</th>
</tr>
<tr>
    <td valign="top"><code>asyncFailMessage</code><a name="validationcontext-asyncfailmessage"></a></td>
    <td valign="top">
        enum: <code>AsyncFailMessage {</code><br/>
        <code>Default,</code><br/>
        <code>CaughtError</code><br/>
        <code>}</code>
    </td>
    <td valign="top">When executing <a href="#user-content-withvalidation_method-validateasync"><code>validateAsync</code></a> method
        happens an error, this prop specify which error message should displayed. By default, the displayed message is "cannot
        validate". But, if the prop value is <code>AsyncFailMessage.CaughtError</code> then the displayed message is taken from the
        message of the thrown error.</td>
    <td valign="top"><code>AsyncFailMessage.Default</code></td>
</tr>
<tr>
    <td valign="top"><code>auto</code><a name="validationcontext-auto"></a></td>
    <td valign="top"><code>boolean</code></td>
    <td valign="top">If <code>true</code> then all inputs inside it will be validated automatically when the user types/changes the
        input value.</td>
    <td valign="top"><code>false</code></td>
</tr>
<tr>
    <td valign="top"><code>errorTextStyle</code><a name="validationcontext-errortextstyle"></a></td>
    <td valign="top"><code>Text</code> style property</td>
    <td valign="top">The style for the error message when the input is invalid.</td>
    <td valign="top">gives red color to the text</td>
</tr>
<tr>
    <td valign="top"><code>focusOnInvalid</code><a name="validationcontext-focusoninvalid"></a></td>
    <td valign="top"><code>boolean</code></td>
    <td valign="top">If <code>true</code> then after validation, the first invalid input which has <code>focus</code> method will get the
    focus.</td>
    <td valign="top"><code>false</code></td>
</tr>
<tr>
    <td valign="top"><code>inputErrorStyle</code><a name="validationcontext-inputerrorstyle"></a></td>
    <td valign="top">input style property</td>
    <td valign="top">The style for the input when the input is invalid.</td>
    <td valign="top">gives red color to the border and text</td>
</tr>
<tr>
    <td valign="top"><code>lang</code><a name="validationcontext-lang"></a></td>
    <td valign="top"><code>function(string): string</code></td>
    <td valign="top">This function is useful for the app whose multi language. This function is to translate the error messages which are in
        english to the active language. Read <a href="#user-content-messages">this section</a> to inquire what messages need to translate.</td>
    <td valign="top"><code>s => s</code><br/>
        It means no translation.
    </td>
</tr>
</table>

<a name="validationcontext_members"></a>
#### **Methods and property of `ValidationContext` reference (the object that we get from `ref` property):**
- `clearValidation` <a name="validationcontext_method-clearvalidation"></a>   
  It executes [`clearValidation`](#user-content-withvalidation_method-clearvalidation) method of all contained inputs to clear the
  validation status of all contained inputs.

- `isValid` is the property to check the validity status of all inputs inside the context. If there is an invalid input, this property
  will have `false` value. Otherwise it's `true`. The value of this property is trusted after calling
  [`validate`](#user-content-validationcontext_method-validate) or
  [`validateAsync`](#user-content-validationcontext_method-validateasync).

- `getErrorMessage(name)`<a name="validationcontext_method-geterrormessage"></a>  
  returns the error message that is being displayed for the input whose the [name](#user-content-withvalidation-name) specified by
  `name` parameter and inside the current `ValidationContext`. It returns an empty string if no error message displayed for that input.
  It returns `undefined` if no input whose such `name`.

- `getInput(name)`<a name="validationcontext_method-getinput"></a>  
  returns the reference of the input whose the [name](#user-content-withvalidation-name) specified by `name` parameter and inside the
  current `ValidationContext`. It returns `undefined` if no input whose such `name`.

- `refreshMessage`   
  For a multi languange app, this method is useful to update the language of the error messages. This methods will re-validate
  all contained inputs so that their error messages are refreshed. Because of that, if the input is already valid then the error
  message will be gone.

- `setErrorMessage(name, message)`<a name="validationcontext_method-seterrormessage"></a>   
  This method is to set error message for an input whose the [name](#user-content-withvalidation-name) specified by `name` parameter.
  `message` parameter is the error message to show. The input must be inside the current `ValidationContext`. This method is useful
  when dealing with [server-side validation](#user-content-server-side_validation).

- `validate` <a name="validationcontext_method-validate"></a>   
  It executes [`validate`](#user-content-withvalidation_method-validate) method of all contained inputs to validate all contained
  inputs. This method returns `false` if any invalid input and returns `true` otherwise.

- `validateAsync` <a name="validationcontext_method-validateasync"></a>   
  It executes [`validateAsync`](#user-content-withvalidation_method-validateasync) method of all contained inputs to validate all
  contained inputs. This method returns a `Promise` object that will resolve to `false` if any invalid input or `true` if otherwise.


## **`withValidation`** <a name="withvalidation"></a>

This function is to create *higher-order component* that wraps an input component so that it can apply some validation rules and also
some attributes needed to define the behavior. You can see in the [example](#user-content-brief_example) above that this function takes
two parameters. The first parameter is the function/class component that will be validated. The second parameter is the option object.
The object has properties which specify validation rules and the other attributes. But if you only need to set the validation rule(s)
for the input, the second parameter can a [rule](#user-content-rule) object or an array of [rule](#user-content-rule) objects.

I think the [example](#user-content-brief_example) above is enough to depict how to use this function. So, in this section, we will
discuss the option properties more detailedly. The only property you must specify is `rules`. <a name="withvalidation-option-properties"></a>
<table>
<tr>
    <th>Name</th>
    <th>Data Type</th>
    <th>Description</th>
    <th>Default value</th>
</tr>
<tr>
    <td valign="top"><code>asyncFailMessage</code><a name="withvalidation-asyncfailmessage"></a></td>
    <td valign="top">
        enum: <code>AsyncFailMessage {</code><br/>
        <code>Default,</code><br/>
        <code>CaughtError</code><br/>
        <code>}</code>
    </td>
    <td valign="top">The purpose of this option is the same as
        <a href="#user-content-validationcontext-asyncfailmessage"><code>asyncFailMessage</code></a> for
        <code>ValidationContext</code>. If specified and inside a <code>ValidationContext</code>, it will override the specified one
        for <code>ValidationContext</code>.</td>
    <td valign="top">None (optional)</td>
</tr>
<tr>
    <td valign="top"><code>auto</code><a name="withvalidation-auto"></a></td>
    <td valign="top"><code>boolean</code></td>
    <td valign="top">If <code>true</code> then the input will be validated automatically when the user types/changes the input value.
        If specified and inside a <code>ValidationContext</code>, it will override the specified
        <a href="#user-content-validationcontext-auto"><code>auto</code></a> for <code>ValidationContext</code>. This option is ignored
        (cannot use auto validation) when you set one or more <a href="#user-content-validationruleasync">asynchronous rule</a> for
        <a href="#user-content-withvalidation-rules"><code>rules</code></a>
    </td>
    <td valign="top">None (optional)</td>
</tr>
<tr>
    <td valign="top"><code>errorTextStyle</code><a name="withvalidation-errortextstyle"></a></td>
    <td valign="top"><code>Text</code> style property</td>
    <td valign="top">The style for the error message when the input is invalid. If specified, it will overwrite the specified
        <a href="#user-content-validationcontext-errortextstyle"><code>errorTextStyle</code></a> for <code>ValidationContext</code>.
    </td>
    <td valign="top">None (optional)</td>
</tr>
<tr>
    <td valign="top"><code>getStyle</code><a name="withvalidation-getstyle"></a></td>
    <td valign="top"><code>function(props): style</code></td>
    <td valign="top">This function is to get the style specified for the input. The function will be given the <code>props</code> object of
        input as the parameter and it must return the value of property which defines the style. Usually, the property name is
        <code>style</code>. If the input is a composite component, the returned value must be the style for the root element of input.
        For example, below is an input which consists of the composite component:
<pre>
function PercentageInput({
    containerStyle,
    inputStyle,
    percentStyle,
    ...props
}) {
    return &lt;View
        style={[
            containerStyle,
            {flexDirection:'row'}
        ]}
    &gt;
        &lt;TextInput
            style={inputStyle}
            {...props}
        /&gt;
        &lt;Text style={percentStyle}&gt;%&lt;/Text&gt;
    &lt;/View&gt;;
}
</pre>
        <code>getStyle</code> must return <code>containerStyle</code> for above input.<br/>
        Read this <a href="#user-content-style_handling">section</a> why this function needed.
    </td>
    <td valign="top" nowrap><code>props => props.style</code></td>
</tr>
<tr>
    <td valign="top"><code>getValue</code><a name="withvalidation-getvalue"></a></td>
    <td valign="top"><code>function(props): any</code></td>
    <td valign="top">This function is to get the value of the input. The function will be given the <code>props</code> object of input
        as the parameter and it must return the value of property which stores the input value. You really have to specify this function
        if the input value is not stored in the property named <code>value</code>. If not, the validation won't work.
    </td>
    <td valign="top" nowrap><code>props => props.value</code></td>
</tr>
<tr>
    <td valign="top"><code>inputErrorStyle</code><a name="withvalidation-inputerrorstyle"></a></td>
    <td valign="top">input style property</td>
    <td valign="top">The style for the input when the input is invalid. It overwrites
        <a href="#user-content-validationcontext-inputerrorstyle"><code>inputErrorStyle</code></a> of <code>ValidationContext</code>. You
        must also specify <a href="#user-content-withvalidation-setstatusstyle">setStatusStyle</a> to make the input changes its style.
    </td>
    <td valign="top">None (optional)</td>
</tr>
<tr>
    <td valign="top"><code>lang</code><a name="withvalidation-lang"></a></td>
    <td valign="top"><code>function(string): string</code></td>
    <td valign="top">It's the same as <a href="#user-content-validationcontext-lang"><code>lang</code></a> property of
        <code>ValidationContext</code>. It's only used if the input is placed not inside <code>ValidationContext</code>. So, it won't
        override what is specified for <code>ValidationContext</code>
    </td>
    <td valign="top">None (optional)</td>
</tr>
<tr>
    <td valign="top"><code>name</code><a name="withvalidation-name"></a></td>
    <td valign="top"><code>string</code></td>
    <td valign="top">The name for the input. It's useful if you want to show the name in the error message. Read
        <a href="#user-content-messages">Messages</a> section and <a href="#user-content-function-str"><code>str</code></a> for more
        information. It's also used by some <a href="#user-content-validationcontext_members">methods</a> of
        <code>ValidationContext</code>.
        <!--There will be an error if there is another input whose the same name inside the same
        <a href="#user-content-validationcontext"><code>ValidationContext</code></a>.-->
    </td>
    <td valign="top">None (optional)</td>
</tr>
<tr>
    <td valign="top"><code>rules</code><a name="withvalidation-rules"></a></td>
    <td valign="top"><a href="#user-content-rule">rule</a> object or array of <a href="#user-content-rule">rule</a> objects</td>
    <td valign="top">It's the validation <a href="#user-content-rule">rules</a>. You must specify it. If not, the input component will
        be unmodified.</td>
    <td valign="top">None (required).</td>
</tr>
<tr>
    <td valign="top"><code>setStatusStyle</code><a name="withvalidation-setstatusstyle"></a></td>
    <td valign="top"><code>function(props, style, context): React.Node</code></td>
    <td valign="top">This function is called when executing <a href="#user-content-withvalidation_method-validate"><code>validate</code></a>.
        This function should change the input style to reflect the validation status (valid/invalid). This function also is executed
        in every render because the style is reverted to normal style by
        <a href="#user-content-withvalidation-setstyle"><code>setStyle</code></a> function. In which condition the function is executed,
        you can check the second parameter.<br/>
        <b>Parameters:</b>
        <ul>
            <li><code>props</code> is the properties of input. The property you should care about is that which holds style value for the
                input, usullly named <code>style</code>.</li>
            <li><code>style</code> is the style value that should be assigned to the input style property. When invalid, this parameter
                is array of two entries, the first is <a href="#user-content-validationcontext-inputerrorstyle"><code>inputErrorStyle</code></a>
                of <code>ValidationContext</code> and the second is
                <a href="#user-content-withvalidation-inputerrorstyle"><code>inputErrorStyle</code></a> option. You may ignore this value
                if you have your own way to set the style.<br/><br/>
                When the input is valid, this parameter has the falsy value. There are three possibilities of this falsy value:
                <ul>
                    <li><code>undefined</code> if valid when executing
                        <a href="#user-content-withvalidation_method-validate"><code>validate</code></a>. You may set a success style to
                        the input such as decorating it with green border.
                    </li>
                    <li><code>null</code> if when executing
                        <a href="#user-content-withvalidation_method-clearvalidation"><code>clearValidation</code></a>. Because of being
                        cleared, you should not set any status style (valid/invalid). The style should be reverted to normal.
                    </li>
                    <li><code>false</code> if when rendering process.</li>
                </ul><br/>
                The better comprehension may you get from
                <a href="#user-content-function-setstatusstyledefault"><code>setStatusStyleDefault</code></a> and this
                <a href="https://github.com/atmulyana/react-native-form-input-validator/blob/main/example/StatusIconPage.js">example</a>.
            </li>
            <li><code>context</code> is an object which has <code>flag</code> property and <code>clearValidation</code> method.
                See this <a href="https://github.com/atmulyana/react-native-form-input-validator/blob/main/example/StatusIconPage.js">example</a>
                how to use it.
            </li>
        </ul>
        <b>Return Value</b><br/>
        This function may return <code>React.Node</code>. The <code>React.Node</code> may display an icon which represents valid/invalid.
        The icon will placed beneath the input and above the error message. But, by using absolute positioning, you can place the icon at
        left/right side of input. See this
        <a href="https://github.com/atmulyana/react-native-form-input-validator/blob/main/example/StatusIconPage.js">example</a>.
    </td>
    <td valign="top">None (optional).<br/>
        You may use <a href="#user-content-function-setstatusstyledefault"><code>setStatusStyleDefault</code></a> as in the
        <a href="#user-content-brief_example">example</a> above.
    </td>
</tr>
<tr>
    <td valign="top"><code>setStyle</code><a name="withvalidation-setstyle"></a></td>
    <td valign="top"><code>function(props, style, containerStyle)</code></td>
    <td valign="top">This function is opposite of <a href="#user-content-withvalidation-getstyle"><code>getStyle</code></a>. The third
        parameter is the style for <code>View</code> container (read this <a href="#user-content-style_handling">section</a> for more
        information). This third parameter is useful in the case that you want to modify it. Because <code>setStyle</code> is invoked
        in every render, just make sure it won't mess up the layout/appearance when executed more than once. 
    </td>
    <td valign="top"><nobr><code>(props, style) =></code></nobr><br/> <nobr><code>props.style = style</code></nobr></td>
</tr>
</table>

#### **Methods and properties of the input reference (the object that we get from `ref` property):** <a name="withvalidation_methods_property"></a>
- `clearValidation` <a name="withvalidation_method-clearvalidation"></a>   
  It's to clear validation status. The error message will disappear and the input style is reverted to normal. After executing this
  method, [`isValid`](#user-content-withvalidation_property-isvalid) will be reset to `true` even if the input is invalid. If
  [`auto`](#user-content-withvalidation-auto) validation is disabled, this method will be called when the user changes the input value
  right after the validation.

- `getErrorMessage` <a name="withvalidation_method-getErrorMessage"></a>   
  This method returns the error message being displayed for the input. It returns an empty string if no error.

- `isValid` <a name="withvalidation_property-isvalid"></a>  
  It shows the validity status of input. It's `true` if valid and `false` if invalid. The value of this property is trusted after
  calling [`validate`](#user-content-withvalidation_method-validate) or
  [`validateAsync`](#user-content-withvalidation_method-validateasync).

- `name` <a name="withvalidation_property-name"></a>  
  It's the name of input. The value of this property is the same as that specified for [`name`](#user-content-withvalidation-name)
  option.

- `setErrorMessage(message)` <a name="withvalidation_method-seterrormessage"></a>  
  This method can set the error message for the input without calling [`validate`](#user-content-withvalidation_method-validate) or
  [`validateAsync`](#user-content-withvalidation_method-validateasync). It won't validate any [rule](#user-content-withvalidation-rules)
  that has been applied to the input. By calling this method, the input status becomes invalid
  ([`isValid`](#user-content-withvalidation_property-isvalid) property is `false`).

  For example, we need to validate the input on the server because we must read the database to make sure the inputed user name is
  unique. (NOTE: The example below should be solved using [asynchronous validation](#user-content-asynchronous_validation) interfaces).
  ```javascript
  const validateAsync = () => new Promise((resolve, reject) => {
      fetch(
          `https://yourserver.com/validate/unique-user-name?uname=${encodeURIComponent(userName)}`
      ).then(async (response) => {
          if (response.ok) return response.json();
          reject(await response.text());
      }).then(data => {
          if (data.userNameExists) {
              userNameInput.current?.setErrorMessage('The user name has been used');
              resolve(false);
          }
          else {
              resolve(true);
          }
      }).catch(err => {
          reject(err);
      });
  })
  .catch(err => {
      /*If there is a problem with the server, you may tell the user here or you may just keep it silent and
        try to re-validate it on the server when the form is submitted. In fact, backend validation is still
        needed all time to avoid tampered data.*/
      //userNameInput.current?.setErrorMessage('The server cannot validate');
  });
  <UserNameInput ref={userNameInput} onBlur={validateAsync} onChangeText={setUserName} value={userName} />
  ```

  Another example, when the validation process yields an error:
  ```javascript
  <UserNameInput ref={userNameInput} onChangeText={setUserName} value={userName}
     onBlur={() => {
        try {
            userNameInput.current.validate();
        }
        catch {
            userNameInput.current.setErrorMessage('An error happens when validating');
        }
     }}
  />
  ``` 

  Need to remember that [`rules`](#user-content-withvalidation-rules) option is required. If you want to use `setErrorMessage`
  method but doesn't need to apply any validation rule, you can use [`alwaysValid`](#user-content-alwaysvalid) rule.

- `validate` <a name="withvalidation_method-validate"></a>  
  This method is to validate the input based on the specified [rules](#user-content-withvalidation-rules). Below is the example how to
  validate input when it's lost focus.   

        <NameTextInput ref={nameInput} onBlur={() => nameInput.current?.validate()} onChangeText={setName} value={name} />

  This method returns `true` if input value is valid or `false` if invalid. This method will throw an error if there is a [rule object
  which does the asynchronous validation](#user-content-validationruleasync).

- `validateAsync` <a name="withvalidation_method-validateasync"></a>  
  As [`validate`](#user-content-withvalidation_method-validate), this method is also to validate the input based on the specified
  [rules](#user-content-withvalidation-rules) but the process is executed in asynchronous mode. This method returns a `Promise` object
  that will resolve to `true` if the input value is valid or `false` if otherwise.

If the original input has the same methods and property as listed above, they will be overriden. If you want to access the overridden
method/property of original input, follow the example below:

    const inputRef = React.useRef();
    ...
    <Input ref={inputRef} onBlur={() => {
        //This statement will validate the input
        inputRef.current.validate();
        
        //This statement will invoke `validate` method of original input
        inputRef.current.__proto__.validate();
    }} ... />



## **Style Handling** <a name="style_handling"></a>

To make the input and the error message stick together, [`withValidation`](#user-content-withvalidation) wraps them into a `View`
container. However, we want the component yielded by [`withValidation`](#user-content-withvalidation) behaves the same as the original
input except we add the validation feature to it. All properties for the input must apply for the new component. Every property seems
ok, we can just distribute them to the wrapped input. Except one property we think it has a problem. That is the property which defines
the style for the input. Because now, the input is inside a `View` container. We must modify the style property if we still want the
same style as if the input is unwrapped. The big concern is all style attributes dealing with layout. That is how the parent of input
arranges the area for input, before. Because now, the parent must arrange the `View` container. Therefore, the component yielded by
[`withValidation`](#user-content-withvalidation) will move all style attributes dealing with layout to be the style attributes of `View`
container. Then, the input must be set to fill the area of `View` container.

We know, the value for style property is not always plain object or a falsy value but it can be a recursive array. Therefore, the first
step is to flatten it if it's an array. Fortunately, react native has provided `StyleSheet.flatten` function to do that. After getting
a single plain object, the following style attributes will be assigned to `View` container:
- `alignSelf`
- `bottom`
- `display`
- `end`
- `flexGrow`
- `flexShrink`
- `flexBasis`
- `left`
- `margin`
- `marginBottom`
- `marginEnd`
- `marginHorizontal`
- `marginLeft`
- `marginRight`
- `marginStart`
- `marginTop`
- `marginVertical`
- `maxWidth`
- `minWidth`
- `position`
- `right`
- `start`
- `top`
- `transform`
- `width`
- `zIndex`

Some other attributes will be moved to `View` containner under a condition:
- `height`, `minHeight` and `maxHeight`, if having the percentage value
- `flex`, if greater than 0.

To make sure the input fill the area of `View` container, its `flex` attribute is set to 1 if the `View` container has one of 
attributes: `height` (percentage), `flex` or `flexBasis`. But if input has `height` (number) attribute, the `flex` attribute won't
be set.

There are two handlers you may define in `withValidtion` option which involves in this modification of style. Those are 
[`getStyle`](#user-content-withvalidation-getstyle) and [`setStyle`](#user-content-withvalidation-setstyle).

There is still a possibility that the layout will mess up when the error message comes up. That possibility happens, especially when
the parent of input (that becomes the parent of `View` container) lays its children horizontally (`flexDirection` is `row`). To
avoid it, you should set the height (not percentage) for the input.

The process explained above is executed in every render. To increase performance, it must be sure that the process is run only if
the style value changes. To do that, the package has `isDifferentStyle` function. You can import this function for your own purpose.
This function does more detailedly than a shallow compare. Let's explain in the example below:

    const style1 = {flex: 2},
          style2 = {flex: 3};
    isDifferentStyle(style1, style2); //return true
    isDifferentStyle(style1, [style1]); //return false
    isDifferentStyle([style1], [style1]); //return false
    isDifferentStyle([style1, style2], [style1, style2]); //return false
    isDifferentStyle([style1, style2], [style2, style1]); //return true
    isDifferentStyle(style1, [style2]); //return true
    isDifferentStyle([style1], [style1, style2]); //return true

So, the function simply just compares the entry in the array at the same index. The more detailedly logic can be done to make sure
that they are really different but it can cause a more complicated process that won't help increasing performance.

To help increasing performance, you must also set the style value to a constant value, not variable. For example:

    const styles = StyleSheet.create({
        input: {borderWidth: 1, ...},
        hightlight: {...},
    });
    const Input = withValidation(TextInput, ...);
    ...
    export default function Form(props) {
        ...
        return (
            ...
            //It's BAD example
            <Input style={{borderWidth: 1, ...}} ... />

            //It's good
            <Input style={styles.input} ... />

            //If you want to make a different style for
            //a condition, it's a good example
            <Input style={[
                styles.input,
                highlighted ? styles.hightlight : null,
            ]} ... />
            ...
        );
    }


## **Asynchronous Validation** <a name="asynchronous_validation"></a>

In some cases, we need to execute the validation process in asynchronous mode. The prominent example is when we need to call back the
server to check the validity of input value. May be, we need to check the database to ensure the input is valid or not. For making an
HTTP request purpose, this package has provided [`httpReq`](#user-content-httpreq) rule.

To make the process of validation in asynchronous mode, first thing you need is a rule object that can validate a value asynchronously.
This package has provided some rule objects that can make the process asynchronously. One of them has been mentioned before, that is
`httpReq`. The another one is [`ruleAsync`](#user-content-ruleasync). If these rule objects don't satisfy you, create your own rule
class which inherits [`ValidationRuleAsync`](#user-content-validationruleasync) class.

After you defines the asynchronous rule(s), as usual, set the rule(s) to [`rules`](#user-content-withvalidation-rules) option of 
[`withValidation`](#user-content-withvalidation). You may mix asynchronous and synchronous rules.
[`priority`](#user-content-validationrule_property-priority) property still applies as appropriately (an asynchronous rule won't be
examined after a synchronous rule that has lower priority).

The last step, to validate the input(s) asynchronously, you must call
[`validateAsync`](#user-content-withvalidation_method-validateasync) method of the input reference or
[`validateAsync`](#user-content-validationcontext_method-validateasync) method of the context reference. Both methods return a
`Promise` object. So, if you want to get the validation result, you should use the following statement:

    inputRef.validateAsync()
        .then(isValid => {
            //... rest of your code
        });

or

    let isValid = await inputRef.validateAsync();

The last statement must be inside an `async` function.


## **Server-side Validation** <a name="server-side_validation"></a>

`react-native-form-input-validator` pakcage is to validate inputs in React Native app. In other words, it's for client-side validation.
By existence of client-side validation, we are more confident to submit data to the server. However, is it enough? Absolutely not.
A hacker can make a request without using our app and use an invalid data. So, the server-side validation is always needed exactly
as if we are not using a rich user interface application (like an oldish web app).

Then, you may think that if we use a rule like [`httReq`](#user-content-httpreq) then the server-side validation has been done because
the validation by this rule is examined on the server. Unfortunately, it's not. We must validate the inputs right before they are
used by the corresponding business process. Clearly, the URI used by `httpReq` is different from that to where the data is submitted.
Knowing this fact, you may think that a rule like `httReq` is not needed because there will be more round-trip. Yes, you are true but
people always have different preference and there may be a situation it's needed.

Now, if we agree that the server-side validation is needed then how to notify user if there are one or more invalid inputs. You may use
an alert dialog or a Toast popup. But, it may be better if we show each error message below the corresponding input with hightlighting
style like this package does in client-side validation. It's possible by the favor of
[`setErrorMessage`](#user-content-validationcontext_method-seterrormessage) method. Follow the example below. In the example, if there
are one or more invalid inputs, the server returns status code 400 (Bad Request) and the response body is a JSON data key-ed by the
invalid input [name](#user-content-withvalidation-name)s. The value of each key is the error message for that input.
```javascript
    <Button
        onPress={() => {
            function okAction() {
                //The code to be executed when all inputs are valid ...
            }

            fetch('https://yourserver.com/check-password', {
                body: JSON.stringify(this.state),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (response) => {
                if (response.ok) okAction();
                else if (response.status == 400) {
                    const errors = await response.json();
                    for (let inputName in errors) {
                        this.contextRef.current.setErrorMessage(inputName, errors[inputName]);
                    }
                    if (this.contextRef.current.isValid) {
                        //Although, the response status is invalid but no error message provided.
                        //Therefore, we consider all inputs are valid.
                        okAction();
                    }
                }
                else {
                    Alert.alert('Validation', 'Server response is not OK');
                }
            })
            .catch(() => {
                Alert.alert('Validation', 'An error happened.');
            })
        }}
        title="Validate on server"
    />
```

To keep consistency, the logic used for the server-side validation must be the same as that used by client-side validation. If you use
Node server, you may use `react-native-form-input-validator` pakcage. However, you must import the rule objects and the needed fuctions
from "dist" directory. For example:
```javascript
    const {
        validate
    } = require("react-native-form-input-validator/dist/helpers");
    const {
        required,
        rule,
        strlen,
    } = require('react-native-form-input-validator/dist/rules');
```
To validate an input, follow the example below:
```javascript
    const passwordRules = [
        required,
        strlen(8),
        rule(
            value => {
                return /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z\d\s]/.test(value);
            },
            'The password must contain capital and non capital letter, number and non-alphanumeric characters'
        ),
    ];
    errMsg = validate(inputValue, passwordRules, inputName);
    if (typeof(errMsg) == 'string') {
        errors[inputName] = errMsg; //the error message is collected for the response data
    }
```

[Asynchronous validation](#user-content-asynchronous_validation) is still needed in server-side validation, for example, if we need
to connect to database to check the validity of input. Database connection is usually in asynchronous mode.


## **`Validation` Component** <a name="validation"></a>

`Validation` component can be used to validate a value without wrapping an input component. It has some properties which are the same as
`withValidion` [option](#user-content-withvalidation-option-properties). These properties are `auto`, `errorTextStyle`, `lang` and
`rules`. The purpose of these properties are exactly the same as `withValidion` option's. These properties are *write-once*. They are
only set when the component is mounted. If you change the properties in the next render, it won't have effect.

Beside the properties mentioned before, there are two more properties:
- `style` is the style for `View` container rendered by `Validation` component. See [Style Handling](#user-content-style_handling)
  section, which style attributes that have effect.
- `value` is the validated value. It can be an actual value or a function. If it's a function then the function will be
  executed to get the real value. The fuction is useful to create a dynamic value.

`Validation` object reference also has the same methods and property as [those](#user-content-withvalidation_methods_property) owned by
input component reference resulted by `withValidation`

**Example:**

    import React from 'react';
    import {... TextInput, ...} from 'react-native';
    import {Validation, ValidationContext} from "react-native-form-input-validator";
    import {email, required} from 'react-native-form-input-validator/rules';
    ...

    export default function Form() {
        ...
        const [emailAddress, setEmailAddress] = React.useState('');
        ...

        return (
            <ValidationContext ref={validation}>
                ...
                <TextInput onChangeText={setEmailAddress} placeholder="Email" value={emailAddress} />
                <Validation rules={[required, email]} value={emailAddress} />
                ...
            </ValidationContext>
        );
    }

You notice this example, the value of `Validation` is the same as the value of email `TextInput`. By this way, it's like to apply the
use of `withValidation` to the email `TextInput`.


## **Functions** <a name="functions"></a>

The functions here can be imported from the package.

#### **`setStatusStyleDefault`** <a name="function-setstatusstyledefault"></a>
This function is intended to be assigned to `withValidation` [`setStatusStyle`](#user-content-withvalidation-setstatusstyle) option. This
function executes the common statements to set input style. Here is the source code which may inspire you to make your own.
```javascript
function setStatusStyleDefault(props, style) {
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
}
```

#### **`str(template, valueMap)`** <a name="function-str"></a>
This function is to construct a string from a template string and a map of values. In the template string contains the placeholders
for variables to be replaced by the real value. The placeholder is in format `${variable_name}`. The real values is in `valueMap`
parameter. For example:

    str('${name} must be at least ${min}', {name: 'count', min: 5})

will return string `"count must be at least 5"`.


## **Rule Object** <a name="rule"></a>

Rule object defines how to validate the input value. For example whether it's required (cannot be empty), must be a numeric value,
must be minimum at a certain value etc. The rule object is reponsible to check whether the input value meets the desired condition
or not, to be valid. Mostly, one rule object is responsible to check only one condition. However, we can combine some rule objects
so that the input value must meet some conditions to be valid. This is why `withValidation` [rules](#user-content-withvalidation-rules)
option can be a single rule object or an array of rule objects.

This package has some *built-in* rule objects which are ready to use. These rule objects are explained in the next sections.
You can create your own rule object by creating a class that extends [`ValidationRule`](#user-content-validationrule) or
[`ValidationRuleAsync`](#user-content-validationruleasync). All rule objects are imported from
`'react-native-form-input-validator/rules'`.

### **`ValidationRule`** <a name="validationrule"></a>

This is the base class for all rule objects. Therefore, all object rules must have all properties and methods explained here. 

#### **Properties:** <a name="validationrule_properties"></a>
- `errorMessage` <a name="validationrule_property-errormessage"></a>  
  Read-only. The error message if the input is invalid. If you define a new rule class, you should override this property to return
  the default error message. The value of this property can be a template string that can include some properties of the defined
  rule object. For example: `"${name} is invalid. ${value} is not valid phone number"`.

- `isValid` <a name="validationrule_property-isvalid"></a>  
  It's `true` if valid and `false` if invalid. It's set by [`validate`](#user-content-validationrule_method-validate) method.
  Therefore, it's trusted just after calling [`validate`](#user-content-validationrule_method-validate) method.

- `lang`  
   is a function to translate the error message to the active languange. By default, the message is in english. It will be set by 
   [`validate`](#user-content-withvalidation_method-validate) method of input ref that will be the same as context
   [`lang`](#user-content-validationcontext-lang) or `widthValidation` [`lang`](#user-content-withvalidation-lang) option.

- `messageFunc` <a name="validationrule_property-messagefunc"></a>  
  Read-only. It's a function which returns the error message. This error message overwrites the default message specified by
  [`errorMessage`](#user-content-validationrule_property-errormessage). The parameter of the function is the rule object itself.
  To set this property, use [`setMessageFunc`](#user-content-validationrule_method-setmessagefunc) method.

- `name` <a name="validationrule_property-name"></a>  
  is the name of validated input. It's set by [`validate`](#user-content-withvalidation_method-validate) method of input ref which
  is the same as `widthValidation` [`name`](#user-content-withvalidation-name) option.

- `priority` <a name="validationrule_property-priority"></a>  
  Read-only. If we specify some rules to validate the input, `priority` determines which rule to be examined first. `priority` has a
  number value. The lower value means the higher priority. By existence of `priority`, you don't need to bother the order in
  [`rules`](#user-content-withvalidation-rules) array of `withValidation` option. The value of this property is set by
  [`setPriority`](#user-content-validationrule_method-setpriority).

  By default, the *built-in* rules have the priority as following (ordered based on which is examined first):
  + `required`, `required.if` (the priority cannot be changed, always the highest)
  + `email`, `numeric`, `strlen`, `strlenmax`
  + `integer`
  + `max`, `min`
  + `regex`
  + `rule`
  + `httpReq`, `ruleAsync`

  If two rules have the same priority, the order in the [`rules`](#user-content-withvalidation-rules) array determines which one first.

- `value` <a name="validationrule_property-value"></a>  
  is the input value that is validated. It's set by [`validate`](#user-content-withvalidation_method-validate) method of input ref.

- `resultValue`  
  After calling [`validate`](#user-content-validationrule_method-validate), `resultValue` will save a value with valid data type. For
  example, for `numeric` rule, it will save a number value, not string like [`value`](#user-content-validationrule_property-value). By
  default, it's the same as [`value`](#user-content-validationrule_property-value) (with the same data type).

#### **Methods:** <a name="validationrule_methods"></a>
- `setMessageFunc` <a name="validationrule_method-setmessagefunc"></a>  
  is to set [`messageFunc`](#user-content-validationrule_property-messagefunc) property.

- `setName` <a name="validationrule_method-setname"></a>  
  is to set [`name`](#user-content-validationrule_property-name) propety.

- `setPriority` <a name="validationrule_method-setpriority"></a>  
  is to set [`priority`](#user-content-validationrule_property-priority). You should set a non-negative number.

- `setValue` <a name="validationrule_method-setvalue"></a>  
  is to set [`value`](#user-content-validationrule_property-value) property.

- `validate` <a name="validationrule_method-validate"></a>  
  is to validate [`value`](#user-content-validationrule_property-value) and then set [`isValid`](#user-content-validationrule_property-isvalid)
  based on the validity of [`value`](#user-content-validationrule_property-value).

You may ask why there are some `set*` method, why don't leave *read-write* property alone. It is to make *fluent interface* which
is more convenient. For example, when you set rule for `withValidation` [`rules`](#user-content-withvalidation-rules) option:

    const Input = withValidation(..., {
        ...
        rules: [
            numeric,
            integer,
            min(0).setPriority(5),
            max(4).setMessageFunc(() => 'Too many'),
        ],
        ...
    });

or in unit test:

    expect(email.setValue('abc').validate().isValid).toBe(false);

#### **Example:** <a name="validationrule_example"></a>
An example class which you may create to validate a credit card number:
```javascript
import {ValidationRule} from 'react-native-form-input-validator/rules';
const validator = require("card-validator");

export class CreditCardNumber extends ValidationRule {
    contructor() {
        super();
        this.setPriority(0); //0 is default, but here if you want to set the priority
    }

    get errorMessage() {
        return this.lang('invalid credit card number');
    }

    validate() {
        this.isValid = validator.number(this.value).isValid;
        return this;
    }
}

export const ccNumber = new CreditCardNumber(); //`ccNumber` is more convienent to write than `new CreditCardNumber()`
```

### **`ValidationRuleAsync`** <a name="validationruleasync"></a>

All rule objects which do validation in asynchronous mode, should inherit this class. This class has all methods and properties as
owned by [`ValidationRule`](#user-content-validationrule) except the `validate` method of this class return a `Promise` object. For
example, we have to validate a credit card number input like in [`ValidationRule` example](#user-content-validationrule_example). But
here, we have a list of valid card numbers in database. So, it must make an HTTP request to ask server to validate the number. We
change `validate` method in the example before to be:
```javascript
    async validate() {
        this.isValid = await fetch(
            `https://wwww.yourserver.com/check-cc-number?number=${encodeURIComponent(this.value)}`
        ).then(response => {
            //If card number has been registered in database, server returns HTTP status code 200 (OK)
            //If not, server returns 404 (Not Found)
            return response.ok;
        });
        return this;
    }
```


### **`new Email()` or `email`** <a name="email"></a>
The rule for examined the input value whether it's a valid email address or not.

### **`new HttpReq(uri, option)` or `httpReq(uri, option)`** <a name="httpreq"></a>
This rule will make an HTTP request to validate the value. The validation is executed in asynchronous mode.
#### **Parameters:** <a name="httpreq_parameters"></a>
- `uri` is the URI string for HTTP request. This parameter is required.
- `option` defines the settings for HTTP request. This parameter is optional. `option` is a plain object whose one or more properties
  listed below (all properties are optional):
  + `data` is request data that will be sent to server. `data` can be a plain object or a `URLSearchParams` object. If `data` is set
    then the request will use POST method. [`name`](#user-content-validationrule_property-name) and
    [`value`](#user-content-validationrule_property-value) will be automatically included in `data` (you doesn't need to set them in
    `data`).   
    If `data` is not set then the request will use GET method. [`name`](#user-content-validationrule_property-name) and
    [`value`](#user-content-validationrule_property-value) will be inserted into URI string as the query part. If you want to use
    POST method but have no data other than [`name`](#user-content-validationrule_property-name) and 
    [`value`](#user-content-validationrule_property-value), set `data` as an empty object (`{}`) or as `new URLSearchParams()` without
    setting any data.
  + `headers` is a plain object contains request HTTP headers. The keys of object are the header names and their values are their
    corresponding header values. For example:

        httpReq(
            'https://www.yourserver.com/checkdata',
            {
                headers: {
                    { Authorization: `Bearer ${publicKey}` },
                    {'X-Requested-With': 'MyApp'}
                }
            }
        )

  + `silentOnFailure` if it's `true` then there won't be any error message if a problem happens to the server response. The problems
    that can happen are timeout, response code is not ok etc. The input value is also considered valid. You must revalidate the input
    value on the server. In fact, backend validation on the server is still needed all time to avoid tampered data. By default,
    `silentOnFailure` is `false` (there will be an error message if a problem happens).
  + `timeout` defines the connection timeout in milliseconds. The default value is 0 (no timeout).

The server script that handles the request made by this rule object must return a boolean value (`true` is valid or `false` is invalid)
or a string of the error message. For example, if using node express, the code would look like the following one:
```javascript
app.get('/check-validity', function(req, res) {
    const validity = validate(req.query.value); //suppose the function returns object: {isValid: boolean, errorMessage: string}
    let responseText;
    if (validity.isValid) responseText = JSON.stringify(true); //or just "true"
    else {
        if (validity.errorMessage) responseText = JSON.stringify(validity.errorMessage);
        else responseText = JSON.stringify(false); //or just "false"
    }
    res.send(responseText);
});
```

### **`new Integer()` or `integer`** <a name="integer"></a>
Checks if the input value is integer or not. If the input value is a string (such as getting from `TextInput`) and you want
it considered as number, you must also specify [`numeric`](#user-content-numeric) rule for the input. The `numeric` rule must
have higher [`priority`](#user-content-validationrule_property-priority) (default).

### **`new Max(maxValue)` or `max(maxValue)`** <a name="max"></a>
To limit the input value at maximum of `maxValue`. The data type of `maxValue` can be string, number or `Date`. If `maxValue`
is number but the input value is string (such as getting from `TextInput`) then you must also specify
[`numeric`](#user-content-numeric) rule for the input. The `numeric` rule must have higher
[`priority`](#user-content-validationrule_property-priority) (default).  
**Property:**  
- `max` is the maximum value (the same as `maxValue` parameter of contructor)

### **`new Min(minValue)` or `min(minValue)`** <a name="min"></a>
To limit the input value at minimum of `minValue`. The data type of `minValue` can be string, number or `Date`. If `minValue`
is number but the input value is string (such as getting from `TextInput`) then you must also specify
[`numeric`](#user-content-numeric) rule for the input. The `numeric` rule must have higher
[`priority`](#user-content-validationrule_property-priority) (default).  
**Property:**  
- `min` is the minimum value (the same as `minValue` parameter of contructor)

### **`new Numeric()` or `numeric`** <a name="numeric"></a>
To assess if the input value is numeric or not.

### **`new Regex(pattern, flags)` or `regex(pattern, flags)`** <a name="regex"></a>
To examine if `pattern` applies to the input value. `pattern` can be a `RegExp` object or a pattern string. If `pattern` is a
string, `flags` parameter is the flags to add to the pattern (see
[this doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp) for more information).

### **`new Required()` or `required`** <a name="required"></a>
It's to specify the input value cannot be empty. This rule is the highest priority, examined at the first time. If this rule is
not specified then the input is optional. If optional then when the input is not filled, it's assessed as valid, the other rules
that has been specified won't be examined.

### **`Required.If(predicate)` or `required.if(predicate)`** <a name="required.if"></a>
It's the same as [`required`](#user-content-required) rule but under a condition. The `predicate` parameter is a function. If it
returns `true` then the input is required. Otherwise, it's optional. The parameter for `predicate` function is the input value.

### **`Required.If(() => false)` or `alwaysValid`** <a name="alwaysvalid"></a>
Use this rule if you want to only use [`setErrorMessage`](#user-content-withvalidation_method-seterrormessage) method without
applying any other rules.

### **`new CustomRule(predicate, errorMessage)` or `rule(predicate, errorMessage)`** <a name="customrule"></a>
If you need more complicated logic to assess whether the input value is valid or invalid, this rule fits for it. The `predicate`
parameter is a function to asses the input value. The parameter of this function is the input value. The `predicate` function
may return `boolean` (`true` is valid, `false` is invalid) or a string. If it returns a string then the input is considered as
invalid. The returned string is the error message (by this way, you may create different error message for different condition).
The `errorMessage` parameter is used as the error message if `predicate` function doesn't return a string (returns `false`).
If you set [`messageFunc`](#user-content-validationrule_property-messagefunc) then the error message will be taken from
`messageFunc`.
#### **Example:** <a name="rule_example"></a>
The example below is the validator to check whether the number is between 5 to 9. If not then the value is invalid. If the value is not
a number then it return the error message "Not valid number". If the value less than 5 then the message is "The value is too small". If
the value is higher than 9 then the message is "The value is too big".
```javascript
rule(
    value => {
        const numb = parseFloat(value);
        if (isNaN(numb)) { //Needs more checking to ensure the `value` is really a number
            return false;
        }
        else if (numb < 5) {
            return 'The value is too small';
        }
        else if (numb > 9) {
            return 'The value is too big';
        }
        return true;
    },
    'Not valid number'
)
```

### **`new CustomRuleAsync(predicate, errorMessage)` or `ruleAsync(predicate, errorMessage)`** <a name="ruleasync"></a>
It is almost the same as [`rule`](#user-content-customrule) rule. The difference is it runs in asynchronous mode. The `predicate` function
for this rule doesn't return anything. As a replacement, to set the validation status (valid/invalid or the error message), it has a
second parameter which is a function. The validation status is set using this function.
#### **Example:** <a name="ruleasync_example"></a>
As an example, we change [the example for `rule`](#user-content-rule_example) to be an approprite one for `ruleAsync`.
```javascript
ruleAsync(
    (value, resolve) => {
        const numb = parseFloat(value);
        if (isNaN(numb)) { //Needs more checking to ensure the `value` is really a number
            resolve(false);
        }
        else if (numb < 5) {
            resolve('The value is too small');
        }
        else if (numb > 9) {
            resolve('The value is too big');
        }
        else {
            resolve(true);
        }
    },
    'Not valid number'
)
```

### **`new StrLength(minValue, maxValue)` or `strlen(minValue, maxValue)` or `strlenmax(maxValue)`** <a name="strlen"></a>
After the input value is converted to string, this rule is to limit the length of the value string. The minimum length is
specified by `minValue` parameter and the maximum length is specified by `maxValue` parameter. If `minValue` is undefined then
the minimum length is 0. If `maxValue` is undefined then no limit for maximum length.  
**Properties:**  
- `max` is the maximum length (the same as `maxValue` parameter of contructor)
- `min` is the minimum length (the same as `minValue` parameter of contructor)

## **Messages** <a name="messages"></a>

Each *built-in* [rule object](#user-content-rule) has default error message. All messages are collected in one object. You must
inspect them in the case that you want to translate them to the other languages. The messages can be found in `messages.js`. The
messages are listed in the following code:
```javascript
{
    asyncFail: 'cannot validate',
    email: 'invalid email address',
    httpReq: {
        disconnected: "Can't connect to server",
        notOk: "Server failed to process data",
        invalid: "Can't interpret server response",
    },
    integer: 'must be the round number',
    invalid: 'invalid',
    max: 'maximum ${max}',
    min: 'minimum ${min}',
    numeric: 'invalid numeric value',
    required: 'required',
    strlenmax: "don't exceed ${max} characters",
    strlenmin: 'must be at least ${min} characters',
}
```

These default messages can be changed that will affect the whole app. For example, you want to change 'required' message to
be 'must be filled'. To do that, insert some codes into `index.js` in the root directory of app like the following:
<pre>
    import {AppRegistry} from 'react-native';
    import App from './App';
    import {name as appName} from './app.json';

    <b style="background-color:yellow">import messages from 'react-native-form-input-validator/messages';</b>
    <b style="background-color:yellow">messages.required = 'must be filled';</b>

    AppRegistry.registerComponent(appName, () => App);
</pre>
The lines which have bold font are the inserted code.

If you read the message for `max` or `min` rule, you find the special words `${max}` and `${min}`. They are the variable placeholder
that will be replaced by the real value. The error message will be processed by [`str`](#user-content-function-str) function. The
second parameter for the function is the examined rule object. Therefore, the variable name in the template string is the property
name of the rule object. For example, in the example before, you want to display the input name in the message. You must change the
second bold line to be

    messages.required = '${name} must be filled';

To make it works, you must also set the input name in `withValidation` [name](#user-content-withvalidation-name) option.


## **Example App** <a name="messages"></a>

There is an example app you can find [here](https://github.com/atmulyana/react-native-form-input-validator/blob/main/example/)
