import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMovimientosComponent } from './list-movimientos.component';

describe('ListMovimientosComponent', () => {
  let component: ListMovimientosComponent;
  let fixture: ComponentFixture<ListMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
