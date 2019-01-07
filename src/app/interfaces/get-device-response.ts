import { Device } from './device';

export interface GetDeviceResponse {
  status: string;
  error: string;
  device: Device;
}
