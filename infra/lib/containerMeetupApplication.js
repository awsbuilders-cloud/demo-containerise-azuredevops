const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const autoScaling = require('@aws-cdk/aws-autoscaling');

const applicationName = 'aspnetapp';

class ContainerMeetupApplication extends cdk.Stack {
    /**
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        const asg = new autoScaling.AutoScalingGroup(this, `${applicationName}-asg`, {
            vpc: props.vpc,
            minCapacity: 1,
            maxCapacity: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.Large),
            machineImage: ec2.MachineImage.latestWindows("2019", {
                userData: ec2.UserData.forWindows().addCommands([
                ])
            }),
        });
    }
}

module.exports = { ContainerMeetupApplication }
