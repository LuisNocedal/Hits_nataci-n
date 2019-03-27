import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcadoresPage } from './marcadores.page';

describe('MarcadoresPage', () => {
  let component: MarcadoresPage;
  let fixture: ComponentFixture<MarcadoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcadoresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
