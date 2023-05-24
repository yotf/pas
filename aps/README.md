# Huni - Advanced planning

## 🔗Swagger  links
[Demo environment](http://webapiplaning.helveticode.ch/swagger/index.html)
[Test environment](http://webapiplaningstaging.helveticode.ch/swagger/index.html)
[Staging environment](http://webapiplaningproduction.helveticode.ch/swagger/index.html)

## React app links
[Demo environment](http://192.168.1.67:3000/)
[Test environment](http://hunitest.ad.itengine.rs/)

## Table of Content:
- [Tehnical details](#tehnical-details)
- [Branches](#branches)
	- [Branch rules](#branch-rules)
- [Installation](#installation)
	- [NPM install](#npm-install)
	- [Start app](#start-app)
	- [Build app](#build-app)
	- [Preview build version of app](#preview-build-version-of-app)
	- [Test app](#test-app)
	- [ESLint](#eslint)
	- [Documentation](#documentation)
- [Release](#release)

##  Tehnical details
Used:
- [Node](https://nodejs.org/en/) 18.4.0
- [React](https://reactjs.org/) 18.2.0
- npm 8.12.1

## Branches
- `master` - for deploying to production environment
- `develop` - for development purpose
- `test` - for deploying to test environment

### Branch rules
When you start working on new features, bugfix, improvement etc, you need to create branch from `development` with correct prefix.
In case that we have some issue on production, create branch from `master`
After finishing your development, create MR to parent branch (branch you created from you own branch) and assign one of the members of the team

Naming of branches looks like this:
`feature/{ticket-number}-{ticket-title}`
Type of branch prefixes are:
- `feature` - adding a new functionality to app
- `bugfix` - fixing issues 
- `improvement` - optimize your code
- `library` - adding some new library
- `prerelease` - creating a prerelease
- `release` - creating a release
- `hotfix` - create a fix for production

Thanks to [commitizen](https://www.npmjs.com/package/commitizen) run command `npm run commit` when you want to commit you changes to git.

##  Installation
We are using npm for installing `node_modules`
### NPM install
`npm i` or `npm install`
### Start app
`npm run start` - Run for development
`npm run start:test` - Run with configuration of test environment. In case that we are using Windows machine, please install [win-node-env](https://www.npmjs.com/package/win-node-env)
`npm run start:production` - Run with configuration of production environment
### Build app
`npm run build` - Build with development environment
`npm run build:test` - Build with test environment
`npm run build:production` - Build with production environment
### Preview build version of app
`npm run preview`
### Test app
`npm run test` - Test and watch
`npm run test:noWatch` - Test without watch
`npm run test:report` - Test app and generate report about test coverage
### ESLint
`npm run lint` - ESLint with warnings and errors
`npm run lint:fix` - ESLint with fixing code
### Documentation
`npm run documentation` - Generate tehnical documentation of code

## Release
For generating `CHANGELOG.md` file, we are using [standard-version](https://www.npmjs.com/package/standard-version), so just run command `npm run release` and file will be automatically created. Plus, in `package.json` you will get incremented automatically version of app
After command is done, run `git push --follow-tags origin {GIT_BRANCH}`

## Deployment
`npm run build:{env}` - Generate build for selected environment\
Copy build directory to hosting server
