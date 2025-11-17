import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorqrComponent } from './lectorqr.component';

describe('LectorqrComponent', () => {
  let component: LectorqrComponent;
  let fixture: ComponentFixture<LectorqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LectorqrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectorqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
