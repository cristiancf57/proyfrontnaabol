import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafficChartComponent } from './graffic-chart.component';

describe('GrafficChartComponent', () => {
  let component: GrafficChartComponent;
  let fixture: ComponentFixture<GrafficChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrafficChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafficChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
