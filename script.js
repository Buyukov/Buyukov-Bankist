'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount, controlTimer ;

//----------------------------------------------------//
const createUserNames = function(accs) {
  accs.forEach(acc => { acc.username = acc.owner.toLowerCase().split(' ').map((name) => name[0]).join('');}) // Arrow Function qilingan.
};
createUserNames(accounts);
//----------------------------------------------------//


//----------------------------------------------------//
const calcPrintBalance = function(acc) {
  acc.balance = acc.movements.reduce((sum, val) => sum + val, 0);
  labelBalance.textContent = `${acc.balance}€`
};
//----------------------------------------------------//


//----------------------------------------------------//
const displayMovements = function (movements, sort = false) {

  // containerMovements.innerHTML = "";

  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

  const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">${mov}€</div>
        </div>
      `;

      containerMovements.insertAdjacentHTML("afterbegin", html); // afterbegin, afterend, beforebegin, 
  });
};

displayMovements(account1.movements);
//----------------------------------------------------//


//-------------------------- IMPLEMENTING SORT --------------------------//
let sorted = false
btnSort.addEventListener('click', function() {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//-----------------------------------------------------------------------//



//----------------------------------------------------//
const calcDisplaySummary = function(acc){
 const incomes = acc.movements
 .filter(val => val > 0)
 .reduce((sum, val) => sum + val, 0) //Reduce umumiy sonlar yig'indisini topishda ishlatiladi.

 const outcomes = acc.movements
 .filter(val => val < 0)
 .reduce((sum, val) => sum + val, 0);

 const interest = acc.movements
 .filter(val => val > 0)
 .map(val => val * acc.interestRate / 100)
 .filter(val => val >= 1)
 .reduce((sum, val) => sum + val, 0);


 labelSumIn.textContent = `${incomes}€`;
 labelSumOut.textContent = `${Math.abs(outcomes)}€`;
 labelSumInterest.textContent = `${interest}€`;
};
//----------------------------------------------------//


//---------------------- IMPLEMENTING LOGIN ------------------------//
btnLogin.addEventListener('click', function(event) {
  event.preventDefault(); // Formni hususiyatlarini o'chiradi


currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
console.log('CurrentAccount:', currentAccount);

// check if user exists

if (currentAccount && currentAccount.pin === +inputLoginPin.value){
  // Welcome Message 
  printWelcome(`${currentAccount.owner.split(' ')[0]}`);

  // Display Balance
  calcPrintBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);

  // Display Movements
  displayMovements(currentAccount.movements);

  //Display UserInterface
  containerApp.style.opacity = 1;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
} else {
  alert(`This user is not found. Please check your username and pin`);
}

  // Timer
  if (controlTimer) clearInterval(controlTimer);
  controlTimer = startLogoutTimer();
 
});
//----------------------------------------------------------------//


//------------- Date --------------//
const current = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "2-digit", //numeric, 2-digit, short
  year: "numeric", //numeric, 2-digit
  weekday: "long"  //long, shot, narrow
};
labelDate.textContent = new Intl.DateTimeFormat(navigator.language, options).format(current);
//--------------------------------------------------------------------//
     


//---------------------- IMPLEMENTING TRANSFERS ------------------------//
btnTransfer.addEventListener('click', function(event) {
  event.preventDefault(); // Formni Avto refresh funcsiyasiyam o'chadi.

  const recieverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = +inputTransferAmount.value; // Pul transferiga javob beradigan codelar.

  /*
  1. Amount =< currentAccount.balance
  2. Amount > 0
  3. RecieverAccount teng bo'lmasligi kerak Undefined
  4. RecieverAccount.username teng bo'lmasligi kerak currentAccount.Username
  */

if (amount > 0 
  && amount <= currentAccount.balance 
  && recieverAccount 
  && recieverAccount.username != currentAccount.username) {
  recieverAccount.movements.push(amount);
  currentAccount.movements.push(-amount);

  // Display Balance
  calcPrintBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);

  // Display Movements
  displayMovements(currentAccount.movements);

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
} else {
  if (amount < 0 || amount > currentAccount.balace) alert('Please enter valid amount');
else if (!recieverAccount) alert('Please enter valid reciever account username');
else if(recieverAccount.username === currentAccount.username) alert('You are not allowed to send money to your self')
}

// Restart timer
clearInterval(controlTimer);
controlTimer = startLogoutTimer();

});
//------------------------------------------------------------------------------------//



//--------------------- IMPLEMENTING CLOSE ACCOUNT --------------------------//
btnClose.addEventListener('click', function(event) {
  event.preventDefault();

  const username = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (username === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === username);
    // Delete account
    accounts.splice(index, 1);

    labelWelcome.textContent = 'Log in to get started';

    // Hide User Interface
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;

    // STOP TIMER
    clearInterval(controlTimer);

  }


});


//--------------------- IMPLEMENTING LOAN ---------------------------//

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

setTimeout(() => {
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add amount to movements
    currentAccount.movements.push(amount);

  // Display Balance
  calcPrintBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);

  // Display Movements
  displayMovements(currentAccount.movements);
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();

  // Restart timer
  clearInterval(controlTimer);
  controlTimer = startLogoutTimer();

}, 3000); 


});
//------------------------------------------------------------------------/



//--------------------- Logout Timer -------------------//
const startLogoutTimer = function() {

  // set time to 5 minutes
  let time = 300;

  const tick = () => {
    // In each call, print the remaining time to UI
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}: ${sec}`;
  
    
  
      // When 0 second, stop timer and log out user
      if (time === 0) {
        clearInterval(timer);
        labelWelcome.textContent = `Log in to get started`;
        containerApp.style.opacity = 0;
      };
  
      // Decrease is
      time--;
  
    };

    tick();

  // call the timer every second
