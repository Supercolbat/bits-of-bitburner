<pre>
        |
    | | | | |
| | | \/|\/ | | |
|/  |_/ | \_|  \|  Bits of
|  /  | | |  \  |  Bitburner
 \|__/ / \ \__|/   - by Supercolbat
  |  | | | |  |
   \ | \_/ | /
</pre>

## Whats inside?

* [Auto-Infiltration](https://github.com/Supercolbat/bits-of-bitburner/src/inferno.js) - It's fast. *Really* fast.

* [Neofetch](https://github.com/Supercolbat/bits-of-bitburner/src/bin/neofetch.js) - Show off your (ingame) specs.

* [Shell history expansion](https://github.com/Supercolbat/bits-of-bitburner/src/bin/_expand_.js) - Prefix a command with `!` to run from history.

      $ run propagate.js n00dles
      $ ls
      $ ! run

Relevant file tree

```
📁 src
├╴ 📁 bin               - Shell commands
│  ├╴ _expand.js           - Shell history expansion
│  ├╴ neofetch.js          - Fetch in-game system information
│  ├╴ touch.js             - Create an empty file
│  └╴ whoami.js            - Get information about the player (you!)
├╴ 📁 commands          - Aliased user scripts
│  ├╴ find-contracts.js    - Find the locations of each contract
│  └╴ follow.js            - Connect to any server
├╴ 📁 lib               - Libraries
│  ├╴ 📁 contracts        - Code for soon-to-be-each contract (e.g. encryption_ii_vigenere_cipher.js)
│  │  └╴ ...
│  ├╴ 📁 dist             - 3rd-party libraries (e.g. lodash, bestiejs/benchmark.js)
│  │  └╴ ...
│  ├╴ contracts.js         - Exports of ./contracts/
│  ├╴ dom.js               - DOM-related functions
│  ├╴ globals.js           - Variables that are commonly repeated
│  ├╴ ns.js                - Netscript functions without ns
│  ├╴ react.js             - React-related functions
│  ├╴ terminal.js          - Terminal-related functions
│  ├╴ trustInputs.js       - Allow for simulated keyboard events to be regcongized
│  └╴ utils.js             - Anything that doesn't fit in the other categories
├╴ 📁 script            - User scripts
│  ├╴ benchmark.js         - Benchmark Javascript code
│  ├╴ dev.js               - Opens the Developer Menu (i swear i dont use it)
│  ├╴ infiltration.js      - Shows information about infiltratable areas
│  ├╴ purchase-server.js   - Purchases 1TB servers with an interesting name 
│  ├╴ root-all.js          - Gets root on all posisble servers
│  └╴ save-my-money.js     - Automatically sells a specific stock when predicted to drop in price
├╴ bbrc.txt              - Config file for the up-and-coming bbsh shell
├╴ autocontract.js       - Automatically completes contracts
├╴ grow-loop.js          - Runs grow on a server
├╴ hack.js               - Basic hacking script
├╴ hell.js               - Get yourself into debt by failing infiltrations
├╴ inferno.js            - Speedrun infiltrations automatically
├╴ init_bbsh.js          - Initialization script for bbsh
├╴ propagate.js          - Spread and run the hacking script on all available servers
├╴ spread.js             - Same as propagate.js but only targets unaffected servers
└╴ weaken-loop.js        - Runs weaken on a server
```

## Is that it?

While there definitely are more scripts in this repository, they're either incomplete or not worth showing off (yet!).

## Goals

* Recreate a bash shell as closely as possible
* Set up Typescript and/or ESLint
* DOOM emulator
* Benchmarking script
* [Batching](https://bitburner-official.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html#batch-algorithms-hgw-hwgw-or-cycles)
* ~~Make the infiltrate faster~~
