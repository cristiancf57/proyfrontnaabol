import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorActivoComponent } from './buscador-activo.component';

describe('BuscadorActivoComponent', () => {
  let component: BuscadorActivoComponent;
  let fixture: ComponentFixture<BuscadorActivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscadorActivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
