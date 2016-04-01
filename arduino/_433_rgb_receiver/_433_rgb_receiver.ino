/**
 * 
ADDRESS        UNIT    Effect
10000 Select Program  
            0     Off
            1     Static
            2     Fade rainbow
            3     Fade color 1 to color 2

10001 Set color     UNIT    Effect
            0     Red 1
            1     Green 1
            2     Blue 1
            3     Red 1 Multiplier
            4     Green 1 Multiplier
            5     Blue 1 Multiplier
            
            6     Red 2
            7     Green 2
            8     Blue 2
            9     Red 2 Multiplier
            10      Green 2 Multiplier
            11      Blue 2 Multiplier
            
10002 Configuration   UNIT    Effect
            0     Fade speed
            1     Fade speed multiplier
            2     Fade times
            3     Fade times multiplier
 */


#include <NewRemoteReceiver.h>

// don't futz with these, illicit sums later
#define PIN_RED       9// pin for red LED
#define PIN_GREEN    10 // pin for green - never explicitly referenced
#define PIN_BLUE     11 // pin for blue - never explicitly referenced
#define PIN_DATA     2 //Data pin for 433hz receiver

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

long current_rgb[3];
long target_rgb[3];
long begin_rgb[3];

long rgb_1[3];
long rgb_2[3];
long rgb_r_1[3];
long rgb_r_2[3];

long rgbval;
float hue=0.0000, saturation=1, value=1;
#define HUE_MAX  6000.0

int stepSpeed = 17;
int animationcounter = 0;
int animationlength = 120;
int HUE_DELTA = 5;

int program = PROG_RAINBOW;

long bright[3] = { 256, 128, 90};

long k;

void setup () {
  for (k=0; k<3; k++) {
    pinMode(PIN_RED + k, OUTPUT);
    rgb_1[k]=0;
    rgb_2[k]=0;
    rgb_r_1[k]=0;
    rgb_r_2[k]=0;
    current_rgb[k]=0;
    target_rgb[k]=0;
    analogWrite(PIN_RED + k, current_rgb[k] * bright[k]/256);
  }

  Serial.begin(115200);
  
  // Initialize receiver on interrupt 0 (= digital pin 2), calls the callback "showCode"
  // after 3 identical codes have been received in a row. (thus, keep the button pressed
  // for a moment)
  //
  // See the interrupt-parameter of attachInterrupt for possible values (and pins)
  // to connect the receiver.
  NewRemoteReceiver::init(0, PIN_DATA, showCode);
}
bool pulse = 0;
void loop() {
  switch (program) {
      case PROG_RAINBOW:
          hue += HUE_DELTA;
          if (hue > HUE_MAX) {
            hue=0.0;
          }
          rgbval=HSV_to_RGB(hue/1000, saturation, value);
          current_rgb[0] = (rgbval & 0x00FF0000) >> 16; // there must be better ways
          current_rgb[1] = (rgbval & 0x0000FF00) >> 8;
          current_rgb[2] = rgbval & 0x000000FF;
          break;
      case PROG_OFF:
          if (animationcounter < animationlength) {
            for (k = 0; k<3; k++) {
                current_rgb[k] = easeInOutCubic(animationcounter, begin_rgb[k], 0 - begin_rgb[k], animationlength);
            }
        } else {
            for (k = 0; k<3; k++) {
                current_rgb[k] = 0;
            }
        }
          break;
      case PROG_STATIC_1:
          if (animationcounter < animationlength) {
              for (k = 0; k<3; k++) {
                  current_rgb[k] = easeInOutCubic(animationcounter, begin_rgb[k], rgb_1[k] - begin_rgb[k], animationlength);
              }
          } else {
              for (k = 0; k<3; k++) {
                  current_rgb[k] = rgb_1[k];
              }
          }
          break;
      case PROG_STATIC_2:
          if (animationcounter < animationlength) {
              for (k = 0; k<3; k++) {
                  current_rgb[k] = easeInOutCubic(animationcounter, begin_rgb[k], rgb_2[k] - begin_rgb[k], animationlength);
              }
          } else {
              for (k = 0; k<3; k++) {
                  current_rgb[k] = rgb_2[k];
              }
          }
          break;
      case PROG_PULSE:
          if (animationcounter == animationlength) {
              pulse = !pulse;
              animationcounter = 0;
              begin_rgb[0] = current_rgb[0];
              begin_rgb[1] = current_rgb[1];
              begin_rgb[2] = current_rgb[2];
          }
  
          if (pulse) {
            for (k = 0; k<3; k++) {
              current_rgb[k] = easeInOutCubic(animationcounter, begin_rgb[k], rgb_2[k] - begin_rgb[k], animationlength);
            }
          } else {
            for (k = 0; k<3; k++) {
              current_rgb[k] = easeInOutCubic(animationcounter, begin_rgb[k], rgb_1[k] - begin_rgb[k], animationlength);
            }
          }
          break;
  }
  
  delay(stepSpeed);
  setRed(current_rgb[0]);
  setGreen(current_rgb[1]);
  setBlue(current_rgb[2]);
  animationcounter++;
}

void setRed(int color) {
  analogWrite(PIN_RED, color * bright[0]/256);
}

void setGreen(int color) {
  analogWrite(PIN_GREEN, color * bright[1]/256);
}

void setBlue(int color) {
  analogWrite(PIN_BLUE, color * bright[2]/256);
}

