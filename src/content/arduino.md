---
title: "Play with Arduino UNO using Golang (and Lego!)"
github: "https://github.com/yiting007/goard"
---

### Requirements

*   Having Golang installed and GOPATH set;
*   Having an arduino UNO with some other components;
*   It will be more fun if you also have some Lego parts.

### Steps

1.  **Install Homebrew**
    Because I'm using Mac, and Gort for Mac uses Homebrew.

2.  **Install Gort**

    ```bash
    $ ./gort scan serial
    $ ./gort arduino install
    $ ./gort arduino upload firmate [serial]
    ```

3.  **Install tarm/goserial**
    It has been replaced by tarm/serial but Gobot still uses the old one.

    ```bash
    $ go get github.com/tarm/goserial
    ```

4.  **Install Gobot for arduino**
    Then you should be able to run the examples using Gobot!

### A servo example

`servo.go`

```go
package main

import (
    "fmt"
    "time"
    "github.com/hybridgroup/gobot"
    "github.com/hybridgroup/gobot/platforms/firmata"
    "github.com/hybridgroup/gobot/platforms/gpio"
)

func main() {
    gbot := gobot.NewGobot()

    firmataAdaptor := firmata.NewFirmataAdaptor("firmata", "/dev/tty.usbmodem1411")
    servo := gpio.NewServoDriver(firmataAdaptor, "servo", "7")

    work := func() {
        gobot.Every(500*time.Millisecond, func() {
            i := uint8(gobot.Rand(100) + 50)
            fmt.Println("Turning", i)
            servo.Move(i)
        })
    }
    robot := gobot.NewRobot("servoBot",
        []gobot.Connection{firmataAdaptor},
        []gobot.Device{servo},
        work,
    )
    gbot.AddRobot(robot)
    gbot.Start()
}
```

![Arduino Go](/images/arduinoGo.2b2489f6.gif)
![Arduino Run](/images/arduinoRun.cdd4c83f.png)
