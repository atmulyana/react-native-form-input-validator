/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 * @flow strict-local
 */
import type {ComparableType, HttpReqOption, Rule} from '../types';
import messages from '../messages';
import ValidationRuleAsync from './ValidationRuleAsync';

export class HttpReq extends ValidationRuleAsync<?ComparableType | boolean> {
    constructor(uri: string, option?: HttpReqOption) {
        super();
        this.#uri = uri;
        this.#option = option;
        this.setPriority(1001);
    }
    
    #message: ?string;
    #option: ?HttpReqOption; 
    #uri: string;

    //$FlowIgnore[unsafe-getters-setters]
    get errorMessage(): ?string {
        return this.#message;
    }

    validate(): Promise<Rule<?ComparableType | boolean>> {
        this.#message = messages.invalid;
        return new Promise(($resolve, $reject) => {
            const resolve = (value: boolean | string): void => {
                this.isValid = false;
                if (value === true) this.isValid = true;
                else if (typeof(value) == 'string') this.#message = value;
                else if (value !== false) this.#message = messages.httpReq.invalid;
                $resolve(this);
            };
            const reject = (value: string): void => {
                this.isValid = false;
                $reject(value);
            }
            
            const xhr = new XMLHttpRequest(),
                {
                    data,
                    headers,
                    silentOnFailure = false,
                    timeout = 0,
                    withCredentials = false,
                } = this.#option ?? {};
            let reqData: ?string,
                contentType: ?string,
                method: string;

            if (data) {
                method = 'POST';
                if (data instanceof URLSearchParams) {
                    contentType = 'application/x-www-form-urlencoded';
                    data.set('value', (this.value ?? '').toString());
                    data.set('name', this.name ?? '');
                    reqData = data.toString()
                }
                else if (typeof(data) == 'object') {
                    contentType = 'application/json';
                    data['value'] = this.value;
                    data['name'] = this.name;
                    reqData = JSON.stringify(data);
                }
            }
            else {
                method = 'GET';
                let i = this.#uri.indexOf('#'),
                    uri = this.#uri,
                    search = '',
                    hash = '';
                if (i >= 0) {
                    hash = uri.substring(i);
                    uri = uri.substring(0, i);
                }
                i = uri.indexOf('?');
                if (i >= 0) {
                    search = uri.substring(i);
                    uri = uri.substring(0, i);
                }

                const params = new URLSearchParams(search);
                params.set('value', (this.value ?? '').toString());
                params.set('name', this.name ?? '');
                const getParams = params.toString();

                this.#uri = uri
                            + (getParams ? '?' + getParams : '')
                            + hash;
            }
            
            xhr.open(method, this.#uri);
            xhr.timeout = timeout;
            xhr.withCredentials = withCredentials;
            
            if (typeof(headers) == 'object' && headers) {
                for (const headerName in headers) {
                    if (typeof(headers[headerName]) == 'string')
                        xhr.setRequestHeader(headerName, headers[headerName]);
                }
            }
            if (contentType) xhr.setRequestHeader('Content-Type', contentType);

            xhr.onload = () => {
                if (xhr.status < 200 || xhr.status > 299) {
                    if (silentOnFailure) resolve(true);
                    else reject(messages.httpReq.notOk);
                }
                else {
                    const responseData = JSON.parse(xhr.responseText);
                    resolve(responseData);
                }
            }
    
            xhr.ontimeout = xhr.onerror = () => {
                if (silentOnFailure) resolve(true);
                else reject(messages.httpReq.disconnected);
            }

            xhr.send(reqData);
        });
    }
}

export const httpReq = (uri: string, option?: HttpReqOption): HttpReq => new HttpReq(uri, option);