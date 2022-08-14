import { Command, Flags } from '@oclif/core'
import { Flow, logger } from '@node-flow/core'


export default class FlowCreate extends Command {
  static description = 'Create a Flow'

  static examples = []

  static flags = {
    raw: Flags.string()
  }

  static args = []

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowCreate)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))
    const { raw } = flags
    const flowData = JSON.parse(raw)
    const flow = new Flow(flowData)
    await flow.save()
    await flow.activate()
  }
}