const timer = setInterval(tick, 1000);
return timer
};
//--------------------------------------------------------------//


//------------------- Print Greeting ----------------------//
const printWelcome = function (name) {
  const now = new Date();
  const greetings = new Map([
    [[6, 7, 8, 9, 10], 'Good Morning'],
    [[11, 12, 13, 14], 'Good Day'],
    [[15, 16, 17, 18], 'Good Afternoon'],
    [[19, 20, 21, 22], 'Good Evening'],
    [[23, 0, 1, 2, 3, 4, 5], 'Good Night'],
  ]);

  const arr = [...greetings.keys()].find(key => key.includes(now.getHours()));
  const greet = greetings.get(arr);
  labelWelcome.textContent = `${greet}, ${name}!`;
};
//---------------------------------------------------------//


//----------------------------------------------------------------
// const formatCur = function (locale, currency, value) {
//   return new Intl.NumberFormat(locale, {
//    style: "currency",
//    currency
//   }).format(value);
// };
//----------------------------------------------------------------

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//  const arr = ['a', 'b', 'c', 'd', 'e'];

//-------- SLICE -------- // SLICE bilan arrayga tasir o'tqazilsa Asil arrayga tasir qilmaydi.
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2)); 
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

//------- SPLICE (MUTATE) ------- // SPLICE bilan arrayga tasir o'tqazilsa Asil arrayga tasir o'tkazib o'zgartirib qo'yadi.
// console.log(arr.splice(1, 3)); // Spliceda birinchi nechidan boshlab olishi yoziladi keyin o'zi bilan hisoblaganda nechta olishi kerakligi yoziladi.
// console.log(arr);
// console.log(arr.splice(-1));
// console.log(arr);

//------- REVERSE --------// // reverse ham original arrayni ta'sir o'tkazib o'zgartiradi.
// const arr2 = ['j', 'i', 'h', 'g', 'f']; 
// console.log(arr2.reverse()); // reverse array itemlarini teskarisiga qo'yib beradi.
// console.log(arr2);
// console.log(arr2.splice(2, 2));

