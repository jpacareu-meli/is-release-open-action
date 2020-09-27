import core  from "@actions/core";
import github  from "@actions/github";
import api  from 'octonode';

const client = api.client(process.env.GITHUB_TOKEN);

async function getOpenPullRequests() {
  const repo = client.repo(github.context.payload.repository.full_name);
  const result = await repo.prsAsync({ per_page: 100, state: "open" });
  return result[0];
}

async function addWarningComment() {
  // get pr id
  if(github.context.eventName === 'pull_request') {
    var ghpr = client.pr(github.context.payload.repository.full_name, 123);
    // ghpr.createCommentAs({
    //   body: 'my comment',
    //   commit_id: '8cde3b6c5be2c3067cd87ee4117c0f65e30f3e1f', // needed to comment on current time in PR
    // });
  }
}

async function run() {
  try {
    const prs = await getOpenPullRequests()
    const prsJSON = JSON.stringify(prs, undefined, 2);

    console.log(`The OPEN PRs are: ${prsJSON}`);
    console.log(`Context: ${JSON.stringify(github.context, undefined, 2)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()