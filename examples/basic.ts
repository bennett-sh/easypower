import { EasyPower } from '../src/lib'

const api = new EasyPower()
await api.login('user', 'password')

const devices = await api.getDevices()

for (const device of devices) {
  console.log(await api.getRealtimeSystemData(device.systemId))
}
