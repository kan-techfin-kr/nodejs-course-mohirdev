// 1. javob
function formThreeDigitNumber(a, b, c) {
  if (a <= 0 || b <= 0 || c <= 0) {
    console.log(0);
  } else {
    console.log(`${a}${b}${c}`);
  }
}

// 2. javob
function getDayOfWeek(number) {
  let nameOfWeekDays = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
    "Yakshanba",
  ];
  const index = number - 1;
  return nameOfWeekDays[index] || "none";
}

// 3. javob
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// 4. javob
function countDigits(a) {
  if (a >= 1 && a <= 9) {
    return 1;
  } else if (a >= 10 && a <= 99) {
    return 2;
  } else if (a >= 100 && a <= 999) {
    return 3;
  } else {
    console.log("kiritilgan raqam 1 va 999 oraliqda bo'lishi kerak.");
  }
}

// 5. javob
function areAllPositive(a, b, c, d) {
  return a > 0 && b > 0 && c > 0 && d > 0;
}

// 6. javob
function sumFromZeroToA(a) {
  if (a < 0) {
    console.log("iltimos musbat raqam kiriting!");
  } else {
    let sum = 0;
    for (let i = 0; i <= a; i++) {
      sum += i;
    }
    console.log(sum);
  }
}

// 7. javob
function isComplexNumber(a) {
  let sum = 0;
  for (let i = 1; i < a; i++) {
    if (a % i === 0) {
      sum += i;
    }
  }
  console.log(sum === a);
}

// 8. javob
function countAllDigits(n) {
  return String(Math.abs(n)).length;
}

// 9. javob
function isPalindrome(n) {
  const originalNumber = Math.abs(n);
  let reversedNumber = 0;
  const numberString = originalNumber.toString();
  const len = numberString.length;

  for (let i = len - 1; i >= 0; i--) {
    reversedNumber = reversedNumber * 10 + parseInt(numberString[i]);
  }

  return originalNumber === reversedNumber;
}

// 10. javob
function sumOfDigits(n) {
  const originalNumber = Math.abs(n);
  let sum = 0;
  let tempNumber = originalNumber;
  while (tempNumber > 0) {
    const digit = tempNumber % 10;
    sum += digit;
    tempNumber = Math.floor(tempNumber / 10);
  }
  return sum;
}

// 11. javob
function reverseAndCopyArray(array) {
  //   let reversedCopy = [...array].reverse();
  // structuredClone is native code
  let reversedCopy = structuredClone(array).reverse();
  return reversedCopy;
}

// 12. javob
function countOccurrences(n, inputArray) {
  const count = inputArray.reduce((acc, cur) => acc + (cur === n ? 1 : 0), 0);

  console.log(`Natija: bu yerda ${count} ta ${n} bor.`);
}

// 13. javob
function findTwoElementsWithSum(array, a) {
  let len = array.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (array[i] + array[j] === a) {
        console.log(`Natija: ${array[i]} va ${array[j]} sonlarining yig'indisi =  ${a} ga teng.`);
        return [array[i], array[j]];
      }
    }
  }
  console.log(`Natija: yig'indisi ${a} ga teng bo'lgan 2ta raqam topilmadi.`);
}

// 14. javob
function sortArrayAscending(inputArray) {
  const sortedArray = inputArray.slice().sort((a, b) => a - b);
  console.log("o'sish holatda tartiblangan array:", sortedArray);
  return sortedArray;
}

// 15. javob
function findSecondLargestElement(inputArray) {
  let largest = inputArray[0];
  let secondLargest = inputArray[1];

  for (let i = 2; i < inputArray.length; i++) {
    if (inputArray[i] > largest) {
      secondLargest = largest;
      largest = inputArray[i];
    } else if (inputArray[i] > secondLargest && inputArray[i] !== largest) {
      secondLargest = inputArray[i];
    }
  }
  console.log("2-katta raqam:", secondLargest);
  return secondLargest;
}
