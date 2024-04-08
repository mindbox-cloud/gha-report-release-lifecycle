"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const node_fetch_1 = __importDefault(require("node-fetch"));
function sendBuild(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, node_fetch_1.default)(url, options);
            if (result.ok) {
                core.info(`Project build was send`);
            }
            else {
                throw new Error('response code: ' + result.statusText);
            }
        }
        catch (error) {
            const errorMessage = `Error while creating build ${url}': '${error}'`;
            core.setFailed(errorMessage);
            throw new Error(errorMessage);
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceName = core.getInput('serviceName', { required: true });
        const version = core.getInput('releaseVersion', { required: true });
        const pipelinesAuthToken = core.getInput('pipelinesAuthToken', { required: true });
        const runId = github.context.runId;
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
            yield sendBuild(pipelinesServiceUrl, pipelinesOptions);
        }
    });
}
run();
