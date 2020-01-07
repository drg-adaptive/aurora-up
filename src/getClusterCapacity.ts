import { RDS } from "aws-sdk";
import Context from "./context";

export interface CapacityInfo {
  CurrentCapcity: number;
  MinCapcity: number;
  MaxCapacity: number;
}

export default async function getClusterCapacity(
  rds: RDS,
  ctx: Context
): Promise<CapacityInfo> {
  const clusterInfo = await rds
    .describeDBClusters({ DBClusterIdentifier: ctx.cluster })
    .promise();
  if (!clusterInfo?.DBClusters?.length) {
    throw new Error(
      `Could not find cluster ${ctx.cluster} in region ${ctx.region}`
    );
  }

  const cluster = clusterInfo?.DBClusters?.[0];

  return {
    CurrentCapcity: cluster.Capacity,
    MinCapcity: cluster.ScalingConfigurationInfo.MinCapacity,
    MaxCapacity: cluster.ScalingConfigurationInfo.MaxCapacity
  };
}
