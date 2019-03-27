import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitsPage } from './hits.page';

describe('HitsPage', () => {
  let component: HitsPage;
  let fixture: ComponentFixture<HitsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
