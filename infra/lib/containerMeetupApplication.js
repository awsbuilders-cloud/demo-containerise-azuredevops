const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
const ecs = require('@aws-cdk/aws-ecs');

class ContainerMeetupApplication extends cdk.Stack {
    /**
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);

        // Create a load-balanced Fargate service and make it public
        const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
            serviceName: 'container-meetup-application',
            cluster: props.ecsCluster,
            cpu: 256,
            desiredCount: 3,
            taskImageOptions: {
                containerName: 'container-meetup-application',
                containerPort: 80,
                image: ecs.ContainerImage.fromEcrRepository(props.ecr, process.env['GIT_COMMIT'] || 'latest')
            },
            memoryLimitMiB: 512,
            publicLoadBalancer: true
        });

        // Ensure that execution role has sufficient permissions to pull image from registry
        service.taskDefinition.addToExecutionRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['ecr:*'],
            resources: ['*']
        }));
    }
}

module.exports = { ContainerMeetupApplication }