//------- CONCAT ---------// // Ikkta arrayni bitta arrayga qo'shib yuboradi va bitta katta array hosil qiladi. spread operatorga o'xshaydi. 
// const arr2 = ['j', 'i', 'h', 'g', 'f']; 
// const letters = arr.concat(arr2);
// // console.log(letters);

// // console.log([...arr, ...arr2]); // Spread operator bilan qilish.

// // //------- JOIN ---------//
// console.log(letters.join(' '));
// console.log(letters.join());

// //------- AT Method ---------// //Array ichidan at bilan ma'lumot olinsa asosiy arrayni o'zgartirib yubormaydi.
// const arr1 = [23, 15, 64];

// console.log(arr1[0]);
// console.log(arr1.slice(0, 1)[0]);

// console.log(arr1.at(0)); // at bizga arrayni ichidan biror bir ma'lumotni olishga yordam beradi.

// // Array ichidan eng ohirgi ma'lumotni olish usuli.
// console.log(arr1[arr1.length - 1]);
// console.log(arr1.slice(-1)[0]); // Bu yerda [0] son qib berayabdi u siz array ko'rinishida chiqadi slicening ichidan.
// console.log(arr1.at(-1)); // at bilan array ichidan eng ohirgi ma'lumotni olish.

// console.log('Dilmurod'.at(1)); // at stringlar bilan ham ishlayveradi.

// //--------- ForEach ----------//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for(const [i, movement] of movements.entries()) {
//   if(movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`); // Math.abs - dagi sonlarni - dan chiqarib beradi.
// };

// movements.forEach(function(movement, i){
//   if(movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
// }); 

