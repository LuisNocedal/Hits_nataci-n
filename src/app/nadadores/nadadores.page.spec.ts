import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NadadoresPage } from './nadadores.page';

describe('NadadoresPage', () => {
  let component: NadadoresPage;
  let fixture: ComponentFixture<NadadoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NadadoresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NadadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
