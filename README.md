

关于 text: 'Could not resolve "__temporal_custom_payload_converter" 问题的描述
```text
In the last stack trace you provided, it seems like you are indeed calling the workflow bundler, but you are doing that at runtime, from your worker.ts file. That means that webpack, and other packages are required to bundle your workflows must be present at runtime, and that swc and other packages that contains native code must include the native libraries for the exact platform on which the worker is being executed.
Now, the electron builder is making things a little bit more complicated, as it prepares a distinct application bundle for each supported target platform. freebsd-x64 just happens to be one of those, but locally, I see errors for 14 targets. In each case, the electron builder is forcing the webpack to assume a specific runtime platform (ie. hijacking the value returned by process.platform and process.arch, which means that swc-core will try to require the swc binding package for the target platform and architecture. But you don’t have that package in your local node_modules directory, which is why the process fails at that point.
```

```text
A second problem you are facing is that parts of your applications (including your workflows definition, the @temporalio/workflow package, and a few more) are getting bundled twice, ie. a first time by the electron forge packager, and a second time by the Temporal SDK’s webpack bundler. The Electron packager is not aware of specific configurations required for bundling of workflows, which makes it fail while trying to rebundle our packages (that’s why you got the Module not found: Error: Can't resolve '__temporal_custom_failure_converter error message).

```
解决办法
```text
I think you may need this Electron Forge plugin.
npmnpm
@timfish/forge-externals-plugin
When using Electron with Webpack, the easiest way to support native modules is to add them to Webpack externals configuration. This tells webpack to load them from node_modules via require():. Latest version: 0.2.1, last published: 3 months ago. Start using @timfish/forge-externals-plugin in your project by running npm i @timfish/forge-externals-plugin. There are no other projects in the npm registry using @timfish/forge-externals-plugin.
```
解决办法
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
```text
Yeah… That means that @temporalio/* packages are treated as external by Webpack, but that they don’t get included in your electron app’s node_modules directory.
Have you tried using this Electron Forge plugin?
You would need to install it, then add some configuration to your forge config. I think it would be something similar to this:
"config": {
    "forge": {
      // ...
      "plugins": [
        // ...
        [
          "@timfish/forge-externals-plugin",
          {
            "externals": [
              "@temporalio/activity",
              "@temporalio/client",
              "@temporalio/common",
              "@temporalio/core-bridge",
              "@temporalio/proto",
              "@temporalio/worker",
              "@temporalio/workflow"
             ],
            "includeDeps": true
          }
        ]
      ]
    }
  },
```

```text
Oh, I see… Yeah, its very likely that while your worker’s code is being packaged by electron forge, the require.resolve('./workflow') gets rewritten to something else, like an internal webpack module access.
Anyway, here, you should really be using the workflowBundle.codePath property rather than workflowsPath, and you’ll need to make sure that codePath points to the prebuilt workflow-bundle.js file. And you will probably need to find the path to that file without using require.resolve(). Try something like: path.resolve(__dirname, 'workflow-bundle.js').
```

```text
  externals: {
    // path: require.resolve('path-browserify'),
    '@temporalio/worker': 'commonjs @temporalio/worker'
  },
Ok… Make sure to add all of the following packages to your webpack’s externals (follow the same pattern as you did for the worker pacakge):
        "@temporalio/activity",
        "@temporalio/client",
        "@temporalio/common",
        "@temporalio/core-bridge",
        "@temporalio/proto",
        "@temporalio/worker",
        "@temporalio/workflow"
```

```text
Great, seems like you’re making progress!
By default, copy-webpack-plugin minimize files using terser, which indeed removes inlined source map. You should be able to avoid this by setting adding the following options on cooy-webpack-plugin (see reference):
        {
          from: "**/*",
          // Terser skip this file for minimization
          info: (file) => ({ minimized: true }),
        },
```