"use strict";
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
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const octonode_1 = __importDefault(require("octonode"));
const client = octonode_1.default.client(process.env.GITHUB_TOKEN);
const hasOpenRelease = () => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, repo } = github_1.default.context.repo;
    console.log(`REPO:"${repo}/${owner}" and PR:${github_1.default.context.payload.pull_request.number}`);
    const result = yield client.get(`/repos/${repo}/${owner}/pulls?per_page=100&state=open`);
    console.log(`Length: ${result.length}`);
    return !!result.findIndex(el => /release\//.test(el.head.ref));
});
const addWarningComment = () => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, repo } = github_1.default.context.repo;
    yield client.post(`/repos/${repo}/${owner}/pulls/${github_1.default.context.payload.pull_request.number}/comments`, {
        body: 'MOSCA OPEN PULL REQUEST'
    });
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('START PROCESS');
            const openRelease = yield hasOpenRelease();
            if (openRelease) {
                yield addWarningComment();
            }
        }
        catch (error) {
            console.log('ERROR', error);
            core_1.default.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=app.js.map