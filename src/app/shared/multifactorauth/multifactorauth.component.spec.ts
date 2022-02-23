import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifactorauthComponent } from './multifactorauth.component';

describe('MultifactorauthComponent', () => {
  let component: MultifactorauthComponent;
  let fixture: ComponentFixture<MultifactorauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultifactorauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifactorauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
