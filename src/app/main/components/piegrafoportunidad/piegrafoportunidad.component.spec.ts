import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieGrafOportunidadComponent } from './piegrafoportunidad.component';

describe('PieGrafOportunidadComponent', () => {
  let component: PieGrafOportunidadComponent;
  let fixture: ComponentFixture<PieGrafOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGrafOportunidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieGrafOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
