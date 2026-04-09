#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WellnessStack } from '../lib/wellness-stack';

const app = new cdk.App();

const region = process.env.CDK_DEFAULT_REGION && !process.env.CDK_DEFAULT_REGION.includes('AWS_') 
  ? process.env.CDK_DEFAULT_REGION 
  : 'us-east-1';

new WellnessStack(app, 'WellnessStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT && process.env.CDK_DEFAULT_ACCOUNT !== 'unknown-account' 
      ? process.env.CDK_DEFAULT_ACCOUNT 
      : undefined,
    region: region,
  },
});
