import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GaugeGrafComponent } from './gaugegraf.component'

describe('GaugeChartComponent', () => {
  let component: GaugeGrafComponent
  let fixture: ComponentFixture<GaugeGrafComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GaugeGrafComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeGrafComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
