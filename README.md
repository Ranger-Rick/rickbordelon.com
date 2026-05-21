# Rick Bordelon
A repository to host the code used to create rickbordelon.com

## Build
`docker compose up --build`

## Production Container

Build the production image:

```bash
docker build -t rickbordelon-com .
```

Run the production image locally:

```bash
docker run --rm -p 8080:80 rickbordelon-com
```

The production container serves the built `dist/` output with `nginx` on port `80`.

## Image Command
`magick "<input file>" -strip -quality 82 "src/assets/images/<output file>.webp"`
