package main

import (
	"bufio"
	"io"
	"io/ioutil"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

func gen() error {

	files, err := WalkMatch("posts/", "*.md")
	if err != nil {
		return err
	}

	var posts = []Post{}

	for _, path := range files {
		file, err := os.Open(path)
		if err != nil {
			return err
		}

		defer file.Close()

		buffer, err := parseFrontmatter(file)
		if err != nil {
			return err
		}

		if buffer != nil {
			log.Printf("Add: %s", path)

			var post Post
			if err := yaml.Unmarshal(buffer, &post); err != nil {
				return err
			}

			if post.Skip == true || post.Title == "" || post.Date == nil || post.Summary == "" {
				log.Printf("Skip: %s", path)
				continue
			}

			post.Link = "/" + path
			posts = append(posts, post)
		} else {
			log.Printf("Skip: %s", path)
		}
	}

	return writeIndex(posts)
}

func writeIndex(posts []Post) error {
	postsYmal, err := yaml.Marshal(&posts)
	if err != nil {
		return err
	}
	return ioutil.WriteFile("posts.yaml", postsYmal, 0644)
}

func parseFrontmatter(file io.Reader) ([]byte, error) {
	scanner := bufio.NewScanner(file)

	var buffer = []byte{}

	start := false
	end := false

	for scanner.Scan() {
		if start == false && scanner.Text() == "---" {
			start = true
			continue
		}

		if start == true && scanner.Text() == "---" {
			end = true
			break
		}

		if start == false && scanner.Text() != "" {
			break
		}

		if start == true && scanner.Text() != "" {
			line := scanner.Text() + "\n"
			buffer = append(buffer, line...)
			continue
		}

	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	if start == true && end == true {
		return buffer, nil
	}

	return nil, nil
}
