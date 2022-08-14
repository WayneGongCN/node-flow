import { Command, Flags } from '@oclif/core'
import { Flow, logger } from '@node-flow/core'


export default class FlowRemove extends Command {
  static description = 'Remove a Flow'

  static examples = []

  static flags = {
    nodes: Flags.string({
      multiple: true
    })
  }

  static args = [{ name: 'flowID', required: true }]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowRemove)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))
    const { flowID } = args


    const flow = await Flow.checkoutFlow(flowID)
    await flow.remove()
  }
}
