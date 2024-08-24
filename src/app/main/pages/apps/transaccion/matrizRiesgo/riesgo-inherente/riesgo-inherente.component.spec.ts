import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgoInherenteComponent } from './riesgo-inherente.component';

describe('RiesgoInherenteComponent', () => {
  let component: RiesgoInherenteComponent;
  let fixture: ComponentFixture<RiesgoInherenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiesgoInherenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgoInherenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
