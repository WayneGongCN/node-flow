import { Command, Flags } from '@oclif/core'
import { Flow } from '@node-flow/core'
import { logger } from '@node-flow/core/lib/logger'


export default class FlowRemove extends Command {
  static description = 'Remove a Flow'

  static examples = []

  static flags = {
    nodes: Flags.string({
      default: '[]',
      parse: v => JSON.parse(v)
    })
  }

  static args = [{ name: 'flowName', required: true }]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowRemove)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))

    const { flowName } = args
    const { nodes } = flags


    const flow = new Flow({ name: flowName, nodes })
    await flow.remove()
  }
}
