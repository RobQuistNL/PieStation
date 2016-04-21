// Pin out using wiringPi pin numbering scheme (15 = TxD / BCM GPIO 14, see https://projects.drogon.net/raspberry-pi/wiringpi/pins/)
#define PIN_OUT 15
#define REPEAT 3

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