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
const octonode_1 = __importDefault(require("octonode"));
const token = core.getInput("GITHUB_TOKEN", { required: true });
const client = octonode_1.default.client(token);
const { owner, repo } = github.context.repo;
const { number: prNumber, base } = github.context.payload.pull_request;
const RELEASE_REGEX = /release\//;
const octokit = github.getOctokit(token);
const getOpenRelease = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentRepo = client.repo(`${owner}/${repo}`);
    const result = yield currentRepo.prsAsync({ per_page: 100, state: "open" });
    return result[0].find((el) => { var _a; return Boolean(RELEASE_REGEX.test((_a = el === null || el === void 0 ? void 0 : el.head) === null || _a === void 0 ? void 0 : _a.ref)); });
});
const addWarningComment = (release) => __awaiter(void 0, void 0, void 0, function* () {
    yield octokit.pulls.createReview({
        owner,
        repo,
        pull_number: prNumber,
        event: "COMMENT",
        body: `🚨🚨🚨 BEWARE THERE IS AN [OPEN RELEASE](${release.html_url}) 🚨🚨🚨

    > action created by Paca 🇨🇺`,
    });
});
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const openRelease = yield getOpenRelease();
            const isSameReleaseBranch = RELEASE_REGEX.test(base === null || base === void 0 ? void 0 : base.ref) && ((base === null || base === void 0 ? void 0 : base.ref) === ((_a = openRelease === null || openRelease === void 0 ? void 0 : openRelease.head) === null || _a === void 0 ? void 0 : _a.ref));
            if (openRelease && !isSameReleaseBranch) {
                yield addWarningComment(openRelease);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=app.js.map