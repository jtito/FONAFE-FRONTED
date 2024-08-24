import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizEventoPerdidaComponent} from './matriz-evento-perdida.component';

describe('MatrizEventoPerdidaComponent', () => {
  let component: MatrizEventoPerdidaComponent;
  let fixture: ComponentFixture<MatrizEventoPerdidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizEventoPerdidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizEventoPerdidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
