import { Command, Flags } from '@oclif/core'
import { Flow } from '@node-flow/core'
import { logger } from '@node-flow/core/lib/logger'


export default class FlowCreate extends Command {
  static description = 'Create a Flow'

  static examples = []

  static flags = {
    node: Flags.string({char: 'n', multiple: true})
    // nodes: Flags.string({ parse: v => JSON.parse(v) }),
  }

  static args = [{ name: 'flowName', required: true }]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowCreate)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))

    const { flowName } = args
    const { node = [] } = flags
    const nodes = node.map(x => ({type: x}))

    const flow = new Flow({ name: flowName, nodes })
    await flow.activate()
  }
}
