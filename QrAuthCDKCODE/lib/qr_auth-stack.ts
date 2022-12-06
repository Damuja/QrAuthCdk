import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { Pipeline, Artifact } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  CodeCommitSourceAction,
  CodeCommitTrigger,
} from "aws-cdk-lib/aws-codepipeline-actions";
import { PipelineProject, BuildSpec } from "aws-cdk-lib/aws-codebuild";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Code, Runtime, Function, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

export class QrAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    
    // *********************************************************
    //         REPOSITORY
    // *********************************************************

    const appRepo = new Repository(this, "AppRepo", {
      repositoryName: "QRAuth-Mobile-App",
      description:
        "Repo for the frontend mobile application for the QR Auth solution.",
    });

    const packageRepo = new Repository(this, "PackageRepo", {
      repositoryName: "QRAuth-Extension-Package",
      description:
        "Repo for the distributable extension package for the QR Auth solution.",
    });


    // *********************************************************
    //         PIPELINE
    // *********************************************************

    const appPipeline = new Pipeline(this, "AppPipeline", {
      pipelineName: "App-Pipeline",
      crossAccountKeys: false,
    });

    const sourceOutput = new Artifact("SourceArtifact");
    const source = new CodeCommitSourceAction({
      actionName: "Source",
      repository: appRepo,
      output: sourceOutput,
      runOrder: 1,
      trigger: CodeCommitTrigger.POLL,
      branch: "DevA",
    });

    appPipeline.addStage({
      stageName: "Source",
      actions: [source],
    });

    const buildProject = new PipelineProject(this, id + "-Build", {
      buildSpec: BuildSpec.fromSourceFilename("buildspec.yml"),
    });

    buildProject.addToRolePolicy(
      new PolicyStatement({
        actions: ["ssm:GetParameter", "ssm:GetParameters"],
        effect: Effect.ALLOW,
        resources: ["arn:aws:ssm:eu-west-2:075768722136:*"],
      })
    );

    buildProject.addToRolePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject", "s3:ListBucket"],
        effect: Effect.ALLOW,
        resources: ["arn:aws:s3:::qrauth-keystore-bucket"],
      })
    );

    const build = new CodeBuildAction({
      actionName: "Build",
      project: buildProject,
      input: sourceOutput,
      runOrder: 2,
    });

    appPipeline.addStage({
      stageName: "Build",
      actions: [build],
    });


    // *********************************************************
    //         S3
    // *********************************************************

    const ksBucket = new Bucket(this, "keystore-bucket", {
      bucketName: "qrauth-keystore-bucket",
      encryption: BucketEncryption.KMS,
      bucketKeyEnabled: true,
      enforceSSL: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const distBucket = new Bucket(this, "dist-bucket", {
      bucketName: "qrauth-dist-bucket",
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });


    // *********************************************************
    //         Tables
    // *********************************************************

    const userTable = new Table(this, "userTable", {
      partitionKey: { name: "userId", type: AttributeType.STRING },
    });


    // *********************************************************
    //         Lambdas / Layers
    // *********************************************************

    // Lambda Layer for all Lambdas
    const lambdaLayer = new LayerVersion(this, 'LambdaLayer', {
      layerVersionName: "QRAuth-Lambda-Layer",
      code: Code.fromAsset('layers/SDKLayer'),
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      license: 'Apache-2.0',
      description: 'A layer containing npm packages relevant to all Lambdas.',
    });

    /* Generates a QR to establish an initial connection between 
      mobile client and server (db). */
    const getConnectionQR = new Function(this, "GetConnectionQR", {
      functionName: "QRAuth-ConnectionQR",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/ConnectionQr"),
      handler: "ConnectionQr.ConnectionQrLambda",
      layers: [lambdaLayer]
    });

    /* Generates an Account ID to represent a user and their respective 
      account on a particular platform. */
    const createUser = new Function(this, "CreateUser", {
      functionName: "QRAuth-GenerateUser",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/GenerateUserAppAccount"),
      handler: "GenerateUserAccount.createAccountIdLambda",
      environment: {
        GENERATEUSER_TABLE_NAME: userTable.tableName,
      },
      layers: [lambdaLayer]
    });
    userTable.grantReadWriteData(createUser);

    const addConnection = new Function(this, "AddConnection", {
      functionName: "QRAuth-AddConnection",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/AddConnections"),
      handler: "AddConnections.AddConnectionsLambda",
      environment: {
        GENERATEUSER_TABLE_NAME: userTable.tableName,
      },
      layers: [lambdaLayer]
    });
    userTable.grantReadWriteData(addConnection);

    const authenticateUser = new Function(this, "AuthenticateUser", {
      functionName: "QRAuth-AuthenticateUser",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/AuthenticateUser"),
      handler: "AuthenticateUser.AuthenticateUserLambda",
      environment: {
        GENERATEUSER_TABLE_NAME: userTable.tableName,
      },
      layers: [lambdaLayer]
    });
    userTable.grantReadWriteData(authenticateUser);
    

    const scanAuthQr = new Function(this, "ScanAuthQr", {
      functionName: "QRAuth-ScanAuthQr",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/ScanAuthQr"),
      handler: "ScanAuthQr.ScanQrLamda",
      layers: [lambdaLayer]
    });
    authenticateUser.grantInvoke(scanAuthQr)

    
    const scanConnectionQr = new Function(this, "ScanConnectionQr", {
      functionName: "QRAuth-ScanConnectionQr",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/ScanConnectionQr"),
      handler: "ScanConnectionQr.ScanConnetionQrLamda",
      layers: [lambdaLayer]
    });
    addConnection.grantInvoke(scanConnectionQr)

    const getUsersConenctions = new Function(this, "GetUsersConnections", {
      functionName: "QRAuth-GetUsersConnections",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/GetUsersConnections"),
      handler: "GetUsersConnections.GetUsersConnectionsLambda",
      environment: {
        GENERATEUSER_TABLE_NAME: userTable.tableName,
      },
    })
    userTable.grantReadWriteData(getUsersConenctions);

    const generateQrandSessionKey = new Function(this, "GenerateQrandSeshKey", {
      functionName: "QRAuth-GenerateQrandSeshKey",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("functions/GenerateQr"),
      handler: "GenerateQr.GenerateQrLambda",
      layers: [lambdaLayer],
      environment: {
        GENERATEUSER_TABLE_NAME: userTable.tableName,
      },
    })
    userTable.grantReadWriteData(generateQrandSessionKey);

    // *********************************************************
    //         APIs
    // *********************************************************

    const api = new RestApi(this, "QRAuth-API");
    api.root
      .resourceForPath("users")
      .addMethod("POST", new LambdaIntegration(createUser));

    api.root
      .resourceForPath("qr")
      .addMethod("GET", new LambdaIntegration(getConnectionQR));

    api.root
      .resourceForPath("connections")
      .addMethod("POST", new LambdaIntegration(addConnection));

    api.root
      .resourceForPath("scanConnectionQr")
      .addMethod("POST", new LambdaIntegration(scanConnectionQr))

    api.root
      .resourceForPath("getUsersConnections")
      .addMethod("POST", new LambdaIntegration(getUsersConenctions))

    api.root
      .resourceForPath("AuthenticateUsers")
      .addMethod("POST", new LambdaIntegration(scanAuthQr))
  }
}
