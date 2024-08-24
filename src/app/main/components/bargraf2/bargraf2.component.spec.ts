import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarGraf2Component } from './bargraf2.component';


describe('PieGrafComponent', () => {
  let component: BarGraf2Component;
  let fixture: ComponentFixture<BarGraf2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarGraf2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarGraf2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
