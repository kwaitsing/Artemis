package main

import (
	"os"
	"os/signal"
	"syscall"
)

var GlobalConfiguration GlobalConfigure

func main() {

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	initVar()
	go socket()

	// Die Brutally
	<-interrupt
	os.Exit(2)
}
