import { RDS, CloudFormation } from "aws-sdk";

import program from "commander";
import Listr from "listr";
import delay from "delay";

import { version } from "../package.json";

program
  .version(version)
  .option("-r, --region <region>", "AWS region")
  .option("-s, --stack <stack>", "Name of the stack to get output from")
  .option("-o, --output <output>", "Output name to get arn from")
  .option("-c, --cluster <cluster>", "Cluster Identifier");

program.parse(process.argv);

interface Context {
  region?: string;
  stack?: string;
  output?: string;
  cluster?: string;
  capacity?: number;
}

const tasks = new Listr<Context>(
  [
    {
      title: "Get Cluster Identifier",
      enabled: ctx => !ctx.cluster,
      async task(context) {
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
      }
    },
    {
      title: "Get Current Capacity",
      async task(ctx) {
        const rds = new RDS({ region: ctx.region });
        ctx.capacity = await getClusterCapacity(rds, ctx);
      }
    },
    {
      title: "Scale cluster",
      enabled: ctx => ctx.capacity === 0,
      async task(ctx) {
        const rds = new RDS({ region: ctx.region });

        await rds
          .modifyCurrentDBClusterCapacity({
            DBClusterIdentifier: ctx.cluster,
            Capacity: 1
          })
          .promise();

        let capacity;
        do {
          await delay(1000);
          capacity = await getClusterCapacity(rds, ctx);
        } while (capacity === 0);
      }
    }
  ],
  {}
);

tasks.run(program.opts()).catch(ex => {
  console.error("ERROR", ex.message);
  process.exit(1);
});

async function getClusterCapacity(rds: RDS, ctx: Context): Promise<number> {
  const clusterInfo = await rds
    .describeDBClusters({ DBClusterIdentifier: ctx.cluster })
    .promise();
  if (clusterInfo.DBClusters.length === 0) {
    throw new Error(
      `Could not find cluster ${ctx.cluster} in region ${ctx.region}`
    );
  }
  return clusterInfo.DBClusters[0].Capacity;
}
