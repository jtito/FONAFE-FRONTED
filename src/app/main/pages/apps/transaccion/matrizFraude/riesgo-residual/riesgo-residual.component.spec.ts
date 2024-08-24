import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgoResidualComponent } from './riesgo-residual.component';

describe('RiesgoResidualComponent', () => {
  let component: RiesgoResidualComponent;
  let fixture: ComponentFixture<RiesgoResidualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiesgoResidualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgoResidualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
