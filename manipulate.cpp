#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <ctype.h>
#include <stdio.h>
#include <math.h>
#include <typeinfo>

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
    std::cout << "Unable to read file";
  }
  //cout << entirity;
  return str;
}

std::vector<string> splitting(){
  string data = read();
  vector<string> vec;
  string test;
  std::cout << "exists" << "\n";
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
  //cout << "\n" << vec[1];
  return vec;
}

std::string parkingInformation(std::string info){
  int pos = 0;
  vector<string> vec;
  for (int i=0; i<info.size(); i++) {
    if (info[i] == ','){
      string sub = info.substr(pos, (i-pos));
      pos = i;
      vec.push_back(sub);
    }
  }
  std::string reply;

  std::cout << "vec size: " << vec.size() <<  "\n";

  for (int i=0; i<vec.size(); i++) {

    if (vec[0] == "." && vec[5] == ",NO"){
      //If 0 index is not a number (it's a dot) and is not biweekly.
      reply+="Street sweeping outside " + vec[1] + vec[2] + "and is a weekly occurence from " + vec[6];
      break;
      //If 0 index is not a number (it's a dot) and is biweekly.
    } else if (vec[0] == "." && vec[5] == ",YES"){
      reply+="Street sweeping outside " + vec[1] + vec[2] + "and is a biweekly occurence from " + vec[6];
      break;
      //If 0 index is a number and is not biweekly.
    } else if (vec[0] != "." && vec[4] == ",NO"){
      reply+="Street sweeping outside " + vec[0] + vec[1] + "and is a weekly occurence from " + vec[5];
      break;
       //If 0 index is a number and is biweekly.
    } else if (vec[0] != "." && vec[4] == ",YES"){
      reply+="Street sweeping outside " + vec[0] + vec[1] + "and is a biweekly occurence from " + vec[5];
      break;
        //Need to check if first index is a number
      //If it is then [0] is st#, [1] is st, [2] is even/odd, [3] is weekly?, [4] is biweekly, [5] is time
    //If its not, then shift all the indexes above up one.
    //Essentially it's gonna be a lot of if statements, and depending on the statement it'll be formatted for the reply string
      //ie. check if index 2? is even or odd, if its odd then say that this is all for the odd numbers on the st.
    }
  }

  for (int i=0; i<reply.size(); i++){
    if (reply[24] == ','){
      cout <<  "got here" << "\n";
      reply.erase(reply.begin() + 24);
    }
  }

  std::cout << "parking info: " << "\n" << reply << "\n";
  return reply;
}


std::string filter(std::string streetName, int streetNumber){
  vector<string> vec = splitting();

  string streetNameInput;
  for (int i=0; i<streetName.size(); i++) {
    if (streetName[i] != ' ') {
      streetNameInput+=toupper(streetName[i]);
    } else if (streetName[i] == ' ') {
      cout << "there is a space? " <<  "\n";
      streetNameInput+=streetName[i];
    }
  }

  cout << "this is streetNameInput: " << streetNameInput << "\n";

  int streetNumberInput = streetNumber;

  vector<string> filterStreetName;
  for (int i=0; i<vec.size(); i++) {
    //https://stackoverflow.com/questions/40608111/why-is-18446744073709551615-1-true
    if (vec[i].find(streetNameInput) > 0 && vec[i].find(streetNameInput) < 18446744073709551615){
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
  return parkingInformation(correctAddress);
}



int main(){
  string street;
  int num;
  //Doesn't like me using a space in input??
  std::cout << "What street are you outside of?" << "\n";
  // cin >> noskipws >> street;
  std::getline(std::cin, street);
  std::cout << "What street number are you outside of?" << "\n";
  cin >> num;
  cout << street << "," <<  num << "\n";
  filter(street, num);
  return 0;
}


