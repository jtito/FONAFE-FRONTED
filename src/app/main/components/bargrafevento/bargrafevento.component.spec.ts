import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarGrafEventoComponent } from './bargrafevento.component';


describe('BarGrafEventoComponent', () => {
  let component: BarGrafEventoComponent;
  let fixture: ComponentFixture<BarGrafEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarGrafEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarGrafEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
