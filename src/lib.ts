import { EasyPowerAuthentication } from './auth'
import type { KyInstance } from 'ky'
import { request } from './net'
import type {
  DaySystemDataRaw,
  MeData,
  SystemData,
  DaySystemData,
  Device,
  MonthSystemDataRaw,
  YearSystemDataRaw,
  YearSystemData,
  MonthSystemData,
  LifetimeSystemData,
  LifetimeSystemDataRaw
} from './types'
import { UnauthorizedError } from './errors'
import { Inverter } from './inverter'

export type * from './types'

function getDayStringFromDate(date: Date) {
  return `${date.getFullYear()}${date
    .getMonth()
    .toString()
    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
}

export class EasyPower {
  private auth = new EasyPowerAuthentication()
  public api: KyInstance | null = null

  constructor() {}

  async login(username: string, password: string) {
    await this.auth.login(username, password)
    this.api = await this.auth.getAuthedApi()
  }

  async me() {
    if (!this.api) throw new UnauthorizedError()
    return await request<MeData>(
      this.api.get(`aps-api-web/api/v2/user/${this.auth.getUserId()}`)
    )
  }

  async getRealtimeSystemData(systemId: string, date: Date = new Date()) {
    if (!this.api) throw new UnauthorizedError()
    return await request<SystemData>(
      this.api.get(
        `aps-api-web/api/v2/data/system/ezhi/realtime/${systemId}?date=${getDayStringFromDate(
          date
        )}`
      )
    )
  }

  async getSystemDataForDay(
    systemId: string,
    date: Date = new Date()
  ): Promise<DaySystemData> {
    if (!this.api) throw new UnauthorizedError()
    const data = await request<DaySystemDataRaw>(
      this.api.get(
        `aps-api-web/api/v2/data/system/day/${systemId}/${getDayStringFromDate(
          date
        )}`
      )
    )

    return {
      input: data.input.map(x => parseFloat(x)),
      output: data.output.map(x => parseFloat(x)),
      power: data.power.map(x => parseFloat(x)),
      totalCharge: data.totalCharge,
      totalDischarge: data.totalDischarge,
      totalInput: parseFloat(data.totalInput),
      totalOutput: parseFloat(data.totalOutput),
      time: data.time.map(time => {
        const [hour, minute] = time.split(':').map(x => parseInt(x))
        const newDate = new Date(date)
        newDate.setHours(hour)
        newDate.setMinutes(minute)
        return newDate
      })
    }
  }

  async getSystemDataForMonth(
    systemId: string,
    date: Date = new Date()
  ): Promise<MonthSystemData> {
    if (!this.api) throw new UnauthorizedError()
    const data = await request<MonthSystemDataRaw>(
      this.api.get(
        `aps-api-web/api/v2/data/system/month/${systemId}/${getDayStringFromDate(
          date
        )}`
      )
    )

    return {
      input: data.input.map(x => parseFloat(x)),
      output: data.output.map(x => parseFloat(x)),
      power: data.power.map(x => parseFloat(x)),
      totalCharge: data.totalCharge,
      totalDischarge: data.totalDischarge,
      totalInput: parseFloat(data.totalInput),
      totalOutput: parseFloat(data.totalOutput),
      date: data.date.map(date => new Date(date))
    }
  }

  async getSystemDataForYear(
    systemId: string,
    date: Date = new Date()
  ): Promise<YearSystemData> {
    if (!this.api) throw new UnauthorizedError()
    const data = await request<YearSystemDataRaw>(
      this.api.get(
        `aps-api-web/api/v2/data/system/year/${systemId}/${getDayStringFromDate(
          date
        )}`
      )
    )

    return {
      input: data.input.map(x => parseFloat(x)),
      output: data.output.map(x => parseFloat(x)),
      power: data.power.map(x => parseFloat(x)),
      totalCharge: data.totalCharge,
      totalDischarge: data.totalDischarge,
      totalInput: parseFloat(data.totalInput),
      totalOutput: parseFloat(data.totalOutput),
      month: data.month.map(date => new Date(date))
    }
  }

  async getSystemDataLifetime(systemId: string): Promise<LifetimeSystemData> {
    if (!this.api) throw new UnauthorizedError()
    const data = await request<LifetimeSystemDataRaw>(
      this.api.get(`aps-api-web/api/v2/data/system/lifetime/${systemId}`)
    )

    return {
      input: data.input.map(x => parseFloat(x)),
      output: data.output.map(x => parseFloat(x)),
      power: data.power.map(x => parseFloat(x)),
      totalCharge: data.totalCharge,
      totalDischarge: data.totalDischarge,
      totalInput: parseFloat(data.totalInput),
      totalOutput: parseFloat(data.totalOutput),
      year: data.year.map(date => new Date(date))
    }
  }

  getInverter(serialNumber: string): Inverter {
    return new Inverter(this, serialNumber)
  }

  async getDevices(): Promise<Array<Device>> {
    if (!this.api) throw new UnauthorizedError()
    const data = await request<{
      list: Array<Device>
    }>(
      this.api.get(
        `aps-api-web/api/v2/data/system/device/list/${this.auth.getUserId()}`
      )
    )
    return data.list
  }
}
