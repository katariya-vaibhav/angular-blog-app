import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserProfile } from './other-user-profile';

describe('OtherUserProfile', () => {
  let component: OtherUserProfile;
  let fixture: ComponentFixture<OtherUserProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherUserProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherUserProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
