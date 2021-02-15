import * as core from "@actions/core";
import * as github from "@actions/github";
import api from "octonode";

const token = core.getInput("GITHUB_TOKEN", { required: true });
const client = api.client(token);

const { owner, repo } = github.context.repo;
const { number: prNumber } = github.context.payload.pull_request;

const octokit = github.getOctokit(token);

const getOpenRelease = async () => {
  const currentRepo = client.repo(`${owner}/${repo}`);
  const result = await currentRepo.prsAsync({ per_page: 100, state: "open" });
  return result[0].find((el) => Boolean(/release\//.test(el?.head?.ref)));
};

const addWarningComment = async (release) => {
  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: prNumber,
    event: "COMMENT",
    body: `🚨🚨🚨 BEWARE THERE IS AN [OPEN RELEASE](${release.html_url}) 🚨🚨🚨

    > action created by Paca 🇨🇺`,
  });
};

async function run() {
  try {
    const openRelease = await getOpenRelease();
    if (openRelease) {
      await addWarningComment(openRelease);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
