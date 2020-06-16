import { Component, OnInit, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { SparqlResult } from 'src/app/models';
import { DbpediaSparqlService } from 'src/app/services/dbpedia-sparql.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css'],
})
export class QueryComponent implements OnInit {
  private _query: string;

  public queryCtl: FormControl;
  public form: FormGroup;
  public result: SparqlResult;
  public busy: boolean;

  @Input()
  public get query(): string {
    return this._query;
  }
  public set query(value: string) {
    this._query = value;
    this.queryCtl?.setValue(value);
  }

  constructor(
    formBuilder: FormBuilder,
    private _sparqlService: DbpediaSparqlService
  ) {
    this.queryCtl = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      query: this.queryCtl,
    });
  }

  ngOnInit(): void {
    this.queryCtl.setValue(this._query);
  }

  public execute() {
    if (this.queryCtl.invalid || this.busy) {
      return;
    }
    this.busy = true;
    this._sparqlService.get(this.queryCtl.value).subscribe(
      (r: SparqlResult) => {
        this.busy = false;
        this.result = r;
      },
      (error) => {
        this.busy = false;
        console.error(error);
      }
    );
  }
}
