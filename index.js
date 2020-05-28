"use strict";

const core = require('@actions/core');
const request = require('request')
const str = require('underscore.string');

const getValue = (path) => {
    const value = core.getInput(path);
    if (str.isBlank(value)) {
        const errorMessage = `Parameter '${path}' is required.`;
        core.setFailed(errorMessage);
        throw new Error(errorMessage);
    }
    return value;
};

const username = getValue('username');
const password = getValue('password');
const serviceName = getValue('serviceName');
const version = getValue('releaseVersion');;
const vcsRevision = '1111111';

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