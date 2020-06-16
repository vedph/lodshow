import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealiaListComponent } from './realia-list.component';

describe('RealiaListComponent', () => {
  let component: RealiaListComponent;
  let fixture: ComponentFixture<RealiaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealiaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
