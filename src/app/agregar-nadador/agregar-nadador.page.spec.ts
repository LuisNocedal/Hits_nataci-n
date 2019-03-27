import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarNadadorPage } from './agregar-nadador.page';

describe('AgregarNadadorPage', () => {
  let component: AgregarNadadorPage;
  let fixture: ComponentFixture<AgregarNadadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarNadadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarNadadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