int easeInOutCubic(int t, int b, int c, int d) {
    return -c/2 * (cos(PI*t/d) - 1) + b;
}

int level = 0;
// Callback function is called only when a valid code is received.
void showCode(NewRemoteCode receivedCode) {
  level = 0;
  if (receivedCode.dimLevelPresent) {
    level = receivedCode.dimLevel;
  }
  switch (receivedCode.address) {
    case ADDR_PROGRAM_SELECT:
        switch (receivedCode.unit) {
          case PROG_OFF:
          case PROG_STATIC_1:
          case PROG_STATIC_2:
          case PROG_RAINBOW:
          case PROG_PULSE:
              hue = 0;
              program = receivedCode.unit;
              animationcounter = 0;
              begin_rgb[0] = current_rgb[0];
              begin_rgb[1] = current_rgb[1];
              begin_rgb[2] = current_rgb[2];
              rgb_1[0] = rgb_r_1[0];
              rgb_1[1] = rgb_r_1[1];
              rgb_1[2] = rgb_r_1[2];
              rgb_2[0] = rgb_r_2[0];
              rgb_2[1] = rgb_r_2[1];
              rgb_2[2] = rgb_r_2[2];
              break;
        }
        break;
    case ADDR_COLOR_SELECT:
        switch (receivedCode.unit) {
          case SET_RED_1:
              rgb_r_1[0] = level;
              break;
          case SET_GREEN_1:
              rgb_r_1[1] = level;
              break;
          case SET_BLUE_1:
              rgb_r_1[2] = level;
              break;
          case SET_RED_1_MULTIPLIER:
              rgb_r_1[0] *= level+1;
              break;
          case SET_GREEN_1_MULTIPLIER:
              rgb_r_1[1] *= level+1;
              break;
          case SET_BLUE_1_MULTIPLIER:
              rgb_r_1[2] *= level+1;
              break;

          case SET_RED_2:
              rgb_r_2[0] = level;
              break;
          case SET_GREEN_2:
              rgb_r_2[1] = level;
              break;
          case SET_BLUE_2:
              rgb_r_2[2] = level;
              break;
          case SET_RED_2_MULTIPLIER:
              rgb_r_2[0] *= level+1;
              break;
          case SET_GREEN_2_MULTIPLIER:
              rgb_r_2[1] *= level+1;
              break;
          case SET_BLUE_2_MULTIPLIER:
              rgb_r_2[2] *= level+1;
              break;
        }
        break;
    case ADDR_CONFIG:
        switch (receivedCode.unit) {
          case SET_FADE_SPEED:
              animationlength = level * 15; // in quarter seconds
              break;
          case SET_RAINBOW_SPEED:
              HUE_DELTA = level;
              break;
          case SET_FADE_TIMES:
              //fadeTimes = level;
              break;
          case SET_FADE_TIMES_MULTIPLIER:
              //fadeTimes *= level;
              break;
      
        }
        break;
  }

  // Print the received code.
  Serial.print("Addr ");
  Serial.print(receivedCode.address);

  if (receivedCode.groupBit) {
    Serial.print(" group");
  } 
  else {
    Serial.print(" unit ");
    Serial.print(receivedCode.unit);
  }

  switch (receivedCode.switchType) {
    case NewRemoteCode::off:
      Serial.print(" off");
      break;
    case NewRemoteCode::on:
      Serial.print(" on");
      break;
    case NewRemoteCode::dim:
      Serial.print(" dim");
      break;
  }

  if (receivedCode.dimLevelPresent) {
    Serial.print(", dim level: ");
    Serial.print(receivedCode.dimLevel);
  }

  Serial.print(", period: ");
  Serial.print(receivedCode.period);
  Serial.println("us.");
}

long HSV_to_RGB( float h, float s, float v ) {
  /* modified from Alvy Ray Smith's site: http://www.alvyray.com/Papers/hsv2rgb.htm */
  // H is given on [0, 6]. S and V are given on [0, 1].
  // RGB is returned as a 24-bit long #rrggbb
  int i;
  float m, n, f;

  // not very elegant way of dealing with out of range: return black
  if ((s<0.0) || (s>1.0) || (v<1.0) || (v>1.0)) {
    return 0L;
  }

  if ((h < 0.0) || (h > 6.0)) {
    return long( v * 255 ) + long( v * 255 ) * 256 + long( v * 255 ) * 65536;
  }
  i = floor(h);
  f = h - i;
  if ( !(i&1) ) {
    f = 1 - f; // if i is even
  }
  m = v * (1 - s);
  n = v * (1 - s * f);
  switch (i) {
  case 6:
  case 0: 
    return long(v * 255 ) * 65536 + long( n * 255 ) * 256 + long( m * 255);
  case 1: 
    return long(n * 255 ) * 65536 + long( v * 255 ) * 256 + long( m * 255);
  case 2: 
    return long(m * 255 ) * 65536 + long( v * 255 ) * 256 + long( n * 255);
  case 3: 
    return long(m * 255 ) * 65536 + long( n * 255 ) * 256 + long( v * 255);
  case 4: 
    return long(n * 255 ) * 65536 + long( m * 255 ) * 256 + long( v * 255);
  case 5: 
    return long(v * 255 ) * 65536 + long( m * 255 ) * 256 + long( n * 255);
  }
} 
