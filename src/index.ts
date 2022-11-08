import * as core from '@actions/core';
import * as github from '@actions/github';
import fetch, { RequestInit } from 'node-fetch';

async function sendBuild(url: string, options: RequestInit): Promise<void> {
  try {
    const result = await fetch(url, options);

    if (result.ok) {
      core.info(`Project build was send`);
    } else {
      throw new Error('response code: ' + result.statusText);
    }
  } catch (error) {
    const errorMessage = `Error while creating build ${url}': '${error}'`;
    core.setFailed(errorMessage);

    throw new Error(errorMessage);
  }
}

function getValue(parameter: string): string {
  const value = core.getInput(parameter);

  if (value.trim().length === 0) {
    const errorMessage = `Parameter '${parameter}' is required.`;
    core.setFailed(errorMessage);

    throw new Error(errorMessage);
  }

  return value;
}

async function run(): Promise<void> {
  const username = getValue('username');
  const password = getValue('password');
  const serviceName = getValue('serviceName');
  const version = getValue('releaseVersion');
  const vcsRevision = getValue('releaseRevision');
  const pipelinesAuthToken = core.getInput('pipelinesAuthToken');

  const runId = github.context.runId;

  const nexusServiceUrl = `https://nexus-services.mindbox.ru/releases/create-built-release`;

  const nexusBody = {
    serviceName: serviceName,
    vcsRevision: vcsRevision,
    version: version,
  };

  const nexusOptions = {
    method: 'post',
    body: JSON.stringify(nexusBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
    },
  };

  const pipelinesServiceUrl = `https://pipelines-services.mindbox.ru/releases/submit-data`;

  const pipelinesBody = {
    serviceName: serviceName,
    version: version,
    runId: runId,
  };

  const pipelinesOptions = {
    method: 'post',
    body: JSON.stringify(pipelinesBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + pipelinesAuthToken,
    },
  };

  await sendBuild(nexusServiceUrl, nexusOptions);
  await sendBuild(pipelinesServiceUrl, pipelinesOptions);
}

run();
