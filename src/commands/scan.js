/** @param {NS} ns */
export async function main(ns) {
  // Acquire a reference to the terminal list of lines.
  const list = eval('document').getElementById("terminal");
  
  async function findem(servers, trace, indent) {
    for (const server of servers) {
      const newTrace = trace.concat(server);
      const command = newTrace.map(s => `connect ${s}`).join(';');

      // Inject some HTML.
      list.insertAdjacentHTML('beforeend',
        `<li class="MuiListItem-root jss1184 MuiListItem-gutters MuiListItem-padding css-1a4zesh">` +
        `<p class="MuiTypography-root MuiTypography-body1 css-1ou38yu">&gt; ` +
        `<a class="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways css-1rrbbvk" onclick="window.callCommand('${command}')">${server}</a></p></li>`
      )
      // ns.tprintf("%s> %s","-".repeat(indent), server);
      ns.tprintf("%sRoot Access: %s, Required hacking skill: %d", "-".repeat(indent + 2), ns.hasRootAccess(server) ? "YES" : "NO", ns.getServerRequiredHackingLevel(server));
      ns.tprintf("%sNumber of open ports required to NUKE: %d", "-".repeat(indent + 2), ns.getServerNumPortsRequired(server));
      ns.tprintf("%sRAM: %s\n\n", "-".repeat(indent + 2), ns.formatRam(ns.getServerMaxRam(server)));
      
      await findem(ns.scan(server).slice(1), newTrace, indent + 4);
    }
  }

  eval('window').callCommand = (cmd) => {
    // Acquire a reference to the terminal text field
    const terminalInput = eval('document').getElementById("terminal-input");

    // Set the value to the command you want to run.
    terminalInput.value = cmd;

    // Get a reference to the React event handler.
    const handler = Object.keys(terminalInput)[1];

    // Perform an onChange event to set some internal values.
    terminalInput[handler].onChange({target:terminalInput});

    // Simulate an enter press
    terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
  }

  await findem(ns.scan(), [], 0);
}