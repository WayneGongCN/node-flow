import Conf from 'conf'
import { FlowData } from './flow'
import { NodeData } from './node'
import { DEFAULT_CONF } from './constants'


// eslint-disable-next-line
const pkgJson = require('../package.json')
const storageOption = {
  projectVersion: pkgJson.version,
  projectName: pkgJson.name
}


export const flowStorage = new Conf<{ flows: Record<string, FlowData>, activate: string | null }>({ ...storageOption, cwd: DEFAULT_CONF.dataDir, configName: 'flows' })
export const nodeStorage = new Conf<{ nodes: Record<string, NodeData> }>({ ...storageOption, cwd: DEFAULT_CONF.dataDir, configName: 'nodes' })

export const listFlow = (filterCb?: (v: FlowData) => boolean): Promise<FlowData[]> => {
  return new Promise((resolve) => {
    const allFlow = flowStorage.get('flows') || {}
    const flowList = Object.values(allFlow)
    if (!filterCb) return resolve(flowList)
    resolve(flowList.filter(filterCb) as FlowData[])
  })
}

export const getActivateFlowID = () => Promise.resolve(flowStorage.get('activate'))
export const saveActivateFlowID = (flowID: string | null) => Promise.resolve(flowStorage.set('activate', flowID))

export const getFlowDataByID = (flowID: string): Promise<FlowData | null> => Promise.resolve(flowStorage.get(`flows.${flowID}`) as FlowData || null)
export const saveFlowData = (flowID: string, flowData: FlowData) => Promise.resolve(flowStorage.set(`flows.${flowID}`, flowData))

export const removeFlowByID = (flowID: string) => Promise.resolve(flowStorage.set(`flows.${flowID}`, null))

/**
 * 
 */
export const getFullFlowID = (shortID: string) => {
  const flows = flowStorage.get('flows')
  const flowIDList = Object.keys(flows).filter(flowID => flowID.startsWith(shortID))
  return flowIDList.length ? flowIDList[0] : null
}


export const saveNodeData = (nodeID: string, nodeData: NodeData) => Promise.resolve(nodeStorage.set(`nodes.${nodeID}`, nodeData))
export const getNodeDataByID = (nodeID: string): Promise<NodeData | null> => Promise.resolve(nodeStorage.get(`nodes.${nodeID}`) || null)