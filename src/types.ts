export type APIResponse<T> = SuccessResponse<T> | ErrorResponse
export type ErrorResponse =
  | {
      code: number
      message: string
    }
  | {
      timestamp: string
      status: number
      error: string
      path: string
    }
export type SuccessResponse<T> = {
  code: 0
  data: T
}

export type LoginData = {
  access_token: string
  refresh_token: string
  user_id: string
}

export type RefreshData = {
  access_token: string
}

export type AccessTokenData = {
  sub: string
  nbf: number
  user_id: string
  iss: string
  exp: number
  app_id: string
  jti: string
}

export interface MeData {
  userInfo: UserInfo
  systemInfo: SystemInfo[]
  powerSettable: number
  roleList: RoleList[]
}

export interface RoleList {
  role_name: string
  level: number
  role_key: string
  id: string
  user_grade: number
}

export interface SystemInfo {
  stc_power: string
  ecu_flag: number
  module_type: string
  pv_flag: number
  system_type: number
  system_id: string
  storage_flag: number
}

export interface UserInfo {
  ad_email_flag: number
  country: string
  module_type: string
  create_datetime: number
  id: string
  state_code: string
  time_zone: string
  email: string
  username: string
}

export interface SystemData {
  outputPower: string
  chargePower: null
  soc: number
  lifetimeTree: string
  inputPower: string
  yearOutputEnergy: string
  lifetimeInputEnergy: string
  thirdMeterFlag: number
  yearInputEnergy: string
  monthInputEnergy: string
  outputEnergy: string
  monthOutputEnergy: string
  inputEnergy: string
  lifetimeCo2: string
  meterPower: null
  dischargePower: null
  lifetimeOutputEnergy: string
  status: string
}

export interface TimedSystemData {
  output: Array<number>
  totalDischarge: any
  input: Array<number>
  totalOutput: number
  totalCharge: any
  power: Array<number>
  totalInput: number
}

export interface DaySystemData extends TimedSystemData {
  time: Array<Date>
}

export interface MonthSystemData extends TimedSystemData {
  date: Array<Date>
}

export interface YearSystemData extends TimedSystemData {
  month: Array<Date>
}

export interface LifetimeSystemData extends TimedSystemData {
  year: Array<Date>
}

export interface TimedSystemDataRaw {
  output: Array<string>
  totalDischarge: any
  input: Array<string>
  totalOutput: string
  totalCharge: any
  power: Array<string>
  totalInput: string
}

export interface DaySystemDataRaw extends TimedSystemDataRaw {
  time: Array<string>
}

export interface MonthSystemDataRaw extends TimedSystemDataRaw {
  date: Array<string>
}

export interface YearSystemDataRaw extends TimedSystemDataRaw {
  month: Array<string>
}

export interface LifetimeSystemDataRaw extends TimedSystemDataRaw {
  year: Array<string>
}

export type InverterStatisticsRaw = {
  lastReportDatetime: string
  lastCommunicationStatus: number
  lastPower: string
  runningDuration: number
  monthEnergy: string
  lastPower2: number
  lastPower1: number
  lifetimeCo2: string
  lifetimeEnergy: string
  todayCo2: string
  todayEnergy: string
  monthCo2: string
}

export type InverterStatistics = {
  lastReportDatetime: Date
  lastCommunicationStatus: number
  lastPower: number
  runningDuration: number
  monthEnergy: number
  lastPower2: number
  lastPower1: number
  lifetimeCo2: number
  lifetimeEnergy: number
  todayCo2: number
  todayEnergy: number
  monthCo2: number
}

export type Device = {
  devId: string
  systemId: string
  communicationStatus: number
  runningStatus: number
  model: string
  devName: string // nickname
  type: string
  factoryPower: number
  version: string
  realTimeStatus: number
  mac: string
}

export interface InverterInfo {
  configuration: InverterConfiguration
  inverter: Inverter
}

export interface InverterConfiguration {
  country: string
  timezone: string
  stateCode: string
}

export interface Inverter {
  id: string
  inverter_info_id: string
  user_id: null
  system_id: string
  ecu_cfg_order_id: null
  inverter_dev_id: string
  channel: string
  type: string
  dcSubType: null
  sub_system_id: null
  sub_ecu_cfg_order_id: null
  remark: null
  open_flag: string
  create_date: number
  delete_date: null
  device_name: null
  update_date: null
}

export type InverterVersionInfo = {
  deviceLatestVersion: string
  dcmLatestVersion: string
  dspLatestVersion: string
  dspVersion: string
  deviceVersion: string
  dcmVersion: string
}
