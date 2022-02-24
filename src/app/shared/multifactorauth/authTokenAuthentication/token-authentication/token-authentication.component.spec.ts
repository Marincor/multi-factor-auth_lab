import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenAuthenticationComponent } from './token-authentication.component';

describe('TokenAuthenticationComponent', () => {
  let component: TokenAuthenticationComponent;
  let fixture: ComponentFixture<TokenAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenAuthenticationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
