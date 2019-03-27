import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMarcadorPage } from './vista-marcador.page';

describe('VistaMarcadorPage', () => {
  let component: VistaMarcadorPage;
  let fixture: ComponentFixture<VistaMarcadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaMarcadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaMarcadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
