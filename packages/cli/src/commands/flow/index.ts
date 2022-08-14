import { CliUx, Command, Flags } from '@oclif/core'
import { Flow, logger } from '@node-flow/core'


export default class FlowList extends Command {
  static description = 'Create a Flow'

  static examples = []

  static flags = {
    all: Flags.boolean({ char: 'a', description: 'List all Flow' })
  }

  static args = [{ name: 'flowID' }]

  async run() {
    const { args, flags } = await this.parse(FlowList)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))

    // const { flowID } = args
    const { all = false } = flags

    const flowList = await Flow.listFlow(all)
    if (!flowList.length) return this.log('Not found any flow')

    const activateFlow = await Flow.getActivatedFlow()
    const columns = {
      activate: { header: 'Cur', get: (row) => row.id === activateFlow.id ? '>' : '' },
      name: { header: 'Flow Name' },
      state: { header: 'State', get: row => row.state },
      id: { header: 'Short ID', get: row => row.id.slice(0, 8), },
      process: { header: 'Process', get: row => `${row.activateNodeIdx + 1}/${row.nodes.length}` }
    }

    CliUx.ux.table(flowList, columns)
  }
}
