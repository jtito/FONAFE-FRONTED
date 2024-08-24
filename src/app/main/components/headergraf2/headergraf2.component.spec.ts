import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGraf2Component } from './headergraf2.component';

describe('HeaderGrafComponent', () => {
  let component: HeaderGraf2Component;
  let fixture: ComponentFixture<HeaderGraf2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderGraf2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderGraf2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
