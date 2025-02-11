import { UnauthorizedError } from './errors'
import type { EasyPower } from './lib'
import type {
  InverterStatistics,
  InverterStatisticsRaw,
  InverterInfo,
  InverterVersionInfo
} from './types'
import { request } from './net'

export class Inverter {
  private info: InverterInfo | null = null

  constructor(private client: EasyPower, private serialNumber: string) {}

  async getInfo(invalidateCache = true): Promise<InverterInfo> {
    if (invalidateCache && this.info) return this.info
    if (!this.client.api) throw new UnauthorizedError()
    this.info = await request<InverterInfo>(
      this.client.api.get(
        `aps-api-web/api/v2/device/ezInverter/${this.serialNumber}`
      )
    )
    return this.info
  }

  async setNickname(name: string): Promise<void> {
    if (!this.client.api) throw new UnauthorizedError()
    if (!this.info) await this.getInfo()
    if (!this.info) throw new Error('Failed to get inverter info')
    await request(
      this.client.api.post(
        `aps-api-web/api/v2/device/ezInverter/editInverter/${this.serialNumber}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            inverterDevId: this.serialNumber,
            inverterInfo: JSON.stringify({
              system_id: this.info.inverter.system_id,
              inverter_dev_id: this.info.inverter.inverter_dev_id,
              device_name: name,
              type: this.info.inverter.type
            })
          }).toString()
        }
      )
    )
  }

  async getVersion(): Promise<InverterVersionInfo> {
    if (!this.client.api) throw new UnauthorizedError()
    const data = await request<InverterVersionInfo>(
      this.client.api.get(
        `aps-api-web/api/v2/remote/ezInverter/allEdition/${this.serialNumber}`
      )
    )

    return data
  }

  async getStatistics(): Promise<InverterStatistics> {
    if (!this.client.api) throw new UnauthorizedError()
    const data = await request<InverterStatisticsRaw>(
      this.client.api.get(
        `aps-api-web/api/v2/data/device/ezInverter/statistic/${this.serialNumber}`
      )
    )

    return {
      lastCommunicationStatus: data.lastCommunicationStatus,
      lastPower: parseFloat(data.lastPower),
      lastReportDatetime: new Date(data.lastReportDatetime.replace(' ', 'T')),
      lastPower1: data.lastPower1,
      lastPower2: data.lastPower2,
      monthEnergy: parseFloat(data.monthEnergy),
      runningDuration: data.runningDuration,
      lifetimeCo2: parseFloat(data.lifetimeCo2),
      lifetimeEnergy: parseFloat(data.lifetimeEnergy),
      todayCo2: parseFloat(data.todayCo2),
      todayEnergy: parseFloat(data.todayEnergy),
      monthCo2: parseFloat(data.monthCo2)
    }
  }
}