//--------- new Mapda forEach ishlashi -----------//
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key) {
//   console.log(`${key}: ${value}`);
// });


//---------- new Set forEach ishlashi ------------//
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// currenciesUnique.forEach(function(value, key){
//   console.log(`${key}: ${value}`);
// }); // new Set larda value bilan keylarni qiymati bitta narsa bo'ladi va keylar bo'lmaydi disakham bo'ladi.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

/*
Coding Challenge #1
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
about their dog's age, and stored the data into an array (one array for each). For
now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
ages from that copied array (because it's a bad practice to mutate function
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
🐶
")
4. Run the function for both test datasets
Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
Hints: Use tools from all lectures in this section so far 😉
GOOD LUCK 😀
*/
//---------------------------------------- Coding Challenge #1 Answers -------------------------------------//
// const julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 4, 8, 3];

// const checkJulia = julia.slice(1, 4);
// console.log(checkJulia);

// const collectedAges = checkJulia.concat(kate);
// console.log(collectedAges);

// collectedAges.forEach(function(collectedAges, i){
//   if(collectedAges > 3) console.log(`Dog number ${i + 1} is an edult and is ${collectedAges} years old.`)
//   else console.log(`Dog number ${i + 1} is still a puppy🐶 and is ${collectedAges} years old.`)
// });
//----------------------------------------------------------------------------------------------------------//


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//------------- Map Method --------------// Siz qanaqadur amal bajarasiz arrayning har bitta itemi bilan o'sha bajarilgan
// amaldan hosil bo'ladigan yangi qiymatlarni Map o'zi yangi bir array yasaydi va uning ichiga yig'ib boradi. 
// Va bizga o'sha tayyor bo'lgan yig'ilgan katta arrayni return qib beradi va biz uni bitta veriablega saqlab
// u bilan ish qilishimiz mumkun. Mapning hususiyati shunaqa.

// const euroToUsd = 1.2;

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUsd = [];

// movements.forEach(function(value) {
//   movementsUsd.push(value * euroToUsd);
// });
// console.log(movementsUsd);

// const movementsUsd = movements.map(function(value) {
//   return value * euroToUsd;
// });
// console.log(movementsUsd); // Bu yerda movementsUsd ga o'zimiz push qilmayabmiz u ishni .map ning o'zi qilyabdi. 

// const movementsUsd = movements.map( value => value * euroToUsd); // Arrow functionda ishlatish.
// console.log(movementsUsd);
//-------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
// const user = 'Steven Thomas Williams';

// const userName = user.toLowerCase().split(' ').map(function(name) {
//   return name[0]
// });
// console.log(userName.join(''));


// userNameni Dinamic  qilish va qilingani.
// const createUserNames1 = function(user) {
//   return user.toLowerCase().split(' ').map((name) => name[0]).join(''); // Arrow Function qilingan.
// };
// const username = createUserNames1(user);
// console.log(username);
//--------------------------------------------------------------------------------

//----------------- Filter Method -----------------//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposite = [];

// movements.forEach(function(value) {
//   if(value > 0) deposite.push(value);
// });
// console.log(deposite);

// // movements.forEach(movement => {
// //   if (movement > 0) {
// //    deposite.push(movement) 
// //   }

// // });

// // Without Filter Method But with a Arrow Function.
// console.log(deposite);                                                                                                   

// const deposits = movements.filter(function(val) {
//   return val > 0;
// }); //Filterning hususiyati biz yasayotgan conditiondan yani bu yerdagi solishtiruvdan true qiymat chiqsa oladi.
// console.log(deposits);

// const withdrawals = movements.filter(function(val) {
//   return val < 0;
// }); //Filterning hususiyati biz yasayotgan conditiondan yani bu yerdagi solishtiruvdan true qiymat chiqsa oladi.
// console.log(withdrawals);
//--------------------------------------------------//

//----------------- Reduce Method -----------------//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const useingReduceMethod = movements.reduce((sum, value) => sum + value, 0);
// console.log(useingReduceMethod);


// let sum = 0;

// for (const mov of movements) {
//   sum += mov;
// };
// console.log(sum); // For of bilan raqamlarni yig'indisini chiqarish


// movements.forEach(function(value) {
//   sum += value
// });
// console.log(sum); forEach bilan raqamlarni yig'indisini chiqarish

// const balance = movements.reduce(function(sum, val) {
//   return sum + val;
// }, 0);
// console.log(balance); // reduce bilan raqamlarni yig'indisini chiqarish

//----------------------------------------------------------------------------------------------
// .reduce((sum, val) => sum + val, 0)
//----------------------------------------------------------------------------------------------

// var numbers1 = [45, 4, 9, 18, 25];
// var sum = numbers1.reduce(myFunction);

// function myFunction(total, value) {
//   return total + value;
// }
// console.log(sum);

// Maximum value
// const max = movements.reduce((max, val) => {
//   if (max < val) return val;
//   else return max;
// }, movements[0]);
// console.log(max);


/* 
Coding challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
ages ('ages'), and does the following things in order:
1. Calculate the dogs age in human years using the following formula: if the dog is =< 2 years old,
humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (You should already know 
from other challenges how we calculate averages.)
4. Run the function for both test datasets
Test data: 
Data 1: [5, 2, 4, 1, 15, 8, 3]
Data 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK
*/

//----------------- THE MAGIC OF CHAINING METHODS ------------------//
// const euroToUsd = 1.1;

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const depositBalance = movements
// .filter(val => val > 0)
// .map(function(val, _, arr) {
//   return val * euroToUsd;
// })// Function ichiga keladigan argumentlarning tartibi juda muhim ro'l o'ynaydi. 
// .reduce((sum, val) => sum + val, 0); // Bu yerda chaining method bo'lgan ko'p methodlar ulab ishlangan.
// console.log('depositeBalance:', depositBalance);

// .Filter .map .reduce hammasida return qo'yish shart 
//------------------------------------------------------------------

/* 
CODING CHALLENGE 3#

Rewrite the 'calcAverageHumanAge' function 
from the previous challenge, but this time 
as an arrow function, and using chaining!
*/




//----------------------------------------------------------------------------------------

// const testSplit = `'Dilmurod Buyukov Dilshod O'g'li `;
// const sliptedString = testSplit.split(' ');
// console.log(sliptedString);
// console.log(sliptedString.join(' '))

//----------------------------------------------------------------------------------------

//-------------- THE FIND METHOD -------------//

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const firstWithdrawal = movements.find(function(value) {
//   return value < 0;
// });
// console.log('FirstWithdrawal:', firstWithdrawal);
// // Find ning hususiyati biz bergan shartni birinchi shu array ichidagi itemlarni qaysi biri birinchi
// // shu berilgan shartni qanoatlantirsa o'sha qiymatni return qib beradi find.

// const checkfind = movements.find(function(value) {
//   return value < 300;
// });
// console.log(checkfind);

// const acc = accounts.find(account => account.owner === 'Jessica Davis');
// console.log(acc);
//--------------------------------------------//

//-------------- THE FINDINDEX METHOD ----------------//

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const index = movements.findIndex((value) => value === 3000);
// console.log(index); // Find method Index raqamini aniqlashga yordam beradi indexOf dan buni farqi bu functionda ko'plab ish bajarsak bo'ladi.
 
// const indexOf = movements.indexOf(3000);
// console.log(indexOf); // IndexOf bilan index raqamini aniqlash. IndexOfda ichiga faqatgina bitta qiymatni jo'nata olamiz bu yerda hech qanaqa logiga qilib bo'lmaydi.


//-------------- SOME and EVERY methods ---------------//
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const testFilter = movements.filter(val => val > 0);
// console.log(testFilter);

// console.log(movements);

// // EQUALITY
// console.log(movements.includes(-200)); // Array ichidan o'sha ma'lumot borligini aniqlash bo'sa true bo'lmasa false

// // CONDITION 
// console.log(movements.some((val) => val > 1000)); // Array ichidan o'sha ma'lumot borligini aniqlash bo'sa true bo'lmasa false

// // EVERY
// console.log(account4.movements.every(mov => mov > 0)); // Everyda shart beriladi o'sha shart bo'yicha array ichida hammasi true bo'lsa true chiqadi.  


// // SEPARATE CALLBACK
// const deposit = function (mov, index, arr) {
//   return mov > 0;
// };

// console.log(movements.some(deposit)); 
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
//------------------------------------------------------//


//------------------------------- FLAT AND FLATMAP ------------------------------//
// const arr = [[1, 2, 3], [4, 5, 6, [7, 8, [9, 10, [11, 12, [13, 14]]]]], 7, 8]; // Flat Array ichida yana ko'pgina arraylar bo'lsa bitta arrayga jamlab beradi.

// console.log(arr.flat(5)); // flat ichiga jo'natilayotgan raqam array ichida yig'ilib qolgan qauslar yig'indisidan kelib chiqib yoziladi.

// FLAT
// const flat = accounts.map(acc => acc.movements).flat().reduce((sum, val) => sum + val, 0); // Array ichidagi arraylar hammasi bitta arrayga saqlanib qo'shildi.
// console.log(flat);

// // // FLATMAP
// const flatMap = accounts
// .flatMap(acc => acc.movements) // Birinchi map qilib aylanib chiqib yangi array yasaydi va ketin flat vazifasini bajaradi.
// .reduce((sum, val) => sum + val, 0);

// console.log(flatMap);
//--------------------------------------------------------------------------------//


// //---------------------------- SORTING ARRAYS ---------------------------//
// // String (sort Mutates original array) // Original arrayga tasir qiladi.
// const owners = ['Jonsa', 'Zach', 'Adam', 'Martha', 'Abama'];

// console.log(owners.sort()); // Sort Alfavit ketma ketligida joylashtiradi. 
// console.log(owners);

// // Numbers
// const movements = [200, 450, 450, -400, 3000, -650, -130, 70, 1300];

// // return > 0, B, A (Switch order)
// // return < 0, A, B (keep order)

// console.log(movements.sort((a, b) => {
//   // Ascending
//   // if (a < b) return -1;
//   // if (a > b) return 1;

//   // Descending
//   if (a > b) return -1;
//   if (a < b) return 1;
// }));

// const sorts = movements.sort((a, b) => {
//   return a - b;
// });
// console.log(sorts);
 


// //--------------------------- MORE WAYS OF CREATING AND FILLING ARRAYS ---------------------------//
// const arr = [1, 2, 3, 4, 5];
// console.log(new Array(1, 2, 3, 4, 5));

// // new Array Method 
// const x = new Array(7); // new Array bu yerda ichiga 7 raqami kiritilgani uchun 7 ta bo'sh joylik array yaratayabdi.
// console.log(x.fill(1, 3, 5)); // fill bu yerda bo'sh o'rinlarga son qo'yish uchun ishlatilyabdi. // birinchi beriladigani ma'lumot ikkinchisi qaysi indexdan berib boshlashi uchinchisi qaysi indexda to'xtashi.

// // array.from Method
// const y = Array.from({ length: 7}, (val, i) => i + 1);
// console.log(y);
//---------------------------------------------------------------------------------------------------//



//----------------- ARRAY METHOD PRACTICE ---------------//

//--------
// const bankDepositSum = accounts
// .flatMap(acc => acc.movements)
// .filter(mov => mov > 0)
// .reduce((sum, val) => sum + val, 0);

// console.log('BankDepositSum:', bankDepositSum);
// //--------


// //--------
// const numDeposits1000 = accounts
// .flatMap(acc => acc.movements)
// .filter(mov => mov >= 1000).length;

// console.log(numDeposits1000);
// //--------


// //--------
// const { deposit, withdrawal} = accounts
// .flatMap(acc => acc.movements)
// .reduce((sum, mov) => {
//    mov > 0 ? sum.deposit = sum.deposit + mov : sum.withdrawal = sum.withdrawal + mov;
//    return sum;
// }, {deposit: 0, withdrawal: 0 });
// console.log(deposit);
// console.log(withdrawal);
//--------





/* 
Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are
eating too much or too little.
Eating too much means the dog's current food portion is larger than the
 recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10%
below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs" array containing dog objects, and for each dog, calculate\
the recommended food portion and add it to the object as a new property. Do
not create a new array, simply loop over the array. Forumla:
recommendedFood = weight ** 0. 75 * 28. (The result is in grams of
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose)
3. create an array containing all owners of dogs who eat too much
('ownersEatTooMuch*) and an array with all owners of dogs who eat too little
('ownersEatTooLittle')
4. Log a string to the console for each array created in 3., like this: "Matilda and 
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food
(try to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects)

Hints: 
!. Use many different tools to solve these challenges, you can use the summary
lecture to choose between them.
!. Being within a range 10% above and below the recommended portion means:
current > recommended * 0.99) && current < (recommended * 1.10).
Basically, the current portion should be  between 90% and 110% of the recommended portion.
Test data:
Good luck.!
*/

// const dogs = [
//   { weight: 22, curFood: 250, owner: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owner: ['Matilda'] },
//   { weight: 13, curFood: 275, owner: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owner: ['Michael'] }
// ];


/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//---------------------------------------------- NUMBER AND DATES -------------------------------------------------//

// Conversion // String numberni real numberga aylantirish
// console.log(Number('20'));
// console.log('20' * 1);
// console.log(+'20');

// // Parsing 
// console.log('30px'.slice(0, -2));

// console.log(Number.parseInt('121uz')); // .parseInt stringdagi boshida kelgan hamma raqamni olib beradi faqat raqamlar boshida kelgan bo'lishi kerak.

// console.log(Number.parseFloat('21.6')); // String number 21.5 ko'rinishida kelsa .parsFloat butunligicha olib beradi.


// // Check if value is Number // Berilayotgan qiymat raqam yoki raqam masligini tekshirish.
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(20.2));
// console.log(Number.isFinite(20 / 0));
// console.log(Number.isFinite(10 / 3));


//--------- Math and Rounding ---------//
// console.log(Math.sqrt(25));

// Kvadratga ko'tarish
// console.log(2 ** 3); // => 2 * 2 * 2
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// // .max .min 
// console.log(Math.max(5, 18, 23, 200, 34)); // .max sonlar ichidan eng katta qiymatni olib beradi.
// console.log(Math.min(5, 18, 23, 200, 34)); // .min sonlar ichidan eng kichkina qiymatni olib beradi.
//--------------------------------------------------------------------------------------------------------------//


//----------------------------------------------------------------------//
// // Random Number
// console.log(Math.trunc(Math.random() * 10) + 1); // Random son chiqarish.
//------------------------------------------------------------------------------------//


// //-------- Rounding integers -----------//
// console.log(Math.trunc(23.7)); // trunc har doim butun qismini olib beradi.

// console.log(Math.round(23.3)); // .round 23.4 bo'lsa ham 23 ni beradi agar 23.5 va undan yuqori bo'sa 24 ni beradi.
// console.log(Math.round(23.6));

// console.log(Math.ceil(23.00001)); // .ceil butun son yozilsa o'shani oladi lekin butun sondan 0.1 o'tib ketsa undan keyingi keladigan sondi oladi masalan 23 kesa 23ni oladi lekin 23.1 kesa 24ni oladi.

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));
//-------------------------------------------------------------------------------------------------------------//


