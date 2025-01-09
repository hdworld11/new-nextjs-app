import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myFirstBucket } from './storage/resource';
import { custom_resources } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  myFirstBucket
});

const myFirstBucketS3Instance = backend.myFirstBucket.resources.bucket;

const originAccessIdentity = new cloudfront.OriginAccessIdentity(
  myFirstBucketS3Instance.stack,
  "OriginAccessIdentity"
);

backend.myFirstBucket.resources.bucket.grantRead(originAccessIdentity);

const distro = new cloudfront.Distribution(
  myFirstBucketS3Instance.stack,
  "Distribution",
  {
    defaultBehavior: {
      origin: new S3Origin(myFirstBucketS3Instance, {
        originAccessIdentity,
      }),
    },
  }
);

backend.addOutput({
  custom: {
    cf: cdk.Lazy.string({ produce: () => distro.distributionDomainName }),
  },
});



// const existingDistribution = cloudfront.Distribution.fromDistributionAttributes(
//   myFirstBucketS3Instance.stack,
//   'importedDistribution',
//   {
//     distributionId:'E3C3W1NA2C76C5',
//     domainName:'d2xe9ks3dmropp.cloudfront.net',
//   }
// );

// console.log(existingDistribution);

// const cfnDistribution = existingDistribution.node.findChild('Resource') as cloudfront.CfnDistribution;

// cfnDistribution.addPropertyOverride(
//   'DistributionConfig.Origins',
//   [
//     {
//       Id: 'S3Origin',
//       DomainName: myFirstBucketS3Instance.bucketRegionalDomainName,
//       S3OriginConfig:{},
//     },
//   ]
// );

// cfnDistribution.addPropertyOverride('DistributionConfig.DefaultCacheBehavior.TargetOriginId', 'S3Origin');


// const distro = new cloudfront.Distribution(
//   myFirstBucketS3Instance.stack,
//   "Distribution",
//   {
//     defaultBehavior:{
//       origin: new S3Origin(myFirstBucketS3Instance, {
//         originAccessIdentity,
//       }),
//     },
//   }
// );

// backend.addOutput({
//   custom: {
//     cf: cdk.Lazy.string({ produce: () => distro.distributionDomainName}),
//   },
// });