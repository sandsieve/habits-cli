import { version } from "../package.json";

import { CommandGroup } from "./models";
import { auth, property, transaction } from "./commands";
import { invitation } from "./commands/invitation";
import { handleErrors } from "./utils";

const start = async () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  const habits = new CommandGroup("habits", "the habits cli").withSubcommands([
    auth,
    transaction,
    property,
    invitation,
  ]);
  habits.version = version;
  habits.showHelpAfterError = true;

  // Start program
  try {
    await habits.start(rawArgs);
  } catch (errors: any) {
    handleErrors(errors);
  }
};

start();
