import { Flow } from '@node-flow/core'
import { logger } from '@node-flow/core/lib/logger'
import { Command } from '@oclif/core'

export default class FlowNext extends Command {
  static description = 'Flow to the next state'

  static examples = [
    'flow next'
  ]

  static flags = {}

  static args = [{ name: 'flowID' }]


  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowNext)
    logger.debug('CMD flow next', JSON.stringify({ args, flags }))

    const { flowID } = args


    let flow = null
    if (flowID) flow = await Flow.checkoutFlow(flowID)
    else flow = await Flow.getActivatedFlow()


    if (!flow) throw new Error('Not found activated flow')


    await flow.next()
  }
}
