import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FaCodeFork } from 'react-icons/fa6';

export default function Arduino() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-4">
                        Play with Arduino UNO using Golang (and Lego!)
                        <a href="https://github.com/yiting007/goard" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                            <FaCodeFork />
                        </a>
                    </h1>

                    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                            <li>Having Golang installed and GOPATH set;</li>
                            <li>Having an arduino UNO with some other components;</li>
                            <li>It will be more fun if you also have some Lego parts.</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-4">Steps</h3>
                        <ol className="list-decimal list-inside space-y-4 text-gray-700 mb-8">
                            <li>
                                <strong>Install Homebrew</strong>
                                <p className="ml-6 text-sm text-gray-600">Because I'm using Mac, and Gort for Mac uses Homebrew.</p>
                            </li>
                            <li>
                                <strong>Install Gort</strong>
                                <div className="ml-6 mt-2 bg-gray-100 p-3 rounded font-mono text-sm">
                                    <p>$ ./gort scan serial</p>
                                    <p>$ ./gort arduino install</p>
                                    <p>$ ./gort arduino upload firmate [serial]</p>
                                </div>
                            </li>
                            <li>
                                <strong>Install tarm/goserial</strong>
                                <p className="ml-6 text-sm text-gray-600">It has been replaced by tarm/serial but Gobot still uses the old one.</p>
                                <div className="ml-6 mt-2 bg-gray-100 p-3 rounded font-mono text-sm">
                                    <p>$ go get github.com/tarm/goserial</p>
                                </div>
                            </li>
                            <li>
                                <strong>Install Gobot for arduino</strong>
                                <p className="ml-6 text-sm text-gray-600">Then you should be able to run the examples using Gobot!</p>
                            </li>
                        </ol>

                        <h3 className="text-xl font-semibold mb-4">A servo example</h3>
                        <div className="mb-6">
                            <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm font-mono">servo.go</div>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto font-mono text-sm">
                                {`package main

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
}`}
                            </pre>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative h-64 w-full">
                                <Image
                                    src="/images/arduinoGo.2b2489f6.gif"
                                    alt="Arduino Go"
                                    fill
                                    className="object-contain rounded-lg border border-gray-200"
                                />
                            </div>
                            <div className="relative h-64 w-full">
                                <Image
                                    src="/images/arduinoRun.cdd4c83f.png"
                                    alt="Arduino Run"
                                    fill
                                    className="object-contain rounded-lg border border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
