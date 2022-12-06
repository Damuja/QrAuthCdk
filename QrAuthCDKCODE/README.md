# CDK TypeScript Project for the QRAuth App.

This repository is the source of truth for QRAuth application architecture.
All resources provisioned, configured, and modified should be done so here,
with the exception of resources with security implications, such as
Secure SSM Parameters or Secrets.

## CDK Basics

The `cdk.json` file tells the CDK Toolkit how to execute the app.

### Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template