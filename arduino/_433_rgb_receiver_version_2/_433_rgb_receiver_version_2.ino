/**
 * 
ADDRESS     UNIT  Effect
10000 Select Program  
            0     Off
            1     Static Color 1
            2     Static Color 2
            3     Static Color 3
            4     Rainbow
            5     Fade 1 - 2
            6     Fade 1 - 2 - 3
            7     Fade 2 - 3
            8     Fade 1 - 3
            9     flash red X times
            10    flash blue X times
            11    flash green X times
            12    flash white X times

1001X Set static X to predefined color     UNIT    Effect
            0 Dark red (Dim level = brightness)
            1 Red
            2 Pink
            3 Purple
            4 Dark Blue
            5 Blue
            6 Light blue
            7 Light green
            8 Green
            9 Dark green
            10 Yellow
            11 Orange
            12 Dark orange
            13 Bright white
            14 Warm white
            15 

1002X Set static X color manually
            0     Red
            1     Green
            2     Blue
            3     Red Multiplier
            4     Green Multiplier
            5     Blue Multiplier

10001 Configuration   UNIT    Effect
            0     Fade speed X1
            1     Fade speed X16
            2     Fade speed X256
 */


#include <NewRemoteReceiver.h>

#define PIN_RED       9// pin for red LED
#define PIN_GREEN    10 // pin for green - never explicitly referenced
#define PIN_BLUE     11 // pin for blue - never explicitly referenced
#define PIN_DATA     2 //Data pin for 433hz receiver

#define ADDR_PROGRAM 10000
#define UNIT_PROGRAM_OFF 0
#define UNIT_PROGRAM_STATIC_1 1
#define UNIT_PROGRAM_STATIC_2 2
#define UNIT_PROGRAM_STATIC_3 3
#define UNIT_PROGRAM_RAINBOW 4
#define UNIT_PROGRAM_FADE12 5
#define UNIT_PROGRAM_FADE123 6
#define UNIT_PROGRAM_FADE23 7
#define UNIT_PROGRAM_FADE13 8
#define UNIT_PROGRAM_FLASH_RED 9
#define UNIT_PROGRAM_FLASH_BLUE 10
#define UNIT_PROGRAM_FLASH_GREEN 11
#define UNIT_PROGRAM_FLASH_WHITE 12

#define ADDR_STATIC_1 10011
#define ADDR_STATIC_2 10012
#define ADDR_STATIC_3 10013
#define UNIT_STATIC_DARK_RED 0
#define UNIT_STATIC_RED 1
#define UNIT_STATIC_PINK 2
#define UNIT_STATIC_PURPLE 3
#define UNIT_STATIC_DARK_BLUE 4
#define UNIT_STATIC_BLUE 5
#define UNIT_STATIC_LIGHT_BLUE 6
#define UNIT_STATIC_LIGHT_GREEN 7
#define UNIT_STATIC_GREEN 8
#define UNIT_STATIC_DARK_GREEN 9
#define UNIT_STATIC_YELLOW 10
#define UNIT_STATIC_ORANGE 11
#define UNIT_STATIC_DARK_ORANGE 12
#define UNIT_STATIC_BRIGHT_WHITE 13
#define UNIT_STATIC_WARM_WHITE 14

struct RGB {
  byte r;
  byte g;
  byte b;
};

RGB currentRgb = {0, 0, 0};
RGB targetRgb = {0, 0, 0};

RGB color1 = {0, 0, 0};
RGB color2 = {0, 0, 0};
RGB color3 = {0, 0, 0};

RGB c_off = {0, 0, 0};
RGB c_darkred = {128, 0, 0};
RGB c_red = {255, 0, 0};
RGB c_pink = {255, 32, 8};
RGB c_purple = {1, 1, 1};
RGB c_darkblue = {1, 1, 1};
RGB c_blue = {1, 1, 1};
RGB c_lightblue = {1, 1, 1};
RGB c_lightgreen = {1, 1, 1};
RGB c_green = {1, 1, 1};
RGB c_darkgreen = {1, 1, 1};
RGB c_yellow = {1, 1, 1};
RGB c_orange = {1, 1, 1};
RGB c_darkorange = {1, 1, 1};
RGB c_brightwhite = {1, 1, 1};
RGB c_warmwhite = {1, 1, 1};

void writeRgb(RGB values) {
  analogWrite(PIN_RED, values.r);
  analogWrite(PIN_GREEN, values.g);
  analogWrite(PIN_BLUE, values.b);
}

