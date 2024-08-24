import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizRiesgoOperacionalComponent } from './matriz-riesgo-operacional.component';

describe('MatrizRiesgoOperacionalComponent', () => {
  let component: MatrizRiesgoOperacionalComponent;
  let fixture: ComponentFixture<MatrizRiesgoOperacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizRiesgoOperacionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizRiesgoOperacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
