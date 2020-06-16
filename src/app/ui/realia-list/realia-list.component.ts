import { Component, OnInit, Input } from '@angular/core';
import { RealiaListEntry } from 'src/app/models';

@Component({
  selector: 'app-realia-list',
  templateUrl: './realia-list.component.html',
  styleUrls: ['./realia-list.component.css']
})
export class RealiaListComponent implements OnInit {
  public entries: RealiaListEntry[];

  @Input()
  public type: string;

  @Input()
  public title: string;

  @Input()
  public set jsonList(value: string) {
    if (!value) {
      this.entries = [];
    } else {
      this.entries = JSON.parse(value);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
