import { Component, OnInit, Input } from '@angular/core';
import { RealiaListEntry, RdfTerm } from 'src/app/models';
import { PersonService, PersonInfo } from 'src/app/services/person.service';
import { RealiaService } from 'src/app/services/realia.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
})
export class PersonListComponent implements OnInit {
  @Input()
  public entries: RealiaListEntry[];

  public selectedEntry: RealiaListEntry;
  public infoExpanded: boolean;
  public lastQuery: string;
  public info: PersonInfo;

  public languages: string[];
  public language: FormControl;
  public form: FormGroup;
  public selectedAbstract: string;

  public busy: boolean;

  constructor(
    formBuilder: FormBuilder,
    private _personService: PersonService,
    private _realiaService: RealiaService
  ) {
    this.language = formBuilder.control(null);
    this.form = formBuilder.group({
      language: this.language,
    });
  }

  ngOnInit(): void {
    this.language.valueChanges.subscribe((_) => {
      if (this.languages) {
        const i = this.languages.findIndex((l) => {
          return this.language.value === l;
        });
        this.selectedAbstract = this.info.abstracts[i].value;
      }
    });
  }

  public selectEntry(entry: RealiaListEntry) {
    this.selectedEntry = entry;
    if (this.info?.uri === entry.uri) {
      this.infoExpanded = true;
      return;
    }

    const id = this._realiaService.getIdFromUri(entry.uri);

    this.lastQuery = this._personService.buildQuery(id);

    this.busy = true;
    this._personService.getInfo(id).subscribe(
      (i) => {
        this.busy = false;
        this.info = i;
        this.languages = this._realiaService.getLanguages(i.abstracts);
        this.infoExpanded = true;
        if (this.languages.length) {
          if (this.languages.find((l) => l === 'en')) {
            this.language.setValue('en');
          } else {
            this.language.setValue(this.languages[0]);
          }
        }
      },
      (error) => {
        this.busy = false;
        console.error('Error querying for ' + entry.uri);
        console.error(error);
      }
    );
  }

  public getYear(date: string): number {
    const m = /^([0-9]+)/.exec(date);
    return m ? parseInt(m[1], 10) : 0;
  }

  public getIdFromUri(uri: string): string {
    return this._realiaService.getIdFromUri(uri);
  }

  public getAge(birthDate: RdfTerm | null, deathDate: RdfTerm | null) {
    if (!birthDate || !deathDate) {
      return 0;
    }
    return this.getYear(deathDate.value) - this.getYear(birthDate.value);
  }
}
