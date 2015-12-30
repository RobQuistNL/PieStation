/**
 * Demo for RF remote switch receiver.
 * For details, see NewRemoteReceiver.h!
 *
 * Connect the transmitter to digital pin 11.
 *
 * This sketch demonstrates the use of the NewRemoteTransmitter class.
 *
 * When run, this sketch switches some pre-defined devices on and off in a loop.
 *
 * NOTE: the actual receivers have the address and group numbers in this example
 * are only for demonstration! If you want to duplicate an existing remote, please
 * try the "retransmitter"-example instead.
 * 
 * To use this actual example, you'd need to "learn" the used code in the receivers
 * This sketch is unsuited for that.
 * 
 */

#include <NewRemoteTransmitter.h>

#define ADDR_PROGRAM_SELECT 10000
#define ADDR_COLOR_SELECT 10001
#define ADDR_CONFIG 10002

#define SET_RED_1 0
#define SET_GREEN_1 1
#define SET_BLUE_1 2
#define SET_RED_1_MULTIPLIER 3
#define SET_GREEN_1_MULTIPLIER 4
#define SET_BLUE_1_MULTIPLIER 5

#define SET_RED_2 6
#define SET_GREEN_2 7
#define SET_BLUE_2 8
#define SET_RED_2_MULTIPLIER 9
#define SET_GREEN_2_MULTIPLIER 10
#define SET_BLUE_2_MULTIPLIER 11

#define APPLY 12

#define SET_FADE_SPEED 0
#define SET_RAINBOW_SPEED 1
#define SET_FADE_TIMES 2
#define SET_FADE_TIMES_MULTIPLIER 3

#define PROG_OFF 0
#define PROG_STATIC_1 1
#define PROG_STATIC_2 2
#define PROG_RAINBOW 3
#define PROG_PULSE 4


// Create a transmitter on address 123, using digital pin 11 to transmit, 
// with a period duration of 260ms (default), repeating the transmitted
// code 2^3=8 times.
NewRemoteTransmitter TselectProgram(ADDR_PROGRAM_SELECT, 11, 260, 2);
NewRemoteTransmitter TsetColor(ADDR_COLOR_SELECT, 11, 260, 2);
NewRemoteTransmitter TsetConfig(ADDR_CONFIG, 11, 260, 2);

void setup() {
}

void selectProgram(int program) {
  TselectProgram.sendUnit(program, true);
}

void setColor(int colorSet, int value) {
  TsetColor.sendDim(colorSet, value);
}

void setConfig(int configSet, int value) {
  TsetConfig.sendDim(configSet, value);
}

