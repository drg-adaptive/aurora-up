import { RDS } from "aws-sdk";

import delay from "delay";
import Context from "../context";
import getClusterCapacity, { CapacityInfo } from "../getClusterCapacity";

const UPDATE_DELAY = 1000;

export default async (ctx: Context) => {
  const rds = new RDS({ region: ctx.region });

  const target = ctx.minCapacity || 1;

  await rds
    .modifyCurrentDBClusterCapacity({
      DBClusterIdentifier: ctx.cluster,
      Capacity: Math.max(target, ctx.capacity.MinCapcity)
    })
    .promise();

  let capacity: CapacityInfo = ctx.capacity;
  while (capacity.CurrentCapcity === 0) {
    await delay(UPDATE_DELAY);
    capacity = await getClusterCapacity(rds, ctx);
  }
};