void setup () {
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE, OUTPUT);
  writeRgb(c_pink);

  Serial.begin(115200);
  // Initialize receiver on interrupt 0 (= digital pin 2), calls the callback "showCode"
  // after 3 identical codes have been received in a row. (thus, keep the button pressed
  // for a moment)
  //
  // See the interrupt-parameter of attachInterrupt for possible values (and pins)
  // to connect the receiver.
  NewRemoteReceiver::init(0, PIN_DATA, showCode);
}

void loop() {
  /*switch (program) {
      case PROG_RAINBOW:
          hue += HUE_DELTA;
          if (hue > HUE_MAX) {
            hue=0.0;
          }
          rgbval=HSV_to_RGB(hue/1000, saturation, value);
          current_rgb[0] = ((rgbval & 0x00FF0000) >> 16) * 255/255; // there must be better ways
          current_rgb[1] = ((rgbval & 0x0000FF00) >> 8) * 128/255;
          current_rgb[2] = (rgbval & 0x000000FF) * 90/255;
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
      case PROG_FLASH_RED:
          if (animationcounter == animationlength) {
              pulse = !pulse;
              animationcounter = 0;
              begin_rgb[0] = current_rgb[0];
              begin_rgb[1] = current_rgb[1];
              begin_rgb[2] = current_rgb[2];
              if (pulse == 0) {
                  flash_counter++;
              }
              if (pulse == 0 && flash_counter == flash_max) {
                  for (k = 0; k<3; k++) {
                    rgb_1[k] = b_rgb_1[k];
                    rgb_2[k] = b_rgb_2[k];
                    rgb_r_1[k] = b_rgb_r_1[k];
                    rgb_r_2[k] = b_rgb_r_2[k];
                    rgb_r_1_m[k] = b_rgb_r_1_m[k];
                    rgb_r_2_m[k] = b_rgb_r_2_m[k];
                  }

                  program = program_back;
                  animationcounter = 0;
                  animationlength = animationlength_back;
              }
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
  animationcounter++;*/
}

int easeInOutCubic(int t, int b, int c, int d) {
    return -c/2 * (cos(PI*t/d) - 1) + b;
}

RGB getColorFromUnit(int unit) {
  switch (unit) {
    case UNIT_STATIC_DARK_RED:
      return c_darkred;
    case UNIT_STATIC_RED:
      return c_red;
    case UNIT_STATIC_PINK:
      return c_pink;
    case UNIT_STATIC_PURPLE:
      return c_purple;
    case UNIT_STATIC_DARK_BLUE:
      return c_darkblue;
    case UNIT_STATIC_BLUE:
      return c_blue;
    case UNIT_STATIC_LIGHT_BLUE:
      return c_lightblue;
    case UNIT_STATIC_LIGHT_GREEN:
      return c_lightgreen;
    case UNIT_STATIC_GREEN:
      return c_green;
    case UNIT_STATIC_DARK_GREEN:
      return c_darkgreen;
    case UNIT_STATIC_YELLOW:
      return c_yellow;
    case UNIT_STATIC_ORANGE:
      return c_orange;
    case UNIT_STATIC_DARK_ORANGE:
      return c_darkorange;
    case UNIT_STATIC_BRIGHT_WHITE:
      return c_brightwhite;
    case UNIT_STATIC_WARM_WHITE:
      return c_warmwhite;
  }
}

int level = 0;
// Callback function is called only when a valid code is received.
void showCode(NewRemoteCode receivedCode) {
  level = 0;
  if (receivedCode.dimLevelPresent) {
    level = receivedCode.dimLevel;
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

  switch (receivedCode.address) {
    case ADDR_PROGRAM:
      switch (receivedCode.unit) {
        case UNIT_PROGRAM_OFF:
          writeRgb(c_off);
          break;
        case UNIT_PROGRAM_STATIC_1:
          writeRgb(color1);
          break;
        case UNIT_PROGRAM_STATIC_2:
          writeRgb(color2);
          break;
        case UNIT_PROGRAM_STATIC_3:
          writeRgb(color3);
          break;
      }
      break;
    case ADDR_STATIC_1:
      color1 = getColorFromUnit(receivedCode.unit);
      break;
    case ADDR_STATIC_2:
      color2 = getColorFromUnit(receivedCode.unit);
      break;
    case ADDR_STATIC_3:
      color3 = getColorFromUnit(receivedCode.unit);
      break;
  }
}
