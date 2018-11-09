# posterbot-cloud
An AI powered cloud solution that creates memes, motivational art, and other things

The first goal of this project is to learn patterns and practices at scale. Whether we share the code for this project or not, we should plan to share the learning so please document things as thoroughly as possible.

## Design

We are going to docker the shit out of this project. (We are learning after all) This project is broken down into two parts.

* [web](#web) - This is a the container for the node server

* [db](#db) - This is the container for the database (currently mongodb)

The base framework was generated with the following command

```bash
$ npx express-generator --view=hbs --git web
```

The ```docker-compose.yml``` file in the root of the project describes how the containers are orchestrated together.

## Build

```bash
$ docker-compose build
```

## Run

To start run the following command

```bash
$ docker-compose up -d
```

To shutdown run the following command

```bash
docker-compose down
```
## Web


#### Mongo in Docker

[Official Mongo Container](https://hub.docker.com/_/mongo/)
[Docker - Setting MongoDB](https://www.tutorialspoint.com/docker/docker_setting_mongodb.htm)
[Running MongoDB as a Docker container](https://www.thachmai.info/2015/04/30/running-mongodb-container/)
[Running mongodb inside a docker container (with mongodb authentication)
](https://gist.github.com/davideicardi/f2094c4c3f3e00fbd490)

#### Authentication

* [User Authentication with Passport and Express 4](https://mherman.org/blog/local-authentication-with-passport-and-express-4/) demonstrating local authentication.
* Express [getting started](https://expressjs.com/en/starter/hello-world.html)


#### Dependencies

* [connect-busboy](https://www.npmjs.com/package/connect-busboy) -  multi-part file upload parsing.
* [connect-flash](https://www.npmjs.com/package/connect-flash) - The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
* [cookie-session](https://www.npmjs.com/package/cookie-session) - Simple cookie-based session middleware.
* [debug](https://www.npmjs.com/package/debug) - debug logging
* [express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for node.
* [hbs](https://www.npmjs.com/package/hbs) - view engine for handlebars.
* [http-errors](https://www.npmjs.com/package/http-errors) - Create HTTP errors with ease.
* [mongoose](https://www.npmjs.com/package/mongoose) - package for interfacing with mongodb asynchronously. See [documentation](http://mongoosejs.com/) for more information.
* [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware.
* [passport](https://www.npmjs.com/package/passport) - Express compatible authentication middleware. See [documentation](http://www.passportjs.org/docs/) for more information.
* [passport-local](https://www.npmjs.com/package/passport-local) - passport strategy for local authentication with email and password
* [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose) - a Mongoose plugin that simplifies building username and password login with Passport.
* [serve-favicon](https://www.npmjs.com/package/serve-favicon) - middleware for serving a favicon. Placed early in the stack so we don't log favicon requests.


#### On Deck

* [body-parser](https://www.npmjs.com/package/body-parser) - Parse incoming request bodies in a middleware before your handlers, available under the ```req.body``` property.
* [serve-static](https://www.npmjs.com/package/serve-static) - Middleware to serve files from within a given root directory.

```
const crypto = require('crypto');

function getHash(password) {
  // The Hash object can not be used again after hash.digest() method has been called.
  return crypto.createHash('sha256').update(password).digest('base64');
}

```

## DB

Currently the ```db``` folder is just a volume mapped folder for the persistent parts of the mongodb container.
