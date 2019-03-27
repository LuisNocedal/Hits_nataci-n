import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaHitsPage } from './vista-hits.page';

describe('VistaHitsPage', () => {
  let component: VistaHitsPage;
  let fixture: ComponentFixture<VistaHitsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaHitsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaHitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