//------------                  --------------//
// Faqat Berilgan ikkta raqam oralig'ida random raqam chiqarib beradigan Logica.

// const randomInt = function (min, max) {
//   return Math.trunc(Math.random() * (max - min + 1)) + min;
// };
// console.log(randomInt(6, 11)); // 6 va 11 sonlari ichida random raqam qidiradi.
//----------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------------//
// Rounding decimals // .toFixed nuqtadan so'ng qanchadur raqam olinishi kerak bo'lsa ishlatiladi
// console.log((2.700000).toFixed(0));
// console.log((2.700000).toFixed(1)); // .toFixed( ) ichiga nuqtadan so'ng nechta son olishi kirgiziladi.
// console.log((2.76).toFixed(1));
// console.log((2.76).toFixed(2));
// //-----------------------------------------------------------------------------------------------------------------//  


// //----------------- THE REMINDER OPERATOR ---------------//
// console.log(5 % 2); // Qoldiqni chiqarish
// console.log(8 % 3); // % Belgisi qoldiqni chiqarish uchun ishlatiladi.

// const isEven = function (n) {
//   return n % 2 === 0;
// };

// console.log(isEven(23));
// console.log(isEven(20));


// //------- JavaScript Hisoblay oladigan raqam qiymati -------//
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER); // Bu sondan keyingi sonlar bo'lsa JavaScript hisoblashda adashadi.

