import { Component } from '@angular/core';
import { RealiaListEntry } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public personJson: string;
  public placeJson: string;

  constructor() {
    const persons: RealiaListEntry[] = [];
    persons.push({
      uri: 'http://dbpedia.org/resource/Adam',
      label: 'Adam',
    });
    persons.push({
      uri: 'http://dbpedia.org/resource/Jesus',
      label: 'Jesus Christ',
    });
    persons.push({
      uri: 'http://dbpedia.org/resource/Marco_Polo',
      label: 'Marco Polo',
    });
    persons.push({
      uri: 'http://dbpedia.org/resource/Kublai_Khan',
      label: 'Kublai Khan',
    });
    persons.push({
      uri: 'http://dbpedia.org/resource/Niccolò_Polo',
      label: 'Niccolò Polo',
    });
    this.personJson = JSON.stringify(persons);

    const places: RealiaListEntry[] = [];
    places.push({
      uri: 'http://dbpedia.org/resource/Constantinople',
      label: 'Constantinople',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Kingdom_of_Armenia_(antiquity)',
      label: 'Great Armenia',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/India',
      label: 'India',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Persian_Empire',
      label: 'Persian Empire',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Shangdu',
      label: 'Shangdu',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Sudak',
      label: 'Sudak',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Venice',
      label: 'Venice',
    });
    this.placeJson = JSON.stringify(places);
  }
}
