"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const request = __importStar(require("request"));
const str = __importStar(require("underscore.string"));
const getValue = (parameter) => {
    const value = core.getInput(parameter);
    if (str.isBlank(value)) {
        const errorMessage = `Parameter '${parameter}' is required.`;
        core.setFailed(errorMessage);
        throw new Error(errorMessage);
    }
    return value;
};
const username = getValue('username');
const password = getValue('password');
const serviceName = getValue('serviceName');
const version = getValue('releaseVersion');
const vcsRevision = getValue('releaseRevision');
const baseServiceUrl = `https://nexus-services.directcrm.ru/releases/create-built-release`;
const auth = {
    username: username,
    password: password
};
const body = {
    serviceName: serviceName,
    vcsRevision: vcsRevision,
    version: version
};
const sendBuild = (options) => {
    request.post(options, (error, response) => {
        if (response && response.statusCode == 200) {
            core.info(`Project build was send`);
        }
        else {
            const errorMessage = `Error while creating build ${options.url}': '${error}', response code: ${response && response.statusCode}`;
            core.setFailed(errorMessage);
            throw new Error(errorMessage);
        }
    });
};
const options = {
    url: baseServiceUrl,
    auth: auth,
    body: body,
    json: true
};
sendBuild(options);
