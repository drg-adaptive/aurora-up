import { CloudFormation, RDS } from "aws-sdk";

import program from "commander";
import Listr from "listr";

import { version } from "../package.json";
import Context from "./context";
import getClusterCapacity from "./getClusterCapacity.js";
import getClusterIdentifier from "./tasks/getClusterIdentifier.js";
import scaleCluster from "./tasks/scaleCluster.js";

program
  .version(version)
  .option("-r, --region <region>", "AWS region")
  .option("-s, --stack <stack>", "Name of the stack to get output from")
  .option("-o, --output <output>", "Output name to get arn from")
  .option("-c, --cluster <cluster>", "Cluster Identifier")
  .option(
    "-m --minCapacity <capacity>",
    "Minimum capacity to scale to",
    /[0-9]+/,
    1
  );

program.parse(process.argv);

const tasks = new Listr<Context>(
  [
    {
      title: "Get Cluster Identifier",
      enabled: ctx => !ctx.cluster,
      task: getClusterIdentifier
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
      enabled: (ctx: Context) => ctx.capacity.CurrentCapcity === 0,
      task: scaleCluster
    }
  ],
  {}
);

tasks.run(program.opts()).catch(ex => {
  console.error("ERROR", ex.message);
  process.exit(1);
});
