import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieGrafAnticorrupcionComponent } from './piegrafanticorrupcion.component';

describe('PieGrafAnticorrupcionComponent', () => {
  let component: PieGrafAnticorrupcionComponent;
  let fixture: ComponentFixture<PieGrafAnticorrupcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGrafAnticorrupcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGrafAnticorrupcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
