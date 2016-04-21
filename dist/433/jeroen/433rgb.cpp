#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <getopt.h>
#include <unistd.h>
#include <ctype.h>
#include <iostream>
#include <string.h>
#include <fcntl.h>           /* For O_* constants */
#include <sys/stat.h>        /* For mode constants */
#include <semaphore.h>
#include <stdio.h>
#include <fcntl.h>
#include <mqueue.h>
#include <tuple>
#include "RemoteSwitch.cpp"
#include "NewRemoteTransmitter.cpp"
#include "433rgb.h"

using namespace std;

NewRemoteTransmitter TselectProgram(ADDR_PROGRAM_SELECT, PIN_OUT, 260, REPEAT);
NewRemoteTransmitter TsetColor(ADDR_COLOR_SELECT, PIN_OUT, 260, REPEAT);
NewRemoteTransmitter TsetConfig(ADDR_CONFIG, PIN_OUT, 260, REPEAT);

void selectProgram(int program) {
  TselectProgram.sendUnit(program, true);
}

void setColor(int colorSet, int value) {
  TsetColor.sendDim(colorSet, value);
}

void setConfig(int configSet, int value) {
  TsetConfig.sendDim(configSet, value);
}

void usage() {
    cout << "Usage - Todo.";
}

tuple <int,int> findNumbers(int variable) {
    int a = 0;
    int b = 0;
    if (variable <= 0) {
       return make_tuple(0, 0);
    }

    b = variable/16;
    a = variable - b*16;

    if (a>=16) {a=16;}
    if (b>=16) {b=16;}

    return make_tuple(a, b);
}

void setColorReal(int color, int value) {
    int a, b;
    tie(a, b) = findNumbers(value);
    cout << value << " = " << a << " + 16x" << b << "\n";
    switch (color) {
        case 0: //Red 1
            TsetColor.sendDim(0, a);
            TsetColor.sendDim(3, b);
            break;
        case 1: //Green 1
            TsetColor.sendDim(1, a);
            TsetColor.sendDim(4, b);
            break;
        case 2: //Blue 1
            TsetColor.sendDim(2, a);
            TsetColor.sendDim(5, b);
            break;

        case 3: //Red 2
            TsetColor.sendDim(6, a);
            TsetColor.sendDim(9, b);
            break;
        case 4: //Green 2
            TsetColor.sendDim(7, a);
            TsetColor.sendDim(10, b);
            break;
        case 5: //Blue 2
            TsetColor.sendDim(8, a);
            TsetColor.sendDim(11, b);
            break;
    }
}

int main(int argc, char* argv[])
{
    setbuf(stdout, NULL);
    // load wiringPi
    if(wiringPiSetup() == -1)
    {
            printf("WiringPi setup failed. Maybe you haven't installed it yet?");
            exit(1);
    }
    // setup pin and make it low (otherwise transmitter will block other 433 mhz transmitters like remotes)
    pinMode(PIN_OUT, OUTPUT);
    digitalWrite(PIN_OUT, LOW);
    if (strcmp(argv[1],"program") == 0) {
        cout << "Switching to program " << argv[2];
        TselectProgram.sendUnit(atoi(argv[2]), true);
    } else if (strcmp(argv[1],"color") == 0) {
        cout << "Set color " << argv[2] << " to " << argv[3];
        setColorReal(atoi(argv[2]), atoi(argv[3]));
    } else if (strcmp(argv[1],"config") == 0) {
        cout << "Set config " << argv[2] << " to " << argv[3];
        TsetConfig.sendDim(atoi(argv[2]), atoi(argv[3]));
    } else {
        usage();
    }

    // Testing program
    /*
    printf("Turn off");
      selectProgram(PROG_OFF);
      delay(2000);
      printf("Rainbow");
      selectProgram(PROG_RAINBOW);
      delay(10000);
      printf("Rainbow speed");
      setConfig(SET_RAINBOW_SPEED, 1); //FASTEST
      selectProgram(PROG_RAINBOW);
      delay(10000);
      setConfig(SET_RAINBOW_SPEED, 15); //SLOWEST
      selectProgram(PROG_RAINBOW);
      delay(10000);
      setConfig(SET_FADE_SPEED, 4); //1 second
      //Set color 1 to RED
      //Set color 2 to BLUE
      printf("Multi colour");
      setColor(SET_RED_1, 15);
      setColor(SET_RED_1_MULTIPLIER, 15);
      setColor(SET_GREEN_1, 0);
      setColor(SET_GREEN_1_MULTIPLIER, 0);
      setColor(SET_BLUE_1, 0);
      setColor(SET_BLUE_1_MULTIPLIER, 0);
printf("Multi colour change");
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
printf("White?");
      setColor(SET_RED_1, 15);
      setColor(SET_RED_1_MULTIPLIER, 15);
      setColor(SET_GREEN_1, 15);
      setColor(SET_GREEN_1_MULTIPLIER, 15);
      setColor(SET_BLUE_1, 15);
      setColor(SET_BLUE_1_MULTIPLIER, 15);
      setConfig(SET_FADE_SPEED, 4);
      selectProgram(PROG_STATIC_1);
      delay(10000);
      */

    return 0;
}

