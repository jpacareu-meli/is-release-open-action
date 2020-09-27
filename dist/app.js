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
function getOpenPullRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = client.repo(github_1.default.context.payload.repository.full_name);
        const result = yield repo.prsAsync({ per_page: 100, state: "open" });
        return result[0];
    });
}
function addWarningComment() {
    return __awaiter(this, void 0, void 0, function* () {
        // get pr id
        if (github_1.default.context.eventName === 'pull_request') {
            var ghpr = client.pr(github_1.default.context.payload.repository.full_name, 123);
            // ghpr.createCommentAs({
            //   body: 'my comment',
            //   commit_id: '8cde3b6c5be2c3067cd87ee4117c0f65e30f3e1f', // needed to comment on current time in PR
            // });
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prs = yield getOpenPullRequests();
            const prsJSON = JSON.stringify(prs, undefined, 2);
            console.log(`The OPEN PRs are: ${prsJSON}`);
            console.log(`Context: ${JSON.stringify(github_1.default.context, undefined, 2)}`);
        }
        catch (error) {
            core_1.default.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=app.js.map