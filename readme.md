# Hyperion Web

Hyperion Web is a PWA front end for [hyperion][1]
that facilitates searching for crime data at a specific post code in the UK.

### Getting Started

**Setting up the API** is easy, simply head over to [hyperion][1] and follow the instructions.
A useful setting is `--cross-origin` which is required to access the API from other urls.

**Building the PWA** is done with webpack. First, point it to your deployed API by changing the 
`API_URL` variable in `webpack.prod.js` to the root address. Then, simply run `yarn build` and 
copy the files in the `public` directory to your web server of choice (netlify maybe?)

### Contributing

The repo is always open to pull requests or issues. It is currently in a proof-of-concept
state and any improvements to the API or web app is welcome. Some suggestions:

- bike view to see in-depth data about a stolen bike
- crime view to see in-depth data about a crime

Simply fork the repo and start working on changes in a new branch. When the change or
feature is ready, open a pull request.

[1]: https://github.com/arlyon/hyperion
