

```text
In the last stack trace you provided, it seems like you are indeed calling the workflow bundler, but you are doing that at runtime, from your worker.ts file. That means that webpack, and other packages are required to bundle your workflows must be present at runtime, and that swc and other packages that contains native code must include the native libraries for the exact platform on which the worker is being executed.
Now, the electron builder is making things a little bit more complicated, as it prepares a distinct application bundle for each supported target platform. freebsd-x64 just happens to be one of those, but locally, I see errors for 14 targets. In each case, the electron builder is forcing the webpack to assume a specific runtime platform (ie. hijacking the value returned by process.platform and process.arch, which means that swc-core will try to require the swc binding package for the target platform and architecture. But you don’t have that package in your local node_modules directory, which is why the process fails at that point.
```

```text
A second problem you are facing is that parts of your applications (including your workflows definition, the @temporalio/workflow package, and a few more) are getting bundled twice, ie. a first time by the electron forge packager, and a second time by the Temporal SDK’s webpack bundler. The Electron packager is not aware of specific configurations required for bundling of workflows, which makes it fail while trying to rebundle our packages (that’s why you got the Module not found: Error: Can't resolve '__temporal_custom_failure_converter error message).

```

```text
Thankfully, fixing this is not that difficult, though the proper solution depends on what you really wanna do. I’ll assume that your workflows are not meant to be modified after the application is packages (ie. your electron app gets packages with very specific workflows; modifying workflows require bundling and releasing a new version of your application). Ask for more details if that assumption is wrong.
In that case, you will need to make these four essential changes:
Prepare your workflow bundle BEFORE you package your Electron App. This is similar to what you have tried previously, but this must be done as a distinct build step (something like npm run bundle-workflows, or maybe as distinct task from your electron forge config, though I can’t help you with that). The important thing is that you must not be calling bundleWorkflow from your application’s code. See this example for how this can be done.
In your worker.ts file, you will need to specify your workflow bundle path (ie. workflow-bundle.js) rather than the path of your workflows.ts file. You may want to do that conditionally, eg. based on the presence of an environment variable, so that you don’t need to prebundle your workflows while developing locally. See here for an example of this.
In your electron bundler’s webpack config, you will need to exclude inclusion of the webpack package. I believe you should be able to do so by adding the following config to your webpack.main.config.ts file:
      resolve: {
        alias: {
          webpack: false,
        },
      },
4. You will need to ensure that your electron builder consider all @temporalio/* packages as externals dependencies. I don’t know exactly how this is done in electron forge, you will need to do some search for this. Just make sure you don’t get fooled by a webpack-only solution (eg. adding something like externals: { ... } in your webpack.main.config.ts, without anything else, as these packages must be included in your final application bundle.
```