package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var serverData ServerObj = ServerObj{
	Name:     GlobalConfiguration.Name,
	Location: "trans",
}

func initVar() {
	var rootCmd = &cobra.Command{
		Use:   "ArtemisClient",
		Short: "ArtemisClient - HPFS server monitor",
		Long: `
		Artemis is an HPFS server monitor
		for more information please checkout
		https://github.com/kwaitsing/Artemis`,
		Run: func(cmd *cobra.Command, args []string) {
			serverData.Name = GlobalConfiguration.Name
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
		} else {
			fmt.Println("Error:", err)
		}
		os.Exit(1)
	}
}
