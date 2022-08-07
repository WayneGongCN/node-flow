import { Command, Flags } from '@oclif/core'
import { Flow } from '@node-flow/core'
import { logger } from '@node-flow/core/lib/logger'


export default class FlowRemove extends Command {
  static description = 'Remove a Flow'

  static examples = []

  static flags = {}

  static args = [{ name: 'flowID', required: true }]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowRemove)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))
    const { flowID } = args

    const flow = await Flow.checkoutFlow(flowID)
    if (flow) {
      await flow.remove()
    } else {
      throw new Error(`No Flow with ID ${flowID}`)
    }
  }
}
