const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const iam = require('@aws-cdk/aws-iam');
const s3 = require('@aws-cdk/aws-s3');
const secretsManager = require('@aws-cdk/aws-secretsmanager')

class ContainerMeetupEnvironment extends cdk.Stack {

  _createBuildUser() {
    const password = new secretsManager.Secret(this, 'BuildPipelinePassword', {
      secretName: 'container-meetup-build-pipeline-password'
    });

    const user = new iam.User(this, 'BuildPipelineUser', {
      password: password.secretValue,
      userName: 'container-meetup-build-pipeline',
    });

    user.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    const accessKey = new iam.CfnAccessKey(this, 'BuildPipelineUserDefaultAccessKey', {
      userName: user.userName
    });

    new cdk.CfnOutput(this, 'BuildPipelineSecretAccessKey', {
      exportName: 'BuildPipelineSecretAccessKey',
      value: accessKey.attrSecretAccessKey,
    });

    return user;
  }

  _createBuildArtifactsBucket() {
    return new s3.Bucket(this, 'BuildArtifacts', {
      bucketName: 'container-meetup-build-artifacts',
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY 
    });
  }

  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    this.vpc = new ec2.Vpc(this, 'ContainerMeetupVpc', { maxAzs: 3 });
    this.buildArtifactsBucket = this._createBuildArtifactsBucket();
    this.buildPipelineUser = this._createBuildUser();
  }
}

module.exports = { ContainerMeetupEnvironment }
