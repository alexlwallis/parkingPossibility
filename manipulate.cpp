#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <ctype.h>
#include <stdio.h>
#include <math.h>

using namespace std;


std::string read(){
  //<fstream> is the class where you can read/write files. And ifstream is incoming stream so we named it data and
  //had it open data.txt;
  ifstream data ("data.txt");
  //Checking if it worked...
  string str = "";
  string entirity = "";
  if (data.is_open()){
    while(getline (data, str)){
      entirity+=str+"";
    }
    data.close();
  } else {
    cout << "Unable to read file";
  }
  //cout << entirity;
  return str;
}

std::vector<string> splitting(){
  string data = read();
  vector<string> vec;
  string test;
  int pos = 0;
  for (int i=0; i<data.size(); i++){
    if (data[i] == '.'){
      string sub = data.substr(pos, (i-pos));
      pos = i;
      vec.push_back(sub);
    }
  }
  //May or may not get a segmentation fault 11 lol?
  // for (int i=0; i<vec.size(); i++){
  //   cout << vec[i] << "\n";
  // }
  return vec;
}

std::string filter(std::string streetName, int streetNumber){
  vector<string> vec = splitting();

  string streetNameInput = streetName;
  int streetNumberInput = streetNumber;

  vector<string> filterStreetName;
  //cout << vec[30].find(stname) << "\n";
  for (int i=0; i<vec.size(); i++) {
    //https://stackoverflow.com/questions/40608111/why-is-18446744073709551615-1-true
    if (vec[i].find(streetNameInput) > 0 && vec[i].find(streetNameInput) < 18446744073709551615){
      //cout << vec[i] << "\n";
      filterStreetName.push_back(vec[i]);
    }
  }


  //for streetNumbers you need to check if the input is odd or even and then from
  //there you need to round it down to the hundredths place
  bool even = true;
  if (streetNumberInput % 2 == 0){
    even = true;
  } else {
    even  = false;
  }
  //Get number and replace last two digits w/ 0s. substr?
  string alteredStInput = to_string(streetNumberInput);
  alteredStInput = alteredStInput.replace(alteredStInput.size()-2, 2, "00");



  string correctAddress;
  for (int i=0; i<filterStreetName.size(); i++) {
    if (filterStreetName[i].find(alteredStInput) < 18446744073709551615){
      if (even) {
        if (filterStreetName[i].find("EVEN") < 18446744073709551615){
          cout << "Correct Address: " << filterStreetName[i] << "\n";
          correctAddress=filterStreetName[i];
        }
      } else {
        if (filterStreetName[i].find("ODD") < 18446744073709551615){
          cout << "Correct Address: " << filterStreetName[i] << "\n";
          correctAddress=filterStreetName[i];
        }
      }
    }
  }
  return correctAddress;

}





int main(){
  string street;
  int number;
  cout << "What street are you outside of?" << "\n";
  cin >> street;
  cout << "What is the street number nearest you" << "\n";
  cin >> number;
  filter(street, number);
  return 0;
}


