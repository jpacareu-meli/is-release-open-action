import core  from "@actions/core";
import github  from "@actions/github";
import api  from 'octonode';

const client = api.client(process.env.GITHUB_TOKEN);

const hasOpenRelease = async () => {
  console.log(`REPO:"${github.repository}" and PR:${github.event.number}`);
  const result = await client.get(`/repos/${github.repository}/pulls?per_page=100&state=open`);
  console.log(`Length: ${result.length}`);
  return !!result.findIndex(el => /release\//.test(el.head.ref));
}

const addWarningComment = async () => {
  await client.post(`/repos/${github.repository}/pulls/${github.event.number}/comments`, {
    body: 'MOSCA OPEN PULL REQUEST'
  });
}

async function run() {
  try {
    const openRelease = await hasOpenRelease()
    if(openRelease) {
      await addWarningComment()
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