// // Agar JavaScript bu sondanam katta raqamni to'g'ri hisoblashini hohlasak BigInt() ni ichida hisob kitobni amalga oshirishimiz kerak.
// const bigNum = BigInt(2 ** 53);
// console.log(bigNum + BigInt(2 ** 53)); // BigInt() qiymatiga faqat shu BigInt() qiymatini bir biriga qo'sha olamiz.

// console.log(20n); // Raqam ohiriga n harfini qo'shsak bu raqam ham BigInt qiymatini oladi typeOf da typeini ko'rsa BigInt chiqadi.
//---------------------------------------------------------------------------------------------------//



//------------------- CREATING DATES --------------------//
// const now = new Date();
// console.log(now);

// console.log(new Date('Thu sep 7 2020'));
// console.log(new Date('December 31 2022'));

// console.log(new Date(account1.movementsDates[1]));

// console.log(new Date(2023, 0, 18, 15, 14, 12)); // 1)Yil 2)OY 3)SANA 4)SOAT 5)MINUT 6)SIKUND

// console.log(new Date(0)); // new Dateni ichiga 0 yuborilsa birinchi kalendan ishlagan sana vaqtni chiqarib beradi.

// console.log(new Date(3 * 24 * 60 * 60 * 1000));

//------- WORKING WITH DATES -------//
// const future = new Date(2023, 10, 19, 15, 31, 5);
// console.dir(future);
// console.log(future.getFullYear()); // Faqatgina Yilni o'zini olish
// console.log(future.getMonth());
// console.log(future.getDate()); // Faqatgina Sanani o'zini olish
// console.log(future.getDay()); // Hafta kunini olish 0 bu yakshanba bo'ladi 1 esa dushanba 2 seshanba...
// console.log(future.getHours());
// console.log(future.getMinutes());

