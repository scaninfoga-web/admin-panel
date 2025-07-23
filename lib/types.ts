export interface ProfileInformationCardProps {
  firstName: string;
  lastName: string;
  email: string;
  date_joined: string;
  balance: number;
  phone: string | null;
  subscriptionType: string;
  subscription_plan: string;
}

export interface LastSuccessfulTransaction {
  txn_id: string;
  amount: string;
  status: string;
  created_at: string;
}

export interface WalletInformationProps {
  balance: string;
  last_successful_transaction: LastSuccessfulTransaction;
  total_credited: string,
  total_debited: string,
  total_transaction: string
}

export interface LocationInformationProps {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface DeviceInformationProps {
  ipAddress: string | null;
  device: string | null;
  browser: string | null;
  userAgent: string | null;
  platform: string | null;
  language: string | null;
  cookiesEnabled: boolean;
  javascriptEnabled: boolean;
  touchSupport: boolean | null;
  deviceType: string | null;
  cpuCores: number | null;
  memory: string | null;
  screenSize: string | null;
  batteryLevel: string | null;
  isCharging: boolean | null;
  gpuRenderer: string | null;
  cameras: string | null;
  microphones: string | null;
  publicIp: string | null;
  isp: string | null;
  asn: string | null;
  possibleIoT: boolean | null;
}
