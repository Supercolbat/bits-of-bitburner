import { doc } from '/lib/globals.js';
import { findElement, waitForElement } from '/lib/dom.js';
import { wrapEventListeners, unwrapEventListeners } from '/lib/trustInputs.js';
import { getProps } from '/lib/react.js';
import { cacheFn } from '/lib/utils.js';
import { sleep } from '/lib/ns.js';

const Config = {
  targetCompany: 'ECorp',
  sellFaction: 'Fulcrum Secret Technologies',
  tradeRep: false,   // Priority over cash
  tradeCash: true,
};

/**
 * The speed to run events at
 * @type {number}
 */
const Delay = 1;

const createKeyboardEvent = cacheFn(key => new KeyboardEvent(
  'keydown',
  { key, bubbles: false }
));

/**
 * Attempt to press a key and cancels infiltration if failed.
 * @param {string} key
 */
function pressKey(key) {
  // This will cause the script to error, but at least you won't lose health
  !doc.dispatchEvent(createKeyboardEvent(key)) && getProps(doc.querySelector('#root > .MuiBox-root > div')).children.props.cancel();
}

/**
 * Find 2-D positions of a target in a 1-D set of elements, assuming it wraps every
 * n-th element (width).
 * @param {any[]} elements 
 * @param {any} target 
 * @param {number} width 
 * @returns {[number, number][]}
 */
function findAllGrid(elements, target, width) {
  const positions = [];

  for (let i = 0, len = elements.length; i < len; ++i)
    if (elements[i] == target)
      positions.push([i % width, Math.floor(i / width)]);
  
  return positions;
}

/**
 * Given Point A, a list of points, and information about the grid, find the closest
 * point to Point A. This includes out-of-bounds points. When in a tie, the first
 * closest point is returned.
 * @param {[pointX: number, pointY: number]}
 * @param {[number, number][]} positions
 * @param {number} width - Width of grid
 * @param {number} height - Height of grid
 * @returns {[number, number]} - Possibly negative coordinates
 */
function findClosestPoint([pointX, pointY], positions, width, height) {
  let lowestMoves = Infinity;
  let lowestX = undefined;
  let lowestY = undefined;

  // Calculate distance to all possible positions and choose the lowest one
  for (let idx = 0, length = positions.length; idx < length; idx++) {
    const [targetPosX, targetPosY] = positions[idx];

    // Check the distance between both points
    const moves = Math.abs(pointX - targetPosX) + Math.abs(pointY - targetPosY);

    // 0 is the minimum distance for any two points
    if (moves == 0)
      return [targetPosX, targetPosY];

    if (moves < lowestMoves) {
      lowestMoves = moves;

      lowestX = targetPosX;
      lowestY = targetPosY;
    }

    // Take into account that the cursor can wrap around the grid.
    // This has a side-effect of having coordinates outside of the grid, but that
    // is easily handled wherever this function is used.
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        // We already checked this. The point of the check above was to rule
        // out the 0-minimum-move possiblity.
        if (i == 0 && j == 0) continue;

        const posX = targetPosX + width * i;
        const posY = targetPosY + height * j;

        const moves = Math.abs(pointX - posX) + Math.abs(pointY - posY);

        // 1 is the minimum distance for points that wrap around because
        // 0-distance points are handled in the check above these two loops
        if (moves == 1)
          return [posX, posY];

        if (moves < lowestMoves) {
          lowestMoves = moves;

          lowestX = posX;
          lowestY = posY;
        }
      }
    }
  }

  return [lowestX, lowestY];
}

