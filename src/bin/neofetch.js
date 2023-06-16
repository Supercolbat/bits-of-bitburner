import { WrapperSpan, StyledText } from '/lib/react.js';

const BitburnerAscii = String.raw`
        |        
    | | | | |    
| | | \/|\/ | | |
|/  |_/ | \_|  \|
|  /  | | |  \  |
 \|__/ / \ \__|/ 
  |  | | | |  |  
   \ | \_/ | /   `.slice(1).split('\n');

const colorsLine1 = ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'well', 'button'];
const colorsLine2 = ['hp', 'money', 'hack', 'combat', 'cha', 'int', 'rep', 'disabled'];

/**
 * Formats a timestamp using the following template:
 * ```
 * 'DD days, HH hours, MM minutes'
 * ```
 * @param {number} timestamp
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const days = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${days} days, ${hours} hours, ${minutes} minutes`;
}

/** @param {NS} ns */
export async function main(ns) {
  const home = ns.getServer('home');
  const theme = ns.ui.getTheme();
  const currentScriptRam = ns.getRunningScript().ramUsage;

  // Gather information
  const version = ns.ui.getGameInfo().version;
  const playtime = formatTimestamp(ns.getPlayer().totalPlaytime);
  const [screenWidth, screenHeight] = ns.ui.windowSize();
  const cpuCores = home.cpuCores;
  const usedRam = home.ramUsed - currentScriptRam;
  const maxRam = home.maxRam;

  let logoLineIndex = 0;
  /**
   * Utility function for printing text with the logo included.
   * @param {...React.ReactElement} children
   */
  function tprintWithLogo(...children) {
    const line = (BitburnerAscii[logoLineIndex++] ?? '                 ') + '   ';
    ns.tprintRaw(WrapperSpan(
      StyledText(line, { color: theme.primary } ),
      ...children,
    ));
  }

  tprintWithLogo(
    StyledText('root', { color: theme.info }),
    StyledText('@', { color: theme.primary }),
    StyledText('bitburner', { color: theme.info }),
  );
  tprintWithLogo(
    StyledText('--------------', { color: theme.primary }),
  );
  tprintWithLogo(
    StyledText('OS: ', { bold: theme.primary, bold: true }),
    StyledText(`bitburnerOS v${version} x86_128`, { color: theme.primary }),
  );
  tprintWithLogo(
    StyledText('Uptime: ', { bold: theme.primary, bold: true }),
    StyledText(playtime, { color: theme.primary }),
  );
  tprintWithLogo(
    StyledText('Shell: ', { bold: theme.primary, bold: true }),
    StyledText('bbsh', { color: theme.primary }),
  );
  tprintWithLogo(
    StyledText('Resolution: ', { bold: theme.primary, bold: true }),
    StyledText(`${screenWidth}x${screenHeight}`, { color: theme.primary }),
  );
  tprintWithLogo(
    StyledText('CPU: ', { bold: theme.primary, bold: true }),
    StyledText(`Intel i77-6360U (${cpuCores} core)`, { color: theme.primary }),
  );
  tprintWithLogo(
    StyledText('Memory: ', { bold: theme.primary, bold: true }),
    StyledText(`${ns.formatRam(usedRam)} / ${ns.formatRam(maxRam)}`, { color: theme.primary }),
  );
  tprintWithLogo();
  tprintWithLogo(
    ...colorsLine1.map(color => StyledText('   ', { background: theme[color] }))
  );
  tprintWithLogo(
    ...colorsLine2.map(color => StyledText('   ', { background: theme[color] }))
  );

  // Print the test of the logo
  while (logoLineIndex < BitburnerAscii.length - 1)
    tprintWithLogo();
}