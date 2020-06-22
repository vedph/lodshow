import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RealiaListEntry } from 'src/app/models';
import { PlaceInfo, PlaceService } from 'src/app/services/place.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { RealiaService, MapMarkerInfo } from 'src/app/services/realia.service';
import { MapMarker, GoogleMap } from '@angular/google-maps';

interface CheckableRealiaListEntry extends RealiaListEntry {
  checked?: boolean;
}

// https://medium.com/angular-in-depth/google-maps-is-now-an-angular-component-821ec61d2a0

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css'],
})
export class PlaceListComponent implements OnInit {
  private _marker: MapMarkerInfo;
  private _entries: CheckableRealiaListEntry[];

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  @Input()
  public get entries(): CheckableRealiaListEntry[] {
    return this._entries;
  }
  public set entries(value: CheckableRealiaListEntry[]) {
    this._entries = value;
    this.updateEntriesForm();
  }

  public selectedEntry: RealiaListEntry;
  public infoExpanded: boolean;
  public lastQuery: string;
  public info: PlaceInfo;

  public entriesCtl: FormArray;
  public entriesForm: FormGroup;

  public languages: string[];
  public language: FormControl;
  public abstractForm: FormGroup;
  public selectedAbstract: string;

  public markers: MapMarker[];
  public busy: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _placeService: PlaceService,
    private _realiaService: RealiaService
  ) {
    // entries form
    this.entriesCtl = _formBuilder.array([]);
    this.entriesForm = _formBuilder.group({
      entriesCtl: this.entriesCtl,
    });
    // abstract form
    this.language = _formBuilder.control(null);
    this.abstractForm = _formBuilder.group({
      language: this.language,
    });

    this.markers = [];
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

  private getEntryGroup(entry?: CheckableRealiaListEntry): FormGroup {
    return this._formBuilder.group({
      checked: this._formBuilder.control(entry?.checked === true),
    });
  }

  private updateEntriesForm() {
    this.entriesForm.reset();
    this.selectedAbstract = null;
    this.languages = [];
    if (!this._entries) {
      return;
    }
    for (const entry of this._entries) {
      this.entriesCtl.push(this.getEntryGroup(entry));
    }
  }

  public selectEntry(index: number) {
    const entry = this._entries[index];

    this.selectedEntry = entry;
    if (this.info?.uri === entry.uri) {
      this.infoExpanded = true;
      this._marker = null;
      return;
    }

    const id = this._realiaService.getIdFromUri(entry.uri);

    this.lastQuery = this._placeService.buildQuery(id);

    this.busy = true;
    this._placeService.getInfo(id).subscribe(
      (i) => {
        this.busy = false;
        this.info = i;
        this.languages = this._realiaService.getLanguages(i.abstracts);
        this.selectedAbstract = null;
        this.infoExpanded = true;
        if (this.languages.length) {
          if (this.languages.find((l) => l === 'en')) {
            this.language.setValue('en');
          } else {
            this.language.setValue(this.languages[0]);
          }
        }
        (this.entriesCtl.at(index) as FormGroup).controls.checked.setValue(
          true
        );

        // markers
        if (this.info.latd) {
          this._marker = this._realiaService.getMapMarkerInfo(
            entry.label,
            +this.info.latd.value,
            +this.info.latm.value,
            this.info.latns.value,
            +this.info.longd.value,
            +this.info.longm.value,
            this.info.longew.value
          );
          if (this._marker) {
            this.markers = [this._marker as MapMarker];

            // TODO: add other markers
            // const bounds = new google.maps.LatLngBounds();
            // for (const marker of this.markers) {
            //   bounds.extend(marker.getPosition());
            // }
            // this.map.fitBounds(bounds);
          }

          setTimeout(() => {
            this.map.zoom = 12;
            this.map.center = {
              lat: this._marker.position.lat,
              lng: this._marker.position.lng,
            };
          }, 1000);
        }
      },
      (error) => {
        this.busy = false;
        console.error('Error querying for ' + entry.uri);
        console.error(error);
      }
    );
  }

  public getIdFromUri(uri: string): string {
    return this._realiaService.getIdFromUri(uri);
  }
}
