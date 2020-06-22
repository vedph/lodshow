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
      uri: 'http://dbpedia.org/resource/Marco_Polo',
      label: 'Marco Polo',
    });
    persons.push({
      uri: 'http://dbpedia.org/resource/Kublai_Khan',
      label: 'Kublai Khan',
    });
    this.personJson = JSON.stringify(persons);

    const places: RealiaListEntry[] = [];
    places.push({
      uri: 'http://dbpedia.org/resource/Kingdom_of_Armenia_(antiquity)',
      label: 'Great Armenia',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Shangdu',
      label: 'Shangdu',
    });
    places.push({
      uri: 'http://dbpedia.org/resource/Venice',
      label: 'Venice',
    });
    this.placeJson = JSON.stringify(places);
  }
}
