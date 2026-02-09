const { SSMClient, SendCommandCommand } = require("@aws-sdk/client-ssm");
exports.handler = async (event) => {
  const ssm = new SSMClient({ region: "us-east-1" });
  const cmd = `stress-ng --${event.type} ${event.workers} --timeout ${event.seconds}s`;
  const params = {
    InstanceIds: ["i-091798990d74dde24"],
    DocumentName: "AWS-RunShellScript",
    Parameters: { commands: [cmd] },
    Comment: "UserChaos"
  };
  const command = new SendCommandCommand(params);
  const r = await ssm.send(command);
  return { commandId: r.CommandId };
};
