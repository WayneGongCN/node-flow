import Conf from 'conf'
import { DEFAULT_CONF } from './constants'


// eslint-disable-next-line
const pkgJson = require('../package.json')
const storageOption = {
  projectVersion: pkgJson.version,
  projectName: pkgJson.name
}


export const conf = new Conf({ ...storageOption, cwd: DEFAULT_CONF.dataDir, configName: 'conf', defaults: DEFAULT_CONF })
export const flowStorage = new Conf({ ...storageOption, cwd: DEFAULT_CONF.dataDir, configName: 'flows' })
export const nodeStorage = new Conf({ ...storageOption, cwd: DEFAULT_CONF.dataDir, configName: 'nodes' })
