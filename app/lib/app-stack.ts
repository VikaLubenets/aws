/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Stack, StackProps } from "@aws-cdk/core";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";

export class AppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    //cloudfront
    const cloudF = new cloudfront.OriginAccessIdentity(
      this,
      "CDKFirstAppForRSS-OAI"
    );

    //create s3 bucket
    const bucket = new s3.Bucket(this, "CDKFirstAppForRSS", {
      bucketName: "cdk-first-app-for-rss-vikal",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudF.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    //create cloud front

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "CDKFirstAppForRSS-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: cloudF,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    //uploade the code

    new s3deploy.BucketDeployment(this, "BucketDeployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
