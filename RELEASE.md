# RELEASE

The release process is automated using Github Actions. This automated process mirrors the manual one currently used.

## Branch workflow

### Start a release

Everytime a new release starts, you have to run the action *create-release-pr*.
It will ask if you wanna relase a patch, a minor or a major.
After that, it will:

- Generate a new version of the package
- Create a branch with this name release/*\<new-version>* starting from *develop*
- It will update the *package.json*
- It will update the *publiccode.yml*
- It will open a PR on that branch

The PR process has the aim of giving the freedom to do manual editing.
You MUST update *CHANGELOG.md* manually before closing the PR.

### Finishing a release

Another Github Action, *finish-release*, is triggered when the PR is closed on *main*.

This action will:

- Create a tag and push it
- Merge *main* on *develop*
- Create a *release package* on Github

It's highly recommended to edit manually the description of the release.
It will be automated in the next releases. 

## Future enhancements

This worfklow will be changed with the adoption of more solid and more robust solutions.