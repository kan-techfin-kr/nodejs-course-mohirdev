function lineBreakInConsole() {
  console.log();
}

/**
 * @description 1-masala
 * @summary expression function
 * @param {string} v4
 */
const IP1 = function (v4) {
  if (!v4.length) {
    return "please enter valid argument!";
  }
  return v4.split(".").join("[.]");
};

/**
 * @description 1-masala
 * @summary regular function
 * @param {string} v4
 */

function IP2(v4) {
  if (!v4.length) {
    return "please enter valid argument!";
  }
  return v4.split(".").join("[.]");
}
/**
 * @description 1-masala
 * @summary arrow function
 * @param {string} v4
 */

const IP3 = (v4) => {
  if (!v4.length) {
    return "please enter valid argument!";
  }
  return v4.split(".").join("[.]");
};

// 1-masala uchun testlar
let testsIPV4 = ["1.1.1.1", "256.123.4.56", "32.543.23.12"];

// testing expression function
testsIPV4.forEach((test, index) => {
  console.log(`${index + 1}: expression function => ${IP1(test)}`);
});
lineBreakInConsole();

// testing regular function
testsIPV4.forEach((test, index) => {
  console.log(`${index + 1}: regular function => ${IP2(test)}`);
});
lineBreakInConsole();

// testing arrow function
testsIPV4.forEach((test, index) => {
  console.log(`${index + 1}: arrow function => ${IP3(test)}`);
});
lineBreakInConsole();

/**
 * @description 2-masala
 * @summary expression function
 * @param {string} str
 */
const getTheLegthOfTheLastWordInTheString1 = function (str) {
  let splitted = str.split(" ");
  let lastIndex = splitted.length - 1;
  return splitted[lastIndex].length;
};
/**
 * @description 2-masala
 * @summary regular function
 * @param {string} str
 */
function getTheLegthOfTheLastWordInTheString2(str) {
  let splitted = str.split(" ");
  let lastIndex = splitted.length - 1;
  return splitted[lastIndex].length;
}
/**
 * @description 2-masala
 * @summary arrow function
 * @param {string} str
 */
const getTheLegthOfTheLastWordInTheString3 = (str) => {
  let splitted = str.split(" ");
  let lastIndex = splitted.length - 1;
  return splitted[lastIndex].length;
};

// 2-masala uchun testlar
let testsLengthOfLastWords = ["Hello world", "My name is Zokirkhon", "see you soon"];

// testing expression function
testsLengthOfLastWords.forEach((test, index) => {
  console.log(`${index + 1}: expression function => ${getTheLegthOfTheLastWordInTheString1(test)}`);
});
lineBreakInConsole();

// testing regular function
testsLengthOfLastWords.forEach((test, index) => {
  console.log(`${index + 1}: regular function => ${getTheLegthOfTheLastWordInTheString2(test)}`);
});
lineBreakInConsole();

// testing arrow function
testsLengthOfLastWords.forEach((test, index) => {
  console.log(`${index + 1}: arrow function => ${getTheLegthOfTheLastWordInTheString3(test)}`);
});
lineBreakInConsole();

