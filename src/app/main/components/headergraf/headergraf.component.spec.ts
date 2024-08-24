import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGrafComponent } from './headergraf.component';

describe('HeaderGrafComponent', () => {
  let component: HeaderGrafComponent;
  let fixture: ComponentFixture<HeaderGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderGrafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
