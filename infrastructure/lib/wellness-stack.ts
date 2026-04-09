import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import { Construct } from 'constructs';

export class WellnessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Cognito User Pool ─────────────────────────────────────────────────────
    const userPool = new cognito.UserPool(this, 'WellnessUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: { minLength: 8 },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'WellnessAppClient', {
      userPool,
      authFlows: { userPassword: true, userSrp: true },
      generateSecret: false,
    });

    // ── DynamoDB Tables ───────────────────────────────────────────────────────
    const tableDefaults = {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    };

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      ...tableDefaults,
      tableName: 'wellness-users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });

    const checkinsTable = new dynamodb.Table(this, 'CheckinsTable', {
      ...tableDefaults,
      tableName: 'wellness-checkins',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    const gamesTable = new dynamodb.Table(this, 'GamesTable', {
      ...tableDefaults,
      tableName: 'wellness-games',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    const communityTable = new dynamodb.Table(this, 'CommunityTable', {
      ...tableDefaults,
      tableName: 'wellness-community',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    // ── IAM Role for Amplify ──────────────────────────────────────────────────
    const amplifyRole = new iam.Role(this, 'AmplifyServiceRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
    });

    amplifyRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:DescribeUserPool',
        'cognito-idp:DescribeUserPoolClient',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminGetUser'
      ],
      resources: [userPool.userPoolArn],
    }));

    for (const table of [usersTable, checkinsTable, gamesTable, communityTable]) {
      table.grantReadWriteData(amplifyRole);
    }

    amplifyRole.addToPolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0'],
    }));

    // ── Amplify App ───────────────────────────────────────────────────────────
    const amplifyApp = new amplify.App(this, 'WellnessApp', {
      appName: 'wellness-app',
      role: amplifyRole,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'nape-ntsoane',
        repository: 'unihack',
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
      }),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: { commands: ['npm ci'] },
            build: { commands: ['npm run build'] },
          },
          artifacts: { baseDirectory: '.next', files: ['**/*'] },
          cache: { paths: ['node_modules/**/*', '.next/cache/**/*'] },
        },
      }),
      environmentVariables: {
        APP_ENV: 'production',
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: userPool.userPoolId,
        NEXT_PUBLIC_COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
        APP_AWS_REGION: this.region,
        DYNAMODB_USERS_TABLE: usersTable.tableName,
        DYNAMODB_CHECKINS_TABLE: checkinsTable.tableName,
        DYNAMODB_GAMES_TABLE: gamesTable.tableName,
        DYNAMODB_COMMUNITY_TABLE: communityTable.tableName,
        BEDROCK_MODEL_ID: 'anthropic.claude-3-haiku-20240307-v1:0',
      },
    });

    const mainBranch = amplifyApp.addBranch('main', { autoBuild: true });

    // ── CloudFormation Outputs ────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'UsersTableName', { value: usersTable.tableName });
    new cdk.CfnOutput(this, 'CheckinsTableName', { value: checkinsTable.tableName });
    new cdk.CfnOutput(this, 'GamesTableName', { value: gamesTable.tableName });
    new cdk.CfnOutput(this, 'CommunityTableName', { value: communityTable.tableName });
    new cdk.CfnOutput(this, 'AmplifyAppUrl', {
      value: `https://${mainBranch.branchName}.${amplifyApp.defaultDomain}`,
    });
  }
}
