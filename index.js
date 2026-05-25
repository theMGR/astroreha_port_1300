// There are 3 levels of accuracy (also called ephemeris)
/*
  Moshier: 0.1 arcsec
  Swiss Ephemeris: 0.001 arcsec (requires 90MB of data)
  JPL NASA: almost accurate (nothing higher than this): 2.9GB of Data
  House System: Whole Sign 'W' (Wikipedia) default could be Equal 'E'

*/
import * as positioner from "./position.js";
import * as compatibility from "./compatibility.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 *
 * @param {Object} obj object to print
 */

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const birthChart = positioner.getBirthChart(
    "1989-06-10",
    "03:03:00",
    11.664325,
    78.146011,
    5.5
  );
  console.log("--- BIRTH CHART ---");
  print(birthChart);
  console.log("--- NAVAMSA CHART ---");
  print(positioner.getNavamsaChart(birthChart));
}

export { compatibility, positioner };
