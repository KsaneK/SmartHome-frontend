import { Capability } from './capability';

export interface DeviceAction {
  condition_device: string;
  condition_capability: Capability;
  condition: string;
  condition_value: number;
  action_device: string;
  action_capability: Capability;
  action_capability_value: number;
}
