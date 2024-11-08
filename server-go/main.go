package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"
)

var igniteObj ignite

func main() {
	var cobraObj = &cobra.Command{
		Use:   "ArtemisServer",
		Short: "Artemis - HPFS server monitor",
		Long: `
		ArtemisServer LiminalStaircase@1.0.0
		Artemis is an HPFS server monitor
		for more information please checkout
		https://github.com/kwaitsing/Artemis`,
		Run: func(cmd *cobra.Command, args []string) {
			halt := make(chan os.Signal, 1)
			signal.Notify(halt, os.Interrupt, syscall.SIGTERM)

			go igniteGin()

			// Boom!
			<-halt
			os.Exit(0)
		},
	}
	cobraObj.PersistentFlags().Uint16VarP(&igniteObj.Port, "port", "p", 9702, "Listen port")
	cobraObj.PersistentFlags().StringVarP(&igniteObj.Key, "key", "k", "oATqKPjF72wau8MdJPhV", "Server Key")

	if err := cobraObj.Execute(); err != nil {
		if cobraObj.Flags().Lookup("help").Changed {
			fmt.Println(cobraObj.Long)
			return
		} else {
			fmt.Println("Error:", err)
		}
	}
}
