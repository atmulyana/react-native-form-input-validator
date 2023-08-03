'use strict';
const {
    validate
} = require("../dist/helpers");
const {
    required,
    rule,
    strlen,
} = require('../dist/rules');

const http = require("http");
const host = '0.0.0.0';
const port = 1234;

const server = http.createServer(function(req, resp) {
    function Ok() {
        resp.writeHead(200, { 'Content-Type': 'text/plain' });
        resp.end('Ok');
    }

    if (req.method == 'GET') {
        Ok();
        return;
    }

    let data = "";
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        if (req.url == '/check-password') {
            data = JSON.parse(data);
            const errors = validatePassword.bind(data)();
            if (Object.keys(errors).length > 0) {
                resp.writeHead(400, { 'Content-Type': 'application/json' });
                resp.end(JSON.stringify(errors));
                return;
            }
        }
        Ok();
    });
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

function validatePassword() {
    const errors = {};
    const _validate = (value, rules, inputName) => {
        const errMsg = validate(value, rules, inputName);
        if (typeof(errMsg) == 'string') {
            errors[inputName] = errMsg;
            return false;
        }
        return true;
    };
    const valids = {
        password: false,
    };
    
    const rules = {
        password: [
            required,
            strlen(8),
            rule(
                value => {
                    return /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z\d\s]/.test(value);
                },
                'The password must contain capital and non capital letter, number and non-alphanumeric characters'
            ),
        ],
        confirmPassword: [
            required.if(() => valids.password),
            rule(
                value => this.password === value,
                'must be the same as `Password` above'
            ),
        ],
    };
    
    for (let inputName in rules) {
        valids[inputName] = _validate(this[inputName], rules[inputName], inputName);
    }

    return errors;
}