/** @param {NS} ns */
export async function main(ns) {
  /**
   * List of mines in the minesweeper minigame.
   * @type {boolean[]}
   */
  let savedMines = [];
  let minesweeperInProgress = false;

  // Automatically go to the city tab (assumes you are in the right city)
  const cityButton = doc.querySelector('.MuiDrawer-root > div > ul > div:nth-child(8) > div > div > div[role=button]');
  cityButton.click();

  while (true) {
    doc.querySelector(`span[aria-label=${Config.targetCompany}]`).click();
    await sleep(Delay);
    
    getProps(
      // findElement('.MuiBox-root > .MuiBox-root > div > button:nth-child(3)')
      findElement('button', e => e.innerText.startsWith('Infiltrate Company'))
    ).onClick({isTrusted: true})

    await sleep(100);

    const containerElement = doc.querySelector('.MuiBox-root.jss1');

    try {
      // Wait until an infiltration screen is open
      await waitForElement('#root > .MuiBox-root', (e) => {
        const props = getProps(e);
        return props.children.props && props.children.props.location;
      });

      // Ensure that keyboard inputs are registered
      wrapEventListeners();

      // Automatically start the game
      // TODO: make it more straightforward
      const props = getProps(doc.querySelector('#root > .MuiBox-root > div'));
      props.children.props.start();

      // Play game
      let isInfiltrating = true;
      while (isInfiltrating) {
        // Wait some time before checking what screen we're on
        await sleep(Delay);

        const children = containerElement.children[0].children[0].children;
        const title = children[children.length - 1].children[0].innerText;
        switch (title) {
          case 'Get Ready!':
            break;

          case 'Type it backward':
            await playBackwardGame();
            break;

          case 'Close the brackets':
            await playBracketsGame();
            break;

          case 'Say something nice about the guard':
            await playBribeGame();
            break;

          case 'Match the symbols!':
            await playMatchingGame();
            break;

          case 'Remember all the mines!':
            if (!minesweeperInProgress) {
              minesweeperInProgress = true;
              savedMines = rememberMines();
            }
            break;
          case 'Mark all the mines!':
            await playMinesweeper(savedMines);
            minesweeperInProgress = false;

            // Sanity check
            savedMines.length = 0;
            break;

          case 'Attack when his guard is down!':
            await playUnfairWithoutAugmentGame();
            break;

          case 'Cut the wires with the following properties! (keyboard 1 to 9)':
            await playWireCuttingGame();
            break;

          case 'Enter the Code!':
            await playArrowGame();
            break;

          // Your winner!
          case 'Infiltration successful!':
            isInfiltrating = false;
            break;

          default:
            unwrapEventListeners();
            return
        }
      }

      // Game ended :D
      unwrapEventListeners();
    } catch (e) {
      console.log('bruh', e)
      unwrapEventListeners();
      return;
    }

    await sleep(Delay);
    if (Config.tradeRep) {
      const actions = doc.querySelector('.MuiContainer-root > div:last-child > div').children[0];
      const input = getProps(actions.children[0].children[1]);
      const submit = actions.children[1];
      input.onChange({ target: { value: Config.sellFaction } });
      submit.click();
    } else if (Config.tradeCash) {
      findElement('button', e => e.innerText.startsWith('Sell for')).click();
    }
  }
}

async function playBackwardGame() {
  const text = doc.querySelector('.MuiContainer-root > div:last-child > p').innerText;
  for (let i = 0, len = text.length; i < len; ++i) {
    await sleep(Delay);
    pressKey(text[i]);
  }
}

async function playBracketsGame() {
  const bracketPair = { '[': ']', '{': '}', '(': ')', '[': ']', '<': '>' };

  const brackets = doc.querySelector('.MuiContainer-root > div:last-child > p').innerText.split('').reverse().slice(1);
  for (let i = 0, len = brackets.length; i < len; ++i) {
    await sleep(Delay);
    pressKey(bracketPair[brackets[i]]);
  }
}

async function playBribeGame() {
  const positive = ['affectionate', 'agreeable', 'bright', 'charming', 'creative', 'determined', 'energetic', 'friendly', 'funny', 'generous', 'polite', 'likable', 'diplomatic', 'helpful', 'giving', 'kind', 'hardworking', 'patient', 'dynamic', 'loyal', 'straightforward'];

  const wordElement = doc.querySelector('.MuiContainer-root > div:last-child > h5:nth-child(3)');

  while (true) {
    if (positive.includes(wordElement.innerText)) {
      await sleep(Delay);
      pressKey(' ');
      break;
    }
    
    await sleep(Delay);
    pressKey('w');
  }
}

async function playMatchingGame() {
  // Get the list of targets
  const targets = doc.querySelector('.MuiContainer-root > div:last-child > h5').innerText
    .slice(9, -1)   // Get rid of "Target: " and the blank space at the end
    .split('\xa0'); // Split by &nbsp;

  // Find the grid
  const gridElement = doc.querySelector('.MuiContainer-root > div:last-child > div');
  const grid = gridElement.innerText.split('\n\n');
  
  // Get the width and height based on its computed style
  const style = getComputedStyle(gridElement);
  const width = style.gridTemplateColumns.split(' ').length;
  const height = style.gridTemplateRows.split(' ').length;

  // Position of cursor
  let cursorX = 0, cursorY = 0;

  // Introduce a cache to reduce workload
  const cacheFindAllGrid = cacheFn(findAllGrid);
  
  for (const target of targets) {
    const positions = cacheFindAllGrid(grid, target, width);

    // Get the closest mine
    const [posX, posY] = findClosestPoint([cursorX, cursorY], positions, width, height);

    // Determine which direction to move in and what key to press
    const velocityX = cursorX < posX ? 1 : -1;  // 1 for right, -1 for left (and technically when equal)
    const horizKey = velocityX == 1 ? 'ArrowRight' : 'ArrowLeft';

    const velocityY = cursorY < posY ? 1 : -1;  // 1 for down, -1 for up (and technically when equal)
    const vertKey = velocityY == 1 ? 'ArrowDown' : 'ArrowUp';

    // Move diagonally
    // while (cursorX != posX && cursorY != posY) {
    //   await sleep(Delay);
    //   pressKey(horizKey);
    //   pressKey(vertKey);
    //   cursorX += velocityX;
    //   cursorY += velocityY;
    // }

    // Move horizontally
    while (cursorX != posX) {
      await sleep(Delay);
      pressKey(horizKey);
      cursorX += velocityX;
    }

    // Move vertically
    while (cursorY != posY) {
      await sleep(Delay);
      pressKey(vertKey);
      cursorY += velocityY;
    }

    // Click on the symbol
    await sleep(Delay);
    pressKey(' ');

    // Normalize cursor
    if (cursorX < 0)       cursorX += width;
    if (cursorX >= width)  cursorX -= width;
    if (cursorY < 0)       cursorY += height;
    if (cursorY >= height) cursorY -= height;
  }
}

