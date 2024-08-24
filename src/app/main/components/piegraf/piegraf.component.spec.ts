import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieGrafComponent } from './piegraf.component';

describe('PieGrafComponent', () => {
  let component: PieGrafComponent;
  let fixture: ComponentFixture<PieGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGrafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
