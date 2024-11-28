const DAYS = 6;
const LIMIT = 30;
let studentReport = [11, 42, 33, 64, 29, 37, 44];

//for loop
for (let i = 0; i < studentReport.length; i++) {
    if (studentReport[i] < LIMIT) {
        console.log(i);
    }
}
//while loop
let i = 0;
while (i < studentReport.length) {
    if (studentReport[i] < LIMIT) {
        console.log(i);
    }
    i++;
}
//forEach loop
studentReport.forEach((score, index) => {
    if (score < LIMIT) {
        console.log(index);
    }
});
//for..in loop
for (let i in studentReport) {
    if (studentReport[i] < LIMIT) {
        console.log(i);
    }
}
//Days loop
const today = new Date();
const nextDays = [];

for (let i = 0; i < DAYS; i++) {
    const nextDate = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
    nextDays.push(nextDate.toLocaleDateString('en-US', { weekday: 'long' }));
}
console.log(nextDays);