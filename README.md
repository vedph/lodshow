# Lodshow

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.6.

Sample DBPedia resource URI: <http://dbpedia.org/resource/Marco_Polo>. The corresponding page if any is like <http://dbpedia.org/page/Marco_Polo> for DBPedia, and <https://en.wikipedia.org/wiki/Marco_Polo> for Wikipedia.

This is a quick and dirty single-project application. Web elements require a different bootstrapping, and as such they are usually placed in a separate app project. Here this does not happen for laziness :), so:

- to develop locally, just use `ng serve`;
- when ready to deploy, adjust `app.module.ts`:
  - comment out the bootstrap line;
  - uncomment the code of the AppModule class;
  - build with command `npm run package`. The output is in `elements/realia-list.js`.

To embed in your page use `sample.html` as a sample. Essentially:

- link to Material Icons font.
- link to `indigo-pink.css` theme. Its prebuilt CSS file must be placed somewhere under your web site. Here the sample page just takes it from the deeply nested `node_modules` subdirectory to avoid having to copy it elsewhere when opening locally.
- import script `https://maps.googleapis.com/maps/api/js` for Google Maps. A key would be required, but it works the same even without it, with a nasty message which we can easily overlook. We do not want to add our own key in this public repo, and that's just a demo.
- import script `realia-list.js`. This is the web element.

To use the element:

- add the element by its name `app-realia-list`.
- the element must include these attributes:
  - `type` = either `person` or `place`.
  - `json-list` = a JSON string with the list of persons/places. Each entry is an object with `uri`=DBPedia URI and `label`=entry label.

Sample:

```html
<app-realia-list
  type="person"
  json-list='[{ "uri": "http://dbpedia.org/resource/Marco_Polo", "label": "Marco Polo" },{ "uri": "http://dbpedia.org/resource/Kublai_Khan", "label": "Kublai Khan" }]'></app-realia-list>
```

Sample query (<https://dbpedia.org/sparql>):

```sparql
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dbr: <http://dbpedia.org/resource/>

SELECT distinct dbr:Marco_Polo as ?person ?name ?birth_date ?birth_place ?birth_place_label ?death_date ?death_place ?death_place_label ?topic ?depiction ?abstract WHERE {
  dbr:Marco_Polo a foaf:Person;
    foaf:name ?name.
  OPTIONAL {
    dbr:Marco_Polo dbo:birthDate ?birth_date;
      dbo:deathDate ?death_date;
      foaf:isPrimaryTopicOf ?topic;
      foaf:depiction ?depiction;
      dbo:abstract ?abstract.

    dbr:Marco_Polo dbo:birthPlace ?birth_place.
    ?birth_place rdfs:label ?birth_place_label.

    dbr:Marco_Polo dbo:deathPlace ?death_place.
    ?death_place rdfs:label ?death_place_label.
  }
  FILTER(lang(?birth_place_label)="en")
  FILTER(lang(?death_place_label)="en")
}
LIMIT 10
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
