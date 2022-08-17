import { Node, NodeData, NodeFlowEvent } from '@node-flow/core'
import inquirer, { Question } from 'inquirer'


export interface InquirerNodeData extends NodeData {
  questions: Question[]
}


class InquirerNode extends Node<InquirerNodeData> {
  static type = 'node-inquirer'


  constructor(options: InquirerNodeData) {
    super(options)
  }


  async run(event: NodeFlowEvent): Promise<NodeFlowEvent> {
    const answer = await inquirer.prompt(this.options.questions || event.payload)
    event.payload = answer
    return event
  }


  serialize() {
    return {
      ...super.serialize(),
      questions: this.options.questions
    }
  }
}


export default InquirerNode
