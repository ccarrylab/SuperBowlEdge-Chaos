const AWS = require('aws-sdk');
exports.handler = async (event) => {
  const ssm = new AWS.SSM();
  const cmd = 'stress-ng --' + event.type + ' ' + event.workers + ' --timeout ' + event.seconds + 's';
  const params = {
    InstanceIds: ['i-091798990d74dde24'],
    DocumentName: 'AWS-RunShellScript',
    Parameters: { commands: [cmd] },
    Comment: 'UserChaos'
  };
  const r = await ssm.sendCommand(params).promise();
  return { commandId: r.Command.CommandId };
};
