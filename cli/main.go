package main

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{}

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Create new blog",
	Long:  `Create new blog`,
	RunE: func(cmd *cobra.Command, args []string) error {
		return initialize()
	},
}

var updateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update blog",
	Long:  `Update blog`,
	RunE: func(cmd *cobra.Command, args []string) error {
		return update()
	},
}

var genCmd = &cobra.Command{
	Use:   "gen",
	Short: "Generate posts index 'posts.yaml'",
	Long:  `Generate posts index 'posts.yaml'`,
	RunE: func(cmd *cobra.Command, args []string) error {
		return gen()
	},
}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serve blog static HTML files on localhost",
	Long:  `Serve blog static HTML files on localhost`,
	RunE: func(cmd *cobra.Command, args []string) error {
		addr, _ := cmd.Flags().GetString("addr")
		return serve(addr)
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	rootCmd.AddCommand(updateCmd)
	rootCmd.AddCommand(genCmd)
	rootCmd.AddCommand(serveCmd)
	serveCmd.PersistentFlags().StringP("addr", "", ":3000", "listening address")
}

func main() {
	rootCmd.Execute()
}
