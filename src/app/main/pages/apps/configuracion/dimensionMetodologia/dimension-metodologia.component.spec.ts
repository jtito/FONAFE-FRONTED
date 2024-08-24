import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionMetodologiaComponent } from './dimension-metodologia.component';

describe('FormDimensionMetodologiaComponent', () => {
  let component: DimensionMetodologiaComponent;
  let fixture: ComponentFixture<DimensionMetodologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensionMetodologiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionMetodologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
