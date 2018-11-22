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

The web container is broken up into two parts the API and the admin dashboard.

#### On Deck

```
findByIdAndUpdate causes

(node:96) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.

```
```
const crypto = require('crypto');

function getHash(password) {
  // The Hash object can not be used again after hash.digest() method has been called.
  return crypto.createHash('sha256').update(password).digest('base64');
}

```

https://medium.freecodecamp.org/how-to-setup-log-rotation-for-a-docker-container-a508093912b2

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

## DB

Currently the ```db``` folder is just a volume mapped folder for the persistent parts of the mongodb container.

### Schema

We are intentionally not designing the schema for performance on the website. The website is used by administrators to edit the data. The vast majority of the data usage will come from the mobile app querying Themes and Posters, so we are optimizing around reading themes and posters.

#### Theme

```
{
  title: "a terse theme title",
  description: "a longer explaination of the theme"
  thumbnail: {
    data: Buffer,
    contentType: "image/png"
  },
  tags : [
    "categories",
    "of-posters",
    "all-lowercase-no-spaces"
  ]
}
```
#### Poster

```
{
  background: {
    data: Buffer,
    contentType: "image/png"
  },
  textblocks: [
    {
      pattern: "{plural_noun} are {color},"
      position: { // position is in percentage of background image
        left: 0.1, 
        top: 0.1,
        width: 0.8,
        height: 0.2
      }
    }
  ]
  placeholders: [
    {
      name: "plural_noun",
      tags : [
        "categories",
        "all-terms",
        "must-have"
      ],
      terms: [
        "words or phrases",
        "to be chosen randomly",
        "and replace placeholders",
        "in textblocks above"
      ]
    }
  ]
}
```

#### Term
 A seperate Term collection may not be needed as one can be created simply with an aggregation. Click [here](https://docs.mongodb.com/manual/tutorial/query-arrays/) for a cool little MongoDB Web Shell to try it out in.

```

db.poster.insertMany([
   { placeholders: [ { tags: [ "nt1", "nt2" ], terms: [ "n1", "n2" ] }, { tags: [ "vt1", "vt2" ], terms: [ "v1", "v2" ] } ] },
   { placeholders: [ { tags: [ "nt2", "nt3" ], terms: [ "n2", "n3" ] }, { tags: [ "vt2", "vt3" ], terms: [ "v2", "v3" ] } ] },
   { placeholders: [ { tags: [ "nt3", "nt4" ], terms: [ "n3", "n4" ] }, { tags: [ "vt3", "vt4" ], terms: [ "v3", "v4" ] } ] }
]);

db.poster.aggregate([
  {$unwind:"$placeholders"},
  {$unwind:"$placeholders.terms"},
  {$unwind:"$placeholders.tags"},
  {$group:{_id:"$placeholders.terms",term:{$first:"$placeholders.terms"},tags:{$addToSet:"$placeholders.tags"}}},
  {$project:{_id:0}},
  {$match:{$expr:{$and: [{$in: ["vt2", "$tags"]},{$in: ["vt3", "$tags"]}]}}}])
```


### Development Notes:

* **MongoDB** 
  - [Official Mongo Container](https://hub.docker.com/_/mongo/)
  - [Docker - Setting MongoDB](https://www.tutorialspoint.com/docker/docker_setting_mongodb.htm)
  - [Running MongoDB as a Docker container](https://www.thachmai.info/2015/04/30/running-mongodb-container/)
  - [Running mongodb inside a docker container (with mongodb authentication)
](https://gist.github.com/davideicardi/f2094c4c3f3e00fbd490)
* **Authentication** 
  - [User Authentication with Passport and Express 4](https://mherman.org/blog/local-authentication-with-passport-and-express-4/)
  - Express [getting started](https://expressjs.com/en/starter/hello-world.html)
* **AdminLTE** 
  - [AdminLTE](https://adminlte.io/) with [demo dashboard](https://adminlte.io/themes/AdminLTE/index2.html) and [repo](https://github.com/almasaeed2010/AdminLTE)
  - Handlebars [Built-In Helpers](https://handlebarsjs.com/builtin_helpers.html), [Serving static files in Express](https://expressjs.com/en/starter/static-files.html)
* **Mongoose** 
  - [Introduction to Mongoose for MongoDB](https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57)
  - [6 Rules of Thumb for MongoDB Schema Design](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1)
  - [Query Arrays](https://docs.mongodb.com/manual/tutorial/query-arrays/)
  - [Mongoose Aggregation](http://excellencenodejsblog.com/mongoose-aggregation-count-group-match-project/)
  - [MongoDB Aggregation Pipeline by Example](https://codeburst.io/mongodb-aggregation-pipeline-by-example-part-1-77accb976bd0)
  - [Mongo Aggregations in 5 Minutes](https://engineering.universe.com/mongo-aggregations-in-5-minutes-b8e1d9c274bb)
  - [Mongoose: how to use aggregate and find together](https://stackoverflow.com/questions/42394902/mongoose-how-to-use-aggregate-and-find-together)
  - [aggregation unwind](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/)
  - [aggregation group](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/)
  - [Aggregate and Group example](https://www.mkyong.com/mongodb/mongodb-aggregate-and-group-example/)
  - [Gist](https://gist.github.com/aheckmann/2408370) to store/display an image in mongodb using mongoose/express
  
