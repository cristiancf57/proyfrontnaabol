import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMantDetalleComponent } from './list-mant-detalle.component';

describe('ListMantDetalleComponent', () => {
  let component: ListMantDetalleComponent;
  let fixture: ComponentFixture<ListMantDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMantDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMantDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
