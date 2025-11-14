import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAgentsComponent } from './page-agents.component';

describe('PageAgentsComponent', () => {
  let component: PageAgentsComponent;
  let fixture: ComponentFixture<PageAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAgentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
