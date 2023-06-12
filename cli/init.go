package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	cp "github.com/otiai10/copy"

)

const (
	versionFile       = ".version"
	latestReleasesURL = "https://api.github.com/repos/almariah/blog.md/releases/latest"
	distURL           = "https://github.com/almariah/blog.md/releases/download/%s/dist.zip"
	exampleURL        = "https://github.com/almariah/blog.md/releases/download/%s/example.zip"
	distFile          = "dist.zip"
	exampleFile       = "example.zip"
)

func fetchLatest() (*string, error) {
	resp, err := http.Get(latestReleasesURL)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		msg := fmt.Sprintf("could not fetch %s", latestReleasesURL)
		return nil, errors.New(msg)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	err = json.Unmarshal([]byte(body), &result)
	if err != nil {
		return nil, err
	}

	latest := result["name"].(string)

	return &latest, nil
}

func downloadLatest(version string, downloadURL string, file string) error {
	url := fmt.Sprintf(downloadURL, version)
	resp, err := http.Get(url)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		msg := fmt.Sprintf("could not fetch %s", url)
		return errors.New(msg)
	}

	out, err := os.Create(file)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func initialize() error {
	latest, err := fetchLatest()
	if err != nil {
		return err
	}

	_, err = os.Stat(versionFile)
	if os.IsNotExist(err) {
	} else {
		log.Printf("blog already initialized")
		return nil
	}

	log.Printf("download latest (%s) %s ...", *latest, distFile)
	err = downloadLatest(*latest, distURL, distFile)
	if err != nil {
		return err
	}

	log.Printf("extract latest (%s) %s ...", *latest, distFile)
	err = unzip(distFile, "./")
	if err != nil {
		return err
	}

	err = os.Remove(distFile)
	if err != nil {
		return err
	}

	err = cp.Copy("./build", "./")
	if err != nil {
		return err
	}

	err = os.RemoveAll("./build")
	if err != nil {
		return err
	}

	log.Printf("download example (%s) %s ...", *latest, exampleFile)
	err = downloadLatest(*latest, exampleURL, exampleFile)
	if err != nil {
		return err
	}

	log.Printf("extract example (%s) %s ...", *latest, exampleFile)
	err = unzip(exampleFile, "./")
	if err != nil {
		return err
	}

	err = os.Remove(exampleFile)
	if err != nil {
		return err
	}

	err = cp.Copy("./example", "./")
	if err != nil {
		return err
	}

	err = os.RemoveAll("./example")
	if err != nil {
		return err
	}

	return gen()
}
