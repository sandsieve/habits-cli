// @ts-ignore
import { version } from "../package.json";

import { CommandGroup } from "./models";
import { auth, property, transaction } from "./commands";

const start = () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  const habits = new CommandGroup("habits", "the habits cli").withSubcommands([
    auth,
    transaction,
    property,
  ]);
  habits.version = version;
  habits.showHelpAfterError = true;
  habits.init(rawArgs).run();
};

start();
