import core  from "@actions/core";
import github  from "@actions/github";
import api  from 'octonode';

const client = api.client(process.env.GITHUB_TOKEN);

const hasOpenRelease = async () => {
  const { owner, repo } = github.context.repo;
  console.log(`REPO:"${repo}/${owner}" and PR:${github.context.payload.pull_request.number}`);
  const result = await client.get(`/repos/${repo}/${owner}/pulls?per_page=100&state=open`);
  console.log(`Length: ${result.length}`);
  return !!result.findIndex(el => /release\//.test(el.head.ref));
}

const addWarningComment = async () => {
  const { owner, repo } = github.context.repo;
  await client.post(`/repos/${repo}/${owner}/pulls/${github.context.payload.pull_request.number}/comments`, {
    body: 'MOSCA OPEN PULL REQUEST'
  });
}

async function run() {
  try {
    console.log('START PROCESS');
    const openRelease = await hasOpenRelease()
    if(openRelease) {
      await addWarningComment()
    }
  } catch (error) {
    console.log('ERROR', error);
    core.setFailed(error.message);
  }
}

run()