// console.log(future.toISOString());

// future.setFullYear(2024); // futureni ichidagi yilni tashqaridan o'zgartirish
// console.log(future);



//---------------------               --------------------//
// const now = new Date();
// const year = now.getFullYear();
// const month = `${now.getMonth()}`.padStart(2, 0); // Bu yerda .padStart(2, 0) 2 bu yerda ikki honali son bo'lishi yetmasa 0 qushib berish vazifasini bajaryabdi.
// const date = `${now.getDate()}`.padStart(2, 0);
// const hour = `${now.getHours()}`.padStart(2, 0);
// const minut = `${now.getMinutes()}`.padStart(2, 0);
// const second = `${now.getSeconds()}`.padStart(2, 0);

// const data = `${date}/${month}/${year}, ${hour}:${minut}:${second}`;
// console.log(data);


// //---------- toLocalDateString() ---------//
// console.log(new Date().toLocaleDateString()); // Tepadagi qilingan ishlarni ossonroq yasash usuli
// //---------------------------------------------------------------------------------------------------//


//--------- IKKTA SANANI BIR BIRIDAN AYIRIB NECHI KUN FARQ BOR EKANLIGINI ANIQLASH ----------//
// const future = new Date(2038, 11, 15, 15, 23); // Oldiga + qo'ysa mili sekundga aylantirib beradi.

