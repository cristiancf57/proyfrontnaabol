import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActivoComponent } from './form-activo.component';

describe('FormActivoComponent', () => {
  let component: FormActivoComponent;
  let fixture: ComponentFixture<FormActivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormActivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
