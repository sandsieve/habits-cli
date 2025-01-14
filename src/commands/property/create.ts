import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { mainApi, network, validation, vschema } from "../../services";
import { Option } from "commander";
import { RequestMethod, SuccessResponse } from "../../types";

interface PromptAnswers {
  name: string;
  description?: string;
  amountInStock?: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "name",
    message: "Property name:",
    validate: validation.validator(vschema.string().min(1).max(50).required()),
  },
  {
    type: "input",
    name: "description",
    message: "Description (optional):",
    validate: validation.validator(vschema.string()),
  },
  {
    type: "input",
    name: "amountInStock",
    message: "In stock (optional):",
    filter: validation.argParser(vschema.number().positive()),
  },
];

export class CreateCommand extends QuestionCommand {
  name = "create";
  description = "create a new property";
  aliases = ["add"];

  acceptOpts = [
    new Option("-n, --name <name>", "new value for property name"),
    new Option(
      "-d, --description <description>",
      "new value for property description"
    ),
    new Option(
      "--in-stock <inStock>",
      "new value for amount of in-stock properties"
    ).argParser(validation.argParser(vschema.number().min(0))),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.opts.name) {
      userInput.name = this.opts.name;
    }
    if (this.opts.description) {
      userInput.description = this.opts.description;
    }
    if (this.opts.inStock) {
      userInput.amountInStock = this.opts.inStock;
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<SuccessResponse> {
    return network.request(mainApi, {
      uri: "/properties",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Create property",
    });
  }

  protected async run(): Promise<void> {
    await this.promptForInputs(promptQuestions);
    await this._sendRequest();
  }
}
