const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const iam = require('@aws-cdk/aws-iam');
const s3 = require('@aws-cdk/aws-s3');
const secretsManager = require('@aws-cdk/aws-secretsmanager')
const ecr = require('@aws-cdk/aws-ecr');
const ecs = require('@aws-cdk/aws-ecs');

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

  _createEcrRepository() {
    return new ecr.Repository(this, 'EcrRepository', {
      repositoryName: 'container-meetup-application',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }

  _createEcsCluster() {
    return new ecs.Cluster(this, 'EcsCluster', {
      clusterName: 'container-meetup-cluster',
      vpc: this.vpc
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
    this.ecr = this._createEcrRepository();
    this.ecsCluster = this._createEcsCluster();
  }
}

module.exports = { ContainerMeetupEnvironment }
