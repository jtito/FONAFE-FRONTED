import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieGrafFraudeComponent } from './piegraffraude.component';

describe('PieGrafFraudeComponent', () => {
  let component: PieGrafFraudeComponent;
  let fixture: ComponentFixture<PieGrafFraudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGrafFraudeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGrafFraudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
