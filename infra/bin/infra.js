const cdk = require('@aws-cdk/core');
const {ContainerMeetupEnvironment} = require('../lib/containerMeetupEnvironment');
const {ContainerMeetupApplication} = require('../lib/containerMeetupApplication');

const app = new cdk.App();
const environment = new ContainerMeetupEnvironment(app, 'container-meetup-environment');
const application = new ContainerMeetupApplication(app, 'container-meetup-application', { 
    vpc: environment.vpc
});
