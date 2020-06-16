import { Injectable } from '@angular/core';
import { DbpediaSparqlService } from './dbpedia-sparql.service';
import { LocalCacheService } from './local-cache.service';
import { RdfTerm, SparqlResult } from '../models';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { RealiaService } from './realia.service';

const CACHE_ID = 'lodshow-places';

export interface PlaceInfo {
  uri: string;
  labels: RdfTerm[];
  abstracts?: RdfTerm[];
  depiction?: RdfTerm;
  topic?: RdfTerm;
  latd?: RdfTerm;
  latm?: RdfTerm;
  latns?: RdfTerm;
  longd?: RdfTerm;
  longm?: RdfTerm;
  longew?: RdfTerm;
}

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(
    private _dbpService: DbpediaSparqlService,
    private _cacheService: LocalCacheService,
    private _errorService: ErrorService,
    private _realiaService: RealiaService
  ) {}

  public buildQuery(id: string): string {
    return `PREFIX dbp: <http://dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dbr: <http://dbpedia.org/resource/>
SELECT DISTINCT
  dbr:${id} as ?place ?label
  ?topic ?depiction ?abstract
  ?latd ?latm ?latns ?longd ?longm ?longew
WHERE {
  dbr:${id} a dbo:Place;
            rdfs:label ?label.
  OPTIONAL {
  dbr:${id}
    foaf:isPrimaryTopicOf ?topic;
    foaf:depiction ?depiction;
    dbo:abstract ?abstract;
    dbp:latd ?latd;
    dbp:latm ?latm;
    dbp:latns ?latns;
    dbp:longd ?longd;
    dbp:longm ?longm;
    dbp:longew ?longew.
  }
}`;
  }

  public buildInfo(result: SparqlResult): PlaceInfo {
    if (!result) {
      return null;
    }
    const bindings = result.results.bindings;
    const info: PlaceInfo = {
      uri: null,
      labels: [],
    };
    for (const binding of bindings) {
      // place (just once)
      if (!info.uri) {
        info.uri = binding.place.value;
      }

      // labels
      info.labels = this._realiaService.addTerm(binding, 'label', info.labels);

      // abstract
      info.abstracts = this._realiaService.addTerm(
        binding,
        'abstract',
        info.abstracts
      );

      // depiction
      info.depiction = this._realiaService.replaceTerm(
        binding,
        'depiction',
        null,
        info.depiction
      );

      // topic
      info.topic = this._realiaService.replaceTerm(
        binding,
        'topic',
        null,
        info.topic
      );

      // lat
      info.latd = this._realiaService.replaceTerm(
        binding,
        'latd',
        null,
        info.latd
      );
      info.latm = this._realiaService.replaceTerm(
        binding,
        'latm',
        null,
        info.latm
      );
      info.latns = this._realiaService.replaceTerm(
        binding,
        'latns',
        null,
        info.latns
      );

      // lon
      info.longd = this._realiaService.replaceTerm(
        binding,
        'longd',
        null,
        info.longd
      );
      info.longm = this._realiaService.replaceTerm(
        binding,
        'longm',
        null,
        info.longm
      );
      info.longew = this._realiaService.replaceTerm(
        binding,
        'longew',
        null,
        info.longew
      );
    }
    return info;
  }

  public getInfo(id: string): Observable<PlaceInfo> {
    const cached = this._cacheService.get<SparqlResult>(CACHE_ID, id);
    if (cached) {
      return of(this.buildInfo(cached));
    }

    const query = this.buildQuery(id);
    return this._dbpService.get(query).pipe(
      catchError(this._errorService.handleError),
      map((r: SparqlResult) => {
        this._cacheService.add(CACHE_ID, id, r);
        return this.buildInfo(r);
      })
    );
  }
}
