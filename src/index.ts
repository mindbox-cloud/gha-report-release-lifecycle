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

async function run(): Promise<void> {
  const username = core.getInput('username', { required: true });
  const password = core.getInput('password', { required: true });
  const serviceName = core.getInput('serviceName', { required: true });
  const version = core.getInput('releaseVersion', { required: true });
  const vcsRevision = core.getInput('releaseRevision', { required: true });
  const pipelinesAuthToken = core.getInput('pipelinesAuthToken');

  const runId = github.context.runId;
  console.log(runId);
  console.log(JSON.stringify(process.env));

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

  await sendBuild(nexusServiceUrl, nexusOptions);

  if (pipelinesAuthToken.length !== 0) {
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

    await sendBuild(pipelinesServiceUrl, pipelinesOptions);
  }
}

run();
