import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieGrafContinuidadComponent } from './piegrafcontinuidad.component';

describe('PieGrafContinuidadComponent', () => {
  let component: PieGrafContinuidadComponent;
  let fixture: ComponentFixture<PieGrafContinuidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGrafContinuidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGrafContinuidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
