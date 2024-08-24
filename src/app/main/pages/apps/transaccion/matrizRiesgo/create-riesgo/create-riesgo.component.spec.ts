import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRiesgoComponent } from './create-riesgo.component';

describe('CreateRiesgoComponent', () => {
  let component: CreateRiesgoComponent;
  let fixture: ComponentFixture<CreateRiesgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRiesgoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
