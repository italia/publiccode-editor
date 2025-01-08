// start: https://gitlab.com/opencity-labs/area-personale/core/-/raw/master/publiccode.yml?ref_type=heads
// target: https://gitlab.com/api/v4/projects/opencity-labs%2Farea-personale%2Fcore/repository/files/publiccode.yml?ref=master

import { adaptToGitlabAPIUrl, getContentFromGitlabBodyResponse } from "./gitlab-url-adapter";


// this is the API
// https://gitlab.com/api/v4/projects/:id/repository/files/:filename?ref=:branch_name
// id: URL-Encoded project name
// filename: URL-Encoded path to the file
// branch_name: name of the branch
// 1: get the url
// 2: take the project name
// 3: get che path to the file
// 4: get the branch
// 5: url encode them
// 6: call the api
const importFromGitlab = async (url: URL) => {
    const gitlabAPI = adaptToGitlabAPIUrl(url)

    const { body, ok } = await fetch(gitlabAPI)

    if (!ok || body === null) {
        throw new Error();
    }

    return getContentFromGitlabBodyResponse(body)
}

export default importFromGitlab;