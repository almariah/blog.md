# Blog.md

Blog.md is a blogging React App and CLI tool that helps in creating a minimal blog using enhanced Markdown version. Everything is in this blog is configured using Markdown files (with YAML frontmatter) and few YAML files. After generating your blog base files and configuring you posts you could serve the static files and your posts anywhere (for example AWS S3 bucket).

The first step to create your first post is to install the CLI tool.

## Install CLI

To install the CLI run the following commands:

```sh
# Linux
curl -sSL -o blog-md-linux-amd64 https://github.com/almariah/blog.md/releases/download/0.1.6/blog-md-linux-amd64
sudo install -m 555 blog-md-linux-amd64 /usr/local/bin/blog-md
rm blog-md-linux-amd64

# Mac with Intel chip
curl -sSL -o blog-md-darwin-amd64 https://github.com/almariah/blog.md/releases/download/0.1.6/blog-md-darwin-amd64
sudo install -m 555 blog-md-darwin-amd64 /usr/local/bin/blog-md
rm blog-md-darwin-amd64

# Mac with Apple silicon
curl -sSL -o blog-md-darwin-arm64 https://github.com/almariah/blog.md/releases/download/0.1.6/blog-md-darwin-arm64
sudo install -m 555 blog-md-darwin-arm64 /usr/local/bin/blog-md
rm blog-md-darwin-arm64
```

## Getting Started

To create your blog create new folder and run `blog-md`:

```sh
mkdir new_blog
cd new_blog
blog-md init
```

After initializing the blog, you can test it as follow:

```sh
blog-md serve
```

The previous command will serving the blog (with demo examples) on `http://localhost:3000`. After testing the blog you can now edit/create/modify the following:

* `blog.yaml`: general blog configuration.
* `posts/index.md` Home page of your blog (which contains index for all of blog posts indexed in `posts.yaml`)

To create or modify any post use `posts` directory. The `index.md` is treated as any other post file (Markdown). After creating new posts please update the index (`posts.yaml`) by running:

```sh
blog-md gen
```

## Configuring `blog.yaml`

## Configuring `posts/index.md`

## Markdown Frontmatter

## Markdown Features