// const calcDaysPassed = function(date1, date2){
//   return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
// };
// console.log(calcDaysPassed(+future, new Date(2038, 11, 10)));
//-------------------------------------------------------------------------------------------//

//------------ intl ---------------//
// const current = new Date();

// const options = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "2-digit", //numeric, 2-digit, short
//   year: "numeric", //numeric, 2-digit
//   weekday: "long"  //long, shot, narrow
// };
// labelDate.textContent = new Intl.DateTimeFormat(navigator.language, options).format(current); // navigator.language koputer browserida qanaga language turgan bo'lsa oshanga aylantirib beradi
//----------------------------------------------------------------------------------------------------//


//-------------- INTERNATIONALIZING NUMBER (intl) ----------------//
// const num = 234500.12;

// const options = {
// style: "currency",
// unit: "kilogram", //Agar style ichiga unit berilsa: mile-per-hour, percent, celsius, kilogram
// currency: "USD", // EUR, USD
// };

// console.log('USA:', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Arabic:', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('Korea:', new Intl.NumberFormat('ko-KR', options).format(num));
// //-------------------------------------------------------------------------------------//


// setTimeout(() => {
//   console.log("Interval is working");
// }, 1000);

// setInterval(() => {
//   console.log("Interval is working");
// }, 1000);


//------------------------- TIMERS: setTimeOut and setInterval -------------------------/
// const ing3 = [`Sausage`, `Mushroom`];

// // setTimeOut 
// setTimeout((ing1, ing2, ing3, ing4) => {
//   console.log(`Here is your pizza with ${ing1}, ${ing2}, also ${ing3}, ${ing4}`);
// }, 3000, 'cheese', 'onions', ...ing3);  

// clearTimeout(); // clearTimeout() bu setTimeoutni Butunlay to'htatish uchun

// // setInterval
// const intervalId = setInterval(() => {
//   console.log(new Date());
// }, 1000);

// clearInterval(intervalId); // clearInterval() bu setIntervalni Butunlay to'htatish uchun
//-----------------------------------------------------------------------------------------------//

//------------ A Little practice with .Find Method ------------/
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const testFindMethod = movements.find(function(value){
//  return value > 0 && value < 200
// });
// console.log(testFindMethod)

// //------------ A Little practice with .Filter Method ------------/
// const testFilterMethod = movements.filter(function(value){
// return value > 0
// });
// console.log(testFilterMethod);




