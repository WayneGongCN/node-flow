import { Command, Flags } from '@oclif/core'
import { logger } from '@node-flow/core/lib/logger'


export default class FlowCreate extends Command {
  static description = 'Create a Flow'

  static examples = []

  static flags = {
    template: Flags.string({ char: 't' }),
  }

  static args = [{ name: 'flowName', required: true }]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FlowCreate)
    logger.debug('CMD flow create params', JSON.stringify({ args, flags }))

    // TODO: create flow with template
  }
}
