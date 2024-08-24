import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieGrafEventoComponent } from './piegrafevento.component';

describe('PieGrafEventoComponent', () => {
  let component: PieGrafEventoComponent;
  let fixture: ComponentFixture<PieGrafEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGrafEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGrafEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
