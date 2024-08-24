import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarGrafComponent } from './bargraf.component';


describe('PieGrafComponent', () => {
  let component: BarGrafComponent;
  let fixture: ComponentFixture<BarGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarGrafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
