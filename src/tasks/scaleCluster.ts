import { RDS } from "aws-sdk";

import delay from "delay";
import Context from "../context";
import getClusterCapacity, { CapacityInfo } from "../getClusterCapacity";

const UPDATE_DELAY = 1000;

export default async (ctx: Context) => {
  const rds = new RDS({ region: ctx.region });

  let target = ctx.minCapacity || ctx.capacity.MinCapcity;
  target = Math.max(target, ctx.capacity.MinCapcity);
  target = Math.min(target, ctx.capacity.MaxCapacity);

  await rds
    .modifyCurrentDBClusterCapacity({
      DBClusterIdentifier: ctx.cluster,
      Capacity: target
    })
    .promise();

  let capacity: CapacityInfo = ctx.capacity;
  while (capacity.CurrentCapcity === 0) {
    await delay(UPDATE_DELAY);
    capacity = await getClusterCapacity(rds, ctx);
  }
};
