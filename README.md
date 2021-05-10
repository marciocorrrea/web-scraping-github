# How to use
| Method  | URL  | Return |
| ------------ |---------------|-----|
| `get`      | http://ec2-18-218-130-166.us-east-2.compute.amazonaws.com:3000/scrape/${REPOSITORY}       | statistics  |

#### Requests examples 
``` 
http://ec2-18-218-130-166.us-east-2.compute.amazonaws.com:3000/scrape/marciocorreadev/teste
```
``` curl
http://ec2-18-218-130-166.us-east-2.compute.amazonaws.com:3000/scrape/https://github.com/marciocorreadev/teste
```
``` curl
http://ec2-18-218-130-166.us-east-2.compute.amazonaws.com:3000/scrape/github.com/marciocorreadev/teste
```
#### Response example
``` JSON
{
  "statistics": [
    {
      "bytes": 7,
      "count": 1,
      "extencion": "md",
      "lines": 1
    },
    {
      "bytes": 1608,
      "count": 1,
      "extencion": "gitignore",
      "lines": 104
    }
  ]
}
```

# Running

### Running with Docker image
``` 
docker pull marciocorrea/web-scraping-github:latest
docker run -p ${PORT}:3000 marciocorrea/web-scraping-github

curl http://localhost:${PORT}/scrape/${REPOSITORY}
```

### Running local
```
git clone https://github.com/marciocorreadev/web-scraping-github.git
cd web-scraping-github
npm run dev

curl http://localhost:3000/scrape/${REPOSITORY}
```

### Testing
```
npm run test
```