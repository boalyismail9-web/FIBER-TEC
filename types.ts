export enum Page {
  Home = 'HOME',
  NewData = 'NEW_DATA',
  Settings = 'SETTINGS',
  CameraScan = 'CAMERA_SCAN',
  Logistics = 'LOGISTICS',
}

export interface FormData {
  clientName: string;
  cin: string;
  sip: string;
  macAddress: string;
  gponSn: string;
  dSn: string;
  cableLength: string;
  subscriptionSpeed: string;
  jarretiereCount: string;
  brisePtoCount: string;
  equipmentType: string;
  landline: string;
  interventionType: string;
}
