import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantMediaComponent } from './participant-media.component';

describe('ParticipantMediaComponent', () => {
  let component: ParticipantMediaComponent;
  let fixture: ComponentFixture<ParticipantMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
