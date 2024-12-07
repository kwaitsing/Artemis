package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"
)

var GlobalConfiguration GlobalConfigure

var serverData ServerObj

func main() {
	var rootCmd = &cobra.Command{
		Use:   "ArtemisClient",
		Short: "Artemis - HPFS server monitor",
		Long: `
		ArtemisClient LiminalStaircase@1.0.0
		Artemis is an HPFS server monitor
		for more information please checkout
		https://github.com/kwaitsing/Artemis`,
		Run: func(cmd *cobra.Command, args []string) {

			serverData = ServerObj{
				Name:     GlobalConfiguration.Name,
				Location: "pirate",
			}

			interrupt := make(chan os.Signal, 1)
			signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)
			go socket()

			// Die Brutally
			<-interrupt
			os.Exit(0)
		},
	}
	rootCmd.SilenceUsage = true
	rootCmd.SilenceErrors = true
	rootCmd.PersistentFlags().StringVarP(&GlobalConfiguration.Remote, "remote", "r", "ws://127.0.0.0:9702", "Remote WS Server")
	rootCmd.PersistentFlags().StringVarP(&GlobalConfiguration.Key, "key", "k", "oATqKPjF72wau8MdJPhV", "Auth key")
	rootCmd.PersistentFlags().StringVarP(&GlobalConfiguration.Name, "name", "n", "Infra", "Name of the server")
	rootCmd.PersistentFlags().Float32VarP(&GlobalConfiguration.UpdInterval, "updateInterval", "u", 1.2, "Update interval in seconds")
	rootCmd.PersistentFlags().BoolVarP(&GlobalConfiguration.Verbose, "verbose", "v", false, "Enable verbose")

	if err := rootCmd.Execute(); err != nil {
		if rootCmd.Flags().Lookup("help").Changed {
			fmt.Println(rootCmd.Long)
			return
		} else {
			fmt.Println("Error:", err)
		}
	}
}
