import { CloudFormation } from "aws-sdk";
import Context from "../context";

export default async (context: Context) => {
  if (!context.region || !context.stack || !context.output) {
    throw new Error(
      `If Cluster Identifier is not provided, you must provide region, stack, and output parameters`
    );
  }

  const cf = new CloudFormation({ region: context.region });
  const result = await cf
    .describeStacks({ StackName: context.stack })
    .promise();

  if (result.Stacks.length === 0) {
    throw new Error(`No stack found: ${context.stack}`);
  }

  let output = result.Stacks[0].Outputs.filter(
    o => o.OutputKey === context.output
  ).map(o => o.OutputValue)[0];

  output = output.replace(/^arn:aws:rds:.*cluster:/g, "");

  context.cluster = output;
};
