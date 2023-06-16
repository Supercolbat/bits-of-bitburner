/* @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  async function findem(servers) {
    for (const server of servers) {
      if (server == target)
        return [server]

      const trace = await findem(ns.scan(server).slice(1));
      if (trace.length > 0)
        return [server, ...trace];
    }
    return [];
  }

  const trace = await findem(ns.scan());

  if (trace.length == 0) {
    ns.tprintf("ERROR: No server by the name of %s was found", target);
    return;
  }

  const command = trace.map(s => `connect ${s}`).join(';');

  const terminalInput = eval('document').getElementById("terminal-input");
  terminalInput.value = command;
  const handler = Object.keys(terminalInput)[1];
  terminalInput[handler].onChange({target:terminalInput});
  terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
}

export function autocomplete(data, args) {
  return data.servers;
}