function rememberMines() {
  const minesElement = doc.querySelector('.MuiContainer-root > div:last-child > div');
  const width = getComputedStyle(minesElement).gridTemplateColumns.split(' ').length;

  // Replace each mine with `true` and all else with `false`
  const mines = Array.from(minesElement.children, e => e.children.length > 0);

  // Find the positions of each mine
  return findAllGrid(mines, true, width);
}

async function playMinesweeper(savedMines) {
  // Find mines grid
  const minesElement = doc.querySelector('.MuiContainer-root > div:last-child > div');
  const style = getComputedStyle(minesElement);

  // Get the width and height based on its computed style
  const width = style.gridTemplateColumns.split(' ').length;
  const height = style.gridTemplateRows.split(' ').length;

  // Position of cursor
  let cursorX = 0, cursorY = 0;

  while (savedMines.length) {
    // Get the savedMines mine
    const [posX, posY] = findClosestPoint([cursorX, cursorY], savedMines, width, height);

    // Determine which direction to move in and what key to press
    const velocityX = cursorX < posX ? 1 : -1;  // 1 for right, -1 for left (and technically when equal)
    const horizKey = velocityX == 1 ? 'ArrowRight' : 'ArrowLeft';

    const velocityY = cursorY < posY ? 1 : -1;  // 1 for down, -1 for up (and technically when equal)
    const vertKey = velocityY == 1 ? 'ArrowDown' : 'ArrowUp';

    // Move diagonally
    // while (cursorX != posX && cursorY != posY) {
    //   await sleep(Delay);
    //   pressKey(horizKey);
    //   pressKey(vertKey);
    //   cursorX += velocityX;
    //   cursorY += velocityY;
    // }

    // Move horizontally
    while (cursorX != posX) {
      await sleep(Delay);
      pressKey(horizKey);
      cursorX += velocityX;
    }

    // Move vertically
    while (cursorY != posY) {
      await sleep(Delay);
      pressKey(vertKey);
      cursorY += velocityY;
    }

    // Mark the mine
    await sleep(Delay);
    pressKey(' ');

    // Normalize cursor
    if (cursorX < 0)       cursorX += width;
    if (cursorX >= width)  cursorX -= width;
    if (cursorY < 0)       cursorY += height;
    if (cursorY >= height) cursorY -= height;

    // Delete the mine from positions
    savedMines.splice(
      savedMines.findIndex(pos => pos[0] === cursorX && pos[1] === cursorY),
      1
    );
  }
}

async function playArrowGame() {
  const arrowKey = { '↑': 'ArrowUp', '←': 'ArrowLeft', '↓': 'ArrowDown', '→': 'ArrowRight' };

  const arrowElement = doc.querySelector('.MuiContainer-root > div:last-child > h4:last-child');

  while (true) {
    const key = arrowKey[arrowElement.innerText];

    if (!key)
      break;

    pressKey(key);
    await sleep(Delay);
  }
}

async function playUnfairWithoutAugmentGame() {
  const status = doc.querySelector('.MuiContainer-root > div:last-child');

  while (true) {
    if (!status.innerText.includes('Guarding ...'))
      break;
    await sleep(Delay);
  }
  
  // Wait a bit so we don't click too early
  await sleep(Delay / 2);
  pressKey(' ');
}

async function playWireCuttingGame() {
  // Find the wires
  const wires = [...doc.querySelector('.MuiContainer-root > div:last-child > div').children];
  const totalWires = wires.length / 9;  // Each wire is made up of 9 characters, including its index

  // Get the last word (the relevant one) from each instruction
  const instructions = Array.from(
    doc.querySelectorAll('.MuiContainer-root > div:last-child > p'),
    e => {
      // .split(' ')    -  Split the instructions into words
      // .at(-1)  -  Get the last word
      // .slice(0, -1)  -  Exclude the last character (a period)
      const words = e.innerText.split(' ');
      const code = words[words.length - 1].slice(0, -1);
      return code === 'yellow' ? 'rgb(255, 193, 7)' : code;
    }
  );
  
  // Snip some wires!
  for (let i = 0; i < totalWires; ++i) {
    const strIdx = (i + 1) + '';  // is this optimization even worth it?
    const colorWire = wires[i + totalWires];
    const altColorWire = wires[i + totalWires * 2];

    (
      instructions.includes(strIdx) ||
      instructions.includes(colorWire.style.color) ||
      instructions.includes(altColorWire.style.color)
    ) && pressKey(strIdx);

    // The order doesn't matter here, so the delay is unnecessary
  }
}