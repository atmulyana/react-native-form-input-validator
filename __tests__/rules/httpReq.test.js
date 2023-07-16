/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {httpReq} from '../../lib/rules/httpReq';
import {str} from '../../lib/helpers/common';
import messages from '../../lib/messages';

class MockXHR {
    #headers = {};
    #method = 'GET';
    #outTimer = null;
    #reqTimer = null;
    #uri = '';
    onload = null;
    ontimeout = null;
    responseText = '';
    status = 200;
    timeout = 0;

    open(method, uri) {
        this.timeout = 0;
        this.#headers = {};
        this.#method = method;
        this.#uri = uri;
    }

    send(data) {
        if (this.timeout > 0) {
            this.#outTimer = setTimeout(() => {
                clearTimeout(this.#reqTimer);
                this.#outTimer = null;
                this.ontimeout && this.ontimeout();
            }, this.timeout);
        }

        this.#reqTimer = setTimeout(() => {
            if (this.#outTimer !== null) {
                clearTimeout(this.#outTimer);
                this.#outTimer = null;
            }
            
            let i = this.#uri.indexOf('#'),
                uri = this.#uri,
                search = '',
                hash = '';
            if (i >= 0) {
                hash = uri.substring(i+1).trim();
                uri = uri.substring(0, i);
            }
            i = uri.indexOf('?');
            if (i >= 0) {
                search = uri.substring(i);
                uri = uri.substring(0, i);
            }
            
            if (this.#method == 'POST') {
                if (this.#headers['Content-Type'] == 'application/x-www-form-urlencoded') {
                    data = new URLSearchParams(data);
                }
                else if (this.#headers['Content-Type'] == 'application/json') {
                    data = JSON.parse(data);
                }
            }
            else data = new URLSearchParams(search);

            let message, name, value;
            if (data instanceof URLSearchParams) {
                message = data.get('message');
                name = data.get('name');
                value = data.get('value');
            }
            else {
                message = data.message + '';
                name = data.name;
                value = data.value;
            }

            if (message == 'error') {
                this.status = 500;
                this.responseText = 'Internal Server Error';
            }
            else if (message == 'true') {
                this.status = 200;
                this.responseText = JSON.stringify(true);
            }
            else if (message == 'false') {
                this.status = 200;
                this.responseText = JSON.stringify(false);
            }
            else {
                if (hash) hash += ':';
                this.status = 200;
                this.responseText = JSON.stringify(str(message, {hash, name, value}));
            }
            this.onload && this.onload();
        }, 200);
    }

    setRequestHeader(name, value) {
        this.#headers[name] = value;
    }
}

global.XMLHttpRequest = MockXHR;

function url(message) {
    let uri = 'http://localhost/check';
    if (message) uri += '?message=' + encodeURIComponent(message);
    uri += '#Error';
    return uri;
}

test('httpReq: POST url-encoded valid', async () => {
    const data = new URLSearchParams();
    data.set('message', 'true');
    const rule = httpReq(url(), {data});
    await rule.validate();
    expect(rule.isValid).toBe(true);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: POST url-encoded invalid', async () => {
    const data = new URLSearchParams();
    data.set('message', 'false');
    const rule = httpReq(url(), {data});
    await rule.validate();
    expect(rule.isValid).toBe(false);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: POST url-encoded invalid with message', async () => {
    const data = new URLSearchParams();
    data.set('message', '${hash} ${name} input cannot have value "${value}"');
    const rule = httpReq(url(), {data}).setName('name').setValue('123');
    await rule.validate();
    expect(rule.isValid).toBe(false);
    expect(rule.errorMessage).toBe('Error: name input cannot have value "123"');
});

test('httpReq: POST json valid', async () => {
    const data = {message: true};
    const rule = httpReq(url(), {data});
    await rule.validate();
    expect(rule.isValid).toBe(true);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: POST json invalid', async () => {
    const data = {message: false};
    const rule = httpReq(url(), {data});
    await rule.validate();
    expect(rule.isValid).toBe(false);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: POST json invalid with message', async () => {
    const data = {message: '${hash} ${name} input cannot have value "${value}"'};
    const rule = httpReq(url(), {data}).setName('name').setValue('123');
    await rule.validate();
    expect(rule.isValid).toBe(false);
    expect(rule.errorMessage).toBe('Error: name input cannot have value "123"');
});

test('httpReq: GET valid', async () => {
    const rule = httpReq(url('true'));
    await rule.validate();
    expect(rule.isValid).toBe(true);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: GET invalid', async () => {
    const rule = httpReq(url('false'));
    await rule.validate();
    expect(rule.isValid).toBe(false);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: GET invalid with message', async () => {
    const rule = httpReq(url('${hash} ${name} input cannot have value "${value}"')).setName('name').setValue('123');
    await rule.validate();
    expect(rule.isValid).toBe(false);
    expect(rule.errorMessage).toBe('Error: name input cannot have value "123"');
});

test('httpReq: Error', async () => {
    const rule = httpReq(url('error'));
    try {
        await rule.validate();
        expect('must be error').toBe('not error');
    }
    catch (err) {
        expect(err).toBe(messages.httpReq.notOk);
    }
    expect(rule.isValid).toBe(false);
});

test('httpReq: Error silent', async () => {
    const rule = httpReq(url('error'), {silentOnFailure: true});
    await rule.validate();
    expect(rule.isValid).toBe(true);
    expect(rule.errorMessage).toBe(messages.invalid);
});

test('httpReq: Timeout', async () => {
    const rule = httpReq(url(), {timeout: 100});
    try {
        await rule.validate();
        expect('must be error').toBe('not error');
    }
    catch (err) {
        expect(err).toBe(messages.httpReq.disconnected);
    }
    expect(rule.isValid).toBe(false);
});

test('httpReq: Timeout silent', async () => {
    const rule = httpReq(url(), {silentOnFailure: true, timeout: 100});
    await rule.validate();
    expect(rule.isValid).toBe(true);
    expect(rule.errorMessage).toBe(messages.invalid);
});