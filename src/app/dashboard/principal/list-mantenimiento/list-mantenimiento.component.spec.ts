import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMantenimientoComponent } from './list-mantenimiento.component';

describe('ListMantenimientoComponent', () => {
  let component: ListMantenimientoComponent;
  let fixture: ComponentFixture<ListMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
