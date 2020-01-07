import { CapacityInfo } from "./getClusterCapacity";

export default interface Context {
  region?: string;
  stack?: string;
  output?: string;
  cluster?: string;
  capacity?: CapacityInfo;
  minCapacity?: number;
}
