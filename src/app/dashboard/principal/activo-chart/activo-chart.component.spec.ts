import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoChartComponent } from './activo-chart.component';

describe('ActivoChartComponent', () => {
  let component: ActivoChartComponent;
  let fixture: ComponentFixture<ActivoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivoChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
