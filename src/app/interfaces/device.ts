import { DeviceType } from './device-type';
import { Capability } from './capability';

export interface Device {
  name: string;
  slug: string;
  type: DeviceType;
  owner: string;
  mainCapability: Capability;
  capabilities: Capability[];
}
