import '/lib/dist/lodash.js';
import '/lib/dist/benchmark.js'; // 50gb of RAM moment

import { print } from '/lib/ns';

/** @param {NS} ns */
export async function main(ns) {
  const suite = new Benchmark.Suite;

  const data = Array(100).map(e => Math.floor(Math.random() * e));
  suite.add('x.at(-1)', function() {
    const x = data.at(-1);
  })
  .add('x[x.length - 1]', function() {
    const w = data;
    const x = w[w.length - 1];
  })

  // add listeners
  .on('cycle', function(event) {
    print(String(event.target), 'info');
  })
  .on('complete', function() {
    print('Fastest is ' + this.filter('fastest').map('name'), 'success');
  })

  // run async
  .run({ 'async': true });
}



  // const data = Array(100).fill(1).map((v, i) => v + i);
  // suite.add('for i++', function() {
  //   let x;
  //   for (let i = 0, len = data.length; i < len; i++) {
  //     x = data[i];
  //   }
  // })
  // .add('for ++i', function() {
  //   let x;
  //   for (let i = 0, len = data.length; i < len; ++i) {
  //     x = data[i];
  //   }
  // })
  // .add('for of', function() {
  //   let x;
  //   for (const i of data) {
  //     x = i;
  //   }
  // })
  // .add('foreach', function() {
  //   let x;
  //   data.forEach(i => {
  //     x = i;
  //   });
  // })
  // .add('while i++', function() {
  //   let x;
  //   let i = 0;
  //   const len = data.length;
  //   while (i < len) {
  //     x = data[i];
  //     i++;
  //   }
  // })
  // .add('while ++i', function() {
  //   let x;
  //   let i = 0;
  //   const len = data.length;
  //   while (i < len) {
  //     x = data[i];
  //     ++i;
  //   }
  // })

  // // add listeners
  // .on('cycle', function(event) {
  //   print(String(event.target), 'info');
  // })
  // .on('complete', function() {
  //   print('Fastest is ' + this.filter('fastest').map('name'), 'success');
  // })