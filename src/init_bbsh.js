import { assert } from '/lib/utils.js';
import { execCommand, getTerminalAliases } from '/lib/terminal.js';

const ConfigFile = 'bbrc.txt';

const Aliases = getTerminalAliases();

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.fileExists(ConfigFile))
    return ns.tprintf('ERROR: You must have %s in your filesystem.', ConfigFile);

  const config = ns.read(ConfigFile).split('\n');

  createAlias('!', 'run bin/_expand.js');

  for (const line of config) {
    if (line.startsWith('#'))
      continue;

    const [command, ...args] = line.split(' ').filter(s => s.length > 0);

    switch (command) {
      case 'alias':
        assert(args.length > 3);
        assert(args[1] == '=');
        
        const [alias, _, ...definition] = args;

        createAlias(alias, definition.join(' '));
        break;

      case 'exportPATH':
        assert(args.length > 2);
        
        for (const path of args)
          for (const script of ns.ls(path))
            if (!script.startsWith('_'))
              createAlias(script.split('.')[0], 'run ' + script);

        break;
    }
  }

  ns.ui.clearTerminal();
}

/**
 * Creates or overrides an existing alias
 * @param {string} alias
 * @param {string} definition
 */
function createAlias(alias, definition) {
  console.log(`alias ${alias}="${definition}"`)
  execCommand(`alias ${alias}="${definition}"`);
}