import { Command } from '@oclif/core'
import { Flow, logger } from '@node-flow/core'
import { getFullFlowID } from '@node-flow/core/lib/storage'


export default class FlowActivate extends Command {
  static description = 'Create a Flow'
  static enableJsonFlag = true

  static examples = []
  static flags = {}
  static args = [{ name: 'flowID' }]

  async run() {
    const { args, flags } = await this.parse(FlowActivate)
    logger.debug('[CMD] flow activate', JSON.stringify({ args, flags }))

    let { flowID } = args
    // const {} = flags

    if (flowID) {
      flowID = await getFullFlowID(flowID)
      const flow = await Flow.checkoutFlow(flowID)
      await flow.activate()
    }

    else {
      const flow = await Flow.getActivatedFlow()
      if (!flow) return this.log('Not found activate flow')

      this.log(`${flow.name} ${flow.id}`)
      return flow.serialize()
    }
  }
}

