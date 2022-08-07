import path from 'path'


export const NODE_ENV = process.env.NODE_ENV
export const IS_DEV = NODE_ENV === 'development'

// TODO:
const baseDir = path.join(process.cwd(), './.node-flow')

export const DEFAULT_CONF = {
  baseDir,
  logDir: path.join(baseDir, 'logs'),
  dataDir: path.join(baseDir, 'data'),
}