import { TestBed } from '@angular/core/testing';

import { NotifyServiceService } from './notify-service.service';

describe('NotifyServiceService', () => {
  let service: NotifyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
