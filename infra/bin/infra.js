const cdk = require('@aws-cdk/core');
const {ContainerMeetupEnvironment} = require('../lib/containerMeetupEnvironment');
const {ContainerMeetupApplication} = require('../lib/containerMeetupApplication');

function getEnv() {
    return {
        account: process.env.CDK_DEPLOY_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION
    };
}

console.log(getEnv());

const app = new cdk.App();
const environment = new ContainerMeetupEnvironment(app, 'container-meetup-environment', {
    env: getEnv()
});

const application = new ContainerMeetupApplication(app, 'container-meetup-application', { 
    vpc: environment.vpc,
    env: getEnv()
});
