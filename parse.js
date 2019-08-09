const pdf = './doc.pdf';
const fs  = require('fs');
const pdfReader  = require('pdf-parse');

let data = fs.readFileSync(pdf);

pdfReader(data).then(data => {
  //console.log('# pages: ',data.numpages);
  let allData = (data.text);
  let z = allData.split('STREET')
  //.split('STREET').join('').split('SIDE').join('').split('STREET SWEt . ER SCHEDULE \n DAY').join('').split('ROUTE FREQUENCY').join('').split('SIGNED BIWEEKLY').join('').split('TIME').join('').split('Page Nurr \n ORDER ')
  let streetNumber = z[0];
  streetNumber = (streetNumber.slice(41,)).trim().split('\n');

  let streets = (allData.split('SIDE')[0]).split('STREET')[1].trim().split('\n');
  let cleanUpTheStreets = () => {
    //Best way to tell if issue is to look at all the streets and if one starts off like 'ST' or 'AVE'
    //then you find the one before it, add them both together and delete previous.
    let stNames = ['ST ', 'AVE ', 'WAY ', 'ROAD ', 'CT ', 'DR ', 'BLVD ', 'PL ', 'LN '];
    for (let i=0; i<streets.length; i++) {
      if (stNames.includes(streets[i])){
        streets[i-1] = streets[i-1] + streets[i]
        streets[i] = null;
      }
    }
    x = streets.filter(item => item != null);
    return x;
  }
  streets = cleanUpTheStreets();


  let side = (allData.split('DAY')[0]).split('SIDE')[1].slice(0,188).trim();
  let strDay = ''
  let day = allData.split('ROUTE')[0].split('DAY')
  day[0] = null;
  for (let i=1; i<day.length; i++){
    strDay+=(day[i])
  }
  strDay = strDay.trim().split('\n');
  let frequency = allData.split('SIGNED')[0].split('FREQUENCY')[1].trim().split(' ')
  let frequencyStr = '';
  for (let i=1; i<frequency.length; i++){
    if (i % 2 != 0){
      frequencyStr+=(frequency[i] + '\n')
    }
  }
  frequencyStr = frequencyStr.split('\n')
  let biweekly = allData.split('TIME')[0].split('BIWEEKLY')[1].trim().split(' ');
  let biweeklyStr = '';
  for (let i=1; i<biweekly.length; i++){
    if (i % 2 != 0){
      biweeklyStr+=(biweekly[i] + '\n')
    }
  }
  biweeklyStr = biweeklyStr.split('\n')

  let removeEmptyStrFromArray = (arr) => {
    x = arr.filter(item => item != '')
    return x;
  }

  biweeklyStr = removeEmptyStrFromArray(biweeklyStr);
  frequencyStr = removeEmptyStrFromArray(frequencyStr);
  streets = cleanUpTheStreets(streets)

  let time = allData.split('ORDER')[0].split('TIME')[1].trim().split('\n')
  time.pop();
  //time = time.


  let fixSides = () => {
    //Split it up so we get the individual ele in array
    let split = (side.split('\n'));
    //Loop over all ele in array
    for (let i=0; i<split.length; i++){
      //If an ele is neither even nor odd
      if (!(split[i] === 'EVEN ' || split[i] === 'ODD ')){
        if (split[i] + split[i+1] === 'EVEN ' || split[i] + split[i+1] === 'ODD '){
          split[i] = split[i] + split[i+1];
          split[i+1] = null;
        }
        if (split[i] + split[i-1] === 'EVEN ' || split[i] + split[i-1] === 'ODD '){
          split[i] = split[i] + split[i-1];
          split[i-1] = null;
        }
        if (split[i] === 'O' && split[i+1] == "DD"){
          split[i] = split[i] + split[i+1];
          split[i+1] = null;
        }
      }
    }
    x = split.filter(item => item != null);
    return x;
  }
  let sides = fixSides();

  //St # = 33, Sts = 34 (cleanUpTheStreets = 33) , side = 33, strDay = 33,
  //freq=34( removeEmptyStrFromArray(frequencyString))
  //biweek=34(  removeEmptyStrFromArray(biweeklyStr)), time=34(4:00 , AM - 5:30AM)

  //console.log(streets);

  let table = '';
  let length = (streets.length);
  for (let i=0; i<length; i++){
    let smallArr = [];
    smallArr.push(streetNumber[i], streets[i], sides[i], strDay[i], frequencyStr[i], biweeklyStr[i], time[i]);
    table+=smallArr+'. ';
  }
  console.log(table);
  return table;
})
.then(x => {
  fs.writeFileSync("data.txt", x, err => {
  if (err) {
    throw err;
  } else {
    console.log('Mission accomplished');
  }
  })
})








