[![RIP Discord](https://img.shields.io/badge/chat-on%20discord-7289DA.svg)](https://discord.gg/6QjjtUcfM4)

# [RIP Frontend](https://app.RIP.finance/)

This is the front-end repo for RipProtocol that allows users to be part of the future of _Meta Greece_.

We are moving at web3 speed and we are looking for talented contributors to boost this rocket. Take a look at our [CONTRIBUTING GUIDE](CONTRIBUTING.md) if you are considering joining a world class DAO.

## 🔧 Setting up Local Development

Required:

- [Node v14](https://nodejs.org/download/release/latest-v14.x/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)

```bash
$ git clone https://github.com/R-ripDao/Frontend.git
$ cd rip-frontend

# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start

# Set up Husky (for pre-commit hooks) by running:
$ yarn prepare
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

If you would like to run the frontend in a Docker image (e.g. to isolate dependencies and the nodejs version), run `yarn docker-start`.

## Testing

We use the [React Jest](https://jestjs.io/docs/tutorial-react) test driver for unit tests, snapshot tests and e2e tests.

To run tests in interactive mode during development:

```
yarn test
```

### Unit Testing

Unit test files are co-located with the source code files that they test and follow the naming convention `*.unit.test.ts`.
For example unit tests for `OriginalSourceFile.ts` are located in `OriginalSourceFile.unit.test.ts`.
Valid extensions for test files are `.js` (JavaScript), `.ts` (TypeScript), `.jsx` (React JSX), `.tsx` (React TSX).

To run all unit test and see a coverage report:

```bash
yarn test:unit
```

Note that the focus of unit testing is to exercise all paths through the code hosted in this repo and **only** code hosted in this repo. To the extent possible, unit tests should abstract out dependencies such as remote API calls as well as crypto wallet APIs via [`mock functions`](https://jestjs.io/docs/mock-functions).

Coverage thresholds are enforced via CI checks. If a new PR introduces regression in code coverage, the CI will fail. The goal is to keep us at a minimum level of test automation coverage as we introduce new code into the repo. To see the current coverage thresholds, see the `coverageThreshold` in [`package.json`](package.json).

For integration testing automation that runs browser and remote API code as well as our own code, see the End-to-end (E2E) testing section below.

### Mocking Remote API Calls

Unit tests should minimize dependency on remote API calls. Remote API calls slow down test execution and they also occasionally error, which may fail tests for reasons outside the app code being tested. Live API calls should be tested in End-to-end/Integration tests.

[Here is an example unit test](src/helpers/index.unit.test.js) that conditionally mocks API calls.

### Generative Testing

We use [`fast-check`](https://github.com/dubzzz/fast-check) for generative testing which provides property-based coverage for ranges of input values.
[Here is an example](src/helpers/33Together.unit.test.ts) of a unit test case in this repo that uses generative testing.

### Snapshot Testing

We use [Jest Snapshot tests](https://jestjs.io/docs/snapshot-testing) to make sure the UI does not change unexpectedly.
When you make changes to the UI (intentionally), you likely will have to update the Snapshots. You can do so by running:
`yarn snapshot`.

[Here is an example](src/views/Stake/__tests__/Stake.unit.test.tsx) snapshot test and [here is the correspoding recorded snapshot](https://github.com/RipProtocolDAO/rip-frontend/blob/develop/src/views/Stake/__tests__/__snapshots__/Stake.unit.test.tsx.snap). Keep in mind that for snapshot tests to be meaningful, they have to pre-populate components with variety of data sets (realistic, edge case, invalid).

[Here is a good blog post](https://dev.to/tobiastimm/property-based-testing-with-react-and-fast-check-3dce) about testing React components with generative data sets.

### Troubleshooting

If all tests are failing in your local environment (in particular, due to a "cannot find module" error with `node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault.js`), but they should be passing (and the CI tests are passing), it's likely to be an issue with your local cache. Run the following command: `yarn test --clearCache`

## End-to-end testing

Puppeteer (with the Dappeteer addition) is used to do browser-based end-to-end testing.

To run the tests:

- Run the frontend, using `yarn start`
- In another terminal, run the tests, using `yarn test:e2e`

## Gitpod Continuous Dev Environment (optional)

This repo is configured to work with Gitpod.

### New Contributors

If you are a new contributor, you can fork the repo and start a pre-configured gitpod environment by prefixing your fork URL with `gitpod.io/#`. For example:

`https://gitpod.io/#https://github.com/.../...`

Then follow the standard [Github fork & PR workflow](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

### Permissioned Contributors

If you are an established contributor with access rights to create and push to branches in this repo, you can use a simpler flow.

1. Obtain a Personal Access Token from your github UI.
2. In your gitpod dashboard, set a new variable named `GITHUB_RIP_PERSONAL_ACCESS_TOKEN` to the value of the access token.
3. Use the button below to start a pre-configured gidpod environment.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/RipProtocolDAO/rip-frontend)

4. Follow the simplified [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow) to create new branches in the repo and submit PRs.

## Architecture/Layout

The app is written in [React](https://reactjs.org/) using [Redux](https://redux.js.org/) as the state container.

The files/folder structure are a **WIP** and may contain some unused files. The project is rapidly evolving so please update this section if you see it is inaccurate!

```
./src/
├── App.jsx       // Main app page
├── abi/          // Contract ABIs from etherscan.io
├── assets/       // Static assets (SVGs)
├── components/   // Reusable individual components
├── constants/    // Mainnet Addresses & common ABI
├── contracts/    // TODO: The contracts be here as submodules
├── helpers/      // Helper methods to use in the app
├── hooks/        // Shared reactHooks
├── themes/       // Style sheets for dark vs light theme
└── views/        // Individual Views
```

## Theme Support

Themes are available, but it can be difficult to access the theme's colors.

Material UI components, such as `Button`, can use the current theme's color scheme through the `color` property. For example:

```JSX
 <Button variant="contained" color="primary" className="cause-give-button">
  Give Yield
 </Button>
```

If you wish to use a theme's color scheme manually, follow these steps:

1. Import `useTheme`: `import { useTheme } from "@material-ui/core/styles";`
1. Instantiate the theme: `const theme = useTheme();`
1. Add a style property to the component, for example:

```JSX
 <Grid item className="cause-category" style={{ backgroundColor: theme.palette.background.default }}>
 {category}
 </Grid>
```

For the available theme properties, take a look at the themes in `src/themes`.

## ESLint

We use ESLint to find/automatically fix problems.

- react-app and react-hooks/recommended are important with react stuff.
- @typescript-eslint/recommended and @typescript-eslint/eslint-recommended as recommended defaults.
- unused-imports to automatically remove unused imports.
- simple-import-sort to automatically sort imports alphabetically. This is opinionated, but useful because it helps avoid merge conflicts with imports (and who doesn't like neat alphabetically sorted imports anyway).
- @typescript-eslint/explicit-function-return-type and @typescript-eslint/explicit-module-boundary-types are turned off to prioritise inferred return types over explicit return types. This is opinionated, but often times the inference Typescript makes is good enough, and sometimes help prevents type mismatches that are a pain to debug.
- @typescript-eslint/ban-ts-comment and @typescript-eslint/ban-ts-ignore are also turned off. This could possibly be temporary, but the ability to use @ts-ignore-like directives is certainly handy as an escape hatch as we encounter errors during the migration to TS.

## Reusable Components (Component Library)

Our codebase uses a custom component library extended from Material UI to make common UI patterns easy to implement on the frontend.
An up-to-date list of available components, implementation examples as well as documentation is available here:

## 🚀 Deployment

Auto deployed on [Fleek.co](http://fleek.co/) fronted by [Cloudflare](https://www.cloudflare.com/). Since it is hosted via IPFS there is no running "server" component and we don't have server sided business logic. Users are served an `index.html` and javascript to run our applications.

_**TODO**: TheGraph implementation/how/why we use it._

### Continuous deployment

Commits to the follow branches are automatically deployed to their respective URLs.
| Branch | URL |
| --- | --- |
| master | <https://app.ripdao.finance> |
| deploy | <https://staging.ripdao.finance> |

**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch.

### Feature Flags

- Give: by default it is enabled. It can be disabled by setting the `REACT_APP_GIVE_ENABLED` environment variable to "false".

## 🗣 Community

- [Join our Discord](https://discord.gg/6QjjtUcfM4) and ask how you can get involved with the DAO!
