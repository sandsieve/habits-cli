import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { mainApi, network, validation, vschema } from "../../services";
import { RequestMethod } from "../../types";
import { BasicAuthCommand } from "./BasicAuthCommand";

interface PromptAnswers {
  email: string;
  password: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "email",
    message: "Email:",
    validate: validation.validator(vschema.string().email().required()),
  },
  {
    type: "password",
    name: "password",
    message: "Password:",
    mask: "*",
    validate: validation.validator(vschema.string().required()),
  },
];

export class SignInCommand extends BasicAuthCommand<PromptAnswers> {
  name = "signin";
  description = "sign in to your habits account";
  aliases: string[] = ["login"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [new Option("-e, --email <email>", "email of user")];

  protected mapOptionsToInputs() {
    if (
      this.opts.email &&
      vschema.string().email().isValidSync(this.opts.email)
    ) {
      this.userInput = {
        email: this.opts.email,
      };
    }
  }

  protected async sendRequest() {
    return await network.request(mainApi, {
      uri: "/users/signin",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Authenticate user",
    });
  }
}
