import { DeviceType } from './device-type';
import { Capability } from './capability';

export interface Device {
  id: number;
  name: string;
  slug: string;
  type: DeviceType;
  owner: string;
  mainCapability: Capability;
  capabilities: Capability[];
}
