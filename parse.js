const pdf = './doc.pdf';
const fs  = require('fs');
const pdfReader  = require('pdf-parse');
//const pdfData = require("./data.txt");

let data = fs.readFileSync(pdf);

pdfReader(data).then(data => {
  let allData = (data.text);
  let newData = (allData.split("Office"))
  let string = "";
  let entirity = [];

  for (let i=1; i<newData.length; i++){

    //console.log('THIS IS : ', i, newData)

    // console.log(data.text);
    // console.log(allData);
    let z = newData[i].split('STREET')
    //console.log(s);
    let streetNumber = z[0];
    streetNumber = streetNumber.split("BLOCK")[1].trim().split("\n");
    //New function that sorts through all the numbers,
    //Hard to do properly because you probably could have an address w/ 5 as the st.# but
    //dont think in alameda.
      //Loop through array, check if number has a space at the end.
      //If it doesn't have a space then combine that one w/ one below it, del one below.
      //But the last one will not have a space @ end so ignore.
      //Remember to filer out null values.
    let stNumFilter = () => {
      for (let i=0; i<streetNumber.length; i++){
        if (streetNumber[i] != null){
          if (!streetNumber[i].endsWith(' ') && i != (streetNumber.length - 1)){
            streetNumber[i] = streetNumber[i] + streetNumber[i+1];
            streetNumber[i+1] = null;
          }
        }
      } return streetNumber.filter(item => item != null);
    }
    streetNumber = stNumFilter(streetNumber);

    //streetNumber = (streetNumber.slice(41,)).trim().split('\n');
    //console.log(streetNumber);
    //entirity.push(streetNumber);
    //console.log('st#: ',streetNumber, 'len: ', streetNumber.length);

    let streets = (newData[i].split('SIDE')[0]).split('STREET')[1].trim().split("\n")

    let cleanUpTheStreets = () => {
      //Best way to tell if issue is to look at all the streets and if one starts off like 'ST' or 'AVE'
      //then you find the one before it, add them both together and delete previous.
      for (let i=0; i<streets.length; i++) {
        if (streets[i] != null) {
          if (!streets[i].endsWith(" ") && i != (streets.length - 1)){
            streets[i] = streets[i] + streets[i+1];
            streets[i+1] = null;
          }
        }
      } streets = streets.filter(item => item != null);

      //Now with this you need to check if one of the street[i] is just an item from stNames.
        //If it is then do above.

      //Check the last index, but last index will have no space at the end.

      let stNames = ['ST ', 'AVE ', 'WAY ', 'ROAD ', 'CT ', 'DR ', 'BLVD ', 'PL ', 'LN ', 'RD ', 'ISLE '];
      let trimStNames = stNames.map(item => item = item.trim());
      for (let i=0; i<streets.length; i++){
        if (stNames.includes(streets[i])){
          streets[i-1] = streets[i-1] + streets[i];
          streets[i] = null;
        }
        streets = streets.filter(item => item != null);
      }
      if (trimStNames.includes(streets[streets.length-1])){
        streets[streets.length-1-1] = streets[streets.length-1-1] + streets[streets.length-1];
        streets[streets.length-1] = null;
      }
      streets = streets.filter(item => item != null);



      //console.log('nSt: ', streets);

      //Bonus~~~~
        //Look at the one above you're at -> i-1
        //If the one youre at matches it, move on.
        //If it doesn't check out if i-1 = i + i+1
          //then see above.
      //console.log('oldST: ',streets);

      for (let i=0; i<streets.length; i++){
        if (streets[i-1] === streets[i] + streets[i+1]){
          //console.log("match: ",i,streets[i-1],streets[i],streets[i+1]);
          streets[i] = streets[i] + streets[i+1];
          streets[i+1] = null;
          streets = streets.filter(item => item != null);

        }
      }
    }
    cleanUpTheStreets();
    //streets = cleanUpTheStreets();
    //console.log('this st; ',streets, "st:len ", streets.length);

    let side = (allData.split('DAY')[0]).split('SIDE')[1].slice(0,188).trim();
    //side needs to go into the fix f(x);

    let strDay = ''
    let day = allData.split('ROUTE')[0].split('DAY')
    day[0] = null;
    for (let i=1; i<day.length; i++){
      strDay+=(day[i])
    }
    strDay = strDay.trim().split('\n');
    //console.log('strDay? ', strDay);
    //strDay = good

    let frequency = allData.split('SIGNED')[0].split('FREQUENCY')[1].trim().split(' ')
    let frequencyStr = '';
    for (let i=1; i<frequency.length; i++){
      if (i % 2 != 0){
        frequencyStr+=(frequency[i] + '\n')
      }
    }
    frequencyStr = frequencyStr.trim().split('\n')
    let biweekly = allData.split('TIME')[0].split('BIWEEKLY')[1].trim().split(' ');
    let biweeklyStr = '';
    for (let i=1; i<biweekly.length; i++){
      if (i % 2 != 0){
        biweeklyStr+=(biweekly[i] + '\n')
      }
    }
    biweeklyStr = biweeklyStr.trim().split('\n')



    let time = allData.split('ORDER')[0].split('TIME')[1].trim().split('\n')
    time.pop();
    time = time
    //Need to create function that cleans up time, because there are some entries
    //Check from the length of it and if its shorter than 8 characters then we make the current
    //entry we're on the combination of that one and the one below
    //then delete the one below.

    let cleaningTime = () => {
      for (let i=0; i<time.length; i++) {
        if (time[i] != null) {
          if (time[i].length < 7) {
            time[i] = time[i] + time[i+1];
            time[i+1] = null;
          }
        }
      } return time.filter(item => item != null);
    }
    let cleanTime = cleaningTime();


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
    //console.log(i);
    //console.log("streetNumber: ",streetNumber.length,"streets: ", streets.length, "side: ",sides.length,"strDay: ",strDay.length, "frequency: ",frequencyStr.length, "biweekly: ",biweeklyStr.length, "time: ", cleanTime.length);
    for (let i=0; i<streetNumber.length; i++) {
      entirity.push(streetNumber[i])
      entirity.push(streets[i])
      entirity.push(sides[i])
      entirity.push(frequencyStr[i])
      entirity.push(biweeklyStr[i])
      entirity.push(cleanTime[i])
      entirity.push(".");
    }

    //entirity.push(streetNumber,streets,sides, strDay, frequencyStr, biweeklyStr, cleanTime ,".")
    //   //St # = 33, Sts = 34 (cleanUpTheStreets = 33) , side = 33, strDay = 33,
  //   //freq=34( removeEmptyStrFromArray(frequencyString))
  //   //biweek=34(  removeEmptyStrFromArray(biweeklyStr)), time=34(4:00 , AM - 5:30AM)
  }
  console.log(entirity);
  return entirity;
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
.catch(err => {
  console.error('THIS IS AN ERROR!: ',err);
})








