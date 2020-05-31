import * as core from '@actions/core';
import * as request from 'request';
import * as str from 'underscore.string';

interface RequestOptions {
    url: string;
    auth: {
        username: string;
        password: string;
    }
    body: {
        serviceName :string;
        version: string;
        vcsRevision: string;
    }
}

const getValue = (parameter: string) : string => {
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

const sendBuild = (options : RequestOptions) : void => {
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