void loop() {  
  // Turn it off
  selectProgram(PROG_OFF);
  delay(2000);
  selectProgram(PROG_RAINBOW);
  delay(10000);
  setConfig(SET_RAINBOW_SPEED, 1); //FASTEST
  selectProgram(PROG_RAINBOW);
  delay(10000);
  setConfig(SET_RAINBOW_SPEED, 15); //SLOWEST
  selectProgram(PROG_RAINBOW);
  delay(10000);
  setConfig(SET_FADE_SPEED, 4); //1 second
  //Set color 1 to RED
  //Set color 2 to BLUE
  setColor(SET_RED_1, 15);
  setColor(SET_RED_1_MULTIPLIER, 15);
  setColor(SET_GREEN_1, 0);
  setColor(SET_GREEN_1_MULTIPLIER, 0);
  setColor(SET_BLUE_1, 0);
  setColor(SET_BLUE_1_MULTIPLIER, 0);

  setColor(SET_RED_2, 0);
  setColor(SET_RED_2_MULTIPLIER, 0);
  setColor(SET_GREEN_2, 0);
  setColor(SET_GREEN_2_MULTIPLIER, 0);
  setColor(SET_BLUE_2, 15);
  setColor(SET_BLUE_2_MULTIPLIER, 15);
  setConfig(SET_FADE_SPEED, 8); //2 seconds
  selectProgram(PROG_STATIC_1);
  delay(10000);
  selectProgram(PROG_STATIC_2);
  delay(10000);

  //RED
  setColor(SET_RED_1, 15);
  setColor(SET_RED_1_MULTIPLIER, 15);
  setColor(SET_GREEN_1, 0);
  setColor(SET_GREEN_1_MULTIPLIER, 0);
  setColor(SET_BLUE_1, 15);
  setColor(SET_BLUE_1_MULTIPLIER, 15);
  selectProgram(PROG_STATIC_1);
  delay(5000);

  setColor(SET_RED_1, 15);
  setColor(SET_RED_1_MULTIPLIER, 15);
  setColor(SET_GREEN_1, 15);
  setColor(SET_GREEN_1_MULTIPLIER, 15);
  setColor(SET_BLUE_1, 0);
  setColor(SET_BLUE_1_MULTIPLIER, 0);
  selectProgram(PROG_STATIC_1);
  delay(5000);

  setColor(SET_RED_1, 0);
  setColor(SET_RED_1_MULTIPLIER, 0);
  setColor(SET_GREEN_1, 15);
  setColor(SET_GREEN_1_MULTIPLIER, 15);
  setColor(SET_BLUE_1, 0);
  setColor(SET_BLUE_1_MULTIPLIER, 0);
  selectProgram(PROG_STATIC_1);
  delay(5000);

  setColor(SET_RED_1, 0);
  setColor(SET_RED_1_MULTIPLIER, 0);
  setColor(SET_GREEN_1, 15);
  setColor(SET_GREEN_1_MULTIPLIER, 15);
  setColor(SET_BLUE_1, 15);
  setColor(SET_BLUE_1_MULTIPLIER, 15);
  selectProgram(PROG_STATIC_1);
  delay(5000);

  setColor(SET_RED_1, 15);
  setColor(SET_RED_1_MULTIPLIER, 15);
  setColor(SET_GREEN_1, 10);
  setColor(SET_GREEN_1_MULTIPLIER, 10);
  setColor(SET_BLUE_1, 5);
  setColor(SET_BLUE_1_MULTIPLIER, 5);
  selectProgram(PROG_STATIC_1);
  delay(5000);
  selectProgram(PROG_STATIC_2);

  //Purple and orange
  setConfig(SET_FADE_SPEED, 1); //quarter second
  setColor(SET_RED_1, 15);
  setColor(SET_RED_1_MULTIPLIER, 15);
  setColor(SET_GREEN_1, 0);
  setColor(SET_GREEN_1_MULTIPLIER, 0);
  setColor(SET_BLUE_1, 5);
  setColor(SET_BLUE_1_MULTIPLIER, 10);

  setColor(SET_RED_2, 15);
  setColor(SET_RED_2_MULTIPLIER, 15);
  setColor(SET_GREEN_2, 5);
  setColor(SET_GREEN_2_MULTIPLIER, 10);
  setColor(SET_BLUE_2, 0);
  setColor(SET_BLUE_2_MULTIPLIER, 0);
  
  selectProgram(PROG_PULSE);
  delay(10000);

  setConfig(SET_FADE_SPEED, 2);
  selectProgram(PROG_PULSE);
  delay(10000);
  setConfig(SET_FADE_SPEED, 15);
  
  setColor(SET_RED_1, 0);
  setColor(SET_RED_1_MULTIPLIER, 0);
  setColor(SET_GREEN_1, 0);
  setColor(SET_GREEN_1_MULTIPLIER, 0);
  setColor(SET_BLUE_1, 0);
  setColor(SET_BLUE_1_MULTIPLIER, 0);
  delay(10000);

  setConfig(SET_FADE_SPEED, 4);
  delay(10000);
  setConfig(SET_FADE_SPEED, 1);
  delay(10000);

  setColor(SET_RED_1, 15);
  setColor(SET_RED_1_MULTIPLIER, 15);
  setColor(SET_GREEN_1, 15);
  setColor(SET_GREEN_1_MULTIPLIER, 15);
  setColor(SET_BLUE_1, 15);
  setColor(SET_BLUE_1_MULTIPLIER, 15);
  setConfig(SET_FADE_SPEED, 4);
  selectProgram(PROG_STATIC_1);
  delay(10000);
  
}
