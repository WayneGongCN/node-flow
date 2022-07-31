import path from 'path'


// TODO:
const baseDir = path.join('/Users/waynegong/ndoe-flow/')


export const DEFAULT_CONF = {
  baseDir,
  logDir: path.join(baseDir, 'logs'),
  dataDir: path.join(baseDir, 'data'),
}